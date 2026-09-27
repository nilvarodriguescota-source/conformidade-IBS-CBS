/**
 * Etapa 9B.2: fluxo explicativo de um lote de XMLs, para uso pelo cli-explicacao.ts e
 * pelo servidor.ts.
 *
 *   XML -> parser -> motor atual -> explicador -> explicacoes.json -> alertas.json
 *
 * Mesma lógica que estava no cli-explicacao.ts (9A/9B.1): o motor recebe as mesmas
 * entradas e opções do cli.ts e do processador.ts; os alertas são derivados somente do
 * explicacoes.json gravado (relido do disco). Nada aqui altera veredito, regra ou decisão.
 *
 * Para o servidor há duas proteções opcionais:
 *   - limparAntes: apaga explicacoes.json e alertas.json antes de gerar, para que uma falha
 *     nunca deixe alertas de uma execução anterior;
 *   - vereditosDeReferencia: confere os vereditos desta execução com o vereditos.json já
 *     gravado pelo fluxo atual; se houver qualquer diferença (fora calculadoEm), os dois
 *     arquivos são apagados e a geração falha, sem publicar alertas.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, mkdirSync, mkdtempSync, rmSync, existsSync } from "node:fs";
import { join, extname } from "node:path";
import { execFileSync } from "node:child_process";
import { tmpdir } from "node:os";
import { createHash } from "node:crypto";
import { lerXml, selecionarVendas, type ResultadoLeitura } from "./parser.js";
import { classificarDocumentos } from "./motor.js";
import { bloqueiosParaBase, chavesBloqueadas } from "./bloqueios.js";
import { carregarContexto, explicarVereditos } from "./explicador.js";
import { gerarAlertas } from "./alertas.js";
import type { BaseNormativa, Empresa, NaturezaItem, RespostaValidacao, Veredito, VereditoExplicado } from "./tipos.js";

export interface OpcoesLoteExplicativo {
  pastaXml: string;
  arquivoEmpresa: string;
  /**
   * Configuração usada pelas explicações e alertas (padrão: a mesma do motor). O servidor passa a
   * configuração sem respostas, para que as respostas da análise atual não virem "respostas históricas".
   */
  arquivoEmpresaExplicacao?: string;
  saida: string;
  arquivoBase?: string;
  arquivoV2?: string;
  arquivoMatriz?: string;
  limparAntes?: boolean;
  vereditosDeReferencia?: string;
}

export interface ResultadoLoteExplicativo {
  xmls: number;
  vereditos: number;
  arquivoExplicacoes: string;
  arquivoAlertas: string;
  alertasPorItem: number;
  alertasDeLote: number;
  nivelEvidencia: Record<string, number>;
}

// Mesma leitura de pastas do cli.ts e do processador.ts (lá a função não é exportada).
export function listarXmls(pasta: string): string[] {
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

const sha = (arquivo: string): string => createHash("sha256").update(readFileSync(arquivo)).digest("hex");

/** Diferenças entre dois conjuntos de vereditos, fora calculadoEm e a explicação. */
export function diferencasDeVereditos(a: Veredito[], b: Veredito[]): string[] {
  const limpa = (v: Veredito | VereditoExplicado) => {
    const { calculadoEm: _c, ...resto } = v as VereditoExplicado;
    delete (resto as Partial<VereditoExplicado>).explicacaoInformativa;
    return JSON.stringify(resto);
  };
  const difs: string[] = [];
  if (a.length !== b.length) difs.push(`quantidade de vereditos: ${a.length} × ${b.length}`);
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (limpa(a[i]!) !== limpa(b[i]!)) difs.push(`veredito ${i} (${a[i]!.documento}, item ${a[i]!.nItem})`);
  }
  return difs;
}

