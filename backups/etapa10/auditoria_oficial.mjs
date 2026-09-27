// Auditoria oficial das regras da base (Etapa 5.1), gravada como evidência para exibição.
//
// Lê os snapshots já registrados (F1 = LC 214/2025, F2 = SVRS), a base e a v2, e grava
// data/auditoria-oficial.json. Nada da base, da v2 ou das vinculações é alterado: o arquivo é
// só evidência, lido pelo explicador depois do motor, para a tela.
//
// Status da REGRA frente às fontes (nunca do produto):
//   CONFIRMADA      código (CST, anexo, redução) concorda com F1 e F2; NCM PERMITIDO no F2 (sem VEDADO);
//                   um único item do anexo no F1 cobre o NCM e é o item da regra; nenhuma exceção do item o alcança
//   DIVERGENTE      algum campo diverge, NCM VEDADO no F2, NCM excluído pelo item da regra, item diferente,
//                   ou NCM presente só numa das fontes
//   NAO_LOCALIZADA  NCM ausente do F2 para o código e sem item do F1 que o cubra
//   NAO_DETERMINADA regraId repetido (D7), NCM coberto por mais de um item, ou PERMITIDO e VEDADO ao mesmo tempo
// Exceções e códigos citados no texto da lei são leitura do sistema (registrada em cada fato).
//
// Uso: node scripts/auditoria_oficial.mjs              grava data/auditoria-oficial.json
//      node scripts/auditoria_oficial.mjs --verificar  confere o arquivo gravado (sai com erro se desatualizado)
import fs from "node:fs";
import crypto from "node:crypto";
import { pathToFileURL } from "node:url";
import { lerF1, textoHtml } from "./base_v2_vinculos.mjs";
import { dadosOriginais } from "./snapshot_svrs.mjs";

export const SAIDA = "data/auditoria-oficial.json";
const ARQ = { base: "data/base-normativa.json", v2: "data/base-normativa.v2.json" };
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const ARABICO = { I: 1, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12, XIII: 13, XV: 15 };
const dig = (s) => s.replace(/\D/g, "");
const norm = (s) => String(s ?? "").normalize("NFC").replace(/\s+/g, " ").replace(/[.;]\s*$/, "").trim().toLowerCase();

/** Códigos NCM citados num texto: 8 dígitos, subposição, posição, capítulo. NBS (1.xxxx) fica de fora. */
function codigosNoTexto(t) {
  const out = [];
  for (const m of t.matchAll(/Cap[ií]tulos?\s+(\d{1,2})(?:\s*(?:,|e)\s*(\d{1,2}))*/gi)) for (const n of m[0].match(/\d{1,2}/g)) out.push({ prefixo: n.padStart(2, "0") });
  for (const m of t.matchAll(/(?<![\d.])(\d{2}\.\d{2}(?:\.\d{2}){0,2}|\d{4}(?:\.\d{1,2}){0,2})(?![\d])/g)) out.push({ prefixo: dig(m[1]), pos: m.index });
  return out;
}
/** Exceção ("exceto"/"ressalvad") vale até o fim do parêntese em que está, ou até o próximo ";" / alínea. */
function incluidosExcluidos(desc) {
  const todos = codigosNoTexto(desc);
  const trechos = [];
  for (const m of desc.matchAll(/\bexceto\b|\bressalvad/gi)) {
    const i = m.index, antes = desc.slice(0, i);
    const aberto = (antes.match(/\(/g) ?? []).length > (antes.match(/\)/g) ?? []).length;
    let fim = aberto ? desc.indexOf(")", i) : desc.slice(i).search(/;|\s[a-z]\)\s/);
    if (fim < 0) fim = desc.length; else if (!aberto) fim += i;
    trechos.push([i, fim]);
  }
  const dentro = (c) => c.pos !== undefined && trechos.some(([a, b]) => c.pos >= a && c.pos < b);
  return { incluidos: todos.filter((c) => !dentro(c)), excluidos: todos.filter(dentro) };
}

