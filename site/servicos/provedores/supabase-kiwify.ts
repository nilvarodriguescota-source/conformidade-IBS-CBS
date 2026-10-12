/**
 * PRODUÇÃO: login pelo Supabase e assinatura vendida pela Kiwify.
 *
 * Como funciona (estilo streaming):
 *  1. o cliente compra na página da Kiwify (os botões "Assinar" levam direto para ela);
 *  2. a Kiwify avisa o webhook (netlify/functions/kiwify-webhook.mts), que grava a assinatura
 *     no Supabase e cria o login do comprador, mandando o convite por e-mail;
 *  3. o cliente abre o convite, cria a senha (definir-senha.html) e entra direto na área do cliente.
 *     Depois disso entra com e-mail e senha ou pede um link de acesso por e-mail.
 *
 * O navegador só LÊ a assinatura (o banco libera, por RLS, apenas a linha do e-mail logado).
 * Quem ativa, renova ou encerra é sempre o webhook, no servidor.
 */
import type { AuthError, Session, SupabaseClient, User } from "@supabase/supabase-js";
import { supabase as configSupabase } from "../../config/integracoes.js";
import { linkKiwify, planoPorId } from "../../config/planos.js";
import { produto } from "../../config/produto.js";
import {
  ErroServico,
  type Assinatura,
  type CicloCobranca,
  type FormaPagamento,
  type Pagamento,
  type PedidoCheckout,
  type ProvedorAutenticacao,
  type ProvedorPagamento,
  type ResultadoCheckout,
  type StatusAssinatura,
  type Usuario,
} from "../tipos.js";

/**
 * Cópia do token de acesso num cookie, para a função de borda (netlify/edge-functions/proteger-sistema.ts)
 * conferir a assinatura antes de entregar o sistema. O token já fica no localStorage; o cookie não
 * amplia a exposição, só deixa o servidor enxergá-lo.
 */
const COOKIE_ACESSO = "se_acesso";

function gravarCookieDeAcesso(sessao: Session | null): void {
  const seguro = location.protocol === "https:" ? "; Secure" : "";
  document.cookie = sessao
    ? `${COOKIE_ACESSO}=${encodeURIComponent(sessao.access_token)}; Path=/; Max-Age=${Math.max(60, (sessao.expires_at ?? 0) - Math.floor(Date.now() / 1000))}; SameSite=Lax${seguro}`
    : `${COOKIE_ACESSO}=; Path=/; Max-Age=0; SameSite=Lax${seguro}`;
}

let cliente: Promise<SupabaseClient> | null = null;

/** A biblioteca do Supabase (~230 KB) só é baixada quando alguma tela usa a conta. */
function sb(): Promise<SupabaseClient> {
  cliente ??= import("@supabase/supabase-js").then(({ createClient }) => {
    const c = createClient(configSupabase.url, configSupabase.chavePublica, {
      auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true, flowType: "implicit" },
    });
    c.auth.onAuthStateChange((_evento, sessao) => gravarCookieDeAcesso(sessao));
    return c;
  });
  return cliente;
}

/** Endereço absoluto de uma página do site (para os links que vão por e-mail). */
function enderecoDoSite(pagina: string): string {
  return new URL(pagina, location.href).href;
}

const contato = [produto.contato.emailSuporte, produto.contato.whatsapp ? `WhatsApp (${produto.contato.whatsapp.slice(2, 4)}) ${produto.contato.whatsapp.slice(4)}` : null]
  .filter(Boolean)
  .join(" ou ");

function traduzirErro(erro: AuthError | { message: string; code?: string } | null): ErroServico {
  const msg = erro?.message ?? "";
  const codigo = (erro as { code?: string } | null)?.code ?? "";
  if (codigo === "invalid_credentials" || /invalid login credentials/i.test(msg)) return new ErroServico("E-mail ou senha incorretos. Se ainda não criou sua senha, use \"Receber link de acesso\".", "credenciais_invalidas");
  if (codigo === "email_not_confirmed") return new ErroServico("Confirme seu e-mail pelo link que enviamos antes de entrar.", "email_nao_confirmado");
  if (codigo === "over_email_send_rate_limit" || codigo === "over_request_rate_limit" || /rate limit/i.test(msg)) return new ErroServico("Muitas tentativas em pouco tempo. Aguarde alguns minutos e tente de novo.", "limite");
  if (codigo === "weak_password" || /password should be/i.test(msg)) return new ErroServico("Senha fraca. Use pelo menos 8 caracteres, misturando letras e números.", "senha_fraca");
  if (codigo === "same_password") return new ErroServico("A nova senha precisa ser diferente da atual.", "senha_igual");
  if (/fetch|network/i.test(msg)) return new ErroServico("Sem conexão com o servidor. Confira sua internet e tente de novo.", "rede");
  return new ErroServico(msg ? `Não foi possível concluir: ${msg}` : "Não foi possível concluir. Tente de novo em instantes.", codigo || "erro");
}

