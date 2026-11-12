# ilk-surum raporu

- **Yapılan:** Oyunun ilk tam sürümü: 7 durak, 30 tüy, 10 sahne türü, tek/iki kişilik oyun, yerel kayıt ve tüy kodu.
- **Testler:** `node tests/test.js` 10/10. Ayrıca jsdom ile tek ve iki kişilik modda baştan sona otomatik oynatma yapıldı (30 tüy, son ekran, defter, kayıt kodu, yeniden oynama); hata yok.
- **Gerçek tarayıcıda denenmeyen:** Uçuş oyunu (canvas) ve nefes halkası animasyonu otomatik testte yalnızca "Geç" yoluyla sınandı. Elle denenmeli.
- **Sıradaki adım:** docs/TASARIM.md içindeki yol haritası.

## Ek: Akış modu (ikinci tur)
- **Yapılan:** Tohumla çalışan 12 kartlık Akış modu, 42 kart, 12 dünya ve renk teması; yeni sahne türleri (e'siz cümle, büyüteçli mikro yazı, dize tamiri, ikilem, süreli doğru/efsane); durak sonu "birine anlat"; son ekranda bilgin/şair/yolcu.
- **Testler:** `node tests/test.js` 13/13. jsdom ile sekiz farklı tohumda 96 kart otomatik oynatıldı; süreli tur ve tema gerçek Chrome'da denendi; hata yok.
- **Doğrulanmayan:** İçerikteki bilgiler kaynaklardan tek tek kontrol edilmedi.

## Ek: üreteçler ve meydan okuma (üçüncü tur)
- **Yapılan:** `js/gen.js` (hızlı tur, dörtlük, haiku, konu ve düşünce deneyi üreteçleri), fısıltılar, meydan okuma kodu ve karşılaştırma tablosu, üç karşılaştırma kartı, 20 kartta kaynak künyesi.
- **Testler:** `node tests/test.js` 17/17. jsdom ile on akış (biri meydan okuma koduyla) ve yolculuğun tamamı otomatik oynatıldı.
- **Gerçek tarayıcıda denenmeyen:** bu turdaki ekranlar (fısıltı, karşılaştırma tablosu) yalnızca jsdom ile sınandı.
- **Engel:** Claude GitHub uygulamasının `hechecik/adhd-si` reposuna erişimi yok; push 403 döndü.
