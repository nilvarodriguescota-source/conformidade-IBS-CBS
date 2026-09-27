# Etapa 11 — Auditoria dos NCMs importados (diagnóstico antes das alterações)

Data: 27/09/2026. Dados: `analise-atual` (2.783 XMLs da JURERE PADARIA E CAFÉ, NFC-e), com as 50 respostas
SIM/NÃO já registradas. Base normativa: 2.435 regras (planilha V4.1 + D5). Empresa: `barOuRestaurante: false`.
Mapa de todos os produtos (433 cProd, 60 NCMs): `mapa-ncms-antes.csv`.

## 1. Situação atual (ANTES)

| Indicador | Valor |
| --- | --- |
| XMLs processados | 2.783 |
| Documentos | 2.771 |
| Itens avaliados | 7.204 (389 não obrigatórios) |
| CORRETO / INCORRETO_ECONOMIA / INCORRETO_RISCO / REQUER_VALIDACAO | 2.939 / 1.621 / 738 / 1.517 |
| Pendências (produtos na fila SIM/NÃO) | 230 |
| Base de cálculo total | R$ 144.396,78 |
| Valor calculado como pago / valor correto | R$ 998,51 / R$ 458,50 |
| Economia potencial | R$ 307,19 |
| Exposição | R$ 0,00 |

## 2. Achados

### 2.1 INCORRETO_RISCO (738 itens, 25 produtos)

- **Causa única nos dados:** o grupo IBS/CBS está **ausente** no item (confirmado no XML; o parser está correto).
  Em 306 notas o mesmo documento tem itens com o grupo e itens sem ele: o emissor omite o grupo para alguns
  produtos (cadastro sem classificação IBS/CBS). Obrigatório desde 03/08/2026 (Ato Conjunto RFB/CGIBS nº 4/2026).
- **ESPERADO usa a regra geral indevidamente:** em 730 dos 738 itens o NCM tem regras de benefício candidatas
  (ex.: 2106.90.90 → 200003 Anexo I item 4 e 200033 Anexo VI), mas o ESPERADO mostra 000/000001.
  O correto é "depende da validação", com as candidatas.
- **Sem pergunta SIM/NÃO:** 17 produtos só aparecem como risco e nunca entram na fila de Pendências
  (entre eles BUFFET ALMOÇO, BUFFET CAFÉ DA MANHÃ, SOPAS E CALDOS): o enquadramento nunca pode ser validado.
- **Sem valor de impacto:** a exposição sai R$ 0,00. Em 2026 o recolhimento só é dispensado se cumpridas as
  obrigações acessórias (LC 214/2025, art. 348, § 1º); sem o grupo, o tributo devido fica exposto.

### 2.2 NCM 2106.90.90 — outras preparações alimentícias (53 produtos)

| Enquadramento possível | Fonte | Condição |
| --- | --- | --- |
| 200003 — alíquota zero | LC 214/2025, art. 125, Anexo I, item 4 | Só **fórmulas infantis** |
| 200033 — redução de 60% | LC 214/2025, arts. 133 e 134, Anexo VI (itens 39 a 41 e outros) | Só **fórmulas nutricionais/dietas para erros inatos do metabolismo** |
| 200047 — redução de 40% | LC 214/2025, arts. 273 a 275 | Alimentação preparada por bar, restaurante ou **lanchonete** (regime ainda desligado) |
| 000/000001 — regra geral | LC 214/2025 | Na ausência das hipóteses acima |

Nenhum produto 2106.90.90 desta análise tem descrição de fórmula infantil ou dieta especial (buffet, sopas,
omeletes, hambúrgueres, bolos, chás, suco detox, chiclete). O enquadramento depende da validação, mas a resposta
esperada é NÃO para 200003/200033. **Cinco respostas SIM já gravadas** associam produtos comuns à "Fórmula para
dieta isenta de fenilalanina" (Anexo VI, item 39): BUFFET CAFE DA MANHA SEG A SEX (36690003), SUCO DETOX (501),
OMELETE JURERE (30830003), HAMBURGUER JURERE BACON (31430003), OMELETE PRESUNTO E QUEIJO (30820003). Elas geram
"economia" e o Relatório COM VALIDAÇÃO recomenda 200033 — recomendação provavelmente indevida. A resposta é
humana e não será alterada pelo sistema; hoje, porém, não há como revê-la pela tela (o produto sai de Pendências).

### 2.3 Bebidas

