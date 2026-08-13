#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
build_portail.py — convertit les prototypes Claude Design (.dc.html) du projet
« Site portfolio articles Incredibles » en pages statiques servables, dans site/.

Ce que fait la conversion, et rien d'autre :
  - <helmet> …            → le vrai <head> de la page
  - le corps de <x-dc>    → <template id="dc-template">, monté par dc-lite.js
  - <script data-dc-script> → un module inline qui appelle DC.mount(Component)
  - support.js            → dc-lite.js (le runtime de preview exige React et
                            parle en postMessage à une fenêtre parente : il ne
                            se met pas en ligne)
  - les liens « ./Futures Antérieurs - X.dc.html » → des noms de fichiers courts

LA COUPE (demande de Cal) : on ne garde que les quatre cartes et la propagation.
Les écrans « les Passages » et « les Instruments » ne sont pas convertis, et
toute référence à eux est retirée — y compris la section « la grammaire
d'adressage » de la Porte, et les entrées de nav correspondantes.
Le fichier de données passages.json, lui, RESTE : ce n'est pas l'écran, c'est
la colonne « la lettre » dont la propagation a besoin pour calculer.

Usage :  python3 outils/build_portail.py <dossier_du_projet_design> [--site site]
"""

import argparse
import pathlib
import re
import shutil
import sys

# ── les écrans qu'on garde, et leur nom de fichier une fois en ligne ─────────
GARDES = {
    "Futures Antérieurs - la Porte.dc.html": "index.html",
    "Futures Antérieurs - Carte 1.dc.html": "carte-1.html",
    "Futures Antérieurs - Carte 2.dc.html": "carte-2.html",
    "Futures Antérieurs - Carte 3.dc.html": "carte-3.html",
    "Futures Antérieurs - Carte 4.dc.html": "carte-4.html",
    "Futures Antérieurs - la Propagation.dc.html": "propagation.html",
}

# ── les écrans qu'on vire : tout lien vers eux disparaît avec son élément ────
VIRES = ["les Passages", "les Instruments"]

CORPUS = [
    "1_HYPERSTION.md", "2_FRAGMENTS.md", "3_KUBERNAN.md", "4_ARCHIBALD.md",
    "liens.json", "passages.json", "concepts.json", "evenements.json",
    "auteurs.json",
    "fragments-liens.json",
]

PROPS = {"index.html": "{ scrollLisse: true }"}


def extraire(src: str, fichier: str):
    """Sépare le prototype en (helmet, gabarit, logique)."""
    m = re.search(r"<x-dc>([\s\S]*)</x-dc>", src)
    if not m:
        sys.exit(f"{fichier} : pas de bloc <x-dc>")
    corps = m.group(1)

    mh = re.search(r"<helmet>([\s\S]*?)</helmet>", corps)
    if not mh:
        sys.exit(f"{fichier} : pas de bloc <helmet>")
    helmet = mh.group(1).strip()
    gabarit = (corps[:mh.start()] + corps[mh.end():]).strip()

    ms = re.search(r'<script[^>]*data-dc-script[^>]*>([\s\S]*?)</script>', src)
    if not ms:
        sys.exit(f"{fichier} : pas de bloc data-dc-script")
    return helmet, gabarit, ms.group(1).strip()


def couper(html: str, fichier: str) -> str:
    """Retire les écrans virés et tout ce qui y mène."""
    # Le colophon des cartes 2 à 4 est une paire de boutons dont le second
    # menait aux instruments. On ne le supprime pas — on le rebranche sur la
    # propagation : la forme du colophon est conservée, et le seul autre écran
    # qu'on garde redevient atteignable depuis un article.
    html = re.sub(
        r'(<a href=")\./Futures Antérieurs - les Instruments\.dc\.html("[^>]*>)Les instruments(\s*<span>→</span></a>)',
        r'\1./Futures Antérieurs - la Propagation.dc.html\2La propagation\3',
        html)

    for vire in VIRES:
        # l'ancre entière part avec son libellé, jamais un href orphelin
        motif = r'<a\s+href="\./Futures Antérieurs - ' + re.escape(vire) + \
                r'\.dc\.html[^"]*"[\s\S]*?</a>\s*'
        html = re.sub(motif, "", html)

    if fichier == "Futures Antérieurs - la Porte.dc.html":
        # « la grammaire d'adressage » : la section et son entrée de nav
        html = re.sub(r'<section id="adresses"[\s\S]*?</section>\s*', "", html)
        html = re.sub(r'<a href="#adresses"[\s\S]*?</a>\s*', "", html)
        # la nav ne compte plus que deux entrées : ne pas masquer la dernière
        html = html.replace(
            "  @media(max-width:520px){\n    header nav a:last-child{display:none;}\n  }\n", "")
        # plus aucune section #adresses à révéler en bas de page
        html = re.sub(r'#manifeste,#adresses\{', "#manifeste{", html)

    reste = re.findall(r'(?:Passages|Instruments)\.dc\.html', html)
    if reste:
        sys.exit(f"{fichier} : {len(reste)} référence(s) aux écrans virés ont survécu")
    return html


def relier(html: str) -> str:
    """Les liens entre écrans deviennent des noms de fichiers servables."""
    for proto, sortie in GARDES.items():
        html = html.replace("./" + proto, sortie)
    return html


# Google Fonts sort : « CDN tiers » figure dans la liste de ce qu'on ne fera
# pas, et le pied de page de la Porte annonce des polices auto-hébergées à la
# mise en ligne. Les .woff2 vivent dans site/assets/fonts/ (voir fonts.css).
RE_GFONTS = re.compile(
    r'\s*<link[^>]*(?:fonts\.googleapis\.com|fonts\.gstatic\.com)[^>]*/?>', re.I)


def polices(head: str) -> str:
    head = RE_GFONTS.sub("", head)
    return '<link rel="stylesheet" href="assets/fonts.css">\n' + head.lstrip("\n")


# La pastille de l'en-tête de la Porte, en favicon : inline, donc aucun fichier
# à servir et aucune requête tierce — et plus de 404 sur /favicon.ico.
FAVICON = (
    '<link rel="icon" href="data:image/svg+xml,'
    "%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E"
    "%3Crect width='32' height='32' fill='%23f7f5ef'/%3E"
    "%3Ccircle cx='16' cy='16' r='7' fill='%231a1a1f'/%3E%3C/svg%3E\">"
)


def page(fichier: str, sortie: str, src: str) -> str:
    helmet, gabarit, logique = extraire(src, fichier)
    helmet = polices(relier(couper(helmet, fichier)))
    gabarit = relier(couper(gabarit, fichier))
    props = PROPS.get(sortie, "{}")

    return f"""<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
{FAVICON}
{helmet}
</head>
<body>
<noscript><p style="font-family:'DM Mono',monospace;font-size:13px;line-height:1.8;padding:40px 30px;">Cette page lit le corpus à l'affichage — les textes ne sont pas recopiés dans le HTML, ils sont lus depuis <code>corpus/</code>. Il lui faut JavaScript. Les sources brutes restent lisibles telles quelles dans le dépôt.</p></noscript>

