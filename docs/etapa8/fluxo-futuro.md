# Etapa 8: fluxo futuro (especificação de arquitetura)

> **Estado:** só arquitetura. Nenhuma conexão descrita aqui foi implementada. O fluxo
> operacional continua exatamente como está, e as Etapas 1 a 7 continuam fora dele.
>
> **Referências:** matriz da Etapa 6 (`docs/etapa6/matriz-decisao.json`), tipos da Etapa 7
> (`src/tipos.ts`, bloco "Etapa 7"), base v2 (`data/base-normativa.v2.json`).

---

## 1. Fluxo atual (confirmado no código)

```
XML (arquivos, pastas, .zip)
 │
 ▼
parser ─────────────── src/parser.ts: lerXml (l. 69), selecionarVendas (l. 180)
 │                     descarta entrada, devolução, não autorizada, cancelada, duplicada
 ▼
base atual ─────────── data/base-normativa.json (1.369 regras, 18 campos)
 │                     carregada em cli.ts (l. 55), processador.ts (l. 43), servidor.ts (l. 397 e 440)
 ▼
motor ──────────────── src/motor.ts: classificarItem (l. 73)
 │                     1. obrigatoriedade (l. 116)   2. regras vigentes da NCM (l. 129–148)
 │                     3. validações do empresa.json por ncm + cProd + regraId (l. 150–155)
 │                     4. alíquotas vigentes (l. 194)   5. comparação e efeito financeiro (l. 210)
 ▼
veredito atual ─────── Veredito: CORRETO | INCORRETO_ECONOMIA | INCORRETO_RISCO |
                       REQUER_VALIDACAO | NAO_OBRIGATORIO | INDETERMINADO
                       gravado em vereditos.json, indicadores.json, fila-validacao.json (cli.ts l. 78–81)
```

Nada das Etapas 1 a 7 é lido nesse caminho. O JavaScript compilado do motor é idêntico ao de
antes da Etapa 7.

## 2. Fluxo futuro proposto

**Princípio central:** o veredito atual continua sendo calculado exatamente como hoje. O fluxo
futuro **acrescenta uma explicação ao lado dele**; não refaz o cálculo. Só numa fase posterior,
com aprovação explícita, a explicação poderá alterar um estado (seção 12).

```
XML
 │
 ▼
parser ──────────────────────────────── sem mudança
 │
 ▼
identificação/classificação atual ───── motor atual, sem mudança: regras candidatas + veredito atual
 │
 ▼
base atual + camada documental V2 ───── [P2] para cada regra candidata, localizar a regra
 │                                       correspondente na v2 pelo ÍNDICE e pela LINHA
 │                                       (nunca só pelo regraId, que não é único)
 ▼
FONTE_DIZ ───────────────────────────── fatos de vinculacoes (Etapa 5) e original (Etapa 3),
 │                                       com fonte, arquivo, hash, localização e data
 ▼
SISTEMA_INFERE ──────────────────────── status normativo e sinalizadores (matriz, Etapa 6),
 │                                       a partir de comparacao/dadoExtraido; lista fechada
 ▼
condições da operação ───────────────── condições da norma (produto, comprador, operação,
 │                                       composição, destinação): o que o XML comprova é
 │                                       lido do documento; o resto vira pergunta
 ▼
HUMANO_CONFIRMOU, quando aplicável ──── só ValidacaoHumana válida (autor humano, justificativa,
 │                                       chave certa, fontes com o mesmo hash). Legado = histórico
 ▼
SISTEMA_PODE_DECIDIR / matriz ───────── situação da matriz (1–14): permissão, bloqueios,
 │                                       o que exige validação
 ▼
veredito explicado ──────────────────── veredito atual (inalterado) + ExplicacaoVeredito:
                                         statusNormativo, statusBeneficio, fonteDiz[],
                                         sistemaInfere[], humanoConfirmou[], permissao,
                                         sinalizadores, divergências, nível de evidência
```

