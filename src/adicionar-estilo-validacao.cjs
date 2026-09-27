const fs = require("fs");

const p = "./src/servidor.ts";
let s = fs.readFileSync(p, "utf8");

const marcador = "button.relatorio-final-selecionado{background:#6d28d9;color:white;font-weight:bold;box-shadow:0 0 0 2px #c4b5fd}";
const nova = marcador + "button.validacao-selecionada{background:#6d28d9;color:white;font-weight:bold;box-shadow:0 0 0 2px #c4b5fd}";

if (!s.includes(marcador)) throw new Error("Classe do Relatório Final não encontrada.");
if (s.includes("button.validacao-selecionada")) throw new Error("A classe de validação já existe.");

s = s.replace(marcador, nova);

fs.writeFileSync(p, s, "utf8");
console.log("Estilo dos botões SIM/NÃO adicionado com sucesso.");
