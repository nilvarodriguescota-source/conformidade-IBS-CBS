/**
 * supabase/functions/kiwify-webhook/index.ts é colado à mão no painel do Supabase: precisa estar
 * igual ao que o build gera a partir de webhook/ (e de site/config, que tem os planos).
 */
import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { join } from "node:path";

test("função do webhook: o arquivo do Supabase está atualizado (rode npm run build se falhar)", async () => {
  const raiz = process.cwd();
  // Sem variáveis de ambiente: o arquivo versionado usa só os valores de site/config/integracoes.ts
  for (const nome of ["SUPABASE_URL", "SUPABASE_ANON_KEY", "SITE_URL"]) delete process.env[nome];
  const { gerarWebhook, destinoWebhook } = (await import(join(raiz, "scripts", "build-webhook.mjs"))) as {
    gerarWebhook: () => Promise<string>;
    destinoWebhook: string;
  };
  assert.equal(readFileSync(destinoWebhook, "utf8"), await gerarWebhook());
});
