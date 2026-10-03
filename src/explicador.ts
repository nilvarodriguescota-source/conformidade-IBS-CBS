/**
 * Etapa 9, Fase A: explicação somente informativa.
 *
 * Roda DEPOIS do motor e só lê: recebe o Veredito pronto e devolve o mesmo Veredito com
 * `explicacaoInformativa`. Não recalcula, não reclassifica, não escolhe regra, não cria
 * regra, não confirma benefício, não cria HUMANO_CONFIRMOU e não resolve D2 a D7. A matriz
 * da Etapa 6 é só citada (versão, hash e situações), nunca aplicada.
 *
 * Fontes lidas (somente leitura): base atual, base v2 (original, fontes, vinculacoes),
 * matriz da Etapa 6, validações do empresa.json e a extração F2 registrada na v2.
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { BARES_RESTAURANTES } from "./motor.js";
import { chaveBloqueio, montarBloqueios } from "./bloqueios.js";
import type {
  BaseNormativa, CondicaoAplicacao, DecisaoPendente, Divergencia, Documento, ExplicacaoInformativa,
  ExplicacaoRegra, FonteDiz, IdArquivoFonte, IdDecisao, IdFonte, Lacuna, RefRegra, RegraClassificacao,
  RespostaValidacao, Sinalizador, SistemaInfere, SituacaoMatriz, StatusBeneficio, StatusNormativo,
  ValidacaoLegada, Veredito, VereditoExplicado, AusenciaExplicita, RegraDeInferencia, ReducaoExplicada, ReducaoDoItem,
  AuditoriaOficialDaRegra, LacunaDeCobertura, FonteAuditoria, BloqueioOficial,
} from "./tipos.js";

// ---------- formato dos dados lidos da v2 (somente o que o explicador usa) ----------

interface ArquivoRegistrado { id: IdArquivoFonte; caminho: string | null; sha256: string }
interface FonteRegistrada { id: IdFonte; versao: string; dataConsulta: string; arquivos: ArquivoRegistrado[] }
interface VinculoDeRegra {
  id: string;
  cClassTrib: string;
  regra: { indice: number; linha: number; regraId: string; ncm: string; item: string };
  fatos: FonteDiz[];
  dadoExtraido: {
    ncmNaListaOficial: { F1: boolean; F2: boolean };
    itensF1QueCobremONcm: string[];
    coberturaF1: { item: string; codigo: string; exata: boolean }[];
    descricoesF2: string[];
  };
  comparacao: { resultado: string };
  interpretacao: string | null;
}
interface VinculoDeCodigo {
  id: string;
  cClassTrib: string;
  campoRegra: string;
  /** Regras alcançadas pelo vínculo (por índice na base). */
  alcance?: RefRegra[];
  valorRegra?: unknown;
  fatos: FonteDiz[];
  comparacao: { resultado: string; detalhe?: string };
  interpretacao: string | null;
  status: string;
}
interface LacunaRegistrada {
  id: string;
  cClassTrib: string;
  ncm: string;
  fatos: FonteDiz[];
  regrasDeOutrosCodigosComEstaNcm: (RefRegra & { cClassTrib: string })[];
}
type RegraV2 = RegraClassificacao & { original?: { fonte: "PLANILHA"; linha: number; valores: Record<string, string | null> } | { fonte: "OFICIAL_D5"; linha: null; valores: null } };
export interface BaseV2Lida {
  regras: RegraV2[];
  fontes: { registros: Record<string, FonteRegistrada> };
  vinculacoes: { escopo: string[]; codigo: VinculoDeCodigo[]; regras: VinculoDeRegra[]; ncmsOficiaisSemRegra: LacunaRegistrada[] };
  /** Etapa 5.3 (Fase 3): vínculos de código dos demais códigos, no mesmo formato de vinculacoes.codigo. */
  evidenciasOficiais?: { codigo: VinculoDeCodigo[] };
}
interface EntradaAnexoF2 { CodIntProdServ: number; CodNcmNbs: string; DescCondicao: string | null }
interface ClassificacaoF2 { CodClassTrib: string; IndNfce: boolean; Anexos: EntradaAnexoF2[] }

export interface ContextoExplicacao {
  base: BaseNormativa;
  v2: BaseV2Lida;
  validacoes: RespostaValidacao[];
  matriz: { versao: string; hash: string };
  /** Extração F2 registrada na v2; null se o hash não conferir com o registro. */
  f2: ClassificacaoF2[] | null;
  /** Limitações do contexto (ex.: extração F2 indisponível), repetidas nas explicações afetadas. */
  avisos: string[];
  /** Auditoria oficial (data/auditoria-oficial.json); null se ausente ou se não conferir com a base, a v2 e os snapshots. */
  auditoria: AuditoriaLida | null;
}

/** Registro por regra do arquivo de auditoria, como gravado por scripts/auditoria_oficial.mjs. */
type RegistroAuditoria = Omit<AuditoriaOficialDaRegra, "itemDaBase" | "codigo" | "fontes"> & { indice: number; regraId: string; ncm: string; item: string };
interface AuditoriaLida {
  porIndice: Map<number, RegistroAuditoria>;
  lacunasPorNcm: Map<string, LacunaDeCobertura[]>;
  codigos: Record<string, AuditoriaOficialDaRegra["codigo"]>;
  fontes: { F1: FonteAuditoria; F2: FonteAuditoria };
  /** Fase 2: regras bloqueadas por incompatibilidade oficial (mesmo critério do motor, src/bloqueios.ts). */
  bloqueios: Map<string, BloqueioOficial>;
}

