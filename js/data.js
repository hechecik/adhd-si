/* Otuz Kuş — oyunun bütün içeriği.
   KURALLAR (bkz. AGENTS.md):
   - Telifli şiir/kitap metni alıntılanmaz; yazarlar temaları, yaşamları ve eser adlarıyla anlatılır.
   - Her bilgi doğrulanabilir olmalı. Tek kasıtlı yanlış: "Tohum" bölümündeki %10 beyin efsanesi
     (25. tüyde oyuncuya buldurulur). Başka bilerek yanlış bilgi yoktur. */
(function (root) {
  'use strict';

  var birds = [
    { id: 'hudhud', n: 'Hüdhüd (ibibik)', e: '🪶', f: 'Attâr\'ın 12. yüzyıl mesnevisinde kuşlara yol gösteren odur. Tepesindeki sorguç bir taç gibi açılıp kapanır.' },
    { id: 'ispinoz', n: 'İspinoz', e: '🐤', f: 'Galápagos\'taki akrabalarının gagaları adadan adaya değişir; Darwin\'e türlerin değişebildiğini düşündüren ipuçlarından biri oldu.' },
    { id: 'karga', n: 'Karga', e: '🐦‍⬛', f: 'İnsan yüzlerini tanır, kendisine kötü davrananı yıllarca unutmaz; üstelik bunu öteki kargalara da öğretir.' },
    { id: 'devekusu', n: 'Devekuşu', e: '🦤', f: 'Gözü beyninden büyüktür. Görmek ile anlamak aynı şey değildir.' },
    { id: 'akbaba', n: 'Akbaba', e: '🦅', f: 'Bilinen en eski çalgılardan biri, yaklaşık 40 bin yıl önce bir kızıl akbabanın kanat kemiğinden oyulmuş flüttür.' },
    { id: 'saksagan', n: 'Saksağan', e: '🐦', f: 'Aynada gördüğünün kendisi olduğunu anladığı gösterilen ilk kuş (2008).' },
    { id: 'baykus', n: 'Baykuş', e: '🦉', f: 'Başını yaklaşık 270 derece çevirebilir; gözleri yuvasında dönmediği için dünyaya bakmanın yolu başını çevirmektir.' },
    { id: 'guvercin', n: 'Güvercin', e: '🕊️', f: 'Yüzlerce kilometre öteden yuvasını bulur. Bunu tam olarak nasıl yaptığı hâlâ tartışılıyor.' },
    { id: 'serce', n: 'Serçe', e: '🐥', f: 'Tarımla birlikte insanın peşine takıldı; on bin yıldır tahılın olduğu her yere bizimle geliyor.' },
    { id: 'bulbul', n: 'Bülbül', e: '🎶', f: 'Bir erkek bülbül yüzün çok üstünde farklı ezgi bilir. Doğu şiirinde gülün âşığıdır.' },
    { id: 'sumru', n: 'Kutup sumrusu', e: '🕊️', f: 'Her yıl Kuzey Kutbu\'ndan Güney Kutbu\'na gidip döner: yaklaşık 70 bin kilometre. Ömründe en çok gün ışığı gören canlı sayılır.' },
    { id: 'sinekkusu', n: 'Sinekkuşu', e: '🌺', f: 'Geri geri uçabilen tek kuş. Kalbi dakikada binin üzerinde atabilir.' },
    { id: 'papagan', n: 'Gri papağan', e: '🦜', f: 'Alex adlı gri papağan yüzden fazla sözcüğü yerinde kullanıyor, renkleri ve sayıları ayırt ediyordu.' },
    { id: 'lirkusu', n: 'Lir kuşu', e: '🎼', f: 'Duyduğu hemen her sesi taklit eder: başka kuşları, fotoğraf makinesi deklanşörünü, hatta motorlu testereyi.' },
    { id: 'kirlangic', n: 'Kırlangıç', e: '🐦', f: 'Aristoteles kışın kaybolmalarını kış uykusuyla açıklıyordu. Göç ettikleri yüzyıllar sonra anlaşıldı.' },
    { id: 'sigircik', n: 'Sığırcık', e: '✨', f: 'Binlercesi tek bir beden gibi döner. Sır basit: her kuş yalnızca en yakın altı yedi komşusunu izler.' },
    { id: 'tavus', n: 'Tavus', e: '🦚', f: 'Darwin bir mektubunda tavus kuyruğundaki tüye bakmanın kendisini hasta ettiğini yazmıştı; hayatta kalmaya yaramayan güzelliği açıklaması gerekiyordu.' },
    { id: 'leylek', n: 'Leylek', e: '🪽', f: '1822\'de Almanya\'da boynunda Orta Afrika yapımı bir okla dolaşan leylek bulundu. Kuşların kışın nereye gittiğinin ilk somut kanıtlarından biriydi.' },
    { id: 'turna', n: 'Turna', e: '🪿', f: 'Anadolu semahlarında da Japon kâğıt katlama geleneğinde de baş kuştur. İki kültür birbirini tanımadan aynı kuşu kutsal saymış.' },
    { id: 'guguk', n: 'Guguk', e: '🥚', f: 'Yumurtasını başka kuşların yuvasına bırakır. Yavrusunu hiç tanımadığı bir anne büyütür.' },
    { id: 'albatros', n: 'Albatros', e: '🌊', f: 'Kanat açıklığı üç buçuk metreyi bulur; rüzgârı kullanarak saatlerce kanat çırpmadan süzülür.' },
    { id: 'kugu', n: 'Kuğu', e: '🦢', f: 'Avrupalılar 1697\'de Avustralya\'da siyah kuğu görene dek bütün kuğuların beyaz olduğundan emindi.' },
    { id: 'kuzgun', n: 'Kuzgun', e: '🐦‍⬛', f: 'Deneylerde, ileride işine yarayacak bir aleti bugünden saklayabildiği gösterildi. Yarını düşünen tek canlı biz değiliz.' },
    { id: 'agackakan', n: 'Ağaçkakan', e: '🪵', f: 'Dili o kadar uzundur ki kafatasının arkasından dolanır.' },
    { id: 'kizilgerdan', n: 'Kızılgerdan', e: '🧭', f: 'Dünyanın manyetik alanını sezer; büyük olasılıkla gözündeki ışığa duyarlı bir molekül sayesinde yönü "görür".' },
    { id: 'penguen', n: 'İmparator penguen', e: '🐧', f: 'Erkek, Antarktika kışında yumurtayı ayaklarının üstünde yaklaşık iki ay taşır; bu sürede hiçbir şey yemez.' },
    { id: 'camurculluk', n: 'Kıyı çamurçulluğu', e: '🛫', f: '2022\'de izlenen bir genç kuş Alaska\'dan Tazmanya\'ya 13.560 kilometreyi on bir günde, hiç konmadan uçtu.' },
    { id: 'flamingo', n: 'Flamingo', e: '🦩', f: 'Pembe doğmaz. Rengi, yediği alg ve kabuklulardaki pigmentlerden gelir: ne yerse o olur.' },
    { id: 'dodo', n: 'Dodo', e: '🕯️', f: 'Mauritius\'ta yaşardı. İnsanla tanıştıktan sonra bir yüzyıl dolmadan yeryüzünden silindi.' },
    { id: 'simurg', n: 'Simurg', e: '🔥', f: 'Farsça "sî murg": otuz kuş. Aranan kuş ile arayan kuşlar aynı sözcükte buluşur.' }
  ];

  var chapters = [
    {
      id: 'ates', title: 'Ateş', sub: 'Nereden geldik?', icon: '🔥',
      scenes: [
        { t: 'story', title: 'Uyanış', p: [
          'Gözlerini açıyorsun. Karanlık bir düzlükte, küçük bir ateşin başındasın. Ateşi kimin yaktığını bilmiyorsun. Adını hatırlıyorsun ama buraya nasıl geldiğini hatırlamıyorsun.',
          'Karşındaki taşın üstünde sorguçlu bir kuş duruyor. Seni bir süre süzüyor, sonra konuşuyor:',
          '"Ben Hüdhüd. Yol gösteririm. Otuz tüy toplayacaksın; her tüy bir kuştan, her kuş bir sorudan gelir. Otuzuncu tüyü bulduğunda aradığın şeyin ne olduğunu anlayacaksın."',
          '"Yalnız bir uyarım var: sana söyleyeceklerimin hepsine inanma. Yol boyunca bir yerde, bile bile bir yalan söyleyeceğim. Bulursan ödülün büyük olur."',
          '"Sorulara yanıt verirken ne kadar emin olduğunu da soracağım. Burada çok bilmek değil, ne kadar bildiğini bilmek kazandırır."'
        ] },
        { t: 'quiz', id: 1, bird: 'hudhud',
          q: 'Türümüzün, Homo sapiens\'in bilinen en eski fosilleri yaklaşık 300 bin yıl öncesine ait. Nerede bulundular?',
          o: ['Fransa\'da, Lascaux yakınlarında', 'Fas\'ta, Cebel İrhud\'da', 'Çin\'de, Pekin yakınlarında', 'Endonezya\'da, Flores adasında'], a: 1,
          x: 'Fas\'taki Cebel İrhud buluntuları 2017\'de yeniden tarihlendi ve türümüzün yaşını yaklaşık 100 bin yıl geriye çekti. İnsanın hikâyesi tek bir "Âdem bahçesi"nde değil, bütün Afrika\'ya yayılmış halklar arasında başlamış görünüyor.' },
        { t: 'order', id: 2, bird: 'ispinoz',
          q: 'Bunları en eskiden en yeniye doğru sırala.',
          items: ['Laetoli\'de volkan külüne basılmış ayak izleri', '"Lucy"nin yaşadığı dönem', 'Ateşin denetim altına alındığına dair en eski sağlam izler', 'İlk Homo sapiens', 'Bilinen en eski figürlü mağara resimleri'],
          x: 'Ayak izleri 3,6 milyon, Lucy 3,2 milyon yıllık. Ateşin kullanıldığına dair güçlü izler bir milyon yıl kadar geriye gidiyor. Biz 300 bin, resimlerimiz 45 bin yıldan biraz eski. Yani iki ayak üstünde yürümek, büyük beyinden milyonlarca yıl önce geldi.' },
        { t: 'lie', id: 3, bird: 'karga',
          q: 'Üç cümleden biri yanlış. Hangisi?',
          o: ['Yeryüzündeki herhangi iki insanın DNA\'sı yaklaşık yüzde 99,9 oranında aynıdır.', 'İnsan, şempanzeden evrilmiştir.', 'Afrika dışında yaşayan insanların çoğu yüzde bir iki oranında Neandertal DNA\'sı taşır.'], a: 1,
          x: 'Şempanzeden gelmedik; onunla altı yedi milyon yıl önce yaşamış ortak bir atayı paylaşıyoruz. Şempanze dedemiz değil, kuzenimiz. Neandertaller ise tümüyle yok olmadı: bir parçaları hâlâ bizde yaşıyor.' },
        { t: 'quiz', id: 4, bird: 'devekusu',
          q: 'Beynin, vücut ağırlığının yaklaşık yüzde ikisi kadar. Dinlenirken harcadığın enerjinin kabaca ne kadarını tek başına tüketir?',
          o: ['Yüzde 2', 'Yüzde 5', 'Yüzde 20', 'Yüzde 60'], a: 2,
          x: 'Yaklaşık beşte birini. Bu kadar pahalı bir organı beslemek için pişmiş yemek büyük kolaylıktı: ateş yalnızca ısıtmadı, çiğnemeye ve sindirmeye giden zamanı ve enerjiyi de geri verdi. Ateşin başında oturup hikâye anlatacak vaktimiz böyle doğdu.' }
      ]
    },
    {
      id: 'magara', title: 'Mağara', sub: 'İlk işaret', icon: '✋',
      scenes: [
        { t: 'story', title: 'Duvardaki el', p: [
          'Hüdhüd seni bir kayanın yarığından içeri sokuyor. İçerisi serin ve sessiz. Elindeki çıra duvarı yaladığında bir el görüyorsun: biri, on binlerce yıl önce, elini taşa dayamış ve çevresine boya üflemiş.',
          'Elini onun üstüne koyuyorsun. Neredeyse aynı boyda.',
          '"Bunu yapanın adını bilmiyoruz," diyor Hüdhüd. "Dilini, tanrılarını, neye güldüğünü bilmiyoruz. Bildiğimiz tek şey şu: burada olduğunu birilerinin bilmesini istemiş."',
          '"Karnı doymuş bir hayvan uyur. İnsan ise karnı doyunca duvara resim yapıyor, kemikten flüt oyuyor, ölüsünü gömüyor. Bu bölümde, işe yaramayan şeylerin ne işe yaradığını soracağız."'
        ] },
        { t: 'quiz', id: 5, bird: 'akbaba',
          q: 'Almanya\'daki Hohle Fels mağarasında yaklaşık 40 bin yıllık, beş delikli bir flüt bulundu. Neyden yapılmıştı?',
          o: ['Mamut dişinden', 'Bir akbabanın kanat kemiğinden', 'Kamıştan', 'Pişmiş topraktan'], a: 1,
          x: 'Kızıl akbabanın içi boş kanat kemiğinden. Aynı mağaralardan mamut fildişinden oyulmuş flütler de çıktı. Buzul çağının ortasında, hayatta kalmak bu kadar zorken birileri oturup müzik aleti yapmış.' },
        { t: 'memory', id: 6, bird: 'saksagan',
          q: 'Mağaranın karanlığında işaretler çift çift duruyor. Eşlerini bul.',
          pairs: [['🔥', '🔥'], ['✋', '✋'], ['🦬', '🦬'], ['🌙', '🌙'], ['🐚', '🐚'], ['🎵', '🎵']],
          x: 'El, hayvan, ay, deniz kabuğu, ses. Kabuklar önemli: kıyıdan yüzlerce kilometre içeride bulunan delinmiş deniz kabukları, insanların çok eskiden beri süslendiğini ve uzak topluluklarla alışveriş yaptığını gösteriyor.' },
        { t: 'quiz', id: 7, bird: 'baykus',
          q: 'Irak\'taki Şanidar mağarasında bir Neandertal iskeletinin çevresinde yoğun çiçek poleni bulundu. 1970\'lerde bu, "çiçeklerle gömülmüş Neandertal" diye ünlendi. Bugün bu konuda en doğru cümle hangisi?',
          o: ['Kesinleşti: Neandertaller ölülerini çiçekle uğurluyordu.', 'Tartışmalı: polenleri yuva yapan arılar ya da kemirgenler de taşımış olabilir.', 'Bütünüyle uydurma: mağarada polen bulunmadı.', 'Polenler kazıyı yapanların giysilerinden düştü; bu kanıtlandı.'], a: 1,
          x: 'Güzel hikâye doğru olabilir de olmayabilir de. Polen gerçek; ama oraya nasıl geldiği konusunda birden fazla açıklama var ve araştırmalar sürüyor. Şanidar\'daki Neandertallerin ölülerini bilerek gömdüğü ve sakat bir yaşlıya yıllarca baktıkları ise daha sağlam biliniyor. Bir bilginin güzel olması onu doğru yapmaz.' },
        { t: 'talk', id: 8, bird: 'guvercin',
          q: 'Kırk bin yıl sonra biri bu mağaraya girecek. Duvara tek bir işaret ya da tek bir cümle bırakabilirsin. Ne bırakırdın?',
          x: 'Yazdığın defterine eklendi. Mağara ressamının da senin de yaptığı aynı şey: hiç tanımayacağın birine seslenmek.' }
      ]
    },
    {
      id: 'tohum', title: 'Tohum', sub: 'Kim kimi evcilleştirdi?', icon: '🌾',
      scenes: [
        { t: 'story', title: 'Karacadağ\'ın eteğinde', p: [
          'Güneş doğuyor. Bir yamaçtasın; rüzgâr yabani başakları eğiyor. Uzakta, bir tepenin üstünde, T biçimli dev taşlar dikilmiş.',
          '"Göbekli Tepe," diyor Hüdhüd. "Bu taşları dikenlerin çanağı çömleği, tarlası yoktu. Önce tapınak yapıldı, sonra köy kuruldu. Sıra, sandığınızın tersi olabilir."',
          '"Şu başaklara bak. Siyez buğdayının atası bu dağın eteğinde yetişir. İnsan buğdayı evcilleştirdiğini sanır. Oysa buğday için sırtını kıran, taş ayıklayan, su taşıyan, başında nöbet tutan insandır. Kim kimi evcilleştirdi?"',
          '"İnsanlar beyinlerinin yalnızca onda birini kullanır derler. Buğdayın oyununu göremeyişiniz belki bundandır."',
          'Hüdhüd kanatlarını silkeliyor. "Hadi. Çiçeklere ve kuşlara da uğrayacağız."'
        ] },
        { t: 'quiz', id: 9, bird: 'serce',
          q: 'Şanlıurfa\'daki Göbekli Tepe\'nin en eski yapıları yaklaşık 11.600 yıl önce yapıldı. Bu, arkeologları neden şaşırttı?',
          o: ['Çünkü yapılarda demir aletler kullanılmıştı.', 'Çünkü anıtsal yapılar, tarımdan ve çömlekten önce, avcı toplayıcılar tarafından yapılmıştı.', 'Çünkü taşlar Mısır\'dan getirilmişti.', 'Çünkü duvarlarında yazı vardı.'], a: 1,
          x: 'Eski kabul şuydu: önce tarım, sonra artı ürün, sonra tapınak. Göbekli Tepe bu sırayı sorgulattı. Stonehenge\'den altı bin yıl kadar daha eski. Tonlarca ağırlıktaki taşları yontup dikenler avcı toplayıcılardı.' },
        { t: 'quiz', id: 10, bird: 'bulbul',
          q: 'Lale Avrupa\'ya Osmanlı topraklarından gitti. Batı dillerindeki "tulip" sözcüğü nereden gelir?',
          o: ['Latincede "kadeh" anlamına gelen bir sözcükten', 'Sarık anlamındaki "tülbent"ten', 'Bir Hollandalı tüccarın soyadından', 'Farsça "kırmızı" sözcüğünden'], a: 1,
          x: 'Çiçeğin biçimi sarığa benzetildi; "tülbent" yolda "tulip" oldu. 1630\'larda Hollanda\'da tek bir soğan bir ev fiyatına satıldı, 1637\'de fiyatlar çöktü. Bir çiçeğin değeri hakkında hep birlikte yanılmak mümkün.' },
        { t: 'flight', id: 11, bird: 'sumru',
          q: 'Göç vakti. Kutup sumrusuyla uç: ışıkları topla, fırtına bulutlarından kaç. Otuz saniye.',
          x: 'Kutup sumrusu bu yolu her yıl yapar ve iki kutbun da yazını görür. Otuz yıllık ömründe uçtuğu yol, Ay\'a üç kez gidip dönmeye yeter.' },
        { t: 'lie', id: 12, bird: 'sinekkusu',
          q: 'Üç cümleden biri yanlış. Hangisi?',
          o: ['Kuşlar, yaşayan dinozorlardır.', 'Çiçekli bitkiler dinozorlardan daha eskidir.', 'Sinekkuşu geri geri uçabilir.'], a: 1,
          x: 'İlk dinozorlar 230 milyon yıl kadar önce ortaya çıktı; çiçekli bitkilerin bilinen yayılışı ise yaklaşık 130 milyon yıl önce başlar. Dinozorların ilk yüz milyon yılı çiçeksiz geçti. Darwin çiçeklerin fosil kayıtlarında böyle ansızın belirmesine "iğrenç gizem" demişti.' }
      ]
    },
    {
      id: 'soz', title: 'Söz', sub: 'Uçan ve kalan', icon: '📜',
      scenes: [
        { t: 'story', title: 'Kil tablet', p: [
          'Bir nehir kıyısında, kerpiç bir odadasın. Biri ıslak kile kamış ucuyla çentikler atıyor. Omzunun üstünden bakıyorsun.',
          '"Şiir mi yazıyor?" diye soruyorsun.',
          '"Henüz değil," diyor Hüdhüd. "Yazı önce saymak için bulundu. Ama bin yıl kadar bekle: Ur kentinde Enheduanna adında bir rahibe, ilahilerinin altına kendi adını yazacak. Adını bildiğimiz ilk yazar bir kadın."',
          '"Bugün yeryüzünde yedi bin kadar dil konuşuluyor. Yaklaşık iki haftada biri son konuşanıyla birlikte susuyor. Her dil, dünyaya bakmanın ayrı bir yoludur."',
          '"Japonya\'da bu bakışı on yedi heceye sığdırdılar. Ona da geleceğiz."'
        ] },
        { t: 'quiz', id: 13, bird: 'papagan',
          q: 'Mezopotamya\'da beş bin yıldan eski ilk yazılı tabletlerin büyük çoğunluğunda ne yazıyor?',
          o: ['Tanrılara dualar', 'Kral soy kütükleri', 'Tahıl, koyun, bira gibi malların kayıtları', 'Aşk şiirleri'], a: 2,
          x: 'Yazıyı muhasebeciler buldu. İlk tabletler depo dökümleri ve tayın listeleridir. Destanlar, yasalar ve mektuplar sonradan geldi. Gılgamış\'ın ölümsüzlük arayışını okuyabilmemizi bir bakıma arpa sayan kâtiplere borçluyuz.' },
        { t: 'cipher', id: 14, bird: 'lirkusu',
          q: 'Tabletin kenarına biri şifreli bir not düşmüş. Harfleri alfabede kaydırarak okunur hâle getir.',
          plain: 'SÖZ UÇAR YAZI KALIR', shift: 5,
          x: 'Bu yöntem, harfleri alfabede sabit sayıda kaydırmaya dayanır ve Jül Sezar\'ın adıyla anılır. Bugün bir çocuk bile kırabilir; ama okuma yazma bilenin az olduğu bir çağda işe yarıyordu.' },
        { t: 'haiku', id: 15, bird: 'kirlangic',
          q: 'Haiku üç dizedir: 5, 7 ve 5 hece. Çoğunlukla bir mevsimi sezdirir ve tek bir anı yakalar. Şimdi sen yaz: şu an gördüğün, duyduğun ya da hatırladığın küçük bir an.',
          example: ['Eski bir gölcük', 'bir kurbağa atlıyor', 'suyun sesi, şlap'],
          x: 'Örnek, Matsuo Bashō\'nun 1686\'da yazdığı ünlü kurbağa haikusunun bu oyun için yapılmış serbest bir çevirisi. Kobayashi Issa ise ömründe yirmi binden fazla haiku yazdı; çoğu sinek, salyangoz, serçe gibi küçük canlılara dairdir.' },
        { t: 'quiz', id: 16, bird: 'sigircik',
          q: 'Giresun\'un Kuşköy köyünde insanlar vadiden vadiye özel bir yolla haberleşir. UNESCO bunu 2017\'de acil korunması gereken miraslar listesine aldı. Nedir?',
          o: ['Duman işaretleri', 'Islık dili', 'Davul vuruşları', 'Ayna yansımaları'], a: 1,
          x: 'Kuş dili: Türkçenin hecelerinin ıslığa çevrilmiş hâli. Islık, bağırmaktan çok daha uzağa gider. Kanarya Adaları\'nda ve Meksika\'da da benzerleri var. Cep telefonu yaygınlaştıkça unutuluyor.' }
      ]
    },
    {
      id: 'gok', title: 'Gök', sub: 'Herkesin bir hikâyesi var', icon: '🌙',
      scenes: [
        { t: 'story', title: 'Yıldızların altında', p: [
          'Gece. Sırtüstü uzanmış göğe bakıyorsun. Her halk bu aynı yıldızlara bakıp başka bir hikâye anlatmış: kimi avcı görmüş, kimi sütten bir yol, kimi atalarının ocak ateşlerini.',
          '"Yaklaşık yirmi beş yüzyıl önce Ksenofanes adında bir şair şunu fark etti," diyor Hüdhüd. "Her halk tanrılarını kendine benzetiyor. Atların elleri olsaydı, tanrılarını at biçiminde çizerlerdi, demişti."',
          '"Bu, inananla alay etmek için söylenmiş bir söz değil. Bir soru: gördüğümün ne kadarı orada, ne kadarı benden?"',
          '"Şimdi sana insanların ölümle, armağanla ve sessizlikle ne yaptığını göstereceğim. Tuhaf bulduğun her göreneği, bir başkası seninkini tuhaf bularak izliyor."'
        ] },
        { t: 'quiz', id: 17, bird: 'tavus',
          q: 'Madagaskar\'ın yaylalarında birkaç yılda bir "famadihana" yapılır. Bu törende ne olur?',
          o: ['Köyün en yaşlısı bir yıl boyunca hiç konuşmaz.', 'Ataların kemikleri mezardan çıkarılır, yeni kefene sarılır ve onlarla dans edilir.', 'Gençler ilk avlarını denize geri bırakır.', 'Bütün borçlar silinir.'], a: 1,
          x: '"Kemiklerin çevrilmesi" denir. Müzik çalınır, yemek yenir, ölülere aile haberleri anlatılır. Yas değil, şenliktir. Ölüler orada gitmiş sayılmaz; ailenin bir süre görülmeyen üyeleridir.' },
        { t: 'quiz', id: 18, bird: 'leylek',
          q: 'Kuzey Amerika\'nın Pasifik kıyısındaki yerli halkların "potlaç" şölenlerinde bir kişinin saygınlığı neyle ölçülürdü?',
          o: ['Ne kadar mal biriktirdiğiyle', 'Ne kadar malı dağıttığıyla', 'Kaç savaş kazandığıyla', 'Ne kadar uzun yaşadığıyla'], a: 1,
          x: 'En zengin, en çok verendi. Kanada hükümeti bunu "savurganlık" sayıp 1885\'te yasakladı; yasak 1951\'e dek sürdü. Bir toplumun akıl dışı bulduğu şey, bir başkasının ekonomisinin tam kendisi olabilir.' },
        { t: 'memory', id: 19, bird: 'turna',
          q: 'Her göreneği yaşandığı yerle eşleştir.',
          pairs: [['Hanami: kiraz çiçeği seyri', 'Japonya'], ['Nyepi: sessizlik günü', 'Bali'], ['Ölüler Günü', 'Meksika'], ['Holi: renkler bayramı', 'Hindistan'], ['Hıdırellez', 'Anadolu ve Balkanlar'], ['Nevruz', 'İran\'dan Orta Asya\'ya']],
          x: 'Çoğu baharı, ölüleri ya da ikisini birden kutlar. Kışın bitişi ve gidenlerin anılması: birbirini hiç tanımayan halkların takvimleri aynı iki konuda buluşuyor.' },
        { t: 'lie', id: 20, bird: 'guguk',
          q: 'Üç cümleden biri yanlış. Hangisi?',
          o: ['Bali\'de sessizlik günü Nyepi\'de havalimanı bir gün boyunca kapatılır.', '"Sana yapılmasını istemediğini başkasına yapma" öğüdü yalnızca tek bir dinde bulunur.', 'Vanuatu\'da bazı adalılar, gökten yük getiren uçakları geri çağırmak için bambudan pistler ve kuleler yaptı.'], a: 1,
          x: 'Bu öğüt Konfüçyüs\'te, Hillel\'de, İncil\'de, hadislerde, Hint ve Budist metinlerinde, kısacası hemen her gelenekte bir biçimde geçer. Vanuatu\'daki "kargo kültleri" ise gerçektir: İkinci Dünya Savaşı\'nda uçakların getirdiği malları gören adalılar, törenin biçimini taklit ederek sonucun geri geleceğini umdular. Biçimi taklit edip nedeni kaçırmak yalnız onlara özgü bir hata değil.' },
        { t: 'breath', id: 21, bird: 'albatros',
          q: 'Bir süre hiçbir şey sorulmayacak. Halkayla birlikte nefes al, tut, ver. Üç tur.',
          x: 'Hemen her gelenekte bir sessizlik pratiği vardır: zikir, zazen, inziva, oruç, Nyepi. Hepsinin ortak buluşu şu: dikkat, eğitilebilen bir şeydir.' }
      ]
    },
    {
      id: 'ayna', title: 'Ayna', sub: 'Bildiğini nereden biliyorsun?', icon: '🪞',
      scenes: [
        { t: 'story', title: 'Aynalı oda', p: [
          'Bir odadasın. Duvarların hepsi ayna. Her birinde sen varsın ama hiçbiri tam aynı değil: birinde daha yaşlısın, birinde gülüyorsun, birinde yoksun.',
          '"Çinli bilge Zhuangzi bir gece rüyasında kelebek olduğunu gördü," diyor Hüdhüd. "Uyanınca soramadan edemedi: ben kelebek olduğunu gören bir insan mıyım, yoksa insan olduğunu gören bir kelebek mi?"',
          '"Platon insanları mağara duvarındaki gölgeleri gerçek sanan tutsaklara benzetti. İbn Sînâ boşlukta asılı, hiçbir şey duymayan bir adam hayal etti ve yine de kendini bileceğini söyledi. Descartes, kendisini her konuda aldatan bir cin olabileceğini düşündü; geriye tek sağlam şey kaldı: kuşku duyan biri var."',
          '"1981\'de Hilary Putnam soruyu güncelledi: ya bir kavanozdaki beyinsen ve bütün bu dünya sana tellerle veriliyorsa? On sekiz yıl sonra bundan bir film yaptılar; yeşil harfler yağıyordu."',
          'Aynalardan birinde Hüdhüd\'ün yansıması sana göz kırpıyor. "Sana başta bir şey söylemiştim. Hatırlıyor musun?"'
        ] },
        { t: 'quiz', id: 22, bird: 'kugu',
          q: 'Bin tane beyaz kuğu gördün. "Bütün kuğular beyazdır" cümlesi hakkında ne söyleyebilirsin?',
          o: ['Kanıtlandı; bin gözlem yeter.', 'Kanıtlanmadı; ama tek bir siyah kuğu onu çürütmeye yeter.', 'Ne kanıtlanabilir ne çürütülebilir.', 'On bin kuğu görürsem kanıtlanır.'], a: 1,
          x: 'Karl Popper\'ın ünlü örneği. Genel bir iddiayı ne kadar çok örnek toplarsan topla kesinleştiremezsin; ama tek bir karşı örnek onu yıkar. Bu yüzden iyi bir bilimsel iddia, neyle yanlışlanabileceğini açıkça söyleyen iddiadır. Siyah kuğular gerçekten de varmış: Avustralya\'da.' },
        { t: 'quiz', id: 23, bird: 'kuzgun',
          q: 'Üç kapalı kapı var. Birinin ardında armağan, ikisinin ardında hiçbir şey yok. Birini seçtin. Sunucu, armağanın yerini biliyor; kalan iki kapıdan boş olan birini açıp gösteriyor ve soruyor: "Kapını değiştirmek ister misin?" Ne yapmalısın?',
          o: ['Fark etmez; şans yarı yarıya.', 'Değiştirmeliyim; kazanma olasılığım üçte ikiye çıkar.', 'Değiştirmemeliyim; ilk seçim daha şanslıdır.', 'Bu bilgilerle hesaplanamaz.'], a: 1,
          x: 'Monty Hall problemi. İlk seçiminin doğru olma olasılığı üçte birdi ve sunucu kapı açınca bu değişmedi. Geri kalan üçte iki artık tek bir kapıda toplandı. 1990\'da bu yanıtı yayımlayan köşe yazarına binlerce itiraz mektubu geldi; aralarında matematik profesörleri de vardı. Sezgi, olasılık konusunda güvenilir bir rehber değil.' },
        { t: 'quiz', id: 24, bird: 'agackakan',
          q: 'Bir sopa ile bir top birlikte 110 lira. Sopa toptan 100 lira daha pahalı. Top kaç lira?',
          o: ['10 lira', '5 lira', '1 lira', '15 lira'], a: 1,
          x: 'Akla ilk gelen 10\'dur ama o zaman sopa 110, toplam 120 olur. Doğrusu: top 5, sopa 105. Bu soruyu dünyanın en iyi üniversitelerindeki öğrencilerin yarısından fazlası yanlış yanıtlıyor. Zekâ eksikliğinden değil: hızlı gelen yanıt, denetlenmeden kabul ediliyor.' },
        { t: 'quiz', id: 25, bird: 'kizilgerdan',
          q: '"Yolun başında sana bile bile bir yalan söyleyeceğimi haber vermiştim. Söyledim. Hangisiydi?"',
          o: ['Kargalar insan yüzlerini tanır.', 'İnsanlar beyinlerinin yalnızca onda birini kullanır.', 'Göbekli Tepe tarımdan daha eskidir.', 'Adını bildiğimiz ilk yazar Enheduanna adlı bir rahibedir.'], a: 1,
          x: 'Buğday tarlasında, laf arasında söylemiştim. Yüzde on efsanesi bir yüzyıldır dolaşıyor ama yanlış: beyin görüntülemeleri gün içinde beynin hemen her bölgesinin çalıştığını gösteriyor. Fark ettiysen iyi; fark etmediysen de kendini kötü hissetme. Güvendiğimiz birinden, güzel bir cümlenin içinde gelen yanlışı yakalamak en zorudur. Gerçek hayatta yalanlar önceden haber vermez.' },
        { t: 'talk', id: 26, bird: 'penguen',
          q: 'Şu anda rüya görmediğini nereden biliyorsun? Kendini ikna edecek en iyi gerekçeni yaz.',
          x: 'İki bin beş yüz yıldır bu soruya herkesi ikna eden bir yanıt verilemedi. Yine de sabah kalkıp çay demliyoruz. Belki bilgelik kuşkuyu yenmek değil, onunla birlikte yaşayabilmektir.' }
      ]
    },
    {
      id: 'yol', title: 'Yol', sub: 'Sürgün, bakış, hafıza', icon: '🧳',
      scenes: [
        { t: 'story', title: 'Beş ateş', p: [
          'Yol bir tepeye çıkıyor. Tepede, aralıklı yakılmış beş ateş var; her birinin başında biri oturuyor.',
          'İlkinde Mahmud Derviş. 1941\'de Celile\'nin Birve köyünde doğdu; yedi yaşındayken köyü haritadan silindi. Ömrü boyunca yurdunu sözcüklerden yeniden kurdu: kahve kokusundan, annesinin ekmeğinden, bir zeytin ağacından.',
          'İkincisinde Cegerxwîn. Yoksul bir köylü çocuğuydu, medresede okudu, sonra mollalığı bırakıp halkının şairi oldu. Kürtçe yazdı; yazdıkları kuşaklarca ezberden söylendi. 1984\'te Stockholm\'de, yurdundan uzakta öldü.',
          'Üçüncüsünde Eduardo Galeano. Montevideolu. Tarihi kazananların değil, adı anılmayanların ağzından, kısacık hikâyelerle anlattı. Sürgünde yaşadı; futbolu da hafızayı da aynı ciddiyetle sevdi.',
          'Dördüncüsünde John Berger. Londra\'dan ayrılıp Fransız Alplerinde bir köye yerleşti, köylülerle ot biçti. Bize şunu öğretti: bakmak masum değildir; neyi nasıl gördüğümüz, bize ne öğretildiğine bağlıdır.',
          'Beşincisinde Turgut Uyar. Türk şiirinin İkinci Yeni kuşağından. Kalabalık şehirlerde sıkışan insanı, bir otobüs durağında başını kaldırıp göğe bakmaya çağırdı.',
          '"Bunların ortak yanı ne?" diye soruyor Hüdhüd. "Hepsi insana bakmayı bildi. Otur, biraz ısın."'
        ] },
        { t: 'quiz', id: 27, bird: 'camurculluk',
          q: 'Asıl adı Şêxmûs Hesen olan şair, kendine "Cegerxwîn" mahlasını seçti. Bu sözcük Kürtçede ne anlama gelir?',
          o: ['Dağların oğlu', 'Ciğeri kanlı, yüreği yaralı', 'Sabah yıldızı', 'Yolcu'], a: 1,
          x: 'Halkının yoksulluğuna ve dağınıklığına duyduğu acıyı adına taşıdı. Sekiz şiir kitabının yanında sözlük, dilbilgisi ve tarih de yazdı: şiiri, bir dili ayakta tutma işinin parçası sayıyordu. Mezarı Kamışlı\'daki evinin bahçesindedir.' },
        { t: 'memory', id: 28, bird: 'flamingo',
          q: 'Yazarları eserleriyle eşleştir.',
          pairs: [['Mahmud Derviş', '"Kimlik Kartı"'], ['Turgut Uyar', '"Göğe Bakma Durağı"'], ['John Berger', '"Görme Biçimleri"'], ['Eduardo Galeano', '"Ateş Anıları"'], ['Cegerxwîn', '"Kîne Em?"'], ['Matsuo Bashō', '"Oku no Hosomichi"']],
          x: '"Kîne Em?" Kürtçede "Biz kimiz?" demektir. "Oku no Hosomichi" ise Bashō\'nun 1689\'da Japonya\'nın kuzeyine yaptığı aylar süren yürüyüşün şiirli günlüğüdür. Bu oyun onların eserlerinden alıntı yapmaz; iyisi mi sen kitapların kendisini bul.' },
        { t: 'quiz', id: 29, bird: 'dodo',
          q: 'John Berger 1972\'de "G." adlı romanıyla Booker Ödülü\'nü kazandı. Ödül konuşmasında ne açıkladı?',
          o: ['Ödülü reddettiğini', 'Ödül parasının yarısını Kara Panterler hareketine vereceğini', 'Bir daha roman yazmayacağını', 'Ödülü köyündeki okula bağışlayacağını'], a: 1,
          x: 'Ödülü veren şirketin servetinin Karayipler\'deki şeker plantasyonlarından geldiğini hatırlattı; paranın yarısını Kara Panterler\'e verdi, kalanıyla Avrupa\'daki göçmen işçiler üzerine bir kitap hazırladı. Aynı yıl "Görme Biçimleri" yayımlandı.' },
        { t: 'talk', id: 30, bird: 'simurg',
          q: 'Son tüy. Yol boyunca ateşi, mağarayı, tohumu, sözü, göğü ve aynayı gördün. Şimdi kendi cümleni yaz: sence insan nedir?',
          x: 'Attâr\'ın hikâyesinde binlerce kuş, padişahları Simurg\'u aramak için yedi vadi aşar. Çoğu yolda kalır. Sona yalnızca otuz kuş varır ve Simurg\'un sarayında bir aynayla karşılaşırlar. Aynada gördükleri kendileridir: otuz kuş, yani "sî murg". Aradıkları, yolu yürüyenlerin kendisiymiş.' }
      ]
    }
  ];

  var Data = { birds: birds, chapters: chapters };
  if (typeof module !== 'undefined' && module.exports) module.exports = Data;
  else root.Data = Data;
})(typeof window !== 'undefined' ? window : this);
