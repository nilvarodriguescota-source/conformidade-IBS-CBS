/**
 * Consulta Tributária por NCM (sem XML). Módulo novo e isolado: só monta a entrada e chama o que já existe.
 *
 * NCM informado → classificarItem (motor) → explicarVeredito (explicador: FONTE_DIZ, SISTEMA_INFERE, auditoria,
 * lacunas, bloqueios) → gerarAlertas (alertas). Nenhuma regra, critério ou decisão é criado ou repetido aqui:
 * o estado, o esperado e as candidatas são os do motor; as evidências são as do explicador.
 *
 * A consulta não tem produto nem XML, então entra no motor como um item sem CST/cClassTrib informados e sem
 * código de produto (nenhuma validação humana se aplica a ela). Os parâmetros usados vão no resultado.
 */
import { classificarItem, TRIBUTACAO_INTEGRAL } from "./motor.js";
import { explicarVeredito, type ContextoExplicacao } from "./explicador.js";
import { gerarAlertas, type Alerta } from "./alertas.js";
import { aliquotaVigente, ALIQUOTAS, preenchimentoObrigatorio } from "./parametros.js";
import type {
  BaseNormativa, BloqueioOficial, Documento, Empresa, ItemDocumento, NaturezaItem, RegraClassificacao, VereditoExplicado,
} from "./tipos.js";

/** Código de produto da consulta: não coincide com nenhum cProd real, então nenhuma resposta SIM/NÃO é reaproveitada. */
export const CPROD_CONSULTA = "CONSULTA-NCM";
const NATUREZAS: NaturezaItem[] = ["mercadoria", "preparado_no_local", "bebida_alcoolica", "servico"];

/** Aceita 8 dígitos, com ou sem pontuação (1901.20.90, 1901 20 90, 19012090). Não completa nem aproxima. */
export function normalizarNcm(entrada: unknown): { ok: true; ncm: string } | { ok: false; erro: string } {
  const texto = String(entrada ?? "").trim();
  if (!texto) return { ok: false, erro: "Informe o NCM." };
  if (!/^[\d.\s-]+$/.test(texto)) return { ok: false, erro: `NCM "${texto}" inválido: use somente números, com ou sem pontos (ex.: 1901.20.90 ou 19012090).` };
  const ncm = texto.replace(/[.\s-]/g, "");
  if (ncm.length !== 8) return { ok: false, erro: `NCM "${texto}" inválido: o NCM tem 8 dígitos (foram informados ${ncm.length}).` };
  return { ok: true, ncm };
}

export interface EntradaConsultaNcm {
  ncm: unknown;
  modelo?: unknown;
  natureza?: unknown;
}

export interface ContextoConsultaNcm {
  base: BaseNormativa;
  empresa: Empresa;
  regrasBloqueadas: ReadonlySet<string>;
  bloqueios: Map<string, BloqueioOficial>;
  explicacao: ContextoExplicacao;
  agora?: string;
}

export interface RegraDaConsulta {
  id: string;
  cst: string;
  cClassTrib: string;
  anexo: string;
  item: string;
  rotulo: string;
  fundamentoLegal: string;
  descricaoLegal: string;
  descricaoNcmTipi: string | null;
  observacao: string | null;
  reducaoAliquota: number;
  vigenciaInicio: string;
  vigenciaFim: string | null;
  fonte: string;
  origemRegistro: string | null;
  /** Papel no resultado do motor. */
  situacao: "aplicada" | "candidata" | "bloqueada" | "fora_da_vigencia" | "nao_considerada";
  /** Alíquota IBS + CBS na data, com a redução da regra (null se alguma alíquota não estiver vigente). */
  aliquotaEfetiva: number | null;
}

export type ResultadoConsultaNcm =
  | { ok: false; erro: string }
  | {
      ok: true;
      ncm: string;
      parametros: {
        data: string; modelo: string; regime: string; barOuRestaurante: boolean;
        natureza: NaturezaItem | null; naturezaOrigem: "informada_na_consulta" | "deduzida_pelo_motor" | "nao_informada";
        entrada: string; versaoBase: string;
      };
      obrigatoriedade: { obrigatorio: boolean; fonte: string } | null;
      /** Resultado da consulta, lido do veredito (nada é decidido aqui). */
      conclusao: {
        tipo: "ENQUADRAMENTO_DETERMINADO" | "REQUER_VALIDACAO_HUMANA" | "REGRA_GERAL_SEM_BENEFICIO" | "INDETERMINADO" | "NAO_OBRIGATORIO";
        texto: string;
      };
      encontradoNaBase: boolean;
      descricaoNcm: string[];
      regras: RegraDaConsulta[];
      veredito: VereditoExplicado;
      alertas: Alerta[];
      aliquotas: { tributo: string; aliquota: number; fonte: string; tipo: string }[];
    };

