---
title: "Bilgisayarın Kütüphanecisi ve Tercümanı: Dosya Sistemleri ve Uzantılar"
date: 2026-05-03T13:09:45+03:00
draft: false
tags: ["Dosya Sistemleri", "File System", "FAT32", "NTFS", "exFAT", "APFS", "ext4", "Linux", "Windows", "macOS", "Dosya Uzantıları", "File Extensions", "Bilgisayar Mimarisi", "Veri Depolama", "Harddisk", "SSD", "Bilişim Eğitimi", "Teknoloji Rehberi", "Siber Güvenlik", "Dosya Formatları", "PDF", "JPG", "EXE", "İşletim Sistemleri", "Bilgisayar Temelleri"]
categories: ["Genel"]
author: "Fatih Northman"
description: "Bilgisayarınız verileri nasıl saklar ve dosyaları nasıl tanır? FAT32, NTFS ve ext4 gibi dosya sistemlerinden dosya uzantılarının çalışma mantığına ve güvenlik risklerine kadar bilmeniz gereken her şeyi bu rehberde keşfedin."
slug: "bilgisayarin-kutuphanecisi-ve-tercumani-dosya-sistemleri-ve-uzantilar"
weight: 1

---

Bir bilgisayarın depolama birimine (HDD, SSD veya USB bellek) dışarıdan baktığınızda sadece bir metal veya plastik parçası görürsünüz. İçinde ise milyarlarca 0 ve 1'den oluşan devasa, kaotik bir veri okyanusu vardır. Peki bilgisayarınız aradığınız o tek bir fotoğrafı veya belgeyi bu okyanusun içinden saliseler içinde nasıl bulur? Ve bulduğu o veriyi nasıl oynatacağını nereden bilir?

İşte bu iki sorunun cevabı, bilgisayar biliminin en temel iki kavramında yatar: **Dosya Sistemleri (File Systems)** ve **Dosya Uzantıları (File Extensions)**.

---

## BÖLÜM 1: Dosya Sistemleri (Kütüphane İndeksi)

Dosya sistemi, işletim sisteminizin verileri disk üzerinde nasıl organize edeceğini, depolayacağını ve geri çağıracağını belirleyen kurallar bütünüdür. 

**Bir Metafor:** Boş bir hard diski, içinde hiç raf olmayan devasa bir depo gibi düşünün. Eşyaları (verileri) rastgele içeri atarsanız, daha sonra aradığınızı bulamazsınız. "Dosya Sistemi" kurmak (diski formatlamak), bu depoya raflar dizmek, her rafa bir numara vermek ve kapıya da hangi eşyanın hangi rafta olduğunu gösteren bir "Katalog" (İndeks) koymaktır.

### En Popüler Dosya Sistemleri ve Özellikleri

Farklı işletim sistemleri, verileri organize etmek için farklı mimariler kullanır:

#### 1. Windows Dünyası
*   **FAT32 (File Allocation Table):** Bilgisayar dünyasının en eski ve en evrensel dosya sistemidir. Windows, Mac, Linux, televizyonlar ve araba teypleri dahil her şey FAT32'yi okuyabilir. 
    *   *En Büyük Dezavantajı:* İçine tek parça halinde **4 GB'tan daha büyük bir dosya atamazsınız.** (Örneğin 5 GB'lık bir film dosyasını kopyalarken hata verir).
*   **exFAT:** FAT32'nin 4 GB limitini aşmak için tasarlanmış güncel versiyondur. Özellikle USB bellekler ve harici diskler için altın standarttır. Hem Windows hem de macOS'ta sorunsuz okunup yazılabilir.
*   **NTFS (New Technology File System):** Windows'un modern varsayılan dosya sistemidir. Diskinizin "C:" sürücüsü %99 ihtimalle NTFS'tir.
    *   *Avantajları:* Günlükleme (Journaling) özelliği sayesinde elektrik kesintilerinde veri kaybını önler. Dosya şifreleme ve kullanıcı izinleri (Security/Permissions) desteği sunar. 
    *   *Dezavantajı:* macOS cihazlar NTFS diskleri varsayılan olarak sadece "okuyabilir", içlerine veri "yazamaz".

#### 2. Apple / macOS Dünyası
*   **HFS+ (Mac OS Extended):** Yıllarca Mac'lerin varsayılan dosya sistemiydi. Ancak mekanik diskler (HDD) için tasarlandığından günümüzde yerini APFS'ye bıraktı.
*   **APFS (Apple File System):** Apple'ın SSD'ler (Katı Hal Sürücüleri) için sıfırdan geliştirdiği, inanılmaz hızlı ve modern dosya sistemidir. Anlık kopyalama ve "Snapshot" (sistemin geçmiş anlık görüntülerini alma) özellikleriyle öne çıkar.

