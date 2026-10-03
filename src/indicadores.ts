/** Indicadores do painel, calculados a partir dos vereditos. */
import type { EstadoVeredito, RegraNaoAplicavel, Veredito } from "./tipos.js";

export interface Indicadores {
  itens: number;
  faturamento: number;
  porEstado: Record<EstadoVeredito, { itens: number; base: number }>;
  percentualConformidade: number | null;
  /** Itens avaliáveis: exclui NAO_OBRIGATORIO (e INDETERMINADO de análises antigas). */
  itensAvaliados: number;
  codigosAvaliados: number;
  codigosCorretos: number;
  codigosIncorretos: number;
  /** Códigos corretos com recálculo de imposto (economia ou valor a pagar). */
  codigosRecalculo: number;
  /** Códigos com NCM a ajustar (validação indicou NCM errado). */
  codigosNcmAjustar: number;
  codigosPendentes: number;
  valorIBSInformadoTotal: number | null;
  valorCBSInformadoTotal: number | null;
  valorInformadoTotal: number | null;
  valorPagoTotal: number;
  valorCorretoTotal: number;
  /** Saldo do recálculo: economia (positiva) menos valor a pagar (negativo nos itens). */
  economiaPotencial: number;
  /** Parcela positiva do recálculo: imposto pago a mais. */
  economiaRecalculo: number;
  /** Parcela negativa do recálculo, em valor absoluto: imposto destacado a menos. */
  valorAPagarRecalculo: number;
  /** Estimativa dos itens pendentes de validação (não somada à economia potencial confirmada). */
  economiaSujeitaValidacao: number;
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
  "INCORRETO_NCM",
  "INDETERMINADO",
];

export function calcularIndicadores(vereditos: Veredito[]): Indicadores {
  const porEstado = Object.fromEntries(
    ESTADOS.map((e) => [e, { itens: 0, base: 0 }]),
  ) as Indicadores["porEstado"];

  let faturamento = 0;
  let economia = 0;
  let economiaSujeita = 0;
  let exposicao = 0;
  let economiaPositiva = 0;
  let aPagar = 0;
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
    ncm: boolean;
    pendente: boolean;
    avaliavel: boolean;
  }>();

  for (const v of vereditos) {
    porEstado[v.estado].itens += 1;
    porEstado[v.estado].base += v.baseCalculo;
    faturamento += v.baseCalculo;
    economia += v.economiaPotencial ?? 0;
    if ((v.economiaPotencial ?? 0) > 0) economiaPositiva += v.economiaPotencial!;
    if ((v.economiaPotencial ?? 0) < 0) aPagar -= v.economiaPotencial!;
    economiaSujeita += v.economiaSujeitaValidacao ?? 0;
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
      ncm: false,
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

    // NCM a ajustar (validação indicou NCM errado): continua sendo um código avaliado
    if (v.estado === "INCORRETO_NCM") {
      atual.ncm = true;
      atual.avaliavel = true;
    }

    if (v.estado === "REQUER_VALIDACAO") {
      atual.pendente = true;
      atual.avaliavel = true;
    }

    codigos.set(chaveCodigo, atual);
  }

  let codigosCorretos = 0;
  let codigosRecalculo = 0;
  let codigosNcmAjustar = 0;
  let codigosPendentes = 0;

  // Cada código em uma única categoria (pendente > NCM a ajustar > correto c/ recálculo > correto):
  // a soma das categorias é sempre igual a codigosAvaliados.
  for (const codigo of codigos.values()) {
    if (codigo.pendente) {
      codigosPendentes += 1;
    } else if (codigo.ncm) {
      codigosNcmAjustar += 1;
    } else if (codigo.incorreto) {
      codigosRecalculo += 1;
    } else if (codigo.correto) {
      codigosCorretos += 1;
    }
  }

  // Incorretos de fato: só o NCM a ajustar (recálculo de imposto é correto com recálculo)
  const codigosIncorretos = codigosNcmAjustar;
  const codigosAvaliados =
    codigosCorretos + codigosRecalculo + codigosNcmAjustar + codigosPendentes;

  const itensAvaliados =
    porEstado.CORRETO.itens +
    porEstado.INCORRETO_ECONOMIA.itens +
    porEstado.INCORRETO_RISCO.itens +
    porEstado.INCORRETO_NCM.itens +
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
    codigosRecalculo,
    codigosNcmAjustar,
    codigosPendentes,
    valorIBSInformadoTotal: temIBSInformado ? Number(valorIBSInformadoTotal.toFixed(2)) : null,
    valorCBSInformadoTotal: temCBSInformado ? Number(valorCBSInformadoTotal.toFixed(2)) : null,
    valorInformadoTotal: temIBSInformado || temCBSInformado ? Number((valorIBSInformadoTotal + valorCBSInformadoTotal).toFixed(2)) : null,
    valorPagoTotal: Number(valorPagoTotal.toFixed(2)),
    valorCorretoTotal: Number(valorCorretoTotal.toFixed(2)),
    percentualConformidade:
      codigosAvaliados === 0 ? null : codigosCorretos / codigosAvaliados,
    economiaPotencial: Number(economia.toFixed(2)),
    economiaRecalculo: Number(economiaPositiva.toFixed(2)),
    valorAPagarRecalculo: Number(aPagar.toFixed(2)),
    economiaSujeitaValidacao: Number(economiaSujeita.toFixed(2)),
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
  /** Regras encontradas pelo NCM e rejeitadas para o produto (descrição legal específica não atendida). */
  regrasNaoAplicaveis: RegraNaoAplicavel[];
  motivo: string;
}

export function filaDeValidacao(vereditos: Veredito[]): PendenciaValidacao[] {
  const mapa = new Map<string, PendenciaValidacao>();
  for (const v of vereditos) {
    // Risco (grupo ausente) cujo enquadramento depende da validação também recebe a pergunta SIM/NÃO
    // Risco pendente (grupo ausente, enquadramento depende da validação) agora sai como REQUER_VALIDACAO;
    // a condição antiga fica para análises gravadas antes da mudança.
    const riscoPendente = v.estado === "INCORRETO_RISCO" && v.esperado === null && v.regrasCandidatas.length > 0;
    if ((v.estado !== "REQUER_VALIDACAO" && !riscoPendente) || !v.ncm) continue;
    const chave = v.cProd;
    const atual = mapa.get(chave);
    if (atual) {
      atual.itens += 1;
      atual.base = Number((atual.base + v.baseCalculo).toFixed(2)); atual.regras = [...new Set([...atual.regras, ...v.regrasCandidatas])];
      for (const x of v.regrasNaoAplicaveis ?? []) {
        if (!atual.regrasNaoAplicaveis.some((y) => y.regraId === x.regraId)) atual.regrasNaoAplicaveis.push(x);
      }
    } else {
      mapa.set(chave, {
        ncm: v.ncm,
        cProd: v.cProd,
        produto: v.produto,
        itens: 1,
        base: v.baseCalculo,
        regras: v.regrasCandidatas,
        regrasNaoAplicaveis: [...(v.regrasNaoAplicaveis ?? [])],
        motivo: v.motivo,
      });
    }
  }
  return [...mapa.values()].sort((a, b) => b.base - a.base);
}










