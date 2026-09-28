/* Paint engine
   Practices: click-and-hold cursor control while drawing (fine motor control).
   Covers ABCya Paint, Magic Mirror Paint (mirrorMode), and Animate (frames).

   config = {
     mirrorMode: false,
     frames: false,      // Animate mode: filmstrip + play
     frameCount: 6,
     colors: ['#2F5D50', ...],
     brushSizes: [4, 10, 18]
   }
*/
const PaintEngine = {
  mount(container, config, api) {
    const colors = config.colors || ['#2B2621', '#E85D4C', '#F4A825', '#4FA8D8', '#8E6BB0', '#2F5D50'];
    const brushSizes = config.brushSizes || [4, 10, 18];
    let color = colors[0];
    let brush = brushSizes[1];
    const useFrames = !!config.frames;
    const frameCount = config.frameCount || 6;

    container.innerHTML = `
      <div class="toolbar">
        <span aria-hidden="true">🎨</span>
        <span class="swatches"></span>
        <span class="brushes"></span>
        <button type="button" class="clear-btn">🧹 Clear</button>
        ${config.mirrorMode ? '<span style="font-weight:700;">✨ Mirror mode is on</span>' : ''}
        ${useFrames ? '<button type="button" class="play-btn primary">▶ Play</button>' : ''}
      </div>
      ${useFrames ? '<div class="tray filmstrip" aria-label="Frames"></div>' : ''}
      <div class="stage" style="min-height:420px;"></div>
      <p class="status-line"></p>
    `;

    const swatchesEl = container.querySelector('.swatches');
    const brushesEl = container.querySelector('.brushes');
    const stage = container.querySelector('.stage');
    const status = container.querySelector('.status-line');

    colors.forEach(c => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'swatch' + (c === color ? ' active' : '');
      b.style.background = c;
      b.setAttribute('aria-label', 'Color ' + c);
      b.addEventListener('click', () => {
        color = c;
        swatchesEl.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
        b.classList.add('active');
      });
      swatchesEl.appendChild(b);
    });

    brushSizes.forEach((size, i) => {
      const b = document.createElement('button');
      b.type = 'button';
      b.textContent = ['Small', 'Medium', 'Large'][i] || (size + 'px');
      if (size === brush) b.classList.add('active');
      b.addEventListener('click', () => {
        brush = size;
        brushesEl.querySelectorAll('button').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
      });
      brushesEl.appendChild(b);
    });

    function buildCanvas() {
      const canvas = document.createElement('canvas');
      canvas.style.width = '100%';
      canvas.style.height = '420px';
      canvas.style.touchAction = 'none';
      stage.innerHTML = '';
      stage.appendChild(canvas);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = 420;
      return canvas;
    }

    let canvas = buildCanvas();
    let ctx = canvas.getContext('2d');
    let drawing = false;
    let last = null;
    let frames = useFrames ? new Array(frameCount).fill(null) : null;
    let currentFrame = 0;

    function strokeAt(x, y, px, py) {
      ctx.lineJoin = 'round';
      ctx.lineCap = 'round';
      ctx.strokeStyle = color;
      ctx.lineWidth = brush;
      ctx.beginPath();
      ctx.moveTo(px, py);
      ctx.lineTo(x, y);
      ctx.stroke();

      if (config.mirrorMode) {
        const mx = canvas.width - x;
        const mpx = canvas.width - px;
        ctx.beginPath();
        ctx.moveTo(mpx, py);
        ctx.lineTo(mx, y);
        ctx.stroke();
      }
    }

    function pointerPos(ev) {
      const r = canvas.getBoundingClientRect();
      return { x: ev.clientX - r.left, y: ev.clientY - r.top };
    }

    canvas.addEventListener('pointerdown', (ev) => {
      drawing = true;
      canvas.setPointerCapture(ev.pointerId);
      last = pointerPos(ev);
      // draw a dot for a single click/tap
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(last.x, last.y, brush / 2, 0, Math.PI * 2);
      ctx.fill();
      if (config.mirrorMode) {
        ctx.beginPath();
        ctx.arc(canvas.width - last.x, last.y, brush / 2, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    canvas.addEventListener('pointermove', (ev) => {
      if (!drawing) return;
      const pos = pointerPos(ev);
      strokeAt(pos.x, pos.y, last.x, last.y);
      last = pos;
    });
    function stop() { drawing = false; last = null; }
    canvas.addEventListener('pointerup', stop);
    canvas.addEventListener('pointercancel', stop);
    canvas.addEventListener('pointerleave', stop);

    container.querySelector('.clear-btn').addEventListener('click', () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    // ---------- Animate (flipbook) mode ----------
    if (useFrames) {
      const filmstrip = container.querySelector('.filmstrip');
      function renderFilmstrip() {
        filmstrip.innerHTML = '';
        frames.forEach((data, i) => {
          const thumb = document.createElement('button');
          thumb.type = 'button';
          thumb.className = 'tray-item';
          thumb.style.fontSize = '0.8rem';
          thumb.style.width = '54px';
          thumb.style.height = '54px';
          thumb.style.padding = '0';
          thumb.style.overflow = 'hidden';
          thumb.title = `Frame ${i + 1}`;
          if (i === currentFrame) thumb.style.borderColor = '#4FA8D8';
          if (data) {
            const img = document.createElement('img');
            img.src = data;
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            thumb.appendChild(img);
          } else {
            thumb.textContent = i + 1;
          }
          thumb.addEventListener('click', () => switchFrame(i));
          filmstrip.appendChild(thumb);
        });
      }

      function switchFrame(i) {
        frames[currentFrame] = canvas.toDataURL();
        currentFrame = i;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        if (frames[i]) {
          const img = new Image();
          img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          img.src = frames[i];
        }
        renderFilmstrip();
        status.textContent = `Editing frame ${i + 1} of ${frameCount}. Draw, then click another frame.`;
      }

      renderFilmstrip();
      status.textContent = `Draw frame 1, then click frame 2 and change your drawing a little. Press Play to see it move!`;

      container.querySelector('.play-btn').addEventListener('click', () => {
        frames[currentFrame] = canvas.toDataURL();
        let i = 0;
        status.textContent = 'Playing…';
        const timer = setInterval(() => {
          const data = frames[i % frameCount];
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          if (data) {
            const img = new Image();
            img.onload = () => ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            img.src = data;
          }
          i++;
          if (i >= frameCount * 3) {
            clearInterval(timer);
            switchFrame(currentFrame);
          }
        }, 220);
      });
    } else {
      status.textContent = config.mirrorMode
        ? 'Draw on one side — it mirrors to the other automatically!'
        : 'Pick a color and brush size, then draw!';
    }
  }
};
