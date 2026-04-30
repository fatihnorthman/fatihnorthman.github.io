---
title: "Adım Adım Terminal ve Kabuk Özelleştirme Rehberi"
date: 2026-04-30T15:47:00+03:00
draft: false
description: "Modern bir Linux deneyimi için Ghostty terminali, Fish kabuğu ve Fastfetch ile uçbirim dünyasını en baştan tasarlayın."
tags: ["Linux", "Terminal", "Ghostty", "Fish Shell", "Fastfetch", "Customization"]
---

Bilgisayar kullanırken genellikle fare ile ikonlara tıklarız. Ancak **"Terminal"** dediğimiz şey, bilgisayara doğrudan yazılı komutlar verdiğimiz, aslında sistemin kalbine dokunduğumuz bir penceredir. 

Bu rehberde; bu pencereyi (**Ghostty**), pencerenin içindeki dili (**Fish**) ve her açılışta bizi karşılayan o estetik sistemi (**Fastfetch**) en baştan kurup, jilet gibi bir görünüme kavuşturacağız.

---

### 1. Temel Kavramlar: Nedir Bunlar?

Başlamadan önce, kuracağımız bu "Cyber-Deck" bileşenlerini tanıyalım:

*   **Terminal (Ghostty):** Bu bir "çerçeve"dir. Yazıları gördüğümüz pencere. Ghostty, ekran kartınızı (GPU) kullanarak bu yazıları çok hızlı ve takılmadan gösteren modern bir terminaldir.
*   **Kabuk/Shell (Fish):** Bu, terminalin içindeki "akıl"dır. Siz bir komut yazdığınızda bunu bilgisayara anlatan çevirmendir.
*   **Prompt (Komut İstemi):** Komut yazdığınız satırın en başındaki simgelerdir (Örn: `~ ❯`).
*   **Fastfetch:** Terminali her açtığınızda sistem özelliklerinizi ve bir logoyu gösteren o havalı "sistem özeti" süsüdür.

---

### 2. Ghostty Terminal Kurulumu

Bilgisayarınıza Ghostty'yi kurmak, standart bir program indirmek gibidir ancak biz bunu "komut satırı" gücüyle yapacağız.

#### Dağıtıma Göre Kurulum Komutları

Bilgisayarınızın hangi Linux "ailesinden" olduğuna göre şu komutlardan birini terminalinize yapıştırıp Enter'a basın:

*   **Arch Linux / CachyOS / Manjaro:**
    ```bash
    sudo pacman -S ghostty
    ```
*   **Fedora (Sürüm 41+):**
    ```bash
    sudo dnf install ghostty
    ```
*   **macOS (Apple):**
    ```bash
    brew install --cask ghostty
    ```

---

### 3. Görünümü Ayarlamak (Ghostty Ayarları)

Her terminalin bir "ayar dosyası" vardır. Bu dosya, terminalin hangi yazı tipini kullanacağını veya hangi renklerde olacağını belirler. Linux'ta bu dosyalar genellikle `.config` isimli gizli bir klasörde durur.

#### Ayar Dosyasını Açmak
Terminalinize şu komutu yazarak ayar dosyasını düzenleyici (`nano`) ile açın:

```bash
nano ~/.config/ghostty/config
```

#### Dosyanın İçine Şunları Yapıştırın:
Aşağıdaki kodlar terminalin modern ve şeffaf görünmesini sağlar:

```ini
# Terminalin içindeki dil Fish olsun
shell-integration = fish

# Yazı tipi ve boyutu (Simgelerin düzgün görünmesi için 'Nerd Font' şarttır)
font-family = "JetBrainsMono Nerd Font"
font-size = 10

# Renk teması (Gözü yormayan 'Ayu' teması)
theme = dark:Ayu,light:Ayu Light

# Kapatırken soru sorma (Hızlıca kapatabilmek için)
confirm-close-surface = false
```

> **İpucu:** Kaydetmek için `CTRL + O` sonra `Enter`. Çıkmak için `CTRL + X`.

---

### 4. Akıllı Dil: Fish Kabuğu (Shell)

**Fish**, siz bir şey yazarken ne yazmak istediğinizi tahmin eden (autosuggestions) çok akıllı bir sistemdir.

#### Fish'i Varsayılan Yapmak
Terminali her açtığınızda Fish'in gelmesi için:
1.  **Kurulum:** `sudo pacman -S fish` (Arch için).
2.  **Varsayılan Yap:** `chsh -s $(which fish)`.
3.  **Aktifleştir:** Bilgisayarı veya oturumu kapatıp açın.

---

### 5. Komut Satırı Görünümü: Prompt Ayarı

Komut yazdığınız yerdeki o ok işaretini (`❯`) değiştirmek en keyifli kısımdır. Biz sadeliğiyle bilinen **"Nim"** temasını seçeceğiz.

#### Adım Adım Tema Seçimi
Terminale şunu yazın (İngilizce "seçmek" anlamına gelen `choose` iki 'o' ile yazılır):

```bash
fish_config prompt choose nim
```

Seçtiğiniz temayı kaydetmek için:
```bash
fish_config prompt save
```

*Ekranda "Üzerine yazılsın mı?" (Overwrite) sorusu çıkarsa **'y'** tuşuna basıp Enterlayın.*

---

### 6. Karşılama Ekranı: Fastfetch ve Görsel

Terminal açılınca sol tarafta bir resim, sağ tarafta sistem bilgileriniz görünsün istiyorsanız:

#### Ayar Dosyasını Düzenleme
```bash
nano ~/.config/fastfetch/config.jsonc
```

#### Kendi Resminizi Koymak
Dosyanın içindeki logo kısmını bulun ve kendi resminizin tam yolunu yazın:

```json
"logo": {
  "source": "/home/kullanıcı_adınız/Resimler/resmim.png",
  "width": 35 
},
```

---

### 7. Hayat Kurtaran Kısayollar (Alias)

Sürekli uzun komutlar yazmak yerine "takma isimler" kullanabiliriz. `nano ~/.config/fish/config.fish` dosyasını açın ve en alta şunları ekleyin:

```bash
# ls komutunu daha güzel ve ikonlu yapar
alias ls='eza -al --icons'

# Tek kelimeyle sistem güncelleme
alias guncelle='sudo pacman -Syu'

# Ayar dosyalarına hızlı erişim
alias ayar-fish='nano ~/.config/fish/config.fish'
alias ayar-ghostty='nano ~/.config/ghostty/config'
```

---

### Özet: Bir Sorun Çıkarsa Ne Yapmalı?

*   **Simgeler kare görünüyor:** Bilgisayarınıza bir "Nerd Font" (Örn: JetBrainsMono Nerd Font) yüklememişsiniz demektir.
*   **Ayarlar değişmiyor:** Dosyayı kaydettikten sonra terminali tamamen kapatıp tekrar açın.
*   **Tema eski haline dönüyor:** `fish_config prompt save` komutunu kullandığınızdan emin olun.

Artık terminal dünyasına tam donanımlı ve jilet gibi bir tasarımla giriş yaptınız! Güle güle kullanın.
