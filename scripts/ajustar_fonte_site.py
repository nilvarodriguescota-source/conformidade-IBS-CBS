"""
Gera as fontes Cormorant Garamond do site comercial (site/fontes/) a partir das do
@fontsource, com um único ajuste: o circunflexo (â ê ô Â Ê Ô) fica mais baixo.

No desenho original da Cormorant o circunflexo é muito alto e estreito; em títulos
grandes em português ("você", "Pendências") ele parece solto da letra. O ajuste
reduz a altura só do contorno do acento, mantendo a base dele no lugar. O resto da
fonte não muda. A fonte do sistema (public/vendor) continua a original.

Uso: pip install fonttools brotli && python3 scripts/ajustar_fonte_site.py
(precisa de node_modules instalado). Licença da fonte: SIL Open Font License 1.1.
"""
from pathlib import Path

from fontTools.ttLib import TTFont

RAIZ = Path(__file__).resolve().parent.parent
ORIGEM = RAIZ / "node_modules" / "@fontsource" / "cormorant-garamond" / "files"
DESTINO = RAIZ / "site" / "fontes"
PESOS = ["500-normal", "600-normal", "700-normal", "500-italic", "600-italic"]
GLIFOS = ["acircumflex", "ecircumflex", "icircumflex", "ocircumflex", "ucircumflex",
          "Acircumflex", "Ecircumflex", "Icircumflex", "Ocircumflex", "Ucircumflex", "circumflex"]
ESCALA = 0.62  # altura final do acento em relação à original


def contornos(glifo, tabela):
    coords, fins, _ = glifo.getCoordinates(tabela)
    inicio = 0
    for fim in fins:
        yield range(inicio, fim + 1), coords
        inicio = fim + 1


def ajustar(fonte):
    glyf = fonte["glyf"]
    altura_x = fonte["OS/2"].sxHeight
    altura_caixa = fonte["OS/2"].sCapHeight
    ajustados = 0
    for nome in GLIFOS:
        if nome not in glyf:
            continue
        glifo = glyf[nome]
        if glifo.isComposite():
            continue
        limite = (altura_caixa if nome[0].isupper() else altura_x) + 30
        if nome == "circumflex":
            limite = altura_x + 30
        for indices, coords in contornos(glifo, glyf):
            ys = [coords[i][1] for i in indices]
            base = min(ys)
            if base < limite:
                continue  # contorno da letra, não do acento
            for i in indices:
                x, y = coords[i]
                coords[i] = (x, round(base + (y - base) * ESCALA))
        glifo.recalcBounds(glyf)
        ajustados += 1
    return ajustados


def main():
    DESTINO.mkdir(parents=True, exist_ok=True)
    for peso in PESOS:
        nome = f"cormorant-garamond-latin-{peso}.woff2"
        fonte = TTFont(ORIGEM / nome)
        n = ajustar(fonte)
        fonte.flavor = "woff2"
        fonte.save(DESTINO / nome)
        print(f"site/fontes/{nome}: {n} glifos ajustados")


if __name__ == "__main__":
    main()
