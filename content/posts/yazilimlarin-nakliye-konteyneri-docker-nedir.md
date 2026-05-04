---
title: "Yazılımların Nakliye Konteyneri: Docker Nedir?"
date: 2026-05-04T15:15:58+03:00
draft: false
tags: ["Docker", "Konteyner", "Container", "Virtual Machine", "Sanal Makine", "Linux", "Windows", "WSL 2", "Docker Desktop", "Yazılım Geliştirme", "Sistem Yöneticisi", "DevOps", "Microservices", "Mikroservis", "Bilişim Teknolojileri", "Dockerfile", "Docker Image", "Teknoloji Rehberi"]
categories: ["Yazılım"]
author: "Fatih Northman"
description: "Docker nedir ve sanal makinelerden (VM) farkı nedir? Linux ve Windows (WSL 2) sistemlerinde Docker konteyner mimarisinin nasıl çalıştığını bu kapsamlı rehberle keşfedin."
slug: "yazilimlarin-nakliye-konteyneri-docker-nedir"
weight: 1
image: "/images/1777907758329-docker.png"
---

Geçmişte uluslararası ticaret yapan gemilere yükleme yapmak bir kabustu. Çuvallar, fıçılar, sandıklar ve kutular üst üste yığılır, gemiye yüklenmesi haftalar sürer ve yolda mutlaka hasar görürdü. Sonra standart "Konteynerler" icat edildi. İçinde ne olduğu fark etmeksizin hepsi aynı boyuttaydı, aynı vinçle taşınıyor, gemiye ve tıra kusursuz oturuyordu.

İşte **Docker**, yazılım dünyasının standart nakliye konteyneridir. Geliştiricilerin yıllardır yaşadığı "Benim bilgisayarımda çalışıyordu, sunucuda neden çöktü?" krizini tarihe gömen devrimsel bir teknolojidir.

## 1. Problem: "Benim Bilgisayarımda Çalışıyordu!" Sendromu

Bir yazılım geliştiriyorsunuz. Bilgisayarınızda Python 3.8, PostgreSQL 12 ve belirli kütüphaneler kurulu. Kodunuz harika çalışıyor. Ancak bu kodu canlı sunucuya gönderdiğinizde sunucuda Python 3.9 kurulu olduğu için kod patlıyor. Veya test ekibinin bilgisayarındaki işletim sistemi farklı olduğu için uygulama hiç açılmıyor.

Eskiden bu sorunu çözmek için **Sanal Makineler (Virtual Machines - VM)** kullanılırdı.

## 2. Sanal Makine (VM) vs. Docker (Konteyner)

Sanal makineler, bir bilgisayarın içinde başka bir bilgisayar taklit eder. Sadece küçücük bir web sitesi yayınlamak için bile içine koca bir Windows veya Linux işletim sistemi kurmanız, ona GB'larca RAM ve işlemci çekirdeği tahsis etmeniz gerekir. Bu çok hantal bir yöntemdir.

**Docker (Konteynerizasyon)** ise yepyeni bir yaklaşım sunar:
Konteynerler, sanal makineler gibi koca bir işletim sistemini taklit etmez. Bunun yerine, üzerinde çalıştıkları ana bilgisayarın (Host) işletim sistemi çekirdeğini (Kernel) paylaşırlar.
*   **Hafiftir:** İçinde gereksiz işletim sistemi dosyaları olmadığı için boyutları Gigabaytlar değil, Megabaytlar seviyesindedir.
*   **Hızlıdır:** Başlatılmaları dakikalar değil, saliseler sürer.
*   **İzole ve Taşınabilirdir:** Bir konteynerin içine uygulamanızı, kütüphanelerinizi ve ayarlarınızı koyup mühürlersiniz. O konteyner sizin laptopunuzda nasıl çalışıyorsa, dünyanın öbür ucundaki devasa bir Amazon sunucusunda da **birebir aynı şekilde** çalışır.

## 3. Docker'ın Temel Kavramları

*   **Dockerfile (Tarif):** Uygulamanızın nasıl bir ortama ihtiyacı olduğunu yazdığınız basit bir metin dosyasıdır. (Örn: "Bana bir Ubuntu kur, içine Python yükle, sonra benim kodumu kopyala ve çalıştır.")
*   **Image (Kalıp / İmaj):** Dockerfile tarifinden üretilmiş, değiştirilemez dondurulmuş kalıplardır. CD-ROM'lara benzerler; içindeki veri salt okunurdur.
*   **Container (Konteyner):** İmajların hayata geçmiş, çalışan halidir. Bir "Ubuntu İmajı"ndan aynı anda yüzlerce "Ubuntu Konteyneri" çalıştırabilirsiniz.

## 4. Linux Üzerinde Docker: Kendi Evinde Çalışmak

Docker aslında doğuştan bir Linux teknolojisidir. Konteyner mantığı, Linux çekirdeğinin derinliklerindeki iki temel özelliğe dayanır:
1.  **Namespaces (İsim Alanları):** Uygulamaların birbirinden izole edilmesini (birbirini görememesini) sağlar.
2.  **Cgroups (Kontrol Grupları):** Bir uygulamanın ne kadar RAM veya CPU kullanabileceğini sınırlar.

Docker, Linux üzerinde **doğrudan (native)** çalışır. Arada hiçbir aracı veya emülatör yoktur. Bu yüzden konteynerler en yüksek performansı ve en düşük gecikmeyi Linux sunucularda (Ubuntu, Debian, CentOS, Arch vb.) verir.

## 5. Windows Üzerinde Docker: Sihirbazlık Numarası (WSL 2)

İşte işlerin ilginçleştiği yer burasıdır. Docker, Linux çekirdeğine ihtiyaç duyuyorsa Windows'ta nasıl çalışıyor?

Eskiden Windows üzerinde Docker kullanmak, arka planda gizlice hantal bir Hyper-V sanal makinesi çalıştırmak anlamına geliyordu, bu da performansı öldürüyordu. Ancak Microsoft'un **WSL 2 (Windows Subsystem for Linux)** teknolojisini duyurmasıyla oyunun kuralları değişti.

### WSL 2 ile Windows'ta Docker Mimarisi
Bugün Windows'a "Docker Desktop" kurduğunuzda, Docker doğrudan WSL 2 ile entegre olur. WSL 2, Windows'un kalbine gömülü, inanılmaz hafif ve inanılmaz hızlı gerçek bir Linux çekirdeğidir.
*   Siz Windows'ta komut istemine `docker run` yazdığınızda, komut anında arka plandaki bu hafif Linux çekirdeğine iletilir ve konteyneriniz saniyeler içinde orada çalışmaya başlar.
*   Bu sayede geliştiriciler, Windows'un rahat masaüstü deneyimini terk etmeden, sunucularında (Linux) çalışacak uygulamanın **birebir aynı ortamını** bilgisayarlarında test edebilirler.

### Windows Konteynerleri (Windows Containers)
Linux tabanlı konteynerlerin yanı sıra, Windows'un kendi yerel konteynerleri de vardır. Bunlar, arka planda Linux çekirdeği değil, Windows çekirdeği kullanır. Genellikle eski .NET Framework uygulamalarını (IIS üzerinde çalışan) modernleştirmek için şirketler tarafından tercih edilirler, ancak açık kaynak dünyasındaki standart her zaman Linux konteynerleridir.

**Sonuç:** İster kişisel bilgisayarınızda bir blog sitesi test ediyor olun, ister binlerce sunuculuk kurumsal bir mikroservis mimarisi yönetiyor olun, Docker kullanmak artık bir tercih değil, yazılım dünyasının tartışılmaz endüstri standardıdır.