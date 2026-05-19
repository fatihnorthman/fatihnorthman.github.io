const REPO_OWNER = "fatihnorthman";
const REPO_NAME = "fatihnorthman.github.io";
let GITHUB_TOKEN = "";
let INACTIVITY_TIMER;

// Brute-force koruma
const MAX_ATTEMPTS = 5;
const LOCKOUT_MS = 5 * 60 * 1000; // 5 dakika
let failedAttempts = parseInt(sessionStorage.getItem("gh_fail_count") || "0");
let lockoutUntil = parseInt(sessionStorage.getItem("gh_lockout_until") || "0");

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

// Sayfa yüklendiğinde kayıtlı token varsa GitHub ile doğrula
(async function initAuth() {
    const savedToken = sessionStorage.getItem("gh_token");
    if (savedToken) {
        log("Kayıtlı oturum bulundu, doğrulanıyor...");
        const valid = await verifyToken(savedToken);
        if (valid) {
            GITHUB_TOKEN = savedToken;
            document.getElementById("login-overlay").style.display = "none";
            document.getElementById("status").innerText = "SİSTEM ÇEVRİMİÇİ";
            document.getElementById("status").classList.add("online");
            log("Oturum doğrulandı. Veriler çekiliyor...");
            fetchPosts();
            updatePreview();
        } else {
            sessionStorage.removeItem("gh_token");
            log("Kaydedilmiş token geçersiz, lütfen tekrar giriş yapın.");
        }
    }
})();

function log(msg) {
    const consoleLogs = document.getElementById("console-logs");
    if (!consoleLogs) return;
    const time = new Date().toLocaleTimeString();
    const div = document.createElement("div");
    div.textContent = `> [${time}] ${msg}`;
    consoleLogs.appendChild(div);
    consoleLogs.scrollTop = consoleLogs.scrollHeight;
}

// GitHub API üzerinden token doğrulama
async function verifyToken(token) {
    try {
        const res = await fetch("https://api.github.com/user", {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Accept": "application/vnd.github.v3+json"
            }
        });
        if (!res.ok) return false;
        const data = await res.json();
        // Sadece repo sahibi giriş yapabilsin
        return data.login && data.login.toLowerCase() === REPO_OWNER.toLowerCase();
    } catch {
        return false;
    }
}

async function authAdmin() {
    // Kilit kontrolü
    const now = Date.now();
    if (lockoutUntil > now) {
        const remaining = Math.ceil((lockoutUntil - now) / 1000);
        log(`HATA: Çok fazla başarısız deneme. ${remaining} saniye sonra tekrar deneyin.`);
        showLoginError(`Hesap kilitli. ${Math.ceil(remaining / 60)} dakika bekleyin.`);
        return;
    }

    const token = document.getElementById("gh-token").value.trim();
    if (!token) {
        log("HATA: Token boş olamaz!");
        showLoginError("Lütfen GitHub Access Token girin.");
        return;
    }

    const btn = document.querySelector(".login-box .btn-primary");
    btn.disabled = true;
    btn.textContent = "DOĞRULANIYYOR...";
    log("Token GitHub API ile doğrulanıyor...");

    const valid = await verifyToken(token);

    if (valid) {
        // Başarılı giriş — sayacı sıfırla
        failedAttempts = 0;
        sessionStorage.removeItem("gh_fail_count");
        sessionStorage.removeItem("gh_lockout_until");

        GITHUB_TOKEN = token;
        sessionStorage.setItem("gh_token", token);
        document.getElementById("login-overlay").style.display = "none";
        document.getElementById("status").innerText = "SİSTEM ÇEVRİMİÇİ";
        document.getElementById("status").classList.add("online");
        log("Kimlik doğrulandı. Yazı listesi isteniyor...");
        fetchPosts();
    } else {
        // Başarısız giriş
        failedAttempts++;
        sessionStorage.setItem("gh_fail_count", failedAttempts);

        if (failedAttempts >= MAX_ATTEMPTS) {
            const until = Date.now() + LOCKOUT_MS;
            lockoutUntil = until;
            sessionStorage.setItem("gh_lockout_until", until);
            log(`GÜVENLİK: ${MAX_ATTEMPTS} hatalı deneme. Hesap 5 dakika kilitlendi.`);
            showLoginError(`${MAX_ATTEMPTS} hatalı deneme! 5 dakika kilitlendi.`);
        } else {
            const left = MAX_ATTEMPTS - failedAttempts;
            log(`KİMLİK DOĞRULAMA HATASI: Geçersiz token veya yetkisiz kullanıcı. (${left} hak kaldı)`);
            showLoginError(`Geçersiz token veya bu repo'ya erişim yetkiniz yok. (${left} deneme hakkı)`);
        }

        document.getElementById("gh-token").value = "";
    }

    btn.disabled = false;
    btn.textContent = "SİSTEME BAĞLAN";
}

