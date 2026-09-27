// Gera data/base-normativa.v2.json a partir da base atual.
//
// Cada etapa da lista ETAPAS acrescenta blocos novos, sem editar nenhum campo
// existente: a v2 sem esses blocos é idêntica, byte a byte, à base atual.
//   Etapa 2: cópia (lista vazia).
//   Etapa 3: original e originaisAgrupados, da planilha (scripts/base_v2_planilha.mjs).
//   Etapa 4: bloco fontes na raiz, do manifesto (scripts/base_v2_fontes.mjs).
//   Etapa 5: bloco vinculacoes na raiz, em modo de auditoria (scripts/base_v2_vinculos.mjs).
//   Etapa 5.3: itemOficial nas regras e bloco evidenciasOficiais na raiz, a partir de
//              data/auditoria-oficial.json (scripts/base_v2_evidencias.mjs). Depois de gerar,
//              rode node scripts/auditoria_oficial.mjs (ela registra o SHA-256 da v2).
// A base atual nunca é gravada por este script.
//
// Uso: node scripts/gerar_base_v2.mjs
import fs from "node:fs";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
import { etapa3 } from "./base_v2_planilha.mjs";
import { etapa4 } from "./base_v2_fontes.mjs";
import { etapa5 } from "./base_v2_vinculos.mjs";
import { etapa53 } from "./base_v2_evidencias.mjs";

const ENTRADA = "data/base-normativa.json";
const SAIDA = "data/base-normativa.v2.json";
// Hash da base atual conferido na Etapa 1. Se a base mudar, o gerador para:
// a v2 só pode partir de uma entrada conhecida.
const SHA_ENTRADA = "a451c459597ff6fa4d45c95713708a5220fd7701f4b835df039b8f962e031416";

// Campos que o Python gravou como float (1.0, 0.6). JSON.parse perde o ".0",
// então a serialização o repõe para manter os bytes iguais aos do original.
const CAMPOS_DECIMAIS = ["reducao", "reducaoAliquota"];

// Cada etapa recebe a base e devolve a base com blocos acrescentados.
export const ETAPAS = [etapa3, etapa4, etapa5, etapa53];

const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");

/** Mesmo formato do json.dump(indent=1, ensure_ascii=False) do extrair_base.py. */
export function serializar(base) {
  const decimais = new RegExp(`^(\\s*"(?:${CAMPOS_DECIMAIS.join("|")})": )(-?\\d+)(,?)$`, "gm");
  return JSON.stringify(base, null, 1).replace(decimais, "$1$2.0$3");
}

function main() {
  const bruto = fs.readFileSync(ENTRADA);
  if (sha(bruto) !== SHA_ENTRADA) {
    console.error(`${ENTRADA} mudou (sha256 ${sha(bruto)}); esperado ${SHA_ENTRADA}. Nada foi gravado.`);
    process.exit(1);
  }
  const v2 = ETAPAS.reduce((base, etapa) => etapa(base), JSON.parse(bruto.toString("utf8")));
  const saida = Buffer.from(serializar(v2), "utf8");
  fs.writeFileSync(SAIDA, saida);
  console.log(`${SAIDA}: ${saida.length} bytes, sha256 ${sha(saida)}, ${v2.regras.length} regras, etapas aplicadas: ${ETAPAS.length}`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
