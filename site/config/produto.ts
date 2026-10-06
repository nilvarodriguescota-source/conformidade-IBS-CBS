/**
 * Dados comerciais do produto, usados pelo site de venda e pela área do cliente.
 *
 * Tudo que ainda não foi definido pelo negócio fica como `null` e aparece na tela
 * como "a definir" (classe .a-definir), fácil de localizar e substituir.
 */
export const produto = {
  nome: "Conformidade IBS/CBS",
  marca: "Sabores Estratégicos",
  slogan: "Cada nota conferida. Cada imposto no lugar certo.",
  descricaoCurta:
    "Confira o CST e o cClassTrib de IBS/CBS dos seus XMLs de venda, descubra o imposto pago a mais e saiba exatamente o que ajustar no cadastro dos produtos.",

  /** Página do sistema atual (análise de XMLs). Fica no mesmo site, fora do site de venda. */
  enderecoSistema: "sistema.html",

  contato: {
    /** A DEFINIR: e-mail de suporte exibido no rodapé, no FAQ e na área do cliente. */
    emailSuporte: null as string | null,
    /** A DEFINIR: WhatsApp comercial, só números com DDI (ex.: "5548999999999"). */
    whatsapp: null as string | null,
    /** A DEFINIR: horário de atendimento. */
    horario: null as string | null,
  },

  empresa: {
    /** A DEFINIR: razão social e CNPJ de quem vende a assinatura (rodapé e documentos legais). */
    razaoSocial: null as string | null,
    cnpj: null as string | null,
  },

  anoCopyright: 2026,
};

export type Produto = typeof produto;
