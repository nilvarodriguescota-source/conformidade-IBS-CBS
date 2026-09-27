// Etapa 5.3 (Fase 3) da base v2: registro das evidências oficiais já auditadas (proveniência).
//
// Fonte única: data/auditoria-oficial.json (scripts/auditoria_oficial.mjs, Etapa 5.1), gerada sobre a base
// atual e os snapshots F1/F2 já registrados na v2 (Etapa 4). Nenhuma auditoria nova é feita aqui.
//
// Acrescenta, sem editar nenhum campo existente:
//   regras[i].itemOficial   só quando a lei cobre o NCM com um único item (e o NCM não é VEDADO no SVRS);
//                           o campo item original não muda
//   evidenciasOficiais      bloco na raiz, depois de vinculacoes:
//     fontes                F1/F2 com URL, arquivo, SHA-256, versão e data de consulta (os da Etapa 4)
//     codigo                vínculos de código (CST, anexo, redução, fundamento) dos 10 códigos fora do
//                           escopo da Etapa 5, no mesmo formato de vinculacoes.codigo; 200033 e 200043 não
//                           são repetidos (já estão em vinculacoes)
//     regras                a evidência de cada uma das 1.369 regras: status oficial, item oficial ou itens
//                           possíveis, divergências e fatos da lei e do SVRS; para 200033/200043 só a
//                           referência ao vínculo da Etapa 5 (sem copiar os fatos)
//
// O bloqueio das regras (Fase 2) continua só em src/bloqueios.ts; aqui nada é bloqueado.
// D3: registra-se o dado que o explicador usa (vínculo NCM × item CONFIRMADO ou não), sem outra lógica.
import fs from "node:fs";
import crypto from "node:crypto";
import { ESCOPO } from "./base_v2_vinculos.mjs";

export const AUDITORIA = "data/auditoria-oficial.json";
const BASE_ATUAL = "data/base-normativa.json";
/** Data em que a auditoria oficial (Etapa 5.1) foi feita sobre os snapshots. */
export const DATA_AUDITORIA = "2026-09-24";
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const NATUREZA = {
  F1: "texto legal: Lei Complementar nº 214/2025 publicada no Planalto",
  F2: "tabela de apoio do portal da Conformidade Fácil (SVRS); não é texto legal",
};
export const CAMPOS_CODIGO = ["cst", "anexo", "reducaoAliquota", "fundamentoLegal"];
const posicaoNcm = (item) => item === "" || /^\d{2}\.\d{2}$/.test(item);