#### 3. Linux Dünyası
*   **ext4 (Fourth Extended File System):** Linux dünyasının en yaygın ve kaya gibi sağlam dosya sistemidir. Çoğu Linux dağıtımı (Ubuntu, Mint vb.) varsayılan olarak bunu kullanır.
*   **Btrfs ve ZFS:** Yeni nesil, ileri düzey dosya sistemleridir. Veri bozulmalarını kendi kendine tespit edip onarabilme (Self-healing), anlık yedekleme ve diskleri birleştirme özellikleriyle sunucu (server) ve ileri düzey sistem yöneticilerinin favorileridir.

---

## BÖLÜM 2: Dosya Uzantıları (Tercüman)

Dosya sisteminin yardımıyla veriyi diskte bulduk. Peki bu veri bir şarkı mı, bir fotoğraf mı yoksa zararlı bir virüs mü? İşletim sisteminin bunu anlaması için **Dosya Uzantılarına** ihtiyacı vardır.

Dosya uzantısı, dosya adının sonuna konulan bir noktadan sonraki 3 veya 4 harfli koddur (Örn: `vesikalik.jpg`).

### İşletim Sistemleri Uzantılara Nasıl Bakar?

*   **Windows'un Mantığı:** Windows, dosya uzantılarına körü körüne güvenir. Eğer bir dosyanın sonu `.mp3` bitiyorsa, Windows onu doğrudan bir müzik çalar ile açmaya çalışır. Uzantıyı silerseniz, Windows o dosyanın ne olduğunu bilemez ve size "Bunu hangi programla açayım?" diye sorar.
*   **Linux ve macOS'un Mantığı (Sihirli Numaralar):** Linux ve Mac, uzantılara o kadar bağımlı değildir. Bir dosyanın türünü anlamak için dosyanın içine (başlığına) bakar. Her dosya türünün kodlarının en başında onu tanımlayan "Magic Numbers" (Sihirli Numaralar / Dosya İmzası) bulunur. Dosyanın adını `resim.txt` yapsanız bile, Linux onun aslında bir PNG resmi olduğunu içindeki kodlardan anlar ve resim görüntüleyici ile açar.

### Sık Karşılaşılan Uzantı Aileleri

**1. Metin ve Belgeler:**
*   `.txt`: Dümdüz, formatsız metin (Not Defteri).
*   `.md` (Markdown): Yazılımcıların favorisi, basit işaretlerle formatlanabilen metin.
*   `.pdf` (Portable Document Format): Hangi cihaza gönderirseniz gönderin fontu ve dizgisi bozulmayan, evrensel baskı belgesi formatı.

**2. Görüntü ve Fotoğraflar:**
*   `.jpg / .jpeg`: Kaliteden biraz ödün vererek dosya boyutunu küçülten sıkıştırılmış fotoğraf formatı.
*   `.png`: Arka planı şeffaf (saydam) olabilen ve kalite kaybı yaşatmayan grafik formatı.
*   `.svg`: Ne kadar yaklaşırsanız yaklaşın asla piksellenmeyen (bozulmayan) vektörel çizim formatı.
*   `.webp`: Google'ın geliştirdiği, sitelerin hızlı açılması için hem çok kaliteli hem çok düşük boyutlu modern web görseli formatı.

**3. Çalıştırılabilir Dosyalar (Programlar):**
*   `.exe`: Windows'un temel uygulama/program dosyası (Executable).
*   `.msi`: Windows kurulum (yükleme) paketi.
*   `.apk`: Android işletim sisteminin uygulama kurulum dosyası.
*   `.sh`: Linux ve macOS terminalinde çalıştırılan komut (script) dosyası.

**4. Sıkıştırılmış Arşivler:**
*   `.zip / .rar`: Birden fazla dosyayı tek bir paket haline getirip boyutunu küçülten arşiv formatları.
*   `.tar.gz`: Linux dünyasının en meşhur sıkıştırma paketidir (Tarball).

---

## KRİTİK UYARI: Uzantılar ve Siber Güvenlik

Siber saldırganların en çok kullandığı yöntemlerden biri "Uzantı Gizleme" taktiğidir. 

Windows, görünümü sadeleştirmek için varsayılan olarak "Bilinen dosya türleri için uzantıları gizle" ayarıyla gelir. Hackerlar size `Fatura_Detay.pdf.exe` adında bir virüs gönderir. Windows sondaki `.exe` kısmını gizlediği için siz dosyayı `Fatura_Detay.pdf` olarak görürsünüz. İkonu da PDF ikonuna benzetilmiştir. Siz bir fatura açtığınızı sanıp çift tıklarsınız, ancak arka planda bir `.exe` programı (fidye virüsü veya trojan) çalıştırıp tüm sisteminizi ele geçirmiş olursunuz.

**Güvenlik Tavsiyesi:** Hangi işletim sistemini kullanırsanız kullanın, klasör görünüm ayarlarından mutlaka **"Dosya adı uzantılarını göster"** seçeneğini aktif edin. Ne açtığınızı her zaman tam adıyla görün.