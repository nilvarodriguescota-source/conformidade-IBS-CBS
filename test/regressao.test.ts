/**
 * Regressão contra a planilha V4.1: o modo legado precisa reproduzir os números
 * da aba Resultado e do DASHBOARD, e o modo corrigido precisa divergir apenas
 * pelos defeitos catalogados no diagnóstico.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { rodarLegado, indicadoresLegado, type ItemLegado } from "../src/legado.js";
import { classificarDocumentos } from "../src/motor.js";
import { calcularIndicadores } from "../src/indicadores.js";
import type { BaseNormativa, Documento } from "../src/tipos.js";

const base = JSON.parse(readFileSync("data/base-normativa.json", "utf8")) as BaseNormativa;
const amostra = JSON.parse(readFileSync("data/amostra-saidas.json", "utf8")) as ItemLegado[];
const esperado = JSON.parse(readFileSync("data/amostra-resultado-esperado.json", "utf8"));

test("modo legado reproduz a aba Resultado da planilha", () => {
  const linhas = rodarLegado(amostra, base);
  const ind = indicadoresLegado(linhas);
  assert.equal(linhas.length, esperado.linhas, "número de linhas da aba Resultado");
  assert.equal(ind.naoInformados, esperado.vereditos["NÃO INFORMADO"]);
  assert.equal(ind.faturamento, esperado.faturamentoDashboard, "faturamento exibido no dashboard");
  assert.equal(ind.ncmsDistintos, esperado.ncmsDistintos);
  assert.equal(ind.situacao, "CRÍTICA");
});

test("a duplicação do join infla o faturamento em R$ 42.072,00", () => {
  const linhas = rodarLegado(amostra, base);
  const real = Number(amostra.reduce((s, i) => s + i.valor, 0).toFixed(2));
  const inflado = indicadoresLegado(linhas).faturamento;
  assert.equal(real, 319289.74);
  assert.equal(Number((inflado - real).toFixed(2)), 42072.0);
  assert.equal(linhas.length - amostra.length, 136);
});

function documentoDaAmostra(dataEmissao: string): Documento {
  return {
    chave: "43260900000000000000650010000000011000000017",
    modelo: "65",
    numero: "1",
    serie: "1",
    dataEmissao,
    tipoOperacao: "saida",
    finalidade: "1",
    situacao: "100",
    cancelado: false,
    emitente: { cnpj: "00000000000000", crt: "3", uf: "SC" },
    destinatario: { cnpj: null, cpf: null, uf: "SC", indIEDest: "9" },
    arquivo: "amostra.xml",
    avisos: [],
    itens: amostra.map((i, n) => ({
      nItem: n + 1,
      cProd: i.produto,
      xProd: i.produto,
      ncm: i.ncm,
      cfop: "5102",
      quantidade: 1,
      valorProduto: i.valor,
      desconto: 0,
      baseCalculo: null,
      cst: null,
      cClassTrib: null,
      aliquotas: {},
    })),
  };
}

test("modo corrigido: uma linha por item, sem inflar o faturamento", () => {
  const vereditos = classificarDocumentos([documentoDaAmostra("2026-09-01T12:00:00-03:00")], {
    base,
    empresa: { cnpj: "00000000000000", regime: "normal", barOuRestaurante: false },
    agora: "2026-09-20T00:00:00Z",
  });
  const ind = calcularIndicadores(vereditos);
  assert.equal(ind.itens, amostra.length);
  assert.equal(ind.faturamento, 319289.74);
});

test("campo vazio antes da obrigatoriedade não vira não conformidade", () => {
  const antes = classificarDocumentos([documentoDaAmostra("2026-07-15T12:00:00-03:00")], {
    base,
    empresa: { cnpj: "00000000000000", regime: "normal" },
    agora: "2026-09-20T00:00:00Z",
  });
  assert.equal(calcularIndicadores(antes).porEstado.NAO_OBRIGATORIO.itens, amostra.length);

  const simples = classificarDocumentos([documentoDaAmostra("2026-09-01T12:00:00-03:00")], {
    base,
    empresa: { cnpj: "00000000000000", regime: "simples" },
    agora: "2026-09-20T00:00:00Z",
  });
  assert.equal(calcularIndicadores(simples).porEstado.NAO_OBRIGATORIO.itens, amostra.length);

  const depois = classificarDocumentos([documentoDaAmostra("2026-09-01T12:00:00-03:00")], {
    base,
    empresa: { cnpj: "00000000000000", regime: "normal" },
    agora: "2026-09-20T00:00:00Z",
  });
  assert.equal(calcularIndicadores(depois).porEstado.NAO_OBRIGATORIO.itens, 0);
  // INCORRETO — risco não existe mais: grupo ausente vira recálculo (enquadramento determinado) ou PRECISA VALIDAR
  const ind = calcularIndicadores(depois);
  assert.equal(ind.porEstado.INCORRETO_RISCO.itens, 0);
  assert.equal(ind.porEstado.INCORRETO_ECONOMIA.itens + ind.porEstado.REQUER_VALIDACAO.itens, amostra.length);
});
