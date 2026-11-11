/**
 * Imposto Seletivo (IS): enquadramento, cálculo e validação, separados do IBS/CBS.
 *
 * Base normativa própria em data/imposto-seletivo.json (incidência pelo Anexo XVII da LC 214/2025, contribuinte por
 * CFOP, vigência e alíquotas com fonte e situação de conferência). Este módulo só LÊ os documentos já lidos pelo
 * parser: não altera vereditos, CST, cClassTrib nem créditos de IBS/CBS.
 *
 * Regras de decisão (cada uma com o seu fundamento na base):
 *  1. NCM fora do Anexo XVII ............................................. não incidência
 *  2. Operação antes do início das alíquotas (vigência) ....................... não incidência
 *     Operação depois do fim do regime transitório (regras de 2028 não cadastradas) .. validação fiscal
 *  3. Revenda (CFOP de mercadoria de terceiros): o IS incide uma vez só, no fabricante ou na importação .. não incidência
 *     CFOP que não identifica o fabricante .................................... validação fiscal
 *  4. Produção própria (fabricante): exceções (art. 413, III; embalagem primária; valor de referência) ... validação fiscal
 *  5. Alíquota vigente CONFERIDA com a norma ................................... incidência, com cálculo
 *     Alíquota ausente ou ainda não conferida (ex.: só na planilha do cliente) ..... validação fiscal, sem alíquota
 * Nada vira alíquota zero por falta de regra: sem regra conclusiva, a situação é "validação fiscal".
 */
import { readFileSync } from "node:fs";
import type { Documento, ItemDocumento } from "./tipos.js";

export type SituacaoIS = "INCIDENCIA" | "NAO_INCIDENCIA" | "VALIDACAO";

export interface CategoriaIS {
  id: string; nome: string; codigos: string[]; excluidos?: string[]; descricaoLegal: string; fundamento: string;
  embalagemPrimaria: boolean; exigeAliquotaEspecifica: boolean; baseValorReferencia?: boolean; excecoesNoAnexo?: boolean;
}
export interface AliquotaIS {
  id: string; categoria: string;
  modalidade: "ad_valorem" | "especifica" | "ad_valorem_e_especifica" | "ajustes_por_veiculo";
  /** Códigos da NCM (posição, subposição ou código completo) e exclusões. */
  codigos: string[]; excluidos?: string[];
  /** Condição do produto para esta alíquota (ex.: teor alcoólico); sem condição, é a regra geral do código. */
  condicao?: string | null;
  aliquotaInicial: number | null; fatorConversao: number | null; aliquota: number | null;
  /** Alíquota específica (R$ por unidade de medida); valor 0 quando reduzida a zero pela norma. */
  especifica?: { valor: number; unidade: string; fundamento?: string } | null;
  regraCalculo: string; observacao?: string; vigenciaInicio: string; vigenciaFim: string | null;
  fonte: string; dispositivo: string; situacao: "conferida" | "pendente_conferencia";
}
export interface BaseIS {
  versao: string;
  historico: { versao: string; data: string; alteracao: string; fontes: string[] }[];
  fontes: Record<string, { titulo: string; url?: string; arquivo: string | null; sha256: string | null; situacao: string; observacao?: string }>;
  fundamentos: Record<string, string>;
  vigencia: { inicioAliquotas: string; fimRegimeTransitorio: string; fonte: string; situacao: string; aposFim: string };
  categorias: CategoriaIS[];
  cfops: { fundamento: string; producaoPropria: string[]; revenda: string[] };
  aliquotas: AliquotaIS[];
}

export function carregarBaseIS(arquivo: string): BaseIS {
  return JSON.parse(readFileSync(arquivo, "utf8")) as BaseIS;
}

/** Categoria do Anexo XVII para o NCM (código completo ou posição/subposição), respeitando as exclusões. */
export function categoriaDoNcm(base: BaseIS, ncm: string | null): CategoriaIS | null {
  if (!ncm) return null;
  for (const c of base.categorias) {
    if (c.excluidos?.some((x) => ncm.startsWith(x))) continue;
    if (c.codigos.some((x) => ncm.startsWith(x))) return c;
  }
  return null;
}

