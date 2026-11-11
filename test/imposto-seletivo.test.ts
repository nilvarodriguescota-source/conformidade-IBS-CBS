/** Imposto Seletivo: enquadramento por NCM (Anexo XVII), vigência, contribuinte por CFOP, cálculo e escolha do usuário. */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { aplicarEscolhaIS, avaliarDocumentosIS, avaliarItemIS, calcularIS, carregarBaseIS, categoriaDoNcm, type BaseIS } from "../src/imposto-seletivo.js";
import { lerXml, selecionarVendas } from "../src/parser.js";
import { classificarDocumentos } from "../src/motor.js";
import type { BaseNormativa, Documento, ItemDocumento } from "../src/tipos.js";

const base = carregarBaseIS("data/imposto-seletivo.json");
/** Cópia da base com as alíquotas marcadas como conferidas (só para testar o cálculo). */
function baseConferida(ajuste?: (b: BaseIS) => void): BaseIS {
  const b = JSON.parse(JSON.stringify(base)) as BaseIS;
  for (const a of b.aliquotas) a.situacao = "conferida";
  ajuste?.(b);
  return b;
}
function item(ncm: string | null, cfop: string, extra: Partial<ItemDocumento> = {}): ItemDocumento {
  return { nItem: 1, cProd: "P1", xProd: "PRODUTO", ncm, cfop, quantidade: 2, valorProduto: 100, desconto: 0, baseCalculo: 100, cst: "000", cClassTrib: "000001", aliquotas: {}, ...extra };
}
const EM_2027 = "2027-03-10";

test("base do IS: fontes registradas, alíquotas da planilha pendentes de conferência e histórico", () => {
  assert.equal(base.fontes.LC214!.situacao, "conferida");
  assert.equal(base.fontes.MP1399!.situacao, "pendente_conferencia");
  assert.ok(base.historico.length >= 1);
  assert.ok(base.aliquotas.length === 5 && base.aliquotas.every((a) => a.situacao === "pendente_conferencia" && a.fonte === "PLANILHA_CLIENTE"));
  const acucar = base.aliquotas.find((a) => a.categoria === "BEBIDAS_ACUCARADAS")!;
  assert.equal(acucar.aliquota, 0.026);
  assert.deepEqual(base.aliquotas.map((a) => a.aliquota), [0.026, 0.042, 0.08, 0.12, 0.24]);
  for (const a of base.aliquotas) { assert.equal(a.vigenciaInicio, "2027-02-02"); assert.equal(a.vigenciaFim, "2027-12-31"); }
});

test("Anexo XVII: bebidas açucaradas só no 2202.10.00; energéticos, isotônicos, sucos e águas ficam fora", () => {
  assert.equal(categoriaDoNcm(base, "22021000")?.id, "BEBIDAS_ACUCARADAS");
  for (const ncm of ["22029900", "22029100", "20091900", "20098990", "22011000", "19059090"]) {
    const a = avaliarItemIS(base, item(ncm, "5101"), EM_2027);
    assert.equal(a.situacao, "NAO_INCIDENCIA", ncm);
    assert.match(a.motivo, /não consta do Anexo XVII/);
    assert.equal(a.valor, null);
  }
  assert.equal(categoriaDoNcm(base, "22030000")?.id, "CERVEJAS");
  assert.equal(categoriaDoNcm(base, "22042100")?.id, "VINHOS_FERMENTADOS");
  assert.equal(categoriaDoNcm(base, "22060010")?.id, "VINHOS_FERMENTADOS");
  assert.equal(categoriaDoNcm(base, "22051000")?.id, "VERMUTES");
  assert.equal(categoriaDoNcm(base, "22089000")?.id, "DESTILADOS");
  assert.equal(categoriaDoNcm(base, "22071000"), null, "álcool etílico (22.07) não está no Anexo XVII");
  assert.equal(categoriaDoNcm(base, "24022000")?.id, "FUMIGENOS");
  assert.equal(categoriaDoNcm(base, "88026000"), null, "8802.60.00 é exceção do Anexo XVII");
  assert.equal(categoriaDoNcm(base, "88023000")?.id, "AERONAVES_EMBARCACOES");
});

test("vigência: antes de 02/02/2027 não há alíquota do IS; depois de 2027 fica para validação, sem alíquota", () => {
  const antes = avaliarItemIS(baseConferida(), item("22021000", "5101"), "2027-02-01");
  assert.equal(antes.situacao, "NAO_INCIDENCIA");
  assert.match(antes.motivo, /anterior ao início das alíquotas/);
  assert.equal(avaliarItemIS(baseConferida(), item("22021000", "5101"), "2026-08-15").situacao, "NAO_INCIDENCIA");
  const no2028 = avaliarItemIS(baseConferida(), item("22021000", "5101"), "2028-01-05");
  assert.equal(no2028.situacao, "VALIDACAO");
  assert.equal(no2028.valor, null);
  assert.equal(avaliarItemIS(baseConferida(), item("22021000", "5101"), "2027-02-02").situacao, "INCIDENCIA");
});

