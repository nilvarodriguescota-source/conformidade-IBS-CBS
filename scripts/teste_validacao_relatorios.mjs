/**
 * Teste da validação em Pendências e do Relatório Final na versão publicada (sistema.html, no navegador), num
 * Chromium de verdade, com N XMLs (padrão: 1.400 e 10.000).
 *
 * Confere:
 *  - escolha marcada na hora (sem esperar a gravação) e gravada em seguida, em vários produtos seguidos;
 *  - troca de uma escolha já feita; cliques repetidos não geram gravações duplicadas;
 *  - duas escolhas seguidas no mesmo produto: vale a última, também depois de recarregar;
 *  - busca da lista que chega depois de um clique (resposta fora de ordem) não desmarca o clique;
 *  - falha de comunicação: a tela mostra o erro, volta para a última escolha gravada, e a nova tentativa grava;
 *  - escolhas mantidas ao trocar de aba e ao recarregar a página (seção "Validados nesta análise");
 *  - Relatório Final nas 4 modalidades e nas 3 exportações (CSV, Excel, PDF), atualizado com as escolhas:
 *    produtos validados saem de "Sem validação" e "Corretos validados" só traz produtos validados;
 *  - falha ao atualizar os resultados antes do relatório: mensagem específica, e a nova tentativa gera o relatório.
 *
 * Login e banco (Supabase) são simulados na rede, como em teste_volume_navegador.mjs.
 * Uso: node scripts/teste_validacao_relatorios.mjs [volumes]   (depois de npm run build; precisa do Playwright)
 */
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");

const RAIZ = resolve(".");
const PORTA = 4391;
const MODELOS = 2000;
const VOLUMES = (process.argv[2] ?? "1400,10000").split(",").map(Number);
const LIMITE_MS = 15 * 60 * 1000;
const SUPABASE = "https://diydqdrycltsghqilryv.supabase.co";

const falhas = [];
const ok = (cond, msg) => {
  if (!cond) { falhas.push(msg); console.error("  FALHOU:", msg); throw new Error(msg); }
  console.log("  OK  ", msg);
};
const seg = (ms) => (ms / 1000).toFixed(1) + " s";
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));

// ---------- XMLs ----------
const pastaModelos = join(RAIZ, "analise-atual", "xmls");
const nomes = readdirSync(pastaModelos);
const cancelados = new Set(nomes.filter((f) => f.includes("-Cancelamento")).map((f) => f.slice(0, 44)));
const modelos = nomes.filter((f) => /^\d{44}\.xml$/.test(f) && !cancelados.has(f.slice(0, 44))).sort().slice(0, MODELOS)
  .map((f) => ({ chave: f.slice(0, 44), conteudo: readFileSync(join(pastaModelos, f), "utf8") }));
const pastaTeste = mkdtempSync(join(tmpdir(), "validacao-relatorios-"));
function gerar(total) {
  const pasta = join(pastaTeste, String(total));
  mkdirSync(pasta, { recursive: true });
  return Array.from({ length: total }, (_, i) => {
    const m = modelos[i % modelos.length];
    const nNF = String(900000000 + i).slice(-9);
    const chave = m.chave.slice(0, 25) + nNF + m.chave.slice(34);
    const caminho = join(pasta, `${chave}.xml`);
    writeFileSync(caminho, m.conteudo.split(m.chave).join(chave).replace(/<nNF>\d+<\/nNF>/, `<nNF>${Number(nNF)}</nNF>`));
    return caminho;
  });
}

