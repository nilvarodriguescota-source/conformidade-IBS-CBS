/**
 * Benefício ou redução de alíquota por ATIVIDADE da empresa (aba Análise). Módulo novo e isolado.
 *
 * Não usa produto nem NCM: a tributação do produto continua sendo a do motor (classificarItem), que não é
 * chamado nem alterado aqui. Esta verificação só responde se a atividade econômica da empresa tem regime
 * específico com redução de alíquota na base consultada, com as condições e a fonte literal da lei.
 *
 * Base consultada: o regime específico de bares e restaurantes (LC 214/2025, arts. 273 a 276), o único regime
 * por atividade presente no sistema (o mesmo BARES_RESTAURANTES do motor). Texto literal extraído do snapshot
 * registrado da LC 214/2025 por scripts/extrair_beneficio_atividade.mjs.
 *
 * Atividade: CNAE do emitente informado nos XMLs da análise (FONTE_DIZ: campo emit/CNAE) e a marcação
 * "barOuRestaurante" do cadastro da empresa (empresa.json). O vínculo CNAE → atividade da lei é inferência do
 * sistema e fica marcado como tal. Sem confirmação no cadastro, o benefício nunca é dado como confirmado.
 */
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { BARES_RESTAURANTES } from "./motor.js";
import { ALIQUOTAS, aliquotaVigente } from "./parametros.js";
import type { Empresa } from "./tipos.js";

export interface TextoLegalAtividade {
  descricao: string;
  fonte: { id: string; nome: string; url: string; versao: string; dataConsulta: string; arquivo: string; sha256: string };
  artigos: { dispositivo: string; ancora: string; texto: string }[];
}

/** Classe CNAE 56.11-2 (restaurantes e outros estabelecimentos de serviços de alimentação e bebidas). */
const CLASSE_CNAE_BARES_RESTAURANTES = "5611";
const SUBCLASSES_CNAE: Record<string, string> = {
  "5611201": "Restaurantes e similares",
  "5611203": "Lanchonetes, casas de chá, de sucos e similares",
  "5611204": "Bares e outros estabelecimentos especializados em servir bebidas, sem entretenimento",
  "5611205": "Bares e outros estabelecimentos especializados em servir bebidas, com entretenimento",
};
/** Citado literalmente no art. 273, § 2º, I: não está sujeito ao regime. */
const CNAE_EXCLUIDO = "5620101";

export const CLASSIFICACOES_ATIVIDADE = {
  CONFIRMADO: "BENEFÍCIO CONFIRMADO",
  REQUER_VALIDACAO: "BENEFÍCIO POTENCIALMENTE APLICÁVEL — REQUER VALIDAÇÃO",
  NENHUM: "NENHUM BENEFÍCIO POR ATIVIDADE IDENTIFICADO",
} as const;
export type ClassificacaoAtividade = keyof typeof CLASSIFICACOES_ATIVIDADE;

export const cnaeFormatado = (c: string) => (/^\d{7}$/.test(c) ? `${c.slice(0, 4)}-${c.slice(4, 5)}/${c.slice(5)}` : c);

/** CNAE do emitente em cada XML da pasta (emit/CNAE), com a quantidade de XMLs. Só leitura. */
export function cnaesDosXmls(pasta: string): { cnae: string; xmls: number }[] {
  const conta = new Map<string, number>();
  let arquivos: string[] = [];
  try { arquivos = readdirSync(pasta).filter((f) => f.toLowerCase().endsWith(".xml")); } catch { return []; }
  for (const f of arquivos) {
    const xml = readFileSync(join(pasta, f), "utf8");
    const emit = /<emit>([\s\S]*?)<\/emit>/.exec(xml)?.[1];
    const cnae = emit ? /<CNAE>(\d+)<\/CNAE>/.exec(emit)?.[1] : undefined;
    if (cnae) conta.set(cnae, (conta.get(cnae) ?? 0) + 1);
  }
  return [...conta].map(([cnae, xmls]) => ({ cnae, xmls })).sort((a, b) => b.xmls - a.xmls);
}

export interface PassoAuditoria { camada: "FONTE_DIZ" | "SISTEMA_INFERE" | "HUMANO_CONFIRMOU" | "PENDENTE"; texto: string }

