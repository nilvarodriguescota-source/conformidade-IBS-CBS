// Confere data/base-normativa.v2.json contra a base atual, o snapshot da planilha e o manifesto.
// Só lê, não grava nada.
//
// - Projeção: a v2 sem os blocos novos é idêntica, byte a byte, à base atual.
// - Etapa 3: cada regra tem original e originaisAgrupados; as 1.477 linhas da aba
//   "Base de dados" aparecem uma vez cada; remontadas a partir da v2, dão o mesmo
//   hash de valores do snapshot auditado; e cada original reproduz a sua regra.
// - Etapa 4: o bloco fontes é o montado do manifesto; cada arquivo confere no disco;
//   as extrações são refeitas a partir dos originais; as referências resolvem.
// - Etapa 5.3: evidenciasOficiais e itemOficial reproduzíveis a partir de data/auditoria-oficial.json;
//   item original preservado; itemOficial com evidência; fatos nos snapshots; nada duplicado.
// - Etapa 5: vinculacoes é reproduzível; cada fato é reencontrado na fonte (trecho da
//   F1 no texto vigente ou na tabela do anexo; valor da F2 no html e na extração);
//   cada regra citada existe e confere; nenhuma regra recebeu campo novo.
//
// Uso: node scripts/verificar_base_v2.mjs [base atual] [v2] [relatório]
//      (sai com código 1 se algo não conferir)
import fs from "node:fs";
import crypto from "node:crypto";
import { serializar } from "./gerar_base_v2.mjs";
import { lerSnapshot, reproduzirRegra, comparar } from "./base_v2_planilha.mjs";
import { MANIFESTO, montarFontes, conferirArquivos } from "./base_v2_fontes.mjs";
import { extrair } from "./snapshot_svrs.mjs";
import { ESCOPO, montarVinculacoes, lerF1, lerF2 } from "./base_v2_vinculos.mjs";
import { AUDITORIA, CAMPOS_CODIGO, montarEvidencias } from "./base_v2_evidencias.mjs";

const ATUAL = process.argv[2] ?? "data/base-normativa.json";
const V2 = process.argv[3] ?? "data/base-normativa.v2.json";
const RELATORIO = process.argv[4] ?? "data/base-normativa-relatorio.json";

const ESPERADO = {
  shaAtual: "a451c459597ff6fa4d45c95713708a5220fd7701f4b835df039b8f962e031416",
  shaRelatorio: "4c0c634d3d59d592137a9fa2a0f3c632e458be7b169a066086436dd44216e5d0",
  regras: 1369,
  ncms: 1193,
  codigosCatalogo: 12,
  porCodigo: { "200033": { regras: 85, ncms: 63 }, "200043": { regras: 42, ncms: 38 } },
  linhasPlanilha: 1477,
  agrupadas: 108,
  agrupadasPorCodigo: { "200003": 93, "200004": 1, "200014": 8, "200034": 6 },
  linhasCrlf: [194, 286, 290, 446, 695],
  shaManifesto: "5cbe056937f4e325fcc4cf5aa8b61f1800157abcef345e6903a532c9f943e996",
  fontes: ["PLANILHA", "F1", "F2"],
  arquivosPorTipo: { original: 3, metadados_captura: 1, extracao: 4 },
  vinculosCodigo: { inequivoco: 6, ambiguo: 3, conflito: 1, informativo: 2 },
  vinculosRegra: { inequivoco: 70, ambiguo: 45, conflito: 12 },
  resultadosRegra: { concorda: 70, item_entre_varios: 45, item_divergente: 11, ncm_so_na_F1: 1 },
  ncmsOficiaisSemRegra: { "200033": 1, "200043": 48 },
  regrasDeOutrosCodigos: 20,
  // Etapa 5.3 (Fase 3)
  evidenciasPorStatus: { CONFIRMADA: 856, VEDADO: 135, DIVERGENTE: 160, NAO_DETERMINADA: 203, NAO_LOCALIZADA: 15 },
  comItemOficial: 978,
  vinculosCodigoEtapa53: 40,
};
const BLOCOS_NOVOS = ["original", "originaisAgrupados"];
/** Etapa 5.3: itemOficial, só em parte das regras. */
const OPCIONAL_NOVO = ["itemOficial"];
const RAIZ_NOVA = ["fontes", "vinculacoes", "evidenciasOficiais"];

