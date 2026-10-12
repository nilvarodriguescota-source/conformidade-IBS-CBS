/**
 * Regras do webhook da Kiwify, sem acesso a rede nem a banco (testáveis isoladamente).
 *
 * A Kiwify manda um JSON por evento de venda ou assinatura e assina o corpo com HMAC-SHA1
 * (chave = token do webhook), no parâmetro `?signature=` do endereço.
 * Campos usados (os nomes vêm da Kiwify; os ausentes são tolerados):
 *   webhook_event_type, order_id, order_status, payment_method, approved_date, created_at,
 *   checkout_link, subscription_id, Customer{email, full_name, mobile, CPF, cnpj},
 *   Product{product_id, product_name}, Subscription{status, start_date, next_payment, plan{id, name, frequency}},
 *   Commissions{charge_amount (centavos), product_base_price}.
 * O payload completo de cada evento fica gravado em kiwify_eventos para conferência.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { configuracaoPlanos, type Plano } from "../../site/config/planos.js";
import type { CicloCobranca, FormaPagamento, StatusAssinatura } from "../../site/servicos/tipos.js";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type PayloadKiwify = Record<string, any>;

function iguais(a: string, b: string): boolean {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}

/**
 * Confere a origem: assinatura HMAC-SHA1 (corpo cru ou JSON reserializado, como a Kiwify calcula)
 * ou, como alternativa, `?token=` igual ao token configurado.
 */
export function origemValida(corpoCru: string, assinatura: string | null, tokenNaUrl: string | null, token: string): boolean {
  if (!token) return false;
  if (tokenNaUrl && iguais(tokenNaUrl, token)) return true;
  if (!assinatura) return false;
  const hmac = (texto: string) => createHmac("sha1", token).update(texto).digest("hex");
  if (iguais(assinatura, hmac(corpoCru))) return true;
  try {
    return iguais(assinatura, hmac(JSON.stringify(JSON.parse(corpoCru))));
  } catch {
    return false;
  }
}

/** Alguns envios embrulham a venda em { order: {...} }. */
export function desembrulhar(corpo: PayloadKiwify): PayloadKiwify {
  return corpo && typeof corpo.order === "object" && corpo.order && !corpo.webhook_event_type ? corpo.order : corpo;
}

