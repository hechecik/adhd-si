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

  var Core = {
    ALPHABET: ALPHABET, syllables: syllables, haikuCheck: haikuCheck, caesar: caesar,
    score: score, encodeSave: encodeSave, decodeSave: decodeSave, newState: newState,
    validateData: validateData
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = Core;
  else root.Core = Core;
})(typeof window !== 'undefined' ? window : this);
