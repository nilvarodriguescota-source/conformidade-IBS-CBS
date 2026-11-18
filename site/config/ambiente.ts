/**
 * Ambiente de testes: acesso livre ao sistema de XML, sem login e sem conferir assinatura.
 *
 * - Na prévia do Netlify (endereços *.netlify.app) o acesso é livre: o sistema abre direto.
 * - No site oficial (Hostinger, saboresestrategicos.com.br) o login e a assinatura continuam
 *   obrigatórios, sem nenhuma mudança.
 *
 * O login NÃO foi removido: só deixa de ser exigido no ambiente de testes. Para controlar no build,
 * use a variável de ambiente ACESSO_LIVRE (no Netlify: Site configuration → Environment variables):
 *   ACESSO_LIVRE=0  → exige login também na prévia do Netlify (volta ao comportamento de produção);
 *   ACESSO_LIVRE=1  → acesso livre em qualquer endereço (use só para testes);
 *   sem a variável  → livre só nos endereços abaixo.
 */

/** Endereços considerados ambiente de testes quando ACESSO_LIVRE não é informado. */
const ENDERECOS_DE_TESTE = [/\.netlify\.app$/i];

/** Substituído no build por scripts/build-site.mjs ("" quando a variável não existe). */
declare const __ACESSO_LIVRE__: string;

export function acessoLivreParaTestes(host: string = typeof location === "undefined" ? "" : location.hostname): boolean {
  const v = (typeof __ACESSO_LIVRE__ === "undefined" ? "" : __ACESSO_LIVRE__).trim().toLowerCase();
  if (["0", "false", "nao", "não", "off"].includes(v)) return false;
  if (["1", "true", "sim", "on"].includes(v)) return true;
  return ENDERECOS_DE_TESTE.some((r) => r.test(host));
}
