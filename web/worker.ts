/**
 * Web Worker: executa as rotas do servidor.ts sobre o sistema de arquivos em memória (vfs)
 * e guarda a análise no IndexedDB do navegador. A página conversa com ele pelo navegador.ts.
 */
import * as vfs from "./vfs";
import { despachar, type Resposta } from "./shims/express";
import type { ArquivoRecebido } from "./shims/multer";

declare const self: DedicatedWorkerGlobalScope;

const BANCO = "conformidade-ibs-cbs";
const TABELA = "arquivos";

function abrirBanco(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    try {
      const pedido = indexedDB.open(BANCO, 1);
      pedido.onupgradeneeded = () => pedido.result.createObjectStore(TABELA);
      pedido.onsuccess = () => resolve(pedido.result);
      pedido.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

function concluida(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
}

async function restaurar(banco: IDBDatabase): Promise<void> {
  const tx = banco.transaction(TABELA, "readonly");
  const tabela = tx.objectStore(TABELA);
  await new Promise<void>((resolve, reject) => {
    const cursor = tabela.openCursor();
    cursor.onsuccess = () => {
      const c = cursor.result;
      if (!c) return resolve();
      vfs.restaurar(String(c.key), c.value as vfs.Persistido);
      c.continue();
    };
    cursor.onerror = () => reject(cursor.error);
  });
}

async function salvar(banco: IDBDatabase | null): Promise<void> {
  const alteracoes = vfs.retirarAlteracoes();
  if (!banco || !alteracoes.length) return;
  const tx = banco.transaction(TABELA, "readwrite");
  const tabela = tx.objectStore(TABELA);
  for (const [caminho, valor] of alteracoes) {
    if (valor) tabela.put(valor, caminho);
    else tabela.delete(caminho);
  }
  try {
    await concluida(tx);
  } catch (e) {
    console.error("Não foi possível salvar a análise no navegador:", e);
  }
}

async function carregarEstaticos(): Promise<void> {
  const base = new URL("dados/", self.location.href);
  const lista = (await (await fetch(new URL("manifesto.json", base))).json()) as string[];
  await Promise.all(lista.map(async (rel) => {
    const r = await fetch(new URL(rel, base));
    if (!r.ok) throw new Error(`Falha ao baixar ${rel}: HTTP ${r.status}`);
    vfs.gravarEstatico("/app/" + rel, new Uint8Array(await r.arrayBuffer()));
  }));
}

const inicio = (async () => {
  const banco = await abrirBanco();
  if (banco) await restaurar(banco);
  await carregarEstaticos();
  await import("../src/servidor");
  await salvar(banco);
  return banco;
})();

interface Pedido { id: number; metodo: string; caminho: string; query: Record<string, string>; corpo: unknown; arquivos: ArquivoRecebido[] }

// Um pedido por vez: as rotas leem e gravam os mesmos arquivos.
let fila: Promise<unknown> = Promise.resolve();

self.onmessage = (e: MessageEvent<Pedido>) => {
  const p = e.data;
  fila = fila.then(async () => {
    let resposta: Resposta;
    try {
      const banco = await inicio;
      resposta = await despachar(p.metodo, p.caminho, p.query, p.corpo, p.arquivos);
      await salvar(banco);
    } catch (erro) {
      console.error(erro);
      resposta = {
        status: 500,
        corpo: JSON.stringify({ erro: "Falha ao iniciar o sistema no navegador.", detalhe: erro instanceof Error ? erro.message : String(erro) }),
        tipo: "application/json; charset=utf-8",
      };
    }
    self.postMessage({ id: p.id, ...resposta });
  });
};
