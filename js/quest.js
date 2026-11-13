/* Arayış — arayüz. İçerik js/qdata.js, mantık js/qcore.js. Hiçbir veri bir sunucuya gönderilmez. */
(function () {
  'use strict';
  var KEY = 'otuzkus.quest.v1';
  var app = document.getElementById('app');
  var QC = window.QCore, QD = window.QD;
  var Q = null;       // süren yolculuk
  var OTHER = null;   // çağrıyı yapanın yolculuğu (ikinci oyuncuysak)
  var ep = 0;         // ekran sayacı: eski zamanlayıcıları geçersiz kılar
  var FAST = function () { return !!window.__qfast; };
  var SIDE = { a: 'Âdem', h: 'Havva' };

  /* ---------- yardımcılar ---------- */
  function esc(s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function $(s) { return app.querySelector(s); }
  function $$(s) { return Array.prototype.slice.call(app.querySelectorAll(s)); }
  function save() { try { localStorage.setItem(KEY, JSON.stringify({ Q: Q, OTHER: OTHER })); } catch (e) { /* yoksay */ } }
  function load() { try { var o = JSON.parse(localStorage.getItem(KEY)); return o && o.Q ? o : null; } catch (e) { return null; } }
  function clear() { try { localStorage.removeItem(KEY); } catch (e) { /* yoksay */ } }
  function paint(html, hue) {
    ep++;
    document.body.classList.add('q');
    document.body.setAttribute('data-hue', hue || 'night');
    document.getElementById('bar').hidden = true;
    app.innerHTML = html;
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
    return ep;
  }
  function leave() { document.body.classList.remove('q'); document.body.removeAttribute('data-hue'); window.OtuzKus.home(); }
  function copy(text, el) {
    function ok() { el.textContent = 'Kopyalandı.'; }
    function no() { el.textContent = 'Kopyalanamadı; elle seçip kopyala.'; }
    try { navigator.clipboard.writeText(text).then(ok, no); } catch (e) { no(); }
  }

  /* Ses: dosya yok, tarayıcının ürettiği kısa tonlar. Varsayılan kapalı. */
  var actx = null, soundOn = false;
  function tone(f, d, type) {
    if (!soundOn) return;
    try {
      actx = actx || new (window.AudioContext || window.webkitAudioContext)();
      var o = actx.createOscillator(), g = actx.createGain();
      o.type = type || 'sine'; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, actx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.12, actx.currentTime + 0.01);
      g.gain.exponentialRampToValueAtTime(0.0001, actx.currentTime + d);
      o.connect(g); g.connect(actx.destination); o.start(); o.stop(actx.currentTime + d + 0.02);
    } catch (e) { /* ses yoksa sessiz devam */ }
  }

  /* Geometrik gül: her kapının kendi yıldızı. n köşeli, iç içe iki yıldız çokgeni. */
  function rosette(n, size) {
    var c = size / 2, out = '';
    [[c * 0.92, 2], [c * 0.62, 3], [c * 0.34, 2]].forEach(function (ring) {
      var pts = [];
      for (var i = 0; i < n; i++) {
        var a = (Math.PI * 2 * i) / n - Math.PI / 2;
        pts.push([(c + ring[0] * Math.cos(a)).toFixed(1), (c + ring[0] * Math.sin(a)).toFixed(1)]);
      }
      var d = '';
      for (var k = 0; k < n; k++) { var p = pts[(k * ring[1]) % n]; d += (k ? 'L' : 'M') + p[0] + ' ' + p[1]; }
      out += '<path d="' + d + 'Z"/>';
      if (ring[1] === 3 && n % 3 === 0) for (var s = 1; s < 3; s++) {
        d = '';
        for (var m = 0; m < n / 3; m++) { var q = pts[(s + m * 3) % n]; d += (m ? 'L' : 'M') + q[0] + ' ' + q[1]; }
        out += '<path d="' + d + 'Z"/>';
      }
    });
    return '<svg class="rose" viewBox="0 0 ' + size + ' ' + size + '" aria-hidden="true"><g fill="none" stroke="currentColor" stroke-width="1">' + out +
      '<circle cx="' + c + '" cy="' + c + '" r="' + (c * 0.96).toFixed(1) + '"/></g></svg>';
  }
  function gateRose(gi) { return rosette([8, 10, 12, 6, 16, 9, 12, 14, 8, 10, 7, 12][gi % 12], 400); }

  function track(gi) {
    var visible = QD.gates.filter(function (g) { return !g.second || OTHER; });
    return '<ol class="track" aria-label="Kapılar">' + visible.map(function (g) {
      var i = QD.gates.indexOf(g);
      return '<li class="' + (i < gi ? 'done' : i === gi ? 'now' : '') + '"><span>' + esc(g.name) + '</span></li>';
    }).join('') + '</ol>';
  }

  /* Yazı, daktilo gibi belirir; dokununca tamamlanır. */
  function typeIn(el, text, my) {
    var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce || FAST()) { el.textContent = text; return; }
    var i = 0;
    function step() {
      if (ep !== my || !el.isConnected) return;
      i = Math.min(text.length, i + 2);
      el.textContent = text.slice(0, i);
      if (i < text.length) setTimeout(step, 22);
    }
    el.addEventListener('click', function () { i = text.length; el.textContent = text; });
    step();
  }

  /* ---------- giriş ---------- */
  function home() {
    var sv = load();
    paint('<section class="q-hero">' + rosette(12, 400) +
      '<h1>Arayış</h1>' +
      '<p class="q-lead">İki kişi aynı bahçeden düşer ve ayrı yerlere varır. Kapılardan tek tek geçer, aynı seçimleri birbirinden habersiz yaparsın. Sonunda ikinizin yolu yan yana açılır.</p>' +
      '<div class="q-actions">' +
      (sv && !sv.Q.done ? '<button class="q-btn" id="go">Kaldığın kapıdan sürdür</button>' : '') +
      '<button class="q-btn' + (sv && !sv.Q.done ? ' ghost' : '') + '" id="new">Yola çık</button>' +
      '<button class="q-btn ghost" id="code">Bir çağrıya karşılık ver</button>' +
      (sv && sv.Q.done ? '<button class="q-btn ghost" id="last">Son yolculuğun terazisi</button>' : '') +
      '</div>' +
      '<p class="q-fine">Yanıtların yalnızca bu tarayıcıda ve paylaştığın kodun içinde durur; hiçbir sunucuya gitmez. <button class="q-link" id="snd">Ses: kapalı</button> <button class="q-link" id="back">Otuz Kuş\'a dön</button></p></section>', 'night');
    if ($('#go')) $('#go').onclick = function () { Q = sv.Q; OTHER = sv.OTHER; gateIntro(Q.gi, true); };
    if ($('#last')) $('#last').onclick = function () { Q = sv.Q; OTHER = sv.OTHER; judgement(); };
    $('#new').onclick = function () { OTHER = null; setup(); };
    $('#code').onclick = codeEntry;
    $('#back').onclick = leave;
    $('#snd').onclick = function () { soundOn = !soundOn; this.textContent = 'Ses: ' + (soundOn ? 'açık' : 'kapalı'); tone(440, 0.2); };
  }

  function codeEntry(pre) {
    paint('<section class="q-col"><h2>Bir çağrıya karşılık ver</h2>' +
      '<p>Sana gönderilen kodu ya da bağlantıyı yapıştır. Çağrı kodu seni aynı kapılara götürür; iki kişilik kod doğrudan teraziyi açar.</p>' +
      '<textarea id="cd" spellcheck="false" aria-label="Kod">' + esc(typeof pre === 'string' ? pre : '') + '</textarea><p class="q-err" id="er"></p>' +
      '<div class="q-actions row"><button class="q-btn" id="ok">Aç</button><button class="q-btn ghost" id="bk">Geri</button></div></section>', 'night');
    $('#bk').onclick = home;
    $('#ok').onclick = function () {
      var o = QC.unpack($('#cd').value);
      if (!o) { $('#er').textContent = 'Bu kod okunamadı. Eksik kopyalanmış olabilir.'; return; }
      if (o.q === 2) return judgement(o.a, o.b, true);
      if (QC.expired(o.a.t, Date.now())) { $('#er').textContent = 'Bu çağrının vakti geçmiş. Çağrılar bir gün yaşar; ondan yeni bir kod iste.'; return; }
      OTHER = o.a; setup();
    };
    if (typeof pre === 'string' && pre) $('#ok').click();
  }

  function setup() {
    var side = OTHER ? (OTHER.side === 'a' ? 'h' : 'a') : null;
    paint('<section class="q-col"><h2>' + (OTHER ? esc(OTHER.n) + ' seni çağırdı' : 'Hangi yandan düşüyorsun?') + '</h2>' +
      (OTHER ? '<p>O, ' + SIDE[OTHER.side] + ' tarafından yürüdü ve yolunu bitirdi. Sen de aynı kapılardan geçeceksin; ne seçtiğini sonda göreceksin.</p>' : '<p>Tarafın, sonunda hangi karakterlerle eşleşeceğini belirler. Kapılar ve sorular iki taraf için aynıdır; birkaç yerde aynı şeyi başka türlü duyarsınız.</p>') +
      '<div class="q-sides"><button class="q-side" data-s="a"><b>Âdem</b><span>Erkek karakterlerle eşleşir</span></button>' +
      '<button class="q-side" data-s="h"><b>Havva</b><span>Kadın karakterlerle eşleşir</span></button></div>' +
      '<label for="nm">Adın</label><input id="nm" type="text" maxlength="18" placeholder="Terazide görünecek">' +
      '<div class="q-actions row"><button class="q-btn" id="ok" disabled>Bahçeye gir</button><button class="q-btn ghost" id="bk">Geri</button></div></section>', 'night');
    function pick(s) { side = s; $$('.q-side').forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-s') === s); }); $('#ok').disabled = false; }
    $$('.q-side').forEach(function (b) { b.onclick = function () { pick(b.getAttribute('data-s')); tone(330, 0.15); }; });
    if (side) pick(side);
    $('#bk').onclick = home;
    $('#ok').onclick = function () {
      Q = { side: side, n: $('#nm').value.trim() || SIDE[side], t: Date.now(), gi: 0, si: 0, r: {}, x: {}, w: '', lt: 0, br: [], sec: false, done: false };
      save(); door(0);
    };
  }

  /* ---------- kapı ---------- */
  function door(gi) {
    var g = QD.gates[gi];
    if (!g) return finish();
    if (g.second && !OTHER) return lockedGate(gi);
    Q.gi = gi; Q.si = 0; save();
    var my = paint('<section class="q-door" id="dr"><div class="leaf l">' + gateRose(gi) + '</div><div class="leaf r">' + gateRose(gi) + '</div>' +
      '<div class="q-door-t"><h2>' + esc(g.name) + '</h2>' + (g.sub ? '<p>' + esc(g.sub) + '</p>' : '') + '</div></section>', g.hue);
    tone(196, 0.5, 'triangle');
    setTimeout(function () { if (ep === my) $('#dr').classList.add('open'); }, FAST() ? 0 : 700);
    setTimeout(function () { if (ep === my) gateIntro(gi); }, FAST() ? 0 : 1900);
    $('#dr').onclick = function () { if (ep === my) gateIntro(gi); };
  }

  function lockedGate(gi) {
    var g = QD.gates[gi];
    paint(track(gi) + '<section class="q-col q-locked">' + gateRose(gi) + '<h2>' + esc(g.name) + '</h2>' +
      '<p>Bu kapı kapalı. Yalnızca, senden önce buradan geçmiş birini tanıyorsan açılır. Tek başına yürüyen için kilidi yok; arkasında ne olduğunu da buradan göremezsin.</p>' +
      '<div class="q-actions row"><button class="q-btn" id="ok">Yanından geç</button></div></section>', g.hue);
    $('#ok').onclick = function () { door(gi + 1); };
  }

  function gateIntro(gi, resume) {
    var g = QD.gates[gi];
    if (!g.intro.length) return scene(gi, resume ? Q.si : 0);
    paint(track(gi) + '<section class="q-col"><div class="q-bg">' + gateRose(gi) + '</div><h2>' + esc(g.name) + '</h2>' +
      g.intro.map(function (p) { return '<p class="q-story">' + esc(p) + '</p>'; }).join('') +
      '<div class="q-actions row"><button class="q-btn" id="ok">' + (resume && Q.si ? 'Kaldığın yerden' : 'Kapıdan gir') + '</button>' +
      (gi < QD.gates.length - 2 ? '<button class="q-link q-break" id="br" title="Bu kapıyı kaybedersin">kuralı çiğne</button>' : '') + '</div></section>', g.hue);
    $('#ok').onclick = function () { scene(gi, resume ? Q.si : 0); };
    if ($('#br')) $('#br').onclick = function () {
      Q.br.push(gi); Q.sec = true; Q.lt = Math.max(0, Q.lt - 3); save(); tone(110, 0.4, 'sawtooth');
      paint(track(gi) + '<section class="q-col"><h2>Kapıyı çiğnedin</h2><p class="q-story">Kapı arkandan kapandı; içinde ne olduğunu bu yolculukta öğrenemeyeceksin. Üç ışık yitirdin.</p>' +
        '<p class="q-story">Ama bir şey oldu: ilerideki duvarda, az önce orada olmayan dar bir aralık görüyorsun.</p>' +
        '<div class="q-actions row"><button class="q-btn" id="ok">Yürü</button></div></section>', g.hue);
      $('#ok').onclick = function () { door(gi + 1); };
    };
  }

  function scene(gi, si) {
    var g = QD.gates[gi];
    if (Q.sec && si === 0) { Q.sec = false; save(); return runScene(gi, -1, 'gz' + gi, QD.secrets[gi % QD.secrets.length]); }
    if (si >= g.scenes.length) return door(gi + 1);
    Q.si = si; save();
    runScene(gi, si, g.scenes[si], QD.scenes[g.scenes[si]]);
  }

  function runScene(gi, si, id, sc) {
    var g = QD.gates[gi];
    var t0 = Date.now();
    function done(rec, extra) {
      rec.ms = rec.ms === undefined ? Date.now() - t0 : rec.ms;
      Q.r[id] = rec;
      Q.lt = Math.max(0, Q.lt + (rec.f ? -1 : 1));
      save();
      showAfter(gi, si, sc, rec, extra);
    }
    RENDER[sc.t]({ gi: gi, id: id, sc: sc, hue: g.hue, done: done, head: track(gi) + '<div class="q-bg">' + gateRose(gi) + '</div>' });
  }

  function showAfter(gi, si, sc, rec, extra) {
    var box = document.createElement('div');
    box.className = 'q-after';
    box.innerHTML = (extra || '') + '<p>' + esc(sc.after) + '</p>' + (sc.src ? '<p class="q-src">' + esc(sc.src) + '</p>' : '') +
      '<div class="q-actions row"><button class="q-btn" id="nx">Yürü</button></div>';
    app.querySelector('.q-col').appendChild(box);
    $$('.q-col button:not(#nx), .q-col input, .q-col textarea').forEach(function (b) { if (!box.contains(b)) b.disabled = true; });
    box.querySelector('#nx').onclick = function () { scene(gi, si + 1); };
    box.querySelector('#nx').focus();
    tone(rec.f ? 147 : 523, 0.25);
  }

  /* ---------- sahne türleri ---------- */
  var RENDER = {};

  function promptOf(sc, side) { return sc.q || (side === 'a' ? sc.qa : sc.qh); }

  RENDER.pick = function (c) {
    var sc = c.sc, sel = -1, changes = -1;
    var my = paint(c.head + '<section class="q-col"><h3>' + esc(sc.k) + '</h3><p class="q-q" id="qq"></p>' +
      '<div class="q-opts">' + sc.o.map(function (o, i) { return '<button class="q-opt" data-i="' + i + '">' + esc(o.t) + '</button>'; }).join('') + '</div>' +
      '<div class="q-actions row"><button class="q-btn" id="ok" disabled>Kararım bu</button></div></section>', c.hue);
    typeIn($('#qq'), promptOf(sc, Q.side), my);
    $$('.q-opt').forEach(function (b) {
      b.onclick = function () {
        var i = +b.getAttribute('data-i');
        if (i !== sel) changes++;
        sel = i;
        $$('.q-opt').forEach(function (x) { x.classList.toggle('on', x === b); });
        $('#ok').disabled = false; tone(392, 0.08);
      };
    });
    $('#ok').onclick = function () {
      $('#ok').hidden = true;
      var rec = { c: sel, ch: Math.max(0, changes), f: sc.right !== undefined && sel !== sc.right ? 1 : 0 };
      if (sc.right !== undefined) $$('.q-opt').forEach(function (x, i) { if (i === sc.right) x.classList.add('right'); });
      if (sc.prank === 'bahce' && sel === 1) return fakeEnding(function () { c.done(rec, '<p class="q-note">Bahçede tek başına kalınmaz. Öteki yedi ve düştü; sen de arkasından gittin.</p>'); }, c.hue);
      if (sc.prank === 'kestik') return clap(function () { c.done(rec, '<p class="q-note">Az önceki sahne de bir çekimdi. Seçimin kayda geçti.</p>'); });
      c.done(rec);
    };
  };

  /* Muziplik: meyveyi yemeyene sahte bir son. */
  function fakeEnding(then, hue) {
    var keep = app.innerHTML;
    var my = paint('<section class="q-fake"><h2>Oyun bitti</h2><p>Meyveyi yemedin. Bahçede kaldın. Hiçbir şey olmadı ve bundan sonra da olmayacak.</p>' +
      '<p class="q-credits">Yapım: kimse<br>Hikâye: yok<br>Teşekkürler: kurala uyan herkese</p><p class="q-dots" id="dt"></p></section>', hue);
    setTimeout(function () {
      if (ep !== my) return;
      $('#dt').innerHTML = 'Hâlâ burada mısın? <button class="q-link" id="rt">Ağaca geri dön</button>';
      $('#rt').onclick = function () { ep++; app.innerHTML = keep; $('#ok').hidden = true; then(); };
    }, FAST() ? 0 : 3200);
  }
  function clap(then) {
    var d = document.createElement('div');
    d.className = 'q-clap'; d.innerHTML = '<div><b>Kestik</b><span>Sahne 1, çekim 1</span></div>';
    document.body.appendChild(d); tone(880, 0.06, 'square');
    setTimeout(function () { d.remove(); then(); }, FAST() ? 0 : 1500);
  }

  RENDER.write = function (c) {
    paint(c.head + '<section class="q-col"><h3>' + esc(c.sc.k) + '</h3><p class="q-q">' + esc(c.sc.q) + '</p>' +
      '<input id="w" type="text" maxlength="60" aria-label="Kapının adı">' +
      '<div class="q-actions row"><button class="q-btn" id="ok">As</button></div></section>', c.hue);
    $('#ok').onclick = function () {
      var v = $('#w').value.trim();
      if (!v) { $('#w').focus(); return; }
      Q.w = v; $('#ok').hidden = true; c.done({ c: 0 });
    };
  };

  var GLYPH = { K: '♔', Q: '♕', R: '♖', N: '♘', k: '♚', r: '♜', p: '♟' };
  RENDER.chess = function (c) {
    var sc = c.sc, at = {}, sel = -1, changes = -1;
    Object.keys(sc.board).forEach(function (p) { [].concat(sc.board[p]).forEach(function (sq) { at[sq] = p; }); });
    var cells = '';
    for (var r = 8; r >= 1; r--) for (var f = 0; f < 8; f++) {
      var sq = 'abcdefgh'[f] + r, p = at[sq];
      cells += '<i data-sq="' + sq + '" class="' + ((f + r) % 2 ? 'lt' : 'dk') + (p && p === p.toLowerCase() ? ' bk' : '') + '">' + (p ? GLYPH[p] : '') + '</i>';
    }
    paint(c.head + '<section class="q-col"><h3>' + esc(sc.k) + '</h3><p class="q-q">' + esc(sc.q) + '</p>' +
      '<div class="q-board" role="img" aria-label="Satranç tahtası">' + cells + '</div>' +
      '<div class="q-opts">' + sc.o.map(function (o, i) { return '<button class="q-opt" data-i="' + i + '">' + esc(o.t) + '</button>'; }).join('') + '</div>' +
      '<div class="q-actions row"><button class="q-btn" id="ok" disabled>Oyna</button></div></section>', c.hue);
    function mark(o) {
      $$('.q-board i').forEach(function (x) { x.classList.remove('from', 'to'); });
      if (!o) return;
      $('.q-board i[data-sq="' + o.from + '"]').classList.add('from');
      $('.q-board i[data-sq="' + o.to + '"]').classList.add('to');
    }
    $$('.q-opt').forEach(function (b) {
      b.onclick = function () {
        var i = +b.getAttribute('data-i');
        if (i !== sel) changes++;
        sel = i; mark(sc.o[i]);
        $$('.q-opt').forEach(function (x) { x.classList.toggle('on', x === b); });
        $('#ok').disabled = false;
      };
    });
    $('#ok').onclick = function () {
      $('#ok').hidden = true;
      var o = sc.o[sel], src = $('.q-board i[data-sq="' + o.from + '"]'), dst = $('.q-board i[data-sq="' + o.to + '"]');
      dst.textContent = src.textContent; dst.classList.remove('bk'); src.textContent = '';
      $$('.q-opt').forEach(function (x, i) { if (sc.o[i].ok) x.classList.add('right'); });
      c.done({ c: sel, ch: Math.max(0, changes), f: o.ok ? 0 : 1 });
    };
  };

  RENDER.orpheus = function (c) {
    var total = FAST() ? 300 : 14000, held = 0, down = false, last = 0, ended = false;
    var whispers = [[0.25, 'Arkanda ayak sesi yok.'], [0.5, 'Ya gelmiyorsa?'], [0.72, 'Bir kez baksan ne olur?'], [0.9, 'Neredeyse çıktın. Emin misin orada olduğundan?']];
    var my = paint(c.head + '<section class="q-col"><h3>' + esc(c.sc.k) + '</h3><p class="q-q">' + esc(c.sc.q) + '</p>' +
      '<div class="q-path"><i id="pb"></i></div><p class="q-whisper" id="wh" aria-live="polite">&nbsp;</p>' +
      '<div class="q-actions row"><button class="q-btn" id="walk">Yürü (basılı tut)</button><button class="q-btn warn" id="look">Arkana bak</button>' +
      '<button class="q-link" id="skip">Geç</button></div></section>', c.hue);
    function end(rec) { if (ended) return; ended = true; $('#walk').hidden = $('#look').hidden = $('#skip').hidden = true; c.done(rec); }
    function loop(now) {
      if (ep !== my || ended) return;
      if (down) held += now - last;
      last = now;
      var p = Math.min(1, held / total);
      $('#pb').style.width = (p * 100).toFixed(1) + '%';
      whispers.forEach(function (w) { if (p >= w[0]) $('#wh').textContent = w[1]; });
      $('#look').style.transform = 'scale(' + (1 + p * 0.25).toFixed(2) + ')';
      if (p >= 1) return end({ c: 100, f: 0 });
      requestAnimationFrame(loop);
    }
    var w = $('#walk');
    function on(e) { e.preventDefault(); down = true; last = performance.now(); }
    function off() { down = false; }
    w.addEventListener('pointerdown', on); w.addEventListener('pointerup', off); w.addEventListener('pointerleave', off);
    w.addEventListener('keydown', function (e) { if ((e.key === ' ' || e.key === 'Enter') && !down) on(e); });
    w.addEventListener('keyup', off);
    w.addEventListener('contextmenu', function (e) { e.preventDefault(); });
    $('#look').onclick = function () { end({ c: Math.round(Math.min(1, held / total) * 100), f: 1 }); };
    $('#skip').onclick = function () { end({ c: 100, f: 0, skip: 1 }); };
    last = performance.now(); requestAnimationFrame(loop);
  };

  RENDER.sisifos = function (c) {
    var h = 0, rounds = 0, rolling = false, ended = false;
    paint(c.head + '<section class="q-col"><h3>' + esc(c.sc.k) + '</h3><p class="q-q">' + esc(c.sc.q) + '</p>' +
      '<div class="q-hill"><button id="rock" aria-label="Kayayı it"></button></div><p class="q-whisper" id="wh" aria-live="polite">&nbsp;</p>' +
      '<div class="q-actions row"><button class="q-btn ghost" id="drop" hidden>Kayayı bırak</button></div></section>', c.hue);
    function place() { $('#rock').style.left = (4 + h * 0.8) + '%'; $('#rock').style.bottom = (2 + h * 0.62) + '%'; }
    function end(kept) {
      if (ended) return; ended = true;
      $('#rock').disabled = true; $('#drop').hidden = true;
      var ax = kept ? { K: 2 } : { K: -1, G: 1 };
      Object.keys(ax).forEach(function (k) { Q.x[k] = (Q.x[k] || 0) + ax[k]; });
      c.done({ c: kept ? 1 : 0, n: rounds });
    }
    place();
    $('#rock').onclick = function () {
      if (rolling || ended) return;
      h = Math.min(100, h + 13); place(); tone(120 + h * 2, 0.06);
      if (h < 91) return;
      rolling = true; rounds++;
      $('#wh').textContent = ['Kaya elinden kaydı.', 'Yine.', 'Bu kaçıncı?', 'Tepe aynı tepe, kaya aynı kaya.', ''][Math.min(rounds - 1, 4)];
      setTimeout(function () {
        h = 0; $('#rock').classList.add('roll'); place();
        setTimeout(function () { rolling = false; $('#rock').classList.remove('roll'); if (rounds >= 2) $('#drop').hidden = false; if (rounds >= 5) end(true); }, FAST() ? 0 : 900);
      }, FAST() ? 0 : 350);
    };
    $('#drop').onclick = function () { end(false); };
  };

  RENDER.halay = function (c) {
    var N = 24, beat = 0, misses = 0, hit = false, ended = false, at = 0, timer = null;
    var my = paint(c.head + '<section class="q-col"><h3>' + esc(c.sc.k) + '</h3><p class="q-q">' + esc(c.sc.q) + '</p>' +
      '<div class="q-ring-wrap"><button class="q-ring" id="rg" aria-label="Vuruş"><span id="bn">0</span></button></div>' +
      '<p class="q-whisper" id="wh" aria-live="polite">Hazır olduğunda başla.</p>' +
      '<div class="q-actions row"><button class="q-btn" id="go">Halkaya gir</button><button class="q-btn ghost" id="quit" hidden>Bırak</button><button class="q-link" id="skip">Geç</button></div></section>', c.hue);
    function gap(i) { return FAST() ? 30 : Math.max(480, 760 - i * 11); }
    function end(rec, msg) {
      if (ended) return; ended = true; clearTimeout(timer);
      $('#go').hidden = $('#quit').hidden = $('#skip').hidden = true; $('#rg').disabled = true;
      $('#wh').textContent = msg; c.done(rec);
    }
    function tick() {
      if (ep !== my || ended) return;
      if (beat > 0 && !hit) { misses++; if (misses >= 2) return end({ c: beat - 2, f: 1 }, 'Vuruşu kaçırdın; halka çözüldü.'); } else misses = 0;
      if (beat >= N) return end({ c: N, f: 0 }, 'Sonuna kadar tuttun.');
      beat++; hit = false; at = performance.now();
      $('#bn').textContent = beat;
      var r = $('#rg'); r.classList.remove('pulse'); void r.offsetWidth; r.classList.add('pulse');
      tone(beat % 4 === 1 ? 98 : 147, 0.09, 'triangle');
      timer = setTimeout(tick, gap(beat));
    }
    $('#rg').addEventListener('pointerdown', function () {
      if (!beat || ended || hit) return;
      if (performance.now() - at < gap(beat) * 0.6 || FAST()) { hit = true; $('#rg').classList.add('ok'); setTimeout(function () { if ($('#rg')) $('#rg').classList.remove('ok'); }, 120); }
    });
    $('#go').onclick = function () { $('#go').hidden = true; $('#skip').hidden = true; $('#quit').hidden = false; $('#wh').textContent = 'Her vuruşta halkaya dokun.'; tick(); };
    $('#quit').onclick = function () { end({ c: Math.max(0, beat - 1), f: 0, quit: 1 }, 'Halkadan çıktın.'); };
    $('#skip').onclick = function () { end({ c: null, f: 0, skip: 1 }, 'Bu kez dans etmedin.'); };
  };

  RENDER.remil = function (c) {
    var rows = [];
    paint(c.head + '<section class="q-col"><h3>' + esc(c.sc.k) + '</h3><p class="q-q">' + esc(c.sc.q) + '</p>' +
      '<button class="q-sand" id="sand" aria-label="Kuma nokta at">' + [0, 1, 2, 3].map(function (i) { return '<span class="q-row" id="r' + i + '"></span>'; }).join('') + '</button>' +
      '<p class="q-whisper" id="wh" aria-live="polite">Dört sıra atılacak.</p><div id="fig"></div></section>', c.hue);
    $('#sand').onclick = function () {
      if (rows.length >= 4) return;
      var n = 5 + Math.floor(Math.random() * 9);
      rows.push(n);
      $('#r' + (rows.length - 1)).innerHTML = new Array(n + 1).join('<i></i>');
      tone(300 + n * 20, 0.05);
      $('#wh').textContent = rows.length < 4 ? (4 - rows.length) + ' sıra kaldı.' : 'Her sırada noktalar ikişer ikişer silinir; geriye bir ya da iki nokta kalır.';
      if (rows.length < 4) return;
      var ix = QC.figureOf(rows, QD.figures), f = QD.figures[ix];
      Q.fig = ix;
      $('#fig').innerHTML = '<div class="q-figure">' + f[0].split('').map(function (d) { return '<span>' + (d === '1' ? '<i></i>' : '<i></i><i></i>') + '</span>'; }).join('') +
        '</div><p class="q-note"><b>' + esc(f[1]) + '.</b> ' + esc(f[2]) + '</p>';
      $('#sand').disabled = true;
      c.done({ c: ix });
    };
  };

  RENDER.burc = function (c) {
    var sign = -1;
    paint(c.head + '<section class="q-col"><h3>' + esc(c.sc.k) + '</h3><p class="q-q">' + esc(c.sc.q) + '</p>' +
      '<div class="q-signs">' + QD.signs.map(function (s, i) { return '<button class="q-opt" data-i="' + i + '">' + esc(s) + '</button>'; }).join('') + '</div><div id="rd"></div></section>', c.hue);
    $$('.q-signs .q-opt').forEach(function (b) {
      b.onclick = function () {
        if (sign !== -1) return;
        sign = +b.getAttribute('data-i'); Q.sign = sign; b.classList.add('on');
        $$('.q-signs .q-opt').forEach(function (x) { x.disabled = true; });
        $('#rd').innerHTML = '<p class="q-note"><b>' + esc(QD.signs[sign]) + ' burcu, ' + esc(QD.elements[sign % 4]) + ' grubu.</b> ' + esc(QD.forer) + '</p>' +
          '<p>Bu yorum seni ne kadar anlatıyor?</p><div class="q-rate">' + [1, 2, 3, 4, 5].map(function (n) { return '<button class="q-opt" data-n="' + n + '">' + n + '</button>'; }).join('') + '</div><p class="q-fine">1: hiç, 5: tam ben</p>';
        $$('.q-rate .q-opt').forEach(function (r) {
          r.onclick = function () {
            var n = +r.getAttribute('data-n'); r.classList.add('on');
            $$('.q-rate .q-opt').forEach(function (x) { x.disabled = true; });
            c.done({ c: n, f: n >= 4 ? 1 : 0 });
          };
        });
      };
    });
  };

  RENDER.stop = function (c) {
    var N = 12, vals = [], i = 0, best = -1;
    for (var k = 0; k < N; k++) vals.push(Math.random());
    paint(c.head + '<section class="q-col"><h3>' + esc(c.sc.k) + '</h3><p class="q-q">' + esc(c.sc.q) + '</p>' +
      '<div class="q-doors">' + vals.map(function (_, j) { return '<i id="d' + j + '">' + (j + 1) + '</i>'; }).join('') + '</div>' +
      '<p class="q-note" id="say"></p><div class="q-actions row"><button class="q-btn" id="take">Bunu al, dur</button><button class="q-btn ghost" id="pass">Geç</button></div></section>', c.hue);
    function show() {
      var rank = 1;
      for (var j = 0; j < i; j++) if (vals[j] > vals[i]) rank++;
      $('#d' + i).classList.add('open');
      $('#say').textContent = (i + 1) + '. kapı: ' + (i === 0 ? 'ilk armağan; kıyaslayacak bir şey yok.' : rank === 1 ? 'şimdiye dek gördüklerinin en iyisi.' : 'gördüklerinin arasında ' + rank + '. sırada.') +
        (i === N - 1 ? ' Son kapı; almak zorundasın.' : '');
      $('#pass').hidden = i === N - 1;
    }
    function end() {
      $('#take').hidden = $('#pass').hidden = true; $('#d' + i).classList.add('got');
      var rank = QC.rankOf(vals, i);
      vals.forEach(function (v, j) { if (QC.rankOf(vals, j) === 1) best = j; });
      $('#d' + best).classList.add('best');
      c.done({ c: rank, at: i + 1, f: rank > 3 ? 1 : 0 }, '<p class="q-note">' + (i + 1) + '. kapıda durdun. Aldığın armağan on iki armağanın ' + (rank === 1 ? 'en iyisiydi.' : rank + '. iyisiydi; en iyisi ' + (best + 1) + '. kapıdaydı.') + '</p>');
    }
    $('#take').onclick = end;
    $('#pass').onclick = function () { $('#d' + i).classList.add('gone'); i++; show(); tone(260, 0.05); };
    show();
  };

  RENDER.quiet = function (c) {
    var total = FAST() ? 200 : 60000, t0 = Date.now(), ended = false;
    var my = paint('<section class="q-quiet" id="qt"><i></i><button class="q-link q-out" id="out">çık</button></section>', c.hue);
    function end(ok) {
      if (ended) return; ended = true;
      document.removeEventListener('keydown', key, true);
      var secs = Math.round((Date.now() - t0) / 1000);
      paint(c.head + '<section class="q-col"><h3>' + esc(c.sc.k) + '</h3><p class="q-q">' + (ok ? 'Bir dakika boyunca hiçbir şey yapmadın.' : secs + '. saniyede kıpırdadın.') + '</p></section>', c.hue);
      c.done({ c: ok ? 60 : secs, f: ok ? 0 : 1, ms: 0 });
    }
    function key() { end(false); }
    setTimeout(function () { if (ep === my) end(true); }, total);
    setTimeout(function () {
      if (ep !== my || ended) return;
      $('#qt').addEventListener('pointerdown', function () { end(false); });
      document.addEventListener('keydown', key, true);
    }, FAST() ? 0 : 600);
  };

  RENDER.know = function (c) {
    var ids = c.sc.picks.filter(function (p) { return OTHER.r[p]; }), k = 0, right = 0;
    function step() {
      if (k >= ids.length) {
        paint(c.head + '<section class="q-col"><h3>' + esc(c.sc.k) + '</h3><p class="q-q">Üç tahminin kayda geçti. Kaçını bildiğini terazide göreceksin.</p></section>', c.hue);
        return c.done({ c: right, f: right === 0 ? 1 : 0 });
      }
      var sc = QD.scenes[ids[k]];
      paint(c.head + '<section class="q-col"><h3>' + esc(OTHER.n) + ' burada ne seçti?</h3><p class="q-q">' + esc(promptOf(sc, OTHER.side)) + '</p>' +
        '<div class="q-opts">' + sc.o.map(function (o, i) { return '<button class="q-opt" data-i="' + i + '">' + esc(o.t) + '</button>'; }).join('') + '</div>' +
        '<p class="q-fine">' + (k + 1) + ' / ' + ids.length + '</p></section>', c.hue);
      $$('.q-opt').forEach(function (b) {
        b.onclick = function () { if (+b.getAttribute('data-i') === OTHER.r[ids[k]].c) right++; k++; step(); };
      });
    }
    step();
  };

  /* ---------- mahşer ---------- */
  function finish() { Q.done = true; save(); judgement(); }

  function answerOf(id, rec, run) {
    var sc = QD.scenes[id];
    if (!rec || !sc) return '—';
    switch (sc.t) {
      case 'pick': case 'chess': return sc.o[rec.c] ? sc.o[rec.c].t : '—';
      case 'write': return '“' + (run.w || '') + '”';
      case 'orpheus': return rec.skip ? 'Yürümedi' : rec.c >= 100 ? 'Bakmadan çıktı' : 'Yolun yüzde ' + rec.c + '\'inde dönüp baktı';
      case 'sisifos': return rec.c ? 'Beş kez itti; bırakmadı' : rec.n + ' kez itti, sonra bıraktı';
      case 'halay': return rec.c === null ? 'Halkaya girmedi' : rec.c >= 24 ? 'Sonuna kadar tuttu' : rec.c + '. vuruşta bıraktı';
      case 'remil': return QD.figures[rec.c] ? QD.figures[rec.c][1] : '—';
      case 'burc': return 'Yoruma ' + rec.c + ' / 5 verdi';
      case 'stop': return rec.at + '. kapıda durdu; ' + rec.c + '. iyi armağan';
      case 'quiet': return rec.c >= 60 ? 'Bekledi' : rec.c + '. saniyede kıpırdadı';
      case 'know': return rec.c + ' / 3 bildi';
    }
    return '—';
  }

  function radar(va, vb) {
    var S = 340, c = S / 2, R = 112, out = '', n = 6;
    function pt(i, r) { var a = (Math.PI * 2 * i) / n - Math.PI / 2; return [(c + r * Math.cos(a)).toFixed(1), (c + r * Math.sin(a)).toFixed(1)]; }
    function poly(v, cls) { return '<polygon class="' + cls + '" points="' + v.map(function (x, i) { return pt(i, R * (0.5 + Math.max(-1, Math.min(1, x / 7)) * 0.5)).join(','); }).join(' ') + '"/>'; }
    [1, 0.5].forEach(function (k) { out += '<polygon class="grid" points="' + [0, 1, 2, 3, 4, 5].map(function (i) { return pt(i, R * k).join(','); }).join(' ') + '"/>'; });
    QD.axes.forEach(function (a, i) {
      var p = pt(i, R + 22), o = pt(i, R);
      out += '<line class="grid" x1="' + c + '" y1="' + c + '" x2="' + o[0] + '" y2="' + o[1] + '"/><text x="' + p[0] + '" y="' + p[1] + '" text-anchor="middle" dominant-baseline="middle">' + a.pos + '</text>';
    });
    return '<svg class="q-radar" viewBox="0 0 ' + S + ' ' + S + '" role="img" aria-label="Altı eksende iki yolculuk">' + out + poly(va, 'pa') + (vb ? poly(vb, 'pb') : '') + '</svg>';
  }

  function scaleSvg(s, label) {
    var tilt = Math.max(-9, Math.min(9, (s.lost - s.won) * 0.9));
    function pan(x, n, name) {
      return '<g transform="translate(' + x + ' 0)"><line x1="0" y1="0" x2="0" y2="62"/><path d="M-34 62 Q0 96 34 62Z"/><text y="58" text-anchor="middle" class="num">' + n + '</text><text y="118" text-anchor="middle">' + name + '</text></g>';
    }
    return '<svg class="q-scale" viewBox="0 0 360 230" role="img" aria-label="Terazi"><line x1="180" y1="30" x2="180" y2="205"/><path d="M140 205H220"/>' +
      '<text x="180" y="18" text-anchor="middle" class="lbl">' + esc(label || '') + '</text>' +
      '<g transform="rotate(' + tilt + ' 180 44)"><line x1="50" y1="44" x2="310" y2="44"/>' + pan(50, s.won, 'Kazanılan') + pan(310, s.lost, 'Yitirilen') + '</g>' +
      '<g transform="translate(180 96)"><path d="M-30 30 Q0 60 30 30Z"/><text y="27" text-anchor="middle" class="num">' + s.shared + '</text><text y="84" text-anchor="middle">Birlikte tökezlenen</text></g></svg>';
  }

  /* first: ilk yürüyen, second: ardından gelen (yoksa null). view: yalnızca izleme. */
  function judgement(first, second, view) {
    if (!first) { first = OTHER || Q; second = OTHER ? Q : null; }
    var me = view ? first : Q, pair = !!second;
    var cmp = pair ? QC.compare(first, second, QD.scenes) : null;
    var vm = QC.vec(me, QD.scenes);
    var h = '<section class="q-col q-judge"><h1>Mahşer</h1>';

    if (pair) {
      h += '<div class="q-pct"><b>%' + cmp.pct + '</b><span>' + esc(first.n) + ' ile ' + esc(second.n) + '</span></div>' +
        '<p class="q-story">' + (cmp.pct >= 70 ? 'Aynı kapılardan çoğunlukla aynı yöne çıktınız.' : cmp.pct >= 45 ? 'Yarı yolda buluşup yarı yolda ayrıldınız.' : cmp.pct >= 30 ? 'Çoğu kapıdan ayrı yönlere çıktınız.' : 'Neredeyse her kapıda ayrı düştünüz.') +
        (cmp.comp.length ? ' Zıt durduğunuz ama birbirinizi tamamladığınız yer: ' + cmp.comp.map(function (k) { var a = QD.axes[QC.AX.indexOf(k)]; return a.neg.toLowerCase() + ' ile ' + a.pos.toLowerCase(); }).join(', ') + '.' : '') + '</p>' +
        (cmp.know !== null ? '<p class="q-story">' + esc(second.n) + ', ' + esc(first.n) + ' için yaptığı üç tahminin ' + Math.round(cmp.know * 3) + ' tanesini bildi.</p>' : '') +
        (cmp.dance !== null ? '<p class="q-story">Dansınız ' + cmp.dance + ' vuruş sürdü.' + (cmp.dropped ? ' Halkayı önce bırakan: ' + esc(cmp.dropped === 'a' ? first.n : second.n) + '.' : ' İkiniz de aynı vuruşa kadar tuttunuz.') + '</p>' : '');
      if (cmp.pct < 30 && !view && !Q.araf && cmp.diffs.length) h += '<div class="q-araf"><h3>Araf</h3><p>Uyumunuz yüzde otuzun altında. Bu bir hüküm değil; ikinize de bir hak doğdu. Ayrı düştüğünüz üç kapıya, onun ne seçtiğini görerek bir kez daha girebilirsin.</p><button class="q-btn" id="araf">Üç kapıya dön</button></div>';
    }

    h += '<h2>Terazi</h2>' + scaleSvg(QC.scale(me, pair ? (me === first ? second : first) : null, QD.scenes), me.w) +
      '<p class="q-fine">Terazinin üstündeki söz, kapılara senin verdiğin ad.' + (pair ? '' : ' Üçüncü kefe, biri seninle aynı kapılardan geçince dolar.') + '</p>';

    h += '<h2>Altı eksen</h2>' + radar(pair ? cmp.va : vm, pair ? cmp.vb : null) +
      (pair ? '<p class="q-legend"><i class="pa"></i>' + esc(first.n) + ' <i class="pb"></i>' + esc(second.n) + '</p>' : '') +
      '<p class="q-fine">Her köşe bir eğilim; karşısı onun zıddı: ' + QD.axes.map(function (a) { return a.pos + ' / ' + a.neg; }).join(', ') + '.</p>';

    h += '<h2>Yolun seni kimlere benzetti</h2>';
    (pair ? [first, second] : [me]).forEach(function (run) {
      var m = QC.matchChars(QC.vec(run, QD.scenes), QD.chars[run.side]);
      h += '<h3>' + esc(run.n) + ', ' + SIDE[run.side] + ' tarafı</h3><div class="q-chars">' + Object.keys(QD.pools).map(function (p) {
        var ch = m[p];
        return '<article><p class="q-pool">' + QD.pools[p] + '</p><h4>' + esc(ch.n) + '</h4><p>' + esc(ch.who) + ' ' + esc(ch.did) + ' ' + esc(ch.end) + '</p>' + (ch.src ? '<p class="q-src">' + esc(ch.src) + '</p>' : '') + '</article>';
      }).join('') + '</div>';
      if (run.fig !== undefined || run.sign !== undefined) h += '<p class="q-fine">' + (run.fig !== undefined ? 'Kumdaki şekli: ' + esc(QD.figures[run.fig][1]) + '. ' : '') + (run.sign !== undefined ? 'Burcu: ' + esc(QD.signs[run.sign]) + ' (' + esc(QD.elements[run.sign % 4]) + ').' : '') + '</p>';
    });

    h += '<h2>Film şeridi</h2><p class="q-fine">Kapılar sırayla, kare kare. Yana kaydır ya da oynat.</p><div class="q-strip" id="strip" tabindex="0">';
    QD.gates.forEach(function (g) {
      g.scenes.forEach(function (id) {
        var a = first.r[id], b = pair ? second.r[id] : null, sc = QD.scenes[id];
        if (!a && !b) return;
        var asym = sc.qa && sc.qh;
        h += '<figure class="' + (pair && a && b && sc.t === 'pick' && a.c !== b.c ? 'df' : '') + '"><figcaption>' + esc(g.name) + '<b>' + esc(sc.k) + '</b></figcaption>' +
          '<p><span>' + esc(first.n) + '</span>' + (asym ? '<em>' + esc(promptOf(sc, first.side)) + '</em>' : '') + esc(answerOf(id, a, first)) + '</p>' +
          (pair ? '<p><span>' + esc(second.n) + '</span>' + (asym ? '<em>' + esc(promptOf(sc, second.side)) + '</em>' : '') + esc(answerOf(id, b, second)) + '</p>' : '') + '</figure>';
      });
    });
    h += '</div><div class="q-actions row"><button class="q-btn ghost" id="play">Şeridi oynat</button></div>';

    h += '<h2>Ölçülmeyenler</h2><table class="q-table"><tr><th></th>' + (pair ? '<th>' + esc(first.n) + '</th><th>' + esc(second.n) + '</th>' : '<th>' + esc(me.n) + '</th>') + '</tr>';
    var hs = (pair ? [first, second] : [me]).map(QC.hesitation);
    [['En uzun duraksama', function (x) { return x.longestId ? (x.longest / 1000).toFixed(0) + ' sn, ' + QD.scenes[x.longestId].k : '—'; }],
      ['Ortalama karar süresi', function (x) { return (x.avg / 1000).toFixed(1) + ' sn'; }],
      ['Fikir değiştirme', function (x) { return x.changes + ' kez'; }]].forEach(function (row) {
      h += '<tr><td>' + row[0] + '</td>' + hs.map(function (x) { return '<td>' + esc(row[1](x)) + '</td>'; }).join('') + '</tr>';
    });
    h += '<tr><td>Çiğnenen kapı</td>' + (pair ? [first, second] : [me]).map(function (r) { return '<td>' + ((r.br || []).length ? (r.br || []).map(function (i) { return QD.gates[i].name; }).join(', ') : 'yok') + '</td>'; }).join('') + '</tr></table>';

    h += '<p class="q-confess">Bu oyun seni tanımıyor. Yalnızca seçimlerini saydı.</p>';

    if (!view) {
      var code = pair ? QC.pack(first, second) : QC.pack(Q);
      var link = location.href.split('#')[0] + '#q=' + code;
      h += '<h2>' + (pair ? 'Teraziyi ona da göster' : 'Ötekini çağır') + '</h2><p>' + (pair ? 'Bu kod ikinizin yolunu birlikte taşır. Ona gönder; o da bu ekranın aynısını görsün.' : 'Bu kodu birine gönder. Aynı kapılardan geçsin; sonunda iki yol yan yana açılsın. Çağrı bir gün yaşar.') + '</p>' +
        '<div class="q-code" id="cd">' + esc(code) + '</div><div class="q-actions row"><button class="q-btn" id="cp">Bağlantıyı kopyala</button><button class="q-btn ghost" id="cc">Kodu kopyala</button><span class="q-fine" id="cs"></span></div>' +
        (pair ? '' : '<div class="q-actions row"><button class="q-btn ghost" id="same">İkinci kişi bu cihazda yürüsün</button></div>');
    }
    h += '<div class="q-actions row"><button class="q-btn ghost" id="hm">Arayış\'ın başına dön</button></div></section>';
    paint(h, 'night');

    $('#hm').onclick = home;
    $('#play').onclick = function () {
      var el = $('#strip'), my = ep;
      el.scrollLeft = 0;
      (function run() { if (ep !== my) return; el.scrollLeft += 2; if (el.scrollLeft + el.clientWidth < el.scrollWidth - 2) requestAnimationFrame(run); })();
    };
    if ($('#cp')) { $('#cp').onclick = function () { copy(link, $('#cs')); }; $('#cc').onclick = function () { copy(code, $('#cs')); }; }
    if ($('#same')) $('#same').onclick = function () { OTHER = JSON.parse(JSON.stringify(Q)); Q = null; clear(); setup(); };
    if ($('#araf')) $('#araf').onclick = function () { araf(cmp.diffs.slice(0, 3)); };
  }

  /* İkinci şans: ayrı düşülen üç kapı, ötekinin seçimi görülerek yeniden. */
  function araf(ids) {
    var k = 0;
    function step() {
      if (k >= ids.length) { Q.araf = true; save(); return judgement(); }
      var id = ids[k], sc = QD.scenes[id];
      paint('<section class="q-col"><h3>Araf: ' + esc(sc.k) + '</h3><p class="q-q">' + esc(promptOf(sc, Q.side)) + '</p>' +
        '<p class="q-note">' + esc(OTHER.n) + ' burada şunu seçmişti: ' + esc(sc.o[OTHER.r[id].c].t) + '</p>' +
        '<div class="q-opts">' + sc.o.map(function (o, i) { return '<button class="q-opt' + (i === Q.r[id].c ? ' on' : '') + '" data-i="' + i + '">' + esc(o.t) + '</button>'; }).join('') + '</div>' +
        '<p class="q-fine">İlk seçimin işaretli. Değiştirmek zorunda değilsin.</p></section>', 'mist');
      $$('.q-opt').forEach(function (b) { b.onclick = function () { Q.r[id].c = +b.getAttribute('data-i'); Q.r[id].araf = 1; save(); k++; step(); }; });
    }
    step();
  }

  window.Quest = {
    open: function (code) { if (code) codeEntry(code); else home(); }
  };
})();
