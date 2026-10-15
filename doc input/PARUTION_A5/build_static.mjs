/* Fabrique la maquette en HTML statique : plus une ligne de script dans le
   fichier final. La pagination et la taille du corps sont calculées ici, au
   moment de la fabrication, par un vrai navigateur ; le résultat est coulé
   dans le fichier. Les polices sont embarquées. Le fichier marche partout,
   y compris dans un aperçu qui n'exécute rien. */
import { readFileSync, writeFileSync } from 'node:fs';
import pkg from '/opt/node22/lib/node_modules/playwright/index.js';
const { chromium } = pkg;

const REPO = '/home/user/futures-anterieurs';
const SORTIE = REPO + '/doc input/PARUTION_A5';
const M = await import('file://' + REPO + '/site/corpus.js');
const ch = M.parse2(readFileSync(REPO + '/site/corpus/2_FRAGMENTS.md', 'utf8'));
const L = JSON.parse(readFileSync(REPO + '/site/corpus/fragments-liens.json', 'utf8'));

// ── les polices, en dur dans le fichier ────────────────────────────────────
const b64 = (f) => readFileSync(REPO + '/site/assets/fonts/' + f).toString('base64');
const POLICES = `
@font-face{font-family:'Host Grotesk';font-style:normal;font-weight:300 800;
  src:url(data:font/woff2;base64,${b64('HostGrotesk-co3BmWBnlCJ3U42vbbfdwMjZpFjm.woff2')}) format('woff2');}
@font-face{font-family:'DM Mono';font-style:normal;font-weight:400;
  src:url(data:font/woff2;base64,${b64('DMMono-aFTU7PB1QTsUX8KYthqQBA.woff2')}) format('woff2');}`;

// ── le texte ───────────────────────────────────────────────────────────────
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const frags = [];
ch.forEach((c) => c.frags.forEach((f) => frags.push({
  n: f.n, ch: c.titre, txt: f.paras.join(' '),
  score: ((L.fragments[f.id] || {}).arcs || []).length * 2 + ((L.fragments[f.id] || {}).carnet ? 1 : 0)
})));
const parcours = [];
ch.forEach((c) => {
  const l = c.frags.map((f) => frags.find((x) => x.n === f.n));
  l.sort((a, b) => b.score - a.score || a.txt.length - b.txt.length);
  l.slice(0, 3).sort((a, b) => a.n - b.n).forEach((x) => parcours.push(x));
});

const V = [
  { id: 'parcours', nom: 'Un parcours', n: 27,
    sous: 'trois fragments par chapitre, les mieux reliés au reste du corpus', l: parcours, chap: true },
  { id: 'chapitre', nom: 'Un chapitre', n: 34,
    sous: 'Exonoèse, en entier', l: frags.filter((f) => f.ch === ch[0].titre), chap: false },
  { id: 'integrale', nom: 'L’intégrale', n: 221,
    sous: 'les 221 fragments, neuf chapitres', l: frags, chap: true },
];
const bloc = (l, avecChap) => {
  let d = null, o = '';
  l.forEach((f) => {
    if (avecChap && f.ch !== d) { o += `<h2>${esc(f.ch)}</h2>`; d = f.ch; }
    o += `<p><b>#${f.n}</b> ${esc(f.txt)}</p>`;
  });
  return o;
};
const sig = (l) => l.reduce((a, f) => a + f.txt.length, 0);

