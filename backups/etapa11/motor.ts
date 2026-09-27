/**
 * Motor de classificação. Decide o CST e o cClassTrib esperados a partir de
 * NCM + natureza do item + regime do emitente + data, e compara com o que o
 * XML informou. Nunca presume: sem dado suficiente o veredito é INDETERMINADO.
 */
import type {
  BaseNormativa,
  Documento,
  Empresa,
  EstadoVeredito,
  ItemDocumento,
  NaturezaItem,
  ParametroAliquota,
  RegraClassificacao,
  RespostaValidacao,
  Veredito,
} from "./tipos.js";
import { ALIQUOTAS, aliquotaVigente, preenchimentoObrigatorio } from "./parametros.js";

export const TRIBUTACAO_INTEGRAL = { cst: "000", cClassTrib: "000001" };
/** Regime específico de bares e restaurantes: art. 275 da LC 214/2025. */
export const BARES_RESTAURANTES = {
  cst: "200",
  cClassTrib: "200047",
  reducao: 0.4,
  fundamento: "LC 214/2025, art. 275",
};

export interface OpcoesMotor {
  base: BaseNormativa;
  empresa: Empresa;
  /** Respostas de validação humana, por NCM + código do produto + regra. */
  validacoes?: RespostaValidacao[];
  aliquotas?: ParametroAliquota[];
  /** Aceita a alíquota marcada como projeção quando não há alíquota vigente. */
  aceitarProjecao?: boolean;
  /** Classificação da natureza do item, por código do produto. */
  naturezaPorProduto?: Map<string, NaturezaItem>;
  agora?: string;
  /** Fase 2: regras bloqueadas por incompatibilidade oficial (chave "regraId|ncm"). Nunca são candidatas. */
  regrasBloqueadas?: ReadonlySet<string>;
}

/** Texto do motivo quando o NCM tem regra bloqueada por incompatibilidade oficial. */
export const MOTIVO_BLOQUEIO = "Regra bloqueada por incompatibilidade oficial do NCM com este enquadramento";

function semZeros(v: string | null): string | null {
  if (v === null) return null;
  const s = v.replace(/^0+/, "");
  return s === "" ? "0" : s;
}

function mesmoCodigo(a: string | null, b: string | null): boolean {
  return semZeros(a) === semZeros(b);
}

function regrasVigentes(base: BaseNormativa, ncm: string, data: string): RegraClassificacao[] {
  const dia = data.slice(0, 10);
  return base.regras.filter(
    (r) => r.ncm === ncm && r.vigenciaInicio <= dia && (r.vigenciaFim === null || r.vigenciaFim >= dia),
  );
}

/** Natureza do item: informada no cadastro, ou deduzida só quando é segura. */
export function naturezaDoItem(
  item: ItemDocumento,
  empresa: Empresa,
  mapa?: Map<string, NaturezaItem>,
): NaturezaItem | null {
  if (item.natureza) return item.natureza;
  const doMapa = mapa?.get(item.cProd) ?? mapa?.get(item.xProd);
  if (doMapa) return doMapa;
  // Quem não atende consumo no local vende mercadoria: não há regime específico a aplicar.
  if (!empresa.barOuRestaurante) return "mercadoria";
  return null;
}

