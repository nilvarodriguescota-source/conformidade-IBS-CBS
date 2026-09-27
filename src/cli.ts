/**
 * Linha de comando: lê uma pasta de XMLs (aceita .zip), classifica e grava o
 * relatório com a trilha de auditoria.
 *
 *   node dist/src/cli.js --xml ./xmls --empresa ./empresa.json --saida ./saida
 *
 * empresa.json:
 *   {
 *     "cnpj": "...", "regime": "normal" | "simples" | "mei",
 *     "barOuRestaurante": false,
 *     "naturezaPorProduto": { "P123": "preparado_no_local" },
 *     "aceitarProjecao": false,
 *     "validacoes": [{ "ncm": "...", "cProd": "...", "regraId": "...",
 *                      "resposta": "SIM", "autor": "...", "data": "2026-09-20" }]
 *   }
 */
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

function argumento(nome: string, padrao?: string): string {
  const i = process.argv.indexOf(`--${nome}`);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1]!;
  if (padrao !== undefined) return padrao;
  throw new Error(`Informe --${nome}`);
}

function listarXmls(pasta: string): string[] {
  const achados: string[] = [];
  for (const nome of readdirSync(pasta)) {
    const caminho = join(pasta, nome);
    if (statSync(caminho).isDirectory()) {
      achados.push(...listarXmls(caminho)); // subpastas entram
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

function main(): void {
  const pastaXml = argumento("xml");
  const arquivoEmpresa = argumento("empresa");
  const saida = argumento("saida", "./saida");
  const arquivoBase = argumento("base", "data/base-normativa.json");

  const base = JSON.parse(readFileSync(arquivoBase, "utf8")) as BaseNormativa;
  const cfg = JSON.parse(readFileSync(arquivoEmpresa, "utf8")) as Empresa & {
    naturezaPorProduto?: Record<string, NaturezaItem>;
    validacoes?: RespostaValidacao[];
    aceitarProjecao?: boolean;
  };

  const arquivos = listarXmls(pastaXml);
  const leituras: ResultadoLeitura[] = arquivos.map((a) => lerXml(readFileSync(a, "utf8"), a));
  const selecao = selecionarVendas(leituras);
  const vereditos = classificarDocumentos(selecao.documentos, {
    base,
    empresa: cfg,
    validacoes: cfg.validacoes ?? [],
    naturezaPorProduto: new Map(Object.entries(cfg.naturezaPorProduto ?? {})),
    aceitarProjecao: cfg.aceitarProjecao ?? false,
    regrasBloqueadas: chavesBloqueadas(bloqueiosParaBase(arquivoBase)),
  });
  const indicadores = calcularIndicadores(vereditos);
  const fila = filaDeValidacao(vereditos);

  mkdirSync(saida, { recursive: true });
  writeFileSync(join(saida, "vereditos.json"), JSON.stringify(vereditos, null, 1));
  writeFileSync(join(saida, "indicadores.json"), JSON.stringify(indicadores, null, 1));
  writeFileSync(join(saida, "fila-validacao.json"), JSON.stringify(fila, null, 1));
  writeFileSync(join(saida, "descartados.json"), JSON.stringify(selecao.descartados, null, 1));

  const reais = (v: number) => v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  console.log(`XMLs lidos: ${arquivos.length} | documentos de venda: ${selecao.documentos.length} | descartados: ${selecao.descartados.length}`);
  console.log(`Itens: ${indicadores.itens} | base de cálculo: ${reais(indicadores.faturamento)}`);
  for (const [estado, v] of Object.entries(indicadores.porEstado)) {
    if (v.itens > 0) console.log(`  ${estado.padEnd(20)} ${String(v.itens).padStart(6)} itens  ${reais(v.base)}`);
  }
  console.log(`Economia potencial: ${reais(indicadores.economiaPotencial)} | exposição: ${reais(indicadores.exposicao)}`);
  console.log(`Pendentes de validação: ${fila.length} pares produto/NCM`);
  for (const a of indicadores.alertas) console.log(`  aviso: ${a}`);
  console.log(`Relatórios em ${saida}`);
}

main();
