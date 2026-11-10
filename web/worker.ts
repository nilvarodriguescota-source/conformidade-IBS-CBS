/**
 * Web Worker: executa as rotas do servidor.ts sobre o sistema de arquivos em memória (vfs)
 * e guarda a análise no IndexedDB do navegador. A página conversa com ele pelo navegador.ts.
 *
 * Gravação no IndexedDB: em lotes pequenos (uma transação só com centenas de MB é abortada pelo
 * navegador) e com os arquivos grandes divididos em partes. O que não puder ser gravado volta para
 * a lista de alterações; a análise continua valendo na memória.
 */
import * as vfs from "./vfs";
import { despachar, type Resposta } from "./shims/express";
import type { ArquivoRecebido } from "./shims/multer";

declare const self: DedicatedWorkerGlobalScope;

const BANCO = "conformidade-ibs-cbs";
const TABELA = "arquivos";
/** Bytes por transação e por registro: bem abaixo do que o navegador aceita numa gravação. */
const BYTES_POR_LOTE = 24 * 1024 * 1024;
const OPERACOES_POR_LOTE = 2000;
const BYTES_POR_PARTE = 16 * 1024 * 1024;
/** Chave de cada parte de um arquivo grande: caminho + SEPARADOR + número da parte. */
const SEPARADOR = "\u0000";

/** Registro de um arquivo gravado em partes (as partes ficam nas chaves seguintes). */
interface EmPartes { tipo: "partes"; partes: number; tamanho: number; mtimeMs: number }
type Registro = vfs.Persistido | EmPartes | Uint8Array;

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
    tx.onabort = () => reject(tx.error ?? new Error("gravação interrompida pelo navegador"));
  });
}

/** Caminhos gravados em partes: ao regravar ou apagar um deles, as partes antigas saem junto. */
const emPartes = new Set<string>();

async function restaurar(banco: IDBDatabase): Promise<void> {
  const tx = banco.transaction(TABELA, "readonly");
  const tabela = tx.objectStore(TABELA);
  const incompletos = new Map<string, { registro: EmPartes; partes: Uint8Array[] }>();
  await new Promise<void>((resolve, reject) => {
    const cursor = tabela.openCursor();
    cursor.onsuccess = () => {
      const c = cursor.result;
      if (!c) return resolve();
      const chave = String(c.key);
      const valor = c.value as Registro;
      const corte = chave.indexOf(SEPARADOR);
      if (corte >= 0) {
        const dono = incompletos.get(chave.slice(0, corte));
        if (dono && valor instanceof Uint8Array) dono.partes[Number(chave.slice(corte + 1))] = valor;
      } else if (!(valor instanceof Uint8Array) && valor.tipo === "partes") {
        incompletos.set(chave, { registro: valor, partes: [] });
        emPartes.add(chave);
      } else if (!(valor instanceof Uint8Array)) {
        vfs.restaurar(chave, valor);
      }
      c.continue();
    };
    cursor.onerror = () => reject(cursor.error);
  });
  for (const [caminho, { registro, partes }] of incompletos) {
    const dados = new Uint8Array(registro.tamanho);
    let posicao = 0, completo = true;
    for (let i = 0; i < registro.partes; i++) {
      const parte = partes[i];
      if (!parte || posicao + parte.length > dados.length) { completo = false; break; }
      dados.set(parte, posicao);
      posicao += parte.length;
    }
    // Arquivo com parte faltando (gravação interrompida) não é restaurado
    if (completo && posicao === dados.length) vfs.restaurar(caminho, { tipo: "arq", dados, mtimeMs: registro.mtimeMs });
  }
}

const faixaDasPartes = (caminho: string) => IDBKeyRange.bound(caminho + SEPARADOR, caminho + SEPARADOR + "￿");

