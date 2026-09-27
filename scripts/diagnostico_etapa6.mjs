// Etapa 6: diagnóstico das regras 200033/200043 segundo a matriz de decisão.
//
// Lê docs/etapa6/matriz-decisao.json (proposta escrita à mão), a base v2 e as
// validações do empresa.json, e gera:
//   docs/etapa6/diagnostico-200033-200043.csv  - uma linha por regra do escopo
//   docs/etapa6/relatorio-etapa6.md             - matriz, contagens, exemplos e tabela
// Não altera a base, o motor nem as regras. Tudo aqui é derivado e reproduzível.
//
// Uso: node scripts/diagnostico_etapa6.mjs             (gera os dois arquivos)
//      node scripts/diagnostico_etapa6.mjs --verificar (confere sem gravar)
import fs from "node:fs";

const MATRIZ = "docs/etapa6/matriz-decisao.json";
const CSV = "docs/etapa6/diagnostico-200033-200043.csv";
const MD = "docs/etapa6/relatorio-etapa6.md";
const V2 = "data/base-normativa.v2.json";
const EMPRESA = "empresa.json";

// Resultado da comparação da Etapa 5 -> status desta matriz
const STATUS_POR_RESULTADO = {
  concorda: "NORMA_CONFIRMADA",
  item_entre_varios: "NORMA_POSSIVEL_MULTIPLOS_ITENS",
  item_divergente: "CONFLITO_PLANILHA_FONTE",
  ncm_so_na_F1: "CONFLITO_ENTRE_FONTES",
  ncm_so_na_F2: "CONFLITO_ENTRE_FONTES",
};
const PERMISSAO = {
  NORMA_CONFIRMADA: { mapeamento: "sim", veredito: "só após validação humana do produto", validacao: "sim (produto e condição)", bloqueio: "não" },
  NORMA_POSSIVEL_MULTIPLOS_ITENS: { mapeamento: "parcial (código e anexo; item não)", veredito: "não", validacao: "sim (escolha do item e produto)", bloqueio: "escolha automática do item" },
  CONFLITO_PLANILHA_FONTE: { mapeamento: "parcial (código e anexo; item não)", veredito: "não", validacao: "sim (resolver divergência e produto)", bloqueio: "item da planilha como fundamento" },
  CONFLITO_ENTRE_FONTES: { mapeamento: "não", veredito: "não", validacao: "sim (especialista)", bloqueio: "enquadramento e cálculo" },
};

