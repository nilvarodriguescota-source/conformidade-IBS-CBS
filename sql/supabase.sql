-- Tabelas do login e da assinatura (Supabase). Colar inteiro no SQL Editor do Supabase e clicar em Run.
-- Pode rodar de novo sem perder dados.
--
-- Quem grava: só o webhook da Kiwify (netlify/functions/kiwify-webhook.mts), com a chave secreta.
-- Quem lê: o cliente logado, e só a linha do próprio e-mail (RLS).

create table if not exists public.assinaturas (
  email                 text primary key check (email = lower(email)),
  plano_id              text not null,
  ciclo                 text not null check (ciclo in ('mensal', 'anual')),
  status                text not null check (status in ('pendente_pagamento', 'ativa', 'em_atraso', 'cancelada')),
  criada_em             timestamptz not null default now(),
  inicio_periodo        timestamptz,
  fim_periodo           timestamptz,
  cancelada_em          timestamptz,
  forma_pagamento       text check (forma_pagamento in ('cartao', 'pix', 'boleto')),
  origem                text not null default 'kiwify',
  kiwify_assinatura_id  text,
  kiwify_pedido_id      text,
  atualizada_em         timestamptz not null default now()
);

create table if not exists public.pagamentos (
  id               text primary key,               -- order_id da Kiwify
  email            text not null check (email = lower(email)),
  data             timestamptz not null,
  descricao        text not null,
  valor            numeric(12, 2) not null,
  status           text not null check (status in ('pago', 'pendente', 'falhou', 'estornado')),
  url_comprovante  text
);
create index if not exists pagamentos_email_data on public.pagamentos (email, data desc);

-- Registro de cada aviso da Kiwify, com o payload completo: idempotência e conferência.
create table if not exists public.kiwify_eventos (
  chave        text primary key,
  tipo         text,
  email        text,
  recebido_em  timestamptz not null default now(),
  payload      jsonb not null,
  resultado    text
);
create index if not exists kiwify_eventos_recebido on public.kiwify_eventos (recebido_em desc);

alter table public.assinaturas    enable row level security;
alter table public.pagamentos     enable row level security;
alter table public.kiwify_eventos enable row level security;  -- sem política: só a chave secreta lê/grava

drop policy if exists "cliente lê a própria assinatura" on public.assinaturas;
create policy "cliente lê a própria assinatura" on public.assinaturas
  for select to authenticated using (email = lower(auth.jwt() ->> 'email'));

drop policy if exists "cliente lê os próprios pagamentos" on public.pagamentos;
create policy "cliente lê os próprios pagamentos" on public.pagamentos
  for select to authenticated using (email = lower(auth.jwt() ->> 'email'));

revoke all on public.assinaturas, public.pagamentos, public.kiwify_eventos from anon, authenticated;
grant select on public.assinaturas, public.pagamentos to authenticated;
grant all on public.assinaturas, public.pagamentos, public.kiwify_eventos to service_role;

-- Liberar acesso manualmente (cortesia, teste ou venda fora da Kiwify): troque o e-mail e rode.
-- insert into public.assinaturas (email, plano_id, ciclo, status, inicio_periodo, fim_periodo, origem)
-- values ('cliente@empresa.com.br', 'profissional', 'mensal', 'ativa', now(), now() + interval '1 month', 'manual')
-- on conflict (email) do update set status = 'ativa', fim_periodo = excluded.fim_periodo, atualizada_em = now();
