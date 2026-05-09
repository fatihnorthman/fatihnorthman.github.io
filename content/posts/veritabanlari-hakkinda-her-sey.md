---
title: "Veritabanları Hakkında Her Şey"
date: 2026-05-09T16:47:20+03:00
lastmod: 2026-05-09T16:47:20+03:00
draft: false
tags: ["veritabanı", "database", "SQL", "NoSQL", "MySQL", "PostgreSQL", "MongoDB", "Redis", "veritabanıyönetimi", "yazılımgeliştirme", "verimodelleme", "ACID", "normalizasyon", "indeksleme", "verianalizi", "backendgeliştirme", "yazılımcı", "datascience", "bigdata", "veritabanıtasarımı", "ilişkiselveri", "performansoptimizasyonu", "ORMnedir", "databasedesign", "yazılımeğitimi"]
categories: ["Genel"]
author: "Fatih Northman"
description: "Veritabanları nedir, nasıl çalışır? İlişkisel ve NoSQL veritabanları arasındaki farklar, SQL komutları, indeksleme, normalizasyon, ACID prensipleri ve gerçek dünya kullanım senaryoları ile veritabanı dünyasını baştan sona öğrenin. Yazılımcılar ve veri mühendisleri için kapsamlı Türkçe rehber."
slug: "veritabanlari-hakkinda-her-sey"
readingTime: true
weight: 1
image: "/images/1778345239109-veritabani.jpg"
---

> *"Veri, 21. yüzyılın petrolüdür. Ama ham petrol gibi, işlenmeden değer taşımaz."* — Clive Humby
 
---
 
## 📌 İçindekiler
 