export interface CaminhosContexto {
  base: string;
  v2: string;
  matriz: string;
  empresa: string;
  /** Auditoria oficial; padrão: auditoria-oficial.json na mesma pasta da v2. */
  auditoria?: string;
}

const sha = (b: Buffer | string): string => createHash("sha256").update(b).digest("hex");

/** Lê os arquivos do contexto. Só leitura; nenhum arquivo é gravado. */
export function carregarContexto(c: CaminhosContexto): ContextoExplicacao {
  const brutoBase = readFileSync(c.base), brutoV2 = readFileSync(c.v2);
  const base = JSON.parse(brutoBase.toString("utf8")) as BaseNormativa;
  const v2 = JSON.parse(brutoV2.toString("utf8")) as BaseV2Lida;
  const brutoMatriz = readFileSync(c.matriz);
  const matriz = JSON.parse(brutoMatriz.toString("utf8")) as { versao: string };
  const empresa = JSON.parse(readFileSync(c.empresa, "utf8")) as { validacoes?: RespostaValidacao[] };
  const avisos: string[] = [];
  let f2: ClassificacaoF2[] | null = null;
  const regF2 = v2.fontes?.registros?.F2?.arquivos.find((a) => a.id === "F2.extracao");
  if (regF2?.caminho) {
    const bruto = readFileSync(regF2.caminho);
    if (sha(bruto) === regF2.sha256) f2 = (JSON.parse(bruto.toString("utf8")) as { cst200: { ClassificacoesTributarias: ClassificacaoF2[] } }).cst200.ClassificacoesTributarias;
    else avisos.push("A extração F2 não confere com o hash registrado na v2; informações do SVRS sobre condições não foram exibidas.");
  } else avisos.push("A extração F2 não está registrada na v2; informações do SVRS sobre condições não foram exibidas.");
  const auditoria = lerAuditoria(c.auditoria ?? join(dirname(c.v2), "auditoria-oficial.json"), sha(brutoBase), sha(brutoV2), v2, avisos);
  return { base, v2, validacoes: empresa.validacoes ?? [], matriz: { versao: matriz.versao, hash: sha(brutoMatriz) }, f2, avisos, auditoria };
}

/**
 * Lê a auditoria oficial só se ela foi gerada exatamente sobre a base, a v2 e os snapshots atuais
 * (SHA-256 das entradas). Caso contrário nada é exibido e o motivo vai para os avisos.
 */
function lerAuditoria(caminho: string, shaBase: string, shaV2: string, v2: BaseV2Lida, avisos: string[]): AuditoriaLida | null {
  if (!existsSync(caminho)) return null;
  const a = JSON.parse(readFileSync(caminho, "utf8")) as {
    entradas: Record<"base" | "v2" | "F1" | "F2", { sha256: string; url?: string; arquivo: string; natureza?: string }>;
    codigos: Record<string, AuditoriaOficialDaRegra["codigo"]>;
    regras: RegistroAuditoria[];
    lacunas: LacunaDeCobertura[];
  };
  const registrado = (id: string) => Object.values(v2.fontes?.registros ?? {}).flatMap((r) => r.arquivos).find((x) => x.id === id)?.sha256;
  if (a.entradas.base.sha256 !== shaBase || a.entradas.v2.sha256 !== shaV2 || a.entradas.F1.sha256 !== registrado("F1.html") || a.entradas.F2.sha256 !== registrado("F2.html")) {
    avisos.push("A auditoria oficial não corresponde à base, à v2 ou aos snapshots atuais; a conferência com as fontes oficiais não foi exibida.");
    return null;
  }
  const fonte = (k: "F1" | "F2"): FonteAuditoria => ({ url: a.entradas[k].url ?? "", arquivo: a.entradas[k].arquivo, sha256: a.entradas[k].sha256, natureza: a.entradas[k].natureza ?? "" });
  const lacunasPorNcm = new Map<string, LacunaDeCobertura[]>();
  for (const l of a.lacunas) lacunasPorNcm.set(l.ncm, [...(lacunasPorNcm.get(l.ncm) ?? []), l]);
  return { porIndice: new Map(a.regras.map((r) => [r.indice, r])), lacunasPorNcm, codigos: a.codigos, fontes: { F1: fonte("F1"), F2: fonte("F2") },
    bloqueios: montarBloqueios(a as unknown as Parameters<typeof montarBloqueios>[0]) };
}

/** Conferência da regra identificada com segurança (mesmo índice, regraId e NCM). */
function auditoriaDaRegra(ctx: ContextoExplicacao, indice: number, regraId: string, ncm: string): AuditoriaOficialDaRegra | null {
  const r = ctx.auditoria?.porIndice.get(indice);
  if (!ctx.auditoria || !r || r.regraId !== regraId || r.ncm !== ncm) return null;
  const { indice: _i, regraId: _r, ncm: _n, item, ...resto } = r;
  const codigo = ctx.auditoria.codigos[r.cClassTrib];
  if (!codigo) return null;
  return { ...resto, itemDaBase: item, codigo, fontes: ctx.auditoria.fontes };
}

// ---------- índices ----------

