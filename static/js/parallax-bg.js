/**
 * Parallax Background — North Protocol
 * Scroll'a bağlı hareketli yıldız/parçacık arka planı
 */
(function () {
  'use strict';

  const canvas = document.getElementById('parallax-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, scrollY = 0, tick = 0;

  // --- Katman Konfigürasyonu (daha belirgin) ---
  const LAYERS = [
    // küçük yıldızlar — çok sayıda, orta hız
    { count: 120, speed: 0.12, sMin: 0.8,  sMax: 1.8,  alpha: 0.55, color: '210, 210, 230' },
    // orta yıldızlar — daha az, daha hızlı
    { count: 45,  speed: 0.22, sMin: 1.5,  sMax: 3.0,  alpha: 0.40, color: '200, 200, 225' },
    // büyük parlak noktalar — az sayıda, en hızlı
    { count: 15,  speed: 0.38, sMin: 2.5,  sMax: 5.0,  alpha: 0.30, color: '255, 255, 255' },
    // kırmızı aksan noktaları — ince ama görünür
    { count: 12,  speed: 0.18, sMin: 1.0,  sMax: 2.5,  alpha: 0.35, color: '229, 57, 53'  },
  ];

  let particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = [];
    LAYERS.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        particles.push({
          x:            Math.random() * W,
          baseY:        Math.random() * H,
          size:         layer.sMin + Math.random() * (layer.sMax - layer.sMin),
          alpha:        layer.alpha * (0.6 + Math.random() * 0.4),
          speed:        layer.speed * (0.7 + Math.random() * 0.6),
          color:        layer.color,
          twinkleOff:   Math.random() * Math.PI * 2,
          twinkleSpd:   0.008 + Math.random() * 0.015,
        });
      }
    });
  }

  function draw() {
    tick++;
    ctx.clearRect(0, 0, W, H);

    particles.forEach(p => {
      // Scroll'a göre Y konumu kaydır (parallax)
      let drawY = (p.baseY - scrollY * p.speed) % H;
      if (drawY < 0) drawY += H;

      // Twinkle (titreme)
      const twinkle = 0.55 + 0.45 * Math.sin(tick * p.twinkleSpd + p.twinkleOff);
      const a = p.alpha * twinkle;

      ctx.beginPath();
      ctx.arc(p.x, drawY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${a})`;
      ctx.fill();

      // Büyük noktalar için hafif glow
      if (p.size > 2.5) {
        ctx.beginPath();
        ctx.arc(p.x, drawY, p.size * 2.5, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(p.x, drawY, 0, p.x, drawY, p.size * 2.5);
        grad.addColorStop(0, `rgba(${p.color}, ${a * 0.25})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('scroll', () => {
    scrollY = window.scrollY || window.pageYOffset;
  }, { passive: true });

  window.addEventListener('resize', () => { resize(); initParticles(); });

  function init() {
    resize();
    initParticles();
    draw();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
