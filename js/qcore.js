/* Arayış — saf mantık (DOM yok). Tarayıcıda window.QCore, Node'da module.exports. */
(function (root) {
  'use strict';
  var AX = ['K', 'D', 'G', 'Y', 'B', 'R'];
  var DAY = 24 * 60 * 60 * 1000;

  function b64e(s) {
    var b = typeof Buffer !== 'undefined' ? Buffer.from(s, 'utf8').toString('base64') : btoa(unescape(encodeURIComponent(s)));
    return b.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function b64d(c) {
    var b = String(c || '').trim().replace(/-/g, '+').replace(/_/g, '/');
    while (b.length % 4) b += '=';
    return typeof Buffer !== 'undefined' ? Buffer.from(b, 'base64').toString('utf8') : decodeURIComponent(escape(atob(b)));
  }

  /* Bir yolculuğun taşınabilir özeti. */
  function slim(run) {
    return { side: run.side, n: run.n, t: run.t, r: run.r, w: run.w || '', lt: run.lt || 0, br: run.br || [], fig: run.fig, sign: run.sign, x: run.x || {} };
  }
  function validRun(x) { return !!x && (x.side === 'a' || x.side === 'h') && typeof x.r === 'object' && x.r !== null && typeof x.t === 'number'; }
  /* q:1 = çağrı (tek yolculuk), q:2 = iki yolculuk yan yana. */
  function pack(first, second) {
    return b64e(JSON.stringify(second ? { q: 2, a: slim(first), b: slim(second) } : { q: 1, a: slim(first) }));
  }
  function unpack(code) {
    try {
      var raw = String(code || ''), i = raw.indexOf('#q=');
      var o = JSON.parse(b64d(i === -1 ? raw : raw.slice(i + 3)));
      if (!o || !validRun(o.a)) return null;
      if (o.q === 1) return { q: 1, a: o.a };
      if (o.q === 2 && validRun(o.b)) return { q: 2, a: o.a, b: o.b };
      return null;
    } catch (e) { return null; }
  }
  function expired(t, now) { return now - t > DAY; }

  /* Seçimlerden eksen vektörü. */
  function vec(run, scenes) {
    var v = [0, 0, 0, 0, 0, 0];
    Object.keys(run.r).forEach(function (id) {
      var sc = scenes[id], rec = run.r[id];
      if (!sc || sc.t !== 'pick' || !sc.o[rec.c]) return;
      var ax = sc.o[rec.c].ax;
      AX.forEach(function (k, i) { v[i] += ax[k] || 0; });
    });
    if (run.x) AX.forEach(function (k, i) { v[i] += run.x[k] || 0; });
    return v;
  }
  function cos(a, b) {
    var d = 0, na = 0, nb = 0;
    for (var i = 0; i < a.length; i++) { d += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i]; }
    return na && nb ? d / Math.sqrt(na * nb) : 0;
  }

  /* İki yolculuğun karşılaştırması. */
  function compare(A, B, scenes) {
    var same = 0, total = 0, diffs = [], both = [], ids = Object.keys(scenes);
    ids.forEach(function (id) {
      var a = A.r[id], b = B.r[id];
      if (!a || !b) return;
      if (a.f && b.f) both.push(id);
      if (scenes[id].t !== 'pick') return;
      total++;
      if (a.c === b.c) same++; else diffs.push(id);
    });
    var va = vec(A, scenes), vb = vec(B, scenes);
    var match = total ? same / total : 0;
    var sim = (cos(va, vb) + 1) / 2;
    var know = (B.r.tanima && typeof B.r.tanima.c === 'number') ? B.r.tanima.c / 3 : null;
    var pct = know === null ? 0.55 * match + 0.45 * sim : 0.5 * match + 0.4 * sim + 0.1 * know;
    var comp = [];
    AX.forEach(function (k, i) { if (va[i] * vb[i] < 0 && Math.abs(va[i]) >= 2 && Math.abs(vb[i]) >= 2) comp.push(k); });
    var ha = A.r.halay ? A.r.halay.c : null, hb = B.r.halay ? B.r.halay.c : null;
    return { pct: Math.round(pct * 100), match: match, sim: sim, know: know, diffs: diffs, both: both, comp: comp, va: va, vb: vb,
      dance: ha === null || hb === null ? null : Math.min(ha, hb), dropped: ha === null || hb === null || ha === hb ? null : (ha < hb ? 'a' : 'b') };
  }

  /* Her havuzdan, eksen vektörüne en yakın karakter. */
  function matchChars(v, list) {
    var best = {};
    list.forEach(function (c) {
      var s = cos(v, c.v);
      if (!best[c.pool] || s > best[c.pool].s) best[c.pool] = { c: c, s: s };
    });
    var out = {};
    Object.keys(best).forEach(function (p) { out[p] = best[p].c; });
    return out;
  }

  /* Remil: dört sıranın nokta sayılarından şeklin dizini. Tek = 1, çift = 2. */
  function figureOf(counts, figures) {
    var key = counts.map(function (n) { return n % 2 ? '1' : '2'; }).join('');
    for (var i = 0; i < figures.length; i++) if (figures[i][0] === key) return i;
    return -1;
  }

  /* En iyi durma: seçilen kapının değeri bütün kapılar içinde kaçıncı (1 = en iyi). */
  function rankOf(values, idx) {
    var r = 1;
    values.forEach(function (v) { if (v > values[idx]) r++; });
    return r;
  }

  /* Terazi: kazanılan, yitirilen ve (ikinci yolculuk varsa) birlikte tökezlenen. */
  function scale(run, other, scenes) {
    var won = 0, lost = 0, shared = 0;
    Object.keys(run.r).forEach(function (id) {
      if (run.r[id].f) { lost++; if (other && other.r[id] && other.r[id].f) shared++; } else won++;
    });
    return { won: won, lost: lost, shared: shared };
  }

  /* Tereddüt: seçim süreleri ve fikir değiştirme sayısı. */
  function hesitation(run) {
    var mx = 0, mxId = null, back = 0, sum = 0, n = 0;
    Object.keys(run.r).forEach(function (id) {
      var rec = run.r[id];
      if (typeof rec.ms !== 'number') return;
      n++; sum += rec.ms; back += rec.ch || 0;
      if (rec.ms > mx) { mx = rec.ms; mxId = id; }
    });
    return { longest: mx, longestId: mxId, changes: back, avg: n ? sum / n : 0 };
  }

  function validate(QD) {
    var errs = [], seen = {};
    QD.gates.forEach(function (g) {
      g.scenes.forEach(function (id) {
        if (!QD.scenes[id]) errs.push('sahne yok: ' + id);
        if (seen[id]) errs.push('sahne iki kapıda: ' + id);
        seen[id] = 1;
      });
    });
    Object.keys(QD.scenes).forEach(function (id) {
      var s = QD.scenes[id];
      if (!seen[id]) errs.push('kapısız sahne: ' + id);
      if (!s.k || !s.after) errs.push('eksik alan: ' + id);
      if (s.t === 'pick') {
        if (!s.q && !(s.qa && s.qh)) errs.push('soru yok: ' + id);
        if (s.o.length < 2) errs.push('seçenek az: ' + id);
        s.o.forEach(function (o) { Object.keys(o.ax).forEach(function (k) { if (AX.indexOf(k) === -1) errs.push('eksen: ' + id + ' ' + k); }); });
      }
      if (s.t === 'chess' && s.o.filter(function (o) { return o.ok; }).length !== 1) errs.push('satranç çözümü tek değil: ' + id);
      if (s.t === 'know') s.picks.forEach(function (p) { if (!QD.scenes[p] || QD.scenes[p].t !== 'pick') errs.push('tanıma: ' + p); });
    });
    ['a', 'h'].forEach(function (side) {
      var pools = {};
      QD.chars[side].forEach(function (c) {
        pools[c.pool] = (pools[c.pool] || 0) + 1;
        if (c.v.length !== 6 || !c.who || !c.did || !c.end) errs.push('karakter: ' + c.n);
      });
      Object.keys(QD.pools).forEach(function (p) { if ((pools[p] || 0) < 3) errs.push(side + ' tarafında ' + p + ' havuzu az'); });
    });
    var keys = {};
    QD.figures.forEach(function (f) { keys[f[0]] = 1; });
    if (Object.keys(keys).length !== 16) errs.push('remil şekilleri 16 değil');
    return errs;
  }

  var QCore = { AX: AX, DAY: DAY, pack: pack, unpack: unpack, expired: expired, vec: vec, cos: cos, compare: compare, matchChars: matchChars,
    figureOf: figureOf, rankOf: rankOf, scale: scale, hesitation: hesitation, validate: validate };
  if (typeof module !== 'undefined' && module.exports) module.exports = QCore;
  else root.QCore = QCore;
})(typeof window !== 'undefined' ? window : this);
