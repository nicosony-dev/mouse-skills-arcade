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

   NOTE: every shape below was verified by plotting its vertices as a closed
   polygon (see the verification script used to build this) before being
   added to the pool — several of the original detailed shapes (sailboat,
   sun-rays, fish, butterfly, flower, rocket, turtle, tree, leaf, and the
   house's chimney) didn't actually resemble their names once rendered and
   were redrawn from scratch with corrected coordinates.
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

/** N evenly-spaced pointed rays around a circle: each ray is a base point on
    the inner circle followed by a tip point at the outer radius, centered
    between that base and the next one. Wider/fewer rays (default 8) survive
    resampling down to as few as 14 dots without collapsing into a lumpy
    gear the way many thin rays did in the original version. */
function sunRaysVertices(numRays = 8, cx = 0.5, cy = 0.5, innerR = 0.3, outerR = 0.46) {
  const pts = [];
  for (let k = 0; k < numRays; k++) {
    const baseAngle = -Math.PI / 2 + k * (2 * Math.PI / numRays);
    const nextAngle = -Math.PI / 2 + (k + 1) * (2 * Math.PI / numRays);
    const midAngle = (baseAngle + nextAngle) / 2;
    pts.push([cx + innerR * Math.cos(baseAngle), cy + innerR * Math.sin(baseAngle)]);
    pts.push([cx + outerR * Math.cos(midAngle), cy + outerR * Math.sin(midAngle)]);
  }
  return pts;
}

/** N petals, each drawn as valley -> tip-left -> tip-right so the tip is a
    short flat edge instead of a single sharp point — reads as a rounded
    petal instead of a star point once connected. */
function flowerVertices(numPetals = 6, cx = 0.5, cy = 0.5, innerR = 0.2, outerR = 0.42, tipSpreadDeg = 10) {
  const pts = [];
  const spread = tipSpreadDeg * Math.PI / 180;
  for (let k = 0; k < numPetals; k++) {
    const valleyAngle = -Math.PI / 2 + k * (2 * Math.PI / numPetals);
    const centerAngle = valleyAngle + (Math.PI / numPetals);
    pts.push([cx + innerR * Math.cos(valleyAngle), cy + innerR * Math.sin(valleyAngle)]);
    pts.push([cx + outerR * Math.cos(centerAngle - spread), cy + outerR * Math.sin(centerAngle - spread)]);
    pts.push([cx + outerR * Math.cos(centerAngle + spread), cy + outerR * Math.sin(centerAngle + spread)]);
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
      // Elongated pointed oval: tip at top, stem point at bottom.
      [0.5, 0.05], [0.75, 0.25], [0.85, 0.5], [0.72, 0.75],
      [0.5, 0.95], [0.28, 0.75], [0.15, 0.5], [0.25, 0.25]
    ] },
  // ---- numbers "challenge" shapes (join the pool once a round has 14+
  // dots, i.e. Grade 1's default 20-dot round and Kindergarten's 1–20
  // challenge toggle) ----
  { name: 'tree', category: 'numbers', minPoints: 14, vertices: [
      // 3-tier fir/pine tree over a trunk (was previously a plain arrow).
      [0.5, 0.05],
      [0.65, 0.28], [0.55, 0.28],
      [0.75, 0.5], [0.6, 0.5],
      [0.88, 0.72], [0.58, 0.72], [0.58, 0.92], [0.42, 0.92], [0.42, 0.72],
      [0.12, 0.72], [0.4, 0.5], [0.25, 0.5], [0.45, 0.28], [0.35, 0.28]
    ] },
  { name: 'sailboat', category: 'numbers', minPoints: 14, vertices: [
      // Triangular sail on a trapezoid hull; the hull "steps out" past the
      // sail's base corners so the deck reads as a distinct line under it.
      [0.55, 0.08], [0.75, 0.65], [0.85, 0.7], [0.78, 0.9],
      [0.22, 0.9], [0.15, 0.7], [0.35, 0.65]
    ] },
  { name: 'house-chimney', category: 'numbers', minPoints: 14, vertices: [
      // Chimney is a clean rectangular notch cut into the roofline.
      [0.15, 0.9], [0.85, 0.9], [0.85, 0.5], [0.71, 0.39], [0.71, 0.2],
      [0.63, 0.2], [0.63, 0.33], [0.5, 0.15], [0.15, 0.5]
    ] },
  { name: 'sun-rays', category: 'numbers', minPoints: 14, vertices: sunRaysVertices() },
  { name: 'fish', category: 'numbers', minPoints: 14, vertices: [
      // Rounder body with a dorsal fin bump, a belly fin bump, and a clear
      // forked tail (was reading as a dart/arrow before).
      [0.05, 0.5], [0.22, 0.32], [0.48, 0.2], [0.6, 0.35], [0.95, 0.22],
      [0.75, 0.5], [0.95, 0.78], [0.6, 0.65], [0.48, 0.8], [0.22, 0.68]
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
      // Big upper wings, smaller lower wings, short tail. NOTE: still the
      // weakest shape in the set — with only 10 straight-line points it
      // reads more like a bowtie/moth silhouette than a rounded butterfly.
      // Bump this shape to ~16 points (see flowerVertices/sunRaysVertices
      // for the pattern) if a more convincing butterfly is needed.
      [0.5, 0.15],
      [0.88, 0.28], [0.58, 0.42],
      [0.8, 0.58], [0.53, 0.58],
      [0.5, 0.7],
      [0.47, 0.58], [0.2, 0.58],
      [0.42, 0.42], [0.12, 0.28]
    ] },
  { name: 'flower', category: 'letters', minPoints: 14, vertices: flowerVertices() },
  { name: 'rocket', category: 'letters', minPoints: 14, vertices: [
      // Nose cone -> body -> flared fin -> pinch back in -> flat exhaust,
      // mirrored on the other side. No crossing lines.
      [0.5, 0.05], [0.62, 0.45], [0.85, 0.75], [0.62, 0.65],
      [0.58, 0.9], [0.42, 0.9], [0.38, 0.65], [0.15, 0.75], [0.38, 0.45]
    ] },
  { name: 'turtle', category: 'letters', minPoints: 14, vertices: [
      // Head, domed shell, tail, two simple leg bumps (was an unrecognizable
      // jagged blob before — simplified rather than over-detailed).
      [0.05, 0.5], [0.22, 0.22], [0.72, 0.22], [0.95, 0.5], [0.75, 0.65],
      [0.6, 0.88], [0.5, 0.68], [0.35, 0.88], [0.22, 0.65]
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
