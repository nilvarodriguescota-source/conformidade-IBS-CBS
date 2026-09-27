import path from "path-browserify";
import { writeFileSync } from "../vfs";

export interface ArquivoRecebido { campo: string; nome: string; dados: ArrayBuffer }
type Req = { __arquivos?: ArquivoRecebido[]; files?: unknown };

let seq = 0;

export default function multer(o: { dest: string }) {
  return {
    array(campo: string, maximo = Infinity) {
      return (req: Req, _res: unknown, next: (e?: unknown) => void) => {
        const recebidos = (req.__arquivos ?? []).filter((a) => a.campo === campo);
        if (recebidos.length > maximo) return next(new Error(`Mais de ${maximo} arquivos enviados.`));
        req.files = recebidos.map((a) => {
          const destino = path.join(o.dest, `${Date.now()}-${++seq}`);
          writeFileSync(destino, new Uint8Array(a.dados));
          return { fieldname: campo, originalname: a.nome, path: destino, size: a.dados.byteLength };
        });
        next();
      };
    },
  };
}
