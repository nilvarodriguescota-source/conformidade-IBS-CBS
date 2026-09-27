# Etapa 10 — Auditoria da planilha V4.1 frente ao sistema e às fontes oficiais

Data: 27/09/2026. Planilha analisada: `Planilha--de--conformidade--por--xml-----V4.1--2_1.xlsm`,
SHA-256 `ccddd8b2df94a6b2c51b3e3e153edcc77960f8e5d18f8f04e772e2046ccaab5d`.
**É o mesmo arquivo** (mesmo SHA-256 e tamanho) registrado em `data/fontes/manifesto.json` como origem da
base normativa atual.

Arquivos desta etapa:

| Arquivo | Conteúdo |
| --- | --- |
| `mapa-planilha-sistema.csv` | Uma linha por linha da aba "Base de dados" (1.477): regra do sistema, local, status na auditoria oficial, bloqueio, divergências e o que falta |
| `proposta-d5.json` | Regras oficiais que entrariam se a decisão D5 for "incluir" (não estão em uso) |
| `scripts/proposta_d5.mjs` | Gera a proposta a partir dos snapshots da LC 214/2025 e do SVRS |

## 1. O que a planilha contém

A planilha foi lida inteira: 10 abas, fórmulas, consultas do Power Query (código M extraído do
`customXml/item1.xml`) e macros VBA (`xl/vbaProject.bin`).

| Parte | Conteúdo | Tipo de regra |
| --- | --- | --- |
| Base de dados (oculta) | 1.477 linhas: NCM, descrição TIPI, descrição legal, CST, cClassTrib, tratamento, anexo, item, fundamento, observação | Regras de enquadramento |
| Base_CBS (oculta) | Mesmas 1.477 linhas reduzidas + "Percentual Economia CBS" | Regra de cálculo |
| Legenda e Manual | 9 premissas + 6 passos | Premissas e fluxo |
| Power Query `Saidas_tratadas` | Junção por NCM, CST/cClassTrib esperados, resultado, economia | Regras de cálculo e comparação |
| Power Query `Validacao_Beneficios` | Itens INCORRETOS agrupados por produto + NCM, com a pergunta "É possível utilizar o benefício?" | Pergunta SIM/NÃO |
| Conformidade (oculta) | 13 indicadores e a faixa "Situação da Empresa" | Indicadores |
| Recomendações | Produtos com SIM: "Alterar o cadastro do produto para o CST … e cClassTrib …" | Relatório final |
| VBA `ImportarXMLs` | Lê `xProd`, `NCM`, `vProd`, `CST`, `cClassTrib`; só saída (`tpNF = 1`) e autorizada (`cStat` 100/150) | Seleção de documentos |
| Saídas, XML, Resultado, DASHBOARD | Dados do cliente e gráficos | Sem regra própria |

### Levantamento da Base de dados (1.477 linhas)

| Item | Valores encontrados |
| --- | --- |
| CST | 1 (200) |
| cClassTrib | 12: 200003 (451), 200038 (315, uma com colunas deslocadas), 200030 (174), 200034 (169), 200014 (119), 200033 (85), 200004 (64), 200043 (42), 200031 (40), 200035 (7), 200007 (7), 200039 (4) |
| Anexos | 12: I, IV, V, VI, VII, VIII, IX, X, XI, XII, XIII, XV |
| Tratamentos | 2: redução de 60% (836) e alíquota zero (641; 9 escritas "Alíquota Zero") |
| NCMs distintos | 1.193 (46 com mais de um cClassTrib possível) |
| Fundamentos | 33 textos; 178 linhas trazem capítulo ou código NCM em vez de artigo (ex.: "Capítulo 31", "23.06") |
| Vedações/exceções | Nenhuma coluna própria; só o texto da descrição legal ("exceto …") |
| Condições | 1.310 linhas "Validar a descrição legal…"; 42 linhas (Anexo XI) "Aplicação condicionada ao fornecimento à administração pública" |
| Duplicatas | 109 linhas repetem outra (mesmo NCM, código e descrição) |

### Regras de cálculo da planilha (Power Query e fórmulas)

