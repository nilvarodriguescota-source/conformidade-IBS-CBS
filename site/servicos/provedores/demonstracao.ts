/**
 * MODO DEMONSTRAÇÃO — não é uma integração real.
 *
 * Permite percorrer o fluxo completo (cadastro → pagamento → acesso) sem nenhum
 * serviço externo. Tudo fica no localStorage do navegador de quem testa:
 *  - nenhum e-mail é enviado e nenhum valor é cobrado;
 *  - a senha é guardada só como hash PBKDF2 com sal, mas continua sendo um
 *    armazenamento local de teste: não serve como segurança de verdade;
 *  - outra máquina ou navegador não enxerga as contas criadas aqui.
 * As telas avisam o modo demonstração sempre que ele está ativo.
 */
import { planoPorId, valorDoCiclo } from "../../config/planos.js";
import {
  ErroServico,
  type Assinatura,
  type CicloCobranca,
  type DadosCadastro,
  type DadosPerfil,
  type Pagamento,
  type PedidoCheckout,
  type ProvedorAutenticacao,
  type ProvedorPagamento,
  type ResultadoCheckout,
  type Sessao,
  type Usuario,
} from "../tipos.js";

const CHAVE = {
  usuarios: "se-demo:usuarios",
  sessao: "se-demo:sessao",
  assinaturas: "se-demo:assinaturas",
  pagamentos: "se-demo:pagamentos",
};

interface RegistroUsuario {
  usuario: Usuario;
  senha: { sal: string; hash: string };
}

function ler<T>(chave: string, padrao: T): T {
  try {
    const bruto = localStorage.getItem(chave);
    return bruto ? (JSON.parse(bruto) as T) : padrao;
  } catch {
    return padrao;
  }
}

function gravar(chave: string, valor: unknown): void {
  try {
    localStorage.setItem(chave, JSON.stringify(valor));
  } catch {
    throw new ErroServico("O navegador bloqueou o armazenamento local. Saia da janela anônima ou libere os dados do site.");
  }
}

function remover(chave: string): void {
  try {
    localStorage.removeItem(chave);
  } catch {
    /* sem armazenamento: nada a remover */
  }
}

function novoId(prefixo: string): string {
  const aleatorio = globalThis.crypto?.randomUUID?.() ?? `${Date.now().toString(36)}${Math.random().toString(36).slice(2)}`;
  return `${prefixo}_${aleatorio}`;
}

const agora = () => new Date().toISOString();

function somarCiclo(inicio: Date, ciclo: CicloCobranca): Date {
  const fim = new Date(inicio);
  if (ciclo === "anual") fim.setFullYear(fim.getFullYear() + 1);
  else fim.setMonth(fim.getMonth() + 1);
  return fim;
}

function normalizarEmail(email: string): string {
  return email.trim().toLowerCase();
}

function paraBase64(bytes: ArrayBuffer | Uint8Array): string {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of arr) s += String.fromCharCode(b);
  return btoa(s);
}

function deBase64(texto: string): Uint8Array {
  return Uint8Array.from(atob(texto), (c) => c.charCodeAt(0));
}

async function derivarSenha(senha: string, sal: Uint8Array): Promise<string> {
  const sutil = globalThis.crypto?.subtle;
  if (!sutil) throw new ErroServico("Este navegador não oferece criptografia segura. Abra o site por https.");
  const chave = await sutil.importKey("raw", new TextEncoder().encode(senha), "PBKDF2", false, ["deriveBits"]);
  const bits = await sutil.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: sal as BufferSource, iterations: 120_000 }, chave, 256);
  return paraBase64(bits);
}

async function protegerSenha(senha: string): Promise<{ sal: string; hash: string }> {
  const sal = globalThis.crypto.getRandomValues(new Uint8Array(16));
  return { sal: paraBase64(sal), hash: await derivarSenha(senha, sal) };
}

async function senhaConfere(senha: string, guardada: { sal: string; hash: string }): Promise<boolean> {
  return (await derivarSenha(senha, deBase64(guardada.sal))) === guardada.hash;
}

