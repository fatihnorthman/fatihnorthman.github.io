---
title: "Windows Komut Satırı: CMD ve PowerShell Rehberi"
date: 2026-05-09T07:10:53+03:00
lastmod: 2026-05-09T07:10:53+03:00
draft: false
tags: ["Windows Komut Satırı", "CMD", "Command Prompt", "PowerShell", "Cmdlet", "Sistem Yönetimi", "Windows Server", "Active Directory", "Ağ Sorun Giderme", "CLI", "Bilişim Teknolojileri", "Diskpart", "Otomasyon"]
categories: ["Bilişim"]
author: "Fatih Northman"
description: "Windows işletim sistemlerinde CMD ve PowerShell arasındaki farklar nelerdir? Temel CMD komutlarından PowerShell'in nesne tabanlı yapısına ve sistem yönetimi senaryolarına uzanan detaylı komut satırı rehberini keşfedin."
slug: "windows-komut-satiri-cmd-ve-powershell-rehberi"
readingTime: true
weight: 1
image: "/images/1778310651205-15447.webp"
---

Windows işletim sistemlerinde grafiksel arayüz (GUI) son derece kullanıcı dostudur, ancak bir sistemin kaputunun altına girmeniz, otomasyon yapmanız veya devasa bir sunucu altyapısını yönetmeniz gerektiğinde fare tıklamaları yetersiz kalır. Özellikle KVM/QEMU gibi hipervizörler üzerinde çoklu sanal makineler (Windows Server 2016, 2022 vb.) koşturulan bir laboratuvar ortamında, sistem yöneticisinin en büyük silahı komut satırıdır.

Windows dünyasında komut satırı yönetimi iki ana sütuna ayrılır: Eski ve güvenilir **CMD (Command Prompt)** ile modern, nesne tabanlı güç merkezi **PowerShell**.

## 1. Geleneksel Miras: CMD (Command Prompt)

Kökleri MS-DOS dönemine kadar uzanan CMD, basit görevleri yerine getirmek, ağ bağlantılarını test etmek ve temel dosya işlemlerini yapmak için hala en hızlı araçtır. Komutları Linux (bash/fish) ortamındaki gibi metin (string) tabanlı çalışır. Çıktı olarak size sadece okunabilir metin verir.

### CMD Temel Komutları

**Dosya ve Dizin Yönetimi:**
*   `dir`: Bulunduğunuz dizindeki (klasördeki) dosyaları ve klasörleri listeler. (Linux'taki `ls` komutunun karşılığıdır).
*   `cd <Klasör_Adı>` (Change Directory): Belirtilen klasörün içine girmenizi sağlar. Bir üst klasöre çıkmak için `cd ..` kullanılır.
*   `mkdir <Klasör_Adı>` (Make Directory): Yeni bir klasör oluşturur.
*   `del <Dosya_Adı>`: Belirtilen dosyayı siler.
*   `copy <Kaynak> <Hedef>`: Bir dosyayı bir yerden başka bir yere kopyalar.

**Ağ ve Sistem Sorun Giderme:**
*   `ipconfig`: Bilgisayarınızın mevcut IP adresini, Alt Ağ Maskesini ve Varsayılan Ağ Geçidini gösterir. (Çoklu domain controller veya WSUS sunucuları yapılandırırken istemci IP'lerini doğrulamak için hayati önem taşır). `ipconfig /all` yazarak MAC adresleri gibi çok daha detaylı bilgilere ulaşabilirsiniz.
*   `ping <IP_veya_Site>`: Karşıdaki cihaza küçük veri paketleri göndererek ağ bağlantısının ayakta olup olmadığını ve gecikme süresini test eder.
*   `tracert <IP_veya_Site>`: Veri paketinizin hedefe ulaşana kadar hangi router'lardan (yönlendiricilerden) geçtiğini adım adım listeler.

**Sistem Yönetimi:**
*   `diskpart`: Diskleri yönetmek, formatlamak veya imaj hazırlıkları (özellikle sanal makine disk imajları) sırasında birimleri yapılandırmak için kullanılan gelişmiş disk aracıdır.
*   `sfc /scannow`: Bozuk veya eksik Windows sistem dosyalarını tarayıp onaran kritik bir bakım komutudur.

## 2. Sistem Yöneticilerinin Güç Yüzüğü: PowerShell

PowerShell, Microsoft'un sistem yönetimi ve otomasyon için sıfırdan geliştirdiği, .NET Framework (ve günümüzde .NET Core) üzerine inşa edilmiş devasa bir platformdur. 

**Neden CMD'den Farklıdır?**
PowerShell'in en büyük devrimi **Nesne Yönelimli (Object-Oriented)** olmasıdır. Bir komut yazdığınızda ekrana sadece "metin" basmaz. Arka planda özellikleri (Properties) ve eylemleri (Methods) olan canlı nesneler üretir. 

### PowerShell Cmdlet Yapısı
PowerShell komutlarına "Cmdlet" (Command-let) denir ve her zaman **Fiil-İsim (Verb-Noun)** mantığıyla yazılır. Bu, komutların ne işe yaradığını tahmin etmeyi çok kolaylaştırır.

**Temel Cmdlet Örnekleri:**
*   `Get-Process`: O an sistemde çalışan tüm programları (işlemleri) nesne olarak listeler.
*   `Stop-Process -Name "chrome"`: Belirtilen uygulamayı zorla kapatır.
*   `Get-Service`: Windows hizmetlerinin (Services) durumunu (Çalışıyor/Durdu) gösterir.
*   `Restart-Service -Name "wuauserv"`: Windows Update hizmetini yeniden başlatır. (Özellikle WSUS istemci senkronizasyonu sorunlarını çözerken sıkça kullanılır).

### Güçlü Bir Araç: Pipeline (Boru Hattı)
Tıpkı gelişmiş Linux kabuklarında olduğu gibi, PowerShell'de de `|` (Boru/Pipe) operatörü kullanılır. Ancak burada bir komutun çıktısı diğerine metin olarak değil, nesne olarak geçer.

**Örnek Senaryo:** 
Sistemde 100 MB'tan fazla RAM tüketen programları bulup otomatik kapatmak istiyorsunuz:
```powershell
Get-Process | Where-Object {$_.WorkingSet -gt 100MB} | Stop-Process
```
Bu tek satırlık kod; işlemleri alır, filtreden geçirir ve hedefi vuran bir otomasyonla sistemi temizler.

### İleri Düzey PowerShell Kullanımı
Sunucu ortamlarında Active Directory, Group Policy (GPO) ve etki alanı (Domain) yapılandırmaları için PowerShell bir zorunluluktur.

*   `Test-NetConnection`: Eski `ping` ve `telnet` komutlarının modern birleşimidir. Sadece hedefin ayakta olup olmadığını değil, belirli bir Port'un açık olup olmadığını da test edebilirsiniz. (Örn: `Test-NetConnection 192.168.1.10 -Port 3389`).
*   `Enter-PSSession -ComputerName "Server01"`: Farklı bir odadaki veya sanal ağdaki bir Windows sunucusuna sanki karşısındaymışsınız gibi komut satırından bağlanmanızı sağlar (Linux'taki SSH mantığı).

**Özetle:** Windows ortamında hızlı bir ağ kontrolü veya klasör işlemi için CMD hala elinizin altındaki en pratik araçtır. Ancak sunucu yapılandırmaları, sistem otomasyonları ve karmaşık görev zincirleri söz konusu olduğunda, PowerShell'in nesne tabanlı mimarisi rakipsiz bir sistem yönetimi deneyimi sunar.