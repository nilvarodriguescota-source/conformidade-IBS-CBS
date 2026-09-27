# Etapa 9B: alertas (especificação, não implementada)

> **Estado:** especificação para revisão. Nenhum código foi alterado. A Fase A (Etapa 9A) está
> encerrada; esta fase só acrescenta uma camada de apresentação sobre ela.
>
> **Base desta especificação:** `docs/etapa8/fluxo-futuro.md`, `docs/etapa6/matriz-decisao.json`,
> `src/tipos.ts`, `src/explicador.ts`, `test/explicador.test.ts`, `src/servidor.ts` (lido, não
> alterado) e o `explicacoes.json` do lote real de 1.085 XMLs (2.992 vereditos), usado só para
> estimar volumes.

## 1. Regra principal

```
XML → parser → motor atual → Veredito atual → explicador informativo (9A) → ALERTAS (9B)
```

Os alertas são derivados **somente** da `explicacaoInformativa` já produzida. Eles não leem a
base, a v2, a matriz nem as fontes de novo, e não conversam com o motor.

Um alerta não pode: alterar `CORRETO`, `INCORRETO_ECONOMIA`, `INCORRETO_RISCO`,
`REQUER_VALIDACAO`, `NAO_OBRIGATORIO` ou `INDETERMINADO`; criar regra; confirmar benefício; criar
`HUMANO_CONFIRMOU`; resolver D2–D7; resolver conflito; transformar lacuna em regra; substituir a
base ou a matriz; decidir pelo usuário.

## 2. O que a Fase A já oferece (análise)

Cada veredito explicado traz, em `explicacaoInformativa`:

| Campo 9A | Serve para alertar sobre |
|---|---|
| `regras[]` (0 a N), com `vinculo`, `statusNormativo`, `sinalizadores`, `condicoes`, `divergencias` | Candidatas múltiplas, regra não localizada ou ambígua, conflito, item dependente do produto, condição, fundamento, vigência |
| `ausencias[]` | Sem regra na base, sem evidência oficial, regra não localizada, validação humana não disponível |
| `lacunas[]` | NCM oficial sem regra |
| `validacoesLegadas[]` | Registros históricos do `empresa.json` |
| `decisoesPendentes[]` | D2–D7 |
| `nivelEvidencia` | Evidência mista, divergente, pendente |
| `limitacoes[]` | Textos já redigidos (ex.: `/api/validar`, `IndNfce`) |
| `matriz.situacoes[]` | Situação da matriz citada (1–14), só como referência |

Tudo o que um alerta precisa já existe na 9A. **Nenhum campo novo é necessário no motor, no
Veredito ou no explicador** para gerar os alertas.

### 2.1 A interface atual (`src/servidor.ts`, só leitura)

| Tela / rota | O que mostra hoje | Onde um alerta poderia aparecer no futuro |
|---|---|---|
| Resultados (`/api/resultados` → `saida-teste/vereditos.json`) | Tabela de 13 colunas por item; coluna "Resultado" com o estado | Uma coluna ou ícone "Alertas" ao lado de "Resultado", **sem mudar a cor nem o texto do estado** |
| Pendências (`/api/fila-validacao`) | Cartões por produto + NCM, com botões SIM/NÃO por regra | Bloco de alertas no cartão (condição literal, decisões pendentes, conflito), acima dos botões |
| Dashboard (`/api/dashboard`) | Indicadores por estado | Painel separado com totais por categoria de alerta, **fora** dos indicadores por estado |

O servidor gera os resultados pelo `processador.ts`, que está protegido. Levar alertas à tela
exige alterar `servidor.ts` e/ou `processador.ts` numa subetapa própria, com aprovação (seção 9).

### 2.2 Achado novo sobre a autoria "Sistema"

A tela envia a autoria fixa: `body:JSON.stringify({ncm,cProd,regraId,resposta,autor:'Sistema'})`
(`servidor.ts`, função `validar`). Além disso, a rota grava `autor || "Sistema"`. Logo, os
registros com autor "Sistema" vieram, muito provavelmente, de uma pessoa usando a tela, **sem que
a autoria fosse coletada**. O texto atual da limitação na 9A está correto, mas incompleto; a
redação do alerta G (seção 5) usa a descrição completa. Ajustar o texto da 9A é ponto de decisão
(seção 10, P6).

## 3. Modelo de alerta (proposta de tipo, não implementado)