const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
let falhas = 0;
const conferir = (ok, msg) => { console.log(`${ok ? "OK   " : "FALHA"} ${msg}`); if (!ok) falhas++; };

/** Lista os caminhos em que a e b diferem (chaves, tipos, valores e ordem das chaves). */
function diferencas(a, b, caminho = "", saida = []) {
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) saida.push(`${caminho}: ${a.length} × ${b.length} itens`);
    for (let i = 0; i < Math.min(a.length, b.length); i++) diferencas(a[i], b[i], `${caminho}[${i}]`, saida);
  } else if (a && b && typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) {
    const ka = Object.keys(a), kb = Object.keys(b);
    for (const k of ka) if (!(k in b)) saida.push(`${caminho}.${k}: ausente na v2`);
    for (const k of kb) if (!(k in a)) saida.push(`${caminho}.${k}: só na v2`);
    if (ka.join() !== kb.join() && ka.length === kb.length) saida.push(`${caminho}: ordem das chaves difere`);
    for (const k of ka) if (k in b) diferencas(a[k], b[k], `${caminho}.${k}`, saida);
  } else if (!Object.is(a, b)) {
    saida.push(`${caminho}: ${JSON.stringify(a)} × ${JSON.stringify(b)}`);
  }
  return saida;
}

const brutoAtual = fs.readFileSync(ATUAL);
const brutoV2 = fs.readFileSync(V2);
const atual = JSON.parse(brutoAtual.toString("utf8"));
const v2 = JSON.parse(brutoV2.toString("utf8"));
console.log(`v2: ${brutoV2.length} bytes, sha256 ${sha(brutoV2)}\n`);

// 1. Entradas intocadas
conferir(sha(brutoAtual) === ESPERADO.shaAtual, `base atual sha256 ${sha(brutoAtual)}`);
if (fs.existsSync(RELATORIO)) {
  const r = fs.readFileSync(RELATORIO);
  conferir(sha(r) === ESPERADO.shaRelatorio, `relatório sha256 ${sha(r)}`);
}

// 2. Projeção: v2 sem os blocos novos = base atual, byte a byte e campo a campo
const projecao = Object.fromEntries(Object.entries(v2).filter(([k]) => !RAIZ_NOVA.includes(k)));
projecao.regras = v2.regras.map((r) => Object.fromEntries(Object.entries(r).filter(([k]) => !BLOCOS_NOVOS.includes(k) && !OPCIONAL_NOVO.includes(k))));
const brutoProj = Buffer.from(serializar(projecao), "utf8");
conferir(brutoProj.equals(brutoAtual), `projeção (v2 sem ${[...RAIZ_NOVA, ...BLOCOS_NOVOS, ...OPCIONAL_NOVO].join(", ")}) byte a byte igual à atual (sha256 ${sha(brutoProj)})`);
const difs = diferencas(atual, projecao);
conferir(difs.length === 0, `projeção campo a campo: ${difs.length} diferença(s)`);
for (const d of difs.slice(0, 20)) console.log(`      ${d}`);
conferir(JSON.stringify(Object.keys(v2)) === JSON.stringify([...Object.keys(atual), ...RAIZ_NOVA]), `raiz: chaves atuais + ${RAIZ_NOVA.join(", ")} no fim`);
conferir(v2.regras.every((r) => JSON.stringify(Object.keys(r).slice(18)) === JSON.stringify("itemOficial" in r ? [...BLOCOS_NOVOS, ...OPCIONAL_NOVO] : BLOCOS_NOVOS)),
  "blocos novos no fim de cada regra, depois dos 18 campos (itemOficial por último, quando existe)");

// 3. Contagens (regras atuais)
const ncms = (rs) => new Set(rs.map((r) => r.ncm)).size;
conferir(v2.regras.map((r) => r.id).join("\n") === atual.regras.map((r) => r.id).join("\n"), "ids das regras: mesmo conjunto e mesma ordem");
conferir(v2.regras.length === ESPERADO.regras, `regras: ${v2.regras.length}`);
conferir(ncms(v2.regras) === ESPERADO.ncms, `NCMs distintos: ${ncms(v2.regras)}`);
conferir(Object.keys(v2.catalogoCodigos).length === ESPERADO.codigosCatalogo, `códigos no catálogo: ${Object.keys(v2.catalogoCodigos).length}`);
for (const [cod, esp] of Object.entries(ESPERADO.porCodigo)) {
  const rs = v2.regras.filter((r) => r.cClassTrib === cod);
  conferir(rs.length === esp.regras && ncms(rs) === esp.ncms, `${cod}: ${rs.length} regras, ${ncms(rs)} NCMs`);
}

