/** Regime de bares e restaurantes (art. 275): não gera o falso alerta "regra não localizada". */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { classificarDocumentos } from "../src/motor.js";
import { carregarContexto, explicarVereditos } from "../src/explicador.js";
import { gerarAlertas } from "../src/alertas.js";
import type { BaseNormativa, Documento, ItemDocumento } from "../src/tipos.js";

const base = JSON.parse(readFileSync("data/base-normativa.json", "utf8")) as BaseNormativa;
const ctx = carregarContexto({ base: "data/base-normativa.json", v2: "data/base-normativa.v2.json", matriz: "docs/etapa6/matriz-decisao.json", empresa: "test/fixtures/empresa-teste.json" });

test("consumo no local (art. 275): 200047 aplicado, sem alerta de regra não localizada", () => {
  const item: ItemDocumento = { nItem: 1, cProd: "698", xProd: "BRUSQUETA ESPECIAL KG", ncm: "19059090", cfop: "5102", quantidade: 1, valorProduto: 100, desconto: 0, baseCalculo: 100, cst: "000", cClassTrib: "000001", aliquotas: {} };
  const doc: Documento = { chave: "X", modelo: "65", numero: "1", serie: "1", dataEmissao: "2026-09-10T10:00:00-03:00", tipoOperacao: "saida", finalidade: "1", situacao: "100", cancelado: false,
    emitente: { cnpj: "0", crt: "3", uf: "SC" }, destinatario: { cnpj: null, cpf: null, uf: "SC", indIEDest: "9" }, itens: [item], arquivo: "x", avisos: [] };
  const vereditos = classificarDocumentos([doc], {
    base, empresa: { cnpj: "0", regime: "normal", barOuRestaurante: false }, agora: "2026-10-03T00:00:00Z",
    validacoes: [{ ncm: "19059090", cProd: "698", regraId: "19059090-200003-I-16", resposta: "NAO", escolha: "CONSUMO_NO_LOCAL", autor: "t", data: "2026-10-03" }],
  });
  assert.deepEqual(vereditos[0]!.esperado, { cst: "200", cClassTrib: "200047" });
  const x = explicarVereditos(vereditos, ctx, [doc]);
  assert.ok(!x[0]!.explicacaoInformativa!.regras.some((r) => r.regraIdInformado === "LC 214/2025, art. 275"));
  assert.equal(x[0]!.explicacaoInformativa!.reducaoDoItem?.situacao, "regime_especifico");
  const alertas = JSON.stringify(gerarAlertas(x));
  assert.doesNotMatch(alertas, /não corresponde a uma única regra da base/);
});
