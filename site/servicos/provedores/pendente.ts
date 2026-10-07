/**
 * Provedores usados quando o site está em modo "producao" mas a integração real
 * ainda não foi implementada. Não simulam nada: cada ação avisa que a integração
 * está pendente, e a sessão é sempre vazia (ninguém entra sem um login real).
 *
 * PONTO DE IMPLEMENTAÇÃO: crie, ao lado deste arquivo, um módulo que implemente
 * ProvedorAutenticacao (login) e outro para ProvedorPagamento (gateway), seguindo
 * os contratos de ../tipos.ts, e registre-os em ./index.ts.
 */
import { IntegracaoPendente, type ProvedorAutenticacao, type ProvedorPagamento } from "../tipos.js";

const auth = () => Promise.reject(new IntegracaoPendente("autenticação"));
const pagamento = () => Promise.reject(new IntegracaoPendente("pagamento"));

export const autenticacaoPendente: ProvedorAutenticacao = {
  nome: "pendente",
  sessaoAtual: async () => null,
  cadastrar: auth,
  entrar: auth,
  sair: async () => undefined,
  solicitarRedefinicaoSenha: auth,
  atualizarPerfil: auth,
  alterarSenha: auth,
  excluirConta: auth,
};

export const pagamentoPendente: ProvedorPagamento = {
  nome: "pendente",
  assinaturaAtual: async () => null,
  registrarEscolhaDePlano: pagamento,
  iniciarCheckout: pagamento,
  trocarPlano: pagamento,
  cancelarAssinatura: pagamento,
  historicoPagamentos: async () => [],
};
