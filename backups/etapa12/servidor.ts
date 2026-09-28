import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { lerAlertasParaExibicao } from "./alertas-exibicao.js";
import {
  adicionarXmls, incorporarAguardando, lerRespostas, novaAnalise, processarAnaliseAtual, quantidadeAguardando,
  quantidadeDeXmls, registrarResposta,
} from "./analise-atual.js";
import { diferencasDeVereditos } from "./lote-explicativo.js";
import { lerCabecalhoJson } from "./arquivos.js";
import { paginaHtml } from "./pagina.js";
import { bloqueiosParaBase, chaveBloqueio, MENSAGEM_BLOQUEIO } from "./bloqueios.js";
import type { AuditoriaOficialDaRegra, BaseNormativa, BloqueioOficial, LacunaDeCobertura, ReducaoDoItem, RespostaValidacao, Veredito, VereditoExplicado } from "./tipos.js";

const app = express();
const PORTA = Number(process.env.PORT) || 3000;

app.use(express.json());

const upload = multer({
  dest: path.join(process.cwd(), "uploads")
});

const arquivoEmpresa = path.join(process.cwd(), "empresa.json");
const pastaSaida = path.join(process.cwd(), "saida-teste");
const arquivoFila = path.join(pastaSaida, "fila-validacao.json");
/** Análise atual: XMLs e respostas desta análise (ver analise-atual.ts). */
const pastaAnalise = path.join(process.cwd(), "analise-atual");
const arquivoBase = path.join(process.cwd(), "data", "base-normativa.json");

// Resultados deixados por versões anteriores (sem análise atual) não pertencem a nenhuma
// análise: a primeira execução começa com uma análise vazia, sem respostas herdadas.
if (!fs.existsSync(pastaAnalise)) {
  novaAnalise(pastaAnalise, pastaSaida);
  console.log("Nova análise iniciada (sem dados de análises anteriores).");
}

function processarAnalise() {
  return processarAnaliseAtual({
    raiz: pastaAnalise,
    arquivoEmpresa,
    pastaSaida,
    arquivoBase,
    arquivoV2: path.join(process.cwd(), "data", "base-normativa.v2.json"),
    arquivoMatriz: path.join(process.cwd(), "docs", "etapa6", "matriz-decisao.json"),
  });
}

function lerJson(arquivo: string, padrao: any = []) {
  try {
    return JSON.parse(fs.readFileSync(arquivo, "utf8"));
  } catch {
    return padrao;
  }
}

/** Descrição legível das regras candidatas, só para exibição na tela de Pendências. */
/**
 * Campos das regras candidatas, lidos da base, só para exibição na tela de Pendências.
 * Quando o identificador corresponde a mais de uma regra, nenhuma é escolhida: um campo só é
 * informado se for igual em todas; as descrições legais diferentes são listadas como estão na base.
 */
function detalharRegras(ncm: string, ids: string[]) {
  const base = lerJson(arquivoBase, { regras: [] }) as BaseNormativa;
  return ids.map((id) => {
    const achadas = base.regras.filter((r) => r.id === id && r.ncm === ncm);
    const comum = <K extends "cst" | "cClassTrib" | "rotulo" | "anexo" | "item" | "descricaoLegal" | "fundamentoLegal" | "reducao">(k: K) => {
      const valores = [...new Set(achadas.map((r) => (r as any)[k] ?? null))];
      return valores.length === 1 ? valores[0]! : null;
    };
    return {
      id,
      cst: comum("cst"),
      cClassTrib: comum("cClassTrib"),
      rotulo: comum("rotulo"),
      anexo: comum("anexo"),
      item: comum("item"),
      descricaoLegal: comum("descricaoLegal"),
      fundamentoLegal: comum("fundamentoLegal"),
      reducao: comum("reducao"),
      identificadorRepetido: achadas.length > 1,
      regrasComEsteIdentificador: achadas.length,
      descricoesLegaisDivergentes: achadas.length > 1 && comum("descricaoLegal") === null
        ? [...new Set(achadas.map((r) => r.descricaoLegal))] : [],
    };
  });
}

app.use("/vendor", express.static(path.join(process.cwd(), "public", "vendor")));

app.get("/", (_req, res) => {
  res.send(paginaHtml());
});

