/** Análise atual: nova análise começa limpa, XMLs acumulam, só são processados ao processar, e respostas não vazam entre análises. */
import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, writeFileSync, existsSync, rmSync } from "node:fs";
import { createHash } from "node:crypto";
import { join } from "node:path";
import { tmpdir } from "node:os";
import {
  adicionarXmls, incorporarAguardando, lerRespostas, novaAnalise, processarAnaliseAtual, quantidadeAguardando, quantidadeDeXmls, registrarResposta,
} from "../src/analise-atual.js";
import type { Veredito } from "../src/tipos.js";

function nfe(chave: string, cProd: string, xProd: string, ncm = "19059090"): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe><infNFe Id="NFe${chave}" versao="4.00">
    <ide><mod>65</mod><serie>1</serie><nNF>1</nNF>
      <dhEmi>2026-09-01T12:00:00-03:00</dhEmi><tpNF>1</tpNF><finNFe>1</finNFe></ide>
    <emit><CNPJ>00000000000000</CNPJ><CRT>3</CRT><enderEmit><UF>SC</UF></enderEmit></emit>
    <dest><CPF>00000000000</CPF><indIEDest>9</indIEDest><enderDest><UF>SC</UF></enderDest></dest>
    <det nItem="1">
      <prod><cProd>${cProd}</cProd><xProd>${xProd}</xProd><NCM>${ncm}</NCM><CFOP>5102</CFOP>
        <qCom>1.0000</qCom><vProd>100.00</vProd><vDesc>0.00</vDesc></prod>
      <imposto><IBSCBS><CST>000</CST><cClassTrib>000001</cClassTrib>
         <gIBSCBS><vBC>100.00</vBC>
           <gIBSUF><pIBSUF>0.1</pIBSUF></gIBSUF><gIBSMun><pIBSMun>0</pIBSMun></gIBSMun><gCBS><pCBS>0.9</pCBS></gCBS>
         </gIBSCBS></IBSCBS></imposto>
    </det>
  </infNFe></NFe>
  <protNFe><infProt><chNFe>${chave}</chNFe><cStat>100</cStat></infProt></protNFe>
