/**
 * Reprodução fiel da planilha "Conformidade por XML V4.1", com os defeitos
 * preservados. Serve só para regressão: mostrar que o novo sistema entende a
 * ferramenta antiga e explicar cada diferença de número.
 *
 * Fonte da lógica: consultas Power Query Base_CBS, Saidas_tratadas e
 * Validacao_Beneficios, e fórmulas da aba Conformidade.
 */
import type { BaseNormativa } from "./tipos.js";

export interface ItemLegado {
  produto: string;
  ncm: string;
  valor: number;
  cst?: string | null;
  cClassTrib?: string | null;
}

export interface LinhaLegado extends ItemLegado {
  cstEsperado: string | null;
  cClassTribEsperado: string | null;
  percentualEconomia: number | null;
  resultado: "CORRETO" | "INCORRETO" | "NÃO INFORMADO" | null;
  economiaPotencial: number | null;
}

const PCT = { reducao_60: 0.054, aliquota_zero: 0.09 } as const;

function semZeros(v: string | null | undefined): string | null {
  if (v === undefined || v === null || v === "") return null;
  const s = String(v).replace(/^0+/, "");
  return s === "" ? "0" : s;
}

/** LEFT JOIN por NCM, com a duplicação de linhas da planilha (defeito D01). */
export function rodarLegado(itens: ItemLegado[], base: BaseNormativa): LinhaLegado[] {
  const porNcm = new Map<string, { cst: string; cClassTrib: string; pct: number }[]>();
  for (const r of base.regras) {
    const pct = r.tratamento === "aliquota_zero" ? PCT.aliquota_zero : PCT.reducao_60;
    const lista = porNcm.get(r.ncm) ?? [];
    lista.push({ cst: r.cst, cClassTrib: r.cClassTrib, pct });
    porNcm.set(r.ncm, lista);
  }

  const saida: LinhaLegado[] = [];
  for (const item of itens) {
    const ncm = String(item.ncm ?? "").trim().padStart(8, "0");
    const regras = porNcm.get(ncm);
    const candidatas = regras && regras.length > 0 ? regras : [null];
    for (const regra of candidatas) {
      const cstEsperado = regra ? regra.cst.padStart(3, "0") : "000";
      const cClassTribEsperado = regra ? regra.cClassTrib.padStart(6, "0") : "000001";
      const informouAlgo = !!item.cst && !!item.cClassTrib;
      const resultado = !ncm
        ? null
        : !informouAlgo
          ? "NÃO INFORMADO"
          : semZeros(item.cst) === semZeros(cstEsperado) &&
              semZeros(item.cClassTrib) === semZeros(cClassTribEsperado)
            ? "CORRETO"
            : "INCORRETO";
      const pct = regra ? regra.pct : null;
      saida.push({
        ...item,
        ncm,
        cstEsperado,
        cClassTribEsperado,
        percentualEconomia: pct,
        resultado,
        economiaPotencial: resultado === "INCORRETO" ? (pct === null ? null : item.valor * pct) : 0,
      });
    }
  }
  return saida;
}

export interface IndicadoresLegado {
  total: number;
  corretos: number;
  incorretos: number;
  naoInformados: number;
  percentualConformidade: number;
  ncmsDistintos: number;
  faturamento: number;
  situacao: string;
  economiaEstimada: number;
}

/** Fórmulas da aba Conformidade, incluindo o efeito das respostas SIM/NÃO. */
export function indicadoresLegado(
  linhas: LinhaLegado[],
  validadas: { ncm: string; produto: string; resposta: "SIM" | "NAO" }[] = [],
): IndicadoresLegado {
  const chave = (n: string, p: string) => `${n}|${p}`;
  const sim = new Set(validadas.filter((v) => v.resposta === "SIM").map((v) => chave(v.ncm, v.produto)));
  const nao = new Set(validadas.filter((v) => v.resposta === "NAO").map((v) => chave(v.ncm, v.produto)));

  const total = linhas.filter((l) => l.resultado !== null).length;
  const incorretosNao = linhas.filter((l) => l.resultado === "INCORRETO" && nao.has(chave(l.ncm, l.produto))).length;
  const corretos = linhas.filter((l) => l.resultado === "CORRETO").length + incorretosNao;
  const incorretos = linhas.filter((l) => l.resultado === "INCORRETO").length - incorretosNao;
  const naoInformados = linhas.filter((l) => l.resultado === "NÃO INFORMADO").length;
  const pct = total === 0 ? 0 : corretos / total;
  const situacao =
    pct >= 0.98 ? "EXCELENTE" : pct >= 0.95 ? "MUITO BOA" : pct >= 0.9 ? "BOA" : pct >= 0.8 ? "ATENÇÃO" : "CRÍTICA";
  return {
    total,
    corretos,
    incorretos,
    naoInformados,
    percentualConformidade: pct,
    ncmsDistintos: new Set(linhas.map((l) => l.ncm)).size,
    faturamento: Number(linhas.reduce((s, l) => s + l.valor, 0).toFixed(2)),
    situacao,
    economiaEstimada: Number(
      linhas
        .filter((l) => sim.has(chave(l.ncm, l.produto)))
        .reduce((s, l) => s + (l.economiaPotencial ?? 0), 0)
        .toFixed(2),
    ),
  };
}
