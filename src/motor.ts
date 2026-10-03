/**
 * Motor de classificação. Decide o CST e o cClassTrib esperados a partir de
 * NCM + natureza do item + regime do emitente + data, e compara com o que o
 * XML informou. Nunca presume: sem dado suficiente o item vai para validação humana (REQUER_VALIDACAO),
 * com o dado que falta em dadosFaltantes.
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
  EscolhaValidacao,
  RegraNaoAplicavel,
  Veredito,
} from "./tipos.js";
import { requisitoNaoAtendido } from "./requisitos-legais.js";
import { ALIQUOTAS, aliquotaVigente, indicioNcm, observacoesEspecificas, preenchimentoObrigatorio } from "./parametros.js";

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

/**
 * Escolha de múltipla escolha vigente para o produto neste NCM: vale a última ação
 * registrada (as respostas são gravadas em ordem). Um SIM dado depois de uma
 * escolha a substitui.
 */
export function escolhaDoProduto(
  validacoes: RespostaValidacao[] | undefined,
  ncm: string,
  item: ItemDocumento,
): EscolhaValidacao | null {
  const doProduto = (validacoes ?? []).filter((v) => v.ncm === ncm && (v.cProd === item.cProd || v.cProd === item.xProd));
  return doProduto[doProduto.length - 1]?.escolha ?? null;
}

function pctRegra(r: number): string {
  return `${Math.round(r * 100)}%`;
}

