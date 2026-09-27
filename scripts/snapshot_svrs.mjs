// Extração derivada do portal da Conformidade Fácil (fonte F2).
//
// A fonte primária é data/fontes/svrs/svrs.html, gravado como veio do servidor.
// Este script lê o array `dadosOriginais` embutido no HTML e grava só o CST 200
// com as classificações 200033 e 200043, sem alterar nenhum valor.
//
// Uso: node scripts/snapshot_svrs.mjs [svrs.html] [saída.json]
import fs from "node:fs";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";

const HTML = process.argv[2] ?? "data/fontes/svrs/svrs.html";
const SAIDA = process.argv[3] ?? "data/fontes/svrs/svrs-200-200033-200043.json";
export const CODIGOS = ["200033", "200043"];

/** Devolve o array `dadosOriginais` do HTML do portal, tal como está no arquivo. */
export function dadosOriginais(html) {
  const i = html.indexOf("var dadosOriginais =");
  if (i < 0) throw new Error("dadosOriginais não encontrado no HTML");
  const j = html.indexOf("[", i);
  let prof = 0, k = j, str = false, esc = false;
  for (; k < html.length; k++) {
    const c = html[k];
    if (str) { if (esc) esc = false; else if (c === "\\") esc = true; else if (c === '"') str = false; continue; }
    if (c === '"') str = true;
    else if (c === "[") prof++;
    else if (c === "]" && !--prof) break;
  }
  return JSON.parse(html.slice(j, k + 1));
}

/** CST 200 com apenas as classificações pedidas, na ordem do portal. */
export function extrair(html) {
  const cst = dadosOriginais(html).find((x) => x.Cst === "200");
  if (!cst) throw new Error("CST 200 ausente");
  const classificacoes = cst.ClassificacoesTributarias.filter((c) => CODIGOS.includes(c.CodClassTrib));
  if (classificacoes.length !== CODIGOS.length) throw new Error("classificação ausente no CST 200");
  return { ...cst, ClassificacoesTributarias: classificacoes };
}

function main() {
  const buf = fs.readFileSync(HTML);
  const saida = {
    fonte: "F2",
    derivadoDe: { arquivo: "svrs.html", sha256: crypto.createHash("sha256").update(buf).digest("hex") },
    metodo: "Array `var dadosOriginais` do HTML; item Cst = \"200\"; ClassificacoesTributarias filtradas por CodClassTrib 200033 e 200043. Valores sem alteração.",
    cst200: extrair(buf.toString("utf8")),
  };
  fs.writeFileSync(SAIDA, JSON.stringify(saida, null, 2) + "\n");
  for (const c of saida.cst200.ClassificacoesTributarias) {
    console.log(c.CodClassTrib, `anexo=${c.NroAnexo}`, `redIBS=${c.PercRedIbs}`, `redCBS=${c.PercRedCbs}`,
      `NCMs=${new Set(c.Anexos.map((a) => a.CodNcmNbs)).size}`);
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
