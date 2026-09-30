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
   Practices: dragging coins precisely onto a target, and building an exact
   amount one coin at a time — not just clicking anything until numbers go
   up. Goals are worked through ONE AT A TIME, in order; finishing one
   automatically reveals the next. Amounts are a mix of round and
   not-round-multiples-of-25 (like 83¢ or $1.05), so most goals take an
   actual combination of coins rather than dropping the same coin repeatedly.

   config = {
     mode: 'count',
     coins: [{ id, label, tokenText, color, tokenSize, value }],
     // ^ permanent, reusable coin buttons at the top — dragging one never
     //   removes it, so kids never run out mid-goal.
     goals: [75, 83, 72, 105, ...]   // ordered list of cent targets, worked
                                       // through one at a time
   }
*/
function mountCountMode(container, config, api) {
  const coins = config.coins || [];
  const goalAmounts = config.goals || [];
  let goalIndex = 0;
  let current = 0;
  let state = 'playing'; // 'playing' | 'error' | 'allDone'

  // Positioned so the Next button (added below) can anchor to this
  // container's own bottom-right corner, detached from the celebration
  // card itself rather than living inside it.
  container.style.position = 'relative';

  container.innerHTML = `
    <div class="toolbar"></div>
    <div class="tray coin-tray" aria-label="Coins — drag one onto the goal"
         style="justify-content:center;"></div>
    <p class="status-line" style="margin-top:14px;"></p>
    <div class="goals-row" style="display:flex; justify-content:center; margin-top:10px;" aria-label="Current goal"></div>
    <div class="next-goal-corner" style="position:absolute; right:18px; bottom:18px;"></div>
  `;

  const toolbar = container.querySelector('.toolbar');
  const tray = container.querySelector('.tray');
  const status = container.querySelector('.status-line');
  const goalsRow = container.querySelector('.goals-row');
  const nextCorner = container.querySelector('.next-goal-corner');

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
    el.style.cursor = 'grab';
  }

  function renderGoal() {
    goalsRow.innerHTML = '';
    const finished = goalIndex >= goalAmounts.length;
    const box = document.createElement('div');
    box.className = 'goal-box';
    box.style.display = 'flex';
    box.style.flexDirection = 'column';
    box.style.alignItems = 'center';
    box.style.gap = '4px';
    box.style.padding = '16px 26px';
    box.style.borderRadius = '16px';
    box.style.minWidth = '140px';

    if (finished) {
      box.style.border = '3px solid var(--chalk-green)';
      box.style.background = 'var(--chalk-green)';
      box.style.color = 'var(--cream)';
      box.innerHTML = `<div style="font-weight:800; font-family:'Baloo 2', sans-serif; font-size:1.1rem;">✅ All done!</div>`;
    } else if (state === 'error') {
      // A same-style status line was too easy to miss — a mistake gets its
      // own loud, unmistakable state: red border, a big X, and play pauses
      // until the student deliberately presses Try Again.
      box.style.border = '3px solid var(--coral)';
      box.style.background = '#FBEAE7';
      box.style.color = 'var(--ink)';
      box.innerHTML = `
        <div style="font-size:2.2rem; line-height:1;">❌</div>
        <div style="font-size:0.8rem; opacity:0.75;">Goal ${goalIndex + 1} of ${goalAmounts.length}</div>
        <div style="font-weight:800; font-family:'Baloo 2', sans-serif; font-size:1.3rem;">${goalAmounts[goalIndex]}¢</div>
        <div style="font-weight:800; color:var(--coral);">Too much! You added ${current}¢.</div>
        <button type="button" class="try-again-btn primary" style="margin-top:6px;">🔄 Try Again</button>
      `;
      box.querySelector('.try-again-btn').addEventListener('click', () => {
        current = 0;
        state = 'playing';
        status.textContent = `Let's try ${goalAmounts[goalIndex]}¢ again.`;
        renderGoal();
      });
    } else if (state === 'success') {
      // Pause on a correct answer rather than instantly jumping ahead —
      // same "Next" pattern as Bubble Pop Math's Next Round button. The
      // button itself lives outside this card, anchored to the overall
      // game area's bottom-right corner (see nextCorner below).
      box.style.border = '3px solid var(--chalk-green)';
      box.style.background = '#EAF6EF';
      box.style.color = 'var(--ink)';
      box.innerHTML = `
        <div style="font-size:2.2rem; line-height:1;">🎉</div>
        <div style="font-size:0.8rem; opacity:0.75;">Goal ${goalIndex + 1} of ${goalAmounts.length}</div>
        <div style="font-weight:800; font-family:'Baloo 2', sans-serif; font-size:1.3rem;">${goalAmounts[goalIndex]}¢ — exactly right!</div>
      `;
    } else {
      box.style.border = '3px dashed var(--paper-line)';
      box.style.background = '#fdfcf7';
      box.style.color = 'var(--ink)';
      box.innerHTML = `
        <div style="font-size:0.8rem; opacity:0.75;">Goal ${goalIndex + 1} of ${goalAmounts.length}</div>
        <div style="font-weight:800; font-family:'Baloo 2', sans-serif; font-size:1.3rem;">${goalAmounts[goalIndex]}¢</div>
        <div class="goal-progress" style="font-size:0.9rem;">${current}¢ so far</div>
      `;
    }
    goalsRow.appendChild(box);

    // The Next button only exists while state is 'success' — it lives in
    // its own corner element, detached from the celebration card above.
    nextCorner.innerHTML = '';
    if (!finished && state === 'success') {
      const nextBtn = document.createElement('button');
      nextBtn.type = 'button';
      nextBtn.className = 'primary';
      nextBtn.textContent = 'Next ➡️';
      nextBtn.addEventListener('click', () => {
        goalIndex++;
        current = 0;
        state = 'playing';
        status.textContent = goalIndex >= goalAmounts.length ? '' : `Goal ${goalIndex + 1}: reach ${goalAmounts[goalIndex]}¢.`;
        renderGoal();
      });
      nextCorner.appendChild(nextBtn);
    }
  }

  function dropOnGoal(coin) {
    if (state === 'error') {
      status.textContent = 'Press "Try Again" before adding more coins.';
      return;
    }
    if (goalIndex >= goalAmounts.length) return; // already finished every goal
    if (state === 'success') return; // already solved — waiting for Next click
    const target = goalAmounts[goalIndex];
    current += coin.value;
    if (current === target) {
      state = 'success';
      status.textContent = '';
    } else if (current > target) {
      state = 'error';
      status.textContent = '';
    } else {
      status.textContent = `${target - current}¢ more to reach ${target}¢.`;
    }
    renderGoal();
  }

  coins.forEach(coin => {
    const el = document.createElement('div');
    el.className = 'tray-item';
    el.title = coin.label;
    styleAsToken(el, coin);
    tray.appendChild(el);

    let ghost = null;
    el.addEventListener('pointerdown', (ev) => {
      if (ev.button !== undefined && ev.button !== 0) return;
      ev.preventDefault();
      ghost = document.createElement('div');
      ghost.className = 'tray-item';
      styleAsToken(ghost, coin);
      ghost.style.position = 'fixed';
      ghost.style.zIndex = '999';
      ghost.style.pointerEvents = 'none';
      ghost.style.left = ev.clientX - 20 + 'px';
      ghost.style.top = ev.clientY - 20 + 'px';
      document.body.appendChild(ghost);

      function move(mv) {
        ghost.style.left = mv.clientX - 20 + 'px';
        ghost.style.top = mv.clientY - 20 + 'px';
        const box = goalsRow.querySelector('.goal-box');
        if (box) {
          const r = box.getBoundingClientRect();
          const over = mv.clientX >= r.left && mv.clientX <= r.right && mv.clientY >= r.top && mv.clientY <= r.bottom;
          box.style.outline = over ? '3px solid var(--sky)' : 'none';
        }
      }
      function up(uv) {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        ghost.remove();
        const box = goalsRow.querySelector('.goal-box');
        if (box) {
          box.style.outline = 'none';
          const r = box.getBoundingClientRect();
          const over = uv.clientX >= r.left && uv.clientX <= r.right && uv.clientY >= r.top && uv.clientY <= r.bottom;
          if (over) dropOnGoal(coin);
        }
      }
      window.addEventListener('pointermove', move);
      window.addEventListener('pointerup', up);
    });
  });

  renderGoal();
  status.textContent = 'Drag a coin onto the goal — reach the exact amount to move to the next one!';
}
