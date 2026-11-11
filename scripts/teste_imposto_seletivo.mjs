/**
 * Teste do Imposto Seletivo na versão publicada (sistema.html, no navegador), num Chromium de verdade.
 *
 * A validação do IS fica em Pendências → IMPOSTO SELETIVO, separada da de IBS/CBS e com o mesmo funcionamento:
 * produtos do Anexo XVII aguardando validação, escolha marcada na hora e gravada, "Validados nesta análise" depois de
 * recarregar, falha de comunicação desfaz a marcação. O Relatório Final volta ao layout anterior e o relatório
 * IMPOSTO SELETIVO (7 colunas) só traz os produtos validados.
 *
 * A. XMLs reais da padaria (agosto/2026)   B. as mesmas notas como venda do fabricante em março/2027   C. 10.000 XMLs
 * IBS/CBS: os vereditos não mudam com as escolhas do IS.
 *
 * Uso: node scripts/teste_imposto_seletivo.mjs   (depois de npm run build; precisa do Playwright)
 */
import { spawn } from "node:child_process";
import { mkdirSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, writeFileSync } from "node:fs";
import { createRequire } from "node:module";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("playwright");
const RAIZ = resolve(".");
const PORTA = 4392;
const LIMITE_MS = 15 * 60 * 1000;
const SUPABASE = "https://diydqdrycltsghqilryv.supabase.co";
const falhas = [];
const ok = (cond, msg) => {
  if (!cond) { falhas.push(msg); console.error("  FALHOU:", msg); throw new Error(msg); }
  console.log("  OK  ", msg);
};
const seg = (ms) => (ms / 1000).toFixed(1) + " s";
const esperar = (ms) => new Promise((r) => setTimeout(r, ms));
const pastaTeste = mkdtempSync(join(tmpdir(), "imposto-seletivo-"));
const pastaModelos = join(RAIZ, "analise-atual", "xmls");
const reais = readdirSync(pastaModelos).filter((f) => f.endsWith(".xml")).sort();