/** Grava as alterações do vfs. Devolve false se alguma parte não pôde ser gravada (fica para a próxima vez). */
async function salvar(banco: IDBDatabase | null): Promise<boolean> {
  // Pastas temporárias (ZIPs descompactados) só valem durante o pedido: não ficam na memória nem no navegador
  vfs.rmSync("/tmp", { recursive: true, force: true });
  const alteracoes = vfs.retirarAlteracoes();
  if (!banco || !alteracoes.length) return true;

  let feitas = 0;
  try {
    while (feitas < alteracoes.length) {
      const tx = banco.transaction(TABELA, "readwrite");
      const tabela = tx.objectStore(TABELA);
      const fim = concluida(tx);
      let bytes = 0, operacoes = 0, ate = feitas;
      try {
        while (ate < alteracoes.length && (ate === feitas || (bytes < BYTES_POR_LOTE && operacoes < OPERACOES_POR_LOTE))) {
          const [caminho, valor] = alteracoes[ate]!;
          if (emPartes.has(caminho)) tabela.delete(faixaDasPartes(caminho));
          if (!valor) {
            tabela.delete(caminho);
          } else if (valor.tipo === "arq" && valor.dados.length > BYTES_POR_PARTE) {
            // Arquivo grande: um lote só para ele, com uma parte por registro
            if (ate > feitas) break;
            const partes = Math.ceil(valor.dados.length / BYTES_POR_PARTE);
            tabela.delete(faixaDasPartes(caminho));
            tabela.put({ tipo: "partes", partes, tamanho: valor.dados.length, mtimeMs: valor.mtimeMs } satisfies EmPartes, caminho);
            for (let i = 0; i < partes; i++) {
              tabela.put(valor.dados.slice(i * BYTES_POR_PARTE, (i + 1) * BYTES_POR_PARTE), caminho + SEPARADOR + String(i));
            }
            ate++;
            break;
          } else {
            tabela.put(valor, caminho);
            bytes += valor.tipo === "arq" ? valor.dados.length : valor.tipo === "resumo" ? valor.cabeca.length : 0;
          }
          operacoes++;
          ate++;
        }
      } catch (e) {
        // A gravação falhou no meio do lote: desfaz o lote e espera o desfecho, para não sobrar erro solto
        try { tx.abort(); } catch { /* a transação já terminou */ }
        await fim.catch(() => undefined);
        throw e;
      }
      await fim;
      for (let i = feitas; i < ate; i++) {
        const [caminho, valor] = alteracoes[i]!;
        if (valor?.tipo === "arq" && valor.dados.length > BYTES_POR_PARTE) emPartes.add(caminho);
        else emPartes.delete(caminho);
      }
      feitas = ate;
    }
    return true;
  } catch (e) {
    console.error("Não foi possível salvar a análise no navegador:", e);
    vfs.marcarAlterados(alteracoes.slice(feitas).map(([caminho]) => caminho));
    return false;
  }
}

/** Apaga tudo o que está guardado no navegador e confere que não sobrou nada. */
async function esvaziarBanco(banco: IDBDatabase | null): Promise<void> {
  emPartes.clear();
  if (!banco) return;
  const tx = banco.transaction(TABELA, "readwrite");
  const tabela = tx.objectStore(TABELA);
  tabela.clear();
  const contagem = tabela.count();
  await concluida(tx);
  if (contagem.result !== 0) throw new Error(`${contagem.result} registro(s) continuam guardados no navegador`);
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

/** Worker criado para uma nova análise (navegador.ts, com "#limpar"): começa do zero, sem ler a análise guardada. */
const comecarVazio = self.location.hash === "#limpar";

const inicio = (async () => {
  const banco = await abrirBanco();
  if (comecarVazio) await esvaziarBanco(banco);
  else if (banco) await restaurar(banco);
  await carregarEstaticos();
  await import("../src/servidor");
  await salvar(banco);
  return banco;
})();

interface Pedido { id: number; metodo: string; caminho: string; query: Record<string, string>; corpo: unknown; arquivos: ArquivoRecebido[] }

const erroJson = (erro: string, detalhe: unknown): Resposta => ({
  status: 500,
  corpo: JSON.stringify({ erro, detalhe: detalhe instanceof Error ? detalhe.message : String(detalhe) }),
  tipo: "application/json; charset=utf-8",
});

/**
 * Nova análise: além do que a rota apaga (XMLs, respostas, resultados), sai tudo o que estiver na memória
 * e no IndexedDB (envios, temporários, sobras de versões anteriores). Só responde depois de confirmado.
 */
async function novaAnalise(banco: IDBDatabase | null, p: Pedido): Promise<Resposta> {
  vfs.esvaziar();
  await esvaziarBanco(banco);
  const resposta = await despachar(p.metodo, p.caminho, p.query, p.corpo, p.arquivos);
  if (resposta.status !== 200) return resposta;
  if (!(await salvar(banco))) return erroJson("Não foi possível concluir a limpeza.", "as pastas da nova análise não puderam ser gravadas no navegador");
  return resposta;
}

// Um pedido por vez: as rotas leem e gravam os mesmos arquivos.
let fila: Promise<unknown> = Promise.resolve();

self.onmessage = (e: MessageEvent<Pedido>) => {
  const p = e.data;
  fila = fila.then(async () => {
    let resposta: Resposta;
    try {
      const banco = await inicio;
      if (p.metodo === "POST" && p.caminho === "/api/nova-analise") {
        resposta = await novaAnalise(banco, p);
      } else {
        resposta = await despachar(p.metodo, p.caminho, p.query, p.corpo, p.arquivos);
        await salvar(banco);
      }
    } catch (erro) {
      console.error(erro);
      resposta = erroJson(p.caminho === "/api/nova-analise" ? "Não foi possível concluir a limpeza." : "Falha ao executar o sistema no navegador.", erro);
    }
    self.postMessage({ id: p.id, ...resposta });
  });
};
