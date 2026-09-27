/**
 * Etapa 9B.2: exibição dos alertas na interface (somente exibição).
 *
 * Funções puras para indexar, agrupar, totalizar e montar o HTML dos alertas do
 * alertas.json, mais uma função de leitura para a rota /api/alertas. Nada aqui altera
 * veredito, estado, indicador ou validação: o alerta só é mostrado ao lado do estado.
 * Todo texto vai para o HTML escapado (mesma regra da função esc() da tela).
 */
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import type { Alerta, AlertaDeLote, CategoriaAlerta } from "./alertas.js";
import type { Veredito, VereditoExplicado } from "./tipos.js";
import { diferencasDeVereditos } from "./lote-explicativo.js";
import { sha256DeArquivo } from "./arquivos.js";

/** Ordem de exibição (não é gravidade). */
export const ORDEM_CATEGORIAS: readonly CategoriaAlerta[] = ["CONFLITO", "LACUNA", "PENDENCIA", "ATENCAO", "INFORMACAO"];
export const ROTULO_CATEGORIA: Record<CategoriaAlerta, string> = {
  CONFLITO: "Conflito", LACUNA: "Lacuna", PENDENCIA: "Pendência", ATENCAO: "Atenção", INFORMACAO: "Informação",
};

/** Mesmo escape da função esc() da tela. */
export function escaparHtml(v: unknown): string {
  return String(v ?? "").replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;" })[m]!);
}

export const chaveItem = (documento: string, nItem: number): string => `${documento}|${nItem}`;
/** Mesma chave da fila de validação (indicadores.ts, filaDeValidacao). */
export const chaveCartao = (ncm: string, cProd: string, produto: string): string => `${ncm}|${cProd}|${produto}`;

/** Ordena pela ordem de exibição das categorias, preservando a ordem original dentro de cada uma. */
export function ordenarPorCategoria<T extends { categoria: CategoriaAlerta }>(xs: T[]): T[] {
  return xs.map((x, i) => [x, i] as const)
    .sort((a, b) => ORDEM_CATEGORIAS.indexOf(a[0].categoria) - ORDEM_CATEGORIAS.indexOf(b[0].categoria) || a[1] - b[1])
    .map(([x]) => x);
}

/** Alertas de item por documento + nItem. Nenhum alerta é descartado nem duplicado. */
export function indexarPorItem(porItem: Alerta[]): Map<string, Alerta[]> {
  const m = new Map<string, Alerta[]>();
  for (const a of porItem) {
    const k = chaveItem(a.item.documento, a.item.nItem);
    if (!m.has(k)) m.set(k, []);
    m.get(k)!.push(a);
  }
  for (const [k, xs] of m) m.set(k, ordenarPorCategoria(xs));
  return m;
}

export interface AlertaDeCartao {
  codigo: Alerta["codigo"];
  categoria: CategoriaAlerta;
  titulo: string;
  mensagem: string;
  /** Em quantos itens do cartão o alerta aparece. */
  itens: number;
  /** Todos os itens de origem: a deduplicação não perde informação. */
  ocorrencias: { documento: string; nItem: number }[];
  efeito: "somente_exibicao";
}

type VereditoParaCartao = Pick<Veredito, "documento" | "nItem" | "ncm" | "cProd" | "produto" | "estado">;

/**
 * Alertas de item agregados pelos cartões de pendência (produto + NCM + cProd, só itens
 * REQUER_VALIDACAO, como a fila). Alertas iguais (código + mensagem) viram um só, com a
 * contagem e a lista de itens. Alertas de lote não entram aqui.
 */
