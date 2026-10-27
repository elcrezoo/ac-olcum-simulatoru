# AC ölçüm simülatörü

`index.html` dosyasını çift tıklayın veya Chrome, Edge ya da Firefox ile açın. Kurulum ve internet bağlantısı gerekmez. Tüm işlemler tarayıcınızda yapılır.

## Kullanım

1. Soldan sinüs, kare, üçgen veya testere dalgasını seçin.
2. Genliği (tepe volt), frekansı, DC ofseti ve gürültü sınırını değiştirin.
3. ADC örnekleme hızını, ölçüm penceresini, çözünürlüğü, giriş tam ölçeğini ve ADC merkez gerilimini ayarlayın.
4. Grafikler, VMAX, VMIN, VPP, VDC, VRMS, frekans ve 20×4 LCD birlikte yenilenir.
5. “Adım adım hesaplamalar” altında örnek kaydırıcısını hareket ettirerek kaynak → ADC gerilimi → kod → geri hesaplanan giriş dönüşümünü inceleyin.
6. “Örnekleri CSV indir” ile ölçüm penceresinin tüm örneklerini kaydedin. CSV sütun ayırıcı noktalı virgül, ondalık ayırıcı noktadır. “Başlangıç ayarları” varsayılan deneyi geri getirir.

## İlk deney

Başlangıç: 220 V **tepe** sinüs, 50 Hz, sıfır DC/gürültü, 10.000 örnek/s, 0,2 saniye, 12 bit, ±400 V giriş ölçeği ve 1,65 V merkez.

- İdeal VMAX/VMIN: +220 / −220 V.
- İdeal VPP: 440 V; VDC: 0 V.
- İdeal VRMS: 220 / √2 ≈ 155,56 V; ADC modelinin sonucu yaklaşık 155,57 V.
- 220 V RMS sinüs için tepe genlik yaklaşık 311 V olmalıdır; bu sayılar yalnızca sanal kaynağı tanımlar.

Genliği 500 V yapın: ADC kırpılma uyarısı görülür. Başlangıca dönüp örnekleme hızını 80 yapın: 50 Hz kaynak için örtüşme uyarısı görülür. Başlangıca dönüp DC ofseti 100 V yapın: toplam RMS artar, DC çıkarılmış AC RMS yaklaşık aynı kalır.

## Model

Soyut zincir: sanal kaynak → ideal izolasyon → ölçekleme ve merkez ekleme → 0–3,3 V sınırlandırma → ADC → hesaplamalar → LCD.

`k = 1,65 / giriş tam ölçeği`

`ADC ham gerilim = merkez + k × kaynak`

`kod = round(clamp(ADC ham gerilim, 0, 3,3) / 3,3 × (2^bit − 1))`

`geri hesaplanan giriş = (kod × 3,3 / (2^bit − 1) − merkez) / k`

Bu uç noktaları eşleyen ideal ADC modelidir; gerçek bir ADC'nin tüm hata ve kod geçiş özelliklerini temsil etmez. Referans 3,3 V sabittir; giriş ölçeği, merkez ve bit sayısı ayarlanabilir. Merkez 1,65 V iken giriş ±tam ölçek aralığına eşlenir. Diğer merkezlerde ölçülebilir giriş aralığı asimetrik olur ve formüllerde gösterilir.

LCD’de MAX, MIN, PP, DC, RMS ve F istenen ölçümlerdir. AC ilave olarak DC çıkarılmış RMS’yi gösterir. LCD bir ondalık, ana sonuç alanı iki ondalık basamak gösterir. LCD’nin dört satırı da 20 karakterdir.

Frekans kaynak ayarından kopyalanmaz: ADC örneklerinin ortalama çevresindeki yükselen geçişlerinden, enterpolasyon ve histerezis kullanılarak tahmin edilir. En az üç geçiş gerekir. Geçiş aralıklarının medyandan sapması %15’i aşarsa, sinyal çok küçükse veya kaynak frekansı için örnekleme koşulu sağlanmıyorsa sonuç “--” olur. Bu yöntem genel amaçlı spektrum analizi değildir; gürültü ve harmonikler tahmini yanıltabilir.

## Sınırlar

- Ölçümler pencerenin tüm örneklerinden hesaplanır. Tam periyot içermeyen pencerelerde ortalama ve RMS değişebilir.
- Gürültü, 20 kHz düğümlerdeki tekrarlanabilir sınırlı rastgele değerlerin doğrusal birleşimidir; beyaz Gauss gürültüsü değildir.
- Analog örtüşme önleyici filtre yoktur. Kare/üçgen/testerenin yüksek harmonikleri örtüşebilir.
- Grafiklerde en çok 1.200 ADC noktası gösterilir; hesaplar ve CSV tüm örnekleri içerir. Çok uzun pencerelerde grafik çizgileri de hızlı dalgayı doğru gösteremeyebilir; “İlk 1 periyot” görünümünü kullanın.
- Geçersiz veya boş bir sayısal alan varken uyarı çıkar, son geçerli sonuçlar korunur.
- Simülatör fiziksel devre veya şebeke bağlantı şeması sunmaz. İdeal izolasyon yalnızca matematiksel bir varsayımdır.

## Doğrulama

