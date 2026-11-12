/* Otuz Kuş — oyun motoru ve arayüz. İçerik js/data.js'te, saf mantık js/core.js'te. */
(function () {
  'use strict';

  var KEY = 'otuzkus.v1';
  var BETS = [[1, 'Sanırım'], [2, 'Eminim'], [3, 'Kalıbımı basarım']];
  var app = document.getElementById('app');
  var bar = document.getElementById('bar');
  var modal = document.getElementById('modal');
  var modalBox = document.getElementById('modal-box');
  var S = null;        // oyun durumu
  var epoch = 0;       // her ekran değişiminde artar; eski zamanlayıcıları geçersiz kılar
  var birdById = {};
  Data.birds.forEach(function (b) { birdById[b.id] = b; });
  var TOTAL = 30;
  var FLOW = null;     // Akış modundayken etkin kart
  var LAST = {};       // etkin kartta olanlar: seçilen şık, hızlı tur sonucu vb.
  var FLOW_LEN = 12;   // bir akıştaki kart sayısı
  function setWorld(w) { document.body.setAttribute('data-w', w || ''); }

  /* ---------- yardımcılar ---------- */
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function show(html, withBar, keepWorld) {
    epoch++;
    if (!keepWorld) { setWorld(''); FLOW = null; }
    app.innerHTML = html;
    bar.hidden = !withBar;
    if (withBar) renderStatus();
    window.scrollTo(0, 0);
    app.focus({ preventScroll: true });
  }
  function on(sel, ev, fn) {
    var el = typeof sel === 'string' ? app.querySelector(sel) : sel;
    if (el) el.addEventListener(ev, fn);
    return el;
  }
  function store() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* gizli sekme vb. */ }
  }
  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      return raw ? Core.decodeSave(Core.encodeSave(JSON.parse(raw))) : null;
    } catch (e) { return null; }
  }
  function has(id) { return S.done.indexOf(id) !== -1; }
  function two() { return S.players.length > 1; }
  function chapterFeathers(ch) {
    return ch.scenes.filter(function (s) { return s.t !== 'story'; });
  }
  function chapterDone(ch) {
    return chapterFeathers(ch).every(function (s) { return has(s.id); });
  }

  function renderStatus() {
    var h = '<span>🪶 <b>' + S.done.length + '</b>/' + TOTAL + '</span>';
    S.players.forEach(function (p, i) {
      h += '<span class="' + (two() && i === S.turn ? 'on' : '') + '">☀ ' + esc(p.n) + ' <b>' + p.l + '</b></span>';
    });
    document.getElementById('status').innerHTML = h;
  }

  function openModal(html) {
    modalBox.innerHTML = html;
    modal.hidden = false;
    var b = modalBox.querySelector('button');
    if (b) b.focus();
  }
  function closeModal() { modal.hidden = true; modalBox.innerHTML = ''; }
  modal.addEventListener('click', function (e) { if (e.target === modal && modalBox.querySelector('[data-close]')) closeModal(); });

  /* ---------- gökyüzü ---------- */
  (function stars() {
    var sky = document.getElementById('sky'), h = '';
    for (var i = 0; i < 70; i++) {
      h += '<i style="left:' + (Math.random() * 100).toFixed(1) + '%;top:' + (Math.random() * 70).toFixed(1) +
        '%;animation-delay:' + (Math.random() * 4).toFixed(1) + 's"></i>';
    }
    sky.innerHTML = h;
  })();

  /* ---------- başlangıç ekranları ---------- */
  function renderTitle(msg) {
    var saved = load();
    var started = saved && (saved.done.length > 0 || Object.keys(saved.pos).length > 0);
    show(
      '<div class="title-screen">' +
      '<span class="feather">🪶</span>' +
      '<h1>Otuz Kuş</h1>' +
      '<p class="lead">Bir ateşin başında uyanıyorsun. Karşında konuşan bir kuş var ve sana söylediklerinden biri yalan. ' +
      'Yedi durak, otuz tüy: insanın nereden geldiğine, neye inandığına ve bildiğini nereden bildiğine dair bir yolculuk.</p>' +
      (msg ? '<p class="small" style="color:var(--rose)">' + esc(msg) + '</p>' : '') +
      '<div class="stack" style="max-width:320px;margin:0 auto">' +
      (started ? '<button class="btn" id="go-on">Kaldığın yerden devam et (' + saved.done.length + '/30)</button>' : '') +
      '<button class="btn' + (started ? ' alt' : '') + '" id="go-new">Yeni yolculuk</button>' +
      '<button class="btn alt" id="go-flow">Akış: on iki kartlık kısa tur</button>' +
      '<button class="btn alt" id="go-code">Tüy koduyla devam et</button>' +
      '<button class="ghost" id="go-how">Nasıl oynanır?</button>' +
      '</div></div>', false);
    on('#go-on', 'click', function () { S = saved; renderMap(); });
    on('#go-new', 'click', function () {
      if (!started) return renderSetup();
      openModal(
        '<h3>Yeni yolculuk</h3><p class="small">Kayıtlı yolculuğun (' + saved.done.length + '/30 tüy) yenisi başlayınca silinir. ' +
        'Saklamak istersen önce devam edip "Kaydet"ten tüy kodunu al.</p>' +
        '<div class="row"><button class="btn" id="new-ok">Yine de yeni başla</button><button class="ghost" data-close>Vazgeç</button></div>');
      modalBox.querySelector('#new-ok').addEventListener('click', function () { closeModal(); renderSetup(); });
      modalBox.querySelector('[data-close]').addEventListener('click', closeModal);
    });
    on('#go-flow', 'click', function () { S = saved || Core.newState(['Yolcu']); store(); renderFlowStart(); });
    on('#go-code', 'click', codeEntry);
    on('#go-how', 'click', how);
  }
  function how() {
    openModal(
      '<h3>Nasıl oynanır?</h3>' +
      '<p class="small">Yedi durağı sırayla gezersin. Her durakta kısa bir anlatı ve dört beş küçük oyun var: sorular, "hangisi yalan", sıralama, eşleştirme, şifre, haiku, nefes ve bir uçuş oyunu. Her oyun bir kuş tüyü kazandırır.</p>' +
      '<p class="small"><b>Işık:</b> Soruları yanıtlarken ne kadar emin olduğunu seçersin. Doğruysa bahsin kadar ışık kazanır, yanlışsa o kadar kaybedersin. Bilmediğini bilmek puan kazandırır.</p>' +
      '<p class="small"><b>İki kişi:</b> Aynı ekranda sırayla oynanır. Tüyler ortaktır, ışık ayrıdır.</p>' +
      '<p class="small"><b>Kayıt:</b> İlerleme bu tarayıcıda kendiliğinden saklanır. Başka cihazda sürdürmek için "Kaydet"ten tüy kodunu ya da bağlantıyı al.</p>' +
      '<button class="btn" data-close>Anladım</button>');
    modalBox.querySelector('[data-close]').addEventListener('click', closeModal);
  }

  function codeEntry() {
    openModal(
      '<h3>Tüy koduyla devam et</h3>' +
      '<label for="code-in">Daha önce aldığın kodu yapıştır</label>' +
      '<textarea id="code-in" spellcheck="false"></textarea>' +
      '<p class="small" id="code-err" style="color:var(--rose)"></p>' +
      '<div class="row"><button class="btn" id="code-ok">Devam et</button><button class="ghost" data-close>Vazgeç</button></div>');
    modalBox.querySelector('[data-close]').addEventListener('click', closeModal);
    modalBox.querySelector('#code-ok').addEventListener('click', function () {
      var raw = modalBox.querySelector('#code-in').value;
      var i = raw.indexOf('#k=');
      var st = Core.decodeSave(i === -1 ? raw : raw.slice(i + 3));
      if (!st) { modalBox.querySelector('#code-err').textContent = 'Bu kod okunamadı. Eksik kopyalanmış olabilir.'; return; }
      S = st; store(); closeModal(); renderMap();
    });
  }

  function renderSetup() {
    show(
      '<div class="kicker">Yola çıkmadan</div><h2>Kaç kişisiniz?</h2>' +
      '<p class="dim">İki kişi aynı ekranda sırayla oynar; tüyleri birlikte toplarsınız.</p>' +
      '<div class="row" style="margin-bottom:18px">' +
      '<button class="btn" id="m1">Tek başıma</button><button class="btn alt" id="m2">İki kişiyiz</button></div>' +
      '<div class="stack">' +
      '<div><label for="n1">Adın</label><input type="text" id="n1" maxlength="20" placeholder="Yolcu"></div>' +
      '<div id="w2" hidden><label for="n2">Yol arkadaşının adı</label><input type="text" id="n2" maxlength="20" placeholder="Yoldaş"></div>' +
      '</div>' +
      '<div class="mt"><button class="btn" id="start">Ateşin başına otur</button></div>', false);
    var mode = 1;
    function setMode(m) {
      mode = m;
      app.querySelector('#w2').hidden = m === 1;
      app.querySelector('#m1').className = 'btn' + (m === 1 ? '' : ' alt');
      app.querySelector('#m2').className = 'btn' + (m === 2 ? '' : ' alt');
    }
    on('#m1', 'click', function () { setMode(1); });
    on('#m2', 'click', function () { setMode(2); });
    on('#start', 'click', function () {
      var names = [app.querySelector('#n1').value.trim() || 'Yolcu'];
      if (mode === 2) names.push(app.querySelector('#n2').value.trim() || 'Yoldaş');
      S = Core.newState(names);
      store();
      playChapter(0);
    });
  }

  /* ---------- harita ---------- */
  function renderMap() {
    var h = '<div class="kicker">Harita</div><h2>Yedi durak</h2>' +
      '<p class="dim">Duraklar sırayla açılır. Bitirdiğin durağa dönüp yeniden oynayabilirsin; tüyler ve ışık bir kez verilir.</p><div class="map">';
    var open = true;
    Data.chapters.forEach(function (ch, i) {
      var fs = chapterFeathers(ch);
      var got = fs.filter(function (s) { return has(s.id); }).length;
      var full = got === fs.length;
      h += '<button class="stop' + (full ? ' full' : '') + '" data-ch="' + i + '"' + (open ? '' : ' disabled') + '>' +
        '<span class="ico">' + (open ? ch.icon : '🌑') + '</span>' +
        '<span><span class="nm">' + (i + 1) + '. ' + esc(ch.title) + '</span><br><span class="sb">' + esc(ch.sub) + '</span></span>' +
        '<span class="ct">' + (full ? '✓ ' : '') + got + '/' + fs.length + ' tüy</span></button>';
      open = open && full;
    });
    h += '</div><div class="row mt">' +
      '<button class="btn alt" id="book">Tüy defteri</button>' +
      '<button class="btn alt" id="flow">Akış</button>' +
      (S.done.length === TOTAL ? '<button class="btn" id="fin">Simurg\'un aynası</button>' : '') +
      '<button class="ghost" id="quit">Ana ekran</button></div>';
    show(h, true);
    app.querySelectorAll('.stop').forEach(function (b) {
      b.addEventListener('click', function () { playChapter(+b.getAttribute('data-ch')); });
    });
    on('#book', 'click', renderBook);
    on('#flow', 'click', renderFlowStart);
    on('#fin', 'click', renderEnding);
    on('#quit', 'click', function () { renderTitle(); });
  }

  function playChapter(ci) {
    var ch = Data.chapters[ci];
    var si = S.pos[ch.id] || 0;
    if (si >= ch.scenes.length) si = 0;
    renderScene(ci, si);
  }

  /* ---------- sahne çerçevesi ---------- */
  function head(ci, si, sc) {
    if (FLOW) {
      return '<div class="kicker">' + esc(Data.worlds[sc.w]) + ' · ' + (S.flow.i + 1) + '/' + FLOW_LEN + ' · tohum ' + S.flow.seed + '</div>' +
        (S.flow.et && S.flow.ei === S.flow.i ? '<p class="whisper">🪶 ' + esc(S.flow.et) + '</p>' : '');
    }
    var ch = Data.chapters[ci];
    var h = '<div class="kicker">' + (ci + 1) + '. durak · ' + esc(ch.title) + ' · ' + (si + 1) + '/' + ch.scenes.length + '</div>';
    if (sc.t !== 'story' && two()) {
      h += '<div class="turn">' + (sc.t === 'talk' ? 'Birlikte: önce birbirinize anlatın, sonra yazın.' : 'Sıra: ' + esc(S.players[S.turn].n)) + '</div>';
    }
    return h;
  }

  function goNext(ci, si) {
    var ch = Data.chapters[ci];
    S.pos[ch.id] = si + 1;
    store();
    if (si + 1 < ch.scenes.length) return renderScene(ci, si + 1);
    if (ci === Data.chapters.length - 1 && S.done.length === TOTAL) return renderEnding();
    renderChapterEnd(ci);
  }

  function renderChapterEnd(ci) {
    var ch = Data.chapters[ci];
    var nxt = Data.chapters[ci + 1];
    var okay = chapterDone(ch);
    show(
      '<div class="center" style="padding-top:6vh"><div style="font-size:54px">' + ch.icon + '</div>' +
      '<h2>' + esc(ch.title) + ' durağı geride kaldı</h2>' +
      '<p class="dim">Toplanan tüy: ' + S.done.length + ' / ' + TOTAL + '. Yolculuğun bu tarayıcıda saklandı.</p>' +
      '<div class="card" style="text-align:left"><div class="kicker">Birine anlat</div><p style="margin:0 0 12px">' + esc(ch.tell) + '</p>' +
      '<button class="btn alt" id="tcp">Kopyala</button> <span class="small dim" id="tcs"></span></div>' +
      '<div class="row mid mt">' +
      (nxt && okay ? '<button class="btn" id="nx">Sıradaki durak: ' + esc(nxt.title) + '</button>' : '') +
      '<button class="btn alt" id="mp">Harita</button></div></div>', true);
    on('#tcp', 'click', function () { copyText(ch.tell, app.querySelector('#tcs')); });
    on('#nx', 'click', function () { playChapter(ci + 1); });
    on('#mp', 'click', renderMap);
  }

  /* Tüyü ve ışığı verir, ardından tüy kartını gösterir. Tekrar oynamada hiçbir şey değişmez. */
  function award(sc, light, bet, correct, then) {
    if (has(sc.id)) return then();
    S.done.push(sc.id);
    var p = S.players[S.turn];
    p.l = Math.max(0, p.l + light);
    if (bet) { S.cal[bet][1]++; if (correct) S.cal[bet][0]++; }
    if (two() && sc.t !== 'talk') S.turn = (S.turn + 1) % S.players.length;
    store();
    renderStatus();
    var b = birdById[sc.bird];
    openModal(
      '<div class="fcard"><span class="big">' + b.e + '</span>' +
      '<div class="kicker">' + sc.id + '. tüy</div><h3>' + esc(b.n) + '</h3>' +
      '<p>' + esc(b.f) + '</p><button class="btn" id="f-ok">Devam</button></div>');
    modalBox.querySelector('#f-ok').addEventListener('click', function () { closeModal(); then(); });
  }

  function doneBlock(sc, verdict, cls) {
    return '<div class="explain">' + (verdict ? '<div class="verdict ' + cls + '">' + verdict + '</div>' : '') +
      '<p>' + esc(sc.x) + '</p>' + (sc.src ? '<p class="small dim">Kaynak: ' + esc(sc.src) + '</p>' : '') +
      '</div><div class="mt"><button class="btn" id="cont">Devam</button></div>';
  }
  function finish(ci, si, sc, light, verdict, cls, bet, correct) {
    var box = app.querySelector('#after');
    box.innerHTML = doneBlock(sc, verdict, cls);
    box.querySelector('#cont').addEventListener('click', function () {
      if (FLOW) return flowDone(sc, light, correct, bet);
      award(sc, light, bet, correct, function () { goNext(ci, si); });
    });
    box.querySelector('#cont').focus();
  }
  function lightText(n) { return (n > 0 ? '+' : '') + n + ' ışık'; }
  function replayNote(sc) {
    return has(sc.id) ? '<p class="small dim">Bu tüyü daha önce aldın; yeniden oynuyorsun, ışık değişmez.</p>' : '';
  }

  function renderScene(ci, si) {
    var sc = Data.chapters[ci].scenes[si];
    FLOW = null;
    setWorld(Data.chapters[ci].id);
    SCENES[sc.t](ci, si, sc);
  }

  var SCENES = {};

  SCENES.story = function (ci, si, sc) {
    show(head(ci, si, sc) + '<h2>' + esc(sc.title || '') + '</h2><div class="story mt">' +
      sc.p.map(function (p) { return '<p>' + esc(p) + '</p>'; }).join('') +
      '</div><button class="btn" id="cont">Devam</button>', true, true);
    on('#cont', 'click', function () { goNext(ci, si); });
  };

  /* Çoktan seçmeli soru ve "hangisi yalan": önce seçim, sonra bahis. */
  SCENES.quiz = SCENES.lie = function (ci, si, sc) {
    var pick = -1;
    show(head(ci, si, sc) + replayNote(sc) + '<p class="q">' + esc(sc.q) + '</p>' +
      (sc.verse ? '<div class="verse">' + sc.verse.map(esc).join('<br>') + '</div>' : '') +
      (sc.micro ? '<div class="card"><div class="micro" id="mi">' + esc(sc.micro) + '</div>' +
        '<label for="mz">Büyüteç</label><input type="range" id="mz" min="2" max="20" value="2"></div><br>' : '') +
      '<div class="opts">' +
      shuffle(sc.o.map(function (_, i) { return i; })).map(function (i) { return '<button class="opt" data-i="' + i + '">' + esc(sc.o[i]) + '</button>'; }).join('') +
      '</div><div id="bets" hidden><p class="small dim" style="margin:16px 0 0">Ne kadar eminsin? Doğruysa o kadar ışık kazanır, yanlışsa o kadar kaybedersin.</p><div class="bets">' +
      BETS.map(function (b) { return '<button class="bet" data-b="' + b[0] + '"><b>' + b[0] + '</b>' + b[1] + '</button>'; }).join('') +
      '</div></div><div id="after"></div>', true, true);
    var opts = app.querySelectorAll('.opt');
    on('#mz', 'input', function (e) { app.querySelector('#mi').style.fontSize = e.target.value + 'px'; });
    opts.forEach(function (b) {
      b.addEventListener('click', function () {
        pick = +b.getAttribute('data-i');
        opts.forEach(function (x) { x.classList.toggle('sel', x === b); });
        app.querySelector('#bets').hidden = false;
      });
    });
    app.querySelectorAll('.bet').forEach(function (b) {
      b.addEventListener('click', function () {
        var bet = +b.getAttribute('data-b');
        var ok = pick === sc.a;
        opts.forEach(function (x) {
          var i = +x.getAttribute('data-i');
          x.disabled = true;
          x.classList.remove('sel');
          if (i === sc.a) x.classList.add('right'); else if (i === pick) x.classList.add('wrong');
        });
        app.querySelector('#bets').hidden = true;
        var light = Core.score(bet, ok);
        finish(ci, si, sc, light, (ok ? 'Doğru. ' : 'Yanlış. ') + (has(sc.id) ? '' : lightText(light)), ok ? 'ok' : 'no', bet, ok);
      });
    });
  };

  SCENES.order = function (ci, si, sc) {
    var order = shuffle(sc.items.map(function (_, i) { return i; }));
    if (order.every(function (v, i) { return v === i; })) order.reverse();
    var tries = 0, locked = false;
    show(head(ci, si, sc) + replayNote(sc) + '<p class="q">' + esc(sc.q) + '</p><div class="order" id="ord"></div>' +
      '<p class="small" id="msg" style="color:var(--rose);min-height:1.5em;margin-top:10px"></p>' +
      '<button class="btn" id="chk">Kontrol et</button><div id="after"></div>', true, true);
    function draw() {
      var el = app.querySelector('#ord');
      el.innerHTML = order.map(function (v, i) {
        return '<div class="oitem"><span>' + esc(sc.items[v]) + '</span>' +
          '<button data-m="-1" data-i="' + i + '" aria-label="Yukarı taşı"' + (i === 0 || locked ? ' disabled' : '') + '>↑</button>' +
          '<button data-m="1" data-i="' + i + '" aria-label="Aşağı taşı"' + (i === order.length - 1 || locked ? ' disabled' : '') + '>↓</button></div>';
      }).join('');
      el.querySelectorAll('button').forEach(function (b) {
        b.addEventListener('click', function () {
          var i = +b.getAttribute('data-i'), j = i + (+b.getAttribute('data-m'));
          var t = order[i]; order[i] = order[j]; order[j] = t;
          draw();
        });
      });
    }
    draw();
    on('#chk', 'click', function () {
      tries++;
      var right = order.filter(function (v, i) { return v === i; }).length;
      if (right < order.length) {
        app.querySelector('#msg').textContent = right + ' tanesi doğru yerde. Bir daha dene.';
        return;
      }
      locked = true; draw();
      app.querySelector('#msg').textContent = '';
      app.querySelector('#chk').hidden = true;
      var light = Math.max(1, 4 - tries);
      finish(ci, si, sc, light, 'Sıra doğru. ' + (has(sc.id) ? '' : lightText(light)), 'ok');
    });
  };

  SCENES.memory = function (ci, si, sc) {
    var isText = sc.pairs[0][0] !== sc.pairs[0][1];
    var cards = [];
    sc.pairs.forEach(function (p, k) { cards.push({ k: k, s: p[0] }); cards.push({ k: k, s: p[1] }); });
    cards = shuffle(cards);
    var openIdx = [], hits = 0, busy = false, my = epoch + 1;
    show(head(ci, si, sc) + replayNote(sc) + '<p class="q">' + esc(sc.q) + '</p><div class="mem' + (isText ? ' txt' : '') + '">' +
      cards.map(function (c, i) { return '<button class="mc down" data-i="' + i + '" aria-label="Kapalı kart"><span>' + esc(c.s) + '</span></button>'; }).join('') +
      '</div><div id="after"></div>', true, true);
    var els = app.querySelectorAll('.mc');
    els.forEach(function (b) {
      b.addEventListener('click', function () {
        var i = +b.getAttribute('data-i');
        if (busy || !b.classList.contains('down')) return;
        b.classList.remove('down'); b.setAttribute('aria-label', cards[i].s);
        openIdx.push(i);
        if (openIdx.length < 2) return;
        var a = openIdx[0], c = openIdx[1];
        openIdx = [];
        if (cards[a].k === cards[c].k) {
          els[a].classList.add('hit'); els[c].classList.add('hit');
          els[a].disabled = els[c].disabled = true;
          if (++hits === sc.pairs.length) finish(ci, si, sc, 2, 'Hepsi eşleşti. ' + (has(sc.id) ? '' : lightText(2)), 'ok');
          return;
        }
        busy = true;
        setTimeout(function () {
          if (epoch !== my) return;
          [a, c].forEach(function (x) { els[x].classList.add('down'); els[x].setAttribute('aria-label', 'Kapalı kart'); });
          busy = false;
        }, 900);
      });
    });
  };

  SCENES.cipher = function (ci, si, sc) {
    var secret = Core.caesar(sc.plain, sc.shift);
    show(head(ci, si, sc) + replayNote(sc) + '<p class="q">' + esc(sc.q) + '</p>' +
      '<div class="card"><div class="cipher" id="ct">' + esc(secret) + '</div>' +
      '<label for="sh">Kaydırma: <span id="shv">0</span> harf</label>' +
      '<input type="range" id="sh" min="0" max="' + (Core.ALPHABET.length - 1) + '" value="0"></div>' +
      '<div id="after"></div>', true, true);
    var sl = app.querySelector('#sh');
    sl.addEventListener('input', function () {
      var k = +sl.value;
      app.querySelector('#shv').textContent = k;
      app.querySelector('#ct').textContent = Core.caesar(secret, -k);
      if (k === sc.shift) {
        sl.disabled = true;
        finish(ci, si, sc, 2, 'Çözüldü. ' + (has(sc.id) ? '' : lightText(2)), 'ok');
      }
    });
  };

  SCENES.haiku = function (ci, si, sc) {
    var want = [5, 7, 5];
    show(head(ci, si, sc) + replayNote(sc) + '<p class="q">' + esc(sc.q) + '</p>' +
      '<blockquote>' + sc.example.map(esc).join('<br>') + '</blockquote>' +
      want.map(function (w, i) {
        return '<div class="hline"><input type="text" class="hl" maxlength="60" aria-label="' + (i + 1) + '. dize, ' + w + ' hece" placeholder="' + w + ' hece">' +
          '<span class="hcount" data-i="' + i + '">0/' + w + '</span></div>';
      }).join('') +
      '<div class="row"><button class="btn" id="hk" disabled>Deftere yaz</button>' +
      '<button class="ghost" id="free">Hece saymadan yaz</button></div><div id="after"></div>', true, true);
    var ins = app.querySelectorAll('.hl');
    function lines() { return Array.prototype.map.call(ins, function (x) { return x.value.trim(); }); }
    function upd() {
      var r = Core.haikuCheck(lines());
      app.querySelectorAll('.hcount').forEach(function (el, i) {
        el.textContent = r.counts[i] + '/' + want[i];
        el.classList.toggle('ok', r.counts[i] === want[i]);
      });
      app.querySelector('#hk').disabled = !r.ok;
    }
    ins.forEach(function (x) { x.addEventListener('input', upd); });
    function done(light) {
      var ls = lines();
      if (!ls.join('')) return;
      S.notes[sc.id] = ls.join('\n'); store();
      ins.forEach(function (x) { x.disabled = true; });
      app.querySelector('#hk').hidden = app.querySelector('#free').hidden = true;
      finish(ci, si, sc, light, 'Haikun defterine yazıldı. ' + (has(sc.id) ? '' : lightText(light)), 'ok');
    }
    on('#hk', 'click', function () { done(3); });
    on('#free', 'click', function () { done(1); });
  };

  SCENES.talk = function (ci, si, sc) {
    show(head(ci, si, sc) + replayNote(sc) + '<p class="q">' + esc(sc.q) + '</p>' +
      '<textarea id="tx" maxlength="600" aria-label="Yanıtın">' + esc(S.notes[sc.id] || '') + '</textarea>' +
      '<p class="small dim">Doğru ya da yanlış yanıt yok. Yazdığın yalnızca senin defterinde durur.</p>' +
      '<button class="btn" id="ok">Deftere yaz</button><div id="after"></div>', true, true);
    on('#ok', 'click', function () {
      var v = app.querySelector('#tx').value.trim();
      if (v.length < 3) { app.querySelector('#tx').focus(); return; }
      S.notes[sc.id] = v; store();
      app.querySelector('#tx').disabled = true;
      app.querySelector('#ok').hidden = true;
      finish(ci, si, sc, 2, 'Yazıldı. ' + (has(sc.id) ? '' : lightText(2)), 'ok');
    });
  };

  SCENES.breath = function (ci, si, sc) {
    show(head(ci, si, sc) + replayNote(sc) + '<p class="q">' + esc(sc.q) + '</p>' +
      '<div class="breath"><div class="ring" id="ring"></div><div class="btext" id="bt" aria-live="polite">Hazır olduğunda başla.</div>' +
      '<div class="row mid"><button class="btn" id="go">Başla</button><button class="ghost" id="skip">Geç</button></div></div>' +
      '<div id="after"></div>', true, true);
    var my = epoch, ring = app.querySelector('#ring'), bt = app.querySelector('#bt');
    function end(light, v) {
      app.querySelector('#go').hidden = app.querySelector('#skip').hidden = true;
      ring.className = 'ring';
      bt.textContent = '';
      my = -1;
      finish(ci, si, sc, light, v + (has(sc.id) ? '' : lightText(light)), 'ok');
    }
    var steps = [['Nefes al', 'ring in', 4000], ['Tut', 'ring in', 4000], ['Yavaşça ver', 'ring out', 6000]];
    function run(round, k) {
      if (epoch !== my) return;
      if (round === 3) return end(2, 'Üç tur tamam. ');
      var s = steps[k];
      bt.textContent = s[0] + ' · ' + (round + 1) + '/3';
      ring.className = s[1];
      setTimeout(function () { k === 2 ? run(round + 1, 0) : run(round, k + 1); }, s[2]);
    }
    on('#go', 'click', function () { app.querySelector('#go').hidden = true; run(0, 0); });
    on('#skip', 'click', function () { end(1, 'Geçildi. '); });
  };

  /* Uçuş: otuz saniye boyunca ışık topla, fırtınadan kaç. */
  SCENES.flight = function (ci, si, sc) {
    var W = 640, H = 360, DUR = 30;
    show(head(ci, si, sc) + replayNote(sc) + '<p class="q">' + esc(sc.q) + '</p>' +
      '<canvas id="fly" width="' + W + '" height="' + H + '" aria-label="Uçuş oyunu alanı"></canvas>' +
      '<p class="small dim" id="hud" style="margin-top:8px">Fareyi ya da parmağını oyun alanında yukarı aşağı gezdir; klavyede ↑ ↓.</p>' +
      '<div class="row"><button class="btn" id="go">Havalan</button><button class="ghost" id="skip">Geç</button></div><div id="after"></div>', true, true);
    var my = epoch, cv = app.querySelector('#fly'), ctx = cv.getContext && cv.getContext('2d');
    var y = H / 2, ty = H / 2, got = 0, things = [], t0 = 0, last = 0, spawn = 0, flash = 0, keys = {};
    function end(light, v) {
      my = -1;
      window.removeEventListener('keydown', kd); window.removeEventListener('keyup', ku);
      app.querySelector('#go').hidden = app.querySelector('#skip').hidden = true;
      finish(ci, si, sc, light, v + (has(sc.id) ? '' : lightText(light)), 'ok');
    }
    function kd(e) { if (e.key === 'ArrowUp' || e.key === 'ArrowDown') { keys[e.key] = true; e.preventDefault(); } }
    function ku(e) { keys[e.key] = false; }
    function point(e) {
      var r = cv.getBoundingClientRect();
      ty = (e.clientY - r.top) / r.height * H;
    }
    function frame(now) {
      if (epoch !== my) return;
      if (!t0) { t0 = last = now; }
      var dt = Math.min(50, now - last) / 1000; last = now;
      var el = (now - t0) / 1000;
      if (keys.ArrowUp) ty -= 320 * dt;
      if (keys.ArrowDown) ty += 320 * dt;
      ty = Math.max(24, Math.min(H - 24, ty));
      y += (ty - y) * Math.min(1, dt * 9);
      spawn -= dt;
      if (spawn <= 0) {
        spawn = 0.45;
        things.push({ x: W + 20, y: 30 + Math.random() * (H - 60), bad: Math.random() < 0.3, v: 170 + Math.random() * 90 + el * 3 });
      }
      things.forEach(function (o) {
        o.x -= o.v * dt;
        if (!o.gone && Math.abs(o.x - 90) < 26 && Math.abs(o.y - y) < 26) {
          o.gone = true;
          if (o.bad) { got = Math.max(0, got - 2); flash = 0.25; } else got++;
        }
      });
      things = things.filter(function (o) { return o.x > -30 && !o.gone; });
      flash = Math.max(0, flash - dt);
      ctx.clearRect(0, 0, W, H);
      if (flash) { ctx.fillStyle = 'rgba(229,138,138,.25)'; ctx.fillRect(0, 0, W, H); }
      ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      things.forEach(function (o) {
        ctx.font = o.bad ? '34px serif' : '26px serif';
        ctx.fillStyle = '#f6c56b';
        ctx.fillText(o.bad ? '🌩️' : '✦', o.x, o.y);
      });
      ctx.font = '36px serif';
      ctx.save(); ctx.translate(90, y); ctx.scale(-1, 1); ctx.fillText('🕊️', 0, 0); ctx.restore();
      app.querySelector('#hud').textContent = 'Işık: ' + got + ' · Kalan: ' + Math.max(0, Math.ceil(DUR - el)) + ' sn';
      if (el >= DUR) return end(1 + Math.min(3, Math.floor(got / 6)), got + ' ışık topladın. ');
      requestAnimationFrame(frame);
    }
    on('#go', 'click', function () {
      if (!ctx) return end(1, 'Bu tarayıcıda uçuş alanı açılamadı. ');
      app.querySelector('#go').hidden = true;
      cv.addEventListener('pointermove', point); cv.addEventListener('pointerdown', point);
      window.addEventListener('keydown', kd); window.addEventListener('keyup', ku);
      requestAnimationFrame(frame);
    });
    on('#skip', 'click', function () { end(1, 'Geçildi. '); });
  };

  /* İkilem: doğru yanıtı olmayan seçim. Seçim deftere yazılır. */
  SCENES.dilemma = function (ci, si, sc) {
    show(head(ci, si, sc) + '<p class="q">' + esc(sc.q) + '</p><div class="opts">' +
      sc.o.map(function (o, i) { return '<button class="opt" data-i="' + i + '">' + esc(o) + '</button>'; }).join('') +
      '</div><p class="small dim" style="margin-top:12px">Doğru yanıt yok. Seçimin defterine yazılır.</p><div id="after"></div>', true, true);
    var opts = app.querySelectorAll('.opt');
    opts.forEach(function (b) {
      b.addEventListener('click', function () {
        opts.forEach(function (x) { x.disabled = true; });
        b.classList.add('sel');
        LAST.pick = +b.getAttribute('data-i');
        S.notes[sc.id] = sc.o[LAST.pick]; store();
        finish(ci, si, sc, 1, 'Seçimin yazıldı. ' + lightText(1), 'ok');
      });
    });
  };

  /* Lipogram: yasaklı harfi kullanmadan yaz. */
  SCENES.lipo = function (ci, si, sc) {
    show(head(ci, si, sc) + '<p class="q">' + esc(sc.q) + '</p>' +
      '<textarea id="tx" maxlength="300" aria-label="Cümlen"></textarea>' +
      '<p class="small" id="lp" style="min-height:1.5em"></p>' +
      '<div class="row"><button class="btn" id="ok" disabled>Yazdım</button><button class="ghost" id="skip">Geç</button></div><div id="after"></div>', true, true);
    var tx = app.querySelector('#tx'), lp = app.querySelector('#lp');
    tx.addEventListener('input', function () {
      var r = Core.lipoCheck(tx.value, sc.ban, sc.min);
      lp.style.color = r.hits ? 'var(--rose)' : 'var(--leaf)';
      lp.textContent = r.hits ? 'İçinde ' + r.hits + ' tane “' + sc.ban + '” var.' : r.words + ' / ' + sc.min + ' sözcük, “' + sc.ban + '” yok.';
      app.querySelector('#ok').disabled = !r.ok;
    });
    function end(light, v) {
      tx.disabled = true;
      app.querySelector('#ok').hidden = app.querySelector('#skip').hidden = true;
      finish(ci, si, sc, light, v + lightText(light), 'ok');
    }
    on('#ok', 'click', function () { LAST.lipo = true; S.notes[sc.id] = tx.value.trim(); store(); end(3, 'Başardın. '); });
    on('#skip', 'click', function () { end(0, 'Geçildi. '); });
  };

  /* Hızlı tur: süreli doğru / efsane. */
  SCENES.rapid = function (ci, si, sc) {
    var LIMIT = 6000;
    show(head(ci, si, sc) + '<p class="q">' + esc(sc.q) + '</p>' +
      '<div class="card rapid"><div class="tbar"><i id="tb"></i></div><p id="rs" class="rstmt">Hazır mısın?</p>' +
      '<div class="row mid" id="rb" hidden><button class="btn" data-v="1">Doğru</button><button class="btn alt" data-v="0">Efsane</button></div></div>' +
      '<div class="row mt" id="rgo"><button class="btn" id="go">Başla</button><button class="ghost" id="slow">Süresiz oyna</button></div>' +
      '<div id="res"></div><div id="after"></div>', true, true);
    var my = epoch, k = -1, right = 0, timed = true, timer = null, log = [];
    var tb = app.querySelector('#tb');
    function next() {
      if (epoch !== my) return;
      clearTimeout(timer);
      k++;
      if (k >= sc.items.length) return end();
      app.querySelector('#rs').textContent = sc.items[k][0];
      if (timed) {
        tb.style.transition = 'none'; tb.style.width = '100%';
        void tb.offsetWidth;
        tb.style.transition = 'width ' + LIMIT + 'ms linear'; tb.style.width = '0%';
        timer = setTimeout(function () { answer(null); }, LIMIT);
      }
    }
    function answer(v) {
      if (epoch !== my || k < 0 || k >= sc.items.length) return;
      var ok = v !== null && v === sc.items[k][1];
      if (ok) right++;
      log.push([sc.items[k][0], sc.items[k][1], ok, sc.items[k][2]]);
      next();
    }
    function end() {
      my = -1;
      app.querySelector('.rapid').hidden = true;
      app.querySelector('#res').innerHTML = '<div class="rlog">' + log.map(function (l) {
        return '<div class="' + (l[2] ? 'ok' : 'no') + '">' + (l[2] ? '✓' : '✗') + ' ' + esc(l[0]) + ' <b>' + (l[1] ? 'Doğru' : 'Efsane') + '</b>' + (l[3] ? '<br><span class="dim">' + esc(l[3]) + '</span>' : '') + '</div>';
      }).join('') + '</div>';
      var light = Math.floor(right / 2);
      LAST.rp = right;
      finish(ci, si, sc, light, right + ' / ' + sc.items.length + ' bildin. ' + lightText(light), right * 2 >= sc.items.length ? 'ok' : 'no', null, right * 2 >= sc.items.length);
    }
    function start(t) {
      timed = t;
      app.querySelector('#rgo').hidden = true;
      app.querySelector('#rb').hidden = false;
      app.querySelector('.tbar').style.visibility = t ? 'visible' : 'hidden';
      next();
    }
    app.querySelectorAll('#rb button').forEach(function (b) {
      b.addEventListener('click', function () { answer(b.getAttribute('data-v') === '1'); });
    });
    on('#go', 'click', function () { start(true); });
    on('#slow', 'click', function () { start(false); });
  };

  /* ---------- Akış: tohumla belirlenen on iki kartlık kısa tur ---------- */
  function flowDeck() { return Core.flowDeck(S.flow.seed, Data.flow, FLOW_LEN); }
  function randomSeed() { return 100000 + Math.floor(Math.random() * 900000); }

  function renderFlowStart(prefill) {
    if (typeof prefill !== 'string') prefill = '';
    var cur = S.flow && S.flow.i < FLOW_LEN ? S.flow : null;
    show(
      '<div class="kicker">Akış</div><h2>On iki kart, on iki dünya</h2>' +
      '<p class="dim">Her kart başka bir yerden gelir: bir dize, bir film, bir görenek, bir düşünce deneyi, bir hızlı tur. Kartlar bir iki dakika sürer.</p>' +
      '<p class="dim">Kartları altı haneli bir <b>tohum</b> belirler. Aynı tohumu giren herkes aynı kartları aynı sırayla görür: tohumu bir arkadaşına ver, sonuçlarınızı karşılaştırın. Yarıda bırakırsan tohum ve kaldığın kart saklanır.</p>' +
      (cur ? '<div class="card" style="margin-bottom:18px"><p style="margin:0 0 12px">Yarım kalan akış: tohum <b>' + cur.seed + '</b>, ' + (cur.i + 1) + '. kart.</p><button class="btn" id="fgo">Sürdür</button></div>' : '') +
      '<label for="seed">Tohum ya da bir arkadaşının meydan okuma kodu (boş bırakırsan rastgele tohum seçilir)</label>' +
      '<input type="text" id="seed" placeholder="örneğin 271828" value="' + esc(prefill || '') + '">' +
      '<p class="small" id="serr" style="color:var(--rose);min-height:1.4em"></p>' +
      '<label for="fname">Adın (karşılaştırma tablosunda görünür)</label>' +
      '<input type="text" id="fname" maxlength="20" style="max-width:220px" value="' + esc(S.players[0].n) + '">' +
      '<div class="row mt"><button class="btn' + (cur ? ' alt' : '') + '" id="fnew">Yeni akış başlat</button><button class="ghost" id="back">Geri</button></div>', false);
    on('#fgo', 'click', renderFlowCard);
    on('#fnew', 'click', function () {
      var raw = app.querySelector('#seed').value.trim();
      S.players[0].n = app.querySelector('#fname').value.trim() || S.players[0].n;
      var at = raw.indexOf('#m=');
      if (at !== -1) raw = raw.slice(at + 3);
      var duel = null, v = NaN;
      if (/^\d{1,6}$/.test(raw)) v = parseInt(raw, 10);
      else if (raw) {
        duel = Core.decodeDuel(raw);
        if (!duel) { app.querySelector('#serr').textContent = 'Bu ne bir tohum ne de okunabilir bir kod.'; return; }
        v = duel.s;
      }
      S.flow = { seed: v >= 1 && v <= 999999 ? v : randomSeed(), i: 0, l: 0, ok: 0, n: 0, r: [], mem: { run: 0, used: {} }, vs: duel };
      store(); renderFlowCard();
    });
    on('#back', 'click', function () { S.done.length || Object.keys(S.pos).length ? renderMap() : renderTitle(); });
  }

  function renderFlowCard() {
    var base = Data.flow[flowDeck()[S.flow.i]];
    if (!base) return renderFlowEnd();
    var card = Core.buildCard(base, S.flow.seed, S.flow.i);
    var f = S.flow;
    if (!f.mem) f.mem = { run: 0, used: {} };
    if (!f.r) f.r = [];
    if (f.ei !== f.i) {
      var e = Core.echo(f.mem, card);
      f.ei = f.i; f.et = e ? e.text : '';
      if (e) f.mem.used[e.k] = 1;
      store();
    }
    LAST = {};
    FLOW = card;
    setWorld(card.w);
    SCENES[card.t](-1, -1, card);
    bar.hidden = true;
    var exit = document.createElement('div');
    exit.className = 'row mt';
    exit.innerHTML = '<button class="ghost" id="fexit">Akıştan çık (kaldığın yer saklanır)</button>';
    app.appendChild(exit);
    exit.querySelector('#fexit').addEventListener('click', renderFlowStart);
  }

  function flowDone(sc, light, correct, bet) {
    var m = S.flow.mem;
    var isQ = sc.t === 'quiz' || sc.t === 'lie';
    if (isQ) m.b3w = bet === 3 && !correct;
    if (typeof correct === 'boolean') m.run = correct ? Math.max(1, m.run + 1) : Math.min(-1, m.run - 1);
    if (sc.id === 137) m.m = LAST.pick;
    if (sc.id === 138) m.t = LAST.pick;
    if (sc.id === 114) m.c = LAST.pick;
    if (sc.t === 'rapid') m.rp = LAST.rp;
    if (LAST.lipo) m.lp = true;
    S.flow.r.push(sc.t === 'dilemma' ? 'd' + LAST.pick : sc.t === 'rapid' ? 'r' + LAST.rp : typeof correct === 'boolean' ? (correct ? '1' : '0') : '-');
    S.flow.i++;
    S.flow.l = Math.max(0, S.flow.l + light);
    if (typeof correct === 'boolean') { S.flow.n++; if (correct) S.flow.ok++; }
    store();
    S.flow.i < FLOW_LEN ? renderFlowCard() : renderFlowEnd();
  }

  function renderFlowEnd() {
    var f = S.flow;
    var code = Core.encodeDuel({ s: f.seed, n: S.players[0].n, l: f.l, r: f.r || [] });
    var link = location.href.split('#')[0] + '#m=' + code;
    var line = 'Otuz Kuş · tohum ' + f.seed + ' · ' + f.ok + '/' + f.n + ' doğru · ' + f.l + ' ışık. Aynı kartları sen de oyna, sonuçlarımız yan yana gelsin: ' + link;
    var deck = flowDeck(), cmp = '';
    function lab(v, card) {
      if (v === undefined) return '·';
      if (v === '1') return '✓'; if (v === '0') return '✗';
      if (v[0] === 'r') return v.slice(1) + '/8';
      if (v[0] === 'd') return esc((card.o[+v.slice(1)] || '').split('.')[0]);
      return '·';
    }
    if (f.vs) {
      var diff = 0, rows = '';
      deck.forEach(function (ix, i) {
        var card = Core.buildCard(Data.flow[ix], f.seed, i), a = (f.r || [])[i], b = f.vs.r[i];
        var differs = a !== b && a !== '-' && a !== undefined && b !== undefined;
        if (differs) diff++;
        rows += '<tr' + (differs ? ' class="df"' : '') + '><td>' + (i + 1) + '. ' + esc(Data.worlds[card.w]) + '</td><td>' + lab(a, card) + '</td><td>' + lab(b, card) + '</td></tr>';
      });
      cmp = '<div class="card mt" style="text-align:left"><h3>' + esc(S.players[0].n) + ' ile ' + esc(f.vs.n) + '</h3>' +
        '<table><tr><th>Kart</th><th>' + esc(S.players[0].n) + '</th><th>' + esc(f.vs.n) + '</th></tr>' + rows + '</table>' +
        '<p class="small" style="margin:12px 0 0">' + (diff ? diff + ' kartta ayrı düştünüz. Işık: ' + f.l + ' ve ' + f.vs.l + '. Asıl konuşulacak olanlar işaretli satırlar.' : 'Bütün kartlarda aynı sonuca vardınız. Işık: ' + f.l + ' ve ' + f.vs.l + '.') + '</p></div>';
    }
    show(
      '<div class="center" style="padding-top:5vh"><div style="font-size:54px">🌱</div><div class="kicker">Akış bitti</div>' +
      '<h2>Tohum ' + f.seed + '</h2><p>' + f.ok + ' / ' + f.n + ' doğru · ' + f.l + ' ışık</p>' +
      cmp +
      '<div class="card mt" style="text-align:left"><div class="kicker">Meydan oku</div>' +
      '<p class="small" style="margin:0 0 10px">Bağlantıyı ya da kodu birine gönder. O da aynı on iki kartı oynar; sonunda ikinizin yanıtları yan yana çıkar. Sunucu yok: sonuçların kodun içinde taşınır.</p>' +
      '<div class="code">' + esc(code) + '</div>' +
      '<div class="row" style="margin-top:10px"><button class="btn alt" id="fcp">Bağlantılı mesajı kopyala</button><button class="btn alt" id="fcc">Yalnızca kodu kopyala</button> <span class="small dim" id="fcs"></span></div></div>' +
      '<div class="row mid mt"><button class="btn" id="again">Yeni akış</button><button class="btn alt" id="book">Tüy defteri</button><button class="ghost" id="home">Ana ekran</button></div></div>', false);
    on('#fcp', 'click', function () { copyText(line, app.querySelector('#fcs')); });
    on('#fcc', 'click', function () { copyText(code, app.querySelector('#fcs')); });
    on('#again', 'click', renderFlowStart);
    on('#book', 'click', renderBook);
    on('#home', 'click', function () { renderTitle(); });
  }

  function copyText(text, sayEl) {
    function ok() { sayEl.textContent = 'Kopyalandı.'; }
    function manual() { sayEl.textContent = 'Kopyalanamadı; metni elle seçip kopyala.'; }
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, manual);
      else manual();
    } catch (e) { manual(); }
  }

  /* ---------- defter, kayıt, son ---------- */
  function sceneById(id) {
    var out = null;
    Data.chapters.forEach(function (ch) { ch.scenes.forEach(function (s) { if (s.id === id) out = s; }); });
    Data.flow.forEach(function (s) { if (s.id === id) out = s; });
    return out;
  }

  function renderBook() {
    var h = '<div class="kicker">Tüy defteri</div><h2>' + S.done.length + ' / ' + TOTAL + ' tüy</h2><div class="feathers mt">';
    for (var id = 1; id <= TOTAL; id++) {
      var sc = sceneById(id), b = birdById[sc.bird];
      h += has(id)
        ? '<div class="fth"><span class="e">' + b.e + '</span> <b>' + esc(b.n) + '</b><br>' + esc(b.f) + '</div>'
        : '<div class="fth no"><span class="e">🪶</span> <b>' + id + '. tüy</b><br>Henüz bulunmadı.</div>';
    }
    h += '</div>';
    var ids = Object.keys(S.notes).map(Number).sort(function (a, b) { return a - b; });
    if (ids.length) {
      h += '<h3 class="mt">Yazdıkların</h3>';
      ids.forEach(function (id) {
        var sc = sceneById(id);
        h += '<p class="small dim" style="margin-bottom:6px">' + esc(sc ? sc.q : '') + '</p><div class="note">' + esc(S.notes[id]) + '</div>';
      });
    }
    h += '<div class="mt"><button class="btn alt" id="mp">Harita</button></div>';
    show(h, true);
    on('#mp', 'click', renderMap);
  }

  function saveDialog() {
    if (!S) return;
    var code = Core.encodeSave(S);
    var link = location.href.split('#')[0] + '#k=' + code;
    openModal(
      '<h3>Yolculuğunu yanında taşı</h3>' +
      '<p class="small">İlerlemen bu tarayıcıda kendiliğinden saklanıyor. Başka bir cihazda ya da tarayıcıda sürdürmek için aşağıdaki bağlantıyı aç ya da kodu "Tüy koduyla devam et"e yapıştır.</p>' +
      '<div class="code" id="cd">' + esc(code) + '</div>' +
      '<p class="small dim" id="cp" style="min-height:1.4em;margin:8px 0"></p>' +
      '<div class="row"><button class="btn" id="c1">Bağlantıyı kopyala</button><button class="btn alt" id="c2">Kodu kopyala</button><button class="ghost" data-close>Kapat</button></div>');
    function copy(text) {
      var say = modalBox.querySelector('#cp');
      function ok() { say.textContent = 'Kopyalandı.'; }
      function manual() { say.textContent = 'Kopyalanamadı; kodu elle seçip kopyala.'; }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, manual);
      else manual();
    }
    modalBox.querySelector('#c1').addEventListener('click', function () { copy(link); });
    modalBox.querySelector('#c2').addEventListener('click', function () { copy(code); });
    modalBox.querySelector('[data-close]').addEventListener('click', closeModal);
  }

  function renderEnding() {
    var rows = '', pct = {};
    BETS.forEach(function (b) {
      var c = S.cal[b[0]];
      pct[b[0]] = c[1] ? Math.round(c[0] / c[1] * 100) : null;
      rows += '<tr><td>' + b[1] + '</td><td>' + c[0] + ' / ' + c[1] + '</td><td>' + (pct[b[0]] === null ? 'kullanılmadı' : '%' + pct[b[0]]) + '</td></tr>';
    });
    var say;
    if (pct[3] === null && pct[1] === null) say = 'Hep aynı ölçüde emin oldun. Bir dahaki sefere kuşkunu da ölçmeyi dene.';
    else if (pct[3] !== null && pct[1] !== null && pct[3] < pct[1]) say = 'En emin olduğun yanıtlarda, kararsız kaldıklarından daha çok yanıldın. Kesinlik duygusu ile doğruluk aynı şey değil.';
    else if (pct[3] !== null && pct[3] >= 80) say = '"Kalıbımı basarım" dediğinde çoğunlukla haklı çıktın. Ne kadar bildiğini iyi biliyorsun.';
    else if (pct[3] !== null) say = '"Kalıbımı basarım" dediğin yanıtların bir bölümü yanlış çıktı. Emin olmadan önce bir kez daha bakmak iyi bir alışkanlık.';
    else say = 'Hiç "kalıbımı basarım" demedin. Temkin iyidir; ama bildiğin şeyin arkasında durmak da bilgidir.';
    var tot = S.cal[1][1] + S.cal[2][1] + S.cal[3][1], hit = S.cal[1][0] + S.cal[2][0] + S.cal[3][0];
    var kind;
    if (tot && hit / tot >= 0.6 && S.cal[3][1] > S.cal[1][1]) kind = ['Bilgin', 'Çoğunu bildin ve bildiğinin arkasında durdun. Kesinlik senin yolun; yalnız, emin olduğun yerde yeniden bakmayı unutma.'];
    else if (tot && hit / tot >= 0.6) kind = ['Şair', 'Çoğunu bildin ama kesinliğe yaslanmadın. Bildiğin şeyi bile soru olarak taşıyorsun.'];
    else kind = ['Yolcu', 'Bilmediğin çok şey çıktı karşına ve yürümeyi sürdürdün. Bu oyunun anlattığı insanların çoğu da böyle başladı.'];
    var ps = S.players.map(function (p) { return esc(p.n) + ': <b>' + p.l + '</b> ışık'; }).join(' · ');
    show(
      '<div class="center"><div style="font-size:64px">🔥</div><div class="kicker">Otuzuncu tüy</div><h1>Sî murg</h1></div>' +
      '<div class="story mt">' +
      '<p>Otuz tüyü yan yana koyuyorsun. Hüdhüd bir şey söylemiyor; yalnızca kenara çekiliyor. Arkasında bir ayna var.</p>' +
      '<p>Aynada otuz kuş görmeyi bekliyorsun. ' + (two() ? 'Kendinizi görüyorsunuz: ikiniz yan yana.' : 'Kendini görüyorsun.') + '</p>' +
      '<p>"Simurg diye bir kuş yok," diyor Hüdhüd. "Ya da var: ateşi yakan, duvara elini basan, tohumu eken, adını tablete yazan, göğe hikâye uyduran, kendinden kuşku duyan ve yurdunu sözcüklerde taşıyan şey. Hepsi aynı kuşun tüyleriydi."</p>' +
      '<p>"Yol bitmedi. Yalnızca artık kimin yürüdüğünü biliyorsun."</p></div>' +
      '<div class="card mt"><h3>Ne kadar bildiğini ne kadar biliyorsun?</h3>' +
      '<table><tr><th>Bahis</th><th>Doğru / toplam</th><th>İsabet</th></tr>' + rows + '</table>' +
      '<p class="small" style="margin:14px 0 0">' + say + '</p>' +
      '<p class="small dim" style="margin:10px 0 0">' + ps + '</p></div>' +
      '<div class="card mt"><div class="kicker">Yol sana ne dedi</div><h3>' + kind[0] + '</h3><p style="margin:0">' + kind[1] + '</p></div>' +
      '<div class="row mt"><button class="btn" id="book">Tüy defteri</button><button class="btn alt" id="mp">Harita</button></div>', true);
    on('#book', 'click', renderBook);
    on('#mp', 'click', renderMap);
  }

  /* ---------- açılış ---------- */
  document.getElementById('btn-map').addEventListener('click', function () { closeModal(); renderMap(); });
  document.getElementById('btn-save').addEventListener('click', saveDialog);

  (function boot() {
    var mm = /#m=([\w-]+)/.exec(location.hash);
    if (mm) {
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* önemsiz */ }
      S = load() || Core.newState(['Yolcu']); store();
      return renderFlowStart(mm[1]);
    }
    var m = /#k=([\w-]+)/.exec(location.hash);
    if (m) {
      var st = Core.decodeSave(m[1]);
      try { history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* önemsiz */ }
      if (st) { S = st; store(); return renderMap(); }
      return renderTitle('Bağlantıdaki tüy kodu okunamadı.');
    }
    renderTitle();
  })();
})();
