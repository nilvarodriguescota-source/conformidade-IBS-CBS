const fs = require("fs");

const p = "./src/servidor.ts";
let s = fs.readFileSync(p, "utf8");

const antigo = `function selecionarModoRelatorio(modo){
 modoRelatorioFinal=modo==='sem'?'sem':'com';
 carregarRelatorioFinal();
}`;

const novo = `function selecionarModoRelatorio(modo){
 modoRelatorioFinal=modo==='sem'?'sem':'com';
 const btnCom=document.getElementById('btnRelatorioComValidacao');
 const btnSem=document.getElementById('btnRelatorioSemValidacao');
 if(btnCom) btnCom.classList.toggle('relatorio-final-selecionado',modoRelatorioFinal==='com');
 if(btnSem) btnSem.classList.toggle('relatorio-final-selecionado',modoRelatorioFinal==='sem');
 carregarRelatorioFinal();
}`;

if (!s.includes(antigo)) throw new Error("Função selecionarModoRelatorio não encontrada.");
if (s.includes("const btnCom=document.getElementById('btnRelatorioComValidacao')")) throw new Error("A alteração já existe.");

s = s.replace(antigo, novo);

fs.writeFileSync(p, s, "utf8");
console.log("Estado visual dos botões adicionado com sucesso.");