| Produto | NCM | Regra IBS/CBS | Tratamento específico | Conclusão |
| --- | --- | --- | --- | --- |
| Refrigerantes (Coca-Cola, Sprite, Fanta…) | 2202.10.00 | Regra geral (000/000001); nenhuma redução na LC 214 | **Imposto Seletivo** (tributo distinto): art. 409, § 1º, V; Anexo XVII lista só 2202.10.00; vigência 1º/1/2027 (EC 132/2023); incide uma única vez no **primeiro fornecimento** (arts. 410 e 412, I); alíquotas dependem de lei ordinária | Para IBS/CBS a regra geral **é** a regra aplicável; a revenda no varejo não recolhe IS. Classificação atual permanece |
| Cervejas, vinhos, destilados | 2203, 2204, 2205, 2206, 2208 | Regra geral | IS (art. 409, § 1º, IV; Anexo XVII), mesma vigência e fato gerador; fora do regime de bares (art. 273, § 2º, III) | Classificação atual permanece |
| Sucos naturais/água de coco | 2009 | 200034 (Anexo VII, item 10) candidata | Só "sem adição de açúcar ou edulcorantes e sem conservantes" | Depende da validação (já é assim) |
| Isotônicos, bebidas lácteas, energéticos | 2202.99.00 | 200033/200034 candidatas | Dependem da composição | Depende da validação (já é assim) |
| Água mineral | 2201.10.00 | Regra geral | — | Correto |

Indícios de NCM divergente da descrição (TIPI): "CERVEJA EISENBAHN 355ML" com NCM 2202.10.00 (cerveja é 2203.00.00);
"ADC PÃES CARDÁPIO" com NCM 2202.99.00. Não alteram o IBS/CBS deste ano, mas o NCM precisa ser conferido.

### 2.4 Economia potencial

- Só entra a economia **confirmada** (itens validados com SIM que usam tributação integral). Itens pendentes com
  candidata de benefício ficam de fora sem aviso: nenhuma estimativa "sujeita à validação" é mostrada.
- Os riscos não entram na economia (correto: risco é tributo a menor, não a mais), mas também não têm exposição calculada.

### 2.5 XMLs processados × documentos (2.783 × 2.771)

Causa exata (código e dados): `processarXMLs` conta todo arquivo `.xml` lido; `selecionarVendas` (parser) conta
documento de venda. Nos dados: 2.777 notas (`nfeProc`) + **6 XMLs de evento de cancelamento** (`procEventoNFe`,
tpEvento 110111, arquivos `…-Cancelamento.xml`). Os eventos não são documentos: só marcam as 6 notas como canceladas,
que são descartadas. 2.777 − 6 = 2.771. Não há XML repetido, nota de entrada, devolução, inutilização nem erro de
leitura. A tela mostra os dois números sem explicar a diferença.

## 3. O que será alterado (dentro da estrutura atual)

| Arquivo | Alteração | Motivo |
| --- | --- | --- |
| `src/motor.ts` | ESPERADO do risco considera as candidatas (nulo = depende da validação), exposição mínima certa, economia sujeita à validação nos pendentes, observações legais no motivo | 2.1, 2.3, 2.4 |
| `src/parametros.ts` | Tabela de tratamentos específicos com fonte e vigência (Imposto Seletivo; indícios de NCM de bebidas pela TIPI) | 2.3 |
| `src/indicadores.ts` | Total da economia sujeita à validação; riscos pendentes entram na fila SIM/NÃO | 2.1, 2.4 |
| `src/tipos.ts` | Campo opcional `economiaSujeitaValidacao` no veredito | 2.4 |
| `src/processador.ts`, `src/analise-atual.ts`, `src/servidor.ts` | Composição dos XMLs (`composicao.json`) e redução no `/api/regras` | 2.5 |
| `src/pagina.ts` | Card da aba Análise explica a diferença; Economia potencial mostra a parte sujeita à validação; "Auditoria e fontes" traz o diagnóstico do risco e a resposta registrada (com os mesmos botões SIM/NÃO); Relatório Final ganha a opção INCORRETO — RISCO | 2.1 a 2.5 |

Não mudam: parser, regras da base, bloqueios, alertas, explicador, perguntas SIM/NÃO, relatórios COM e SEM
VALIDAÇÃO (a lógica fica igual; SEM VALIDAÇÃO passa a listar também os produtos em risco que dependem de validação,
porque agora eles entram na fila), navegação, layout e cards existentes. Cópias antes da alteração em `backups/etapa11/`.

## 4. Resultado (DEPOIS), com os mesmos XMLs e as mesmas 50 respostas

