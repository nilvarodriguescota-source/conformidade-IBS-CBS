/**
 * Leitura de XML de NF-e e NFC-e (nfeProc, NFe e procEventoNFe).
 * Corrige os defeitos D14 a D16 e D23 do diagnóstico: lê chave, modelo, data,
 * CRT, CFOP, finalidade, base de cálculo e alíquotas; reconhece eventos de
 * cancelamento; e deduplica documentos pela chave de acesso.
 */
import { XMLParser } from "fast-xml-parser";
import type { Documento, ItemDocumento } from "./tipos.js";

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "@",
  parseTagValue: false,
  parseAttributeValue: false,
  removeNSPrefix: true, // o layout usa namespace padrão; remover simplifica o acesso
  trimValues: true,
});

type No = Record<string, any>;

function lista<T = No>(v: T | T[] | undefined): T[] {
  if (v === undefined || v === null) return [];
  return Array.isArray(v) ? v : [v];
}

function texto(v: unknown): string | null {
  if (v === undefined || v === null) return null;
  const s = String(typeof v === "object" ? (v as No)["#text"] ?? "" : v).trim();
  return s === "" ? null : s;
}

function numero(v: unknown): number | null {
  const s = texto(v);
  if (s === null) return null;
  const n = Number(s.replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

/** Mantém só dígitos e completa com zeros à esquerda. Vazio continua vazio. */
export function codigo(v: unknown, tamanho: number): string | null {
  const s = texto(v);
  if (s === null) return null;
  const d = s.replace(/\D/g, "");
  if (d === "") return null;
  return d.length >= tamanho ? d.slice(-tamanho) : d.padStart(tamanho, "0");
}

/** Procura o primeiro descendente com esse nome, em qualquer profundidade. */
function descendente(no: unknown, nome: string): any {
  if (no === null || typeof no !== "object") return undefined;
  const obj = no as No;
  if (obj[nome] !== undefined) return obj[nome];
  for (const chave of Object.keys(obj)) {
    for (const filho of lista(obj[chave])) {
      const achado = descendente(filho, nome);
      if (achado !== undefined) return achado;
    }
  }
  return undefined;
}

export interface ResultadoLeitura {
  documentos: Documento[];
  /** Chaves canceladas por evento (tpEvento 110111). */
  cancelamentos: Set<string>;
  ignorados: { arquivo: string; motivo: string }[];
}

export function lerXml(conteudo: string, arquivo: string): ResultadoLeitura {
  const vazio: ResultadoLeitura = { documentos: [], cancelamentos: new Set(), ignorados: [] };
  let raiz: No;
  try {
    raiz = parser.parse(conteudo) as No;
  } catch (e) {
    return { ...vazio, ignorados: [{ arquivo, motivo: `XML inválido: ${(e as Error).message}` }] };
  }

  // Evento de cancelamento
  const evento = descendente(raiz, "infEvento");
  if (evento && !descendente(raiz, "infNFe")) {
    const tp = texto(descendente(evento, "tpEvento"));
    const chave = texto(descendente(evento, "chNFe"));
    const cStat = texto(descendente(raiz, "cStat"));
    const aceito = cStat === null || ["135", "136", "155"].includes(cStat);
    if (tp === "110111" && chave && aceito) {
      return { ...vazio, cancelamentos: new Set([chave]) };
    }
    return { ...vazio, ignorados: [{ arquivo, motivo: `evento ${tp ?? "?"} sem efeito sobre o cálculo` }] };
  }

  const infNFe = descendente(raiz, "infNFe");
  if (!infNFe) {
    return { ...vazio, ignorados: [{ arquivo, motivo: "não é NF-e/NFC-e nem evento" }] };
  }

  const inf = lista(infNFe)[0] as No;
  const ide = (descendente(inf, "ide") ?? {}) as No;
  const emit = (descendente(inf, "emit") ?? {}) as No;
  const dest = (descendente(inf, "dest") ?? {}) as No;
  const prot = descendente(raiz, "protNFe");

  const avisos: string[] = [];
  const chaveAttr = texto(inf["@Id"])?.replace(/^NFe/i, "") ?? null;
  const chave = chaveAttr ?? texto(descendente(prot, "chNFe"));
  if (!chave) avisos.push("documento sem chave de acesso");
  if (!prot) avisos.push("XML sem protocolo de autorização");

  const tpNF = texto(ide["tpNF"]);
  const itens: ItemDocumento[] = lista(inf["det"]).map((det: No, i: number) => {
    const prod = (det["prod"] ?? {}) as No;
    const ibscbs = descendente(det["imposto"], "IBSCBS");
    const gIbsCbs = ibscbs ? descendente(ibscbs, "gIBSCBS") : undefined;
    const gIbsUF = gIbsCbs ? descendente(gIbsCbs, "gIBSUF") : undefined;
    const gIbsMun = gIbsCbs ? descendente(gIbsCbs, "gIBSMun") : undefined;
    const gCbs = gIbsCbs ? descendente(gIbsCbs, "gCBS") : undefined;
    const gRed = gIbsCbs ? descendente(gIbsCbs, "gRed") : undefined;

    return {
      nItem: Number(texto(det["@nItem"]) ?? i + 1),
      cProd: texto(prod["cProd"]) ?? "",
      xProd: texto(prod["xProd"]) ?? "",
      ncm: codigo(prod["NCM"], 8),
      cfop: codigo(prod["CFOP"], 4),
      quantidade: numero(prod["qCom"]),
      valorProduto: numero(prod["vProd"]) ?? 0,
      desconto: numero(prod["vDesc"]) ?? 0,
      baseCalculo: gIbsCbs ? numero(descendente(gIbsCbs, "vBC")) : null,
      valorIBSInformado: gIbsUF || gIbsMun ? Number(((numero(gIbsUF ? descendente(gIbsUF, "vIBS") : undefined) ?? 0) + (numero(gIbsMun ? descendente(gIbsMun, "vIBS") : undefined) ?? 0)).toFixed(2)) : null,
      valorCBSInformado: gCbs ? numero(descendente(gCbs, "vCBS")) : null,
      cst: ibscbs ? codigo(descendente(ibscbs, "CST"), 3) : null,
      cClassTrib: ibscbs ? codigo(descendente(ibscbs, "cClassTrib"), 6) : null,
      aliquotas: {
        cbs: gCbs ? numero(descendente(gCbs, "pCBS")) ?? undefined : undefined,
        ibsUF: gIbsUF ? numero(descendente(gIbsUF, "pIBSUF")) ?? undefined : undefined,
        ibsMun: gIbsMun ? numero(descendente(gIbsMun, "pIBSMun")) ?? undefined : undefined,
        reducao: gRed ? numero(descendente(gRed, "pRedAliq")) ?? undefined : undefined,
      },
    } satisfies ItemDocumento;
  });

  const documento: Documento = {
    chave,
    modelo: texto(ide["mod"]),
    numero: texto(ide["nNF"]),
    serie: texto(ide["serie"]),
    dataEmissao: texto(ide["dhEmi"]) ?? texto(ide["dEmi"]),
    tipoOperacao: tpNF === "1" ? "saida" : tpNF === "0" ? "entrada" : null,
    finalidade: texto(ide["finNFe"]),
    situacao: texto(descendente(prot, "cStat")),
    cancelado: false,
    emitente: { cnpj: texto(emit["CNPJ"]), crt: texto(emit["CRT"]), uf: texto(descendente(emit, "UF")) },
    destinatario: {
      cnpj: texto(dest["CNPJ"]),
      cpf: texto(dest["CPF"]),
      uf: texto(descendente(dest, "UF")),
      indIEDest: texto(dest["indIEDest"]),
    },
    itens,
    arquivo,
    avisos,
  };

  return { documentos: [documento], cancelamentos: new Set(), ignorados: [] };
}

export interface OpcoesSelecao {
  /** CFOPs considerados venda. Fora desta lista o documento é classificado, mas não entra no faturamento. */
  cfopsVenda?: RegExp;
}

export interface Selecao {
  documentos: Documento[];
  descartados: { documento: string; motivo: string }[];
}

/**
 * Consolida vários arquivos: aplica cancelamentos, deduplica por chave e separa
 * o que não é venda autorizada. Nada é descartado em silêncio.
 */
export function selecionarVendas(leituras: ResultadoLeitura[], opcoes: OpcoesSelecao = {}): Selecao {
  const cancelados = new Set<string>();
  for (const l of leituras) for (const c of l.cancelamentos) cancelados.add(c);

  // Vendas: grupos 5.1xx/6.1xx (venda de produção e de mercadoria) e
  // 5.4xx/6.4xx (venda com substituição tributária). As demais saídas
  // (5.9xx remessas, bonificações, brindes, amostras) ficam sinalizadas.
  const cfopsVenda = opcoes.cfopsVenda ?? /^[56][14]\d{2}$/;
  const porChave = new Map<string, Documento>();
  const descartados: { documento: string; motivo: string }[] = [];

  for (const leitura of leituras) {
    for (const ign of leitura.ignorados) descartados.push({ documento: ign.arquivo, motivo: ign.motivo });
    for (const doc of leitura.documentos) {
      const id = doc.chave ?? doc.arquivo;
      if (doc.tipoOperacao !== "saida") {
        descartados.push({ documento: id, motivo: `tpNF ${doc.tipoOperacao ?? "ausente"}: não é saída` });
        continue;
      }
      if (doc.finalidade === "4") {
        descartados.push({ documento: id, motivo: "finNFe 4: devolução" });
        continue;
      }
      if (doc.situacao && !["100", "150"].includes(doc.situacao)) {
        descartados.push({ documento: id, motivo: `cStat ${doc.situacao}: não autorizada` });
        continue;
      }
      if (doc.chave && cancelados.has(doc.chave)) {
        descartados.push({ documento: id, motivo: "cancelada por evento 110111" });
        continue;
      }
      if (doc.chave && porChave.has(doc.chave)) {
        descartados.push({ documento: id, motivo: "duplicada: mesma chave já lida" });
        continue;
      }
      // CFOP fora da faixa de venda fica registrado item a item
      for (const item of doc.itens) {
        if (item.cfop && !cfopsVenda.test(item.cfop)) {
          doc.avisos.push(`item ${item.nItem}: CFOP ${item.cfop} fora da faixa de venda`);
        }
      }
      porChave.set(doc.chave ?? `${doc.arquivo}#${porChave.size}`, doc);
    }
  }

  return { documentos: [...porChave.values()], descartados };
}


