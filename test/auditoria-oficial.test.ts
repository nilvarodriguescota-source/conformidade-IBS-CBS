/**
 * Fase 1 da Etapa 5.3: a conferência com as fontes oficiais (data/auditoria-oficial.json) chega à explicação
 * só como evidência. O status é da regra, nunca do produto, e nada muda no veredito.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { mkdtempSync, readFileSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { classificarDocumentos } from "../src/motor.js";
import { carregarContexto, explicarVereditos } from "../src/explicador.js";
import type { BaseNormativa, Documento, Empresa, ItemDocumento, RespostaValidacao } from "../src/tipos.js";

const caminhos = { base: "data/base-normativa.json", v2: "data/base-normativa.v2.json", matriz: "docs/etapa6/matriz-decisao.json", empresa: "empresa.json" };
const ctx = carregarContexto(caminhos);
const base = JSON.parse(readFileSync(caminhos.base, "utf8")) as BaseNormativa;
const empresa: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: false };
const sha = (f: string) => createHash("sha256").update(readFileSync(f)).digest("hex");

function item(nItem: number, ncm: string, cst: string, cClassTrib: string, cProd: string): ItemDocumento {
  return { nItem, cProd, xProd: `P${cProd}`, ncm, cfop: "5102", quantidade: 1, valorProduto: 1000, desconto: 0, baseCalculo: 1000, cst, cClassTrib, aliquotas: {} };
}
function doc(itens: ItemDocumento[]): Documento {
  return {
    chave: "AUD", modelo: "55", numero: "1", serie: "1", dataEmissao: "2026-09-10T10:00:00-03:00", tipoOperacao: "saida", finalidade: "1", situacao: "100", cancelado: false,
    emitente: { cnpj: "00000000000000", crt: "3", uf: "SC" }, destinatario: { cnpj: "11111111000191", cpf: null, uf: "SC", indIEDest: "1" }, itens, arquivo: "AUD.xml", avisos: [],
  };
}
function explicar(itens: ItemDocumento[], validacoes: RespostaValidacao[] = [], c = ctx) {
  const docs = [doc(itens)];
  const vereditos = classificarDocumentos(docs, { base, empresa, validacoes, agora: "2026-09-24T00:00:00-03:00" });
  const antes = JSON.stringify(vereditos);
  return { vereditos, antes, explicados: explicarVereditos(vereditos, c, docs) };
}
const regraDe = (x: ReturnType<typeof explicar>["explicados"][number], id: string) => x.explicacaoInformativa!.regras.find((r) => r.regraIdInformado === id)!;

test("auditoria oficial: o arquivo corresponde à base, à v2 e aos snapshots atuais", () => {
  const a = JSON.parse(readFileSync("data/auditoria-oficial.json", "utf8"));
  assert.equal(a.entradas.base.sha256, sha("data/base-normativa.json"));
  assert.equal(a.entradas.v2.sha256, sha("data/base-normativa.v2.json"));
  assert.equal(a.entradas.F1.sha256, sha("data/fontes/lc214/lcp214.htm"));
  assert.equal(a.entradas.F2.sha256, sha("data/fontes/svrs/svrs.html"));
  assert.deepEqual(a.resumo.porStatus, { CONFIRMADA: 856, DIVERGENTE: 295, NAO_DETERMINADA: 203, NAO_LOCALIZADA: 15 });
  assert.equal(a.resumo.lacunas, 907);
  assert.ok(ctx.auditoria, "o explicador carregou a auditoria");
});

test("auditoria oficial: 19022000 / 200034 é regra conferida com a fonte oficial (Anexo VII, item 9, 60%)", () => {
  const id = "19022000-200034-VII-9";
  const { explicados } = explicar([item(1, "19022000", "000", "000001", "2727")], [{ ncm: "19022000", cProd: "2727", regraId: id, resposta: "SIM", autor: "Teste", data: "2026-09-24" }]);
  const a = regraDe(explicados[0]!, id).auditoriaOficial!;
  assert.equal(a.status, "CONFIRMADA");
  assert.equal(a.cClassTrib, "200034");
  assert.equal(a.itemDaBase, "9");
  assert.equal(a.itemOficial, "9");
  assert.equal(a.situacaoNcmSvrs, "PERMITIDO");
  assert.ok(a.fatosF1.some((f) => f.dispositivo === "LC 214/2025, Anexo VII, item 9" && f.trecho.includes("Massas alimentícias dos códigos 1902.20.00 e 1902.30.00")));
  assert.equal(a.codigo.F1.dispositivo, "LC 214/2025, art. 135, caput");
  assert.deepEqual([a.codigo.F2?.cst, a.codigo.F2?.nroAnexo, a.codigo.F2?.percRedIbs, a.codigo.F2?.percRedCbs], ["200", 7, 60, 60]);
  assert.deepEqual(a.codigo.comparacao, { cst: "concorda", anexo: "concorda", reducao: "concorda", fundamento: "concorda" });
  assert.match(a.fontes.F1.url, /planalto\.gov\.br/);
  assert.match(a.fontes.F2.url, /svrs\.rs\.gov\.br/);
  // a conferência não mexe no veredito; desde a Fase 3 o vínculo C-200034-reducaoAliquota está registrado na v2
  assert.equal(explicados[0]!.estado, "INCORRETO_ECONOMIA");
  assert.equal(regraDe(explicados[0]!, id).reducao!.evidencia, "oficial_confirmada");
});

test("auditoria oficial: NCM VEDADO com exceção expressa na lei vira alerta, sem bloquear a regra", () => {
  const id = "02074300-200003-I-19";
  const { explicados } = explicar([item(1, "02074300", "000", "000001", "V1")]);
  const x = explicados[0]!;
  assert.equal(x.estado, "REQUER_VALIDACAO");
  assert.ok(x.regrasCandidatas.includes(id), "a regra continua candidata nesta fase");
  const a = regraDe(x, id).auditoriaOficial!;
  assert.equal(a.status, "DIVERGENTE");
  assert.equal(a.situacaoNcmSvrs, "VEDADO");
  assert.equal(a.excluidoDoItemDaRegra, true);
  assert.ok(a.fatosF1.some((f) => f.papel === "exclui o NCM" && f.trecho.includes("0207.43.00")));
});

test("auditoria oficial: divergência entre lei e SVRS fica registrada, sem escolher uma fonte", () => {
  // SVRS lista o NCM, nenhum item da lei o cobre
  const soSvrs = regraDe(explicar([item(1, "90221411", "000", "000001", "D1")]).explicados[0]!, "90221411-200004-XII-7").auditoriaOficial!;
  assert.equal(soSvrs.status, "DIVERGENTE");
  assert.equal(soSvrs.situacaoNcmSvrs, "PERMITIDO");
  assert.ok(soSvrs.motivos.some((m) => m.startsWith("NCM só no SVRS")));
  assert.deepEqual(soSvrs.itensOficiais, []);
  // a lei cobre o NCM, o SVRS não o lista para o código
  const soLei = regraDe(explicar([item(1, "90251110", "000", "000001", "D2")]).explicados[0]!, "90251110-200004-XII-12").auditoriaOficial!;
  assert.equal(soLei.status, "DIVERGENTE");
  assert.equal(soLei.situacaoNcmSvrs, "AUSENTE");
  assert.ok(soLei.motivos.some((m) => m.startsWith("NCM só na lei")));
  assert.ok(soLei.itensOficiais.length > 0);
});

test("auditoria oficial: 21069090 tem vários itens e candidatas com tratamentos diferentes", () => {
  const x = explicar([item(1, "21069090", "000", "000001", "PAO")]).explicados[0]!;
  const a = regraDe(x, "21069090-200033-VI-39").auditoriaOficial!;
  assert.equal(a.status, "NAO_DETERMINADA");
  assert.equal(a.itensOficiais.length, 8);
  assert.equal(a.itemOficial, null);
  const valores = new Set(x.explicacaoInformativa!.reducaoDoItem!.opcoes.map((o) => o.valor));
  assert.deepEqual([...valores].sort(), [0.6, 1]);
  assert.equal(x.estado, "REQUER_VALIDACAO");
});

test("auditoria oficial: lacuna de cobertura é só informação (nenhuma candidata criada)", () => {
  const a = JSON.parse(readFileSync("data/auditoria-oficial.json", "utf8")) as { lacunas: { ncm: string; cClassTrib: string }[] };
  const semRegra = a.lacunas.find((l) => !base.regras.some((r) => r.ncm === l.ncm))!;
  const x = explicar([item(1, semRegra.ncm, "000", "000001", "L1")]).explicados[0]!;
  assert.deepEqual(x.regrasCandidatas, []);
  assert.ok(x.explicacaoInformativa!.lacunasDeCobertura!.some((l) => l.cClassTrib === semRegra.cClassTrib));
});

test("auditoria oficial: regraId repetido (D7) não recebe conferência (regra não identificada com segurança)", () => {
  const x = explicar([item(1, "23080000", "000", "000001", "A7")]).explicados[0]!;
  const r = regraDe(x, "23080000-200038-IX-23.06");
  assert.equal(r.vinculo, "ambiguo_regraid_duplicado");
  assert.equal(r.auditoriaOficial ?? null, null);
});

test("auditoria oficial: arquivo que não corresponde às entradas é ignorado, com aviso", () => {
  const a = JSON.parse(readFileSync("data/auditoria-oficial.json", "utf8"));
  a.entradas.base.sha256 = "0".repeat(64);
  const dir = mkdtempSync(join(tmpdir(), "aud-"));
  const f = join(dir, "auditoria-oficial.json");
  writeFileSync(f, JSON.stringify(a));
  const c = carregarContexto({ ...caminhos, auditoria: f });
  assert.equal(c.auditoria, null);
  assert.ok(c.avisos.some((x) => x.includes("A auditoria oficial não corresponde")));
  const x = explicar([item(1, "19022000", "000", "000001", "2727")], [], c).explicados[0]!;
  assert.equal(regraDe(x, "19022000-200034-VII-9").auditoriaOficial ?? null, null);
});

test("auditoria oficial: o veredito do motor é preservado", () => {
  const itens = [item(1, "19022000", "000", "000001", "2727"), item(2, "02074300", "200", "200003", "V1"), item(3, "21069090", "000", "000001", "PAO"), item(4, "90221411", "000", "000001", "D1")];
  const { vereditos, antes, explicados } = explicar(itens);
  assert.equal(JSON.stringify(vereditos), antes);
  assert.equal(JSON.stringify(explicados.map(({ explicacaoInformativa: _e, ...v }) => v)), antes);
});