## 3. Respostas às perguntas

### 3.1 Onde a `base-normativa.v2.json` entra (pergunta 1)

Depois da identificação atual, como **camada documental somente de leitura**:

- O motor continua a escolher as regras candidatas pela base atual (`regrasVigentes`, motor.ts l. 52).
- Para cada regra candidata, um módulo novo e separado (o "explicador", seção 4) localiza a
  regra correspondente da v2 pela posição (`indice`) e confere a `original.linha`.
- A v2 **não substitui** a base atual. As duas coexistem; a projeção da v2 é idêntica à base
  atual, e isso é conferido pelo `verificar_base_v2.mjs`.
- Antes de usar a v2, o explicador confere o hash dela contra o esperado. Se não conferir, a
  **explicação** é desligada e o motor segue normalmente.

### 3.2 Uso futuro dos blocos (pergunta 2)

| Bloco | Uso futuro | Camada |
|---|---|---|
| `original` | Mostrar ao usuário o valor literal da planilha (linha, coluna, texto), ao lado do valor oficial. Base da chave estável da regra (D7) | FONTE_DIZ (fonte não oficial) |
| `originaisAgrupados` | Mostrar as linhas descartadas como duplicata, com os valores que diferem (NCM citado, origem do registro) | FONTE_DIZ (fonte não oficial) |
| `fontes` | Resolver cada fato para arquivo, hash, versão e data; conferir a integridade antes de exibir | FONTE_DIZ (metadados) |
| `vinculacoes` | Fonte dos fatos oficiais e das comparações por regra e por código; lista de lacunas | FONTE_DIZ + SISTEMA_INFERE |

### 3.3 Onde a matriz da Etapa 6 é consultada (pergunta 3)

Num único ponto, **depois** de montados os fatos, as inferências e as confirmações, e **antes**
de montar a explicação. A matriz recebe status normativo, sinalizadores, estado das
condições, confirmações válidas e data do documento, e devolve a `PermissaoDecisao`: situação,
mapeamento permitido, veredito permitido e bloqueios. A matriz nunca lê fontes diretamente e
nunca produz fatos.

### 3.4 Onde entra cada camada (pergunta 4)

| Camada | Entra em | Produz | Nunca |
|---|---|---|---|
| `FONTE_DIZ` | Leitura da v2 (vinculacoes, original, fontes) | `FonteDiz[]` | é recalculada nem parafraseada; o trecho é exibido como está |
| `SISTEMA_INFERE` | Aplicação das regras de leitura (lista fechada `RegraDeInferencia`) | `SistemaInfere[]`, status normativo, sinalizadores | é exibida como "a lei diz" |
| `HUMANO_CONFIRMOU` | Leitura das validações que cumprem a `ValidacaoHumana` | `HumanoConfirmou[]` | é criada pelo sistema; legado não vira confirmação |
| `SISTEMA_PODE_DECIDIR` | Consulta à matriz | `PermissaoDecisao` | é apresentada como afirmação sobre a lei |

### 3.5 Tratamento futuro de cada status (pergunta 5)

| Status | Regras | Tratamento futuro |
|---|---|---|
| `NORMA_CONFIRMADA` | 70 | Exibir código, anexo, item e redução com as duas fontes. O benefício continua pendente até a validação do produto e da condição |
| `NORMA_POSSIVEL_MULTIPLOS_ITENS` | 45 | Exibir a lista de itens possíveis com as fontes. Pedir ao humano a escolha do item (`item_do_anexo`). Nunca escolher o item |
| `CONFLITO_PLANILHA_FONTE` | 11 | Exibir o item oficial (F1 + F2) e o da planilha lado a lado. Alertar. Não usar o item da planilha como fundamento até a divergência ser resolvida |
| `CONFLITO_ENTRE_FONTES` | 1 (frutose) | Exibir as duas fontes. Alertar. Na fase de bloqueio, impedir benefício e risco automáticos |
| `SEM_EVIDENCIA_OFICIAL` | 1.242 | Comportamento atual, com o aviso "baseado em dado não confirmado oficialmente". Política definitiva: D3 |
| `LACUNA_FONTE_SEM_REGRA` | 49 NCMs | Não é regra. Quando um documento trouxer essa NCM com esse código, exibir o fato oficial e alertar que a base não tem regra. Não gerar regra, nem `INCORRETO_RISCO` automático na fase de bloqueio. Inclusão: D5 |