test("contribuinte: revenda (CFOP de terceiros) não tem IS; CFOP que não indica o fabricante vai para validação", () => {
  for (const cfop of ["5102", "5405", "6102"]) {
    const a = avaliarItemIS(baseConferida(), item("22021000", cfop), EM_2027);
    assert.equal(a.situacao, "NAO_INCIDENCIA", cfop);
    assert.match(a.motivo, /revenda/);
    assert.ok(a.fundamentos.some((f) => /art\. 410/.test(f)) && a.fundamentos.some((f) => /art\. 424/.test(f)));
  }
  const outro = avaliarItemIS(baseConferida(), item("22021000", "5949"), EM_2027);
  assert.equal(outro.situacao, "VALIDACAO");
});

test("alíquota pendente de conferência: validação fiscal, sem valor e sem alíquota zero", () => {
  const a = avaliarItemIS(base, item("22021000", "5101"), EM_2027);
  assert.equal(a.situacao, "VALIDACAO");
  assert.equal(a.valor, null);
  assert.equal(a.aliquota?.aliquota, 0.026);
  assert.match(a.motivo, /não conferida/);
});

test("cálculo ad valorem com alíquota conferida: bebida açucarada do fabricante = valor de venda × 2,6%", () => {
  const a = avaliarItemIS(baseConferida(), item("22021000", "5101", { valorProduto: 1000, desconto: 50 }), EM_2027);
  assert.equal(a.situacao, "INCIDENCIA");
  assert.equal(a.base, 950);
  assert.equal(a.valor, 24.7);
});

test("bebidas alcoólicas e fumígenos: exigências próprias, sem fórmula única", () => {
  // Embalagem primária (art. 409, § 2º) precisa de confirmação
  const cerveja = avaliarItemIS(baseConferida(), item("22030000", "5101"), EM_2027);
  assert.equal(cerveja.situacao, "VALIDACAO");
  assert.match(cerveja.motivo, /embalagem primária/);
  // Parcela específica (teor alcoólico × volume) exigida pelo art. 422, § 1º, II: sem ela não há valor
  const cat = base.categorias.find((c) => c.id === "CERVEJAS")!;
  const aliq = baseConferida().aliquotas.find((x) => x.categoria === "CERVEJAS")!;
  assert.equal(calcularIS(aliq, cat, 100, 2).valor, null);
  assert.equal(calcularIS({ ...aliq, especifica: { valor: 0.5, unidade: "L" } }, cat, 100, 2).valor, 5.2);
  // Fumígenos: base é o valor de referência (art. 414, III, c), fora do XML
  const cigarro = avaliarItemIS(baseConferida(), item("24022000", "5101"), EM_2027);
  assert.equal(cigarro.situacao, "VALIDACAO");
  assert.match(cigarro.motivo, /valor de referência/);
  // Veículos: exceções do Anexo XVII
  assert.equal(avaliarItemIS(baseConferida(), item("87032100", "5101"), EM_2027).situacao, "VALIDACAO");
});

test("art. 413, III: item com IBS/CBS reduzido (CST 200) não recebe IS sem validação", () => {
  const a = avaliarItemIS(baseConferida(), item("22021000", "5101", { cst: "200" }), EM_2027);
  assert.equal(a.situacao, "VALIDACAO");
  assert.match(a.motivo, /art\. 413, III/);
});

test("grupo IS do XML: informado em operação sem incidência gera alerta", () => {
  const a = avaliarItemIS(base, item("22021000", "5102", { impostoSeletivo: { cst: "000", cClassTrib: "000001", base: 100, aliquota: 2.6, valor: 2.6 } }), EM_2027);
  assert.equal(a.situacao, "NAO_INCIDENCIA");
  assert.ok(a.alertas.some((x) => /XML informa IS/.test(x)));
});

function doc(data: string, itens: ItemDocumento[]): Documento {
  return { chave: "1", modelo: "65", numero: "1", serie: "1", dataEmissao: data + "T10:00:00-03:00", tipoOperacao: "saida", finalidade: "1", situacao: "100", cancelado: false, emitente: { cnpj: "1", crt: "3", uf: "SC" }, destinatario: { cnpj: null, cpf: null, uf: null, indIEDest: null }, itens, arquivo: "a.xml", avisos: [] };
}

test("por produto: situação mais restritiva, base, valor só quando todos os itens têm cálculo", () => {
  const b = baseConferida();
  const ps = avaliarDocumentosIS(b, [
    doc("2027-03-01", [item("22021000", "5101", { valorProduto: 100 }), { ...item("22021000", "5102", { valorProduto: 50 }), nItem: 2 }]),
    doc("2027-03-02", [{ ...item("22029900", "5102"), cProd: "P2", xProd: "ENERGETICO" }]),
  ]);
  const refri = ps.find((p) => p.cProd === "P1")!;
  assert.equal(refri.itens, 2);
  assert.equal(refri.base, 150);
  assert.equal(refri.situacao, "INCIDENCIA");
  assert.equal(refri.porSituacao.INCIDENCIA, 1);
  assert.equal(refri.porSituacao.NAO_INCIDENCIA, 1);
  assert.equal(refri.valor, null, "um item sem IS: não há valor único somado de incidência");
  const energetico = ps.find((p) => p.cProd === "P2")!;
  assert.equal(energetico.situacao, "NAO_INCIDENCIA");
  assert.equal(energetico.categoria, null);
});