// 4. Etapa 3: forma dos blocos
const snap = lerSnapshot();
const nomes = snap.colunas.map(([, nome]) => nome);
const blocos = v2.regras.flatMap((r) => [r.original, ...r.originaisAgrupados]);
const formaOk = (b, motivo) =>
  JSON.stringify(Object.keys(b)) === JSON.stringify(motivo ? ["fonte", "aba", "linha", "motivo", "valores"] : ["fonte", "aba", "linha", "valores"]) &&
  b.fonte === "PLANILHA" && b.aba === "Base de dados" && Number.isInteger(b.linha) && (!motivo || b.motivo === "duplicata_exata") &&
  JSON.stringify(Object.keys(b.valores)) === JSON.stringify(nomes) &&
  Object.values(b.valores).every((x) => x === null || (typeof x === "string" && x !== ""));
conferir(v2.regras.every((r) => r.original && formaOk(r.original, false)), `original em todas as regras, com ${nomes.length} colunas na ordem da planilha (vazia = null)`);
conferir(v2.regras.every((r) => Array.isArray(r.originaisAgrupados) && r.originaisAgrupados.every((b) => formaOk(b, true))), "originaisAgrupados em todas as regras, com a mesma forma e motivo duplicata_exata");

// 5. Cobertura: cada linha da aba exatamente uma vez
const linhas = blocos.map((b) => b.linha).sort((a, b) => a - b);
const esperadas = snap.dados.map(([l]) => l);
conferir(blocos.length === ESPERADO.linhasPlanilha && JSON.stringify(linhas) === JSON.stringify(esperadas),
  `cobertura: ${blocos.length} linhas, de ${linhas[0]} a ${linhas.at(-1)}, cada uma uma vez`);
const agrupadas = v2.regras.flatMap((r) => r.originaisAgrupados.map(() => r.cClassTrib));
const porCod = {};
agrupadas.forEach((c) => (porCod[c] = (porCod[c] || 0) + 1));
conferir(agrupadas.length === ESPERADO.agrupadas, `linhas agrupadas: ${agrupadas.length}, em ${v2.regras.filter((r) => r.originaisAgrupados.length).length} regras`);
conferir(JSON.stringify(porCod, Object.keys(porCod).sort()) === JSON.stringify(ESPERADO.agrupadasPorCodigo), `agrupadas por cClassTrib: ${JSON.stringify(porCod, Object.keys(porCod).sort())}`);

// 6. Literalidade: remontar a aba a partir da v2 e comparar com o hash auditado
const letra = Object.fromEntries(snap.colunas.map(([l, nome]) => [nome, l]));
const remontada = [snap.cabecalho, ...blocos
  .sort((a, b) => a.linha - b.linha)
  .map((b) => [b.linha, Object.fromEntries(Object.entries(b.valores).filter(([, x]) => x !== null).map(([nome, x]) => [letra[nome], x]))])];
const shaRemontada = sha(JSON.stringify(remontada));
conferir(shaRemontada === snap.shaValores, `aba remontada da v2: shaValores ${shaRemontada.slice(0, 12)}… = snapshot auditado ${snap.shaValores.slice(0, 12)}…`);

// 7. Coerência: cada original reproduz a sua regra; cada agrupada, a mesma chave
const crlf = [];
let incoerentes = 0;
v2.regras.forEach((r, i) => {
  const atualR = atual.regras[i];
  if (!atualR) { if (incoerentes++ < 5) console.log(`      regra[${i}]: não existe na base atual`); return; }
  const res = comparar(reproduzirRegra(r.original.valores, v2.catalogoCodigos) ?? {}, atualR);
  if (res === "igual_exceto_crlf") crlf.push(r.original.linha);
  else if (res !== "igual") { if (incoerentes++ < 5) console.log(`      regra[${i}] linha ${r.original.linha}: ${res}`); }
  for (const g of r.originaisAgrupados) {
    const rg = reproduzirRegra(g.valores, v2.catalogoCodigos);
    if (!rg || rg.ncm !== atualR.ncm || rg.cClassTrib !== atualR.cClassTrib || rg.descricaoLegal !== atualR.descricaoLegal || g.linha <= r.original.linha) {
      if (incoerentes++ < 5) console.log(`      regra[${i}] agrupada linha ${g.linha}: não é duplicata exata posterior`);
    }
  }
});
conferir(incoerentes === 0, `coerência: cada original gera a sua regra e cada agrupada é duplicata exata posterior (${incoerentes} incoerência(s))`);
conferir(JSON.stringify(crlf) === JSON.stringify(ESPERADO.linhasCrlf), `diferença CRLF × LF só nas linhas documentadas: ${crlf.join(", ")}`);

