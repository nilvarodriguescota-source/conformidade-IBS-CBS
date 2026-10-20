// ARQUIVO GERADO por scripts/build-webhook.mjs a partir de webhook/. Não edite aqui: edite webhook/ e rode npm run build.
// Para publicar: copie TODO este arquivo para a função kiwify-webhook no painel do Supabase
// (Edge Functions), com "Verify JWT" desligado. Passo a passo: docs/kiwify-supabase/PASSO-A-PASSO.md
// @ts-nocheck
// site/config/integracoes.ts
var SUPABASE_URL = "";
var SUPABASE_ANON_KEY = "";
var SITE_URL = "";
var limpar = (v) => v.trim().replace(/\/+$/, "");
var supabase = {
  url: limpar(SUPABASE_URL),
  chavePublica: SUPABASE_ANON_KEY.trim()
};
var site = {
  /** Vazio = usa o endereço em que a página está aberta. */
  endereco: limpar(SITE_URL)
};

// site/config/planos.ts
var catalogoRecursos = {
  analise_xml: { nome: "An\xE1lise de XMLs de NF-e e NFC-e", detalhe: "Arquivos .xml ou .zip, dentro do volume mensal do plano" },
  conferencia: { nome: "Confer\xEAncia de CST e cClassTrib", detalhe: "Item a item, com o fundamento de cada resultado" },
  dashboard: { nome: "Dashboard de conformidade", detalhe: "Situa\xE7\xE3o da empresa, economia potencial e gr\xE1ficos" },
  resultados: { nome: "Resultados com filtros e CSV", detalhe: "Busca por produto, c\xF3digo, NCM, CST e cClassTrib" },
  pendencias: { nome: "Valida\xE7\xE3o guiada de pend\xEAncias", detalhe: "Uma pergunta por produto quando a regra depende do que ele \xE9" },
  consulta_ncm: { nome: "Consulta tribut\xE1ria por NCM", detalhe: "Consulta preventiva, sem precisar de XML" },
  relatorio_csv: { nome: "Relat\xF3rio final em CSV", detalhe: "O que ajustar em cada produto" },
  relatorio_excel_pdf: { nome: "Relat\xF3rio final em Excel e PDF", detalhe: "Pronto para enviar \xE0 equipe ou ao cliente" }
};
var RECURSOS = Object.keys(catalogoRecursos);
var TODOS_OS_RECURSOS = "Tudo inclu\xEDdo: an\xE1lise das suas vendas, valida\xE7\xE3o guiada das pend\xEAncias, consulta por NCM e o relat\xF3rio do que ajustar em CSV, Excel e PDF.";
function milhar(n) {
  return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}
function comLimites(plano) {
  return { ...plano, limites: [{ rotulo: "XMLs por m\xEAs", valor: plano.xmlsPorMes == null ? "sem limite" : `at\xE9 ${milhar(plano.xmlsPorMes)}` }] };
}
var configuracaoPlanos = {
  moeda: "BRL",
  valoresIlustrativos: false,
  /** Aviso de pré-lançamento (landing, acima dos planos, e resumo do checkout). Só aparece com valoresIlustrativos = true. */
  textoValoresIlustrativos: "Pr\xE9-lan\xE7amento: valores, limites e condi\xE7\xF5es s\xE3o de refer\xEAncia e podem mudar at\xE9 a abertura das assinaturas.",
  /** Texto do selo do ciclo anual. */
  vantagemAnual: "2 meses gr\xE1tis",
  /** Condições exibidas abaixo dos planos (EXEMPLO: confirmar com o negócio). */
  condicoes: ["Todos os recursos e relat\xF3rios em todos os planos", "Sem fidelidade no plano mensal", "Troque de plano quando precisar", "Nada para instalar"],
  cicloPadrao: "mensal",
  planos: [
    {
      id: "essencial",
      nome: "Essencial",
      descricao: "Para empresas com at\xE9 2.000 XMLs de venda por m\xEAs.",
      precoMensal: 197,
      precoAnual: 1970,
      destaque: false,
      resumo: TODOS_OS_RECURSOS,
      xmlsPorMes: 2e3,
      recursos: [...RECURSOS],
      kiwify: { linkMensal: null, linkAnual: null }
    },
    {
      id: "profissional",
      nome: "Profissional",
      descricao: "Para empresas com at\xE9 5.000 XMLs de venda por m\xEAs.",
      precoMensal: 297,
      precoAnual: 2970,
      destaque: true,
      seloDestaque: "Nossa recomenda\xE7\xE3o",
      resumo: TODOS_OS_RECURSOS,
      xmlsPorMes: 5e3,
      recursos: [...RECURSOS],
      kiwify: { linkMensal: null, linkAnual: null }
    },
    {
      id: "premium",
      nome: "Premium",
      descricao: "Para opera\xE7\xF5es maiores, redes e grupos, com at\xE9 10.000 XMLs de venda por m\xEAs.",
      precoMensal: 597,
      precoAnual: 5970,
      destaque: false,
      resumo: TODOS_OS_RECURSOS,
      xmlsPorMes: 1e4,
      recursos: [...RECURSOS],
      kiwify: { linkMensal: null, linkAnual: null }
    }
  ].map(comLimites)
};
function planoDestaque() {
  return configuracaoPlanos.planos.find((p) => p.destaque) ?? configuracaoPlanos.planos[0];
}

