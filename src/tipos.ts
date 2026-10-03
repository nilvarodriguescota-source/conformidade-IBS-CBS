/** Tipos do domínio: documento fiscal, base normativa e veredito. */

export type Regime = "normal" | "simples" | "mei";

/** Como o item é fornecido. Define se cabe o regime de bares e restaurantes. */
export type NaturezaItem =
  | "mercadoria" // venda de produto, inclusive congelado e de padaria
  | "preparado_no_local" // alimentação ou bebida não alcoólica preparada e servida no estabelecimento
  | "bebida_alcoolica"
  | "servico";

export interface Empresa {
  cnpj: string;
  nome?: string;
  regime: Regime;
  /** Marcação por cliente: atende consumo no local (bar, restaurante, lanchonete, cafeteria). */
  barOuRestaurante?: boolean;
  uf?: string;
}

export interface ItemDocumento {
  nItem: number;
  cProd: string;
  xProd: string;
  ncm: string | null;
  cfop: string | null;
  quantidade: number | null;
  valorProduto: number;
  desconto: number;
  /** Base de cálculo de IBS/CBS informada no XML (vBC do grupo IBSCBS). */
  baseCalculo: number | null;
  /** Valores de IBS e CBS efetivamente informados no XML, quando presentes. */
  valorIBSInformado?: number | null;
  valorCBSInformado?: number | null;
  cst: string | null;
  cClassTrib: string | null;
  /** Alíquotas informadas no grupo IBSCBS, quando presentes. */
  aliquotas: { cbs?: number; ibsUF?: number; ibsMun?: number; reducao?: number };
  /** Natureza atribuída ao item; sem atribuição o motor não presume. */
  natureza?: NaturezaItem;
}

export interface Documento {
  chave: string | null;
  modelo: string | null; // 55 (NF-e) ou 65 (NFC-e)
  numero: string | null;
  serie: string | null;
  dataEmissao: string | null; // ISO
  tipoOperacao: "entrada" | "saida" | null; // tpNF
  finalidade: string | null; // finNFe: 1 normal, 2 complementar, 3 ajuste, 4 devolução
  situacao: string | null; // cStat do protocolo
  cancelado: boolean;
  emitente: { cnpj: string | null; crt: string | null; uf: string | null };
  destinatario: { cnpj: string | null; cpf: string | null; uf: string | null; indIEDest: string | null };
  itens: ItemDocumento[];
  arquivo: string;
  avisos: string[];
}

export interface RegraClassificacao {
  id: string;
  ncm: string;
  cst: string;
  cClassTrib: string;
  tratamento: "aliquota_zero" | "reducao_60" | "reducao_40";
  reducaoAliquota: number; // 1.00 = alíquota zero; 0.60 = redução de 60%
  anexo: string;
  item: string;
  fundamentoLegal: string;
  rotulo: string;
  descricaoLegal: string;
  descricaoNcmTipi?: string;
  ncmCitadoNaLei?: string;
  origemRegistro?: string;
  observacao?: string;
  vigenciaInicio: string;
  vigenciaFim: string | null;
  fonte: string;
}

export interface BaseNormativa {
  versao: string;
  origem: string;
  catalogoCodigos: Record<string, { anexo: string; artigo: string; reducao: number; rotulo: string }>;
  regras: RegraClassificacao[];
}

/** Alíquota de referência vigente num período, com fonte. */
export interface ParametroAliquota {
  tributo: "CBS" | "IBS";
  inicio: string;
  fim: string | null;
  aliquota: number;
  tipo: "vigente" | "projecao";
  fonte: string;
}

export type EstadoVeredito =
  | "CORRETO"
  | "INCORRETO_ECONOMIA" // pagou a mais: havia benefício aplicável e não foi usado
  | "INCORRETO_RISCO" // pagou a menos: usou benefício sem regra que o ampare
  | "REQUER_VALIDACAO" // depende da descrição legal ou há conflito entre anexos
  | "NAO_OBRIGATORIO" // preenchimento ainda não exigido na data/regime
  | "INCORRETO_NCM" // a validação humana indicou NCM errado: ajustar o NCM no ERP
  /** Não é mais gerado pelo motor (os casos vão para REQUER_VALIDACAO); mantido para ler análises antigas. */
  | "INDETERMINADO";

