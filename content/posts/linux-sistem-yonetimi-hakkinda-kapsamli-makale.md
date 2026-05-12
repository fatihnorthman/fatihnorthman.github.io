---
title: "Linux Sistem Yönetimi Hakkında Kapsamlı Makale"
date: 2026-05-12T18:13:23+03:00
lastmod: 2026-05-12T18:13:23+03:00
draft: false
tags: ["Linux", "SistemYönetimi", "SysAdmin", "LinuxSecurity", "OpenSource", "DevOps", "Cybersecurity", "BilgiGüvenliği", "LinuxTips", "ServerManagement", "ITSecurity", "Bash", "CloudComputing", "Infrastructure", "TechTurkiye", "Yazılım", "SistemGüvenliği", "NetworkSecurity", "LinuxAdmin", "Programlama"]
categories: ["Genel"]
author: "Fatih Northman"
description: "Linux sistem yönetimi; kullanıcı denetimi, dosya izinleri, güvenlik denetimi ve servis yönetimini kapsayan bu kapsamlı rehber, hem yeni başlayan hem de deneyimli sistem yöneticileri için pratik komutlar ve en iyi pratiklerle hazırlanmıştır."
slug: "linux-sistem-yonetimi-hakkinda-kapsamli-makale"
readingTime: true
weight: 1
image: "/images/1778609602010-linux-nasil-kurulur-1719834963.webp"
---

## İçindekiler

