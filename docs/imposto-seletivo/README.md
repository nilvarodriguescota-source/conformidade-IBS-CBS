# Imposto Seletivo (IS) — base normativa, motor e análise dos produtos

O IS é tratado como tributo separado do IBS/CBS. Ele tem base própria (`data/imposto-seletivo.json`), motor próprio (`src/imposto-seletivo.ts`) e escolhas próprias, gravadas em `analise-atual/respostas-is.json`. Nada do IS altera CST, cClassTrib, vereditos ou créditos de IBS/CBS. Um teste compara os vereditos de IBS/CBS com e sem o grupo IS no XML, e eles saem idênticos.

## Fontes

| Fonte | Situação | Uso |
|---|---|---|
| LC 214/2025, texto compilado com a LC 227/2026 (`data/fontes/lc214/lcp214.htm`, SHA-256 `5702cb10…`) | conferida | Incidência (art. 409 e Anexo XVII), incidência única (art. 410), fato gerador (art. 412), não incidência (art. 413), base de cálculo (art. 414), alíquotas em lei ordinária (art. 422), contribuinte (art. 424) e importação (art. 434) |
| MP 1.399/2026, de 04/11/2026 (`data/fontes/imposto-seletivo/mp1399-2026.txt`, SHA-256 `8dd58c21…`) | **conferida** | Texto fornecido pelo cliente, copiado da página oficial. Usos: alíquotas de 2027 (art. 3º e Anexos IV e V), efeitos a partir de 02/02/2027 (art. 19), regras transitórias até 31/12/2027 (art. 6º), não incidência e alíquota zero de veículos, aeronaves e embarcações (arts. 4º e 5º), importação (art. 8º), concursos de prognósticos (art. 7º) e lei das alíquotas de 2028 (art. 15) |
| Planilha do cliente `imposto_seletivo.xlsx` (`data/fontes/imposto-seletivo/`, SHA-256 `1e9c2d9e…`) | referência | As 5 linhas conferem com o Anexo IV da MP. A planilha não traz produtos, NCMs nem descrições |

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

- **Bebidas alcoólicas e fumígenos:** a lei exige a parcela específica (LC 214, art. 422, § 1º). Até 31/12/2027 ela é zero (MP 1.399/2026, art. 6º, II), exceto para cigarros e cigarrilhas (R$ 3,50 por vintena, que depende da quantidade em vintenas).
- **Importação:** a base ad valorem é o valor aduaneiro mais o Imposto de Importação (art. 434). Esse caso ainda não aparece nos XMLs analisados.

### Alíquotas de 2027 (MP 1.399/2026, conferidas)

Vigência: de 02/02/2027 (art. 19) a 31/12/2027. A alíquota final é a alíquota inicial × o fator de conversão (art. 3º).

| Produto (Anexo IV) | NCM | Inicial | Fator | Final | Específica |
|---|---|---|---|---|---|
| Bebidas açucaradas | 2202.10.00 (inclusive as sem açúcar) | 2,6% | 1,00 | **2,6%** | — |
| Cervejas de malte | 22.03 | 3,9% | 1,07 | **4,2%** | zero até 31/12/2027 (art. 6º, II) |
| Vinhos e fermentados (regra geral) | 22.04 e 22.06 | 6,5% | 1,23 | **8%** | zero até 31/12/2027 |
| Vinhos da madeira, do porto e de xerez | 2204.21.00, 2204.22.11, 2204.22.19, 2204.29.10 | 13% | 1,23 | **16%** | zero até 31/12/2027 |
| Fermentados com teor alcoólico acima de 14% | 2206.00.90 | 13% | 1,23 | **16%** | zero até 31/12/2027 |
| Vermutes e demais da 22.05 | 22.05 | 9,75% | 1,23 | **12%** | zero até 31/12/2027 |
| Bebidas refrescantes com teor alcoólico abaixo de 8% | 2208.90.00 | 13% | 1,23 | **16%** | zero até 31/12/2027 |
| Rum e aguardentes de cana (exceto obtidos do melaço) | 2208.40.00 | 16,25% | 1,23 | **20%** | zero até 31/12/2027 |
| Demais bebidas da 22.08 | 22.08 | 19,5% | 1,23 | **24%** | zero até 31/12/2027 |
| Cigarros (2402.20.00, exceto Ex 01) e cigarrilhas (Ex 01 do 2402.10.00) | 2402.20.00, 2402.10.00 | 66,7% | 1,00 | **66,7%** | R$ 3,50 por vintena |
| Demais produtos fumígenos | 24.01 a 24.04 | 30% | 1,25 | **37,5%** | zero até 31/12/2027 |

