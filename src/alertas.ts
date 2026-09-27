/**
 * Etapa 9B.1: alertas informativos (docs/etapa9b/especificacao-alertas.md).
 *
 * Derivados SOMENTE dos vereditos explicados (explicacoes.json / explicacaoInformativa).
 * Não leem a base, a v2, as fontes nem a matriz; não conversam com o motor. Um alerta
 * não altera estado, não cria regra, não confirma benefício nem validação humana, não
 * resolve D2 a D7 nem conflito: todo alerta tem `efeito: "somente_exibicao"`.
 *
 * Os tipos ficam aqui porque src/tipos.ts está fora do escopo autorizado da 9B.1.
 */
import type {
  Divergencia, EstadoVeredito, ExplicacaoInformativa, ExplicacaoRegra, FonteDiz, IdDecisao,
  SituacaoMatriz, VereditoExplicado,
} from "./tipos.js";

/** Categoria do alerta. Não é gravidade jurídica. */
export type CategoriaAlerta = "INFORMACAO" | "ATENCAO" | "PENDENCIA" | "CONFLITO" | "LACUNA";

/** Lista fechada de alertas da especificação (18 códigos). */
export const CODIGOS_ALERTA = [
  "MULTIPLAS_REGRAS_CANDIDATAS", "MULTIPLOS_ITENS_DO_ANEXO",
  "REGRA_NAO_LOCALIZADA", "REGRAID_AMBIGUO",
  "SEM_REGRA_NA_BASE", "LACUNA_FONTE_SEM_REGRA",
  "CONFLITO_ENTRE_FONTES", "CONFLITO_PLANILHA_FONTE", "FUNDAMENTO_DIVERGENTE", "FUNDAMENTO_A_REVISAR",
  "VIGENCIA_A_REVISAR", "EVIDENCIA_MISTA",
  "VALIDACAO_LEGADA", "VALIDACAO_HUMANA_NAO_DISPONIVEL",
  "DECISAO_PENDENTE", "CONDICAO_NAO_COMPROVADA",
  "INFORMACAO_OPERACIONAL_SVRS", "ALIQUOTA_PROJETADA",
] as const;
export type CodigoAlerta = (typeof CODIGOS_ALERTA)[number];

type Camada = "FONTE_DIZ" | "SISTEMA_INFERE" | "HUMANO_CONFIRMOU" | "SISTEMA_PODE_DECIDIR";

export interface Alerta {
  /** Estável: código + documento + nItem + referência. */
  id: string;
  codigo: CodigoAlerta;
  categoria: CategoriaAlerta;
  /** Camada da afirmação principal (nunca inferência apresentada como fato). */
  camada: Camada;
  titulo: string;
  mensagem: string;
  item: { documento: string; nItem: number; cProd: string; ncm: string | null };
  /** Cópia do estado, só para exibição ao lado. */
  estadoDoVeredito: EstadoVeredito;
  /** Regras citadas pelo alerta (o regraId não é chave única; índice e linha quando houver vínculo seguro). */
  regras: { regraId: string; indice: number | null; linha: number | null }[];
  nivelEvidencia: ExplicacaoInformativa["nivelEvidencia"];
  /** Limitação da explicação ligada a este alerta, copiada literalmente; null se não houver. */
  limitacao: string | null;
  /** Situações da matriz ligadas ao código e presentes na explicação do item (só citação). */
  situacoesMatriz: SituacaoMatriz[];
  /** Onde a informação está na explicação (ex.: "regras[2].divergencias[0]"). */
  origem: string[];
  decisoes?: IdDecisao[];
  efeito: "somente_exibicao";
}

/** Alerta agregado de lote: um por código (e decisão), com contagem e a lista completa de itens. */
export interface AlertaDeLote {
  codigo: CodigoAlerta;
  categoria: CategoriaAlerta;
  camada: Camada;
  titulo: string;
  mensagem: string;
  itens: number;
  /** Até 5 exemplos, para exibição. */
  exemplos: { documento: string; nItem: number }[];
  /** Todos os itens afetados: o agrupamento só muda a apresentação, nada é descartado. */
  itensAfetados: { documento: string; nItem: number }[];
  decisoes?: IdDecisao[];
  efeito: "somente_exibicao";
}

export interface ResultadoAlertas {
  porItem: Alerta[];
  lote: AlertaDeLote[];
}

// ---------- textos fixos ----------

