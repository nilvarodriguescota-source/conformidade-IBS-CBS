/**
 * Regra encontrada ≠ benefício aplicável.
 *
 * O NCM localiza a regra; quando a lei descreve um produto específico dentro do
 * código ("comumente denominado…", ou código residual "Outros" na TIPI), o
 * percentual da regra só vale para o produto que corresponde à descrição legal.
 * Caso guia: BOLO BANDEJA, NCM 1905.90.90, regra 19059090-200003-I-16 (pão francês, 100%).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { classificarDocumentos, classificarItem } from "../src/motor.js";
import { filaDeValidacao } from "../src/indicadores.js";
import { explicarVereditos, carregarContexto } from "../src/explicador.js";
import { exigeDescricao, requisitoNaoAtendido } from "../src/requisitos-legais.js";
import type { BaseNormativa, Documento, Empresa, ItemDocumento, RespostaValidacao } from "../src/tipos.js";

const base = JSON.parse(readFileSync("data/base-normativa.json", "utf8")) as BaseNormativa;
const AGORA = "2026-09-20T00:00:00Z";
const empresa: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: false };
const ITEM16 = "19059090-200003-I-16";

function doc(itens: ItemDocumento[] = []): Documento {
  return {
    chave: "43260900000000000000650010000000011000000017", modelo: "65", numero: "1", serie: "1",
    dataEmissao: "2026-09-01T12:00:00-03:00", tipoOperacao: "saida", finalidade: "1", situacao: "100", cancelado: false,
    emitente: { cnpj: "00000000000000", crt: "3", uf: "SC" }, destinatario: { cnpj: null, cpf: null, uf: "SC", indIEDest: "9" },
    itens, arquivo: "t.xml", avisos: [],
  };
}

function item(xProd: string, ncm: string, p: Partial<ItemDocumento> = {}): ItemDocumento {
  return {
    nItem: 1, cProd: "20500003", xProd, ncm, cfop: "5102", quantidade: 1, valorProduto: 1000, desconto: 0,
    baseCalculo: 1000, cst: "000", cClassTrib: "000001", aliquotas: {}, ...p,
  };
}

const sim = (ncm: string, regraId: string, cProd = "20500003"): RespostaValidacao =>
  ({ ncm, cProd, regraId, resposta: "SIM", autor: "teste", data: "2026-09-20" });

const classificar = (i: ItemDocumento, validacoes: RespostaValidacao[] = []) =>
  classificarItem(doc(), i, { base, empresa, validacoes, agora: AGORA });

test("BOLO BANDEJA (1905.90.90): o Item 16 é encontrado, mas NÃO é aplicado — nem 100%, nem alíquota zero", () => {
  const v = classificar(item("BOLO BANDEJA", "19059090", { baseCalculo: 17.51, valorProduto: 17.51 }));
  // Regra encontrada (localização pelo NCM)
  assert.ok(v.regrasCandidatas.includes(ITEM16));
  // …porém não aplicável ao produto
  const na = v.regrasNaoAplicaveis?.find((x) => x.regraId === ITEM16);
  assert.ok(na, "o Item 16 precisa constar como regra não aplicável");
  assert.equal(na!.cClassTrib, "200003");
  assert.equal(na!.cst, "200");
  assert.equal(na!.anexo, "I");
  assert.equal(na!.item, "16");
  assert.equal(na!.reducaoPrevista, 1, "100% é o percentual previsto NA REGRA");
  assert.match(na!.designacaoLegal, /pão francês/);
  assert.match(na!.motivo, /Regra encontrada pelo NCM: CST 200 \/ cClassTrib 200003 \/ Anexo I \/ Item 16/);
  assert.match(na!.motivo, /Redução prevista na regra: 100% IBS \/ 100% CBS/);
  assert.match(na!.motivo, /NÃO APLICÁVEL AO PRODUTO/);
  assert.match(na!.motivo, /"BOLO BANDEJA"/);
  assert.match(na!.motivo, /A redução de 100% NÃO deve ser aplicada/);

  // Nenhum valor do item usa os 100% do Item 16
  assert.equal(v.regraAplicada, null);
  assert.notEqual(v.esperado?.cClassTrib, "200003");
  assert.equal(v.economiaSujeitaValidacao, 0, "sem regra aplicável não há economia estimada");
  assert.equal(v.economiaPotencial, null);
  // Sem outra regra validável automaticamente: aguarda validação humana
  assert.equal(v.estado, "REQUER_VALIDACAO");
  assert.match(v.motivo, /aguarda validação humana/);
});

test("BOLO BANDEJA sem grupo IBS/CBS: exposição integral, não alíquota zero", () => {
  const v = classificar(item("BOLO BANDEJA", "19059090", { cst: null, cClassTrib: null }));
  assert.equal(v.estado, "REQUER_VALIDACAO");
  assert.equal(v.esperado, null);
  // base 1000 × 1% (alíquotas de teste 2026) × (1 − 0): o Item 16 rejeitado não zera a exposição
  assert.equal(Number(v.exposicao!.toFixed(2)), 10);
});

test("BOLO BANDEJA: a explicação não mostra os 100% como redução prevista do produto; a fila registra a rejeição", () => {
  const docs = [doc([item("BOLO BANDEJA", "19059090")])];
  const vereditos = classificarDocumentos(docs, { base, empresa, agora: AGORA });
  const ctx = carregarContexto({ base: "data/base-normativa.json", v2: "data/base-normativa.v2.json", matriz: "docs/etapa6/matriz-decisao.json", empresa: "test/fixtures/empresa-teste.json" });
  const x = explicarVereditos(vereditos, ctx, docs)[0]!;
  assert.equal(x.explicacaoInformativa!.reducaoDoItem, null);
  const fila = filaDeValidacao(vereditos);
  assert.equal(fila[0]!.regrasNaoAplicaveis[0]!.regraId, ITEM16);
});

test("PÃO FRANCÊS (1905.90.90): o Item 16 continua candidato e, confirmado, aplica 100%", () => {
  const pendente = classificar(item("PAO FRANCES KG", "19059090"));
  assert.equal(pendente.regrasNaoAplicaveis, undefined);
  assert.equal(pendente.estado, "REQUER_VALIDACAO");
  assert.ok(pendente.economiaSujeitaValidacao! > 0);
  const confirmado = classificar(item("PAO FRANCES KG", "19059090"), [sim("19059090", ITEM16)]);
  assert.deepEqual(confirmado.esperado, { cst: "200", cClassTrib: "200003" });
  assert.equal(confirmado.regraAplicada, ITEM16);
});

test("reenquadramento: 100% rejeitado pela descrição, as regras de 60% do NCM continuam e só elas contam", () => {
  // 9021.90.19 (TIPI "Outros"): implantes cocleares 100% (Anexo XII) e espaçador de tendão 60% (Anexo IV)
  const v = classificar(item("ESPACADOR DE TENDAO", "90219019"));
  assert.ok(v.regrasNaoAplicaveis!.some((x) => x.reducaoPrevista === 1 && /cocleares/i.test(x.designacaoLegal)));
  assert.match(v.motivo, /Reenquadramento entre as demais regras do NCM/);
  assert.equal(v.estado, "REQUER_VALIDACAO");
  // Estimativa usa só as regras aplicáveis (60%), nunca os 100% rejeitados
  assert.ok(Math.abs(v.economiaSujeitaValidacao! - v.valorPago! * 0.6) < 1e-9);
  const espacador = base.regras.find((r) => r.ncm === "90219019" && /Espaçador de tendão/.test(r.descricaoLegal))!;
  const confirmado = classificar(item("ESPACADOR DE TENDAO", "90219019"), [sim("90219019", espacador.id)]);
  assert.deepEqual(confirmado.esperado, { cst: espacador.cst, cClassTrib: espacador.cClassTrib });
  assert.equal(espacador.reducaoAliquota, 0.6);
});

test("produto com 60% em código coberto por inteiro (pastel, 1902.20.00): nada é rejeitado; confirmado, aplica 60%", () => {
  const id = "19022000-200034-VII-9";
  const pendente = classificar(item("PASTEL DE CARNE", "19022000"));
  assert.equal(pendente.regrasNaoAplicaveis, undefined);
  const v = classificar(item("PASTEL DE CARNE", "19022000"), [sim("19022000", id)]);
  assert.deepEqual(v.esperado, { cst: "200", cClassTrib: "200034" });
  assert.equal(v.estado, "INCORRETO_ECONOMIA");
  assert.ok(Math.abs(v.economiaPotencial! - v.valorPago! * 0.6) < 1e-9);
});

test("produto sem benefício (cerveja, 2203.00.00): tributação integral, sem regra encontrada", () => {
  const v = classificar(item("CERVEJA LATA", "22030000"));
  assert.equal(v.estado, "CORRETO");
  assert.deepEqual(v.esperado, { cst: "000", cClassTrib: "000001" });
  assert.deepEqual(v.regrasCandidatas, []);
});

test("SIM humano prevalece sobre a rejeição automática (quem conhece o produto decide)", () => {
  const v = classificar(item("BOLO BANDEJA", "19059090"), [sim("19059090", ITEM16)]);
  assert.equal(v.regrasNaoAplicaveis, undefined);
  assert.deepEqual(v.esperado, { cst: "200", cClassTrib: "200003" });
});

test("critério: a descrição só rejeita quando a lei recorta o produto dentro do código", () => {
  assert.equal(exigeDescricao("Pão comumente denominado pão francês…", "Outros"), true);
  assert.equal(exigeDescricao("Implantes cocleares 9021.90.19", "Outros"), true);
  assert.equal(exigeDescricao("Massas alimentícias dos códigos 1902.20.00 e 1902.30.00", "Massas alimentícias recheadas"), false);
  assert.equal(exigeDescricao("Pão de Forma do código 1905.90.10 da NCM/SH", "Pão de forma"), false);
  // descrição genérica não identifica o produto: não rejeita
  assert.equal(requisitoNaoAtendido("PRODUTO", "Pão comumente denominado pão francês", "Outros"), null);
});

test("designação inteira: PÃO DE QUEIJO e PÃO DOCE não são pão francês; categoria (Produtos hortícolas) não rejeita", () => {
  for (const p of ["PAO DE QUEIJO PEQUENO", "PÃO DOCE KG", "PAO CIABATTA KG"]) {
    assert.ok(classificar(item(p, "19059090")).regrasNaoAplicaveis?.some((x) => x.regraId === ITEM16), p);
  }
  for (const p of ["PAO FRANCES  KG", "PAO FRANCES INTEGRAL KG", "PÃO FRANCÊS COM BOLINHO"]) {
    assert.equal(classificar(item(p, "19059090")).regrasNaoAplicaveis, undefined, p);
  }
  assert.equal(requisitoNaoAtendido("ADC ALFACE", "Produtos hortícolas das posições 07.01…", "Outros"), null);
});
