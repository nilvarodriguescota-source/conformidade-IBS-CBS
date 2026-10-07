/** Cabeçalho do site: fundo ao rolar, menu do celular, seção ativa e botão Entrar / Minha conta. */
import { carregarConta } from "../servicos/conta.js";
import { rotas } from "../servicos/rotas.js";
import { $, $$, icone } from "./comum.js";

export function iniciarTopo(): void {
  const topo = $("[data-topo]");
  if (!topo) return;

  const aoRolar = () => topo.classList.toggle("rolado", scrollY > 12);
  addEventListener("scroll", aoRolar, { passive: true });
  aoRolar();

  // Menu do celular
  const botao = $<HTMLButtonElement>("[data-abrir-menu]", topo);
  const menu = $("#menu-movel");
  const fechar = () => {
    if (!botao || !menu) return;
    botao.setAttribute("aria-expanded", "false");
    botao.setAttribute("aria-label", "Abrir menu");
    botao.innerHTML = icone("menu");
    document.body.classList.remove("menu-aberto");
    menu.classList.remove("aberto");
    setTimeout(() => {
      if (!menu.classList.contains("aberto")) menu.hidden = true;
    }, 350);
  };
  const abrir = () => {
    if (!botao || !menu) return;
    menu.hidden = false;
    requestAnimationFrame(() => menu.classList.add("aberto"));
    botao.setAttribute("aria-expanded", "true");
    botao.setAttribute("aria-label", "Fechar menu");
    botao.innerHTML = icone("x");
    document.body.classList.add("menu-aberto");
  };
  botao?.addEventListener("click", () => (botao.getAttribute("aria-expanded") === "true" ? fechar() : abrir()));
  menu?.addEventListener("click", (e) => {
    if ((e.target as HTMLElement).closest("a")) fechar();
  });
  addEventListener("keydown", (e) => {
    if (e.key === "Escape" && botao?.getAttribute("aria-expanded") === "true") {
      fechar();
      botao.focus();
    }
  });
  matchMedia("(min-width: 1101px)").addEventListener("change", (m) => m.matches && fechar());

  // Seção ativa no menu
  const links = $$<HTMLAnchorElement>(".topo-nav a[href*='#']");
  const secoes = links
    .map((a) => document.getElementById(a.hash.slice(1)))
    .filter((s): s is HTMLElement => s != null);
  if (secoes.length && "IntersectionObserver" in window) {
    const obs = new IntersectionObserver(
      (entradas) => {
        for (const e of entradas) {
          if (!e.isIntersecting) continue;
          links.forEach((a) => a.classList.toggle("ativo", a.hash === `#${e.target.id}`));
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    secoes.forEach((s) => obs.observe(s));
  }

  // Quem já está logado vê "Minha conta" no lugar de "Entrar"
  carregarConta()
    .then(({ sessao }) => {
      if (!sessao) return;
      for (const a of $$<HTMLAnchorElement>("[data-link-entrar]")) {
        a.href = rotas.conta;
        a.innerHTML = `${icone("usuario", "i-sm")}Minha conta`;
      }
    })
    .catch(() => undefined);
}
