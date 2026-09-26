/* Geography puzzle engine (simplified "USA Geography Puzzle")
   Practices: dragging and placing a shape precisely at a specific target spot.
   Note: uses simplified blob/label pieces at approximate relative positions
   rather than cartographically exact state outlines, to keep the focus on
   the mouse-control skill.

   config = {
     states: [{ id, label, x, y }],   // x/y target position, in % of the map
     tolerancePx: 40
   }
*/
const GeoMapEngine = {
  mount(container, config, api) {
    const states = config.states || [];
    const tolerancePx = config.tolerancePx || 40;
    let placedCount = 0;

    container.innerHTML = `
      <div class="toolbar"><span>🗺️ Drag each state to its home on the map.</span></div>
      <div class="tray" aria-label="States to place"></div>
      <div class="stage" style="min-height:420px; background:#eaf6fc;" aria-label="Map of the United States (simplified)"></div>
      <p class="status-line"></p>
    `;

    const tray = container.querySelector('.tray');
    const stage = container.querySelector('.stage');
    const status = container.querySelector('.status-line');

    // A soft, simplified country outline so the stage reads as "a map".
    const outline = document.createElement('div');
    outline.style.position = 'absolute';
    outline.style.inset = '8%';
    outline.style.border = '3px dashed #4FA8D8';
    outline.style.borderRadius = '38% 32% 30% 34% / 40% 30% 40% 30%';
    outline.style.pointerEvents = 'none';
    stage.appendChild(outline);

    states.forEach(state => {
      // Faint target marker
      const marker = document.createElement('div');
      marker.style.position = 'absolute';
      marker.style.left = state.x + '%';
      marker.style.top = state.y + '%';
      marker.style.width = '10px';
      marker.style.height = '10px';
      marker.style.borderRadius = '50%';
      marker.style.background = 'rgba(232,93,76,0.35)';
      marker.style.transform = 'translate(-50%, -50%)';
      marker.style.pointerEvents = 'none';
      stage.appendChild(marker);

      const tile = document.createElement('div');
      tile.className = 'tray-item';
      tile.style.fontSize = '0.85rem';
      tile.style.fontWeight = '800';
      tile.textContent = state.label;
      tile.dataset.stateId = state.id;
      tray.appendChild(tile);

      tile.addEventListener('pointerdown', (ev) => {
        if (ev.button !== undefined && ev.button !== 0) return;
        ev.preventDefault();
        const ghost = tile.cloneNode(true);
        ghost.style.position = 'fixed';
        ghost.style.zIndex = '999';
        ghost.style.pointerEvents = 'none';
        ghost.style.left = ev.clientX - 30 + 'px';
        ghost.style.top = ev.clientY - 20 + 'px';
        document.body.appendChild(ghost);
        function move(mv) {
          ghost.style.left = mv.clientX - 30 + 'px';
          ghost.style.top = mv.clientY - 20 + 'px';
        }
        function up(uv) {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
          ghost.remove();
          const r = stage.getBoundingClientRect();
          const targetX = r.left + (state.x / 100) * r.width;
          const targetY = r.top + (state.y / 100) * r.height;
          const dist = Math.hypot(uv.clientX - targetX, uv.clientY - targetY);
          if (dist <= tolerancePx) {
            marker.style.background = '#2F5D50';
            const placedLabel = document.createElement('div');
            placedLabel.textContent = state.label;
            placedLabel.style.position = 'absolute';
            placedLabel.style.left = state.x + '%';
            placedLabel.style.top = state.y + '%';
            placedLabel.style.transform = 'translate(-50%, -50%)';
            placedLabel.style.background = '#2F5D50';
            placedLabel.style.color = '#FBF6EC';
            placedLabel.style.fontWeight = '800';
            placedLabel.style.fontSize = '0.75rem';
            placedLabel.style.padding = '3px 7px';
            placedLabel.style.borderRadius = '8px';
            stage.appendChild(placedLabel);
            tile.remove();
            placedCount++;
            status.textContent = placedCount === states.length
              ? '🎉 Every state found its home!'
              : `${placedCount} of ${states.length} placed.`;
          } else {
            status.textContent = `Close, but ${state.label} lives somewhere else — try again.`;
          }
        }
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      });
    });

    status.textContent = `0 of ${states.length} placed.`;
  }
};
