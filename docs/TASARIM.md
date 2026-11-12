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
- **Yolculuk bir kez oynanır.** 30 sahne sabittir; ikinci oyunda sorular aynıdır (şıkların sırası değişir). Yeniden oynanabilirlik Akış modundadır; orada da 42 kartlık havuz dört beş turda tükenir.
- **Meydan okuma tek yönlüdür.** İkinci oynayan iki sonucu yan yana görür; ilk oynayan görmek için karşı taraftan kod almalıdır.
- **Kart istatistiği yok.** Hangi kartın herkesçe bilindiğini ya da kimsece bilinmediğini ölçmek, yanıtların bir yerde toplanmasını, yani sunucu gerektirir.
- **Güncel olay kartı yok.** "Bu haftanın haberi" her hafta elle yazılmayı gerektirir; kendiliğinden güncellenemez.
- **Kaynak künyeleri eksik.** 48 kartın 20'sinde kaynak var; kalanlar doğrulanıp eklenmeli.
- **Yalnızca Türkçe.**

## Yol haritası (öneri)
1. Bütün kartlara kaynak künyesi ve bir doğrulama turu.
2. Hızlı tur havuzunu 57'den 200 cümleye, dörtlük havuzunu 7'den 25'e çıkarmak (Fuzûlî, Nedîm, Pir Sultan, anonim Kürtçe ve Türkçe halk deyişleri; her biri kaynağından denetlenerek).
3. Yeni dünyalar, ancak ilk iki madde bittikten sonra: mutfak, göç, dil ve sessizlik, para.
2. Çizim kuş ve çiçek görselleri (SVG), emoji yerine.
3. Kürtçe, Arapça ve İngilizce arayüz; özellikle 7. durak için.
4. Çevrimdışı kullanım (service worker) ve ana ekrana ekleme.
5. Web Audio ile üretilmiş, kayıt gerektirmeyen ortam sesi.
6. Yeni duraklar: Deniz (göç ve keşif), Şehir (yazıdan sonra kalabalık), Makine (yapay zekâ ve bilgi).
