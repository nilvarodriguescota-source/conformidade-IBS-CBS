# Etapa 6: matriz de decisão e de confiança

> Proposta para revisão. Nada foi aplicado ao motor, às regras ou à base. Uma inferência nunca é apresentada como fato legal. Toda frase mostrada ao usuário declara a sua camada.

Gerado por `scripts/diagnostico_etapa6.mjs` a partir de `docs/etapa6/matriz-decisao.json` e de `data/base-normativa.v2.json`.

## 1. Camadas de uma afirmação

| Camada | Definição | Como apresentar |
|---|---|---|
| `FONTE_DIZ` | Trecho ou valor literal de uma fonte registrada, com arquivo, SHA-256, localização e data de consulta. | Citar a fonte, a natureza da fonte e o trecho: 'A LC 214/2025, Anexo VI, item 25, lista: Cloreto crômico, 2827.39.93'. |
| `SISTEMA_INFERE` | Conclusão obtida por comparação ou regra de leitura aplicada pelo sistema sobre fatos: cobertura de NCM por prefixo, 6 = VI, 60% = 0,6, enquadramento no art. 544, VI por exclusão, item diferente do da regra. | Sempre com o verbo do sistema: 'O sistema comparou…', 'O sistema identificou…'. Nunca como 'a lei diz'. |
| `HUMANO_CONFIRMOU` | Resposta registrada por pessoa identificada, com data, justificativa e escopo (produto ou adquirente). Registro com autor 'Sistema' ou sem autor não é confirmação humana. | 'Confirmado por <autor> em <data>: <justificativa>'. |
| `SISTEMA_PODE_DECIDIR` | Permissão dada por esta matriz para o sistema emitir uma decisão sem nova intervenção humana. É uma regra de governança, não uma afirmação sobre a lei. | 'Decisão automática permitida pela matriz de decisão, situação N.' |

## 2. Natureza das fontes

| Fonte | Natureza |
|---|---|
| F1 | Norma: LC 214/2025, texto do Planalto. Único que pode sustentar 'a lei diz'. |
| F2 | Tabela operacional oficial do portal da Conformidade Fácil (SVRS). Oficial, mas não é norma: diz como o fisco parametrizou o documento fiscal. |
| PLANILHA | Base interna da planilha V4.1. Não oficial. Serve de origem das regras atuais e de comparação. |

## 3. Dois níveis de enquadramento

| Nível | Significado |
|---|---|
| normativo | Regra ↔ norma: a NCM, o código e o item da regra correspondem ao que as fontes oficiais dizem. Pode ser confirmado por fontes. |
| doProduto | Item da nota ↔ regra: o produto vendido atende à descrição e às condições da norma. Só é confirmado por humano, porque o XML não informa composição, destinação nem natureza do adquirente. |

## 4. Status propostos

| Status | Categoria | Mapeamento automático | Veredito automático | Validação humana | Bloqueia |
|---|---|---|---|---|---|
| `NORMA_CONFIRMADA` | D) enquadramento confirmado (nível normativo) | sim | Não antes da validação do produto; sim depois de HUMANO_CONFIRMOU para a chave correta. | Sim, do produto (descrição e condição da norma). | Não. |
| `NORMA_POSSIVEL_MULTIPLOS_ITENS` | C) enquadramento possível / E) ambíguo | Parcial: código e anexo sim; item não (apresentar a lista de itens possíveis). | Não antes da escolha do item e da validação do produto. | Sim: escolha do item e validação do produto. | Bloqueia a escolha automática do item. |
| `CONFLITO_PLANILHA_FONTE` | F) conflito entre fontes (planilha × oficiais) | Parcial: código e anexo sim (NCM está na lista oficial do código); item não. | Não. | Sim: resolução da divergência (registro com autor, data e justificativa) e validação do produto. | Bloqueia o uso do item da planilha como fundamento até a resolução. |
| `CONFLITO_ENTRE_FONTES` | F) conflito entre fontes (F1 × F2) | não | Não, em nenhum sentido (nem benefício, nem risco). | Sim: decisão de especialista registrada como resolução de divergência. | Sim: bloqueia o enquadramento automático e o cálculo de economia ou exposição. |
| `SEM_EVIDENCIA_OFICIAL` | Regra existente sem evidência oficial auditada | Como hoje, mas com nível de evidência 'planilha' declarado. | Decisão D3 pendente. Proposta: manter o comportamento atual e mostrar 'baseado em dado não confirmado oficialmente'. | Sim, do produto (como hoje). | Não, para não regredir; depende de D3. |
| `LACUNA_FONTE_SEM_REGRA` | G) ausência de regra | não | Não: nem conceder o benefício, nem apontar risco por 'benefício sem regra'. | Sim: decisão D5 (incluir ou não como regra de origem oficial). | Sim: bloqueia a criação automática de regra e o veredito INCORRETO_RISCO automático para essa NCM com esse código. |

## 5. Sinalizadores (não exclusivos)

| Sinalizador | Definição | Efeito |
|---|---|---|
| `FUNDAMENTO_DIVERGENTE` | Dispositivo citado na regra difere do indicado por F1 e F2 (200043: art. 140 × art. 142, I). | Alerta de texto; não bloqueia; mostrar o fundamento oficial com fonte. |
| `FUNDAMENTO_A_REVISAR` | Dispositivo citado na regra coincide em parte com o oficial (200033: arts. 133 e 134 × art. 133, § 1º). | Alerta de texto; não bloqueia. |
| `VIGENCIA_AMBIGUA` | As fontes trazem datas diferentes para atributos diferentes (efeitos da lei, código na tabela, lista de NCMs). | Documento de 2026-01-01 em diante: as três datas já passaram (SISTEMA_INFERE), sem bloqueio. Documento entre 2025-05-05 e 2025-12-31: bloqueia a decisão automática. Antes de 2025-05-05: fora de vigência em todas as fontes. |
| `DEPENDE_COMPOSICAO_PRODUTO` | Mais de um item do anexo cobre a NCM. | Exige escolha humana do item. |
| `CONDICAO_NAO_VERIFICAVEL_NO_XML` | A norma condiciona o benefício a algo que o XML não informa. 200033: destinação às pessoas com erros inatos do metabolismo (art. 133, § 1º). 200043: fornecimento à administração pública direta, autarquias e fundações públicas (art. 142, I). | Veredito só depois de HUMANO_CONFIRMOU; para 200043 a chave é o adquirente, não o produto. |
| `NCM_EM_OUTROS_CODIGOS` | A mesma NCM também tem regra de outro cClassTrib na base. | O motor já trata como REQUER_VALIDACAO com as opções; manter e mostrar a evidência de cada opção. |
| `REGRAID_DUPLICADO` | Duas regras com o mesmo id (23080000-200038-IX-23.06, linhas 776 e 777). | Bloqueia a reutilização de validação humana por regraId para essas regras até existir chave estável. |

## 6. Matriz de decisão: 14 situações

### 1. NCM + item único + evidência coincidente

| Aspecto | Proposta |
|---|---|
| Condição de entrada | Regra com status NORMA_CONFIRMADA. |
| Evidência necessária | Fato F1 (linha do anexo) e fato F2 (entrada da lista) para a NCM, com o mesmo item e a mesma descrição. |
| Fontes | F1 (norma) e F2 (tabela operacional). |
| Grau da evidência | Forte: duas fontes oficiais independentes coincidem entre si e com a regra. |
| Decisão automática | Mapeamento normativo: sim. Veredito do produto: só depois de HUMANO_CONFIRMOU. |
| Validação humana | Sim, do produto e da condição da norma. |
| Bloqueio | Não. |
| Justificativa ao usuário | FONTE_DIZ: 'LC 214/2025, Anexo VI, item 25: Cloreto crômico, 2827.39.93; o SVRS lista 28273993 no 200033 como Cloreto crômico.' SISTEMA_INFERE: 'O item da regra coincide com as duas fontes.' Pendente: 'Confirme que o produto é Cloreto crômico e se destina a pessoas com erros inatos do metabolismo.' |
| Rastreabilidade | Id do registro de vinculação, fatos com arquivo, hash e localização, linha da planilha, regraId e índice. |

### 2. NCM em múltiplos itens

| Aspecto | Proposta |
|---|---|
| Condição de entrada | Regra com status NORMA_POSSIVEL_MULTIPLOS_ITENS. |
| Evidência necessária | Todos os fatos F1 dos itens que cobrem a NCM e todas as entradas F2 da NCM. |
| Fontes | F1 e F2. |
| Grau da evidência | Forte para a presença da NCM no código; insuficiente para o item. |
| Decisão automática | Código e anexo: sim. Item: não. |
| Validação humana | Sim: escolher o item pela composição do produto. |
| Bloqueio | Bloqueia a escolha automática do item. |
| Justificativa ao usuário | FONTE_DIZ: 'A NCM 2106.90.90 aparece nos itens 39 a 46 do Anexo VI.' SISTEMA_INFERE: 'A NCM não determina o item.' Pendente: 'Indique qual fórmula é o produto.' |
| Rastreabilidade | Lista de itens candidatos com os fatos de cada um; item escolhido e quem escolheu. |

### 3. NCM encontrada na fonte, sem regra

| Aspecto | Proposta |
|---|---|
| Condição de entrada | NCM em vinculacoes.ncmsOficiaisSemRegra e documento com essa NCM. |
| Evidência necessária | Fato F2 (entrada da lista) e, quando houver, fato F1 (item do anexo que cobre a NCM). |
| Fontes | F1 e F2. |
| Grau da evidência | Presença oficial comprovada; ausência de regra na base. |
| Decisão automática | Não. |
| Validação humana | Sim: decisão D5. |
| Bloqueio | Sim: não criar regra e não apontar INCORRETO_RISCO por 'benefício sem regra' para essa NCM com esse código. |
| Justificativa ao usuário | FONTE_DIZ: 'O SVRS lista 87091100 no 200043 (item 2.1 do Anexo XI, código 8709).' SISTEMA_INFERE: 'A base não tem regra para esta NCM neste código.' Pendente: 'Decidir se a regra deve ser incluída.' |
| Rastreabilidade | Id S-<código>-<ncm>, fatos e regras de outros códigos com a mesma NCM. |

