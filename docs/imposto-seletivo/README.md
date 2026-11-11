# Imposto Seletivo (IS) — base normativa, motor e análise dos produtos

O IS é tratado como tributo separado do IBS/CBS. Ele tem base própria (`data/imposto-seletivo.json`), motor próprio (`src/imposto-seletivo.ts`) e escolhas próprias, gravadas em `analise-atual/respostas-is.json`. Nada do IS altera CST, cClassTrib, vereditos ou créditos de IBS/CBS. Um teste compara os vereditos de IBS/CBS com e sem o grupo IS no XML, e eles saem idênticos.

## Fontes

| Fonte | Situação | Uso |
|---|---|---|
| LC 214/2025, texto compilado com a LC 227/2026 (`data/fontes/lc214/lcp214.htm`, SHA-256 `5702cb10…`) | conferida | Incidência (art. 409 e Anexo XVII), incidência única (art. 410), fato gerador (art. 412), não incidência (art. 413), base de cálculo (art. 414), alíquotas em lei ordinária (art. 422), contribuinte (art. 424), importação (art. 434) e início em 2027 (art. 477) |
| MP 1.399/2026 | **pendente de conferência** | Alíquotas de 2027 e início dos efeitos em 02/02/2027. O planalto.gov.br respondeu "Acesso Negado" ao acesso automatizado e os portais da Câmara e do Congresso não estavam acessíveis, por isso o texto não foi lido |
| Planilha do cliente `imposto_seletivo.xlsx` (`data/fontes/imposto-seletivo/`, SHA-256 `1e9c2d9e…`) | referência | 5 linhas: categoria, alíquota inicial, fator de conversão e alíquota final. Não traz produtos, NCMs nem descrições |

## Regras do motor, por item vendido

1. **NCM fora do Anexo XVII:** não incidência (art. 409, § 1º). Ficam fora, por exemplo:
   - energéticos e isotônicos em 2202.99.00;
   - sucos (20.09);
   - águas (22.01);
   - álcool etílico (22.07).
2. **Operação anterior a 02/02/2027:** não incidência. Nenhuma alíquota de 2027 é aplicada antes da vigência.
3. **Operação posterior a 31/12/2027:** necessita de validação fiscal, porque as regras de 2028 não estão cadastradas.
4. **Revenda** (CFOP 5102, 5405, 6102 e semelhantes): não incidência. O IS incide uma única vez, no primeiro fornecimento pelo fabricante ou na importação (arts. 410, 412 e 424).
5. **Venda de produção própria** (CFOP 5101, 5401 e semelhantes), em que o estabelecimento é o fabricante:
   - IBS/CBS reduzido (CST 200): validação, pela não incidência do art. 413, III;
   - fumígenos: validação, porque a base é o valor de referência (art. 414, III, c), que não está no XML;
   - veículos, aeronaves, embarcações e bens minerais: validação, por causa das exceções do Anexo XVII;
   - bebidas alcoólicas: validação, para confirmar a embalagem primária (art. 409, § 2º);
   - sem alíquota cadastrada, ou com alíquota ainda não conferida: validação, **sem alíquota e sem valor**;
   - com alíquota conferida: **incidência**, com o valor calculado.
6. **CFOP que não identifica o fabricante:** necessita de validação fiscal.

Nenhum produto recebe alíquota zero por falta de regra. Sem enquadramento conclusivo, a situação é "Necessita de validação fiscal".

### Cálculo (`calcularIS`)

O cálculo depende da modalidade da alíquota; não existe fórmula única.

| Modalidade | Cálculo |
|---|---|
| ad valorem | valor de venda (vProd − vDesc) × alíquota |
| específica | quantidade × valor por unidade |
| ad valorem + específica | soma das duas parcelas |

