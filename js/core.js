/* Otuz Kuş — saf (ağa ve DOM'a dokunmayan) yardımcı fonksiyonlar.
   Tarayıcıda window.Core, Node'da module.exports olarak kullanılır. */
(function (root) {
  'use strict';

  var VOWELS = 'aeıioöuüâîû';
  var ALPHABET = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ';

  /* Türkçede hece sayısı = ünlü sayısı. */
  function syllables(text) {
    var s = String(text || '').toLocaleLowerCase('tr-TR');
    var n = 0;
    for (var i = 0; i < s.length; i++) if (VOWELS.indexOf(s[i]) !== -1) n++;
    return n;
  }

  /* Üç dize 5-7-5 mi? */
  function haikuCheck(lines) {
    var counts = (lines || []).map(syllables);
    return {
      counts: counts,
      ok: counts.length === 3 && counts[0] === 5 && counts[1] === 7 && counts[2] === 5
    };
  }

  /* Türk alfabesiyle Sezar kaydırması. Alfabe dışı karakterlere dokunmaz. */
  function caesar(text, shift) {
    var n = ALPHABET.length;
    var k = ((shift % n) + n) % n;
    var out = '';
    var s = String(text || '');
    for (var i = 0; i < s.length; i++) {
      var idx = ALPHABET.indexOf(s[i]);
      out += idx === -1 ? s[i] : ALPHABET[(idx + k) % n];
    }
    return out;
  }

  /* Bahisli puan: doğruysa +bahis, yanlışsa -bahis. */
  function score(bet, correct) {
    return correct ? bet : -bet;
  }

  function toB64(str) {
    if (typeof Buffer !== 'undefined') return Buffer.from(str, 'utf8').toString('base64');
    return btoa(unescape(encodeURIComponent(str)));
  }
  function fromB64(b64) {
    if (typeof Buffer !== 'undefined') return Buffer.from(b64, 'base64').toString('utf8');
    return decodeURIComponent(escape(atob(b64)));
  }

  /* Kayıt durumunu taşınabilir bir "tüy kodu"na çevirir (base64url JSON). */
  function encodeSave(state) {
    return toB64(JSON.stringify(state)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  /* Tüy kodunu çözer; geçersizse null döner. */
  function decodeSave(code) {
    try {
      var b64 = String(code || '').trim().replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      var st = JSON.parse(fromB64(b64));
      if (!st || st.v !== 1 || !Array.isArray(st.players) || !Array.isArray(st.done)) return null;
      return st;
    } catch (e) {
      return null;
    }
  }

  function newState(names) {
    return {
      v: 1,
      players: names.map(function (n) { return { n: n, l: 0 }; }),
      turn: 0,
      pos: {},            // bölüm id -> kalınan sahne indeksi
      done: [],           // kazanılan tüy numaraları
      notes: {},          // tüy no -> oyuncunun yazdığı metin
      cal: { 1: [0, 0], 2: [0, 0], 3: [0, 0] } // bahis -> [doğru, toplam]
    };
  }

  /* İçerik bütünlüğü denetimi: hata listesini döner (boşsa içerik sağlam). */
  function validateData(data) {
    var errs = [];
    var seen = {};
    var birdIds = {};
    (data.birds || []).forEach(function (b) { birdIds[b.id] = true; });
    (data.chapters || []).forEach(function (ch) {
      (ch.scenes || []).forEach(function (sc, i) {
        var where = ch.id + '#' + i;
        if (sc.t === 'story') {
          if (!sc.p || !sc.p.length) errs.push(where + ': boş anlatı');
          return;
        }
        if (typeof sc.id !== 'number') errs.push(where + ': tüy numarası yok');
        if (seen[sc.id]) errs.push(where + ': yinelenen tüy ' + sc.id);
        seen[sc.id] = true;
        if (!birdIds[sc.bird]) errs.push(where + ': bilinmeyen kuş ' + sc.bird);
        if (!sc.q) errs.push(where + ': soru metni yok');
        if (sc.t === 'quiz' || sc.t === 'lie') {
          if (!Array.isArray(sc.o) || sc.o.length < 3) errs.push(where + ': seçenek az');
          else if (!(sc.a >= 0 && sc.a < sc.o.length)) errs.push(where + ': yanıt indeksi hatalı');
          if (!sc.x) errs.push(where + ': açıklama yok');
        }
        if (sc.t === 'order' && (!sc.items || sc.items.length < 3)) errs.push(where + ': sıralama öğesi az');
        if (sc.t === 'memory' && (!sc.pairs || sc.pairs.length < 3)) errs.push(where + ': eşleşme çifti az');
        if (sc.t === 'cipher' && caesar(caesar(sc.plain, sc.shift), -sc.shift) !== sc.plain) errs.push(where + ': şifre geri çözülmüyor');
      });
    });
    var total = Object.keys(seen).length;
    for (var k = 1; k <= total; k++) if (!seen[k]) errs.push('tüy ' + k + ' eksik');
    if (total !== 30) errs.push('tüy sayısı 30 değil: ' + total);
    return errs;
  }

  /* Yasaklı harf oyunu (lipogram): metinde yasak harf var mı, yeterince sözcük var mı? */
  function lipoCheck(text, ban, minWords) {
    var s = String(text || '').toLocaleLowerCase('tr-TR');
    var hits = 0;
    for (var i = 0; i < s.length; i++) if (s[i] === ban) hits++;
    var words = s.split(/\s+/).filter(function (w) { return /[a-zçğıöşü]/.test(w); }).length;
    return { hits: hits, words: words, ok: hits === 0 && words >= minWords };
  }

  /* Tohumdan üretilen, her çağrıda aynı diziyi veren sözde rastgele sayı üreteci (mulberry32). */
  function rng(seed) {
    var a = seed >>> 0;
    return function () {
      a = (a + 0x6D2B79F5) >>> 0;
      var t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  /* Akış destesi: aynı tohum her zaman aynı kartları aynı sırayla verir.
     Ritim kuralı: art arda aynı dünya gelmez, art arda iki "ağır" kart gelmez. */
  function flowDeck(seed, cards, n) {
    var r = rng(seed);
    var pool = cards.map(function (_, i) { return i; });
    for (var i = pool.length - 1; i > 0; i--) {
      var j = Math.floor(r() * (i + 1));
      var t = pool[i]; pool[i] = pool[j]; pool[j] = t;
    }
    var out = [];
    while (out.length < n && pool.length) {
      var last = out.length ? cards[out[out.length - 1]] : null;
      var k = 0;
      for (var m = 0; m < pool.length; m++) {
        var c = cards[pool[m]];
        if (!last || (c.w !== last.w && !(c.heavy && last.heavy))) { k = m; break; }
      }
      out.push(pool.splice(k, 1)[0]);
    }
    return out;
  }

  /* Akış kartını tohuma göre somutlaştırır: üreteci (make) varsa çalıştırır. */
  function buildCard(base, seed, slot) {
    if (!base.make) return base;
    var made = base.make(rng(seed * 131 + slot + 7), seed);
    var out = {};
    Object.keys(base).forEach(function (k) { if (k !== 'make') out[k] = base[k]; });
    Object.keys(made).forEach(function (k) { out[k] = made[k]; });
    return out;
  }

  /* Dünyalar arası sızıntı: oyuncunun önceki yanıtlarına göre sıradaki karta düşülecek fısıltı.
     mem: { b3w, m, t, c, rp, lp, run, used }. Her fısıltı bir akışta en çok bir kez çıkar. */
  function echo(mem, card) {
    var u = mem.used || {};
    var isQ = card.t === 'quiz' || card.t === 'lie';
    var rules = [
      ['b3w', mem.b3w && isQ, 'Az önce kalıbını basmıştın ve yanıldın. Bu sefer ne kadar eminsin?'],
      ['m', mem.m === 0 && (card.w === 'film' || card.w === 'bugun'), 'Makineye bağlanırdım demiştin. Belki bağlandın ve bu kart da içinde.'],
      ['t', mem.t === 1 && card.w === 'uzay', 'Işınlama kabinine girmeyecektin. Buradan sonrasına yürüyerek gidilmiyor.'],
      ['c', mem.c === 1 && card.w === 'zaman', 'Unutabilmek istemiştin. Takvimler de unutur; bak.'],
      ['rpH', mem.rp >= 6 && card.t === 'lie', 'Hızlı turda efsaneleri iyi ayıkladın. Bu üçü daha sinsi.'],
      ['rpL', mem.rp <= 3 && card.t === 'lie', 'Hızlı turda efsaneler seni yakaladı. Şimdi acelen yok; iyi bak.'],
      ['lp', mem.lp && !!card.verse, 'Az önce bir harfi eksik yazdın. Şimdi bir başkası eksik bırakmış.'],
      ['runH', mem.run >= 3 && card.w === 'tasavvuf', 'Üst üste bildin. Bildiğini sananın elinden mum alınır derler; dikkat.'],
      ['runL', mem.run <= -2 && card.w === 'tasavvuf', 'Üst üste yanıldın. Karanlıkta file dokunanların hepsi de yanılmıştı.']
    ];
    for (var i = 0; i < rules.length; i++) if (rules[i][1] && !u[rules[i][0]]) return { k: rules[i][0], text: rules[i][2] };
    return null;
  }

  /* Meydan okuma kodu: bir akışın sonucunu sunucusuz taşır. */
  function encodeDuel(d) {
    return toB64(JSON.stringify({ d: 1, s: d.s, n: d.n, l: d.l, r: d.r })).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  function decodeDuel(code) {
    try {
      var b64 = String(code || '').trim().replace(/-/g, '+').replace(/_/g, '/');
      while (b64.length % 4) b64 += '=';
      var d = JSON.parse(fromB64(b64));
      if (!d || d.d !== 1 || !(d.s >= 1 && d.s <= 999999) || !Array.isArray(d.r)) return null;
      return { s: d.s, n: String(d.n || 'Arkadaşın').slice(0, 20), l: +d.l || 0, r: d.r.slice(0, 20).map(String) };
    } catch (e) { return null; }
  }

  var Core = {
    buildCard: buildCard, echo: echo, encodeDuel: encodeDuel, decodeDuel: decodeDuel,
    lipoCheck: lipoCheck, rng: rng, flowDeck: flowDeck,
    ALPHABET: ALPHABET, syllables: syllables, haikuCheck: haikuCheck, caesar: caesar,
    score: score, encodeSave: encodeSave, decodeSave: decodeSave, newState: newState,
    validateData: validateData
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = Core;
  else root.Core = Core;
})(typeof window !== 'undefined' ? window : this);
