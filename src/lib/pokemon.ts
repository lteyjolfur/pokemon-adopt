export type Move = {
  name: string;
  type: string;
};

export const FALLBACK_SPRITE =
  'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/185.png';

type SpriteSet = {
  front_default: string | null | undefined;
  other: { 'official-artwork': { front_default: string | null | undefined } };
};

// Picks the regular and official-artwork sprites, falling back when missing.
export const pickSprites = (sprites: SpriteSet): { sprite: string; hdSprite: string } => ({
  sprite: sprites.front_default || FALLBACK_SPRITE,
  hdSprite: sprites.other['official-artwork'].front_default || FALLBACK_SPRITE,
});

// Shuffles a copy of the moves and returns up to `count` of them.
export const pickRandomMoves = <T>(moves: T[], count = 4, random: () => number = Math.random): T[] =>
  [...moves].sort(() => 0.5 - random()).slice(0, count);

// Returns a Pokédex number in 1..max for random values in (0, 1).
export const randomPokemonNumber = (max = 151, random: () => number = Math.random): number =>
  Math.ceil(random() * max);
