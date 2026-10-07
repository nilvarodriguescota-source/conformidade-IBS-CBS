/**
 * Área do cliente: início, sistema, assinatura, perfil e configurações.
 *
 * O sistema de XML é aberto como está (sistema.html), dentro de um iframe da mesma
 * origem; nada nele é alterado. Os atalhos só clicam no botão da aba correspondente,
 * como o usuário faria.
 */
import { emDemonstracao } from "../config/integracoes.js";
import { catalogoRecursos, configuracaoPlanos, equivalenteMensal, valorDoCiclo, type Plano, type RecursoId } from "../config/planos.js";
import { situacaoDeAcesso } from "../servicos/acesso.js";
import { autenticacao, carregarConta, pagamento, type EstadoConta } from "../servicos/conta.js";
import { rotas } from "../servicos/rotas.js";
import type { Assinatura, CicloCobranca, FormaPagamento, StatusAssinatura } from "../servicos/tipos.js";
import {
  $,
  $$,
  aguardar,
  alternarSenhas,
  avisar,
  esc,
  faixaDemonstracao,
  formatarData,
  formatarMoeda,
  icone,
  iniciarPagina,
  mensagemDeErro,
  segmentado,
} from "../ui/comum.js";
import { aplicarMascaras, cnpjValido, erroNoCampo, limparErros, medidorDeSenha, mostrarAlerta } from "../ui/formularios.js";

const SECOES = {
  inicio: "Início",
  sistema: "Sistema",
  assinatura: "Minha assinatura",
  perfil: "Perfil",
  configuracoes: "Configurações",
} as const;
type Secao = keyof typeof SECOES;

/**
 * PONTO DE INTEGRAÇÃO com o sistema de XML: `tela` é o id usado pelo sistema em
 * abrirTela('<id>') (src/pagina.ts). Se uma tela do sistema mudar de id, ajuste aqui.
 */
const MODULOS: Array<{ tela: string; nome: string; texto: string; icone: string; recurso: RecursoId }> = [
  { tela: "importar", nome: "Análise de XMLs", texto: "Envie e processe as notas de venda", icone: "upload", recurso: "analise_xml" },
  { tela: "dashboard", nome: "Dashboard", texto: "Situação da empresa e economia", icone: "painel", recurso: "dashboard" },
  { tela: "resultados", nome: "Resultados", texto: "Item a item, com filtros", icone: "lista", recurso: "resultados" },
  { tela: "pendentes", nome: "Pendências", texto: "O que precisa da sua decisão", icone: "mao", recurso: "pendencias" },
  { tela: "relatorio-final", nome: "Relatório Final", texto: "O que ajustar no cadastro", icone: "relatorio", recurso: "relatorio_csv" },
  { tela: "consulta-ncm", nome: "Consulta por NCM", texto: "Consulte antes de cadastrar", icone: "lupa", recurso: "consulta_ncm" },
];

const STATUS: Record<StatusAssinatura, { rotulo: string; classe: string }> = {
  ativa: { rotulo: "Ativa", classe: "chip-ok" },
  pendente_pagamento: { rotulo: "Pagamento pendente", classe: "chip-pend" },
  em_atraso: { rotulo: "Pagamento em atraso", classe: "chip-risco" },
  cancelada: { rotulo: "Cancelada", classe: "chip-neutro" },
};

const FORMAS: Record<FormaPagamento, string> = { cartao: "Cartão de crédito", pix: "Pix", boleto: "Boleto bancário" };

let conta: EstadoConta;

/* ---------------- Utilitários ---------------- */

const primeiroNome = () => conta.sessao!.usuario.nome.split(/\s+/)[0] ?? "";

function iniciais(nome: string): string {
  const partes = nome.trim().split(/\s+/);
  return ((partes[0]?.[0] ?? "") + (partes.length > 1 ? (partes[partes.length - 1]?.[0] ?? "") : "")).toUpperCase() || "·";
}

