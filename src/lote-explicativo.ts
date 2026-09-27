/**
 * Etapa 9B.2: fluxo explicativo de um lote de XMLs, para uso pelo cli-explicacao.ts e
 * pelo servidor.ts.
 *
 *   XML -> parser -> motor atual -> explicador -> explicacoes.json -> alertas.json
 *
 * Mesma lÃ³gica que estava no cli-explicacao.ts (9A/9B.1): o motor recebe as mesmas
 * entradas e opÃ§Ãµes do cli.ts e do processador.ts; os alertas sÃ£o derivados somente do
 * explicacoes.json gravado (relido do disco). Nada aqui altera veredito, regra ou decisÃ£o.
 *
 * Para o servidor hÃ¡ duas proteÃ§Ãµes opcionais:
 *   - limparAntes: apaga explicacoes.json e alertas.json antes de gerar, para que uma falha
 *     nunca deixe alertas de uma execuÃ§Ã£o anterior;
 *   - vereditosDeReferencia: confere os vereditos desta execuÃ§Ã£o com o vereditos.json jÃ¡
 *     gravado pelo fluxo atual; se houver qualquer diferenÃ§a (fora calculadoEm), os dois
 *     arquivos sÃ£o apagados e a geraÃ§Ã£o falha, sem publicar alertas.
 */
import { readFileSync, writeFileSync, appendFileSync, readdirSync, statSync, mkdirSync, mkdtempSync, rmSync, existsSync } from "node:fs";
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
   * ConfiguraÃ§Ã£o usada pelas explicaÃ§Ãµes e alertas (padrÃ£o: a mesma do motor). O servidor passa a
   * configuraÃ§Ã£o sem respostas, para que as respostas da anÃ¡lise atual nÃ£o virem "respostas histÃ³ricas".
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

// Mesma leitura de pastas do cli.ts e do processador.ts (lÃ¡ a funÃ§Ã£o nÃ£o Ã© exportada).
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

/** DiferenÃ§as entre dois conjuntos de vereditos, fora calculadoEm e a explicaÃ§Ã£o. */
export function diferencasDeVereditos(a: Veredito[], b: Veredito[]): string[] {
  const limpa = (v: Veredito | VereditoExplicado) => {
    const { calculadoEm: _c, ...resto } = v as VereditoExplicado;
    delete (resto as Partial<VereditoExplicado>).explicacaoInformativa;
    return JSON.stringify(resto);
  };
  const difs: string[] = [];
  if (a.length !== b.length) difs.push(`quantidade de vereditos: ${a.length} Ã— ${b.length}`);
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
  const arquivoReducoesExibicao = join(o.saida, "reducoes-exibicao.json");
  const arquivoAlertas = join(o.saida, "alertas.json");
  const apagar = () => { rmSync(arquivoAlertas, { force: true }); rmSync(arquivoExplicacoes, { force: true }); };
  if (o.limparAntes) apagar();

  // Motor: exatamente as mesmas entradas e opÃ§Ãµes do cli.ts
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

  // ProteÃ§Ã£o do servidor: esta execuÃ§Ã£o precisa reproduzir o vereditos.json jÃ¡ gravado
  if (o.vereditosDeReferencia) {
    const referencia = existsSync(o.vereditosDeReferencia) ? (JSON.parse(readFileSync(o.vereditosDeReferencia, "utf8")) as Veredito[]) : null;
    const difs = referencia ? diferencasDeVereditos(referencia, vereditos) : ["vereditos.json de referÃªncia ausente"];
    if (difs.length) {
      apagar();
      throw new Error(`Alertas nÃ£o publicados: os vereditos desta execuÃ§Ã£o divergem do vereditos.json (${difs.slice(0, 3).join("; ")}${difs.length > 3 ? "; â€¦" : ""}).`);
    }
  }

  // Explicador: depois do motor, sÃ³ leitura
  const arquivoEmpresaExplicacao = o.arquivoEmpresaExplicacao ?? o.arquivoEmpresa;
  const ctx = carregarContexto({ base: arquivoBase, v2: arquivoV2, matriz: arquivoMatriz, empresa: arquivoEmpresaExplicacao });
  const explicados = explicarVereditos(vereditos, ctx, selecao.documentos);

  mkdirSync(o.saida, { recursive: true });
  const cabecalho = {
    fase: "A_INFORMATIVA",
    aviso: "Explicação somente informativa. O estado de cada veredito foi produzido pelo motor atual e não foi alterado. A matriz é só citada.",
    entradas: {
      base: { caminho: arquivoBase, sha256: sha(arquivoBase) },
      v2: { caminho: arquivoV2, sha256: sha(arquivoV2) },
      matriz: { caminho: arquivoMatriz, sha256: ctx.matriz.hash, versao: ctx.matriz.versao },
      empresa: { caminho: arquivoEmpresaExplicacao, sha256: sha(arquivoEmpresaExplicacao) },
    },
    avisos: ctx.avisos,
  };

  const indiceReducoes = explicados.map((x) => ({
    documento: x.documento,
    nItem: x.nItem,
    ncm: x.ncm,
    cProd: x.cProd,
    produto: x.produto,
    estado: x.estado,
    exibicao: {
      reducao: x.explicacaoInformativa?.reducaoDoItem ?? null,
      auditoria: Object.fromEntries((x.explicacaoInformativa?.regras ?? []).filter((r) => r.auditoriaOficial).map((r) => [r.regraIdInformado, r.auditoriaOficial!])),
      lacunas: x.explicacaoInformativa?.lacunasDeCobertura ?? [],
      bloqueios: Object.fromEntries((x.explicacaoInformativa?.regras ?? []).filter((r) => r.bloqueio).map((r) => [r.regraIdInformado, r.bloqueio!])),
    },
  }));
  writeFileSync(arquivoReducoesExibicao, JSON.stringify(indiceReducoes), "utf8");

  const prefixo = JSON.stringify(cabecalho, null, 1).slice(0, -1) + ',\n  "vereditos": [\n';
  writeFileSync(arquivoExplicacoes, prefixo, "utf8");

  for (let i = 0; i < explicados.length; i++) {
    const texto = JSON.stringify(explicados[i], null, 1) + (i < explicados.length - 1 ? ",\n" : "\n");
    appendFileSync(arquivoExplicacoes, texto, "utf8");
  }

  appendFileSync(arquivoExplicacoes, '  ]\n}\n', "utf8");
  // 9B.1: alertas derivados dos mesmos vereditos explicados que foram gravados em explicacoes.json
  const alertas = gerarAlertas(explicados);
  const conta = <T>(xs: T[], f: (x: T) => string) => xs.reduce<Record<string, number>>((acc, x) => ((acc[f(x)] = (acc[f(x)] ?? 0) + 1), acc), {});
  writeFileSync(arquivoAlertas, JSON.stringify({
    fase: "B1_ALERTAS",
    aviso: "Alertas somente para exibiÃ§Ã£o, derivados de explicacoes.json. NÃ£o alteram o estado dos vereditos nem decidem pelo usuÃ¡rio.",
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








