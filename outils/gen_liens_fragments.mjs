/* =========================================================================
   gen_liens_fragments.mjs — précalcule, pour chacun des 221 fragments, les
   deux portes qu'il ouvre : vers la carte 1 par les arcs qui l'éclairent,
   vers la carte 3 par l'unité du carnet qu'il atteint.

   C'est le travail de la propagation, figé. La page des fragments ne peut pas
   le refaire à l'affichage — il faut lire les quatre cartes et calculer une
   matrice de proximité — mais elle peut en lire le résultat.

   La table des arcs n'est PAS recopiée ici : elle est extraite du prototype de
   la propagation, qui en reste la seule source. Si un arc y change, il change
   ici au prochain passage.

     node outils/gen_liens_fragments.mjs

   Écrit design/corpus/fragments-liens.json (build_portail.py le copie ensuite
   vers site/corpus/).
   ========================================================================= */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const REPO = join(dirname(fileURLToPath(import.meta.url)), '..');
const lis = (p) => readFileSync(join(REPO, p), 'utf8');

const M = await import('file://' + join(REPO, 'site/corpus.js'));

// ── les arcs, repris du prototype de la propagation ────────────────────────
const proto = lis('design/Futures Antérieurs - la Propagation.dc.html');
const mArcs = proto.match(/const ARCS = (\[[\s\S]*?\n\];)/);
if (!mArcs) throw new Error('table des arcs introuvable dans le prototype de la propagation');
const ARCS = new Function('return ' + mArcs[1].replace(/;$/, ''))();

// ── le même découpage en unités que la propagation ─────────────────────────
const md1 = lis('design/corpus/1_HYPERSTION.md');
const md2 = lis('design/corpus/2_FRAGMENTS.md');
const md3 = lis('design/corpus/3_KUBERNAN.md');
const md4 = lis('design/corpus/4_ARCHIBALD.md');
const passages = JSON.parse(lis('design/corpus/passages.json'));
const actes = JSON.parse(lis('design/corpus/liens.json'));

