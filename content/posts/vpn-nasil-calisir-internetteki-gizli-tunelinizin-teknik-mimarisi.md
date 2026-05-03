---
title: "VPN Nasıl Çalışır? İnternetteki Gizli Tünelinizin Teknik Mimarisi"
date: 2026-05-03T13:13:54+03:00
draft: false
tags: ["VPN Nedir", "VPN Nasıl Çalışır", "Tünelleme", "Kriptografi", "Şifreleme", "OpenVPN", "WireGuard", "IPSec", "İnternet Güvenliği", "Siber Güvenlik", "Gizlilik", "Veri Koruma", "IP Adresi", "Network", "Ağ Uzmanı", "Sistem Yönetimi", "Teknoloji Rehberi", "Bilişim"]
categories: ["Yazılım"]
author: "Fatih Northman"
description: "VPN (Sanal Özel Ağ) teknik olarak nasıl çalışır? Kapsülleme, şifreleme işlemleri, veri yönlendirme mantığı ve OpenVPN ile WireGuard gibi protokollerin mimarisini detaylı rehberimizde öğrenin."
slug: "vpn-nasil-calisir-internetteki-gizli-tunelinizin-teknik-mimarisi"
weight: 1

---

İnternete bağlandığınızda, cihazınız ile hedef web sitesi arasındaki veri akışı normal şartlarda şeffaf bir otoyolda ilerleyen arabalara benzer. İnternet Servis Sağlayıcınız (İSS), aynı ağdaki bilgisayar korsanları veya devlet kurumları; hangi yoldan gittiğinizi, nereye vardığınızı ve bazen arabanızın içinde ne taşıdığınızı görebilir. 

İşte **VPN (Virtual Private Network - Sanal Özel Ağ)**, bu şeffaf otoyolun tam ortasında, sadece size özel, dışarıdan içi görünmeyen çelikten bir tünel inşa eder. Peki ama bu "sanal tünel" teknik olarak nasıl çalışır? Gelin perde arkasındaki mühendisliğe yakından bakalım.



## 1. Temel İşleyiş: Kapsülleme ve Şifreleme

VPN'in çalışma mantığı iki temel ayağa dayanır: **Tünelleme (Tunneling)** ve **Şifreleme (Encryption)**.

### A. Tünelleme (Kapsülleme / Encapsulation)
Normal bir internet paketi (IP paketi), üzerinde sizin cihazınızın gönderici IP adresi ve gideceği sitenin hedef IP adresi yazan bir mektup zarfı gibidir.
VPN uygulaması (İstemci), bu zarfı alır ve **ikinci bir zarfın içine koyar.** Dıştaki yeni zarfın üzerinde hedef olarak girmek istediğiniz site değil, **VPN sunucusunun IP adresi** yazar. Bu "içe içe koyma" işlemine kapsülleme denir. 

### B. Şifreleme (Kriptografi)
Sadece ikinci bir zarfa koymak yetmez, zarfın açılıp içine bakılmasını da engellemek gerekir. VPN yazılımı, cihazınızdan çıkan veriyi karmaşık matematiksel algoritmalarla (Örn: AES-256 veya ChaCha20) okunamaz bir şifreli metne dönüştürür. Bu şifreyi çözecek anahtar sadece sizin cihazınızda ve bağlandığınız VPN sunucusunda bulunur.

## 2. Adım Adım Verinin Yolculuğu

Bir web sitesine gitmek için tıkladığınızda arka planda milisaniyeler içinde şu işlemler gerçekleşir:

1. **El Sıkışma (Handshake):** Cihazınızdaki VPN yazılımı, seçtiğiniz ülkedeki VPN sunucusuyla iletişime geçer. Birbirlerini doğrularlar ve verileri şifrelemek için kullanılacak gizli anahtarları güvenli bir şekilde oluşturup paylaşırlar (Asimetrik Şifreleme).
2. **Paketleme:** Girmek istediğiniz sitenin (Örn: YouTube) verisi cihazınızda şifrelenir ve dış zarfa VPN sunucusunun adresi yazılır.
3. **Karanlık Geçiş:** Bu şifreli paket modeminize, oradan da Türk Telekom/Superonline gibi İSS'nize ulaşır. İSS'niz pakete baktığında şunu görür: *"Bu kullanıcı nereye gidiyor bilmiyorum, içinde ne var okuyamıyorum, tek bildiğim şey verinin Hollanda'daki anlamsız bir IP adresine aktığı."*
4. **Sunucuda Çözümleme (Decapsulation):** Paket VPN sunucusuna ulaşır. Sunucu elindeki anahtarla dış zarfı açar, şifreyi çözer ve asıl isteğinizi (YouTube'a gitmek) okur.
5. **Maskeleme (NAT) ve İletim:** VPN sunucusu, sizin orijinal IP adresinizi siler ve paketin üzerine **kendi IP adresini** yazar. Sonra paketi YouTube'a gönderir.
6. **Hedefin Yanılgısı:** YouTube sunucuları, isteğin sizin evinizden değil, Hollanda'daki o sunucudan geldiğini sanır. Cevabı Hollanda'ya yollar. VPN sunucusu bu cevabı alır, sizin için tekrar şifreler ve size geri yollar.



## 3. VPN Protokolleri: Tünelin Malzemesi

Her VPN aynı şekilde çalışmaz. Tüneli inşa ederken kullanılan kurallar bütününe "Protokol" denir. En yaygın olanları şunlardır:

* **OpenVPN:** Yılların eskitemediği endüstri standartıdır. Çok güvenlidir, kırmak neredeyse imkansızdır ancak kod yapısı çok ağır olduğu için (yaklaşık 70.000 satır kod) biraz yavaştır.
* **WireGuard:** VPN dünyasının yeni süper yıldızıdır. Sadece 4.000 satırlık modern ve inanılmaz hafif bir koda sahiptir. Doğrudan Linux çekirdeği (Kernel space) seviyesinde çalışabildiği için OpenVPN'e göre çok daha hızlı bağlantı kurar ve batarya dostudur.
* **IKEv2 / IPSec:** Özellikle mobil cihazlarda çok başarılıdır. Telefonunuz Wi-Fi'dan çıkıp hücresel veriye (4G/5G) geçtiğinde VPN bağlantısının kopmadan anında yeni ağa adapte olmasını sağlar.

## 4. VPN Ne Değildir? (Sık Bilinen Yanlışlar)

* **VPN sizi %100 anonim yapmaz:** İSS'niz (TTnet vb.) nereye girdiğinizi göremez ama **VPN şirketinin kendisi tüm trafiğinizi görebilir.** Eğer ücretsiz, ne idüğü belirsiz bir VPN kullanıyorsanız, verilerinizi İSS'den saklayıp VPN şirketine satmaları için teslim ediyorsunuz demektir. Bu yüzden "Kayıt Tutmama" (No-Logs) politikası bağımsız denetimden geçmiş, güvenilir şirketler (Örn: Mullvad, ProtonVPN vb.) tercih edilmelidir.
* **VPN internetinizi hızlandırmaz:** (İSS'nizin özel olarak yavaşlattığı -throttling- durumlar hariç). Verinin şifrelenmesi ve dünyanın öbür ucundaki bir sunucuya gidip gelmesi fiziksel bir zaman alır (Ping/Gecikme). Kaliteli bir VPN bu yavaşlamayı en aza indirir ama fizik kurallarını bükemez.

Özetle VPN, sizi internetin tehlikeli ve gözetim altındaki sokaklarından alıp, sadece sizin ve güvendiğiniz sunucunun bildiği yeraltı tünellerinden hedefinize ulaştıran şifreli bir ulaşım ağıdır.