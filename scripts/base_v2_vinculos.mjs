// Etapa 5 da base v2: vinculação das regras às fontes oficiais, em modo de auditoria.
//
// Acrescenta na raiz da v2 o bloco `vinculacoes`. Nenhuma regra é alterada ou criada
// e nenhum valor oficial é aplicado: cada registro só documenta o que as fontes dizem
// e como isso se compara com a regra.
//
// Cada registro separa:
//   fatos          - trecho literal (F1) ou valor literal (F2), com arquivo, hash,
//                    versão, data de consulta e localização precisa
//   dadoExtraido   - o dado lido do fato
//   interpretacao  - o que depende de leitura (null quando não há)
//   propostaFutura - campo que poderia ser afetado numa etapa futura (nada é aplicado)
//   status         - inequivoco | ambiguo | conflito | informativo
//
// Escopo: cClassTrib 200033 e 200043, os únicos com extração auditada do SVRS.
import fs from "node:fs";
import { dadosOriginais } from "./snapshot_svrs.mjs";

export const ESCOPO = {
  "200033": { anexoRomano: "VI", anexoNum: 6, ancoraAnexo: "anexo6", fimAnexo: "anexo7", artigo: "art133" },
  "200043": { anexoRomano: "XI", anexoNum: 11, ancoraAnexo: "anexo11", fimAnexo: "anexo12", artigo: "art142" },
};
const NATUREZA = {
  F1: "texto legal: Lei Complementar nº 214/2025 publicada no Planalto",
  F2: "tabela de apoio do portal da Conformidade Fácil (SVRS); não é texto legal",
};

// ---------- F1: LC 214 (HTML windows-1252) ----------

