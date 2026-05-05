---
title: "İnternetin Görünmez Kahramanları: DNS, Proxy ve VPN Nedir, Nasıl Çalışır?"
date: 2026-05-05T09:27:03+03:00
draft: false
tags: ["VPN", "DNS", "Proxy", "Ağ Güvenliği", "Siber Güvenlik", "İnternet Protokolleri", "Gizlilik", "IP Adresi", "Şifreleme", "Tünelleme", "Network", "Bilgi Güvenliği", "Sistem Yöneticisi", "Bilişim Teknolojileri", "İnternet Altyapısı", "Teknoloji Rehberi", "Ağ Uzmanı"]
categories: ["Bilişim"]
author: "Fatih Northman"
description: "VPN, DNS ve Proxy nedir? Aralarındaki farklar, çalışma mantıkları ve internette güvenlik sağlarken hangi senaryoda hangisinin kullanılması gerektiği hakkında kapsamlı ve eğitici rehberimizi inceleyin."
slug: "internetin-gorunmez-kahramanlari-dns-proxy-ve-vpn-nedir-nasil-calisir"
weight: 1
image: "/images/1777973223197-vpn.jpg"
---

İnternette gezinmek, devasa ve karmaşık bir otoyol sisteminde araba kullanmaya benzer. Hedefinize ulaşmak için yön tabelalarına, bazen kimliğinizi gizlemeye, bazen de güvenliğiniz için zırhlı araçlara ihtiyaç duyarsınız. İşte internetin bu üç temel aracı olan **DNS**, **Proxy** ve **VPN**, çevrimiçi yolculuğunuzun kaderini belirler. 

Bu üç kavram sıkça birbirine karıştırılır. Gelin, her birinin ne işe yaradığını, aralarındaki farkları ve teknik olarak nasıl çalıştıklarını anlaşılır metaforlarla derinlemesine inceleyelim.

## 1. DNS (Alan Adı Sistemi): İnternetin Telefon Rehberi

Bilgisayarlar harflerden veya kelimelerden anlamazlar; sadece "142.250.184.206" gibi IP adresleriyle (sayılarla) iletişim kurarlar. Ancak bir insan olarak milyarlarca web sitesinin IP adresini aklınızda tutamazsınız.

**DNS (Domain Name System)**, sizin anladığınız kelimeleri (örneğin `google.com`), bilgisayarların anladığı sayılara (IP adreslerine) çeviren devasa bir telefon rehberidir.



### Nasıl Çalışır?
1. Siz tarayıcınıza `youtube.com` yazıp Enter'a basarsınız.
2. Bilgisayarınız anında İnternet Servis Sağlayıcınızın (veya Google, Cloudflare gibi şirketlerin) DNS sunucusuna gider ve sorar: *"youtube.com'un numarası kaç?"*
3. DNS sunucusu rehbere bakar, sitenin IP adresini bulur ve cihazınıza geri gönderir.
4. Cihazınız bu IP adresini kullanarak hedef sunucuya bağlanır ve site ekranda açılır.

**DNS'in Güvenlik ve Gizlilikle İlişkisi:** Normal bir DNS sadece adres sorar, kimliğinizi gizlemez veya trafiğinizi şifrelemez. Yasaklı bir siteye girmeye çalıştığınızda, İSS'niz DNS kayıtlarına müdahale ederek sizi "Bu site mahkeme kararıyla engellenmiştir" sayfasına yönlendirebilir. DNS adresinizi (Örn: 8.8.8.8) değiştirmek bu basit engelleri aşmanızı sağlar ancak trafiğinizi yine de gizlemez.

---

## 2. Proxy (Vekil Sunucu): İnternetteki Aracı Çocuğunuz

Proxy, kelime anlamı olarak "Vekil" veya "Elçi" demektir. Sizinle internetteki hedef site arasında duran bir aracı sunucudur. 

**Metafor:** Bakkaldan bir şey almak istiyorsunuz ama bakkalın sizi görmesini veya tanımasını istemiyorsunuz. Bir arkadaşınıza para verirsiniz, o bakkala gider, ürünü alır ve size getirir. Bakkal, ürünü arkadaşınızın aldığını sanır, sizin varlığınızdan haberi olmaz. İşte o arkadaş "Proxy"dir.



### Nasıl Çalışır?
1. Tarayıcınızdan bir siteye girmek istediğinizde, istek önce Proxy sunucusuna gider.
2. Proxy sunucusu, **kendi IP adresini** kullanarak o siteye sizin adınıza bağlanır.
3. Site, veriyi Proxy'ye gönderir, Proxy de size iletir.
4. Web sitesi sizin gerçek IP adresinizi değil, Proxy sunucusunun IP adresini görür.

