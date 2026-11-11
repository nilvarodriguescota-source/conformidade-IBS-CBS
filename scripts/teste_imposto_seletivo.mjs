/**
 * Teste do Imposto Seletivo na versão publicada (sistema.html, no navegador), num Chromium de verdade.
 *
 * A. XMLs reais da padaria (analise-atual/xmls, agosto/2026): os produtos do Anexo XVII aparecem na aba Imposto
 *    Seletivo como "não incide" (operação antes da vigência; revenda), energéticos/isotônicos/sucos/águas fora do
 *    Anexo; escolha do usuário marcada na hora, trocada, mantida depois de recarregar; falha de comunicação desfaz a
 *    marcação; relatório "IMPOSTO SELETIVO" e coluna IS nos demais relatórios, com CSV, Excel e PDF.
 * B. As mesmas notas como venda de produção própria (CFOP 5101) em março/2027: bebidas açucaradas e alcoólicas vão
 *    para "necessita de validação fiscal", sem alíquota zero e sem valor enquanto a alíquota não for conferida;
 *    a escolha "incidência" mostra a alíquota de referência e o motivo de o valor não ser calculado.
 * C. 10.000 XMLs: processamento, aba do IS e relatório do IS.
 * IBS/CBS: os vereditos não mudam (comparados com /api/resultados antes e depois das escolhas do IS).
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
async function abrirIS(filtro = "relevantes") {
  const t = Date.now();
  await aba("Imposto Seletivo");
  await pagina.waitForFunction(() => /produto\(s\) exibido/.test(document.getElementById("contagemIS").textContent ?? ""), null, { timeout: LIMITE_MS });
  await pagina.locator("#filtroIS").selectOption(filtro);
  return Date.now() - t;
}
const produtosIS = () => pagina.evaluate(() => isProdutos.map((p) => ({ chave: p.chave, ncm: p.ncm, produto: p.produto, categoria: p.categoria && p.categoria.id, situacao: p.situacao, situacaoFinal: p.situacaoFinal, validacao: p.validacao, valorFinal: p.valorFinal, aliquota: p.aliquota && p.aliquota.aliquota, calculo: p.calculo, motivos: p.motivos.map((m) => m.motivo), projecao: p.projecaoVigencia && p.projecaoVigencia.situacao })));
const cartaoIS = (chave) => pagina.locator(`#listaIS .is-produto[data-is-produto="${chave}"]`);
const marcadoIS = (chave) => cartaoIS(chave).evaluate((el) => ({
  marcado: [...el.querySelectorAll("button[data-is].validacao-selecionada")].map((b) => b.dataset.is),
  mensagem: el.querySelector(".estado-validacao")?.textContent ?? "",
  texto: el.innerText,
}));
async function escolherIS(chave, escolha) {
  const t = Date.now();
  await cartaoIS(chave).locator(`button[data-is="${escolha}"]`).click();
  const m = await marcadoIS(chave);
  const tMarca = Date.now() - t;
  ok(m.marcado.join() === escolha, `${chave}: "${escolha}" marcada (${tMarca} ms até o Playwright ler)`);
  const t2 = Date.now();
  for (;;) {
    const x = await marcadoIS(chave);
    if (/Escolha gravada/.test(x.mensagem)) break;
    if (/NÃO foi gravada/.test(x.mensagem)) throw new Error(x.mensagem);
    if (Date.now() - t2 > 30000) throw new Error("sem confirmação");
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
  let tAba = await abrirIS("todos");
  let ps = await produtosIS();
  ok(ps.length === 433, `aba Imposto Seletivo em ${seg(tAba)}: ${ps.length} produtos analisados (todos os da padaria)`);
  const anexo = ps.filter((p) => p.categoria);
  const porCat = {}; for (const p of anexo) porCat[p.categoria] = (porCat[p.categoria] ?? 0) + 1;
  ok(anexo.length === 37 && porCat.BEBIDAS_ACUCARADAS === 24 && porCat.CERVEJAS === 6 && porCat.VINHOS_FERMENTADOS === 3 && porCat.DESTILADOS === 4 && !porCat.FUMIGENOS,
    `Anexo XVII: ${anexo.length} produtos (${JSON.stringify(porCat)}); nenhum fumígeno vendido`);
  ok(anexo.every((p) => p.situacao === "NAO_INCIDENCIA" && p.motivos.every((m) => /anterior ao início das alíquotas/.test(m))), "todos do Anexo XVII: não incidência — operações de 2026, antes de 02/02/2027 (nenhuma alíquota de 2027 aplicada)");
  ok(anexo.every((p) => p.projecao === "NAO_INCIDENCIA"), "orientação para 2027: todos são revenda (CFOP 5102/5405) — sem IS na operação da padaria");
  const energeticos = ps.filter((p) => /MONSTER|GATORADE|POWERADE/.test(p.produto));
  ok(energeticos.length === 4 && energeticos.every((p) => !p.categoria && p.situacao === "NAO_INCIDENCIA" && /não consta do Anexo XVII/.test(p.motivos[0])), `energéticos e isotônicos em 2202.99.00 (${energeticos.map((p) => p.produto).join(", ")}): fora do Anexo XVII`);
  const redbull = ps.find((p) => /RED BULL/.test(p.produto));
  ok(redbull.categoria === "BEBIDAS_ACUCARADAS", "Red Bull em 2202.10.00: identificado pelo NCM no Anexo XVII (a descrição de energético não decide)");
  const outros = ps.filter((p) => /^(2009|2201)/.test(p.ncm));
  ok(outros.length > 0 && outros.every((p) => p.situacao === "NAO_INCIDENCIA" && !p.categoria), `${outros.length} sucos e águas (2009 e 2201): fora do Anexo XVII`);
  ok(ps.every((p) => p.valorFinal == null || p.valorFinal > 0) && ps.every((p) => p.situacaoFinal !== "INCIDENCIA"), "nenhum valor de IS e nenhuma alíquota zero atribuídos");

  const ibsAntes = await vereditosIbsCbs();
  // Escolhas: confirma, troca, mantém após recarregar
  await pagina.locator("#filtroIS").selectOption("relevantes");
  const coca = anexo.find((p) => /COCA COLA 350ML/.test(p.produto)).chave;
  const cerveja = anexo.find((p) => /HEINEKEN/.test(p.produto)).chave;
  const vinho = anexo.find((p) => /MIOLO SELECAO CABERNET/.test(p.produto)).chave;
  const tempos = [await escolherIS(coca, "NAO_INCIDENCIA"), await escolherIS(cerveja, "VALIDACAO"), await escolherIS(vinho, "INCIDENCIA")];
  ok(Math.max(...tempos) < 3000, `escolhas gravadas em até ${Math.max(...tempos)} ms`);
  let m = await marcadoIS(vinho);
  ok(/pendente de conferência|fora da vigência/.test(m.texto) && /Valor do IS/.test(m.texto), "incidência escolhida em operação de 2026: quadro completo, valor não calculado (fora da vigência), sem alíquota zero");
  await escolherIS(vinho, "NAO_INCIDENCIA");
  ok(await respostaGravada(vinho) === "NAO_INCIDENCIA", "troca da escolha gravada");
  // Falha de comunicação: volta para a escolha gravada
  await pagina.evaluate(() => { window.__f = window.fetch; window.fetch = (u, i) => (String(u).includes("/api/imposto-seletivo/validar") ? Promise.reject(new TypeError("Failed to fetch")) : window.__f(u, i)); });
  await cartaoIS(coca).locator('button[data-is="VALIDACAO"]').click();
  await pagina.waitForFunction((c) => /NÃO foi gravada/.test(document.querySelector(`#listaIS .is-produto[data-is-produto="${c}"] .estado-validacao`)?.textContent ?? ""), coca);
  m = await marcadoIS(coca);
  ok(m.marcado.join() === "NAO_INCIDENCIA" && await respostaGravada(coca) === "NAO_INCIDENCIA", "falha de comunicação: erro na tela e marcação de volta à escolha gravada");
  await pagina.evaluate(() => { window.fetch = window.__f; });
  await pagina.reload();
  await pagina.waitForFunction(() => /concluído|resultado/.test(document.getElementById("resumoAnalise")?.textContent ?? ""), null, { timeout: 120000 });
  await abrirIS();
  ok((await marcadoIS(coca)).marcado.join() === "NAO_INCIDENCIA" && (await marcadoIS(cerveja)).marcado.join() === "VALIDACAO" && (await marcadoIS(vinho)).marcado.join() === "NAO_INCIDENCIA", "depois de recarregar a página: as 3 escolhas continuam marcadas");
  ok(await vereditosIbsCbs() === ibsAntes, "IBS/CBS: resultados idênticos antes e depois das escolhas do IS");

  // Relatórios
  await aba("Relatório Final");
  const relIS = await relatorio("is");
  const esperadoA = await pagina.evaluate(() => isProdutos.filter(produtoISRelevante).length);
  ok(relIS.linhas.length === esperadoA, `relatório IMPOSTO SELETIVO: ${relIS.linhas.length} produtos (os ${esperadoA} do Anexo XVII e bebidas) em ${seg(relIS.ms)}`);
  const lin = (cp) => relIS.linhas.find((l) => l[0] === cp);
  const cpCoca = coca.split("|")[1], cpCerv = cerveja.split("|")[1];
  ok(/Não incidência/.test(lin(cpCoca)[4]) && /Confirmada pelo usuário/.test(lin(cpCoca)[9]), "relatório: escolha confirmada pelo usuário (Coca-Cola: não incidência)");
  ok(/validação fiscal/.test(lin(cpCerv)[4]) && /Pendente/.test(lin(cpCerv)[9]) && /pendente/i.test(lin(cpCerv)[5]), "relatório: produto pendente de validação, sem alíquota atribuída");
  ok(relIS.linhas.every((l) => l.length === 10 && l[3] && l[8]), "relatório: todas as linhas com descrição fiscal e fundamentação legal");
  for (const f of ["csv", "excel", "pdf"]) { const d = await exportar(f); if (d.bytes < 500) ok(false, `exportação ${f} vazia`); }
  ok(true, "relatório IMPOSTO SELETIVO: CSV, Excel e PDF exportados");
  const relCorr = await relatorio("corretos");
  ok(relCorr.linhas.length > 0 && relCorr.linhas.every((l) => l.length === 11 && /Incide|Não incide|Validação fiscal|Sem dados/.test(l[10])), `relatório CORRETOS com a coluna "Imposto Seletivo (IS)" (${relCorr.linhas.length} produtos)`);
  const relSem = await relatorio("sem");
  ok(relSem.linhas.every((l) => l.length === 8), `relatório SEM VALIDAÇÃO com a coluna IS (${relSem.linhas.length} produtos)`);
  for (const f of ["csv", "excel", "pdf"]) { const d = await exportar(f); if (d.bytes < 500) ok(false, `exportação ${f} (sem) vazia`); }
  ok(true, "relatórios com a coluna IS exportados");
  tabela.push({ cenario: "A. 2.783 XMLs reais", processar: seg(tProc), "aba IS": seg(tAba), "relatório IS": seg(relIS.ms), produtos: ps.length, "Anexo XVII": anexo.length });

  // ---------- B. Fabricante em 2027 ----------
  console.log("\n== B. Notas de produção própria (CFOP 5101) em março/2027 ==");
  const fab = reais.filter((f) => /<NCM>(22021000|2203|2204|2208)/.test(ler(f))).slice(0, 400)
    .map((f) => [f, ler(f).replace(/<dhEmi>2026-08-/g, "<dhEmi>2027-03-").replace(/<CFOP>(5102|5405)<\/CFOP>/g, "<CFOP>5101</CFOP>")]);
  tProc = await analisar(gravar("fabricante-2027", fab));
  tAba = await abrirIS("pendentes");
  ps = await produtosIS();
  const doAnexo = ps.filter((p) => p.categoria);
  ok(doAnexo.length > 0 && doAnexo.every((p) => p.situacao === "VALIDACAO" && p.valorFinal == null), `${doAnexo.length} produtos do Anexo XVII vendidos pelo fabricante em 2027: necessita de validação fiscal, sem valor`);
  const acucar = doAnexo.find((p) => p.categoria === "BEBIDAS_ACUCARADAS");
  ok(acucar.aliquota === 0.026 && acucar.motivos.some((x) => /não conferida/.test(x)), `bebida açucarada: alíquota de referência 2,6% exibida, valor não calculado até a conferência com a MP`);
  const alcool = doAnexo.find((p) => p.categoria === "CERVEJAS");
  ok(alcool.motivos.some((x) => /embalagem primária/.test(x)), "cerveja: pede a confirmação de embalagem primária (art. 409, § 2º)");
  ok(ps.filter((p) => !p.categoria).every((p) => p.situacao === "NAO_INCIDENCIA"), "produtos fora do Anexo XVII continuam sem incidência");
  await escolherIS(acucar.chave, "INCIDENCIA");
  const depois = (await api("/api/imposto-seletivo")).produtos.find((p) => p.chave === acucar.chave);
  ok(depois.situacaoFinal === "INCIDENCIA" && depois.valorFinal === null && /pendente de conferência/.test(depois.calculo), "incidência confirmada pelo usuário: valor não calculado porque a alíquota ainda não foi conferida (sem alíquota zero)");
  await aba("Relatório Final");
  const relB = await relatorio("is");
  const lb = relB.linhas.find((l) => l[0] === acucar.chave.split("|")[1]);
  ok(/Incidência/.test(lb[4]) && /2,6%/.test(lb[5]) && /pendente de conferência/.test(lb[5]) && /pendente de conferência/.test(lb[7]), "relatório: incidência, alíquota 2,6% marcada como pendente de conferência e valor não calculado");
  tabela.push({ cenario: "B. fabricante 2027", processar: seg(tProc), "aba IS": seg(tAba), "relatório IS": seg(relB.ms), produtos: ps.length, "Anexo XVII": doAnexo.length });

  // ---------- C. 10.000 XMLs ----------
  console.log("\n== C. 10.000 XMLs ==");
  tProc = await analisar(gravar("10000", copias(10000)));
  tAba = await abrirIS("todos");
  ps = await produtosIS();
  ok(ps.length > 300 && ps.filter((p) => p.categoria).length > 30 && ps.every((p) => p.situacaoFinal !== "INCIDENCIA" || p.valorFinal === null), `10.000 XMLs processados em ${seg(tProc)}; aba do IS em ${seg(tAba)} com ${ps.length} produtos`);
  await aba("Relatório Final");
  const relC = await relatorio("is");
  const esperadoC = await pagina.evaluate(() => isProdutos.filter(produtoISRelevante).length);
  ok(relC.linhas.length === esperadoC && esperadoC > 50, `relatório IMPOSTO SELETIVO com 10.000 XMLs em ${seg(relC.ms)}: ${relC.linhas.length} produtos (os ${esperadoC} do Anexo XVII e bebidas)`);
  tabela.push({ cenario: "C. 10.000 XMLs", processar: seg(tProc), "aba IS": seg(tAba), "relatório IS": seg(relC.ms), produtos: ps.length, "Anexo XVII": ps.filter((p) => p.categoria).length });
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
