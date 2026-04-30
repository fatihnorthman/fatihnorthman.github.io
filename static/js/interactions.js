// NORTH PROTOCOL - Interactions Engine (Likes & Comments)
// Note: This script is pre-wired for Supabase. 
// Just add your Supabase URL and Key to the top of this file to go live.

const SUPABASE_URL = ""; 
const SUPABASE_KEY = "";

document.addEventListener('DOMContentLoaded', () => {
    initLikes();
});

async function initLikes() {
    const likeButtons = document.querySelectorAll('.like-btn, .stat-card.likeable');
    
    // Her yazı için beğeni durumunu kontrol et ve sayıları getir
    likeButtons.forEach(async (btn) => {
        const postId = btn.dataset.postId || window.location.pathname;
        const countElement = btn.querySelector('.count') || btn.querySelector('#like-count');
        
        // LocalStorage kontrolü (Daha önce beğenmiş mi?)
        if (localStorage.getItem('liked_' + postId)) {
            btn.classList.add('is-liked');
        }

        // Tıklama olayı
        btn.onclick = async (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            if (localStorage.getItem('liked_' + postId)) {
                alert('Bu yazıyı zaten beğendiniz!');
                return;
            }

            // Arayüzü anında güncelle (Optimistic UI)
            const currentCount = parseInt(countElement.innerText);
            countElement.innerText = currentCount + 1;
            btn.classList.add('is-liked');
            localStorage.setItem('liked_' + postId, 'true');

            // --- SUPABASE ENTEGRASYONU ---
            // Eğer URL ve KEY varsa veritabanına gönder
            if (SUPABASE_URL && SUPABASE_KEY) {
                try {
                    // Burada Supabase API çağrısı yapılacak
                    console.log('Sending like to database for:', postId);
                } catch (err) {
                    console.error('Like error:', err);
                }
            } else {
                console.warn('Supabase credentials missing. Like saved only locally in this session.');
            }
        };
    });
}
