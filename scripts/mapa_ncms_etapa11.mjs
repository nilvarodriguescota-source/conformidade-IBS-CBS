// Etapa 11: mapa de todos os produtos/NCMs de uma análise processada (um registro por cProd).
// Lê a pasta de saída (vereditos.json), a base normativa, os bloqueios e as respostas da análise.
// Uso: npm run build && node scripts/mapa_ncms_etapa11.mjs <pasta de saída> <respostas.json> <csv de saída>
import fs from "node:fs";
import { bloqueiosParaBase } from "../dist/src/bloqueios.js";
import * as parametros from "../dist/src/parametros.js";
const observacoesEspecificas = parametros.observacoesEspecificas ?? (() => []);

const [saida = "saida-teste", arqRespostas = "analise-atual/respostas.json", destino = "docs/etapa11/mapa-ncms.csv"] = process.argv.slice(2);
const vereditos = JSON.parse(fs.readFileSync(`${saida}/vereditos.json`, "utf8"));
const base = JSON.parse(fs.readFileSync("data/base-normativa.json", "utf8"));
const respostas = fs.existsSync(arqRespostas) ? JSON.parse(fs.readFileSync(arqRespostas, "utf8")) : [];
const bloqueios = bloqueiosParaBase("data/base-normativa.json");
const porId = new Map(base.regras.map((r) => [`${r.id}|${r.ncm}`, r]));
const pct = (x) => `${Math.round(x * 100)}%`;
const regraTexto = (id, ncm) => {
  const r = porId.get(`${id}|${ncm}`);
  return r ? `${r.cst}/${r.cClassTrib} (Anexo ${r.anexo}, item ${r.item || "?"}; redução ${pct(r.reducaoAliquota)}; ${r.fundamentoLegal}; vigência desde ${r.vigenciaInicio})` : id;
};
const conta = (xs) => Object.entries(xs.reduce((o, x) => ((o[x] = (o[x] ?? 0) + 1), o), {})).map(([k, n]) => `${k}: ${n}`).join(" | ");

const grupos = new Map();
for (const v of vereditos) {
  const g = grupos.get(v.cProd) ?? { v, itens: [] };
  g.itens.push(v);
  grupos.set(v.cProd, g);
}
const linhas = [...grupos.values()].map(({ v, itens }) => {
  const candidatas = [...new Set(itens.flatMap((x) => x.regrasCandidatas))];
  const aplicadas = [...new Set(itens.map((x) => x.regraAplicada).filter(Boolean))];
  const bloq = [...bloqueios.values()].filter((b) => b.ncm === v.ncm);
  const resp = respostas.filter((r) => r.ncm === v.ncm && (r.cProd === v.cProd || r.cProd === v.produto));
  const esperados = [...new Set(itens.map((x) => (x.esperado ? `${x.esperado.cst}/${x.esperado.cClassTrib}` : "depende da validação")))];
  const obs = observacoesEspecificas(v.ncm, itens[0].calculadoEm ?? "2026-09-01").map((o) => o.texto);
  return {
    cProd: v.cProd,
    produto: v.produto,
    ncm: v.ncm,
    itens: itens.length,
    base: itens.reduce((s, x) => s + x.baseCalculo, 0).toFixed(2).replace(".", ","),
    informado: conta(itens.map((x) => `${x.informado.cst ?? "ausente"}/${x.informado.cClassTrib ?? "ausente"}`)),
    estados: conta(itens.map((x) => x.estado)),
    esperado: esperados.join(" | "),
    regra_aplicada: aplicadas.map((id) => (id.startsWith("LC 214") ? id : regraTexto(id, v.ncm))).join(" | ") || "nenhuma",
    regras_candidatas: candidatas.map((id) => `${id}: ${regraTexto(id, v.ncm)}`).join(" | "),
    vedacoes: bloq.map((b) => `${b.regraId}: ${b.motivo}`).join(" | "),
    respostas: resp.map((r) => `${r.resposta} ${r.regraId} (${r.autor}, ${r.data})`).join(" | "),
    economia: itens.reduce((s, x) => s + (x.economiaPotencial ?? 0), 0).toFixed(2).replace(".", ","),
    economia_sujeita_validacao: itens.reduce((s, x) => s + (x.economiaSujeitaValidacao ?? 0), 0).toFixed(2).replace(".", ","),
    exposicao: itens.reduce((s, x) => s + (x.exposicao ?? 0), 0).toFixed(2).replace(".", ","),
    observacao_legal: obs.join(" | "),
    motivo: itens[0].motivo,
  };
}).sort((a, b) => a.ncm.localeCompare(b.ncm) || a.produto.localeCompare(b.produto));

const cols = Object.keys(linhas[0]);
const cel = (x) => `"${String(x ?? "").replace(/"/g, '""')}"`;
fs.mkdirSync(destino.replace(/\/[^/]+$/, ""), { recursive: true });
fs.writeFileSync(destino, "﻿" + [cols, ...linhas.map((l) => cols.map((c) => l[c]))].map((l) => l.map(cel).join(";")).join("\r\n") + "\r\n");
console.log(`${destino}: ${linhas.length} produtos, ${new Set(linhas.map((l) => l.ncm)).size} NCMs`);
