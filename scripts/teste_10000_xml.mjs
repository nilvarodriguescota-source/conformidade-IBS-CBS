/**
 * Teste de capacidade: 10.000 XMLs num único "Adicionar XMLs" + "Processar análise", pelo fluxo normal do servidor.
 *
 * - Gera 10.000 XMLs a partir de modelos reais (analise-atual/xmls), trocando só a chave de acesso e o nNF
 *   (cada cópia é uma nota diferente); nada mais do XML muda.
 * - Envia os 10.000 de uma vez para /api/importar, processa com /api/processar e confere contagens,
 *   ausência de duplicação/perda e que cada cópia tem exatamente os mesmos vereditos do seu modelo.
 * - Com ANTIGO_DIST=<pasta dist da versão anterior>, confere que a versão anterior recusa os 10.000 e que os
 *   modelos analisados por ela dão os mesmos vereditos que na versão nova.
 *
 * Uso: node scripts/teste_10000_xml.mjs   (depois de npm run build)
 */
import { spawn } from "node:child_process";
import { mkdtempSync, readFileSync, readdirSync, symlinkSync, copyFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const RAIZ = resolve(".");
const TOTAL = 10000, MODELOS = 50;
const ok = (cond, msg) => { if (!cond) { console.error("FALHOU:", msg); process.exitCode = 1; throw new Error(msg); } console.log("OK  ", msg); };

function pastaDeTeste() {
  const d = mkdtempSync(join(tmpdir(), "teste10000-"));
  for (const n of ["data", "docs", "public"]) symlinkSync(join(RAIZ, n), join(d, n));
  copyFileSync(join(RAIZ, "empresa.json"), join(d, "empresa.json"));
  return d;
}
async function subirServidor(dist, cwd, porta) {
  const p = spawn(process.execPath, ["--max-old-space-size=4096", join(dist, "src", "servidor.js")], { cwd, env: { ...process.env, PORT: String(porta) }, stdio: ["ignore", "pipe", "pipe"] });
  await new Promise((res, rej) => { p.stdout.on("data", (b) => /iniciado/.test(String(b)) && res()); p.on("exit", () => rej(new Error("servidor encerrou"))); });
  return p;
}
async function enviar(porta, arquivos) {
  const form = new FormData();
  for (const a of arquivos) form.append("arquivos", new Blob([a.conteudo], { type: "text/xml" }), a.nome);
  const r = await fetch(`http://localhost:${porta}/api/importar`, { method: "POST", body: form });
  const texto = await r.text();
  let json = null; try { json = JSON.parse(texto); } catch { /* resposta de erro em HTML */ }
  return { status: r.status, json, texto };
}
const processar = (porta) => fetch(`http://localhost:${porta}/api/processar`, { method: "POST" }).then((r) => r.json());
const obter = (porta, rota) => fetch(`http://localhost:${porta}${rota}`).then((r) => r.json());
const semDoc = (v) => { const { documento: _d, calculadoEm: _c, ...resto } = v; return JSON.stringify(resto); };

// Modelos: XMLs de NFC-e reais que viram documento de venda (sem eventos de cancelamento)
const pastaModelos = join(RAIZ, "analise-atual", "xmls");
const candidatos = readdirSync(pastaModelos).filter((f) => /^\d{44}\.xml$/.test(f)).sort();
const cancelados = new Set(readdirSync(pastaModelos).filter((f) => f.includes("-Cancelamento")).map((f) => f.slice(0, 44)));
const modelos = candidatos.filter((f) => !cancelados.has(f.slice(0, 44))).slice(0, MODELOS).map((f) => ({ chave: f.slice(0, 44), conteudo: readFileSync(join(pastaModelos, f), "utf8") }));
ok(modelos.length === MODELOS, `${MODELOS} XMLs reais escolhidos como modelo`);

// 10.000 cópias: chave nova (nNF = posições 26 a 34 da chave) e <nNF> novo; o resto do XML é idêntico
const copias = [];
for (let i = 0; i < TOTAL; i++) {
  const m = modelos[i % MODELOS];
  const nNF = String(900000000 + i).slice(-9);
  const chave = m.chave.slice(0, 25) + nNF + m.chave.slice(34);
  copias.push({ nome: `${chave}.xml`, chave, modelo: m.chave, conteudo: m.conteudo.split(m.chave).join(chave).replace(/<nNF>\d+<\/nNF>/, `<nNF>${Number(nNF)}</nNF>`) });
}
ok(new Set(copias.map((c) => c.chave)).size === TOTAL, `${TOTAL} XMLs gerados, todos com chave diferente`);

// Versão nova
const dirNovo = pastaDeTeste();
const novo = await subirServidor(join(RAIZ, "dist"), dirNovo, 3310);
try {
  let t = Date.now();
  const env = await enviar(3310, copias);
  ok(env.status === 200 && env.json?.adicionados === TOTAL, `envio único: ${env.json?.adicionados} de ${TOTAL} XMLs recebidos (${((Date.now() - t) / 1000).toFixed(1)} s)`);
  ok(env.json.aguardando === TOTAL, `${env.json.aguardando} XMLs aguardando processamento`);
  const nomesRecebidos = readdirSync(join(dirNovo, "analise-atual", "aguardando")).sort();
  ok(JSON.stringify(nomesRecebidos) === JSON.stringify(copias.map((c) => c.nome).sort()), "os arquivos gravados são exatamente os enviados (sem perda, sem duplicação)");
  t = Date.now();
  const proc = await processar(3310);
  ok(proc.xmls === TOTAL, `processamento: ${proc.xmls} XMLs processados (${((Date.now() - t) / 1000).toFixed(1)} s)`);
  ok(proc.documentos === TOTAL, `${proc.documentos} documentos analisados`);
  const analise = await obter(3310, "/api/analise");
  ok(analise.processados === TOTAL && analise.resumo.documentos === TOTAL, `/api/analise: ${analise.processados} XMLs, ${analise.resumo.documentos} documentos, ${analise.resumo.itens} itens`);
  const vereditos = await obter(3310, "/api/resultados");
  const porDoc = new Map();
  for (const v of vereditos) porDoc.set(v.documento, [...(porDoc.get(v.documento) ?? []), v]);
  ok(porDoc.size === TOTAL, `resultados gerados para ${porDoc.size} documentos`);
  const chaves = new Set(copias.map((c) => c.chave));
  ok([...porDoc.keys()].every((k) => chaves.has(k)), "todo resultado pertence a um XML enviado");
  const itensUnicos = new Set(vereditos.map((v) => `${v.documento}|${v.nItem}`));
  ok(itensUnicos.size === vereditos.length, `${vereditos.length} vereditos, nenhum item duplicado`);

  // Mesmo XML, mesmo resultado: cada cópia tem os vereditos do seu modelo (fora a chave do documento)
  const porModelo = new Map();
  for (const c of copias) {
    const vs = porDoc.get(c.chave).map(semDoc).sort().join("\n");
    if (!porModelo.has(c.modelo)) porModelo.set(c.modelo, vs);
    else if (porModelo.get(c.modelo) !== vs) ok(false, `cópia ${c.chave} com resultado diferente das demais do modelo ${c.modelo}`);
  }
  ok(true, `as ${TOTAL} notas têm resultado idêntico ao das demais cópias do mesmo XML modelo`);

  // Versão anterior (opcional): recusa 10.000 e dá o mesmo resultado para os modelos
  if (process.env.ANTIGO_DIST) {
    const dirAntigo = pastaDeTeste();
    const antigo = await subirServidor(resolve(process.env.ANTIGO_DIST), dirAntigo, 3311);
    try {
      const recusa = await enviar(3311, copias);
      ok(recusa.status !== 200, `versão anterior recusa ${TOTAL} XMLs (HTTP ${recusa.status}: ${/Unexpected field|LIMIT/i.exec(recusa.texto)?.[0] ?? "erro"})`);
      const envM = await enviar(3311, modelos.map((m) => ({ nome: `${m.chave}.xml`, conteudo: m.conteudo })));
      ok(envM.status === 200 && envM.json.adicionados === MODELOS, `versão anterior recebe os ${MODELOS} modelos`);
      await processar(3311);
      const vAnt = await obter(3311, "/api/resultados");
      const antPorDoc = new Map();
      for (const v of vAnt) antPorDoc.set(v.documento, [...(antPorDoc.get(v.documento) ?? []), v]);
      for (const m of modelos) {
        const antes = (antPorDoc.get(m.chave) ?? []).map(semDoc).sort().join("\n");
        if (antes !== porModelo.get(m.chave)) ok(false, `modelo ${m.chave}: resultado diferente da versão anterior`);
      }
      ok(true, `os ${MODELOS} XMLs modelo dão o mesmo resultado na versão anterior e na nova`);
    } finally { antigo.kill(); rmSync(dirAntigo, { recursive: true, force: true }); }
  }
} finally {
  novo.kill();
  rmSync(dirNovo, { recursive: true, force: true });
}
console.log(process.exitCode ? "RESULTADO: FALHOU" : "RESULTADO: TODOS OS CONTROLES PASSARAM");
