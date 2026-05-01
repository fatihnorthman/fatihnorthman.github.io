#!/usr/bin/env python3
"""
Test email gönderici — blog e-posta şablonunu test eder.
Kullanım: python3 test-email.py
"""

import json, urllib.request, urllib.error, os

# ── Ayarlar ────────────────────────────────────────────────────
API_KEY    = os.environ.get("RESEND_API_KEY", "BURAYA_API_KEY_YAZIN")
TO_EMAIL   = os.environ.get("TEST_EMAIL",     "BURAYA_MAILINIZ")

# Test verisi
POST_TITLE = "KDE Plasma ile Masaüstünüzü Yeniden Tasarlayın"
POST_DESC  = "Linux'ta temaların, ikonların, pencere düzenlerinin ve animasyonların nasıl tamamen kişiselleştirilebileceğini anlatan kapsamlı bir rehber."
POST_URL   = "https://fatihnorthman.github.io/kde-plasma-gorsellestirme-rehberi/"
# ───────────────────────────────────────────────────────────────

template_path = os.path.join(os.path.dirname(__file__), ".github", "email-template.html")

try:
    with open(template_path, "r", encoding="utf-8") as f:
        html = f.read()
except FileNotFoundError:
    print(f"HATA: {template_path} bulunamadı. Bu scripti proje kökünden çalıştırın.")
    exit(1)

html = html.replace("{{POST_TITLE}}", POST_TITLE) \
           .replace("{{POST_DESC}}",  POST_DESC)  \
           .replace("{{POST_URL}}",   POST_URL)

payload = {
    "from":    "Fatih Şahan <onboarding@resend.dev>",
    "to":      [TO_EMAIL],
    "subject": f"[TEST] Yeni yazı: {POST_TITLE}",
    "html":    html
}

print(f"Gönderiliyor: {TO_EMAIL} ...")

req = urllib.request.Request(
    "https://api.resend.com/emails",
    data=json.dumps(payload).encode(),
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type":  "application/json"
    }
)

try:
    with urllib.request.urlopen(req) as r:
        body = json.loads(r.read().decode())
        print(f"Basarili! ID: {body.get('id')}")
        print(f"Mail kututunuzu kontrol edin: {TO_EMAIL}")
except urllib.error.HTTPError as e:
    err = e.read().decode()
    print(f"HATA {e.code}: {err}")
    if e.code == 401:
        print("-> API key gecersiz veya eksik.")
    elif e.code == 422:
        print("-> To adresi gecersiz veya onaysiz domain sorunu.")
