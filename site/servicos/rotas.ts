/**
 * Endereços do site. As páginas são arquivos .html na raiz do site publicado, ao lado
 * do sistema (sistema.html), para funcionar igual no Netlify e em qualquer servidor estático.
 */
import { produto } from "../config/produto.js";
import type { CicloCobranca } from "./tipos.js";

function comParametros(pagina: string, parametros: Record<string, string | null | undefined>): string {
  const busca = new URLSearchParams();
  for (const [k, v] of Object.entries(parametros)) if (v) busca.set(k, v);
  const q = busca.toString();
  return q ? `${pagina}?${q}` : pagina;
}

export const rotas = {
  inicio: "index.html",
  planos: "index.html#planos",
  conta: "conta.html",
  sistema: produto.enderecoSistema,
  recuperarSenha: "recuperar-senha.html",
  termos: "termos.html",
  privacidade: "privacidade.html",
  entrar: (voltar?: string) => comParametros("entrar.html", { voltar }),
  cadastro: (plano?: string | null, ciclo?: CicloCobranca | null) => comParametros("cadastro.html", { plano, ciclo }),
  checkout: (plano?: string | null, ciclo?: CicloCobranca | null) => comParametros("checkout.html", { plano, ciclo }),
  contaSecao: (secao: string) => `conta.html#${secao}`,
};

/**
 * Só aceita voltar para uma página deste site (evita redirecionamento para outro domínio
 * via ?voltar=https://...). Qualquer outra coisa cai na área do cliente.
 */
export function destinoSeguro(voltar: string | null | undefined, padrao: string = rotas.conta): string {
  if (!voltar) return padrao;
  return /^[a-z0-9-]+\.html(\?[\w=&%.-]*)?(#[\w/-]*)?$/i.test(voltar) ? voltar : padrao;
}

export function parametro(nome: string): string | null {
  return new URLSearchParams(location.search).get(nome);
}

export function cicloDaUrl(): CicloCobranca | null {
  const c = parametro("ciclo");
  return c === "mensal" || c === "anual" ? c : null;
}