function registros(): RegistroUsuario[] {
  return ler<RegistroUsuario[]>(CHAVE.usuarios, []);
}

function usuarioDaSessao(): RegistroUsuario | null {
  const sessao = ler<{ usuarioId: string; iniciadaEm: string } | null>(CHAVE.sessao, null);
  if (!sessao) return null;
  return registros().find((r) => r.usuario.id === sessao.usuarioId) ?? null;
}

function exigirUsuario(): RegistroUsuario {
  const r = usuarioDaSessao();
  if (!r) throw new ErroServico("Sua sessão terminou. Entre novamente.", "sem_sessao");
  return r;
}

function abrirSessao(usuario: Usuario): Sessao {
  const sessao = { usuarioId: usuario.id, iniciadaEm: agora() };
  gravar(CHAVE.sessao, sessao);
  return { usuario, iniciadaEm: sessao.iniciadaEm };
}

export const autenticacaoDemonstracao: ProvedorAutenticacao = {
  nome: "demonstracao",

  async sessaoAtual() {
    const sessao = ler<{ usuarioId: string; iniciadaEm: string } | null>(CHAVE.sessao, null);
    const r = usuarioDaSessao();
    return r && sessao ? { usuario: r.usuario, iniciadaEm: sessao.iniciadaEm } : null;
  },

  async cadastrar(dados: DadosCadastro) {
    const email = normalizarEmail(dados.email);
    const lista = registros();
    if (lista.some((r) => r.usuario.email === email)) {
      throw new ErroServico("Já existe uma conta com este e-mail. Entre ou recupere a senha.", "email_em_uso");
    }
    const usuario: Usuario = {
      id: novoId("usr"),
      nome: dados.nome.trim(),
      email,
      empresa: dados.empresa?.trim() || null,
      cnpj: dados.cnpj?.trim() || null,
      telefone: dados.telefone?.trim() || null,
      criadoEm: agora(),
    };
    lista.push({ usuario, senha: await protegerSenha(dados.senha) });
    gravar(CHAVE.usuarios, lista);
    return abrirSessao(usuario);
  },

  async entrar(email: string, senha: string) {
    const r = registros().find((x) => x.usuario.email === normalizarEmail(email));
    if (!r || !(await senhaConfere(senha, r.senha))) {
      throw new ErroServico("E-mail ou senha incorretos.", "credenciais_invalidas");
    }
    return abrirSessao(r.usuario);
  },

  async sair() {
    remover(CHAVE.sessao);
  },

  async solicitarRedefinicaoSenha() {
    throw new ErroServico(
      "No modo demonstração nenhum e-mail é enviado. Quando o provedor de autenticação for conectado, o link de redefinição chegará por e-mail.",
      "indisponivel_demonstracao",
    );
  },

  async atualizarPerfil(dados: DadosPerfil) {
    const atual = exigirUsuario();
    const lista = registros();
    const r = lista.find((x) => x.usuario.id === atual.usuario.id)!;
    r.usuario = {
      ...r.usuario,
      nome: dados.nome.trim(),
      empresa: dados.empresa?.trim() || null,
      cnpj: dados.cnpj?.trim() || null,
      telefone: dados.telefone?.trim() || null,
    };
    gravar(CHAVE.usuarios, lista);
    return r.usuario;
  },

  async alterarSenha(senhaAtual: string, novaSenha: string) {
    const atual = exigirUsuario();
    if (!(await senhaConfere(senhaAtual, atual.senha))) throw new ErroServico("A senha atual não confere.", "senha_incorreta");
    const lista = registros();
    lista.find((x) => x.usuario.id === atual.usuario.id)!.senha = await protegerSenha(novaSenha);
    gravar(CHAVE.usuarios, lista);
  },

  async excluirConta() {
    const atual = exigirUsuario();
    const id = atual.usuario.id;
    gravar(CHAVE.usuarios, registros().filter((x) => x.usuario.id !== id));
    const assinaturas = ler<Record<string, Assinatura>>(CHAVE.assinaturas, {});
    delete assinaturas[id];
    gravar(CHAVE.assinaturas, assinaturas);
    const pagamentos = ler<Record<string, Pagamento[]>>(CHAVE.pagamentos, {});
    delete pagamentos[id];
    gravar(CHAVE.pagamentos, pagamentos);
    remover(CHAVE.sessao);
  },
};