const RESULTADO_PARA_STATUS: Record<string, StatusNormativo> = {
  concorda: "NORMA_CONFIRMADA",
  item_entre_varios: "NORMA_POSSIVEL_MULTIPLOS_ITENS",
  item_divergente: "CONFLITO_PLANILHA_FONTE",
  ncm_so_na_F1: "CONFLITO_ENTRE_FONTES",
  ncm_so_na_F2: "CONFLITO_ENTRE_FONTES",
};
const STATUS_PARA_SITUACAO: Record<StatusNormativo, SituacaoMatriz> = {
  NORMA_CONFIRMADA: 1,
  NORMA_POSSIVEL_MULTIPLOS_ITENS: 2,
  CONFLITO_PLANILHA_FONTE: 5,
  CONFLITO_ENTRE_FONTES: 6,
  SEM_EVIDENCIA_OFICIAL: 4,
};
const CAMPOS_REGRA = ["id", "ncm", "cst", "cClassTrib", "tratamento", "reducaoAliquota", "anexo", "item", "fundamentoLegal", "rotulo",
  "descricaoLegal", "descricaoNcmTipi", "ncmCitadoNaLei", "origemRegistro", "observacao", "vigenciaInicio", "vigenciaFim", "fonte"] as const;

interface Indices {
  porIdENcm: Map<string, number[]>;
  contagemId: Map<string, number>;
  vinculoPorIndice: Map<number, VinculoDeRegra>;
  codigo: Map<string, VinculoDeCodigo>;
  lacunasPorNcm: Map<string, LacunaRegistrada[]>;
  codigosPorNcm: Map<string, Set<string>>;
  f2PorCodigo: Map<string, ClassificacaoF2>;
}
const cacheIndices = new WeakMap<ContextoExplicacao, Indices>();

function indices(ctx: ContextoExplicacao): Indices {
  const pronto = cacheIndices.get(ctx);
  if (pronto) return pronto;
  const ix: Indices = {
    porIdENcm: new Map(), contagemId: new Map(), vinculoPorIndice: new Map(), codigo: new Map(),
    lacunasPorNcm: new Map(), codigosPorNcm: new Map(), f2PorCodigo: new Map(),
  };
  ctx.base.regras.forEach((r, i) => {
    const k = `${r.id}|${r.ncm}`;
    ix.porIdENcm.set(k, [...(ix.porIdENcm.get(k) ?? []), i]);
    ix.contagemId.set(r.id, (ix.contagemId.get(r.id) ?? 0) + 1);
    if (!ix.codigosPorNcm.has(r.ncm)) ix.codigosPorNcm.set(r.ncm, new Set());
    ix.codigosPorNcm.get(r.ncm)!.add(r.cClassTrib);
  });
  for (const x of ctx.v2.vinculacoes?.regras ?? []) ix.vinculoPorIndice.set(x.regra.indice, x);
  // Vínculos de código: Etapa 5 (200033, 200043) e Etapa 5.3 (demais códigos), mesma estrutura e mesmo uso
  for (const x of [...(ctx.v2.vinculacoes?.codigo ?? []), ...(ctx.v2.evidenciasOficiais?.codigo ?? [])]) {
    if (ix.codigo.has(x.id)) throw new Error(`vínculo de código duplicado na v2: ${x.id}`);
    ix.codigo.set(x.id, x);
  }
  for (const x of ctx.v2.vinculacoes?.ncmsOficiaisSemRegra ?? []) ix.lacunasPorNcm.set(x.ncm, [...(ix.lacunasPorNcm.get(x.ncm) ?? []), x]);
  for (const c of ctx.f2 ?? []) ix.f2PorCodigo.set(c.CodClassTrib, c);
  cacheIndices.set(ctx, ix);
  return ix;
}

// ---------- blocos de apoio ----------

const comCamada = (f: FonteDiz): FonteDiz => ({ camada: "FONTE_DIZ", ...f });

function metaArquivo(ctx: ContextoExplicacao, fonte: IdFonte, arquivo: IdArquivoFonte, natureza: string): Omit<FonteDiz, "localizacao"> | null {
  const reg = ctx.v2.fontes?.registros?.[fonte];
  const a = reg?.arquivos.find((x) => x.id === arquivo);
  if (!reg || !a) return null;
  return { camada: "FONTE_DIZ", fonte, arquivo, sha256: a.sha256, natureza, versao: reg.versao, dataConsulta: reg.dataConsulta };
}

/** Valores literais da planilha para a regra (fonte interna, não oficial). */
function fatosPlanilha(ctx: ContextoExplicacao, indice: number): FonteDiz[] {
  const orig = ctx.v2.regras[indice]?.original;
  const meta = metaArquivo(ctx, "PLANILHA", "PLANILHA.base-de-dados", "base interna da planilha V4.1; não oficial");
  if (!orig || orig.fonte !== "PLANILHA" || !meta) return [];
  return ["Fundamento legal", "Descrição legal do benefício"].flatMap((coluna) => {
    const valor = orig.valores[coluna];
    return valor == null ? [] : [{ ...meta, localizacao: { aba: "Base de dados", linha: orig.linha, coluna }, trecho: valor }];
  });
}

function inferencia(regra: RegraDeInferencia, premissas: FonteDiz[], conclusao: string): SistemaInfere {
  return { camada: "SISTEMA_INFERE", regra, premissas, conclusao };
}

const REGRA_POR_CAMPO: Record<string, RegraDeInferencia> = {
  anexo: "anexo_arabico_romano",
  reducaoAliquota: "percentual_para_fracao",
  fundamentoLegal: "comparacao_fundamento",
  vigenciaInicio: "vigencia_art544_por_exclusao",
};

/** Redução não determinada: a regra não foi identificada com segurança, nenhum percentual é informado. */
function reducaoNaoDeterminada(motivo: string): ReducaoExplicada {
  return { valor: null, origem: null, regraIndice: null, linhaPlanilha: null, evidencia: "nao_determinada", comparacao: null, fatos: [], motivo };
}

/**
 * Redução da regra identificada com segurança: o valor é o reducaoAliquota da base (o mesmo que o motor usa);
 * a evidência vem do vínculo do código (C-<cClassTrib>-reducaoAliquota), só quando ele alcança esta regra.
 */
