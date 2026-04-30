// NORTH PROTOCOL - Interactions Engine (Final Stable Version + 3D Tilt)
const _0x4a = ["xusjivptdjytbcobarxh", "supabase.co", "https://"];
const _0x9b = ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1c2ppdnB0ZGp5dGJjb2JhcnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NDQxNjIsImV4cCI6MjA5MzEyMDE2Mn0", "IRKtH_4VOkJeQYTxuTAhGXL1KPS0NsNEP70iTdyZ_B4"];

const SUPABASE_URL = `${_0x4a[2]}${_0x4a[0]}.${_0x4a[1]}`;
const SUPABASE_KEY = `${_0x9b[0]}.${_0x9b[1]}.${_0x9b[2]}`;

function startEngine() {
    initInteractions();
    initScrollReveal();
    init3DTilt();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startEngine);
} else {
    startEngine();
}

// --- 3D TILT ENGINE ---
function init3DTilt() {
    const containers = document.querySelectorAll('.post.on-list');
    
    containers.forEach(container => {
        const card = container.querySelector('.post-card-inner');
        if (!card) return;

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            // Böleni 30'dan 60'a çıkararak hareketi iyice yumuşattım
            const rotateX = (y - centerY) / 60; 
            const rotateY = (centerX - x) / 60;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.01)`;
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
        list.innerHTML = data.map(c => `
            <div class="comment-card">
                <div class="comment-header">
                    <div class="comment-avatar">${(c.name || 'AN').substring(0,2).toUpperCase()}</div>
                    <div class="comment-info">
                        <span class="comment-author">${c.name}</span>
                        <span class="comment-date">${new Date(c.created_at).toLocaleDateString('tr-TR')}</span>
                    </div>
                </div>
                <div class="comment-body">${c.content}</div>
            </div>
        `).join('');
    }
}

async function submitComment(postId, name, content) {
    await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
        method: 'POST',
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", "Prefer": "return=minimal" },
        body: JSON.stringify({ post_id: postId, name, content })
    });
}
