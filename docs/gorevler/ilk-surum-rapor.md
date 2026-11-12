# ilk-surum raporu

- **Yapılan:** Oyunun ilk tam sürümü: 7 durak, 30 tüy, 10 sahne türü, tek/iki kişilik oyun, yerel kayıt ve tüy kodu.
- **Testler:** `node tests/test.js` 10/10. Ayrıca jsdom ile tek ve iki kişilik modda baştan sona otomatik oynatma yapıldı (30 tüy, son ekran, defter, kayıt kodu, yeniden oynama); hata yok.
- **Gerçek tarayıcıda denenmeyen:** Uçuş oyunu (canvas) ve nefes halkası animasyonu otomatik testte yalnızca "Geç" yoluyla sınandı. Elle denenmeli.
- **Sıradaki adım:** docs/TASARIM.md içindeki yol haritası.

## Ek: Akış modu (ikinci tur)
- **Yapılan:** Tohumla çalışan 12 kartlık Akış modu, 42 kart, 12 dünya ve renk teması; yeni sahne türleri (e'siz cümle, büyüteçli mikro yazı, dize tamiri, ikilem, süreli doğru/efsane); durak sonu "birine anlat"; son ekranda bilgin/şair/yolcu.
- **Testler:** `node tests/test.js` 13/13. jsdom ile sekiz farklı tohumda 96 kart otomatik oynatıldı; süreli tur ve tema gerçek Chrome'da denendi; hata yok.
- **Doğrulanmayan:** İçerikteki bilgiler kaynaklardan tek tek kontrol edilmedi.
