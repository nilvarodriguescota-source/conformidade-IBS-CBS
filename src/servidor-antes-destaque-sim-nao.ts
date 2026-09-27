import express from "express";
import fs from "fs";
import path from "path";
import multer from "multer";
import { lerAlertasParaExibicao } from "./alertas-exibicao.js";
import {
  adicionarXmls, incorporarAguardando, lerRespostas, novaAnalise, processarAnaliseAtual, quantidadeAguardando,
  quantidadeDeXmls, registrarResposta,
} from "./analise-atual.js";
import { diferencasDeVereditos } from "./lote-explicativo.js";
import { bloqueiosParaBase, chaveBloqueio, MENSAGEM_BLOQUEIO } from "./bloqueios.js";
import type { AuditoriaOficialDaRegra, BaseNormativa, BloqueioOficial, LacunaDeCobertura, ReducaoDoItem, RespostaValidacao, Veredito, VereditoExplicado } from "./tipos.js";

const app = express();
const PORTA = 3000;

app.use(express.json());

const upload = multer({
  dest: path.join(process.cwd(), "uploads")
});

const arquivoEmpresa = path.join(process.cwd(), "empresa.json");
const pastaSaida = path.join(process.cwd(), "saida-teste");
const arquivoFila = path.join(pastaSaida, "fila-validacao.json");
/** Análise atual: XMLs e respostas desta análise (ver analise-atual.ts). */
const pastaAnalise = path.join(process.cwd(), "analise-atual");
const arquivoBase = path.join(process.cwd(), "data", "base-normativa.json");

// Resultados deixados por versões anteriores (sem análise atual) não pertencem a nenhuma
// análise: a primeira execução começa com uma análise vazia, sem respostas herdadas.
if (!fs.existsSync(pastaAnalise)) {
  novaAnalise(pastaAnalise, pastaSaida);
  console.log("Nova análise iniciada (sem dados de análises anteriores).");
}

function processarAnalise() {
  return processarAnaliseAtual({
    raiz: pastaAnalise,
    arquivoEmpresa,
    pastaSaida,
    arquivoBase,
    arquivoV2: path.join(process.cwd(), "data", "base-normativa.v2.json"),
    arquivoMatriz: path.join(process.cwd(), "docs", "etapa6", "matriz-decisao.json"),
  });
}

function lerJson(arquivo: string, padrao: any = []) {
  try {
    return JSON.parse(fs.readFileSync(arquivo, "utf8"));
  } catch {
    return padrao;
  }
}

/** Descrição legível das regras candidatas, só para exibição na tela de Pendências. */
/**
 * Campos das regras candidatas, lidos da base, só para exibição na tela de Pendências.
 * Quando o identificador corresponde a mais de uma regra, nenhuma é escolhida: um campo só é
 * informado se for igual em todas; as descrições legais diferentes são listadas como estão na base.
 */
function detalharRegras(ncm: string, ids: string[]) {
  const base = lerJson(arquivoBase, { regras: [] }) as BaseNormativa;
  return ids.map((id) => {
    const achadas = base.regras.filter((r) => r.id === id && r.ncm === ncm);
    const comum = <K extends "cst" | "cClassTrib" | "rotulo" | "anexo" | "item" | "descricaoLegal" | "fundamentoLegal" | "reducao">(k: K) => {
      const valores = [...new Set(achadas.map((r) => (r as any)[k] ?? null))];
      return valores.length === 1 ? valores[0]! : null;
    };
    return {
      id,
      cst: comum("cst"),
      cClassTrib: comum("cClassTrib"),
      rotulo: comum("rotulo"),
      anexo: comum("anexo"),
      item: comum("item"),
      descricaoLegal: comum("descricaoLegal"),
      fundamentoLegal: comum("fundamentoLegal"),
      reducao: comum("reducao"),
      identificadorRepetido: achadas.length > 1,
      regrasComEsteIdentificador: achadas.length,
      descricoesLegaisDivergentes: achadas.length > 1 && comum("descricaoLegal") === null
        ? [...new Set(achadas.map((r) => r.descricaoLegal))] : [],
    };
  });
}

