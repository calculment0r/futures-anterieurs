# Parution A5, 5 pages — ce qui tient, ce qui ne tient pas

*Mesures prises dans `maquette.html`, qui ne les estime pas : elle cherche par dichotomie, à l'affichage, la plus grande taille de corps qui fait tenir le texte dans les pages, et affiche ce qu'elle a trouvé.*

## Le volume

**221 fragments · 94 395 signes.** Moyenne 427 signes, médiane 435, du plus court (81) au plus long (633).

| chapitre | fragments | signes |
|---|--:|--:|
| Exonoèse | 34 | 15 912 |
| Narcisse Technē | 19 | 8 504 |
| Fragmentations calibrées | 19 | 8 745 |
| Unititudes | 52 | 22 139 |
| Chronofossile | 22 | 7 499 |
| Still Loading | 18 | 6 809 |
| Atmotechnie | 15 | 6 064 |
| Inflammation acéphale | 32 | 14 128 |
| Hyperstition / Hyperstructure | 10 | 4 595 |

## Le cadre

A5, 148 × 210 mm. Marges 12 mm, deux colonnes, gouttière 5,5 mm. Soit **124 × 186 mm** de surface utile par page.

## Le corps trouvé

| | 4 pages de texte *(une page de tête)* | 5 pages de texte *(sans page de tête)* |
|---|--:|--:|
| **L'intégrale** — 221 fragments | **3,22 pt** | **3,65 pt** |
| **Un chapitre** — Exonoèse, 34 fragments | 7,65 pt | **8,51 pt** |
| **Un parcours** — 27 fragments, 9 chapitres | 8,53 pt | **9,21 pt** |

Repères : un livre de poche se compose autour de 9-10 pt ; une revue dense descend à 8 ; les mentions légales d'un contrat tiennent à 6 ; **sous 6 pt, on ne lit plus, on regarde**.

## Ce que ça dit

**L'intégrale ne tient pas.** 3 pt, c'est un cinquième de la surface d'un caractère lisible. Dit autrement : cinq pages A5 portent, à taille lisible, **environ un septième du livre**. La question n'est donc pas de faire rentrer les 221 fragments — elle est de choisir lequel des sept.

Cela n'interdit pas d'imprimer le bloc entier : à 3 pt il reste un **objet**, une masse grise de 94 000 signes qui dit quelque chose du corpus par sa seule densité. Mais c'est alors une image, et il faut l'assumer comme telle — avec deux ou trois fragments tirés par-dessus, à taille lisible, pour donner l'échelle.

**La page de tête coûte un cinquième de la place** et fait perdre plus d'un point de corps. Elle se défend quand même : une parution dans l'article d'un tiers a besoin de dire d'où elle vient. Un compromis tient : un bandeau de tête sur un quart de la première page de texte, plutôt qu'une page entière.

## Le parcours, et son classement

La sélection n'est pas arbitraire. Les **dix meilleurs fragments de chaque chapitre sont classés par importance**, une fois pour toutes, dans `design/corpus/fragments-rang.json` ; l'extrait prend les *n* premiers du classement et les imprime dans l'ordre des numéros. Monter le curseur ajoute toujours le meilleur de ce qui reste, jamais le suivant par hasard.

Les critères, dans cet ordre : il tient seul devant un lecteur qui ne connaît pas le corpus ; il porte la thèse du chapitre et non un de ses détails ; il a une clausule qui coupe ; il ne redouble pas un fragment mieux classé — ni dans son chapitre, ni dans un autre (le tourisme et la mode, qui riment entre *Chronofossile* et *Still Loading*, ne sont retenus qu'une fois).

| chapitre | les quatre premiers | puis |
|---|---|---|
| Exonoèse | 1 · 30 · 4 · 25 | 9, 27, 21, 2, 28, 14 |
| Narcisse Technē | 52 · 45 · 47 · 48 | 46, 37, 51, 38, 53, 50 |
| Fragmentations calibrées | 64 · 57 · 71 · 63 | 68, 65, 56, 70, 67, 72 |
| Unititudes | 100 · 82 · 86 · 98 | 87, 105, 89, 77, 111, 124 |
| Chronofossile | 130 · 125 · 134 · 141 | 143, 131, 140, 136, 127, 142 |
| Still Loading | 164 · 163 · 157 · 151 | 150, 156, 162, 161, 153, 160 |
| Atmotechnie | 170 · 175 · 171 · 167 | 173, 174, 168, 169, 177, 166 |
| Inflammation acéphale | 184 · 190 · 180 · 193 | 198, 189, 196, 195, 200, 207 |
| Hyperstition / Hyperstructure | 221 · 216 · 213 · 212 | 218, 214, 220, 219, 215, 217 |

Au-delà de dix par chapitre, le classement est épuisé : les suivants viennent dans l'ordre des numéros. *Hyperstition* n'en compte que dix en tout — le curseur y plafonne de lui-même.

## Les césures

Aucun navigateur ne garantit le dictionnaire de coupure française : là où il manque — le Chromium de cette machine, par exemple —, un texte justifié s'ouvre en rivières de blanc. La composition place donc ses points de coupe elle-même, à la règle syllabique, avant de poser le texte : voyelle, groupe de consonnes, et les groupes qui ne se séparent pas (*ch, ph, th, gn*, consonne + *l* ou *r*). Trois lettres minimum de chaque côté, rien autour d'un *x*, et pas de nom propre coupé. Le résultat est identique dans tous les navigateurs — ce qu'une maquette d'impression exige.

## Les fichiers

- **`site/composition.html` — l'établi en ligne**, troisième instrument du site. C'est la version qui vaut : elle lit le corpus et le classement à l'affichage, pose ses propres césures, justifie, accepte qu'on y dépose une police, et imprime le PDF au format réglé. C'est le lien qu'on donne à une revue : elle fait sa mise en page elle-même et sort son PDF, sans rien nous demander.
- `maquette-parametrable.html` — l'ancêtre hors ligne de la précédente, publiée aussi en artefact. Gardée pour mémoire.
- `parcours.html`, `chapitre.html`, `integrale.html` et leurs variantes `-sans-tete` — **statiques**, pré-paginés, polices embarquées. Aucun script : ils s'ouvrent partout, y compris dans un aperçu qui n'exécute rien, et s'impriment tels quels.
- `build_static.mjs` — ce qui fabrique les six fichiers statiques : il mesure dans un vrai navigateur, puis coule le résultat dans le fichier.

## Pour sortir le PDF

Ouvrir la composition, régler, imprimer — « Enregistrer au format PDF », marges « aucune », en-têtes et pieds de page décochés. Le `@page` est réécrit en clair à chaque changement de format : le PDF sort aux dimensions du cahier, marges nulles, puisque les marges sont dans la feuille. La règle de 100 mm en haut de l'écran sert à vérifier l'échelle de l'affichage ; à l'impression elle disparaît, avec l'établi et le bandeau.

Réglage de la parution LABIAL, vérifié : parcours 4 par chapitre, A5, 5 pages, bandeau de tête, marge 9, 2 colonnes, gouttière 10,5, justifié, césures, fragments insécables — **8,6 pt, 36 fragments, dernière page remplie à 100 %**.
