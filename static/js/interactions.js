// NORTH PROTOCOL - Interactions Engine (Supabase Live)
const SUPABASE_URL = "https://xusjivptdjytbcobarxh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1c2ppdnB0ZGp5dGJjb2JhcnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NDQxNjIsImV4cCI6MjA5MzEyMDE2Mn0.IRKtH_4VOkJeQYTxuTAhGXL1KPS0NsNEP70iTdyZ_B4";

document.addEventListener('DOMContentLoaded', () => {
    initInteractions();
});

async function initInteractions() {
    const likeButtons = document.querySelectorAll('.like-btn, .stat-card.likeable');
    const commentForm = document.getElementById('comment-form');
    
    // 1. Mevcut beğeni sayılarını çek
    fetchGlobalLikes();

    // 2. Beğeni butonlarını aktifleştir
    likeButtons.forEach(btn => {
        const postId = btn.dataset.postId || window.location.pathname;
        if (localStorage.getItem('liked_' + postId)) btn.classList.add('is-liked');

        btn.onclick = async (e) => {
            e.preventDefault();
            if (localStorage.getItem('liked_' + postId)) return;

            // Görsel güncelleme
            const countElem = btn.querySelector('.count') || btn.querySelector('#like-count');
            countElem.innerText = parseInt(countElem.innerText) + 1;
            btn.classList.add('is-liked');
            localStorage.setItem('liked_' + postId, 'true');

            // DB güncelleme
            await updateLikeInDB(postId);
        };
    });

    // 3. Yorumları çek ve listele
    if (document.getElementById('comments-list')) {
        fetchComments(window.location.pathname);
    }

    // 4. Yorum gönderme formu
    if (commentForm) {
        commentForm.onsubmit = async (e) => {
            e.preventDefault();
            const name = document.getElementById('comment-name').value;
            const content = document.getElementById('comment-text').value;
            const postId = window.location.pathname;

            await submitComment(postId, name, content);
            commentForm.reset();
            fetchComments(postId); // Listeyi yenile
        };
    }
}

async function fetchGlobalLikes() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/likes`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const data = await response.json();
    data.forEach(item => {
        const targets = document.querySelectorAll(`[data-post-id="${item.post_id}"] .count, [data-post-id="${item.post_id}"]#like-count`);
        targets.forEach(el => {
            // Eğer kullanıcı kendi beğendiyse +1 yapılmış olabilir, DB'den geleni yaz
            el.innerText = item.count;
        });
    });
}

async function updateLikeInDB(postId) {
    // Önce mevcut sayıyı al
    const res = await fetch(`${SUPABASE_URL}/rest/v1/likes?post_id=eq.${postId}`, {
        headers: { "apikey": SUPABASE_KEY, "Authorization": `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    
    if (data.length > 0) {
        // Güncelle
        await fetch(`${SUPABASE_URL}/rest/v1/likes?post_id=eq.${postId}`, {
            method: 'PATCH',
            headers: { 
                "apikey": SUPABASE_KEY, 
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ count: data[0].count + 1 })
        });
    } else {
        // Yeni kayıt oluştur
        await fetch(`${SUPABASE_URL}/rest/v1/likes`, {
            method: 'POST',
            headers: { 
                "apikey": SUPABASE_KEY, 
                "Authorization": `Bearer ${SUPABASE_KEY}`,
                "Content-Type": "application/json"
            },
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
    if (data.length > 0) {
        list.innerHTML = data.map(c => `
            <div class="comment-card">
                <div class="comment-header">
                    <div class="comment-avatar">${c.name.substring(0,2).toUpperCase()}</div>
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
        headers: { 
            "apikey": SUPABASE_KEY, 
            "Authorization": `Bearer ${SUPABASE_KEY}`,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ post_id: postId, name, content })
    });
}