// 8. Etapa 4: registro de fontes
if (!v2.fontes?.manifesto || !v2.fontes?.registros) {
  conferir(false, "bloco fontes presente na v2");
  console.log(`\n${falhas} falha(s).`);
  process.exit(1);
}
const brutoManifesto = fs.readFileSync(MANIFESTO);
conferir(sha(brutoManifesto) === ESPERADO.shaManifesto && v2.fontes.manifesto.sha256 === ESPERADO.shaManifesto,
  `manifesto sha256 ${sha(brutoManifesto).slice(0, 12)}… = registrado na v2 = esperado`);
const difFontes = diferencas(montarFontes(brutoManifesto), v2.fontes, ".fontes");
conferir(difFontes.length === 0, `bloco fontes idêntico ao montado do manifesto: ${difFontes.length} diferença(s)`);
for (const d of difFontes.slice(0, 10)) console.log(`      ${d}`);
const problemasArq = conferirArquivos(v2.fontes);
conferir(problemasArq.length === 0, `arquivos registrados no projeto: existem, com sha256 e tamanho registrados (${problemasArq.length} problema(s))`);
for (const p of problemasArq) console.log(`      ${p}`);

const registros = v2.fontes.registros;
conferir(JSON.stringify(Object.keys(registros)) === JSON.stringify(ESPERADO.fontes) &&
  Object.entries(registros).every(([k, r]) => r.id === k), `fontes registradas: ${Object.keys(registros).join(", ")}`);
const arquivos = Object.values(registros).flatMap((r) => r.arquivos.map((a) => ({ ...a, fonte: r.id })));
const porId = new Map(arquivos.map((a) => [a.id, a]));
const porTipo = {};
arquivos.forEach((a) => (porTipo[a.tipo] = (porTipo[a.tipo] || 0) + 1));
conferir(porId.size === arquivos.length && JSON.stringify(porTipo, Object.keys(porTipo).sort()) === JSON.stringify(ESPERADO.arquivosPorTipo, Object.keys(ESPERADO.arquivosPorTipo).sort()),
  `arquivos: ${arquivos.length}, ids únicos, por tipo ${JSON.stringify(porTipo)}`);
conferir(arquivos.every((a) => a.tipo !== "extracao" || (porId.get(a.derivadoDe)?.tipo === "original" && porId.get(a.derivadoDe).fonte === a.fonte)) &&
  arquivos.every((a) => a.tipo === "extracao" || a.derivadoDe === undefined),
  "toda extração aponta para um original da mesma fonte; originais não têm derivadoDe");
conferir(arquivos.every((a) => (a.noProjeto ? typeof a.caminho === "string" : a.caminho === null)),
  `fora do projeto e sem caminho: ${arquivos.filter((a) => !a.noProjeto).map((a) => a.id).join(", ")}`);

// Derivações refeitas a partir dos originais
const f2 = (id) => fs.readFileSync(porId.get(id).caminho);
const extracao = JSON.parse(f2("F2.extracao").toString("utf8"));
conferir(extracao.derivadoDe.sha256 === porId.get("F2.html").sha256 &&
  JSON.stringify(extracao.cst200) === JSON.stringify(extrair(f2("F2.html").toString("utf8"))),
  "F2.extracao refeita a partir de F2.html: idêntica");
for (const a of arquivos.filter((x) => x.fonte === "PLANILHA" && x.noProjeto)) {
  const j = JSON.parse(fs.readFileSync(a.caminho, "utf8"));
  conferir(sha(JSON.stringify(j.linhas)) === a.shaValores && j.aba === a.aba, `${a.id}: shaValores recalculado = registrado`);
}

// Referências das regras às fontes
const refs = new Set(v2.regras.flatMap((r) => [r.original, ...r.originaisAgrupados]).map((b) => b.fonte));
conferir([...refs].every((f) => f in registros), `referências das regras resolvem no registro: ${[...refs].join(", ")}`);
conferir(registros.PLANILHA.arquivos.some((a) => a.aba === "Base de dados" && a.caminho === "data/fontes/planilha-p3/base-de-dados.json"),
  "aba Base de dados usada na Etapa 3 está registrada em PLANILHA");

