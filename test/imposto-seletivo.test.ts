/** Imposto Seletivo: enquadramento por NCM (Anexo XVII), vigência, contribuinte por CFOP, cálculo e escolha do usuário. */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { aliquotasDoNcm, aplicarEscolhaIS, avaliarDocumentosIS, avaliarItemIS, calcularIS, carregarBaseIS, categoriaDoNcm, type BaseIS } from "../src/imposto-seletivo.js";
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

/** Cópia da base com as alíquotas voltando a "pendente de conferência" (para testar que não são aplicadas). */
function basePendente(): BaseIS {
  const b = JSON.parse(JSON.stringify(base)) as BaseIS;
  for (const a of b.aliquotas) a.situacao = "pendente_conferencia";
  return b;
}
const em2027 = (ncm: string) => aliquotasDoNcm(base, ncm, "2027-03-10");
const valores = (ncm: string) => { const r = em2027(ncm); return { geral: r.principal?.aliquota ?? null, alternativas: r.alternativas.map((x) => x.aliquota) }; };

test("base do IS: MP 1.399/2026 conferida, fontes com SHA-256 e histórico", () => {
  assert.equal(base.fontes.LC214!.situacao, "conferida");
  assert.equal(base.fontes.MP1399!.situacao, "conferida");
  assert.match(base.fontes.MP1399!.sha256 ?? "", /^[0-9a-f]{64}$/);
  assert.equal(base.vigencia.inicioAliquotas, "2027-02-02");
  assert.equal(base.vigencia.situacao, "conferida");
  assert.ok(base.historico.length >= 2);
  assert.ok(base.aliquotas.every((a) => a.situacao === "conferida" && a.fonte === "MP1399" && a.vigenciaInicio === "2027-02-02" && a.vigenciaFim === "2027-12-31"));
});

test("Anexos IV e V da MP 1.399/2026: alíquota inicial × fator de conversão = alíquota final", () => {
  for (const a of base.aliquotas) {
    if (a.aliquotaInicial == null || a.fatorConversao == null || a.aliquota == null) continue;
    assert.ok(Math.abs(a.aliquotaInicial * a.fatorConversao - a.aliquota) < 0.0006, `${a.id}: ${a.aliquotaInicial} × ${a.fatorConversao} ≠ ${a.aliquota}`);
  }
  // As 5 linhas da planilha do cliente conferem com o Anexo IV
  assert.deepEqual(valores("22021000"), { geral: 0.026, alternativas: [] });
  assert.deepEqual(valores("22030000"), { geral: 0.042, alternativas: [] });
  assert.deepEqual(valores("22041010"), { geral: 0.08, alternativas: [] });
  assert.deepEqual(valores("22051000"), { geral: 0.12, alternativas: [] });
  assert.equal(valores("22082000").geral, 0.24);
});

test("alíquotas com condição do produto: regra geral e exceções do Anexo IV", () => {
  assert.deepEqual(valores("22042100"), { geral: 0.08, alternativas: [0.16] }, "vinho da madeira, do porto ou de xerez: 16%");
  assert.deepEqual(valores("22060090"), { geral: 0.08, alternativas: [0.16] }, "fermentado acima de 14%: 16%");
  assert.deepEqual(valores("22089000"), { geral: 0.24, alternativas: [0.16] }, "bebida refrescante abaixo de 8%: 16%");
  assert.deepEqual(valores("22084000"), { geral: 0.24, alternativas: [0.2] }, "aguardente de cana (exceto melaço): 20%");
  assert.deepEqual(valores("24022000"), { geral: 0.375, alternativas: [0.667] }, "cigarros: 66,7% + R$ 3,50 por vintena");
  assert.equal(em2027("24022000").alternativas[0]!.especifica?.valor, 3.5);
  assert.deepEqual(valores("24031100"), { geral: 0.375, alternativas: [] });
  // Código mais específico vence; exclusão do Anexo
  assert.equal(valores("89033100").geral, 0.12);
  assert.equal(valores("89039900").geral, 0.078);
  assert.equal(valores("88023000").geral, 0.068);
  assert.equal(valores("88026000").geral, null);
  assert.equal(valores("26011100").geral, 0, "bens minerais: alíquota zero até 31/12/2027 (art. 6º, III, a, 3)");
  assert.equal(em2027("87032100").principal?.modalidade, "ajustes_por_veiculo");
  // Fora da vigência: nenhuma alíquota
  assert.equal(aliquotasDoNcm(base, "22021000", "2027-02-01").principal, null);
  assert.equal(aliquotasDoNcm(base, "22021000", "2028-01-01").principal, null);
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
  const a = avaliarItemIS(basePendente(), item("22021000", "5101"), EM_2027);
  assert.equal(a.situacao, "VALIDACAO");
  assert.equal(a.valor, null);
  assert.equal(a.aliquota?.aliquota, 0.026);
  assert.match(a.motivo, /não conferida/);
});

