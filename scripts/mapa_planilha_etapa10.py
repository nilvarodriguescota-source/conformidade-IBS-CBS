import json,re,csv,collections as C
"""
Etapa 10: mapa linha a linha da aba "Base de dados" da planilha V4.1 frente à base do sistema,
à auditoria oficial e aos bloqueios. Grava docs/etapa10/mapa-planilha-sistema.csv.
Uso (na raiz do projeto, depois de npm run build): python3 scripts/mapa_planilha_etapa10.py planilha.xlsm
"""
import sys,openpyxl
R='./'
wb=openpyxl.load_workbook(sys.argv[1],read_only=True)
rows=list(wb['Base de dados'].iter_rows(values_only=True))
P=[{**{k:(str(v) if v is not None else None) for k,v in zip(rows[0],r) if k},'_linha':i+2} for i,r in enumerate(rows[1:]) if any(v not in (None,'') for v in r)]
_h=open(R+'data/fontes/svrs/svrs.html',encoding='utf-8').read()
_i=_h.index('var dadosOriginais'); _j=_h.index('=',_i)+1
import json as _json
_dados=_json.JSONDecoder().raw_decode(_h[_j:].lstrip())[0]
base=json.load(open(R+'data/base-normativa.json'))
aud=json.load(open(R+'data/auditoria-oficial.json'))
d=_dados
cls={c['CodClassTrib']:c for x in d for c in (x['ClassificacoesTributarias'] or [])}
ROM={1:'I',4:'IV',5:'V',6:'VI',7:'VII',8:'VIII',9:'IX',10:'X',11:'XI',12:'XII',13:'XIII',15:'XV'}
porId=C.defaultdict(list)
for r in base['regras']: porId[(r['ncm'],r['cClassTrib'],r['descricaoLegal'])].append(r)
audPor={(a['regraId'],a['ncm']):a for a in aud['regras']}
import subprocess
bl=json.loads(subprocess.run(['node','-e','import("./dist/src/bloqueios.js").then(m=>{console.log(JSON.stringify([...m.bloqueiosParaBase("data/base-normativa.json").keys()]))})'],capture_output=True,text=True,cwd='.').stdout)
bl=set(bl)
f2=C.defaultdict(set)
for k,c in cls.items():
    for a in c['Anexos'] or []:
        if a['TipoCodigo']=='NCM': f2[(a['CodNcmNbs'],k)].add(a['TipoPermissao'])
linhas=[];cont=C.Counter();diverg=C.Counter()
for p in P:
    L=p['_linha']; desc=(p.get('Descrição legal do benefício') or '').strip()
    s=re.sub(r'\D','',p.get('NCM completo (8 dígitos)') or '')
    ncm='0'+s if len(s)==7 else (s if len(s)==8 else None)
    ccl=re.sub(r'\D','',p.get('cClassTrib correto') or '')
    if not ccl and re.fullmatch(r'\d{6}',re.sub(r'\D','',p.get('Coluna1') or '')): ccl=re.sub(r'\D','',p['Coluna1'])
    trat=(p.get('Tratamento tributário') or p.get('Coluna3') or '').strip()
    out={'linha':L,'ncm':ncm or p.get('NCM completo (8 dígitos)'),'cClassTrib':ccl,'tratamento_planilha':trat,'anexo':p.get('Anexo'),'item':p.get('Item'),'fundamento_planilha':p.get('Fundamento legal')}
    rs=porId.get((ncm,ccl,desc),[]) if ncm and ccl else []
    if not rs:
        out.update(regra_sistema='',local='',status='AUSENTE',falta='linha descartada na extração: '+('NCM inválido' if not ncm else 'sem cClassTrib'))
    else:
        r=rs[0]; out['regra_sistema']=r['id']; out['local']='data/base-normativa.json'
        a=audPor.get((r['id'],r['ncm'])); st=a['status'] if a else '?'
        b=(r['id']+'|'+r['ncm']) in bl
        of=cls.get(ccl); perm=f2.get((ncm,ccl),set())
        red_of=of and of['PercRedIbs']/100; red_pl=1.0 if 'zero' in trat.lower() else 0.6 if '60' in trat else None
        dv=[]
        if red_of is not None and red_pl is not None and abs(red_of-red_pl)>1e-9: dv.append(f'redução planilha {red_pl:.0%} x oficial {red_of:.0%}')
        if of and of.get('NroAnexo') in ROM and (p.get('Anexo') or '').strip()!=ROM[of['NroAnexo']]: dv.append(f"anexo planilha {p.get('Anexo')} x oficial {ROM[of['NroAnexo']]}")
        fp=(p.get('Fundamento legal') or '').strip(); fo='Art. '+re.search(r'art(\d+)',of['TexUrlLegislacao']).group(1) if of else ''
        if fp and not fp.lower().startswith('art'): dv.append(f"fundamento planilha '{fp}' não é artigo (sistema usa {r['fundamentoLegal']}; oficial {fo})")
        elif fp and fo and fo not in fp and not (fp=='Arts. 133 e 134' and fo=='Art. 133'): dv.append(f"fundamento planilha {fp} x oficial {fo}")
        if 'VEDADO' in perm: dv.append('NCM VEDADO no Portal para o código')
        for x in dv: diverg[re.sub(r"'[^']*'|\d+(\.\d+)?%?","#",x)]+=1
        falta = 'nada (regra bloqueada: benefício impedido por vedação oficial)' if b else ('nada' if st=='CONFIRMADA' else 'validação humana/decisão (divergência documentada na auditoria)')
        out.update(status_auditoria=st,bloqueada='SIM' if b else 'NÃO',status='BLOQUEADA' if b else ('IMPLEMENTADA_CONFIRMADA' if st=='CONFIRMADA' else 'IMPLEMENTADA_COM_RESSALVA'),
                   motivos_auditoria=' | '.join(a['motivos']) if a else '',divergencias=' | '.join(dv),falta=falta,
                   reducao_sistema=f"{r['reducaoAliquota']:.0%}",fundamento_sistema=r['fundamentoLegal'])
    cont[out['status']]+=1; linhas.append(out)
cols=['linha','ncm','cClassTrib','tratamento_planilha','anexo','item','fundamento_planilha','regra_sistema','local','reducao_sistema','fundamento_sistema','status_auditoria','bloqueada','status','motivos_auditoria','divergencias','falta']
with open(R+'docs/etapa10/mapa-planilha-sistema.csv','w',newline='',encoding='utf-8') as f:
    w=csv.DictWriter(f,cols,delimiter=';');w.writeheader();[w.writerow({k:l.get(k,'') for k in cols}) for l in linhas]
print(cont); print(diverg)
aus=[l for l in linhas if l['status']=='AUSENTE']; print('ausentes:',[(l['linha'],l['ncm'],l['cClassTrib']) for l in aus][:10])
# duplicatas: linhas diferentes da planilha que caem na mesma regra
c2=C.Counter(l['regra_sistema'] for l in linhas if l.get('regra_sistema')); print('regras do sistema cobertas:',len(c2),'linhas duplicadas:',sum(v-1 for v in c2.values()))
