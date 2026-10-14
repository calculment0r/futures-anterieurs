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

## Le parcours

La sélection n'est pas arbitraire : ce sont, chapitre par chapitre, les **trois fragments les mieux reliés au reste du corpus** selon le calcul de la propagation — ceux que les arcs de la carte 1 éclairent le plus et qui atteignent une unité du carnet. Le lecteur reçoit la forme des neuf chapitres, pas un échantillon au hasard.

## Les fichiers

- `maquette-parametrable.html` — la maquette qui recalcule : format, pages, marges, colonnes, corps, interligne, choix de l'extrait. Publiée aussi en artefact. Elle a besoin de JavaScript.
- `parcours.html`, `chapitre.html`, `integrale.html` et leurs variantes `-sans-tete` — **statiques**, pré-paginés, polices embarquées. Aucun script : ils s'ouvrent partout, y compris dans un aperçu qui n'exécute rien, et s'impriment tels quels.
- `build_static.mjs` — ce qui fabrique les six fichiers statiques : il mesure dans un vrai navigateur, puis coule le résultat dans le fichier.

## Pour sortir le PDF

Ouvrir `maquette.html`, choisir la variante, imprimer en PDF. Le `@page` est réglé sur 148 × 210 mm, marges nulles — les marges sont dans la maquette. La règle de 100 mm en haut de l'écran sert à vérifier l'échelle de l'affichage ; à l'impression elle disparaît.
