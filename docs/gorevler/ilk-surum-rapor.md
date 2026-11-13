# ilk-surum raporu

- **Testler:** `node tests/test.js` 17/17. Yolculuğun tamamı ve on kısa tur jsdom ile otomatik oynatıldı; süreli sahneler gerçek Chrome'da denendi.
- **Gerçek tarayıcıda denenmeyen:** kısa turların sonundaki karşılaştırma ekranı.
- **Doğrulanmayan:** içerikteki bilgiler kaynaklardan tek tek kontrol edilmedi; 48 kartın 19'unda kaynak künyesi var.
- **Sıradaki adım:** doğrulama turu, kalan kartlara kaynak künyesi.

# arayis raporu

- **Yapılan:** Üçüncü oyun biçimi (Arayış): on iki kapı, 29 sahne, taraf seçimi, kodla çağrı ve iki yolculuğun karşılaştırması.
- **Testler:** `node tests/test.js` 17/17 + 13/13. jsdom ile iki yolculuk art arda otomatik oynatıldı (çağrı, ikili kod, süresi geçmiş kod dahil); ekranlar gerçek Chrome'da görüldü.
- **Gerçek tarayıcıda elle denenmeyen:** süreli sahnelerin (yürüyüş, halay, bekleme) gerçek süreleri.
- **Doğrulanmayan:** karakter ve sahne bilgileri kaynaklardan tek tek kontrol edilmedi; künyeler bellekten yazıldı.
