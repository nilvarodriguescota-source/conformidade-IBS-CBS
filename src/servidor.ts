import { opcoesDaPergunta } from "./opcoes-validacao.js";
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
import { consultarNcm, type ContextoConsultaNcm } from "./consulta-ncm.js";
import { carregarContexto } from "./explicador.js";
import { chavesBloqueadas } from "./bloqueios.js";
import { avaliarBeneficioAtividade, cnaesDosXmls, type TextoLegalAtividade } from "./beneficio-atividade.js";

const app = express();
const PORTA = Number(process.env.PORT) || 3000;

app.use(express.json());

/** Máximo de arquivos por "Adicionar XMLs" (era 5.000). */
const LIMITE_XMLS_POR_ENVIO = 10000;

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
const ESCOLHAS = ["CONSUMO_NO_LOCAL", "MERCADORIA_SEM_BENEFICIO", "NCM_INCORRETO"];

function detalharRegras(ncm: string, ids: string[]) {
  const base = lerJson(arquivoBase, { regras: [] }) as BaseNormativa;
  return ids.map((id) => {
    const achadas = base.regras.filter((r) => r.id === id && r.ncm === ncm);
    const comum = <K extends "cst" | "cClassTrib" | "rotulo" | "anexo" | "item" | "descricaoLegal" | "fundamentoLegal" | "reducao" | "reducaoAliquota" | "descricaoNcmTipi">(k: K) => {
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
      reducaoAliquota: comum("reducaoAliquota"),
      descricaoNcmTipi: comum("descricaoNcmTipi"),
      identificadorRepetido: achadas.length > 1,
      regrasComEsteIdentificador: achadas.length,
      descricoesLegaisDivergentes: achadas.length > 1 && comum("descricaoLegal") === null
        ? [...new Set(achadas.map((r) => r.descricaoLegal))] : [],
    };
  });
}

