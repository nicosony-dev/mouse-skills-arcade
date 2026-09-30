/* games.js — the full game registry.
   Each grade lists its games EXACTLY as named in the district's request.
   Repeated titles (Tangrams, ABCya Paint, Make a Pizza, etc.) reuse one
   engine each, but with a harder/bigger configuration at each grade level,
   per your instruction to "build once, scale difficulty per grade."
*/
const GAME_REGISTRY = {
  K: [
    {
      title: 'Make a House', icon: '🏠', skill: 'Drag doors, windows, trees, and more onto your house!',
      engine: 'builder', config: { sceneEmoji: '🏠', sceneLabel: 'house', maxPlacements: 8,
        items: [
          { id: 'door', emoji: '🚪', label: 'Door' }, { id: 'window', emoji: '🪟', label: 'Window' },
          { id: 'tree', emoji: '🌳', label: 'Tree' }, { id: 'flower', emoji: '🌷', label: 'Flower' },
          { id: 'sun', emoji: '☀️', label: 'Sun' }
        ] }
    },
    {
      title: 'ABC and 123 Magnets', icon: '🧲', skill: 'Drag letters and numbers around the board!',
      engine: 'magnets', config: { tileSet: 'letters' }
    },
    {
      title: 'Connect the Dots', icon: '🔢', skill: 'Click the numbers in order to find the hidden picture!',
      engine: 'connectdots', config: { sequence: Array.from({ length: 10 }, (_, i) => String(i + 1)), revealEmoji: '⭐',
        // Kindergartners who are ready to count past 10 can switch to the
        // 1–20 range right in the game, without needing a separate tile.
        levels: [
          { label: '1–10', sequence: Array.from({ length: 10 }, (_, i) => String(i + 1)) },
          { label: '1–20 (challenge)', sequence: Array.from({ length: 20 }, (_, i) => String(i + 1)) }
        ] }
    },
    {
      title: 'Connect the Dots ABC', icon: '🔤', skill: 'Click the letters in order to find the hidden picture!',
      engine: 'connectdots', config: { sequence: 'ABCDEFGHIJ'.split(''), revealEmoji: '🌈',
        // Kindergartners who already know their ABCs past J can switch to
        // the full A–Z range right in the game.
        levels: [
          { label: 'A–J', sequence: 'ABCDEFGHIJ'.split('') },
          { label: 'A–Z (challenge)', sequence: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') }
        ] }
    },
    {
      title: 'Paint', icon: '🖌️', skill: 'Pick a color and draw anything you want!',
      engine: 'paint', config: { brushSizes: [10, 18, 28] }
    },
    {
      title: 'Make a Cake', icon: '🎂', skill: 'Drag candles, cherries, and sprinkles onto your cake!',
      engine: 'builder', config: { sceneEmoji: '🎂', sceneLabel: 'cake', maxPlacements: 8,
        items: [{ id: 'candle', emoji: '🕯️', label: 'Candle' }, { id: 'cherry', emoji: '🍒', label: 'Cherry' },
                { id: 'star', emoji: '⭐', label: 'Sprinkle star' }, { id: 'heart', emoji: '💖', label: 'Heart' }] }
    },
    {
      title: 'Make a Cookie', icon: '🍪', skill: 'Drag chocolate chips and sprinkles onto your cookie!',
      engine: 'builder', config: { sceneEmoji: '🍪', sceneLabel: 'cookie', maxPlacements: 10,
        items: [{ id: 'choc', emoji: '🟤', label: 'Chocolate chip' }, { id: 'icing', emoji: '⚪', label: 'Icing dot' },
                { id: 'sprinkle', emoji: '🟡', label: 'Sprinkle' }] }
    },
    {
      title: 'Make a Pizza', icon: '🍕', skill: 'Drag toppings onto your pizza!',
      engine: 'builder', config: { sceneEmoji: '🍕', sceneLabel: 'pizza', maxPlacements: 8,
        items: [{ id: 'pep', emoji: '🔴', label: 'Pepperoni' }, { id: 'olive', emoji: '🫒', label: 'Olive' },
                { id: 'pepper', emoji: '🟢', label: 'Pepper slice' }, { id: 'cheese', emoji: '🟡', label: 'Cheese sprinkle' }] }
    },
    {
      title: 'Make a Face', icon: '🙂', skill: 'Drag eyes, a nose, a mouth, and hair to build a silly face!',
      engine: 'builder', config: { sceneEmoji: '⚪', sceneLabel: 'face', maxPlacements: 7,
        items: [{ id: 'eye', emoji: '👁️', label: 'Eye' }, { id: 'nose', emoji: '👃', label: 'Nose' },
                { id: 'mouth', emoji: '👄', label: 'Mouth' }, { id: 'hair', emoji: '🦱', label: 'Hair' }] }
    },
    {
      title: 'Tangrams', icon: '🔺', skill: 'Drag and turn the shapes so they fit on their shadow!',
      engine: 'tangram', config: { tolerancePx: 46, toleranceDeg: 30, pieces: [
        { shape: 'triLg', color: '#4FA8D8', target: { x: 30, y: 40, rotation: 0 } },
        { shape: 'triLg', color: '#E85D4C', target: { x: 55, y: 40, rotation: 90 } },
        { shape: 'square', color: '#F4A825', target: { x: 42, y: 62, rotation: 0 } }
      ] }
    },
    {
      title: 'Same & Different', icon: '🍩', skill: 'Look closely, then click the one that matches!',
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
    { title: 'Make a House', icon: '🏠', skill: 'Drag doors, windows, trees, and more onto your house!',
      engine: 'builder', config: { sceneEmoji: '🏠', sceneLabel: 'house', maxPlacements: 12,
        items: [
          { id: 'door', emoji: '🚪', label: 'Door' }, { id: 'window', emoji: '🪟', label: 'Window' },
          { id: 'tree', emoji: '🌳', label: 'Tree' }, { id: 'flower', emoji: '🌷', label: 'Flower' },
          { id: 'sun', emoji: '☀️', label: 'Sun' }, { id: 'fence', emoji: '🚧', label: 'Fence' },
          { id: 'car', emoji: '🚗', label: 'Car' }
        ] } },
    { title: 'ABC and 123 Magnets', icon: '🧲', skill: 'Drag letters and numbers to spell words or build number sentences!',
      engine: 'magnets', config: { tileSet: 'both' } },
    { title: 'Connect the Dots', icon: '🔢', skill: 'Click the numbers in order, 1 to 20, to find the hidden picture!',
      engine: 'connectdots', config: { sequence: Array.from({ length: 20 }, (_, i) => String(i + 1)), revealEmoji: '🚀' } },
    { title: 'Connect the Dots ABC', icon: '🔤', skill: 'Click the letters in order, A to Z, to find the hidden picture!',
      engine: 'connectdots', config: { sequence: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''), revealEmoji: '🦄' } },
    { title: 'Paint', icon: '🖌️', skill: 'Pick a color and brush size, then draw!',
      engine: 'paint', config: {} },
    { title: 'Magic Mirror Paint', icon: '🪞', skill: 'Draw on one side and watch it magically copy to the other side!',
      engine: 'paint', config: { mirrorMode: true } },
    { title: 'Make a Cake', icon: '🎂', skill: 'Drag candles, cherries, and toppings onto your cake!',
      engine: 'builder', config: { sceneEmoji: '🎂', sceneLabel: 'cake', maxPlacements: 12,
        items: [{ id: 'candle', emoji: '🕯️', label: 'Candle' }, { id: 'cherry', emoji: '🍒', label: 'Cherry' },
                { id: 'star', emoji: '⭐', label: 'Sprinkle star' }, { id: 'heart', emoji: '💖', label: 'Heart' },
                { id: 'straw', emoji: '🍓', label: 'Strawberry' }] } },
    { title: 'Make a Pizza', icon: '🍕', skill: 'Drag toppings onto your pizza!',
      engine: 'builder', config: { sceneEmoji: '🍕', sceneLabel: 'pizza', maxPlacements: 12,
        items: [{ id: 'pep', emoji: '🔴', label: 'Pepperoni' }, { id: 'olive', emoji: '🫒', label: 'Olive' },
                { id: 'pepper', emoji: '🟢', label: 'Pepper slice' }, { id: 'mushroom', emoji: '🟤', label: 'Mushroom slice' },
                { id: 'cheese', emoji: '🟡', label: 'Cheese sprinkle' }] } },
    { title: 'Make a Cookie', icon: '🍪', skill: 'Drag chocolate chips, icing, and nuts onto your cookie!',
      engine: 'builder', config: { sceneEmoji: '🍪', sceneLabel: 'cookie', maxPlacements: 12,
        items: [{ id: 'choc', emoji: '🟤', label: 'Chocolate chip' }, { id: 'icing', emoji: '⚪', label: 'Icing dot' },
                { id: 'sprinkle', emoji: '🟡', label: 'Sprinkle' }, { id: 'nut', emoji: '🥜', label: 'Nut' }] } },
    { title: 'Make a Face', icon: '🙂', skill: 'Drag eyes, glasses, hats, and more to build a silly face!',
      engine: 'builder', config: { sceneEmoji: '⚪', sceneLabel: 'face', maxPlacements: 10,
        items: [{ id: 'eye', emoji: '👁️', label: 'Eye' }, { id: 'nose', emoji: '👃', label: 'Nose' },
                { id: 'mouth', emoji: '👄', label: 'Mouth' }, { id: 'hair', emoji: '🦱', label: 'Hair' },
                { id: 'glasses', emoji: '👓', label: 'Glasses' }, { id: 'hat', emoji: '🎩', label: 'Hat' }] } },
    { title: 'Tangrams', icon: '🔺', skill: 'Drag and turn the shapes so they fit on their shadow!',
      engine: 'tangram', config: { tolerancePx: 40, toleranceDeg: 25, pieces: [
        { shape: 'triLg', color: '#4FA8D8', target: { x: 28, y: 35, rotation: 0 } },
        { shape: 'triLg', color: '#E85D4C', target: { x: 55, y: 35, rotation: 90 } },
        { shape: 'triMd', color: '#F4A825', target: { x: 42, y: 55, rotation: 45 } },
        { shape: 'square', color: '#8E6BB0', target: { x: 42, y: 70, rotation: 0 } },
        { shape: 'parallelogram', color: '#2F5D50', target: { x: 65, y: 65, rotation: 0 } }
      ] } },
    { title: '100 Snowballs!', icon: '⛄', skill: 'Drag snowballs anywhere you want and build something fun!',
      engine: 'builder', config: { sceneEmoji: '❄️', sceneLabel: 'snow', unlimited: true, maxPlacements: 60,
        items: [{ id: 'snowball', emoji: '⚪', label: 'Snowball' }] } },
    { title: 'Break the Bank - Sorting', icon: '🪙', skill: 'Drag each coin or bill into the bin where it belongs!',
      engine: 'sorter', config: { mode: 'sort', easyHardToggle: true,
        bins: [{ id: 'coins', emoji: '🪙', label: 'Coins' }, { id: 'bills', emoji: '💵', label: 'Bills' }],
        items: [
          { id: 'p1', emoji: '🪙', label: 'Penny', binId: 'coins' }, { id: 'p2', emoji: '🪙', label: 'Nickel', binId: 'coins' },
          { id: 'p3', emoji: '🪙', label: 'Dime', binId: 'coins' }, { id: 'b1', emoji: '💵', label: 'Dollar bill', binId: 'bills' },
          { id: 'b2', emoji: '💵', label: 'Five', binId: 'bills' }, { id: 'p4', emoji: '🪙', label: 'Quarter', binId: 'coins' }
        ] } }
  ],

  2: [
    { title: 'Make a House', icon: '🏠', skill: 'Drag doors, windows, trees, and more onto your house!',
      engine: 'builder', config: { sceneEmoji: '🏠', sceneLabel: 'house', maxPlacements: 16,
        items: [
          { id: 'door', emoji: '🚪', label: 'Door' }, { id: 'window', emoji: '🪟', label: 'Window' },
          { id: 'tree', emoji: '🌳', label: 'Tree' }, { id: 'flower', emoji: '🌷', label: 'Flower' },
          { id: 'sun', emoji: '☀️', label: 'Sun' }, { id: 'fence', emoji: '🚧', label: 'Fence' },
          { id: 'car', emoji: '🚗', label: 'Car' }, { id: 'dog', emoji: '🐕', label: 'Dog' },
          { id: 'chimney-smoke', emoji: '💨', label: 'Chimney smoke' }
        ] } },
    { title: 'Paint', icon: '🖌️', skill: 'Pick a color and brush size, then draw!',
      engine: 'paint', config: {} },
    { title: 'Magic Mirror Paint', icon: '🪞', skill: 'Draw on one side and watch it magically copy to the other side!',
      engine: 'paint', config: { mirrorMode: true } },
    { title: 'Pixel Art', icon: '🟪', skill: 'Click and drag across the grid to color in squares!',
      engine: 'pixelart', config: { gridSize: 12 } },
    { title: 'Make a Cake', icon: '🎂', skill: 'Drag candles, cherries, and toppings onto your cake!',
      engine: 'builder', config: { sceneEmoji: '🎂', sceneLabel: 'cake', maxPlacements: 16,
        items: [{ id: 'candle', emoji: '🕯️', label: 'Candle' }, { id: 'cherry', emoji: '🍒', label: 'Cherry' },
                { id: 'star', emoji: '⭐', label: 'Sprinkle star' }, { id: 'heart', emoji: '💖', label: 'Heart' },
                { id: 'straw', emoji: '🍓', label: 'Strawberry' }, { id: 'choc', emoji: '🍫', label: 'Chocolate drizzle' }] } },
    { title: 'Make a Pizza', icon: '🍕', skill: 'Drag toppings like pepperoni, mushrooms, and pineapple onto your pizza!',
      engine: 'builder', config: { sceneEmoji: '🍕', sceneLabel: 'pizza', maxPlacements: 16,
        items: [{ id: 'pep', emoji: '🔴', label: 'Pepperoni' }, { id: 'olive', emoji: '🫒', label: 'Olive' },
                { id: 'pepper', emoji: '🟢', label: 'Pepper slice' }, { id: 'mushroom', emoji: '🟤', label: 'Mushroom slice' },
                { id: 'cheese', emoji: '🟡', label: 'Cheese sprinkle' }, { id: 'pineapple', emoji: '🟠', label: 'Pineapple chunk' }] } },
    { title: 'Tangrams', icon: '🔺', skill: 'Drag and turn the shapes so they fit on their shadow!',
      engine: 'tangram', config: { tolerancePx: 34, toleranceDeg: 20, pieces: [
        { shape: 'triLg', color: '#4FA8D8', target: { x: 26, y: 32, rotation: 0 } },
        { shape: 'triLg', color: '#E85D4C', target: { x: 55, y: 32, rotation: 90 } },
        { shape: 'triMd', color: '#F4A825', target: { x: 40, y: 50, rotation: 45 } },
        { shape: 'triSm', color: '#2F5D50', target: { x: 62, y: 55, rotation: 180 } },
        { shape: 'square', color: '#8E6BB0', target: { x: 40, y: 68, rotation: 0 } },
        { shape: 'parallelogram', color: '#2F5D50', target: { x: 62, y: 70, rotation: 0 } }
      ] } },
    { title: 'USA Geography Puzzle', icon: '🗺️', skill: 'Drag each state to its spot on the map!',
      engine: 'geomap', config: { tolerancePx: 50, states: [
        { id: 'CA', label: 'California', x: 12, y: 45 }, { id: 'TX', label: 'Texas', x: 40, y: 68 },
        { id: 'FL', label: 'Florida', x: 78, y: 82 }, { id: 'NY', label: 'New York', x: 80, y: 25 },
        { id: 'IL', label: 'Illinois', x: 58, y: 40 }, { id: 'WA', label: 'Washington', x: 15, y: 12 },
        { id: 'CO', label: 'Colorado', x: 38, y: 45 }, { id: 'ME', label: 'Maine', x: 88, y: 14 }
      ] } },
    { title: '100 Snowballs!', icon: '⛄', skill: 'Drag snowballs anywhere you want and build something fun!',
      engine: 'builder', config: { sceneEmoji: '❄️', sceneLabel: 'snow', unlimited: true, maxPlacements: 100,
        items: [{ id: 'snowball', emoji: '⚪', label: 'Snowball' }] } },
    { title: 'Break the Bank - Sorting', icon: '🪙', skill: 'Drag each coin into the bin that matches it!',
      engine: 'sorter', config: { mode: 'sort', easyHardToggle: true,
        bins: [{ id: 'penny', emoji: '🟤', label: 'Pennies' }, { id: 'nickel', emoji: '⚪', label: 'Nickels' },
               { id: 'dime', emoji: '⚪', label: 'Dimes' }, { id: 'quarter', emoji: '⚪', label: 'Quarters' }],
        items: [
          { id: 'p1', emoji: '🪙', label: 'Penny', binId: 'penny' }, { id: 'p2', emoji: '🪙', label: 'Penny', binId: 'penny' },
          { id: 'n1', emoji: '🪙', label: 'Nickel', binId: 'nickel' }, { id: 'n2', emoji: '🪙', label: 'Nickel', binId: 'nickel' },
          { id: 'd1', emoji: '🪙', label: 'Dime', binId: 'dime' }, { id: 'd2', emoji: '🪙', label: 'Dime', binId: 'dime' },
          { id: 'q1', emoji: '🪙', label: 'Quarter', binId: 'quarter' }, { id: 'q2', emoji: '🪙', label: 'Quarter', binId: 'quarter' }
        ] } },
    { title: 'Make a Robot', icon: '🤖', skill: 'Drag arms, eyes, and bolts to build your own robot!',
      engine: 'builder', config: { sceneEmoji: '🤖', sceneLabel: 'robot', maxPlacements: 10,
        items: [{ id: 'antenna', emoji: '📡', label: 'Antenna' }, { id: 'eye', emoji: '👁️', label: 'Eye' },
                { id: 'arm', emoji: '🦾', label: 'Arm' }, { id: 'bolt', emoji: '🔩', label: 'Bolt' }] } },
    { title: 'Make a Backpack', icon: '🎒', skill: 'Drag patches, pins, and keychains to decorate your backpack!',
      engine: 'builder', config: { sceneEmoji: '🎒', sceneLabel: 'backpack', maxPlacements: 10,
        items: [{ id: 'patch', emoji: '🏷️', label: 'Patch' }, { id: 'star', emoji: '⭐', label: 'Star pin' },
                { id: 'keychain', emoji: '🔑', label: 'Keychain' }, { id: 'ribbon', emoji: '🎀', label: 'Ribbon' }] } },
    { title: 'Create a Car', icon: '🚗', skill: 'Drag wheels, flames, and decals to build your own car!',
      engine: 'builder', config: { sceneEmoji: '🚗', sceneLabel: 'car', maxPlacements: 10,
        items: [{ id: 'wheel', emoji: '⚫', label: 'Wheel' }, { id: 'flame', emoji: '🔥', label: 'Flame decal' },
                { id: 'star', emoji: '⭐', label: 'Star decal' }, { id: 'flag', emoji: '🏁', label: 'Racing flag' }] } }
  ],

  3: [
    { title: 'Paint', icon: '🖌️', skill: 'Pick a color and brush size, then draw!',
      engine: 'paint', config: {} },
    { title: 'Magic Mirror Paint', icon: '🪞', skill: 'Draw on one side and watch it magically copy to the other side!',
      engine: 'paint', config: { mirrorMode: true } },
    { title: 'Pixel Art', icon: '🟪', skill: 'Click and drag across the grid to color in squares!',
      engine: 'pixelart', config: { gridSize: 16 } },
    { title: 'Animate', icon: '🎞️', skill: 'Draw a picture, then draw a new frame with small changes. Press Play to watch it move!',
      engine: 'paint', config: { frames: true, frameCount: 6 } },
    { title: '100 Snowballs!', icon: '⛄', skill: 'Drag snowballs anywhere you want and build something fun!',
      engine: 'builder', config: { sceneEmoji: '❄️', sceneLabel: 'snow', unlimited: true, maxPlacements: 100,
        items: [{ id: 'snowball', emoji: '⚪', label: 'Snowball' }, { id: 'ice', emoji: '🧊', label: 'Ice block' }] } },
    { title: 'Tangrams', icon: '🔺', skill: 'Drag and turn the shapes so they fit on their shadow!',
      engine: 'tangram', config: { tolerancePx: 28, toleranceDeg: 15, pieces: [
        { shape: 'triLg', color: '#4FA8D8', target: { x: 25, y: 30, rotation: 0 } },
        { shape: 'triLg', color: '#E85D4C', target: { x: 55, y: 30, rotation: 90 } },
        { shape: 'triMd', color: '#F4A825', target: { x: 38, y: 48, rotation: 45 } },
        { shape: 'triSm', color: '#2F5D50', target: { x: 60, y: 52, rotation: 180 } },
        { shape: 'triSm', color: '#8E6BB0', target: { x: 70, y: 40, rotation: 270 } },
        { shape: 'square', color: '#8E6BB0', target: { x: 38, y: 66, rotation: 0 } },
        { shape: 'parallelogram', color: '#2F5D50', target: { x: 60, y: 68, rotation: 0 } }
      ] } },
    { title: 'Bubble Pop Math', icon: '🫧', skill: 'Pop the bubbles that match the answer!',
      engine: 'bubblemath', config: {
        minOperand: 2, maxOperand: 15, minTarget: 8, maxTarget: 25,
        correctPerRound: 3, distractorCount: 7
      } },
    { title: 'Make a Face', icon: '🙂', skill: 'Drag eyes, hats, glasses, and more to build a silly face!',
      engine: 'builder', config: { sceneEmoji: '⚪', sceneLabel: 'face', maxPlacements: 16,
        items: [{ id: 'eye', emoji: '👁️', label: 'Eye' }, { id: 'nose', emoji: '👃', label: 'Nose' },
                { id: 'mouth', emoji: '👄', label: 'Mouth' }, { id: 'hair', emoji: '🦱', label: 'Hair' },
                { id: 'glasses', emoji: '👓', label: 'Glasses' }, { id: 'hat', emoji: '🎩', label: 'Hat' },
                { id: 'mustache', emoji: '👨', label: 'Mustache' }, { id: 'earring', emoji: '💎', label: 'Earring' }] } },
    { title: 'Make a Pizza', icon: '🍕', skill: 'Drag toppings like pepperoni, mushrooms, and pineapple onto your pizza!',
      engine: 'builder', config: { sceneEmoji: '🍕', sceneLabel: 'pizza', maxPlacements: 20,
        items: [{ id: 'pep', emoji: '🔴', label: 'Pepperoni' }, { id: 'olive', emoji: '🫒', label: 'Olive' },
                { id: 'pepper', emoji: '🟢', label: 'Pepper slice' }, { id: 'mushroom', emoji: '🟤', label: 'Mushroom slice' },
                { id: 'cheese', emoji: '🟡', label: 'Cheese sprinkle' }, { id: 'pineapple', emoji: '🟠', label: 'Pineapple chunk' },
                { id: 'basil', emoji: '🌿', label: 'Basil' }] } },
    { title: 'Make a Robot', icon: '🤖', skill: 'Drag arms, eyes, antennas, and a jetpack to build your own robot!',
      engine: 'builder', config: { sceneEmoji: '🤖', sceneLabel: 'robot', maxPlacements: 16,
        items: [{ id: 'antenna', emoji: '📡', label: 'Antenna' }, { id: 'eye', emoji: '👁️', label: 'Eye' },
                { id: 'arm', emoji: '🦾', label: 'Arm' }, { id: 'bolt', emoji: '🔩', label: 'Bolt' },
                { id: 'jetpack', emoji: '🚀', label: 'Jetpack' }, { id: 'claw', emoji: '🦞', label: 'Claw' }] } },
    { title: 'Make a Backpack', icon: '🎒', skill: 'Drag patches, pins, and keychains to decorate your backpack!',
      engine: 'builder', config: { sceneEmoji: '🎒', sceneLabel: 'backpack', maxPlacements: 16,
        items: [{ id: 'patch', emoji: '🏷️', label: 'Patch' }, { id: 'star', emoji: '⭐', label: 'Star pin' },
                { id: 'keychain', emoji: '🔑', label: 'Keychain' }, { id: 'ribbon', emoji: '🎀', label: 'Ribbon' },
                { id: 'button', emoji: '🔘', label: 'Button pin' }] } },
    { title: 'Make a Treehouse', icon: '🌳', skill: 'Drag planks, a ladder, and a flag to build your treehouse!',
      engine: 'builder', config: { sceneEmoji: '🌳', sceneLabel: 'treehouse', maxPlacements: 14,
        items: [{ id: 'plank', emoji: '🟫', label: 'Plank' }, { id: 'ladder', emoji: '🪜', label: 'Rope ladder' },
                { id: 'flag', emoji: '🚩', label: 'Flag' }, { id: 'window', emoji: '🪟', label: 'Window' }] } },
    { title: 'Pumpkin Carving', icon: '🎃', skill: 'Drag eyes and a mouth onto the pumpkin to carve a silly face!',
      engine: 'builder', config: { sceneEmoji: '🎃', sceneLabel: 'pumpkin', maxPlacements: 6,
        items: [{ id: 'tri-eye', emoji: '🔺', label: 'Triangle eye' }, { id: 'mouth', emoji: '⬛', label: 'Jagged mouth' },
                { id: 'nose', emoji: '🔻', label: 'Nose' }] } },
    { title: 'Make a Christmas Tree', icon: '🎄', skill: 'Drag ornaments, lights, and a star to decorate your tree!',
      engine: 'builder', config: { sceneEmoji: '🎄', sceneLabel: 'tree', maxPlacements: 16,
        items: [{ id: 'orn', emoji: '🔴', label: 'Ornament' }, { id: 'star', emoji: '⭐', label: 'Star topper' },
                { id: 'light', emoji: '💡', label: 'Light' }, { id: 'candy', emoji: '🍬', label: 'Candy cane' }] } },
    { title: 'Make a Gingerbread House', icon: '🏠', skill: 'Drag candy and icing to decorate your gingerbread house!',
      engine: 'builder', config: { sceneImage: 'assets/gingerbread-house.png', sceneLabel: 'gingerbread house', maxPlacements: 16,
        items: [{ id: 'gumdrop', emoji: '🍬', label: 'Gumdrop' }, { id: 'candycane', emoji: '🍭', label: 'Candy cane' },
                { id: 'icing', emoji: '🤍', label: 'Icing' }, { id: 'shingle', emoji: '🟫', label: 'Roof shingle' }] } },
    { title: 'Break the Bank - Counting', icon: '🏦', skill: 'Drag coins onto a goal until you reach that exact amount!',
      engine: 'sorter', config: { mode: 'count',
        // One reusable button per denomination — dragging never removes it,
        // so a whole practice session isn't limited to whatever coins
        // happened to be handed out.
        // Nickel, dime, and quarter share one realistic silver tone (real
        // US coins actually are the same metal color) — size and the
        // printed value are what tell them apart, same as real coins.
        coins: [
        { id: 'penny', label: 'Penny', tokenText: '1¢', color: '#B87333', tokenSize: 52, value: 1 },
        { id: 'nickel', label: 'Nickel', tokenText: '5¢', color: '#B8BCC0', tokenSize: 60, value: 5 },
        { id: 'dime', label: 'Dime', tokenText: '10¢', color: '#B8BCC0', tokenSize: 42, value: 10 },
        { id: 'quarter', label: 'Quarter', tokenText: '25¢', color: '#B8BCC0', tokenSize: 66, value: 25 }
        ],
        // Worked through one at a time, in order — finishing one reveals
        // the next. Mostly NOT round multiples of 25, so most goals take
        // an actual combination of coins rather than one coin dragged
        // repeatedly; a couple of round ones are mixed in for pacing.
        goals: [75, 83, 72, 105, 58, 91, 47, 130, 64, 99]
      } },
    { title: 'Litter Critters', icon: '♻️', skill: 'Drag each piece of trash into the bin where it belongs!',
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

// JavaScript always sorts number-like object keys (1, 2, 3) ahead of text keys
// ('K'), regardless of how they were written, so Object.keys(GAME_REGISTRY)
// can't be trusted for display order. This explicit list is the order the
// grade tabs should actually appear in.
const GRADE_ORDER = ['K', 1, 2, 3];
