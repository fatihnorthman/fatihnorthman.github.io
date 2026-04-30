// NORTH PROTOCOL - Interactions Engine (Secured & Masked) - DEBUG VERSION
const _0x4a = ["xusjivptdjytbcobarxh", "supabase.co", "https://"];
const _0x9b = ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1c2ppdnB0ZGp5dGJjb2JhcnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NDQxNjIsImV4cCI6MjA5MzEyMDE2Mn0", "IRKtH_4VOkJeQYTxuTAhGXL1KPS0NsNEP70iTdyZ_B4"];

const SUPABASE_URL = `${_0x4a[2]}${_0x4a[0]}.${_0x4a[1]}`;
const SUPABASE_KEY = `${_0x9b[0]}.${_0x9b[1]}.${_0x9b[2]}`;

document.addEventListener('DOMContentLoaded', () => {
    console.log('Interactions Engine Started');
    initInteractions();
});

async function initInteractions() {
    const likeButtons = document.querySelectorAll('.like-btn, .stat-card.likeable');
    const commentForm = document.getElementById('comment-form');
    
    // Global sayıları çek
    fetchGlobalLikes();

    likeButtons.forEach(btn => {
        const postId = btn.dataset.postId || window.location.pathname;
        
        // Daha önce beğenmişse işaretle
        if (localStorage.getItem('liked_' + postId)) {
            btn.classList.add('is-liked');
        }

        btn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();

            if (localStorage.getItem('liked_' + postId)) {
                console.log('Already liked:', postId);
                return;
            }

            console.log('Liking post:', postId);
            
            // Görseli anında güncelle (Optimistic UI)
            const countElem = btn.querySelector('.count') || btn.querySelector('#like-count');
            const currentCount = parseInt(countElem.innerText) || 0;
            countElem.innerText = currentCount + 1;
            btn.classList.add('is-liked');
            localStorage.setItem('liked_' + postId, 'true');

            // DB'ye gönder
            try {
                await updateLikeInDB(postId);
            } catch (err) {
                console.error('Database update failed:', err);
            }
        };
    });

    if (document.getElementById('comments-list')) {
        fetchComments(window.location.pathname);
    }

    if (commentForm) {
        commentForm.onsubmit = async (e) => {
            e.preventDefault();
            const name = document.getElementById('comment-name').value;
            const content = document.getElementById('comment-text').value;
            const postId = window.location.pathname;

            try {
                await submitComment(postId, name, content);
                commentForm.reset();
                fetchComments(postId);
            } catch (err) {
                console.error('Comment submission failed:', err);
            }
        };
    }
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
    } catch (e) {
        console.error('Fetch likes error:', e);
    }
}

async function updateLikeInDB(postId) {
    // 1. Önce bu post_id var mı kontrol et
    const res = await fetch(`${SUPABASE_URL}/rest/v1/likes?post_id=eq.${postId}`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    
    if (data && data.length > 0) {
        // Mevcut olanı artır (PATCH)
        const updateRes = await fetch(`${SUPABASE_URL}/rest/v1/likes?post_id=eq.${postId}`, {
            method: 'PATCH',
            headers: { 
                "apikey": SUPABASE_KEY, 
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            body: JSON.stringify({ count: (data[0].count || 0) + 1 })
        });
        console.log('Update status:', updateRes.status);
    } else {
        // Yeni kayıt oluştur (POST)
        const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/likes`, {
            method: 'POST',
            headers: { 
                "apikey": SUPABASE_KEY, 
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json",
                "Prefer": "return=minimal"
            },
            body: JSON.stringify({ post_id: postId, count: 1 })
        });
        console.log('Insert status:', insertRes.status);
    }
}

async function fetchComments(postId) {
    try {
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
    } catch (e) {
        console.error('Fetch comments error:', e);
    }
}

async function submitComment(postId, name, content) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
        method: 'POST',
        headers: { 
            "apikey": SUPABASE_KEY, 
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
        },
        body: JSON.stringify({ post_id: postId, name, content })
    });
    console.log('Comment submit status:', res.status);
}
