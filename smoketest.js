const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  resources: 'usable',
  url: 'file://' + __dirname + '/index.html',
  pretendToBeVisual: true
});

const { window } = dom;
let errors = [];
window.addEventListener('error', (e) => {
  errors.push((e.error && e.error.stack) || e.message);
});

// jsdom doesn't implement canvas 2d context or PointerEvent by default; stub
// enough to let the app's mount() calls run without throwing.
window.HTMLCanvasElement.prototype.getContext = function () {
  return {
    clearRect(){}, beginPath(){}, moveTo(){}, lineTo(){}, stroke(){}, fill(){},
    arc(){}, drawImage(){}, save(){}, restore(){}, closePath(){},
    set lineJoin(v){}, set lineCap(v){}, set strokeStyle(v){}, set fillStyle(v){}, set lineWidth(v){}
  };
};
window.HTMLCanvasElement.prototype.toDataURL = function () { return 'data:image/png;base64,'; };
if (!window.PointerEvent) {
  window.PointerEvent = window.MouseEvent;
}

function wait(ms) { return new Promise(res => setTimeout(res, ms)); }

async function run() {
  await wait(300); // let scripts execute (app.js calls renderHome() synchronously though)

  const doc = window.document;
  const registry = JSON.parse(window.eval('JSON.stringify(GAME_REGISTRY)'));
  const gradeLabels = JSON.parse(window.eval('JSON.stringify(GRADE_LABELS)'));
  const grades = Object.keys(registry);
  console.log('Grades found:', grades);

  for (const g of grades) {
    // click the grade picker button for this grade
    const btns = [...doc.querySelectorAll('.grade-picker button')];
    const btn = btns.find(b => b.textContent === (gradeLabels[g] || g));
    if (btn) btn.click();
    await wait(20);

    const tiles = [...doc.querySelectorAll('.game-tile')];
    console.log(`Grade ${g}: ${tiles.length} tiles rendered (expected ${registry[g].length})`);

    for (let i = 0; i < tiles.length; i++) {
      // re-query since renderHome() rebuilds the grade picker each time
      const freshTiles = [...doc.querySelectorAll('.game-tile')];
      const title = registry[g][i].title;
      try {
        freshTiles[i].click();
        await wait(15);
        const backBtn = doc.querySelector('.back-btn');
        if (!backBtn) {
          console.log(`  ! ${title}: no back button rendered (mount likely failed silently)`);
        }
        if (backBtn) backBtn.click();
        await wait(10);
        // re-select this grade for the next iteration
        const btns2 = [...doc.querySelectorAll('.grade-picker button')];
        const btn2 = btns2.find(b => b.textContent === (gradeLabels[g] || g));
        if (btn2) btn2.click();
        await wait(10);
      } catch (e) {
        console.log(`  ! ${title}: threw ->`, e.message);
      }
    }
  }

  await wait(50);
  console.log('\nTotal window errors caught:', errors.length);
  errors.slice(0, 20).forEach(e => console.log('---\n' + e));

  window.close();
  process.exit(errors.length ? 1 : 0);
}

run();