test("escolha do usuário: confirma, troca e pendência; valor só com alíquota conferida e itens na vigência", () => {
  const [p] = avaliarDocumentosIS(base, [doc("2027-03-01", [item("22021000", "5102", { valorProduto: 200 })])]);
  assert.equal(p!.situacao, "NAO_INCIDENCIA");
  const sem = aplicarEscolhaIS(p!, null, base);
  assert.equal(sem.validacao, "SUGESTAO");
  assert.equal(sem.situacaoFinal, "NAO_INCIDENCIA");
  const nao = aplicarEscolhaIS(p!, { escolha: "NAO_INCIDENCIA", autor: "u", data: "2026-11-11" }, base);
  assert.equal(nao.validacao, "CONFIRMADA");
  const pend = aplicarEscolhaIS(p!, { escolha: "VALIDACAO", autor: "u", data: "2026-11-11" }, base);
  assert.equal(pend.validacao, "PENDENTE");
  assert.equal(pend.valorFinal, null);
  // Usuário marca incidência: com alíquota pendente, não calcula (e não usa zero)
  const inc = aplicarEscolhaIS(p!, { escolha: "INCIDENCIA", autor: "u", data: "2026-11-11" }, base);
  assert.equal(inc.situacaoFinal, "INCIDENCIA");
  assert.equal(inc.valorFinal, null);
  assert.match(inc.calculo, /pendente de conferência/);
  // Com alíquota conferida: 200 × 2,6%
  const b = baseConferida();
  const [p2] = avaliarDocumentosIS(b, [doc("2027-03-01", [item("22021000", "5102", { valorProduto: 200 })])]);
  assert.equal(aplicarEscolhaIS(p2!, { escolha: "INCIDENCIA", autor: "u", data: "2026-11-11" }, b).valorFinal, 5.2);
  // Operações de 2026: sem alíquota na data
  const [p3] = avaliarDocumentosIS(b, [doc("2026-08-01", [item("22021000", "5102")])]);
  assert.equal(aplicarEscolhaIS(p3!, { escolha: "INCIDENCIA", autor: "u", data: "2026-11-11" }, b).valorFinal, null);
});

test("IBS/CBS não mudam com o grupo IS no XML (tributos separados)", () => {
  const xml = (comIS: boolean) => `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00"><NFe><infNFe Id="NFe43260900000000000000650010000000011000000017" versao="4.00">
<ide><mod>65</mod><serie>1</serie><nNF>1</nNF><dhEmi>2027-03-01T12:00:00-03:00</dhEmi><tpNF>1</tpNF><finNFe>1</finNFe></ide>
<emit><CNPJ>00000000000000</CNPJ><CRT>3</CRT><enderEmit><UF>SC</UF></enderEmit></emit>
<det nItem="1"><prod><cProd>R1</cProd><xProd>REFRIGERANTE</xProd><NCM>22021000</NCM><CFOP>5101</CFOP><uCom>UN</uCom><qCom>1.0000</qCom><vProd>10.00</vProd><vDesc>0.00</vDesc></prod>
<imposto>${comIS ? "<IS><CSTIS>000</CSTIS><cClassTribIS>000001</cClassTribIS><vBCIS>10.00</vBCIS><pIS>2.6000</pIS><vIS>0.26</vIS></IS>" : ""}<IBSCBS><CST>000</CST><cClassTrib>000001</cClassTrib><gIBSCBS><vBC>10.00</vBC><gIBSUF><pIBSUF>0.1</pIBSUF></gIBSUF><gIBSMun><pIBSMun>0</pIBSMun></gIBSMun><gCBS><pCBS>0.9</pCBS></gCBS></gIBSCBS></IBSCBS></imposto></det>
</infNFe></NFe><protNFe><infProt><chNFe>43260900000000000000650010000000011000000017</chNFe><cStat>100</cStat></infProt></protNFe></nfeProc>`;
  const baseNormativa = JSON.parse(readFileSync("data/base-normativa.json", "utf8")) as BaseNormativa;
  const empresa = JSON.parse(readFileSync("test/fixtures/empresa-teste.json", "utf8"));
  const vereditos = (comIS: boolean) => {
    const docs = selecionarVendas([lerXml(xml(comIS), "a.xml")]).documentos;
    return classificarDocumentos(docs, { base: baseNormativa, empresa, validacoes: [], naturezaPorProduto: new Map(), aceitarProjecao: false, regrasBloqueadas: new Set() })
      .map(({ calculadoEm: _c, ...v }) => v);
  };
  assert.deepEqual(vereditos(true), vereditos(false));
  const lido = selecionarVendas([lerXml(xml(true), "a.xml")]).documentos[0]!.itens[0]!;
  assert.deepEqual(lido.impostoSeletivo, { cst: "000", cClassTrib: "000001", base: 10, aliquota: 2.6, valor: 0.26 });
  assert.equal(lido.unidade, "UN");
});
