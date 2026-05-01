# 🕵️‍♂️ Cyber-Red: North Protocol Bülten ve Otomasyon Kılavuzu

Bu belge, Cyber-Red blog altyapısında kullanılan otomatik bülten gönderimi, içerik sıralaması ve URL yönetimi sisteminin nasıl çalıştığını anlatır. Bu sistem, "Infrastructure Architect" vizyonuyla, manuel müdahaleyi asgariye indirmek üzere tasarlanmıştır.

---

## 1. Yeni Yazı Paylaşımı ve Sıralama 🕒

Sistem artık tamamen **tarih tabanlı (date-based)** sıralama kullanmaktadır. `weight` parametresine ihtiyaç duyulmaz.

### En Üstte Görünme Kuralı
Bir yazının ana sayfanın en başında (zirvede) yer alması için, içindeki `date` alanının diğer tüm yazılardan daha "yeni" (ileri bir saatte) olması gerekir.

**Örnek Front-Matter:**
```toml
+++
title = "Yazı Başlığı"
date = "2026-05-01T13:00:00"  # Saat ve saniye hassasiyeti önemlidir
slug = "yazi-basligi-ascii"    # ASCII karakterler kullanın (ç, ş, ı kullanmayın)
description = "Kısa özet..."
tags = ["linux", "rehber"]
+++
```

*Not: Gelecek bir tarihe yazı kurarsanız, Hugo bu yazıyı belirtilen saat gelene kadar ana sayfada gizler. Yayında anında görünmesi için "şu anki" veya "az önce"ki bir saati kullanın.*

---

## 2. Otomatik Bülten Sistemi (Newsletter Pipeline) ✉️

Bülten sistemi, her `git push` işleminden sonra `.github/workflows/notify-subscribers.yml` üzerinden tetiklenir.

### Akıllı Tarih Seçici (Smart Date Detection)
Sistem, hangi dosyanın değiştiğine bakmaksızın `content/posts/` klasöründeki tüm `.md` dosyalarını tarar ve içindeki `date` alanı **en güncel** olan dosyayı bülten konusu olarak seçer. Bu sayede:
- Birden fazla dosya güncellendiğinde hata almazsınız.
- Her zaman en güncel içeriğiniz abonelere ulaşır.

### Supabase Entegrasyonu
Aboneler, Supabase veritabanındaki `subscribers` tablosundan çekilir. Sistem oldukça esnektir; tablo yapısındaki ufak değişikliklerden etkilenmeyecek şekilde "kurşun geçirmez" (bulletproof) hale getirilmiştir.

---

## 3. Temiz URL ve 404 Koruması 🔗

404 hatalarını ve karmaşık URL yapılarını önlemek için şu kurallar uygulanmıştır:

1.  **Slug Önceliği:** `hugo.toml` içinde permalink yapısı `/:slug/` olarak ayarlanmıştır. Yazılarınızda mutlaka ASCII (İngilizce karakter) bir `slug` tanımlayın.
2.  **Otomatik Temizlik:** Eğer `slug` tanımlanmazsa, Hugo `removePathAccents = true` ayarı sayesinde başlığı temizlemeye çalışır. Ancak manuel `slug` her zaman en güvenli yoldur.

---

## 4. E-Posta Tasarımı (Cyber-Amber) 🎨

Bülten tasarımı `.github/email-template.html` dosyasında yer alır. 
- **Renk Paleti:** Sitenin kimliğiyle uyumlu Cyber-Amber (Turuncu-Sarı) paleti kullanılmıştır.
- **Değişkenler:** Şablon içindeki `{{POST_TITLE}}`, `{{POST_URL}}` gibi alanlar bülten gönderilirken otomatik olarak doldurulur.

---

## 5. Teknik Bakım Notları 🛠️

- **Secrets:** GitHub depo ayarlarında (Settings > Secrets) `GMAIL_EMAIL`, `GMAIL_PASSWORD`, `SUPABASE_URL` ve `SUPABASE_SERVICE_KEY` tanımlı olmalıdır.
- **Hata Günlükleri:** Gönderim sırasında bir sorun oluşursa, GitHub Actions sekmesindeki loglardan detaylı hata mesajlarını görebilirsiniz.

---

**Sistem Mimarı Notu:** Bu altyapı, teknolojiyle olan ilişkinizi "bakıcılıktan", gerçek bir "kullanıcı deneyimine" terfi ettirmek için tasarlanmıştır. Sistem kendi kendine yeter, siz sadece üretmeye odaklanın. 🕵️‍♂️🔥