1. NCM do item com 8 dígitos (zeros à esquerda repostos) cruzado com a base por NCM (LEFT JOIN).
2. NCM fora da base: esperado CST 000 e cClassTrib 000001.
3. CST ou cClassTrib vazio no XML: "NÃO INFORMADO".
4. Comparação sem zeros à esquerda: iguais = CORRETO; diferentes = INCORRETO.
5. Economia = valor do produto × 5,4% (redução de 60%) ou × 9% (alíquota zero), só para INCORRETO.
6. Validação: INCORRETOS agrupados por produto + NCM, com a descrição legal; resposta SIM/NÃO.
7. Conformidade conta como correto o INCORRETO respondido NÃO; economia só dos respondidos SIM.
8. Situação da empresa: ≥ 98% EXCELENTE, ≥ 95% MUITO BOA, ≥ 90% BOA, ≥ 80% ATENÇÃO, senão CRÍTICA.
9. Recomendações: produtos respondidos SIM, com o CST e o cClassTrib a utilizar.

## 2. Regras que já existem no sistema

**Todas as 1.477 linhas da Base de dados estão no sistema** (`data/base-normativa.json`), em 1.368
regras distintas (as 109 duplicatas foram unificadas na extração, `scripts/extrair_base.py`).
O mapa linha a linha está em `mapa-planilha-sistema.csv`.

| Status | Linhas | Significado |
| --- | --- | --- |
| Implementada e confirmada | 856 | A lei (F1) e o Portal (F2) concordam com código, redução, anexo e item |
| Implementada com ressalva | 364 | Divergência documentada na auditoria oficial (item diferente, NCM em mais de um item, NCM só numa fonte); o benefício depende da validação SIM/NÃO |
| Bloqueada | 257 | A lei e/ou o Portal vedam o benefício para o NCM; o sistema não oferece a regra como candidata |

As regras de cálculo também existem, com correção dos defeitos da planilha:

| Regra da planilha | Onde está no sistema | Situação |
| --- | --- | --- |
| 1. Cruzamento por NCM | `src/motor.ts` (`regrasVigentes`) | Existe; uma linha por item, sem duplicar faturamento (D01) |
| 2. NCM fora da base = 000/000001 | `src/motor.ts` (`TRIBUTACAO_INTEGRAL`) | Existe; o motivo diz que não há regra (D06) |
| 3. "NÃO INFORMADO" | `src/motor.ts` + `src/parametros.ts` | Existe, com vigência: `NAO_OBRIGATORIO` antes de 03/08/2026 (NF-e/NFC-e, regime normal), `INCORRETO_RISCO` depois (D07) |
| 4. Comparação sem zeros | `src/motor.ts` (`mesmoCodigo`) | Igual |
| 5. Economia 5,4% / 9% | `src/motor.ts` + `src/parametros.ts` | Substituída por alíquota vigente × base de cálculo × redução (D04) |
| 6. Validação SIM/NÃO | Tela Pendências, `/api/validar`, `src/analise-atual.ts` | Existe, por NCM + produto + regra |
| 7. Conformidade após validação | `src/indicadores.ts` | Existe; estados separam economia de risco (D08) |
| 8. Situação da empresa | `src/pagina.ts` (Dashboard) | Mesmas faixas |
| 9. Recomendações | Relatório Final "COM VALIDAÇÃO" | Existe, com o percentual de redução |
| VBA: só saída e autorizada | `src/parser.ts` (`selecionarVendas`) | Existe; também descarta cancelada, devolução e duplicada (D14–D16) |
| Premissa: descrição legal decide | Pendências + alertas | Existe (pergunta SIM/NÃO por regra candidata) |
| Premissa: Anexo XI depende do adquirente | `src/explicador.ts` (condição 200043, D2) | Existe como condição não verificável pelo XML |
| Premissa: serviços/NBS fora | Base só com NCM | Igual |

## 3. Regras ausentes

**Da planilha: nenhuma.** O que falta vem da legislação e do Portal, não da planilha.