1. [Linux'a Genel Bakış](#linuxa-genel-bakış)
2. [Kullanıcı Yönetimi](#kullanıcı-yönetimi)
3. [Grup Yönetimi](#grup-yönetimi)
4. [Dosya İzinleri ve Sahipliği](#dosya-izinleri-ve-sahipliği)
5. [Süreç Yönetimi](#süreç-yönetimi)
6. [Disk ve Dosya Sistemi Yönetimi](#disk-ve-dosya-sistemi-yönetimi)
7. [Ağ Yönetimi](#ağ-yönetimi)
8. [Servis ve Daemon Yönetimi (systemd)](#servis-ve-daemon-yönetimi-systemd)
9. [Günlük (Log) Yönetimi](#günlük-log-yönetimi)
10. [Güvenlik ve Denetim](#güvenlik-ve-denetim)
11. [Zamanlama: cron ve systemd Timers](#zamanlama-cron-ve-systemd-timers)
12. [Paket Yönetimi](#paket-yönetimi)
13. [Performans İzleme](#performans-izleme)
14. [Yedekleme Stratejileri](#yedekleme-stratejileri)

---

## Linux'a Genel Bakış

Linux, Unix tabanlı açık kaynaklı bir işletim sistemi çekirdeğidir. 1991 yılında Linus Torvalds tarafından geliştirilmeye başlanan bu çekirdek, bugün sunucuların büyük çoğunluğunda, bulut altyapılarında, gömülü sistemlerde ve süper bilgisayarlarda kullanılmaktadır.

### Temel Kavramlar

**Çekirdek (Kernel):** İşletim sisteminin kalbi; donanım ile yazılım arasındaki iletişimi yönetir.

**Kabuk (Shell):** Kullanıcının komutlarını çekirdeğe ileten yorumlayıcı. En yaygınları: `bash`, `zsh`, `sh`, `fish`.

**Dosya Sistemi Hiyerarşisi:** Linux'ta her şey bir dosyadır. Kök dizin `/` ile başlar.

```
/
├── bin/       # Temel kullanıcı komutları
├── boot/      # Önyükleme dosyaları
├── dev/       # Aygıt dosyaları
├── etc/       # Sistem yapılandırma dosyaları
├── home/      # Kullanıcı ev dizinleri
├── lib/       # Kütüphaneler
├── opt/       # İsteğe bağlı yazılımlar
├── proc/      # Süreç bilgileri (sanal dosya sistemi)
├── root/      # Root kullanıcısının ev dizini
├── sbin/      # Sistem yönetici komutları
├── srv/       # Servis verileri
├── sys/       # Çekirdek ve aygıt bilgileri (sanal)
├── tmp/       # Geçici dosyalar
├── usr/       # Kullanıcı programları ve verileri
└── var/       # Değişken veriler (log, spool, cache)
```

---

## Kullanıcı Yönetimi

Linux, çok kullanıcılı bir sistemdir. Her kullanıcı benzersiz bir kimlikle tanımlanır ve sistem kaynakları üzerindeki yetkileri bu kimliğe göre belirlenir.

### Kullanıcı Bilgilerinin Depolandığı Dosyalar

**`/etc/passwd`** — Kullanıcı hesap bilgileri

```
kullanici:x:1001:1001:Tam Ad:/home/kullanici:/bin/bash
```

| Alan | Açıklama |
|---|---|
| `kullanici` | Kullanıcı adı |
| `x` | Parola (şifrelenmiş hali `/etc/shadow` içinde) |
| `1001` | Kullanıcı ID (UID) |
| `1001` | Grup ID (GID) |
| `Tam Ad` | Açıklama / gerçek ad |
| `/home/kullanici` | Ev dizini |
| `/bin/bash` | Varsayılan kabuk |

**`/etc/shadow`** — Şifrelenmiş parolalar ve parola politikaları (yalnızca root okuyabilir)

**`/etc/group`** — Grup tanımları

### Kullanıcı Oluşturma

```bash
# Yeni kullanıcı oluşturma (ev dizini otomatik oluşturulur)
useradd -m -s /bin/bash ahmet

# Parola belirleme
passwd ahmet

# Gelişmiş kullanıcı oluşturma
useradd -m \
        -s /bin/bash \
        -c "Ahmet Yilmaz" \
        -G sudo,docker \
        -e 2025-12-31 \
        ahmet
```

`useradd` seçenekleri:

| Seçenek | Açıklama |
|---|---|
| `-m` | Ev dizinini oluştur |
| `-s` | Kabuk belirt |
| `-c` | Yorum / gerçek ad |
| `-G` | Ek gruplar |
| `-e` | Hesap son kullanma tarihi (YYYY-AA-GG) |
| `-u` | UID belirt |
| `-d` | Ev dizinini özel belirt |

### Kullanıcı Düzenleme

```bash
# Kullanıcıyı sudo grubuna ekle
usermod -aG sudo ahmet

# Kabuğu değiştir
usermod -s /bin/zsh ahmet

# Hesabı kilitle
usermod -L ahmet

# Hesabı aç
usermod -U ahmet

# Ev dizinini taşı
usermod -d /yeni/dizin -m ahmet

# Kullanıcı adını değiştir
usermod -l yeniisim eskiisim
```

> **Dikkat:** `-aG` kullanırken `-a` (append) bayrağını unutmak, kullanıcının mevcut tüm gruplarını siler.

### Kullanıcı Silme

```bash
# Kullanıcıyı sil (ev dizinini korur)
userdel ahmet

# Kullanıcıyı ve ev dizinini sil
userdel -r ahmet
```

### Kullanıcı Bilgilerini Görüntüleme

```bash
# Mevcut kullanıcıyı göster
whoami

# Kullanıcı ID ve grup bilgileri
id ahmet

# Sisteme giriş yapmış kullanıcılar
who
w

# Son giriş kayıtları
last
lastlog

# Kullanıcı detayları
finger ahmet   # finger paketi gerektirebilir
getent passwd ahmet
```

### Parola Politikası

```bash
# Parola bilgilerini görüntüle
chage -l ahmet

# Parolanın 90 günde bir değiştirilmesini zorla
chage -M 90 ahmet

# Minimum parola yaşı (gün)
chage -m 7 ahmet

# Parola son kullanma tarihi
chage -E 2025-12-31 ahmet

# Parola değiştirmeyi zorla (bir sonraki girişte)
chage -d 0 ahmet
```

---

## Grup Yönetimi

Gruplar, kullanıcıları bir araya getirerek kaynak erişimini toplu olarak yönetmenizi sağlar.

### Grup Türleri

- **Birincil Grup (Primary Group):** Kullanıcı oluşturulduğunda otomatik atanan grup. Yeni dosyalar bu grupla sahiplendirilir.
- **İkincil Grup (Secondary Group):** Kullanıcının ek yetkiler aldığı gruplar (örn: `docker`, `sudo`, `www-data`).

### Grup İşlemleri

```bash
# Grup oluştur
groupadd gelistiriciler

# GID belirterek grup oluştur
groupadd -g 2000 gelistiriciler

# Gruba kullanıcı ekle
gpasswd -a ahmet gelistiriciler

# Gruptan kullanıcı çıkar
gpasswd -d ahmet gelistiriciler

# Grubu sil
groupdel gelistiriciler

# Grup adını değiştir
groupmod -n yeniisim eskiisim

# Kullanıcının gruplarını listele
groups ahmet
id ahmet
```

---

## Dosya İzinleri ve Sahipliği

Linux'un güvenlik modelinin temelini dosya izinleri oluşturur. Her dosya ve dizin için üç düzeyde izin tanımlanır.

### İzin Yapısı

```
-rwxr-xr--  1  ahmet  gelistiriciler  4096  May 10 14:30  betik.sh
||||||||||| |  |||||  ||||||||||||||  ||||  |||||||||||||  ||||||||
  |||||||||  |    |         |            |         |          |
  |||||||||  |    |         |            |         |          +-- Dosya adı
  |||||||||  |    |         |            |         +-- Tarih
  |||||||||  |    |         |            +-- Boyut
  |||||||||  |    |         +-- Grup sahibi
  |||||||||  |    +-- Kullanıcı sahibi
  |||||||||  +-- Bağlantı sayısı
  ||||||||+-- Diğerleri: okuma (r)
  |||||||+--- Diğerleri: yazma (-)
  ||||||+---- Diğerleri: çalıştırma (-)
  |||||+----- Grup: okuma (r)
  ||||+------ Grup: yazma (-)
  |||+------- Grup: çalıştırma (x)
  ||+-------- Sahip: okuma (r)
  |+--------- Sahip: yazma (w)
  +---------- Sahip: çalıştırma (x)
```

**Dosya tipi karakterleri:**

| Karakter | Anlam |
|---|---|
| `-` | Normal dosya |
| `d` | Dizin |
| `l` | Sembolik bağlantı |
| `c` | Karakter aygıtı |
| `b` | Blok aygıtı |
| `p` | Named pipe |
| `s` | Soket |

### İzin Sayısal Değerleri

| İzin | Sayısal | Binary |
|---|---|---|
| `---` | 0 | 000 |
| `--x` | 1 | 001 |
| `-w-` | 2 | 010 |
| `-wx` | 3 | 011 |
| `r--` | 4 | 100 |
| `r-x` | 5 | 101 |
| `rw-` | 6 | 110 |
| `rwx` | 7 | 111 |

### chmod — İzin Değiştirme

```bash
# Sembolik yöntem
chmod u+x betik.sh          # Sahibine çalıştırma izni ekle
chmod g-w dosya.txt         # Gruptan yazma iznini kaldır
chmod o=r dosya.txt         # Diğerlerine yalnızca okuma ver
chmod a+r dosya.txt         # Herkese okuma izni ekle (a = all)
chmod u+x,g+r,o-rwx betik.sh

# Sayısal (oktal) yöntem
chmod 755 betik.sh   # rwxr-xr-x
chmod 644 dosya.txt  # rw-r--r--
chmod 600 gizli.txt  # rw-------
chmod 700 ozel/      # rwx------

# Özyinelemeli (recursive)
chmod -R 755 /var/www/html/
```

**Yaygın izin kombinasyonları:**

| Oktal | Sembolik | Kullanım alanı |
|---|---|---|
| `777` | `rwxrwxrwx` | Herkese tam erişim (güvensiz) |
| `755` | `rwxr-xr-x` | Web sunucu dizinleri, çalıştırılabilir dosyalar |
| `644` | `rw-r--r--` | Web içeriği, yapılandırma dosyaları |
| `600` | `rw-------` | SSH anahtarları, gizli dosyalar |
| `700` | `rwx------` | Özel çalıştırılabilir dosyalar |
| `400` | `r--------` | Salt okunur hassas dosyalar |

### chown — Sahipliği Değiştirme

```bash
# Sahip değiştir
chown ahmet dosya.txt

# Sahip ve grubu birlikte değiştir
chown ahmet:gelistiriciler dosya.txt

# Yalnızca grubu değiştir
chown :gelistiriciler dosya.txt
# veya
chgrp gelistiriciler dosya.txt

# Özyinelemeli
chown -R www-data:www-data /var/www/html/
```

### Özel İzin Bitleri

**SetUID (SUID):** Dosya çalıştırıldığında, çalıştıran kullanıcı değil dosyanın sahibi kimliğiyle çalışır.

```bash
chmod u+s /usr/bin/passwd
# veya
chmod 4755 /usr/bin/passwd
# Görünüm: -rwsr-xr-x
```

**SetGID (SGID):** Dosyalarda sahibin grubu kimliğiyle çalışır. Dizinlerde ise altında oluşturulan dosyalar dizinin grubunu devralır.

```bash
chmod g+s /paylasim/
# Görünüm (dizin): drwxrwsr-x
```

**Sticky Bit:** Dizinde yalnızca dosyanın sahibi veya root o dosyayı silebilir.

```bash
chmod +t /tmp
# Görünüm: drwxrwxrwt
```

### ACL — Genişletilmiş Erişim Kontrol Listeleri

Standart izin modeli yalnızca üç aktör (sahip, grup, diğerleri) tanır. ACL ile birden fazla kullanıcı veya grup için ayrı ayrı izin tanımlanabilir.

```bash
# ACL izinlerini görüntüle
getfacl dosya.txt

# Kullanıcıya ACL izni ver
setfacl -m u:mehmet:rw dosya.txt

# Gruba ACL izni ver
setfacl -m g:analitik:r dosya.txt

# ACL iznini kaldır
setfacl -x u:mehmet dosya.txt

# Tüm ACL'leri kaldır
setfacl -b dosya.txt

# Özyinelemeli
setfacl -R -m u:mehmet:rw /paylasim/
```

---

## Süreç Yönetimi

### Süreç Kavramları

Her çalışan program bir **süreç (process)** oluşturur. Her sürecin benzersiz bir **PID (Process ID)** vardır. Süreçler hiyerarşik olarak düzenlenir; her sürecin bir ebeveyni (**PPID**) bulunur.

**Süreç durumları:**

| Durum | Harf | Açıklama |
|---|---|---|
| Çalışıyor | R | CPU'da veya çalışmayı bekliyor |
| Uyuyor | S | Kesilebilir uyku (I/O bekleniyor) |
| Derin uyku | D | Kesilemeyen uyku |
| Durdurulmuş | T | Sinyal ile durdurulmuş |
| Zombie | Z | Tamamlandı, ebeveyn temizlemedi |

### Süreçleri Görüntüleme

```bash
# Anlık süreç listesi
ps aux
ps -ef

# Belirli süreci ara
ps aux | grep nginx

# Ağaç görünümü
pstree
pstree -p   # PID'lerle birlikte

# Gerçek zamanlı izleme
top
htop        # Daha gelişmiş arayüz (kurulum gerekebilir)

# Belirli kullanıcının süreçleri
ps -u ahmet

# Süreç PID'ini bul
pgrep nginx
pidof nginx
```

### Sinyal Gönderme

```bash
# Süreci düzgün sonlandır (SIGTERM)
kill 1234
kill -15 1234
kill -TERM 1234

# Süreci zorla sonlandır (SIGKILL)
kill -9 1234
kill -KILL 1234

# Sürecin yapılandırmasını yeniden yükle (SIGHUP)
kill -1 1234

# İsme göre sinyal gönder
pkill nginx
pkill -9 nginx
killall nginx

# Tüm sinyal listesi
kill -l
```

**Temel sinyaller:**

| Sinyal | Numara | Açıklama |
|---|---|---|
| SIGHUP | 1 | Yeniden yükle |
| SIGINT | 2 | Ctrl+C ile kesme |
| SIGQUIT | 3 | Çekirdek dökümü ile çıkış |
| SIGKILL | 9 | Anında sonlandır (yakalanamaz) |
| SIGTERM | 15 | Nazik sonlandırma |
| SIGSTOP | 19 | Duraklat (yakalanamaz) |
| SIGCONT | 18 | Devam ettir |

### Arka Plan ve Ön Plan

```bash
# Komutu arka planda başlat
komut &

# Çalışan işi arka plana al (önce Ctrl+Z ile durdur)
bg %1

# Arka plan işini ön plana getir
fg %1

# İş listesi
jobs

# Terminali kapatınca da çalışmaya devam etsin
nohup uzun-komut &
screen -S oturum-adi
tmux new -s oturum-adi
```

### nice ve renice — Öncelik Ayarı

Nice değeri -20 (en yüksek öncelik) ile 19 (en düşük öncelik) arasındadır.

```bash
# Düşük öncelikle başlat
nice -n 10 yedekleme-scripti.sh

# Çalışan sürecin önceliğini değiştir
renice -n 5 -p 1234

# Root olarak yüksek öncelik ver
renice -n -5 -p 1234
```

---

## Disk ve Dosya Sistemi Yönetimi

### Disk Kullanımını İzleme

```bash
# Bağlı dosya sistemlerinin kullanımı
df -h
df -hT   # Dosya sistemi tipini de göster

# Dizin ve dosya boyutları
du -sh /var/log/
du -h --max-depth=1 /home/
du -ah /etc/ | sort -rh | head -20

# Dosya sistemi bilgisi
lsblk
lsblk -f   # UUID ve dosya sistemi tipiyle birlikte

# Disk bölüm tablosu
fdisk -l
parted -l
```

### Disk Bölümlendirme

```bash
# fdisk ile etkileşimli bölümlendirme
fdisk /dev/sdb
# n = yeni bölüm
# p = birincil
# w = kaydet ve çık

# Dosya sistemi oluşturma
mkfs.ext4 /dev/sdb1
mkfs.xfs /dev/sdb2
mkfs.vfat /dev/sdb3
```

### Bağlama (Mount)

```bash
# Manuel bağlama
mount /dev/sdb1 /mnt/veri

# Dosya sistemi tipini belirt
mount -t ext4 /dev/sdb1 /mnt/veri

# Bağlı dosya sistemleri
mount | column -t

# Bağlantıyı kes
umount /mnt/veri
umount -l /mnt/veri   # Meşgulse zorla

# Kalıcı bağlama: /etc/fstab
# <aygıt>          <bağlama noktası>  <tip>   <seçenekler>       <dump> <geçiş>
UUID=abc123...     /mnt/veri          ext4    defaults,nofail    0      2
```

### LVM — Mantıksal Birim Yöneticisi

LVM, diskleri esnek biçimde yönetmeyi sağlar; birimleri yeniden boyutlandırmak ve anlık görüntü (snapshot) almak kolaylaşır.

```bash
# Fiziksel birim oluştur
pvcreate /dev/sdb /dev/sdc

# Birim grubu oluştur
vgcreate veri-grubu /dev/sdb /dev/sdc

# Mantıksal birim oluştur (50 GB)
lvcreate -L 50G -n veritabani veri-grubu

# Boyutu genişlet (%100 boş alanı kullan)
lvextend -l +100%FREE /dev/veri-grubu/veritabani

# Dosya sistemini de genişlet
resize2fs /dev/veri-grubu/veritabani    # ext4 için
xfs_growfs /mnt/veritabani              # xfs için

# Bilgi görüntüle
pvs
vgs
lvs
pvdisplay
vgdisplay
lvdisplay
```

---

## Ağ Yönetimi

### Ağ Arayüzleri

```bash
# Arayüzleri listele (modern yöntem)
ip addr show
ip a

# Belirli arayüz
ip addr show eth0

# Bağlantı durumu
ip link show

# Eski yöntem (deprecated)
ifconfig

# Yönlendirme tablosu
ip route show
ip r

# ARP tablosu
ip neigh show
arp -n
```

### Bağlantı Testi ve Tanılama

```bash
# ICMP ping
ping 8.8.8.8
ping -c 4 google.com

# Rota izleme
traceroute google.com
tracepath google.com

# DNS sorgusu
nslookup google.com
dig google.com
dig google.com MX
dig @8.8.8.8 google.com

# Bağlantı noktası tarama (yerel)
ss -tlnp           # TCP, dinleme, sayısal, süreç
ss -ulnp           # UDP
netstat -tlnp      # Eski yöntem

# Uzak porta bağlantı testi
nc -zv hedef.com 80
telnet hedef.com 80
```

### Güvenlik Duvarı (firewalld ve iptables)

**firewalld (modern, zone tabanlı):**

```bash
# Durum
firewall-cmd --state
firewall-cmd --list-all

# Zone'ları listele
firewall-cmd --get-active-zones

# Servis izni ekle
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https

# Port izni ekle
firewall-cmd --permanent --add-port=8080/tcp

# Kuralları etkinleştir
firewall-cmd --reload

# Servis izni kaldır
firewall-cmd --permanent --remove-service=ftp
```

**iptables (düşük seviyeli):**

```bash
# Kuralları listele
iptables -L -v -n

# Gelen belirli porta izin ver
iptables -A INPUT -p tcp --dport 22 -j ACCEPT

# IP adresini engelle
iptables -A INPUT -s 192.168.1.100 -j DROP

# NAT masquerading
iptables -t nat -A POSTROUTING -o eth0 -j MASQUERADE

# Kuralları kaydet
iptables-save > /etc/iptables/rules.v4
```

---

## Servis ve Daemon Yönetimi (systemd)

systemd, modern Linux dağıtımlarının standart init sistemi ve servis yöneticisidir.

### Servis İşlemleri

```bash
# Servis durumu
systemctl status nginx

# Başlat / Durdur / Yeniden başlat
systemctl start nginx
systemctl stop nginx
systemctl restart nginx

# Yeniden yükle (yapılandırma değişikliği sonrası)
systemctl reload nginx

# Sistem açılışında otomatik başlat
systemctl enable nginx

# Otomatik başlatmayı devre dışı bırak
systemctl disable nginx

# Etkinleştir ve hemen başlat
systemctl enable --now nginx

# Tüm çalışan servisleri listele
systemctl list-units --type=service --state=running

# Başarısız servisleri listele
systemctl --failed

# Daemon yapılandırmasını yeniden yükle (unit dosyası değişikliği sonrası)
systemctl daemon-reload
```

### Unit Dosyası Oluşturma

Özel bir servis oluşturmak için `/etc/systemd/system/` altına `.service` uzantılı dosya yerleştirilir:

```ini
[Unit]
Description=Benim Uygulamam
After=network.target
Requires=postgresql.service

[Service]
Type=simple
User=appkullanici
Group=appkullanici
WorkingDirectory=/opt/uygulama
ExecStart=/opt/uygulama/baslat.sh
ExecReload=/bin/kill -HUP $MAINPID
Restart=on-failure
RestartSec=5s
StandardOutput=journal
StandardError=journal
Environment=ORTAM=production

[Install]
WantedBy=multi-user.target
```

### journald — Günlük Görüntüleme

```bash
# Tüm günlükler
journalctl

# Belirli servis günlükleri
journalctl -u nginx
journalctl -u nginx -f   # Canlı izle

# Son 100 satır
journalctl -n 100

# Zaman aralığı
journalctl --since "2024-01-01" --until "2024-01-31"
journalctl --since "1 hour ago"

# Öncelik filtresi (0=emerg, 1=alert, 2=crit, 3=err, 4=warning, 5=notice, 6=info, 7=debug)
journalctl -p err
journalctl -p warning

# Disk kullanımı
journalctl --disk-usage

# Eski günlükleri temizle
journalctl --vacuum-time=30d
journalctl --vacuum-size=500M
```

---

## Günlük (Log) Yönetimi

### Temel Log Dosyaları

| Dosya | İçerik |
|---|---|
| `/var/log/syslog` veya `/var/log/messages` | Genel sistem mesajları |
| `/var/log/auth.log` veya `/var/log/secure` | Kimlik doğrulama olayları |
| `/var/log/kern.log` | Çekirdek mesajları |
| `/var/log/dmesg` | Donanım/önyükleme mesajları |
| `/var/log/cron` | Cron işleri |
| `/var/log/maillog` | Mail sunucu kayıtları |
| `/var/log/nginx/` | Nginx erişim ve hata logları |
| `/var/log/apache2/` | Apache logları |

### logrotate — Log Döndürme

`/etc/logrotate.conf` veya `/etc/logrotate.d/` altındaki dosyalarla yönetilir:

```
/var/log/myapp/*.log {
    daily           # Her gün döndür
    rotate 14       # 14 kopya tut
    compress        # Gzip ile sıkıştır
    delaycompress   # Bir öncekini sıkıştır
    missingok       # Dosya yoksa hata verme
    notifempty      # Boşsa döndürme
    create 0640 www-data adm  # Yeni dosya izni ve sahipliği
    postrotate
        systemctl reload nginx
    endscript
}
```

```bash
# logrotate'i test et (gerçekte çalıştırmaz)
logrotate -d /etc/logrotate.conf

# Zorla çalıştır
logrotate -f /etc/logrotate.d/nginx
```

---

## Güvenlik ve Denetim

### sudo Yapılandırması

`/etc/sudoers` dosyası `visudo` komutuyla düzenlenir; doğrudan metin editörüyle açmak tehlikelidir.

```bash
visudo
```

Sudoers sözdizimi:

```
# Kullanıcıya tam sudo izni
ahmet ALL=(ALL:ALL) ALL

# Parolasız sudo (dikkatli kullanın)
ahmet ALL=(ALL) NOPASSWD: ALL

# Belirli komutlara izin ver
ahmet ALL=(ALL) /bin/systemctl restart nginx, /usr/bin/apt

# Gruba izin ver
%gelistiriciler ALL=(ALL) /usr/bin/docker

# Sudoers.d dizinine ayrı dosya
echo "ahmet ALL=(ALL) ALL" > /etc/sudoers.d/ahmet
chmod 440 /etc/sudoers.d/ahmet
```

### SSH Güvenliği

`/etc/ssh/sshd_config` dosyasının güvenli yapılandırması:

```
# Root girişini kapat
PermitRootLogin no

# Parola girişini kapat, yalnızca anahtar kullan
PasswordAuthentication no
PubkeyAuthentication yes

# Boş parola ile girişi kapat
PermitEmptyPasswords no

# Varsayılan portu değiştir (opsiyonel)
Port 2222

# Belirli kullanıcılara izin ver
AllowUsers ahmet mehmet

# Belirli gruplara izin ver
AllowGroups sshkullanicilari

# Giriş denemesi zaman aşımı
LoginGraceTime 30

# Maksimum giriş denemesi
MaxAuthTries 3

# Boşta kalma zaman aşımı
ClientAliveInterval 300
ClientAliveCountMax 2
```

```bash
# Yapılandırmayı test et
sshd -t

# SSH servisini yeniden başlat
systemctl restart sshd
```

### SSH Anahtar Yönetimi

```bash
# Anahtar çifti oluştur
ssh-keygen -t ed25519 -C "ahmet@sirket.com"
ssh-keygen -t rsa -b 4096 -C "ahmet@sirket.com"

# Genel anahtarı sunucuya kopyala
ssh-copy-id -i ~/.ssh/id_ed25519.pub kullanici@sunucu

# Manuel kopyalama
cat ~/.ssh/id_ed25519.pub >> ~/.ssh/authorized_keys
chmod 700 ~/.ssh
chmod 600 ~/.ssh/authorized_keys
```

### fail2ban — Kaba Kuvvet Koruması

```bash
# Kurulum
apt install fail2ban

# Yapılandırma (/etc/fail2ban/jail.local)
[DEFAULT]
bantime  = 3600    # 1 saat engelleme
findtime = 600     # 10 dakika içinde
maxretry = 5       # 5 başarısız deneme

[sshd]
enabled = true
port    = ssh
logpath = /var/log/auth.log

# Durum kontrolü
fail2ban-client status
fail2ban-client status sshd

# IP engelleme
fail2ban-client set sshd banip 192.168.1.100

# IP engeli kaldırma
fail2ban-client set sshd unbanip 192.168.1.100
```

### auditd — Sistem Denetimi

```bash
# Kurulum
apt install auditd

# Denetim kuralı ekle (/etc/audit/rules.d/audit.rules)
# Dosya erişimini izle
-w /etc/passwd -p rwxa -k kullanici-degisiklikleri
-w /etc/sudoers -p rwxa -k sudo-degisiklikleri

# Sistem çağrısını izle
-a always,exit -F arch=b64 -S execve -k komut-calistirma

# Kuralları yükle
auditctl -R /etc/audit/rules.d/audit.rules

# Denetim günlüklerini sorgula
ausearch -k kullanici-degisiklikleri
ausearch -m LOGIN --start today
aureport --login
aureport --auth
```

### SELinux / AppArmor

**SELinux** (RHEL/CentOS tabanlı):

```bash
# Durum
getenforce
sestatus

# Mod değiştir (kalıcı değil)
setenforce 0   # Permissive (izin ver, logla)
setenforce 1   # Enforcing (zorla uygula)

# Kalıcı mod (/etc/selinux/config)
SELINUX=enforcing

# Bağlamı görüntüle
ls -Z /etc/passwd
ps -Z

# Red günlükleri
ausearch -m AVC -ts today
```

**AppArmor** (Debian/Ubuntu tabanlı):

```bash
# Durum
aa-status

# Profil modları
aa-enforce /etc/apparmor.d/usr.sbin.nginx
aa-complain /etc/apparmor.d/usr.sbin.nginx

# Profil yükle
apparmor_parser -r /etc/apparmor.d/usr.sbin.nginx
```

---

## Zamanlama: cron ve systemd Timers

### cron

```bash
# Kullanıcı crontab'ı düzenle
crontab -e

# Mevcut crontab'ı listele
crontab -l

# Başka kullanıcının crontab'ı (root)
crontab -u ahmet -l
```

**Crontab sözdizimi:**

```
# .---------------- dakika (0-59)
# |  .------------- saat (0-23)
# |  |  .---------- ayın günü (1-31)
# |  |  |  .------- ay (1-12)
# |  |  |  |  .---- haftanın günü (0-7, 0 ve 7=Pazar)
# |  |  |  |  |
# *  *  *  *  *  komut

# Her gece saat 02:30'da yedekleme
30 2 * * * /opt/scripts/yedekle.sh

# Her 5 dakikada bir
*/5 * * * * /opt/scripts/kontrol.sh

# Her ay 1. günü saat 00:00'da
0 0 1 * * /opt/scripts/aylik-rapor.sh

# Hafta içi her gün saat 08:00
0 8 * * 1-5 /opt/scripts/sabah-raporu.sh

# Yeniden başlatmada
@reboot /opt/scripts/baslangic.sh

# Günlük kısayol
@daily /opt/scripts/gunluk.sh
```

### systemd Timers

systemd zamanlayıcıları cron'a güçlü bir alternatiftir; günlük entegrasyonu ve bağımlılık yönetimi sunar.

**Servis dosyası** (`/etc/systemd/system/yedekleme.service`):
```ini
[Unit]
Description=Veritabanı Yedekleme

[Service]
Type=oneshot
ExecStart=/opt/scripts/yedekle.sh
User=yedek
```

**Timer dosyası** (`/etc/systemd/system/yedekleme.timer`):
```ini
[Unit]
Description=Gece Yedekleme Zamanlayıcısı

[Timer]
OnCalendar=*-*-* 02:30:00
Persistent=true

[Install]
WantedBy=timers.target
```

```bash
# Zamanlayıcıyı etkinleştir ve başlat
systemctl enable --now yedekleme.timer

# Tüm zamanlayıcıları listele
systemctl list-timers
```

---

## Paket Yönetimi

### APT (Debian / Ubuntu)

```bash
# Paket listesini güncelle
apt update

# Tüm paketleri yükselt
apt upgrade
apt full-upgrade   # Bağımlılıkları da günceller

# Paket kur
apt install nginx

# Paket kaldır
apt remove nginx
apt purge nginx    # Yapılandırma dosyalarıyla birlikte kaldır

# Kullanılmayan bağımlılıkları kaldır
apt autoremove

# Paket ara
apt search nginx
apt-cache search nginx

# Paket bilgisi
apt show nginx

# Önbelleği temizle
apt clean
apt autoclean

# İndirilen paket dosyaları
ls /var/cache/apt/archives/
```

### DNF / YUM (RHEL / CentOS / Fedora)

```bash
# Güncelle
dnf update
dnf upgrade

# Paket kur
dnf install nginx

# Kaldır
dnf remove nginx

# Ara
dnf search nginx

# Bilgi
dnf info nginx

# Kurulu paketleri listele
dnf list installed

# Grup kur
dnf groupinstall "Development Tools"

# Önbelleği temizle
dnf clean all
```

---

## Performans İzleme

### CPU ve Bellek

```bash
# CPU bilgisi
lscpu
cat /proc/cpuinfo

# Bellek kullanımı
free -h
cat /proc/meminfo

# Gerçek zamanlı izleme
top
htop
vmstat 1 10    # 1 saniye aralıkla 10 kez

# CPU istatistikleri
mpstat 1       # sysstat paketi gerektirir
sar -u 1 5    # CPU kullanımı

# Yük ortalaması
uptime
cat /proc/loadavg
```

### Disk I/O

```bash
# Disk okuma/yazma istatistikleri
iostat -x 1    # sysstat gerektirir
iostat -d -h

# Süreç bazlı disk I/O
iotop          # iotop paketi gerektirir

# Disk gecikmesi
ioping /dev/sda
```

### Ağ Performansı

```bash
# Anlık ağ trafiği
iftop
nload
nethogs        # Süreç bazlı

# Bant genişliği testi
iperf3 -s              # Sunucu modunda
iperf3 -c sunucu-ip   # İstemci modunda

# Bağlantı istatistikleri
ss -s
netstat -s
```

---

## Yedekleme Stratejileri

### rsync — Dosya Senkronizasyonu

```bash
# Yerel dizin yedekleme
rsync -avz /kaynak/ /hedef/

# Uzak sunucuya yedekleme
rsync -avz /yerel/dizin/ kullanici@sunucu:/uzak/dizin/

# Silinen dosyaları hedefte de sil (tam ayna)
rsync -avz --delete /kaynak/ /hedef/

# SSH ile güvenli aktarım
rsync -avz -e "ssh -p 2222" /kaynak/ kullanici@sunucu:/hedef/

# Kuru çalıştırma (gerçekte kopyalamaz, test eder)
rsync -avzn /kaynak/ /hedef/

# Bant genişliğini sınırla (KB/s)
rsync --bwlimit=1000 -avz /kaynak/ /hedef/
```

**rsync seçenekleri:**

| Seçenek | Açıklama |
|---|---|
| `-a` | Arşiv modu (izinler, sahiplik, zamanlar korunur) |
| `-v` | Ayrıntılı çıktı |
| `-z` | Sıkıştırma |
| `-n` | Kuru çalıştırma |
| `--delete` | Kaynakta olmayan dosyaları hedeften sil |
| `--exclude` | Belirli dosyaları dışla |
| `--progress` | İlerlemeyi göster |

### tar — Arşivleme

```bash
# Arşiv oluştur (sıkıştırarak)
tar -czvf yedek.tar.gz /yedeklenecek/dizin/

# Arşivi aç
tar -xzvf yedek.tar.gz

# İçeriği listele
tar -tzvf yedek.tar.gz

# Belirli bir konuma aç
tar -xzvf yedek.tar.gz -C /hedef/dizin/

# Artımlı yedek (snapshot ile)
tar --listed-incremental=/tmp/snapshot.snar -czvf tam-yedek.tar.gz /veri/
tar --listed-incremental=/tmp/snapshot.snar -czvf artimli-yedek.tar.gz /veri/
```

---

## Sonuç

Linux sistem yönetimi; kullanıcı denetiminden ağ yönetimine, güvenlik denetiminden performans izlemeye kadar geniş bir alan kapsar. Bu rehberde ele alınan konuların her biri kendi başına derinlikli bir uzmanlık alanıdır.

En iyi pratikler şu şekilde özetlenebilir:

- **En az yetki ilkesi** (Principle of Least Privilege): Her kullanıcı ve servis yalnızca görevini yerine getirebilecek kadar yetkiye sahip olmalıdır.
- **Değişiklikleri belgele:** Her yapılandırma değişikliği kayıt altına alınmalı, gerekirse geri alınabilir olmalıdır.
- **Düzenli denetim:** Log dosyaları ve denetim kayıtları periyodik olarak incelenmelidir.
- **Otomatik güncelleme politikası:** Güvenlik yamaları geciktirilmeden uygulanmalıdır.
- **Yedekleri test et:** Yedek almak kadar önemli olan, o yedeğin geri yüklenebilir olduğunu doğrulamaktır.

---

*Bu belge, Linux sistem yöneticileri ve bu alana yeni başlayanlar için hazırlanmış kapsamlı bir başvuru kaynağıdır.*