```ts
/** Categoria do alerta. Não é gravidade jurídica. */
export type CategoriaAlerta = "INFORMACAO" | "ATENCAO" | "PENDENCIA" | "CONFLITO" | "LACUNA";

/** Lista fechada de alertas; cada código tem texto fixo (seção 5). */
export type CodigoAlerta =
  | "MULTIPLAS_REGRAS_CANDIDATAS" | "MULTIPLOS_ITENS_DO_ANEXO"
  | "REGRA_NAO_LOCALIZADA" | "REGRAID_AMBIGUO"
  | "SEM_REGRA_NA_BASE" | "LACUNA_FONTE_SEM_REGRA"
  | "CONFLITO_ENTRE_FONTES" | "CONFLITO_PLANILHA_FONTE" | "FUNDAMENTO_DIVERGENTE" | "FUNDAMENTO_A_REVISAR"
  | "VIGENCIA_A_REVISAR" | "EVIDENCIA_MISTA"
  | "VALIDACAO_LEGADA" | "VALIDACAO_HUMANA_NAO_DISPONIVEL"
  | "DECISAO_PENDENTE" | "CONDICAO_NAO_COMPROVADA"
  | "INFORMACAO_OPERACIONAL_SVRS" | "ALIQUOTA_PROJETADA";

export interface Alerta {
  /** Estável: código + documento + nItem + referência (ex.: "CONDICAO_NAO_COMPROVADA:…:3:COND-200033-DESTINACAO"). */
  id: string;
  codigo: CodigoAlerta;
  categoria: CategoriaAlerta;
  /** Camada da afirmação principal do alerta (nunca inferência apresentada como fato). */
  camada: "FONTE_DIZ" | "SISTEMA_INFERE" | "HUMANO_CONFIRMOU" | "SISTEMA_PODE_DECIDIR";
  titulo: string;           // texto fixo do código
  mensagem: string;         // modelo fixo do código + dados do item
  item: { documento: string; nItem: number; cProd: string; ncm: string | null };
  /** Cópia do estado, só para exibição ao lado. */
  estadoDoVeredito: EstadoVeredito;
  /** Onde a informação está na explicação (ex.: "regras[2].divergencias[0]"). */
  origem: string[];
  decisoes?: IdDecisao[];
  efeito: "somente_exibicao";
}

/** Alerta agregado de lote (seção 6): um por código, com contagem. */
export interface AlertaDeLote {
  codigo: CodigoAlerta;
  categoria: CategoriaAlerta;
  titulo: string;
  mensagem: string;
  itens: number;
  exemplos: { documento: string; nItem: number }[];   // no máximo 5
  efeito: "somente_exibicao";
}
```

**Por que `efeito: "somente_exibicao"`:** deixa explícito, em cada alerta, que ele não participa
de nenhuma decisão, como a matriz na 9A (`efeito: "somente_explicacao"`).

**Categorias:**

| Categoria | Significado | Exemplo |
|---|---|---|
| `INFORMACAO` | O sistema encontrou algo e mostra | "A fonte oficial lista esta NCM." |
| `ATENCAO` | Situação que merece análise | "Há 9 regras candidatas para este item." |
| `PENDENCIA` | Falta uma decisão ou informação | "A decisão D2 está pendente." |
| `CONFLITO` | Fontes ou interpretações incompatíveis | "As fontes divergem sobre esta NCM." |
| `LACUNA` | Informação oficial sem regra na base | "A NCM consta da fonte oficial, e a base não tem regra correspondente." |

**Ordem de exibição** (não é gravidade): `CONFLITO`, `LACUNA`, `PENDENCIA`, `ATENCAO`, `INFORMACAO`.

**Vocabulário proibido nos textos** (verificado por teste): "erro", "grave", "irregular",
"ilegal", "fraude", "infração", "indevido", "incorreto" (fora do nome do estado do motor),
"sonegação". Não há base normativa ou documental nesta fase para nenhum deles.

## 4. `ALERTA ≠ VEREDITO`

| Veredito (motor) | Alertas possíveis | Leitura correta |
|---|---|---|
| `CORRETO` | `VALIDACAO_LEGADA`, `DECISAO_PENDENTE` | O motor achou os códigos coerentes; a explicação mostra que a resposta usada é histórica |
| `REQUER_VALIDACAO` | Vários (candidatas, condição, decisões) | O estado já pede validação; os alertas dizem **o quê** falta |
| `INCORRETO_RISCO` | `LACUNA_FONTE_SEM_REGRA` | O motor não encontrou regra; o alerta mostra que a fonte oficial lista a NCM. **O estado não muda** |