### 4. Regra existente sem evidência oficial

| Aspecto | Proposta |
|---|---|
| Condição de entrada | Regra com status SEM_EVIDENCIA_OFICIAL. |
| Evidência necessária | Só a linha da planilha (original). |
| Fontes | PLANILHA. |
| Grau da evidência | Fraco: fonte interna não oficial. |
| Decisão automática | Decisão D3 pendente; proposta: comportamento atual, com o nível de evidência declarado. |
| Validação humana | Sim, do produto (como hoje). |
| Bloqueio | Não (depende de D3). |
| Justificativa ao usuário | FONTE_DIZ (não oficial): 'A planilha V4.1, linha N, enquadra esta NCM no código X.' Aviso: 'Não confirmado em fonte oficial.' |
| Rastreabilidade | Linha da planilha e hash do snapshot. |

### 5. Conflito planilha × fonte oficial

| Aspecto | Proposta |
|---|---|
| Condição de entrada | Regra com status CONFLITO_PLANILHA_FONTE. |
| Evidência necessária | Fatos F1 e F2 do item oficial e valor da planilha (original.valores). |
| Fontes | F1, F2 e PLANILHA. |
| Grau da evidência | Forte para o item oficial (duas fontes concordam); a planilha diverge. |
| Decisão automática | Código e anexo: sim. Item: não. |
| Validação humana | Sim: resolução registrada da divergência. |
| Bloqueio | Bloqueia o item da planilha como fundamento até a resolução. |
| Justificativa ao usuário | FONTE_DIZ: 'LC 214 e SVRS associam 2827.20.10 ao item 26 (Cloreto de cálcio).' FONTE_DIZ (não oficial): 'A planilha registra o item 66 (Lisina).' SISTEMA_INFERE: 'Os itens divergem.' |
| Rastreabilidade | Os três valores com as suas fontes; futura divergência com status e resolução. |

### 6. Conflito F1 × F2

| Aspecto | Proposta |
|---|---|
| Condição de entrada | Regra com status CONFLITO_ENTRE_FONTES. |
| Evidência necessária | Fato da fonte que lista e registro da ausência na outra. |
| Fontes | F1 e F2. |
| Grau da evidência | Contraditório. |
| Decisão automática | Não, em nenhum sentido. |
| Validação humana | Sim: especialista; próxima evidência sugerida: Portal Nacional da NF-e. |
| Bloqueio | Sim. |
| Justificativa ao usuário | FONTE_DIZ: 'A LC 214, Anexo VI, item 54, lista Frutose, 1702.50.00.' FONTE_DIZ: 'O SVRS não lista 17025000 no 200033.' SISTEMA_INFERE: 'As fontes oficiais divergem; nenhuma prevalece automaticamente.' |
| Rastreabilidade | Os dois fatos e a futura resolução. |

### 7. Divergência de vigência

| Aspecto | Proposta |
|---|---|
| Condição de entrada | Sinalizador VIGENCIA_AMBIGUA e data do documento. |
| Evidência necessária | Art. 544, VI (F1); DthIniVig do código e da lista (F2). |
| Fontes | F1 e F2. |
| Grau da evidência | Datas comprovadas; o significado de cada uma é SISTEMA_INFERE. |
| Decisão automática | Sim para documento de 2026-01-01 em diante; não entre 2025-05-05 e 2025-12-31. |
| Validação humana | Só no intervalo ambíguo. |
| Bloqueio | Sim no intervalo 2025-05-05 a 2025-12-31. |
| Justificativa ao usuário | FONTE_DIZ: 'Art. 544, VI: efeitos a partir de 1º/1/2026 para os demais dispositivos.' SISTEMA_INFERE: 'Os arts. 133 e 142 não constam dos incisos I a V.' |
| Rastreabilidade | As três datas com as suas fontes; nenhuma escolhida no dado. |

### 8. Fundamento legal divergente

| Aspecto | Proposta |
|---|---|
| Condição de entrada | Sinalizador FUNDAMENTO_DIVERGENTE ou FUNDAMENTO_A_REVISAR. |
| Evidência necessária | Parágrafo vigente do artigo oficial (F1) e TexUrlLegislacao (F2). |
| Fontes | F1 e F2. |
| Grau da evidência | Forte para o dispositivo oficial. |
| Decisão automática | Sim para mostrar o fundamento oficial ao lado do da regra; não para substituir. |
| Validação humana | Não para o veredito; sim para corrigir a base (Etapa 7). |
| Bloqueio | Não. |
| Justificativa ao usuário | FONTE_DIZ: 'LC 214, art. 142, I.' Aviso: 'A base cita o art. 140, que trata de comunicação institucional.' |
| Rastreabilidade | Fatos do art. oficial e do art. citado; valor da regra. |

### 9. Fonte oficial sem correspondência na planilha

| Aspecto | Proposta |
|---|---|
| Condição de entrada | Informação oficial para a qual a regra não tem campo: redução de IBS e CBS separadas, IndNfce, datas de vigência do código, condição literal. |
| Evidência necessária | Fato F1 ou F2 correspondente. |
| Fontes | F1 e F2. |
| Grau da evidência | Comprovado na fonte; sem contraparte na planilha. |
| Decisão automática | Só para parte verificável no XML (ex.: 200043 em NFC-e contra IndNfce = false), e o estado depende da decisão D4. |
| Validação humana | Para o que o XML não comprova. |
| Bloqueio | Não por si só. |
| Justificativa ao usuário | FONTE_DIZ: 'O SVRS indica que o 200043 não é habilitado para NFC-e (IndNfce = false).' |
| Rastreabilidade | Fato F2 com localização do campo. |

### 10. Informação que depende da composição ou descrição do produto

| Aspecto | Proposta |
|---|---|
| Condição de entrada | Sinalizador DEPENDE_COMPOSICAO_PRODUTO ou CONDICAO_NAO_VERIFICAVEL_NO_XML. |
| Evidência necessária | Descrição legal do item (F1) e condição da norma (F1). |
| Fontes | F1. |
| Grau da evidência | Norma clara; aplicação ao produto não verificável automaticamente. |
| Decisão automática | Não. |
| Validação humana | Sim. |
| Bloqueio | Bloqueia veredito automático até a validação. |
| Justificativa ao usuário | FONTE_DIZ: trecho literal da condição. Pendente: pergunta objetiva ao usuário. |
| Rastreabilidade | Trecho da condição e resposta humana com escopo. |

### 11. Validação humana existente

| Aspecto | Proposta |
|---|---|
| Condição de entrada | Resposta SIM ou NÃO para a chave do item, com autor humano identificado. |
| Evidência necessária | Registro com autor, data, justificativa, escopo e as fontes vigentes na data da resposta. |
| Fontes | HUMANO_CONFIRMOU sobre FONTE_DIZ. |
| Grau da evidência | Decisivo para aquela chave. |
| Decisão automática | Sim para a mesma chave, enquanto as fontes e a regra não mudarem. |
| Validação humana | Já feita. |
| Bloqueio | Não. Deixa de valer (volta à situação 12) se: autor 'Sistema' ou ausente; chave por regraId duplicado; chave por produto quando a condição é do adquirente (200043); hash das fontes mudou desde a resposta. |
| Justificativa ao usuário | HUMANO_CONFIRMOU: 'Confirmado por <autor> em <data>: <justificativa>.' |
| Rastreabilidade | Registro completo da validação e fontes usadas. |

### 12. Ausência de validação humana

| Aspecto | Proposta |
|---|---|
| Condição de entrada | Nenhuma validação válida para a chave. |
| Evidência necessária | — |
| Fontes | — |
| Grau da evidência | — |
| Decisão automática | Não para o veredito; economia e exposição ficam nulas com o motivo. |
| Validação humana | Sim. |
| Bloqueio | Bloqueia o veredito até a resposta. |
| Justificativa ao usuário | 'Pendente de validação: <pergunta objetiva>.' |
| Rastreabilidade | Item na fila de validação com o valor em jogo. |

### 13. regraId duplicado

| Aspecto | Proposta |
|---|---|
| Condição de entrada | Sinalizador REGRAID_DUPLICADO. |
| Evidência necessária | Linha da planilha de cada regra (original.linha). |
| Fontes | PLANILHA. |
| Grau da evidência | Defeito de identificação. |
| Decisão automática | Não para aplicar validação por regraId. |
| Validação humana | Sim, com chave estável (por linha) quando existir. |
| Bloqueio | Sim: bloqueia reutilizar a validação dessas regras até existir chave estável. |
| Justificativa ao usuário | 'Duas regras têm o mesmo identificador; a validação não pode ser atribuída com segurança.' |
| Rastreabilidade | As duas linhas da planilha. |

### 14. Projeção normativa ainda não confirmada

| Aspecto | Proposta |
|---|---|
| Condição de entrada | (a) alíquota do tipo 'projecao' (ex.: CBS 2027) ou (b) propostaFutura de uma vinculação ainda não aplicada. |
| Evidência necessária | Parâmetro com fonte declarada como estimativa; registro de vinculação. |
| Fontes | parametros.ts; vinculacoes. |
| Grau da evidência | Não oficial (a) ou não aprovado (b). |
| Decisão automática | (a) só com aceitarProjecao, rotulado como projeção; (b) nunca usado pelo motor. |
| Validação humana | (a) opt-in explícito; (b) aprovação da etapa correspondente. |
| Bloqueio | Sim para tratar qualquer um dos dois como fato. |
| Justificativa ao usuário | 'Valor calculado com alíquota projetada, não oficial: <fonte da estimativa>.' |
| Rastreabilidade | Tipo do parâmetro e fonte; id da proposta. |

