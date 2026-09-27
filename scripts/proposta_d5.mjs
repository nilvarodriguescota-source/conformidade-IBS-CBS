// Proposta para a decisão D5 ("incluir ou não as NCMs oficiais sem regra como regras de origem oficial").
//
// Não altera a base nem a v2: grava só docs/etapa10/proposta-d5.json, com as regras que seriam
// incluídas se a D5 for decidida como "incluir". Nada é presumido:
//   - só códigos do catálogo atual (os 12 da planilha), com CST, redução e anexo do catálogo e o
//     fundamento que a base já usa para o código;
//   - só NCMs PERMITIDOS no SVRS (F2) para o código e não VEDADOS para ele;
//   - só quando a LC 214/2025 (F1) cobre o NCM num item do anexo sem excluí-lo (a lei prevalece):
//     uma regra por item que cobre o NCM; NCM sem item na lei fica fora e é listado;
//   - descrição legal = texto do item na lei; condição e exceção do SVRS vão para a observação;
//   - vigência = início de vigência do item no SVRS.
//
// Uso: node scripts/proposta_d5.mjs
import fs from "node:fs";
import crypto from "node:crypto";
import { lerEntradas, ARABICO, codigosNoTexto, incluidosExcluidos } from "./auditoria_oficial.mjs";
import { textoHtml } from "./base_v2_vinculos.mjs";
import { dadosOriginais } from "./snapshot_svrs.mjs";

const SAIDA = "docs/etapa10/proposta-d5.json";
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");