O alerta nunca aparece no lugar do estado, nunca muda a cor/texto do estado e nunca é somado aos
indicadores por estado.

## 5. Fontes dos alertas (mapeamento a partir da 9A)

| # | Código | Categoria | Dispara quando (campo 9A) | Camada | Mensagem modelo | Não pode dizer |
|---|---|---|---|---|---|---|
| A | `MULTIPLAS_REGRAS_CANDIDATAS` | ATENCAO | `regras.length > 1` | SISTEMA_INFERE | "Há {n} regras candidatas para este item ({códigos})." | que alguma é a certa |
| A′ | `MULTIPLOS_ITENS_DO_ANEXO` | ATENCAO | sinalizador `DEPENDE_COMPOSICAO_PRODUTO` | FONTE_DIZ | "A NCM aparece em {n} itens do Anexo {x} ({itens}); o item depende da composição do produto." | qual item vale |
| B | `REGRA_NAO_LOCALIZADA` | ATENCAO | `vinculo = "nao_localizado"` | SISTEMA_INFERE | "O identificador {id} não corresponde a uma única regra da base; nenhuma evidência foi vinculada." | que o motor falhou |
| C | `REGRAID_AMBIGUO` | ATENCAO | `vinculo = "ambiguo_regraid_duplicado"` | SISTEMA_INFERE | "O identificador {id} corresponde a {n} regras (linhas {l}); nenhuma foi escolhida." | qual das duas vale |
| D | `SEM_REGRA_NA_BASE` | INFORMACAO | ausência `SEM_REGRA_NA_BASE` sem lacuna | SISTEMA_INFERE | "A base não tem regra de benefício para esta NCM." | que o item deveria ter benefício |
| D′ | `LACUNA_FONTE_SEM_REGRA` | LACUNA | `lacunas.length > 0` | FONTE_DIZ | "A NCM {ncm} consta da fonte oficial para o {código} ({fonte, local}), e a base não tem regra correspondente. O estado {estado} foi produzido pelo motor e não foi alterado." | que o estado está errado; que o benefício se aplica |
| E | `CONFLITO_ENTRE_FONTES` | CONFLITO | `statusNormativo = "CONFLITO_ENTRE_FONTES"` | FONTE_DIZ | "A LC 214 e o SVRS divergem sobre a NCM {ncm} no {código}; nenhuma fonte foi escolhida." | qual fonte prevalece |
| E′ | `CONFLITO_PLANILHA_FONTE` | CONFLITO | `statusNormativo = "CONFLITO_PLANILHA_FONTE"` | FONTE_DIZ | "LC 214 e SVRS associam a NCM ao item {oficial}; a base (planilha) traz o item {base}." | que a planilha está errada |
| E″ | `FUNDAMENTO_DIVERGENTE` | CONFLITO | divergência `fundamento_legal` | FONTE_DIZ | "A base cita {base}; LC 214 e SVRS indicam {oficial}. Diferença de texto do fundamento." | que o enquadramento muda |
| E‴ | `FUNDAMENTO_A_REVISAR` | ATENCAO | divergência `fundamento_a_revisar` | FONTE_DIZ | "A base cita {base}; o SVRS indica {oficial}." | — |
| — | `VIGENCIA_A_REVISAR` | ATENCAO | sinalizador `VIGENCIA_AMBIGUA` | FONTE_DIZ + SISTEMA_INFERE | "As fontes trazem datas diferentes para atributos diferentes ({datas})." | qual data vale |
| F | `EVIDENCIA_MISTA` | INFORMACAO | `nivelEvidencia = "misto"` | SISTEMA_INFERE | "As regras candidatas têm níveis de evidência diferentes (oficial e só planilha)." | que há erro |
| G | `VALIDACAO_LEGADA` | ATENCAO | `validacoesLegadas.length > 0` | FONTE_DIZ (registro) | "Há resposta registrada no empresa.json ({resposta}, {data}). É registro histórico e **não** equivale a confirmação humana: {motivo por classificação}." | "validado pelo sistema"; "confirmado" |
| H | `VALIDACAO_HUMANA_NAO_DISPONIVEL` | PENDENCIA | ausência `VALIDACAO_HUMANA_NAO_DISPONIVEL` | SISTEMA_INFERE | "Não há validação humana registrada para este item." | — |
| I | `DECISAO_PENDENTE` | PENDENCIA | cada item de `decisoesPendentes` | SISTEMA_PODE_DECIDIR | "A decisão {D} ({tema}) está pendente." | o resultado provável da decisão |
| J | `CONDICAO_NAO_COMPROVADA` | PENDENCIA | cada condição distinta em `regras[].condicoes` | FONTE_DIZ | "A norma condiciona o benefício a: “{trecho literal}” ({dispositivo}). O XML não comprova essa condição." (200043: mostrar também o texto da planilha e D2) | que a condição foi ou não atendida |
| — | `INFORMACAO_OPERACIONAL_SVRS` | INFORMACAO | limitação `IndNfce` (200043 em NFC-e) | FONTE_DIZ | "O SVRS registra IndNfce = false para o 200043; este documento é modelo 65. O tratamento depende da decisão D4, pendente." | que a nota é inválida |
| — | `ALIQUOTA_PROJETADA` | INFORMACAO | situação 14 citada | FONTE_DIZ | "Valores calculados com alíquota projetada, não oficial." | — |

