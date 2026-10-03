/** HTML da aplicação. `cabecalhoExtra` entra antes dos scripts (a versão web injeta ali o navegador.js). */
export function paginaHtml(cabecalhoExtra = ""): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="theme-color" content="#2C4233">
<link rel="icon" type="image/png" href="marca/icone.png">
<link rel="preload" href="vendor/cormorant-garamond-latin-700-normal.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="vendor/cormorant-garamond-latin-600-normal.woff2" as="font" type="font/woff2" crossorigin>
${cabecalhoExtra}<script src="vendor/chart.umd.js"></script><script src="vendor/chartjs-plugin-datalabels.min.js"></script>
<script src="vendor/xlsx-mini.js"></script>
<script src="vendor/jspdf.umd.min.js"></script>
<script src="vendor/jspdf.plugin.autotable.min.js"></script>
<title>Conformidade IBS/CBS · Sabores Estratégicos</title>
<style>
/* ============ Identidade visual Sabores Estratégicos ============
   Verde da coruja (#2C4233) como cor institucional, dourado (#AC9368) nos detalhes e
   fundos off-white. Só aparência: regras, textos dos resultados e ações não dependem daqui. */
@font-face{font-family:"Cormorant Garamond";font-style:normal;font-weight:600;font-display:swap;src:url(vendor/cormorant-garamond-latin-600-normal.woff2) format("woff2")}
@font-face{font-family:"Cormorant Garamond";font-style:normal;font-weight:700;font-display:swap;src:url(vendor/cormorant-garamond-latin-700-normal.woff2) format("woff2")}
:root{
 --verde-900:#1B2B21;--verde-800:#23372B;--verde-700:#2C4233;--verde-600:#3A5543;--verde-500:#557060;
 --verde-300:#A8BBAD;--verde-200:#CBD8CE;--verde-100:#E4ECE6;--verde-50:#F1F5F1;
 --ouro-800:#6B5427;--ouro-700:#7E6531;--ouro-600:#96794A;--ouro-500:#AC9368;--ouro-400:#C9AE7C;
 --ouro-300:#DCC9A3;--ouro-200:#EADDC2;--ouro-100:#F4ECDC;--ouro-50:#FAF6EC;
 --creme:#F4EEE2;--papel:#F6F3EC;--papel-2:#EFEAE0;--superficie:#FFFDF9;--superficie-2:#FAF8F3;
 --linha:#E6E0D3;--linha-2:#D9D1C1;
 --texto:#1D2922;--texto-2:#46544B;--texto-3:#626E66;
 --ok:#2E6B45;--ok-fundo:#EAF3EC;--ok-borda:#BFD8C6;--ok-forte:#3A7A52;
 --economia:#8F5316;--economia-fundo:#FBF1E4;--economia-borda:#EBCFA6;--economia-forte:#B26B26;
 --risco:#9C2F25;--risco-fundo:#FAEDEA;--risco-borda:#EBC5BE;--risco-forte:#A53E33;
 --pendente:#7A5E24;--pendente-fundo:#F8F1E0;--pendente-borda:#E4D0A2;--pendente-forte:#A8863F;
 --neutro:#5A665F;--neutro-fundo:#F0EFEA;--neutro-borda:#D8D6CC;
 --info:#44544B;--info-fundo:#F2F0E9;--info-borda:#DCD5C6;
 --sombra-1:0 1px 2px rgba(29,41,34,.05);
 --sombra-2:0 1px 2px rgba(29,41,34,.04),0 10px 28px -14px rgba(29,41,34,.20);
 --serif:"Cormorant Garamond","Palatino Linotype",Palatino,"Book Antiqua",Georgia,serif;
 --sans:system-ui,-apple-system,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
}
*{box-sizing:border-box}
[hidden]{display:none!important}
html{scroll-padding-top:72px}
body{margin:0;font-family:var(--sans);font-size:15px;line-height:1.5;font-variant-numeric:lining-nums;background:var(--papel);color:var(--texto);-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}
::selection{background:var(--ouro-200);color:var(--verde-900)}
a{color:var(--verde-600);text-decoration-color:var(--ouro-400);text-underline-offset:2px}
a:hover{color:var(--verde-900)}
.ico{width:18px;height:18px;flex:none;fill:none;stroke:currentColor;stroke-width:1.8;stroke-linecap:round;stroke-linejoin:round;vertical-align:middle}