export function montarAuditoria(buf) {
  const base = JSON.parse(buf.base.toString("utf8"));
  const v2 = JSON.parse(buf.v2.toString("utf8"));
  const html = new TextDecoder("windows-1252").decode(buf.F1);
  const f1 = lerF1(buf.F1);
  const svrs = dadosOriginais(buf.F2.toString("utf8"));
  const reg = v2.fontes.registros;
  const arquivoFonte = (id) => Object.values(reg).flatMap((r) => r.arquivos).find((a) => a.id === id);

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
  const artigosQueCitam = (romano) => {
    const out = [];
    for (let a = 120; a <= 149; a++) {
      let ps; try { ps = f1.artigo(`art${a}`); } catch { continue; }
      if (ps.some((p) => new RegExp(`Anexo ${romano}(?![IVX])`).test(p))) out.push(a);
    }
    return out;
  };

  const porCod = new Map();
  for (const x of svrs) for (const c of x.ClassificacoesTributarias) if (!porCod.has(c.CodClassTrib)) porCod.set(c.CodClassTrib, { ...c, CstDaLista: x.Cst });
  const idNcm = new Map(); base.regras.forEach((r) => idNcm.set(`${r.id}|${r.ncm}`, (idNcm.get(`${r.id}|${r.ncm}`) ?? 0) + 1));
  const fatoF2 = (a) => ({ CodIntProdServ: a.CodIntProdServ, TipoPermissao: a.TipoPermissao, DescItemAnexo: a.DescItemAnexo, DescExcecao: a.DescExcecao ?? null });

  const codigos = {}, regras = [], lacunas = [];
  for (const [cod, cat] of Object.entries(base.catalogoCodigos)) {
    const alvo = base.regras.map((r, i) => [r, i]).filter(([r]) => r.cClassTrib === cod);
    const valores = (k) => [...new Set(alvo.map(([r]) => r[k]))];
    const cls = porCod.get(cod);
    const anexoNum = ARABICO[cat.anexo];
    const linhasAnexo = lerAnexo(anexoNum);
    const artRef = +(cls?.TexUrlLegislacao?.match(/#art(\d+)/)?.[1] ?? 0) || artigosQueCitam(cat.anexo)[0];
    const citam = artigosQueCitam(cat.anexo);
    const caput = artRef ? f1.artigo(`art${artRef}`)[0] : null;
    const reducaoF1 = !caput ? null : /Ficam reduzidas a zero as alíquotas do IBS e da CBS/.test(caput) ? 1 : /Ficam reduzidas em 60% \(sessenta por cento\) as alíquotas do IBS e da CBS/.test(caput) ? 0.6 : null;
    const [red, cst, anx, fund] = [valores("reducaoAliquota"), valores("cst"), valores("anexo"), valores("fundamentoLegal")];
    const cmp = {
      cst: !cls ? "nao_localizado" : cst.length === 1 && cst[0] === cls.CstDaLista ? "concorda" : "diverge",
      anexo: !cls ? "nao_localizado" : anx.length === 1 && anx[0] === cat.anexo && cls.NroAnexo === anexoNum && linhasAnexo.length > 0 ? "concorda" : "diverge",
      reducao: !cls ? "nao_localizado" : red.length === 1 && red[0] === cat.reducao && reducaoF1 === cat.reducao && cls.PercRedIbs === cat.reducao * 100 && cls.PercRedCbs === cat.reducao * 100 ? "concorda" : "diverge",
      fundamento: !cls ? "nao_localizado" : fund.every((f) => new RegExp(`\\b${artRef}\\b`).test(f)) && citam.includes(artRef)
        ? (fund.every((f) => (f.match(/\d+/g) ?? []).every((n) => +n === artRef)) ? "concorda" : "parcial") : "diverge",
    };
    const codigoOk = cmp.cst === "concorda" && cmp.anexo === "concorda" && cmp.reducao === "concorda";
    codigos[cod] = {
      anexo: cat.anexo,
      F1: { artigo: artRef ?? null, dispositivo: artRef ? `LC 214/2025, art. ${artRef}, caput` : null, ancora: artRef ? `art${artRef}` : null, caput, reducaoLida: reducaoF1, artigosQueCitamOAnexo: citam },
      F2: cls ? { cst: cls.CstDaLista, nroAnexo: cls.NroAnexo, percRedIbs: cls.PercRedIbs, percRedCbs: cls.PercRedCbs, texUrlLegislacao: cls.TexUrlLegislacao, dthIniVig: cls.DthIniVig } : null,
      comparacao: cmp,
    };

    for (const [r, i] of alvo) {
      const entradas = (cls?.Anexos ?? []).filter((a) => a.CodNcmNbs === r.ncm);
      const perm = entradas.filter((a) => a.TipoPermissao === "PERMITIDO"), ved = entradas.filter((a) => a.TipoPermissao === "VEDADO");
      const situacao = perm.length ? (ved.length ? "PERMITIDO_E_VEDADO" : "PERMITIDO") : ved.length ? "VEDADO" : "AUSENTE";
      const excluiF1 = linhasAnexo.filter((l) => l.excluidos.some((c) => c.prefixo && r.ncm.startsWith(c.prefixo)));
      const itensF1 = linhasAnexo.filter((l) => l.incluidos.some((c) => c.prefixo && r.ncm.startsWith(c.prefixo)) && !excluiF1.includes(l));
      const excluidoDoItemDaRegra = excluiF1.some((l) => l.item === r.item);
      const ncmNaListaDoAnexoI = ved.some((a) => /Anexo\s+I(?![IVX])/.test(a.DescExcecao ?? ""))
        ? (porCod.get("200003")?.Anexos ?? []).some((a) => a.CodNcmNbs === r.ncm && a.TipoPermissao === "PERMITIDO") : null;
      const itens = [...new Set(itensF1.map((l) => l.item))];
      const itemOk = itens.includes(r.item);
      const descBase = norm(r.descricaoLegal);
      const descF2 = [...new Set(perm.map((a) => a.DescItemAnexo))];
      const descricaoLegal = descF2.some((d) => norm(d) === descBase) || itensF1.some((l) => norm(l.descricao) === descBase) ? "igual"
        : descF2.some((d) => norm(d).includes(descBase) || descBase.includes(norm(d))) || itensF1.some((l) => norm(l.descricao).includes(descBase) || descBase.includes(norm(l.descricao))) ? "contida"
          : (descF2.length || itensF1.length) ? "diferente" : "sem_texto_oficial";
      const motivos = [];
      let status;
      if ((idNcm.get(`${r.id}|${r.ncm}`) ?? 0) > 1) { status = "NAO_DETERMINADA"; motivos.push("regraId repetido na base (D7): a regra não pode ser identificada com segurança"); }
      else if (situacao === "AUSENTE" && !itensF1.length) { status = "NAO_LOCALIZADA"; motivos.push("NCM ausente do SVRS para o código e não coberto por item do anexo na lei"); }
      else {
        if (!codigoOk) motivos.push(`código diverge das fontes (${Object.entries(cmp).filter(([k, v]) => k !== "fundamento" && v !== "concorda").map(([k, v]) => `${k}: ${v}`).join(", ")})`);
        if (situacao === "VEDADO") motivos.push(`o SVRS lista o NCM como VEDADO para ${cod}`);
        if (excluidoDoItemDaRegra) motivos.push(`a lei exclui expressamente este NCM no item ${r.item} da regra`);
        if (situacao === "AUSENTE") motivos.push("NCM só na lei (ausente do SVRS para o código)");
        if (!itensF1.length && !excluidoDoItemDaRegra) motivos.push("NCM só no SVRS (nenhum item do anexo na lei cobre o NCM)");
        else if (itensF1.length && !itemOk) motivos.push(`item da regra (${r.item}) diferente dos itens da lei que cobrem o NCM (${itens.join(", ")})`);
        if (motivos.length) status = "DIVERGENTE";
        else if (itens.length > 1) { status = "NAO_DETERMINADA"; motivos.push(`NCM coberto por ${itens.length} itens do anexo (${itens.join(", ")}); o item da regra está entre eles; a escolha depende do produto`); }
        else if (situacao === "PERMITIDO_E_VEDADO") { status = "NAO_DETERMINADA"; motivos.push("o SVRS lista o NCM como PERMITIDO e também como VEDADO para o código"); }
        else status = "CONFIRMADA";
      }
      regras.push({
        indice: i, regraId: r.id, ncm: r.ncm, cClassTrib: cod, item: r.item, status, motivos,
        situacaoNcmSvrs: situacao, itensOficiais: itens, itemDaRegraEntreOsOficiais: itemOk, itemOficial: itens.length === 1 ? itens[0] : null,
        excecaoNaLeiEmItens: [...new Set(excluiF1.map((l) => l.item))], excluidoDoItemDaRegra, ncmNaListaDoAnexoI, descricaoLegal,
        fatosF1: itensF1.concat(excluiF1).map((l) => ({ dispositivo: `LC 214/2025, Anexo ${cat.anexo}, item ${l.item}`, ancora: `anexo${anexoNum}`, linhaTabela: l.linhaTabela,
          trecho: `${l.item} | ${l.descricao}${l.colunaNcm ? " | " + l.colunaNcm : ""}`, papel: excluiF1.includes(l) ? "exclui o NCM" : "cobre o NCM" })),
        fatosF2: entradas.map(fatoF2),
      });
    }
    const ncmsRegras = new Set(alvo.map(([r]) => r.ncm));
    const permitidos = new Map();
    for (const a of cls?.Anexos ?? []) if (a.TipoPermissao === "PERMITIDO" && !ncmsRegras.has(a.CodNcmNbs)) (permitidos.get(a.CodNcmNbs) ?? permitidos.set(a.CodNcmNbs, []).get(a.CodNcmNbs)).push(fatoF2(a));
    for (const [ncm, fatos] of [...permitidos].sort(([a], [b]) => a.localeCompare(b))) lacunas.push({ cClassTrib: cod, ncm, fatosF2: fatos });
  }
  const conta = (xs) => xs.reduce((o, x) => ((o[x.status] = (o[x.status] ?? 0) + 1), o), {});
  const f1Reg = arquivoFonte("F1.html"), f2Reg = arquivoFonte("F2.html");
  return {
    descricao: "Auditoria oficial das regras da base (Etapa 5.1). Somente evidência para exibição: não altera regras, vinculações nem vereditos. Status da regra frente às fontes, nunca do produto.",
    geradoPor: "scripts/auditoria_oficial.mjs",
    entradas: {
      base: { arquivo: ARQ.base, sha256: sha(buf.base) },
      v2: { arquivo: ARQ.v2, sha256: sha(buf.v2) },
      F1: { arquivo: f1Reg.caminho, sha256: sha(buf.F1), url: reg.F1.url, versao: reg.F1.versao, dataConsulta: reg.F1.dataConsulta, natureza: "texto legal" },
      F2: { arquivo: f2Reg.caminho, sha256: sha(buf.F2), url: reg.F2.url, versao: reg.F2.versao, dataConsulta: reg.F2.dataConsulta, natureza: "tabela de apoio do SVRS; não é texto legal" },
    },
    precedencia: "A lei (F1) é a fonte jurídica primária; o SVRS (F2) é fonte oficial operacional/complementar. Divergências são apresentadas, nunca resolvidas em silêncio.",
    resumo: { regras: regras.length, porStatus: conta(regras), lacunas: lacunas.length },
    codigos, regras, lacunas,
  };
}

export function lerEntradas() {
  const v2 = JSON.parse(fs.readFileSync(ARQ.v2, "utf8"));
  const caminho = (id) => Object.values(v2.fontes.registros).flatMap((r) => r.arquivos).find((a) => a.id === id).caminho;
  return { base: fs.readFileSync(ARQ.base), v2: fs.readFileSync(ARQ.v2), F1: fs.readFileSync(caminho("F1.html")), F2: fs.readFileSync(caminho("F2.html")) };
}

function main() {
  const entradas = lerEntradas();
  // Os snapshots precisam ser os registrados na v2 (Etapa 4)
  const v2 = JSON.parse(entradas.v2.toString("utf8"));
  for (const id of ["F1.html", "F2.html"]) {
    const a = Object.values(v2.fontes.registros).flatMap((r) => r.arquivos).find((x) => x.id === id);
    if (sha(entradas[id.slice(0, 2)]) !== a.sha256) throw new Error(`${id}: SHA-256 diferente do registrado na v2`);
  }
  const texto = JSON.stringify(montarAuditoria(entradas)) + "\n";
  if (process.argv.includes("--verificar")) {
    const gravado = fs.existsSync(SAIDA) ? fs.readFileSync(SAIDA, "utf8") : null;
    if (gravado !== texto) { console.error(`${SAIDA} desatualizado: rode node scripts/auditoria_oficial.mjs`); process.exit(1); }
    console.log(`${SAIDA} confere com a base, a v2 e os snapshots.`);
    return;
  }
  fs.writeFileSync(SAIDA, texto);
  const r = JSON.parse(texto).resumo;
  console.log(`${SAIDA}: ${r.regras} regras ${JSON.stringify(r.porStatus)}; ${r.lacunas} lacunas`);
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
