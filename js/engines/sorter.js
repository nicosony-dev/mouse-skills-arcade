/* Sorter engine
   Practices: dragging an item precisely into one of several target zones.
   Used for Break the Bank - Sorting and Litter Critters ('sort' mode), and
   Break the Bank - Counting ('count' mode, see mountCountMode below).

   config = {
     mode: 'sort' | 'count',
     bins: [{ id, emoji, label }],                 // used in 'sort' mode
     items: [{ id, emoji, label, binId }],          // used in 'sort' mode
     easyHardToggle: true                            // Litter Critters style
   }

   'count' mode config is entirely separate — see mountCountMode's own
   doc comment below.
*/
const SorterEngine = {
  mount(container, config, api) {
    if ((config.mode || 'sort') === 'count') {
      mountCountMode(container, config, api);
      return;
    }

    let items = (config.items || []).slice();
    let easyMode = !!config.easyHardToggle;
    let binIndex = 0; // which bin is "active" in easy mode
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

    renderBins();

    function renderBins() {
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
        window.addEventListener('pointermove', move);
        window.addEventListener('pointerup', up);
      });
    }

    const resetBtn = document.createElement('button');
    resetBtn.type = 'button';
    resetBtn.textContent = '🔄 Reset';
    resetBtn.addEventListener('click', () => {
      items = (config.items || []).map(i => ({ ...i, done: false }));
      sortedCount = 0;
      binIndex = 0;
      renderBins();
      status.textContent = '';
      refreshTray();
    });
    toolbar.appendChild(resetBtn);

    refreshTray();
    status.textContent = 'Drag each item into the bin where it belongs.';
  }
};

/* Count mode — Break the Bank - Counting.
   Practices: repeated, deliberate clicking/dragging to build up an amount,
   plus recognizing when a running total has crossed each of several goals.

   config = {
     mode: 'count',
     bankLabel: 'Bank',                 // neutral label — no piggy-bank icon
     coins: [{ id, label, tokenText, color, tokenSize, value }],
     // ^ ONE permanent, reusable button per denomination — clicking (or
     //   dragging into the bank) adds its value without ever running out.
     milestones: [25, 50, 75, 100]       // ascending cent goals, each gets
                                          // its own checkmark as the running
                                          // total reaches it
   }
*/
function mountCountMode(container, config, api) {
  const coins = config.coins || [];
  const milestones = (config.milestones || []).slice().sort((a, b) => a - b);
  const bankLabel = config.bankLabel || 'Bank';
  let total = 0;
  const achieved = new Set();

  container.innerHTML = `
    <div class="toolbar"></div>
    <div class="tray coin-tray" aria-label="Coins — click or drag into the bank"></div>
    <div class="bank-wrap" style="margin-top:14px; padding:14px; border:3px dashed var(--paper-line); border-radius:16px; background:#fdfcf7;">
      <div style="font-weight:800; font-family:'Baloo 2', sans-serif; margin-bottom:8px;">🏦 ${bankLabel}: <span class="bank-total">0¢</span></div>
      <div class="goals-row" style="display:flex; flex-wrap:wrap; gap:10px;" aria-label="Goals"></div>
    </div>
    <p class="status-line"></p>
  `;

  const toolbar = container.querySelector('.toolbar');
  const tray = container.querySelector('.tray');
  const bankTotalEl = container.querySelector('.bank-total');
  const goalsRow = container.querySelector('.goals-row');
  const status = container.querySelector('.status-line');

  function styleAsToken(el, coin) {
    el.textContent = coin.tokenText || coin.label;
    el.style.background = coin.color || '#4FA8D8';
    el.style.color = '#FBF6EC';
    el.style.borderRadius = '50%';
    el.style.width = (coin.tokenSize || 56) + 'px';
    el.style.height = (coin.tokenSize || 56) + 'px';
    el.style.display = 'flex';
    el.style.alignItems = 'center';
    el.style.justifyContent = 'center';
    el.style.fontSize = '0.85rem';
    el.style.fontWeight = '800';
    el.style.padding = '0';
    el.style.border = '2px solid #2B2621';
    el.style.cursor = 'pointer';
  }

  function renderGoals() {
    goalsRow.innerHTML = '';
    milestones.forEach(m => {
      const done = achieved.has(m);
      const badge = document.createElement('div');
      badge.style.display = 'flex';
      badge.style.alignItems = 'center';
      badge.style.gap = '6px';
      badge.style.padding = '8px 14px';
      badge.style.borderRadius = '999px';
      badge.style.fontWeight = '800';
      badge.style.border = '2px solid ' + (done ? 'var(--chalk-green)' : 'var(--paper-line)');
      badge.style.background = done ? 'var(--chalk-green)' : '#fff';
      badge.style.color = done ? 'var(--cream)' : 'var(--ink)';
      badge.innerHTML = `<span>${done ? '✅' : '⬜'}</span><span>${m}¢</span>`;
      goalsRow.appendChild(badge);
    });
  }

  function addCoin(coin) {
    total += coin.value;
    bankTotalEl.textContent = `${total}¢`;
    let newlyAchieved = null;
    milestones.forEach(m => {
      if (total >= m && !achieved.has(m)) {
        achieved.add(m);
        newlyAchieved = m;
      }
    });
    renderGoals();
    if (newlyAchieved) {
      status.innerHTML = `<span class="celebrate">🎉 You reached ${newlyAchieved}¢!</span>`;
    } else {
      const next = milestones.find(m => !achieved.has(m));
      status.textContent = next ? `In the bank: ${total}¢. ${next - total}¢ to go for the next goal.` : `In the bank: ${total}¢.`;
    }
    if (milestones.length && milestones.every(m => achieved.has(m))) {
      status.innerHTML = `<span class="celebrate">🎉 All goals reached! Press Reset to play again.</span>`;
    }
  }

  coins.forEach(coin => {
    const el = document.createElement('button');
    el.type = 'button';
    el.className = 'tray-item';
    el.title = coin.label;
    styleAsToken(el, coin);
    el.addEventListener('click', () => addCoin(coin));
    tray.appendChild(el);
  });

  const resetBtn = document.createElement('button');
  resetBtn.type = 'button';
  resetBtn.textContent = '🔄 Reset';
  resetBtn.addEventListener('click', () => {
    total = 0;
    achieved.clear();
    bankTotalEl.textContent = '0¢';
    renderGoals();
    status.textContent = '';
  });
  toolbar.appendChild(resetBtn);

  renderGoals();
  status.textContent = `Click a coin to add it to the ${bankLabel.toLowerCase()}. Reach every goal!`;
}
