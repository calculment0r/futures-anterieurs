# HANDOFF — Futures antérieurs (reprise de session)

*À lire en premier pour reprendre le projet à froid. Le 4ᵉ et dernier article de la tétralogie de Cal. Deux choses existent déjà : un **brouillon complet du manuscrit** et une **page web de lecture/itération en ligne**. Pas d'emoji. Français. Registre du #3.*

> **ÉTAT RÉEL DES FICHIERS (à vérifier en reprise) — plusieurs versions coexistent :**
> - **`MANUSCRIT_V6\`** (racine du dossier) : version **plus récente et évoluée**, structure à **5 mouvements** (Le Plomb · Le Relèvement renversé · **La Racine** · La Volte · L'Âtre) + Prologue + Coda + « Pour prolonger ». **Probablement le canon le plus à jour du texte.** (`00_MANUSCRIT_COMPLET.md` = version assemblée.)
> - `doc input\MANUSCRIT\` : le brouillon produit dans le fil « page web » (4 mouvements : Le Plomb / Le Relèvement renversé / La Volte / L'Âtre + coda) — **antérieur au V6**.
> - `site/futures/futures.data.js` (repo Nirvalab, live) : le texte de la **page en ligne** — encore une autre copie.
> - Autres docs de pilotage récents à la racine : `AUDIT_ET_3_PROPOSITIONS.md`, `PLAN_DEVELOPPEMENT_20K.md`, `BRIEF_FUTURES_ANTERIEURS.md`.
> **Avant de toucher au texte : identifier LA version canon (probablement MANUSCRIT_V6) et réconcilier les autres.** Ce handoff décrit surtout le fil « page web » ; le V6 vient d'ailleurs.

---

## 1. Le projet en une page

- **Futures antérieurs** = 4ᵉ article, *l'article de la pratique* (« comment on est sorti »). Le plus long et le plus périlleux. Il remplit **le blanc** entre la méthode des #1-#3 et la lettre du futur : *comment* on sort, et *pourquoi* c'était possible.
- **Pari** : le deuxième principe de la thermodynamique est le vrai futur antérieur. Le simulacre a **deux métabolismes** (il se dévore ET il dévore le dehors).
- **Les 3 précédents** (tremplins, jamais réexpliqués) : #1 *Ce que personne ne veut voir* (MELT) · #2 *La Société du Simulacre* (fragments) · #3 *KUBERNÂN* (l'archipel, Focus, la lettre « sortir était possible »).

## 2. Où sont les choses

**A. La doc de travail** — `C:\NIRVALAB_TECH\FUTURES ANTERIEURS\doc input\`
- **`GENESE_CHEMINEMENT_PENSEE.md`** — le raisonnement, les impasses, les figures, la méthode. **À lire en premier.**
- `00_ARCHITECTURE_SOMMAIRE.md` + `00b_PLAN_ET_SUPERTITRES.md` — la charpente et le plan re-dérivé (super-titres, phrase choc, mini-intro, l'arc énonciatif).
- `01_STYLE_METHODE.md` · `04_GARDE_FOUS.md` (ligne rouge) · `02_CORPUS_AUTEURS.md` · `03_FIGURES.md`.
- `MATIERE_*.md` (8) : HACKING, FINANCE (agentique-finance **vérifiée**), MATERIEL_THERMO, POUVOIR_ETAT_ORBITE, REMEDE, ANECDOTES_JE, PHILO_OPERATIONS, **AGENTIQUE** (essaim/La Nuée, Ghost in the Shell).
- `BLOOM.md` — le projet BLOOM de Cal (source de vérité ; ≠ le Bloom de Tiqqun).
- `CONVERSATION CLAUDE.md` — l'historique brut du 21 juin (la source).
- `CLAUDE.md` (racine du dossier) — instructions de tête + ordre de lecture.

**B. Le manuscrit (brouillon complet)** — `doc input\MANUSCRIT\` (un fichier par mouvement)
- `00_OUVERTURE.md` · `I_LE_PLOMB.md` · `II_LE_RELEVEMENT_RENVERSE.md` · `III_LA_VOLTE.md` · `IV_L_ATRE.md` · `CODA_LA_CHALEUR_RENDUE.md`. (`doc input\MANUSCRIT.md` = index.)
- ~7 000 mots, **premier jet** au registre #3. Reste : relecture/durcissement, densification possible (matière dispo dans les `MATIERE_*`), vérif des chiffres avant de figer.

**C. La page web (EN LIGNE)** — repo Nirvalab, clone local `C:\NIRVALAB_TECH\_site\`, dossier `site\futures\`
- **En ligne : https://calculment0r.github.io/Nirvalab/futures/**
- Repo : `github.com/calculment0r/Nirvalab`. Branche par défaut **et** source GitHub Pages : **`claude/organize-tech-pipeline-ceuCI`** (build par l'Action « Deploy site to GitHub Pages »). Pas de `main`.
- Fichiers : `site/futures/index.html`, `futures.js`, `futures.data.js` (**le texte, source de vérité de la page**), `futures.data.original.js` (vault), `assets/oblivion.css` + `assets/kubernan.css` (copiés verbatim du repo `simulacre`, le vrai style de Kubernân).

## 3. État actuel

- **Manuscrit** : brouillon complet de bout en bout (I → IV + coda). À relire/durcir.
- **Page web** : **déployée et vérifiée en ligne** (200, assets OK). Autonome (style Kubernân/oblivion, serif, thème clair par défaut), **découplée du thème du site** (volontaire — l'intégration au site viendra quand le texte sera figé).
- **Décisions tranchées** : super-titres re-dérivés (Le Plomb / Le Relèvement renversé / La Volte / L'Âtre / La Chaleur rendue) ; encyclique de Léon XIV **intégrée** (recentrée sur l'aveu d'Olah « quelque chose émerge, on ne sait pas quoi ») ; « Arche » et « teilster » **abandonnés** ; agentique-finance **vérifiée** (exécution autonome déployée au retail, Kalshi, monoculture nommée par BCE/BoE) ; **BLOOM** intégré (topologie inversée, LMSS=Latour/Meillassoux/Simondon/Stiegler, défaut d'action, Ouroboros) ; **La Nuée** en charnière II.7 ; **Ghost in the Shell** (Tachikoma vs Stand Alone Complex) pour le swarm.

## 4. La page web — comment ça marche

- **Style** : `oblivion.css` + `kubernan.css` (le thème « oblivion » de Kubernân), fonts Instrument Serif + DM Mono. `body.kub` ; bascule sombre `body.theme-dark` (localStorage `futures-theme`, **clair par défaut**). Menu « la traversée » (sidebar), responsif, barre de progression.
- **God mode** (bouton `✎ god`, sans IA) : rend chaque **passage ET titre** éditable → fenêtre → *Remplacer* → *▲ sauver*.
  - Sauvegarde : **jeton GitHub fine-grained** (droit *Contents: write* sur `Nirvalab`) collé au premier save, stocké dans le navigateur (`localStorage 'nirvalab_gh_token'`). Écrit `futures.data.js` sur la **branche live** (`GH.branch` dans `futures.js` = `claude/organize-tech-pipeline-ceuCI`).
  - **Vault** : au premier save, l'original est copié une fois dans `site/futures/futures.data.original.js`. Pas d'historique (juste original + version courante).
  - Chaque save déclenche un rebuild Pages : l'édition apparaît en ligne **~1 à 3 min** après.
- **Re-déployer / modifier la page** : éditer dans `_site/site/futures/`, commit sur une branche `claude/<sujet>` (jamais push direct), PR vers `claude/organize-tech-pipeline-ceuCI`, merge → l'Action redéploie. (C'est ainsi que la page a été mise en ligne : PR #3 mergée.)

> **ATTENTION divergence texte** : dès que Cal itère en ligne (god mode), **`site/futures/futures.data.js` (sur la branche live) devient la version la plus fraîche du texte**. Les `doc input\MANUSCRIT\*.md` sont le brouillon de rédaction et peuvent alors être en retard. Pour toute reprise du texte : d'abord comparer `futures.data.js` (live) et les `MANUSCRIT\*.md`, et prendre la version live comme canon si Cal a édité.

## 5. Comment bosser (méthode de Cal — impérative)

- **Déposer les intuitions → approfondir chacune → faire émerger le plan du tout.** Ne jamais dessiner un plan trop tôt.
- **Lire les sources, jamais reconstruire de mémoire.**
- **Ton du #3** : froid, déclaratif, périodique (phrases qui montent), un cran Tiqqun ; « nous » de Focus ; l'arc **je → on → eux → je(marge) → nous** en sous-main. **Pas d'aparté, pas de « vous », ni poseur ni familier/pub.** Pas d'emoji.
- **Technique de la chute** : théorie → scène narrée en entier → conclusion qui rabat sur le sens. Figures non nommées mais identifiables.
- **Ligne rouge (III surtout)** : la figure, jamais la recette.
- **Coût/rythme** : Cal est sensible au coût et au sur-travail. Bosser en solo, direct ; pas de workflows multi-agents sauf demande explicite. Livrer, pas délibérer.

## 6. Reste à faire / ouvert

- **Texte** : relire/durcir le brouillon (Cal itère probablement en ligne via god mode). Densifier si objet-livre voulu.
- **Journal du futur** (2ᵉ forme, design fiction, registre *Le Monde/Libé*) : **pas encore construit** — le plan détaillé (rubriques + 4 focales) est dans `CONVERSATION CLAUDE.md`. À faire plus tard.
- **Intégration au site Nirvalab** : quand le texte est figé (thème, nav) — délibérément reportée.
- **Petits arbitrages** restés par défaut (révisables) : super-titre d'ouverture (« La Main » ou rien), phrase choc de coda (je vs nous).