// ---------- site, login simulado e navegador ----------
const site = spawn(process.execPath, [join(RAIZ, "scripts", "servir-site.mjs")], { env: { ...process.env, PORTA_SITE: String(PORTA) }, stdio: ["ignore", "pipe", "inherit"] });
await new Promise((res, rej) => { site.stdout.on("data", (b) => /Site em/.test(String(b)) && res()); site.on("exit", () => rej(new Error("o servidor do site encerrou"))); });
const navegador = await chromium.launch();
const contexto = await navegador.newContext({ acceptDownloads: true });
const b64 = (o) => Buffer.from(JSON.stringify(o)).toString("base64url");
const expira = Math.floor(Date.now() / 1000) + 24 * 3600;
const usuario = { id: "00000000-0000-4000-8000-000000000001", aud: "authenticated", role: "authenticated", email: "teste@exemplo.com.br", app_metadata: {}, user_metadata: { nome: "Teste" }, created_at: "2026-01-01T00:00:00Z" };
await contexto.addInitScript(([chave, valor]) => localStorage.setItem(chave, valor), [`sb-${new URL(SUPABASE).hostname.split(".")[0]}-auth-token`, JSON.stringify({
  access_token: `${b64({ alg: "HS256", typ: "JWT" })}.${b64({ sub: usuario.id, email: usuario.email, role: "authenticated", aud: "authenticated", exp: expira })}.assinatura`,
  refresh_token: "teste", token_type: "bearer", expires_in: 24 * 3600, expires_at: expira, user: usuario,
})]);
await contexto.route(`${SUPABASE}/**`, async (rota) => {
  const pedido = rota.request();
  const cors = { "access-control-allow-origin": "*", "access-control-allow-headers": "*", "access-control-allow-methods": "*" };
  if (pedido.method() === "OPTIONS") return rota.fulfill({ status: 204, headers: cors });
  const url = pedido.url();
  if (url.includes("/rest/v1/assinaturas")) return rota.fulfill({ status: 200, headers: cors, contentType: "application/json", body: JSON.stringify({ email: usuario.email, plano_id: "premium", ciclo: "mensal", status: "ativa", criada_em: "2026-01-01T00:00:00Z", inicio_periodo: "2026-01-01T00:00:00Z", fim_periodo: "2099-01-01T00:00:00Z", cancelada_em: null, forma_pagamento: "cartao", origem: "manual", kiwify_assinatura_id: null }) });
  if (url.includes("/rpc/registrar_uso_xmls")) { const n = pedido.postDataJSON().documentos.length; return rota.fulfill({ status: 200, headers: cors, contentType: "application/json", body: JSON.stringify({ permitido: true, mes: "2026-11", usados: n, novos: n, limite: null }) }); }
  return rota.fulfill({ status: 200, headers: cors, contentType: "application/json", body: "{}" });
});

const pagina = await contexto.newPage();
pagina.setDefaultTimeout(LIMITE_MS);
let gravacoes = 0;
pagina.on("console", (m) => {
  const t = m.text();
  if (t.startsWith("[validacao] gravada")) gravacoes++;
  if (m.type() === "error" && !t.startsWith("[validacao] falhou") && !t.startsWith("[resultados] atualização falhou") && !t.startsWith("[relatorio]")) console.error("  [console]", t.slice(0, 300));
});
pagina.on("pageerror", (e) => console.error("  [erro na página]", e.message));
pagina.on("dialog", (d) => d.accept());