/**
 * Alíquotas do NCM na data: a regra geral (sem condição, código mais específico) e as alternativas que dependem de
 * uma condição do produto (ex.: vinho do porto, teor alcoólico). Só considera alíquotas vigentes na data.
 */
export function aliquotasDoNcm(base: BaseIS, ncm: string | null, data: string): { principal: AliquotaIS | null; alternativas: AliquotaIS[] } {
  if (!ncm) return { principal: null, alternativas: [] };
  const casa = (a: AliquotaIS) => a.vigenciaInicio <= data && (a.vigenciaFim === null || data <= a.vigenciaFim)
    && !a.excluidos?.some((x) => ncm.startsWith(x)) && a.codigos.some((c) => ncm.startsWith(c));
  const tamanho = (a: AliquotaIS) => Math.max(...a.codigos.filter((c) => ncm.startsWith(c)).map((c) => c.length));
  const vigentes = base.aliquotas.filter(casa);
  const gerais = vigentes.filter((a) => !a.condicao).sort((x, y) => tamanho(y) - tamanho(x));
  return { principal: gerais[0] ?? null, alternativas: vigentes.filter((a) => !!a.condicao) };
}

export interface AvaliacaoItemIS {
  situacao: SituacaoIS;
  categoria: string | null;
  motivo: string;
  fundamentos: string[];
  aliquota: AliquotaIS | null;
  base: number;
  valor: number | null;
  alertas: string[];
}

const dataBr = (iso: string) => `${iso.slice(8, 10)}/${iso.slice(5, 7)}/${iso.slice(0, 4)}`;
const pct = (x: number) => `${(x * 100).toLocaleString("pt-BR", { maximumFractionDigits: 4 })}%`;
const arred = (x: number) => Math.round(x * 100) / 100;

