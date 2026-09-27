const fs = require("fs");

const p = "./src/servidor.ts";
let s = fs.readFileSync(p, "utf8");

const antigo = `function blocoRegraCandidata(g,p,i,total){
 const resp=(p.respostasDestaAnalise||[]).filter(x=>x.regraId===g.id);`;

const novo = `function blocoRegraCandidata(g,p,i,total){
 const resp=(p.respostasDestaAnalise||[]).filter(x=>x.regraId===g.id);
 const respostaAtual=resp.length?resp[resp.length-1].resposta:null;
 const classeSim=respostaAtual==='SIM'?' validacao-selecionada':'';
 const classeNao=respostaAtual==='NAO'?' validacao-selecionada':'';`;

if (!s.includes(antigo)) {
  throw new Error("Trecho de blocoRegraCandidata não encontrado.");
}

if (s.includes("const respostaAtual=resp.length?resp[resp.length-1].resposta:null;")) {
  throw new Error("A lógica de seleção já foi adicionada.");
}

s = s.replace(antigo, novo);

const botaoSimAntigo = `'<button class="secondary" data-validar="SIM" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regra="'+esc(g.id)+'">SIM</button>'+`;
const botaoSimNovo = `'<button class="secondary'+classeSim+'" data-validar="SIM" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regra="'+esc(g.id)+'">SIM</button>'+`;

const botaoNaoAntigo = `'<button class="secondary" data-validar="NAO" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regra="'+esc(g.id)+'">NÃO</button>'+`;
const botaoNaoNovo = `'<button class="secondary'+classeNao+'" data-validar="NAO" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regra="'+esc(g.id)+'">NÃO</button>'+`;

if (!s.includes(botaoSimAntigo)) {
  throw new Error("Botão SIM não encontrado.");
}

if (!s.includes(botaoNaoAntigo)) {
  throw new Error("Botão NÃO não encontrado.");
}

s = s.replace(botaoSimAntigo, botaoSimNovo);
s = s.replace(botaoNaoAntigo, botaoNaoNovo);

fs.writeFileSync(p, s, "utf8");
console.log("Seleção visual dos botões SIM/NÃO adicionada com sucesso.");