### 3.6 `NORMA_CONFIRMADA ≠ BENEFICIO_CONFIRMADO` (pergunta 6)

```
                      nível normativo                         nível do produto (operação)
                      (regra ↔ norma)                         (item da nota ↔ regra)
                      ─────────────────                       ──────────────────────────
Quem confirma:        fontes (F1 + F2)                        só humano
Tipo:                 StatusNormativo                         StatusBeneficio
Exemplo, linha 815:   NORMA_CONFIRMADA                        BENEFICIO_PENDENTE_VALIDACAO
                      "Anexo VI, item 25: Cloreto crômico,    "O produto é Cloreto crômico e se
                       2827.39.93" (F1) + SVRS 28273993       destina a pessoas com erros inatos
                                                              do metabolismo?"
Só vira ─────────────────────────────────────────────────────▶ BENEFICIO_CONFIRMADO quando existe
                                                              HumanoConfirmou para a chave certa
```

As duas colunas são calculadas separadamente e exibidas separadamente. Nenhuma regra do fluxo
promove `NORMA_CONFIRMADA` a `BENEFICIO_CONFIRMADO`. O tipo já impede `BENEFICIO_CONFIRMADO`
sem `HumanoConfirmou` (Etapa 7).

### 3.7 Onde entram as condições (pergunta 7)

Na etapa "condições da operação", depois de `SISTEMA_INFERE` e antes de `HUMANO_CONFIRMOU`.
Cada condição é uma `CondicaoAplicacao` com os textos literais e o campo `verificavelPeloXml`.

| Condição | Exemplo | O XML comprova? | Tratamento futuro |
|---|---|---|---|
| Do produto (descrição legal) | Todo benefício | Não (só NCM, `xProd` livre) | Pergunta ao humano, chave produto |
| Composição | 45 regras com vários itens (ex.: 2106.90.90, itens 39 a 46) | Não | Escolha humana do item |
| Destinação | 200033: "destinadas às pessoas com erros inatos do metabolismo" (art. 133, § 1º) | Não | Pergunta ao humano, chave produto |
| Do comprador | 200043: administração pública direta, autarquias e fundações (art. 142, I) | Parcial: há `destinatario.cnpj/cpf`, mas não a natureza jurídica | Pergunta ao humano, chave **adquirente**. CPF pode gerar alerta de indício contrário (decisão do usuário). Nunca presumir o tipo do comprador |
| Da operação | 200043: `IndNfce = false` no SVRS | Sim: `documento.modelo` = 65 | Alerta de inconsistência com a tabela oficial; estado: D4 |
| Natureza do item (bares) | art. 275, já implementado | Não | Mecanismo atual (`naturezaPorProduto`), sem mudança |
| Demais condições não comprovadas | art. 133, § 2º (compromisso CMED), aplicabilidade pendente | Não | Só exibir o texto; não criar pergunta nem bloqueio sem decisão |

Regra: **nenhuma condição que o XML não comprova é preenchida pelo sistema.** Ela vira pergunta,
alerta ou fica só exibida.

### 3.8 As 7 validações antigas do "Sistema" (pergunta 8)

- **Origem identificada:** a rota `/api/validar` do `servidor.ts` grava `autor: autor || "Sistema"`
  quando a tela não envia autor. "Sistema" significa **autor não informado**.