export interface ResultadoBeneficioAtividade {
  classificacao: ClassificacaoAtividade;
  rotulo: string;
  atividade: {
    cnaes: { cnae: string; formatado: string; descricao: string | null; xmls: number; corresponde: boolean; excluido: boolean }[];
    declaradaNoCadastro: boolean;
    descricao: string;
  };
  beneficio: null | {
    atividadeDaLei: string;
    descricao: string;
    percentualReducao: number;
    percentualNaLei: number | null;
    aliquotas: { tributo: string; aliquota: number; fonte: string }[];
    aliquotaGeral: number | null;
    aliquotaAposReducao: number | null;
    dataAliquotas: string;
    fundamentoLegal: string;
    condicoes: { dispositivo: string; texto: string }[];
    textoLegal: { dispositivo: string; ancora: string; texto: string; url: string }[];
  };
  motivo: string;
  auditoria: PassoAuditoria[];
  fonte: TextoLegalAtividade["fonte"];
}

/** Classifica o benefício por atividade. Não lê produto, NCM nem vereditos. */
export function avaliarBeneficioAtividade(o: {
  empresa: Pick<Empresa, "barOuRestaurante">;
  cnaes: { cnae: string; xmls: number }[];
  lei: TextoLegalAtividade;
  agora?: string;
}): ResultadoBeneficioAtividade {
  const agora = o.agora ?? new Date().toISOString();
  const art = (d: string) => o.lei.artigos.find((a) => a.dispositivo === d);
  const a273 = art("Art. 273"), a275 = art("Art. 275");
  if (!a273 || !a275) throw new Error("Texto legal do regime de bares e restaurantes incompleto (arts. 273 e 275).");

  const cnaes = o.cnaes.map((c) => ({
    ...c, formatado: cnaeFormatado(c.cnae), descricao: SUBCLASSES_CNAE[c.cnae] ?? null,
    corresponde: c.cnae.startsWith(CLASSE_CNAE_BARES_RESTAURANTES), excluido: c.cnae === CNAE_EXCLUIDO,
  }));
  const declarada = o.empresa.barOuRestaurante === true;
  const corresponde = cnaes.filter((c) => c.corresponde);
  const excluidos = cnaes.filter((c) => c.excluido);
  const outros = cnaes.filter((c) => !c.corresponde && !c.excluido);

  // Percentual: o do motor (BARES_RESTAURANTES.reducao), conferido com o texto literal do art. 275
  const naLei = /reduzidas em (\d+(?:,\d+)?)%/.exec(a275.texto);
  const percentualNaLei = naLei ? Number(naLei[1]!.replace(",", ".")) / 100 : null;
  const aliquotas = (["CBS", "IBS"] as const)
    .map((t) => aliquotaVigente(t, agora, false, ALIQUOTAS))
    .filter((p): p is NonNullable<typeof p> => !!p)
    .map((p) => ({ tributo: p.tributo, aliquota: p.aliquota, fonte: p.fonte }));
  const geral = aliquotas.length === 2 ? Number(aliquotas.reduce((s, a) => s + a.aliquota, 0).toFixed(6)) : null;
  const url = (ancora: string) => `${o.lei.fonte.url}#${ancora}`;
  const paragrafos = (t: string) => t.split(/\s(?=§ \d+º)/);
  const beneficio: NonNullable<ResultadoBeneficioAtividade["beneficio"]> = {
    atividadeDaLei: "Bares e restaurantes, inclusive lanchonetes",
    descricao: "Regime específico de incidência do IBS e da CBS, com redução das alíquotas.",
    percentualReducao: BARES_RESTAURANTES.reducao,
    percentualNaLei,
    aliquotas,
    aliquotaGeral: geral,
    aliquotaAposReducao: geral === null ? null : Number((geral * (1 - BARES_RESTAURANTES.reducao)).toFixed(6)),
    dataAliquotas: agora.slice(0, 10),
    fundamentoLegal: "LC 214/2025, arts. 273 a 276 (redução: art. 275)",
    condicoes: paragrafos(a273.texto).slice(1).map((texto) => ({ dispositivo: `Art. 273, ${texto.slice(0, 4).trim()}`, texto })),
    textoLegal: o.lei.artigos.map((a) => ({ ...a, url: url(a.ancora) })),
  };

  const aud: PassoAuditoria[] = [];
  aud.push(cnaes.length
    ? { camada: "FONTE_DIZ", texto: `CNAE do emitente nos XMLs da análise (campo emit/CNAE): ${cnaes.map((c) => `${c.formatado}${c.descricao ? ` (${c.descricao})` : ""} em ${c.xmls} XML(s)`).join("; ")}.` }
    : { camada: "PENDENTE", texto: "Os XMLs da análise não informam o CNAE do emitente (ou a análise não tem XMLs)." });
  aud.push({ camada: declarada ? "HUMANO_CONFIRMOU" : "PENDENTE", texto: declarada
    ? "Atividade confirmada: a empresa atende consumo no local (bar, restaurante ou lanchonete), declarada nesta análise ou no cadastro da empresa (barOuRestaurante = true)."
    : "Atividade não confirmada: a empresa não foi declarada bar, restaurante ou lanchonete, nem nesta análise nem no cadastro da empresa (barOuRestaurante ausente ou false)." });
  if (corresponde.length) aud.push({ camada: "SISTEMA_INFERE", texto: `O sistema associou o CNAE ${corresponde.map((c) => c.formatado).join(", ")} (classe 56.11-2, restaurantes e outros estabelecimentos de serviços de alimentação e bebidas) à atividade "bares e restaurantes, inclusive lanchonetes" do art. 273. A lei não lista CNAEs para o regime; o vínculo é do sistema.` });
  if (excluidos.length) aud.push({ camada: "FONTE_DIZ", texto: `LC 214/2025, art. 273, § 2º, I: o fornecimento "por empresa classificada na posição 5620-1/01 da Classificação Nacional de Atividades Econômicas (CNAE)" não está sujeito ao regime.` });
  aud.push({ camada: "FONTE_DIZ", texto: `LC 214/2025, art. 275: "${a275.texto.replace(/^Art\. 275\.\s*/, "")}"` });
  aud.push(percentualNaLei === BARES_RESTAURANTES.reducao
    ? { camada: "SISTEMA_INFERE", texto: `O percentual do regime usado pelo motor (${BARES_RESTAURANTES.reducao * 100}%, ${BARES_RESTAURANTES.fundamento}) confere com o texto do art. 275.` }
    : { camada: "PENDENTE", texto: `O percentual do motor (${BARES_RESTAURANTES.reducao * 100}%) não pôde ser conferido com o texto do art. 275.` });
  aud.push({ camada: "PENDENTE", texto: "Condições do art. 273, §§ 1º e 2º, dependem de cada fornecimento (preparo no estabelecimento, bebida alcoólica, produto de terceiros, alimentação para pessoa jurídica sob contrato) e não são comprovadas pelo XML. A aplicação item a item continua com o motor, pela natureza do item; nada aqui altera a tributação do produto." });

  let classificacao: ClassificacaoAtividade;
  let motivo: string;
  if (excluidos.length && !corresponde.length && !declarada) {
    classificacao = "NENHUM";
    motivo = "O CNAE do emitente é 5620-1/01, excluído do regime de bares e restaurantes pelo art. 273, § 2º, I.";
  } else if (declarada && corresponde.length && !outros.length && !excluidos.length) {
    classificacao = "CONFIRMADO";
    motivo = "A atividade está confirmada no cadastro da empresa e o CNAE dos XMLs corresponde a bares e restaurantes. O regime da atividade se aplica aos fornecimentos que atendem ao art. 273; cada item continua classificado pelo motor.";
  } else if (declarada || corresponde.length) {
    classificacao = "REQUER_VALIDACAO";
    motivo = declarada
      ? `A empresa foi declarada bar ou restaurante, mas ${cnaes.length ? `o CNAE dos XMLs (${outros.concat(excluidos).map((c) => c.formatado).join(", ")}) não confirma a atividade` : "os XMLs não informam o CNAE"}.`
      : `O CNAE dos XMLs (${corresponde.map((c) => c.formatado).join(", ")}) indica bares e restaurantes, mas a atividade não foi confirmada. Enquanto não for confirmada (botão "A empresa atende consumo no local"), o motor trata os itens como mercadoria.`;
  } else {
    classificacao = "NENHUM";
    motivo = cnaes.length
      ? `O CNAE dos XMLs (${cnaes.map((c) => c.formatado).join(", ")}) não corresponde a nenhum regime por atividade da base consultada (bares e restaurantes, arts. 273 a 276).`
      : "Sem CNAE nos XMLs e sem marcação de atividade no cadastro: nenhum regime por atividade da base consultada foi identificado.";
  }

  const descricaoAtividade = corresponde.length
    ? corresponde.map((c) => `${c.formatado}${c.descricao ? ` — ${c.descricao}` : ""}`).join("; ")
    : cnaes.length ? cnaes.map((c) => `${c.formatado}${c.descricao ? ` — ${c.descricao}` : ""}`).join("; ")
      : declarada ? "Bar ou restaurante (declarado pela empresa)" : "não identificada";

  return {
    classificacao,
    rotulo: CLASSIFICACOES_ATIVIDADE[classificacao],
    atividade: { cnaes, declaradaNoCadastro: declarada, descricao: descricaoAtividade },
    beneficio: classificacao === "NENHUM" ? null : beneficio,
    motivo,
    auditoria: aud,
    fonte: o.lei.fonte,
  };
}