/** Grava XMLs numa pasta nova: os reais (com transformação opcional) ou N cópias com chave nova. */
function gravar(nome, arquivos) {
  const pasta = join(pastaTeste, nome);
  mkdirSync(pasta, { recursive: true });
  return arquivos.map(([n, conteudo]) => { const c = join(pasta, n); writeFileSync(c, conteudo); return c; });
}
const ler = (f) => readFileSync(join(pastaModelos, f), "utf8");
function copias(total) {
  const modelos = reais.filter((f) => /^\d{44}\.xml$/.test(f)).slice(0, 2000).map((f) => ({ chave: f.slice(0, 44), c: ler(f) }));
  return Array.from({ length: total }, (_, i) => {
    const m = modelos[i % modelos.length];
    const nNF = String(900000000 + i).slice(-9);
    const chave = m.chave.slice(0, 25) + nNF + m.chave.slice(34);
    return [`${chave}.xml`, m.c.split(m.chave).join(chave).replace(/<nNF>\d+<\/nNF>/, `<nNF>${Number(nNF)}</nNF>`)];
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

const api = (rota) => pagina.evaluate(async (r) => (await fetch(r)).json(), rota);

async function analisar(caminhos) {
  await aba("Análise");
  await pagina.getByRole("button", { name: /Nova análise/ }).click();
  await esperarStatus(/Nova análise iniciada/, "limpeza");
  await pagina.locator("#arquivos").setInputFiles(caminhos);
  await pagina.locator("#btnAdicionar").click();
  await esperarStatus(/adicionado\(s\) à análise atual/, "carregar XMLs");
  const t = Date.now();
  await pagina.locator("#btnProcessar").click();
  await esperarStatus(/^$/, "processar");
  await pagina.waitForFunction(() => /Processamento concluído/.test(document.getElementById("resumoAnalise").textContent ?? ""), null, { timeout: LIMITE_MS });
  return Date.now() - t;
}
async function abrirPendenciasIS() {
  const t = Date.now();
  await aba("Pendências");
  await pagina.locator("#btnPendenciasIS").click();
  await pagina.waitForFunction(() => /pendência\(s\)/.test(document.getElementById("contagemPendenciasIS").textContent ?? ""), null, { timeout: LIMITE_MS });
  return Date.now() - t;
}
const produtosIS = () => pagina.evaluate(() => isProdutos.map((p) => ({ chave: p.chave, ncm: p.ncm, cProd: p.cProd, produto: p.produto, categoria: p.categoria && p.categoria.id, situacao: p.situacao, situacaoFinal: p.situacaoFinal, valorFinal: p.valorFinal, aliquota: p.aliquota && p.aliquota.aliquota, motivos: p.motivos.map((m) => m.motivo), pendencia: pendenciaIS(p) })));
const naTela = () => pagina.evaluate(() => {
  const el = document.getElementById("listaPendenciasIS");
  const titulo = el.querySelector(".titulo-validados");
  return [...el.querySelectorAll(".pendente")].map((c) => ({ chave: c.dataset.isProduto, validado: !!titulo && !!(titulo.compareDocumentPosition(c) & Node.DOCUMENT_POSITION_FOLLOWING) }));
});
const cartaoIS = (chave) => pagina.locator(`#listaPendenciasIS .pendente[data-is-produto="${chave}"]`);
const marcadoIS = (chave) => cartaoIS(chave).evaluate((el) => ({
  marcado: [...el.querySelectorAll("button[data-is].validacao-selecionada")].map((b) => b.dataset.is),
  mensagem: el.querySelector(".estado-validacao")?.textContent ?? "",
  texto: el.innerText,
}));
async function escolherIS(chave, escolha) {
  const t = Date.now();
  await cartaoIS(chave).locator(`button[data-is="${escolha}"]`).click();
  const m = await marcadoIS(chave);
  ok(m.marcado.join() === escolha, `${chave}: "${escolha}" marcada na hora`);
  for (;;) {
    const x = await marcadoIS(chave);
    if (/Escolha gravada/.test(x.mensagem)) break;
    if (/NÃO foi gravada/.test(x.mensagem)) throw new Error(x.mensagem);
    if (Date.now() - t > 30000) throw new Error("sem confirmação");
    await esperar(50);
  }
  return Date.now() - t;
}
const respostaGravada = async (chave) => (await api("/api/imposto-seletivo")).produtos.find((p) => p.chave === chave)?.escolha?.escolha ?? null;
const vereditosIbsCbs = () => pagina.evaluate(() => buscarResultados().then((rs) => JSON.stringify(rs.map(({ calculadoEm, ...v }) => v))));

async function relatorio(modo) {
  const id = { com: "btnRelatorioComValidacao", sem: "btnRelatorioSemValidacao", recal: "btnRelatorioRecal", corretos: "btnRelatorioCorretos", is: "btnRelatorioIS" }[modo];
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
try {
  await pagina.goto(`http://localhost:${PORTA}/sistema.html`);
  await pagina.waitForFunction(() => /Análise vazia|aguardando|concluído|resultado/.test(document.getElementById("resumoAnalise")?.textContent ?? ""), null, { timeout: 120000 });

  // ---------- A. XMLs reais da padaria ----------
  console.log("\n== A. 2.783 XMLs reais da padaria (agosto/2026) ==");
  let tProc = await analisar(gravar("reais", reais.map((f) => [f, ler(f)])));
  ok(true, `processados em ${seg(tProc)}`);
  ok(await pagina.locator('nav button', { hasText: "Imposto Seletivo" }).count() === 0, "não há aba própria do IS: a validação fica em Pendências");
  // Relatório do IS antes de qualquer validação: vazio
  await aba("Relatório Final");
  let relVazio = await relatorio("is");
  ok(relVazio.linhas.length === 0, "relatório IMPOSTO SELETIVO antes da validação: nenhum produto (os dados aparecem só depois de validar)");
  let tAba = await abrirPendenciasIS();
  let ps = await produtosIS();
  let tela = await naTela();
  const anexo = ps.filter((p) => p.categoria);
  ok(ps.length === 433 && anexo.length === 37, `${ps.length} produtos analisados; ${anexo.length} do Anexo XVII (${seg(tAba)})`);
  ok(tela.length === 37 && tela.every((c) => anexo.some((p) => p.chave === c.chave)) && tela.every((c) => !c.validado), "Pendências → Imposto Seletivo: os 37 produtos do Anexo XVII aguardando validação");
  ok(await pagina.locator("#contagemPendenciasIS").innerText() === "37 pendência(s)", "contagem: 37 pendência(s)");
  ok(!tela.some((c) => /^(22029900|2009|2201)/.test(c.chave)), "energéticos, isotônicos, sucos e águas (fora do Anexo XVII) não são pendência de IS");
  ok(await pagina.locator("#pendenciasIbsCbs").isHidden() && await pagina.locator("#pendenciasIS").isVisible(), "pendências de IS separadas das de IBS/CBS");
  const texto = await cartaoIS(anexo[0].chave).innerText();
  ok(/Validação do Imposto Seletivo/i.test(texto) && /Pergunta/i.test(texto) && /Não sabe\? Deixe sem resposta/i.test(texto), "card no formato das pendências de IBS/CBS (pergunta, opções com resultado, deixar sem resposta)");

  const ibsAntes = await vereditosIbsCbs();
  const coca = anexo.find((p) => /COCA COLA 350ML/.test(p.produto));
  const cerveja = anexo.find((p) => /HEINEKEN/.test(p.produto));
  const vinho = anexo.find((p) => /MIOLO SELECAO CABERNET/.test(p.produto));
  const tempos = [await escolherIS(coca.chave, "NAO_INCIDENCIA"), await escolherIS(cerveja.chave, "VALIDACAO"), await escolherIS(vinho.chave, "INCIDENCIA")];
  ok(Math.max(...tempos) < 3000, `escolhas gravadas em até ${Math.max(...tempos)} ms`);
  tela = await naTela();
  ok(tela.length === 37 && tela.every((c) => !c.validado), "os cards não mudam de lugar ao clicar (como em IBS/CBS)");
  await escolherIS(vinho.chave, "NAO_INCIDENCIA");
  await escolherIS(vinho.chave, "INCIDENCIA");
  ok(await respostaGravada(vinho.chave) === "INCIDENCIA", "escolha trocada e gravada");
  // 5 cliques repetidos na opção já gravada: nenhuma gravação nova
  let gravadas = 0;
  const contar = (m) => { if (/\[pendencias-is\] escolha gravada/.test(m.text())) gravadas++; };
  pagina.on("console", contar);
  for (let i = 0; i < 5; i++) await cartaoIS(coca.chave).locator('button[data-is="NAO_INCIDENCIA"]').click();
  await esperar(800);
  pagina.off("console", contar);
  ok(gravadas === 0, "cliques repetidos na opção gravada: nenhuma gravação duplicada");
  // Falha de comunicação
  await pagina.evaluate(() => { window.__f = window.fetch; window.fetch = (u, i) => (String(u).includes("/api/imposto-seletivo/validar") ? Promise.reject(new TypeError("Failed to fetch")) : window.__f(u, i)); });
  await cartaoIS(coca.chave).locator('button[data-is="INCIDENCIA"]').click();
  await pagina.waitForFunction((c) => /NÃO foi gravada/.test(document.querySelector(`#listaPendenciasIS .pendente[data-is-produto="${c}"] .estado-validacao`)?.textContent ?? ""), coca.chave);
  ok((await marcadoIS(coca.chave)).marcado.join() === "NAO_INCIDENCIA" && await respostaGravada(coca.chave) === "NAO_INCIDENCIA", "falha de comunicação: erro no card e marcação de volta à escolha gravada");
  await pagina.evaluate(() => { window.fetch = window.__f; });
  // Recarregar: validados em "Validados nesta análise", pendente continua pendente
  await pagina.reload();
  await pagina.waitForFunction(() => /concluído|resultado/.test(document.getElementById("resumoAnalise")?.textContent ?? ""), null, { timeout: 120000 });
  await abrirPendenciasIS();
  tela = await naTela();
  const pos = (c) => tela.find((x) => x.chave === c);
  ok(pos(coca.chave).validado && pos(vinho.chave).validado && !pos(cerveja.chave).validado, "depois de recarregar: Coca-Cola e vinho em \"Validados nesta análise\"; a cerveja (validação fiscal) continua pendente");
  ok((await marcadoIS(coca.chave)).marcado.join() === "NAO_INCIDENCIA" && (await marcadoIS(vinho.chave)).marcado.join() === "INCIDENCIA" && (await marcadoIS(cerveja.chave)).marcado.join() === "VALIDACAO", "as 3 escolhas continuam marcadas");
  ok(await pagina.locator("#contagemPendenciasIS").innerText() === "35 pendência(s) · 2 validado(s) nesta análise", "contagem: 35 pendência(s) · 2 validado(s)");
  ok(await vereditosIbsCbs() === ibsAntes, "IBS/CBS: resultados idênticos antes e depois das escolhas do IS");

  // Relatórios: layout anterior e IS só com os validados
  await aba("Relatório Final");
  const relIS = await relatorio("is");
  const lin = (cp) => relIS.linhas.find((l) => l[0] === cp);
  ok(relIS.linhas.length === 2 && relIS.linhas.every((l) => l.length === 7), "relatório IMPOSTO SELETIVO: só os 2 produtos validados, em 7 colunas (formato do relatório final)");
  ok(lin(coca.cProd)[3] === "Não incide" && lin(coca.cProd)[4] === "0% (não incide)" && /Norma:/.test(lin(coca.cProd)[6]), `não incidência: "${lin(coca.cProd).slice(3, 6).join(" | ")}"`);
  ok(lin(vinho.cProd)[3] === "Incide" && lin(vinho.cProd)[5] === "Não calculado" && /Norma:/.test(lin(vinho.cProd)[6]), `incidência (operação de 2026, sem alíquota na data): "${lin(vinho.cProd).slice(3, 6).join(" | ")}"`);
  ok(!lin(cerveja.cProd), "produto com validação fiscal pendente não aparece no relatório");
  for (const f of ["csv", "excel", "pdf"]) { const d = await exportar(f); if (d.bytes < 500) ok(false, `exportação ${f} vazia`); }
  ok(true, "relatório IMPOSTO SELETIVO: CSV, Excel e PDF exportados");
  const colunas = await pagina.evaluate(() => ({ final: COLUNAS_RELATORIO_FINAL.length, impacto: COLUNAS_RELATORIO_IMPACTO.length }));
  const relCorr = await relatorio("corretos"), relSem = await relatorio("sem");
  ok(colunas.final === 7 && colunas.impacto === 10 && relCorr.linhas.every((l) => l.length === 10) && relSem.linhas.every((l) => l.length === 7), "demais relatórios no layout anterior (7 colunas; Corretos com 10), sem coluna de IS");
  tabela.push({ cenario: "A. 2.783 XMLs reais", processar: seg(tProc), "pendências IS": seg(tAba), "relatório IS": seg(relIS.ms), produtos: ps.length, "Anexo XVII": anexo.length });

  // ---------- B. Fabricante em 2027 ----------
  console.log("\n== B. Notas de produção própria (CFOP 5101) em março/2027 ==");
  const fab = reais.filter((f) => /<NCM>(22021000|2203|2204|2208)/.test(ler(f))).slice(0, 400)
    .map((f) => [f, ler(f).replace(/<dhEmi>2026-08-/g, "<dhEmi>2027-03-").replace(/<CFOP>(5102|5405)<\/CFOP>/g, "<CFOP>5101</CFOP>")]);
  tProc = await analisar(gravar("fabricante-2027", fab));
  tAba = await abrirPendenciasIS();
  ps = await produtosIS();
  const doAnexo = ps.filter((p) => p.categoria);
  ok(doAnexo.length > 0 && doAnexo.every((p) => p.situacao === "VALIDACAO" && p.valorFinal == null), `${doAnexo.length} produtos do Anexo XVII vendidos pelo fabricante em 2027: sugestão "necessita de validação fiscal", sem valor`);
  const acucar = doAnexo.find((p) => p.categoria === "BEBIDAS_ACUCARADAS");
  ok(/2,6%/.test(await cartaoIS(acucar.chave).innerText()), "card da bebida açucarada mostra a alíquota de 2,6%");
  await escolherIS(acucar.chave, "INCIDENCIA");
  await aba("Relatório Final");
  const relB = await relatorio("is");
  const lb = relB.linhas.find((l) => l[0] === acucar.cProd);
  ok(relB.linhas.length === 1 && lb[3] === "Incide" && lb[4] === "2,6%" && lb[5] === "Não calculado" && /pendente de conferência/.test(lb[6]), `relatório: "${lb.slice(3, 6).join(" | ")}" — valor não calculado até a conferência da alíquota com a MP`);
  tabela.push({ cenario: "B. fabricante 2027", processar: seg(tProc), "pendências IS": seg(tAba), "relatório IS": seg(relB.ms), produtos: ps.length, "Anexo XVII": doAnexo.length });

  // ---------- C. 10.000 XMLs ----------
  console.log("\n== C. 10.000 XMLs ==");
  tProc = await analisar(gravar("10000", copias(10000)));
  tAba = await abrirPendenciasIS();
  ps = await produtosIS();
  tela = await naTela();
  ok(tela.length === ps.filter((p) => p.pendencia).length && tela.length > 30, `10.000 XMLs processados em ${seg(tProc)}; pendências de IS em ${seg(tAba)}: ${tela.length} produtos`);
  const p10 = ps.find((p) => p.chave === tela[0].chave);
  await escolherIS(p10.chave, "NAO_INCIDENCIA");
  await aba("Relatório Final");
  const relC = await relatorio("is");
  ok(relC.linhas.length === 1 && relC.linhas[0][0] === p10.cProd, `relatório IMPOSTO SELETIVO com 10.000 XMLs em ${seg(relC.ms)}`);
  tabela.push({ cenario: "C. 10.000 XMLs", processar: seg(tProc), "pendências IS": seg(tAba), "relatório IS": seg(relC.ms), produtos: ps.length, "Anexo XVII": tela.length });
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