// 9. Etapa 5: vinculações (auditoria)
const vinc = v2.vinculacoes;
if (!vinc?.codigo || !vinc?.regras) {
  conferir(false, "bloco vinculacoes presente na v2");
  console.log(`\n${falhas} falha(s).`);
  process.exit(1);
}
conferir(v2.regras.every((r) => Object.keys(r).length === ("itemOficial" in r ? 21 : 20)), "nenhuma regra recebeu campo novo na Etapa 5 (18 campos + original + originaisAgrupados; itemOficial é da Etapa 5.3)");
const refeitoV = montarVinculacoes({ ...v2, regras: v2.regras.map(({ itemOficial: _io, ...r }) => r), vinculacoes: undefined, evidenciasOficiais: undefined }, { F1: fs.readFileSync(porId.get("F1.html").caminho), F2html: fs.readFileSync(porId.get("F2.html").caminho), F2extracao: fs.readFileSync(porId.get("F2.extracao").caminho) });
conferir(diferencas(refeitoV, vinc, ".vinculacoes").length === 0, "vinculacoes da Etapa 5 intactas (reproduzíveis sem os blocos da Etapa 5.3)");
const bruto = (id) => fs.readFileSync(porId.get(id).caminho);
const arqs = { F1: bruto("F1.html"), F2html: bruto("F2.html"), F2extracao: bruto("F2.extracao") };
const refeito = montarVinculacoes({ ...v2, vinculacoes: undefined }, arqs);
const difVinc = diferencas(refeito, vinc, ".vinculacoes");
conferir(difVinc.length === 0, `vinculacoes reproduzível a partir das fontes: ${difVinc.length} diferença(s)`);
for (const d of difVinc.slice(0, 10)) console.log(`      ${d}`);

// Cada fato reencontrado na fonte, de forma independente da montagem
const leitorF1 = lerF1(arqs.F1), leitorF2 = lerF2(arqs.F2html, arqs.F2extracao);
const registrosV = [...vinc.codigo, ...vinc.regras, ...vinc.ncmsOficiaisSemRegra];
const fatos = registrosV.flatMap((x) => x.fatos);
const anexos = Object.fromEntries(Object.values(ESCOPO).map((e) => [e.ancoraAnexo, leitorF1.anexo(e.ancoraAnexo, e.fimAnexo)]));
let fatosRuins = 0;
const ruim = (msg) => { if (fatosRuins++ < 5) console.log(`      ${msg}`); };
for (const f of fatos) {
  const a = porId.get(f.arquivo);
  if (!a || a.sha256 !== f.sha256 || registros[f.fonte].versao !== f.versao || registros[f.fonte].dataConsulta !== f.dataConsulta) ruim(`${f.arquivo}: hash, versão ou data difere do registro de fontes`);
  if (f.fonte === "F1") {
    if (f.localizacao.dispositivo.startsWith("Anexo")) {
      const l = anexos[f.localizacao.ancora]?.find((x) => x.linhaTabela === f.linhaTabela);
      if (!l || `${l.item} | ${l.descricao} | ${l.codigos}` !== f.trecho) ruim(`F1 ${f.localizacao.dispositivo}: linha da tabela não confere`);
    } else if (!leitorF1.textoVigente.split("\n").includes(f.trecho)) ruim(`F1 ${f.localizacao.dispositivo}: trecho não está no texto vigente`);
  } else if (f.fonte === "F2") {
    const { html, extracao } = leitorF2.resolver(f.localizacao);
    if (JSON.stringify(html) !== JSON.stringify(f.valor) || JSON.stringify(extracao) !== JSON.stringify(f.valor) || f.extracao.sha256 !== porId.get("F2.extracao").sha256)
      ruim(`F2 ${JSON.stringify(f.localizacao)}: valor não confere com F2.html e F2.extracao`);
  } else ruim(`fonte desconhecida ${f.fonte}`);
}
conferir(fatosRuins === 0, `fatos reencontrados na fonte: ${fatos.length} (F1 ${fatos.filter((f) => f.fonte === "F1").length}, F2 ${fatos.filter((f) => f.fonte === "F2").length}); ${fatosRuins} sem correspondência`);

