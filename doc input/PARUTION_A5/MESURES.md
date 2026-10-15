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

## Le PDF, polices comprises

Host Grotesk est servie en police variable (axe de graisse 300–800, instance par défaut : Light). À l'impression, Chromium ne sait pas embarquer une police variable comme une vraie police : il la convertit en **Type 3**, des dessins de glyphes sans hinting ni métriques. Dans bien des lecteurs PDF, les lettres s'y épaississent et se collent — c'était le défaut du premier PDF sorti de l'établi.

La composition imprime donc avec deux instances **statiques** de Host Grotesk (400 pour le texte, 700 pour le titre), tirées de la variable par `outils/fontes_papier.py` et rangées dans `site/assets/fonts/papier/`. Le PDF en embarque des sous-ensembles TrueType, comme pour DM Mono : plus aucun Type 3, et un fichier plus léger (72 ko au lieu de 116). Une police déposée par la revue s'embarque comme son format l'autorise — une police variable déposée retombera dans le même défaut.

La mesure se fait à l'échelle de l'impression (zoom 1) et avec `text-rendering: geometricPrecision`, des avances de glyphes linéaires : la pagination mesurée à l'écran est celle du PDF, page par page — vérifié, mêmes fragments sur les mêmes pages. Le corps retenu est le plus grand qui tient, moins 0,3 % : de la marge pour les arrondis d'un autre navigateur. Imprimé, le papier est blanc ; le crème n'est que l'établi.

## Le temps de composition

La première version déplaçait les fragments un à un de feuille en feuille, en remesurant toute la mise en page à chaque déplacement : **12,6 s** pour afficher la page, 22 s à 12 fragments par chapitre, **84 s** pour l'intégrale. La mesure lit maintenant la géométrie d'un seul coup par feuille — le premier fragment dont un morceau sort à droite ouvre la feuille suivante — et la dichotomie s'arrête au vingtième de point. Mêmes résultats (l'ancienne règle, rejouée sur le nouveau résultat, confirme : ça tient au corps trouvé, ça déborde un peu au-dessus), en **0,7 s**, 0,9 s et 2,2 s. La page peint un retour pendant qu'elle calcule : une feuille fantôme au chargement, une pastille « mesure du corps · 4/10 » ensuite, et le calcul cède la main à l'écran entre deux passes — un réglage plus récent annule le précédent.

## Les fichiers

- **`site/composition.html` — l'établi en ligne**, troisième instrument du site. C'est la version qui vaut : elle lit le corpus et le classement à l'affichage, pose ses propres césures, justifie, accepte qu'on y dépose une police, et imprime le PDF au format réglé. C'est le lien qu'on donne à une revue : elle fait sa mise en page elle-même et sort son PDF, sans rien nous demander.
- `maquette-parametrable.html` — l'ancêtre hors ligne de la précédente, publiée aussi en artefact. Gardée pour mémoire.
- `labial-composition.pdf` — **le fichier à déposer**, sorti de l'établi.
- `parcours.html`, `chapitre.html`, `integrale.html` et leurs variantes `-sans-tete`, ainsi que les `labial-3-par-chapitre.pdf` et `labial-4-par-chapitre.pdf` — les maquettes d'avant l'établi : **statiques**, pré-paginées, sans script. Leurs PDF portent les polices en Type 3 et n'ont pas de signature ; à garder pour mémoire, pas pour la parution.
- `build_static.mjs` — ce qui fabrique les six fichiers statiques : il mesure dans un vrai navigateur, puis coule le résultat dans le fichier.

## Pour sortir le PDF

Ouvrir la composition, régler, imprimer — « Enregistrer au format PDF », marges « aucune », en-têtes et pieds de page décochés. Le `@page` est réécrit en clair à chaque changement de format : le PDF sort aux dimensions du cahier, marges nulles, puisque les marges sont dans la feuille. La règle de 100 mm en haut de l'écran sert à vérifier l'échelle de l'affichage ; à l'impression elle disparaît, avec l'établi et le bandeau.

Réglage de la parution LABIAL, vérifié : parcours 4 par chapitre, A5, 5 pages, bandeau de tête, signature sous le titre, marge 9, 2 colonnes, gouttière 10,5, justifié, césures, fragments insécables — **8,2 pt, 36 fragments**, dernière page remplie à 75 %.

*Correction.* Une première version annonçait 8,6 pt et « 100 % remplie ». Les deux chiffres étaient faux. Le pied de provenance — « Collectif Focus, 2026 », « Extrait de… », l'adresse — traversait les colonnes et tombait sous leur hauteur fixée : il sortait de la dernière page, coupé, sans que la mesure (qui ne regardait que la largeur) puisse le voir. Il vit maintenant sous les colonnes, dans la dernière feuille, et le corps trouvé en tient compte. Quant à « % remplie », la mesure d'alors donnait toujours 100 % ; elle lit maintenant la hauteur réellement occupée dans les colonnes de la dernière page.
