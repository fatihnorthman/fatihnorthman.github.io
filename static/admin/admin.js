const REPO_OWNER = "fatihnorthman";
const REPO_NAME = "fatihnorthman.github.io";
let GITHUB_TOKEN = sessionStorage.getItem("gh_token") || "";
let INACTIVITY_TIMER;

// EDIT MODE STATE
let IS_EDIT_MODE = false;
let EDIT_SHA = "";
let EDIT_PATH = "";

// Inactivity Timeout (15 Dakika)
function resetInactivityTimer() {
    clearTimeout(INACTIVITY_TIMER);
    INACTIVITY_TIMER = setTimeout(() => {
        log("Hareketsizlik nedeniyle oturum kapatıldı.");
        logout();
    }, 15 * 60 * 1000);
}

window.onload = resetInactivityTimer;
window.onmousemove = resetInactivityTimer;
window.onkeypress = resetInactivityTimer;

window.onerror = function(msg, url, line) {
    log(`KRİTİK SİSTEM HATASI: ${msg} (Satır: ${line})`);
    return false;
};

if (GITHUB_TOKEN) {
    document.getElementById("login-overlay").style.display = "none";
    document.getElementById("status").innerText = "SİSTEM ÇEVRİMİÇİ";
    document.getElementById("status").classList.add("online");
    log("Sistem otomatik olarak yetkilendirildi. Veriler çekiliyor...");
    setTimeout(() => {
        fetchPosts();
        updatePreview();
    }, 500); 
}

function log(msg) {
    const consoleLogs = document.getElementById("console-logs");
    if (!consoleLogs) return;
    const time = new Date().toLocaleTimeString();
    const div = document.createElement("div");
    div.textContent = `> [${time}] ${msg}`;
    consoleLogs.appendChild(div);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
}

function authAdmin() {
    log("Yetkilendirme tetiklendi...");
    const token = document.getElementById("gh-token").value.trim();
    if (token) {
        GITHUB_TOKEN = token;
        sessionStorage.setItem("gh_token", token);
        document.getElementById("login-overlay").style.display = "none";
        document.getElementById("status").innerText = "SİSTEM ÇEVRİMÇİ";
        document.getElementById("status").classList.add("online");
        log("Anahtar kaydedildi. Yazı listesi isteniyor...");
        fetchPosts(); 
    } else {
        log("HATA: Anahtar boş olamaz!");
    }
}

function toggleToken() {
    const input = document.getElementById("gh-token");
    input.type = input.type === "password" ? "text" : "password";
}

function logout() {
    sessionStorage.removeItem("gh_token");
    location.reload();
}

function updatePreview() {
    const content = document.getElementById("post-content").value;
    const previewArea = document.getElementById("preview-area");
    if (typeof marked !== 'undefined') {
        previewArea.innerHTML = marked.parse(content);
    } else {
        previewArea.textContent = content;
    }
}

document.getElementById("post-image").onchange = function(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const preview = document.getElementById("image-preview");
            preview.style.display = "block";
            preview.innerHTML = ""; 
            const img = document.createElement("img");
            img.src = event.target.result;
            preview.appendChild(img);
            log(`Görsel hazır: ${file.name}`);
        };
        reader.readAsDataURL(file);
    }
};

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

let ALL_POSTS = []; 

