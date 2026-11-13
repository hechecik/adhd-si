# Otuz Kuş

Bir ateşin başında uyanıyorsun. Karşında konuşan bir kuş var.

Gerisini oyun anlatsın: **https://hechecik.github.io/adhd-si/**

## Ne bekleyebilirsin

- Tek başına ya da aynı ekranda iki kişi oynanır.
- Üç oyun biçimi var: yedi duraklı uzun bir yolculuk, on iki kartlık kısa turlar ve iki kişinin ayrı ayrı yürüyüp sonunda yan yana geldiği Arayış.
- İstediğin yerde bırakıp sürdürebilirsin. İlerleme tarayıcıda saklanır; "Kaydet" düğmesi yolculuğu başka cihaza taşıyan bir kod verir.
- Hesap, kayıt, reklam, izleme yok. Yanıtlar hiçbir sunucuya gönderilmez; yalnızca tarayıcında ve kendi paylaştığın kodun içinde durur.

Bundan fazlasını burada yazmıyoruz. Oynamadan önce kaynak dosyalarını okursan sürprizleri kendi elinle bozarsın.

## Çalıştırma

Derleme adımı ve bağımlılık yok. `index.html` dosyasını tarayıcıda açmak yeterli.

```
node tests/test.js   # birim testleri (Node 18+)
```

## Yapı

```
index.html      sayfa iskeleti
css/style.css   görünüm
js/core.js      saf mantık
js/data.js      yolculuğun içeriği
js/flow.js      kısa turların kartları
js/gen.js       kart üreteçleri ve kaynak künyeleri
js/game.js      motor ve arayüz
js/qcore.js     Arayış: saf mantık
js/qdata.js     Arayış: içerik
js/quest.js     Arayış: arayüz
css/quest.css   Arayış: görünüm
tests/test.js   birim testleri
```

Katkı kuralları `AGENTS.md` dosyasındadır.

## Telif notu

Oyun, telifi süren şair ve yazarların eserlerinden alıntı yapmaz; onları yaşamları, temaları ve eser adlarıyla anlatır. Aynen alınan dizeler kamu malıdır; yabancı dildeki kamu malı şiirlerin çevirileri bu oyun için yapılmıştır.
