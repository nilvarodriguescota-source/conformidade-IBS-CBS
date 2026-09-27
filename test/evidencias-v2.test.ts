/**
 * Etapa 5.3 (Fase 3): evidências oficiais registradas na v2. Só proveniência: nenhum campo das regras muda,
 * itemOficial só existe com evidência, divergências ficam registradas e nada é escolhido quando há vários itens.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { classificarDocumentos } from "../src/motor.js";
import { carregarContexto, explicarVereditos } from "../src/explicador.js";
import type { BaseNormativa, Documento, Empresa, ItemDocumento } from "../src/tipos.js";

const atual = JSON.parse(readFileSync("data/base-normativa.json", "utf8")) as BaseNormativa;
const v2 = JSON.parse(readFileSync("data/base-normativa.v2.json", "utf8"));
const aud = JSON.parse(readFileSync("data/auditoria-oficial.json", "utf8"));
const evid = v2.evidenciasOficiais;
const ev = (id: string) => evid.regras.find((x: { regraId: string }) => x.regraId === id);

test("evidências v2: 1.369 regras da planilha + 1.066 da D5, item original preservado, nenhum campo original alterado", () => {
  assert.equal(v2.regras.length, 2435);
  assert.equal(evid.regras.length, 2435);
  assert.ok(v2.regras.slice(0, 1369).every((r: { original: { fonte: string } }) => r.original.fonte === "PLANILHA"));
  assert.ok(v2.regras.slice(1369).every((r: { original: { fonte: string; linha: null } }) => r.original.fonte === "OFICIAL_D5" && r.original.linha === null));
  v2.regras.forEach((r: Record<string, unknown>, i: number) => {
    for (const [k, valor] of Object.entries(atual.regras[i]!)) assert.deepEqual(r[k], valor, `regra[${i}].${k}`);
    assert.equal(evid.regras[i].itemDaBase, atual.regras[i]!.item);
  });
});

test("evidências v2: itemOficial só com um único item oficial e com fato da lei do mesmo item", () => {
  const com = v2.regras.map((r: { itemOficial?: string }, i: number) => [r, i] as const).filter(([r]: readonly [{ itemOficial?: string }, number]) => r.itemOficial !== undefined);
  assert.equal(com.length, 1737);
  for (const [r, i] of com) {
    const x = evid.regras[i];
    assert.equal(x.itemOficial, r.itemOficial);
    assert.deepEqual(x.itensOficiais, [r.itemOficial]);
    assert.notEqual(x.statusOficial, "VEDADO");
  }
  // 19022000 / 200034: Anexo VII, item 9
  const e = ev("19022000-200034-VII-9");
  assert.equal(e.statusOficial, "CONFIRMADA");
  assert.equal(e.itemOficial, "9");
  assert.ok(e.fatosF1.some((f: { dispositivo: string; trecho: string }) => f.dispositivo === "LC 214/2025, Anexo VII, item 9" && f.trecho.includes("1902.20.00")));
  assert.equal(v2.regras[e.indice].itemOficial, "9");
  assert.equal(v2.regras[e.indice].item, "9");
});

test("evidências v2: vários itens oficiais — nenhum escolhido, todos registrados", () => {
  const e = ev("21069090-200033-VI-39");
  assert.equal(e.statusOficial, "NAO_DETERMINADA");
  assert.equal(e.itemOficial, null);
  assert.equal(e.itensOficiais.length, 8);
  assert.ok(!("itemOficial" in v2.regras[e.indice]));
  assert.equal(e.vinculoEtapa5, `R-${e.indice}`, "200033 referencia a vinculação da Etapa 5, sem copiar os fatos");
  assert.ok(e.divergencias.some((d: { tipo: string }) => d.tipo === "varios_itens_oficiais"));
});

test("evidências v2: 200038 com 'item' em forma de posição de NCM — divergência registrada, item não corrigido", () => {
  const e = ev("07129010-200038-IX-03.09");
  assert.equal(v2.regras[e.indice].item, "03.09");
  assert.equal(e.itemDaBase, "03.09");
  assert.deepEqual(e.itensOficiais, ["10", "21"]);
  assert.equal(e.itemOficial, null);
  assert.ok(e.divergencias.some((d: { tipo: string }) => d.tipo === "item_da_base_com_forma_de_posicao_ncm"));
  // quando há um único item oficial diferente do item da base: itemOficial preenchido e divergência registrada, item mantido
  const dif = evid.regras.find((x: { itemOficial: string | null; itemDaBase: string }) => x.itemOficial !== null && x.itemOficial !== x.itemDaBase);
  assert.ok(dif.divergencias.some((d: { tipo: string; itemDaBase: string; itemOficial: string }) => d.tipo === "item_da_base_difere_do_item_oficial" && d.itemDaBase === dif.itemDaBase && d.itemOficial === dif.itemOficial));
  assert.equal(v2.regras[dif.indice].item, atual.regras[dif.indice]!.item);
});

test("evidências v2: status oficial e D3 vêm da auditoria (sem lógica paralela); VEDADO sem itemOficial", () => {
  const porIndice = new Map(aud.regras.map((a: { indice: number }) => [a.indice, a]));
  for (const x of evid.regras) {
    const a = porIndice.get(x.indice) as { status: string; situacaoNcmSvrs: string };
    assert.equal(x.statusAuditoria, a.status);
    assert.equal(x.statusOficial, a.situacaoNcmSvrs === "VEDADO" ? "VEDADO" : a.status);
    assert.equal(x.vinculoNcmItemConfirmado, a.status === "CONFIRMADA");
  }
  const ved = ev("02074300-200003-I-19");
  assert.equal(ved.statusOficial, "VEDADO");
  assert.equal(ved.itemOficial, null);
  assert.ok(ved.divergencias.some((d: { tipo: string }) => d.tipo === "ncm_vedado_no_svrs"));
  assert.match(evid.definicaoD3, /não está CONFIRMADO/);
});

test("evidências v2: fontes com URL, snapshot e SHA-256 da Etapa 4; vínculos de código dos 12 códigos, sem duplicata", () => {
  for (const f of ["F1", "F2"]) {
    const a = Object.values(v2.fontes.registros as Record<string, { arquivos: { id: string; sha256: string; caminho: string }[] }>).flatMap((r) => r.arquivos).find((x) => x.id === `${f}.html`)!;
    assert.equal(evid.fontes[f].sha256, a.sha256);
    assert.equal(evid.fontes[f].arquivo, a.caminho);
    assert.match(evid.fontes[f].url, /^https:\/\//);
  }
  assert.equal(evid.dataAuditoria, "2026-09-24");
  const ids = [...v2.vinculacoes.codigo, ...evid.codigo].map((x: { id: string }) => x.id);
  assert.equal(new Set(ids).size, ids.length);
  const cods = new Set([...v2.vinculacoes.codigo, ...evid.codigo].map((x: { cClassTrib: string }) => x.cClassTrib));
  assert.deepEqual([...cods].sort(), Object.keys(v2.catalogoCodigos).sort());
  assert.ok(!evid.codigo.some((x: { cClassTrib: string }) => x.cClassTrib === "200033" || x.cClassTrib === "200043"));
});

test("evidências v2: a redução do 200034 passa a ter o vínculo registrado, sem mudar o veredito", () => {
  const ctx = carregarContexto({ base: "data/base-normativa.json", v2: "data/base-normativa.v2.json", matriz: "docs/etapa6/matriz-decisao.json", empresa: "test/fixtures/empresa-teste.json" });
  const empresa: Empresa = { cnpj: "00000000000000", regime: "normal", barOuRestaurante: false };
  const item: ItemDocumento = { nItem: 1, cProd: "P1", xProd: "PASTEL", ncm: "19022000", cfop: "5102", quantidade: 1, valorProduto: 1000, desconto: 0, baseCalculo: 1000, cst: "000", cClassTrib: "000001", aliquotas: {} };
  const doc: Documento = { chave: "EV", modelo: "55", numero: "1", serie: "1", dataEmissao: "2026-09-10T10:00:00-03:00", tipoOperacao: "saida", finalidade: "1", situacao: "100", cancelado: false,
    emitente: { cnpj: "00000000000000", crt: "3", uf: "SC" }, destinatario: { cnpj: "11111111000191", cpf: null, uf: "SC", indIEDest: "1" }, itens: [item], arquivo: "EV.xml", avisos: [] };
  const vereditos = classificarDocumentos([doc], { base: atual, empresa, agora: "2026-09-24T00:00:00-03:00" });
  const antes = JSON.stringify(vereditos);
  const [x] = explicarVereditos(vereditos, ctx, [doc]);
  assert.equal(JSON.stringify(vereditos), antes);
  const o = x!.explicacaoInformativa!.reducaoDoItem!.opcoes[0]!;
  assert.equal(o.evidencia, "oficial_confirmada");
  assert.match(o.motivo, /C-200034-reducaoAliquota/);
  assert.equal(x!.estado, "REQUER_VALIDACAO");
});
