/* Arayış — içerik. Eksenler: K irade(+)/kader(−), D kaos(+)/düzen(−), G gönül(+)/akıl(−),
   Y yol(+)/kök(−), B birey(+)/topluluk(−), R risk(+)/güven(−).
   Telifli metin alıntılanmaz; filmler ve kitaplar durum ve karakterle anlatılır. */
(function (root) {
  'use strict';

  var axes = [
    { k: 'K', neg: 'Kader', pos: 'İrade' }, { k: 'D', neg: 'Düzen', pos: 'Kaos' }, { k: 'G', neg: 'Akıl', pos: 'Gönül' },
    { k: 'Y', neg: 'Kök', pos: 'Yol' }, { k: 'B', neg: 'Topluluk', pos: 'Birey' }, { k: 'R', neg: 'Güven', pos: 'Risk' }
  ];

  var gates = [
    { id: 'bahce', name: 'Bahçe', sub: 'Tek bir kural vardı', hue: 'leaf', scenes: ['meyve', 'lilith'],
      intro: ['Her şey yerli yerinde. Sular akıyor, ağaçlar meyveli, hiçbir şeyin adı yok çünkü henüz kimse ad koymadı.', 'Yalnız değilsin; ama öteki nerede, bilmiyorsun. Bahçe büyük.'] },
    { id: 'dusus', name: 'Düşüş', sub: 'İlk gece', hue: 'ember', scenes: ['yuk', 'orpheus'],
      intro: ['Kapı arkandan kapandı. İlk kez üşüyorsun. İlk kez karanlık, senin için bir şey ifade ediyor.', 'Öteki de düştü; ama başka bir yere. Aramak buradan başlıyor.'] },
    { id: 'titan', name: 'Titanlar', sub: 'Tanrılar da taraf tutar', hue: 'storm', scenes: ['titan', 'enkidu', 'sisifos'],
      intro: ['Gökyüzü kavga ediyor. Eski tanrılar ile yenileri arasında on yıldır süren bir savaş var ve senden taraf tutman bekleniyor.'] },
    { id: 'ayrilik', name: 'Ayrılık', sub: 'Yarım duyulan söz', hue: 'mist', scenes: ['ayri1', 'ayri2'],
      intro: ['Buradan sonra öteki ile aynı şeyi duymayacaksınız. Bir soru birinize tam, ötekine yarım gelecek. Sonra yer değişecek.', 'Yarım duyduğunu tamamlamaya çalışma. Duyduğun kadarına yanıt ver.'] },
    { id: 'tarih', name: 'Mahkeme', sub: 'Kazanan mı, haklı olan mı', hue: 'stone', scenes: ['sokrates', 'domuz', 'spartakus'],
      intro: ['Mitler bitti; buradan sonrası kayıtlı. Tutanaklar, tabletler, tanıklar var. Yine taraf tutacaksın; ama bu kez tuttuğun tarafın sonunu da göreceksin.'] },
    { id: 'dongu', name: 'Eşikler', sub: 'Doğmak, adlanmak, yas tutmak', hue: 'clay', scenes: ['paylas', 'ad', 'yas', 'kapiadi'],
      intro: ['Her toplum aynı birkaç eşikten geçer: doğum, ad, av, evlilik, ölüm. Geçme biçimleri ise birbirine hiç benzemez.'] },
    { id: 'halay', name: 'Halay', sub: 'Biri bırakırsa', hue: 'ember', scenes: ['halay'],
      intro: ['Bir düğün yeri. Davul vuruyor. Halka kurulmuş; bir kişilik yer açık.', 'Dans tek kişiyle olmaz. Sen vuruşu tutacaksın; öteki de kendi vaktinde aynı vuruşu tutacak. İkinizden hangisi önce bırakırsa dans orada biter.'] },
    { id: 'kader', name: 'Kader', sub: 'Yazılmış mı, yazılıyor mu', hue: 'night', scenes: ['remil', 'remilsec', 'oidipus', 'burc', 'kumar'],
      intro: ['Kumun üstüne noktalar, göğe yıldızlar, kemiklere çatlaklar. İnsan olacak olanı hep bir yerden okumak istedi.'] },
    { id: 'sayi', name: 'Sayı ve taş', sub: 'Akıl ne zaman durur', hue: 'lapis', scenes: ['otuzyedi', 'sat1', 'sat2', 'sat3', 'yapi'],
      intro: ['Burada duygu işe yaramaz gibi görünür. Sayılar, kareler, taşlar var. Yine de her bulmacanın sonunda bir insan hâli çıkacak.'] },
    { id: 'perde', name: 'Perde', sub: 'Başkasının hayatını izlemek', hue: 'film', scenes: ['stalker', 'kum', 'yakinplan', 'gercek'],
      intro: ['Karanlık bir salon. Perdede tanımadığın insanlar, senin hiç yaşamadığın şeyleri yaşıyor. Onların yerinde ne yapardın?'] },
    { id: 'sessiz', name: 'Sessiz kapı', sub: '', hue: 'mist', scenes: ['sessiz'], intro: [] },
    { id: 'tanima', name: 'Tanıma', sub: 'Onu tanıyorsan geçersin', hue: 'rose', scenes: ['tanima'], second: true,
      intro: ['Bu kapı yalnızca birinin ardından gelen için açılır. Öteki buradan senden önce geçti ve seçimlerini yaptı. Ne seçtiğini bilmiyorsun; ama onu tanıyorsun.'] }
  ];

  function P(k, q, o, after, extra) {
    var s = { t: 'pick', k: k, q: q, o: o, after: after };
    if (extra) Object.keys(extra).forEach(function (x) { s[x] = extra[x]; });
    return s;
  }
  function O(t, ax) { return { t: t, ax: ax || {} }; }

  var scenes = {
    meyve: P('Yasak ağaç', 'Ağacın altındasın. Sana tek bir kural söylendi: bundan yeme. Meyve elinin uzanacağı yerde.',
      [O('Yerim.', { K: 1, R: 1, D: 1 }), O('Yemem.', { K: -1, R: -1, D: -1 })],
      'Meyveyi yemeyen için hikâye yoktur. Bütün anlatılar, mitler ve bu oyun, birinin kuralı çiğnemesiyle başlar.', { prank: 'bahce' }),
    lilith: P('Lilith', 'Bahçede senden önce biri yaşamış. Anlatıya göre eşit yaratıldığını söyledi, boyun eğmedi ve bahçeyi kendi isteğiyle bıraktı. Adı Lilith.',
      [O('Haklıydı. Eşit olunmayan yer cennet değildir.', { B: 1, K: 1 }), O('Kalmalıydı. İçeride kalıp değiştirmek gerekir.', { B: -1, D: -1 }), O('Bilemem. Hikâyeyi kalanlar anlattı.', { G: -1 })],
      'Lilith, Orta Çağ\'da yazılmış “Ben Sira Alfabesi” adlı Yahudi metninde Âdem\'in ilk eşi olarak geçer. Kutsal kitaplarda bu hikâye yoktur; yüzyıllar içinde anlatıla anlatıla büyümüştür.',
      { src: 'Ben Sira Alfabesi, 8.-10. yüzyıl' }),
    yuk: P('Yanına aldığın', 'Bahçeden çıkarken yanına tek bir şey alabilirsin.',
      [O('Ateş.', { R: 1, K: 1 }), O('Bir avuç tohum.', { Y: -1, R: -1 }), O('Her şeye ad koyma yetkisi.', { G: -1, K: 1 }), O('Hiçbir şey. Ellerim boş kalsın.', { Y: 1 })],
      'Ateş seni ısıtır ama yakar. Tohum seni doyurur ama toprağa bağlar. Ad koymak dünyayı senin yapar ama adı olmayanı göremez olursun. Boş el her şeyi tutabilir, hiçbir şeyi de.'),
    orpheus: { t: 'orpheus', k: 'Geriye bakmak',
      q: 'Yeraltındasın. Ötekini buldun; arkanda yürüyor. Tek koşul: yukarıya varana dek dönüp bakmayacaksın. Yürümek için düğmeyi basılı tut.',
      after: 'Orpheus, Eurydike\'yi yeraltından çıkarırken son adımda dönüp baktı ve onu ikinci kez yitirdi. Neden baktığını iki bin yıldır herkes başka türlü açıklıyor: kuşku, sevgi, sabırsızlık. Belki de yalnızca ayak sesini duyamadı.' },
    titan: P('Titanlar savaşı', 'Titanlar eski düzenin tanrıları; yenilecekler. Olimposlular genç ve acımasız; kazanacaklar. Bunu ikisi de bilmiyor, sen biliyorsun.',
      [O('Kazanacak olanın yanında dururum.', { R: -1, D: -1 }), O('Yenilecek de olsa eskiyi savunurum.', { Y: -1, G: 1 }), O('İkisini de bırakır, ateşi çalıp insanlara götürürüm.', { B: -1, R: 1, K: 1 })],
      'Hesiodos\'a göre savaş on yıl sürdü. Prometheus bir Titan olduğu hâlde Zeus\'un yanında savaştı; sonra ateşi insanlara verdiği için aynı Zeus tarafından bir kayaya zincirlendi. Kazananın yanında durmak, kazananın seni koruyacağı anlamına gelmez.',
      { src: 'Hesiodos, Theogonia; Aiskhylos, Zincire Vurulmuş Prometheus' }),
    enkidu: P('Dostun ölümü', 'Uruk kralı Gılgamış\'sın. Tek dostun Enkidu yedi gün hasta yattı ve öldü. Yanından ayrılmadın; ölümün ne olduğunu ilk kez gördün.',
      [O('Ölümsüzlüğü aramak için yola çıkarım.', { Y: 1, K: 1 }), O('Yasını tutar, şehrime dönerim.', { Y: -1, K: -1 }), O('Adını her taşa yazdırırım.', { G: 1, B: -1 })],
      'Gılgamış dünyanın ucuna gitti, gençlik veren otu buldu; dönüş yolunda yıkanırken bir yılan otu çaldı. Eli boş döndü ve yol arkadaşına Uruk\'un surlarını gösterdi: kalıcı olan buydu. Destan dört bin yıl sonra hâlâ okunuyor; demek ki üçüncü seçenek de işe yaramış.',
      { src: 'Gılgamış Destanı, XI. tablet' }),
    sisifos: { t: 'sisifos', k: 'Kaya',
      q: 'Bir kaya, bir yokuş. Kayayı tepeye çıkarırsan özgürsün. İtmek için kayaya dokun.',
      after: 'Tanrılar Sisifos\'a amaçsız emekten daha ağır bir ceza bulamadı. Yirminci yüzyılda bir yazar tersini savundu: kayanın kendi kayası olduğunu bilen Sisifos mutlu sayılmalıdır. Bırakmak mı özgürlüktür, sürdürmek mi? İkisi de savunulabilir; hangisini seçtiğin kayda geçti.' },
    ayri1: P('Yanlış ad', '', [O('Giderim.', { R: 1, G: 1 }), O('Gitmem.', { R: -1, G: -1 }), O('Olduğum yerden adımı düzeltirim.', { K: 1 })],
      'Öteki bu soruyu senin gördüğün gibi görmedi. Kimin tamını, kimin yarısını duyduğu sonda açılacak.',
      { qa: 'Karanlıkta bir ses seni çağırıyor. Sesi tanıyorsun ama adını yanlış söylüyor. Yine de gider misin?', qh: '…yine de gider misin?' }),
    ayri2: P('Köprü', '', [O('Dönerim.', { B: -1 }), O('Dönmem.', { B: 1, R: 1 }), O('Ortada durur, beklerim.', { K: -1 })],
      'Yarım cümleye verilen yanıt, soruyu değil yanıtlayanı gösterir.',
      { qh: 'Dar bir köprünün ortasındasın. Karşıdan biri geliyor; yüzünü seçemiyorsun. Köprü ikinizi birden taşımaz. Geri döner misin?', qa: '…geri döner misin?' }),
    sokrates: P('Baldıran', 'Atina, MÖ 399. Gençleri yoldan çıkarmaktan ölüme mahkûm edildin. Dostların gardiyanı ayarladı; bu gece kaçabilirsin.',
      [O('Kaçarım. Haksız karara uymak zorunda değilim.', { B: 1, K: 1, D: 1 }), O('Kalırım. Yasasından yararlandığım şehrin kararından kaçamam.', { D: -1, Y: -1 }), O('Kaçar, başka bir şehirde aynı soruları sormayı sürdürürüm.', { Y: 1, K: 1 })],
      'Sokrates kaldı ve baldıranı içti. Beş yüz bir kişilik jüride aradaki fark küçüktü: otuz kişi öbür yana oy verseydi aklanacaktı. Kaçsaydı bugün adını bilir miydik?',
      { src: 'Platon, Sokrates\'in Savunması; Kriton' }),
    domuz: P('Domuzun davası', 'Savigny, Fransa, 1457. Bir dişi domuz ile altı yavrusu, beş yaşında bir çocuğu öldürmekten yargılanıyor. Mahkeme gerçek, yargıç gerçek. Sana bir görev öneriliyor.',
      [O('Domuzun avukatı olurum.', { G: 1, D: 1 }), O('Savcı olurum. Yasa herkese uygulanır.', { D: -1, G: -1 }), O('Bu mahkemeyi tanımam.', { B: 1, K: 1 })],
      'Domuz suçlu bulundu ve asıldı. Yavrular, olaya karıştıklarına dair kanıt bulunmadığı için serbest bırakıldı. Orta Çağ Avrupası\'nda farelere, çekirgelere, horozlara dava açıldı; hepsine avukat tutuldu. Gülünç mü, yoksa adaletin herkese borçlu olunduğu düşüncesinin en uç hâli mi?',
      { src: 'E. P. Evans, The Criminal Prosecution and Capital Punishment of Animals, 1906' }),
    spartakus: P('Vezüv', 'MÖ 73. Capua\'daki gladyatör okulundan yetmiş kişiyle kaçtın. Şimdi on binlercesiniz. Roma\'nın ordusu yolda.',
      [O('Alpleri aşar, herkesi evine yollarım.', { Y: -1, B: 1 }), O('İtalya\'da kalır, köleleri özgürleştirerek büyürüm.', { B: -1, R: 1, K: 1 }), O('Dağılıp gizlenmeyi öneririm.', { R: -1 })],
      'Spartaküs\'ün ordusu Alplerin eteğine kadar vardı ve geri döndü; nedenini bilmiyoruz. İki yıl sonra yenildiler. Altı bin tutsak Capua\'dan Roma\'ya uzanan yol boyunca çarmıha gerildi. Spartaküs\'ün bedeni hiç bulunmadı.',
      { src: 'Plutarkhos, Crassus; Appianos, İç Savaşlar' }),
    paylas: P('Avcının payı', 'Kalahari Çölü. Günlerce iz sürüp büyük bir antilop vurdun. Kampa haber verdin; gelenler ava bakıp yüzünü buruşturuyor: “Bu bir deri bir kemik şey için mi çağırdın bizi?”',
      [O('Alınır, avımı savunurum.', { B: 1 }), O('Gülerim. Kural bu.', { B: -1, D: -1 }), O('Bir dahaki avımı kimseye söylemem.', { B: 1, R: -1 })],
      '!Kung avcı toplayıcılarında iyi avcının avı özellikle küçümsenir. Nedeni açıkça söylenir: genç adam kendini büyük görmeye başlarsa bir gün birini öldürür. Et yine herkese paylaştırılır; yalnızca övünmek yasaktır.',
      { src: 'Richard B. Lee, “Eating Christmas in the Kalahari”, 1969' }),
    ad: P('Ad', 'Bir bebek doğdu. İnuit geleneğinde ona yakın zamanda ölmüş birinin adı verilir; adla birlikte o kişiden bir şey de geri döner. Çocuğa “büyükanne” diye seslenildiği olur.',
      [O('Sevdiğim bir ölünün adını veririm.', { Y: -1, G: 1 }), O('Kimsenin taşımadığı yeni bir ad veririm.', { B: 1, K: 1 }), O('Adı, onu ilk kucağına alan seçsin.', { K: -1, B: -1 })],
      'Ad bir etiket değil, bir bağdır: kimden geldiğini, kime borçlu olduğunu, kimin yerini tuttuğunu söyler. Adını yitiren, yerini de yitirir.'),
    yas: P('Yas', 'Yas tutmanın iki yolu. Birinde yedi gün evden çıkılmaz, aynalar örtülür, komşular yemek getirir; yedinci gün yas biter. Ötekinde ölen kişi aylarca, bazen yıllarca evde tutulur; “hasta” diye anılır, ona yemek götürülür.',
      [O('Süresi belli olan yas.', { D: -1 }), O('Acele etmeyen yas.', { K: -1, G: 1 })],
      'İlki Yahudi geleneğindeki şiva, ikincisi Endonezya\'daki Torajaların âdeti. İkisi de aynı sorunu çözer: yokluğa alışmak zaman ister ve bunu kimse tek başına yapamaz.'),
    kapiadi: { t: 'write', k: 'Kapının adı', q: 'Geçtiğin kapılara bir ad ver. Tek bir sözcük ya da tek bir cümle; buraya kadarki yolun adı ne?',
      after: 'Yazdığın söz terazinin üstüne asılacak.' },
    halay: { t: 'halay', k: 'Halay', q: 'Davulla birlikte vur. Halka her vuruşta parlar; tam o anda dokun.',
      after: '1518 yazında Strazburg\'da bir kadın sokakta dans etmeye başladı ve duramadı. Bir hafta içinde onlarca, bir ayda yüzlerce kişi ona katıldı; kimileri bitkinlikten öldü. Yetkililer çare olarak çalgıcı tuttu. Nedenini hâlâ bilmiyoruz.',
      src: 'John Waller, A Time to Dance, a Time to Die, 2008' },
    remil: { t: 'remil', k: 'Remil', q: 'Kuma dört sıra nokta at. Saymadan, elin gittiği kadar. Her sıra için kuma dokun.',
      after: 'Remilde her sıradaki noktalar sayılır: tekse bir, çiftse iki nokta kalır. Dört sıra, on altı olası şekil verir. Bu, ikili sayı sisteminin ta kendisidir: falcılar bilgisayarlardan bin yıl önce dört bitlik sayılarla çalışıyordu.' },
    remilsec: P('Falın dediği', 'Kum konuştu. Şimdi?',
      [O('Yoluma aynı yönde devam ederim.', { K: 1 }), O('Falın gösterdiği yöne dönerim.', { K: -1 }), O('Beğenmedim; bir daha atarım.', { D: 1, R: 1 })],
      'Bir daha atmak isteyen çok olur. Falcılar bunu bilir ve ikinci atışı saymaz.'),
    oidipus: P('Kehanet', 'Kâhin sana söyledi: babanı öldürecek, annenle evleneceksin.',
      [O('Evimden kaçarım. Uzak durursam olmaz.', { K: 1, Y: 1 }), O('Kalırım. Kaçmak kehaneti getirir.', { K: -1, Y: -1 }), O('Kâhine inanmam.', { G: -1, K: 1 })],
      'Oidipus kaçtı. Kendisini büyütenlerin öz ailesi olmadığını bilmiyordu; kaçtığı yolda öz babasıyla karşılaştı. Kehanet, ondan kaçıldığı için gerçekleşti. Kalsaydı ne olurdu, hikâye söylemiyor.',
      { src: 'Sophokles, Kral Oidipus' }),
    burc: { t: 'burc', k: 'Yıldızlar', q: 'Burcunu seç. Yıldızlar senin için ne diyor, bakalım.',
      after: '1948\'de psikolog Bertram Forer öğrencilerine birer “kişilik çözümlemesi” verdi ve ne kadar isabetli bulduklarını sordu. Ortalama beş üzerinden 4,3 çıktı. Herkese aynı metni vermişti. Az önce okuduğun yorum da on iki burç için aynıydı.',
      src: 'B. R. Forer, Journal of Abnormal and Social Psychology, 1949' },
    kumar: P('Altıncı atış', 'Hilesiz bir para beş kez atıldı ve beşinde de yazı geldi. Altıncı atışta hangisi daha olası?',
      [O('Tura. Artık sırası geldi.', { K: -1 }), O('Yazı. Seri sürüyor.', { R: 1 }), O('İkisi de aynı.', { G: -1 })],
      'Paranın hafızası yoktur. Altıncı atışta olasılık yine yarı yarıyadır. “Sırası geldi” duygusuna kumarbaz yanılgısı denir; 1913\'te Monte Carlo\'da rulet yirmi altı kez üst üste siyaha geldi ve kırmızıya oynayanlar servet yitirdi.',
      { right: 2 }),
    otuzyedi: { t: 'stop', k: 'Ne zaman durmalı', q: 'On iki kapı var; her birinin ardında bir armağan. Sırayla açacaksın. Her kapıda ya armağanı alıp durursun ya da geçersin; geçtiğine dönemezsin. En iyisini almaya çalış.',
      after: 'Matematikte buna en iyi durma problemi denir. Çözümü: adayların ilk yüzde 37\'sini yalnızca izle, kimseyi seçme; sonra o ana dek gördüklerinin hepsinden iyi olan ilk adayı al. Bu yöntem en iyisini yaklaşık yüzde 37 olasılıkla bulur ve daha iyisi yoktur. Aramayı ne çok erken ne çok geç bırakmalı.' },
    sat1: { t: 'chess', k: 'Duvar', q: 'Beyaz oynar. Siyah şah üç piyonunun arkasına saklanmış. Tek hamlede bitir.',
      board: { K: 'g1', R: 'a1', k: 'g8', p: ['f7', 'g7', 'h7'] },
      o: [{ t: 'Kale a8\'e', from: 'a1', to: 'a8', ok: true }, { t: 'Kale a7\'ye', from: 'a1', to: 'a7' }, { t: 'Şah f2\'ye', from: 'g1', to: 'f2' }],
      after: 'Mat. Şahı koruyan üç piyon, kaçacağı üç kareyi de kapattı. Seni koruyan duvar, kaçman gerektiğinde seni hapseden duvardır.' },
    sat2: { t: 'chess', k: 'Nefes', q: 'Beyaz oynar. Siyah şah köşede, yapayalnız. Dikkat: üç hamleden biri oyunu berabere bitirir.',
      board: { K: 'g6', Q: 'e7', k: 'h8', p: [] },
      o: [{ t: 'Vezir f7\'ye', from: 'e7', to: 'f7' }, { t: 'Vezir e8\'e', from: 'e7', to: 'e8', ok: true }, { t: 'Vezir a7\'ye', from: 'e7', to: 'a7' }],
      after: 'Vezir f7\'ye giderse siyah şah tehdit altında değildir ama oynayacak karesi de kalmaz: pat, yani berabere. Rakibini köşeye sıkıştırıp ona tek bir nefes yeri bile bırakmazsan kazanamazsın. Üstün olan, ötekine hamle bırakmak zorundadır.' },
    sat3: { t: 'chess', k: 'En küçük taş', q: 'Beyaz oynar. Siyah şahın çevresi kendi taşlarıyla dolu. Tek hamlede bitir.',
      board: { K: 'g1', N: 'g5', k: 'h8', r: 'g8', p: ['g7', 'h7'] },
      o: [{ t: 'At h7\'yi alır', from: 'g5', to: 'h7' }, { t: 'At e6\'ya', from: 'g5', to: 'e6' }, { t: 'At f7\'ye', from: 'g5', to: 'f7', ok: true }],
      after: 'Boğmaca matı. Şahın bütün komşu kareleri kendi kalesi ve piyonlarıyla dolu olduğu için kıpırdayamaz; onu düşüren, tahtanın en hafif taşlarından biridir. Bir şey daha: satrançta şah tek başına asla mat edemez. En değerli taş bile yalnızken oyunu bitiremez.' },
    yapi: P('Usta', 'Bir yapı ustasısın. Önünde üç iş var; yalnızca birini alabilirsin.',
      [O('Altı yüz yılda bitecek, bittiğini göremeyeceğim bir katedral.', { B: -1, K: -1, Y: -1 }), O('Bir yılda biten, içinde kendim oturacağım bir ev.', { B: 1 }), O('Yirmi yılda bir yıkılıp aynısı yeniden yapılan bir tapınak.', { D: 1, K: -1 })],
      'Köln Katedrali\'nin yapımına 1248\'de başlandı, 1880\'de bitti. Japonya\'daki İse Tapınağı ise bin üç yüz yıldır her yirmi yılda bir sökülüp yanındaki boş arsaya yeniden kuruluyor: yapı eskimez, çünkü hiç eski olmaz; ustalık kuşaktan kuşağa elden geçer. Kalıcılığın iki ayrı tanımı.'),
    stalker: P('Oda', 'Yasak bir bölgenin ortasında bir oda var. İçeri girenin en derindeki dileğini gerçekleştirdiği söyleniyor. Dile getirdiğini değil; gerçekten istediğini. Eşiktesin.',
      [O('Girerim.', { R: 1, K: 1 }), O('Girmem. Gerçekten ne istediğimi öğrenmek istemiyorum.', { R: -1, G: -1 }), O('Önce başkasını sokar, ona ne olduğuna bakarım.', { G: -1, B: 1 })],
      'Andrey Tarkovski\'nin 1979 tarihli “Stalker” filminde iki adam, bir iz sürücünün peşinde o odanın eşiğine kadar gelir. İkisi de girmez. Film, odanın gerçekten çalışıp çalışmadığını hiç söylemez.',
      { src: 'Andrey Tarkovski, Stalker, 1979' }),
    kum: P('Çukur', 'Bir kum çukurunun dibindeki evde alıkondun. Her gece kum küremezsen ev gömülür. Aylar geçti. Bir gün ip merdiveni yerinde unuttular.',
      [O('Çıkar giderim.', { Y: 1, B: 1 }), O('Kalırım. Burası artık bir hayat.', { Y: -1, K: -1 }), O('Çıkarım; ama bir gün dönerim.', { G: 1 })],
      'Hiroshi Teshigahara\'nın 1964 tarihli “Kumların Kadını” filminde adam merdiveni görür, yukarı çıkar, denize bakar ve çukura geri iner. Kumda su biriktirmenin bir yolunu bulmuştur; bunu köylülere anlatmak ister. Kaçış ertelenebilir, der kendine.',
      { src: 'Hiroshi Teshigahara, Suna no Onna, 1964; Kōbō Abe\'nin romanından' }),
    yakinplan: P('Sahte yönetmen', 'İşsiz bir adam, otobüste tanıştığı bir aileye kendini ünlü bir film yönetmeni olarak tanıtıyor. Günlerce evlerine gidiyor, onlara yeni filminde rol sözü veriyor. Sonunda yakalanıyor. Sen o ailedensin.',
      [O('Şikâyetçi olurum.', { D: -1 }), O('Affederim. Sinemayı bizden çok sevmiş.', { G: 1 }), O('Onunla gerçekten bir film çekerim.', { D: 1, R: 1 })],
      'Bu gerçek bir dava: Tahran, 1989. Yönetmen Abbas Kiyarüstemi duruşmayı filme aldı, sonra olayın bütün kişilerine kendi rollerini yeniden oynattı. Sahte yönetmen Hüseyin Sabzian, sonunda gerçek bir filmin başrolünde kendisi olarak yer aldı. Aile onu affetti.',
      { src: 'Abbas Kiyarüstemi, Nema-ye Nazdik (Yakın Plan), 1990', prank: 'kestik' }),
    gercek: P('İki anlatı', '', [O('Kaçarım.', { R: -1, B: 1 }), O('Olduğum yerde kalır, beklerim.', { K: -1 }), O('Ne olduğunu sorarım.', { G: -1, K: 1 })],
      'Öteki bu sahneyi başka bir cümleyle gördü. İkinizin gördüğü sonda yan yana gelecek.',
      { qa: 'Uyandın. Elinde bir taş var. Yerde biri yatıyor; yüzü öbür yana dönük. Bir ses sana tek bir söz söylüyor: “Öldürdün.”', qh: 'Uyandın. Her yer sessiz; kendi bedenine yukarıdan bakıyorsun. Bir ses sana tek bir söz söylüyor: “Öldün.”' }),
    sessiz: { t: 'quiet', k: 'Sessizlik', q: '', after: 'Bu kapıda hiçbir şey yoktu. Geçmenin tek yolu hiçbir şey yapmamaktı.' },
    tanima: { t: 'know', k: 'Tanıma', q: 'Öteki bu üç yerde ne seçti?', after: 'Birini tanımak, onun yerine yanıt verebilmektir. Bazen de veremediğini görmektir.', picks: ['meyve', 'sokrates', 'stalker'] }
  };

  var secrets = [
    P('Gizli geçit', 'Kuralı çiğnedin; kapının arkasında dar bir geçit açıldı. Duvarda senden önce geçenlerin çentikleri var. Bir çentik de sen atabilirsin.',
      [O('Atarım. Buradan geçtiğim bilinsin.', { B: 1 }), O('Atmam. İzsiz geçmek isterim.', { Y: 1, R: -1 })],
      'Pompeii\'nin duvarlarında on binin üzerinde kazıma yazı bulundu. Çoğu yalnızca şunu söyler: falanca buradaydı.'),
    P('Gizli geçit', 'Kuralı çiğnedin; geçidin sonunda bir bekçi uyuyor. Yanında anahtarlar duruyor.',
      [O('Anahtarları alır, bütün kapıları açık bırakırım.', { D: 1, B: -1 }), O('Bekçiyi uyandırıp teslim olurum.', { D: -1 }), O('Sessizce geçer giderim.', { B: 1 })],
      'Kuralı bir kez çiğneyen için asıl soru bundan sonra başlar: bunu kendin için mi yaptın, herkes için mi?')
  ];

  var figures = [
    ['1111', 'Yol', 'Tek başına yürünen uzun bir yol.'], ['2222', 'Kalabalık', 'Çok ses, çok el; kimin konuştuğu belli değil.'],
    ['2112', 'Kavuşma', 'İki ayrı şeyin bir araya gelişi.'], ['1221', 'Zindan', 'Kapalı bir yer; dışarıdan da kilitli olabilir, içeriden de.'],
    ['2211', 'Büyük Talih', 'Yavaş gelen ve kalan iyilik.'], ['1122', 'Küçük Talih', 'Çabuk gelen ve çabuk giden iyilik.'],
    ['2121', 'Kazanç', 'Ele geçen bir şey.'], ['1212', 'Kayıp', 'Elden çıkan bir şey.'],
    ['1222', 'Sevinç', 'Başı yukarıda bir şekil.'], ['2221', 'Keder', 'Başı yere bakan bir şekil.'],
    ['1211', 'Kız', 'Yumuşaklık ve uzlaşma.'], ['1121', 'Oğlan', 'Atılganlık ve kavga.'],
    ['2212', 'Ak', 'Durgun su, açık zihin.'], ['2122', 'Kızıl', 'Öfke; fal burada durdurulur.'],
    ['2111', 'Ejderin Başı', 'Bir başlangıç.'], ['1112', 'Ejderin Kuyruğu', 'Bir bitiş.']
  ];

  var signs = ['Koç', 'Boğa', 'İkizler', 'Yengeç', 'Aslan', 'Başak', 'Terazi', 'Akrep', 'Yay', 'Oğlak', 'Kova', 'Balık'];
  var elements = ['Ateş', 'Toprak', 'Hava', 'Su'];
  var forer = 'Başkalarının seni sevmesine ve beğenmesine gereksinim duyuyorsun, yine de kendine karşı eleştirel davranma eğilimindesin. Kullanmadığın, değerlendirilmemiş büyük bir gizil gücün var. Dışarıdan disiplinli ve kendine hâkim görünsen de içinde zaman zaman kaygı ve güvensizlik duyuyorsun. Bazen doğru kararı verip vermediğinden ciddi biçimde kuşkulanıyorsun. Bir ölçüde değişikliği ve çeşitliliği seviyorsun; kısıtlamalarla çevrildiğinde huzursuz oluyorsun.';

  /* Karakterler: v = [K, D, G, Y, B, R], her biri -2..2. pool: mit | tarih | siradan | film */
  function C(n, pool, v, who, did, end, src) { return { n: n, pool: pool, v: v, who: who, did: did, end: end, src: src }; }
  var chars = {
    a: [
      C('Prometheus', 'mit', [2, 1, 1, 0, -2, 2], 'Bir Titan; öngören.', 'Ateşi tanrılardan çalıp insanlara verdi.', 'Bir kayaya zincirlendi; her gün bir kartal karaciğerini yedi.'),
      C('Sisifos', 'mit', [2, 0, -1, -1, 2, 0], 'Korinthos\'un kurnaz kralı.', 'Ölümü zincire vurdu; bir süre kimse ölmedi.', 'Kayasını sonsuza dek aynı yokuştan çıkarıyor.'),
      C('Gılgamış', 'mit', [1, 0, 1, 2, -1, 1], 'Uruk kralı.', 'Dostunun ölümünden sonra ölümsüzlüğü aradı.', 'Eli boş döndü ve şehrinin surlarıyla yetindi.', 'Gılgamış Destanı'),
      C('Orpheus', 'mit', [0, 0, 2, 1, 1, 1], 'Bir çalgıcı.', 'Sevdiğini geri almak için yeraltına indi.', 'Son adımda dönüp baktı.'),
      C('Hallâc-ı Mansûr', 'tarih', [0, 1, 2, 1, 1, 2], 'Pamuk atan bir babanın oğlu, bir mutasavvıf; 858 dolaylarında doğdu.', 'İçindeki hakikati çarşıda yüksek sesle söyledi.', '922\'de Bağdat\'ta idam edildi.', 'Louis Massignon, La Passion de Hallâj, 1922'),
      C('Sokrates', 'tarih', [0, -2, -2, -2, 0, 0], 'Atinalı bir taş ustasının oğlu.', 'Kimseye bir şey öğretmediğini söyleyip herkese soru sordu.', 'Kaçabilecekken kaldı ve baldıranı içti.', 'Platon, Kriton'),
      C('Diogenes', 'tarih', [2, 2, -1, 0, 2, 0], 'Sinoplu; Atina\'da bir küpün içinde yaşadı.', 'Gündüz vakti fenerle dürüst bir insan aradı.', 'Hiçbir şeye sahip olmadan yaşlandı.', 'Diogenes Laertios, Ünlü Filozofların Yaşamları'),
      C('İbn Battuta', 'tarih', [1, 0, 0, 2, 0, 1], 'Tancalı bir hukukçu.', '1325\'te hacca gitmek için evden çıktı.', 'Yirmi dokuz yıl sonra döndü; yaklaşık 120 bin kilometre yol gitmişti.', 'İbn Battuta, Rıhle'),
      C('Évariste Galois', 'tarih', [2, 1, -2, 0, 1, 2], 'Fransız bir matematikçi.', 'On yedi yaşında, denklemlerin neden çözülemediğini açıklayan kuramı kurdu.', '1832\'de yirmi yaşında bir düelloda öldü; son gecesini notlarını toparlayarak geçirdi.'),
      C('Menocchio', 'siradan', [1, 2, -1, -1, 1, 1], 'Friuli\'de bir köy değirmencisi; asıl adı Domenico Scandella.', 'Okuduğu birkaç kitaptan kendi evren kuramını çıkardı: dünya, peynirin mayalanması gibi oluşmuştu.', 'Engizisyon iki kez yargıladı; 1599\'da yakıldı.', 'Carlo Ginzburg, Peynir ve Kurtlar, 1976'),
      C('Ea-nasir', 'siradan', [0, 1, -1, 0, 2, 1], 'Ur kentinde bir bakır tüccarı; MÖ 1750 dolayları.', 'Müşterisi Nanni\'ye kötü bakır sattı ve habercisini azarladı.', 'Adını, evinde bulunan şikâyet tabletinden biliyoruz.', 'British Museum, tablet 131236'),
      C('Onfim', 'siradan', [0, 1, 2, -1, 0, 0], 'Novgorod\'da yedi yaşlarında bir çocuk; 13. yüzyıl.', 'Huş kabuğuna alfabe çalıştı; sıkılınca atlı savaşçılar ve canavarlar çizdi.', 'Çizimleri yedi yüz yıl çamurun altında bozulmadan kaldı.', 'Novgorod huş kabuğu belgeleri, no. 199-210'),
      C('İz sürücü', 'film', [-1, -1, 2, -1, -1, 1], 'Yasak bölgeye insan götüren bir rehber.', 'Kendisi odaya hiç girmedi; başkalarını eşiğine kadar getirdi.', 'İnanacak birini bulamadan evine döndü.', 'Tarkovski, Stalker, 1979'),
      C('Fontaine', 'film', [2, -2, -2, 0, 0, 1], 'İşgal altındaki Lyon\'da bir direnişçi mahkûm.', 'Bir kaşık ve yatak teliyle haftalarca kapısını söktü.', 'Güvenip güvenemeyeceğini bilmediği hücre arkadaşıyla birlikte kaçtı.', 'Robert Bresson, Bir İdam Mahkûmu Kaçtı, 1956'),
      C('Dersu Uzala', 'film', [-1, -1, 1, -2, -1, -1], 'Uzak Doğu ormanlarında yaşlı bir avcı.', 'Bir harita subayına ormanı okumayı öğretti.', 'Şehirde yaşayamadı; ormana dönerken öldü.', 'Akira Kurosawa, Dersu Uzala, 1975'),
      C('Hüseyin Sabzian', 'film', [1, 2, 2, 0, 1, 2], 'Tahran\'da işsiz bir matbaa işçisi.', 'Kendini ünlü bir yönetmen olarak tanıttı.', 'Yargılandı, affedildi ve kendi hikâyesinin filminde oynadı.', 'Kiyarüstemi, Yakın Plan, 1990')
    ],
    h: [
      C('Lilith', 'mit', [2, 2, 0, 1, 2, 1], 'Anlatıya göre bahçenin ilk kadını.', 'Boyun eğmeyi reddetti.', 'Bahçeyi kendi isteğiyle bıraktı.', 'Ben Sira Alfabesi'),
      C('Antigone', 'mit', [2, 1, 2, -1, 0, 2], 'Thebai kralının yeğeni.', 'Gömülmesi yasaklanan kardeşini gömdü.', 'Diri diri bir mağaraya kapatıldı.', 'Sophokles, Antigone'),
      C('Penelope', 'mit', [0, -1, -1, -2, 0, -2], 'İthaka kraliçesi.', 'Yirmi yıl bekledi; gündüz dokuduğu kefeni gece söktü.', 'Dönen adamı, yalnızca ikisinin bildiği bir sırla sınadı.', 'Homeros, Odysseia'),
      C('Kassandra', 'mit', [-2, 0, 1, 0, 1, 0], 'Troya kralının kızı.', 'Olacakları doğru gördü.', 'Kimse ona inanmadı.'),
      C('İnanna', 'mit', [2, 1, 1, 2, 1, 2], 'Sümerlerin gök tanrıçası.', 'Yeraltına indi; yedi kapının her birinde bir şeyini bıraktı.', 'Üç gün ölü kaldı ve geri döndü.', 'İnanna\'nın Yeraltına İnişi'),
      C('Hypatia', 'tarih', [1, -1, -2, -1, 1, 0], 'İskenderiyeli matematikçi ve filozof.', 'Her inançtan öğrenciye ders verdi.', '415\'te bir güruh tarafından öldürüldü.', 'Sokrates Skholastikos, Kilise Tarihi'),
      C('Râbia el-Adeviyye', 'tarih', [0, 0, 2, -1, 1, -1], 'Basralı bir mutasavvıf; 8. yüzyıl.', 'Cennet umudu ya da cehennem korkusu olmadan sevmeyi öğretti.', 'Yoksul ve tek başına yaşadı; sözleri bin iki yüz yıldır aktarılıyor.', 'Ferîdüddin Attâr, Tezkiretü\'l-Evliyâ'),
      C('Tomris', 'tarih', [2, -1, 0, -2, -2, 1], 'Massaget kraliçesi; MÖ 6. yüzyıl.', 'Pers kralı Kyros\'un evlilik önerisini geri çevirdi.', 'Herodotos\'a göre Kyros\'u savaşta yendi.', 'Herodotos, Tarih, I. kitap'),
      C('Enheduanna', 'tarih', [1, -1, 1, -1, 0, 0], 'Ur\'da başrahibe; MÖ 2300 dolayları.', 'İlahiler yazdı ve altına kendi adını koydu.', 'Sürgün edildi, geri döndü; adını bildiğimiz ilk yazar oldu.'),
      C('Emmy Noether', 'tarih', [1, 0, -2, 0, 0, 0], 'Alman bir matematikçi; 1882-1935.', 'Fizikteki her korunum yasasının bir simetriden doğduğunu kanıtladı.', 'Yıllarca ücretsiz ders verdi; 1933\'te üniversiteden atıldı.'),
      C('Ching Shih', 'tarih', [2, -1, -1, 1, 0, 2], 'Güney Çin Denizi\'nde bir korsan; 19. yüzyıl başı.', 'On binlerce korsanı sıkı bir yasayla yönetti.', 'Hükümetle af pazarlığı yaptı, servetini korudu ve yatağında öldü.'),
      C('Harriet Tubman', 'tarih', [2, 1, 1, 2, -2, 2], 'Maryland\'de köle doğdu.', '1849\'da kaçtı; sonra defalarca geri dönüp başkalarını kaçırdı.', 'Hiçbir yolcusunu yitirmedi.'),
      C('Lamassī', 'siradan', [0, -1, -1, -2, -1, 0], 'Asur kentinde bir dokumacı; MÖ 19. yüzyıl.', 'Dokuduğu kumaşları Kayseri yakınındaki Kaniş\'te ticaret yapan kocasına yolladı.', 'Mektuplarında kumaşın kalitesini savunur ve parasını ister.', 'Kültepe tabletleri'),
      C('Egeria', 'siradan', [1, 0, 1, 2, 0, 1], 'Batı Avrupalı bir kadın; 4. yüzyıl.', 'Sina\'ya, Kudüs\'e ve Urfa\'ya yürüdü.', 'Gördüklerini evdeki kadın dostlarına uzun bir mektupla anlattı.', 'Itinerarium Egeriae'),
      C('Tapputi', 'siradan', [0, -1, -2, -1, 0, 0], 'Babil sarayında bir koku ustası; MÖ 1200 dolayları.', 'Çiçek, yağ ve reçineyi damıtıp süzerek koku yaptı.', 'Bir çivi yazılı tablette adı geçer; adı bilinen ilk kimyacılardandır.'),
      C('Kumlardaki kadın', 'film', [-1, -2, 0, -2, -1, -2], 'Bir kum çukurunun dibindeki evde yaşayan dul.', 'Her gece kum kürer; köy ona su ve yiyecek indirir.', 'Çukurdan çıkmayı hiç istemez.', 'Teshigahara, Kumların Kadını, 1964'),
      C('Cléo', 'film', [0, 1, 2, 1, 1, 0], 'Parisli bir şarkıcı.', 'Bir tahlil sonucunu beklerken iki saat şehirde yürüdü.', 'Korkusunu bir yabancıya anlattı ve hafifledi.', 'Agnès Varda, Cléo 5\'ten 7\'ye, 1962'),
      C('Jeanne Dielman', 'film', [-1, -2, -2, -2, 1, -1], 'Brüksel\'de dul bir kadın.', 'Üç gün boyunca aynı ev işlerini aynı sırayla yaptı.', 'Düzen bir kez şaştı; gerisi çözüldü.', 'Chantal Akerman, Jeanne Dielman, 1975'),
      C('Ana', 'film', [1, 1, 2, 1, 1, 2], 'Kastilya\'da bir köyde altı yaşında bir kız; 1940.', 'Seyyar sinemada bir canavar filmi izledi.', 'Canavarı gerçekten aramaya çıktı.', 'Víctor Erice, Arı Kovanının Ruhu, 1973')
    ]
  };

  var QD = { axes: axes, gates: gates, scenes: scenes, secrets: secrets, figures: figures, signs: signs, elements: elements, forer: forer, chars: chars,
    pools: { mit: 'Mitolojide', tarih: 'Tarihte', siradan: 'Sıradan insanlar arasında', film: 'Perdede' } };
  if (typeof module !== 'undefined' && module.exports) module.exports = QD;
  else root.QD = QD;
})(typeof window !== 'undefined' ? window : this);
