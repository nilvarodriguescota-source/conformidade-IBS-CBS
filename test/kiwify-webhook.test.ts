/**
 * Webhook da Kiwify: origem do aviso, plano comprado e efeito de cada evento na assinatura.
 */
import test from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import {
  alteracaoDaAssinatura,
  clienteDoPayload,
  codigoDoLink,
  desembrulhar,
  efeitoDoEvento,
  identificarPlano,
  origemValida,
  pagamentoDoEvento,
} from "../netlify/lib/kiwify.js";
import { configuracaoPlanos, type Plano } from "../site/config/planos.js";

const TOKEN = "tok123";
const assinar = (corpo: string) => createHmac("sha1", TOKEN).update(corpo).digest("hex");

function compra(extra: Record<string, unknown> = {}) {
  return {
    order_id: "ord-1",
    order_status: "paid",
    webhook_event_type: "order_approved",
    payment_method: "credit_card",
    approved_date: "2026-10-12 10:00",
    subscription_id: "sub-1",
    Product: { product_id: "p1", product_name: "Conformidade IBS/CBS" },
    Customer: { full_name: "Maria Silva", email: "Maria@Empresa.com.br ", mobile: "+5548999999999" },
    Subscription: { status: "active", next_payment: "2026-11-12 10:00", plan: { id: "pl1", name: "Profissional Mensal", frequency: "monthly" } },
    Commissions: { charge_amount: 29700, product_base_price: 29700 },
    ...extra,
  };
}

const planosComLinks: Plano[] = configuracaoPlanos.planos.map((p) => ({
  ...p,
  kiwify: { linkMensal: `https://pay.kiwify.com.br/${p.id}M`, linkAnual: `https://pay.kiwify.com.br/${p.id}A` },
}));

test("origem: aceita HMAC-SHA1 do corpo, do JSON reserializado ou token na URL; recusa o resto", () => {
  const corpo = JSON.stringify(compra());
  const comEspacos = JSON.stringify(compra(), null, 2);
  assert.equal(origemValida(corpo, assinar(corpo), null, TOKEN), true);
  assert.equal(origemValida(comEspacos, assinar(corpo), null, TOKEN), true);
  assert.equal(origemValida(corpo, null, TOKEN, TOKEN), true);
  assert.equal(origemValida(corpo, assinar(corpo + "x"), null, TOKEN), false);
  assert.equal(origemValida(corpo, null, "outro", TOKEN), false);
  assert.equal(origemValida(corpo, assinar(corpo), null, ""), false);
});

test("plano: pelo código do link, depois pelo nome, depois pelo valor", () => {
  assert.equal(codigoDoLink("https://pay.kiwify.com.br/AbC12?x=1"), "abc12");
  const porLink = identificarPlano(compra({ checkout_link: "premiumA" }), planosComLinks);
  assert.deepEqual([porLink?.plano.id, porLink?.ciclo, porLink?.criterio], ["premium", "anual", "link"]);

  const porNome = identificarPlano(compra(), planosComLinks);
  assert.deepEqual([porNome?.plano.id, porNome?.ciclo, porNome?.criterio], ["profissional", "mensal", "nome"]);

  const porValor = identificarPlano(compra({ Subscription: { plan: { name: "Plano X", frequency: "yearly" } }, Commissions: { product_base_price: 149000 } }));
  assert.deepEqual([porValor?.plano.id, porValor?.ciclo, porValor?.criterio], ["essencial", "anual", "valor"]);

  assert.equal(identificarPlano(compra({ Subscription: {}, Product: { product_name: "Outro" }, Commissions: { charge_amount: 1 } })), null);
});

test("cliente: e-mail normalizado; sem e-mail não há cliente", () => {
  assert.deepEqual(clienteDoPayload(compra()), { email: "maria@empresa.com.br", nome: "Maria Silva", telefone: "+5548999999999", cnpj: null });
  assert.equal(clienteDoPayload(compra({ Customer: { email: "" } })), null);
  assert.equal(desembrulhar({ order: compra() }).order_id, "ord-1");
});

test("compra aprovada ativa com o período até o próximo pagamento", () => {
  const r = alteracaoDaAssinatura(compra(), "maria@empresa.com.br", null, new Date("2026-10-12T13:05:00Z"));
  assert.equal(r?.alteracao.status, "ativa");
  assert.equal(r?.alteracao.plano_id, "profissional");
  assert.equal(r?.alteracao.forma_pagamento, "cartao");
  assert.equal(r?.alteracao.inicio_periodo, "2026-10-12T13:00:00.000Z");
  assert.equal(r?.alteracao.fim_periodo, "2026-11-12T13:00:00.000Z");
});

test("efeitos: Pix gerado não rebaixa assinatura ativa; atraso, cancelamento e reembolso", () => {
  const agora = new Date("2026-10-20T12:00:00Z");
  const ativa = { status: "ativa" as const, fim_periodo: "2026-11-12T13:00:00.000Z" };
  assert.equal(efeitoDoEvento(compra({ webhook_event_type: "pix_created" })), "pendente");
  assert.equal(alteracaoDaAssinatura(compra({ webhook_event_type: "pix_created" }), "m@e.com", ativa, agora), null);
  assert.equal(alteracaoDaAssinatura(compra({ webhook_event_type: "pix_created" }), "m@e.com", null, agora)?.alteracao.status, "pendente_pagamento");

  assert.equal(alteracaoDaAssinatura(compra({ webhook_event_type: "subscription_late" }), "m@e.com", ativa, agora)?.alteracao.status, "em_atraso");

  const cancelada = alteracaoDaAssinatura(compra({ webhook_event_type: "subscription_canceled" }), "m@e.com", ativa, agora)?.alteracao;
  assert.equal(cancelada?.status, "cancelada");
  assert.equal(cancelada?.fim_periodo, ativa.fim_periodo, "mantém o acesso até o fim do período pago");

  const reembolso = alteracaoDaAssinatura(compra({ webhook_event_type: "order_refunded" }), "m@e.com", ativa, agora)?.alteracao;
  assert.equal(reembolso?.status, "cancelada");
  assert.equal(reembolso?.fim_periodo, agora.toISOString(), "reembolso encerra na hora");

  assert.equal(alteracaoDaAssinatura(compra({ webhook_event_type: "order_rejected", order_status: "refused" }), "m@e.com", ativa, agora), null);
});

test("pagamento: registra valor em reais e marca estorno", () => {
  assert.deepEqual(
    [pagamentoDoEvento(compra(), "m@e.com", "Profissional")?.valor, pagamentoDoEvento(compra(), "m@e.com", "Profissional")?.status],
    [297, "pago"],
  );
  assert.equal(pagamentoDoEvento(compra({ webhook_event_type: "chargeback" }), "m@e.com", null)?.status, "estornado");
  assert.equal(pagamentoDoEvento(compra({ webhook_event_type: "subscription_late" }), "m@e.com", null), null);
});
