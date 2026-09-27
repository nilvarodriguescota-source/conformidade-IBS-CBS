# Etapa 7: especificação dos tipos (proposta)

> **Estado:** proposta para revisão. Nenhum tipo foi implementado em `src/tipos.ts`, e nenhum
> comportamento do sistema mudou. Base de trabalho: matriz da Etapa 6
> (`docs/etapa6/matriz-decisao.json`), aprovada como especificação.

## 1. Regras que esta especificação fixa

1. **Todo campo novo é opcional.** `RegraClassificacao`, `BaseNormativa`, `Veredito` e
   `RespostaValidacao` continuam válidos sem nenhuma alteração. Os tipos novos estendem os
   atuais por `extends` e nunca redefinem um campo existente.
2. **`NORMA_CONFIRMADA` ≠ `BENEFICIO_CONFIRMADO`.** O status normativo (regra ↔ norma) e o
   status do benefício (produto vendido ↔ regra) são tipos **separados**. Uma regra pode ter a
   norma confirmada enquanto a aplicação concreta ao produto ainda depende de validação humana.
   Pelo tipo, `BENEFICIO_CONFIRMADO` só existe acompanhado de uma confirmação humana válida.
3. **Decisões pendentes não têm valor padrão.** D2 a D7 são representadas pelo tipo
   `DecisaoPendente`. Nenhum campo recebe um valor presumido enquanto a decisão não for tomada
   e registrada por uma pessoa.
4. **As validações antigas com autor "Sistema" não são confirmação humana.** As 7 respostas do
   `empresa.json` com `autor: "Sistema"` são representadas como `ValidacaoLegada` e nunca podem
   virar `HumanoConfirmou` (seção 4.4).
5. **200043: "e" ou "ou" não é decidido.** A condição guarda o texto oficial literal, o texto
   literal da planilha e a decisão D2 pendente (seção 5.1).
6. **As 49 NCMs oficiais sem regra continuam `LACUNA_FONTE_SEM_REGRA`.** O tipo `Lacuna` não é
   uma regra e não pode ser convertido em regra sem a decisão D5.
7. **A frutose (1702.50.00) continua `CONFLITO_ENTRE_FONTES`.** A divergência guarda os dois
   fatos e a resolução fica `null`. Nem F1 nem F2 é escolhida.

## 2. Legenda de origem dos campos

Cada campo das tabelas abaixo traz a sua origem:

| Marca | Significado |
|---|---|
| **FONTE** | Copiado literalmente de uma fonte registrada (F1, F2 ou PLANILHA), com arquivo e hash |
| **INFERIDO** | Calculado pelo sistema a partir de fatos (camada `SISTEMA_INFERE`) |
| **HUMANO** | Só existe quando uma pessoa identificada registra |
| **PENDENTE** | Depende de uma decisão D2 a D7 ainda não tomada; não tem valor padrão |
| **MATRIZ** | Definido pela matriz de decisão (governança, não lei) |
| **ATUAL** | Já existe hoje na base ou na v2 |

## 3. Tipos de apoio

```ts
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
  linha: number;
  regraId: string;
  ncm: string;
}

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

export type IdDecisao = "D2" | "D3" | "D4" | "D5" | "D6" | "D7";

/** Autor humano. "Sistema" não é autor humano (regra 4). */
export interface AutorHumano {
  tipo: "humano";
  nome: string;
}
```

| Tipo | Finalidade | Relação com os dados atuais | Origem |
|---|---|---|---|
| `RefRegra` | Apontar uma regra sem depender só do regraId | Mesmo formato já usado em `vinculacoes` (Etapa 5) | ATUAL |
| `DecisaoPendente` / `DecisaoTomada` | Representar D2 a D7 sem valor padrão | Lista em `docs/etapa6/matriz-decisao.json` | PENDENTE / HUMANO |
| `AutorHumano` | Separar pessoa de processo automático | `RespostaValidacao.autor` hoje é texto livre | HUMANO |

## 4. As quatro camadas

### 4.1 `FONTE_DIZ`

```ts
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
```

| Campo | Finalidade | Origem |
|---|---|---|
| `fonte`, `arquivo`, `sha256`, `versao`, `dataConsulta`, `natureza` | Identificar e provar a fonte | FONTE (via registro `fontes`, Etapa 4) |
| `localizacao` | Onde está o fato | FONTE |
| `trecho` / `valor` | O fato em si | FONTE |
| `extracao` | Ligar o original do SVRS ao derivado | FONTE |

