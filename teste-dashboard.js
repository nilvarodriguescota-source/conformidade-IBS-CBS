
Chart.register(ChartDataLabels);
let resultados=[];
let pendentes=[];
let respostas=[];
let alertasUI={disponivel:false,porItemHtml:{},porCartaoHtml:{},painelHtml:''};
let pendentesFiltradas=[];
let resultadosFiltrados=[];
let regrasUI={};
const ROTULO_ESTADO={CORRETO:'CORRETO',INCORRETO_ECONOMIA:'INCORRETO â€” economia',INCORRETO_RISCO:'INCORRETO â€” risco',REQUER_VALIDACAO:'PRECISA VALIDAR',NAO_OBRIGATORIO:'NÃƒO OBRIGATÃ“RIO',INDETERMINADO:'INDETERMINADO'};

function abrirTela(id,botao){
 document.querySelectorAll('.tela').forEach(x=>x.classList.remove('active'));
 document.getElementById(id).classList.add('active');
 document.querySelectorAll('nav button').forEach(x=>x.classList.remove('active'));
 botao.classList.add('active');
 if(id==='importar') carregarAnalise();
 if(id==='dashboard'){ carregarDashboard(); carregarAlertas(); }
 if(id==='resultados') carregarResultados();
 if(id==='pendentes') carregarPendentes();
}

async function carregarAnalise(){
 try{
   const d=await (await fetch('/api/analise')).json();
   let texto;
   if(!d.processados&&!d.aguardando) texto='AnÃ¡lise vazia. Adicione XMLs para comeÃ§ar.';
   else if(d.aguardando&&!d.processada) texto=d.aguardando+' XML(s) carregado(s) â€” aguardando processamento.';
   else if(d.aguardando) texto=d.aguardando+' novo(s) XML(s) carregado(s) â€” aguardando processamento. Os resultados atuais consideram '+d.processados+' XML(s) jÃ¡ processado(s).';
   else if(d.processada) texto='Processamento concluÃ­do. '+d.respostas+' resposta(s) registrada(s) nesta anÃ¡lise.';
   else texto='A anÃ¡lise ainda nÃ£o tem resultado. Clique em "Processar anÃ¡lise".';
   document.getElementById('resumoAnalise').textContent=texto;
   document.getElementById('btnProcessar').disabled=!(d.processados||d.aguardando);
   const aviso=d.aguardando
     ?d.aguardando+' XML(s) carregado(s) aguardando processamento: '+(d.processada?'os dados abaixo ainda nÃ£o os incluem.':'ainda nÃ£o hÃ¡ resultados.')+' Use "Processar anÃ¡lise" na tela AnÃ¡lise.'
     :'';
   ['avisoDashboard','avisoResultados','avisoPendencias'].forEach(id=>{const el=document.getElementById(id);el.textContent=aviso;el.hidden=!aviso;});
   document.getElementById('resumoProcessamento').innerHTML=d.processada?renderResumo(d):'';
 }catch(e){
   document.getElementById('resumoAnalise').textContent='NÃ£o foi possÃ­vel carregar a anÃ¡lise atual.';
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
 if(r.naoObrigatorio) cards.push(['NÃ£o obrigatÃ³rios',r.naoObrigatorio]);
 if(r.indeterminado) cards.push(['Indeterminados',r.indeterminado]);
 return '<div class="grid">'+htmlCards(cards)+'</div>'+
  '<h3>Demais indicadores</h3><div class="grid">'+htmlCards(cardsIndicadores(d.indicadores||{}).slice(3))+'</div>';
}

async function processarAnalise(){
 const botao=document.getElementById('btnProcessar');
 const status=document.getElementById('status');
 botao.disabled=true;
 status.textContent='Processando a anÃ¡lise...';
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
   status.textContent=dados.adicionados+' XML(s) adicionado(s) Ã  anÃ¡lise atual, ainda nÃ£o processado(s).';
   input.value='';
   await carregarAnalise();
 }catch(erro){
   status.textContent='Erro: '+erro.message;
 }
 botao.disabled=false;
}