/** Regra localizada pelo NCM e rejeitada para o produto concreto (regra encontrada ≠ benefício aplicável). */
export interface RegraNaoAplicavel {
  regraId: string;
  cst: string;
  cClassTrib: string;
  anexo: string;
  item: string;
  fundamentoLegal: string;
  /** Percentual previsto na hipótese legal; não é o percentual do produto. */
  reducaoPrevista: number;
  designacaoLegal: string;
  motivo: string;
}

export interface Veredito {
  documento: string;
  nItem: number;
  cProd: string;
  produto: string;
  ncm: string | null;
  informado: { cst: string | null; cClassTrib: string | null };
  esperado: { cst: string; cClassTrib: string } | null;
  estado: EstadoVeredito;
  motivo: string;
  regraAplicada: string | null;
  regrasCandidatas: string[];
  baseCalculo: number;
  valorIBSInformado: number | null;
  valorCBSInformado: number | null;
  valorInformadoTotal: number | null;
  valorPago: number | null;
  valorCorreto: number | null;
  economiaPotencial: number | null;
  /** Estimativa para item pendente de validação que usa tributação integral (menor redução entre as candidatas). Não é economia confirmada. */
  economiaSujeitaValidacao?: number | null;
  exposicao: number | null;
  aliquotaUsada: { tributo: string; aliquota: number; fonte: string; tipo: string }[];
  dadosFaltantes: string[];
  versaoBase: string;
  calculadoEm: string;
  /** Fase 2: regras do NCM bloqueadas por incompatibilidade oficial (não são candidatas). Só aparece quando há bloqueio. */
  regrasBloqueadas?: string[];
  /** A validação humana indicou que o NCM informado está errado: corrigir no ERP e reprocessar. */
  ncmACorrigir?: boolean;
  /**
   * Regras encontradas pelo NCM, mas NÃO aplicáveis a este produto: a descrição do produto contradiz a
   * descrição legal específica da regra. O percentual delas não entra em nenhum valor do item.
   */
  regrasNaoAplicaveis?: RegraNaoAplicavel[];
}

/**
 * Escolha feita na pergunta de múltipla escolha ("O que é este produto?"). Vai
 * gravada com resposta NAO nas regras candidatas, para continuar compatível com
 * quem só lê SIM/NÃO.
 *   CONSUMO_NO_LOCAL         — preparado e servido no local: regime de bares e restaurantes (art. 275)
 *   MERCADORIA_SEM_BENEFICIO — mercadoria, NCM correto, nenhuma regra se aplica: integral verificada
 *   NCM_INCORRETO            — o NCM informado está errado: corrigir no ERP; nenhum benefício transferido
 */
export type EscolhaValidacao = "CONSUMO_NO_LOCAL" | "MERCADORIA_SEM_BENEFICIO" | "NCM_INCORRETO";

export interface RespostaValidacao {
  ncm: string;
  cProd: string;
  regraId: string;
  resposta: "SIM" | "NAO";
  autor: string;
  data: string;
  justificativa?: string;
  escolha?: EscolhaValidacao;
}







// ---------------------------------------------------------------------------
// Etapa 7: tipos estruturais da base v2 (docs/etapa7/especificacao-tipos.md).
//
// Só tipos: nada aqui é lido pelo motor nem muda veredito. Todo campo novo em
// tipo existente é opcional. Regras fixadas pela especificação:
//   - NORMA_CONFIRMADA != BENEFICIO_CONFIRMADO: status normativo e status do
//     benefício são tipos separados; BENEFICIO_CONFIRMADO exige HumanoConfirmou.
//   - Decisões D2 a D7 não têm valor padrão: ficam em DecisaoPendente.
//   - As respostas antigas do empresa.json (RespostaValidacao) são ValidacaoLegada
//     e nunca viram HumanoConfirmou por conversão de tipo.
//   - Lacuna não é regra nem StatusNormativo.
// ---------------------------------------------------------------------------

/** Fontes registradas no bloco fontes da v2 (Etapa 4). */
export type IdFonte = "F1" | "F2" | "PLANILHA";

/** Ids dos arquivos registrados em fontes.registros[].arquivos[].id. */
export type IdArquivoFonte =
  | "PLANILHA.xlsm" | "PLANILHA.base-de-dados" | "PLANILHA.legenda-e-manual" | "PLANILHA.base-cbs"
  | "F1.html" | "F2.html" | "F2.headers" | "F2.extracao";

