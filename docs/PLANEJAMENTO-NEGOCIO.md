# Planejamento do negócio: Conformidade IBS/CBS (Sabores Estratégicos)

Documento de planejamento: o que o sistema faz hoje, o que falta para vendê-lo como assinatura, quais
opções técnicas existem, quanto custa e como automatizar a venda.

> Os preços de fornecedores abaixo são **aproximados (referência de 2026)** e mudam com frequência.
> Confira no site de cada um antes de fechar o orçamento.

---

## 1. O que o sistema faz hoje

### 1.1 Resumo em uma frase

Recebe os XMLs de venda (NF-e modelo 55 e NFC-e modelo 65) de uma empresa, confere se o **CST** e o
**cClassTrib** de IBS/CBS de cada item estão corretos frente à LC 214/2025 e às tabelas oficiais, e mostra
onde a empresa está **pagando imposto a mais** (economia) e onde está **exposta a autuação** (risco).

Escopo: só IBS e CBS. ICMS, ST, DIFAL, PIS/Cofins, IPI, CEST e CSOSN ficam fora.

### 1.2 Funcionalidades (abas da tela)

| Aba | O que faz |
| --- | --- |
| **Análise** | Recebe XMLs ou arquivos .zip (até 10.000 XMLs por envio, com subpastas). Botões "Adicionar XMLs", "Processar análise" e "Nova análise (limpar dados)". Mostra as alíquotas usadas (2026: CBS 0,9% e IBS 0,1%, período de teste) e o **benefício por atividade** (regime de bares e restaurantes, arts. 273 a 276, a partir do CNAE do emitente). |
| **Dashboard** | Situação da empresa, economia potencial, itens por situação, % de conformidade, distribuição dos itens, produtos com benefício/redução e resultados por NCM, com gráficos. |
| **Resultados** | Lista item a item com filtro por situação (Correto, Incorreto-economia, Incorreto-risco, Precisa validar, Não obrigatório, Indeterminado). Imprimir e exportar CSV. |
| **Pendências** | Produtos cujo NCM admite mais de um enquadramento: o usuário responde SIM/NÃO por produto. Uma validação por produto (cProd), lista numerada de regras candidatas, tarja para produto sem informação tributária. Imprimir e exportar CSV. |
| **Relatório Final** | Relatório operacional dos produtos que precisam ter o cadastro ajustado: código, descrição, NCM, cClassTrib e CST a usar, alíquota e instrução. Separado em "com validação", "sem validação" e "incorreto-risco". Exporta **CSV, Excel e PDF** com a marca. |
| **Consulta Tributária por NCM** | Consulta preventiva, sem XML: informa NCM, modelo (55/65) e natureza (mercadoria, preparado no local, bebida alcoólica, serviço) e recebe o enquadramento, as regras candidatas, a auditoria e as fontes. Nada é gravado. |

### 1.3 O "motor" por trás

- **Leitura dos XMLs** (`src/parser.ts`): separa vendas, descarta devoluções, cancelamentos e XMLs
  duplicados (por chave de acesso) e registra o motivo de cada descarte.
- **Base normativa** (`data/base-normativa*.json`): 1.369 regras da planilha V4.1 saneadas + 1.066 regras de
  fonte oficial (LC 214/2025 e portal SVRS), 1.193 NCMs, com fundamento legal de cada regra.
- **Bloqueios oficiais** (`src/bloqueios.ts`): impede regras que a lei ou o SVRS vedam para aquele NCM.
- **Classificação** (`src/motor.ts`): 6 estados — `CORRETO`, `INCORRETO_ECONOMIA`, `INCORRETO_RISCO`,
  `REQUER_VALIDACAO`, `NAO_OBRIGATORIO`, `INDETERMINADO`. Nunca decide por valor presumido.
- **Explicação e auditoria** (`src/explicador.ts`, `src/alertas.ts`): cada resultado diz o que a fonte oficial
  diz, o que o sistema inferiu e o que falta; 18 tipos de alerta informativo.