const TITULO: Record<CodigoAlerta, string> = {
  MULTIPLAS_REGRAS_CANDIDATAS: "Mais de uma regra candidata",
  MULTIPLOS_ITENS_DO_ANEXO: "NCM em mais de um item do anexo",
  REGRA_NAO_LOCALIZADA: "Regra não localizada com segurança",
  REGRAID_AMBIGUO: "Identificador de regra repetido",
  SEM_REGRA_NA_BASE: "Sem regra de benefício na base",
  LACUNA_FONTE_SEM_REGRA: "NCM na fonte oficial sem regra na base",
  CONFLITO_ENTRE_FONTES: "Fontes oficiais divergentes",
  CONFLITO_PLANILHA_FONTE: "Item da base diferente das fontes oficiais",
  FUNDAMENTO_DIVERGENTE: "Fundamento legal diferente das fontes oficiais",
  FUNDAMENTO_A_REVISAR: "Fundamento legal a revisar",
  VIGENCIA_A_REVISAR: "Datas de vigência diferentes nas fontes",
  EVIDENCIA_MISTA: "Níveis de evidência diferentes entre as candidatas",
  VALIDACAO_LEGADA: "Resposta histórica utilizada",
  VALIDACAO_HUMANA_NAO_DISPONIVEL: "Validação humana não registrada",
  DECISAO_PENDENTE: "Definição pendente (ação ainda não disponível)",
  CONDICAO_NAO_COMPROVADA: "Condição da norma não comprovada pelo XML",
  INFORMACAO_OPERACIONAL_SVRS: "Informação operacional do SVRS",
  ALIQUOTA_PROJETADA: "Alíquota projetada",
};
const CATEGORIA: Record<CodigoAlerta, CategoriaAlerta> = {
  MULTIPLAS_REGRAS_CANDIDATAS: "ATENCAO", MULTIPLOS_ITENS_DO_ANEXO: "ATENCAO", REGRA_NAO_LOCALIZADA: "ATENCAO", REGRAID_AMBIGUO: "ATENCAO",
  SEM_REGRA_NA_BASE: "INFORMACAO", LACUNA_FONTE_SEM_REGRA: "LACUNA",
  CONFLITO_ENTRE_FONTES: "CONFLITO", CONFLITO_PLANILHA_FONTE: "CONFLITO", FUNDAMENTO_DIVERGENTE: "CONFLITO", FUNDAMENTO_A_REVISAR: "ATENCAO",
  VIGENCIA_A_REVISAR: "ATENCAO", EVIDENCIA_MISTA: "INFORMACAO", VALIDACAO_LEGADA: "ATENCAO", VALIDACAO_HUMANA_NAO_DISPONIVEL: "PENDENCIA",
  DECISAO_PENDENTE: "PENDENCIA", CONDICAO_NAO_COMPROVADA: "PENDENCIA", INFORMACAO_OPERACIONAL_SVRS: "INFORMACAO", ALIQUOTA_PROJETADA: "INFORMACAO",
};
const CAMADA: Record<CodigoAlerta, Camada> = {
  MULTIPLAS_REGRAS_CANDIDATAS: "SISTEMA_INFERE", MULTIPLOS_ITENS_DO_ANEXO: "FONTE_DIZ", REGRA_NAO_LOCALIZADA: "SISTEMA_INFERE", REGRAID_AMBIGUO: "SISTEMA_INFERE",
  SEM_REGRA_NA_BASE: "SISTEMA_INFERE", LACUNA_FONTE_SEM_REGRA: "FONTE_DIZ",
  CONFLITO_ENTRE_FONTES: "FONTE_DIZ", CONFLITO_PLANILHA_FONTE: "FONTE_DIZ", FUNDAMENTO_DIVERGENTE: "FONTE_DIZ", FUNDAMENTO_A_REVISAR: "FONTE_DIZ",
  // VALIDACAO_LEGADA: classifica o registro e descreve como o motor o usou; não é declaração de fonte normativa.
  VIGENCIA_A_REVISAR: "FONTE_DIZ", EVIDENCIA_MISTA: "SISTEMA_INFERE", VALIDACAO_LEGADA: "SISTEMA_INFERE", VALIDACAO_HUMANA_NAO_DISPONIVEL: "SISTEMA_INFERE",
  DECISAO_PENDENTE: "SISTEMA_PODE_DECIDIR", CONDICAO_NAO_COMPROVADA: "FONTE_DIZ", INFORMACAO_OPERACIONAL_SVRS: "FONTE_DIZ", ALIQUOTA_PROJETADA: "FONTE_DIZ",
};
/** Situação da matriz ligada ao código; só é citada se estiver na explicação do item. */
const SITUACAO: Partial<Record<CodigoAlerta, SituacaoMatriz>> = {
  MULTIPLOS_ITENS_DO_ANEXO: 2, LACUNA_FONTE_SEM_REGRA: 3, CONFLITO_PLANILHA_FONTE: 5, CONFLITO_ENTRE_FONTES: 6, VIGENCIA_A_REVISAR: 7,
  FUNDAMENTO_DIVERGENTE: 8, FUNDAMENTO_A_REVISAR: 8, INFORMACAO_OPERACIONAL_SVRS: 9, CONDICAO_NAO_COMPROVADA: 10, VALIDACAO_LEGADA: 11,
  VALIDACAO_HUMANA_NAO_DISPONIVEL: 12, REGRAID_AMBIGUO: 13, ALIQUOTA_PROJETADA: 14,
};
/** Temas das decisões pendentes (docs/etapa8/fluxo-futuro.md, seção G). */
const TEMA: Record<IdDecisao, string> = {
  D2: "combinação dos tipos de adquirente do 200043: \"e\" na lei, \"ou\" na planilha",
  D3: "política para regras cujo vínculo NCM × item com a fonte oficial não está CONFIRMADO",
  D4: "tratamento do 200043 em NFC-e",
  D5: "inclusão ou não das NCMs oficiais sem regra",
  D6: "tratamento das validações legadas",
  D7: "formato da chave estável da regra",
};
/**
 * Decisões pendentes em linguagem de negócio: o que aconteceu e por que importa.
 * O código (D2…D7) aparece só como referência técnica, no fim da mensagem.
 */
