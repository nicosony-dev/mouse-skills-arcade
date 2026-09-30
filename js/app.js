/* app.js — the shell around the game registry.
   Renders the home "shelf" screen, routes into a chosen game, and renders
   the For Educators standards page.
*/
const ENGINES = {
  builder: BuilderEngine,
  sorter: SorterEngine,
  connectdots: ConnectDotsEngine,
  paint: PaintEngine,
  tangram: TangramEngine,
  pixelart: PixelArtEngine,
  magnets: MagnetsEngine,
  geomap: GeoMapEngine,
  match: MatchEngine,
  bubblemath: BubbleMathEngine
};

const app = document.getElementById('app');
let currentGrade = 'K';

function renderTopbar(view) {
  const bar = document.querySelector('.topbar__nav');
  bar.querySelectorAll('button').forEach(b => b.classList.toggle('active', b.dataset.view === view));
}

function renderHome() {
  renderTopbar('home');
  const grades = GRADE_ORDER;
  app.innerHTML = `
    <div class="shelf-wrap">
      <div class="shelf-intro">
        <h2>Pick a grade, then pick a game</h2>
        <p>Every game works with just a mouse, trackpad, or touchscreen —
        click, drag, and drop are all you need. Pick a shelf below to get started.</p>
      </div>
      <div class="grade-picker" role="tablist" aria-label="Grade level"></div>
      <div class="tile-grid"></div>
    </div>
  `;
  const picker = app.querySelector('.grade-picker');
  const tileGrid = app.querySelector('.tile-grid');

  grades.forEach(g => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = GRADE_LABELS[g] || g;
    btn.className = g === currentGrade ? 'active' : '';
    btn.addEventListener('click', () => {
      currentGrade = g;
      renderHome();
    });
    picker.appendChild(btn);
  });

  GAME_REGISTRY[currentGrade].forEach((game, idx) => {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'game-tile';
    tile.innerHTML = `
      <div class="game-tile__icon">${game.icon}</div>
      <div class="game-tile__title">${game.title}</div>
      <div class="game-tile__skill">${game.skill}</div>
      <div class="game-tile__badge">${GRADE_LABELS[currentGrade] || currentGrade}</div>
    `;
    tile.addEventListener('click', () => renderGame(currentGrade, idx));
    tileGrid.appendChild(tile);
  });
}

function renderGame(grade, idx) {
  renderTopbar('home');
  const game = GAME_REGISTRY[grade][idx];
  app.innerHTML = `
    <div class="game-screen">
      <div class="game-header">
        <button type="button" class="back-btn">← Back to shelf</button>
        <div class="game-title-block">
          <h2>${game.icon} ${game.title}</h2>
          <p>${game.skill}</p>
        </div>
        <span></span>
      </div>
      <div class="game-stage-wrap"></div>
    </div>
  `;
  app.querySelector('.back-btn').addEventListener('click', renderHome);
  const mountPoint = app.querySelector('.game-stage-wrap');
  const Engine = ENGINES[game.engine];
  if (Engine) {
    Engine.mount(mountPoint, game.config, {});
  } else {
    mountPoint.innerHTML = `<p>This game type isn't wired up yet.</p>`;
  }
}

function renderEducators() {
  renderTopbar('educators');
  app.innerHTML = `
    <div class="edu-wrap">
      <h2 style="margin-top:0;">For Educators &amp; Media Specialists</h2>
      <p>This arcade was built to replace paywalled, ad-heavy mouse-skills games with a free,
      ad-free set of activities that practice the same underlying motor skills: single-click accuracy,
      point-and-click sequencing, click-and-drag placement, click-and-hold drawing, and precise
      drag-to-target control.</p>

      <h2>How this supports ISTE Standards for Students</h2>
      <div class="standard-card"><b>Empowered Learner:</b> Students use the games' tools purposefully —
      choosing colors, pieces, and decorations to achieve a goal they set for themselves.</div>
      <div class="standard-card"><b>Digital Citizen:</b> A calm, ad-free, distraction-free environment
      lets students build healthy, focused habits with technology from their earliest exposure to it.</div>
      <div class="standard-card"><b>Innovative Designer:</b> Builder-style games (Make a House, Make a Robot,
      Make a Pizza, etc.) ask students to plan, place, and revise — a small-scale design process.</div>
      <div class="standard-card"><b>Computational Thinker:</b> Sorting games (Break the Bank, Litter Critters)
      and Tangrams ask students to recognize categories, patterns, and spatial relationships.</div>

      <h2>How this supports AISLE / I-SAIL literacies</h2>
      <p>The Association of Illinois School Library Educators' I-SAIL framework organizes school library
      instruction around four literacies: information, media, digital, and individual literacy. Mouse-skills
      practice is foundational to <b>digital literacy</b> — students can't engage with information or media
      literacy tasks on a device until they can reliably click, drag, and navigate one. These games are meant
      as that on-ramp, ahead of (or alongside) content-based digital and media literacy lessons.</p>

      <h2>A note on scope</h2>
      <p>Titles that repeat across grade levels (Tangrams, Paint, Make a Pizza, and others) share one
      underlying game engine, scaled up in difficulty at each grade — more pieces, finer precision, and larger
      decoration sets as students get older. The USA Geography Puzzle uses simplified placeholder shapes at
      approximate locations rather than exact state outlines, to keep the focus on precise drag-and-drop control.</p>
    </div>
  `;
}

document.querySelectorAll('.topbar__nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    if (btn.dataset.view === 'home') renderHome();
    if (btn.dataset.view === 'educators') renderEducators();
  });
});

renderHome();
