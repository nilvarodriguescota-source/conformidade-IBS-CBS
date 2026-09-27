const fs = require("fs");

const arquivo = "./src/servidor.ts";

let texto = fs.readFileSync(arquivo, "utf8");

// Corrige sequências típicas de texto UTF-8 interpretado
// como Latin-1/Windows-1252.
// Só tenta corrigir trechos que contenham os marcadores
// característicos de mojibake (Ã, Â ou â).
texto = texto.replace(
  /[^\s<>\u0022\u0027]*[\u00C3\u00C2\u00E2][^\s<>\u0022\u0027]*/g,
  (trecho) => {
    try {
      const corrigido = Buffer.from(trecho, "latin1").toString("utf8");

      // Só aceita a conversão quando ela realmente produz
      // um texto UTF-8 válido e melhora o trecho.
      if (
        !corrigido.includes("\uFFFD") &&
        corrigido !== trecho
      ) {
        return corrigido;
      }

      return trecho;
    } catch {
      return trecho;
    }
  }
);

// Casos específicos que não formam uma sequência UTF-8 completa.
const casos = {
  "AlÃquotas": "Alíquotas",
  "vÃnculo": "vínculo",
  "possÃvel": "possível",
  "pÃ´de": "pôde",
  "Ã  análise": "à análise",
  "Ã  direita": "à direita",
  "Ã  fonte": "à fonte",
  "Ã  aplicação": "à aplicação",
  "Ã  conferência": "à conferência",
  "Ã  regra": "à regra",
  "Ã  validação": "à validação",
  "â€¦": "…",
  "â€“": "–",
  "â€”": "—",
  "âœ“": "✓",
  "â†’": "→",
  "â†³": "↳",
  "Â·": "·"
};

for (const [errado, correto] of Object.entries(casos)) {
  texto = texto.split(errado).join(correto);
}
// Correções finais de sequências incompletas ou símbolos isolados.
const finais = {
  "â...": "...",
  "Ã—": "×",
  "Ã  análise": "à análise",
  "Ã  fontes": "às fontes",
  "Ã  direita": "à direita",
  "Ã  d": "à d",
  "Ã  ": "à "
};

for (const [errado, correto] of Object.entries(finais)) {
  texto = texto.split(errado).join(correto);
}
fs.writeFileSync(arquivo, texto, "utf8");

console.log("Correção automática concluída.");