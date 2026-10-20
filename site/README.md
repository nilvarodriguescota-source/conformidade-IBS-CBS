# Site comercial e área do cliente

Página de venda, contratação e área do cliente do Conformidade IBS/CBS. O sistema de
XML **não foi alterado**: continua sendo gerado por `src/pagina.ts` e passa a ser
publicado em `sistema.html` (antes era `index.html`). A raiz do site agora é a página
comercial.

```
Visitante → index.html (landing) → Planos → "Assinar" → checkout da Kiwify
         → e-mail de convite → definir-senha.html → conta.html (área do cliente) → sistema (sistema.html)
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
| `/conta` | `html/conta.html` + `paginas/conta.ts` | Área do cliente: início, sistema, treinamento, assinatura, perfil, configurações |
| `/sistema` | gerado por `src/pagina.ts` | O sistema de XML; `web/navegador.ts` só deixa abrir com assinatura liberada e confere o limite de XMLs |
| `/termos`, `/privacidade` | `html/termos.html`, `html/privacidade.html` | Estrutura dos documentos legais (texto a redigir) |

## Estrutura

```
site/
  config/          ← o que o negócio edita
    produto.ts       nome, contatos, razão social (null = "a definir" na tela)
    planos.ts        planos, preços, XMLs por mês, recursos, links da Kiwify
    integracoes.ts   endereço e chave pública do Supabase, endereço do site
    treinamento.ts   aulas em vídeo (links do YouTube) da aba Treinamento
  servicos/        ← regras de conta, sem nada de tela
    tipos.ts         contratos: Usuario, Assinatura, ProvedorAutenticacao, ProvedorPagamento
    conta.ts         fachada usada pelas telas (carregarConta)
    acesso.ts        quem pode abrir o sistema e quais recursos o plano libera
    sistema.ts       acesso ao sistema e limite de XMLs (usado por web/navegador.ts)
    rotas.ts         endereços e proteção contra redirecionamento externo
    provedores/      supabase-kiwify.ts, pendente.ts (sem Supabase configurado) e o registro (index.ts)
  ui/              ← utilitários de interface (cabeçalho, formulários, máscaras, treinamento)
  hospedagem/      ← .htaccess da Hostinger (copiado para public/)
  paginas/         ← um script por página
  estilos/         ← tokens.css (cores e fontes), base, componentes e um CSS por página
  html/            ← páginas; html/partes/ tem cabeçalho, rodapé, ícones e painéis comuns
  imagens/, fontes/
```

`scripts/build-site.mjs` monta tudo em `public/` (chamado por `scripts/build-web.mjs`,
que continua gerando o sistema). As partes comuns entram no HTML com `<!-- @parte nome -->`.

## Comandos

```bash
npm run build        # gera public/ (sistema + site) e a função do webhook (supabase/functions/)
npm run site         # build + servidor local em http://localhost:4173
npm run site:tipos   # checagem de tipos do código do site
```

`npm start` continua abrindo só o sistema (servidor local da versão de computador).

## Editar sem programar

- **Preços, limites e recursos:** `config/planos.ts`. `xmlsPorMes` é o limite de XMLs de venda
  por mês de cada plano (o webhook grava na assinatura; depois de mudar, publique de novo a função
  do Supabase). `valoresIlustrativos: true` volta a mostrar o aviso de pré-lançamento acima dos planos.
- **Aulas em vídeo:** `config/treinamento.ts` (links do YouTube, título opcional).
- **Contatos e dados da empresa:** `config/produto.ts`. Campos `null` aparecem com o selo
  "A DEFINIR" (classe `.a-definir`).
- **Quem está por trás:** `config/produto.ts`, em `responsavel` (nome, especialidade,
  experiência, motivo, foto, número em destaque sobre a foto, formação, frase, cidade,
  LinkedIn e site). A foto (retrato 4:5) vai em `site/imagens/` e o caminho entra em `foto`;
  sem foto, a seção mostra a coruja da marca. Destaque, formação, frase, região e links
  somem quando vazios; o destaque só aparece junto com a foto.
- **Cores e fontes:** `estilos/tokens.css` (mesma paleta do sistema).
- **Textos:** direto nos arquivos de `html/`.

## Produção: Kiwify + Supabase + Hostinger

O site é estático (Hostinger). Não há modo demonstração: sem o endereço e a chave pública do Supabase
em `config/integracoes.ts`, as telas de conta avisam que a integração está pendente.
Configuração completa em `docs/kiwify-supabase/PASSO-A-PASSO.md`.

```
Assinar (landing) → checkout da Kiwify → compra aprovada
  → POST https://PROJETO.supabase.co/functions/v1/kiwify-webhook (webhook/processar.ts)
      grava assinaturas (com o limite de XMLs do plano) e pagamentos, e convida o comprador por e-mail
  → convite → definir-senha.html → conta.html → sistema.html (web/navegador.ts confere a assinatura)
