/**
 * Sistema de arquivos em memória com a parte síncrona do node:fs que o sistema usa.
 * Roda no Web Worker; o worker persiste as alterações no IndexedDB.
 *
 * explicacoes.json passa de 500 MB numa análise grande e não cabe na memória do navegador:
 * dele ficam só o início (o cabeçalho que a tela lê) e o SHA-256 do conteúdo completo.
 */
import { Buffer } from "buffer";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";
import path from "path-browserify";

type Hash = ReturnType<typeof sha256.create>;
type Arquivo =
  | { tipo: "arq"; dados: Uint8Array; mtimeMs: number }
  | { tipo: "resumo"; cabeca: Uint8Array; hash: Hash | null; hashFinal: string | null; tamanho: number; mtimeMs: number };

export type Persistido =
  | { tipo: "dir" }
  | { tipo: "arq"; dados: Uint8Array; mtimeMs: number }
  | { tipo: "resumo"; cabeca: Uint8Array; hashFinal: string; tamanho: number; mtimeMs: number };

const RESUMO = /\/explicacoes\.json$/;
const LIMITE_CABECA = 1024 * 1024;

const arquivos = new Map<string, Arquivo>();
const pastas = new Set<string>(["/"]);
const estaticos = new Set<string>();
const sujos = new Set<string>();
let relogio = Date.now();
const agora = () => (relogio = Math.max(relogio + 1, Date.now()));

const norm = (p: string) => path.resolve(String(p));
const cod = new TextEncoder();
const dec = new TextDecoder();

function erro(codigo: string, operacao: string, p: string): Error {
  const e = new Error(`${codigo}: ${operacao} '${p}'`) as Error & { code: string; path: string };
  e.code = codigo;
  e.path = p;
  return e;
}

function bytes(d: unknown): Uint8Array {
  if (typeof d === "string") return cod.encode(d);
  if (d instanceof Uint8Array) return d;
  if (d instanceof ArrayBuffer) return new Uint8Array(d);
  if (ArrayBuffer.isView(d)) return new Uint8Array(d.buffer, d.byteOffset, d.byteLength);
  return cod.encode(String(d));
}

function codificacao(o: unknown): string | null {
  if (typeof o === "string") return o;
  if (o && typeof o === "object" && "encoding" in o) return (o as { encoding: string | null }).encoding ?? null;
  return null;
}

function concat(a: Uint8Array, b: Uint8Array): Uint8Array {
  const r = new Uint8Array(a.length + b.length);
  r.set(a, 0);
  r.set(b, a.length);
  return r;
}

function criarPastas(p: string): void {
  for (let atual = p; !pastas.has(atual); atual = path.dirname(atual)) {
    pastas.add(atual);
    sujos.add(atual);
  }
}

function gravar(p: string, a: Arquivo): void {
  criarPastas(path.dirname(p));
  arquivos.set(p, a);
  sujos.add(p);
}

function novoArquivo(p: string, dados: Uint8Array): Arquivo {
  if (!RESUMO.test(p)) return { tipo: "arq", dados, mtimeMs: agora() };
  return { tipo: "resumo", cabeca: dados.slice(0, LIMITE_CABECA), hash: sha256.create().update(dados), hashFinal: null, tamanho: dados.length, mtimeMs: agora() };
}

function conteudo(a: Arquivo): Uint8Array {
  return a.tipo === "arq" ? a.dados : a.cabeca;
}

function comoBuffer(u: Uint8Array): Buffer {
  return Buffer.from(u.buffer, u.byteOffset, u.byteLength);
}

export function existsSync(p: string): boolean {
  const n = norm(p);
  return arquivos.has(n) || pastas.has(n);
}

export function mkdirSync(p: string, _o?: unknown): void {
  criarPastas(norm(p));
}

export function readFileSync(p: string, o?: unknown): string | Buffer {
  const n = norm(p);
  const a = arquivos.get(n);
  if (!a) throw erro(pastas.has(n) ? "EISDIR" : "ENOENT", "open", n);
  const enc = codificacao(o);
  return enc ? dec.decode(conteudo(a)) : comoBuffer(conteudo(a));
}

export function writeFileSync(p: string, d: unknown, _o?: unknown): void {
  const n = norm(p);
  gravar(n, novoArquivo(n, bytes(d)));
}

export function appendFileSync(p: string, d: unknown, _o?: unknown): void {
  const n = norm(p);
  const a = arquivos.get(n);
  const b = bytes(d);
  if (!a) return writeFileSync(n, b);
  if (a.tipo === "arq") {
    gravar(n, { tipo: "arq", dados: concat(a.dados, b), mtimeMs: agora() });
    return;
  }
  if (!a.hash) throw erro("EPERM", "append (resumo sem estado de hash)", n);
  a.hash.update(b);
  a.hashFinal = null;
  a.tamanho += b.length;
  if (a.cabeca.length < LIMITE_CABECA) a.cabeca = concat(a.cabeca, b.subarray(0, LIMITE_CABECA - a.cabeca.length));
  a.mtimeMs = agora();
  sujos.add(n);
}

export function readdirSync(p: string): string[] {
  const n = norm(p);
  if (!pastas.has(n)) throw erro(arquivos.has(n) ? "ENOTDIR" : "ENOENT", "scandir", n);
  const prefixo = n === "/" ? "/" : n + "/";
  const nomes = new Set<string>();
  for (const k of [...arquivos.keys(), ...pastas]) {
    if (k !== n && k.startsWith(prefixo)) nomes.add(k.slice(prefixo.length).split("/")[0]!);
  }
  return [...nomes].sort();
}

