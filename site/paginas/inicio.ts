/** Landing page: interações e planos (lidos de config/planos.ts). */
import {
  catalogoRecursos,
  configuracaoPlanos,
  equivalenteMensal,
  recursosNovos,
  type Plano,
  type RecursoId,
} from "../config/planos.js";
import { emDemonstracao } from "../config/integracoes.js";
import { produto } from "../config/produto.js";
import { rotas } from "../servicos/rotas.js";
import type { CicloCobranca } from "../servicos/tipos.js";
import { $, $$, esc, formatarMoeda, icone, iniciarPagina, numeroDoPreco, segmentado } from "../ui/comum.js";
import { iniciarTopo } from "../ui/topo.js";

const semMovimento = matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------------- Planos ---------------- */

function precoHtml(plano: Plano, ciclo: CicloCobranca): string {
  const mensal = equivalenteMensal(plano, ciclo);
  if (mensal == null) return `<span class="sob-consulta">Sob consulta</span>`;
  const [inteiro, centavos] = numeroDoPreco(Math.round(mensal * 100) / 100).split(",");
  return `<span class="moeda">R$</span><span class="valor">${inteiro}${centavos ? `<small>,${centavos}</small>` : ""}</span><span class="periodo">/mês</span>`;
}

function cobrancaHtml(plano: Plano, ciclo: CicloCobranca): string {
  if (ciclo === "mensal" || plano.precoAnual == null) return plano.precoMensal == null ? "Valores sob medida" : "Cobrança mensal";
  const economia = plano.precoMensal != null ? plano.precoMensal * 12 - plano.precoAnual : 0;
  return `${formatarMoeda(plano.precoAnual)} por ano${economia > 0 ? ` · <b>economize ${formatarMoeda(economia)}</b>` : ""}`;
}

function recursoHtml(id: RecursoId): string {
  const r = catalogoRecursos[id];
  return `<li><span class="marca-check">${icone("check")}</span><span>${esc(r.nome)}<small>${esc(r.detalhe)}</small></span></li>`;
}

function cartaoPlano(plano: Plano, ciclo: CicloCobranca): string {
  const recursos = plano.chamadaRecursos ? recursosNovos(plano) : plano.recursos;
  return `
  <article class="plano${plano.destaque ? " destaque" : ""}" data-plano="${esc(plano.id)}">
    ${plano.destaque && plano.seloDestaque ? `<span class="plano-selo">${icone("brilho")}${esc(plano.seloDestaque)}</span>` : ""}
    <h3>${esc(plano.nome)}</h3>
    <p class="plano-desc">${esc(plano.descricao)}</p>
    <div class="plano-preco" data-preco>${precoHtml(plano, ciclo)}</div>
    <p class="plano-cobranca" data-cobranca>${cobrancaHtml(plano, ciclo)}</p>
    <a class="btn ${plano.destaque ? "btn-ouro" : "btn-fantasma"} btn-grande btn-bloco" data-assinar href="${esc(rotas.cadastro(plano.id, ciclo))}">
      Assinar ${esc(plano.nome)} ${icone("seta", "i-seta")}
    </a>
    <ul class="plano-limites">${plano.limites.map((l) => `<li><span>${esc(l.rotulo)}</span><b>${esc(l.valor)}</b></li>`).join("")}</ul>
    ${plano.chamadaRecursos ? `<p class="plano-chamada">${esc(plano.chamadaRecursos)}</p>` : ""}
    <ul class="plano-recursos">${recursos.map(recursoHtml).join("")}</ul>
    ${plano.chamadaRecursos ? `<button type="button" class="plano-incluidos" data-ver-comparacao>${icone("camadas", "i-sm")}<span>Inclui os ${plano.recursos.length - recursos.length} recursos do plano anterior</span>${icone("chevron-d", "i-sm")}</button>` : ""}
  </article>`;
}

