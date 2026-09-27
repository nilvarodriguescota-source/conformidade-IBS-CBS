// Decisão D5 = "incluir" (tomada pela usuária em 27/09/2026, Etapa 10): acrescenta à base normativa as
// regras de docs/etapa10/proposta-d5.json (NCMs que a LC 214/2025 e o SVRS listam para os códigos do
// catálogo e que a planilha não tinha). As 1.369 regras da planilha ficam como estão e na mesma ordem;
// as novas vão para o fim, com os 18 campos de sempre (a evidência fica na proposta e na v2).
//
// Grava antes uma cópia da base em backups/etapa10/. Depois rode, nesta ordem:
//   node scripts/auditoria_oficial.mjs     (auditoria sobre a base nova)
//   node scripts/gerar_base_v2.mjs         (v2 com as regras novas)
//   node scripts/auditoria_oficial.mjs     (registra o SHA-256 da v2 nova)
import fs from "node:fs";
import crypto from "node:crypto";
import { serializar } from "./gerar_base_v2.mjs";
import { ORIGEM_D5 } from "./base_v2_planilha.mjs";

const BASE = "data/base-normativa.json";
const PROPOSTA = "docs/etapa10/proposta-d5.json";
export const CAMPOS = ["id", "ncm", "cst", "cClassTrib", "tratamento", "reducaoAliquota", "anexo", "item", "fundamentoLegal", "rotulo",
  "descricaoLegal", "descricaoNcmTipi", "ncmCitadoNaLei", "origemRegistro", "observacao", "vigenciaInicio", "vigenciaFim", "fonte"];

const bruto = fs.readFileSync(BASE);
const base = JSON.parse(bruto.toString("utf8"));
if (base.regras.some((r) => r.origemRegistro.startsWith(ORIGEM_D5))) {
  console.error("A base já tem as regras da D5. Nada foi gravado.");
  process.exit(1);
}
const proposta = JSON.parse(fs.readFileSync(PROPOSTA, "utf8"));
const ids = new Set(base.regras.map((r) => `${r.id}|${r.ncm}`));
const novas = proposta.regras.map((r) => {
  if (ids.has(`${r.id}|${r.ncm}`)) throw new Error(`regra ${r.id} já existe na base`);
  ids.add(`${r.id}|${r.ncm}`);
  return Object.fromEntries(CAMPOS.map((k) => [k, r[k]]));
});

fs.mkdirSync("backups/etapa10", { recursive: true });
fs.writeFileSync("backups/etapa10/base-normativa.antes-d5.json", bruto);
const saida = Buffer.from(serializar({ ...base, regras: base.regras.concat(novas) }), "utf8");
fs.writeFileSync(BASE, saida);
console.log(`${BASE}: ${base.regras.length} + ${novas.length} = ${base.regras.length + novas.length} regras; sha256 ${crypto.createHash("sha256").update(saida).digest("hex")}`);
