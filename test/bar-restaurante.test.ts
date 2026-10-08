/**
 * Empresa que atende consumo no local (bar, restaurante, lanchonete): a natureza de cada produto vendido
 * vira pergunta nas Pendências, inclusive quando o NCM não tem regra de benefício, e a resposta resolve a pendência.
 * A declaração da atividade vale só para a análise atual.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { configuracaoDaEmpresa, gravarAtividade, lerAtividade, novaAnalise, prepararConfiguracoes } from "../src/analise-atual.js";
import { classificarItem } from "../src/motor.js";
import { opcoesDaPergunta } from "../src/opcoes-validacao.js";
import type { BaseNormativa, Documento, Empresa, ItemDocumento, RespostaValidacao } from "../src/tipos.js";

const base = JSON.parse(readFileSync("data/base-normativa.json", "utf8")) as BaseNormativa;
const AGORA = "2026-09-20T00:00:00Z";
const bar: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: true };
const padaria: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: false };

function doc(): Documento {
  return {
    chave: "43260900000000000000650010000000011000000017",
    modelo: "65", numero: "1", serie: "1",
    dataEmissao: "2026-09-01T12:00:00-03:00",
    tipoOperacao: "saida", finalidade: "1", situacao: "100", cancelado: false,
    emitente: { cnpj: "00000000000000", crt: "3", uf: "SC" },
    destinatario: { cnpj: null, cpf: null, uf: "SC", indIEDest: "9" },
    itens: [], arquivo: "t.xml", avisos: [],
  };
}

function item(p: Partial<ItemDocumento> = {}): ItemDocumento {
  return {
    nItem: 1, cProd: "XB1", xProd: "X-BURGUER", ncm: "16025000", cfop: "5102",
    quantidade: 1, valorProduto: 1000, desconto: 0, baseCalculo: 1000,
    cst: "000", cClassTrib: "000001", aliquotas: {}, ...p,
  };
}

const escolha = (e: RespostaValidacao["escolha"], p: Partial<RespostaValidacao> = {}): RespostaValidacao => ({
  ncm: "16025000", cProd: "XB1", regraId: "NATUREZA_DO_ITEM", resposta: "NAO", autor: "teste", data: "2026-10-03", escolha: e, ...p,
});

test("bar: produto sem regra de benefício no NCM vira pergunta, em vez de sair correto sem perguntar", () => {
  assert.equal(base.regras.some((r) => r.ncm === "16025000"), false, "pré-condição: NCM sem regra na base");
  const v = classificarItem(doc(), item(), { base, empresa: bar, agora: AGORA });
  assert.equal(v.estado, "REQUER_VALIDACAO");
  assert.deepEqual(v.regrasCandidatas, []);
  // Para quem não atende consumo no local, nada muda: regra geral, sem pergunta
  assert.equal(classificarItem(doc(), item(), { base, empresa: padaria, agora: AGORA }).estado, "CORRETO");
});

test("bar: 'preparado e servido no local' aplica o regime do art. 275 ao produto sem regra no NCM", () => {
  const v = classificarItem(doc(), item(), { base, empresa: bar, validacoes: [escolha("CONSUMO_NO_LOCAL")], agora: AGORA });
  assert.equal(v.estado, "INCORRETO_ECONOMIA");
  assert.deepEqual(v.esperado, { cst: "200", cClassTrib: "200047" });
  assert.equal(Number(v.economiaPotencial!.toFixed(2)), 4, "1.000 × 1% × 40%");
});

test("bar: 'mercadoria' resolve a pendência pela regra geral (antes a resposta não tinha efeito)", () => {
  const v = classificarItem(doc(), item(), { base, empresa: bar, validacoes: [escolha("MERCADORIA_SEM_BENEFICIO")], agora: AGORA });
  assert.equal(v.estado, "CORRETO");
});

test("bar: NCM com regra de alimentos traz a regra na mesma pergunta, e o SIM nela resolve tudo", () => {
  const pastel = item({ cProd: "PF20", xProd: "PASTEL FRANGO 20 UND", ncm: "19022000", cst: "200", cClassTrib: "200034" });
  const pendente = classificarItem(doc(), pastel, { base, empresa: bar, agora: AGORA });
  assert.equal(pendente.estado, "REQUER_VALIDACAO");
  assert.deepEqual(pendente.regrasCandidatas, ["19022000-200034-VII-9"]);
  const sim: RespostaValidacao = { ncm: "19022000", cProd: "PF20", regraId: "19022000-200034-VII-9", resposta: "SIM", autor: "teste", data: "2026-10-03" };
  const v = classificarItem(doc(), pastel, { base, empresa: bar, validacoes: [sim], agora: AGORA });
  assert.equal(v.estado, "CORRETO");
  assert.deepEqual(v.esperado, { cst: "200", cClassTrib: "200034" });
});

test("pergunta: com consumo no local, a opção do art. 275 aparece mesmo sem regra no NCM", () => {
  const semBar = opcoesDaPergunta("16025000", "X-BURGUER", []);
  assert.equal(semBar.some((o) => o.tipo === "CONSUMO_NO_LOCAL"), false);
  const comBar = opcoesDaPergunta("16025000", "X-BURGUER", [], { consumoNoLocal: true });
  assert.deepEqual(comBar.map((o) => o.tipo), ["CONSUMO_NO_LOCAL", "MERCADORIA_SEM_BENEFICIO", "NCM_INCORRETO"]);
  assert.doesNotMatch(comBar[1]!.rotulo, /regras acima/, "sem regras listadas, a opção não fala em 'regras acima'");
});

test("declaração de atividade: vale para a análise atual, prevalece sobre empresa.json e some com a nova análise", () => {
  const dir = mkdtempSync(join(tmpdir(), "atividade-"));
  const raiz = join(dir, "analise");
  const arquivoEmpresa = join(dir, "empresa.json");
  writeFileSync(arquivoEmpresa, JSON.stringify({ cnpj: "0", regime: "normal", barOuRestaurante: false, validacoes: [{ ncm: "x" }] }));
  novaAnalise(raiz, join(dir, "saida"));
  assert.deepEqual(lerAtividade(raiz), {});
  assert.equal(configuracaoDaEmpresa(raiz, arquivoEmpresa).barOuRestaurante, false);

  gravarAtividade(raiz, { barOuRestaurante: true });
  const cfg = configuracaoDaEmpresa(raiz, arquivoEmpresa);
  assert.equal(cfg.barOuRestaurante, true);
  assert.equal("validacoes" in cfg, false, "as validações de empresa.json não entram");
  const { empresaAnalise } = prepararConfiguracoes(raiz, arquivoEmpresa);
  assert.equal(JSON.parse(readFileSync(empresaAnalise, "utf8")).barOuRestaurante, true);
  assert.equal(JSON.parse(readFileSync(arquivoEmpresa, "utf8")).barOuRestaurante, false, "empresa.json não é alterado");

  novaAnalise(raiz, join(dir, "saida"));
  assert.equal(existsSync(join(raiz, "atividade.json")), false);
  assert.deepEqual(lerAtividade(raiz), {});
});
