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

interface Pendente { caminho: string; desde: number; responder: (r: Response) => void }

const pendentes = new Map<number, Pendente>();
let proximo = 1;
/** Última resposta do worker (ou início da espera): base do vigia abaixo. */
let ultimaAtividade = Date.now();
let worker = criarWorker(false);

function json(status: number, corpo: Record<string, unknown>): Response {
  return new Response(JSON.stringify(corpo), { status, headers: { "Content-Type": "application/json; charset=utf-8" } });
}

/** Responde a todos os pedidos que estavam esperando o worker (que foi encerrado ou falhou). */
function responderPendentes(resposta: () => Response): void {
  const esperando = [...pendentes.values()];
  pendentes.clear();
  for (const p of esperando) p.responder(resposta());
}

/** `limpar`: o worker começa apagando o que está guardado no navegador, sem ler a análise anterior. */
function criarWorker(limpar: boolean): Worker {
  const w = new Worker(new URL("worker.js" + (limpar ? "#limpar" : ""), document.baseURI));
  ultimaAtividade = Date.now();
  w.onmessage = (e: MessageEvent<{ id: number; status: number; corpo: string; tipo: string }>) => {
    if (w !== worker) return;
    ultimaAtividade = Date.now();
    const { id, status, corpo, tipo } = e.data;
    pendentes.get(id)?.responder(new Response(corpo, { status, headers: { "Content-Type": tipo } }));
    pendentes.delete(id);
  };
  // Falha do worker (por exemplo, falta de memória): quem esperava recebe o erro, em vez de ficar carregando
  // para sempre, e o próximo pedido usa um worker novo, com a análise que está guardada no navegador.
  w.onerror = (e) => {
    console.error("Erro no processamento local:", e.message);
    if (w !== worker) return;
    w.terminate();
    worker = criarWorker(false);
    responderPendentes(() => json(500, {
      erro: "O processamento no navegador foi interrompido por um erro.",
      detalhe: "O processamento no navegador foi interrompido por um erro" + (e.message ? ` (${e.message})` : "") + ". Tente de novo; se continuar, clique em \"Nova análise\" e envie os XMLs novamente.",
    }));
  };
  return w;
}

/**
 * Nova análise com o worker ocupado (processando, ou sem responder): encerra o worker, o que interrompe o
 * processamento e libera a memória dele, avisa quem esperava e abre um worker novo, que começa do zero.
 */
function interromperProcessamento(): void {
  worker.terminate();
  worker = criarWorker(true);
  responderPendentes(() => json(409, { erro: "Processamento interrompido pela nova análise.", interrompido: true }));
}

/**
 * Vigia do worker. Se ele morre sem avisar (o navegador encerra o worker por falta de memória sem disparar
 * erro) ou trava, os pedidos ficariam esperando para sempre e a tela, em "Carregando...". Se o worker passa
 * tempo demais sem responder nada, ele é encerrado e recriado (com a análise guardada no navegador) e quem
 * esperava recebe um erro explicando o que fazer.
 */
const SEM_RESPOSTA_MAXIMO_MS = 3 * 60 * 1000;
/** Processar e reprocessar (validação, atividade) 10.000 notas leva perto de 1 minuto; a margem é larga. */
const SEM_RESPOSTA_PROCESSANDO_MS = 20 * 60 * 1000;
const PROCESSAMENTOS = new Set(["/api/processar", "/api/validar", "/api/atividade"]);
setInterval(() => {
  if (!pendentes.size) {
    ultimaAtividade = Date.now();
    return;
  }
  const processando = [...pendentes.values()].some((p) => PROCESSAMENTOS.has(p.caminho));
  // Os testes automáticos reduzem o tempo de espera (scripts/teste_volume_navegador.mjs)
  const limiteDeTeste = (globalThis as { __vigiaDoWorkerMs?: number }).__vigiaDoWorkerMs;
  const limite = limiteDeTeste ?? (processando ? SEM_RESPOSTA_PROCESSANDO_MS : SEM_RESPOSTA_MAXIMO_MS);
  if (Date.now() - ultimaAtividade < limite) return;
  const minutos = Math.max(1, Math.round(limite / 60000));
  console.error(`O processamento no navegador não respondeu em ${minutos} minuto(s); reiniciando.`);
  worker.terminate();
  worker = criarWorker(false);
  responderPendentes(() => json(504, {
    erro: "O processamento no navegador parou de responder.",
    detalhe: `O processamento no navegador parou de responder por ${minutos} minuto(s) e foi reiniciado. ` +
      "Isso costuma acontecer quando falta memória no computador: feche outras abas e programas e tente de novo. " +
      "Se continuar, clique em \"Nova análise\" e envie os XMLs novamente.",
  }));
}, 1000);

