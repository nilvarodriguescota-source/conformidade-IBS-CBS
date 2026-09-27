import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync } from "node:fs";
import { join, extname } from "node:path";
import { execFileSync } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { lerXml, selecionarVendas, type ResultadoLeitura } from "./parser.js";
import { classificarDocumentos } from "./motor.js";
import { bloqueiosParaBase, chavesBloqueadas } from "./bloqueios.js";
import { calcularIndicadores, filaDeValidacao } from "./indicadores.js";
import type { BaseNormativa, Empresa, NaturezaItem, RespostaValidacao } from "./tipos.js";

function listarXmls(pasta: string): string[] {
  const achados: string[] = [];

  for (const nome of readdirSync(pasta)) {
    const caminho = join(pasta, nome);

    if (statSync(caminho).isDirectory()) {
      achados.push(...listarXmls(caminho));
    } else if (extname(nome).toLowerCase() === ".xml") {
      achados.push(caminho);
    } else if (extname(nome).toLowerCase() === ".zip") {
      const destino = mkdtempSync(join(tmpdir(), "xmlzip-"));
      execFileSync("unzip", ["-qq", "-o", caminho, "-d", destino]);
      achados.push(...listarXmls(destino));
    }
  }

  return achados;
}

/** De onde vem a diferença entre XMLs lidos e documentos analisados. */
export interface ComposicaoXmls {
  arquivos: number;
  documentosLidos: number;
  documentosAnalisados: number;
  eventos: { arquivo: string; tipo: string; chaves: string[] }[];
  naoReconhecidos: { arquivo: string; motivo: string }[];
  descartados: { documento: string; motivo: string }[];
  descartadosPorMotivo: Record<string, number>;
}

export function composicaoDosXmls(arquivos: string[], leituras: ResultadoLeitura[], selecao: ReturnType<typeof selecionarVendas>): ComposicaoXmls {
  const nome = (a: string) => a.split(/[\\/]/).pop() ?? a;
  const eventos = leituras.flatMap((l, i) => (l.documentos.length === 0 && l.cancelamentos.size > 0
    ? [{ arquivo: nome(arquivos[i]!), tipo: "evento de cancelamento (tpEvento 110111)", chaves: [...l.cancelamentos] }] : []));
  const naoReconhecidos = leituras.flatMap((l) => l.ignorados.map((x) => ({ arquivo: nome(x.arquivo), motivo: x.motivo })));
  const descartados = selecao.descartados.filter((d) => !naoReconhecidos.some((n) => n.arquivo === nome(d.documento)));
  const descartadosPorMotivo: Record<string, number> = {};
  for (const d of descartados) descartadosPorMotivo[d.motivo] = (descartadosPorMotivo[d.motivo] ?? 0) + 1;
  return {
    arquivos: arquivos.length,
    documentosLidos: leituras.reduce((n, l) => n + l.documentos.length, 0),
    documentosAnalisados: selecao.documentos.length,
    eventos, naoReconhecidos, descartados, descartadosPorMotivo,
  };
}

export interface ResultadoProcessamento {
  xmls: number;
  documentos: number;
  descartados: number;
  indicadores: ReturnType<typeof calcularIndicadores>;
  fila: ReturnType<typeof filaDeValidacao>;
}

export function processarXMLs(
  pastaXml: string,
  arquivoEmpresa: string,
  saida: string,
  arquivoBase = "data/base-normativa.json",
): ResultadoProcessamento {
  const base = JSON.parse(
    readFileSync(arquivoBase, "utf8"),
  ) as BaseNormativa;

  const cfg = JSON.parse(
    readFileSync(arquivoEmpresa, "utf8"),
  ) as Empresa & {
    naturezaPorProduto?: Record<string, NaturezaItem>;
    validacoes?: RespostaValidacao[];
    aceitarProjecao?: boolean;
  };

  const arquivos = listarXmls(pastaXml);

  const leituras: ResultadoLeitura[] = arquivos.map((arquivo) =>
    lerXml(readFileSync(arquivo, "utf8"), arquivo),
  );

  const selecao = selecionarVendas(leituras);

  const vereditos = classificarDocumentos(selecao.documentos, {
    base,
    empresa: cfg,
    validacoes: cfg.validacoes ?? [],
    naturezaPorProduto: new Map(
      Object.entries(cfg.naturezaPorProduto ?? {}),
    ),
    aceitarProjecao: cfg.aceitarProjecao ?? false,
    regrasBloqueadas: chavesBloqueadas(bloqueiosParaBase(arquivoBase)),
  });

  const indicadores = calcularIndicadores(vereditos);
  const fila = filaDeValidacao(vereditos);

  mkdirSync(saida, { recursive: true });

  writeFileSync(
    join(saida, "vereditos.json"),
    JSON.stringify(vereditos, null, 1),
    "utf8",
  );

  writeFileSync(
    join(saida, "indicadores.json"),
    JSON.stringify(indicadores, null, 1),
    "utf8",
  );

  writeFileSync(
    join(saida, "fila-validacao.json"),
    JSON.stringify(fila, null, 1),
    "utf8",
  );

  writeFileSync(
    join(saida, "descartados.json"),
    JSON.stringify(selecao.descartados, null, 1),
    "utf8",
  );

  writeFileSync(
    join(saida, "composicao.json"),
    JSON.stringify(composicaoDosXmls(arquivos, leituras, selecao), null, 1),
    "utf8",
  );

  return {
    xmls: arquivos.length,
    documentos: selecao.documentos.length,
    descartados: selecao.descartados.length,
    indicadores,
    fila,
  };
}

