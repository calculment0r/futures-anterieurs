#!/usr/bin/env python3
# Génère site/futures.data.js (+ vault) depuis MANUSCRIT_V6/.
# Par défaut : SRC = <repo>/MANUSCRIT_V6, DST = <repo>/site/manuscrit (repo = parent de outils/).
# Surcharge : gen_futures_data.py [SRC] [DST] — ex. pour régénérer la copie Nirvalab,
# passer DST = <clone Nirvalab>/site/futures.
import json, os, re, sys

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = sys.argv[1] if len(sys.argv) > 1 else os.path.join(REPO, "MANUSCRIT_V6")
DST = sys.argv[2] if len(sys.argv) > 2 else os.path.join(REPO, "site", "manuscrit")

def blocks(text):
    """Découpe un markdown en blocs (séparés par lignes vides), en ignorant les '---'."""
    out, cur = [], []
    for line in text.splitlines():
        if line.strip() == "" :
            if cur: out.append(" ".join(cur)); cur = []
        elif line.strip() == "---":
            if cur: out.append(" ".join(cur)); cur = []
        else:
            cur.append(line.strip())
    if cur: out.append(" ".join(cur))
    return out

def read(name):
    with open(f"{SRC}/{name}", encoding="utf-8") as f:
        return f.read()

def parse_movement(name, n):
    bs = blocks(read(name))
    m = re.match(r"^#\s+(?:([IVX]+)|Coda)\s+—\s+(.+?)\s+·\s+\*(.+?)\*\s*$", bs[0])
    if not m: sys.exit(f"En-tête non reconnu dans {name}: {bs[0][:80]}")
    roman, titre, sous_titre = m.group(1), m.group(2), m.group(3)
    exergue, intro, sections = None, [], []
    cur = None
    for b in bs[1:]:
        if b.startswith("> "):
            exergue = b[2:].strip()
        elif b.startswith("## "):
            sm = re.match(r"^##\s+([IVX]+\.\d+)\s+—\s+(.+)$", b)
            if not sm: sys.exit(f"Titre de section non reconnu dans {name}: {b[:80]}")
            num, stitre = sm.group(1), sm.group(2)
            cur = {"id": f"b-{n}-{len(sections)+1}", "num": num, "titre": stitre, "paras": []}
            sections.append(cur)
        elif cur is None:
            intro.append(b)
        else:
            cur["paras"].append(b)
    bif = {"n": n, "roman": roman, "id": f"b-{n}", "titre": titre, "sous_titre": sous_titre}
    if exergue: bif["exergue"] = exergue
    bif["intro"] = intro
    bif["sections"] = sections
    return bif

# ── prologue → meta + preface ────────────────────────────────────────────────
bs = blocks(read("00_PROLOGUE.md"))
assert bs[0] == "# Futures antérieurs", bs[0]
assert bs[1].startswith("> "), bs[1]
exergue = bs[1][2:].strip()
pm = re.match(r"^##\s+Prologue\s+—\s+(.+)$", bs[2])
preface_paras = bs[3:]

meta = {
    "title": "Futures antérieurs",
    "serie": "tétralogie · 4e bifurcation",
    "exergue": exergue,
    "here": "nous sommes ici · le seuil",
}
preface = {
    "id": "preface",
    "titre": "Prologue",
    "sous_titre": pm.group(1).lower() if pm else "la boîte du souffleur",
    "paras": preface_paras,
}

# ── mouvements ───────────────────────────────────────────────────────────────
bifs = [
    parse_movement("I_LE_PLOMB.md", 1),
    parse_movement("II_LE_RELEVEMENT_RENVERSE.md", 2),
    parse_movement("III_LA_RACINE.md", 3),
    parse_movement("IV_LA_VOLTE.md", 4),
    parse_movement("V_L_ATRE.md", 5),
]

# ── coda ─────────────────────────────────────────────────────────────────────
cbs = blocks(read("VI_CODA_LA_CHALEUR_RENDUE.md"))
cm = re.match(r"^#\s+Coda\s+—\s+(.+?)\s+·\s+\*(.+?)\*\s*$", cbs[0])
if not cm: sys.exit(f"En-tête coda non reconnu: {cbs[0][:80]}")
coda = {
    "id": "coda",
    "titre": cm.group(1),
    "sous_titre": cm.group(2),
    "paras": cbs[1:],
    "sig": "— Focus",
}

# ── pour prolonger ───────────────────────────────────────────────────────────
pbs = blocks(read("VII_POUR_PROLONGER.md"))
assert pbs[0] == "# Pour prolonger", pbs[0]
note = pbs[1].strip("*")
items = []
for b in pbs[2:]:
    # les items sont des lignes "- **Auteur**, *Œuvre* (année) — ..." ;
    # blocks() peut en coller plusieurs si non séparés par des lignes vides
    for part in re.split(r"\s(?=- \*\*)", b):
        part = part.strip()
        if part.startswith("- "): part = part[2:]
        if part: items.append(part)
prolonger = {
    "id": "prolonger",
    "titre": "Pour prolonger",
    "sous_titre": "des portes",
    "note": note,
    "items": items,
}

FUTURES = {"meta": meta, "preface": preface, "bifurcations": bifs, "coda": coda, "prolonger": prolonger}

header = (
    '/* futures.data.js — contenu de "Futures antérieurs" (4e bifurcation), version V6\n'
    "   (prologue + 5 mouvements + coda + pour prolonger). Édité en place par le god\n"
    "   mode (futures.js) ; l'original est conservé une fois dans\n"
    "   site/futures/futures.data.original.js (vault). Structure : window.FUTURES. */\n"
)
body = "window.FUTURES = " + json.dumps(FUTURES, ensure_ascii=False, indent=2) + ";\n"

with open(f"{DST}/futures.data.js", "w", encoding="utf-8") as f:
    f.write(header + body)
vault_header = header.replace("futures.data.js —", "futures.data.original.js — vault :")
with open(f"{DST}/futures.data.original.js", "w", encoding="utf-8") as f:
    f.write(vault_header + body)

# ── contrôle ─────────────────────────────────────────────────────────────────
total_words = 0
for b in bifs:
    w = sum(len(p.split()) for s in b["sections"] for p in s["paras"]) + sum(len(p.split()) for p in b["intro"])
    total_words += w
    print(f"{b['roman']:>3} {b['titre']:<25} exergue={'oui' if b.get('exergue') else 'non'} intro={len(b['intro'])} sections={len(b['sections'])} mots≈{w}")
pw = sum(len(p.split()) for p in preface_paras); cw = sum(len(p.split()) for p in coda["paras"])
total_words += pw + cw
print(f"prologue paras={len(preface_paras)} mots≈{pw} | coda paras={len(coda['paras'])} mots≈{cw} | prolonger items={len(items)}")
print(f"total mots≈{total_words}")
