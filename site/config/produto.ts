/**
 * Dados comerciais do produto, usados pelo site de venda e pela área do cliente.
 *
 * Campo `null` aparece na tela como "a definir" (classe .a-definir), fácil de
 * localizar e substituir.
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
    /** E-mail de suporte exibido no rodapé, no FAQ e na área do cliente. */
    emailSuporte: "saboresestrategicosconsultoria@gmail.com" as string | null,
    /** WhatsApp, só números com DDI e DDD (o site formata para exibir). */
    whatsapp: "5548991040611" as string | null,
    /** Instagram, sem o @. */
    instagram: "nilva.consultoria" as string | null,
    /** Entra no meio de frases ("Fale com a gente em horário comercial") e sozinho no rodapé. */
    horario: "horário comercial" as string | null,
  },

  empresa: {
    /** Quem vende a assinatura (rodapé e documentos legais). */
    razaoSocial: "SABORES ESTRATEGICOS CONSULTORIA LTDA - ME" as string | null,
    cnpj: "34.545.200/0001-41" as string | null,
  },

  anoCopyright: 2026,
};

export type Produto = typeof produto;
