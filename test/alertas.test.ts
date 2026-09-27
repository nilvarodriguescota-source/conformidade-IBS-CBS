/**
 * Etapa 9B.1: alertas informativos. Os alertas saem só dos vereditos explicados
 * (o conteúdo de explicacoes.json); aqui a explicação passa por JSON antes, como no
 * arquivo. Nenhum alerta altera o veredito, decide, confirma ou resolve.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { classificarDocumentos } from "../src/motor.js";
import { carregarContexto, explicarVereditos } from "../src/explicador.js";
import { CODIGOS_ALERTA, gerarAlertas, type Alerta } from "../src/alertas.js";
import type { BaseNormativa, Documento, ItemDocumento, RespostaValidacao, VereditoExplicado } from "../src/tipos.js";

const ctx = carregarContexto({ base: "data/base-normativa.json", v2: "data/base-normativa.v2.json", matriz: "docs/etapa6/matriz-decisao.json", empresa: "test/fixtures/empresa-teste.json" });
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
    item(2, "21069090", "200", "200033", "A2"),   // 9 candidatas
    item(3, "28272010", "200", "200033", "A3"),   // item divergente
    item(4, "17025000", "200", "200033", "A4"),   // frutose
    item(5, "85176259", "200", "200043", "A5"),   // 200043
    item(6, "87091100", "200", "200043", "A6"),   // lacuna
    item(7, "23080000", "200", "200038", "A7"),   // regraId duplicado
    item(8, "19022000", "200", "200034", "2727"), // validação "Nilva"
    item(9, "19022000", "200", "200034", "2726"), // validação "Sistema"
    item(10, "22030000", "000", "000001", "A10"), // sem benefício
    item(11, "99999999", "000", "000001", "A11"), // sem regra, CST 000
    item(12, "99999998", "200", "200034", "A12"), // sem regra, CST 200
    item(13, "19022000", "200", "200034", "2716"), // resposta histórica NÃO (2026-09-21)
    item(14, "19022000", "200", "200034", "2729"), // resposta histórica NÃO (2026-09-23)
  ]),
  doc("SINT-65", "65", [item(1, "85176259", "200", "200043", "B1")]), // 200043 em NFC-e
];
const vereditos = classificarDocumentos(docs, { base, empresa, validacoes: empresa.validacoes ?? [], agora: "2026-09-24T00:00:00-03:00" });
// Como no explicacoes.json: a explicação é serializada e relida antes de gerar os alertas
const explicados = JSON.parse(JSON.stringify(explicarVereditos(vereditos, ctx, docs))) as VereditoExplicado[];
const antes = JSON.stringify(explicados);
const { porItem, lote } = gerarAlertas(explicados);
const doItem = (documento: string, nItem: number): Alerta[] => porItem.filter((a) => a.item.documento === documento && a.item.nItem === nItem);
const um = (documento: string, nItem: number, codigo: string): Alerta => {
  const xs = doItem(documento, nItem).filter((a) => a.codigo === codigo);
  assert.equal(xs.length, 1, `${documento}/${nItem} ${codigo}`);
  return xs[0]!;
};

test("alertas: os 18 códigos são exatamente os da especificação", () => {
  const spec = readFileSync("docs/etapa9b/especificacao-alertas.md", "utf8");
  const bloco = spec.slice(spec.indexOf("export type CodigoAlerta ="), spec.indexOf("export interface Alerta"));
  const daSpec = [...bloco.matchAll(/"([A-Z_]+)"/g)].map((m) => m[1]).sort();
  assert.equal(daSpec.length, 18);
  assert.deepEqual([...CODIGOS_ALERTA].sort(), daSpec);
  for (const a of porItem) assert.ok((CODIGOS_ALERTA as readonly string[]).includes(a.codigo));
  for (const a of [...porItem, ...lote]) assert.ok(["INFORMACAO", "ATENCAO", "PENDENCIA", "CONFLITO", "LACUNA"].includes(a.categoria));
});

test("alertas: não alteram os vereditos; todo alerta é somente exibição e copia o estado", () => {
  assert.equal(JSON.stringify(explicados), antes);
  const congelado = Object.freeze(JSON.parse(antes)) as VereditoExplicado[];
  gerarAlertas(congelado);
  for (const a of porItem) {
    assert.equal(a.efeito, "somente_exibicao");
    const v = explicados.find((x) => x.documento === a.item.documento && x.nItem === a.item.nItem)!;
    assert.equal(a.estadoDoVeredito, v.estado);
    assert.equal(a.nivelEvidencia, v.explicacaoInformativa!.nivelEvidencia);
  }
  for (const l of lote) assert.equal(l.efeito, "somente_exibicao");
  for (const v of explicados) assert.deepEqual(v.explicacaoInformativa!.humanoConfirmou, []);
});

test("alertas: 2106.90.90 com 9 candidatas, sem apontar uma como correta", () => {
  const a = um("SINT-55", 2, "MULTIPLAS_REGRAS_CANDIDATAS");
  assert.equal(a.categoria, "ATENCAO");
  assert.match(a.mensagem, /Há 9 regras candidatas para este item \(8 do 200033 e 1 do 200003\)/);
  assert.equal(a.regras.length, 9);
  assert.doesNotMatch(a.mensagem, /corret|a certa|escolhid/i);
  assert.match(um("SINT-55", 2, "MULTIPLOS_ITENS_DO_ANEXO").mensagem, /8 itens do Anexo VI \(39, 40, 41, 42, 43, 44, 45, 46\)/);
  assert.equal(um("SINT-55", 2, "EVIDENCIA_MISTA").categoria, "INFORMACAO");
  assert.equal(doItem("SINT-55", 2).filter((x) => x.codigo === "CONDICAO_NAO_COMPROVADA").length, 1, "condição repetida em 8 regras vira 1 alerta");
});

test("alertas: 87091100 é lacuna; o estado INCORRETO_RISCO não muda", () => {
  const a = um("SINT-55", 6, "LACUNA_FONTE_SEM_REGRA");
  assert.equal(a.categoria, "LACUNA");
  assert.equal(a.estadoDoVeredito, "INCORRETO_RISCO");
  // 8709 aparece em dois itens do Anexo XI (2.1 e 2.3); o alerta cita os dois
  assert.match(a.mensagem, /consta da fonte oficial para o 200043 \(SVRS, lista do 200043; LC 214\/2025, Anexo XI, item 2\.1; LC 214\/2025, Anexo XI, item 2\.3\)/);
  assert.match(a.mensagem, /O estado INCORRETO_RISCO foi produzido pelo motor e não foi alterado/);
  assert.ok(doItem("SINT-55", 6).some((x) => x.codigo === "DECISAO_PENDENTE" && x.decisoes?.[0] === "D5"));
  assert.ok(!doItem("SINT-55", 6).some((x) => x.codigo === "SEM_REGRA_NA_BASE"));
});

test("alertas: frutose em conflito entre fontes, sem fonte escolhida", () => {
  const a = um("SINT-55", 4, "CONFLITO_ENTRE_FONTES");
  assert.equal(a.categoria, "CONFLITO");
  assert.match(a.mensagem, /A LC 214 e o SVRS divergem sobre a NCM 17025000 no 200033; nenhuma fonte foi escolhida\./);
  assert.doesNotMatch(a.mensagem, /prevalece|vale a|correta/i);
});

test("alertas: 200043 com \"e\" e \"ou\", D2 e D4 pendentes, fundamento divergente, IndNfce só informação", () => {
  const c = um("SINT-55", 5, "CONDICAO_NAO_COMPROVADA");
  assert.match(c.mensagem, /autarquias e fundações púbicas/);
  assert.match(c.mensagem, /autarquias ou fundações públicas/);
  assert.match(c.mensagem, /O XML não comprova essa condição/);
  assert.match(c.mensagem, /A combinação dos tipos de comprador ainda não foi definida \(referência técnica: D2\)\./);
  const decisoes = doItem("SINT-55", 5).filter((x) => x.codigo === "DECISAO_PENDENTE").map((x) => x.decisoes?.[0]);
  assert.deepEqual(decisoes, ["D2", "D4"]);
  const f = um("SINT-55", 5, "FUNDAMENTO_DIVERGENTE");
  assert.equal(f.categoria, "CONFLITO");
  assert.match(f.mensagem, /^A base cita Art\. 140\. /);
  assert.match(f.mensagem, /Diferença de texto do fundamento; nenhuma citação foi escolhida\./);
  const nfce = um("SINT-65", 1, "INFORMACAO_OPERACIONAL_SVRS");
  assert.equal(nfce.categoria, "INFORMACAO");
  assert.match(nfce.mensagem, /IndNfce = false/);
  assert.match(nfce.mensagem, /O tratamento desse caso ainda não foi definido \(referência técnica: D4\)\./);
  assert.ok(!doItem("SINT-55", 5).some((x) => x.codigo === "INFORMACAO_OPERACIONAL_SVRS"), "NF-e não recebe o alerta de NFC-e");
  assert.equal(nfce.estadoDoVeredito, um("SINT-55", 5, "CONDICAO_NAO_COMPROVADA").estadoDoVeredito);
});

test("alertas: cProd 2726 (autor \"Sistema\") é registro histórico, com o texto aprovado na 9B.0", () => {
  const a = um("SINT-55", 9, "VALIDACAO_LEGADA");
  assert.equal(a.categoria, "ATENCAO");
  assert.match(a.mensagem, /não equivale a uma confirmação humana atual/);
  assert.match(a.mensagem, /a tela de validação envia o autor fixo "Sistema" e a rota também grava "Sistema" quando não recebe autor; a autoria não foi coletada e não foi reconstruída; o registro não indica decisão automática do sistema nem validação humana comprovada/);
  assert.match(a.mensagem, /que foi utilizada no cálculo deste resultado\./);
  assert.doesNotMatch(a.mensagem, /confirmad|validado pelo sistema|clique|clicou/i);
  assert.ok(a.limitacao?.includes("autor fixo \"Sistema\""));
});

test("alertas: cProd 2727 (autor humano, sem hash das fontes) é registro histórico", () => {
  const a = um("SINT-55", 8, "VALIDACAO_LEGADA");
  assert.match(a.mensagem, /há autor e justificativa, mas o registro não guarda o hash das fontes na data da resposta/);
  assert.match(a.mensagem, /não equivale a uma confirmação humana atual/);
  assert.doesNotMatch(a.mensagem, /confirmad/i);
});

test("alertas: regraId duplicado fica ambíguo, com D7 pendente", () => {
  const a = um("SINT-55", 7, "REGRAID_AMBIGUO");
  assert.match(a.mensagem, /corresponde a 2 regras \(linhas 776 e 777\); nenhuma foi escolhida\./);
  assert.deepEqual(a.regras.map((r) => r.linha), [776, 777]);
  assert.ok(doItem("SINT-55", 7).some((x) => x.codigo === "DECISAO_PENDENTE" && x.decisoes?.[0] === "D7"));
});

test("alertas: item com fundamento a revisar e item com item divergente", () => {
  assert.match(um("SINT-55", 1, "FUNDAMENTO_A_REVISAR").mensagem, /^A base cita Arts\. 133 e 134\. /);
  const d = um("SINT-55", 3, "CONFLITO_PLANILHA_FONTE");
  assert.match(d.mensagem, /associam a NCM ao item 26; a base \(planilha\) traz o item 66\./);
});

test("alertas: sem regra na base — CST 000 só no lote; CST diferente de 000 também no item", () => {
  assert.equal(doItem("SINT-55", 11).length, 0, "CST 000 sem regra não gera alerta por item");
  assert.equal(um("SINT-55", 12, "SEM_REGRA_NA_BASE").categoria, "INFORMACAO");
  const l = lote.find((x) => x.codigo === "SEM_REGRA_NA_BASE")!;
  assert.ok(l.itensAfetados.some((x) => x.nItem === 11) && l.itensAfetados.some((x) => x.nItem === 12));
  assert.ok(!l.itensAfetados.some((x) => x.nItem === 6), "a lacuna não entra como 'sem regra'");
});

test("alertas: validação humana não disponível e D3 ficam só no lote, com todos os itens", () => {
  assert.ok(!porItem.some((a) => a.codigo === "VALIDACAO_HUMANA_NAO_DISPONIVEL"));
  assert.ok(!porItem.some((a) => a.codigo === "DECISAO_PENDENTE" && a.decisoes?.includes("D3")));
  const vh = lote.find((x) => x.codigo === "VALIDACAO_HUMANA_NAO_DISPONIVEL")!;
  const d3 = lote.find((x) => x.codigo === "DECISAO_PENDENTE" && x.decisoes?.includes("D3"))!;
  const esperadoVh = explicados.filter((v) => v.explicacaoInformativa!.ausencias.includes("VALIDACAO_HUMANA_NAO_DISPONIVEL")).length;
  assert.equal(vh.itens, esperadoVh);
  assert.equal(vh.itensAfetados.length, esperadoVh, "nada descartado");
  assert.ok(vh.exemplos.length <= 5 && d3.exemplos.length <= 5);
  assert.equal(d3.categoria, "PENDENCIA");
});

test("alertas: sem duplicatas no item e toda origem aponta para a explicação", () => {
  assert.equal(new Set(porItem.map((a) => a.id)).size, porItem.length);
  const resolve = (obj: unknown, caminho: string): unknown =>
    caminho.split(".").reduce<unknown>((o, p) => {
      const m = /^(\w+)(?:\[(\d+)\])?$/.exec(p);
      if (!m || o == null) return undefined;
      const v = (o as Record<string, unknown>)[m[1]!];
      return m[2] === undefined ? v : (v as unknown[])?.[Number(m[2])];
    }, obj);
  for (const a of porItem) {
    const e = explicados.find((x) => x.documento === a.item.documento && x.nItem === a.item.nItem)!.explicacaoInformativa;
    assert.ok(a.origem.length > 0, a.id);
    for (const o of a.origem) assert.notEqual(resolve(e, o), undefined, `${a.id}: ${o}`);
  }
});

test("alertas: textos sem o vocabulário proibido", () => {
  // A regra vale para o texto redigido pelo sistema. Trechos literais das fontes, entre “ ”,
  // são citação (ex.: "pessoas com erros inatos do metabolismo", art. 133, § 1º) e ficam de fora.
  const citacoes = /“[^”]*”/g;
  const estados = /\b(INCORRETO_ECONOMIA|INCORRETO_RISCO|REQUER_VALIDACAO|NAO_OBRIGATORIO|INDETERMINADO|CORRETO)\b/g;
  const proibido = /(^|[^\p{L}])(erros?|graves?|irregular(es|idade)?|ilega(l|is|lidade)|fraudes?|infra[çc](ão|ões)|indevid[oa]s?|incorret[oa]s?|sonega[çc](ão|ões))([^\p{L}]|$)/iu;
  for (const a of [...porItem, ...lote]) {
    const textos = [a.titulo, a.mensagem, "limitacao" in a ? a.limitacao ?? "" : ""].join(" ").replace(citacoes, "").replace(estados, "");
    assert.doesNotMatch(textos, proibido, `${a.codigo}: ${a.mensagem}`);
  }
});

// ---------- 9B.1.1: correções da auditoria ----------

test("9B.1.1 achado 1: os seis casos ausentes do lote real continuam cobertos pelos sintéticos", () => {
  assert.ok(doItem("SINT-55", 6).some((a) => a.codigo === "LACUNA_FONTE_SEM_REGRA"), "87091100");
  assert.ok(doItem("SINT-55", 4).some((a) => a.codigo === "CONFLITO_ENTRE_FONTES"), "frutose");
  assert.ok(doItem("SINT-55", 5).some((a) => a.codigo === "CONDICAO_NAO_COMPROVADA"), "200043");
  assert.ok(doItem("SINT-55", 7).some((a) => a.codigo === "REGRAID_AMBIGUO"), "regraId duplicado");
  assert.ok(doItem("SINT-55", 5).some((a) => a.codigo === "FUNDAMENTO_DIVERGENTE"), "fundamento divergente");
  assert.ok(doItem("SINT-55", 12).some((a) => a.codigo === "SEM_REGRA_NA_BASE"), "sem regra com CST 200");
});

test("9B.1.1 achado 2: o lote D3 distingue a pendência, a evidência registrada e os itens mistos", () => {
  const d3 = lote.find((x) => x.codigo === "DECISAO_PENDENTE" && x.decisoes?.includes("D3"))!;
  assert.doesNotMatch(d3.mensagem, /cujas regras só têm a planilha/);
  assert.match(d3.mensagem, /Ainda não foi definida a política para esses casos/);
  assert.match(d3.mensagem, /a situação permanece pendente/);
  assert.match(d3.mensagem, /Referência técnica: D3 — política para regras cujo vínculo NCM × item com a fonte oficial não está CONFIRMADO\./);
  assert.match(d3.mensagem, /ao menos uma regra candidata cujo vínculo NCM × item com a fonte oficial não está CONFIRMADO/);
  // Contagens derivadas da explicação dos itens do lote
  const es = d3.itensAfetados.map((x) => explicados.find((v) => v.documento === x.documento && v.nItem === x.nItem)!.explicacaoInformativa!);
  const mistos = es.filter((e) => e.nivelEvidencia === "misto").length;
  const planilha = es.filter((e) => e.nivelEvidencia === "planilha").length;
  assert.ok(mistos >= 1, "o conjunto sintético tem item misto (2106.90.90)");
  assert.ok(d3.mensagem.includes(`${mistos} misto (regras com evidência oficial e regras só da planilha)`), d3.mensagem);
  // Só aparecem na mensagem os níveis com itens (pela definição nova, pode não haver item "só planilha")
  assert.equal(d3.mensagem.includes("só planilha"), planilha > 0, d3.mensagem);
  if (planilha > 0) assert.ok(d3.mensagem.includes(`${planilha} só planilha`), d3.mensagem);
});

test("9B.1.1 achado 3: fundamento separa o que a fonte apresenta do que o sistema relacionou", () => {
  const revisar = um("SINT-55", 1, "FUNDAMENTO_A_REVISAR").mensagem;
  assert.match(revisar, /o SVRS apresenta o link https:\/\/www\.planalto\.gov\.br\/ccivil_03\/leis\/lcp\/lcp214\.htm#art133/);
  assert.match(revisar, /O sistema relacionou a âncora "art133" do link ao dispositivo art\. 133, § 1º da LC 214\/2025; o link, sozinho, não identifica parágrafo nem inciso\./);
  assert.doesNotMatch(revisar, /o SVRS indica/);
  const divergente = um("SINT-55", 5, "FUNDAMENTO_DIVERGENTE").mensagem;
  assert.match(divergente, /o SVRS apresenta o link https:\/\/www\.planalto\.gov\.br\/ccivil_03\/leis\/lcp\/lcp214\.htm#art142/);
  assert.match(divergente, /as evidências da LC 214\/2025 citam art\. 142, I; art\. 140, caput/);
  assert.match(divergente, /O sistema relacionou a âncora "art142" do link ao dispositivo art\. 142, I da LC 214\/2025/);
  assert.doesNotMatch(divergente, /SVRS indica|LC 214 e SVRS indicam/);
  // Nenhuma frase atribui ao SVRS um parágrafo ou inciso
  for (const a of porItem.filter((x) => x.codigo.startsWith("FUNDAMENTO_"))) assert.doesNotMatch(a.mensagem, /SVRS (indica|diz|declara)[^.]*(§|, I\b)/);
});

test("9B.1.1 achado 4: alertas de lote se identificam pelo título e pela mensagem", () => {
  assert.equal(lote.length, 3);
  for (const l of lote) {
    assert.match(l.titulo, /^Lote: /);
    assert.ok(l.mensagem.startsWith(`Alerta de lote (${l.itens} itens): `), l.mensagem);
  }
  for (const a of porItem) { assert.doesNotMatch(a.titulo, /^Lote: /); assert.doesNotMatch(a.mensagem, /^Alerta de lote/); }
});

test("9B.1.1 achado 4: o D3 de lote é textualmente distinto do D6 de item", () => {
  const d3 = lote.find((x) => x.codigo === "DECISAO_PENDENTE" && x.decisoes?.includes("D3"))!;
  const d6 = porItem.find((x) => x.codigo === "DECISAO_PENDENTE" && x.decisoes?.includes("D6"))!;
  assert.notEqual(d3.titulo, d6.titulo);
  assert.equal(d3.titulo, "Lote: política pendente para regras com vínculo NCM × item não CONFIRMADO");
  assert.match(d6.mensagem, /^Existe uma resposta histórica para este item, mas ela não possui confirmação humana com autoria registrada\./);
  assert.match(d6.mensagem, /Referência técnica: D6 — tratamento das validações legadas\.$/);
  assert.doesNotMatch(d6.mensagem, /D3|lote/i);
});

test("9B.1.1 achado 5: VALIDACAO_LEGADA não está na camada FONTE_DIZ", () => {
  const legadas = porItem.filter((a) => a.codigo === "VALIDACAO_LEGADA");
  assert.ok(legadas.length >= 2);
  for (const a of legadas) {
    assert.equal(a.camada, "SISTEMA_INFERE");
    assert.match(a.mensagem, /não equivale a uma confirmação humana atual/);
  }
});

// ---------- 9B.2 (textos): o que aconteceu, por que importa, o que fazer ----------

/** Categorias da implementação aprovada (9B.1/9B.1.1); a mudança de texto não altera nenhuma. */
const CATEGORIA_APROVADA: Record<string, string> = {
  MULTIPLAS_REGRAS_CANDIDATAS: "ATENCAO", MULTIPLOS_ITENS_DO_ANEXO: "ATENCAO", REGRA_NAO_LOCALIZADA: "ATENCAO", REGRAID_AMBIGUO: "ATENCAO",
  SEM_REGRA_NA_BASE: "INFORMACAO", LACUNA_FONTE_SEM_REGRA: "LACUNA", CONFLITO_ENTRE_FONTES: "CONFLITO", CONFLITO_PLANILHA_FONTE: "CONFLITO",
  FUNDAMENTO_DIVERGENTE: "CONFLITO", FUNDAMENTO_A_REVISAR: "ATENCAO", VIGENCIA_A_REVISAR: "ATENCAO", EVIDENCIA_MISTA: "INFORMACAO",
  VALIDACAO_LEGADA: "ATENCAO", VALIDACAO_HUMANA_NAO_DISPONIVEL: "PENDENCIA", DECISAO_PENDENTE: "PENDENCIA", CONDICAO_NAO_COMPROVADA: "PENDENCIA",
  INFORMACAO_OPERACIONAL_SVRS: "INFORMACAO", ALIQUOTA_PROJETADA: "INFORMACAO",
};
const dataRegistro = (cProd: string) => {
  const r = empresa.validacoes!.find((x) => x.cProd === cProd)!;
  const [a, m, d] = r.data.split("-");
  return { resposta: r.resposta === "NAO" ? "NÃO" : "SIM", data: `${d}/${m}/${a}` };
};