function chipStatus(a: Assinatura | null): string {
  if (!a) return `<span class="chip chip-neutro">Sem plano</span>`;
  const s = STATUS[a.status];
  return `<span class="chip ${s.classe}">${esc(s.rotulo)}</span>`;
}

function precoDoCiclo(p: Plano | undefined, ciclo: CicloCobranca): string {
  if (!p) return "—";
  return `${formatarMoeda(valorDoCiclo(p, ciclo))} / ${ciclo === "anual" ? "ano" : "mês"}`;
}

function confirmar(opcoes: { titulo: string; texto: string; ok: string; perigo?: boolean }): Promise<boolean> {
  const dialogo = $<HTMLDialogElement>("[data-dialogo]")!;
  $("[data-dialogo-titulo]", dialogo)!.textContent = opcoes.titulo;
  $("[data-dialogo-texto]", dialogo)!.textContent = opcoes.texto;
  $("[data-dialogo-icone]", dialogo)!.innerHTML = icone(opcoes.perigo ? "alerta" : "info");
  const ok = $<HTMLButtonElement>("[data-dialogo-ok]", dialogo)!;
  ok.textContent = opcoes.ok;
  ok.className = `btn ${opcoes.perigo ? "btn-perigo" : "btn-verde"}`;
  dialogo.returnValue = "";
  dialogo.showModal();
  return new Promise((resolve) => dialogo.addEventListener("close", () => resolve(dialogo.returnValue === "ok"), { once: true }));
}

async function recarregar(): Promise<void> {
  conta = await carregarConta();
  if (!conta.sessao) {
    location.replace(rotas.entrar(rotas.conta));
    return;
  }
  preencher();
}

/* ---------------- Preenchimento ---------------- */

function preencherUsuario(): void {
  const u = conta.sessao!.usuario;
  $$("[data-usuario-nome]").forEach((el) => (el.textContent = u.nome));
  $$("[data-usuario-email]").forEach((el) => (el.textContent = u.email));
  $$("[data-avatar]").forEach((el) => (el.textContent = iniciais(u.nome)));
  $("[data-perfil-desde]")!.textContent = `Cliente desde ${formatarData(u.criadoEm)}${u.empresa ? ` · ${u.empresa}` : ""}`;
}

function preencherLateral(): void {
  $("[data-lateral-plano-nome]")!.textContent = conta.plano?.nome ?? "Sem plano";
  $("[data-lateral-plano-status]")!.innerHTML = chipStatus(conta.assinatura);
  $("[data-topo-status]")!.innerHTML = chipStatus(conta.assinatura);
  const selo = $("[data-selo-sistema]");
  if (selo) selo.hidden = conta.acesso.liberado;
}

