// NORTH PROTOCOL - Interactions Engine (Full Suite)
const _0x4a = ["xusjivptdjytbcobarxh", "supabase.co", "https://"];
const _0x9b = ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1c2ppdnB0ZGp5dGJjb2JhcnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NDQxNjIsImV4cCI6MjA5MzEyMDE2Mn0", "IRKtH_4VOkJeQYTxuTAhGXL1KPS0NsNEP70iTdyZ_B4"];

const SUPABASE_URL = `${_0x4a[2]}${_0x4a[0]}.${_0x4a[1]}`;
const SUPABASE_KEY = `${_0x9b[0]}.${_0x9b[1]}.${_0x9b[2]}`;

function startEngine() {
    initInteractions();
    initScrollReveal();
    init3DTilt();
    initClickRipple();
    initCustomCursor();
    initMouseTrail();
}

function initMouseTrail() {
    // Mobil/Dokunmatik cihazlarda iptal et
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const canvas = document.getElementById('trail-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let points = [];
    let isDrawing = false;

    const resize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    document.addEventListener('mousemove', (e) => {
        points.push({ x: e.clientX, y: e.clientY, age: 0 });
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let i = 1; i < points.length; i++) {
            const p1 = points[i - 1];
            const p2 = points[i];
            p1.age += 1;

            // Fade efekti: Yaşlandıkça şeffaflaş ve incel
            const opacity = Math.max(0, 1 - p1.age / 15);
            ctx.beginPath();
            ctx.strokeStyle = `rgba(255, 193, 7, ${opacity})`; // Cyber Yellow
            ctx.lineWidth = 4 * opacity; // Arkaya doğru incelen çizgi
            ctx.lineJoin = 'round';
            ctx.lineCap = 'round';
            ctx.shadowBlur = 10 * opacity;
            ctx.shadowColor = '#ffc107';
            
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();

            if (p1.age > 15) { // Çok daha hızlı yok olma
                points.splice(i - 1, 1);
                i--;
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}




function initCustomCursor() {
    const cursor = document.querySelector('.custom-cursor');
    if (!cursor) return;

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%, -50%) scale(0.8)');
    document.addEventListener('mouseup', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');

    const interactiveElements = document.querySelectorAll('a, button, .likeable, .stat-card, input, textarea');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });
}


if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startEngine);
} else {
    startEngine();
}