function reducaoDaRegra(ix: Indices, indice: number, linha: number | null, atual: RegraClassificacao): ReducaoExplicada {
  const comum = { valor: atual.reducaoAliquota, origem: "base_normativa" as const, regraIndice: indice, linhaPlanilha: linha };
  const rc = ix.codigo.get(`C-${atual.cClassTrib}-reducaoAliquota`);
  const alcanca = !!rc && (rc.alcance ?? []).some((a) => a.indice === indice);
  if (!rc || !alcanca) {
    return { ...comum, evidencia: "sem_evidencia_oficial", comparacao: null, fatos: [],
      motivo: rc
        ? `O vínculo ${rc.id} não alcança esta regra; o percentual vem só da base normativa.`
        : `O código ${atual.cClassTrib} está fora do escopo auditado; o percentual vem só da base normativa, sem conferência com fonte oficial.` };
  }
  const fatos = rc.fatos.map(comCamada);
  const valorConfere = typeof rc.valorRegra !== "number" || rc.valorRegra === atual.reducaoAliquota;
  const confirmada = rc.comparacao.resultado === "concorda" && valorConfere;
  return { ...comum, evidencia: confirmada ? "oficial_confirmada" : "oficial_divergente", comparacao: rc.comparacao.resultado, fatos,
    motivo: confirmada
      ? `O vínculo ${rc.id} confere o percentual com as fontes oficiais (resultado "${rc.comparacao.resultado}").`
      : `O vínculo ${rc.id} não confirma o percentual da regra (resultado "${rc.comparacao.resultado}"${valorConfere ? "" : `; valor do vínculo ${String(rc.valorRegra)}`}).` };
}

function pendente<D extends IdDecisao>(decisao: D): DecisaoPendente<D> {
  return { status: "pendente", decisao };
}

/** Condições da norma para os códigos auditados. Textos literais; nada decidido. */
function condicoes(ctx: ContextoExplicacao, ix: Indices, cod: string, ncm: string, indice: number): { condicoes: CondicaoAplicacao[]; fatosF2: FonteDiz[] } {
  const inciso = ix.codigo.get(`C-${cod}-anexo`)?.fatos.find((f) => f.fonte === "F1");
  if (!inciso || (cod !== "200033" && cod !== "200043")) return { condicoes: [], fatosF2: [] };
  const fatosF2: FonteDiz[] = [];
  const cls = ix.f2PorCodigo.get(cod);
  const metaF2 = metaArquivo(ctx, "F2", "F2.extracao", "tabela de apoio do portal da Conformidade Fácil (SVRS); não é texto legal");
  let textoOperacional: FonteDiz | undefined;
  if (cls && metaF2) {
    const entrada = cls.Anexos.find((a) => a.CodNcmNbs === ncm);
    if (entrada?.DescCondicao) {
      textoOperacional = { ...metaF2, localizacao: { cst: "200", cClassTrib: cod, anexo: { CodIntProdServ: entrada.CodIntProdServ } }, valor: { DescCondicao: entrada.DescCondicao } };
      fatosF2.push(textoOperacional);
    }
    if (cod === "200043") fatosF2.push({ ...metaF2, localizacao: { cst: "200", cClassTrib: cod, campo: "IndNfce" }, valor: cls.IndNfce });
  }
  const base: CondicaoAplicacao = cod === "200033"
    ? { id: "COND-200033-DESTINACAO", cClassTrib: cod, natureza: "destinacao", textoOficial: comCamada(inciso), verificavelPeloXml: "nao", chaveDeValidacao: "produto" }
    : {
        id: "COND-200043-ADQUIRENTE", cClassTrib: cod, natureza: "adquirente", textoOficial: comCamada(inciso), verificavelPeloXml: "nao",
        chaveDeValidacao: "adquirente", combinacaoDosTipos: pendente("D2"), estadoSeContrariada: pendente("D4"),
      };
  if (textoOperacional) base.textoOperacional = textoOperacional;
  const orig = ctx.v2.regras[indice]?.original;
  const obs = orig?.fonte === "PLANILHA" ? orig.valores["Observação"] : null;
  if (cod === "200043" && orig?.fonte === "PLANILHA" && obs) base.textoPlanilha = { fonte: "PLANILHA", aba: "Base de dados", linha: orig.linha, coluna: "Observação", valor: obs };
  return { condicoes: [base], fatosF2 };
}

// ---------- explicação por regra ----------

interface ResultadoRegra { explicacao: ExplicacaoRegra; limitacoes: string[]; decisoes: IdDecisao[]; ausencias: AusenciaExplicita[]; situacoes: SituacaoMatriz[] }

