/* Pixel Art engine
   Practices: targeted, repeated click-and-drag precision across a fine grid.
   config = { gridSize: 12, colors: [...] }
*/
const PixelArtEngine = {
  mount(container, config, api) {
    const gridSize = config.gridSize || 12;
    const colors = config.colors || ['#2B2621', '#E85D4C', '#F4A825', '#4FA8D8', '#8E6BB0', '#2F5D50', '#FBF6EC'];
    let color = colors[0];
    let painting = false;
    let eraseMode = false;

    container.innerHTML = `
      <div class="toolbar">
        <span class="swatches"></span>
        <button type="button" class="erase-btn">🧽 Eraser</button>
        <button type="button" class="clear-btn">🧹 Clear all</button>
      </div>
      <div class="pixel-grid" role="grid" aria-label="Pixel art grid"></div>
      <p class="status-line">Click, or click-and-drag, to color in squares.</p>
    `;

    const swatchesEl = container.querySelector('.swatches');
    const grid = container.querySelector('.pixel-grid');
    grid.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
    grid.style.gridTemplateRows = `repeat(${gridSize}, 1fr)`;

    colors.forEach(c => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'swatch' + (c === color ? ' active' : '');
      b.style.background = c;
      b.addEventListener('click', () => {
        color = c;
        eraseMode = false;
        container.querySelector('.erase-btn').classList.remove('active');
        swatchesEl.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
        b.classList.add('active');
      });
      swatchesEl.appendChild(b);
    });

    const eraseBtn = container.querySelector('.erase-btn');
    eraseBtn.addEventListener('click', () => {
      eraseMode = !eraseMode;
      eraseBtn.classList.toggle('active', eraseMode);
    });

    for (let i = 0; i < gridSize * gridSize; i++) {
      const cell = document.createElement('div');
      cell.className = 'pixel-cell';
      cell.addEventListener('pointerdown', (ev) => {
        painting = true;
        cell.style.background = eraseMode ? '#fff' : color;
        ev.preventDefault();
      });
      cell.addEventListener('pointerenter', () => {
        if (painting) cell.style.background = eraseMode ? '#fff' : color;
      });
      grid.appendChild(cell);
    }
    window.addEventListener('pointerup', () => { painting = false; });

    container.querySelector('.clear-btn').addEventListener('click', () => {
      grid.querySelectorAll('.pixel-cell').forEach(c => c.style.background = '#fff');
    });
  }
};