function preencherInicio(): void {
  const hora = new Date().getHours();
  const saudacao = hora < 12 ? "Bom dia" : hora < 18 ? "Boa tarde" : "Boa noite";
  $("[data-saudacao-dia]")!.textContent = conta.acesso.liberado ? "Acesso liberado" : conta.acesso.titulo;
  $("[data-saudacao]")!.innerHTML = `${saudacao}, <em>${esc(primeiroNome())}</em>.`;
  $("[data-boas-vindas-texto]")!.textContent = conta.acesso.liberado
    ? conta.acesso.motivo === "ativa"
      ? "Seu ambiente de conformidade está pronto. Continue a análise de onde parou ou envie novos XMLs."
      : conta.acesso.mensagem
    : conta.acesso.mensagem;

  const acoes = $("[data-boas-vindas-acoes]")!;
  if (conta.acesso.liberado) {
    acoes.innerHTML = `<a class="btn btn-ouro btn-grande" href="#sistema">${icone("play", "i-sm")}Abrir sistema</a>
      <a class="btn btn-fantasma btn-grande" href="#sistema/consulta-ncm">${icone("lupa", "i-sm")}Consultar um NCM</a>`;
  } else {
    const acao = conta.acesso.acao;
    acoes.innerHTML = `${acao ? `<a class="btn btn-ouro btn-grande" href="${esc(acao.href)}">${esc(acao.rotulo)} ${icone("seta", "i-seta")}</a>` : ""}
      <a class="btn btn-fantasma btn-grande" href="#assinatura">Ver minha assinatura</a>`;
  }

  const a = conta.assinatura;
  $("[data-status-plano]")!.textContent = conta.plano?.nome ?? "Nenhum plano";
  $("[data-status-plano-preco]")!.textContent = a ? precoDoCiclo(conta.plano, a.ciclo) : "Escolha um plano para começar";
  $("[data-status-assinatura]")!.innerHTML = chipStatus(a);
  $("[data-status-assinatura-texto]")!.textContent = conta.acesso.mensagem;

  const rotuloData = $("[data-status-data-rotulo]")!;
  const data = $("[data-status-data]")!;
  const textoData = $("[data-status-data-texto]")!;
  if (a?.status === "ativa" || a?.status === "em_atraso") {
    rotuloData.textContent = "Próxima renovação";
    data.textContent = formatarData(a.fimPeriodo);
    textoData.textContent = `Renovação automática · ${a.ciclo === "anual" ? "plano anual" : "plano mensal"}`;
  } else if (a?.status === "cancelada") {
    rotuloData.textContent = conta.acesso.liberado ? "Acesso até" : "Acesso encerrado em";
    data.textContent = formatarData(a.fimPeriodo);
    textoData.textContent = "Sem novas cobranças";
  } else if (a) {
    rotuloData.textContent = "Plano escolhido em";
    data.textContent = formatarData(a.criadaEm);
    textoData.textContent = "Aguardando a confirmação do pagamento";
  } else {
    rotuloData.textContent = "Próxima renovação";
    data.textContent = "—";
    textoData.textContent = "Nenhuma assinatura ainda";
  }

  $("[data-atalhos]")!.innerHTML = MODULOS.map(
    (m) => `<a class="atalho${conta.acesso.liberado ? "" : " bloqueado"}" href="#sistema/${m.tela}">
      <span class="atalho-icone">${icone(m.icone)}</span>
      <svg class="i i-sm atalho-seta" aria-hidden="true"><use href="#i-seta"/></svg>
      <b>${esc(m.nome)}</b><small>${esc(m.texto)}</small>
    </a>`,
  ).join("");

  $("[data-recursos-plano]")!.innerHTML = listaRecursos(conta.plano);
}

function listaRecursos(plano: Plano | undefined): string {
  if (!plano) return `<li class="vazio">Nenhum plano ativo. <a class="cartao-link" href="${rotas.planos}">Ver planos</a></li>`;
  return plano.recursos
    .map((r) => `<li><span class="marca-check">${icone("check")}</span><span>${esc(catalogoRecursos[r].nome)}<small>${esc(catalogoRecursos[r].detalhe)}</small></span></li>`)
    .join("");
}

