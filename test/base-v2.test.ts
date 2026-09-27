/**
 * Integridade da base v2 (data/base-normativa.v2.json) em relação à base atual:
 * as etapas 3 a 5 só acrescentam blocos; os 18 campos de cada regra, o catálogo
 * e o conjunto de regras continuam exatamente os mesmos, e as vinculações da
 * Etapa 5 apontam para regras existentes sem aplicar nenhum valor.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const brutoAtual = readFileSync("data/base-normativa.json");
const atual = JSON.parse(brutoAtual.toString("utf8"));
const v2 = JSON.parse(readFileSync("data/base-normativa.v2.json", "utf8"));
const CAMPOS = Object.keys(atual.regras[0]);
const BLOCOS_REGRA = ["original", "originaisAgrupados"];
/** Etapa 5.3 (Fase 3): itemOficial, só quando a lei cobre o NCM com um único item. */
const OPCIONAL_REGRA = ["itemOficial"];
const BLOCOS_RAIZ = ["fontes", "vinculacoes", "evidenciasOficiais"];

/** Mesmo formato do json.dump(indent=1) do extrair_base.py, com 1.0/0.6 nos campos decimais. */
function serializar(base: unknown): string {
  return JSON.stringify(base, null, 1).replace(/^(\s*"(?:reducao|reducaoAliquota)": )(-?\d+)(,?)$/gm, "$1$2.0$3");
}

test("base v2: os 18 campos de cada regra são idênticos aos da base atual", () => {
  assert.equal(CAMPOS.length, 18);
  assert.equal(v2.regras.length, atual.regras.length);
  v2.regras.forEach((r: Record<string, unknown>, i: number) => {
    const campos = Object.fromEntries(CAMPOS.map((k) => [k, r[k]]));
    assert.deepEqual(campos, atual.regras[i], `regra[${i}]`);
    assert.deepEqual(Object.keys(r).slice(0, 18), CAMPOS, `regra[${i}]: ordem dos campos`);
  });
});

test("base v2: nenhuma regra criada, removida ou reordenada", () => {
  assert.deepEqual(
    v2.regras.map((r: { id: string }) => r.id),
    atual.regras.map((r: { id: string }) => r.id),
  );
  assert.deepEqual(v2.catalogoCodigos, atual.catalogoCodigos);
});

test("base v2: as regras só ganharam os blocos da Etapa 3 e o itemOficial da Etapa 5.3 (nada da Etapa 5 dentro das regras)", () => {
  for (const r of v2.regras) {
    const k = Object.keys(r);
    assert.deepEqual(k, "itemOficial" in r ? [...CAMPOS, ...BLOCOS_REGRA, ...OPCIONAL_REGRA] : [...CAMPOS, ...BLOCOS_REGRA]);
  }
  assert.deepEqual(Object.keys(v2), [...Object.keys(atual), ...BLOCOS_RAIZ]);
});

test("base v2 sem os blocos novos é igual à base atual, byte a byte", () => {
  const projecao: Record<string, unknown> = Object.fromEntries(Object.entries(v2).filter(([k]) => !BLOCOS_RAIZ.includes(k)));
  projecao.regras = v2.regras.map((r: Record<string, unknown>) =>
    Object.fromEntries(Object.entries(r).filter(([k]) => !BLOCOS_REGRA.includes(k) && !OPCIONAL_REGRA.includes(k))));
  assert.ok(Buffer.from(serializar(projecao), "utf8").equals(brutoAtual));
});

test("base v2: vinculações da Etapa 5 apontam para regras existentes e não aplicam valores", () => {
  const vinc = v2.vinculacoes;
  assert.match(vinc.modo, /nenhum campo das regras foi alterado/);
  for (const x of vinc.regras) {
    const r = v2.regras[x.regra.indice];
    assert.ok(r, `índice ${x.regra.indice}`);
    assert.equal(r.original.linha, x.regra.linha);
    assert.equal(r.id, x.regra.regraId);
    assert.equal(r.ncm, x.regra.ncm);
    assert.equal(r.item, x.valorRegra, "valor da regra registrado como está");
  }
  for (const x of vinc.codigo) for (const a of x.alcance) assert.equal(v2.regras[a.indice].cClassTrib, x.cClassTrib);
  const escopo = v2.regras.filter((r: { cClassTrib: string }) => vinc.escopo.includes(r.cClassTrib)).length;
  assert.equal(vinc.regras.length, escopo, "um registro por regra do escopo");
});