- **Parâmetros com vigência** (`src/parametros.ts`): alíquotas e obrigatoriedade por data e regime.
- **123 testes automatizados** (`npm test`).

### 1.4 Onde o sistema roda hoje (ponto mais importante para o planejamento)

A versão publicada no Netlify roda **inteira no navegador de quem usa** (Web Worker). Os XMLs **não são
enviados para nenhum servidor**: ficam só no computador do usuário (IndexedDB do navegador) e somem ao
clicar em "Nova análise" ou limpar o navegador.

Consequências:

- ✅ **Você já não guarda nenhum XML.** Isso é ótimo para LGPD e sigilo fiscal, e é um argumento de venda
  ("seus XMLs nunca saem do seu computador").
- ✅ Custo de processamento seu é praticamente **zero**, não importa se o cliente manda 100 ou 10.000 XMLs.
- ⚠️ Hoje **qualquer pessoa com o link usa de graça**, não há login.
- ⚠️ O motor e a base normativa são baixados pelo navegador — quem pagar uma vez pode, com conhecimento
  técnico, copiar. (Tratado na seção 3.)
- ⚠️ As respostas SIM/NÃO das pendências ficam só naquele navegador: trocou de computador, perdeu.

### 1.5 O que ainda falta no produto (do README)

- Carga da base a partir do JSON oficial do portal da conformidade, com as vedações por anexo.
- Alíquota de referência de 2027, quando o Senado publicar.
- Cadastro de natureza do item por produto (bares/restaurantes) pela tela.

---

## 2. Precisa de banco de dados?

**Para os XMLs, não.** Para vender com login e planos, **sim, um banco pequeno** — só com dados de conta,
nunca com conteúdo de nota fiscal.

| Guardar no banco | Motivo |
| --- | --- |
| Usuários (nome, e-mail, senha criptografada/login Google) | Login |
| Assinatura (plano, status, vencimento, id do cliente no gateway) | Liberar ou bloquear acesso automaticamente |
| CNPJs cadastrados na conta | Controlar limite do plano (ex.: plano de 1 CNPJ) |
| Configuração da empresa (regime, bar/restaurante, natureza por produto) | Não precisar refazer a cada análise |
| *(opcional)* Respostas SIM/NÃO por produto (cProd + NCM + resposta + autor + data) | Não perder validações ao trocar de computador; é o que o cliente mais sofre para refazer |
| Contadores de uso (quantas análises, quantos XMLs, data) — **só números** | Métricas de negócio e limite de plano |

| **Não** guardar | |
| --- | --- |
| XML, chave de acesso, itens das notas, CPF de consumidor, valores de venda | Fica só no navegador do cliente, como já é hoje |

> O `sql/schema.sql` atual tem tabelas `documento` e `item_documento` que guardariam dados das notas.
> No modelo "sem XML" elas **não** seriam usadas; o banco do SaaS seria outro, bem menor.

**Opções de banco (todas com plano gratuito para começar):**

| Opção | Por que considerar | Custo aproximado |
| --- | --- | --- |
| **Supabase** (recomendado) | Postgres + login pronto + funções de servidor no mesmo lugar | Grátis no início; Pro ~US$ 25/mês |
| Firebase (Google) | Login + banco NoSQL; muito usado | Grátis até um volume alto; paga por uso |
| Neon / Railway (Postgres) | Só o banco; login você resolve com outro serviço | Grátis a ~US$ 20/mês |

---

## 3. Arquitetura: como proteger e cobrar

Três caminhos possíveis:

### Opção A — Motor no navegador + login + base protegida (**recomendada**)

Mantém o que já funciona (processamento no computador do cliente) e adiciona:

1. **Login** antes de abrir o sistema.
2. A **base normativa** (o seu ativo mais valioso) deixa de ser um arquivo público e passa a ser entregue por
   uma função que **só responde para assinante ativo** (token de sessão válido).