/** Estado da análise atual: XMLs processados, XMLs aguardando processamento e resumo do último processamento. */
app.get("/api/analise", (_req, res) => {
  const processados = quantidadeDeXmls(pastaAnalise);
  const arquivoVereditos = path.join(pastaSaida, "vereditos.json");
  const processada = processados > 0 && fs.existsSync(arquivoVereditos);
  const porEstado: Record<string, number> = {};
  const documentos = new Set<string>();
  if (processada) {
    for (const v of lerJson(arquivoVereditos, []) as { estado: string; documento: string }[]) {
      porEstado[v.estado] = (porEstado[v.estado] ?? 0) + 1;
      documentos.add(v.documento);
    }
  }
  const n = (estado: string) => porEstado[estado] ?? 0;
  res.json({
    processados,
    aguardando: quantidadeAguardando(pastaAnalise),
    respostas: lerRespostas(pastaAnalise).length,
    processada,
    resumo: processada ? {
      xmls: processados,
      documentos: documentos.size,
      itens: Object.values(porEstado).reduce((a, b) => a + b, 0),
      corretos: n("CORRETO"),
      incorretos: n("INCORRETO_ECONOMIA") + n("INCORRETO_RISCO"),
      precisamValidar: n("REQUER_VALIDACAO"),
      naoObrigatorio: n("NAO_OBRIGATORIO"),
      indeterminado: n("INDETERMINADO"),
      porEstado,
    } : null,
    indicadores: processada ? lerJson(path.join(pastaSaida, "indicadores.json"), {}) : null,
    composicao: processada ? lerJson(path.join(pastaSaida, "composicao.json"), null) : null,
  });
});

/** Nova análise: apaga XMLs, resultados, pendências, respostas e alertas da análise atual. */
app.post("/api/nova-analise", (_req, res) => {
  try {
    novaAnalise(pastaAnalise, pastaSaida);
    res.json({ sucesso: true });
  } catch (erro) {
    console.error("Erro ao iniciar nova análise:", erro);
    res.status(500).json({ erro: "Não foi possível iniciar a nova análise." });
  }
});

/** Respostas SIM/NÃO dadas nesta análise (não vêm de empresa.json). */
app.get("/api/respostas", (_req, res) => {
  res.json(lerRespostas(pastaAnalise));
});

app.post("/api/validar", (req, res) => {
  try {
    const { ncm, cProd, regraId, resposta, autor, justificativa } = req.body;

    if (!ncm || !cProd || !regraId || !["SIM", "NAO"].includes(resposta)) {
      return res.status(400).json({
        erro: "Dados de validação inválidos."
      });
    }

    // Fase 2: regra bloqueada por incompatibilidade oficial não aceita validação
    if (bloqueiosParaBase(arquivoBase).has(chaveBloqueio(regraId, ncm))) {
      return res.status(400).json({
        erro: `${MENSAGEM_BLOQUEIO} A validação não está disponível para esta regra.`,
        bloqueada: true
      });
    }

    // A resposta pertence só à análise atual; empresa.json não é alterado.
    const registro: RespostaValidacao = {
      ncm,
      cProd,
      regraId,
      resposta,
      autor: autor || "Sistema",
      data: new Date().toISOString().slice(0, 10),
      ...(justificativa ? { justificativa } : {})
    };
    registrarResposta(pastaAnalise, registro);
    const resultado = processarAnalise();

    res.json({
      sucesso: true,
      mensagem: "Validação gravada com sucesso.",
      pendencias: resultado.pendencias
    });
  } catch (erro) {
    console.error("Erro ao gravar validação:", erro);
    res.status(500).json({
      erro: "Não foi possível gravar a validação."
    });
  }
});

/** Adicionar XMLs: acrescenta os arquivos à análise atual, sem processar (ficam aguardando). */
app.post("/api/importar", upload.array("arquivos", 5000), (req, res) => {
  try {
    const arquivos = (req.files ?? []) as Express.Multer.File[];

    if (arquivos.length === 0) {
      return res.status(400).json({
        erro: "Nenhum arquivo XML foi enviado."
      });
    }

    const adicionados = adicionarXmls(pastaAnalise, arquivos.map((a) => ({ nome: a.originalname, caminho: a.path })));

    res.json({
      sucesso: true,
      adicionados,
      aguardando: quantidadeAguardando(pastaAnalise),
      processados: quantidadeDeXmls(pastaAnalise)
    });
  } catch (erro) {
    console.error("Erro ao adicionar XMLs:", erro);

    res.status(500).json({
      erro: "Não foi possível adicionar os XMLs.",
      detalhe: erro instanceof Error ? erro.message : String(erro)
    });
  }
});

