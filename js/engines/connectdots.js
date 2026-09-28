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

/* =========================================================================
   REUSABLE K-2 SKILL: double-click to enlarge a picture.
   Not specific to Connect the Dots — drop `attachEnlargeOnDoubleClick` into
   any web app (the escape room, the attendance app, etc.) wherever a small
   picture should pop up bigger on double-click.

   Usage:
     attachEnlargeOnDoubleClick(someSmallElement, {
       buildEnlargedHTML: () => '<img src="...">',   // or any HTML string
       label: 'A sailboat'                             // optional caption
     });

   Behavior:
   - Double-click (or double-tap) the small element opens it full-size in a
     centered overlay.
   - Kids can close it by double-clicking the enlarged picture again, by
     tapping the big ✖ button, by tapping the dark background, or by
     pressing Escape — several easy ways out, since K-2 kids won't all
     discover the same one.
   - A small pulsing 🔍 badge sits on the corner of every enlargeable
     thumbnail as a visual hint, since "double-click" isn't very
     discoverable for this age group on its own.
========================================================================= */
function attachEnlargeOnDoubleClick(smallEl, { buildEnlargedHTML, label = '' }) {
  smallEl.style.cursor = 'zoom-in';
  smallEl.style.position = smallEl.style.position || 'relative';
  smallEl.setAttribute('title', 'Double-click to make it bigger!');

  // Small pulsing magnifying-glass hint badge.
  const badge = document.createElement('div');
  badge.textContent = '🔍';
  badge.setAttribute('aria-hidden', 'true');
  Object.assign(badge.style, {
    position: 'absolute', right: '-6px', bottom: '-6px',
    fontSize: '18px', background: '#fff', borderRadius: '50%',
    width: '26px', height: '26px', display: 'flex',
    alignItems: 'center', justifyContent: 'center',
    boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
    animation: 'enlargeHintPulse 1.6s ease-in-out infinite'
  });
  smallEl.appendChild(badge);

  if (!document.getElementById('enlarge-hint-style')) {
    const style = document.createElement('style');
    style.id = 'enlarge-hint-style';
    style.textContent = `
      @keyframes enlargeHintPulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15); }
      }
    `;
    document.head.appendChild(style);
  }

  function openOverlay() {
    const overlay = document.createElement('div');
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-label', label || 'Enlarged picture');
    Object.assign(overlay.style, {
      position: 'fixed', inset: '0', background: 'rgba(0,0,0,0.6)',
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', zIndex: '9999', padding: '24px'
    });

    const card = document.createElement('div');
    Object.assign(card.style, {
      background: '#fff', borderRadius: '20px', padding: '24px',
      maxWidth: '90vw', maxHeight: '85vh', display: 'flex',
      flexDirection: 'column', alignItems: 'center', gap: '12px',
      boxShadow: '0 8px 30px rgba(0,0,0,0.35)'
    });
    card.innerHTML = buildEnlargedHTML();
    card.style.cursor = 'zoom-out';

    if (label) {
      const caption = document.createElement('p');
      caption.textContent = label;
      Object.assign(caption.style, { fontSize: '22px', fontWeight: '700', margin: '0' });
      card.appendChild(caption);
    }

    const closeBtn = document.createElement('button');
    closeBtn.type = 'button';
    closeBtn.textContent = '✖ Close';
    Object.assign(closeBtn.style, {
      fontSize: '18px', padding: '10px 20px', borderRadius: '12px',
      border: 'none', background: '#e74c3c', color: '#fff',
      cursor: 'pointer', fontWeight: '700'
    });
    card.appendChild(closeBtn);

    overlay.appendChild(card);
    document.body.appendChild(overlay);

    function close() { overlay.remove(); document.removeEventListener('keydown', onKey); }
    function onKey(e) { if (e.key === 'Escape') close(); }

    card.addEventListener('dblclick', close);
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', onKey);
  }

  smallEl.addEventListener('dblclick', openOverlay);
}

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
      [0.5, 0.05], [0.75, 0.25], [0.85, 0.5], [0.72, 0.75],
      [0.5, 0.95], [0.28, 0.75], [0.15, 0.5], [0.25, 0.25]
    ] },
  { name: 'tree', category: 'numbers', minPoints: 14, vertices: [
      [0.5, 0.05],
      [0.65, 0.28], [0.55, 0.28],
      [0.75, 0.5], [0.6, 0.5],
      [0.88, 0.72], [0.58, 0.72], [0.58, 0.92], [0.42, 0.92], [0.42, 0.72],
      [0.12, 0.72], [0.4, 0.5], [0.25, 0.5], [0.45, 0.28], [0.35, 0.28]
    ] },
  { name: 'sailboat', category: 'numbers', minPoints: 14, vertices: [
      [0.55, 0.08], [0.75, 0.65], [0.85, 0.7], [0.78, 0.9],
      [0.22, 0.9], [0.15, 0.7], [0.35, 0.65]
    ] },
  { name: 'house-chimney', category: 'numbers', minPoints: 14, vertices: [
      [0.15, 0.9], [0.85, 0.9], [0.85, 0.5], [0.71, 0.39], [0.71, 0.2],
      [0.63, 0.2], [0.63, 0.33], [0.5, 0.15], [0.15, 0.5]
    ] },
  { name: 'sun-rays', category: 'numbers', minPoints: 14, vertices: sunRaysVertices() },
  { name: 'fish', category: 'numbers', minPoints: 14, vertices: [
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
  { name: 'butterfly', category: 'letters', minPoints: 14, vertices: [
      [0.5, 0.15],
      [0.88, 0.28], [0.58, 0.42],
      [0.8, 0.58], [0.53, 0.58],
      [0.5, 0.7],
      [0.47, 0.58], [0.2, 0.58],
      [0.42, 0.42], [0.12, 0.28]
    ] },
  { name: 'flower', category: 'letters', minPoints: 14, vertices: flowerVertices() },
  { name: 'rocket', category: 'letters', minPoints: 14, vertices: [
      [0.5, 0.05], [0.62, 0.45], [0.85, 0.75], [0.62, 0.65],
      [0.58, 0.9], [0.42, 0.9], [0.38, 0.65], [0.15, 0.75], [0.38, 0.45]
    ] },
  { name: 'turtle', category: 'letters', minPoints: 14, vertices: [
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

// Friendly display names + a fill color for the "here's what you made"
// reveal picture, keyed by the shape's internal name.
const SHAPE_DISPLAY = {
  star: { label: 'Star', color: '#FFC145' },
  house: { label: 'House', color: '#E08E45' },
  sun: { label: 'Sun', color: '#FFC145' },
  triangle: { label: 'Triangle', color: '#7FB3D5' },
  leaf: { label: 'Leaf', color: '#6FCF97' },
  tree: { label: 'Tree', color: '#4F8F58' },
  sailboat: { label: 'Sailboat', color: '#5DADE2' },
  'house-chimney': { label: 'House', color: '#E08E45' },
  'sun-rays': { label: 'Sun', color: '#FFC145' },
  fish: { label: 'Fish', color: '#F2994A' },
  heart: { label: 'Heart', color: '#EB5757' },
  kite: { label: 'Kite', color: '#BB6BD9' },
  hexagon: { label: 'Hexagon', color: '#56CCF2' },
  pentagon: { label: 'Pentagon', color: '#9B51E0' },
  egg: { label: 'Egg', color: '#F2C94C' },
  butterfly: { label: 'Butterfly', color: '#F2994A' },
  flower: { label: 'Flower', color: '#EB5757' },
  rocket: { label: 'Rocket', color: '#5DADE2' },
  turtle: { label: 'Turtle', color: '#27AE60' },
  castle: { label: 'Castle', color: '#9B51E0' }
};

/** Builds a filled SVG (as an HTML string) of a shape's vertices, for the
    "here's your finished picture" reveal — same outline the child just
    traced, but solid and colored instead of dot-and-line. */
function buildFilledShapeSVG(vertices, color, sizePx) {
  const path = vertices.map(([x, y], i) =>
    `${i === 0 ? 'M' : 'L'} ${(x * 100).toFixed(1)},${(y * 100).toFixed(1)}`
  ).join(' ') + ' Z';
  return `
    <svg viewBox="0 0 100 100" width="${sizePx}" height="${sizePx}" xmlns="http://www.w3.org/2000/svg">
      <path d="${path}" fill="${color}" stroke="#2F5D50" stroke-width="2" stroke-linejoin="round"/>
    </svg>`;
}

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
    let sequence = config.sequence || [];
    const hasLevels = Array.isArray(config.levels) && config.levels.length > 1;

    container.innerHTML = `
      ${hasLevels ? '<div class="toolbar level-picker" aria-label="Choose a range"></div>' : ''}
      <div class="stage" aria-label="Connect the dots stage" style="min-height:560px; position:relative;"></div>
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
    let currentShape = null;

    function layout() {
      const w = stage.clientWidth || 600;
      const h = stage.clientHeight || 440;
      const category = /^[0-9]+$/.test(String(sequence[0])) ? 'numbers' : 'letters';
      const eligibleShapes = CONNECT_DOTS_SHAPES.filter(s =>
        s.category === category && (!s.minPoints || sequence.length >= s.minPoints)
      );
      currentShape = eligibleShapes[Math.floor(Math.random() * eligibleShapes.length)];
      const rawPoints = resampleClosedPolygon(currentShape.vertices, sequence.length);

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

    function showRevealCard() {
      stage.querySelectorAll('.reveal-card').forEach(el => el.remove());
      const display = SHAPE_DISPLAY[currentShape.name] || { label: currentShape.name, color: '#2F5D50' };

      const card = document.createElement('div');
      card.className = 'reveal-card';
      Object.assign(card.style, {
        position: 'absolute', top: '12px', left: '50%', transform: 'translateX(-50%)',
        background: '#fff', borderRadius: '16px', padding: '10px 16px',
        display: 'flex', alignItems: 'center', gap: '10px',
        boxShadow: '0 3px 12px rgba(0,0,0,0.25)', zIndex: '5'
      });
      card.innerHTML = `
        <span style="font-size:26px;">${config.revealEmoji || '⭐'}</span>
        <span style="display:inline-flex;">${buildFilledShapeSVG(currentShape.vertices, display.color, 56)}</span>
        <span style="font-weight:700; font-size:16px;">You made a ${display.label}!</span>
      `;
      stage.appendChild(card);

      // The small reveal picture itself is the enlargeable thumbnail.
      const thumb = card.querySelector('span:nth-child(2)');
      attachEnlargeOnDoubleClick(thumb, {
        buildEnlargedHTML: () => buildFilledShapeSVG(currentShape.vertices, display.color, 320),
        label: `You made a ${display.label}!`
      });
    }

    function handleClick(i) {
      if (i === nextIndex) {
        nextIndex++;
        const finished = nextIndex === sequence.length;
        drawLines(finished);
        render();
        if (finished) {
          status.innerHTML = `<span class="celebrate">🎉 All connected!</span>`;
          showRevealCard();
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
      stage.querySelectorAll('.reveal-card').forEach(el => el.remove());
      layout();
      render();
      status.textContent = sequence.length ? `Click ${positions[0].label} to start.` : '';
    }

    // NEXT button: bottom-right corner of the stage, not a full-width
    // toolbar above it.
    const nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'restart-btn';
    nextBtn.innerHTML = 'NEXT&nbsp;&#9654;';
    Object.assign(nextBtn.style, {
      position: 'absolute', right: '12px', bottom: '12px', zIndex: '5',
      fontSize: '16px', fontWeight: '700', padding: '10px 18px',
      borderRadius: '999px', border: 'none', cursor: 'pointer',
      background: '#2F5D50', color: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.25)'
    });
    nextBtn.addEventListener('click', startNewRound);
    stage.appendChild(nextBtn);

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

    requestAnimationFrame(() => {
      layout();
      render();
      status.textContent = sequence.length ? `Click ${sequence[0]} to start.` : '';
    });
  }
};
