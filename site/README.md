# Site comercial e área do cliente

Página de venda, contratação e área do cliente do Conformidade IBS/CBS. O sistema de
XML **não foi alterado**: continua sendo gerado por `src/pagina.ts` e passa a ser
publicado em `sistema.html` (antes era `index.html`). A raiz do site agora é a página
comercial.

```
Visitante → index.html (landing) → Planos → cadastro.html → checkout.html
         → conta liberada → conta.html (área do cliente) → sistema (sistema.html)
```

## Páginas

| Endereço | Arquivo-fonte | Papel |
| --- | --- | --- |
| `/` | `html/index.html` + `paginas/inicio.ts` | Página de venda: problema, risco, solução, demonstração, o que você descobre, diferenciais, público, exemplo de análise, planos, quem está por trás, FAQ |
| `/entrar` | `html/entrar.html` + `paginas/entrar.ts` | Login (volta para `?voltar=` ou para a área do cliente) |
| `/cadastro` | `html/cadastro.html` + `paginas/cadastro.ts` | Escolha do plano e criação da conta (em produção, redireciona para o checkout da Kiwify) |
| `/recuperar-senha` | `html/recuperar-senha.html` + `paginas/recuperar-senha.ts` | Pedido do e-mail de redefinição |
| `/definir-senha` | `html/definir-senha.html` + `paginas/definir-senha.ts` | Destino do convite pós-compra e do link de redefinição: cria a senha e entra |
| `/checkout` | `html/checkout.html` + `paginas/checkout.ts` | Resumo, forma de pagamento e "conta liberada" |
| `/conta` | `html/conta.html` + `paginas/conta.ts` | Área do cliente: início, sistema, assinatura, perfil, configurações |
| `/sistema` | gerado por `src/pagina.ts` | O sistema de XML, sem mudanças |
| `/termos`, `/privacidade` | `html/termos.html`, `html/privacidade.html` | Estrutura dos documentos legais (texto a redigir) |

## Estrutura

```
site/
  config/          ← o que o negócio edita
    produto.ts       nome, contatos, razão social (null = "a definir" na tela)
    planos.ts        planos, preços, limites, recursos, ids do gateway
    integracoes.ts   modo (demonstracao | producao) e provedores
  servicos/        ← regras de conta, sem nada de tela
    tipos.ts         contratos: Usuario, Assinatura, ProvedorAutenticacao, ProvedorPagamento
    conta.ts         fachada usada pelas telas (carregarConta)
    acesso.ts        quem pode abrir o sistema e quais recursos o plano libera
    rotas.ts         endereços e proteção contra redirecionamento externo
    provedores/      demonstracao.ts, pendente.ts e o registro (index.ts)
  ui/              ← utilitários de interface (cabeçalho, formulários, máscaras)
  paginas/         ← um script por página
  estilos/         ← tokens.css (cores e fontes), base, componentes e um CSS por página
  html/            ← páginas; html/partes/ tem cabeçalho, rodapé, ícones e painéis comuns
  imagens/, fontes/
```

`scripts/build-site.mjs` monta tudo em `public/` (chamado por `scripts/build-web.mjs`,
que continua gerando o sistema). As partes comuns entram no HTML com `<!-- @parte nome -->`.

## Comandos

```bash
npm run build        # gera public/ (sistema + site), igual ao Netlify
npm run site         # build + servidor local em http://localhost:4173
npm run site:tipos   # checagem de tipos do código do site
```

`npm start` continua abrindo só o sistema (servidor local da versão de computador).

## Editar sem programar

- **Preços, limites e recursos:** `config/planos.ts`. Enquanto `valoresIlustrativos`
  for `true`, a página mostra o aviso de pré-lançamento (`textoValoresIlustrativos`) acima
  dos planos e no resumo do checkout. Os números atuais são exemplos.
- **Contatos e dados da empresa:** `config/produto.ts`. Campos `null` aparecem com o selo
  "A DEFINIR" (classe `.a-definir`).
- **Quem está por trás:** `config/produto.ts`, em `responsavel` (nome, especialidade,
  experiência, motivo, foto, número em destaque sobre a foto, formação, frase, cidade,
  LinkedIn e site). A foto (retrato 4:5) vai em `site/imagens/` e o caminho entra em `foto`;
  sem foto, a seção mostra a coruja da marca. Destaque, formação, frase, região e links
  somem quando vazios; o destaque só aparece junto com a foto.
- **Cores e fontes:** `estilos/tokens.css` (mesma paleta do sistema).
- **Textos:** direto nos arquivos de `html/`.

## Modo demonstração e produção

O modo sai do build (`config/integracoes.ts`):

- **Sem** `SUPABASE_URL` e `SUPABASE_ANON_KEY` no ambiente → **demonstração**: contas, assinaturas e
  "pagamentos" ficam só no `localStorage` de quem testa, nada é cobrado, nenhum e-mail é enviado e as
  telas mostram a faixa "Modo demonstração". Não é segurança: serve para ver o fluxo.
