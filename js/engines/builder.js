/* Builder engine
   Practices: selecting an item, dragging it, and dropping it in a chosen spot
   (Make a House, Make a Cake, Make a Pizza, Make a Face, Make a Robot,
   Make a Backpack, Create a Car, Make a Treehouse, Pumpkin Carving,
   Make a Christmas Tree, Make a Gingerbread House — and, in "unlimited"
   sandbox mode, 100 Snowballs!)

   config = {
     sceneEmoji: '🏠',            // big background motif drawn on the stage
     sceneImage: 'assets/x.png',  // OR a real image file, takes priority
                                   // over sceneEmoji if both are given
     sceneLabel: 'house',
     items: [{ id, emoji, label }],
     // An item can use `html` (a small inline SVG string) instead of
     // `emoji`, for a shape no emoji covers well — like a striped birthday
     // candle. If the SVG uses <pattern>/<clipPath> ids, write them as
     // __UID__yourname in the markup; builder.js swaps __UID__ for a fresh
     // unique value each time an instance renders, so multiple placed
     // copies never collide.
     maxPlacements: 14,           // omit or set unlimited:true for a sandbox
     unlimited: false,
     repeatable: true             // can the same tray item be placed more than once?
   }
*/
let _builderSvgUidCounter = 0;
/** Fills `el` with an item's visual — its custom SVG (item.html) if given,
    otherwise its plain emoji character. sizePx (optional) sets an explicit
    box size, needed for SVG content since it doesn't scale via font-size. */
function renderItemVisual(el, item, sizePx) {
  if (item.html) {
    const uid = 'bsvg' + (_builderSvgUidCounter++);
    el.innerHTML = item.html.replace(/__UID__/g, uid);
    el.style.display = 'inline-flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    if (sizePx) {
      el.style.width = sizePx + 'px';
      el.style.height = sizePx + 'px';
    }
  } else {
    el.textContent = item.emoji;
  }
}