export function montarProposta(buf) {
  const base = JSON.parse(buf.base.toString("utf8"));
  const html = new TextDecoder("windows-1252").decode(buf.F1);
  const svrs = dadosOriginais(buf.F2.toString("utf8"));
  const porCod = new Map();
  for (const x of svrs) for (const c of x.ClassificacoesTributarias) if (!porCod.has(c.CodClassTrib)) porCod.set(c.CodClassTrib, c);

  // Mesma leitura da tabela do anexo usada em scripts/auditoria_oficial.mjs
  const lerAnexo = (n) => {
    const t = html.slice(html.indexOf(`name="anexo${n}"`), html.indexOf(`name="anexo${n + 1}"`));
    const linhas = []; let k = 0;
    for (const tr of t.matchAll(/<tr[\s\S]*?<\/tr>/gi)) {
      k++;
      if (/line-through/i.test(tr[0])) continue;
      const c = [...tr[0].matchAll(/<td[\s\S]*?<\/td>/gi)].map((m) => textoHtml(m[0]));
      if (c.length < 2 || /^ITEM$/i.test(c[0])) continue;
      const [item, descricao, colunaNcm] = c;
      const doTexto = incluidosExcluidos(descricao);
      linhas.push({ linhaTabela: k, item, descricao, colunaNcm: colunaNcm ?? null, incluidos: c.length >= 3 && colunaNcm ? codigosNoTexto(colunaNcm) : doTexto.incluidos, excluidos: doTexto.excluidos });
    }
    return linhas;
  };

  const regras = [], foraDaProposta = [];
  for (const [cod, cat] of Object.entries(base.catalogoCodigos)) {
    const cls = porCod.get(cod);
    if (!cls) continue;
    const anexoNum = ARABICO[cat.anexo];
    const linhas = lerAnexo(anexoNum);
    const doCodigo = base.regras.filter((r) => r.cClassTrib === cod);
    const ncmsDaBase = new Set(doCodigo.map((r) => r.ncm));
    // O código tem um único fundamento na base (a v2 exige); a divergência do código com a lei, se houver,
    // continua registrada na auditoria e exibida como FUNDAMENTO_DIVERGENTE
    const fundamentos = [...new Set(doCodigo.map((r) => r.fundamentoLegal))];
    const fundamento = fundamentos.length === 1 ? fundamentos[0] : cat.artigo;
    const porNcm = new Map();
    for (const a of cls.Anexos ?? []) {
      if (a.TipoCodigo !== "NCM" || ncmsDaBase.has(a.CodNcmNbs)) continue;
      (porNcm.get(a.CodNcmNbs) ?? porNcm.set(a.CodNcmNbs, []).get(a.CodNcmNbs)).push(a);
    }
    for (const [ncm, entradas] of [...porNcm].sort(([a], [b]) => a.localeCompare(b))) {
      const perm = entradas.filter((a) => a.TipoPermissao === "PERMITIDO");
      if (!perm.length) continue;
      const fatosF2 = entradas.map((a) => ({ CodIntProdServ: a.CodIntProdServ, TipoPermissao: a.TipoPermissao, DescItemAnexo: a.DescItemAnexo, DescCondicao: a.DescCondicao ?? null, DescExcecao: a.DescExcecao ?? null, DthIniVig: a.DthIniVig }));
      if (entradas.some((a) => a.TipoPermissao === "VEDADO")) { foraDaProposta.push({ cClassTrib: cod, ncm, motivo: "o SVRS lista o NCM como PERMITIDO e também como VEDADO para o código", fatosF2 }); continue; }
      const exclui = linhas.filter((l) => l.excluidos.some((c) => c.prefixo && ncm.startsWith(c.prefixo)));
      const cobrem = linhas.filter((l) => l.incluidos.some((c) => c.prefixo && ncm.startsWith(c.prefixo)) && !exclui.includes(l));
      if (!cobrem.length) {
        foraDaProposta.push({ cClassTrib: cod, ncm, motivo: exclui.length ? `a LC 214/2025 exclui o NCM no Anexo ${cat.anexo}, item ${exclui.map((l) => l.item).join(", ")}` : `nenhum item do Anexo ${cat.anexo} da LC 214/2025 cobre o NCM (só no SVRS)`, fatosF2 });
        continue;
      }
      const condicoes = [...new Set(perm.map((a) => a.DescCondicao).filter(Boolean))];
      const excecoes = [...new Set(perm.map((a) => a.DescExcecao).filter(Boolean))];
      const inicio = perm.map((a) => (a.DthIniVig ?? "").slice(0, 10)).filter(Boolean).sort()[0] ?? null;
      for (const l of cobrem) {
        regras.push({
          id: `${ncm}-${cod}-${cat.anexo}-${l.item}`,
          ncm,
          cst: cls.Cst,
          cClassTrib: cod,
          tratamento: cat.reducao === 1 ? "aliquota_zero" : "reducao_60",
          reducaoAliquota: cat.reducao,
          anexo: cat.anexo,
          item: l.item,
          fundamentoLegal: fundamento,
          rotulo: cat.rotulo,
          descricaoLegal: l.descricao,
          descricaoNcmTipi: "",
          ncmCitadoNaLei: l.colunaNcm ?? "",
          origemRegistro: "Fonte oficial (proposta D5): NCM PERMITIDO no SVRS e coberto pelo item da LC 214/2025",
          observacao: ["Validar a descrição legal, o enquadramento do produto e eventuais condicionantes.",
            ...condicoes.map((c) => `Condição (SVRS): ${c}.`), ...excecoes.map((e) => `Exceção (SVRS): ${e}.`)].join(" "),
          vigenciaInicio: inicio,
          vigenciaFim: null,
          fonte: `LC 214/2025, Anexo ${cat.anexo}, item ${l.item}; SVRS Classificação Tributária ${cod}`,
          evidencia: {
            F1: { dispositivo: `LC 214/2025, Anexo ${cat.anexo}, item ${l.item}`, ancora: `anexo${anexoNum}`, linhaTabela: l.linhaTabela, itensQueCobremONcm: cobrem.map((x) => x.item) },
            F2: fatosF2,
          },
        });
      }
    }
  }
  const conta = (xs, f) => xs.reduce((o, x) => ((o[f(x)] = (o[f(x)] ?? 0) + 1), o), {});
  return {
    descricao: "Proposta para a decisão D5. NÃO está em uso: a base normativa não foi alterada. Cada regra traz a evidência da lei (F1) e do SVRS (F2).",
    geradoPor: "scripts/proposta_d5.mjs",
    entradas: { base: sha(buf.base), F1: sha(buf.F1), F2: sha(buf.F2) },
    precedencia: "A lei (F1) prevalece: NCM que só o SVRS lista, ou que a lei exclui, fica fora da proposta.",
    resumo: {
      regrasPropostas: regras.length,
      ncmsDistintos: new Set(regras.map((r) => r.ncm)).size,
      porCodigo: conta(regras, (r) => r.cClassTrib),
      ncmsComMaisDeUmItem: new Set(regras.filter((r) => r.evidencia.F1.itensQueCobremONcm.length > 1).map((r) => `${r.ncm}|${r.cClassTrib}`)).size,
      foraDaProposta: foraDaProposta.length,
      foraPorMotivo: conta(foraDaProposta, (f) => f.motivo.replace(/item [\d., ]+|Anexo [IVX]+/g, "…")),
    },
    regras,
    foraDaProposta,
  };
}

const proposta = montarProposta(lerEntradas());
fs.mkdirSync("docs/etapa10", { recursive: true });
fs.writeFileSync(SAIDA, JSON.stringify(proposta, null, 1) + "\n");
console.log(`${SAIDA}:`, JSON.stringify(proposta.resumo, null, 1));