## 7. Contagens

| Status | No escopo (200033 + 200043) | Na base inteira |
|---|---|---|
| `NORMA_CONFIRMADA` | 70 | 70 |
| `NORMA_POSSIVEL_MULTIPLOS_ITENS` | 45 | 45 |
| `CONFLITO_PLANILHA_FONTE` | 11 | 11 |
| `CONFLITO_ENTRE_FONTES` | 1 | 1 |
| `SEM_EVIDENCIA_OFICIAL` | 0 | 1242 |
| `LACUNA_FONTE_SEM_REGRA` | — | 49 NCMs (não são regras) |
| **Total de regras** | 127 | 1369 |

| Sinalizador | Regras no escopo |
|---|---|
| `FUNDAMENTO_A_REVISAR` | 85 |
| `VIGENCIA_AMBIGUA` | 127 |
| `CONDICAO_NAO_VERIFICAVEL_NO_XML` | 127 |
| `NCM_EM_OUTROS_CODIGOS` | 33 |
| `DEPENDE_COMPOSICAO_PRODUTO` | 45 |
| `FUNDAMENTO_DIVERGENTE` | 42 |

regraId duplicado na base inteira: 2 regras (fora do escopo).

Validações no empresa.json: 8 (autor "Sistema": 7; autor humano: 1; sem justificativa: 7; sobre regras do escopo: 0).

## 8. Exemplos por status

| Status | Linha | regraId | NCM | Evidência F1 | Evidência F2 | Motivo |
|---|---|---|---|---|---|---|
| `NORMA_CONFIRMADA` | 652 | 15131900-200033-VI-81 | 15131900 | Anexo VI item 81 (1513.19.00) | lista (1 descrição(ões): Triglicerídeos de cadeia média) | F1 e F2 associam a NCM ao item 81 (Triglicerídeos de cadeia média); o item da regra coincide. |
| `NORMA_POSSIVEL_MULTIPLOS_ITENS` | 761 | 21069090-200033-VI-39 | 21069090 | Anexo VI item 39 (2106.90.90) + Anexo VI item 40 (2106.90.90) + Anexo VI item 41 (2106.90.90) + Anexo VI item 42 (2106.90.90) + Anexo VI item 43 (2106.90.90) + Anexo VI item 44 (2106.90.90) + Anexo VI item 45 (2106.90.90) + Anexo VI item 46 (2106.90.90) | lista (8 descrição(ões): Fórmula para dieta cetogênica, na proporção de 4 g de gordura para cada 1 g de carboidratos e proteínas / Fórmula para dieta isenta de metionina, de treonina, de valina e restrita de isoleucina / Fórmula para dieta isenta de aminoácidos não essenciais / Fórmula para dieta isenta de fenilalanina e de metionina / Fórmula para dieta isenta de leucina, de isoleucina ou de valina / Fórmula para dieta isenta de lisina e pobre de triptofano / Fórmula para dieta isenta demetionina / Fórmula para dieta isenta de fenilalanina) | A NCM é coberta pelos itens 39, 40, 41, 42, 43, 44, 45, 46; o item da regra (39) está entre eles; o item depende da composição do produto. |
| `CONFLITO_PLANILHA_FONTE` | 811 | 28272010-200033-VI-66 | 28272010 | Anexo VI item 26 (2827.20.10) | lista (1 descrição(ões): Cloreto de cálcio) | F1 e F2 associam a NCM ao item 26 (Cloreto de cálcio); a regra (planilha) traz o item 66. |
| `CONFLITO_ENTRE_FONTES` | 684 | 17025000-200033-VI-54 | 17025000 | Anexo VI item 54 (1702.50.00) | não lista no 200033 | A LC 214 lista a NCM (item 54); o SVRS não a lista no 200033. Nenhuma fonte prevalece. |

## 9. Campos que o motor precisará conhecer (não adicionados)

| Entidade | Campo | Finalidade |
|---|---|---|
| regra | `chaveEstavel` | Identificador único (ex.: linha da planilha ou hash), para substituir regraId como chave de validação. |
| regra | `statusDecisao` | Um dos status desta matriz. |
| regra | `sinalizadores` | Lista de sinalizadores desta matriz. |
| regra | `evidencias` | Ids dos registros de vinculacoes que sustentam a regra. |
| regra | `oficial.itensPossiveis / oficial.itemConfirmado` | Itens do anexo segundo F1 e F2, separados do item da planilha. |
| regra | `oficial.reducaoIBS / oficial.reducaoCBS` | Redução por tributo, com fonte. |
| regra | `oficial.fundamentoLegal` | Dispositivo oficial, sem substituir fundamentoLegal. |
| regra | `oficial.vigencias[]` | Datas por atributo (efeitos da lei, código, lista), cada uma com fonte. |
| condicao | `id, natureza, textoLiteral, fonte, verificavelPeloXml, chaveDeValidacao (produto \| adquirente)` | Condições da norma referenciadas pelas regras. |
| divergencia | `id, tipo, valores por fonte, impacto, status, resolucao {autor, data, justificativa}` | Conflitos registrados e resolvidos sem alterar os dados de origem. |
| validacao | `chave (produto ou adquirente), escopo, autor humano, data, justificativa, evidencia, hashDasFontesNaData` | Distinguir HUMANO_CONFIRMOU de registro automático e invalidar respostas quando as fontes mudarem. |
| documento | `destinatario (tipo de pessoa, CNPJ, natureza jurídica quando disponível)` | Chave de validação por adquirente no 200043. |
| veredito | `camadas {fonteDiz[], sistemaInfere[], humanoConfirmou[]}, decisaoAutomatica, situacaoDaMatriz, bloqueio {motivo}, nivelEvidencia, fontesUsadas, divergenciasAplicaveis` | Explicar ao usuário cada decisão separando fato, inferência e confirmação. |

## 10. Decisões pendentes

| Id | Tema |
|---|---|
| D2 | Combinação dos tipos de adquirente do 200043 ('e' na lei, 'ou' na planilha). |
| D3 | Política para regras cujo vínculo NCM × item com a fonte oficial não está CONFIRMADO na auditoria oficial (definição aprovada na Etapa 5.3; antes: regras sem evidência oficial, 1.242). Regras bloqueadas na Fase 2 já têm política e não entram na D3. Continua pendente. |
| D4 | Estado para a inconsistência verificável (200043 em NFC-e). |
| D5 | Incluir ou não as NCMs oficiais sem regra como regras de origem oficial. |
| D6 | Validações com autor 'Sistema' no empresa.json: tratar como não confirmadas por humano? |
| D7 | Formato da chave estável que substituirá regraId. |

## 11. Diagnóstico das 127 regras (200033 e 200043)

Mesmo conteúdo de `diagnostico-200033-200043.csv`.