const BuilderEngine = {
  mount(container, config, api) {
    const items = config.items || [];
    const unlimited = !!config.unlimited;
    const cap = config.maxPlacements || 14;

    container.innerHTML = `
      <div class="tray" role="list" aria-label="Decorations to drag onto the scene"></div>
      <div class="stage" aria-label="${config.sceneLabel || 'scene'} stage"></div>
      <p class="status-line"></p>
    `;

    const tray = container.querySelector('.tray');
    const stage = container.querySelector('.stage');
    const status = container.querySelector('.status-line');

    // Big faint background motif so the stage doesn't feel empty — a real
    // image (sceneImage) if one is given, otherwise a big emoji character.
    if (config.sceneImage) {
      const bg = document.createElement('img');
      bg.src = config.sceneImage;
      bg.alt = '';
      bg.style.position = 'absolute';
      bg.style.left = '50%';
      bg.style.top = '54%';
      bg.style.transform = 'translate(-50%, -50%)';
      bg.style.width = 'min(60vw, 320px)';
      bg.style.height = 'auto';
      bg.style.opacity = '0.16';
      bg.style.pointerEvents = 'none';
      bg.style.userSelect = 'none';
      stage.appendChild(bg);
    } else if (config.sceneEmoji) {
      const bg = document.createElement('div');
      bg.textContent = config.sceneEmoji;
      bg.style.position = 'absolute';
      bg.style.left = '50%';
      bg.style.top = '54%';
      bg.style.transform = 'translate(-50%, -50%)';
      bg.style.fontSize = 'min(60vw, 320px)';
      bg.style.opacity = '0.12';
      bg.style.pointerEvents = 'none';
      bg.style.userSelect = 'none';
      stage.appendChild(bg);
    }

    // Tapping empty stage space (not any placed item) deselects everything,
    // hiding all resize handles.
    stage.addEventListener('pointerdown', (ev) => {
      if (ev.target === stage) {
        stage.querySelectorAll('.placed-item.selected').forEach(n => n.classList.remove('selected'));
      }
    });

    let placedCount = 0;

    function updateStatus() {
      if (unlimited) {
        status.textContent = `Placed ${placedCount} of ${cap}. ${
          placedCount >= cap ? "That's the limit — try Clear to start a new build!" : 'Keep building!'
        }`;
      } else {
        status.textContent = `Placed ${placedCount} decoration${placedCount === 1 ? '' : 's'}. Drag more from the tray, or press Clear to start over.`;
      }
    }

    function placeItem(item, clientX, clientY) {
      if (placedCount >= cap) {
        status.textContent = "That's the limit for this scene! Press Clear to start over.";
        return;
      }
      const stageRect = stage.getBoundingClientRect();
      const el = document.createElement('div');
      el.className = 'placed-item';
      const x = clientX - stageRect.left - 20;
      const y = clientY - stageRect.top - 20;
      el.style.left = Math.max(0, x) + 'px';
      el.style.top = Math.max(0, y) + 'px';

      // The emoji lives in its own inner span so we can resize just the
      // emoji (via font-size) without resizing the drag/resize hit-areas.
      let size = 40; // starting size in px
      const emojiSpan = document.createElement('span');
      emojiSpan.className = 'placed-item-emoji';
      emojiSpan.style.fontSize = size + 'px';
      renderItemVisual(emojiSpan, item, item.html ? size : null);
      el.appendChild(emojiSpan);

      // A small drag handle in the corner lets kids resize the piece after
      // placing it — bigger to make it stand out, smaller to fit more in.
      const handle = document.createElement('div');
      handle.className = 'resize-handle';
      handle.setAttribute('aria-label', 'Drag to resize');
      handle.innerHTML = '⤡';
      el.appendChild(handle);

      stage.appendChild(el);

      // Only the "selected" piece shows its resize handle — otherwise every
      // placed item would keep a permanent blue dot stuck to it. Placing a
      // new item selects it (and deselects everything else); tapping empty
      // stage space (handled below) clears the selection entirely.
      function selectThis() {
        stage.querySelectorAll('.placed-item.selected').forEach(n => n.classList.remove('selected'));
        el.classList.add('selected');
      }
      selectThis();

      makeDraggable(el, stage, {
        bounds: true,
        onStart: selectThis,
        // Two quick taps remove a placed piece. Implemented via the drag
        // helper's own tap detection rather than a native 'dblclick'
        // listener, since preventDefault() on pointerdown (needed for
        // smooth dragging) can unreliably suppress the browser's
        // synthesized click/dblclick in some browsers/input types.
        onDoubleTap: () => { el.remove(); placedCount--; updateStatus(); }
      });

      handle.addEventListener('pointerdown', (ev) => {
        ev.stopPropagation(); // don't also trigger the item's own drag-to-move
        ev.preventDefault();
        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const startDist = Math.hypot(ev.clientX - centerX, ev.clientY - centerY) || 1;
        const startSize = size;

        function move(mv) {
          const dist = Math.hypot(mv.clientX - centerX, mv.clientY - centerY);
          size = Math.max(20, Math.min(140, startSize * (dist / startDist)));
          emojiSpan.style.fontSize = size + 'px';
          if (item.html) {
            emojiSpan.style.width = size + 'px';
            emojiSpan.style.height = size + 'px';
          }
        }
        function up() {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
        }
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      });
      placedCount++;
      updateStatus();
      if (api && api.onProgress) api.onProgress({ placedCount, cap });
    }

    items.forEach(item => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'tray-item';
      renderItemVisual(el, item, item.html ? 40 : null);
      el.title = item.label;
      el.setAttribute('aria-label', item.label);
      tray.appendChild(el);

      // Tray items: click-to-drop-in-center (keyboard/click friendly) AND
      // press-drag straight from the tray onto the stage.
      let dragGhost = null;
      el.addEventListener('pointerdown', (ev) => {
        if (ev.button !== undefined && ev.button !== 0) return;
        ev.preventDefault();
        dragGhost = document.createElement('div');
        dragGhost.className = 'placed-item';
        renderItemVisual(dragGhost, item, item.html ? 40 : null);
        dragGhost.style.position = 'fixed';
        dragGhost.style.left = ev.clientX - 20 + 'px';
        dragGhost.style.top = ev.clientY - 20 + 'px';
        dragGhost.style.pointerEvents = 'none';
        dragGhost.style.zIndex = '999';
        document.body.appendChild(dragGhost);

        function move(mv) {
          dragGhost.style.left = mv.clientX - 20 + 'px';
          dragGhost.style.top = mv.clientY - 20 + 'px';
        }
        function up(uv) {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
          const stageRect = stage.getBoundingClientRect();
          if (
            uv.clientX >= stageRect.left && uv.clientX <= stageRect.right &&
            uv.clientY >= stageRect.top && uv.clientY <= stageRect.bottom
          ) {
            placeItem(item, uv.clientX, uv.clientY);
          }
          dragGhost.remove();
          dragGhost = null;
        }
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      });

      // Fallback for keyboard users: click places it in the middle of the stage.
      el.addEventListener('click', () => {
        const r = stage.getBoundingClientRect();
        placeItem(item, r.left + r.width / 2, r.top + r.height / 2);
      });
    });

    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `<button type="button" class="clear-btn">🧹 Clear scene</button>`;
    container.insertBefore(toolbar, tray);
    toolbar.querySelector('.clear-btn').addEventListener('click', () => {
      stage.querySelectorAll('.placed-item').forEach(n => n.remove());
      placedCount = 0;
      updateStatus();
    });

    updateStatus();
  }
};
