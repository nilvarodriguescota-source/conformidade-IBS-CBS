/**
 * Etapa 9, Fase A: o explicador só explica. Os documentos abaixo cobrem os casos
 * sensíveis (norma confirmada, conflito entre fontes, lacuna, 200043, regraId
 * duplicado, validações legadas, ausência de regra). O motor roda como hoje; o
 * explicador roda depois e não pode alterar nada do veredito.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { classificarDocumentos } from "../src/motor.js";
import { carregarContexto, explicarVereditos } from "../src/explicador.js";
import type { BaseNormativa, Documento, ItemDocumento, RespostaValidacao, VereditoExplicado } from "../src/tipos.js";

const ctx = carregarContexto({
  base: "data/base-normativa.json",
  v2: "data/base-normativa.v2.json",
  matriz: "docs/etapa6/matriz-decisao.json",
  empresa: "test/fixtures/empresa-teste.json",
});
const base = JSON.parse(readFileSync("data/base-normativa.json", "utf8")) as BaseNormativa;
const empresa = JSON.parse(readFileSync("test/fixtures/empresa-teste.json", "utf8")) as { cnpj: string; regime: "normal"; validacoes?: RespostaValidacao[] };

function item(nItem: number, ncm: string, cst: string, cClassTrib: string, cProd: string): ItemDocumento {
  return { nItem, cProd, xProd: `P${cProd}`, ncm, cfop: "5102", quantidade: 1, valorProduto: 1000, desconto: 0, baseCalculo: 1000, cst, cClassTrib, aliquotas: {} };
}
function doc(chave: string, modelo: string, itens: ItemDocumento[]): Documento {
  return {
    chave, modelo, numero: "1", serie: "1", dataEmissao: "2026-09-10T10:00:00-03:00", tipoOperacao: "saida", finalidade: "1", situacao: "100", cancelado: false,
    emitente: { cnpj: "00000000000000", crt: "3", uf: "SC" }, destinatario: { cnpj: "11111111000191", cpf: null, uf: "SC", indIEDest: "1" },
    itens, arquivo: `${chave}.xml`, avisos: [],
  };
}
const docs = [
  doc("SINT-55", "55", [
    item(1, "28273993", "200", "200033", "A1"),   // norma confirmada
    item(2, "21069090", "200", "200033", "A2"),   // vários itens e outro código
    item(3, "28272010", "200", "200033", "A3"),   // item divergente
    item(4, "17025000", "200", "200033", "A4"),   // frutose
    item(5, "85176259", "200", "200043", "A5"),   // 200043
    item(6, "87091100", "200", "200043", "A6"),   // lacuna
    item(7, "23080000", "200", "200038", "A7"),   // regraId duplicado
    item(8, "19022000", "200", "200034", "2727"), // validação com autor humano
    item(9, "19022000", "200", "200034", "2726"), // validação com autor "Sistema"
    item(10, "22030000", "000", "000001", "A10"), // sem benefício
    item(11, "99999999", "000", "000001", "A11"), // NCM fora da base
  ]),
  doc("SINT-65", "65", [item(1, "85176259", "200", "200043", "B1")]), // 200043 em NFC-e
];
const vereditos = classificarDocumentos(docs, { base, empresa, validacoes: empresa.validacoes ?? [], agora: "2026-09-24T00:00:00-03:00" });
const antes = JSON.stringify(vereditos);
const explicados = explicarVereditos(vereditos, ctx, docs);
const achar = (documento: string, nItem: number): VereditoExplicado => {
  const x = explicados.find((v) => v.documento === documento && v.nItem === nItem);
  assert.ok(x, `${documento}/${nItem}`);
  return x;
};
const ex = (documento: string, nItem: number) => achar(documento, nItem).explicacaoInformativa!;

function congelar<T>(o: T): T {
  if (o && typeof o === "object" && !Object.isFrozen(o)) { Object.freeze(o); for (const v of Object.values(o)) congelar(v); }
  return o;
}

test("explicador: não altera o veredito (entrada congelada, saída idêntica fora da explicação)", () => {
  const congelados = congelar(structuredClone(vereditos));
  const saida = explicarVereditos(congelados, ctx, docs); // lançaria erro se tentasse alterar
  assert.equal(JSON.stringify(vereditos), antes, "vereditos originais intactos");
  assert.equal(saida.length, vereditos.length);
  saida.forEach((s, i) => {
    const { explicacaoInformativa, ...resto } = s;
    assert.deepEqual(resto, vereditos[i]);
    assert.equal(explicacaoInformativa?.fase, "A_INFORMATIVA");
    assert.equal(explicacaoInformativa?.matriz.efeito, "somente_explicacao");
  });
});

test("explicador: NORMA_CONFIRMADA não vira BENEFICIO_CONFIRMADO", () => {
  const e = ex("SINT-55", 1);
  assert.equal(e.regras[0]?.statusNormativo, "NORMA_CONFIRMADA");
  assert.equal(e.statusBeneficio?.status, "BENEFICIO_PENDENTE_VALIDACAO");
  for (const v of explicados) assert.notEqual(v.explicacaoInformativa?.statusBeneficio?.status, "BENEFICIO_CONFIRMADO");
});

test("explicador: validação legada não vira HUMANO_CONFIRMOU (estado do motor preservado)", () => {
  const v = achar("SINT-55", 9);
  const e = v.explicacaoInformativa!;
  assert.equal(v.estado, "CORRETO", "estado vem do motor e não muda");
  assert.equal(e.validacoesLegadas[0]?.classificacao, "autor_sistema_nao_e_confirmacao_humana");
  assert.equal(e.validacoesLegadas[0]?.tratamento.status, "pendente");
  assert.deepEqual(e.humanoConfirmou, []);
  assert.ok(e.ausencias.includes("VALIDACAO_HUMANA_NAO_DISPONIVEL"));
  assert.ok(e.limitacoes.some((l) => l.includes("autor || \"Sistema\"")));
  const sobreSistema = e.limitacoes.find((l) => l.includes("autor fixo \"Sistema\""));
  assert.ok(sobreSistema, "a explicação registra que a tela envia o autor fixo");
  assert.match(sobreSistema, /A autoria não foi coletada/);
  assert.match(sobreSistema, /não indica decisão automática do sistema nem validação humana comprovada/);
  // Autor humano com justificativa, mas sem hash das fontes: continua legada, não é HUMANO_CONFIRMOU
  const humano = ex("SINT-55", 8);
  assert.deepEqual(humano.humanoConfirmou, []);
  assert.equal(humano.validacoesLegadas.length, 1);
  assert.equal(humano.validacoesLegadas[0]?.classificacao, "sem_hash_das_fontes_na_data");
  assert.equal(humano.validacoesLegadas[0]?.registro.autor, "Nilva");
  assert.ok(humano.validacoesLegadas[0]?.registro.justificativa);
  assert.equal(humano.validacoesLegadas[0]?.tratamento.status, "pendente");
  assert.ok(humano.ausencias.includes("VALIDACAO_HUMANA_NAO_DISPONIVEL"));
  assert.equal(achar("SINT-55", 8).estado, vereditos.find((v) => v.documento === "SINT-55" && v.nItem === 8)?.estado, "estado do motor preservado");
  for (const x of explicados) assert.deepEqual(x.explicacaoInformativa?.humanoConfirmou, []);
});

test("explicador: 87091100 (D5 = incluir) tem regras oficiais e vai para validação", () => {
  const v = achar("SINT-55", 6);
  const e = v.explicacaoInformativa!;
  assert.equal(v.estado, "REQUER_VALIDACAO");
  assert.deepEqual(e.lacunas, []);
  assert.ok(!e.ausencias.includes("SEM_REGRA_NA_BASE"));
  assert.deepEqual(e.regras.map((r) => r.statusNormativo), ["NORMA_POSSIVEL_MULTIPLOS_ITENS", "NORMA_POSSIVEL_MULTIPLOS_ITENS"]);
  const novas = base.regras.filter((r) => r.ncm === "87091100");
  assert.deepEqual(novas.map((r) => r.item), ["2.1", "2.3"]);
  assert.ok(novas.every((r) => (r.origemRegistro ?? "").startsWith("Fonte oficial (proposta D5)")));
});

test("explicador: decisões pendentes continuam pendentes", () => {
  for (const x of explicados) {
    const e = x.explicacaoInformativa!;
    for (const d of e.decisoesPendentes) { assert.equal(d.status, "pendente"); assert.ok(!("valor" in d)); }
    for (const l of e.lacunas) assert.equal(l.inclusaoComoRegra.status, "pendente");
    for (const c of e.regras.flatMap((r) => r.condicoes)) {
      if (c.combinacaoDosTipos) assert.equal(c.combinacaoDosTipos.status, "pendente");
      if (c.estadoSeContrariada) assert.equal(c.estadoSeContrariada.status, "pendente");
    }
    for (const div of e.regras.flatMap((r) => r.divergencias)) assert.equal(div.resolucao, null);
  }
  assert.deepEqual(ex("SINT-55", 6).decisoesPendentes.map((d) => d.decisao), ["D2", "D3", "D4"], "a D5 foi decidida; ficam as do 200043");
});

test("explicador: frutose fica em CONFLITO_ENTRE_FONTES, sem resolução", () => {
  const e = ex("SINT-55", 4);
  const r = e.regras[0]!;
  assert.equal(r.statusNormativo, "CONFLITO_ENTRE_FONTES");
  const div = r.divergencias.find((d) => d.tipo === "ncm_so_na_F1");
  assert.ok(div);
  assert.equal(div.resolucao, null);
  assert.deepEqual(div.valores.map((x) => x.fonte), ["F1", "F2"]);
  assert.equal(e.nivelEvidencia, "divergente");
  assert.notEqual(e.statusBeneficio?.status, "BENEFICIO_CONFIRMADO");
});

test("explicador: 200043 mantém \"e\" (lei) e \"ou\" (planilha); IndNfce é só informação", () => {
  const e = ex("SINT-55", 5);
  const c = e.regras[0]!.condicoes[0]!;
  assert.match(c.textoOficial.trecho ?? "", /autarquias e fundações/);
  assert.match(c.textoPlanilha?.valor ?? "", /autarquias ou fundações/);
  assert.equal(c.combinacaoDosTipos?.status, "pendente");
  // D3 (definição aprovada na 5.3): o NCM está em 3 itens do Anexo XI, logo o vínculo NCM × item não está CONFIRMADO
  assert.equal(e.regras[0]!.auditoriaOficial?.status, "NAO_DETERMINADA");
  assert.deepEqual(e.decisoesPendentes.map((d) => d.decisao), ["D2", "D3", "D4"]);
  const nfce = achar("SINT-65", 1);
  assert.equal(nfce.estado, achar("SINT-55", 5).estado, "NFC-e não muda o estado");
  assert.ok(nfce.explicacaoInformativa!.limitacoes.some((l) => l.includes("IndNfce = false")));
  assert.ok(nfce.explicacaoInformativa!.regras[0]!.fonteDiz.some((f) => f.valor === false && "campo" in f.localizacao && f.localizacao.campo === "IndNfce"));
});

test("explicador: D5 = incluir — nenhuma NCM oficial sem regra; as regras novas são identificadas com segurança", () => {
  assert.equal(ctx.v2.vinculacoes.ncmsOficiaisSemRegra.length, 0);
  assert.equal(base.regras.length, 2435);
  const d5 = base.regras.filter((r) => (r.origemRegistro ?? "").startsWith("Fonte oficial (proposta D5)"));
  assert.equal(d5.length, 1066);
  const amostra = d5.filter((r) => r.cClassTrib === "200043").slice(0, 5);
  const vs = classificarDocumentos([doc("D5", "55", amostra.map((r, i) => item(i + 1, r.ncm, "200", r.cClassTrib, `D${i}`)))], { base, empresa, agora: "2026-09-24T00:00:00-03:00" });
  for (const x of explicarVereditos(vs, ctx)) {
    const e = x.explicacaoInformativa!;
    assert.equal(x.estado, "REQUER_VALIDACAO");
    assert.deepEqual(e.lacunas, []);
    assert.ok(e.regras.length >= 1 && e.regras.every((r) => r.vinculo === "seguro" && r.referencia !== null && r.referencia.linha === null));
  }
});

test("explicador: regraId sozinho não é chave segura (23080000 duplicado)", () => {
  const e = ex("SINT-55", 7);
  assert.equal(e.regras.length, 1, "o id repetido é tratado uma vez");
  const r = e.regras[0]!;
  assert.equal(r.vinculo, "ambiguo_regraid_duplicado");
  assert.equal(r.referencia, null);
  assert.equal(r.statusNormativo, null);
  assert.deepEqual(r.fonteDiz, []);
  const div = r.divergencias[0]!;
  assert.equal(div.tipo, "regraid_duplicado");
  assert.deepEqual(div.regras.map((x) => x.linha), [776, 777]);
  assert.ok(e.ausencias.includes("REGRA_NAO_LOCALIZADA_COM_SEGURANCA"));
});

test("explicador: ausência de evidência não gera informação inventada", () => {
  const semRegra = ex("SINT-55", 11);
  assert.deepEqual(semRegra.regras, []);
  assert.deepEqual(semRegra.lacunas, []);
  assert.equal(semRegra.statusBeneficio, null);
  assert.deepEqual(semRegra.ausencias, ["SEM_REGRA_NA_BASE"]);
  assert.equal(semRegra.nivelEvidencia, "pendente");
  const foraEscopo = ex("SINT-55", 9).regras[0]!;
  assert.equal(foraEscopo.statusNormativo, "SEM_EVIDENCIA_OFICIAL");
  assert.ok(foraEscopo.fonteDiz.every((f) => f.fonte === "PLANILHA"), "só a planilha, sem fato oficial inventado");
  assert.deepEqual(foraEscopo.condicoes, []);
  // Redução fora do escopo da Etapa 5: desde a Fase 3 o vínculo de código está registrado na v2 (evidenciasOficiais);
  // os fatos são os da lei e do SVRS, dos snapshots registrados (nada inventado)
  assert.equal(foraEscopo.reducao?.evidencia, "oficial_confirmada");
  const registrados = new Set(Object.values(ctx.v2.fontes.registros).flatMap((r) => r.arquivos.map((a) => a.sha256)));
  assert.ok(foraEscopo.reducao!.fatos.length > 0 && foraEscopo.reducao!.fatos.every((f) => (f.fonte === "F1" || f.fonte === "F2") && registrados.has(f.sha256)));
  assert.equal(semRegra.reducaoDoItem, null);
  // Identificador que não existe na base: não localizado, sem evidência
  const falso = explicarVereditos([{ ...vereditos[0]!, regrasCandidatas: ["00000000-000000-X-0"], regraAplicada: null }], ctx)[0]!.explicacaoInformativa!;
  assert.equal(falso.regras[0]?.vinculo, "nao_localizado");
  assert.deepEqual(falso.regras[0]?.fonteDiz, []);
  assert.equal(falso.statusBeneficio, null);
  assert.equal(falso.regras[0]?.reducao?.evidencia, "nao_determinada");
  assert.equal(falso.regras[0]?.reducao?.valor, null);
});

test("explicador: nível de evidência reflete a composição das candidatas", () => {
  // 2106.90.90: 8 regras do 200033 (oficial) + 1 do 200003 (só planilha), sem conflito
  const misto = ex("SINT-55", 2);
  assert.deepEqual([...new Set(misto.regras.map((r) => r.statusNormativo))].sort(), ["NORMA_POSSIVEL_MULTIPLOS_ITENS", "SEM_EVIDENCIA_OFICIAL"]);
  assert.equal(misto.nivelEvidencia, "misto");
  assert.equal(ex("SINT-55", 1).nivelEvidencia, "oficial");      // só evidência oficial
  assert.equal(ex("SINT-55", 9).nivelEvidencia, "planilha");     // só planilha
  assert.equal(ex("SINT-55", 4).nivelEvidencia, "divergente");   // frutose: fontes em conflito
  assert.equal(ex("SINT-55", 3).nivelEvidencia, "divergente");   // item divergente
  assert.equal(ex("SINT-55", 6).nivelEvidencia, "oficial");      // lacuna até a D5; hoje regra oficial
  assert.equal(ex("SINT-55", 7).nivelEvidencia, "pendente");     // regraId ambíguo
});
