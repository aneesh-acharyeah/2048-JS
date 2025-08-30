// Get DOM elements
const game = document.getElementById('game');
const scoreDisplay = document.getElementById('score');

// Game state
let grid = [];
let score = 0;

// Initialize the game
function init() {
  grid = Array.from({ length: 4 }, () => Array(4).fill(0));
  score = 0;
  addRandom();
  addRandom();
  draw();
}

// Add a random 2 or 4 to an empty cell
function addRandom() {
  const empty = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) {
        empty.push({ r, c });
      }
    }
  }
  if (empty.length === 0) return;
  const { r, c } = empty[Math.floor(Math.random() * empty.length)];
  grid[r][c] = Math.random() < 0.9 ? 2 : 4;
}

// Render the grid to the DOM
function draw() {
  game.innerHTML = '';
  grid.forEach(row => {
    row.forEach(val => {
      const tile = document.createElement('div');
      tile.classList.add('tile');
      if (val) {
        tile.textContent = val;
        tile.style.background = getColor(val);
      } else {
        tile.textContent = '';
        tile.style.background = '#333';
      }
      game.appendChild(tile);
    });
  });
  scoreDisplay.textContent = `Score: ${score}`;
}

// Return color based on tile value
function getColor(val) {
  const colors = {
    2: '#6EE7B7',
    4: '#3B82F6',
    8: '#F59E0B',
    16: '#EF4444',
    32: '#8B5CF6',
    64: '#EC4899',
    128: '#10B981',
    256: '#2563EB',
    512: '#D97706',
    1024: '#B91C1C',
    2048: '#4C1D95'
  };
  return colors[val] || '#111';
}

// Slide and merge a single row (leftward logic)
function slide(row) {
  let arr = row.filter(val => val); // Remove zeros
  for (let i = 0; i < arr.length - 1; i++) {
    if (arr[i] === arr[i + 1]) {
      arr[i] *= 2;
      score += arr[i];
      arr[i + 1] = 0;
    }
  }
  arr = arr.filter(val => val); // Remove merged zeros
  while (arr.length < 4) arr.push(0); // Pad with zeros
  return arr;
}

// Rotate the grid clockwise (used to reuse slide logic)
function rotateGrid(times = 1) {
  for (let t = 0; t < times; t++) {
    const newGrid = Array.from({ length: 4 }, () => Array(4).fill(0));
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        newGrid[c][3 - r] = grid[r][c];
      }
    }
    grid = newGrid;
  }
}

// Handle movement based on direction
function move(dir) {
  // 0: left, 1: up, 2: right, 3: down
  const rotated = dir;
  rotateGrid(rotated);
  let moved = false;

  for (let r = 0; r < 4; r++) {
    const newRow = slide(grid[r]);
    if (grid[r].toString() !== newRow.toString()) moved = true;
    grid[r] = newRow;
  }

  // Rotate back to original orientation
  rotateGrid((4 - rotated) % 4);

  if (moved) addRandom();
  draw();

  if (isGameOver()) {
    setTimeout(() => {
      alert('Game Over! Final Score: ' + score);
    }, 100);
  }
}

// Check if no more moves are possible
function isGameOver() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (grid[r][c] === 0) return false;
      if (c < 3 && grid[r][c] === grid[r][c + 1]) return false;
      if (r < 3 && grid[r][c] === grid[r + 1][c]) return false;
    }
  }
  return true;
}

// Keyboard controls
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') move(0);
  if (e.key === 'ArrowUp') move(1);
  if (e.key === 'ArrowRight') move(2);
  if (e.key === 'ArrowDown') move(3);
});

// Start the game
init();
