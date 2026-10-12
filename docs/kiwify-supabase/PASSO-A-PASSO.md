# Kiwify + login automático: passo a passo

Como fica para o cliente, no estilo de um streaming:

1. Ele clica em **Assinar** no site e cai direto no checkout da Kiwify.
2. Paga (cartão, Pix ou boleto).
3. Quando o pagamento é aprovado, a Kiwify avisa o site. O site libera o acesso e manda um
   **e-mail de convite** para o endereço usado na compra.
4. Ele abre o e-mail, clica no link, cria uma senha e já cai logado na área do cliente, com o sistema liberado.
5. Nas próximas vezes entra com e-mail e senha, ou pede um **link de acesso por e-mail** (sem senha).
6. Se cancelar, atrasar, pedir reembolso ou der chargeback, a Kiwify avisa e o acesso é ajustado sozinho.

Quem não tem assinatura ativa não abre o sistema (`/sistema.html`): é mandado para o login ou para
a área do cliente.

**Peças:** Kiwify (cobrança) → webhook no Netlify (`netlify/functions/kiwify-webhook.mts`) →
Supabase (login e banco) → site (`site/servicos/provedores/supabase-kiwify.ts`) e proteção do sistema
(`netlify/edge-functions/proteger-sistema.ts`).

Enquanto as variáveis do Supabase não estiverem no Netlify, o site continua em **modo demonstração**,
como hoje. Nada quebra durante a configuração.

Tempo estimado: 40 a 60 minutos. Custo: o plano gratuito do Supabase atende o começo.

---

## O que você vai me trazer (ou colar direto no Netlify)

| # | O quê | Onde pegar | Onde vai |
| --- | --- | --- | --- |
| 1 | `SUPABASE_URL` | Supabase, etapa 1.3 | Netlify (etapa 4) |
| 2 | `SUPABASE_ANON_KEY` (chave pública) | Supabase, etapa 1.3 | Netlify (etapa 4) |
| 3 | `SUPABASE_SERVICE_ROLE_KEY` (chave **secreta**) | Supabase, etapa 1.3 | **Só** no Netlify. Não mande para ninguém, nem para mim |
| 4 | `KIWIFY_WEBHOOK_TOKEN` | Kiwify, etapa 3.2 | **Só** no Netlify |
| 5 | Links de checkout de cada plano (até 6) | Kiwify, etapa 3.1 | Me mande: eu coloco em `site/config/planos.ts` |
| 6 | Endereço do site | Netlify (ex.: `https://xxxx.netlify.app` ou seu domínio) | Usado nas etapas 1 e 3 |

Os itens 1, 2, 5 e 6 podem ir para mim sem problema (são públicos). Os itens 3 e 4 são senhas do
sistema: cole direto no Netlify, sem mandar para ninguém.

---

## Etapa 1 · Supabase (login e banco)

### 1.1 Criar o projeto
1. Entre em <https://supabase.com> → **Start your project** → entre com o GitHub ou e-mail.
2. **New project**: nome `conformidade-ibs-cbs`, crie uma senha do banco (guarde, mas não vamos usar),
   região **South America (São Paulo)**. Clique em **Create new project** e espere 1 a 2 minutos.

### 1.2 Criar as tabelas
1. Menu da esquerda → **SQL Editor** → **New query**.
2. Abra o arquivo [`sql/supabase.sql`](../../sql/supabase.sql) deste repositório, copie **tudo**, cole e clique em **Run**.
3. Deve aparecer `Success. No rows returned`. Em **Table Editor** passam a existir `assinaturas`,
   `pagamentos` e `kiwify_eventos`.

### 1.3 Copiar as chaves
**Project Settings** (engrenagem) → **API Keys** (ou **Data API**):
- **Project URL** (ex.: `https://abcdefgh.supabase.co`) → item 1.
- **Publishable key** (`sb_publishable_...`) ou, na aba *Legacy*, **anon public** → item 2.
- **Secret key** (`sb_secret_...`) ou, na aba *Legacy*, **service_role** → item 3 (clique em *Reveal*). **Secreta.**

### 1.4 Endereços do site
**Authentication** → **URL Configuration**:
- **Site URL**: o endereço do site, ex.: `https://seusite.netlify.app`.
- **Redirect URLs** → **Add URL**: `https://seusite.netlify.app/**` (com os dois asteriscos).
  Se tiver domínio próprio, adicione também `https://seudominio.com.br/**`.

### 1.5 Só quem comprou pode ter conta
**Authentication** → **Sign In / Providers**:
- **Allow new users to sign up**: **desligado**. (As contas são criadas pelo webhook, na compra.)
- **Email** continua ligado. Em **Email**, deixe **Confirm email** ligado.

