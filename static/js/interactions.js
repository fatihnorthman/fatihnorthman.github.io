// NORTH PROTOCOL - Interactions Engine (Full Suite)
const _0x4a = ["xusjivptdjytbcobarxh", "supabase.co", "https://"];
const _0x9b = ["eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9", "eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inh1c2ppdnB0ZGp5dGJjb2JhcnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1NDQxNjIsImV4cCI6MjA5MzEyMDE2Mn0", "IRKtH_4VOkJeQYTxuTAhGXL1KPS0NsNEP70iTdyZ_B4"];

const SUPABASE_URL = `${_0x4a[2]}${_0x4a[0]}.${_0x4a[1]}`;
const SUPABASE_KEY = `${_0x9b[0]}.${_0x9b[1]}.${_0x9b[2]}`;

function startEngine() {
    const inits = [
        initInteractions, initScrollReveal, init3DTilt, 
        initClickRipple, initCustomCursor, initMouseTrail, 
        initProgressBar, initPDF
    ];
    
    inits.forEach(fn => {
        try { fn(); } catch (e) { console.error(`Init failed: ${fn.name}`, e); }
    });
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

// --- PROFESSIONAL PDF GENERATION ---
function initPDF() {
    const btn = document.getElementById('download-pdf');
    if (!btn) return;

    btn.onclick = async () => {
        console.log("PDF Generation Triggered...");
        
        if (typeof html2pdf === 'undefined') {
            alert('PDF motoru henüz hazır değil, lütfen 2-3 saniye bekleyip tekrar deneyin.');
            return;
        }

        const source = document.querySelector('.post');
        const postContent = document.querySelector('.post-content');
        if (!source || !postContent) {
            console.error("Post content not found!");
            return;
        }

        // Buton durumunu güncelle
        const label = btn.querySelector('.label');
        const originalText = label ? label.innerText : 'İndir';
        if (label) label.innerText = 'Hazırlanıyor...';
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';

        // 1. ADIM: Saf İçerik Klonu Oluştur
        const cloneContainer = document.createElement('div');
        
        // Başlığı ekle
        const title = source.querySelector('.post-title');
        if (title) {
            const titleClone = title.cloneNode(true);
            titleClone.style.color = '#000000';
            titleClone.style.marginBottom = '20px';
            titleClone.style.borderBottom = '2px solid #333';
            titleClone.style.paddingBottom = '10px';
            cloneContainer.appendChild(titleClone);
        }

        // Makale içeriğini ekle
        const contentClone = postContent.cloneNode(true);
        contentClone.querySelectorAll('script, iframe, .adsbygoogle, .in-feed-ad').forEach(el => el.remove());
        cloneContainer.appendChild(contentClone);
        
        // Stil iyileştirmeleri (Saf Beyaz Arka Plan)
        cloneContainer.style.background = '#ffffff';
        cloneContainer.style.color = '#000000';
        cloneContainer.style.padding = '40px';
        cloneContainer.style.width = '750px'; 
        cloneContainer.style.position = 'absolute';
        cloneContainer.style.left = '-9999px';
        
        document.body.appendChild(cloneContainer);

        // PDF Seçenekleri
        const opt = {
            margin:       [15, 12],
            filename:     `${document.title.split('|')[0].trim().replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 }, 
            html2canvas:  { 
                scale: 1, 
                useCORS: true, 
                backgroundColor: '#ffffff'
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            await html2pdf().from(cloneContainer).set(opt).save();
            console.log("PDF generated successfully.");
        } catch (err) {
            console.error('PDF Generation Technical Error:', err);
            alert('Bu makale PDF motoru için çok uzun. Lütfen Ctrl+P (Yazdır) yaparak PDF olarak kaydetmeyi deneyin.');
        } finally {
            if (document.body.contains(cloneContainer)) document.body.removeChild(cloneContainer);
            if (label) label.innerText = originalText;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        }
    };
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
    fetchGlobalCommentCounts(); // Ana sayfadaki yorum sayılarını güncelle
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
    // Yorum listesini yükle (slug tabanlı)
    const commentsList = document.getElementById('comments-list');
    if (commentsList) {
        const slug = decodeURIComponent(window.location.pathname).toLowerCase().split('/').filter(p => p).pop() || 'home';
        fetchComments(`/${slug}`);
    }

    if (commentForm) {
        commentForm.onsubmit = async (e) => {
            e.preventDefault();
            const honeypot = document.getElementById('comment-honeypot')?.value;
            if (honeypot) return; // Bot tespit edildi

            const name = document.getElementById('comment-name')?.value?.trim();
            const content = document.getElementById('comment-text')?.value?.trim();

            // Basit doğrulama
            if (!name || name.length < 2) {
                alert('Lütfen geçerli bir isim girin.');
                return;
            }
            if (!content || content.length < 3) {
                alert('Lütfen bir yorum yazın.');
                return;
            }

            const slug = decodeURIComponent(window.location.pathname).toLowerCase().split('/').filter(p => p).pop() || 'home';
            const postId = `/${slug}`;

            const submitBtn = commentForm.querySelector('button[type="submit"]');
            if (submitBtn) { submitBtn.disabled = true; submitBtn.innerText = 'Gönderiliyor...'; }

            try {
                await submitComment(postId, name, content);
                commentForm.reset();
                fetchComments(postId);
                // Başarı geri bildirimi
                const msg = document.createElement('p');
                msg.style.cssText = 'color:#4caf50;font-size:0.9rem;margin-top:8px;';
                msg.innerText = '✓ Yorumunuz gönderildi!';
                commentForm.appendChild(msg);
                setTimeout(() => msg.remove(), 3000);
            } catch (err) {
                alert('Yorum gönderilemedi, lütfen tekrar deneyin.');
                console.error('Comment submit error:', err);
            } finally {
                if (submitBtn) { submitBtn.disabled = false; submitBtn.innerText = 'Gönder'; }
            }
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
        const response = await fetch(`${_SUPABASE_URL()}/rest/v1/likes?select=*`, {
            cache: "no-store", // Tarayıcı önbelleğini fetch API ile doğru şekilde atla
            headers: { 
                "apikey": _SUPABASE_KEY(), 
                "Authorization": `Bearer ${_SUPABASE_KEY()}`
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
            // Sadece BEĞENİ elemanlarını hedefle, yorum kartlarını DIŞLA
            const allPotential = document.querySelectorAll('.like-btn, .stat-card.likeable, #like-count');
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

async function fetchGlobalCommentCounts() {
    try {
        // Tüm yorumları çek (Supabase'de GROUP BY desteği için count ile)
        const res = await fetch(`${_SUPABASE_URL()}/rest/v1/comments?select=post_id`, {
            cache: "no-store",
            headers: { "apikey": _SUPABASE_KEY(), "Authorization": `Bearer ${_SUPABASE_KEY()}` }
        });
        const data = await res.json();
        if (!data || !Array.isArray(data)) return;

        // Slug bazında say
        const counts = {};
        data.forEach(item => {
            const slug = decodeURIComponent(item.post_id || '').toLowerCase().split('/').filter(p => p).pop();
            if (slug) counts[slug] = (counts[slug] || 0) + 1;
        });

        // Tüm yorum kartlarını güncelle — eşleşme olsun olmasın 0 yaz
        document.querySelectorAll('.comment-count-card').forEach(card => {
            const rawId = card.dataset.postId || '';
            const slug = decodeURIComponent(rawId).toLowerCase().split('/').filter(p => p).pop();
            const countEl = card.querySelector('.count');
            if (countEl) countEl.innerText = (slug && counts[slug]) ? counts[slug] : 0;
        });
    } catch (e) { console.error("Comment count fetch error:", e); }
}

// Yardımcı fonksiyonlar (şifreli keyleri korumak için)
function _SUPABASE_URL() { return `${_0x4a[2]}${_0x4a[0]}.${_0x4a[1]}`; }
function _SUPABASE_KEY() { return `${_0x9b[0]}.${_0x9b[1]}.${_0x9b[2]}`; }

async function updateLikeInDB(rawPostId) {
    // fetchGlobalLikes ile AYNI slug mantığı
    const parts = decodeURIComponent(rawPostId).toLowerCase().split('/').filter(p => p);
    const slug = parts.length > 0 ? parts.pop() : "home";
    
    try {
        const headers = { 
            "apikey": _SUPABASE_KEY(), 
            "Authorization": `Bearer ${_SUPABASE_KEY()}`,
            "Content-Type": "application/json",
            "Prefer": "resolution=merge-duplicates"
        };
        
        // Tüm kayıtları çek, bu yazıya ait olanları SLUG ile eşleştir
        const getRes = await fetch(`${_SUPABASE_URL()}/rest/v1/likes?select=*`, {
            cache: "no-store",
            headers: { "apikey": _SUPABASE_KEY(), "Authorization": `Bearer ${_SUPABASE_KEY()}` }
        });
        const data = await getRes.json();
        let currentTotal = 0;
        if (data && Array.isArray(data)) {
            data.forEach(item => {
                // Aynı slug mantığı ile karşılaştır
                const itemParts = decodeURIComponent(item.post_id).toLowerCase().split('/').filter(p => p);
                const itemSlug = itemParts.length > 0 ? itemParts.pop() : "home";
                if (itemSlug === slug) {
                    currentTotal += (parseInt(item.count) || 0);
                }
            });
        }
        const newCount = currentTotal + 1;
        console.log(`Slug: ${slug}, Current: ${currentTotal}, New: ${newCount}`);

        // DB'ye slug ile yaz (tutarlı format)
        const res = await fetch(`${_SUPABASE_URL()}/rest/v1/likes?on_conflict=post_id`, {
            method: 'POST',
            headers: headers,
            body: JSON.stringify({ post_id: `/${slug}`, count: newCount })
        });

        if (res.ok) {
            console.log("DB Persistence Success! Count:", newCount);
            setTimeout(fetchGlobalLikes, 1500); 
        } else {
            console.error("DB Update Failed:", res.status);
        }
    } catch (e) {
        console.error("Critical Like Sync Error:", e);
    }
}

async function fetchComments(postId) {
    try {
        const res = await fetch(`${_SUPABASE_URL()}/rest/v1/comments?post_id=eq.${encodeURIComponent(postId)}&order=created_at.desc`, {
            cache: "no-store",
            headers: { "apikey": _SUPABASE_KEY(), "Authorization": `Bearer ${_SUPABASE_KEY()}` }
        });
        const data = await res.json();
        const list = document.getElementById('comments-list');
        if (!list) return;

        if (data && Array.isArray(data) && data.length > 0) {
            list.innerHTML = data.map(c => {
                const safeName = escapeHTML(c.name || 'Anonim');
                const safeContent = escapeHTML(c.content || '');
                const initials = safeName.substring(0,2).toUpperCase();
                const safeDate = c.created_at ? new Date(c.created_at).toLocaleDateString('tr-TR') : '';
                
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
        } else {
            list.innerHTML = '<p style="color:#888;font-size:0.9rem;">Henüz yorum yok. İlk yorumu sen yap!</p>';
        }
    } catch (err) {
        console.error('Comment fetch error:', err);
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

// --- READING PROGRESS BAR ---
function initProgressBar() {
    const bar = document.querySelector('.progress-bar');
    if (!bar) return;

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        bar.style.width = scrolled + "%";
    });
}



