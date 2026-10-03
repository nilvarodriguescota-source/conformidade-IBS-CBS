/**
 * Cenários tributários. Cada caso registra o resultado esperado e a razão legal,
 * e não apenas o que a planilha fazia.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { classificarItem } from "../src/motor.js";
import { aliquotaVigente } from "../src/parametros.js";
import type { BaseNormativa, Documento, Empresa, ItemDocumento, NaturezaItem } from "../src/tipos.js";

const base = JSON.parse(readFileSync("data/base-normativa.json", "utf8")) as BaseNormativa;
const AGORA = "2026-09-20T00:00:00Z";

function doc(dataEmissao = "2026-09-01T12:00:00-03:00", modelo = "65"): Documento {
  return {
    chave: "43260900000000000000650010000000011000000017",
    modelo,
    numero: "1",
    serie: "1",
    dataEmissao,
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

function item(p: Partial<ItemDocumento> & { ncm: string }): ItemDocumento {
  return {
    nItem: 1,
    cProd: "P1",
    xProd: "PRODUTO",
    cfop: "5102",
    quantidade: 1,
    valorProduto: 1000,
    desconto: 0,
    baseCalculo: 1000,
    cst: null,
    cClassTrib: null,
    aliquotas: {},
    ...p,
  };
}

const padaria: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: false };

test("NCM com um único enquadramento fica pendente de validação até a resposta humana", () => {
  // 1905.90.10 (pão de forma): Anexo VII, item 12, redução de 60%.
  const v = classificarItem(doc(), item({ ncm: "19059010", cst: "000", cClassTrib: "000001" }), {
    base,
    empresa: padaria,
    agora: AGORA,
  });
  assert.equal(v.estado, "REQUER_VALIDACAO");
  assert.equal(v.regrasCandidatas.length, 1);
  assert.match(v.motivo, /descrição legal/);
});

test("validação SIM aplica o benefício e calcula a economia pela alíquota vigente", () => {
  const regra = base.regras.find((r) => r.ncm === "19059010")!;
  const v = classificarItem(doc(), item({ ncm: "19059010", cst: "000", cClassTrib: "000001" }), {
    base,
    empresa: padaria,
    validacoes: [
      { ncm: "19059010", cProd: "P1", regraId: regra.id, resposta: "SIM", autor: "clara", data: "2026-09-20" },
    ],
    agora: AGORA,
  });
  assert.equal(v.estado, "INCORRETO_ECONOMIA");
  assert.deepEqual(v.esperado, { cst: "200", cClassTrib: "200034" });
  // base 1000 x (0,9% CBS + 0,1% IBS) x redução de 60%
  assert.equal(Number(v.economiaPotencial!.toFixed(2)), 6.0);
  assert.ok(v.aliquotaUsada.every((a) => a.tipo === "vigente"));
});

test("validação NÃO devolve o item à tributação integral", () => {
  const regra = base.regras.find((r) => r.ncm === "19059010")!;
  const v = classificarItem(doc(), item({ ncm: "19059010", cst: "000", cClassTrib: "000001" }), {
    base,
    empresa: padaria,
    validacoes: [
      { ncm: "19059010", cProd: "P1", regraId: regra.id, resposta: "NAO", autor: "clara", data: "2026-09-20" },
    ],
    agora: AGORA,
  });
  assert.equal(v.estado, "CORRETO");
  assert.match(v.motivo, /não se enquadra/);
});

test("NCM em dois anexos não duplica a linha: vira uma pendência com as duas opções", () => {
  // 1101.00.10 (farinha de trigo): Anexo I (alíquota zero) e Anexo VII (60%).
  const candidatas = base.regras.filter((r) => r.ncm === "11010010");
  assert.ok(candidatas.length > 1, "o NCM precisa ter mais de uma regra na base");
  const v = classificarItem(doc(), item({ ncm: "11010010", cst: "200", cClassTrib: "200003" }), {
    base,
    empresa: padaria,
    agora: AGORA,
  });
  assert.equal(v.estado, "REQUER_VALIDACAO");
  assert.equal(v.regrasCandidatas.length, candidatas.length);
  assert.match(v.motivo, /enquadramentos possíveis/);
});

test("benefício usado sem regra que o ampare: recálculo com valor a pagar (negativo na economia)", () => {
  const v = classificarItem(doc(), item({ ncm: "22030000", cst: "200", cClassTrib: "200034" }), {
    base,
    empresa: padaria,
    agora: AGORA,
  });
  assert.equal(v.estado, "INCORRETO_ECONOMIA");
  assert.equal(Number(v.exposicao!.toFixed(2)), 10.0); // 1000 x 1%
  assert.equal(Number(v.economiaPotencial!.toFixed(2)), -10);
});

test("bar: prato preparado no local usa o regime específico, não o anexo do NCM", () => {
  const bar: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: true };
  const natureza = new Map<string, NaturezaItem>([["P1", "preparado_no_local"]]);
  const correto = classificarItem(
    doc(),
    item({ ncm: "23099090", xProd: "PICANHA & FRITAS", cst: "200", cClassTrib: "200047" }),
    { base, empresa: bar, naturezaPorProduto: natureza, agora: AGORA },
  );
  assert.equal(correto.estado, "CORRETO");
  assert.match(correto.motivo, /art\. 275/);

  const errado = classificarItem(
    doc(),
    item({ ncm: "23099090", xProd: "PICANHA & FRITAS", cst: "200", cClassTrib: "200038" }),
    { base, empresa: bar, naturezaPorProduto: natureza, agora: AGORA },
  );
  // 200038 reduz 60%; o regime do art. 275 reduz 40%: o documento recolhe a menos (valor a pagar)
  assert.equal(errado.estado, "INCORRETO_ECONOMIA");
  assert.equal(Number(errado.economiaPotencial!.toFixed(2)), -2);
  assert.deepEqual(errado.esperado, { cst: "200", cClassTrib: "200047" });
  assert.equal(Number(errado.exposicao!.toFixed(2)), 2, "1.000 × 1% × (60% − 40%)");
});

test("bar: prato com tributação integral no lugar do regime específico é economia de 40%", () => {
  const bar: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: true };
  const v = classificarItem(doc(), item({ ncm: "21069090", xProd: "BUFFET ALMOÇO", cst: "000", cClassTrib: "000001" }), {
    base, empresa: bar, naturezaPorProduto: new Map([["P1", "preparado_no_local"]]), agora: AGORA,
  });
  assert.equal(v.estado, "INCORRETO_ECONOMIA");
  assert.deepEqual(v.esperado, { cst: "200", cClassTrib: "200047" });
  assert.equal(Number(v.valorPago!.toFixed(2)), 10, "1.000 × (0,9% + 0,1%)");
  assert.equal(Number(v.economiaPotencial!.toFixed(2)), 4, "40% de 10");
  assert.equal(Number(v.valorCorreto!.toFixed(2)), 6);
});

test("bar: prato sem o grupo IBS/CBS, quando já exigido, é recalculado (como no fluxo geral)", () => {
  const bar: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: true };
  const v = classificarItem(doc(), item({ ncm: "21069090", xProd: "BUFFET ALMOÇO" }), {
    base, empresa: bar, naturezaPorProduto: new Map([["P1", "preparado_no_local"]]), agora: AGORA,
  });
  assert.equal(v.estado, "INCORRETO_ECONOMIA");
  assert.match(v.motivo, /Grupo IBS\/CBS exigido e não informado/);
  assert.deepEqual(v.esperado, { cst: "200", cClassTrib: "200047" });
});

test("bar: bebida alcoólica fica fora do regime, com tributação integral", () => {
  const bar: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: true };
  const v = classificarItem(doc(), item({ ncm: "22030000", xProd: "CHOPP", cst: "000", cClassTrib: "000001" }), {
    base,
    empresa: bar,
    naturezaPorProduto: new Map([["P1", "bebida_alcoolica"]]),
    agora: AGORA,
  });
  assert.equal(v.estado, "CORRETO");
});

test("bar sem a natureza do item cadastrada vai para validação humana, não um palpite", () => {
  const bar: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: true };
  const v = classificarItem(doc(), item({ ncm: "23099090", cst: "000", cClassTrib: "000001" }), {
    base,
    empresa: bar,
    agora: AGORA,
  });
  assert.equal(v.estado, "REQUER_VALIDACAO");
  assert.equal(v.esperado, null);
  assert.ok(v.dadosFaltantes.some((d) => /natureza/.test(d)));
});

test("sem alíquota publicada para o período, não há número inventado", () => {
  const v = classificarItem(doc("2027-03-10T10:00:00-03:00"), item({ ncm: "22030000", cst: "200", cClassTrib: "200034" }), {
    base,
    empresa: padaria,
    agora: AGORA,
  });
  assert.equal(v.exposicao, null);
  assert.ok(v.dadosFaltantes.some((d) => /alíquota de referência de CBS/.test(d)));

  const comProjecao = classificarItem(
    doc("2027-03-10T10:00:00-03:00"),
    item({ ncm: "22030000", cst: "200", cClassTrib: "200034" }),
    { base, empresa: padaria, aceitarProjecao: true, agora: AGORA },
  );
  assert.ok(comProjecao.aliquotaUsada.some((a) => a.tipo === "projecao"));
});

test("alíquota é a vigente na data do documento, e o histórico não muda", () => {
  const p2026 = aliquotaVigente("CBS", "2026-09-01", false)!;
  assert.equal(p2026.aliquota, 0.009);
  assert.equal(aliquotaVigente("CBS", "2027-01-05", false), null);
  assert.equal(aliquotaVigente("CBS", "2027-01-05", true)!.tipo, "projecao");
});

test("item sem NCM ou sem data não recebe classificação presumida", () => {
  const semNcm = classificarItem(doc(), { ...item({ ncm: "22030000" }), ncm: null }, {
    base,
    empresa: padaria,
    agora: AGORA,
  });
  assert.equal(semNcm.estado, "REQUER_VALIDACAO");
  assert.equal(semNcm.esperado, null);

  const semData = classificarItem({ ...doc(), dataEmissao: null }, item({ ncm: "22030000" }), {
    base,
    empresa: padaria,
    agora: AGORA,
  });
  assert.equal(semData.estado, "REQUER_VALIDACAO");
  assert.equal(semData.esperado, null);
});
