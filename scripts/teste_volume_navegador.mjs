/**
 * Teste de capacidade da versão publicada (sistema.html, que roda no navegador, em Web Worker):
 * "Adicionar XMLs" + "Processar análise" + "Nova análise (limpar dados)" pela própria tela, com
 * 1.400, 4.000, 6.000, 8.000 e 10.000 XMLs, num Chromium de verdade.
 *
 * - Gera os XMLs a partir de 2.000 notas reais diferentes (analise-atual/xmls; MODELOS=n muda a
 *   quantidade), trocando só a chave de acesso e o nNF (cada cópia é uma nota diferente); nada mais
 *   do XML muda.
 * - O login e o banco (Supabase) são simulados na rede: a sessão fica no localStorage e as chamadas
 *   de assinatura e de limite de XMLs respondem "liberado". O resto é o site como publicado.
 * - Para cada volume confere: arquivos recebidos e processados, documentos e itens, resultados na
 *   tela, nenhuma perda ou duplicação, mesmo resultado das cópias de cada modelo em todos os
 *   volumes, e que a limpeza apaga tudo (memória do worker e IndexedDB) antes de avisar na tela.
 * - No fim: limpar e processar de novo depois do maior volume, "Nova análise" no meio de um
 *   processamento (tem de interromper e limpar) e limpeza de XMLs carregados e não processados.
 *
 * Uso: node scripts/teste_volume_navegador.mjs [volumes]     (depois de npm run build)
 *      ex.: node scripts/teste_volume_navegador.mjs 1400,10000
 * Precisa do Playwright com Chromium instalado (não é dependência do projeto).
 */
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const RAIZ = resolve(".");
const PORTA = 4390;
const MODELOS = Number(process.env.MODELOS ?? 2000);
const VOLUMES = (process.argv[2] ?? "1400,4000,6000,8000,9499,10000").split(",").map(Number);
const LIMITE_MS = Number(process.env.LIMITE_MS ?? 15 * 60 * 1000);
const SUPABASE = "https://diydqdrycltsghqilryv.supabase.co";

const falhas = [];
const ok = (cond, msg) => {
  if (!cond) { falhas.push(msg); console.error("  FALHOU:", msg); throw new Error(msg); }
  console.log("  OK  ", msg);
};
const seg = (ms) => (ms / 1000).toFixed(1) + " s";

// ---------- XMLs de teste ----------
const pastaModelos = join(RAIZ, "analise-atual", "xmls");
const nomesModelos = readdirSync(pastaModelos);
const cancelados = new Set(nomesModelos.filter((f) => f.includes("-Cancelamento")).map((f) => f.slice(0, 44)));
const modelos = nomesModelos.filter((f) => /^\d{44}\.xml$/.test(f) && !cancelados.has(f.slice(0, 44))).sort().slice(0, MODELOS)
  .map((f) => ({ chave: f.slice(0, 44), conteudo: readFileSync(join(pastaModelos, f), "utf8") }));
if (modelos.length !== MODELOS) throw new Error("faltam XMLs modelo em analise-atual/xmls");

const pastaTeste = mkdtempSync(join(tmpdir(), "volume-navegador-"));
function gerar(total) {
  const pasta = join(pastaTeste, String(total));
  mkdirSync(pasta, { recursive: true });
  const copias = [];
  for (let i = 0; i < total; i++) {
    const m = modelos[i % MODELOS];
    const nNF = String(900000000 + i).slice(-9);
    const chave = m.chave.slice(0, 25) + nNF + m.chave.slice(34);
    const caminho = join(pasta, `${chave}.xml`);
    writeFileSync(caminho, m.conteudo.split(m.chave).join(chave).replace(/<nNF>\d+<\/nNF>/, `<nNF>${Number(nNF)}</nNF>`));
    copias.push({ chave, modelo: m.chave, caminho });
  }
  return copias;
}

// ---------- site e navegador ----------
const site = spawn(process.execPath, [join(RAIZ, "scripts", "servir-site.mjs")], { env: { ...process.env, PORTA_SITE: String(PORTA) }, stdio: ["ignore", "pipe", "inherit"] });
await new Promise((res, rej) => { site.stdout.on("data", (b) => /Site em/.test(String(b)) && res()); site.on("exit", () => rej(new Error("o servidor do site encerrou"))); });

