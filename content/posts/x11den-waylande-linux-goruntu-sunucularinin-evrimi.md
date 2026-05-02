---
title: "X11'den Wayland'e: Linux Görüntü Sunucularının Evrimi"
date: 2026-05-02T09:28:15+03:00
draft: false
tags: ["Linux", "Wayland", "X11", "Xorg", "X Window System", "Display Server", "Görüntü Sunucusu", "XWayland", "Compositor", "Kompozitör", "Window Manager", "Pencere Yöneticisi", "V-Sync", "Screen Tearing", "Ekran Yırtılması", "DRM", "KMS", "evdev", "PipeWire", "Arch Linux", "CachyOS", "Ubuntu", "Fedora", "GNOME", "KDE Plasma", "Masaüstü Ortamı", "Desktop Environment", "Sistem Yöneticisi", "SysAdmin", "Açık Kaynak", "Open Source", "Özgür Yazılım", "Free Software", "Grafik Mimarisi", "Linux Çekirdeği", "Linux Kernel", "Linux Rehberi", "Linux Eğitimi", "Linux Masaüstü", "Teknoloji", "Yazılım", "Geliştirici", "Wayland Nedir", "X11 Nedir", "Wayland vs X11", "Linux Güvenlik", "Linux Performans"]
categories: ["Genel"]
author: "Fatih Northman"
description: "X11 ve Wayland nedir? Linux görüntü sunucularının çalışma mantığı, mimari farkları, performans ve güvenlik analizlerini içeren bu kapsamlı rehberi keşfedin."
slug: "x11den-waylande-linux-goruntu-sunucularinin-evrimi"
weight: 1
image: "/images/1777714095894-wayland-vs-x11.png"
---

# X11 ve Wayland: Linux Görüntü Sunucusu Teknolojilerinin Derinlemesine İncelenmesi

Linux dünyasında masaüstü ortamlarının grafiksel arayüzleri, donanım ile iletişim kurabilmek için bir **görüntü sunucusuna (display server)** ihtiyaç duyar. Yıllar boyunca bu görevi tartışmasız bir şekilde X11 üstlendi. Ancak modern donanımların gelişmesi, güvenlik ihtiyaçlarının artması ve daha pürüzsüz bir deneyim talebi, Wayland adında yeni bir teknolojinin doğmasına neden oldu. 

Bu rehberde, her iki teknolojinin ne olduğunu, nasıl çalıştığını, mimari farklılıklarını ve avantaj/dezavantajlarını kapsamlı bir şekilde inceleyeceğiz.

---

## 1. Görüntü Sunucusu (Display Server) Nedir?

En temel haliyle görüntü sunucusu; klavye, fare ve dokunmatik ekran gibi girdi (input) cihazlarından gelen verileri alan, uygulamalara ileten ve uygulamaların ekranda (output) pencereler halinde çizilmesini sağlayan çekirdek yazılımdır.

---

## 2. X11 (X Window System)

X Window System (kısaca X veya sürüm numarasıyla X11), 1980'lerde MIT'de geliştirilmiş bir görüntü sunucusu protokolüdür. Linux ve Unix benzeri sistemlerde onlarca yıl boyunca masaüstü grafiklerinin standart temeli olmuştur.

### Mimari ve Çalışma Mantığı
X11, **ağ şeffaflığı (network transparency)** üzerine kurulmuştur. Yani bir X uygulaması (İstemci/Client), fiziksel olarak başka bir bilgisayarda çalışıp görüntüyü ağ üzerinden sizin bilgisayarınızdaki X Sunucusuna (X Server) aktarabilir.

X11 mimarisinde ekrana bir şeyler çizmek oldukça dolambaçlı bir yoldur:
1. **İstemci (Uygulama):** Kullanıcı bir tuşa basar veya uygulama arayüzünü güncellemek ister. Bu isteği X Server'a iletir.
2. **X Server:** Gelen isteği Pencere Yöneticisine (Window Manager) gönderir.
3. **Pencere Yöneticisi:** Pencerenin nerede duracağına, boyutuna ve çerçevelerine karar verir, bu bilgiyi X Server'a geri yollar.
4. **Kompozitör (Compositor):** Modern X11 sistemlerinde gölgeler, saydamlık ve animasyonlar için bir kompozitör devreye girer. Görüntüyü birleştirip son halini X Server'a iletir.
5. **Ekran:** X Server son görüntüyü ekran kartına ve monitöre gönderir.

### Avantajları
* **Devasa Ekosistem ve Uyumluluk:** 30 yılı aşkın süredir geliştirildiği için hemen hemen her yazılım, oyun ve sürücü ile kusursuz çalışır.
* **Ağ Şeffaflığı:** Uygulamaları uzak bir sunucuda çalıştırıp yerel bilgisayarda görüntülemek çok kolaydır (X11 Forwarding).
* **Esneklik:** X11'in modüler yapısı, çok farklı ve özelleştirilmiş pencere yöneticilerinin (i3, bspwm, awesomewm vb.) ortaya çıkmasını sağlamıştır.