// webhook/kiwify.ts
import { Buffer } from "node:buffer";
import { createHmac, timingSafeEqual } from "node:crypto";
function iguais(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && timingSafeEqual(x, y);
}
function origemValida(corpoCru, assinatura, tokenNaUrl, token) {
  if (!token) return false;
  if (tokenNaUrl && iguais(tokenNaUrl, token)) return true;
  if (!assinatura) return false;
  const hmac = (texto) => createHmac("sha1", token).update(texto).digest("hex");
  if (iguais(assinatura, hmac(corpoCru))) return true;
  try {
    return iguais(assinatura, hmac(JSON.stringify(JSON.parse(corpoCru))));
  } catch {
    return false;
  }
}
function desembrulhar(corpo) {
  return corpo && typeof corpo.order === "object" && corpo.order && !corpo.webhook_event_type ? corpo.order : corpo;
}
function semAcento(t) {
  return String(t ?? "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}
function codigoDoLink(link) {
  if (!link) return null;
  const limpo = String(link).trim().replace(/[?#].*$/, "").replace(/\/+$/, "");
  const codigo = limpo.split("/").pop();
  return codigo ? codigo.toLowerCase() : null;
}
function cicloDoPayload(p) {
  const f = semAcento(p.Subscription?.plan?.frequency ?? p.Subscription?.frequency ?? "");
  if (/year|annual|anual|ano/.test(f)) return "anual";
  if (/month|mensal|mes/.test(f)) return "mensal";
  const nome = semAcento(`${p.Subscription?.plan?.name ?? ""} ${p.Product?.product_name ?? ""}`);
  if (/anual|annual|yearly/.test(nome)) return "anual";
  if (/mensal|monthly/.test(nome)) return "mensal";
  return null;
}
function identificarPlano(p, planos = configuracaoPlanos.planos) {
  const codigo = codigoDoLink(p.checkout_link);
  if (codigo) {
    for (const plano of planos) {
      if (codigoDoLink(plano.kiwify.linkMensal) === codigo) return { plano, ciclo: "mensal", criterio: "link" };
      if (codigoDoLink(plano.kiwify.linkAnual) === codigo) return { plano, ciclo: "anual", criterio: "link" };
    }
  }
  const ciclo = cicloDoPayload(p);
  const nomes = semAcento(`${p.Subscription?.plan?.name ?? ""} ${p.Product?.product_name ?? ""}`);
  const porNome = planos.find((pl) => nomes.includes(semAcento(pl.nome)));
  if (porNome) return { plano: porNome, ciclo: ciclo ?? "mensal", criterio: "nome" };
  const centavos = Number(p.Commissions?.product_base_price ?? p.Commissions?.charge_amount ?? NaN);
  if (Number.isFinite(centavos) && centavos > 0) {
    for (const plano of planos) {
      if (plano.precoMensal != null && Math.round(plano.precoMensal * 100) === centavos && ciclo !== "anual") return { plano, ciclo: "mensal", criterio: "valor" };
      if (plano.precoAnual != null && Math.round(plano.precoAnual * 100) === centavos && ciclo !== "mensal") return { plano, ciclo: "anual", criterio: "valor" };
    }
  }
  return null;
}
function formaDePagamento(p) {
  const m = semAcento(p.payment_method);
  if (m.includes("pix")) return "pix";
  if (m.includes("boleto") || m.includes("billet")) return "boleto";
  if (m.includes("card") || m.includes("cartao") || m.includes("credit")) return "cartao";
  return null;
}
function data(valor) {
  if (!valor) return null;
  const texto = String(valor).trim();
  const iso = /^\d{4}-\d{2}-\d{2} \d{2}:\d{2}(:\d{2})?$/.test(texto) ? `${texto.replace(" ", "T")}-03:00` : texto;
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}
function somarCiclo(inicioIso, ciclo) {
  const d = new Date(inicioIso);
  if (ciclo === "anual") d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return d.toISOString();
}
function efeitoDoEvento(p) {
  const evento = semAcento(p.webhook_event_type);
  const status = semAcento(p.order_status);
  switch (evento) {
    case "order_approved":
    case "subscription_renewed":
      return "ativar";
    case "billet_created":
    case "pix_created":
      return "pendente";
    case "subscription_late":
      return "atraso";
    case "subscription_canceled":
      return "cancelar";
    case "order_refunded":
    case "chargeback":
      return "encerrar";
  }
  if (status === "paid" || status === "approved") return "ativar";
  if (status === "waiting_payment") return "pendente";
  if (status === "refunded" || status === "chargedback") return "encerrar";
  return "ignorar";
}
function clienteDoPayload(p) {
  const c = p.Customer ?? p.customer ?? {};
  const email = String(c.email ?? "").trim().toLowerCase();
  if (!email.includes("@")) return null;
  const texto = (v) => typeof v === "string" && v.trim() ? v.trim() : null;
  return { email, nome: texto(c.full_name) ?? texto(c.first_name), telefone: texto(c.mobile), cnpj: texto(c.cnpj) };
}
function alteracaoDaAssinatura(p, email, atual, agora = /* @__PURE__ */ new Date()) {
  const efeito = efeitoDoEvento(p);
  if (efeito === "ignorar") return null;
  const agoraIso = agora.toISOString();
  const identificado = identificarPlano(p);
  const base = {
    email,
    status: "ativa",
    origem: "kiwify",
    atualizada_em: agoraIso,
    kiwify_assinatura_id: p.subscription_id ?? p.Subscription?.id ?? null,
    kiwify_pedido_id: p.order_id ?? null
  };
  if (identificado) {
    base.plano_id = identificado.plano.id;
    base.ciclo = identificado.ciclo;
    base.limite_xmls_mes = identificado.plano.xmlsPorMes;
  }
  const forma = formaDePagamento(p);
  if (forma) base.forma_pagamento = forma;
  switch (efeito) {
    case "ativar": {
      const ciclo = identificado?.ciclo ?? "mensal";
      const inicio = data(p.approved_date) ?? data(p.Subscription?.start_date) ?? agoraIso;
      const proxima = data(p.Subscription?.next_payment);
      return {
        plano: identificado,
        alteracao: { ...base, status: "ativa", inicio_periodo: inicio, fim_periodo: proxima && proxima > agoraIso ? proxima : somarCiclo(inicio, ciclo), cancelada_em: null }
      };
    }
    case "pendente":
      if (atual && atual.status !== "pendente_pagamento") return null;
      return { plano: identificado, alteracao: { ...base, status: "pendente_pagamento", inicio_periodo: null, fim_periodo: null } };
    case "atraso":
      if (!atual) return null;
      return { plano: identificado, alteracao: { ...base, status: "em_atraso" } };
    case "cancelar": {
      if (!atual) return null;
      const fim = atual.fim_periodo ?? data(p.Subscription?.next_payment) ?? agoraIso;
      return { plano: identificado, alteracao: { ...base, status: "cancelada", cancelada_em: agoraIso, fim_periodo: fim } };
    }
    case "encerrar":
      if (!atual) return null;
      return { plano: identificado, alteracao: { ...base, status: "cancelada", cancelada_em: agoraIso, fim_periodo: agoraIso } };
  }
}
function pagamentoDoEvento(p, email, nomePlano) {
  const efeito = efeitoDoEvento(p);
  const pedido = p.order_id ?? p.order_ref;
  if (!pedido || efeito !== "ativar" && efeito !== "pendente" && efeito !== "encerrar") return null;
  const status = efeito === "ativar" ? "pago" : efeito === "pendente" ? "pendente" : "estornado";
  const centavos = Number(p.Commissions?.charge_amount ?? p.Commissions?.product_base_price ?? 0);
  const renovacao = semAcento(p.webhook_event_type) === "subscription_renewed";
  return {
    id: `${pedido}`,
    email,
    data: data(p.approved_date) ?? data(p.updated_at) ?? data(p.created_at) ?? (/* @__PURE__ */ new Date()).toISOString(),
    descricao: `${nomePlano ? `Plano ${nomePlano}` : String(p.Product?.product_name ?? "Assinatura")}${renovacao ? " \xB7 renova\xE7\xE3o" : ""}${status === "estornado" ? " \xB7 estornado" : ""}`,
    valor: Number.isFinite(centavos) ? centavos / 100 : 0,
    status,
    url_comprovante: null
  };
}
function chaveDoEvento(p, corpoCru) {
  const pedido = p.order_id ?? p.order_ref ?? "";
  const tipo = p.webhook_event_type ?? p.order_status ?? "";
  if (pedido && tipo) return `${tipo}:${pedido}:${p.Subscription?.charges?.completed?.length ?? ""}:${p.updated_at ?? p.approved_date ?? ""}`;
  return `corpo:${createHmac("sha1", "kiwify").update(corpoCru).digest("hex")}`;
}

// webhook/processar.ts
function resposta(status, corpo) {
  return new Response(JSON.stringify(corpo), { status, headers: { "content-type": "application/json" } });
}
function supabase2(cfg, http) {
  const base = cfg.supabaseUrl.replace(/\/+$/, "");
  const cabecalhos = { apikey: cfg.chaveServico, authorization: `Bearer ${cfg.chaveServico}`, "content-type": "application/json" };
  const filtro = (campo, valor) => `${campo}=eq.${encodeURIComponent(valor)}`;
  async function pedir(metodo, caminho, corpo, extras = {}) {
    const r = await http(`${base}${caminho}`, { method: metodo, headers: { ...cabecalhos, ...extras }, body: corpo === void 0 ? void 0 : JSON.stringify(corpo) });
    const texto = await r.text();
    if (!r.ok) {
      let detalhe = {};
      try {
        detalhe = JSON.parse(texto);
      } catch {
      }
      throw Object.assign(new Error(detalhe.message ?? detalhe.msg ?? `HTTP ${r.status}`), { status: r.status, codigo: detalhe.error_code ?? detalhe.code ?? "" });
    }
    return texto ? JSON.parse(texto) : null;
  }
  return {
    async primeiro(tabela, campos, campo, valor) {
      const linhas = await pedir("GET", `/rest/v1/${tabela}?select=${campos}&${filtro(campo, valor)}&limit=1`);
      return linhas[0] ?? null;
    },
    inserir: (tabela, linha) => pedir("POST", `/rest/v1/${tabela}`, linha, { prefer: "return=minimal" }),
    gravar: (tabela, linha) => pedir("POST", `/rest/v1/${tabela}`, linha, { prefer: "resolution=merge-duplicates,return=minimal" }),
    atualizar: (tabela, campo, valor, linha) => pedir("PATCH", `/rest/v1/${tabela}?${filtro(campo, valor)}`, linha, { prefer: "return=minimal" }),
    convidar: (email, dados, redirecionar) => pedir("POST", `/auth/v1/invite${redirecionar ? `?redirect_to=${encodeURIComponent(redirecionar)}` : ""}`, { email, data: dados })
  };
}
async function tratarWebhook(req, cfg, http = fetch) {
  if (req.method !== "POST") return resposta(405, { erro: "use POST" });
  if (!cfg.tokenKiwify || !cfg.supabaseUrl || !cfg.chaveServico) {
    console.error("[kiwify] configura\xE7\xE3o ausente: KIWIFY_WEBHOOK_TOKEN, SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY");
    return resposta(500, { erro: "webhook n\xE3o configurado" });
  }
  const url = new URL(req.url);
  const corpoCru = await req.text();
  if (!origemValida(corpoCru, url.searchParams.get("signature"), url.searchParams.get("token"), cfg.tokenKiwify)) {
    console.warn("[kiwify] assinatura inv\xE1lida");
    return resposta(401, { erro: "assinatura inv\xE1lida" });
  }
  let payload;
  try {
    payload = desembrulhar(JSON.parse(corpoCru));
  } catch {
    return resposta(400, { erro: "JSON inv\xE1lido" });
  }
  const db = supabase2(cfg, http);
  const chave = chaveDoEvento(payload, corpoCru);
  const cliente = clienteDoPayload(payload);
  const efeito = efeitoDoEvento(payload);
  const registrar = (resultado) => db.atualizar("kiwify_eventos", "chave", chave, { resultado }).catch(() => void 0);
  try {
    const jaVisto = await db.primeiro("kiwify_eventos", "resultado", "chave", chave);
    if (jaVisto?.resultado && !String(jaVisto.resultado).startsWith("erro")) return resposta(200, { ok: true, repetido: true });
    await db.gravar("kiwify_eventos", { chave, tipo: payload.webhook_event_type ?? payload.order_status ?? null, email: cliente?.email ?? null, payload, resultado: "recebido" });
  } catch (e) {
    console.error("[kiwify] banco indispon\xEDvel:", e instanceof Error ? e.message : e);
    return resposta(500, { erro: "banco indispon\xEDvel; a Kiwify vai reenviar" });
  }
  try {
    if (!cliente) {
      await registrar("ignorado: sem e-mail do cliente");
      return resposta(200, { ok: true, ignorado: "sem e-mail" });
    }
    const atual = await db.primeiro("assinaturas", "status,fim_periodo", "email", cliente.email);
    const resultado = alteracaoDaAssinatura(payload, cliente.email, atual);
    const pagamento = pagamentoDoEvento(payload, cliente.email, resultado?.plano?.plano.nome ?? null);
    if (pagamento) await db.gravar("pagamentos", pagamento);
    if (!resultado) {
      await registrar(`ignorado: ${efeito}${atual ? ` (assinatura ${atual.status})` : " (sem assinatura)"}`);
      return resposta(200, { ok: true, ignorado: efeito });
    }
    const { alteracao, plano } = resultado;
    if (atual) await db.atualizar("assinaturas", "email", cliente.email, alteracao);
    else {
      const reserva = planoDestaque();
      await db.inserir("assinaturas", { plano_id: reserva.id, ciclo: "mensal", limite_xmls_mes: reserva.xmlsPorMes, ...alteracao });
    }
    let convite = "";
    if (efeito === "ativar") {
      const destino = cfg.siteUrl ? `${cfg.siteUrl.replace(/\/+$/, "")}/definir-senha.html` : "";
      try {
        await db.convidar(cliente.email, { nome: cliente.nome, telefone: cliente.telefone, cnpj: cliente.cnpj }, destino);
        convite = "convite enviado";
      } catch (e) {
        const erro = e;
        if (erro.codigo === "email_exists" || erro.status === 422 || /already been registered|already exists/i.test(erro.message)) convite = "conta j\xE1 existia";
        else throw new Error(`convite: ${erro.message}`);
      }
    }
    const nota = plano ? `plano ${plano.plano.id}/${plano.ciclo} por ${plano.criterio}` : "PLANO N\xC3O IDENTIFICADO (confira os links em site/config/planos.ts)";
    await registrar(`ok: ${alteracao.status}; ${nota}${convite ? `; ${convite}` : ""}`);
    return resposta(200, { ok: true, status: alteracao.status });
  } catch (e) {
    const mensagem = e instanceof Error ? e.message : String(e);
    console.error("[kiwify] falha:", mensagem);
    await registrar(`erro: ${mensagem}`);
    return resposta(500, { erro: "falha ao processar; a Kiwify vai reenviar" });
  }
}

// webhook/funcao-supabase.ts
var env = (nome) => (Deno.env.get(nome) ?? "").trim();
Deno.serve(
  (req) => tratarWebhook(req, {
    tokenKiwify: env("KIWIFY_WEBHOOK_TOKEN"),
    supabaseUrl: env("SUPABASE_URL"),
    chaveServico: env("SUPABASE_SERVICE_ROLE_KEY"),
    siteUrl: env("SITE_URL") || site.endereco
  })
);
