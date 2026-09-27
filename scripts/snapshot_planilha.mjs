// Snapshot das abas normativas da planilha V4.1 (fonte PLANILHA).
//
// Lê o .xlsm dentro do .zip, sem descompactar em disco, e grava em
// data/fontes/planilha-p3/ os valores das abas "Base de dados",
// "Legenda e Manual" e "Base_CBS", célula a célula, sem sanear nada.
// As demais abas (Saídas, Resultado etc.) têm dados de cliente e ficam de fora.
//
// Hash dos valores: sha256(JSON.stringify(linhas)), com
// linhas = [[nº da linha, { coluna: valor }], ...], só linhas com conteúdo.
// É o mesmo método usado na investigação, então os hashes são comparáveis.
//
// Uso: node scripts/snapshot_planilha.mjs [arquivo.zip] [pasta de saída]
import fs from "node:fs";
import path from "node:path";
import zlib from "node:zlib";
import crypto from "node:crypto";
import os from "node:os";
import { pathToFileURL } from "node:url";

const ZIP = process.argv[2] ?? path.join(os.homedir(), "Downloads", "Planilha--de--conformidade--por--xml-----V4.1--(2) (1).zip");
const SAIDA = process.argv[3] ?? "data/fontes/planilha-p3";
const ABAS = { "Base de dados": "base-de-dados.json", "Legenda e Manual": "legenda-e-manual.json", "Base_CBS": "base-cbs.json" };

const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");

/** Lê as entradas de um zip (sem zip64). Devolve Map nome -> { data, tamanho }. */
export function lerZip(buf) {
  let eocd = buf.length - 22;
  while (eocd >= 0 && buf.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error("zip sem diretório central");
  const total = buf.readUInt16LE(eocd + 10);
  let p = buf.readUInt32LE(eocd + 16);
  const entradas = new Map();
  for (let i = 0; i < total; i++) {
    if (buf.readUInt32LE(p) !== 0x02014b50) throw new Error("diretório central corrompido");
    const metodo = buf.readUInt16LE(p + 10);
    const dataDos = buf.readUInt16LE(p + 14), horaDos = buf.readUInt16LE(p + 12);
    const comp = buf.readUInt32LE(p + 20);
    const nLen = buf.readUInt16LE(p + 28), xLen = buf.readUInt16LE(p + 30), cLen = buf.readUInt16LE(p + 32);
    const local = buf.readUInt32LE(p + 42);
    const nome = buf.subarray(p + 46, p + 46 + nLen).toString("utf8");
    const ini = local + 30 + buf.readUInt16LE(local + 26) + buf.readUInt16LE(local + 28);
    const bruto = buf.subarray(ini, ini + comp);
    const data = metodo === 0 ? Buffer.from(bruto) : metodo === 8 ? zlib.inflateRawSync(bruto) : null;
    if (!data) throw new Error(`método de compressão ${metodo} não suportado em ${nome}`);
    const modificado = `${1980 + (dataDos >> 9)}-${String((dataDos >> 5) & 15).padStart(2, "0")}-${String(dataDos & 31).padStart(2, "0")} ` +
      `${String(horaDos >> 11).padStart(2, "0")}:${String((horaDos >> 5) & 63).padStart(2, "0")}`;
    entradas.set(nome, { data, modificado });
    p += 46 + nLen + xLen + cLen;
  }
  return entradas;
}

const dec = (s) => s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'")
  .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n)).replace(/&amp;/g, "&");

