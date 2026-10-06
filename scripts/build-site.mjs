// Gera o site comercial (landing, login, cadastro, checkout, área do cliente) dentro de public/.
// Chamado por build-web.mjs. O sistema de XML continua sendo gerado por build-web.mjs, sem mudanças,
// e é publicado como public/sistema.html.
import { build } from "esbuild";
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

/** Substitui <!-- @parte nome --> pelo conteúdo de site/html/partes/nome.html (cabeçalhos e rodapés compartilhados). */
function montarHtml(arquivo, partes) {
  return readFileSync(arquivo, "utf8").replace(/<!--\s*@parte\s+([\w-]+)\s*-->/g, (_, nome) => {
    const parte = partes.get(nome);
    if (parte == null) throw new Error(`Parte "${nome}" não encontrada (usada em ${basename(arquivo)}).`);
    return parte.trim();
  });
}

export async function construirSite({ raiz, pub }) {
  const site = join(raiz, "site");
  const saida = join(pub, "site");
  mkdirSync(saida, { recursive: true });

  // Scripts das páginas (ESM com partes comuns compartilhadas)
  const paginas = readdirSync(join(site, "paginas")).filter((f) => f.endsWith(".ts")).map((f) => join(site, "paginas", f));
  await build({
    entryPoints: paginas,
    outdir: join(saida, "js"),
    bundle: true,
    splitting: true,
    format: "esm",
    minify: true,
    target: "es2020",
    legalComments: "none",
    logLevel: "warning",
    chunkNames: "comum-[hash]",
  });

  // Estilos (cada página importa tokens, base e componentes)
  const estilos = readdirSync(join(site, "estilos", "paginas")).filter((f) => f.endsWith(".css")).map((f) => join(site, "estilos", "paginas", f));
  await build({
    entryPoints: estilos,
    outdir: join(saida, "css"),
    bundle: true,
    minify: true,
    logLevel: "warning",
    loader: { ".woff2": "file", ".png": "file", ".svg": "file" },
    external: ["../fontes/*", "../imagens/*"],
  });

  // Imagens próprias do site (as da marca vêm de public/marca, geradas para o sistema)
  if (existsSync(join(site, "imagens"))) cpSync(join(site, "imagens"), join(saida, "imagens"), { recursive: true });

  // Fontes da identidade (Cormorant Garamond servida localmente, como no sistema). Saem de
  // scripts/ajustar_fonte_site.py: a mesma fonte do @fontsource com o circunflexo mais baixo.
  cpSync(join(site, "fontes"), join(saida, "fontes"), { recursive: true });

  // Páginas HTML
  const dirHtml = join(site, "html");
  const partes = new Map(
    readdirSync(join(dirHtml, "partes")).map((f) => [f.replace(/\.html$/, ""), readFileSync(join(dirHtml, "partes", f), "utf8")]),
  );
  for (const f of readdirSync(dirHtml).filter((f) => f.endsWith(".html"))) {
    writeFileSync(join(pub, f), montarHtml(join(dirHtml, f), partes));
  }
}
