# Corpus des auteurs — Futurs antérieurs / La Société du Simulacre

Table de correspondance entre les 60 auteurs du corpus, les 4 articles de la série et les 7 méta-catégories qui les traversent. Destinée à être transformée en visualisation de graphe dans une session Claude Code.

Fichier de données : `corpus-auteurs.json`. Ce README documente le schéma, les conventions de lecture et les consignes de rendu.

---

## 1. Ce que contient le fichier

| Bloc | Contenu | Volume |
|---|---|---|
| `axes` | Les 7 méta-catégories, avec définition | 7 |
| `articles` | Les 4 articles, avec leur découpage en sections | 4 |
| `auteurs` | Les nœuds : identité, axes, ancrages dans les articles | 60 |
| `liens_auteurs` | Les arêtes auteur-auteur, typées et pondérées | 133 |
| `legende` | Vocabulaire contrôlé : présence, poids, types de lien | — |

Deux familles de liens coexistent, et la visualisation doit pouvoir montrer les deux séparément ou ensemble :

- **auteur → article** (171 liens) : par quel axe et à quel endroit précis du texte cet auteur entre dans le corpus. Chaque lien porte l'ancre exacte (section ou numéro de fragment).
- **auteur → auteur** (133 liens) : les filiations, oppositions et convergences entre les auteurs eux-mêmes, indépendamment de l'article où ils apparaissent. C'est ce qui relie un auteur de l'article 1 à un auteur de l'article 4.

57 auteurs sur 60 sont ancrés dans plus d'un article. Aucun nœud n'est isolé (degré minimum : 2).

---

## 2. Les 7 axes

| id | Axe | Couvre |
|---|---|---|
| A1 | Simulacre & régimes du vrai | La fiction qui devient efficace, le performatif substitué au vrai, la confabulation |
| A2 | Gouvernementalité & pilotage | Le pouvoir qui régule au lieu de commander : cybernétique, gouvernance par les nombres, alignement |
| A3 | Technique & matérialité | L'infrastructure comme forme solide du pouvoir : poids, ontologies, outils, lock-in |
| A4 | Sujet & dépossession | L'externalisation des facultés : exonoèse, prolétarisation cognitive, le Bloom |
| A5 | Temps, mémoire & histoire | Archive contre mémoire vivante, irréversibilité, futur antérieur |
| A6 | Le Réel & le Dehors | Ce qui précède le calcul : ancestralité, ordre loin de l'équilibre, flux |
| A7 | Collectif, sécession & sortie | Les deux sens de sécession, le nous, le pacte, le détournement |