const DECISAO_TEXTO: Record<IdDecisao, { situacao: string; motivo: string }> = {
  D2: { situacao: "A lei e a planilha descrevem de forma diferente quem pode ser o comprador neste benefício: a lei usa “e” e a planilha usa “ou” ao listar administração pública direta, autarquias e fundações.",
    motivo: "Essa definição determina quais compradores dão direito à redução." },
  D3: { situacao: "estes itens têm ao menos uma regra candidata cujo vínculo NCM × item com a fonte oficial não está CONFIRMADO (a conferência apontou divergência, mais de um item possível, ausência nas fontes ou não pôde ser feita).",
    motivo: "Ainda não foi definida a política para esses casos, o que afeta a confiança nos resultados desses itens." },
  D4: { situacao: "Ainda não foi definido como tratar este código quando usado em NFC-e: o SVRS indica que ele não é habilitado para esse modelo de documento.",
    motivo: "Isso afeta apenas documentos modelo 65 (NFC-e)." },
  D5: { situacao: "A NCM consta da fonte oficial para este benefício, mas a base não tem regra correspondente.",
    motivo: "Sem uma regra na base, a avaliação deste item não considera essa fonte oficial; falta definir se a regra deve ser incluída." },
  D6: { situacao: "Existe uma resposta histórica para este item, mas ela não possui confirmação humana com autoria registrada.",
    motivo: "Falta definir como essas respostas históricas devem ser tratadas; hoje o cálculo usa as que correspondem às regras do item." },
  D7: { situacao: "Duas regras da base têm o mesmo identificador, e o sistema não consegue saber a qual delas uma resposta se refere.",
    motivo: "Isso impede associar com segurança uma resposta de validação a uma única regra." },
};
const referencia = (d: IdDecisao): string => `Referência técnica: ${d} — ${TEMA[d]}.`;
/** Ações que a interface atual permite (e o que ela ainda não permite). Nenhuma ação é inventada. */
const SEM_ACAO_DEFINICAO = "No momento, a interface não permite registrar essa definição; a situação permanece pendente até que o fluxo correspondente esteja disponível.";
const ACAO_PENDENCIAS = "Ação disponível: este item aparece na tela de Pendências, onde é possível responder SIM ou NÃO para a regra. Essa resposta passa a ser usada no cálculo, mas hoje é gravada sem autoria (autor fixo \"Sistema\") e não equivale a confirmação humana.";
const SEM_ACAO_CONFIRMACAO = "No momento, a interface não permite concluir essa confirmação para este item; a situação permanece pendente até que o fluxo de validação correspondente esteja disponível.";
/** A fila de Pendências só mostra itens REQUER_VALIDACAO com NCM (indicadores.ts, filaDeValidacao). */
const naFilaDePendencias = (v: { estado: EstadoVeredito; ncm: string | null }): boolean => v.estado === "REQUER_VALIDACAO" && !!v.ncm;
/** Data do registro (AAAA-MM-DD) no formato DD/MM/AAAA; outro formato é mostrado como está. */
const dataBR = (s: string): string => { const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(s); return m ? `${m[3]}/${m[2]}/${m[1]}` : s; };
/** Texto factual aprovado na 9B.0 sobre o autor "Sistema". */
const MOTIVO_LEGADA: Record<string, string> = {
  autor_sistema_nao_e_confirmacao_humana: "a tela de validação envia o autor fixo \"Sistema\" e a rota também grava \"Sistema\" quando não recebe autor; a autoria não foi coletada e não foi reconstruída; o registro não indica decisão automática do sistema nem validação humana comprovada",
  sem_hash_das_fontes_na_data: "há autor e justificativa, mas o registro não guarda o hash das fontes na data da resposta",
  autor_humano_sem_justificativa: "há autor, mas o registro não tem justificativa",
  chave_por_regraid_duplicado: "o registro usa um identificador de regra que corresponde a mais de uma regra",
  chave_por_produto_em_condicao_de_adquirente: "o registro está por produto, e a condição do código é do adquirente",
};
/** Códigos (e decisões) consolidados como alerta de lote (especificação, seção 6). */
const DE_LOTE = new Set(["VALIDACAO_HUMANA_NAO_DISPONIVEL", "DECISAO_PENDENTE:D3", "SEM_REGRA_NA_BASE"]);
const ORDEM: CategoriaAlerta[] = ["CONFLITO", "LACUNA", "PENDENCIA", "ATENCAO", "INFORMACAO"];

