// --- PROFESSIONAL PDF GENERATION ---
function initPDF() {
    const btn = document.getElementById('download-pdf');
    if (!btn) return;

    btn.onclick = async () => {
        console.log("PDF Generation (Live Mode) Started...");
        
        if (typeof html2pdf === 'undefined') {
            alert('PDF motoru henüz hazır değil, lütfen birkaç saniye sonra tekrar deneyin.');
            return;
        }

        const postElement = document.querySelector('.post');
        if (!postElement) return;

        // Buton durumunu güncelle
        const label = btn.querySelector('.label');
        const originalText = label ? label.innerText : 'İndir';
        if (label) label.innerText = 'İşleniyor...';
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';

        // 1. ADIM: PDF MODUNA GEÇ (CSS ile her şeyi gizle, sadece makaleyi bırak)
        document.body.classList.add('is-pdf-printing');

        // 2. ADIM: PDF Seçenekleri
        const opt = {
            margin:       [10, 5],
            filename:     `${document.title.split('|')[0].trim()}.pdf`,
            image:        { type: 'jpeg', quality: 0.98 },
            html2canvas:  { 
                scale: 1.5,
                useCORS: true,
                backgroundColor: '#ffffff',
                logging: false,
                scrollY: 0
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        try {
            // Layout'un oturması için kısa bir bekleme
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Doğrudan canlı elementi yakala
            await html2pdf().from(postElement).set(opt).save();
            console.log("PDF generated successfully.");
        } catch (err) {
            console.error('PDF Error:', err);
            alert('PDF oluşturulamadı. Sayfa çok uzun olabilir.');
        } finally {
            // 3. ADIM: NORMAL MODA DÖN
            document.body.classList.remove('is-pdf-printing');
            if (label) label.innerText = originalText;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        }
    };
}