### Dezavantajları ve Sorunları
* **Karmaşıklık ve Eski Kod Tabanı:** X11 kodları çok eski ve gereksiz eklentilerle doludur. Modern grafik API'lerinin yapabileceği işleri kendi içinde yapmaya çalışır.
* **Ekran Yırtılması (Screen Tearing):** X11, modern "her kare için mükemmel senkronizasyon" mantığıyla tasarlanmadığı için videolarda veya oyunlarda ekran yırtılmaları sık görülür.
* **Güvenlik Zafiyeti:** X11'de izolasyon yoktur. Herhangi bir uygulama, X Server üzerinden sistemdeki diğer uygulamaların klavye girdilerini okuyabilir (Keylogger yazmak çok kolaydır).

---

## 3. Wayland

Wayland, 2008 yılında Red Hat geliştiricisi Kristian Høgsberg tarafından X11'in hantallığına ve güvenlik sorunlarına bir tepki olarak başlatılmış modern bir projedir. 

> **Önemli Not:** Wayland aslında bir yazılım veya sunucu değil, bir **protokoldür**. Wayland mimarisinde, görüntü sunucusu görevini **Kompozitör (Compositor)** üstlenir (Örn: GNOME için Mutter, KDE için KWin).

### Mimari ve Çalışma Mantığı
Wayland mimarisi, X11'in karmaşık döngüsünü ortadan kaldırarak aracıları devreden çıkarır.

1. **Çekirdek (Kernel):** Girdi (klavye/fare) Linux çekirdeği (evdev) üzerinden doğrudan Kompozitör'e gelir.
2. **Kompozitör:** Hangi pencerenin odakta olduğunu bilir ve girdiyi doğrudan o uygulamaya iletir.
3. **İstemci (Uygulama):** Arayüzünü günceller ve yeni karenin (frame) bilgisini doğrudan Kompozitör'e yollar.
4. **Kompozitör:** Tüm pencereleri birleştirir ve doğrudan Linux çekirdeğinin grafik altyapısı (DRM/KMS) üzerinden ekrana yollar.

### Avantajları
* **Pürüzsüz Görüntü (Tearing-Free):** Wayland "her kare mükemmeldir" felsefesiyle çalışır. V-Sync varsayılan olarak entegredir, ekran yırtılması yaşanmaz.
* **Üstün Güvenlik:** Wayland'de uygulamalar izole edilmiştir (Sandboxed). Bir uygulama, izniniz olmadan diğer bir uygulamanın ekranını kaydedemez veya klavye girdilerini çalamaz.
* **Modern ve Hafif Kod:** Gereksiz eski kodlardan arındırılmıştır, doğrudan modern Linux çekirdek grafik mimarisine entegredir.
* **Çoklu Monitör Desteği:** Farklı çözünürlük ve tazeleme hızlarına (refresh rate) sahip monitörleri yan yana kullanırken yaşanan sorunları kusursuz çözer (Örn: Bir monitör 144Hz, diğeri 60Hz iken takılma yapmaz).

### XWayland (Geriye Dönük Uyumluluk)
Wayland'in en büyük engeli, sadece X11 için yazılmış uygulamalardı. Bu sorunu çözmek için **XWayland** geliştirildi. XWayland, Wayland kompozitörünün içinde çalışan görünmez bir X11 sunucusudur. Eski uygulamalar X11 üzerinde çalıştıklarını sanır, ancak arka planda XWayland bu görüntüleri Wayland'in anlayacağı dile çevirerek ekrana basar.

---

## 4. X11 ve Wayland Karşılaştırma Tablosu

| Özellik | X11 | Wayland |
| :--- | :--- | :--- |
| **Temel Mantık** | Ağ tabanlı Görüntü Sunucusu | Doğrudan İletişim Protokolü |
| **Kod Tabanı** | Çok büyük, karmaşık ve eski (1980'ler) | Modern, hafif ve temiz (2000'ler) |
| **Güvenlik** | Zayıf (İzolasyon yok, uygulamalar birbirini izleyebilir) | Güçlü (İzole yapı, güvenli izin mekanizmaları) |
| **Ekran Yırtılması** | Sıklıkla yaşanabilir (Harici kompozitör çözümleri gerektirir) | Yaşanmaz (Kusursuz kare senkronizasyonu) |
| **Ağ Üzerinden Görüntü** | Doğrudan destekler (X Forwarding) | Doğrudan desteklemez (VNC, RDP, PipeWire vb. alternatifler kullanılır) |
| **Çoklu Monitör Uyumu** | Karma çözünürlük/Hz oranlarında sorunlar çıkarır | Farklı çözünürlük ve Hz değerlerinde kusursuz çalışır |

---

## Sonuç

X11, Linux masaüstünün bugünlere gelmesini sağlayan inanılmaz bir mühendislik başarısıdır ancak miadını doldurmuştur. Güvenlik ve performans beklentilerinin değiştiği günümüzde, kod tabanını daha fazla yamamak yerine yeni bir başlangıç yapılması zorunluydu.

Wayland, bu yeni başlangıcın adıdır. Günümüzde Fedora, Ubuntu ve daha birçok büyük Linux dağıtımı varsayılan olarak Wayland kullanmaktadır. Ekran paylaşımı, oyun performansı ve Nvidia sürücüleri gibi erken dönemlerde yaşanan sorunların büyük çoğunluğu (özellikle PipeWire teknolojisinin de gelişmesiyle) çözülmüştür. Gelecek kesinlikle Wayland'indir.