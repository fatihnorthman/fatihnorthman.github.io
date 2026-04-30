+++
title = "CachyOS ve Fish Shell: Sistem Hiyerarşisini Kendi Kurallarımızla Ezmek"
date = "2026-04-30T13:10:00+03:00"
author = "Muhammet Fatih Şahan"
tags = ["linux", "cachyos", "arch-linux", "fish-shell", "paru", "terminal", "automation"]
description = "CachyOS üzerinde varsayılan olarak gelen update alias'ının neden olduğu kısıtlamaları, sistem yapılandırma hiyerarşisini ve kontrolü tamamen ele alma sürecimi teknik detaylarıyla anlatıyorum."
showFullContent = false
readingTime = true
+++

Arch tabanlı bir dağıtım kullanmanın en büyük cazibesi, sistemin "bitmiş" bir ürün değil, sizinle birlikte yaşayan ve şekillenen bir yapı olmasıdır. CachyOS, sunduğu optimize edilmiş çekirdekler ve paketlerle bu deneyimi bir üst seviyeye taşıyor. Ancak bazen sistem, size "kolaylık" olsun diye kendi varsayılan ayarlarını dayatır.

Bugün, Fish shell üzerindeki masum görünen bir `update` komutunun arka planında dönen hiyerarşi savaşını ve kontrolü nasıl tamamen ele aldığımı adım adım, teknik derinliğiyle inceleyeceğiz.

---

## 1. Perde: "Eksik" Güncelleme Sorunu ve Farkındalık

Linux terminalinde `update` yazmak bir kas hafızasıdır. Ancak her `update` aynı sonucu vermez. CachyOS'te varsayılan olarak tanımlanan bu alias'ın sadece resmi depoları hedeflediğini fark ettiğimde, sistemimin aslında tam anlamıyla güncel kalmadığını anladım.

### Pacman ve AUR Hiyerarşisi

Sistemimizdeki paketlerin kaynağı iki ana koldan beslenir. Bu farkı anlamak, neden müdahale etmemiz gerektiğini de açıklar:

| Özellik | Resmi Paket Yöneticisi (`pacman`) | AUR Helper (`paru` / `yay`) |
| :--- | :--- | :--- |
| **Depo Kaynağı** | `core`, `extra`, `cachyos` | Arch User Repository (Topluluk) |
| **Güvenlik** | Dijital İmzalı, Test Edilmiş | Kullanıcı Yapımı PKGBUILD dosyaları |
| **Kapsam** | Çekirdek, Sürücüler, Temel Araçlar | Spotify, Discord, Google Chrome, vb. |
| **Varsayılan Update** | Sadece Resmi Depoları Günceller | Hem Resmi Hem AUR Depolarını Günceller |

Eğer sisteminizde AUR üzerinden kurduğunuz tek bir paket bile varsa (ki muhtemelen vardır), `sudo pacman -Syu` komutu o paketi asla güncellemez. Bu da zamanla sürüm uyuşmazlıklarına ve güvenlik açıklarına yol açar.

---

## 2. Perde: Neden Paru? (Tek Komut, Tam Kontrol)

Neden hem `pacman` hem de `paru` ile ayrı ayrı uğraşmıyoruz? Çünkü `paru`, Rust ile yazılmış modern bir **Pacman Wrapper**'dır.

Siz terminale `paru` yazdığınızda sistem şu güvenli algoritmayı izler:

1. Önce `sudo` yetkisi isteyerek `pacman -Syu` komutunu tetikler.
2. Resmi depoların güncellemesi bittiğinde root yetkilerini bırakır.
3. Güvenlik protokolü gereği (AUR paketleri asla root ile derlenmelidir) normal kullanıcı yetkisiyle AUR depolarını tarar.
4. Güncel olmayan tüm topluluk paketlerini tespit eder ve derler.

---

## 3. Perde: Olay Yeri İncelemesi (Hiyerarşi Savaşı)

Sorunu çözmek için önce Fish shell'in kendi fonksiyon yapısını kullandım. `update` adında bir fonksiyon tanımlayıp `funcsave update` ile kalıcı hale getirdim. Ancak tuhaf bir durum vardı: Terminali her yeniden açtığımda, sistem benim yazdığım kodu görmezden geliyordu.

### Suçluyu Buluyoruz: `source` Hiyerarşisi

Fish shell yapılandırma dosyamı (`~/.config/fish/config.fish`) açtığımda karşılaştığım o meşhur satır:

```fish
source /usr/share/cachyos-fish-config/cachyos-config.fish
```

Bu satırın anlamı şudur: *"Ben açılırken önce git ve CachyOS ekibinin hazırladığı ayarları oku."*

Sistem bu dosyayı okuduğunda, içerisinde tanımlı olan `alias update='sudo pacman -Syu'` komutunu belleğe yüklüyor. Benim daha önce kaydettiğim fonksiyonlar veya aliaslar, bu dosya her seferinde yeniden okunduğu için üzerine yazılarak (**overwrite**) etkisiz hale getiriliyordu.

---

## 4. Perde: Son Sözü Söyleyen Kazanır (Final Çözümü)

Linux ve Shell dünyasında değişmez bir kural vardır: **Bir yapılandırma dosyası yukarıdan aşağıya okunur ve her zaman son satırdaki komut geçerli olur.**

Madem sistem CachyOS'un varsayılan dosyasını en başta okuyor, o zaman ben de kendi kuralımı dosyanın en sonuna mühürlemeliyim. Bu sayede sistem CachyOS'un kuralını yüklese bile, milisaniyeler sonra benim kuralımı görecek ve eskisini geçersiz kılacaktır.

### Uygulama Adımları

Terminal üzerinde şu iki komutla kontrolü tamamen ele aldım:

```fish
# 1. Kendi alias'ımızı dosyanın en sonuna ekleyelim (>> operatörü sona ekler)
echo "alias update='paru'" >> ~/.config/fish/config.fish

# 2. Mevcut terminal oturumunu anında güncellemek için yapılandırmayı yeniden yükleyelim
source ~/.config/fish/config.fish
```

---

## Sonuç: Sisteme Hükmetmek

Artık terminale `update` yazdığımda sadece bir güncelleme başlatmıyorum; aynı zamanda sistemin hiyerarşisine nasıl hükmettiğimi de hatırlıyorum.

> **Altın Kural:** Bir Linux sistemini "kullanıcı" olarak değil, "yönetici" olarak kullanmak istiyorsanız, varsayılanların sizi kısıtlamasına izin vermeyin.

Ekranda şu yazıyı görüyorsanız zafer sizindir:

```
:: Looking for AUR upgrades...
```

**Sistemi sadece kullanmayın, ona sahip olun.** Bir sonraki teknik macerada görüşmek üzere!