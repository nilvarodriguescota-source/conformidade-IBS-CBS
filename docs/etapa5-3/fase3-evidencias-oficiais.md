# Etapa 5.3 — Fase 3: evidências oficiais na base v2

Registro de proveniência das evidências oficiais já auditadas (Etapa 5.1), sem alterar nenhum campo das regras e
sem mudar o comportamento fiscal.

## De onde vem cada dado

| Dado | Origem |
|---|---|
| Evidência por regra, status, itens oficiais | `data/auditoria-oficial.json` (gerado por `scripts/auditoria_oficial.mjs`) |
| Fontes | F1 — LC 214/2025 (Planalto), `data/fontes/lc214/lcp214.htm`; F2 — SVRS, `data/fontes/svrs/svrs.html` |
| Versão da fonte | URL, arquivo, SHA-256, versão e data de consulta do registro de fontes (Etapa 4) |
| Data da auditoria | 2026-09-24 |

## O que a Etapa 5.3 grava em `data/base-normativa.v2.json`

Gerado por `node scripts/gerar_base_v2.mjs` (Etapa 5.3 = `scripts/base_v2_evidencias.mjs`):

- **`regras[i].itemOficial`**: só quando a lei cobre o NCM com um único item e o NCM não é VEDADO no SVRS. O campo
  `item` original fica como está. 978 regras têm `itemOficial`; em 104 ele difere do `item` da base (divergência
  registrada).
- **`evidenciasOficiais`** (raiz, depois de `vinculacoes`):
  - `fontes`: F1 e F2, com URL, arquivo, SHA-256, versão e data de consulta.
  - `codigo`: vínculos de código (CST, anexo, redução, fundamento) dos 10 códigos fora do escopo da Etapa 5, no
    mesmo formato de `vinculacoes.codigo` (40 registros). 200033 e 200043 não são repetidos.
  - `regras`: uma evidência por regra (1.369), com `statusOficial`, `statusAuditoria`, `itemOficial`,
    `itensOficiais`, `divergencias`, fatos da lei e do SVRS e `vinculoNcmItemConfirmado`. Para 200033/200043, só a
    referência ao vínculo da Etapa 5 (`vinculoEtapa5`), sem copiar os fatos.

| Status oficial | Regras |
|---|---|
| CONFIRMADA | 856 |
| DIVERGENTE | 160 |
| VEDADO | 135 |
| NÃO DETERMINADA | 203 |
| NÃO LOCALIZADA | 15 |

`VEDADO` = o SVRS lista o NCM como VEDADO para o código. O bloqueio do motor (Fase 2) continua só em
`src/bloqueios.ts`; a v2 não tem lógica de bloqueio.

## Casos tratados sem escolha

- **Vários itens oficiais**: `itemOficial` fica nulo e todos os itens possíveis são registrados.
- **200038**: 62 regras têm no `item` um valor com forma de posição de NCM (03.09, 05.06, 23.06, 33.01…) vindo da
  coluna "Item" da planilha. O valor não foi corrigido; a divergência `item_da_base_com_forma_de_posicao_ncm` e os
  itens oficiais ficam registrados.

## D3

D3 = regras cujo vínculo NCM × item com a fonte oficial não está CONFIRMADO na auditoria oficial
(`vinculoNcmItemConfirmado = false`). É o mesmo dado que o explicador usa; regras bloqueadas não entram na D3.

## Como regenerar e conferir

1. `node scripts/auditoria_oficial.mjs` (se a base ou os snapshots mudarem)
2. `node scripts/gerar_base_v2.mjs`
3. `node scripts/auditoria_oficial.mjs` (a auditoria registra o SHA-256 da v2)
4. `node scripts/verificar_base_v2.mjs` e `node scripts/auditoria_oficial.mjs --verificar`
