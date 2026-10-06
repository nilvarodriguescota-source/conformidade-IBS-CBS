/**
 * Integrações externas do site: autenticação e pagamento.
 *
 * Nenhum provedor real foi fornecido até aqui. Por isso o site roda em
 * MODO DEMONSTRAÇÃO: contas e assinaturas ficam só no navegador de quem testa,
 * nenhum valor é cobrado e todas as telas avisam isso.
 *
 * Para ligar um provedor real (ver site/README.md):
 *   1. implemente ProvedorAutenticacao / ProvedorPagamento em servicos/provedores/;
 *   2. registre-o em servicos/provedores/index.ts;
 *   3. troque o nome abaixo e passe `modo` para "producao".
 * Com `modo: "producao"` e um provedor ainda não implementado, as telas mostram
 * "integração pendente" em vez de simular um resultado.
 */
export type ModoIntegracao = "demonstracao" | "producao";

export const integracoes = {
  modo: "demonstracao" as ModoIntegracao,

  autenticacao: {
    /** "demonstracao" | nome do provedor real a implementar (ex.: o serviço de login escolhido). */
    provedor: "demonstracao",
  },

  pagamento: {
    /** "demonstracao" | nome do gateway real a implementar. */
    provedor: "demonstracao",
    /** Formas de pagamento exibidas no checkout. Dependem do gateway escolhido (EXEMPLO). */
    formas: ["cartao", "pix", "boleto"] as Array<"cartao" | "pix" | "boleto">,
  },
};

export function emDemonstracao(): boolean {
  return integracoes.modo === "demonstracao";
}