function textoOuNulo(v: unknown): string | null {
  return typeof v === "string" && v.trim() ? v.trim() : null;
}

function paraUsuario(u: User): Usuario {
  const m = (u.user_metadata ?? {}) as Record<string, unknown>;
  const email = (u.email ?? "").toLowerCase();
  return {
    id: u.id,
    nome: textoOuNulo(m.nome) ?? textoOuNulo(m.full_name) ?? email.split("@")[0] ?? "Cliente",
    email,
    empresa: textoOuNulo(m.empresa),
    cnpj: textoOuNulo(m.cnpj),
    telefone: textoOuNulo(m.telefone),
    criadoEm: u.created_at,
  };
}

async function sessaoObrigatoria(): Promise<Session> {
  const { data } = await (await sb()).auth.getSession();
  if (!data.session) throw new ErroServico("Sua sessão terminou. Entre novamente.", "sem_sessao");
  return data.session;
}

export const autenticacaoSupabase: ProvedorAutenticacao = {
  nome: "supabase",

  async sessaoAtual() {
    const { data } = await (await sb()).auth.getSession();
    gravarCookieDeAcesso(data.session);
    if (!data.session) return null;
    return { usuario: paraUsuario(data.session.user), iniciadaEm: data.session.user.last_sign_in_at ?? new Date().toISOString() };
  },

  async cadastrar() {
    throw new ErroServico("A conta é criada automaticamente quando a compra é aprovada: escolha um plano e conclua o pagamento. O acesso chega no e-mail usado na compra.", "cadastro_pela_compra");
  },

  async entrar(email: string, senha: string) {
    const { data, error } = await (await sb()).auth.signInWithPassword({ email: email.trim().toLowerCase(), password: senha });
    if (error || !data.session) throw traduzirErro(error);
    gravarCookieDeAcesso(data.session);
    return { usuario: paraUsuario(data.session.user), iniciadaEm: new Date().toISOString() };
  },

  async enviarLinkDeAcesso(email: string, voltar: string) {
    const { error } = await (await sb()).auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      // Só quem já comprou tem login: o link não cria conta nova
      // Volta pelo login, que mostra o aviso se o link vencer e segue para `voltar` com a sessão aberta
      options: { shouldCreateUser: false, emailRedirectTo: enderecoDoSite(`entrar.html?voltar=${encodeURIComponent(voltar)}`) },
    });
    // E-mail sem compra também recebe "enviado", para não revelar quem é cliente
    if (error && !/signups not allowed|user not found|otp/i.test(error.message)) throw traduzirErro(error);
  },

  async sair() {
    await (await sb()).auth.signOut();
    gravarCookieDeAcesso(null);
  },

  async solicitarRedefinicaoSenha(email: string) {
    const { error } = await (await sb()).auth.resetPasswordForEmail(email.trim().toLowerCase(), { redirectTo: enderecoDoSite("definir-senha.html") });
    if (error && error.code !== "user_not_found") throw traduzirErro(error);
  },

  async definirSenha(novaSenha: string) {
    await sessaoObrigatoria();
    const { error } = await (await sb()).auth.updateUser({ password: novaSenha });
    if (error) throw traduzirErro(error);
  },

  async atualizarPerfil(dados) {
    await sessaoObrigatoria();
    const { data, error } = await (await sb()).auth.updateUser({
      data: { nome: dados.nome.trim(), empresa: dados.empresa?.trim() || null, cnpj: dados.cnpj?.trim() || null, telefone: dados.telefone?.trim() || null },
    });
    if (error || !data.user) throw traduzirErro(error);
    return paraUsuario(data.user);
  },

  async alterarSenha(senhaAtual: string, novaSenha: string) {
    const sessao = await sessaoObrigatoria();
    const { error: erroAtual } = await (await sb()).auth.signInWithPassword({ email: sessao.user.email ?? "", password: senhaAtual });
    if (erroAtual) throw new ErroServico("A senha atual não confere. Se você entrou pelo link do e-mail e ainda não tem senha, use \"Esqueci minha senha\".", "senha_incorreta");
    const { error } = await (await sb()).auth.updateUser({ password: novaSenha });
    if (error) throw traduzirErro(error);
  },

  async excluirConta() {
    throw new ErroServico(
      `Para excluir sua conta e seus dados, fale com a gente${contato ? ` (${contato})` : ""}. Se houver assinatura ativa, cancelamos junto na Kiwify para não haver nova cobrança.`,
      "exclusao_pelo_suporte",
    );
  },
};

