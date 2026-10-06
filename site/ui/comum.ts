/** Utilitários de interface usados por todas as páginas do site. */
import { emDemonstracao } from "../config/integracoes.js";
import { configuracaoPlanos } from "../config/planos.js";
import { produto } from "../config/produto.js";
import { rotas } from "../servicos/rotas.js";
import { ErroServico } from "../servicos/tipos.js";

export const $ = <T extends Element = HTMLElement>(seletor: string, raiz: ParentNode = document) => raiz.querySelector<T>(seletor);
export const $$ = <T extends Element = HTMLElement>(seletor: string, raiz: ParentNode = document) => Array.from(raiz.querySelectorAll<T>(seletor));

export function esc(texto: unknown): string {
  return String(texto ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

export function icone(nome: string, classe = ""): string {
  return `<svg class="i ${classe}" aria-hidden="true"><use href="#i-${nome}"/></svg>`;
}

const moeda = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
const moedaInteira = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 0 });
const numeroDecimal = new Intl.NumberFormat("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatarMoeda(valor: number | null | undefined): string {
  return valor == null ? "Sob consulta" : moeda.format(valor);
}

/** Parte numérica do preço, sem "R$" (inteiro quando não há centavos). */
export function numeroDoPreco(valor: number): string {
  return Number.isInteger(valor) ? moedaInteira.format(valor) : numeroDecimal.format(valor);
}

export function formatarData(iso: string | null | undefined): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
}

export function mensagemDeErro(e: unknown): string {
  if (e instanceof ErroServico) return e.message;
  console.error(e);
  return "Algo não saiu como esperado. Tente de novo em instantes.";
}

/** Botão em estado de espera (texto original volta ao terminar). */
export function aguardar(botao: HTMLButtonElement, ativo: boolean, texto = "Aguarde..."): void {
  if (ativo) {
    botao.dataset.textoOriginal ??= botao.innerHTML;
    botao.disabled = true;
    botao.innerHTML = `<span class="carregando" aria-hidden="true"></span>${esc(texto)}`;
  } else {
    botao.disabled = false;
    if (botao.dataset.textoOriginal) botao.innerHTML = botao.dataset.textoOriginal;
    delete botao.dataset.textoOriginal;
  }
}

let temporizadorAviso = 0;
export function avisar(mensagem: string): void {
  let el = $(".aviso-flutuante");
  if (!el) {
    el = document.createElement("div");
    el.className = "aviso-flutuante";
    el.setAttribute("role", "status");
    document.body.append(el);
  }
  el.innerHTML = `${icone("check-circulo")}<span>${esc(mensagem)}</span>`;
  requestAnimationFrame(() => el!.classList.add("visivel"));
  clearTimeout(temporizadorAviso);
  temporizadorAviso = window.setTimeout(() => el!.classList.remove("visivel"), 3200);
}

/** Elementos com data-revelar aparecem suavemente ao entrar na tela. */
export function revelarAoRolar(raiz: ParentNode = document): void {
  const alvos = $$("[data-revelar]:not(.visivel)", raiz);
  if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
    alvos.forEach((el) => el.classList.add("visivel"));
    return;
  }
  const obs = new IntersectionObserver(
    (entradas) => {
      for (const e of entradas) {
        if (!e.isIntersecting) continue;
        e.target.classList.add("visivel");
        obs.unobserve(e.target);
      }
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
  );
  alvos.forEach((el) => obs.observe(el));
}