export function diagnosticar(v2, matriz, empresa) {
  const vinc = v2.vinculacoes;
  const cod = (c, attr) => vinc.codigo.find((x) => x.id === `C-${c}-${attr}`);
  const codigosPorNcm = {};
  v2.regras.forEach((r) => (codigosPorNcm[r.ncm] ??= new Set()).add(r.cClassTrib));
  const idsVistos = {};
  v2.regras.forEach((r) => (idsVistos[r.id] = (idsVistos[r.id] || 0) + 1));
  const idsStatus = new Set(matriz.status.map((s) => s.id));
  const idsSinal = new Set(matriz.sinalizadores.map((s) => s.id));

  const linhas = vinc.regras.map((x) => {
    const c = x.cClassTrib;
    const d = x.dadoExtraido;
    const status = STATUS_POR_RESULTADO[x.comparacao.resultado];
    if (!idsStatus.has(status)) throw new Error(`status sem definição na matriz: ${status}`);
    const sinais = [];
    const fund = cod(c, "fundamentoLegal").status;
    if (fund === "conflito") sinais.push("FUNDAMENTO_DIVERGENTE");
    if (fund === "ambiguo") sinais.push("FUNDAMENTO_A_REVISAR");
    if (cod(c, "vigenciaInicio").status === "ambiguo") sinais.push("VIGENCIA_AMBIGUA");
    if (d.itensF1QueCobremONcm.length > 1) sinais.push("DEPENDE_COMPOSICAO_PRODUTO");
    sinais.push("CONDICAO_NAO_VERIFICAVEL_NO_XML");
    if (codigosPorNcm[x.regra.ncm].size > 1) sinais.push("NCM_EM_OUTROS_CODIGOS");
    if (idsVistos[x.regra.regraId] > 1) sinais.push("REGRAID_DUPLICADO");
    sinais.forEach((s) => { if (!idsSinal.has(s)) throw new Error(`sinalizador sem definição: ${s}`); });

    const anexo = v2.regras[x.regra.indice].anexo;
    const f1 = d.coberturaF1.length
      ? d.coberturaF1.map((k) => `Anexo ${anexo} item ${k.item} (${k.codigo}${k.exata ? "" : ", por prefixo"})`).join(" + ")
      : "não lista";
    const f2 = d.ncmNaListaOficial.F2 ? `lista (${d.descricoesF2.length} descrição(ões): ${d.descricoesF2.join(" / ")})` : `não lista no ${c}`;
    const itens = d.itensF1QueCobremONcm.join(", ");
    const motivo = {
      NORMA_CONFIRMADA: `F1 e F2 associam a NCM ao item ${itens} (${d.descricoesF2.join(" / ")}); o item da regra coincide.`,
      NORMA_POSSIVEL_MULTIPLOS_ITENS: `A NCM é coberta pelos itens ${itens}; o item da regra (${x.valorRegra}) está entre eles; o item depende da composição do produto.`,
      CONFLITO_PLANILHA_FONTE: `F1 e F2 associam a NCM ao item ${itens} (${d.descricoesF2.join(" / ")}); a regra (planilha) traz o item ${x.valorRegra}.`,
      CONFLITO_ENTRE_FONTES: d.ncmNaListaOficial.F1
        ? `A LC 214 lista a NCM (item ${itens}); o SVRS não a lista no ${c}. Nenhuma fonte prevalece.`
        : `O SVRS lista a NCM no ${c}; a LC 214 não. Nenhuma fonte prevalece.`,
    }[status];
    const p = PERMISSAO[status];
    return {
      indice: x.regra.indice, linha: x.regra.linha, regraId: x.regra.regraId, ncm: x.regra.ncm, codigo: c, itemRegra: x.valorRegra,
      evidenciaF1: f1, evidenciaF2: f2, statusEtapa5: x.status, status, sinalizadores: sinais.join(" "), motivo,
      mapeamentoAutomatico: p.mapeamento, vereditoAutomatico: p.veredito, validacaoHumana: p.validacao, bloqueio: p.bloqueio,
      vinculacao: x.id,
    };
  });

  const contar = (xs, k) => xs.reduce((o, x) => ((o[k(x)] = (o[k(x)] || 0) + 1), o), {});
  const foraEscopo = v2.regras.filter((r) => !vinc.escopo.includes(r.cClassTrib)).length;
  const sinais = {};
  linhas.forEach((l) => l.sinalizadores.split(" ").forEach((s) => (sinais[s] = (sinais[s] || 0) + 1)));
  const dupBase = Object.values(idsVistos).filter((n) => n > 1).reduce((a, n) => a + n, 0);
  const val = empresa.validacoes ?? [];
  const idsEscopo = new Set(linhas.map((l) => l.regraId));
  const contagens = {
    regrasNoEscopo: linhas.length,
    porStatusNoEscopo: contar(linhas, (l) => l.status),
    baseInteira: {
      ...contar(linhas, (l) => l.status),
      SEM_EVIDENCIA_OFICIAL: foraEscopo,
      total: linhas.length + foraEscopo,
    },
    lacunasFonteSemRegra: contar(vinc.ncmsOficiaisSemRegra, (x) => x.cClassTrib),
    sinalizadoresNoEscopo: sinais,
    regraIdDuplicadoNaBase: dupBase,
    validacoesEmpresa: {
      total: val.length,
      autorSistema: val.filter((v) => v.autor === "Sistema").length,
      autorHumano: val.filter((v) => v.autor && v.autor !== "Sistema").length,
      semJustificativa: val.filter((v) => !v.justificativa).length,
      noEscopo: val.filter((v) => idsEscopo.has(v.regraId)).length,
    },
  };
  return { linhas, contagens };
}

// ---------- saída ----------

