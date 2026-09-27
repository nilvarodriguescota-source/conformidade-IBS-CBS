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

if (s.endsWith(bloco + "\n")) {
  s = s.slice(0, -(bloco.length + 1));
} else if (s.endsWith(bloco)) {
  s = s.slice(0, -bloco.length);
} else {
  console.log("Trecho nao encontrado no final. Nenhuma alteracao feita.");
  process.exit(0);
}

fs.writeFileSync(p, s, "utf8");
console.log("Trecho CSS incorreto removido. Nenhuma outra parte foi alterada.");