1. [Veritabanı Nedir?](#1-veritabanı-nedir)
2. [Veritabanı Yönetim Sistemleri (DBMS)](#2-veritabanı-yönetim-sistemleri-dbms)
3. [Veritabanı Türleri](#3-veritabanı-türleri)
4. [İlişkisel Veritabanları ve SQL](#4-ilişkisel-veritabanları-ve-sql)
5. [Normalizasyon](#5-normalizasyon)
6. [ACID Prensipleri ve İşlemler](#6-acid-prensipleri-ve-işlemler-transactions)
7. [İndeksleme (Indexing)](#7-indeksleme-indexing)
8. [NoSQL Veritabanları](#8-nosql-veritabanları)
9. [İlişkisel vs NoSQL](#9-ilişkisel-vs-nosql-ne-zaman-hangisini-kullanmalı)
10. [Veritabanı Tasarımı ve Veri Modelleme](#10-veritabanı-tasarımı-ve-veri-modelleme)
11. [Performans Optimizasyonu](#11-performans-optimizasyonu)
12. [Güvenlik ve Yetkilendirme](#12-güvenlik-ve-yetkilendirme)
13. [Yedekleme ve Kurtarma](#13-yedekleme-ve-kurtarma-backup--recovery)
14. [Büyük Veri ve Dağıtık Veritabanları](#14-büyük-veri-ve-dağıtık-veritabanları)
15. [Gerçek Dünya Kullanım Senaryoları](#15-gerçek-dünya-kullanım-senaryoları)
16. [Kariyer ve Öğrenme Yolu](#16-kariyer-ve-öğrenme-yolu)
---
 
## 1. Veritabanı Nedir?
 
**Veritabanı (Database)**, organize edilmiş, yapılandırılmış veri koleksiyonudur. Verilerin sistematik biçimde depolanmasını, erişilmesini, güncellenmesini ve yönetilmesini sağlar.
 
Günlük hayattan örnekler:
 
| Analog Dünya | Dijital Karşılık |
|---|---|
| Kütüphane katalog fişleri | Kitap veritabanı |
| Eczane reçete defterleri | Hasta kayıt sistemi |
| Telefon rehberi | Kişi tablosu |
| Banka hesap cüzdanı | Finansal işlem veritabanı |
 
### Veritabanı Olmadan Ne Olur?
 
D�şünün: Her gün milyonlarca kullanıcı Instagram'a fotoğraf yüklüyor. Bu fotoğrafları, beğenileri, yorumları, takipçileri — tüm bu veriyi yönetmek için güçlü, güvenilir ve hızlı bir veritabanı altyapısı şarttır. Veritabanı olmadan:
 
- Veriler tutarsız olur (aynı kullanıcı iki farklı yerde farklı görünebilir)
- Veri kaybı yaşanır
- Performans sorunları ortaya çıkar
- Güvenlik açıkları oluşur
---
 
## 2. Veritabanı Yönetim Sistemleri (DBMS)
 
**DBMS (Database Management System)**, veritabanı ile kullanıcı/uygulama arasındaki arayüzdür. Tüm işlemleri yönetir.
 
```
┌─────────────────────────────────────────────┐
│              KULLANICI / UYGULAMA           │
└──────────────────┬──────────────────────────┘
                   │  Sorgu / İstek
                   ▼
┌─────────────────────────────────────────────┐
│                   DBMS                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Sorgu    │  │ İşlem    │  │Güvenlik  │  │
│  │ İşleyici │  │ Yönet.   │  │Kontrol   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  │
│  │ Önbellek │  │ Yedekleme│  │ İndeks   │  │
│  │ Yönet.   │  │ Sistemi  │  │ Yönet.   │  │
│  └──────────┘  └──────────┘  └──────────┘  │
└──────────────────┬──────────────────────────┘
                   ▼
┌─────────────────────────────────────────────┐
│           FİZİKSEL DEPOLAMA (Disk)          │
└─────────────────────────────────────────────┘
```
 
### Popüler DBMS Sistemleri
 
| DBMS | Tür | Kullanım Alanı | Şirket |
|------|-----|----------------|--------|
| MySQL | İlişkisel | Web uygulamaları | Oracle |
| PostgreSQL | İlişkisel | Kurumsal, gelişmiş | Topluluk |
| Microsoft SQL Server | İlişkisel | Kurumsal (.NET) | Microsoft |
| Oracle DB | İlişkisel | Büyük kurumlar | Oracle |
| MongoDB | NoSQL (Belge) | Esnek veri | MongoDB Inc. |
| Redis | NoSQL (Anahtar-Değer) | Önbellekleme | Redis Labs |
| Cassandra | NoSQL (Sütun) | Büyük veri | Apache |
| Elasticsearch | NoSQL (Arama) | Metin arama | Elastic |
 
---
 
## 3. Veritabanı Türleri
 
### 3.1 İlişkisel Veritabanları (RDBMS)
 
Veriyi **tablolar** halinde saklar. Tablolar arasında **yabancı anahtar (foreign key)** ile ilişkiler kurulur.
 
```
KULLANICILAR                    SİPARİŞLER
┌────┬──────────┬──────────┐    ┌────┬────────────┬──────────┐
│ id │   ad     │  email   │    │ id │kullanici_id│  tutar   │
├────┼──────────┼──────────┤    ├────┼────────────┼──────────┤
│  1 │ Ayşe     │ a@b.com  │    │  1 │     1      │  250.00  │
│  2 │ Mehmet   │ m@b.com  │    │  2 │     1      │   89.90  │
│  3 │ Fatma    │ f@b.com  │    │  3 │     2      │  412.50  │
└────┴──────────┴──────────┘    └────┴────────────┴──────────┘
              └──────────── İlişki (1'e Çok) ─────────────────┘
```
 
### 3.2 NoSQL Veritabanları
 
"Not Only SQL" anlamına gelir. Alt türleri:
 
- **Belge Tabanlı** (MongoDB, CouchDB): JSON/BSON belgeler
- **Anahtar-Değer** (Redis, DynamoDB): Basit key-value çiftleri
- **Sütun Ailesi** (Cassandra, HBase): Sütun grupları
- **Graf** (Neo4j, ArangoDB): Düğüm ve kenar ilişkileri
### 3.3 Diğer Türler
 
- **NewSQL** (CockroachDB, Google Spanner): ACID + yatay ölçekleme
- **Zaman Serisi** (InfluxDB, TimescaleDB): IoT ve metrik verisi
- **Veri Ambarı** (Snowflake, BigQuery): Analitik/OLAP iş yükleri
---
 
## 4. İlişkisel Veritabanları ve SQL
 
### 4.1 SQL Komut Kategorileri
 
| Kategori | Komutlar | Açıklama |
|----------|----------|----------|
| **DDL** | CREATE, ALTER, DROP, TRUNCATE | Yapı tanımlama |
| **DML** | SELECT, INSERT, UPDATE, DELETE | Veri işleme |
| **DCL** | GRANT, REVOKE | Yetki yönetimi |
| **TCL** | COMMIT, ROLLBACK, SAVEPOINT | İşlem yönetimi |
 
### 4.2 DDL — Yapı Tanımlama
 
```sql
-- Tablo oluşturma
CREATE TABLE kullanicilar (
    id           INT           PRIMARY KEY AUTO_INCREMENT,
    ad           VARCHAR(50)   NOT NULL,
    soyad        VARCHAR(50)   NOT NULL,
    email        VARCHAR(100)  UNIQUE NOT NULL,
    dogum_tarihi DATE,
    maas         DECIMAL(10,2) DEFAULT 0.00,
    aktif        BOOLEAN       DEFAULT TRUE,
    olusturuldu  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);
 
-- Tablo güncelleme
ALTER TABLE kullanicilar ADD COLUMN telefon VARCHAR(15);
ALTER TABLE kullanicilar MODIFY COLUMN maas DECIMAL(12,2);
ALTER TABLE kullanicilar DROP COLUMN telefon;
 
-- Silme
DROP TABLE kullanicilar;      -- Tabloyu tamamen siler
TRUNCATE TABLE kullanicilar;  -- Veriyi siler, yapıyı korur
```
 
### 4.3 DML — Veri İşleme
 
```sql
-- Veri ekleme
INSERT INTO kullanicilar (ad, soyad, email, maas)
VALUES ('Ayşe', 'Kaya', 'ayse@ornek.com', 12500.00);
 
-- Çoklu kayıt
INSERT INTO kullanicilar (ad, soyad, email) VALUES
    ('Mehmet', 'Demir', 'mehmet@ornek.com'),
    ('Fatma',  'Çelik', 'fatma@ornek.com');
 
-- Sorgulama
SELECT ad, soyad, email FROM kullanicilar
WHERE aktif = TRUE AND maas > 10000
ORDER BY maas DESC
LIMIT 10 OFFSET 20;
 
-- Güncelleme
UPDATE kullanicilar
SET maas = maas * 1.10
WHERE departman = 'Yazilim' AND performans_puani >= 4;
 
-- Silme
DELETE FROM kullanicilar
WHERE aktif = FALSE AND son_giris < '2022-01-01';
```
 
### 4.4 JOIN İşlemleri
 
```sql
-- INNER JOIN: Her iki tabloda eşleşen kayıtlar
SELECT k.ad, k.soyad, s.urun_adi, s.tutar
FROM kullanicilar k
INNER JOIN siparisler s ON k.id = s.kullanici_id;
 
-- LEFT JOIN: Sol tablonun tamamı + sağ eşleşmeler
SELECT k.ad, COUNT(s.id) AS siparis_sayisi
FROM kullanicilar k
LEFT JOIN siparisler s ON k.id = s.kullanici_id
GROUP BY k.id, k.ad;
 
-- SELF JOIN: Aynı tabloya join (hiyerarşi)
SELECT e.ad AS calisan, y.ad AS yonetici
FROM calisanlar e
INNER JOIN calisanlar y ON e.yonetici_id = y.id;
```
 
```
INNER JOIN    LEFT JOIN    RIGHT JOIN   FULL OUTER
  A ∩ B        A ∪ (A∩B)   B ∪ (A∩B)    A ∪ B
 ┌──┬──┐      ┌──┬──┐      ┌──┬──┐      ┌──┬──┐
 │  │██│      │██│██│      │  │██│      │██│██│
 └──┴──┘      └──┴──┘      └──┴──┘      └──┴──┘
```
 
### 4.5 Aggregate ve GROUP BY
 
```sql
SELECT
    departman,
    COUNT(*)  AS calisan_sayisi,
    AVG(maas) AS ort_maas,
    MIN(maas) AS min_maas,
    MAX(maas) AS max_maas
FROM calisanlar
GROUP BY departman
HAVING AVG(maas) > 8000
ORDER BY ort_maas DESC;
```
 
### 4.6 Window Fonksiyonları
 
```sql
-- ROW_NUMBER, RANK, DENSE_RANK
SELECT
    ad, maas,
    ROW_NUMBER()  OVER (ORDER BY maas DESC) AS sirano,
    RANK()        OVER (ORDER BY maas DESC) AS rank,
    DENSE_RANK()  OVER (ORDER BY maas DESC) AS yogun_rank
FROM kullanicilar;
 
-- Departman içinde sıralama
SELECT
    ad, departman, maas,
    AVG(maas) OVER (PARTITION BY departman) AS dept_ort,
    maas - AVG(maas) OVER (PARTITION BY departman) AS fark
FROM calisanlar;
 
-- Önceki/sonraki satır değerleri
SELECT
    tarih, satis,
    LAG(satis)  OVER (ORDER BY tarih) AS onceki_gun,
    LEAD(satis) OVER (ORDER BY tarih) AS sonraki_gun,
    satis - LAG(satis) OVER (ORDER BY tarih) AS degisim
FROM gunluk_satislar;
```
 
### 4.7 CTE (Common Table Expression)
 
```sql
-- Tekli CTE
WITH yuksek_maasli AS (
    SELECT * FROM calisanlar WHERE maas > 15000
)
SELECT departman, COUNT(*) AS sayi
FROM yuksek_maasli
GROUP BY departman;
 
-- Özyinelemeli CTE (hiyerarşik yapılar)
WITH RECURSIVE organizasyon AS (
    -- Temel: CEO
    SELECT id, ad, yonetici_id, 1 AS seviye
    FROM calisanlar WHERE yonetici_id IS NULL
 
    UNION ALL
 
    -- Özyineleme
    SELECT c.id, c.ad, c.yonetici_id, o.seviye + 1
    FROM calisanlar c
    JOIN organizasyon o ON c.yonetici_id = o.id
)
SELECT * FROM organizasyon ORDER BY seviye, ad;
```
 
---
 
## 5. Normalizasyon
 
**Normalizasyon**, veri tekrarını azaltmak ve veri bütünlüğünü sağlamak için uygulanan sistematik süreçtir.
 
### Neden Gerekli?
 
Normalleştirilmemiş tablolarda 3 temel anomali oluşur:
- **Ekleme anomalisi**: Yeni kayıt eklenince zorunlu gereksiz tekrar
- **Güncelleme anomalisi**: Bir ürünün fiyatı değişince tüm satırları güncellemek
- **Silme anomalisi**: Bir kaydı silince başka verilerin kaybolması
### 1NF — Her hücrede tek atomik değer
 
```
❌ İhlal: telefon = "555-1234, 555-5678"  ← Birden fazla değer
✅ Çözüm: KULLANICI_TELEFON (kullanici_id, telefon) → ayrı tablo
```
 
### 2NF — Kısmi bağımlılık yok (bileşik PK'da)
 
```
❌ İhlal (PK: siparis_id + urun_id):
   urun_adi → yalnızca urun_id'e bağlı (kısmi bağımlılık!)
 
✅ Çözüm: URUNLER (urun_id, urun_adi, fiyat) → ayrı tablo
          SIPARIS_DETAY (siparis_id, urun_id, miktar) → bağ tablosu
```
 
### 3NF — Geçişli bağımlılık yok
 
```
❌ İhlal: calisan_id → departman_id → dept_adi
   dept_adi, calisan_id'e değil, departman_id'e bağımlı
 
✅ Çözüm: DEPARTMANLAR (dep_id, dep_adi) → ayrı tablo
          CALISANLAR (calisan_id, ad, dep_id) → referans
```
 
### BCNF, 4NF, 5NF
 
- **BCNF**: Her determinant bir aday anahtar olmalı
- **4NF**: Çok değerli bağımlılık bulunmamalı
- **5NF**: Join bağımlılıkları ortadan kaldırılmalı
> ⚠️ **Pratik Not:** Gerçek projeler çoğunlukla 3NF ile yeterince normalleştirilir. Aşırı normalizasyon bazen performansı olumsuz etkiler.
 
---
 
## 6. ACID Prensipleri ve İşlemler (Transactions)
 
**Transaction**, birden fazla SQL komutunun tek bir mantıksal birim olarak çalışmasıdır. Ya hepsi başarılı olur ya da hiçbiri uygulanmaz.
 
### A — Atomicity (Atomiklik)
 
```sql
BEGIN TRANSACTION;
 
    -- Banka havalesi: her iki adım da başarılı olmalı
    UPDATE hesaplar SET bakiye = bakiye - 1000 WHERE id = 1;
    UPDATE hesaplar SET bakiye = bakiye + 1000 WHERE id = 2;
 
COMMIT;   -- Her ikisi başarılıysa kaydet
-- veya
ROLLBACK; -- Herhangi biri başarısızsa tümünü geri al
```
 
### C — Consistency (Tutarlılık)
 
```sql
-- Kısıtlar her zaman korunur
ALTER TABLE hesaplar ADD CONSTRAINT bakiye_pozitif CHECK (bakiye >= 0);
-- Bakiye hiçbir zaman negatife düşemez
```
 
### I — Isolation (İzolasyon)
 
| Seviye | Dirty Read | Non-Repeatable Read | Phantom Read |
|--------|-----------|---------------------|--------------|
| READ UNCOMMITTED | Var | Var | Var |
| READ COMMITTED | Yok | Var | Var |
| REPEATABLE READ | Yok | Yok | Var |
| SERIALIZABLE | Yok | Yok | Yok |
 
```sql
SET TRANSACTION ISOLATION LEVEL REPEATABLE READ;
BEGIN;
    SELECT bakiye FROM hesaplar WHERE id = 1; -- 5000
    -- Başka bir transaction değiştirseydi bile burada hâlâ 5000 görürüz
COMMIT;
```
 
### D — Durability (Kalıcılık)
 
Commit edilen işlem sistem çökmesinde bile kaybolmaz. WAL (Write-Ahead Logging) ile sağlanır: değişiklikler önce log dosyasına yazılır, sonra diske uygulanır.
 
---
 
## 7. İndeksleme (Indexing)
 
İndeks, sorgu performansını dramatik biçimde artıran veri yapısıdır. Kitabın arkasındaki dizin gibi çalışır.
 
```
İndeks Olmadan (Full Table Scan):
10.000.000 kayıtlı tabloda → Her satıra tek tek bakılır → YAVAŞ ⏳
 
B-Tree İndeks İle:
log₂(10.000.000) ≈ 23 adımda bulunur → HIZ ⚡
```
 
### İndeks Türleri
 
```sql
-- B-Tree (en yaygın): aralık ve eşitlik sorgular
CREATE INDEX idx_email ON kullanicilar(email);
CREATE UNIQUE INDEX idx_email_unique ON kullanicilar(email);
 
-- Bileşik indeks (sütun sırası kritik!)
CREATE INDEX idx_dept_ad ON calisanlar(departman, ad);
-- WHERE departman = '...' AND ad = '...' → Etkili
-- WHERE ad = '...'                       → ETKİSİZ (ilk sütun atlanmış)
 
-- Hash: yalnızca eşitlik sorguları
CREATE INDEX idx_hash ON kullanicilar USING HASH (email);
 
-- Full-Text: metin arama
CREATE FULLTEXT INDEX idx_icerik ON makaleler(baslik, icerik);
SELECT * FROM makaleler
WHERE MATCH(baslik, icerik) AGAINST('veritabani' IN BOOLEAN MODE);
 
-- Partial (kısmi): koşullu indeks
CREATE INDEX idx_aktif ON kullanicilar(email) WHERE aktif = TRUE;
```
 
### Ne Zaman İndeks Kullanmalı?
 
```
✅  WHERE, JOIN, ORDER BY, GROUP BY sütunları
✅  Yüksek kardinalite (çok farklı değer içeren sütunlar)
✅  Yabancı anahtar sütunları
 
❌  Küçük tablolar (full scan zaten hızlı)
❌  Çok sık güncellenen sütunlar
❌  Düşük kardinalite (boolean, cinsiyet gibi)
```
 
### EXPLAIN ile Analiz
 
```sql
EXPLAIN ANALYZE
SELECT * FROM kullanicilar WHERE departman = 'Yazilim';
 
-- Çıktıda bakılacaklar:
-- type: ALL (kötü) → index/ref/const (iyi)
-- rows: tarama edilen tahmini satır sayısı
-- Extra: "Using filesort" veya "Using temporary" → optimize et
```
 
---
 
## 8. NoSQL Veritabanları
 
### 8.1 Belge Tabanlı: MongoDB
 
```javascript
// Belge ekleme (şema esnekliği sayesinde iç içe yapı mümkün)
db.kullanicilar.insertOne({
    ad: "Ayşe",
    email: "ayse@ornek.com",
    adres: {
        sehir: "İstanbul",
        ilce: "Kadıköy"
    },
    hobiler: ["okuma", "yüzme"]
});
 
// Sorgulama
db.kullanicilar.find({
    "adres.sehir": "İstanbul",
    hobiler: "okuma"
}).sort({ ad: 1 }).limit(10);
 
// Aggregation Pipeline
db.siparisler.aggregate([
    { $match: { durum: "tamamlandi" } },
    { $group: { _id: "$kullanici_id", toplam: { $sum: "$tutar" } } },
    { $sort: { toplam: -1 } },
    { $limit: 10 }
]);
```
 
### 8.2 Anahtar-Değer: Redis
 
```bash
# Temel işlemler
SET kullanici:1:ad "Ayşe"
GET kullanici:1:ad          # → "Ayşe"
 
# TTL ile sona erme (oturum yönetimi)
SET oturum:abc123 "kullanici_verisi" EX 3600
 
# Sayaç
INCR sayfa:ziyaret:anasayfa
INCRBY sepet:toplam:1 150
 
# Liste (mesaj kuyruğu)
LPUSH gorev_kuyrugu "gorev_1"
RPOP gorev_kuyrugu
 
# Sorted Set (liderlik tablosu)
ZADD liderlik 9500 "kullanici:1"
ZADD liderlik 8750 "kullanici:2"
ZREVRANGE liderlik 0 9 WITHSCORES
```
 
**Kullanım alanları:** Oturum yönetimi, önbellekleme, pub/sub, hız limitleme, gerçek zamanlı liderlik tablosu
 
### 8.3 Sütun Ailesi: Cassandra
 
```sql
CREATE KEYSPACE e_ticaret
WITH replication = {'class': 'SimpleStrategy', 'replication_factor': 3};
 
CREATE TABLE e_ticaret.siparisler (
    musteri_id    UUID,
    siparis_tarihi TIMESTAMP,
    siparis_id    UUID,
    urun_adi      TEXT,
    tutar         DECIMAL,
    PRIMARY KEY ((musteri_id), siparis_tarihi, siparis_id)
) WITH CLUSTERING ORDER BY (siparis_tarihi DESC);
```
 
### 8.4 Graf: Neo4j (Cypher)
 
```cypher
// Düğüm ve ilişki oluşturma
CREATE (a:Kisi {ad: 'Ayşe'})
CREATE (b:Kisi {ad: 'Mehmet'})
CREATE (a)-[:TAKIP_EDIYOR]->(b)
 
// 2. derece bağlantı önerisi
MATCH (ben:Kisi {ad: 'Ayşe'})-[:TAKIP_EDIYOR]->(ortak)-[:TAKIP_EDIYOR]->(oneri)
WHERE NOT (ben)-[:TAKIP_EDIYOR]->(oneri) AND ben <> oneri
RETURN oneri.ad, COUNT(*) AS ortak
ORDER BY ortak DESC;
```
 
---
 
## 9. İlişkisel vs NoSQL: Ne Zaman Hangisini Kullanmalı?
 
| Kriter | İlişkisel | NoSQL |
|--------|-----------|-------|
| Şema esnekliği | Düşük | Yüksek |
| ACID garantisi | Güçlü | Değişken |
| Ölçekleme | Dikey | Yatay |
| Sorgulama gücü | Çok yüksek | Orta |
| Veri tutarlılığı | Güçlü | Nihai tutarlılık |
| Tipik kullanım | Finans, e-ticaret | Büyük veri, IoT, sosyal |
 
```
İlişkisel seç:
✅ Sabit ve net veri yapısı
✅ Güçlü ACID garantisi (finans, sağlık, sigorta)
✅ Karmaşık JOIN ve sorgular
✅ Veri bütünlüğü kritik
 
NoSQL seç:
✅ Şema esnekliği gerekiyor
✅ Yatay ölçekleme şart (çok büyük veri)
✅ Yüksek yazma/okuma hızı
✅ Tam metin arama, önbellekleme, graf ilişkileri
```
 
---
 
## 10. Veritabanı Tasarımı ve Veri Modelleme
 
### 10.1 ER Diyagramı
 
```
[KULLANICI] ──<< [SİPARİŞ] >>── [ÜRÜN]
     |                |
   [ADRES]        [ÖDEME]
 
─── : İlişki    ─< : "Bir" taraf    >── : "Çok" taraf
```
 
### 10.2 İlişki Türleri
 
**Bire-Bir (1:1)**
```sql
CREATE TABLE profiller (
    kullanici_id INT PRIMARY KEY,
    bio TEXT,
    FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id)
);
```
 
**Bire-Çok (1:N)**
```sql
CREATE TABLE siparisler (
    id INT PRIMARY KEY,
    kullanici_id INT NOT NULL,
    FOREIGN KEY (kullanici_id) REFERENCES kullanicilar(id)
);
```
 
**Çoka-Çok (M:N) — Ara Tablo ile**
```sql
CREATE TABLE kayitlar (
    ogrenci_id INT,
    kurs_id    INT,
    kayit_tarihi DATE,
    PRIMARY KEY (ogrenci_id, kurs_id),
    FOREIGN KEY (ogrenci_id) REFERENCES ogrenciler(id),
    FOREIGN KEY (kurs_id)    REFERENCES kurslar(id)
);
```
 
### 10.3 ORM Örnekleri
 
**Python - SQLAlchemy:**
```python
from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship, declarative_base
 
Base = declarative_base()
 
class Kullanici(Base):
    __tablename__ = 'kullanicilar'
    id         = Column(Integer, primary_key=True)
    ad         = Column(String(50), nullable=False)
    email      = Column(String(100), unique=True)
    siparisler = relationship("Siparis", back_populates="kullanici")
 
# Kullanım
kullanici = session.query(Kullanici).filter_by(email='ayse@ornek.com').first()
print(kullanici.siparisler)
```
 
**JavaScript - Prisma:**
```javascript
// schema.prisma
model Kullanici {
  id         Int       @id @default(autoincrement())
  email      String    @unique
  siparisler Siparis[]
}
 
// Uygulama kodu
const kullanici = await prisma.kullanici.findUnique({
  where: { email: 'ayse@ornek.com' },
  include: { siparisler: true }
});
```
 
---
 
## 11. Performans Optimizasyonu
 
### 11.1 Yaygın Hatalar ve Çözümleri
 
```sql
-- ❌ Fonksiyon içinde sütun (indeks bypass)
SELECT * FROM siparisler WHERE YEAR(olusturuldu) = 2024;
 
-- ✅ Aralık sorgusu (indeks kullanır)
SELECT * FROM siparisler
WHERE olusturuldu >= '2024-01-01' AND olusturuldu < '2025-01-01';
 
-- ❌ SELECT * (gereksiz veri)
SELECT * FROM kullanicilar WHERE email = 'ayse@ornek.com';
 
-- ✅ Yalnızca gerekli sütunlar
SELECT id, ad, email FROM kullanicilar WHERE email = 'ayse@ornek.com';
 
-- ❌ N+1 sorgu problemi
FOR kullanici IN kullanicilar:
    sorgu("SELECT * FROM siparisler WHERE kullanici_id = ?", kullanici.id)
 
-- ✅ Tek JOIN ile çözüm
SELECT k.id, k.ad, s.tutar
FROM kullanicilar k LEFT JOIN siparisler s ON k.id = s.kullanici_id;
```
 
### 11.2 Önbellekleme Mimarisi
 
```
İSTEK GELDİ
     │
     ▼
[Redis Önbellek] ──── Hit ──────────────────► Hızlı Yanıt ⚡
     │
     │ Miss
     ▼
[Veritabanı] ──────────────────────────────► Sonuç + Cache'e Yaz
```
 
### 11.3 Replikasyon ve Sharding
 
```
Replikasyon (Okuma/Yazma Ayrımı):
[PRIMARY] ─► Yazma işlemleri
    │
    ├─► [REPLICA 1] ─► Okuma
    ├─► [REPLICA 2] ─► Okuma
    └─► [REPLICA 3] ─► Okuma
 
Sharding (Yatay Bölümleme):
100M kullanıcı → 4 sunucuya eşit dağıtım
Shard 1: id 1-25M    (Sunucu A)
Shard 2: id 25-50M   (Sunucu B)
Shard 3: id 50-75M   (Sunucu C)
Shard 4: id 75-100M  (Sunucu D)
```
 
### 11.4 Connection Pooling
 
```python
engine = create_engine(
    'postgresql://user:pass@localhost/db',
    pool_size=20,       # Havuzdaki bağlantı sayısı
    max_overflow=30,    # Ekstra bağlantı limiti
    pool_timeout=30,    # Bekleme süresi (sn)
    pool_recycle=3600   # Yenileme süresi (sn)
)
```
 
---
 
## 12. Güvenlik ve Yetkilendirme
 
### 12.1 SQL Injection — En Kritik Açık
 
```python
# ❌ TEHLİKELİ — SQL Injection açığı
sorgu = f"SELECT * FROM kullanicilar WHERE email = '{kullanici_girdisi}'"
# Girdi: ' OR '1'='1  → Tüm kayıtları döner!
 
# ✅ GÜVENLİ — Parametreli sorgu
cursor.execute("SELECT * FROM kullanicilar WHERE email = %s", (kullanici_girdisi,))
```
 
### 12.2 Kullanıcı ve Yetki Yönetimi
 
```sql
-- Minimum yetki prensibi
CREATE USER 'uygulama'@'%' IDENTIFIED BY 'guclu_sifre_123!';
GRANT SELECT, INSERT, UPDATE ON e_ticaret.siparisler TO 'uygulama'@'%';
 
-- Sadece okuma yetkisi (raporlama)
GRANT SELECT ON e_ticaret.* TO 'rapor_kullanici'@'%';
 
-- Yetki geri alma
REVOKE DELETE ON e_ticaret.siparisler FROM 'uygulama'@'%';
```
 
### 12.3 Şifre Hashleme
 
```sql
-- PostgreSQL pgcrypto ile bcrypt
SELECT crypt('kullanici_sifresi', gen_salt('bf', 8));
 
-- Doğrulama
SELECT (crypt('girilen_sifre', sifre_hash) = sifre_hash) AS dogru_mu
FROM kullanicilar WHERE id = 1;
```
 
---
 
## 13. Yedekleme ve Kurtarma (Backup & Recovery)
 
### Yedekleme Türleri
 
| Tür | Açıklama | Avantaj | Dezavantaj |
|-----|----------|---------|------------|
| Tam Yedek | Tüm veritabanı | Kolay geri yükleme | Büyük boyut |
| Artımlı | Son yedekten değişenler | Küçük boyut | Karmaşık geri yükleme |
| Diferansiyel | Son tam yedekten değişenler | Orta boyut | Orta karmaşıklık |
| Anlık Görüntü | Disk snapshot | Çok hızlı | Depolama maliyeti |
 
```bash
# MySQL yedekleme
mysqldump -u root -p e_ticaret | gzip > yedek_$(date +%Y%m%d).sql.gz
 
# PostgreSQL yedekleme
pg_dump -Fc -U postgres e_ticaret > yedek.dump
 
# Geri yükleme
pg_restore -d e_ticaret yedek.dump
```
 
> ⚠️ **Altın Kural:** Sadece yedek almak yetmez! Geri yükleme prosedürünü düzenli olarak test edin.
 
---
 
## 14. Büyük Veri ve Dağıtık Veritabanları
 
### CAP Teoremi
 
Dağıtık sistemlerde aynı anda yalnızca 2 garantiyi sağlayabilirsiniz:
 
```
           Tutarlılık (C)
                ▲
           CA   │   CP
               ─┼─
           AP   │
                │
Kullanılabilirlik (A) ─── Bölünme Toleransı (P)
 
CA: MySQL, PostgreSQL
CP: MongoDB, Redis, HBase
AP: Cassandra, CouchDB, DynamoDB
```
 
### OLTP vs OLAP
 
| Özellik | OLTP (Operasyonel) | OLAP (Analitik) |
|---------|-------------------|-----------------|
| Amaç | Günlük işlemler | Raporlama, analiz |
| Sorgular | Kısa, basit | Uzun, karmaşık |
| Depolama | Satır tabanlı | Sütun tabanlı |
| Örnek | MySQL, PostgreSQL | BigQuery, Snowflake |
| Yanıt süresi | Milisaniye | Dakikalar |
 
### Veri Ambarı Mimarisi (Star Schema)
 
```
                [ZAMAN]
                   │
   [ÜRÜN] ──── [SATIS] ──── [MÜŞTERI]
           FAKT   │   TABLOSU
                  │
             [MAĞAZA]
             (Boyut Tabloları)
```
 
---
 
## 15. Gerçek Dünya Kullanım Senaryoları
 
### E-Ticaret Platformu
 
```
┌─────────────┐   ┌─────────────┐   ┌──────────────┐
│  PostgreSQL  │   │    Redis    │   │Elasticsearch │
│  Kullanıcı  │   │  Sepet +   │   │  Ürün Arama  │
│  Sipariş    │   │  Oturum +  │   │  Full-Text   │
│  Ürün       │   │  Cache     │   │  Filtrele    │
└─────────────┘   └─────────────┘   └──────────────┘
       │
┌─────────────┐   ┌─────────────┐
│   MongoDB   │   │  BigQuery   │
│ Ürün Yorum │   │ Satış Anal. │
│ Esnek Şema  │   │ OLAP Rapor  │
└─────────────┘   └─────────────┘
```
 
### Sosyal Medya Uygulaması
 
- **MySQL/PostgreSQL**: Kullanıcı hesapları, gönderiler
- **Cassandra**: Zaman çizelgesi (Timeline) akışı — yüksek yazma hızı
- **Redis**: Oturum, trend konular, beğeni sayaçları
- **Neo4j**: Takip grafı, "Tanıyor olabileceğin kişiler" önerisi
- **Hadoop/Spark**: Kullanıcı davranış analizi, ML modelleri
### Bankacılık Sistemi
 
- **Oracle/PostgreSQL**: Hesap bakiyeleri, işlemler (sıkı ACID zorunlu)
- **Redis**: Gerçek zamanlı limit kontrolü (dakikada X işlem)
- **Elasticsearch**: İşlem arama, dolandırıcılık (fraud) tespiti
- **Kafka + Flink**: Gerçek zamanlı işlem akışı ve analizi
---
 
## 16. Kariyer ve Öğrenme Yolu
 
### Öğrenme Haritası
 
```
BAŞLANGIÇ (0–3 ay)
├── SQL temelleri: SELECT, INSERT, UPDATE, DELETE
├── JOIN türleri ve pratik uygulamaları
├── Temel normalizasyon (1NF, 2NF, 3NF)
└── MySQL veya PostgreSQL kurulumu ve kullanımı
 
ORTA SEVİYE (3–9 ay)
├── İleri SQL: Window fonksiyonları, CTE, Subqueries
├── İndeksleme stratejileri ve EXPLAIN kullanımı
├── Transaction, ACID ve kilitleme mekanizmaları
├── ER diyagramı ve veritabanı tasarımı
└── MongoDB veya Redis ile NoSQL deneyimi
 
İLERİ SEVİYE (9–18 ay)
├── Performans optimizasyonu ve query profiling
├── Replikasyon, sharding ve yüksek erişilebilirlik
├── CAP Teoremi ve dağıtık sistem kavramları
├── Veri ambarı (Snowflake, BigQuery, dbt)
└── Büyük veri araçları (Spark, Kafka, Airflow)
 
UZMAN (18+ ay)
├── Depolama motoru internals (B-tree, LSM-tree)
├── Özel veritabanı çözümleri tasarlama
├── Dağıtık konsensüs (Raft, Paxos)
└── ML pipeline'larına veri mühendisliği entegrasyonu
```
 
### Önerilen Kaynaklar
 
| Seviye | Kaynak | Tür |
|--------|--------|-----|
| Başlangıç | SQLZoo, Mode Analytics SQL Tutorial | İnteraktif |
| Başlangıç | "Learning SQL" — Alan Beaulieu | Kitap |
| Orta | PostgreSQL Resmi Dokümantasyon | Dokümantasyon |
| İleri | "Designing Data-Intensive Applications" — Kleppmann | Kitap |
| İleri | CMU Database Group (YouTube) | Video |
| Uzman | "Database Internals" — Alex Petrov | Kitap |
 
---
 
## 📝 Altın Kurallar — Özet
 
> Her zaman aklınızda tutun:
 
1. **Tasarım önce gelir** — Kodlamadan önce doğru veri modelini tasarla
2. **Normalizasyon şart, ama bilinçli denormalize et** — Performans için trade-off gerekebilir
3. **Her sütuna indeks koyma** — Gereğinden fazla indeks yazma performansını düşürür
4. **ACID'i küçümseme** — Finansal ve kritik sistemlerde vazgeçilmezdir
5. **NoSQL ≠ "SQL yetersiz"** — Her birinin doğru kullanım alanı vardır
6. **Güvenliği sonraya bırakma** — SQL injection koruması ve yetkilendirme baştan tasarlanmalı
7. **Yedek al, ama geri yüklemeyi de test et** — Test edilmemiş yedek güvence vermez
8. **İzle ve ölç** — Tahmin değil, EXPLAIN ve profiling ile optimizasyon yap
9. **Bağlantıları havuzla** — Her istek için yeni bağlantı açmak maliyetlidir
10. **Minimum yetki prensibi** — Her kullanıcıya yalnızca ihtiyacı olan yetkiyi ver
---
 
*Bu rehber, veritabanı dünyasına kapsamlı bir giriş sunmaktadır. Her konu başlığı başlı başına derinleştirilebilecek geniş bir alandır. Öğrenmeye devam edin, projeler geliştirin ve topluluklara katılın!*