/**
 * Contratos da camada de serviços do site (contas, assinaturas e pagamentos).
 *
 * As telas só conversam com estas interfaces. Trocar o modo demonstração por um
 * provedor real é implementar estes contratos; nenhuma tela precisa mudar.
 */

export type CicloCobranca = "mensal" | "anual";

export type StatusAssinatura =
  /** Conta criada, pagamento ainda não confirmado pelo gateway. */
  | "pendente_pagamento"
  /** Pagamento confirmado: acesso liberado. */
  | "ativa"
  /** Cobrança recorrente falhou: acesso pode ser mantido por um período de carência. */
  | "em_atraso"
  /** Cancelada pelo cliente ou por falta de pagamento: acesso encerrado no fim do período pago. */
  | "cancelada";

export type FormaPagamento = "cartao" | "pix" | "boleto";

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  empresa: string | null;
  cnpj: string | null;
  telefone: string | null;
  criadoEm: string;
}

export interface Sessao {
  usuario: Usuario;
  iniciadaEm: string;
}

export interface Assinatura {
  id: string;
  usuarioId: string;
  planoId: string;
  ciclo: CicloCobranca;
  status: StatusAssinatura;
  criadaEm: string;
  /** Início do período pago atual (null enquanto o pagamento não for confirmado). */
  inicioPeriodo: string | null;
  /** Fim do período pago atual / próxima cobrança. */
  fimPeriodo: string | null;
  canceladaEm: string | null;
  formaPagamento: FormaPagamento | null;
  /** Quem registrou: "demonstracao" ou o nome do gateway. */
  origem: string;
}

export interface Pagamento {
  id: string;
  data: string;
  descricao: string;
  valor: number;
  status: "pago" | "pendente" | "falhou" | "estornado";
  /** Link do comprovante/fatura no gateway, quando houver. */
  urlComprovante: string | null;
}

export interface DadosCadastro {
  nome: string;
  email: string;
  senha: string;
  empresa: string | null;
  cnpj: string | null;
  telefone: string | null;
}

export interface DadosPerfil {
  nome: string;
  empresa: string | null;
  cnpj: string | null;
  telefone: string | null;
}

export interface PedidoCheckout {
  usuario: Usuario;
  planoId: string;
  ciclo: CicloCobranca;
  formaPagamento: FormaPagamento;
}

/**
 * Resultado do checkout:
 *  - "redirecionar": o gateway hospeda a página de pagamento (forma recomendada:
 *    nenhum dado de cartão passa pelo site). A liberação da conta chega depois,
 *    pelo webhook do gateway no servidor.
 *  - "confirmado": a assinatura já está ativa (só o modo demonstração faz isso).
 */
export type ResultadoCheckout =
  | { tipo: "redirecionar"; url: string }
  | { tipo: "confirmado"; assinatura: Assinatura };

export interface ProvedorAutenticacao {
  readonly nome: string;
  sessaoAtual(): Promise<Sessao | null>;
  cadastrar(dados: DadosCadastro): Promise<Sessao>;
  entrar(email: string, senha: string): Promise<Sessao>;
  sair(): Promise<void>;
  /** Pede o e-mail de redefinição. Não revela se o e-mail existe. */
  solicitarRedefinicaoSenha(email: string): Promise<void>;
  atualizarPerfil(dados: DadosPerfil): Promise<Usuario>;
  alterarSenha(senhaAtual: string, novaSenha: string): Promise<void>;
  excluirConta(): Promise<void>;
}

export interface ProvedorPagamento {
  readonly nome: string;
  assinaturaAtual(usuario: Usuario): Promise<Assinatura | null>;
  /** Guarda o plano escolhido no cadastro como assinatura pendente, antes do pagamento. */
  registrarEscolhaDePlano(usuario: Usuario, planoId: string, ciclo: CicloCobranca): Promise<Assinatura>;
  iniciarCheckout(pedido: PedidoCheckout): Promise<ResultadoCheckout>;
  trocarPlano(usuario: Usuario, planoId: string, ciclo: CicloCobranca): Promise<Assinatura>;
  cancelarAssinatura(usuario: Usuario): Promise<Assinatura>;
  historicoPagamentos(usuario: Usuario): Promise<Pagamento[]>;
}

/** Erro de regra de negócio, com mensagem pronta para a tela. */
export class ErroServico extends Error {
  constructor(
    mensagem: string,
    readonly codigo: string = "erro",
  ) {
    super(mensagem);
    this.name = "ErroServico";
  }
}

/** Integração chamada mas ainda não implementada (modo produção sem provedor). */
export class IntegracaoPendente extends ErroServico {
  constructor(qual: string) {
    super(
      `A integração de ${qual} ainda não foi configurada. Assim que o provedor for conectado, esta ação passa a funcionar.`,
      "integracao_pendente",
    );
    this.name = "IntegracaoPendente";
  }
}
