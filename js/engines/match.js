/* Match engine ("Same & Different")
   Practices: pure click-targeting and visual discrimination (no dragging).
   config = { rounds: [{ mode: 'same'|'different', target: {shape,color},
                          options: [{shape,color,correct}] }] }
*/
const MatchEngine = {
  mount(container, config, api) {
    const rounds = config.rounds || [];
    let roundIndex = 0;
    let score = 0;

    container.innerHTML = `
      <div class="stage" style="min-height:320px; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:24px;"></div>
      <p class="status-line"></p>
    `;
    const stage = container.querySelector('.stage');
    const status = container.querySelector('.status-line');

    function donutSvg(shape, color, size) {
      size = size || 90;
      const shapes = {
        circle: `<circle cx="50" cy="50" r="34" fill="none" stroke="${color}" stroke-width="18"/>`,
        square: `<rect x="16" y="16" width="68" height="68" fill="none" stroke="${color}" stroke-width="18"/>`,
        triangle: `<polygon points="50,10 90,85 10,85" fill="none" stroke="${color}" stroke-width="16" stroke-linejoin="round"/>`
      };
      return `<svg width="${size}" height="${size}" viewBox="0 0 100 100">${shapes[shape] || shapes.circle}</svg>`;
    }

    function renderRound() {
      stage.innerHTML = '';
      if (roundIndex >= rounds.length) {
        stage.innerHTML = `<div style="font-size:2.4rem;">🎉</div>`;
        status.innerHTML = `<span class="celebrate">All done! You got ${score} of ${rounds.length} right.</span>`;
        return;
      }
      const round = rounds[roundIndex];
      const prompt = document.createElement('div');
      prompt.style.fontWeight = '800';
      prompt.style.fontFamily = "'Baloo 2', sans-serif";
      prompt.textContent = round.mode === 'same' ? 'Click the one that looks the SAME:' : 'Click the one that looks DIFFERENT:';
      stage.appendChild(prompt);

      const targetWrap = document.createElement('div');
      targetWrap.innerHTML = donutSvg(round.target.shape, round.target.color, 100);
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
        btn.innerHTML = donutSvg(opt.shape, opt.color, 80);
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
      renderRound();
    });

    renderRound();
  }
};
