/**
 * Pergunta de validação em múltipla escolha ("O que é este produto?") e o efeito
 * de cada escolha no motor. Caso guia: BRUSQUETA ESPECIAL KG, NCM 1905.90.90,
 * cuja única regra de benefício é a do pão francês (Anexo I, 100%).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { lerRespostas, registrarResposta } from "../src/analise-atual.js";
import { classificarItem, escolhaDoProduto } from "../src/motor.js";
import { descricaoContradiz, designacaoEspecifica, opcoesDaPergunta, type RegraParaPergunta } from "../src/opcoes-validacao.js";
import type { BaseNormativa, Documento, Empresa, ItemDocumento, RespostaValidacao } from "../src/tipos.js";

const base = JSON.parse(readFileSync("data/base-normativa.json", "utf8")) as BaseNormativa;
const AGORA = "2026-09-20T00:00:00Z";
const NCM = "19059090";
const PRODUTO = "BRUSQUETA ESPECIAL KG";
const regraPao = base.regras.find((r) => r.ncm === NCM)!;
const empresa: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: false };

function doc(): Documento {
  return {
    chave: "43260900000000000000650010000000011000000017",
    modelo: "65",
    numero: "1",
    serie: "1",
    dataEmissao: "2026-09-01T12:00:00-03:00",
    tipoOperacao: "saida",
    finalidade: "1",
    situacao: "100",
    cancelado: false,
    emitente: { cnpj: "00000000000000", crt: "3", uf: "SC" },
    destinatario: { cnpj: null, cpf: null, uf: "SC", indIEDest: "9" },
    itens: [],
    arquivo: "t.xml",
    avisos: [],
  };
}

function item(p: Partial<ItemDocumento> = {}): ItemDocumento {
  return {
    nItem: 1,
    cProd: "698",
    xProd: PRODUTO,
    ncm: NCM,
    cfop: "5102",
    quantidade: 1,
    valorProduto: 1000,
    desconto: 0,
    baseCalculo: 1000,
    cst: "000",
    cClassTrib: "000001",
    aliquotas: {},
    ...p,
  };
}

function resposta(p: Partial<RespostaValidacao>): RespostaValidacao {
  return { ncm: NCM, cProd: "698", regraId: regraPao.id, resposta: "NAO", autor: "teste", data: "2026-10-03", ...p };
}

function classificar(validacoes: RespostaValidacao[]) {
  return classificarItem(doc(), item(), { base, empresa, validacoes, agora: AGORA });
}

const regrasDaPergunta: RegraParaPergunta[] = [
  {
    id: regraPao.id,
    cst: regraPao.cst,
    cClassTrib: regraPao.cClassTrib,
    anexo: regraPao.anexo,
    item: regraPao.item,
    descricaoLegal: regraPao.descricaoLegal,
    fundamentoLegal: regraPao.fundamentoLegal,
    reducaoAliquota: regraPao.reducaoAliquota,
  },
];

test("pergunta da brusqueta: opções com o resultado de cada uma, nunca 60% inventado", () => {
  const opcoes = opcoesDaPergunta(NCM, PRODUTO, regrasDaPergunta);
  assert.deepEqual(opcoes.map((o) => o.tipo), ["REGRA", "CONSUMO_NO_LOCAL", "MERCADORIA_SEM_BENEFICIO", "NCM_INCORRETO"]);

  const pao = opcoes[0]!;
  assert.match(pao.rotulo, /É pão francês/);
  assert.match(pao.resultado, /Redução de 100%.*200003/);
  assert.match(pao.naoRecomendada!, /não corresponde a "pão francês"/);

  const local = opcoes[1]!;
  assert.match(local.resultado, /Redução de 40%.*200047/);
  assert.match(local.explicacao, /art\. 275/);

  const mercadoria = opcoes[2]!;
  assert.match(mercadoria.resultado, /Tributação integral.*000001/);
  assert.match(mercadoria.explicacao, /Não há regra de redução de 60% para o NCM 19059090/);

  assert.match(opcoes[3]!.explicacao, /não é transferido/);
  assert.ok(opcoes.every((o) => !/60%/.test(o.resultado)), "nenhuma opção promete 60% sem regra");
});

test("descrição compatível não é marcada como não recomendada; enumeração não contradiz", () => {
  assert.equal(descricaoContradiz("PAO FRANCES KG", regraPao.descricaoLegal), null);
  assert.equal(designacaoEspecifica("Frutas, produtos hortícolas e demais produtos vegetais, sem adição de açúcar"), null);
  assert.equal(designacaoEspecifica("Pão de Forma do código 1905.90.10 da NCM/SH"), "Pão de Forma");
});

test("escolha CONSUMO_NO_LOCAL: regime de bares e restaurantes, 40% (200047)", () => {
  const v = classificar([resposta({ escolha: "CONSUMO_NO_LOCAL" })]);
  assert.deepEqual(v.esperado, { cst: "200", cClassTrib: "200047" });
  assert.match(v.motivo, /art\. 275/);
  assert.equal(v.estado, "INCORRETO_ECONOMIA");
});

test("escolha MERCADORIA_SEM_BENEFICIO: integral com a verificação explicada", () => {
  const v = classificar([resposta({ escolha: "MERCADORIA_SEM_BENEFICIO" })]);
  assert.deepEqual(v.esperado, { cst: "000", cClassTrib: "000001" });
  assert.equal(v.estado, "CORRETO");
  assert.match(v.motivo, /vendido como mercadoria/);
  assert.match(v.motivo, /art\. 275\) não vale para mercadoria/);
  assert.equal(v.ncmACorrigir, undefined);
});

test("escolha NCM_INCORRETO: resultado INCORRETO com aviso de ajuste do NCM, sem benefício de outro NCM", () => {
  const v = classificar([resposta({ escolha: "NCM_INCORRETO" })]);
  assert.equal(v.estado, "INCORRETO_NCM");
  assert.equal(v.esperado, null);
  assert.match(v.motivo, /^AJUSTAR O NCM/);
  assert.equal(v.ncmACorrigir, true);
  assert.equal(v.regraAplicada, null, "nenhum benefício (nem de outro NCM) é aplicado");
  assert.match(v.motivo, /Corrigir o NCM no cadastro do produto no ERP/);
});

test("vale a última ação gravada: SIM depois de uma escolha a substitui (e vice-versa)", () => {
  // Mesma gravação do servidor: a resposta nova da mesma regra substitui a anterior.
  const pasta = mkdtempSync(join(tmpdir(), "validacao-"));
  registrarResposta(pasta, resposta({ escolha: "CONSUMO_NO_LOCAL" }));
  registrarResposta(pasta, resposta({ resposta: "SIM" }));
  assert.deepEqual(classificar(lerRespostas(pasta)).esperado, { cst: "200", cClassTrib: "200003" });

  registrarResposta(pasta, resposta({ escolha: "MERCADORIA_SEM_BENEFICIO" }));
  assert.deepEqual(classificar(lerRespostas(pasta)).esperado, { cst: "000", cClassTrib: "000001" });

  assert.equal(escolhaDoProduto([resposta({ escolha: "CONSUMO_NO_LOCAL" })], "99999999", item()), null, "escolha de outro NCM não vale");
});

test("NÃO antigo, sem escolha, continua funcionando como antes", () => {
  const v = classificar([resposta({})]);
  assert.deepEqual(v.esperado, { cst: "000", cClassTrib: "000001" });
  assert.match(v.motivo, /Todas as regras do NCM foram descartadas/);
  assert.doesNotMatch(v.motivo, /vendido como mercadoria/);
});

test("painel: códigos únicos avaliados não mudam após validações e a soma das categorias fecha", async () => {
  const { calcularIndicadores } = await import("../src/indicadores.js");
  const itens = [
    item({ cProd: "698" }),
    item({ cProd: "P2", xProd: "PAO FRANCES KG" }),
    item({ cProd: "P3", xProd: "CERVEJA", ncm: "22030000" }),
    item({ cProd: "P4", xProd: "AGUA", ncm: "22011000", cst: null, cClassTrib: null }),
  ];
  const rodar = (validacoes: RespostaValidacao[]) =>
    calcularIndicadores(itens.map((i) => classificarItem(doc(), i, { base, empresa, validacoes, agora: AGORA })));
  const antes = rodar([]);
  const depois = rodar([
    resposta({ escolha: "NCM_INCORRETO" }),
    resposta({ cProd: "P2", resposta: "SIM" }),
  ]);
  for (const ind of [antes, depois]) {
    assert.equal(ind.codigosAvaliados, 4);
    assert.equal(ind.codigosCorretos + ind.codigosRecalculo + ind.codigosNcmAjustar + ind.codigosPendentes, ind.codigosAvaliados);
  }
  assert.equal(depois.codigosNcmAjustar, 1, "brusqueta com NCM a ajustar continua contada");
  assert.equal(depois.codigosIncorretos, 1, "incorretos são só os de NCM a ajustar");
});
