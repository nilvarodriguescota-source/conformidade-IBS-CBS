# Kiwify + Supabase + Hostinger: passo a passo

Como fica para o cliente, no estilo de um streaming:

1. Ele clica em **Assinar** no site e cai direto no checkout da Kiwify.
2. Paga (cartão, Pix ou boleto).
3. Quando o pagamento é aprovado, a Kiwify avisa o Supabase. O acesso é liberado e o cliente recebe
   um **e-mail de convite** no endereço usado na compra.
4. Ele abre o e-mail, clica no link, cria uma senha e já cai logado na área do cliente, com o sistema liberado.
5. Nas próximas vezes entra com e-mail e senha, ou pede um **link de acesso por e-mail** (sem senha).
6. Se cancelar, atrasar, pedir reembolso ou der chargeback, a Kiwify avisa e o acesso é ajustado sozinho.
7. Cada plano tem um limite de **XMLs de venda por mês** (Essencial 2.000, Profissional 5.000, Premium
   10.000). A análise que passar do limite é recusada com uma explicação. A mesma nota analisada de novo
   no mesmo mês não conta duas vezes, e o limite renova no dia 1º.

Quem não tem assinatura liberada não abre o sistema (`/sistema`): é mandado para o login ou para a
área do cliente.

**Peças:**

| Peça | O que faz | Onde está no código |
| --- | --- | --- |
| Hostinger | Hospeda o site (arquivos estáticos) | `site/hospedagem/.htaccess`, `.github/workflows/hostinger.yml` |
| Kiwify | Cobra e avisa cada compra, renovação, cancelamento e reembolso | Links em `site/config/planos.ts` |
| Supabase: função `kiwify-webhook` | Recebe o aviso da Kiwify, grava a assinatura e manda o convite | `webhook/` → gera `supabase/functions/kiwify-webhook/index.ts` |
| Supabase: banco e login | Contas, assinaturas, pagamentos e contagem de XMLs | `sql/supabase.sql` |

Tempo estimado: 1 hora. Custo: o plano gratuito do Supabase atende o começo.

---

## O que você vai me mandar (e o que NÃO mandar)

| # | O quê | Onde pegar | Para quem |
| --- | --- | --- | --- |
| 1 | Endereço do Supabase (`https://xxxx.supabase.co`) | Etapa 1.3 | Me mande: vai em `site/config/integracoes.ts` |
| 2 | Chave pública do Supabase (`sb_publishable_...` ou *anon public*) | Etapa 1.3 | Me mande: vai em `site/config/integracoes.ts` |
| 3 | Endereço do site (ex.: `https://seudominio.com.br`) | Hostinger | Me mande: vai em `site/config/integracoes.ts` |
| 4 | Links de checkout dos 6 planos | Etapa 3.1 | Me mande: vão em `site/config/planos.ts` |
| 5 | Token do webhook da Kiwify | Etapa 3.2 | **Ninguém.** Cole só nos segredos da função (etapa 2.3) |
| 6 | Chave secreta do Supabase (`sb_secret_...` ou *service_role*) | Etapa 1.3 | **Ninguém.** Você nem precisa copiar: a função já recebe sozinha |

Os itens 1 a 4 são públicos (aparecem no navegador de qualquer visitante). Os itens 5 e 6 são
senhas do sistema.

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
   `pagamentos`, `kiwify_eventos` e `uso_xmls`.

> Pode rodar o arquivo de novo sempre que ele mudar: nada é apagado.

### 1.3 Copiar o endereço e a chave pública
**Project Settings** (engrenagem) → **API Keys** (ou **Data API**):
- **Project URL** (ex.: `https://abcdefgh.supabase.co`) → item 1.
- **Publishable key** (`sb_publishable_...`) ou, na aba *Legacy*, **anon public** → item 2.

