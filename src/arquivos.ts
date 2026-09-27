import * as fs from "node:fs";
import { createHash } from "node:crypto";

const BLOCO = 4 * 1024 * 1024;

/** SHA-256 do arquivo lido em blocos: explicacoes.json passa de 512 MB e não cabe numa string. */
export function sha256DeArquivo(caminho: string): string {
  const virtual = (fs as unknown as { __sha256?: (c: string) => string }).__sha256;
  if (virtual) return virtual(caminho);
  const hash = createHash("sha256");
  const fd = fs.openSync(caminho, "r");
  try {
    const buf = Buffer.alloc(BLOCO);
    let lidos: number;
    while ((lidos = fs.readSync(fd, buf, 0, BLOCO, null)) > 0) hash.update(buf.subarray(0, lidos));
  } finally {
    fs.closeSync(fd);
  }
  return hash.digest("hex");
}

/**
 * Lê só o início de um JSON grande e devolve o objeto até a chave `ate` (exclusive).
 * Serve para o cabeçalho de explicacoes.json, gravado antes de `"vereditos": [`.
 */
export function lerCabecalhoJson(caminho: string, ate: string, limite = 1024 * 1024): Record<string, unknown> | null {
  if (!fs.existsSync(caminho)) return null;
  const fd = fs.openSync(caminho, "r");
  try {
    const buf = Buffer.alloc(limite);
    const lidos = fs.readSync(fd, buf, 0, limite, 0);
    const texto = buf.subarray(0, lidos).toString("utf8");
    const i = texto.indexOf(`"${ate}"`);
    if (i < 0) return null;
    return JSON.parse(texto.slice(0, i).replace(/,\s*$/, "") + "}") as Record<string, unknown>;
  } catch {
    return null;
  } finally {
    fs.closeSync(fd);
  }
}
