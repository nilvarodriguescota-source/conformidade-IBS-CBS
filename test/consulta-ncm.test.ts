/**
 * Consulta Tributária por NCM (aba nova). A consulta só monta a entrada: o resultado tem de ser o do motor
 * (classificarItem) e do explicador existentes, sem regra criada, aproximada ou copiada de outro NCM.
 * Data fixa: 28/09/2026 (grupo IBS/CBS já exigido; alíquotas de teste CBS 0,9% + IBS 0,1%).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { carregarContexto } from "../src/explicador.js";
import { bloqueiosParaBase, chavesBloqueadas } from "../src/bloqueios.js";
import { classificarItem } from "../src/motor.js";
import { consultarNcm, normalizarNcm, CPROD_CONSULTA, type ContextoConsultaNcm } from "../src/consulta-ncm.js";
import type { Empresa } from "../src/tipos.js";

const AGORA = "2026-09-28T12:00:00Z";
const shaBase = () => createHash("sha256").update(readFileSync("data/base-normativa.json")).digest("hex");
const shaAntes = shaBase();
const explicacao = carregarContexto({
  base: "data/base-normativa.json", v2: "data/base-normativa.v2.json", matriz: "docs/etapa6/matriz-decisao.json", empresa: "empresa.json",
});
const bloqueios = bloqueiosParaBase("data/base-normativa.json");
const empresa: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: false };
const ctx: ContextoConsultaNcm = { base: explicacao.base, empresa, explicacao, bloqueios, regrasBloqueadas: chavesBloqueadas(bloqueios), agora: AGORA };
const consultar = (ncm: string, extra: { modelo?: string; natureza?: string } = {}, c: ContextoConsultaNcm = ctx) => {
  const r = consultarNcm({ ncm, ...extra }, c);
  if (!r.ok) throw new Error(r.erro);
  return r;
};

test("1. NCM válido com pontuação: 1901.20.90 vira 19012090", () => {
  assert.deepEqual(normalizarNcm("1901.20.90"), { ok: true, ncm: "19012090" });
  const r = consultar("1901.20.90");
  assert.equal(r.ncm, "19012090");
  assert.equal(r.parametros.entrada, "1901.20.90");
});

test("2. NCM válido sem pontuação: mesmo resultado que com pontuação", () => {
  const com = consultar("1901.20.90"), sem = consultar("19012090");
  assert.deepEqual(sem.veredito, com.veredito);
  assert.deepEqual(sem.regras, com.regras);
  assert.deepEqual(sem.conclusao, com.conclusao);
});

test("3. Formato inválido: não consulta, não completa, não aproxima", () => {
  for (const [entrada, trecho] of [["", "Informe o NCM"], ["123", "8 dígitos"], ["1901.20.9", "8 dígitos"], ["19012090A", "inválido"], ["190120901", "8 dígitos"]] as const) {
    const r = consultarNcm({ ncm: entrada }, ctx);
    assert.equal(r.ok, false, entrada);
    assert.match((r as { erro: string }).erro, new RegExp(trecho));
  }
  assert.equal(consultarNcm({ ncm: "19012090", modelo: "57" }, ctx).ok, false);
  assert.equal(consultarNcm({ ncm: "19012090", natureza: "outra" }, ctx).ok, false);
});

test("4. NCM existente com regra: a regra da base é a candidata do motor e fica pendente de confirmação humana", () => {
  const r = consultar("19012090");
  assert.equal(r.encontradoNaBase, true);
  assert.deepEqual(r.veredito.regrasCandidatas, ["19012090-200003-I-16"]);
  assert.equal(r.veredito.esperado, null, "benefício sem confirmação humana não vira enquadramento");
  assert.equal(r.conclusao.tipo, "REQUER_VALIDACAO_HUMANA");
  const g = r.regras.find((x) => x.id === "19012090-200003-I-16")!;
  assert.equal(g.situacao, "candidata");
  assert.equal(g.cClassTrib, "200003");
  assert.ok(g.descricaoLegal.length > 0 && g.fundamentoLegal.length > 0);
  assert.equal(g.aliquotaEfetiva, 0, "alíquota zero (redução de 100%)");
});

test("5. O resultado é o do motor existente: mesmo veredito de classificarItem com a mesma entrada", () => {
  for (const ncm of ["19012090", "21069090", "22011000", "02074300"]) {
    const r = consultar(ncm);
    const doc = { chave: null, modelo: "65", numero: null, serie: null, dataEmissao: AGORA, tipoOperacao: "saida" as const, finalidade: "1", situacao: null, cancelado: false,
      emitente: { cnpj: empresa.cnpj, crt: null, uf: null }, destinatario: { cnpj: null, cpf: null, uf: null, indIEDest: null }, itens: [], arquivo: `consulta-ncm-${ncm}`, avisos: [] };
    const item = { nItem: 1, cProd: CPROD_CONSULTA, xProd: "", ncm, cfop: null, quantidade: null, valorProduto: 0, desconto: 0, baseCalculo: 0, cst: null, cClassTrib: null, aliquotas: {} };
    const direto = classificarItem(doc, item, { base: ctx.base, empresa, validacoes: [], agora: AGORA, regrasBloqueadas: ctx.regrasBloqueadas });
    const { explicacaoInformativa: _e, ...semExplicacao } = r.veredito;
    assert.deepEqual(semExplicacao, direto, ncm);
  }
});

test("6. NCM com múltiplas possibilidades: todas as candidatas, nenhuma escolhida", () => {
  const r = consultar("21069090");
  assert.equal(r.veredito.regrasCandidatas.length, 9);
  assert.equal(r.veredito.esperado, null);
  assert.equal(r.veredito.regraAplicada, null);
  assert.equal(r.conclusao.tipo, "REQUER_VALIDACAO_HUMANA");
  assert.ok(r.alertas.some((a) => a.codigo === "MULTIPLAS_REGRAS_CANDIDATAS"));
  assert.equal(r.regras.filter((g) => g.situacao === "candidata").length, 9);
});

test("7. NCM sem regra: regra geral do motor, sem regra inventada nem copiada de outro NCM", () => {
  const r = consultar("22011000");
  assert.deepEqual(r.regras, []);
  assert.deepEqual(r.veredito.regrasCandidatas, []);
  assert.deepEqual(r.veredito.esperado, { cst: "000", cClassTrib: "000001" });
  assert.equal(r.conclusao.tipo, "REGRA_GERAL_SEM_BENEFICIO");
  assert.equal(r.encontradoNaBase, false);
  assert.ok(r.veredito.explicacaoInformativa!.ausencias.includes("SEM_REGRA_NA_BASE"));
  assert.ok(r.alertas.some((a) => a.codigo === "SEM_REGRA_NA_BASE"));
});

test("8. NCM com lacuna de fonte: LACUNA_FONTE_SEM_REGRA exibida, nenhuma regra criada", () => {
  // A base atual não tem lacunas abertas (D5 incluiu as oficiais); a lacuna é acrescentada só a uma cópia do contexto
  const fato = explicacao.v2.vinculacoes.codigo.flatMap((c) => (c as unknown as { fatos?: unknown[] }).fatos ?? [])[0];
  const lacuna = { id: "teste-lacuna", cClassTrib: "200003", ncm: "22011000", fatos: fato ? [fato] : [], regrasDeOutrosCodigosComEstaNcm: [] };
  const v2 = { ...explicacao.v2, vinculacoes: { ...explicacao.v2.vinculacoes, ncmsOficiaisSemRegra: [lacuna as never] } };
  const r = consultar("22011000", {}, { ...ctx, explicacao: { ...explicacao, v2 } });
  const x = r.veredito.explicacaoInformativa!;
  assert.equal(x.lacunas.length, 1);
  assert.equal(x.lacunas[0]!.status, "LACUNA_FONTE_SEM_REGRA");
  assert.equal(x.lacunas[0]!.inclusaoComoRegra.status, "pendente");
  assert.deepEqual(r.regras, [], "a lacuna não vira regra");
  assert.deepEqual(r.veredito.esperado, { cst: "000", cClassTrib: "000001" }, "o motor não usa a lacuna");
  assert.equal(r.encontradoNaBase, true);
  assert.match(r.conclusao.texto, /lacuna da fonte/);
  assert.ok(r.alertas.some((a) => a.codigo === "LACUNA_FONTE_SEM_REGRA"));
  assert.equal(explicacao.v2.vinculacoes.ncmsOficiaisSemRegra.length, 0, "o contexto original não foi alterado");
});

test("9. Confirmação humana: pendente; respostas do empresa.json e de produtos não são aproveitadas", () => {
  const sim = { ncm: "19012090", cProd: CPROD_CONSULTA, regraId: "19012090-200003-I-16", resposta: "SIM" as const, autor: "Teste", data: "2026-09-28" };
  const comResposta = { ...ctx, explicacao: { ...explicacao, validacoes: [sim] } };
  const r = consultar("19012090", {}, comResposta);
  assert.equal(r.veredito.esperado, null);
  assert.equal(r.veredito.explicacaoInformativa!.statusBeneficio?.status, "BENEFICIO_PENDENTE_VALIDACAO");
  assert.deepEqual(r.veredito.explicacaoInformativa!.humanoConfirmou, []);
  assert.deepEqual(r.veredito.explicacaoInformativa!.validacoesLegadas, []);
});

test("10. NCM com conflito entre fontes: status e alerta preservados, sem decisão automática", () => {
  const r = consultar("17025000");
  assert.ok(r.veredito.explicacaoInformativa!.regras.some((e) => e.statusNormativo === "CONFLITO_ENTRE_FONTES"));
  assert.equal(r.veredito.explicacaoInformativa!.nivelEvidencia, "divergente");
  assert.ok(r.alertas.some((a) => a.categoria === "CONFLITO"));
  assert.equal(r.veredito.esperado, null);
  assert.equal(r.conclusao.tipo, "REQUER_VALIDACAO_HUMANA");
});

test("11. Vedação: regra bloqueada pela fonte oficial não é candidata", () => {
  const r = consultar("02074300");
  const g = r.regras.find((x) => x.id === "02074300-200003-I-19")!;
  assert.equal(g.situacao, "bloqueada");
  assert.ok(r.veredito.regrasBloqueadas?.includes("02074300-200003-I-19"));
  assert.ok(!r.veredito.regrasCandidatas.includes("02074300-200003-I-19"));
  assert.ok(r.veredito.explicacaoInformativa!.regras.some((e) => e.bloqueio));
});

test("12. Natureza informada usa o regime do motor (bares e restaurantes, art. 275)", () => {
  const r = consultar("19012090", { natureza: "preparado_no_local" });
  assert.deepEqual(r.veredito.esperado, { cst: "200", cClassTrib: "200047" });
  assert.equal(r.conclusao.tipo, "ENQUADRAMENTO_DETERMINADO");
  assert.equal(r.parametros.naturezaOrigem, "informada_na_consulta");
});

test("13. A consulta não altera a base normativa", () => {
  consultar("21069090");
  assert.equal(shaBase(), shaAntes);
});