test("textos: nenhum alerta mudou de categoria", () => {
  for (const a of [...porItem, ...lote]) assert.equal(a.categoria, CATEGORIA_APROVADA[a.codigo], a.codigo);
  assert.equal(um("SINT-55", 9, "VALIDACAO_LEGADA").categoria, "ATENCAO", "validação histórica continua ATENÇÃO");
});

test("textos: resposta histórica — existe, SIM/NÃO e data do registro, usada no cálculo, sem confirmação humana", () => {
  for (const [nItem, cProd] of [[9, "2726"], [13, "2716"], [14, "2729"]] as const) {
    const a = um("SINT-55", nItem, "VALIDACAO_LEGADA");
    const reg = dataRegistro(cProd);
    assert.equal(a.titulo, "Resposta histórica utilizada");
    assert.ok(a.mensagem.startsWith(`Este item possui uma resposta histórica ${reg.resposta}, registrada em ${reg.data}, que foi utilizada no cálculo deste resultado.`), a.mensagem);
    assert.match(a.mensagem, /A resposta é mantida como registro histórico e não equivale a uma confirmação humana atual: não há confirmação humana com autoria registrada/);
    assert.match(a.mensagem, /Para uma confirmação formal com autoria, será necessário utilizar o fluxo de validação humana quando essa funcionalidade estiver disponível\./);
  }
  assert.match(um("SINT-55", 14, "VALIDACAO_LEGADA").mensagem, /resposta histórica NÃO, registrada em 23\/09\/2026/, "data vem do registro (não é fixa)");
});

