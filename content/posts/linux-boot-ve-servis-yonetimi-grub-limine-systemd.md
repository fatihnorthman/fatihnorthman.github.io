+++
title = "Linux Boot ve Servis Yönetimi: GRUB, Limine ve Systemd Dünyası"
date = "2026-05-01"
slug = "linux-boot-ve-servis-yonetimi-grub-limine-systemd"
description = "Linux sisteminizin nasıl başladığını ve servislerin arka planda nasıl yönetildiğini öğrenin. GRUB, Limine ve Systemd üzerine kapsamlı bir teknik rehber."
tags = ["linux", "boot", "systemd", "grub", "limine", "servis-yonetimi"]
+++

Bir bilgisayarın güç düğmesine bastığınız andan, karşınıza giriş ekranının gelmesine kadar geçen o birkaç saniye içinde devasa bir mühendislik operasyonu gerçekleşir. Linux dünyasında bu operasyonun başrol oyuncuları Bootloader'lar ve Init sistemleridir. Bu rehberde, sisteminizin "kalp atışlarını" başlatan bu yapıları pikselliğiyle inceleyeceğiz.

---

## 1. Bölüm: Bootloader - Sistemin Kapı Görevlisi

Bilgisayarınızın donanımı (BIOS veya UEFI), işletim sistemini nasıl başlatacağını bilmez. Bu noktada devreye Bootloader girer.

### GRUB (Grand Unified Bootloader)
Linux dünyasının en popüler ve "her işe yarayan" bootloader'ıdır. 
*   **Özelliği:** Son derece esnektir; Windows, Linux ve diğer sistemleri aynı anda yönetebilir.
*   **Ayar Dosyası:** `/etc/default/grub` (Değişiklik yaptıktan sonra `sudo update-grub` veya `grub-mkconfig` komutu gerekir).

### Limine
Modern, hafif ve özellikle "minimalist" severlerin yeni gözdesi.
*   **Özelliği:** GRUB'a kıyasla çok daha hızlıdır ve modern UEFI sistemleri için optimize edilmiştir.
*   **Ayar Dosyası:** `limine.conf`. Sadeliğiyle ön plana çıkar.

---

## 2. Bölüm: Systemd - Sistemin Orkestra Şefi

İşletim sistemi çekirdeği (kernel) yüklendikten sonra, ilk çalışan sürece (PID 1) **Init Sistemi** denir. Modern Linux dağıtımlarının neredeyse tamamı **Systemd** kullanır.

Systemd, sadece servisleri başlatmaz; sistem loglarını tutar, donanımları yönetir ve zamanlanmış görevleri yürütür.

### Temel Systemctl Komutları
Systemd ile etkileşim kurmak için `systemctl` aracını kullanırız:

*   **Servisi Başlatma:** `sudo systemctl start servis_adı`
*   **Servisi Durdurma:** `sudo systemctl stop servis_adı`
*   **Başlangıçta Çalışmasını Sağlama:** `sudo systemctl enable servis_adı` (Sistemi her açtığınızda otomatik başlar).
*   **Servis Durumunu Kontrol Etme:** `systemctl status servis_adı`
*   **Hataları Görme (Journalctl):** `sudo journalctl -u servis_adı` (Servis neden çalışmıyor? Cevabı buradadır).

---

## 3. Bölüm: Boot Süreci Nasıl İşler?

1.  **BIOS/UEFI:** Donanımı kontrol eder ve Bootloader'ı bulur.
2.  **Bootloader (GRUB/Limine):** Kernel'ı (çekirdeği) belleğe yükler.
3.  **Kernel:** Donanım sürücülerini yükler ve `systemd`yi (PID 1) başlatır.
4.  **Systemd:** Konfigüre edilen tüm servisleri (Ağ, Grafik arayüz, Veritabanı vb.) sırasıyla ayağa kaldırır.
5.  **Login:** Kullanıcı karşılama ekranı belirir.

### Neden Bilmelisiniz?
Sisteminiz bir gün açılmadığında veya bir uygulama "arka planda çalışmıyor" dediğinde, bakacağınız ilk yerler burasıdır. Bir servisi `enable` etmekle `start` etmek arasındaki farkı bilmek, bir Linux kullanıcısı için profesyonelliğe geçiş adımıdır.

---

### Sonuç: Kontrol Sizin Elinizde

Linux'un gücü, her şeyin şeffaf ve yapılandırılabilir olmasından gelir. Bootloader'ınızı değiştirebilir, servislerinizin ne zaman ve nasıl çalışacağına karar verebilirsiniz. Bu rehberle birlikte, sisteminizin "perde arkasındaki" o devasa operasyona hakim oldunuz. Siyah ekranın ardındaki orkestrayı yönetmek artık sizin elinizde.
 
 
 
