const fs = require("fs");

const p = "./src/servidor.ts";
let s = fs.readFileSync(p, "utf8");

const antigo = 'button.secondary{background:#e2e8f0;color:#17202a;border:0;border-radius:6px;padding:10px 16px;cursor:pointer}';
const novo = antigo + 'button.relatorio-final-selecionado{background:#6d28d9;color:white;font-weight:bold;box-shadow:0 0 0 2px #c4b5fd}';

if (!s.includes(antigo)) throw new Error("Regra button.secondary não encontrada.");
if (s.includes("button.relatorio-final-selecionado")) throw new Error("A regra nova já existe.");

s = s.replace(antigo, novo);

fs.writeFileSync(p, s, "utf8");
console.log("Regra visual adicionada com sucesso.");
