/**
 * Webhook da Kiwify → libera, renova ou encerra o acesso no Supabase e cria o login do comprador.
 *
 * Roda como função do próprio Supabase (supabase/functions/kiwify-webhook), então funciona com o
 * site em qualquer hospedagem (Hostinger, Netlify...). Endereço para cadastrar na Kiwify:
 *   https://SEU-PROJETO.supabase.co/functions/v1/kiwify-webhook
 *
 * Conversa com o Supabase só por HTTP (REST e Auth), sem bibliotecas: o mesmo código roda no
 * Supabase (Deno) e nos testes (Node).
 *
 * Responde 200 quando o evento foi tratado (ou ignorado de propósito) e 5xx em falha, para a
 * Kiwify tentar de novo. Cada evento fica em kiwify_eventos com o payload e o resultado.
 */
import { planoDestaque } from "../site/config/planos.js";
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
} from "./kiwify.js";

export interface ConfiguracaoWebhook {
  /** Token mostrado pela Kiwify ao criar o webhook. */
  tokenKiwify: string;
  /** https://xxxx.supabase.co */
  supabaseUrl: string;
  /** Chave secreta (service_role ou sb_secret_...): nunca vai para o navegador. */
  chaveServico: string;
  /** Endereço do site, para o link do e-mail de convite (definir-senha.html). */
  siteUrl: string;
}

function resposta(status: number, corpo: Record<string, unknown>): Response {
  return new Response(JSON.stringify(corpo), { status, headers: { "content-type": "application/json" } });
}

/** Cliente mínimo do Supabase (PostgREST + Auth admin) com a chave secreta. */
function supabase(cfg: ConfiguracaoWebhook, http: typeof fetch) {
  const base = cfg.supabaseUrl.replace(/\/+$/, "");
  const cabecalhos = { apikey: cfg.chaveServico, authorization: `Bearer ${cfg.chaveServico}`, "content-type": "application/json" };
  const filtro = (campo: string, valor: string) => `${campo}=eq.${encodeURIComponent(valor)}`;

  async function pedir(metodo: string, caminho: string, corpo?: unknown, extras: Record<string, string> = {}): Promise<unknown> {
    const r = await http(`${base}${caminho}`, { method: metodo, headers: { ...cabecalhos, ...extras }, body: corpo === undefined ? undefined : JSON.stringify(corpo) });
    const texto = await r.text();
    if (!r.ok) {
      let detalhe: { message?: string; msg?: string; error_code?: string; code?: string } = {};
      try {
        detalhe = JSON.parse(texto);
      } catch {
        /* corpo sem JSON */
      }
      throw Object.assign(new Error(detalhe.message ?? detalhe.msg ?? `HTTP ${r.status}`), { status: r.status, codigo: detalhe.error_code ?? detalhe.code ?? "" });
    }
    return texto ? JSON.parse(texto) : null;
  }

  return {
    async primeiro<T>(tabela: string, campos: string, campo: string, valor: string): Promise<T | null> {
      const linhas = (await pedir("GET", `/rest/v1/${tabela}?select=${campos}&${filtro(campo, valor)}&limit=1`)) as T[];
      return linhas[0] ?? null;
    },
    inserir: (tabela: string, linha: object) => pedir("POST", `/rest/v1/${tabela}`, linha, { prefer: "return=minimal" }),
    gravar: (tabela: string, linha: object) => pedir("POST", `/rest/v1/${tabela}`, linha, { prefer: "resolution=merge-duplicates,return=minimal" }),
    atualizar: (tabela: string, campo: string, valor: string, linha: object) => pedir("PATCH", `/rest/v1/${tabela}?${filtro(campo, valor)}`, linha, { prefer: "return=minimal" }),
    convidar: (email: string, dados: object, redirecionar: string) =>
      pedir("POST", `/auth/v1/invite${redirecionar ? `?redirect_to=${encodeURIComponent(redirecionar)}` : ""}`, { email, data: dados }),
  };
}