// ---------- apoio ----------

const codigoDaRegra = (regraId: string): string | null => /^\d{8}-(\d{6})-/.exec(regraId)?.[1] ?? null;
const dispositivo = (f: FonteDiz): string | null => ("dispositivo" in f.localizacao ? f.localizacao.dispositivo : null);
const ancora = (f: FonteDiz): string | null => ("ancora" in f.localizacao ? f.localizacao.ancora : null);
const refRegra = (r: ExplicacaoRegra) => ({ regraId: r.regraIdInformado, indice: r.referencia?.indice ?? null, linha: r.referencia?.linha ?? null });
const achaLimitacao = (e: ExplicacaoInformativa, trecho: string): string | null => e.limitacoes.find((l) => l.includes(trecho)) ?? null;

/**
 * Fundamento em três partes, sem misturar camadas:
 *   fonte      - o que o SVRS apresenta literalmente (o link) e os dispositivos da LC 214 citados nas evidências;
 *   inferencia - a relação que o sistema fez entre a âncora do link e um dispositivo da LC 214.
 */
function fundamentoPorCamada(d: Divergencia): { fonte: string; inferencia: string } {
  const url = d.valores.find((v) => v.fonte === "F2" && typeof v.valor === "string")?.valor as string | undefined;
  const alvo = url?.split("#")[1];
  const fatosF1 = d.valores.map((v) => v.fato).filter((f): f is FonteDiz => !!f && f.fonte === "F1");
  const dispsF1 = [...new Set(fatosF1.map(dispositivo).filter((x): x is string => !!x))];
  const relacionado = fatosF1.find((f) => ancora(f) === alvo);
  const partes = [
    url ? `o SVRS apresenta o link ${url}` : "o SVRS não apresenta link nas evidências",
    dispsF1.length ? `as evidências da LC 214/2025 citam ${dispsF1.join("; ")}` : "não há dispositivo da LC 214/2025 nas evidências",
  ];
  const inferencia = relacionado && alvo
    ? `O sistema relacionou a âncora "${alvo}" do link ao dispositivo ${dispositivo(relacionado)} da LC 214/2025; o link, sozinho, não identifica parágrafo nem inciso.`
    : "O sistema não relacionou o link a um dispositivo da LC 214/2025.";
  return { fonte: `Nas fontes, ${partes.join(", e ")}.`, inferencia };
}

// ---------- alertas do item ----------

