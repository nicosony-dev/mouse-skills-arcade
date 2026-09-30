/* Bubble pop math engine
   Practices: rapid, repeated click-targeting (the "pop bubbles" mouse
   skill), combined with addition/subtraction fact fluency.

   config = {
     minOperand: 1, maxOperand: 12,
     correctPerRound: 3,     // how many correct bubbles must be popped
     distractorCount: 6,     // how many wrong bubbles are mixed in
     minTarget: 5, maxTarget: 20
   }

   Each round shows a target number. Bubbles show simple equations
   (like "7 + 5" or "14 - 3"); popping a correct one removes it and counts
   toward the round. Popping a wrong one just gives a gentle "not quite"
   shake — it stays, so the student can keep looking without being
   penalized. A "Next Round" button appears once every correct bubble for
   the current target has been found.
*/
const BubbleMathEngine = {
  mount(container, config, api) {
    const minOperand = config.minOperand || 1;
    const maxOperand = config.maxOperand || 12;
    const correctPerRound = config.correctPerRound || 3;
    const distractorCount = config.distractorCount || 6;
    const minTarget = config.minTarget || 5;
    const maxTarget = config.maxTarget || 20;
    const bubbleColors = ['#4FA8D8', '#8E6BB0', '#E85D4C', '#F4A825', '#2F5D50'];

    container.innerHTML = `
      <div class="toolbar">
        <span class="target-line" style="font-weight:800; font-family:'Baloo 2', sans-serif; font-size:1.1rem;"></span>
      </div>
      <div class="stage bubble-stage" style="min-height:460px; display:flex; flex-wrap:wrap; align-content:flex-start; gap:16px; padding:20px;"></div>
      <p class="status-line"></p>
    `;
    const stage = container.querySelector('.stage');
    const status = container.querySelector('.status-line');
    const targetLine = container.querySelector('.target-line');

    function randInt(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function shuffle(arr) {
      const a = arr.slice();
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
      }
      return a;
    }

    // Both operands in every equation — including the larger, first number
    // in a subtraction like "12 − 5" — stay within [minOperand, maxOperand].
    // An earlier version only bounded the smaller number being subtracted,
    // so e.g. a maxOperand of 10 could still show "24 − 11".
    function additionFor(target) {
      // a + b = target, both within [minOperand, maxOperand]
      const aMin = Math.max(minOperand, target - maxOperand);
      const aMax = Math.min(maxOperand, target - minOperand);
      if (aMin > aMax) return null; // not achievable within the operand range
      const a = randInt(aMin, aMax);
      return { label: `${a} + ${target - a}`, value: target };
    }

    function subtractionFor(target) {
      // c - d = target, both within [minOperand, maxOperand]
      const dMin = minOperand;
      const dMax = Math.min(maxOperand - target, maxOperand);
      if (dMax < dMin) return null; // not achievable within the operand range
      const d = randInt(dMin, dMax);
      return { label: `${target + d} − ${d}`, value: target };
    }

    function makeCorrectEquation(target) {
      const add = additionFor(target);
      const sub = subtractionFor(target);
      if (add && sub) return Math.random() < 0.5 ? add : sub;
      return add || sub || { label: `${target} + 0`, value: target }; // extreme fallback
    }

    function makeDistractorEquation(target) {
      let label, value, tries = 0;
      do {
        tries++;
        if (Math.random() < 0.5) {
          const a = randInt(minOperand, maxOperand);
          const b = randInt(minOperand, maxOperand);
          value = a + b; label = `${a} + ${b}`;
        } else {
          const c = randInt(minOperand, maxOperand);
          const d = randInt(minOperand, c);
          value = c - d; label = `${c} − ${d}`;
        }
      } while (value === target && tries < 20);
      return { label, value };
    }

    let foundCount = 0;
    let target = minTarget;

    function startRound() {
      target = randInt(minTarget, maxTarget);
      foundCount = 0;
      stage.innerHTML = '';
      targetLine.textContent = `🎯 Pop the bubbles that equal ${target}!`;
      status.textContent = `Found 0 of ${correctPerRound}.`;

      const correctEquations = Array.from({ length: correctPerRound }, () => makeCorrectEquation(target));
      const distractorEquations = Array.from({ length: distractorCount }, () => makeDistractorEquation(target));
      const bubbles = shuffle(
        correctEquations.map(eq => ({ ...eq, correct: true }))
          .concat(distractorEquations.map(eq => ({ ...eq, correct: false })))
      );

      bubbles.forEach(bubble => {
        const el = document.createElement('button');
        el.type = 'button';
        el.className = 'bubble';
        el.textContent = bubble.label;
        const size = 74 + Math.round(Math.random() * 20);
        el.style.width = size + 'px';
        el.style.height = size + 'px';
        el.style.borderRadius = '50%';
        el.style.border = '3px solid #2B2621';
        el.style.background = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
        el.style.color = '#FBF6EC';
        el.style.fontWeight = '800';
        el.style.fontSize = '0.95rem';
        el.style.cursor = 'pointer';
        el.style.display = 'flex';
        el.style.alignItems = 'center';
        el.style.justifyContent = 'center';
        el.style.textAlign = 'center';
        el.style.padding = '4px';
        el.style.transition = 'transform 0.15s ease, opacity 0.15s ease';

        el.addEventListener('click', () => {
          if (el.dataset.popped === 'true') return;
          if (bubble.correct) {
            el.dataset.popped = 'true';
            el.style.transform = 'scale(0)';
            el.style.opacity = '0';
            setTimeout(() => el.remove(), 150);
            foundCount++;
            if (foundCount === correctPerRound) {
              status.innerHTML = `<span class="celebrate">🎉 All found! Press Next Round for a new target.</span>`;
              showNextRoundButton();
            } else {
              status.textContent = `Found ${foundCount} of ${correctPerRound}. Keep popping!`;
            }
          } else {
            el.style.transform = 'scale(0.85)';
            setTimeout(() => { el.style.transform = 'scale(1)'; }, 150);
            status.textContent = `${bubble.label} isn't ${target} — try another bubble.`;
          }
        });

        stage.appendChild(el);
      });
    }

    function showNextRoundButton() {
      let btn = container.querySelector('.next-round-btn');
      if (!btn) {
        btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'next-round-btn primary';
        btn.textContent = '➡️ Next Round';
        btn.addEventListener('click', () => {
          btn.remove();
          startRound();
        });
        container.querySelector('.toolbar').appendChild(btn);
      }
    }

    startRound();
  }
};
