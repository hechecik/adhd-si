# AGENTS.md — Otuz Kuş proje kuralları

## İçerik
- Yolculuğun içeriği `js/data.js`, Akış kartları `js/flow.js` dosyasındadır. Motor (`js/game.js`) içerik bilmez.
- **Telif:** Telifi süren şiir, şarkı sözü ya da kitap metni alıntılanmaz (tek dize bile). Yazarlar yaşam öyküsü, tema ve eser adıyla anlatılır. Yalnızca kamu malı metinler aynen alınabilir (Yunus Emre, Karacaoğlan, Dadaloğlu, Köroğlu); yabancı dildeki kamu malı metinlerde (Bashō, Issa, Attâr) yayımlanmış çeviri değil, kendi çevirimiz kullanılır. Ölümünün üzerinden 70 yıl geçmemiş yazarlar (Âşık Veysel, Cegerxwîn dahil) telif kapsamındadır.
- **Doğruluk:** Her bilgi doğrulanabilir olmalı; emin olunmayan bilgi eklenmez. Tartışmalı konular tartışmalı diye sunulur.
- **Tek kasıtlı yanlış:** "Tohum" durağının anlatısındaki "beynin onda biri" cümlesi. 25. tüyde oyuncuya buldurulur. Bu cümle düzeltilmez; ikinci bir kasıtlı yanlış eklenmez.
- Tüy sayısı 30'dur ve her tüy ayrı bir kuşa bağlıdır. Yeni sahne eklemek mevcut bir sahneyi değiştirmeyi gerektirir; aksi hâlde testler kırılır.
- Dil: sade, kısa cümleli Türkçe. Vaaz yok; soru sor, yanıtı oyuncuya bırak.

- Akış kartı eklerken: `id` 100'den büyük ve benzersiz, `w` tanımlı bir dünya, yazma isteyen kartlarda `heavy: true`. Bir yazarın biçimini taklit eden metin oyun için yeni yazılır ve açıklamada "ona ait değil" diye belirtilir.

- Üreteçler `js/gen.js` içindedir. `make(r, seed)` yalnızca kendisine verilen `r` ile rastgelelik üretir; `Math.random` kullanmaz, yoksa aynı tohum aynı kartı vermez.
- Kaynak künyesi (`src`) yalnızca emin olunan yayınlar için yazılır. Bağlantı uydurulmaz; emin olunmayan kartta alan boş bırakılır.

## Kod
- Derleme adımı, paket yöneticisi ve dış bağımlılık yok. Dış font, CDN ya da izleme kodu eklenmez.
- Saf fonksiyonlar `js/core.js`'e yazılır ve `tests/test.js`'te test edilir.
- Zamanlı ya da reflekse dayalı her sahnede "Geç" seçeneği bulunur (erişilebilirlik).
- JS/CSS değişince `index.html` içindeki `?v=` sürüm numarası artırılır.
- Kayıt biçimi (`v: 1`) değişirse eski kodlar için dönüştürücü yazılır.

## Test
`node tests/test.js` — commit öncesi hepsi geçmeli.