// Pede ao navegador para não apagar a análise salva quando faltar espaço
navigator.storage?.persist?.().catch(() => undefined);

const fetchOriginal = window.fetch.bind(window);

interface ArquivoEnviado {
  campo: string;
  nome: string;
  dados: ArrayBuffer;
}

const LEITURAS_SIMULTANEAS = 32;

async function lerCorpo(corpo: BodyInit | null | undefined) {
  const arquivos: ArquivoEnviado[] = [];
  if (corpo instanceof FormData) {
    const campos: Record<string, string> = {};
    const lidos: Promise<ArquivoEnviado>[] = [];
    // Leitura em paralelo: lidos um a um, milhares de arquivos levam minutos (cada leitura passa pelo disco
    // e, no Windows, costuma passar também pelo antivírus)
    let emLeitura = 0;
    const fila: (() => void)[] = [];
    const vaga = () => (emLeitura < LEITURAS_SIMULTANEAS ? Promise.resolve() : new Promise<void>((r) => fila.push(r)));
    for (const [campo, valor] of corpo.entries()) {
      if (typeof valor === "string") {
        campos[campo] = valor;
        continue;
      }
      await vaga();
      emLeitura++;
      lidos.push(valor.arrayBuffer().then(
        (dados) => ({ campo, nome: valor.name, dados }),
      ).finally(() => {
        emLeitura--;
        fila.shift()?.();
      }));
    }
    arquivos.push(...(await Promise.all(lidos)));
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
    if (!pendentes.size) ultimaAtividade = Date.now();
    pendentes.set(id, { caminho, desde: Date.now(), responder: resolve });
    worker.postMessage({ id, metodo, caminho, query, corpo, arquivos }, arquivos.map((a) => a.dados));
  });
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

/** Pedidos que podem demorar: uma nova análise pedida durante um deles interrompe o worker. */
const CAMINHOS_DEMORADOS = new Set(["/api/importar", "/api/processar", "/api/validar", "/api/atividade", "/api/notas-da-analise"]);
/** Muda a cada nova análise que interrompe o worker; pedidos demorados de antes dela são descartados. */
let geracao = 0;
/** Uma leitura da tela leva poucos segundos mesmo com 10.000 notas; mais que isso, o worker travou. */
const ESPERA_MAXIMA_DE_LEITURA_MS = 30000;
let operacoesEmPreparo = 0;

window.fetch = async (entrada: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = new URL(entrada instanceof Request ? entrada.url : String(entrada), location.href);
  if (url.origin !== location.origin || !url.pathname.startsWith("/api/")) return fetchOriginal(entrada, init);
  const metodo = (init?.method ?? (entrada instanceof Request ? entrada.method : "GET")).toUpperCase();
  if (metodo === "POST" && url.pathname === "/api/nova-analise") {
    // Pedidos de leitura da tela terminam sozinhos; envio de XMLs e processamento são interrompidos,
    // assim como um worker que deixou de responder (leitura esperando há muito tempo)
    const agora = Date.now();
    if ([...pendentes.values()].some((p) => CAMINHOS_DEMORADOS.has(p.caminho) || agora - p.desde > ESPERA_MAXIMA_DE_LEITURA_MS) || operacoesEmPreparo > 0) {
      geracao++;
      interromperProcessamento();
    }
    return pedirAoWorker(metodo, url.pathname, {}, undefined, []);
  }
  if (!CAMINHOS_DEMORADOS.has(url.pathname)) {
    const { corpo, arquivos } = await lerCorpo(init?.body);
    return pedirAoWorker(metodo, url.pathname, Object.fromEntries(url.searchParams), corpo, arquivos);
  }
  // Envio de XMLs, processamento e validação: se uma nova análise começar enquanto o pedido é preparado
  // (leitura dos arquivos, conferência do limite do plano), ele não chega ao worker novo.
  const minhaGeracao = geracao;
  const interrompido = () => json(409, { erro: "Processamento interrompido pela nova análise.", interrompido: true });
  operacoesEmPreparo++;
  let corpo: unknown, arquivos: ArquivoEnviado[];
  try {
    ({ corpo, arquivos } = await lerCorpo(init?.body));
    if (metodo === "POST" && url.pathname === "/api/processar" && minhaGeracao === geracao) {
      const recusa = await recusaPorLimite();
      if (recusa) return minhaGeracao === geracao ? recusa : interrompido();
    }
  } finally {
    operacoesEmPreparo--;
  }
  if (minhaGeracao !== geracao) return interrompido();
  return pedirAoWorker(metodo, url.pathname, Object.fromEntries(url.searchParams), corpo, arquivos);
};