/* ---------- Cabeçalho ---------- */
header.topo{position:relative;display:flex;align-items:center;gap:28px;padding:18px max(32px,calc((100% - 1500px) / 2 + 32px));background:linear-gradient(115deg,var(--verde-700) 0%,var(--verde-800) 62%,#1E3125 100%);color:var(--creme);overflow:hidden}
.marca{display:flex;align-items:center;gap:14px;flex:none}
.marca-coruja{display:block;height:56px;width:auto}
.marca-assinatura{display:block;height:42px;width:auto}
.topo-titulo{min-width:0;padding-left:28px;border-left:1px solid rgba(201,174,124,.45)}
header.topo h1{margin:0;font-family:var(--serif);font-weight:600;font-size:30px;line-height:1.05;letter-spacing:.01em;color:#FBF7EE}
header.topo p{margin:5px 0 0;font-size:13.5px;color:rgba(244,238,226,.74)}
.cabecalho-impressao{display:none}

/* ---------- Navegação ---------- */
nav{position:sticky;top:0;z-index:40;display:flex;gap:2px;padding:0 max(16px,calc((100% - 1500px) / 2 + 16px));background:var(--verde-800);border-top:1px solid rgba(244,238,226,.07);box-shadow:inset 0 -1px 0 rgba(201,174,124,.38),0 8px 18px -12px rgba(15,25,19,.55);overflow-x:auto;scrollbar-width:none}
nav::-webkit-scrollbar{display:none}
nav button{position:relative;display:inline-flex;align-items:center;gap:8px;flex:none;border:0;background:transparent;padding:14px 16px 15px;cursor:pointer;font-family:var(--sans);font-size:14px;font-weight:600;letter-spacing:.01em;color:rgba(244,238,226,.74);white-space:nowrap;transition:color .15s,background-color .15s}
nav button .ico{width:17px;height:17px;opacity:.85}
nav button:hover{color:#FBF7EE;background:rgba(244,238,226,.06)}
nav button.active{color:#FFFDF6;background:rgba(244,238,226,.08)}
nav button.active .ico{color:var(--ouro-400);opacity:1}
nav button.active::after{content:"";position:absolute;left:10px;right:10px;bottom:0;height:3px;border-radius:3px 3px 0 0;background:var(--ouro-400)}
nav button:focus-visible{outline:2px solid var(--ouro-400);outline-offset:-4px;border-radius:8px}

/* ---------- Estrutura ---------- */
main{max-width:1500px;margin:0 auto;padding:30px 32px 40px}
.tela{display:none}
.tela.active{display:block;animation:surgir .28s ease-out}
@keyframes surgir{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}
.card{background:var(--superficie);border:1px solid var(--linha);border-radius:14px;padding:26px 28px;margin-bottom:22px;box-shadow:var(--sombra-2)}
.card .card{background:var(--superficie-2);box-shadow:none;border-radius:12px;padding:20px 22px}
h1,h2,h3,h4{color:var(--verde-900)}
h2{margin:0 0 20px;font-family:var(--serif);font-weight:700;font-size:34px;line-height:1.05;letter-spacing:.005em}
h2::after{content:"";display:block;width:46px;height:2px;margin-top:12px;background:linear-gradient(90deg,var(--ouro-500),var(--ouro-300))}
h3{margin:0 0 14px;font-family:var(--serif);font-weight:700;font-size:23px;line-height:1.15}
h4{margin:0 0 8px;font-size:14px;font-weight:700;letter-spacing:.01em}
p{margin:0 0 10px}
.small{font-size:12px;color:var(--texto-3)}
.rotulo{display:block;color:var(--texto-3);font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.06em}
.valor{font-weight:700}
.rodape{display:flex;align-items:center;justify-content:center;gap:10px;padding:22px 16px 30px;color:var(--texto-3);font-size:12.5px;letter-spacing:.02em}
.rodape img{height:24px;width:auto;opacity:.9}
.rodape strong{font-family:var(--serif);font-size:16px;font-weight:700;color:var(--verde-700);letter-spacing:.04em}
.rodape-sep{width:1px;height:14px;background:var(--linha-2)}

/* ---------- Botões ---------- */
button{font-family:var(--sans)}
button.primary,button.secondary,button.perigo{display:inline-flex;align-items:center;justify-content:center;gap:8px;min-height:40px;padding:9px 18px;border-radius:10px;font-size:14px;font-weight:600;letter-spacing:.01em;line-height:1.2;cursor:pointer;transition:background-color .15s,border-color .15s,color .15s,box-shadow .15s}
button.primary{background:var(--verde-700);color:#FBF8F1;border:1px solid var(--verde-700);box-shadow:0 1px 2px rgba(29,41,34,.2),inset 0 1px 0 rgba(255,255,255,.07)}
button.primary:hover:not(:disabled){background:var(--verde-800);border-color:var(--verde-800)}
button.primary:active:not(:disabled){background:var(--verde-900);border-color:var(--verde-900)}
button.secondary{background:var(--superficie);color:var(--verde-800);border:1px solid var(--linha-2);box-shadow:var(--sombra-1)}
button.secondary:hover:not(:disabled){background:var(--verde-50);border-color:var(--verde-500)}
button.secondary:active:not(:disabled){background:var(--verde-100)}
button.perigo{background:var(--risco-fundo);color:var(--risco);border:1px solid var(--risco-borda)}
button.perigo:hover:not(:disabled){background:#F5DFDA;border-color:#DDA59B}
button.relatorio-final-selecionado,button.relatorio-final-selecionado:hover:not(:disabled),
button.validacao-selecionada,button.validacao-selecionada:hover:not(:disabled){background:var(--verde-700);color:#FBF8F1;border-color:var(--verde-700);box-shadow:0 0 0 3px var(--ouro-200)}
button.link{background:none;border:0;color:var(--verde-600);cursor:pointer;padding:4px;font-size:13px}
button:disabled{opacity:.45;cursor:not-allowed}
button:focus-visible{outline:2px solid var(--ouro-500);outline-offset:2px}
.segmentado{display:inline-flex;flex-wrap:wrap;gap:4px;padding:4px;border:1px solid var(--linha-2);border-radius:12px;background:var(--papel)}
.segmentado button.secondary{min-height:36px;padding:7px 14px;border-color:transparent;background:transparent;box-shadow:none;font-size:13px;letter-spacing:.04em;color:var(--texto-2)}
.segmentado button.secondary:hover:not(:disabled){background:var(--superficie);border-color:var(--linha);color:var(--verde-900)}
.segmentado button.relatorio-final-selecionado,.segmentado button.relatorio-final-selecionado:hover:not(:disabled){background:var(--verde-700);border-color:var(--verde-700);color:#FBF8F1;box-shadow:0 1px 3px rgba(29,41,34,.25)}

/* ---------- Campos ---------- */
input,select{font-family:var(--sans);font-size:14px;color:var(--texto);background-color:var(--superficie);padding:10px 12px;border:1px solid var(--linha-2);border-radius:10px;width:100%;min-height:42px;transition:border-color .15s,box-shadow .15s}
input::placeholder{color:#8A938D}
input:hover,select:hover{border-color:var(--verde-300)}
input:focus,select:focus{outline:none;border-color:var(--verde-600);box-shadow:0 0 0 3px var(--ouro-100)}
select{appearance:none;-webkit-appearance:none;padding-right:38px;cursor:pointer;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232C4233' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:right 12px center;background-size:16px}
.filters{display:grid;grid-template-columns:2fr 1fr 1fr 1fr;gap:12px;margin-bottom:14px}
.barra{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-bottom:16px}
.barra .small{margin-left:4px}

/* ---------- Análise atual ---------- */
.painel-analise{position:relative;overflow:hidden;padding:30px 32px}
.painel-analise::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,var(--verde-700),var(--ouro-500))}
.estado-analise{display:flex;align-items:center;gap:12px;margin:0 0 22px;padding:12px 16px;border:1px solid var(--verde-100);border-radius:10px;background:var(--verde-50);font-size:14.5px;font-weight:600;color:var(--verde-900)}
.estado-analise::before{content:"";flex:none;width:9px;height:9px;border-radius:50%;background:var(--ouro-500);box-shadow:0 0 0 4px var(--ouro-100)}
.upload{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(0,1fr);gap:18px;margin-bottom:18px}
.upload-zona{position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;min-height:178px;padding:26px 22px;text-align:center;border:1.5px dashed var(--ouro-400);border-radius:14px;background:linear-gradient(180deg,var(--ouro-50),var(--superficie));cursor:pointer;transition:border-color .15s,background-color .15s,box-shadow .15s}
.upload-zona:hover,.upload-zona.arrastando{border-color:var(--verde-600);background:var(--verde-50)}
.upload-zona:focus-within,.upload-zona.arrastando{box-shadow:0 0 0 4px var(--ouro-100);border-color:var(--verde-600)}
.upload-zona input[type=file]{position:absolute;inset:0;width:100%;height:100%;min-height:0;margin:0;padding:0;border:0;opacity:0;cursor:pointer}
.upload-icone{display:flex;align-items:center;justify-content:center;width:48px;height:48px;margin-bottom:4px;border-radius:50%;background:var(--verde-700);color:var(--creme);box-shadow:0 0 0 6px var(--verde-100)}
.upload-icone .ico{width:22px;height:22px}
.upload-titulo{font-size:15.5px;font-weight:700;color:var(--verde-900)}
.upload-detalhe{font-size:12.5px;color:var(--texto-3)}
.upload-selecao{margin-top:8px;max-width:100%;padding:4px 14px;border:1px solid var(--linha);border-radius:999px;background:var(--superficie);font-size:12.5px;font-weight:600;color:var(--texto-2);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.upload-zona.com-arquivos{border-style:solid;border-color:var(--verde-500)}
.upload-zona.com-arquivos .upload-selecao{background:var(--verde-700);border-color:var(--verde-700);color:#FBF8F1}
.upload-passos{display:flex;flex-direction:column;justify-content:center;gap:14px;margin:0;padding:20px 22px;list-style:none;counter-reset:passo;border:1px solid var(--linha);border-radius:14px;background:var(--superficie-2)}
.upload-passos li{counter-increment:passo;display:grid;grid-template-columns:28px minmax(0,1fr);gap:12px;align-items:start;font-size:13.5px;line-height:1.45;color:var(--texto-2)}
.upload-passos li::before{content:counter(passo);display:flex;align-items:center;justify-content:center;width:28px;height:28px;margin-top:-4px;border:1.5px solid var(--ouro-500);border-radius:50%;background:var(--superficie);font-family:var(--serif);font-size:16px;font-weight:700;color:var(--ouro-700)}
.upload-passos strong{color:var(--verde-900)}
.acoes-analise{margin-bottom:8px}
.acoes-analise .perigo{margin-left:auto}
.nota-analise{margin:0}
#status:not(:empty){margin-top:14px;padding:10px 14px;border-left:3px solid var(--ouro-500);border-radius:8px;background:var(--ouro-50);font-size:14px;font-weight:600;color:var(--verde-900)}
#resumoProcessamento:not(:empty){margin-top:24px;padding-top:24px;border-top:1px solid var(--linha)}
#resumoProcessamento h3{margin-top:28px}
.analise-complementos{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.35fr);gap:20px;align-items:start;margin-top:24px}
.analise-complementos .card{margin:0}
.aliquota-item{display:grid;grid-template-columns:64px 104px minmax(0,1fr);gap:16px;align-items:center;padding:14px 0;border-bottom:1px solid var(--linha)}
.aliquota-item:last-child{border-bottom:0;padding-bottom:0}
.aliquota-item>strong{display:flex;align-items:center;justify-content:center;height:30px;border-radius:8px;background:var(--verde-700);color:#FBF8F1;font-size:12.5px;letter-spacing:.1em}
.aliquota-percentual{font-family:var(--serif);font-size:30px;font-weight:700;line-height:1;color:var(--ouro-700)}
.aliquota-descricao{font-size:13px;line-height:1.55;color:var(--texto-2)}
#beneficioAtividadeConteudo .aliquota-descricao{padding:5px 0}
#beneficioAtividadeConteudo>.selo{margin:0 0 10px}

/* ---------- Indicadores ---------- */
.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:14px}
#resumoProcessamento h3+.grid{grid-template-columns:repeat(4,minmax(0,1fr))}
.metric{position:relative;overflow:hidden;background:var(--superficie);border:1px solid var(--linha);border-radius:12px;padding:16px 18px 15px 20px;box-shadow:var(--sombra-1);text-align:left}
.metric::before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:var(--ouro-300)}
.metric .label{font-size:12.5px;font-weight:600;color:var(--texto-3);letter-spacing:.01em;text-align:left}
.metric .numero{margin-top:6px;font-family:var(--serif);font-size:34px;font-weight:700;line-height:1.05;color:var(--verde-900);text-align:left;font-variant-numeric:lining-nums}
.metric .numero .small{margin-top:4px;font-family:var(--sans);font-size:12px;font-weight:600;line-height:1.35;color:var(--texto-3)}
.metric .numero.CORRETO{color:var(--ok)}.metric .numero.INCORRETO{color:var(--risco)}.metric .numero.REQUER_VALIDACAO{color:var(--pendente)}
.metric:has(.numero.CORRETO)::before{background:var(--ok-forte)}
.metric:has(.numero.INCORRETO)::before{background:var(--risco-forte)}
.metric:has(.numero.REQUER_VALIDACAO)::before{background:var(--pendente-forte)}
#resumoProcessamento h3+.grid .metric:nth-child(2)::before{background:var(--ok-forte)}
#resumoProcessamento h3+.grid .metric:nth-child(3)::before{background:var(--risco-forte)}
#resumoProcessamento h3+.grid .metric:nth-child(4)::before{background:var(--pendente-forte)}
#resumoProcessamento h3+.grid .metric:nth-child(7){background:linear-gradient(180deg,var(--ouro-50),var(--superficie));border-color:var(--ouro-200)}
#resumoProcessamento h3+.grid .metric:nth-child(7)::before{background:var(--ouro-500)}
#resumoProcessamento h3+.grid .metric:nth-child(7) .numero{color:var(--ouro-700)}
#resumoProcessamento h3+.grid .metric:nth-child(8){background:linear-gradient(180deg,var(--verde-50),var(--superficie));border-color:var(--verde-200)}
#resumoProcessamento h3+.grid .metric:nth-child(8)::before{background:var(--verde-700)}

/* ---------- Avisos e selos ---------- */
.aviso{background:var(--ouro-50);border:1px solid var(--ouro-200);border-left:4px solid var(--ouro-500);color:#584521;padding:12px 16px;border-radius:10px;margin-bottom:14px;font-size:14px}
.aviso.composicao-xmls{margin-top:16px;margin-bottom:0}
.aviso-info{margin-top:6px;padding:7px 10px;background:var(--info-fundo);border:1px solid var(--info-borda);border-radius:8px;font-size:12px;color:var(--info)}
.aviso-regra{margin-top:6px;padding:7px 10px;background:var(--risco-fundo);border:1px solid var(--risco-borda);border-radius:8px;font-size:12px;color:#7E271F}
.selo{display:inline-flex;align-items:center;gap:5px;margin:4px 6px 0 0;padding:2px 10px;border:1px solid transparent;border-radius:999px;font-size:12px;font-weight:600;line-height:1.5}
.selo-oficial{background:var(--ok-fundo);color:var(--ok);border-color:var(--ok-borda)}
.selo-aviso{background:#F6F1E5;color:#6A5629;border-color:#E2D6B8}
.selo-humano{background:var(--verde-700);color:#FBF8F1;border-color:var(--verde-700)}
.selo-pendente{background:var(--superficie);color:var(--ouro-800);border-color:var(--ouro-400)}
.selo-pendente::before{content:"";flex:none;width:6px;height:6px;border-radius:50%;background:var(--ouro-500)}
.selo-sem-cadastro,.selo-bloqueio{background:var(--risco-fundo);color:var(--risco);border-color:var(--risco-borda)}
.selo-info{background:var(--info-fundo);color:var(--info);border-color:var(--info-borda)}
.selos-produto{display:flex;flex-wrap:wrap;gap:6px;margin-top:10px}
.selos-produto .selo{margin:0}

/* ---------- Estados ---------- */
.status{font-weight:700}
.CORRETO{color:var(--ok)}
.INCORRETO_ECONOMIA{color:var(--economia)}
.INCORRETO_RISCO{color:var(--risco)}
.REQUER_VALIDACAO{color:var(--pendente)}
.NAO_OBRIGATORIO{color:var(--neutro)}
.INDETERMINADO{color:var(--risco)}
.INCORRETO_NCM{color:var(--risco)}
.aviso-ncm{display:flex;flex-direction:column;gap:4px;margin:0 0 10px;padding:12px 14px;border:2px solid #B3261E;border-radius:10px;background:#FDECEA;color:#7A1A13}
.aviso-ncm strong{font-size:1.05em;letter-spacing:.02em}

/* ---------- Tabelas ---------- */
table{width:100%;border-collapse:collapse;font-size:13px}
th,td{padding:11px 12px;border-bottom:1px solid var(--linha);text-align:left;vertical-align:top}
th{background:var(--papel-2);color:var(--verde-900);font-size:11.5px;font-weight:700;text-transform:uppercase;letter-spacing:.05em}
.tabela-wrap{overflow-x:auto;border:1px solid var(--linha);border-radius:12px;background:var(--superficie)}
.tabela-wrap th{border-bottom:1.5px solid var(--ouro-300)}
.tabela-wrap td:nth-child(2){width:190px}
.tabela-wrap table:has(th:nth-child(8)){min-width:3000px}
.tabela-wrap table:has(th:nth-child(8)) th{white-space:nowrap}
.tabela-wrap tbody tr:nth-child(even) td{background:#FCFAF6}
.tabela-wrap tbody tr:hover td{background:var(--ouro-50)}
.tabela-wrap tbody tr:last-child td{border-bottom:0}
.tabela-wrap td:first-child{font-weight:600;color:var(--verde-800);font-variant-numeric:lining-nums tabular-nums}
table.confronto{width:100%;border-collapse:separate;border-spacing:0;font-size:13px;border:1px solid var(--linha);border-radius:8px;overflow:hidden}
table.confronto th,table.confronto td{padding:5px 8px;border-bottom:1px solid var(--linha);white-space:nowrap}
table.confronto tr:last-child td{border-bottom:0}
table.confronto th{background:var(--papel-2);font-size:11px;text-transform:uppercase;color:var(--texto-2)}
table.confronto td:first-child{color:var(--texto-3)}
table.confronto td.igual{background:var(--ok-fundo);color:var(--ok);font-weight:700}
table.confronto td.difere{background:var(--risco-fundo);color:var(--risco);font-weight:700}
table.confronto td.indefinido{color:var(--pendente);font-style:italic;white-space:normal}
.confronto-legenda{font-size:11px;color:var(--texto-3);margin-top:4px}

/* ---------- Resultados ---------- */
.itens-resultado{display:flex;flex-direction:column;gap:10px}
.item-res{border:1px solid var(--linha);border-left:4px solid #A9ADA3;border-radius:12px;background:var(--superficie);padding:12px 16px;font-size:13px;overflow-wrap:anywhere;break-inside:avoid;box-shadow:var(--sombra-1);transition:box-shadow .15s,border-color .15s}
.item-res:hover{box-shadow:0 1px 2px rgba(29,41,34,.05),0 8px 20px -14px rgba(29,41,34,.35)}
.item-res[data-estado=CORRETO]{border-left-color:var(--ok-forte)}
.item-res[data-estado=INCORRETO_ECONOMIA]{border-left-color:var(--economia-forte)}
.item-res[data-estado=INCORRETO_RISCO],.item-res[data-estado=INCORRETO_NCM],.item-res[data-estado=INDETERMINADO]{border-left-color:var(--risco-forte)}
.item-res[data-estado=REQUER_VALIDACAO]{border-left-color:var(--pendente-forte)}
.item-topo{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;padding-bottom:8px;border-bottom:1px solid var(--linha)}
.item-produto{font-weight:700;font-size:14px}
.item-selo{text-align:right;white-space:nowrap}
.item-selo .status{font-size:14px}
.item-corpo{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr) minmax(0,1.35fr);gap:14px;margin-top:10px}
.dados{display:grid;grid-template-columns:1fr 1fr;gap:6px 12px;align-content:start}
.dados div{min-width:0}
.explica div{margin-bottom:5px}
@media(max-width:1100px){.item-corpo{grid-template-columns:minmax(0,1fr) minmax(0,1.25fr)}.item-corpo .explica{grid-column:1 / -1}}
@media(max-width:700px){.item-corpo{grid-template-columns:1fr}}
#listaResultados{gap:8px}
.item-res.compacto{padding:10px 14px 8px;font-size:12.5px}
.r-linha{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;margin-top:4px}
.r-topo{margin-top:0}
.r-prod{font-weight:700;font-size:14px;color:var(--verde-900)}
.r-lbl{color:var(--texto-3);font-size:10.5px;font-weight:600;text-transform:uppercase;letter-spacing:.04em;margin-right:3px}
.r-seta{color:var(--ouro-500)}
.chip{display:inline-block;padding:0 7px;border:1px solid var(--linha);border-radius:6px;background:var(--papel);white-space:nowrap;line-height:20px;font-variant-numeric:lining-nums tabular-nums}
.chip-r{color:var(--texto-3)}
.chip-igual{background:var(--ok-fundo);border-color:var(--ok-borda)}
.chip-difere{background:var(--risco-fundo);border-color:var(--risco-borda)}
.chip-indef{background:var(--pendente-fundo);border-color:var(--pendente-borda)}
.r-red{font-size:14px;color:var(--verde-700)}
.r-valores>span{margin-right:12px;white-space:nowrap}
.r-div{width:1px;height:14px;background:var(--linha-2);margin:0 4px}
.r-economia{color:var(--economia);font-weight:700}
.r-exposicao{color:var(--risco);font-weight:700}
.r-motivo{margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.compacto .selo{margin:0;padding:0 8px;line-height:19px}
.r-cab{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;padding-bottom:6px}
.r-cab-esq{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;min-width:0}
.r-cab-dir{display:flex;align-items:center;flex:0 0 auto;gap:10px}
.compacto .status-selo{padding:3px 12px;border:1.5px solid currentColor;border-radius:999px;background:var(--superficie);font-size:11.5px;font-weight:700;letter-spacing:.05em;white-space:nowrap}
.status-selo.CORRETO{background:var(--ok-fundo)}
.status-selo.INCORRETO_ECONOMIA{background:var(--economia-fundo)}
.status-selo.INCORRETO_RISCO,.status-selo.INCORRETO_NCM,.status-selo.INDETERMINADO{background:var(--risco-fundo)}
.status-selo.REQUER_VALIDACAO{background:var(--pendente-fundo)}
.status-selo.NAO_OBRIGATORIO{background:var(--neutro-fundo)}
.r-par{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 12px;align-items:center;padding:3px 8px;border-radius:6px;background:var(--superficie-2)}
.r-inf{margin-top:4px;border-left:3px solid var(--linha-2)}
.r-enq{margin-top:3px;border-left:3px solid var(--verde-500)}
.r-esq{display:flex;flex-wrap:wrap;align-items:center;gap:4px 6px;min-width:0}
.r-dir{display:flex;gap:14px;justify-content:flex-end;white-space:nowrap;font-variant-numeric:lining-nums tabular-nums}
.r-reducao .r-humano{margin-left:auto}
.aud-det summary{margin-top:8px;font-size:13px;font-weight:700;cursor:pointer}
.item-res[data-estado=CORRETO] .aud-det summary{color:var(--ok)}
.item-res[data-estado=REQUER_VALIDACAO] .aud-det summary{color:var(--pendente)}
.aud-det[open]{border-top:1px dashed var(--linha-2);margin-top:6px;padding-top:4px}
.item-res .alertas-item{margin-top:8px;padding-top:6px;border-top:1px dashed var(--linha)}

/* ---------- Redução, auditoria e regras ---------- */
.reducao{display:grid;grid-template-columns:1fr;gap:4px;background:var(--verde-50);border:1px solid var(--verde-200);border-radius:10px;padding:8px 12px;margin-bottom:8px}
.reducao .valor{font-size:15px;color:var(--verde-700)}
.reducao.sem-evidencia{background:var(--pendente-fundo);border-color:var(--pendente-borda)}
.reducao.sem-evidencia .valor{color:var(--pendente)}
.reducao.nao-determinada{background:var(--neutro-fundo);border-color:var(--neutro-borda)}
.reducao.regime{background:var(--ouro-50);border-color:var(--ouro-300)}
.reducao .aviso-d3{font-size:12px;font-weight:700;color:var(--economia)}
.reducao ul.fatos,.reducao-prev ul.fatos{margin:2px 0 0;padding-left:16px;font-size:11px;color:var(--texto-2)}
.reducao div{margin-bottom:0}
.bloco{margin-top:8px}
.aud{border:1px solid var(--linha-2);border-radius:10px;padding:8px 12px;background:var(--superficie-2)}
.aud-CONFIRMADA{border-color:var(--ok-borda);background:var(--ok-fundo)}
.aud-DIVERGENTE,.aud-NAO_LOCALIZADA{border-color:var(--risco-borda);background:var(--risco-fundo)}
.aud-NAO_DETERMINADA{border-color:var(--pendente-borda);background:var(--pendente-fundo)}
.aud-status{font-weight:700;font-size:14px;margin-bottom:4px;color:var(--verde-900)}
.aud .small{margin-top:3px}
.aud-nota{font-style:italic}
.bloqueio{border:1.5px solid var(--risco-forte);border-radius:10px;padding:10px 12px;background:var(--risco-fundo);margin-top:8px}
.bloq-titulo{font-weight:700;color:var(--risco);font-size:14px;letter-spacing:.02em}
.quadro-regra{border:1.5px solid var(--verde-200);border-radius:12px;padding:10px 14px;background:var(--verde-50)}
.quadro-regra>.rotulo{color:var(--verde-700)}
.quadro-campos{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:4px 10px;margin:6px 0 8px}
.red-destaque{margin-top:2px;font-size:17px;font-weight:700;color:var(--verde-700)}
.red-partes{font-size:13px;font-weight:700;color:var(--verde-600)}
@media(max-width:900px){.quadro-campos{grid-template-columns:repeat(3,minmax(0,1fr))}}
.item-res .quadro-campos{grid-template-columns:repeat(3,minmax(0,1fr))}
.card.aud-risco,.card.aud-resposta{margin:8px 0;padding:14px 16px;background:var(--superficie)}
.card.aud-risco{border-left:4px solid var(--risco-forte)}
.card.aud-resposta{border-left:4px solid var(--verde-700)}
.card.aud-risco ul{margin:4px 0 0;padding-left:18px}
.card.aud-resposta .barra{margin:8px 0 4px}

/* ---------- Pendências e consulta por NCM ---------- */
.pendente{border:1px solid var(--linha);border-radius:14px;padding:18px 20px;margin-bottom:14px;background:var(--superficie);box-shadow:var(--sombra-1)}
.pend-topo{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;padding-bottom:12px;border-bottom:1px solid var(--linha)}
.pend-topo strong{display:block;margin:2px 0 3px;font-size:16px;color:var(--verde-900)}
.pend-ncm{flex:none;text-align:right;white-space:nowrap;padding:6px 12px;border:1px solid var(--ouro-200);border-radius:10px;background:var(--ouro-50)}
.pend-ncm .valor{display:block;font-size:17px;letter-spacing:.03em;color:var(--verde-800);font-variant-numeric:lining-nums tabular-nums}
.regra-cand,.enq-agrupados{margin-top:12px;padding:12px 16px;border:1px solid var(--linha);border-left:4px solid var(--ouro-500);border-radius:10px;background:var(--superficie-2)}
.regra-cand .bloco{margin-top:10px}
.enq-agrupados>.rotulo{color:var(--ouro-700)}
.enq-agrupados>ol{margin:8px 0 0;padding-left:24px}
.enq-agrupados>ol>li::marker{font-family:var(--serif);font-weight:700;font-size:17px;font-variant-numeric:lining-nums tabular-nums;color:var(--ouro-600)}
.enq-opcao{margin:0 0 12px;padding-bottom:12px;border-bottom:1px dashed var(--linha-2)}
.enq-opcao:last-child{border-bottom:0;margin-bottom:0}
.enq-cab{font-weight:700;color:var(--verde-900)}
.enq-opcao .descricao-legal{margin-top:6px}
.descricao-legal{font-size:14px;line-height:1.55;padding:8px 12px;background:var(--superficie);border:1px solid var(--linha);border-left:3px solid var(--ouro-300);border-radius:6px;overflow-wrap:anywhere}
ul.descricoes{margin:4px 0 0;padding-left:18px;font-size:13px}
.proposto{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px 12px}
.reducao-prev{padding:8px 12px;border:1px solid var(--ok-borda);background:var(--ok-fundo);border-radius:10px}
.reducao-prev.sem-evidencia{border-color:var(--pendente-borda);background:var(--pendente-fundo)}
.reducao-prev.nao-determinada{border-color:var(--neutro-borda);background:var(--neutro-fundo)}
.valor-grande{font-family:var(--serif);font-size:24px;font-weight:700;line-height:1.1;color:var(--verde-800)}
.pergunta-validacao{margin-top:14px;font-weight:700;color:var(--verde-900)}
.mc-opcoes{margin:8px 0 6px;padding-left:22px}
.mc-opcao{margin:0 0 10px}
.mc-opcao button{text-align:left;white-space:normal}
.mc-resultado{font-weight:700;color:var(--verde-900);margin-top:3px}
.mc-nao-recomendada button{opacity:.75}
.mc-alerta{color:var(--ouro-700)}
.regra-nao-aplicavel{border-left-color:#9B3B2E}
.nao-aplicavel-quadro{display:grid;gap:6px;padding:10px 12px;border:1px solid var(--linha-2);border-radius:10px;background:#FBF3F1}
.selo-nao-aplicavel{background:#F6E1DC;color:#7A2618;border:1px solid #E3B4A8;font-weight:700;width:fit-content}
.pergunta-validacao .rotulo{color:var(--ouro-700)}
.resposta-registrada{margin-top:8px;font-weight:700;color:var(--verde-800)}
@media(max-width:700px){.proposto{grid-template-columns:repeat(2,minmax(0,1fr))}}
.pergunta{margin-top:10px;padding-top:10px;border-top:1px solid var(--linha)}
.acoes{display:flex;gap:8px;margin-top:10px;flex-wrap:wrap}
details>summary{display:inline-flex;align-items:center;gap:7px;margin-top:8px;cursor:pointer;list-style:none;color:var(--verde-600);font-size:13px;font-weight:600}
details>summary::-webkit-details-marker{display:none}
details>summary::before{content:"";flex:none;width:6px;height:6px;margin:0 2px 0 1px;border-right:1.5px solid currentColor;border-bottom:1.5px solid currentColor;transform:rotate(-45deg);transition:transform .15s}
details[open]>summary::before{transform:rotate(45deg)}
details>summary:hover{color:var(--verde-900)}
.alertas-item ul,.alertas-cartao ul,.alertas-lote{margin:6px 0 0;padding-left:18px}
.alertas-item li,.alertas-cartao li,.alertas-lote li{margin-bottom:4px}
.alertas-cartao{border:1px dashed var(--linha-2);border-radius:10px;padding:10px 12px;margin-top:10px;background:var(--superficie-2)}
.alertas-totais{width:auto;margin-bottom:10px}
.alerta-cat{display:inline-block;padding:1px 8px;border:1px solid var(--linha-2);border-radius:999px;background:var(--papel);font-size:11px;font-weight:700;letter-spacing:.03em;color:var(--texto-2)}
.alerta-cat-CONFLITO{background:var(--risco-fundo);color:var(--risco);border-color:var(--risco-borda)}
.alerta-cat-LACUNA{background:var(--economia-fundo);color:var(--economia);border-color:var(--economia-borda)}
.alerta-cat-PENDENCIA{background:var(--pendente-fundo);color:var(--pendente);border-color:var(--pendente-borda)}
.alerta-cat-ATENCAO{background:var(--ouro-50);color:var(--ouro-800);border-color:var(--ouro-300)}
.alerta-cat-INFORMACAO{background:var(--info-fundo);color:var(--info);border-color:var(--info-borda)}
#consultaNcmResultado .pendente>.bloco{margin-top:18px;padding-top:14px;border-top:1px solid var(--linha)}
#consultaNcmResultado .pend-topo+.bloco{margin-top:4px;border-top:0}
#consultaNcmResultado .pendente>.bloco>.rotulo{display:flex;align-items:center;gap:10px;margin-bottom:10px;font-size:12.5px;font-weight:700;letter-spacing:.08em;color:var(--verde-700)}
#consultaNcmResultado .pendente>.bloco>.rotulo::before{content:"";width:18px;height:2px;background:var(--ouro-500)}
#consultaNcmResultado .valor{font-size:14px}
#consultaNcmResultado .pendente>.bloco>div{margin-bottom:6px}
#consultaNcmResultado .regra-cand>div{margin-bottom:4px}
#consultaNcmResultado .pend-topo strong{font-family:var(--serif);font-size:22px;letter-spacing:.01em}
.consulta-ncm-filtros{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr) minmax(0,1.5fr) auto}

/* ---------- Dashboard ---------- */
.dashboard-resumo,.dashboard-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:22px;margin-bottom:22px}
.dashboard-resumo .card,.dashboard-grid .card{margin-bottom:0}
.card.destaque{position:relative;overflow:hidden;padding-top:28px}
.card.destaque::before{content:"";position:absolute;left:0;right:0;top:0;height:3px;background:linear-gradient(90deg,var(--verde-700),var(--ouro-500))}
.card.destaque p{color:var(--texto-2)}
.subtitulo{margin:-8px 0 16px;color:var(--texto-3);font-size:13px}
.chart-container{position:relative;height:280px}
.chart-container-wide{height:300px}
.valores-grafico{margin-top:14px;padding:10px 12px;border-top:1px solid var(--linha);font-size:13.5px;line-height:1.5;text-align:center;color:var(--texto-2);font-variant-numeric:lining-nums tabular-nums}
.valores-grafico strong{font-weight:700;color:var(--verde-900)}
#economiaResumo>p:first-of-type{margin-top:12px}
#detalhesBeneficios{display:flex;flex-wrap:wrap;gap:10px;margin-top:16px}
#detalhesBeneficios p{margin:0;padding:7px 14px;border:1px solid var(--linha);border-radius:999px;background:var(--superficie-2);font-size:13px;color:var(--texto-2)}
#detalhesBeneficios strong{color:var(--verde-900)}
#aliquotas p{margin:0;padding:10px 0;border-bottom:1px solid var(--linha);font-size:14px;color:var(--texto-2)}
#aliquotas p:last-child{border-bottom:0}
#aliquotas strong{color:var(--verde-800);letter-spacing:.04em}
.icone-situacao .ico{width:24px;height:24px;stroke-width:2.2}
#painelPesquisaNcm>div:first-child select{width:auto;min-width:180px}
#painelPesquisaNcm>div:first-child input{flex:1;min-width:220px}

/* ---------- Telas menores ---------- */
@media(max-width:1100px){.analise-complementos{grid-template-columns:1fr}}
@media(max-width:760px){#resumoProcessamento h3+.grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
@media(max-width:1000px){.dashboard-resumo,.dashboard-grid{grid-template-columns:1fr}}
@media(max-width:900px){
 header.topo{flex-direction:column;align-items:flex-start;gap:12px;padding:16px 20px}
 .topo-titulo{padding-left:0;border-left:0}
 header.topo h1{font-size:25px}
 nav{padding:0 8px}
 main{padding:20px 14px 32px}
 .card{padding:20px 18px}
 .painel-analise{padding:22px 18px}
 .filters,.consulta-ncm-filtros{grid-template-columns:1fr 1fr}
 .upload{grid-template-columns:1fr}
 .acoes-analise .perigo{margin-left:0}
 h2{font-size:30px}
}
@media(max-width:560px){
 .marca-coruja{height:46px}
 .marca-assinatura{height:34px}
 .filters,.consulta-ncm-filtros{grid-template-columns:1fr}
 .grid{grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
 .metric{padding:12px 12px 12px 15px}
 .metric .numero{font-size:27px}
 .aliquota-item{grid-template-columns:56px 1fr}
 .aliquota-item .aliquota-descricao{grid-column:1 / -1}
 .r-par{grid-template-columns:1fr}
 .r-dir{justify-content:flex-start;flex-wrap:wrap}
 .r-cab{flex-direction:column}
 .pend-topo{flex-direction:column}
 .pend-ncm{text-align:left}
}
@media (prefers-reduced-motion:reduce){.tela.active{animation:none}}

/* ---------- Impressão ---------- */
@media print{
 header,nav,.barra,.filters,button,.nao-imprimir,.upload,.nota-analise,.rodape{display:none!important}
 .cabecalho-impressao{display:flex!important;align-items:center;gap:18px;padding:0 0 12px;margin-bottom:16px;border-bottom:1.5px solid #AC9368}
 .cabecalho-impressao img{height:44px;width:auto}
 .cabecalho-impressao strong{display:block;font-family:var(--serif);font-size:20px;color:#2C4233}
 .cabecalho-impressao span{font-size:11px;color:#555}
 body{background:#fff}
 .tela{display:none!important}.tela.active{display:block!important;animation:none}
 main{padding:0;max-width:none}
 .card{box-shadow:none}
 .item-res{box-shadow:none}
}
</style>
</head>
<body>
<header class="topo">
<div class="marca">
<img class="marca-coruja" src="marca/coruja-negativa.png" alt="" width="48" height="56">
<img class="marca-assinatura" src="marca/assinatura-negativa.png" alt="Sabores Estratégicos" width="172" height="42">
</div>
<div class="topo-titulo">
<h1>Conformidade IBS/CBS</h1>
<p>Análise tributária, validação e acompanhamento de conformidade</p>
</div>
</header>
<div class="cabecalho-impressao" aria-hidden="true">
<img id="marcaPositiva" src="marca/marca-positiva.png" alt="" width="545" height="168">
<div><strong>Conformidade IBS/CBS</strong><span>Análise tributária, validação e acompanhamento de conformidade</span></div>
</div>

<nav aria-label="Seções do sistema">
<button class="active" onclick="abrirTela('importar',this)"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="m9 15 2 2 4-4"/></svg>Análise</button>
<button onclick="abrirTela('dashboard',this)"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>Dashboard</button>
<button onclick="abrirTela('resultados',this)"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="m3 17 2 2 4-4"/><path d="m3 7 2 2 4-4"/><path d="M13 6h8"/><path d="M13 12h8"/><path d="M13 18h8"/></svg>Resultados</button>
<button onclick="abrirTela('pendentes',this)"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>Pendências</button>
<button onclick="abrirTela('relatorio-final',this)"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M16 13H8"/><path d="M16 17H8"/><path d="M10 9H8"/></svg>Relatório Final</button>
<button onclick="abrirTela('consulta-ncm',this)"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>Consulta Tributária por NCM</button>
</nav>

<main>

<section id="importar" class="tela active">
<div class="card painel-analise">
<h2>Análise atual</h2>
<p id="resumoAnalise" class="estado-analise">Carregando...</p>
<div class="upload">
<label class="upload-zona" id="zonaUpload">
<input id="arquivos" type="file" multiple accept=".xml,.zip">
<span class="upload-icone"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m17 8-5-5-5 5"/><path d="M12 3v12"/></svg></span>
<span class="upload-titulo">Arraste os XMLs aqui ou clique para escolher</span>
<span class="upload-detalhe">Arquivos .xml ou .zip · Limite máximo: 10.000 arquivos XML por envio.</span>
<span class="upload-selecao" id="selecaoArquivos">Nenhum arquivo escolhido</span>
</label>
<ol class="upload-passos">
<li><span>Escolha os arquivos.</span></li>
<li><span><strong>"Adicionar XMLs"</strong> coloca os arquivos na análise atual, sem processar.</span></li>
<li><span><strong>"Processar análise"</strong> analisa todos os XMLs da análise atual.</span></li>
</ol>
</div>
<div class="barra acoes-analise">
<button class="secondary" id="btnAdicionar" onclick="adicionarXmls()"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14"/><path d="M5 12h14"/></svg>Adicionar XMLs</button>
<button class="primary" id="btnProcessar" onclick="processarAnalise()" disabled>▶ Processar análise</button>
<button class="perigo" onclick="iniciarNovaAnalise()">Nova análise (limpar dados)</button>
</div>
<p class="small nota-analise">"Nova análise" apaga XMLs, resultados, pendências e respostas da análise atual.</p>
<div id="status"></div>
<div id="resumoProcessamento"></div>
<div class="analise-complementos">
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
<div class="card aliquotas-analise" id="beneficioAtividade">
<h3>Benefício ou redução de alíquota por atividade</h3>
<div id="beneficioAtividadeConteudo" class="small">Carregando...</div>
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
<option value="INCORRETO_ECONOMIA">Corretos c/ recal impostos</option>
<option value="INCORRETO_RISCO">Incorreto - risco</option>
<option value="INCORRETO_NCM">Incorreto - ajustar NCM</option>
<option value="REQUER_VALIDACAO">Precisa validar</option>
<option value="NAO_OBRIGATORIO">Não obrigatório</option>
</select>
<input id="filtroClass" placeholder="cClassTrib" oninput="renderResultados()">
<input id="filtroCst" placeholder="CST" oninput="renderResultados()">
</div>
<div class="barra"><button class="secondary" onclick="window.print()"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/></svg>Imprimir</button><button class="secondary" onclick="exportarResultados()"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>Exportar CSV</button><span id="contagemResultados" class="small"></span></div>
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
<div class="barra"><button class="secondary" onclick="window.print()"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9V3h12v6"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><path d="M6 14h12v7H6z"/></svg>Imprimir</button><button class="secondary" onclick="exportarPendencias()"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>Exportar CSV</button><span id="contagemPendencias" class="small"></span></div>
<div id="listaPendentes"></div>
</div>
</section>

<section id="relatorio-final" class="tela">
<div class="card">
<h2>Relatório Final</h2>
<p class="small">Relatório operacional dos produtos que precisam ter o cadastro IBS/CBS ajustado.</p>

<div class="barra">
<div class="segmentado" role="group" aria-label="Relatório">
<button class="secondary relatorio-final-selecionado" id="btnRelatorioComValidacao" onclick="selecionarModoRelatorio('com')">CORRETOS VALIDADOS</button>
<button class="secondary" id="btnRelatorioSemValidacao" onclick="selecionarModoRelatorio('sem')">SEM VALIDAÇÃO</button>
<button class="secondary" id="btnRelatorioRecal" onclick="selecionarModoRelatorio('recal')">CORRETOS C/ RECAL IMPOSTOS</button>
<button class="secondary" id="btnRelatorioCorretos" onclick="selecionarModoRelatorio('corretos')">CORRETOS</button>
</div>
<span id="contagemRelatorioFinal" class="small"></span>
</div>

<div class="barra">
<button class="secondary" onclick="exportarRelatorioFinal('csv')"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>Exportar CSV</button>
<button class="secondary" onclick="exportarRelatorioFinal('excel')"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>Exportar Excel</button>
<button class="secondary" onclick="exportarRelatorioFinal('pdf')"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><path d="m7 10 5 5 5-5"/><path d="M12 15V3"/></svg>Exportar PDF</button>
</div>

<div id="explicacaoRelatorioFinal" class="aviso"></div>

<div class="tabela-wrap">
<table>
<thead id="cabecalhoRelatorioFinal">
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

<section id="consulta-ncm" class="tela">
<div class="card">
<h2>Consulta Tributária por NCM</h2>
<p class="small">Consulta preventiva, sem XML: o NCM informado passa pelo mesmo motor tributário, pelas mesmas regras e pela mesma auditoria usados na análise dos XMLs. Nada é gravado e a análise atual não é alterada.</p>
<div class="filters consulta-ncm-filtros">
<input id="consultaNcmEntrada" placeholder="NCM (ex.: 1901.20.90 ou 19012090)" onkeydown="if(event.key==='Enter')consultarNcmTela()">
<select id="consultaNcmModelo" aria-label="Modelo do documento">
<option value="65">NFC-e (modelo 65)</option>
<option value="55">NF-e (modelo 55)</option>
</select>
<select id="consultaNcmNatureza" aria-label="Natureza do produto">
<option value="">Natureza: conforme cadastro da empresa</option>
<option value="mercadoria">Mercadoria</option>
<option value="preparado_no_local">Preparado e servido no local (bar/restaurante)</option>
<option value="bebida_alcoolica">Bebida alcoólica</option>
<option value="servico">Serviço</option>
</select>
<button class="primary" id="btnConsultarNcm" onclick="consultarNcmTela()">CONSULTAR NCM</button>
</div>
<div id="consultaNcmResultado"></div>
</div>
</section>
</main>
<footer class="rodape"><img src="marca/coruja-positiva.png" alt="" width="20" height="24"><strong>Sabores Estratégicos</strong><span class="rodape-sep"></span><span>Conformidade IBS/CBS</span></footer>

<script>
if(window.Chart&&window.ChartDataLabels) Chart.register(ChartDataLabels);
// Gráficos na identidade da marca (só aparência)
try{
 if(window.Chart){
   Chart.defaults.font.family=getComputedStyle(document.body).fontFamily;
   Chart.defaults.color='#46544B';
   Chart.defaults.borderColor='#ECE6DA';
   Chart.defaults.elements.bar.borderRadius=6;
   Chart.defaults.elements.arc.borderColor='#FFFDF9';
   Chart.defaults.elements.arc.borderWidth=2;
   Chart.defaults.datasets.bar.maxBarThickness=150;
   Chart.defaults.plugins.legend.labels.usePointStyle=true;
   Object.assign(Chart.defaults.plugins.tooltip,{backgroundColor:'#1B2B21',titleColor:'#F4EEE2',bodyColor:'#F4EEE2',padding:10,cornerRadius:8});
 }
}catch(e){ console.warn('Estilo padrão dos gráficos não aplicado:',e); }
let resultados=[];
let pendentes=[];
let respostas=[];
let alertasUI={disponivel:false,porItemHtml:{},porCartaoHtml:{},painelHtml:''};
let pendentesFiltradas=[];
let resultadosFiltrados=[];
let regrasUI={};
let modoRelatorioFinal='com';
let linhasRelatorioFinal=[];
const COLUNAS_RELATORIO_FINAL=['Código produto','Descrição','NCM','cClassTrib a utilizar','CST a utilizar','Alíquota de registro IBS/CBS','Instrução'];
const COLUNAS_RELATORIO_RISCO=['cProd','Descrição','NCM informado','NCM adequado / possível enquadramento','CST atual','CST esperado','cClassTrib atual','cClassTrib esperado','Redução IBS','Redução CBS','Alíquota aplicável','Alíquota atualmente considerada','Diferença (R$)','Motivo do INCORRETO — risco','Fundamento legal','Fonte','Instrução'];
/** Recálculo e Corretos: as colunas do relatório final mais o resultado e o impacto do recálculo. */
const COLUNAS_RELATORIO_IMPACTO=COLUNAS_RELATORIO_FINAL.concat(['Resultado','Economia (R$)','Valor a pagar (R$)']);
const colunasRelatorio=()=>modoRelatorioFinal==='recal'||modoRelatorioFinal==='corretos'?COLUNAS_RELATORIO_IMPACTO:COLUNAS_RELATORIO_FINAL;
const TITULO_RELATORIO={com:'CORRETOS VALIDADOS',sem:'SEM VALIDAÇÃO',recal:'CORRETOS C/ RECAL IMPOSTOS',corretos:'CORRETOS'};
/** Corretos com recálculo: enquadramento determinado e imposto recalculado (economia ou valor a pagar). */
const ehRecalculo=v=>(v.estado==='INCORRETO_ECONOMIA'||v.estado==='INCORRETO_RISCO')&&!!v.esperado;
/** Uma linha por produto: enquadramento a utilizar, instrução, resultado e impacto somado dos itens. */
function linhaRelatorioImpacto(itens){
 const v=itens[0], cst=v.esperado?.cst||'', cClassTrib=v.esperado?.cClassTrib||'';
 const reducao=reducaoRelatorioFinal(v);
 const recal=ehRecalculo(v);
 const instrucao=recal?instrucaoRelatorioFinal(cst,cClassTrib,reducao,true):'Cadastro correto: manter o CST '+cst+' e o cClassTrib '+cClassTrib+'.';
 const economia=itens.reduce((s,x)=>s+(x.estado==='INCORRETO_ECONOMIA'?(x.economiaPotencial||0):0),0);
 const aPagar=itens.reduce((s,x)=>s+(x.estado==='INCORRETO_RISCO'?(x.exposicao||0):0),0);
 const num=n=>n?n.toFixed(2).replace('.',','):'0,00';
 return [v.cProd,v.produto,v.ncm||'',cClassTrib,cst,reducao,instrucao,recal?'CORRETO C/ RECAL IMPOSTOS':'CORRETO',num(economia),num(aPagar)];
}
/** Alíquota IBS + CBS vigente no item (as mesmas usadas pelo motor), com a redução. */
function aliquotaComReducao(v,red){
 const t=(v.aliquotaUsada||[]).reduce((s,a)=>s+a.aliquota,0);
 if(!(v.aliquotaUsada||[]).length||red==null) return '-';
 return (t*(1-red)*100).toLocaleString('pt-BR',{maximumFractionDigits:3})+'% ('+(v.aliquotaUsada||[]).map(a=>a.tributo+' '+(a.aliquota*100).toLocaleString('pt-BR',{maximumFractionDigits:3})+'%').join(' + ')+(red?' com redução de '+textoPct(red):'')+')';
}
/** Uma linha por produto em INCORRETO — risco, só com dados do veredito e da base. */
function linhaRelatorioRisco(v,itens){
 const inf=v.informado||{}, esp=v.esperado;
 const ausente=inf.cst==null&&inf.cClassTrib==null;
 const regraEsp=v.regraAplicada&&regrasUI[v.regraAplicada+'|'+v.ncm];
 const cands=(v.regrasCandidatas||[]).map(id=>regrasUI[id+'|'+v.ncm]).filter(Boolean);
 const red=esp?(regraEsp?regraEsp.reducao:(v.regraAplicada&&/art\. 275/.test(v.regraAplicada)?0.4:0)):null;
 const reducoes=esp?textoPct(red):(cands.length?'depende da validação: '+[...new Set(cands.map(g=>textoPct(g.reducao)))].join(' ou ')+' (ou 0% sem benefício)':'-');
 const dif=itens.reduce((s,x)=>s+(x.exposicao||0),0);
 const enquadramento=v.motivo.includes('A descrição indica')
  ?'REQUER VALIDAÇÃO do NCM: '+v.motivo.slice(v.motivo.indexOf('A descrição indica')).split('(TIPI')[0].trim()
  :esp?'NCM '+v.ncm+' mantido; enquadramento '+esp.cst+'/'+esp.cClassTrib:'REQUER VALIDAÇÃO: '+(cands.length?cands.map(g=>g.cst+'/'+g.cClassTrib+' (Anexo '+g.anexo+', item '+g.item+')').join(' · '):'sem regra candidata');
 const fundamento=[ausente?'Ato Conjunto RFB/CGIBS nº 4/2026 (grupo obrigatório desde 03/08/2026)':'',
  regraEsp?(regraEsp.fundamentoLegal||'')+' — '+(regraEsp.rotulo||''):esp?'LC 214/2025 — regra geral (nenhuma regra de benefício aplicável ao NCM)':cands.map(g=>g.fundamentoLegal+' ('+g.rotulo+')').join(' · ')].filter(Boolean).join('; ');
 const fonte=[...new Set([regraEsp&&regraEsp.fonte,...(esp?[]:cands.map(g=>g.fonte)),'LC 214/2025 (Planalto)','Portal da Conformidade Fácil (SVRS)'].filter(Boolean))].join('; ');
 const instrucao=ausente
  ?(esp?'Informar o grupo IBS/CBS no cadastro do produto com CST '+esp.cst+' e cClassTrib '+esp.cClassTrib+'.':'Responder SIM/NÃO em Pendências; depois informar o grupo IBS/CBS no cadastro com o enquadramento confirmado (sem benefício: CST 000 e cClassTrib 000001).')
  :(esp?'Alterar o cadastro do produto para o CST '+esp.cst+' e cClassTrib '+esp.cClassTrib+'.':'Validar o enquadramento em Pendências antes de alterar o cadastro.');
 return [v.cProd,v.produto,v.ncm||'',enquadramento,inf.cst??'ausente',esp?esp.cst:'REQUER VALIDAÇÃO',inf.cClassTrib??'ausente',esp?esp.cClassTrib:'REQUER VALIDAÇÃO',
  reducoes,reducoes,esp?aliquotaComReducao(v,red):'depende da validação',ausente?'não informada no XML (grupo IBS/CBS ausente)':(inf.cClassTrib==='000001'?aliquotaComReducao(v,0):((cands.find(g=>g.cClassTrib===inf.cClassTrib)||{}).reducao!=null?aliquotaComReducao(v,cands.find(g=>g.cClassTrib===inf.cClassTrib).reducao):'cClassTrib '+inf.cClassTrib+' (redução sem regra na base para o NCM)')),
  dif?formatarNumero(dif)+(esp?'':' (mínimo)'):'-',v.motivo,fundamento,fonte,instrucao];
}
const ROTULO_ESTADO={CORRETO:'CORRETO',INCORRETO_ECONOMIA:'CORRETOS C/ RECAL IMPOSTOS',INCORRETO_RISCO:'INCORRETO — risco',INCORRETO_NCM:'INCORRETO — AJUSTAR NCM',REQUER_VALIDACAO:'PRECISA VALIDAR',NAO_OBRIGATORIO:'NÃO OBRIGATÓRIO',INDETERMINADO:'INDETERMINADO'};

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
 if(v&&v.esperado&&v.esperado.cClassTrib==='000001') return '0% (tributação integral)';
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
 modoRelatorioFinal=TITULO_RELATORIO[modo]?modo:'com';
 const botoes={com:'btnRelatorioComValidacao',sem:'btnRelatorioSemValidacao',recal:'btnRelatorioRecal',corretos:'btnRelatorioCorretos'};
 for(const [m,id] of Object.entries(botoes)){
   const b=document.getElementById(id);
   if(b) b.classList.toggle('relatorio-final-selecionado',modoRelatorioFinal===m);
 }
 carregarRelatorioFinal();
}

async function carregarRelatorioFinal(){
 const corpo=document.getElementById('listaRelatorioFinal');
 const contador=document.getElementById('contagemRelatorioFinal');
 const explicacao=document.getElementById('explicacaoRelatorioFinal');

 if(!corpo) return;

 const modo=modoRelatorioFinal;
 const ncol=colunasRelatorio().length;
 linhasRelatorioFinal=[];
 const cab=document.getElementById('cabecalhoRelatorioFinal');
 if(cab) cab.innerHTML='<tr>'+colunasRelatorio().map(c=>'<th>'+escaparRelatorio(c)+'</th>').join('')+'</tr>';
 corpo.innerHTML='<tr><td colspan="'+ncol+'">Carregando relatório...</td></tr>';

 const renderizar=(linhas,vazio)=>{
   if(modo!==modoRelatorioFinal) return;
   linhasRelatorioFinal=linhas;
   corpo.innerHTML=linhas.length
     ? linhas.map(l=>'<tr>'+l.map(c=>'<td>'+escaparRelatorio(c)+'</td>').join('')+'</tr>').join('')
     : '<tr><td colspan="'+ncol+'">'+vazio+'</td></tr>';
   contador.textContent=linhas.length+' produto(s)';
 };

 try{
   if(modo==='recal'||modo==='corretos'||modo==='com'){
     const resultadosApi=await (await fetch('/api/resultados')).json();
     let respostas=[];
     if(modo==='com'){ try{ respostas=await (await fetch('/api/respostas')).json(); }catch(e){ respostas=[]; } }
     const validado=new Set((Array.isArray(respostas)?respostas:[]).map(r=>r.ncm+'|'+r.cProd));
     const incluir=v=>{
       if(modo==='recal') return ehRecalculo(v);
       const correto=v.estado==='CORRETO'||ehRecalculo(v);
       if(modo==='corretos') return correto;
       // Corretos validados: produto com resposta de validação que, após o reprocessamento, voltou como correto
       return correto&&(validado.has(v.ncm+'|'+v.cProd)||validado.has(v.ncm+'|'+v.produto));
     };
     const porProduto=new Map();
     resultadosApi.filter(incluir).forEach(v=>{
       const k=v.cProd||v.ncm+'|'+v.produto;
       if(!porProduto.has(k)) porProduto.set(k,[]);
       porProduto.get(k).push(v);
     });
     if(modo==='com'){
       explicacao.textContent='Corretos validados: produtos que passaram pela validação e, após o reprocessamento, retornaram como CORRETOS (cadastro já correto ou correto com recálculo de impostos).';
       renderizar([...porProduto.values()].map(itens=>{
         const v=itens[0], cst=v.esperado?.cst||'', cClassTrib=v.esperado?.cClassTrib||'', reducao=reducaoRelatorioFinal(v);
         const instrucao=ehRecalculo(v)?instrucaoRelatorioFinal(cst,cClassTrib,reducao,true):'Cadastro correto: manter o CST '+cst+' e o cClassTrib '+cClassTrib+'.';
         return [v.cProd,v.produto,v.ncm||'',cClassTrib,cst,reducao,instrucao];
       }),'Nenhum produto validado retornou como correto.');
       return;
     }
     explicacao.textContent=modo==='recal'
       ?'Corretos c/ recal impostos: produtos com enquadramento determinado cujo imposto foi recalculado. A economia (imposto pago a mais) e o valor a pagar (imposto destacado a menor) aparecem em colunas separadas.'
       :'Corretos: todos os produtos corretos, somando os que já estavam corretos e os corretos com recálculo de impostos.';
     renderizar([...porProduto.values()].map(linhaRelatorioImpacto),modo==='recal'?'Nenhum produto correto com recálculo de impostos.':'Nenhum produto correto.');
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

     return [p.cProd,p.produto,p.ncm||'',cClassTrib,cst,reducao,instrucao];
   });

   renderizar(linhas,'Nenhum produto pendente foi encontrado.');
 }catch(e){
   console.error(e);
   if(modo!==modoRelatorioFinal) return;
   corpo.innerHTML='<tr><td colspan="'+ncol+'">Não foi possível carregar o Relatório Final.</td></tr>';
   contador.textContent='';
 }
}

/** Marca Sabores Estratégicos no topo do PDF (só aparência; se a imagem não estiver carregada, o PDF sai sem ela). */
function marcaNoPdf(doc){
 try{
   const largura=doc.internal.pageSize.getWidth();
   doc.setDrawColor(172,147,104);
   doc.setLineWidth(0.8);
   doc.line(40,64,largura-40,64);
   const img=document.getElementById('marcaPositiva');
   if(!img||!img.complete||!img.naturalWidth) return;
   const tela=document.createElement('canvas');
   tela.width=img.naturalWidth;
   tela.height=img.naturalHeight;
   tela.getContext('2d').drawImage(img,0,0);
   const h=34, w=h*img.naturalWidth/img.naturalHeight;
   doc.addImage(tela.toDataURL('image/png'),'PNG',largura-40-w,20,w,h,'marca','FAST');
 }catch(e){ console.warn('Marca não incluída no PDF:',e); }
}

function exportarRelatorioFinal(formato){
 if(!linhasRelatorioFinal.length){
   alert('Não há dados no relatório selecionado para exportar.');
   return;
 }
 const impacto=modoRelatorioFinal==='recal'||modoRelatorioFinal==='corretos';
 const titulo='Relatório Final — '+TITULO_RELATORIO[modoRelatorioFinal];
 const nome={com:'relatorio-final-corretos-validados',sem:'relatorio-final-sem-validacao',recal:'relatorio-final-corretos-recal-impostos',corretos:'relatorio-final-corretos'}[modoRelatorioFinal];
 const colunas=colunasRelatorio();
 const tabela=[colunas].concat(linhasRelatorioFinal);

 if(formato==='csv'){
   baixar(nome+'.csv',csv(tabela));
   return;
 }

 if(formato==='excel'){
   if(typeof gerarXlsx!=='function'){ alert('Não foi possível carregar o gerador de Excel. Recarregue a página.'); return; }
   baixarArquivo(nome+'.xlsx',gerarXlsx(tabela,{aba:TITULO_RELATORIO[modoRelatorioFinal].slice(0,31),larguras:impacto?[16,45,12,16,12,22,70,26,14,16]:[16,45,12,16,12,22,70]}),'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
   return;
 }

 if(formato==='pdf'){
   if(!window.jspdf||!window.jspdf.jsPDF){ alert('Não foi possível carregar o gerador de PDF. Recarregue a página.'); return; }
   // A fonte padrão do jsPDF só cobre Latin-1; o travessão sairia corrompido.
   const latin1=c=>(c==null?'':String(c)).replace(/[\\u2013\\u2014]/g,'-');
   const doc=new window.jspdf.jsPDF({orientation:'landscape',unit:'pt',format:'a4'});
   doc.setTextColor(44,66,51);
   doc.setFontSize(14);
   doc.text(latin1(titulo),40,40);
   doc.setTextColor(90,102,95);
   doc.setFontSize(9);
   doc.text('Gerado em '+new Date().toLocaleString('pt-BR')+' - '+linhasRelatorioFinal.length+' produto(s)',40,58);
   marcaNoPdf(doc);
   const opcoesTabela={
     head:[colunas],
     body:linhasRelatorioFinal.map(l=>l.map(latin1)),
     startY:70,
     styles:{fontSize:7,cellPadding:3,overflow:'linebreak'},
     headStyles:{fillColor:[44,66,51],textColor:[251,248,241]},
     alternateRowStyles:{fillColor:[250,248,243]},
     columnStyles:impacto?{1:{cellWidth:120},6:{cellWidth:170}}:{1:{cellWidth:150},6:{cellWidth:220}},
     ...(impacto?{styles:{fontSize:7,cellPadding:3,overflow:'linebreak'}}:{})
   };
   window.jspdf.autoTable?window.jspdf.autoTable(doc,opcoesTabela):doc.autoTable(opcoesTabela);
   doc.save(nome+'.pdf');
 }
}

async function carregarAnalise(){
 carregarBeneficioAtividade();
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
 if(r.ncmAAjustar) cards.push(['NCM A AJUSTAR',r.ncmAAjustar,'INCORRETO']);
 if(r.naoObrigatorio) cards.push(['Não obrigatórios',r.naoObrigatorio]);
 if(r.indeterminado) cards.push(['Indeterminados',r.indeterminado]);
 return '<div class="grid">'+htmlCards(cards)+'</div>'+explicacaoComposicao(d.composicao,r)+
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

/** Área de envio: quantos arquivos foram escolhidos (só exibição; o envio continua lendo o próprio campo). */
function atualizarSelecaoXml(){
 const input=document.getElementById('arquivos'), alvo=document.getElementById('selecaoArquivos');
 if(!input||!alvo) return;
 const n=input.files?input.files.length:0;
 alvo.textContent=!n?'Nenhum arquivo escolhido':n===1?'1 arquivo escolhido: '+input.files[0].name:n.toLocaleString('pt-BR')+' arquivos escolhidos';
 alvo.parentElement.classList.toggle('com-arquivos',n>0);
}
(function(){
 const zona=document.getElementById('zonaUpload'), input=document.getElementById('arquivos');
 if(!zona||!input) return;
 input.addEventListener('change',atualizarSelecaoXml);
 ['dragenter','dragover'].forEach(t=>zona.addEventListener(t,()=>zona.classList.add('arrastando')));
 ['dragleave','dragend','drop'].forEach(t=>zona.addEventListener(t,()=>zona.classList.remove('arrastando')));
})();

async function adicionarXmls(){
 const input=document.getElementById('arquivos');
 const status=document.getElementById('status');
 if(!input.files.length){
   status.textContent='Selecione pelo menos um arquivo XML.';
   return;
 }
 if(input.files.length>10000){
   status.textContent='Foram selecionados '+input.files.length.toLocaleString('pt-BR')+' arquivos. O limite máximo é de 10.000 arquivos XML por envio.';
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
   status.textContent=dados.adicionados+' XML(s) adicionado(s) à análise atual, ainda não processado(s).';
   input.value='';
   atualizarSelecaoXml();
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
  let cor='#9C2F25';
  let fundo='#FAEDEA';

  if(conformidade>=0.98){
    classificacao='EXCELENTE';
    cor='#2E6B45';
    fundo='#EAF3EC';
  }else if(conformidade>=0.95){
    classificacao='MUITO BOA';
    cor='#3A7A52';
    fundo='#EDF4EE';
  }else if(conformidade>=0.90){
    classificacao='BOA';
    cor='#56703A';
    fundo='#F0F4E8';
  }else if(conformidade>=0.80){
    classificacao='ATENÇÃO';
    cor='#8F5316';
    fundo='#FBF1E4';
  }else{
    classificacao='CRÍTICA';
    cor='#9C2F25';
    fundo='#FAEDEA';
  }

  situacao.innerHTML=
    '<div style="display:flex;align-items:center;gap:12px;flex-wrap:wrap">'+
      '<div style="font-family:var(--serif);font-size:48px;font-weight:700;line-height:1;color:var(--verde-900)">'+
        formatarPercentual(conformidade)+
      '</div>'+
      '<div style="display:inline-flex;align-items:center;gap:7px;padding:7px 13px;border-radius:999px;background:'+fundo+';border:1px solid '+cor+';color:'+cor+';font-size:12.5px;font-weight:700;letter-spacing:.08em">'+
        '<span style="font-size:10px">●</span>'+
        classificacao+
      '</div>'+
    '</div>'+
    '<p style="margin-top:8px">dos itens avaliados estão em conformidade.</p>';
}

    const economiaResumo=document.getElementById('economiaResumo');
    if(economiaResumo){
      economiaResumo.innerHTML=
        '<div style="font-family:var(--serif);font-size:48px;font-weight:700;line-height:1;color:var(--ouro-700)">'+
        formatarNumero(economia)+
        '</div>'+
        '<p>economia potencial identificada na análise (confirmada: itens validados ou com regra aplicável).</p>'+
        (Number(i.economiaSujeitaValidacao||0)>0
          ? '<p class="small" title="Estimativa dos itens pendentes que usam tributação integral, com a menor redução entre as regras candidatas. Não está somada ao valor acima.">+ '+formatarNumero(i.economiaSujeitaValidacao)+' sujeita à validação (respostas SIM/NÃO pendentes).</p>'
          : '');
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
              '#3A7A52',
              '#A53E33',
              '#8F7137'
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
            backgroundColor:['#3A7A52','#A53E33','#8F7137']
          }]
        },

        options:{
          responsive:true,
          maintainAspectRatio:false,

          plugins:{
            datalabels:{display:true,color:'#ffffff',backgroundColor:'rgba(27,43,33,.78)',borderRadius:6,padding:{top:3,bottom:3,left:7,right:7},font:{weight:'bold',size:13},formatter:function(value,context){var total=context.dataset.data.reduce(function(a,b){return a+Number(b||0);},0);var p=total?((Number(value)/total)*100).toFixed(2):'0.00';return String(value)+' / '+p+'%';}},legend:{position:'bottom'},

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
              '#3A7A52',
              '#8F7137',
              '#737870'
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
      simbolo:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>',
      cor:'#2E6B45',
      fundo:'#EAF3EC',
      borda:'#BFD8C6'
    },
    'Incorretos':{
      simbolo:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 7v6"/><path d="M12 17h.01"/></svg>',
      cor:'#9C2F25',
      fundo:'#FAEDEA',
      borda:'#EBC5BE'
    },
    'Requer validação':{
      simbolo:'<svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 22h14"/><path d="M5 2h14"/><path d="M17 22v-4.17a2 2 0 0 0-.59-1.42L12 12l-4.41 4.41A2 2 0 0 0 7 17.83V22"/><path d="M7 2v4.17a2 2 0 0 0 .59 1.42L12 12l4.41-4.41A2 2 0 0 0 17 6.17V2"/></svg>',
      cor:'#8F7137',
      fundo:'#F8F1E0',
      borda:'#E4D0A2'
    }
  };

  const cfg=configuracao[titulo]||{
    simbolo:'•',
    cor:'#46544B',
    fundo:'#F2F0E9',
    borda:'#DCD5C6'
  };

  return '<div class="card" style="margin:0;text-align:center;padding:20px 14px;border-radius:14px;border:1px solid '+cfg.borda+';background:'+cfg.fundo+';box-shadow:0 1px 2px rgba(29,41,34,.05);min-height:150px;display:flex;flex-direction:column;justify-content:center">'+
    '<div class="icone-situacao" style="width:46px;height:46px;margin:0 auto 10px;border-radius:50%;background:'+cfg.cor+';color:#fff;display:flex;align-items:center;justify-content:center;font-size:24px;font-weight:800;box-shadow:0 2px 6px rgba(0,0,0,.12)">'+
      cfg.simbolo+
    '</div>'+
    '<div style="font-size:14px;font-weight:700;letter-spacing:.02em;color:var(--verde-900)">'+
      titulo+
    '</div>'+
    '<div style="font-family:var(--serif);font-size:42px;font-weight:700;line-height:1.05;margin-top:6px;color:'+cfg.cor+'">'+
      quantidade+
    '</div>'+
    '<div class="small" style="margin-top:2px;color:var(--texto-3)">NCM(s)</div>'+
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
        '<button type="button" class="secondary" id="btnPesquisarNcm"><svg class="ico" viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>Pesquisar NCM por situação</button>'+
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
    ['Economia potencial',formatarNumero(i.economiaPotencial??0)+(Number(i.economiaSujeitaValidacao||0)>0?'<div class="small">+ '+formatarNumero(i.economiaSujeitaValidacao)+' sujeita à validação</div>':'')],
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
   document.getElementById('listaResultados').innerHTML='<p>Não foi possível carregar os resultados.</p>';
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

/** Alertas da regra frente às fontes; nada é bloqueado nesta fase. */
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
  '<div class="small aud-nota">A conferência é da regra. Se o produto atende à descrição legal continua sendo decisão humana.</div>'+
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
 const semCadastro=d.semCadastro&&d.semCadastro.total?'<div class="selo selo-sem-cadastro" title="Vendas deste produto saíram sem o grupo IBS/CBS no XML: o cadastro do produto não tem CST nem cClassTrib.">Produto sem informação tributária no cadastro: '+d.semCadastro.total+' venda(s) sem CST/cClassTrib'+(d.semCadastro.naoObrigatorios?' ('+d.semCadastro.naoObrigatorios+' não obrigatória(s) na data)':'')+'</div>':'';
 return '<div class="bloco quadro-regra">'+
  '<span class="rotulo">'+esc(d.titulo||'Enquadramento da regra')+'</span>'+
  '<div class="quadro-campos">'+campoQuadro('CST',d.cst)+campoQuadro('cClassTrib',d.cClassTrib)+campoQuadro('Anexo',d.anexo)+campoQuadro('Item',item)+campoQuadro('Fundamento',d.fundamento)+'</div>'+
  red+
  '<div class="selo '+(a&&a.status==='CONFIRMADA'?'selo-oficial':'selo-aviso')+'">'+esc(regra)+'</div>'+
  humano+semCadastro+
  '<div class="small aud-nota">A conferência é da regra. Se o produto atende à descrição legal continua sendo decisão humana.</div>'+
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
 return '<div class="aviso-regra">As regras candidatas têm tratamentos diferentes — '+esc(vs.map(textoReducao).join(' e '))+' —: a escolha muda o resultado fiscal. As descrições oficiais não correspondem automaticamente ao produto — confira se o produto e o NCM informado no XML correspondem à descrição legal antes de responder.</div>';
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
    '<div class="small aud-nota">A conferência é da regra. Se o produto atende à descrição legal continua sendo decisão humana (tela Pendências).</div></div>';
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
 * Resultados em lista compacta: produto e situação (à direita) → informado (base, atual) → enquadramento (correto, economia) → redução. A auditoria (origem,
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
 if(v.estado==='INCORRETO_NCM') return '<span class="r-lbl">Esperado</span><strong class="INCORRETO_NCM">AJUSTAR O NCM — sem enquadramento para o NCM informado</strong>';
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
 if(!esp&&(v.regrasCandidatas||[]).length) return '<span class="r-lbl">Esperado</span><span class="small">REQUER VALIDAÇÃO — '+v.regrasCandidatas.length+' regra(s) candidata(s) (escolha na tela Pendências)</span>';
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
const FONTES_LEGAIS={
 lc214:'LC 214/2025 (texto do Planalto, com as alterações da LC 227/2026): https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp214.htm',
 svrs:'Portal da Conformidade Fácil (SVRS) — Classificação Tributária: https://dfe-portal.svrs.rs.gov.br/Cff/ClassificacaoTributaria',
 obrigatoriedade:'Ato Conjunto RFB/CGIBS nº 4/2026: grupo IBS/CBS obrigatório na NF-e/NFC-e do regime normal desde 03/08/2026',
 dispensa:'LC 214/2025, art. 348, § 1º: em 2026 o recolhimento só é dispensado se cumpridas as obrigações acessórias'
};
function textoPct(x){ return x==null?'-':Math.round(x*100)+'%'; }
function textoRegraCandidata(id,ncm){
 const g=regrasUI[id+'|'+ncm]||{};
 return (g.cst||'?')+'/'+(g.cClassTrib||'?')+' — '+(g.rotulo||id)+' (Anexo '+(g.anexo||'?')+', item '+(g.item||'?')+'; redução '+textoPct(g.reducao)+'; '+(g.fundamentoLegal||'fundamento não informado')+(g.vigenciaInicio?'; vigência desde '+g.vigenciaInicio:'')+')';
}
/** Produto → XML → problema → enquadramento esperado → fundamento → impacto, só com o que o veredito e a base trazem. */
function blocoDiagnosticoRisco(v){
 if(v.estado!=='INCORRETO_RISCO') return '';
 const inf=v.informado||{};
 const ausente=inf.cst==null&&inf.cClassTrib==null;
 const problema=ausente
  ?'Grupo IBS/CBS ausente no item: o documento não informa CST nem cClassTrib, obrigatórios na data de emissão.'
  :/^Código .* no lugar do regime/.test(v.motivo)
   ?'O documento usa outro benefício no lugar do regime específico de bares e restaurantes.'
   :'O documento usa o cClassTrib '+(inf.cClassTrib||'?')+', sem regra que o ampare para o NCM '+(v.ncm||'?')+'.';
 const cands=(v.regrasCandidatas||[]);
 const esperado=v.esperado
  ?esc(v.esperado.cst+'/'+v.esperado.cClassTrib)+(v.regraAplicada&&regrasUI[v.regraAplicada+'|'+v.ncm]?' — '+esc(textoRegraCandidata(v.regraAplicada,v.ncm)):(v.regraAplicada&&/^LC/.test(v.regraAplicada)?' — '+esc(v.regraAplicada):' — regra geral (sem benefício aplicável)'))
  :'<strong>REQUER VALIDAÇÃO</strong>: '+(cands.length?'o NCM admite '+cands.length+' enquadramento(s) com benefício; sem confirmação, vale a regra geral 000/000001. Candidatas:<ul>'+cands.map(id=>'<li>'+esc(textoRegraCandidata(id,v.ncm))+'</li>').join('')+'</ul>Responda SIM/NÃO na tela Pendências.':'sem regra candidata.');
 const fundamentos=[];
 if(ausente){ fundamentos.push(FONTES_LEGAIS.obrigatoriedade); fundamentos.push(FONTES_LEGAIS.dispensa); }
 if(v.regraAplicada&&regrasUI[v.regraAplicada+'|'+v.ncm]) fundamentos.push((regrasUI[v.regraAplicada+'|'+v.ncm].fonte||'')+' — '+(regrasUI[v.regraAplicada+'|'+v.ncm].fundamentoLegal||''));
 cands.forEach(id=>{ const g=regrasUI[id+'|'+v.ncm]; if(g&&g.fonte) fundamentos.push(g.fonte+' — '+(g.fundamentoLegal||'')); });
 fundamentos.push(FONTES_LEGAIS.lc214); fundamentos.push(FONTES_LEGAIS.svrs);
 const impacto=v.exposicao!=null
  ?formatarNumero(v.exposicao)+(v.esperado?' de IBS/CBS devido pelo enquadramento esperado, sem destaque no documento.':' de IBS/CBS devido no mínimo (considerando a maior redução entre as candidatas); o valor final depende da validação.')
  :'não calculado (sem alíquota vigente ou sem enquadramento determinável).';
 return '<div class="card aud-risco"><h4>Diagnóstico do INCORRETO — risco</h4>'+
  '<div class="small"><strong>No XML:</strong> NCM '+esc(v.ncm||'-')+' · CST '+esc(inf.cst??'ausente')+' · cClassTrib '+esc(inf.cClassTrib??'ausente')+' · base '+formatarNumero(v.baseCalculo)+' · IBS/CBS informado '+(v.valorInformadoTotal==null?'não informado':formatarNumero(v.valorInformadoTotal))+'</div>'+
  '<div class="small"><strong>Problema identificado:</strong> '+esc(problema)+'</div>'+
  '<div class="small"><strong>Enquadramento esperado:</strong> '+esperado+'</div>'+
  '<div class="small"><strong>NCM:</strong> '+esc(v.motivo.includes('A descrição indica')?'possível divergência entre a descrição e o NCM (ver motivo); REQUER VALIDAÇÃO do NCM.':'sem indício de NCM incorreto na descrição; mantido '+(v.ncm||'-')+'.')+'</div>'+
  '<div class="small"><strong>Impacto tributário potencial:</strong> '+impacto+'</div>'+
  '<div class="small"><strong>Fontes:</strong><ul>'+[...new Set(fundamentos)].map(f=>'<li>'+esc(f)+'</li>').join('')+'</ul></div>'+
 '</div>';
}
/** Respostas SIM/NÃO já registradas para o produto, com os mesmos botões para revisar a resposta. */
function blocoRespostasRegistradas(v){
 const rs=(respostas||[]).filter(r=>r.ncm===v.ncm&&(r.cProd===v.cProd||r.cProd===v.produto));
 if(!rs.length) return '';
 return '<div class="card aud-resposta"><h4>Resposta registrada nesta análise</h4>'+rs.map(r=>{
  const g=regrasUI[r.regraId+'|'+r.ncm]||{};
  return '<div class="small"><strong>'+(r.resposta==='NAO'?'NÃO':'SIM')+'</strong> para '+esc(textoRegraCandidata(r.regraId,r.ncm))+' · '+esc(r.autor||'')+' · '+esc(r.data||'')+'</div>'+
   (g.descricaoLegal?'<div class="small">A regra exige: “'+esc(g.descricaoLegal)+'”. Confira se o produto “'+esc(v.produto)+'” atende a essa descrição.</div>':'')+
   '<div class="barra"><span class="small">Revisar a resposta:</span>'+
   '<button class="secondary'+(r.resposta==='SIM'?' validacao-selecionada':'')+'" data-validar="SIM" data-ncm="'+esc(r.ncm)+'" data-cprod="'+esc(r.cProd)+'" data-regra="'+esc(r.regraId)+'">SIM</button>'+
   '<button class="secondary'+(r.resposta==='NAO'?' validacao-selecionada':'')+'" data-validar="NAO" data-ncm="'+esc(r.ncm)+'" data-cprod="'+esc(r.cProd)+'" data-regra="'+esc(r.regraId)+'">NÃO</button></div>';
 }).join('')+'</div>';
}
function explicacaoComposicao(c,r){
 if(!c||r.xmls===r.documentos&&!c.eventos.length&&!c.descartados.length&&!c.naoReconhecidos.length) return '';
 const partes=[];
 if(c.eventos.length) partes.push(c.eventos.length+' XML(s) de evento (não são documentos de venda): '+c.eventos.map(e=>e.arquivo+' — '+e.tipo).join('; '));
 if(c.naoReconhecidos.length) partes.push(c.naoReconhecidos.length+' XML(s) não reconhecido(s): '+c.naoReconhecidos.map(x=>x.arquivo+' — '+x.motivo).join('; '));
 Object.entries(c.descartadosPorMotivo||{}).forEach(([m,n])=>partes.push(n+' documento(s) descartado(s): '+m));
 const lidos=c.documentosLidos;
 return '<div class="aviso composicao-xmls"><strong>XMLs processados: '+c.arquivos+' · Documentos analisados: '+c.documentosAnalisados+' · Diferença: '+(c.arquivos-c.documentosAnalisados)+'</strong>'+
  '<div class="small">'+c.arquivos+' XML(s) lidos = '+lidos+' documento(s) fiscal(is)'+(c.eventos.length?' + '+c.eventos.length+' evento(s)':'')+(c.naoReconhecidos.length?' + '+c.naoReconhecidos.length+' não reconhecido(s)':'')+'. Dos '+lidos+' documentos, '+(lidos-c.documentosAnalisados)+' foram descartados e '+c.documentosAnalisados+' analisados.</div>'+
  '<details><summary>Ver o motivo de cada diferença</summary><ul>'+partes.map(p=>'<li class="small">'+esc(p)+'</li>').join('')+
  (c.descartados.length?'<li class="small">Documentos descartados: '+c.descartados.map(d=>esc(d.documento+' ('+d.motivo+')')).join('; ')+'</li>':'')+'</ul></details></div>';
}
function auditoriaDetalhadaResultado(v){
 return blocoDiagnosticoRisco(v)+blocoRespostasRegistradas(v)+
  '<div class="small">Documento '+esc(v.documento)+' · item '+esc(v.nItem)+' · regra aplicada: '+esc(v.regraAplicada||'nenhuma')+'</div>'+
  '<div class="small">Benefício / enquadramento: '+esc(beneficioDoItem(v))+'</div>'+
  quadroRegraResultado(v)+blocoReducao(v)+blocoAuditoriaResultado(v)+blocosBloqueioDoItem(v)+
  '<div class="small">Por que este resultado: '+esc(textoMotivo(v))+'</div>'+
  (v.dadosFaltantes&&v.dadosFaltantes.length?'<div class="small">Dados faltantes: '+esc(v.dadosFaltantes.join(', '))+'</div>':'')+
  (alertasUI.porItemHtml[v.documento+'|'+v.nItem]||'');
}
/** Aviso destacado: a validação indicou NCM errado; o cadastro do produto precisa ser ajustado no ERP. */
function avisoAjusteNcm(v){
 if(v.estado!=='INCORRETO_NCM'&&!v.ncmACorrigir) return '';
 return '<div class="aviso-ncm" role="alert"><strong>⚠ AJUSTAR O NCM DO PRODUTO</strong>'+
  '<span>A validação indicou que o NCM '+esc(v.ncm||'')+' informado está errado. Corrija o NCM no cadastro do produto no ERP e reprocesse com as novas notas. Nenhum benefício de outro NCM é aplicado.</span></div>';
}
function cartaoResultado(v,i){
 const red=linhaReducao(v);
 return '<div class="item-res compacto" data-estado="'+esc(v.estado)+'">'+avisoAjusteNcm(v)+
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
 if(b){
 b.style.setProperty('background','#2C4233','important');
 b.style.setProperty('color','white','important');
}
},true);
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-validar]');
 if(b){
  b.classList.add('validacao-selecionada');

  requestAnimationFrame(()=>{
   requestAnimationFrame(()=>{
    validar(b.dataset.ncm,b.dataset.cprod,b.dataset.regra,b.dataset.validar);
   });
  });
 }
});

async function carregarPendentes(){
 try{
   const r=await fetch('/api/fila-validacao');
   pendentes=await r.json();
   renderPendentes();
 }catch(e){
   document.getElementById('listaPendentes').innerHTML='<p>Não foi possível carregar as pendências.</p>';
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

/** Regra encontrada pelo NCM e rejeitada para o produto: mostra a regra, a redução prevista e por que não se aplica. */
function regraNaoAplicavel(g,p){ return (p.regrasNaoAplicaveis||[]).find(x=>x.regraId===g.id)||null; }
function blocoRegraNaoAplicavel(g,x,p){
 const pc=v=>Math.round((v||0)*100)+'%';
 return '<div class="regra-cand regra-nao-aplicavel">'+
  '<div class="small">Regra encontrada pelo NCM: '+esc(g.id)+'</div>'+
  '<div class="bloco"><span class="rotulo">Descrição legal do benefício</span><div class="descricao-legal">'+esc(g.descricaoLegal||'')+'</div></div>'+
  '<div class="nao-aplicavel-quadro">'+
   '<div><span class="rotulo">Regra encontrada pelo NCM</span>CST '+esc(x.cst)+' / cClassTrib '+esc(x.cClassTrib)+' / Anexo '+esc(x.anexo)+' / Item '+esc(x.item||'?')+'</div>'+
   '<div><span class="rotulo">Redução prevista na regra</span>'+pc(x.reducaoPrevista)+' IBS / '+pc(x.reducaoPrevista)+' CBS</div>'+
   '<div class="selo selo-nao-aplicavel">Resultado da validação: NÃO APLICÁVEL AO PRODUTO</div>'+
   '<div class="small"><strong>Motivo:</strong> o benefício é específico para '+esc(x.designacaoLegal)+'. A descrição do produto ("'+esc(p.produto)+'") não atende, por si só, à descrição legal. A redução de '+pc(x.reducaoPrevista)+' não é aplicada; o enquadramento correto é procurado entre as demais hipóteses.</div>'+
  '</div>'+
 '</div>';
}
/** Uma regra candidata: descrição legal, enquadramento proposto, redução prevista e a pergunta. */
function blocoRegraCandidata(g,p,i,total){
 const naoAplicavel=regraNaoAplicavel(g,p);
 if(naoAplicavel) return blocoRegraNaoAplicavel(g,naoAplicavel,p);
 const resp=(p.respostasDestaAnalise||[]).filter(x=>x.regraId===g.id);
 const respostaAtual=resp.length?resp[resp.length-1].resposta:null;
 const classeSim=respostaAtual==='SIM'?' validacao-selecionada':'';
 const classeNao=respostaAtual==='NAO'?' validacao-selecionada':'';
 const descricao=g.descricaoLegal!=null
  ?'<div class="descricao-legal">'+esc(g.descricaoLegal)+'</div>'
  :(g.descricoesLegaisDivergentes&&g.descricoesLegaisDivergentes.length
    ?'<div class="small">A base tem '+esc(g.regrasComEsteIdentificador)+' regras com este identificador, com descrições legais diferentes:</div><ul class="descricoes">'+g.descricoesLegaisDivergentes.map(d=>'<li>'+esc(d)+'</li>').join('')+'</ul>'
    :'<div class="small">Descrição legal não disponível na base para esta regra.</div>');
 const duplicado=g.identificadorRepetido
  ?'<div class="aviso-regra">Atenção: o identificador '+esc(g.id)+' corresponde a '+esc(g.regrasComEsteIdentificador)+' regras na base; a regra não pôde ser identificada com segurança. Pelo comportamento atual do motor, um SIM confirma todas elas ao mesmo tempo e o item continua pendente (mais de um benefício confirmado).</div>'
  :'';
 return '<div class="regra-cand">'+
  '<div class="small">'+(total>1?'<strong>'+esc(p.produto)+'</strong> (cProd '+esc(p.cProd)+') · ':'')+'Regra candidata'+(total>1?' '+(i+1)+' de '+total:'')+': '+esc(g.id)+' — aguardando validação</div>'+
  duplicado+
  '<div class="bloco"><span class="rotulo">Descrição legal do benefício</span>'+descricao+'</div>'+
  quadroRegra({cst:g.cst,cClassTrib:g.cClassTrib,anexo:g.anexo,item:g.item,fundamento:g.fundamentoLegal,reducao:g.reducao,auditoria:g.auditoria,humano:'pendente',semCadastro:{total:p.itensSemInformacaoTributaria||0,naoObrigatorios:p.itensNaoObrigatoriosSemInformacao||0},titulo:'Enquadramento proposto'})+
    '<details>'+
  '<summary>Detalhes</summary>'+
  blocoAuditoria(g.auditoria)+
  blocoReducaoPrevista(g,p)+
  '</details>'+
  (resp.length?'<div class="small resposta-registrada">Resposta registrada nesta análise: '+esc(resp.map(x=>(x.resposta==='NAO'?'NÃO':'SIM')+' ('+x.data+')').join(', '))+'</div>':'')+
  (total>1||temMultipla(p)?'':
  '<div class="pergunta-validacao"><span class="rotulo">Pergunta</span>Com base na descrição legal acima, o produto atende aos requisitos para este enquadramento?</div>'+
  '<div class="acoes">'+
   '<button class="secondary'+classeSim+'" data-validar="SIM" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regra="'+esc(g.id)+'">SIM</button>'+
   '<button class="secondary'+classeNao+'" data-validar="NAO" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regra="'+esc(g.id)+'">NÃO</button>'+
  '</div>')+
 '</div>';
}
/** Selos do produto (uma vez por cartão quando há várias regras candidatas). */
function selosDoProduto(p){
 const sc=p.itensSemInformacaoTributaria||0, nob=p.itensNaoObrigatoriosSemInformacao||0;
 return '<div class="selos-produto">'+
  '<div class="selo selo-pendente">Enquadramento do produto: aguardando validação humana</div>'+
  (sc?'<div class="selo selo-sem-cadastro" title="Vendas deste produto saíram sem o grupo IBS/CBS no XML: o cadastro do produto não tem CST nem cClassTrib.">Produto sem informação tributária no cadastro: '+sc+' venda(s) sem CST/cClassTrib'+(nob?' ('+nob+' não obrigatória(s) na data)':'')+'</div>':'')+
 '</div>';
}
/** Uma possibilidade legal dentro do produto agrupado: descrição, enquadramento, redução e o SIM desta hipótese. */
function opcaoEnquadramento(g,p,i){
 const naoAplicavel=regraNaoAplicavel(g,p);
 if(naoAplicavel) return '<li class="enq-opcao">'+blocoRegraNaoAplicavel(g,naoAplicavel,p)+'</li>';
 const resp=(p.respostasDestaAnalise||[]).filter(x=>x.regraId===g.id);
 const respostaAtual=resp.length?resp[resp.length-1].resposta:null;
 const o=g.reducao;
 const red=o&&o.valor!=null&&o.evidencia!=='nao_determinada'?' · Redução da alíquota: '+pct(o.valor):'';
 const descricao=g.descricaoLegal!=null
  ?'<div class="descricao-legal">'+esc(g.descricaoLegal)+'</div>'
  :(g.descricoesLegaisDivergentes&&g.descricoesLegaisDivergentes.length
    ?'<div class="small">A base tem '+esc(g.regrasComEsteIdentificador)+' regras com este identificador, com descrições legais diferentes:</div><ul class="descricoes">'+g.descricoesLegaisDivergentes.map(d=>'<li>'+esc(d)+'</li>').join('')+'</ul>'
    :'<div class="small">Descrição legal não disponível na base para esta regra.</div>');
 const duplicado=g.identificadorRepetido
  ?'<div class="aviso-regra">Atenção: o identificador '+esc(g.id)+' corresponde a '+esc(g.regrasComEsteIdentificador)+' regras na base; a regra não pôde ser identificada com segurança. Pelo comportamento atual do motor, um SIM confirma todas elas ao mesmo tempo e o item continua pendente (mais de um benefício confirmado).</div>'
  :'';
 return '<li class="enq-opcao">'+
  '<div class="enq-cab">CST '+esc(g.cst||'—')+' · cClassTrib '+esc(g.cClassTrib||'—')+' · Anexo '+esc(g.anexo||'—')+', item '+esc(g.item||'—')+esc(red)+'</div>'+
  '<div class="small">Regra '+esc(g.id)+(g.fundamentoLegal?' · Fundamento: '+esc(g.fundamentoLegal):'')+'</div>'+
  duplicado+descricao+
  '<details><summary>Detalhes</summary>'+
   quadroRegra({cst:g.cst,cClassTrib:g.cClassTrib,anexo:g.anexo,item:g.item,fundamento:g.fundamentoLegal,reducao:g.reducao,auditoria:g.auditoria,humano:null,titulo:'Enquadramento proposto'})+
   blocoAuditoria(g.auditoria)+
   blocoReducaoPrevista(g,p)+
  '</details>'+
  (resp.length?'<div class="small resposta-registrada">Resposta registrada nesta análise: '+esc(resp.map(x=>(x.resposta==='NAO'?'NÃO':'SIM')+' ('+x.data+')').join(', '))+'</div>':'')+
  (temMultipla(p)?'':'<div class="acoes"><button class="secondary'+(respostaAtual==='SIM'?' validacao-selecionada':'')+'" data-validar="SIM" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regra="'+esc(g.id)+'">SIM — este enquadramento ('+(i+1)+')</button></div>')+
 '</li>';
}
/** Produto com várias regras candidatas: aparece uma vez, com todas as possibilidades legais e uma única validação. */
function enquadramentosAgrupados(p,regras){
 const ids=regras.map(g=>g.id);
 return '<div class="enq-agrupados">'+
  '<span class="rotulo">Possíveis enquadramentos/benefícios legais ('+regras.length+')</span>'+
  '<ol>'+regras.map((g,i)=>opcaoEnquadramento(g,p,i)).join('')+'</ol>'+
  (temMultipla(p)?'':
  '<div class="pergunta-validacao"><span class="rotulo">Validação</span>'+
  'Com base nas descrições legais acima, o produto atende aos requisitos de algum destes enquadramentos? Responda SIM no enquadramento aplicável, ou NÃO se nenhum se aplica.</div>'+
  '<div class="acoes">'+
   '<button class="secondary" data-validar-lote="NAO" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regras="'+esc(ids.join(','))+'">NÃO — nenhum se aplica</button>'+
  '</div>')+'</div>';
}

/** Há pergunta de múltipla escolha para o produto ("O que é este produto?"). */
function temMultipla(p){ return !!(p&&p.opcoesValidacao&&p.opcoesValidacao.length); }
/** Pergunta de múltipla escolha: cada opção mostra o resultado e o porquê antes do clique. */
function perguntaMultiplaEscolha(p){
 if(!temMultipla(p)) return '';
 const resp=p.respostasDestaAnalise||[];
 const ult=resp.length?resp[resp.length-1]:null;
 const marcada=o=>!!ult&&(o.tipo==='REGRA'?(ult.resposta==='SIM'&&ult.regraId===o.regraId):ult.escolha===o.tipo);
 const ids=(p.regras||[]).join(',');
 return '<div class="pergunta-multipla">'+
  '<div class="pergunta-validacao"><span class="rotulo">Pergunta</span>O que é este produto? Escolha a opção que corresponde à realidade. O resultado de cada opção aparece ao lado.</div>'+
  '<ol class="mc-opcoes">'+p.opcoesValidacao.map(o=>
   '<li class="mc-opcao'+(o.naoRecomendada?' mc-nao-recomendada':'')+'">'+
    '<button class="secondary'+(marcada(o)?' validacao-selecionada':'')+'" data-escolha="'+esc(o.tipo)+'" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regra="'+esc(o.regraId||'')+'" data-regras="'+esc(ids)+'">'+esc(o.rotulo)+'</button>'+
    '<div class="mc-resultado">→ '+esc(o.resultado)+'</div>'+
    '<div class="small">'+esc(o.explicacao)+'</div>'+
    (o.naoRecomendada?'<div class="small mc-alerta">Não recomendada: '+esc(o.naoRecomendada)+'</div>':'')+
   '</li>').join('')+'</ol>'+
  '<div class="small">Não sabe? Deixe sem resposta: o produto continua pendente.</div>'+
 '</div>';
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-escolha]');
 if(!b) return;
 b.classList.add('validacao-selecionada');
 b.disabled=true;
 if(b.dataset.escolha==='REGRA') validar(b.dataset.ncm,b.dataset.cprod,b.dataset.regra,'SIM');
 else validarEscolha(b.dataset.ncm,b.dataset.cprod,b.dataset.regras.split(',').filter(Boolean),b.dataset.escolha);
});
async function validarEscolha(ncm,cProd,regraIds,escolha){
 const r=await fetch('/api/validar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ncm,cProd,regraIds,resposta:'NAO',escolha,autor:'Sistema'})});
 const d=await r.json();
 if(!r.ok){alert(d.erro||'Erro ao validar.');return;}
 await recarregarTudo();
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
     (regras.length>1
      ?selosDoProduto(p)+enquadramentosAgrupados(p,regras)
      :regras.map((g,i)=>blocoRegraCandidata(g,p,i,regras.length)).join(''))+
     perguntaMultiplaEscolha(p)+
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

document.addEventListener('click',e=>{
 const b=e.target.closest('[data-validar-lote]');
 if(!b) return;
 b.classList.add('validacao-selecionada');
 b.disabled=true;
 validarLote(b.dataset.ncm,b.dataset.cprod,b.dataset.regras.split(','),'NAO');
});
async function validarLote(ncm,cProd,regraIds,resposta){
 const r=await fetch('/api/validar',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ncm,cProd,regraIds,resposta,autor:'Sistema'})});
 const d=await r.json();
 if(!r.ok){alert(d.erro||'Erro ao validar.');return;}
 await recarregarTudo();
}
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

/* ---------- Benefício ou redução de alíquota por atividade (aba Análise; independe do produto/NCM) ---------- */
const CLASSE_BENEFICIO_ATIVIDADE={CONFIRMADO:'selo-oficial',REQUER_VALIDACAO:'selo-pendente',NENHUM:'selo-aviso'};
function pctAtividade(x){ return x==null?'—':(x*100).toLocaleString('pt-BR',{maximumFractionDigits:3})+'%'; }
function beneficioAtividadeHtml(d){
 const b=d.beneficio;
 const linha=(r,v)=>'<div class="aliquota-descricao"><strong>'+esc(r)+':</strong> '+esc(v)+'</div>';
 const aud=(d.auditoria||[]).map(p=>'<li class="small"><strong>'+esc(p.camada)+'</strong> · '+esc(p.texto)+'</li>').join('');
 const f=d.fonte||{};
 return '<div class="selo '+(CLASSE_BENEFICIO_ATIVIDADE[d.classificacao]||'selo-aviso')+'">'+esc(d.rotulo)+'</div>'+
  linha('Atividade',d.atividade.descricao)+
  linha('Atividade confirmada no cadastro da empresa',d.atividade.declaradaNoCadastro?'sim':'não')+
  (b?linha('Benefício',b.descricao+' Atividade da lei: '+b.atividadeDaLei+'.')+
   linha('Percentual de redução',pctAtividade(b.percentualReducao))+
   linha('Alíquota geral',b.aliquotaGeral==null?'sem alíquota vigente':pctAtividade(b.aliquotaGeral)+' ('+b.aliquotas.map(a=>a.tributo+' '+pctAtividade(a.aliquota)).join(' + ')+', em '+b.dataAliquotas+')')+
   linha('Alíquota após redução',b.aliquotaAposReducao==null?'—':pctAtividade(b.aliquotaAposReducao)+' ('+b.aliquotas.map(a=>a.tributo+' '+pctAtividade(a.aliquota*(1-b.percentualReducao))).join(' + ')+')')+
   linha('Fundamento legal',b.fundamentoLegal)+
   '<div class="aliquota-descricao"><strong>Condições para aplicação:</strong></div><ul class="fatos">'+b.condicoes.map(c=>'<li class="small">'+esc(c.texto)+'</li>').join('')+'</ul>':'')+
  '<details><summary>Auditoria e fontes</summary>'+
   '<div class="small"><strong>Atividade da empresa → benefício → percentual → fundamento → condições → fonte</strong></div>'+
   '<ul class="fatos">'+aud+'</ul>'+
   (b?'<div class="small"><strong>Texto legal (literal)</strong></div><ul class="fatos">'+b.textoLegal.map(t=>'<li class="small"><a href="'+esc(t.url)+'" target="_blank" rel="noopener">'+esc(t.dispositivo)+'</a>: '+esc(t.texto)+'</li>').join('')+'</ul>':'')+
   '<div class="small">Fonte: '+esc(f.nome||'')+' — <a href="'+esc(f.url||'')+'" target="_blank" rel="noopener">'+esc(f.url||'')+'</a> · '+esc(f.versao||'')+' · consultado em '+esc(f.dataConsulta||'')+' · arquivo '+esc(f.arquivo||'')+' · snapshot '+esc(curto(f.sha256))+'</div>'+
   '<div class="small aud-nota">Esta verificação é só da atividade da empresa. A tributação de cada produto/NCM continua sendo a do motor, mostrada nas demais telas, e não é alterada aqui.</div>'+
  '</details>';
}
async function carregarBeneficioAtividade(){
 const alvo=document.getElementById('beneficioAtividadeConteudo');
 if(!alvo) return;
 try{
   const r=await fetch('/api/beneficio-atividade');
   const d=await r.json();
   alvo.innerHTML=r.ok?beneficioAtividadeHtml(d):'<div class="aviso-regra">'+esc(d.erro||'Não foi possível verificar o benefício por atividade.')+'</div>';
 }catch(erro){
   alvo.innerHTML='<div class="aviso-regra">Não foi possível verificar o benefício por atividade.</div>';
 }
}

/* ---------- Consulta Tributária por NCM (aba nova; só exibição do que o motor e o explicador devolvem) ---------- */
const ROTULO_CONCLUSAO_NCM={
 ENQUADRAMENTO_DETERMINADO:'Enquadramento determinado pelo motor',
 REQUER_VALIDACAO_HUMANA:'REQUER VALIDAÇÃO HUMANA',
 REGRA_GERAL_SEM_BENEFICIO:'Regra geral — sem benefício aplicável na base',
 INDETERMINADO:'INDETERMINADO — o motor não classificou',
 NAO_OBRIGATORIO:'Grupo IBS/CBS ainda não exigido na data'
};
const ROTULO_SITUACAO_REGRA_NCM={aplicada:'Regra aplicada pelo motor',candidata:'Regra candidata (aguarda confirmação humana)',bloqueada:'BLOQUEADA — incompatibilidade oficial',fora_da_vigencia:'Fora da vigência na data da consulta',nao_considerada:'Não considerada pelo motor para a natureza informada'};
const ROTULO_STATUS_NORMATIVO={NORMA_CONFIRMADA:'NORMA_CONFIRMADA — a regra coincide com as fontes oficiais (não confirma o benefício para o produto)',NORMA_POSSIVEL_MULTIPLOS_ITENS:'NORMA_POSSIVEL_MULTIPLOS_ITENS — o NCM aparece em mais de um item da norma',CONFLITO_PLANILHA_FONTE:'CONFLITO_PLANILHA_FONTE — a base diverge da fonte oficial',CONFLITO_ENTRE_FONTES:'CONFLITO_ENTRE_FONTES — as fontes oficiais divergem entre si',SEM_EVIDENCIA_OFICIAL:'SEM_EVIDENCIA_OFICIAL — regra só da planilha, sem vínculo oficial registrado'};
function secaoNcm(n,titulo,corpo){ return '<div class="bloco"><span class="rotulo">'+n+'. '+esc(titulo)+'</span>'+corpo+'</div>'; }
function linhaNcm(rotulo,valor){ return '<div><span class="rotulo">'+esc(rotulo)+'</span><span class="valor">'+esc(valor==null||valor===''?'—':valor)+'</span></div>'; }
function pctNcm(x){ return x==null?'—':(x*100).toLocaleString('pt-BR',{maximumFractionDigits:3})+'%'; }
function fatoNcm(f){
 return '<li><span class="small"><strong>FONTE_DIZ</strong> · '+esc(textoFato(f))+'</span>'+
  '<div class="small">Arquivo '+esc(f.arquivo||'')+(f.versao?' · versão '+esc(f.versao):'')+(f.dataConsulta?' · consultado em '+esc(f.dataConsulta):'')+(f.sha256?' · snapshot '+esc(curto(f.sha256)):'')+'</div></li>';
}
function inferenciaNcm(i){
 return '<li><span class="small"><strong>SISTEMA_INFERE</strong> ('+esc(i.regra)+') · '+esc(i.conclusao)+'</span>'+
  ((i.premissas||[]).length?'<ul class="fatos">'+i.premissas.map(fatoNcm).join('')+'</ul>':'')+'</li>';
}
/** Rótulo da evidência da redução, como o explicador a classificou. */
const ROTULO_EVIDENCIA_REDUCAO={oficial_confirmada:'confirmada nas fontes oficiais',oficial_divergente:'divergente das fontes oficiais',sem_evidencia_oficial:'não confirmada oficialmente (prevista na base normativa)',nao_determinada:'não determinada'};
function listaNcm(titulo,itens){ return itens?'<div class="small"><strong>'+esc(titulo)+'</strong></div><ul class="fatos">'+itens+'</ul>':''; }
function itemNcm(t){ return '<li class="small">'+esc(t)+'</li>'; }
/** Auditoria de UMA regra: fonte, inferência, confirmação humana, critérios do motor, candidatura e pendências. */
function auditoriaRegraNcm(g,e,r){
 const a=e&&e.auditoriaOficial, b=e&&e.bloqueio, p=r.parametros;
 const leiCobre=a?(a.fatosF1||[]).filter(f=>f.papel==='cobre o NCM'):[];
 const fonte=(e&&(e.fonteDiz||[]).length)
  ?e.fonteDiz.map(fatoNcm).join('')
  :leiCobre.map(f=>itemNcm('FONTE_DIZ · LC 214/2025, '+f.dispositivo+': '+f.trecho)).join('')+
   (a?[...new Set((a.fatosF2||[]).map(f=>'FONTE_DIZ · SVRS: '+f.TipoPermissao+' — '+f.DescItemAnexo+(f.DescExcecao?' (exceção: '+f.DescExcecao+')':'')))].map(itemNcm).join(''):'');
 const inferido=(e?(e.sistemaInfere||[]).map(inferenciaNcm).join(''):'')+
  (a?itemNcm('Conferência da regra com a fonte oficial: '+(ROTULO_AUDITORIA[a.status]||a.status))+alertasDaAuditoria(a).map(itemNcm).join('')+(a.status!=='CONFIRMADA'?(a.motivos||[]).map(m=>itemNcm('Motivo da conferência: '+m)).join(''):''):itemNcm('Sem conferência da regra com a fonte oficial.'))+
  (e&&e.statusNormativo?itemNcm('Status normativo: '+(ROTULO_STATUS_NORMATIVO[e.statusNormativo]||e.statusNormativo)):'')+
  (e&&(e.sinalizadores||[]).length?itemNcm('Sinalizadores: '+e.sinalizadores.join(', ')):'');
 const condNaoXml=(e?(e.condicoes||[]):[]).filter(c=>c.verificavelPeloXml!=='sim');
 const humano=g.situacao==='candidata'
  ?itemNcm('Se o produto atende à descrição legal desta regra (Anexo '+g.anexo+', item '+g.item+'): "'+g.descricaoLegal+'".')+
   condNaoXml.map(c=>itemNcm('Condição da norma que o XML não comprova ('+c.natureza+'): '+textoFato(c.textoOficial))).join('')+
   itemNcm('HUMANO_CONFIRMOU: nenhuma confirmação — a consulta não tem produto, então nenhuma resposta SIM/NÃO é aproveitada. NORMA_CONFIRMADA não confirma o benefício para o produto.')
  :g.situacao==='aplicada'?itemNcm('Regra aplicada pelo motor.')
  :itemNcm('Nada: a regra não é candidata ('+(ROTULO_SITUACAO_REGRA_NCM[g.situacao]||g.situacao)+').');
 const noPeriodo=g.vigenciaInicio<=p.data&&(g.vigenciaFim===null||g.vigenciaFim>=p.data);
 const criterios=itemNcm('NCM da regra ('+g.ncmRegra+') igual ao NCM consultado ('+r.ncm+').')+
  itemNcm('Vigência da regra ('+g.vigenciaInicio+' a '+(g.vigenciaFim||'sem data final')+') × data da consulta ('+p.data+'): '+(noPeriodo?'dentro da vigência':'fora da vigência')+'.')+
  itemNcm('Bloqueio por incompatibilidade oficial do NCM com o enquadramento: '+(b?'sim':'não')+'.')+
  itemNcm('Natureza do item: '+(p.natureza||(p.naturezaOrigem==='deduzida_pelo_motor'?'mercadoria (deduzida pelo motor)':'não informada'))+'.')+
  itemNcm('Respostas SIM/NÃO consideradas: nenhuma.');
 const just=g.situacao==='candidata'?'O motor mantém a regra como candidata: regra da base para o NCM, vigente na data, não bloqueada e sem resposta humana. Sem a confirmação, ela não é aplicada nem descartada.'
  :g.situacao==='aplicada'?'Regra aplicada pelo motor.'
  :g.situacao==='bloqueada'?'O motor excluiu a regra das candidatas: '+(b?b.motivo:'regra bloqueada por incompatibilidade oficial.')
  :g.situacao==='fora_da_vigencia'?'O motor excluiu a regra das candidatas: fora da vigência na data da consulta.'
  :'O motor não considera regras de benefício da base para a natureza informada.';
 const pend=(e?(e.divergencias||[]):[]).map(d=>itemNcm('Divergência '+d.tipo+' ('+d.status+'; impacto: '+d.impacto+'): '+(d.valores||[]).map(x=>x.fonte+' = '+(typeof x.valor==='string'?x.valor:JSON.stringify(x.valor))).join(' · '))).join('')+
  (r.alertas||[]).filter(al=>(al.regras||[]).some(x=>x.regraId===g.id)).map(al=>itemNcm(al.titulo+' ['+al.categoria+' · '+al.camada+']: '+al.mensagem)).join('');
 return listaNcm('O que a fonte informa',fonte||itemNcm('Nenhum fato de fonte oficial registrado para esta regra.'))+
  listaNcm('O que o sistema inferiu',inferido)+
  listaNcm('O que depende de confirmação humana',humano)+
  listaNcm('Critérios utilizados pelo motor',criterios)+
  listaNcm('Justificativa',itemNcm(just))+
  listaNcm('Pendências ou lacunas',pend||itemNcm('Nenhuma pendência ou divergência registrada para esta regra.'));
}
/** Fontes de UMA regra: registro na base, fundamento, referência na lei, URLs e arquivos das evidências. */
function fontesRegraNcm(g,e){
 const a=e&&e.auditoriaOficial, c=a&&a.codigo||{};
 const arquivos=[...new Set((e?(e.fonteDiz||[]):[]).map(f=>f.fonte+' — arquivo '+f.arquivo+(f.versao?', versão '+f.versao:'')+(f.dataConsulta?', consultado em '+f.dataConsulta:'')+', snapshot '+curto(f.sha256)))];
 return '<ul class="fatos">'+
  itemNcm('Fonte do registro na base: '+g.fonte+(g.origemRegistro?' ('+g.origemRegistro+')':''))+
  itemNcm('Fundamento legal da regra: '+g.fundamentoLegal)+
  (c.F1&&c.F1.dispositivo?itemNcm('Referência normativa (fonte oficial): LC 214/2025, '+c.F1.dispositivo):'')+
  (a&&a.fontes?'<li class="small"><a href="'+esc(a.fontes.F1.url+(c.F1&&c.F1.ancora?'#'+c.F1.ancora:''))+'" target="_blank" rel="noopener">LC 214/2025 (Planalto)</a> — texto legal, snapshot '+esc(curto(a.fontes.F1.sha256))+'</li>'+
   '<li class="small"><a href="'+esc(a.fontes.F2.url)+'" target="_blank" rel="noopener">SVRS — Classificação Tributária</a> — tabela de apoio, snapshot '+esc(curto(a.fontes.F2.sha256))+'</li>':'')+
  arquivos.map(t=>itemNcm('Documento da evidência: '+t)).join('')+
 '</ul>';
}
/** Uma regra: identificação, classificação, enquadramento, condições, exceções, vedações; auditoria e fontes dela. */
function regraNcmHtml(g,e,r){
 const a=e&&e.auditoriaOficial, b=e&&e.bloqueio;
 const cond=(e?(e.condicoes||[]):[]).map(c=>itemNcm('('+c.natureza+'; verificável pelo XML: '+c.verificavelPeloXml+') '+textoFato(c.textoOficial)+(c.textoOperacional?' — SVRS: '+textoFato(c.textoOperacional):''))).join('');
 const excecoes=(a?(a.fatosF1||[]).filter(f=>f.papel==='exclui o NCM').map(f=>itemNcm('LC 214/2025, '+f.dispositivo+' (exclui o NCM): '+f.trecho)).join('')+
  [...new Set((a.fatosF2||[]).filter(f=>f.DescExcecao).map(f=>'SVRS: '+f.DescExcecao))].map(itemNcm).join('')+
  ((a.excecaoNaLeiEmItens||[]).length?itemNcm('Exceção na lei nos itens: '+a.excecaoNaLeiEmItens.join(', ')):''):'');
 const vedSvrs=a?[...new Set((a.fatosF2||[]).filter(f=>f.TipoPermissao==='VEDADO').map(f=>'SVRS: VEDADO — '+f.DescItemAnexo))].map(itemNcm).join(''):'';
 return '<div class="regra-cand">'+
  '<div class="enq-cab">'+esc(g.id)+' — '+esc(ROTULO_SITUACAO_REGRA_NCM[g.situacao]||g.situacao)+'</div>'+
  '<div class="quadro-campos">'+campoQuadro('CST',g.cst)+campoQuadro('cClassTrib',g.cClassTrib)+campoQuadro('Anexo',g.anexo)+campoQuadro('Item',g.item)+campoQuadro('Fundamento',g.fundamentoLegal)+'</div>'+
  linhaNcm('Classificação tributária',g.rotulo)+
  linhaNcm('Código CBS / IBS','CST '+g.cst+' · cClassTrib '+g.cClassTrib+' (o grupo IBSCBS usa o mesmo par para CBS e IBS)')+
  linhaNcm('Enquadramento','Anexo '+g.anexo+', item '+g.item+' ('+g.fundamentoLegal+')')+
  '<div class="bloco"><span class="rotulo">Descrição do enquadramento (descrição legal)</span><div class="descricao-legal">'+esc(g.descricaoLegal||'Descrição legal não disponível na base para esta regra.')+'</div></div>'+
  linhaNcm('Vigência',g.vigenciaInicio+' a '+(g.vigenciaFim||'sem data final'))+
  (g.observacao?linhaNcm('Observação da base',g.observacao):'')+
  listaNcm('Condições de aplicação',cond||itemNcm('Nenhuma condição registrada além da descrição legal.'))+
  listaNcm('Exceções',excecoes||itemNcm('Nenhuma exceção registrada para esta regra.'))+
  (b?'<div class="small"><strong>Vedações</strong></div>'+blocoBloqueio(b):listaNcm('Vedações',vedSvrs||itemNcm('Nenhuma vedação registrada para esta regra.')))+
  '<details><summary>Fontes da regra</summary>'+fontesRegraNcm(g,e)+'</details>'+
 '</div>';
}
/** Dados tributários de uma regra: só o que está na base, no motor ou na auditoria. */
function dadosTributariosRegraNcm(g,e,r){
 const a=e&&e.auditoriaOficial, f2=a&&a.codigo&&a.codigo.F2, red=e&&e.reducao;
 return '<div class="regra-cand">'+
  '<div class="enq-cab">'+esc(g.id)+' — CST '+esc(g.cst)+' · cClassTrib '+esc(g.cClassTrib)+'</div>'+
  linhaNcm('Redução da alíquota (base normativa)',pctNcm(g.reducaoAliquota))+
  (f2?linhaNcm('Redução no SVRS','IBS '+pctInteiro(f2.percRedIbs)+' · CBS '+pctInteiro(f2.percRedCbs)):'')+
  (red?linhaNcm('Evidência da redução',ROTULO_EVIDENCIA_REDUCAO[red.evidencia]||red.evidencia):'')+
  linhaNcm('Alíquota IBS + CBS com a redução, na data da consulta',g.aliquotaEfetiva==null?'sem alíquota vigente':pctNcm(g.aliquotaEfetiva))+
 '</div>';
}
function resultadoConsultaNcmHtml(r){
 const v=r.veredito, x=v.explicacaoInformativa||{}, p=r.parametros;
 const porId={}; (x.regras||[]).forEach(e=>{porId[e.regraIdInformado]=e;});
 const regras=r.regras.map(g=>Object.assign({ncmRegra:r.ncm},g));
 const esp=v.esperado;
 const regime=v.regraAplicada&&!regras.some(g=>g.id===v.regraAplicada);
 const regimeRed=x.reducaoDoItem&&x.reducaoDoItem.regimeEspecifico;
 // Enquadramento do motor sem regra de benefício da base: regra geral ou regime específico (texto do motor)
 const doMotor=esp&&(!v.regraAplicada||regime)
  ?'<div class="regra-cand"><div class="enq-cab">'+esc(regime?'Regime específico aplicado pelo motor: '+v.regraAplicada:'Regra geral indicada pelo motor')+'</div>'+
   '<div class="quadro-campos">'+campoQuadro('CST',esp.cst)+campoQuadro('cClassTrib',esp.cClassTrib)+'</div>'+
   linhaNcm('Código CBS / IBS','CST '+esp.cst+' · cClassTrib '+esp.cClassTrib+' (o grupo IBSCBS usa o mesmo par para CBS e IBS)')+
   linhaNcm('Motivo do motor',reformularMotivo(v.motivo))+'</div>'
  :'';
 const lacunas=(x.lacunas||[]).map(l=>'<li><span class="small"><strong>'+esc(l.status)+'</strong> · cClassTrib '+esc(l.cClassTrib)+' · inclusão como regra: '+esc(l.inclusaoComoRegra&&l.inclusaoComoRegra.status)+' (D5)</span><ul class="fatos">'+(l.fatos||[]).map(fatoNcm).join('')+'</ul></li>').join('');
 const semRegra=!regras.length
  ?'<div class="small">Nenhuma regra de benefício na base para este NCM.'+(r.encontradoNaBase?'':' O NCM não consta da base normativa: nenhuma regra de outro NCM foi usada e nada foi aproximado.')+'</div>'
  :'';
 const aliq=(v.aliquotaUsada||[]).length?v.aliquotaUsada:r.aliquotas;
 const aliqTxt=aliq.length?aliq.map(a=>a.tributo+' '+pctNcm(a.aliquota)).join(' + ')+(aliq.length===2?' = '+pctNcm(aliq.reduce((s,a)=>s+a.aliquota,0)):''):'nenhuma alíquota vigente na data';
 const comDados=regras.filter(g=>g.situacao==='aplicada'||g.situacao==='candidata');
 return '<div class="pendente">'+
  '<div class="pend-topo"><div><span class="rotulo">Resultado da consulta</span><strong>'+esc(ROTULO_CONCLUSAO_NCM[r.conclusao.tipo]||r.conclusao.tipo)+'</strong><div class="small">'+esc(r.conclusao.texto)+'</div></div>'+
  '<div class="pend-ncm"><span class="rotulo">NCM</span><span class="valor">'+esc(r.ncm)+'</span></div></div>'+
  secaoNcm(1,'Identificação do NCM',linhaNcm('NCM consultado',r.ncm)+linhaNcm('Informado como',p.entrada)+
   linhaNcm('Descrição do NCM',r.descricaoNcm.length?r.descricaoNcm.join(' | '):'não disponível na base normativa (a base não contém a TIPI completa)'))+
  secaoNcm(2,'Regras aplicadas e candidatas',doMotor+semRegra+regras.map(g=>regraNcmHtml(g,porId[g.id],r)).join('')+
   listaNcm('Lacunas da fonte',lacunas)+alertaLacunas(x.lacunasDeCobertura))+
  secaoNcm(3,'Dados tributários',linhaNcm('Alíquotas vigentes na data da consulta ('+p.data+')',aliqTxt)+
   (regime&&regimeRed?linhaNcm('Redução do regime específico ('+regimeRed.fundamento+')',pctNcm(regimeRed.valor)):'')+
   comDados.map(g=>dadosTributariosRegraNcm(g,porId[g.id],r)).join(''))+
 '</div>';
}
async function consultarNcmTela(){
 const alvo=document.getElementById('consultaNcmResultado');
 const botao=document.getElementById('btnConsultarNcm');
 const ncm=(document.getElementById('consultaNcmEntrada').value||'').trim();
 const digitos=ncm.split('.').join('').split(' ').join('');
 if(!ncm){ alvo.innerHTML='<div class="aviso-regra">Informe o NCM.</div>'; return; }
 if(!/^[0-9]{8}$/.test(digitos)){ alvo.innerHTML='<div class="aviso-regra">NCM inválido: informe 8 dígitos, com ou sem pontos (ex.: 1901.20.90 ou 19012090).</div>'; return; }
 botao.disabled=true;
 alvo.innerHTML='<p class="small">Consultando...</p>';
 try{
   const resp=await fetch('/api/consulta-ncm',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({ncm,modelo:document.getElementById('consultaNcmModelo').value,natureza:document.getElementById('consultaNcmNatureza').value})});
   const d=await resp.json();
   alvo.innerHTML=resp.ok?resultadoConsultaNcmHtml(d):'<div class="aviso-regra">'+esc(d.erro||'Não foi possível consultar o NCM.')+'</div>';
 }catch(erro){
   alvo.innerHTML='<div class="aviso-regra">Não foi possível consultar o NCM.</div>';
 }finally{
   botao.disabled=false;
 }
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
 baixarArquivo(nome,'\\ufeff'+conteudo,'text/csv;charset=utf-8');
}
function baixarArquivo(nome,conteudo,tipo){
 const a=document.createElement('a');
 const url=URL.createObjectURL(new Blob([conteudo],{type:tipo}));
 a.href=url;
 a.download=nome;
 document.body.appendChild(a);
 a.click();
 a.remove();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
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
 // Uma linha por pendência exibida (mesma lista e mesma chave dos cards: pendentesFiltradas, um card por cProd);
 // as regras candidatas do card ficam na mesma linha, numeradas na ordem em que aparecem na tela.
 const reducaoPrev=g=>{const o=g.reducao;return !o||o.evidencia==='nao_determinada'||o.valor==null?'':textoReducao(o.valor);};
 const evidencia=g=>{const o=g.reducao;return !o?'indisponível':o.evidencia==='nao_determinada'||o.valor==null?'não determinada':statusEvidenciaReducao(o).texto;};
 const juntar=(regras,f)=>regras.length>1?regras.map((g,i)=>(i+1)+') '+(f(g)??'')).join(' | '):(regras[0]?(f(regras[0])??''):'');
 baixar('pendencias.csv',csv([['Produto','cProd','NCM','Base','Itens (vendas)','Quantidade de regras candidatas','Regra candidata','Descrição legal do benefício','CST IBS/CBS proposto','cClassTrib proposto','Anexo','Item','Redução prevista na regra','Status da evidência da redução','Resposta nesta análise','Pergunta']].concat(
  pendentesFiltradas.map(p=>{
   const regras=p.regrasDetalhe||(p.regras||[]).map(id=>({id}));
   return [p.produto,p.cProd,p.ncm,p.base,p.itens,regras.length,
    juntar(regras,g=>g.id),
    juntar(regras,g=>g.descricaoLegal!=null?g.descricaoLegal:(g.descricoesLegaisDivergentes||[]).join(' / ')),
    juntar(regras,g=>g.cst),juntar(regras,g=>g.cClassTrib),juntar(regras,g=>g.anexo),juntar(regras,g=>g.item),
    juntar(regras,reducaoPrev),juntar(regras,evidencia),
    juntar(regras,g=>(p.respostasDestaAnalise||[]).filter(x=>x.regraId===g.id).map(x=>x.resposta).join(', ')),
    'Com base na descrição legal acima, o produto atende aos requisitos para este enquadramento?'];
  }))));
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
</html>`;
}
