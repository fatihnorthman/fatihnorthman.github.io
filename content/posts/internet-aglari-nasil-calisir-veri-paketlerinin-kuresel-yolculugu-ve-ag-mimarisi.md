---
title: "İnternet Ağları Nasıl Çalışır? Veri Paketlerinin Küresel Yolculuğu ve Ağ Mimarisi"
date: 2026-05-03T09:38:00+03:00
draft: false
tags: ["İnternet", "Ağ Mimarisi", "Network", "TCP IP", "OSI Modeli", "Yönlendirme", "Routing", "BGP", "DNS", "İSS", "Fiber Optik", "Veri Paketleri", "Bilişim Teknolojileri", "Bilgisayar Ağları", "İletişim Protokolleri", "Teknoloji Rehberi", "Ağ Güvenliği", "Sistem Yöneticisi", "Router", "Switch", "IP Adresi", "IPv4", "IPv6"]
categories: ["Genel"]
author: "Fatih Northman"
description: "İnternet tam olarak nasıl çalışır? TCP/IP modelinden veri paketlerine, DNS çalışma mantığından BGP yönlendirme protokollerine kadar internet ağlarının küresel mimarisini detaylı rehberimizle keşfedin."
slug: "internet-aglari-nasil-calisir-veri-paketlerinin-kuresel-yolculugu-ve-ag-mimarisi"
weight: 1
image: "/images/1777801080649-network.jpg"
---

Çoğu insan interneti gökyüzünde süzülen soyut bir "bulut" (cloud) olarak hayal eder. Oysa internet, okyanusların altından geçen binlerce kilometrelik fiber optik kablolardan, devasa veri merkezlerinden ve evimizdeki modeme kadar uzanan, dünyanın gelmiş geçmiş en büyük **fiziksel ve mantıksal makinesidir.**

Bu devasa makinenin karmaşasını anlamak için, bir verinin cihazınızdan çıkıp dünyanın öbür ucundaki bir sunucuya ulaşma sürecini ve bu trafiği yöneten temel kuralları (protokolleri) incelememiz gerekir.

## 1. İnternetin Fiziksel Altyapısı: Ağların Ağı

İnternet (Inter-Network), kelime anlamı olarak "ağlar arası bağlantı" demektir. Sizin evinizdeki yerel ağınız (LAN), İnternet Servis Sağlayıcınızın (İSS - Örn: Türk Telekom, Superonline) ağına bağlanır. Sizin İSS'niz de küresel çaptaki devasa ana omurga sağlayıcılarına bağlanır.

*   **Tier 1 (Birinci Seviye) Sağlayıcılar:** Kendi aralarında ücretsiz veri alışverişi yapan, kıtaları okyanus altı fiber optik kablolarla birbirine bağlayan küresel devlerdir (Örn: AT&T, Level 3). İnternetin ana omurgasını (Backbone) oluştururlar.
*   **Tier 2 ve Tier 3 Sağlayıcılar:** Kendi ülkelerinde veya bölgelerinde hizmet veren, yerel ağları ana omurgaya bağlayan ve son kullanıcıya interneti ulaştıran şirketlerdir.

## 2. Veri Paketleri: Parçala ve Gönder