const dia = (iso: string) => iso.slice(0, 10);

/** Contexto do explicador sem as respostas do empresa.json; um por contexto, para o explicador reaproveitar seus índices. */
const cacheSemValidacoes = new WeakMap<ContextoExplicacao, ContextoExplicacao>();
function semValidacoes(c: ContextoExplicacao): ContextoExplicacao {
  let s = cacheSemValidacoes.get(c);
  if (!s) { s = { ...c, validacoes: [] }; cacheSemValidacoes.set(c, s); }
  return s;
}

/** Executa a consulta com o motor e o explicador existentes. Nada é gravado. */
export function consultarNcm(entrada: EntradaConsultaNcm, ctx: ContextoConsultaNcm): ResultadoConsultaNcm {
  const n = normalizarNcm(entrada.ncm);
  if (!n.ok) return n;
  const modelo = entrada.modelo == null || entrada.modelo === "" ? "65" : String(entrada.modelo);
  if (modelo !== "55" && modelo !== "65") return { ok: false, erro: "Modelo do documento inválido: use 55 (NF-e) ou 65 (NFC-e)." };
  const natureza = entrada.natureza == null || entrada.natureza === "" ? null : String(entrada.natureza) as NaturezaItem;
  if (natureza !== null && !NATUREZAS.includes(natureza)) return { ok: false, erro: "Natureza do produto inválida." };

  const agora = ctx.agora ?? new Date().toISOString();
  const doc: Documento = {
    chave: null, modelo, numero: null, serie: null, dataEmissao: agora, tipoOperacao: "saida", finalidade: "1", situacao: null,
    cancelado: false, emitente: { cnpj: ctx.empresa.cnpj ?? null, crt: null, uf: ctx.empresa.uf ?? null },
    destinatario: { cnpj: null, cpf: null, uf: null, indIEDest: null }, itens: [], arquivo: `consulta-ncm-${n.ncm}`, avisos: [],
  };
  const item: ItemDocumento = {
    nItem: 1, cProd: CPROD_CONSULTA, xProd: "", ncm: n.ncm, cfop: null, quantidade: null, valorProduto: 0, desconto: 0, baseCalculo: 0,
    cst: null, cClassTrib: null, aliquotas: {}, ...(natureza ? { natureza } : {}),
  };
  doc.itens.push(item);

  // Motor existente, sem validações (a consulta não tem produto) e com as mesmas regras bloqueadas da análise
  const v = classificarItem(doc, item, { base: ctx.base, empresa: ctx.empresa, validacoes: [], agora, regrasBloqueadas: ctx.regrasBloqueadas });
  // Explicador existente (auditoria, fontes, lacunas), sem as respostas do empresa.json
  const explicado = explicarVeredito(v, semValidacoes(ctx.explicacao), doc);
  const alertas = gerarAlertas([explicado]).porItem;

  const aliquotas = (["CBS", "IBS"] as const)
    .map((t) => aliquotaVigente(t, agora, false, ALIQUOTAS))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => ({ tributo: p.tributo, aliquota: p.aliquota, fonte: p.fonte, tipo: p.tipo }));
  const total = aliquotas.length === 2 ? aliquotas.reduce((s, a) => s + a.aliquota, 0) : null;

  const doNcm = ctx.base.regras.filter((r) => r.ncm === n.ncm);
  const bloqueadas = new Set(v.regrasBloqueadas ?? []);
  const vigente = (r: RegraClassificacao) => r.vigenciaInicio <= dia(agora) && (r.vigenciaFim === null || r.vigenciaFim >= dia(agora));
  const situacaoDe = (r: RegraClassificacao): RegraDaConsulta["situacao"] =>
    r.id === v.regraAplicada ? "aplicada"
      : bloqueadas.has(r.id) ? "bloqueada"
        : v.regrasCandidatas.includes(r.id) ? "candidata"
          : !vigente(r) ? "fora_da_vigencia"
            : "nao_considerada";
  const regras: RegraDaConsulta[] = doNcm.map((r) => ({
    id: r.id, cst: r.cst, cClassTrib: r.cClassTrib, anexo: r.anexo, item: r.item, rotulo: r.rotulo, fundamentoLegal: r.fundamentoLegal,
    descricaoLegal: r.descricaoLegal, descricaoNcmTipi: r.descricaoNcmTipi ?? null, observacao: r.observacao ?? null,
    reducaoAliquota: r.reducaoAliquota, vigenciaInicio: r.vigenciaInicio, vigenciaFim: r.vigenciaFim, fonte: r.fonte,
    origemRegistro: r.origemRegistro ?? null, situacao: situacaoDe(r),
    aliquotaEfetiva: total === null ? null : Number((total * (1 - r.reducaoAliquota)).toFixed(6)),
  }));

  const naturezaOrigem = natureza ? "informada_na_consulta" : ctx.empresa.barOuRestaurante ? "nao_informada" : "deduzida_pelo_motor";
  const obrig = preenchimentoObrigatorio(modelo, ctx.empresa.regime, agora);
  const exp = explicado.explicacaoInformativa;
  const temLacuna = (exp?.lacunas.length ?? 0) > 0 || (exp?.lacunasDeCobertura?.length ?? 0) > 0;
  const encontradoNaBase = doNcm.length > 0 || temLacuna || [...ctx.bloqueios.values()].some((b) => b.ncm === n.ncm);

  let conclusao: Extract<ResultadoConsultaNcm, { ok: true }>["conclusao"];
  if (v.estado === "INDETERMINADO") {
    conclusao = { tipo: "INDETERMINADO", texto: `O motor não classificou: ${v.motivo}` };
  } else if (v.estado === "NAO_OBRIGATORIO") {
    conclusao = { tipo: "NAO_OBRIGATORIO", texto: `Na data da consulta o grupo IBS/CBS ainda não é exigido para este modelo e regime. ${v.motivo}` };
  } else if (v.esperado === null) {
    conclusao = {
      tipo: "REQUER_VALIDACAO_HUMANA",
      texto: `O motor encontrou ${v.regrasCandidatas.length} enquadramento(s) possível(is) e não escolhe entre eles: a decisão depende de confirmação humana de que o produto atende à descrição legal.`,
    };
  } else if (v.regraAplicada) {
    conclusao = { tipo: "ENQUADRAMENTO_DETERMINADO", texto: `Enquadramento determinado pelo motor: CST ${v.esperado.cst} e cClassTrib ${v.esperado.cClassTrib} (${v.regraAplicada}).` };
  } else if (v.esperado.cst === TRIBUTACAO_INTEGRAL.cst && v.esperado.cClassTrib === TRIBUTACAO_INTEGRAL.cClassTrib) {
    conclusao = {
      tipo: "REGRA_GERAL_SEM_BENEFICIO",
      texto: `Nenhuma regra de benefício aplicável a este NCM na base, na data da consulta: o motor indica a regra geral, CST ${v.esperado.cst} e cClassTrib ${v.esperado.cClassTrib}.`
        + (temLacuna ? " Atenção: a fonte oficial lista este NCM em código(s) sem regra correspondente na base (lacuna da fonte); nenhuma regra foi criada por isso." : ""),
    };
  } else {
    conclusao = { tipo: "ENQUADRAMENTO_DETERMINADO", texto: `Enquadramento determinado pelo motor: CST ${v.esperado.cst} e cClassTrib ${v.esperado.cClassTrib}.` };
  }

  return {
    ok: true,
    ncm: n.ncm,
    parametros: {
      data: dia(agora), modelo, regime: ctx.empresa.regime, barOuRestaurante: !!ctx.empresa.barOuRestaurante, natureza, naturezaOrigem,
      entrada: String(entrada.ncm), versaoBase: ctx.base.versao,
    },
    obrigatoriedade: obrig ? { obrigatorio: obrig.obrigatorio, fonte: obrig.fonte } : null,
    conclusao,
    encontradoNaBase,
    descricaoNcm: [...new Set(doNcm.map((r) => r.descricaoNcmTipi).filter((x): x is string => !!x))],
    regras,
    veredito: explicado,
    alertas,
    aliquotas,
  };
}