### Proxy'nin Özellikleri ve Dezavantajları:
* **Uygulama Bazlıdır:** VPN'in aksine tüm bilgisayarınızın trafiğini kapsamaz. Sadece ayarladığınız programı (örneğin sadece web tarayıcınızı veya Torrent programınızı) etkiler.
* **Şifreleme Yoktur (Genellikle):** Proxy sunucuları IP adresinizi değiştirir ancak verilerinizi genellikle şifrelemez. İSS'niz veya ağınızı izleyen bir hacker (ortadaki adam), hangi sitelere girdiğinizi ve ne veriler gönderdiğinizi açıkça görebilir. Bu yüzden hassas işlemler (bankacılık vb.) için uygun değildir.

---

## 3. VPN (Sanal Özel Ağ): İnternetteki Zırhlı Tüneliniz

VPN (Virtual Private Network), Proxy'nin çok daha gelişmiş, kapsayıcı ve güvenli halidir. Sadece IP adresinizi değiştirmekle kalmaz, cihazınız ile hedef sunucu arasına kırılması imkansız çelik bir tünel inşa eder.

**Metafor:** Zırhlı, camları siyah filmli bir arabayla, sadece size özel yeraltı tünellerini kullanarak seyahat etmek gibidir. Yoldaki kameralar (İSS'niz) arabanın tünele girdiğini görür ama arabanın içinde kimin olduğunu veya tünelin içinden nereye gittiğini asla göremez.



### Nasıl Çalışır?
1. Cihazınızdaki (veya bilgisayarınızdaki) VPN yazılımını açtığınızda, tüm işletim sisteminizin ağ trafiği (tarayıcı, oyunlar, arka plan uygulamaları, güncellemeler vb.) anında **şifrelenir.**
2. Bu okunamaz haldeki şifreli paket, seçtiğiniz ülkedeki VPN sunucusuna gönderilir.
3. İSS'niz (Türk Telekom, Turkcell vb.) sizin verinize baktığında sadece karmaşık matematiksel kodlar (şifrelenmiş veri) görür. Nereye girdiğinizi, ne izlediğinizi bilemez.
4. Paket VPN sunucusuna ulaştığında, sunucu şifreyi çözer, **kendi IP adresini** pakete yazar ve hedef siteye (Örn: Netflix) yollar.
5. Hedef site cevabı VPN sunucusuna yollar, VPN sunucusu bu cevabı tekrar şifreleyerek cihazınıza gönderir.

### VPN'in Özellikleri:
* **İşletim Sistemi Seviyesinde Çalışır:** Arka planda çalışan hava durumu uygulamasından, oynadığınız online oyuna kadar bilgisayardan çıkan her bir bayt veri VPN tüneline girer.
* **Üst Düzey Güvenlik:** Askeri düzeyde şifreleme (AES-256 vb.) kullandığı için halka açık, şifresiz Wi-Fi ağlarında (kafeler, havalimanları) bile sizi siber saldırganlardan tam olarak korur.

---

## 4. Karşılaştırma Tablosu: Hangisi Nerede Kullanılır?

| Özellik | DNS Değiştirmek | Proxy Kullanmak | VPN Kullanmak |
| :--- | :--- | :--- | :--- |
| **Temel İşlev** | İsimleri IP'ye çevirir. (Rehber) | Aracı sunucu üzerinden IP gizler. | Tüm trafiği şifreler ve IP gizler. |
| **Kapsam** | Sadece web adresi çözümlemesi. | Sadece ayarlandığı uygulama (Örn: Tarayıcı). | Tüm cihaz (İşletim sistemi geneli). |
| **Veri Şifreleme** | Yok. | Genellikle Yok. | Var (Askeri Düzey Kriptografi). |
| **Güvenlik/Gizlilik** | Çok Düşük (İSS trafiği görür). | Orta (Site IP'nizi görmez ama İSS veriyi görür). | En Yüksek (İSS hiçbir şey göremez). |
| **Hız** | Hız kaybı yaratmaz. | Kullanılan sunucuya göre biraz yavaşlatabilir. | Şifreleme işlemi yüzünden internet hızını bir miktar düşürür. |
| **Kullanım Senaryosu**| Basit engelleri aşmak ve sitelere daha hızlı bağlanmak. | Bölge kısıtlamalı bir siteye girerken hızdan ödün vermemek. | Halka açık Wi-Fi'da güvenli kalmak, tam anonimlik sağlamak ve sansürü aşmak. |

**Özetle:** İnterneti bir okyanus olarak düşünürsek; DNS size rotayı çizen pusula, Proxy kılık değiştirerek bindiğiniz bir yolcu gemisi, VPN ise kimsenin radarına yakalanmadan derinden ilerleyen şahsi denizaltınızdır.