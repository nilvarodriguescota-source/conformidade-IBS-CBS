/**
 * Tipos estruturais da Etapa 7 (docs/etapa7/especificacao-tipos.md).
 *
 * As proibições são verificadas pelo compilador: cada `@ts-expect-error` abaixo precisa
 * continuar sendo um erro de tipo; se um tipo afrouxar, o `tsc` do `npm test` falha.
 * Os testes de runtime montam os objetos a partir dos dados atuais (só leitura) e
 * conferem que nada foi decidido: D2 a D7 pendentes, lacunas sem regra, frutose em
 * conflito, validações antigas como legadas.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import type {
  AutorHumano, BaseNormativa, BaseNormativaV2, CondicaoAplicacao, DecisaoPendente, DecisaoTomada,
  Divergencia, FonteDiz, HumanoConfirmou, Lacuna, RegraClassificacao, RegraClassificacaoV2,
  RegraDeInferencia, RespostaValidacao, StatusBeneficio, StatusNormativo, ValidacaoHumana,
  ValidacaoLegada, Veredito, VereditoExplicado,
} from "../src/tipos.js";

const v2 = JSON.parse(readFileSync("data/base-normativa.v2.json", "utf8"));
const empresa = JSON.parse(readFileSync("test/fixtures/empresa-teste.json", "utf8")) as { validacoes?: RespostaValidacao[] };

// ---------- verificações só de compilação ----------
// A função nunca é chamada: o compilador confere o corpo, e nada disso roda.

function verificacoesDeTipo(
  regraAtual: RegraClassificacao,
  baseAtual: BaseNormativa,
  vereditoAtual: Veredito,
  confirmacao: HumanoConfirmou,
  respostaAntiga: RespostaValidacao,
  legada: ValidacaoLegada,
  lacuna: Lacuna,
  pendenteD2: DecisaoPendente<"D2">,
): void {
  // Compatibilidade: os tipos atuais cabem nos novos sem conversão.
  const regraV2: RegraClassificacaoV2 = regraAtual;
  const baseV2: BaseNormativaV2 = baseAtual;
  const vereditoV2: VereditoExplicado = vereditoAtual;
  const confirmado: StatusBeneficio = { status: "BENEFICIO_CONFIRMADO", confirmacao };

  // Proibições estruturais: cada linha abaixo precisa continuar sendo erro de tipo.
  // @ts-expect-error BENEFICIO_CONFIRMADO sem confirmação humana
  const e1: StatusBeneficio = { status: "BENEFICIO_CONFIRMADO" };
  // @ts-expect-error uma RespostaValidacao do empresa.json não é ValidacaoHumana
  const e2: ValidacaoHumana = respostaAntiga;
  // @ts-expect-error uma ValidacaoLegada não é confirmação humana
  const e3: HumanoConfirmou = { camada: "HUMANO_CONFIRMOU", validacao: legada };
  // @ts-expect-error Lacuna não é regra
  const e4: RegraClassificacao = lacuna;
  // @ts-expect-error DecisaoPendente não é decisão tomada
  const e5: DecisaoTomada<"D2", string> = pendenteD2;
  // @ts-expect-error decisão pendente não carrega valor
  const e6: DecisaoPendente<"D2"> = { status: "pendente", decisao: "D2", valor: "qualquer" };
  // @ts-expect-error LACUNA_FONTE_SEM_REGRA não é StatusNormativo
  const e7: StatusNormativo = "LACUNA_FONTE_SEM_REGRA";
  // @ts-expect-error inferência fora da lista fechada
  const e8: RegraDeInferencia = "palpite";
  // @ts-expect-error NORMA_CONFIRMADA não é status de benefício
  const e9: StatusBeneficio["status"] = "NORMA_CONFIRMADA";
  // @ts-expect-error BENEFICIO_CONFIRMADO não é status normativo
  const e10: StatusNormativo = "BENEFICIO_CONFIRMADO";
  // @ts-expect-error autor precisa declarar tipo "humano"
  const e11: AutorHumano = { nome: "Fulano" };
  void [regraV2, baseV2, vereditoV2, confirmado, e1, e2, e3, e4, e5, e6, e7, e8, e9, e10, e11];
}
void verificacoesDeTipo;

test("tipos v2: NORMA_CONFIRMADA e BENEFICIO_CONFIRMADO são estados independentes", () => {
  const normativo: StatusNormativo = "NORMA_CONFIRMADA";
  const beneficio: StatusBeneficio = { status: "BENEFICIO_PENDENTE_VALIDACAO", pergunta: "O produto atende à condição?" };
  assert.equal(normativo, "NORMA_CONFIRMADA");
  assert.equal(beneficio.status, "BENEFICIO_PENDENTE_VALIDACAO");
});

test("tipos v2: limitação conhecida — o tipo aceita autor humano com nome \"Sistema\"", () => {
  // Esta atribuição COMPILA: o TypeScript não exclui um texto específico de `nome`.
  // A recusa fica para o ponto de validação em runtime (ValidadorAutorHumano), ainda
  // não implementado. O teste registra a limitação; não a resolve por convenção.
  const autor: AutorHumano = { tipo: "humano", nome: "Sistema" };
  assert.equal(autor.nome, "Sistema");
});

test("tipos v2: as 7 validações antigas com autor \"Sistema\" continuam ValidacaoLegada, com D6 pendente", () => {
  const doSistema = (empresa.validacoes ?? []).filter((v) => v.autor === "Sistema");
  assert.equal(doSistema.length, 7);
  const legadas: ValidacaoLegada[] = doSistema.map((registro) => ({
    origem: "empresa.json",
    registro,
    classificacao: "autor_sistema_nao_e_confirmacao_humana",
    tratamento: { status: "pendente", decisao: "D6" },
  }));
  for (const l of legadas) {
    assert.equal(l.tratamento.status, "pendente");
    assert.ok(!("valor" in l.tratamento), "D6 sem valor");
    assert.deepEqual(l.registro, empresa.validacoes?.find((v) => v === l.registro), "registro preservado como está");
  }
});

test("tipos v2: condição do 200043 guarda \"e\" (lei) e \"ou\" (planilha), com D2 pendente", () => {
  const fato: FonteDiz = v2.vinculacoes.codigo.find((c: { id: string }) => c.id === "C-200043-anexo").fatos[0];
  const regra = v2.regras.find((r: { cClassTrib: string }) => r.cClassTrib === "200043");
  const condicao: CondicaoAplicacao = {
    id: "COND-200043-ADQUIRENTE",
    cClassTrib: "200043",
    natureza: "adquirente",
    textoOficial: fato,
    textoPlanilha: { fonte: "PLANILHA", aba: "Base de dados", linha: regra.original.linha, coluna: "Observação", valor: regra.original.valores["Observação"] },
    verificavelPeloXml: "nao",
    chaveDeValidacao: "adquirente",
    combinacaoDosTipos: { status: "pendente", decisao: "D2", opcoes: ["a lei usa 'e'", "a planilha usa 'ou'"] },
  };
  assert.equal(condicao.textoOficial.localizacao && "dispositivo" in condicao.textoOficial.localizacao && condicao.textoOficial.localizacao.dispositivo, "art. 142, I");
  assert.match(condicao.textoOficial.trecho ?? "", /direta, autarquias e fundações púbicas/);
  assert.match(condicao.textoPlanilha?.valor ?? "", /direta, autarquias ou fundações públicas/);
  assert.equal(condicao.combinacaoDosTipos?.status, "pendente");
  assert.ok(condicao.combinacaoDosTipos && !("valor" in condicao.combinacaoDosTipos), "nenhuma leitura escolhida");
});

test("tipos v2: as 49 NCMs oficiais sem regra são Lacuna, sem regra criada e com D5 pendente", () => {
  const lacunas: Lacuna[] = v2.vinculacoes.ncmsOficiaisSemRegra.map((s: Lacuna & { fatos: FonteDiz[] }) => ({
    id: s.id,
    status: "LACUNA_FONTE_SEM_REGRA",
    cClassTrib: s.cClassTrib,
    ncm: s.ncm,
    fatos: s.fatos,
    regrasDeOutrosCodigosComEstaNcm: s.regrasDeOutrosCodigosComEstaNcm,
    inclusaoComoRegra: { status: "pendente", decisao: "D5" },
  }));
  assert.equal(lacunas.length, 49);
  assert.equal(lacunas.filter((l) => l.cClassTrib === "200033").length, 1);
  assert.equal(lacunas.filter((l) => l.cClassTrib === "200043").length, 48);
  assert.equal(v2.regras.length, 1369, "nenhuma regra criada");
  for (const l of lacunas) {
    assert.equal(l.inclusaoComoRegra.status, "pendente");
    assert.ok(!v2.regras.some((r: { ncm: string; cClassTrib: string }) => r.ncm === l.ncm && r.cClassTrib === l.cClassTrib));
  }
});

test("tipos v2: frutose 1702.50.00 fica em conflito entre fontes, sem resolução", () => {
  const reg = v2.vinculacoes.regras.find((x: { regra: { ncm: string } }) => x.regra.ncm === "17025000");
  assert.equal(reg.comparacao.resultado, "ncm_so_na_F1");
  const status: StatusNormativo = "CONFLITO_ENTRE_FONTES";
  const div: Divergencia = {
    id: "DIV-200033-17025000",
    tipo: "ncm_so_na_F1",
    cClassTrib: "200033",
    regras: [{ indice: reg.regra.indice, linha: reg.regra.linha, regraId: reg.regra.regraId, ncm: reg.regra.ncm }],
    valores: [
      { fonte: "F1", valor: "presente no Anexo VI", fato: reg.fatos[0] },
      { fonte: "F2", valor: "ausente da lista do 200033" },
    ],
    impacto: "enquadramento",
    status: "aberta",
    resolucao: null,
  };
  assert.equal(status, "CONFLITO_ENTRE_FONTES");
  assert.equal(div.resolucao, null, "nem F1 nem F2 escolhida");
  assert.deepEqual(div.valores.map((x) => x.fonte), ["F1", "F2"]);
});

test("tipos v2: os 771 fatos da Etapa 5 cabem em FonteDiz", () => {
  const permitidos = new Set(["camada", "fonte", "arquivo", "sha256", "natureza", "versao", "dataConsulta", "localizacao", "trecho", "valor", "extracao", "linhaTabela"]);
  const vinc = v2.vinculacoes;
  const fatos: FonteDiz[] = [...vinc.codigo, ...vinc.regras, ...vinc.ncmsOficiaisSemRegra].flatMap((x: { fatos: FonteDiz[] }) => x.fatos);
  assert.equal(fatos.length, 771);
  for (const f of fatos) {
    assert.ok(Object.keys(f).every((k) => permitidos.has(k)), `campo fora de FonteDiz em ${f.arquivo}`);
    assert.ok(["F1", "F2", "PLANILHA"].includes(f.fonte));
  }
});