const STOP = ("alors ainsi apres aucun aucune aussi autre autres avait avant avec avoir bien cela celle celles celui cent cependant ces cet cette ceux chaque chez comme comment dans depuis derriere des deux dire dont donc elle elles encore entre etaient etait etant etre eux fait faire fois font hors ici jamais jusqu leur leurs lorsque lui mais meme memes moins nous parce parmi pendant peut peuvent plus plutot pour pourquoi pouvoir prendre puis quand que quel quelle quelles quels qui quoi rien sans sera seront ses seul seule sont sous soit sur tant tous tout toute toutes trois trop vers votre vous etait ete cette leurs elle nest cest quil quelle dune dun lorsqu jusqu quon nous vous aujourd hui").split(" ");
const norm = (s) => s.toLowerCase()
  .replace(/[àâä]/g, "a").replace(/[éèêë]/g, "e").replace(/[îï]/g, "i")
  .replace(/[ôö]/g, "o").replace(/[ùûü]/g, "u").replace(/ç/g, "c")
  .replace(/[^a-z0-9\s'-]/g, " ");
const terms = (txt) => {
  const out = {};
  norm(txt).split(/[\s'’-]+/).forEach((w) => {
    if (w.length < 6 || STOP.indexOf(w) >= 0) return;
    out[w] = (out[w] || 0) + 1;
  });
  return out;
};

const U = { "1": [], "2": [], "3": [], "4": [], "L": [] };

const body1 = M.frontMatter(md1).body;
const secs = {};
body1.split(/\n## /).slice(1).forEach((b) => {
  const mn = b.split("\n")[0].match(/^(\d+)\s*—\s*(.+)$/);
  if (mn) secs["1:" + mn[1]] = b;
});
ARCS.forEach((a) => U["1"].push({
  id: a.id, code: a.code, nom: a.nom, refs: a.refs, carte: "1",
  txt: a.refs.map((r) => secs[r] || "").join(" ")
}));

M.parse2(md2).forEach((ch) => ch.frags.forEach((f) =>
  U["2"].push({ id: f.id, n: f.n, chapitre: ch.titre, chId: ch.id, txt: f.paras.join(" "), carte: "2" })));

M.parse3(md3).forEach((p) => {
  if (p.kind === "lettre") return;
  if (p.subs.length) p.subs.forEach((sb) => U["3"].push({ id: sb.id, titre: sb.titre, txt: sb.paras.join(" "), carte: "3" }));
  else U["3"].push({ id: p.id, titre: p.titre, txt: p.paras.join(" "), carte: "3" });
});

passages.forEach((p) => U["L"].push({ id: "L:" + p.id, txt: p.citL + " " + p.texte + " " + p.citF, carte: "L" }));
M.parse4(md4).turns.forEach((t) => U["4"].push({ id: t.id, txt: t.paras.join(" ") + " " + t.gris.join(" "), carte: "4" }));

// ── idf sur l'ensemble, comme dans la propagation ──────────────────────────
const all = U["1"].concat(U["2"], U["3"], U["4"], U["L"]);
const df = {};
all.forEach((u) => { u.tf = terms(u.txt); Object.keys(u.tf).forEach((w) => { df[w] = (df[w] || 0) + 1; }); });
const N = all.length;
all.forEach((u) => {
  u.vec = {}; let s = 0;
  Object.keys(u.tf).forEach((w) => {
    if (df[w] < 2 || df[w] > N * 0.35) return;
    const v = (1 + Math.log(u.tf[w])) * Math.log(N / df[w]);
    u.vec[w] = v; s += v * v;
  });
  u.nrm = Math.sqrt(s) || 1;
});
const sim = (a, b) => {
  let s = 0;
  const ka = Object.keys(a.vec), kb = Object.keys(b.vec);
  const petit = ka.length < kb.length ? ka : kb;
  const A = petit === ka ? a : b, B = petit === ka ? b : a;
  petit.forEach((w) => { if (B.vec[w]) s += A.vec[w] * B.vec[w]; });
  return s / (a.nrm * b.nrm);
};

// ── le faisceau au cran par défaut, celui qu'on lit sur la propagation ─────
const SEUIL = 8;
const t = (SEUIL - 1) / 19;
const couv = 0.95 - t * 0.35;
const R2 = 0.40 + t * 0.40, F2 = 0.16 - t * 0.12;

// 1 → 2 : quels arcs éclairent ce fragment
const arcsDe = {};
U["1"].forEach((arc) => {
  const cand = [];
  U["2"].forEach((tg) => { const v = sim(arc, tg); if (v > 0.006) cand.push({ t: tg, v }); });
  cand.sort((a, b) => b.v - a.v);
  const top = cand.length ? cand[0].v : 0;
  const n = Math.min(20, Math.max(1, Math.ceil(cand.length * F2)));
  cand.filter((r) => r.v >= top * R2).slice(0, n).forEach((r) => {
    (arcsDe[r.t.id] = arcsDe[r.t.id] || []).push({ arc, v: r.v });
  });
});

// les liens actés 2→3 passent avant le calcul, comme dans la propagation
const u3 = {}; U["3"].forEach((u) => { u3[u.id] = 1; });
const dur23 = {};
actes.forEach((a) => {
  const ca = a.de.split(".")[0], cb = a.vers;
  if (ca.charAt(0) === "2" && cb.charAt(0) === "3" && u3[cb]) dur23[ca] = { vers: cb, note: a.note };
});

// 2 → 3 : l'unité du carnet que ce fragment atteint
const b2 = U["2"].map((f) => {
  let bv = 0, bt = null;
  U["3"].forEach((u) => { const v = sim(f, u); if (v > bv) { bv = v; bt = u; } });
  return { f, v: bv, t: bt, dur: !!dur23[f.id] };
});
b2.sort((a, b) => (b.dur ? 1 : 0) - (a.dur ? 1 : 0) || b.v - a.v);
const keep2 = Math.round(b2.length * couv);

const ancre3 = (id) => "p-" + id.replace(/[:.]/g, "-");
const ancre1 = (ref) => ref.replace(":", "-");

const sortie = {};
U["2"].forEach((f) => { sortie[f.id] = { n: f.n, arcs: [], carnet: null }; });

Object.keys(arcsDe).forEach((fid) => {
  sortie[fid].arcs = arcsDe[fid].sort((a, b) => b.v - a.v).slice(0, 3).map((r) => ({
    id: r.arc.id, code: r.arc.code, nom: r.arc.nom,
    ref: r.arc.refs[0], ancre: ancre1(r.arc.refs[0])
  }));
});

let nCarnet = 0;
b2.forEach((r, i) => {
  const acte = dur23[r.f.id];
  const cible = acte ? acte.vers : (r.t ? r.t.id : null);
  if (!cible || !(acte || (i < keep2 && r.v > 0))) return;
  const u = U["3"].find((x) => x.id === cible);
  sortie[r.f.id].carnet = {
    id: cible, titre: u ? u.titre : cible, ancre: ancre3(cible),
    acte: !!acte, note: acte ? acte.note : ""
  };
  nCarnet++;
});

writeFileSync(join(REPO, 'design/corpus/fragments-liens.json'),
  JSON.stringify({
    genere_par: 'outils/gen_liens_fragments.mjs',
    faisceau: SEUIL, couverture: Math.round(couv * 100) + ' %',
    fragments: sortie
  }, null, 0) + '\n', 'utf8');

const nArcs = Object.values(sortie).filter((x) => x.arcs.length).length;
console.log(`  ${U["2"].length} fragments`);
console.log(`  ${nArcs} ouvrent une porte vers la carte 1 (${Object.values(sortie).reduce((a, x) => a + x.arcs.length, 0)} arcs au total)`);
console.log(`  ${nCarnet} atteignent une unité du carnet, carte 3`);
console.log('  → design/corpus/fragments-liens.json');