Chaque auteur a un `axis` (son axe primaire, celui qui le colore) et une liste `axes` (tous ceux qu'il traverse). Répartition des axes primaires : A1 7, A2 10, A3 9, A4 9, A5 9, A6 8, A7 8.

---

## 3. Schéma

### Auteur

```json
{
  "id": "polanyi",                    // clé stable, référencée par les arêtes
  "name": "Karl Polanyi",
  "years": "1886-1964",
  "tradition": "Anthropologie économique",
  "axis": "A7",                       // axe primaire — sert à colorer le nœud
  "axes": ["A7", "A2", "A3"],         // tous les axes traversés
  "favorite": false,                  // les 9 auteurs de référence de Cal
  "presence": "explicite",            // explicite | masque | affine
  "thesis": "…",                      // une phrase : ce que l'auteur soutient
  "works": ["…"],                     // 1 à 4 œuvres pivots
  "articles": [                       // ancrages dans le corpus
    { "art": 3, "axis": "A7", "w": 5,
      "anchor": "I.2 la matrice",
      "why": "…" }                    // pourquoi cet auteur, à cet endroit
  ]
}
```

### Lien auteur-auteur

```json
{ "s": "polanyi", "t": "hayek", "type": "opposition",
  "axes": ["A2", "A7"], "w": 5,
  "note": "Contemporains et adversaires directs…" }
```

Les arêtes ne sont pas orientées au sens d'un flux, mais `s` → `t` se lit dans le sens de la filiation ou de l'antériorité (`s` précède ou influence `t`). Pour une opposition entre contemporains, l'ordre est indifférent.

### Vocabulaire contrôlé

**`presence`** — comment l'auteur apparaît dans les textes publiés :

- `explicite` (8) : nommé dans le texte. Land, Yarvin, Polanyi, Debord, Stiegler, Fisher, Bejan, Deleuze.
- `masque` (18) : présent mais désigné par périphrase — « un économiste », « un juriste », « un philosophe ». Surtout l'article 3, qui procède entièrement ainsi.
- `affine` (34) : absent du texte, pensée proche, ajouté pour la cartographie.

C'est un champ important : il porte le fait que Cal a volontairement retiré les noms pour ne pas perdre le lecteur. La viz doit rendre cette différence visible (voir §5).

**`w`** — poids, de 1 à 5. 5 signifie que l'auteur est une matrice structurelle de la section visée ; 1, une résonance ponctuelle.

**`type`** de lien : `filiation` (A est une source assumée de B) · `source` (B revendique A comme maître) · `opposition` (désaccord frontal documenté) · `reprise` (B reprend et retourne un concept de A) · `milieu` (même moment, influence réciproque) · `convergence` (même diagnostic atteint indépendamment) · `dialogue` (échange ou controverse explicite).

---

## 4. Les arêtes qui portent le plus d'information

Quelques oppositions valent plus que des dizaines de convergences : ce sont elles qui donnent une topologie plutôt qu'un nuage. À traiter comme des points d'entrée dans la lecture du graphe.

- **Stiegler ↔ Clark** — prolétarisation contre esprit étendu : la même externalisation, décrite comme perte ou comme extension.
- **Meillassoux ↔ Latour** — un monde sans nous contre un monde composé avec nous ; le réalisme spéculatif prend l'acteur-réseau pour cible.
- **Meillassoux ↔ Sloterdijk** — s'orienter sur le dehors nu contre fabriquer des sphères habitables ; la Bifurcation III laisse le désaccord ouvert.
- **Polanyi ↔ Hayek** — marché encastré contre ordre spontané ; l'article 3 les fait s'affronter à deux paliers d'écart sans jamais les nommer.
- **Ellul ↔ Simondon** — la technique comme aliénation contre la technique mal connue ; l'article 3 tranche pour Simondon en choisissant d'opérer plutôt que de refuser.
- **Land ↔ Fisher** — même unité de recherche à Warwick, mêmes textes, conclusions politiquement inverses.
- **Parfit ↔ Ricœur** — Ricœur discute Parfit nommément : la continuité psychologique ne suffit pas, il y faut la promesse.
- **Schmitt ↔ Arendt** — la décision souveraine contre l'action plurielle : l'axe de conflit qui structure l'article 1.

Nœuds les plus connectés : Latour (11), Foucault (10), Tiqqun (9), Deleuze (8), Han (7), Sloterdijk (7).

---

## 5. Consignes de rendu pour la visualisation

Ces conventions sont acquises, il n'y a pas à les rediscuter.

**Thème.** Oblivion clair, accent orange acide (électrique, pas terreux — l'équivalent clair du lime `#c9ff3c`). **Pas de bascule sombre**, pas de toggle du tout : le livrable s'ouvre en clair et reste en clair.

**Verrouillage du thème clair** — obligatoire, les livrables s'ouvrent dans un contexte iOS en mode sombre qui assombrit les fonds en gardant le texte foncé, ce qui rend la page illisible :

```html
<meta name="color-scheme" content="light only">
```
```css
:root { color-scheme: light only; }
html, body { background-color: #f0f0f3; }   /* peindre explicitement les deux */
@media (prefers-color-scheme: dark) { /* réaffirmer toute la palette ici */ }
```

**Typographie.** Instrument Serif pour le texte, DM Mono pour les libellés et les données.

**Graphe.**
- Des fils fins, pas de flèches épaisses. Deux entités reliées dans les deux sens se tracent en arcs pour ne pas se superposer.
- Le plus important est de **voir à quoi correspondent les liaisons** : au survol d'un nœud, ses relations deviennent nettement plus lisibles et s'étiquettent (le champ `note` de l'arête). Au clic, la mise en évidence se maintient.
- Quand des éléments sont mis en surbrillance, on doit voir **ce que c'est**, pas seulement des ronds colorés : une fiche par élément affichée au-dessus, avec ses informations, placée par un algorithme anti-recouvrement quand deux nœuds sont proches.
- Un clic dans le vide du canvas réaffiche tout normalement.
- Un panneau latéral se ferme en cliquant n'importe où dans la page sauf dans le panneau, et permute si on clique un autre élément.

**Zoom.** Zoom sémantique plutôt qu'un second niveau ouvert au clic : le niveau de détail change avec l'échelle. Taille des éléments et typographie constantes en espace écran.

**Encodages suggérés** (à ajuster) : couleur du nœud = axe primaire · taille = degré ou somme des poids · contour = `presence` (plein pour `explicite`, tireté pour `masque`, fin pour `affine`) · halo = `favorite` · épaisseur du fil = `w` · style du fil = `type` (continu pour filiation, pointillé pour opposition).

---

## 6. Comment le lire

Trois entrées possibles, toutes valides :

1. **Par article** — filtrer sur `articles[].art` : qui entre dans HYPERSTITION, dans FRAGMENTS, dans KUBERNÂN, dans ARCHIBALD, et par quel axe.
2. **Par axe** — filtrer sur `axis` ou `axes` : les 7 traversées complètes du corpus, chacune couvrant les 4 articles.
3. **Par auteur** — un nœud, ses ancres exactes dans les textes, et son voisinage intellectuel indépendamment des articles.

Répartition des ancrages : article 1 → 34, article 2 → 55, article 3 → 46, article 4 → 36. L'article 2 est plus dense parce qu'il compte 221 fragments et qu'il est le noyau théorique de la série.

---

*Le fleuve coule. Les berges changent. L'essai persiste.*
