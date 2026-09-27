// Etapa 3 da base v2: preservação literal da planilha.
//
// Liga cada regra da base atual à linha da aba "Base de dados" que a gerou e
// acrescenta dois blocos a cada regra, sem tocar nos 18 campos existentes:
//   original            - a linha de origem, com as 18 colunas literais (vazia = null)
//   originaisAgrupados  - as linhas descartadas pelo extrair_base.py como duplicata
//                         exata desta regra ([] quando não há)
//
// A ligação reproduz o extrair_base.py sobre o snapshot auditado e exige que cada
// regra reproduzida seja igual, na mesma posição, à regra da base atual. Nada é
// inferido: se a reprodução não bater, a etapa para.
//
// Única diferença aceita: 5 células da coluna B têm "\r\n" no snapshot (bytes
// brutos do XML) e "\n" na base atual (o openpyxl normaliza fim de linha, como
// manda a especificação XML). O bloco original guarda o valor do snapshot.
import fs from "node:fs";
import crypto from "node:crypto";

export const MANIFESTO = "data/fontes/manifesto.json";
export const ABA = "Base de dados";

const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");
const digitos = (s) => String(s ?? "").replace(/\D/g, "");

/** Lê o snapshot da aba e confere os hashes contra o manifesto. */
export function lerSnapshot() {
  const manifesto = JSON.parse(fs.readFileSync(MANIFESTO, "utf8"));
  const ref = manifesto.fontes.find((f) => f.id === "PLANILHA").snapshots.find((s) => s.aba === ABA);
  const arquivo = "data/fontes/" + ref.arquivo;
  const bruto = fs.readFileSync(arquivo);
  if (sha(bruto) !== ref.sha256) throw new Error(`${arquivo}: sha256 ${sha(bruto)} difere do manifesto`);
  const snap = JSON.parse(bruto.toString("utf8"));
  if (sha(JSON.stringify(snap.linhas)) !== ref.shaValores) throw new Error(`${arquivo}: shaValores difere do manifesto`);
  const [[linhaCab, cab], ...dados] = snap.linhas;
  if (linhaCab !== 1) throw new Error("cabeçalho fora da linha 1");
  return { colunas: Object.entries(cab), dados, shaValores: ref.shaValores, cabecalho: [linhaCab, cab] };
}

/** As 18 colunas da linha, com o nome do cabeçalho; célula vazia = null. */
export function valoresDaLinha(colunas, celulas) {
  return Object.fromEntries(colunas.map(([letra, nome]) => [nome, celulas[letra] ?? null]));
}

/**
 * Reprodução do extrair_base.py para uma linha (mesmas regras, mesma ordem de campos).
 * Devolve null quando o script descartaria a linha.
 */
export function reproduzirRegra(v, catalogo) {
  const t = (nome) => (v[nome] ?? "").trim();
  const desc = t("Descrição legal do benefício");
  let ncm = digitos(v["NCM completo (8 dígitos)"]);
  if (ncm.length === 7) ncm = "0" + ncm;
  else if (ncm.length !== 8) return null;
  let ccl = digitos(v["cClassTrib correto"]);
  if (!ccl && /^\d{6}$/.test(digitos(v["Coluna1"]))) ccl = digitos(v["Coluna1"]);
  if (!ccl) return null;
  const cat = catalogo[ccl];
  if (!cat) return null;
  const anexo = t("Anexo"), item = t("Item");
  let fundamento = t("Fundamento legal");
  if (fundamento && !fundamento.toLowerCase().startsWith("art")) fundamento = "";
  return {
    id: `${ncm}-${ccl}-${anexo || "?"}-${item || "?"}`,
    ncm,
    cst: digitos(v["CST IBS/CBS correto"]).padStart(3, "0"),
    cClassTrib: ccl,
    tratamento: cat.reducao === 1 ? "aliquota_zero" : "reducao_60",
    reducaoAliquota: cat.reducao,
    anexo: anexo || cat.anexo,
    item,
    fundamentoLegal: fundamento || cat.artigo,
    rotulo: cat.rotulo,
    descricaoLegal: desc,
    descricaoNcmTipi: t("Descrição oficial NCM (TIPI)"),
    ncmCitadoNaLei: t("NCM citado na LC 214"),
    origemRegistro: t("Origem do registro") || "não informado",
    observacao: t("Observação"),
    vigenciaInicio: "2026-01-01",
    vigenciaFim: null,
    fonte: "LC 214/2025; planilha Base de dados V4.1",
  };
}

/** Igualdade dos 18 campos, admitindo só a diferença \r\n × \n em descricaoNcmTipi. */
export function comparar(reproduzida, atual) {
  const campos = Object.keys(atual);
  if (JSON.stringify(Object.keys(reproduzida)) !== JSON.stringify(campos)) return "campos";
  const dif = campos.filter((k) => JSON.stringify(reproduzida[k]) !== JSON.stringify(atual[k]));
  if (!dif.length) return "igual";
  if (dif.length === 1 && dif[0] === "descricaoNcmTipi" &&
      reproduzida.descricaoNcmTipi.includes("\r\n") &&
      reproduzida.descricaoNcmTipi.replace(/\r\n/g, "\n") === atual.descricaoNcmTipi) return "igual_exceto_crlf";
  return "diferente: " + dif.join(",");
}

/** Liga cada regra (por posição) à sua linha e às linhas agrupadas. */
export function ligar(base, snapshot) {
  const { colunas, dados } = snapshot;
  const geradas = [];
  for (const [linha, celulas] of dados) {
    const valores = valoresDaLinha(colunas, celulas);
    const regra = reproduzirRegra(valores, base.catalogoCodigos);
    if (!regra) throw new Error(`linha ${linha}: seria descartada pelo extrair_base.py; nenhuma linha deveria ser`);
    geradas.push({ linha, valores, regra });
  }
  const porChave = new Map(), mantidas = [];
  for (const g of geradas) {
    const chave = JSON.stringify([g.regra.ncm, g.regra.cClassTrib, g.regra.descricaoLegal]);
    const dono = porChave.get(chave);
    if (dono) { dono.agrupadas.push(g); continue; }
    const m = { ...g, agrupadas: [] };
    porChave.set(chave, m);
    mantidas.push(m);
  }
  if (mantidas.length !== base.regras.length) throw new Error(`${mantidas.length} regras reproduzidas × ${base.regras.length} na base`);
  const crlf = [];
  mantidas.forEach((m, i) => {
    const r = comparar(m.regra, base.regras[i]);
    if (r === "igual_exceto_crlf") crlf.push(m.linha);
    else if (r !== "igual") throw new Error(`regra[${i}] (linha ${m.linha}): ${r}`);
  });
  return { mantidas, crlf };
}

const bloco = (linha, valores, motivo) => ({
  fonte: "PLANILHA",
  aba: ABA,
  linha,
  ...(motivo ? { motivo } : {}),
  valores,
});

/** Etapa 3: acrescenta original e originaisAgrupados; os 18 campos ficam como estão. */
export function etapa3(base) {
  const { mantidas, crlf } = ligar(base, lerSnapshot());
  const regras = base.regras.map((r, i) => ({
    ...r,
    original: bloco(mantidas[i].linha, mantidas[i].valores),
    originaisAgrupados: mantidas[i].agrupadas.map((g) => bloco(g.linha, g.valores, "duplicata_exata")),
  }));
  console.log(`etapa 3: ${regras.length} regras com original; ${mantidas.reduce((n, m) => n + m.agrupadas.length, 0)} linhas agrupadas; ` +
    `CRLF preservado do snapshot nas linhas ${crlf.join(", ")}`);
  return { ...base, regras };
}
