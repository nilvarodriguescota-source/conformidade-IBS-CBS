/**
 * Planos de assinatura. É o único lugar para mudar nomes, preços, limites e recursos:
 * a landing, o cadastro, o checkout e a área do cliente leem daqui.
 *
 * Se mudar um preço aqui, mude também na Kiwify (o webhook usa o valor como último recurso para
 * reconhecer o plano). `valoresIlustrativos: true` volta a mostrar o aviso de "valores de referência".
 *
 * `kiwify` guarda os links de checkout de cada plano na Kiwify (um para o ciclo mensal e outro
 * para o anual), no formato https://pay.kiwify.com.br/XXXXXXX. Os botões "Assinar" levam
 * direto para eles e o webhook usa o código do link para saber qual plano foi comprado.
 * Plano sem link no ciclo escolhido mostra "integração pendente" no checkout.
 */
import type { CicloCobranca } from "../servicos/tipos.js";

/**
 * Recursos que um plano pode liberar. Cada um corresponde a uma parte real do sistema;
 * o controle de acesso por plano (servicos/acesso.ts) usa estes ids.
 */
export const catalogoRecursos = {
  analise_xml: { nome: "Análise de XMLs de NF-e e NFC-e", detalhe: "Arquivos .xml ou .zip, dentro do volume mensal do plano" },
  conferencia: { nome: "Conferência de CST e cClassTrib", detalhe: "Item a item, com o fundamento de cada resultado" },
  dashboard: { nome: "Dashboard de conformidade", detalhe: "Situação da empresa, economia potencial e gráficos" },
  resultados: { nome: "Resultados com filtros e CSV", detalhe: "Busca por produto, código, NCM, CST e cClassTrib" },
  pendencias: { nome: "Validação guiada de pendências", detalhe: "Uma pergunta por produto quando a regra depende do que ele é" },
  consulta_ncm: { nome: "Consulta tributária por NCM", detalhe: "Consulta preventiva, sem precisar de XML" },
  relatorio_csv: { nome: "Relatório final em CSV", detalhe: "O que ajustar em cada produto" },
  relatorio_excel_pdf: { nome: "Relatório final em Excel e PDF", detalhe: "Pronto para enviar à equipe ou ao cliente" },
} as const;

export type RecursoId = keyof typeof catalogoRecursos;

export interface LimitePlano {
  rotulo: string;
  valor: string;
}

export interface Plano {
  id: string;
  nome: string;
  descricao: string;
  /** Preço por mês no ciclo mensal, em reais. null = "sob consulta". */
  precoMensal: number | null;
  /** Preço total do ciclo anual, em reais. */
  precoAnual: number | null;
  destaque: boolean;
  seloDestaque?: string;
  /**
   * XMLs de venda diferentes que o cliente pode analisar por mês (null = sem limite).
   * O webhook grava este número na assinatura e o banco recusa a análise que passar dele
   * (sql/supabase.sql, função registrar_uso_xmls).
   */
  xmlsPorMes: number | null;
  /** Linhas de limite exibidas nos cartões e na comparação (geradas a partir de xmlsPorMes). */
  limites: LimitePlano[];
  recursos: RecursoId[];
  /** Resumo em linguagem de resultado, mostrado no cartão no lugar da lista de recursos (a lista completa fica na comparação). */
  resumo?: string;
  /** Texto curto antes da lista de recursos, ex.: "Tudo do Essencial, mais:". */
  chamadaRecursos?: string;
  /** Links do checkout da Kiwify (null = ainda não criado). */
  kiwify: { linkMensal: string | null; linkAnual: string | null };
}

export interface ConfiguracaoPlanos {
  moeda: "BRL";
  /** true enquanto preços e limites forem exemplos: mostra um aviso abaixo dos planos. */
  valoresIlustrativos: boolean;
  textoValoresIlustrativos: string;
  vantagemAnual: string;
  condicoes: string[];
  cicloPadrao: CicloCobranca;
  planos: Plano[];
}

/** Todos os planos liberam todos os recursos; o que muda entre eles é o volume de XMLs por mês. */
const RECURSOS = Object.keys(catalogoRecursos) as RecursoId[];
const TODOS_OS_RECURSOS =
  "Tudo incluído: análise das suas vendas, validação guiada das pendências, consulta por NCM e o relatório do que ajustar em CSV, Excel e PDF.";