app.get("/", (_req, res) => {
  res.send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script><script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels"></script>
<title>Conformidade IBS/CBS</title>
<style>
*{box-sizing:border-box}
body{margin:0;font-family:Arial,Helvetica,sans-serif;background:#f4f6f8;color:#17202a}
header{background:#17202a;color:white;padding:20px 30px}
header h1{margin:0;font-size:25px}
header p{margin:6px 0 0;color:#cbd5e1}
nav{background:white;border-bottom:1px solid #ddd;padding:0 25px;display:flex;gap:5px;flex-wrap:wrap}
nav button{border:0;background:white;padding:15px 18px;cursor:pointer;font-weight:bold;color:#475569}
nav button.active{color:#6d28d9;border-bottom:3px solid #6d28d9}
main{padding:25px;max-width:1500px;margin:auto}
.tela{display:none}
.tela.active{display:block}
.card{background:white;border-radius:10px;padding:22px;margin-bottom:20px;box-shadow:0 2px 8px rgba(0,0,0,.06)}
h2{margin-top:0}
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:15px}
.analise-metricas{grid-template-columns:repeat(auto-fit,minmax(210px,1fr))}
.analise-metricas .label{white-space:nowrap}
.aliquotas-analise{margin-top:20px}
.aliquota-item{display:grid;grid-template-columns:90px 100px 1fr;gap:15px;align-items:start;padding:14px 0;border-bottom:1px solid #e2e8f0}
.aliquota-item:last-child{border-bottom:0}
.aliquota-percentual{font-size:20px;font-weight:bold;color:#6d28d9}
.aliquota-descricao{font-size:13px;color:#475569;line-height:1.5}
.metric{background:white;border:1px solid #e2e8f0;border-radius:10px;padding:18px;box-shadow:0 2px 8px rgba(0,0,0,.06);text-align:center}
.metric .numero{font-size:27px;font-weight:bold;margin-top:8px;text-align:center}

.metric .label{font-size:13px;color:#64748b;text-align:center;white-space:nowrap}

/* Cores suaves dos cards da Análise */
#importar .metric{
  border:1px solid #dbe4ee;
}

#importar .metric:nth-child(1),
#importar .metric:nth-child(2),
#importar .metric:nth-child(3){
  background:#f4f8fc;
  border-color:#d7e5f2;
}

#importar .metric:nth-child(4){
  background:#f1f8f3;
  border-color:#cfe7d5;
}

#importar .metric:nth-child(5){
  background:#fdf3f3;
  border-color:#efd2d2;
}

#importar .metric:nth-child(6){
  background:#f6f3fb;
  border-color:#ded4ef;
}

button.primary{background:#6d28d9;color:white;border:0;border-radius:6px;padding:11px 18px;cursor:pointer;font-weight:bold}
button.secondary{background:#e2e8f0;color:#17202a;border:0;border-radius:6px;padding:10px 16px;cursor:pointer}button.relatorio-final-selecionado{background:#6d28d9;color:white;font-weight:bold;box-shadow:0 0 0 2px #c4b5fd}
button.perigo{background:#fee2e2;color:#991b1b;border:0;border-radius:6px;padding:11px 18px;cursor:pointer;font-weight:bold}
button:disabled{opacity:.45;cursor:not-allowed}
.estado-analise{font-weight:bold;font-size:15px}
.aviso{background:#fef3c7;border:1px solid #f59e0b;color:#78350f;padding:10px 14px;border-radius:6px;margin-bottom:12px}
.metric .numero.CORRETO{color:#15803d}.metric .numero.INCORRETO{color:#dc2626}.metric .numero.REQUER_VALIDACAO{color:#7c3aed}
button.link{background:none;border:0;color:#6d28d9;cursor:pointer;padding:4px;font-size:13px}
input,select{padding:10px;border:1px solid #cbd5e1;border-radius:6px;width:100%}
.filters{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:10px;margin-bottom:15px}
.barra{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:15px}
.barra input[type=file]{width:auto;flex:1;min-width:220px}
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{padding:10px;border-bottom:1px solid #e2e8f0;text-align:left;vertical-align:top}
th{background:#f8fafc}
.itens-resultado{display:flex;flex-direction:column;gap:10px}
.item-res{border:1px solid #e2e8f0;border-left:6px solid #94a3b8;border-radius:8px;background:#fff;padding:12px 14px;font-size:13px;overflow-wrap:anywhere;break-inside:avoid}
.item-res[data-estado=CORRETO]{border-left-color:#15803d}
.item-res[data-estado=INCORRETO_ECONOMIA]{border-left-color:#b45309}
.item-res[data-estado=INCORRETO_RISCO],.item-res[data-estado=INDETERMINADO]{border-left-color:#dc2626}
.item-res[data-estado=REQUER_VALIDACAO]{border-left-color:#7c3aed}
.item-topo{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;padding-bottom:8px;border-bottom:1px solid #f1f5f9}
.item-produto{font-weight:bold;font-size:14px}
.item-selo{text-align:right;white-space:nowrap}
.item-selo .status{font-size:14px}
.item-corpo{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr) minmax(0,1.35fr);gap:14px;margin-top:10px}
.rotulo{display:block;color:#64748b;font-size:11px;text-transform:uppercase;letter-spacing:.03em}
.dados{display:grid;grid-template-columns:1fr 1fr;gap:6px 12px;align-content:start}
.dados div{min-width:0}
.valor{font-weight:bold}
table.confronto{width:100%;border-collapse:separate;border-spacing:0;font-size:13px;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden}
table.confronto th,table.confronto td{padding:5px 8px;border-bottom:1px solid #e2e8f0;white-space:nowrap}
table.confronto tr:last-child td{border-bottom:0}
table.confronto th{background:#f8fafc;font-size:11px;text-transform:uppercase;color:#475569}
table.confronto td:first-child{color:#64748b}
table.confronto td.igual{background:#dcfce7;color:#166534;font-weight:bold}
table.confronto td.difere{background:#fee2e2;color:#991b1b;font-weight:bold}
table.confronto td.indefinido{color:#7c3aed;font-style:italic;white-space:normal}
.confronto-legenda{font-size:11px;color:#64748b;margin-top:4px}
.explica div{margin-bottom:5px}
.reducao{display:grid;grid-template-columns:1fr;gap:4px;background:#fff7ed;border:1px solid #fdba74;border-radius:6px;padding:6px 8px;margin-bottom:6px}
.reducao .valor{font-size:15px;color:#9a3412}
.reducao.sem-evidencia{background:#fefce8;border-color:#facc15}
.reducao.sem-evidencia .valor{color:#854d0e}
.reducao.nao-determinada{background:#f1f5f9;border-color:#cbd5e1}
.reducao.regime{background:#f0f9ff;border-color:#7dd3fc}
.reducao .aviso-d3{font-size:12px;font-weight:bold;color:#92400e}
.reducao ul.fatos,.reducao-prev ul.fatos{margin:2px 0 0;padding-left:16px;font-size:11px;color:#334155}
.reducao div{margin-bottom:0}
.item-res .alertas-item{margin-top:8px;padding-top:6px;border-top:1px dashed #e2e8f0}
@media(max-width:1100px){.item-corpo{grid-template-columns:minmax(0,1fr) minmax(0,1.25fr)}.item-corpo .explica{grid-column:1 / -1}}
@media(max-width:700px){.item-corpo{grid-template-columns:1fr}}
.status{font-weight:bold}
.CORRETO{color:#15803d}
.INCORRETO_ECONOMIA{color:#b45309}
.INCORRETO_RISCO{color:#dc2626}
.REQUER_VALIDACAO{color:#7c3aed}
.NAO_OBRIGATORIO{color:#475569}
.INDETERMINADO{color:#dc2626}
#status{margin-top:15px;font-weight:bold}
.pendente{border:1px solid #e2e8f0;border-radius:8px;padding:15px;margin-bottom:10px;background:#fff}
.pend-topo strong{display:block;margin-bottom:3px;font-size:15px}
.pend-topo{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;padding-bottom:8px;border-bottom:1px solid #f1f5f9}
.pend-ncm{text-align:right;white-space:nowrap}
.regra-cand{margin-top:10px;padding:10px 12px;border:1px solid #e2e8f0;border-left:5px solid #7c3aed;border-radius:6px;background:#fcfcff}
.regra-cand .bloco{margin-top:8px}
.descricao-legal{font-size:14px;line-height:1.45;padding:6px 8px;background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px;overflow-wrap:anywhere}
ul.descricoes{margin:4px 0 0;padding-left:18px;font-size:13px}
.proposto{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px 12px}
.reducao-prev{padding:6px 8px;border:1px solid #86efac;background:#f0fdf4;border-radius:6px}
.reducao-prev.sem-evidencia{border-color:#facc15;background:#fefce8}
.reducao-prev.nao-determinada{border-color:#cbd5e1;background:#f1f5f9}
.valor-grande{font-size:18px;font-weight:bold}
.aud{border:1px solid #cbd5e1;border-radius:6px;padding:6px 8px;background:#f8fafc}
.aud-CONFIRMADA{border-color:#86efac;background:#f0fdf4}
.aud-DIVERGENTE,.aud-NAO_LOCALIZADA{border-color:#fca5a5;background:#fef2f2}
.aud-NAO_DETERMINADA{border-color:#c4b5fd;background:#f5f3ff}
.aud-status{font-weight:bold;font-size:14px;margin-bottom:4px}
.aud .small{margin-top:3px}
.aud-nota{font-style:italic}
.aviso-info{margin-top:6px;padding:6px 8px;background:#eff6ff;border:1px solid #93c5fd;border-radius:4px;font-size:12px;color:#1e3a8a}
.bloqueio{border:2px solid #b91c1c;border-radius:6px;padding:8px 10px;background:#fef2f2;margin-top:8px}
.bloq-titulo{font-weight:bold;color:#991b1b;font-size:14px;letter-spacing:.02em}
.quadro-regra{border:2px solid #0f766e;border-radius:8px;padding:8px 10px;background:#f0fdfa}
.quadro-campos{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px 10px;margin:4px 0 6px}
.red-destaque{font-size:17px;font-weight:bold;color:#0f766e;margin-top:2px}
.red-partes{font-size:13px;font-weight:bold;color:#115e59}
.selo{display:inline-block;margin:4px 6px 0 0;padding:2px 8px;border-radius:12px;font-size:12px;font-weight:bold}
.selo-oficial{background:#dcfce7;color:#166534;border:1px solid #86efac}
.selo-aviso{background:#fef9c3;color:#854d0e;border:1px solid #fde047}
.selo-humano{background:#dbeafe;color:#1e3a8a;border:1px solid #93c5fd}
.selo-pendente{background:#ede9fe;color:#5b21b6;border:1px solid #c4b5fd}
@media(max-width:900px){.quadro-campos{grid-template-columns:repeat(3,minmax(0,1fr))}}
.item-res .quadro-campos{grid-template-columns:repeat(3,minmax(0,1fr))}
#listaResultados{gap:6px}
.item-res.compacto{padding:6px 10px 4px;font-size:12.5px;border-left-width:5px}
.r-linha{display:flex;flex-wrap:wrap;align-items:center;gap:3px 8px;margin-top:3px}
.r-topo{margin-top:0}
.r-prod{font-weight:bold;font-size:13.5px}
.r-lbl{color:#64748b;font-size:10.5px;text-transform:uppercase;letter-spacing:.02em;margin-right:3px}
.r-seta{color:#94a3b8}
.chip{display:inline-block;padding:0 6px;border-radius:4px;background:#f1f5f9;border:1px solid #e2e8f0;white-space:nowrap;line-height:18px}
.chip-r{color:#64748b}
.chip-igual{background:#dcfce7;border-color:#86efac}
.chip-difere{background:#fee2e2;border-color:#fca5a5}
.chip-indef{background:#f5f3ff;border-color:#c4b5fd}
.r-red{font-size:14px;color:#0f766e}
.r-valores>span{margin-right:12px;white-space:nowrap}
.r-div{width:1px;height:14px;background:#cbd5e1;margin:0 4px}
.r-economia{color:#b45309;font-weight:bold}
.r-exposicao{color:#dc2626;font-weight:bold}
.r-motivo{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;margin-top:2px}
.compacto .selo{margin:0;padding:0 7px;line-height:18px}
.r-cab{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}
.r-cab-esq{display:flex;flex-wrap:wrap;align-items:center;gap:3px 8px;min-width:0}
.r-cab-dir{display:flex;align-items:center;flex:0 0 auto;gap:8px}
.compacto .status-selo{font-size:14px;font-weight:bold;padding:2px 12px;border:2px solid currentColor;border-radius:14px;background:#fff;white-space:nowrap}
.r-par{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 12px;align-items:center;padding:1px 6px;border-radius:4px;background:#f8fafc}
.r-inf{margin-top:2px;border-left:3px solid #94a3b8}
.r-enq{margin-top:2px;border-left:3px solid #0f766e}
.r-esq{display:flex;flex-wrap:wrap;align-items:center;gap:3px 6px;min-width:0}
.r-dir{display:flex;gap:12px;justify-content:flex-end;white-space:nowrap}
.r-reducao .r-humano{margin-left:auto}
.aud-det summary{font-size:13px;font-weight:700;margin-top:8px;cursor:pointer}
.item-res[data-estado=CORRETO] .aud-det summary{color:#15803d}
.item-res[data-estado=REQUER_VALIDACAO] .aud-det summary{color:#7c3aed}
.aud-det[open]{border-top:1px dashed #e2e8f0;margin-top:4px;padding-top:4px}
.selo-bloqueio{background:#fee2e2;color:#991b1b;border:1px solid #fca5a5}
.selo-info{background:#eff6ff;color:#1e3a8a;border:1px solid #93c5fd}
.aviso-regra{margin-top:6px;padding:6px 8px;background:#fee2e2;border:1px solid #fca5a5;border-radius:4px;font-size:12px;color:#7f1d1d}
.pergunta-validacao{margin-top:10px;font-weight:bold}
.resposta-registrada{margin-top:6px;font-weight:bold;color:#334155}
@media(max-width:700px){.proposto{grid-template-columns:repeat(2,minmax(0,1fr))}}
.pergunta{margin-top:10px;padding-top:10px;border-top:1px solid #f1f5f9}
.acoes{display:flex;gap:8px;margin-top:8px;flex-wrap:wrap}
.small{font-size:12px;color:#64748b}
details summary{cursor:pointer;color:#475569;font-size:13px;margin-top:8px}
.alertas-item ul,.alertas-cartao ul,.alertas-lote{margin:6px 0 0;padding-left:18px}
.alertas-item li,.alertas-cartao li,.alertas-lote li{margin-bottom:4px}
.alertas-cartao{border:1px dashed #cbd5e1;border-radius:6px;padding:10px;margin-top:10px;background:#fafbfc}
.alertas-totais{width:auto;margin-bottom:10px}
.alerta-cat{display:inline-block;font-size:11px;padding:1px 6px;border-radius:4px;border:1px solid #cbd5e1;background:#f1f5f9;color:#334155}
@media(max-width:900px){.filters{grid-template-columns:1fr 1fr}}
@media print{header,nav,.barra,.filters,button,.nao-imprimir{display:none!important}.tela{display:none!important}.tela.active{display:block!important}main{padding:0}.card{box-shadow:none}}
</style><style>
.valores-grafico{
  display:flex;
  justify-content:center;
  gap:18px;
  flex-wrap:wrap;
  margin-top:12px;
  padding:10px;
  font-size:14px;
  line-height:1.5;
  text-align:center;
}
.valores-grafico strong{
  font-weight:700;
}
</style>
</head>
<body>
<header>
<h1>Conformidade IBS/CBS</h1>
<p>Analise tributaria, validacao e acompanhamento de conformidade</p>
</header>

<nav>
<button class="active" onclick="abrirTela('importar',this)">Análise</button>
<button onclick="abrirTela('dashboard',this)">Dashboard</button>
<button onclick="abrirTela('resultados',this)">Resultados</button>
<button onclick="abrirTela('pendentes',this)">Pendências</button>
<button onclick="abrirTela('relatorio-final',this)">Relatório Final</button>
</nav>

<main>

<section id="importar" class="tela active">
<div class="card">
<h2>Análise atual</h2>
<p id="resumoAnalise" class="estado-analise">Carregando...</p>
<div class="barra">
<input id="arquivos" type="file" multiple accept=".xml">
<button class="secondary" id="btnAdicionar" onclick="adicionarXmls()">Adicionar XMLs</button>
<button class="primary" id="btnProcessar" onclick="processarAnalise()" disabled>▶ Processar análise Processar análise</button>
<button class="perigo" onclick="iniciarNovaAnalise()">Nova análise (limpar dados)</button>
</div>
<p class="small">1. Escolha os arquivos. 2. "Adicionar XMLs" coloca os arquivos na análise atual, sem processar. 3. "Processar análise" analisa todos os XMLs da análise atual. "Nova análise" apaga XMLs, resultados, pendências e respostas da análise atual.</p>
<div id="status"></div>
<div id="resumoProcessamento"></div>
<div class="card aliquotas-analise">
<h3>Alíquotas utilizadas</h3>
<div class="aliquota-item">
<strong>CBS</strong>
<div class="aliquota-percentual">0,90%</div>
<div class="aliquota-descricao">LC 214/2025, período de teste de 2026: CBS de 0,9%, compensável com PIS/Cofins; recolhimento dispensado nos termos do art. 348, § 1º, se cumpridas as obrigações acessórias.</div>
</div>
<div class="aliquota-item">
<strong>IBS</strong>
<div class="aliquota-percentual">0,10%</div>
<div class="aliquota-descricao">LC 214/2025, período de teste de 2026: IBS de 0,1%.</div>
</div>
</div>
</div>
</section>

<section id="dashboard" class="tela">
<h2>Dashboard</h2>
<div class="aviso" id="avisoDashboard" hidden></div>

<div class="dashboard-resumo">
  <div class="card destaque">
    <h3>Situação da empresa</h3>
    <div id="situacaoResumo"></div>
  </div>

  <div class="card destaque">
    <h3>Economia potencial</h3>
    <div id="economiaResumo"></div>
  </div>
</div>

<div class="dashboard-grid">

  <div class="card chart-card">
    <h3>Resultados apurados</h3>
    <p class="subtitulo">Quantidade de itens por situação</p>
    <div class="chart-container"><canvas id="chartResultados"></canvas></div><div id="valoresResultados" class="valores-grafico"></div>
  </div>

  <div class="card chart-card">
    <h3>Conformidade</h3>
    <p class="subtitulo">Distribuição dos itens avaliados</p>
    <div class="chart-container"><canvas id="chartConformidade"></canvas></div><div id="valoresConformidade" class="valores-grafico"></div>
  </div>

</div>

<div class="card chart-card">
  <h3>Produtos e benefícios fiscais</h3>
  <p class="subtitulo">
    Identificação de benefícios, reduções previstas e itens sem benefício identificado
  </p>

  <div class="chart-container chart-container-wide">
    <canvas id="chartProdutos"></canvas>
  </div>

  <div id="detalhesBeneficios"></div>
</div>

<div class="card">
  <h3>Resultados por NCM</h3>
  <div id="tabelaNcm"></div>
</div>


<div class="card">
  <h3>Alíquotas utilizadas</h3>
  <div id="aliquotas"></div>
</div>

</section>

<section id="resultados" class="tela">
<div class="card">
<h2>Resultados</h2>
<div class="aviso" id="avisoResultados" hidden></div>
<div class="filters">
<input id="busca" placeholder="Produto, cProd ou NCM" oninput="renderResultados()">
<select id="filtroResultado" onchange="renderResultados()">
<option value="">Todos os resultados</option>
<option value="CORRETO">Correto</option>
<option value="INCORRETO_ECONOMIA">Incorreto - economia</option>
<option value="INCORRETO_RISCO">Incorreto - risco</option>
<option value="REQUER_VALIDACAO">Precisa validar</option>
<option value="NAO_OBRIGATORIO">Nao obrigatorio</option>
<option value="INDETERMINADO">Indeterminado</option>
</select>
<input id="filtroClass" placeholder="cClassTrib" oninput="renderResultados()">
<input id="filtroCst" placeholder="CST" oninput="renderResultados()">
</div>
<div class="barra"><button class="secondary" onclick="window.print()">Imprimir</button><button class="secondary" onclick="exportarResultados()">Exportar CSV</button><span id="contagemResultados" class="small"></span></div>
<div id="listaResultados" class="itens-resultado"></div>
</div>
</section>

<section id="pendentes" class="tela">
<div class="card">
<h2>Pendências da análise atual</h2>
<div class="aviso" id="avisoPendencias" hidden></div>
<div class="filters">
<input id="buscaPendenteProduto" placeholder="Pesquisar por produto">
<input id="buscaPendenteCprod" placeholder="Pesquisar por cProd">
<input id="buscaPendenteNcm" placeholder="Pesquisar por NCM">
</div>
<div class="barra"><button class="secondary" onclick="window.print()">Imprimir</button><button class="secondary" onclick="exportarPendencias()">Exportar CSV</button><span id="contagemPendencias" class="small"></span></div>
<div id="listaPendentes"></div>
</div>
</section>

<section id="relatorio-final" class="tela">
<div class="card">
<h2>Relatório Final</h2>
<p class="small">Relatório operacional dos produtos que precisam ter o cadastro IBS/CBS ajustado.</p>

<div class="barra">
<button class="secondary" id="btnRelatorioComValidacao" onclick="selecionarModoRelatorio('com')">COM VALIDAÇÃO</button>
<button class="secondary" id="btnRelatorioSemValidacao" onclick="selecionarModoRelatorio('sem')">SEM VALIDAÇÃO</button>
<span id="contagemRelatorioFinal" class="small"></span>
</div>

<div id="explicacaoRelatorioFinal" class="aviso"></div>

<div style="overflow-x:auto;">
<table>
<thead>
<tr>
<th>Código produto</th>
<th>Descrição</th>
<th>NCM</th>
<th>cClassTrib a utilizar</th>
<th>CST a utilizar</th>
<th>Alíquota de registro IBS/CBS</th>
<th>Instrução</th>
</tr>
</thead>
<tbody id="listaRelatorioFinal"></tbody>
</table>
</div>

</div>
</section>
</main>

<script>
Chart.register(ChartDataLabels);
let resultados=[];
let pendentes=[];
let respostas=[];
let alertasUI={disponivel:false,porItemHtml:{},porCartaoHtml:{},painelHtml:''};
let pendentesFiltradas=[];
let resultadosFiltrados=[];
let regrasUI={};
let modoRelatorioFinal='com';
const ROTULO_ESTADO={CORRETO:'CORRETO',INCORRETO_ECONOMIA:'INCORRETO — economia',INCORRETO_RISCO:'INCORRETO — risco',REQUER_VALIDACAO:'PRECISA VALIDAR',NAO_OBRIGATORIO:'NÃO OBRIGATÓRIO',INDETERMINADO:'INDETERMINADO'};

function abrirTela(id,botao){
 document.querySelectorAll('.tela').forEach(x=>x.classList.remove('active'));
 document.getElementById(id).classList.add('active');
 document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
 botao.classList.add('active');
 if(id==='importar') carregarAnalise();
 if(id==='dashboard'){ carregarDashboard(); carregarAlertas(); }
 if(id==='resultados') carregarResultados();
 if(id==='pendentes') carregarPendentes();
 if(id==='relatorio-final') carregarRelatorioFinal();
}

function escaparRelatorio(v){
 return esc(v==null?'':String(v));
}

function reducaoRelatorioFinal(v){
 const r=v&&v.reducaoExibicao;
 if(!r) return 'Não determinada';

 if(r.situacao==='regime_especifico'&&r.regimeEspecifico){
   return pct(r.regimeEspecifico.valor);
 }

 const opcoes=(r.opcoes||[]).filter(o=>o&&o.valor!=null&&o.evidencia!=='nao_determinada');
 const valores=[...new Set(opcoes.map(o=>o.valor))];

 if(valores.length===1) return textoReducao(valores[0]);
 if(valores.length>1) return valores.map(textoReducao).join(' · ');

 return 'Não determinada';
}

function instrucaoRelatorioFinal(cst,cClassTrib,reducao,validado){
 if(!cst||!cClassTrib){
   return validado
     ? 'Não foi possível determinar o CST e o cClassTrib com segurança.'
     : 'Validar o enquadramento antes de alterar o cadastro do produto.';
 }

 const red=reducao&&reducao!=='Não determinada'
   ? ' — '+reducao+' IBS/CBS'
   : '';

 return 'Alterar o cadastro do produto para o CST '+cst+' e cClassTrib '+cClassTrib+red+'.';
}

function selecionarModoRelatorio(modo){
 modoRelatorioFinal=modo==='sem'?'sem':'com';
 const btnCom=document.getElementById('btnRelatorioComValidacao');
 const btnSem=document.getElementById('btnRelatorioSemValidacao');
 if(btnCom) btnCom.classList.toggle('relatorio-final-selecionado',modoRelatorioFinal==='com');
 if(btnSem) btnSem.classList.toggle('relatorio-final-selecionado',modoRelatorioFinal==='sem');
 carregarRelatorioFinal();
}

async function carregarRelatorioFinal(){
 const corpo=document.getElementById('listaRelatorioFinal');
 const contador=document.getElementById('contagemRelatorioFinal');
 const explicacao=document.getElementById('explicacaoRelatorioFinal');

 if(!corpo) return;

 corpo.innerHTML='<tr><td colspan="7">Carregando relatório...</td></tr>';

 try{
   const resultadosApi=await (await fetch('/api/resultados')).json();

   if(modoRelatorioFinal==='com'){
     const mapa=new Map();

     resultadosApi
       .filter(v=>v.estado==='INCORRETO_ECONOMIA'&&v.esperado&&v.cProd)
       .forEach(v=>{
         if(!mapa.has(v.cProd)) mapa.set(v.cProd,v);
       });

     explicacao.textContent='Com validação: produtos que foram validados e, após o reprocessamento, retornaram como INCORRETO — economia.';

     const linhas=[...mapa.values()].map(v=>{
       const cst=v.esperado?.cst||'';
       const cClassTrib=v.esperado?.cClassTrib||'';
       const reducao=reducaoRelatorioFinal(v);

       return '<tr>'+
         '<td>'+escaparRelatorio(v.cProd)+'</td>'+
         '<td>'+escaparRelatorio(v.produto)+'</td>'+
         '<td>'+escaparRelatorio(v.ncm||'')+'</td>'+
         '<td>'+escaparRelatorio(cClassTrib)+'</td>'+
         '<td>'+escaparRelatorio(cst)+'</td>'+
         '<td>'+escaparRelatorio(reducao)+'</td>'+
         '<td>'+escaparRelatorio(instrucaoRelatorioFinal(cst,cClassTrib,reducao,true))+'</td>'+
       '</tr>';
     });

     corpo.innerHTML=linhas.length?linhas.join(''):'<tr><td colspan="7">Nenhum produto retornou como INCORRETO — economia após a validação.</td></tr>';
     contador.textContent=mapa.size+' produto(s)';
     return;
   }

   const fila=await (await fetch('/api/fila-validacao')).json();
   const mapa=new Map();

   if(Array.isArray(fila)){
     fila.forEach(p=>{
       if(!p.cProd) return;
       if(!mapa.has(p.cProd)) mapa.set(p.cProd,p);
     });
   }

   explicacao.textContent='Sem validação: produtos que o sistema identificou como pendentes de enquadramento, sem aguardar a validação do contador. Quando houver mais de uma possibilidade fiscal, o relatório preserva a necessidade de validação.';

   const linhas=[...mapa.values()].map(p=>{
     const regras=(p.regrasDetalhe||[]).filter(r=>r);

     const csts=[...new Set(regras.map(r=>r.cst).filter(Boolean))];
     const classes=[...new Set(regras.map(r=>r.cClassTrib).filter(Boolean))];
     const reducoes=[...new Set(regras
       .map(r=>r.reducao&&r.reducao.valor!=null&&r.reducao.evidencia!=='nao_determinada'
         ? textoReducao(r.reducao.valor)
         : null)
       .filter(Boolean))];

     const cst=csts.length===1?csts[0]:'Depende da validação';
     const cClassTrib=classes.length===1?classes[0]:'Depende da validação';
     const reducao=reducoes.length===1
       ? reducoes[0]
       : reducoes.length>1
         ? reducoes.join(' · ')
         : 'Não determinada';

     const determinado=csts.length===1&&classes.length===1;
     const instrucao=determinado
       ? instrucaoRelatorioFinal(cst,cClassTrib,reducao,false)
       : 'Validar o enquadramento entre as regras candidatas antes de alterar o cadastro do produto.';

     return '<tr>'+
       '<td>'+escaparRelatorio(p.cProd)+'</td>'+
       '<td>'+escaparRelatorio(p.produto)+'</td>'+
       '<td>'+escaparRelatorio(p.ncm||'')+'</td>'+
       '<td>'+escaparRelatorio(cClassTrib)+'</td>'+
       '<td>'+escaparRelatorio(cst)+'</td>'+
       '<td>'+escaparRelatorio(reducao)+'</td>'+
       '<td>'+escaparRelatorio(instrucao)+'</td>'+
     '</tr>';
   });

   corpo.innerHTML=linhas.length?linhas.join(''):'<tr><td colspan="7">Nenhum produto pendente foi encontrado.</td></tr>';
   contador.textContent=mapa.size+' produto(s)';
 }catch(e){
   console.error(e);
   corpo.innerHTML='<tr><td colspan="7">Não foi possível carregar o Relatório Final.</td></tr>';
   contador.textContent='';
 }
}
async function carregarAnalise(){
 try{
   const d=await (await fetch('/api/analise')).json();
   let texto;
   if(!d.processados&&!d.aguardando) texto='Análise vazia. Adicione XMLs para começar.';
   else if(d.aguardando&&!d.processada) texto=d.aguardando+' XML(s) carregado(s) — aguardando processamento.';
   else if(d.aguardando) texto=d.aguardando+' novo(s) XML(s) carregado(s) — aguardando processamento. Os resultados atuais consideram '+d.processados+' XML(s) já processado(s).';
   else if(d.processada) texto='Processamento concluído. '+d.respostas+' resposta(s) registrada(s) nesta análise.';
   else texto='A análise ainda não tem resultado. Clique em "Processar análise".';
   document.getElementById('resumoAnalise').textContent=texto;
   document.getElementById('btnProcessar').disabled=!(d.processados||d.aguardando);
   const aviso=d.aguardando
     ?d.aguardando+' XML(s) carregado(s) aguardando processamento: '+(d.processada?'os dados abaixo ainda não os incluem.':'ainda não há resultados.')+' Use "Processar análise" na tela Análise.'
     :'';
   ['avisoDashboard','avisoResultados','avisoPendencias'].forEach(id=>{const el=document.getElementById(id);el.textContent=aviso;el.hidden=!aviso;});
   document.getElementById('resumoProcessamento').innerHTML=d.processada?renderResumo(d):'';
 }catch(e){
   document.getElementById('resumoAnalise').textContent='Não foi possível carregar a análise atual.';
 }
}

function htmlCards(cards){
 return cards.map(x=>'<div class="metric"><div class="label">'+x[0]+'</div><div class="numero '+(x[2]||'')+'">'+x[1]+'</div></div>').join('');
}

function renderResumo(d){
 const r=d.resumo;
 const cards=[
  ['XMLs processados',r.xmls],
  ['Documentos',r.documentos],
  ['Itens avaliados',r.itens],
  ['CORRETOS',r.corretos,'CORRETO'],
  ['INCORRETOS',r.incorretos,'INCORRETO'],
  ['PRECISAM VALIDAR',r.precisamValidar,'REQUER_VALIDACAO']];
 if(r.naoObrigatorio) cards.push(['Não obrigatórios',r.naoObrigatorio]);
 if(r.indeterminado) cards.push(['Indeterminados',r.indeterminado]);
 return '<div class="grid">'+htmlCards(cards)+'</div>'+
  '<h3>Demais indicadores</h3><div class="grid">'+htmlCards(cardsIndicadores(d.indicadores||{}).slice(3))+'</div>';
}

async function processarAnalise(){
 const botao=document.getElementById('btnProcessar');
 const status=document.getElementById('status');
 botao.disabled=true;
 status.textContent='Processando a análise...';
 try{
   const r=await fetch('/api/processar',{method:'POST'});
   const d=await r.json();
   if(!r.ok) throw new Error(d.detalhe||d.erro||'Erro no processamento.');
   status.textContent='';
   await recarregarTudo();
 }catch(erro){
   status.textContent='Erro: '+erro.message;
   await carregarAnalise();
 }
}

async function recarregarTudo(){
 await carregarAlertas();
 await carregarRespostas();
 carregarAnalise();
 carregarDashboard();
 carregarResultados();
 carregarPendentes();
}

async function adicionarXmls(){
 const input=document.getElementById('arquivos');
 const status=document.getElementById('status');
 if(!input.files.length){
   status.textContent='Selecione pelo menos um arquivo XML.';
   return;
 }
 const form=new FormData();
 for(const arquivo of input.files) form.append('arquivos',arquivo);
 const botao=document.getElementById('btnAdicionar');
 botao.disabled=true;
 status.textContent='Carregando XMLs...';
 try{
   const resposta=await fetch('/api/importar',{method:'POST',body:form});
   const dados=await resposta.json();
   if(!resposta.ok) throw new Error(dados.detalhe||dados.erro||'Erro ao carregar os XMLs.');
   status.textContent=dados.adicionados+' XML(s) adicionado(s) Ã  análise atual, ainda não processado(s).';
   input.value='';
   await carregarAnalise();
 }catch(erro){
   status.textContent='Erro: '+erro.message;
 }
 botao.disabled=false;
}

async function iniciarNovaAnalise(){
 if(!confirm('Iniciar uma nova análise? XMLs, resultados, pendências e respostas da análise atual serão apagados.')) return;
 const status=document.getElementById('status');
 try{
   const r=await fetch('/api/nova-analise',{method:'POST'});
   const d=await r.json();
   if(!r.ok) throw new Error(d.erro||'Erro ao iniciar nova análise.');
   status.textContent='Nova análise iniciada. Adicione os XMLs.';
   await recarregarTudo();
 }catch(erro){
   status.textContent='Erro: '+erro.message;
 }
}

async function carregarDashboard(){
  try{
    const r=await fetch('/api/dashboard');
    const d=await r.json();

    const i=d.indicadores||{};
    const vereditos=Array.isArray(d.vereditos)?d.vereditos:[];
    const explicacoes=d.explicacoes||{};

    const economia=Number(i.economiaPotencial||0);
    const conformidade=Number(i.percentualConformidade||0);

    const situacao=document.getElementById('situacaoResumo');

if(situacao){

  let classificacao='';
  let cor='#c62828';
  let fundo='#ffebee';

  if(conformidade>=0.98){
    classificacao='EXCELENTE';
    cor='#2e7d32';
    fundo='#e8f5e9';
  }else if(conformidade>=0.95){
    classificacao='MUITO BOA';
    cor='#388e3c';
    fundo='#e8f5e9';
  }else if(conformidade>=0.90){
    classificacao='BOA';
    cor='#1976d2';
    fundo='#e3f2fd';
  }else if(conformidade>=0.80){
    classificacao='ATENÇÃO';
    cor='#ef6c00';
    fundo='#fff3e0';
  }else{
    classificacao='CRÍTICA';
    cor='#c62828';
    fundo='#ffebee';
  }

  situacao.innerHTML=
    '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">'+
      '<div style="font-size:30px;font-weight:800;color:#263238">'+
        formatarPercentual(conformidade)+
      '</div>'+
      '<div style="display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border-radius:999px;background:'+fundo+';border:1px solid '+cor+';color:'+cor+';font-size:14px;font-weight:800;letter-spacing:.3px">'+
        '<span style="font-size:16px">●</span>'+
        classificacao+
      '</div>'+
    '</div>'+
    '<p style="margin-top:8px">dos itens avaliados estão em conformidade.</p>';
}

    const economiaResumo=document.getElementById('economiaResumo');
    if(economiaResumo){
      economiaResumo.innerHTML=
        '<div style="font-size:28px;font-weight:700">'+
        formatarNumero(economia)+
        '</div>'+
        '<p>economia potencial identificada na análise.</p>';
    }

    const corretos=Number(i.codigosCorretos||0);
    const incorretos=Number(i.codigosIncorretos||0);
    const pendentes=Number(i.codigosPendentes||0);
    const total=corretos+incorretos+pendentes;

    if(window._chartResultados){
      window._chartResultados.destroy();
    }

    if(window._chartConformidade){
      window._chartConformidade.destroy();
    }

    if(window._chartProdutos){
      window._chartProdutos.destroy();
    }

    const ctxResultados=document.getElementById('chartResultados');

    if(ctxResultados){

      const pluginValoresResultados={
        id:'pluginValoresResultados',

        afterDatasetsDraw:function(chart){

          const ctx=chart.ctx;
          const meta=chart.getDatasetMeta(0);

          ctx.save();

          ctx.textAlign='center';
          ctx.textBaseline='middle';

          meta.data.forEach(function(bar,index){

            const valor=Number(chart.data.datasets[0].data[index]||0);

            const percentual=total
              ? ((valor/total)*100).toFixed(2)
              : '0.00';

            const centroY=(bar.y+bar.base)/2;

            ctx.fillStyle='#ffffff';

            ctx.font='bold 14px Arial';

            ctx.fillText(
              String(valor),
              bar.x,
              centroY-8
            );

            ctx.font='bold 11px Arial';

            ctx.fillText(
              percentual+'%',
              bar.x,
              centroY+9
            );

          });

          ctx.restore();
        }
      };

      window._chartResultados=new Chart(ctxResultados,{
        type:'bar',

        plugins:[ChartDataLabels],

        data:{
          labels:[
            'Corretos',
            'Incorretos',
            'Pendentes'
          ],

          datasets:[{
            label:'Quantidade de itens',

            data:[
              corretos,
              incorretos,
              pendentes
            ],

            backgroundColor:[
              '#2e7d32',
              '#c62828',
              '#ef8f00'
            ]
          }]
        },

        options:{
          responsive:true,
          maintainAspectRatio:false,

          plugins:{datalabels:{display:true,color:'#ffffff',font:{weight:'bold',size:13},formatter:function(value,context){var total=context.dataset.data.reduce(function(a,b){return a+Number(b||0);},0);var p=total?((Number(value)/total)*100).toFixed(2):'0.00';return String(value)+' / '+p+'%';}},legend:{display:false},

            tooltip:{
              callbacks:{
                label:function(context){

                  const valor=Number(context.raw||0);

                  const percentual=total
                    ? ((valor/total)*100).toFixed(2)
                    : '0.00';

                  return ' '+valor+' item(ns) — '+percentual+'%';
                }
              }
            }
          },

          scales:{
            y:{
              beginAtZero:true,

              ticks:{
                precision:0
              }
            }
          }
        }
      });
    }
    const valoresResultados=document.getElementById('valoresResultados');

    if(valoresResultados){
      valoresResultados.innerHTML=
        '<strong>Corretos:</strong> '+corretos+' ('+(total?((corretos/total)*100).toFixed(2):'0.00')+'%) &nbsp; '+
        '<strong>Incorretos:</strong> '+incorretos+' ('+(total?((incorretos/total)*100).toFixed(2):'0.00')+'%) &nbsp; '+
        '<strong>Pendentes:</strong> '+pendentes+' ('+(total?((pendentes/total)*100).toFixed(2):'0.00')+'%)';
    }

    const ctxConformidade=document.getElementById('chartConformidade');

    if(ctxConformidade){

      const pluginValoresConformidade={
        id:'pluginValoresConformidade',

        afterDatasetsDraw:function(chart){

          const ctx=chart.ctx;
          const meta=chart.getDatasetMeta(0);
          const dados=chart.data.datasets[0].data;

          const totalGrafico=dados.reduce(function(soma,valor){
            return soma+Number(valor||0);
          },0);

          ctx.save();
          ctx.textAlign='center';
          ctx.textBaseline='middle';

          meta.data.forEach(function(arco,index){

            const valor=Number(dados[index]||0);

            if(!valor){return;}

            const percentual=totalGrafico
              ? ((valor/totalGrafico)*100).toFixed(2)
              : '0.00';

            const angulo=(arco.startAngle+arco.endAngle)/2;
            const raio=(arco.outerRadius+arco.innerRadius)/2;

            const x=arco.x+Math.cos(angulo)*raio;
            const y=arco.y+Math.sin(angulo)*raio;

            ctx.fillStyle='#ffffff';
            ctx.font='bold 14px Arial';
            ctx.fillText(String(valor),x,y-8);

            ctx.font='bold 11px Arial';
            ctx.fillText(percentual+'%',x,y+9);
          });

          ctx.restore();
        }
      };

      window._chartConformidade=new Chart(ctxConformidade,{
        type:'doughnut',
        plugins:[ChartDataLabels],

        data:{
          labels:['Corretos','Incorretos','Pendentes'],
          datasets:[{
            data:[corretos,incorretos,pendentes],
            backgroundColor:['#2e7d32','#c62828','#ef8f00']
          }]
        },

        options:{
          responsive:true,
          maintainAspectRatio:false,

          plugins:{
            datalabels:{display:true,color:'#ffffff',font:{weight:'bold',size:13},formatter:function(value,context){var total=context.dataset.data.reduce(function(a,b){return a+Number(b||0);},0);var p=total?((Number(value)/total)*100).toFixed(2):'0.00';return String(value)+' / '+p+'%';}},legend:{position:'bottom'},

            tooltip:{
              callbacks:{
                label:function(context){
                  const valor=Number(context.raw||0);
                  const percentual=total
                    ? ((valor/total)*100).toFixed(2)
                    : '0.00';

                  return ' '+valor+' item(ns) — '+percentual+'%';
                }
              }
            }
          }
        }
      });
    }
    const valoresConformidade=document.getElementById('valoresConformidade');

    if(valoresConformidade){
      valoresConformidade.innerHTML=
        '<strong>Corretos:</strong> '+corretos+' ('+(total?((corretos/total)*100).toFixed(2):'0.00')+'%) &nbsp; '+
        '<strong>Incorretos:</strong> '+incorretos+' ('+(total?((incorretos/total)*100).toFixed(2):'0.00')+'%) &nbsp; '+
        '<strong>Pendentes:</strong> '+pendentes+' ('+(total?((pendentes/total)*100).toFixed(2):'0.00')+'%)';
    }

    const comBeneficio=vereditos.filter(function(v){
      return !!v.regraAplicada;
    }).length;

    const pendenteBeneficio=vereditos.filter(function(v){
      return v.estado==='REQUER_VALIDACAO' &&
        (v.regrasCandidatas||[]).length>0;
    }).length;

    const semBeneficio=Math.max(
      vereditos.length-comBeneficio-pendenteBeneficio,
      0
    );

    const ctxProdutos=document.getElementById('chartProdutos');

    if(ctxProdutos){
      window._chartProdutos=new Chart(ctxProdutos,{
        type:'bar',
        data:{
          labels:[
            'Benefício identificado',
            'Benefício pendente',
            'Sem benefício identificado'
          ],
          datasets:[{
            label:'Quantidade de produtos',
            data:[
              comBeneficio,
              pendenteBeneficio,
              semBeneficio
            ],
            backgroundColor:[
              '#2e7d32',
              '#ef8f00',
              '#777'
            ]
          }]
        },
        options:{
          responsive:true,
          maintainAspectRatio:false,
          plugins:{datalabels:{display:true,color:'#ffffff',font:{weight:'bold',size:13},formatter:function(value,context){var total=context.dataset.data.reduce(function(a,b){return a+Number(b||0);},0);var p=total?((Number(value)/total)*100).toFixed(2):'0.00';return String(value)+' / '+p+'%';}},legend:{display:false},
            tooltip:{
              callbacks:{
                label:function(context){
                  return ' '+Number(context.raw||0)+' produto(s)';
                }
              }
            }
          },
          scales:{
            y:{
              beginAtZero:true,
              ticks:{precision:0}
            }
          }
        }
      });
    }

    const tabelaNcm=document.getElementById('tabelaNcm');

    if(tabelaNcm){
      const grupos={
        CORRETO:[],
        INCORRETO_ECONOMIA:[],
        INCORRETO_RISCO:[],
        REQUER_VALIDACAO:[]
      };

      vereditos.forEach(function(v){
        const estado=String(v.estado||'').toUpperCase();

        if(estado==='CORRETO'){
          grupos.CORRETO.push(v);
        }else if(estado.indexOf('INCORRETO')===0){
          if(!grupos[estado]) grupos[estado]=[];
          grupos[estado].push(v);
        }else if(estado==='REQUER_VALIDACAO'){
          grupos.REQUER_VALIDACAO.push(v);
        }
      });

      function ncmDistintos(lista){
        return [...new Set(lista.map(function(v){
          return String(v.ncm||'').trim();
        }).filter(Boolean))];
      }

      const ncmCorretos=ncmDistintos(grupos.CORRETO);
      const ncmIncorretos=ncmDistintos(
        (grupos.INCORRETO_ECONOMIA||[]).concat(grupos.INCORRETO_RISCO||[])
      );
      const ncmPendentes=ncmDistintos(grupos.REQUER_VALIDACAO);

      function cartaoNcm(titulo,quantidade,classe){
  const configuracao={
    'Corretos':{
      simbolo:'✓',
      cor:'#2e7d32',
      fundo:'#e8f5e9',
      borda:'#a5d6a7'
    },
    'Incorretos':{
      simbolo:'!',
      cor:'#c62828',
      fundo:'#ffebee',
      borda:'#ef9a9a'
    },
    'Requer validação':{
      simbolo:'⏳',
      cor:'#ef6c00',
      fundo:'#fff3e0',
      borda:'#ffcc80'
    }
  };

  const cfg=configuracao[titulo]||{
    simbolo:'•',
    cor:'#37474f',
    fundo:'#f5f5f5',
    borda:'#cfd8dc'
  };

  return '<div class="card" style="margin:0;text-align:center;padding:20px 14px;border-radius:14px;border:1px solid '+cfg.borda+';background:'+cfg.fundo+';box-shadow:0 4px 12px rgba(0,0,0,.07);min-height:145px;display:flex;flex-direction:column;justify-content:center">'+
    '<div style="width:46px;height:46px;margin:0 auto 10px;border-radius:50%;background:'+cfg.cor+';color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;box-shadow:0 2px 6px rgba(0,0,0,.12)">'+
      cfg.simbolo+
    '</div>'+
    '<div style="font-size:15px;font-weight:700;color:#263238">'+
      titulo+
    '</div>'+
    '<div style="font-size:32px;font-weight:800;line-height:1.1;margin-top:7px;color:'+cfg.cor+'">'+
      quantidade+
    '</div>'+
    '<div class="small" style="margin-top:4px;color:#607d8b">NCM(s)</div>'+
  '</div>';
}
      function listaNcm(lista){
        if(!lista.length){
          return '<p class="small">Nenhum NCM encontrado para esta situação.</p>';
        }

        return '<div style="display:grid;gap:8px;margin-top:12px">'+
          lista.map(function(v){
            return '<div class="card" style="margin:0">'+
              '<strong>NCM '+esc(v.ncm||'-')+'</strong>'+
              '<div class="small">'+esc(v.produto||'-')+'</div>'+
              '<div class="small">Situação: <strong>'+esc(v.estado||'-')+'</strong></div>'+
              '<div class="small">Base: '+formatarNumero(v.baseCalculo||v.base||0)+'</div>'+
              '</div>';
          }).join('')+
          '</div>';
      }

      tabelaNcm.innerHTML=
        '<div style="display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin-bottom:16px">'+
          cartaoNcm('Corretos',ncmCorretos.length,'resultado-correto')+
          cartaoNcm('Incorretos',ncmIncorretos.length,'resultado-incorreto')+
          cartaoNcm('Requer validação',ncmPendentes.length,'resultado-pendente')+
        '</div>'+
        '<button type="button" class="secondary" id="btnPesquisarNcm">🔎 Pesquisar NCM por situação</button>'+
        '<div id="painelPesquisaNcm" hidden style="margin-top:14px">'+
          '<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center">'+
            '<select id="filtroSituacaoNcm">'+
              '<option value="TODOS">Todos</option>'+
              '<option value="CORRETO">Corretos</option>'+
              '<option value="INCORRETO">Incorretos</option>'+
              '<option value="REQUER_VALIDACAO">Requer validação</option>'+
            '</select>'+
            '<input id="campoPesquisaNcm" placeholder="Digite o NCM ou produto">'+
          '</div>'+
          '<div id="listaPesquisaNcm"></div>'+
        '</div>';

      const btnPesquisarNcm=document.getElementById('btnPesquisarNcm');
      const painelPesquisaNcm=document.getElementById('painelPesquisaNcm');
      const filtroSituacaoNcm=document.getElementById('filtroSituacaoNcm');
      const campoPesquisaNcm=document.getElementById('campoPesquisaNcm');
      const listaPesquisaNcm=document.getElementById('listaPesquisaNcm');

      function atualizarPesquisaNcm(){
        if(!listaPesquisaNcm) return;

        const filtro=filtroSituacaoNcm ? filtroSituacaoNcm.value : 'TODOS';
        const busca=campoPesquisaNcm ?
          String(campoPesquisaNcm.value||'').toLowerCase().trim() : '';

        let lista=vereditos.filter(function(v){
          const estado=String(v.estado||'').toUpperCase();

          let pertence=true;

          if(filtro==='CORRETO'){
            pertence=estado==='CORRETO';
          }else if(filtro==='INCORRETO'){
            pertence=estado.indexOf('INCORRETO')===0;
          }else if(filtro==='REQUER_VALIDACAO'){
            pertence=estado==='REQUER_VALIDACAO';
          }

          if(!pertence) return false;

          if(!busca) return true;

          return String(v.ncm||'').toLowerCase().includes(busca) ||
            String(v.produto||'').toLowerCase().includes(busca);
        });

        listaPesquisaNcm.innerHTML=listaNcm(lista);
      }

      if(btnPesquisarNcm){
        btnPesquisarNcm.onclick=function(){
          if(painelPesquisaNcm){
            painelPesquisaNcm.hidden=!painelPesquisaNcm.hidden;

            if(!painelPesquisaNcm.hidden){
              atualizarPesquisaNcm();
            }
          }
        };
      }

      if(filtroSituacaoNcm){
        filtroSituacaoNcm.onchange=atualizarPesquisaNcm;
      }

      if(campoPesquisaNcm){
        campoPesquisaNcm.oninput=atualizarPesquisaNcm;
      }
    }
    const beneficiosFiscais=document.getElementById('beneficiosFiscais');

    if(beneficiosFiscais){
      const entradas=Object.values(explicacoes.entradas||{});
      const beneficios=entradas.filter(function(e){
        return e.reducao;
      });

      if(beneficios.length){
        beneficiosFiscais.innerHTML=beneficios.map(function(e){
          const reducao=Number(e.reducao.valor||0)*100;

          return '<div class="card" style="margin-top:10px">'+
            '<strong>'+esc(e.produto||'-')+'</strong>'+
            '<p>Redução da alíquota: '+reducao.toFixed(0)+'%</p>'+
            '</div>';
        }).join('');
      }else{
        beneficiosFiscais.innerHTML=
          '<p>Nenhum benefício fiscal identificado.</p>';
      }
    }

    const aliquotas=document.getElementById('aliquotas');

    if(aliquotas){
      aliquotas.innerHTML=
        (i.aliquotasUsadas||[]).map(function(a){
          return '<p><strong>'+
            esc(a.tributo)+
            '</strong>: '+
            formatarPercentual(a.aliquota)+
            ' — '+
            esc(a.fonte)+
            '</p>';
        }).join('')||
        '<p>Sem dados.</p>';
    }

    const detalhesBeneficios=document.getElementById('detalhesBeneficios');

    if(detalhesBeneficios){
      detalhesBeneficios.innerHTML=
        '<p><strong>Produtos avaliados:</strong> '+
        vereditos.length+
        '</p>'+
        '<p><strong>Benefício identificado:</strong> '+
        comBeneficio+
        '</p>'+
        '<p><strong>Benefício pendente:</strong> '+
        pendenteBeneficio+
        '</p>';
    }

  }catch(e){
    console.error('Erro ao carregar Dashboard:',e);

    const aviso=document.getElementById('avisoDashboard');

    if(aviso){
      aviso.hidden=false;
      aviso.textContent=
        'Não foi possível carregar os dados do Dashboard.';
    }
  }
}
function cardsIndicadores(i){
 return [
    ['XMLs processados',i.xmls??'-'],
    ['Documentos',i.documentos??'-'],
    ['Itens / linhas avaliados',i.itensAvaliados??i.itens??'-'],
    ['Códigos únicos avaliados',i.codigosAvaliados??0],
    ['Códigos corretos',i.codigosCorretos??0],
    ['Códigos incorretos',i.codigosIncorretos??0],
    ['Códigos pendentes',i.codigosPendentes??0],
    ['Valor calculado como pago',formatarNumero(i.valorPagoTotal??0)],
    ['Valor correto',formatarNumero(i.valorCorretoTotal??0)],
    ['Economia potencial',formatarNumero(i.economiaPotencial??0)],
    ['Conformidade',formatarPercentual(i.percentualConformidade??0)]];
}

async function carregarRespostas(){
 try{ respostas=await (await fetch('/api/respostas')).json(); }catch(e){ respostas=[]; }
}

async function carregarResultados(){
 try{
   const r=await fetch('/api/resultados');
   resultados=await r.json();
   await carregarRespostas();
   if(!Object.keys(regrasUI).length){ try{ regrasUI=await (await fetch('/api/regras')).json(); }catch(e){ regrasUI={}; } }
   renderResultados();
 }catch(e){
   document.getElementById('listaResultados').innerHTML='<p>Nao foi possivel carregar os resultados.</p>';
 }
}

/** Resposta desta análise para o item (mesma regra de associação do motor: NCM + cProd ou descrição). */
function validacaoDoItem(v){
 const rs=respostas.filter(x=>x.ncm===v.ncm&&(x.cProd===v.cProd||x.cProd===v.produto));
 if(rs.length) return rs.map(x=>x.resposta==='NAO'?'NÃO':'SIM').join(', ')+' (nesta análise)';
 if(v.estado==='REQUER_VALIDACAO') return 'Pendente';
 return '—';
}

function renderResultados(){
 const busca=(document.getElementById('busca').value||'').toLowerCase();
 const filtro=document.getElementById('filtroResultado').value;
 const classe=(document.getElementById('filtroClass').value||'').toLowerCase();
 const cst=(document.getElementById('filtroCst').value||'').toLowerCase();

 resultadosFiltrados=resultados.filter(v=>{
   const texto=[v.produto,v.cProd,v.ncm].join(' ').toLowerCase();
   const informadoClass=(v.informado?.cClassTrib||'').toLowerCase();
   const informadoCst=(v.informado?.cst||'').toLowerCase();
   return (!busca||texto.includes(busca))
     &&(!filtro||v.estado===filtro)
     &&(!classe||informadoClass.includes(classe))
     &&(!cst||informadoCst.includes(cst));
 });
 const unicosPorProduto=new Map();
 resultadosFiltrados=resultadosFiltrados.filter(v=>{if(unicosPorProduto.has(v.cProd)) return false; unicosPorProduto.set(v.cProd,true); return true;});
 document.getElementById('contagemResultados').textContent=resultadosFiltrados.length+' item(ns)';

 document.getElementById('listaResultados').innerHTML=resultadosFiltrados.map(cartaoResultado).join('')||'<p>Nenhum resultado encontrado.</p>';
}

/** Descrição da regra (rótulo, anexo, item), só para exibição; vem da base normativa. */
function nomeRegra(id,ncm){
 const g=regrasUI[id+'|'+ncm];
 return g?textoRegra(Object.assign({id},g)):id;
}

function beneficioDoItem(v){
 if(v.regraAplicada) return 'Aplicado: '+nomeRegra(v.regraAplicada,v.ncm);
 const cand=v.regrasCandidatas||[];
 if(!cand.length) return (v.regrasBloqueadas||[]).length?'Nenhuma regra de benefício aplicável: regra do NCM bloqueada por incompatibilidade oficial':'Nenhum benefício cadastrado para este NCM';
 const nomes=cand.map(id=>nomeRegra(id,v.ncm)).join('; ');
 if(v.estado==='REQUER_VALIDACAO') return 'Enquadramento possível (depende de validação): '+nomes;
 return 'Enquadramento possível, não aplicado: '+nomes;
}

function pct(x){ return (Math.round(x*10000)/100).toLocaleString('pt-BR',{maximumFractionDigits:2})+'%'; }
function textoReducao(r){ return pct(r)+(r===1?' (alíquota zero)':''); }
function textoResultante(r){ return pct(1-r)+' da alíquota padrão'; }

/**
 * Redução do item: vem pronta em v.reducaoExibicao (/api/resultados), resolvida pelo explicador a partir da
 * regra efetivamente identificada. A tela não busca redução por regraId.
 */
function linhaRed(rotulo,valor){ return '<div><span class="rotulo">'+rotulo+'</span><span class="valor">'+esc(valor)+'</span></div>'; }
function textoFato(f){
 const l=f.localizacao||{};
 const onde=l.dispositivo?'LC 214/2025, '+l.dispositivo:l.campo?'SVRS, '+l.campo+(l.cClassTrib?' ('+l.cClassTrib+')':''):'';
 const conteudo=f.trecho!=null?f.trecho:f.valor!=null?String(f.valor):'';
 return f.fonte+(onde?' — '+onde:'')+(conteudo?': '+conteudo:'');
}
function listaFatos(fatos){
 if(!fatos||!fatos.length) return '';
 return '<ul class="fatos">'+fatos.map(f=>'<li>'+esc(textoFato(f))+'</li>').join('')+'</ul>';
}

/** Bloco de uma regra; sufixo "(se o enquadramento for confirmado)" quando a regra ainda não foi escolhida. */
function blocoOpcaoReducao(o,prevista,coerencia,v,varias){
 const suf=prevista?' (se o enquadramento for confirmado)':'';
 const cab=varias?'<div class="small"><strong>'+esc(nomeRegra(o.regraId,v.ncm))+'</strong></div>':'';
 if(o.evidencia==='nao_determinada'||o.valor==null){
   return '<div class="reducao nao-determinada">'+cab+
    '<div><span class="rotulo">Redução da alíquota IBS/CBS'+suf+'</span>Não exibida: a regra não pôde ser identificada com segurança.</div>'+
    '<div class="small">'+esc(o.motivo||'')+'</div></div>';
 }
 if(coerencia===false){
   return '<div class="reducao nao-determinada">'+cab+
    '<div><span class="rotulo">Redução da alíquota IBS/CBS</span>Não confirmada para este item: a economia calculada pelo motor não corresponde ao percentual da regra '+esc(o.regraId)+'.</div></div>';
 }
 const origem='Base normativa — regra '+o.regraId+(o.linhaPlanilha!=null?' (planilha Base de dados, linha '+o.linhaPlanilha+')':'');
 let corpo=linhaRed('Redução da alíquota IBS/CBS'+suf,textoReducao(o.valor))+
  linhaRed('Alíquota resultante'+suf,textoResultante(o.valor))+
  '<div class="small">Origem: '+esc(origem)+'</div>';
 if(o.evidencia==='oficial_confirmada'){
   corpo+='<div><span class="rotulo">Evidência da redução</span><span class="valor">confirmada</span></div>'+
    '<div class="small">Fontes oficiais:</div>'+listaFatos(o.fatos);
   return '<div class="reducao">'+cab+corpo+'</div>';
 }
 if(o.evidencia==='oficial_divergente'){
   corpo+='<div><span class="rotulo">Evidência da redução</span><span class="valor">divergente das fontes oficiais</span></div>'+
    '<div class="small">'+esc(o.motivo||'')+'</div>'+listaFatos(o.fatos);
   return '<div class="reducao sem-evidencia">'+cab+corpo+'</div>';
 }
 // sem_evidencia_oficial
 const foraEscopo=(o.motivo||'').indexOf('fora do escopo auditado')>=0;
 const aud=(v.auditoriaExibicao||{})[o.regraId];
 corpo+='<div><span class="rotulo">Evidência da redução (vínculo registrado)</span><span class="valor">não conferida</span></div>'+
  '<div class="small">'+esc(foraEscopo?(aud?'Código fora do escopo do vínculo formal registrado (Etapa 5: 200033 e 200043)':'Código fora do escopo auditado'):(o.motivo||''))+'</div>'+
  (reducaoConfereNaAuditoria(aud)?'':'<div class="aviso-d3">Percentual e valores calculados com base em dado não confirmado oficialmente.</div>')+
  linhasAuditoriaReducao(aud);
 return '<div class="reducao sem-evidencia">'+cab+corpo+'</div>';
}

function blocoReducao(v){
 const r=v.reducaoExibicao;
 if(!r){
   if(v.reducaoIndisponivel&&(v.regraAplicada||(v.regrasCandidatas||[]).length)) return '<div class="small">Redução indisponível: '+esc(v.reducaoIndisponivel)+'.</div>';
   return '';
 }
 if(r.situacao==='regime_especifico'&&r.regimeEspecifico){
   const g=r.regimeEspecifico;
   return '<div class="reducao regime">'+linhaRed('Redução da alíquota IBS/CBS',textoReducao(g.valor))+
    linhaRed('Alíquota resultante',textoResultante(g.valor))+
    '<div class="small">Origem: Regime específico do motor ('+esc(g.fundamento)+')</div></div>';
 }
 const prevista=r.situacao==='prevista';
 if(!r.opcoes.length) return '';
 return r.opcoes.map(o=>blocoOpcaoReducao(o,prevista,r.coerenciaEconomia,v,r.opcoes.length>1)).join('');
}

/** CORRETO com benefício: o motor calcula este valor sem a redução, então não é chamado de "valor correto". */
function rotuloValorCorreto(v){
 return v.estado==='CORRETO'&&v.regraAplicada?'Valor calculado pelo motor (sem redução)':'Valor correto segundo a regra';
}

/* ---------- Conferência com as fontes oficiais (data/auditoria-oficial.json, via explicador). Só exibição. ---------- */
const ROTULO_AUDITORIA={
 CONFIRMADA:'Regra conferida com a fonte oficial',
 DIVERGENTE:'Regra diverge da fonte oficial',
 NAO_LOCALIZADA:'Regra não localizada nas fontes oficiais',
 NAO_DETERMINADA:'Conferência com a fonte oficial não determinada'
};
const ROTULO_SVRS={PERMITIDO:'PERMITIDO',VEDADO:'VEDADO',PERMITIDO_E_VEDADO:'PERMITIDO e VEDADO',AUSENTE:'não listado para o código'};
function curto(sha){ return String(sha||'').slice(0,12)+'⬦'; }

/** Alertas da regra frente Ã s fontes; nada é bloqueado nesta fase. */
function alertasDaAuditoria(a){
 const ved=(a.fatosF2||[]).filter(f=>f.TipoPermissao==='VEDADO');
 const al=[];
 if(a.situacaoNcmSvrs==='VEDADO'||a.excluidoDoItemDaRegra){
   al.push('A fonte oficial exclui este NCM deste enquadramento'+
    (ved.length?' — SVRS: VEDADO'+(ved[0].DescExcecao?' (exceção: '+ved[0].DescExcecao+')':''):'')+
    (a.excluidoDoItemDaRegra?' — Lei: o item '+a.itemDaBase+' exclui expressamente este NCM':'')+
    '. Nesta fase o sistema ainda permite a validação; o bloqueio automático está reservado para a Fase 2.');
 }
 if(a.situacaoNcmSvrs==='PERMITIDO_E_VEDADO') al.push('O SVRS lista este NCM como PERMITIDO e também como VEDADO para o código; confira as duas entradas.');
 if(a.motivos.some(m=>m.indexOf('NCM só na lei')===0)) al.push('As fontes oficiais divergem: a lei (fonte jurídica primária) cobre este NCM, mas o SVRS (fonte operacional) não o lista para o código. Nenhuma das fontes foi escolhida automaticamente.');
 if(a.motivos.some(m=>m.indexOf('NCM só no SVRS')===0)) al.push('As fontes oficiais divergem: o SVRS (fonte operacional) lista este NCM, mas nenhum item da lei (fonte jurídica primária) o cobre'+(a.excecaoNaLeiEmItens.length?'; a lei o exclui no item '+a.excecaoNaLeiEmItens.join(', '):'')+'. Nenhuma das fontes foi escolhida automaticamente.');
 if(a.itensOficiais.length>1) al.push('O NCM aparece em '+a.itensOficiais.length+' itens da lei ('+a.itensOficiais.join(', ')+'); o item depende do produto.');
 if(a.itensOficiais.length&&!a.itemDaRegraEntreOsOficiais) al.push('O item da base ('+(a.itemDaBase||'vazio')+') não está entre os itens da lei que cobrem o NCM ('+a.itensOficiais.join(', ')+').');
 return al;
}

function blocoAuditoria(a){
 if(!a) return '<div class="bloco aud aud-indisponivel"><span class="rotulo">Conferência com a fonte oficial</span><div class="small">Sem conferência disponível para esta regra (auditoria ausente, desatualizada ou regra não identificada com segurança).</div></div>';
 const lei=(a.fatosF1||[]).filter(f=>f.papel==='cobre o NCM');
 const exclui=(a.fatosF1||[]).filter(f=>f.papel==='exclui o NCM');
 const svrs=a.fatosF2||[];
 const c=a.codigo||{};
 const item='Item da base: '+(a.itemDaBase||'vazio')+
  (a.itemOficial!=null?' · Item oficial: '+a.itemOficial:a.itensOficiais.length>1?' · Itens oficiais possíveis: '+a.itensOficiais.join(', '):' · Item oficial: não identificado');
 const svrsTxt='Situação do NCM no SVRS: '+(ROTULO_SVRS[a.situacaoNcmSvrs]||a.situacaoNcmSvrs)+
  (svrs.length?' — '+[...new Set(svrs.map(f=>(f.TipoPermissao!==a.situacaoNcmSvrs?f.TipoPermissao+': ':'')+f.DescItemAnexo+(f.DescExcecao?' (exceção: '+f.DescExcecao+')':'')))].join(' | '):'');
 const codigoTxt=c.F2?'Código no SVRS: CST '+c.F2.cst+' · cClassTrib '+(a.cClassTrib||'')+' · Anexo '+c.F2.nroAnexo+' · redução '+c.F2.percRedIbs+'% IBS / '+c.F2.percRedCbs+'% CBS':'';
 const fund=c.F1&&c.F1.dispositivo?'Fundamento na lei: '+c.F1.dispositivo+' (fundamento na base: '+(c.comparacao?c.comparacao.fundamento:'—')+')':'';
 const fontes=a.fontes?'Fontes: <a href="'+esc(a.fontes.F1.url+(c.F1&&c.F1.ancora?'#'+c.F1.ancora:''))+'" target="_blank" rel="noopener">LC 214/2025 (Planalto)</a> — texto legal, snapshot '+esc(curto(a.fontes.F1.sha256))+
  ' · <a href="'+esc(a.fontes.F2.url)+'" target="_blank" rel="noopener">SVRS — Classificação Tributária</a> — tabela de apoio, snapshot '+esc(curto(a.fontes.F2.sha256)):'';
 const alertas=alertasDaAuditoria(a);
 return '<div class="bloco aud aud-'+esc(a.status)+'">'+
  '<span class="rotulo">Conferência com a fonte oficial</span>'+
  '<div class="aud-status">'+esc(ROTULO_AUDITORIA[a.status]||a.status)+'</div>'+
  alertas.map(t=>'<div class="aviso-regra">'+esc(t)+'</div>').join('')+
  (lei.length?'<div class="small"><strong>'+esc(lei[0].dispositivo)+':</strong> “'+esc(lei[0].trecho)+'⬝</div>':exclui.length?'':'<div class="small">Nenhum item da lei cobre este NCM.</div>')+
  exclui.map(f=>'<div class="small"><strong>'+esc(f.dispositivo)+' (exclui o NCM):</strong> “'+esc(f.trecho)+'⬝</div>').join('')+
  '<div class="small">'+esc(svrsTxt)+'</div>'+
  '<div class="small">'+esc(item)+'</div>'+
  (codigoTxt?'<div class="small">'+esc(codigoTxt)+'</div>':'')+
  (fund?'<div class="small">'+esc(fund)+'</div>':'')+
  (a.status!=='CONFIRMADA'&&a.motivos.length?'<details class="nao-imprimir"><summary>Motivos da conferência</summary><ul class="fatos">'+a.motivos.map(m=>'<li>'+esc(m)+'</li>').join('')+'</ul></details>':'')+
  (lei.length>1?'<details class="nao-imprimir"><summary>Todos os itens da lei que cobrem o NCM</summary><ul class="fatos">'+lei.map(f=>'<li>'+esc(f.dispositivo+': '+f.trecho)+'</li>').join('')+'</ul></details>':'')+
  (fontes?'<div class="small">'+fontes+'</div>':'')+
  '<div class="small aud-nota">A conferência é da regra. Se o produto atende Ã  descrição legal continua sendo decisão humana.</div>'+
 '</div>';
}

/** Linhas sobre a redução sem vínculo formal: resultado da auditoria do código e D3 (definição aprovada). */
function linhasAuditoriaReducao(a){
 if(!a) return '<div class="small">D3: política pendente</div>';
 const c=a.codigo||{};
 let h='';
 if(c.comparacao&&c.comparacao.reducao==='concorda'&&c.F2) h+='<div class="small aud-red">Auditoria oficial: o percentual confere com '+esc(c.F1&&c.F1.dispositivo||'a lei')+' e com o SVRS ('+esc(c.F2.percRedIbs)+'% IBS / '+esc(c.F2.percRedCbs)+'% CBS). Vínculo formal ainda não registrado (Fase 3).</div>';
 else if(c.comparacao) h+='<div class="aviso-regra">Auditoria oficial: o percentual da base não confere com as fontes (redução: '+esc(c.comparacao.reducao)+').</div>';
 h+=a.status==='CONFIRMADA'
  ?'<div class="small">D3: não se aplica — vínculo NCM × item conferido na auditoria oficial.</div>'
  :'<div class="small">D3: política pendente (vínculo NCM × item não CONFIRMADO).</div>';
 return h;
}

/**
 * Motivo exibido. O motor grava "Benefício confirmado na validação" quando há resposta SIM; na tela isso é a
 * validação humana do enquadramento, que é diferente da conferência oficial da regra. O texto gravado não muda.
 */
const PREFIXO_SIM='Benefício confirmado na validação: ', PREFIXO_VARIOS='Mais de um benefício confirmado para o mesmo item: ';
function reformularMotivo(m){
 m=m||'';
 if(m.indexOf(PREFIXO_SIM)===0) return 'Enquadramento confirmado na validação humana: '+m.slice(PREFIXO_SIM.length);
 if(m.indexOf(PREFIXO_VARIOS)===0) return 'Mais de um enquadramento confirmado na validação humana para o mesmo item: '+m.slice(PREFIXO_VARIOS.length);
 return m;
}
function textoMotivo(v){
 const m=v.motivo||'-';
 if(m.indexOf(PREFIXO_SIM)!==0) return reformularMotivo(m);
 const a=v.regraAplicada&&(v.auditoriaExibicao||{})[v.regraAplicada];
 const lei=a&&(a.fatosF1||[]).find(f=>f.papel==='cobre o NCM');
 const oficial=!a?' Não há conferência da regra com a fonte oficial disponível.'
  :a.status==='CONFIRMADA'?' A regra foi conferida com a fonte oficial'+(lei?' ('+lei.dispositivo+')':'')+'.'
  :' A regra não está conferida com a fonte oficial ('+(ROTULO_AUDITORIA[a.status]||a.status)+').';
 return reformularMotivo(m)+' A aplicação ao caso concreto foi confirmada pela validação humana (resposta SIM).'+oficial;
}

/* ---------- Fase 2: regra bloqueada por incompatibilidade oficial (só exibição; sem SIM/NÃO) ---------- */
function blocoBloqueio(b){
 if(!b) return '';
 const lei=(b.fatosF1||[]);
 const svrs=(b.fatosF2||[]);
 return '<div class="bloco bloqueio">'+
  '<div class="bloq-titulo">BLOQUEADA — incompatibilidade oficial</div>'+
  '<div>Esta regra não pode ser selecionada porque o NCM não é compatível com este enquadramento segundo a fonte oficial.</div>'+
  '<div class="small">Regra '+esc(b.regraId)+' · NCM '+esc(b.ncm)+' · cClassTrib '+esc(b.cClassTrib)+' · item da base '+esc(b.item||'vazio')+'</div>'+
  '<div class="small">Motivo do bloqueio: '+esc(b.motivo)+'</div>'+
  lei.map(f=>'<div class="small"><strong>'+esc(f.dispositivo)+(f.papel==='exclui o NCM'?' (exclui o NCM)':'')+':</strong> “'+esc(f.trecho)+'⬝</div>').join('')+
  (svrs.length?'<div class="small">SVRS: '+esc([...new Set(svrs.map(f=>f.TipoPermissao+' — '+f.DescItemAnexo+(f.DescExcecao?' (exceção: '+f.DescExcecao+')':'')))].join(' | '))+'</div>':'<div class="small">SVRS: NCM não listado para este código.</div>')+
  (b.fontes?'<div class="small">Fontes: <a href="'+esc(b.fontes.F1.url)+'" target="_blank" rel="noopener">LC 214/2025 (Planalto)</a> — snapshot '+esc(curto(b.fontes.F1.sha256))+' · <a href="'+esc(b.fontes.F2.url)+'" target="_blank" rel="noopener">SVRS — Classificação Tributária</a> — snapshot '+esc(curto(b.fontes.F2.sha256))+'</div>':'')+
  '<div class="small aud-nota">O bloqueio é da regra para este NCM. Se o produto se enquadra em outra regra continua sendo avaliado pelas demais regras e pela validação humana.</div>'+
 '</div>';
}
function blocosBloqueioDoItem(v){
 const bs=Object.values(v.bloqueiosExibicao||{});
 return bs.map(blocoBloqueio).join('');
}

/* ---------- Quadro da regra: dados do enquadramento e redução da alíquota em destaque (só exibição) ---------- */
function pctInteiro(n){ return Number(n).toLocaleString('pt-BR',{maximumFractionDigits:2})+'%'; }
function campoQuadro(rotulo,valor){ return '<div><span class="rotulo">'+rotulo+'</span><span class="valor">'+esc(valor==null||valor===''?'—':valor)+'</span></div>'; }
/**
 * d: { cst, cClassTrib, anexo, item, fundamento, reducao (ReducaoExplicada da regra), auditoria, humano: 'confirmado' | 'pendente' | null }
 * A redução exibida é a da regra (reducaoAliquota da base, a mesma do motor); IBS e CBS vêm do SVRS quando conferidos.
 */
function quadroRegra(d){
 const a=d.auditoria, o=d.reducao;
 const f2=a&&a.codigo&&a.codigo.F2;
 const item=a&&a.itemOficial!=null
  ?(a.itemOficial===d.item?d.item:(d.item||'vazio')+' (item oficial: '+a.itemOficial+')')
  :a&&a.itensOficiais&&a.itensOficiais.length>1?(d.item||'vazio')+' (itens oficiais possíveis: '+a.itensOficiais.join(', ')+')':d.item;
 let red='';
 if(o&&o.valor!=null&&o.evidencia!=='nao_determinada'){
   const ibs=f2?f2.percRedIbs:null, cbs=f2?f2.percRedCbs:null;
   const iguais=ibs==null||cbs==null||ibs===cbs;
   red=(iguais?'<div class="red-destaque">Redução da alíquota: '+esc(pct(o.valor))+'</div>':'')+
    (ibs!=null&&cbs!=null?'<div class="'+(iguais?'red-partes':'red-destaque')+'">Redução IBS: '+esc(pctInteiro(ibs))+(iguais?' · ':'</div><div class="red-destaque">')+'Redução CBS: '+esc(pctInteiro(cbs))+'</div>':'')+
    '<div class="selo '+(o.evidencia==='oficial_confirmada'?'selo-oficial':'selo-aviso')+'">'+
     (o.evidencia==='oficial_confirmada'?'Redução da alíquota — confirmada oficialmente'
      :o.evidencia==='oficial_divergente'?'Redução da alíquota — divergente das fontes oficiais'
      :'Redução da alíquota — não confirmada oficialmente (prevista na base normativa)')+'</div>';
 }else if(o){
   red='<div class="small">Redução da alíquota: não exibida — a regra não pôde ser identificada com segurança.</div>';
 }
 const regra=a?(a.status==='CONFIRMADA'?'Regra conferida com a fonte oficial':(ROTULO_AUDITORIA[a.status]||a.status)):'Sem conferência da regra com a fonte oficial';
 const humano=d.humano==='confirmado'?'<div class="selo selo-humano">Enquadramento confirmado na validação humana (resposta SIM nesta análise)</div>'
  :d.humano==='pendente'?'<div class="selo selo-pendente">Enquadramento do produto: aguardando validação humana</div>':'';
 return '<div class="bloco quadro-regra">'+
  '<span class="rotulo">'+esc(d.titulo||'Enquadramento da regra')+'</span>'+
  '<div class="quadro-campos">'+campoQuadro('CST',d.cst)+campoQuadro('cClassTrib',d.cClassTrib)+campoQuadro('Anexo',d.anexo)+campoQuadro('Item',item)+campoQuadro('Fundamento',d.fundamento)+'</div>'+
  red+
  '<div class="selo '+(a&&a.status==='CONFIRMADA'?'selo-oficial':'selo-aviso')+'">'+esc(regra)+'</div>'+
  humano+
  '<div class="small aud-nota">A conferência é da regra. Se o produto atende Ã  descrição legal continua sendo decisão humana.</div>'+
 '</div>';
}
/** Resultados: quadro da regra aplicada (base de regra), ou da única candidata pendente. */
function quadroRegraResultado(v){
 const r=v.reducaoExibicao;
 if(!r||r.situacao==='regime_especifico') return '';
 let id=null, humano=null;
 if(r.situacao==='aplicada'){
   id=v.regraAplicada;
   humano=(respostas||[]).some(x=>x.resposta==='SIM'&&x.regraId===id&&x.ncm===v.ncm&&(x.cProd===v.cProd||x.cProd===v.produto))?'confirmado':null;
 }else if(r.situacao==='prevista'&&r.opcoes.length===1){ id=r.opcoes[0].regraId; humano='pendente'; }
 if(!id) return '';
 const g=regrasUI[id+'|'+v.ncm]||{};
 const o=r.opcoes.find(x=>x.regraId===id)||null;
 return quadroRegra({cst:(r.situacao==='aplicada'&&v.esperado?v.esperado.cst:g.cst),cClassTrib:(r.situacao==='aplicada'&&v.esperado?v.esperado.cClassTrib:g.cClassTrib),
  anexo:g.anexo,item:g.item,fundamento:g.fundamentoLegal,reducao:o,auditoria:(v.auditoriaExibicao||{})[id],humano:humano,
  titulo:r.situacao==='aplicada'?'Enquadramento da regra aplicada':'Enquadramento proposto (regra candidata)'});
}
function reducaoConfereNaAuditoria(a){ return !!(a&&a.codigo&&a.codigo.comparacao&&a.codigo.comparacao.reducao==='concorda'); }

/** Candidatas com tratamentos diferentes (ex.: 60% e alíquota zero): a escolha muda o resultado fiscal. */
function alertaReducoesDiferentes(valores){
 const vs=[...new Set(valores.filter(x=>x!=null))];
 if(vs.length<2) return '';
 return '<div class="aviso-regra">As regras candidatas têm tratamentos diferentes — '+esc(vs.map(textoReducao).join(' e '))+' —: a escolha muda o resultado fiscal. As descrições oficiais não correspondem automaticamente ao produto — confira se o produto e o NCM informado no XML correspondem Ã  descrição legal antes de responder.</div>';
}
/** Lacuna de cobertura: previsão oficial para o NCM sem regra correspondente na base (nenhuma regra é criada). */
function alertaLacunas(ls){
 if(!ls||!ls.length) return '';
 return '<div class="aviso-info">Há previsão no SVRS para este NCM em '+esc([...new Set(ls.map(l=>l.cClassTrib))].join(', '))+' sem regra correspondente na base normativa (lacuna de cobertura; D5 pendente). Nenhuma regra foi criada.</div>';
}
/** Resultados: conferência da regra aplicada, ou resumo das candidatas. */
function blocoAuditoriaResultado(v){
 const au=v.auditoriaExibicao||{};
 const r=v.reducaoExibicao;
 let h='';
 if(v.regraAplicada&&au[v.regraAplicada]) h+=blocoAuditoria(au[v.regraAplicada]);
 else if(r&&r.situacao==='prevista'&&r.opcoes.length){
   h+='<div class="bloco aud"><span class="rotulo">Conferência das regras candidatas com a fonte oficial</span>'+
    r.opcoes.map(o=>{const a=au[o.regraId];return '<div class="small">'+esc(o.regraId)+' — '+esc(a?(ROTULO_AUDITORIA[a.status]||a.status):'sem conferência disponível')+(a?alertasDaAuditoria(a).map(t=>'<div class="aviso-regra">'+esc(t)+'</div>').join(''):'')+'</div>';}).join('')+
    '<div class="small aud-nota">A conferência é da regra. Se o produto atende Ã  descrição legal continua sendo decisão humana (tela Pendências).</div></div>';
   h+=alertaReducoesDiferentes(r.opcoes.map(o=>o.valor));
 }
 h+=alertaLacunas(v.lacunasDeCobertura);
 return h;
}

function celulaEsperada(inf,esp,v){
 if(esp==null) return '<td class="indefinido">'+(v.estado==='REQUER_VALIDACAO'?'depende da validação':'-')+'</td>';
 return '<td class="'+((inf||'')===esp?'igual':'difere')+'">'+esc(esp)+'</td>';
}

/**
 * Resultados em lista compacta: produto e situação (Ã  direita) → informado (base, atual) → enquadramento (correto, economia) → redução. A auditoria (origem,
 * evidência, fontes, textos da lei e do SVRS, bloqueios completos, alertas) fica recolhida e só é montada ao abrir.
 * Os dados recebidos da API não mudam.
 */
function chip(rotulo,valor,classe){ return '<span class="chip'+(classe?' '+classe:'')+'"><span class="chip-r">'+rotulo+'</span> '+esc(valor==null||valor===''?'—':valor)+'</span>'; }
function classeComparada(inf,esp,v){
 if(esp==null) return v.estado==='REQUER_VALIDACAO'?'chip-indef':'';
 return (inf||'')===esp?'chip-igual':'chip-difere';
}
/** Regra que o cartão resume: a aplicada, ou a única candidata pendente. */
function regraDoCartao(v){
 const r=v.reducaoExibicao;
 if(v.regraAplicada&&r&&r.situacao==='aplicada') return {id:v.regraAplicada,situacao:'aplicada',opcao:r.opcoes[0]||null};
 if(r&&r.situacao==='prevista'&&r.opcoes.length===1) return {id:r.opcoes[0].regraId,situacao:'prevista',opcao:r.opcoes[0]};
 return null;
}
function linhaInformado(v){
 const inf=v.informado||{};
 return '<span class="r-lbl">Informado</span>'+chip('CST',inf.cst)+chip('cClassTrib',inf.cClassTrib);
}
function linhaEnquadramento(v){
 const inf=v.informado||{};
 const r=v.reducaoExibicao, rc=regraDoCartao(v);
 if(r&&r.situacao==='regime_especifico'&&r.regimeEspecifico){
   return '<span class="r-lbl">Esperado</span>'+chip('CST',v.esperado&&v.esperado.cst,classeComparada(inf.cst,v.esperado&&v.esperado.cst,v))+chip('cClassTrib',v.esperado&&v.esperado.cClassTrib,classeComparada(inf.cClassTrib,v.esperado&&v.esperado.cClassTrib,v))+chip('Regime',r.regimeEspecifico.fundamento);
 }
 if(rc){
   const g=regrasUI[rc.id+'|'+v.ncm]||{};
   const a=(v.auditoriaExibicao||{})[rc.id];
   const item=a&&a.itemOficial!=null&&a.itemOficial!==g.item?(g.item||'vazio')+' (oficial '+a.itemOficial+')':g.item;
   const cst=rc.situacao==='aplicada'&&v.esperado?v.esperado.cst:g.cst, cls=rc.situacao==='aplicada'&&v.esperado?v.esperado.cClassTrib:g.cClassTrib;
   return '<span class="r-lbl">'+(rc.situacao==='aplicada'?'Enquadramento':'Proposto')+'</span>'+
    chip('CST',cst,rc.situacao==='aplicada'?classeComparada(inf.cst,cst,v):'chip-indef')+chip('cClassTrib',cls,rc.situacao==='aplicada'?classeComparada(inf.cClassTrib,cls,v):'chip-indef')+
    chip('Anexo',g.anexo)+chip('Item',item)+chip('Fund.',g.fundamentoLegal);
 }
 if(r&&r.situacao==='prevista'&&r.opcoes.length>1) return '<span class="r-lbl">'+r.opcoes.length+' regras candidatas</span><span class="small">(escolha na tela Pendências)</span>';
 const esp=v.esperado;
 return esp?'<span class="r-lbl">Esperado</span>'+chip('CST',esp.cst,classeComparada(inf.cst,esp.cst,v))+chip('cClassTrib',esp.cClassTrib,classeComparada(inf.cClassTrib,esp.cClassTrib,v)):'<span class="small">sem enquadramento esperado</span>';
}
function linhaReducao(v){
 const r=v.reducaoExibicao;
 if(!r) return '';
 if(r.situacao==='regime_especifico'&&r.regimeEspecifico) return '<span class="r-lbl">Redução da alíquota</span><b class="r-red">'+esc(pct(r.regimeEspecifico.valor))+'</b><span class="small">regime específico do motor</span>';
 const rc=regraDoCartao(v);
 if(!rc){
   const vs=[...new Set(r.opcoes.filter(o=>o.valor!=null&&o.evidencia!=='nao_determinada').map(o=>o.valor))];
   if(!vs.length) return '';
   return '<span class="r-lbl">Reduções possíveis</span><b class="r-red">'+esc(vs.map(pct).join(' · '))+'</b>'+(vs.length>1?'<span class="selo selo-aviso">tratamentos diferentes: a escolha muda o resultado</span>':'');
 }
 const o=rc.opcao, a=(v.auditoriaExibicao||{})[rc.id], f2=a&&a.codigo&&a.codigo.F2;
 if(!o||o.valor==null||o.evidencia==='nao_determinada') return '<span class="r-lbl">Redução da alíquota</span><span class="small">não exibida (regra não identificada com segurança)</span>';
 if(v.estado==='INCORRETO_ECONOMIA'&&r.coerenciaEconomia===false) return '<span class="r-lbl">Redução da alíquota</span><span class="small">não confirmada para este item (economia do motor não confere com o percentual)</span>';
 const ibsCbs=f2?(f2.percRedIbs===f2.percRedCbs?' · IBS '+pctInteiro(f2.percRedIbs)+' · CBS '+pctInteiro(f2.percRedCbs):' · <b>IBS '+pctInteiro(f2.percRedIbs)+'</b> · <b>CBS '+pctInteiro(f2.percRedCbs)+'</b>'):'';
 const oficial=a&&a.status==='CONFIRMADA'&&o.evidencia==='oficial_confirmada'?'<span class="selo selo-oficial">✓ conferida com a fonte oficial</span>'
  :'<span class="selo selo-aviso">'+esc(a?(ROTULO_AUDITORIA[a.status]||a.status):'sem conferência oficial')+'</span>';
 const sim=rc.situacao==='aplicada'&&(respostas||[]).some(x=>x.resposta==='SIM'&&x.regraId===rc.id&&x.ncm===v.ncm&&(x.cProd===v.cProd||x.cProd===v.produto));
 const humano=sim?'<span class="selo selo-humano r-humano">✓ enquadramento confirmado na validação humana</span>':rc.situacao==='prevista'?'<span class="selo selo-pendente r-humano">aguardando validação humana</span>':'';
 return '<span class="r-lbl">Redução da alíquota</span><b class="r-red">'+esc(pct(o.valor))+'</b>'+ibsCbs+oficial+humano;
}
function valoresInformados(v){
 const vv=x=>x==null?'—':formatarNumero(x);
 return '<span><span class="r-lbl">Base</span>'+formatarNumero(v.baseCalculo||0)+'</span>'+'<span><span class="r-lbl">Atual</span>'+vv(v.valorInformadoTotal)+'</span>';
}
function valoresEnquadramento(v){
 const vv=x=>x==null?'—':formatarNumero(x);
 const partes=['<span><span class="r-lbl">'+(v.estado==='CORRETO'&&v.regraAplicada?'Calculado (sem redução)':'Correto')+'</span>'+vv(v.valorCorreto)+'</span>'];
 if(v.economiaPotencial!=null) partes.push('<span class="'+(v.economiaPotencial>0?'r-economia':'')+'"><span class="r-lbl">Economia</span>'+formatarNumero(v.economiaPotencial)+'</span>');
 if(v.exposicao!=null) partes.push('<span class="r-exposicao"><span class="r-lbl">Exposição</span>'+formatarNumero(v.exposicao)+'</span>');
 return partes.join('');
}
function avisosCompactos(v){
 const av=[];
 const bl=Object.values(v.bloqueiosExibicao||{});
 if(bl.length) av.push('<span class="selo selo-bloqueio">BLOQUEADA — incompatibilidade oficial: '+esc(bl.map(b=>b.regraId).join(', '))+'</span>');
 if((v.lacunasDeCobertura||[]).length) av.push('<span class="selo selo-info">previsão oficial sem regra na base ('+esc([...new Set(v.lacunasDeCobertura.map(l=>l.cClassTrib))].join(', '))+'; D5)</span>');
 if(v.reducaoIndisponivel&&(v.regraAplicada||(v.regrasCandidatas||[]).length)) av.push('<span class="small">Redução indisponível: '+esc(v.reducaoIndisponivel)+'</span>');
 return av.length?'<div class="r-linha">'+av.join('')+'</div>':'';
}
/** Conteúdo da auditoria do item, montado só quando o usuário abre "Auditoria e fontes". */
function auditoriaDetalhadaResultado(v){
 return '<div class="small">Documento '+esc(v.documento)+' · item '+esc(v.nItem)+' · regra aplicada: '+esc(v.regraAplicada||'nenhuma')+'</div>'+
  '<div class="small">Benefício / enquadramento: '+esc(beneficioDoItem(v))+'</div>'+
  quadroRegraResultado(v)+blocoReducao(v)+blocoAuditoriaResultado(v)+blocosBloqueioDoItem(v)+
  '<div class="small">Por que este resultado: '+esc(textoMotivo(v))+'</div>'+
  (v.dadosFaltantes&&v.dadosFaltantes.length?'<div class="small">Dados faltantes: '+esc(v.dadosFaltantes.join(', '))+'</div>':'')+
  (alertasUI.porItemHtml[v.documento+'|'+v.nItem]||'');
}
function cartaoResultado(v,i){
 const red=linhaReducao(v);
 return '<div class="item-res compacto" data-estado="'+esc(v.estado)+'">'+
  '<div class="r-cab">'+
   '<div class="r-cab-esq"><span class="r-prod">'+esc(v.produto)+'</span><span class="small">cProd '+esc(v.cProd||'-')+'</span>'+chip('NCM',v.ncm)+'</div>'+
   '<div class="r-cab-dir"><span class="small">Validação: '+esc(validacaoDoItem(v))+'</span><span class="status status-selo '+esc(v.estado)+'" title="'+esc(v.estado)+'">'+esc(ROTULO_ESTADO[v.estado]||v.estado)+'</span></div>'+
  '</div>'+
  '<div class="r-par r-inf"><div class="r-esq">'+linhaInformado(v)+'</div><div class="r-dir">'+valoresInformados(v)+'</div></div>'+
  '<div class="r-par r-enq"><div class="r-esq"><span class="r-seta">↳</span>'+linhaEnquadramento(v)+'</div><div class="r-dir">'+valoresEnquadramento(v)+'</div></div>'+
  (red?'<div class="r-linha r-reducao">'+red+'</div>':'')+
  avisosCompactos(v)+
  '<div class="r-motivo small" title="'+esc(textoMotivo(v))+'">'+esc(reformularMotivo(v.motivo))+'</div>'+
  '<details class="nao-imprimir aud-det" data-aud="'+i+'"><summary>Auditoria e fontes</summary><div class="aud-conteudo"></div></details>'+
 '</div>';
}
document.addEventListener('toggle',e=>{
 const d=e.target;
 if(!d||!d.matches||!d.matches('details[data-aud]')||!d.open) return;
 const c=d.querySelector('.aud-conteudo');
 if(c&&!c.dataset.pronto){ const v=resultadosFiltrados[+d.dataset.aud]; if(v){ c.innerHTML=auditoriaDetalhadaResultado(v); c.dataset.pronto='1'; } }
},true);

document.addEventListener('click',e=>{
 const b=e.target.closest('[data-validar]');
 if(b) validar(b.dataset.ncm,b.dataset.cprod,b.dataset.regra,b.dataset.validar);
});

async function carregarPendentes(){
 try{
   const r=await fetch('/api/fila-validacao');
   pendentes=await r.json();
   renderPendentes();
 }catch(e){
   document.getElementById('listaPendentes').innerHTML='<p>Nao foi possivel carregar as pendencias.</p>';
 }
}

function textoRegra(g){
 if(!g.rotulo) return g.id;
 const anexo=g.anexo?'Anexo '+g.anexo:'';
 const local=(anexo&&!g.rotulo.includes(anexo)?anexo:'')+(g.item?(anexo&&!g.rotulo.includes(anexo)?', ':'')+'item '+g.item:'');
 return g.rotulo+(local?' ('+local+')':'');
}
function descricaoRegra(g){ return esc(textoRegra(g)); }

/** Status da evidência da redução, a partir da estrutura do explicador (sem outra lógica). */
function statusEvidenciaReducao(o){
 if(o.evidencia==='oficial_confirmada') return {texto:'Confirmada oficialmente para este cClassTrib',fatos:o.fatos,extra:''};
 if(o.evidencia==='oficial_divergente') return {texto:'Divergente das fontes oficiais para este cClassTrib',fatos:o.fatos,extra:o.motivo||''};
 return {texto:'Não confirmada oficialmente para este cClassTrib (benefício previsto na base normativa)',fatos:[],extra:''};
}

/** Bloco da redução prevista na regra candidata. Nada é recalculado: o valor vem de regrasDetalhe[].reducao. */
function blocoReducaoPrevista(g,p){
 const o=g.reducao;
 if(!o){
   return '<div class="bloco"><span class="rotulo">Redução da alíquota IBS/CBS prevista na regra</span>'+
    '<div class="small">Redução indisponível'+(p.reducaoIndisponivel?': '+esc(p.reducaoIndisponivel):'')+'.</div></div>';
 }
 if(o.evidencia==='nao_determinada'||o.valor==null){
   return '<div class="bloco reducao-prev nao-determinada"><span class="rotulo">Redução da alíquota IBS/CBS prevista na regra</span>'+
    '<div>Não exibida: a regra não pôde ser identificada com segurança.</div><div class="small">'+esc(o.motivo||'')+'</div></div>';
 }
 const st=statusEvidenciaReducao(o);
 return '<div class="bloco reducao-prev'+(o.evidencia==='oficial_confirmada'?'':' sem-evidencia')+'">'+
  '<span class="rotulo">Redução da alíquota IBS/CBS prevista na regra</span>'+
  '<div class="valor-grande">'+esc(textoReducao(o.valor))+'</div>'+
  '<div class="small">Alíquota resultante prevista: '+esc(textoResultante(o.valor))+'</div>'+
  '<div><span class="rotulo">Status da evidência da redução</span>'+esc(st.texto)+'</div>'+
  (st.extra?'<div class="small">'+esc(st.extra)+'</div>':'')+
  (st.fatos.length?'<div class="small">Fontes oficiais:</div>'+listaFatos(st.fatos):'')+
  (o.evidencia==='sem_evidencia_oficial'?linhasAuditoriaReducao(g.auditoria):'')+
 '</div>';
}

function campoProposto(rotulo,valor){
 return '<div><span class="rotulo">'+rotulo+'</span><span class="valor">'+esc(valor==null?'não disponível na base':valor)+'</span></div>';
}

/** Uma regra candidata: descrição legal, enquadramento proposto, redução prevista e a pergunta. */
function blocoRegraCandidata(g,p,i,total){
 const resp=(p.respostasDestaAnalise||[]).filter(x=>x.regraId===g.id);
 const descricao=g.descricaoLegal!=null
  ?'<div class="descricao-legal">'+esc(g.descricaoLegal)+'</div>'
  :(g.descricoesLegaisDivergentes&&g.descricoesLegaisDivergentes.length
    ?'<div class="small">A base tem '+esc(g.regrasComEsteIdentificador)+' regras com este identificador, com descrições legais diferentes:</div><ul class="descricoes">'+g.descricoesLegaisDivergentes.map(d=>'<li>'+esc(d)+'</li>').join('')+'</ul>'
    :'<div class="small">Descrição legal não disponível na base para esta regra.</div>');
 const duplicado=g.identificadorRepetido
  ?'<div class="aviso-regra">Atenção: o identificador '+esc(g.id)+' corresponde a '+esc(g.regrasComEsteIdentificador)+' regras na base; a regra não pôde ser identificada com segurança. Pelo comportamento atual do motor, um SIM confirma todas elas ao mesmo tempo e o item continua pendente (mais de um benefício confirmado).</div>'
  :'';
 return '<div class="regra-cand">'+
  '<div class="small">Regra candidata'+(total>1?' '+(i+1)+' de '+total:'')+': '+esc(g.id)+' — aguardando validação</div>'+
  duplicado+
  '<div class="bloco"><span class="rotulo">Descrição legal do benefício</span>'+descricao+'</div>'+
  quadroRegra({cst:g.cst,cClassTrib:g.cClassTrib,anexo:g.anexo,item:g.item,fundamento:g.fundamentoLegal,reducao:g.reducao,auditoria:g.auditoria,humano:'pendente',titulo:'Enquadramento proposto'})+
    '<details>'+
  '<summary>Detalhes</summary>'+
  blocoAuditoria(g.auditoria)+
  blocoReducaoPrevista(g,p)+
  '</details>'+
  (resp.length?'<div class="small resposta-registrada">Resposta registrada nesta análise: '+esc(resp.map(x=>(x.resposta==='NAO'?'NÃO':'SIM')+' ('+x.data+')').join(', '))+'</div>':'')+
  '<div class="pergunta-validacao"><span class="rotulo">Pergunta</span>Com base na descrição legal acima, o produto atende aos requisitos para este enquadramento?</div>'+
  '<div class="acoes">'+
   '<button class="secondary" data-validar="SIM" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regra="'+esc(g.id)+'">SIM</button>'+
   '<button class="secondary" data-validar="NAO" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regra="'+esc(g.id)+'">NÃO</button>'+
  '</div>'+
 '</div>';
}

function renderPendentes(){
 const produto=(document.getElementById('buscaPendenteProduto').value||'').toLowerCase().trim();
 const cProd=(document.getElementById('buscaPendenteCprod').value||'').toLowerCase().trim();
 const ncm=(document.getElementById('buscaPendenteNcm').value||'').toLowerCase().trim();
 pendentesFiltradas=pendentes.filter(p=>
   (!produto||(p.produto||'').toLowerCase().includes(produto)) &&
   (!cProd||(p.cProd||'').toLowerCase().includes(cProd)) &&
   (!ncm||(p.ncm||'').toLowerCase().includes(ncm))
 );
 document.getElementById('contagemPendencias').textContent=pendentesFiltradas.length+' pendência(s)';
 document.getElementById('listaPendentes').innerHTML=pendentesFiltradas.length
  ?pendentesFiltradas.map(p=>{
    const regras=p.regrasDetalhe||(p.regras||[]).map(id=>({id}));
    return '<div class="pendente">'+
     '<div class="pend-topo">'+
      '<div><span class="rotulo">Validação do benefício</span>'+
       '<span class="rotulo">Produto</span><strong>'+esc(p.produto)+'</strong>'+
       '<div class="small">cProd '+esc(p.cProd)+' · '+p.itens+' item(ns) · base '+formatarNumero(p.base)+'</div></div>'+
      '<div class="pend-ncm"><span class="rotulo">NCM</span><span class="valor">'+esc(p.ncm)+'</span></div>'+
     '</div>'+
     alertaReducoesDiferentes(regras.map(g=>g.reducao&&g.reducao.evidencia!=='nao_determinada'?g.reducao.valor:null))+
     alertaLacunas(p.lacunasDeCobertura)+
     regras.map((g,i)=>blocoRegraCandidata(g,p,i,regras.length)).join('')+
     (p.regrasBloqueadasDetalhe||[]).map(blocoBloqueio).join('')+
     '<details class="nao-imprimir"><summary>Detalhes</summary>'+
      '<p class="small">'+esc(reformularMotivo(p.motivo))+'</p>'+
      regras.map(g=>'<p class="small"><strong>'+esc(g.id)+'</strong>'+(g.rotulo?': '+descricaoRegra(g):'')+'</p>').join('')+
      (alertasUI.porCartaoHtml[p.ncm+'|'+p.cProd+'|'+p.produto]||'')+
     '</details>'+
    '</div>';
  }).join('')
  :'<p>Nenhuma pendência na análise atual.</p>';
}

['buscaPendenteProduto','buscaPendenteCprod','buscaPendenteNcm'].forEach(id=>{
 document.getElementById(id).addEventListener('input',renderPendentes);
});

async function validar(ncm,cProd,regraId,resposta){
 const r=await fetch('/api/validar',{
  method:'POST',
  headers:{'Content-Type':'application/json'},
  body:JSON.stringify({ncm,cProd,regraId,resposta,autor:'Sistema'})
 });
 const d=await r.json();
 if(!r.ok){alert(d.erro||'Erro ao validar.');return;}
 await recarregarTudo();
}

async function carregarAlertas(){
 const vazio={disponivel:false,porItemHtml:{},porCartaoHtml:{},painelHtml:''};
 try{
   const r=await fetch('/api/alertas');
   const d=await r.json();
   alertasUI=d&&d.disponivel?d:Object.assign(vazio,{painelHtml:(d&&d.painelHtml)||''});
 }catch(e){
   alertasUI=Object.assign(vazio,{painelHtml:'<h3>Alertas (somente exibição)</h3><p class="small">Alertas indisponíveis. Os resultados continuam válidos e não dependem dos alertas.</p>'});
 }
 
 if(resultados.length) renderResultados();
 if(pendentes.length) renderPendentes();
}

function csv(linhas){
 return linhas.map(l=>l.map(c=>'"'+String(c??'').split('"').join('""')+'"').join(';')).join('\\r\\n');
}
function baixar(nome,conteudo){
 const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob(['\\ufeff'+conteudo],{type:'text/csv;charset=utf-8'}));
 a.download=nome;
 a.click();
}
/** Colunas de redução do CSV, com a mesma regra da tela (nada exibido quando não determinada ou incoerente). */
function reducaoCsv(v,campo){
 const r=v.reducaoExibicao;
 if(!r) return '';
 if(r.situacao==='regime_especifico'&&r.regimeEspecifico){
   const g=r.regimeEspecifico;
   return campo==='reducao'?textoReducao(g.valor):campo==='resultante'?textoResultante(g.valor):campo==='evidencia'?'':'Regime específico do motor ('+g.fundamento+')';
 }
 const suf=r.situacao==='prevista'?' (se o enquadramento for confirmado)':'';
 return r.opcoes.map(o=>{
   const exibe=o.evidencia!=='nao_determinada'&&o.valor!=null&&r.coerenciaEconomia!==false;
   if(campo==='evidencia') return o.regraId+': '+(!exibe?'não determinada':o.evidencia==='oficial_confirmada'?'confirmada':o.evidencia==='oficial_divergente'?'divergente':'não conferida (D3 pendente)');
   if(campo==='origem') return exibe?'Base normativa — regra '+o.regraId+(o.linhaPlanilha!=null?' (linha '+o.linhaPlanilha+')':''):'';
   if(!exibe) return '';
   return (campo==='reducao'?textoReducao(o.valor):textoResultante(o.valor))+suf;
 }).filter(x=>x).join(' | ');
}
function exportarResultados(){
 baixar('resultados.csv',csv([['Produto','cProd','NCM','Base','Resultado','Validação','CST informado','CST esperado','cClassTrib informado','cClassTrib esperado','IBS/CBS informado no XML','Valor correto segundo a regra','Valor calculado pelo motor (sem redução)','Regra aplicada','Benefício / enquadramento','Redução da alíquota IBS/CBS','Alíquota resultante','Evidência da redução','Origem da redução','Economia potencial','Exposição','Motivo','Documento','Item']].concat(
  resultadosFiltrados.map(v=>[v.produto,v.cProd,v.ncm,v.baseCalculo,v.estado,validacaoDoItem(v),v.informado?.cst,v.esperado?.cst,v.informado?.cClassTrib,v.esperado?.cClassTrib,v.valorInformadoTotal,rotuloValorCorreto(v)==='Valor correto segundo a regra'?v.valorCorreto:'',rotuloValorCorreto(v)==='Valor correto segundo a regra'?'':v.valorCorreto,v.regraAplicada,beneficioDoItem(v),reducaoCsv(v,'reducao'),reducaoCsv(v,'resultante'),reducaoCsv(v,'evidencia'),reducaoCsv(v,'origem'),v.economiaPotencial,v.exposicao,textoMotivo(v),v.documento,v.nItem]))));
}
function exportarPendencias(){
 const reducaoPrev=g=>{const o=g.reducao;return !o||o.evidencia==='nao_determinada'||o.valor==null?'':textoReducao(o.valor);};
 const evidencia=g=>{const o=g.reducao;return !o?'indisponível':o.evidencia==='nao_determinada'||o.valor==null?'não determinada':statusEvidenciaReducao(o).texto;};
 baixar('pendencias.csv',csv([['Produto','cProd','NCM','Base','Itens','Regra candidata','Descrição legal do benefício','CST IBS/CBS proposto','cClassTrib proposto','Anexo','Item','Redução prevista na regra','Status da evidência da redução','Resposta nesta análise','Pergunta']].concat(
  pendentesFiltradas.flatMap(p=>(p.regrasDetalhe||(p.regras||[]).map(id=>({id}))).map(g=>[p.produto,p.cProd,p.ncm,p.base,p.itens,g.id,
   g.descricaoLegal!=null?g.descricaoLegal:(g.descricoesLegaisDivergentes||[]).join(' | '),g.cst,g.cClassTrib,g.anexo,g.item,reducaoPrev(g),evidencia(g),
   (p.respostasDestaAnalise||[]).filter(x=>x.regraId===g.id).map(x=>x.resposta).join(', '),
   'Com base na descrição legal acima, o produto atende aos requisitos para este enquadramento?'])))));
}

function formatarNumero(v){
 return Number(v||0).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});
}
function formatarPercentual(v){
 return (Number(v||0)*100).toFixed(2)+'%';
}
function esc(v){
 return String(v??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[m]));
}

carregarAnalise();
carregarDashboard();
carregarAlertas();
carregarRespostas();
</script>
</body>
</html>`);
});

/** Estado da análise atual: XMLs processados, XMLs aguardando processamento e resumo do último processamento. */
app.get("/api/analise", (_req, res) => {
  const processados = quantidadeDeXmls(pastaAnalise);
  const arquivoVereditos = path.join(pastaSaida, "vereditos.json");
  const processada = processados > 0 && fs.existsSync(arquivoVereditos);
  const porEstado: Record<string, number> = {};
  const documentos = new Set<string>();
  if (processada) {
    for (const v of lerJson(arquivoVereditos, []) as { estado: string; documento: string }[]) {
      porEstado[v.estado] = (porEstado[v.estado] ?? 0) + 1;
      documentos.add(v.documento);
    }
  }
  const n = (estado: string) => porEstado[estado] ?? 0;
  res.json({
    processados,
    aguardando: quantidadeAguardando(pastaAnalise),
    respostas: lerRespostas(pastaAnalise).length,
    processada,
    resumo: processada ? {
      xmls: processados,
      documentos: documentos.size,
      itens: Object.values(porEstado).reduce((a, b) => a + b, 0),
      corretos: n("CORRETO"),
      incorretos: n("INCORRETO_ECONOMIA") + n("INCORRETO_RISCO"),
      precisamValidar: n("REQUER_VALIDACAO"),
      naoObrigatorio: n("NAO_OBRIGATORIO"),
      indeterminado: n("INDETERMINADO"),
      porEstado,
    } : null,
    indicadores: processada ? lerJson(path.join(pastaSaida, "indicadores.json"), {}) : null,
  });
});

/** Nova análise: apaga XMLs, resultados, pendências, respostas e alertas da análise atual. */
app.post("/api/nova-analise", (_req, res) => {
  try {
    novaAnalise(pastaAnalise, pastaSaida);
    res.json({ sucesso: true });
  } catch (erro) {
    console.error("Erro ao iniciar nova análise:", erro);
    res.status(500).json({ erro: "Nao foi possivel iniciar a nova analise." });
  }
});

/** Respostas SIM/NÃO dadas nesta análise (não vêm de empresa.json). */
app.get("/api/respostas", (_req, res) => {
  res.json(lerRespostas(pastaAnalise));
});

app.post("/api/validar", (req, res) => {
  try {
    const { ncm, cProd, regraId, resposta, autor, justificativa } = req.body;

    if (!ncm || !cProd || !regraId || !["SIM", "NAO"].includes(resposta)) {
      return res.status(400).json({
        erro: "Dados de validacao invalidos."
      });
    }

    // Fase 2: regra bloqueada por incompatibilidade oficial não aceita validação
    if (bloqueiosParaBase(arquivoBase).has(chaveBloqueio(regraId, ncm))) {
      return res.status(400).json({
        erro: `${MENSAGEM_BLOQUEIO} A validação não está disponível para esta regra.`,
        bloqueada: true
      });
    }

    // A resposta pertence só Ã  análise atual; empresa.json não é alterado.
    const registro: RespostaValidacao = {
      ncm,
      cProd,
      regraId,
      resposta,
      autor: autor || "Sistema",
      data: new Date().toISOString().slice(0, 10),
      ...(justificativa ? { justificativa } : {})
    };
    registrarResposta(pastaAnalise, registro);
    const resultado = processarAnalise();

    res.json({
      sucesso: true,
      mensagem: "Validacao gravada com sucesso.",
      pendencias: resultado.pendencias
    });
  } catch (erro) {
    console.error("Erro ao gravar validacao:", erro);
    res.status(500).json({
      erro: "Nao foi possivel gravar a validacao."
    });
  }
});

/** Adicionar XMLs: acrescenta os arquivos Ã  análise atual, sem processar (ficam aguardando). */
app.post("/api/importar", upload.array("arquivos", 5000), (req, res) => {
  try {
    const arquivos = (req.files ?? []) as Express.Multer.File[];

    if (arquivos.length === 0) {
      return res.status(400).json({
        erro: "Nenhum arquivo XML foi enviado."
      });
    }

    const adicionados = adicionarXmls(pastaAnalise, arquivos.map((a) => ({ nome: a.originalname, caminho: a.path })));

    res.json({
      sucesso: true,
      adicionados,
      aguardando: quantidadeAguardando(pastaAnalise),
      processados: quantidadeDeXmls(pastaAnalise)
    });
  } catch (erro) {
    console.error("Erro ao adicionar XMLs:", erro);

    res.status(500).json({
      erro: "Nao foi possivel adicionar os XMLs.",
      detalhe: erro instanceof Error ? erro.message : String(erro)
    });
  }
});

/** Processar análise: incorpora os XMLs que aguardam e processa todos os XMLs da análise atual. */
app.post("/api/processar", (_req, res) => {
  try {
    if (quantidadeDeXmls(pastaAnalise) + quantidadeAguardando(pastaAnalise) === 0) {
      return res.status(400).json({
        erro: "A analise atual nao tem XMLs. Adicione XMLs antes de processar."
      });
    }
    const incorporados = incorporarAguardando(pastaAnalise);
    const resultado = processarAnalise();

    res.json({
      sucesso: true,
      incorporados,
      xmls: resultado.xmls,
      documentos: resultado.documentos,
      descartados: resultado.descartados,
      indicadores: resultado.indicadores,
      pendencias: resultado.pendencias,
      alertas: resultado.alertas
    });
  } catch (erro) {
    console.error("Erro ao processar a analise:", erro);

    res.status(500).json({
      erro: "Nao foi possivel processar a analise.",
      detalhe: erro instanceof Error ? erro.message : String(erro)
    });
  }
});

app.get("/api/dashboard", (_req, res) => {
  try {
    res.json({
      indicadores: lerJson(path.join(pastaSaida, "indicadores.json"), {}),
      vereditos: lerJson(path.join(pastaSaida, "vereditos.json"), []),
      explicacoes: lerJson(path.join(pastaSaida, "explicacoes.json"), {})
    });
  } catch (erro) {
    res.status(500).json({ erro: "Nao foi possivel carregar o dashboard." });
  }
});

/**
 * Redução por item, como o explicador resolveu (explicacaoInformativa.reducaoDoItem). O servidor não busca
 * vínculos: só lê explicacoes.json, confere que ele corresponde ao vereditos.json atual e entrega por
 * documento + nItem. Sem explicação válida, a redução fica indisponível (nada é presumido).
 */
/** O que a tela mostra de cada item, tal como o explicador resolveu (redução, conferência com as fontes, lacunas). */
interface ExibicaoDoItem {
  reducao: ReducaoDoItem | null;
  auditoria: Record<string, AuditoriaOficialDaRegra>;
  lacunas: LacunaDeCobertura[];
  bloqueios: Record<string, BloqueioOficial>;
}
type ReducoesDaAnalise =
  | { disponivel: true; porItem: Map<string, ExibicaoDoItem>; porPendencia: Map<string, ExibicaoDoItem> }
  | { disponivel: false; motivo: string };
const exibicaoDe = (x: VereditoExplicado): ExibicaoDoItem => ({
  reducao: x.explicacaoInformativa?.reducaoDoItem ?? null,
  auditoria: Object.fromEntries((x.explicacaoInformativa?.regras ?? []).filter((r) => r.auditoriaOficial).map((r) => [r.regraIdInformado, r.auditoriaOficial!])),
  lacunas: x.explicacaoInformativa?.lacunasDeCobertura ?? [],
  bloqueios: Object.fromEntries((x.explicacaoInformativa?.regras ?? []).filter((r) => r.bloqueio).map((r) => [r.regraIdInformado, r.bloqueio!])),
});
let cacheReducoes: { chave: string; valor: ReducoesDaAnalise } | null = null;

function reducoesDaAnalise(vereditos: Veredito[]): ReducoesDaAnalise {
  const arqIndice = path.join(pastaSaida, "reducoes-exibicao.json");
  const arqV = path.join(pastaSaida, "vereditos.json");
  const arqVReal = path.join(pastaSaida, "vereditos.json");
  if (!fs.existsSync(arqIndice) || !fs.existsSync(arqVReal)) {
    return { disponivel: false, motivo: "índice de reduções indisponível para os resultados atuais" };
  }

  const estado = (f: string) => {
    const s = fs.statSync(f);
    return `${s.mtimeMs}:${s.size}`;
  };

  const chave = `${estado(arqIndice)}|${estado(arqVReal)}`;
  if (cacheReducoes?.chave === chave) return cacheReducoes.valor;

  let valor: ReducoesDaAnalise;

  try {
    const indice = JSON.parse(fs.readFileSync(arqIndice, "utf8")) as {
      documento: string;
      nItem: string | number;
      ncm: string;
      cProd: string;
      produto: string;
      estado: string;
      exibicao: ExibicaoDoItem;
    }[];

    const porItem = new Map(
      indice.map((x) => [`${x.documento}|${x.nItem}`, x.exibicao])
    );

    const porPendencia = new Map(
      indice
        .filter((x) => x.estado === "REQUER_VALIDACAO")
        .reverse()
        .map((x) => [`${x.ncm}|${x.cProd}|${x.produto}`, x.exibicao])
    );

    valor = {
      disponivel: true,
      porItem,
      porPendencia,
    };
  } catch {
    valor = {
      disponivel: false,
      motivo: "não foi possível ler o índice de reduções",
    };
  }

  cacheReducoes = { chave, valor };
  return valor;
}

/** Enquadramento pendente: não mostra como "prevista" a regra que esta análise já respondeu NÃO para o item. */
function semRegrasNegadas(r: ReducaoDoItem | null, v: Veredito, respostas: RespostaValidacao[]): ReducaoDoItem | null {
  if (!r || r.situacao !== "prevista") return r;
  const negadas = new Set(respostas
    .filter((x) => x.resposta === "NAO" && x.ncm === v.ncm && (x.cProd === v.cProd || x.cProd === v.produto))
    .map((x) => x.regraId));
  return { ...r, opcoes: r.opcoes.filter((o) => !negadas.has(o.regraId)) };
}

app.get("/api/resultados", (_req, res) => {
  try {
    const vereditos = lerJson(path.join(pastaSaida, "vereditos.json"), []) as Veredito[];
    const reducoes = reducoesDaAnalise(vereditos);
    const respostas = lerRespostas(pastaAnalise);
    res.json(vereditos.map((v) => {
      if (!reducoes.disponivel) return { ...v, reducaoExibicao: null, reducaoIndisponivel: reducoes.motivo, auditoriaExibicao: null, lacunasDeCobertura: [], bloqueiosExibicao: {} };
      const e = reducoes.porItem.get(`${v.documento}|${v.nItem}`);
      return { ...v, reducaoExibicao: semRegrasNegadas(e?.reducao ?? null, v, respostas), auditoriaExibicao: e?.auditoria ?? {}, lacunasDeCobertura: e?.lacunas ?? [], bloqueiosExibicao: e?.bloqueios ?? {} };
    }));
  } catch (erro) {
    res.status(500).json({
      erro: "Nao foi possivel carregar os resultados."
    });
  }
});

/**
 * Rótulo, anexo, item e cClassTrib de cada regra da base (por regra + NCM), só para os textos dos Resultados.
 * A redução de alíquota NÃO sai daqui: vem por item em /api/resultados, da regra identificada pelo explicador.
 */
app.get("/api/regras", (_req, res) => {
  const base = lerJson(arquivoBase, { regras: [] }) as BaseNormativa;
  const mapa: Record<string, {
    rotulo: string | null; anexo: string | null; item: string | null; cClassTrib: string | null; cst: string | null; fundamentoLegal: string | null;
  }> = {};
  for (const r of base.regras) {
    mapa[`${r.id}|${r.ncm}`] ??= {
      rotulo: r.rotulo ?? null, anexo: r.anexo ?? null, item: r.item ?? null, cClassTrib: r.cClassTrib ?? null, cst: r.cst ?? null, fundamentoLegal: r.fundamentoLegal ?? null,
    };
  }
  res.json(mapa);
});

app.get("/api/fila-validacao", (_req, res) => {
  try {
    const dados = lerJson(arquivoFila, []) as { ncm: string; cProd: string; produto: string; regras: string[] }[];
    // Redução e evidência de cada regra candidata: as mesmas que o explicador resolveu (reducaoDoItem.opcoes)
    const reducoes = reducoesDaAnalise(lerJson(path.join(pastaSaida, "vereditos.json"), []) as Veredito[]);
    const respostas = lerRespostas(pastaAnalise);
    res.json(dados.map((p) => {
      const doGrupo = reducoes.disponivel ? reducoes.porPendencia.get(`${p.ncm}|${p.cProd}|${p.produto}`) ?? null : null;
      return {
        ...p,
        regrasDetalhe: detalharRegras(p.ncm, p.regras ?? []).map((g) => ({
          ...g,
          reducao: doGrupo?.reducao?.opcoes.find((o) => o.regraId === g.id) ?? null,
          auditoria: doGrupo?.auditoria[g.id] ?? null,
        })),
        lacunasDeCobertura: doGrupo?.lacunas ?? [],
        regrasBloqueadasDetalhe: Object.values(doGrupo?.bloqueios ?? {}),
        reducaoIndisponivel: reducoes.disponivel ? null : reducoes.motivo,
        respostasDestaAnalise: respostas.filter((x) => x.ncm === p.ncm && (x.cProd === p.cProd || x.cProd === p.produto)),
      };
    }));
  } catch (erro) {
    console.error("Erro ao ler fila-validacao.json:", erro);

    res.status(500).json({
      erro: "Nao foi possivel ler a fila de validacao."
    });
  }
});

// Alertas somente para exibição. Não altera resultados, indicadores nem validações.
app.get("/api/alertas", (_req, res) => {
  res.json(lerAlertasParaExibicao(pastaSaida));
});

app.listen(PORTA, () => {
  console.log(`Servidor iniciado em http://localhost:${PORTA}`);
});










































