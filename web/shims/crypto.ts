import { Buffer } from "buffer";
import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";

export function createHash(algoritmo: string) {
  if (algoritmo.toLowerCase() !== "sha256") throw new Error(`hash não suportado no navegador: ${algoritmo}`);
  const h = sha256.create();
  const hash = {
    update(d: string | Uint8Array) {
      h.update(typeof d === "string" ? new TextEncoder().encode(d) : d);
      return hash;
    },
    digest(enc?: string) {
      const b = h.digest();
      return enc === "hex" ? bytesToHex(b) : Buffer.from(b);
    },
  };
  return hash;
}

export default { createHash };
