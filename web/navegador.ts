/**
 * Versão web (Netlify): as chamadas da página para /api/... vão para o Web Worker que roda o
 * sistema no próprio navegador, em vez de irem para um servidor.
 */
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

async function lerCorpo(corpo: BodyInit | null | undefined) {
  const arquivos: { campo: string; nome: string; dados: ArrayBuffer }[] = [];
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

window.fetch = async (entrada: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
  const url = new URL(entrada instanceof Request ? entrada.url : String(entrada), location.href);
  if (url.origin !== location.origin || !url.pathname.startsWith("/api/")) return fetchOriginal(entrada, init);
  const metodo = (init?.method ?? (entrada instanceof Request ? entrada.method : "GET")).toUpperCase();
  const { corpo, arquivos } = await lerCorpo(init?.body);
  const id = proximo++;
  return new Promise<Response>((resolve) => {
    pendentes.set(id, resolve);
    worker.postMessage(
      { id, metodo, caminho: url.pathname, query: Object.fromEntries(url.searchParams), corpo, arquivos },
      arquivos.map((a) => a.dados),
    );
  });
};
