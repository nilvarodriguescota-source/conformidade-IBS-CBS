/**
 * Análise atual (sessão): isola XMLs, respostas de validação e resultados de uma análise.
 *
 * Problema corrigido: as respostas da tela eram gravadas em empresa.json e reaproveitadas
 * por todas as análises seguintes. Agora cada análise tem a sua pasta:
 *
 *   analise-atual/
 *     aguardando/            XMLs adicionados e ainda não processados (Adicionar XMLs)
 *     xmls/                  XMLs já processados (Processar análise move os que aguardam para cá)
 *     respostas.json         respostas SIM/NÃO dadas nesta análise
 *     atividade.json         declaração feita nesta análise: a empresa atende consumo no local (bar, restaurante,
 *                            lanchonete). Prevalece sobre o barOuRestaurante de empresa.json; some com a nova análise.
 *     empresa-analise.json   gerado: configuração da empresa + só as respostas desta análise (motor)
 *     empresa-config.json    gerado: configuração da empresa sem respostas (explicações e alertas)
 *
 * empresa.json continua sendo só a configuração da empresa: as "validacoes" que existirem
 * nele não são lidas por aqui. O motor e o processador não mudam; muda só a origem das
 * validações que recebem.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, renameSync, rmSync, writeFileSync, copyFileSync } from "node:fs";
import { basename, join } from "node:path";
import { processarXMLs } from "./processador.js";
import { gerarLoteExplicativo } from "./lote-explicativo.js";
import type { RespostaValidacao } from "./tipos.js";

export const ARQUIVOS_DE_SAIDA = ["vereditos.json", "indicadores.json", "fila-validacao.json", "descartados.json", "composicao.json", "explicacoes.json", "alertas.json"];

export interface PastasAnalise { raiz: string; aguardando: string; xmls: string; respostas: string; atividade: string; empresaAnalise: string; empresaConfig: string }

export function pastasDaAnalise(raiz: string): PastasAnalise {
  return {
    raiz,
    aguardando: join(raiz, "aguardando"),
    xmls: join(raiz, "xmls"),
    respostas: join(raiz, "respostas.json"),
    atividade: join(raiz, "atividade.json"),
    empresaAnalise: join(raiz, "empresa-analise.json"),
    empresaConfig: join(raiz, "empresa-config.json"),
  };
}

/** Nova análise: apaga XMLs, respostas e resultados da análise anterior. */
export function novaAnalise(raiz: string, pastaSaida: string): void {
  rmSync(raiz, { recursive: true, force: true });
  mkdirSync(pastasDaAnalise(raiz).xmls, { recursive: true });
  mkdirSync(pastasDaAnalise(raiz).aguardando, { recursive: true });
  for (const f of ARQUIVOS_DE_SAIDA) rmSync(join(pastaSaida, f), { force: true });
}

function mover(origem: string, destino: string): void {
  try { renameSync(origem, destino); } catch { copyFileSync(origem, destino); rmSync(origem, { force: true }); }
}

/**
 * Acrescenta XMLs à análise atual, sem processar: ficam aguardando o "Processar análise".
 * Arquivo com o mesmo nome é substituído.
 */
export function adicionarXmls(raiz: string, arquivos: { nome: string; caminho: string }[]): number {
  const p = pastasDaAnalise(raiz);
  mkdirSync(p.aguardando, { recursive: true });
  for (const a of arquivos) mover(a.caminho, join(p.aguardando, basename(a.nome)));
  return arquivos.length;
}

/** Passa os XMLs que aguardam para os processados; devolve quantos foram incorporados. */
export function incorporarAguardando(raiz: string): number {
  const p = pastasDaAnalise(raiz);
  if (!existsSync(p.aguardando)) return 0;
  mkdirSync(p.xmls, { recursive: true });
  const nomes = readdirSync(p.aguardando);
  for (const n of nomes) mover(join(p.aguardando, n), join(p.xmls, n));
  return nomes.length;
}

/** XMLs já processados na análise atual. */
export function quantidadeDeXmls(raiz: string): number {
  const p = pastasDaAnalise(raiz);
  return existsSync(p.xmls) ? readdirSync(p.xmls).length : 0;
}

/** XMLs adicionados que ainda aguardam processamento. */
export function quantidadeAguardando(raiz: string): number {
  const p = pastasDaAnalise(raiz);
  return existsSync(p.aguardando) ? readdirSync(p.aguardando).length : 0;
}

export function lerRespostas(raiz: string): RespostaValidacao[] {
  const p = pastasDaAnalise(raiz);
  if (!existsSync(p.respostas)) return [];
  return JSON.parse(readFileSync(p.respostas, "utf8")) as RespostaValidacao[];
}

