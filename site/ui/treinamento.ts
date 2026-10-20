/**
 * Aba "Treinamento" da área do cliente: as aulas em vídeo de config/treinamento.ts.
 *
 * O player do YouTube só é carregado quando a pessoa clica em assistir (antes disso, só a capa):
 * a página abre rápido e nada do YouTube roda sem o clique. Usa youtube-nocookie.com.
 * As aulas já abertas ficam marcadas neste navegador.
 */
import { codigoDoVideo, treinamento, type AulaTreinamento } from "../config/treinamento.js";
import { $, esc, icone } from "./comum.js";

interface Aula extends AulaTreinamento {
  codigo: string;
  numero: number;
}

const aulas: Aula[] = treinamento.videos.flatMap((v, i) => {
  const codigo = codigoDoVideo(v.link);
  return codigo ? [{ ...v, codigo, numero: i + 1 }] : [];
});

const CHAVE_VISTAS = "treinamento-vistas";
let atual = 0;

function vistas(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(CHAVE_VISTAS) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}

function marcarVista(codigo: string): void {
  try {
    const v = vistas();
    v.add(codigo);
    localStorage.setItem(CHAVE_VISTAS, JSON.stringify([...v]));
  } catch {
    /* navegador sem armazenamento: só não marca */
  }
}

const titulo = (a: Aula) => a.titulo?.trim() || `Aula ${a.numero}`;
const capa = (a: Aula, tamanho: "hqdefault" | "mqdefault") => `https://i.ytimg.com/vi/${a.codigo}/${tamanho}.jpg`;

/** Título do YouTube para as aulas sem título na configuração (se o YouTube não responder, fica "Aula N"). */
async function buscarTitulos(): Promise<void> {
  await Promise.all(
    aulas
      .filter((a) => !a.titulo)
      .map(async (a) => {
        try {
          const r = await fetch(`https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(`https://www.youtube.com/watch?v=${a.codigo}`)}`);
          if (!r.ok) return;
          const { title } = (await r.json()) as { title?: string };
          if (title) a.titulo = title;
        } catch {
          /* sem o título do YouTube, fica "Aula N" */
        }
      }),
  );
}

function desenharLista(): void {
  const vistasAgora = vistas();
  $("[data-treino-lista]")!.innerHTML = aulas
    .map(
      (a, i) => `<li><button type="button" data-aula="${i}" aria-current="${i === atual}">
        <span class="treino-miniatura" style="background-image:url('${capa(a, "mqdefault")}')"><em>${a.numero}</em></span>
        <span><b>${esc(titulo(a))}</b>${vistasAgora.has(a.codigo) ? `<small>${icone("check-circulo")}Assistida</small>` : `<small>Aula ${a.numero} de ${aulas.length}</small>`}</span>
      </button></li>`,
    )
    .join("");
  const total = aulas.filter((a) => vistasAgora.has(a.codigo)).length;
  $("[data-treino-progresso]")!.textContent = `${total} de ${aulas.length} assistidas`;
}

function desenharAula(tocar: boolean): void {
  const a = aulas[atual]!;
  const video = $("[data-treino-video]")!;
  if (tocar) {
    marcarVista(a.codigo);
    video.innerHTML = `<iframe src="https://www.youtube-nocookie.com/embed/${a.codigo}?autoplay=1&rel=0&modestbranding=1" title="${esc(titulo(a))}"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
  } else {
    video.innerHTML = `<button type="button" class="treino-capa" style="background-image:url('${capa(a, "hqdefault")}')" aria-label="Assistir: ${esc(titulo(a))}"><span>${icone("play")}</span></button>`;
    $(".treino-capa", video)!.addEventListener("click", () => desenharAula(true));
  }
  $("[data-treino-numero]")!.textContent = `Aula ${a.numero} de ${aulas.length}`;
  $("[data-treino-aula-titulo]")!.textContent = titulo(a);
  const descricao = $("[data-treino-aula-descricao]")!;
  descricao.textContent = a.descricao ?? "";
  descricao.hidden = !a.descricao;
  $<HTMLButtonElement>("[data-treino-anterior]")!.disabled = atual === 0;
  const proxima = $<HTMLButtonElement>("[data-treino-proxima]")!;
  proxima.disabled = atual === aulas.length - 1;
  desenharLista();
}

/** Abre a aula pelo número da URL (#treinamento/3); sem número, fica na atual. */
export function abrirAula(numero: string | null): void {
  const n = Number(numero);
  if (Number.isInteger(n) && n >= 1 && n <= aulas.length && n - 1 !== atual) {
    atual = n - 1;
    desenharAula(false);
  }
}

export function iniciarTreinamento(): void {
  $("[data-treino-titulo-pagina]")!.textContent = treinamento.titulo;
  $("[data-treino-descricao]")!.textContent = treinamento.descricao;
  const playlist = $<HTMLAnchorElement>("[data-treino-playlist]")!;
  if (treinamento.playlist) {
    playlist.href = treinamento.playlist;
    playlist.hidden = false;
  }
  if (!aulas.length) {
    $(".treino")!.innerHTML = `<p class="texto-suave">As aulas em vídeo vão aparecer aqui em breve.</p>`;
    return;
  }
  const irPara = (i: number, tocar: boolean) => {
    atual = Math.max(0, Math.min(aulas.length - 1, i));
    history.replaceState(null, "", `#treinamento/${atual + 1}`);
    desenharAula(tocar);
  };
  $("[data-treino-lista]")!.addEventListener("click", (e) => {
    const b = (e.target as HTMLElement).closest<HTMLButtonElement>("[data-aula]");
    if (b) irPara(Number(b.dataset.aula), true);
  });
  $("[data-treino-anterior]")!.addEventListener("click", () => irPara(atual - 1, true));
  $("[data-treino-proxima]")!.addEventListener("click", () => irPara(atual + 1, true));
  desenharAula(false);
  void buscarTitulos().then(() => {
    $("[data-treino-aula-titulo]")!.textContent = titulo(aulas[atual]!);
    desenharLista();
  });
}
