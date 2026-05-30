/**
 * space.js
 * Animasi canvas game galaksi pada hero section
 */

(function () {
  const canvas = document.getElementById('spaceCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');

  // Sesuaikan ukuran canvas dengan elemen
  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // ---- Stars ----
  const STAR_COUNT = 60;
  const stars = Array.from({ length: STAR_COUNT }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 1.5 + 0.3,
    speed: Math.random() * 0.4 + 0.1,
    alpha: Math.random() * 0.7 + 0.3,
  }));

  // ---- Ship ----
  const ship = {
    x: canvas.width / 2,
    y: canvas.height * 0.55,
    w: 22,
    h: 32,
    angle: 0,
    thrustPhase: 0,
  };

  // ---- Bullets ----
  const bullets = [];
  let bulletTimer = 0;

  // ---- Enemies (alien circles) ----
  const enemies = [];
  let enemyTimer = 0;

  // ---- Explosions ----
  const explosions = [];

  // ---- Score ----
  let score = 9870;

  function spawnEnemy() {
    enemies.push({
      x: Math.random() * (canvas.width - 20) + 10,
      y: -10,
      r: Math.random() * 6 + 4,
      speed: Math.random() * 0.5 + 0.3,
      color: Math.random() > 0.5 ? '#b07fff' : '#39ff8f',
      hp: 1,
    });
  }

  function spawnExplosion(x, y, color) {
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      explosions.push({
        x, y,
        vx: Math.cos(angle) * (Math.random() * 2 + 0.5),
        vy: Math.sin(angle) * (Math.random() * 2 + 0.5),
        alpha: 1,
        color,
        r: Math.random() * 2 + 1,
      });
    }
  }

  function drawShip(x, y) {
    ctx.save();
    ctx.translate(x, y);

    // Thruster flame
    ship.thrustPhase += 0.15;
    const flameLen = 8 + Math.sin(ship.thrustPhase) * 4;
    const grad = ctx.createLinearGradient(0, 14, 0, 14 + flameLen);
    grad.addColorStop(0, 'rgba(57,255,143,0.9)');
    grad.addColorStop(0.5, 'rgba(255,170,0,0.7)');
    grad.addColorStop(1, 'rgba(255,60,0,0)');
    ctx.beginPath();
    ctx.moveTo(-5, 14);
    ctx.lineTo(0, 14 + flameLen);
    ctx.lineTo(5, 14);
    ctx.fillStyle = grad;
    ctx.fill();

    // Body
    ctx.beginPath();
    ctx.moveTo(0, -16);
    ctx.lineTo(10, 14);
    ctx.lineTo(0, 9);
    ctx.lineTo(-10, 14);
    ctx.closePath();
    ctx.fillStyle = '#b07fff';
    ctx.fill();
    ctx.strokeStyle = '#39ff8f';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Cockpit
    ctx.beginPath();
    ctx.ellipse(0, -2, 4, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(57,255,143,0.5)';
    ctx.fill();

    // Wings
    ctx.beginPath();
    ctx.moveTo(-10, 14);
    ctx.lineTo(-16, 18);
    ctx.lineTo(-8, 8);
    ctx.closePath();
    ctx.fillStyle = '#7730cc';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(10, 14);
    ctx.lineTo(16, 18);
    ctx.lineTo(8, 8);
    ctx.closePath();
    ctx.fillStyle = '#7730cc';
    ctx.fill();

    ctx.restore();
  }

  function update() {
    const W = canvas.width;
    const H = canvas.height;

    // Stars scroll
    stars.forEach(s => {
      s.y += s.speed;
      if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
    });

    // Bullets
    bulletTimer++;
    if (bulletTimer > 20) {
      bullets.push({ x: ship.x, y: ship.y - 18, speed: 4 });
      bulletTimer = 0;
    }
    for (let i = bullets.length - 1; i >= 0; i--) {
      bullets[i].y -= bullets[i].speed;
      if (bullets[i].y < -5) bullets.splice(i, 1);
    }

    // Enemies
    enemyTimer++;
    if (enemyTimer > 60) {
      spawnEnemy();
      enemyTimer = 0;
    }
    for (let i = enemies.length - 1; i >= 0; i--) {
      enemies[i].y += enemies[i].speed;
      if (enemies[i].y > H + 20) { enemies.splice(i, 1); continue; }

      // Bullet collision
      for (let j = bullets.length - 1; j >= 0; j--) {
        const dx = bullets[j].x - enemies[i].x;
        const dy = bullets[j].y - enemies[i].y;
        if (Math.sqrt(dx * dx + dy * dy) < enemies[i].r + 3) {
          spawnExplosion(enemies[i].x, enemies[i].y, enemies[i].color);
          score += 10;
          document.getElementById('score').textContent = String(score).padStart(6, '0');
          enemies.splice(i, 1);
          bullets.splice(j, 1);
          break;
        }
      }
    }

    // Explosions
    for (let i = explosions.length - 1; i >= 0; i--) {
      const e = explosions[i];
      e.x += e.vx;
      e.y += e.vy;
      e.alpha -= 0.06;
      if (e.alpha <= 0) explosions.splice(i, 1);
    }
  }

  function draw() {
    const W = canvas.width;
    const H = canvas.height;

    // Background
    ctx.fillStyle = '#000510';
    ctx.fillRect(0, 0, W, H);

    // Nebula glow
    const nebula = ctx.createRadialGradient(W * 0.6, H * 0.3, 0, W * 0.6, H * 0.3, 80);
    nebula.addColorStop(0, 'rgba(80,20,120,0.25)');
    nebula.addColorStop(1, 'transparent');
    ctx.fillStyle = nebula;
    ctx.fillRect(0, 0, W, H);

    const nebula2 = ctx.createRadialGradient(W * 0.2, H * 0.7, 0, W * 0.2, H * 0.7, 60);
    nebula2.addColorStop(0, 'rgba(20,80,40,0.2)');
    nebula2.addColorStop(1, 'transparent');
    ctx.fillStyle = nebula2;
    ctx.fillRect(0, 0, W, H);

    // Stars
    stars.forEach(s => {
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,220,200,${s.alpha})`;
      ctx.fill();
    });

    // Bullets
    bullets.forEach(b => {
      ctx.beginPath();
      ctx.rect(b.x - 1, b.y, 2, 8);
      ctx.fillStyle = '#39ff8f';
      ctx.shadowBlur = 6;
      ctx.shadowColor = '#39ff8f';
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    // Enemies
    enemies.forEach(e => {
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = e.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = e.color;
      ctx.fill();
      ctx.shadowBlur = 0;
      // Inner dot
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r * 0.4, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(255,255,255,0.6)';
      ctx.fill();
    });

    // Explosions
    explosions.forEach(e => {
      ctx.beginPath();
      ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${e.color === '#39ff8f' ? '57,255,143' : '176,127,255'},${e.alpha})`;
      ctx.fill();
    });

    // Ship
    drawShip(ship.x, ship.y);
  }

  function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
  }

  loop();
})();