- **Com** as variáveis → **produção**: login pelo Supabase, compra pela Kiwify, acesso liberado pelo
  webhook. Configuração completa em `docs/kiwify-supabase/PASSO-A-PASSO.md`.

## Produção: Kiwify + Supabase

```
Assinar (landing) → checkout da Kiwify → compra aprovada
  → POST /api/kiwify (netlify/functions/kiwify-webhook.mts)
      grava assinaturas/pagamentos no Supabase e convida o comprador por e-mail
  → convite → definir-senha.html → conta.html → sistema.html (netlify/edge-functions/proteger-sistema.ts)
```

| Peça | Arquivo |
| --- | --- |
| Links de checkout por plano e ciclo | `config/planos.ts` (`kiwify.linkMensal` / `linkAnual`); `rotas.cadastro()` leva direto a eles |
| Login, link de acesso por e-mail, senha | `servicos/provedores/supabase-kiwify.ts` (biblioteca carregada sob demanda) |
| Leitura da assinatura e do histórico | mesmo arquivo; o banco só devolve a linha do e-mail logado (RLS) |
| Regras do webhook (assinatura, plano, efeito de cada evento) | `netlify/lib/kiwify.ts`, testadas em `test/kiwify-webhook.test.ts` |
| Tabelas e políticas | `sql/supabase.sql` |
| Proteção do sistema | `netlify/edge-functions/proteger-sistema.ts`, que lê o cookie `se_acesso` gravado pelo site |

Na Kiwify, a troca de plano, o cancelamento e a exclusão da conta são feitos pelo suporte ou pela própria
Kiwify; as telas dizem isso em vez de simular. O navegador nunca ativa assinatura: só o webhook grava.

A regra de acesso (`servicos/acesso.ts`) está repetida na função de borda. Mudou uma, mude a outra.

### Limites por plano dentro do sistema de XML
`config/planos.ts` lista os recursos de cada plano e `podeUsar()` responde se o plano
libera um recurso. O sistema de XML ainda não limita nada por plano (nem o volume de XMLs);
quando passar a limitar, deve consultar essa regra no servidor.

### Sistema de XML
A área do cliente abre `sistema.html` num iframe da mesma origem. Os atalhos ("Relatório
Final", "Consulta por NCM"...) só clicam no botão da aba do sistema; os ids das telas
estão em `MODULOS`, em `paginas/conta.ts`. A análise continua salva no navegador
(IndexedDB), como antes.

### Outro provedor
Para trocar Supabase ou Kiwify por outro serviço: implementar `ProvedorAutenticacao` /
`ProvedorPagamento` (`servicos/tipos.ts`) em `servicos/provedores/`, registrar em
`provedores/index.ts` e escolher o nome em `config/integracoes.ts`.

## Textos que dependem do funcionamento atual

O FAQ, o cartão "Seus XMLs não saem do navegador" e o hero dizem que os XMLs são
processados e salvos no navegador, sem scripts de terceiros. Isso é verdade na versão atual
(Netlify). Se o processamento passar para um servidor, revise esses textos e a página de
privacidade.

Outros textos da página de venda repetem o comportamento do sistema e precisam acompanhar
qualquer mudança nele:

- **Telas de demonstração** (painel do hero e seção "Demonstração"): faixa "ATENÇÃO" para 84%,
  as quatro opções de "O que é este produto?", a instrução do Relatório Final e o resultado
  "Requer validação humana" da Consulta por NCM imitam a tela real (`src/pagina.ts`,
  `src/opcoes-validacao.ts`). Os números são de demonstração e aparecem rotulados como tal.
- **FAQ do Simples Nacional:** diz que a análise segue o calendário do regime normal porque a
  versão do navegador usa `empresa.json` com `regime: "normal"`. Se o regime passar a ser lido
  da nota, revise a resposta.
- **Bares e restaurantes** (cartão de restaurantes e FAQ "O que exatamente é conferido?"): a
  pergunta sobre consumo no local vale para todo produto quando a empresa é declarada bar ou
  restaurante na análise (`POST /api/atividade`, `src/analise-atual.ts`).
- **Alíquotas de teste de 2026** (seção do risco e FAQ da economia potencial): CBS 0,9% e
  IBS 0,1%, de `src/parametros.ts`.
- **Modo demonstração:** elementos com `data-so-demonstracao` (por exemplo, "nesta fase nada é
  cobrado") só aparecem enquanto `integracoes.modo` for `"demonstracao"`; os com
  `data-so-producao`, o contrário.

## Fontes

`fontes/` tem a Cormorant Garamond do `@fontsource` com o circunflexo (â ê ô) mais baixo,
gerada por `scripts/ajustar_fonte_site.py` (precisa de `fonttools` e `brotli`). No
desenho original o acento é muito alto e parece solto em títulos grandes. A fonte do
sistema não foi alterada. Imagens grandes da marca: `scripts/gerar_marca_site.py`.