3. O app consulta o status da assinatura ao abrir; vencido → tela de "renovar".

- Custo de servidor: quase zero (nada de XML trafega).
- Argumento de venda: "processamento local, seus XMLs não saem do seu computador".
- Risco: um assinante técnico poderia copiar a base baixada. Mitigações: ofuscar o código no build, base com
  validade (expira e precisa ser renovada), marca d'água por conta nos relatórios, termos de uso. Para esse
  público (contadores, restaurantes), o risco é baixo, e a base muda sempre — cópia fica desatualizada.

### Opção B — Processamento no servidor (XML processado e descartado)

O XML sobe, é processado em memória e apagado na hora; só o resultado volta.

- Protege 100% o motor e a base.
- Porém: 10.000 XMLs ≈ 100–300 MB por envio; funções serverless (Netlify/Vercel) têm limite de poucos MB por
  requisição, então exigiria um servidor próprio (VPS ~R$ 50–200/mês), custo que cresce com o uso e
  responsabilidade maior na LGPD (os dados passam pelo seu servidor, mesmo sem guardar).
- Faz sentido só se aparecer concorrente copiando ou cliente grande pedindo API.

### Opção C — Sem programar o login: plataforma de venda + área de membros

Vender por Hotmart/Kiwify/Eduzz e liberar acesso por um link protegido. É o mais rápido de colocar no ar, mas
não controla CNPJ por plano, cobra taxa maior (8–10% por venda) e é pensado para curso, não para software.
Serve como **teste de mercado** nos primeiros meses, não como solução final.

**Recomendação:** começar pela **Opção A**. Se quiser validar a venda antes de programar, rodar a Opção C por
1–3 meses.

---

## 4. Login e planos (modelo "streaming")

Sim, funciona exatamente como streaming: o cliente assina, o cartão/Pix é cobrado todo mês ou ano, e o acesso
fica liberado enquanto a assinatura estiver em dia.

### 4.1 Serviços de login

| Serviço | Observação | Custo aproximado |
| --- | --- | --- |
| **Supabase Auth** (recomendado, junto com o banco) | E-mail/senha, link mágico por e-mail, Google | Incluso no Supabase |
| Clerk | Telas de login prontas e bonitas | Grátis até ~10 mil usuários/mês |
| Firebase Auth | Estável, do Google | Grátis na prática |
| Auth0 | Mais corporativo | Grátis limitado; caro depois |

Itens recomendados: login com Google, confirmação de e-mail, "esqueci minha senha", e **limite de sessões
simultâneas** por conta (evita 1 assinatura usada por 10 pessoas).

### 4.2 Como definir os planos

Como o processamento não custa nada para você, **não cobre por XML**: cobre pelo **valor** entregue. O que
mais diferencia um cliente de outro é **quantos CNPJs** ele analisa. O CNPJ do emitente já vem no XML, então
o sistema consegue conferir automaticamente se aquele CNPJ está cadastrado na conta.

Sugestão de grade (valores ilustrativos, a validar com clientes):

| Plano | Para quem | CNPJs | Recursos | Mensal | Anual (≈2 meses grátis) |
| --- | --- | --- | --- | --- | --- |
| **Grátis** | Captação | — | Só Consulta por NCM (limite diário) | R$ 0 | — |
| **Empresa** | Restaurante, loja, indústria pequena | 1 | Tudo | R$ 97–197 | R$ 970–1.970 |
| **Contador** | Escritório contábil | até 10 | Tudo + relatórios com a marca do escritório | R$ 297–497 | R$ 2.970–4.970 |
| **Escritório** | Contabilidade maior / consultoria | até 50 (CNPJ extra cobrado) | Tudo + suporte prioritário | R$ 797+ | sob consulta |

Alternativas que também funcionam:

- **Por diagnóstico avulso** (pagamento único por análise, ex.: R$ 297–997): bom para quem só quer uma
  foto da situação. Pode coexistir com as assinaturas.
