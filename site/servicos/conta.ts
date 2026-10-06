/**
 * Fachada única usada pelas telas: conta, assinatura e acesso em uma chamada.
 * As telas não importam provedores diretamente; só daqui.
 */
import { planoPorId, type Plano } from "../config/planos.js";
import { situacaoDeAcesso, type SituacaoAcesso } from "./acesso.js";
import { provedorAutenticacao, provedorPagamento } from "./provedores/index.js";
import type { Assinatura, Sessao } from "./tipos.js";

export const autenticacao = provedorAutenticacao;
export const pagamento = provedorPagamento;

export interface EstadoConta {
  sessao: Sessao | null;
  assinatura: Assinatura | null;
  plano: Plano | undefined;
  acesso: SituacaoAcesso;
}

export async function carregarConta(): Promise<EstadoConta> {
  const sessao = await autenticacao.sessaoAtual();
  const assinatura = sessao ? await pagamento.assinaturaAtual(sessao.usuario) : null;
  return { sessao, assinatura, plano: planoPorId(assinatura?.planoId), acesso: situacaoDeAcesso(sessao, assinatura) };
}
