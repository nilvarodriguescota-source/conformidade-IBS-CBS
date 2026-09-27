/** Casos-limite de leitura de XML: seleção, cancelamento, duplicidade, devolução. */
import test from "node:test";
import assert from "node:assert/strict";
import { lerXml, selecionarVendas, codigo } from "../src/parser.js";

const CHAVE = "43260900000000000000650010000000011000000017";

function nfe(opcoes: {
  chave?: string;
  modelo?: string;
  tpNF?: string;
  finNFe?: string;
  cStat?: string | null;
  crt?: string;
  ncm?: string;
  comIbsCbs?: boolean;
  cfop?: string;
} = {}): string {
  const {
    chave = CHAVE,
    modelo = "65",
    tpNF = "1",
    finNFe = "1",
    cStat = "100",
    crt = "3",
    ncm = "19059090",
    comIbsCbs = true,
    cfop = "5102",
  } = opcoes;
  const grupo = comIbsCbs
    ? `<IBSCBS><CST>200</CST><cClassTrib>200034</cClassTrib>
         <gIBSCBS><vBC>90.00</vBC>
           <gIBSUF><pIBSUF>0.05</pIBSUF></gIBSUF>
           <gIBSMun><pIBSMun>0.05</pIBSMun></gIBSMun>
           <gCBS><pCBS>0.9</pCBS></gCBS>
           <gRed><pRedAliq>60</pRedAliq></gRed>
         </gIBSCBS></IBSCBS>`
    : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe><infNFe Id="NFe${chave}" versao="4.00">
    <ide><mod>${modelo}</mod><serie>1</serie><nNF>1</nNF>
      <dhEmi>2026-09-01T12:00:00-03:00</dhEmi><tpNF>${tpNF}</tpNF><finNFe>${finNFe}</finNFe></ide>
    <emit><CNPJ>00000000000000</CNPJ><CRT>${crt}</CRT><enderEmit><UF>SC</UF></enderEmit></emit>
    <dest><CPF>00000000000</CPF><indIEDest>9</indIEDest><enderDest><UF>SC</UF></enderDest></dest>
    <det nItem="1">
      <prod><cProd>P1</cProd><xProd>PAO DE FORMA</xProd><NCM>${ncm}</NCM><CFOP>${cfop}</CFOP>
        <qCom>1.0000</qCom><vProd>100.00</vProd><vDesc>10.00</vDesc></prod>
      <imposto>${grupo}</imposto>
    </det>
  </infNFe></NFe>
  ${cStat ? `<protNFe><infProt><chNFe>${chave}</chNFe><cStat>${cStat}</cStat></infProt></protNFe>` : ""}
</nfeProc>`;
}

function eventoCancelamento(chave = CHAVE): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<procEventoNFe xmlns="http://www.portalfiscal.inf.br/nfe" versao="1.00">
  <evento><infEvento><chNFe>${chave}</chNFe><tpEvento>110111</tpEvento></infEvento></evento>
  <retEvento><infEvento><cStat>135</cStat></infEvento></retEvento>
</procEventoNFe>`;
}

test("lê chave, modelo, data, CRT, CFOP, base de cálculo e alíquotas", () => {
  const { documentos } = lerXml(nfe(), "a.xml");
  const doc = documentos[0]!;
  assert.equal(doc.chave, CHAVE);
  assert.equal(doc.modelo, "65");
  assert.equal(doc.emitente.crt, "3");
  assert.equal(doc.dataEmissao, "2026-09-01T12:00:00-03:00");
  const item = doc.itens[0]!;
  assert.equal(item.ncm, "19059090");
  assert.equal(item.cfop, "5102");
  assert.equal(item.cst, "200");
  assert.equal(item.cClassTrib, "200034");
  assert.equal(item.baseCalculo, 90);
  assert.equal(item.desconto, 10);
  assert.equal(item.aliquotas.cbs, 0.9);
  assert.equal(item.aliquotas.reducao, 60);
});

test("item sem grupo IBS/CBS fica com códigos nulos, não com zeros", () => {
  const { documentos } = lerXml(nfe({ comIbsCbs: false }), "a.xml");
  assert.equal(documentos[0]!.itens[0]!.cst, null);
  assert.equal(documentos[0]!.itens[0]!.cClassTrib, null);
});

test("descarta entrada, devolução e nota não autorizada", () => {
  const sel = selecionarVendas([
    lerXml(nfe({ tpNF: "0", chave: CHAVE.replace(/1$/, "2") }), "entrada.xml"),
    lerXml(nfe({ finNFe: "4", chave: CHAVE.replace(/1$/, "3") }), "devolucao.xml"),
    lerXml(nfe({ cStat: "301", chave: CHAVE.replace(/1$/, "4") }), "denegada.xml"),
    lerXml(nfe(), "venda.xml"),
  ]);
  assert.equal(sel.documentos.length, 1);
  assert.equal(sel.descartados.length, 3);
  assert.ok(sel.descartados.every((d) => d.motivo.length > 0));
});

test("o mesmo XML em dois arquivos conta uma vez", () => {
  const sel = selecionarVendas([lerXml(nfe(), "a.xml"), lerXml(nfe(), "copia.xml")]);
  assert.equal(sel.documentos.length, 1);
  assert.match(sel.descartados[0]!.motivo, /duplicada/);
});

test("evento de cancelamento remove a nota do cálculo", () => {
  const sel = selecionarVendas([lerXml(nfe(), "a.xml"), lerXml(eventoCancelamento(), "evento.xml")]);
  assert.equal(sel.documentos.length, 0);
  assert.match(sel.descartados[0]!.motivo, /cancelada/);
});

test("nota sem protocolo entra, mas com aviso", () => {
  const { documentos } = lerXml(nfe({ cStat: null }), "sem-protocolo.xml");
  assert.ok(documentos[0]!.avisos.some((a) => /protocolo/.test(a)));
});

test("CFOP fora da faixa de venda gera aviso no item", () => {
  const sel = selecionarVendas([lerXml(nfe({ cfop: "5910" }), "bonificacao.xml")]);
  assert.ok(sel.documentos[0]!.avisos.some((a) => /CFOP 5910/.test(a)));
});

test("XML corrompido é registrado, não derruba o lote", () => {
  const r = lerXml("<nfeProc><infNFe", "quebrado.xml");
  assert.equal(r.documentos.length, 0);
  assert.equal(r.ignorados.length, 1);
});

test("códigos preservam zeros à esquerda", () => {
  assert.equal(codigo("1006.20.10", 8), "10062010");
  assert.equal(codigo("3091000", 8), "03091000");
  assert.equal(codigo("1", 6), "000001");
  assert.equal(codigo("", 3), null);
});