### 1.4 Endereços do site
**Authentication** → **URL Configuration**:
- **Site URL**: o endereço do site, ex.: `https://seudominio.com.br`.
- **Redirect URLs** → **Add URL**: `https://seudominio.com.br/**` (com os dois asteriscos).
  Se usar a prévia do Netlify, adicione também `https://seusite.netlify.app/**`.

### 1.5 Só quem comprou pode ter conta
**Authentication** → **Sign In / Providers**:
- **Allow new users to sign up**: **desligado**. (As contas são criadas na compra.)
- **Email** continua ligado. Em **Email**, deixe **Confirm email** ligado e aumente
  **Email OTP Expiration** para `86400` (24 horas), para o convite não vencer rápido.

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

**Alternativa:** o e-mail do seu domínio na Hostinger (hPanel → **E-mails**). Os dados de SMTP
aparecem em **Configurar dispositivos** (normalmente `smtp.hostinger.com`, porta `465`).

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

---

## Etapa 2 · Supabase: a função que recebe a Kiwify

O site fica na Hostinger, que só guarda arquivos. Quem recebe o aviso da Kiwify é uma função dentro
do próprio Supabase.

### 2.1 Criar a função
1. Menu da esquerda → **Edge Functions** → **Deploy a new function** → **Via Editor**.
2. Nome da função: `kiwify-webhook` (exatamente assim).
3. Apague o código de exemplo. Abra o arquivo
   [`supabase/functions/kiwify-webhook/index.ts`](../../supabase/functions/kiwify-webhook/index.ts)
   deste repositório (no GitHub, botão **Raw** ou o ícone de copiar), copie **tudo** e cole no editor.
4. Clique em **Deploy function**.

### 2.2 Desligar a verificação de login da função
A Kiwify não faz login no Supabase; quem confere a origem é o token do webhook.
Na função `kiwify-webhook` → **Details** (ou **Settings**) → desligue **Enforce JWT verification**
(em algumas versões: **Verify JWT**) → **Save**.

### 2.3 Guardar o token da Kiwify
Depois da etapa 3.2 (quando a Kiwify mostrar o token): **Edge Functions** → **Secrets** →
**Add new secret**:

| Name | Value |
| --- | --- |
| `KIWIFY_WEBHOOK_TOKEN` | o token do webhook da Kiwify (item 5) |

`SUPABASE_URL` e `SUPABASE_SERVICE_ROLE_KEY` o Supabase já entrega à função. Não precisa criar.

### 2.4 Endereço da função
É ele que vai na Kiwify: `https://SEU-PROJETO.supabase.co/functions/v1/kiwify-webhook`
(troque `SEU-PROJETO` pelo código do item 1).

> **Quando o código mudar** (por exemplo, preço ou plano novo): repita a etapa 2.1, colando o arquivo
> novo por cima e clicando em **Deploy** de novo. Eu aviso quando for preciso.

---

## Etapa 3 · Kiwify (pagamento)

### 3.1 Criar os planos de assinatura
1. Kiwify → **Produtos** → **Criar produto** → tipo **Assinatura** (cobrança recorrente).
2. Crie um produto por plano do site, **com o nome do plano no título**:
   - `Conformidade IBS/CBS · Essencial`: plano **Mensal** R$ 197 e plano **Anual** R$ 1.970
   - `Conformidade IBS/CBS · Profissional`: Mensal R$ 297 e Anual R$ 2.970
   - `Conformidade IBS/CBS · Premium`: Mensal R$ 597 e Anual R$ 5.970

   (Os valores são os de `site/config/planos.ts`. Se mudar preço, me avise para atualizar o site também.)
3. Em **Área de membros / Entrega**, **não** use a área de membros da Kiwify: a entrega é o nosso site.
   Se pedir um link de acesso, use `https://seudominio.com.br/entrar`.