- **Futuro:** continuam no `empresa.json` como histórico e continuam sendo lidas pelo motor
  atual como hoje (nada muda no veredito atual). Na explicação, aparecem como `ValidacaoLegada`
  com a classificação `autor_sistema_nao_e_confirmacao_humana`.
- **Nunca** são `HumanoConfirmou`. O status do benefício dos itens que dependem delas fica
  `BENEFICIO_PENDENTE_VALIDACAO` na explicação, com o aviso de que a resposta registrada não tem
  autor humano.
- **D6 continua pendente** (descartar, revalidar ou outra política).

### 3.9 As 49 NCMs oficiais sem regra (pergunta 9)

- Continuam `Lacuna` com status `LACUNA_FONTE_SEM_REGRA`.
- O explicador consulta as lacunas **somente** quando um documento traz essa NCM com esse
  cClassTrib; aí exibe o fato oficial e alerta que a base não tem regra.
- Nenhuma regra é criada ou inferida a partir da lacuna. **D5 continua pendente.**

### 3.10 Frutose 1702.50.00 (pergunta 10)

- O explicador exibe os dois fatos: F1 (Anexo VI, item 54) e F2 (ausente da lista do 200033).
- Status normativo: `CONFLITO_ENTRE_FONTES`; divergência com `resolucao: null`.
- Nenhuma fonte é escolhida; a decisão fica com especialista. Próxima evidência sugerida:
  Portal Nacional da NF-e.

### 3.11 200043 (pergunta 11)

- A condição exibe lado a lado:
  - texto oficial (F1, art. 142, I): "…administração pública direta, autarquias **e** fundações púbicas…";
  - texto da planilha (linha da regra, coluna Observação): "…direta, autarquias **ou** fundações públicas.";
- Nenhuma leitura é escolhida; a pergunta ao humano cita os dois textos. **D2 continua pendente.**

## 4. Mapa de responsabilidades (pergunta 14)

| Arquivo / módulo | Hoje | No futuro |
|---|---|---|
| `src/parser.ts` | Lê XML e seleciona vendas | **Continua igual.** Já entrega `modelo`, `destinatario.cnpj/cpf`, `finalidade` e `cfop`, suficientes para as condições verificáveis. Nenhuma mudança prevista na primeira fase |
| `data/base-normativa.json` | Base que o motor usa | **Continua sendo a base operacional.** Não é substituída pela v2 |
| `data/base-normativa.v2.json` | Documentação (não lida) | Consultada, só para leitura, pelo explicador: fatos, comparações, lacunas e valores originais |
| `src/motor.ts` | Classifica e calcula | **Continua responsável pelo veredito atual.** Na primeira fase, não consome a v2. Numa fase posterior aprovada, poderá receber a `PermissaoDecisao` para aplicar bloqueios |
| Explicador (módulo futuro, ex.: `src/explicacao.ts`) | Não existe | Função pura: (veredito atual, documento, item, v2, matriz, validações) → `ExplicacaoVeredito`. Monta as camadas; nunca altera o veredito |
| Matriz de decisão (`docs/etapa6/matriz-decisao.json`) | Especificação | Autoriza ou proíbe, por situação: mapeamento, veredito automático, validação exigida, bloqueios |
| `src/tipos.ts` | Tipos atuais + contratos da Etapa 7 | Fornece os contratos (`FonteDiz`, `SistemaInfere`, `HumanoConfirmou`, `PermissaoDecisao`, `StatusBeneficio`, `VereditoExplicado`…) |
| Veredito | Estado, motivo, valores | Poderá receber `explicacao` (opcional, `VereditoExplicado`). Na primeira fase, gravada em arquivo separado |
| `src/indicadores.ts` | Indicadores e fila de validação | Futuramente: fila por chave correta (produto, adquirente, item do anexo) |
| `src/servidor.ts` `/api/validar` | Grava validação, preenche "Sistema", sobrescreve a anterior | Futuramente: exigir autor humano e justificativa (ponto `ValidadorAutorHumano`) e guardar histórico |
| `empresa.json` | Validações e configuração | Continua como está; respostas antigas preservadas como histórico |
| `scripts/verificar_*.mjs` | Integridade da v2 e das fontes | Rodar antes de qualquer uso da v2 (condição para ligar o explicador) |