function preencherAssinatura(): void {
  const a = conta.assinatura;
  const p = conta.plano;
  $("[data-assinatura-nome]")!.textContent = p ? `Plano ${p.nome}` : "Nenhum plano ativo";
  $("[data-assinatura-desc]")!.textContent = p?.descricao ?? "Escolha um plano para liberar o acesso ao sistema.";
  $("[data-assinatura-status]")!.innerHTML = chipStatus(a);

  const dados: Array<[string, string]> = a
    ? [
        ["Valor", precoDoCiclo(p, a.ciclo)],
        ["Período atual", a.inicioPeriodo ? `${new Date(a.inicioPeriodo).toLocaleDateString("pt-BR")} a ${new Date(a.fimPeriodo!).toLocaleDateString("pt-BR")}` : "Aguardando pagamento"],
        [a.status === "cancelada" ? "Acesso até" : "Próxima renovação", formatarData(a.fimPeriodo)],
        ["Forma de pagamento", a.formaPagamento ? FORMAS[a.formaPagamento] : "—"],
      ]
    : [["Status", "Sem assinatura"]];
  $("[data-assinatura-dados]")!.innerHTML = dados.map(([t, v]) => `<div><dt>${esc(t)}</dt><dd>${esc(v)}</dd></div>`).join("");

  const checkout = a ? rotas.checkout(a.planoId, a.ciclo) : rotas.planos;
  const botoes: string[] = [];
  if (!a) botoes.push(`<a class="btn btn-ouro" href="${rotas.planos}">Ver planos ${icone("seta", "i-seta")}</a>`);
  else if (a.status === "pendente_pagamento") botoes.push(`<a class="btn btn-ouro" href="${esc(checkout)}">Concluir pagamento ${icone("seta", "i-seta")}</a>`);
  else if (a.status === "em_atraso") botoes.push(`<a class="btn btn-ouro" href="${esc(checkout)}">Atualizar pagamento ${icone("seta", "i-seta")}</a>`);
  else if (a.status === "cancelada") botoes.push(`<a class="btn btn-ouro" href="${esc(checkout)}">Reativar assinatura ${icone("seta", "i-seta")}</a>`);
  botoes.push(`<button type="button" class="btn ${a?.status === "ativa" ? "btn-ouro" : "btn-fantasma"}" data-mostrar-troca>${icone("camadas", "i-sm")}Trocar de plano</button>`);
  if (a && (a.status === "ativa" || a.status === "em_atraso")) botoes.push(`<button type="button" class="btn btn-fantasma" data-cancelar>Cancelar assinatura</button>`);
  const acoes = $("[data-assinatura-acoes]")!;
  acoes.innerHTML = botoes.join("");
  $("[data-mostrar-troca]", acoes)?.addEventListener("click", () => {
    const troca = $("[data-trocar-plano]")!;
    troca.hidden = !troca.hidden;
    if (!troca.hidden) troca.scrollIntoView({ behavior: "smooth", block: "start" });
  });
  $("[data-cancelar]", acoes)?.addEventListener("click", cancelarAssinatura);

  const alerta = $("[data-assinatura-alerta]");
  if (conta.acesso.motivo === "ativa") mostrarAlerta(alerta, "");
  else mostrarAlerta(alerta, `${conta.acesso.titulo}. ${conta.acesso.mensagem}`, conta.acesso.liberado ? "aviso" : "erro", false);

  desenharTrocaDePlano(a?.ciclo ?? configuracaoPlanos.cicloPadrao);
  $("[data-recursos-assinatura]")!.innerHTML = listaRecursos(p);
  $("[data-pagamento-texto]")!.textContent = !a
    ? "Nenhuma forma de pagamento cadastrada."
    : emDemonstracao()
      ? `Forma escolhida: ${a.formaPagamento ? FORMAS[a.formaPagamento] : "—"}. Modo demonstração: nenhuma cobrança real é feita.`
      : `Forma escolhida: ${a.formaPagamento ? FORMAS[a.formaPagamento] : "—"}. A cobrança é feita automaticamente pelo meio de pagamento.`;
  preencherHistorico();
}

let cicloTroca: CicloCobranca = "mensal";
let seletorTroca: ((v: string) => void) | null = null;