**Relação com os dados atuais:** é exatamente o formato de `vinculacoes.*.fatos[]` (771 fatos),
mais o campo opcional `camada`.

### 4.2 `SISTEMA_INFERE`

```ts
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
  /** Fatos em que a inferência se apoia (índices ou ids de FonteDiz). */
  premissas: FonteDiz[];
  /** Frase para o usuário, sempre com o sistema como sujeito ("O sistema comparou…"). */
  conclusao: string;
  valor?: unknown;
}
```

| Campo | Finalidade | Origem |
|---|---|---|
| `regra` | Qual leitura foi aplicada | MATRIZ |
| `premissas` | Fatos usados | FONTE |
| `conclusao`, `valor` | Resultado | INFERIDO |

**Relação com os dados atuais:** corresponde a `dadoExtraido`, `comparacao` e `interpretacao`
dos registros da Etapa 5. Hoje esses três estão em texto e objetos livres; a proposta dá nome
à regra de leitura. Uma `SistemaInfere` nunca é exibida como "a lei diz".

### 4.3 `HUMANO_CONFIRMOU`

```ts
export interface HumanoConfirmou {
  camada: "HUMANO_CONFIRMOU";
  validacao: ValidacaoHumana;
}
```

Só pode ser construída a partir de uma `ValidacaoHumana` (seção 4.4). Origem: **HUMANO**.

### 4.4 Validação humana e validação legada

```ts
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

/**
 * Registro que já existe no empresa.json (RespostaValidacao), preservado como está.
 * Nunca é HumanoConfirmou por si só.
 */
export interface ValidacaoLegada {
  origem: "empresa.json";
  registro: RespostaValidacao;
  classificacao:
    | "autor_sistema_nao_e_confirmacao_humana"   // autor === "Sistema"
    | "autor_humano_sem_justificativa"           // pessoa, mas sem justificativa
    | "chave_por_regraid_duplicado"              // regraId repetido na base
    | "chave_por_produto_em_condicao_de_adquirente"; // 200043
  /** Tratamento das 7 respostas com autor "Sistema": decisão D6, sem padrão. */
  tratamento: DecisaoPendente<"D6"> | DecisaoTomada<"D6", "descartar" | "revalidar">;
}
```

| Campo | Finalidade | Origem |
|---|---|---|
| `chave` | O que foi validado (produto, adquirente ou item escolhido) | HUMANO (a chave de adquirente depende de D2 para ser usada no 200043) |
| `resposta`, `autor`, `data`, `justificativa`, `evidencia` | A confirmação | HUMANO |
| `fontesNaData` | Invalidar a resposta quando as fontes mudarem | INFERIDO (hash lido no momento do registro) |
| `ValidacaoLegada.classificacao` | Por que o registro antigo não conta | INFERIDO (regra 4) |
| `ValidacaoLegada.tratamento` | O que fazer com as 7 respostas do "Sistema" | PENDENTE (D6) |

**Limite do tipo:** o TypeScript não consegue excluir o texto `"Sistema"` de `AutorHumano.nome`.
O tipo exige `tipo: "humano"` e `justificativa`, e impede que uma `RespostaValidacao` seja usada
como `ValidacaoHumana`. A exclusão de `"Sistema"` é regra de construção: quem criar uma
`ValidacaoHumana` precisa recusar esse autor, e isso precisará de um teste próprio na etapa de
implementação.

**Relação com os dados atuais:** `RespostaValidacao` continua igual e continua sendo lida pelo
motor atual. Das 8 respostas do `empresa.json`, 7 têm `autor: "Sistema"`, o que as classifica
como `autor_sistema_nao_e_confirmacao_humana`; a restante tem autor humano e fica
`autor_humano_sem_justificativa` enquanto não houver justificativa. **Nenhuma das 8 é
`HumanoConfirmou`** pela regra desta especificação. Nenhuma trata de 200033 ou 200043.

### 4.5 `SISTEMA_PODE_DECIDIR`

```ts
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
  versaoMatriz: string;                 // "etapa6-proposta-1"
  situacao: SituacaoMatriz;
  mapeamento: "sim" | "parcial" | "nao";
  veredito: "sim" | "apos_validacao_humana" | "nao";
  bloqueios: Bloqueio[];
}
```

Origem: **MATRIZ**. Nenhum campo vem da fonte nem de humano.

## 5. Status, sinalizadores e condição

### 5.1 Status normativo e status do benefício (separados)

```ts
/** Regra ↔ norma. Pode ser confirmado por fontes. */
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
```