### 1.6 Envio de e-mails (obrigatório)
O envio padrão do Supabase só entrega para os membros da equipe do projeto e tem limite de poucos
e-mails por hora. Para os clientes receberem o convite, configure um SMTP próprio.

**Opção mais simples: Gmail** (até ~500 e-mails/dia)
1. Na conta Google `saboresestrategicosconsultoria@gmail.com`, ative a **Verificação em duas etapas**
   (<https://myaccount.google.com/security>).
2. Crie uma **Senha de app** em <https://myaccount.google.com/apppasswords> (nome: `Supabase`). Copie os 16 caracteres.
3. No Supabase: **Authentication** → **Emails** → **SMTP Settings** → **Enable custom SMTP**:
   - Sender email: `saboresestrategicosconsultoria@gmail.com`
   - Sender name: `Conformidade IBS/CBS`
   - Host: `smtp.gmail.com` · Port: `465`
   - Username: `saboresestrategicosconsultoria@gmail.com` · Password: a senha de app
   - Clique em **Save**.

**Alternativa profissional:** [Resend](https://resend.com) (3.000 e-mails/mês grátis) com o domínio
`saboresestrategicos.com.br` verificado. Os dados de SMTP aparecem no painel do Resend.

Depois, em **Authentication** → **Rate Limits**, suba **Rate limit for sending emails** para 30 ou mais por hora.

### 1.7 E-mails em português
**Authentication** → **Emails** → **Templates**. Troque assunto e corpo de três modelos:

**Invite user**, assunto: `Seu acesso ao Conformidade IBS/CBS está liberado`
```html
<h2>Bem-vindo ao Conformidade IBS/CBS</h2>
<p>Seu pagamento foi confirmado e o acesso já está liberado.</p>
<p>Clique no botão para criar sua senha e entrar:</p>
<p><a href="{{ .ConfirmationURL }}" style="background:#1B2B21;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;display:inline-block">Criar senha e entrar</a></p>
<p>O link vale por 24 horas. Se vencer, use "Receber link de acesso por e-mail" na tela de login.</p>
<p>Sabores Estratégicos</p>
```

**Magic Link**, assunto: `Seu link de acesso`
```html
<h2>Seu link de acesso</h2>
<p>Clique para entrar na sua conta do Conformidade IBS/CBS:</p>
<p><a href="{{ .ConfirmationURL }}" style="background:#1B2B21;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;display:inline-block">Entrar</a></p>
<p>Se não foi você que pediu, ignore este e-mail.</p>
```

**Reset Password**, assunto: `Crie uma nova senha`
```html
<h2>Nova senha</h2>
<p>Recebemos um pedido para trocar a senha da sua conta do Conformidade IBS/CBS.</p>
<p><a href="{{ .ConfirmationURL }}" style="background:#1B2B21;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;display:inline-block">Criar nova senha</a></p>
<p>Se não foi você que pediu, ignore este e-mail: sua senha continua a mesma.</p>
```

Em **Authentication** → **Sign In / Providers** → **Email**, aumente **Email OTP Expiration** para
`86400` (24 horas), para o convite não vencer rápido.

---

## Etapa 2 · Netlify: confirmar o endereço do site
1. Entre em <https://app.netlify.com> e abra o site deste repositório.
2. Anote o endereço (ex.: `https://conformidade-ibs-cbs.netlify.app`) ou o seu domínio próprio.
   É ele que vai nas etapas 1.4 e 3.

---

## Etapa 3 · Kiwify (pagamento)

### 3.1 Criar os planos de assinatura
1. Kiwify → **Produtos** → **Criar produto** → tipo **Assinatura** (cobrança recorrente).
2. Crie um produto por plano do site, **com o nome do plano no título**, para o webhook reconhecer:
   - `Conformidade IBS/CBS · Essencial`: plano **Mensal** R$ 149 e plano **Anual** R$ 1.490
   - `Conformidade IBS/CBS · Profissional`: Mensal R$ 297 e Anual R$ 2.970
   - `Conformidade IBS/CBS · Premium`: Mensal R$ 597 e Anual R$ 5.970

   (Os valores são os que estão hoje em `site/config/planos.ts`. Se mudar preço, me avise para
   atualizar o site também. Se preferir um único produto com seis planos, use os nomes
   `Essencial Mensal`, `Essencial Anual`, `Profissional Mensal`... nos planos.)
3. Em **Área de membros / Entrega**, **não** use a área de membros da Kiwify: a entrega é o nosso site.
   Se pedir um link de acesso, use `https://seusite.netlify.app/entrar.html`.
4. Em cada produto, em **Configurações → Checkout → Página de obrigado** (ou "Redirecionar após a
   compra"), coloque `https://seusite.netlify.app/entrar.html?compra=ok`. O cliente volta para o site
   e vê "Compra recebida, obrigado!".
5. Copie o **link de checkout** de cada plano (formato `https://pay.kiwify.com.br/AbC123x`) → **item 5**.
   Me mande indicando qual é qual (Essencial mensal, Essencial anual...).

### 3.2 Criar o webhook
1. Kiwify → **Apps** → **Webhooks** → **Criar webhook**.
2. Preencha:
   - **Nome**: `Site - liberar acesso`
   - **URL**: `https://seusite.netlify.app/api/kiwify`
   - **Produtos**: todos os três (ou "Todos os produtos")
   - **Eventos/gatilhos**: marque **todos**: Compra aprovada, Assinatura renovada, Assinatura atrasada,
     Assinatura cancelada, Reembolso, Chargeback, Pix gerado, Boleto gerado.
3. Salve. A Kiwify mostra um **Token** do webhook → **item 4** (secreto).

---

## Etapa 4 · Colar as chaves no Netlify
Netlify → seu site → **Site configuration** → **Environment variables** → **Add a variable** →
**Add a single variable**. Crie as quatro, cada uma com escopo **All scopes** e o mesmo valor em
todos os contextos:

| Key | Value |
| --- | --- |
| `SUPABASE_URL` | item 1 |
| `SUPABASE_ANON_KEY` | item 2 |
| `SUPABASE_SERVICE_ROLE_KEY` | item 3 (marque **Contains secret values**) |
| `KIWIFY_WEBHOOK_TOKEN` | item 4 (marque **Contains secret values**) |

Depois: **Deploys** → **Trigger deploy** → **Deploy site**. Quando terminar, o site sai do modo
demonstração (a faixa "Modo demonstração" some).

> Os links de checkout (item 5) entram no código. Me mande os links que eu atualizo e publico; ou
> edite `site/config/planos.ts` trocando `linkMensal: null` / `linkAnual: null` pelos links, entre aspas.

---

## Etapa 5 · Testar com uma compra real
1. Na Kiwify, crie um **cupom de 100%** (ou use o menor valor possível) e compre um plano com um
   e-mail seu que **não** seja o do Supabase.
2. Em até 1 minuto deve chegar o e-mail **"Seu acesso ao Conformidade IBS/CBS está liberado"**.
3. Clique, crie a senha: você cai em **Minha conta**, com a assinatura ativa e o botão **Abrir sistema**.
4. Abra uma janela anônima e tente `https://seusite.netlify.app/sistema.html`: deve mandar para o login.
5. Na Kiwify, reembolse a compra de teste: o acesso deve ser encerrado.

**Se algo não funcionar**, olhe nesta ordem:
- Kiwify → Webhooks → histórico de envios: o status deve ser **200**. `401` = token errado no Netlify;
  `500` = alguma variável faltando.
- Supabase → **Table Editor** → `kiwify_eventos`: cada aviso aparece com o payload e o **resultado**
  (ex.: `ok: ativa; plano essencial/anual por nome; convite enviado`). Se aparecer
  `PLANO NÃO IDENTIFICADO`, o acesso foi liberado no plano Profissional: confira os nomes ou me mande os links.
- Supabase → **Authentication** → **Users**: o comprador deve estar lá como *Invited*.
- E-mail não chegou: confira o SMTP (etapa 1.6) e a caixa de spam. Em **Authentication → Users**,
  os três pontinhos do usuário → **Send magic link** reenvia o acesso.

---

## No dia a dia

- **Liberar acesso sem compra** (cortesia, parceiro): Supabase → **Authentication → Users → Invite user**
  com o e-mail; depois rode no SQL Editor o `insert` comentado no fim de `sql/supabase.sql`.
- **Cliente quer cancelar**: ele cancela pelo e-mail da Kiwify ou você cancela no painel da Kiwify.
  O site recebe o aviso e mantém o acesso até o fim do período pago.
- **Cliente quer trocar de plano**: a área do cliente orienta a falar com o suporte. Você cancela a
  assinatura antiga na Kiwify e manda o link do plano novo.
- **Cliente quer excluir a conta (LGPD)**: Supabase → **Authentication → Users** → excluir o usuário,
  e **Table Editor** → apagar as linhas do e-mail em `assinaturas` e `pagamentos`.
- **Um e-mail = uma assinatura.** O login é o e-mail usado na compra. Se o cliente comprar com outro
  e-mail, ele terá outra conta.

## Limites conhecidos
- O sistema de XML continua rodando no navegador. A proteção barra quem abre `sistema.html` sem
  assinatura, mas os arquivos de código do sistema (`navegador.js`, `worker.js`) continuam públicos,
  como hoje. Para um curioso técnico é possível montar o sistema fora do site; para o cliente comum,
  o acesso fica de fato fechado.
- Os nomes dos campos do webhook seguem o formato público da Kiwify. Se a Kiwify mudar algo, o
  payload fica gravado em `kiwify_eventos` e o ajuste é em `netlify/lib/kiwify.ts`.
