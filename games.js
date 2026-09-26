/* games.js — the full game registry.
   Each grade lists its games EXACTLY as named in the district's request.
   Repeated titles (Tangrams, ABCya Paint, Make a Pizza, etc.) reuse one
   engine each, but with a harder/bigger configuration at each grade level,
   per your instruction to "build once, scale difficulty per grade."
*/
const GAME_REGISTRY = {
  K: [
    {
      title: 'Make a House', icon: '🏠', skill: 'Clicking, dragging, and dropping items to design a house.',
      engine: 'builder', config: { sceneEmoji: '🏠', sceneLabel: 'house', maxPlacements: 8,
        items: [
          { id: 'door', emoji: '🚪', label: 'Door' }, { id: 'window', emoji: '🪟', label: 'Window' },
          { id: 'tree', emoji: '🌳', label: 'Tree' }, { id: 'flower', emoji: '🌷', label: 'Flower' },
          { id: 'sun', emoji: '☀️', label: 'Sun' }
        ] }
    },
    {
      title: 'ABC and 123 Magnets', icon: '🧲', skill: 'Clicking and dragging letters/numbers across a canvas.',
      engine: 'magnets', config: { tileSet: 'letters' }
    },
    {
      title: 'Connect the Dots', icon: '🔢', skill: 'Precise point-and-click movement to connect numbered dots.',
      engine: 'connectdots', config: { sequence: Array.from({ length: 10 }, (_, i) => String(i + 1)), revealEmoji: '⭐' }
    },
    {
      title: 'Connect the Dots ABC', icon: '🔤', skill: 'Precise point-and-click movement to connect lettered dots.',
      engine: 'connectdots', config: { sequence: 'ABCDEFGHIJ'.split(''), revealEmoji: '🌈' }
    },
    {
      title: 'ABCya Paint', icon: '🖌️', skill: 'Precision clicking, holding, and dragging to draw and paint.',
      engine: 'paint', config: { brushSizes: [10, 18, 28] }
    },
    {
      title: 'Make a Cake', icon: '🎂', skill: 'Selecting, dragging, and placing decorations on a cake.',
      engine: 'builder', config: { sceneEmoji: '🎂', sceneLabel: 'cake', maxPlacements: 8,
        items: [{ id: 'candle', emoji: '🕯️', label: 'Candle' }, { id: 'cherry', emoji: '🍒', label: 'Cherry' },
                { id: 'star', emoji: '⭐', label: 'Sprinkle star' }, { id: 'heart', emoji: '💖', label: 'Heart' }] }
    },
    {
      title: 'Make a Cookie', icon: '🍪', skill: 'Selecting, dragging, and placing toppings on a cookie.',
      engine: 'builder', config: { sceneEmoji: '🍪', sceneLabel: 'cookie', maxPlacements: 10,
        items: [{ id: 'choc', emoji: '🍫', label: 'Chocolate chip' }, { id: 'icing', emoji: '🤍', label: 'Icing dot' },
                { id: 'sprinkle', emoji: '✨', label: 'Sprinkle' }] }
    },
    {
      title: 'Make a Pizza', icon: '🍕', skill: 'Selecting, dragging, and placing toppings on a pizza.',
      engine: 'builder', config: { sceneEmoji: '🍕', sceneLabel: 'pizza', maxPlacements: 8,
        items: [{ id: 'pep', emoji: '🍕', label: 'Pepperoni' }, { id: 'olive', emoji: '🫒', label: 'Olive' },
                { id: 'pepper', emoji: '🫑', label: 'Pepper' }, { id: 'cheese', emoji: '🧀', label: 'Extra cheese' }] }
    },
    {
      title: 'Make a Face', icon: '🙂', skill: 'Selecting, dragging, and placing facial features.',
      engine: 'builder', config: { sceneEmoji: '⚪', sceneLabel: 'face', maxPlacements: 7,
        items: [{ id: 'eye', emoji: '👁️', label: 'Eye' }, { id: 'nose', emoji: '👃', label: 'Nose' },
                { id: 'mouth', emoji: '👄', label: 'Mouth' }, { id: 'hair', emoji: '💇', label: 'Hair' }] }
    },
    {
      title: 'Tangrams', icon: '🔺', skill: 'Dragging, dropping, and rotating puzzle pieces into place.',
      engine: 'tangram', config: { tolerancePx: 46, toleranceDeg: 30, pieces: [
        { shape: 'triLg', color: '#4FA8D8', target: { x: 30, y: 40, rotation: 0 } },
        { shape: 'triLg', color: '#E85D4C', target: { x: 55, y: 40, rotation: 90 } },
        { shape: 'square', color: '#F4A825', target: { x: 42, y: 62, rotation: 0 } }
      ] }
    },
    {
      title: 'Same & Different', icon: '🍩', skill: 'Targeting and clicking on matching visual elements.',
      engine: 'match', config: { rounds: [
        { mode: 'same', target: { shape: 'circle', color: '#E85D4C' }, options: [
          { shape: 'circle', color: '#E85D4C', correct: true }, { shape: 'square', color: '#4FA8D8', correct: false }
        ] },
        { mode: 'same', target: { shape: 'triangle', color: '#F4A825' }, options: [
          { shape: 'circle', color: '#F4A825', correct: false }, { shape: 'triangle', color: '#F4A825', correct: true }
        ] },
        { mode: 'different', target: { shape: 'square', color: '#8E6BB0' }, options: [
          { shape: 'square', color: '#8E6BB0', correct: false }, { shape: 'circle', color: '#2F5D50', correct: true }
        ] }
      ] }
    }
  ],

  1: [
    { title: 'Make a House', icon: '🏠', skill: 'Click, drag, and drop elements to decorate a house.',
      engine: 'builder', config: { sceneEmoji: '🏠', sceneLabel: 'house', maxPlacements: 12,
        items: [
          { id: 'door', emoji: '🚪', label: 'Door' }, { id: 'window', emoji: '🪟', label: 'Window' },
          { id: 'tree', emoji: '🌳', label: 'Tree' }, { id: 'flower', emoji: '🌷', label: 'Flower' },
          { id: 'sun', emoji: '☀️', label: 'Sun' }, { id: 'fence', emoji: '🚧', label: 'Fence' },
          { id: 'car', emoji: '🚗', label: 'Car' }
        ] } },
    { title: 'ABC and 123 Magnets', icon: '🧲', skill: 'Click and drag magnetic letters and numbers to construct words or equations.',
      engine: 'magnets', config: { tileSet: 'both' } },
    { title: 'Connect the Dots', icon: '🔢', skill: 'Practice precise cursor placement by clicking dots in sequential order.',
      engine: 'connectdots', config: { sequence: Array.from({ length: 20 }, (_, i) => String(i + 1)), revealEmoji: '🚀' } },
    { title: 'Connect the Dots ABC', icon: '🔤', skill: 'Practice precise cursor placement by clicking letter dots in order.',
      engine: 'connectdots', config: { sequence: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), revealEmoji: '🦄' } },
    { title: 'ABCya Paint', icon: '🖌️', skill: 'Hold, drag, and guide the cursor to draw and paint digitally.',
      engine: 'paint', config: {} },
    { title: 'Magic Mirror Paint', icon: '🪞', skill: 'Hold, drag, and guide the cursor to draw symmetric art.',
      engine: 'paint', config: { mirrorMode: true } },
    { title: 'Make a Cake', icon: '🎂', skill: 'Select, drag, and arrange toppings and decorations on a cake.',
      engine: 'builder', config: { sceneEmoji: '🎂', sceneLabel: 'cake', maxPlacements: 12,
        items: [{ id: 'candle', emoji: '🕯️', label: 'Candle' }, { id: 'cherry', emoji: '🍒', label: 'Cherry' },
                { id: 'star', emoji: '⭐', label: 'Sprinkle star' }, { id: 'heart', emoji: '💖', label: 'Heart' },
                { id: 'straw', emoji: '🍓', label: 'Strawberry' }] } },
    { title: 'Make a Pizza', icon: '🍕', skill: 'Select, drag, and arrange toppings on a pizza.',
      engine: 'builder', config: { sceneEmoji: '🍕', sceneLabel: 'pizza', maxPlacements: 12,
        items: [{ id: 'pep', emoji: '🍕', label: 'Pepperoni' }, { id: 'olive', emoji: '🫒', label: 'Olive' },
                { id: 'pepper', emoji: '🫑', label: 'Pepper' }, { id: 'mushroom', emoji: '🍄', label: 'Mushroom' },
                { id: 'cheese', emoji: '🧀', label: 'Extra cheese' }] } },
    { title: 'Make a Cookie', icon: '🍪', skill: 'Select, drag, and arrange toppings on a cookie.',
      engine: 'builder', config: { sceneEmoji: '🍪', sceneLabel: 'cookie', maxPlacements: 12,
        items: [{ id: 'choc', emoji: '🍫', label: 'Chocolate chip' }, { id: 'icing', emoji: '🤍', label: 'Icing dot' },
                { id: 'sprinkle', emoji: '✨', label: 'Sprinkle' }, { id: 'nut', emoji: '🥜', label: 'Nut' }] } },
    { title: 'Make a Face', icon: '🙂', skill: 'Select, drag, and arrange facial features.',
      engine: 'builder', config: { sceneEmoji: '⚪', sceneLabel: 'face', maxPlacements: 10,
        items: [{ id: 'eye', emoji: '👁️', label: 'Eye' }, { id: 'nose', emoji: '👃', label: 'Nose' },
                { id: 'mouth', emoji: '👄', label: 'Mouth' }, { id: 'hair', emoji: '💇', label: 'Hair' },
                { id: 'glasses', emoji: '👓', label: 'Glasses' }, { id: 'hat', emoji: '🎩', label: 'Hat' }] } },
    { title: 'Tangrams', icon: '🔺', skill: 'Precise dragging, dropping, and maneuvering of geometric shapes.',
      engine: 'tangram', config: { tolerancePx: 40, toleranceDeg: 25, pieces: [
        { shape: 'triLg', color: '#4FA8D8', target: { x: 28, y: 35, rotation: 0 } },
        { shape: 'triLg', color: '#E85D4C', target: { x: 55, y: 35, rotation: 90 } },
        { shape: 'triMd', color: '#F4A825', target: { x: 42, y: 55, rotation: 45 } },
        { shape: 'square', color: '#8E6BB0', target: { x: 42, y: 70, rotation: 0 } },
        { shape: 'parallelogram', color: '#2F5D50', target: { x: 65, y: 65, rotation: 0 } }
      ] } },
    { title: '100 Snowballs!', icon: '⛄', skill: 'Click and drag snowballs around the screen to build shapes.',
      engine: 'builder', config: { sceneEmoji: '❄️', sceneLabel: 'snow', unlimited: true, maxPlacements: 60,
        items: [{ id: 'snowball', emoji: '⚪', label: 'Snowball' }] } },
    { title: 'Break the Bank - Sorting', icon: '🪙', skill: 'Click and drag coins to sort them into correct containers.',
      engine: 'sorter', config: { mode: 'sort', easyHardToggle: true,
        bins: [{ id: 'coins', emoji: '🪙', label: 'Coins' }, { id: 'bills', emoji: '💵', label: 'Bills' }],
        items: [
          { id: 'p1', emoji: '🪙', label: 'Penny', binId: 'coins' }, { id: 'p2', emoji: '🪙', label: 'Nickel', binId: 'coins' },
          { id: 'p3', emoji: '🪙', label: 'Dime', binId: 'coins' }, { id: 'b1', emoji: '💵', label: 'Dollar bill', binId: 'bills' },
          { id: 'b2', emoji: '💵', label: 'Five', binId: 'bills' }, { id: 'p4', emoji: '🪙', label: 'Quarter', binId: 'coins' }
        ] } }
  ],

  2: [
    { title: 'Make a House', icon: '🏠', skill: 'Click, drag, and drop items to design a house.',
      engine: 'builder', config: { sceneEmoji: '🏠', sceneLabel: 'house', maxPlacements: 16,
        items: [
          { id: 'door', emoji: '🚪', label: 'Door' }, { id: 'window', emoji: '🪟', label: 'Window' },
          { id: 'tree', emoji: '🌳', label: 'Tree' }, { id: 'flower', emoji: '🌷', label: 'Flower' },
          { id: 'sun', emoji: '☀️', label: 'Sun' }, { id: 'fence', emoji: '🚧', label: 'Fence' },
          { id: 'car', emoji: '🚗', label: 'Car' }, { id: 'dog', emoji: '🐕', label: 'Dog' },
          { id: 'chimney-smoke', emoji: '💨', label: 'Chimney smoke' }
        ] } },
    { title: 'ABCya Paint', icon: '🖌️', skill: 'Fine motor control and precise dragging to paint.',
      engine: 'paint', config: {} },
    { title: 'Magic Mirror Paint', icon: '🪞', skill: 'Fine motor control and precise dragging for symmetric art.',
      engine: 'paint', config: { mirrorMode: true } },
    { title: 'Pixel Art', icon: '🟪', skill: 'Targeted clicking to fill in grid squares and design pixel art.',
      engine: 'pixelart', config: { gridSize: 12 } },
    { title: 'Make a Cake', icon: '🎂', skill: 'Selecting, dragging, and arranging toppings and decorations.',
      engine: 'builder', config: { sceneEmoji: '🎂', sceneLabel: 'cake', maxPlacements: 16,
        items: [{ id: 'candle', emoji: '🕯️', label: 'Candle' }, { id: 'cherry', emoji: '🍒', label: 'Cherry' },
                { id: 'star', emoji: '⭐', label: 'Sprinkle star' }, { id: 'heart', emoji: '💖', label: 'Heart' },
                { id: 'straw', emoji: '🍓', label: 'Strawberry' }, { id: 'choc', emoji: '🍫', label: 'Chocolate drizzle' }] } },
    { title: 'Make a Pizza', icon: '🍕', skill: 'Selecting, dragging, and arranging toppings and decorations.',
      engine: 'builder', config: { sceneEmoji: '🍕', sceneLabel: 'pizza', maxPlacements: 16,
        items: [{ id: 'pep', emoji: '🍕', label: 'Pepperoni' }, { id: 'olive', emoji: '🫒', label: 'Olive' },
                { id: 'pepper', emoji: '🫑', label: 'Pepper' }, { id: 'mushroom', emoji: '🍄', label: 'Mushroom' },
                { id: 'cheese', emoji: '🧀', label: 'Extra cheese' }, { id: 'pineapple', emoji: '🍍', label: 'Pineapple' }] } },
    { title: 'Tangrams', icon: '🔺', skill: 'Dragging, dropping, and maneuvering geometric shapes to solve puzzles.',
      engine: 'tangram', config: { tolerancePx: 34, toleranceDeg: 20, pieces: [
        { shape: 'triLg', color: '#4FA8D8', target: { x: 26, y: 32, rotation: 0 } },
        { shape: 'triLg', color: '#E85D4C', target: { x: 55, y: 32, rotation: 90 } },
        { shape: 'triMd', color: '#F4A825', target: { x: 40, y: 50, rotation: 45 } },
        { shape: 'triSm', color: '#2F5D50', target: { x: 62, y: 55, rotation: 180 } },
        { shape: 'square', color: '#8E6BB0', target: { x: 40, y: 68, rotation: 0 } },
        { shape: 'parallelogram', color: '#2F5D50', target: { x: 62, y: 70, rotation: 0 } }
      ] } },
    { title: 'USA Geography Puzzle', icon: '🗺️', skill: 'Dragging and placing state shapes precisely into their locations on a map.',
      engine: 'geomap', config: { tolerancePx: 50, states: [
        { id: 'CA', label: 'California', x: 12, y: 45 }, { id: 'TX', label: 'Texas', x: 40, y: 68 },
        { id: 'FL', label: 'Florida', x: 78, y: 82 }, { id: 'NY', label: 'New York', x: 80, y: 25 },
        { id: 'IL', label: 'Illinois', x: 58, y: 40 }, { id: 'WA', label: 'Washington', x: 15, y: 12 },
        { id: 'CO', label: 'Colorado', x: 38, y: 45 }, { id: 'ME', label: 'Maine', x: 88, y: 14 }
      ] } },
    { title: '100 Snowballs!', icon: '⛄', skill: 'Dragging and stacking snowballs to build custom creations.',
      engine: 'builder', config: { sceneEmoji: '❄️', sceneLabel: 'snow', unlimited: true, maxPlacements: 100,
        items: [{ id: 'snowball', emoji: '⚪', label: 'Snowball' }] } },
    { title: 'Break the Bank - Sorting', icon: '🪙', skill: 'Dragging and dropping coins into the correct sorting slots.',
      engine: 'sorter', config: { mode: 'sort', easyHardToggle: true,
        bins: [{ id: 'penny', emoji: '🟤', label: 'Pennies' }, { id: 'nickel', emoji: '⚪', label: 'Nickels' },
               { id: 'dime', emoji: '⚪', label: 'Dimes' }, { id: 'quarter', emoji: '⚪', label: 'Quarters' }],
        items: [
          { id: 'p1', emoji: '🪙', label: 'Penny', binId: 'penny' }, { id: 'p2', emoji: '🪙', label: 'Penny', binId: 'penny' },
          { id: 'n1', emoji: '🪙', label: 'Nickel', binId: 'nickel' }, { id: 'n2', emoji: '🪙', label: 'Nickel', binId: 'nickel' },
          { id: 'd1', emoji: '🪙', label: 'Dime', binId: 'dime' }, { id: 'd2', emoji: '🪙', label: 'Dime', binId: 'dime' },
          { id: 'q1', emoji: '🪙', label: 'Quarter', binId: 'quarter' }, { id: 'q2', emoji: '🪙', label: 'Quarter', binId: 'quarter' }
        ] } },
    { title: 'Make a Robot', icon: '🤖', skill: 'Selecting and dragging parts to assemble a custom robot.',
      engine: 'builder', config: { sceneEmoji: '🤖', sceneLabel: 'robot', maxPlacements: 10,
        items: [{ id: 'antenna', emoji: '📡', label: 'Antenna' }, { id: 'eye', emoji: '👁️', label: 'Eye' },
                { id: 'arm', emoji: '🦾', label: 'Arm' }, { id: 'bolt', emoji: '🔩', label: 'Bolt' }] } },
    { title: 'Make a Backpack', icon: '🎒', skill: 'Selecting and dragging parts to assemble a custom backpack.',
      engine: 'builder', config: { sceneEmoji: '🎒', sceneLabel: 'backpack', maxPlacements: 10,
        items: [{ id: 'patch', emoji: '🏷️', label: 'Patch' }, { id: 'star', emoji: '⭐', label: 'Star pin' },
                { id: 'keychain', emoji: '🔑', label: 'Keychain' }, { id: 'ribbon', emoji: '🎀', label: 'Ribbon' }] } },
    { title: 'Create a Car', icon: '🚗', skill: 'Selecting and dragging parts to assemble a custom car.',
      engine: 'builder', config: { sceneEmoji: '🚗', sceneLabel: 'car', maxPlacements: 10,
        items: [{ id: 'wheel', emoji: '⚫', label: 'Wheel' }, { id: 'flame', emoji: '🔥', label: 'Flame decal' },
                { id: 'star', emoji: '⭐', label: 'Star decal' }, { id: 'flag', emoji: '🏁', label: 'Racing flag' }] } }
  ],

  3: [
    { title: 'ABCya Paint', icon: '🖌️', skill: 'Precise clicking, holding, and dragging to paint and draw.',
      engine: 'paint', config: {} },
    { title: 'Magic Mirror Paint', icon: '🪞', skill: 'Precise clicking, holding, and dragging for symmetric art.',
      engine: 'paint', config: { mirrorMode: true } },
    { title: 'Pixel Art', icon: '🟪', skill: 'Targeted point-and-click movement to fill in grid squares.',
      engine: 'pixelart', config: { gridSize: 16 } },
    { title: 'Animate', icon: '🎞️', skill: 'Dragging, dropping, and drawing across frames to create animations.',
      engine: 'paint', config: { frames: true, frameCount: 6 } },
    { title: '100 Snowballs!', icon: '⛄', skill: 'Clicking and dragging snowballs to build custom creations.',
      engine: 'builder', config: { sceneEmoji: '❄️', sceneLabel: 'snow', unlimited: true, maxPlacements: 100,
        items: [{ id: 'snowball', emoji: '⚪', label: 'Snowball' }, { id: 'ice', emoji: '🧊', label: 'Ice block' }] } },
    { title: 'Tangrams', icon: '🔺', skill: 'Dragging, dropping, and rotating geometric pieces to solve puzzles.',
      engine: 'tangram', config: { tolerancePx: 28, toleranceDeg: 15, pieces: [
        { shape: 'triLg', color: '#4FA8D8', target: { x: 25, y: 30, rotation: 0 } },
        { shape: 'triLg', color: '#E85D4C', target: { x: 55, y: 30, rotation: 90 } },
        { shape: 'triMd', color: '#F4A825', target: { x: 38, y: 48, rotation: 45 } },
        { shape: 'triSm', color: '#2F5D50', target: { x: 60, y: 52, rotation: 180 } },
        { shape: 'triSm', color: '#8E6BB0', target: { x: 70, y: 40, rotation: 270 } },
        { shape: 'square', color: '#8E6BB0', target: { x: 38, y: 66, rotation: 0 } },
        { shape: 'parallelogram', color: '#2F5D50', target: { x: 60, y: 68, rotation: 0 } }
      ] } },
    { title: 'USA Geography Puzzle', icon: '🗺️', skill: 'Dragging and placing state shapes precisely onto a map.',
      engine: 'geomap', config: { tolerancePx: 36, states: [
        { id: 'CA', label: 'California', x: 12, y: 45 }, { id: 'TX', label: 'Texas', x: 40, y: 68 },
        { id: 'FL', label: 'Florida', x: 78, y: 82 }, { id: 'NY', label: 'New York', x: 80, y: 25 },
        { id: 'IL', label: 'Illinois', x: 58, y: 40 }, { id: 'WA', label: 'Washington', x: 15, y: 12 },
        { id: 'CO', label: 'Colorado', x: 38, y: 45 }, { id: 'ME', label: 'Maine', x: 88, y: 14 },
        { id: 'AZ', label: 'Arizona', x: 25, y: 58 }, { id: 'GA', label: 'Georgia', x: 72, y: 62 },
        { id: 'OH', label: 'Ohio', x: 68, y: 35 }, { id: 'MN', label: 'Minnesota', x: 52, y: 20 },
        { id: 'LA', label: 'Louisiana', x: 50, y: 75 }, { id: 'NV', label: 'Nevada', x: 18, y: 38 },
        { id: 'MA', label: 'Massachusetts', x: 85, y: 22 }
      ] } },
    { title: 'Make a Face', icon: '🙂', skill: 'Selecting, dragging, and arranging facial features and accessories.',
      engine: 'builder', config: { sceneEmoji: '⚪', sceneLabel: 'face', maxPlacements: 16,
        items: [{ id: 'eye', emoji: '👁️', label: 'Eye' }, { id: 'nose', emoji: '👃', label: 'Nose' },
                { id: 'mouth', emoji: '👄', label: 'Mouth' }, { id: 'hair', emoji: '💇', label: 'Hair' },
                { id: 'glasses', emoji: '👓', label: 'Glasses' }, { id: 'hat', emoji: '🎩', label: 'Hat' },
                { id: 'mustache', emoji: '👨', label: 'Mustache' }, { id: 'earring', emoji: '💎', label: 'Earring' }] } },
    { title: 'Make a Pizza', icon: '🍕', skill: 'Selecting, dragging, and arranging toppings and decorations.',
      engine: 'builder', config: { sceneEmoji: '🍕', sceneLabel: 'pizza', maxPlacements: 20,
        items: [{ id: 'pep', emoji: '🍕', label: 'Pepperoni' }, { id: 'olive', emoji: '🫒', label: 'Olive' },
                { id: 'pepper', emoji: '🫑', label: 'Pepper' }, { id: 'mushroom', emoji: '🍄', label: 'Mushroom' },
                { id: 'cheese', emoji: '🧀', label: 'Extra cheese' }, { id: 'pineapple', emoji: '🍍', label: 'Pineapple' },
                { id: 'basil', emoji: '🌿', label: 'Basil' }] } },
    { title: 'Make a Robot', icon: '🤖', skill: 'Selecting, dragging, and arranging parts to assemble a robot.',
      engine: 'builder', config: { sceneEmoji: '🤖', sceneLabel: 'robot', maxPlacements: 16,
        items: [{ id: 'antenna', emoji: '📡', label: 'Antenna' }, { id: 'eye', emoji: '👁️', label: 'Eye' },
                { id: 'arm', emoji: '🦾', label: 'Arm' }, { id: 'bolt', emoji: '🔩', label: 'Bolt' },
                { id: 'jetpack', emoji: '🚀', label: 'Jetpack' }, { id: 'claw', emoji: '🦞', label: 'Claw' }] } },
    { title: 'Make a Backpack', icon: '🎒', skill: 'Selecting, dragging, and arranging parts and decorations.',
      engine: 'builder', config: { sceneEmoji: '🎒', sceneLabel: 'backpack', maxPlacements: 16,
        items: [{ id: 'patch', emoji: '🏷️', label: 'Patch' }, { id: 'star', emoji: '⭐', label: 'Star pin' },
                { id: 'keychain', emoji: '🔑', label: 'Keychain' }, { id: 'ribbon', emoji: '🎀', label: 'Ribbon' },
                { id: 'button', emoji: '🔘', label: 'Button pin' }] } },
    { title: 'Make a Treehouse', icon: '🌳', skill: 'Selecting, dragging, and arranging parts and decorations.',
      engine: 'builder', config: { sceneEmoji: '🌳', sceneLabel: 'treehouse', maxPlacements: 14,
        items: [{ id: 'plank', emoji: '🟫', label: 'Plank' }, { id: 'ladder', emoji: '🪜', label: 'Rope ladder' },
                { id: 'flag', emoji: '🚩', label: 'Flag' }, { id: 'window', emoji: '🪟', label: 'Window' }] } },
    { title: 'Pumpkin Carving', icon: '🎃', skill: 'Dragging and placing carved features onto a pumpkin.',
      engine: 'builder', config: { sceneEmoji: '🎃', sceneLabel: 'pumpkin', maxPlacements: 6,
        items: [{ id: 'tri-eye', emoji: '🔺', label: 'Triangle eye' }, { id: 'mouth', emoji: '⬛', label: 'Jagged mouth' },
                { id: 'nose', emoji: '🔻', label: 'Nose' }] } },
    { title: 'Make a Christmas Tree', icon: '🎄', skill: 'Dragging and placing holiday decorations.',
      engine: 'builder', config: { sceneEmoji: '🎄', sceneLabel: 'tree', maxPlacements: 16,
        items: [{ id: 'orn', emoji: '🔴', label: 'Ornament' }, { id: 'star', emoji: '⭐', label: 'Star topper' },
                { id: 'light', emoji: '💡', label: 'Light' }, { id: 'candy', emoji: '🍬', label: 'Candy cane' }] } },
    { title: 'Make a Gingerbread House', icon: '🏠', skill: 'Dragging and placing candy decorations.',
      engine: 'builder', config: { sceneEmoji: '🍫', sceneLabel: 'gingerbread house', maxPlacements: 16,
        items: [{ id: 'gumdrop', emoji: '🍬', label: 'Gumdrop' }, { id: 'candycane', emoji: '🍭', label: 'Candy cane' },
                { id: 'icing', emoji: '🤍', label: 'Icing' }, { id: 'shingle', emoji: '🟫', label: 'Roof shingle' }] } },
    { title: 'Break the Bank - Counting', icon: '🐷', skill: 'Clicking and dragging coins to reach a target amount.',
      engine: 'sorter', config: { mode: 'count', target: 75, items: [
        { id: 'p1', emoji: '🪙', label: 'Penny', value: 1 }, { id: 'p2', emoji: '🪙', label: 'Penny', value: 1 },
        { id: 'n1', emoji: '🪙', label: 'Nickel', value: 5 }, { id: 'n2', emoji: '🪙', label: 'Nickel', value: 5 },
        { id: 'd1', emoji: '🪙', label: 'Dime', value: 10 }, { id: 'd2', emoji: '🪙', label: 'Dime', value: 10 },
        { id: 'q1', emoji: '🪙', label: 'Quarter', value: 25 }, { id: 'q2', emoji: '🪙', label: 'Quarter', value: 25 },
        { id: 'q3', emoji: '🪙', label: 'Quarter', value: 25 }
      ] } },
    { title: 'Litter Critters', icon: '♻️', skill: 'Clicking and dragging trash into the correct sorting containers.',
      engine: 'sorter', config: { mode: 'sort', easyHardToggle: true,
        bins: [{ id: 'recycle', emoji: '♻️', label: 'Recyclables' }, { id: 'compost', emoji: '🍎', label: 'Compost' },
               { id: 'ewaste', emoji: '🔋', label: 'E-Waste' }, { id: 'landfill', emoji: '🗑️', label: 'Landfill' }],
        items: [
          { id: 'bottle', emoji: '🍾', label: 'Bottle', binId: 'recycle' }, { id: 'can', emoji: '🥫', label: 'Can', binId: 'recycle' },
          { id: 'apple', emoji: '🍎', label: 'Apple core', binId: 'compost' }, { id: 'banana', emoji: '🍌', label: 'Banana peel', binId: 'compost' },
          { id: 'battery', emoji: '🔋', label: 'Battery', binId: 'ewaste' }, { id: 'phone', emoji: '📱', label: 'Old phone', binId: 'ewaste' },
          { id: 'wrapper', emoji: '🍬', label: 'Candy wrapper', binId: 'landfill' }, { id: 'straw', emoji: '🥤', label: 'Foam cup', binId: 'landfill' }
        ] } }
  ]
};

const GRADE_LABELS = { K: 'Kindergarten', 1: 'Grade 1', 2: 'Grade 2', 3: 'Grade 3' };