function explicarRegra(ctx: ContextoExplicacao, ix: Indices, regraId: string, v: Veredito): ResultadoRegra {
  const vazia = (vinculo: ExplicacaoRegra["vinculo"]): ExplicacaoRegra => ({
    regraIdInformado: regraId, vinculo, referencia: null, statusNormativo: null, fonteDiz: [], sistemaInfere: [], sinalizadores: [], condicoes: [], divergencias: [],
  });
  const ncm = v.ncm ?? "";
  const achadas = ix.porIdENcm.get(`${regraId}|${ncm}`) ?? [];

  if (achadas.length > 1) {
    const e = vazia("ambiguo_regraid_duplicado");
    e.sinalizadores = ["REGRAID_DUPLICADO"];
    e.reducao = reducaoNaoDeterminada(`A regra não pôde ser identificada com segurança: o regraId ${regraId} corresponde a ${achadas.length} regras da base.`);
    const refs: RefRegra[] = achadas.map((i) => ({ indice: i, linha: ctx.v2.regras[i]?.original?.linha ?? -1, regraId, ncm }));
    e.divergencias = [{
      id: `DIV-regraid_duplicado-${regraId}`, tipo: "regraid_duplicado", regras: refs, valores: [{ fonte: "BASE_ATUAL", valor: regraId }],
      impacto: "identificacao", status: "aberta", resolucao: null,
    }];
    return {
      explicacao: e, decisoes: ["D7"], ausencias: ["REGRA_NAO_LOCALIZADA_COM_SEGURANCA"], situacoes: [13],
      limitacoes: [`O regraId ${regraId} corresponde a ${achadas.length} regras da base (linhas ${refs.map((r) => r.linha).join(" e ")}); nenhuma evidência foi vinculada e nenhuma delas foi escolhida.`],
    };
  }
  const i = achadas[0];
  const r2 = i === undefined ? undefined : ctx.v2.regras[i];
  const atual = i === undefined ? undefined : ctx.base.regras[i];
  const coerente = !!r2 && !!atual && CAMPOS_REGRA.every((k) => JSON.stringify(r2[k]) === JSON.stringify(atual[k])) && !!r2.original;
  if (i === undefined || !coerente || !atual || !r2?.original) {
    const naoLocalizada = vazia("nao_localizado");
    naoLocalizada.reducao = reducaoNaoDeterminada(`A regra não pôde ser identificada com segurança: o identificador ${regraId} não corresponde, de forma conferida, a uma regra da base para a NCM ${ncm || "(sem NCM)"}.`);
    return {
      explicacao: naoLocalizada, decisoes: [], ausencias: ["REGRA_NAO_LOCALIZADA_COM_SEGURANCA"], situacoes: [],
      limitacoes: [i === undefined
        ? `O identificador informado pelo motor (${regraId}) não corresponde a uma regra da base para a NCM ${ncm || "(sem NCM)"}; nenhuma evidência foi vinculada.`
        : `A regra ${regraId} (índice ${i}) não confere entre a base atual e a v2; nenhuma evidência foi vinculada.`],
    };
  }

  const ref: RefRegra = { indice: i, linha: r2.original.linha, regraId, ncm };
  const e = vazia("seguro");
  e.referencia = ref;
  e.reducao = reducaoDaRegra(ix, i, ref.linha, atual);
  e.auditoriaOficial = auditoriaDaRegra(ctx, i, regraId, ncm);
  e.bloqueio = ctx.auditoria?.bloqueios.get(chaveBloqueio(regraId, ncm)) ?? null;
  const out: ResultadoRegra = { explicacao: e, limitacoes: [], decisoes: [], ausencias: [], situacoes: [] };
  const cod = atual.cClassTrib;
  const vr = ix.vinculoPorIndice.get(i);
  e.fonteDiz.push(...fatosPlanilha(ctx, i));
  if ((ix.codigosPorNcm.get(atual.ncm)?.size ?? 0) > 1) e.sinalizadores.push("NCM_EM_OUTROS_CODIGOS");

  if (!vr) {
    e.statusNormativo = "SEM_EVIDENCIA_OFICIAL";
    out.ausencias.push("SEM_EVIDENCIA_OFICIAL");
    if (!e.bloqueio && !vinculoNcmItemConfirmado(ctx, e, null)) out.decisoes.push("D3");
    out.situacoes.push(4);
    out.limitacoes.push(ref.linha === null
      ? `A regra ${regraId} foi incluída pela decisão D5 a partir da LC 214/2025 e do SVRS; o código ${cod} está fora do escopo das vinculações (${ctx.v2.vinculacoes.escopo.join(", ")}), e a conferência da regra está na auditoria oficial.`
      : `A regra ${regraId} (linha ${ref.linha}) só tem a planilha como origem; o código ${cod} está fora do escopo auditado (${ctx.v2.vinculacoes.escopo.join(", ")}).`);
    return out;
  }

  // Regra no escopo auditado: fatos oficiais, comparação e condições
  const status = RESULTADO_PARA_STATUS[vr.comparacao.resultado];
  e.statusNormativo = status ?? null;
  if (status) out.situacoes.push(STATUS_PARA_SITUACAO[status]);
  const fatosRegra = vr.fatos.map(comCamada);
  e.fonteDiz.push(...fatosRegra);
  const d = vr.dadoExtraido;
  const regraComp: RegraDeInferencia = vr.comparacao.resultado.startsWith("ncm_so_") ? "comparacao_presenca_ncm" : "comparacao_item";
  e.sistemaInfere.push(inferencia(regraComp, fatosRegra,
    `O sistema comparou o item da regra (${atual.item}) com as fontes: resultado "${vr.comparacao.resultado}".` + (vr.interpretacao ? ` Leitura do sistema: ${vr.interpretacao}` : "")));
  if (d.coberturaF1.some((c) => !c.exata)) {
    e.sistemaInfere.push(inferencia("cobertura_ncm_por_prefixo", fatosRegra.filter((f) => f.fonte === "F1"),
      `O sistema considerou que ${d.coberturaF1.filter((c) => !c.exata).map((c) => `o código ${c.codigo} (item ${c.item})`).join(" e ")} cobre a NCM ${atual.ncm} por prefixo.`));
  }
  if (d.itensF1QueCobremONcm.length > 1) { e.sinalizadores.push("DEPENDE_COMPOSICAO_PRODUTO"); out.situacoes.push(10); }

  for (const campo of ["anexo", "reducaoAliquota", "fundamentoLegal", "vigenciaInicio"]) {
    const rc = ix.codigo.get(`C-${cod}-${campo}`);
    if (!rc) continue;
    const fatos = rc.fatos.map(comCamada);
    for (const f of fatos) if (!e.fonteDiz.some((x) => JSON.stringify(x.localizacao) === JSON.stringify(f.localizacao) && x.arquivo === f.arquivo)) e.fonteDiz.push(f);
    const regraInf = REGRA_POR_CAMPO[campo];
    if (regraInf) e.sistemaInfere.push(inferencia(regraInf, fatos,
      `O sistema comparou o campo ${campo} da regra com as fontes: resultado "${rc.comparacao.resultado}".` + (rc.comparacao.detalhe ? ` ${rc.comparacao.detalhe}` : "") + (rc.interpretacao ? ` Leitura do sistema: ${rc.interpretacao}` : "")));
    const valorBase = { fonte: "BASE_ATUAL" as const, valor: (atual as unknown as Record<string, unknown>)[campo] };
    const oficiais = fatos.filter((f) => f.fonte !== "PLANILHA").map((f) => ({ fonte: f.fonte, valor: f.trecho ?? f.valor, fato: f }));
    if (campo === "fundamentoLegal" && (rc.status === "conflito" || rc.status === "ambiguo")) {
      const conflito = rc.status === "conflito";
      e.sinalizadores.push(conflito ? "FUNDAMENTO_DIVERGENTE" : "FUNDAMENTO_A_REVISAR");
      e.divergencias.push({ id: `DIV-${conflito ? "fundamento_legal" : "fundamento_a_revisar"}-${cod}`, tipo: conflito ? "fundamento_legal" : "fundamento_a_revisar",
        cClassTrib: cod, regras: [ref], valores: [valorBase, ...oficiais], impacto: "texto", status: conflito ? "aberta" : "a_revisar", resolucao: null });
      out.situacoes.push(8);
    }
    if (campo === "vigenciaInicio" && rc.status === "ambiguo") {
      e.sinalizadores.push("VIGENCIA_AMBIGUA");
      e.divergencias.push({ id: `DIV-vigencia-${cod}`, tipo: "vigencia", cClassTrib: cod, regras: [ref], valores: [valorBase, ...oficiais],
        impacto: "calculo", status: "a_revisar", resolucao: null });
      out.situacoes.push(7);
    }
  }

  if (vr.comparacao.resultado === "item_divergente") {
    const f1 = fatosRegra.filter((f) => f.fonte === "F1");
    e.divergencias.push({ id: `DIV-item_divergente-${i}`, tipo: "item_divergente", cClassTrib: cod, regras: [ref], impacto: "enquadramento", status: "aberta", resolucao: null,
      valores: [{ fonte: "BASE_ATUAL", valor: atual.item }, ...f1.map((f) => ({ fonte: f.fonte, valor: f.trecho, fato: f })), { fonte: "F2", valor: d.descricoesF2 }] });
  }
  if (vr.comparacao.resultado === "ncm_so_na_F1" || vr.comparacao.resultado === "ncm_so_na_F2") {
    const soF1 = vr.comparacao.resultado === "ncm_so_na_F1";
    const presente = fatosRegra.find((f) => f.fonte === (soF1 ? "F1" : "F2"));
    e.divergencias.push({ id: `DIV-${vr.comparacao.resultado}-${cod}-${atual.ncm}`, tipo: soF1 ? "ncm_so_na_F1" : "ncm_so_na_F2", cClassTrib: cod, regras: [ref],
      impacto: "enquadramento", status: "aberta", resolucao: null,
      valores: [
        { fonte: soF1 ? "F1" : "F2", valor: "presente", ...(presente ? { fato: presente } : {}) },
        { fonte: soF1 ? "F2" : "F1", valor: `ausente da lista do ${cod}` },
      ] });
    out.limitacoes.push(`As fontes oficiais divergem sobre a NCM ${atual.ncm} no ${cod}; nenhuma fonte foi escolhida e a divergência não foi resolvida.`);
  }

  const cond = condicoes(ctx, ix, cod, atual.ncm, i);
  e.condicoes = cond.condicoes;
  e.fonteDiz.push(...cond.fatosF2);
  if (cond.condicoes.length) { e.sinalizadores.push("CONDICAO_NAO_VERIFICAVEL_NO_XML"); out.situacoes.push(10); }
  if (cod === "200043") {
    out.decisoes.push("D2", "D4");
    out.situacoes.push(9);
  }
  if ((cod === "200033" || cod === "200043") && !ix.f2PorCodigo.size) out.limitacoes.push(...ctx.avisos);
  if (!e.bloqueio && !vinculoNcmItemConfirmado(ctx, e, vr)) out.decisoes.push("D3");
  return out;
}