4. Em cada produto, em **Configurações → Checkout → Página de obrigado** (ou "Redirecionar após a
   compra"), coloque `https://seudominio.com.br/entrar.html?compra=ok`. O cliente volta para o site
   e vê "Compra recebida, obrigado!".
5. Copie o **link de checkout** de cada plano (formato `https://pay.kiwify.com.br/AbC123x`) → **item 4**.
   Me mande indicando qual é qual (Essencial mensal, Essencial anual...).

### 3.2 Criar o webhook
1. Kiwify → **Apps** → **Webhooks** → **Criar webhook**.
2. Preencha:
   - **Nome**: `Site - liberar acesso`
   - **URL**: o endereço da etapa 2.4
   - **Produtos**: todos os três (ou "Todos os produtos")
   - **Eventos/gatilhos**: marque **todos**: Compra aprovada, Assinatura renovada, Assinatura atrasada,
     Assinatura cancelada, Reembolso, Chargeback, Pix gerado, Boleto gerado.
3. Salve. A Kiwify mostra um **Token** do webhook → **item 5**. Cole na etapa 2.3.

---

## Etapa 4 · Colocar os dados no site

Me mande os itens 1 a 4. Eu coloco em `site/config/integracoes.ts` e `site/config/planos.ts` e
publico. Se preferir fazer por conta própria, os campos estão no começo de cada arquivo, entre aspas:

```ts
const SUPABASE_URL = "https://abcdefgh.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_...";
const SITE_URL = "https://seudominio.com.br";
```

Enquanto esses três campos estiverem vazios, as telas de login avisam que a integração está pendente.

---

## Etapa 5 · Hostinger (publicar o site)

O GitHub monta o site sozinho a cada atualização e guarda o resultado pronto na branch **`hostinger`**
do repositório. A Hostinger só precisa puxar essa branch.

> A branch `hostinger` aparece depois que as mudanças entram na branch principal do repositório
> (depois do merge). Para conferir: GitHub → aba **Actions** → "Site para a Hostinger" com ✔ verde.

### 5.1 Ligar o repositório (uma vez)
1. hPanel → **Sites** → **Gerenciar** (no seu domínio) → **Avançado** → **GIT**.
2. A pasta `public_html` precisa estar vazia: em **Arquivos → Gerenciador de arquivos**, apague o
   `default.php` (ou o que estiver lá) antes.
3. Repositório privado? Na mesma tela do GIT, copie a **chave SSH** que a Hostinger mostra e cole no
   GitHub: repositório → **Settings** → **Deploy keys** → **Add deploy key** (deixe "Allow write access"
   desmarcado).
4. Em **Criar um novo repositório**:
   - **Repositório**: `git@github.com:nilvarodriguescota-source/conformidade-IBS-CBS.git`
   - **Branch**: `hostinger`
   - **Diretório**: deixe em branco (vai para `public_html`)
   - Clique em **Criar**.
5. Clique em **Implantar** (Deploy). O site entra no ar.

### 5.2 Atualizar sozinho a cada mudança
1. Na mesma tela do GIT, em **Implantação automática**, clique em **Configurar** e copie a **URL do webhook**.
2. GitHub → repositório → **Settings** → **Webhooks** → **Add webhook**:
   - **Payload URL**: a URL copiada
   - **Content type**: `application/json`
   - **Which events**: *Just the push event* → **Add webhook**.

### 5.3 HTTPS
hPanel → **Segurança** → **SSL**: instale o SSL gratuito (se ainda não estiver) e ligue **Forçar HTTPS**.

**Sem usar o Git (alternativa):** GitHub → **Actions** → última execução de "Site para a Hostinger" →
baixe **site-para-hostinger** (.zip) → hPanel → **Gerenciador de arquivos** → `public_html` →
**Enviar** o .zip → **Extrair**. O arquivo `.htaccess` precisa ir junto (ele é oculto; no Gerenciador,
ative "mostrar arquivos ocultos" para conferir).

---

## Etapa 6 · Testar com uma compra real
1. Na Kiwify, crie um **cupom de 100%** (ou use o menor valor possível) e compre um plano com um
   e-mail seu.
2. Em até 1 minuto deve chegar o e-mail **"Seu acesso ao Conformidade IBS/CBS está liberado"**.
3. Clique, crie a senha: você cai em **Minha conta**, com o plano, a assinatura ativa e
   "0 de 2.000 XMLs usados neste mês".
4. Abra uma janela anônima e tente `https://seudominio.com.br/sistema`: deve mandar para o login.
5. Na Kiwify, reembolse a compra de teste: o acesso deve ser encerrado.

**Se algo não funcionar**, olhe nesta ordem:
- Kiwify → Webhooks → histórico de envios: o status deve ser **200**. `401` = token errado nos segredos
  da função; `500` = token não cadastrado ou tabelas não criadas; `404` = nome da função diferente de `kiwify-webhook`.
- Supabase → **Edge Functions** → `kiwify-webhook` → **Logs**: mostra cada aviso recebido.
- Supabase → **Table Editor** → `kiwify_eventos`: cada aviso aparece com o payload e o **resultado**
  (ex.: `ok: ativa; plano essencial/mensal por link; convite enviado`). Se aparecer
  `PLANO NÃO IDENTIFICADO`, o acesso foi liberado no plano Profissional: confira os links ou os nomes dos produtos.
- Supabase → **Authentication** → **Users**: o comprador deve estar lá como *Invited*.
- E-mail não chegou: confira o SMTP (etapa 1.6) e a caixa de spam. Em **Authentication → Users**,
  os três pontinhos do usuário → **Send magic link** reenvia o acesso.

---

## No dia a dia

- **Liberar acesso sem compra** (cortesia, parceiro): Supabase → **Authentication → Users → Invite user**
  com o e-mail; depois rode no SQL Editor o `insert` comentado no fim de `sql/supabase.sql`.
- **Aumentar o limite de XMLs de um cliente**: Supabase → **Table Editor** → `assinaturas` → linha do
  e-mail → mude `limite_xmls_mes` (vazio = sem limite). A próxima compra ou renovação volta ao limite do plano.
- **Ver quanto cada cliente usou**: SQL Editor →
  `select email, mes, count(*) from uso_xmls group by 1, 2 order by 2 desc, 3 desc;`
- **Cliente quer cancelar**: ele cancela pelo e-mail da Kiwify ou você cancela no painel da Kiwify.
  O site recebe o aviso e mantém o acesso até o fim do período pago.
- **Cliente quer trocar de plano**: a área do cliente orienta a falar com o suporte. Você cancela a
  assinatura antiga na Kiwify e manda o link do plano novo.
- **Cliente quer excluir a conta (LGPD)**: Supabase → **Authentication → Users** → excluir o usuário,
  e **Table Editor** → apagar as linhas do e-mail em `assinaturas`, `pagamentos` e `uso_xmls`.
- **Um e-mail = uma assinatura.** O login é o e-mail usado na compra. Se o cliente comprar com outro
  e-mail, ele terá outra conta.

## Limites conhecidos
- O sistema de XML roda no navegador e o site é só de arquivos (Hostinger). O bloqueio de quem não
  assina e o limite de XMLs são conferidos no navegador, com a contagem guardada no banco. Para o
  cliente comum, o acesso e o limite valem de fato; um curioso técnico consegue montar o sistema fora
  do site, porque os arquivos de código (`navegador.js`, `worker.js`) são públicos.
- O limite conta as notas de **venda** analisadas (as mesmas que o sistema confere: sem entradas,
  devoluções, canceladas e repetidas). Para o banco vai só um código anônimo de cada nota, nunca o XML
  nem a chave de acesso.
- Os nomes dos campos do webhook seguem o formato público da Kiwify. Se a Kiwify mudar algo, o
  payload fica gravado em `kiwify_eventos` e o ajuste é em `webhook/kiwify.ts`.