async function iniciarNovaAnalise(){
 if(!confirm('Iniciar uma nova anÃ¡lise? XMLs, resultados, pendÃªncias e respostas da anÃ¡lise atual serÃ£o apagados.')) return;
 const status=document.getElementById('status');
 try{
   const r=await fetch('/api/nova-analise',{method:'POST'});
   const d=await r.json();
   if(!r.ok) throw new Error(d.erro||'Erro ao iniciar nova anÃ¡lise.');
   status.textContent='Nova anÃ¡lise iniciada. Adicione os XMLs.';
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
      situacao.innerHTML=
        '<div style="font-size:28px;font-weight:700">'+
        formatarPercentual(conformidade)+
        '</div>'+
        '<p>dos itens avaliados estão em conformidade.</p>';
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
      const linhas=vereditos.map(function(v){
        return '<tr>'+
          '<td>'+esc(v.ncm||'-')+'</td>'+
          '<td>'+esc(v.produto||'-')+'</td>'+
          '<td>'+esc(v.estado||'-')+'</td>'+
          '<td>'+formatarNumero(v.baseCalculo||v.base||0)+'</td>'+
        '</tr>';
      }).join('');

      tabelaNcm.innerHTML=
        '<table class="tabela">'+
        '<thead><tr>'+
        '<th>NCM</th>'+
        '<th>Produto</th>'+
        '<th>Situação</th>'+
        '<th>Base</th>'+
        '</tr></thead>'+
        '<tbody>'+linhas+'</tbody>'+
        '</table>';
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
    ['CÃ³digos Ãºnicos avaliados',i.codigosAvaliados??0],
    ['CÃ³digos corretos',i.codigosCorretos??0],
    ['CÃ³digos incorretos',i.codigosIncorretos??0],
    ['CÃ³digos pendentes',i.codigosPendentes??0],
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

/** Resposta desta anÃ¡lise para o item (mesma regra de associaÃ§Ã£o do motor: NCM + cProd ou descriÃ§Ã£o). */
function validacaoDoItem(v){
 const rs=respostas.filter(x=>x.ncm===v.ncm&&(x.cProd===v.cProd||x.cProd===v.produto));
 if(rs.length) return rs.map(x=>x.resposta==='NAO'?'NÃƒO':'SIM').join(', ')+' (nesta anÃ¡lise)';
 if(v.estado==='REQUER_VALIDACAO') return 'Pendente';
 return 'â€”';
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
 document.getElementById('contagemResultados').textContent=resultadosFiltrados.length+' item(ns)';

 document.getElementById('listaResultados').innerHTML=resultadosFiltrados.map(cartaoResultado).join('')||'<p>Nenhum resultado encontrado.</p>';
}

/** DescriÃ§Ã£o da regra (rÃ³tulo, anexo, item), sÃ³ para exibiÃ§Ã£o; vem da base normativa. */
function nomeRegra(id,ncm){
 const g=regrasUI[id+'|'+ncm];
 return g?textoRegra(Object.assign({id},g)):id;
}

function beneficioDoItem(v){
 if(v.regraAplicada) return 'Aplicado: '+nomeRegra(v.regraAplicada,v.ncm);
 const cand=v.regrasCandidatas||[];
 if(!cand.length) return (v.regrasBloqueadas||[]).length?'Nenhuma regra de benefÃ­cio aplicÃ¡vel: regra do NCM bloqueada por incompatibilidade oficial':'Nenhum benefÃ­cio cadastrado para este NCM';
 const nomes=cand.map(id=>nomeRegra(id,v.ncm)).join('; ');
 if(v.estado==='REQUER_VALIDACAO') return 'Enquadramento possÃ­vel (depende de validaÃ§Ã£o): '+nomes;
 return 'Enquadramento possÃ­vel, nÃ£o aplicado: '+nomes;
}

function pct(x){ return (Math.round(x*10000)/100).toLocaleString('pt-BR',{maximumFractionDigits:2})+'%'; }
function textoReducao(r){ return pct(r)+(r===1?' (alÃ­quota zero)':''); }
function textoResultante(r){ return pct(1-r)+' da alÃ­quota padrÃ£o'; }

/**
 * ReduÃ§Ã£o do item: vem pronta em v.reducaoExibicao (/api/resultados), resolvida pelo explicador a partir da
 * regra efetivamente identificada. A tela nÃ£o busca reduÃ§Ã£o por regraId.
 */
function linhaRed(rotulo,valor){ return '<div><span class="rotulo">'+rotulo+'</span><span class="valor">'+esc(valor)+'</span></div>'; }
function textoFato(f){
 const l=f.localizacao||{};
 const onde=l.dispositivo?'LC 214/2025, '+l.dispositivo:l.campo?'SVRS, '+l.campo+(l.cClassTrib?' ('+l.cClassTrib+')':''):'';
 const conteudo=f.trecho!=null?f.trecho:f.valor!=null?String(f.valor):'';
 return f.fonte+(onde?' â€” '+onde:'')+(conteudo?': '+conteudo:'');
}
function listaFatos(fatos){
 if(!fatos||!fatos.length) return '';
 return '<ul class="fatos">'+fatos.map(f=>'<li>'+esc(textoFato(f))+'</li>').join('')+'</ul>';
}

/** Bloco de uma regra; sufixo "(se o enquadramento for confirmado)" quando a regra ainda nÃ£o foi escolhida. */
function blocoOpcaoReducao(o,prevista,coerencia,v,varias){
 const suf=prevista?' (se o enquadramento for confirmado)':'';
 const cab=varias?'<div class="small"><strong>'+esc(nomeRegra(o.regraId,v.ncm))+'</strong></div>':'';
 if(o.evidencia==='nao_determinada'||o.valor==null){
   return '<div class="reducao nao-determinada">'+cab+
    '<div><span class="rotulo">ReduÃ§Ã£o da alÃ­quota IBS/CBS'+suf+'</span>NÃ£o exibida: a regra nÃ£o pÃ´de ser identificada com seguranÃ§a.</div>'+
    '<div class="small">'+esc(o.motivo||'')+'</div></div>';
 }
 if(coerencia===false){
   return '<div class="reducao nao-determinada">'+cab+
    '<div><span class="rotulo">ReduÃ§Ã£o da alÃ­quota IBS/CBS</span>NÃ£o confirmada para este item: a economia calculada pelo motor nÃ£o corresponde ao percentual da regra '+esc(o.regraId)+'.</div></div>';
 }
 const origem='Base normativa â€” regra '+o.regraId+(o.linhaPlanilha!=null?' (planilha Base de dados, linha '+o.linhaPlanilha+')':'');
 let corpo=linhaRed('ReduÃ§Ã£o da alÃ­quota IBS/CBS'+suf,textoReducao(o.valor))+
  linhaRed('AlÃ­quota resultante'+suf,textoResultante(o.valor))+
  '<div class="small">Origem: '+esc(origem)+'</div>';
 if(o.evidencia==='oficial_confirmada'){
   corpo+='<div><span class="rotulo">EvidÃªncia da reduÃ§Ã£o</span><span class="valor">confirmada</span></div>'+
    '<div class="small">Fontes oficiais:</div>'+listaFatos(o.fatos);
   return '<div class="reducao">'+cab+corpo+'</div>';
 }
 if(o.evidencia==='oficial_divergente'){
   corpo+='<div><span class="rotulo">EvidÃªncia da reduÃ§Ã£o</span><span class="valor">divergente das fontes oficiais</span></div>'+
    '<div class="small">'+esc(o.motivo||'')+'</div>'+listaFatos(o.fatos);
   return '<div class="reducao sem-evidencia">'+cab+corpo+'</div>';
 }
 // sem_evidencia_oficial
 const foraEscopo=(o.motivo||'').indexOf('fora do escopo auditado')>=0;
 const aud=(v.auditoriaExibicao||{})[o.regraId];
 corpo+='<div><span class="rotulo">EvidÃªncia da reduÃ§Ã£o (vÃ­nculo registrado)</span><span class="valor">nÃ£o conferida</span></div>'+
  '<div class="small">'+esc(foraEscopo?(aud?'CÃ³digo fora do escopo do vÃ­nculo formal registrado (Etapa 5: 200033 e 200043)':'CÃ³digo fora do escopo auditado'):(o.motivo||''))+'</div>'+
  (reducaoConfereNaAuditoria(aud)?'':'<div class="aviso-d3">Percentual e valores calculados com base em dado nÃ£o confirmado oficialmente.</div>')+
  linhasAuditoriaReducao(aud);
 return '<div class="reducao sem-evidencia">'+cab+corpo+'</div>';
}

function blocoReducao(v){
 const r=v.reducaoExibicao;
 if(!r){
   if(v.reducaoIndisponivel&&(v.regraAplicada||(v.regrasCandidatas||[]).length)) return '<div class="small">ReduÃ§Ã£o indisponÃ­vel: '+esc(v.reducaoIndisponivel)+'.</div>';
   return '';
 }
 if(r.situacao==='regime_especifico'&&r.regimeEspecifico){
   const g=r.regimeEspecifico;
   return '<div class="reducao regime">'+linhaRed('ReduÃ§Ã£o da alÃ­quota IBS/CBS',textoReducao(g.valor))+
    linhaRed('AlÃ­quota resultante',textoResultante(g.valor))+
    '<div class="small">Origem: Regime especÃ­fico do motor ('+esc(g.fundamento)+')</div></div>';
 }
 const prevista=r.situacao==='prevista';
 if(!r.opcoes.length) return '';
 return r.opcoes.map(o=>blocoOpcaoReducao(o,prevista,r.coerenciaEconomia,v,r.opcoes.length>1)).join('');
}

/** CORRETO com benefÃ­cio: o motor calcula este valor sem a reduÃ§Ã£o, entÃ£o nÃ£o Ã© chamado de "valor correto". */
function rotuloValorCorreto(v){
 return v.estado==='CORRETO'&&v.regraAplicada?'Valor calculado pelo motor (sem reduÃ§Ã£o)':'Valor correto segundo a regra';
}

/* ---------- ConferÃªncia com as fontes oficiais (data/auditoria-oficial.json, via explicador). SÃ³ exibiÃ§Ã£o. ---------- */
const ROTULO_AUDITORIA={
 CONFIRMADA:'Regra conferida com a fonte oficial',
 DIVERGENTE:'Regra diverge da fonte oficial',
 NAO_LOCALIZADA:'Regra nÃ£o localizada nas fontes oficiais',
 NAO_DETERMINADA:'ConferÃªncia com a fonte oficial nÃ£o determinada'
};
const ROTULO_SVRS={PERMITIDO:'PERMITIDO',VEDADO:'VEDADO',PERMITIDO_E_VEDADO:'PERMITIDO e VEDADO',AUSENTE:'nÃ£o listado para o cÃ³digo'};
function curto(sha){ return String(sha||'').slice(0,12)+'â€¦'; }

/** Alertas da regra frente Ã s fontes; nada Ã© bloqueado nesta fase. */
function alertasDaAuditoria(a){
 const ved=(a.fatosF2||[]).filter(f=>f.TipoPermissao==='VEDADO');
 const al=[];
 if(a.situacaoNcmSvrs==='VEDADO'||a.excluidoDoItemDaRegra){
   al.push('A fonte oficial exclui este NCM deste enquadramento'+
    (ved.length?' â€” SVRS: VEDADO'+(ved[0].DescExcecao?' (exceÃ§Ã£o: '+ved[0].DescExcecao+')':''):'')+
    (a.excluidoDoItemDaRegra?' â€” Lei: o item '+a.itemDaBase+' exclui expressamente este NCM':'')+
    '. Nesta fase o sistema ainda permite a validaÃ§Ã£o; o bloqueio automÃ¡tico estÃ¡ reservado para a Fase 2.');
 }
 if(a.situacaoNcmSvrs==='PERMITIDO_E_VEDADO') al.push('O SVRS lista este NCM como PERMITIDO e tambÃ©m como VEDADO para o cÃ³digo; confira as duas entradas.');
 if(a.motivos.some(m=>m.indexOf('NCM sÃ³ na lei')===0)) al.push('As fontes oficiais divergem: a lei (fonte jurÃ­dica primÃ¡ria) cobre este NCM, mas o SVRS (fonte operacional) nÃ£o o lista para o cÃ³digo. Nenhuma das fontes foi escolhida automaticamente.');
 if(a.motivos.some(m=>m.indexOf('NCM sÃ³ no SVRS')===0)) al.push('As fontes oficiais divergem: o SVRS (fonte operacional) lista este NCM, mas nenhum item da lei (fonte jurÃ­dica primÃ¡ria) o cobre'+(a.excecaoNaLeiEmItens.length?'; a lei o exclui no item '+a.excecaoNaLeiEmItens.join(', '):'')+'. Nenhuma das fontes foi escolhida automaticamente.');
 if(a.itensOficiais.length>1) al.push('O NCM aparece em '+a.itensOficiais.length+' itens da lei ('+a.itensOficiais.join(', ')+'); o item depende do produto.');
 if(a.itensOficiais.length&&!a.itemDaRegraEntreOsOficiais) al.push('O item da base ('+(a.itemDaBase||'vazio')+') nÃ£o estÃ¡ entre os itens da lei que cobrem o NCM ('+a.itensOficiais.join(', ')+').');
 return al;
}

function blocoAuditoria(a){
 if(!a) return '<div class="bloco aud aud-indisponivel"><span class="rotulo">ConferÃªncia com a fonte oficial</span><div class="small">Sem conferÃªncia disponÃ­vel para esta regra (auditoria ausente, desatualizada ou regra nÃ£o identificada com seguranÃ§a).</div></div>';
 const lei=(a.fatosF1||[]).filter(f=>f.papel==='cobre o NCM');
 const exclui=(a.fatosF1||[]).filter(f=>f.papel==='exclui o NCM');
 const svrs=a.fatosF2||[];
 const c=a.codigo||{};
 const item='Item da base: '+(a.itemDaBase||'vazio')+
  (a.itemOficial!=null?' Â· Item oficial: '+a.itemOficial:a.itensOficiais.length>1?' Â· Itens oficiais possÃ­veis: '+a.itensOficiais.join(', '):' Â· Item oficial: nÃ£o identificado');
 const svrsTxt='SituaÃ§Ã£o do NCM no SVRS: '+(ROTULO_SVRS[a.situacaoNcmSvrs]||a.situacaoNcmSvrs)+
  (svrs.length?' â€” '+[...new Set(svrs.map(f=>(f.TipoPermissao!==a.situacaoNcmSvrs?f.TipoPermissao+': ':'')+f.DescItemAnexo+(f.DescExcecao?' (exceÃ§Ã£o: '+f.DescExcecao+')':'')))].join(' | '):'');
 const codigoTxt=c.F2?'CÃ³digo no SVRS: CST '+c.F2.cst+' Â· cClassTrib '+(a.cClassTrib||'')+' Â· Anexo '+c.F2.nroAnexo+' Â· reduÃ§Ã£o '+c.F2.percRedIbs+'% IBS / '+c.F2.percRedCbs+'% CBS':'';
 const fund=c.F1&&c.F1.dispositivo?'Fundamento na lei: '+c.F1.dispositivo+' (fundamento na base: '+(c.comparacao?c.comparacao.fundamento:'â€”')+')':'';
 const fontes=a.fontes?'Fontes: <a href="'+esc(a.fontes.F1.url+(c.F1&&c.F1.ancora?'#'+c.F1.ancora:''))+'" target="_blank" rel="noopener">LC 214/2025 (Planalto)</a> â€” texto legal, snapshot '+esc(curto(a.fontes.F1.sha256))+
  ' Â· <a href="'+esc(a.fontes.F2.url)+'" target="_blank" rel="noopener">SVRS â€” ClassificaÃ§Ã£o TributÃ¡ria</a> â€” tabela de apoio, snapshot '+esc(curto(a.fontes.F2.sha256)):'';
 const alertas=alertasDaAuditoria(a);
 return '<div class="bloco aud aud-'+esc(a.status)+'">'+
  '<span class="rotulo">ConferÃªncia com a fonte oficial</span>'+
  '<div class="aud-status">'+esc(ROTULO_AUDITORIA[a.status]||a.status)+'</div>'+
  alertas.map(t=>'<div class="aviso-regra">'+esc(t)+'</div>').join('')+
  (lei.length?'<div class="small"><strong>'+esc(lei[0].dispositivo)+':</strong> â€œ'+esc(lei[0].trecho)+'â€</div>':exclui.length?'':'<div class="small">Nenhum item da lei cobre este NCM.</div>')+
  exclui.map(f=>'<div class="small"><strong>'+esc(f.dispositivo)+' (exclui o NCM):</strong> â€œ'+esc(f.trecho)+'â€</div>').join('')+
  '<div class="small">'+esc(svrsTxt)+'</div>'+
  '<div class="small">'+esc(item)+'</div>'+
  (codigoTxt?'<div class="small">'+esc(codigoTxt)+'</div>':'')+
  (fund?'<div class="small">'+esc(fund)+'</div>':'')+
  (a.status!=='CONFIRMADA'&&a.motivos.length?'<details class="nao-imprimir"><summary>Motivos da conferÃªncia</summary><ul class="fatos">'+a.motivos.map(m=>'<li>'+esc(m)+'</li>').join('')+'</ul></details>':'')+
  (lei.length>1?'<details class="nao-imprimir"><summary>Todos os itens da lei que cobrem o NCM</summary><ul class="fatos">'+lei.map(f=>'<li>'+esc(f.dispositivo+': '+f.trecho)+'</li>').join('')+'</ul></details>':'')+
  (fontes?'<div class="small">'+fontes+'</div>':'')+
  '<div class="small aud-nota">A conferÃªncia Ã© da regra. Se o produto atende Ã  descriÃ§Ã£o legal continua sendo decisÃ£o humana.</div>'+
 '</div>';
}

/** Linhas sobre a reduÃ§Ã£o sem vÃ­nculo formal: resultado da auditoria do cÃ³digo e D3 (definiÃ§Ã£o aprovada). */
function linhasAuditoriaReducao(a){
 if(!a) return '<div class="small">D3: polÃ­tica pendente</div>';
 const c=a.codigo||{};
 let h='';
 if(c.comparacao&&c.comparacao.reducao==='concorda'&&c.F2) h+='<div class="small aud-red">Auditoria oficial: o percentual confere com '+esc(c.F1&&c.F1.dispositivo||'a lei')+' e com o SVRS ('+esc(c.F2.percRedIbs)+'% IBS / '+esc(c.F2.percRedCbs)+'% CBS). VÃ­nculo formal ainda nÃ£o registrado (Fase 3).</div>';
 else if(c.comparacao) h+='<div class="aviso-regra">Auditoria oficial: o percentual da base nÃ£o confere com as fontes (reduÃ§Ã£o: '+esc(c.comparacao.reducao)+').</div>';
 h+=a.status==='CONFIRMADA'
  ?'<div class="small">D3: nÃ£o se aplica â€” vÃ­nculo NCM Ã— item conferido na auditoria oficial.</div>'
  :'<div class="small">D3: polÃ­tica pendente (vÃ­nculo NCM Ã— item nÃ£o CONFIRMADO).</div>';
 return h;
}

/**
 * Motivo exibido. O motor grava "BenefÃ­cio confirmado na validaÃ§Ã£o" quando hÃ¡ resposta SIM; na tela isso Ã© a
 * validaÃ§Ã£o humana do enquadramento, que Ã© diferente da conferÃªncia oficial da regra. O texto gravado nÃ£o muda.
 */
const PREFIXO_SIM='BenefÃ­cio confirmado na validaÃ§Ã£o: ', PREFIXO_VARIOS='Mais de um benefÃ­cio confirmado para o mesmo item: ';
function reformularMotivo(m){
 m=m||'';
 if(m.indexOf(PREFIXO_SIM)===0) return 'Enquadramento confirmado na validaÃ§Ã£o humana: '+m.slice(PREFIXO_SIM.length);
 if(m.indexOf(PREFIXO_VARIOS)===0) return 'Mais de um enquadramento confirmado na validaÃ§Ã£o humana para o mesmo item: '+m.slice(PREFIXO_VARIOS.length);
 return m;
}
function textoMotivo(v){
 const m=v.motivo||'-';
 if(m.indexOf(PREFIXO_SIM)!==0) return reformularMotivo(m);
 const a=v.regraAplicada&&(v.auditoriaExibicao||{})[v.regraAplicada];
 const lei=a&&(a.fatosF1||[]).find(f=>f.papel==='cobre o NCM');
 const oficial=!a?' NÃ£o hÃ¡ conferÃªncia da regra com a fonte oficial disponÃ­vel.'
  :a.status==='CONFIRMADA'?' A regra foi conferida com a fonte oficial'+(lei?' ('+lei.dispositivo+')':'')+'.'
  :' A regra nÃ£o estÃ¡ conferida com a fonte oficial ('+(ROTULO_AUDITORIA[a.status]||a.status)+').';
 return reformularMotivo(m)+' A aplicaÃ§Ã£o ao caso concreto foi confirmada pela validaÃ§Ã£o humana (resposta SIM).'+oficial;
}

/* ---------- Fase 2: regra bloqueada por incompatibilidade oficial (sÃ³ exibiÃ§Ã£o; sem SIM/NÃƒO) ---------- */
function blocoBloqueio(b){
 if(!b) return '';
 const lei=(b.fatosF1||[]);
 const svrs=(b.fatosF2||[]);
 return '<div class="bloco bloqueio">'+
  '<div class="bloq-titulo">BLOQUEADA â€” incompatibilidade oficial</div>'+
  '<div>Esta regra nÃ£o pode ser selecionada porque o NCM nÃ£o Ã© compatÃ­vel com este enquadramento segundo a fonte oficial.</div>'+
  '<div class="small">Regra '+esc(b.regraId)+' Â· NCM '+esc(b.ncm)+' Â· cClassTrib '+esc(b.cClassTrib)+' Â· item da base '+esc(b.item||'vazio')+'</div>'+
  '<div class="small">Motivo do bloqueio: '+esc(b.motivo)+'</div>'+
  lei.map(f=>'<div class="small"><strong>'+esc(f.dispositivo)+(f.papel==='exclui o NCM'?' (exclui o NCM)':'')+':</strong> â€œ'+esc(f.trecho)+'â€</div>').join('')+
  (svrs.length?'<div class="small">SVRS: '+esc([...new Set(svrs.map(f=>f.TipoPermissao+' â€” '+f.DescItemAnexo+(f.DescExcecao?' (exceÃ§Ã£o: '+f.DescExcecao+')':'')))].join(' | '))+'</div>':'<div class="small">SVRS: NCM nÃ£o listado para este cÃ³digo.</div>')+
  (b.fontes?'<div class="small">Fontes: <a href="'+esc(b.fontes.F1.url)+'" target="_blank" rel="noopener">LC 214/2025 (Planalto)</a> â€” snapshot '+esc(curto(b.fontes.F1.sha256))+' Â· <a href="'+esc(b.fontes.F2.url)+'" target="_blank" rel="noopener">SVRS â€” ClassificaÃ§Ã£o TributÃ¡ria</a> â€” snapshot '+esc(curto(b.fontes.F2.sha256))+'</div>':'')+
  '<div class="small aud-nota">O bloqueio Ã© da regra para este NCM. Se o produto se enquadra em outra regra continua sendo avaliado pelas demais regras e pela validaÃ§Ã£o humana.</div>'+
 '</div>';
}
function blocosBloqueioDoItem(v){
 const bs=Object.values(v.bloqueiosExibicao||{});
 return bs.map(blocoBloqueio).join('');
}

/* ---------- Quadro da regra: dados do enquadramento e reduÃ§Ã£o da alÃ­quota em destaque (sÃ³ exibiÃ§Ã£o) ---------- */
function pctInteiro(n){ return Number(n).toLocaleString('pt-BR',{maximumFractionDigits:2})+'%'; }
function campoQuadro(rotulo,valor){ return '<div><span class="rotulo">'+rotulo+'</span><span class="valor">'+esc(valor==null||valor===''?'â€”':valor)+'</span></div>'; }
/**
 * d: { cst, cClassTrib, anexo, item, fundamento, reducao (ReducaoExplicada da regra), auditoria, humano: 'confirmado' | 'pendente' | null }
 * A reduÃ§Ã£o exibida Ã© a da regra (reducaoAliquota da base, a mesma do motor); IBS e CBS vÃªm do SVRS quando conferidos.
 */
function quadroRegra(d){
 const a=d.auditoria, o=d.reducao;
 const f2=a&&a.codigo&&a.codigo.F2;
 const item=a&&a.itemOficial!=null
  ?(a.itemOficial===d.item?d.item:(d.item||'vazio')+' (item oficial: '+a.itemOficial+')')
  :a&&a.itensOficiais&&a.itensOficiais.length>1?(d.item||'vazio')+' (itens oficiais possÃ­veis: '+a.itensOficiais.join(', ')+')':d.item;
 let red='';
 if(o&&o.valor!=null&&o.evidencia!=='nao_determinada'){
   const ibs=f2?f2.percRedIbs:null, cbs=f2?f2.percRedCbs:null;
   const iguais=ibs==null||cbs==null||ibs===cbs;
   red=(iguais?'<div class="red-destaque">ReduÃ§Ã£o da alÃ­quota: '+esc(pct(o.valor))+'</div>':'')+
    (ibs!=null&&cbs!=null?'<div class="'+(iguais?'red-partes':'red-destaque')+'">ReduÃ§Ã£o IBS: '+esc(pctInteiro(ibs))+(iguais?' Â· ':'</div><div class="red-destaque">')+'ReduÃ§Ã£o CBS: '+esc(pctInteiro(cbs))+'</div>':'')+
    '<div class="selo '+(o.evidencia==='oficial_confirmada'?'selo-oficial':'selo-aviso')+'">'+
     (o.evidencia==='oficial_confirmada'?'ReduÃ§Ã£o da alÃ­quota â€” confirmada oficialmente'
      :o.evidencia==='oficial_divergente'?'ReduÃ§Ã£o da alÃ­quota â€” divergente das fontes oficiais'
      :'ReduÃ§Ã£o da alÃ­quota â€” nÃ£o confirmada oficialmente (prevista na base normativa)')+'</div>';
 }else if(o){
   red='<div class="small">ReduÃ§Ã£o da alÃ­quota: nÃ£o exibida â€” a regra nÃ£o pÃ´de ser identificada com seguranÃ§a.</div>';
 }
 const regra=a?(a.status==='CONFIRMADA'?'Regra conferida com a fonte oficial':(ROTULO_AUDITORIA[a.status]||a.status)):'Sem conferÃªncia da regra com a fonte oficial';
 const humano=d.humano==='confirmado'?'<div class="selo selo-humano">Enquadramento confirmado na validaÃ§Ã£o humana (resposta SIM nesta anÃ¡lise)</div>'
  :d.humano==='pendente'?'<div class="selo selo-pendente">Enquadramento do produto: aguardando validaÃ§Ã£o humana</div>':'';
 return '<div class="bloco quadro-regra">'+
  '<span class="rotulo">'+esc(d.titulo||'Enquadramento da regra')+'</span>'+
  '<div class="quadro-campos">'+campoQuadro('CST',d.cst)+campoQuadro('cClassTrib',d.cClassTrib)+campoQuadro('Anexo',d.anexo)+campoQuadro('Item',item)+campoQuadro('Fundamento',d.fundamento)+'</div>'+
  red+
  '<div class="selo '+(a&&a.status==='CONFIRMADA'?'selo-oficial':'selo-aviso')+'">'+esc(regra)+'</div>'+
  humano+
  '<div class="small aud-nota">A conferÃªncia Ã© da regra. Se o produto atende Ã  descriÃ§Ã£o legal continua sendo decisÃ£o humana.</div>'+
 '</div>';
}
/** Resultados: quadro da regra aplicada (base de regra), ou da Ãºnica candidata pendente. */
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

/** Candidatas com tratamentos diferentes (ex.: 60% e alÃ­quota zero): a escolha muda o resultado fiscal. */
function alertaReducoesDiferentes(valores){
 const vs=[...new Set(valores.filter(x=>x!=null))];
 if(vs.length<2) return '';
 return '<div class="aviso-regra">As regras candidatas tÃªm tratamentos diferentes â€” '+esc(vs.map(textoReducao).join(' e '))+' â€”: a escolha muda o resultado fiscal. As descriÃ§Ãµes oficiais nÃ£o correspondem automaticamente ao produto â€” confira se o produto e o NCM informado no XML correspondem Ã  descriÃ§Ã£o legal antes de responder.</div>';
}
/** Lacuna de cobertura: previsÃ£o oficial para o NCM sem regra correspondente na base (nenhuma regra Ã© criada). */
function alertaLacunas(ls){
 if(!ls||!ls.length) return '';
 return '<div class="aviso-info">HÃ¡ previsÃ£o no SVRS para este NCM em '+esc([...new Set(ls.map(l=>l.cClassTrib))].join(', '))+' sem regra correspondente na base normativa (lacuna de cobertura; D5 pendente). Nenhuma regra foi criada.</div>';
}
/** Resultados: conferÃªncia da regra aplicada, ou resumo das candidatas. */
function blocoAuditoriaResultado(v){
 const au=v.auditoriaExibicao||{};
 const r=v.reducaoExibicao;
 let h='';
 if(v.regraAplicada&&au[v.regraAplicada]) h+=blocoAuditoria(au[v.regraAplicada]);
 else if(r&&r.situacao==='prevista'&&r.opcoes.length){
   h+='<div class="bloco aud"><span class="rotulo">ConferÃªncia das regras candidatas com a fonte oficial</span>'+
    r.opcoes.map(o=>{const a=au[o.regraId];return '<div class="small">'+esc(o.regraId)+' â€” '+esc(a?(ROTULO_AUDITORIA[a.status]||a.status):'sem conferÃªncia disponÃ­vel')+(a?alertasDaAuditoria(a).map(t=>'<div class="aviso-regra">'+esc(t)+'</div>').join(''):'')+'</div>';}).join('')+
    '<div class="small aud-nota">A conferÃªncia Ã© da regra. Se o produto atende Ã  descriÃ§Ã£o legal continua sendo decisÃ£o humana (tela PendÃªncias).</div></div>';
   h+=alertaReducoesDiferentes(r.opcoes.map(o=>o.valor));
 }
 h+=alertaLacunas(v.lacunasDeCobertura);
 return h;
}

function celulaEsperada(inf,esp,v){
 if(esp==null) return '<td class="indefinido">'+(v.estado==='REQUER_VALIDACAO'?'depende da validaÃ§Ã£o':'-')+'</td>';
 return '<td class="'+((inf||'')===esp?'igual':'difere')+'">'+esc(esp)+'</td>';
}

/**
 * Resultados em lista compacta: produto e situaÃ§Ã£o (Ã  direita) â†’ informado (base, atual) â†’ enquadramento (correto, economia) â†’ reduÃ§Ã£o. A auditoria (origem,
 * evidÃªncia, fontes, textos da lei e do SVRS, bloqueios completos, alertas) fica recolhida e sÃ³ Ã© montada ao abrir.
 * Os dados recebidos da API nÃ£o mudam.
 */
function chip(rotulo,valor,classe){ return '<span class="chip'+(classe?' '+classe:'')+'"><span class="chip-r">'+rotulo+'</span> '+esc(valor==null||valor===''?'â€”':valor)+'</span>'; }
function classeComparada(inf,esp,v){
 if(esp==null) return v.estado==='REQUER_VALIDACAO'?'chip-indef':'';
 return (inf||'')===esp?'chip-igual':'chip-difere';
}
/** Regra que o cartÃ£o resume: a aplicada, ou a Ãºnica candidata pendente. */
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
 if(r&&r.situacao==='prevista'&&r.opcoes.length>1) return '<span class="r-lbl">'+r.opcoes.length+' regras candidatas</span><span class="small">(escolha na tela PendÃªncias)</span>';
 const esp=v.esperado;
 return esp?'<span class="r-lbl">Esperado</span>'+chip('CST',esp.cst,classeComparada(inf.cst,esp.cst,v))+chip('cClassTrib',esp.cClassTrib,classeComparada(inf.cClassTrib,esp.cClassTrib,v)):'<span class="small">sem enquadramento esperado</span>';
}
function linhaReducao(v){
 const r=v.reducaoExibicao;
 if(!r) return '';
 if(r.situacao==='regime_especifico'&&r.regimeEspecifico) return '<span class="r-lbl">ReduÃ§Ã£o da alÃ­quota</span><b class="r-red">'+esc(pct(r.regimeEspecifico.valor))+'</b><span class="small">regime especÃ­fico do motor</span>';
 const rc=regraDoCartao(v);
 if(!rc){
   const vs=[...new Set(r.opcoes.filter(o=>o.valor!=null&&o.evidencia!=='nao_determinada').map(o=>o.valor))];
   if(!vs.length) return '';
   return '<span class="r-lbl">ReduÃ§Ãµes possÃ­veis</span><b class="r-red">'+esc(vs.map(pct).join(' Â· '))+'</b>'+(vs.length>1?'<span class="selo selo-aviso">tratamentos diferentes: a escolha muda o resultado</span>':'');
 }
 const o=rc.opcao, a=(v.auditoriaExibicao||{})[rc.id], f2=a&&a.codigo&&a.codigo.F2;
 if(!o||o.valor==null||o.evidencia==='nao_determinada') return '<span class="r-lbl">ReduÃ§Ã£o da alÃ­quota</span><span class="small">nÃ£o exibida (regra nÃ£o identificada com seguranÃ§a)</span>';
 if(v.estado==='INCORRETO_ECONOMIA'&&r.coerenciaEconomia===false) return '<span class="r-lbl">ReduÃ§Ã£o da alÃ­quota</span><span class="small">nÃ£o confirmada para este item (economia do motor nÃ£o confere com o percentual)</span>';
 const ibsCbs=f2?(f2.percRedIbs===f2.percRedCbs?' Â· IBS '+pctInteiro(f2.percRedIbs)+' Â· CBS '+pctInteiro(f2.percRedCbs):' Â· <b>IBS '+pctInteiro(f2.percRedIbs)+'</b> Â· <b>CBS '+pctInteiro(f2.percRedCbs)+'</b>'):'';
 const oficial=a&&a.status==='CONFIRMADA'&&o.evidencia==='oficial_confirmada'?'<span class="selo selo-oficial">âœ“ conferida com a fonte oficial</span>'
  :'<span class="selo selo-aviso">'+esc(a?(ROTULO_AUDITORIA[a.status]||a.status):'sem conferÃªncia oficial')+'</span>';
 const sim=rc.situacao==='aplicada'&&(respostas||[]).some(x=>x.resposta==='SIM'&&x.regraId===rc.id&&x.ncm===v.ncm&&(x.cProd===v.cProd||x.cProd===v.produto));
 const humano=sim?'<span class="selo selo-humano r-humano">âœ“ enquadramento confirmado na validaÃ§Ã£o humana</span>':rc.situacao==='prevista'?'<span class="selo selo-pendente r-humano">aguardando validaÃ§Ã£o humana</span>':'';
 return '<span class="r-lbl">ReduÃ§Ã£o da alÃ­quota</span><b class="r-red">'+esc(pct(o.valor))+'</b>'+ibsCbs+oficial+humano;
}
function valoresInformados(v){
 const vv=x=>x==null?'â€”':formatarNumero(x);
 return '<span><span class="r-lbl">Base</span>'+formatarNumero(v.baseCalculo||0)+'</span>'+'<span><span class="r-lbl">Atual</span>'+vv(v.valorInformadoTotal)+'</span>';
}
function valoresEnquadramento(v){
 const vv=x=>x==null?'â€”':formatarNumero(x);
 const partes=['<span><span class="r-lbl">'+(v.estado==='CORRETO'&&v.regraAplicada?'Calculado (sem reduÃ§Ã£o)':'Correto')+'</span>'+vv(v.valorCorreto)+'</span>'];
 if(v.economiaPotencial!=null) partes.push('<span class="'+(v.economiaPotencial>0?'r-economia':'')+'"><span class="r-lbl">Economia</span>'+formatarNumero(v.economiaPotencial)+'</span>');
 if(v.exposicao!=null) partes.push('<span class="r-exposicao"><span class="r-lbl">ExposiÃ§Ã£o</span>'+formatarNumero(v.exposicao)+'</span>');
 return partes.join('');
}
function avisosCompactos(v){
 const av=[];
 const bl=Object.values(v.bloqueiosExibicao||{});
 if(bl.length) av.push('<span class="selo selo-bloqueio">BLOQUEADA â€” incompatibilidade oficial: '+esc(bl.map(b=>b.regraId).join(', '))+'</span>');
 if((v.lacunasDeCobertura||[]).length) av.push('<span class="selo selo-info">previsÃ£o oficial sem regra na base ('+esc([...new Set(v.lacunasDeCobertura.map(l=>l.cClassTrib))].join(', '))+'; D5)</span>');
 if(v.reducaoIndisponivel&&(v.regraAplicada||(v.regrasCandidatas||[]).length)) av.push('<span class="small">ReduÃ§Ã£o indisponÃ­vel: '+esc(v.reducaoIndisponivel)+'</span>');
 return av.length?'<div class="r-linha">'+av.join('')+'</div>':'';
}
/** ConteÃºdo da auditoria do item, montado sÃ³ quando o usuÃ¡rio abre "Auditoria e fontes". */
function auditoriaDetalhadaResultado(v){
 return '<div class="small">Documento '+esc(v.documento)+' Â· item '+esc(v.nItem)+' Â· regra aplicada: '+esc(v.regraAplicada||'nenhuma')+'</div>'+
  '<div class="small">BenefÃ­cio / enquadramento: '+esc(beneficioDoItem(v))+'</div>'+
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
   '<div class="r-cab-dir"><span class="small">ValidaÃ§Ã£o: '+esc(validacaoDoItem(v))+'</span><span class="status status-selo '+esc(v.estado)+'" title="'+esc(v.estado)+'">'+esc(ROTULO_ESTADO[v.estado]||v.estado)+'</span></div>'+
  '</div>'+
  '<div class="r-par r-inf"><div class="r-esq">'+linhaInformado(v)+'</div><div class="r-dir">'+valoresInformados(v)+'</div></div>'+
  '<div class="r-par r-enq"><div class="r-esq"><span class="r-seta">â†³</span>'+linhaEnquadramento(v)+'</div><div class="r-dir">'+valoresEnquadramento(v)+'</div></div>'+
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

/** Status da evidÃªncia da reduÃ§Ã£o, a partir da estrutura do explicador (sem outra lÃ³gica). */
function statusEvidenciaReducao(o){
 if(o.evidencia==='oficial_confirmada') return {texto:'Confirmada oficialmente para este cClassTrib',fatos:o.fatos,extra:''};
 if(o.evidencia==='oficial_divergente') return {texto:'Divergente das fontes oficiais para este cClassTrib',fatos:o.fatos,extra:o.motivo||''};
 return {texto:'NÃ£o confirmada oficialmente para este cClassTrib (benefÃ­cio previsto na base normativa)',fatos:[],extra:''};
}

/** Bloco da reduÃ§Ã£o prevista na regra candidata. Nada Ã© recalculado: o valor vem de regrasDetalhe[].reducao. */
function blocoReducaoPrevista(g,p){
 const o=g.reducao;
 if(!o){
   return '<div class="bloco"><span class="rotulo">ReduÃ§Ã£o da alÃ­quota IBS/CBS prevista na regra</span>'+
    '<div class="small">ReduÃ§Ã£o indisponÃ­vel'+(p.reducaoIndisponivel?': '+esc(p.reducaoIndisponivel):'')+'.</div></div>';
 }
 if(o.evidencia==='nao_determinada'||o.valor==null){
   return '<div class="bloco reducao-prev nao-determinada"><span class="rotulo">ReduÃ§Ã£o da alÃ­quota IBS/CBS prevista na regra</span>'+
    '<div>NÃ£o exibida: a regra nÃ£o pÃ´de ser identificada com seguranÃ§a.</div><div class="small">'+esc(o.motivo||'')+'</div></div>';
 }
 const st=statusEvidenciaReducao(o);
 return '<div class="bloco reducao-prev'+(o.evidencia==='oficial_confirmada'?'':' sem-evidencia')+'">'+
  '<span class="rotulo">ReduÃ§Ã£o da alÃ­quota IBS/CBS prevista na regra</span>'+
  '<div class="valor-grande">'+esc(textoReducao(o.valor))+'</div>'+
  '<div class="small">AlÃ­quota resultante prevista: '+esc(textoResultante(o.valor))+'</div>'+
  '<div><span class="rotulo">Status da evidÃªncia da reduÃ§Ã£o</span>'+esc(st.texto)+'</div>'+
  (st.extra?'<div class="small">'+esc(st.extra)+'</div>':'')+
  (st.fatos.length?'<div class="small">Fontes oficiais:</div>'+listaFatos(st.fatos):'')+
  (o.evidencia==='sem_evidencia_oficial'?linhasAuditoriaReducao(g.auditoria):'')+
 '</div>';
}

function campoProposto(rotulo,valor){
 return '<div><span class="rotulo">'+rotulo+'</span><span class="valor">'+esc(valor==null?'nÃ£o disponÃ­vel na base':valor)+'</span></div>';
}

/** Uma regra candidata: descriÃ§Ã£o legal, enquadramento proposto, reduÃ§Ã£o prevista e a pergunta. */
function blocoRegraCandidata(g,p,i,total){
 const resp=(p.respostasDestaAnalise||[]).filter(x=>x.regraId===g.id);
 const descricao=g.descricaoLegal!=null
  ?'<div class="descricao-legal">'+esc(g.descricaoLegal)+'</div>'
  :(g.descricoesLegaisDivergentes&&g.descricoesLegaisDivergentes.length
    ?'<div class="small">A base tem '+esc(g.regrasComEsteIdentificador)+' regras com este identificador, com descriÃ§Ãµes legais diferentes:</div><ul class="descricoes">'+g.descricoesLegaisDivergentes.map(d=>'<li>'+esc(d)+'</li>').join('')+'</ul>'
    :'<div class="small">DescriÃ§Ã£o legal nÃ£o disponÃ­vel na base para esta regra.</div>');
 const duplicado=g.identificadorRepetido
  ?'<div class="aviso-regra">AtenÃ§Ã£o: o identificador '+esc(g.id)+' corresponde a '+esc(g.regrasComEsteIdentificador)+' regras na base; a regra nÃ£o pÃ´de ser identificada com seguranÃ§a. Pelo comportamento atual do motor, um SIM confirma todas elas ao mesmo tempo e o item continua pendente (mais de um benefÃ­cio confirmado).</div>'
  :'';
 return '<div class="regra-cand">'+
  '<div class="small">Regra candidata'+(total>1?' '+(i+1)+' de '+total:'')+': '+esc(g.id)+' â€” aguardando validaÃ§Ã£o</div>'+
  duplicado+
  '<div class="bloco"><span class="rotulo">DescriÃ§Ã£o legal do benefÃ­cio</span>'+descricao+'</div>'+
  quadroRegra({cst:g.cst,cClassTrib:g.cClassTrib,anexo:g.anexo,item:g.item,fundamento:g.fundamentoLegal,reducao:g.reducao,auditoria:g.auditoria,humano:'pendente',titulo:'Enquadramento proposto'})+
  blocoAuditoria(g.auditoria)+
  blocoReducaoPrevista(g,p)+
  (resp.length?'<div class="small resposta-registrada">Resposta registrada nesta anÃ¡lise: '+esc(resp.map(x=>(x.resposta==='NAO'?'NÃƒO':'SIM')+' ('+x.data+')').join(', '))+'</div>':'')+
  '<div class="pergunta-validacao"><span class="rotulo">Pergunta</span>Com base na descriÃ§Ã£o legal acima, o produto atende aos requisitos para este enquadramento?</div>'+
  '<div class="acoes">'+
   '<button class="secondary" data-validar="SIM" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regra="'+esc(g.id)+'">SIM</button>'+
   '<button class="secondary" data-validar="NAO" data-ncm="'+esc(p.ncm)+'" data-cprod="'+esc(p.cProd)+'" data-regra="'+esc(g.id)+'">NÃƒO</button>'+
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
 document.getElementById('contagemPendencias').textContent=pendentesFiltradas.length+' pendÃªncia(s)';
 document.getElementById('listaPendentes').innerHTML=pendentesFiltradas.length
  ?pendentesFiltradas.map(p=>{
    const regras=p.regrasDetalhe||(p.regras||[]).map(id=>({id}));
    return '<div class="pendente">'+
     '<div class="pend-topo">'+
      '<div><span class="rotulo">ValidaÃ§Ã£o do benefÃ­cio</span>'+
       '<span class="rotulo">Produto</span><strong>'+esc(p.produto)+'</strong>'+
       '<div class="small">cProd '+esc(p.cProd)+' Â· '+p.itens+' item(ns) Â· base '+formatarNumero(p.base)+'</div></div>'+
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
  :'<p>Nenhuma pendÃªncia na anÃ¡lise atual.</p>';
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
   alertasUI=Object.assign(vazio,{painelHtml:'<h3>Alertas (somente exibiÃ§Ã£o)</h3><p class="small">Alertas indisponÃ­veis. Os resultados continuam vÃ¡lidos e nÃ£o dependem dos alertas.</p>'});
 }
 
 if(resultados.length) renderResultados();
 if(pendentes.length) renderPendentes();
}

function csv(linhas){
 return linhas.map(l=>l.map(c=>'"'+String(c??'').split('"').join('""')+'"').join(';')).join('\r\n');
}
function baixar(nome,conteudo){
 const a=document.createElement('a');
 a.href=URL.createObjectURL(new Blob(['\ufeff'+conteudo],{type:'text/csv;charset=utf-8'}));
 a.download=nome;
 a.click();
}
/** Colunas de reduÃ§Ã£o do CSV, com a mesma regra da tela (nada exibido quando nÃ£o determinada ou incoerente). */
function reducaoCsv(v,campo){
 const r=v.reducaoExibicao;
 if(!r) return '';
 if(r.situacao==='regime_especifico'&&r.regimeEspecifico){
   const g=r.regimeEspecifico;
   return campo==='reducao'?textoReducao(g.valor):campo==='resultante'?textoResultante(g.valor):campo==='evidencia'?'':'Regime especÃ­fico do motor ('+g.fundamento+')';
 }
 const suf=r.situacao==='prevista'?' (se o enquadramento for confirmado)':'';
 return r.opcoes.map(o=>{
   const exibe=o.evidencia!=='nao_determinada'&&o.valor!=null&&r.coerenciaEconomia!==false;
   if(campo==='evidencia') return o.regraId+': '+(!exibe?'nÃ£o determinada':o.evidencia==='oficial_confirmada'?'confirmada':o.evidencia==='oficial_divergente'?'divergente':'nÃ£o conferida (D3 pendente)');
   if(campo==='origem') return exibe?'Base normativa â€” regra '+o.regraId+(o.linhaPlanilha!=null?' (linha '+o.linhaPlanilha+')':''):'';
   if(!exibe) return '';
   return (campo==='reducao'?textoReducao(o.valor):textoResultante(o.valor))+suf;
 }).filter(x=>x).join(' | ');
}
function exportarResultados(){
 baixar('resultados.csv',csv([['Produto','cProd','NCM','Base','Resultado','ValidaÃ§Ã£o','CST informado','CST esperado','cClassTrib informado','cClassTrib esperado','IBS/CBS informado no XML','Valor correto segundo a regra','Valor calculado pelo motor (sem reduÃ§Ã£o)','Regra aplicada','BenefÃ­cio / enquadramento','ReduÃ§Ã£o da alÃ­quota IBS/CBS','AlÃ­quota resultante','EvidÃªncia da reduÃ§Ã£o','Origem da reduÃ§Ã£o','Economia potencial','ExposiÃ§Ã£o','Motivo','Documento','Item']].concat(
  resultadosFiltrados.map(v=>[v.produto,v.cProd,v.ncm,v.baseCalculo,v.estado,validacaoDoItem(v),v.informado?.cst,v.esperado?.cst,v.informado?.cClassTrib,v.esperado?.cClassTrib,v.valorInformadoTotal,rotuloValorCorreto(v)==='Valor correto segundo a regra'?v.valorCorreto:'',rotuloValorCorreto(v)==='Valor correto segundo a regra'?'':v.valorCorreto,v.regraAplicada,beneficioDoItem(v),reducaoCsv(v,'reducao'),reducaoCsv(v,'resultante'),reducaoCsv(v,'evidencia'),reducaoCsv(v,'origem'),v.economiaPotencial,v.exposicao,textoMotivo(v),v.documento,v.nItem]))));
}
function exportarPendencias(){
 const reducaoPrev=g=>{const o=g.reducao;return !o||o.evidencia==='nao_determinada'||o.valor==null?'':textoReducao(o.valor);};
 const evidencia=g=>{const o=g.reducao;return !o?'indisponÃ­vel':o.evidencia==='nao_determinada'||o.valor==null?'nÃ£o determinada':statusEvidenciaReducao(o).texto;};
 baixar('pendencias.csv',csv([['Produto','cProd','NCM','Base','Itens','Regra candidata','DescriÃ§Ã£o legal do benefÃ­cio','CST IBS/CBS proposto','cClassTrib proposto','Anexo','Item','ReduÃ§Ã£o prevista na regra','Status da evidÃªncia da reduÃ§Ã£o','Resposta nesta anÃ¡lise','Pergunta']].concat(
  pendentesFiltradas.flatMap(p=>(p.regrasDetalhe||(p.regras||[]).map(id=>({id}))).map(g=>[p.produto,p.cProd,p.ncm,p.base,p.itens,g.id,
   g.descricaoLegal!=null?g.descricaoLegal:(g.descricoesLegaisDivergentes||[]).join(' | '),g.cst,g.cClassTrib,g.anexo,g.item,reducaoPrev(g),evidencia(g),
   (p.respostasDestaAnalise||[]).filter(x=>x.regraId===g.id).map(x=>x.resposta).join(', '),
   'Com base na descriÃ§Ã£o legal acima, o produto atende aos requisitos para este enquadramento?'])))));
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