/**
 * D3 (definição aprovada na Etapa 5.3): regras cujo vínculo NCM × item com a fonte oficial não esteja CONFIRMADO.
 * Com auditoria oficial válida, vale o status dela; sem auditoria, vale o vínculo registrado na v2 (resultado "concorda").
 */
function vinculoNcmItemConfirmado(ctx: ContextoExplicacao, e: ExplicacaoRegra, vr: VinculoDeRegra | null | undefined): boolean {
  if (ctx.auditoria) return e.auditoriaOficial?.status === "CONFIRMADA";
  return vr?.comparacao.resultado === "concorda";
}

// ---------- explicação do veredito ----------

function classificarLegada(ctx: ContextoExplicacao, ix: Indices, r: RespostaValidacao): ValidacaoLegada["classificacao"] | null {
  if (r.autor === "Sistema") return "autor_sistema_nao_e_confirmacao_humana";
  if (!r.justificativa) return "autor_humano_sem_justificativa";
  if ((ix.contagemId.get(r.regraId) ?? 0) > 1) return "chave_por_regraid_duplicado";
  if (ctx.base.regras.some((x) => x.id === r.regraId && x.cClassTrib === "200043")) return "chave_por_produto_em_condicao_de_adquirente";
  // Autor humano identificado e justificativa registrada; RespostaValidacao não guarda o hash das fontes.
  if (r.autor.trim() !== "") return "sem_hash_das_fontes_na_data";
  return null;
}

