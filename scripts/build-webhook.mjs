// Gera supabase/functions/kiwify-webhook/index.ts: a função do webhook da Kiwify num arquivo só,
// pronto para o Supabase (colar no editor do painel ou publicar com `supabase functions deploy`).
// Chamado por build-web.mjs; também roda sozinho: node scripts/build-webhook.mjs
import { build } from "esbuild";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { definicoesPublicas } from "./build-site.mjs";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");

export const destinoWebhook = join(raiz, "supabase", "functions", "kiwify-webhook", "index.ts");

/** Conteúdo do arquivo da função (sem gravar). */
export async function gerarWebhook() {
  const r = await build({
    entryPoints: [join(raiz, "webhook", "funcao-supabase.ts")],
    bundle: true,
    write: false,
    format: "esm",
    platform: "neutral",
    target: "es2022",
    // node:crypto e node:buffer existem no Deno do Supabase
    external: ["node:*"],
    legalComments: "none",
    logLevel: "warning",
    define: definicoesPublicas(),
  });
  const aviso =
    "// ARQUIVO GERADO por scripts/build-webhook.mjs a partir de webhook/. Não edite aqui: edite webhook/ e rode npm run build.\n" +
    "// Para publicar: copie TODO este arquivo para a função kiwify-webhook no painel do Supabase\n" +
    "// (Edge Functions), com \"Verify JWT\" desligado. Passo a passo: docs/kiwify-supabase/PASSO-A-PASSO.md\n" +
    "// @ts-nocheck\n";
  return aviso + r.outputFiles[0].text;
}

export async function construirWebhook() {
  mkdirSync(dirname(destinoWebhook), { recursive: true });
  writeFileSync(destinoWebhook, await gerarWebhook());
  return destinoWebhook;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  console.log(await construirWebhook());
}