export function agruparPorCartao(porItem: Alerta[], vereditos: VereditoParaCartao[]): Map<string, AlertaDeCartao[]> {
  const cartaoDoItem = new Map<string, string>();
  for (const v of vereditos) {
    if (v.estado !== "REQUER_VALIDACAO" || !v.ncm) continue;
    cartaoDoItem.set(chaveItem(v.documento, v.nItem), chaveCartao(v.ncm, v.cProd, v.produto));
  }
  const m = new Map<string, Map<string, AlertaDeCartao>>();
  for (const a of porItem) {
    const cartao = cartaoDoItem.get(chaveItem(a.item.documento, a.item.nItem));
    if (!cartao) continue;
    if (!m.has(cartao)) m.set(cartao, new Map());
    const grupo = m.get(cartao)!;
    const k = `${a.codigo}\u0000${a.mensagem}`;
    const atual = grupo.get(k);
    if (atual) { atual.itens += 1; atual.ocorrencias.push({ documento: a.item.documento, nItem: a.item.nItem }); }
    else grupo.set(k, { codigo: a.codigo, categoria: a.categoria, titulo: a.titulo, mensagem: a.mensagem, itens: 1,
      ocorrencias: [{ documento: a.item.documento, nItem: a.item.nItem }], efeito: "somente_exibicao" });
  }
  return new Map([...m].map(([k, g]) => [k, ordenarPorCategoria([...g.values()])]));
}

export interface TotalPorCategoria { categoria: CategoriaAlerta; rotulo: string; alertasDeItem: number; alertasDeLote: number }

/** Totais por categoria, na ordem de exibição. Não se misturam com os indicadores por estado. */
export function totalizarPorCategoria(porItem: Alerta[], lote: AlertaDeLote[]): TotalPorCategoria[] {
  return ORDEM_CATEGORIAS.map((c) => ({
    categoria: c, rotulo: ROTULO_CATEGORIA[c],
    alertasDeItem: porItem.filter((a) => a.categoria === c).length,
    alertasDeLote: lote.filter((l) => l.categoria === c).length,
  }));
}

// ---------- HTML (tudo escapado; classes próprias, nunca as classes de estado) ----------

const selo = (c: CategoriaAlerta) => `<span class="alerta-cat alerta-cat-${c}">${escaparHtml(ROTULO_CATEGORIA[c])}</span>`;

/** Coluna "Alertas" da tabela de Resultados. */
export function htmlAlertasDoItem(alertas: Alerta[]): string {
  if (!alertas.length) return "";
  const itens = ordenarPorCategoria(alertas)
    .map((a) => `<li>${selo(a.categoria)} <strong>${escaparHtml(a.titulo)}</strong>: ${escaparHtml(a.mensagem)}</li>`).join("");
  return `<details class="alertas-item"><summary>${alertas.length} alerta(s)</summary><ul>${itens}</ul></details>`;
}

/** Bloco de alertas do cartão de pendência (acima dos botões). */
export function htmlAlertasDoCartao(alertas: AlertaDeCartao[]): string {
  if (!alertas.length) return "";
  const itens = ordenarPorCategoria(alertas).map((a) =>
    `<li>${selo(a.categoria)} <strong>${escaparHtml(a.titulo)}</strong>: ${escaparHtml(a.mensagem)}` +
    (a.itens > 1 ? ` <span class="small">(em ${a.itens} itens)</span>` : "") + `</li>`).join("");
  return `<div class="alertas-cartao"><div class="small">Alertas (somente exibição; não alteram o resultado nem a validação)</div><ul>${itens}</ul></div>`;
}

/** Painel separado do Dashboard: totais por categoria e alertas de lote. */
export function htmlPainel(totais: TotalPorCategoria[], lote: AlertaDeLote[]): string {
  const linhas = totais.map((t) => `<tr><td>${selo(t.categoria)}</td><td>${t.alertasDeItem}</td><td>${t.alertasDeLote}</td></tr>`).join("");
  const lotes = ordenarPorCategoria(lote).map((l) =>
    `<li>${selo(l.categoria)} <strong>${escaparHtml(l.titulo)}</strong>: ${escaparHtml(l.mensagem)}</li>`).join("");
  return `<h3>Alertas (somente exibição)</h3>` +
    `<p class="small">Estes números não fazem parte dos indicadores acima e não alteram nenhum resultado.</p>` +
    `<table class="alertas-totais"><thead><tr><th>Categoria</th><th>Alertas de item</th><th>Alertas de lote</th></tr></thead><tbody>${linhas}</tbody></table>` +
    (lotes ? `<h4>Alertas de lote</h4><ul class="alertas-lote">${lotes}</ul>` : "");
}

