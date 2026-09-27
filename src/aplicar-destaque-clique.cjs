const fs = require("fs");

const p = "./src/servidor.ts";
let s = fs.readFileSync(p, "utf8");

const antigo = `document.addEventListener('click',e=>{
 const b=e.target.closest('[data-validar]');
 if(b) validar(b.dataset.ncm,b.dataset.cprod,b.dataset.regra,b.dataset.validar);
});`;

const novo = `document.addEventListener('click',e=>{
 const b=e.target.closest('[data-validar]');
 if(b){
  b.classList.add('validacao-selecionada');
  validar(b.dataset.ncm,b.dataset.cprod,b.dataset.regra,b.dataset.validar);
 }
});`;

if (!s.includes(antigo)) {
  console.log("Trecho esperado nao encontrado. Nenhuma alteracao feita.");
  process.exit(1);
}

s = s.replace(antigo, novo);
fs.writeFileSync(p, s, "utf8");

console.log("Destaque visual adicionado ao clique. Funcao validar permanece inalterada.");