- **Bebidas alcoólicas e fumígenos da posição 24.02:** exigem a parcela específica (art. 422, § 1º). Enquanto ela não for cadastrada, o valor fica pendente.
- **Importação:** a base ad valorem é o valor aduaneiro mais o Imposto de Importação (art. 434). Esse caso ainda não aparece nos XMLs analisados.

### Alíquotas de 2027 cadastradas

Todas foram cadastradas a partir da planilha, estão com situação `pendente_conferencia` e valem de 02/02/2027 a 31/12/2027.

| Categoria | Alíquota inicial | Fator | Alíquota final |
|---|---|---|---|
| Bebidas açucaradas (2202.10.00) | conversão a partir do IPI | — | 2,6% |
| Cervejas de malte (22.03) | 3,9% | 1,07 | 4,2% + parcela específica |
| Vinhos e fermentados (22.04 e 22.06, regra geral) | 6,5% | 1,23 | 8% + parcela específica |
| Vermutes (22.05) | 9,75% | 1,23 | 12% + parcela específica |
| Destilados (22.08, demais) | 19,5% | 1,23 | 24% + parcela específica |

Não estão na planilha e precisam vir da MP:
- as parcelas específicas (teor alcoólico × volume);
- as exceções à "regra geral" e aos "demais";
- as alíquotas de fumígenos.

### Como conferir uma alíquota com a MP

1. Leia o dispositivo e o anexo correspondentes no texto oficial da MP 1.399/2026.
2. Em `data/imposto-seletivo.json`, na alíquota correspondente:
   - corrija o valor se precisar;
   - preencha `dispositivo` com o artigo e o anexo;
   - inclua `especifica` quando houver parcela específica;
   - mude `situacao` para `conferida`.
3. Em `fontes.MP1399`, preencha o arquivo e o SHA-256 da cópia salva e mude a situação para `conferida`.
4. Aumente `versao` e acrescente uma entrada em `historico`.
5. Rode `npm test` e processe a análise de novo. A aba Imposto Seletivo avisa quando a base mudou depois do último processamento.

## Na tela

- **Pendências → IMPOSTO SELETIVO:** lista separada da de IBS/CBS, com o mesmo funcionamento.
  - Cada produto do Anexo XVII aguarda validação, com a sugestão do sistema e a pergunta "Este produto tem incidência de Imposto Seletivo nas vendas desta análise?".
  - As opções são: incide, não incide, ou necessita de validação fiscal ("não sabe", que deixa o produto pendente).
  - A escolha é marcada na hora e gravada em seguida. Se a gravação falhar, a marcação volta à escolha anterior e o card mostra o erro.
  - Ao recarregar a página, os produtos respondidos aparecem em "Validados nesta análise", com a escolha marcada e alterável.
  - Produtos fora do Anexo XVII, como energéticos, isotônicos, sucos e águas, não viram pendência, porque não têm IS.
- **Relatório Final:** os quatro relatórios de IBS/CBS ficam no layout anterior. A modalidade **IMPOSTO SELETIVO** usa o mesmo formato, com 7 colunas: código, descrição, NCM, Imposto Seletivo, alíquota de registro IS, valor do IS e instrução com a norma. Ela traz **só os produtos validados** e exporta em CSV, Excel e PDF.
- **Formato das alíquotas:** igual ao do relatório de IBS/CBS, por exemplo "2,6%" ou "0% (não incide)". Quando a alíquota ainda depende de conferência com a MP, o valor sai como "Não calculado" e a instrução explica o motivo.

## Análise dos produtos da padaria

A planilha anexada não tem a lista de produtos. Por isso a análise usou as vendas reais: 2.783 XMLs (2.777 NFC-e) da JURERE PADARIA E CAFÉ LTDA, CNAE 5611-2/03, de agosto de 2026, com 433 produtos e 60 NCMs. Produto a produto: `produtos-padaria-imposto-seletivo.csv`.