function desenharTrocaDePlano(ciclo: CicloCobranca): void {
  cicloTroca = ciclo;
  const desenhar = () => {
    $("[data-planos-troca]")!.innerHTML = configuracaoPlanos.planos
      .map((p) => {
        const atual = conta.assinatura?.planoId === p.id && conta.assinatura.ciclo === cicloTroca && conta.assinatura.status === "ativa";
        const mensal = equivalenteMensal(p, cicloTroca);
        return `<div class="plano-compacto${atual ? " atual" : ""}">
          <b>${esc(p.nome)}</b>
          <span class="preco">${mensal == null ? "Sob consulta" : `${formatarMoeda(mensal)}/mês`}${cicloTroca === "anual" && p.precoAnual != null ? ` <small>· ${formatarMoeda(p.precoAnual)} por ano</small>` : ""}</span>
          <small>${esc(p.limites.map((l) => `${l.rotulo}: ${l.valor}`).join(" · "))}</small>
          ${atual ? `<span class="btn btn-contorno btn-pequeno" aria-disabled="true">Plano atual</span>` : `<a class="btn btn-verde btn-pequeno" href="${esc(rotas.checkout(p.id, cicloTroca))}">Escolher ${esc(p.nome)}</a>`}
        </div>`;
      })
      .join("");
  };
  if (!seletorTroca) {
    seletorTroca = segmentado($("[data-ciclo-troca]")!, (v) => {
      cicloTroca = v === "anual" ? "anual" : "mensal";
      desenhar();
    });
  }
  seletorTroca(ciclo);
  desenhar();
}

async function preencherHistorico(): Promise<void> {
  const el = $("[data-historico]")!;
  try {
    const lista = await pagamento.historicoPagamentos(conta.sessao!.usuario);
    if (!lista.length) {
      el.innerHTML = `<div class="vazio-estado">${icone("recibo")}<span>Nenhum pagamento registrado ainda.</span></div>`;
      return;
    }
    const nomes = { pago: ["Pago", "chip-ok"], pendente: ["Pendente", "chip-pend"], falhou: ["Falhou", "chip-risco"], estornado: ["Estornado", "chip-neutro"] } as const;
    el.innerHTML = `<div class="tabela-rolagem"><table class="tabela"><thead><tr><th>Data</th><th>Descrição</th><th>Status</th><th>Valor</th></tr></thead><tbody>
      ${lista
        .map(
          (p) => `<tr><td>${new Date(p.data).toLocaleDateString("pt-BR")}</td><td>${esc(p.descricao)}${p.urlComprovante ? ` · <a class="cartao-link" href="${esc(p.urlComprovante)}" target="_blank" rel="noopener">comprovante</a>` : ""}</td>
          <td><span class="chip ${nomes[p.status][1]}">${nomes[p.status][0]}</span></td><td class="valor">${formatarMoeda(p.valor)}</td></tr>`,
        )
        .join("")}</tbody></table></div>`;
  } catch (e) {
    el.innerHTML = `<div class="vazio-estado">${icone("info")}<span>${esc(mensagemDeErro(e))}</span></div>`;
  }
}

function preencherPerfil(): void {
  const u = conta.sessao!.usuario;
  const form = $<HTMLFormElement>("[data-form-perfil]")!;
  const campo = (n: string) => form.elements.namedItem(n) as HTMLInputElement;
  campo("nome").value = u.nome;
  campo("email").value = u.email;
  campo("empresa").value = u.empresa ?? "";
  campo("cnpj").value = u.cnpj ?? "";
  campo("telefone").value = u.telefone ?? "";
}

function preencher(): void {
  preencherUsuario();
  preencherLateral();
  preencherInicio();
  preencherAssinatura();
  preencherPerfil();
  // Se o acesso mudou (ex.: cancelamento encerrado), o painel do sistema se ajusta
  if (sistemaVisivel()) abrirSistema(null);
}

/* ---------------- Sistema (iframe, sem alterações no sistema) ---------------- */

let moldura: HTMLIFrameElement | null = null;
let sistemaPronto = false;
let abaPendente: string | null = null;

const sistemaVisivel = () => !$("[data-painel=sistema]")!.hidden;

function irParaAba(tela: string): void {
  try {
    const doc = moldura?.contentDocument;
    const botao = doc?.querySelector<HTMLButtonElement>(`nav button[onclick*="'${tela}'"]`);
    botao?.click();
  } catch {
    /* sistema indisponível: fica na tela atual */
  }
}