/**
 * Referência a uma regra. O regraId NÃO é único (23080000-200038-IX-23.06 aparece nas
 * linhas 776 e 777); por isso a referência leva também o índice e a linha da planilha.
 */
export interface RefRegra {
  indice: number;
  /** Linha na planilha; null nas regras incluídas pela decisão D5. */
  linha: number | null;
  regraId: string;
  ncm: string;
}

export type IdDecisao = "D2" | "D3" | "D4" | "D5" | "D6" | "D7";

/** Decisão ainda não tomada. Não há valor padrão: o campo fica neste estado até a decisão. */
export interface DecisaoPendente<D extends IdDecisao> {
  status: "pendente";
  decisao: D;
  /** Opções em discussão, só como texto; nenhuma é aplicada. */
  opcoes?: string[];
}

/** Decisão tomada por pessoa identificada. */
export interface DecisaoTomada<D extends IdDecisao, T> {
  status: "decidida";
  decisao: D;
  valor: T;
  autor: AutorHumano;
  data: string;
  justificativa: string;
}

/**
 * Autor humano.
 *
 * LIMITAÇÃO CONHECIDA: o TypeScript não consegue excluir o texto "Sistema" de `nome`
 * (não há tipo "qualquer string exceto X"). O tipo exige `tipo: "humano"`, mas quem
 * informar nome "Sistema" passa pela checagem de tipos. A recusa é responsabilidade do
 * ponto de validação em runtime (ValidadorAutorHumano), ainda não implementado.
 */
export interface AutorHumano {
  tipo: "humano";
  nome: string;
}

/**
 * PONTO DE VALIDAÇÃO EM RUNTIME (etapa futura). Contrato da função que deverá ser
 * chamada antes de criar qualquer AutorHumano a partir de texto externo. Só o contrato
 * existe; nenhuma implementação, lista de nomes ou convenção foi definida aqui.
 */
export type ValidadorAutorHumano = (nome: string) =>
  | { ok: true; autor: AutorHumano }
  | { ok: false; motivo: string };

// ---------- camada FONTE_DIZ ----------

export type LocalizacaoF1 = { dispositivo: string; ancora: string };
export type LocalizacaoF2 =
  | { cst: string; cClassTrib: string; campo: string }
  | { cst: string; cClassTrib: string; anexo: { CodIntProdServ: number } };
export type LocalizacaoPlanilha = { aba: string; linha: number; coluna: string };

/** Fato literal de uma fonte registrada. */
export interface FonteDiz {
  /** Opcional para que os fatos já gravados na Etapa 5 (sem este campo) continuem válidos. */
  camada?: "FONTE_DIZ";
  fonte: IdFonte;
  arquivo: IdArquivoFonte;
  sha256: string;
  natureza: string;
  versao: string;
  dataConsulta: string;
  localizacao: LocalizacaoF1 | LocalizacaoF2 | LocalizacaoPlanilha;
  /** F1: parágrafo ou linha de tabela, como aparece no texto vigente. */
  trecho?: string;
  /** F2: valor literal do campo ou da entrada. */
  valor?: unknown;
  /** F2: arquivo derivado que contém o mesmo valor. */
  extracao?: { arquivo: "F2.extracao"; sha256: string };
  /** F1, anexos: posição da linha na tabela. */
  linhaTabela?: number;
}

// ---------- camada SISTEMA_INFERE ----------

/** Regras de leitura que o sistema aplica sobre fatos. Lista fechada: nada fora dela é inferido. */
export type RegraDeInferencia =
  | "cobertura_ncm_por_prefixo"      // 8517.62.7 cobre 85176272
  | "anexo_arabico_romano"           // NroAnexo 6 = Anexo VI
  | "percentual_para_fracao"         // 60% = reducaoAliquota 0.6
  | "vigencia_art544_por_exclusao"   // arts. 133 e 142 não constam dos incisos I a V
  | "comparacao_item"                // item da regra × itens das fontes
  | "comparacao_presenca_ncm"        // NCM na F1 × NCM na F2
  | "comparacao_fundamento";         // dispositivo da regra × dispositivo oficial

export interface SistemaInfere {
  camada: "SISTEMA_INFERE";
  regra: RegraDeInferencia;
  /** Fatos em que a inferência se apoia. */
  premissas: FonteDiz[];
  /** Frase para o usuário, sempre com o sistema como sujeito ("O sistema comparou…"). */
  conclusao: string;
  valor?: unknown;
}

