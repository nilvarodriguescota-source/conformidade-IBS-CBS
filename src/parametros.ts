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
