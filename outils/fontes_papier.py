#!/usr/bin/env python3
"""
Fabrique les instances statiques de Host Grotesk que la composition imprime.

Pourquoi : Host Grotesk est servie en police variable (axe wght 300–800, instance
par défaut : Light). À l'écran, aucun souci. Mais à l'impression, Chromium ne sait
pas embarquer une police variable comme une vraie police : il la convertit en
Type 3, des dessins de glyphes sans hinting ni métriques — et dans bien des
lecteurs PDF, les lettres s'épaississent et se collent. Une instance statique
s'embarque en TrueType, comme DM Mono.

Ce qu'on tire, pour chacun des deux sous-ensembles (latin, latin-ext) :
  400 — le texte des fragments, le sous-titre, le chapô
  700 — le titre

Dépendances (absentes du dépôt, utiles seulement pour refaire les fichiers) :
    pip install fonttools brotli

Usage :
    python3 outils/fontes_papier.py
Les fichiers sortent dans site/assets/fonts/papier/ et sont versionnés.
"""
import sys
from pathlib import Path

from fontTools.ttLib import TTFont
from fontTools.varLib import instancer

RACINE = Path(__file__).resolve().parent.parent
FONTES = RACINE / "site" / "assets" / "fonts"
SORTIE = FONTES / "papier"

# les fichiers variables, tels que fonts.css les déclare (style normal)
SOURCES = {
    "latin": "HostGrotesk-co3BmWBnlCJ3U42vbbfdwMjZpFjm.woff2",
    "latin-ext": "HostGrotesk-co3BmWBnlCJ3U42vbbfdwMjZqljm0U0.woff2",
}
POIDS = {400: ("Regular", False), 700: ("Bold", True)}
FAMILLE = "Host Grotesk Papier"


def nommer(police: TTFont, poids: int) -> None:
    """Réécrit la table des noms : la police n'est plus « Light ». Le nom
    PostScript est ce que le PDF affichera dans ses propriétés de polices."""
    style, gras = POIDS[poids]
    ps = f"HostGrotesk-{style}"
    noms = police["name"]
    for rec in list(noms.names):
        if rec.nameID in (16, 17, 21, 22, 25):  # familles typographiques : on les retire
            noms.removeNames(nameID=rec.nameID)
    for plat, enc, lang in ((3, 1, 0x409), (1, 0, 0)):
        noms.setName(FAMILLE, 1, plat, enc, lang)
        noms.setName(style, 2, plat, enc, lang)
        noms.setName(f"{FAMILLE} {style}", 4, plat, enc, lang)
        noms.setName(ps, 6, plat, enc, lang)
        noms.setName(f"{ps};papier", 3, plat, enc, lang)
    os2 = police["OS/2"]
    os2.usWeightClass = poids
    # fsSelection : bit 0 italique, bit 5 gras, bit 6 régulier
    os2.fsSelection = (os2.fsSelection & ~0b1100001) | (0b100000 if gras else 0b1000000)
    police["head"].macStyle = 0b1 if gras else 0


def main() -> int:
    SORTIE.mkdir(parents=True, exist_ok=True)
    for sous_ens, source in SOURCES.items():
        chemin = FONTES / source
        if not chemin.exists():
            print(f"  ⚠ {source} absent", file=sys.stderr)
            return 1
        for poids in POIDS:
            police = TTFont(chemin)
            statique = instancer.instantiateVariableFont(
                police, {"wght": poids}, inplace=False, updateFontNames=False
            )
            nommer(statique, poids)
            statique.flavor = "woff2"
            sortie = SORTIE / f"HostGrotesk-{poids}-{sous_ens}.woff2"
            statique.save(sortie)
            t = TTFont(sortie)
            assert "fvar" not in t and "gvar" not in t, "il reste de la variation"
            print(f"  {sortie.name:36} {sortie.stat().st_size:6} o · "
                  f"{len(t.getGlyphOrder())} glyphes · {t['name'].getDebugName(6)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