const navegador = await chromium.launch();
const contexto = await navegador.newContext();
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const expira = Math.floor(Date.now() / 1000) + 24 * 3600;
const usuario = { id: "00000000-0000-4000-8000-000000000001", aud: "authenticated", role: "authenticated", email: "teste@exemplo.com.br", app_metadata: {}, user_metadata: { nome: "Teste" }, created_at: "2026-01-01T00:00:00Z" };
const sessao = {
  access_token: `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: usuario.id, email: usuario.email, role: "authenticated", aud: "authenticated", exp: expira })}.assinatura`,
  refresh_token: "teste", token_type: "bearer", expires_in: 24 * 3600, expires_at: expira, user: usuario,
};
await contexto.addInitScript(([chave, valor]) => localStorage.setItem(chave, valor), [`sb-${new URL(SUPABASE).hostname.split(".")[0]}-auth-token`, JSON.stringify(sessao)]);

let notasContadas = null;
await contexto.route(`${SUPABASE}/**`, async (rota) => {
  const pedido = rota.request();
  const url = new URL(pedido.url());
  const cors = { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" };
  if (pedido.method() === "OPTIONS") return rota.fulfill({ status: 204, headers: cors });
  if (url.pathname.endsWith("/rest/v1/assinaturas")) {
    return rota.fulfill({ status: 200, headers: cors, contentType: "application/json", body: JSON.stringify({ email: usuario.email, plano_id: "premium", ciclo: "mensal", status: "ativa", criada_em: "2026-01-01T00:00:00Z", inicio_periodo: "2026-01-01T00:00:00Z", fim_periodo: "2099-01-01T00:00:00Z", cancelada_em: null, forma_pagamento: "cartao", origem: "manual", kiwify_assinatura_id: null }) });
  }
  if (url.pathname.endsWith("/rpc/registrar_uso_xmls")) {
    notasContadas = pedido.postDataJSON().documentos;
    return rota.fulfill({ status: 200, headers: cors, contentType: "application/json", body: JSON.stringify({ permitido: true, mes: "2026-11", usados: notasContadas.length, novos: notasContadas.length, limite: null }) });
  }
  return rota.fulfill({ status: 200, headers: cors, contentType: "application/json", body: "{}" });
});

const pagina = await contexto.newPage();
pagina.setDefaultTimeout(LIMITE_MS);
let quebrou = null;
pagina.on("crash", () => { quebrou = "a página travou (crash)"; });
pagina.on("pageerror", (e) => console.error("  [erro na página]", e.message));
pagina.on("console", (m) => { if (m.type() === "error") console.error("  [console]", m.text().slice(0, 900)); });
pagina.on("dialog", (d) => d.accept());

const texto = (id) => pagina.locator(`#${id}`).innerText();
const api = (rota) => pagina.evaluate(async (r) => (await fetch(r)).json(), rota);
/** Espera o texto de #status casar com o esperado; falha se aparecer "Erro:" ou a página travar. */
async function esperarStatus(padrao, oQue) {
  const inicio = Date.now();
  for (;;) {
    if (quebrou) throw new Error(`${oQue}: ${quebrou}`);
    const s = await texto("status").catch(() => "");
    if (padrao.test(s)) return Date.now() - inicio;
    if (/^Erro:/.test(s)) throw new Error(`${oQue}: ${s}`);
    if (Date.now() - inicio > LIMITE_MS) throw new Error(`${oQue}: não terminou em ${seg(LIMITE_MS)} (status: "${s}")`);
    await new Promise((r) => setTimeout(r, 250));
  }
}
/** O que ficou guardado no navegador (IndexedDB), por pasta. */
const guardado = () => pagina.evaluate(() => new Promise((res, rej) => {
  const p = indexedDB.open("conformidade-ibs-cbs");
  p.onerror = () => rej(p.error);
  p.onsuccess = () => {
    const banco = p.result;
    if (!banco.objectStoreNames.contains("arquivos")) { banco.close(); return res({ total: 0, xmls: 0, saida: 0 }); }
    const pedido = banco.transaction("arquivos").objectStore("arquivos").getAllKeys();
    pedido.onerror = () => rej(pedido.error);
    pedido.onsuccess = () => {
      const chaves = pedido.result.map(String);
      banco.close();
      res({
        total: chaves.length,
        xmls: chaves.filter((k) => /^\/app\/(analise-atual\/(xmls|aguardando)|uploads)\/./.test(k)).length,
        saida: chaves.filter((k) => k.startsWith("/app/saida-teste/")).length,
        sobras: chaves.filter((k) => /^\/app\/(saida-teste|uploads|tmp)\/./.test(k) || k.startsWith("/tmp/")).slice(0, 5),
      });
    };
  };
}));
const memoria = async () => {
  const s = await contexto.newCDPSession(pagina);
  await s.send("HeapProfiler.collectGarbage");
  const { usedSize } = await s.send("Runtime.getHeapUsage");
  await s.detach();
  return Math.round(usedSize / 1048576);
};
async function limpar(rotulo) {
  const t = Date.now();
  await pagina.getByRole("button", { name: /Nova análise/ }).click();
  await esperarStatus(/Nova análise iniciada/, "limpeza");
  const d = Date.now() - t;
  const analise = await api("/api/analise");
  const g = await guardado();
  ok(analise.processados === 0 && analise.aguardando === 0 && !analise.processada && analise.respostas === 0, `${rotulo}: limpeza concluída em ${seg(d)} — análise vazia (0 XMLs, sem resultados)`);
  ok(g.xmls === 0 && g.saida === 0, `${rotulo}: nada ficou guardado no navegador (IndexedDB: ${g.xmls} XMLs, ${g.saida} arquivos de resultado${g.sobras.length ? ": " + g.sobras.join(", ") : ""})`);
  ok((await api("/api/resultados")).length === 0, `${rotulo}: resultados apagados`);
  ok(/Análise vazia/.test(await texto("resumoAnalise")), `${rotulo}: tela de volta ao estado inicial`);
  return d;
}

/** modelo → resumo dos vereditos das cópias dele, do primeiro volume: os demais volumes têm de dar o mesmo. */
const referencia = new Map();
const tabela = [];

async function rodar(total, repeticao = "") {
  const rotulo = `${total.toLocaleString("pt-BR")} XMLs${repeticao}`;
  console.log(`\n== ${rotulo} ==`);
  const copias = gerar(total);
  notasContadas = null;

  let t = Date.now();
  await pagina.locator("#arquivos").setInputFiles(copias.map((c) => c.caminho));
  await pagina.locator("#btnAdicionar").click();
  // A tela mostra o andamento ("Carregando XMLs... N de total") até terminar
  let andamento = 0;
  const vigiar = setInterval(async () => { if (/Carregando XMLs\.\.\. [\d.]+ de/.test(await texto("status").catch(() => ""))) andamento++; }, 300);
  await esperarStatus(/adicionado\(s\) à análise atual/, "carregar XMLs").finally(() => clearInterval(vigiar));
  const tCarga = Date.now() - t;
  if (total > 1000) ok(andamento > 0, "andamento do carregamento mostrado na tela");
  let analise = await api("/api/analise");
  ok(analise.aguardando === total && analise.processados === 0, `carga: ${analise.aguardando} de ${total} XMLs recebidos (${seg(tCarga)})`);

  t = Date.now();
  await pagina.locator("#btnProcessar").click();
  await esperarStatus(/^$/, "processar análise");
  await pagina.waitForFunction(() => /Processamento concluído/.test(document.getElementById("resumoAnalise").textContent ?? ""));
  const tProc = Date.now() - t;
  analise = await api("/api/analise");
  ok(analise.processados === total && analise.aguardando === 0 && analise.processada, `processamento concluído: ${analise.processados} de ${total} XMLs processados (${seg(tProc)})`);
  ok(analise.resumo.documentos === total, `${analise.resumo.documentos} documentos analisados, ${analise.resumo.itens} itens`);
  ok(notasContadas?.length === total && new Set(notasContadas).size === total, `limite do plano: ${notasContadas?.length} notas contadas, sem repetição`);

  // Resultados como a tela os lê (buscarResultados é a função da própria página); o resumo de cada nota é calculado lá
  const lidos = await pagina.evaluate(async () => {
    const rs = await buscarResultados();
    const porDoc = new Map();
    for (const v of rs) {
      const { documento, calculadoEm: _c, ...resto } = v;
      if (!porDoc.has(documento)) porDoc.set(documento, []);
      porDoc.get(documento).push(JSON.stringify(resto));
    }
    const docs = [];
    for (const [doc, itens] of porDoc) {
      const bytes = new TextEncoder().encode(itens.sort().join("\n"));
      const h = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes));
      docs.push([doc, [...h].map((b) => b.toString(16).padStart(2, "0")).join("")]);
    }
    return {
      itens: rs.length,
      itensUnicos: new Set(rs.map((v) => `${v.documento}|${v.nItem}`)).size,
      comExibicao: rs.filter((v) => "reducaoExibicao" in v && v.auditoriaExibicao && v.lacunasDeCobertura && v.bloqueiosExibicao).length,
      docs,
    };
  });
  const porDoc = new Map(lidos.docs);
  const chaves = new Set(copias.map((c) => c.chave));
  ok(porDoc.size === total && [...porDoc.keys()].every((k) => chaves.has(k)), `resultados para ${porDoc.size} documentos, todos de XMLs enviados (sem perda)`);
  ok(lidos.itensUnicos === lidos.itens && lidos.itens === analise.resumo.itens, `${lidos.itens} vereditos, nenhum item duplicado`);
  ok(lidos.comExibicao === lidos.itens, "todos os itens com redução, conferência com as fontes, lacunas e bloqueios");
  for (const c of copias) {
    const r = porDoc.get(c.chave);
    if (!referencia.has(c.modelo)) referencia.set(c.modelo, r);
    else if (referencia.get(c.modelo) !== r) ok(false, `nota ${c.chave}: resultado diferente das demais cópias do modelo ${c.modelo}`);
  }
  ok(true, "cada nota tem o mesmo resultado das outras cópias do seu XML modelo (igual entre os volumes)");

  // Resultados na tela: resumo, painel, resultados e pendências
  await pagina.waitForFunction(() => document.querySelectorAll("#resumoProcessamento .metric").length > 0);
  const cartoes = await pagina.locator("#resumoProcessamento .metric").evaluateAll((els) => els.slice(0, 3).map((e) => e.innerText.replace(/\s+/g, " ")));
  ok(cartoes[0]?.includes(String(total)), `tela Análise mostra o resumo (${cartoes.join(" | ")})`);
  const alertas = await api("/api/alertas");
  const dash = await api("/api/dashboard");
  ok(Array.isArray(dash.vereditos) && dash.vereditos.length === lidos.itens && Object.keys(dash.indicadores).length > 0, `painel com indicadores e ${dash.vereditos.length} itens; alertas ${alertas.disponivel === false ? "indisponíveis: " + alertas.motivo : "disponíveis"}`);
  ok(alertas.disponivel !== false, "explicações e alertas gerados");

  const antes = await guardado();
  ok(antes.xmls === total, `análise guardada no navegador: ${antes.xmls} XMLs`);
  const memAntes = await memoria();
  const tLimpar = await limpar(rotulo);
  const memDepois = await memoria();
  tabela.push({ volume: rotulo, carga: seg(tCarga), processamento: seg(tProc), total: seg(tCarga + tProc), limpeza: seg(tLimpar), documentos: analise.resumo.documentos, itens: analise.resumo.itens });
  console.log(`  memória da página: ${memAntes} MB antes da limpeza, ${memDepois} MB depois`);
  rmSync(join(pastaTeste, String(total)), { recursive: true, force: true });
}