export function gerarLoteExplicativo(o: OpcoesLoteExplicativo): ResultadoLoteExplicativo {
  const arquivoBase = o.arquivoBase ?? "data/base-normativa.json";
  const arquivoV2 = o.arquivoV2 ?? "data/base-normativa.v2.json";
  const arquivoMatriz = o.arquivoMatriz ?? "docs/etapa6/matriz-decisao.json";
  const arquivoExplicacoes = join(o.saida, "explicacoes.json");
  const arquivoAlertas = join(o.saida, "alertas.json");
  const apagar = () => { rmSync(arquivoAlertas, { force: true }); rmSync(arquivoExplicacoes, { force: true }); };
  if (o.limparAntes) apagar();

  // Motor: exatamente as mesmas entradas e opções do cli.ts
  const base = JSON.parse(readFileSync(arquivoBase, "utf8")) as BaseNormativa;
  const cfg = JSON.parse(readFileSync(o.arquivoEmpresa, "utf8")) as Empresa & {
    naturezaPorProduto?: Record<string, NaturezaItem>;
    validacoes?: RespostaValidacao[];
    aceitarProjecao?: boolean;
  };
  const arquivos = listarXmls(o.pastaXml);
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

  // Proteção do servidor: esta execução precisa reproduzir o vereditos.json já gravado
  if (o.vereditosDeReferencia) {
    const referencia = existsSync(o.vereditosDeReferencia) ? (JSON.parse(readFileSync(o.vereditosDeReferencia, "utf8")) as Veredito[]) : null;
    const difs = referencia ? diferencasDeVereditos(referencia, vereditos) : ["vereditos.json de referência ausente"];
    if (difs.length) {
      apagar();
      throw new Error(`Alertas não publicados: os vereditos desta execução divergem do vereditos.json (${difs.slice(0, 3).join("; ")}${difs.length > 3 ? "; …" : ""}).`);
    }
  }

  // Explicador: depois do motor, só leitura
  const arquivoEmpresaExplicacao = o.arquivoEmpresaExplicacao ?? o.arquivoEmpresa;
  const ctx = carregarContexto({ base: arquivoBase, v2: arquivoV2, matriz: arquivoMatriz, empresa: arquivoEmpresaExplicacao });
  const explicados = explicarVereditos(vereditos, ctx, selecao.documentos);

  mkdirSync(o.saida, { recursive: true });
  writeFileSync(arquivoExplicacoes, JSON.stringify({
    fase: "A_INFORMATIVA",
    aviso: "Explicação somente informativa. O estado de cada veredito foi produzido pelo motor atual e não foi alterado. A matriz é só citada.",
    entradas: {
      base: { caminho: arquivoBase, sha256: sha(arquivoBase) },
      v2: { caminho: arquivoV2, sha256: sha(arquivoV2) },
      matriz: { caminho: arquivoMatriz, sha256: ctx.matriz.hash, versao: ctx.matriz.versao },
      empresa: { caminho: arquivoEmpresaExplicacao, sha256: sha(arquivoEmpresaExplicacao) },
    },
    avisos: ctx.avisos,
    vereditos: explicados,
  }, null, 1));

  // 9B.1: alertas derivados somente do explicacoes.json gravado (relido do disco)
  const lidos = (JSON.parse(readFileSync(arquivoExplicacoes, "utf8")) as { vereditos: VereditoExplicado[] }).vereditos;
  const alertas = gerarAlertas(lidos);
  const conta = <T>(xs: T[], f: (x: T) => string) => xs.reduce<Record<string, number>>((acc, x) => ((acc[f(x)] = (acc[f(x)] ?? 0) + 1), acc), {});
  writeFileSync(arquivoAlertas, JSON.stringify({
    fase: "B1_ALERTAS",
    aviso: "Alertas somente para exibição, derivados de explicacoes.json. Não alteram o estado dos vereditos nem decidem pelo usuário.",
    origem: { explicacoes: arquivoExplicacoes, sha256: sha(arquivoExplicacoes) },
    totais: {
      porItem: alertas.porItem.length,
      lote: alertas.lote.length,
      itensComAlertaDeItem: new Set(alertas.porItem.map((a) => `${a.item.documento}|${a.item.nItem}`)).size,
      porCategoria: conta(alertas.porItem, (a) => a.categoria),
      porCodigo: conta(alertas.porItem, (a) => a.codigo),
      lotePorCodigo: Object.fromEntries(alertas.lote.map((l) => [l.codigo + (l.decisoes ? `:${l.decisoes.join(",")}` : ""), l.itens])),
    },
    lote: alertas.lote,
    porItem: alertas.porItem,
  }, null, 1));

  return {
    xmls: arquivos.length,
    vereditos: explicados.length,
    arquivoExplicacoes,
    arquivoAlertas,
    alertasPorItem: alertas.porItem.length,
    alertasDeLote: alertas.lote.length,
    nivelEvidencia: conta(explicados, (x) => x.explicacaoInformativa!.nivelEvidencia),
  };
}
