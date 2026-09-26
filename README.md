# Mouse Skills Arcade

A free, ad-free set of browser mouse-skills games for grades K–3, built to replace
the district's paid ABCya subscription. No accounts, no ads, no tracking, no
build step — it's plain HTML/CSS/JS that runs as static files.

54 games across four grade shelves (K: 11, Grade 1: 13, Grade 2: 13, Grade 3: 17),
matching the district's original ABCya game list title-for-title. Repeated titles
(Tangrams, ABCya Paint, Make a Pizza, and others) share one game engine each, scaled
up in difficulty at each grade level — more pieces, finer precision, larger
decoration sets as students get older.

## Skills practiced

| Mechanic | Games |
|---|---|
| Single-click accuracy | Same & Different |
| Point-and-click sequencing | Connect the Dots, Connect the Dots ABC |
| Click-and-drag placement | Make a House / Cake / Pizza / Cookie / Face / Robot / Backpack / Treehouse, Create a Car, Pumpkin Carving, Make a Christmas Tree, Make a Gingerbread House, ABC and 123 Magnets |
| Click-and-hold drawing | ABCya Paint, Magic Mirror Paint, Animate |
| Precise drag-to-target | Tangrams, USA Geography Puzzle |
| Drag-to-sort | Break the Bank – Sorting, Break the Bank – Counting, Litter Critters |
| Repeated fine-grained clicking | Pixel Art |
| Unlimited free-form dragging | 100 Snowballs! |

A **For Educators** page in the app itself explains how this maps to ISTE
Standards for Students and to the AISLE/I-SAIL literacy framework.

## Project structure

```
mouse-skills-arcade/
├── index.html              Entry point — loads all scripts and styles
├── styles.css              Design system (colors, type, layout)
├── js/
│   ├── dragutil.js         Shared Pointer-Events drag helper
│   ├── games.js            Registry: every game, per grade, with its config
│   ├── app.js               App shell: home shelf, routing, Educators page
│   └── engines/
│       ├── builder.js       Decorate-a-scene games (+ sandbox mode)
│       ├── sorter.js         Drag-into-bins games
│       ├── connectdots.js    Connect-the-dots games
│       ├── paint.js          Draw / mirror-draw / flipbook-animate
│       ├── tangram.js        Drag + rotate shape-fitting
│       ├── pixelart.js       Click-to-fill grid
│       ├── magnets.js        Freeform letter/number tile dragging
│       ├── geomap.js         Drag-to-map-location placement
│       └── match.js          Click-the-matching-option
├── smoketest.js             Headless click-through test (see below)
└── package.json              Only used for the smoke test's dev dependency
```

## Running it locally

No build step needed. Either:
- Open `index.html` directly in a browser, or
- Serve the folder locally, e.g. `python3 -m http.server 8000` and visit
  `http://localhost:8000`.

## Deploying to GitHub Pages

1. Create a new repository on GitHub (e.g. `mouse-skills-arcade`).
2. Push these files to it:
   ```
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/<your-org>/mouse-skills-arcade.git
   git push -u origin main
   ```
3. In the repo on GitHub, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to "Deploy from a branch",
   branch `main`, folder `/ (root)`. Save.
5. GitHub will publish it at `https://<your-org>.github.io/mouse-skills-arcade/`
   within a minute or two. That's the link to share with media specialists.

To update the site later, just edit files and push to `main` again — Pages
redeploys automatically.

## Notes and simplifications

- **USA Geography Puzzle** uses simplified placeholder shapes at approximate
  relative positions rather than cartographically accurate state outlines, to
  keep the focus on precise drag-and-drop control rather than geography
  trivia. Swap in real state SVGs later if a more accurate map is wanted.
- All art is emoji/CSS/SVG — no external image assets, so there's nothing
  extra to host or license.
- Fonts (Baloo 2, Nunito) load from Google Fonts via CDN; everything else is
  self-contained.

## Smoke test

`smoketest.js` uses `jsdom` to click through every one of the 54 games and
confirm nothing throws a runtime error. To run it:

```
npm install
npm run smoketest
```

This is a structural check (it confirms every game mounts cleanly), not a
substitute for trying the games in a real browser.

## License

MIT — free to use, modify, and share within the district or beyond.
