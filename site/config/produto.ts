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
    instagram: "nilvarodriguesoficial" as string | null,
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
   * Campo null aparece como "a definir"; os campos opcionais (destaque, formação, citação,
   * local e links) somem quando vazios. Preencha só com fatos que possam ser confirmados.
   */
  responsavel: {
    nome: "Nilva Rodrigues Cota" as string | null,
    /** Especialidade em uma linha. */
    especialidade: "Consultora em gestão e negócios para o setor de alimentação: administração, finanças, gestão tributária e processos de padarias, cafeterias, indústrias de alimentos e distribuidoras." as string | null,
    /** Experiência em até duas frases. Os "+20 anos" estão em `destaque`; se ele sair, volte com eles para cá. */
    experiencia: "Oito anos como diretora-geral em indústria de alimentos, no comando de operação, equipe e resultado." as string | null,
    /** Por que a análise existe, em uma ou duas frases. */
    motivo: "O Conformidade IBS/CBS nasceu da necessidade de transformar a complexidade da Reforma Tributária em uma análise prática: identificar o que está correto, o que precisa ser revisado e onde pode haver imposto calculado a mais." as string | null,
    /** Caminho da foto (retrato 4:5) dentro de site/imagens/, ex.: "site/imagens/nilva.jpg". */
    foto: "site/imagens/nilva-rodrigues.webp" as string | null,
    /** Número em destaque sobre a foto; sem foto, não aparece. */
    destaque: { valor: "+20 anos", texto: "de gestão no setor alimentício" } as { valor: string; texto: string } | null,
    /** Formação, na ordem em que aparece; `destaque` marca o curso ligado à análise. */
    formacao: [
      { curso: "Reforma Tributária do Consumo", nivel: "MBA", destaque: true },
      { curso: "Ciências Contábeis", nivel: "Graduação" },
      { curso: "Finanças e Controladoria", nivel: "MBA" },
      { curso: "Planejamento Estratégico e Custos", nivel: "Pós-graduação" },
      { curso: "Engenharia de Produção", nivel: "Pós-graduação" },
      { curso: "Análise e Auditoria Trabalhista", nivel: "Especialização" },
      { curso: "Auditoria e Perícia Previdenciária Trabalhista", nivel: "Extensão" },
    ] as { curso: string; nivel: string; destaque?: boolean }[],
    /** Frase da responsável, exibida abaixo da foto. */
    citacao: "Gestão boa não é a mais complexa. É a que o dono consegue acompanhar todos os dias." as string | null,
    /** Região de atendimento, como no cartão (fica junto dos contatos). */
    local: "Florianópolis e região" as string | null,
    /** Endereços completos; os vazios não aparecem. */
    linkedin: "https://www.linkedin.com/in/nilva-rodrigues-bb845122/" as string | null,
    site: "https://saboresestrategicos.com.br" as string | null,
  },

  anoCopyright: 2026,
};

export type Produto = typeof produto;