/** Avalia um item vendido. `data` no formato AAAA-MM-DD (data de emissão do documento). */
export function avaliarItemIS(base: BaseIS, item: ItemDocumento, data: string | null): AvaliacaoItemIS {
  const f = base.fundamentos;
  const valorVenda = arred((item.valorProduto ?? 0) - (item.desconto ?? 0));
  const r = (situacao: SituacaoIS, motivo: string, fundamentos: string[], extra: Partial<AvaliacaoItemIS> = {}): AvaliacaoItemIS => {
    const alertas = [...(extra.alertas ?? [])];
    const inf = item.impostoSeletivo;
    if (inf && (inf.valor ?? 0) > 0 && situacao === "NAO_INCIDENCIA") alertas.push(`O XML informa IS de R$ ${inf.valor!.toFixed(2)} numa operação sem incidência.`);
    if (!inf && situacao === "INCIDENCIA") alertas.push("O XML não traz o grupo IS, mas a operação tem incidência.");
    return { situacao, categoria: extra.categoria ?? null, motivo, fundamentos, aliquota: extra.aliquota ?? null, base: valorVenda, valor: extra.valor ?? null, alertas };
  };

  if (!item.ncm) return r("VALIDACAO", "Item sem NCM: não é possível verificar o Anexo XVII.", [f.INCIDENCIA!]);
  const cat = categoriaDoNcm(base, item.ncm);
  if (!cat) return r("NAO_INCIDENCIA", `O NCM ${item.ncm} não consta do Anexo XVII da LC 214/2025 (bens sujeitos ao IS).`, [f.INCIDENCIA!]);
  const comCat = { categoria: cat.id };

  if (!data) return r("VALIDACAO", "Documento sem data de emissão: a vigência não pode ser verificada.", [cat.fundamento, f.INICIO_COBRANCA!], comCat);
  if (data < base.vigencia.inicioAliquotas) {
    return r("NAO_INCIDENCIA", `${cat.nome}: operação anterior ao início das alíquotas do IS (${dataBr(base.vigencia.inicioAliquotas)}); nenhuma alíquota de 2027 é aplicada a ela.`, [cat.fundamento, f.INICIO_COBRANCA!], comCat);
  }
  if (data > base.vigencia.fimRegimeTransitorio) {
    return r("VALIDACAO", `${cat.nome}: operação posterior ao fim do regime de 2027 (${dataBr(base.vigencia.fimRegimeTransitorio)}). ${base.vigencia.aposFim}`, [cat.fundamento, f.INICIO_COBRANCA!], comCat);
  }

  const cfop = item.cfop ?? "";
  if (base.cfops.revenda.includes(cfop)) {
    return r("NAO_INCIDENCIA", `${cat.nome}: revenda (CFOP ${cfop}). O IS incide uma única vez, no primeiro fornecimento pelo fabricante ou na importação; não há IS nesta operação.`,
      [cat.fundamento, f.MONOFASICO!, f.FATO_GERADOR!, f.CONTRIBUINTE!, base.cfops.fundamento], comCat);
  }
  if (!base.cfops.producaoPropria.includes(cfop)) {
    return r("VALIDACAO", `${cat.nome}: o CFOP ${cfop || "(ausente)"} não indica se o estabelecimento é o fabricante (contribuinte do IS).`, [cat.fundamento, f.CONTRIBUINTE!, base.cfops.fundamento], comCat);
  }

  // Fabricante (produção própria, CFOP ${cfop})
  const { principal: aliq, alternativas } = aliquotasDoNcm(base, item.ncm, data);
  const comAliq = { ...comCat, aliquota: aliq };
  const textoAlt = alternativas.map((x) => `${x.aliquota != null ? pct(x.aliquota) : "—"} se ${x.condicao}`).join("; ");
  if (item.cst === "200") {
    return r("VALIDACAO", `${cat.nome}: o item tem IBS/CBS com alíquota reduzida (CST 200). Verifique a não incidência do IS do art. 413, III, da LC 214/2025.`, [cat.fundamento, f.NAO_INCIDENCIA_REDUCAO!], comAliq);
  }
  if (cat.baseValorReferencia) {
    return r("VALIDACAO", `${cat.nome}: a base de cálculo é o valor de referência definido em ato do Poder Executivo, que não está no XML.`, [cat.fundamento, f.BASE_CALCULO!], comAliq);
  }
  if (cat.excecoesNoAnexo) {
    return r("VALIDACAO", `${cat.nome}: o Anexo XVII traz exceções para esta categoria; confirme o enquadramento do bem.`, [cat.fundamento], comAliq);
  }
  if (cat.embalagemPrimaria) {
    return r("VALIDACAO", `${cat.nome}: venda de produção própria (CFOP ${cfop}). Confirme se o produto sai em embalagem primária destinada ao consumidor final (art. 409, § 2º, da LC 214/2025)${cat.id === "FUMIGENOS" ? "" : " e se o estabelecimento é pequeno produtor (redução do Anexo VI da MP 1.399/2026)"}${textoAlt ? `; alíquota ${aliq?.aliquota != null ? pct(aliq.aliquota) : "—"}, ou ${textoAlt}` : ""}.`,
      [cat.fundamento, f.EMBALAGEM_PRIMARIA!, f.CONTRIBUINTE!, ...(cat.id === "FUMIGENOS" ? [] : [f.PEQUENOS_PRODUTORES!]), f.ALIQUOTAS!].filter(Boolean), comAliq);
  }
  if (!aliq) {
    return r("VALIDACAO", `${cat.nome}: não há alíquota do IS cadastrada para ${dataBr(data)}.`, [cat.fundamento, f.ALIQUOTAS!], comCat);
  }
  if (alternativas.length) {
    return r("VALIDACAO", `${cat.nome}: a alíquota depende do produto — ${pct(aliq.aliquota ?? 0)} na regra geral, ou ${textoAlt}.`, [cat.fundamento, f.ALIQUOTAS!, aliq.dispositivo], comAliq);
  }
  if (aliq.situacao !== "conferida") {
    return r("VALIDACAO", `${cat.nome}: alíquota de ${aliq.aliquota != null ? pct(aliq.aliquota) : "(não informada)"} cadastrada a partir de ${base.fontes[aliq.fonte]?.titulo ?? aliq.fonte}, ainda não conferida com ${aliq.dispositivo}. O valor não é calculado até a conferência.`,
      [cat.fundamento, f.ALIQUOTAS!], comAliq);
  }
  const calc = calcularIS(aliq, cat, valorVenda, item.quantidade);
  if (calc.valor === null) return r("VALIDACAO", `${cat.nome}: ${calc.pendencia}`, [cat.fundamento, f.ALIQUOTAS!, f.BASE_CALCULO!], comAliq);
  return r("INCIDENCIA", `${cat.nome}: venda de produção própria (CFOP ${cfop}), fato gerador do IS. ${aliq.regraCalculo}.`, [cat.fundamento, f.FATO_GERADOR!, f.CONTRIBUINTE!, f.BASE_CALCULO!, f.ALIQUOTAS!, aliq.dispositivo],
    { ...comAliq, valor: calc.valor });
}