| Tipo | Origem | Observação |
|---|---|---|
| `StatusNormativo` | INFERIDO a partir de FONTE, pelas regras da matriz (MATRIZ) | Na v2 atual: 70 / 45 / 11 / 1 / 1.242 |
| `StatusBeneficio` | HUMANO (confirmado ou negado); INFERIDO (pendente, bloqueado) | Não existe hoje; o motor usa `REQUER_VALIDACAO` |
| `Sinalizador` | INFERIDO | Contagens em `docs/etapa6/relatorio-etapa6.md` |

`LACUNA_FONTE_SEM_REGRA` não está em `StatusNormativo` de propósito: ele não descreve uma regra.
Fica no tipo `Lacuna` (seção 6.3).

### 5.2 Condição de aplicação

```ts
/** Texto literal de outra origem (planilha), preservado sem normalização. */
export interface TextoPlanilha {
  fonte: "PLANILHA";
  aba: "Base de dados";
  linha: number;
  coluna: string;   // nome do cabeçalho, como no bloco original
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
  /**
   * Como combinar os tipos listados (ex.: 200043). Sem valor padrão.
   * Só existe quando a leitura do texto for objeto de decisão.
   */
  combinacaoDosTipos?: DecisaoPendente<"D2"> | DecisaoTomada<"D2", string>;
  /** Estado para a parte verificável que contrariar a fonte (ex.: 200043 em NFC-e). */
  estadoSeContrariada?: DecisaoPendente<"D4"> | DecisaoTomada<"D4", string>;
}
```

| Campo | Origem |
|---|---|
| `textoOficial`, `textoOperacional`, `textoPlanilha` | FONTE (três literais, lado a lado) |
| `natureza`, `verificavelPeloXml`, `chaveDeValidacao` | INFERIDO a partir do texto; revisável |
| `combinacaoDosTipos` | PENDENTE (D2) |
| `estadoSeContrariada` | PENDENTE (D4) |

**200043 sem decidir "e" ou "ou":** a condição guarda os dois textos literais e a decisão D2
pendente. Nenhum tipo de adquirente é listado como regra de combinação.

```ts
const condicao200043 = {
  id: "COND-200043-ADQUIRENTE",
  cClassTrib: "200043",
  natureza: "adquirente",
  textoOficial: {
    fonte: "F1", arquivo: "F1.html",
    sha256: "5702cb10bfbf21d59cc52db2db2a6e3e719243dbedca97f6f82c652bc289e9e4",
    natureza: "texto legal: Lei Complementar nº 214/2025 publicada no Planalto",
    versao: "Texto do Planalto na data da consulta, com as marcações de alteração da LC 227/2026",
    dataConsulta: "2026-09-23T21:01:53-03:00",
    localizacao: { dispositivo: "art. 142, I", ancora: "art142" },
    trecho: "I - fornecimento à administração pública direta, autarquias e fundações púbicas dos serviços e dos bens relativos à soberania e à segurança nacional, à segurança da informação e à segurança cibernética relacionados no Anexo XI desta Lei Complementar , com a especificação das respectivas classificações da NBS e da NCM/SH; e",
  },
  textoPlanilha: {
    fonte: "PLANILHA", aba: "Base de dados", linha: 760, coluna: "Observação",
    valor: "Validar a descrição legal, o enquadramento do produto e eventuais condicionantes. Aplicação condicionada ao fornecimento à administração pública direta, autarquias ou fundações públicas.",
  },
  verificavelPeloXml: "nao",
  chaveDeValidacao: "adquirente",
  combinacaoDosTipos: {
    status: "pendente",
    decisao: "D2",
    opcoes: ["a lei usa 'e'", "a planilha usa 'ou'"],
  },
} satisfies CondicaoAplicacao;
```

## 6. Divergência, evidência, lacuna e bloco oficial

### 6.1 Divergência

```ts
export type TipoDivergencia =
  | "item_divergente"          // planilha × F1+F2 (11)
  | "ncm_so_na_F1"             // F1 × F2 (frutose)
  | "ncm_so_na_F2"
  | "fundamento_legal"         // 200043: art. 140 × art. 142, I
  | "fundamento_a_revisar"     // 200033: arts. 133 e 134 × art. 133, § 1º
  | "vigencia"                 // três datas
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
```

| Campo | Origem |
|---|---|
| `valores[].valor`, `valores[].fato` | FONTE (cada valor com a sua fonte) |
| `tipo`, `impacto`, `regras` | INFERIDO (da comparação da Etapa 5) |
| `status` "resolvida", `resolucao` | HUMANO |

