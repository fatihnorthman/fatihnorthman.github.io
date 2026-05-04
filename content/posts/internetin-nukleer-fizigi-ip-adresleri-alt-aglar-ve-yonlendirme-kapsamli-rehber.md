---
title: "İnternetin Nükleer Fiziği: IP Adresleri, Alt Ağlar ve Yönlendirme (Kapsamlı Rehber)"
date: 2026-05-04T08:49:42+03:00
draft: false
tags: ["IP Adresi", "IPv4", "IPv6", "Subnet Mask", "Alt Ağ Maskesi", "NAT", "DHCP", "CIDR", "Network", "Ağ Mimaris", "Ağ Uzmanı", "TCP IP Modeli", "Bilişim Teknolojileri", "Yönlendirme", "Router", "Modem", "Public IP", "Private IP", "RFC 1918", "Sistem Yöneticisi", "IT Altyapısı", "Teknoloji Eğitimi", "Siber Güvenlik", "Ağ Mühendisliği"]
categories: ["Genel"]
author: "Fatih Northman"
description: "IP adresleri gerçekte nasıl çalışır? IPv4'ün 32-bitlik mimarisi, alt ağ maskeleri (subnet mask), CIDR mantığı, NAT'ın hayat kurtaran rolü ve DHCP ile IPv6'nın detaylarını kapsayan ileri düzey ağ (network) rehberimizi keşfedin."
slug: "internetin-nukleer-fizigi-ip-adresleri-alt-aglar-ve-yonlendirme-kapsamli-rehber"
weight: 1
image: "/images/1777884582896-ip-sorgulama-5-1024x683.jpg"
---

İnternet dediğimiz devasa yapı, özünde milyarlarca cihazın birbirine veri paketleri fırlattığı devasa bir kaostur. Bu kaosu mükemmel işleyen bir makineye dönüştüren kural setine **TCP/IP Modeli**, bu ağdaki her bir cihazın benzersiz konumunu belirleyen sisteme ise **IP (Internet Protocol) Adresi** denir.

Önceki yazımızda temel mantığa değinmiştik. Şimdi ise kaputu açıp motorun içine, bitlerin, baytların ve yönlendirme tablolarının dünyasına giriyoruz.

---

## 1. IPv4'ün Anatomisi: 32-Bitlik Matematik

Bir IPv4 adresi genellikle `192.168.1.10` şeklinde, aralarında nokta bulunan dört sayıdan (oktet) oluşur. Bilgisayarlar bu onluk (desimal) sayıları anlamazlar; onlar için her şey 1 ve 0'dır.

IPv4, toplamda **32 bitlik** bir adresleme sistemidir. Her oktet (bölüm) 8 bitten oluşur (8 x 4 = 32 bit). 
Örneğin `192.168.1.10` adresinin bilgisayarın gözündeki gerçek hali şudur:
`11000000 . 10101000 . 00000001 . 00001010`

Her bir 8 bitlik bölüm, 0 ile 255 arasında bir değer alabilir (Çünkü 8 bitin alabileceği maksimum kombinasyon $2^8 = 256$'dır, 0 da dahil olunca 255'te biter). Bu mimari, teorik olarak dünyada maksimum **4.294.967.296** (yaklaşık 4.3 milyar) benzersiz IP adresi olabileceği anlamına gelir.



## 2. Ağ Sınıfları (A, B, C) ve CIDR Mantığı

1980'lerde internet ilk tasarlandığında, IP adresleri A, B ve C olmak üzere sınıflara (Class) ayrılmıştı.
*   **A Sınıfı:** Çok büyük şirketler içindi. İlk oktet ağı, kalan 3 oktet cihazları temsil ederdi (Bir ağda 16 milyon cihaz).
*   **B Sınıfı:** Orta ölçekli kurumlar içindi.
*   **C Sınıfı:** Küçük ağlar içindi. İlk üç oktet ağı, son oktet cihazları temsil ederdi (Bir ağda 254 cihaz).

Ancak bu sistem çok israflıydı. 300 bilgisayarı olan bir şirkete C sınıfı (254 cihaz) yetmiyor, B sınıfı (65.000 cihaz) verildiğinde ise binlerce IP adresi çöpe gidiyordu.

Bunu çözmek için **CIDR (Classless Inter-Domain Routing)** icat edildi. Artık IP adreslerinin sonuna bir `/` (Eğik çizgi) ve bir rakam konulmaya başlandı. Örneğin: `192.168.1.0 /24`. 
Bu sondaki `/24`, adresin **ilk 24 bitinin ağın adı olduğunu**, kalan 8 bitin ise cihazlara dağıtılabileceğini gösterir.

## 3. Alt Ağ Maskesi (Subnet Mask) Nasıl Çalışır?

Bir IP adresi tek başına hiçbir şey ifade etmez; her zaman bir **Alt Ağ Maskesi (Subnet Mask)** ile birlikte çalışmak zorundadır. Cihazınız, kime veri göndereceğine bu maskeye bakarak karar verir.

