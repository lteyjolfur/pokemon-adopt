import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  FALLBACK_SPRITE,
  pickRandomMoves,
  pickSprites,
  randomPokemonNumber,
} from '../src/lib/pokemon.ts';

const sprites = (front: string | null, art: string | null) => ({
  front_default: front,
  other: { 'official-artwork': { front_default: art } },
});

test('pickSprites returns both sprites when present', () => {
  assert.deepEqual(pickSprites(sprites('a.png', 'b.png')), { sprite: 'a.png', hdSprite: 'b.png' });
});

test('pickSprites falls back when sprites are missing', () => {
  assert.deepEqual(pickSprites(sprites(null, null)), {
    sprite: FALLBACK_SPRITE,
    hdSprite: FALLBACK_SPRITE,
  });
});

test('pickRandomMoves returns at most the requested count', () => {
  const moves = ['a', 'b', 'c', 'd', 'e', 'f'];
  assert.equal(pickRandomMoves(moves, 4).length, 4);
  assert.equal(pickRandomMoves(['a', 'b'], 4).length, 2);
  assert.deepEqual(pickRandomMoves([], 4), []);
});

test('pickRandomMoves only returns distinct moves from the input and does not mutate it', () => {
  const moves = ['a', 'b', 'c', 'd', 'e', 'f'];
  const picked = pickRandomMoves(moves, 4);
  assert.equal(new Set(picked).size, picked.length);
  for (const m of picked) assert.ok(moves.includes(m));
  assert.deepEqual(moves, ['a', 'b', 'c', 'd', 'e', 'f']);
});

test('pickRandomMoves is deterministic with an injected random source', () => {
  const moves = ['a', 'b', 'c', 'd', 'e'];
  assert.deepEqual(pickRandomMoves(moves, 3, () => 0.5), ['a', 'b', 'c']);
});

test('randomPokemonNumber maps random values into 1..max', () => {
  assert.equal(randomPokemonNumber(151, () => 0.0001), 1);
  assert.equal(randomPokemonNumber(151, () => 0.5), 76);
  assert.equal(randomPokemonNumber(151, () => 0.9999), 151);
});

test('randomPokemonNumber stays within range for Math.random', () => {
  for (let i = 0; i < 1000; i++) {
    const n = randomPokemonNumber();
    assert.ok(Number.isInteger(n) && n >= 1 && n <= 151, `out of range: ${n}`);
  }
});