/** Registra (ou substitui) a resposta desta análise para NCM + cProd + regra. */
export function registrarResposta(raiz: string, r: RespostaValidacao): RespostaValidacao[] {
  const p = pastasDaAnalise(raiz);
  mkdirSync(raiz, { recursive: true });
  const respostas = lerRespostas(raiz).filter((x) => !(x.ncm === r.ncm && x.cProd === r.cProd && x.regraId === r.regraId));
  respostas.push(r);
  writeFileSync(p.respostas, JSON.stringify(respostas, null, 2), "utf8");
  return respostas;
}

/** Declaração de atividade feita nesta análise (vazia quando não há). */
export function lerAtividade(raiz: string): { barOuRestaurante?: boolean } {
  const p = pastasDaAnalise(raiz);
  if (!existsSync(p.atividade)) return {};
  const a = JSON.parse(readFileSync(p.atividade, "utf8")) as { barOuRestaurante?: unknown };
  return typeof a.barOuRestaurante === "boolean" ? { barOuRestaurante: a.barOuRestaurante } : {};
}

/** Grava a declaração: a empresa atende (ou não) consumo no local. Vale só para esta análise. */
export function gravarAtividade(raiz: string, a: { barOuRestaurante: boolean }): void {
  mkdirSync(raiz, { recursive: true });
  writeFileSync(pastasDaAnalise(raiz).atividade, JSON.stringify({ barOuRestaurante: a.barOuRestaurante }, null, 2), "utf8");
}

/** Configuração da empresa usada nesta análise: empresa.json (sem as validações dele) + declaração de atividade da análise. */
export function configuracaoDaEmpresa(raiz: string, arquivoEmpresa: string): Record<string, unknown> {
  const { validacoes: _ignoradas, ...config } = JSON.parse(readFileSync(arquivoEmpresa, "utf8")) as Record<string, unknown> & { validacoes?: unknown };
  return { ...config, ...lerAtividade(raiz) };
}

/** Gera as duas configurações da análise a partir de empresa.json (sem as validações dele) e da declaração de atividade. */
export function prepararConfiguracoes(raiz: string, arquivoEmpresa: string): { empresaAnalise: string; empresaConfig: string } {
  const p = pastasDaAnalise(raiz);
  mkdirSync(raiz, { recursive: true });
  const config = configuracaoDaEmpresa(raiz, arquivoEmpresa);
  writeFileSync(p.empresaConfig, JSON.stringify({ ...config, validacoes: [] }, null, 2), "utf8");
  writeFileSync(p.empresaAnalise, JSON.stringify({ ...config, validacoes: lerRespostas(raiz) }, null, 2), "utf8");
  return { empresaAnalise: p.empresaAnalise, empresaConfig: p.empresaConfig };
}

export interface ResultadoAnalise {
  xmls: number;
  documentos: number;
  descartados: number;
  pendencias: number;
  indicadores: unknown;
  alertas: { disponivel: boolean; motivo?: string };
}

/**
 * Processa os XMLs já incorporados à análise atual (os que aguardam ficam de fora): os quatro arquivos do fluxo atual (processarXMLs,
 * sem alteração) e, depois, explicações e alertas. Sem XMLs, a saída fica vazia.
 */
export function processarAnaliseAtual(o: {
  raiz: string; arquivoEmpresa: string; pastaSaida: string; arquivoBase: string; arquivoV2: string; arquivoMatriz: string;
}): ResultadoAnalise {
  const p = pastasDaAnalise(o.raiz);
  if (quantidadeDeXmls(o.raiz) === 0) {
    for (const f of ARQUIVOS_DE_SAIDA) rmSync(join(o.pastaSaida, f), { force: true });
    return { xmls: 0, documentos: 0, descartados: 0, pendencias: 0, indicadores: {}, alertas: { disponivel: false, motivo: "análise sem XMLs" } };
  }
  const { empresaAnalise, empresaConfig } = prepararConfiguracoes(o.raiz, o.arquivoEmpresa);
  const r = processarXMLs(p.xmls, empresaAnalise, o.pastaSaida, o.arquivoBase);
  let alertas: ResultadoAnalise["alertas"];
  try {
    gerarLoteExplicativo({
      pastaXml: p.xmls, arquivoEmpresa: empresaAnalise, arquivoEmpresaExplicacao: empresaConfig, saida: o.pastaSaida,
      arquivoBase: o.arquivoBase, arquivoV2: o.arquivoV2, arquivoMatriz: o.arquivoMatriz,
      limparAntes: true, vereditosDeReferencia: join(o.pastaSaida, "vereditos.json"),
    });
    alertas = { disponivel: true };
  } catch (erro) {
    alertas = { disponivel: false, motivo: erro instanceof Error ? erro.message : String(erro) };
  }
  return { xmls: r.xmls, documentos: r.documentos, descartados: r.descartados, pendencias: r.fila.length, indicadores: r.indicadores, alertas };
}
