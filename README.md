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

## Akış modu

Yedi durağın yanında ikinci bir oyun biçimi: on iki kartlık, on dakikalık kısa tur. Her kart başka bir dünyadan gelir ve ekran o dünyanın rengine bürünür: şiir, yazı oyunu, film, görenek, antropoloji, evrim, takvim, uzay, tasavvuf, düşünce deneyi, bugün, hızlı tur.

- **Tohum:** Kartları altı haneli bir sayı belirler. Aynı tohum herkese aynı kartları aynı sırayla verir; iki kişi aynı tohumu oynayıp sonuçlarını karşılaştırabilir. Yarıda kalan akış tohum ve kart numarasıyla saklanır.
- **Ritim:** Art arda aynı dünyadan iki kart ve art arda iki "ağır" (yazma ya da uzun düşünme isteyen) kart gelmez.
- **Yazarların biçimleriyle bulmacalar:** Perec gibi e'siz cümle yazmak, Walser'ın milimetrik yazısını büyüteçle okumak, Yunus Emre'nin karışmış dörtlüğünü dizmek ve eksik sözcüğünü bulmak, Mevlânâ'ya atfedilen öğüdün şifresini çözmek.
- **Diğer kart türleri:** süreli doğru/efsane turu, doğru yanıtı olmayan ikilemler (deneyim makinesi, ışınlama kabini, unutmayan bellek), "üçünden biri yalan".

- **Üreteçler:** Kartların bir bölümü tohuma göre değişir (`js/gen.js`). E'siz ve a'sız cümle kartı yirmi konudan birini verir; sıralama ve eksik sözcük kartları yedi kamu malı dörtlükten, eksik dize kartları on haikudan birini seçer; hızlı tur 57 cümlelik havuzdan dört doğru dört efsane çeker; düşünce deneyi üreteci 27 ayrı teklif kurar.
- **Fısıltılar:** Önceki kartlarda verdiğin yanıtlar sonraki kartların başına bir cümle düşürür. Deneyim makinesine "bağlanırdım" dediysen bir film kartında sana bunu hatırlatır; kalıbını basıp yanıldıysan sıradaki soruda sorar.
- **Meydan okuma:** Akışın sonunda bir bağlantı ve kod çıkar. Gönderdiğin kişi aynı on iki kartı oynar; sonunda iki kişinin yanıtları yan yana gelir ve ayrı düştüğünüz kartlar işaretlenir. Sunucu yoktur; sonuçlar kodun içinde taşınır.
- **Karşılaştırma kartları:** Aynı insan işinin iki ayrı kültürdeki hâli (yas, isim koyma, misafirlik) yan yana verilir ve "hangisi sana yakın" diye sorulur.
- **Kaynak künyesi:** Bir yayına dayanan kartlarda açıklamanın altında kaynak yazar.

Havuzda 48 kart var (`js/flow.js`, `js/gen.js`).

## Öne çıkan fikirler

- **Bahisli yanıt:** Her soruda ne kadar emin olduğunu seçersin (1-3). Doğruysa o kadar ışık kazanır, yanlışsa kaybedersin. Oyunun sonunda bahis düzeyine göre isabet tablon çıkar: ne kadar bildiğini ne kadar biliyorsun?
- **Güvenilmez anlatıcı:** Hüdhüd anlatının bir yerinde yaygın bir efsaneyi doğruymuş gibi söyler. 6. durakta hangisi olduğunu bulman istenir.
- **Tüy defteri:** Her tüy gerçek bir kuşa ve o kuşa dair doğrulanabilir bir bilgiye bağlıdır. Yazdığın haiku ve yanıtlar da defterde durur.
- **Bilgin mi, şair mi:** Oyun sonunda, ne kadar bildiğine ve ne kadar kesin konuştuğuna göre yolun sana verdiği adı söyler. Oynarken söylemez.
- **Birine anlat:** Her durağın sonunda, kopyalayıp birine gönderebileceğin tek cümlelik bir bilgi çıkar.
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
js/flow.js      Akış modunun kartları ve dünyaları
js/gen.js       Akış üreteçleri, havuzlar ve kaynak künyeleri
js/game.js      motor ve arayüz
tests/test.js   birim testleri
docs/TASARIM.md tasarım notları, sınırlar ve yol haritası
```

Yeni içerik eklemek için yalnızca `js/data.js` ve `js/flow.js` düzenlenir; kurallar `AGENTS.md` dosyasındadır.

## Telif notu

Oyun, yaşayan ya da telifi süren şair ve yazarların eserlerinden alıntı yapmaz; onları yaşamları, temaları ve eser adlarıyla anlatır. Bashō ve Issa örnekleri, özgün haikuların bu oyun için yapılmış serbest çevirileridir; Yunus Emre dizeleri kamu malıdır.