Sinüs/kare/üçgen/testere RMS değerleri ideal formüllerle karşılaştırıldı; 50 Hz frekans tahmini, DC ofset, kırpılma, düşük örnekleme, sabit DC, kısa pencere, tekrarlanabilir gürültü ve 200.000 örneklik üst sınır kontrolleri geçti. Tarayıcıda dalga seçimi, kırpılma ve örtüşme uyarıları ile başlangıca dönüş kontrol edildi.

## Genişletilmiş sürüm: tepe / AC RMS girişi

“Genlik giriş biçimi” alanından **Tepe genlik (A)** veya **AC RMS (DC hariç)** seçin. Biçim değişince mevcut sayı yeni birimde yorumlanır. Örneğin sinüs ve 220 seçiliyken AC RMS'ye geçmek 311,13 V tepe üretir. DC ofset ayrıca eklenir; toplam RMS, AC RMS ile aynı olmayabilir.

- Sinüs: A = AC RMS × √2.
- %50 görev oranlı kare: A = AC RMS.
- Simetrik üçgen ve testere: A = AC RMS × √3.
- Tüm bu ideal dalgalarda toplam RMS = √(DC² + AC RMS²).
- VMAX = DC + A; VMIN = DC − A; VPP = 2A; mutlak tepe = |DC| + A.

Simülatörde “Tepe, RMS ve DC ilişkisi” bölümü ideal kaynak, ADC ölçümü ve farkını canlı karşılaştırır. Bu fark yalnızca ADC hatası değildir; gürültü ve ölçüm penceresi de etkiler.

“Tüm dalgalar için formüller” bölümü RMS integralini, √2'nin nereden geldiğini, DC'li ters dönüşümü, doğrultulmuş ortalamayı, tepe faktörünü ve dirençte güç ilişkisini açıklar. “Dalga üretimi, örnekleme ve hata kaynakları” bölümü dalga denklemlerini, gürültünün çapraz terimini, örnekleme koşullarını, LSB/kuantalama/kırpılmayı, frekans tahmin sınırlarını ve sanal mikrodenetleyici akışını içerir.

Yeni kontroller: Dört dalgada 220 V AC RMS girişinin dönüşümü ve DC eklenmiş toplam RMS hesabı geçti. Tarayıcıda 220 V RMS sinüs için LCD yaklaşık ±311,1 V tepe ve 220,0 V RMS gösterdi.

## Açıklamalı deneyler ve önce/sonra karşılaştırması

1. Sayfanın başındaki “Ne değiştirirsem ne olur?” bölümünden bir deney seçin. Deney, kendi referans ayarlarını yükler; yalnızca açıklanan değişikliği uygular.
2. “Önce / sonra” bağlantısıyla ölçülen VMAX, VMIN, VPP, VDC, RMS, AC RMS, frekans, LSB ve kırpılan örnek sayısındaki farkı görün.
3. “Mevcut ayarları referans al” ile kendi başlangıcınızı sabitleyin. Sonra soldaki bir ayarı değiştirin; referans kendiliğinden değişmez.
4. “Sayılı formüller” her formülü, güncel sayılarla yerine koymayı ve sonucu gösterir. Simgeler aynı bölümde açıklanır.
5. “Hata nereden geliyor?” tablosunda ideal kaynak → ADC öncesi kaynak örnekleri → ADC ölçümü aşamalarını karşılaştırın.
6. “Tüm açıklamaları aç” ile kapalı bilgi bölümlerini birlikte açın. Masaüstünde ayarlar paneli sayfayı kaydırırken görünür kalır; panel içindeki ayarlara kendi kaydırma çubuğuyla ulaşılır.

### Beklenen etkiler

| Deney | Beklenen sonuç |
|---|---|
| Sinüste 100 → 200 V tepe | İdeal RMS 70,71 → 141,42 V; frekans değişmez |
| ±220 V sinüse +100 V DC | İdeal VMAX 320 V, VMIN −120 V; toplam RMS 184,93 V; AC RMS 155,56 V |
| Aynı 220 V tepede sinüs → kare | İdeal RMS 155,56 → 220 V |
| ±500 V kaynakta ölçek ±600 → ±400 V | Kaynak değişmez, ADC tepeleri kırpar; ölçülen RMS yaklaşık 353,55 → 318,01 V |
| 12 bit → 8 bit, ±400 V ölçek | Giriş LSB 0,19536 → 3,13725 V |
| 50 Hz sinüste pencere 0,20 → 0,03 s | 10 → 1,5 periyot; sıfır kaynak DC’sine rağmen ölçülen ortalama yaklaşık +46,68 V |

Bu değerler belirtilen deney ayarları içindir. Fark sütunları ölçüm sonuçlarının farkıdır; örnek bazlı hata RMS’si ayrıca gösterilir. İdeal sonuçla ölçüm farkına gürültü, pencere, örnek zamanları, kuantalama ve kırpılma birlikte katkıda bulunabilir.

### Sayısal hesap iyileştirmeleri

AC RMS doğrudan `sqrt(sum((örnek − ortalama)^2)/N)` ile hesaplanır. Bu yöntem büyük DC yanında küçük AC hesaplanırken iki büyük kareyi çıkarma sorununu azaltır. Çift sayıda periyot aralığında medyan, ortadaki iki değerin ortalamasıdır. On hazır deney, RMS ayrışımı, sabit DC'de sıfır AC, kısa pencere ortalaması ve ADC adımı kontrolleri geçti; deney seçimi, referans kaydı ve açıklamaları açma tarayıcıda doğrulandı.