export function statSync(p: string) {
  const n = norm(p);
  const a = arquivos.get(n);
  if (!a && !pastas.has(n)) throw erro("ENOENT", "stat", n);
  const tamanho = a ? (a.tipo === "arq" ? a.dados.length : a.tamanho) : 0;
  const mtimeMs = a?.mtimeMs ?? 0;
  return {
    size: tamanho,
    mtimeMs,
    mtime: new Date(mtimeMs),
    isFile: () => !!a,
    isDirectory: () => !a,
  };
}

export function rmSync(p: string, o: { recursive?: boolean; force?: boolean } = {}): void {
  const n = norm(p);
  if (arquivos.delete(n)) {
    sujos.add(n);
    return;
  }
  if (!pastas.has(n)) {
    if (o.force) return;
    throw erro("ENOENT", "rm", n);
  }
  const prefixo = n + "/";
  const filhos = [...arquivos.keys(), ...pastas].filter((k) => k.startsWith(prefixo));
  if (filhos.length && !o.recursive) throw erro("ENOTEMPTY", "rm", n);
  for (const k of filhos) {
    arquivos.delete(k);
    pastas.delete(k);
    sujos.add(k);
  }
  if (n !== "/") {
    pastas.delete(n);
    sujos.add(n);
  }
}

export const unlinkSync = (p: string) => rmSync(p);

export function renameSync(de: string, para: string): void {
  const a = norm(de), b = norm(para);
  const arq = arquivos.get(a);
  if (!arq) throw erro("ENOENT", "rename", a);
  arquivos.delete(a);
  sujos.add(a);
  gravar(b, arq);
}

export function copyFileSync(de: string, para: string): void {
  const arq = arquivos.get(norm(de));
  if (!arq) throw erro("ENOENT", "copyfile", norm(de));
  writeFileSync(para, conteudo(arq).slice());
}

export function mkdtempSync(prefixo: string): string {
  const p = norm(prefixo + Math.random().toString(36).slice(2, 8));
  criarPastas(p);
  return p;
}

const abertos = new Map<number, { caminho: string; posicao: number }>();
let proximoFd = 10;

export function openSync(p: string, _modo?: string): number {
  const n = norm(p);
  if (!arquivos.has(n)) throw erro("ENOENT", "open", n);
  const fd = proximoFd++;
  abertos.set(fd, { caminho: n, posicao: 0 });
  return fd;
}

export function readSync(fd: number, buf: Uint8Array, offset: number, length: number, posicao: number | null): number {
  const f = abertos.get(fd);
  if (!f) throw erro("EBADF", "read", String(fd));
  const origem = conteudo(arquivos.get(f.caminho)!);
  const inicio = posicao ?? f.posicao;
  const pedaco = origem.subarray(inicio, inicio + length);
  buf.set(pedaco, offset);
  if (posicao == null) f.posicao += pedaco.length;
  return pedaco.length;
}

export function closeSync(fd: number): void {
  abertos.delete(fd);
}

/** SHA-256 do conteúdo completo, inclusive dos arquivos guardados só como resumo. */
export function __sha256(p: string): string {
  const n = norm(p);
  const a = arquivos.get(n);
  if (!a) throw erro("ENOENT", "open", n);
  if (a.tipo === "arq") return bytesToHex(sha256(a.dados));
  if (!a.hashFinal) a.hashFinal = bytesToHex(a.hash!.clone().digest());
  return a.hashFinal;
}

// ---------- persistência (usada pelo worker) ----------

/** Arquivo que vem do site (base normativa etc.): fica em memória e não é persistido. */
export function gravarEstatico(p: string, dados: Uint8Array): void {
  const n = norm(p);
  writeFileSync(n, dados);
  estaticos.add(n);
  sujos.delete(n);
}

export function restaurar(p: string, v: Persistido): void {
  if (v.tipo === "dir") pastas.add(p);
  else if (v.tipo === "arq") arquivos.set(p, { tipo: "arq", dados: v.dados, mtimeMs: v.mtimeMs });
  else arquivos.set(p, { tipo: "resumo", cabeca: v.cabeca, hash: null, hashFinal: v.hashFinal, tamanho: v.tamanho, mtimeMs: v.mtimeMs });
  relogio = Math.max(relogio, "mtimeMs" in v ? v.mtimeMs : 0);
}

/** Alterações desde a última chamada: valor novo, ou null quando o caminho deixou de existir. */
export function retirarAlteracoes(): [string, Persistido | null][] {
  const r: [string, Persistido | null][] = [];
  for (const p of sujos) {
    if (estaticos.has(p)) continue;
    const a = arquivos.get(p);
    if (a?.tipo === "arq") r.push([p, { tipo: "arq", dados: a.dados, mtimeMs: a.mtimeMs }]);
    else if (a) r.push([p, { tipo: "resumo", cabeca: a.cabeca, hashFinal: __sha256(p), tamanho: a.tamanho, mtimeMs: a.mtimeMs }]);
    else if (pastas.has(p)) r.push([p, { tipo: "dir" }]);
    else r.push([p, null]);
  }
  sujos.clear();
  return r;
}

export default {
  existsSync, mkdirSync, readFileSync, writeFileSync, appendFileSync, readdirSync, statSync, rmSync, unlinkSync,
  renameSync, copyFileSync, mkdtempSync, openSync, readSync, closeSync, __sha256,
};
