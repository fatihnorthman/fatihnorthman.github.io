/**
 * Parallax Background — North Protocol
 * Scroll parallax yıldızlar + kayan yıldız (shooting star) efekti
 */
(function () {
  'use strict';

  const canvas = document.getElementById('parallax-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, scrollY = 0, tick = 0;

  // --- Yıldız Katmanları ---
  const LAYERS = [
    { count: 140, speed: 0.10, sMin: 0.5,  sMax: 1.5,  alpha: 0.50, color: '200, 200, 220' },
    { count: 50,  speed: 0.20, sMin: 1.2,  sMax: 2.5,  alpha: 0.35, color: '190, 190, 215' },
    { count: 18,  speed: 0.35, sMin: 2.0,  sMax: 4.5,  alpha: 0.25, color: '240, 240, 255' },
    { count: 10,  speed: 0.16, sMin: 0.8,  sMax: 2.0,  alpha: 0.30, color: '229, 57, 53'  },
  ];

  let particles = [];
  let shootingStars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function initParticles() {
    particles = [];
    LAYERS.forEach(layer => {
      for (let i = 0; i < layer.count; i++) {
        particles.push({
          x:          Math.random() * W,
          baseY:      Math.random() * H,
          size:       layer.sMin + Math.random() * (layer.sMax - layer.sMin),
          alpha:      layer.alpha * (0.6 + Math.random() * 0.4),
          speed:      layer.speed * (0.7 + Math.random() * 0.6),
          color:      layer.color,
          twinkleOff: Math.random() * Math.PI * 2,
          twinkleSpd: 0.006 + Math.random() * 0.012,
        });
      }
    });
  }

  // --- Kayan Yıldız (Shooting Star) Sistemi ---
  function spawnShootingStar() {
    const startX = Math.random() * W * 0.8;
    const startY = Math.random() * H * 0.4;
    // Açı: sağa ve aşağı doğru (~30-50 derece)
    const angle = (25 + Math.random() * 30) * Math.PI / 180;
    const speed = 6 + Math.random() * 8;
    const length = 60 + Math.random() * 100;

    shootingStars.push({
      x: startX,
      y: startY,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      length: length,
      life: 1.0,
      decay: 0.008 + Math.random() * 0.008,
      width: 1.2 + Math.random() * 1.0,
      isRed: Math.random() < 0.2, // %20 kırmızı
    });
  }

  // Rastgele aralıklarla kayan yıldız üret (3-8 saniye arası)
  function scheduleNextStar() {
    const delay = 3000 + Math.random() * 5000;
    setTimeout(() => {
      spawnShootingStar();
      scheduleNextStar();
    }, delay);
  }

  function drawShootingStars() {
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      const s = shootingStars[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      if (s.life <= 0 || s.x > W + 100 || s.y > H + 100) {
        shootingStars.splice(i, 1);
        continue;
      }

      // Kuyruklu çizgi
      const tailX = s.x - (s.vx / Math.sqrt(s.vx * s.vx + s.vy * s.vy)) * s.length;
      const tailY = s.y - (s.vy / Math.sqrt(s.vx * s.vx + s.vy * s.vy)) * s.length;

      const grad = ctx.createLinearGradient(tailX, tailY, s.x, s.y);
      if (s.isRed) {
        grad.addColorStop(0, `rgba(229, 57, 53, 0)`);
        grad.addColorStop(0.6, `rgba(229, 57, 53, ${s.life * 0.3})`);
        grad.addColorStop(1, `rgba(255, 120, 100, ${s.life * 0.9})`);
      } else {
        grad.addColorStop(0, `rgba(255, 255, 255, 0)`);
        grad.addColorStop(0.6, `rgba(220, 220, 240, ${s.life * 0.3})`);
        grad.addColorStop(1, `rgba(255, 255, 255, ${s.life * 0.95})`);
      }

      ctx.beginPath();
      ctx.moveTo(tailX, tailY);
      ctx.lineTo(s.x, s.y);
      ctx.strokeStyle = grad;
      ctx.lineWidth = s.width * s.life;
      ctx.lineCap = 'round';
      ctx.stroke();

      // Baştaki parlak nokta
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.width * 1.5 * s.life, 0, Math.PI * 2);
      const headColor = s.isRed ? `rgba(255, 100, 80, ${s.life * 0.8})` : `rgba(255, 255, 255, ${s.life * 0.9})`;
      ctx.fillStyle = headColor;
      ctx.fill();
    }
  }

  // --- Ana Çizim ---
  function draw() {
    tick++;
    ctx.clearRect(0, 0, W, H);

    // Yıldızlar
    particles.forEach(p => {
      let drawY = (p.baseY - scrollY * p.speed) % H;
      if (drawY < 0) drawY += H;

      const twinkle = 0.5 + 0.5 * Math.sin(tick * p.twinkleSpd + p.twinkleOff);
      const a = p.alpha * twinkle;

      ctx.beginPath();
      ctx.arc(p.x, drawY, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color}, ${a})`;
      ctx.fill();

      // Büyük noktalar için glow
      if (p.size > 2.5) {
        ctx.beginPath();
        ctx.arc(p.x, drawY, p.size * 2.5, 0, Math.PI * 2);
        const grad = ctx.createRadialGradient(p.x, drawY, 0, p.x, drawY, p.size * 2.5);
        grad.addColorStop(0, `rgba(${p.color}, ${a * 0.2})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        ctx.fillStyle = grad;
        ctx.fill();
      }
    });

    // Kayan yıldızlar
    drawShootingStars();

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
    // İlk kayan yıldızı 2 saniye sonra başlat
    setTimeout(scheduleNextStar, 2000);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