/**
 * Cálculo pela modalidade da alíquota (não há fórmula única): ad valorem sobre o valor de venda; específica por
 * unidade de medida; as duas somadas quando a lei exige. Sem algum dos dados, devolve a pendência, não um valor.
 */
export function calcularIS(aliq: AliquotaIS, cat: CategoriaIS, base: number, quantidade: number | null): { valor: number | null; pendencia: string } {
  let valor = 0;
  if (aliq.modalidade === "ajustes_por_veiculo") return { valor: null, pendencia: "a alíquota depende dos ajustes dos Anexos I a III da MP 1.399/2026 (propulsão, eficiência, potência, desempenho e reciclabilidade do veículo)." };
  if (aliq.modalidade === "ad_valorem" || aliq.modalidade === "ad_valorem_e_especifica") {
    if (aliq.aliquota == null) return { valor: null, pendencia: "alíquota ad valorem não informada." };
    valor += base * aliq.aliquota;
  }
  const precisaEspecifica = aliq.modalidade !== "ad_valorem" || cat.exigeAliquotaEspecifica;
  if (precisaEspecifica) {
    if (!aliq.especifica) return { valor: null, pendencia: "a parcela específica exigida pela lei (art. 422, § 1º, da LC 214/2025) não está cadastrada." };
    // Parcela específica reduzida a zero (MP 1.399/2026, art. 6º, II): não depende da quantidade
    if (aliq.especifica.valor === 0) return { valor: arred(valor), pendencia: "" };
    if (quantidade == null) return { valor: null, pendencia: `a parcela específica (R$ ${aliq.especifica.valor.toFixed(2).replace(".", ",")} por ${aliq.especifica.unidade}) depende da quantidade nessa unidade, que o XML não traz.` };
    valor += quantidade * aliq.especifica.valor;
  }
  return { valor: arred(valor), pendencia: "" };
}

/* ---------------- Por produto ---------------- */

export interface ProdutoIS {
  chave: string;
  ncm: string | null;
  cProd: string;
  produto: string;
  categoria: { id: string; nome: string; descricaoLegal: string; fundamento: string } | null;
  itens: number;
  base: number;
  situacao: SituacaoIS;
  porSituacao: Record<SituacaoIS, number>;
  motivos: { motivo: string; itens: number }[];
  fundamentos: string[];
  /**
   * Alíquota do NCM (regra geral) na vigência das operações; para operações anteriores à vigência, a do início dela,
   * só como referência (não é aplicada a essas operações).
   */
  aliquota: AliquotaIS | null;
  /** Alíquotas que dependem de condição do produto (ex.: teor alcoólico), além da regra geral. */
  alternativas: { aliquota: number | null; condicao: string }[];
  /** Soma do IS calculado (só quando todos os itens têm incidência calculada). */
  valor: number | null;
  /** Base dos itens dentro da vigência da alíquota, para calcular quando o usuário confirmar a incidência. */
  baseNaVigencia: number;
  cfops: string[];
  periodo: { de: string | null; ate: string | null };
  informadoNoXml: number;
  alertas: string[];
  /**
   * Só para orientação: como os mesmos itens seriam tratados se a operação fosse feita no início da vigência das
   * alíquotas (operações anteriores a ela). Não aplica alíquota nenhuma às operações reais.
   */
  projecaoVigencia: { data: string; situacao: SituacaoIS; motivos: string[] } | null;
}

const PESO: Record<SituacaoIS, number> = { NAO_INCIDENCIA: 0, INCIDENCIA: 1, VALIDACAO: 2 };

