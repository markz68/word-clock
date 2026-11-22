const assert = require('node:assert/strict');
const grid = require('../grid.js');

assert.equal(grid.rows.length, 10);
grid.rows.forEach(row => assert.equal(row.length, 11));
const hourNames = ['twelve', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven'];
for (const [key, [row, col, length]] of Object.entries(grid.words)) {
  const expected = key.startsWith('h') && /^h\d+$/.test(key) ? hourNames[Number(key.slice(1)) % 12] : key;
  assert.equal(grid.rows[row].slice(col, col + length).toLowerCase(), expected, key);
}

// Decode the face independently and check that its phrase plus dots represents
// the original minute, especially when TO advances the displayed hour.
const value = { five: 5, ten: 10, quarter: 15, twenty: 20, half: 30 };
for (let hour = 0; hour < 24; hour++) {
  for (let minute = 0; minute < 60; minute++) {
    const result = grid.time(hour, minute);
    const active = new Set(result.cells);
    assert.equal(active.size, result.cells.length, 'Active words must not overlap');
    assert(result.cells.every(cell => cell >= 0 && cell < 110));
    for (const key of result.keys) {
      const [row, col, length] = grid.words[key];
      for (let n = 0; n < length; n++) assert(active.has(row * 11 + col + n));
    }
    const shownHour = Number(result.keys.find(key => /^h\d+$/.test(key)).slice(1));
    const offset = result.keys.reduce((sum, key) => sum + (value[key] || 0), 0);
    const decoded = (shownHour % 12 * 60 + (result.keys.includes('to') ? -offset : offset) + result.dots + 720) % 720;
    assert.equal(decoded, hour % 12 * 60 + minute, `${hour}:${minute}`);
    assert.equal(result.dots, minute % 5);
    assert.equal(result.keys.includes('oclock'), minute < 5);
    assert.equal(result.keys.includes('to'), minute >= 35);
    assert.equal(result.keys.includes('past'), minute >= 5 && minute < 35);
  }
}
assert.equal(grid.time(13, 47).phrase, 'It is quarter to two plus 2 extra minutes.');
assert.equal(grid.time(23, 59).phrase, 'It is five to twelve plus 4 extra minutes.');
assert.equal(grid.time(0, 0).phrase, 'It is twelve o’clock.');
assert.equal(grid.time(12, 0).phrase, 'It is twelve o’clock.');
console.log('Letter Grid: face spelling and all 1,440 daily minutes passed.');
