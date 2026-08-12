# `design/` — les prototypes Claude Design, archivés

Les huit écrans du projet Claude Design **« Site portfolio articles Incredibles »**,
tels qu'exportés par le bundle de passation. Ce sont les **sources** du site : on
ne les sert pas, on les convertit.

```
python3 outils/build_portail.py design --site site
```

## Ce qui est publié, ce qui ne l'est pas

| Écran | Sort en | Publié |
|---|---|---|
| `la Porte` | `site/index.html` | oui |
| `Carte 1` — Hyperstition | `site/carte-1.html` | oui |
| `Carte 2` — Fragments | `site/carte-2.html` | oui |
| `Carte 3` — Kubernân, où sortir ? | `site/carte-3.html` | oui |
| `Carte 4` — Archibald is back | `site/carte-4.html` | oui |
| `la Propagation` | `site/propagation.html` | oui |
| `les Passages` | — | **non** |
| `les Instruments` | — | **non** |

On ne garde que les quatre cartes et la propagation. « Les passages », « les
instruments » et la section « la grammaire d'adressage » de la Porte sont
retirés du site — mais leurs prototypes restent ici, pour qu'un changement
d'avis ne coûte qu'une ligne dans `GARDES`.

**À ne pas confondre :** l'écran « les Passages » disparaît ; le fichier de
données `corpus/passages.json` reste, et doit rester. Ce n'est pas l'écran,
c'est la colonne « la lettre » — ses dix portes — dont la propagation a besoin
pour calculer les généalogies.

## Pourquoi une conversion, et pas une copie

Les `.dc.html` chargent `support.js`, le runtime de preview de Claude Design.
Il exige `window.React` et `window.ReactDOM` (qu'il ne fournit pas), parle en
`postMessage` à une fenêtre parente, et se recharge à chaud en refetchant
`location.href`. C'est un outil d'atelier : il ne se met pas en ligne.

`site/assets/dc-lite.js` le remplace — il réimplémente la seule surface que les
gabarits utilisent réellement (`{{ }}`, `<sc-for>`, `<sc-if>`, `style-hover`,
`onClick`), avec la même sémantique. Les gabarits passent donc **tels quels** :
ce qu'on lit ici est ce qui est servi, au wrapper près.

`support.js` n'est pas archivé : c'est du code généré, non servi, et sans lui
les `.dc.html` restent lisibles — ils se prévisualisent dans Claude Design.

---

## Une page qui ne vient pas de Claude Design

`site/auteurs.html` est écrite à la main dans le dépôt : elle n'a pas de
prototype ici, et `build_portail.py` ne la régénère pas — elle EST sa propre
source. Le générateur ne la touche jamais ; relancer la conversion ne l'efface
pas.

Ses données, en revanche, suivent le même chemin que le reste :
`design/corpus/auteurs.json` (60 auteurs, 133 liens auteur-auteur, 7 axes)
est copié vers `site/corpus/` par le build. Le schéma est documenté dans
`design/corpus/README-auteurs.md`.

Elle reprend le système de la page NECTAR « théorie politique », à la lettre :
les auteurs dérivent, et un lien n'existe que si deux d'entre eux sont assez
proches — il se noue, se tend, se défait quand ils s'éloignent. Rien ne
s'éteint jamais : tenir un auteur ne met pas le reste de la carte en veille,
sinon le geste central perd son objet. Ce geste, c'est de prendre un auteur et
de le promener au milieu des autres pour voir ce qui s'allume sur son passage. La peau, elle,
est celle du site : papier `#f7f5ef`, Host Grotesk et DM Mono, une couleur par
axe. Le §5 du README des auteurs prescrivait un thème Oblivion ; Cal a tranché
pour la DA du site.