function tabelaComparativa(): string {
  const planos = configuracaoPlanos.planos;
  const referencia = planos.find((p) => p.destaque) ?? planos[0]!;
  const colunas = (conteudo: (p: Plano) => string) =>
    planos.map((p) => `<td class="${p.destaque ? "destaque" : ""}">${conteudo(p)}</td>`).join("");
  const limites = referencia.limites
    .map((l, i) => `<tr><td>${esc(l.rotulo.replace(/^Empresa \(/, "Empresas ("))}</td>${colunas((p) => esc(p.limites[i]?.valor ?? "—"))}</tr>`)
    .join("");
  const usados = (Object.keys(catalogoRecursos) as RecursoId[]).filter((id) => planos.some((p) => p.recursos.includes(id)));
  const recursos = usados
    .map(
      (id) =>
        `<tr><td>${esc(catalogoRecursos[id].nome)}</td>${colunas((p) =>
          p.recursos.includes(id) ? `<span class="sim">${icone("check")}<span class="sr">Incluído</span></span>` : `<span class="nao">—<span class="sr">Não incluído</span></span>`,
        )}</tr>`,
    )
    .join("");
  return `<table class="comparativa">
    <thead><tr><th scope="col">Recursos</th>${planos.map((p) => `<th scope="col" class="${p.destaque ? "destaque" : ""}">${esc(p.nome)}</th>`).join("")}</tr></thead>
    <tbody>
      <tr class="grupo"><td colspan="${planos.length + 1}">Limites</td></tr>${limites}
      <tr class="grupo"><td colspan="${planos.length + 1}">Recursos</td></tr>${recursos}
    </tbody></table>`;
}

function iniciarPlanos(): void {
  const grade = $("[data-planos]");
  if (!grade) return;
  let ciclo: CicloCobranca = configuracaoPlanos.cicloPadrao;
  grade.innerHTML = configuracaoPlanos.planos.map((p) => cartaoPlano(p, ciclo)).join("");

  const vantagem = $("[data-vantagem-anual]");
  if (vantagem) vantagem.textContent = configuracaoPlanos.vantagemAnual;
  const condicoes = $("[data-condicoes]");
  if (condicoes) condicoes.innerHTML = configuracaoPlanos.condicoes.map((c) => `<li>${icone("check-circulo", "i-sm")}${esc(c)}</li>`).join("");
  const aviso = $("[data-valores-ilustrativos]");
  if (aviso && configuracaoPlanos.valoresIlustrativos) {
    const semCobranca = emDemonstracao() ? " Nesta fase nada é cobrado: cadastro e assinatura funcionam em modo demonstração." : "";
    aviso.innerHTML = `${icone("info")}<span>${esc(configuracaoPlanos.textoValoresIlustrativos + semCobranca)}</span>`;
    aviso.hidden = false;
  }

  // Mensal / anual
  const seletor = $("[data-ciclo]");
  if (seletor) {
    const selecionar = segmentado(seletor, (valor) => {
      ciclo = valor === "anual" ? "anual" : "mensal";
      for (const cartao of $$("[data-plano]", grade)) {
        const plano = configuracaoPlanos.planos.find((p) => p.id === cartao.dataset.plano)!;
        const preco = $("[data-preco]", cartao)!;
        const cobranca = $("[data-cobranca]", cartao)!;
        preco.innerHTML = precoHtml(plano, ciclo);
        cobranca.innerHTML = cobrancaHtml(plano, ciclo);
        $<HTMLAnchorElement>("[data-assinar]", cartao)!.href = rotas.cadastro(plano.id, ciclo);
        for (const el of [$(".valor", preco), cobranca]) {
          el?.classList.remove("trocando");
          void el?.offsetWidth;
          el?.classList.add("trocando");
        }
      }
    });
    selecionar(ciclo);
  }

  // Comparação completa
  const tabela = $("[data-tabela-comparativa]");
  if (tabela) tabela.innerHTML = tabelaComparativa();
  const botaoComparar = $<HTMLButtonElement>("[data-comparar]");
  const corpo = $("[data-comparar-corpo]");
  const alternarComparacao = (abrir: boolean) => {
    if (!botaoComparar) return;
    botaoComparar.setAttribute("aria-expanded", String(abrir));
    corpo?.classList.toggle("aberto", abrir);
    botaoComparar.firstChild!.textContent = abrir ? "Ocultar comparação " : "Comparar todos os recursos ";
  };
  botaoComparar?.addEventListener("click", () => alternarComparacao(botaoComparar.getAttribute("aria-expanded") !== "true"));
  for (const b of $$("[data-ver-comparacao]", grade)) {
    b.addEventListener("click", () => {
      alternarComparacao(true);
      setTimeout(() => botaoComparar?.scrollIntoView({ behavior: semMovimento ? "auto" : "smooth", block: "start" }), 120);
    });
  }

  // Celular: carrossel com pontos, começando no plano recomendado
  const pontos = $("[data-planos-pontos]");
  const cartoes = $$("[data-plano]", grade);
  if (pontos) {
    pontos.innerHTML = cartoes.map((c, i) => `<button type="button" aria-label="Ver plano ${i + 1}" data-ponto="${i}"></button>`).join("");
    const botoes = $$<HTMLButtonElement>("button", pontos);
    const centralizar = (cartao: HTMLElement, suave: boolean) =>
      grade.scrollTo({ left: cartao.offsetLeft - (grade.clientWidth - cartao.offsetWidth) / 2, behavior: suave && !semMovimento ? "smooth" : "auto" });
    const marcar = () => {
      const centro = grade.scrollLeft + grade.clientWidth / 2;
      let atual = 0;
      cartoes.forEach((c, i) => {
        if (Math.abs(c.offsetLeft + c.offsetWidth / 2 - centro) < Math.abs(cartoes[atual]!.offsetLeft + cartoes[atual]!.offsetWidth / 2 - centro)) atual = i;
      });
      botoes.forEach((b, i) => b.setAttribute("aria-current", String(i === atual)));
    };
    botoes.forEach((b, i) => b.addEventListener("click", () => centralizar(cartoes[i]!, true)));
    grade.addEventListener("scroll", () => requestAnimationFrame(marcar), { passive: true });
    const destaque = cartoes.find((c) => c.classList.contains("destaque"));
    if (destaque && matchMedia("(max-width: 860px)").matches) requestAnimationFrame(() => centralizar(destaque, false));
    marcar();
  }
}

