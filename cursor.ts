// cursor.ts
export function initBlobCursor() {
  const canvas = document.getElementById('cursor-canvas') as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext('2d')!;
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const mouse = { x: width / 2, y: height / 2 };
  const cursor = { x: width / 2, y: height / 2 };

  window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
  });

  let bounceScale = 1;
  let targetBounce = 1;

  function triggerCursorBounce() {
    targetBounce = 1.3;
    setTimeout(() => (targetBounce = 1), 150);
  }

  function cursorShake() {
    let i = 0;
    const shake = () => {
      cursor.x += (Math.random() - 0.5) * 4;
      cursor.y += (Math.random() - 0.5) * 4;
      if (++i < 4) requestAnimationFrame(shake);
    };
    shake();
  }

  document.querySelectorAll('a, button').forEach((el) => {
    el.addEventListener('mouseenter', triggerCursorBounce);
    el.addEventListener('click', cursorShake);
  });

  function drawBlobCursor() {
    ctx.clearRect(0, 0, width, height);

    cursor.x += (mouse.x - cursor.x) * 0.15;
    cursor.y += (mouse.y - cursor.y) * 0.15;

    const dx = mouse.x - cursor.x;
    const dy = mouse.y - cursor.y;
    const angle = Math.atan2(dy, dx);
    const velocity = Math.sqrt((mouse.x - cursor.x) ** 2 + (mouse.y - cursor.y) ** 2);
    const smoothDistance = Math.min(velocity / 4, 6);

    const radiusX = 15 + smoothDistance;
    const radiusY = 15 - smoothDistance / 2;

    bounceScale += (targetBounce - bounceScale) * 0.5;

    ctx.save();
    ctx.translate(cursor.x, cursor.y);
    ctx.rotate(angle);
    ctx.scale(bounceScale, bounceScale);

    ctx.beginPath();
    ctx.ellipse(0, 0, radiusX, radiusY, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(42, 17, 216, 0.8)';
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.filter = 'blur(5px)';
    const gradient = ctx.createRadialGradient(cursor.x, cursor.y, 10, cursor.x, cursor.y, 15);
    gradient.addColorStop(0, 'rgba(42, 17, 216, 0.4)');
    gradient.addColorStop(1, 'rgba(42, 17, 216, 0)');
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cursor.x, cursor.y, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    requestAnimationFrame(drawBlobCursor);
  }

  drawBlobCursor();
}