**Frutose, sem escolher fonte:**

```ts
const divergenciaFrutose = {
  id: "DIV-200033-17025000",
  tipo: "ncm_so_na_F1",
  cClassTrib: "200033",
  regras: [{ indice: 575, linha: 684, regraId: "17025000-200033-VI-54", ncm: "17025000" }],
  valores: [
    { fonte: "F1", valor: "Anexo VI, item 54: Frutose, 1702.50.00" },
    { fonte: "F2", valor: "17025000 ausente da lista do 200033" },
  ],
  impacto: "enquadramento",
  status: "aberta",
  resolucao: null,
} satisfies Divergencia;
```

### 6.2 Evidência

```ts
/** Registro de vinculação da Etapa 5, com as camadas separadas. */
export interface Evidencia {
  id: string;                       // "R-706", "C-200043-fundamentoLegal", "S-200043-87091100"
  alcance: "regra" | "codigo" | "lacuna";
  fatos: FonteDiz[];
  inferencias: SistemaInfere[];
  statusEtapa5: "inequivoco" | "ambiguo" | "conflito" | "informativo" | "sem_regra";
}
```

**Relação com os dados atuais:** cada registro de `vinculacoes.codigo`, `vinculacoes.regras` e
`vinculacoes.ncmsOficiaisSemRegra` vira uma `Evidencia`. Os `fatos` já estão no formato certo;
as `inferencias` sairiam de `dadoExtraido`, `comparacao` e `interpretacao`. Origem: FONTE +
INFERIDO.

### 6.3 Lacuna (não é regra)

```ts
export interface Lacuna {
  id: string;                       // "S-<código>-<ncm>"
  status: "LACUNA_FONTE_SEM_REGRA";
  cClassTrib: string;
  ncm: string;
  fatos: FonteDiz[];
  regrasDeOutrosCodigosComEstaNcm: (RefRegra & { cClassTrib: string })[];
  /** Incluir ou não como regra de origem oficial. Sem padrão. */
  inclusaoComoRegra: DecisaoPendente<"D5"> | DecisaoTomada<"D5", "incluir" | "nao_incluir">;
}
```

As 49 NCMs (1 no 200033 e 48 no 200043) ficam como `Lacuna`. Não existe conversão automática
de `Lacuna` para `RegraClassificacao`. Origem: FONTE (fatos), PENDENTE (inclusão).

### 6.4 Bloco oficial

```ts
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
type Oficial<T> = ValorOficial<T> | PendenteDeFonteOficial;

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
```

| Campo | Origem | Observação |
|---|---|---|
| `cst`, `cClassTrib`, `anexo`, `reducaoIBS`, `reducaoCBS`, `fundamentoLegal` | FONTE (+ INFERIDO quando há conversão: 6 = VI, 60% = 0,6) | Nunca substitui o campo atual de mesmo nome |
| `vigencias` | FONTE, uma entrada por tipo de data | Três datas, nenhuma escolhida |
| `presencaNaLista` | INFERIDO a partir de FONTE | |
| `item` | FONTE + INFERIDO; `depende_do_produto` exige HUMANO para virar item escolhido | Escolha fica na `ValidacaoHumana` do tipo `item_do_anexo` |
| `PendenteDeFonteOficial` | — | Para os 10 códigos fora do escopo (1.242 regras) |

## 7. Extensões dos tipos atuais (todas opcionais)

```ts
/** Bloco da Etapa 3, como já está na v2. */
export interface BlocoOriginal {
  fonte: "PLANILHA";
  aba: "Base de dados";
  linha: number;
  motivo?: "duplicata_exata";
  valores: Record<string, string | null>;
}

export interface RegraClassificacaoV2 extends RegraClassificacao {
  original?: BlocoOriginal;
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
  /** Política para regra sem evidência oficial (1.242 regras). Sem padrão. */
  politicaSemEvidencia?: DecisaoPendente<"D3"> | DecisaoTomada<"D3", string>;
}

export interface BaseNormativaV2 extends BaseNormativa {
  regras: RegraClassificacaoV2[];
  fontes?: unknown;          // bloco da Etapa 4, já na v2 (tipo detalhado numa etapa própria)
  vinculacoes?: unknown;     // bloco da Etapa 5, já na v2
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
  explicacao?: ExplicacaoVeredito;
}

/** Dado do destinatário para a chave por adquirente (200043). O XML não traz a natureza jurídica. */
export interface DestinatarioAmpliado {
  naturezaJuridica?: DecisaoPendente<"D2"> | { valor: string; origem: "HUMANO"; autor: AutorHumano; data: string };
}
```