// ---------- camada HUMANO_CONFIRMOU e validações ----------

/** Chave da validação: depende da natureza da condição (matriz, situação 11). */
export type ChaveValidacao =
  | { tipo: "produto"; ncm: string; cProd: string; regra: RefRegra }
  | { tipo: "adquirente"; cnpjDestinatario: string; regra: RefRegra }
  | { tipo: "item_do_anexo"; ncm: string; cProd: string; regra: RefRegra; itemEscolhido: string };

export interface ValidacaoHumana {
  id: string;
  chave: ChaveValidacao;
  resposta: "SIM" | "NAO";
  autor: AutorHumano;
  data: string;
  /** Obrigatória: sem justificativa não há confirmação. */
  justificativa: string;
  evidencia?: string;
  /** Hash das fontes na data da resposta; se mudar, a validação deixa de valer. */
  fontesNaData: { arquivo: IdArquivoFonte; sha256: string }[];
}

export interface HumanoConfirmou {
  camada: "HUMANO_CONFIRMOU";
  validacao: ValidacaoHumana;
}

/**
 * Registro que já existe no empresa.json (RespostaValidacao), preservado como está.
 * Nunca é HumanoConfirmou por si só.
 */
export interface ValidacaoLegada {
  origem: "empresa.json";
  registro: RespostaValidacao;
  classificacao:
    | "autor_sistema_nao_e_confirmacao_humana"       // autor === "Sistema"
    | "autor_humano_sem_justificativa"               // pessoa, mas sem justificativa
    | "chave_por_regraid_duplicado"                  // regraId repetido na base
    | "chave_por_produto_em_condicao_de_adquirente"   // 200043
    | "sem_hash_das_fontes_na_data";                 // autor humano e justificativa, sem o hash das fontes na data da resposta
  /** Tratamento das respostas com autor "Sistema": decisão D6, sem padrão. */
  tratamento: DecisaoPendente<"D6"> | DecisaoTomada<"D6", "descartar" | "revalidar">;
}

// ---------- permissão SISTEMA_PODE_DECIDIR ----------

export type SituacaoMatriz = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;

export interface Bloqueio {
  motivo: string;
  situacao: SituacaoMatriz;
  /** O que fica bloqueado. */
  alcance: "enquadramento" | "item" | "calculo" | "veredito" | "reuso_de_validacao" | "tratar_como_fato";
}

/** Permissão dada pela matriz. É governança: não é afirmação sobre a lei. */
export interface PermissaoDecisao {
  camada: "SISTEMA_PODE_DECIDIR";
  versaoMatriz: string;
  situacao: SituacaoMatriz;
  mapeamento: "sim" | "parcial" | "nao";
  veredito: "sim" | "apos_validacao_humana" | "nao";
  bloqueios: Bloqueio[];
}

// ---------- status e sinalizadores ----------

/** Regra ↔ norma. Pode ser confirmado por fontes. LACUNA_FONTE_SEM_REGRA não é status de regra. */
export type StatusNormativo =
  | "NORMA_CONFIRMADA"
  | "NORMA_POSSIVEL_MULTIPLOS_ITENS"
  | "CONFLITO_PLANILHA_FONTE"
  | "CONFLITO_ENTRE_FONTES"
  | "SEM_EVIDENCIA_OFICIAL";

/**
 * Produto vendido ↔ regra. Só um humano confirma.
 * NORMA_CONFIRMADA não implica BENEFICIO_CONFIRMADO.
 */
export type StatusBeneficio =
  | { status: "BENEFICIO_NAO_AVALIADO" }
  | { status: "BENEFICIO_PENDENTE_VALIDACAO"; pergunta: string }
  | { status: "BENEFICIO_BLOQUEADO"; bloqueios: Bloqueio[] }
  | { status: "BENEFICIO_NEGADO"; confirmacao: HumanoConfirmou }
  | { status: "BENEFICIO_CONFIRMADO"; confirmacao: HumanoConfirmou };

export type Sinalizador =
  | "FUNDAMENTO_DIVERGENTE"
  | "FUNDAMENTO_A_REVISAR"
  | "VIGENCIA_AMBIGUA"
  | "DEPENDE_COMPOSICAO_PRODUTO"
  | "CONDICAO_NAO_VERIFICAVEL_NO_XML"
  | "NCM_EM_OUTROS_CODIGOS"
  | "REGRAID_DUPLICADO";