/** Explica um veredito já calculado pelo motor. O veredito recebido não é alterado. */
export function explicarVeredito(v: Veredito, ctx: ContextoExplicacao, doc?: Documento): VereditoExplicado {
  const ix = indices(ctx);
  // O regime de bares e restaurantes (art. 275) é aplicado pelo motor, não é regra da base: não se procura
  // na base (evita o falso "regra não localizada"); sua redução é explicada à parte em reducaoDoItem.
  const regraDaBase = v.regraAplicada && v.regraAplicada !== BARES_RESTAURANTES.fundamento ? v.regraAplicada : null;
  const ids = [...new Set([...v.regrasCandidatas, ...(regraDaBase && !v.regrasCandidatas.includes(regraDaBase) ? [regraDaBase] : []), ...(v.regrasBloqueadas ?? [])])];
  const partes = ids.map((id) => explicarRegra(ctx, ix, id, v));
  const regras = partes.map((p) => p.explicacao);
  const limitacoes = partes.flatMap((p) => p.limitacoes);
  const decisoes = new Set<IdDecisao>(partes.flatMap((p) => p.decisoes));
  const ausencias = new Set<AusenciaExplicita>(partes.flatMap((p) => p.ausencias));
  const situacoes = new Set<SituacaoMatriz>(partes.flatMap((p) => p.situacoes));

  if (v.regrasCandidatas.length === 0) ausencias.add("SEM_REGRA_NA_BASE");

  // Lacunas: NCM listada pela fonte oficial sem regra correspondente (nenhuma regra é criada)
  const lacunas: Lacuna[] = (ix.lacunasPorNcm.get(v.ncm ?? "") ?? []).map((l) => ({
    id: l.id, status: "LACUNA_FONTE_SEM_REGRA", cClassTrib: l.cClassTrib, ncm: l.ncm, fatos: l.fatos.map(comCamada),
    regrasDeOutrosCodigosComEstaNcm: l.regrasDeOutrosCodigosComEstaNcm, inclusaoComoRegra: pendente("D5"),
  }));
  if (lacunas.length) {
    decisoes.add("D5");
    situacoes.add(3);
    limitacoes.push(`A fonte oficial lista a NCM ${v.ncm} para ${lacunas.map((l) => l.cClassTrib).join(", ")}, e a base atual não tem regra correspondente. O estado ${v.estado} foi produzido pelo motor sem essa informação e não foi alterado.`);
  }

  // Validações registradas no empresa.json para este item: sempre legadas nesta fase
  const registros = ctx.validacoes.filter((r) => r.ncm === v.ncm && (r.cProd === v.cProd || r.cProd === v.produto));
  const validacoesLegadas: ValidacaoLegada[] = [];
  for (const r of registros) {
    const classificacao = classificarLegada(ctx, ix, r);
    if (classificacao) validacoesLegadas.push({ origem: "empresa.json", registro: r, classificacao, tratamento: pendente("D6") });
    else limitacoes.push(`Resposta do empresa.json sem autor identificável (cProd ${r.cProd}, regraId ${r.regraId}): não é HUMANO_CONFIRMOU e nenhuma classificação de ValidacaoLegada se aplica a ela.`);
  }
  if (validacoesLegadas.length) decisoes.add("D6");
  if (validacoesLegadas.some((x) => x.classificacao === "autor_sistema_nao_e_confirmacao_humana")) {
    limitacoes.push("Resposta do empresa.json com autor \"Sistema\": a tela de validação envia o autor fixo \"Sistema\" (servidor.ts, função validar), e a rota /api/validar grava \"Sistema\" quando não recebe autor (autor || \"Sistema\"). A autoria não foi coletada e não foi reconstruída: o registro não indica decisão automática do sistema nem validação humana comprovada.");
  }
  if (validacoesLegadas.some((x) => x.classificacao === "sem_hash_das_fontes_na_data")) {
    limitacoes.push("Resposta do empresa.json com autor humano e justificativa, mas sem o hash das fontes na data da resposta: permanece ValidacaoLegada e não é HUMANO_CONFIRMOU.");
  }
  if (registros.length) {
    situacoes.add(11);
    limitacoes.push("A rota /api/validar substitui a resposta anterior para a mesma chave; não há histórico de respostas.");
  }

  const comRegraReal = regras.some((r) => r.vinculo !== "nao_localizado");
  if (comRegraReal || registros.length) { ausencias.add("VALIDACAO_HUMANA_NAO_DISPONIVEL"); situacoes.add(12); }

  // Status do benefício: nunca confirmado nesta fase (não há HUMANO_CONFIRMOU)
  let statusBeneficio: StatusBeneficio | null = null;
  if (comRegraReal) {
    const cond = regras.flatMap((r) => r.condicoes);
    const pergunta = cond.length
      ? `O produto e a operação atendem à descrição do item e à condição da norma (${[...new Set(cond.map((c) => "dispositivo" in c.textoOficial.localizacao ? `LC 214/2025, ${c.textoOficial.localizacao.dispositivo}` : c.id))].join("; ")})? Ver o texto literal nas evidências.`
        + (cond.some((c) => c.combinacaoDosTipos) ? " A combinação dos tipos de adquirente depende da decisão D2, pendente." : "")
      : "O produto atende à descrição legal da regra? Ver as evidências.";
    statusBeneficio = { status: "BENEFICIO_PENDENTE_VALIDACAO", pergunta: pergunta + (registros.length ? " Há resposta registrada no empresa.json, mas ela não comprova validação humana." : "") };
  }

  if (doc?.modelo === "65" && regras.some((r) => r.referencia && ctx.base.regras[r.referencia.indice]?.cClassTrib === "200043")) {
    limitacoes.push("Documento modelo 65 (NFC-e) com regra do 200043; o SVRS registra IndNfce = false para o 200043. Só informação: o tratamento depende da decisão D4, pendente.");
  }
  if (v.aliquotaUsada.some((a) => a.tipo === "projecao")) situacoes.add(14);

  // Nível de evidência: conflito prevalece; sem regras, pendente; um só nível, esse nível;
  // níveis diferentes entre as candidatas, "misto". O detalhe de cada regra continua em `regras`.
  const nivelDaRegra = (s: StatusNormativo | null): "oficial" | "planilha" | "pendente" =>
    s === "NORMA_CONFIRMADA" || s === "NORMA_POSSIVEL_MULTIPLOS_ITENS" ? "oficial" : s === "SEM_EVIDENCIA_OFICIAL" ? "planilha" : "pendente";
  const statuses = regras.map((r) => r.statusNormativo);
  const niveis = new Set(statuses.map(nivelDaRegra));
  const nivelEvidencia: ExplicacaoInformativa["nivelEvidencia"] =
    statuses.some((s) => s === "CONFLITO_PLANILHA_FONTE" || s === "CONFLITO_ENTRE_FONTES") ? "divergente"
      : niveis.size === 0 ? "pendente"
        : niveis.size === 1 ? [...niveis][0]!
          : "misto";

  const ordem: IdDecisao[] = ["D2", "D3", "D4", "D5", "D6", "D7"];
  const explicacaoInformativa: ExplicacaoInformativa = {
    fase: "A_INFORMATIVA",
    regras,
    statusBeneficio,
    humanoConfirmou: [],
    ausencias: [...ausencias],
    validacoesLegadas,
    lacunas,
    decisoesPendentes: ordem.filter((d) => decisoes.has(d)).map((d) => pendente(d)),
    matriz: { versao: ctx.matriz.versao, hash: ctx.matriz.hash, situacoes: [...situacoes].sort((a, b) => a - b), efeito: "somente_explicacao" },
    nivelEvidencia,
    limitacoes: [...new Set(limitacoes)],
    reducaoDoItem: reducaoDoItem(v, regras),
    lacunasDeCobertura: ctx.auditoria ? ctx.auditoria.lacunasPorNcm.get(v.ncm ?? "") ?? [] : [],
  };
  return { ...v, explicacaoInformativa };
}