| Grupo | Produtos | NCMs | Situação nas notas analisadas | A partir de 02/02/2027 (orientação) |
|---|---|---|---|---|
| Bebidas açucaradas (Anexo XVII) | 24 | 2202.10.00 | Não incidência: antes da vigência | Não incidência: revenda (CFOP 5102/5405) |
| Cervejas (Anexo XVII) | 6 | 2203.00.00 | Não incidência: antes da vigência | Não incidência: revenda |
| Vinhos (Anexo XVII) | 3 | 2204.10.10, 2204.21.00 | Não incidência: antes da vigência | Não incidência: revenda |
| Destilados (Anexo XVII) | 4 | 2208.90.00 | Não incidência: antes da vigência | Não incidência: revenda |
| Produtos fumígenos | 0 | — | Nenhum vendido | — |
| Energéticos, isotônicos, chás, néctares e outras bebidas | 19 | 2202.99.00 | Não incidência: fora do Anexo XVII | igual |
| Sucos e água de coco | 13 | 20.09 | Não incidência: fora do Anexo XVII | igual |
| Águas | 6 | 2201.10.00 | Não incidência: fora do Anexo XVII | igual |
| Demais produtos | 358 | 47 NCMs | Não incidência: fora do Anexo XVII | igual |

A padaria vende as bebidas do Anexo XVII como revenda e, por isso, não é contribuinte do IS nessas vendas. O IS é cobrado do fabricante ou do importador.

### Observações para revisão do NCM (análise complementar)

Estes casos não mudam a decisão do sistema, que é sempre pelo NCM informado:

- **Cerveja com NCM de bebida açucarada:** "CERVEJA EISENBAHN" está em 2202.10.00. Cerveja de malte é da posição 22.03, com categoria e alíquota diferentes.
- **Mesmo tipo de produto em NCMs diferentes:**
  - Red Bull está em 2202.10.00 (dentro do Anexo XVII), enquanto Monster está em 2202.99.00 (fora dele);
  - parte dos Del Valle está em 2202.10.00 e parte em 2202.99.00. Os refrescos Kapo também estão em 2202.10.00 e merecem conferência.
- **Bebidas sem açúcar em 2202.10.00:** Coca-Cola Zero, Guaraná Zero e Pepsi Zero. O código inclui bebidas com edulcorantes; é preciso conferir na MP se há exclusão para bebidas sem açúcar.
- **Preparados no local:** chope servido do barril e caipirinhas ou caipiroskas (2208.90.00) saem com CFOP de revenda. Isso só muda se o preparo configurar fabricação; nesse caso entram as exigências de embalagem primária.
- **Outros NCMs a conferir:**
  - "VINHO GERAL" está em 2204.10.10, subposição de espumantes;
  - "ADC PÃES CARDÁPIO" tem NCM de bebida;
  - "SUCO NATURAL MELANCIA" está em 2202.99.00, enquanto os demais sucos naturais estão em 20.09.

## Testes

- **Motor** (`test/imposto-seletivo.test.ts`, 12 testes):
  - Anexo XVII e exclusões: 22.07, 8802.60.00, energéticos, isotônicos, sucos e águas fora;
  - vigência antes, durante e depois de 2027;
  - revenda × fabricante;
  - alíquota pendente (sem valor e sem zero) × conferida (2,6% calculado);
  - exigências de alcoólicos e fumígenos e art. 413, III;
  - grupo IS informado indevidamente no XML;
  - escolha do usuário;
  - IBS/CBS idênticos com ou sem o grupo IS.
- **`scripts/teste_imposto_seletivo.mjs`** (Chromium):
  - XMLs reais da padaria: pendências do IS, escolhas, troca, cliques repetidos, recarga da página ("Validados nesta análise"), falha de comunicação, relatório vazio antes da validação e só com os validados depois, layout anterior dos demais relatórios e exportações;
  - as mesmas notas como fabricante em 2027: validação fiscal, sem valor;
  - 10.000 XMLs.