/* ---------------- Assinatura (lida do Supabase, gravada pelo webhook da Kiwify) ---------------- */

interface LinhaAssinatura {
  email: string;
  plano_id: string;
  ciclo: CicloCobranca;
  status: StatusAssinatura;
  criada_em: string;
  inicio_periodo: string | null;
  fim_periodo: string | null;
  cancelada_em: string | null;
  forma_pagamento: FormaPagamento | null;
  origem: string;
  kiwify_assinatura_id: string | null;
}

interface LinhaPagamento {
  id: string;
  data: string;
  descricao: string;
  valor: number | string;
  status: Pagamento["status"];
  url_comprovante: string | null;
}

function paraAssinatura(l: LinhaAssinatura, usuario: Usuario): Assinatura {
  return {
    id: l.kiwify_assinatura_id ?? `kiwify_${l.email}`,
    usuarioId: usuario.id,
    planoId: l.plano_id,
    ciclo: l.ciclo,
    status: l.status,
    criadaEm: l.criada_em,
    inicioPeriodo: l.inicio_periodo,
    fimPeriodo: l.fim_periodo,
    canceladaEm: l.cancelada_em,
    formaPagamento: l.forma_pagamento,
    origem: l.origem,
  };
}

async function lerAssinatura(usuario: Usuario): Promise<Assinatura | null> {
  const { data, error } = await (await sb()).from("assinaturas").select("*").eq("email", usuario.email).maybeSingle<LinhaAssinatura>();
  if (error) throw new ErroServico("Não foi possível consultar sua assinatura agora. Tente de novo em instantes.", "consulta_assinatura");
  return data ? paraAssinatura(data, usuario) : null;
}

const falarComSuporte = contato ? ` Fale com a gente (${contato}) e resolvemos para você.` : "";

export const pagamentoKiwify: ProvedorPagamento = {
  nome: "kiwify",

  assinaturaAtual: lerAssinatura,

  /** Não grava nada: a assinatura só existe depois que a Kiwify confirma a compra. */
  async registrarEscolhaDePlano(usuario: Usuario, planoId: string, ciclo: CicloCobranca) {
    const atual = await lerAssinatura(usuario);
    if (atual) return atual;
    const agora = new Date().toISOString();
    return { id: "pendente", usuarioId: usuario.id, planoId, ciclo, status: "pendente_pagamento", criadaEm: agora, inicioPeriodo: null, fimPeriodo: null, canceladaEm: null, formaPagamento: null, origem: "kiwify" };
  },

  async iniciarCheckout(pedido: PedidoCheckout): Promise<ResultadoCheckout> {
    const plano = planoPorId(pedido.planoId);
    const link = plano ? linkKiwify(plano, pedido.ciclo) : null;
    if (!link) throw new ErroServico(`O pagamento deste plano ainda não está disponível.${falarComSuporte}`, "link_kiwify_ausente");
    // Preenche o checkout com os dados de quem já está logado (a Kiwify ignora o que não reconhecer)
    const url = new URL(link);
    url.searchParams.set("email", pedido.usuario.email);
    url.searchParams.set("name", pedido.usuario.nome);
    return { tipo: "redirecionar", url: url.href };
  },

  async trocarPlano() {
    throw new ErroServico(`A troca de plano é feita pela nossa equipe, para você não pagar duas assinaturas ao mesmo tempo.${falarComSuporte}`, "troca_pelo_suporte");
  },

  async cancelarAssinatura() {
    throw new ErroServico(
      `O cancelamento é feito na Kiwify, que cuida das cobranças: use o link do e-mail de compra que a Kiwify enviou.${falarComSuporte} Você continua com acesso até o fim do período já pago.`,
      "cancelamento_pela_kiwify",
    );
  },

  async historicoPagamentos(usuario: Usuario) {
    const { data, error } = await (await sb()).from("pagamentos").select("*").eq("email", usuario.email).order("data", { ascending: false }).limit(50);
    if (error || !data) return [];
    return (data as LinhaPagamento[]).map((p) => ({ id: p.id, data: p.data, descricao: p.descricao, valor: Number(p.valor), status: p.status, urlComprovante: p.url_comprovante }));
  },
};
