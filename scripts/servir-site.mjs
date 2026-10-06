// Servidor estático para ver public/ como no Netlify (landing, login, área do cliente e sistema).
// Uso: npm run site   (gera public/ e abre em http://localhost:4173)
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const pub = fileURLToPath(new URL("../public/", import.meta.url));
const porta = Number(process.env.PORTA_SITE ?? 4173);
const tipos = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8", ".png": "image/png", ".svg": "image/svg+xml", ".woff2": "font/woff2",
};

createServer((req, res) => {
  const caminho = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
  let arquivo = normalize(join(pub, caminho));
  if (!arquivo.startsWith(pub.replace(/\/$/, ""))) return res.writeHead(403).end();
  if (existsSync(arquivo) && statSync(arquivo).isDirectory()) arquivo = join(arquivo, "index.html");
  // URLs sem .html (como no Netlify): /entrar → entrar.html
  if (!existsSync(arquivo) && existsSync(`${arquivo}.html`)) arquivo = `${arquivo}.html`;
  if (!existsSync(arquivo)) return res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Não encontrado");
  res.writeHead(200, { "Content-Type": tipos[extname(arquivo)] ?? "application/octet-stream" });
  createReadStream(arquivo).pipe(res);
}).listen(porta, () => console.log(`Site em http://localhost:${porta}`));