## 5. Pontos de integração futuros (pergunta 15)

Nenhum destes pontos foi modificado.

| Id | Onde | O que acontece no futuro | Fase |
|---|---|---|---|
| P1 | `cli.ts` l. 55, `processador.ts` l. 43, `servidor.ts` l. 397 e 440 (carregamento da base) | Carregar **também** a v2, só leitura, com conferência de hash; a base atual continua sendo a que o motor usa | A |
| P2 | Depois de `classificarDocumentos` (motor.ts l. 282), nos chamadores | Chamar o explicador para cada veredito, sem tocar no veredito | A |
| P3 | `regrasCandidatas` / `regraAplicada` do veredito | Chave para localizar a regra na v2: por índice e linha, porque o regraId não é único | A |
| P4 | Leitura de `validacoes` (motor.ts l. 150–155) | Classificar cada resposta como `ValidacaoHumana` ou `ValidacaoLegada` **no explicador**; o motor continua lendo como hoje | A |
| P5 | Saída (cli.ts l. 78–81; processador.ts l. 80–98) | Gravar as explicações em arquivo novo (ex.: `explicacoes.json`); `vereditos.json` continua byte a byte igual | A |
| P6 | Interface (`servidor.ts`) | Exibir as camadas e os alertas | B |
| P7 | `/api/validar` (`servidor.ts` l. 357) | Exigir autor humano e justificativa; guardar histórico; chave por adquirente no 200043 | C |
| P8 | Dentro do motor, antes de `veredito(...)` (motor.ts l. 210–270) | Aplicar a `PermissaoDecisao` (bloqueios) | D, só após aprovação |

## 6. Onde cada informação pode agir (pergunta 12)

As fases são cumulativas. **A** = informativa, **B** = alertas, **C** = validação exigida,
**D** = influência no estado do veredito. Nenhuma fase foi iniciada.

