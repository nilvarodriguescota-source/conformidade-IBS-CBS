/**
 * Parâmetros com vigência: alíquotas de referência e obrigatoriedade do grupo
 * IBS/CBS no documento fiscal. Nenhum valor é presumido no código: o que não
 * está aqui faz o motor devolver INDETERMINADO.
 */
import type { ParametroAliquota, Regime } from "./tipos.js";

export const ALIQUOTAS: ParametroAliquota[] = [
  {
    tributo: "CBS",
    inicio: "2026-01-01",
    fim: "2026-12-31",
    aliquota: 0.009,
    tipo: "vigente",
    fonte: "LC 214/2025, período de teste de 2026: CBS de 0,9%, compensável com PIS/Cofins; recolhimento dispensado nos termos do art. 348, § 1º, se cumpridas as obrigações acessórias",
  },
  {
    tributo: "IBS",
    inicio: "2026-01-01",
    fim: "2026-12-31",
    aliquota: 0.001,
    tipo: "vigente",
    fonte: "LC 214/2025, período de teste de 2026: IBS de 0,1%",
  },
  // 2027: alíquota de referência da CBS ainda não fixada. O Senado tem até
  // 15/12/2026 para publicá-la. Enquanto não houver ato, fica só a projeção.
  {
    tributo: "CBS",
    inicio: "2027-01-01",
    fim: null,
    aliquota: 0.0943,
    tipo: "projecao",
    fonte: "Estimativa divulgada durante os trabalhos RFB/TCU (set/2026). Não é alíquota oficial.",
  },
];

/** Em 2026 o recolhimento é dispensado se as obrigações acessórias forem cumpridas. */
export const ANOS_COM_DISPENSA = new Set(["2026"]);

export interface RegraObrigatoriedade {
  modelo: string[];
  regimes: Regime[];
  inicio: string;
  fonte: string;
}

export const OBRIGATORIEDADE: RegraObrigatoriedade[] = [
  {
    modelo: ["55", "65"],
    regimes: ["normal"],
    inicio: "2026-08-03",
    fonte: "Ato Conjunto RFB/CGIBS nº 4/2026: cronograma em lotes, NF-e e NFC-e a partir de 03/08/2026",
  },
  {
    modelo: ["55", "65"],
    regimes: ["simples", "mei"],
    inicio: "2027-01-01",
    fonte: "Cronograma: optantes do Simples Nacional a partir de 01/01/2027",
  },
];

export function aliquotaVigente(
  tributo: "CBS" | "IBS",
  data: string,
  aceitarProjecao: boolean,
  tabela: ParametroAliquota[] = ALIQUOTAS,
): ParametroAliquota | null {
  const dia = data.slice(0, 10);
  const candidatos = tabela.filter(
    (p) =>
      p.tributo === tributo &&
      p.inicio <= dia &&
      (p.fim === null || p.fim >= dia) &&
      (aceitarProjecao || p.tipo === "vigente"),
  );
  // Vigente tem precedência sobre projeção no mesmo período.
  candidatos.sort((a, b) => (a.tipo === b.tipo ? 0 : a.tipo === "vigente" ? -1 : 1));
  return candidatos[0] ?? null;
}

export function preenchimentoObrigatorio(
  modelo: string | null,
  regime: Regime,
  data: string | null,
): { obrigatorio: boolean; fonte: string } | null {
  if (!modelo || !data) return null;
  const regra = OBRIGATORIEDADE.find((r) => r.modelo.includes(modelo) && r.regimes.includes(regime));
  if (!regra) return null;
  return { obrigatorio: data.slice(0, 10) >= regra.inicio, fonte: regra.fonte };
}

/**
 * Tratamentos específicos que não mudam o CST/cClassTrib do IBS/CBS, mas precisam aparecer na análise
 * (fonte e vigência de cada um). Só informação: o motor não altera o estado por causa deles.
 */
export interface ObservacaoEspecifica {
  id: string;
  prefixosNcm: string[];
  inicio: string;
  texto: string;
  fonte: string;
}

