/**
 * Integrações externas do site: autenticação (Supabase) e pagamento (Kiwify).
 *
 * O modo é decidido no build, pelas variáveis de ambiente do Netlify:
 *   - com SUPABASE_URL e SUPABASE_ANON_KEY definidas → "producao": login pelo Supabase,
 *     compra pela Kiwify e acesso liberado pelo webhook (netlify/functions/kiwify-webhook.mts);
 *   - sem elas → "demonstracao": contas e assinaturas ficam só no navegador de quem testa,
 *     nada é cobrado e todas as telas avisam isso.
 * Passo a passo da configuração: docs/kiwify-supabase/PASSO-A-PASSO.md.
 */
export type ModoIntegracao = "demonstracao" | "producao";

/** Substituídos no build por scripts/build-site.mjs (texto vazio quando a variável não existe). */
declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;

/** Endereço e chave pública do Supabase. A chave pública (anon/publishable) pode ir para o navegador: o banco é protegido por RLS. */
export const supabase = {
  url: __SUPABASE_URL__,
  chavePublica: __SUPABASE_ANON_KEY__,
};

const modo: ModoIntegracao = supabase.url && supabase.chavePublica ? "producao" : "demonstracao";

export const integracoes = {
  modo,

  autenticacao: {
    /** "demonstracao" | "supabase" */
    provedor: modo === "producao" ? "supabase" : "demonstracao",
  },

  pagamento: {
    /** "demonstracao" | "kiwify" */
    provedor: modo === "producao" ? "kiwify" : "demonstracao",
    /** Formas de pagamento exibidas no checkout de demonstração (na Kiwify, a própria página de pagamento mostra as opções). */
    formas: ["cartao", "pix", "boleto"] as Array<"cartao" | "pix" | "boleto">,
  },
};

export function emDemonstracao(): boolean {
  return integracoes.modo === "demonstracao";
}

/** A compra acontece na página da Kiwify (a conta nasce da compra, não do formulário de cadastro). */
export function compraPelaKiwify(): boolean {
  return integracoes.pagamento.provedor === "kiwify";
}
