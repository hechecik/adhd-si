# Otuz Kuş

İnsanın hikâyesi üzerine anlatılı, bulmacalı bir tarayıcı oyunu. Tek başına ya da aynı ekranda iki kişi oynanır; baştan sona 40-60 dakika sürer, istenen yerde bırakılıp sürdürülür.

Bir ateşin başında uyanırsın. Karşındaki kuş, Hüdhüd, sana yol gösterir ve baştan uyarır: söylediklerinden biri bile bile yalandır. Yedi durakta otuz tüy toplarsın. Otuzuncu tüyde, Attâr'ın *Mantıku't-Tayr*'ındaki gibi, aranan kuşun kim olduğu ortaya çıkar.

## Duraklar

| # | Durak | Konu | Oyunlar |
|---|-------|------|---------|
| 1 | Ateş | Evrim, ilk insanlar | soru, sıralama, hangisi yalan |
| 2 | Mağara | Sanat, sembol, ölü gömme | soru, hafıza kartları, yazı |
| 3 | Tohum | Tarım, çiçekler, kuşlar | soru, uçuş oyunu, hangisi yalan |
| 4 | Söz | Yazı, diller, haiku | soru, şifre çözme, haiku yazma |
| 5 | Gök | Dinler, görenekler | soru, eşleştirme, nefes |
| 6 | Ayna | Epistemoloji, olasılık, yanılgılar | zekâ soruları, "yalanı bul", yazı |
| 7 | Yol | Derviş, Cegerxwîn, Galeano, Berger, Uyar | soru, eşleştirme, son cümle |

## Öne çıkan fikirler

- **Bahisli yanıt:** Her soruda ne kadar emin olduğunu seçersin (1-3). Doğruysa o kadar ışık kazanır, yanlışsa kaybedersin. Oyunun sonunda bahis düzeyine göre isabet tablon çıkar: ne kadar bildiğini ne kadar biliyorsun?
- **Güvenilmez anlatıcı:** Hüdhüd anlatının bir yerinde yaygın bir efsaneyi doğruymuş gibi söyler. 6. durakta hangisi olduğunu bulman istenir.
- **Tüy defteri:** Her tüy gerçek bir kuşa ve o kuşa dair doğrulanabilir bir bilgiye bağlıdır. Yazdığın haiku ve yanıtlar da defterde durur.
- **Tüy kodu:** İlerleme tarayıcıda kendiliğinden saklanır. "Kaydet" düğmesi, yolculuğu başka cihaza taşıyan bir bağlantı ve kod üretir. Hesap ya da sunucu gerekmez.

## Çalıştırma

Derleme adımı ve bağımlılık yok. `index.html` dosyasını tarayıcıda açmak yeterli. GitHub Pages'te yayımlamak için: Settings → Pages → Branch: `main`, klasör: `/ (root)`.

```
node tests/test.js   # birim testleri (Node 18+)
```

## Yapı

```
index.html      sayfa iskeleti
css/style.css   görünüm
js/core.js      saf mantık: hece sayımı, şifre, puan, tüy kodu, içerik denetimi
js/data.js      bütün içerik: kuşlar, duraklar, sahneler
js/game.js      motor ve arayüz
tests/test.js   birim testleri
docs/TASARIM.md tasarım notları, sınırlar ve yol haritası
```

Yeni içerik eklemek için yalnızca `js/data.js` düzenlenir; kurallar `AGENTS.md` dosyasındadır.

## Telif notu

Oyun, yaşayan ya da telifi süren şair ve yazarların eserlerinden alıntı yapmaz; onları yaşamları, temaları ve eser adlarıyla anlatır. Bashō örneği, 1686 tarihli özgün haikunun bu oyun için yapılmış serbest çevirisidir.