// ── la feuille de style, partagée par la mesure et la sortie ──────────────
const CSS = `
  :root{--papier:#f7f5ef;--encre:#1a1a1f;--gris:#6a6a76;--rouge:#c4283a;--marge:12mm;}
  *{box-sizing:border-box;margin:0;padding:0;}
  .sheet{width:148mm;height:210mm;background:var(--papier);color:var(--encre);
    padding:var(--marge);position:relative;overflow:hidden;
    font-family:'Host Grotesk',system-ui,sans-serif;}
  .sheet::after{content:attr(data-folio);position:absolute;left:0;right:0;bottom:5mm;
    text-align:center;font-family:'DM Mono',monospace;font-size:6.5pt;color:var(--gris);
    letter-spacing:.18em;}
  .flot{height:100%;column-count:2;column-gap:5.5mm;column-fill:auto;
    font-size:var(--corps);line-height:var(--inter);hyphens:auto;text-wrap:pretty;}
  .flot p{margin:0 0 var(--saut);break-inside:avoid-column;}
  .flot b{font-family:'DM Mono',monospace;font-weight:400;color:var(--rouge);
    font-size:.92em;letter-spacing:.02em;}
  .flot h2{font-family:'DM Mono',monospace;font-weight:400;font-size:.88em;
    letter-spacing:.14em;text-transform:uppercase;color:var(--gris);
    margin:calc(var(--saut)*2.2) 0 var(--saut);break-after:avoid-column;
    border-top:.3pt solid #c9c4b0;padding-top:calc(var(--saut)*.9);}
  .flot h2:first-child{margin-top:0;border-top:none;padding-top:0;}
  .tete{height:100%;display:flex;flex-direction:column;}
  .sur{font-family:'DM Mono',monospace;font-size:7pt;letter-spacing:.2em;
    text-transform:uppercase;color:var(--gris);}
  .tete h1{font-size:34pt;line-height:.9;letter-spacing:-.03em;font-weight:700;
    text-transform:uppercase;margin-top:auto;}
  .sst{font-size:13pt;line-height:1.25;color:#4a4a55;margin-top:3mm;}
  .chapo{font-size:8.6pt;line-height:1.5;color:#4a4a55;margin-top:7mm;max-width:88mm;}
  .prov{margin-top:auto;padding-top:5mm;border-top:.3pt solid #c9c4b0;
    display:flex;flex-direction:column;gap:1.2mm;
    font-family:'DM Mono',monospace;font-size:6.6pt;letter-spacing:.08em;color:var(--gris);}`;

const tete = (v) => `<div class="sheet" data-folio="1 / 5"><div class="tete">
  <div class="sur">Futures antérieurs · deuxième bifurcation</div>
  <h1>Fragments</h1><div class="sst">La société du simulacre</div>
  <p class="chapo">${v.sous.charAt(0).toUpperCase() + v.sous.slice(1)}. Extrait de <i>Fragments</i>, deuxième des quatre bifurcations de <i>Futures antérieurs</i> — le corpus entier se lit et se télécharge en ligne.</p>
  <div class="prov"><span>Nicolas — collectif Focus, 2026</span>
    <span>221 fragments, neuf chapitres</span>
    <span>calculment0r.github.io/futures-anterieurs</span></div></div></div>`;

// ── la mesure ──────────────────────────────────────────────────────────────
const nav = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const page = await (await nav.newContext({ viewport: { width: 700, height: 900 } })).newPage();

async function composer(v, nPages) {
  await page.setContent(`<!DOCTYPE html><html><head><meta charset="utf-8"><style>${POLICES}${CSS}
    body{background:#fff;}</style></head><body>
    ${Array.from({ length: nPages }, (_, i) => `<div class="sheet"><div class="flot">${i === 0 ? bloc(v.l, v.chap) : ''}</div></div>`).join('')}
    </body></html>`);
  await page.evaluate(() => document.fonts.ready);
  return page.evaluate(() => {
    const zones = [...document.querySelectorAll('.flot')];
    const source = zones[0].innerHTML;
    const tient = (pt) => {
      document.documentElement.style.setProperty('--corps', pt.toFixed(2) + 'pt');
      document.documentElement.style.setProperty('--inter', (pt < 6 ? 1.22 : 1.38).toString());
      document.documentElement.style.setProperty('--saut', (pt * 0.42).toFixed(2) + 'pt');
      zones[0].innerHTML = source;
      zones.slice(1).forEach((z) => (z.innerHTML = ''));
      for (let z = 0; z < zones.length; z++) {
        const cur = zones[z];
        if (cur.scrollWidth <= cur.clientWidth + 1) continue;
        if (z === zones.length - 1) return false;
        const s = zones[z + 1];
        let g = 0;
        while (cur.scrollWidth > cur.clientWidth + 1 && cur.lastElementChild && g++ < 5000)
          s.insertBefore(cur.lastElementChild, s.firstChild);
        while (cur.lastElementChild && cur.lastElementChild.tagName === 'H2')
          s.insertBefore(cur.lastElementChild, s.firstChild);
      }
      return true;
    };
    let lo = 2.4, hi = 13, best = null;
    for (let i = 0; i < 15; i++) {
      const mid = (lo + hi) / 2;
      if (tient(mid)) { best = mid; lo = mid; } else hi = mid;
    }
    tient(best);
    return { pt: best, pages: zones.map((z) => z.innerHTML) };
  });
}

