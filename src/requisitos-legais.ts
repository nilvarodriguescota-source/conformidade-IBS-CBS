/**
 * Requisitos legais da regra × produto concreto.
 *
 * NCM localiza a regra; não basta para aplicá-la. Quando a lei descreve um
 * produto específico ("pão comumente denominado pão francês", "Pão de Forma"),
 * a regra só vale para o produto que corresponde a essa descrição.
 *
 * Esta verificação só REJEITA: quando a descrição do produto contradiz a
 * designação legal, a regra é "encontrada, mas não aplicável ao produto". Ela
 * nunca concede benefício: compatibilidade aparente continua dependendo da
 * validação humana (ou de outra confirmação já existente no sistema).
 */

const VAZIAS = new Set(["de", "do", "da", "dos", "das", "e", "ou", "em", "com", "para", "por", "a", "o", "os", "as", "um", "uma"]);
/** Palavras que não identificam o produto: descrição só com elas não contradiz nenhuma regra. */
const GENERICAS = new Set([
  "produto", "produtos", "item", "itens", "mercadoria", "mercadorias", "diversos", "diversas", "outros", "outras",
  "und", "unid", "unidade", "pct", "pacote", "cxa", "caixa", "kg", "kgs", "grs", "lt", "ltr", "litro", "especial", "tipo",
]);

/** Núcleos de designação que nomeiam categorias, não produtos. */
const CATEGORIAS = new Set(["produtos", "produto", "artigos", "preparacoes", "partes", "acessorios", "demais", "outros", "outras", "mercadorias"]);

export function termos(s: string): string[] {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !VAZIAS.has(t) && !/^\d+$/.test(t));
}

function raiz(t: string): string {
  if (t.endsWith("oes") || t.endsWith("aes")) return t.slice(0, -3) + "ao";
  if (t.endsWith("es") && t.length > 4) return t.slice(0, -2);
  if (t.endsWith("s") && t.length > 3) return t.slice(0, -1);
  return t;
}

function casa(a: string, b: string): boolean {
  const x = raiz(a);
  const y = raiz(b);
  return x === y || (y.length >= 4 && x.startsWith(y)) || (x.length >= 4 && y.startsWith(x));
}

/**
 * Designação específica do produto na lei ("pão francês"; "Pão de Forma").
 * Textos que enumeram categorias ("Frutas, produtos hortícolas e…") devolvem
 * null: a descrição comercial não tem como contradizer uma categoria ampla.
 */
export function designacaoEspecifica(descricaoLegal: string | null | undefined): string | null {
  if (!descricaoLegal) return null;
  const denominado = /comumente denominad[oa]s?\s+([^,;(]+)/i.exec(descricaoLegal);
  if (denominado) return denominado[1]!.trim();
  const trecho = descricaoLegal.split(/\s+d[oa]s?\s+c[óo]digos?\b|\s+da NCM\b|\s+classificad|\s+d[aoe]s?\s+(?:sub)?posi[çc]|\(/i)[0]!.trim();
  if (/,|;|\s(e|ou)\s/i.test(trecho)) return null;
  const t = termos(trecho);
  // Designação de categoria ("Produtos hortícolas", "Artigos…", "Preparações…") não nomeia um produto.
  if (t.length === 0 || CATEGORIAS.has(t[0]!)) return null;
  return t.length <= 3 ? trecho : null;
}

export interface RequisitoNaoAtendido {
  designacaoLegal: string;
  motivo: string;
}

/**
 * O produto atende à descrição legal específica da regra? Devolve o motivo quando
 * a descrição do produto não contém a designação legal inteira; null quando a regra
 * não exige descrição, a designação é de categoria, a descrição é genérica ou atende.
 */
/**
 * A regra exige que o produto corresponda à descrição legal (o NCM sozinho não basta)?
 *   - "comumente denominado …": a lei nomeia um produto específico dentro do código;
 *   - código residual na TIPI ("Outros"): a lei recorta uma parte de um código genérico.
 * Quando a lei cobre o produto do próprio código (TIPI "Pão de forma", "Massas alimentícias
 * recheadas"), o NCM já descreve o produto e a descrição comercial não rejeita a regra.
 */
export function exigeDescricao(descricaoLegal: string | null | undefined, descricaoNcmTipi: string | null | undefined): boolean {
  if (descricaoLegal && /comumente denominad/i.test(descricaoLegal)) return true;
  return !!descricaoNcmTipi && /^[\s-]*outr[oa]s?\b/i.test(descricaoNcmTipi);
}

export function requisitoNaoAtendido(
  produto: string,
  descricaoLegal: string | null | undefined,
  descricaoNcmTipi?: string | null,
): RequisitoNaoAtendido | null {
  if (!exigeDescricao(descricaoLegal, descricaoNcmTipi)) return null;
  const designacao = designacaoEspecifica(descricaoLegal);
  if (!designacao) return null;
  const presentes = termos(produto);
  // Descrição genérica ("PRODUTO", "ITEM 12") não identifica o produto: não há como contradizer a regra.
  if (presentes.filter((t) => !GENERICAS.has(t)).length === 0) return null;
  // A descrição do produto precisa conter a designação legal inteira: "PÃO DE QUEIJO" não é "pão francês".
  const faltam = termos(designacao).filter((t) => !presentes.some((p) => casa(t, p)));
  if (faltam.length === 0) return null;
  return {
    designacaoLegal: designacao,
    motivo: `A descrição "${produto}" não corresponde a "${designacao}", produto definido pela lei para esta regra (falta: ${faltam.join(", ")}).`,
  };
}