/* ---------------- Hero ---------------- */

function iniciarParalaxe(): void {
  const area = $("[data-paralaxe]");
  const vitrine = $(".vitrine", area ?? document);
  if (!area || !vitrine || semMovimento || !matchMedia("(hover: hover) and (min-width: 1025px)").matches) return;
  const camadas = $$("[data-camada]", vitrine);
  let quadro = 0;
  addEventListener(
    "pointermove",
    (e) => {
      cancelAnimationFrame(quadro);
      quadro = requestAnimationFrame(() => {
        const x = e.clientX / innerWidth - 0.5;
        const y = e.clientY / innerHeight - 0.5;
        vitrine.style.setProperty("--px", x.toFixed(3));
        vitrine.style.setProperty("--py", y.toFixed(3));
        for (const c of camadas) {
          const p = Number(c.dataset.camada) * 6;
          c.style.transform = `translate3d(${(x * p).toFixed(1)}px, ${(y * p).toFixed(1)}px, 0)`;
        }
      });
    },
    { passive: true },
  );
}

function iniciarContadores(): void {
  const alvos = $$("[data-contar]");
  if (semMovimento || !("IntersectionObserver" in window)) return;
  const formato = new Intl.NumberFormat("pt-BR");
  const obs = new IntersectionObserver((entradas) => {
    for (const e of entradas) {
      if (!e.isIntersecting) continue;
      obs.unobserve(e.target);
      const el = e.target as HTMLElement;
      const fim = Number(el.dataset.contar);
      const inicio = performance.now();
      const passo = (t: number) => {
        const p = Math.min(1, (t - inicio) / 1600);
        el.textContent = formato.format(Math.round(fim * (1 - Math.pow(1 - p, 3))));
        if (p < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    }
  }, { threshold: 0.4 });
  alvos.forEach((a) => obs.observe(a));
}

/* ---------------- Benefícios: brilho que segue o cursor ---------------- */

function iniciarBrilhoCartoes(): void {
  if (!matchMedia("(hover: hover)").matches) return;
  for (const card of $$(".bento-card")) {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });
  }
}

/* ---------------- Na prática: telas que se alternam ---------------- */

