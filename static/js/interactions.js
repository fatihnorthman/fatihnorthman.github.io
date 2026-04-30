// NORTH PROTOCOL - Interactions Engine (Likes & Comments)
const SUPABASE_URL = ""; 
const SUPABASE_KEY = "";

document.addEventListener('DOMContentLoaded', () => {
    initLikes();
});

async function initLikes() {
    const likeButtons = document.querySelectorAll('.like-btn, .stat-card.likeable');
    
    likeButtons.forEach(async (btn) => {
        const postId = btn.dataset.postId || window.location.pathname;
        const countElement = btn.querySelector('.count') || btn.querySelector('#like-count');
        
        // --- GEÇİCİ YEREL GÖSTERİM ---
        // Eğer bu kullanıcı daha önce beğenmişse sayıyı +1 göster
        if (localStorage.getItem('liked_' + postId)) {
            btn.classList.add('is-liked');
            const currentCount = parseInt(countElement.innerText);
            countElement.innerText = currentCount + 1;
        }

        btn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (localStorage.getItem('liked_' + postId)) {
                console.log('Already liked locally.');
                return;
            }

            const currentCount = parseInt(countElement.innerText);
            countElement.innerText = currentCount + 1;
            btn.classList.add('is-liked');
            localStorage.setItem('liked_' + postId, 'true');

            if (SUPABASE_URL && SUPABASE_KEY) {
                // Real DB call would go here
            }
        };
    });
}
