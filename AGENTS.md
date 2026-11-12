# AGENTS.md — Otuz Kuş proje kuralları

## İçerik
- Bütün içerik `js/data.js` dosyasındadır. Motor (`js/game.js`) içerik bilmez.
- **Telif:** Telifi süren şiir, şarkı sözü ya da kitap metni alıntılanmaz (tek dize bile). Yazarlar yaşam öyküsü, tema ve eser adıyla anlatılır. Kamu malı metinlerde bile (Bashō, Attâr, Yunus Emre) kendi çevirimiz ya da özetimiz kullanılır.
- **Doğruluk:** Her bilgi doğrulanabilir olmalı; emin olunmayan bilgi eklenmez. Tartışmalı konular tartışmalı diye sunulur.
- **Tek kasıtlı yanlış:** "Tohum" durağının anlatısındaki "beynin onda biri" cümlesi. 25. tüyde oyuncuya buldurulur. Bu cümle düzeltilmez; ikinci bir kasıtlı yanlış eklenmez.
- Tüy sayısı 30'dur ve her tüy ayrı bir kuşa bağlıdır. Yeni sahne eklemek mevcut bir sahneyi değiştirmeyi gerektirir; aksi hâlde testler kırılır.
- Dil: sade, kısa cümleli Türkçe. Vaaz yok; soru sor, yanıtı oyuncuya bırak.

## Kod
- Derleme adımı, paket yöneticisi ve dış bağımlılık yok. Dış font, CDN ya da izleme kodu eklenmez.
- Saf fonksiyonlar `js/core.js`'e yazılır ve `tests/test.js`'te test edilir.
- Zamanlı ya da reflekse dayalı her sahnede "Geç" seçeneği bulunur (erişilebilirlik).
- JS/CSS değişince `index.html` içindeki `?v=` sürüm numarası artırılır.
- Kayıt biçimi (`v: 1`) değişirse eski kodlar için dönüştürücü yazılır.

## Test
`node tests/test.js` — commit öncesi hepsi geçmeli.