| Indicador | ANTES | DEPOIS | Por quê |
| --- | --- | --- | --- |
| XMLs processados / documentos | 2.783 / 2.771 | 2.783 / 2.771 | Igual; agora a aba Análise explica: 2.777 notas + 6 eventos de cancelamento; 6 notas canceladas descartadas |
| Itens / base de cálculo | 7.204 / R$ 144.396,78 | igual | — |
| CORRETO / ECONOMIA / RISCO / VALIDAR / NÃO OBRIG. | 2.939 / 1.621 / 738 / 1.517 / 389 | igual | Nenhuma pendência virou incorreto, nenhum risco sumiu |
| Valor calculado como pago / valor correto | R$ 998,51 / R$ 458,50 | igual | — |
| Economia potencial (confirmada) | R$ 307,19 | R$ 307,19 | — |
| Economia sujeita à validação | não existia | **R$ 167,13** | Itens pendentes que usam tributação integral × menor redução entre as candidatas; mostrada à parte |
| Exposição (mínimo certo) | R$ 0,00 | R$ 0,80 | Riscos passam a ter o IBS/CBS devido sem destaque; quando depende da validação, só o mínimo (a maior redução possível); nos buffets 2106.90.90 o mínimo é zero porque a candidata de fórmula infantil é de alíquota zero |
| Produtos com pergunta SIM/NÃO | 230 | **247** | +17 produtos que só apareciam como risco |

Produtos cujo enquadramento esperado mudou (todos: de "000/000001 (regra geral)" para "REQUER VALIDAÇÃO"):

| Produto | NCM | Regra anterior | Regra nova | Fundamento | Impacto |
| --- | --- | --- | --- | --- | --- |
| BUFFET ALMOÇO DE SEG A SEX; BUFFET ALMOÇO; BUFFET CAFE DA MANHA; BUFFET DE SOPAS E CALDOS LIVRE; SOPAS E CALDOS PARA LEVAR; PAIN AU CHOCOLAT; BOLO FUBA C/ GOIABADA; BOLO DE LIMÃO C/ MIRTILO; CINNAMON COM GANACHE; Coca cola expresso 220ml | 2106.90.90 | 000/000001 | Depende da validação: 200003 (Anexo I, item 4) ou 200033 (Anexo VI, itens 39 a 46); sem SIM, regra geral | LC 214/2025, arts. 125, 133 e 134; Anexos I e VI | Entram em Pendências; exposição mínima R$ 0,00 |
| COOKIE DE NUTELLA; DELÍCIA DE PARIS; JALOUISE BANANA | 1905.90.90 | 000/000001 | Depende da validação (candidatas da base) | Anexos I/VII | Idem |
| EMPANADA DE FRANGO | 1902.20.00 | 000/000001 | Depende da validação (Anexo VII, item 9) | Art. 135 | Exposição mínima R$ 0,07 |
| SUCO DE LARANJA VITASUPRA | 2009.71.00 | 000/000001 | Depende da validação (Anexo VII, item 10: suco sem açúcar/conservantes) | Art. 135 | R$ 0,16 |
| BIG ICE CAPPUCCINO 500ML | 2101.12.00 | 000/000001 | Depende da validação (Anexo I, item 8) | Art. 125 | R$ 0,00 |
| BOLD WHEY MOUSSE DE MORANGO | 2106.90.30 | 000/000001 | Depende da validação | Anexo VI | R$ 0,06 |

Observação legal acrescentada ao motivo (37 produtos): refrigerantes 2202.10.00 e bebidas alcoólicas — Imposto
Seletivo a partir de 2027, só no primeiro fornecimento; IBS/CBS pela regra geral (confirmado como correto).
Indício de NCM: "CERVEJA EISENBAHN 355ML" (2202.10.00 → descrição de cerveja, posição 22.03).

Mapa completo depois: `mapa-ncms-depois.csv`.

## 5. O que continua com a usuária

- Rever as 5 respostas SIM do 2106.90.90 para "Fórmula para dieta isenta de fenilalanina" (tela Resultados →
  "Auditoria e fontes" → "Resposta registrada" → NÃO). Testado numa cópia: o item volta a "precisa validar".
- Responder as 247 pendências (os buffets e sopas devem ter NÃO para fórmulas infantis/nutricionais).
- Conferir o NCM da cerveja Eisenbahn e do "ADC PÃES CARDÁPIO".
- Regime de lanchonete (arts. 273 a 275): continua desligado até a revisão da natureza dos produtos (Etapa 10).

## 6. Estrutura preservada (conferido no navegador e nos testes)

Perguntas SIM/NÃO, Auditoria e fontes, Detalhes, Resultados, Pendências, Dashboard, navegação, Relatório Final
(COM VALIDAÇÃO e SEM VALIDAÇÃO com a mesma lógica; nova opção INCORRETO — RISCO), exportações CSV/Excel/PDF, motor,
parser, base normativa e configurações. 135 testes (10 novos em `test/etapa11.test.ts`), versão web sem erros.
