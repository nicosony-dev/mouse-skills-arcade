/* Sorter engine
   Practices: dragging an item precisely into one of several target zones.
   Used for Break the Bank - Sorting, Break the Bank - Counting, Litter Critters.

   config = {
     mode: 'sort' | 'count',
     bins: [{ id, emoji, label }],                 // used in 'sort' mode
     items: [{ id, emoji, label, binId, value }],  // value used in 'count' mode
     target: 25,                                    // 'count' mode goal
     easyHardToggle: true                            // Litter Critters style
   }
*/
const SorterEngine = {
  mount(container, config, api) {
    const mode = config.mode || 'sort';
    let items = (config.items || []).slice();
    let easyMode = !!config.easyHardToggle;
    let binIndex = 0; // which bin is "active" in easy mode
    let runningTotal = 0;
    let sortedCount = 0;

    container.innerHTML = `
      <div class="toolbar"></div>
      <div class="tray" aria-label="Items to sort"></div>
      <div class="bins-row" aria-label="Sorting bins"></div>
      <p class="status-line"></p>
    `;

    const toolbar = container.querySelector('.toolbar');
    const tray = container.querySelector('.tray');
    const binsRow = container.querySelector('.bins-row');
    const status = container.querySelector('.status-line');

    if (config.easyHardToggle) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'active';
      btn.textContent = 'Easy mode: one bin at a time';
      btn.addEventListener('click', () => {
        easyMode = !easyMode;
        btn.textContent = easyMode ? 'Easy mode: one bin at a time' : 'Hard mode: all bins at once';
        btn.classList.toggle('active', true);
        binIndex = 0;
        renderBins();
      });
      toolbar.appendChild(btn);
    }

    if (mode === 'count') {
      const goalTag = document.createElement('div');
      goalTag.className = 'bin';
      goalTag.style.flex = '0 0 auto';
      goalTag.innerHTML = `<div class="bin__emoji">🐷</div><div class="bin__label">Goal: ${config.target}¢</div><div class="bin__count total-count">0¢ so far</div>`;
      binsRow.appendChild(goalTag);
    } else {
      renderBins();
    }

    function renderBins() {
      if (mode !== 'sort') return;
      binsRow.querySelectorAll('.bin').forEach(b => b.remove());
      const binsToShow = easyMode ? [config.bins[binIndex % config.bins.length]] : config.bins;
      binsToShow.forEach(bin => {
        const el = document.createElement('div');
        el.className = 'bin';
        el.dataset.binId = bin.id;
        el.innerHTML = `<div class="bin__emoji">${bin.emoji}</div><div class="bin__label">${bin.label}</div><div class="bin__count">0 sorted</div>`;
        binsRow.appendChild(el);
      });
    }

    // Some item sets (like coins of different denominations) look identical
    // as plain emoji, forcing kids to hover and read a tooltip to tell them
    // apart. When an item has a `color`, render it as a colored token
    // showing its own label text directly, instead of a generic emoji.
    function styleAsToken(el, item) {
      if (!item.color) return;
      el.textContent = item.tokenText || item.label;
      el.style.background = item.color;
      el.style.color = '#FBF6EC';
      el.style.borderRadius = '50%';
      el.style.width = (item.tokenSize || 56) + 'px';
      el.style.height = (item.tokenSize || 56) + 'px';
      el.style.display = 'flex';
      el.style.alignItems = 'center';
      el.style.justifyContent = 'center';
      el.style.fontSize = '0.85rem';
      el.style.fontWeight = '800';
      el.style.padding = '0';
    }

    function refreshTray() {
      tray.innerHTML = '';
      items.forEach((item, idx) => {
        if (item.done) return;
        const el = document.createElement('div');
        el.className = 'tray-item';
        el.textContent = item.emoji;
        el.title = item.label;
        el.dataset.idx = idx;
        styleAsToken(el, item);
        tray.appendChild(el);
        attachDrag(el, item, idx);
      });
      if (items.every(i => i.done)) {
        status.innerHTML = '<span class="celebrate">🎉 All sorted! Press Reset to play again.</span>';
      }
    }

    function attachDrag(el, item, idx) {
      let ghost = null;
      el.addEventListener('pointerdown', (ev) => {
        if (ev.button !== undefined && ev.button !== 0) return;
        ev.preventDefault();
        ghost = document.createElement('div');
        ghost.className = 'tray-item';
        ghost.textContent = item.emoji;
        styleAsToken(ghost, item);
        ghost.style.position = 'fixed';
        ghost.style.zIndex = '999';
        ghost.style.pointerEvents = 'none';
        ghost.style.left = ev.clientX - 20 + 'px';
        ghost.style.top = ev.clientY - 20 + 'px';
        document.body.appendChild(ghost);

        function move(mv) {
          ghost.style.left = mv.clientX - 20 + 'px';
          ghost.style.top = mv.clientY - 20 + 'px';
          binsRow.querySelectorAll('.bin').forEach(b => {
            const r = b.getBoundingClientRect();
            const over = mv.clientX >= r.left && mv.clientX <= r.right && mv.clientY >= r.top && mv.clientY <= r.bottom;
            b.classList.toggle('highlight', over);
          });
        }
        function up(uv) {
          window.removeEventListener('pointermove', move);
          window.removeEventListener('pointerup', up);
          ghost.remove();
          binsRow.querySelectorAll('.bin').forEach(b => b.classList.remove('highlight'));

          if (mode === 'count') {
            const goalBox = binsRow.querySelector('.bin');
            const r = goalBox.getBoundingClientRect();
            const over = uv.clientX >= r.left && uv.clientX <= r.right && uv.clientY >= r.top && uv.clientY <= r.bottom;
            if (over) {
              runningTotal += item.value || 0;
              item.done = true;
              binsRow.querySelector('.total-count').textContent = `${runningTotal}¢ so far`;
              if (runningTotal >= config.target) {
                status.innerHTML = `<span class="celebrate">🎉 You reached ${runningTotal}¢! Goal met.</span>`;
              } else {
                status.textContent = `${config.target - runningTotal}¢ to go.`;
              }
              refreshTray();
            }
          } else {
            let dropped = false;
            binsRow.querySelectorAll('.bin').forEach(b => {
              const r = b.getBoundingClientRect();
              const over = uv.clientX >= r.left && uv.clientX <= r.right && uv.clientY >= r.top && uv.clientY <= r.bottom;
              if (over) {
                dropped = true;
                if (b.dataset.binId === item.binId) {
                  item.done = true;
                  sortedCount++;
                  const countEl = b.querySelector('.bin__count');
                  const n = parseInt(countEl.textContent) + 1;
                  countEl.textContent = `${n} sorted`;
                  status.textContent = `Nice! That belongs in ${b.querySelector('.bin__label').textContent}.`;
                  if (easyMode && items.filter(i => !i.done && i.binId === b.dataset.binId).length === 0) {
                    binIndex++;
                    if (binIndex < config.bins.length) renderBins();
                  }
                  refreshTray();
                } else {
                  status.textContent = `Not quite — try a different bin.`;
                }
              }
            });
          }
        }
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      });
    }

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.textContent = '🔄 Reset';
    resetBtn.addEventListener('click', () => {
      items = (config.items || []).map(i => ({ ...i, done: false }));
      runningTotal = 0;
      sortedCount = 0;
      binIndex = 0;
      if (mode === 'count') binsRow.querySelector('.total-count').textContent = '0¢ so far';
      else renderBins();
      status.textContent = '';
      refreshTray();
    });
    toolbar.appendChild(resetBtn);

    refreshTray();
    status.textContent = mode === 'count'
      ? `Drag coins into the piggy bank until you reach ${config.target}¢.`
      : 'Drag each item into the bin where it belongs.';
  }
};
