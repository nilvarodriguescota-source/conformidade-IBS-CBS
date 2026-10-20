/**
 * Contratos da camada de serviços do site (contas, assinaturas e pagamentos).
 *
 * As telas só conversam com estas interfaces. Trocar Supabase ou Kiwify por outro serviço
 * é implementar estes contratos; nenhuma tela precisa mudar.
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
  /** Quem registrou: "kiwify" ou "manual" (liberado pelo painel do Supabase). */
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

/** XMLs de venda analisados no mês (horário de Brasília) e limite do plano (null = sem limite). */
export interface UsoXmls {
  /** "AAAA-MM" */
  mes: string;
  usados: number;
  limite: number | null;
}

/** Resposta do banco ao pedido de registrar as notas de uma análise. */
export interface ResultadoUsoXmls extends UsoXmls {
  permitido: boolean;
  /** Por que foi recusado: limite do plano, sem login, sem assinatura liberada ou lista inválida. */
  motivo?: "limite" | "sem_sessao" | "sem_assinatura" | "lista_invalida";
  /** Notas desta análise que ainda não tinham sido contadas no mês. */
  novos: number;
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
 *  - "confirmado": a assinatura já está ativa (provedor que confirma na hora; a Kiwify não faz isso).
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
  /** Login sem senha: manda por e-mail um link que já entra na conta e abre `voltar`. Não revela se o e-mail existe. Opcional. */
  enviarLinkDeAcesso?(email: string, voltar: string): Promise<void>;
  /** Grava a senha de quem chegou pelo convite ou pelo link de redefinição (já logado pelo link). Opcional. */
  definirSenha?(novaSenha: string): Promise<void>;
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
  /** Uso de XMLs no mês e limite do plano de quem está logado (null sem login ou sem assinatura). */
  usoDeXmlsDoMes(): Promise<UsoXmls | null>;
  /**
   * Conta as notas de uma análise no mês (códigos anônimos; a mesma nota não conta duas vezes).
   * Se passarem do limite do plano, nada é registrado e o resultado vem com permitido = false.
   */
  registrarUsoDeXmls(notas: string[]): Promise<ResultadoUsoXmls>;
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
