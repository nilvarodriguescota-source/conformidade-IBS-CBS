/**
 * Fase 2 da Etapa 5.3: regras oficialmente incompatíveis com o NCM ficam bloqueadas como candidatas.
 * O bloqueio é da regra NCM × enquadramento (nunca do NCM inteiro nem do produto) e equivale, para o motor,
 * à regra não existir para aquele NCM.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { copyFileSync, mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { classificarItem, MOTIVO_BLOQUEIO } from "../src/motor.js";
import { bloqueiosParaBase, chavesBloqueadas, MENSAGEM_BLOQUEIO } from "../src/bloqueios.js";
import { carregarContexto, explicarVereditos } from "../src/explicador.js";
import type { BaseNormativa, Documento, Empresa, ItemDocumento, RespostaValidacao } from "../src/tipos.js";

const ARQ_BASE = "data/base-normativa.json";
const base = JSON.parse(readFileSync(ARQ_BASE, "utf8")) as BaseNormativa;
const bloqueios = bloqueiosParaBase(ARQ_BASE);
const regrasBloqueadas = chavesBloqueadas(bloqueios);
const empresa: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: false };
const AGORA = "2026-09-24T00:00:00-03:00";

function item(ncm: string, cst = "000", cClassTrib = "000001", cProd = "P1"): ItemDocumento {
  return { nItem: 1, cProd, xProd: `P${cProd}`, ncm, cfop: "5102", quantidade: 1, valorProduto: 1000, desconto: 0, baseCalculo: 1000, cst, cClassTrib, aliquotas: {} };
}
const doc: Documento = {
  chave: "BLQ", modelo: "55", numero: "1", serie: "1", dataEmissao: "2026-09-10T10:00:00-03:00", tipoOperacao: "saida", finalidade: "1", situacao: "100", cancelado: false,
  emitente: { cnpj: "00000000000000", crt: "3", uf: "SC" }, destinatario: { cnpj: "11111111000191", cpf: null, uf: "SC", indIEDest: "1" }, itens: [], arquivo: "BLQ.xml", avisos: [],
};
const sim = (ncm: string, regraId: string, cProd = "P1"): RespostaValidacao => ({ ncm, cProd, regraId, resposta: "SIM", autor: "Teste", data: "2026-09-24" });
const comBloqueio = (it: ItemDocumento, validacoes: RespostaValidacao[] = []) => classificarItem(doc, it, { base, empresa, validacoes, agora: AGORA, regrasBloqueadas });
const semBloqueio = (it: ItemDocumento, validacoes: RespostaValidacao[] = []) => classificarItem(doc, it, { base, empresa, validacoes, agora: AGORA });
const idDe = (ncm: string, cod: string) => base.regras.find((r) => r.ncm === ncm && r.cClassTrib === cod)!.id;

test("bloqueios: exatamente 149 regras (A 8, C 125, D 2, exclusão legal do Anexo IV item 49 14), com evidência", () => {
  assert.equal(bloqueios.size, 149);
  const porTipo: Record<string, number> = {};
  for (const b of bloqueios.values()) porTipo[b.tipo] = (porTipo[b.tipo] ?? 0) + 1;
  assert.deepEqual(porTipo, { VEDADO_ANEXO_I: 8, VEDADO_EXCECAO_ITEM: 125, VEDADO_EXCECAO_LEI: 2, EXCLUSAO_LEGAL: 14 });
  const a = JSON.parse(readFileSync("data/auditoria-oficial.json", "utf8"));
  for (const b of bloqueios.values()) {
    assert.ok(base.regras.some((r) => r.id === b.regraId && r.ncm === b.ncm && r.cClassTrib === b.cClassTrib), b.regraId);
    assert.equal(b.mensagem, MENSAGEM_BLOQUEIO);
    assert.ok(b.fatosF1.length + b.fatosF2.length > 0, `${b.regraId} sem evidência`);
    assert.equal(b.fontes.F1.sha256, a.entradas.F1.sha256);
    assert.equal(b.fontes.F2.sha256, a.entradas.F2.sha256);
  }
  assert.ok([...bloqueios.values()].every((b) => b.tipo !== "EXCLUSAO_LEGAL" || (b.cClassTrib === "200030" && b.item === "49")));
});

test("bloqueios: regra VEDADO não entra nas candidatas e o item é avaliado como se ela não existisse", () => {
  const id = "02074300-200003-I-19";
  assert.equal(bloqueios.get(`${id}|02074300`)?.tipo, "VEDADO_EXCECAO_ITEM");
  const antes = semBloqueio(item("02074300"));
  assert.equal(antes.estado, "REQUER_VALIDACAO");
  assert.deepEqual(antes.regrasCandidatas, [id]);
  const v = comBloqueio(item("02074300"));
  assert.deepEqual(v.regrasCandidatas, []);
  assert.deepEqual(v.regrasBloqueadas, [id]);
  assert.equal(v.regraAplicada, null);
  assert.equal(v.estado, "CORRETO");
  assert.ok(v.motivo.includes(MOTIVO_BLOQUEIO));
});

test("bloqueios: SIM não confirma regra bloqueada (nem gera economia)", () => {
  const id = "02074300-200003-I-19";
  const v = comBloqueio(item("02074300"), [sim("02074300", id)]);
  assert.equal(v.regraAplicada, null);
  assert.equal(v.estado, "CORRETO");
  assert.equal(v.economiaPotencial, 0);
  assert.deepEqual(v.esperado, { cst: "000", cClassTrib: "000001" });
  // quem informou o código do benefício fica como quem informa benefício sem regra que o ampare (mesmo resultado sem a regra)
  const semRegra: BaseNormativa = { ...base, regras: base.regras.filter((r) => !(r.id === id && r.ncm === "02074300")) };
  const informouBeneficio = comBloqueio(item("02074300", "200", "200003"), [sim("02074300", id)]);
  const comoSeNaoExistisse = classificarItem(doc, item("02074300", "200", "200003"), { base: semRegra, empresa, agora: AGORA });
  assert.equal(informouBeneficio.estado, comoSeNaoExistisse.estado);
  assert.equal(informouBeneficio.exposicao, comoSeNaoExistisse.exposicao);
});

test("bloqueios: nenhuma das 149 regras é candidata ou aplicada, mesmo com SIM", () => {
  for (const b of bloqueios.values()) {
    const v = comBloqueio(item(b.ncm), [sim(b.ncm, b.regraId)]);
    assert.ok(!v.regrasCandidatas.includes(b.regraId), `${b.regraId} ficou candidata`);
    assert.notEqual(v.regraAplicada, b.regraId);
    assert.ok(v.regrasBloqueadas?.includes(b.regraId), `${b.regraId} sem marca de bloqueio`);
  }
});

test("bloqueios: grupo A bloqueia só o enquadramento VEDADO; a regra do Anexo I continua normal", () => {
  const vedada = idDe("11010010", "200034"), anexoI = idDe("11010010", "200003");
  assert.equal(bloqueios.get(`${vedada}|11010010`)?.tipo, "VEDADO_ANEXO_I");
  assert.ok(!bloqueios.has(`${anexoI}|11010010`));
  const v = comBloqueio(item("11010010"));
  assert.ok(!v.regrasCandidatas.includes(vedada));
  assert.ok(v.regrasCandidatas.includes(anexoI));
  assert.equal(v.estado, "REQUER_VALIDACAO");
  const comSim = comBloqueio(item("11010010"), [sim("11010010", anexoI)]);
  assert.equal(comSim.regraAplicada, anexoI);
  assert.deepEqual(comSim.esperado, { cst: "200", cClassTrib: "200003" });
  const simNaVedada = comBloqueio(item("11010010"), [sim("11010010", vedada)]);
  assert.notEqual(simNaVedada.regraAplicada, vedada);
});

test("bloqueios: 9021.39.91 e 9021.39.99 (200004) bloqueados pela exceção expressa da LC 214, Anexo XII item 5", () => {
  for (const ncm of ["90213991", "90213999"]) {
    const b = bloqueios.get(`${ncm}-200004-XII-7|${ncm}`)!;
    assert.equal(b.tipo, "VEDADO_EXCECAO_LEI");
    assert.deepEqual(b.excecaoNaLeiEmItens, ["5"]);
    assert.ok(b.fatosF1.some((f) => f.papel === "exclui o NCM" && f.trecho.includes("9021.39.91 e 9021.39.99")));
    assert.ok(!comBloqueio(item(ncm)).regrasCandidatas.includes(b.regraId));
  }
});

test("bloqueios: exclusões legais do Anexo IV item 49 (posição 30.06) bloqueadas", () => {
  const b = bloqueios.get("30063011-200030-IV-49|30063011")!;
  assert.equal(b.tipo, "EXCLUSAO_LEGAL");
  assert.ok(b.fatosF1.some((f) => f.papel === "exclui o NCM" && f.trecho.includes("exceto os da posição 30.06")));
  const v = comBloqueio(item("30063011"), [sim("30063011", b.regraId)]);
  assert.ok(!v.regrasCandidatas.includes(b.regraId));
  assert.notEqual(v.regraAplicada, b.regraId);
});

test("bloqueios: regra CONFIRMADA continua igual (19022000 / 200034)", () => {
  const id = "19022000-200034-VII-9";
  for (const validacoes of [[], [sim("19022000", id)]]) {
    const a = comBloqueio(item("19022000"), validacoes), b = semBloqueio(item("19022000"), validacoes);
    assert.deepEqual(a, b);
    assert.equal(a.regrasBloqueadas, undefined);
  }
  assert.equal(comBloqueio(item("19022000"), [sim("19022000", id)]).regraAplicada, id);
});

test("bloqueios: regra NÃO DETERMINADA continua igual (21069090: 9 candidatas, 60% e zero)", () => {
  const id = idDe("21069090", "200033");
  for (const validacoes of [[], [sim("21069090", id)]]) assert.deepEqual(comBloqueio(item("21069090"), validacoes), semBloqueio(item("21069090"), validacoes));
  assert.equal(comBloqueio(item("21069090")).regrasCandidatas.length, 9);
  assert.equal(comBloqueio(item("21069090"), [sim("21069090", id)]).regraAplicada, id);
});

test("bloqueios: a explicação mantém a regra bloqueada como evidência, sem D3", () => {
  const ctx = carregarContexto({ base: ARQ_BASE, v2: "data/base-normativa.v2.json", matriz: "docs/etapa6/matriz-decisao.json", empresa: "test/fixtures/empresa-teste.json" });
  const v = comBloqueio(item("02074300"));
  const [x] = explicarVereditos([v], ctx, [{ ...doc, itens: [item("02074300")] }]);
  const r = x!.explicacaoInformativa!.regras.find((g) => g.regraIdInformado === "02074300-200003-I-19")!;
  assert.equal(r.bloqueio?.tipo, "VEDADO_EXCECAO_ITEM");
  assert.equal(r.auditoriaOficial?.situacaoNcmSvrs, "VEDADO");
  assert.ok(!x!.explicacaoInformativa!.decisoesPendentes.some((d) => d.decisao === "D3"));
  assert.equal(x!.explicacaoInformativa!.reducaoDoItem, null, "regra bloqueada não aparece como redução prevista");
});

test("bloqueios: auditoria que não corresponde à base interrompe o processamento", () => {
  const dir = mkdtempSync(join(tmpdir(), "blq-"));
  const outraBase = join(dir, "base-normativa.json");
  writeFileSync(outraBase, readFileSync(ARQ_BASE, "utf8").replace("\"versao\"", "\"versao_\""));
  copyFileSync("data/auditoria-oficial.json", join(dir, "auditoria-oficial.json"));
  assert.throws(() => bloqueiosParaBase(outraBase), /não corresponde/);
  // sem arquivo de auditoria na pasta da base: sem bloqueio
  const semAud = join(mkdtempSync(join(tmpdir(), "blq-")), "base-normativa.json");
  copyFileSync(ARQ_BASE, semAud);
  assert.equal(bloqueiosParaBase(semAud).size, 0);
});
