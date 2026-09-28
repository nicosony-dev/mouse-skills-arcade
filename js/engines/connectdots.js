/* Connect the Dots engine
   Practices: precise point-and-click cursor placement, in sequence.
   config = {
     sequence: ['1','2','3', ...] or ['A','B','C', ...],
     revealEmoji: '⭐' // shown as a bonus sticker once the picture is complete
   }

   Dots are laid out along the outline of a real shape (star, house, heart,
   arrow, kite, tree), picked at random, and resampled to however many dots
   this grade's sequence needs — so a 10-dot Kindergarten round and a 26-dot
   Grade 1 round both trace a recognizable picture, not a random zigzag.
*/

// Each shape is a closed polygon, given as normalized (0–1) vertices in the
// order a pencil would trace them. The engine "closes the loop" itself by
// drawing one extra line from the last dot back to the first once the
// picture is finished, so every shape ends up looking whole.
const CONNECT_DOTS_SHAPES = [
  { name: 'star', vertices: (() => {
      const pts = [];
      const cx = 0.5, cy = 0.5, outerR = 0.44, innerR = 0.18;
      for (let k = 0; k < 10; k++) {
        const angle = -Math.PI / 2 + k * (Math.PI / 5);
        const r = k % 2 === 0 ? outerR : innerR;
        pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
      }
      return pts;
    })() },
  { name: 'house', vertices: [
      [0.15, 0.9], [0.85, 0.9], [0.85, 0.5], [0.5, 0.15], [0.15, 0.5]
    ] },
  { name: 'heart', vertices: [
      [0.5, 0.95], [0.15, 0.55], [0.28, 0.22], [0.5, 0.38], [0.72, 0.22], [0.85, 0.55]
    ] },
  { name: 'kite', vertices: [
      [0.5, 0.05], [0.85, 0.45], [0.5, 0.95], [0.15, 0.45]
    ] },
  // Arrow and tree have a thin "notch" (the arrow's wings, the tree's trunk)
  // that only reads correctly once there are enough dots to trace it —
  // minPoints keeps them out of the pool for very short sequences (like
  // Kindergarten's 10 dots), where they'd collapse into a blob.
  { name: 'arrow', minPoints: 14, vertices: [
      [0.5, 0.05], [0.85, 0.4], [0.65, 0.4], [0.65, 0.95], [0.35, 0.95], [0.35, 0.4], [0.15, 0.4]
    ] },
  { name: 'tree', minPoints: 14, vertices: [
      [0.5, 0.05], [0.85, 0.5], [0.6, 0.5], [0.6, 0.95], [0.4, 0.95], [0.4, 0.5], [0.15, 0.5]
    ] }
];

/** Evenly resamples a closed polygon (by arc length) into exactly n points,
    starting exactly at vertices[0]. Works for any n, so the same shape
    library serves a 10-dot round and a 26-dot round alike. */
function resampleClosedPolygon(vertices, n) {
  const edges = vertices.map((v, i) => {
    const next = vertices[(i + 1) % vertices.length];
    const len = Math.hypot(next[0] - v[0], next[1] - v[1]);
    return { from: v, to: next, len };
  });
  const perimeter = edges.reduce((sum, e) => sum + e.len, 0);
  const step = perimeter / n;
  const points = [];
  for (let k = 0; k < n; k++) {
    let target = k * step;
    let edgeIndex = 0;
    while (edgeIndex < edges.length - 1 && target > edges[edgeIndex].len) {
      target -= edges[edgeIndex].len;
      edgeIndex++;
    }
    const edge = edges[edgeIndex];
    const t = edge.len === 0 ? 0 : target / edge.len;
    points.push([
      edge.from[0] + (edge.to[0] - edge.from[0]) * t,
      edge.from[1] + (edge.to[1] - edge.from[1]) * t
    ]);
  }
  return points;
}

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
      const w = stage.clientWidth || 600;
      const h = stage.clientHeight || 440;
      // Genuinely random each time (Math.random, not a fixed seed) so
      // "New picture" actually changes the picture. Shapes with a minPoints
      // requirement are excluded when this round doesn't have enough dots
      // to trace their thinner details cleanly.
      const eligibleShapes = CONNECT_DOTS_SHAPES.filter(s => !s.minPoints || sequence.length >= s.minPoints);
      const shape = eligibleShapes[Math.floor(Math.random() * eligibleShapes.length)];
      const rawPoints = resampleClosedPolygon(shape.vertices, sequence.length);

      // Fit the normalized 0–1 shape into the stage with generous padding
      // so dot labels near the edges don't get clipped.
      const padX = w * 0.14;
      const padY = h * 0.14;
      const usableW = w - padX * 2;
      const usableH = h - padY * 2;

      positions = rawPoints.map(([nx, ny], i) => ({
        x: padX + nx * usableW,
        y: padY + ny * usableH,
        label: sequence[i]
      }));
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

    function drawLines(closeLoop) {
      svg.innerHTML = '';
      for (let i = 1; i < nextIndex; i++) {
        drawSegment(positions[i - 1], positions[i]);
      }
      if (closeLoop && positions.length > 1) {
        // One extra line from the last dot back to the first, so the
        // finished picture reads as a whole shape rather than an open path.
        drawSegment(positions[positions.length - 1], positions[0]);
      }
    }

    function drawSegment(a, b) {
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

    function handleClick(i) {
      if (i === nextIndex) {
        nextIndex++;
        const finished = nextIndex === sequence.length;
        drawLines(finished);
        render();
        if (finished) {
          status.innerHTML = `<span class="celebrate">🎉 All connected! ${config.revealEmoji || '⭐'}</span>`;
          if (config.revealEmoji) {
            const reveal = document.createElement('div');
            reveal.textContent = config.revealEmoji;
            reveal.style.position = 'absolute';
            reveal.style.left = '8px';
            reveal.style.top = '8px';
            reveal.style.fontSize = '40px';
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
      stage.querySelectorAll('div').forEach(d => d.remove()); // clear any reveal sticker
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