| regraId | Linha | NCM | Código | Evidência F1 | Evidência F2 | Status | Motivo | Decisão automática permitida? |
|---|---|---|---|---|---|---|---|---|
| 15131900-200033-VI-81 | 652 | 15131900 | 200033 | Anexo VI item 81 (1513.19.00) | lista (1 descrição(ões): Triglicerídeos de cadeia média) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 81 (Triglicerídeos de cadeia média); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 15132911-200033-VI-81 | 658 | 15132911 | 200033 | Anexo VI item 81 (1513.29.11) | lista (1 descrição(ões): Triglicerídeos de cadeia média) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 81 (Triglicerídeos de cadeia média); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 17023011-200033-VI-58 | 683 | 17023011 | 200033 | Anexo VI item 58 (1702.30.11) | lista (1 descrição(ões): Glicose) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 58 (Glicose); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 17025000-200033-VI-54 | 684 | 17025000 | 200033 | Anexo VI item 54 (1702.50.00) | não lista no 200033 | `CONFLITO_ENTRE_FONTES` | A LC 214 lista a NCM (item 54); o SVRS não a lista no 200033. Nenhuma fonte prevalece. | mapeamento: não; veredito: não |
| 21069090-200033-VI-39 | 761 | 21069090 | 200033 | Anexo VI item 39 (2106.90.90) + Anexo VI item 40 (2106.90.90) + Anexo VI item 41 (2106.90.90) + Anexo VI item 42 (2106.90.90) + Anexo VI item 43 (2106.90.90) + Anexo VI item 44 (2106.90.90) + Anexo VI item 45 (2106.90.90) + Anexo VI item 46 (2106.90.90) | lista (8 descrição(ões): Fórmula para dieta cetogênica, na proporção de 4 g de gordura para cada 1 g de carboidratos e proteínas / Fórmula para dieta isenta de metionina, de treonina, de valina e restrita de isoleucina / Fórmula para dieta isenta de aminoácidos não essenciais / Fórmula para dieta isenta de fenilalanina e de metionina / Fórmula para dieta isenta de leucina, de isoleucina ou de valina / Fórmula para dieta isenta de lisina e pobre de triptofano / Fórmula para dieta isenta demetionina / Fórmula para dieta isenta de fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 39, 40, 41, 42, 43, 44, 45, 46; o item da regra (39) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 21069090-200033-VI-40 | 762 | 21069090 | 200033 | Anexo VI item 39 (2106.90.90) + Anexo VI item 40 (2106.90.90) + Anexo VI item 41 (2106.90.90) + Anexo VI item 42 (2106.90.90) + Anexo VI item 43 (2106.90.90) + Anexo VI item 44 (2106.90.90) + Anexo VI item 45 (2106.90.90) + Anexo VI item 46 (2106.90.90) | lista (8 descrição(ões): Fórmula para dieta cetogênica, na proporção de 4 g de gordura para cada 1 g de carboidratos e proteínas / Fórmula para dieta isenta de metionina, de treonina, de valina e restrita de isoleucina / Fórmula para dieta isenta de aminoácidos não essenciais / Fórmula para dieta isenta de fenilalanina e de metionina / Fórmula para dieta isenta de leucina, de isoleucina ou de valina / Fórmula para dieta isenta de lisina e pobre de triptofano / Fórmula para dieta isenta demetionina / Fórmula para dieta isenta de fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 39, 40, 41, 42, 43, 44, 45, 46; o item da regra (40) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 21069090-200033-VI-41 | 763 | 21069090 | 200033 | Anexo VI item 39 (2106.90.90) + Anexo VI item 40 (2106.90.90) + Anexo VI item 41 (2106.90.90) + Anexo VI item 42 (2106.90.90) + Anexo VI item 43 (2106.90.90) + Anexo VI item 44 (2106.90.90) + Anexo VI item 45 (2106.90.90) + Anexo VI item 46 (2106.90.90) | lista (8 descrição(ões): Fórmula para dieta cetogênica, na proporção de 4 g de gordura para cada 1 g de carboidratos e proteínas / Fórmula para dieta isenta de metionina, de treonina, de valina e restrita de isoleucina / Fórmula para dieta isenta de aminoácidos não essenciais / Fórmula para dieta isenta de fenilalanina e de metionina / Fórmula para dieta isenta de leucina, de isoleucina ou de valina / Fórmula para dieta isenta de lisina e pobre de triptofano / Fórmula para dieta isenta demetionina / Fórmula para dieta isenta de fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 39, 40, 41, 42, 43, 44, 45, 46; o item da regra (41) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 21069090-200033-VI-42 | 764 | 21069090 | 200033 | Anexo VI item 39 (2106.90.90) + Anexo VI item 40 (2106.90.90) + Anexo VI item 41 (2106.90.90) + Anexo VI item 42 (2106.90.90) + Anexo VI item 43 (2106.90.90) + Anexo VI item 44 (2106.90.90) + Anexo VI item 45 (2106.90.90) + Anexo VI item 46 (2106.90.90) | lista (8 descrição(ões): Fórmula para dieta cetogênica, na proporção de 4 g de gordura para cada 1 g de carboidratos e proteínas / Fórmula para dieta isenta de metionina, de treonina, de valina e restrita de isoleucina / Fórmula para dieta isenta de aminoácidos não essenciais / Fórmula para dieta isenta de fenilalanina e de metionina / Fórmula para dieta isenta de leucina, de isoleucina ou de valina / Fórmula para dieta isenta de lisina e pobre de triptofano / Fórmula para dieta isenta demetionina / Fórmula para dieta isenta de fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 39, 40, 41, 42, 43, 44, 45, 46; o item da regra (42) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 21069090-200033-VI-43 | 765 | 21069090 | 200033 | Anexo VI item 39 (2106.90.90) + Anexo VI item 40 (2106.90.90) + Anexo VI item 41 (2106.90.90) + Anexo VI item 42 (2106.90.90) + Anexo VI item 43 (2106.90.90) + Anexo VI item 44 (2106.90.90) + Anexo VI item 45 (2106.90.90) + Anexo VI item 46 (2106.90.90) | lista (8 descrição(ões): Fórmula para dieta cetogênica, na proporção de 4 g de gordura para cada 1 g de carboidratos e proteínas / Fórmula para dieta isenta de metionina, de treonina, de valina e restrita de isoleucina / Fórmula para dieta isenta de aminoácidos não essenciais / Fórmula para dieta isenta de fenilalanina e de metionina / Fórmula para dieta isenta de leucina, de isoleucina ou de valina / Fórmula para dieta isenta de lisina e pobre de triptofano / Fórmula para dieta isenta demetionina / Fórmula para dieta isenta de fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 39, 40, 41, 42, 43, 44, 45, 46; o item da regra (43) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 21069090-200033-VI-44 | 766 | 21069090 | 200033 | Anexo VI item 39 (2106.90.90) + Anexo VI item 40 (2106.90.90) + Anexo VI item 41 (2106.90.90) + Anexo VI item 42 (2106.90.90) + Anexo VI item 43 (2106.90.90) + Anexo VI item 44 (2106.90.90) + Anexo VI item 45 (2106.90.90) + Anexo VI item 46 (2106.90.90) | lista (8 descrição(ões): Fórmula para dieta cetogênica, na proporção de 4 g de gordura para cada 1 g de carboidratos e proteínas / Fórmula para dieta isenta de metionina, de treonina, de valina e restrita de isoleucina / Fórmula para dieta isenta de aminoácidos não essenciais / Fórmula para dieta isenta de fenilalanina e de metionina / Fórmula para dieta isenta de leucina, de isoleucina ou de valina / Fórmula para dieta isenta de lisina e pobre de triptofano / Fórmula para dieta isenta demetionina / Fórmula para dieta isenta de fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 39, 40, 41, 42, 43, 44, 45, 46; o item da regra (44) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 21069090-200033-VI-45 | 767 | 21069090 | 200033 | Anexo VI item 39 (2106.90.90) + Anexo VI item 40 (2106.90.90) + Anexo VI item 41 (2106.90.90) + Anexo VI item 42 (2106.90.90) + Anexo VI item 43 (2106.90.90) + Anexo VI item 44 (2106.90.90) + Anexo VI item 45 (2106.90.90) + Anexo VI item 46 (2106.90.90) | lista (8 descrição(ões): Fórmula para dieta cetogênica, na proporção de 4 g de gordura para cada 1 g de carboidratos e proteínas / Fórmula para dieta isenta de metionina, de treonina, de valina e restrita de isoleucina / Fórmula para dieta isenta de aminoácidos não essenciais / Fórmula para dieta isenta de fenilalanina e de metionina / Fórmula para dieta isenta de leucina, de isoleucina ou de valina / Fórmula para dieta isenta de lisina e pobre de triptofano / Fórmula para dieta isenta demetionina / Fórmula para dieta isenta de fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 39, 40, 41, 42, 43, 44, 45, 46; o item da regra (45) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 21069090-200033-VI-46 | 768 | 21069090 | 200033 | Anexo VI item 39 (2106.90.90) + Anexo VI item 40 (2106.90.90) + Anexo VI item 41 (2106.90.90) + Anexo VI item 42 (2106.90.90) + Anexo VI item 43 (2106.90.90) + Anexo VI item 44 (2106.90.90) + Anexo VI item 45 (2106.90.90) + Anexo VI item 46 (2106.90.90) | lista (8 descrição(ões): Fórmula para dieta cetogênica, na proporção de 4 g de gordura para cada 1 g de carboidratos e proteínas / Fórmula para dieta isenta de metionina, de treonina, de valina e restrita de isoleucina / Fórmula para dieta isenta de aminoácidos não essenciais / Fórmula para dieta isenta de fenilalanina e de metionina / Fórmula para dieta isenta de leucina, de isoleucina ou de valina / Fórmula para dieta isenta de lisina e pobre de triptofano / Fórmula para dieta isenta demetionina / Fórmula para dieta isenta de fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 39, 40, 41, 42, 43, 44, 45, 46; o item da regra (46) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 22029900-200033-VI-47 | 770 | 22029900 | 200033 | Anexo VI item 47 (2202.99.00) + Anexo VI item 48 (2202.99.00) | lista (2 descrição(ões): Preparação líquida, de quatro partes de trioleato de glicerol de ácido para uma parte de trierucato de glicerol / Fórmula hiperlipídica, para suplementação de triglicerídios de cadeia média ou triheptanoína) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 47, 48; o item da regra (47) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 22029900-200033-VI-48 | 771 | 22029900 | 200033 | Anexo VI item 47 (2202.99.00) + Anexo VI item 48 (2202.99.00) | lista (2 descrição(ões): Preparação líquida, de quatro partes de trioleato de glicerol de ácido para uma parte de trierucato de glicerol / Fórmula hiperlipídica, para suplementação de triglicerídios de cadeia média ou triheptanoína) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 47, 48; o item da regra (48) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 25010090-200033-VI-30 | 791 | 25010090 | 200033 | Anexo VI item 30 (2501.00.90) | lista (1 descrição(ões): Cloreto de sódio) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 30 (Cloreto de sódio); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 28111990-200033-VI-14 | 808 | 28111990 | 200033 | Anexo VI item 14 (2811.19.90) | lista (1 descrição(ões): Ácido selenioso) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 14 (Ácido selenioso); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 28272010-200033-VI-66 | 811 | 28272010 | 200033 | Anexo VI item 26 (2827.20.10) | lista (1 descrição(ões): Cloreto de cálcio) | `CONFLITO_PLANILHA_FONTE` | F1 e F2 associam a NCM ao item 26 (Cloreto de cálcio); a regra (planilha) traz o item 66. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 28272090-200033-VI-66 | 812 | 28272090 | 200033 | Anexo VI item 26 (2827.20.90) | lista (1 descrição(ões): Cloreto de cálcio) | `CONFLITO_PLANILHA_FONTE` | F1 e F2 associam a NCM ao item 26 (Cloreto de cálcio); a regra (planilha) traz o item 66. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 28273110-200033-VI-66 | 813 | 28273110 | 200033 | Anexo VI item 27 (2827.31.10) | lista (1 descrição(ões): Cloreto de magnésio) | `CONFLITO_PLANILHA_FONTE` | F1 e F2 associam a NCM ao item 27 (Cloreto de magnésio); a regra (planilha) traz o item 66. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 28273190-200033-VI-66 | 814 | 28273190 | 200033 | Anexo VI item 27 (2827.31.90) | lista (1 descrição(ões): Cloreto de magnésio) | `CONFLITO_PLANILHA_FONTE` | F1 e F2 associam a NCM ao item 27 (Cloreto de magnésio); a regra (planilha) traz o item 66. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 28273993-200033-VI-25 | 815 | 28273993 | 200033 | Anexo VI item 25 (2827.39.93) | lista (1 descrição(ões): Cloreto crômico) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 25 (Cloreto crômico); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 28273995-200033-VI-66 | 816 | 28273995 | 200033 | Anexo VI item 28 (2827.39.95) | lista (1 descrição(ões): Cloreto de manganês) | `CONFLITO_PLANILHA_FONTE` | F1 e F2 associam a NCM ao item 28 (Cloreto de manganês); a regra (planilha) traz o item 66. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 28273998-200033-VI-31 | 817 | 28273998 | 200033 | Anexo VI item 31 (2827.39.98) | lista (1 descrição(ões): Cloreto de zinco) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 31 (Cloreto de zinco); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 28276012-200033-VI-61 | 818 | 28276012 | 200033 | Anexo VI item 61 (2827.60.12) | lista (1 descrição(ões): Iodeto de potássio) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 61 (Iodeto de potássio); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 28332100-200033-VI-75 | 819 | 28332100 | 200033 | Anexo VI item 75 (2833.21.00) | lista (1 descrição(ões): Sulfato de magnésio) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 75 (Sulfato de magnésio); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 28332970-200033-VI-76 | 820 | 28332970 | 200033 | Anexo VI item 76 (2833.29.70) | lista (1 descrição(ões): Sulfato de zinco) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 76 (Sulfato de zinco); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 28352200-200033-VI-51 | 821 | 28352200 | 200033 | Anexo VI item 51 (2835.22.00) | lista (1 descrição(ões): Fosfato de sódio monobásico) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 51 (Fosfato de sódio monobásico); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 28352400-200033-VI-49 | 822 | 28352400 | 200033 | Anexo VI item 49 (2835.24.00) + Anexo VI item 50 (2835.24.00) | lista (2 descrição(ões): Fosfato de potássio monobásico / Fosfato de potássio dibásico) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 49, 50; o item da regra (49) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 28352400-200033-VI-50 | 823 | 28352400 | 200033 | Anexo VI item 49 (2835.24.00) + Anexo VI item 50 (2835.24.00) | lista (2 descrição(ões): Fosfato de potássio monobásico / Fosfato de potássio dibásico) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 49, 50; o item da regra (50) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 28363000-200033-VI-21 | 826 | 28363000 | 200033 | Anexo VI item 21 (2836.30.00) | lista (1 descrição(ões): Bicarbonato de sódio) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 21 (Bicarbonato de sódio); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 28429000-200033-VI-72 | 829 | 28429000 | 200033 | Anexo VI item 72 (2842.90.00) | lista (1 descrição(ões): Selenito de sódio) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 72 (Selenito de sódio); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29054400-200033-VI-74 | 831 | 29054400 | 200033 | Anexo VI item 74 (2905.44.00) | lista (1 descrição(ões): Sorbitol) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 74 (Sorbitol); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29152100-200033-VI-7 | 833 | 29152100 | 200033 | Anexo VI item 7 (2915.21.00) | lista (1 descrição(ões): Ácido acético) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 7 (Ácido acético); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29152910-200033-VI-4 | 834 | 29152910 | 200033 | Anexo VI item 4 (2915.29.10) | lista (1 descrição(ões): Acetato de sódio) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 4 (Acetato de sódio); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29152990-200033-VI-3 | 835 | 29152990 | 200033 | Anexo VI item 3 (2915.29.90) + Anexo VI item 5 (2915.29.90) | lista (2 descrição(ões): Acetato de zinco / Acetato de potássio) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 3, 5; o item da regra (3) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29152990-200033-VI-5 | 836 | 29152990 | 200033 | Anexo VI item 3 (2915.29.90) + Anexo VI item 5 (2915.29.90) | lista (2 descrição(ões): Acetato de zinco / Acetato de potássio) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 3, 5; o item da regra (5) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29181400-200033-VI-10 | 837 | 29181400 | 200033 | Anexo VI item 10 (2918.14.00) | lista (1 descrição(ões): Ácido cítrico) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 10 (Ácido cítrico); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29181610-200033-VI-57 | 838 | 29181610 | 200033 | Anexo VI item 57 (2918.16.10) | lista (1 descrição(ões): Gliconato de cálcio) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 57 (Gliconato de cálcio); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29181990-200033-VI-13 | 839 | 29181990 | 200033 | Anexo VI item 13 (2918.19.90) | lista (1 descrição(ões): Ácido málico) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 13 (Ácido málico); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29199090-200033-VI-55 | 840 | 29199090 | 200033 | Anexo VI item 55 (2919.90.90) | lista (1 descrição(ões): Glicerofosfato de sódio) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 55 (Glicerofosfato de sódio); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29224110-200033-VI-66 | 842 | 29224110 | 200033 | Anexo VI item 66 (2922.41.10) | lista (1 descrição(ões): Lisina) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 66 (Lisina); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29224190-200033-VI-2 | 844 | 29224190 | 200033 | Anexo VI item 2 (2922.41.90) | lista (1 descrição(ões): Acetato de lisina) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2 (Acetato de lisina); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29224210-200033-VI-12 | 846 | 29224210 | 200033 | Anexo VI item 12 (2922.42.10) | lista (1 descrição(ões): Ácido glutâmico) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 12 (Ácido glutâmico); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29224910-200033-VI-56 | 852 | 29224910 | 200033 | Anexo VI item 56 (2922.49.10) | lista (1 descrição(ões): Glicina) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 56 (Glicina); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29224990-200033-VI-16 | 866 | 29224990 | 200033 | Anexo VI item 9 (2922.49.90) + Anexo VI item 16 (2922.49.90) + Anexo VI item 17 (2922.49.90) + Anexo VI item 20 (2922.49.90) + Anexo VI item 37 (2922.49.90) + Anexo VI item 62 (2922.49.90) + Anexo VI item 64 (2922.49.90) + Anexo VI item 65 (2922.49.90) + Anexo VI item 70 (2922.49.90) + Anexo VI item 77 (2922.49.90) | lista (10 descrição(ões): Asparagina / Alanina / Alanilglutamina / Ácido aspártico / Taurina / Prolina / Levovalina / Leucina / Isoleucina / Fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 9, 16, 17, 20, 37, 62, 64, 65, 70, 77; o item da regra (16) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29224990-200033-VI-17 | 867 | 29224990 | 200033 | Anexo VI item 9 (2922.49.90) + Anexo VI item 16 (2922.49.90) + Anexo VI item 17 (2922.49.90) + Anexo VI item 20 (2922.49.90) + Anexo VI item 37 (2922.49.90) + Anexo VI item 62 (2922.49.90) + Anexo VI item 64 (2922.49.90) + Anexo VI item 65 (2922.49.90) + Anexo VI item 70 (2922.49.90) + Anexo VI item 77 (2922.49.90) | lista (10 descrição(ões): Asparagina / Alanina / Alanilglutamina / Ácido aspártico / Taurina / Prolina / Levovalina / Leucina / Isoleucina / Fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 9, 16, 17, 20, 37, 62, 64, 65, 70, 77; o item da regra (17) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29224990-200033-VI-20 | 868 | 29224990 | 200033 | Anexo VI item 9 (2922.49.90) + Anexo VI item 16 (2922.49.90) + Anexo VI item 17 (2922.49.90) + Anexo VI item 20 (2922.49.90) + Anexo VI item 37 (2922.49.90) + Anexo VI item 62 (2922.49.90) + Anexo VI item 64 (2922.49.90) + Anexo VI item 65 (2922.49.90) + Anexo VI item 70 (2922.49.90) + Anexo VI item 77 (2922.49.90) | lista (10 descrição(ões): Asparagina / Alanina / Alanilglutamina / Ácido aspártico / Taurina / Prolina / Levovalina / Leucina / Isoleucina / Fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 9, 16, 17, 20, 37, 62, 64, 65, 70, 77; o item da regra (20) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29224990-200033-VI-37 | 869 | 29224990 | 200033 | Anexo VI item 9 (2922.49.90) + Anexo VI item 16 (2922.49.90) + Anexo VI item 17 (2922.49.90) + Anexo VI item 20 (2922.49.90) + Anexo VI item 37 (2922.49.90) + Anexo VI item 62 (2922.49.90) + Anexo VI item 64 (2922.49.90) + Anexo VI item 65 (2922.49.90) + Anexo VI item 70 (2922.49.90) + Anexo VI item 77 (2922.49.90) | lista (10 descrição(ões): Asparagina / Alanina / Alanilglutamina / Ácido aspártico / Taurina / Prolina / Levovalina / Leucina / Isoleucina / Fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 9, 16, 17, 20, 37, 62, 64, 65, 70, 77; o item da regra (37) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29224990-200033-VI-62 | 870 | 29224990 | 200033 | Anexo VI item 9 (2922.49.90) + Anexo VI item 16 (2922.49.90) + Anexo VI item 17 (2922.49.90) + Anexo VI item 20 (2922.49.90) + Anexo VI item 37 (2922.49.90) + Anexo VI item 62 (2922.49.90) + Anexo VI item 64 (2922.49.90) + Anexo VI item 65 (2922.49.90) + Anexo VI item 70 (2922.49.90) + Anexo VI item 77 (2922.49.90) | lista (10 descrição(ões): Asparagina / Alanina / Alanilglutamina / Ácido aspártico / Taurina / Prolina / Levovalina / Leucina / Isoleucina / Fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 9, 16, 17, 20, 37, 62, 64, 65, 70, 77; o item da regra (62) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29224990-200033-VI-64 | 871 | 29224990 | 200033 | Anexo VI item 9 (2922.49.90) + Anexo VI item 16 (2922.49.90) + Anexo VI item 17 (2922.49.90) + Anexo VI item 20 (2922.49.90) + Anexo VI item 37 (2922.49.90) + Anexo VI item 62 (2922.49.90) + Anexo VI item 64 (2922.49.90) + Anexo VI item 65 (2922.49.90) + Anexo VI item 70 (2922.49.90) + Anexo VI item 77 (2922.49.90) | lista (10 descrição(ões): Asparagina / Alanina / Alanilglutamina / Ácido aspártico / Taurina / Prolina / Levovalina / Leucina / Isoleucina / Fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 9, 16, 17, 20, 37, 62, 64, 65, 70, 77; o item da regra (64) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29224990-200033-VI-65 | 872 | 29224990 | 200033 | Anexo VI item 9 (2922.49.90) + Anexo VI item 16 (2922.49.90) + Anexo VI item 17 (2922.49.90) + Anexo VI item 20 (2922.49.90) + Anexo VI item 37 (2922.49.90) + Anexo VI item 62 (2922.49.90) + Anexo VI item 64 (2922.49.90) + Anexo VI item 65 (2922.49.90) + Anexo VI item 70 (2922.49.90) + Anexo VI item 77 (2922.49.90) | lista (10 descrição(ões): Asparagina / Alanina / Alanilglutamina / Ácido aspártico / Taurina / Prolina / Levovalina / Leucina / Isoleucina / Fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 9, 16, 17, 20, 37, 62, 64, 65, 70, 77; o item da regra (65) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29224990-200033-VI-70 | 873 | 29224990 | 200033 | Anexo VI item 9 (2922.49.90) + Anexo VI item 16 (2922.49.90) + Anexo VI item 17 (2922.49.90) + Anexo VI item 20 (2922.49.90) + Anexo VI item 37 (2922.49.90) + Anexo VI item 62 (2922.49.90) + Anexo VI item 64 (2922.49.90) + Anexo VI item 65 (2922.49.90) + Anexo VI item 70 (2922.49.90) + Anexo VI item 77 (2922.49.90) | lista (10 descrição(ões): Asparagina / Alanina / Alanilglutamina / Ácido aspártico / Taurina / Prolina / Levovalina / Leucina / Isoleucina / Fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 9, 16, 17, 20, 37, 62, 64, 65, 70, 77; o item da regra (70) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29224990-200033-VI-77 | 874 | 29224990 | 200033 | Anexo VI item 9 (2922.49.90) + Anexo VI item 16 (2922.49.90) + Anexo VI item 17 (2922.49.90) + Anexo VI item 20 (2922.49.90) + Anexo VI item 37 (2922.49.90) + Anexo VI item 62 (2922.49.90) + Anexo VI item 64 (2922.49.90) + Anexo VI item 65 (2922.49.90) + Anexo VI item 70 (2922.49.90) + Anexo VI item 77 (2922.49.90) | lista (10 descrição(ões): Asparagina / Alanina / Alanilglutamina / Ácido aspártico / Taurina / Prolina / Levovalina / Leucina / Isoleucina / Fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 9, 16, 17, 20, 37, 62, 64, 65, 70, 77; o item da regra (77) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29224990-200033-VI-9 | 875 | 29224990 | 200033 | Anexo VI item 9 (2922.49.90) + Anexo VI item 16 (2922.49.90) + Anexo VI item 17 (2922.49.90) + Anexo VI item 20 (2922.49.90) + Anexo VI item 37 (2922.49.90) + Anexo VI item 62 (2922.49.90) + Anexo VI item 64 (2922.49.90) + Anexo VI item 65 (2922.49.90) + Anexo VI item 70 (2922.49.90) + Anexo VI item 77 (2922.49.90) | lista (10 descrição(ões): Asparagina / Alanina / Alanilglutamina / Ácido aspártico / Taurina / Prolina / Levovalina / Leucina / Isoleucina / Fenilalanina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 9, 16, 17, 20, 37, 62, 64, 65, 70, 77; o item da regra (9) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29225039-200033-VI-6 | 876 | 29225039 | 200033 | Anexo VI item 6 (2922.50.39) + Anexo VI item 78 (2922.50.39) | lista (2 descrição(ões): Acetiltirosina / Tirosina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 6, 78; o item da regra (6) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29225039-200033-VI-78 | 877 | 29225039 | 200033 | Anexo VI item 6 (2922.50.39) + Anexo VI item 78 (2922.50.39) | lista (2 descrição(ões): Acetiltirosina / Tirosina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 6, 78; o item da regra (78) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29225099-200033-VI-73 | 878 | 29225099 | 200033 | Anexo VI item 73 (2922.50.99) + Anexo VI item 80 (2922.50.99) | lista (2 descrição(ões): Treonina / Serina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 73, 80; o item da regra (73) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29225099-200033-VI-80 | 879 | 29225099 | 200033 | Anexo VI item 73 (2922.50.99) + Anexo VI item 80 (2922.50.99) | lista (2 descrição(ões): Treonina / Serina) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 73, 80; o item da regra (80) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29232000-200033-VI-63 | 880 | 29232000 | 200033 | Anexo VI item 63 (2923.20.00) | lista (1 descrição(ões): Lecitina de ovo) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 63 (Lecitina de ovo); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29252919-200033-VI-19 | 881 | 29252919 | 200033 | Anexo VI item 19 (2925.29.19) | lista (1 descrição(ões): Arginina) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 19 (Arginina); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29304010-200033-VI-66 | 884 | 29304010 | 200033 | Anexo VI item 67 (2930.40.10) | lista (1 descrição(ões): Metionina) | `CONFLITO_PLANILHA_FONTE` | F1 e F2 associam a NCM ao item 67 (Metionina); a regra (planilha) traz o item 66. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29304090-200033-VI-81 | 887 | 29304090 | 200033 | Anexo VI item 67 (2930.40.90) | lista (1 descrição(ões): Metionina) | `CONFLITO_PLANILHA_FONTE` | F1 e F2 associam a NCM ao item 67 (Metionina); a regra (planilha) traz o item 81. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29309039-200033-VI-24 | 888 | 29309039 | 200033 | Anexo VI item 24 (2930.90.39) | lista (1 descrição(ões): Cistina) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 24 (Cistina); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29332992-200033-VI-59 | 889 | 29332992 | 200033 | Anexo VI item 59 (2933.29.92) | lista (1 descrição(ões): Histidina) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 59 (Histidina); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29362113-200033-VI-69 | 890 | 29362113 | 200033 | Anexo VI item 69 (2936.21.13) | lista (1 descrição(ões): Palmitato de retinol) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 69 (Palmitato de retinol); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29362210-200033-VI-33 | 891 | 29362210 | 200033 | Anexo VI item 33 (2936.22.10) | lista (1 descrição(ões): Cloridrato de tiamina) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 33 (Cloridrato de tiamina); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29362290-200033-VI-34 | 892 | 29362290 | 200033 | Anexo VI item 34 (2936.22.90) + Anexo VI item 52 (2936.22.90) | lista (2 descrição(ões): Fosfato de tiamina / Cocarboxilase) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 34, 52; o item da regra (34) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29362290-200033-VI-52 | 893 | 29362290 | 200033 | Anexo VI item 34 (2936.22.90) + Anexo VI item 52 (2936.22.90) | lista (2 descrição(ões): Fosfato de tiamina / Cocarboxilase) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 34, 52; o item da regra (52) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 29362310-200033-VI-71 | 894 | 29362310 | 200033 | Anexo VI item 71 (2936.23.10) | lista (1 descrição(ões): Riboflavina) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 71 (Riboflavina); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29362320-200033-VI-53 | 895 | 29362320 | 200033 | Anexo VI item 53 (2936.23.20) | lista (1 descrição(ões): Fosfato sódico de riboflavina) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 53 (Fosfato sódico de riboflavina); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29362520-200033-VI-32 | 896 | 29362520 | 200033 | Anexo VI item 32 (2936.25.20) | lista (1 descrição(ões): Cloridrato de piridoxina) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 32 (Cloridrato de piridoxina); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29362610-200033-VI-23 | 897 | 29362610 | 200033 | Anexo VI item 23 (2936.26.10) | lista (1 descrição(ões): Cianocobalamina) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 23 (Cianocobalamina); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29362710-200033-VI-8 | 898 | 29362710 | 200033 | Anexo VI item 8 (2936.27.10) | lista (1 descrição(ões): Ácido ascórbico) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 8 (Ácido ascórbico); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29362811-200033-VI-79 | 899 | 29362811 | 200033 | Anexo VI item 79 (2936.28.11) | lista (1 descrição(ões): Tocoferol) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 79 (Tocoferol); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29362812-200033-VI-1 | 900 | 29362812 | 200033 | Anexo VI item 1 (2936.28.12) | lista (1 descrição(ões): Acetato de dextroalfatocoferol) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 1 (Acetato de dextroalfatocoferol); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29362911-200033-VI-11 | 901 | 29362911 | 200033 | Anexo VI item 11 (2936.29.11) | lista (1 descrição(ões): Ácido fólico) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 11 (Ácido fólico); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29362921-200033-VI-35 | 902 | 29362921 | 200033 | Anexo VI item 35 (2936.29.21) | lista (1 descrição(ões): Colecalciferol) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 35 (Colecalciferol); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29362929-200033-VI-36 | 903 | 29362929 | 200033 | Anexo VI item 36 (2936.29.29) | lista (1 descrição(ões): Ergocalciferol) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 36 (Ergocalciferol); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29362931-200033-VI-22 | 904 | 29362931 | 200033 | Anexo VI item 22 (2936.29.31) | lista (1 descrição(ões): Biotina) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 22 (Biotina); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29362940-200033-VI-38 | 905 | 29362940 | 200033 | Anexo VI item 38 (2936.29.40) | lista (1 descrição(ões): Fitomenadiona) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 38 (Fitomenadiona); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 29362952-200033-VI-68 | 906 | 29362952 | 200033 | Anexo VI item 68 (2936.29.52) | lista (1 descrição(ões): Nicotinamida) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 68 (Nicotinamida); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 30021236-200033-VI-18 | 930 | 30021236 | 200033 | Anexo VI item 18 (3002.12.36) | lista (1 descrição(ões): Albumina humana) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 18 (Albumina humana); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 31042010-200033-VI-66 | 990 | 31042010 | 200033 | Anexo VI item 29 (3104.20.10) | lista (1 descrição(ões): Cloreto de potássio) | `CONFLITO_PLANILHA_FONTE` | F1 e F2 associam a NCM ao item 29 (Cloreto de potássio); a regra (planilha) traz o item 66. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 31042090-200033-VI-66 | 991 | 31042090 | 200033 | Anexo VI item 29 (3104.20.90) | lista (1 descrição(ões): Cloreto de potássio) | `CONFLITO_PLANILHA_FONTE` | F1 e F2 associam a NCM ao item 29 (Cloreto de potássio); a regra (planilha) traz o item 66. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 35051000-200033-VI-60 | 995 | 35051000 | 200033 | Anexo VI item 60 (3505.10.00) | lista (1 descrição(ões): Icodextrina) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 60 (Icodextrina); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 21069030-200043-XI-2.10 | 760 | 21069030 | 200043 | Anexo XI item 2.10 (2106.90.30) | lista (1 descrição(ões): Rações operacionais) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.10 (Rações operacionais); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 36020000-200043-XI-2.8 | 999 | 36020000 | 200043 | Anexo XI item 2.8 (3602.00.00) | lista (1 descrição(ões): Explosivos de emprego militar) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.8 (Explosivos de emprego militar); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 84714900-200043-XI-2.26 | 1061 | 84714900 | 200043 | Anexo XI item 2.26 (8471.49.00) | lista (1 descrição(ões): Firewalls para a segurança da informação/cibernética) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.26 (Firewalls para a segurança da informação/cibernética); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 84715090-200043-XI-2.25 | 1062 | 84715090 | 200043 | Anexo XI item 2.25 (8471.50.90) | lista (1 descrição(ões): Equipamentos para criptografia para a segurança da informação/cibernética) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.25 (Equipamentos para criptografia para a segurança da informação/cibernética); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 84719014-200043-XI-2.24 | 1066 | 84719014 | 200043 | Anexo XI item 2.24 (8471.90.14) | lista (1 descrição(ões): Dispositivos de Autenticação (tokens, leitores biométricos) que garantam a segurança da informação/cibernética) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.24 (Dispositivos de Autenticação (tokens, leitores biométricos) que garantam a segurança da informação/cibernética); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 85176234-200043-XI-2.27 | 1081 | 85176234 | 200043 | Anexo XI item 2.27 (8517.62.34) | lista (1 descrição(ões): Switches e roteadores seguros para a segurança da informação/cibernética) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.27 (Switches e roteadores seguros para a segurança da informação/cibernética); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 85176241-200043-XI-2.27 | 1082 | 85176241 | 200043 | Anexo XI item 2.27 (8517.62.4, por prefixo) | lista (1 descrição(ões): Switches e roteadores seguros para a segurança da informação/cibernética) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.27 (Switches e roteadores seguros para a segurança da informação/cibernética); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 85176249-200043-XI-2.27 | 1083 | 85176249 | 200043 | Anexo XI item 2.27 (8517.62.4, por prefixo) | lista (1 descrição(ões): Switches e roteadores seguros para a segurança da informação/cibernética) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.27 (Switches e roteadores seguros para a segurança da informação/cibernética); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 85176259-200043-XI-2.22 | 1084 | 85176259 | 200043 | Anexo XI item 2.22 (8517.62.59) + Anexo XI item 2.23 (8517.62.59) + Anexo XI item 2.26 (8517.62.59) | lista (3 descrição(ões): Dispositivos destinados a prover a segurança da informação do tipo Prevenção de Intrusão (IPS) / Dispositivos destinados a prover a segurança da informação do tipo de Detecção de Intrusão (IDS) / Firewalls para a segurança da informação/cibernética) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 2.22, 2.23, 2.26; o item da regra (2.22) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 85176259-200043-XI-2.23 | 1085 | 85176259 | 200043 | Anexo XI item 2.22 (8517.62.59) + Anexo XI item 2.23 (8517.62.59) + Anexo XI item 2.26 (8517.62.59) | lista (3 descrição(ões): Dispositivos destinados a prover a segurança da informação do tipo Prevenção de Intrusão (IPS) / Dispositivos destinados a prover a segurança da informação do tipo de Detecção de Intrusão (IDS) / Firewalls para a segurança da informação/cibernética) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 2.22, 2.23, 2.26; o item da regra (2.23) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 85176259-200043-XI-2.26 | 1086 | 85176259 | 200043 | Anexo XI item 2.22 (8517.62.59) + Anexo XI item 2.23 (8517.62.59) + Anexo XI item 2.26 (8517.62.59) | lista (3 descrição(ões): Dispositivos destinados a prover a segurança da informação do tipo Prevenção de Intrusão (IPS) / Dispositivos destinados a prover a segurança da informação do tipo de Detecção de Intrusão (IDS) / Firewalls para a segurança da informação/cibernética) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 2.22, 2.23, 2.26; o item da regra (2.26) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 85176272-200043-XI-2.28 | 1087 | 85176272 | 200043 | Anexo XI item 2.28 (8517.62.7, por prefixo) | lista (1 descrição(ões): Dispositivos de comunicação criptografada para a segurança da informação/cibernética) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.28 (Dispositivos de comunicação criptografada para a segurança da informação/cibernética); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 85176273-200043-XI-2.28 | 1088 | 85176273 | 200043 | Anexo XI item 2.28 (8517.62.7, por prefixo) | lista (1 descrição(ões): Dispositivos de comunicação criptografada para a segurança da informação/cibernética) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.28 (Dispositivos de comunicação criptografada para a segurança da informação/cibernética); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 85176277-200043-XI-2.28 | 1089 | 85176277 | 200043 | Anexo XI item 2.28 (8517.62.7, por prefixo) | lista (1 descrição(ões): Dispositivos de comunicação criptografada para a segurança da informação/cibernética) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.28 (Dispositivos de comunicação criptografada para a segurança da informação/cibernética); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 85176278-200043-XI-2.28 | 1090 | 85176278 | 200043 | Anexo XI item 2.28 (8517.62.7, por prefixo) | lista (1 descrição(ões): Dispositivos de comunicação criptografada para a segurança da informação/cibernética) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.28 (Dispositivos de comunicação criptografada para a segurança da informação/cibernética); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 85176279-200043-XI-2.28 | 1091 | 85176279 | 200043 | Anexo XI item 2.28 (8517.62.7, por prefixo) | lista (1 descrição(ões): Dispositivos de comunicação criptografada para a segurança da informação/cibernética) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.28 (Dispositivos de comunicação criptografada para a segurança da informação/cibernética); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 85235110-200043-XI-2.29 | 1092 | 85235110 | 200043 | Anexo XI item 2.29 (8523.51, por prefixo) + Anexo XI item 2.30 (8523.51, por prefixo) | lista (2 descrição(ões): Servidores de armazenamento seguro para a segurança da informação/cibernética / Unidades de armazenamento criptografadas para a segurança da informação/cibernética) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 2.29, 2.30; o item da regra (2.29) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 85235110-200043-XI-2.30 | 1093 | 85235110 | 200043 | Anexo XI item 2.29 (8523.51, por prefixo) + Anexo XI item 2.30 (8523.51, por prefixo) | lista (2 descrição(ões): Servidores de armazenamento seguro para a segurança da informação/cibernética / Unidades de armazenamento criptografadas para a segurança da informação/cibernética) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 2.29, 2.30; o item da regra (2.30) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 85235190-200043-XI-2.29 | 1094 | 85235190 | 200043 | Anexo XI item 2.29 (8523.51, por prefixo) + Anexo XI item 2.30 (8523.51, por prefixo) | lista (2 descrição(ões): Servidores de armazenamento seguro para a segurança da informação/cibernética / Unidades de armazenamento criptografadas para a segurança da informação/cibernética) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 2.29, 2.30; o item da regra (2.29) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 85235190-200043-XI-2.30 | 1095 | 85235190 | 200043 | Anexo XI item 2.29 (8523.51, por prefixo) + Anexo XI item 2.30 (8523.51, por prefixo) | lista (2 descrição(ões): Servidores de armazenamento seguro para a segurança da informação/cibernética / Unidades de armazenamento criptografadas para a segurança da informação/cibernética) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 2.29, 2.30; o item da regra (2.30) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 85235210-200043-XI-2.24 | 1096 | 85235210 | 200043 | Anexo XI item 2.24 (8523.52, por prefixo) | lista (1 descrição(ões): Dispositivos de Autenticação (tokens, leitores biométricos) que garantam a segurança da informação/cibernética) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.24 (Dispositivos de Autenticação (tokens, leitores biométricos) que garantam a segurança da informação/cibernética); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 85235290-200043-XI-2.24 | 1097 | 85235290 | 200043 | Anexo XI item 2.24 (8523.52, por prefixo) | lista (1 descrição(ões): Dispositivos de Autenticação (tokens, leitores biométricos) que garantam a segurança da informação/cibernética) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.24 (Dispositivos de Autenticação (tokens, leitores biométricos) que garantam a segurança da informação/cibernética); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 85258929-200043-XI-2.9 | 1098 | 85258929 | 200043 | Anexo XI item 2.9 (8525.89.29) | lista (1 descrição(ões): Optrônicos) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.9 (Optrônicos); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 85261000-200043-XI-2.6 | 1099 | 85261000 | 200043 | Anexo XI item 2.6 (8526.10.00) | lista (1 descrição(ões): Radares para uso militar) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.6 (Radares para uso militar); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 87100000-200043-XI-2.2 | 1112 | 87100000 | 200043 | Anexo XI item 2.2 (8710.00.00) | lista (1 descrição(ões): Carro blindado e carro de combate, terrestre ou anfíbio, sobre lagartas ou rodas, com ou sem armamento e também suas partes e peças) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.2 (Carro blindado e carro de combate, terrestre ou anfíbio, sobre lagartas ou rodas, com ou sem armamento e também suas partes e peças); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 88026000-200043-XI-2.15 | 1116 | 88026000 | 200043 | Anexo XI item 2.14 (8802, por prefixo) + Anexo XI item 2.15 (8802.60.00) | lista (2 descrição(ões): Aeronaves, inclusive Veículo Aéreo Não Tripulado (VANT) para uso pela segurança nacional e também suas partes e peças / Veículos espaciais para uso pela segurança nacional) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 2.14, 2.15; o item da regra (2.15) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 88040000-200043-XI-2.16 | 1117 | 88040000 | 200043 | Anexo XI item 2.16 (8804.00.00) | lista (1 descrição(ões): Paraquedas para uso pela segurança nacional) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.16 (Paraquedas para uso pela segurança nacional); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 88051000-200043-XI-2.17 | 1118 | 88051000 | 200043 | Anexo XI item 2.17 (8805.10.00) + Anexo XI item 2.19 (8805, por prefixo) | lista (2 descrição(ões): Aparelhos e dispositivos para lançamento e aterrissagem de veículos aéreos e espaciais para uso pela segurança nacional / Equipamentos de apoio no solo para uso pela segurança nacional) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 2.17, 2.19; o item da regra (2.17) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 88052100-200043-XI-2.18 | 1119 | 88052100 | 200043 | Anexo XI item 2.18 (8805.21.00) + Anexo XI item 2.19 (8805, por prefixo) | lista (2 descrição(ões): Simuladores de voo e similares para uso pela segurança nacional / Equipamentos de apoio no solo para uso pela segurança nacional) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 2.18, 2.19; o item da regra (2.18) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 89012000-200043-XI-2.21 | 1120 | 89012000 | 200043 | Anexo XI item 2.21 (8901.20.00) | lista (1 descrição(ões): Embarcações construídas no País suas peças, partes e componentes utilizados no reparo, conserto e reconstrução de embarcações) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.21 (Embarcações construídas no País suas peças, partes e componentes utilizados no reparo, conserto e reconstrução de embarcações); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 89061000-200043-XI-2.24 | 1121 | 89061000 | 200043 | Anexo XI item 2.21 (8906.10.00) | lista (1 descrição(ões): Embarcações construídas no País suas peças, partes e componentes utilizados no reparo, conserto e reconstrução de embarcações) | `CONFLITO_PLANILHA_FONTE` | F1 e F2 associam a NCM ao item 2.21 (Embarcações construídas no País suas peças, partes e componentes utilizados no reparo, conserto e reconstrução de embarcações); a regra (planilha) traz o item 2.24. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 90142010-200043-XI-2.20 | 1122 | 90142010 | 200043 | Anexo XI item 2.20 (9014.20, por prefixo) | lista (1 descrição(ões): Equipamentos de auxílio à comunicação, navegação e controle de tráfego aéreo para uso pela segurança nacional) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.20 (Equipamentos de auxílio à comunicação, navegação e controle de tráfego aéreo para uso pela segurança nacional); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 90142020-200043-XI-2.20 | 1123 | 90142020 | 200043 | Anexo XI item 2.20 (9014.20, por prefixo) | lista (1 descrição(ões): Equipamentos de auxílio à comunicação, navegação e controle de tráfego aéreo para uso pela segurança nacional) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.20 (Equipamentos de auxílio à comunicação, navegação e controle de tráfego aéreo para uso pela segurança nacional); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 90142030-200043-XI-2.20 | 1124 | 90142030 | 200043 | Anexo XI item 2.20 (9014.20, por prefixo) | lista (1 descrição(ões): Equipamentos de auxílio à comunicação, navegação e controle de tráfego aéreo para uso pela segurança nacional) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.20 (Equipamentos de auxílio à comunicação, navegação e controle de tráfego aéreo para uso pela segurança nacional); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 90142090-200043-XI-2.20 | 1125 | 90142090 | 200043 | Anexo XI item 2.20 (9014.20, por prefixo) | lista (1 descrição(ões): Equipamentos de auxílio à comunicação, navegação e controle de tráfego aéreo para uso pela segurança nacional) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.20 (Equipamentos de auxílio à comunicação, navegação e controle de tráfego aéreo para uso pela segurança nacional); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 90318099-200043-XI-2.24 | 1280 | 90318099 | 200043 | Anexo XI item 2.4 (9031.80.99) | lista (1 descrição(ões): Simuladores de veículos militares) | `CONFLITO_PLANILHA_FONTE` | F1 e F2 associam a NCM ao item 2.4 (Simuladores de veículos militares); a regra (planilha) traz o item 2.24. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 93012000-200043-XI-2.7 | 1286 | 93012000 | 200043 | Anexo XI item 2.7 (9301.20.00) | lista (1 descrição(ões): Foguetes para uso militar) | `NORMA_CONFIRMADA` | F1 e F2 associam a NCM ao item 2.7 (Foguetes para uso militar); o item da regra coincide. | mapeamento: sim; veredito: só após validação humana do produto |
| 93062110-200043-XI-2.12 | 1287 | 93062110 | 200043 | Anexo XI item 2.8 (9306, por prefixo) + Anexo XI item 2.11 (9306, por prefixo) + Anexo XI item 2.12 (9306.2, por prefixo) + Anexo XI item 2.13 (9306, por prefixo) | lista (4 descrição(ões): Explosivos de emprego militar / Minas marítimas / Cartuchos de munição naval e de artilharia e seus componentes (projétil, estojo, estopilha, espoleta, traçador, pólvora e alto-explosivo), de calibre igual ou superior a 40 mm de diâmetro interno de tubo da arma / Bombas, torpedos, minas, mísseis, foguetes e seus componentes) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 2.8, 2.11, 2.12, 2.13; o item da regra (2.12) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 93062120-200043-XI-2.12 | 1288 | 93062120 | 200043 | Anexo XI item 2.8 (9306, por prefixo) + Anexo XI item 2.11 (9306, por prefixo) + Anexo XI item 2.12 (9306.2, por prefixo) + Anexo XI item 2.13 (9306, por prefixo) | lista (4 descrição(ões): Explosivos de emprego militar / Minas marítimas / Cartuchos de munição naval e de artilharia e seus componentes (projétil, estojo, estopilha, espoleta, traçador, pólvora e alto-explosivo), de calibre igual ou superior a 40 mm de diâmetro interno de tubo da arma / Bombas, torpedos, minas, mísseis, foguetes e seus componentes) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 2.8, 2.11, 2.12, 2.13; o item da regra (2.12) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 93062130-200043-XI-2.12 | 1289 | 93062130 | 200043 | Anexo XI item 2.8 (9306, por prefixo) + Anexo XI item 2.11 (9306, por prefixo) + Anexo XI item 2.12 (9306.2, por prefixo) + Anexo XI item 2.13 (9306, por prefixo) | lista (4 descrição(ões): Explosivos de emprego militar / Minas marítimas / Cartuchos de munição naval e de artilharia e seus componentes (projétil, estojo, estopilha, espoleta, traçador, pólvora e alto-explosivo), de calibre igual ou superior a 40 mm de diâmetro interno de tubo da arma / Bombas, torpedos, minas, mísseis, foguetes e seus componentes) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 2.8, 2.11, 2.12, 2.13; o item da regra (2.12) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 93062190-200043-XI-2.12 | 1290 | 93062190 | 200043 | Anexo XI item 2.8 (9306, por prefixo) + Anexo XI item 2.11 (9306, por prefixo) + Anexo XI item 2.12 (9306.2, por prefixo) + Anexo XI item 2.13 (9306, por prefixo) | lista (4 descrição(ões): Explosivos de emprego militar / Minas marítimas / Cartuchos de munição naval e de artilharia e seus componentes (projétil, estojo, estopilha, espoleta, traçador, pólvora e alto-explosivo), de calibre igual ou superior a 40 mm de diâmetro interno de tubo da arma / Bombas, torpedos, minas, mísseis, foguetes e seus componentes) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 2.8, 2.11, 2.12, 2.13; o item da regra (2.12) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
| 93062900-200043-XI-2.12 | 1291 | 93062900 | 200043 | Anexo XI item 2.8 (9306, por prefixo) + Anexo XI item 2.11 (9306, por prefixo) + Anexo XI item 2.12 (9306.2, por prefixo) + Anexo XI item 2.13 (9306, por prefixo) | lista (4 descrição(ões): Explosivos de emprego militar / Minas marítimas / Cartuchos de munição naval e de artilharia e seus componentes (projétil, estojo, estopilha, espoleta, traçador, pólvora e alto-explosivo), de calibre igual ou superior a 40 mm de diâmetro interno de tubo da arma / Bombas, torpedos, minas, mísseis, foguetes e seus componentes) | `NORMA_POSSIVEL_MULTIPLOS_ITENS` | A NCM é coberta pelos itens 2.8, 2.11, 2.12, 2.13; o item da regra (2.12) está entre eles; o item depende da composição do produto. | mapeamento: parcial (código e anexo; item não); veredito: não |