/** Texto de um trecho de HTML, como aparece na página (sem tags, espaços colapsados). */
export function textoHtml(s) {
  return s.replace(/<[^>]+>/g, " ").replace(/&nbsp;|&#8239;/g, " ").replace(/&quot;/g, '"').replace(/\s+/g, " ").trim();
}
const riscado = (s) => /line-through/i.test(s);

export function lerF1(buf) {
  const html = new TextDecoder("windows-1252").decode(buf);
  /** Parágrafos vigentes (sem line-through) do artigo, na ordem. */
  const artigo = (ancora) => {
    const i = html.indexOf(`name="${ancora}"`);
    if (i < 0) throw new Error(`F1: âncora ${ancora} ausente`);
    const ini = html.lastIndexOf("<p", i);
    const numero = ancora.match(/\d+/)[0];
    const ps = [];
    for (const m of html.slice(ini).matchAll(/<p[\s\S]*?<\/p>/gi)) {
      // Incisos e parágrafos têm âncoras próprias (art544-6, art142-2); só outro número encerra o artigo.
      const outro = [...m[0].matchAll(/name="art(\d+)/g)].some((a) => a[1] !== numero);
      if (ps.length && outro) break;
      if (!riscado(m[0])) ps.push(textoHtml(m[0]));
      if (ps.length > 40) break;
    }
    return ps;
  };
  /** Linhas vigentes da tabela do anexo: item, descrição, códigos. */
  const anexo = (ini, fim) => {
    const t = html.slice(html.indexOf(`name="${ini}"`), html.indexOf(`name="${fim}"`));
    const linhas = [];
    let n = 0;
    for (const tr of t.matchAll(/<tr[\s\S]*?<\/tr>/gi)) {
      n++;
      if (riscado(tr[0])) continue;
      const c = [...tr[0].matchAll(/<td[\s\S]*?<\/td>/gi)].map((m) => textoHtml(m[0]));
      if (c.length !== 3 || c[0] === "ITEM") continue;
      const ncm = c[2].split(" ").filter((x) => /^\d{4}(\.\d{1,2}){0,2}$/.test(x));
      linhas.push({ linhaTabela: n, item: c[0], descricao: c[1], codigos: c[2], ncm });
    }
    return linhas;
  };
  const vigentes = [...html.matchAll(/<p[\s\S]*?<\/p>/gi)].filter((m) => !riscado(m[0])).map((m) => textoHtml(m[0]));
  return { artigo, anexo, textoVigente: vigentes.join("\n") };
}

// ---------- F2: SVRS ----------

export function lerF2(bufHtml, bufExtracao) {
  const cst = dadosOriginais(bufHtml.toString("utf8")).find((x) => x.Cst === "200");
  const ext = JSON.parse(bufExtracao.toString("utf8")).cst200;
  const cls = (fonte, cod) => fonte.ClassificacoesTributarias.find((c) => c.CodClassTrib === cod);
  return {
    classificacao: (cod) => cls(cst, cod),
    /** Resolve uma localização em F2.html e em F2.extracao; devolve os dois valores. */
    resolver(loc) {
      const pega = (fonte) => {
        const c = cls(fonte, loc.cClassTrib);
        if (!c) return undefined;
        if (loc.anexo) {
          const a = c.Anexos.find((x) => x.CodIntProdServ === loc.anexo.CodIntProdServ);
          return a && Object.fromEntries(CAMPOS_ANEXO.map((k) => [k, a[k]]));
        }
        return c[loc.campo];
      };
      return { html: pega(cst), extracao: pega(ext) };
    },
  };
}
export const CAMPOS_ANEXO = ["CodNcmNbs", "TipoCodigo", "TipoPermissao", "DescItemAnexo", "NroItemAnexoLei", "DthIniVig", "DthFimVig"];

// ---------- montagem ----------

const dig = (s) => s.replace(/\D/g, "");

export function montarVinculacoes(base, arquivos) {
  const reg = base.fontes.registros;
  const meta = (fonte, arquivo) => {
    const a = reg[fonte].arquivos.find((x) => x.id === arquivo);
    return { fonte, arquivo, sha256: a.sha256, natureza: NATUREZA[fonte], versao: reg[fonte].versao, dataConsulta: reg[fonte].dataConsulta };
  };
  const extF2 = { arquivo: "F2.extracao", sha256: reg.F2.arquivos.find((x) => x.id === "F2.extracao").sha256 };
  const f1 = lerF1(arquivos.F1);
  const f2 = lerF2(arquivos.F2html, arquivos.F2extracao);

  const fatoF1 = (dispositivo, ancora, trecho) => ({ ...meta("F1", "F1.html"), localizacao: { dispositivo, ancora }, trecho });
  const fatoF2 = (localizacao) => {
    const { html, extracao } = f2.resolver(localizacao);
    if (JSON.stringify(html) !== JSON.stringify(extracao)) throw new Error(`F2: html e extração divergem em ${JSON.stringify(localizacao)}`);
    return { ...meta("F2", "F2.html"), localizacao, valor: html, extracao: extF2 };
  };
  /** Parágrafo vigente do artigo que começa com o prefixo dado. */
  const paragrafo = (ancora, prefixo) => {
    const p = f1.artigo(ancora).find((x) => x.startsWith(prefixo));
    if (!p) throw new Error(`F1: ${ancora} sem parágrafo "${prefixo}"`);
    return p;
  };
  const ref = (r, i) => ({ indice: i, linha: r.original.linha, regraId: r.id, ncm: r.ncm });

  // Art. 544: os arts. 133 e 142 não aparecem nos incisos I a V (conferido no texto vigente).
  const incisos544 = f1.artigo("art544").filter((p) => /^(I|II|III|IV|V) - /.test(p));
  const citados = new Set();
  for (const p of incisos544) {
    for (const m of p.matchAll(/(\d+)\s*a\s*(\d+)/g)) for (let n = +m[1]; n <= +m[2]; n++) citados.add(n);
    for (const m of p.matchAll(/\d+/g)) citados.add(+m[0]);
  }

  const codigo = [], regras = [], semRegra = [], outrosCodigos = [];
  for (const [cod, e] of Object.entries(ESCOPO)) {
    const cls = f2.classificacao(cod);
    const alvo = base.regras.map((r, i) => [r, i]).filter(([r]) => r.cClassTrib === cod);
    const alcance = alvo.map(([r, i]) => ref(r, i));
    const unico = (k) => { const v = [...new Set(alvo.map(([r]) => r[k]))]; if (v.length !== 1) throw new Error(`${cod}: ${k} não é único`); return v[0]; };
    const art = e.artigo === "art133"
      ? { caput: paragrafo("art133", "Art. 133."), inciso: paragrafo("art133", "§ 1º"), disp: "art. 133, § 1º" }
      : { caput: paragrafo("art142", "Art. 142."), inciso: paragrafo("art142", "I - "), disp: "art. 142, I" };
    const nomeArt = e.artigo === "art133" ? "art. 133" : "art. 142";
    const fatoCaput = fatoF1(`${nomeArt}, caput`, e.artigo, art.caput);
    const fatoInciso = fatoF1(art.disp, e.artigo, art.inciso);
    const L = (campo) => ({ cst: "200", cClassTrib: cod, campo });
    const rec = (campo, fatos, dadoExtraido, comparacao, interpretacao, propostaFutura, status) =>
      codigo.push({ id: `C-${cod}-${campo}`, cClassTrib: cod, alcance, campoRegra: campo, valorRegra: unico(campo), fatos, dadoExtraido, comparacao, interpretacao, propostaFutura, status });

    rec("cst", [fatoF2(L("Cst"))], { F2: cls.Cst }, { resultado: unico("cst") === cls.Cst ? "concorda" : "diverge" },
      null, "Nenhuma: valor já coincide.", unico("cst") === cls.Cst ? "inequivoco" : "conflito");

    rec("anexo", [fatoInciso, fatoF2(L("NroAnexo"))], { F1: `Anexo ${e.anexoRomano}`, F2: cls.NroAnexo },
      { resultado: unico("anexo") === e.anexoRomano && cls.NroAnexo === e.anexoNum ? "concorda" : "diverge" },
      `O F2 numera o anexo em algarismo arábico (${cls.NroAnexo}); a lei e a regra usam romano (${e.anexoRomano}).`,
      "Nenhuma: valor já coincide.", unico("anexo") === e.anexoRomano && cls.NroAnexo === e.anexoNum ? "inequivoco" : "conflito");

    const red60 = art.caput.includes("Ficam reduzidas em 60% (sessenta por cento) as alíquotas do IBS e da CBS");
    rec("reducaoAliquota", [fatoCaput, fatoInciso, fatoF2(L("PercRedIbs")), fatoF2(L("PercRedCbs"))],
      { F1: red60 ? "redução de 60% das alíquotas do IBS e da CBS" : null, F2: { PercRedIbs: cls.PercRedIbs, PercRedCbs: cls.PercRedCbs } },
      { resultado: red60 && cls.PercRedIbs === 60 && cls.PercRedCbs === 60 && unico("reducaoAliquota") === 0.6 && unico("tratamento") === "reducao_60" ? "concorda" : "diverge",
        tratamentoRegra: unico("tratamento") },
      "60% corresponde a reducaoAliquota 0.6 e a tratamento reducao_60. A regra tem um único campo para IBS e CBS; as fontes dão o mesmo percentual para os dois.",
      "Futuro campo oficial com a redução de IBS e de CBS em separado; reducaoAliquota não muda.",
      red60 && cls.PercRedIbs === 60 && cls.PercRedCbs === 60 ? "inequivoco" : "conflito");

    if (cod === "200033") {
      rec("fundamentoLegal", [fatoInciso, fatoF1("art. 134, caput", "art134", paragrafo("art134", "Art. 134.")), fatoF2(L("TexUrlLegislacao"))],
        { F1: "art. 133, § 1º remete ao Anexo VI; art. 134 trata da revisão periódica da lista do Anexo VI", F2: cls.TexUrlLegislacao },
        { resultado: "parcial", detalhe: "A regra cita os arts. 133 e 134; o F2 aponta só o art. 133." },
        "O art. 134 não concede a redução; disciplina a revisão da lista. Se deve ou não constar do fundamento é decisão de redação, não de enquadramento.",
        "Futuro campo fundamentoLegalOficial com 'LC 214/2025, art. 133, § 1º'; fundamentoLegal não muda.", "ambiguo");
    } else {
      rec("fundamentoLegal", [fatoInciso, fatoF1("art. 140, caput", "art140", paragrafo("art140", "Art. 140.")), fatoF2(L("TexUrlLegislacao"))],
        { F1: "art. 142, I remete ao Anexo XI; art. 140 trata de serviços de comunicação institucional", F2: cls.TexUrlLegislacao },
        { resultado: "diverge", detalhe: "A regra cita o art. 140; F1 e F2 apontam o art. 142, I." },
        "O código, o CST, o anexo e a redução coincidem nas fontes; a divergência é só do dispositivo citado.",
        "Futuro campo fundamentoLegalOficial com 'LC 214/2025, art. 142, I'; divergência a registrar na Etapa 7; fundamentoLegal não muda.", "conflito");
    }

    const fora = [133, 142].filter((n) => citados.has(n));
    const datasF2Lista = [...new Set(cls.Anexos.map((a) => a.DthIniVig))];
    rec("vigenciaInicio",
      [fatoF1("art. 544, VI", "art544", paragrafo("art544", "VI - ")), fatoF2(L("DthIniVig"))],
      { F1: "1º de janeiro de 2026 (demais dispositivos)", F2codigo: cls.DthIniVig, F2listaNcm: datasF2Lista },
      { resultado: "parcial", detalhe: `A regra usa 2026-01-01, que coincide com o art. 544, VI e com a data de início das ${cls.Anexos.length} entradas da lista de NCMs do F2; a data de início do código no F2 é ${cls.DthIniVig.slice(0, 10)}.` },
      `Os arts. 133 e 142 não constam dos incisos I a V do art. 544 (conferência automática no texto vigente: ${fora.length ? "CITADOS " + fora.join(", ") : "nenhum dos dois citado"}), logo caem no inciso VI. As três datas medem coisas diferentes (efeitos da lei, vigência do código na tabela, vigência da lista de NCMs); nenhuma foi escolhida.`,
      "Futuro campo oficial de vigência com as três datas separadas, cada uma com sua fonte; vigenciaInicio não muda.", "ambiguo");

    rec("vigenciaFim", [fatoF2(L("DthFimVig"))], { F2: cls.DthFimVig },
      { resultado: unico("vigenciaFim") === null && cls.DthFimVig === null ? "concorda" : "diverge" },
      "Ausência de data final no F2; a lei não fixa término para estes dispositivos.", "Nenhuma.", "informativo");

    // Nível da regra: presença da NCM e item do anexo
    const linhasAnexo = f1.anexo(e.ancoraAnexo, e.fimAnexo);
    for (const [r, i] of alvo) {
      const itensF1 = linhasAnexo.filter((l) => l.ncm.some((c) => r.ncm.startsWith(dig(c))));
      const entradasF2 = cls.Anexos.filter((a) => a.CodNcmNbs === r.ncm);
      const itens = itensF1.map((l) => l.item);
      const itemOk = itens.includes(r.item);
      const descF2 = [...new Set(entradasF2.map((a) => a.DescItemAnexo))];
      const descConferem = descF2.every((d) => itensF1.some((l) => l.descricao === d));
      let status, resultado;
      if (itensF1.length && !entradasF2.length) { status = "conflito"; resultado = "ncm_so_na_F1"; }
      else if (!itensF1.length && entradasF2.length) { status = "conflito"; resultado = "ncm_so_na_F2"; }
      else if (!itensF1.length) { status = "conflito"; resultado = "ncm_ausente_nas_fontes"; }
      else if (!itemOk) { status = "conflito"; resultado = "item_divergente"; }
      else if (itens.length > 1 || !descConferem) { status = "ambiguo"; resultado = "item_entre_varios"; }
      else { status = "inequivoco"; resultado = "concorda"; }
      const itemF1Unico = itens.length === 1 ? itens[0] : null;
      regras.push({
        id: `R-${i}`,
        cClassTrib: cod,
        regra: { ...ref(r, i), item: r.item },
        campoRegra: "item",
        valorRegra: r.item,
        fatos: [
          ...itensF1.map((l) => ({ ...fatoF1(`Anexo ${e.anexoRomano}, item ${l.item}`, e.ancoraAnexo, `${l.item} | ${l.descricao} | ${l.codigos}`), linhaTabela: l.linhaTabela })),
          ...entradasF2.map((a) => fatoF2({ cst: "200", cClassTrib: cod, anexo: { CodIntProdServ: a.CodIntProdServ } })),
        ],
        dadoExtraido: {
          ncmNaListaOficial: { F1: itensF1.length > 0, F2: entradasF2.length > 0 },
          itensF1QueCobremONcm: itens,
          coberturaF1: itensF1.map((l) => ({ item: l.item, codigo: l.ncm.find((c) => r.ncm.startsWith(dig(c))), exata: l.ncm.some((c) => dig(c) === r.ncm) })),
          descricoesF2: descF2,
          descricoesF2ConferemComF1: descConferem,
        },
        comparacao: { resultado, itemRegraEntreItensF1: itemOk },
        interpretacao: resultado === "item_entre_varios"
          ? `A NCM ${r.ncm} aparece em ${itens.length} itens do Anexo ${e.anexoRomano}; o item depende da composição do produto, que a NCM não informa. O item da regra (${r.item}) está entre eles.`
          : resultado === "item_divergente"
            ? `F1 e F2 associam a NCM ${r.ncm} ao item ${itens.join(", ")} (${descF2.join(" / ")}); a regra traz o item ${r.item}.`
            : resultado === "ncm_so_na_F1"
              ? `A NCM consta do Anexo ${e.anexoRomano} da lei (item ${itens.join(", ")}) e não consta da lista do F2 para ${cod}. Nenhuma das fontes prevalece aqui.`
              : null,
        propostaFutura: status === "inequivoco"
          ? `Futuro campo oficial com o item ${itemF1Unico} do Anexo ${e.anexoRomano}; item não muda.`
          : status === "ambiguo"
            ? "Futuro campo oficial com a lista de itens possíveis; escolha depende de validação humana; item não muda."
            : "Registrar como divergência na Etapa 7; item não muda.",
        status,
      });
    }

    // Lacunas: NCMs oficiais sem regra deste código (nenhuma regra é criada)
    const ncmsRegras = new Set(alvo.map(([r]) => r.ncm));
    const porNcm = new Map();
    for (const a of cls.Anexos) if (!ncmsRegras.has(a.CodNcmNbs)) (porNcm.get(a.CodNcmNbs) ?? porNcm.set(a.CodNcmNbs, []).get(a.CodNcmNbs)).push(a);
    for (const [ncm, entradas] of porNcm) {
      const itensF1 = linhasAnexo.filter((l) => l.ncm.some((c) => ncm.startsWith(dig(c))));
      const outras = base.regras.map((r, i) => [r, i]).filter(([r]) => r.ncm === ncm).map(([r, i]) => ({ ...ref(r, i), cClassTrib: r.cClassTrib }));
      semRegra.push({
        id: `S-${cod}-${ncm}`,
        cClassTrib: cod,
        ncm,
        fatos: [
          ...itensF1.map((l) => ({ ...fatoF1(`Anexo ${e.anexoRomano}, item ${l.item}`, e.ancoraAnexo, `${l.item} | ${l.descricao} | ${l.codigos}`), linhaTabela: l.linhaTabela })),
          ...entradas.map((a) => fatoF2({ cst: "200", cClassTrib: cod, anexo: { CodIntProdServ: a.CodIntProdServ } })),
        ],
        dadoExtraido: { ncmNaListaOficial: { F1: itensF1.length > 0, F2: true }, itensF1QueCobremONcm: itensF1.map((l) => l.item) },
        regrasDeOutrosCodigosComEstaNcm: outras,
        interpretacao: null,
        propostaFutura: "Decisão D5 do plano: incluir ou não como regra de origem oficial. Nenhuma regra foi criada.",
        status: "sem_regra",
      });
    }
    // Informativo: regras de outros códigos cuja NCM está na lista oficial deste código
    const ncmsF2 = new Set(cls.Anexos.map((a) => a.CodNcmNbs));
    base.regras.forEach((r, i) => {
      if (r.cClassTrib !== cod && ncmsF2.has(r.ncm)) outrosCodigos.push({ ...ref(r, i), cClassTribRegra: r.cClassTrib, listadaNoF2Para: cod, status: "informativo" });
    });
  }

  const conta = (xs) => xs.reduce((o, x) => ((o[x.status] = (o[x.status] || 0) + 1), o), {});
  return {
    modo: "auditoria: nenhum campo das regras foi alterado e nenhum valor oficial foi aplicado",
    escopo: Object.keys(ESCOPO),
    foraDoEscopo: {
      codigos: Object.keys(base.catalogoCodigos).filter((c) => !(c in ESCOPO)),
      motivo: "A extração auditada do SVRS (F2.extracao) e a investigação cobrem só 200033 e 200043.",
    },
    naturezaDasFontes: NATUREZA,
    codigo,
    regras,
    ncmsOficiaisSemRegra: semRegra,
    regrasDeOutrosCodigosComNcmNaListaOficial: outrosCodigos,
    resumo: {
      registrosDeCodigo: codigo.length,
      registrosDeRegra: regras.length,
      porStatusCodigo: conta(codigo),
      porStatusRegra: conta(regras),
      porResultadoRegra: regras.reduce((o, x) => ((o[x.comparacao.resultado] = (o[x.comparacao.resultado] || 0) + 1), o), {}),
      ncmsOficiaisSemRegra: conta(semRegra).sem_regra ?? 0,
      regrasDeOutrosCodigosComNcmNaListaOficial: outrosCodigos.length,
    },
  };
}

/** Etapa 5: acrescenta `vinculacoes` na raiz; regras e demais blocos ficam como estão. */
export function etapa5(base) {
  if (!base.fontes) throw new Error("etapa 5 exige o bloco fontes (etapa 4)");
  const caminho = (id) => Object.values(base.fontes.registros).flatMap((r) => r.arquivos).find((a) => a.id === id).caminho;
  const vinculacoes = montarVinculacoes(base, {
    F1: fs.readFileSync(caminho("F1.html")),
    F2html: fs.readFileSync(caminho("F2.html")),
    F2extracao: fs.readFileSync(caminho("F2.extracao")),
  });
  const r = vinculacoes.resumo;
  console.log(`etapa 5: ${r.registrosDeCodigo} registros de código ${JSON.stringify(r.porStatusCodigo)}; ${r.registrosDeRegra} de regra ${JSON.stringify(r.porStatusRegra)}; ${r.ncmsOficiaisSemRegra} NCMs oficiais sem regra`);
  return { ...base, vinculacoes };
}