test("textos: resposta histórica não pede ação inexistente e cita D6 só como referência técnica", () => {
  for (const a of porItem.filter((x) => x.codigo === "VALIDACAO_LEGADA")) {
    assert.doesNotMatch(a.mensagem, /Pendências|Confirme|confirme|escolha SIM|responda|repita|repetir|agora/i);
    const primeira = a.mensagem.split(". ")[0]!;
    assert.doesNotMatch(primeira, /\bD[2-7]\b/, "a primeira frase não usa código interno");
    assert.deepEqual([...a.mensagem.matchAll(/\bD[2-7]\b/g)].map((m) => m[0]), ["D6"]);
    assert.match(a.mensagem, /Referência técnica: D6 — tratamento das validações legadas\.$/);
  }
});

test("textos: pendências explicam a situação primeiro, dizem por que importa e só citam ação que existe", () => {
  const pendencias = [...porItem, ...lote].filter((a) => a.categoria === "PENDENCIA");
  assert.ok(pendencias.length > 0);
  for (const a of pendencias) {
    const primeira = a.mensagem.replace(/^Alerta de lote \(\d+ itens\): /, "").split(/(?<=\.) /)[0]!;
    assert.doesNotMatch(primeira, /\bD[2-7]\b|VALIDACAO_LEGADA|DECISAO_PENDENTE/, `${a.codigo}: ${primeira}`);
    assert.match(a.mensagem, /Ação disponível:|a interface não permite/, `${a.codigo} diz o que pode ser feito hoje`);
    assert.match(a.mensagem, /importa|afeta|determina|impede|falta definir|Falta definir/i, `${a.codigo} diz por que importa`);
    assert.doesNotMatch(a.mensagem, /será confirmad|fica confirmad|passa a ser confirmação humana|produz(irá)? confirmação humana/i);
  }
  // Condição: ação da tela só para item que está na fila de Pendências (REQUER_VALIDACAO)
  for (const a of porItem.filter((x) => x.codigo === "CONDICAO_NAO_COMPROVADA")) {
    if (a.estadoDoVeredito === "REQUER_VALIDACAO") {
      assert.match(a.mensagem, /Ação disponível: este item aparece na tela de Pendências/);
      assert.match(a.mensagem, /gravada sem autoria \(autor fixo "Sistema"\) e não equivale a confirmação humana/);
    } else assert.match(a.mensagem, /a interface não permite concluir essa confirmação para este item/);
  }
  // Decisões por item: nenhuma ação na interface atual
  for (const a of porItem.filter((x) => x.codigo === "DECISAO_PENDENTE")) {
    assert.match(a.mensagem, /No momento, a interface não permite registrar essa definição; a situação permanece pendente/);
    assert.doesNotMatch(a.mensagem, /Ação disponível/);
  }
});

test("textos: lote de validação humana diz quantos itens estão na tela de Pendências e o limite da ação", () => {
  const l = lote.find((x) => x.codigo === "VALIDACAO_HUMANA_NAO_DISPONIVEL")!;
  const naFila = l.itensAfetados.filter((x) => { const v = explicados.find((y) => y.documento === x.documento && y.nItem === x.nItem)!; return v.estado === "REQUER_VALIDACAO" && !!v.ncm; }).length;
  assert.ok(naFila > 0 && naFila < l.itens);
  assert.ok(l.mensagem.includes(`Ação disponível: ${naFila} destes itens aparecem na tela de Pendências`), l.mensagem);
  assert.ok(l.mensagem.includes(`Para os demais ${l.itens - naFila} itens, a interface não permite concluir essa confirmação.`), l.mensagem);
  assert.match(l.mensagem, /não equivale a confirmação humana/);
});
