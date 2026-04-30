---
title: "Linux Sanallaştırma Rehberi: KVM, QEMU ve Virt-Manager ile Performansın Zirvesine Çıkın"
date: 2026-04-30T17:30:00+03:00
draft: false
tags: ["Linux", "Sanallaştırma", "KVM", "QEMU", "Virt-Manager", "Performans"]
categories: ["Rehber"]
author: "Fatih Northman"
description: "Linux üzerinde en yüksek performanslı sanal makine kurulumu için KVM/QEMU ve Virt-Manager rehberi. Her dağıtım için kurulum adımları ve optimizasyonlar."
---

Linux üzerinde sanal makine çalıştırmak söz konusu olduğunda, genellikle iki yol vardır: Ya VirtualBox gibi kullanıcı dostu ama hantal çözümleri seçersiniz ya da Linux çekirdeğine gömülü olan **KVM (Kernel-based Virtual Machine)** gücünü kullanırsınız. Bu rehberde, Linux'un yerli gücünü kullanarak nasıl "kayıpsız" performans alacağınızı en ince detayına kadar inceleyeceğiz.

## 1. Hazırlık: Donanım Sanallaştırma Desteği

Kuruluma geçmeden önce, işlemcinizin bu gücü destekleyip desteklemediğini ve BIOS/UEFI üzerinden açık olup olmadığını doğrulamamız gerekir.

Terminali açın ve şu komutu çalıştırın:
```bash
LC_ALL=C lscpu | grep Virtualization
```
Burada **VT-x (Intel)** veya **AMD-V (AMD)** görüyorsanız her şey yolunda. Eğer çıktı boşsa, bilgisayarınızı yeniden başlatıp BIOS ayarlarından "Virtualization Technology" veya "SVM Mode" seçeneğini **Enabled** yapmalısınız.

Ardından, gerekli çekirdek modüllerinin yüklü olduğunu doğrulayın:
```bash
lsmod | grep kvm
```

{{< ad >}}

## 2. Dağıtımlara Göre Kurulum Kılavuzu

Her Linux dağıtımının paket yönetim sistemi farklıdır. KVM/QEMU ekosistemi için gerekli olan temel paketler: `qemu`, `libvirt`, `virt-manager` ve `dnsmasq`'tır.

### Arch Linux ve Tabanlılar (Manjaro, EndeavourOS, CachyOS)
Arch kullanıcıları en güncel paketlere sahiptir:
```bash
sudo pacman -S qemu-full virt-manager virt-viewer dnsmasq vde2 bridge-utils openbsd-netcat libvirt ebtables iptables
```

### Ubuntu, Linux Mint, Pop!_OS ve Debian
Debian tabanlı sistemlerde stabilite ön plandadır:
```bash
sudo apt update
sudo apt install qemu-kvm libvirt-daemon-system libvirt-clients virt-manager bridge-utils
```

### Fedora ve RHEL Tabanlılar
Fedora, sanallaştırma konusunda en optimize dağıtımlardan biridir:
```bash
sudo dnf install @virtualization
```

### OpenSUSE (Tumbleweed ve Leap)
```bash
sudo zypper install kvm_server kvm_tools virt-manager
```

{{< ad >}}

## 3. Yetkilendirme ve Servis Yönetimi

Paketleri kurmak yeterli değildir. Sanal makineleri yönetebilmeniz için kendinizi `libvirt` grubuna eklemeli ve servisleri başlatmalısınız.

1. **Gruba Eklenme:**
```bash
sudo usermod -aG libvirt $USER
sudo usermod -aG kvm $USER
```

2. **Servisleri Etkinleştirme:**
```bash
sudo systemctl enable --now libvirtd
```

3. **Ağ Servisini Başlatma (Kritik):**
Çoğu kullanıcı sanal makinede internete çıkamaz. Bunun sebebi "default" ağının başlatılmamış olmasıdır:
```bash
sudo virsh net-start default
sudo virsh net-autostart default
```

*(Bu işlemlerden sonra oturumu kapatıp açmayı veya bilgisayarı yeniden başlatmayı unutmayın.)*

{{< ad >}}

## 4. Performans İçin "Altın" Sanal Makine Ayarları

Virt-Manager ile bir makine oluştururken maksimum performans için şu ince ayarları yapın:

### CPU Modu (Passthrough)
Sanal makinenin işlemcinizi gerçek modeliyle görmesini sağlayın:
*   **Ayarlar > İşlemci > Model:** `host-passthrough` seçeneğini işaretleyin.

### Depolama (VirtIO)
Sanal diskiniz standart SATA veya IDE yerine **VirtIO** veri yolunu kullanmalıdır:
*   **Disk Ayarları > Gelişmiş Seçenekler > Disk Bus:** `VirtIO` seçin.

### Ekran Kartı ve Grafik
*   **Video:** `Virtio` seçin ve varsa `3D Acceleration` kutusunu işaretleyin.
*   **Ekran:** `Spice` sunucusunu kullanın.

{{< ad >}}

## 5. Gelişmiş: Paylaşılan Klasörler (Virtio-fs)

Ana sisteminiz ile sanal makine arasında dosya transferi yapmak için en hızlı yol Virtio-fs kullanmaktır. 
1. Virt-Manager üzerinden "Add Hardware" -> "Filesystem" seçin.
2. **Driver:** `virtiofs` seçin.
3. **Source Path:** Paylaşmak istediğiniz klasörü seçin.
4. **Target Path:** Bir isim verin (Örn: `/paylasim`).

## 6. Sık Karşılaşılan Sorunlar ve Çözümleri

### "Permission Denied" Hatası
Eğer disk imajına erişirken yetki hatası alıyorsanız, `/etc/libvirt/qemu.conf` dosyasını düzenleyin:
```bash
user = "root"
group = "root"
```
*(Güvenlik için sadece kendi kullanıcı adınızı da yazabilirsiniz.)*

### Ağ Bağlantısı Yok
Eğer makine IP almıyorsa, `iptables` veya `nftables` kurallarınızı kontrol edin. `dnsmasq` servisinin çalıştığından emin olun.

### UEFI Boot Sorunu
Eğer sanal makinenizde UEFI kullanmak istiyorsanız, dağıtımınıza göre `ovmf` paketini kurmanız gerekir.

## Sonuç
Linux'ta sanallaştırma, sadece bir işletim sistemi içinde başka birini çalıştırmak değildir; sisteminizin sınırlarını zorlamaktır. Başlangıç için VirtualBox harika olsa da, uzun vadede KVM/QEMU'nun sunduğu çekirdek seviyesindeki hıza hayran kalacaksınız.

{{< ad >}}
