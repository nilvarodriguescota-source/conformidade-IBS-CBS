/**
 * Acesso de teste sem login: SOMENTE no ambiente de testes do Netlify.
 *
 * Vale em dois casos:
 *  A. o site de testes do Netlify (ENDERECOS_DE_TESTE, abaixo), em qualquer tipo de build;
 *  B. os Deploy Previews do Netlify, quando as duas condições valem ao mesmo tempo:
 *  1. o build foi feito pelo Netlify como Deploy Preview (CONTEXT=deploy-preview, gravado no build
 *     por scripts/build-site.mjs);
 *  2. a página está aberta num endereço de Deploy Preview (deploy-preview-NN--<site>.netlify.app).
 *
 * Em qualquer outro caso o login e a assinatura continuam obrigatórios: site oficial na Hostinger,
 * conformidadeibscbs.netlify.app e branch deploys. O login não foi removido do código.
 *
 * Para desligar também nos Deploy Previews: variável ACESSO_LIVRE=0 no Netlify.
 */

/** Sites de teste do Netlify (endereço exato). Para voltar a exigir login neles, tire daqui. */
const ENDERECOS_DE_TESTE = ["conformidadeibscbsatualizado.netlify.app"];

/** Endereço de um Deploy Preview do Netlify. */
const ENDERECO_DEPLOY_PREVIEW = /^deploy-preview-\d+--[a-z0-9-]+\.netlify\.app$/i;

/** "1" só em build de Deploy Preview do Netlify (scripts/build-site.mjs); "" nos demais. */
declare const __ACESSO_LIVRE__: string;

export function acessoLivreParaTestes(
  host: string = typeof location === "undefined" ? "" : location.hostname,
  buildDePrevia: string = typeof __ACESSO_LIVRE__ === "undefined" ? "" : __ACESSO_LIVRE__,
): boolean {
  if (ENDERECOS_DE_TESTE.includes(host.toLowerCase())) return true;
  return buildDePrevia === "1" && ENDERECO_DEPLOY_PREVIEW.test(host);
}