export const OBSERVACOES_ESPECIFICAS: ObservacaoEspecifica[] = [
  {
    id: "IS-BEBIDAS-ACUCARADAS",
    prefixosNcm: ["22021000"],
    inicio: "2027-01-01",
    texto: "Bebida açucarada do Anexo XVII (2202.10.00): sujeita ao Imposto Seletivo, tributo distinto do IBS/CBS, a partir de 1º/1/2027, cobrado uma única vez no primeiro fornecimento (fabricante ou importador); a revenda não recolhe o imposto e o IBS/CBS segue a regra geral.",
    fonte: "LC 214/2025, arts. 409, § 1º, V, 410 e 412, I, e Anexo XVII; EC 132/2023 (início em 2027); alíquotas a fixar em lei ordinária",
  },
  {
    id: "IS-BEBIDAS-ALCOOLICAS",
    prefixosNcm: ["2203", "2204", "2205", "2206", "2208"],
    inicio: "2027-01-01",
    texto: "Bebida alcoólica do Anexo XVII: sujeita ao Imposto Seletivo, tributo distinto do IBS/CBS, a partir de 1º/1/2027, cobrado uma única vez no primeiro fornecimento; a revenda não recolhe o imposto e o IBS/CBS segue a regra geral. Fica fora do regime de bares e restaurantes.",
    fonte: "LC 214/2025, arts. 273, § 2º, III, 409, § 1º, IV, 410 e 412, I, e Anexo XVII; EC 132/2023 (início em 2027); alíquotas a fixar em lei ordinária",
  },
];

/** Observações específicas do NCM, com a indicação de já estarem ou não em vigor na data do documento. */
export function observacoesEspecificas(ncm: string | null, data: string): (ObservacaoEspecifica & { emVigor: boolean })[] {
  if (!ncm) return [];
  return OBSERVACOES_ESPECIFICAS
    .filter((o) => o.prefixosNcm.some((p) => ncm.startsWith(p)))
    .map((o) => ({ ...o, emVigor: data.slice(0, 10) >= o.inicio }));
}

/**
 * Indícios de NCM incompatível com a descrição (bebidas), pela TIPI. Não trocam o NCM nem o estado:
 * só pedem conferência do cadastro.
 */
export const INDICIOS_NCM: { termo: RegExp; posicoes: string[]; descricao: string }[] = [
  { termo: /\b(CERVEJA|CHOPP?)\b/, posicoes: ["2203"], descricao: "cerveja de malte (posição 22.03)" },
  { termo: /\bVINHO\b/, posicoes: ["2204", "2205"], descricao: "vinho (posições 22.04 e 22.05)" },
  { termo: /\b(VODKA|WHISKY|CACHACA|RUM|GIN|TEQUILA|CAIPIRINHA|CAIPIROSKA|CAIPIRA)\b/, posicoes: ["2208"], descricao: "aguardente/destilado (posição 22.08)" },
  { termo: /\b(REFRIGERANTE|COCA[ -]?COLA|GUARANA|SPRITE|FANTA|PEPSI)\b/, posicoes: ["2202", "2106"], descricao: "refrigerante (posição 22.02)" },
  { termo: /\bAGUA MINERAL\b/, posicoes: ["2201"], descricao: "água mineral (posição 22.01)" },
];
export const FONTE_TIPI = "TIPI (Decreto nº 11.158/2022), Capítulo 22";

/** Indício de NCM divergente, ou null. Bebida com NCM fora do Capítulo 22 ou de posição diferente da descrição. */
export function indicioNcm(ncm: string | null, descricao: string): string | null {
  if (!ncm) return null;
  const d = descricao.normalize("NFD").replace(/[̀-ͯ]/g, "").toUpperCase();
  if (/\bZERO\b.*\bALCOOL\b|\bSEM ALCOOL\b/.test(d)) return null;
  const achado = INDICIOS_NCM.find((i) => i.termo.test(d));
  if (!achado || achado.posicoes.some((p) => ncm.startsWith(p))) return null;
  return `A descrição indica ${achado.descricao}, mas o NCM informado é ${ncm}; conferir a classificação do produto (${FONTE_TIPI}).`;
}