const resultats = {};
for (const v of V) {
  resultats[v.id] = { avec: await composer(v, 4), sans: await composer(v, 5) };
  console.log(`  ${v.nom.padEnd(13)} ${String(v.n).padStart(3)} frag · ${String(sig(v.l)).padStart(6)} sg · ` +
    `avec tête ${resultats[v.id].avec.pt.toFixed(2)} pt · sans ${resultats[v.id].sans.pt.toFixed(2)} pt`);
}
await nav.close();

// ── la sortie statique ─────────────────────────────────────────────────────
const feuilles = (v, r, avecTete) =>
  (avecTete ? tete(v) : '') +
  r.pages.map((h, i) => `<div class="sheet" data-folio="${i + (avecTete ? 2 : 1)} / 5"><div class="flot">${h}</div></div>`).join('\n');

function fichier(v, avecTete) {
  const r = avecTete ? resultats[v.id].avec : resultats[v.id].sans;
  const verdict = r.pt >= 8.5 ? 'confortable' : r.pt >= 7 ? 'serré mais lisible'
    : r.pt >= 6 ? 'à la limite du lisible' : 'illisible — une texture, plus un texte';
  return `<!DOCTYPE html><html lang="fr"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Fragments — ${v.nom}${avecTete ? '' : ', sans page de tête'} — A5</title>
<style>${POLICES}${CSS}
  @page{size:148mm 210mm;margin:0;}
  body{background:#55555e;padding:22px 12px 60px;
    font-family:'DM Mono',monospace;}
  .sheet{margin:0 auto 14px;box-shadow:0 10px 30px rgba(0,0,0,.34);}
  .ours{max-width:148mm;margin:0 auto 18px;color:#e8e8f0;font-size:11px;
    line-height:1.8;letter-spacing:.06em;}
  .ours em{font-style:normal;color:#ffd9a0;}
  @media print{body{background:none;padding:0;}.ours{display:none;}
    .sheet{margin:0;box-shadow:none;break-after:page;}
    .sheet:last-child{break-after:auto;}}
  :root{--corps:${r.pt.toFixed(2)}pt;--inter:${r.pt < 6 ? 1.22 : 1.38};--saut:${(r.pt * 0.42).toFixed(2)}pt;}
</style></head><body>
<div class="ours">${v.nom} — ${v.n} fragments, ${sig(v.l).toLocaleString('fr-FR')} signes<br>
A5 148×210 mm · ${avecTete ? '1 page de tête + 4 de texte' : '5 pages de texte'} ·
corps <em>${r.pt.toFixed(1)} pt</em> — ${verdict}<br>
Imprimer en PDF : le format est déjà réglé, marges nulles.</div>
${feuilles(v, r, avecTete)}
</body></html>`;
}

const faits = [];
for (const v of V) for (const avec of [true, false]) {
  const nom = `${v.id}${avec ? '' : '-sans-tete'}.html`;
  writeFileSync(`${SORTIE}/${nom}`, fichier(v, avec), 'utf8');
  faits.push(nom);
}
console.log('\n' + faits.join('\n'));