| Ausência | Quantidade | Fonte | Situação no sistema |
| --- | --- | --- | --- |
| NCMs que a lei e o Portal listam para um código da planilha, sem regra na base | 907 pares NCM × código (809 NCMs): 200038 (681), 200034 (148), 200043 (48), 200014 (23), 200004 (5), 200003 (1), 200033 (1) | F1 + F2 | Mostradas como alerta `LACUNA_FONTE_SEM_REGRA`; inclusão pendente na **decisão D5** |
| Códigos oficiais de bens fora da planilha | 200013 (absorventes, NCM 9619.00.00, alíquota zero, art. 147) | F2 + F1 | Não cadastrado |
| Códigos que dependem do adquirente (administração pública) | 200005 (Anexo IV), 200008 (Anexo V), 200011 (Anexo VI), 200010 (medicamentos) | F2 | Não cadastrados. Não devem virar candidatos automáticos: sem dado do adquirente no XML, todo item com esses NCMs viraria pergunta |
| Medicamentos | 200009, 200032, 200053 | F2; LC 227/2026 trocou a lista do Anexo XIV por finalidade | Sem lista de NCM no Portal; depende de registro na Anvisa e finalidade. Não há como incluir sem inventar |
| Demais códigos (produtor rural, cooperativa, ZFM/ALC, automóveis PcD/táxi) | 200002, 200015, 200020, 200022–200024, 200036, 200054 | F2 | Dependem de condição do adquirente ou do emitente que o XML não comprova |

Impacto medido da D5 nos XMLs desta análise (2.783 XMLs, 7.204 itens): **1 item muda**
("ADC ARROZ", NCM 1006.10.91, de `INCORRETO_RISCO` para `REQUER_VALIDACAO`). Nos XMLs de `xml_teste`: nenhum.

## 4. Divergências

| # | Divergência | Planilha | Fonte oficial | Tratamento no sistema |
| --- | --- | --- | --- | --- |
| 1 | NCMs vedados tratados como beneficiados | 257 linhas (149 regras), 186 delas na cesta básica (200003), a maioria peixes das subposições 0302.1/0302.3 | SVRS marca VEDADO; LC 214/2025 exclui no próprio item (ex.: Anexo I, item 20) | **Bloqueadas** (`src/bloqueios.ts`) |
| 2 | Fundamento do Anexo XI | "Art. 140" (42 linhas) | Art. 140 trata de comunicação institucional; o Anexo XI é do **art. 142, I** (F1 e F2 `#art142`) | Alerta `FUNDAMENTO_DIVERGENTE`; a base mantém o texto da planilha (divergência apresentada, não resolvida em silêncio) |
| 3 | Fundamento com capítulo/NCM | 178 linhas ("Capítulo 31", "23.06"…) | Artigo do código (ex.: Anexo IX = art. 138) | Corrigido na extração (D13) |
| 4 | Item da regra diferente do item da lei | 364 linhas com ressalva | F1 | Documentado na auditoria; depende da validação (**decisão D3** pendente) |
| 5 | Economia presumida | 5,4% e 9% sobre o valor do produto | 2026: CBS 0,9% e IBS 0,1% (fase de teste, art. 348) | Substituída (D04) |
| 6 | Percentual de redução | 60% e 100% | Portal: iguais para os 12 códigos | Sem divergência |
| 7 | Anexo do código | 12 anexos | Portal (`NroAnexo`): iguais | Sem divergência |

**Achado sobre o emitente desta análise:** a JURERE PADARIA E CAFÉ tem CNAE 5611-2/03 (lanchonetes)
e vende pratos preparados (buffet, omeletes, hambúrgueres). O art. 273 da LC 214/2025 inclui
expressamente as lanchonetes no regime específico de bares e restaurantes (art. 275: redução de 40%,
cClassTrib 200047), só para o que é preparado no estabelecimento e para bebidas não alcoólicas preparadas lá
(§ 2º exclui revenda sem preparo e bebidas alcoólicas). O motor já tem esse regime (`BARES_RESTAURANTES`),
mas o `empresa.json` está com `barOuRestaurante: false`. Ligar exige informar a natureza de cada produto
(`naturezaPorProduto`); sem isso, os itens ficam `INDETERMINADO`. É uma decisão do usuário.

## 5. Fontes

