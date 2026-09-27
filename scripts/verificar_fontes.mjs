// Confere os snapshots de data/fontes contra o manifesto. Só lê, não grava nada.
//
// - SHA-256 e tamanho de cada arquivo listado;
// - planilha: hash dos valores recalculado a partir das linhas gravadas;
// - F1: dispositivos da LC 214 presentes no HTML;
// - F2: extração derivada idêntica à reextraída do svrs.html, e valores conferidos.
// Se o .zip de origem da planilha estiver acessível, confere também a extração contra ele.
//
// Uso: node scripts/verificar_fontes.mjs   (sai com código 1 se algo não conferir)
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { lerZip, lerAbas } from "./snapshot_planilha.mjs";
import { extrair } from "./snapshot_svrs.mjs";

const DIR = "data/fontes";
const manifesto = JSON.parse(fs.readFileSync(path.join(DIR, "manifesto.json"), "utf8"));
const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
let falhas = 0;
const conferir = (ok, msg) => { console.log(`${ok ? "OK   " : "FALHA"} ${msg}`); if (!ok) falhas++; };
const fonte = (id) => manifesto.fontes.find((f) => f.id === id);
const ler = (arq) => fs.readFileSync(path.join(DIR, arq));

// 1. Integridade de todos os arquivos
for (const f of manifesto.fontes) {
  for (const s of f.snapshots) {
    const p = path.join(DIR, s.arquivo);
    if (!fs.existsSync(p)) { conferir(false, `${f.id} ${s.arquivo}: arquivo ausente`); continue; }
    const buf = fs.readFileSync(p);
    conferir(sha(buf) === s.sha256, `${f.id} ${s.arquivo}: sha256 ${sha(buf).slice(0, 12)}…`);
    if (s.tamanho !== undefined) conferir(buf.length === s.tamanho, `${f.id} ${s.arquivo}: ${buf.length} bytes`);
  }
}

// 2. Planilha: valores relidos dos snapshots
const plan = fonte("PLANILHA");
for (const s of plan.snapshots) {
  const j = JSON.parse(ler(s.arquivo));
  const shaValores = sha(JSON.stringify(j.linhas));
  conferir(j.aba === s.aba && j.origem.shaXlsm === plan.origem.sha256Xlsm, `PLANILHA ${s.aba}: aba e origem conferem com o manifesto`);
  conferir(shaValores === s.shaValores && shaValores === j.shaValores, `PLANILHA ${s.aba}: shaValores ${shaValores.slice(0, 12)}…`);
  conferir(j.linhas.length === s.linhasComDados, `PLANILHA ${s.aba}: ${j.linhas.length} linhas com dados`);
}
if (fs.existsSync(plan.origem.arquivo)) {
  const zip = fs.readFileSync(plan.origem.arquivo);
  conferir(sha(zip) === plan.origem.sha256Zip, "PLANILHA origem: sha256 do .zip");
  const xlsm = lerZip(zip).get(plan.origem.entrada)?.data;
  conferir(!!xlsm && sha(xlsm) === plan.origem.sha256Xlsm, "PLANILHA origem: sha256 do .xlsm");
  if (xlsm) {
    const { abas } = lerAbas(xlsm, plan.snapshots.map((s) => s.aba));
    for (const s of plan.snapshots) conferir(abas[s.aba].shaValores === s.shaValores, `PLANILHA origem: ${s.aba} reextraída confere`);
  }
} else {
  console.log(`AVISO origem da planilha não acessível (${plan.origem.arquivo}); conferência contra o .zip não feita`);
}

// 3. F1: dispositivos da LC 214
const lc = ler(fonte("F1").snapshots[0].arquivo).toString("latin1");
for (const m of fonte("F1").conferencia.marcadores) conferir(lc.includes(m), `F1 marcador ${m}`);

// 4. F2: derivada = reextraída do HTML primário, e valores
const f2 = fonte("F2");
const primario = f2.snapshots.find((s) => s.arquivo.endsWith(".html"));
const derivado = f2.snapshots.find((s) => s.tipo === "derivado");
const d = JSON.parse(ler(derivado.arquivo));
conferir(d.derivadoDe.sha256 === primario.sha256, "F2 derivada aponta para o svrs.html do manifesto");
conferir(JSON.stringify(d.cst200) === JSON.stringify(extrair(ler(primario.arquivo).toString("utf8"))), "F2 derivada idêntica à reextraída do svrs.html");
for (const [cod, esp] of Object.entries(f2.conferencia.classificacoes)) {
  const c = d.cst200.ClassificacoesTributarias.find((x) => x.CodClassTrib === cod);
  if (!c) { conferir(false, `F2 ${cod} ausente`); continue; }
  for (const [campo, v] of Object.entries(esp)) {
    const obtido = campo === "ncmsDistintos" ? new Set(c.Anexos.map((a) => a.CodNcmNbs)).size : c[campo];
    conferir(obtido === v, `F2 ${cod} ${campo} = ${obtido}`);
  }
}

console.log(falhas ? `\n${falhas} falha(s).` : "\nTodas as conferências passaram.");
process.exit(falhas ? 1 : 0);