// ---------- condição de aplicação ----------

/** Texto literal da planilha, preservado sem normalização. */
export interface TextoPlanilha {
  fonte: "PLANILHA";
  aba: "Base de dados";
  linha: number;
  /** Nome do cabeçalho, como no bloco original. */
  coluna: string;
  valor: string;
}

export interface CondicaoAplicacao {
  id: string;
  cClassTrib: string;
  natureza: "destinacao" | "adquirente" | "documento_fiscal" | "composicao_produto";
  /** Texto da norma (F1), literal. */
  textoOficial: FonteDiz;
  /** Texto operacional do SVRS (F2), literal, quando houver. */
  textoOperacional?: FonteDiz;
  /** Texto da planilha, literal, quando houver. */
  textoPlanilha?: TextoPlanilha;
  verificavelPeloXml: "sim" | "nao" | "parcial";
  chaveDeValidacao: "produto" | "adquirente" | "documento";
  /** Como combinar os tipos listados (ex.: 200043, "e" × "ou"). Sem valor padrão. */
  combinacaoDosTipos?: DecisaoPendente<"D2"> | DecisaoTomada<"D2", string>;
  /** Estado para a parte verificável que contrariar a fonte (ex.: 200043 em NFC-e). */
  estadoSeContrariada?: DecisaoPendente<"D4"> | DecisaoTomada<"D4", string>;
}

// ---------- divergência ----------

export type TipoDivergencia =
  | "item_divergente"          // planilha × F1+F2
  | "ncm_so_na_F1"             // F1 × F2 (ex.: frutose)
  | "ncm_so_na_F2"
  | "fundamento_legal"         // 200043: art. 140 × art. 142, I
  | "fundamento_a_revisar"     // 200033: arts. 133 e 134 × art. 133, § 1º
  | "vigencia"
  | "regraid_duplicado"
  | "validacao_sem_autor_humano";

export interface ValorPorFonte {
  fonte: IdFonte | "BASE_ATUAL";
  valor: unknown;
  fato?: FonteDiz;
}

export interface ResolucaoDivergencia {
  autor: AutorHumano;
  data: string;
  justificativa: string;
  escolha: string;
  evidencia?: string;
}

export interface Divergencia {
  id: string;
  tipo: TipoDivergencia;
  cClassTrib?: string;
  regras: RefRegra[];
  valores: ValorPorFonte[];
  impacto: "enquadramento" | "texto" | "calculo" | "identificacao";
  status: "aberta" | "a_revisar" | "resolvida";
  /** null até uma pessoa resolver. A resolução nunca edita os dados de origem. */
  resolucao: ResolucaoDivergencia | null;
}

// ---------- evidência e lacuna ----------

/** Registro de vinculação da Etapa 5, com as camadas separadas. */
export interface Evidencia {
  id: string;
  alcance: "regra" | "codigo" | "lacuna";
  fatos: FonteDiz[];
  inferencias: SistemaInfere[];
  statusEtapa5: "inequivoco" | "ambiguo" | "conflito" | "informativo" | "sem_regra";
}

/** NCM oficial sem regra na base. Não é regra e não vira regra sem a decisão D5. */
export interface Lacuna {
  id: string;
  status: "LACUNA_FONTE_SEM_REGRA";
  cClassTrib: string;
  ncm: string;
  fatos: FonteDiz[];
  regrasDeOutrosCodigosComEstaNcm: (RefRegra & { cClassTrib: string })[];
  /** Incluir ou não como regra de origem oficial. Sem padrão. */
  inclusaoComoRegra: DecisaoPendente<"D5"> | DecisaoTomada<"D5", "incluir" | "nao_incluir">;
}

// ---------- bloco oficial ----------

/** Valor com fonte oficial. */
export interface ValorOficial<T> {
  valor: T;
  fatos: FonteDiz[];
  inferencia?: SistemaInfere;
}

/** Ausência explícita: a regra ainda não tem fonte oficial para o campo. */
export interface PendenteDeFonteOficial {
  status: "pendente_de_fonte_oficial";
}

export type Oficial<T> = ValorOficial<T> | PendenteDeFonteOficial;