// --- CLICK RIPPLE ENGINE ---
function initClickRipple() {
    window.addEventListener('mousedown', (e) => {
        const ripple = document.createElement('div');
        ripple.className = 'click-ripple';
        ripple.style.left = `${e.clientX}px`;
        ripple.style.top = `${e.clientY}px`;
        document.body.appendChild(ripple);
        
        // Animasyon bitince temizle
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
}

// --- 3D TILT ENGINE ---
function init3DTilt() {
    // Mobilde/Dokunmatikte 3D Tilt'i kapat (etkileşimi bozmaması için)
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) return;

    const containers = document.querySelectorAll('.post.on-list');
    containers.forEach(container => {
        const card = container.querySelector('.post-card-inner');
        if (!card) return;
        container.addEventListener('mousemove', (e) => {
            // Eğer fare bir butonun veya linkin üzerindeyse kartı sabitle
            if (e.target.closest('button') || e.target.closest('a') || e.target.closest('.stat-card')) {
                card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1.02)`;
                return;
            }

            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 300; 
            const rotateY = (centerX - x) / 300;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.002)`;
        });
        container.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)`;
        });
    });
}

async function initInteractions() {
    const likeButtons = document.querySelectorAll('.like-btn, .stat-card.likeable');
    const commentForm = document.getElementById('comment-form');
    fetchGlobalLikes();
    likeButtons.forEach(btn => {
        const rawId = btn.dataset.postId || window.location.pathname;
        const cleanId = decodeURIComponent(rawId).replace(/\/$/, ""); 
        
        if (localStorage.getItem('liked_' + cleanId)) {
            btn.classList.add('is-liked');
            if (btn.classList.contains('interaction-btn')) btn.classList.add('liked');
        }
        btn.onclick = async (e) => {
            e.preventDefault(); e.stopPropagation();
            if (localStorage.getItem('liked_' + cleanId)) return;
            
            const countElem = btn.querySelector('.count') || btn.querySelector('#like-count');
            if (countElem) {
                countElem.innerText = (parseInt(countElem.innerText) || 0) + 1;
            }
            btn.classList.add('is-liked');
            if (btn.classList.contains('interaction-btn')) btn.classList.add('liked');
            
            localStorage.setItem('liked_' + cleanId, 'true');
            await updateLikeInDB(rawId); // Veritabanına orjinal (encoded) ID'yi gönder
        };
    });
    if (document.getElementById('comments-list')) fetchComments(window.location.pathname);
    if (commentForm) {
        commentForm.onsubmit = async (e) => {
            e.preventDefault();
            const honeypot = document.getElementById('comment-honeypot').value;
            if (honeypot) return; // Bot detected

            const name = document.getElementById('comment-name').value;
            const content = document.getElementById('comment-text').value;
            const postId = window.location.pathname;
            await submitComment(postId, name, content);
            commentForm.reset(); fetchComments(postId);
        };
    }
}

function initScrollReveal() {
    const posts = document.querySelectorAll('.post.on-list');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
            } else {
                entry.target.classList.remove('reveal-visible');
            }
        });
    }, { threshold: 0.01, rootMargin: '0px 0px 100px 0px' });
    posts.forEach(post => observer.observe(post));
}

async function fetchGlobalLikes() {
    try {
        // Parametre çakışmasını önlemek için select=* yanına cache buster ekliyoruz
        const response = await fetch(`${_SUPABASE_URL()}/rest/v1/likes?select=*&_cache=${Date.now()}`, {
            headers: { 
                "apikey": _SUPABASE_KEY(), 
                "Authorization": `Bearer ${_SUPABASE_KEY()}`,
                "Cache-Control": "no-cache",
                "Pragma": "no-cache"
            }
        });
        const data = await response.json();
        
        // Önce tüm beğenileri normalize, decode ve temizlenmiş ID'lere göre toplayalım
        const consolidatedLikes = {};
        if (data && Array.isArray(data)) {
            data.forEach(item => {
                // Boş parçaları filtreleyerek en sondaki dolu parçayı (yazı ismini) al
                const parts = decodeURIComponent(item.post_id).toLowerCase().split('/').filter(p => p);
                const normalizedId = parts.length > 0 ? parts.pop() : "home";
                consolidatedLikes[normalizedId] = (consolidatedLikes[normalizedId] || 0) + (parseInt(item.count) || 0);
            });

            const currentParts = decodeURIComponent(window.location.pathname).toLowerCase().split('/').filter(p => p);
            const currentPathClean = currentParts.length > 0 ? currentParts.pop() : "home";

            // Şimdi sayfadaki tüm butonları tara ve eşleşenleri güncelle
            const allPotential = document.querySelectorAll('.like-btn, .stat-card, #like-count, .count, [data-post-id]');
            allPotential.forEach(el => {
                let elRawId = el.dataset.postId || (el.id === 'like-count' ? window.location.pathname : "");
                if (!elRawId) return;
                
                const elDecoded = decodeURIComponent(elRawId).toLowerCase();
                const elSlug = elDecoded.split('/').filter(p => p).pop() || "home";
                
                // Hem tam linke hem de sadece isme (slug) bak
                const totalCount = consolidatedLikes[elSlug] || consolidatedLikes[elDecoded];
                
                if (totalCount !== undefined) {
                    const countSpan = el.classList.contains('count') ? el : (el.querySelector('.count') || (el.id === 'like-count' ? el : null));
                    if (countSpan) {
                        countSpan.innerText = totalCount;
                    }
                }
            });
        }
    } catch (e) { console.error("Like fetch error:", e); }
}

// Yardımcı fonksiyonlar (şifreli keyleri korumak için)
function _SUPABASE_URL() { return `${_0x4a[2]}${_0x4a[0]}.${_0x4a[1]}`; }
function _SUPABASE_KEY() { return `${_0x9b[0]}.${_0x9b[1]}.${_0x9b[2]}`; }

async function updateLikeInDB(rawPostId) {
    const rawParts = decodeURIComponent(rawPostId).toLowerCase().split('/').filter(p => p);
    const cleanIdForQuery = rawParts.length > 0 ? rawParts.pop() : "home";
    const standardId = rawPostId.replace(/\/$/, "");
    
    try {
        const headers = { 
            "apikey": _SUPABASE_KEY(), 
            "Authorization": `Bearer ${_SUPABASE_KEY()}`,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates",
            "Cache-Control": "no-cache"
        };
        
        // Önce veritabanındaki TÜM kayıtları çekip bu yazıya ait olanları toplayalım
        const getRes = await fetch(`${_SUPABASE_URL()}/rest/v1/likes`, {
            headers: { "apikey": _SUPABASE_KEY(), "Authorization": `Bearer ${_SUPABASE_KEY()}`, "Cache-Control": "no-cache" }
        });
        const data = await getRes.json();
        let currentTotal = 0;
        if (data && Array.isArray(data)) {
            data.forEach(item => {
                if (decodeURIComponent(item.post_id).replace(/\/$/, "") === cleanIdForQuery) {
                    currentTotal += (parseInt(item.count) || 0);
                }
            });
        }
        const newCount = currentTotal + 1;

        // On Conflict Do Update: Hugo'nun standart ID'si üzerine yaz
        const res = await fetch(`${_SUPABASE_URL()}/rest/v1/likes?on_conflict=post_id`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ post_id: standardId, count: newCount })
        });

        if (res.ok) {
            console.log("DB Persistence Success! Combined Count:", newCount);
            // Mobilde geri bildirim için butonu parlat
            const btn = document.querySelector(`[data-post-id="${rawPostId}"], #like-button`);
            if (btn) {
                btn.style.boxShadow = "0 0 30px var(--accent)";
                setTimeout(() => { btn.style.boxShadow = ""; }, 1000);
            }
            setTimeout(fetchGlobalLikes, 1500); 
        } else {
            console.error("DB Update Failed:", res.status);
        }
    } catch (e) {
        console.error("Critical Like Sync Error:", e);
    }
}

