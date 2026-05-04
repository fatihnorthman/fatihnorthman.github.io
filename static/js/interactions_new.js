// --- PROFESSIONAL PDF GENERATION ---
function initPDF() {
    const btn = document.getElementById('download-pdf');
    if (!btn) return;

    btn.onclick = async () => {
        console.log("PDF Generation (Final Mode) Started...");
        
        if (typeof html2pdf === 'undefined') {
            alert('PDF motoru hazır değil, lütfen bekleyin.');
            return;
        }

        const postElement = document.querySelector('.post');
        if (!postElement) return;

        // Buton durumu
        const label = btn.querySelector('.label');
        const originalText = label ? label.innerText : 'İndir';
        if (label) label.innerText = 'PDF Hazırlanıyor...';
        btn.style.opacity = '0.5';
        btn.style.pointerEvents = 'none';

        // 1. ADIM: Dinamik Ölçek Hesapla (Bellek Koruma)
        const height = postElement.offsetHeight;
        let safeScale = 1.0;
        if (height > 10000) safeScale = 0.8;
        if (height > 15000) safeScale = 0.6;
        if (height > 20000) safeScale = 0.5;

        // 2. ADIM: PDF Hazırlık Modu
        document.body.classList.add('is-pdf-printing');

        const opt = {
            margin:       [10, 5],
            filename:     `${document.title.split('|')[0].trim()}.pdf`,
            image:        { type: 'jpeg', quality: 0.95 },
            html2canvas:  { 
                scale: safeScale,
                useCORS: true,
                backgroundColor: '#ffffff',
                scrollY: 0,
                removeContainer: true
            },
            jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait', compress: true },
            pagebreak:    { mode: ['avoid-all', 'css', 'legacy'] }
        };

        try {
            await new Promise(resolve => setTimeout(resolve, 300));
            
            // Render Et
            const worker = html2pdf().from(postElement).set(opt);
            await worker.save();
            
            console.log("PDF generated successfully.");
        } catch (err) {
            console.error('PDF Engine Limit Hit:', err);
            // FALLBACK: Eğer motor patlarsa, tarayıcının kendi yazdırıcısını kullan
            window.print();
        } finally {
            document.body.classList.remove('is-pdf-printing');
            if (label) label.innerText = originalText;
            btn.style.opacity = '1';
            btn.style.pointerEvents = 'auto';
        }
    };
}
