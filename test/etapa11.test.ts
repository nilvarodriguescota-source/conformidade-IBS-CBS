/**
 * Etapa 11: análise dos NCMs importados. Os dez casos pedidos na auditoria, com a razão legal de cada um.
 * Documento: NFC-e de 01/09/2026 (grupo IBS/CBS já obrigatório: Ato Conjunto RFB/CGIBS nº 4/2026);
 * alíquotas de teste de 2026: CBS 0,9% + IBS 0,1% = 1%. Base de cálculo 1.000.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { classificarItem } from "../src/motor.js";
import { bloqueiosParaBase, chavesBloqueadas } from "../src/bloqueios.js";
import { calcularIndicadores, filaDeValidacao } from "../src/indicadores.js";
import { lerXml, selecionarVendas } from "../src/parser.js";
import { composicaoDosXmls } from "../src/processador.js";
import type { BaseNormativa, Documento, Empresa, ItemDocumento, RespostaValidacao } from "../src/tipos.js";

const base = JSON.parse(readFileSync("data/base-normativa.json", "utf8")) as BaseNormativa;
const regrasBloqueadas = chavesBloqueadas(bloqueiosParaBase("data/base-normativa.json"));
const empresa: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: false };
const AGORA = "2026-09-27T00:00:00Z";

const doc = (): Documento => ({
  chave: "42260900000000000000650010000000011000000017", modelo: "65", numero: "1", serie: "1", dataEmissao: "2026-09-01T12:00:00-03:00",
  tipoOperacao: "saida", finalidade: "1", situacao: "100", cancelado: false,
  emitente: { cnpj: "00000000000000", crt: "3", uf: "SC" }, destinatario: { cnpj: null, cpf: null, uf: "SC", indIEDest: "9" },
  itens: [], arquivo: "t.xml", avisos: [],
});
const item = (p: Partial<ItemDocumento> & { ncm: string }): ItemDocumento => ({
  nItem: 1, cProd: "P1", xProd: "PRODUTO", cfop: "5102", quantidade: 1, valorProduto: 1000, desconto: 0, baseCalculo: 1000,
  cst: null, cClassTrib: null, aliquotas: {}, ...p,
});
const classificar = (i: ItemDocumento, validacoes: RespostaValidacao[] = []) =>
  classificarItem(doc(), i, { base, empresa, validacoes, agora: AGORA, regrasBloqueadas });
const sim = (ncm: string, regraId: string): RespostaValidacao => ({ ncm, cProd: "P1", regraId, resposta: "SIM", autor: "Teste", data: "2026-09-27" });
const reais = (x: number | null | undefined) => (x == null ? null : Number(x.toFixed(2)));

test("1. NCM 2106.90.90 (outras preparações): não assume a regra geral; depende da validação", () => {
  // Anexo I, item 4 (fórmulas infantis, 200003, 100%) e Anexo VI, itens 39 a 46 (fórmulas nutricionais, 200033, 60%)
  const v = classificar(item({ ncm: "21069090", xProd: "BUFFET ALMOÇO", cst: "000", cClassTrib: "000001" }));
  assert.equal(v.estado, "REQUER_VALIDACAO");
  assert.equal(v.esperado, null);
  assert.ok(v.regrasCandidatas.includes("21069090-200003-I-4") && v.regrasCandidatas.includes("21069090-200033-VI-39"));
  assert.equal(v.economiaPotencial, null, "nada confirmado sem a resposta");
  assert.equal(reais(v.economiaSujeitaValidacao), 6, "estimativa: 1.000 × 1% × 60% (menor redução entre as candidatas)");
  // Mesmo produto sem o grupo IBS/CBS: risco, mas o esperado continua dependendo da validação
  const r = classificar(item({ ncm: "21069090", xProd: "BUFFET ALMOÇO" }));
  assert.equal(r.estado, "INCORRETO_RISCO");
  assert.equal(r.esperado, null);
  assert.match(r.motivo, /Enquadramento esperado: depende da validação/);
  assert.equal(reais(r.exposicao), 0, "mínimo devido: a maior redução possível é 100% (fórmula infantil)");
});

test("2. Refrigerante (2202.10.00): IBS/CBS pela regra geral; Imposto Seletivo informado com fonte e vigência", () => {
  const v = classificar(item({ ncm: "22021000", xProd: "COCA COLA 350ML", cst: "000", cClassTrib: "000001" }));
  assert.equal(v.estado, "CORRETO");
  assert.deepEqual(v.esperado, { cst: "000", cClassTrib: "000001" });
  assert.match(v.motivo, /Imposto Seletivo/);
  assert.match(v.motivo, /Anexo XVII/);
  assert.match(v.motivo, /arts\. 409, § 1º, V, 410 e 412, I/);
  assert.match(v.motivo, /Ainda não vigente na data do documento/);
});

test("3. Bebida alcoólica: regra geral no IBS/CBS, Imposto Seletivo informado; cerveja com NCM de refrigerante é sinalizada", () => {
  const cerveja = classificar(item({ ncm: "22030000", xProd: "CERVEJA HEINEKEN 330ML", cst: "000", cClassTrib: "000001" }));
  assert.equal(cerveja.estado, "CORRETO");
  assert.match(cerveja.motivo, /Bebida alcoólica do Anexo XVII/);
  assert.doesNotMatch(cerveja.motivo, /A descrição indica/);
  const errada = classificar(item({ ncm: "22021000", xProd: "CERVEJA EISENBAHN 355ML", cst: "000", cClassTrib: "000001" }));
  assert.equal(errada.estado, "CORRETO", "o IBS/CBS não muda; o NCM é que precisa ser conferido");
  assert.match(errada.motivo, /A descrição indica cerveja de malte \(posição 22\.03\), mas o NCM informado é 22021000/);
});

test("4. Produto com redução (validado): economia de 60% confirmada", () => {
  // 1902.20.00 (massas recheadas), Anexo VII, item 9: redução de 60% (art. 135)
  const v = classificar(item({ ncm: "19022000", xProd: "MINI PASTEL CARNE", cst: "000", cClassTrib: "000001" }), [sim("19022000", "19022000-200034-VII-9")]);
  assert.equal(v.estado, "INCORRETO_ECONOMIA");
  assert.deepEqual(v.esperado, { cst: "200", cClassTrib: "200034" });
  assert.equal(reais(v.valorPago), 10);
  assert.equal(reais(v.economiaPotencial), 6);
  assert.equal(reais(v.valorCorreto), 4);
  assert.equal(v.economiaSujeitaValidacao, null);
});

test("5. Produto vedado ao benefício: regra bloqueada, benefício usado vira risco", () => {
  // 0207.43.00 (fígado gordo): excluído expressamente do Anexo I, item 19; VEDADO no SVRS para 200003
  const v = classificar(item({ ncm: "02074300", xProd: "FOIE GRAS", cst: "200", cClassTrib: "200003" }));
  assert.equal(v.estado, "INCORRETO_RISCO");
  assert.ok(v.regrasBloqueadas?.includes("02074300-200003-I-19"));
  assert.deepEqual(v.esperado, { cst: "000", cClassTrib: "000001" });
  assert.equal(reais(v.exposicao), 10);
});

test("6. Classificação que deve permanecer: água mineral pela regra geral", () => {
  const v = classificar(item({ ncm: "22011000", xProd: "AGUA MINERAL SEM GAS 510 ML", cst: "000", cClassTrib: "000001" }));
  assert.equal(v.estado, "CORRETO");
  assert.deepEqual(v.regrasCandidatas, []);
  assert.equal(v.economiaSujeitaValidacao, null);
  assert.doesNotMatch(v.motivo, /Imposto Seletivo|A descrição indica/);
});

test("7. INCORRETO — risco com enquadramento determinado: esperado, fundamento e impacto", () => {
  const v = classificar(item({ ncm: "22011000", xProd: "AGUA MINERAL SEM GAS 510 ML" }));
  assert.equal(v.estado, "INCORRETO_RISCO");
  assert.deepEqual(v.esperado, { cst: "000", cClassTrib: "000001" });
  assert.match(v.motivo, /Grupo IBS\/CBS exigido e não informado no documento\. Enquadramento esperado: 000\/000001 \(regra geral, sem benefício aplicável\)/);
  assert.equal(reais(v.exposicao), 10, "1.000 × 1%, sem destaque no documento");
});

test("8. Pendência SIM/NÃO: produtos pendentes e riscos pendentes entram na fila; os determinados, não", () => {
  const pendente = { ...classificar(item({ ncm: "21069090", cProd: "A", xProd: "OMELETE", cst: "000", cClassTrib: "000001" })), cProd: "A" };
  const riscoPendente = { ...classificar(item({ ncm: "21069090", xProd: "BUFFET ALMOÇO" })), cProd: "B" };
  const riscoDeterminado = { ...classificar(item({ ncm: "22011000", xProd: "AGUA" })), cProd: "C" };
  const fila = filaDeValidacao([pendente, riscoPendente, riscoDeterminado]);
  assert.deepEqual(fila.map((f) => f.cProd).sort(), ["A", "B"]);
  assert.ok(fila.every((f) => f.regras.includes("21069090-200033-VI-39")));
  const ind = calcularIndicadores([pendente, riscoPendente, riscoDeterminado]);
  assert.equal(ind.economiaPotencial, 0, "a estimativa não se mistura com a economia confirmada");
  assert.equal(ind.economiaSujeitaValidacao, 6);
  assert.equal(ind.exposicao, 10);
});

test("9. Produto já validado: SIM aplicado ao fluxo; o documento que já usa o código fica CORRETO", () => {
  const v = classificar(item({ ncm: "19022000", xProd: "MINI PASTEL CARNE", cst: "200", cClassTrib: "200034" }), [sim("19022000", "19022000-200034-VII-9")]);
  assert.equal(v.estado, "CORRETO");
  assert.equal(v.regraAplicada, "19022000-200034-VII-9");
  // Risco validado: o esperado passa a ser o benefício confirmado
  const r = classificar(item({ ncm: "19022000", xProd: "MINI PASTEL CARNE" }), [sim("19022000", "19022000-200034-VII-9")]);
  assert.equal(r.estado, "INCORRETO_RISCO");
  assert.deepEqual(r.esperado, { cst: "200", cClassTrib: "200034" });
  assert.equal(reais(r.exposicao), 4, "1.000 × 1% × (1 − 60%)");
});

test("10. XML processado que não gera documento de venda: evento de cancelamento", () => {
  const pasta = "analise-atual/xmls/";
  const chave = "42260843935359000163650010004011641683913320";
  const arquivos = [`${pasta}${chave}.xml`, `${pasta}${chave}-Cancelamento.xml`];
  const leituras = arquivos.map((a) => lerXml(readFileSync(a, "utf8"), a));
  assert.equal(leituras[1]!.documentos.length, 0, "o evento não é documento");
  assert.ok(leituras[1]!.cancelamentos.has(chave));
  const selecao = selecionarVendas(leituras);
  const c = composicaoDosXmls(arquivos, leituras, selecao);
  assert.equal(c.arquivos, 2);
  assert.equal(c.documentosLidos, 1);
  assert.equal(c.documentosAnalisados, 0);
  assert.deepEqual(c.eventos.map((e) => e.arquivo), [`${chave}-Cancelamento.xml`]);
  assert.deepEqual(c.descartadosPorMotivo, { "cancelada por evento 110111": 1 });
});