function abrirSistema(aba: string | null): void {
  const bloqueado = $("[data-sistema-bloqueado]")!;
  const caixa = $("[data-moldura-sistema]")!;
  const liberado = situacaoDeAcesso(conta.sessao, conta.assinatura).liberado;
  $("[data-tela-cheia]")!.hidden = !liberado;
  if (!liberado) {
    caixa.hidden = true;
    bloqueado.hidden = false;
    $("[data-bloqueio-titulo]")!.textContent = conta.acesso.titulo;
    $("[data-bloqueio-texto]")!.textContent = conta.acesso.mensagem;
    const acao = conta.acesso.acao;
    $("[data-bloqueio-acao]")!.innerHTML = acao ? `<a class="btn btn-verde btn-grande" href="${esc(acao.href)}">${esc(acao.rotulo)} ${icone("seta", "i-seta")}</a>` : "";
    return;
  }
  bloqueado.hidden = true;
  caixa.hidden = false;
  const tela = aba && /^[\w-]+$/.test(aba) ? aba : null;
  if (!moldura) {
    abaPendente = tela;
    moldura = document.createElement("iframe");
    moldura.title = "Sistema Conformidade IBS/CBS";
    moldura.src = rotas.sistema;
    moldura.addEventListener("load", () => {
      sistemaPronto = true;
      $("[data-sistema-carregando]")?.remove();
      if (abaPendente) irParaAba(abaPendente);
      abaPendente = null;
    });
    caixa.append(moldura);
  } else if (tela) {
    if (sistemaPronto) irParaAba(tela);
    else abaPendente = tela;
  }
}

/* ---------------- Navegação entre seções ---------------- */

function roteador(): void {
  const [bruta, sub] = location.hash.slice(1).split("/");
  const secao: Secao = bruta && bruta in SECOES ? (bruta as Secao) : "inicio";
  for (const painel of $$("[data-painel]")) painel.hidden = painel.dataset.painel !== secao;
  $$("[data-ir]").forEach((a) => {
    const ativo = a.dataset.ir === secao;
    a.classList.toggle("ativo", ativo);
    if (a.closest(".app-nav, .app-abas")) {
      if (ativo) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    }
  });
  $("[data-titulo-secao]")!.textContent = SECOES[secao];
  document.title = `${SECOES[secao]} · Conformidade IBS/CBS`;
  fecharMenuUsuario();
  if (secao === "sistema") abrirSistema(sub ?? null);
  else scrollTo({ top: 0 });
}

/* ---------------- Ações ---------------- */

async function sair(): Promise<void> {
  await autenticacao.sair();
  location.href = rotas.inicio;
}

async function cancelarAssinatura(): Promise<void> {
  const a = conta.assinatura;
  if (!a) return;
  const ok = await confirmar({
    titulo: "Cancelar assinatura?",
    texto: `Você continua com acesso até ${formatarData(a.fimPeriodo)}. Depois disso, o sistema fica bloqueado até a assinatura ser reativada.`,
    ok: "Cancelar assinatura",
    perigo: true,
  });
  if (!ok) return;
  try {
    await pagamento.cancelarAssinatura(conta.sessao!.usuario);
    await recarregar();
    avisar("Assinatura cancelada.");
  } catch (e) {
    mostrarAlerta($("[data-assinatura-alerta]"), mensagemDeErro(e));
  }
}

function fecharMenuUsuario(): void {
  const lista = $("[data-menu-usuario]");
  if (!lista || lista.hidden) return;
  lista.hidden = true;
  $("[data-abrir-menu-usuario]")?.setAttribute("aria-expanded", "false");
}