app.use("/vendor", express.static(path.join(process.cwd(), "public", "vendor")));
app.use("/marca", express.static(path.join(process.cwd(), "public", "marca")));

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
    const { ncm, cProd, regraId, regraIds, resposta, autor, justificativa, escolha } = req.body;
    // Múltipla escolha: a escolha vai junto de NÃO nas regras candidatas (compatível com quem lê só SIM/NÃO)
    if (escolha !== undefined && (!ESCOLHAS.includes(escolha) || resposta !== "NAO")) {
      return res.status(400).json({ erro: "Escolha de validação inválida." });
    }
    // Uma validação por produto: a mesma resposta para várias regras candidatas, com um só reprocessamento
    const ids: string[] = Array.isArray(regraIds) && regraIds.length ? regraIds.map(String) : regraId ? [String(regraId)] : [];

    if (!ncm || !cProd || !ids.length || !["SIM", "NAO"].includes(resposta)) {
      return res.status(400).json({
        erro: "Dados de validação inválidos."
      });
    }

    // Fase 2: regra bloqueada por incompatibilidade oficial não aceita validação
    const bloqueadas = bloqueiosParaBase(arquivoBase);
    if (ids.some((id) => bloqueadas.has(chaveBloqueio(id, ncm)))) {
      return res.status(400).json({
        erro: `${MENSAGEM_BLOQUEIO} A validação não está disponível para esta regra.`,
        bloqueada: true
      });
    }

    // A resposta pertence só à análise atual; empresa.json não é alterado.
    for (const id of ids) {
      const registro: RespostaValidacao = {
        ncm,
        cProd,
        regraId: id,
        resposta,
        autor: autor || "Sistema",
        data: new Date().toISOString().slice(0, 10),
        ...(justificativa ? { justificativa } : {}),
        ...(escolha ? { escolha } : {})
      };
      registrarResposta(pastaAnalise, registro);
    }
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
app.post("/api/importar", upload.array("arquivos", LIMITE_XMLS_POR_ENVIO), (req, res) => {
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
    const vereditos = lerJson(path.join(pastaSaida, "vereditos.json"), []) as Veredito[];
    const reducoes = reducoesDaAnalise(vereditos);
    const respostas = lerRespostas(pastaAnalise);
    // Vendas do produto sem o grupo IBS/CBS no XML (cadastro sem informação tributária), por cProd
    const semInformacao = new Map<string, { total: number; naoObrigatorios: number }>();
    for (const v of vereditos) {
      if (v.informado.cst !== null || v.informado.cClassTrib !== null) continue;
      const c = semInformacao.get(v.cProd) ?? { total: 0, naoObrigatorios: 0 };
      c.total += 1;
      if (v.estado === "NAO_OBRIGATORIO") c.naoObrigatorios += 1;
      semInformacao.set(v.cProd, c);
    }
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
        // Pergunta de múltipla escolha: "O que é este produto?", com o resultado de cada opção
        opcoesValidacao: opcoesDaPergunta(p.ncm, p.produto, detalharRegras(p.ncm, p.regras ?? []).map((g) => ({
          id: g.id,
          cst: g.cst,
          cClassTrib: g.cClassTrib,
          anexo: g.anexo,
          item: g.item,
          descricaoLegal: g.descricaoLegal,
          fundamentoLegal: g.fundamentoLegal,
          reducaoAliquota: typeof g.reducaoAliquota === "number" ? g.reducaoAliquota : null,
          descricaoNcmTipi: typeof g.descricaoNcmTipi === "string" ? g.descricaoNcmTipi : null,
        }))),
        regrasBloqueadasDetalhe: Object.values(doGrupo?.bloqueios ?? {}),
        reducaoIndisponivel: reducoes.disponivel ? null : reducoes.motivo,
        respostasDestaAnalise: respostas.filter((x) => x.ncm === p.ncm && (x.cProd === p.cProd || x.cProd === p.produto)),
        itensSemInformacaoTributaria: semInformacao.get(p.cProd)?.total ?? 0,
        itensNaoObrigatoriosSemInformacao: semInformacao.get(p.cProd)?.naoObrigatorios ?? 0,
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

/**
 * Consulta Tributária por NCM (sem XML): motor e explicador existentes, via src/consulta-ncm.ts. Nada é gravado;
 * não altera a análise atual, os resultados nem as respostas. As bases são lidas uma vez e reaproveitadas.
 */
let contextoConsultaNcm: Omit<ContextoConsultaNcm, "empresa"> | null = null;
app.post("/api/consulta-ncm", (req, res) => {
  try {
    if (!contextoConsultaNcm) {
      const explicacao = carregarContexto({
        base: arquivoBase,
        v2: path.join(process.cwd(), "data", "base-normativa.v2.json"),
        matriz: path.join(process.cwd(), "docs", "etapa6", "matriz-decisao.json"),
        empresa: arquivoEmpresa,
      });
      const bloqueios = bloqueiosParaBase(arquivoBase);
      contextoConsultaNcm = { base: explicacao.base, explicacao, bloqueios, regrasBloqueadas: chavesBloqueadas(bloqueios) };
    }
    // Configuração da empresa (regime, bar/restaurante), sem as respostas de validação
    const { validacoes: _ignoradas, ...empresa } = lerJson(arquivoEmpresa, {}) as ContextoConsultaNcm["empresa"] & { validacoes?: unknown };
    if (!empresa.regime) {
      res.status(400).json({ erro: "empresa.json sem o regime do emitente: a consulta precisa dele para saber se o grupo IBS/CBS é exigido." });
      return;
    }
    const { ncm, modelo, natureza } = req.body ?? {};
    const r = consultarNcm({ ncm, modelo, natureza }, { ...contextoConsultaNcm, empresa });
    if (!r.ok) {
      res.status(400).json({ erro: r.erro });
      return;
    }
    res.json(r);
  } catch (erro) {
    console.error("Erro na consulta por NCM:", erro);
    res.status(500).json({ erro: "Não foi possível consultar o NCM." });
  }
});

/**
 * Benefício ou redução de alíquota por atividade da empresa (aba Análise), via src/beneficio-atividade.ts.
 * Não usa produto/NCM nem vereditos; só o CNAE do emitente nos XMLs da análise e o cadastro da empresa.
 * Nada é gravado. O CNAE é relido quando a lista de XMLs processados muda.
 */
let cacheCnaes: { chave: string; valor: { cnae: string; xmls: number }[] } | null = null;
app.get("/api/beneficio-atividade", (_req, res) => {
  try {
    const pastaXmls = path.join(pastaAnalise, "xmls");
    const nomes = fs.existsSync(pastaXmls) ? fs.readdirSync(pastaXmls).filter((f) => f.toLowerCase().endsWith(".xml")).sort() : [];
    const chave = `${nomes.length}|${nomes[0] ?? ""}|${nomes[nomes.length - 1] ?? ""}`;
    if (cacheCnaes?.chave !== chave) cacheCnaes = { chave, valor: cnaesDosXmls(pastaXmls) };
    const lei = lerJson(path.join(process.cwd(), "data", "fontes", "lc214", "regime-bares-restaurantes.json"), null) as TextoLegalAtividade | null;
    if (!lei) {
      res.status(500).json({ erro: "Texto legal do regime por atividade não encontrado (data/fontes/lc214/regime-bares-restaurantes.json)." });
      return;
    }
    const empresa = lerJson(arquivoEmpresa, {}) as { barOuRestaurante?: boolean };
    res.json(avaliarBeneficioAtividade({ empresa, cnaes: cacheCnaes.valor, lei }));
  } catch (erro) {
    console.error("Erro no benefício por atividade:", erro);
    res.status(500).json({ erro: "Não foi possível verificar o benefício por atividade." });
  }
});

app.listen(PORTA, () => {
  console.log(`Servidor iniciado em http://localhost:${PORTA}`);
});












