export interface VigenciaOficial {
  tipo: "efeitos_da_lei" | "codigo_na_tabela" | "lista_de_ncm";
  inicio: ValorOficial<string>;
  fim?: ValorOficial<string | null>;
}

export interface ItemPossivel {
  item: string;
  descricao: string;
  fato: FonteDiz;
}

/** Item do anexo segundo as fontes, separado do item da planilha (campo item). */
export type ItemOficial =
  | { status: "confirmado"; item: ValorOficial<string> }
  | { status: "depende_do_produto"; itensPossiveis: ItemPossivel[] }
  | { status: "em_conflito"; divergencia: string };

export interface BlocoOficial {
  cst: Oficial<string>;
  cClassTrib: Oficial<string>;
  anexo: Oficial<string>;
  reducaoIBS: Oficial<number>;
  reducaoCBS: Oficial<number>;
  fundamentoLegal: Oficial<string>;
  vigencias: VigenciaOficial[] | PendenteDeFonteOficial;
  presencaNaLista: { F1: boolean; F2: boolean } | PendenteDeFonteOficial;
  item: ItemOficial | PendenteDeFonteOficial;
}

// ---------- extensões dos tipos atuais (todas opcionais) ----------

/** Bloco da Etapa 3, como já está na v2. */
export interface BlocoOriginal {
  fonte: "PLANILHA";
  aba: "Base de dados";
  linha: number;
  motivo?: "duplicata_exata";
  valores: Record<string, string | null>;
}

/** Origem das regras incluídas pela decisão D5: LC 214/2025 + SVRS, sem linha na planilha. */
export interface BlocoOriginalD5 {
  fonte: "OFICIAL_D5";
  aba: null;
  linha: null;
  decisao: "D5";
  valores: null;
  evidencia: unknown;
}

export interface RegraClassificacaoV2 extends RegraClassificacao {
  original?: BlocoOriginal | BlocoOriginalD5;
  originaisAgrupados?: BlocoOriginal[];
  /** Substituto do regraId como chave. Formato: decisão D7, sem padrão. */
  chaveEstavel?: DecisaoPendente<"D7"> | DecisaoTomada<"D7", string>;
  statusNormativo?: StatusNormativo;
  sinalizadores?: Sinalizador[];
  /** Ids de Evidencia. */
  evidencias?: string[];
  oficial?: BlocoOficial;
  /** Ids de CondicaoAplicacao. */
  condicoes?: string[];
  /** Ids de Divergencia. */
  divergencias?: string[];
  /** Política para regra sem evidência oficial. Sem padrão. */
  politicaSemEvidencia?: DecisaoPendente<"D3"> | DecisaoTomada<"D3", string>;
}

export interface BaseNormativaV2 extends BaseNormativa {
  regras: RegraClassificacaoV2[];
  /** Bloco da Etapa 4, já na v2 (tipo detalhado numa etapa própria). */
  fontes?: unknown;
  /** Bloco da Etapa 5, já na v2. */
  vinculacoes?: unknown;
  condicoes?: CondicaoAplicacao[];
  divergencias?: Divergencia[];
  lacunas?: Lacuna[];
  validacoesLegadas?: ValidacaoLegada[];
}

export interface ExplicacaoVeredito {
  statusNormativo: StatusNormativo;
  statusBeneficio: StatusBeneficio;
  fonteDiz: FonteDiz[];
  sistemaInfere: SistemaInfere[];
  humanoConfirmou: HumanoConfirmou[];
  permissao: PermissaoDecisao;
  sinalizadores: Sinalizador[];
  divergenciasAplicaveis: string[];
  nivelEvidencia: "oficial" | "planilha" | "divergente" | "pendente";
}

export interface VereditoExplicado extends Veredito {
  /** Reservada para a fase em que a matriz poderá influenciar a decisão. */
  explicacao?: ExplicacaoVeredito;
  /** Fase A: explicação somente informativa, produzida depois do motor. */
  explicacaoInformativa?: ExplicacaoInformativa;
}

/** Dado do destinatário para a chave por adquirente (200043). O XML não traz a natureza jurídica. */
export interface DestinatarioAmpliado {
  naturezaJuridica?: DecisaoPendente<"D2"> | { valor: string; origem: "HUMANO"; autor: AutorHumano; data: string };
}

// ---------------------------------------------------------------------------
// Etapa 9, Fase A: explicação somente informativa (src/explicador.ts).
// Nada aqui altera o Veredito: a explicação é produzida depois do motor.
// ---------------------------------------------------------------------------

