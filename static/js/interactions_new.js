// --- PROFESSIONAL PDF GENERATION ---
function initPDF() {
    const btn = document.getElementById('download-pdf');
    if (!btn) return;

    btn.onclick = async () => {
        console.log("PDF Generation Started...");
        
        if (typeof html2pdf === 'undefined') {
            alert('PDF motoru henüz hazır değil, lütfen 2-3 saniye bekleyip tekrar deneyin.');
            return;
        }

        const postContent = document.querySelector('.post-content');
        const postTitle = document.querySelector('.post-title');
        if (!postContent) return;

        // Buton durumunu güncelle
        const label = btn.querySelector('.label');
        const originalText = label ? label.innerText : 'İndir';
        if (label) label.innerText = 'PDF Hazırlanıyor...';
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';

        // 1. ADIM: Render Edilecek Saf İçeriği Hazırla
        const container = document.createElement('div');
        container.style.padding = '40px';
        container.style.background = '#ffffff';
        container.style.color = '#000000';
        container.style.width = '700px';
        container.style.position = 'absolute';
        container.style.left = '-9999px';

        // Başlığı ekle
        if (postTitle) {
            const tClone = postTitle.cloneNode(true);
            tClone.style.color = '#000';
            tClone.style.borderBottom = '1px solid #333';
            tClone.style.paddingBottom = '10px';
            tClone.style.marginBottom = '30px';
            container.appendChild(tClone);
        }

        // İçeriği ekle ve TEMİZLE
        const cClone = postContent.cloneNode(true);
        cClone.querySelectorAll('ins, script, iframe, .adsbygoogle, .in-feed-ad, .multiplex-ad-container, .hanchor').forEach(el => el.remove());
        cClone.style.color = '#111';
        container.appendChild(cClone);
        
        document.body.appendChild(container);

        // 2. ADIM: Resimlerin Yüklendiğinden Emin Ol
        const imgs = container.querySelectorAll('img');
        const imgPromises = Array.from(imgs).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
        });
        await Promise.all(imgPromises);

        // 3. ADIM: PDF Seçenekleri
        const opt = {
            margin:       [15, 15],
            filename:     `${document.title.split('|')[0].trim()}.pdf`,
            image:        { type: 'jpeg', quality: 0.95 },
            html2canvas:  { 
                scale: 1, 
                useCORS: true,
                backgroundColor: '#ffffff'
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        try {
            await html2pdf().from(container).set(opt).save();
            console.log("PDF generated successfully.");
        } catch (err) {
            console.error('PDF Error:', err);
            alert('PDF oluşturulamadı. İçerik çok büyük olabilir.');
        } finally {
            if (document.body.contains(container)) document.body.removeChild(container);
            if (label) label.innerText = originalText;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        }
    };
}
