# Conformidade IBS/CBS por XML

Substitui a planilha "Conformidade por XML V4.1". Confere o CST e o cClassTrib
de IBS/CBS informados nos XMLs de saída, aponta o que precisa de validação
humana, separa economia de risco e guarda a trilha de cada resultado.

Escopo: só IBS e CBS. ICMS, ST, DIFAL, PIS/Cofins, IPI, CEST e CSOSN ficam fora.

## Publicar no Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/nilvarodriguescota-source/conformidade-IBS-CBS)

O `netlify.toml` já traz tudo: o Netlify roda `npm run build` e publica a pasta
`public/`. Depois de ligado ao repositório, cada push publica sozinho.

A raiz do site é a página comercial (landing, planos, login, cadastro, checkout e área
do cliente) e o sistema fica em `/sistema.html`, sem nenhuma mudança. Arquitetura,
modo demonstração e pontos de integração (login, pagamento, assinatura): `site/README.md`.

Na versão do Netlify o sistema roda inteiro no navegador (Web Worker), com o mesmo
código do servidor: não há servidor nem banco de dados. A análise (XMLs,
respostas e resultados) fica salva no navegador de quem usa (IndexedDB) e continua
lá ao reabrir a página; outro computador ou navegador começa com a análise vazia.

## Como rodar no computador

```bash
npm install
npm start                    # compila e abre o sistema em http://localhost:3000
npm run site                 # site completo (página comercial + sistema) em http://localhost:4173
npm test                     # 123 testes
node dist/src/cli.js --xml ./xmls --empresa ./empresa.json --saida ./saida
```

`npm run build` gera `dist/` (servidor e CLI) e `public/` (site do Netlify e as
bibliotecas de gráfico, Excel e PDF, servidas localmente, sem CDN).

`empresa.json`:

```json
{
  "cnpj": "00000000000000",
  "regime": "normal",
  "barOuRestaurante": false,
  "naturezaPorProduto": { "P123": "preparado_no_local" },
  "aceitarProjecao": false,
  "validacoes": [
    { "ncm": "19059010", "cProd": "P123", "regraId": "19059010-200034-VII-12",
      "resposta": "SIM", "autor": "clara", "data": "2026-09-20",
      "justificativa": "Pão de forma conforme a descrição do Anexo VII." }
  ]
}
```

A pasta de XMLs pode conter subpastas e arquivos `.zip`, sem limite de
quantidade.

## Saída

| Arquivo | Conteúdo |
| --- | --- |
| `vereditos.json` | Um registro por item, com regra aplicada, motivo, base, alíquotas usadas e o que faltou |
| `indicadores.json` | Totais por estado, conformidade, economia, exposição e avisos |
| `fila-validacao.json` | Pares produto + NCM que dependem de resposta humana, do maior valor para o menor |
| `descartados.json` | Todo documento que ficou de fora e por quê |

## Estados do veredito

| Estado | Significado |
| --- | --- |
| `CORRETO` | Códigos informados conferem com a regra aplicável |
| `INCORRETO_ECONOMIA` | Havia benefício aplicável e não foi usado: imposto pago a mais |
| `INCORRETO_RISCO` | Benefício usado sem regra que o ampare, ou campo obrigatório em branco: exposição a autuação |
| `REQUER_VALIDACAO` | O NCM admite um ou mais enquadramentos; a composição do produto decide |
| `NAO_OBRIGATORIO` | Preenchimento ainda não exigido para a data e o regime do emitente |
| `INDETERMINADO` | Falta dado. O sistema diz o que falta e não calcula |

Nenhum estado é decidido por valor presumido. Sem alíquota publicada para o
período, os campos de economia e exposição voltam nulos e o motivo diz por quê.

## Estrutura

