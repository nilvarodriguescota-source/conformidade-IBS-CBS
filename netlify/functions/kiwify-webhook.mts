/**
 * Webhook da Kiwify → libera, renova ou encerra o acesso no Supabase e cria o login do comprador.
 *
 * Endereço para cadastrar na Kiwify: https://SEU-SITE/api/kiwify
 * Variáveis de ambiente (Netlify → Site configuration → Environment variables):
 *   KIWIFY_WEBHOOK_TOKEN       token mostrado pela Kiwify ao criar o webhook
 *   SUPABASE_URL               https://xxxx.supabase.co
 *   SUPABASE_SERVICE_ROLE_KEY  chave secreta (service_role ou sb_secret_...): nunca vai para o navegador
 *
 * Responde 200 quando o evento foi tratado (ou ignorado de propósito) e 5xx em falha, para a
 * Kiwify tentar de novo. Cada evento fica em kiwify_eventos com o payload e o resultado.
 */
import { createClient } from "@supabase/supabase-js";
import { planoDestaque } from "../../site/config/planos.js";
import {
  alteracaoDaAssinatura,
  chaveDoEvento,
  clienteDoPayload,
  desembrulhar,
  efeitoDoEvento,
  origemValida,
  pagamentoDoEvento,
  type AssinaturaAtual,
  type PayloadKiwify,
} from "../lib/kiwify.js";

const env = (nome: string) => (process.env[nome] ?? "").trim();

function resposta(status: number, corpo: Record<string, unknown>): Response {
  return new Response(JSON.stringify(corpo), { status, headers: { "content-type": "application/json" } });
}

export default async (req: Request): Promise<Response> => {
  if (req.method !== "POST") return resposta(405, { erro: "use POST" });

  const token = env("KIWIFY_WEBHOOK_TOKEN");
  const urlSupabase = env("SUPABASE_URL");
  const chaveServico = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!token || !urlSupabase || !chaveServico) {
    console.error("[kiwify] variáveis de ambiente ausentes: KIWIFY_WEBHOOK_TOKEN, SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY");
    return resposta(500, { erro: "webhook não configurado" });
  }

  const url = new URL(req.url);
  const corpoCru = await req.text();
  if (!origemValida(corpoCru, url.searchParams.get("signature"), url.searchParams.get("token"), token)) {
    console.warn("[kiwify] assinatura inválida");
    return resposta(401, { erro: "assinatura inválida" });
  }

  let payload: PayloadKiwify;
  try {
    payload = desembrulhar(JSON.parse(corpoCru));
  } catch {
    return resposta(400, { erro: "JSON inválido" });
  }

  const db = createClient(urlSupabase, chaveServico, { auth: { persistSession: false, autoRefreshToken: false } });
  const chave = chaveDoEvento(payload, corpoCru);
  const cliente = clienteDoPayload(payload);
  const efeito = efeitoDoEvento(payload);

  // Idempotência: o mesmo evento reenviado não é processado duas vezes
  const { data: jaVisto } = await db.from("kiwify_eventos").select("resultado").eq("chave", chave).maybeSingle();
  if (jaVisto?.resultado && !String(jaVisto.resultado).startsWith("erro")) return resposta(200, { ok: true, repetido: true });
  await db.from("kiwify_eventos").upsert({
    chave,
    tipo: payload.webhook_event_type ?? payload.order_status ?? null,
    email: cliente?.email ?? null,
    payload,
    resultado: "recebido",
  });
  const registrar = (resultado: string) => db.from("kiwify_eventos").update({ resultado }).eq("chave", chave);

  try {
    if (!cliente) {
      await registrar("ignorado: sem e-mail do cliente");
      return resposta(200, { ok: true, ignorado: "sem e-mail" });
    }

    const { data: atual, error: erroLeitura } = await db.from("assinaturas").select("status, fim_periodo").eq("email", cliente.email).maybeSingle<AssinaturaAtual>();
    if (erroLeitura) throw new Error(`leitura da assinatura: ${erroLeitura.message}`);

    const resultado = alteracaoDaAssinatura(payload, cliente.email, atual ?? null);
    const pagamento = pagamentoDoEvento(payload, cliente.email, resultado?.plano?.plano.nome ?? null);
    if (pagamento) {
      const { error } = await db.from("pagamentos").upsert(pagamento);
      if (error) throw new Error(`pagamento: ${error.message}`);
    }

    if (!resultado) {
      await registrar(`ignorado: ${efeito}${atual ? ` (assinatura ${atual.status})` : " (sem assinatura)"}`);
      return resposta(200, { ok: true, ignorado: efeito });
    }

    const { alteracao, plano } = resultado;
    // Primeira gravação precisa de plano e ciclo; sem identificar, usa o plano em destaque e avisa no registro
    const { error: erroGravacao } = atual
      ? await db.from("assinaturas").update(alteracao).eq("email", cliente.email)
      : await db.from("assinaturas").insert({ plano_id: planoDestaque().id, ciclo: "mensal", ...alteracao });
    if (erroGravacao) throw new Error(`assinatura: ${erroGravacao.message}`);

    let convite = "";
    if (efeito === "ativar") {
      // Cria o login e manda o convite. Quem já tem conta só ganha o acesso (entra como antes).
      const site = env("URL") || url.origin;
      const { error } = await db.auth.admin.inviteUserByEmail(cliente.email, {
        redirectTo: `${site}/definir-senha.html`,
        data: { nome: cliente.nome, telefone: cliente.telefone, cnpj: cliente.cnpj },
      });
      if (!error) convite = "convite enviado";
      else if (error.code === "email_exists" || error.status === 422 || /already been registered|already exists/i.test(error.message)) convite = "conta já existia";
      else throw new Error(`convite: ${error.message}`);
    }

    const nota = plano ? `plano ${plano.plano.id}/${plano.ciclo} por ${plano.criterio}` : "PLANO NÃO IDENTIFICADO (confira os links em site/config/planos.ts)";
    await registrar(`ok: ${alteracao.status}; ${nota}${convite ? `; ${convite}` : ""}`);
    return resposta(200, { ok: true, status: alteracao.status });
  } catch (e) {
    const mensagem = e instanceof Error ? e.message : String(e);
    console.error("[kiwify] falha:", mensagem);
    await registrar(`erro: ${mensagem}`);
    return resposta(500, { erro: "falha ao processar; a Kiwify vai reenviar" });
  }
};

export const config = { path: "/api/kiwify" };