function alertasDoItem(v: VereditoExplicado): Alerta[] {
  const e = v.explicacaoInformativa;
  if (!e) return [];
  const saida: Alerta[] = [];
  const vistos = new Set<string>();
  const add = (codigo: CodigoAlerta, ref: string, mensagem: string, extra: Partial<Pick<Alerta, "regras" | "limitacao" | "origem" | "decisoes">> = {}) => {
    const id = `${codigo}:${v.documento}:${v.nItem}:${ref}`;
    if (vistos.has(id)) return; // deduplicação dentro do item
    vistos.add(id);
    const situacao = SITUACAO[codigo];
    saida.push({
      id, codigo, categoria: CATEGORIA[codigo], camada: CAMADA[codigo], titulo: TITULO[codigo], mensagem,
      item: { documento: v.documento, nItem: v.nItem, cProd: v.cProd, ncm: v.ncm },
      estadoDoVeredito: v.estado,
      regras: extra.regras ?? [],
      nivelEvidencia: e.nivelEvidencia,
      limitacao: extra.limitacao ?? null,
      situacoesMatriz: situacao && e.matriz.situacoes.includes(situacao) ? [situacao] : [],
      origem: extra.origem ?? [],
      ...(extra.decisoes ? { decisoes: extra.decisoes } : {}),
      efeito: "somente_exibicao",
    });
  };

  // A: várias regras candidatas (nenhuma é apontada como a certa)
  if (e.regras.length > 1) {
    const porCodigo = new Map<string, number>();
    for (const r of e.regras) { const c = codigoDaRegra(r.regraIdInformado) ?? "código não identificado"; porCodigo.set(c, (porCodigo.get(c) ?? 0) + 1); }
    const resumo = [...porCodigo].map(([c, n]) => `${n} do ${c}`).join(" e ");
    add("MULTIPLAS_REGRAS_CANDIDATAS", "regras", `Há ${e.regras.length} regras candidatas para este item (${resumo}).`,
      { regras: e.regras.map(refRegra), origem: ["regras"] });
  }

  e.regras.forEach((r, i) => {
    const o = `regras[${i}]`;
    // A′: NCM em vários itens do anexo
    if (r.sinalizadores.includes("DEPENDE_COMPOSICAO_PRODUTO")) {
      const itens = [...new Set(r.fonteDiz.filter((f) => f.fonte === "F1").map(dispositivo).filter((d): d is string => !!d && d.startsWith("Anexo")))];
      const anexo = itens[0]?.match(/^Anexo (\S+),/)?.[1] ?? "";
      const nums = itens.map((d) => d.replace(/^Anexo \S+, item /, ""));
      add("MULTIPLOS_ITENS_DO_ANEXO", `anexo-${anexo}-${nums.join(",")}`,
        `A NCM aparece em ${nums.length} itens do Anexo ${anexo} (${nums.join(", ")}); o item depende da composição do produto.`,
        { regras: [refRegra(r)], origem: [`${o}.fonteDiz`, `${o}.sinalizadores`] });
    }
    // B: não localizada
    if (r.vinculo === "nao_localizado") {
      add("REGRA_NAO_LOCALIZADA", r.regraIdInformado,
        `O identificador ${r.regraIdInformado} não corresponde a uma única regra da base; nenhuma evidência foi vinculada.`,
        { regras: [refRegra(r)], origem: [`${o}.vinculo`], limitacao: achaLimitacao(e, r.regraIdInformado) });
    }
    // C: regraId repetido
    if (r.vinculo === "ambiguo_regraid_duplicado") {
      const d = r.divergencias.find((x) => x.tipo === "regraid_duplicado");
      const linhas = d?.regras.map((x) => x.linha) ?? [];
      add("REGRAID_AMBIGUO", r.regraIdInformado,
        `O identificador ${r.regraIdInformado} corresponde a ${linhas.length} regras (linhas ${linhas.join(" e ")}); nenhuma foi escolhida.`,
        { regras: d?.regras.map((x) => ({ regraId: x.regraId, indice: x.indice, linha: x.linha })) ?? [refRegra(r)], origem: [`${o}.vinculo`, `${o}.divergencias`],
          limitacao: achaLimitacao(e, r.regraIdInformado) });
    }
    // E: conflito entre fontes oficiais
    if (r.statusNormativo === "CONFLITO_ENTRE_FONTES") {
      const d = r.divergencias.find((x) => x.tipo === "ncm_so_na_F1" || x.tipo === "ncm_so_na_F2");
      add("CONFLITO_ENTRE_FONTES", r.regraIdInformado,
        `A LC 214 e o SVRS divergem sobre a NCM ${v.ncm} no ${d?.cClassTrib ?? codigoDaRegra(r.regraIdInformado) ?? ""}; nenhuma fonte foi escolhida.`,
        { regras: [refRegra(r)], origem: [`${o}.statusNormativo`, `${o}.divergencias`], limitacao: achaLimitacao(e, "fontes oficiais divergem") });
    }
    r.divergencias.forEach((d, k) => {
      const od = `${o}.divergencias[${k}]`;
      const base = d.valores.find((x) => x.fonte === "BASE_ATUAL")?.valor;
      // E′: item da planilha diferente das fontes oficiais
      if (d.tipo === "item_divergente") {
        const oficial = [...new Set(d.valores.filter((x) => x.fonte === "F1" && typeof x.valor === "string").map((x) => (x.valor as string).split(" | ")[0]))].join(", ");
        add("CONFLITO_PLANILHA_FONTE", r.regraIdInformado,
          `LC 214 e SVRS associam a NCM ao item ${oficial}; a base (planilha) traz o item ${String(base)}.`, { regras: [refRegra(r)], origem: [od] });
      }
      // E″ / E‴: fundamento
      if (d.tipo === "fundamento_legal") {
        const f = fundamentoPorCamada(d);
        add("FUNDAMENTO_DIVERGENTE", d.cClassTrib ?? r.regraIdInformado,
          `A base cita ${String(base)}. ${f.fonte} ${f.inferencia} Diferença de texto do fundamento; nenhuma citação foi escolhida.`, { regras: [refRegra(r)], origem: [od] });
      }
      if (d.tipo === "fundamento_a_revisar") {
        const f = fundamentoPorCamada(d);
        add("FUNDAMENTO_A_REVISAR", d.cClassTrib ?? r.regraIdInformado,
          `A base cita ${String(base)}. ${f.fonte} ${f.inferencia}`, { regras: [refRegra(r)], origem: [od] });
      }
      // Vigência
      if (d.tipo === "vigencia") {
        const datas = d.valores.map((x) => x.fonte === "BASE_ATUAL" ? `base: ${String(x.valor)}`
          : x.fonte === "F1" ? `LC 214/2025${x.fato && dispositivo(x.fato) ? `, ${dispositivo(x.fato)}` : ""}: “${String(x.valor)}”`
            : `SVRS, início do código: ${String(x.valor)}`);
        add("VIGENCIA_A_REVISAR", d.cClassTrib ?? r.regraIdInformado,
          `As fontes trazem datas diferentes para atributos diferentes (${datas.join("; ")}).`, { regras: [refRegra(r)], origem: [od] });
      }
    });
    // J: condição da norma (uma vez por condição no item)
    r.condicoes.forEach((c, k) => {
      const disp = dispositivo(c.textoOficial);
      let msg = `O benefício depende de uma condição da norma: “${c.textoOficial.trecho ?? ""}” (${disp ? `LC 214/2025, ${disp}` : c.id}). O XML não comprova essa condição.`;
      msg += " Isso importa porque o benefício só se aplica se a condição for atendida, e só uma pessoa pode confirmar isso.";
      if (c.textoPlanilha) msg += ` Texto da planilha (linha ${c.textoPlanilha.linha}, ${c.textoPlanilha.coluna}): “${c.textoPlanilha.valor}”.`;
      if (c.combinacaoDosTipos?.status === "pendente") msg += " A combinação dos tipos de comprador ainda não foi definida (referência técnica: D2).";
      msg += ` ${naFilaDePendencias(v) ? ACAO_PENDENCIAS : SEM_ACAO_CONFIRMACAO}`;
      add("CONDICAO_NAO_COMPROVADA", c.id, msg, {
        regras: e.regras.filter((x) => x.condicoes.some((y) => y.id === c.id)).map(refRegra), origem: [`${o}.condicoes[${k}]`],
        ...(c.combinacaoDosTipos?.status === "pendente" ? { decisoes: ["D2"] as IdDecisao[] } : {}),
      });
    });
  });

  // D / D′: sem regra na base e lacuna
  if (e.lacunas.length) {
    e.lacunas.forEach((l, k) => {
      const f1 = [...new Set(l.fatos.filter((f) => f.fonte === "F1").map(dispositivo).filter((d): d is string => !!d))];
      const locais = [...(l.fatos.some((f) => f.fonte === "F2") ? [`SVRS, lista do ${l.cClassTrib}`] : []), ...f1.map((d) => `LC 214/2025, ${d}`)];
      add("LACUNA_FONTE_SEM_REGRA", l.id,
        `A NCM ${l.ncm} consta da fonte oficial para o ${l.cClassTrib} (${locais.join("; ")}), e a base não tem regra correspondente. O estado ${v.estado} foi produzido pelo motor e não foi alterado.`,
        { origem: [`lacunas[${k}]`], limitacao: achaLimitacao(e, "a base atual não tem regra correspondente"), decisoes: ["D5"] });
    });
  } else if (e.ausencias.includes("SEM_REGRA_NA_BASE") && v.informado.cst !== "000") {
    // Item com CST 000 fica só no alerta de lote (especificação, P2)
    add("SEM_REGRA_NA_BASE", "ausencia", "A base não tem regra de benefício para esta NCM.", { origem: ["ausencias"] });
  }

  // F: evidência mista
  if (e.nivelEvidencia === "misto") {
    const niveis = [...new Set(e.regras.map((r) => r.statusNormativo === "SEM_EVIDENCIA_OFICIAL" ? "só planilha" : r.statusNormativo ? "oficial" : "pendente"))];
    add("EVIDENCIA_MISTA", "nivel", `As regras candidatas têm níveis de evidência diferentes (${niveis.join(" e ")}).`,
      { regras: e.regras.map(refRegra), origem: ["nivelEvidencia"] });
  }

  // G: validação legada (registro histórico, não é confirmação humana)
  e.validacoesLegadas.forEach((l, k) => {
    const r = l.registro;
    const usada = v.regraAplicada === r.regraId || v.regrasCandidatas.includes(r.regraId);
    let msg = `Este item possui uma resposta histórica ${r.resposta === "NAO" ? "NÃO" : "SIM"}, registrada em ${dataBR(r.data)}, `
      + (usada ? "que foi utilizada no cálculo deste resultado." : "que não corresponde às regras candidatas deste item e não foi utilizada no cálculo.");
    msg += ` A resposta é mantida como registro histórico e não equivale a uma confirmação humana atual: não há confirmação humana com autoria registrada (${MOTIVO_LEGADA[l.classificacao] ?? l.classificacao}).`;
    msg += " Para uma confirmação formal com autoria, será necessário utilizar o fluxo de validação humana quando essa funcionalidade estiver disponível.";
    msg += ` ${referencia("D6")}`;
    add("VALIDACAO_LEGADA", `${r.ncm}|${r.cProd}|${r.regraId}`, msg, {
      regras: e.regras.filter((x) => x.regraIdInformado === r.regraId).map(refRegra), origem: [`validacoesLegadas[${k}]`], decisoes: ["D6"],
      limitacao: l.classificacao === "autor_sistema_nao_e_confirmacao_humana" ? achaLimitacao(e, "autor fixo \"Sistema\"")
        : l.classificacao === "sem_hash_das_fontes_na_data" ? achaLimitacao(e, "sem o hash das fontes") : null,
    });
  });

  // I: decisões pendentes (D3 vai para o lote)
  e.decisoesPendentes.forEach((d, k) => {
    if (d.decisao === "D3") return;
    const t = DECISAO_TEXTO[d.decisao];
    add("DECISAO_PENDENTE", d.decisao, `${t.situacao} ${t.motivo} ${SEM_ACAO_DEFINICAO} ${referencia(d.decisao)}`,
      { origem: [`decisoesPendentes[${k}]`], decisoes: [d.decisao] });
  });

  // Informação operacional do SVRS (200043 em NFC-e)
  const nfce = achaLimitacao(e, "IndNfce = false");
  if (nfce) {
    add("INFORMACAO_OPERACIONAL_SVRS", "IndNfce",
      "O SVRS indica que o código 200043 não é habilitado para NFC-e (IndNfce = false), e este documento é uma NFC-e (modelo 65). O tratamento desse caso ainda não foi definido (referência técnica: D4).",
      { limitacao: nfce, origem: ["limitacoes"], decisoes: ["D4"] });
  }
  // Alíquota projetada
  if (e.matriz.situacoes.includes(14)) {
    add("ALIQUOTA_PROJETADA", "aliquota", "Valores calculados com alíquota projetada, não oficial.", { origem: ["matriz.situacoes"] });
  }

  return saida.sort((a, b) => ORDEM.indexOf(a.categoria) - ORDEM.indexOf(b.categoria));
}