function semAcento(t: unknown): string {
  return String(t ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** Código do link de checkout: https://pay.kiwify.com.br/AbC123x → "abc123x". */
export function codigoDoLink(link: string | null | undefined): string | null {
  if (!link) return null;
  const limpo = String(link).trim().replace(/[?#].*$/, "").replace(/\/+$/, "");
  const codigo = limpo.split("/").pop();
  return codigo ? codigo.toLowerCase() : null;
}

export function cicloDoPayload(p: PayloadKiwify): CicloCobranca | null {
  const f = semAcento(p.Subscription?.plan?.frequency ?? p.Subscription?.frequency ?? "");
  if (/year|annual|anual|ano/.test(f)) return "anual";
  if (/month|mensal|mes/.test(f)) return "mensal";
  const nome = semAcento(`${p.Subscription?.plan?.name ?? ""} ${p.Product?.product_name ?? ""}`);
  if (/anual|annual|yearly/.test(nome)) return "anual";
  if (/mensal|monthly/.test(nome)) return "mensal";
  return null;
}

/**
 * Descobre plano e ciclo comprados, nesta ordem:
 *  1. código do link de checkout (configurado em site/config/planos.ts → kiwify);
 *  2. nome do plano/produto na Kiwify contendo o nome do plano do site ("Essencial", "Profissional"...);
 *  3. valor cobrado igual ao preço mensal ou anual de um plano.
 */
export function identificarPlano(p: PayloadKiwify, planos: Plano[] = configuracaoPlanos.planos): { plano: Plano; ciclo: CicloCobranca; criterio: string } | null {
  const codigo = codigoDoLink(p.checkout_link);
  if (codigo) {
    for (const plano of planos) {
      if (codigoDoLink(plano.kiwify.linkMensal) === codigo) return { plano, ciclo: "mensal", criterio: "link" };
      if (codigoDoLink(plano.kiwify.linkAnual) === codigo) return { plano, ciclo: "anual", criterio: "link" };
    }
  }
  const ciclo = cicloDoPayload(p);
  const nomes = semAcento(`${p.Subscription?.plan?.name ?? ""} ${p.Product?.product_name ?? ""}`);
  const porNome = planos.find((pl) => nomes.includes(semAcento(pl.nome)));
  if (porNome) return { plano: porNome, ciclo: ciclo ?? "mensal", criterio: "nome" };

  const centavos = Number(p.Commissions?.product_base_price ?? p.Commissions?.charge_amount ?? NaN);
  if (Number.isFinite(centavos) && centavos > 0) {
    for (const plano of planos) {
      if (plano.precoMensal != null && Math.round(plano.precoMensal * 100) === centavos && ciclo !== "anual") return { plano, ciclo: "mensal", criterio: "valor" };
      if (plano.precoAnual != null && Math.round(plano.precoAnual * 100) === centavos && ciclo !== "mensal") return { plano, ciclo: "anual", criterio: "valor" };
    }
  }
  return null;
}

export function formaDePagamento(p: PayloadKiwify): FormaPagamento | null {
  const m = semAcento(p.payment_method);
  if (m.includes("pix")) return "pix";
  if (m.includes("boleto") || m.includes("billet")) return "boleto";
  if (m.includes("card") || m.includes("cartao") || m.includes("credit")) return "cartao";
  return null;
}

function data(valor: unknown): string | null {
  if (!valor) return null;
  // A Kiwify manda "2026-10-12 14:03" (horário de Brasília) ou ISO
  const texto = String(valor).trim();
  const iso = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(texto) ? `${texto.replace(" ", "T")}-03:00` : texto;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

function somarCiclo(inicioIso: string, ciclo: CicloCobranca): string {
  const d = new Date(inicioIso);
  if (ciclo === "anual") d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}

/** O que o evento faz com a assinatura. */
export type Efeito =
  /** Pagamento confirmado (compra ou renovação): acesso liberado e convite enviado se for o primeiro acesso. */
  | "ativar"
  /** Pix ou boleto gerado: registra a intenção sem liberar nada. */
  | "pendente"
  /** Cobrança recorrente falhou: acesso mantido com aviso. */
  | "atraso"
  /** Assinatura cancelada: acesso até o fim do período pago. */
  | "cancelar"
  /** Reembolso ou chargeback: acesso encerrado na hora. */
  | "encerrar"
  | "ignorar";

export function efeitoDoEvento(p: PayloadKiwify): Efeito {
  const evento = semAcento(p.webhook_event_type);
  const status = semAcento(p.order_status);
  switch (evento) {
    case "order_approved":
    case "subscription_renewed":
      return "ativar";
    case "billet_created":
    case "pix_created":
      return "pendente";
    case "subscription_late":
      return "atraso";
    case "subscription_canceled":
      return "cancelar";
    case "order_refunded":
    case "chargeback":
      return "encerrar";
  }
  // Sem tipo de evento (envios antigos/testes): decide pelo status do pedido
  if (status === "paid" || status === "approved") return "ativar";
  if (status === "waiting_payment") return "pendente";
  if (status === "refunded" || status === "chargedback") return "encerrar";
  return "ignorar";
}

export interface DadosCliente {
  email: string;
  nome: string | null;
  telefone: string | null;
  cnpj: string | null;
}

export function clienteDoPayload(p: PayloadKiwify): DadosCliente | null {
  const c = p.Customer ?? p.customer ?? {};
  const email = String(c.email ?? "").trim().toLowerCase();
  if (!email.includes("@")) return null;
  const texto = (v: unknown) => (typeof v === "string" && v.trim() ? v.trim() : null);
  return { email, nome: texto(c.full_name) ?? texto(c.first_name), telefone: texto(c.mobile), cnpj: texto(c.cnpj) };
}

/** Linha da tabela `assinaturas` (só os campos que o evento altera). */
export interface AlteracaoAssinatura {
  email: string;
  plano_id?: string;
  ciclo?: CicloCobranca;
  status: StatusAssinatura;
  inicio_periodo?: string | null;
  fim_periodo?: string | null;
  cancelada_em?: string | null;
  forma_pagamento?: FormaPagamento | null;
  origem: "kiwify";
  kiwify_assinatura_id?: string | null;
  kiwify_pedido_id?: string | null;
  atualizada_em: string;
}

export interface AssinaturaAtual {
  status: StatusAssinatura;
  fim_periodo: string | null;
}

/**
 * Traduz o evento numa alteração da assinatura. `atual` é a linha que já existe para o e-mail
 * (null quando é a primeira compra). Devolve null quando o evento não deve mudar nada.
 */
export function alteracaoDaAssinatura(
  p: PayloadKiwify,
  email: string,
  atual: AssinaturaAtual | null,
  agora = new Date(),
): { alteracao: AlteracaoAssinatura; plano: { plano: Plano; ciclo: CicloCobranca; criterio: string } | null } | null {
  const efeito = efeitoDoEvento(p);
  if (efeito === "ignorar") return null;
  const agoraIso = agora.toISOString();
  const identificado = identificarPlano(p);
  const base: AlteracaoAssinatura = {
    email,
    status: "ativa",
    origem: "kiwify",
    atualizada_em: agoraIso,
    kiwify_assinatura_id: p.subscription_id ?? p.Subscription?.id ?? null,
    kiwify_pedido_id: p.order_id ?? null,
  };
  if (identificado) {
    base.plano_id = identificado.plano.id;
    base.ciclo = identificado.ciclo;
  }
  const forma = formaDePagamento(p);
  if (forma) base.forma_pagamento = forma;

  switch (efeito) {
    case "ativar": {
      const ciclo = identificado?.ciclo ?? "mensal";
      const inicio = data(p.approved_date) ?? data(p.Subscription?.start_date) ?? agoraIso;
      const proxima = data(p.Subscription?.next_payment);
      return {
        plano: identificado,
        alteracao: { ...base, status: "ativa", inicio_periodo: inicio, fim_periodo: proxima && proxima > agoraIso ? proxima : somarCiclo(inicio, ciclo), cancelada_em: null },
      };
    }
    case "pendente":
      // Nunca rebaixa quem já tem acesso (ex.: Pix gerado para a renovação de uma assinatura ativa)
      if (atual && atual.status !== "pendente_pagamento") return null;
      return { plano: identificado, alteracao: { ...base, status: "pendente_pagamento", inicio_periodo: null, fim_periodo: null } };
    case "atraso":
      if (!atual) return null;
      return { plano: identificado, alteracao: { ...base, status: "em_atraso" } };
    case "cancelar": {
      if (!atual) return null;
      const fim = atual.fim_periodo ?? data(p.Subscription?.next_payment) ?? agoraIso;
      return { plano: identificado, alteracao: { ...base, status: "cancelada", cancelada_em: agoraIso, fim_periodo: fim } };
    }
    case "encerrar":
      if (!atual) return null;
      return { plano: identificado, alteracao: { ...base, status: "cancelada", cancelada_em: agoraIso, fim_periodo: agoraIso } };
  }
}

/** Registro do histórico de pagamentos (tabela `pagamentos`), quando o evento movimenta dinheiro. */
export function pagamentoDoEvento(p: PayloadKiwify, email: string, nomePlano: string | null): {
  id: string;
  email: string;
  data: string;
  descricao: string;
  valor: number;
  status: "pago" | "pendente" | "estornado";
  url_comprovante: null;
} | null {
  const efeito = efeitoDoEvento(p);
  const pedido = p.order_id ?? p.order_ref;
  if (!pedido || (efeito !== "ativar" && efeito !== "pendente" && efeito !== "encerrar")) return null;
  const status = efeito === "ativar" ? "pago" : efeito === "pendente" ? "pendente" : "estornado";
  const centavos = Number(p.Commissions?.charge_amount ?? p.Commissions?.product_base_price ?? 0);
  const renovacao = semAcento(p.webhook_event_type) === "subscription_renewed";
  return {
    id: `${pedido}`,
    email,
    data: data(p.approved_date) ?? data(p.updated_at) ?? data(p.created_at) ?? new Date().toISOString(),
    descricao: `${nomePlano ? `Plano ${nomePlano}` : String(p.Product?.product_name ?? "Assinatura")}${renovacao ? " · renovação" : ""}${status === "estornado" ? " · estornado" : ""}`,
    valor: Number.isFinite(centavos) ? centavos / 100 : 0,
    status,
    url_comprovante: null,
  };
}

/** Chave de idempotência: a Kiwify reenvia o mesmo evento quando não recebe 200. */
export function chaveDoEvento(p: PayloadKiwify, corpoCru: string): string {
  const pedido = p.order_id ?? p.order_ref ?? "";
  const tipo = p.webhook_event_type ?? p.order_status ?? "";
  if (pedido && tipo) return `${tipo}:${pedido}:${p.Subscription?.charges?.completed?.length ?? ""}:${p.updated_at ?? p.approved_date ?? ""}`;
  return `corpo:${createHmac("sha1", "kiwify").update(corpoCru).digest("hex")}`;
}