</nfeProc>`;
}

const chave = (n: number) => "4326090000000000000065001000000" + String(n).padStart(3, "0") + "1000000017";

function ambiente() {
  const dir = mkdtempSync(join(tmpdir(), "analise-"));
  const raiz = join(dir, "analise-atual");
  const saida = join(dir, "saida");
  const empresa = join(dir, "empresa.json");
  // empresa.json com uma validação antiga: não pode ser usada pela análise
  const cfg = JSON.parse(readFileSync("empresa.json", "utf8"));
  cfg.validacoes = [{ ncm: "19059090", cProd: "A1", regraId: "19059090-200003-I-16", resposta: "SIM", autor: "Antigo", data: "2026-01-01" }];
  writeFileSync(empresa, JSON.stringify(cfg, null, 2));
  const enviar = (nome: string, conteudo: string) => {
    const tmp = join(dir, "upload-" + nome);
    writeFileSync(tmp, conteudo);
    return { nome, caminho: tmp };
  };
  // reprocessar: o que o servidor faz ao registrar uma resposta (só os XMLs já processados)
  const reprocessar = () => processarAnaliseAtual({
    raiz, arquivoEmpresa: empresa, pastaSaida: saida, arquivoBase: "data/base-normativa.json",
    arquivoV2: "data/base-normativa.v2.json", arquivoMatriz: "docs/etapa6/matriz-decisao.json",
  });
  // processar: o botão "Processar análise" (incorpora os que aguardam e processa)
  const processar = () => { incorporarAguardando(raiz); return reprocessar(); };
  const vereditos = () => JSON.parse(readFileSync(join(saida, "vereditos.json"), "utf8")) as Veredito[];
  const fila = () => JSON.parse(readFileSync(join(saida, "fila-validacao.json"), "utf8")) as { cProd: string; regras: string[] }[];
  const hashEmpresa = () => createHash("sha256").update(readFileSync(empresa)).digest("hex");
  return { dir, raiz, saida, empresa, enviar, processar, reprocessar, vereditos, fila, hashEmpresa };
}

test("validação antiga do empresa.json não é aplicada: o item continua pendente", () => {
  const a = ambiente();
  novaAnalise(a.raiz, a.saida);
  adicionarXmls(a.raiz, [a.enviar("n1.xml", nfe(chave(1), "A1", "PAO FRANCES"))]);
  const r = a.processar();
  assert.equal(r.xmls, 1);
  assert.equal(a.vereditos()[0]!.estado, "REQUER_VALIDACAO");
  assert.equal(a.fila().length, 1);
  rmSync(a.dir, { recursive: true, force: true });
});

test("resposta da análise atual é aplicada, gravada na análise e não altera empresa.json", () => {
  const a = ambiente();
  novaAnalise(a.raiz, a.saida);
  adicionarXmls(a.raiz, [a.enviar("n1.xml", nfe(chave(1), "A1", "PAO FRANCES"))]);
  a.processar();
  const antes = a.hashEmpresa();
  const regra = a.fila()[0]!.regras[0]!;
  registrarResposta(a.raiz, { ncm: "19059090", cProd: "A1", regraId: regra, resposta: "SIM", autor: "Sistema", data: "2026-09-24" });
  a.processar();
  assert.notEqual(a.vereditos()[0]!.estado, "REQUER_VALIDACAO");
  assert.equal(a.fila().length, 0);
  assert.equal(lerRespostas(a.raiz).length, 1);
  assert.equal(a.hashEmpresa(), antes);
  // explicações e alertas usam a configuração sem respostas
  const expl = JSON.parse(readFileSync(join(a.saida, "explicacoes.json"), "utf8"));
  assert.ok(expl.entradas.empresa.caminho.endsWith("empresa-config.json"));
  assert.deepEqual(JSON.parse(readFileSync(expl.entradas.empresa.caminho, "utf8")).validacoes, []);
  rmSync(a.dir, { recursive: true, force: true });
});

test("nova análise apaga XMLs, respostas e resultados da análise anterior", () => {
  const a = ambiente();
  novaAnalise(a.raiz, a.saida);
  adicionarXmls(a.raiz, [a.enviar("n1.xml", nfe(chave(1), "A1", "PAO FRANCES"))]);
  a.processar();
  registrarResposta(a.raiz, { ncm: "19059090", cProd: "A1", regraId: a.fila()[0]!.regras[0]!, resposta: "SIM", autor: "Sistema", data: "2026-09-24" });
  a.processar();

  novaAnalise(a.raiz, a.saida);
  assert.equal(quantidadeDeXmls(a.raiz), 0);
  assert.deepEqual(lerRespostas(a.raiz), []);
  for (const f of ["vereditos.json", "fila-validacao.json", "indicadores.json", "explicacoes.json", "alertas.json"]) {
    assert.equal(existsSync(join(a.saida, f)), false, f);
  }
  // mesmo produto em outra análise: volta a ser pendente
  adicionarXmls(a.raiz, [a.enviar("n2.xml", nfe(chave(2), "A1", "PAO FRANCES"))]);
  a.processar();
  assert.equal(a.vereditos()[0]!.estado, "REQUER_VALIDACAO");
  assert.equal(a.vereditos().length, 1);
  rmSync(a.dir, { recursive: true, force: true });
});

test("adicionar XMLs acumula na análise atual e mantém as respostas dela", () => {
  const a = ambiente();
  novaAnalise(a.raiz, a.saida);
  adicionarXmls(a.raiz, [a.enviar("n1.xml", nfe(chave(1), "A1", "PAO FRANCES"))]);
  a.processar();
  registrarResposta(a.raiz, { ncm: "19059090", cProd: "A1", regraId: a.fila()[0]!.regras[0]!, resposta: "SIM", autor: "Sistema", data: "2026-09-24" });
  adicionarXmls(a.raiz, [a.enviar("n2.xml", nfe(chave(2), "B2", "PAO DE QUEIJO"))]);
  const r = a.processar();
  assert.equal(r.xmls, 2);
  assert.equal(a.vereditos().length, 2);
  const porCprod = Object.fromEntries(a.vereditos().map((v) => [v.cProd, v.estado]));
  assert.notEqual(porCprod["A1"], "REQUER_VALIDACAO");
  assert.equal(porCprod["B2"], "REQUER_VALIDACAO");
  assert.deepEqual(a.fila().map((p) => p.cProd), ["B2"]);
  rmSync(a.dir, { recursive: true, force: true });
});

test("XMLs adicionados aguardam o processamento e não entram ao responder uma pendência", () => {
  const a = ambiente();
  novaAnalise(a.raiz, a.saida);
  adicionarXmls(a.raiz, [a.enviar("n1.xml", nfe(chave(1), "A1", "PAO FRANCES"))]);
  assert.equal(quantidadeAguardando(a.raiz), 1);
  assert.equal(quantidadeDeXmls(a.raiz), 0);
  assert.equal(existsSync(join(a.saida, "vereditos.json")), false, "adicionar não processa");
  a.processar();
  assert.equal(quantidadeAguardando(a.raiz), 0);
  assert.equal(a.vereditos().length, 1);
  // novo XML adicionado depois de processar: fica aguardando, sem apagar o que já foi processado
  adicionarXmls(a.raiz, [a.enviar("n2.xml", nfe(chave(2), "B2", "PAO DE QUEIJO"))]);
  assert.equal(quantidadeAguardando(a.raiz), 1);
  assert.equal(quantidadeDeXmls(a.raiz), 1);
  registrarResposta(a.raiz, { ncm: "19059090", cProd: "A1", regraId: a.fila()[0]!.regras[0]!, resposta: "SIM", autor: "Sistema", data: "2026-09-24" });
  a.reprocessar();
  assert.deepEqual(a.vereditos().map((v) => v.cProd), ["A1"], "responder não processa os XMLs que aguardam");
  assert.equal(quantidadeAguardando(a.raiz), 1);
  const r = a.processar();
  assert.equal(r.xmls, 2);
  assert.deepEqual(a.vereditos().map((v) => v.cProd).sort(), ["A1", "B2"]);
  assert.deepEqual(lerRespostas(a.raiz).map((x) => x.cProd), ["A1"]);
  rmSync(a.dir, { recursive: true, force: true });
});

test("nova análise também apaga os XMLs que aguardavam processamento", () => {
  const a = ambiente();
  novaAnalise(a.raiz, a.saida);
  adicionarXmls(a.raiz, [a.enviar("n1.xml", nfe(chave(1), "A1", "PAO FRANCES"))]);
  novaAnalise(a.raiz, a.saida);
  assert.equal(quantidadeAguardando(a.raiz), 0);
  assert.equal(a.processar().xmls, 0);
  rmSync(a.dir, { recursive: true, force: true });
});

test("análise vazia não deixa resultados", () => {
  const a = ambiente();
  novaAnalise(a.raiz, a.saida);
  const r = a.processar();
  assert.equal(r.xmls, 0);
  assert.equal(existsSync(join(a.saida, "vereditos.json")), false);
  rmSync(a.dir, { recursive: true, force: true });
});
