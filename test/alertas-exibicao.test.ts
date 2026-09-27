/**
 * Etapa 9B.2: exibição dos alertas. Funções puras de indexação, agrupamento, totais e
 * HTML, e a leitura de /api/alertas com a conferência contra os resultados atuais.
 * Nada aqui altera veredito, estado, indicador ou validação.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, writeFileSync, mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { classificarDocumentos } from "../src/motor.js";
import { carregarContexto, explicarVereditos } from "../src/explicador.js";
import { gerarAlertas, type Alerta } from "../src/alertas.js";
import {
  ORDEM_CATEGORIAS, agruparPorCartao, chaveCartao, chaveItem, escaparHtml, htmlAlertasDoCartao, htmlAlertasDoItem, htmlPainel,
  indexarPorItem, lerAlertasParaExibicao, montarRespostaAlertas, totalizarPorCategoria,
} from "../src/alertas-exibicao.js";
import { diferencasDeVereditos } from "../src/lote-explicativo.js";
import type { BaseNormativa, Documento, ItemDocumento, RespostaValidacao, VereditoExplicado } from "../src/tipos.js";

const ctx = carregarContexto({ base: "data/base-normativa.json", v2: "data/base-normativa.v2.json", matriz: "docs/etapa6/matriz-decisao.json", empresa: "empresa.json" });
const base = JSON.parse(readFileSync("data/base-normativa.json", "utf8")) as BaseNormativa;
const empresa = JSON.parse(readFileSync("empresa.json", "utf8")) as { cnpj: string; regime: "normal"; validacoes?: RespostaValidacao[] };

function item(nItem: number, ncm: string, cst: string, cClassTrib: string, cProd: string, xProd = `P${cProd}`): ItemDocumento {
  return { nItem, cProd, xProd, ncm, cfop: "5102", quantidade: 1, valorProduto: 1000, desconto: 0, baseCalculo: 1000, cst, cClassTrib, aliquotas: {} };
}
function doc(chave: string, modelo: string, itens: ItemDocumento[]): Documento {
  return {
    chave, modelo, numero: "1", serie: "1", dataEmissao: "2026-09-10T10:00:00-03:00", tipoOperacao: "saida", finalidade: "1", situacao: "100", cancelado: false,
    emitente: { cnpj: "00000000000000", crt: "3", uf: "SC" }, destinatario: { cnpj: "11111111000191", cpf: null, uf: "SC", indIEDest: "1" },
    itens, arquivo: `${chave}.xml`, avisos: [],
  };
}
const docs = [
  doc("SINT-55", "55", [
    item(1, "28273993", "200", "200033", "A1"),
    item(2, "21069090", "200", "200033", "A2"),
    item(3, "21069090", "200", "200033", "A2"),   // mesmo cartão do item 2 (mesmo produto, NCM e cProd)
    item(4, "17025000", "200", "200033", "A4"),
    item(5, "85176259", "200", "200043", "A5"),
    item(6, "87091100", "200", "200043", "A6"),
    item(7, "23080000", "200", "200038", "A7"),
    item(9, "19022000", "200", "200034", "2726"),
    item(11, "99999999", "000", "000001", "A11"),
  ]),
  doc("SINT-65", "65", [item(1, "85176259", "200", "200043", "B1")]),
];
const vereditos = classificarDocumentos(docs, { base, empresa, validacoes: empresa.validacoes ?? [], agora: "2026-09-24T00:00:00-03:00" });
const explicados = JSON.parse(JSON.stringify(explicarVereditos(vereditos, ctx, docs))) as VereditoExplicado[];
const { porItem, lote } = gerarAlertas(explicados);

test("exibição: junção por documento + nItem sem perder nem duplicar alertas", () => {
  const idx = indexarPorItem(porItem);
  const total = [...idx.values()].reduce((n, xs) => n + xs.length, 0);
  assert.equal(total, porItem.length, "nenhum alerta perdido");
  assert.equal(new Set([...idx.values()].flat().map((a) => a.id)).size, porItem.length, "nenhum alerta duplicado");
  for (const [k, xs] of idx) for (const a of xs) assert.equal(chaveItem(a.item.documento, a.item.nItem), k);
  assert.ok(idx.get("SINT-55|9")!.some((a) => a.codigo === "VALIDACAO_LEGADA"), "validação legada continua alerta normal do item");
});

test("exibição: ordem das categorias CONFLITO, LACUNA, PENDENCIA, ATENCAO, INFORMACAO", () => {
  assert.deepEqual([...ORDEM_CATEGORIAS], ["CONFLITO", "LACUNA", "PENDENCIA", "ATENCAO", "INFORMACAO"]);
  for (const xs of indexarPorItem(porItem).values()) {
    const pos = xs.map((a) => ORDEM_CATEGORIAS.indexOf(a.categoria));
    assert.deepEqual(pos, [...pos].sort((a, b) => a - b));
  }
});

test("exibição: cartões agregam por produto + NCM + cProd, deduplicam e guardam as ocorrências", () => {
  const cartoes = agruparPorCartao(porItem, vereditos);
  const k = chaveCartao("21069090", "A2", "PA2");
  const c = cartoes.get(k)!;
  assert.ok(c, "cartão do 2106.90.90");
  const multiplas = c.find((a) => a.codigo === "MULTIPLAS_REGRAS_CANDIDATAS")!;
  assert.equal(multiplas.itens, 2, "o mesmo alerta dos itens 2 e 3 aparece uma vez, com a contagem");
  assert.deepEqual(multiplas.ocorrencias.map((o) => o.nItem), [2, 3], "nenhuma ocorrência perdida");
  // Só itens em REQUER_VALIDACAO entram (como a fila); CORRETO/INCORRETO não viram cartão
  const requer = new Set(vereditos.filter((v) => v.estado === "REQUER_VALIDACAO").map((v) => chaveItem(v.documento, v.nItem)));
  const esperado = porItem.filter((a) => requer.has(chaveItem(a.item.documento, a.item.nItem))).length;
  const noCartao = [...cartoes.values()].flat().reduce((n, a) => n + a.ocorrencias.length, 0);
  assert.equal(noCartao, esperado, "todas as ocorrências de itens em REQUER_VALIDACAO estão nos cartões");
  assert.ok(![...cartoes.values()].flat().some((a) => a.codigo === "VALIDACAO_HUMANA_NAO_DISPONIVEL"), "alerta de lote não é repetido no cartão");
});

test("exibição: totais por categoria, na ordem, com item e lote separados", () => {
  const t = totalizarPorCategoria(porItem, lote);
  assert.deepEqual(t.map((x) => x.categoria), [...ORDEM_CATEGORIAS]);
  assert.equal(t.reduce((n, x) => n + x.alertasDeItem, 0), porItem.length);
  assert.equal(t.reduce((n, x) => n + x.alertasDeLote, 0), lote.length);
});

test("exibição: alertas de lote só no painel, identificados como lote", () => {
  const painel = htmlPainel(totalizarPorCategoria(porItem, lote), lote);
  for (const l of lote) assert.ok(painel.includes(escaparHtml(l.titulo)) && painel.includes(escaparHtml(l.mensagem)));
  assert.match(painel, /Alertas de lote/);
  assert.match(painel, /não fazem parte dos indicadores/);
  const r = montarRespostaAlertas({ fase: "B1_ALERTAS", origem: { explicacoes: "x", sha256: "y" }, totais: {}, lote, porItem }, vereditos);
  for (const h of Object.values(r.disponivel ? r.porItemHtml : {})) assert.doesNotMatch(h, /Lote: /);
});

test("exibição: HTML escapa <, >, \", ' e mantém aspas tipográficas, sem virar HTML executável", () => {
  const perigoso: Alerta = { ...porItem[0]!, titulo: `Título <b>"x"</b> 'y'`, mensagem: `<script>alert("x")</script> <img src=x onerror='y'> “aspas” & fim` };
  const htmls = [htmlAlertasDoItem([perigoso]), htmlAlertasDoCartao([{ ...perigoso, itens: 2, ocorrencias: [], efeito: "somente_exibicao" }]),
    htmlPainel(totalizarPorCategoria([perigoso], []), [{ ...lote[0]!, titulo: perigoso.titulo, mensagem: perigoso.mensagem }])];
  for (const h of htmls) {
    // Nenhuma tag do texto do alerta sobrevive; "onerror=" pode existir só como texto dentro de &lt;img…&gt;
    assert.doesNotMatch(h, /<(script|img|b)\b/i);
    assert.doesNotMatch(h, /<[^>]*onerror=/i);
    assert.match(h, /&lt;script&gt;alert\(&quot;x&quot;\)&lt;\/script&gt;/);
    assert.match(h, /onerror=&#039;y&#039;/);
    assert.match(h, /“aspas” &amp; fim/);
  }
});

test("exibição: o HTML dos alertas nunca usa as classes nem o texto de estado", () => {
  const estados = ["CORRETO", "INCORRETO_ECONOMIA", "INCORRETO_RISCO", "REQUER_VALIDACAO", "NAO_OBRIGATORIO", "INDETERMINADO"];
  const r = montarRespostaAlertas({ fase: "B1_ALERTAS", origem: { explicacoes: "x", sha256: "y" }, totais: {}, lote, porItem }, vereditos);
  assert.ok(r.disponivel);
  const htmls = [...Object.values(r.porItemHtml), ...Object.values(r.porCartaoHtml), r.painelHtml];
  for (const h of htmls) {
    const classes = [...h.matchAll(/class="([^"]*)"/g)].flatMap((m) => m[1]!.split(/\s+/));
    for (const c of classes) assert.ok(!estados.includes(c) && c !== "status", `classe ${c}`);
  }
  assert.equal(r.efeito, "somente_exibicao");
});

test("exibição: /api/alertas indisponível sem arquivos, desatualizado ou divergente — sem inventar alertas", () => {
  const pasta = mkdtempSync(join(tmpdir(), "alertas-9b2-"));
  try {
    const vazio = lerAlertasParaExibicao(pasta);
    assert.equal(vazio.disponivel, false);
    assert.match(vazio.painelHtml, /Alertas indisponíveis/);
    // Arquivos coerentes: disponível
    writeFileSync(join(pasta, "vereditos.json"), JSON.stringify(vereditos));
    writeFileSync(join(pasta, "explicacoes.json"), JSON.stringify({ vereditos: explicados }));
    const sha = createHash("sha256").update(readFileSync(join(pasta, "explicacoes.json"))).digest("hex");
    writeFileSync(join(pasta, "alertas.json"), JSON.stringify({ fase: "B1_ALERTAS", origem: { explicacoes: "explicacoes.json", sha256: sha }, totais: {}, lote, porItem }));
    const ok = lerAlertasParaExibicao(pasta);
    assert.equal(ok.disponivel, true);
    // Resultados mudaram depois dos alertas: indisponível
    const outros = vereditos.map((v, i) => (i === 0 ? { ...v, estado: "CORRETO" as const } : v));
    writeFileSync(join(pasta, "vereditos.json"), JSON.stringify(outros));
    const divergente = lerAlertasParaExibicao(pasta);
    assert.equal(divergente.disponivel, false);
    assert.ok(!divergente.disponivel && /resultados diferentes/.test(divergente.motivo));
    // explicacoes.json trocado: SHA não confere
    writeFileSync(join(pasta, "vereditos.json"), JSON.stringify(vereditos));
    writeFileSync(join(pasta, "explicacoes.json"), JSON.stringify({ vereditos: explicados }) + " ");
    const sha2 = lerAlertasParaExibicao(pasta);
    assert.ok(!sha2.disponivel && /não corresponde/.test(sha2.motivo));
  } finally {
    rmSync(pasta, { recursive: true, force: true });
  }
});

test("exibição: comparação de vereditos ignora só calculadoEm e a explicação", () => {
  const a = vereditos.map((v) => ({ ...v, calculadoEm: "2000-01-01T00:00:00Z" }));
  assert.deepEqual(diferencasDeVereditos(vereditos, a), []);
  assert.deepEqual(diferencasDeVereditos(vereditos, explicados), []);
  assert.equal(diferencasDeVereditos(vereditos, vereditos.map((v, i) => (i === 1 ? { ...v, motivo: "outro" } : v))).length, 1);
});