/** Avalia todos os itens dos documentos de venda e agrega por produto (NCM + cProd). */
export function avaliarDocumentosIS(base: BaseIS, documentos: Documento[]): ProdutoIS[] {
  const mapa = new Map<string, ProdutoIS & { _aliqs: Set<string>; _motivos: Map<string, number>; _fund: Set<string>; _alertas: Set<string>; _cfops: Set<string>; _valores: (number | null)[]; _proj: Map<string, SituacaoIS> }>();
  const inicio = base.vigencia.inicioAliquotas;
  for (const doc of documentos) {
    const data = doc.dataEmissao ? doc.dataEmissao.slice(0, 10) : null;
    for (const item of doc.itens) {
      const a = avaliarItemIS(base, item, data);
      const chave = `${item.ncm ?? ""}|${item.cProd}`;
      let p = mapa.get(chave);
      if (!p) {
        const cat = categoriaDoNcm(base, item.ncm);
        p = {
          chave, ncm: item.ncm, cProd: item.cProd, produto: item.xProd,
          categoria: cat ? { id: cat.id, nome: cat.nome, descricaoLegal: cat.descricaoLegal, fundamento: cat.fundamento } : null,
          itens: 0, base: 0, situacao: "NAO_INCIDENCIA", porSituacao: { INCIDENCIA: 0, NAO_INCIDENCIA: 0, VALIDACAO: 0 },
          motivos: [], fundamentos: [], aliquota: null, alternativas: [], valor: null, baseNaVigencia: 0, cfops: [], periodo: { de: null, ate: null }, informadoNoXml: 0, alertas: [],
          projecaoVigencia: null,
          _aliqs: new Set(), _motivos: new Map(), _fund: new Set(), _alertas: new Set(), _cfops: new Set(), _valores: [], _proj: new Map(),
        };
        mapa.set(chave, p);
      }
      p.itens++;
      p.base = arred(p.base + a.base);
      p.porSituacao[a.situacao]++;
      if (PESO[a.situacao] > PESO[p.situacao]) p.situacao = a.situacao;
      p._motivos.set(a.motivo, (p._motivos.get(a.motivo) ?? 0) + 1);
      a.fundamentos.forEach((x) => p!._fund.add(x));
      a.alertas.forEach((x) => p!._alertas.add(x));
      if (item.cfop) p._cfops.add(item.cfop);
      if (item.impostoSeletivo) p.informadoNoXml++;
      if (data) {
        if (!p.periodo.de || data < p.periodo.de) p.periodo.de = data;
        if (!p.periodo.ate || data > p.periodo.ate) p.periodo.ate = data;
      }
      if (a.categoria && data) {
        const naData = aliquotasDoNcm(base, item.ncm, data);
        // Antes da vigência: a alíquota do início dela, só como referência (a base dessas operações não entra no cálculo)
        const ref = naData.principal || naData.alternativas.length ? naData : data < inicio ? aliquotasDoNcm(base, item.ncm, inicio) : naData;
        if (ref.principal) { p._aliqs.add(ref.principal.id); p.aliquota = ref.principal; }
        for (const x of ref.alternativas) if (!p.alternativas.some((y) => y.condicao === x.condicao)) p.alternativas.push({ aliquota: x.aliquota, condicao: x.condicao! });
        if (naData.principal) p.baseNaVigencia = arred(p.baseNaVigencia + a.base);
      }
      p._valores.push(a.situacao === "INCIDENCIA" ? a.valor : null);
      // Produto do Anexo XVII vendido antes da vigência: como seria tratado a partir dela (só orientação)
      if (a.categoria && data && data < inicio) {
        const proj = avaliarItemIS(base, item, inicio);
        p._proj.set(proj.motivo, proj.situacao);
      }
    }
  }
  return [...mapa.values()].map((p) => {
    const { _aliqs, _motivos, _fund, _alertas, _cfops, _valores, _proj, ...resto } = p;
    const projSit = [..._proj.values()].reduce<SituacaoIS | null>((m, x) => (m === null || PESO[x] > PESO[m] ? x : m), null);
    const todosCalculados = _valores.length > 0 && _valores.every((v) => v !== null);
    return {
      ...resto,
      aliquota: _aliqs.size === 1 ? resto.aliquota : null,
      valor: todosCalculados ? arred(_valores.reduce<number>((s, v) => s + (v ?? 0), 0)) : null,
      motivos: [..._motivos].map(([motivo, itens]) => ({ motivo, itens })).sort((x, y) => y.itens - x.itens),
      fundamentos: [..._fund],
      alertas: [..._alertas],
      cfops: [..._cfops].sort(),
      projecaoVigencia: projSit ? { data: inicio, situacao: projSit, motivos: [..._proj.keys()] } : null,
    };
  }).sort((x, y) => PESO[y.situacao] - PESO[x.situacao] || (y.categoria ? 1 : 0) - (x.categoria ? 1 : 0) || y.base - x.base);
}

