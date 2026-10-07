/**
 * Dados comerciais do produto, usados pelo site de venda e pela área do cliente.
 *
 * Campo `null` aparece na tela como "a definir" (classe .a-definir), fácil de
 * localizar e substituir.
 */
export const produto = {
  nome: "Conformidade IBS/CBS",
  marca: "Sabores Estratégicos",
  slogan: "Seu cadastro pode estar colocando imposto a mais nas suas notas.",
  descricaoCurta:
    "Envie seus XMLs de venda e descubra quais produtos estão com o IBS/CBS diferente da regra, onde a redução pode ter ficado de fora e o que ajustar no cadastro.",

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

  /**
   * Quem está por trás do produto (seção "Quem está por trás" da landing).
   * Campo null aparece como "a definir". Preencha só com fatos que possam ser confirmados.
   */
  responsavel: {
    nome: "Nilva Rodrigues Cota" as string | null,
    /** Especialidade em uma linha. */
    especialidade: null as string | null,
    /** Experiência em até duas frases. */
    experiencia: null as string | null,
    /** Por que a análise existe, em uma ou duas frases. */
    motivo: "Nasceu da necessidade de transformar a complexidade da Reforma Tributária em uma análise prática: identificar o que está correto, o que precisa ser revisado e onde pode haver imposto calculado a mais." as string | null,
    /** Caminho da foto (retrato 4:5) dentro de site/imagens/, ex.: "site/imagens/nilva.jpg". */
    foto: null as string | null,
  },

  anoCopyright: 2026,
};

export type Produto = typeof produto;