/** Qualidade da ligação entre o regraId informado pelo motor e uma regra da base. */
export type VinculoRegra =
  | "seguro"
  | "ambiguo_regraid_duplicado"
  | "nao_localizado";

export interface ExplicacaoRegra {
  regraIdInformado: string;
  vinculo: VinculoRegra;
  /** Só quando o vínculo é seguro. */
  referencia: RefRegra | null;
  /** null quando a regra não foi localizada com segurança. */
  statusNormativo: StatusNormativo | null;
  fonteDiz: FonteDiz[];
  sistemaInfere: SistemaInfere[];
  sinalizadores: Sinalizador[];
  condicoes: CondicaoAplicacao[];
  divergencias: Divergencia[];
  /** Redução de alíquota da regra (reducaoAliquota da base) e a evidência dela. Só informação. */
  reducao?: ReducaoExplicada;
  /** Conferência da regra com as fontes oficiais (data/auditoria-oficial.json). Só informação; null sem vínculo seguro ou sem auditoria válida. */
  auditoriaOficial?: AuditoriaOficialDaRegra | null;
  /** Fase 2: presente quando a regra está bloqueada por incompatibilidade oficial do NCM com o enquadramento. */
  bloqueio?: BloqueioOficial | null;
}

/**
 * Regra NCM × enquadramento bloqueada por incompatibilidade oficial (src/bloqueios.ts). Não diz que o produto é
 * inelegível: diz que esta regra não pode ser selecionada para este NCM.
 */
export interface BloqueioOficial {
  regraId: string;
  ncm: string;
  cClassTrib: string;
  item: string;
  tipo: "VEDADO_ANEXO_I" | "VEDADO_EXCECAO_ITEM" | "VEDADO_EXCECAO_LEI" | "EXCLUSAO_LEGAL";
  mensagem: string;
  motivo: string;
  motivosDaAuditoria: string[];
  situacaoNcmSvrs: string;
  excecaoNaLeiEmItens: string[];
  fatosF1: FatoAuditoriaF1[];
  fatosF2: FatoAuditoriaF2[];
  fontes: { F1: { url: string; arquivo: string; sha256: string }; F2: { url: string; arquivo: string; sha256: string } };
}

/** Status da REGRA frente às fontes oficiais (nunca do produto). */
export type StatusAuditoriaOficial = "CONFIRMADA" | "DIVERGENTE" | "NAO_LOCALIZADA" | "NAO_DETERMINADA";

export interface FatoAuditoriaF1 { dispositivo: string; ancora: string; linhaTabela: number; trecho: string; papel: "cobre o NCM" | "exclui o NCM" }
export interface FatoAuditoriaF2 { CodIntProdServ: number; TipoPermissao: string; DescItemAnexo: string; DescExcecao: string | null }
export interface FonteAuditoria { url: string; arquivo: string; sha256: string; natureza: string }

export interface AuditoriaOficialDaRegra {
  status: StatusAuditoriaOficial;
  cClassTrib: string;
  motivos: string[];
  situacaoNcmSvrs: "PERMITIDO" | "VEDADO" | "PERMITIDO_E_VEDADO" | "AUSENTE";
  itemDaBase: string;
  /** Itens do anexo da lei que cobrem o NCM (sem os que o excluem). */
  itensOficiais: string[];
  /** Só quando um único item da lei cobre o NCM. */
  itemOficial: string | null;
  itemDaRegraEntreOsOficiais: boolean;
  excecaoNaLeiEmItens: string[];
  excluidoDoItemDaRegra: boolean;
  /** Ressalva "Produtos relacionados no Anexo I" (SVRS): o NCM está na lista do 200003? null quando não há a ressalva. */
  ncmNaListaDoAnexoI: boolean | null;
  descricaoLegal: "igual" | "contida" | "diferente" | "sem_texto_oficial";
  fatosF1: FatoAuditoriaF1[];
  fatosF2: FatoAuditoriaF2[];
  /** Conferência do código (CST, anexo, redução, fundamento) e o artigo da lei. */
  codigo: {
    F1: { artigo: number | null; dispositivo: string | null; ancora: string | null; caput: string | null; reducaoLida: number | null };
    F2: { cst: string; nroAnexo: number; percRedIbs: number; percRedCbs: number; texUrlLegislacao: string } | null;
    comparacao: { cst: string; anexo: string; reducao: string; fundamento: string };
  };
  fontes: { F1: FonteAuditoria; F2: FonteAuditoria };
}