test("cálculo ad valorem com a alíquota da MP: bebida açucarada do fabricante = valor de venda × 2,6%", () => {
  const a = avaliarItemIS(base, item("22021000", "5101", { valorProduto: 1000, desconto: 50 }), EM_2027);
  assert.equal(a.situacao, "INCIDENCIA");
  assert.equal(a.base, 950);
  assert.equal(a.valor, 24.7);
});

test("bebidas alcoólicas e fumígenos: exigências próprias, sem fórmula única", () => {
  // Embalagem primária (art. 409, § 2º) precisa de confirmação
  const cerveja = avaliarItemIS(baseConferida(), item("22030000", "5101"), EM_2027);
  assert.equal(cerveja.situacao, "VALIDACAO");
  assert.match(cerveja.motivo, /embalagem primária/);
  // Parcela específica reduzida a zero até 31/12/2027 (MP, art. 6º, II): só a ad valorem, sem depender da quantidade
  const cat = base.categorias.find((c) => c.id === "CERVEJAS")!;
  const aliq = base.aliquotas.find((x) => x.id === "IS-2027-CERVEJAS")!;
  assert.equal(calcularIS(aliq, cat, 100, null).valor, 4.2);
  assert.equal(calcularIS({ ...aliq, especifica: { valor: 0.5, unidade: "L" } }, cat, 100, 2).valor, 5.2);
  assert.equal(calcularIS({ ...aliq, especifica: { valor: 0.5, unidade: "L" } }, cat, 100, null).valor, null);
  assert.equal(calcularIS({ ...aliq, especifica: null }, cat, 100, 2).valor, null);
  // Cigarros: R$ 3,50 por vintena depende da quantidade em vintenas
  const cig = em2027("24022000").alternativas[0]!;
  assert.equal(calcularIS(cig, base.categorias.find((c) => c.id === "FUMIGENOS")!, 100, null).valor, null);
  // Vinho com alternativa (16% se do porto): o fabricante confirma a condição
  const vinho = avaliarItemIS(base, item("22042100", "5101"), EM_2027);
  assert.equal(vinho.situacao, "VALIDACAO");
  assert.match(vinho.motivo, /16% se vinho da madeira, do porto ou de xerez/);
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
  const bp = basePendente();
  const [pp] = avaliarDocumentosIS(bp, [doc("2027-03-01", [item("22021000", "5102", { valorProduto: 200 })])]);
  const inc = aplicarEscolhaIS(pp!, { escolha: "INCIDENCIA", autor: "u", data: "2026-11-11" }, bp);
  assert.equal(inc.situacaoFinal, "INCIDENCIA");
  assert.equal(inc.valorFinal, null);
  assert.match(inc.calculo, /pendente de conferência/);
  // Com alíquota conferida: 200 × 2,6%
  const b = baseConferida();
  const [p2] = avaliarDocumentosIS(b, [doc("2027-03-01", [item("22021000", "5102", { valorProduto: 200 })])]);
  assert.equal(aplicarEscolhaIS(p2!, { escolha: "INCIDENCIA", autor: "u", data: "2026-11-11" }, b).valorFinal, 5.2);
  // Operações de 2026: a alíquota de 2027 aparece como referência, mas não é aplicada
  const [p3] = avaliarDocumentosIS(base, [doc("2026-08-01", [item("22021000", "5102")])]);
  assert.equal(p3!.aliquota?.aliquota, 0.026);
  assert.equal(p3!.baseNaVigencia, 0);
  const inc2026 = aplicarEscolhaIS(p3!, { escolha: "INCIDENCIA", autor: "u", data: "2026-11-11" }, base);
  assert.equal(inc2026.valorFinal, null);
  assert.match(inc2026.calculo, /anteriores à vigência/);
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
