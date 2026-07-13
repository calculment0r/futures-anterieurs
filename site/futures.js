/* =========================================================================
   futures.js — lecteur "Futures antérieurs" (4e bifurcation), porté du lecteur
   KUBERNÂN (manifeste.js). Rend depuis window.FUTURES.
   + thème clair/sombre (clair par défaut)
   + god mode : édition des passages ET des titres, sauvegarde sur GitHub
     par jeton collé dans le navigateur (API Contents) ; l'original est copié
     une fois dans un vault, pas d'historique de versions.
   ========================================================================= */
(function () {
  'use strict';
  const F = window.FUTURES || {};
  const BIFS = F.bifurcations || [];
  const META = F.meta || {};
  const $ = (s, r = document) => r.querySelector(s);

  // ── dépôt cible (god mode) ──────────────────────────────────────────────
  const GH = {
    owner: 'calculment0r',
    repo: 'futures-anterieurs',
    path: 'site/futures.data.js',
    vault: 'site/futures.data.original.js',
    // branche servie par GitHub Pages (live) ; surchargée par localStorage 'fa_branch'
    branch: localStorage.getItem('fa_branch') || 'main',
  };
  // clé distincte de celle de Nirvalab : les deux pages partagent l'origine github.io
  const TOK = 'futures_anterieurs_gh_token';

  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // ── concepts en couleur (léger) ─────────────────────────────────────────
  const LET = 'A-Za-zÀ-ÿ';
  const RE_CORE = new RegExp(`(^|[^${LET}])(Simulacre|Focus|Re\\.Next)(?![${LET}])`, 'g');
  const wrap = (pre, w) => `${pre}<span class="concept">${w}</span>`;
  const concepts = (t) => t.replace(RE_CORE, (m, pre, w) => wrap(pre, w));
  const md = (s) => concepts(esc(s).replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/\*([^*]+)\*/g, '<em>$1</em>'))
    .replace(/«\s/g, '«&nbsp;').replace(/\s([?!:;»])/g, '&nbsp;$1');

  // <p> éditables : chaque paragraphe porte son chemin data-edit
  const paras = (arr, base) => (arr || []).map((p, i) => `<p data-edit="${base}.${i}">${md(p)}</p>`).join('');
  const ed = (path) => `data-edit="${path}"`;
  const bifByN = (n) => BIFS.find((b) => b.n === n);
  const idxByN = (n) => BIFS.findIndex((b) => b.n === n);

  // ── get / set par chemin (ex: "bifurcations.0.sections.2.paras.1") ──────
  function getByPath(p) {
    return p.split('.').reduce((o, k) => (o == null ? o : o[k]), F);
  }
  function setByPath(p, val) {
    const ks = p.split('.'); const last = ks.pop();
    const obj = ks.reduce((o, k) => (o == null ? o : o[k]), F);
    if (obj != null) obj[last] = val;
  }

  function parseHash() {
    const h = location.hash.replace(/^#/, '');
    if (!h || h === 'seuil' || h === 'preface') return { view: 'home' };
    if (h === 'coda') return { view: 'coda' };
    if (h === 'prolonger' && F.prolonger) return { view: 'prolonger' };
    let m;
    if ((m = h.match(/^b-(\d+)(?:-(\d+|c))?$/))) {
      const n = +m[1];
      if (bifByN(n)) return { view: 'bif', n, focus: m[2] ? h : null };
    }
    return { view: 'home' };
  }
  const labelOf = (key) => {
    if (key === 'seuil' || key === 'preface') return F.preface && F.preface.titre || 'Ouverture';
    if (key === 'coda') return F.coda && F.coda.titre || 'Coda';
    if (key === 'prolonger') return F.prolonger && F.prolonger.titre || 'Pour prolonger';
    const b = bifByN(+key.split('-')[1]);
    return b ? b.titre : key;
  };

  function renderSidebar(route) {
    const isBif = route.view === 'bif';
    const pf = F.preface || {};
    const prefLi = `<li><a href="#seuil" class="${route.view === 'home' ? 'active' : ''}"><span class="num">00</span><span class="nm">${esc(pf.titre || 'Ouverture')}<small>${esc(pf.sous_titre || 'le seuil')}</small></span></a></li>`;
    const bifLis = BIFS.map((b) => {
      const active = isBif && route.n === b.n;
      let sub = '';
      if (active) {
        sub = '<ul class="subnav">' + b.sections.map((s) => `<li><a href="#${s.id}" data-sub="${s.id}"><span class="sn-num">${esc(s.num)}</span><span class="sn-nm">${esc(s.titre)}</span></a></li>`).join('') + '</ul>';
      }
      return `<li><a href="#b-${b.n}" class="${active ? 'active' : ''}" data-ch="${b.n}"><span class="num">${esc(b.roman)}</span><span class="nm">${esc(b.titre)}<small>${esc(b.sous_titre)}</small></span></a>${sub}</li>`;
    }).join('');
    const C = F.coda || {};
    const codaLi = `<li class="nav-sep"><span>la chaleur rendue</span></li><li><a href="#coda" class="coda-nav ${route.view === 'coda' ? 'active' : ''}"><span class="num">∮</span><span class="nm">${esc(C.titre || 'Coda')}<small>${esc(C.sous_titre || '')}</small></span></a></li>`;
    const proLi = F.prolonger ? `<li><a href="#prolonger" class="${route.view === 'prolonger' ? 'active' : ''}"><span class="num">▹</span><span class="nm">${esc(F.prolonger.titre)}<small>${esc(F.prolonger.sous_titre || '')}</small></span></a></li>` : '';
    $('#sidebar').innerHTML = `
      <div class="brand"><a href="#seuil"><div class="kicker">${esc(META.serie || '')}</div><div class="title">futures<br><span class="lp">antérieurs</span></div></a></div>
      <nav><div class="nav-label">La traversée</div><ul class="chapters">${prefLi}${bifLis}${codaLi}${proLi}</ul></nav>
      <div class="side-foot"><span style="color:var(--dim)">${esc(META.serie || '')}</span></div>`;
  }

  function homeHTML() {
    const p = F.preface || { paras: [] };
    return `<section class="cover">
      <div class="cover-kicker">${esc(META.serie || '')}</div>
      <h1 ${ed('meta.title')}>futures <span class="lp">antérieurs</span></h1>
      <div class="cover-exergue" ${ed('meta.exergue')}>${md(META.exergue || '')}</div>
      <p class="cover-here">${esc(META.here || 'nous sommes ici · le seuil')}</p>
      <div class="prose lead cover-preface">${paras(p.paras, 'preface.paras')}</div>
      <div class="sig">— <span class="concept">Focus</span></div>
      <a class="suite" href="#b-1"><span class="suite-k">Premier mouvement</span><span class="suite-t">${esc(BIFS[0] ? BIFS[0].titre : '')} <span class="arr">→</span></span></a>
    </section>`;
  }

  function bifHTML(b) {
    const bi = idxByN(b.n);
    const bp = `bifurcations.${bi}`;
    const sections = b.sections.map((s, si) => {
      const sp = `${bp}.sections.${si}`;
      return `<article class="entry" id="${s.id}"><div class="entry-label"><span class="sn" ${ed(sp + '.num')}>${esc(s.num)}</span> · <span ${ed(sp + '.titre')}>${esc(s.titre)}</span></div><div class="prose">${paras(s.paras, sp + '.paras')}</div></article>`;
    }).join('');
    const nextBif = bifByN(b.n + 1);
    let suite;
    if (nextBif) suite = `<a class="suite" href="#b-${nextBif.n}"><span class="suite-k">Mouvement ${esc(nextBif.roman)} · ${esc(nextBif.sous_titre)}</span><span class="suite-t">${esc(nextBif.titre)} <span class="arr">→</span></span></a>`;
    else suite = `<a class="suite" href="#coda"><span class="suite-k">La coda · ce qui aura été</span><span class="suite-t">${esc((F.coda || {}).titre || 'Coda')} <span class="arr">→</span></span></a>`;
    const prevHash = b.n === 1 ? '#seuil' : '#b-' + (b.n - 1);
    const prevKey = b.n === 1 ? 'preface' : 'b-' + (b.n - 1);
    const exergue = b.exergue ? `<div class="choc" ${ed(bp + '.exergue')}>${md(b.exergue)}</div>` : '';
    return `<header class="ch-head"><div class="label">Mouvement ${esc(b.roman)} — <span ${ed(bp + '.titre')}>${esc(b.titre)}</span></div><h1 ${ed(bp + '.titre')}>${esc(b.titre)}</h1><div class="sub" ${ed(bp + '.sous_titre')}>${esc(b.sous_titre)}</div>${exergue}</header>
      <div class="prose lead bif-intro">${paras(b.intro, bp + '.intro')}</div>${sections}${suite}
      <nav class="ch-foot"><a class="prev" href="${prevHash}"><span class="dir">← précédent</span>${esc(labelOf(prevKey))}</a></nav>`;
  }

  function codaHTML() {
    const c = F.coda || { paras: [] };
    const lastB = BIFS[BIFS.length - 1];
    const backHash = lastB ? '#b-' + lastB.n : '#seuil';
    const suite = F.prolonger ? `<a class="suite" href="#prolonger"><span class="suite-k">En fin d'ouvrage · des portes</span><span class="suite-t">${esc(F.prolonger.titre)} <span class="arr">→</span></span></a>` : '';
    return `<section class="coda">
      <a class="coda-back" href="${backHash}">← retour</a>
      <div class="coda-void" aria-hidden="true"></div>
      <article class="coda-letter"><h1 ${ed('coda.titre')}>${esc(c.titre || 'Coda')}</h1><div class="coda-sub" ${ed('coda.sous_titre')}>${esc(c.sous_titre || '')}</div><div class="prose letter-prose">${paras(c.paras, 'coda.paras')}</div><div class="coda-sig">${esc(c.sig || '— Focus')}</div></article>${suite}
      <nav class="ch-foot"><a class="prev" href="${backHash}"><span class="dir">← retour</span>${esc(lastB ? lastB.titre : '')}</a></nav>
    </section>`;
  }

  function prolongerHTML() {
    const P = F.prolonger || { items: [] };
    const items = (P.items || []).map((it, i) => `<p data-edit="prolonger.items.${i}">${md(it)}</p>`).join('');
    const note = P.note ? `<div class="prose lead bif-intro"><p data-edit="prolonger.note"><em>${md(P.note)}</em></p></div>` : '';
    return `<header class="ch-head"><div class="label">En fin d'ouvrage</div><h1 ${ed('prolonger.titre')}>${esc(P.titre || 'Pour prolonger')}</h1><div class="sub" ${ed('prolonger.sous_titre')}>${esc(P.sous_titre || '')}</div></header>
      ${note}<article class="entry"><div class="prose">${items}</div></article>
      <nav class="ch-foot"><a class="prev" href="#coda"><span class="dir">← précédent</span>${esc((F.coda || {}).titre || 'Coda')}</a></nav>`;
  }

  function viewHTML() {
    const r = parseHash();
    if (r.view === 'home') return { r, html: homeHTML() };
    if (r.view === 'coda') return { r, html: codaHTML() };
    if (r.view === 'prolonger') return { r, html: prolongerHTML() };
    return { r, html: bifHTML(bifByN(r.n)) };
  }

  let spy = null;
  function wireSpy() {
    if (spy) { spy.disconnect(); spy = null; }
    const links = [...document.querySelectorAll('.subnav a[data-sub]')];
    if (!links.length) return;
    const targets = links.map((a) => document.getElementById(a.dataset.sub)).filter(Boolean);
    const setCur = (id) => links.forEach((a) => a.classList.toggle('cur', a.dataset.sub === id));
    spy = new IntersectionObserver((entries) => {
      const vis = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      if (vis[0]) setCur(vis[0].target.id);
    }, { rootMargin: '-12% 0px -70% 0px', threshold: 0 });
    targets.forEach((t) => spy.observe(t));
  }

  function paint(scroll) {
    const { r, html } = viewHTML();
    renderSidebar(r);
    $('#content').innerHTML = html;
    document.body.classList.remove('nav-open');
    document.body.classList.toggle('coda-view', r.view === 'coda');
    wireSpy();
    if (!scroll) return;
    if (r.view === 'bif' && r.focus) { const el = document.getElementById(r.focus); if (el) { el.scrollIntoView({ block: 'start' }); return; } }
    window.scrollTo(0, 0);
  }
  const route = () => paint(true);
  const rerender = () => { const y = window.scrollY; paint(false); window.scrollTo(0, y); };

  document.addEventListener('click', (e) => {
    const a = e.target.closest('.subnav a[data-sub]');
    if (!a) return;
    const el = document.getElementById(a.dataset.sub);
    if (!el) return;
    e.preventDefault();
    document.body.classList.remove('nav-open');
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    history.replaceState(null, '', '#' + a.dataset.sub);
    document.querySelectorAll('.subnav a').forEach((x) => x.classList.toggle('cur', x === a));
  });

  window.addEventListener('hashchange', route);

  const prog = $('#prog');
  if (prog) window.addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - window.innerHeight;
    prog.style.width = total > 0 ? (window.scrollY / total) * 100 + '%' : '0%';
  }, { passive: true });

  const mb = $('#menuBtn');
  if (mb) mb.addEventListener('click', () => document.body.classList.toggle('nav-open'));

  // ── thème clair (défaut) / sombre — body.theme-dark, comme Kubernân ──────
  // L'état initial (sombre) est posé par le bootstrap dans index.html ; ici, la bascule.
  (function theme() {
    const KEY = 'futures-theme';
    const btn = $('#themeBtn');
    if (btn) btn.addEventListener('click', () => {
      const dark = document.body.classList.toggle('theme-dark');
      try { localStorage.setItem(KEY, dark ? 'dark' : 'light'); } catch (e) {}
    });
  })();

  // ── GOD MODE : édition + sauvegarde GitHub ──────────────────────────────
  const godBtn = $('#godBtn'), saveBtn = $('#saveBtn');
  const mask = $('#edMask'), edText = $('#edText'), edPath = $('#edPath'), edMsg = $('#edMsg');
  let curPath = null, dirty = false;

  function setDirty(v) { dirty = v; document.body.classList.toggle('dirty', v); }
  function msg(t, cls) { if (edMsg) { edMsg.textContent = t || ''; edMsg.className = 'ed-msg' + (cls ? ' ' + cls : ''); } }

  if (godBtn) godBtn.addEventListener('click', () => {
    const on = document.body.classList.toggle('god');
    godBtn.classList.toggle('on', on);
    if (saveBtn) saveBtn.style.display = on ? 'inline-block' : 'none';
  });

  // ouvrir l'éditeur au clic sur un élément data-edit (god mode actif)
  $('#content').addEventListener('click', (e) => {
    if (!document.body.classList.contains('god')) return;
    const el = e.target.closest('[data-edit]');
    if (!el) return;
    e.preventDefault();
    curPath = el.getAttribute('data-edit');
    edText.value = getByPath(curPath) || '';
    edPath.textContent = curPath;
    msg('');
    mask.classList.add('open');
    edText.focus();
  });

  function closeEd() { mask.classList.remove('open'); curPath = null; }
  $('#edCancel').addEventListener('click', closeEd);
  mask.addEventListener('click', (e) => { if (e.target === mask) closeEd(); });
  $('#edApply').addEventListener('click', () => {
    if (!curPath) return;
    setByPath(curPath, edText.value);
    setDirty(true);
    closeEd();
    rerender();
  });

  // sérialisation du fichier de données
  function serialize() {
    const header = '/* futures.data.js — contenu de "Futures antérieurs" (4e bifurcation).\n'
      + '   Édité en place par le god mode (futures.js) ; l\'original est conservé une fois\n'
      + '   dans ' + GH.vault + ' (vault). Structure : window.FUTURES. */\n';
    return header + 'window.FUTURES = ' + JSON.stringify(F, null, 2) + ';\n';
  }
  const b64 = (str) => btoa(unescape(encodeURIComponent(str)));
  const ghHeaders = (token) => ({ Authorization: 'Bearer ' + token, Accept: 'application/vnd.github+json', 'Content-Type': 'application/json' });
  const api = (p) => `https://api.github.com/repos/${GH.owner}/${GH.repo}/contents/${p}`;

  async function getFile(token, p) {
    const res = await fetch(api(p) + '?ref=' + encodeURIComponent(GH.branch), { headers: ghHeaders(token) });
    if (res.status === 404) return null;
    if (!res.ok) throw new Error('GET ' + p + ' → ' + res.status);
    return res.json();
  }
  async function putFile(token, p, contentStr, sha, message) {
    const body = { message, content: b64(contentStr), branch: GH.branch };
    if (sha) body.sha = sha;
    const res = await fetch(api(p), { method: 'PUT', headers: ghHeaders(token), body: JSON.stringify(body) });
    if (!res.ok) { const d = await res.json().catch(() => ({})); throw new Error('PUT ' + p + ' → ' + res.status + ' ' + (d.message || '')); }
    return res.json();
  }

  async function save() {
    let token = localStorage.getItem(TOK);
    if (!token) {
      token = (window.prompt('Jeton GitHub (fine-grained, droit "Contents: write" sur ' + GH.owner + '/' + GH.repo + ') :') || '').trim();
      if (!token) return;
      localStorage.setItem(TOK, token);
    }
    mask.classList.add('open'); edPath.textContent = GH.path + ' @ ' + GH.branch;
    edText.value = ''; edText.blur();
    msg('lecture du fichier distant…');
    try {
      const live = await getFile(token, GH.path);            // version actuelle en ligne
      // vault : copier l'original une seule fois (la version en ligne AVANT cette sauvegarde)
      const vault = await getFile(token, GH.vault);
      if (!vault && live) {
        const original = decodeURIComponent(escape(atob(live.content.replace(/\n/g, ''))));
        msg('création du vault (original)…');
        await putFile(token, GH.vault, original, null, 'vault: original futures.data.js');
      }
      msg('écriture sur GitHub…');
      await putFile(token, GH.path, serialize(), live ? live.sha : null, 'futures: édition god mode');
      setDirty(false);
      msg('sauvegardé sur ' + GH.branch + ' ✓', 'ok');
      setTimeout(closeEd, 1400);
    } catch (err) {
      msg('échec : ' + err.message + (/401|403/.test(err.message) ? ' — jeton invalide ? (efface : localStorage.removeItem("' + TOK + '"))' : ''), 'err');
    }
  }
  if (saveBtn) saveBtn.addEventListener('click', save);

  function boot() {
    if (!BIFS.length) { $('#content').innerHTML = '<p style="color:var(--red)">Données absentes : futures.data.js introuvable.</p>'; return; }
    route();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', boot);
  else boot();
})();
