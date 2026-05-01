# 🕵️‍♂️ NORTH PROTOCOL: Sistem Operasyon ve Otomasyon Protokolü

Bu doküman, Cyber-Red blog altyapısının (Hugo) ve bülten otomasyonunun (GitHub Actions) teknik anayasasıdır. **Herhangi bir yapay zeka (AI) veya insan operatör, bu dokümanı okuyarak sistemi hatasız yönetebilir.**

---

## 1. Mimari Genel Bakış
Sistem, içerik paylaşımı ve bülten gönderimini tek bir `git push` işlemiyle birleştirir.
- **Statik Site:** Hugo (Terminal Teması)
- **Bülten Tetikleyici:** GitHub Actions (`.github/workflows/notify-subscribers.yml`)
- **İşlemci:** Python 3.x (Akıllı Tarih Tespiti ve SMTP Gönderimi)
- **Veri Katmanı:** Supabase REST API (Abone Listesi)
- **Gönderim Katmanı:** Gmail SMTP_SSL (Port 465)

---

## 2. İçerik ve Front-Matter Standartları
Tüm yeni yazılar `content/posts/` dizini altında `.md` uzantısıyla oluşturulmalıdır.

### ⚠️ Kritik Kurallar:
1.  **Format:** Kesinlikle **TOML** (`+++`) kullanılmalıdır. (YAML `---` kullanılmamalıdır).
2.  **Sıralama (Date):** `weight` parametresi kullanılmaz. Sıralama tamamen `date` alanına bağlıdır.
3.  **Zirve Kuralı:** Bir yazının ana sayfada en üstte çıkması için `date` değeri, mevcut diğer tüm yazılardan daha yeni olmalıdır.
4.  **URL (Slug):** `hugo.toml` ayarı gereği linkler `slug` parametresinden üretilir. 404 hatasını önlemek için `slug` alanı her zaman **ASCII** (İngilizce karakter, küçük harf, tireli) olmalıdır.

**Örnek Standart Blok:**
```toml
+++
title = "Teknik Başlık"
date = "2026-05-01T10:15:00"  # ISO 8601 Format (Zaman dilimi notuna bakın)
slug = "teknik-baslik-ascii"   # Sadece küçük harf, rakam ve tire
description = "E-posta ve SEO için kısa özet."
tags = ["etiket1", "etiket2"]
+++
```

---

## 3. Bülten Otomasyon Mantığı
GitHub Action tetiklendiğinde çalışan Python betiği şu algoritmayı izler:

### A. Akıllı Yazı Seçimi (Smart Detection)
Sistem, `git diff` çıktılarına güvenmez. `content/posts/*.md` içindeki tüm dosyaları tarar, her birinin içindeki `date` değerini okur ve **Tarihi en yeni olan dosyayı** bülten konusu olarak seçer.

### B. Meta-Veri Çekme (Regex)
Betik, dosya içeriğinden başlık, açıklama ve slug bilgilerini esnek Regex kalıplarıyla çeker. Hem `key = "value"` hem de `key: value` yapılarını destekler.

### C. Şablon Enjeksiyonu
`.github/email-template.html` dosyası okunur ve aşağıdaki placeholder'lar gerçek verilerle değiştirilir:
- `{{POST_TITLE}}`
- `{{POST_DESC}}`
- `{{POST_DATE}}`
- `{{POST_TAGS}}`
- `{{POST_URL}}`

---

## 4. Hata Önleme ve Troubleshooting (Operatör Notları)

### 🚨 Gelecek Zaman Tuzağı (Future Post)
Hugo, sunucu saati (UTC) bazında gelecekte olan yazıları ana sayfada göstermez. 
- **Hata:** Yazı sitede görünmüyor ama bülten gitti.
- **Sebep:** Yazı saati, sunucu (UTC) saatinden ileridedir.
- **Çözüm:** `date` değerini sunucu saatinden (genellikle TR saati - 3 saat) en az 5-10 dakika geriye setleyin.

### 🚨 404 Hatası
- **Sebep:** `slug` alanında Türkçe karakter (`ı, ş, ç, ğ, ü, ö`) kullanımı.
- **Çözüm:** `slug` alanını her zaman `icin`, `asmak`, `ozellik` gibi temiz ASCII karakterlerle doldurun.

---

## 5. Yapay Zeka (AI) Operatörüne Talimatlar
Sistemi yöneten bir yapay zeka iseniz:
1.  Yeni yazı eklemeden önce mevcut en yeni yazının `date` değerini kontrol edin.
2.  Yeni yazının `date` değerini, mevcut olandan daha büyük ama sunucu (UTC) saatinden küçük olacak şekilde ayarlayın.
3.  Dosyayı push etmeden önce `hugo --minify` komutuyla (eğer ortam uygunsa) build kontrolü yapın ve `index.html` içinde yazının en üstte olduğunu teyit edin.
4.  Bülten gönderimi için `git push` yaptıktan sonra GitHub Actions loglarını izleyerek Supabase veya SMTP hatası olup olmadığını denetleyin.

---
*Sistem Mimarisi: Cyber-Red / Northman Architect* 🕵️‍♂️🔥
