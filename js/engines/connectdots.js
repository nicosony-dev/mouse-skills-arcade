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

/** Vertices of a regular polygon (used for the circle, hexagon, and
    pentagon shapes below) — n evenly spaced points around a center. */
function regularPolygonVertices(sides, cx, cy, r, startAngle) {
  const pts = [];
  for (let k = 0; k < sides; k++) {
    const angle = startAngle + k * (2 * Math.PI / sides);
    pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }
  return pts;
}

// Each shape is a closed polygon, given as normalized (0–1) vertices in the
// order a pencil would trace them. The engine "closes the loop" itself by
// drawing one extra line from the last dot back to the first once the
// picture is finished, so every shape ends up looking whole.
//
// Shapes are split into two non-overlapping pools via `category` — 'numbers'
// or 'letters' — so Connect the Dots and Connect the Dots ABC never draw
// from the same set. A student who plays both back-to-back is guaranteed
// two different pictures, not just "probably different." Each category has
// at least 5 shapes that work even at Kindergarten's 10 dots; a couple of
// extra shapes with finer detail (marked minPoints) join the pool only once
// a round has enough dots to trace them cleanly.
const CONNECT_DOTS_SHAPES = [
  // ---- numbers pool ----
  { name: 'star', category: 'numbers', vertices: (() => {
      const pts = [];
      const cx = 0.5, cy = 0.5, outerR = 0.44, innerR = 0.18;
      for (let k = 0; k < 10; k++) {
        const angle = -Math.PI / 2 + k * (Math.PI / 5);
        const r = k % 2 === 0 ? outerR : innerR;
        pts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
      }
      return pts;
    })() },
  { name: 'house', category: 'numbers', vertices: [
      [0.15, 0.9], [0.85, 0.9], [0.85, 0.5], [0.5, 0.15], [0.15, 0.5]
    ] },
  { name: 'sun', category: 'numbers',
    vertices: regularPolygonVertices(12, 0.5, 0.5, 0.42, -Math.PI / 2) },
  { name: 'triangle', category: 'numbers', vertices: [
      [0.5, 0.05], [0.92, 0.9], [0.08, 0.9]
    ] },
  { name: 'leaf', category: 'numbers', vertices: [
      [0.05, 0.5], [0.25, 0.25], [0.55, 0.15], [0.8, 0.25],
      [0.95, 0.5], [0.8, 0.75], [0.55, 0.85], [0.25, 0.75]
    ] },
  // ---- numbers "challenge" shapes (join the pool once a round has 14+
  // dots, i.e. Grade 1's default 20-dot round and Kindergarten's 1–20
  // challenge toggle) ----
  { name: 'tree', category: 'numbers', minPoints: 14, vertices: [
      [0.5, 0.05], [0.85, 0.5], [0.6, 0.5], [0.6, 0.95], [0.4, 0.95], [0.4, 0.5], [0.15, 0.5]
    ] },
  { name: 'sailboat', category: 'numbers', minPoints: 14, vertices: [
      [0.05, 0.82], [0.5, 0.95], [0.95, 0.82], [0.55, 0.82], [0.55, 0.15], [0.2, 0.78]
    ] },
  { name: 'house-chimney', category: 'numbers', minPoints: 14, vertices: [
      [0.15, 0.9], [0.85, 0.9], [0.85, 0.5], [0.745, 0.395], [0.745, 0.245],
      [0.6575, 0.1575], [0.6575, 0.3075], [0.5, 0.15], [0.15, 0.5]
    ] },
  { name: 'sun-rays', category: 'numbers', minPoints: 14, vertices: (() => {
      // A denser base circle (40 points) with a modest ray bump every 10th
      // point — arc-length resampling naturally favors long edges, so a
      // coarser polygon here would collapse into a plain diamond by the
      // time it's resampled down to 20 dots.
      const pts = [];
      for (let k = 0; k < 40; k++) {
        const angle = -Math.PI / 2 + k * (2 * Math.PI / 40);
        const r = k % 10 === 0 ? 0.44 : 0.34;
        pts.push([0.5 + r * Math.cos(angle), 0.5 + r * Math.sin(angle)]);
      }
      return pts;
    })() },
  { name: 'fish', category: 'numbers', minPoints: 14, vertices: [
      [0.05, 0.5], [0.25, 0.3], [0.5, 0.22], [0.68, 0.3], [0.95, 0.15],
      [0.78, 0.5], [0.95, 0.85], [0.68, 0.7], [0.5, 0.78], [0.25, 0.7]
    ] },

  // ---- letters pool ----
  { name: 'heart', category: 'letters', vertices: [
      [0.5, 0.95], [0.15, 0.55], [0.28, 0.22], [0.5, 0.38], [0.72, 0.22], [0.85, 0.55]
    ] },
  { name: 'kite', category: 'letters', vertices: [
      [0.5, 0.05], [0.85, 0.45], [0.5, 0.95], [0.15, 0.45]
    ] },
  { name: 'hexagon', category: 'letters',
    vertices: regularPolygonVertices(6, 0.5, 0.5, 0.42, -Math.PI / 2) },
  { name: 'pentagon', category: 'letters',
    vertices: regularPolygonVertices(5, 0.5, 0.52, 0.42, -Math.PI / 2) },
  { name: 'egg', category: 'letters',
    vertices: (() => {
      const pts = [];
      const cx = 0.5, cy = 0.5, rx = 0.3, ry = 0.44;
      for (let k = 0; k < 12; k++) {
        const angle = -Math.PI / 2 + k * (2 * Math.PI / 12);
        pts.push([cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)]);
      }
      return pts;
    })() },
  // ---- letters "challenge" shapes (join the pool once a round has 14+
  // dots, i.e. Grade 1's default 26-dot round and Kindergarten's A–Z
  // challenge toggle) ----
  { name: 'butterfly', category: 'letters', minPoints: 14, vertices: [
      [0.5, 0.15], [0.92, 0.35], [0.6, 0.55], [0.5, 0.88], [0.4, 0.55], [0.08, 0.35]
    ] },
  { name: 'flower', category: 'letters', minPoints: 14, vertices: (() => {
      const pts = [];
      for (let k = 0; k < 12; k++) {
        const angle = -Math.PI / 2 + k * (2 * Math.PI / 12);
        const r = k % 2 === 0 ? 0.42 : 0.22;
        pts.push([0.5 + r * Math.cos(angle), 0.5 + r * Math.sin(angle)]);
      }
      return pts;
    })() },
  { name: 'rocket', category: 'letters', minPoints: 14, vertices: [
      [0.5, 0.05], [0.62, 0.5], [0.88, 0.92], [0.58, 0.78], [0.42, 0.78], [0.12, 0.92], [0.38, 0.5]
    ] },
  { name: 'turtle', category: 'letters', minPoints: 14, vertices: [
      [0.05, 0.5], [0.22, 0.4], [0.35, 0.18], [0.65, 0.18], [0.85, 0.4], [0.7, 0.52],
      [0.95, 0.55], [0.7, 0.6], [0.6, 0.92], [0.5, 0.72], [0.3, 0.92], [0.22, 0.6]
    ] },
  { name: 'castle', category: 'letters', minPoints: 14, vertices: [
      [0.08, 0.9], [0.08, 0.45], [0.16, 0.45], [0.16, 0.35], [0.24, 0.35], [0.24, 0.45],
      [0.3, 0.45], [0.3, 0.65], [0.42, 0.65], [0.42, 0.3], [0.47, 0.3], [0.47, 0.18],
      [0.53, 0.18], [0.53, 0.3], [0.58, 0.3], [0.58, 0.65], [0.7, 0.65], [0.7, 0.45],
      [0.78, 0.45], [0.78, 0.35], [0.84, 0.35], [0.84, 0.45], [0.92, 0.45], [0.92, 0.9]
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
    // Most grades just get a single fixed sequence. Where config.levels is
    // given (Kindergarten's two Connect the Dots games), a small toggle lets
    // a student who's ready go past the grade's default range — 10 to 20,
    // or A–J to A–Z — without needing a whole separate tile on the shelf.
    let sequence = config.sequence || [];
    const hasLevels = Array.isArray(config.levels) && config.levels.length > 1;

    container.innerHTML = `
      ${hasLevels ? '<div class="toolbar level-picker" aria-label="Choose a range"></div>' : ''}
      <div class="stage" aria-label="Connect the dots stage" style="min-height:560px;"></div>
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
      // "New picture" actually changes the picture. Two filters narrow the
      // pool: category keeps the numbers game and the letters game drawing
      // from entirely separate shapes (so playing both never repeats a
      // picture), and minPoints excludes shapes whose thin details would
      // collapse into a blob on a short sequence (like Kindergarten's 10 dots).
      const category = /^[0-9]+$/.test(String(sequence[0])) ? 'numbers' : 'letters';
      const eligibleShapes = CONNECT_DOTS_SHAPES.filter(s =>
        s.category === category && (!s.minPoints || sequence.length >= s.minPoints)
      );
      const shape = eligibleShapes[Math.floor(Math.random() * eligibleShapes.length)];
      const rawPoints = resampleClosedPolygon(shape.vertices, sequence.length);

      // Fit the normalized 0–1 shape into the stage, using nearly the whole
      // area (just enough padding to keep dot circles from clipping at the
      // edges). A bigger shape means longer mouse travel between
      // consecutive dots — more fine-motor practice per click.
      const padX = Math.max(24, w * 0.05);
      const padY = Math.max(24, h * 0.05);
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

    function startNewRound() {
      nextIndex = 0;
      svg.innerHTML = '';
      stage.querySelectorAll('div').forEach(d => d.remove()); // clear any reveal sticker
      layout();
      render();
      status.textContent = sequence.length ? `Click ${positions[0].label} to start.` : '';
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `<button type="button" class="restart-btn">🔄 New picture</button>`;
    container.insertBefore(toolbar, stage);
    toolbar.querySelector('.restart-btn').addEventListener('click', startNewRound);

    if (hasLevels) {
      const levelPicker = container.querySelector('.level-picker');
      levelPicker.innerHTML = '<span style="font-weight:700; margin-right:4px;">Range:</span>';
      config.levels.forEach((level, i) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = level.label;
        if (level.sequence === sequence || (i === 0 && !levelPicker.querySelector('.active'))) {
          btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
          sequence = level.sequence;
          levelPicker.querySelectorAll('button').forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          startNewRound();
        });
        levelPicker.appendChild(btn);
      });
    }

    // Give the stage a moment to receive real layout dimensions.
    requestAnimationFrame(() => {
      layout();
      render();
      status.textContent = sequence.length ? `Click ${sequence[0]} to start.` : '';
    });
  }
};
