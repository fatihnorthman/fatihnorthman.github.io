---
title: "Yazılım Dünyasının Mutfağına Giriş: Özgür Yazılım, Açık Kaynak ve GPL Lisansı"
date: 2026-05-02T09:50:28+03:00
draft: false
tags: ["Açık Kaynak", "Open Source", "Özgür Yazılım", "Free Software", "GPL Lisansı", "GNU", "Genel Kamu Lisansı", "Yazılım Lisansları", "Sahipli Yazılım", "Proprietary Software", "Ücretli Yazılım", "Kapalı Kaynak", "Linux"]
categories: ["Yazılım"]
author: "Fatih Northman"
description: "Özgür yazılım, açık kaynak, GPL lisansı ve kapalı kaynak (sahipli) yazılımlar arasındaki farklar nelerdir? Yazılım dünyasının lisanslama mantığını anlaşılır metaforlarla keşfedin."
slug: "yazilim-dunyasinin-mutfagina-giris-ozgur-yazilim-acik-kaynak-ve-gpl-lisansi"
weight: 1

---

Bir yazılımı kullanırken aslında sadece bir kod yığını çalıştırmayız; aynı zamanda o yazılımın "lisans sözleşmesini" de kabul etmiş oluruz. Özgür yazılım, açık kaynak, GPL ve sahipli (ücretli) yazılım gibi kavramlar genellikle birbirine karıştırılır. 

Bu karmaşık dünyayı anlamak için **"yemek tarifi"** metaforunu kullanalım. Bir yazılımın kaynak kodu, o yazılımın yemek tarifidir. Derlenmiş ve kullanıma hazır program ise fırından çıkmış kekin kendisidir.

## 1. Sahipli ve Kapalı Kaynak (Ücretli) Yazılım
**Felsefesi:** *"Keki satın alıp yiyebilirsin ama tarifini asla göremezsin."*

Geleneksel, ticari yazılım modelidir (Örn: Microsoft Windows, Adobe Photoshop). Şirket size sadece derlenmiş programı (keki) verir. 
* Kaynak kodunu (tarifi) göremezsiniz.
* Programı kopyalayıp arkadaşlarınıza dağıtmanız yasadışıdır (korsan).
* Programın içini açıp nasıl çalıştığına bakmak veya kendi ihtiyaçlarınıza göre değiştirmek (tersine mühendislik) yasaktır.
* Ürünün sahibi siz değil, lisansı veren şirkettir; siz sadece "kullanım hakkını" kiralarsınız.

## 2. Özgür Yazılım (Free Software)
**Felsefesi:** *"Tarif herkesin hakkıdır, dilediğin gibi pişir, değiştir ve komşunla paylaş."*

Özgür yazılım hareketi, 1980'lerde Richard Stallman tarafından başlatılmıştır. Buradaki "Özgür" (Free) kelimesi bedava anlamında değil, "Özgürlük" anlamındadır. (İngilizcedeki klasik deyişle: *Free as in free speech, not as in free beer* - Bedava bira gibi değil, ifade özgürlüğü gibi).

Bir yazılımın "Özgür" sayılabilmesi için kullanıcılara şu 4 temel özgürlüğü (0'dan 3'e kadar numaralandırılır) sunması gerekir:
* **Özgürlük 0:** Programı herhangi bir amaç için, istediğiniz gibi çalıştırma özgürlüğü.
* **Özgürlük 1:** Programın nasıl çalıştığını inceleme (kaynak koduna erişim) ve onu kendi ihtiyaçlarınıza göre uyarlama özgürlüğü.
* **Özgürlük 2:** İhtiyacı olanlara yardım edebilmeniz için kopyalarını dağıtma özgürlüğü.
* **Özgürlük 3:** Programı geliştirme ve yaptığınız değişiklikleri (modifikasyonları) topluma dağıtma özgürlüğü.