*   **IP Adresiniz:** `192.168.1.10`
*   **Ağ Maskeniz:** `255.255.255.0` (CIDR karşılığı /24'tür)

Cihazınız "AND" (VE) mantıksal operatörünü kullanarak IP adresi ile Maske'yi üst üste koyar. 255 olan kısımlar değişmez, 0 olan kısım sıfırlanır. Sonuç: `192.168.1.0`. İşte bu sizin **Ağ Adresinizdir (Network ID).**

Siz `192.168.1.50` adresine veri göndermek istediğinizde, bilgisayarınız hesaplar: *"Bu cihaz benimle aynı ağda, veriyi modeme (internete) yollamama gerek yok, doğrudan içerideki ağ kablosundan (Switch üzerinden) ona iletebilirim."*

## 4. IP Adresi Dağıtımı: DHCP'nin "DORA" Dansı

Bilgisayarınızı veya telefonunuzu Wi-Fi'ye bağladığınızda o `192.168.x.x` adresini elle girmezsiniz. Bu işi sizin yerinize modemin içindeki **DHCP (Dynamic Host Configuration Protocol)** sunucusu yapar. Bu işlem 4 adımdan oluşan, milisaniyelik bir "DORA" dansıdır:

1.  **D - Discover (Keşif):** Cihazınız ağa bağlandığı an bağırır: *"Burada bana IP verecek bir DHCP sunucusu var mı?"*
2.  **O - Offer (Teklif):** Modeminiz bu çığlığı duyar ve cevap verir: *"Evet varım, sana 192.168.1.20 adresini teklif ediyorum."*
3.  **R - Request (Talep):** Cihazınız yanıtlar: *"Harika, bu adresi kabul ediyorum, onu bana rezerve et."*
4.  **A - Acknowledge (Onay):** Modem işlemi bitirir: *"Tamamdır, adres senin. Ayrıca sana alt ağ maskesini, ağ geçidini (modemin adresi) ve DNS sunucularını da gönderiyorum."*

## 5. RFC 1918 ve NAT: İnternetin Çökmesini Engelleyen İkili

Daha önce bahsettiğimiz gibi, dünyada sadece 4.3 milyar IPv4 adresi vardır ve bu sayı 2011 yılında resmi olarak tükenmiştir. Peki şu an dünyada 20 milyardan fazla cihaz internete nasıl bağlanıyor? Cevap: **Private (Özel) IP'ler ve NAT.**

Mühendisler, IP havuzundan üç özel aralık belirlediler (RFC 1918 standardı):
*   `10.0.0.0` - `10.255.255.255`
*   `172.16.0.0` - `172.31.255.255`
*   `192.168.0.0` - `192.168.255.255`

Bu adresler **asla internete çıkamaz, yönlendirilemez.** Herkes kendi evinde, şirketinde veya kafesinde bu adresleri sonsuz kere, bedavaya kullanabilir. Sizin evinizde de bir `192.168.1.5` vardır, komşunuzda da, Japonya'daki bir evde de.



Peki internete nasıl çıkıyorlar? **NAT (Network Address Translation)** sayesinde. 
Evinizdeki 10 cihaz, modeme kadar kendi özel adresleriyle gelir. Modem, internete çıkış kapısında tüm bu cihazların paketlerini durdurur. Özel IP'yi siler, kendi üzerine tanımlı **tek bir geçerli (Public) IP adresini** pakete basar. Ancak hangi paketin kimden geldiğini karıştırmamak için her birine rastgele bir "Port Numarası" atar (Buna PAT - Port Address Translation denir). Site cevap verdiğinde, modem port numarasına bakar ve cevabı evin içindeki doğru cihaza yönlendirir. NAT olmasaydı, internet 15 yıl önce durmuş olurdu.

## 6. Gelecek Çoktan Geldi: IPv6 ve 128-Bitlik Sınırsızlık

NAT harika bir yara bandıdır ama interneti karmaşıklaştırmıştır. Kalıcı çözüm ise **IPv6**'dır. 

IPv6 adresleri 32 bit değil, tam **128 bittir**. Onluk sistem (0-9) yeterli olmadığı için onaltılık (Hexadecimal: 0-9 ve A-F) sistem kullanır.
Örnek bir IPv6 adresi:
`2001:0db8:85a3:0000:0000:8a2e:0370:7334`

*   **Sıkıştırma Kuralları:** Yazımı kolaylaştırmak için baştaki sıfırlar silinebilir ve ardışık sıfır blokları sadece bir kereye mahsus `::` (Çift iki nokta) ile kısaltılabilir. Üstteki adres şu hale gelir: `2001:db8:85a3::8a2e:370:7334`.



**IPv6'nın En Büyük Avantajları:**
1.  **Sınırsızlık:** Toplam $3.4 \times 10^{38}$ (340 undesilyon) adres sağlar. Dünyadaki her bir atoma birden fazla IP adresi verilebilir.
2.  **NAT'a Gerek Yok:** Adres sınırı olmadığı için evinizdeki akıllı ampulden buzdolabına kadar her cihaz doğrudan, benzersiz bir Public IPv6 adresi alabilir. NAT ortadan kalktığı için veri iletimi çok daha hızlı ve pürüzsüz olur.
3.  **Dahili Güvenlik:** IPv4'e sonradan yama olarak eklenen IPsec (şifreleme ve kimlik doğrulama) mimarisi, IPv6'da çekirdeğe entegre olarak varsayılan halde gelir.

İnternet altyapısı devasa olduğu için geçiş yavaş olmaktadır, ancak cep telefonu operatörleri ve dev veri merkezleri bugün trafiğinin çok büyük bir kısmını çoktan IPv6 üzerinden yürütmektedir.