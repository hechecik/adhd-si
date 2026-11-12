/* Çalıştır: node tests/test.js */
'use strict';
const assert = require('assert');
const Core = require('../js/core.js');
const Data = require('../js/gen.js');
let n = 0;
function t(name, fn) { fn(); n++; console.log('ok  ' + name); }

t('hece sayımı', () => {
  assert.strictEqual(Core.syllables('Eski bir gölcük'), 5);
  assert.strictEqual(Core.syllables('bir kurbağa atlıyor'), 7);
  assert.strictEqual(Core.syllables('IŞIK İĞNE'), 4);
  assert.strictEqual(Core.syllables(''), 0);
});
t('haiku denetimi', () => {
  assert.strictEqual(Core.haikuCheck(['Eski bir gölcük', 'bir kurbağa atlıyor', 'suyun sesi, şlap']).ok, true);
  assert.strictEqual(Core.haikuCheck(['kısa', 'kısa', 'kısa']).ok, false);
});
t('içerikteki örnek haiku 5-7-5', () => {
  Data.chapters.forEach(ch => ch.scenes.filter(s => s.t === 'haiku').forEach(s => {
    assert.strictEqual(Core.haikuCheck(s.example).ok, true);
  }));
});
t('Sezar kaydırması gidiş-dönüş', () => {
  const p = 'SÖZ UÇAR YAZI KALIR';
  for (let k = 0; k < 29; k++) assert.strictEqual(Core.caesar(Core.caesar(p, k), -k), p);
  assert.strictEqual(Core.caesar('Z', 1), 'A');
  assert.notStrictEqual(Core.caesar(p, 5), p);
});
t('bahis puanı', () => {
  assert.strictEqual(Core.score(3, true), 3);
  assert.strictEqual(Core.score(2, false), -2);
});
t('tüy kodu gidiş-dönüş (Türkçe karakterli)', () => {
  const s = Core.newState(['Gör', 'Çiğdem']);
  s.done = [1, 2, 3]; s.notes[8] = 'ışık, gölge\nşiir'; s.pos.ates = 4;
  const code = Core.encodeSave(s);
  assert.ok(/^[\w-]+$/.test(code));
  assert.deepStrictEqual(Core.decodeSave(code), s);
});
t('bozuk tüy kodu reddedilir', () => {
  assert.strictEqual(Core.decodeSave('bu-bir-kod-degil'), null);
  assert.strictEqual(Core.decodeSave(''), null);
  assert.strictEqual(Core.decodeSave(Core.encodeSave({ v: 2 })), null);
});
t('içerik bütünlüğü: 30 tüy, geçerli yanıtlar', () => {
  assert.deepStrictEqual(Core.validateData(Data), []);
});
t('her kuş tam bir kez kullanılır', () => {
  const used = [];
  Data.chapters.forEach(ch => ch.scenes.forEach(s => { if (s.bird) used.push(s.bird); }));
  assert.strictEqual(new Set(used).size, 30);
  assert.strictEqual(Data.birds.length, 30);
});
t('doğru yanıt hep aynı şıkta değil', () => {
  const pos = new Set();
  Data.chapters.forEach(ch => ch.scenes.forEach(s => { if (s.t === 'quiz') pos.add(s.a); }));
  assert.ok(pos.size >= 2);
});
t('lipogram denetimi', () => {
  assert.strictEqual(Core.lipoCheck('Kuşlar uçuyor uzaklara doğru usulca', 'e', 5).ok, true);
  assert.strictEqual(Core.lipoCheck('BEN GELDİM', 'e', 1).hits, 2);
  assert.strictEqual(Core.lipoCheck('az söz', 'e', 5).ok, false);
});
t('akış kartları geçerli', () => {
  const ids = new Set();
  const all = [];
  Data.flow.forEach(c => { for (let seed = 100000; seed < 100040; seed++) all.push(Core.buildCard(c, seed, seed % 12)); });
  all.forEach(c => { assert.ok(!c.make); if (c.verse) assert.strictEqual(c.verse.filter(l => l.includes('____')).length, 1, 'boşluk ' + c.id); });
  Data.flow.map(c => Core.buildCard(c, 271828, 3)).forEach(c => {
    assert.ok(c.id > 100 && !ids.has(c.id), 'kimlik ' + c.id); ids.add(c.id);
    assert.ok(Data.worlds[c.w], 'dünya ' + c.w);
    assert.ok(c.q && c.x, 'metin ' + c.id);
    if (c.t === 'quiz' || c.t === 'lie') assert.ok(c.o.length >= 3 && c.a >= 0 && c.a < c.o.length, 'yanıt ' + c.id);
    if (c.t === 'dilemma') assert.ok(c.o.length >= 2);
    if (c.t === 'rapid') { assert.strictEqual(c.items.length, 8); assert.strictEqual(c.items.filter(i => i[1]).length, 4); assert.ok(c.items.every(i => i[1] || i[2])); }
    if (c.t === 'cipher') assert.strictEqual(Core.caesar(Core.caesar(c.plain, c.shift), -c.shift), c.plain);
    if (c.verse) assert.ok(c.verse.some(l => l.includes('____')));
  });
  assert.ok(Data.flow.length >= 40);
});
t('üreteçler: aynı tohum aynı kart, farklı tohum farklı kart', () => {
  const rapid = Data.flow.find(c => c.id === 130), perec = Data.flow.find(c => c.id === 101);
  assert.deepStrictEqual(Core.buildCard(rapid, 5, 2), Core.buildCard(rapid, 5, 2));
  const qs = new Set(); for (let s = 1; s < 60; s++) qs.add(Core.buildCard(perec, s, 0).q);
  assert.ok(qs.size >= 10, 'konu çeşitliliği ' + qs.size);
  const hs = new Set(); for (let s = 1; s < 30; s++) hs.add(Core.buildCard(Data.flow.find(c => c.id === 107), s, 0).x);
  assert.strictEqual(hs.size, Data.pools.HAIKU.length);
  const a = Data.pools.TRUE.concat(Data.pools.MYTH.map(m => m[0]));
  assert.strictEqual(new Set(a).size, a.length, 'hızlı tur havuzunda yinelenen cümle');
  // aynı akışta iki hızlı tur kartı aynı cümleyi göstermez
  const x = Core.buildCard(rapid, 9, 1).items.map(i => i[0]), y = Core.buildCard(Data.flow.find(c => c.id === 131), 9, 4).items.map(i => i[0]);
  assert.ok(x.every(s => !y.includes(s)));
  // sıralama ve eksik sözcük kartı aynı tohumda aynı dörtlüğü kullanmaz
  assert.notStrictEqual(Core.buildCard(Data.flow.find(c => c.id === 105), 9, 0).x, Core.buildCard(Data.flow.find(c => c.id === 106), 9, 0).x);
});
t('eksik sözcük kartında boşluk gerçekten doğru sözcüğün yerinde', () => {
  Data.pools.QUAT.forEach(v => assert.ok(v.lines[v.gap[0]].includes(v.gap[1]), v.lines[0]));
});
t('fısıltılar: koşul sağlanınca bir kez çıkar', () => {
  const quiz = { t: 'quiz', w: 'film' };
  assert.strictEqual(Core.echo({ run: 0, used: {} }, quiz), null);
  assert.strictEqual(Core.echo({ b3w: true, used: {} }, quiz).k, 'b3w');
  assert.strictEqual(Core.echo({ b3w: true, used: { b3w: 1 } }, quiz), null);
  assert.strictEqual(Core.echo({ m: 0, used: {} }, quiz).k, 'm');
  assert.strictEqual(Core.echo({ m: 1, used: {} }, quiz), null);
  assert.strictEqual(Core.echo({ rp: 7, used: {} }, { t: 'lie', w: 'zaman' }).k, 'rpH');
  assert.strictEqual(Core.echo({ run: -2, used: {} }, { t: 'cipher', w: 'tasavvuf' }).k, 'runL');
  assert.strictEqual(Core.echo({ used: {} }, { t: 'lie', w: 'zaman' }), null, 'rp tanımsızken fısıltı çıkmamalı');
});
t('meydan okuma kodu gidiş-dönüş', () => {
  const d = { s: 271828, n: 'Çiğdem', l: 9, r: ['1', '0', 'd1', 'r6', '-'] };
  assert.deepStrictEqual(Core.decodeDuel(Core.encodeDuel(d)), d);
  assert.strictEqual(Core.decodeDuel('zzz'), null);
  assert.strictEqual(Core.decodeDuel(Core.encodeSave(Core.newState(['x']))), null);
});
t('akış destesi: aynı tohum aynı deste, ritim kuralı tutuyor', () => {
  for (let seed = 100000; seed < 100400; seed++) {
    const d = Core.flowDeck(seed, Data.flow, 12);
    assert.deepStrictEqual(d, Core.flowDeck(seed, Data.flow, 12));
    assert.strictEqual(new Set(d).size, 12);
    for (let i = 1; i < d.length; i++) {
      const a = Data.flow[d[i - 1]], b = Data.flow[d[i]];
      assert.notStrictEqual(a.w, b.w, 'tohum ' + seed + ': aynı dünya art arda');
      assert.ok(!(a.heavy && b.heavy), 'tohum ' + seed + ': iki ağır kart art arda');
    }
  }
  assert.notDeepStrictEqual(Core.flowDeck(1, Data.flow, 12), Core.flowDeck(2, Data.flow, 12));
});
console.log(n + '/' + n + ' test geçti');
