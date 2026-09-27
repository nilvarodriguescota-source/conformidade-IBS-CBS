import { unzipSync } from "fflate";
import path from "path-browserify";
import { mkdirSync, readFileSync, writeFileSync } from "../vfs";

/** Só o `unzip -qq -o <zip> -d <destino>` que o processador usa para ZIPs dentro da pasta de XMLs. */
export function execFileSync(comando: string, args: string[]): void {
  if (comando !== "unzip") throw new Error(`comando indisponível no navegador: ${comando}`);
  const d = args.indexOf("-d");
  const destino = args[d + 1]!;
  const zip = args.find((a, i) => !a.startsWith("-") && i !== d + 1)!;
  const entradas = unzipSync(readFileSync(zip) as Uint8Array);
  for (const [nome, dados] of Object.entries(entradas)) {
    if (nome.endsWith("/")) continue;
    const alvo = path.join(destino, path.normalize("/" + nome));
    mkdirSync(path.dirname(alvo), { recursive: true });
    writeFileSync(alvo, dados);
  }
}

export default { execFileSync };