## 3. Açık Kaynak Yazılım (Open Source Software)
**Felsefesi:** *"Açık bir mutfak daha verimlidir. Tarifi herkes görebilirse, en iyi keki birlikte yaparız."*

1990'ların sonlarında, "Özgür Yazılım" kavramının iş dünyasını korkuttuğu düşünüldü ve daha pragmatik bir yaklaşım olan "Açık Kaynak" kavramı ortaya atıldı. 
Pratikte Özgür Yazılım ve Açık Kaynak yazılımların %99'u aynıdır. Ancak aralarındaki fark **felsefidir**:
* **Özgür Yazılım** olaya ahlaki ve etik yaklaşır: *"Kullanıcıyı kısıtlamak kötüdür."*
* **Açık Kaynak** olaya pratik yaklaşır: *"Kaynak kodu açık olursa hatalar daha hızlı bulunur, daha güvenli ve yenilikçi yazılımlar üretilir."*

## 4. GPL Lisansı (GNU General Public License)
**Felsefesi:** *"Sana bu tarifi veriyorum ve istediğin gibi değiştirebilirsin. Ancak, bu tariften yola çıkarak yeni bir kek yapıp satarsan veya dağıtırsan, onun tarifini de herkesle paylaşmak ZORUNDASIN."*

GPL, Özgür Yazılım dünyasının en ünlü ve en güçlü lisansıdır (Linux çekirdeği GPL ile lisanslanmıştır). GPL'in en büyük özelliği **"Copyleft" (Telif Feragatı)** adı verilen bir mekanizma içermesidir.

GPL "viral" bir lisanstır. Eğer GPL lisanslı bir açık kaynak kodunu alır, kendi projenize dahil eder ve o projeyi dağıtırsanız, **sizin projenizin tamamı da otomatik olarak GPL lisanslı olmak zorundadır.**
Bu kural, büyük şirketlerin açık kaynak kodları alıp, üzerine biraz ekleme yaparak kapalı/ücretli bir ürüne dönüştürmesini (kodun hapsedilmesini) engeller. Özgür alınan kod, sonsuza kadar özgür kalmalıdır.

### MIT veya Apache gibi diğer lisansların GPL'den farkı nedir?
GPL'in aksine, MIT veya Apache gibi lisanslar "izin verici" (permissive) lisanslardır. 
* **MIT Lisansı der ki:** *"Bu kodu al, ne yaparsan yap. İstersen değiştirip kapalı kaynak ve ücretli bir yazılım olarak sat. Sadece adımın geçtiği ufak bir metni içinde tut yeter."*

## Özet Karşılaştırma Tablosu

| Özellik | Sahipli (Ücretli) Yazılım | Açık Kaynak / Özgür Yazılım (Genel) | GPL Lisanslı Yazılım |
| :--- | :--- | :--- | :--- |
| **Kaynak Kodu Görünür mü?** | Hayır | Evet | Evet |
| **Kod Değiştirilebilir mi?** | Hayır | Evet | Evet |
| **Ücretsiz Olmak Zorunda mı?** | Hayır (Genelde ücretli) | Hayır (Kod açıktır ama hizmet/destek satılabilir) | Hayır (Kod satılamaz ama dağıtım/destek satılabilir) |
| **Değiştirilen Kod Kapatılabilir mi?** | Değiştirilemez | Lisansa göre değişir (Örn: MIT lisansında kapatılabilir) | **Kesinlikle Hayır.** Yeni ürün de GPL olmak zorundadır. |
| **Felsefi Odak** | Ticari Kar ve Kontrol | İnovasyon ve Geliştirici Özgürlüğü | Kullanıcı Özgürlüğü ve Kodun Sonsuza Dek Açık Kalması |

Açık kaynak dünyası, modern internetin ve sunucu altyapılarının temel taşıdır. Bugün dev şirketler bile tamamen kapalı kaynak kodlarla rekabet edemeyeceklerini anladıkları için açık kaynak projelere milyonlarca dolar yatırım yapmaktadır.