İnternette hiçbir veri (örneğin 1 GB'lık bir video dosyası) tek bir devasa blok halinde gönderilmez. Veriler, **Paket (Packet)** adı verilen binlerce küçük parçaya bölünür.

Bunun harika bir sebebi vardır: Eğer veri tek parça gitseydi, yolda yaşanacak ufak bir kopmada tüm dosyanın baştan gönderilmesi gerekirdi. Ayrıca tek bir dev dosya, tüm hattı meşgul ederek başkalarının internete girmesini engellerdi. Veriyi küçük paketlere bölmek, ağ üzerinde milyonlarca kullanıcının aynı anda, adil ve hızlı bir şekilde veri alışverişi yapmasını sağlar.

## 3. Kurallar Bütünü: TCP/IP Modeli

Bu paketlerin nasıl oluşturulacağı, adresleneceği ve yerine ulaştığında nasıl tekrar birleştirileceği belirli kurallara bağlıdır. İnternetin anayasası **TCP/IP Modeli**'dir. Dört ana katmandan oluşur:

### A. Uygulama Katmanı (Application Layer)
Sizin gördüğünüz kısımdır. Web tarayıcınız (HTTP/HTTPS), e-posta istemciniz (SMTP) veya dosya transfer programınız (FTP) bu katmanda çalışır. Veri burada insan tarafından anlaşılabilir haldedir.

### B. Taşıma Katmanı (Transport Layer)
Verinin güvenilirliğinden ve paketlere bölünmesinden sorumludur. İki ana aktörü vardır:
*   **TCP (Transmission Control Protocol):** Güvenilirdir. Paketlerin eksiksiz gittiğinden emin olur. Giden her paket için karşıdan "Aldım" (Acknowledge) onayı bekler. Eksik varsa tekrar yollar. (Web siteleri ve dosya indirmeleri için kullanılır).
*   **UDP (User Datagram Protocol):** Hızlı ama umursamazdır. Paketleri fırlatır ve ulaşıp ulaşmadığını kontrol etmez. (Canlı yayınlar, online oyunlar ve Zoom görüşmeleri gibi saniyelik gecikmelerin, kaybolan birkaç veriden daha önemli olduğu yerlerde kullanılır).

### C. İnternet Katmanı (Internet / Network Layer)
Paketlerin üzerine "Gönderen" ve "Alıcı" IP adreslerinin yazıldığı yerdir. Her paketin önüne bir "IP Başlığı" eklenir. 
*   **IP (Internet Protocol):** İnternete bağlı her cihazın benzersiz kimliğidir (Örn: `192.168.1.5` veya `8.8.8.8`).

### D. Ağ Erişim Katmanı (Network Access Layer)
IP adresleri ile paketlenmiş verinin, fiziksel olarak kablolar (Ethernet) veya radyo dalgaları (Wi-Fi) üzerinden elektrik sinyallerine veya ışık huzmelerine dönüştürülüp yola çıktığı katmandır. Burada cihazların fiziksel **MAC Adresleri** devreye girer.

## 4. DNS: İnternetin Telefon Rehberi

Bilgisayarlar sadece IP adreslerini (sayıları) anlar. Ancak siz tarayıcıya `142.250.184.206` yazmak yerine `google.com` yazarsınız.
İşte **DNS (Domain Name System)**, yazdığınız bu metin tabanlı alan adlarını, sunucunun IP adresine çeviren devasa ve dağıtık bir telefon rehberidir. Siz bir adresi yazdığınızda, cihazınız önce DNS sunucusuna gidip "Bu sitenin IP'si ne?" diye sorar.

## 5. Yönlendirme (Routing) ve BGP: İnternetin Postacıları

Paketiniz cihazınızdan çıkıp modeminize, oradan da servis sağlayıcınıza ulaştığında, hedef sunucunun dünyanın öbür ucunda (Örneğin ABD'de) olduğunu görür. Peki paket oraya hangi yoldan gidecektir?

İşte burada **Yönlendiriciler (Routers)** devreye girer. Yönlendiriciler, ağlar arasındaki kavşaklarda duran trafik polisleridir. Her yönlendirici paketin üzerindeki hedef IP adresine bakar ve kendi içindeki yönlendirme tablosuna (Routing Table) göre paketi bir sonraki en mantıklı kavşağa atar. 

Küresel çapta okyanusları ve kıtaları aşarken rotayı belirleyen ana protokole **BGP (Border Gateway Protocol)** denir. BGP, internetin haritasıdır ve o anki hat yoğunluğuna, kopan kablolara veya siyasi engellemelere göre paketin gideceği en kısa ve verimli rotayı saniyeler içinde hesaplar.

## 6. Bir Web Sayfasının Yüklenme Hikayesi (Özet)

1. Tarayıcıya bir adres yazarsınız.
2. Bilgisayarınız DNS'e bağlanarak sitenin IP adresini öğrenir.
3. Tarayıcınız, sitenin sunucusuna "Seninle konuşmak istiyorum" diyerek bir TCP bağlantısı kurar (Üçlü El Sıkışma - 3-Way Handshake).
4. Bağlantı kurulunca HTTP/HTTPS isteğinizi (Bana ana sayfayı gönder) yollar.
5. Sunucu bu isteği alır, web sitesini binlerce küçük veri paketine böler.
6. Paketler, üzerlerinde sizin IP adresinizle BGP yönlendiricileri üzerinden ülke ülke, düğüm düğüm seyahat eder. Bazen paketlerin yarısı İngiltere üzerinden, diğer yarısı Almanya üzerinden size gelebilir.
7. Modeminize ulaşan paketler, cihazınıza gelir. Taşıma katmanı (TCP) paketlerin eksik olup olmadığını kontrol eder.
8. Eksik yoksa paketler doğru sıraya dizilir ve tarayıcınızın ekranında okuduğunuz bir web sitesine dönüşür.

*Ve tüm bu anlattığımız süreç, siz "Enter" tuşuna bastıktan sonraki birkaç milisaniye içinde gerçekleşir.*