async function fetchPosts() {
    try {
        log("Yazı listesi talep ediliyor...");
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/content/posts`;
        const res = await fetch(url, { 
            headers: { 
                "Authorization": `Bearer ${GITHUB_TOKEN}`,
                "Accept": "application/vnd.github.v3+json"
            } 
        });
        
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(`API Hatası (${res.status}): ${errorData.message}`);
        }
        
        const files = await res.json();
        ALL_POSTS = files.filter(f => f.name.endsWith(".md") && f.name !== "_index.md");
        renderPostList(ALL_POSTS);
        log(`BAŞARI: ${ALL_POSTS.length} yazı yüklendi.`);
    } catch (err) {
        log(`KRİTİK HATA: ${err.message}`);
        document.getElementById("post-list").innerText = `Hata: ${err.message}`;
    }
}

function renderPostList(posts) {
    const listContainer = document.getElementById("post-list");
    listContainer.innerHTML = "";
    
    if (posts.length === 0) {
        listContainer.innerText = 'Yazı bulunamadı.';
        return;
    }

    posts.forEach(file => {
        const displayName = file.name.replace(".md", "");
        const item = document.createElement("div");
        item.className = "post-list-item";
        
        const nameDiv = document.createElement("div");
        nameDiv.className = "post-name";
        nameDiv.textContent = displayName;
        nameDiv.title = file.name;
        
        const actionsDiv = document.createElement("div");
        actionsDiv.className = "post-item-actions";

        const editBtn = document.createElement("button");
        editBtn.className = "btn-sm-edit";
        editBtn.textContent = "EDİTLE";
        editBtn.onclick = () => loadPostForEdit(file.path, file.sha);

        const delBtn = document.createElement("button");
        delBtn.className = "btn-sm-danger";
        delBtn.textContent = "İMH ET";
        delBtn.onclick = () => confirmDelete(file.path, file.sha);

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(delBtn);
        item.appendChild(nameDiv);
        item.appendChild(actionsDiv);
        listContainer.appendChild(item);
    });
}

function filterPosts() {
    const query = document.getElementById("post-search").value.toLowerCase();
    const filtered = ALL_POSTS.filter(p => p.name.toLowerCase().includes(query));
    renderPostList(filtered);
}

// --- EDIT LOGIC ---
async function loadPostForEdit(path, sha) {
    try {
        log(`Yazı yükleniyor: ${path}`);
        const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
        const res = await fetch(url, {
            headers: { "Authorization": `Bearer ${GITHUB_TOKEN}` }
        });
        const data = await res.json();
        const content = decodeURIComponent(escape(atob(data.content)));

        // YAML Parsing (Regex)
        const parts = content.split('---');
        if (parts.length < 3) throw new Error("Dosya formatı uyumsuz (Front-matter bulunamadı).");

        const yaml = parts[1];
        const body = parts.slice(2).join('---').trim();

        const getValue = (key) => {
            const regex = new RegExp(`${key}:\\s*["']?(.*?)["']?\\s*(\\n|$)`, 'i');
            const match = yaml.match(regex);
            return match ? match[1].trim() : "";
        };

        const getTags = () => {
            const match = yaml.match(/tags:\s*\[(.*?)\]/i);
            return match ? match[1].replace(/"/g, '').trim() : "";
        };

        // Fill Form
        document.getElementById("post-title").value = getValue("title");
        document.getElementById("post-category").value = getValue("categories").replace(/[\[\]"]/g, "") || "Genel";
        document.getElementById("post-weight").value = getValue("weight");
        document.getElementById("post-tags").value = getTags();
        document.getElementById("post-desc").value = getValue("description");
        document.getElementById("post-content").value = body;

        // Mode UI Update
        IS_EDIT_MODE = true;
        EDIT_SHA = sha;
        EDIT_PATH = path;
        
        document.body.classList.add("edit-mode-active");
        const publishBtn = document.getElementById("publish-btn");
        publishBtn.innerText = "DEĞİŞİKLİKLERİ KAYDET";
        
        // Add Cancel Button if not exists
        if (!document.getElementById("cancel-edit-btn")) {
            const cancelBtn = document.createElement("button");
            cancelBtn.id = "cancel-edit-btn";
            cancelBtn.className = "btn-secondary";
            cancelBtn.innerText = "İPTAL";
            cancelBtn.style.marginTop = "10px";
            cancelBtn.onclick = cancelEdit;
            publishBtn.parentNode.appendChild(cancelBtn);
        }

        updatePreview();
        log("Yazı düzenleme modunda yüklendi.");
        window.scrollTo({ top: 0, behavior: 'smooth' });

    } catch (err) {
        log(`Yükleme Hatası: ${err.message}`);
    }
}

function cancelEdit() {
    IS_EDIT_MODE = false;
    EDIT_SHA = "";
    EDIT_PATH = "";
    document.body.classList.remove("edit-mode-active");
    document.getElementById("publish-btn").innerText = "PROTOKOLÜ YAYINLA";
    const cancelBtn = document.getElementById("cancel-edit-btn");
    if (cancelBtn) cancelBtn.remove();
    
    // Clear Form
    document.getElementById("post-title").value = "";
    document.getElementById("post-tags").value = "";
    document.getElementById("post-weight").value = "";
    document.getElementById("post-desc").value = "";
    document.getElementById("post-content").value = "";
    document.getElementById("image-preview").innerHTML = "";
    document.getElementById("post-image").value = "";
    updatePreview();
    log("Düzenleme iptal edildi.");
}

async function confirmDelete(path, sha) {
    if (confirm(`KRİTİK UYARI: ${path} dosyası kalıcı olarak silinecek. Emin misiniz?`)) {
        try {
            log(`İmha protokolü başlatıldı: ${path}`);
            const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
            const res = await fetch(url, {
                method: 'DELETE',
                headers: {
                    "Authorization": `Bearer ${GITHUB_TOKEN}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: `System: Delete post ${path}`,
                    sha: sha
                })
            });
            
            if (!res.ok) throw new Error("Dosya silinemedi.");
            log(`BAŞARI: ${path} sistemden temizlendi.`);
            fetchPosts(); 
        } catch (err) {
            log(`HATA: ${err.message}`);
        }
    }
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
    btn.innerText = IS_EDIT_MODE ? "GÜNCELLEME İŞLENİYOR..." : "YAYINLANIYOR...";

    const slug = slugify(title);
    const date = new Date().toISOString().split('.')[0] + "+03:00"; 
    const fileName = IS_EDIT_MODE ? EDIT_PATH.split('/').pop() : `${slug}.md`;
    let imagePath = "";

    try {
        if (imageFile) {
            log("Yeni görsel yükleniyor...");
            const reader = new FileReader();
            const base64Img = await new Promise((resolve) => {
                reader.onload = () => resolve(reader.result.split(',')[1]);
                reader.readAsDataURL(imageFile);
            });
            
            const imgFileName = `${Date.now()}-${slugify(imageFile.name.split('.')[0])}.${imageFile.name.split('.').pop()}`;
            await githubPut(`assets/images/${imgFileName}`, base64Img, `Upload image: ${imgFileName}`);
            imagePath = `/images/${imgFileName}`;
        }

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

        log(IS_EDIT_MODE ? "Dosya güncelleniyor..." : "Markdown dosyası oluşturuluyor...");
        const utf8Bytes = new TextEncoder().encode(frontMatter);
        const base64MD = btoa(String.fromCharCode(...utf8Bytes));
        
        const targetPath = IS_EDIT_MODE ? EDIT_PATH : `content/posts/${fileName}`;
        await githubPut(targetPath, base64MD, IS_EDIT_MODE ? `Update post: ${title}` : `Post: ${title}`, IS_EDIT_MODE ? EDIT_SHA : "");
        
        log(IS_EDIT_MODE ? "BAŞARI: Güncelleme tamamlandı!" : "BAŞARI: Protokol yayına alındı!");
        alert(IS_EDIT_MODE ? "Yazı başarıyla güncellendi!" : "Yazı başarıyla paylaşıldı!");
        location.reload();

    } catch (err) {
        log(`KRİTİK HATA: ${err.message}`);
    } finally {
        btn.disabled = false;
        btn.innerText = "PROTOKOLÜ YAYINLA";
    }
}

async function githubPut(path, contentBase64, message, forceSha = "") {
    const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${path}`;
    let sha = forceSha;

    if (!sha) {
        try {
            const check = await fetch(url, { 
                headers: { "Authorization": `Bearer ${GITHUB_TOKEN}` } 
            });
            if (check.ok) {
                const data = await check.json();
                sha = data.sha;
            }
        } catch (e) {}
    }

    const res = await fetch(url, {
        method: 'PUT',
        headers: {
            "Authorization": `Bearer ${GITHUB_TOKEN}`,
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
        throw new Error(error.message || `HTTP ${res.status}`);
    }
    return await res.json();
}