/** Monta os blocos da Etapa 5.3 a partir da base em construção (após a Etapa 5) e do conteúdo da auditoria. */
export function montarEvidencias(base, auditoria, shaBaseAtual) {
  const reg = base.fontes.registros;
  const arquivo = (id) => Object.values(reg).flatMap((r) => r.arquivos).find((a) => a.id === id);
  // A auditoria tem de ter sido feita sobre esta base e estes snapshots
  if (auditoria.entradas.base.sha256 !== shaBaseAtual) throw new Error("auditoria-oficial.json não foi gerada sobre a base atual");
  if (auditoria.entradas.F1.sha256 !== arquivo("F1.html").sha256 || auditoria.entradas.F2.sha256 !== arquivo("F2.html").sha256) {
    throw new Error("auditoria-oficial.json não foi gerada sobre os snapshots F1/F2 registrados na v2");
  }
  if (auditoria.regras.length !== base.regras.length) throw new Error("auditoria-oficial.json não cobre todas as regras");
  // A auditoria lista as regras por código; aqui ficam na ordem da base (índice), uma por regra
  const porIndice = [...auditoria.regras].sort((x, y) => x.indice - y.indice);
  porIndice.forEach((a, n) => {
    const r = base.regras[a.indice];
    if (a.indice !== n || !r || r.id !== a.regraId || r.ncm !== a.ncm || r.cClassTrib !== a.cClassTrib || r.item !== a.item) {
      throw new Error(`auditoria-oficial.json: registro de índice ${a.indice} não corresponde à regra da base`);
    }
  });

  const meta = (fonte, id) => ({ fonte, arquivo: id, sha256: arquivo(id).sha256, natureza: NATUREZA[fonte], versao: reg[fonte].versao, dataConsulta: reg[fonte].dataConsulta });
  const fontes = Object.fromEntries(["F1", "F2"].map((f) => {
    const a = arquivo(`${f}.html`);
    return [f, { url: reg[f].url, arquivo: a.caminho, sha256: a.sha256, versao: reg[f].versao, dataConsulta: reg[f].dataConsulta, natureza: NATUREZA[f] }];
  }));

  // ---------- vínculos de código dos códigos fora do escopo da Etapa 5 ----------
  const codigo = [];
  for (const [cod, c] of Object.entries(auditoria.codigos)) {
    if (cod in ESCOPO) continue;
    const alvo = base.regras.map((r, i) => [r, i]).filter(([r]) => r.cClassTrib === cod);
    const alcance = alvo.map(([r, i]) => ({ indice: i, linha: r.original.linha, regraId: r.id, ncm: r.ncm }));
    const unico = (k) => { const v = [...new Set(alvo.map(([r]) => r[k]))]; if (v.length !== 1) throw new Error(`${cod}: ${k} não é único`); return v[0]; };
    const fatoF1 = { ...meta("F1", "F1.html"), localizacao: { dispositivo: `art. ${c.F1.artigo}, caput`, ancora: c.F1.ancora }, trecho: c.F1.caput };
    const fatoF2 = (campo, valor) => ({ ...meta("F2", "F2.html"), localizacao: { cst: c.F2.cst, cClassTrib: cod, campo }, valor });
    const status = (r) => (r === "concorda" ? "inequivoco" : r === "parcial" ? "ambiguo" : "conflito");
    const rec = (campo, fatos, dadoExtraido, resultado, interpretacao) => codigo.push({
      id: `C-${cod}-${campo}`, cClassTrib: cod, alcance, campoRegra: campo, valorRegra: unico(campo), fatos, dadoExtraido,
      comparacao: { resultado }, interpretacao,
      propostaFutura: "Nenhuma: registro de evidência (Etapa 5.3); o valor da regra não muda.", status: status(resultado),
      origem: { etapa: "5.1", arquivo: AUDITORIA, dataAuditoria: DATA_AUDITORIA },
    });
    rec("cst", [fatoF2("Cst", c.F2.cst)], { F2: c.F2.cst }, c.comparacao.cst, null);
    rec("anexo", [fatoF1, fatoF2("NroAnexo", c.F2.nroAnexo)], { F1: `Anexo ${c.anexo}`, F2: c.F2.nroAnexo }, c.comparacao.anexo,
      `O F2 numera o anexo em algarismo arábico (${c.F2.nroAnexo}); a lei e a regra usam romano (${c.anexo}).`);
    const red = unico("reducaoAliquota");
    rec("reducaoAliquota", [fatoF1, fatoF2("PercRedIbs", c.F2.percRedIbs), fatoF2("PercRedCbs", c.F2.percRedCbs)],
      { F1: c.F1.reducaoLida === 1 ? "alíquotas do IBS e da CBS reduzidas a zero" : c.F1.reducaoLida === 0.6 ? "redução de 60% das alíquotas do IBS e da CBS" : null, F2: { PercRedIbs: c.F2.percRedIbs, PercRedCbs: c.F2.percRedCbs } },
      c.comparacao.reducao,
      red === 1
        ? "Redução a zero corresponde a reducaoAliquota 1.0 e a tratamento aliquota_zero; as fontes dão o mesmo percentual (100%) para IBS e CBS."
        : "60% corresponde a reducaoAliquota 0.6 e a tratamento reducao_60. A regra tem um único campo para IBS e CBS; as fontes dão o mesmo percentual para os dois.");
    rec("fundamentoLegal", [fatoF1, fatoF2("TexUrlLegislacao", c.F2.texUrlLegislacao)], { F1: c.F1.dispositivo, F2: c.F2.texUrlLegislacao }, c.comparacao.fundamento,
      "O SVRS aponta o link do artigo; o sistema relacionou a âncora ao caput do artigo que remete ao anexo.");
  }

  // ---------- evidência por regra ----------
  const regras = porIndice.map((a) => {
    const r = base.regras[a.indice];
    const statusOficial = a.situacaoNcmSvrs === "VEDADO" ? "VEDADO" : a.status;
    const itemOficial = a.itemOficial != null && a.situacaoNcmSvrs !== "VEDADO" ? a.itemOficial : null;
    const divergencias = [];
    if (itemOficial != null && itemOficial !== a.item) divergencias.push({ tipo: "item_da_base_difere_do_item_oficial", itemDaBase: a.item, itemOficial });
    if (a.itensOficiais.length > 1) divergencias.push({ tipo: "varios_itens_oficiais", itens: a.itensOficiais, itemDaBaseEntreEles: a.itemDaRegraEntreOsOficiais });
    if (a.itensOficiais.length > 1 && !a.itemDaRegraEntreOsOficiais) divergencias.push({ tipo: "item_da_base_fora_dos_itens_oficiais", itemDaBase: a.item, itens: a.itensOficiais });
    if (posicaoNcm(a.item)) divergencias.push({ tipo: "item_da_base_com_forma_de_posicao_ncm", itemDaBase: a.item, observacao: "Valor da coluna Item da planilha; não corresponde à numeração do anexo e não foi corrigido." });
    for (const m of a.motivos) if (m.startsWith("NCM só na lei") || m.startsWith("NCM só no SVRS")) divergencias.push({ tipo: "fontes_divergem", detalhe: m });
    if (a.situacaoNcmSvrs === "VEDADO") divergencias.push({ tipo: "ncm_vedado_no_svrs", excecao: [...new Set(a.fatosF2.filter((f) => f.TipoPermissao === "VEDADO").map((f) => f.DescExcecao))] });
    if (a.excecaoNaLeiEmItens.length) divergencias.push({ tipo: "excecao_na_lei", itens: a.excecaoNaLeiEmItens, noItemDaBase: a.excluidoDoItemDaRegra });
    const naEtapa5 = r.cClassTrib in ESCOPO;
    return {
      indice: a.indice, linhaPlanilha: r.original.linha, regraId: a.regraId, ncm: a.ncm, cClassTrib: a.cClassTrib,
      itemDaBase: a.item, itemOficial, itensOficiais: a.itensOficiais,
      statusOficial, statusAuditoria: a.status, situacaoNcmSvrs: a.situacaoNcmSvrs,
      // D3 (definição aprovada): vínculo NCM × item com a fonte oficial não CONFIRMADO; é o dado que o explicador usa
      vinculoNcmItemConfirmado: a.status === "CONFIRMADA",
      motivos: a.motivos, divergencias,
      ...(naEtapa5
        ? { vinculoEtapa5: `R-${a.indice}` }
        : { fatosF1: a.fatosF1.map((f) => ({ fonte: "F1", ...f })), fatosF2: a.fatosF2.map((f) => ({ fonte: "F2", ...f })) }),
    };
  });

  const conta = (xs, k) => xs.reduce((o, x) => ((o[x[k]] = (o[x[k]] ?? 0) + 1), o), {});
  return {
    itemOficialPorIndice: new Map(regras.filter((x) => x.itemOficial != null).map((x) => [x.indice, x.itemOficial])),
    bloco: {
      descricao: "Evidências oficiais registradas na Etapa 5.3 (Fase 3), a partir da auditoria da Etapa 5.1. Só proveniência: nenhum campo das regras foi alterado e nada é bloqueado aqui (o bloqueio da Fase 2 está em src/bloqueios.ts).",
      etapa: "5.3 — Fase 3",
      dataAuditoria: DATA_AUDITORIA,
      origem: { arquivo: AUDITORIA, gerador: "scripts/auditoria_oficial.mjs", sha256DaBaseAuditada: shaBaseAtual },
      fontes,
      precedencia: "A lei (F1) é a fonte jurídica primária; o SVRS (F2) é fonte oficial operacional/complementar. Divergências entre as fontes ficam registradas, nunca resolvidas em silêncio.",
      definicaoD3: "D3 = regras cujo vínculo NCM × item com a fonte oficial não está CONFIRMADO na auditoria oficial (vinculoNcmItemConfirmado = false). Regras bloqueadas na Fase 2 já têm política e não entram na D3.",
      definicaoStatus: {
        CONFIRMADA: "código (CST, anexo, redução) concorda com F1 e F2; NCM PERMITIDO no SVRS; um único item da lei cobre o NCM e é o item da regra",
        DIVERGENTE: "algum campo diverge, NCM excluído pela lei no item da regra, item diferente, ou NCM presente só numa das fontes",
        VEDADO: "o SVRS lista o NCM como VEDADO para o código",
        NAO_LOCALIZADA: "NCM ausente do SVRS para o código e sem item da lei que o cubra",
        NAO_DETERMINADA: "regraId repetido, NCM coberto por mais de um item, ou PERMITIDO e VEDADO ao mesmo tempo",
      },
      escopoVinculacoesEtapa5: Object.keys(ESCOPO),
      codigo,
      regras,
      resumo: {
        regras: regras.length, porStatusOficial: conta(regras, "statusOficial"),
        comItemOficial: regras.filter((x) => x.itemOficial != null).length,
        vinculosDeCodigo: codigo.length, codigosComVinculoNestaEtapa: [...new Set(codigo.map((x) => x.cClassTrib))].sort(),
      },
    },
  };
}

/** Etapa 5.3: itemOficial nas regras (no fim) e evidenciasOficiais na raiz (no fim). */
export function etapa53(base) {
  if (!base.vinculacoes) throw new Error("etapa 5.3 exige o bloco vinculacoes (etapa 5)");
  const auditoria = JSON.parse(fs.readFileSync(AUDITORIA, "utf8"));
  const { itemOficialPorIndice, bloco } = montarEvidencias(base, auditoria, sha(fs.readFileSync(BASE_ATUAL)));
  const regras = base.regras.map((r, i) => (itemOficialPorIndice.has(i) ? { ...r, itemOficial: itemOficialPorIndice.get(i) } : r));
  const r = bloco.resumo;
  console.log(`etapa 5.3: ${r.regras} evidências de regra ${JSON.stringify(r.porStatusOficial)}; ${r.comItemOficial} com itemOficial; ${r.vinculosDeCodigo} vínculos de código (${r.codigosComVinculoNestaEtapa.join(", ")})`);
  return { ...base, regras, evidenciasOficiais: bloco };
}