**Motivos do alerta G por classificação:**
- `autor_sistema_nao_e_confirmacao_humana`: "a autoria não foi coletada: a tela envia o autor fixo 'Sistema' e a rota grava 'Sistema' quando não recebe autor";
- `sem_hash_das_fontes_na_data`: "há autor e justificativa, mas o registro não guarda o hash das fontes na data da resposta";
- `autor_humano_sem_justificativa`, `chave_por_regraid_duplicado`, `chave_por_produto_em_condicao_de_adquirente`: texto correspondente.

Quando o estado do motor dependeu do registro legado (ex.: `CORRETO` por uma resposta "SIM"), o
alerta G acrescenta: "O estado {estado} considerou essa resposta; esta explicação não o altera."

## 6. Volume e agrupamento (dados reais)

Estimativa sobre o lote real, aplicando a seção 5 sem agrupamento:

| Código | Ocorrências | Itens |
|---|---|---|
| `VALIDACAO_HUMANA_NAO_DISPONIVEL` | 2.492 | 2.492 |
| `DECISAO_PENDENTE` (D3) | 2.492 | 2.492 |
| `SEM_REGRA_NA_BASE` | 500 | 500 (todos `CORRETO`, CST 000) |
| `VALIDACAO_LEGADA` | 247 | 247 |
| `DECISAO_PENDENTE` (D6) | 247 | 247 |
| `CONDICAO_NAO_COMPROVADA` | 32 | 4 (a mesma condição repetida em 8 regras) |
| `MULTIPLAS_REGRAS_CANDIDATAS` | 6 | 6 |
| `MULTIPLOS_ITENS_DO_ANEXO`, `EVIDENCIA_MISTA`, `VIGENCIA_A_REVISAR` | 4 cada | 4 |

Sem agrupamento, **todos os 2.992 itens** teriam alerta, e os poucos casos relevantes ficariam
escondidos. Regras propostas:

1. **Deduplicação por item:** um alerta por (código, referência) dentro do item; a condição do
   200033 vira 1 alerta, não 8.
2. **Alertas de lote:** códigos que atingem a maioria dos itens pelo mesmo motivo estrutural
   (`VALIDACAO_HUMANA_NAO_DISPONIVEL`, `DECISAO_PENDENTE` D3) viram **um `AlertaDeLote`** com a
   contagem, e não aparecem item a item por padrão.
3. **`SEM_REGRA_NA_BASE` sem lacuna:** não gerar por item quando o item informa tributação
   integral (CST 000) — é o caso dos 500. Isso usa só fatos do XML e do motor, não interpretação.
   Decisão sua (P2).
4. **Nada é descartado:** o agrupamento só muda a apresentação; o arquivo de alertas mantém a
   lista completa por item, e o filtro é da tela.

Resultado esperado no lote real com as regras 1–3: alertas por item concentrados nos 247 com
validação legada e nos 4–6 com candidatas múltiplas/condições; 2 alertas de lote.

## 7. Casos especificados

Casos da Fase A; o estado do motor é mostrado ao lado e **não muda** em nenhum deles.