- **Licença + consultoria**: o sistema entra no pacote da consultoria Sabores Estratégicos.
- **Teste grátis de 7 dias** com cartão cadastrado (converte mais) ou sem cartão (gera mais testes).

Argumento forte para o plano anual: a reforma vai até 2033, as regras mudam todo ano e o cliente precisa da
base atualizada.

---

## 5. Cobrança automática (gateway de pagamento)

| Gateway | Pontos fortes | Taxas aproximadas |
| --- | --- | --- |
| **Asaas** (recomendado para Brasil) | Assinatura recorrente com Pix, boleto e cartão; **emite a NFS-e automaticamente**; régua de cobrança por e-mail/WhatsApp; webhooks | Pix/boleto ~R$ 1–2 por cobrança; cartão ~3–5% |
| **Stripe** | O mais automatizado para software: portal do cliente (trocar cartão, plano, cancelar), trial, cupons, webhooks excelentes | Cartão ~4% + R$ 0,39; Pix e boleto disponíveis |
| Mercado Pago | Marca conhecida, Pix fácil | Cartão ~4–5% |
| Pagar.me / Iugu / Vindi | Foco em recorrência B2B | Negociável |
| Hotmart / Kiwify / Eduzz | Checkout + afiliados prontos | ~8–10% + taxa fixa |

**Recomendação:** **Asaas** se o público pagar muito por Pix/boleto e você quiser a nota fiscal automática;
**Stripe** se quiser a experiência mais "streaming" (cartão, portal do cliente). Os dois conversam com o
Supabase por webhook.

---

## 6. Fluxo 100% automático

```
Site de vendas (seu domínio)
   │  cliente escolhe o plano
   ▼
Checkout do gateway (Asaas/Stripe) ── pagamento aprovado
   │
   ▼  webhook (aviso automático)
Função no Supabase  →  cria/ativa a conta, grava plano e vencimento
   │
   ▼
E-mail de boas-vindas com link de acesso (Resend / Brevo)
   │
   ▼
Cliente faz login → cadastra CNPJ(s) → sobe XMLs → relatórios
   │
   ├─ renovação mensal/anual cobrada sozinha pelo gateway
   ├─ falha no pagamento → e-mails de aviso (dia 1, 3, 7) → acesso bloqueado no dia X
   ├─ cancelamento pelo próprio cliente no portal → acesso até o fim do período pago
   └─ NFS-e emitida automaticamente a cada pagamento (Asaas ou emissor integrado)
```

Nenhuma etapa depende de você fazer algo manualmente. O que continua manual: **atualizar a base normativa**
quando a lei ou as tabelas oficiais mudarem, suporte e vendas.

---

## 7. Domínio, hospedagem e ferramentas

| Item | Precisa? | Opções | Custo aproximado |
| --- | --- | --- | --- |
| **Domínio .com.br** | Sim (credibilidade e e-mail profissional) | Registro.br | ~R$ 40/ano |
| Domínio .com | Opcional (proteger a marca) | Cloudflare, Namecheap | ~US$ 10–15/ano |
| **Hospedagem do sistema** | Sim | Netlify (já configurado), Cloudflare Pages, Vercel | Grátis no início; Netlify Pro ~US$ 19/mês |
| **Banco + login** | Sim | Supabase | Grátis → ~US$ 25/mês |
| **E-mail profissional** (contato@seudominio) | Sim | Google Workspace, Zoho Mail | ~R$ 0–35/usuário/mês |
| **E-mail automático** (boas-vindas, senha, cobrança) | Sim | Resend, Brevo | Grátis até alguns milhares/mês |
| **Site de vendas (landing page)** | Sim | Página estática no mesmo Netlify, Framer, Carrd | R$ 0–100/mês |
| Suporte | Recomendado | WhatsApp Business (grátis), Crisp/Tawk.to (chat no site) | R$ 0–100/mês |
| Métricas do site | Recomendado | Google Analytics, Plausible | R$ 0–50/mês |
| Monitoramento de erros | Recomendado | Sentry | Grátis no início |
| Certificado SSL (https) | Sim | Já incluso no Netlify/Cloudflare | R$ 0 |