/** "5548991040611" → "(48) 99104-0611" (aceita com ou sem o 55). */
export function formatarTelefone(numeros: string): string {
  const d = numeros.replace(/\D/g, "").replace(/^55(?=\d{10,11}$)/, "");
  if (d.length === 11) return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
  if (d.length === 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return numeros;
}

/**
 * Preenche contatos e dados da empresa a partir de config/produto.ts (ou "a definir").
 * data-contato="email|whatsapp|instagram|horario"; com data-icone, o link leva o ícone;
 * data-maiuscula começa o horário com maiúscula.
 */
export function preencherDadosComerciais(): void {
  const { contato, empresa } = produto;
  const link = (href: string, texto: string, simbolo: string, el: HTMLElement, externo = true) =>
    `<a class="contato" href="${esc(href)}"${externo ? ' target="_blank" rel="noopener"' : ""}>${el.hasAttribute("data-icone") ? icone(simbolo, "i-sm") : ""}<span>${esc(texto).replace("@", "<wbr>@")}</span></a>`;
  for (const el of $$("[data-contato]")) {
    const tipo = el.dataset.contato;
    if (tipo === "email") {
      el.innerHTML = contato.emailSuporte
        ? link(`mailto:${contato.emailSuporte}`, contato.emailSuporte, "email", el, false)
        : `<span class="a-definir">e-mail de suporte</span>`;
    } else if (tipo === "whatsapp") {
      el.innerHTML = contato.whatsapp
        ? link(`https://wa.me/${contato.whatsapp.replace(/\D/g, "")}`, `WhatsApp ${formatarTelefone(contato.whatsapp)}`, "whatsapp", el)
        : `<span class="a-definir">WhatsApp</span>`;
    } else if (tipo === "instagram") {
      el.innerHTML = contato.instagram
        ? link(`https://www.instagram.com/${contato.instagram}/`, `@${contato.instagram}`, "instagram", el)
        : `<span class="a-definir">Instagram</span>`;
    } else if (tipo === "horario") {
      // data-maiuscula: horário sozinho (rodapé), em vez de no meio de uma frase
      const horario = contato.horario && el.hasAttribute("data-maiuscula") ? contato.horario[0]!.toUpperCase() + contato.horario.slice(1) : contato.horario;
      el.innerHTML = horario
        ? `<span class="contato">${el.hasAttribute("data-icone") ? icone("relogio", "i-sm") : ""}<span>${esc(horario)}</span></span>`
        : `<span class="a-definir">horário de atendimento</span>`;
    }
  }
  for (const el of $$("[data-empresa]")) {
    const cnpj = el.dataset.empresa === "cnpj";
    const valor = cnpj ? empresa.cnpj : empresa.razaoSocial;
    el.innerHTML = valor ? esc(cnpj ? `CNPJ ${valor}` : valor) : `<span class="a-definir">${cnpj ? "CNPJ" : "razão social"}</span>`;
  }
  for (const el of $$("[data-ano]")) el.textContent = String(produto.anoCopyright);
  for (const el of $$("[data-links-planos]")) {
    el.innerHTML = configuracaoPlanos.planos.map((p) => `<a href="${esc(rotas.cadastro(p.id))}">${esc(p.nome)}</a>`).join("");
  }
}

/** Faixa "modo demonstração" no topo das telas de conta, enquanto não houver integração real. */
export function faixaDemonstracao(texto = "Contas e pagamentos são simulados neste navegador: nada é cobrado e nenhum e-mail é enviado."): void {
  if (!emDemonstracao() || $(".faixa-demo")) return;
  const faixa = document.createElement("div");
  faixa.className = "faixa-demo";
  faixa.setAttribute("role", "note");
  faixa.innerHTML = `${icone("info")}<span><b>Modo demonstração</b> · ${esc(texto)}</span>`;
  document.body.prepend(faixa);
  // Telas com menu fixo descontam a altura da faixa (var --faixa no CSS)
  const medir = () => document.documentElement.style.setProperty("--faixa", `${faixa.offsetHeight}px`);
  new ResizeObserver(medir).observe(faixa);
  medir();
}

/** Seletor segmentado com indicador deslizante. Devolve uma função para reposicionar. */
export function segmentado(grupo: HTMLElement, aoMudar: (valor: string) => void): (valor: string) => void {
  const botoes = $$<HTMLButtonElement>("button[data-valor]", grupo);
  let indicador = $(".indicador", grupo);
  if (!indicador) {
    indicador = document.createElement("span");
    indicador.className = "indicador";
    indicador.setAttribute("aria-hidden", "true");
    grupo.prepend(indicador);
  }
  const posicionar = () => {
    const ativo = botoes.find((b) => b.getAttribute("aria-pressed") === "true");
    if (!ativo || !indicador) return;
    indicador.style.width = `${ativo.offsetWidth}px`;
    indicador.style.transform = `translateX(${ativo.offsetLeft}px)`;
  };
  const selecionar = (valor: string) => {
    botoes.forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.valor === valor)));
    posicionar();
  };
  botoes.forEach((b) =>
    b.addEventListener("click", () => {
      selecionar(b.dataset.valor!);
      aoMudar(b.dataset.valor!);
    }),
  );
  new ResizeObserver(posicionar).observe(grupo);
  document.fonts?.ready.then(posicionar);
  posicionar();
  return selecionar;
}

/** Mostrar/ocultar senha nos campos com botão .ver-senha. */
export function alternarSenhas(raiz: ParentNode = document): void {
  for (const botao of $$<HTMLButtonElement>(".ver-senha", raiz)) {
    botao.addEventListener("click", () => {
      const campo = botao.parentElement?.querySelector("input");
      if (!campo) return;
      const mostrar = campo.type === "password";
      campo.type = mostrar ? "text" : "password";
      botao.setAttribute("aria-label", mostrar ? "Ocultar senha" : "Mostrar senha");
      botao.innerHTML = icone(mostrar ? "olho-fechado" : "olho");
    });
  }
}

export function iniciarPagina(): void {
  document.documentElement.classList.remove("sem-js");
  preencherDadosComerciais();
  revelarAoRolar();
}