| Caso | Estado (motor) | Alertas (categoria) |
|---|---|---|
| **1. NCM 2106.90.90**, 9 candidatas (8 do 200033, itens 39–46; 1 do 200003) | `REQUER_VALIDACAO` | `MULTIPLAS_REGRAS_CANDIDATAS` (ATENCAO, "9 regras: 8 do 200033 e 1 do 200003"); `MULTIPLOS_ITENS_DO_ANEXO` (ATENCAO, itens 39 a 46); `EVIDENCIA_MISTA` (INFORMACAO); `CONDICAO_NAO_COMPROVADA` (PENDENCIA, 1 alerta: art. 133, § 1º, "destinadas às pessoas com erros inatos do metabolismo"); `FUNDAMENTO_A_REVISAR` e `VIGENCIA_A_REVISAR` (ATENCAO); `DECISAO_PENDENTE` D3 (via lote). Não escolhe regra nem item |
| **2. NCM 87091100 com 200043** | `INCORRETO_RISCO` | `LACUNA_FONTE_SEM_REGRA` (LACUNA, "consta da fonte oficial para o 200043, item 2.1 do Anexo XI, código 8709; a base não tem regra correspondente; o estado INCORRETO_RISCO foi produzido pelo motor e não foi alterado"); `DECISAO_PENDENTE` D5. Não diz que o risco é indevido |
| **3. Frutose 1702.50.00** | `REQUER_VALIDACAO` | `CONFLITO_ENTRE_FONTES` (CONFLITO, LC 214 Anexo VI item 54 × ausência no SVRS; nenhuma fonte escolhida); `CONDICAO_NAO_COMPROVADA`; validação humana pendente |
| **4. 200043 (85176259)**, 3 candidatas | `REQUER_VALIDACAO` | `MULTIPLAS_REGRAS_CANDIDATAS`; `MULTIPLOS_ITENS_DO_ANEXO` (2.22, 2.23, 2.26); `CONDICAO_NAO_COMPROVADA` com os dois textos: lei "…autarquias **e** fundações…", planilha "…autarquias **ou** fundações…"; `DECISAO_PENDENTE` D2 e D4; `FUNDAMENTO_DIVERGENTE` (CONFLITO de texto: base "Art. 140" × oficial "art. 142, I") |
| **5. 200043 em NFC-e** | `REQUER_VALIDACAO` (igual ao caso 4) | Os do caso 4 + `INFORMACAO_OPERACIONAL_SVRS` (INFORMACAO, IndNfce = false; D4 pendente). Não diz que a nota é inválida |
| **6. cProd 2726**, resposta legada "Sistema" | inalterado (lote real: `INCORRETO_ECONOMIA`) | `VALIDACAO_LEGADA` (ATENCAO, autoria não coletada; não equivale a confirmação humana; o estado considerou essa resposta); `DECISAO_PENDENTE` D6 |
| **7. cProd 2727**, resposta "Nilva" | inalterado (lote real: `INCORRETO_ECONOMIA`) | `VALIDACAO_LEGADA` (ATENCAO, "há autor e justificativa, mas o registro não guarda o hash das fontes na data"); D6 |
| **8. NCM 23080000**, regraId duplicado | `REQUER_VALIDACAO` | `REGRAID_AMBIGUO` (ATENCAO, linhas 776 e 777, nenhuma escolhida); `DECISAO_PENDENTE` D7 |
| **9. NCM 2827.20.10**, item divergente | `REQUER_VALIDACAO` | `CONFLITO_PLANILHA_FONTE` (CONFLITO, item 26 oficial × 66 na planilha); condição do 200033 |
| **10. Item sem regra, CST 000** (ex.: 1602.32.20) | `CORRETO` | Nenhum alerta por item se P2 for aprovado; senão `SEM_REGRA_NA_BASE` (INFORMACAO) |

## 8. Como a Fase B seria implementada (quando autorizada)

- **Módulo novo** `src/alertas.ts`: função pura `gerarAlertas(vereditosExplicados) → { porItem: Alerta[]; lote: AlertaDeLote[] }`. Entrada: só a saída da 9A.
- **Saída separada** `alertas.json`, gravada pelo `cli-explicacao.ts` ao lado de `explicacoes.json`.
  `explicacoes.json` continua **byte a byte igual** ao da 9A.
- **Tipos** da seção 3 acrescentados a `src/tipos.ts`, sem alterar os existentes.
- **Tela:** fora da primeira subetapa (seção 9).

