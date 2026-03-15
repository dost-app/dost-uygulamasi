export type TextSegment = { text: string; bold?: boolean };
export type Paragraph = TextSegment[];
export const FALLBACK_STORIES: Record<number, Paragraph[]> = {
  1: [
    [
      { text: '"Karınca gibi çalışkan" ne demek? Sen hiç karınca yuvası gördün mü? Karıncaların yaşamı nasıldır? Haydi, bu soruların cevaplarını birlikte öğrenelim!' }
    ],
    [
      { text: 'Karıncaların yaşayışlarıyla başlayalım. ' },
      { text: 'Karıncalar çok çalışkan hayvanlardır.', bold: true },
      { text: ' Onlar oldukça ' },
      { text: 'hızlı hareket eder.', bold: true },
      { text: ' ' },
      { text: 'Küçük gruplar hâlinde yuvalarda yaşar.', bold: true },
      { text: ' Minik dostlarımız ' },
      { text: 'bir ekip olarak çalışır, işbirliğine önem verir.', bold: true },
      { text: ' Karıncaları her yerde görebilirsin. Mutfakta, ağaç köklerinde, taşların ve toprağın altında... Buralara yuva yaparlar.' }
    ],
    [
      { text: 'Şimdi bir karıncanın şekli nasıldır, bunu öğrenelim? ' },
      { text: 'Kocaman bir başı, uzun bir gövdesi vardır.', bold: true },
      { text: ' ' },
      { text: 'Karıncalar genellikle siyah, kahverengi ya da kırmızı renktedir.', bold: true },
      { text: ' ' },
      { text: 'Ayakları altı tanedir.', bold: true },
      { text: ' ' },
      { text: 'İki tane anteni vardır.', bold: true },
      { text: ' ' },
      { text: 'Bazı karıncalar kanatlıdır.', bold: true }
    ],
    [
      { text: 'Peki, sence karıncalar nasıl beslenir? Eğer cevabın şeker ise doğru! ' },
      { text: 'Genellikle şekerli yiyecekler yer.', bold: true },
      { text: ' ' },
      { text: 'Yere düşmüş tüm kırıntılara bayılır.', bold: true },
      { text: ' ' },
      { text: 'Aynı zamanda bitkileri de yer.', bold: true },
      { text: ' Kocaman bir ekmek parçasını bir sürü küçük karıncanın taşıdığını görebilirsin. Küçüktürler ama yaptıkları işler çok büyüktür.' }
    ],
    [
      { text: 'Peki, onlar nasıl çoğalır? Şimdi bunun cevabına bakalım. ' },
      { text: 'Karıncalar, yumurtlayarak çoğalır.', bold: true },
      { text: ' ' },
      { text: 'Kraliçe karınca yılda 50 milyon yumurta yapabilir.', bold: true },
      { text: ' Bu bir kova kumdan bile daha fazladır. İnanılmaz değil mi?' }
    ],
    [
      { text: 'Karıncaların çevreye olan etkilerini hiç düşündün mü? Küçük karıncalar, doğaya büyük faydalar sağlar. ' },
      { text: 'Onlar toprakları havalandırır.', bold: true },
      { text: ' ' },
      { text: 'Ağaçlara zarar veren böcekleri yer.', bold: true },
      { text: ' ' },
      { text: 'Tıpkı bir postacı gibi bitkilerin tohumunu dağıtır.', bold: true },
      { text: ' Bu canlılar, bazen zararlı da olabilir. ' },
      { text: 'Bazen insanlar ısırır. Bu durum kaşıntı yapabilir.', bold: true },
      { text: ' Bazen de ' },
      { text: 'tifüs ve verem gibi hastalıkları yayabilir.', bold: true },
      { text: ' Küçük dostlarımızı artık çok iyi biliyorsun. Onlara bugün bir küp şeker ısmarlamaya ne dersin?' }
    ]
  ],
  2: [
    [
      { text: 'Hey! Akıllı telefonlar hakkında neler biliyorsun? Bu icatla ilgili bir maceraya hazır mısın? Şimdi birlikte keşfetme zamanı!' }
    ],
    [
      { text: 'Önce akıllı telefonun kullanım amaçlarına bakalım. ' },
      { text: 'Bu telefonlar birçok amaç için kullanılır.', bold: true },
      { text: ' ' },
      { text: 'Örneğin iletişim kurarsın.', bold: true },
      { text: ' Aramalar, mesajlaşmalar, videolu görüşmeler yaparsın.' },
      { text: ' Önemli bilgilere tek tuşla erişirsin.', bold: true },
      { text: ' Tabi ki eğlenmek için de kullanırsın. Oyunlar oynarsın. Müzik dinlersin. Video izlersin. Fotoğraf çekersin. Hatta bir film bile çekebilirsin.' }
    ],
    [
      { text: 'Haydi, şimdi akıllı telefonların şekil ve boyutlarına bakalım. ' },
      { text: 'Genellikle telefonlar dikdörtgendir.', bold: true },
      { text: ' ' },
      { text: 'Bazı telefonlar katlanabilir.', bold: true },
      { text: ' Evet, yanlış okumadın. Tıpkı bir kâğıt gibi katlanır.' },
      { text: ' Hepsi cebine sığacak boydadır.', bold: true },
      { text: ' Hafif ve rahat kullanıma sahiptir.', bold: true },
      { text: ' Hem ön hem arka kameraları vardır. Alt tarafında hoparlör ve mikrofon bulunur.' }
    ],
    [
      { text: 'Peki, nasıl çalışır? Hiç merak ettin mi? ' },
      { text: 'Bu cihazlar elektrik enerjisi kullanır.', bold: true },
      { text: ' Bir batarya ile çalışır.', bold: true },
      { text: ' Dokunmatik ekran ile kontrol edilir.', bold: true },
      { text: ' Sinyalleri alır. Ardından bu sinyalleri işler. Daha sonra iletir.', bold: true },
      { text: ' İnternet bağlantısı da böyle sağlanır.' }
    ],
    [
      { text: 'Şimdi de üretimlerine bakalım. ' },
      { text: 'Bu cihazlar özel fabrikalarda üretilir.', bold: true },
      { text: ' Akıllı telefonlar önce tasarlanır, yani nasıl görüneceğine karar verilir.' },
      { text: ' Sonra ekran, pil ve kamera gibi parçalar laboratuvarda birleştirilir.', bold: true },
      { text: ' Daha sonra telefonun çalışmasını sağlayan yazılımlar yüklenir.', bold: true },
      { text: ' Son olarak her şeyin düzgün çalışıp çalışmadığı test edilir.' }
    ],
    [
      { text: 'Akıllı telefonların insanların hayatına farklı etkileri vardır. ' },
      { text: 'Bu cihazlar hayatımızı oldukça kolaylaştırır.', bold: true },
      { text: ' Âdeta iletişim, eğlence ve bilgi edinme küçücük bir kutuya sıkıştırılmıştır!', bold: true },
      { text: ' Akıllı bir kutu gibi!' },
      { text: ' Ancak aşırı kullanımda göz sağlığın etkilenebilir.', bold: true },
      { text: ' Bu nedenle onu ihtiyacın kadar kullanmalısın.' }
    ]
  ],
  3: [
    [
      { text: 'Hey! Sana bir meyvenin ismini vermeden anlatayım, sen hangi meyve olduğunu tahmin et. Buruşuk, tatlı, kahverengi renkte bir meyvedir. Birçok çeşidi vardır. Özellikle Ramazan ayında tüketilir. Sence bu hangi meyvedir? ' },
      { text: 'Cevabın hurmaysa doğru bildin!', bold: true },
      { text: ' Haydi şimdi hurmaların yetiştiği hurma ağacını tanıyalım!' }
    ],
    [
      { text: 'Hurmanın yaşam koşulları ile başlayalım. ' },
      { text: 'Hurmalar, çok sıcak olan çöl ikliminde yetişir.', bold: true },
      { text: ' Yani sıcağı çok sever. ' },
      { text: 'Ülkemizde ise Akdeniz Bölgesi\'nde olur.', bold: true },
      { text: ' ' },
      { text: 'Hurma meyvesi ağaçta yetişir.', bold: true },
      { text: ' ' },
      { text: 'Hurma ağaçları çok uzundur.', bold: true },
      { text: ' Ayrıca hurma ağaçları kuraklığa dayanıklıdır.', bold: true },
      { text: ' Ancak meyvelerini verirken suya ihtiyaç duyar.', bold: true },
      { text: ' Hurma meyvesi salkım şeklinde hurma ağacının dallarından sallanır.', bold: true }
    ],
    [
      { text: 'Şimdi de hurma ağaçlarının görünümlerine bakalım. ' },
      { text: 'Hurma ağacı; gövde, yaprak ve meyve olmak üzere üç kısımdan oluşur.', bold: true },
      { text: ' Bu ağaç, palmiyeye benzer. ' },
      { text: 'Özellikle uzun gövdesiyle dikkat çeker.', bold: true },
      { text: ' En güzel yanları, meyveleridir tabii ki! ' },
      { text: 'Bu meyveler, şekerlemeye benzer, çok da lezzetlidir.', bold: true },
      { text: ' Meyvenin içinde çekirdek bulunur.', bold: true },
      { text: ' Hurma ağaçlarının yaprakları uzun ve küçüktür.', bold: true },
      { text: ' Bu yapraklardan da çay yapılır.' }
    ],
    [
      { text: 'Hurma ağaçlarının nasıl çoğaldığını bilmek ister misin? ' },
      { text: 'İstersen çekirdeğini ekerek çoğalmasını sağlarsın.', bold: true },
      { text: ' İstersen hurma ağacının gövdesinden çıkan filizleri ekersin.', bold: true },
      { text: ' ' },
      { text: 'Bir hurma ağacı yaklaşık 70 yıl yaşar.', bold: true },
      { text: ' Yeter ki hava soğuk olmasın!' }
    ],
    [
      { text: 'Son olarak hurmanın çevreye etkisine bakalım. ' },
      { text: 'Hurma ağacının yaprak ve gövdesiyle çeşitli eşyalar yapılır.', bold: true },
      { text: ' Hurma meyvesi çok faydalıdır; en önemli yararlarından biri ', },
      { text: 'kemikleri güçlendirmesidir.', bold: true },
      { text: ' Hurma meyvesi ise, beynimizin ve kalbimizin sağlığı için çok faydalıdır.', bold: true },
      { text: ' Ancak çok tüketilirse baş ağrısı yapabilir.', bold: true }
    ]
  ],
  4: [
    [
      { text: 'Hey! Sana bir sorum var: Turizmin incisi olarak bilinen bölgemiz hangisidir? Tabii ki, Akdeniz Bölgesi. Haydi, birlikte Akdeniz\'i keşfedelim.' }
    ],
    [
      { text: 'Akdeniz bölgesinin iklimi ile başlayalım. Bu bölgede ' },
      { text: 'Akdeniz iklimi görülür.', bold: true },
      { text: ' Bu iklimde yazları sıcak ve kuraktır. Kışları ise ılık ve yağışlıdır. Don olayları nadiren yaşanır. En fazla yağış kış mevsiminde düşer. Bazen ani ve aşırı yağmurlar da görülebilir. Bu ani ve aşırı yağmurlar, bir doğal afet olan sele sebep olabilir.' }
    ],
    [
      { text: 'Peki, sence bu bölgenin bitki örtüsü nasıldır? ' },
      { text: 'Akdeniz Bölgesi\'nin bitki örtüsü makidir.', bold: true },
      { text: ' Makiler, kısa boylu ağaçlardır. Maki türleri arasında mersin, keçiboynuzu, defne vardır. Bu bölgede ' },
      { text: 'bolca zeytin ve portakal ağaçları da bulunur.', bold: true }
    ],
    [
      { text: 'Sırada bölgenin yeryüzü şekilleri var. ' },
      { text: 'Akdeniz, dağlık ve engebelidir.', bold: true },
      { text: ' Bu bölgede engebeli ve sulak araziler olduğu için dağınık yerleşim görülür. Bölgeyi dağlar ve yüksek platolar oluşturur. Ayrıca bu bölgede kırmızı renkli topraklar bulunur. Bu topraklar verimlidir. Akdeniz\'in sıcak ve tuzlu bir denizi vardır.' }
    ],
    [
      { text: 'Akdeniz bölgesi gelirini tarım ve turizmden elde eder.', bold: true },
      { text: ' Tarım iç bölgelerde yapılır. Zeytinlerden lezzetli zeytinyağı yapılır. Portakallar ve limonlar üretilir. Bu ürünlerden büyük gelir elde edilir. Diğer bir gelir kaynağı olan turizm bölgenin başlıca kaynağıdır. Deniz, güneş ve turkuaz kıyılar turistler için burayı cazip kılar. Ayrıca antik kentler ve güzel doğal güzellikleri tanıtmak için birçok insan burayı ziyaret eder.' }
    ],
    [
      { text: 'Bölgenin nüfusu yaklaşık 11 milyona yakındır. ' },
      { text: 'Bölgede yaşayan insanların çoğunluğu kentlerde yaşamaktadır.', bold: true },
      { text: ' Sen de burada yaşamak ister miydin?' }
    ]
  ],
  5: [
    [
      { text: 'Çöl Gemisi deyince aklına ne geliyor? Şimdi birlikte bu sorunun cevabını öğreneceğiz. Hazır mısın?' }
    ],
    [
      { text: 'Çöl gemilerinin ne olduğu ve nasıl yaşadığı ile başlayalım. ' },
      { text: 'Çöl gemisi, develere verilen bir isimdir.', bold: true },
      { text: ' Çünkü develer genellikle çöl ikliminde yaşar. Çöl zorlu bir iklimdir. Yani, ' },
      { text: 'develer zorlu iklim koşullarında yaşayabilir.', bold: true },
      { text: ' Develer, gezmeyi çok sever. Onlar sürü halinde gezer. Sürüde bir erkek, bir dişi ve yavru develer vardır. ' },
      { text: 'Kendini tehlikede hisseden bir deve tükürebilir.', bold: true },
      { text: ' Böylelikle kendisini korumaya çalışır.' }
    ],
    [
      { text: 'Sırada develerle ilgili fiziksel özellikler var. ' },
      { text: 'Develer, uzun boyludur. Hörgüçleri vardır.', bold: true },
      { text: ' Bazı develer tek hörgüçlüdür. Bazı develer ise çift hörgüçlüdür.', bold: true },
      { text: ' Hörgüçler adeta bir depo gibidir. Develer yiyeceklerini buraya saklar. Böylelikle bu hayvanlar uzun süre aç ve susuz kalabilir. ' },
      { text: 'Develerin uzun kirpikleri vardır.', bold: true },
      { text: ' Bu kirpikler, develerin gözlerini kum fırtınalarından korur.' }
    ],
    [
      { text: 'Şimdi, sırada beslenmeleri var. ' },
      { text: 'Develer, otçul hayvanlardır.', bold: true },
      { text: ' Yaprakları, meyveleri, dikenli bitkileri yer. ' },
      { text: 'Develer, az besinle yetinebilir. Günlerce yemek yemese de olur.', bold: true },
      { text: ' Bu hayvanlar, tek bir seferde 80-90 litre su içer. Bu sayede günlerce susuz kalabilir.' }
    ],
    [
      { text: 'Develer nasıl çoğalır? Bir fikrin var mı? ' },
      { text: 'Develer doğurarak çoğalır.', bold: true },
      { text: ' Yeni doğan deve hörgüçsüzdür. Büyüdükçe hörgüçleri belirginleşir.' }
    ],
    [
      { text: 'Peki develerin çevreye olan etkileri nelerdir? ' },
      { text: 'Develer insanların dostudur. İnsanların ulaşımını sağlar.', bold: true },
      { text: ' Eşyalarını taşırlar. İnsanlar develerin yününden, sütünden, etinden faydalanabilir. ' },
      { text: 'Ancak dikkat et! Bazı develer hastalık taşıyabilir.', bold: true },
      { text: ' Bu insanlara bulaşabilir. İşte bu kadar! Haydi develerle ilgili öğrendiklerini arkadaşlarına da anlat!' }
    ]
  ],
  // Hikaye 6–24: Fotoğraftaki metin sayfalarına göre birebir düzenlenen paragraflar (Oturum 6–24)
  6: [
    [{ text: 'Ne gerçek ne hayal... Gözlüğü takınca başlar masal! Sana bir gerçeği anlatmam lazım. Ama öyle bildiğin gerçeklerden değil! Sanal bir gerçek! Yaptıklarına inanamazsın. Haydi, okumaya devam et ve öğren.' }],
    [
      { text: 'Sanal gerçeklik gözlükleri, sanki başka bir dünyadaymışsın gibi hissettirir. ' },
      { text: 'Bu cihazları; eğitim, sağlık alanlarında ve tabi ki eğlenmek için kullanabilirsin. Bu gözlük sayesinde kitaplar canlanabilir. Antik Roma\'da gezebilirsin. Hatta uzay gemisiyle galaksiyi bile keşfedersin. Ayrıca doktorlar bu gözlükleri zor ameliyatlarda yardımcı bir doktor gibi kullanır.', bold: true }
    ],
    [
      { text: 'Sence bu cihazlar nasıl görünür? Sanal gerçeklik gözlükleri, ' },
      { text: 'kutuya benzeyen büyük bir gözlük gibidir. Gözleri tamamen kapatır ve başa lastikli bir bantla takılır. Genellikle siyah renkte olur ve iki elinle tutabileceğin kadar büyüktedir.', bold: true },
      { text: ' Ayrıca bu cihazların ' },
      { text: 'kulaklıkları ve hoparlörleri de bulunur.', bold: true }
    ],
    [
      { text: 'Sence bu cihazlar nasıl çalışır? ' },
      { text: 'Tabii ki, elektrik enerjisi ile çalışır. Gözlüklerin içinde iki küçük ekran bulunur. Başını nereye çevirirsen görüntü de seninle döner.', bold: true },
      { text: ' Böylece sanki gerçekten oradaymışsın gibi olur. ' },
      { text: 'Elindeki kumandalarla da sanal dünyadaki eşyaları tutup hareket ettirebilirsin.', bold: true }
    ],
    [
      { text: 'Şimdi de sıra üretimlerinde. ' },
      { text: 'Bu cihazlar, bilim insanlarının ve mühendislerin iş birliğiyle üretilir. Önce sensörleri ve ekranları üretilir. Daha sonra özel fabrikalarda bu ekranlar gözlük çerçeveleriyle birleşir.', bold: true }
    ],
    [
      { text: 'Bu gözlüklerin bir sürü yararı var! ' },
      { text: 'Gözlüklerle eğlenerek öğreniriz. Bilgiler daha kalıcı olur. Yeni yerlere gitmek daha da kolaylaşır.', bold: true },
      { text: ' Ancak sanal gerçeklik gözlüklerin bazı olumsuz yanları da olabilir. ' },
      { text: 'Eğer onunla çok vakit geçirirsen gözlerin bozulabilir.', bold: true },
      { text: ' Sanal gerçeklik gözlüğüyle her şey sana çok yakın!' }
    ]
  ],
  7: [
    [{ text: 'Hey meraklı dostum! Kaktüsler hakkında neler biliyorsun? Haydi, birlikte kaktüslerin dikenli yaşamına bakalım!' }],
    [
      { text: 'Kaktüslerin yaşam koşullarıyla başlayalım. ' },
      { text: 'Kaktüsler sıcak ve kurak bölgelerde yetişmektedir. Örneğin Afrika ve Güney Amerika\'da yetişir. Kaktüs, güneşi çok sever. Topraktaki çok az suyla yetinir. Yani, kaktüsler kuraklığa dayanıklıdır. Susuz kalmaktan hiç korkmaz.', bold: true },
      { text: ' Bunu nasıl mı başarırlar? Az sonra öğreneceksin.' }
    ],
    [
      { text: 'Kaktüslerin fiziksel özellikleri ile başlayalım. ' },
      { text: 'Kaktüsün en belirgin özelliği dikenleridir. Bu dikenler sayesinde kaktüsler, susuzluktan ve kuraklıktan korkmaz. Çünkü dikenler suyu depolar.', bold: true },
      { text: ' Bazı dikenlerin üstünde tüy vardır. Kaktüsler çok çeşitli şekil ve boyuttadır. ' },
      { text: 'Bazı kaktüs türleri uzun ve incedir. Bazıları ise kısa ve tombuldur.', bold: true },
      { text: ' Ağaç kadar büyük olan da vardır. Minik bir saksıya sığacak kadar küçük olan da. ' },
      { text: 'Renkleri de çok çeşitlidir: yeşil, mor, turuncu ve hatta kırmızı! Unutmadan tüm kaktüslerin kökleri çok uzun ve kalındır.', bold: true }
    ],
    [
      { text: 'Onların nasıl çoğaldığını merak ettin mi? ' },
      { text: 'Kaktüsler, tohumla veya bir parçasının toprağa ekilmesiyle çoğalır. Ayrıca kimi kaktüs kendilerinden yeni parçalar çıkararak çoğalır.', bold: true },
      { text: ' Ne şaşırtıcı, değil mi?' }
    ],
    [
      { text: 'Peki kaktüslerin çevreye olan etkileri hakkında bilgin var mı? Kaktüs bitkisi, çevre dostudur. ' },
      { text: 'Bulundukları toprağı korur. Hayvanlar için yiyecek ve su deposudur. Ayrıca kuş, kertenkele, çöl faresi gibi hayvanlar için barınma yeri de olabilir. Ancak eğer dikkatli olunmazsa dikenler elimize batarak cilde zarar verebilir.', bold: true },
      { text: ' Sen de bir kaktüs yetiştirmek ister misin?' }
    ]
  ],
  8: [
    [{ text: 'Hey! Birlikte Doğu Anadolu Bölgesi turuna çıkalım mısın? Haydi, Van Gölü\'nde balık tutup Erzurum\'da Çağ kebabımızı yiyelim.' }],
    [
      { text: 'Bu bölgede iklim nasıl, hiç merak ettin mi? ' },
      { text: 'Bölgenin iklimi karasaldır.', bold: true },
      { text: ' Bu iklim türünde ' },
      { text: 'kışlar soğuk ve uzundur. Yazlar ise kısa ve serindir. Kış aylarında fazlaca kar yağar.', bold: true },
      { text: ' Hava çok soğuk olduğu için don olayları da görülür. İlkbaharda ' },
      { text: 'bolca yağmur yağar.', bold: true },
      { text: ' Bölgede ' },
      { text: 'en çok görülen doğal afet çığdır.', bold: true },
      { text: ' Çığ, yüksek yerlerden düşen kar parçalarının yuvarlanarak büyümesidir.' }
    ],
    [
      { text: 'Şimdi sırada Doğu Anadolu\'nun bitki örtüsü var. ' },
      { text: 'Bu bölgenin bitki örtüsü bozkırdır.', bold: true },
      { text: ' Bozkırlar kurak otlardan oluşan alanlara denir. ' },
      { text: 'Yüksek yerlerindeyse ormanlar görülür. Bazı yerlerinde çayırlar da vardır.', bold: true },
      { text: ' Çayır, uzun boylu yeşil otlardır. Bu bölgede genellikle ' },
      { text: 'yetiştirilen bitkiler arpa, buğday ve elmadır.', bold: true }
    ],
    [
      { text: 'Doğu Anadolu\'nun yeryüzü şekilleri, bir masal diyarından fırlamış gibidir! Dağlar, ovalar, vadiler, göller ve nehirler... ' },
      { text: 'Bölgenin yükseltisi fazladır.', bold: true },
      { text: ' ' },
      { text: 'Dağlar geniş yer kaplar.', bold: true },
      { text: ' En yüksek dağımız olan Ağrı Dağı bu bölgededir. Bölgede dağların dışında ' },
      { text: 'verimli ovalar da bulunur.', bold: true },
      { text: ' Ovalarda birçok ürün yetişir. Bölgede ' },
      { text: 'verimsiz taşlı toprakların yanısıra verimli kara toprak da görülür.', bold: true }
    ],
    [
      { text: 'Gel, şimdi birlikte bölgenin ekonomi dünyasına bakalım. ' },
      { text: 'Bölgede tarım ve hayvancılık yapılır. Tarım ürünü olarak buğday, şekerpancarı ve nohut yetişir.', bold: true },
      { text: ' Ayrıca burada ' },
      { text: 'madencilik de yapılır.', bold: true },
      { text: ' Bu bölgede bakır, gümüşlü kurşun ve bor madenleri çıkar.' }
    ],
    [
      { text: 'Sıra Doğu Anadolu\'nun nüfusunda! ' },
      { text: 'Bu bölge, en az insan yaşayan bölgemizdir.', bold: true },
      { text: ' ' },
      { text: 'Kırsalda, kenttekinden daha çok insan yaşar.', bold: true },
      { text: ' Bölge kurak olduğu için ' },
      { text: 'toplu yerleşmeler', bold: true },
      { text: ' görülür. İnsanları sıcak ve misafirperverdir.' }
    ]
  ],
  9: [
    [{ text: '"Yuva yaparım ağaçlara. En sevdiğim şey fındıktır, unutma!" Bu bilmecenin cevabını biliyor musun? Senin için söyleyeyim: Sincap. Haydi, onları yakından tanıyalım!' }],
    [
      { text: 'Sincapların yaşayışlarıyla başlayalım. ' },
      { text: 'Sincaplar ağaçlarda yaşar. Ormanlardaki, parklardaki ağaçlara yuva yapar.', bold: true },
      { text: ' Yuvalarını tırmanarak inşa eder. ' },
      { text: 'Bu hayvanlar oldukça hızlıdır. Yaşam süreleri ortalama 10 yıldır.', bold: true }
    ],
    [
      { text: 'Sırada fiziksel özellikleri var. ' },
      { text: 'Sincaplar genellikle kahverengidir. Bir sincabın boyu küçük bir su şişesi kadardır.', bold: true },
      { text: ' Uzun bir kuyruğa sahiptir. Bu kuyruk güçlü ve kıvraktır. Sincaplar kuyrukları sayesinde dengede kalır. Hiç sincapların dişlerini gördün mü? ' },
      { text: 'Bu hayvanların keskin ön dişleri vardır. Ayrıca sincapların gözleri çok iyi görür.', bold: true },
      { text: ' Bir sincap en uzaktaki fındığı bile hemen fark eder.' }
    ],
    [
      { text: 'Fındık demişken haydi, onların beslenmesine bakalım. ' },
      { text: 'Sincaplar otçuldur. Onlar; fındık, fıstık, palamut gibi yemişleri yerler. Sincaplar meyve ve tohumlara da bayılır. Onlar topladıkları yiyecekleri yer altına ya da ağaç kovuklarına saklar.', bold: true }
    ],
    [
      { text: 'Sincapların nasıl çoğaldıklarını hiç düşündün mü? ' },
      { text: 'Bu canlılar doğurarak çoğalır.', bold: true },
      { text: ' ' },
      { text: 'Anne sincap bir yıl içerisinde 2 ile 7 arasında yavru doğurabilir.', bold: true },
      { text: ' Anne sincap, yuva yapmak için ağacın dibini kazar. Yuvanın içini ot ve yosunla döşer. Anne sincaplar yavrularına burada bakar. Söyle bakalım sen hiç sincap gördün mü?' }
    ],
    [
      { text: 'Sincapların çevreye etkileri hiç düşündün mü? Sincaplar dünyamıza fayda sağlayan dostlarımızdır. ' },
      { text: 'Onlar bazen sakladıkları tohumları unutabilir. Bu, unutulan tohumlar yeni ağaçlara dönüşür. Böylelikle ormanlarımız çoğalır.', bold: true }
    ]
  ],
  10: [
    [{ text: 'Akıllı saatleri daha önce hiç duydun mu? Şimdi bu cihazları daha yakından tanıma zamanı!' }],
    [
      { text: 'Akıllı saatler, geleneksel saatlere kıyasla daha çok şey yapar. ' },
      { text: 'Bu saatler, sadece saat değildir. Aynı zamanda bir bilgisayar, telefon hatta daha fazlasıdır! Mesela, bu saatler senin randevularını hatırlatır. Telefonundan bildirim alır. Hatta sen yürürken adımlarını bile sayar.', bold: true },
      { text: ' Onunla bir telefon görüşmesi yaparsın. Ayrıca ' },
      { text: 'arkadaşlarına mesaj atarsın. Eğlenmek istediğinde müzik açarsın.', bold: true },
      { text: ' Daha birçok şey yapabilirsin. Kolumuza takılan süper kahraman gibidir!' }
    ],
    [
      { text: 'Bu cihazların nasıl göründüğünü merak ediyor musun? ' },
      { text: 'Tıpkı bir saat gibidir. Ancak bu cihazlarda ekran dokunmatiktir.', bold: true },
      { text: ' Dokunmatik olması onu klasik saatlerden ayırır. ' },
      { text: 'Akıllı saatler küçük bir ekrana sahiptir. Bu ekran dikdörtgen veya yuvarlak olabilir.', bold: true }
    ],
    [
      { text: 'Sırada akıllı saatlerin nasıl çalıştıkları var. ' },
      { text: 'Akıllı saatler, bir telefonla eşleştirilip çalışır. Yani akıllı saat, telefondaki bilgileri kullanır.', bold: true },
      { text: ' Sana böylelikle bilgi verir.' }
    ],
    [
      { text: 'Üretimlerine bakacak olursak ' },
      { text: 'akıllı saatler özel fabrikalarda üretilir. Mühendislerin başında olduğu bir ekip vardır. Bu ekip üretim için malzeme seçer. Ardından yazılımı oluşturur.', bold: true },
      { text: ' Sonra tüm bunlar lego gibi birleştirilir. Sonuç olarak akıllı saat hayat bulur.' }
    ],
    [
      { text: 'Akıllı saatler hayatımızı etkiler. O ' },
      { text: 'minik bir yardımcı gibi hayatımızı kolaylaştırır.', bold: true },
      { text: ' Örneğin sana ' },
      { text: 'hava durumunu gösterir. Spor yaparken ne kadar aktif olduğunu takip eder.', bold: true },
      { text: ' Böylece daha düzenli yaşamana katkı sağlar. Ancak ' },
      { text: 'uzun süre takarsan, bileğini rahatsız edebilir.', bold: true },
      { text: ' Çok bakarsan, gözünü yorabilir. Sürekli bildirimle gelirse dikkatini dağıtabilir. Sen de bir akıllı saatin olsun ister misin?' }
    ]
  ],
  11: [
    [{ text: 'Ufacık sandık, içi dolu boncuk. Daha önce bu bilmeceyi duymuş muydun? Peki, "Pazardan aldım bir tane, eve geldim bin tane" desem? Evet, doğru tahmin ettin. Bu meyvenin adı nardır. Şimdi gel, bu meyvenin ağacını tanıyalım.' }],
    [
      { text: 'İlk olarak narın yaşam koşullarını anlatayım. ' },
      { text: 'Çok lezzetli bir meyve olan narın ağacı, sıcak iklimlerde yetişir. Nar ağaçları kuraklığa dayanıklıdır ama yaz mevsiminde suya ihtiyaç duyar. Türkiye\'de Akdeniz, Güneydoğu Anadolu ve Ege Bölgeleri nar yetiştirmek için en uygun yerlerdir. Bir nar ağacı yaklaşık 50 yıl kadar yaşayabilir.', bold: true }
    ],
    [
      { text: 'Şimdi de nar ağacının nasıl göründüğüne bakalım. ' },
      { text: 'Narın yaprakları parlak ve yeşil renktedir. Çiçekleri turuncu renkli; meyvesi ise dışı sert, tombul ve kırmızıdır.', bold: true },
      { text: ' Meyvenin içinde büyük ve beyaz bir zar bulunur. Bu zarın altında aynı bilmecede olduğu gibi taneler yer alır. Narın taneleri kıpkırmızı ve suludur. Tanelerin içinde ise meyvenin çekirdeği bulunur.' }
    ],
    [
      { text: 'Peki, bir nar ağacı nasıl çoğalır? ' },
      { text: 'Nar, çekirdeklerin veya ağaçtan kesilen bir dalın toprağa dikilmesiyle çoğalır.', bold: true },
      { text: ' Toprağa dikilen ağaç dalı bir süre sonra büyür. Daha sonra küçük bir fidan olur. ' },
      { text: 'Bu küçük fidan ise üç yıl sonra ağaç olur.', bold: true },
      { text: ' Ağaç güz aylarında meyve vermeye başlar. Lezzet boncukları böylelikle oluşur ve sofralarımıza ulaşır.' }
    ],
    [
      { text: 'Narın etkileriyle bitirelim. Nar meyvesinin insanlar için sayısız faydası bulunur. ' },
      { text: 'Özellikle kalp sağlığı için oldukça faydalıdır. Ayrıca göz sağlığı için de önemlidir. Nar meyvesinin bilinen bir zararı yoktur.', bold: true },
      { text: ' Bazı kişilerde kaşıntı veya mide ağrısı yapabilir.' }
    ]
  ],
  12: [
    [{ text: 'Merhaba kâşif! Bugün seninle Marmara Bölgesi\'nin gizemini çözeceğiz. Daha önce bu bölgeyi duymuş muydun? Bu bölgede İstanbul, Çanakkale, Bursa gibi önemli şehirler vardır. Burası, tarih ve doğanın muhteşem bir birleşimidir! Haydi, birlikte keşfedelim!' }],
    [
      { text: 'Önce bölgenin iklimine bakalım. ' },
      { text: 'Bu bölgenin iklimi geçiş iklimidir. Yani bölgenin güney kısmında Akdeniz iklimi vardır. Kuzey kısmında ise Karadeniz iklimi vardır.', bold: true },
      { text: ' Bu iki iklimin karmasına geçiş iklimi denir. ' },
      { text: 'Bu bölgenin kışları ılık ve yağışlıdır. Yazları ise sıcak ve nemlidir. Bölge deprem açısından çok risklidir.', bold: true }
    ],
    [
      { text: 'Sırada bölgenin bitki örtüsü var. Bu bölgenin bitki örtüsü hem ' },
      { text: 'maki', bold: true },
      { text: ' hem de ' },
      { text: 'ormandır.', bold: true },
      { text: ' Makiler, kısa boylu ağaçlardır. Orman ise gür ve uzun ağaçlardan oluşur. ' },
      { text: 'Bu bölgede genellikle ayçiçeği ve pirinç yetişir.', bold: true }
    ],
    [
      { text: 'Peki, sence bu bölgenin yeryüzü şekilleri nasıldır? ' },
      { text: 'Bu bölge düzlük bir bölgedir.', bold: true },
      { text: ' Dağlar bu bölgede pek yoktur. ' },
      { text: 'Bölgede platolar ve ovalar daha çok yer kaplar.', bold: true },
      { text: ' Bunlara en güzel örnek Çatalca-Kocaeli platosudur. ' },
      { text: 'Toprak yapısı ise az kireçli ve verimsiz topraklardır.', bold: true },
      { text: ' Marmara\'nın denizi bir iç denizdir. İç deniz etrafının karalarla çevrili olmasına denir.' }
    ],
    [
      { text: 'Marmara Bölgesi, Türk ekonomisinin kalbidir. Burada ' },
      { text: 'sanayi ve turizm', bold: true },
      { text: ' önemli ekonomik faaliyetlerdir. ' },
      { text: 'Fabrikalar ve tatil beldeleri bu nedenle çoktur.', bold: true },
      { text: ' Çok fazla fabrika olduğundan burada çok fazla insan çalışmaktadır.' }
    ],
    [
      { text: 'Bu bölgemizin, en kalabalık bölge olduğunu biliyor muydun? ' },
      { text: 'Burada tam 27 milyon kişi yaşamaktadır.', bold: true },
      { text: ' ' },
      { text: 'Bölgede kentsel yerleşim yaygındır.', bold: true },
      { text: ' Küçük bir bölge olmasına rağmen iş imkanları çoktur. Bu nedenle ' },
      { text: 'insanlar çalışmak için diğer bölgelerden bu bölgeye göç etmişlerdir.', bold: true }
    ]
  ],
  13: [
    [{ text: 'Hey! Leylekleri sever misin? Daha önce hiç leylek yuvası gördün mü? Leylekler gibi uçmak ne güzeldir! Haydi, birlikte gezgin kuş leylekleri öğrenelim.' }],
    [
      { text: 'Acaba leylekler nasıl yaşar? ' },
      { text: 'Leylekler, sulak alanlarda yaşar.', bold: true },
      { text: ' Özellikle sulak otlakları tercih eder. ' },
      { text: 'Bu kuşlar, sıcak yerleri sever. Bu nedenle kışları sıcak yerlere göç eder.', bold: true },
      { text: ' Göç yollarının başlangıcı ile sonu çok uzaktır. Leylekler buna rağmen rahatlıkla uzun mesafe uçabilir.' }
    ],
    [
      { text: 'Şimdi birlikte onların nasıl göründüğüne bakalım. ' },
      { text: 'Bu canlılar iri kuşlardır.', bold: true },
      { text: ' ' },
      { text: 'Boyları çok uzundur.', bold: true },
      { text: ' Yaklaşık olarak senin boyuna yakındır! ' },
      { text: 'Leylekler uzun bacaklıdır.', bold: true },
      { text: ' ' },
      { text: 'Uzun ve düz gagaları vardır.', bold: true },
      { text: ' ' },
      { text: 'Genellikle tüyleri beyazdır.', bold: true },
      { text: ' Kanatları onların en belirgin özelliğidir. Çünkü ' },
      { text: 'kanatları çok güçlüdür.', bold: true },
      { text: ' ' },
      { text: 'Kanatlarının tüyleri ise siyahtır.', bold: true },
      { text: ' Kanatlarını açarak uçtuklarında gökyüzünde âdeta süzülürler.' }
    ],
    [
      { text: 'Sırada nasıl beslendikleri var. ' },
      { text: 'Bir leylek, gagasıyla avını hemen yakalar.', bold: true },
      { text: ' ' },
      { text: 'Leylekler, genelde su canlılarını yer.', bold: true },
      { text: ' ' },
      { text: 'Onlar özellikle balık ve yılanı çok sever.', bold: true },
      { text: ' ' },
      { text: 'Ayrıca kurbağa ve böcekleri de yer.', bold: true }
    ],
    [
      { text: 'Nasıl çoğaldıklarını merak ediyor musun? Haydi, öğrenelim! ' },
      { text: 'Anne leylek her yıl yumurtlar.', bold: true },
      { text: ' ' },
      { text: 'Bir defada dört yumurta yumurtlar.', bold: true },
      { text: ' Birkaç hafta sonra yavru leylekler yumurtadan çıkar. Anne leylekler çevreden yiyecek toplar. Onları küçük parçalara bölüp yavrularına verir. Böylece yavrularını besler.' }
    ],
    [
      { text: 'Peki, leyleklerin çevreye etkisi nasıldır? Bu canlılar doğanın önemli parçasıdır. ' },
      { text: 'Leylekler, sulak alanlardaki dengeyi sağlar.', bold: true },
      { text: ' ' },
      { text: 'Böcekleri yiyerek tarım alanlarını korur.', bold: true },
      { text: ' Ama ' },
      { text: 'bazen leylekler yuvalarını elektrik tellerine yapar. Bu, elektrik tellerine zarar verebilir.', bold: true },
      { text: ' Bu kocaman kuşu sevdin mi?' }
    ]
  ],
  14: [
    [{ text: 'Hey! Sence robotlar ne işe yarar? Neye benzer? Nasıl üretilir? Haydi, bu soruların yanıtlarını keşfedelim.' }],
    [
      { text: 'Robotların ne işe yaradığı ile başlayalım. ' },
      { text: 'Robotlar, insanlara farklı alanlarda yardımcı olan makinelerdir.', bold: true },
      { text: ' Robotlar çok fazla iş yapar. ' },
      { text: 'Eğlence, eğitim, araştırma gibi amaçlar için kullanılır.', bold: true },
      { text: ' ' },
      { text: 'Bazıları çok basit işleri yapar. Mesela evini temizler. Meyve sıkar.', bold: true },
      { text: ' ' },
      { text: 'Bazıları ise daha karmaşık işleri yapar, mesela birini ameliyat eder!', bold: true },
      { text: ' Ayrıca ' },
      { text: 'pek çok makinenin üretimine destek olur. Örneğin uçak, araba ve bilgisayar üretilirken robot dostlarımız kullanılır.', bold: true },
      { text: ' Kısaca pek çok konuda dostumuzdur metal dostlar!' }
    ],
    [
      { text: 'Şimdi de sırada nasıl göründükleri var. ' },
      { text: 'Robotların şekil ve boyutları değişkendir.', bold: true },
      { text: ' Ne işe yaradığına göre değişir. ' },
      { text: 'Kimi insan şeklindedir, kimi bir kutuya benzer.', bold: true },
      { text: ' ' },
      { text: 'Bazıları da yuvarlak görünür.', bold: true }
    ],
    [
      { text: 'Robotların nasıl çalıştığını merak ediyor musun? ' },
      { text: 'Bazıları prizlere bağlı çalışır.', bold: true },
      { text: ' ' },
      { text: 'Bazıları ise şarjlıdır. Yani onu çalıştırmak için şarj etmen gerekir.', bold: true },
      { text: ' ' },
      { text: 'Robotların hareket etme biçimlerini belirlemek için yazılımlar yüklenir.', bold: true },
      { text: ' Genellikle ' },
      { text: 'robotları çalıştırmak için üstündeki bir tuşa basmak yeterlidir.', bold: true },
      { text: ' Ayrıca ' },
      { text: 'bazıları yapay zekâ desteğiyle çalışır. Örneğin sürücüsüz araçlar yapay zekâyla çalışır.', bold: true }
    ],
    [
      { text: 'Acaba bir robot nasıl üretilir? ' },
      { text: 'Robotlar, uzman ekipler tarafından fabrikalarda üretilir.', bold: true },
      { text: ' ' },
      { text: 'Üretim süreçleri karmaşıktır.', bold: true },
      { text: ' Önce ' },
      { text: 'robotun ne amaçla kullanılacağı belirlenir.', bold: true },
      { text: ' ' },
      { text: 'Daha sonra şekli, boyutu, tasarımı belirlenir ve üretime geçilir.', bold: true }
    ],
    [
      { text: 'Peki, robotların hayatımıza ne gibi etkileri olabilir? ' },
      { text: 'Robotlar, hayatımızı kolaylaştırır. Onlar sayesinde zor işleri kolaylıkla yaparız.', bold: true },
      { text: ' Ancak robotlarla ilgili bazı endişeler de vardır. ' },
      { text: 'Robotlar, insanların işlerini alabilir. Bu yüzden işsizlik olabilir.', bold: true }
    ]
  ],
  15: [
    [{ text: 'Hey! Sen daha önce hiç avcı bir bitki gördün mü? Bu küçük avcıların ismi, sinekkapan bitkisi! Sevimli ama sinekler için tehlikeli. Küçük avcılar hakkında bir şeyler öğrenmeye ne dersin!' }],
    [
      { text: 'Öncelikle sana sinekkapan bitkisinin yaşam koşullarından bahsedeyim. ' },
      { text: 'Sinekkapanlar bataklık ve nemli yerlerde yetişir.', bold: true },
      { text: ' ' },
      { text: 'Genellikle Amerika\'da bulunur.', bold: true },
      { text: ' Bu bitki, güneş ışığı ve topraktan aldığı su ile büyür. ' },
      { text: 'Sinekkapan bitkisi, etçil bir bitki türüdür.', bold: true },
      { text: ' Yani, ' },
      { text: 'sinek ve karınca gibi böcekleri yakalayarak beslenir.', bold: true },
      { text: ' Sinekkapanlar, gerekli besin ihtiyaçlarını bu yolla karşılar.' }
    ],
    [
      { text: 'Şimdi ise sırada nasıl göründükleri var. ' },
      { text: 'Bu bitkilerin rengi yeşildir.', bold: true },
      { text: ' ' },
      { text: 'Sinekkapan bitkisi, tıpkı bir ağza benzer.', bold: true },
      { text: ' ' },
      { text: 'Yaprakları, ağzını açmış gibi görünür.', bold: true },
      { text: ' ' },
      { text: 'Ağzın içi ise kırmızı renktedir.', bold: true },
      { text: ' ' },
      { text: 'Ağızda tıpkı diş gibi küçük tüyler bulunur.', bold: true },
      { text: ' ' },
      { text: 'Bu tüyler, özel bir sıvı salgılar. Kokusuyla böcekleri kendine çeker.', bold: true },
      { text: ' Yani, sinekkapanın ağzı böcekler için bir çeşit tuzaktır.' }
    ],
    [
      { text: 'Peki, nasıl çoğaldıklarını merak ettin mi? ' },
      { text: 'Sinekkapan bitkisi, ya köklerinden çıkan yavru bitkilerle ya da çiçeklerinden oluşan tohumlarla çoğalır.', bold: true },
      { text: ' ' },
      { text: 'Kökten çıkan yavrular annesi gibi büyüyüp kocaman olur.', bold: true },
      { text: ' ' },
      { text: 'Tohumlar ise toprağa ekilince zamanla yeni sinekkapanlar büyür.', bold: true }
    ],
    [
      { text: 'Sinekkapan bitkisinin çevreye olan etkilerini hiç düşündün mü? Bu bitki, çevreye hem yararlı hem de zararlı olabilir. ' },
      { text: 'Yararı böcekleri avlayarak ekolojik dengeyi sağlamasıdır.', bold: true },
      { text: ' ' },
      { text: 'Zararı ise bazı böcekleri yediği için onların neslini tehlikeye atmasıdır.', bold: true },
      { text: ' İşte böyle! Bir gün bir sinekkapanı görürsen, ona dikkatle bak ama dokunmamaya özen göster!' }
    ]
  ],
  16: [
    [{ text: 'Merhaba meraklı dostum! Sana birkaç ipucu vereceğim. Bu ipuçlarını kullan. Ardından bahsedilen bölgeyi bul! Çok güzel sahillere sahip olan İzmir şehri bu bölgededir. Ayrıca tıpkı beyaz bir cennet olan Pamukkale de burada yer alır. Burası zeytinyağlı yemekleriyle meşhurdur. Sence bu bölge hangisidir? Ege Bölgesi değil mi? Haydi, Ege bölgesine yakından bakalım.' }],
    [
      { text: 'Öncelikle bölgenin ikliminden bahsedelim. Bölgede ' },
      { text: 'Akdeniz iklimi görülür.', bold: true },
      { text: ' Yani, ' },
      { text: 'yazları sıcak ve kuraktır. Kışları ise ılık ve yağışlı geçer.', bold: true },
      { text: ' ' },
      { text: 'En yağışlı mevsim kıştır. Bu yağışlar, sel denen su taşkınlarına neden olabilir.', bold: true },
      { text: ' Ayrıca ' },
      { text: 'bölge fay hatları üzerindedir.', bold: true },
      { text: ' Bu nedenle ' },
      { text: 'burada sık sık deprem olur.', bold: true }
    ],
    [
      { text: 'Şimdi de sıra bitki örtüsünde. ' },
      { text: 'Ege Bölgesi\'nin bitki örtüsünde en çok makiler görülür. Makiler kısa boylu çalılardır.', bold: true },
      { text: ' ' },
      { text: 'Funda, yabani zeytin ve böğürtlen bu bitkilerden bazılarıdır.', bold: true },
      { text: ' ' },
      { text: 'Bölgenin yüksek yerlerinde ise ormanlar yaygındır.', bold: true },
      { text: ' Bu bölgede incir, üzüm, haşhaş gibi birçok bitki yetişir.' }
    ],
    [
      { text: 'Bölgenin yeryüzü şekillerine bakalım mı? ' },
      { text: 'Yaygın olarak ovalar ve dağlar vardır.', bold: true },
      { text: ' Ayrıca ' },
      { text: 'platolar da bulunur.', bold: true },
      { text: ' ' },
      { text: 'Güzel sahillere sahip bir denizi vardır.', bold: true },
      { text: ' ' },
      { text: 'Denizden uzaklaştıkça yükselti artar.', bold: true },
      { text: ' ' },
      { text: 'Bölgenin toprağı ise kireçli topraktır.', bold: true }
    ],
    [
      { text: 'Sırada ekonomik faaliyetler var. Bölgenin ekonomik faaliyetleri çok çeşitlidir. ' },
      { text: 'Burada insanlar tarım, hayvancılık, balıkçılık ile uğraşır.', bold: true },
      { text: ' Ayrıca ' },
      { text: 'sanayi ve turizm de yaygındır.', bold: true },
      { text: ' ' },
      { text: 'Tarihi ve doğal güzellikleri olduğu için turizm açısından önemlidir.', bold: true }
    ],
    [
      { text: 'Ege Bölgesi\'nde yaklaşık 10 milyon insan yaşar.', bold: true },
      { text: ' ' },
      { text: 'Bölgede yaşayan insanlar genellikle kıyı şehirlerine yerleşmiştir.', bold: true },
      { text: ' Su kaynaklarının yetersiz olmasından dolayı ' },
      { text: 'toplu yerleşimler görülür.', bold: true },
      { text: ' Ege Bölgesi\'nin insanları oldukça sıcakkanlıdır.' }
    ]
  ],
  17: [
    [{ text: 'Hey, sana bir bilmecem var: "Daldan dala atlarım. Kuyruğumla sarkanım." Cevabı ne sence? "Uaa Uaa!" Tabi ki akrobat maymunlardan bahsedeceğiz.' }],
    [
      { text: 'Maymunların yaşayışlarıyla başlayalım. Bu hayvanların pek çok türü vardır. Örneğin; goril, orangutan, şempanze. ' },
      { text: 'Maymunlar genellikle ormanlarda yaşar.', bold: true },
      { text: ' ' },
      { text: 'Bazıları ise bozkırda ve çölde yaşayabilir.', bold: true },
      { text: ' ' },
      { text: 'Ağaçlık alanlar maymunlar için önemlidir. Çünkü maymunlar ağaçlara çok iyi tırmanır. Orada uyur ve yemeklerini yerler. Ağaçlar, onların evidir.', bold: true },
      { text: ' Aileleriyle aynı ağaçları paylaşır.' }
    ],
    [
      { text: 'Sence bir maymunun fiziksel özellikleri nasıldır? ' },
      { text: 'Maymunların kuyrukları upuzundur.', bold: true },
      { text: ' ' },
      { text: 'İki uzun bacağı vardır.', bold: true },
      { text: ' ' },
      { text: 'İki de uzun kolu vardır.', bold: true },
      { text: ' Bu canlılar, kuyruklarını da âdeta bir kol gibi kullanır. Bu sayede ağaçların üstünde dans eder gibi hareket eder. ' },
      { text: 'Hareketleri tıpkı bir akrobat gibidir!', bold: true }
    ],
    [
      { text: 'Peki, maymunlar nasıl beslenir? ' },
      { text: 'Maymunlar hem etçil hem otçul hayvanlardır.', bold: true },
      { text: ' Yani ' },
      { text: 'otçul beslenen maymunlar çiçek, meyve, yaprak yer.', bold: true },
      { text: ' ' },
      { text: 'Etçil beslenen maymunlar ise yılan ve yengeç yer.', bold: true },
      { text: ' Tabi ki de ' },
      { text: 'onların en sevdiği meyve muzdur!', bold: true }
    ],
    [
      { text: 'Şimdi de çoğalmalarından bahsedelim. ' },
      { text: 'Maymunlar doğurarak çoğalır.', bold: true },
      { text: ' ' },
      { text: 'Anne maymunlar ortalama 250 gün boyunca hamile kalır.', bold: true },
      { text: ' ' },
      { text: 'Bebek maymun doğduktan sonra anne maymun bebeğini emzirir ve korur.', bold: true }
    ],
    [
      { text: 'Sence maymunların çevreye ne gibi etkileri vardır? ' },
      { text: 'Maymunların doğaya ve insanlara birçok faydası vardır.', bold: true },
      { text: ' ' },
      { text: 'Onlar ormanda tohumları yayar.', bold: true },
      { text: ' Ayrıca ' },
      { text: 'onlar bazı böcekleri yer.', bold: true },
      { text: ' Bazen de ' },
      { text: 'ormanların akrobatları tarım alanlarına zarar verebilir.', bold: true },
      { text: ' ' },
      { text: 'Özellikle bazı meyve ağaçlarını tahrip eder.', bold: true },
      { text: ' Bazen ' },
      { text: 'buğday, arpa gibi bitkilere de zarar verirler.', bold: true },
      { text: ' Sence biz maymunları nerde görebiliriz?' }
    ]
  ],
  18: [
    [{ text: 'Merhaba dostum! Hiç hayal ettiğin bir oyuncağı anında gerçeğe dönüştürmek istedin mi? İşte bunun için sana harika bir cihaz: Üç boyutlu yazıcı! Hadi bu yazıcıları yakından tanıyalım.' }],
    [
      { text: 'Üç boyutlu yazıcılar farklı amaçlarla kullanılır. ' },
      { text: 'Eğlence için oyuncaklar, figürler ve oyun parçaları üretilebilir.', bold: true },
      { text: ' ' },
      { text: 'Sağlık alanında, kırık dişlerin yerine protezler hazırlanabilir.', bold: true },
      { text: ' ' },
      { text: 'Mimarlıkta, evlerin ve köprülerin küçük modelleri yapılabilir.', bold: true },
      { text: ' ' },
      { text: 'Eğitimde ise iskelet modelleri, deney malzemeleri gibi eşyalar yapılabilir.', bold: true }
    ],
    [
      { text: 'Peki, sen daha önce hiç üç boyutlu yazıcı gördün mü? ' },
      { text: 'Üç boyutlu yazıcılar genellikle dikdörtgen ya da kare şeklinde olur.', bold: true },
      { text: ' ' },
      { text: 'Küçük olanları bir masa üzerine sığabilirken, büyük olanlar için büyük odalar gereklidir.', bold: true }
    ],
    [
      { text: 'Peki, bu makine nasıl çalışır? ' },
      { text: 'Yapmak istediğin nesneyi bilgisayardan tasarla.', bold: true },
      { text: ' ' },
      { text: 'Yazıcıyı çalıştır.', bold: true },
      { text: ' Ardından ' },
      { text: 'tasarımı yazıcıya gönder. Tasarımın gerçeğe dönüşmesini bekle.', bold: true },
      { text: ' İşte bu kadar kolay! Ama unutma, yazıcı çalışırken dikkatli olunmalıdır. Ellerimizi hareketli parçalardan uzak tutmalıyız.' }
    ],
    [
      { text: 'Şimdi de üç boyutlu yazıcıların üretiminden bahsedelim. ' },
      { text: 'Üç boyutlu yazıcıların önce gövdesi üretilir.', bold: true },
      { text: ' ' },
      { text: 'Sonra motorlar, kablolar ve yazdırma kafası gibi parçalar eklenir.', bold: true },
      { text: ' ' },
      { text: 'Sonra test edilir.', bold: true },
      { text: ' ' },
      { text: 'Doğru çalışıyorsa paketlenip satışa sunulur.', bold: true }
    ],
    [
      { text: 'Üç boyutlu yazıcıların hayatımıza ne gibi etkileri olabilir? ' },
      { text: 'Geri dönüştürülebilir malzemeler kullanarak üretim yapar. Böylece doğa korunmuş olur.', bold: true },
      { text: ' Ancak ' },
      { text: 'üç boyutlu yazıcıyı dikkatli kullanmazsak aşırı ısınır ve yangına neden olabilir.', bold: true },
      { text: ' Üç boyutlu yazıcılar sayesinde hayallerimiz gerçekleşir! Peki, sen ne tasarlamak isterdin?' }
    ]
  ],
  19: [
    [{ text: 'Görürüz pazarda markette, yenir reçeli afiyetle! Elimize aldığımızda üzerinde bir sürü küçük delikleri vardır. Bahsettiğim bu meyve sana tanıdık geldi mi? Evet, doğru bildin. Çilek! Haydi, çilekleri yakından tanıyalım.' }],
    [
      { text: 'Çileğin yaşam koşulları nasıldır acaba? Çilek bitkisi, ' },
      { text: 'ülkemizde birçok yerde yetişmektedir. Ama en fazla Akdeniz bölgesinde yetişir.', bold: true },
      { text: ' ' },
      { text: 'İl olarak ise ilk sırada Mersin gelir.', bold: true },
      { text: ' ' },
      { text: 'Çilek güneşi sever ancak çok sıcaktan hoşlanmaz.', bold: true },
      { text: ' ' },
      { text: 'Nemli havalar yetişmesi için uygundur.', bold: true }
    ],
    [
      { text: 'Çilek, sanki bir kalbe benziyor değil mi? Çilekler, kırmızı ve parlak görünür. Üzerinde minik delikler bulunur. Bu deliklere aken denir. Çileğin tepesinde küçük, yeşil yapraklar bulunur. Bu meyveler ' },
      { text: 'nefis bir kokuya sahiptir.', bold: true },
      { text: ' Çileklerin; yumuşak, sulu ve lezzetli bir iç yapısı vardır.' }
    ],
    [
      { text: 'Şimdi de nasıl çoğaldığına bakalım. Çilekler, ilginç bir şekilde çoğalır. ' },
      { text: 'Çilekten bir parça alınır. Alınan bu parça toprağa gömülür.', bold: true },
      { text: ' ' },
      { text: 'Zamanla kök salan bu parça yeni çileklerin büyümesini sağlar.', bold: true },
      { text: ' Doğanın dışında evde de çilek yetiştirebilirsin. Nasıl mı? Biraz derin bir saksı seçmen gerekli. Saksıyı seçtikten sonra gübreli bir toprak bulup ve saksıya koymalısın. Ardından toprağa çilek tohumunu ekip üstüne biraz daha toprak eklemelisin. Son olarak haftada iki kez sulamayı unutma. Böylelikle küçük, tatlı çileklerin olacak.' }
    ],
    [
      { text: 'Çileğin ne gibi etkileri olduğunu biliyor musun? ' },
      { text: 'Çilek, kalp damar sağlığını destekler.', bold: true },
      { text: ' ' },
      { text: 'C vitamini bakımından zengindir.', bold: true },
      { text: ' Ayrıca ' },
      { text: 'kanser hücresinin oluşmasını önler.', bold: true },
      { text: ' Aman dikkat edelim, ' },
      { text: 'çok yersek karnımız ağrıyabilir.', bold: true },
      { text: ' Hatta ' },
      { text: 'çilek, bazı insanlar için alerjiye bile sebep olabilir.', bold: true }
    ]
  ],
  20: [
    [{ text: 'Hey! Kemerini sıkı bağla! Ülkemizin kuzeyine gidiyoruz. Burası çayın başkentidir. Denizi hırçın dalgalarıyla bilinir. Fındık diyarı ve yemyeşil güzellikleriyle dikkat çeker. Samsun\'dan Giresun\'a oradan Trabzon\'a ve Artvin\'e... Bugün Karadeniz Bölgesi\'ni keşfedeceğiz. Hazır mısın?' }],
    [
      { text: 'Bölgenin iklimiyle başlayalım. ' },
      { text: 'Bölge, Karadeniz iklimine sahiptir.', bold: true },
      { text: ' ' },
      { text: 'Her mevsim yağışlıdır. Bu nedenle bölge çok yeşildir.', bold: true },
      { text: ' ' },
      { text: 'Yazları serin kışları ise ılık geçer.', bold: true },
      { text: ' ' },
      { text: 'Çok yağış olduğu için sel ve heyelan gibi doğa olayları yaşanır.', bold: true }
    ],
    [{ text: 'Sırada bitki örtüsü var. Bölgenin bitki örtüsü ormandır. Karadeniz Bölgesi yemyeşil çam, kayın, gürgen ağaçlarıyla doludur. Bunun yanı sıra bölgede; fındık, mısır ve çay gibi tarım ürünleri de yetişir.' }],
    [
      { text: 'Karadeniz Bölgesi\'nin yeryüzü şekilleri çok ilginçtir. ' },
      { text: 'Bölge, dağlık ve engebeli bir araziye sahiptir.', bold: true },
      { text: ' Bu durum tarımda makine kullanımını engeller. ' },
      { text: 'Bölgenin kuzeyinde Karadeniz Dağları vardır. Güneyinde ise Kuzey Anadolu Dağları uzanır.', bold: true },
      { text: ' ' },
      { text: 'Bu dağlar arasında dar ve uzun vadiler bulunur. Bu vadilerde akarsular akar.', bold: true },
      { text: ' ' },
      { text: 'Şelaleler, yaylalar ve dereler Karadeniz\'i âdeta süsler.', bold: true },
      { text: ' Karadeniz hırçın deniziyle bilinir. Dalgalar insanlar için tehlikeli olabilir. Yüzerken çok dikkatli olmalısın.' }
    ],
    [
      { text: 'Şimdi de sırada ekonomik faaliyetler var. ' },
      { text: 'Karadeniz, tarım ve balıkçılıkla geçinir.', bold: true },
      { text: ' Özellikle ' },
      { text: 'çay ve fındık üretimi ülke ekonomisine katkı sağlar.', bold: true },
      { text: ' Ayrıca ' },
      { text: 'bu bölgemizde bakır ve altın gibi madenler çıkartılır.', bold: true },
      { text: ' Aynı zamanda ' },
      { text: 'turizm sektörü de bölgede önemli bir gelir kaynağıdır.', bold: true }
    ],
    [
      { text: 'Karadeniz\'in köyleri ve şehirleri sıcakkanlı insanlarla doludur. Burada ' },
      { text: 'genellikle dağınık yerleşmeler görülür.', bold: true },
      { text: ' ' },
      { text: 'Yaklaşık 8 milyon insan bu bölgede yaşar.', bold: true }
    ]
  ],
  21: [
    [{ text: 'Sekiz tane kolun olsaydı nasıl olurdu? Daha önce hiç sekiz kollu bir canlı gördün mü? Eğer görmediysen ahtapotlarla tanış! İşte şimdi ahtapotların gizemli dünyasına girme vakti.' }],
    [
      { text: 'Ahtapotların yaşayışlarıyla başlayalım. ' },
      { text: 'Ahtapotlar tuzlu sularda, yani okyanus ve denizlerde yaşarlar.', bold: true },
      { text: ' Genellikle ' },
      { text: 'sıcak ve ılıman denizleri severler.', bold: true },
      { text: ' ' },
      { text: 'Derin suları tercih eder.', bold: true }
    ],
    [
      { text: 'Ahtapotlar hızlı büyür.', bold: true },
      { text: ' Ancak yaşam süreleri kısadır. ' },
      { text: 'Bir ahtapot yaklaşık üç yıl yaşar.', bold: true },
      { text: ' ' },
      { text: 'Ahtapotlar oldukça akıllıdır. Avcılarından çok iyi saklanır.', bold: true },
      { text: ' Kendilerini korumak için düşmanlarına zehirli bir mürekkep fırlatır.' }
    ],
    [
      { text: 'Ahtapotların nasıl göründüklerini merak ettin mi? ' },
      { text: 'Ahtapotların sekiz kolu vardır.', bold: true },
      { text: ' ' },
      { text: 'Bir ahtapotun yumuşacık bir gövdesi olur.', bold: true },
      { text: ' ' },
      { text: 'Kocaman iki gözü vardır.', bold: true },
      { text: ' Bu canlılar etrafı çok iyi görür. ' },
      { text: 'Ağzı, kollarının ortasında yer alır.', bold: true },
      { text: ' Ayrıca ' },
      { text: 'ahtapotlar oldukça esnektir.', bold: true },
      { text: ' Sana çok gizemli bir bilgi vereyim: ' },
      { text: 'Onlar renk değiştirebilir!', bold: true }
    ],
    [
      { text: 'Haydi, şimdi de nasıl beslendiklerini öğrenelim. Ahtapotlar, lezzetli yemekleri bulmak için derin sularda dolaşır. ' },
      { text: 'Bu canlılar, küçük balıklar ve karideslerle beslenir.', bold: true },
      { text: ' ' },
      { text: 'En sevdiği yemek, deniztarağı ve deniz salyangozudur.', bold: true }
    ],
    [
      { text: 'Sıradaysa nasıl çoğaldıkları var. ' },
      { text: 'Ahtapotlar yumurtlayarak çoğalır.', bold: true },
      { text: ' Anne ahtapot, yumurtlamak için uygun bir alan seçer. ' },
      { text: 'Anne ahtapot yumurtladıktan sonra ölür.', bold: true }
    ],
    [
      { text: 'Ahtapotların çevreye etkilerine bakalım. ' },
      { text: 'Ahtapotlar, ekosisteme katkı sağlar.', bold: true },
      { text: ' ' },
      { text: 'Onların besin değeri yüksektir. Bu nedenle insanlar, ahtapotları güçlenmek için yiyebilir.', bold: true },
      { text: ' Biliyor musun, tüm ahtapotlar zehirlidir. Ancak bazı zehirler ölümcüldür. Örneğin mavi ahtapotlar ölümcül zehir taşır. ' },
      { text: 'İnsanlar zehirli olanı yerse ölebilir.', bold: true },
      { text: ' Okyanusların en zeki hayvanını öğrendik. Onları sevdin mi?' }
    ]
  ],
  22: [
    [{ text: 'Merhaba meraklı dostum! Senin hiç tabletin oldu mu? Tabletler gerçekten süper cihazlardır. Hazır ol! Şimdi seni tabletlerin dünyasına götüreceğim.' }],
    [
      { text: 'Tabletlerin kullanım amaçlarıyla başlayalım. ' },
      { text: 'Tabletler, bilgisayarların küçültülmüş hâli gibidir.', bold: true },
      { text: ' ' },
      { text: 'Bu cihazla internete girersin, fotoğraf veya video çekersin.', bold: true },
      { text: ' ' },
      { text: 'Müzik dinlersin.', bold: true },
      { text: ' ' },
      { text: 'Araştırma yaparsın.', bold: true },
      { text: ' ' },
      { text: 'Oyun oynarsın. Hatta bir oyun bile tasarlarsın.', bold: true },
      { text: ' ' },
      { text: 'Ödevini yapmak için de tableti kullanırsın.', bold: true },
      { text: ' Acaba başka hangi amaçlar için kullanılır düşün bakalım.' }
    ],
    [
      { text: 'Haydi, tabletlerin görünümüne bakalım. ' },
      { text: 'Tabletler, ince ve dikdörtgen şeklinde, ön yüzü tamamen dokunmatik ekrandan oluşan taşınabilir bilgisayarlardır.', bold: true },
      { text: ' Genellikle hafif oldukları için elde tutulabilir. ' },
      { text: 'Kenarlarında ses tuşları, açma-kapama düğmesi ve şarj girişi bulunur.', bold: true },
      { text: ' ' },
      { text: 'Arka yüzlerinde ise bazen kamera ve marka logosu yer alır.', bold: true },
      { text: ' ' },
      { text: 'Bazı modellerde ön tarafta da kamera bulunur.', bold: true },
      { text: ' Ekran boyutları modeline göre değişir ancak hepsi parlak ve renkli görüntüler sunar.' }
    ],
    [
      { text: 'Sırada nasıl çalıştığı var. ' },
      { text: 'Tabletler bataryayla çalışır.', bold: true },
      { text: ' ' },
      { text: 'Batarya bittikçe tablet şarja takılır.', bold: true },
      { text: ' E tabi ki, ' },
      { text: 'şarja takmak için elektrik enerjisi kullanılır.', bold: true },
      { text: ' ' },
      { text: 'Bu cihazlar dokunmatik olur.', bold: true },
      { text: ' ' },
      { text: 'Özel bir kalem veya klavyeyle de kullanılabilir.', bold: true }
    ],
    [
      { text: 'Şimdi de nasıl üretildiğine bakalım. ' },
      { text: 'Tabletler, fabrikada üretilir.', bold: true },
      { text: ' ' },
      { text: 'İlk olarak tasarım aşaması vardır.', bold: true },
      { text: ' ' },
      { text: 'Sonra tasarlananları birleştirme gelir. En son performans testi yapılır.', bold: true },
      { text: ' Böylelikle bir tablet ortaya çıkar.' }
    ],
    [
      { text: 'Acaba tabletler hayatımızı nasıl etkiler? ' },
      { text: 'Tabletler, hem öğrenmemizi hem eğlenmemizi sağlar.', bold: true },
      { text: ' Hayatımızı kolaylaştırır. ' },
      { text: 'Ancak uzun süre kullanırsak gözlerimiz bozulabilir.', bold: true },
      { text: ' Ayrıca ' },
      { text: 'çok fazla vakit kaybına yol açabilir.', bold: true },
      { text: ' Bu nedenle tabletleri dikkatli ve kontrollü kullanmak önemlidir.' }
    ]
  ],
  23: [
    [{ text: 'Hey, sana bir bilmecem var: "Yeşil sandığı açtım. Siyah boncuğu saçtım." Cevabı biliyor musun? Yazları yenilen bir meyve desem? Hani siyah çekirdekleri olan bir meyve! Bilmecemizin cevabı karpuz. Haydi, karpuz bitkisini tanımaya başlayalım.' }],
    [
      { text: 'Öncelikle yaşam koşullarına bakalım. ' },
      { text: 'Karpuz, dünyada en çok Çin\'de yetişir.', bold: true },
      { text: ' ' },
      { text: 'Ülkemizde ise birçok bölgede yetişir. Özellikle de Adana ilimiz karpuzuyla meşhurdur.', bold: true },
      { text: ' ' },
      { text: 'Karpuz, toprağın üzerinde yayılarak büyür.', bold: true },
      { text: ' ' },
      { text: 'Kökleri toprak altında derinlere uzanır.', bold: true },
      { text: ' ' },
      { text: 'Bu meyve, sıcak iklimi ve suyu çok sever.', bold: true }
    ],
    [
      { text: 'Şimdi de fiziksel özelliklerine bakalım. ' },
      { text: 'Karpuz bitkisi, sarmaşık benzeri bir bitkidir.', bold: true },
      { text: ' ' },
      { text: 'Geniş yaprakları vardır ve sarı renkte çiçekler açar. Çiçekten sonra minik karpuzlar oluşur.', bold: true },
      { text: ' Zamanla büyüyüp olgunlaşarak kocaman bir lezzet topuna dönüşür. ' },
      { text: 'Karpuz oval ya da yuvarlak bir şekildedir.', bold: true },
      { text: ' ' },
      { text: 'Bir karpuz; kabuk, meyve ve çekirdekten oluşur.', bold: true },
      { text: ' ' },
      { text: 'Karpuzun dış kabuğu yeşil renktedir.', bold: true },
      { text: ' ' },
      { text: 'Kabuğunda sarımsı çizgileri olabilir.', bold: true },
      { text: ' ' },
      { text: 'İç kısmı ise kıpkırmızıdır.', bold: true },
      { text: ' İçi âdeta lezzetli bir sudur. Aman yerken dikkat edin çekirdekler boğazınıza kaçmasın!' }
    ],
    [
      { text: 'Çekirdek demişken haydi gel, çoğalmalarına bakalım. ' },
      { text: 'Karpuz, çekirdeklerinin ekilmesiyle çoğalır.', bold: true },
      { text: ' ' },
      { text: 'Ekim ilkbaharda yapılır.', bold: true },
      { text: ' ' },
      { text: 'Hem tarlada hem de evde karpuz yetiştirebilirsin. Yeter ki onu 10 günde bir sula. Tabi ki, bir de bol bol güneş görmesini sağlamalısın.', bold: true }
    ],
    [
      { text: 'Karpuzun etkilerine bakalım. Bu lezzetli suyun faydaları saymakla bitmez. ' },
      { text: 'Karpuz bağırsaklarımızın iyi çalışmasını sağlar.', bold: true },
      { text: ' ' },
      { text: 'Böbreklerimizin dostudur.', bold: true },
      { text: ' ' },
      { text: 'Kalp sağlığımız için iyi bir besindir.', bold: true },
      { text: ' ' },
      { text: 'Birçok vitamin içerir.', bold: true },
      { text: ' Ayrıca ' },
      { text: 'cildi de nemlendirir.', bold: true },
      { text: ' ' },
      { text: 'Ancak onu fazla tüketirsen karnın ağrıyabilir.', bold: true }
    ]
  ],
  24: [
    [{ text: 'Daha önce hiç Güneydoğu Anadolu Bölgesi\'ni duymuş muydun? Peki ya kebap, lahmacun ve baklava desem? Saydığımız leziz yiyecekler işte bu bölgeye ait. Şimdi birlikte lezzet diyarı Güneydoğu Anadolu\'yu keşfedelim!' }],
    [
      { text: 'Öncelikle bu bölgenin iklimine bakalım. ' },
      { text: 'Bu bölgede karasal iklim görülür.', bold: true },
      { text: ' ' },
      { text: 'Yazlar oldukça kurak ve sıcaktır.', bold: true },
      { text: ' Hatta sıcaklık 45 dereceyi bile geçer. ' },
      { text: 'Kışları ise ılıktır.', bold: true },
      { text: ' ' },
      { text: 'Yağışlar çok azdır.', bold: true },
      { text: ' ' },
      { text: 'Bölgede görülen doğal afet ise depremdir.', bold: true },
      { text: ' Deprem, yeryüzünün sarsılmasıdır. ' },
      { text: 'Bölgede ormanlar çok az olduğu için heyelan yani toprak kayması da çok görülür.', bold: true }
    ],
    [
      { text: 'Sırada bölgenin bitki örtüsü var. ' },
      { text: 'Bitki örtüsü bozkırdır.', bold: true },
      { text: ' Bozkırlar kurak otlardan oluşan alanlara denir. ' },
      { text: 'Ülkemizde en az orman burada görülür.', bold: true },
      { text: ' ' },
      { text: 'Bölgenin en ünlü tarım ürünü Antep fıstığıdır.', bold: true },
      { text: ' Ayrıca ' },
      { text: 'zeytin, incir, kırmızı mercimek ve karpuz da yetişir.', bold: true }
    ],
    [
      { text: 'Güneydoğu Anadolu\'nun yeryüzü şekillerine bakalım mı? ' },
      { text: 'Bölgenin yükseltisi azdır.', bold: true },
      { text: ' ' },
      { text: 'Bazı yerlerinde dağlar görülür.', bold: true },
      { text: ' ' },
      { text: 'Bölgede verimli ovalar da bulunur.', bold: true },
      { text: ' Bu ovalarda birçok bitki yetişir. ' },
      { text: 'Fırat ve Dicle adlı iki akarsu da bu bölgeden geçer.', bold: true }
    ],
    [
      { text: 'Şimdi sırada bu bölgenin ekonomik faaliyetleri var. ' },
      { text: 'Buradaki insanlar gelirini genellikle tarımdan sağlar.', bold: true },
      { text: ' ' },
      { text: 'Bununla birlikte sanayi ve turizmden de gelir elde edilir.', bold: true },
      { text: ' Bölgenin önemli bir özelliği daha var. ' },
      { text: 'Güneydoğu Anadolu, ülkemizde petrolün çıkarıldığı tek bölgedir.', bold: true },
      { text: ' Bu durum ekonomiye katkı sağlar.' }
    ],
    [
      { text: 'Güneydoğu Anadolu\'da ' },
      { text: 'nüfus genellikle şehirlerde yoğunlaşmıştır; Gaziantep, Şanlıurfa ve Diyarbakır gibi büyük şehirler kalabalıktır.', bold: true },
      { text: ' ' },
      { text: 'Köylerde ise nüfus daha azdır ve yerleşmeler toplu köy tipi şeklindedir.', bold: true },
      { text: ' ' },
      { text: 'İnsanlar, su kaynaklarına yakın, tarıma elverişli ovalar ve akarsu kenarlarında yaşamayı tercih eder.', bold: true }
    ]
  ]
};