export function htmlIndisponivel(motivo: string): string {
  return `<h3>Alertas (somente exibição)</h3><p class="small">Alertas indisponíveis: ${escaparHtml(motivo)} Os resultados continuam válidos e não dependem dos alertas.</p>`;
}

// ---------- resposta da rota /api/alertas ----------

export type RespostaAlertas =
  | {
      disponivel: true;
      efeito: "somente_exibicao";
      origem: { explicacoes: string; sha256: string };
      totais: unknown;
      totaisPorCategoria: TotalPorCategoria[];
      porItemHtml: Record<string, string>;
      porCartaoHtml: Record<string, string>;
      painelHtml: string;
      lote: AlertaDeLote[];
      porItem: Alerta[];
    }
  | { disponivel: false; motivo: string; painelHtml: string };

interface AlertasJson { fase: string; origem: { explicacoes: string; sha256: string; vereditosSha256?: string }; totais: unknown; lote: AlertaDeLote[]; porItem: Alerta[] }

export function montarRespostaAlertas(al: AlertasJson, vereditos: VereditoParaCartao[]): RespostaAlertas {
  const porItem = indexarPorItem(al.porItem);
  const porCartao = agruparPorCartao(al.porItem, vereditos);
  const totaisPorCategoria = totalizarPorCategoria(al.porItem, al.lote);
  return {
    disponivel: true,
    efeito: "somente_exibicao",
    origem: al.origem,
    totais: al.totais,
    totaisPorCategoria,
    porItemHtml: Object.fromEntries([...porItem].map(([k, xs]) => [k, htmlAlertasDoItem(xs)])),
    porCartaoHtml: Object.fromEntries([...porCartao].map(([k, xs]) => [k, htmlAlertasDoCartao(xs)])),
    painelHtml: htmlPainel(totaisPorCategoria, al.lote),
    lote: al.lote,
    porItem: al.porItem,
  };
}

const indisponivel = (motivo: string): RespostaAlertas => ({ disponivel: false, motivo, painelHtml: htmlIndisponivel(motivo) });

/**
 * Lê alertas.json da pasta de saída do servidor e confere que ele corresponde aos
 * resultados atuais: o SHA do explicacoes.json precisa ser o registrado, e os vereditos
 * do explicacoes.json precisam ser os do vereditos.json (fora calculadoEm). Se algo não
 * conferir, os alertas ficam indisponíveis; nenhum alerta é inventado.
 */
export function lerAlertasParaExibicao(pasta: string): RespostaAlertas {
  const arqAlertas = join(pasta, "alertas.json"), arqExplicacoes = join(pasta, "explicacoes.json"), arqVereditos = join(pasta, "vereditos.json");
  if (!existsSync(arqAlertas)) return indisponivel("o arquivo alertas.json não existe para os resultados atuais.");
  if (!existsSync(arqExplicacoes)) return indisponivel("o arquivo explicacoes.json não existe para os resultados atuais.");
  if (!existsSync(arqVereditos)) return indisponivel("o arquivo vereditos.json não existe.");
  try {
    const al = JSON.parse(readFileSync(arqAlertas, "utf8")) as AlertasJson;
    if (sha256DeArquivo(arqExplicacoes) !== al.origem?.sha256) {
      return indisponivel("o alertas.json não corresponde ao explicacoes.json atual.");
    }
    const diferentes = indisponivel("os alertas foram gerados para resultados diferentes dos atuais.");
    // Com o SHA do vereditos.json de origem, a conferência dispensa reler explicacoes.json (centenas de MB)
    if (al.origem.vereditosSha256) {
      if (sha256DeArquivo(arqVereditos) !== al.origem.vereditosSha256) return diferentes;
    } else {
      const explicados = (JSON.parse(readFileSync(arqExplicacoes, "utf8")) as { vereditos: VereditoExplicado[] }).vereditos;
      if (diferencasDeVereditos(JSON.parse(readFileSync(arqVereditos, "utf8")) as Veredito[], explicados).length) return diferentes;
    }
    const vereditos = JSON.parse(readFileSync(arqVereditos, "utf8")) as Veredito[];
    return montarRespostaAlertas(al, vereditos);
  } catch (e) {
    return indisponivel(`não foi possível ler os alertas (${e instanceof Error ? e.message : String(e)}).`);
  }
}
