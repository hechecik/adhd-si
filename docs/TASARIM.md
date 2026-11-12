# Tasarım notları

## Çekirdek fikir
Oyunun konusu insan; mekaniği ise bilginin kendisi. Oyuncu yalnızca bilgi toplamaz, bilgiyle ilişkisini de sınar:

1. **Kalibrasyon.** Puan, doğru bilmekten çok ne kadar emin olduğunu doğru tartmaktan gelir.
2. **Güvenilmez rehber.** Anlatıcı baştan bir yalan söyleyeceğini haber verir. Oyuncu bütün anlatıyı kuşkuyla okur.
3. **Çerçeve.** Attâr'ın otuz kuşu: aranan şey, arayanların kendisidir. Otuz tüy, insanı insan yapan otuz parçaya karşılık gelir.

## Bilinen sınırlar
- **Kayıt yereldir.** İlerleme tarayıcının yerel deposunda durur; tarayıcı verisi silinirse gider. Çözüm tüy kodudur, ama oyuncunun kodu kendisinin saklaması gerekir. Hesaplı, otomatik eşitleme bir sunucu gerektirir ve GitHub Pages bunu sağlamaz.
- **İki kişilik oyun aynı ekrandadır.** Uzaktan iki kişi oynamak gerçek zamanlı bir sunucu ister.
- **Alıntı yok.** Derviş, Uyar, Cegerxwîn, Berger ve Galeano'nun metinleri teliflidir. Oyun onları anlatır, okutmaz. Bu, oyunun en büyük eksiği ve aynı zamanda oyuncuyu kitaba yollama gerekçesidir.
- **Haiku denetimi yalnızca hece sayar.** Türkçede hece sayısı ünlü sayısına eşit olduğu için güvenilirdir; ama şiirin iyi olup olmadığını ölçmez.
- **Görseller emoji.** Kuşların görünümü işletim sistemine göre değişir; bazı eski sistemlerde birkaç emoji boş kutu çıkabilir.
- **Ses yok.** Kuş sesleri ve müzik lisanslı kayıt gerektirir.
- **İçerik bir kez oynanır.** 30 sahne sabittir; ikinci oyunda sorular aynıdır (şıkların sırası değişir).
- **Yalnızca Türkçe.**

## Yol haritası (öneri)
1. Her durak için ikinci bir soru havuzu: yeniden oynanabilirlik.
2. Çizim kuş ve çiçek görselleri (SVG), emoji yerine.
3. Kürtçe, Arapça ve İngilizce arayüz; özellikle 7. durak için.
4. Çevrimdışı kullanım (service worker) ve ana ekrana ekleme.
5. Web Audio ile üretilmiş, kayıt gerektirmeyen ortam sesi.
6. Yeni duraklar: Deniz (göç ve keşif), Şehir (yazıdan sonra kalabalık), Makine (yapay zekâ ve bilgi).
