/**
 * Redução de alíquota exibida (D3 continua pendente): o valor é o reducaoAliquota da regra identificada
 * pelo explicador; a evidência vem do vínculo C-<cClassTrib>-reducaoAliquota. Nada disso muda o veredito.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { classificarDocumentos, classificarItem } from "../src/motor.js";
import { carregarContexto, explicarVereditos } from "../src/explicador.js";
import type { BaseNormativa, Documento, Empresa, ItemDocumento, NaturezaItem, RespostaValidacao, Veredito, VereditoExplicado } from "../src/tipos.js";

const ctx = carregarContexto({
  base: "data/base-normativa.json",
  v2: "data/base-normativa.v2.json",
  matriz: "docs/etapa6/matriz-decisao.json",
  empresa: "test/fixtures/empresa-teste.json",
});
const base = JSON.parse(readFileSync("data/base-normativa.json", "utf8")) as BaseNormativa;
const empresa: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: false };
const AGORA = "2026-09-24T00:00:00-03:00";

function item(nItem: number, ncm: string, cst: string, cClassTrib: string, cProd: string): ItemDocumento {
  return { nItem, cProd, xProd: `P${cProd}`, ncm, cfop: "5102", quantidade: 1, valorProduto: 1000, desconto: 0, baseCalculo: 1000, cst, cClassTrib, aliquotas: {} };
}
function doc(chave: string, itens: ItemDocumento[]): Documento {
  return {
    chave, modelo: "55", numero: "1", serie: "1", dataEmissao: "2026-09-10T10:00:00-03:00", tipoOperacao: "saida", finalidade: "1", situacao: "100", cancelado: false,
    emitente: { cnpj: "00000000000000", crt: "3", uf: "SC" }, destinatario: { cnpj: "11111111000191", cpf: null, uf: "SC", indIEDest: "1" },
    itens, arquivo: `${chave}.xml`, avisos: [],
  };
}
const sim = (ncm: string, cProd: string, regraId: string): RespostaValidacao => ({ ncm, cProd, regraId, resposta: "SIM", autor: "Teste", data: "2026-09-24" });
const indiceDe = (id: string, ncm: string) => base.regras.findIndex((r) => r.id === id && r.ncm === ncm);
const idDe = (ncm: string, cClassTrib: string) => base.regras.find((r) => r.ncm === ncm && r.cClassTrib === cClassTrib)!.id;

function explicar(itens: ItemDocumento[], validacoes: RespostaValidacao[] = [], e: Empresa = empresa, natureza?: Map<string, NaturezaItem>) {
  const docs = [doc("RED", itens)];
  const vereditos = classificarDocumentos(docs, { base, empresa: e, validacoes, naturezaPorProduto: natureza, agora: AGORA });
  const antes = JSON.stringify(vereditos);
  const explicados = explicarVereditos(vereditos, ctx, docs);
  return { vereditos, antes, explicados };
}
const reducao = (x: VereditoExplicado) => x.explicacaoInformativa!.reducaoDoItem;

test("redução: 200033 com evidência oficial confirmada, fatos F1 e F2 do vínculo C-200033-reducaoAliquota", () => {
  const { explicados } = explicar([item(1, "28273993", "200", "200033", "A1")]);
  const x = explicados[0]!;
  assert.equal(x.estado, "REQUER_VALIDACAO");
  const regra = x.explicacaoInformativa!.regras[0]!;
  assert.equal(regra.vinculo, "seguro");
  const r = regra.reducao!;
  assert.equal(r.evidencia, "oficial_confirmada");
  assert.equal(r.valor, 0.6);
  assert.equal(r.origem, "base_normativa");
  assert.equal(r.regraIndice, indiceDe(regra.regraIdInformado, "28273993"));
  assert.equal(r.linhaPlanilha, regra.referencia!.linha);
  assert.equal(r.comparacao, "concorda");
  assert.deepEqual(r.fatos.map((f) => f.fonte), ["F1", "F1", "F2", "F2"]);
  assert.ok(r.fatos.some((f) => (f.trecho ?? "").startsWith("Art. 133. Ficam reduzidas em 60%")));
  assert.deepEqual(r.fatos.filter((f) => f.fonte === "F2").map((f) => f.valor), [60, 60]);
  // item pendente: a mesma redução, como "prevista"
  const d = reducao(x)!;
  assert.equal(d.situacao, "prevista");
  assert.equal(d.opcoes[0]!.evidencia, "oficial_confirmada");
});

test("redução: 200034 (19022000) com o vínculo de código registrado na Fase 3, valor da base, linha 693", () => {
  const id = "19022000-200034-VII-9";
  const { explicados } = explicar([item(1, "19022000", "000", "000001", "2727")], [sim("19022000", "2727", id)]);
  const x = explicados[0]!;
  assert.equal(x.estado, "INCORRETO_ECONOMIA");
  assert.equal(x.regraAplicada, id);
  const d = reducao(x)!;
  assert.equal(d.situacao, "aplicada");
  const o = d.opcoes[0]!;
  assert.equal(o.regraId, id);
  assert.equal(o.evidencia, "oficial_confirmada");
  assert.equal(o.valor, 0.6);
  assert.equal(o.valor, base.regras[indiceDe(id, "19022000")]!.reducaoAliquota);
  assert.equal(o.regraIndice, 584);
  assert.equal(o.linhaPlanilha, 693);
  assert.equal(o.comparacao, "concorda");
  assert.deepEqual(o.fatos.map((f) => [f.fonte, "campo" in f.localizacao ? f.localizacao.campo : "dispositivo" in f.localizacao ? f.localizacao.dispositivo : ""]), [["F1", "art. 135, caput"], ["F2", "PercRedIbs"], ["F2", "PercRedCbs"]]);
  assert.match(o.motivo, /C-200034-reducaoAliquota/);
  assert.equal(d.coerenciaEconomia, true);
  // D3 (definição aprovada na 5.3): só para vínculo NCM × item não CONFIRMADO; esta regra está CONFIRMADA na auditoria
  assert.equal(x.explicacaoInformativa!.regras[0]!.auditoriaOficial?.status, "CONFIRMADA");
  assert.ok(!x.explicacaoInformativa!.decisoesPendentes.some((p) => p.decisao === "D3"));
});

test("redução: regraId duplicado (23080000) fica não determinada, sem percentual, e o motor não aplica a regra", () => {
  const id = "23080000-200038-IX-23.06";
  for (const validacoes of [[], [sim("23080000", "A7", id)]]) {
    const { explicados } = explicar([item(1, "23080000", "000", "000001", "A7")], validacoes);
    const x = explicados[0]!;
    assert.equal(x.regraAplicada, null);
    assert.equal(x.estado, "REQUER_VALIDACAO");
    const regra = x.explicacaoInformativa!.regras.find((r) => r.regraIdInformado === id)!;
    assert.equal(regra.vinculo, "ambiguo_regraid_duplicado");
    assert.equal(regra.reducao!.evidencia, "nao_determinada");
    assert.equal(regra.reducao!.valor, null);
    assert.equal(regra.reducao!.regraIndice, null);
    assert.match(regra.reducao!.motivo, /não pôde ser identificada com segurança/);
    const d = reducao(x)!;
    assert.deepEqual(d.opcoes.map((o) => [o.regraId, o.evidencia, o.valor]), [[id, "nao_determinada", null]]);
  }
});

test("redução: é a da regraAplicada, não a da primeira candidata (21069090: 200033 × 200003)", () => {
  for (const [cod, esperado, evidencia] of [["200003", 1, "oficial_confirmada"], ["200033", 0.6, "oficial_confirmada"]] as const) {
    const id = idDe("21069090", cod);
    const { explicados } = explicar([item(1, "21069090", "000", "000001", "A2")], [sim("21069090", "A2", id)]);
    const x = explicados[0]!;
    assert.equal(x.regraAplicada, id);
    const d = reducao(x)!;
    assert.equal(d.situacao, "aplicada");
    assert.equal(d.opcoes.length, 1);
    assert.equal(d.opcoes[0]!.regraId, id);
    assert.equal(d.opcoes[0]!.valor, esperado);
    assert.equal(d.opcoes[0]!.evidencia, evidencia);
    assert.equal(d.opcoes[0]!.regraIndice, indiceDe(id, "21069090"));
  }
  const cand = explicar([item(1, "21069090", "000", "000001", "A2")]).explicados[0]!;
  const primeira = base.regras[indiceDe(cand.regrasCandidatas[0]!, "21069090")]!;
  assert.equal(primeira.cClassTrib, "200033", "a primeira candidata é do 200033; o caso 200003 prova que não é ela que vale");
});

test("redução: coerência da economia (INCORRETO_ECONOMIA) confere com valorPago × redução; valor adulterado não confere", () => {
  const id = "19022000-200034-VII-9";
  const docs = [doc("RED", [item(1, "19022000", "000", "000001", "2727")])];
  const [v] = classificarDocumentos(docs, { base, empresa, validacoes: [sim("19022000", "2727", id)], agora: AGORA }) as [Veredito];
  assert.equal(v.estado, "INCORRETO_ECONOMIA");
  assert.ok(Math.abs(v.economiaPotencial! - v.valorPago! * 0.6) < 1e-9);
  assert.equal(explicarVereditos([v], ctx, docs)[0]!.explicacaoInformativa!.reducaoDoItem!.coerenciaEconomia, true);
  const adulterado: Veredito = { ...v, economiaPotencial: v.valorPago! * 0.4 };
  assert.equal(explicarVereditos([adulterado], ctx, docs)[0]!.explicacaoInformativa!.reducaoDoItem!.coerenciaEconomia, false);
  // fora de INCORRETO_ECONOMIA a conferência não se aplica
  const correto = explicar([item(1, "19022000", "200", "200034", "2727")], [sim("19022000", "2727", id)]).explicados[0]!;
  assert.equal(correto.estado, "CORRETO");
  assert.equal(correto.regraAplicada, id);
  assert.equal(reducao(correto)!.coerenciaEconomia, null);
});

test("redução: item pendente mostra a redução como prevista, das candidatas", () => {
  const { explicados } = explicar([item(1, "19022000", "000", "000001", "2727")]);
  const x = explicados[0]!;
  assert.equal(x.estado, "REQUER_VALIDACAO");
  const d = reducao(x)!;
  assert.equal(d.situacao, "prevista");
  assert.deepEqual(d.opcoes.map((o) => [o.regraId, o.valor, o.evidencia]), [["19022000-200034-VII-9", 0.6, "oficial_confirmada"]]);
  assert.equal(d.coerenciaEconomia, null);
  // item sem candidatas nem regra aplicada: sem redução
  const semBeneficio = explicar([item(1, "22030000", "000", "000001", "A10")]).explicados[0]!;
  assert.equal(reducao(semBeneficio), null);
});

test("redução: bares e restaurantes usam o regime específico do motor (40%), sem evidência da base", () => {
  const bar: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: true };
  const natureza = new Map<string, NaturezaItem>([["P1", "preparado_no_local"]]);
  const { explicados } = explicar([item(1, "23099090", "200", "200047", "P1")], [], bar, natureza);
  const x = explicados[0]!;
  assert.equal(x.regraAplicada, "LC 214/2025, art. 275");
  const d = reducao(x)!;
  assert.equal(d.situacao, "regime_especifico");
  assert.deepEqual(d.regimeEspecifico, { valor: 0.4, fundamento: "LC 214/2025, art. 275", origem: "regime_especifico_motor" });
  assert.deepEqual(d.opcoes, []);
  // o regime não é uma regra da base: a explicação da "regra" continua não localizada, sem vínculo oficial criado
  const regra = x.explicacaoInformativa!.regras.find((r) => r.regraIdInformado === "LC 214/2025, art. 275")!;
  assert.equal(regra.vinculo, "nao_localizado");
  assert.equal(regra.reducao!.evidencia, "nao_determinada");
  assert.deepEqual(regra.reducao!.fatos, []);
});

test("redução: o veredito do motor é preservado (explicação não altera nenhum campo)", () => {
  const itens = [
    item(1, "28273993", "200", "200033", "A1"), item(2, "21069090", "000", "000001", "A2"), item(3, "23080000", "000", "000001", "A7"),
    item(4, "19022000", "000", "000001", "2727"), item(5, "19022000", "200", "200034", "2728"), item(6, "22030000", "000", "000001", "A10"),
  ];
  const validacoes = [sim("19022000", "2727", "19022000-200034-VII-9"), sim("19022000", "2728", "19022000-200034-VII-9")];
  const { vereditos, antes, explicados } = explicar(itens, validacoes);
  assert.equal(JSON.stringify(vereditos), antes, "o explicador não altera os vereditos recebidos");
  const semExplicacao = explicados.map(({ explicacaoInformativa: _e, ...v }) => v);
  assert.equal(JSON.stringify(semExplicacao), antes, "fora da explicação, os vereditos são os do motor");
  // o mesmo item classificado sozinho dá o mesmo veredito (a redução exibida não entra no motor)
  const soMotor = classificarItem(doc("RED", itens), itens[3]!, { base, empresa, validacoes, agora: AGORA });
  assert.deepEqual(soMotor, vereditos[3]);
});
