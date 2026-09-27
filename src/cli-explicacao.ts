/**
 * Etapa 9, Fase A: linha de comando da explicação informativa.
 *
 * Fluxo: XML -> parser -> motor atual -> explicador -> explicacoes.json -> alertas.json
 *
 * Chama o parser e o motor com as mesmas opções do cli.ts e grava SOMENTE
 * explicacoes.json e alertas.json (9B.1, derivado do explicacoes.json gravado).
 * Não grava vereditos.json, indicadores.json nem nenhum outro arquivo do fluxo
 * atual, e não altera o estado de nenhum veredito. O fluxo fica em
 * src/lote-explicativo.ts (9B.2), compartilhado com o servidor.
 *
 *   node dist/src/cli-explicacao.js --xml ./xmls --empresa ./empresa.json --saida ./saida-explicacao
 *   (opcionais: --base, --v2, --matriz)
 */
import { gerarLoteExplicativo } from "./lote-explicativo.js";

function argumento(nome: string, padrao?: string): string {
  const i = process.argv.indexOf(`--${nome}`);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1]!;
  if (padrao !== undefined) return padrao;
  throw new Error(`Informe --${nome}`);
}

function main(): void {
  const r = gerarLoteExplicativo({
    pastaXml: argumento("xml"),
    arquivoEmpresa: argumento("empresa"),
    saida: argumento("saida", "./saida-explicacao"),
    arquivoBase: argumento("base", "data/base-normativa.json"),
    arquivoV2: argumento("v2", "data/base-normativa.v2.json"),
    arquivoMatriz: argumento("matriz", "docs/etapa6/matriz-decisao.json"),
  });
  console.log(`Alertas: ${r.alertasPorItem} por item, ${r.alertasDeLote} de lote`);
  console.log(`XMLs lidos: ${r.xmls} | vereditos explicados: ${r.vereditos}`);
  console.log(`Nível de evidência: ${JSON.stringify(r.nivelEvidencia)}`);
}

main();
