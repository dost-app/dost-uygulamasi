export type SchemaSection = {
  id: number;
  title: string;
  items: string[];
};

export type Schema = {
  storyId: number;
  title: string;
  sections: SchemaSection[];
};

export const SCHEMAS: Record<number, Schema> = {
  1: {
    storyId: 1,
    title: 'Kırıntıların Kahramanları Metni Dolu Şema',
    sections: [
      {
        id: 1,
        title: '1. Yaşayışları',
        items: [
          'Karıncalar çok çalışkan hayvanlardır.',
          'Hızlı hareket eder.',
          'Küçük gruplar halinde yuvalarda yaşar.',
          'Bir ekip olarak çalışır, işbirliğine önem verir.'
        ]
      },
      {
        id: 2,
        title: '2. Fiziksel Özellikleri',
        items: [
          'Kocaman bir başı, uzun bir gövdesi vardır.',
          'Karıncalar genellikle siyah, kahverengi ya da kırmızı renktedir.',
          'Ayakları altı tanedir.',
          'İki tane anteni vardır.',
          'Bazı karıncalar kanatıdır.'
        ]
      },
      {
        id: 3,
        title: '3. Beslenmeleleri',
        items: [
          'Genellikle şekerli yiyecekler yer.',
          'Yere düşmüş tüm kırıntılara bayılırlar.',
          'Aynı zamanda bitkileri de yer.'
        ]
      },
      {
        id: 4,
        title: '4. Çoğalmaları',
        items: [
          'Karıncalar, yumurtlayarak çoğalır.',
          'Kraliçe karınca yılda 50 milyon yumurta yapabilir.'
        ]
      },
      {
        id: 5,
        title: '5. Çevreye Etkileri',
        items: [
          'Toprağı havalandomdırır.',
          'Ağaçlara zarar veren böcekleri yer.',
          'Bitkilerin tohumunu dağıtır.',
          'Bazen insanları ısırırı. Bu durum büyük ise yaralanabilir.',
          'Tifüs ve verem hastalıklarını yayabilir.'
        ]
      }
    ]
  },
  2: {
    storyId: 2,
    title: 'Avucumun İçindeki Akıllı Kutu Metni Dolu Şema',
    sections: [
      {
        id: 1,
        title: '1. Kullanım Amaçları',
        items: [
          'İletişim kurasarın.',
          'Aramalar, mesajlaşmalar, videolu görüşmeler yaparsarın.',
          'Önemli bilgilere tek tuşla erişirsin.',
          'Tabi ki eğlenmek için de kullanırsın.',
          'Oyunlar oyarsarın.',
          'Müzik dinlersin.',
          'Video izlersin.',
          'Fotoğraf çekersin.',
          'Hatta bir film bile çekebilirsin.'
        ]
      },
      {
        id: 2,
        title: '2. Fiziksel Özellikleri',
        items: [
          'Genellikle telefonlar dikdörtgendir.',
          'Bazı telefonlar katlanabilir.',
          'Hepsi cebine sığacak boydadır.',
          'Hafif ve rahat kullanımına sahiptir.',
          'Hem ön hem arka kameraları vardır.',
          'Alt tarafında hoparlör ve mikrofon bulunur.'
        ]
      },
      {
        id: 3,
        title: '3. Çalışma Biçimleri',
        items: [
          'Bu cihazlar elektrik enerjisi kullanır.',
          'Bir batarya ile çalışır.',
          'Dokunmatik ekran ile kontrol edilir.',
          'Sinyalleri alır. Ardından bu sinyalleri işler.'
        ]
      },
      {
        id: 4,
        title: '4. Üretimleri',
        items: [
          'Bu cihazlar özel fabrikafarda üretilir.',
          'Akıllı telefonlar önce tasarlanır, yanı nasıl görüneceğine karar verilir.',
          'Sonra ekran, pil ve kamera gibi parçalar birleştirilir.',
          'Daha sonra telefonun çalışmasını sağlayan yazılımlar yüklenir.',
          'Son olarak her sevim düzgün çalışıp çalışmadığı test edilir.'
        ]
      },
      {
        id: 5,
        title: '5. Hayatımıza Etkileri',
        items: [
          'Bu cihazlar hayatımızı oldukça kolaylaştırır.',
          'Adeta iletişim, eğlence ve bilgi edinme konularında kütüya sıkıştırılmıştır!',
          'Ancak aşırı kullanımında göz sağlığın etkilenebilir.'
        ]
      }
    ]
  },
  3: {
    storyId: 3,
    title: 'Çöl Şekerlemesi Metni Dolu Şema',
    sections: [
      {
        id: 1,
        title: '1. Yaşam Koşulları',
        items: [
          'Hurmalar, çok sıcak olan çöl ikliminde yetişir.',
          'Ülkemizde ise Akdeniz Bölgesi\'nde olur',
          'Hurma meyvesi ağaçta yetişir.',
          'Hurma ağaçları çok uzundur.',
          'Ayrıca hurma ağaçları kuraklığa dayanıklıdır.',
          'Ancak meyvelerini verirken suya ihtiyaç duyar.',
          'Hurma meyvesi salkım şeklinde hurma ağacının dallarından sallanır.'
        ]
      },
      {
        id: 2,
        title: '2. Fiziksel Özellikleri',
        items: [
          'Hurma ağacı; gövde, yaprak ve meyvse olmak üzere üç kısımdan oluşur.',
          'Bu ağaç, palmiye ağacına benzer.',
          'Özellikle uzun gövdesiyle dikkat çeker.',
          'En güzel yanları, meyvelerinin tabii kıl',
          'Meyvrnin içinde çekirdek bulunur.',
          'Hurmaların yaprakları uzun ve küçüktür.',
          'Bu yapraklardan da çay yapılır.'
        ]
      },
      {
        id: 3,
        title: '3. Çoğalmaları',
        items: [
          'İstersen çekirdeğini ekerek çoğalmasını sağlarsın.',
          'İstersen hurma ağacı gövdesinden çıkan filizleri ekersin.',
          'Bir hurma ağacı yaklaşık 70 yıl yaşar.'
        ]
      },
      {
        id: 4,
        title: '4. Etkileri',
        items: [
          'Ağacın yapışı ağızda çignenirse diş sağlığının korunmasını sağlar.',
          'Diğer faydası ise kemikleri güçlendirmesidir.',
          'Hurma meyvesi ise, beynimizin ve kalbimizin sağlığı için çok faydalıdır.',
          'Ancak çok tüketilirse baş ağrısı yapabilir.'
        ]
      }
    ]
  },
  4: {
    storyId: 4,
    title: 'Turizmin İncisi Metni Dolu Şema',
    sections: [
      {
        id: 1,
        title: '1. İklim Özellikleri',
        items: [
          'Akdeniz iklimi görülür.',
          'Yazları sıcak ve kuraktır. Kışları ise ılık ve yağışlıdır.',
          'Don olayları nadiren yaşanır.',
          'En fazla yağış kış mevsiminde düşer.',
          'Ani ve aşırı yağmur da görülebilir.',
          'Ani ve aşırı yağmur doğal afet olan sele sebep olabilir.'
        ]
      },
      {
        id: 2,
        title: '2. Bitki Örtüsü',
        items: [
          'Akdeniz Bölgesi\'nin bitki örtüsü makiktir.',
          'Makiler, kısa boylu ağaçlardır.',
          'Maki türleri arasında zakkum, keçiboynuzu, defne, koca yemiş vardır.',
          'Bolca zeytin ve portakal ağaçları da bulunur.'
        ]
      },
      {
        id: 3,
        title: '3. Yeryüzü Özellikleri',
        items: [
          'Akdeniz, dağlık ve engebeldir.',
          'Bu bölgede engebeli ve sulak araziler olduğu için dağınık yerleşim görülür.',
          'Bölgeyi dağları ve yüksek platolar oluşturur.',
          'Ayrıca bu bölgede kırmızı renkli topraklar bulunur. Bu topraklar verimlidir.',
          'Akdeniz\'in sıcacık ve tuzlu bir denizi vardır.'
        ]
      },
      {
        id: 4,
        title: '4. Ekonomik Faaliyetler',
        items: [
          'Akdeniz bölgesi gelirini tarım ve turisme eder.',
          'Diğer bir gelir kaynağı olan turizm bölgenin başlıca gelir kaynağıdır.'
        ]
      },
      {
        id: 5,
        title: '5. Nüfus ve Yerleşme',
        items: [
          'Bölgenin nüfusu yaklaşık 11 milyona yakındır.',
          'Bölgede yaşayan insanların çoğunluğu kentlerde yaşamaktadır.'
        ]
      }
    ]
  },
  5: {
    storyId: 5,
    title: 'Çöl Gemisi Metni Dolu Şema',
    sections: [
      {
        id: 1,
        title: '1. Yaşayışları',
        items: [
          'Develer genellikle çöl ikliminde yaşar.',
          'Develer zorlu iklim koşullarında yaşayabilir.',
          'Develer, gezmeyi çok sever.',
          'Onlar sürüler halinde gezer.',
          'Kendini tehlikede hisseden bir deve tükürlebilir.'
        ]
      },
      {
        id: 2,
        title: '2. Fiziksel Özellikleri',
        items: [
          'Develer uzun boyludur.',
          'Hörgüçleri vardır.',
          'Bazı develer tek hörgüçlüdür. Bazı develer ise çift hörgüçlüdür.',
          'Uzun kirpikleri vardır.'
        ]
      },
      {
        id: 3,
        title: '3. Beslenmeleri',
        items: [
          'Develer, otçul hayvanlardır.',
          'Yaprakları, meyvelerini, dikenli bitkileri yer.',
          'Develer, az beslenle yetinebilir.',
          'Günlerce yemek yemese de olur.',
          'Bu hayvanlar, tek bir seferde 80-90 litre su içer. Bu sayede günlerce susuz kalabilir.'
        ]
      },
      {
        id: 4,
        title: '4. Çoğalmaları',
        items: [
          'Develer doğurarak çoğalır.'
        ]
      },
      {
        id: 5,
        title: '5. Çevreye Etkileri',
        items: [
          'İnsanların ulaşımını sağlar.',
          'Essayaların taşır.',
          'İnsanlar develerinin yününden, sütünden, etinden faydalanabilirler.',
          'Bazı develer hastalık taşır.'
        ]
      }
    ]
  },
  6: {
    storyId: 6,
    title: 'Hayal Gibi Gerçek! Metni Şematik Düzenleyicisi',
    sections: [
      {
        id: 1,
        title: '1. Kullanım Amaçları',
        items: [
          'Bu cihazları; eğitim, sağlık ve tabi ki eğlenmek için kullanabilirsin.',
          'Bu gözlük sayesinde kitaplar canlanabilir.',
          'Antik Roma\'da gezebilirsin. Hatta uzay gemisiyle galaksiyi bile keşfedersin.',
          'Ayrıca doktorlar bu gözlükleri zor ameliyatlarda yardımcı bir doktor gibi kullanır.'
        ]
      },
      {
        id: 2,
        title: '2. Fiziksel Özellikleri',
        items: [
          'Kutuya benzeyen büyük bir gözlük gibidir.',
          'Gözleri tamamen kapatır ve başa lastikli bir bantla takılır.',
          'Genellikle siyah renkte olur ve iki elinle tutabileceğin kadar büyüktedir.',
          'Kulaklıkları ve hoparlörleri de bulunur.'
        ]
      },
      {
        id: 3,
        title: '3. Çalışma Biçimleri',
        items: [
          'Tabiki elektrik enerjisi ile çalışır.',
          'Gözlüklerin içinde iki küçük ekran bulunur. Başını nereye çevirirsen görüntü de seninle döner. Böylece sanki gerçekten oradaymışsın gibi olur.',
          'Elindeki kumandalarla da sanal dünyadaki eşyaları tutup hareket ettirebilirsin.'
        ]
      },
      {
        id: 4,
        title: '4. Üretimleri',
        items: [
          'Bu cihazlar, bilim insanlarının ve mühendislerin işbirliğiyle üretilir.',
          'Önce sensörleri ve ekranları üretilir.',
          'Daha sonra özel fabrikalarda ise bu ekranlar gözlük çerçeveleriyle birleşir.'
        ]
      },
      {
        id: 5,
        title: '5. Hayatımıza Etkileri',
        items: [
          'Gözlüklerle eğlenerek öğreniriz.',
          'Bilgiler daha kalıcı olur.',
          'Yeni yerlere gitmek daha da kolaylaşır.',
          'Eğer onunla çok vakit geçirirsen gözlerin bozulabilir.'
        ]
      }
    ]
  },
  7: {
    storyId: 7,
    title: 'Kaktüslerin Dikenli Yaşamı Metni Şematik Düzenleyicisi',
    sections: [
      {
        id: 1,
        title: '1. Yaşam Koşulları',
        items: [
          'Kaktüsler sıcak ve kurak bölgelerde yetişmektedir. Örneğin Afrika ve Güney Amerika\'da yetişir.',
          'Kaktüs, güneşi çok sever.',
          'Topraktaki çok az suyla yetinir.',
          'Yani, kaktüsler kuraklığa dayanıklıdır. Susuz kalmaktan hiç korkmaz.'
        ]
      },
      {
        id: 2,
        title: '2. Fiziksel Özellikleri',
        items: [
          'Kaktüsün en belirgin özelliği dikenidir.',
          'Bazı dikenlerin üstünde tüy vardır.',
          'Bazı kaktüs türleri uzun ve incedir. Bazıları ise kısa ve tombuldur.',
          'Renkleri de çok çeşitlidir; yeşil, mor, turuncu ve hatta kırmızı!',
          'Tüm kaktüslerin kökü çok uzun ve kalındır.'
        ]
      },
      {
        id: 3,
        title: '3. Çoğalmaları',
        items: [
          'Kaktüsler, tohumla veya bir parçasının toprağa ekilmesiyle çoğalır.',
          'Ayrıca kimi kaktüs kendilerinden yeni parçalar çıkararak çoğalır.'
        ]
      },
      {
        id: 4,
        title: '4. Etkileri',
        items: [
          'Bulundukları toprağı korur.',
          'Hayvanlar için yiyecek ve su deposudur.',
          'Ayrıca kuş, kertenkele, çöl faresi gibi hayvanlar için barınma yeri de olabilir.',
          'Ancak eğer dikkatli olunmazsa dikenler elimize batarak cilde zarar verebilir.'
        ]
      }
    ]
  },
  8: {
    storyId: 8,
    title: 'Dağların Diyarı Metni Şematik Düzenleyicisi',
    sections: [
      {
        id: 1,
        title: '1. İklimi',
        items: [
          'Bölgenin iklimi karasaldır.',
          'Kışlar soğuk ve uzundur.',
          'Yazlar ise kısa ve serindir.',
          'Kış aylarında fazlaca kar yağar.',
          'Don olayları da görülür.',
          'İlkbaharda bolca yağmur yağar.',
          'En çok görülen doğal afet çığdır.'
        ]
      },
      {
        id: 2,
        title: '2. Bitki Örtüsü',
        items: [
          'Bu bölgenin bitki örtüsü bozkırdır.',
          'Yüksek yerlerindeyse ormanlar görülür.',
          'Bazı yerlerinde çayırlar da vardır.',
          'Yetiştirilen bitkiler arpa, buğday ve elmadır.'
        ]
      },
      {
        id: 3,
        title: '3. Yeryüzü Özellikleri',
        items: [
          'Bölgenin yükseltisi fazladır.',
          'Dağlar geniş yer kaplar.',
          'Verimsiz taşlı toprakların yanısıra verimli kara toprak da görülür.'
        ]
      },
      {
        id: 4,
        title: '4. Ekonomik Faaliyetler',
        items: [
          'Bölgede tarım ve hayvancılık yapılır.',
          'Tarım ürünü olarak buğday, şekerpancarı ve nohut yetişir.',
          'Burada madencilik de yapılır.',
          'Bu bölgede bakır, gümüşlü kurşun ve bor madenleri çıkar.'
        ]
      },
      {
        id: 5,
        title: '5. Nüfus ve Yerleşme',
        items: [
          'Bu bölge, en az insan yaşayan bölgemizdir.',
          'Kırsalda, kenttekinden daha çok insan yaşar.',
          'Bölge kurak olduğu için toplu yerleşmeler görülür.'
        ]
      }
    ]
  },
  9: {
    storyId: 9,
    title: 'Fındık Canavarları Metni Şematik Düzenleyicisi',
    sections: [
      {
        id: 1,
        title: '1. Yaşayışları',
        items: [
          'Sincaplar ağaçlarda yaşar.',
          'Ormanlardaki, parklardaki ağaçlara yuva yapar.',
          'Bu hayvanlar oldukça hızlıdır.',
          'Yaşam süreleri ortalama 10 yıldır.'
        ]
      },
      {
        id: 2,
        title: '2. Fiziksel Özellikleri',
        items: [
          'Sincaplar genellikle kahverengidir.',
          'Bir sincabın boyu küçük bir su şişesi kadardır.',
          'Uzun bir kuyruğa sahiptir.',
          'Bu hayvanların keskin ön dişleri vardır.',
          'Sincapların gözleri çok iyi görür.'
        ]
      },
      {
        id: 3,
        title: '3. Beslenmeleri',
        items: [
          'Sincaplar otçuldur.',
          'Onlar fındık, fıstık, palamut gibi yemişleri yer.',
          'Sincaplar meyve ve tohumlara da bayılır.',
          'Onlar topladıkları yiyecekleri yer altına ya da ağaç kovuklarına saklar.'
        ]
      },
      {
        id: 4,
        title: '4. Çoğalmaları',
        items: [
          'Bu canlılar doğurarak çoğalır.',
          'Anne sincap bir yıl içerisinde 2 ile 7 arasında yavru doğurabilir.'
        ]
      },
      {
        id: 5,
        title: '5. Çevreye Etkileri',
        items: [
          'Onlar bazen sakladıkları tohumları unutabilir.',
          'Bu, unutulan tohumlar yeni ağaçlara dönüşür. Böylelikle ormanlarımız çoğalır.'
        ]
      }
    ]
  },
  10: {
    storyId: 10,
    title: 'Kolumuzdaki Süper Kahraman Metni Şematik Düzenleyicisi',
    sections: [
      {
        id: 1,
        title: '1. Kullanım Amaçları',
        items: [
          'Akıllı saatler, geleneksel saatlere kıyasla daha çok şey yapar.',
          'Bir bilgisayar, telefon hatta daha fazlasıdır!',
          'Mesela, bu saatler senin randevularını hatırlatır.',
          'Telefonundan bildirim alır.',
          'Sen yürürken adımlarını bile sayar.',
          'Onunla bir telefon görüşmesi yaparsın.',
          'Arkadaşlarına mesaj atarsın.',
          'Eğlenmek istediğinde müzik açarsın.'
        ]
      },
      {
        id: 2,
        title: '2. Fiziksel Özellikleri',
        items: [
          'Tıpkı bir saat gibidir. Ancak bu cihazlarda ekran dokunmatiktir.',
          'Akıllı saatler küçük bir ekrana sahiptir. Bu ekran dikdörtgen veya yuvarlak olabilir.'
        ]
      },
      {
        id: 3,
        title: '3. Çalışma Biçimleri',
        items: [
          'Akıllı saatler, bir telefonla eşleştirilip çalışır.',
          'Akıllı saat, telefondaki bilgileri kullanır.'
        ]
      },
      {
        id: 4,
        title: '4. Üretimleri',
        items: [
          'Akıllı saatler özel fabrikalarda üretilir.',
          'Mühendislerin başında olduğu bir ekip vardır. Bu ekip üretim için malzeme seçer. Ardından yazılımı oluşturur. Sonra tüm bunlar lego gibi birleştirilir.'
        ]
      },
      {
        id: 5,
        title: '5. Hayatımıza Etkileri',
        items: [
          'Minik bir yardımcı gibi hayatımızı kolaylaştırır.',
          'Hava durumunu gösterir.',
          'Spor yaparken ne kadar aktif olduğunu takip eder.',
          'Uzun süre takarsan, bileğini rahatsız edebilir.',
          'Çok bakarsan, gözünü yorabilir.',
          'Sürekli bildirimle gelirse dikkatini dağıtabilir.'
        ]
      }
    ]
  },
  11: {
    storyId: 11,
    title: 'Kırmızı Tatlı Boncuklar Metni Şematik Düzenleyicisi',
    sections: [
      {
        id: 1,
        title: '1. Yaşam Koşulları',
        items: [
          'Çok lezzetli bir meyve olan narın ağacı, sıcak iklimlerde yetişir.',
          'Nar ağaçları kuraklığa dayanıklıdır ama yaz mevsiminde suya ihtiyaç duyar.',
          'Türkiye\'de Akdeniz, Güneydoğu Anadolu ve Ege Bölgeleri nar yetiştirmek için en uygun yerlerdir.',
          'Bir nar ağacı yaklaşık 50 yıl kadar yaşayabilir.'
        ]
      },
      {
        id: 2,
        title: '2. Fiziksel Özellikleri',
        items: [
          'Narın yaprakları parlak ve yeşil renktedir.',
          'Çiçekleri turuncu renkli; meyvesi ise dışı sert, tombul ve kırmızıdır.',
          'Meyvesi ise dışı sert, tombul ve kırmızı renktedir.',
          'Meyvenin içinde büyük ve beyaz bir zar bulunur. Bu zarın altında aynı bilmecede olduğu gibi taneler yer alır.',
          'Narın taneleri kıpkırmızı ve suludur.',
          'Tanelerin içinde ise meyvenin çekirdeği bulunur.'
        ]
      },
      {
        id: 3,
        title: '3. Çoğalmaları',
        items: [
          'Nar, çekirdeklerin veya ağaçtan kesilen bir dalın toprağa dikilmesiyle çoğalır.',
          'Toprağa dikilen ağaç dalı bir süre sonra büyür. Daha sonra küçük bir fidan olur.',
          'Bu küçük fidan ise üç yıl sonra ağaç olur. Ağaç güz aylarında meyve vermeye başlar.'
        ]
      },
      {
        id: 4,
        title: '4. Etkileri',
        items: [
          'Özellikle kalp sağlığı için oldukça faydalıdır.',
          'Ayrıca göz sağlığı için de önemlidir.',
          'Nar meyvesinin bilinen bir zararı yoktur. Bazı kişilerde kaşıntı veya mide ağrısı yapabilir.'
        ]
      }
    ]
  },
  12: {
    storyId: 12,
    title: 'Ekonominin Kalbi Metni Şematik Düzenleyicisi',
    sections: [
      {
        id: 1,
        title: '1. İklim Özellikleri',
        items: [
          'Bu bölgenin iklimi geçiş iklimidir. Yani bölgenin güney kısmında Akdeniz iklimi vardır. Kuzey kısmında ise Karadeniz iklimi vardır.',
          'Bu bölgenin kışları ılık ve yağışlıdır.',
          'Yazları ise sıcak ve nemlidir.',
          'Bölge deprem açısından çok risklidir.'
        ]
      },
      {
        id: 2,
        title: '2. Bitki Örtüsü',
        items: [
          'Bu bölgenin bitki örtüsü hem maki hem de ormandır.',
          'Bu bölgede genellikle ayçiçeği ve pirinç yetişir.'
        ]
      },
      {
        id: 3,
        title: '3. Yeryüzü Özellikleri',
        items: [
          'Bu bölge düzlük bir bölgedir.',
          'Bölgede platolar ve ovalar daha çok yer kaplar.',
          'Toprak yapısı ise az kireçli ve verimsiz topraklardır.',
          'Marmara\'nın denizi bir iç denizdir.'
        ]
      },
      {
        id: 4,
        title: '4. Ekonomik Faaliyetler',
        items: [
          'Burada sanayi ve turizm önemli ekonomik faaliyetlerdir.',
          'Fabrikalar ve tatil beldeleri bu nedenle çoktur.'
        ]
      },
      {
        id: 5,
        title: '5. Nüfus ve Yerleşme',
        items: [
          'Burada tam 27 milyon kişi yaşamaktadır.',
          'Bölgede kentsel yerleşim yaygındır.',
          'Küçük bir bölge olmasına rağmen iş imkanları çoktur.',
          'İnsanlar çalışmak için diğer bölgelerden bu bölgeye göç etmişlerdir.'
        ]
      }
    ]
  }
};

export const getSchema = (storyId: number): Schema | null => {
  return SCHEMAS[storyId] || null;
};
