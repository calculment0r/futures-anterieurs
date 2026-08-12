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
