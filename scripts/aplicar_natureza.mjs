// Liga o regime de bares e restaurantes no empresa.json com a natureza REVISADA de cada produto
// (coluna natureza_final de docs/etapa10/natureza-produtos-proposta.csv).
// Produto sem natureza_final não entra: o motor o deixa INDETERMINADO e pede a natureza, como hoje.
// Grava antes uma cópia do empresa.json em backups/etapa10/.
//
// Uso: node scripts/aplicar_natureza.mjs [csv revisado]
import fs from "node:fs";

const CSV = process.argv[2] ?? "docs/etapa10/natureza-produtos-proposta.csv";
const VALIDAS = new Set(["mercadoria", "preparado_no_local", "bebida_alcoolica"]);

function lerCsv(texto) {
  const linhas = [];
  for (const bruta of texto.replace(/^﻿/, "").split(/\r?\n/)) {
    if (!bruta.trim()) continue;
    const campos = [];
    let atual = "", aspas = false;
    for (let i = 0; i < bruta.length; i++) {
      const c = bruta[i];
      if (aspas && c === '"' && bruta[i + 1] === '"') { atual += '"'; i++; }
      else if (c === '"') aspas = !aspas;
      else if (c === ";" && !aspas) { campos.push(atual); atual = ""; }
      else atual += c;
    }
    campos.push(atual);
    linhas.push(campos);
  }
  return linhas;
}

const [cab, ...dados] = lerCsv(fs.readFileSync(CSV, "utf8"));
const col = (nome) => {
  const i = cab.indexOf(nome);
  if (i < 0) throw new Error(`coluna ${nome} ausente em ${CSV}`);
  return i;
};
const [iProd, iFinal] = [col("cProd"), col("natureza_final")];
const mapa = {};
const invalidas = [];
for (const l of dados) {
  const natureza = (l[iFinal] ?? "").trim();
  if (!natureza) continue;
  if (!VALIDAS.has(natureza)) invalidas.push(`${l[iProd]}: "${natureza}"`);
  else mapa[l[iProd]] = natureza;
}
if (invalidas.length) {
  console.error(`natureza_final inválida (use ${[...VALIDAS].join(", ")}):\n  ${invalidas.join("\n  ")}\nNada foi gravado.`);
  process.exit(1);
}

const bruto = fs.readFileSync("empresa.json");
const empresa = JSON.parse(bruto.toString("utf8"));
fs.mkdirSync("backups/etapa10", { recursive: true });
fs.writeFileSync("backups/etapa10/empresa.antes-natureza.json", bruto);
empresa.barOuRestaurante = true;
empresa.naturezaPorProduto = mapa;
fs.writeFileSync("empresa.json", JSON.stringify(empresa, null, 2) + "\n");
const sem = dados.length - Object.keys(mapa).length;
console.log(`empresa.json: barOuRestaurante = true; ${Object.keys(mapa).length} produtos com natureza; ${sem} sem natureza (ficarão INDETERMINADO).`);