| Produto (Anexo V) | NCM | Inicial | Fator | Final |
|---|---|---|---|---|
| Veículos | 87.03 | 6,3% + ajustes (Anexo II) | 1,21 | depende do veículo |
| Veículos | 8704.21, 8704.31, 8704.41.00, 8704.51.00, 8704.60.00, 8704.90.00 | 3,9% + ajustes (Anexo III) | 1,21 | depende do veículo |
| Aeronaves | 88.02, exceto 8802.60.00 | 6,5% | 1,04 | **6,8%** |
| Barcos a motor | 8903.3 | 10% | 1,20 | **12%** |
| Demais embarcações de recreio ou esporte, a motor | 89.03 | 6,5% | 1,20 | **7,8%** |
| Bens minerais extraídos | 26.01, 2709.00.10, 2711.11.00, 2711.21.00 | — | — | **zero** até 31/12/2027 (art. 6º, III, a, 3) |

Regras que dependem de dado que o XML não traz. Nesses casos o produto fica em validação e a escolha é do usuário:

- **Alíquota com condição:** nos códigos com alternativa (por exemplo, 2204.21.00: 8%, ou 16% se for vinho da madeira, do porto ou de xerez), a regra geral é mostrada junto com a alternativa.
- **Pequenos produtores** (Anexo VI): redução de 40%, 20% ou 10% da alíquota ad valorem das bebidas alcoólicas, conforme o volume de álcool.
- **Fumígenos:** a base é o valor de referência. Para produto com preço tabelado, é 15% do preço de venda a varejo; sem preço tabelado, é o valor líquido na primeira operação entre partes não relacionadas (art. 6º, I).
- **Veículos:** a alíquota é calculada com os ajustes de propulsão, eficiência, potência, desempenho e reciclabilidade. Caminhões e veículos de uso das Forças Armadas não têm IS (art. 5º); veículos de PcD/TEA/táxi e versões sustentáveis têm alíquota zero (art. 4º).
- **Importação:** a alíquota é multiplicada pelo fator de ajuste (1,45 para bebidas; 1,17 para veículos, aeronaves e embarcações) quando a base é o valor aduaneiro mais o Imposto de Importação (art. 8º).

A partir de 01/01/2028 as alíquotas dependem da lei prevista no art. 15 da MP. Até ela ser cadastrada, essas operações ficam em "necessita de validação fiscal".

### Como atualizar a base

1. Leia o dispositivo e o anexo no texto oficial.
2. Em `data/imposto-seletivo.json`, altere a alíquota ou acrescente outra (com códigos, condição, vigência, dispositivo e `situacao: "conferida"`). Guarde o texto da nova norma em `data/fontes/imposto-seletivo/`, com o SHA-256.
3. Aumente `versao` e acrescente uma entrada em `historico`.
4. Rode `npm test` e processe a análise de novo.

## Na tela