// Referências às regras
const noEscopo = v2.regras.map((r, i) => [r, i]).filter(([r]) => r.cClassTrib in ESCOPO);
const refOk = (x) => { const r = v2.regras[x.indice]; return r && r.original.linha === x.linha && r.id === x.regraId && r.ncm === x.ncm; };
conferir(vinc.regras.every((x) => refOk(x.regra) && v2.regras[x.regra.indice].item === x.regra.item && v2.regras[x.regra.indice].cClassTrib === x.cClassTrib) &&
  JSON.stringify(vinc.regras.map((x) => x.regra.indice).sort((a, b) => a - b)) === JSON.stringify(noEscopo.map(([, i]) => i)),
  `registros de regra: ${vinc.regras.length}, um por regra de ${Object.keys(ESCOPO).join("/")}, com índice, linha, regraId e NCM conferidos`);
conferir(vinc.codigo.every((x) => x.alcance.every(refOk)) && vinc.regrasDeOutrosCodigosComNcmNaListaOficial.every(refOk) &&
  vinc.ncmsOficiaisSemRegra.every((x) => x.regrasDeOutrosCodigosComEstaNcm.every(refOk)), "demais referências a regras conferidas");
conferir(registrosV.every((x) => x.cClassTrib in ESCOPO), `nenhum registro fora do escopo (${Object.keys(ESCOPO).join(", ")})`);
const STATUS = ["inequivoco", "ambiguo", "conflito", "informativo", "sem_regra"];
conferir(registrosV.every((x) => x.fatos.length > 0 && "dadoExtraido" in x && (x.interpretacao === null || typeof x.interpretacao === "string") &&
  typeof x.propostaFutura === "string" && STATUS.includes(x.status)), "todo registro tem fatos, dado extraído, interpretação, proposta futura e status válido");

// Contagens
const contar = (xs, k) => xs.reduce((o, x) => ((o[k(x)] = (o[k(x)] || 0) + 1), o), {});
const igual = (a, b) => JSON.stringify(a, Object.keys(a).sort()) === JSON.stringify(b, Object.keys(b).sort());
const cc = contar(vinc.codigo, (x) => x.status), cr = contar(vinc.regras, (x) => x.status), rr = contar(vinc.regras, (x) => x.comparacao.resultado);
const sr = contar(vinc.ncmsOficiaisSemRegra, (x) => x.cClassTrib);
conferir(igual(cc, ESPERADO.vinculosCodigo), `registros de código por status: ${JSON.stringify(cc)}`);
conferir(igual(cr, ESPERADO.vinculosRegra), `registros de regra por status: ${JSON.stringify(cr)}`);
conferir(igual(rr, ESPERADO.resultadosRegra), `registros de regra por resultado: ${JSON.stringify(rr)}`);
conferir(igual(sr, ESPERADO.ncmsOficiaisSemRegra), `NCMs oficiais sem regra: ${JSON.stringify(sr)} (nenhuma regra criada)`);
conferir(vinc.regrasDeOutrosCodigosComNcmNaListaOficial.length === ESPERADO.regrasDeOutrosCodigos,
  `regras de outros códigos com NCM na lista oficial (informativo): ${vinc.regrasDeOutrosCodigosComNcmNaListaOficial.length}`);

// 10. Etapa 5.3 (Fase 3): evidências oficiais registradas (proveniência)
const evid = v2.evidenciasOficiais;
if (!evid?.regras || !evid?.codigo || !evid?.fontes) {
  conferir(false, "bloco evidenciasOficiais presente na v2");
  console.log(`\n${falhas} falha(s).`);
  process.exit(1);
}
const brutoAud = fs.readFileSync(AUDITORIA);
const aud = JSON.parse(brutoAud.toString("utf8"));
conferir(aud.entradas.base.sha256 === sha(brutoAtual) && aud.entradas.F1.sha256 === porId.get("F1.html").sha256 && aud.entradas.F2.sha256 === porId.get("F2.html").sha256 && aud.entradas.v2.sha256 === sha(brutoV2),
  "auditoria oficial gerada sobre a base atual, os snapshots registrados e esta v2");