| Arquivo | Papel |
| --- | --- |
| `src/parser.ts` | Leitura de NF-e/NFC-e e eventos; seleção de vendas, deduplicação por chave |
| `src/motor.ts` | Classificação esperada e comparação; estados e efeito financeiro |
| `src/parametros.ts` | Alíquotas de referência e obrigatoriedade, com vigência e fonte |
| `src/legado.ts` | Reprodução da planilha V4.1, com os defeitos, só para regressão |
| `src/indicadores.ts` | Indicadores do painel e fila de validação |
| `scripts/extrair_base.py` | Gera `data/base-normativa.json` a partir da planilha, saneando a base |
| `sql/schema.sql` | Esquema PostgreSQL com versão da base, vereditos e validações |
| `src/servidor.ts` / `src/pagina.ts` | Rotas da API e HTML da tela |
| `src/arquivos.ts` | Hash e cabeçalho de arquivos grandes sem carregá-los inteiros (explicacoes.json passa de 500 MB) |
| `web/` | Versão do navegador: sistema de arquivos em memória, worker, gerador de .xlsx |
| `web/marca/` | Imagens da marca Sabores Estratégicos usadas na tela, na impressão e no PDF; a logo original fica em `origem/` e as demais saem de `scripts/gerar_marca.py` |
| `scripts/build-web.mjs` | Gera `public/` para o Netlify (o sistema vai para `sistema.html`) |
| `site/` | Site comercial e área do cliente; `scripts/build-site.mjs` monta em `public/` (ver `site/README.md`) |
| `docs/etapa10/` | Auditoria da planilha V4.1 frente ao sistema e às fontes oficiais (diagnóstico, mapa linha a linha, proposta D5, natureza dos produtos) |
| `test/fixtures/empresa-teste.json` | Dados fixos dos testes (o `empresa.json` da raiz é configuração e pode mudar) |

## Base normativa

`data/base-normativa.json` sai da aba "Base de dados" da planilha, saneada:
1.369 regras, 1.193 NCMs, 46 deles com mais de um código possível. O relatório
da carga (`data/base-normativa-relatorio.json`) lista cada problema encontrado.

A carga definitiva deve vir da tabela oficial exportada do
[portal da conformidade](https://dfe-portal.svrs.rs.gov.br/Cff/ClassificacaoTributaria)
(CSV, Excel ou JSON), que traz o número do anexo por código. O campo `vedacoes`
do esquema existe para guardar as exceções de cada anexo, que aparecem na tela
de validação.

## Defeitos da planilha e o que mudou

| # | Defeito na V4.1 | Onde foi resolvido |
| --- | --- | --- |
| D01 | LEFT JOIN por NCM duplicava linhas e inflava o faturamento | `motor.ts`: uma linha por item; as regras candidatas ficam no veredito |
| D02 | NCM com códigos conflitantes saía CORRETO e INCORRETO | Estado `REQUER_VALIDACAO` com as opções |
| D03 | Regime de bares e restaurantes inexistente | `naturezaDoItem` + `BARES_RESTAURANTES` (art. 275) |
| D04 | Economia com 9% presumido sobre vProd | `parametros.ts` com vigência e fonte; base = vBC |
| D05 | Respostas SIM/NÃO apagadas no refresh | `validacao_beneficio` no banco, com autor, data e histórico |
| D06 | NCM fora da base presumia tributação integral | Motivo explícito; validação decide |
| D07 | Campo vazio virava não conformidade | `preenchimentoObrigatorio` por data, modelo e regime |
| D08 | Não separava risco de economia | Estados `INCORRETO_RISCO` e `INCORRETO_ECONOMIA` |
| D10-D13 | Base com texto livre, NCM de 7 dígitos, colunas deslocadas, fundamento errado | `scripts/extrair_base.py` |
| D14-D16 | Devolução, cancelamento e XML duplicado entravam no cálculo | `selecionarVendas` |
| D19, D23 | Erros sem log, limite de 1.000 XMLs, sem ZIP nem subpastas | `cli.ts` e `descartados.json` |

## Base normativa após a Etapa 10

Além das 1.369 regras da planilha, a base tem 1.066 regras de fonte oficial (decisão D5): NCMs que a
LC 214/2025 e o SVRS listam para os mesmos 12 códigos. Cada uma traz o item da lei e a entrada do SVRS
(`docs/etapa10/proposta-d5.json`). Ordem para refazer: `node scripts/proposta_d5.mjs`, `node scripts/aplicar_d5.mjs`,
`node scripts/auditoria_oficial.mjs`, `node scripts/gerar_base_v2.mjs`, `node scripts/auditoria_oficial.mjs`.

## O que falta

- Carga a partir do JSON oficial do portal da conformidade, com as vedações por anexo.
- Tela de validação (hoje as respostas entram pelo `empresa.json`).
- Alíquota de referência de 2027, quando o Senado publicar.
- Cadastro de natureza do item por produto para clientes que servem consumo no local.
