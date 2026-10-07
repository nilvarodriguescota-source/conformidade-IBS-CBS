/**
 * Registro dos provedores disponíveis. O nome escolhido em config/integracoes.ts
 * decide qual implementação as telas usam.
 *
 * Para adicionar um provedor real: importe-o aqui e inclua-o no mapa correspondente.
 */
import { integracoes } from "../../config/integracoes.js";
import type { ProvedorAutenticacao, ProvedorPagamento } from "../tipos.js";
import { autenticacaoDemonstracao, pagamentoDemonstracao } from "./demonstracao.js";
import { autenticacaoPendente, pagamentoPendente } from "./pendente.js";

const autenticacao: Record<string, ProvedorAutenticacao> = {
  demonstracao: autenticacaoDemonstracao,
  // "nome-do-provedor": autenticacaoReal,
};

const pagamento: Record<string, ProvedorPagamento> = {
  demonstracao: pagamentoDemonstracao,
  // "nome-do-gateway": pagamentoReal,
};

/** Em produção, o modo demonstração nunca é usado, mesmo que esteja configurado por engano. */
function escolher<T>(mapa: Record<string, T>, nome: string, pendente: T): T {
  if (integracoes.modo === "producao" && nome === "demonstracao") return pendente;
  return mapa[nome] ?? pendente;
}

export const provedorAutenticacao = escolher(autenticacao, integracoes.autenticacao.provedor, autenticacaoPendente);
export const provedorPagamento = escolher(pagamento, integracoes.pagamento.provedor, pagamentoPendente);