// Reprodutível: a mesma montagem sobre a v2 sem os blocos da Etapa 5.3 dá exatamente o que está gravado
const semEtapa53 = { ...v2, regras: v2.regras.map(({ itemOficial: _io, ...r }) => r) };
delete semEtapa53.evidenciasOficiais;
const refeitoE = montarEvidencias(semEtapa53, aud, sha(brutoAtual));
const difEvid = diferencas(refeitoE.bloco, evid, ".evidenciasOficiais");
conferir(difEvid.length === 0, `evidenciasOficiais reproduzível a partir da auditoria oficial: ${difEvid.length} diferença(s)`);
for (const d of difEvid.slice(0, 10)) console.log(`      ${d}`);
conferir(v2.regras.every((r, i) => (refeitoE.itemOficialPorIndice.get(i) ?? undefined) === r.itemOficial), "itemOficial de cada regra reproduzível a partir da auditoria oficial");
// Todas as regras presentes, na ordem, com os campos originais e o item preservados
conferir(evid.regras.length === ESPERADO.regras && evid.regras.every((x, i) => x.indice === i), `evidências de regra: ${evid.regras.length}, uma por regra, na ordem da base`);
conferir(evid.regras.every((x, i) => {
  const r = v2.regras[i], a = atual.regras[i];
  return r.id === x.regraId && r.ncm === x.ncm && r.cClassTrib === x.cClassTrib && x.itemDaBase === r.item && r.item === a.item && r.original.linha === x.linhaPlanilha;
}), "cada evidência aponta para a sua regra (regraId, NCM, cClassTrib, linha); item original preservado nas 1.369");
// itemOficial só com evidência correspondente
const vincPorId = new Map(vinc.regras.map((x) => [x.id, x]));
let semEvidenciaItem = 0;
v2.regras.forEach((r, i) => {
  if (!("itemOficial" in r)) return;
  const x = evid.regras[i];
  const fatosCobrem = x.vinculoEtapa5 ? (vincPorId.get(x.vinculoEtapa5)?.fatos ?? []).filter((f) => f.fonte === "F1") : (x.fatosF1 ?? []).filter((f) => f.papel === "cobre o NCM");
  const ok = x.itemOficial === r.itemOficial && JSON.stringify(x.itensOficiais) === JSON.stringify([r.itemOficial]) && x.statusOficial !== "VEDADO" &&
    fatosCobrem.some((f) => f.localizacao?.dispositivo?.endsWith(`item ${r.itemOficial}`) || f.dispositivo?.endsWith(`item ${r.itemOficial}`));
  if (!ok && semEvidenciaItem++ < 5) console.log(`      regra[${i}] itemOficial ${r.itemOficial}: sem evidência correspondente`);
});
const comItem = v2.regras.filter((r) => "itemOficial" in r).length;
conferir(semEvidenciaItem === 0 && comItem === ESPERADO.comItemOficial, `itemOficial em ${comItem} regras, cada um com fato da lei que cobre o NCM no mesmo item (${semEvidenciaItem} sem evidência)`);
conferir(evid.regras.every((x) => x.itemOficial === null || x.itemOficial === x.itensOficiais[0]) && evid.regras.filter((x) => x.itensOficiais.length > 1).every((x) => x.itemOficial === null),
  "vários itens oficiais possíveis: nenhum escolhido (itemOficial nulo, itens registrados)");
// Fontes: as da Etapa 4, com os hashes conferidos no disco
conferir(["F1", "F2"].every((f) => {
  const e = evid.fontes[f], a = porId.get(`${f}.html`);
  return e.sha256 === a.sha256 && e.arquivo === a.caminho && e.url === registros[f].url && e.versao === registros[f].versao && e.dataConsulta === registros[f].dataConsulta && sha(fs.readFileSync(a.caminho)) === a.sha256;
}), "fontes da evidência = registro de fontes (URL, arquivo, versão, data) e SHA-256 conferido no disco");
// Vínculos de código da Etapa 5.3: sem duplicar a Etapa 5; fatos reencontrados nas fontes
const idsCodigo = [...vinc.codigo, ...evid.codigo].map((x) => x.id);
conferir(new Set(idsCodigo).size === idsCodigo.length, `vínculos de código sem duplicata: ${vinc.codigo.length} da Etapa 5 + ${evid.codigo.length} da Etapa 5.3`);
conferir(evid.codigo.every((x) => !(x.cClassTrib in ESCOPO)) && evid.codigo.length === ESPERADO.vinculosCodigoEtapa53, `Etapa 5.3 não repete ${Object.keys(ESCOPO).join("/")}: ${evid.codigo.length} vínculos`);
const codigos53 = [...new Set(evid.codigo.map((x) => x.cClassTrib))];
conferir(JSON.stringify([...Object.keys(ESCOPO), ...codigos53].sort()) === JSON.stringify(Object.keys(v2.catalogoCodigos).sort()) &&
  codigos53.every((c) => JSON.stringify(evid.codigo.filter((x) => x.cClassTrib === c).map((x) => x.campoRegra)) === JSON.stringify(CAMPOS_CODIGO)),
  `os 12 códigos com vínculo de código: ${Object.keys(ESCOPO).length} da Etapa 5 + ${codigos53.length} da Etapa 5.3 (${CAMPOS_CODIGO.join(", ")})`);
