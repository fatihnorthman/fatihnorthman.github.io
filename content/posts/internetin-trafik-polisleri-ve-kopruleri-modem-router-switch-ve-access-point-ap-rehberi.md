---
title: "İnternetin Trafik Polisleri ve Köprüleri: Modem, Router, Switch ve Access Point (AP) Rehberi"
date: 2026-05-04T11:54:59+03:00
draft: false
tags: ["Modem", "Router", "Switch", "Access Point", "Ağ Cihazları", "Network", "Bilişim Teknolojileri", "LAN", "WAN", "MAC Adresi", "Yönlendirici", "Ev Ağı", "Sistem Yöneticisi", "Teknoloji Rehberi", "Ağ Altyapısı", "Wi-Fi", "Ethernet", "Donanım", "Hub"]
categories: ["Bilişim"]
author: "Fatih Northman"
description: "Modem, router, switch ve access point (AP) arasındaki farklar nelerdir? Evimizdeki internet kutusunun aslında nasıl çalıştığını ve ağ trafiğini yönlendiren donanımların görevlerini bu kapsamlı rehberde öğrenin."
slug: "internetin-trafik-polisleri-ve-kopruleri-modem-router-switch-ve-access-point-ap-rehberi"
weight: 1

---

Bir önceki yazımızda verilerin (paketlerin) ve adreslerin (IP) mantığını anlattık. Ancak bu dijital paketlerin fiziksel dünyada kablolar ve cihazlar üzerinden nasıl yönlendirildiğini anlamadan yapboz tamamlanmış sayılmaz. 

İnternet Servis Sağlayıcınızdan (İSS) evinize veya şirketinize gelen veri, bilgisayarınıza ulaşana kadar bir dizi donanımdan geçer. Bu cihazların her birinin çok spesifik ve hayati bir görevi vardır. Gelin, ağ mimarisinin bu "kara kutularını" tek tek açalım ve aslında nasıl çalıştıklarını öğrenelim.

## 1. Modem: Sınır Kapısındaki Tercüman

Kelime anlamı **Mo**dulator-**Dem**odulator'den gelir. Modemin tek ve en temel görevi **çevirmenlik** yapmaktır.

*   **Neden Çevirmene İhtiyaç Var?** Bilgisayarınız sadece dijital sinyallerden (0'lar ve 1'ler) anlar. Ancak internet altyapısı (özellikle eski ADSL/VDSL hatları) veriyi telefon kabloları üzerinden analog ses dalgaları (frekanslar) şeklinde taşır. 
*   **Ne Yapar?** Bilgisayarınızdan çıkan dijital 0 ve 1'leri, telefon hattında gidebilecek analog dalgalara dönüştürür (Modülasyon). Dışarıdan gelen dalgaları ise bilgisayarınızın anlayacağı dijital 0 ve 1'lere geri çevirir (Demodülasyon). 
*   *Fiber Notu:* Eğer evinize kadar fiber optik kablo geliyorsa, o cihaz teknik olarak modem değil **ONT (Optical Network Terminal)** cihazıdır. Çünkü artık ses dalgasını değil, ışık sinyallerini (lazer atımlarını) dijital veriye çeviriyordur.

## 2. Router (Yönlendirici): Postane Dağıtım Merkezi

Modem veriyi evinize kadar getirdi ve anlaşılır kıldı. Ancak modem kime, hangi veriyi göndereceğini bilemez. İşte burada **Router** devreye girer.

Router, adından da anlaşılacağı gibi trafiği "yönlendiren" cihazdır. İki farklı ağı birbirine bağlar (Örneğin evinizdeki Yerel Ağ (LAN) ile dışarıdaki devasa İnterneti (WAN) birleştirir).

