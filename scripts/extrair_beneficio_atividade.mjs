/**
 * Extrai, do snapshot registrado da LC 214/2025 (fonte F1 da v2), o texto literal do regime específico de
 * bares e restaurantes (arts. 273 a 276) para data/fontes/lc214/regime-bares-restaurantes.json.
 * Só leitura do snapshot; o texto não é resumido nem normalizado além de espaços e tags HTML.
 * Uso: node scripts/extrair_beneficio_atividade.mjs
 */
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const v2 = JSON.parse(readFileSync("data/base-normativa.v2.json", "utf8"));
const f1 = v2.fontes.registros.F1;
const arq = f1.arquivos.find((a) => a.id === "F1.html");
const bruto = readFileSync(arq.caminho);
const sha = createHash("sha256").update(bruto).digest("hex");
if (sha !== arq.sha256) throw new Error(`Snapshot da LC 214/2025 não confere com o registro da v2 (${sha} ≠ ${arq.sha256}).`);

const texto = new TextDecoder("windows-1252").decode(bruto);
const limpar = (h) => h.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&quot;/g, '"').replace(/&amp;/g, "&").replace(/\s+/g, " ").trim();
/** Trecho entre a âncora `de` e a próxima âncora `ate`, como texto. */
function trecho(de, ate) {
  const i = texto.indexOf(`name="${de}"`);
  const j = texto.indexOf(`name="${ate}"`, i + 1);
  if (i < 0 || j < 0) throw new Error(`Âncora não encontrada: ${de} ou ${ate}`);
  return limpar(texto.slice(texto.lastIndexOf("<", i), texto.lastIndexOf("<", j)));
}

const artigos = [
  ["art273", "art274", "Art. 273"],
  ["art274", "art275", "Art. 274"],
  ["art275", "art276", "Art. 275"],
  ["art276", "art277", "Art. 276"],
].map(([ancora, proxima, dispositivo]) => ({ dispositivo, ancora, texto: trecho(ancora, proxima).replace(/\s+Seção [IVXL]+\s.*$/, "") }));

const saida = {
  descricao: "LC 214/2025, Capítulo VII, Seção I — Dos Bares e Restaurantes (arts. 273 a 276), texto literal do snapshot registrado.",
  fonte: { id: "F1", nome: f1.nome, url: f1.url, versao: f1.versao, dataConsulta: f1.dataConsulta, arquivo: arq.caminho, sha256: sha },
  artigos,
};
writeFileSync("data/fontes/lc214/regime-bares-restaurantes.json", JSON.stringify(saida, null, 2) + "\n", "utf8");
console.log(artigos.map((a) => `${a.dispositivo}: ${a.texto.slice(0, 90)}…`).join("\n"));