function iniciarAcoes(): void {
  $$("[data-sair]").forEach((b) => b.addEventListener("click", sair));

  const botaoMenu = $<HTMLButtonElement>("[data-abrir-menu-usuario]")!;
  const lista = $("[data-menu-usuario]")!;
  botaoMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    lista.hidden = !lista.hidden;
    botaoMenu.setAttribute("aria-expanded", String(!lista.hidden));
    if (!lista.hidden) $<HTMLElement>("a, button", lista)?.focus();
  });
  document.addEventListener("click", (e) => {
    if (!(e.target as HTMLElement).closest(".menu-usuario")) fecharMenuUsuario();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") fecharMenuUsuario();
  });

  // Perfil
  const formPerfil = $<HTMLFormElement>("[data-form-perfil]")!;
  formPerfil.addEventListener("submit", async (e) => {
    e.preventDefault();
    limparErros(formPerfil);
    const campo = (n: string) => formPerfil.elements.namedItem(n) as HTMLInputElement;
    const retorno = $("[data-perfil-retorno]");
    if (campo("nome").value.trim().length < 2) return erroNoCampo(campo("nome"), "Informe seu nome.");
    if (campo("cnpj").value.trim() && !cnpjValido(campo("cnpj").value)) return erroNoCampo(campo("cnpj"), "CNPJ inválido.");
    const botao = formPerfil.querySelector<HTMLButtonElement>("button[type=submit]")!;
    aguardar(botao, true, "Salvando...");
    try {
      const usuario = await autenticacao.atualizarPerfil({
        nome: campo("nome").value,
        empresa: campo("empresa").value || null,
        cnpj: campo("cnpj").value || null,
        telefone: campo("telefone").value || null,
      });
      conta.sessao = { ...conta.sessao!, usuario };
      preencherUsuario();
      preencherInicio();
      mostrarAlerta(retorno, "Dados atualizados.", "sucesso");
    } catch (err) {
      mostrarAlerta(retorno, mensagemDeErro(err));
    } finally {
      aguardar(botao, false);
    }
  });

  // Senha
  const formSenha = $<HTMLFormElement>("[data-form-senha]")!;
  const nova = formSenha.elements.namedItem("nova") as HTMLInputElement;
  medidorDeSenha(nova, $("[data-forca]", formSenha), $("[data-forca-texto]", formSenha));
  formSenha.addEventListener("submit", async (e) => {
    e.preventDefault();
    limparErros(formSenha);
    const atual = formSenha.elements.namedItem("atual") as HTMLInputElement;
    const retorno = $("[data-senha-retorno]");
    if (!atual.value) return erroNoCampo(atual, "Informe a senha atual.");
    if (nova.value.length < 8) return erroNoCampo(nova, "A nova senha precisa ter pelo menos 8 caracteres.");
    const botao = formSenha.querySelector<HTMLButtonElement>("button[type=submit]")!;
    aguardar(botao, true, "Atualizando...");
    try {
      await autenticacao.alterarSenha(atual.value, nova.value);
      formSenha.reset();
      $("[data-forca]", formSenha)?.removeAttribute("data-nivel");
      mostrarAlerta(retorno, "Senha atualizada.", "sucesso");
    } catch (err) {
      mostrarAlerta(retorno, mensagemDeErro(err));
    } finally {
      aguardar(botao, false);
    }
  });

  // Excluir conta
  $("[data-excluir-conta]")!.addEventListener("click", async () => {
    const ok = await confirmar({
      titulo: "Excluir sua conta?",
      texto: "A conta e o vínculo com a assinatura serão removidos. Esta ação não pode ser desfeita.",
      ok: "Excluir conta",
      perigo: true,
    });
    if (!ok) return;
    try {
      await autenticacao.excluirConta();
      location.href = rotas.inicio;
    } catch (err) {
      avisar(mensagemDeErro(err));
    }
  });
}

/* ---------------- Início ---------------- */

async function iniciar(): Promise<void> {
  iniciarPagina();
  faixaDemonstracao();
  alternarSenhas();
  aplicarMascaras();
  conta = await carregarConta();
  if (!conta.sessao) {
    location.replace(rotas.entrar(`${rotas.conta}${location.hash}`));
    return;
  }
  document.body.classList.remove("carregando-conta");
  iniciarAcoes();
  preencher();
  roteador();
  addEventListener("hashchange", roteador);
}

iniciar().catch((e) => {
  document.body.classList.remove("carregando-conta");
  avisar(mensagemDeErro(e));
});