<!-- Le gabarit de l'écran, tel que composé dans Claude Design. dc-lite.js le
     compile et le monte : rien n'est rendu deux fois, rien ne clignote. -->
<template id="dc-template">
{gabarit}
</template>

<script src="assets/dc-lite.js"></script>
<script type="module">
{logique}
DC.mount(Component, {props});
</script>
</body>
</html>
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("projet", help="dossier project/ du bundle Claude Design")
    ap.add_argument("--site", default="site", help="dossier de sortie (défaut : site)")
    a = ap.parse_args()

    projet = pathlib.Path(a.projet)
    site = pathlib.Path(a.site)
    site.mkdir(parents=True, exist_ok=True)
    (site / "corpus").mkdir(exist_ok=True)

    for proto, sortie in GARDES.items():
        chemin = projet / proto
        if not chemin.exists():
            sys.exit(f"introuvable : {chemin}")
        (site / sortie).write_text(
            page(proto, sortie, chemin.read_text(encoding="utf-8")), encoding="utf-8")
        print(f"  {proto}  →  {sortie}")

    shutil.copy2(projet / "corpus.js", site / "corpus.js")
    print("  corpus.js")
    for nom in CORPUS:
        src = projet / "corpus" / nom
        if not src.exists():
            print(f"  ⚠ corpus/{nom} absent du bundle", file=sys.stderr)
            continue
        shutil.copy2(src, site / "corpus" / nom)
        print(f"  corpus/{nom}")


if __name__ == "__main__":
    main()
