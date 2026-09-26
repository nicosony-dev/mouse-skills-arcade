/* Connect the Dots engine
   Practices: precise point-and-click cursor placement, in sequence.
   config = {
     sequence: ['1','2','3', ...] or ['A','B','C', ...],
     revealEmoji: '⭐' // shown once the picture is complete
   }
*/
const ConnectDotsEngine = {
  mount(container, config, api) {
    const sequence = config.sequence || [];
    container.innerHTML = `
      <div class="stage" aria-label="Connect the dots stage"></div>
      <p class="status-line"></p>
    `;
    const stage = container.querySelector('.stage');
    const status = container.querySelector('.status-line');
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.style.position = 'absolute';
    svg.style.left = '0';
    svg.style.top = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    stage.appendChild(svg);

    let positions = [];
    let nextIndex = 0;

    function layout() {
      // Scatter dots pseudo-randomly but deterministically across the stage,
      // avoiding the very edges, and keep some spacing between points.
      const w = stage.clientWidth || 600;
      const h = stage.clientHeight || 440;
      positions = [];
      const cols = Math.ceil(Math.sqrt(sequence.length));
      const rows = Math.ceil(sequence.length / cols);
      const cellW = w / cols;
      const cellH = h / rows;
      let seed = 42;
      function rand() { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; }
      sequence.forEach((label, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const jitterX = (rand() - 0.5) * cellW * 0.5;
        const jitterY = (rand() - 0.5) * cellH * 0.5;
        const x = cellW * col + cellW / 2 + jitterX;
        const y = cellH * row + cellH / 2 + jitterY;
        positions.push({ x, y, label });
      });
    }

    function render() {
      stage.querySelectorAll('.dot').forEach(d => d.remove());
      positions.forEach((pos, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'dot' + (i < nextIndex ? ' done' : '') + (i === nextIndex ? ' next' : '');
        dot.textContent = pos.label;
        dot.style.left = pos.x + 'px';
        dot.style.top = pos.y + 'px';
        dot.setAttribute('aria-label', `Dot ${pos.label}`);
        dot.addEventListener('click', () => handleClick(i));
        stage.appendChild(dot);
      });
    }

    function drawLines() {
      svg.innerHTML = '';
      for (let i = 1; i < nextIndex; i++) {
        const a = positions[i - 1];
        const b = positions[i];
        const line = document.createElementNS(svgNS, 'line');
        line.setAttribute('x1', a.x);
        line.setAttribute('y1', a.y);
        line.setAttribute('x2', b.x);
        line.setAttribute('y2', b.y);
        line.setAttribute('stroke', '#2F5D50');
        line.setAttribute('stroke-width', '4');
        line.setAttribute('stroke-linecap', 'round');
        svg.appendChild(line);
      }
    }

    function handleClick(i) {
      if (i === nextIndex) {
        nextIndex++;
        drawLines();
        render();
        if (nextIndex === sequence.length) {
          status.innerHTML = `<span class="celebrate">🎉 All connected! ${config.revealEmoji || '⭐'}</span>`;
          if (config.revealEmoji) {
            const reveal = document.createElement('div');
            reveal.textContent = config.revealEmoji;
            reveal.style.position = 'absolute';
            reveal.style.left = '50%';
            reveal.style.top = '50%';
            reveal.style.transform = 'translate(-50%,-50%)';
            reveal.style.fontSize = '80px';
            reveal.style.opacity = '0.9';
            reveal.style.pointerEvents = 'none';
            stage.appendChild(reveal);
          }
        } else {
          status.textContent = `Great! Now find ${positions[nextIndex].label}.`;
        }
      } else if (i < nextIndex) {
        // already done, ignore
      } else {
        status.textContent = `Not yet — look for ${positions[nextIndex].label} first.`;
      }
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `<button type="button" class="restart-btn">🔄 New picture</button>`;
    container.insertBefore(toolbar, stage);
    toolbar.querySelector('.restart-btn').addEventListener('click', () => {
      nextIndex = 0;
      svg.innerHTML = '';
      layout();
      render();
      status.textContent = `Click ${positions[0].label} to start.`;
    });

    // Give the stage a moment to receive real layout dimensions.
    requestAnimationFrame(() => {
      layout();
      render();
      status.textContent = sequence.length ? `Click ${sequence[0]} to start.` : '';
    });
  }
};
