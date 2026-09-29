/* Tangram engine
   Practices: dragging AND rotating a shape to fit a precise target position.

   config = {
     pieces: [
       { id, shape: 'triLg'|'triMd'|'triSm'|'square'|'parallelogram',
         color, target: { x, y, rotation } }  // target in % of stage size
     ],
     tolerancePx: 34,
     toleranceDeg: 20
   }
   Pieces start scattered around the edges of the stage; dragging moves them,
   clicking rotates them 45°. When a piece is close enough (position + angle)
   to its target, it snaps and locks green.
*/
const TangramEngine = {
  mount(container, config, api) {
    const pieces = config.pieces || [];
    const tolerancePx = config.tolerancePx || 34;
    const toleranceDeg = config.toleranceDeg || 20;

    container.innerHTML = `
      <div class="toolbar">
        <span>🔺 Drag each shape onto its shadow. Click a shape to rotate it.</span>
        <button type="button" class="restart-btn">🔄 Shuffle pieces</button>
      </div>
      <div class="stage" style="min-height:460px;"></div>
      <p class="status-line"></p>
    `;
    const stage = container.querySelector('.stage');
    const status = container.querySelector('.status-line');
    let lockedCount = 0;

    function shapeSvg(shape, color) {
      const shapes = {
        triLg: `<polygon points="0,0 100,0 0,100" fill="${color}"/>`,
        triMd: `<polygon points="0,0 70,0 0,70" fill="${color}"/>`,
        triSm: `<polygon points="0,0 50,0 0,50" fill="${color}"/>`,
        square: `<rect width="60" height="60" fill="${color}"/>`,
        parallelogram: `<polygon points="0,20 60,0 80,20 20,40" fill="${color}"/>`
      };
      return shapes[shape] || shapes.square;
    }

    function shapeSize(shape) {
      const sizes = {
        triLg: 100, triMd: 70, triSm: 50, square: 60, parallelogram: 80
      };
      return sizes[shape] || 60;
    }

    pieces.forEach((piece, idx) => {
      const size = shapeSize(piece.shape);
      // Target ghost (faded outline showing where it goes)
      const targetEl = document.createElement('div');
      targetEl.className = 'tangram-target';
      targetEl.style.left = piece.target.x + '%';
      targetEl.style.top = piece.target.y + '%';
      targetEl.style.width = size + 'px';
      targetEl.style.transform = `rotate(${piece.target.rotation}deg)`;
      targetEl.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${shapeSvg(piece.shape, '#2B2621')}</svg>`;
      stage.appendChild(targetEl);

      // Draggable piece, scattered around the edge to start
      const angle = (idx / pieces.length) * Math.PI * 2;
      const startX = 50 + Math.cos(angle) * 40;
      const startY = 50 + Math.sin(angle) * 40;
      let rotation = 0;
      const el = document.createElement('div');
      el.className = 'tangram-piece';
      el.style.left = `calc(${startX}% - ${size / 2}px)`;
      el.style.top = `calc(${startY}% - ${size / 2}px)`;
      el.style.width = size + 'px';
      el.dataset.locked = 'false';
      el.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${shapeSvg(piece.shape, piece.color)}</svg>`;
      stage.appendChild(el);

      function applyRotation() {
        el.style.transform = `rotate(${rotation}deg)`;
      }

      makeDraggable(el, stage, {
        onEnd: () => checkFit(),
        // A tap (press-and-release without dragging) rotates the piece
        // 45°. This is handled directly by the drag helper rather than a
        // native 'click' listener, since preventDefault() on pointerdown
        // (needed for smooth dragging) can unreliably suppress the
        // browser's synthesized click in some browsers/input types.
        onTap: () => {
          if (el.dataset.locked === 'true') return;
          rotation = (rotation + 45) % 360;
          applyRotation();
          checkFit();
        }
      });

      function checkFit() {
        if (el.dataset.locked === 'true') return;
        const stageRect = stage.getBoundingClientRect();
        const elRect = el.getBoundingClientRect();
        const elCenter = { x: elRect.left + elRect.width / 2 - stageRect.left, y: elRect.top + elRect.height / 2 - stageRect.top };
        const targetCenter = { x: (piece.target.x / 100) * stageRect.width, y: (piece.target.y / 100) * stageRect.height };
        const dist = Math.hypot(elCenter.x - targetCenter.x, elCenter.y - targetCenter.y);
        const angleDiff = Math.abs(((rotation - piece.target.rotation + 540) % 360) - 180);
        if (dist <= tolerancePx && angleDiff <= toleranceDeg) {
          // Snap exactly into place
          el.style.left = `calc(${piece.target.x}% - ${size / 2}px)`;
          el.style.top = `calc(${piece.target.y}% - ${size / 2}px)`;
          rotation = piece.target.rotation;
          applyRotation();
          el.dataset.locked = 'true';
          el.classList.add('locked');
          lockedCount++;
          status.textContent = lockedCount === pieces.length
            ? '🎉 Puzzle complete!'
            : `${lockedCount} of ${pieces.length} pieces placed.`;
        }
      }
    });

    container.querySelector('.restart-btn').addEventListener('click', () => {
      TangramEngine.mount(container, config, api);
    });

    status.textContent = `0 of ${pieces.length} pieces placed.`;
  }
};