- **Pendências → IMPOSTO SELETIVO:** lista separada da de IBS/CBS, com o mesmo funcionamento.
  - Cada produto do Anexo XVII aguarda validação, com a sugestão do sistema e a pergunta "Este produto tem incidência de Imposto Seletivo nas vendas desta análise?".
  - As opções são:
    - **incide:** na revenda, o IS é recolhido na etapa anterior e a alíquota de registro é 0%; na venda do próprio fabricante, vale a alíquota da MP;
    - **não incide:** vale a alíquota de IBS/CBS do enquadramento do produto;
    - **necessita de validação fiscal:** o produto continua pendente.
  - A escolha é marcada na hora e gravada em seguida. **Quando a gravação é confirmada, o produto sai da lista** e a contagem é atualizada. Se a gravação falhar, o produto continua na lista com o erro e a marcação volta à escolha anterior.
  - Os validados continuam registrados. O botão **"Mostrar validados"** os exibe com a escolha marcada, para revisar ou alterar.
  - Produtos fora do Anexo XVII (energéticos, isotônicos, sucos, águas) não viram pendência.
- **Pendências de IBS/CBS:** seguem a mesma regra. O produto validado sai da lista assim que a gravação é confirmada e pode ser revisto em "Mostrar validados". A página de Resultados não mudou.
- **Relatório Final:** os quatro relatórios de IBS/CBS ficam no layout anterior. A modalidade **IMPOSTO SELETIVO** tem 7 colunas (código, descrição, NCM, Imposto Seletivo, alíquota de registro IS, valor do IS e instrução com a norma) e traz **só os produtos validados**. Exporta em CSV, Excel e PDF.
- **Coluna "Alíquota de registro IS":** o conteúdo depende do enquadramento de cada produto.

| Situação do produto | Imposto Seletivo | Alíquota de registro IS | Valor do IS |
|---|---|---|---|
| Sujeito ao IS, vendido em revenda (CFOP de mercadoria de terceiros) | Incide (recolhido na etapa anterior) | **0%** | 0,00 |
| Sujeito ao IS, vendido pelo próprio fabricante (CFOP de produção própria) | Incide | alíquota da MP (ex.: 2,6%) | calculado a partir de 02/02/2027 |
| Sem IS | Não incide | **alíquota de IBS/CBS do enquadramento** (ex.: "IBS/CBS 1% (CBS 0,9% + IBS 0,1%) — tributação integral") | 0,00 |

Na revenda, o IS incide uma única vez, no fornecimento pelo fabricante ou na importação (LC 214/2025, arts. 410 e 424). O valor pago na etapa anterior integra o custo de aquisição e não há nova cobrança na saída. A instrução também informa a alíquota do IS na etapa do fabricante.

- **Valor do IS:** calculado item a item e arredondado ao centavo, como o grupo IS de cada item da nota (o regulamento ainda vai dispor sobre o arredondamento, MP art. 12, § 8º). Só é calculado para operações a partir de 02/02/2027.

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

O arquivo traz também a alíquota da MP de cada produto, válida a partir de 02/02/2027.

A padaria vende as bebidas do Anexo XVII como revenda e, por isso, não é contribuinte do IS nessas vendas. O IS é cobrado do fabricante ou do importador.

### Observações para revisão do NCM (análise complementar)

Estes casos não mudam a decisão do sistema, que é sempre pelo NCM informado:

- **Cerveja com NCM de bebida açucarada:** "CERVEJA EISENBAHN" está em 2202.10.00. Cerveja de malte é da posição 22.03, com categoria e alíquota diferentes.
- **Mesmo tipo de produto em NCMs diferentes:**
  - Red Bull está em 2202.10.00 (dentro do Anexo XVII), enquanto Monster está em 2202.99.00 (fora dele);
  - parte dos Del Valle está em 2202.10.00 e parte em 2202.99.00. Os refrescos Kapo também estão em 2202.10.00 e merecem conferência.
- **Bebidas sem açúcar em 2202.10.00:** Coca-Cola Zero, Guaraná Zero e Pepsi Zero. A MP não exclui bebidas sem açúcar: o Anexo IV vale para todo o código 2202.10.00 (2,6%).
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