| Tipo | Compatibilidade |
|---|---|
| `RegraClassificacaoV2` | Toda `RegraClassificacao` atual é uma `RegraClassificacaoV2` válida (todos os campos novos são opcionais) |
| `BaseNormativaV2` | Toda `BaseNormativa` atual é uma `BaseNormativaV2` válida |
| `VereditoExplicado` | Todo `Veredito` atual é válido; `explicacao` é opcional |
| `RespostaValidacao` | Não muda; é preservada dentro de `ValidacaoLegada` |

## 8. Resumo por origem

| Origem | Campos |
|---|---|
| **FONTE** | `FonteDiz` inteiro; `CondicaoAplicacao.textoOficial/textoOperacional/textoPlanilha`; `Divergencia.valores`; `ValorOficial.fatos`; `Lacuna.fatos`; `BlocoOriginal` |
| **INFERIDO** | `SistemaInfere`; `StatusNormativo`; `Sinalizador`; `presencaNaLista`; `Divergencia.tipo/impacto`; `CondicaoAplicacao.natureza/verificavelPeloXml/chaveDeValidacao` (revisáveis); `ValidacaoLegada.classificacao`; `ValidacaoHumana.fontesNaData` |
| **HUMANO** | `ValidacaoHumana`; `HumanoConfirmou`; `StatusBeneficio` confirmado ou negado; `ResolucaoDivergencia`; `DecisaoTomada` |
| **MATRIZ** | `PermissaoDecisao`; `Bloqueio`; `RegraDeInferencia` (lista fechada) |
| **PENDENTE** | D2 `combinacaoDosTipos` e natureza do destinatário; D3 `politicaSemEvidencia`; D4 `estadoSeContrariada`; D5 `Lacuna.inclusaoComoRegra`; D6 `ValidacaoLegada.tratamento`; D7 `chaveEstavel` |

## 9. Pendências preservadas (nenhuma resolvida por esta especificação)

| Pendência | Onde fica no modelo |
|---|---|
| 11 itens divergentes planilha × F1+F2 | `Divergencia` tipo `item_divergente`, `resolucao: null` |
| 45 NCMs em vários itens | `ItemOficial` `depende_do_produto`; escolha só por `ValidacaoHumana` `item_do_anexo` |
| 49 NCMs oficiais sem regra | `Lacuna` com D5 pendente |
| Frutose 1702.50.00 | `Divergencia` `ncm_so_na_F1`, `resolucao: null` |
| Fundamento do 200043 | `Divergencia` `fundamento_legal`; `oficial.fundamentoLegal` ao lado do campo atual |
| Fundamento do 200033 | `Divergencia` `fundamento_a_revisar` |
| Vigência | `oficial.vigencias` com três entradas; `Divergencia` `vigencia` |
| 2002.10.00 "Água para injeção" (Anexo VI, item 15) × "Tomates inteiros ou em pedaços" (descrição TIPI na planilha, regra 200034 da linha 698) | `Lacuna` S-200033-20021000 com `regrasDeOutrosCodigosComEstaNcm`; análise humana |
| regraId repetido (linhas 776 e 777) | `RefRegra` com índice e linha; `chaveEstavel` D7; `Divergencia` `regraid_duplicado` |
| 7 validações com autor "Sistema" | `ValidacaoLegada` `autor_sistema_nao_e_confirmacao_humana`; D6 |
| CRLF no snapshot; import do `snapshot_planilha.mjs` | Fora do modelo de tipos; continuam registradas |

## Atualização — Etapa 5.3 (2026-09-24)

- **D3 (`politicaSemEvidencia`)** passou a ser definida como: regras cujo vínculo NCM × item com a fonte oficial
  não está CONFIRMADO na auditoria oficial (`data/auditoria-oficial.json`). Regras bloqueadas na Fase 2
  (`src/bloqueios.ts`) já têm política e não entram na D3. A D3 continua pendente.
- **`itemOficial`** (Fase 3) é um campo opcional novo das regras da v2, gravado depois de `originaisAgrupados`
  só quando a lei cobre o NCM com um único item. O campo `item` original não muda.
- A evidência por regra e os vínculos de código dos códigos fora do escopo da Etapa 5 ficam no bloco de raiz
  `evidenciasOficiais` (ver `docs/etapa5-3/fase3-evidencias-oficiais.md`).
