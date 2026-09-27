/** Registro das rotas do servidor.ts e execução delas dentro do worker (sem rede). */
type Handler = (req: any, res: any, next: (e?: unknown) => void) => unknown;
interface Rota { metodo: string; caminho: string; handlers: Handler[] }

export interface Resposta { status: number; corpo: string; tipo: string }

const rotas: Rota[] = [];

function express() {
  return {
    use: (..._a: unknown[]) => undefined,
    get: (caminho: string, ...handlers: Handler[]) => void rotas.push({ metodo: "GET", caminho, handlers }),
    post: (caminho: string, ...handlers: Handler[]) => void rotas.push({ metodo: "POST", caminho, handlers }),
    listen: (_porta: unknown, pronto?: () => void) => pronto?.(),
  };
}
express.json = () => (_req: unknown, _res: unknown, next: () => void) => next();
express.static = (_pasta: string) => (_req: unknown, _res: unknown, next: () => void) => next();

const json = (status: number, o: unknown): Resposta => ({ status, corpo: JSON.stringify(o), tipo: "application/json; charset=utf-8" });

export function despachar(metodo: string, caminho: string, query: Record<string, string>, corpo: unknown, arquivos: unknown[]): Promise<Resposta> {
  const rota = rotas.find((r) => r.metodo === metodo && r.caminho === caminho);
  if (!rota) return Promise.resolve(json(404, { erro: `Rota não encontrada: ${metodo} ${caminho}` }));
  return new Promise<Resposta>((resolve) => {
    const falha = (e: unknown) => {
      console.error(e);
      resolve(json(500, { erro: "Erro interno.", detalhe: e instanceof Error ? e.message : String(e) }));
    };
    const res = {
      statusCode: 200,
      status(c: number) { res.statusCode = c; return res; },
      set() { return res; },
      setHeader() { return res; },
      json(o: unknown) { resolve(json(res.statusCode, o)); return res; },
      send(x: unknown) {
        resolve(typeof x === "string"
          ? { status: res.statusCode, corpo: x, tipo: "text/html; charset=utf-8" }
          : json(res.statusCode, x));
        return res;
      },
    };
    const req = { method: metodo, path: caminho, query, body: corpo ?? {}, headers: {}, __arquivos: arquivos };
    let i = 0;
    const next = (e?: unknown): void => {
      if (e) return falha(e);
      const h = rota.handlers[i++];
      if (!h) return;
      try {
        const r = h(req, res, next) as Promise<unknown> | undefined;
        if (r && typeof r.then === "function") r.then(undefined, falha);
      } catch (erro) {
        falha(erro);
      }
    };
    next();
  });
}

export default express;
