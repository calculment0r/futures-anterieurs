# Encart à coller dans « Personnaliser » (NotebookLM)

*La case est courte : elle ne peut pas porter l'itinéraire. Son seul travail est de renvoyer à la source `CONSIGNE_EMISSION.md`, déposée dans le notebook à côté des quatre textes.*

---

## Version courte (≈ 700 signes)

```
En français. Suis la source CONSIGNE D'ÉMISSION à la lettre : c'est l'itinéraire, il prime sur ton envie de résumer.

Quatre textes, une seule traversée, dans l'ordre : Hyperstition, Fragments, Kubernân, Archibald. Les quatre stations sont obligatoires, annoncées à voix haute, jamais fondues l'une dans l'autre. Ne saute ni la lettre « Enfin dehors » ni le quatrième texte — c'est toujours celui-là qui disparaît.

Au moins une phrase lue mot pour mot par station. Ton froid, déclaratif, sans emphase : pas de « fascinant », pas de conseils à l'auditeur, pas de conclusion rassurante. Termine par le contrôle de passage : les huit questions doivent avoir trouvé réponse.
```

---

## Version très courte (≈ 300 signes), si la case refuse la précédente

```
En français. Applique la source CONSIGNE D'ÉMISSION à la lettre. Quatre stations obligatoires dans l'ordre — Hyperstition, Fragments, Kubernân (lettre « Enfin dehors » comprise), Archibald — chacune annoncée, aucune fondue dans une autre. Une citation mot pour mot par station. Ton froid, sans emphase ni conclusion rassurante.
```

---

## Ordre de dépôt des sources

1. `CONSIGNE_EMISSION.md` **en premier** — NotebookLM pondère les premières sources.
2. `1_HYPERSTION.md`
3. `2_FRAGMENTS.md`
4. `3_KUBERNAN.md`
5. `4_ARCHIBALD.md`

Les quatre textes sont dans `site/corpus/` du dépôt, et se téléchargent aussi depuis le site.

## Si une station passe encore à la trappe

Régénérer en ajoutant une ligne à l'encart, nommant le manquant :

```
La dernière version a escamoté <STATION>. Cette fois, lui consacrer un segment entier, annoncé, avec une citation mot pour mot.
```

Et si c'est systématiquement le quatrième : générer **deux émissions** — une sur les trois articles, une sur le seul transcript. Quatre sources longues dans une seule bande, c'est ce qui produit l'escamotage.