/** 10000 → "10.000" (sem depender do idioma instalado no build). */
function milhar(n: number): string {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function comLimites(plano: Omit<Plano, "limites">): Plano {
  return { ...plano, limites: [{ rotulo: "XMLs por mês", valor: plano.xmlsPorMes == null ? "sem limite" : `até ${milhar(plano.xmlsPorMes)}` }] };
}

export const configuracaoPlanos: ConfiguracaoPlanos = {
  moeda: "BRL",
  valoresIlustrativos: false,
  /** Aviso de pré-lançamento (landing, acima dos planos, e resumo do checkout). Só aparece com valoresIlustrativos = true. */
  textoValoresIlustrativos: "Pré-lançamento: valores, limites e condições são de referência e podem mudar até a abertura das assinaturas.",
  /** Texto do selo do ciclo anual. */
  vantagemAnual: "2 meses grátis",
  /** Condições exibidas abaixo dos planos (EXEMPLO: confirmar com o negócio). */
  condicoes: ["Todos os recursos e relatórios em todos os planos", "Sem fidelidade no plano mensal", "Troque de plano quando precisar", "Nada para instalar"],
  cicloPadrao: "mensal",

  planos: [
    {
      id: "essencial",
      nome: "Essencial",
      descricao: "Para empresas com até 2.000 XMLs de venda por mês.",
      precoMensal: 197,
      precoAnual: 1970,
      destaque: false,
      resumo: TODOS_OS_RECURSOS,
      xmlsPorMes: 2000,
      recursos: [...RECURSOS],
      kiwify: { linkMensal: null, linkAnual: null },
    },
    {
      id: "profissional",
      nome: "Profissional",
      descricao: "Para empresas com até 5.000 XMLs de venda por mês.",
      precoMensal: 297,
      precoAnual: 2970,
      destaque: true,
      seloDestaque: "Nossa recomendação",
      resumo: TODOS_OS_RECURSOS,
      xmlsPorMes: 5000,
      recursos: [...RECURSOS],
      kiwify: { linkMensal: null, linkAnual: null },
    },
    {
      id: "premium",
      nome: "Premium",
      descricao: "Para operações maiores, redes e grupos, com até 10.000 XMLs de venda por mês.",
      precoMensal: 597,
      precoAnual: 5970,
      destaque: false,
      resumo: TODOS_OS_RECURSOS,
      xmlsPorMes: 10000,
      recursos: [...RECURSOS],
      kiwify: { linkMensal: null, linkAnual: null },
    },
  ].map(comLimites),
};

export function planoPorId(id: string | null | undefined): Plano | undefined {
  return configuracaoPlanos.planos.find((p) => p.id === id);
}

export function planoDestaque(): Plano {
  return configuracaoPlanos.planos.find((p) => p.destaque) ?? configuracaoPlanos.planos[0]!;
}

/** Valor cobrado por ciclo (mensal: preço do mês; anual: total do ano). */
export function valorDoCiclo(plano: Plano, ciclo: CicloCobranca): number | null {
  return ciclo === "anual" ? plano.precoAnual : plano.precoMensal;
}

/** Link de compra na Kiwify do plano no ciclo pedido (null quando ainda não configurado). */
export function linkKiwify(plano: Plano, ciclo: CicloCobranca): string | null {
  return (ciclo === "anual" ? plano.kiwify.linkAnual : plano.kiwify.linkMensal) || null;
}

/** Equivalente mensal, usado para mostrar "R$ X/mês" também no ciclo anual. */
export function equivalenteMensal(plano: Plano, ciclo: CicloCobranca): number | null {
  if (ciclo === "anual") return plano.precoAnual == null ? null : plano.precoAnual / 12;
  return plano.precoMensal;
}

/** Recursos de um plano que não estavam no plano anterior da lista (para "Tudo do X, mais:"). */
export function recursosNovos(plano: Plano): RecursoId[] {
  const lista = configuracaoPlanos.planos;
  const i = lista.findIndex((p) => p.id === plano.id);
  if (i <= 0 || !plano.chamadaRecursos) return plano.recursos;
  const anteriores = new Set<RecursoId>(lista[i - 1]!.recursos);
  return plano.recursos.filter((r) => !anteriores.has(r));
}