function showLoginError(msg) {
    let errEl = document.getElementById("login-error");
    if (!errEl) {
        errEl = document.createElement("p");
        errEl.id = "login-error";
        errEl.style.cssText = "color:#ff4444;font-size:0.82rem;margin-top:10px;text-align:center;font-family:'Fira Code',monospace;";
        document.querySelector(".login-box .login-actions").insertAdjacentElement("afterend", errEl);
    }
    errEl.textContent = "⚠ " + msg;
}

function toggleToken() {
    const input = document.getElementById("gh-token");
    if (input.type === "password") {
        log("UYARI: Token ekranda görüntüleniyor. Ortamınızın güvenli olduğundan emin olun.");
    }
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
        // marked.js tam GFM yapılandırması
        marked.setOptions({
            gfm: true,
            breaks: true,
            pedantic: false,
            smartypants: true,
            highlight: function(code, lang) {
                if (typeof hljs !== 'undefined' && lang && hljs.getLanguage(lang)) {
                    try {
                        return hljs.highlight(code, { language: lang }).value;
                    } catch (e) {}
                }
                if (typeof hljs !== 'undefined') {
                    try {
                        return hljs.highlightAuto(code).value;
                    } catch (e) {}
                }
                return code;
            }
        });

        let html = marked.parse(content);

        // Görev listesi (task list) desteği: - [ ] ve - [x]
        html = html.replace(/<li>\s*\[ \]/g, '<li class="task-item"><input type="checkbox" disabled> ');
        html = html.replace(/<li>\s*\[x\]/gi, '<li class="task-item task-done"><input type="checkbox" checked disabled> ');

        if (typeof DOMPurify !== 'undefined') {
            html = DOMPurify.sanitize(html);
        }
        previewArea.innerHTML = html;

        // Highlight.js tarafından yakalanamayan blokları da işle
        if (typeof hljs !== 'undefined') {
            previewArea.querySelectorAll('pre code:not(.hljs)').forEach(block => {
                hljs.highlightElement(block);
            });
        }
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

function escapeYaml(value) {
    if (typeof value !== 'string') return value;
    return value.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
}

function slugify(text) {
    const trMap = {
        'ç': 'c', 'Ç': 'c',
        'ğ': 'g', 'Ğ': 'g',
        'ı': 'i', 'İ': 'i',
        'ö': 'o', 'Ö': 'o',
        'ş': 's', 'Ş': 's',
        'ü': 'u', 'Ü': 'u',
        ' ': '-'
    };
    let result = '';
    for (let char of text) {
        result += trMap[char] !== undefined ? trMap[char] : char;
    }
    return result.toLowerCase()
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
        // Türkçe karakter desteği için TextDecoder kullan
        const bytes = Uint8Array.from(atob(data.content.replace(/\n/g, '')), c => c.charCodeAt(0));
        const content = new TextDecoder('utf-8').decode(bytes);

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
        
        // Orijinal tarihi sakla (edit modunda korunacak)
        let originalDateInput = document.getElementById('original-date');
        if (!originalDateInput) {
            originalDateInput = document.createElement('input');
            originalDateInput.type = 'hidden';
            originalDateInput.id = 'original-date';
            document.body.appendChild(originalDateInput);
        }
        originalDateInput.value = getValue("date") || new Date().toISOString().split('.')[0] + "+03:00";

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
            
            const ext = imageFile.name.split('.').pop().toLowerCase();
            const allowedExts = ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'];
            if (!allowedExts.includes(ext)) {
                throw new Error(`Geçersiz görsel formatı: .${ext}`);
            }
            const baseName = imageFile.name.replace(/\.[^/.]+$/, '');
            const imgFileName = `${Date.now()}-${slugify(baseName)}.${ext}`;
            await githubPut(`assets/images/${imgFileName}`, base64Img, `Upload image: ${imgFileName}`);
            imagePath = `/images/${imgFileName}`;
        }

        const tagsArr = tagsRaw.split(',').map(t => `"${escapeYaml(t.trim())}"`).join(', ');
        const nowDate = new Date();
        const isoNow = nowDate.toISOString().split('.')[0] + "+03:00";
        
        // Edit modunda orijinal date'i koru, lastmod'u güncelle
        const originalDate = IS_EDIT_MODE ? (document.getElementById('original-date')?.value || isoNow) : isoNow;
        
        const frontMatter = `---
title: "${escapeYaml(title)}"
date: ${originalDate}
lastmod: ${isoNow}
draft: false
tags: [${tagsArr}]
categories: ["${escapeYaml(category)}"]
author: "Fatih Northman"
description: "${escapeYaml(desc)}"
slug: "${slug}"
readingTime: true
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