const status = () => pagina.locator("#status").innerText().catch(() => "");
async function esperarStatus(re, oQue) {
  const t = Date.now();
  for (;;) {
    const s = await status();
    if (re.test(s)) return Date.now() - t;
    if (/^Erro:/.test(s)) throw new Error(`${oQue}: ${s}`);
    if (Date.now() - t > LIMITE_MS) throw new Error(`${oQue}: não terminou (${s})`);
    await esperar(250);
  }
}
const aba = (nome) => pagina.locator("nav button", { hasText: nome }).click();
async function abrirPendencias() {
  await aba("Pendências");
  await pagina.waitForFunction(() => /pendência\(s\)/.test(document.getElementById("contagemPendencias").textContent ?? ""), null, { timeout: LIMITE_MS });
}
const cartao = (chave) => pagina.locator(`#listaPendentes .pendente[data-produto="${chave}"]`);
const botao = (chave, o) => cartao(chave).locator(o.tipo === "REGRA" ? `button[data-escolha="REGRA"][data-regra="${o.regraId}"]` : `button[data-escolha="${o.tipo}"]`);
/** Opção marcada no card (tipo e regra) e mensagem de estado. */
const marcadaNoCartao = (chave) => pagina.evaluate((c) => {
  const el = [...document.querySelectorAll("#listaPendentes .pendente")].find((x) => x.dataset.produto === c);
  const e = validacoes.get(c);
  if (el) {
    const b = [...el.querySelectorAll("button[data-escolha].validacao-selecionada")];
    return { naLista: true, marcadas: b.map((x) => x.dataset.escolha + (x.dataset.escolha === "REGRA" ? ":" + x.dataset.regra : "")), mensagem: el.querySelector(".estado-validacao")?.textContent ?? "" };
  }
  // Retirado da lista (validado): a escolha registrada na página
  const p = pendentes.find((x) => x.ncm + "|" + x.cProd === c);
  const rs = (p && p.respostasDestaAnalise) || [];
  const ult = rs[rs.length - 1];
  return { naLista: false, marcadas: ult ? [ult.resposta === "SIM" ? "REGRA:" + ult.regraId : ult.escolha] : [], mensagem: e ? e.mensagem : "" };
}, chave);
const rotuloOpcao = (o) => o.tipo + (o.tipo === "REGRA" ? ":" + o.regraId : "");
async function esperarGravada(chave, oQue) {
  const t = Date.now();
  for (;;) {
    const m = await marcadaNoCartao(chave);
    const salvando = await pagina.evaluate((c) => (validacoes.get(c) || {}).salvando || 0, chave);
    if (/Escolha gravada/.test(m.mensagem) && salvando === 0) return Date.now() - t;
    if (/NÃO foi gravada/.test(m.mensagem)) throw new Error(`${oQue}: ${m.mensagem}`);
    if (Date.now() - t > 60000) throw new Error(`${oQue}: sem confirmação em 60 s (${m.mensagem})`);
    await esperar(50);
  }
}
/** Clica e mede: quanto tempo até a opção aparecer marcada, e até a gravação ser confirmada. */
async function escolher(p, o) {
  const chave = `${p.ncm}|${p.cProd}`;
  const t = Date.now();
  await pagina.evaluate(([c, rot]) => {
    window.__tClique = null; window.__marcadaEm = null;
    document.addEventListener("click", () => { window.__tClique = performance.now(); }, { capture: true, once: true });
    const marcada = () => [...(document.querySelector(`#listaPendentes .pendente[data-produto="${c}"]`)?.querySelectorAll("button[data-escolha].validacao-selecionada") ?? [])]
      .some((x) => x.dataset.escolha + (x.dataset.escolha === "REGRA" ? ":" + x.dataset.regra : "") === rot);
    const obs = new MutationObserver(() => { if (window.__tClique != null && window.__marcadaEm == null && marcada()) { window.__marcadaEm = performance.now(); obs.disconnect(); } });
    obs.observe(document.getElementById("listaPendentes"), { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
  }, [chave, rotuloOpcao(o)]);
  await botao(chave, o).click();
  const marcada = await marcadaNoCartao(chave);
  // Do clique até a opção marcada na tela, medido na própria página (sem o tempo do Playwright)
  const tMarca = Math.round(await pagina.evaluate(() => (window.__marcadaEm != null && window.__tClique != null ? window.__marcadaEm - window.__tClique : Infinity)));
  ok(marcada.marcadas.length === 1 && marcada.marcadas[0] === rotuloOpcao(o), `${p.produto.slice(0, 28)}: "${rotuloOpcao(o)}" marcada em ${tMarca} ms (clique → tela)`);
  const tGrava = await esperarGravada(chave, p.produto);
  return { tMarca, tGrava: tGrava + tMarca };
}
/** Produtos e escolhas guardados no navegador (lidos pela própria API da página). */
const api = (rota) => pagina.evaluate(async (r) => (await fetch(r)).json(), rota);
async function escolhaGravada(p) {
  const rs = (await api("/api/respostas")).filter((r) => r.ncm === p.ncm && r.cProd === p.cProd);
  if (!rs.length) return null;
  const ult = rs[rs.length - 1];
  return ult.resposta === "SIM" ? "REGRA:" + ult.regraId : ult.escolha;
}

async function relatorio(modo) {
  const id = { com: "btnRelatorioComValidacao", sem: "btnRelatorioSemValidacao", recal: "btnRelatorioRecal", corretos: "btnRelatorioCorretos" }[modo];
  const t = Date.now();
  await pagina.locator(`#${id}`).click();
  await pagina.waitForFunction(() => /produto\(s\)/.test(document.getElementById("contagemRelatorioFinal").textContent ?? "")
    || /Não foi possível|não foi gerado/.test(document.getElementById("listaRelatorioFinal").textContent ?? ""), null, { timeout: LIMITE_MS });
  const texto = await pagina.locator("#listaRelatorioFinal").innerText();
  if (/Não foi possível|não foi gerado/.test(texto)) throw new Error(`relatório ${modo}: ${texto.slice(0, 200)}`);
  const linhas = await pagina.evaluate(() => linhasRelatorioFinal.map((l) => [...l]));
  return { ms: Date.now() - t, linhas };
}
async function exportar(formato) {
  const rotulo = { csv: "Exportar CSV", excel: "Exportar Excel", pdf: "Exportar PDF" }[formato];
  const [download] = await Promise.all([pagina.waitForEvent("download", { timeout: 120000 }), pagina.locator("#relatorio-final button", { hasText: rotulo }).click()]);
  const caminho = join(pastaTeste, "baixado-" + download.suggestedFilename());
  await download.saveAs(caminho);
  return { nome: download.suggestedFilename(), bytes: statSync(caminho).size };
}

const tabela = [];

async function rodar(total) {
  console.log(`\n== ${total.toLocaleString("pt-BR")} XMLs ==`);
  // Começa do zero
  await aba("Análise");
  await pagina.getByRole("button", { name: /Nova análise/ }).click();
  await esperarStatus(/Nova análise iniciada/, "limpeza");
  const arquivos = gerar(total);
  await pagina.locator("#arquivos").setInputFiles(arquivos);
  await pagina.locator("#btnAdicionar").click();
  await esperarStatus(/adicionado\(s\) à análise atual/, "carregar XMLs");
  let t = Date.now();
  await pagina.locator("#btnProcessar").click();
  await esperarStatus(/^$/, "processar");
  await pagina.waitForFunction(() => /Processamento concluído/.test(document.getElementById("resumoAnalise").textContent ?? ""), null, { timeout: LIMITE_MS });
  const tProc = Date.now() - t;
  ok(true, `${total} XMLs processados em ${seg(tProc)}`);

  // Pendências
  t = Date.now();
  await abrirPendencias();
  const tFila = Date.now() - t;
  const lista = await pagina.evaluate(() => pendentes.map((p) => ({ ncm: p.ncm, cProd: p.cProd, produto: p.produto, respondida: !!p.respondida, opcoes: (p.opcoesValidacao || []).map((o) => ({ tipo: o.tipo, regraId: o.regraId || "" })) })));
  const comOpcoes = lista.filter((p) => p.opcoes.length >= 3 && !p.respondida);
  ok(comOpcoes.length >= 8, `Pendências carregadas em ${seg(tFila)}: ${lista.length} produtos, ${comOpcoes.length} com múltipla escolha`);
  const escolhas = new Map(); // chave -> rótulo da opção esperada
  const tipos = ["REGRA", "MERCADORIA_SEM_BENEFICIO", "CONSUMO_NO_LOCAL", "NCM_INCORRETO"];
  const alvo = comOpcoes.slice(0, 8);
  const tempos = [];
  gravacoes = 0;
  // 1. Vários produtos seguidos, com tipos diferentes de escolha
  for (let i = 0; i < alvo.length; i++) {
    const p = alvo[i];
    const o = p.opcoes.find((x) => x.tipo === tipos[i % tipos.length]) ?? p.opcoes[0];
    tempos.push(await escolher(p, o));
    escolhas.set(`${p.ncm}|${p.cProd}`, rotuloOpcao(o));
  }
  const maxMarca = Math.max(...tempos.map((x) => x.tMarca)), maxGrava = Math.max(...tempos.map((x) => x.tGrava));
  ok(maxMarca < 200, `seleção na tela sem demora: no máximo ${maxMarca} ms entre o clique e a opção marcada (medido na página)`);
  ok(maxGrava < 5000, `gravação confirmada em no máximo ${maxGrava} ms por escolha (média ${Math.round(tempos.reduce((a, x) => a + x.tGrava, 0) / tempos.length)} ms)`);
  ok(gravacoes === alvo.length, `${gravacoes} gravações para ${alvo.length} escolhas`);
  {
    const naTela = await pagina.evaluate(() => [...document.querySelectorAll("#listaPendentes .pendente")].map((x) => x.dataset.produto));
    const validadas = alvo.map((p) => `${p.ncm}|${p.cProd}`);
    ok(validadas.every((c) => !naTela.includes(c)), `os ${validadas.length} produtos validados saíram da lista de Pendências assim que a gravação foi confirmada`);
    ok(naTela.length === comOpcoes.length - validadas.length && comOpcoes.slice(8).every((p) => naTela.includes(`${p.ncm}|${p.cProd}`)), `os ${naTela.length} produtos ainda não validados continuam na lista`);
    const cont = await pagina.locator("#contagemPendencias").innerText();
    ok(cont === `${comOpcoes.length - 8} pendência(s) · 8 validado(s) nesta análise`, `contagem atualizada na hora: "${cont}"`);
    ok(/validado e retirado das pendências/.test(await pagina.locator("#avisoValidadoIbsCbs").innerText()), "aviso de produto validado e retirado das pendências");
    const est = await pagina.evaluate((cs) => cs.map((c) => (pendentes.find((p) => p.ncm + "|" + p.cProd === c).respostasDestaAnalise || []).length), validadas);
    ok(est.every((n) => n > 0), "cada produto retirado continua registrado com a sua resposta");
    // Para as próximas verificações (troca, cliques repetidos, falhas), mostra os validados com a escolha marcada
    await pagina.locator("#btnValidadosIbsCbs").click();
    const exibidos = [];
    for (const c of validadas) exibidos.push(await marcadaNoCartao(c));
    ok(exibidos.every((m, i) => m.naLista && m.marcadas.join() === escolhas.get(validadas[i])), "\"Mostrar validados\" exibe os produtos validados com a escolha marcada");
  }

  // 2. Troca de uma escolha já feita
  {
    const p = alvo[0];
    const chave = `${p.ncm}|${p.cProd}`;
    const nova = p.opcoes.find((x) => rotuloOpcao(x) !== escolhas.get(chave) && x.tipo !== "REGRA") ?? p.opcoes[1];
    await escolher(p, nova);
    escolhas.set(chave, rotuloOpcao(nova));
    ok(await escolhaGravada(p) === rotuloOpcao(nova), `escolha alterada e gravada: ${rotuloOpcao(nova)}`);
  }
  // 3. Cliques repetidos na mesma opção: uma gravação só
  {
    const p = alvo[1];
    const chave = `${p.ncm}|${p.cProd}`;
    const o = p.opcoes.find((x) => rotuloOpcao(x) === escolhas.get(chave));
    const antes = gravacoes;
    for (let i = 0; i < 5; i++) await botao(chave, o).click();
    await esperar(1000);
    ok(gravacoes === antes, `5 cliques na opção já gravada: ${gravacoes - antes} gravação(ões) a mais`);
  }
  // 4. Duas escolhas seguidas no mesmo produto, sem esperar: vale a última
  {
    const p = alvo[2];
    const chave = `${p.ncm}|${p.cProd}`;
    const [a, b] = p.opcoes.filter((x) => x.tipo !== "REGRA" && rotuloOpcao(x) !== escolhas.get(chave)).slice(0, 2);
    await botao(chave, a).click();
    await botao(chave, b).click();
    ok((await marcadaNoCartao(chave)).marcadas.join() === rotuloOpcao(b), "duas escolhas seguidas: a última aparece marcada na hora");
    await esperarGravada(chave, "duas escolhas seguidas");
    escolhas.set(chave, rotuloOpcao(b));
    ok(await escolhaGravada(p) === rotuloOpcao(b) && (await marcadaNoCartao(chave)).marcadas.join() === rotuloOpcao(b), "duas escolhas seguidas: gravada e marcada a última");
  }
  // 5. Lista que chega depois de um clique (resposta fora de ordem) não desmarca o clique
  {
    const p = alvo[3];
    const chave = `${p.ncm}|${p.cProd}`;
    const nova = p.opcoes.find((x) => x.tipo !== "REGRA" && rotuloOpcao(x) !== escolhas.get(chave));
    await pagina.evaluate(() => {
      const original = window.fetch;
      window.__fetchOriginal = original;
      window.fetch = async (u, i) => { const r = await original(u, i); if (String(u).includes("/api/fila-validacao")) await new Promise((x) => setTimeout(x, 2500)); return r; };
      window.__buscaLenta = carregarPendentes();
    });
    await esperar(300);
    await botao(chave, nova).click();
    await pagina.evaluate(async () => { await window.__buscaLenta; window.fetch = window.__fetchOriginal; });
    await esperarGravada(chave, "resposta fora de ordem").catch(() => 0);
    escolhas.set(chave, rotuloOpcao(nova));
    ok((await marcadaNoCartao(chave)).marcadas.join() === rotuloOpcao(nova), "lista buscada antes do clique e recebida depois: a escolha continua marcada");
    ok(await escolhaGravada(p) === rotuloOpcao(nova), "e gravada");
  }
  // 6. Falha de comunicação ao gravar: erro na tela, volta para a escolha gravada; a nova tentativa grava
  {
    const p = alvo[4];
    const chave = `${p.ncm}|${p.cProd}`;
    const nova = p.opcoes.find((x) => x.tipo !== "REGRA" && rotuloOpcao(x) !== escolhas.get(chave));
    await pagina.evaluate(() => {
      const original = window.fetch;
      window.__fetchOriginal = original;
      window.fetch = (u, i) => (String(u).includes("/api/validar") ? Promise.reject(new TypeError("Failed to fetch")) : original(u, i));
    });
    await botao(chave, nova).click();
    await pagina.waitForFunction((c) => /NÃO foi gravada/.test(document.querySelector(`#listaPendentes .pendente[data-produto="${c}"] .estado-validacao`)?.textContent ?? ""), chave);
    const depois = await marcadaNoCartao(chave);
    ok(/NÃO foi gravada/.test(depois.mensagem) && depois.marcadas.join() === escolhas.get(chave), `falha de comunicação: "${depois.mensagem.slice(0, 70)}..." e a marcação voltou para ${depois.marcadas.join()}`);
    ok(await escolhaGravada(p) === escolhas.get(chave), "nada foi gravado na falha");
    await pagina.evaluate(() => { window.fetch = window.__fetchOriginal; });
    await escolher(p, nova);
    escolhas.set(chave, rotuloOpcao(nova));
    ok(await escolhaGravada(p) === rotuloOpcao(nova), "nova tentativa gravada");
  }

  // 7. Troca de aba: Dashboard atualiza os resultados com as escolhas; de volta a Pendências, tudo marcado
  t = Date.now();
  await aba("Dashboard");
  await pagina.waitForFunction(() => document.getElementById("avisoValidacoes").hidden, null, { timeout: LIMITE_MS });
  const tAtualiza = Date.now() - t;
  ok(true, `resultados atualizados com as escolhas ao abrir o Dashboard (${seg(tAtualiza)})`);
  async function conferirMarcas(onde) {
    await abrirPendencias();
    const naLista = await pagina.evaluate(() => [...document.querySelectorAll("#listaPendentes .pendente")].map((x) => x.dataset.produto));
    if (!(await pagina.locator("#btnValidadosIbsCbs").innerText()).startsWith("Ocultar")) {
      ok([...escolhas.keys()].every((c) => !naLista.includes(c)), `${onde}: nenhum produto validado aparece na lista de pendências`);
      await pagina.locator("#btnValidadosIbsCbs").click();
    }
    const lista2 = await pagina.evaluate(() => pendentes.map((p) => ({ chave: p.ncm + "|" + p.cProd, respondida: !!p.respondida })));
    for (const [chave, esperado] of escolhas) {
      const m = await marcadaNoCartao(chave);
      if (m.marcadas.join() !== esperado) ok(false, `${onde}: ${chave} marcada ${m.marcadas.join() || "(nada)"}, esperado ${esperado}`);
      if (!lista2.find((x) => x.chave === chave)?.respondida) ok(false, `${onde}: ${chave} não está em "Validados nesta análise"`);
    }
    ok(true, `${onde}: as ${escolhas.size} escolhas continuam marcadas, em "Validados nesta análise"`);
  }
  await conferirMarcas("depois de trocar de aba");
  // 8. Recarregar a página
  await pagina.reload();
  await pagina.waitForFunction(() => /concluído|aguardando|resultado/.test(document.getElementById("resumoAnalise")?.textContent ?? ""), null, { timeout: LIMITE_MS });
  await conferirMarcas("depois de recarregar a página");
  // Os vereditos dos produtos validados refletem a escolha (não estão mais pendentes)
  const resultados = await pagina.evaluate(() => buscarResultados().then((rs) => rs.map((v) => ({ chave: v.ncm + "|" + v.cProd, estado: v.estado }))));
  const pendentesValidados = resultados.filter((v) => escolhas.has(v.chave) && v.estado === "REQUER_VALIDACAO").length;
  ok(pendentesValidados === 0, `nenhum item dos ${escolhas.size} produtos validados continua "precisa validar" nos resultados`);

  // 9. Nova escolha depois da atualização (resultados ficam desatualizados) e Relatório Final
  {
    const p = comOpcoes[8] ?? alvo[5];
    const o = p.opcoes.find((x) => x.tipo === "MERCADORIA_SEM_BENEFICIO") ?? p.opcoes[0];
    await escolher(p, o);
    escolhas.set(`${p.ncm}|${p.cProd}`, rotuloOpcao(o));
  }
  // Falha ao atualizar os resultados antes do relatório: mensagem específica
  await pagina.evaluate(() => {
    const original = window.fetch;
    window.__fetchOriginal = original;
    window.fetch = (u, i) => (String(u).includes("/api/atualizar-resultados") ? Promise.reject(new TypeError("Failed to fetch")) : original(u, i));
  });
  await aba("Relatório Final");
  await pagina.waitForFunction(() => /não foi gerado/.test(document.getElementById("listaRelatorioFinal").textContent ?? ""), null, { timeout: 60000 });
  ok(/sem comunicação/.test(await pagina.locator("#listaRelatorioFinal").innerText()), "falha ao atualizar antes do relatório: mensagem específica, sem relatório com dados velhos");
  await pagina.evaluate(() => { window.fetch = window.__fetchOriginal; });

  const rel = {};
  for (const modo of ["sem", "com", "recal", "corretos"]) {
    rel[modo] = await relatorio(modo);
    ok(true, `relatório "${modo}": ${rel[modo].linhas.length} produto(s) em ${seg(rel[modo].ms)}`);
    for (const formato of ["csv", "excel", "pdf"]) {
      if (!rel[modo].linhas.length) continue;
      const d = await exportar(formato);
      if (d.bytes < 200) ok(false, `exportação ${formato} do relatório ${modo} vazia (${d.bytes} bytes)`);
    }
    if (rel[modo].linhas.length) ok(true, `relatório "${modo}": CSV, Excel e PDF exportados`);
  }
  // Conferência com as escolhas
  const cprodsValidados = new Set([...escolhas.keys()].map((k) => k.split("|")[1]));
  const naSem = rel.sem.linhas.filter((l) => cprodsValidados.has(l[0]));
  ok(naSem.length === 0, `"Sem validação": nenhum dos ${cprodsValidados.size} produtos validados aparece (${rel.sem.linhas.length} pendentes)`);
  const pendentesNaTela = await pagina.evaluate(() => fetch("/api/fila-validacao").then((r) => r.json()).then((l) => l.filter((p) => !p.respondida).length));
  ok(rel.sem.linhas.length === pendentesNaTela, `"Sem validação" tem os ${pendentesNaTela} produtos ainda pendentes`);
  ok(rel.com.linhas.every((l) => cprodsValidados.has(l[0])), `"Corretos validados": ${rel.com.linhas.length} produto(s), todos validados nesta análise`);
  const corretosEsperados = await pagina.evaluate(() => buscarResultados().then((rs) => new Set(rs.filter((v) => v.estado === "CORRETO" || ehRecalculo(v)).map((v) => v.cProd || v.ncm + "|" + v.produto)).size));
  ok(rel.corretos.linhas.length === corretosEsperados, `"Corretos": ${rel.corretos.linhas.length} produtos, iguais aos corretos dos resultados`);
  ok(rel.recal.linhas.length <= rel.corretos.linhas.length, `"Corretos c/ recal": ${rel.recal.linhas.length} produtos (parte dos corretos)`);
  // A última escolha (feita depois da atualização) entrou no relatório
  const ultima = [...escolhas.keys()].pop().split("|")[1];
  ok(!rel.sem.linhas.some((l) => l[0] === ultima), "a escolha feita depois da última atualização também entrou no relatório");

  tabela.push({
    volume: total, processar: seg(tProc), pendencias: seg(tFila), "marcar (máx)": maxMarca + " ms", "gravar (máx)": maxGrava + " ms",
    "atualizar resultados": seg(tAtualiza), "rel. sem": seg(rel.sem.ms), "rel. com": seg(rel.com.ms), "rel. recal": seg(rel.recal.ms), "rel. corretos": seg(rel.corretos.ms),
  });
  rmSync(join(pastaTeste, String(total)), { recursive: true, force: true });
}

try {
  await pagina.goto(`http://localhost:${PORTA}/sistema.html`);
  await pagina.waitForFunction(() => /Análise vazia|aguardando|concluído|resultado/.test(document.getElementById("resumoAnalise")?.textContent ?? ""), null, { timeout: 120000 });
  for (const total of VOLUMES) await rodar(total);
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
