/**
 * Checkout: confirma o plano e inicia o pagamento pelo provedor configurado.
 * Com um gateway real, o provedor devolve a URL da página de pagamento hospedada e a
 * liberação da conta chega pelo webhook no servidor. No modo demonstração, a assinatura
 * é ativada localmente, sem cobrança, e a tela avisa isso.
 */
import { emDemonstracao, integracoes } from "../config/integracoes.js";
import { configuracaoPlanos, planoPorId, valorDoCiclo, type Plano } from "../config/planos.js";
import { carregarConta, pagamento, type EstadoConta } from "../servicos/conta.js";
import { cicloDaUrl, parametro, rotas } from "../servicos/rotas.js";
import type { Assinatura, CicloCobranca, FormaPagamento } from "../servicos/tipos.js";
import { $, $$, aguardar, esc, faixaDemonstracao, formatarData, formatarMoeda, icone, iniciarPagina, mensagemDeErro, segmentado } from "../ui/comum.js";
import { marcarEtapas, mostrarAlerta } from "../ui/formularios.js";

iniciarPagina();
faixaDemonstracao();
marcarEtapas("pagamento");

const FORMAS: Record<FormaPagamento, { nome: string; detalhe: string; icone: string }> = {
  cartao: { nome: "Cartão de crédito", detalhe: "Cobrança recorrente automática", icone: "cartao" },
  pix: { nome: "Pix", detalhe: "Pagamento instantâneo", icone: "pix" },
  boleto: { nome: "Boleto bancário", detalhe: "Acesso liberado após a compensação", icone: "boleto" },
};

let plano: Plano;
let ciclo: CicloCobranca;
let forma: FormaPagamento = integracoes.pagamento.formas[0] ?? "cartao";
let conta: EstadoConta;

function proximaRenovacao(c: CicloCobranca): string {
  const d = new Date();
  if (c === "anual") d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return formatarData(d.toISOString());
}

function desenharFormas(): void {
  const el = $("[data-formas]")!;
  el.innerHTML = integracoes.pagamento.formas
    .map((f) => {
      const info = FORMAS[f];
      return `<button type="button" class="forma" role="radio" aria-checked="${f === forma}" data-forma="${f}">
        <span class="forma-icone">${icone(info.icone)}</span>
        <span><b>${esc(info.nome)}</b><small>${esc(info.detalhe)}</small></span>
        <span class="forma-radio" aria-hidden="true"></span>
      </button>`;
    })
    .join("");
  el.onclick = (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>(".forma");
    if (!b) return;
    forma = b.dataset.forma as FormaPagamento;
    $$(".forma", el).forEach((x) => x.setAttribute("aria-checked", String(x === b)));
  };
}

function desenharResumo(): void {
  $("[data-resumo-nome]")!.textContent = `Plano ${plano.nome}`;
  $("[data-resumo-desc]")!.textContent = plano.descricao;
  const selo = $("[data-resumo-selo]")!;
  selo.hidden = !(plano.destaque && plano.seloDestaque);
  selo.textContent = plano.seloDestaque ?? "";

  $("[data-resumo-itens]")!.innerHTML = [
    "Acesso completo ao sistema de análise",
    ...plano.limites.map((l) => `${l.rotulo}: ${l.valor}`),
    `${plano.recursos.length} recursos incluídos`,
  ]
    .map((t) => `<li>${icone("check", "i-sm")}<span>${esc(t)}</span></li>`)
    .join("");

  const valor = valorDoCiclo(plano, ciclo);
  const linhas: string[] = [];
  if (ciclo === "anual" && plano.precoMensal != null && plano.precoAnual != null) {
    const cheio = plano.precoMensal * 12;
    linhas.push(`<div><dt>12 meses × ${formatarMoeda(plano.precoMensal)}</dt><dd>${formatarMoeda(cheio)}</dd></div>`);
    if (cheio > plano.precoAnual) linhas.push(`<div class="desconto"><dt>Desconto do plano anual</dt><dd>− ${formatarMoeda(cheio - plano.precoAnual)}</dd></div>`);
  } else {
    linhas.push(`<div><dt>Plano ${esc(plano.nome)} · mensal</dt><dd>${formatarMoeda(valor)}</dd></div>`);
  }
  linhas.push(`<div class="total"><dt>Total hoje</dt><dd>${formatarMoeda(valor)}</dd></div>`);
  $("[data-resumo-valores]")!.innerHTML = linhas.join("");
  $("[data-resumo-nota]")!.textContent = `Renovação automática em ${proximaRenovacao(ciclo)}. Você pode trocar de plano ou cancelar pela área do cliente.`;
  if (configuracaoPlanos.valoresIlustrativos) $("[data-resumo-nota]")!.textContent += ` ${configuracaoPlanos.textoValoresIlustrativos}`;
  history.replaceState(null, "", rotas.checkout(plano.id, ciclo));
  avaliarAssinaturaAtual();
}

