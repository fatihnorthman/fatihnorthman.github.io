/**
 * Parallax Background — North Protocol
 * Scroll'a bağlı hafif hareket eden partiküller
 * Tema: koyu lacivert (#0d0d17) + kırmızı aksan (#e53935)
 */
(function () {
  'use strict';

  const canvas = document.getElementById('parallax-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let W, H, scrollY = 0, animId;

  // --- Partikül Konfigürasyonu ---
  const LAYERS = [
    // [sayı, hız_çarpanı, boyut_min, boyut_max, opaklık, renk]
    { count: 60,  speed: 0.08, sMin: 0.5, sMax: 1.2,  alpha: 0.25, color: '220, 220, 232' }, // beyaz noktalar (yıldızlar)
    { count: 25,  speed: 0.15, sMin: 1.0, sMax: 2.0,  alpha: 0.15, color: '220, 220, 232' }, // orta yıldızlar
    { count: 8,   speed: 0.25, sMin: 1.5, sMax: 3.0,  alpha: 0.08, color: '229, 57, 53'  }, // kırmızı nokta (ince aksan)
  ];

  let particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function randomInRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function initParticles() {
    particles = [];
    LAYERS.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        particles.push({
          x:     Math.random() * W,
          y:     Math.random() * H * 3,   // toplam sayfa yüksekliği boyunca dağıt
          size:  randomInRange(layer.sMin, layer.sMax),
          alpha: randomInRange(layer.alpha * 0.5, layer.alpha),
          speed: layer.speed * (0.7 + Math.random() * 0.6),
          color: layer.color,
          twinkleOffset: Math.random() * Math.PI * 2,
          twinkleSpeed:  0.005 + Math.random() * 0.01,
        });
      }
    });
  }

  let tick = 0;
  function draw() {
    tick++;
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Parallax offset: her partikülin scroll'dan etkilenme miktarı farklı
      const parallaxY = (scrollY * p.speed) % (H * 3);
      let drawY = p.y - parallaxY;

      // Ekrandan çıkınca üstten tekrar gir
      drawY = ((drawY % H) + H) % H;

      // Hafif titreme (twinkle) efekti
      const twinkle = Math.sin(tick * p.twinkleSpeed + p.twinkleOffset) * 0.4 + 0.6;
      const finalAlpha = p.alpha * twinkle;

      ctx.beginPath();
      ctx.arc(p.x, drawY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${finalAlpha})`;
      ctx.fill();
    });

    animId = requestAnimationFrame(draw);
  }

  function onScroll() {
    scrollY = window.scrollY || window.pageYOffset;
  }

  function init() {
    resize();
    initParticles();
    draw();

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', () => {
      resize();
      initParticles();
    });
  }

  // DOM hazır olduğunda başlat
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
