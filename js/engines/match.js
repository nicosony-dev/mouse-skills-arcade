/* Match engine ("Same & Different")
   Practices: pure click-targeting and visual discrimination (no dragging).

   config = {
     pool: { shapes: [...], letters: [...], numbers: [...] },
     colors: ['#E85D4C', ...],
     roundCount: 10
   }

   Each round shows a target (a shape/letter/number in a color) and two
   options: one that's an exact match (same kind, value, AND color) and one
   that's different in some way. Which one is "correct" to click depends on
   the round's mode:
     - 'same' mode: click the one that's an exact match
     - 'different' mode: click the one that differs
   Rounds are generated fresh from the pool each playthrough — with 15
   possible items across 5 colors, repeats are rare.

   The SAME/DIFFERENT instruction is a big color-coded banner (green vs.
   coral) with its own icon, not just a capitalized word inside a sentence —
   kids were missing the word-only version entirely.
*/
const MatchEngine = {
  mount(container, config, api) {
    const colors = config.colors || ['#E85D4C', '#4FA8D8', '#F4A825', '#8E6BB0', '#2F5D50'];
    const roundCount = config.roundCount || 10;
    const pool = [];
    (config.pool && config.pool.shapes || []).forEach(v => pool.push({ kind: 'shape', value: v }));
    (config.pool && config.pool.letters || []).forEach(v => pool.push({ kind: 'letter', value: v }));
    (config.pool && config.pool.numbers || []).forEach(v => pool.push({ kind: 'number', value: v }));

    let roundIndex = 0;
    let score = 0;
    let rounds = [];

    container.innerHTML = `
      <div class="stage" style="min-height:360px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:22px;"></div>
      <p class="status-line"></p>
    `;
    const stage = container.querySelector('.stage');
    const status = container.querySelector('.status-line');

    function shapeSvg(shape, color, size) {
      size = size || 90;
      const shapes = {
        circle: `<circle cx="50" cy="50" r="34" fill="none" stroke="${color}" stroke-width="18"/>`,
        square: `<rect x="16" y="16" width="68" height="68" fill="none" stroke="${color}" stroke-width="18"/>`,
        triangle: `<polygon points="50,10 90,85 10,85" fill="none" stroke="${color}" stroke-width="16" stroke-linejoin="round"/>`,
        star: `<polygon points="50,8 61,35 90,38 68,57 75,86 50,70 25,86 32,57 10,38 39,35" fill="none" stroke="${color}" stroke-width="12" stroke-linejoin="round"/>`,
        heart: `<path d="M50,85 C20,60 5,40 5,25 C5,10 20,5 32,15 C40,22 50,35 50,35 C50,35 60,22 68,15 C80,5 95,10 95,25 C95,40 80,60 50,85 Z" fill="none" stroke="${color}" stroke-width="9" stroke-linejoin="round"/>`
      };
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">${shapes[shape] || shapes.circle}</svg>`;
    }

    function renderThing(item, size) {
      size = size || 90;
      if (item.kind === 'shape') return shapeSvg(item.value, item.color, size);
      return `<div style="width:${size}px; height:${size}px; display:flex; align-items:center; justify-content:center;
                          font-family:'Baloo 2', sans-serif; font-weight:800; font-size:${Math.round(size * 0.72)}px;
                          color:${item.color}; line-height:1;">${item.value}</div>`;
    }

    function randPick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

    function sameItem(a, b) { return a.kind === b.kind && a.value === b.value && a.color === b.color; }

    function generateRound() {
      const mode = Math.random() < 0.5 ? 'same' : 'different';
      const baseItem = randPick(pool);
      const target = { kind: baseItem.kind, value: baseItem.value, color: randPick(colors) };

      let decoy;
      do {
        const decoyItem = randPick(pool);
        decoy = { kind: decoyItem.kind, value: decoyItem.value, color: randPick(colors) };
      } while (sameItem(decoy, target));

      const match = { ...target };
      const options = Math.random() < 0.5 ? [match, decoy] : [decoy, match];
      options.forEach(o => { o.correct = (mode === 'same') ? sameItem(o, target) : !sameItem(o, target); });

      return { mode, target, options };
    }

    function buildRounds() {
      rounds = [];
      for (let i = 0; i < roundCount; i++) rounds.push(generateRound());
    }

    function renderRound() {
      stage.innerHTML = '';
      if (roundIndex >= rounds.length) {
        stage.innerHTML = `<div style="font-size:2.4rem;">🎉</div>`;
        status.innerHTML = `<span class="celebrate">All done! You got ${score} of ${rounds.length} right.</span>`;
        return;
      }
      const round = rounds[roundIndex];
      const isSame = round.mode === 'same';

      // A big, color-coded banner — not just a capitalized word in a
      // sentence — so the same/different instruction is unmistakable even
      // before a child reads the text.
      const banner = document.createElement('div');
      banner.style.display = 'flex';
      banner.style.alignItems = 'center';
      banner.style.gap = '10px';
      banner.style.padding = '14px 28px';
      banner.style.borderRadius = '999px';
      banner.style.fontWeight = '800';
      banner.style.fontFamily = "'Baloo 2', sans-serif";
      banner.style.fontSize = '1.3rem';
      banner.style.color = '#FFFFFF';
      banner.style.background = isSame ? 'var(--chalk-green)' : 'var(--coral)';
      banner.innerHTML = isSame ? '🟰&nbsp; Click the SAME one!' : '🔀&nbsp; Click the DIFFERENT one!';
      stage.appendChild(banner);

      const targetWrap = document.createElement('div');
      targetWrap.innerHTML = renderThing(round.target, 100);
      stage.appendChild(targetWrap);

      const optionsRow = document.createElement('div');
      optionsRow.style.display = 'flex';
      optionsRow.style.gap = '20px';
      round.options.forEach(opt => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.style.background = '#fff';
        btn.style.border = '3px solid #2B2621';
        btn.style.borderRadius = '16px';
        btn.style.padding = '10px';
        btn.style.cursor = 'pointer';
        btn.innerHTML = renderThing(opt, 80);
        btn.addEventListener('click', () => {
          if (opt.correct) {
            score++;
            status.innerHTML = `<span class="celebrate">Yes! That's it.</span>`;
          } else {
            status.textContent = 'Not quite — look closely and try again.';
            return;
          }
          roundIndex++;
          setTimeout(renderRound, 500);
        });
        optionsRow.appendChild(btn);
      });
      stage.appendChild(optionsRow);
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'toolbar';
    toolbar.innerHTML = `<button type="button" class="restart-btn">🔄 Play again</button>`;
    container.insertBefore(toolbar, stage);
    toolbar.querySelector('.restart-btn').addEventListener('click', () => {
      roundIndex = 0;
      score = 0;
      buildRounds();
      renderRound();
    });

    buildRounds();
    renderRound();
  }
};
