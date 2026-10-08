/**
 * Planos de assinatura. É o único lugar para mudar nomes, preços, limites e recursos:
 * a landing, o cadastro, o checkout e a área do cliente leem daqui.
 *
 * ATENÇÃO: preços, limites e condições abaixo são EXEMPLOS. Enquanto
 * `valoresIlustrativos` for true, a página mostra um aviso discreto dizendo isso.
 * Ao definir os valores reais, troque os números e passe a flag para false.
 *
 * `gateway` guarda os identificadores do plano no gateway de pagamento (ex.: o id do
 * preço recorrente). Ficam null até o gateway ser escolhido e configurado.
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
  suporte_prioritario: { nome: "Suporte prioritário", detalhe: "Atendimento com prioridade na fila" },
  onboarding: { nome: "Onboarding assistido", detalhe: "Acompanhamento na primeira análise" },
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
  limites: LimitePlano[];
  recursos: RecursoId[];
  /** Resumo em linguagem de resultado, mostrado no cartão no lugar da lista de recursos (a lista completa fica na comparação). */
  resumo?: string;
  /** Texto curto antes da lista de recursos, ex.: "Tudo do Essencial, mais:". */
  chamadaRecursos?: string;
  gateway: { idPrecoMensal: string | null; idPrecoAnual: string | null };
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

export const configuracaoPlanos: ConfiguracaoPlanos = {
  moeda: "BRL",
  valoresIlustrativos: true,
  /** Aviso de pré-lançamento (landing, acima dos planos, e resumo do checkout). Em modo demonstração, a landing acrescenta que nada é cobrado. */
  textoValoresIlustrativos: "Pré-lançamento: valores, limites e condições são de referência e podem mudar até a abertura das assinaturas.",
  /** Texto do selo do ciclo anual. */
  vantagemAnual: "2 meses grátis",
  /** Condições exibidas abaixo dos planos (EXEMPLO: confirmar com o negócio). */
  condicoes: ["Sem fidelidade no plano mensal", "Troque de plano quando precisar", "Nada para instalar"],
  cicloPadrao: "mensal",

  planos: [
    {
      id: "essencial",
      nome: "Essencial",
      descricao: "Para analisar as vendas da sua empresa e ajustar o cadastro por conta própria, com o relatório final em CSV.",
      precoMensal: 149,
      precoAnual: 1490,
      destaque: false,
      resumo: "Análise completa das suas vendas: o que está certo, o que recalcular, o que validar e o que ajustar no cadastro, com o relatório final em CSV.",
      limites: [
        { rotulo: "Empresa (CNPJ)", valor: "1" },
        { rotulo: "XMLs por mês", valor: "até 2.000" },
      ],
      recursos: ["analise_xml", "conferencia", "dashboard", "resultados", "pendencias", "consulta_ncm", "relatorio_csv"],
      gateway: { idPrecoMensal: null, idPrecoAnual: null },
    },
    {
      id: "profissional",
      nome: "Profissional",
      descricao: "Para levar o resultado ao contador ou à equipe: relatório final em Excel e PDF, mais suporte prioritário.",
      precoMensal: 297,
      precoAnual: 2970,
      destaque: true,
      seloDestaque: "Nossa recomendação",
      limites: [
        { rotulo: "Empresas (CNPJ)", valor: "até 3" },
        { rotulo: "XMLs por mês", valor: "até 10.000" },
      ],
      chamadaRecursos: "Tudo do Essencial, mais:",
      recursos: [
        "analise_xml", "conferencia", "dashboard", "resultados", "pendencias", "consulta_ncm", "relatorio_csv",
        "relatorio_excel_pdf", "suporte_prioritario",
      ],
      gateway: { idPrecoMensal: null, idPrecoAnual: null },
    },
    {
      id: "premium",
      nome: "Premium",
      descricao: "Para redes, grupos e escritórios com várias empresas. Inclui acompanhamento na primeira análise.",
      precoMensal: 597,
      precoAnual: 5970,
      destaque: false,
      limites: [
        { rotulo: "Empresas (CNPJ)", valor: "até 10" },
        { rotulo: "XMLs por mês", valor: "sem limite mensal" },
      ],
      chamadaRecursos: "Tudo do Profissional, mais:",
      recursos: [
        "analise_xml", "conferencia", "dashboard", "resultados", "pendencias", "consulta_ncm", "relatorio_csv",
        "relatorio_excel_pdf", "suporte_prioritario", "onboarding",
      ],
      gateway: { idPrecoMensal: null, idPrecoAnual: null },
    },
  ],
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
