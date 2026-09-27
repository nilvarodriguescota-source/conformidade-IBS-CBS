// Etapa 4 da base v2: registro das fontes.
//
// Acrescenta na raiz da v2 o bloco `fontes`, montado a partir de
// data/fontes/manifesto.json: cada fonte uma vez, com os arquivos que a comprovam
// e o papel de cada um (original, metadados da captura ou extração derivada).
// As regras não mudam; campos futuros citarão estas fontes pelo id do arquivo.
//
// Do manifesto ficam de fora `conferencia` (valores oficiais, que entram na
// Etapa 5) e `gerador` (detalhe de ferramenta).
import fs from "node:fs";
import crypto from "node:crypto";

export const MANIFESTO = "data/fontes/manifesto.json";
const DIR = "data/fontes/";

const sha = (b) => crypto.createHash("sha256").update(b).digest("hex");

// Id estável de cada arquivo do manifesto, pelo caminho.
const ID_ARQUIVO = {
  "planilha-p3/base-de-dados.json": "PLANILHA.base-de-dados",
  "planilha-p3/legenda-e-manual.json": "PLANILHA.legenda-e-manual",
  "planilha-p3/base-cbs.json": "PLANILHA.base-cbs",
  "lc214/lcp214.htm": "F1.html",
  "svrs/svrs.html": "F2.html",
  "svrs/svrs.headers": "F2.headers",
  "svrs/svrs-200-200033-200043.json": "F2.extracao",
};

/** Monta o bloco `fontes` a partir do manifesto (sem ler os arquivos). */
export function montarFontes(manifestoBruto) {
  const manifesto = JSON.parse(manifestoBruto.toString("utf8"));
  const registros = {};
  for (const f of manifesto.fontes) {
    const arquivos = [];
    if (f.id === "PLANILHA") {
      arquivos.push({
        id: "PLANILHA.xlsm",
        tipo: "original",
        noProjeto: false,
        caminho: null,
        localOrigem: `${f.origem.arquivo} -> ${f.origem.entrada}`,
        sha256: f.origem.sha256Xlsm,
        tamanho: f.origem.tamanhoXlsm,
        conteiner: { sha256: f.origem.sha256Zip, tamanho: f.origem.tamanhoZip },
        copiasIdenticas: f.origem.copiasIdenticas,
        motivoForaDoProjeto: f.naoExtraido,
      });
    }
    for (const s of f.snapshots) {
      const id = ID_ARQUIVO[s.arquivo];
      if (!id) throw new Error(`arquivo sem id: ${s.arquivo}`);
      const a = { id, tipo: null, noProjeto: true, caminho: DIR + s.arquivo, sha256: s.sha256 };
      if (s.tamanho !== undefined) a.tamanho = s.tamanho;
      if (f.id === "PLANILHA") {
        Object.assign(a, { tipo: "extracao", derivadoDe: "PLANILHA.xlsm", aba: s.aba, linhasComDados: s.linhasComDados, shaValores: s.shaValores, metodo: f.extraido });
      } else if (s.tipo === "derivado") {
        Object.assign(a, { tipo: "extracao", derivadoDe: ID_ARQUIVO[s.derivadoDe] });
      } else {
        a.tipo = s.arquivo.endsWith(".headers") ? "metadados_captura" : "original";
      }
      arquivos.push(a);
    }
    registros[f.id] = {
      id: f.id,
      nome: f.nome,
      papel: f.papel,
      url: f.url ?? null,
      versao: f.versao,
      dataConsulta: f.dataConsulta,
      observacao: f.observacao ?? null,
      arquivos,
    };
  }
  return { manifesto: { caminho: MANIFESTO, sha256: sha(manifestoBruto) }, registros };
}

/** Confere no disco cada arquivo registrado que está no projeto. Devolve a lista de problemas. */
export function conferirArquivos(fontes) {
  const problemas = [];
  for (const r of Object.values(fontes.registros)) {
    for (const a of r.arquivos) {
      if (!a.noProjeto) continue;
      if (!fs.existsSync(a.caminho)) { problemas.push(`${a.id}: ${a.caminho} ausente`); continue; }
      const b = fs.readFileSync(a.caminho);
      if (sha(b) !== a.sha256) problemas.push(`${a.id}: sha256 ${sha(b)} difere do registrado ${a.sha256}`);
      if (a.tamanho !== undefined && b.length !== a.tamanho) problemas.push(`${a.id}: ${b.length} bytes, registrado ${a.tamanho}`);
    }
  }
  return problemas;
}

/** Etapa 4: acrescenta `fontes` na raiz; as regras ficam como estão. */
export function etapa4(base) {
  const fontes = montarFontes(fs.readFileSync(MANIFESTO));
  const problemas = conferirArquivos(fontes);
  if (problemas.length) throw new Error("fontes não conferem com o manifesto:\n  " + problemas.join("\n  "));
  const n = Object.values(fontes.registros).reduce((s, r) => s + r.arquivos.length, 0);
  console.log(`etapa 4: ${Object.keys(fontes.registros).length} fontes, ${n} arquivos registrados, manifesto ${fontes.manifesto.sha256.slice(0, 12)}…`);
  return { ...base, fontes };
}
