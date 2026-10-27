# AC Ölçüm Simülatörü

Türkçe arayüzlü, tarayıcıda ve çevrimdışı çalışan etkileşimli AC ölçüm laboratuvarı. Tek HTML dosyasıdır; kurulum, sunucu veya harici kütüphane gerektirmez.

![Açıklamalı formüller](docs/onizleme.png)

## Başlatma

Bu depoyu indirin veya klonlayın, ardından `index.html` dosyasını tarayıcınızda açın. Ayrıntılı anlatım için [kullanım kılavuzuna](KULLANIM.md) bakın.

İsteğe bağlı yerel sunucu:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Ardından tarayıcıda `http://127.0.0.1:8000` adresini açın.

## Özellikler

- Sinüs, kare, üçgen ve testere dalgaları.
- Tepe veya AC RMS olarak genlik girişi; frekans, DC ofset ve gürültü ayarları.
- Ayarlanabilir örnekleme hızı, ölçüm penceresi, ADC çözünürlüğü, giriş ölçeği ve merkez gerilimi.
- Kaynak ve ADC grafikleri, 20×4 sanal LCD.
- VMAX, VMIN, VPP, VDC, toplam RMS, AC RMS ve örneklerden frekans tahmini.
- On hazır deney; referansla önce/sonra karşılaştırması.
- Sayılarla doldurulan formüller, ideal/örneklenmiş/ADC sonuçlarının karşılaştırması.
- ADC kırpılması ve yetersiz örnekleme uyarıları; CSV dışa aktarma.

## Önemli ayrım

DC ofsetsiz saf sinüste **tepe = RMS × √2**. Dolayısıyla 220 V tepe yaklaşık 155,56 V RMS; 220 V RMS yaklaşık 311,13 V tepedir. Bu katsayı her dalga biçimi için aynı değildir.

## Modelin kapsamı

Eğitim amaçlı ideal izolasyon/ölçekleme modeli kullanılır. Fiziksel devre veya şebeke bağlantı şeması içermez. Analog örtüşme önleyici filtre ve gerçek ADC'nin tüm hata kaynakları modellenmez. Formüllerin koşulları ve ölçüm sınırlamaları arayüzde açıklanır.

## Testler

Node.js ile, ek paket yüklemeden:

```sh
node tests/measurements.cjs
```

Testler dört dalganın RMS/frekans hesaplarını, DC ofseti, kırpılmayı, yetersiz örneklemeyi, RMS giriş dönüşümünü, hazır deneyleri, RMS ayrışımını ve pencere etkisini kontrol eder.

## Dosyalar

- `index.html`: Uygulamanın tüm HTML, CSS ve JavaScript kodu.
- `KULLANIM.md`: Türkçe kullanım ve model açıklamaları.
- `tests/measurements.cjs`: Sayısal doğrulama testleri.
- `docs/onizleme.png`: Arayüz önizlemesi.
