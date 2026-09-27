/** Indicadores do painel, calculados a partir dos vereditos. */
import type { EstadoVeredito, Veredito } from "./tipos.js";

export interface Indicadores {
  itens: number;
  faturamento: number;
  porEstado: Record<EstadoVeredito, { itens: number; base: number }>;
  percentualConformidade: number | null;
  /** Itens avaliáveis: exclui NAO_OBRIGATORIO e INDETERMINADO. */
  itensAvaliados: number;
  codigosAvaliados: number;
  codigosCorretos: number;
  codigosIncorretos: number;
  codigosPendentes: number;
  valorIBSInformadoTotal: number | null;
  valorCBSInformadoTotal: number | null;
  valorInformadoTotal: number | null;
  valorPagoTotal: number;
  valorCorretoTotal: number;
  economiaPotencial: number;
  exposicao: number;
  pendentesDeValidacao: number;
  aliquotasUsadas: { tributo: string; aliquota: number; tipo: string; fonte: string }[];
  alertas: string[];
  versaoBase: string | null;
}

const ESTADOS: EstadoVeredito[] = [
  "CORRETO",
  "INCORRETO_ECONOMIA",
  "INCORRETO_RISCO",
  "REQUER_VALIDACAO",
  "NAO_OBRIGATORIO",
  "INDETERMINADO",
];

export function calcularIndicadores(vereditos: Veredito[]): Indicadores {
  const porEstado = Object.fromEntries(
    ESTADOS.map((e) => [e, { itens: 0, base: 0 }]),
  ) as Indicadores["porEstado"];

  let faturamento = 0;
  let economia = 0;
  let exposicao = 0;
  let valorIBSInformadoTotal = 0;
  let valorCBSInformadoTotal = 0;
  let temIBSInformado = false;
  let temCBSInformado = false;
  let valorPagoTotal = 0;
  let valorCorretoTotal = 0;

  const aliquotas = new Map<string, { tributo: string; aliquota: number; tipo: string; fonte: string }>();
  const faltas = new Map<string, number>();

  const codigos = new Map<string, {
    correto: boolean;
    incorreto: boolean;
    pendente: boolean;
    avaliavel: boolean;
  }>();

  for (const v of vereditos) {
    porEstado[v.estado].itens += 1;
    porEstado[v.estado].base += v.baseCalculo;
    faturamento += v.baseCalculo;
    economia += v.economiaPotencial ?? 0;
    exposicao += v.exposicao ?? 0;
    if (v.valorIBSInformado != null) { valorIBSInformadoTotal += v.valorIBSInformado; temIBSInformado = true; }
    if (v.valorCBSInformado != null) { valorCBSInformadoTotal += v.valorCBSInformado; temCBSInformado = true; }
    valorPagoTotal += v.valorPago ?? 0;
    valorCorretoTotal += v.valorCorreto ?? 0;

    for (const a of v.aliquotaUsada) {
      aliquotas.set(`${a.tributo}|${a.aliquota}|${a.tipo}`, a);
    }

    for (const f of v.dadosFaltantes) {
      faltas.set(f, (faltas.get(f) ?? 0) + 1);
    }

    const chaveCodigo = v.cProd || `${v.ncm}|${v.produto}`;
    const atual = codigos.get(chaveCodigo) ?? {
      correto: false,
      incorreto: false,
      pendente: false,
      avaliavel: false,
    };

    if (v.estado === "CORRETO") {
      atual.correto = true;
      atual.avaliavel = true;
    }

    if (v.estado === "INCORRETO_ECONOMIA" || v.estado === "INCORRETO_RISCO") {
      atual.incorreto = true;
      atual.avaliavel = true;
    }

    if (v.estado === "REQUER_VALIDACAO") {
      atual.pendente = true;
      atual.avaliavel = true;
    }

    codigos.set(chaveCodigo, atual);
  }

  let codigosCorretos = 0;
  let codigosIncorretos = 0;
  let codigosPendentes = 0;

  for (const codigo of codigos.values()) {
    if (codigo.pendente) {
      codigosPendentes += 1;
    } else if (codigo.incorreto) {
      codigosIncorretos += 1;
    } else if (codigo.correto) {
      codigosCorretos += 1;
    }
  }

  const codigosAvaliados =
    codigosCorretos + codigosIncorretos + codigosPendentes;

  const itensAvaliados =
    porEstado.CORRETO.itens +
    porEstado.INCORRETO_ECONOMIA.itens +
    porEstado.INCORRETO_RISCO.itens +
    porEstado.REQUER_VALIDACAO.itens;

  const alertas: string[] = [];

  for (const [falta, qtd] of [...faltas].sort((a, b) => b[1] - a[1])) {
    alertas.push(`${qtd} ${qtd === 1 ? "item depende" : "itens dependem"} de: ${falta}`);
  }

  if ([...aliquotas.values()].some((a) => a.tipo === "projecao")) {
    alertas.push("Ha valores calculados com aliquota de projecao, nao com aliquota publicada.");
  }

  return {
    itens: vereditos.length,
    faturamento: Number(faturamento.toFixed(2)),
    porEstado,
    itensAvaliados,
    codigosAvaliados,
    codigosCorretos,
    codigosIncorretos,
    codigosPendentes,
    valorIBSInformadoTotal: temIBSInformado ? Number(valorIBSInformadoTotal.toFixed(2)) : null,
    valorCBSInformadoTotal: temCBSInformado ? Number(valorCBSInformadoTotal.toFixed(2)) : null,
    valorInformadoTotal: temIBSInformado || temCBSInformado ? Number((valorIBSInformadoTotal + valorCBSInformadoTotal).toFixed(2)) : null,
    valorPagoTotal: Number(valorPagoTotal.toFixed(2)),
    valorCorretoTotal: Number(valorCorretoTotal.toFixed(2)),
    percentualConformidade:
      codigosAvaliados === 0 ? null : codigosCorretos / codigosAvaliados,
    economiaPotencial: Number(economia.toFixed(2)),
    exposicao: Number(exposicao.toFixed(2)),
    pendentesDeValidacao: codigosPendentes,
    aliquotasUsadas: [...aliquotas.values()],
    alertas,
    versaoBase: vereditos[0]?.versaoBase ?? null,
  };
}
/** Fila de validação: um par produto + NCM por vez, com a descrição legal de cada regra. */
export interface PendenciaValidacao {
  ncm: string;
  cProd: string;
  produto: string;
  itens: number;
  base: number;
  regras: string[];
  motivo: string;
}

export function filaDeValidacao(vereditos: Veredito[]): PendenciaValidacao[] {
  const mapa = new Map<string, PendenciaValidacao>();
  for (const v of vereditos) {
    if (v.estado !== "REQUER_VALIDACAO" || !v.ncm) continue;
    const chave = v.cProd;
    const atual = mapa.get(chave);
    if (atual) {
      atual.itens += 1;
      atual.base = Number((atual.base + v.baseCalculo).toFixed(2)); atual.regras = [...new Set([...atual.regras, ...v.regrasCandidatas])];
    } else {
      mapa.set(chave, {
        ncm: v.ncm,
        cProd: v.cProd,
        produto: v.produto,
        itens: 1,
        base: v.baseCalculo,
        regras: v.regrasCandidatas,
        motivo: v.motivo,
      });
    }
  }
  return [...mapa.values()].sort((a, b) => b.base - a.base);
}