/** Extrai as abas pedidas de um xlsx/xlsm já carregado em memória. */
export function lerAbas(xlsm, nomes) {
  const e = lerZip(xlsm);
  const rd = (p) => e.get(p).data.toString("utf8");
  const ss = [...rd("xl/sharedStrings.xml").matchAll(/<si>([\s\S]*?)<\/si>/g)]
    .map((m) => dec([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((x) => x[1]).join("")));
  const rels = Object.fromEntries([...rd("xl/_rels/workbook.xml.rels").matchAll(/<Relationship [^>]*>/g)]
    .map((m) => [m[0].match(/Id="([^"]+)"/)[1], m[0].match(/Target="([^"]+)"/)[1]]));
  const abas = [...rd("xl/workbook.xml").matchAll(/<sheet [^>]*>/g)].map((m) => ({
    nome: dec(m[0].match(/name="([^"]*)"/)[1]),
    estado: (m[0].match(/state="([^"]*)"/) || [, "visible"])[1],
    arquivoXml: "xl/" + rels[m[0].match(/r:id="([^"]*)"/)[1]].replace(/^\/?xl\//, ""),
  }));
  const res = {};
  for (const nome of nomes) {
    const aba = abas.find((a) => a.nome === nome);
    if (!aba) throw new Error(`aba ausente: ${nome}`);
    const x = rd(aba.arquivoXml);
    const linhas = [];
    let formulas = 0;
    for (const r of x.matchAll(/<row [^>]*?r="(\d+)"[^>]*?(?:\/>|>([\s\S]*?)<\/row>)/g)) {
      const row = {};
      for (const c of (r[2] || "").matchAll(/<c ([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
        const ref = c[1].match(/r="([A-Z]+\d+)"/)[1];
        const t = (c[1].match(/t="([^"]*)"/) || [])[1];
        const corpo = c[2] || "";
        if (/<f[ >]/.test(corpo)) formulas++;
        let v = (corpo.match(/<v>([\s\S]*?)<\/v>/) || [])[1];
        if (t === "s" && v !== undefined) v = ss[+v];
        else if (t === "inlineStr") v = dec([...corpo.matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((y) => y[1]).join(""));
        else if (v !== undefined) v = dec(v);
        if (v !== undefined && v !== "") row[ref.replace(/\d+/, "")] = v;
      }
      if (Object.keys(row).length) linhas.push([+r[1], row]);
    }
    res[nome] = {
      ...aba,
      dimensao: (x.match(/<dimension ref="([^"]*)"/) || [])[1] ?? null,
      celulasComFormula: formulas,
      linhasComDados: linhas.length,
      shaValores: sha(JSON.stringify(linhas)),
      linhas,
    };
  }
  return { todasAsAbas: abas.map((a) => `${a.nome} [${a.estado}]`), abas: res };
}

function main() {
  const zipBuf = fs.readFileSync(ZIP);
  const entradas = [...lerZip(zipBuf)].filter(([n]) => /\.xls[xm]$/i.test(n));
  if (entradas.length !== 1) throw new Error(`esperava 1 planilha no zip, achei ${entradas.length}`);
  const [nomeXlsm, { data: xlsm, modificado }] = entradas[0];
  const { todasAsAbas, abas } = lerAbas(xlsm, Object.keys(ABAS));

  fs.mkdirSync(SAIDA, { recursive: true });
  for (const [nome, arq] of Object.entries(ABAS)) {
    const { linhas, ...meta } = abas[nome];
    const cab = {
      fonte: "PLANILHA",
      aba: nome,
      origem: { zip: path.basename(ZIP), shaZip: sha(zipBuf), xlsm: nomeXlsm, shaXlsm: sha(xlsm), tamanhoXlsm: xlsm.length, modificadoNoZip: modificado },
      metodoHash: "sha256(JSON.stringify(linhas)); linhas = [[nº da linha, { coluna: valor }]], só linhas com conteúdo",
      observacao: "Valores como gravados na planilha, sem saneamento. Células com fórmula trazem o último valor calculado salvo no arquivo.",
      ...meta,
    };
    // Uma linha da planilha por linha do arquivo, para leitura e diff.
    const corpo = JSON.stringify(cab, null, 2).replace(/\n}$/, ",\n  \"linhas\": [\n") +
      linhas.map((l) => "    " + JSON.stringify(l)).join(",\n") + "\n  ]\n}\n";
    fs.writeFileSync(path.join(SAIDA, arq), corpo);
    console.log(`${arq}: ${meta.linhasComDados} linhas, shaValores=${meta.shaValores}`);
  }
  console.log("abas no arquivo:", todasAsAbas.join(" | "));
  console.log("xlsm:", nomeXlsm, sha(xlsm));
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) main();
