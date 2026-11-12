/* Otuz Kuş — Akış üreteçleri: sabit kartları tohuma göre değişen kartlara çevirir.
   Aynı tohum her zaman aynı varyasyonu verir (make(r, seed) içindeki r tohumdan türetilir).
   Buradaki dizeler kamu malıdır (Yunus Emre, Karacaoğlan, Dadaloğlu, Köroğlu) ya da
   1830'dan önce ölmüş Japon şairlerin haikularının bu oyun için yapılmış serbest çevirileridir. */
(function (root) {
  'use strict';
  var D = (typeof module !== 'undefined' && module.exports) ? require('./flow.js') : root.Data;

  function pick(r, arr) { return arr[Math.floor(r() * arr.length)]; }
  function draw(r, arr, n) {
    var a = arr.slice(), out = [];
    while (out.length < n && a.length) out.push(a.splice(Math.floor(r() * a.length), 1)[0]);
    return out;
  }
  function byId(id) { return D.flow.filter(function (c) { return c.id === id; })[0]; }

  /* ---- hızlı tur havuzu: [cümle, doğru mu, (efsaneyse) düzeltme] ---- */
  var TRUE = [
    'Ahtapotun üç kalbi vardır.', "Venüs'te bir gün, bir yıldan uzun sürer.", 'İyi saklanan bal binlerce yıl bozulmaz.',
    'Muz bir ağaçta değil, dev bir otsu bitkide yetişir.', "Kleopatra, piramitlerin yapımından çok Ay'a inişe yakın bir tarihte yaşadı.",
    "Oxford Üniversitesi, Aztek İmparatorluğu'ndan eskidir.", 'Parmak izi gibi dil izi de kişiye özgüdür.',
    'Köpekbalıkları yeryüzünde ağaçlardan daha uzun süredir var.', 'Sıradan bir bulut yüzlerce ton ağırlığındadır.',
    "İskoçya'nın ulusal hayvanı tek boynuzlu attır.", 'Timsah dilini dışarı çıkaramaz.', 'Vombatın dışkısı küp biçimindedir.',
    'Deniz samurları uyurken sürüklenmemek için el ele tutuşur.', 'Eyfel Kulesi yaz sıcağında birkaç santimetre uzar.',
    "Satürn'ün ortalama yoğunluğu sudan azdır.", "Fransa'da giyotinle son idam, ilk Yıldız Savaşları filminin gösterime girdiği yıl yapıldı.",
    'Bal arıları insan yüzlerini ayırt etmeyi öğrenebilir.', "Nintendo 1889'da kuruldu ve oyun kâğıdı üretiyordu.",
    "Yeryüzündeki ağaçların sayısı Samanyolu'ndaki yıldızların sayısından fazladır.", 'Antarktika bir çöldür.',
    'Gize piramitleri yapılırken yeryüzünde hâlâ mamut yaşıyordu.', 'Kelebekler ayaklarıyla tat alır.',
    'Zürafanın boynunda insanla aynı sayıda omur vardır.', '“Yoğurt” sözcüğü dünya dillerine Türkçeden geçmiştir.',
    "Lale Hollanda'nın değil, Orta Asya'nın yerli çiçeğidir.", "Bir yıldırımın sıcaklığı Güneş'in yüzeyinden yüksektir.",
    "Noel Baba'nın esin kaynağı Aziz Nikolaos, bugünkü Antalya'nın Demre ilçesinde yaşadı.", "Rusya'nın yüzölçümü Plüton'un yüzeyinden büyüktür."
  ];
  var MYTH = [
    ['Çin Seddi uzaydan çıplak gözle görülür.', 'Uzun ama dar; yörüngeden seçilmez.'],
    ['Japon balığının hafızası üç saniyedir.', 'Aylarca hatırlar.'],
    ['Yıldırım aynı yere iki kez düşmez.', 'Yüksek yapılara yılda defalarca düşer.'],
    ['Boğalar kırmızı renge öfkelenir.', 'Kırmızıyı ayırt edemezler; onları hareket kışkırtır.'],
    ['Napolyon çağının ortalamasına göre çok kısaydı.', 'Ortalama boydaydı.'],
    ['Damarlardaki kan mavidir.', 'Kan her zaman kırmızıdır.'],
    ['Einstein okulda matematikten kalmıştı.', 'Matematikte çok iyiydi.'],
    ['Saç ve tırnak ölümden sonra uzamayı sürdürür.', 'Deri çekilir, bu yüzden uzamış görünür.'],
    ['Deve hörgücünde su depolar.', 'Yağ depolar.'],
    ['Vikingler boynuzlu miğfer takardı.', 'Boynuzlu miğfer 19. yüzyıl opera kostümlerinden kalmadır.'],
    ['İnsanın yalnızca beş duyusu vardır.', 'Denge, sıcaklık, ağrı ve bedenin konumu da birer duyudur.'],
    ['Devekuşu korkunca başını kuma gömer.', 'Yere yatar; uzaktan öyle görünür.'],
    ['Yarasalar kördür.', 'Görürler; birçoğu ayrıca sesle yön bulur.'],
    ['Dilin her bölgesi ayrı bir tadı alır.', '“Tat haritası” yanlıştır; her bölge her tadı alır.'],
    ["Orta Çağ'da okumuşlar Dünya'yı düz sanıyordu.", "Antik Çağ'dan beri küre olduğu biliniyordu."],
    ["Mevsimler, Dünya Güneş'e yaklaşıp uzaklaştığı için oluşur.", 'Eksen eğikliğinden oluşur.'],
    ['Frankenstein, canavarın adıdır.', 'Onu yapan doktorun adıdır.'],
    ['Bukalemunlar yalnızca gizlenmek için renk değiştirir.', 'Çoğunlukla iletişim ve ısı dengesi için değiştirirler.'],
    ['Şeker çocukları hiperaktif yapar.', 'Kontrollü çalışmalar böyle bir etki göstermedi.'],
    ['Uzay istasyonunda yerçekimi yoktur.', 'Çekim oradadır; astronotlar sürekli düşmektedir.'],
    ['Yutulan sakız midede yedi yıl kalır.', 'Sindirilmeden birkaç günde atılır.'],
    ['Mısır piramitlerini köleler yaptı.', 'Beslenen ve barındırılan işçiler yaptı; mezarları bulundu.'],
    ["Eski Roma'da ziyafetlerde kusmak için “vomitorium” denen odalar vardı.", 'Vomitorium, stadyumların çıkış koridorudur.'],
    ['Marie Antoinette “Ekmek bulamıyorlarsa pasta yesinler” dedi.', 'Söylediğine dair kanıt yok; söz ondan önce de dolaşıyordu.'],
    ['Newton yerçekimini başına elma düşünce buldu.', 'Bir elmanın düşüşünü izlediğini anlattı; başına düştüğü sonradan eklendi.'],
    ['Ev sineği yalnızca bir gün yaşar.', 'Haftalarca yaşar; bir gün yaşayan mayıs sineğidir.'],
    ["Kuzey Kutbu'nda penguen yaşar.", 'Penguenler güney yarımkürede yaşar.'],
    ['Tavuklar hiç uçamaz.', 'Kısa mesafeler uçabilirler.'],
    ["Ay'ın bize görünmeyen yüzü hiç güneş almaz.", 'O yüz de iki haftalık gündüz yaşar.']
  ];
  function rapidMake(half) {
    return function (r) {
      var t = TRUE.filter(function (_, i) { return i % 2 === half; });
      var m = MYTH.filter(function (_, i) { return i % 2 === half; });
      var items = draw(r, t, 4).map(function (s) { return [s, true]; })
        .concat(draw(r, m, 4).map(function (x) { return [x[0], false, x[1]]; }));
      return { items: draw(r, items, items.length) };
    };
  }
  byId(130).make = rapidMake(0);
  byId(131).make = rapidMake(1);
  byId(130).x = byId(131).x = 'Efsanelerin çoğu yanlış oldukları için değil, iyi hikâye oldukları için yaşar. Kısa, şaşırtıcı ve tekrarlaması kolay bir cümle, doğru olup olmadığına bakılmadan yayılır.';

  /* ---- e'siz ve a'sız cümle: konu tohuma göre değişir ---- */
  var TOPICS = ['kahve', 'tren', 'annen', 'yağmur', 'pazar sabahı', 'bir kedi', 'deniz', 'çocukluğun', 'ekmek', 'uykusuzluk',
    'bir yolculuk', 'kar', 'bir kapı', 'komşun', 'sonbahar', 'bir şarkı', 'otobüs durağı', 'bir dağ', 'bir mektup', 'ay'];
  var perec = byId(101);
  perec.make = function (r) {
    return { q: perec.q + ' Konun: ' + pick(r, TOPICS) + '. Konunun adında “e” varsa onu da kullanamazsın; başka yoldan anlat.' };
  };
  D.flow.push({ id: 147, w: 'yazi', heavy: true, t: 'lipo', ban: 'a', min: 5,
    q: 'Türkçede en sık kullanılan harf “a”dır. İçinde hiç “a” olmayan, en az beş sözcüklü bir cümle yaz.',
    make: function (r) { return { q: this.q + ' Konun: ' + pick(r, TOPICS) + '.' }; },
    x: 'Perec\'in de üyesi olduğu Oulipo topluluğu 1960\'tan beri bu tür kısıtlarla yazıyor: bir harfi yasaklamak, her sözcüğü bir öncekinden bir harf uzun kurmak, bir metni yalnızca tek bir ünlüyle yazmak. Savları şu: kısıt, yazarı alışkanlıklarından kurtarır.',
    src: 'Oulipo (Ouvroir de littérature potentielle), kuruluş 1960' });

  /* ---- dörtlük havuzu: sıralama ve eksik sözcük ---- */
  var QUAT = [
    { by: 'Yunus Emre', lines: ['Ben gelmedim dâvî için', 'Benim işim sevi için', 'Dostun evi gönüllerdir', 'Gönüller yapmaya geldim'], gap: [2, 'gönüllerdir', ['saraylardır', 'uzaklardır', 'dağlardadır']],
      n: '“Dâvî” kavga, “sevi” sevgi demek. Yunus, Anadolu\'nun Moğol akınları ve kıtlıkla sarsıldığı bir yüzyılda halkın konuştuğu Türkçeyle yazdı.' },
    { by: 'Yunus Emre', lines: ['İlim ilim bilmektir', 'İlim kendin bilmektir', 'Sen kendini bilmezsin', 'Ya nice okumaktır'], gap: [1, 'kendin', ['kitap', 'dünya', 'yolu']],
      n: 'Delfi tapınağının girişinde de “Kendini bil” yazıyordu. Aralarında bin sekiz yüz yıl olan iki kültür, bilginin nereden başladığı konusunda aynı yere varmış.' },
    { by: 'Yunus Emre', lines: ['Gelin tanış olalım', 'İşi kolay kılalım', 'Sevelim sevilelim', 'Dünya kimseye kalmaz'], gap: [3, 'kalmaz', ['yetmez', 'gülmez', 'dönmez']],
      n: 'Yedi yüz yıl önce söylenmiş ve hâlâ açıklama gerektirmiyor. Bir dizenin bu kadar uzun yaşamasının sırrı belki de budur.' },
    { by: 'Yunus Emre', lines: ['Mal sahibi mülk sahibi', 'Hani bunun ilk sahibi', 'Mal da yalan mülk de yalan', 'Var biraz da sen oyalan'], gap: [3, 'oyalan', ['kazan', 'uzan', 'dolan']],
      n: 'Son dizedeki alay önemli: Yunus öğüt vermiyor, omuz silkiyor. Sahip olduğunu sandığın şeyle biraz da sen oyalan.' },
    { by: 'Karacaoğlan', lines: ['İncecikten bir kar yağar', 'Tozar Elif Elif diye', 'Deli gönül abdal olmuş', 'Gezer Elif Elif diye'], gap: [2, 'abdal', ['sultan', 'bülbül', 'yolcu']],
      n: 'Karacaoğlan 17. yüzyılda Toroslar\'da yaşamış bir âşıktır. “Abdal” gezgin derviş demek: gönül, sevdiğinin adını sayıklayarak dolaşan bir dervişe dönmüş.' },
    { by: 'Dadaloğlu', lines: ['Kalktı göç eyledi Avşar elleri', 'Ağır ağır giden eller bizimdir', 'Arap atlar yakın eyler ırağı', 'Yüce dağdan aşan yollar bizimdir'], gap: [2, 'ırağı', ['dağları', 'gurbeti', 'yolları']],
      n: 'Dadaloğlu 19. yüzyılda, göçebe Avşarların zorla yerleştirildiği yıllarda yaşadı. “Irak” uzak demek. Şiir bir göçün ve bir direnişin sesidir.' },
    { by: 'Köroğlu', lines: ["Benden selam olsun Bolu Beyi'ne", 'Çıkıp şu dağlara yaslanmalıdır', 'At kişnemesinden kargı sesinden', 'Dağlar seda verip seslenmelidir'], gap: [3, 'seda', ['haber', 'yol', 'kar']],
      n: 'Köroğlu\'nun destanı Balkanlar\'dan Orta Asya\'ya dek anlatılır. Babasının gözlerine mil çektiren beye karşı dağa çıkan adamın hikâyesi, her anlatıldığı yerde biraz değişir.' }
  ];
  byId(105).make = function (r, seed) {
    var v = QUAT[seed % QUAT.length];
    return { q: 'Bir dörtlüğün dizeleri karışmış (' + v.by + '). Doğru sıraya koy.', items: v.lines, x: v.n };
  };
  byId(106).make = function (r, seed) {
    var v = QUAT[(seed + 3) % QUAT.length];
    var verse = v.lines.map(function (l, i) { return i === v.gap[0] ? l.replace(v.gap[1], '____') : l; });
    return { q: 'Bu dörtlükten bir sözcük düşmüş (' + v.by + '). Hangisi?', verse: verse, o: [v.gap[2][0], v.gap[1], v.gap[2][1], v.gap[2][2]], a: 1, x: v.n };
  };

  /* ---- haiku havuzu: eksik dize ---- */
  var HAIKU = [
    { by: 'Matsuo Bashō', y: 1686, lines: ['Eski gölcük,', 'bir kurbağa atlar:'], last: 'suyun sesi', o: ['ayın yüzü', 'derin uyku', 'rüzgâr diner'],
      n: 'Japoncanın en ünlü on yedi hecesi. Hiçbir şey olmuyor: bir kurbağa suya atlıyor. Bashō\'nun buluşu, şiirin büyük olaylara ihtiyacı olmadığını göstermekti.' },
    { by: 'Matsuo Bashō', y: 1680, lines: ['Kuru bir dalda', 'bir karga tünemiş:'], last: 'güz akşamı', o: ['bahar sabahı', 'yaz öğlesi', 'düğün günü'],
      n: 'Haikuda mevsimi sezdiren bir sözcük bulunur. Burada sözcük apaçık; ama karga ile kuru dal zaten güzü söylemişti.' },
    { by: 'Matsuo Bashō', y: 1689, lines: ['Yaz otları:', 'yiğit savaşçıların'], last: 'düşlerinden kalan', o: ['kılıçları parlar', 'atları koşuyor', 'zaferi sürüyor'],
      n: 'Bashō bunu beş yüz yıl önce büyük bir savaşın yapıldığı ovada yazdı. Kaleden, ordudan, ünden geriye kalan: ot.' },
    { by: 'Matsuo Bashō', y: 1689, lines: ['Sessizlik:', 'kayaların içine işler'], last: 'ağustosböceği sesi', o: ['yağmurun kokusu', 'ayın ışığı', 'keşişin duası'],
      n: 'Bir dağ tapınağında yazıldı. Sessizliği anlatmanın yolu olarak bir ses seçmiş: ses o kadar yalnız ki sessizliği büyütüyor.' },
    { by: 'Matsuo Bashō', y: 1694, lines: ['Yolda hastalandım:', 'düşlerim dolanıp durur'], last: 'kuru kırlarda', o: ['çiçek bahçesinde', 'annemin evinde', 'sarayın avlusunda'],
      n: 'Bashō\'nun son haikusu. Ömrünü yürüyerek geçirdi ve yolda öldü; düşleri bile yürümeyi sürdürüyor.' },
    { by: 'Kobayashi Issa', y: null, lines: ['Salyangoz,', 'tırman Fuji Dağı\'na,'], last: 'ağır ağır', o: ['koşa koşa', 'bu gece', 'benden önce'],
      n: 'Issa yirmi binden fazla haiku yazdı; kahramanları çoğunlukla sinek, pire, serçe, salyangozdur. Küçük olanla alay etmez, onu yüreklendirir.' },
    { by: 'Kobayashi Issa', y: null, lines: ['Vurma ona!', 'Bak, sinek yalvarıyor:'], last: 'ellerini ovuşturuyor', o: ['öfkeyle vızıldıyor', 'pencereden kaçıyor', 'yemeğime konuyor'],
      n: 'Sineğin ön ayaklarını birbirine sürtmesini herkes görmüştür. Issa ona iki yüz yıl önce bakıp yalvaran birini gördü.' },
    { by: 'Yosa Buson', y: null, lines: ['Bahar denizi:', 'bütün gün'], last: 'kabarır iner, kabarır iner', o: ['tek dalga yok', 'balıkçılar bağırır', 'fırtına kopar'],
      n: 'Buson aynı zamanda ressamdı. Özgün dizedeki yinelenen sözcük dalganın sesini taklit eder; çeviride yinelemeyi korumak gerekir.' },
    { by: 'Chiyo-ni', y: null, lines: ['Gündüzsefası', 'sarmış kuyu kovamı:'], last: 'su istedim komşudan', o: ['kopardım attım', 'kova kırılmış', 'kuyu kurumuş'],
      n: 'Chiyo-ni 18. yüzyılın en tanınmış kadın haiku şairidir. Sabah kuyuya gidiyor, çiçek kovaya sarılmış; çiçeği koparmamak için komşuya gidiyor.' },
    { by: 'Kobayashi Issa', y: 1819, lines: ['Çiy dünyası bu,', 'çiy dünyası, bilirim,'], last: 'ama yine de...', o: ['her şey geçer gider', 'sabah olacak', 'ağlamam artık'],
      n: 'Issa bunu küçük kızını yitirdikten sonra yazdı. Öğretiyi biliyor ve kabul ediyor; yine de acı çekiyor. Bilmek ile teselli bulmak aynı şey değil.' }
  ];
  function haikuMake(shift) {
    return function (r, seed) {
      var h = HAIKU[(seed + shift) % HAIKU.length];
      return { q: h.by + (h.y ? ', ' + h.y : '') + '. Haikunun son dizesi eksik. Hangisi?', verse: h.lines.concat(['____']),
        o: [h.o[0], h.last, h.o[1], h.o[2]], a: 1, x: h.n + ' Çeviri bu oyun için yapıldı.' };
    };
  }
  byId(107).make = haikuMake(0);
  D.flow.push({ id: 148, w: 'siir', t: 'quiz', q: 'Haikunun son dizesi eksik. Hangisi?', verse: ['____'], o: ['', '', ''], a: 1, x: 'Haiku.', make: haikuMake(5) });

  /* ---- düşünce deneyi üreteci: kim öneriyor × ne öneriyor × bedeli ne ---- */
  var WHO = ['Devlet', 'Çalıştığın şirket', 'En yakın arkadaşın'];
  var TECH = [
    ['yalan söylediğinde herkesin görebileceği bir ışık yakan bir bilezik', 'Yalansız bir dünya kulağa hoş geliyor. Ama “çok güzel olmuş”, “hiç yormadın”, “iyiyim” de söylenemez olurdu. Antropologlara göre küçük yalanlar toplumsal hayatın yağıdır; incelik ile sahtekârlık arasındaki çizgiyi bir bilezik çizemez.'],
    ['sevdiğin birinin sesini ve konuşma biçimini, o öldükten sonra da sürdüren bir yazılım', 'Madagaskar\'da ataların kemikleriyle dans edilir, Meksika\'da ölülere sofra kurulur: ölülerle konuşmak yeni bir fikir değil. Yeni olan, ölünün yanıt vermesi. Yas, bir yokluğu kabul etmeyi öğrenmektir; yokluk hiç gelmezse yas biter mi, yoksa hiç başlamaz mı?'],
    ['uyku ihtiyacını bütünüyle ortadan kaldıran bir hap', 'Günde sekiz saat kazanırdın. Soru şu: o saatler kimin olurdu? Elektrik ışığı da geceyi bize kazandırmıştı; kazanılan saatlerin çoğu çalışmaya gitti. Uyku, kimsenin senden bir şey isteyemediği son yer olabilir.']
  ];
  var COST = ['Tek koşul: bir kez kabul edersen geri dönüşü yok.', 'Tek koşul: bütün verilerin süresiz saklanacak.', 'Tek koşul: sen kabul edersen çevrendeki herkes de kullanmak zorunda kalacak.'];
  D.flow.push({ id: 149, w: 'kurgu', heavy: true, t: 'dilemma', q: 'Yakın gelecekten bir teklif.', o: ['Kabul ederdim.', 'Kabul etmezdim.'], x: 'Teklif.',
    make: function (r) {
      var t = pick(r, TECH);
      return { q: 'Yıl 2041. ' + pick(r, WHO) + ' sana ' + t[0] + ' öneriyor. ' + pick(r, COST) + ' Kabul eder miydin?', x: t[1] };
    } });

  /* ---- karşılaştırma kartları: aynı insan işi, iki ayrı yol ---- */
  D.flow.push(
    { id: 144, w: 'gorenek', t: 'dilemma',
      q: 'Yas tutmanın iki yolu. Yahudi geleneğinde “şiva”: yedi gün evden çıkılmaz, aynalar örtülür, yere yakın oturulur, komşular yemek getirir; yedinci gün yas evinden çıkılıp sokakta yürünür. Endonezya\'da Torajalar: ölen kişi aylarca, bazen yıllarca evde tutulur, “hasta” diye anılır, ona yemek götürülür; cenaze, aile hazır olduğunda yapılır. Hangisi sana daha yakın?',
      o: ['Süresi belli, sıkı kurallı yas', 'Acele etmeyen, ölüyü evde tutan yas'],
      x: 'İkisi de aynı sorunu çözüyor: yokluğa alışmak zaman ister ve insan bunu tek başına yapamaz. Biri zamanı takvime bağlıyor, öbürü aileye bırakıyor. Senin kültürünün yedisi, kırkı, elli ikisi de aynı işi görür.' },
    { id: 145, w: 'antropoloji', t: 'dilemma',
      q: 'İsim koymanın iki yolu. Gana\'da Akan halkında çocuğun ilk adı doğduğu güne göre hazırdır: cuma günü doğan erkek “Kofi”, cumartesi doğan “Kwame” olur. İzlanda\'da soyadı yoktur: Jón\'un oğlu “Jónsson”, kızı “Jónsdóttir” diye anılır ve bu ad bir sonraki kuşağa geçmez. Sana hangisi daha yakın?',
      o: ['Adımı doğduğum an belirlesin', 'Adım kimin çocuğu olduğumu söylesin'],
      x: 'Ad, toplumun sana sorduğu ilk sorunun yanıtıdır: ne zaman geldin, kimdensin, nerelisin, ne iş yaparsın. Türkiye\'de soyadı 1934\'te yasayla geldi; ondan önce insanlar baba adı, lakap ve memleketle anılırdı.' },
    { id: 146, w: 'gorenek', t: 'dilemma',
      q: 'Misafirliğin iki yolu. Bedevi geleneğinde çadıra gelen yabancıya üç gün boyunca kim olduğu ve ne istediği sorulmaz; önce doyurulur. Çin\'de armağanın kendisi bir dildir: saat hediye edilmez, çünkü “saat vermek” sözü “son yolculuğa uğurlamak” ile aynı sesi verir. Hangisi sana daha yakın?',
      o: ['Soru sormadan ağırlamak', 'Her ayrıntının anlamını gözetmek'],
      x: 'Misafirlik her yerde bir sınavdır; yalnız sınanan şey değişir. Bir yerde cömertlik sınanır, bir yerde incelik. “Tanrı misafiri” deyimi birincisine, “eli boş gidilmez” kuralı ikincisine yakındır; ikisi de aynı evde yaşayabilir.' }
  );

  /* ---- kaynak künyeleri: yalnızca emin olunan yayınlar; bağlantı uydurulmaz ---- */
  var SRC = {
    101: 'Georges Perec, La Disparition, 1969',
    102: 'James Joyce, Finnegans Wake, 1939; Murray Gell-Mann, The Quark and the Jaguar, 1994',
    109: 'Akira Kurosawa, Rashōmon, 1950',
    110: 'Robert J. Flaherty, Nanook of the North, 1922',
    111: 'Stanley Kubrick, 2001: A Space Odyssey, 1968',
    112: 'Godfrey Reggio, Koyaanisqatsi, 1982',
    116: 'Horace Miner, “Body Ritual among the Nacirema”, American Anthropologist, 1956',
    119: 'Mary Douglas, Purity and Danger, 1966',
    120: 'Marcel Mauss, Essai sur le don, 1925',
    121: 'Charles Darwin, The Formation of Vegetable Mould through the Action of Worms, 1881',
    122: 'Herbert Spencer, Principles of Biology, 1864; Darwin, Türlerin Kökeni, 5. baskı, 1869',
    127: 'NASA, Voyager Golden Record, 1977',
    128: 'NASA, “Pale Blue Dot” fotoğrafı, 14 Şubat 1990',
    132: 'Mevlânâ, Mesnevî, 3. defter',
    134: 'Mevlânâ, Mesnevî, 1. defter, ilk on sekiz beyit',
    114: 'Jorge Luis Borges, “Funes el memorioso”, 1942',
    137: 'Robert Nozick, Anarchy, State, and Utopia, 1974',
    138: 'Derek Parfit, Reasons and Persons, 1984',
    141: 'Robin Dunbar, Journal of Human Evolution, 1992'
  };
  Object.keys(SRC).forEach(function (id) { byId(+id).src = SRC[id]; });

  D.pools = { TRUE: TRUE, MYTH: MYTH, QUAT: QUAT, HAIKU: HAIKU, TOPICS: TOPICS };
  if (typeof module !== 'undefined' && module.exports) module.exports = D;
})(typeof window !== 'undefined' ? window : this);
