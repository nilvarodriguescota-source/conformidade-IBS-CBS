/**
 * Versão web (site publicado): as chamadas da página para /api/... vão para o Web Worker que roda o
 * sistema no próprio navegador, em vez de irem para um servidor.
 *
 * Também faz as duas conferências da assinatura, com a conta do Supabase (site/servicos/sistema.ts):
 *  - só abre o sistema para quem está logado e tem assinatura liberada;
 *  - antes de "Processar análise", conta as notas no limite de XMLs por mês do plano.
 */
import { conferirLimiteDeXmls, destinoSemAcesso } from "../site/servicos/sistema";

/* ---------------- Acesso: a página fica escondida até a conta ser conferida ---------------- */

document.documentElement.style.visibility = "hidden";

function semConexao(): void {
  const mostrar = () => {
    document.body.innerHTML =
      '<main style="max-width:520px;margin:15vh auto;padding:0 20px;font:16px/1.6 system-ui,sans-serif;color:#1B2B21">' +
      "<h1 style=\"font-size:22px\">Não foi possível conferir sua assinatura</h1>" +
      "<p>Confira sua conexão com a internet e recarregue a página. Se continuar, entre de novo pela <a href=\"conta.html\">área do cliente</a>.</p></main>";
    document.documentElement.style.visibility = "";
  };
  if (document.body) mostrar();
  else addEventListener("DOMContentLoaded", mostrar);
}

destinoSemAcesso()
  .then((destino) => {
    if (!destino) {
      document.documentElement.style.visibility = "";
      return;
    }
    // Dentro da área do cliente (iframe), quem muda de página é a janela de cima
    const janela = window.top && window.top !== window ? window.top : window;
    janela.location.replace(new URL(destino, location.href).href);
  })
  .catch((e) => {
    console.error("Não foi possível conferir a assinatura:", e);
    semConexao();
  });

/* ---------------- Ponte com o Web Worker ---------------- */

const worker = new Worker(new URL("worker.js", document.baseURI));
const pendentes = new Map<number, (r: Response) => void>();
let proximo = 1;

worker.onmessage = (e: MessageEvent<{ id: number; status: number; corpo: string; tipo: string }>) => {
  const { id, status, corpo, tipo } = e.data;
  pendentes.get(id)?.(new Response(corpo, { status, headers: { "Content-Type": tipo } }));
  pendentes.delete(id);
};

worker.onerror = (e) => console.error("Erro no processamento local:", e.message);

// Pede ao navegador para não apagar a análise salva quando faltar espaço
navigator.storage?.persist?.().catch(() => undefined);

const fetchOriginal = window.fetch.bind(window);

interface ArquivoEnviado {
  campo: string;
  nome: string;
  dados: ArrayBuffer;
}

async function lerCorpo(corpo: BodyInit | null | undefined) {
  const arquivos: ArquivoEnviado[] = [];
  if (corpo instanceof FormData) {
    const campos: Record<string, string> = {};
    for (const [campo, valor] of corpo.entries()) {
      if (typeof valor === "string") campos[campo] = valor;
      else arquivos.push({ campo, nome: valor.name, dados: await valor.arrayBuffer() });
    }
    return { corpo: campos, arquivos };
  }
  if (typeof corpo === "string") {
    try {
      return { corpo: JSON.parse(corpo) as unknown, arquivos };
    } catch {
      return { corpo, arquivos };
    }
  }
  return { corpo: undefined, arquivos };
}

function pedirAoWorker(metodo: string, caminho: string, query: Record<string, string>, corpo: unknown, arquivos: ArquivoEnviado[]): Promise<Response> {
  const id = proximo++;
  return new Promise<Response>((resolve) => {
    pendentes.set(id, resolve);
    worker.postMessage({ id, metodo, caminho, query, corpo, arquivos }, arquivos.map((a) => a.dados));
  });
}

function json(status: number, corpo: Record<string, unknown>): Response {
  return new Response(JSON.stringify(corpo), { status, headers: { "Content-Type": "application/json; charset=utf-8" } });
}

/** Limite do plano: conta as notas da análise no mês antes de processar. Devolve a recusa, ou null para seguir. */
async function recusaPorLimite(): Promise<Response | null> {
  const lista = await pedirAoWorker("GET", "/api/notas-da-analise", {}, undefined, []);
  if (!lista.ok) return lista;
  const { notas } = (await lista.json()) as { notas: string[] };
  try {
    const mensagem = await conferirLimiteDeXmls(notas);
    return mensagem ? json(403, { erro: mensagem }) : null;
  } catch (e) {
    return json(503, { erro: e instanceof Error ? e.message : "Não foi possível conferir o limite de XMLs do seu plano agora." });
  }
}

window.fetch = async (entrada: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = new URL(entrada instanceof Request ? entrada.url : String(entrada), location.href);
  if (url.origin !== location.origin || !url.pathname.startsWith("/api/")) return fetchOriginal(entrada, init);
  const metodo = (init?.method ?? (entrada instanceof Request ? entrada.method : "GET")).toUpperCase();
  const { corpo, arquivos } = await lerCorpo(init?.body);
  if (metodo === "POST" && url.pathname === "/api/processar") {
    const recusa = await recusaPorLimite();
    if (recusa) return recusa;
  }
  return pedirAoWorker(metodo, url.pathname, Object.fromEntries(url.searchParams), corpo, arquivos);
};
