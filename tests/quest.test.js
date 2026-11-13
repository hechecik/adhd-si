/* Arayış testleri. Çalıştır: node tests/quest.test.js (tests/test.js sonunda da çağrılır). */
'use strict';
const assert = require('assert');
const QC = require('../js/qcore.js');
const QD = require('../js/qdata.js');
let n = 0;
function t(name, fn) { fn(); n++; console.log('ok  ' + name); }
function run(side, pick, extra) {
  const r = {};
  Object.keys(QD.scenes).forEach(id => { const s = QD.scenes[id]; if (s.t === 'pick') r[id] = { c: pick(s, id), f: 0, ms: 1000, ch: 0 }; });
  return Object.assign({ side, n: side === 'a' ? 'Âdem' : 'Havva', t: 1000, r, x: {} }, extra || {});
}
t('içerik bütünlüğü', () => assert.deepStrictEqual(QC.validate(QD), []));
t('her kapının sahneleri var, sıra tek yönlü', () => {
  assert.ok(QD.gates.length >= 10);
  assert.strictEqual(QD.gates[QD.gates.length - 1].second, true);
});
t('iki taraflı sahnelerde iki ayrı metin var', () => {
  ['ayri1', 'ayri2', 'gercek'].forEach(id => assert.notStrictEqual(QD.scenes[id].qa, QD.scenes[id].qh));
});
t('aynı seçimler %100, zıt seçimler düşük uyum', () => {
  const A = run('a', () => 0), B = run('h', () => 0), C = run('h', s => s.o.length - 1);
  assert.strictEqual(QC.compare(A, B, QD.scenes).pct, 100);
  const c = QC.compare(A, C, QD.scenes);
  assert.ok(c.pct < 40, 'uyum ' + c.pct);
  assert.ok(c.diffs.length > 10);
});
t('uyum 0-100 arasında kalır', () => {
  for (let k = 0; k < 200; k++) {
    const A = run('a', s => Math.floor(Math.random() * s.o.length)), B = run('h', s => Math.floor(Math.random() * s.o.length));
    const p = QC.compare(A, B, QD.scenes).pct;
    assert.ok(p >= 0 && p <= 100);
  }
});
t('tanıma kapısı uyuma katılır', () => {
  const A = run('a', () => 0), B = run('h', () => 1), B2 = run('h', () => 1);
  B2.r.tanima = { c: 3, f: 0 };
  assert.ok(QC.compare(A, B2, QD.scenes).know === 1);
  assert.strictEqual(QC.compare(A, B, QD.scenes).know, null);
});
t('halay: dans, önce bırakanın vuruşunda biter', () => {
  const A = run('a', () => 0), B = run('h', () => 0);
  A.r.halay = { c: 24, f: 0 }; B.r.halay = { c: 9, f: 1 };
  const c = QC.compare(A, B, QD.scenes);
  assert.strictEqual(c.dance, 9); assert.strictEqual(c.dropped, 'b');
  B.r.halay = { c: null }; assert.strictEqual(QC.compare(A, B, QD.scenes).dance, null);
});
t('birlikte tökezlenen kapılar sayılır', () => {
  const A = run('a', () => 0), B = run('h', () => 0);
  A.r.kumar.f = 1; B.r.kumar.f = 1; A.r.sat1 = { c: 1, f: 1 }; B.r.sat1 = { c: 0, f: 0 };
  assert.deepStrictEqual(QC.compare(A, B, QD.scenes).both, ['kumar']);
  assert.deepStrictEqual(QC.scale(A, B, QD.scenes).shared, 1);
  assert.strictEqual(QC.scale(A, null, QD.scenes).lost, 2);
});
t('karakter eşleşmesi: her havuzdan bir kişi, tarafına göre', () => {
  const m = QC.matchChars([3, 2, 0, 1, 3, 2], QD.chars.h);
  assert.deepStrictEqual(Object.keys(m).sort(), Object.keys(QD.pools).sort());
  assert.strictEqual(m.mit.n, 'Lilith');
  const names = new Set(QD.chars.a.map(c => c.n));
  QD.chars.h.forEach(c => assert.ok(!names.has(c.n)));
});
t('kod gidiş-dönüş, bozuk kod, süre', () => {
  const A = run('a', () => 0, { w: 'gürültü', lt: 7 }), B = run('h', () => 1);
  const c1 = QC.unpack(QC.pack(A)); assert.strictEqual(c1.q, 1); assert.strictEqual(c1.a.w, 'gürültü');
  const c2 = QC.unpack('https://x.test/#q=' + QC.pack(A, B)); assert.strictEqual(c2.q, 2); assert.strictEqual(c2.b.side, 'h');
  assert.strictEqual(QC.unpack('saçma'), null);
  assert.strictEqual(QC.expired(1000, 1000 + QC.DAY - 1), false);
  assert.strictEqual(QC.expired(1000, 1000 + QC.DAY + 1), true);
});
t('remil: on altı şeklin hepsine ulaşılır', () => {
  const seen = new Set();
  for (let a = 1; a <= 2; a++) for (let b = 1; b <= 2; b++) for (let c = 1; c <= 2; c++) for (let d = 1; d <= 2; d++) seen.add(QC.figureOf([a, b, c, d], QD.figures));
  assert.strictEqual(seen.size, 16); assert.ok(!seen.has(-1));
  assert.strictEqual(QD.figures[QC.figureOf([7, 9, 5, 11], QD.figures)][1], 'Yol');
});
t('durma problemi sıralaması', () => {
  assert.strictEqual(QC.rankOf([0.2, 0.9, 0.5], 1), 1);
  assert.strictEqual(QC.rankOf([0.2, 0.9, 0.5], 0), 3);
});
t('tereddüt ölçümü', () => {
  const A = run('a', () => 0); A.r.meyve.ms = 42000; A.r.lilith.ch = 3;
  const h = QC.hesitation(A);
  assert.strictEqual(h.longestId, 'meyve'); assert.strictEqual(h.changes, 3);
});
console.log(n + '/' + n + ' Arayış testi geçti');
