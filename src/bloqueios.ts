/**
 * Fase 2 da Etapa 5.3: bloqueio das regras oficialmente incompatíveis com o NCM.
 *
 * Os bloqueios saem só de data/auditoria-oficial.json (gerado por scripts/auditoria_oficial.mjs a partir
 * dos snapshots F1/F2 já registrados). Bloqueia-se a regra NCM × enquadramento, nunca o NCM inteiro e nunca
 * o produto: a elegibilidade do produto concreto continua sendo da validação humana.
 *
 * Critério (aprovado na Etapa 5.3):
 *   VEDADO_ANEXO_I       NCM VEDADO no SVRS com a ressalva "Produtos relacionados no Anexo I", e o NCM está
 *                        na lista oficial do Anexo I (200003)                                   (grupo A, 8)
 *   VEDADO_EXCECAO_ITEM  NCM VEDADO no SVRS e o próprio item da regra o exclui na lei            (grupo C, 125)
 *   VEDADO_EXCECAO_LEI   NCM VEDADO no SVRS e excluído pela lei noutro item do anexo            (grupo D, 2)
 *   EXCLUSAO_LEGAL       NCM ausente das fontes para o código e excluído pela lei no item da regra
 *                        (Anexo IV, item 49: "exceto os da posição 30.06")                      (14)
 */
import { createHash } from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import type { BloqueioOficial, FatoAuditoriaF1, FatoAuditoriaF2 } from "./tipos.js";

interface RegistroAuditoriaBloqueio {
  regraId: string; ncm: string; cClassTrib: string; item: string; status: string; motivos: string[];
  situacaoNcmSvrs: string; excecaoNaLeiEmItens: string[]; excluidoDoItemDaRegra: boolean; ncmNaListaDoAnexoI: boolean | null;
  fatosF1: FatoAuditoriaF1[]; fatosF2: FatoAuditoriaF2[];
}
interface AuditoriaParaBloqueio {
  entradas: Record<"base" | "v2" | "F1" | "F2", { sha256: string; url?: string; arquivo: string }>;
  regras: RegistroAuditoriaBloqueio[];
}

export const MENSAGEM_BLOQUEIO = "Regra bloqueada por incompatibilidade oficial do NCM com este enquadramento.";

export const chaveBloqueio = (regraId: string, ncm: string) => `${regraId}|${ncm}`;

/** Classifica um registro da auditoria; null quando a regra não deve ser bloqueada. */
export function tipoDeBloqueio(r: RegistroAuditoriaBloqueio): BloqueioOficial["tipo"] | null {
  if (r.situacaoNcmSvrs === "VEDADO") {
    if (r.ncmNaListaDoAnexoI === true) return "VEDADO_ANEXO_I";
    if (r.excluidoDoItemDaRegra) return "VEDADO_EXCECAO_ITEM";
    return "VEDADO_EXCECAO_LEI";
  }
  if (r.status === "NAO_LOCALIZADA" && r.excecaoNaLeiEmItens.length > 0) return "EXCLUSAO_LEGAL";
  return null;
}

const MOTIVO: Record<BloqueioOficial["tipo"], string> = {
  VEDADO_ANEXO_I: "O SVRS lista o NCM como VEDADO para este código, com a ressalva \"Produtos relacionados no Anexo I\"; o NCM consta da lista oficial do Anexo I (200003).",
  VEDADO_EXCECAO_ITEM: "O SVRS lista o NCM como VEDADO para este código e o próprio item da regra na LC 214/2025 exclui expressamente o NCM.",
  VEDADO_EXCECAO_LEI: "O SVRS lista o NCM como VEDADO para este código e a LC 214/2025 exclui expressamente o NCM no item do anexo que o abrange.",
  EXCLUSAO_LEGAL: "A LC 214/2025 exclui expressamente o NCM do item da regra, e o SVRS não o lista para este código.",
};

/** Monta os bloqueios a partir do conteúdo da auditoria (sem ler arquivos). */
export function montarBloqueios(a: AuditoriaParaBloqueio): Map<string, BloqueioOficial> {
  const m = new Map<string, BloqueioOficial>();
  for (const r of a.regras) {
    const tipo = tipoDeBloqueio(r);
    if (!tipo) continue;
    m.set(chaveBloqueio(r.regraId, r.ncm), {
      regraId: r.regraId, ncm: r.ncm, cClassTrib: r.cClassTrib, item: r.item, tipo,
      mensagem: MENSAGEM_BLOQUEIO, motivo: MOTIVO[tipo], motivosDaAuditoria: r.motivos,
      situacaoNcmSvrs: r.situacaoNcmSvrs, excecaoNaLeiEmItens: r.excecaoNaLeiEmItens,
      fatosF1: r.fatosF1, fatosF2: r.fatosF2,
      fontes: {
        F1: { url: a.entradas.F1.url ?? "", arquivo: a.entradas.F1.arquivo, sha256: a.entradas.F1.sha256 },
        F2: { url: a.entradas.F2.url ?? "", arquivo: a.entradas.F2.arquivo, sha256: a.entradas.F2.sha256 },
      },
    });
  }
  return m;
}

const cache = new Map<string, Map<string, BloqueioOficial>>();
const sha = (b: Buffer) => createHash("sha256").update(b).digest("hex");

/**
 * Bloqueios para a base indicada: lê auditoria-oficial.json na mesma pasta da base. Sem o arquivo, não há bloqueio.
 * Se a auditoria não tiver sido gerada sobre esta base, o processamento é interrompido: aplicar bloqueios de outra
 * versão, ou deixar de aplicá-los em silêncio, mudaria o resultado fiscal sem aviso.
 */
export function bloqueiosParaBase(arquivoBase: string): Map<string, BloqueioOficial> {
  const arquivoAuditoria = join(dirname(arquivoBase), "auditoria-oficial.json");
  if (!existsSync(arquivoAuditoria)) return new Map();
  const shaBase = sha(readFileSync(arquivoBase));
  const brutoAud = readFileSync(arquivoAuditoria);
  const chave = `${shaBase}|${sha(brutoAud)}`;
  const pronto = cache.get(chave);
  if (pronto) return pronto;
  const a = JSON.parse(brutoAud.toString("utf8")) as AuditoriaParaBloqueio;
  if (a.entradas.base.sha256 !== shaBase) {
    throw new Error(`${arquivoAuditoria} não corresponde a ${arquivoBase}: rode node scripts/auditoria_oficial.mjs antes de processar (os bloqueios oficiais dependem dela).`);
  }
  const m = montarBloqueios(a);
  cache.set(chave, m);
  return m;
}

/** Só as chaves (regraId|ncm), no formato que o motor recebe. */
export function chavesBloqueadas(m: Map<string, BloqueioOficial>): ReadonlySet<string> {
  return new Set(m.keys());
}