/** Processar análise: incorpora os XMLs que aguardam e processa todos os XMLs da análise atual. */
app.post("/api/processar", (_req, res) => {
  try {
    if (quantidadeDeXmls(pastaAnalise) + quantidadeAguardando(pastaAnalise) === 0) {
      return res.status(400).json({
        erro: "A análise atual não tem XMLs. Adicione XMLs antes de processar."
      });
    }
    const incorporados = incorporarAguardando(pastaAnalise);
    const resultado = processarAnalise();

    res.json({
      sucesso: true,
      incorporados,
      xmls: resultado.xmls,
      documentos: resultado.documentos,
      descartados: resultado.descartados,
      indicadores: resultado.indicadores,
      pendencias: resultado.pendencias,
      alertas: resultado.alertas
    });
  } catch (erro) {
    console.error("Erro ao processar a análise:", erro);

    res.status(500).json({
      erro: "Não foi possível processar a análise.",
      detalhe: erro instanceof Error ? erro.message : String(erro)
    });
  }
});

app.get("/api/dashboard", (_req, res) => {
  try {
    res.json({
      indicadores: lerJson(path.join(pastaSaida, "indicadores.json"), {}),
      vereditos: lerJson(path.join(pastaSaida, "vereditos.json"), []),
      explicacoes: lerCabecalhoJson(path.join(pastaSaida, "explicacoes.json"), "vereditos") ?? {}
    });
  } catch (erro) {
    res.status(500).json({ erro: "Não foi possível carregar o dashboard." });
  }
});

/**
 * Redução por item, como o explicador resolveu (explicacaoInformativa.reducaoDoItem). O servidor não busca
 * vínculos: só lê explicacoes.json, confere que ele corresponde ao vereditos.json atual e entrega por
 * documento + nItem. Sem explicação válida, a redução fica indisponível (nada é presumido).
 */
/** O que a tela mostra de cada item, tal como o explicador resolveu (redução, conferência com as fontes, lacunas). */
interface ExibicaoDoItem {
  reducao: ReducaoDoItem | null;
  auditoria: Record<string, AuditoriaOficialDaRegra>;
  lacunas: LacunaDeCobertura[];
  bloqueios: Record<string, BloqueioOficial>;
}
type ReducoesDaAnalise =
  | { disponivel: true; porItem: Map<string, ExibicaoDoItem>; porPendencia: Map<string, ExibicaoDoItem> }
  | { disponivel: false; motivo: string };
const exibicaoDe = (x: VereditoExplicado): ExibicaoDoItem => ({
  reducao: x.explicacaoInformativa?.reducaoDoItem ?? null,
  auditoria: Object.fromEntries((x.explicacaoInformativa?.regras ?? []).filter((r) => r.auditoriaOficial).map((r) => [r.regraIdInformado, r.auditoriaOficial!])),
  lacunas: x.explicacaoInformativa?.lacunasDeCobertura ?? [],
  bloqueios: Object.fromEntries((x.explicacaoInformativa?.regras ?? []).filter((r) => r.bloqueio).map((r) => [r.regraIdInformado, r.bloqueio!])),
});
let cacheReducoes: { chave: string; valor: ReducoesDaAnalise } | null = null;

function reducoesDaAnalise(vereditos: Veredito[]): ReducoesDaAnalise {
  const arqIndice = path.join(pastaSaida, "reducoes-exibicao.json");
  const arqV = path.join(pastaSaida, "vereditos.json");
  const arqVReal = path.join(pastaSaida, "vereditos.json");
  if (!fs.existsSync(arqIndice) || !fs.existsSync(arqVReal)) {
    return { disponivel: false, motivo: "índice de reduções indisponível para os resultados atuais" };
  }

  const estado = (f: string) => {
    const s = fs.statSync(f);
    return `${s.mtimeMs}:${s.size}`;
  };

  const chave = `${estado(arqIndice)}|${estado(arqVReal)}`;
  if (cacheReducoes?.chave === chave) return cacheReducoes.valor;

  let valor: ReducoesDaAnalise;

  try {
    const indice = JSON.parse(fs.readFileSync(arqIndice, "utf8")) as {
      documento: string;
      nItem: string | number;
      ncm: string;
      cProd: string;
      produto: string;
      estado: string;
      exibicao: ExibicaoDoItem;
    }[];

    const porItem = new Map(
      indice.map((x) => [`${x.documento}|${x.nItem}`, x.exibicao])
    );

    const porPendencia = new Map(
      indice
        .filter((x) => x.estado === "REQUER_VALIDACAO")
        .reverse()
        .map((x) => [`${x.ncm}|${x.cProd}|${x.produto}`, x.exibicao])
    );

    valor = {
      disponivel: true,
      porItem,
      porPendencia,
    };
  } catch {
    valor = {
      disponivel: false,
      motivo: "não foi possível ler o índice de reduções",
    };
  }

  cacheReducoes = { chave, valor };
  return valor;
}

