// Gera public/: o site estático do Netlify (sistema rodando no navegador) e as
// bibliotecas de public/vendor, usadas também pelo servidor local. Rodar depois do tsc.
import { build } from "esbuild";
import { cpSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const raiz = join(dirname(fileURLToPath(import.meta.url)), "..");
const pub = join(raiz, "public");
const nm = (p) => join(raiz, "node_modules", p);

rmSync(pub, { recursive: true, force: true });
mkdirSync(join(pub, "vendor"), { recursive: true });

const shims = join(raiz, "web", "shims");
const alias = {
  fs: join(raiz, "web", "vfs.ts"),
  "node:fs": join(raiz, "web", "vfs.ts"),
  path: "path-browserify",
  "node:path": "path-browserify",
  "node:crypto": join(shims, "crypto.ts"),
  crypto: join(shims, "crypto.ts"),
  "node:os": join(shims, "os.ts"),
  "node:child_process": join(shims, "child_process.ts"),
  express: join(shims, "express.ts"),
  multer: join(shims, "multer.ts"),
};

const comum = { bundle: true, minify: true, target: "es2020", logLevel: "warning", legalComments: "none" };

await build({
  ...comum,
  entryPoints: [join(raiz, "web", "worker.ts")],
  outfile: join(pub, "worker.js"),
  platform: "browser",
  format: "iife",
  alias,
  inject: [join(shims, "globais.ts")],
  define: { "process.env.NODE_ENV": '"production"' },
});
await build({ ...comum, entryPoints: [join(raiz, "web", "navegador.ts")], outfile: join(pub, "navegador.js"), format: "iife" });
await build({ ...comum, entryPoints: [join(raiz, "web", "xlsx-mini.ts")], outfile: join(pub, "vendor", "xlsx-mini.js"), format: "iife" });

for (const [origem, nome] of [
  ["chart.js/dist/chart.umd.js", "chart.umd.js"],
  ["chartjs-plugin-datalabels/dist/chartjs-plugin-datalabels.min.js", "chartjs-plugin-datalabels.min.js"],
  ["jspdf/dist/jspdf.umd.min.js", "jspdf.umd.min.js"],
  ["jspdf-autotable/dist/jspdf.plugin.autotable.min.js", "jspdf.plugin.autotable.min.js"],
  ["@fontsource/cormorant-garamond/files/cormorant-garamond-latin-600-normal.woff2", "cormorant-garamond-latin-600-normal.woff2"],
  ["@fontsource/cormorant-garamond/files/cormorant-garamond-latin-700-normal.woff2", "cormorant-garamond-latin-700-normal.woff2"],
]) cpSync(nm(origem), join(pub, "vendor", nome));

// Imagens da marca Sabores Estratégicos (geradas por scripts/gerar_marca.py; a logo original fica fora)
const origemDaMarca = join(raiz, "web", "marca", "origem");
cpSync(join(raiz, "web", "marca"), join(pub, "marca"), { recursive: true, filter: (f) => !f.startsWith(origemDaMarca) });

// Arquivos que o processamento lê do disco (base normativa, auditoria, matriz, empresa)
const dados = [
  "empresa.json",
  "data/base-normativa.json",
  "data/base-normativa.v2.json",
  "data/auditoria-oficial.json",
  "data/fontes/svrs/svrs-200-200033-200043.json",
  "docs/etapa6/matriz-decisao.json",
  "data/fontes/lc214/regime-bares-restaurantes.json",
];
for (const rel of dados) {
  mkdirSync(dirname(join(pub, "dados", rel)), { recursive: true });
  cpSync(join(raiz, rel), join(pub, "dados", rel));
}
writeFileSync(join(pub, "dados", "manifesto.json"), JSON.stringify(dados));

// O sistema (mesmo HTML de sempre) fica em sistema.html; a raiz do site é a página comercial.
const { paginaHtml } = await import(pathToFileURL(join(raiz, "dist", "src", "pagina.js")).href);
writeFileSync(join(pub, "sistema.html"), paginaHtml('<script src="navegador.js"></script>\n'));

// Site comercial: landing (index.html), login, cadastro, checkout e área do cliente
const { construirSite } = await import(pathToFileURL(join(raiz, "scripts", "build-site.mjs")).href);
await construirSite({ raiz, pub });

console.log("public/ gerado.");