| Informação | a) Exibir | b) Alertar | c) Bloquear | d) Exigir validação humana | e) Influenciar o veredito |
|---|---|---|---|---|---|
| `NORMA_CONFIRMADA` | A | — | — | C (produto e condição) | D: só depois de `HumanoConfirmou` |
| `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A | B | D: escolha automática do item | C (escolha do item) | D |
| `CONFLITO_PLANILHA_FONTE` | A | B | D: item da planilha como fundamento | C (resolver divergência) | D |
| `CONFLITO_ENTRE_FONTES` (frutose) | A | B | D: enquadramento e cálculo | C (especialista) | D: nunca escolher fonte |
| `SEM_EVIDENCIA_OFICIAL` | A (aviso) | B | depende de D3 | como hoje | depende de D3 |
| `LACUNA_FONTE_SEM_REGRA` | A | B | D: regra automática e risco automático | C (D5) | D: depende de D5 |
| Fundamento divergente / a revisar | A | B | nunca | nunca para o veredito | nunca |
| Vigência ambígua | A | B | D: só entre 2025-05-05 e 2025-12-31 | C, só nesse intervalo | D |
| Condição não verificável no XML | A (texto literal) | — | D: veredito automático | C | D: só com `HumanoConfirmou` |
| 200043 em NFC-e | A | B | depende de D4 | — | depende de D4 |
| 200043 "e" × "ou" | A (os dois textos) | — | — | C (pergunta cita os dois) | depende de D2 |
| Validação legada ("Sistema") | A (histórico) | B | D: não conta como confirmação | C (revalidar, se D6 assim decidir) | depende de D6 |
| regraId duplicado | A | B | D: reuso de validação | C | depende de D7 |
| Alíquota projetada | já rotulada hoje | B | nunca como fato | opt-in `aceitarProjecao` (já existe) | já existe, sem mudança |

## 7. Riscos de integração (pergunta 16)

| Risco | Como aconteceria | Salvaguarda |
|---|---|---|
| Mudança de comportamento | Explicador ou matriz alterar o estado ou os valores do veredito na fase A | Explicador como função pura, depois do motor; `vereditos.json` comparado byte a byte com a versão anterior; JS compilado do motor comparado |
| Mistura entre fonte e inferência | Texto de `SistemaInfere` exibido como trecho legal | Camada obrigatória em toda frase; só `FonteDiz.trecho` pode ser citado como "a lei diz"; teste que rejeita inferência sem camada |
| Lacuna virar regra | Explicador ou motor usar `ncmsOficiaisSemRegra` como candidata | Tipo `Lacuna` não é `RegraClassificacao` (barrado pelo compilador); motor nunca lê lacunas |
| Validação legada virar humana | Converter `RespostaValidacao` em `ValidacaoHumana` | Barrado pelo compilador; construção só por `ValidadorAutorHumano` (runtime, a implementar), que recusa autor ausente ou "Sistema" |
| Decisão pendente receber valor | Preencher D2–D7 com um padrão "razoável" | `DecisaoPendente` não aceita valor (compilador); busca por `"status": "decidida"` nos dados como verificação |
| Conflito resolvido automaticamente | Preferir F1 ou F2 por regra fixa | `Divergencia.resolucao` só com `AutorHumano`; teste que exige `resolucao: null` sem autor |
| Alteração inadvertida dos estados atuais | Refatorar `motor.ts` para "encaixar" o explicador | Fase A não toca `motor.ts`; hashes de `motor.ts` e `motor.js` conferidos a cada etapa |
| Chave errada por regraId | Localizar regra na v2 pelo regraId | Localização por índice + linha; `REGRAID_DUPLICADO` sinalizado |
| v2 desatualizada ou adulterada | Base atual mudar e a v2 não ser regenerada | Conferir hash da v2 e da base antes de explicar; se falhar, desligar a explicação, não o motor |
| Histórico de validação perdido | `/api/validar` sobrescreve a resposta anterior | Registrado; tratar em P7 |

## 8. Critérios de segurança para a integração (pergunta 17)

1. **O comportamento atual continua reproduzível.** Para o mesmo lote de XML, `vereditos.json`,
   `indicadores.json`, `fila-validacao.json` e `descartados.json` saem byte a byte iguais (fora
   o carimbo de hora `calculadoEm`), e os testes atuais passam.
2. **As informações novas começam somente informativas.** Fase A: explicação em arquivo
   separado. Nenhum estado muda antes da fase D, e a fase D exige aprovação por situação da
   matriz, com teste e diff dos vereditos explicado.
3. **Nenhuma fonte nova substitui silenciosamente a base atual.** A v2 é só leitura e
   conferida por hash; a base operacional continua sendo `data/base-normativa.json`.
4. **Nenhuma decisão D2–D7 é assumida.** Enquanto pendente, a situação correspondente fica em
   exibição, alerta ou pergunta.
5. **Nenhuma condição não comprovada pelo XML é inventada.** O que o XML não traz vira pergunta
   ou exibição.
6. **Nenhuma confirmação humana é fabricada pelo sistema.** `HumanoConfirmou` só a partir de
   registro com autor humano e justificativa; "Sistema" ou autor ausente nunca contam.
7. **Toda frase exibida declara a sua camada** (fonte, inferência, humano, matriz).
8. **Cada fase tem teste negativo** das proibições acima antes de ser aprovada.

---

## A) Fluxo atual confirmado

`XML → parser (lerXml, selecionarVendas) → data/base-normativa.json → motor (classificarItem)
→ veredito atual`. Nada das Etapas 1 a 7 é lido nesse caminho (seção 1).

## B) Fluxo futuro proposto

`XML → parser → identificação atual (motor, sem mudança) → base atual + v2 (só leitura, por
índice e linha) → FONTE_DIZ → SISTEMA_INFERE → condições da operação → HUMANO_CONFIRMOU
(quando houver) → matriz (SISTEMA_PODE_DECIDIR) → veredito atual + explicação` (seção 2),
implantado em fases A (informativa), B (alertas), C (validação exigida), D (influência no
estado, só com aprovação).

## C) Pontos de integração

P1 carregamento da v2; P2 chamada do explicador depois do motor; P3 localização por índice e
linha; P4 classificação das validações no explicador; P5 explicações em arquivo separado;
P6 interface; P7 `/api/validar`; P8 bloqueios dentro do motor (fase D) (seção 5).

## D) Responsabilidades futuras

Parser, base atual e motor mantêm as responsabilidades de hoje; a v2 passa a ser consultada
só para leitura; um explicador novo monta as camadas; a matriz autoriza e proíbe; `tipos.ts`
dá os contratos; o veredito ganha `explicacao` opcional (seção 4).

## E) Riscos

Mudança de comportamento; mistura entre fonte e inferência; lacuna virar regra; validação
legada virar humana; decisão pendente receber valor; conflito resolvido automaticamente;
alteração inadvertida dos estados atuais; chave por regraId; v2 desatualizada; histórico de
validação perdido (seção 7).

## F) Critérios de segurança

Os 8 critérios da seção 8, com destaque para: comportamento atual reproduzível byte a byte,
novas informações inicialmente só informativas, nenhuma substituição silenciosa da base,
nenhuma decisão D2–D7 assumida, nenhuma condição inventada, nenhuma confirmação humana
fabricada.

## G) Decisões ainda pendentes

| Id | Tema | Onde bloqueia no fluxo futuro |
|---|---|---|
| D2 | 200043: "e" (lei) × "ou" (planilha); natureza do comprador | Condição do comprador |
| D3 | Política para as 1.242 regras sem evidência oficial | `SEM_EVIDENCIA_OFICIAL`, fases C e D |
| D4 | Estado para 200043 em NFC-e | Condição da operação |
| D5 | Incluir ou não as 49 NCMs oficiais sem regra | `LACUNA_FONTE_SEM_REGRA` |
| D6 | Tratamento das 7 validações com autor "Sistema" | `HUMANO_CONFIRMOU` |
| D7 | Formato da chave estável da regra | Localização da regra e reuso de validação |

Também continuam abertos: frutose (resolução de especialista), 11 itens divergentes,
fundamento do 200043 e do 200033, vigência, caso 2002.10.00 "Água para injeção", CRLF no
snapshot e import do `snapshot_planilha.mjs`.

## H) Arquivos que NÃO foram alterados

`src/motor.ts`, `src/parser.ts`, `src/cli.ts`, `src/tipos.ts`, `src/servidor.ts`,
`src/processador.ts`, `src/indicadores.ts`, `empresa.json`, `data/base-normativa.json`,
`data/base-normativa.v2.json`, `data/fontes/manifesto.json` e demais snapshots, todos os testes
e todos os scripts. Esta etapa criou somente `docs/etapa8/fluxo-futuro.md`.

## Atualização — Etapa 5.3 (2026-09-24)

A linha da D3 acima ("Política para as 1.242 regras sem evidência oficial") descreve a definição anterior. A
definição aprovada na Etapa 5.3 é: **regras cujo vínculo NCM × item com a fonte oficial não está CONFIRMADO na
auditoria oficial**. A contagem deixou de ser 1.242 regras sem vínculo formal: depende do status de cada regra
na auditoria (856 CONFIRMADAS em 1.369). As regras bloqueadas na Fase 2 não entram na D3. A D3 continua pendente.
