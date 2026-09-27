// Proposta de natureza por produto para o regime de bares e restaurantes (LC 214/2025, arts. 273 a 275).
//
// Não altera empresa.json: grava docs/etapa10/natureza-produtos-proposta.csv para revisão. Só as
// sugestões de confiança alta vêm com natureza_final preenchida; as demais ficam em branco até a revisão.
// Depois da revisão: node scripts/aplicar_natureza.mjs
//
// Critérios (sugestão, não decisão):
//   bebida_alcoolica    NCM 2203 a 2206 e 2208 (art. 273, § 2º, III)                                   alta
//   preparado_no_local  nome indica preparo e serviço no local: buffet, café, cappuccino, sopa, omelete,
//                       lanche, suco natural… (art. 273, caput e § 1º)                                  alta
//   mercadoria          água mineral, refrigerante/energético/suco industrializado, bala e chiclete,
//                       produto com marca e volume/peso (revenda sem preparo, art. 273, § 2º, II)      alta ou média
//   mercadoria          produto de padaria/confeitaria (tipo "mercadoria" no sistema: "inclusive de
//                       padaria"); confirmar se é venda de produto ou alimentação servida                média
//   (em branco)         demais produtos                                                                 baixa
//
// Uso: npm run build && node scripts/proposta_natureza.mjs [pasta de XMLs]
import fs from "node:fs";
import path from "node:path";
import { lerXml, selecionarVendas } from "../dist/src/parser.js";

const PASTA = process.argv[2] ?? "analise-atual/xmls";
const SAIDA = "docs/etapa10/natureza-produtos-proposta.csv";

const sem = (s) => s.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
const PREPARO = /\b(BUFFET|CAFE|CAPPUCC?INO|EXPRESSO|MAC+HIAT+O|MILK ?SHAKES?|CREPIOCA|QUEIJO QUENTE|ESPETINHO|LATTE|MOCACCINO|CHA|CHOCOLATE QUENTE|SUCOS?|SODA ITALIANA|VITAMINA|SMOOTHIE|SOPAS?|CALDOS?|OMELETE|HAMBURGUER|BURGUER|SANDUICHE|MISTO|CROQUE|TOSTA|TOSTADO|BRUSQUETA|TAPIOCA|CREPE|PANQUECA|SALADA|PRATO|ADC|OVOS? MEXIDOS?|PAO NA CHAPA|PAO C\/ MANTEIGA|BAGUETE)\b/;
const MARCA_VOLUME = /(\b\d+([.,]\d+)?\s?(ML|L|LITROS?|G|KG|GR)\b|\bLATA\b|\bLT\b|\bPET\b|\bGARRAFA\b|\bGRF\b)/;
const PADARIA = /^(1905|1901|1902|1806|1704|2105|0403|0406)/;

function sugerir(ncm, nome) {
  const n = sem(nome);
  if (/^220[3-6]|^2208/.test(ncm)) return ["bebida_alcoolica", "alta", "NCM de bebida alcoólica: fora do regime (art. 273, § 2º, III)"];
  if (PREPARO.test(n) && !MARCA_VOLUME.test(n)) return ["preparado_no_local", "alta", "o nome indica preparo e serviço no estabelecimento (art. 273, caput e § 1º)"];
  if (/^2201/.test(ncm)) return ["mercadoria", "alta", "água mineral: revenda sem preparo (art. 273, § 2º, II)"];
  if (/^2202/.test(ncm) && /\b\d{3,4}\b/.test(n) && !PREPARO.test(n)) return ["mercadoria", "alta", "refrigerante/energético com volume no nome: revenda sem preparo (art. 273, § 2º, II)"];
  if (/^2202|^2009/.test(ncm) && MARCA_VOLUME.test(n)) return ["mercadoria", "alta", "bebida industrializada com volume no nome: revenda sem preparo (art. 273, § 2º, II)"];
  if (/^1704/.test(ncm) && MARCA_VOLUME.test(n)) return ["mercadoria", "alta", "bala/chiclete embalado: revenda sem preparo (art. 273, § 2º, II)"];
  if (PREPARO.test(n)) return ["preparado_no_local", "media", "o nome indica preparo, mas também traz volume/peso; confirmar"];
  if (MARCA_VOLUME.test(n)) return ["mercadoria", "media", "produto com volume/peso no nome, provável revenda sem preparo; confirmar"];
  if (PADARIA.test(ncm)) return ["mercadoria", "media", "produto de padaria/confeitaria; confirmar se é venda do produto ou alimentação servida no local"];
  return ["", "baixa", "sem critério seguro; classificar na revisão"];
}

const arquivos = fs.readdirSync(PASTA).filter((f) => f.toLowerCase().endsWith(".xml")).map((f) => path.join(PASTA, f));
const docs = selecionarVendas(arquivos.map((a) => lerXml(fs.readFileSync(a, "utf8"), a))).documentos;
const porProduto = new Map();
for (const d of docs) for (const it of d.itens) {
  const p = porProduto.get(it.cProd) ?? { cProd: it.cProd, produto: it.xProd, ncm: it.ncm ?? "", itens: 0, valor: 0 };
  p.itens++;
  p.valor += it.valorProduto - it.desconto;
  porProduto.set(it.cProd, p);
}
const linhas = [...porProduto.values()].sort((a, b) => b.valor - a.valor).map((p) => {
  const [natureza, confianca, motivo] = sugerir(p.ncm, p.produto);
  return [p.cProd, p.produto, p.ncm, p.itens, p.valor.toFixed(2).replace(".", ","), natureza, confianca, motivo, confianca === "alta" ? natureza : ""];
});
const cel = (v) => `"${String(v).replace(/"/g, '""')}"`;
const csv = [["cProd", "produto", "ncm", "itens", "valor_total", "natureza_sugerida", "confianca", "motivo", "natureza_final"], ...linhas]
  .map((l) => l.map(cel).join(";")).join("\r\n");
fs.mkdirSync(path.dirname(SAIDA), { recursive: true });
fs.writeFileSync(SAIDA, "﻿" + csv + "\r\n");
const conta = {};
for (const l of linhas) conta[`${l[5] || "(em branco)"} / ${l[6]}`] = (conta[`${l[5] || "(em branco)"} / ${l[6]}`] ?? 0) + 1;
console.log(`${SAIDA}: ${linhas.length} produtos`, conta);
