/**
 * Benefício ou redução de alíquota por atividade (aba Análise). Independe do produto/NCM: só CNAE do emitente
 * nos XMLs e cadastro da empresa, contra o texto literal da LC 214/2025, arts. 273 a 276.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { avaliarBeneficioAtividade, cnaesDosXmls, type TextoLegalAtividade } from "../src/beneficio-atividade.js";
import { BARES_RESTAURANTES } from "../src/motor.js";

const lei = JSON.parse(readFileSync("data/fontes/lc214/regime-bares-restaurantes.json", "utf8")) as TextoLegalAtividade;
const AGORA = "2026-09-28T12:00:00Z";
const avaliar = (barOuRestaurante: boolean | undefined, cnaes: { cnae: string; xmls: number }[]) =>
  avaliarBeneficioAtividade({ empresa: { barOuRestaurante }, cnaes, lei, agora: AGORA });

test("1. Texto legal: literal do snapshot registrado da LC 214/2025, com o mesmo hash da v2", () => {
  const v2 = JSON.parse(readFileSync("data/base-normativa.v2.json", "utf8"));
  const bruto = readFileSync(lei.fonte.arquivo);
  assert.equal(createHash("sha256").update(bruto).digest("hex"), lei.fonte.sha256);
  assert.equal(lei.fonte.sha256, v2.fontes.registros.F1.arquivos.find((a: { id: string }) => a.id === "F1.html").sha256);
  const texto = new TextDecoder("windows-1252").decode(bruto).replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ");
  assert.deepEqual(lei.artigos.map((a) => a.dispositivo), ["Art. 273", "Art. 274", "Art. 275", "Art. 276"]);
  for (const a of lei.artigos) assert.ok(texto.includes(a.texto), `${a.dispositivo} não está literalmente no snapshot`);
});

test("2. Percentual: o do motor (art. 275) confere com o texto da lei; nada é inventado", () => {
  const r = avaliar(true, [{ cnae: "5611201", xmls: 3 }]);
  assert.equal(r.beneficio!.percentualReducao, BARES_RESTAURANTES.reducao);
  assert.equal(r.beneficio!.percentualNaLei, 0.4);
  assert.equal(r.beneficio!.aliquotaGeral, 0.01, "CBS 0,9% + IBS 0,1% em 2026");
  assert.equal(r.beneficio!.aliquotaAposReducao, 0.006);
  assert.match(r.beneficio!.fundamentoLegal, /arts\. 273 a 276/);
});

test("3. CNAE de lanchonete sem confirmação no cadastro: potencialmente aplicável, requer validação", () => {
  const r = avaliar(false, [{ cnae: "5611203", xmls: 10 }]);
  assert.equal(r.classificacao, "REQUER_VALIDACAO");
  assert.equal(r.rotulo, "BENEFÍCIO POTENCIALMENTE APLICÁVEL — REQUER VALIDAÇÃO");
  assert.ok(r.auditoria.some((p) => p.camada === "SISTEMA_INFERE" && /5611-2\/03/.test(p.texto)), "vínculo CNAE → atividade é inferência");
  assert.ok(r.auditoria.some((p) => p.camada === "PENDENTE" && /Atividade não confirmada/.test(p.texto)));
  assert.ok(r.beneficio!.condicoes.some((c) => /bebidas alcoólicas, ainda que preparadas/.test(c.texto)), "condições literais do art. 273, § 2º");
});

test("4. Atividade confirmada no cadastro e CNAE correspondente: benefício confirmado para a atividade", () => {
  const r = avaliar(true, [{ cnae: "5611201", xmls: 5 }]);
  assert.equal(r.classificacao, "CONFIRMADO");
  assert.ok(r.auditoria.some((p) => p.camada === "HUMANO_CONFIRMOU"));
});

test("5. Cadastro sem CNAE nos XMLs, ou com CNAE divergente: não confirma, requer validação", () => {
  assert.equal(avaliar(true, []).classificacao, "REQUER_VALIDACAO");
  assert.equal(avaliar(true, [{ cnae: "4721102", xmls: 2 }]).classificacao, "REQUER_VALIDACAO");
});

test("6. CNAE 5620-1/01 (excluído pela lei) e CNAE sem regime: nenhum benefício por atividade", () => {
  const excluido = avaliar(false, [{ cnae: "5620101", xmls: 4 }]);
  assert.equal(excluido.classificacao, "NENHUM");
  assert.equal(excluido.beneficio, null);
  assert.match(excluido.motivo, /art\. 273, § 2º, I/);
  const outro = avaliar(undefined, [{ cnae: "4721102", xmls: 4 }]);
  assert.equal(outro.classificacao, "NENHUM");
  assert.equal(outro.rotulo, "NENHUM BENEFÍCIO POR ATIVIDADE IDENTIFICADO");
  assert.equal(avaliar(false, []).classificacao, "NENHUM");
});

test("7. CNAE lido dos XMLs da análise (emit/CNAE)", () => {
  const c = cnaesDosXmls("analise-atual/xmls");
  assert.ok(c.length >= 1);
  assert.equal(c[0]!.cnae, "5611203");
  assert.deepEqual(cnaesDosXmls("pasta-que-nao-existe"), []);
});
