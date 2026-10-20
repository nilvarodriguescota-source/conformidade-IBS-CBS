-- Tabelas do login e da assinatura (Supabase). Colar inteiro no SQL Editor do Supabase e clicar em Run.
-- Pode rodar de novo sem perder dados.
--
-- Quem grava: só o webhook da Kiwify (função kiwify-webhook do Supabase), com a chave secreta.
-- Quem lê: o cliente logado, e só a linha do próprio e-mail (RLS).
-- Contagem de XMLs: só pelas funções registrar_uso_xmls e uso_xmls_do_mes, no fim do arquivo.

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
-- XMLs de venda por mês do plano (null = sem limite). Gravado pelo webhook a partir de site/config/planos.ts.
alter table public.assinaturas add column if not exists limite_xmls_mes integer check (limite_xmls_mes is null or limite_xmls_mes >= 0);

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

-- XMLs de venda analisados por cliente e mês. Guarda só um código anônimo de cada nota (SHA-256 da
-- chave de acesso, calculado no navegador): a nota em si nunca sai do computador do cliente.
-- A mesma nota analisada de novo no mesmo mês não conta duas vezes.
create table if not exists public.uso_xmls (
  email          text not null check (email = lower(email)),
  mes            text not null check (mes ~ '^\d{4}-\d{2}$'),   -- 'AAAA-MM', horário de Brasília
  documento      text not null check (documento ~ '^[0-9a-f]{64}$'),
  registrado_em  timestamptz not null default now(),
  primary key (email, mes, documento)
);

alter table public.assinaturas    enable row level security;
alter table public.pagamentos     enable row level security;
alter table public.kiwify_eventos enable row level security;  -- sem política: só a chave secreta lê/grava
alter table public.uso_xmls       enable row level security;  -- sem política: só pelas funções abaixo

drop policy if exists "cliente lê a própria assinatura" on public.assinaturas;
create policy "cliente lê a própria assinatura" on public.assinaturas
  for select to authenticated using (email = lower(auth.jwt() ->> 'email'));

drop policy if exists "cliente lê os próprios pagamentos" on public.pagamentos;
create policy "cliente lê os próprios pagamentos" on public.pagamentos
  for select to authenticated using (email = lower(auth.jwt() ->> 'email'));

revoke all on public.assinaturas, public.pagamentos, public.kiwify_eventos, public.uso_xmls from anon, authenticated;
grant select on public.assinaturas, public.pagamentos to authenticated;
grant all on public.assinaturas, public.pagamentos, public.kiwify_eventos, public.uso_xmls to service_role;

-- ---------------------------------------------------------------------------------------------
-- Limite de XMLs por mês
--
-- O sistema chama registrar_uso_xmls antes de processar uma análise, com o código de cada nota de
-- venda. Se as notas novas do mês couberem no limite do plano, elas são registradas e a análise
-- segue; se não couberem, nada é registrado e a análise é recusada com os números para a tela.
-- A regra de acesso repete site/servicos/acesso.ts: ativa e em atraso liberam; cancelada libera
-- até o fim do período pago.
-- ---------------------------------------------------------------------------------------------
create or replace function public.mes_de_uso() returns text
language sql stable set search_path = '' as $$
  select to_char(now() at time zone 'America/Sao_Paulo', 'YYYY-MM')
$$;

create or replace function public.registrar_uso_xmls(documentos text[]) returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  v_email   text := lower(coalesce(auth.jwt() ->> 'email', ''));
  v_mes     text := public.mes_de_uso();
  v_ass     public.assinaturas%rowtype;
  v_usados  integer;
  v_novos   integer;
begin
  if v_email = '' then
    return jsonb_build_object('permitido', false, 'motivo', 'sem_sessao');
  end if;
  select * into v_ass from public.assinaturas where email = v_email;
  if not found or not (
       v_ass.status in ('ativa', 'em_atraso')
       or (v_ass.status = 'cancelada' and v_ass.fim_periodo > now())
     ) then
    return jsonb_build_object('permitido', false, 'motivo', 'sem_assinatura');
  end if;
  if documentos is null or cardinality(documentos) > 20000 then
    return jsonb_build_object('permitido', false, 'motivo', 'lista_invalida');
  end if;
  if exists (select 1 from unnest(documentos) d where d is null or d !~ '^[0-9a-f]{64}$') then
    return jsonb_build_object('permitido', false, 'motivo', 'lista_invalida');
  end if;

  -- Uma análise por vez por cliente: duas abas ao mesmo tempo não passam do limite juntas
  perform pg_advisory_xact_lock(hashtext('uso_xmls:' || v_email));

  select count(*) into v_usados from public.uso_xmls where email = v_email and mes = v_mes;
  select count(distinct d) into v_novos
    from unnest(documentos) d
   where not exists (select 1 from public.uso_xmls u where u.email = v_email and u.mes = v_mes and u.documento = d);

  if v_ass.limite_xmls_mes is not null and v_usados + v_novos > v_ass.limite_xmls_mes then
    return jsonb_build_object('permitido', false, 'motivo', 'limite', 'mes', v_mes,
      'usados', v_usados, 'novos', v_novos, 'limite', v_ass.limite_xmls_mes, 'plano', v_ass.plano_id);
  end if;

  insert into public.uso_xmls (email, mes, documento)
  select distinct v_email, v_mes, d from unnest(documentos) d
  on conflict do nothing;

  return jsonb_build_object('permitido', true, 'mes', v_mes,
    'usados', v_usados + v_novos, 'novos', v_novos, 'limite', v_ass.limite_xmls_mes, 'plano', v_ass.plano_id);
end
$$;

create or replace function public.uso_xmls_do_mes() returns jsonb
language sql stable security definer set search_path = '' as $$
  select jsonb_build_object(
    'mes', public.mes_de_uso(),
    'usados', (select count(*) from public.uso_xmls u
                where u.email = lower(auth.jwt() ->> 'email') and u.mes = public.mes_de_uso()),
    'limite', (select a.limite_xmls_mes from public.assinaturas a where a.email = lower(auth.jwt() ->> 'email'))
  )
$$;

revoke all on function public.registrar_uso_xmls(text[]), public.uso_xmls_do_mes() from public, anon;
grant execute on function public.registrar_uso_xmls(text[]), public.uso_xmls_do_mes() to authenticated;

-- Liberar acesso manualmente (cortesia, teste ou venda fora da Kiwify): troque o e-mail e rode.
-- limite_xmls_mes: 2000 (Essencial), 5000 (Profissional), 10000 (Premium) ou null (sem limite).
-- insert into public.assinaturas (email, plano_id, ciclo, status, inicio_periodo, fim_periodo, origem, limite_xmls_mes)
-- values ('cliente@empresa.com.br', 'profissional', 'mensal', 'ativa', now(), now() + interval '1 month', 'manual', 5000)
-- on conflict (email) do update set status = 'ativa', fim_periodo = excluded.fim_periodo,
--   limite_xmls_mes = excluded.limite_xmls_mes, atualizada_em = now();