const COLUNAS = ["indice", "linha", "regraId", "ncm", "codigo", "itemRegra", "evidenciaF1", "evidenciaF2", "statusEtapa5", "status",
  "sinalizadores", "motivo", "mapeamentoAutomatico", "vereditoAutomatico", "validacaoHumana", "bloqueio", "vinculacao"];
const celula = (v) => { const s = String(v); return /[;"\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
export const csv = ({ linhas }) => [COLUNAS.join(";"), ...linhas.map((l) => COLUNAS.map((c) => celula(l[c])).join(";"))].join("\n") + "\n";

const md = (s) => String(s).replace(/\|/g, "\\|").replace(/\n/g, " ");
export function relatorio(matriz, { linhas, contagens }) {
  const L = [];
  const t = (cab, rows) => { L.push(`| ${cab.join(" | ")} |`, `|${cab.map(() => "---").join("|")}|`, ...rows.map((r) => `| ${r.map(md).join(" | ")} |`), ""); };
  const exemplo = (st) => linhas.find((l) => l.status === st);
  L.push("# Etapa 6: matriz de decisão e de confiança", "", `> ${matriz.estado} ${matriz.principio}`, "",
    "Gerado por `scripts/diagnostico_etapa6.mjs` a partir de `docs/etapa6/matriz-decisao.json` e de `data/base-normativa.v2.json`.", "");
  L.push("## 1. Camadas de uma afirmação", "");
  t(["Camada", "Definição", "Como apresentar"], matriz.camadas.map((c) => [`\`${c.id}\``, c.definicao, c.comoApresentar]));
  L.push("## 2. Natureza das fontes", "");
  t(["Fonte", "Natureza"], Object.entries(matriz.naturezaDasFontes).map(([k, v]) => [k, v]));
  L.push("## 3. Dois níveis de enquadramento", "");
  t(["Nível", "Significado"], Object.entries(matriz.niveisDeEnquadramento).map(([k, v]) => [k, v]));
  L.push("## 4. Status propostos", "");
  t(["Status", "Categoria", "Mapeamento automático", "Veredito automático", "Validação humana", "Bloqueia"],
    matriz.status.map((s) => [`\`${s.id}\``, s.categoria, s.mapeamentoAutomatico === true ? "sim" : s.mapeamentoAutomatico === false ? "não" : s.mapeamentoAutomatico, s.vereditoAutomatico, s.exigeValidacaoHumana, s.bloqueia]));
  L.push("## 5. Sinalizadores (não exclusivos)", "");
  t(["Sinalizador", "Definição", "Efeito"], matriz.sinalizadores.map((s) => [`\`${s.id}\``, s.definicao, s.efeito]));
  L.push("## 6. Matriz de decisão: 14 situações", "");
  for (const s of matriz.situacoes) {
    L.push(`### ${s.n}. ${s.titulo}`, "");
    t(["Aspecto", "Proposta"], [
      ["Condição de entrada", s.condicaoEntrada], ["Evidência necessária", s.evidenciaNecessaria], ["Fontes", s.fontes],
      ["Grau da evidência", s.grauEvidencia], ["Decisão automática", s.decisaoAutomatica], ["Validação humana", s.validacaoHumana],
      ["Bloqueio", s.bloqueio], ["Justificativa ao usuário", s.justificativaUsuario], ["Rastreabilidade", s.rastreabilidade]]);
  }
  L.push("## 7. Contagens", "");
  t(["Status", "No escopo (200033 + 200043)", "Na base inteira"], [...matriz.status.map((s) => [`\`${s.id}\``,
    s.id === "LACUNA_FONTE_SEM_REGRA" ? "—" : contagens.porStatusNoEscopo[s.id] ?? 0,
    s.id === "LACUNA_FONTE_SEM_REGRA" ? `${Object.values(contagens.lacunasFonteSemRegra).reduce((a, b) => a + b, 0)} NCMs (não são regras)` : contagens.baseInteira[s.id] ?? 0]),
    ["**Total de regras**", contagens.regrasNoEscopo, contagens.baseInteira.total]]);
  t(["Sinalizador", "Regras no escopo"], Object.entries(contagens.sinalizadoresNoEscopo).map(([k, v]) => [`\`${k}\``, v]));
  L.push(`regraId duplicado na base inteira: ${contagens.regraIdDuplicadoNaBase} regras (fora do escopo).`, "",
    `Validações no empresa.json: ${contagens.validacoesEmpresa.total} (autor "Sistema": ${contagens.validacoesEmpresa.autorSistema}; autor humano: ${contagens.validacoesEmpresa.autorHumano}; sem justificativa: ${contagens.validacoesEmpresa.semJustificativa}; sobre regras do escopo: ${contagens.validacoesEmpresa.noEscopo}).`, "");
  L.push("## 8. Exemplos por status", "");
  t(["Status", "Linha", "regraId", "NCM", "Evidência F1", "Evidência F2", "Motivo"],
    ["NORMA_CONFIRMADA", "NORMA_POSSIVEL_MULTIPLOS_ITENS", "CONFLITO_PLANILHA_FONTE", "CONFLITO_ENTRE_FONTES"].map((st) => {
      const e = exemplo(st); return [`\`${st}\``, e.linha, e.regraId, e.ncm, e.evidenciaF1, e.evidenciaF2, e.motivo];
    }));
  L.push("## 9. Campos que o motor precisará conhecer (não adicionados)", "");
  t(["Entidade", "Campo", "Finalidade"], matriz.camposFuturos.map((c) => [c.entidade, `\`${c.campo}\``, c.finalidade]));
  L.push("## 10. Decisões pendentes", "");
  t(["Id", "Tema"], matriz.decisoesPendentes.map((d) => [d.id, d.tema]));
  L.push("## 11. Diagnóstico das 127 regras (200033 e 200043)", "", "Mesmo conteúdo de `diagnostico-200033-200043.csv`.", "");
  t(["regraId", "Linha", "NCM", "Código", "Evidência F1", "Evidência F2", "Status", "Motivo", "Decisão automática permitida?"],
    linhas.map((l) => [l.regraId, l.linha, l.ncm, l.codigo, l.evidenciaF1, l.evidenciaF2, `\`${l.status}\``, l.motivo,
      `mapeamento: ${l.mapeamentoAutomatico}; veredito: ${l.vereditoAutomatico}`]));
  return L.join("\n");
}

function main() {
  const matriz = JSON.parse(fs.readFileSync(MATRIZ, "utf8"));
  const v2 = JSON.parse(fs.readFileSync(V2, "utf8"));
  const empresa = JSON.parse(fs.readFileSync(EMPRESA, "utf8"));
  const d = diagnosticar(v2, matriz, empresa);
  const saidas = { [CSV]: csv(d), [MD]: relatorio(matriz, d) };
  if (process.argv.includes("--verificar")) {
    let falhas = 0;
    const ok = (c, m) => { console.log(`${c ? "OK   " : "FALHA"} ${m}`); if (!c) falhas++; };
    for (const [arq, txt] of Object.entries(saidas)) ok(fs.existsSync(arq) && fs.readFileSync(arq, "utf8") === txt, `${arq} reproduzível a partir da matriz e da v2`);
    ok(d.linhas.length === v2.vinculacoes.regras.length, `uma linha por registro de vinculação: ${d.linhas.length}`);
    const soma = Object.values(d.contagens.porStatusNoEscopo).reduce((a, b) => a + b, 0);
    ok(soma === d.linhas.length && d.contagens.baseInteira.total === v2.regras.length, `status somam ${soma} no escopo e ${d.contagens.baseInteira.total} na base`);
    ok(d.linhas.every((l) => v2.regras[l.indice].id === l.regraId && v2.regras[l.indice].original.linha === l.linha), "cada linha aponta para a regra certa (índice, linha, regraId)");
    ok(matriz.situacoes.length === 14 && matriz.situacoes.every((s, i) => s.n === i + 1), "matriz com as 14 situações, na ordem");
    console.log(falhas ? `\n${falhas} falha(s).` : "\nTodas as conferências passaram.");
    process.exit(falhas ? 1 : 0);
  }
  for (const [arq, txt] of Object.entries(saidas)) fs.writeFileSync(arq, txt);
  console.log(JSON.stringify(d.contagens, null, 1));
}

main();