---

## 8. Parte legal e empresa

| Item | Observação |
| --- | --- |
| **CNPJ** | Necessário para emitir nota e usar gateway como empresa. MEI **não** permite atividade de software; o caminho usual é ME no **Simples Nacional** (CNAE 6203-1/00 — licenciamento de programas não customizáveis — ou 6311-9/00). Confirmar com contador (fator R, anexo III ou V). |
| **Contador** | ~R$ 300–700/mês para ME de serviços. |
| **Nota fiscal (NFS-e)** | Obrigatória em cada venda; automatizar pelo Asaas ou emissor (eNotas, NFE.io). |
| **Termos de Uso** | Deixar claro: o sistema é ferramenta de apoio; a decisão de cadastro fiscal é do contribuinte/contador responsável; limitação de responsabilidade. |
| **Política de Privacidade (LGPD)** | Dizer o que é guardado (conta, CNPJs, validações) e o que **não** é (XMLs processados localmente). |
| **Registro da marca no INPI** | Recomendado ("Sabores Estratégicos" e o nome do produto). ~R$ 300–900 em taxas. |
| **Direito de desistência** | Venda online para consumidor tem 7 dias (CDC); para empresa (B2B) é regra contratual — defina no termo. |

---

## 9. Custos

### 9.1 Custos para colocar no ar (uma vez)

| Item | Faixa |
| --- | --- |
| Domínio (.com.br + .com) | R$ 40–120 |
| Abertura de empresa (se ainda não tiver) | R$ 0–1.500 |
| Registro de marca no INPI | R$ 300–900 |
| Termos de uso e privacidade (advogado ou modelo revisado) | R$ 0–2.000 |
| Desenvolvimento de login + planos + pagamento + landing page | Seu tempo, ou ~R$ 3.000–15.000 se contratar |
| **Total** | **~R$ 400 a R$ 20.000**, dependendo do que você faz sozinho |

### 9.2 Custos mensais por fase

| Item | Início (0–50 clientes) | Crescimento (50–300) | Escala (300+) |
| --- | --- | --- | --- |
| Hospedagem (Netlify) | R$ 0 | ~R$ 110 | ~R$ 110–250 |
| Supabase | R$ 0 | ~R$ 140 | ~R$ 140–400 |
| E-mail profissional | R$ 0–35 | ~R$ 70 | ~R$ 150 |
| E-mail automático | R$ 0 | R$ 0–120 | ~R$ 120–300 |
| Chat/suporte, métricas | R$ 0 | ~R$ 100 | ~R$ 300 |
| Contador | R$ 300–700 | R$ 400–800 | R$ 600–1.200 |
| **Subtotal fixo** | **~R$ 300–750** | **~R$ 900–1.400** | **~R$ 1.500–2.700** |
| Taxas do gateway | ~2–5% do faturado | idem | idem |
| Imposto (Simples Nacional) | ~6–15,5% do faturado | idem | idem |
| Marketing (anúncios, eventos) | à sua escolha | | |

Domínio e hospedagem **não** são o custo relevante. O custo real é: **imposto + taxa do gateway + contador +
seu tempo de atualizar a base e dar suporte + marketing**.

### 9.3 Ponto de equilíbrio (exemplo)

Premissas: plano médio R$ 197/mês, imposto 6% + gateway 3% → sobra ~R$ 179 por cliente; custo fixo R$ 700.

- **4 clientes** pagam a estrutura.
- 30 clientes → ~R$ 5.900/mês de receita, ~R$ 4.600 de sobra.
- 100 clientes → ~R$ 19.700/mês de receita, ~R$ 17.200 de sobra (antes de marketing e pró-labore).

Com plano de contador (R$ 397, 10 CNPJs), 50 escritórios já são ~R$ 19.800/mês.

---

## 10. Como vender