async function fetchComments(postId) {
    const res = await fetch(`${_SUPABASE_URL()}/rest/v1/comments?post_id=eq.${postId}&order=created_at.desc`, {
        headers: { "apikey": _SUPABASE_KEY(), "Authorization": `Bearer ${_SUPABASE_KEY()}` }
    });
    const data = await res.json();
    const list = document.getElementById('comments-list');
    if (data && Array.isArray(data) && data.length > 0) {
        list.innerHTML = data.map(c => {
            const safeName = escapeHTML(c.name);
            const safeContent = escapeHTML(c.content);
            const initials = safeName.substring(0,2).toUpperCase();
            const safeDate = new Date(c.created_at).toLocaleDateString('tr-TR');
            
            return `
                <div class="comment-card">
                    <div class="comment-header">
                        <div class="comment-avatar">${initials}</div>
                        <div class="comment-info">
                            <span class="comment-author">${safeName}</span>
                            <span class="comment-date">${safeDate}</span>
                        </div>
                    </div>
                    <div class="comment-body">${safeContent}</div>
                </div>
            `;
        }).join('');
    }
}

function escapeHTML(str) {
    const p = document.createElement('p');
    p.textContent = str;
    return p.innerHTML;
}


async function submitComment(postId, name, content) {
    await fetch(`${_SUPABASE_URL()}/rest/v1/comments`, {
        method: 'POST',
        headers: { "apikey": _SUPABASE_KEY(), "Authorization": `Bearer ${_SUPABASE_KEY()}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
        body: JSON.stringify({ post_id: postId, name, content })
    });
}
