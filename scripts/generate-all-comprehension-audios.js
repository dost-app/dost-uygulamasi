import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateQuestionAudios } from './generate-comprehension-question-audios.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Tüm 11 hikayenin soruları
const ALL_QUESTIONS = {
  1: [ // Kırıntıların Kahramanları (Karıncalar)
    {
      question: 'Karıncalar genellikle nerede yuva yaparlar?',
      options: ['Sadece ağaç gövdelerinde', 'Yalnızca çatılarda', 'Mutfak, toprak altı, taş altı gibi yerlerde', 'Sadece su kenarlarında'],
      correctIndex: 2
    },
    {
      question: 'Karıncaların vücut yapısı ile ilgili aşağıdakilerden hangisi yanlıştır?',
      options: ['Genellikle mavi renktedir', 'İki anteni vardır', 'Altı ayağı vardır', 'Bazılarının kanatları vardır'],
      correctIndex: 0
    },
    {
      question: 'Karıncalar en çok ne tür yiyeceklerden hoşlanır?',
      options: ['Tuzlu yiyecekler', 'Şekerli yiyecekler', 'Yağlı yiyecekler', 'Ekşi yiyecekler'],
      correctIndex: 1
    },
    {
      question: 'Karıncalar nasıl çoğalır?',
      options: ['Yumurtlayarak', 'Doğurarak', 'Tomurcuklanarak', 'Bölünerek'],
      correctIndex: 0
    },
    {
      question: 'Karıncaların doğaya faydaları arasında aşağıdakilerden hangisi yer almaz?',
      options: ['Toprağı havalandırır', 'Tohumları dağıtır', 'Zararlı böcekleri yer', 'Ağaçları kemirir'],
      correctIndex: 3
    },
    {
      question: 'Karıncaların çok çalışkan ve iş birliği yapan canlılar olması, onların hangi özelliği ile daha çok ilişkilidir?',
      options: ['Yuvalarının küçük olması', 'Sosyal bir yaşam sürmeleri', 'Kanatlı olmaları', 'Renklerinin koyu olması'],
      correctIndex: 1
    },
    {
      question: 'Metne göre, karıncaların insanları ısırması ve hastalık yayabilmesi, onlarla ilgili hangi genellemeyi yapmamızı sağlar?',
      options: ['Tamamen zararsızdırlar', 'Sadece faydalı canlılardır', 'Bazen insanlarla sorun yaratabilirler', 'Hiçbir zaman eve girmezler'],
      correctIndex: 2
    }
  ],
  2: [ // Avucumun İçindeki Akıllı Kutu (Akıllı Telefonlar)
    {
      question: 'Akıllı telefonların kullanım alanlarına bakıldığında, metne göre bu cihazların en belirgin ortak özelliği hangisidir?',
      options: ['Birçok işlevi tek cihazda toplaması', 'Görüntülü görüşmeye odaklanması', 'Bilgiyi tek yönde iletmesi', 'Yalnızca acil durumlarda kullanılması'],
      correctIndex: 0
    },
    {
      question: 'Akıllı telefonların fiziksel özellikleriyle ilgili verilen bilgilerden hangisi doğrudur?',
      options: ['Genellikle kare şeklindedirler', 'Sadece ön kameraları bulunur', 'Çok ağır ve taşınması zordur', 'Bazı modelleri kağıt gibi katlanabilir özelliktedir'],
      correctIndex: 3
    },
    {
      question: 'Akıllı telefonların çalışma prensibiyle ilgili aşağıdaki sıralamalardan hangisi doğrudur?',
      options: ['Sinyali iletir -> İşler -> Sinyali alır', 'Sinyali alır -> İşler -> İletir', 'Sinyali işler -> Sinyali iletir -> Enerji üretir', 'Enerji üretir -> Sinyali alır -> İşler'],
      correctIndex: 1
    },
    {
      question: 'Metinde akıllı telefonların üretim sürecindeki parçaların birleştirilmesi neye benzetilmiştir?',
      options: ['Yapboz yapmaya', 'Resim çizmeye', 'Legoları birleştirmeye', 'İnşaat yapmaya'],
      correctIndex: 2
    },
    {
      question: 'Akıllı telefonların insan sağlığına olası zararı metinde nasıl ifade edilmiştir?',
      options: ['Yüksek ses kulaklara zarar verebilir', 'Aşırı kullanımda göz sağlığı etkilenebilir', 'Radyasyon yayarak baş ağrısı yapabilir', 'Parmak kaslarını zayıflatabilir'],
      correctIndex: 1
    },
    {
      question: 'Metnin başlığında ve içeriğinde telefon için "Akıllı Kutu" ifadesinin kullanılmasının temel sebebi ne olabilir?',
      options: ['Şeklinin sadece kutuya benzemesi', 'İçinde yapay zeka bulunması', 'Birçok farklı işlevi (iletişim, eğlence, bilgi) tek bir cihazda toplaması', 'Sadece akıllı insanların kullanabilmesi'],
      correctIndex: 2
    },
    {
      question: 'Metinde geçen "film bile çekebilirsin" ifadesinden yola çıkarak akıllı telefon teknolojisi hakkında nasıl bir yorum yapılabilir?',
      options: ['Telefonların kameralarının profesyonel kameralara yaklaştığı', 'Telefonların sadece film izlemek için tasarlandığı', 'Telefon hafızalarının çok çabuk dolduğu', 'Film çekmenin çok zor bir işlem olduğu'],
      correctIndex: 0
    }
  ],
  3: [ // Çöl Şekerlemesi (Hurma)
    {
      question: 'Hurma ağaçları için en uygun yetişme ortamı hangisidir?',
      options: ['Ilıman orman içleri', 'Çöl ve çok sıcak iklimler', 'Sürekli soğuk bölgeler', 'Dağ etekleri'],
      correctIndex: 1
    },
    {
      question: 'Metne göre hurma ağacının görünümü nasıldır?',
      options: ['Kısa ve dallı gövde', 'Çalı formunda, yer seviyesinde', 'Uzun gövdeli, palmiye benzeri yapı', 'Yere yayılan sarmaşık'],
      correctIndex: 2
    },
    {
      question: 'Hurma ağacı çoğaltılırken hangi yöntemler kullanılabilir?',
      options: ['Sadece yaprakla çoğaltma', 'Yalnızca aşılama', 'Tohumla çoğaltma dışında yöntem yoktur', 'Çekirdeklerinin ekilmesi ya da gövdeden çıkan filizlerin dikilmesi'],
      correctIndex: 3
    },
    {
      question: 'Metne göre hurma yaprağının insan sağlığına ne gibi bir faydası vardır?',
      options: ['Ağızda çiğnendiğinde diş sağlığını koruması', 'Sindirimi hızlandırması', 'Kansere karşı koruması', 'Ateşi düşürmesi'],
      correctIndex: 0
    },
    {
      question: 'Metne göre hurma meyvesinin aşırı tüketimi hangi olumsuz etkiyi verebilir?',
      options: ['Ciddi görme sorunları', 'Baş ağrısı', 'Deride soyulma', 'Kalp ritim bozukluğu'],
      correctIndex: 1
    },
    {
      question: '"Çöl şekerlemesi" ifadesi hurmayı tanımlarken hangi iki özelliğine vurgu yapar?',
      options: ['Şekli ve boyutu', 'Rengi ve kokusu', 'Yetiştiği yer ve tadı', 'Fiyatı ve bulunurluğu'],
      correctIndex: 2
    },
    {
      question: 'Metinde hurmanın Ramazan Ayı\'nda sık tüketildiği ifade edilmektedir. Bunun sebebi ne olabilir?',
      options: ['Besin değerlerinin yüksek olması ve uzun süre tok tutması', 'Pişirilmeden tüketilebilmesi', 'Sadece sıcak iklimlerde yetişmesi', 'Diğer meyvelerden daha ucuz olması'],
      correctIndex: 0
    }
  ],
  4: [ // Turizmin İncisi (Akdeniz Bölgesi)
    {
      question: 'Metne göre Akdeniz Bölgesi\'nin iklim özellikleri aşağıdakilerden hangisinde doğru verilmiştir?',
      options: ['Yazları yağışlı, kışları çok soğuktur', 'Her mevsim yağışlı ve ılıktır', 'Yazları sıcak ve kurak, kışları ılık ve yağışlıdır', 'Kışları karlı ve don olayları çok sıktır'],
      correctIndex: 2
    },
    {
      question: 'Akdeniz Bölgesi\'nin bitki örtüsü olan "maki" ile ilgili verilen bilgilerden hangisi doğrudur?',
      options: ['Yüksek ve gür ormanlardan oluşur', 'Kısa boylu ağaçlar ve çalılardır', 'Sadece otlardan oluşan bozkırlardır', 'Yapraklarını döken geniş ağaçlardır'],
      correctIndex: 1
    },
    {
      question: 'Bölgenin yeryüzü şekilleri ve bunun yerleşime etkisi nasıldır?',
      options: ['Arazi dağlık ve engebeli olduğu için dağınık yerleşim görülür', 'Arazi çok düz olduğu için herkes bir arada yaşar', 'Sadece ovalardan oluştuğu için yerleşim çok kolaydır', 'Yerleşim yerleri sadece deniz kenarında toplanmıştır'],
      correctIndex: 0
    },
    {
      question: 'Akdeniz Bölgesi\'nin temel geçim kaynakları metinde hangileri olarak belirtilmiştir?',
      options: ['Madencilik ve ormancılık', 'Balıkçılık ve sanayi', 'Hayvancılık ve enerji üretimi', 'Tarım ve turizm'],
      correctIndex: 3
    },
    {
      question: 'Bölgedeki nüfus ve yaşam alanları ile ilgili hangisi söylenebilir?',
      options: ['İnsanların çoğu köylerde yaşamaktadır', 'Nüfusun tamamı tarımla uğraşır', 'İnsanların çoğunluğu kentlerde (şehirlerde) yaşamaktadır', 'Bölge Türkiye\'nin en tenha yeridir'],
      correctIndex: 2
    },
    {
      question: 'Bölge ekonomisinin "deniz, güneş ve doğal güzelliklere" dayalı turizmden büyük gelir elde etmesi, bölge ekonomisinin yapısı hakkında bize ne söyler?',
      options: ['Bölge ekonomisi tamamen fabrikalara ve sanayiye bağlıdır', 'Bölge ekonomisi, doğal çevreye ve iklim şartlarının korunmasına doğrudan bağımlıdır', 'Turizm geliri tarım gelirinden daha azdır', 'Bölge halkı sadece yazın çalışmaktadır'],
      correctIndex: 1
    },
    {
      question: 'Akdeniz Bölgesi için "Turizmin İncisi" denilmesinin temel sebebi metne göre ne olabilir?',
      options: ['Denizin ılık, temiz olması ve doğal güzelliklerin bulunması', 'Bölgede çok fazla fabrika bulunması', 'Nüfusun çok kalabalık olması', 'Topraklarının kırmızı renkli olması'],
      correctIndex: 0
    }
  ],
  5: [ // Çöl Gemisi (Develer)
    {
      question: 'Kendini tehlikede hisseden bir deve korunmak için ne yapabilir?',
      options: ['Karşısındakine tükürebilir', 'Hızlıca koşup kaçabilir', 'Kuma saklanabilir', 'Yüksek sesle bağırabilir'],
      correctIndex: 0
    },
    {
      question: 'Develerin hörgüçlerinin işlevi nedir?',
      options: ['Yalnızca süs amaçlıdır', 'Yiyecek depolamak ve uzun süre aç kalmalarını sağlamak', 'Su depolamak', 'Diğer develerle iletişim kurmak'],
      correctIndex: 1
    },
    {
      question: 'Develer ne tür besinlerle beslenir?',
      options: ['Yalnızca et', 'Hem et hem ot', 'Otçuldur; yaprak, meyve, dikenli bitkiler yer', 'Sadece tahıl'],
      correctIndex: 2
    },
    {
      question: 'Develer nasıl çoğalır?',
      options: ['Yumurtlayarak', 'Doğurarak', 'Bölünerek', 'Tomurcuklanarak'],
      correctIndex: 1
    },
    {
      question: 'Aşağıdakilerden hangisi develerin insanlara sağladığı yarardan değildir?',
      options: ['Ulaşım sağlama', 'Yün, süt ve etinden faydalanma', 'Eşya taşıma', 'Derisinden yazlık giysiler yapılması'],
      correctIndex: 3
    },
    {
      question: 'Devenin uzun kirpiklerinin kum fırtınalarından gözlerini koruması, onun hangi özelliğini gösterir?',
      options: ['Çevreye uyum sağlamıştır', 'Görme yeteneği zayıftır', 'Kirpikleri gereksiz uzundur', 'Güzel görünmesini sağlar'],
      correctIndex: 0
    },
    {
      question: 'Develerin tek seferde 80-90 litre su içebilmesi, hangi ortamda yaşadıklarını düşündürür?',
      options: ['Nemli orman', 'Soğuk tundra', 'Kurak çöl', 'Yağmurlu ova'],
      correctIndex: 2
    }
  ],
  6: [ // Hayal Gibi Gerçek (Sanal Gerçeklik Gözlükleri)
    {
      question: 'Sanal gerçeklik gözlüklerinin kullanım alanları olarak metinde hangisinden bahsedilmemiştir?',
      options: ['Spor müsabakaları', 'Eğitim', 'Sağlık', 'Eğlence'],
      correctIndex: 0
    },
    {
      question: 'Sanal gerçeklik gözlüklerinin fiziksel görünümü metinde nasıl tarif edilmiştir?',
      options: ['Şeffaf, güneş gözlüğüne benzeyen küçük bir yapıdadır', 'Kutuya benzeyen, gözleri tamamen kapatan büyük bir gözlüktür', 'Tek gözle kullanılan korsan dürbünü gibidir', 'Sadece kulaklık kısmı olan bir kaska benzer'],
      correctIndex: 1
    },
    {
      question: 'Sanal gerçeklik kumandaları kullanıcının ne yapmasını sağlar?',
      options: ['Başını sağa sola çevirmesini', 'Gözlükteki ekranı kapatmasını', 'Gerçek dünyadaki eşyaları boyamasını', 'Sanal dünyadaki eşyaları tutup hareket ettirmesini'],
      correctIndex: 3
    },
    {
      question: 'Sanal gerçeklik gözlüklerinin üretiminde ilk olarak hangi parçalar üretilir?',
      options: ['Dış çerçeveler', 'Sensörler ve ekranlar', 'Lastikli bantlar', 'Kulaklıklar'],
      correctIndex: 1
    },
    {
      question: 'Sanal gerçeklik gözlüklerinin olası olumsuz etkisi aşağıdakilerden hangisidir?',
      options: ['Çok vakit geçirilirse gözler bozulabilir', 'Baş dönmesi ve mide bulantısı yapabilir', 'Gerçeklik algısını tamamen kaybettirebilir', 'Kulaklarda işitme kaybına yol açabilir'],
      correctIndex: 0
    },
    {
      question: '"Doktorlar bu gözlükleri zor ameliyatlarda yardımcı bir doktor gibi kullanır" cümlesinden aşağıdakilerden hangisi çıkarılabilir?',
      options: ['Gözlükler ameliyatı tek başına yapabilir', 'Gözlükler, ameliyatlarda doktorlara ek bir destek sağlar', 'Doktorların gözleri iyi görmediği için bu gözlükleri takarlar', 'Ameliyat sırasında hastaların film izlemesini sağlarlar'],
      correctIndex: 1
    },
    {
      question: 'Metinde geçen "sana bir gerçeği anlatmam lazım ama bildiğin gerçeklerden değil" ifadesiyle anlatılmak istenen nedir?',
      options: ['Yazarın yalan söylediği', 'Bahsedilen konunun bir masal olduğu', 'Fiziksel dünyadan farklı, dijital olarak oluşturulmuş bir deneyim olduğu', 'Bu teknolojinin henüz icat edilmediği'],
      correctIndex: 2
    }
  ],
  7: [ // Kaktüslerin Dikenli Yaşamı (Kaktüsler)
    {
      question: 'Kaktüslerin en yaygın görüldüğü bölgeler nelerdir?',
      options: ['Kutup bölgeleri', 'Afrika ve Güney Amerika gibi sıcak, kurak bölgeler', 'Nemli orman altı', 'Alpin çayırlar'],
      correctIndex: 1
    },
    {
      question: 'Kaktüslerin fiziksel özellikleri il ilgili aşağıdakilerden hangisi doğrudur?',
      options: ['Uzun sarmaşık yapısı', 'Yaprak dökme yapısı', 'Gövde üzerinde geniş yaprak demetine sahip olmaları', 'Dikenlerin bulunması'],
      correctIndex: 3
    },
    {
      question: 'Kaktüslerin çoğalma yollarından biri hangisidir?',
      options: ['Parçalarının toprağa ekilmesiyle veya tohumla', 'Sadece rüzgârla dağılmasıyla', 'Suda sürgün vererek', 'Hücre bölünmesiyle'],
      correctIndex: 0
    },
    {
      question: 'Kaktüslerin çevreye faydaları arasında aşağıdakilerden hangisi yer almaz?',
      options: ['Hayvanlar için barınak olma', 'Toprağı koruma', 'Orman yangınlarını söndürme', 'Hayvanlar için yiyecek ve su kaynağı olma'],
      correctIndex: 2
    },
    {
      question: 'Metne göre kaktüslerin insanlara ya da çevreye zarar verebilecek özelliği nedir?',
      options: ['Kokusu insan sağlığını bozar', 'Dikenlerinin cilde batmasıyla yaralanma riski', 'Aşırı su tüketimine neden olur', 'Çok zehirli meyveleri vardır'],
      correctIndex: 1
    },
    {
      question: 'Kaktüs köklerinin çok uzun olmasının en mantıklı gerekçesi ne olabilir?',
      options: ['Gövdeyi çevresel etkilere karşı dengelemek', 'Diken üretimini artırmak', 'Diğer bitkilerle rekabeti artırmak', 'Topraktaki derin su kaynaklarına erişmek'],
      correctIndex: 3
    },
    {
      question: 'Kaktüslerin çok çeşitli renklerde olabilmesi, onların hangi özelliği ile ilgili olabilir?',
      options: ['Tür çeşitliliği', 'Hepsinin aynı olduğunu', 'Sadece yeşil renkte olduklarını', 'Renklerinin hayvanları korkuttuğunu'],
      correctIndex: 0
    }
  ],
  8: [ // Dağların Diyarı (Doğu Anadolu Bölgesi)
    {
      question: 'Doğu Anadolu Bölgesi\'nin iklimiyle ilgili aşağıdakilerden hangisi yanlıştır?',
      options: ['Kışlar soğuk ve uzun geçer', 'Yazlar kısa ve serindir', 'Kış aylarında bolca kar yağar', 'Hiçbir zaman don olayı görülmez'],
      correctIndex: 3
    },
    {
      question: 'Bölgenin bitki örtüsü metinde nasıl tanımlanmıştır?',
      options: ['Bozkır', 'Maki', 'Gür ormanlar', 'Sazlıklar'],
      correctIndex: 0
    },
    {
      question: 'Doğu Anadolu Bölgesi\'nin yeryüzü şekilleri hakkında hangisi söylenebilir?',
      options: ['Yükseltisi az ve dümdüzdür', 'Yükseltisi fazladır ve dağlar geniş yer kaplar', 'Sadece geniş ovalardan oluşur', 'Deniz seviyesindedir'],
      correctIndex: 1
    },
    {
      question: 'Bölgede yapılan ekonomik faaliyetler ve çıkarılan madenler hangisinde doğru eşleşmiştir?',
      options: ['Turizm - Petrol', 'Balıkçılık - Altın', 'Tarım/Hayvancılık - Bakır, Bor, Kurşun', 'Sanayi - Demir'],
      correctIndex: 2
    },
    {
      question: 'Metinde bölgenin nüfusuyla ilgili hangi bilgi yer almaktadır?',
      options: ['En kalabalık bölgemizdir', 'Kentlerde yaşayan insan sayısı daha fazladır', 'En az insan yaşayan bölgemizdir', 'Nüfus kıyılarda toplanmıştır'],
      correctIndex: 2
    },
    {
      question: 'Metinde bahsedilen "çığ" felaketinin bu bölgede sık görülmesinin temel nedenleri ne olabilir?',
      options: ['Yazların sıcak geçmesi ve kuraklık', 'Arazinin düz olması ve yağmur yağması', 'Bitki örtüsünün bozkır olması', 'Yüksek dağların olması ve yoğun kar yağışı'],
      correctIndex: 3
    },
    {
      question: 'Metinde yüksek yerlerde "çayır" denilen uzun boylu yeşil otların olduğu belirtilmiştir. Bu durum bölgede hangi ekonomik faaliyetin gelişmesini sağlamış olabilir?',
      options: ['Büyükbaş hayvancılık (İnek vb. hayvan yetiştiriciliği)', 'Balıkçılık', 'Ormancılık', 'Tavukçuluk'],
      correctIndex: 0
    }
  ],
  9: [ // Fındık Canavarları (Sincaplar)
    {
      question: 'Sincaplar nerede yaşar?',
      options: ['Su altında', 'Çöllerde', 'Ağaçlarda', 'Mağaralarda'],
      correctIndex: 2
    },
    {
      question: 'Sincapların kuyruğunun işlevi nedir?',
      options: ['Yalnızca süs', 'Saldırı silahı', 'Isınmak', 'Dengede kalmalarını sağlamak'],
      correctIndex: 3
    },
    {
      question: 'Sincaplar en çok ne yemeyi sever?',
      options: ['Fındık, fıstık, palamut gibi yemişler', 'Balık', 'Et', 'Ağaç kabuğu'],
      correctIndex: 0
    },
    {
      question: 'Sincaplar nasıl çoğalır?',
      options: ['Yumurtlayarak', 'Doğurarak', 'Bölünerek', 'Sporla'],
      correctIndex: 1
    },
    {
      question: 'Sincapların doğaya en önemli katkısı nedir?',
      options: ['Unuttukları tohumlar yeni ağaçlara dönüşür', 'Ağaçları kemirir', 'Kuşları kovalar', 'Toprağı kazarlar'],
      correctIndex: 0
    },
    {
      question: 'Sincapların yiyeceklerini toprak altına veya ağaç kovuklarına saklaması, hangi mevsim için hazırlık olabilir?',
      options: ['Yaz', 'Sonbahar', 'Kış', 'İlkbahar'],
      correctIndex: 2
    },
    {
      question: 'Sincapların keskin dişleri ve harika gören gözleri, onların hangi konuda usta olduklarını gösterir?',
      options: ['Yuva yapmak', 'Besin bulmak ve işlemek', 'Düşmanlardan kaçmak', 'Yüzmek'],
      correctIndex: 1
    }
  ],
  10: [ // Kolumuzdaki Süper Kahraman (Akıllı Saatler)
    {
      question: 'Metne göre akıllı saatler aşağıdakilerden hangisini yapamaz?',
      options: ['Fotoğraf düzenlemesi yapmak', 'Adım saymak', 'Randevuları hatırlatmak', 'Bildirimleri göstermek'],
      correctIndex: 0
    },
    {
      question: 'Akıllı saatleri klasik saatlerden ayıran en belirgin fiziksel özellik nedir?',
      options: ['Kolda taşınması', 'Dokunmatik bir ekrana sahip olması', 'Kayışlarının olması', 'Pille çalışması'],
      correctIndex: 1
    },
    {
      question: 'Akıllı saatlerin tam kapasiteyle çalışabilmesi ve bilgi verebilmesi için genellikle neye ihtiyacı vardır?',
      options: ['Güneş enerjisine', 'Uydu bağlantısına', 'Sürekli hareket etmeye', 'Bir telefonla eşleştirilmeye'],
      correctIndex: 3
    },
    {
      question: 'Akıllı saatlerin üretim süreci metinde nasıl özetlenmiştir?',
      options: ['Malzeme seçimi -> Yazılım oluşturma -> Birleştirme', 'Birleştirme -> Malzeme seçimi -> Yazılım', 'Satış -> Yazılım -> Üretim', 'Yazılım -> Test -> Malzeme seçimi'],
      correctIndex: 0
    },
    {
      question: 'Akıllı saatlerin sürekli bildirim göndermesinin olumsuz sonucu nedir?',
      options: ['Şarjının bitmesi', 'Saatin ısınması', 'Dikkat dağınıklığı oluşturması', 'Bileği terletmesi'],
      correctIndex: 2
    },
    {
      question: 'Metinde akıllı saatler için "Kolumuzdaki Süper Kahraman" benzetmesi yapılmasının nedeni ne olabilir?',
      options: ['Uçabilmemizi sağlaması', 'Çok güçlü ve dayanıklı malzemeden yapılması', 'Sadece tehlikeli durumlarda çalışması', 'Hayatımızı kolaylaştıran birçok özelliğe sahip olması'],
      correctIndex: 3
    },
    {
      question: '"Spor yaparken ne kadar aktif olduğunu takip eder, böylece düzenli yaşamana katkı sağlar" ifadesinden hangi sonuca ulaşılır?',
      options: ['Akıllı saatlerin sadece sporcular için üretildiği', 'Bu cihazların kişisel sağlık yönetimi ve motivasyon konusunda destekleyici olduğu', 'Spor yapmayanların akıllı saat kullanamayacağı', 'Akıllı saatin spor hareketlerini kendisinin yaptığı'],
      correctIndex: 1
    }
  ],
  11: [ // Kırmızı Tatlı Boncuklar (Nar)
    {
      question: 'Nar ağaçları hangi iklim koşulları uygundur?',
      options: ['Soğuk ve yağışlı', 'Sıcak iklimler', 'Kutup kuşağı', 'Sürekli karasal iklim'],
      correctIndex: 1
    },
    {
      question: 'Narın fiziksel özellikleri ile ilgili hangisi doğrudur?',
      options: ['Dış kabuğu yumuşak ve şeffaftır', 'İçi tamamen çekirdeksizdir', 'Meyvenin içinde beyaz zar ve kıpkırmızı taneler bulunur', 'Meyve siyah renktedir'],
      correctIndex: 2
    },
    {
      question: 'Metinde narın çoğaltılması için hangi yöntemlerin kullanıldığı belirtilmiştir?',
      options: ['Sadece aşı ile', 'Çekirdek veya ağacın dalının toprağa dikilmesiyle', 'Yalnızca gölge altında yetiştirilir', 'Suya bırakılarak çoğalır'],
      correctIndex: 1
    },
    {
      question: 'Metinde narın insan sağlığına hangi açıdan yararlı olduğu söylenmektedir?',
      options: ['Zihinsel faaliyetleri tamamen geri getirir', 'Vücut ısısını artırır', 'Kalp sağlığını destekler', 'Saçların rengini değiştirir'],
      correctIndex: 2
    },
    {
      question: 'Nar meyvesiyle ilgili aşağıdakilerden hangisi olası bir yan etki olarak değerlendirilebilir?',
      options: ['Halsizlik yapması', 'Kemik gelişimini durdurması', 'Soğuk algınlığına yol açması', 'Kaşıntı veya mide ağrısına neden olması'],
      correctIndex: 3
    },
    {
      question: 'Nar ağacının kuraklığa dayanıklı olması, ancak yazın suya ihtiyaç duyması, onun hangi özelliğini gösterir?',
      options: ['Suyu sevdiğini ama çok da ihtiyaç duymadığını', 'Tamamen susuz yaşayabildiğini', 'Çok fazla suya ihtiyaç duyduğunu', 'Sadece yağmur suyu ile yetindiğini'],
      correctIndex: 0
    },
    {
      question: 'Narın bilmecelerde "içi dolu boncuk" olarak geçmesi, narın hangi özelliği ile ilgilidir?',
      options: ['Renginin kırmızı olması', 'Şeklinin ve iç yapısının tanelere benzemesi', 'Ağacının uzun olması', 'Çiçeklerinin güzel kokması'],
      correctIndex: 1
    }
  ],
  12: [ // Ekonominin Kalbi (Marmara Bölgesi)
    {
      question: 'Marmara Bölgesi\'nin iklimi metinde nasıl tanımlanmıştır?',
      options: ['Tamamen karasal iklimdir', 'Geçiş iklimidir; güneyde Akdeniz, kuzeyde Karadeniz iklimi görülür', 'Her yeri soğuk ve kurak bir iklime sahiptir', 'Sadece tropikal iklim özellikleri taşır'],
      correctIndex: 1
    },
    {
      question: 'Metne göre Marmara Bölgesi\'nin bitki örtüsü aşağıdakilerden hangisinde doğru verilmiştir?',
      options: ['Yalnızca bozkır', 'Yalnızca maki', 'Hem maki hem orman', 'Sadece çayır ve otlak'],
      correctIndex: 2
    },
    {
      question: 'Marmara Bölgesi\'nin yeryüzü şekilleri ile ilgili hangisi doğrudur?',
      options: ['Çok dağlık ve engebeli bir bölgedir', 'Sadece derin vadilerden oluşur', 'Platolar ve ovalar daha çok yer kaplar, düzlük bir bölgedir', 'Yüksek dağlar bölgenin tamamını kaplar'],
      correctIndex: 2
    },
    {
      question: 'Metne göre Marmara Bölgesi\'ndeki temel ekonomik faaliyetler nelerdir?',
      options: ['Hayvancılık ve ormancılık', 'Sanayi ve turizm', 'Balıkçılık ve madencilik', 'Sadece tarım'],
      correctIndex: 1
    },
    {
      question: 'Marmara Bölgesi\'nin nüfusu ve yerleşme özellikleri ile ilgili hangisi doğrudur?',
      options: ['En az nüfusa sahip bölgemizdir', 'İnsanlar genellikle kırsal alanlarda yaşar', 'Yaklaşık 27 milyon kişi yaşar ve kentsel yerleşim yaygındır', 'Nüfus yalnızca kıyılarda toplanmıştır'],
      correctIndex: 2
    },
    {
      question: 'Marmara Bölgesi\'nin küçük bir bölge olmasına rağmen en kalabalık bölge olması, hangi durumla açıklanabilir?',
      options: ['İkliminin çok soğuk olması', 'İş imkânlarının fazla olması ve diğer bölgelerden göç alması', 'Tarım alanlarının çok geniş olması', 'Deprem riskinin az olması'],
      correctIndex: 1
    },
    {
      question: 'Metinde bu bölgeye "Ekonominin Kalbi" denilmesinin temel sebebi ne olabilir?',
      options: ['Bölgede sadece tarım yapılması', 'Bölgenin Türkiye\'nin en büyük bölgesi olması', 'Sanayi, turizm ve iş imkânlarının çok gelişmiş olması', 'Bölgede hiç doğal afet yaşanmaması'],
      correctIndex: 2
    }
  ]
};