**Público-alvo** (em ordem de prioridade sugerida):

1. **Escritórios de contabilidade** — um cliente seu atende dezenas de CNPJs; precisam revisar cadastros de
   todos até 2027. Canal: LinkedIn, grupos de contadores, CRCs regionais, eventos, parceria de indicação
   (comissão recorrente de 20–30%).
2. **Bares, restaurantes e food service** — o sistema já trata o regime específico (arts. 273–276) e a marca
   Sabores Estratégicos é desse setor. Canal: Abrasel e associações, consultorias do setor, Instagram.
3. **Softwares de PDV/ERP** — parceria ou licença para quem emite a NFC-e dos restaurantes.
4. **Varejo e indústria de alimentos** — muitos NCMs com redução de 60% ou alíquota zero (cesta básica).

**Isca de captação:** Consulta por NCM gratuita (com cadastro de e-mail) → "descubra se o seu produto tem
redução" → oferta de teste grátis da análise completa.

**Material de venda:** landing page com o relatório de exemplo (PDF), vídeo de 2 minutos subindo XMLs e
mostrando a economia, página "segurança: seus XMLs não saem do seu computador".

**Métricas para acompanhar:** visitantes → testes → pagantes (conversão), cancelamento mensal (churn),
receita recorrente mensal (MRR), custo para conquistar cada cliente (CAC).

---

## 11. Antes de vender: arrumar o repositório

- **Remover XMLs reais do repositório** (`analise-atual/xmls/`, `xml_teste/`, `saida-teste-4532/`) e do
  histórico do git se o repositório for público: são notas de terceiros (LGPD/sigilo fiscal).
- Tornar o repositório **privado** (hoje o botão "Deploy to Netlify" do README sugere que é público: qualquer
  um pode publicar uma cópia).
- Tirar da pasta `src/` os 28 arquivos de backup (`servidor-antes-*.ts`, `*.bak`) e mover os 8 `.cjs` de
  correção para `scripts/`.
- Parar de publicar `base-normativa.json` como arquivo aberto (vira endpoint protegido — Opção A).

---

## 12. Roteiro de execução

| Fase | Entregas | Prazo estimado |
| --- | --- | --- |
| **0. Base legal** | CNPJ/CNAE, contador, domínio, e-mail profissional, pedido de marca | 1–4 semanas |
| **1. Arrumação** | Itens da seção 11; repositório privado | 1 semana |
| **2. Contas e login** | Supabase: login, tabela de contas, CNPJs por conta, bloqueio sem login | 1–2 semanas |
| **3. Planos e pagamento** | Produtos no Asaas/Stripe, webhook → ativa/bloqueia conta, portal do cliente, e-mails automáticos, NFS-e automática | 1–2 semanas |
| **4. Proteção** | Base normativa por endpoint autenticado, ofuscação no build, limite de sessões | 1 semana |
| **5. Vitrine** | Landing page, termos, privacidade, página de preços, Consulta por NCM gratuita | 1–2 semanas |
| **6. Piloto** | 5–10 clientes com desconto em troca de depoimento e feedback | 1 mês |
| **7. Lançamento** | Anúncios, parcerias com contadores e associações | contínuo |
| **Contínuo** | Atualizar base normativa (alíquotas 2027, tabelas SVRS, vedações por anexo), suporte | sempre |

---

## 13. Decisões que você precisa tomar

1. Opção A (navegador + login, recomendada), B (servidor) ou C (plataforma tipo Hotmart para testar)?
2. Gateway: Asaas (Pix/boleto + NFS-e) ou Stripe (cartão, mais automatizado)?
3. Cobrar por **CNPJ** (recomendado), por análise avulsa ou os dois?
4. Público principal no lançamento: contadores ou restaurantes?
5. Guardar as respostas SIM/NÃO na nuvem (mais conveniente) ou manter só no navegador (mais simples)?
6. Vai fazer o desenvolvimento (fases 2–5) sozinho(a) ou contratar?
