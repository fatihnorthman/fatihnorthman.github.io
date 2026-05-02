const REPO_OWNER = "fatihnorthman";
const REPO_NAME = "fatihnorthman.github.io";
let GITHUB_TOKEN = localStorage.getItem("gh_token") || "";

// Başlangıç Kontrolü
if (GITHUB_TOKEN) {
    document.getElementById("login-overlay").style.display = "none";
    document.getElementById("status").innerText = "SİSTEM ÇEVRİMİÇİ";
    document.getElementById("status").classList.add("online");
    log("Sistem otomatik olarak yetkilendirildi.");
}

function log(msg) {
    const consoleLogs = document.getElementById("console-logs");
    const time = new Date().toLocaleTimeString();
    consoleLogs.innerHTML += `<br>> [${time}] ${msg}`;
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
}

function authAdmin() {
    const token = document.getElementById("gh-token").value.trim();
    if (token) {
        GITHUB_TOKEN = token;
        localStorage.setItem("gh_token", token);
        document.getElementById("login-overlay").style.display = "none";
        document.getElementById("status").innerText = "SİSTEM ÇEVRİMÇİ";
        document.getElementById("status").classList.add("online");
        log("Yetkilendirme başarılı.");
    }
}

function logout() {
    localStorage.removeItem("gh_token");
    location.reload();
}

// Resim Önizleme
document.getElementById("post-image").onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById("image-preview");
            preview.style.display = "block";
            preview.innerHTML = `<img src="${event.target.result}">`;
            log(`Görsel hazır: ${file.name}`);
        };
        reader.readAsDataURL(file);
    }
};

// ASCII Slug Oluşturucu (Protokol Kuralı)
function slugify(text) {
    const trMap = {
        'ç': 'c', 'ğ': 'g', 'ı': 'i', 'İ': 'i', 'ö': 'o', 'ş': 's', 'ü': 'u',
        'Ç': 'c', 'Ğ': 'g', 'Ö': 'o', 'Ş': 's', 'Ü': 'u', ' ': '-'
    };
    for (let key in trMap) {
        text = text.replace(new RegExp(key, 'g'), trMap[key]);
    }
    return text.toLowerCase()
        .replace(/[^-a-z0-9]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

async function publishPost() {
    const title = document.getElementById("post-title").value.trim();
    const tagsRaw = document.getElementById("post-tags").value.trim();
    const category = document.getElementById("post-category").value;
    const weight = document.getElementById("post-weight").value.trim();
    const desc = document.getElementById("post-desc").value.trim();
    const content = document.getElementById("post-content").value.trim();
    const imageFile = document.getElementById("post-image").files[0];

    if (!title || !content) {
        log("HATA: Başlık ve İçerik zorunludur!");
        return;
    }

    const btn = document.getElementById("publish-btn");
    btn.disabled = true;
    btn.innerText = "YAYINLANIYOR...";

    const slug = slugify(title);
    const date = new Date().toISOString().split('.')[0] + "+03:00"; // Hugo format
    const fileName = `${slug}.md`;
    let imagePath = "";

    try {
        // 1. Varsa Görseli Yükle
        if (imageFile) {
            log("Görsel yükleniyor...");
            const reader = new FileReader();
            const base64Img = await new Promise((resolve) => {
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.readAsDataURL(imageFile);
            });
            
            const imgFileName = `${Date.now()}-${slugify(imageFile.name.split('.')[0])}.${imageFile.name.split('.').pop()}`;
            await githubPut(`static/images/${imgFileName}`, base64Img, `Upload image: ${imgFileName}`);
            imagePath = `/images/${imgFileName}`;
            log(`Görsel yüklendi: ${imagePath}`);
        }

        // 2. Markdown Dosyasını Oluştur (YAML Front-matter)
        const tagsArr = tagsRaw.split(',').map(t => `"${t.trim()}"`).join(', ');
        const frontMatter = `---
title: "${title}"
date: ${date}
draft: false
tags: [${tagsArr}]
categories: ["${category}"]
author: "Fatih Northman"
description: "${desc}"
slug: "${slug}"
${weight ? `weight: ${weight}` : ""}
${imagePath ? `image: "${imagePath}"` : ""}
---

${content}`;

        // 3. Dosyayı GitHub'a Gönder (UTF-8 Güvenli)
        log("Markdown dosyası oluşturuluyor...");
        const utf8Bytes = new TextEncoder().encode(frontMatter);
        const base64MD = btoa(String.fromCharCode(...utf8Bytes));
        await githubPut(`content/posts/${fileName}`, base64MD, `Post: ${title}`);
        
        log("BAŞARI: Protokol yayına alındı!");
        alert("Yazı başarıyla paylaşıldı! Birkaç dakika içinde yayında olacaktır.");
        location.reload();

    } catch (err) {
        log(`KRİTİK HATA: ${err.message}`);
        console.error(err);
    } finally {
        btn.disabled = false;
        btn.innerText = "PROTOKOLÜ YAYINLA";
    }
}

async function fetchPosts() {
    try {
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/content/posts`;
        const res = await fetch(url, { headers: { "Authorization": `token ${GITHUB_TOKEN}` } });
        if (!res.ok) throw new Error("Yazılar listelenemedi.");
        const files = await res.json();
        
        const listContainer = document.getElementById("post-list");
        listContainer.innerHTML = "";
        
        files.filter(f => f.name.endsWith(".md")).forEach(file => {
            const item = document.createElement("div");
            item.className = "post-list-item";
            item.innerHTML = `
                <span>${file.name}</span>
                <button onclick="confirmDelete('${file.path}', '${file.sha}')" class="btn-sm-danger">İMH ET</button>
            `;
            listContainer.appendChild(item);
        });
        log(`${files.length} yazı başarıyla listelendi.`);
    } catch (err) {
        log(`HATA: ${err.message}`);
    }
}

async function confirmDelete(path, sha) {
    if (confirm(`KRİTİK UYARI: ${path} dosyası kalıcı olarak silinecek. Emin misiniz?`)) {
        try {
            log(`İmha protokolü başlatıldı: ${path}`);
            const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
            const res = await fetch(url, {
                method: 'DELETE',
                headers: {
                    "Authorization": `token ${GITHUB_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: `System: Delete post ${path}`,
                    sha: sha
                })
            });
            
            if (!res.ok) throw new Error("Dosya silinemedi.");
            log(`BAŞARI: ${path} sistemden temizlendi.`);
            fetchPosts(); // Listeyi yenile
        } catch (err) {
            log(`HATA: ${err.message}`);
        }
    }
}

async function githubPut(path, contentBase64, message) {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
    
    // Önce dosya var mı kontrol et (varsa SHA lazım)
    let sha = "";
    try {
        const check = await fetch(url, { headers: { "Authorization": `token ${GITHUB_TOKEN}` } });
        if (check.ok) {
            const data = await check.json();
            sha = data.sha;
        }
    } catch (e) {}

    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            "Authorization": `token ${GITHUB_TOKEN}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message,
            content: contentBase64,
            sha: sha ? sha : undefined
        })
    });

    if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
    }
    return await res.json();
}
