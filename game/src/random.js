// Twin Scenes — a small seeded random source, so the scatter a scene paints
// (stars, pebbles, petals, sparks) is identical in both panels and identical
// on every run. The differences are never random: they are fixed by hand in
// scenes.js, so the game is fair and the same for every player.

/** mulberry32: a tiny deterministic PRNG. */
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** One seeded stream per scene, so each scene's scatter is fixed. */
export function sceneRandom(sceneIndex) {
  return mulberry32(0x9e3779b9 + sceneIndex * 7919);
}

/** A float in [min, max). */
export function range(rng, min, max) {
  return min + rng() * (max - min);
}

/** An integer in [min, max]. */
export function rangeInt(rng, min, max) {
  return min + Math.floor(rng() * (max - min + 1));
}

/** One element of an array, picked by the stream. */
export function pick(rng, items) {
  return items[Math.floor(rng() * items.length)];
}
