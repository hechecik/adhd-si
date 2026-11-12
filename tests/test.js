/* Çalıştır: node tests/test.js */
'use strict';
const assert = require('assert');
const Core = require('../js/core.js');
const Data = require('../js/data.js');
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
console.log(n + '/' + n + ' test geçti');