/** Ajusta a tela quando o cliente já tem uma assinatura ativa. */
function avaliarAssinaturaAtual(): void {
  const aviso = $("[data-aviso-assinatura]")!;
  const botao = $<HTMLButtonElement>("[data-confirmar]")!;
  const a = conta.assinatura;
  botao.disabled = false;
  if (a && a.status === "ativa" && a.planoId === plano.id && a.ciclo === ciclo) {
    aviso.innerHTML = `${icone("check-circulo")}<span>Você já tem o plano <strong>${esc(plano.nome)}</strong> ativo, válido até ${formatarData(a.fimPeriodo)}. <a class="auth-link" href="${rotas.conta}">Ir para minha conta</a></span>`;
    aviso.hidden = false;
    botao.disabled = true;
  } else if (a && a.status === "ativa") {
    const atual = planoPorId(a.planoId);
    aviso.innerHTML = `${icone("info")}<span>Seu plano atual é o <strong>${esc(atual?.nome ?? a.planoId)}</strong> (${a.ciclo}). Ao confirmar, a assinatura passa para o <strong>${esc(plano.nome)}</strong> (${ciclo}).</span>`;
    aviso.hidden = false;
  } else {
    aviso.hidden = true;
  }
  botao.innerHTML =
    a?.status === "ativa"
      ? `Confirmar troca de plano ${icone("seta", "i-seta")}`
      : emDemonstracao()
        ? `Confirmar assinatura ${icone("seta", "i-seta")}`
        : `Ir para o pagamento seguro ${icone("cadeado")}`;
}

function mostrarSucesso(a: Assinatura, trocou: boolean): void {
  marcarEtapas("acesso", ["acesso"]);
  $("[data-pedido]")!.hidden = true;
  const sucesso = $("[data-sucesso]")!;
  sucesso.hidden = false;
  const p = planoPorId(a.planoId) ?? plano;
  $("[data-sucesso-texto]")!.textContent = trocou
    ? `Pronto, ${conta.sessao!.usuario.nome.split(" ")[0]}! Seu plano agora é o ${p.nome}.`
    : `Tudo certo, ${conta.sessao!.usuario.nome.split(" ")[0]}! Sua assinatura do plano ${p.nome} está ativa e o sistema já está liberado.`;
  $("[data-sucesso-detalhes]")!.innerHTML = [
    ["Plano", p.nome],
    ["Cobrança", `${formatarMoeda(valorDoCiclo(p, a.ciclo))} / ${a.ciclo === "anual" ? "ano" : "mês"}`],
    ["Próxima renovação", formatarData(a.fimPeriodo)],
  ]
    .map(([t, v]) => `<div><dt>${esc(t)}</dt><dd>${esc(v)}</dd></div>`)
    .join("");
  scrollTo({ top: 0, behavior: "smooth" });
}

async function confirmar(): Promise<void> {
  const botao = $<HTMLButtonElement>("[data-confirmar]")!;
  const erro = $("[data-erro]");
  mostrarAlerta(erro, "");
  aguardar(botao, true, "Processando...");
  try {
    const usuario = conta.sessao!.usuario;
    if (conta.assinatura?.status === "ativa") {
      const a = await pagamento.trocarPlano(usuario, plano.id, ciclo);
      return mostrarSucesso(a, true);
    }
    const resultado = await pagamento.iniciarCheckout({ usuario, planoId: plano.id, ciclo, formaPagamento: forma });
    if (resultado.tipo === "redirecionar") {
      location.href = resultado.url;
      return;
    }
    mostrarSucesso(resultado.assinatura, false);
  } catch (err) {
    aguardar(botao, false);
    mostrarAlerta(erro, mensagemDeErro(err));
  }
}

async function iniciar(): Promise<void> {
  conta = await carregarConta();
  const planoUrl = planoPorId(parametro("plano"));
  const cicloUrl = cicloDaUrl();
  if (!conta.sessao) {
    location.replace(rotas.cadastro(planoUrl?.id ?? null, cicloUrl));
    return;
  }
  const escolhido = planoUrl ?? planoPorId(conta.assinatura?.planoId);
  if (!escolhido) {
    location.replace(rotas.planos);
    return;
  }
  plano = escolhido;
  ciclo = cicloUrl ?? conta.assinatura?.ciclo ?? configuracaoPlanos.cicloPadrao;

  $("[data-saudacao]")!.textContent = `${conta.sessao.usuario.nome.split(" ")[0]}, revise o plano e escolha como prefere pagar.`;
  $("[data-demo-checkout]")!.hidden = !emDemonstracao();
  const vantagem = $("[data-vantagem-anual]");
  if (vantagem) vantagem.textContent = configuracaoPlanos.vantagemAnual;

  $("[data-carregando]")!.hidden = true;
  $("[data-pedido]")!.hidden = false;
  desenharFormas();
  segmentado($("[data-ciclo]")!, (valor) => {
    ciclo = valor === "anual" ? "anual" : "mensal";
    desenharResumo();
  })(ciclo);
  desenharResumo();
  $("[data-confirmar]")!.addEventListener("click", confirmar);
}

iniciar().catch((err) => {
  $("[data-carregando]")!.hidden = true;
  $("[data-pedido]")!.hidden = false;
  mostrarAlerta($("[data-erro]"), mensagemDeErro(err));
});