### 8.1 Testes planejados

1. Nenhum veredito muda (fotografia de 2.992 + 12 idêntica; `explicacoes.json` idêntico).
2. Todo alerta tem `efeito: "somente_exibicao"` e o estado copiado igual ao do veredito.
3. Nenhum texto contém o vocabulário proibido.
4. Alerta G nunca contém "confirmad"/"validado pelo sistema"; `humanoConfirmou` continua vazio.
5. Caso 2 gera `LACUNA_FONTE_SEM_REGRA` e o estado continua `INCORRETO_RISCO`.
6. Caso 3 gera `CONFLITO_ENTRE_FONTES` sem indicar fonte vencedora.
7. Caso 4 traz os dois textos ("e" e "ou") e D2/D4 como pendentes.
8. Caso 8 não cita regra escolhida.
9. Condição repetida em várias regras gera um só alerta por item.
10. Todo alerta aponta (`origem`) para um campo existente da explicação.
11. Nenhum alerta inventa dado ausente na explicação (tudo o que é citado existe na 9A).

## 9. Subetapas propostas

| Subetapa | Conteúdo | Arquivos protegidos tocados |
|---|---|---|
| **9B.1** | `src/alertas.ts` + `alertas.json` via `cli-explicacao.ts` + testes | nenhum |
| **9B.2** | Rota de leitura `/api/alertas` e exibição na tela (coluna/ícone, bloco no cartão, painel no dashboard) | `servidor.ts` (e, para gerar no fluxo do servidor, `processador.ts`) — **exige autorização** |

## 10. Decisões para aprovação antes de implementar

| Id | Pergunta | Recomendação |
|---|---|---|
| P1 | Alertas em arquivo separado (`alertas.json`) ou dentro de `explicacoes.json`? | Separado, para `explicacoes.json` ficar idêntico ao da 9A |
| P2 | `SEM_REGRA_NA_BASE` para item com CST 000 e sem lacuna: gerar por item ou não? | Não gerar por item (500 alertas sem conteúdo útil); manter só em lote |
| P3 | `VALIDACAO_HUMANA_NAO_DISPONIVEL` e `DECISAO_PENDENTE` D3 como alertas de lote? | Sim |
| P4 | `FUNDAMENTO_DIVERGENTE` como CONFLITO (fontes incompatíveis) ou ATENCAO (só texto)? | CONFLITO, com a indicação "diferença de texto do fundamento" |
| P5 | Quando autorizar a 9B.2 (tela)? | Depois de revisar o `alertas.json` da 9B.1 |
| P6 | Corrigir o texto da limitação da 9A sobre "Sistema" para incluir que a tela envia `autor:'Sistema'` fixo? Muda o texto de `explicacoes.json` | Sim, numa subetapa própria, com regressão |
| P7 | A mensagem da seção 5 foi cortada no Caso 1 ("O alerta d…"). Havia outros casos ou requisitos? | Enviar o restante |

## 11. Riscos

| Risco | Proteção |
|---|---|
| Alerta lido como veredito | Coluna separada; estado com cor/texto inalterados; `efeito: "somente_exibicao"` |
| Excesso de alertas esconde os relevantes | Deduplicação, alertas de lote, ordem de exibição (seção 6) |
| Texto sugerir ilegalidade ou erro | Vocabulário proibido verificado por teste; textos fixos por código |
| Alerta de validação legada lido como confirmação | Texto obrigatório "não equivale a confirmação humana"; teste |
| Alerta concluir condição | Texto só cita o trecho literal e diz que o XML não comprova |
| Alerta alterar a 9A | Gerado a partir da 9A, em arquivo separado; `explicacoes.json` comparado byte a byte |

## 12. Arquivos não alterados nesta etapa

Nenhum arquivo de código, teste, dado ou configuração foi alterado. Esta etapa criou somente
`docs/etapa9b/especificacao-alertas.md`.

## 13. Atualização — Etapa 5.3 (2026-09-24)

- O alerta de lote `DECISAO_PENDENTE` (D3) passou a seguir a definição aprovada: itens com ao menos uma regra
  candidata cujo vínculo NCM × item com a fonte oficial não está CONFIRMADO. Título: "Lote: política pendente para
  regras com vínculo NCM × item não CONFIRMADO". No lote real, 6 itens (antes 2.492, pela definição anterior).
- Os demais alertas não mudaram.
