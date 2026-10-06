"""
Gera as imagens da marca em tamanho maior para o site comercial (site/imagens/),
com o mesmo processo de scripts/gerar_marca.py (que continua gerando as do sistema).

  - coruja-negativa-grande.png: creme e dourado, para fundos verdes (hero, CTA, área do cliente);
  - coruja-positiva-grande.png: verde e dourado, para fundos claros;
  - assinatura-negativa-grande.png / assinatura-positiva-grande.png: "SABORES ESTRATÉGICOS".

Uso: python3 scripts/gerar_marca_site.py   (requer Pillow e numpy)
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import gerar_marca as marca  # noqa: E402

DESTINO = marca.RAIZ / "site" / "imagens"


def main():
    DESTINO.mkdir(parents=True, exist_ok=True)
    marca.DESTINO = DESTINO
    kv, kd = marca.tintas(marca.ORIGEM)
    marca.salvar(marca.peca(kv, kd, marca.CORUJA, 480, positiva=False), "coruja-negativa-grande.png")
    marca.salvar(marca.peca(kv, kd, marca.CORUJA, 480, positiva=True), "coruja-positiva-grande.png")
    marca.salvar(marca.peca(kv, kd, marca.ASSINATURA, 120, positiva=False), "assinatura-negativa-grande.png")
    marca.salvar(marca.peca(kv, kd, marca.ASSINATURA, 120, positiva=True), "assinatura-positiva-grande.png")


if __name__ == "__main__":
    main()