export function classificarItem(
  doc: Documento,
  item: ItemDocumento,
  opcoes: OpcoesMotor,
): Veredito {
  const agora = opcoes.agora ?? new Date().toISOString();
  const faltantes: string[] = [];
  // Fase 2: regras bloqueadas deste item (preenchido na seleção das candidatas); só aparece no veredito quando há
  let idsBloqueados: string[] = [];
  const veredito = (estado: EstadoVeredito, motivo: string, extra: Partial<Veredito> = {}): Veredito => ({
    documento: doc.chave ?? doc.arquivo,
    nItem: item.nItem,
    cProd: item.cProd,
    produto: item.xProd,
    ncm: item.ncm,
    informado: { cst: item.cst, cClassTrib: item.cClassTrib },
    esperado: null,
    estado,
    motivo,
    regraAplicada: null,
    regrasCandidatas: [],
    baseCalculo: item.baseCalculo ?? item.valorProduto - item.desconto,
    valorIBSInformado: item.valorIBSInformado ?? null,
    valorCBSInformado: item.valorCBSInformado ?? null,
    valorInformadoTotal: item.valorIBSInformado == null && item.valorCBSInformado == null ? null : Number(((item.valorIBSInformado ?? 0) + (item.valorCBSInformado ?? 0)).toFixed(2)),
    valorPago: null,
    valorCorreto: null,
    economiaPotencial: null,
    exposicao: null,
    aliquotaUsada: [],
    dadosFaltantes: faltantes,
    versaoBase: opcoes.base.versao,
    calculadoEm: agora,
    ...extra,
    ...(idsBloqueados.length ? { regrasBloqueadas: idsBloqueados, motivo: motivo.includes(MOTIVO_BLOQUEIO) ? motivo : `${motivo} ${MOTIVO_BLOQUEIO}: ${idsBloqueados.join(", ")}.` } : {}),
  });

  if (!doc.dataEmissao) faltantes.push("data de emissão do documento");
  if (!item.ncm) faltantes.push("NCM do item");
  if (faltantes.length > 0) {
    return veredito("INDETERMINADO", `Falta: ${faltantes.join("; ")}.`);
  }

  const data = doc.dataEmissao ?? agora;
  const ncm = item.ncm ?? "";

  // 1. Preenchimento ainda não exigido na data e no regime?
  const informouAlgo = item.cst !== null || item.cClassTrib !== null;
  if (!informouAlgo) {
    const obrig = preenchimentoObrigatorio(doc.modelo, opcoes.empresa.regime, data);
    if (obrig === null) {
      faltantes.push("modelo do documento ou regime do emitente");
      return veredito("INDETERMINADO", "Não dá para saber se o preenchimento já era exigido.");
    }
    if (!obrig.obrigatorio) {
      return veredito("NAO_OBRIGATORIO", `Grupo IBS/CBS ainda não exigido nesta data. ${obrig.fonte}`);
    }
  }

  // 2. Qual a classificação esperada
  const natureza = naturezaDoItem(item, opcoes.empresa, opcoes.naturezaPorProduto);
  if (natureza === null) {
    faltantes.push(`natureza do item ${item.cProd || item.xProd} (preparado no local, bebida alcoólica ou mercadoria)`);
    return veredito("INDETERMINADO", "Emitente atende consumo no local e a natureza do item não foi informada.");
  }

  const aliquotasNaData = () => {
    const usadas: Veredito["aliquotaUsada"] = [];
    let total = 0;
    for (const tributo of ["CBS", "IBS"] as const) {
      const p = aliquotaVigente(tributo, data, opcoes.aceitarProjecao ?? false, opcoes.aliquotas ?? ALIQUOTAS);
      if (p) {
        usadas.push({ tributo, aliquota: p.aliquota, fonte: p.fonte, tipo: p.tipo });
        total += p.aliquota;
      } else {
        faltantes.push(`alíquota de referência de ${tributo} vigente em ${data.slice(0, 10)}`);
      }
    }
    return { usadas, total };
  };

  if (natureza === "preparado_no_local") {
    const esperado = { cst: BARES_RESTAURANTES.cst, cClassTrib: BARES_RESTAURANTES.cClassTrib };
    const ok = mesmoCodigo(item.cst, esperado.cst) && mesmoCodigo(item.cClassTrib, esperado.cClassTrib);
    const regime = `Regime específico de bares e restaurantes (${BARES_RESTAURANTES.fundamento}): redução de 40%.`;
    const { usadas, total } = aliquotasNaData();
    const base = item.baseCalculo ?? item.valorProduto - item.desconto;
    const valorCheio = usadas.length === 2 ? base * total : null;
    const comum = { esperado, regraAplicada: BARES_RESTAURANTES.fundamento, baseCalculo: base, aliquotaUsada: usadas };
    if (!informouAlgo) {
      return veredito("INCORRETO_RISCO", `Grupo IBS/CBS exigido e não informado no documento. ${regime}`, comum);
    }
    if (ok) {
      return veredito("CORRETO", regime, { ...comum, valorPago: valorCheio, valorCorreto: valorCheio, economiaPotencial: 0 });
    }
    if (mesmoCodigo(item.cClassTrib, TRIBUTACAO_INTEGRAL.cClassTrib)) {
      // Tributação integral no lugar da redução de 40%: imposto pago a mais.
      const economia = valorCheio === null ? null : valorCheio * BARES_RESTAURANTES.reducao;
      return veredito("INCORRETO_ECONOMIA", `${regime} O documento usa tributação integral.`, {
        ...comum, valorPago: valorCheio, valorCorreto: valorCheio === null || economia === null ? null : valorCheio - economia, economiaPotencial: economia,
      });
    }
    // Outro benefício no lugar do regime: redução maior que 40% é imposto a menor.
    const informado = item.cClassTrib ? opcoes.base.catalogoCodigos[semZeros(item.cClassTrib)!.padStart(6, "0")] : undefined;
    const exposicao = valorCheio !== null && informado ? valorCheio * Math.max(0, informado.reducao - BARES_RESTAURANTES.reducao) : null;
    return veredito("INCORRETO_RISCO", `Código ${item.cClassTrib} informado no lugar do regime específico. ${regime}`, { ...comum, exposicao });
  }

  const vigentes = natureza === "bebida_alcoolica" || natureza === "servico"
    ? []
    : regrasVigentes(opcoes.base, ncm, data);
  // 2b. Fase 2: regra oficialmente incompatível com o NCM não é candidata (antes da validação e das aplicáveis)
  const bloqueadas = opcoes.regrasBloqueadas ? vigentes.filter((r) => opcoes.regrasBloqueadas!.has(`${r.id}|${r.ncm}`)) : [];
  const candidatas = bloqueadas.length ? vigentes.filter((r) => !bloqueadas.includes(r)) : vigentes;
  idsBloqueados = bloqueadas.map((r) => r.id);

  // 3. Validação humana filtra as candidatas
  const validacoes = (opcoes.validacoes ?? []).filter(
    (v) => v.ncm === ncm && (v.cProd === item.cProd || v.cProd === item.xProd),
  );
  const negadas = new Set(validacoes.filter((v) => v.resposta === "NAO").map((v) => v.regraId));
  const aprovadas = new Set(validacoes.filter((v) => v.resposta === "SIM").map((v) => v.regraId));
  const aplicaveis = candidatas.filter((r) => !negadas.has(r.id));
  const confirmadas = aplicaveis.filter((r) => aprovadas.has(r.id));

  const ids = candidatas.map((r) => r.id);
  let escolhida: RegraClassificacao | null = null;
  let estadoBase: EstadoVeredito | null = null;
  let motivo = "";

  if (aplicaveis.length === 0) {
    escolhida = null;
    motivo =
      candidatas.length > 0
        ? "Todas as regras do NCM foram descartadas na validação: o produto não se enquadra na descrição legal."
        : bloqueadas.length > 0
          ? `Nenhuma regra de benefício aplicável: ${MOTIVO_BLOQUEIO} (${idsBloqueados.join(", ")}).`
          : "Nenhuma regra de benefício cadastrada para este NCM nesta data.";
  } else if (confirmadas.length === 1) {
    escolhida = confirmadas[0]!;
    motivo = `Benefício confirmado na validação: ${escolhida.rotulo} (${escolhida.fundamentoLegal}).`;
  } else if (confirmadas.length > 1) {
    estadoBase = "REQUER_VALIDACAO";
    motivo = `Mais de um benefício confirmado para o mesmo item: ${confirmadas
      .map((r) => `${r.cClassTrib} (Anexo ${r.anexo})`)
      .join(", ")}. É preciso escolher um.`;
  } else {
    // Sem resposta humana ainda: a descrição legal precisa ser conferida.
    estadoBase = "REQUER_VALIDACAO";
    const resumo = aplicaveis.map((r) => `${r.cClassTrib} (Anexo ${r.anexo}, item ${r.item || "?"})`);
    motivo =
      aplicaveis.length > 1
        ? `NCM com ${aplicaveis.length} enquadramentos possíveis: ${resumo.join(
            ", ",
          )}. A composição do produto decide qual vale.`
        : `Enquadramento possível em ${resumo[0]}, sujeito à conferência da descrição legal.`;
  }

  const esperado = escolhida
    ? { cst: escolhida.cst, cClassTrib: escolhida.cClassTrib }
    : TRIBUTACAO_INTEGRAL;

  // 4. Alíquotas vigentes na data
  const { usadas, total: aliquotaTotal } = aliquotasNaData();

  const base = item.baseCalculo ?? item.valorProduto - item.desconto;
  const reducao = escolhida?.reducaoAliquota ?? 0;

  // 5. Comparação e efeito financeiro
  const informadoCorreto =
    mesmoCodigo(item.cst, esperado.cst) && mesmoCodigo(item.cClassTrib, esperado.cClassTrib);

  if (!informouAlgo) {
    return veredito("INCORRETO_RISCO", "Grupo IBS/CBS exigido e não informado no documento.", {
      esperado,
      regraAplicada: escolhida?.id ?? null,
      regrasCandidatas: ids,
      baseCalculo: base,
      aliquotaUsada: usadas,
    });
  }

  if (estadoBase === "REQUER_VALIDACAO") {
    const economia = usadas.length === 2 ? base * aliquotaTotal * (aplicaveis[0]?.reducaoAliquota ?? 0) : null;
    const jaUsado = aplicaveis.find((r) => mesmoCodigo(item.cClassTrib, r.cClassTrib));
    const complemento = jaUsado
      ? ` O documento já usa ${jaUsado.cClassTrib}: falta confirmar que o produto atende à descrição legal e às vedações do Anexo ${jaUsado.anexo}.`
      : "";
    const valorPago = usadas.length === 2 ? base * aliquotaTotal : null;
    return veredito("REQUER_VALIDACAO", motivo + complemento, {
      esperado: null,
      regrasCandidatas: ids,
      baseCalculo: base,
      valorPago,
      valorCorreto: null,
      economiaPotencial: null,
      aliquotaUsada: usadas,
    });
  }

  if (informadoCorreto) {
    return veredito("CORRETO", motivo || "Códigos conferem com a regra aplicável.", {
      esperado,
      regraAplicada: escolhida?.id ?? null,
      regrasCandidatas: ids,
      baseCalculo: base,
      valorPago: usadas.length === 2 ? base * aliquotaTotal : null,
      valorCorreto: usadas.length === 2 ? base * aliquotaTotal : null,
      economiaPotencial: 0,
      aliquotaUsada: usadas,
    });
  }

  // Usou benefício que a regra não ampara: imposto a menor, exposição.
  const usouBeneficio = !mesmoCodigo(item.cClassTrib, TRIBUTACAO_INTEGRAL.cClassTrib);
  const deveriaTerBeneficio = escolhida !== null;
  if (usouBeneficio && !deveriaTerBeneficio) {
    const exposicao = usadas.length === 2 ? base * aliquotaTotal : null;
    return veredito(
      "INCORRETO_RISCO",
      `Código ${item.cClassTrib} informado sem regra que o ampare para o NCM ${ncm}. ${motivo}`,
      { esperado, regrasCandidatas: ids, baseCalculo: base, exposicao, aliquotaUsada: usadas },
    );
  }

  const valorPago = usadas.length === 2 ? base * aliquotaTotal : null;
  const economia = valorPago === null ? null : valorPago * reducao;
  const valorCorreto = valorPago === null || economia === null ? null : valorPago - economia;
  return veredito("INCORRETO_ECONOMIA", motivo || "Benefício aplicável não foi utilizado.", {
    esperado,
    regraAplicada: escolhida?.id ?? null,
    regrasCandidatas: ids,
    baseCalculo: base,
    valorPago,
    valorCorreto,
    economiaPotencial: economia,
    aliquotaUsada: usadas,
  });
}

export function classificarDocumentos(docs: Documento[], opcoes: OpcoesMotor): Veredito[] {
  const saida: Veredito[] = [];
  for (const doc of docs) for (const item of doc.itens) saida.push(classificarItem(doc, item, opcoes));
  return saida;
}


