/** NCM do item listado como PERMITIDO no SVRS para um código sem regra na base (lacuna; nenhuma regra é criada — D5). */
export interface LacunaDeCobertura { cClassTrib: string; ncm: string; fatosF2: FatoAuditoriaF2[] }

/**
 * Evidência da redução de alíquota, determinada pelo cClassTrib (vínculo C-<cClassTrib>-reducaoAliquota):
 * oficial_confirmada: o vínculo existe, alcança a regra e concorda com as fontes oficiais;
 * oficial_divergente: o vínculo existe e alcança a regra, mas não concorda;
 * sem_evidencia_oficial: não há vínculo que alcance a regra (código fora do escopo auditado);
 * nao_determinada: a regra não foi identificada com segurança (vínculo diferente de "seguro").
 */
export type EvidenciaReducao = "oficial_confirmada" | "oficial_divergente" | "sem_evidencia_oficial" | "nao_determinada";

export interface ReducaoExplicada {
  /** reducaoAliquota da regra (0.60 = redução de 60%; 1.00 = alíquota zero). null quando nao_determinada. */
  valor: number | null;
  /** De onde vem o valor. null quando nao_determinada. */
  origem: "base_normativa" | null;
  regraIndice: number | null;
  linhaPlanilha: number | null;
  evidencia: EvidenciaReducao;
  /** Resultado da comparação do vínculo, quando existe. */
  comparacao: string | null;
  /** Fatos do vínculo C-<cClassTrib>-reducaoAliquota; vazio sem vínculo. */
  fatos: FonteDiz[];
  /** Explicação curta do estado da evidência. */
  motivo: string;
}

/**
 * Redução para exibição no item, a partir das regras identificadas pelo explicador:
 * aplicada: da regraAplicada do veredito; prevista: das regras candidatas (enquadramento pendente);
 * regime_especifico: regime de bares e restaurantes do motor (percentual do motor, sem evidência da base).
 */
export interface ReducaoDoItem {
  situacao: "aplicada" | "prevista" | "regime_especifico";
  opcoes: (ReducaoExplicada & { regraId: string })[];
  regimeEspecifico: { valor: number; fundamento: string; origem: "regime_especifico_motor" } | null;
  /**
   * Só para INCORRETO_ECONOMIA: true quando economiaPotencial ≈ valorPago × valor; false quando não confere;
   * null quando não se aplica ou não há valores para conferir.
   */
  coerenciaEconomia: boolean | null;
}

/** Ausência declarada em vez de valor presumido. */
export type AusenciaExplicita =
  | "SEM_REGRA_NA_BASE"
  | "SEM_EVIDENCIA_OFICIAL"
  | "REGRA_NAO_LOCALIZADA_COM_SEGURANCA"
  | "VALIDACAO_HUMANA_NAO_DISPONIVEL";

export interface ExplicacaoInformativa {
  fase: "A_INFORMATIVA";
  regras: ExplicacaoRegra[];
  /** null quando nenhum valor de StatusBeneficio se aplica (ex.: item sem regra de benefício). */
  statusBeneficio: StatusBeneficio | null;
  humanoConfirmou: HumanoConfirmou[];
  ausencias: AusenciaExplicita[];
  validacoesLegadas: ValidacaoLegada[];
  lacunas: Lacuna[];
  decisoesPendentes: DecisaoPendente<IdDecisao>[];
  /** A matriz só é citada: não muda estado, não bloqueia, não libera. */
  matriz: {
    versao: string;
    hash: string;
    situacoes: SituacaoMatriz[];
    efeito: "somente_explicacao";
  };
  /** "misto": regras candidatas com níveis diferentes, sem conflito entre fontes. */
  nivelEvidencia: "oficial" | "planilha" | "divergente" | "pendente" | "misto";
  limitacoes: string[];
  /** Redução para exibição no item; null quando o item não tem redução aplicada nem prevista. */
  reducaoDoItem?: ReducaoDoItem | null;
  /** Lacunas de cobertura oficial para o NCM do item (auditoria oficial). Só informação. */
  lacunasDeCobertura?: LacunaDeCobertura[];
}