/** Enquadramento pendente: não mostra como "prevista" a regra que esta análise já respondeu NÃO para o item. */
function semRegrasNegadas(r: ReducaoDoItem | null, v: Veredito, respostas: RespostaValidacao[]): ReducaoDoItem | null {
  if (!r || r.situacao !== "prevista") return r;
  const negadas = new Set(respostas
    .filter((x) => x.resposta === "NAO" && x.ncm === v.ncm && (x.cProd === v.cProd || x.cProd === v.produto))
    .map((x) => x.regraId));
  return { ...r, opcoes: r.opcoes.filter((o) => !negadas.has(o.regraId)) };
}

app.get("/api/resultados", (_req, res) => {
  try {
    const vereditos = lerJson(path.join(pastaSaida, "vereditos.json"), []) as Veredito[];
    const reducoes = reducoesDaAnalise(vereditos);
    const respostas = lerRespostas(pastaAnalise);
    res.json(vereditos.map((v) => {
      if (!reducoes.disponivel) return { ...v, reducaoExibicao: null, reducaoIndisponivel: reducoes.motivo, auditoriaExibicao: null, lacunasDeCobertura: [], bloqueiosExibicao: {} };
      const e = reducoes.porItem.get(`${v.documento}|${v.nItem}`);
      return { ...v, reducaoExibicao: semRegrasNegadas(e?.reducao ?? null, v, respostas), auditoriaExibicao: e?.auditoria ?? {}, lacunasDeCobertura: e?.lacunas ?? [], bloqueiosExibicao: e?.bloqueios ?? {} };
    }));
  } catch (erro) {
    res.status(500).json({
      erro: "Não foi possível carregar os resultados."
    });
  }
});

/**
 * Rótulo, anexo, item e cClassTrib de cada regra da base (por regra + NCM), só para os textos dos Resultados.
 * A redução de alíquota NÃO sai daqui: vem por item em /api/resultados, da regra identificada pelo explicador.
 */
app.get("/api/regras", (_req, res) => {
  const base = lerJson(arquivoBase, { regras: [] }) as BaseNormativa;
  const mapa: Record<string, {
    rotulo: string | null; anexo: string | null; item: string | null; cClassTrib: string | null; cst: string | null; fundamentoLegal: string | null;
    reducao: number | null; vigenciaInicio: string | null; fonte: string | null; descricaoLegal: string | null;
  }> = {};
  for (const r of base.regras) {
    mapa[`${r.id}|${r.ncm}`] ??= {
      rotulo: r.rotulo ?? null, anexo: r.anexo ?? null, item: r.item ?? null, cClassTrib: r.cClassTrib ?? null, cst: r.cst ?? null, fundamentoLegal: r.fundamentoLegal ?? null,
      reducao: r.reducaoAliquota ?? null, vigenciaInicio: r.vigenciaInicio ?? null, fonte: r.fonte ?? null, descricaoLegal: r.descricaoLegal ?? null,
    };
  }
  res.json(mapa);
});

app.get("/api/fila-validacao", (_req, res) => {
  try {
    const dados = lerJson(arquivoFila, []) as { ncm: string; cProd: string; produto: string; regras: string[] }[];
    // Redução e evidência de cada regra candidata: as mesmas que o explicador resolveu (reducaoDoItem.opcoes)
    const reducoes = reducoesDaAnalise(lerJson(path.join(pastaSaida, "vereditos.json"), []) as Veredito[]);
    const respostas = lerRespostas(pastaAnalise);
    res.json(dados.map((p) => {
      const doGrupo = reducoes.disponivel ? reducoes.porPendencia.get(`${p.ncm}|${p.cProd}|${p.produto}`) ?? null : null;
      return {
        ...p,
        regrasDetalhe: detalharRegras(p.ncm, p.regras ?? []).map((g) => ({
          ...g,
          reducao: doGrupo?.reducao?.opcoes.find((o) => o.regraId === g.id) ?? null,
          auditoria: doGrupo?.auditoria[g.id] ?? null,
        })),
        lacunasDeCobertura: doGrupo?.lacunas ?? [],
        regrasBloqueadasDetalhe: Object.values(doGrupo?.bloqueios ?? {}),
        reducaoIndisponivel: reducoes.disponivel ? null : reducoes.motivo,
        respostasDestaAnalise: respostas.filter((x) => x.ncm === p.ncm && (x.cProd === p.cProd || x.cProd === p.produto)),
      };
    }));
  } catch (erro) {
    console.error("Erro ao ler fila-validacao.json:", erro);

    res.status(500).json({
      erro: "Não foi possível ler a fila de validação."
    });
  }
});

// Alertas somente para exibição. Não altera resultados, indicadores nem validações.
app.get("/api/alertas", (_req, res) => {
  res.json(lerAlertasParaExibicao(pastaSaida));
});

app.listen(PORTA, () => {
  console.log(`Servidor iniciado em http://localhost:${PORTA}`);
});












