const cls = (cod) => leitorF2.classificacao(cod);
let fatos53Ruins = 0;
for (const x of evid.codigo) {
  if (!x.alcance.every(refOk) || x.alcance.length !== v2.regras.filter((r) => r.cClassTrib === x.cClassTrib).length) { if (fatos53Ruins++ < 5) console.log(`      ${x.id}: alcance não confere`); }
  for (const f of x.fatos) {
    const a = porId.get(f.arquivo);
    const meta = a && a.sha256 === f.sha256 && registros[f.fonte].versao === f.versao && registros[f.fonte].dataConsulta === f.dataConsulta;
    const conteudo = f.fonte === "F1" ? leitorF1.textoVigente.split("\n").includes(f.trecho) : JSON.stringify(cls(x.cClassTrib)?.[f.localizacao.campo]) === JSON.stringify(f.valor);
    if ((!meta || !conteudo) && fatos53Ruins++ < 5) console.log(`      ${x.id}: fato ${f.fonte} não confere com a fonte`);
  }
}
conferir(fatos53Ruins === 0, `fatos dos vínculos de código da Etapa 5.3 reencontrados nas fontes: ${evid.codigo.flatMap((x) => x.fatos).length}`);
// Evidência das regras: 200033/200043 só referenciam a Etapa 5; as demais trazem os fatos, que apontam para o SVRS registrado
conferir(evid.regras.every((x) => (x.cClassTrib in ESCOPO)
  ? vincPorId.get(x.vinculoEtapa5)?.regra.indice === x.indice && !("fatosF1" in x) && !("fatosF2" in x)
  : !("vinculoEtapa5" in x) && Array.isArray(x.fatosF1) && Array.isArray(x.fatosF2)), "200033/200043 referenciam o vínculo da Etapa 5 (sem cópia); demais regras trazem fatos da lei e do SVRS");
let f2Ruins = 0;
for (const x of evid.regras.filter((y) => !(y.cClassTrib in ESCOPO))) {
  for (const f of x.fatosF2) {
    const e = (cls(x.cClassTrib)?.Anexos ?? []).find((a) => a.CodIntProdServ === f.CodIntProdServ);
    if ((!e || e.CodNcmNbs !== x.ncm || e.TipoPermissao !== f.TipoPermissao || e.DescItemAnexo !== f.DescItemAnexo) && f2Ruins++ < 5) console.log(`      regra[${x.indice}]: entrada do SVRS ${f.CodIntProdServ} não confere`);
  }
  if (x.fatosF1.some((f) => !f.dispositivo?.startsWith("LC 214/2025, Anexo") || typeof f.trecho !== "string") && f2Ruins++ < 5) console.log(`      regra[${x.indice}]: fato da lei sem dispositivo/trecho`);
}
conferir(f2Ruins === 0, "fatos das evidências de regra: entradas do SVRS reencontradas no F2.html; fatos da lei com dispositivo e trecho");
// Status e D3: os da auditoria oficial, sem lógica nova
const porIndiceAud = new Map(aud.regras.map((a) => [a.indice, a]));
conferir(evid.regras.every((x) => {
  const a = porIndiceAud.get(x.indice);
  return a && x.statusAuditoria === a.status && x.statusOficial === (a.situacaoNcmSvrs === "VEDADO" ? "VEDADO" : a.status) && x.vinculoNcmItemConfirmado === (a.status === "CONFIRMADA");
}), "status oficial e vínculo NCM × item (D3) iguais aos da auditoria oficial");
const ps = contar(evid.regras, (x) => x.statusOficial);
conferir(igual(ps, ESPERADO.evidenciasPorStatus), `evidências por status oficial: ${JSON.stringify(ps)}`);

console.log(falhas ? `\n${falhas} falha(s).` : "\nTodas as conferências passaram.");
process.exit(falhas ? 1 : 0);