/* ---------------- Escolha do usuário ---------------- */

export type EscolhaIS = "INCIDENCIA" | "NAO_INCIDENCIA" | "VALIDACAO";
export const ESCOLHAS_IS: EscolhaIS[] = ["INCIDENCIA", "NAO_INCIDENCIA", "VALIDACAO"];
export interface RespostaIS { escolha: EscolhaIS; autor: string; data: string }

export interface ProdutoISComEscolha extends ProdutoIS {
  sugestao: SituacaoIS;
  escolha: RespostaIS | null;
  /** Situação que vale para relatórios: a escolha do usuário, ou a sugestão do sistema. */
  situacaoFinal: SituacaoIS;
  validacao: "CONFIRMADA" | "SUGESTAO" | "PENDENTE";
  /** Valor do IS para a situação final (null quando não há dados ou alíquota conferida para calcular). */
  valorFinal: number | null;
  calculo: string;
}

/**
 * Junta a sugestão do sistema com a escolha do usuário. Com incidência confirmada, o valor é recalculado aqui
 * (sem reprocessar a análise), só com alíquota conferida e só sobre os itens dentro da vigência.
 */
export function aplicarEscolhaIS(p: ProdutoIS, escolha: RespostaIS | null, base: BaseIS): ProdutoISComEscolha {
  const situacaoFinal: SituacaoIS = escolha ? escolha.escolha : p.situacao;
  const validacao = escolha && escolha.escolha !== "VALIDACAO" ? "CONFIRMADA" : situacaoFinal === "VALIDACAO" ? "PENDENTE" : "SUGESTAO";
  let valorFinal: number | null = null;
  let calculo = "";
  if (situacaoFinal === "NAO_INCIDENCIA") {
    calculo = "Sem IS nesta operação.";
  } else if (situacaoFinal === "VALIDACAO") {
    calculo = "Pendente de validação fiscal: nenhuma alíquota é aplicada.";
  } else if (p.valor !== null && p.situacao === "INCIDENCIA") {
    valorFinal = p.valor;
    calculo = p.aliquota?.regraCalculo ?? "";
  } else if (!p.aliquota) {
    calculo = "Valor não calculado: não há alíquota cadastrada para o NCM.";
  } else if (p.baseNaVigencia === 0) {
    calculo = `Valor não calculado: as operações são anteriores à vigência das alíquotas do IS (a partir de ${dataBr(p.aliquota.vigenciaInicio)}).`;
  } else if (p.aliquota.situacao !== "conferida") {
    calculo = `Valor não calculado: alíquota de ${p.aliquota.aliquota != null ? pct(p.aliquota.aliquota) : "(não informada)"} pendente de conferência com ${p.aliquota.dispositivo}.`;
  } else {
    const cat = base.categorias.find((c) => c.id === p.aliquota!.categoria);
    const c = cat ? calcularIS(p.aliquota, cat, p.baseNaVigencia, null) : { valor: null, pendencia: "categoria não encontrada." };
    valorFinal = c.valor;
    const alt = p.alternativas.length ? ` Atenção: ${p.alternativas.map((x) => `${x.aliquota != null ? pct(x.aliquota) : "—"} se ${x.condicao}`).join("; ")}.` : "";
    calculo = c.valor === null ? `Valor não calculado: ${c.pendencia}` : `${p.aliquota.regraCalculo} (base na vigência: R$ ${p.baseNaVigencia.toFixed(2)}).${alt}`;
  }
  return { ...p, sugestao: p.situacao, escolha, situacaoFinal, validacao, valorFinal, calculo };
}