/** Tolerância da conferência economiaPotencial ≈ valorPago × redução (meio centavo). */
const TOLERANCIA_ECONOMIA = 0.005;

/**
 * Redução do item, só para exibição: a da regraAplicada, ou as das candidatas quando o enquadramento
 * está pendente. Usa apenas as regras já identificadas acima (não repete a busca de vínculos).
 */
function reducaoDoItem(v: Veredito, regras: ExplicacaoRegra[]): ReducaoDoItem | null {
  const daRegra = (id: string) => {
    const r = regras.find((x) => x.regraIdInformado === id);
    return { regraId: id, ...(r?.reducao ?? reducaoNaoDeterminada(`A regra ${id} não foi identificada pelo explicador.`)) };
  };
  if (v.regraAplicada === BARES_RESTAURANTES.fundamento) {
    return {
      situacao: "regime_especifico", opcoes: [], coerenciaEconomia: null,
      regimeEspecifico: { valor: BARES_RESTAURANTES.reducao, fundamento: BARES_RESTAURANTES.fundamento, origem: "regime_especifico_motor" },
    };
  }
  if (v.regraAplicada) {
    const o = daRegra(v.regraAplicada);
    let coerenciaEconomia: boolean | null = null;
    if (v.estado === "INCORRETO_ECONOMIA" && o.valor !== null && v.valorPago !== null && v.economiaPotencial !== null) {
      coerenciaEconomia = Math.abs(v.economiaPotencial - v.valorPago * o.valor) <= TOLERANCIA_ECONOMIA;
    }
    return { situacao: "aplicada", opcoes: [o], regimeEspecifico: null, coerenciaEconomia };
  }
  if (v.estado === "REQUER_VALIDACAO" && v.regrasCandidatas.length) {
    // Regra rejeitada pelo requisito legal não é redução prevista para o produto (só "regra encontrada").
    const rejeitadas = new Set((v.regrasNaoAplicaveis ?? []).map((x) => x.regraId));
    const ids = [...new Set(v.regrasCandidatas)].filter((id) => !rejeitadas.has(id));
    if (!ids.length) return null;
    return { situacao: "prevista", opcoes: ids.map(daRegra), regimeEspecifico: null, coerenciaEconomia: null };
  }
  return null;
}

/** Explica uma lista de vereditos, na mesma ordem. Nenhum veredito é alterado. */
export function explicarVereditos(vereditos: Veredito[], ctx: ContextoExplicacao, docs: Documento[] = []): VereditoExplicado[] {
  const porId = new Map(docs.map((d) => [d.chave ?? d.arquivo, d]));
  return vereditos.map((v) => explicarVeredito(v, ctx, porId.get(v.documento)));
}
