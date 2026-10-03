/**
 * Pergunta de validação em múltipla escolha: "O que é este produto?".
 *
 * Substitui o SIM/NÃO isolado por regra. Cada opção mostra, antes do clique, o
 * resultado que vai gerar (redução, cClassTrib, fundamento) e por quê. As
 * opções saem das regras candidatas do NCM (base normativa) e dos regimes que
 * a lei prevê; nenhuma opção cria benefício para outro NCM.
 *
 * Só monta a pergunta: quem decide é o motor, a partir da resposta gravada.
 */
import type { EscolhaValidacao } from "./tipos.js";
import { designacaoEspecifica, requisitoNaoAtendido } from "./requisitos-legais.js";

export { designacaoEspecifica };

export interface RegraParaPergunta {
  id: string;
  cst: string | null;
  cClassTrib: string | null;
  anexo: string | null;
  item: string | null;
  descricaoLegal: string | null;
  fundamentoLegal: string | null;
  reducaoAliquota: number | null;
  /** Descrição do NCM na TIPI: código residual ("Outros") exige que o produto corresponda à descrição legal. */
  descricaoNcmTipi?: string | null;
}

export interface OpcaoValidacao {
  /** REGRA: SIM na regra indicada. Os demais tipos gravam NÃO nas candidatas com a escolha. */
  tipo: "REGRA" | EscolhaValidacao;
  regraId: string | null;
  rotulo: string;
  resultado: string;
  explicacao: string;
  /** A descrição do produto contradiz a definição legal: opção disponível, mas não recomendada. */
  naoRecomendada: string | null;
}

/** Regime específico de bares e restaurantes: LC 214/2025, art. 275 (redução de 40%, cClassTrib 200047). */
export const REGIME_CONSUMO_NO_LOCAL = { cst: "200", cClassTrib: "200047", reducao: 0.4, fundamento: "LC 214/2025, art. 275" };

/** Anexos de alimentos: só para eles a opção de consumo no local faz sentido. */
const ANEXOS_ALIMENTOS = new Set(["I", "VII", "XV"]);

/** A descrição do produto contradiz a definição legal específica da regra (mesma verificação do motor). */
export function descricaoContradiz(produto: string, descricaoLegal: string | null, descricaoNcmTipi?: string | null): string | null {
  return requisitoNaoAtendido(produto, descricaoLegal, descricaoNcmTipi)?.motivo ?? null;
}

function pct(r: number | null): string {
  return r === null ? "redução não disponível" : `${Math.round(r * 100)}%`;
}

export function opcoesDaPergunta(ncm: string, produto: string, regras: RegraParaPergunta[]): OpcaoValidacao[] {
  const opcoes: OpcaoValidacao[] = regras.map((r) => {
    const designacao = designacaoEspecifica(r.descricaoLegal);
    return {
      tipo: "REGRA",
      regraId: r.id,
      rotulo: designacao ? `É ${designacao} (Anexo ${r.anexo ?? "?"}, item ${r.item ?? "?"})` : `Atende à descrição legal do Anexo ${r.anexo ?? "?"}, item ${r.item ?? "?"}`,
      resultado: `${r.reducaoAliquota !== null && r.reducaoAliquota >= 1 ? "Redução de 100%" : `Redução de ${pct(r.reducaoAliquota)}`} · CST ${r.cst ?? "?"} · cClassTrib ${r.cClassTrib ?? "?"}`,
      explicacao: `${r.fundamentoLegal ?? "LC 214/2025"}. Vale só se o produto corresponder à descrição legal da regra.`,
      naoRecomendada: descricaoContradiz(produto, r.descricaoLegal, r.descricaoNcmTipi),
    };
  });

  if (regras.some((r) => r.anexo !== null && ANEXOS_ALIMENTOS.has(r.anexo))) {
    opcoes.push({
      tipo: "CONSUMO_NO_LOCAL",
      regraId: null,
      rotulo: "Preparado e servido para consumo no local (bar, restaurante, lanchonete)",
      resultado: `Redução de 40% · CST ${REGIME_CONSUMO_NO_LOCAL.cst} · cClassTrib ${REGIME_CONSUMO_NO_LOCAL.cClassTrib}`,
      explicacao: `Regime específico de bares e restaurantes (${REGIME_CONSUMO_NO_LOCAL.fundamento}). Não vale para venda de mercadoria para levar.`,
      naoRecomendada: null,
    });
  }

  const reducoes = [...new Set(regras.map((r) => r.reducaoAliquota).filter((r): r is number => r !== null))].sort((a, b) => b - a);
  const verificadas = regras.length
    ? `Regras de benefício do NCM ${ncm} verificadas: ${regras.map((r) => `Anexo ${r.anexo ?? "?"} (${pct(r.reducaoAliquota)})`).join(", ")}.`
    : `Nenhuma regra de benefício para o NCM ${ncm}.`;
  const sem60 = reducoes.some((r) => Math.abs(r - 0.6) < 1e-9) ? "" : ` Não há regra de redução de 60% para o NCM ${ncm}.`;
  opcoes.push({
    tipo: "MERCADORIA_SEM_BENEFICIO",
    regraId: null,
    rotulo: `Vendido como mercadoria; não corresponde às regras acima; NCM ${ncm} correto`,
    resultado: "Tributação integral · CST 000 · cClassTrib 000001",
    explicacao: `${verificadas}${sem60} O regime de bares e restaurantes não se aplica a mercadoria.`,
    naoRecomendada: null,
  });

  opcoes.push({
    tipo: "NCM_INCORRETO",
    regraId: null,
    rotulo: "O NCM informado está errado",
    resultado: "Corrigir o NCM no cadastro do ERP e reprocessar com as novas notas",
    explicacao: "Nenhum benefício é aplicado agora: o benefício de outro NCM não é transferido para o NCM informado.",
    naoRecomendada: null,
  });

  return opcoes;
}
