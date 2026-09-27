const fs = require("fs");

const p = "./src/servidor.ts";
let s = fs.readFileSync(p, "utf8");

const bloco = `
button.secondary[data-validar]:active,
button.secondary[data-validar]:focus,
button.secondary[data-validar]:focus-visible{
  background:#6d28d9 !important;
  color:white !important;
  font-weight:bold !important;
  box-shadow:0 0 0 3px #c4b5fd !important;
  outline:none !important;
  transform:scale(1.03);
}
`;

if (!s.includes("button.secondary[data-validar]:active")) {
  s += "\n" + bloco + "\n";
  fs.writeFileSync(p, s, "utf8");
  console.log("Destaque visual dos botoes SIM/NAO adicionado sem alterar a funcao dos botoes.");
} else {
  console.log("O destaque visual ja esta presente. Nenhuma alteracao feita.");
}
