+++
title = "Linux Terminal ve Dosya Sistemi Rehberi: Siyah Ekranın Gizemini Çözmek"
date = "2026-05-01"
weight = 1
slug = "linux-terminal-ve-dosya-sistemi-rehberi"
description = "Linux dünyasına adım atanlar için terminal komutlarından dosya sistemi hiyerarşisine (FHS) kadar her şeyi kapsayan, kapsamlı ve detaylı bir rehber."
tags = ["linux", "terminal", "rehber", "fhs", "dosya-sistemi", "yeni-baslayanlar"]
+++

Linux dünyasına ilk adımınızı attığınızda karşınıza çıkan en büyük "bariyer" genellikle terminaldir. Ancak bu siyah ekran, bir engel değil; sisteminizin tüm gücüne doğrudan erişmenizi sağlayan en hızlı ve en güvenilir araçtır. Bu rehberde, bir "bakıcı" olmaktan çıkıp sisteminizin gerçek "mimarı" olmanız için gereken temel bilgileri pikselliğiyle inceleyeceğiz.

---

## 1. Bölüm: Dosya Sistemi Hiyerarşisi (FHS)

Windows'ta her şey `C:` sürücüsü altındadır. Linux'ta ise her şey `/` (kök dizini) altındadır. Linux'ta her şey bir dosyadır (klavyeniz, sabit diskiniz, hatta işlemciniz bile).

### Temel Dizinlerin Anlamı

*   **`/` (Root):** Tüm sistemin başlangıç noktasıdır. Her şey buradan dallanır.
*   **`/bin` ve `/usr/bin`:** Sistemin temel komutlarının (ls, cd, cp gibi) bulunduğu yerdir.
*   **`/etc`:** Sistemin tüm konfigürasyon dosyalarının "kalbi"dir. Ayar değiştirecekseniz buraya bakarsınız.
*   **`/home`:** Kullanıcıların kişisel dosyalarının (Belgeler, İndirilenler...) bulunduğu "özel alan"dır.
*   **`/root`:** Sistemin en yetkili kullanıcısı (Süper Kullanıcı) için ayrılmış özel ev dizinidir.
*   **`/var`:** Sürekli değişen dosyaların (loglar, veritabanları) tutulduğu dizindir.
*   **`/tmp`:** Geçici dosyaların yeridir; sistem yeniden başladığında genellikle temizlenir.
*   **`/dev`:** Donanımların dosya olarak temsil edildiği yerdir (Örn: `sda` diskinizdir).

---

## 2. Bölüm: Temel Terminal Komutları

Terminalde işlem yapmak, sistemle doğrudan konuşmaktır. İşte her yeni kullanıcının bilmesi gereken "alfabe":

### Gezinme ve Dosya Listeleme
*   `pwd` (Print Working Directory): "Ben şu an neredeyim?" sorusunun cevabıdır.
*   `ls` (List): Bulunduğunuz dizindeki dosyaları listeler. `ls -la` derseniz gizli dosyaları da görürsünüz.
*   `cd` (Change Directory): Klasör değiştirmek için kullanılır. `cd ..` sizi bir üst klasöre taşır.

### Dosya ve Klasör İşlemleri
*   `mkdir` (Make Directory): Yeni bir klasör oluşturur. `mkdir rehber`
*   `touch`: Yeni ve boş bir dosya oluşturur. `touch notlar.txt`
*   `cp` (Copy): Dosya kopyalar. `cp dosya1.txt kopya.txt`
*   `mv` (Move): Dosyayı taşır veya ismini değiştirir. `mv eski_ad.txt yeni_ad.txt`
*   `rm` (Remove): Dosyayı siler. **DİKKAT:** Linux'ta geri dönüşüm kutusu yoktur (terminalden silinenler için). `rm -rf` klasörleri zorla siler, dikkatli olunmalıdır.

### Okuma ve Düzenleme
*   `cat`: Dosyanın içeriğini terminale yazdırır.
*   `less`: Uzun dosyaları sayfa sayfa okumanızı sağlar.
*   `nano` veya `vim`: Terminal tabanlı metin düzenleyicileridir. `nano ayarlar.conf`

---

## 3. Bölüm: Yetkiler ve Sudo Kavramı

Linux güvenlik odaklıdır. Sistemin kritik dosyalarını sıradan bir kullanıcı değiştiremez.

*   **`sudo` (SuperUser DO):** Bir komutu "yönetici haklarıyla" çalıştırmanızı sağlar. `sudo apt update` dediğinizde sistem sizden şifrenizi ister ve işlemi en yetkili ağızdan yapar.

### Dosya İzinleri
Terminalde `ls -l` yaptığınızda `-rwxr-xr-x` gibi ifadeler görürsünüz:
*   **r (read):** Okuma
*   **w (write):** Yazma
*   **x (execute):** Çalıştırma

Bu izinleri değiştirmek için `chmod` komutu kullanılır. (Örn: `chmod +x script.sh` bir dosyayı çalıştırılabilir yapar).

---

## 4. Bölüm: Paket Yönetimi

Linux'ta program kurmak için internetten `.exe` indirmezsiniz. Merkezi bir depodan (Repository) güvenli bir şekilde çekersiniz.

*   **Debian/Ubuntu/Mint:** `sudo apt install paket_adı`
*   **Arch/Manjaro:** `sudo pacman -S paket_adı`
*   **Fedora:** `sudo dnf install paket_adı`

---

### Sonuç: Korkmayın, Deneyin

Terminal, hata yapmaktan korkmamanız gereken bir yerdir. Yanlış bir komut yazdığınızda sistem genellikle sizi uyarır. Terminali kullanmaya başladıkça, grafik arayüzlerin (GUI) aslında ne kadar kısıtlayıcı olduğunu fark edeceksiniz.

Bu rehber sadece başlangıçtı. Linux bir denizdir ve terminal sizin bu denizdeki pusulanızdır. Pusulayı kullanmayı öğrendiğinizde, sisteminizin gerçek hakimi siz olacaksınız. Siyah ekranın gücü artık ellerinizde.
