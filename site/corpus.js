// Analyse des MD clean du corpus. Les textes ne sont jamais réécrits :
// ils sont lus tels quels et découpés selon la grammaire d'adressage (ÉTUDE §3).

export async function load(path) {
  const r = await fetch(path, { cache: "no-cache" });
  if (!r.ok) throw new Error("corpus introuvable : " + path);
  return await r.text();
}

export function frontMatter(md) {
  const m = md.match(/^---\n([\s\S]*?)\n---\n/);
  if (!m) return { meta: {}, body: md };
  const meta = {};
  m[1].split("\n").forEach((l) => {
    const i = l.indexOf(":");
    if (i < 0) return;
    let v = l.slice(i + 1).trim();
    if (v.charAt(0) === '"' && v.slice(-1) === '"') v = v.slice(1, -1);
    meta[l.slice(0, i).trim()] = v;
  });
  return { meta: meta, body: md.slice(m[0].length) };
}

const isNoise = (l) => !l.trim() || l.indexOf("<!--") === 0 || l.indexOf("-->") === 0 || l.trim() === "---";

// ── carte 2 : 221 fragments, 9 chapitres ──
export function parse2(md) {
  const body = frontMatter(md).body;
  const lines = body.split("\n");
  const chapters = [];
  let ch = null, frag = null, inComment = false;
  lines.forEach((raw) => {
    const l = raw.trim();
    if (l.indexOf("<!--") === 0) { inComment = l.indexOf("-->") < 0; return; }
    if (inComment) { if (l.indexOf("-->") >= 0) inComment = false; return; }
    let m = l.match(/^## Chapitre (\d+)\s*—\s*(.+?)\s*·\s*(.+?)\s*·\s*\((.+?)\)\s*$/);
    if (m) {
      ch = { id: "2:ch" + m[1], num: +m[1], titre: m[2].trim(), cat: m[3].trim(), plage: m[4].trim(), logline: "", frags: [] };
      chapters.push(ch); frag = null; return;
    }
    m = l.match(/^### Fragment (\d+)\s*$/);
    if (m && ch) { frag = { id: "2:§" + m[1], n: +m[1], paras: [] }; ch.frags.push(frag); return; }
    if (l.indexOf("> ") === 0 && ch && !frag) { ch.logline += (ch.logline ? " " : "") + l.slice(2).trim(); return; }
    if (isNoise(l) || l.charAt(0) === "#") return;
    if (frag) frag.paras.push(l);
  });
  return chapters;
}

// ── carte 3 : préface, 4 bifurcations, le seuil, la lettre ──
const ROMAN = { I: "I", II: "II", III: "III", IV: "IV" };
export function parse3(md) {
  const body = frontMatter(md).body;
  const blocks = body.split(/\n---\n/);
  const parts = [];
  blocks.forEach((b) => {
    const lines = b.split("\n");
    const head = lines.filter((l) => l.trim())[0] || "";
    if (head.indexOf("## Sommaire") === 0 || head.indexOf("# KUBERN") === 0) return;

    let kind = null, id = null, titre = "", sous = "";
    let m = head.match(/^## Préface/);
    if (m) { kind = "pref"; id = "3:pref"; titre = "Préface"; }
    if (!kind) {
      m = head.match(/^## Bifurcation (I|II|III|IV)\s*—\s*(.+)$/);
      if (m) { kind = "bif"; id = "3:" + ROMAN[m[1]]; titre = m[2].trim(); }
    }
    if (!kind && head.indexOf("## Enfin dehors") === 0) { kind = "lettre"; id = "3:lettre"; titre = "Enfin dehors"; }
    if (!kind && head.charAt(0) !== "#") { kind = "seuil"; id = "3:seuil"; titre = "Le seuil"; }
    if (!kind) return;

    const part = { kind: kind, id: id, titre: titre, sous: "", paras: [], subs: [] };
    let sub = null, first = true;
    lines.forEach((raw) => {
      const l = raw.trim();
      if (!l) return;
      if (first && l.charAt(0) === "#") { first = false; return; }
      first = false;
      if (l.charAt(0) === "*" && l.slice(-1) === "*" && !part.sous && !part.paras.length && !sub) {
        part.sous = l.replace(/^\*+|\*+$/g, ""); return;
      }
      const ms = l.match(/^### (.+)$/);
      if (ms) {
        const t = ms[1].trim();
        const mn = t.match(/^(I|II|III|IV)\.(\d+)\s*—\s*(.+)$/);
        sub = mn
          ? { id: "3:" + mn[1] + "." + mn[2], titre: mn[3].trim(), paras: [] }
          : { id: id + ".concl", titre: t, paras: [] };
        part.subs.push(sub); return;
      }
      if (isNoise(l) || l.charAt(0) === "#") return;
      (sub ? sub.paras : part.paras).push(l);
    });
    parts.push(part);
  });
  return parts;
}

// ── carte 4 : le fil, la couche grise, les collages ──
export function parse4(md) {
  const body = frontMatter(md).body;
  const lines = body.split("\n");
  const seuil = [];
  const coda = [];
  const turns = [];
  let zone = "seuil", turn = null, quote = null, inComment = false;

  const flushQuote = () => {
    if (!turn || !quote) { quote = null; return; }
    if (quote.kind === "gris") turn.gris = quote.paras;
    else turn.collages.push({ label: quote.label, paras: quote.paras });
    quote = null;
  };

  lines.forEach((raw) => {
    const l = raw.trim();
    if (l.indexOf("<!--") === 0) { inComment = l.indexOf("-->") < 0; return; }
    if (inComment) { if (l.indexOf("-->") >= 0) inComment = false; return; }
    if (l.indexOf("## Le fil") === 0) { zone = "fil"; return; }
    if (l.indexOf("## Seuil") === 0) { zone = "seuil"; return; }
    // la coda ferme le fil : on quitte le dernier tour, plus rien ne s'y range
    if (l.indexOf("## Ce qui reste") === 0) { flushQuote(); zone = "coda"; turn = null; return; }

    const mh = l.match(/^### (4:[HA]\d+)\s*—\s*(Cal|Arche)\s*·\s*(.+)$/);
    if (mh) {
      flushQuote();
      turn = { id: mh[1], who: mh[2] === "Cal" ? "cal" : "arche", time: mh[3].trim(), gris: [], collages: [], paras: [], notes: [], tools: "" };
      turns.push(turn); return;
    }

    if (l.indexOf(">") === 0) {
      const inner = l.replace(/^>\s?/, "");
      const mg = inner.match(/^\*\*(gris|collage)\s*—\s*(.+?)\*\*$/);
      if (mg) { flushQuote(); quote = { kind: mg[1], label: mg[2].trim(), paras: [] }; return; }
      if (!inner) return;
      if (quote) quote.paras.push(inner);
      return;
    }
    if (quote && l) flushQuote();

    if (isNoise(l) || l.charAt(0) === "#") return;

    if (l.charAt(0) === "*" && l.slice(-1) === "*") {
      const t = l.replace(/^\*+|\*+$/g, "").trim();
      if (zone === "coda") { coda.push(t); return; }
      if (!turn) return;
      if (t.indexOf("— Arche agit sur les fichiers") === 0) turn.tools = t.replace(/^—\s*/, "");
      else turn.notes.push(t);
      return;
    }
    if (zone === "seuil") seuil.push(l);
    else if (zone === "coda") coda.push(l);
    else if (turn) turn.paras.push(l);
  });
  flushQuote();
  return { seuil: seuil, coda: coda, turns: turns };
}
