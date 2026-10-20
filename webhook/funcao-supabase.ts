/**
 * Ponto de entrada da função kiwify-webhook no Supabase (Deno). O build (scripts/build-webhook.mjs)
 * junta este arquivo e tudo o que ele usa em supabase/functions/kiwify-webhook/index.ts, um arquivo
 * só, que pode ser colado no editor de funções do painel do Supabase.
 *
 * Segredos da função (Supabase → Edge Functions → Secrets):
 *   KIWIFY_WEBHOOK_TOKEN   token mostrado pela Kiwify ao criar o webhook (obrigatório)
 *   SITE_URL               endereço do site, se não estiver em site/config/integracoes.ts
 * SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY o próprio Supabase fornece a toda função.
 */
import { site } from "../site/config/integracoes.js";
import { tratarWebhook } from "./processar.js";

declare const Deno: { env: { get(nome: string): string | undefined }; serve(tratar: (req: Request) => Promise<Response>): unknown };

const env = (nome: string) => (Deno.env.get(nome) ?? "").trim();

Deno.serve((req) =>
  tratarWebhook(req, {
    tokenKiwify: env("KIWIFY_WEBHOOK_TOKEN"),
    supabaseUrl: env("SUPABASE_URL"),
    chaveServico: env("SUPABASE_SERVICE_ROLE_KEY"),
    siteUrl: env("SITE_URL") || site.endereco,
  }),
);
