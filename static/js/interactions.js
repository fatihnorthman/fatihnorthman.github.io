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
        const postId = btn.dataset.postId || window.location.pathname;
        if (localStorage.getItem('liked_' + postId)) btn.classList.add('is-liked');
        btn.onclick = async (e) => {
            e.preventDefault(); e.stopPropagation();
            if (localStorage.getItem('liked_' + postId)) return;
            const countElem = btn.querySelector('.count') || btn.querySelector('#like-count');
            countElem.innerText = (parseInt(countElem.innerText) || 0) + 1;
            btn.classList.add('is-liked');
            localStorage.setItem('liked_' + postId, 'true');
            await updateLikeInDB(postId);
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
        const response = await fetch(`${SUPABASE_URL}/rest/v1/likes`, {
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
        });
        const data = await response.json();
        if (data && Array.isArray(data)) {
            data.forEach(item => {
                const targets = document.querySelectorAll(`[data-post-id="${item.post_id}"] .count, [data-post-id="${item.post_id}"]#like-count`);
                targets.forEach(el => { el.innerText = item.count; });
            });
        }
    } catch (e) {}
}

async function updateLikeInDB(postId) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/likes?post_id=eq.${postId}`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    if (data.length > 0) {
        await fetch(`${SUPABASE_URL}/rest/v1/likes?post_id=eq.${postId}`, {
            method: 'PATCH',
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
            body: JSON.stringify({ count: (data[0].count || 0) + 1 })
        });
    } else {
        await fetch(`${SUPABASE_URL}/rest/v1/likes`, {
            method: 'POST',
            headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
            body: JSON.stringify({ post_id: postId, count: 1 })
        });
    }
}

async function fetchComments(postId) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/comments?post_id=eq.${postId}&order=created_at.desc`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
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
    await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
        method: 'POST',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
        body: JSON.stringify({ post_id: postId, name, content })
    });
}