// Correct option index'i harfe çevir (0=A, 1=B, 2=C, 3=D)
function indexToLetter(index) {
  return ['A', 'B', 'C', 'D'][index];
}

// Ana fonksiyon
async function main() {
  const targetStoryId = process.argv[2] ? parseInt(process.argv[2]) : null;

  console.log('🎵 Okuduğunu Anlama Soruları Ses Dosyası Oluşturucu');
  console.log('='.repeat(60));

  const storiesToProcess = targetStoryId
    ? { [targetStoryId]: ALL_QUESTIONS[targetStoryId] }
    : ALL_QUESTIONS;

  if (targetStoryId && !ALL_QUESTIONS[targetStoryId]) {
    console.error(`❌ Hikaye ${targetStoryId} bulunamadı!`);
    process.exit(1);
  }
  
  const totalQuestions = Object.values(storiesToProcess).reduce((sum, qs) => sum + qs.length, 0);
  const totalFiles = totalQuestions * 7;
  
  console.log(targetStoryId ? `📚 Hikaye ${targetStoryId} işlenecek` : `📚 Toplam ${Object.keys(storiesToProcess).length} hikaye`);
  console.log(`❓ Toplam ${totalQuestions} soru`);
  console.log(`📁 Toplam ${totalFiles} ses dosyası oluşturulacak`);
  console.log('='.repeat(60));
  console.log('');

  let processedQuestions = 0;
  let processedFiles = 0;
  let totalErrors = 0;

  // Her hikaye için
  for (const [storyIdStr, questions] of Object.entries(storiesToProcess)) {
    const storyId = parseInt(storyIdStr);
    console.log(`\n📖 Hikaye ${storyId} işleniyor... (${questions.length} soru)`);
    console.log('-'.repeat(60));

    // Her soru için
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const questionId = `q${i + 1}`;
      
      console.log(`\n📝 Hikaye ${storyId} - Soru ${i + 1}/${questions.length}`);
      
      const questionData = {
        question_text: question.question,
        option_a: question.options[0],
        option_b: question.options[1],
        option_c: question.options[2],
        option_d: question.options[3],
        correct_option: indexToLetter(question.correctIndex),
      };

      try {
        const result = await generateQuestionAudios(storyId, questionId, questionData);
        processedFiles += result.files.length;
        totalErrors += result.errors.length;
        
        if (result.errors.length > 0) {
          console.log(`   ⚠️  ${result.errors.length} hata oluştu`);
        } else {
          console.log(`   ✅ ${result.files.length} dosya oluşturuldu`);
        }
        
        processedQuestions++;
        
        // Her soru arasında kısa bir bekleme
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (err) {
        console.error(`   ❌ Soru ${questionId} için genel hata:`, err.message);
        totalErrors++;
      }
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ İşlem Tamamlandı!');
  console.log(`📝 İşlenen soru: ${processedQuestions}/${totalQuestions}`);
  console.log(`📁 Oluşturulan dosya: ${processedFiles}/${totalFiles}`);
  if (totalErrors > 0) {
    console.log(`⚠️  Toplam hata: ${totalErrors}`);
  }
  console.log('='.repeat(60));
}

// Script doğrudan çalıştır
main().catch(err => {
  console.error('\n❌ Genel hata:', err);
  process.exit(1);
});