// ---------- alertas de lote ----------

/** Rótulos do nível de evidência para o texto do lote D3. */
const ROTULO_NIVEL: Record<ExplicacaoInformativa["nivelEvidencia"], string> = {
  planilha: "só planilha",
  misto: "misto (regras com evidência oficial e regras só da planilha)",
  oficial: "oficial",
  divergente: "divergente",
  pendente: "pendente",
};

function alertasDeLote(vs: VereditoExplicado[]): AlertaDeLote[] {
  type Grupo = {
    chave: string; codigo: CodigoAlerta; titulo: string; decisoes?: IdDecisao[];
    filtro: (e: ExplicacaoInformativa) => boolean;
    mensagem: (n: number, vs: VereditoExplicado[]) => string;
  };
  const grupos: Grupo[] = [
    { chave: "VALIDACAO_HUMANA_NAO_DISPONIVEL", codigo: "VALIDACAO_HUMANA_NAO_DISPONIVEL", titulo: "Lote: validação humana não registrada",
      filtro: (e) => e.ausencias.includes("VALIDACAO_HUMANA_NAO_DISPONIVEL"),
      mensagem: (n, vs) => {
        const naFila = vs.filter(naFilaDePendencias).length;
        const acao = naFila
          ? `Ação disponível: ${naFila} destes itens aparecem na tela de Pendências, onde é possível responder SIM ou NÃO para a regra; essa resposta passa a ser usada no cálculo, mas hoje é gravada sem autoria (autor fixo "Sistema") e não equivale a confirmação humana. Para os demais ${n - naFila} itens, a interface não permite concluir essa confirmação.`
          : "Nenhum destes itens aparece na tela de Pendências, e a interface não permite concluir essa confirmação; a situação permanece pendente até que o fluxo de validação correspondente esteja disponível.";
        return `Alerta de lote (${n} itens): estes itens têm regra de benefício que depende de o produto atender à descrição e às condições da regra, mas não há validação humana com autoria registrada para eles. Isso importa porque só uma pessoa pode confirmar se o produto atende à regra. ${acao}`;
      } },
    { chave: "DECISAO_PENDENTE:D3", codigo: "DECISAO_PENDENTE", titulo: "Lote: política pendente para regras com vínculo NCM × item não CONFIRMADO", decisoes: ["D3"],
      filtro: (e) => e.decisoesPendentes.some((d) => d.decisao === "D3"),
      mensagem: (n, vs) => {
        // Nível de evidência como está registrado na explicação de cada item
        const porNivel = new Map<ExplicacaoInformativa["nivelEvidencia"], number>();
        for (const v of vs) porNivel.set(v.explicacaoInformativa!.nivelEvidencia, (porNivel.get(v.explicacaoInformativa!.nivelEvidencia) ?? 0) + 1);
        const niveis = [...porNivel].sort((a, b) => b[1] - a[1]).map(([k, q]) => `${q} ${ROTULO_NIVEL[k]}`).join("; ");
        return `Alerta de lote (${n} itens): ${DECISAO_TEXTO.D3.situacao} ${DECISAO_TEXTO.D3.motivo} Nível de evidência registrado nos itens: ${niveis}. ${SEM_ACAO_DEFINICAO} ${referencia("D3")}`;
      } },
    { chave: "SEM_REGRA_NA_BASE", codigo: "SEM_REGRA_NA_BASE", titulo: "Lote: sem regra de benefício na base",
      filtro: (e) => e.ausencias.includes("SEM_REGRA_NA_BASE") && e.lacunas.length === 0,
      mensagem: (n) => `Alerta de lote (${n} itens): a base não tem regra de benefício para a NCM destes itens.` },
  ];
  const lote: AlertaDeLote[] = [];
  for (const g of grupos) {
    if (!DE_LOTE.has(g.chave)) continue;
    const alvo = vs.filter((v) => v.explicacaoInformativa && g.filtro(v.explicacaoInformativa));
    if (!alvo.length) continue;
    const itens = alvo.map((v) => ({ documento: v.documento, nItem: v.nItem }));
    lote.push({
      codigo: g.codigo, categoria: CATEGORIA[g.codigo], camada: CAMADA[g.codigo], titulo: g.titulo,
      mensagem: g.mensagem(itens.length, alvo),
      itens: itens.length, exemplos: itens.slice(0, 5), itensAfetados: itens, ...(g.decisoes ? { decisoes: g.decisoes } : {}), efeito: "somente_exibicao",
    });
  }
  return lote;
}

/** Gera os alertas a partir dos vereditos explicados. Nada do que é recebido é alterado. */
export function gerarAlertas(vereditos: VereditoExplicado[]): ResultadoAlertas {
  return { porItem: vereditos.flatMap(alertasDoItem), lote: alertasDeLote(vereditos) };
}
