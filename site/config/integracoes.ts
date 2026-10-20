/**
 * Integrações externas do site: login e banco (Supabase) e pagamento (Kiwify).
 *
 * Os três valores abaixo são públicos (vão para o navegador de qualquer forma) e por isso ficam
 * no código: o site é publicado como arquivos estáticos (Hostinger), sem variáveis de ambiente.
 * Se as variáveis SUPABASE_URL, SUPABASE_ANON_KEY e SITE_URL existirem no build, elas têm prioridade.
 *
 * A chave secreta do Supabase e o token da Kiwify NUNCA entram aqui: ficam só nos segredos da
 * função do webhook, dentro do Supabase (docs/kiwify-supabase/PASSO-A-PASSO.md).
 */

/** Endereço do projeto no Supabase, ex.: "https://abcdefgh.supabase.co". */
const SUPABASE_URL = "";
/** Chave pública do Supabase (publishable "sb_publishable_..." ou "anon public"). */
const SUPABASE_ANON_KEY = "";
/** Endereço do site publicado, sem barra no fim, ex.: "https://conformidadeibscbs.com.br". */
const SITE_URL = "";

/** Substituídos no build por scripts/build-site.mjs (texto vazio quando a variável não existe). */
declare const __SUPABASE_URL__: string;
declare const __SUPABASE_ANON_KEY__: string;
declare const __SITE_URL__: string;

const limpar = (v: string) => v.trim().replace(/\/+$/, "");

/** A chave pública (anon/publishable) pode ir para o navegador: o banco é protegido por RLS. */
export const supabase = {
  url: limpar(__SUPABASE_URL__ || SUPABASE_URL),
  chavePublica: (__SUPABASE_ANON_KEY__ || SUPABASE_ANON_KEY).trim(),
};

export const site = {
  /** Vazio = usa o endereço em que a página está aberta. */
  endereco: limpar(__SITE_URL__ || SITE_URL),
};

/** false enquanto o endereço ou a chave pública do Supabase não forem preenchidos: as telas de conta avisam. */
export function supabaseConfigurado(): boolean {
  return Boolean(supabase.url && supabase.chavePublica);
}