/** Explicação ao usuário: regra encontrada pelo NCM, redução prevista, resultado e motivo. */
export function explicarRegraNaoAplicavel(r: RegraClassificacao, designacao: string, produto: string, ncm: string): string {
  const ncmFmt = ncm.length === 8 ? `${ncm.slice(0, 4)}.${ncm.slice(4, 6)}.${ncm.slice(6)}` : ncm;
  return (
    `Regra encontrada pelo NCM: CST ${r.cst} / cClassTrib ${r.cClassTrib} / Anexo ${r.anexo} / Item ${r.item || "?"}. ` +
    `Redução prevista na regra: ${pctRegra(r.reducaoAliquota)} IBS / ${pctRegra(r.reducaoAliquota)} CBS. ` +
    `Resultado da validação: NÃO APLICÁVEL AO PRODUTO. ` +
    `Motivo: o benefício do Item ${r.item || "?"} do Anexo ${r.anexo} é específico para ${designacao}. ` +
    `Embora o produto esteja classificado no NCM ${ncmFmt}, a descrição informada é "${produto}", que não atende, por si só, à descrição legal da regra. ` +
    `A redução de ${pctRegra(r.reducaoAliquota)} NÃO deve ser aplicada.`
  );
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
  // Validação humana indicou NCM errado: o veredito sai marcado para correção do cadastro
  let ncmACorrigir = false;
  // Regras encontradas pelo NCM e rejeitadas para o produto (descrição legal específica não atendida)
  let regrasNaoAplicaveis: RegraNaoAplicavel[] = [];
  // Tratamentos específicos (Imposto Seletivo) e indício de NCM divergente: só informação, no motivo
  const notas = [
    ...observacoesEspecificas(item.ncm, doc.dataEmissao ?? agora).map((o) => `${o.texto} Fonte: ${o.fonte}.${o.emVigor ? "" : " Ainda não vigente na data do documento."}`),
    ...[indicioNcm(item.ncm, item.xProd)].filter((x): x is string => !!x),
  ];
  const comNotas = (v: Veredito): Veredito => (notas.length ? { ...v, motivo: `${v.motivo} ${notas.join(" ")}` } : v);
  const veredito = (estado: EstadoVeredito, motivo: string, extra: Partial<Veredito> = {}): Veredito => comNotas({
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
    economiaSujeitaValidacao: null,
    exposicao: null,
    aliquotaUsada: [],
    dadosFaltantes: faltantes,
    versaoBase: opcoes.base.versao,
    calculadoEm: agora,
    ...extra,
    ...(ncmACorrigir ? { ncmACorrigir: true } : {}),
    ...(regrasNaoAplicaveis.length ? { regrasNaoAplicaveis } : {}),
    ...(idsBloqueados.length ? { regrasBloqueadas: idsBloqueados, motivo: motivo.includes(MOTIVO_BLOQUEIO) ? motivo : `${motivo} ${MOTIVO_BLOQUEIO}: ${idsBloqueados.join(", ")}.` } : {}),
  });

  if (!doc.dataEmissao) faltantes.push("data de emissão do documento");
  if (!item.ncm) faltantes.push("NCM do item");
  if (faltantes.length > 0) {
    return veredito("REQUER_VALIDACAO", `Falta: ${faltantes.join("; ")}. O enquadramento depende de validação humana.`);
  }

  const data = doc.dataEmissao ?? agora;
  const ncm = item.ncm ?? "";

  // 1. Preenchimento ainda não exigido na data e no regime?
  const informouAlgo = item.cst !== null || item.cClassTrib !== null;
  if (!informouAlgo) {
    const obrig = preenchimentoObrigatorio(doc.modelo, opcoes.empresa.regime, data);
    if (obrig === null) {
      faltantes.push("modelo do documento ou regime do emitente");
      return veredito("REQUER_VALIDACAO", "Grupo IBS/CBS ausente e não dá para saber se o preenchimento já era exigido: validação humana.");
    }
    if (!obrig.obrigatorio) {
      return veredito("NAO_OBRIGATORIO", `Grupo IBS/CBS ainda não exigido nesta data. ${obrig.fonte}`);
    }
  }

  // 2. Qual a classificação esperada. A escolha "consumo no local" feita na validação
  // humana vale como natureza do produto (regime de bares e restaurantes, art. 275).
  const escolha = escolhaDoProduto(opcoes.validacoes, ncm, item);
  ncmACorrigir = escolha === "NCM_INCORRETO";
  const natureza = escolha === "CONSUMO_NO_LOCAL" ? "preparado_no_local" : naturezaDoItem(item, opcoes.empresa, opcoes.naturezaPorProduto);
  if (natureza === null) {
    faltantes.push(`natureza do item ${item.cProd || item.xProd} (preparado no local, bebida alcoólica ou mercadoria)`);
    return veredito("REQUER_VALIDACAO", "Emitente atende consumo no local e a natureza do item não foi informada: validação humana (consumo no local, bebida alcoólica ou mercadoria).");
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
  const aplicaveisPelaValidacao = candidatas.filter((r) => !negadas.has(r.id));

  // 3b. Regra encontrada ≠ benefício aplicável. O NCM só localiza a regra; quando a lei descreve um produto
  // específico e a descrição do produto a contradiz, a regra não se aplica a este produto e o percentual dela
  // não entra em nenhum valor. Um SIM humano registrado prevalece (a pessoa conhece o produto).
  const rejeitadas = aplicaveisPelaValidacao
    .filter((r) => !aprovadas.has(r.id))
    .map((r) => ({ r, req: requisitoNaoAtendido(item.xProd, r.descricaoLegal, r.descricaoNcmTipi) }))
    .filter((x): x is { r: RegraClassificacao; req: NonNullable<ReturnType<typeof requisitoNaoAtendido>> } => x.req !== null);
  regrasNaoAplicaveis = rejeitadas.map(({ r, req }) => ({
    regraId: r.id,
    cst: r.cst,
    cClassTrib: r.cClassTrib,
    anexo: r.anexo,
    item: r.item,
    fundamentoLegal: r.fundamentoLegal,
    reducaoPrevista: r.reducaoAliquota,
    designacaoLegal: req.designacaoLegal,
    motivo: explicarRegraNaoAplicavel(r, req.designacaoLegal, item.xProd, ncm),
  }));
  const aplicaveis = aplicaveisPelaValidacao.filter((r) => !rejeitadas.some((x) => x.r === r));
  const confirmadas = aplicaveis.filter((r) => aprovadas.has(r.id));
  const textoRejeitadas = regrasNaoAplicaveis.map((x) => x.motivo).join(" ");

  const ids = candidatas.map((r) => r.id);
  let escolhida: RegraClassificacao | null = null;
  let estadoBase: EstadoVeredito | null = null;
  let motivo = "";

  if (aplicaveis.length === 0 && rejeitadas.length > 0) {
    // Todas as regras restantes foram rejeitadas pelo requisito legal, sem resposta humana que as descarte:
    // nenhum benefício é concedido e o enquadramento correto fica aguardando validação humana.
    estadoBase = "REQUER_VALIDACAO";
    motivo = `${textoRejeitadas} Nenhuma outra regra de benefício do NCM ${ncm} se aplica automaticamente: o enquadramento aguarda validação humana (consumo no local pelo regime de bares e restaurantes, mercadoria sem benefício ou NCM incorreto).`;
  } else if (aplicaveis.length === 0) {
    escolhida = null;
    motivo =
      candidatas.length > 0
        ? "Todas as regras do NCM foram descartadas na validação: o produto não se enquadra na descrição legal." +
          (escolha === "MERCADORIA_SEM_BENEFICIO"
            ? " Verificado na validação: vendido como mercadoria, com o NCM informado correto; nenhuma outra regra de benefício do NCM se aplica e o regime de bares e restaurantes (art. 275) não vale para mercadoria."
            : escolha === "NCM_INCORRETO"
              ? " A validação indicou que o NCM informado está errado: corrigir o NCM no ERP e reprocessar com as novas notas. Nenhum benefício de outro NCM é aplicado ao NCM informado."
              : "")
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

  // A validação humana indicou que o NCM informado está errado: resultado INCORRETO, com aviso de ajuste
  // do NCM. Nenhum enquadramento é proposto para o NCM informado e nenhum benefício de outro NCM é aplicado.
  if (escolha === "NCM_INCORRETO") {
    return veredito(
      "INCORRETO_NCM",
      `AJUSTAR O NCM: a validação indicou que o NCM ${ncm} informado para "${item.xProd}" está errado. ` +
        "Corrigir o NCM no cadastro do produto no ERP e reprocessar com as novas notas. " +
        "Nenhum enquadramento é proposto para o NCM informado e nenhum benefício de outro NCM é aplicado.",
      { regrasCandidatas: ids, baseCalculo: item.baseCalculo ?? item.valorProduto - item.desconto },
    );
  }

  if (rejeitadas.length > 0 && aplicaveis.length > 0) {
    motivo = `${textoRejeitadas} Reenquadramento entre as demais regras do NCM: ${motivo}`;
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
    const ausente = "Grupo IBS/CBS exigido e não informado no documento.";
    if (estadoBase === "REQUER_VALIDACAO") {
      // O esperado depende da validação: não se presume a regra geral. Exposição = o mínimo devido em
      // qualquer enquadramento possível (a maior redução entre as candidatas).
      // Só regras ainda aplicáveis contam; sem nenhuma, nenhuma redução é presumida (exposição integral).
      const maior = aplicaveis.length ? Math.max(...aplicaveis.map((r) => r.reducaoAliquota)) : 0;
      return veredito("INCORRETO_RISCO", `${ausente} Enquadramento esperado: depende da validação. ${motivo}`, {
        esperado: null,
        regrasCandidatas: ids,
        baseCalculo: base,
        exposicao: usadas.length === 2 ? base * aliquotaTotal * (1 - maior) : null,
        aliquotaUsada: usadas,
      });
    }
    const esperadoTexto = escolhida
      ? `${esperado.cst}/${esperado.cClassTrib} (${escolhida.rotulo}, ${escolhida.fundamentoLegal}).`
      : `${esperado.cst}/${esperado.cClassTrib} (regra geral, sem benefício aplicável).`;
    return veredito("INCORRETO_RISCO", `${ausente} Enquadramento esperado: ${esperadoTexto} ${motivo}`, {
      esperado,
      regraAplicada: escolhida?.id ?? null,
      regrasCandidatas: ids,
      baseCalculo: base,
      exposicao: usadas.length === 2 ? base * aliquotaTotal * (1 - reducao) : null,
      aliquotaUsada: usadas,
    });
  }

  if (estadoBase === "REQUER_VALIDACAO") {
    // Estimativa, não economia realizada: só quando o documento usa a tributação integral, com a menor redução
    // entre as candidatas (se a validação confirmar alguma delas).
    // Estimativa só com regras ainda aplicáveis: regra rejeitada pelo requisito legal não gera economia.
    const menor = aplicaveis.length ? Math.min(...aplicaveis.map((r) => r.reducaoAliquota)) : 0;
    const usaIntegral = mesmoCodigo(item.cClassTrib, TRIBUTACAO_INTEGRAL.cClassTrib);
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
      economiaSujeitaValidacao: usaIntegral && valorPago !== null ? valorPago * menor : null,
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


