```

| Peça | Arquivo |
| --- | --- |
| Links de checkout por plano e ciclo | `config/planos.ts` (`kiwify.linkMensal` / `linkAnual`); `rotas.cadastro()` leva direto a eles |
| Login, link de acesso por e-mail, senha | `servicos/provedores/supabase-kiwify.ts` (biblioteca carregada sob demanda) |
| Leitura da assinatura e do histórico | mesmo arquivo; o banco só devolve a linha do e-mail logado (RLS) |
| Webhook (regras de cada evento e gravação no Supabase) | `../webhook/kiwify.ts` e `../webhook/processar.ts`, testados em `test/kiwify-webhook*.test.ts`; o build junta tudo em `../supabase/functions/kiwify-webhook/index.ts` |
| Tabelas, políticas e contagem de XMLs | `sql/supabase.sql` |
| Quem abre o sistema e limite de XMLs | `servicos/sistema.ts`, chamado por `web/navegador.ts` |

Na Kiwify, a troca de plano, o cancelamento e a exclusão da conta são feitos pelo suporte ou pela própria
Kiwify; as telas dizem isso em vez de simular. O navegador nunca ativa assinatura: só o webhook grava.

A regra de acesso (`servicos/acesso.ts`) está repetida no banco (`registrar_uso_xmls`). Mudou uma, mude a outra.

### Limite de XMLs por mês
Ao clicar em "Processar análise", `web/navegador.ts` pede ao sistema a lista das notas de venda da
análise (`GET /api/notas-da-analise`: SHA-256 da chave de acesso de cada nota, sem entradas,
devoluções, canceladas e repetidas) e manda essa lista para a função `registrar_uso_xmls` do banco.
O banco conta as notas novas do mês (horário de Brasília); se passarem de `limite_xmls_mes` da
assinatura, nada é registrado e a análise é recusada com a mensagem de `servicos/sistema.ts`. A mesma
nota no mesmo mês não conta duas vezes. A área do cliente mostra "X de Y XMLs usados neste mês"
(`uso_xmls_do_mes`). A versão de computador (`npm start`) não tem login e não limita nada.

### Treinamento
A aba "Treinamento" da área do cliente (`ui/treinamento.ts`) lista as aulas de `config/treinamento.ts`.
O player do YouTube (youtube-nocookie.com) só carrega quando a pessoa clica em assistir; as aulas
abertas ficam marcadas no navegador. Sem título na configuração, a tela tenta buscar o título no
YouTube e, se não conseguir, mostra "Aula N".

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
processados e salvos no navegador, sem scripts de terceiros. Isso continua verdade: para o
banco vai só o código anônimo de cada nota, para contar o limite do plano. Se o processamento
passar para um servidor, revise esses textos e a página de privacidade.

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

## Fontes

`fontes/` tem a Cormorant Garamond do `@fontsource` com o circunflexo (â ê ô) mais baixo,
gerada por `scripts/ajustar_fonte_site.py` (precisa de `fonttools` e `brotli`). No
desenho original o acento é muito alto e parece solto em títulos grandes. A fonte do
sistema não foi alterada. Imagens grandes da marca: `scripts/gerar_marca_site.py`.