try {
  await pagina.goto(`http://localhost:${PORTA}/sistema.html`);
  await pagina.waitForFunction(() => /Análise vazia|aguardando|concluído|resultado/.test(document.getElementById("resumoAnalise")?.textContent ?? ""));
  ok(pagina.url().endsWith("/sistema.html"), "sistema aberto com a assinatura conferida");
  await limpar("início");

  for (const total of VOLUMES) await rodar(total);

  // Limpar e processar de novo, depois do maior volume, sem recarregar a página
  const maior = Math.max(...VOLUMES);
  await rodar(Math.min(1400, maior), " (de novo, depois do maior volume)");
  await rodar(maior, " (segunda vez)");

  // Nova análise pedida no meio do processamento do maior volume: interrompe, limpa e deixa processar de novo
  console.log("\n== nova análise durante o processamento ==");
  {
    const copias = gerar(maior);
    await pagina.locator("#arquivos").setInputFiles(copias.map((c) => c.caminho));
    await pagina.locator("#btnAdicionar").click();
    await esperarStatus(/adicionado\(s\) à análise atual/, "carregar XMLs");
    await pagina.locator("#btnProcessar").click();
    await new Promise((r) => setTimeout(r, 3000));
    ok(/Processando/.test(await texto("status")), `processamento de ${maior} XMLs em andamento`);
    const d = await limpar("durante o processamento");
    ok(d < 30000, `processamento interrompido e dados apagados em ${seg(d)}`);
    rmSync(join(pastaTeste, String(maior)), { recursive: true, force: true });
    await rodar(Math.min(1400, maior), " (depois da interrupção)");
  }

  // Processamento que deixa de responder: o vigia encerra o worker e a tela mostra o erro, sem ficar
  // carregando para sempre; depois disso o sistema continua funcionando
  console.log("\n== processamento que deixa de responder ==");
  {
    const copias = gerar(maior);
    await pagina.locator("#arquivos").setInputFiles(copias.map((c) => c.caminho));
    await pagina.locator("#btnAdicionar").click();
    await esperarStatus(/adicionado\(s\) à análise atual/, "carregar XMLs");
    await pagina.evaluate(() => { globalThis.__vigiaDoWorkerMs = 5000; });
    await pagina.locator("#btnProcessar").click();
    const t = Date.now();
    let s = "";
    while (Date.now() - t < 60000 && !/^Erro:/.test(s)) { await new Promise((r) => setTimeout(r, 500)); s = await texto("status"); }
    await pagina.evaluate(() => { delete globalThis.__vigiaDoWorkerMs; });
    ok(/parou de responder/.test(s), `sem resposta do processamento: a tela mostra o erro em ${seg(Date.now() - t)} ("${s.slice(0, 90)}...")`);
    ok(await pagina.locator("#btnAdicionar").isEnabled(), "botões liberados depois do erro");
    rmSync(join(pastaTeste, String(maior)), { recursive: true, force: true });
    await limpar("depois do vigia");
    await rodar(Math.min(1400, maior), " (depois do vigia)");
  }

  // Limpeza pedida com XMLs só carregados (sem processar) e logo depois de recarregar a página
  console.log("\n== limpeza com XMLs carregados e não processados ==");
  const copias = gerar(2000);
  await pagina.locator("#arquivos").setInputFiles(copias.map((c) => c.caminho));
  await pagina.locator("#btnAdicionar").click();
  await esperarStatus(/adicionado\(s\) à análise atual/, "carregar XMLs");
  await pagina.reload();
  await pagina.waitForFunction(() => /aguardando processamento/.test(document.getElementById("resumoAnalise")?.textContent ?? ""));
  ok((await api("/api/analise")).aguardando === 2000, "depois de recarregar a página, os 2.000 XMLs continuam aguardando");
  await limpar("XMLs não processados");
  await pagina.reload();
  await pagina.waitForFunction(() => /Análise vazia/.test(document.getElementById("resumoAnalise")?.textContent ?? ""));
  ok((await api("/api/analise")).aguardando === 0, "depois de limpar e recarregar a página, a análise continua vazia");
} catch (erro) {
  if (!falhas.length) { falhas.push(String(erro?.message ?? erro)); console.error("  FALHOU:", erro?.message ?? erro); }
} finally {
  await navegador.close().catch(() => undefined);
  site.kill();
  rmSync(pastaTeste, { recursive: true, force: true });
}

console.table(tabela);
console.log(falhas.length ? `RESULTADO: FALHOU (${falhas.join("; ")})` : "RESULTADO: TODOS OS CONTROLES PASSARAM");
process.exitCode = falhas.length ? 1 : 0;
