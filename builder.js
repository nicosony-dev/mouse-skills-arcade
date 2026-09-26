/* Builder engine
   Practices: selecting an item, dragging it, and dropping it in a chosen spot
   (Make a House, Make a Cake, Make a Pizza, Make a Face, Make a Robot,
   Make a Backpack, Create a Car, Make a Treehouse, Pumpkin Carving,
   Make a Christmas Tree, Make a Gingerbread House — and, in "unlimited"
   sandbox mode, 100 Snowballs!)

   config = {
     sceneEmoji: '🏠',            // big background motif drawn on the stage
     sceneLabel: 'house',
     items: [{ id, emoji, label }],
     maxPlacements: 14,           // omit or set unlimited:true for a sandbox
     unlimited: false,
     repeatable: true             // can the same tray item be placed more than once?
   }
*/
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

    // Big faint background motif so the stage doesn't feel empty.
    if (config.sceneEmoji) {
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

    function placeItem(sourceEl, clientX, clientY) {
      if (placedCount >= cap) {
        status.textContent = "That's the limit for this scene! Press Clear to start over.";
        return;
      }
      const stageRect = stage.getBoundingClientRect();
      const el = document.createElement('div');
      el.className = 'placed-item';
      el.textContent = sourceEl.dataset.emoji;
      const x = clientX - stageRect.left - 20;
      const y = clientY - stageRect.top - 20;
      el.style.left = Math.max(0, x) + 'px';
      el.style.top = Math.max(0, y) + 'px';
      stage.appendChild(el);
      makeDraggable(el, stage, { bounds: true });
      // Double-click / double-tap removes a placed piece.
      el.addEventListener('dblclick', () => { el.remove(); placedCount--; updateStatus(); });
      placedCount++;
      updateStatus();
      if (api && api.onProgress) api.onProgress({ placedCount, cap });
    }

    items.forEach(item => {
      const el = document.createElement('button');
      el.type = 'button';
      el.className = 'tray-item';
      el.textContent = item.emoji;
      el.dataset.emoji = item.emoji;
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
        dragGhost.textContent = item.emoji;
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
            placeItem(el, uv.clientX, uv.clientY);
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
        placeItem(el, r.left + r.width / 2, r.top + r.height / 2);
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