| Fonte | Natureza | Uso |
| --- | --- | --- |
| LC 214/2025, texto do Planalto com as alterações da LC 227/2026 (`data/fontes/lc214/lcp214.htm`, gravado em 23/09/2026) | Legal, primária | Arts. 125, 131–148, 273–275; Anexos I a XV |
| Portal da Conformidade Fácil / SVRS, Classificação Tributária (`data/fontes/svrs/svrs.html`, 24/09/2026) | Oficial operacional | 54 códigos do CST 200: redução, anexo, vigência, NF-e/NFC-e e lista de NCMs PERMITIDO/VEDADO com condição e exceção |
| [Ato Conjunto RFB/CGIBS nº 4/2026](https://www.cgibs.gov.br/upload/arquivos/202607/31091735-20260730-16h30-ato-conjunto-rfb-cgibs-na-c2-ba-4-260731-090909.pdf) | Oficial | Obrigatoriedade em NF-e/NFC-e: 03/08/2026; Simples: 01/01/2027 (confere com `src/parametros.ts`) |
| Notícias e escritórios (ex.: [CGM](https://cgmlaw.com.br/reforma-tributaria-publicada-a-lei-complementar-no-227-2026/), [Fecomércio RS](https://www.fecomercio-rs.org.br/noticiadetalhe/2026/01/26/reforma-tributaria-alteracao-da-lei-complementar-n-2142025/17fbfa8d-d88a-4b18-9662-7f03517ca912)) | Complementar | Só para localizar a mudança dos medicamentos pela LC 227/2026 |

O acesso direto ao Planalto e ao Portal estava bloqueado na rede desta execução; as cópias oficiais já
registradas no projeto (com SHA-256 no manifesto) foram usadas.

## 6. Arquivos que precisariam mudar

Só se as decisões forem tomadas:

| Decisão | Arquivos | Motivo |
| --- | --- | --- |
| D5 = incluir | `data/base-normativa.json` (+1.066 regras de `proposta-d5.json`, com backup) | É onde as regras vivem; cada regra nova traz a evidência da lei e do Portal |
| | `scripts/gerar_base_v2.mjs` (`SHA_ENTRADA`), `data/base-normativa.v2.json`, `data/auditoria-oficial.json` | A v2 e a auditoria são travadas pelo SHA da base e precisam ser regeneradas pelos próprios scripts |
| | `src/explicador.ts` (`inclusaoComoRegra: pendente("D5")`) | Passa a registrar a decisão tomada |
| | Testes com contagens fixas (`auditoria-oficial`, `evidencias-v2`, `tipos-v2`, `explicador`) e `scripts/verificar_base_v2.mjs` | Registram "nenhuma regra criada" e os totais antigos |
| Regime de lanchonete | `empresa.json` (`barOuRestaurante`, `naturezaPorProduto`) | Configuração da empresa; nenhum código muda |

Feito nesta etapa, sem efeito no resultado: `scripts/auditoria_oficial.mjs` passou a exportar três
funções de leitura da lei (a saída continua idêntica, conferida com `--verificar`; cópia anterior em
`backups/etapa10/`); `scripts/proposta_d5.mjs` e os arquivos desta pasta são novos.

## 7. O que não deve mudar

`src/motor.ts` (estados, validação, bloqueios), `src/parser.ts`, `src/indicadores.ts`,
`src/bloqueios.ts`, `src/alertas*.ts`, `src/explicador.ts` (exceto a marcação da D5),
`src/servidor.ts` e `src/pagina.ts` (telas, perguntas SIM/NÃO, Pendências, Relatório Final, Dashboard),
`src/analise-atual.ts` (respostas por análise) e `src/parametros.ts` (vigência conferida).

## 8. Plano

1. **D5 = incluir** (se aprovada): aplicar `proposta-d5.json` na base com backup, regenerar v2 e
   auditoria pelos scripts existentes, atualizar os totais dos testes e registrar a decisão no explicador.
   As regras novas entram como candidatas comuns: o item vai para "precisa validar" e a pergunta SIM/NÃO,
   o resultado chega ao Relatório Final pelo fluxo atual. Nada é confirmado sem resposta humana.
2. **Regime de lanchonete** (se confirmado): ligar `barOuRestaurante` e cadastrar a natureza dos produtos.
3. **Códigos fora da planilha**: 200013 pode entrar como a D5 (lista oficial sem condição); os demais
   dependem de dado que o XML não traz e ficam como pendência.
4. **D3** (política para as 364 regras com ressalva) e **fundamento do Anexo XI** continuam decisões do usuário.