function iniciarDemo(): void {
  const demo = $("[data-demo]");
  if (!demo) return;
  const abas = $$<HTMLButtonElement>("[data-demo-aba]", demo);
  const telas = $$("[data-demo-tela]", demo);
  const DURACAO = 7000;
  demo.style.setProperty("--duracao", `${DURACAO}ms`);
  let indice = 0;
  let temporizador = 0;
  let automatico = !semMovimento;
  let visivel = false;

  const mostrar = (i: number) => {
    indice = (i + abas.length) % abas.length;
    const alvo = abas[indice]!.dataset.demoAba;
    abas.forEach((a, j) => a.setAttribute("aria-selected", String(j === indice)));
    telas.forEach((t) => t.classList.toggle("ativa", t.dataset.demoTela === alvo));
    demo.classList.remove("rodando");
    void demo.offsetWidth;
    if (automatico && visivel) demo.classList.add("rodando");
  };
  const agendar = () => {
    clearInterval(temporizador);
    if (!automatico || !visivel) return demo.classList.remove("rodando");
    demo.classList.add("rodando");
    temporizador = window.setInterval(() => mostrar(indice + 1), DURACAO);
  };
  abas.forEach((a, i) =>
    a.addEventListener("click", () => {
      automatico = false;
      clearInterval(temporizador);
      mostrar(i);
      a.scrollIntoView({ block: "nearest", inline: "nearest", behavior: semMovimento ? "auto" : "smooth" });
    }),
  );
  new IntersectionObserver(([e]) => {
    visivel = !!e?.isIntersecting;
    if (visivel) mostrar(indice);
    agendar();
  }, { threshold: 0.35 }).observe(demo);
}

/* ---------------- FAQ com abertura suave ---------------- */

function iniciarFaq(): void {
  const lista = $(".faq-lista");
  if (!lista) return;
  lista.closest(".faq")?.classList.add("faq-animado");
  for (const d of $$<HTMLDetailsElement>("details.pergunta", lista)) {
    if (d.open) d.classList.add("expandida");
    $("summary", d)!.addEventListener("click", (e) => {
      e.preventDefault();
      if (!d.open) {
        d.open = true;
        requestAnimationFrame(() => requestAnimationFrame(() => d.classList.add("expandida")));
      } else {
        d.classList.remove("expandida");
        const fechar = () => {
          if (!d.classList.contains("expandida")) d.open = false;
        };
        $(".resposta", d)!.addEventListener("transitionend", fechar, { once: true });
        setTimeout(fechar, 600);
      }
    });
  }
}

/* ---------------- Textos que dependem do modo e dados da responsável ---------------- */

/** data-so-demonstracao: só enquanto contas e pagamentos forem simulados; data-so-producao: o contrário. */
function textosDoModo(): void {
  const demo = emDemonstracao();
  for (const el of $$("[data-so-demonstracao]")) el.hidden = !demo;
  for (const el of $$("[data-so-producao]")) el.hidden = demo;
}

/** Seção "Quem está por trás": lê config/produto.ts (responsavel); campo null vira "a definir". */
function preencherResponsavel(): void {
  const r = produto.responsavel;
  const rotulos = { nome: "nome", especialidade: "especialidade", experiencia: "experiência", motivo: "por que a análise existe" } as const;
  for (const el of $$("[data-responsavel]")) {
    const campo = el.dataset.responsavel as keyof typeof rotulos;
    if (!(campo in rotulos)) continue;
    const valor = r[campo];
    el.innerHTML = valor ? esc(valor) : `<span class="a-definir">${rotulos[campo]}</span>`;
  }
  const figura = $("[data-responsavel-foto]");
  if (figura && r.foto) {
    figura.classList.add("com-foto");
    figura.innerHTML = `<img src="${esc(r.foto)}" alt="${esc(r.nome ?? "")}" loading="lazy">`;
  }
}

/* ---------------- Chamada flutuante no celular ---------------- */

function iniciarCtaMovel(): void {
  const cta = $("[data-cta-movel]");
  const hero = $(".hero");
  if (!cta || !hero || !("IntersectionObserver" in window)) return;
  const escondem = [hero, $("#planos"), $(".cta-final"), $(".rodape")].filter((x): x is HTMLElement => x != null);
  const vistos = new Set<Element>();
  const obs = new IntersectionObserver((entradas) => {
    for (const e of entradas) e.isIntersecting ? vistos.add(e.target) : vistos.delete(e.target);
    cta.classList.toggle("visivel", vistos.size === 0);
  }, { threshold: 0.05 });
  escondem.forEach((el) => obs.observe(el));
}

iniciarPagina();
iniciarTopo();
iniciarPlanos();
textosDoModo();
preencherResponsavel();
iniciarParalaxe();
iniciarContadores();
iniciarBrilhoCartoes();
iniciarDemo();
iniciarFaq();
iniciarCtaMovel();