*   **Trafik Polisi:** Evinizde aynı anda biri Netflix izlerken, diğeri online oyun oynuyor olabilir. Router, internetten gelen paketlerin IP adreslerine bakar ve "Bu paket Netflix izleyen televizyona gidecek, bu paket oyun oynayan bilgisayara gidecek" diyerek NAT (Ağ Adresi Çevirisi) yapar. Trafiğin birbirine karışmasını engeller.
*   **IP Dağıtıcı (DHCP):** Ağınıza bağlanan her cihaza (telefon, tablet, akıllı saat) otomatik olarak bir yerel IP adresi (Örn: 192.168.1.x) atayan cihaz Router'dır.
*   **Güvenlik Duvarı (Firewall):** Dış dünyadan (internetten) sizin ev ağınıza (LAN) yapılmaya çalışılan yetkisiz girişleri engelleyen ilk güvenlik kalkanı router'ın içindeki yazılımdır.

## 3. Switch (Ağ Anahtarı): Şirket İçi Dahili Telefon Hattı

Router ağları birbirine bağlarken, **Switch** aynı ağın (LAN) içindeki cihazları birbirine bağlar. Özellikle birden fazla bilgisayarın, yazıcının ve sunucunun olduğu ofislerde kullanılır.

*   **Akıllı Dağıtım (MAC Adresi):** Switch, kendisine bağlanan her cihazın fiziksel donanım adresini (MAC Adresi) hafızasına kaydeder. Örneğin 1 numaralı bilgisayar, 4 numaralı bilgisayara bir dosya göndermek istediğinde, Switch bu veriyi alır ve **sadece** 4 numaralı porta yollar. Diğer bilgisayarları meşgul etmez.
*   **Hub ile Switch'in Farkı Nedir?** Eskiden Switch yerine "Hub" adı verilen aptal cihazlar kullanılırdı. Hub, 1 numaralı bilgisayardan gelen dosyayı alır ve ağdaki *herkese* kopyalayıp bağırarak gönderirdi ("Bu dosya senin mi? Senin mi?"). Bu durum ağ trafiğini inanılmaz yavaşlatır ve güvenlik zafiyeti yaratırdı. Switch ise sadece alıcıyı bilir ve veriyi doğrudan ona (noktadan noktaya) iletir.

## 4. Access Point (Erişim Noktası - AP): Görünmez Köprü

Kablolu ağı, kablosuz (Wi-Fi) ağa dönüştüren cihazdır. 

Büyük bir eviniz veya ofisiniz olduğunu düşünün. Router'ınızın Wi-Fi sinyali arka odalara ulaşmıyorsa, o odaya kadar bir Ethernet (CAT6) kablosu çekip ucuna bir **Access Point** takarsınız. 
Access Point'in IP dağıtmak (DHCP), trafiği yönlendirmek (Routing) veya güvenlik duvarı gibi yetenekleri **yoktur.** O sadece kablodan gelen interneti havaya, havadaki sinyali de kabloya çeviren, Router'a bağlı aptal ama güçlü bir anten köprüsüdür.

## 5. BÜYÜK YANILGI: Evimizdeki "Modem" Aslında Nedir?

Bu yazıyı okurken *"İyi de benim evimde 4 tane cihaz yok ki, Türk Telekom / Turkcell gelip tek bir kutu taktı, ben ona modem diyorum"* diye düşünüyor olabilirsiniz.

Haklısınız, ancak teknik olarak o kutu sadece bir "Modem" değildir. Teknoloji geliştikçe şirketler maliyeti ve kablo karmaşasını azaltmak için tüm bu cihazları tek bir plastik kasanın içine entegre ettiler. Evinizdeki o cihaz aslında bir **Home Gateway'dir (Ev Tipi Ağ Geçidi)**. İçerisinde şunlar bulunur:

1.  Duvardan gelen dsl/fiber sinyalini çeviren bir **Modem çipi**.
2.  IP dağıtan ve NAT yapan bir **Router yazılımı**.
3.  Arkasında bilgisayar/TV bağlamanız için 4 adet sarı girişi bulunan bir **Switch**.
4.  Telefonunuzla kablosuz bağlanmanızı sağlayan antenleriyle bir **Access Point**.

**Özetle:** İnternet sihirli bir bulut değildir. Verileriniz sınır kapısındaki çevirmenden (Modem), postane dağıtım merkezine (Router) ve oradan da apartmanınızdaki dahili hatlara (Switch) kadar çok net fiziksel ve mantıksal kurallarla işleyen donanımlardan geçerek ekranınıza ulaşır.