function lerAssinatura(usuarioId: string): Assinatura | null {
  return ler<Record<string, Assinatura>>(CHAVE.assinaturas, {})[usuarioId] ?? null;
}

function gravarAssinatura(a: Assinatura): Assinatura {
  const todas = ler<Record<string, Assinatura>>(CHAVE.assinaturas, {});
  todas[a.usuarioId] = a;
  gravar(CHAVE.assinaturas, todas);
  return a;
}

function registrarPagamento(usuarioId: string, p: Pagamento): void {
  const todos = ler<Record<string, Pagamento[]>>(CHAVE.pagamentos, {});
  (todos[usuarioId] ??= []).unshift(p);
  gravar(CHAVE.pagamentos, todos);
}

function exigirPlano(planoId: string) {
  const plano = planoPorId(planoId);
  if (!plano) throw new ErroServico("Plano não encontrado. Escolha um dos planos disponíveis.", "plano_invalido");
  return plano;
}

export const pagamentoDemonstracao: ProvedorPagamento = {
  nome: "demonstracao",

  async assinaturaAtual(usuario: Usuario) {
    return lerAssinatura(usuario.id);
  },

  async registrarEscolhaDePlano(usuario: Usuario, planoId: string, ciclo: CicloCobranca) {
    exigirPlano(planoId);
    const existente = lerAssinatura(usuario.id);
    if (existente && existente.status === "ativa") return existente;
    return gravarAssinatura({
      id: existente?.id ?? novoId("ass"),
      usuarioId: usuario.id,
      planoId,
      ciclo,
      status: "pendente_pagamento",
      criadaEm: existente?.criadaEm ?? agora(),
      inicioPeriodo: null,
      fimPeriodo: null,
      canceladaEm: null,
      formaPagamento: null,
      origem: "demonstracao",
    });
  },

  async iniciarCheckout(pedido: PedidoCheckout): Promise<ResultadoCheckout> {
    const plano = exigirPlano(pedido.planoId);
    const inicio = new Date();
    const existente = lerAssinatura(pedido.usuario.id);
    const assinatura = gravarAssinatura({
      id: existente?.id ?? novoId("ass"),
      usuarioId: pedido.usuario.id,
      planoId: plano.id,
      ciclo: pedido.ciclo,
      status: "ativa",
      criadaEm: existente?.criadaEm ?? agora(),
      inicioPeriodo: inicio.toISOString(),
      fimPeriodo: somarCiclo(inicio, pedido.ciclo).toISOString(),
      canceladaEm: null,
      formaPagamento: pedido.formaPagamento,
      origem: "demonstracao",
    });
    registrarPagamento(pedido.usuario.id, {
      id: novoId("pag"),
      data: inicio.toISOString(),
      descricao: `Plano ${plano.nome} · ${pedido.ciclo} (demonstração, sem cobrança)`,
      valor: valorDoCiclo(plano, pedido.ciclo) ?? 0,
      status: "pago",
      urlComprovante: null,
    });
    return { tipo: "confirmado", assinatura };
  },

  async trocarPlano(usuario: Usuario, planoId: string, ciclo: CicloCobranca) {
    exigirPlano(planoId);
    const atual = lerAssinatura(usuario.id);
    if (!atual) throw new ErroServico("Você ainda não tem uma assinatura. Escolha um plano para começar.", "sem_assinatura");
    return gravarAssinatura({ ...atual, planoId, ciclo });
  },

  async cancelarAssinatura(usuario: Usuario) {
    const atual = lerAssinatura(usuario.id);
    if (!atual) throw new ErroServico("Não há assinatura para cancelar.", "sem_assinatura");
    return gravarAssinatura({ ...atual, status: "cancelada", canceladaEm: agora() });
  },

  async historicoPagamentos(usuario: Usuario) {
    return ler<Record<string, Pagamento[]>>(CHAVE.pagamentos, {})[usuario.id] ?? [];
  },
};
