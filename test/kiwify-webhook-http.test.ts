/**
 * Webhook da Kiwify de ponta a ponta, com um Supabase falso em memória (REST e convite):
 * token, gravação da assinatura com o limite de XMLs, convite, repetição e reembolso.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { tratarWebhook, type ConfiguracaoWebhook } from "../webhook/processar.js";

const TOKEN = "token-da-kiwify";
const cfg: ConfiguracaoWebhook = { tokenKiwify: TOKEN, supabaseUrl: "https://projeto.supabase.co", chaveServico: "sb_secret_x", siteUrl: "https://site.com.br" };

type Linha = Record<string, unknown>;

/** Só o pedaço do PostgREST e do Auth que o webhook usa. */
function supabaseFalso() {
  const tabelas = { assinaturas: [] as Linha[], pagamentos: [] as Linha[], kiwify_eventos: [] as Linha[] };
  const chaves: Record<string, string> = { assinaturas: "email", pagamentos: "id", kiwify_eventos: "chave" };
  const convites: Array<{ email: string; redirect: string | null }> = [];
  const http = async (entrada: string | URL | Request, init?: RequestInit): Promise<Response> => {
    const url = new URL(String(entrada));
    const h = new Headers(init?.headers);
    assert.equal(h.get("apikey"), cfg.chaveServico, "usa a chave secreta");
    const corpo = init?.body ? (JSON.parse(String(init.body)) as Linha) : null;
    if (url.pathname === "/auth/v1/invite") {
      if (convites.some((c) => c.email === corpo!.email)) return new Response(JSON.stringify({ error_code: "email_exists", msg: "already registered" }), { status: 422 });
      convites.push({ email: String(corpo!.email), redirect: url.searchParams.get("redirect_to") });
      return new Response("{}");
    }
    const tabela = url.pathname.replace("/rest/v1/", "");
    const linhas = tabelas[tabela as keyof typeof tabelas];
    const chave = chaves[tabela]!;
    const filtro = [...url.searchParams].find(([k]) => k === chave);
    const valor = filtro ? filtro[1].replace(/^eq\./, "") : null;
    switch (init?.method) {
      case "GET":
        return new Response(JSON.stringify(linhas.filter((l) => l[chave] === valor).slice(0, 1)));
      case "POST": {
        const i = linhas.findIndex((l) => l[chave] === corpo![chave]);
        if (i >= 0 && !(h.get("prefer") ?? "").includes("merge-duplicates")) return new Response(JSON.stringify({ message: "duplicate key" }), { status: 409 });
        if (i >= 0) linhas[i] = { ...linhas[i], ...corpo };
        else linhas.push({ ...corpo });
        return new Response("", { status: 201 });
      }
      case "PATCH":
        for (const l of linhas) if (l[chave] === valor) Object.assign(l, corpo);
        return new Response(null, { status: 204 });
    }
    return new Response("", { status: 400 });
  };
  return { tabelas, convites, http: http as typeof fetch };
}

function compra(extra: Record<string, unknown> = {}) {
  return {
    order_id: "ord-77",
    order_status: "paid",
    webhook_event_type: "order_approved",
    payment_method: "pix",
    approved_date: "2026-10-20 10:00",
    subscription_id: "sub-77",
    Product: { product_id: "p1", product_name: "Conformidade IBS/CBS · Essencial" },
    Customer: { full_name: "Ana Souza", email: "Ana@Padaria.com.br", mobile: "+5548988887777" },
    Subscription: { status: "active", next_payment: "2026-11-20 10:00", plan: { id: "pl1", name: "Essencial Mensal", frequency: "monthly" } },
    Commissions: { charge_amount: 19700, product_base_price: 19700 },
    ...extra,
  };
}

/** Como a Kiwify manda: corpo JSON e ?signature= com HMAC-SHA1 do corpo, chave = token. */
function aviso(payload: object, token = TOKEN): Request {
  const corpo = JSON.stringify(payload);
  const assinatura = createHmac("sha1", token).update(corpo).digest("hex");
  return new Request(`https://projeto.supabase.co/functions/v1/kiwify-webhook?signature=${assinatura}`, { method: "POST", body: corpo });
}

test("webhook: compra aprovada cria a assinatura com o limite do plano e manda o convite", async () => {
  const sb = supabaseFalso();
  const r = await tratarWebhook(aviso(compra()), cfg, sb.http);
  assert.equal(r.status, 200);
  const [assinatura] = sb.tabelas.assinaturas;
  assert.equal(assinatura?.email, "ana@padaria.com.br");
  assert.equal(assinatura?.status, "ativa");
  assert.equal(assinatura?.plano_id, "essencial");
  assert.equal(assinatura?.limite_xmls_mes, 2000);
  assert.equal(sb.tabelas.pagamentos[0]?.valor, 197);
  assert.deepEqual(sb.convites, [{ email: "ana@padaria.com.br", redirect: "https://site.com.br/definir-senha.html" }]);
  assert.match(String(sb.tabelas.kiwify_eventos[0]?.resultado), /^ok: ativa; plano essencial\/mensal por nome; convite enviado$/);
});

test("webhook: token errado é recusado e nada é gravado", async () => {
  const sb = supabaseFalso();
  const r = await tratarWebhook(aviso(compra(), "outro-token"), cfg, sb.http);
  assert.equal(r.status, 401);
  assert.equal(sb.tabelas.kiwify_eventos.length + sb.tabelas.assinaturas.length, 0);
});

test("webhook: aviso repetido não é processado de novo; renovação de quem já tem conta não reenvia convite", async () => {
  const sb = supabaseFalso();
  await tratarWebhook(aviso(compra()), cfg, sb.http);
  const repetido = await tratarWebhook(aviso(compra()), cfg, sb.http);
  assert.deepEqual(await repetido.json(), { ok: true, repetido: true });
  const renovacao = await tratarWebhook(aviso(compra({ webhook_event_type: "subscription_renewed", order_id: "ord-78" })), cfg, sb.http);
  assert.equal(renovacao.status, 200);
  assert.equal(sb.convites.length, 1);
  assert.match(String(sb.tabelas.kiwify_eventos.at(-1)?.resultado), /conta já existia/);
});

test("webhook: reembolso encerra o acesso na hora", async () => {
  const sb = supabaseFalso();
  await tratarWebhook(aviso(compra()), cfg, sb.http);
  await tratarWebhook(aviso(compra({ webhook_event_type: "order_refunded", order_status: "refunded" })), cfg, sb.http);
  const [assinatura] = sb.tabelas.assinaturas;
  assert.equal(assinatura?.status, "cancelada");
  assert.ok(new Date(String(assinatura?.fim_periodo)) <= new Date());
  assert.equal(sb.tabelas.pagamentos[0]?.status, "estornado");
});

test("webhook: sem token configurado responde 500 (a Kiwify reenvia depois)", async () => {
  const r = await tratarWebhook(aviso(compra()), { ...cfg, tokenKiwify: "" }, supabaseFalso().http);
  assert.equal(r.status, 500);
});
