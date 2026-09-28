"""
Gera as imagens da marca Sabores Estratégicos usadas na tela (web/marca/) a partir
da logo original (web/marca/origem/logo-sabores-estrategicos.png).

A logo original tem fundo transparente e o "branco" da coruja também é
transparente, com restos de halo branco nas bordas. Cada pixel é separado nas
duas tintas da marca (verde e dourado) sobre branco, por mínimos quadrados; a
cobertura de cada tinta vira a transparência. Assim o halo some e a mesma logo
sai em duas versões:
  - negativa (creme e dourado), para o cabeçalho verde;
  - positiva (verde e dourado), para impressão e PDF.

Uso: python3 scripts/gerar_marca.py   (requer Pillow e numpy)
"""
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "web" / "marca" / "origem" / "logo-sabores-estrategicos.png"
DESTINO = RAIZ / "web" / "marca"

BRANCO = np.array([255.0, 255, 255])
VERDE = np.array([44.0, 66, 51])       # #2C4233, verde da coruja
DOURADO = np.array([172.0, 147, 104])  # #AC9368, dourado dos detalhes
CREME = (244, 238, 226)                # #F4EEE2, verde da logo na versão negativa
DOURADO_ESCURO = (201, 174, 124)       # #C9AE7C, dourado sobre fundo verde

# Recortes na logo original (colunas x linhas, fim exclusivo)
CORUJA = (215, 28, 646, 535)
ASSINATURA = (20, 565, 805, 757)


def tintas(caminho):
    """Cobertura (0 a 1) do verde e do dourado em cada pixel."""
    src = np.array(Image.open(caminho).convert("RGBA")).astype(float)
    alfa = src[..., 3:4] / 255.0
    sobre_branco = src[..., :3] * alfa + 255.0 * (1 - alfa)
    m = np.stack([BRANCO - VERDE, BRANCO - DOURADO], axis=1)
    k = np.linalg.lstsq(m, (BRANCO - sobre_branco).reshape(-1, 3).T, rcond=None)[0].T
    k = np.clip(k, 0, None)
    soma = k.sum(1, keepdims=True)
    k = np.where(soma > 1, k / np.maximum(soma, 1e-9), k)
    return k[:, 0].reshape(src.shape[:2]), k[:, 1].reshape(src.shape[:2])


def reduzir(canal, caixa, altura):
    """Recorta e reduz um mapa de cobertura (a redução é feita na cobertura, não na cor)."""
    x0, y0, x1, y1 = caixa
    parte = Image.fromarray(canal[y0:y1, x0:x1].astype(np.float32))
    largura = round((x1 - x0) * altura / (y1 - y0))
    return np.array(parte.resize((largura, altura), Image.LANCZOS)).clip(0, 1)


def compor(kv, kd, cor_verde, cor_dourado):
    total = kv + kd
    # Áreas sólidas ficam sólidas e o resíduo quase transparente some (a logo de origem tem ruído de paleta)
    alfa = np.clip((total - 0.04) / 0.90, 0, 1)
    # Cada pixel é de uma tinta só, com transição curta onde as duas se encontram
    dourado = np.clip((kd / np.maximum(total, 1e-6) - 0.2) / 0.6, 0, 1)[..., None]
    cor = np.array(cor_verde, float) * (1 - dourado) + np.array(cor_dourado, float) * dourado
    rgba = np.dstack([cor, alfa * 255]).round().clip(0, 255).astype(np.uint8)
    rgba[alfa == 0] = 0
    return Image.fromarray(rgba)


def salvar(imagem, nome):
    caminho = DESTINO / nome
    # PNG com paleta (arte de duas tintas): bem menor que RGBA, sem perda visível
    imagem.quantize(colors=96, method=Image.Quantize.FASTOCTREE, dither=Image.Dither.NONE).save(caminho, optimize=True)
    print(f"{caminho.relative_to(RAIZ)}  {imagem.size[0]}x{imagem.size[1]}  {caminho.stat().st_size} bytes")


def peca(kv, kd, caixa, altura, positiva):
    cores = ((44, 66, 51), (172, 147, 104)) if positiva else (CREME, DOURADO_ESCURO)
    return compor(reduzir(kv, caixa, altura), reduzir(kd, caixa, altura), *cores)


def main():
    kv, kd = tintas(ORIGEM)

    # Cabeçalho (fundo verde): coruja e assinatura separadas, em 2x do tamanho exibido
    salvar(peca(kv, kd, CORUJA, 112, positiva=False), "coruja-negativa.png")
    salvar(peca(kv, kd, ASSINATURA, 84, positiva=False), "assinatura-negativa.png")

    # Impressão e PDF (fundo claro): coruja e assinatura lado a lado
    coruja = peca(kv, kd, CORUJA, 168, positiva=True)
    assinatura = peca(kv, kd, ASSINATURA, 92, positiva=True)
    espaco = 26
    horizontal = Image.new("RGBA", (coruja.width + espaco + assinatura.width, coruja.height), (0, 0, 0, 0))
    horizontal.alpha_composite(coruja, (0, 0))
    horizontal.alpha_composite(assinatura, (coruja.width + espaco, (coruja.height - assinatura.height) // 2 + 6))
    salvar(horizontal, "marca-positiva.png")

    # Rodapé e telas vazias (fundo claro): coruja positiva
    salvar(peca(kv, kd, CORUJA, 96, positiva=True), "coruja-positiva.png")

    # Ícone da aba do navegador: coruja negativa sobre quadrado verde de cantos arredondados
    escala = 4
    lado = 64 * escala
    fundo = Image.new("RGBA", (lado, lado), (0, 0, 0, 0))
    ImageDraw.Draw(fundo).rounded_rectangle((0, 0, lado - 1, lado - 1), radius=14 * escala, fill=(44, 66, 51, 255))
    icone = peca(kv, kd, CORUJA, 52 * escala, positiva=False)
    fundo.alpha_composite(icone, ((lado - icone.width) // 2, (lado - icone.height) // 2))
    salvar(fundo.resize((64, 64), Image.LANCZOS), "icone.png")


if __name__ == "__main__":
    main()