export async function tratarWebhook(req: Request, cfg: ConfiguracaoWebhook, http: typeof fetch = fetch): Promise<Response> {
  if (req.method !== "POST") return resposta(405, { erro: "use POST" });
  if (!cfg.tokenKiwify || !cfg.supabaseUrl || !cfg.chaveServico) {
    console.error("[kiwify] configuração ausente: KIWIFY_WEBHOOK_TOKEN, SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY");
    return resposta(500, { erro: "webhook não configurado" });
  }

  const url = new URL(req.url);
  const corpoCru = await req.text();
  if (!origemValida(corpoCru, url.searchParams.get("signature"), url.searchParams.get("token"), cfg.tokenKiwify)) {
    console.warn("[kiwify] assinatura inválida");
    return resposta(401, { erro: "assinatura inválida" });
  }

  let payload: PayloadKiwify;
  try {
    payload = desembrulhar(JSON.parse(corpoCru));
  } catch {
    return resposta(400, { erro: "JSON inválido" });
  }

  const db = supabase(cfg, http);
  const chave = chaveDoEvento(payload, corpoCru);
  const cliente = clienteDoPayload(payload);
  const efeito = efeitoDoEvento(payload);
  const registrar = (resultado: string) => db.atualizar("kiwify_eventos", "chave", chave, { resultado }).catch(() => undefined);

  try {
    // Idempotência: o mesmo evento reenviado não é processado duas vezes
    const jaVisto = await db.primeiro<{ resultado: string | null }>("kiwify_eventos", "resultado", "chave", chave);
    if (jaVisto?.resultado && !String(jaVisto.resultado).startsWith("erro")) return resposta(200, { ok: true, repetido: true });
    await db.gravar("kiwify_eventos", { chave, tipo: payload.webhook_event_type ?? payload.order_status ?? null, email: cliente?.email ?? null, payload, resultado: "recebido" });
  } catch (e) {
    console.error("[kiwify] banco indisponível:", e instanceof Error ? e.message : e);
    return resposta(500, { erro: "banco indisponível; a Kiwify vai reenviar" });
  }

  try {
    if (!cliente) {
      await registrar("ignorado: sem e-mail do cliente");
      return resposta(200, { ok: true, ignorado: "sem e-mail" });
    }

    const atual = await db.primeiro<AssinaturaAtual>("assinaturas", "status,fim_periodo", "email", cliente.email);
    const resultado = alteracaoDaAssinatura(payload, cliente.email, atual);
    const pagamento = pagamentoDoEvento(payload, cliente.email, resultado?.plano?.plano.nome ?? null);
    if (pagamento) await db.gravar("pagamentos", pagamento);

    if (!resultado) {
      await registrar(`ignorado: ${efeito}${atual ? ` (assinatura ${atual.status})` : " (sem assinatura)"}`);
      return resposta(200, { ok: true, ignorado: efeito });
    }

    const { alteracao, plano } = resultado;
    if (atual) await db.atualizar("assinaturas", "email", cliente.email, alteracao);
    else {
      // Primeira gravação precisa de plano e ciclo; sem identificar, usa o plano em destaque e avisa no registro
      const reserva = planoDestaque();
      await db.inserir("assinaturas", { plano_id: reserva.id, ciclo: "mensal", limite_xmls_mes: reserva.xmlsPorMes, ...alteracao });
    }

    let convite = "";
    if (efeito === "ativar") {
      // Cria o login e manda o convite. Quem já tem conta só ganha o acesso (entra como antes).
      const destino = cfg.siteUrl ? `${cfg.siteUrl.replace(/\/+$/, "")}/definir-senha.html` : "";
      try {
        await db.convidar(cliente.email, { nome: cliente.nome, telefone: cliente.telefone, cnpj: cliente.cnpj }, destino);
        convite = "convite enviado";
      } catch (e) {
        const erro = e as Error & { status?: number; codigo?: string };
        if (erro.codigo === "email_exists" || erro.status === 422 || /already been registered|already exists/i.test(erro.message)) convite = "conta já existia";
        else throw new Error(`convite: ${erro.message}`);
      }
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
}
