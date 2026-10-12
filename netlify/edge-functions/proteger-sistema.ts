/**
 * Protege o sistema de XML: só entrega sistema.html para quem está logado e tem assinatura que
 * libera acesso. Sem login → tela de entrar; logado sem acesso → área do cliente (assinatura).
 *
 * O site grava o token da sessão do Supabase no cookie `se_acesso`
 * (site/servicos/provedores/supabase-kiwify.ts). Aqui o token é conferido no próprio Supabase e a
 * assinatura é lida com ele, sob a mesma RLS do navegador.
 *
 * A regra de acesso repete site/servicos/acesso.ts (situacaoDeAcesso): ativa ou em atraso liberam;
 * cancelada libera até o fim do período pago. Mudou lá, mude aqui.
 *
 * Sem SUPABASE_URL e SUPABASE_ANON_KEY no ambiente (modo demonstração), deixa passar.
 */
import type { Config, Context } from "@netlify/edge-functions";

declare const Netlify: { env: { get(nome: string): string | undefined } };

function cookie(req: Request, nome: string): string | null {
  for (const parte of (req.headers.get("cookie") ?? "").split(";")) {
    const [k, ...v] = parte.trim().split("=");
    if (k === nome) return decodeURIComponent(v.join("="));
  }
  return null;
}

function redirecionar(req: Request, destino: string): Response {
  return new Response(null, { status: 302, headers: { location: new URL(destino, req.url).href, "cache-control": "no-store" } });
}

export default async (req: Request, context: Context): Promise<Response> => {
  const url = (Netlify.env.get("SUPABASE_URL") ?? "").trim().replace(/\/+$/, "");
  const chave = (Netlify.env.get("SUPABASE_ANON_KEY") ?? "").trim();
  if (!url || !chave) return context.next();

  const entrar = "/entrar.html?voltar=sistema.html";
  const token = cookie(req, "se_acesso");
  if (!token) return redirecionar(req, entrar);

  const cabecalhos = { apikey: chave, authorization: `Bearer ${token}` };
  const usuario = await fetch(`${url}/auth/v1/user`, { headers: cabecalhos });
  if (!usuario.ok) return redirecionar(req, entrar);
  const { email } = (await usuario.json()) as { email?: string };
  if (!email) return redirecionar(req, entrar);

  const consulta = await fetch(`${url}/rest/v1/assinaturas?select=status,fim_periodo&email=eq.${encodeURIComponent(email.toLowerCase())}`, { headers: cabecalhos });
  if (!consulta.ok) return new Response("Não foi possível conferir a assinatura agora. Tente de novo em instantes.", { status: 503 });
  const [assinatura] = (await consulta.json()) as Array<{ status: string; fim_periodo: string | null }>;

  const liberado =
    assinatura != null &&
    (assinatura.status === "ativa" ||
      assinatura.status === "em_atraso" ||
      (assinatura.status === "cancelada" && assinatura.fim_periodo != null && new Date(assinatura.fim_periodo) > new Date()));
  if (!liberado) return redirecionar(req, "/conta.html#assinatura");

  const resposta = await context.next();
  resposta.headers.set("cache-control", "private, no-store");
  return resposta;
};

export const config: Config = { path: ["/sistema.html", "/sistema"] };
