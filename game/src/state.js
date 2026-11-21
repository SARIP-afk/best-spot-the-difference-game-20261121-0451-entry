// Twin Scenes — the game's state: which screen is up, what this level's
// hunt looks like, the score, the timer, the hints, and the little
// celebrations that play when a difference is found. Pure data and rules;
// render.js draws it, input.js changes it.
import {
  LEVELS,
  WRONG_TIME_COST,
  HINTS_PER_LEVEL,
  HINT_COST,
  HINT_SECONDS,
  FIND_POINTS,
  COMBO_WINDOW_MS,
  COMBO_STEP,
  TIME_BONUS_PER_SECOND,
  FIND_RADIUS,
} from './config.js';
import { SCENES } from './scenes.js';

export const SCREEN_TITLE = 'title';
export const SCREEN_PLAY = 'play';
export const SCREEN_PAUSED = 'paused';
export const SCREEN_LEVEL_DONE = 'levelDone';
export const SCREEN_GAME_DONE = 'gameDone';

/** A fresh game: title screen, level 1, nothing found yet. */
export function newGame() {
  return {
    screen: SCREEN_TITLE,
    levelIndex: 0,
    // Indices into the current scene's diffs table that are already found.
    found: new Set(),
    clicks: 0,
    wrong: 0,
    hintsLeft: HINTS_PER_LEVEL,
    hintTarget: -1,
    hintUntil: 0,
    timeLeft: LEVELS[0].time,
    score: 0,
    levelScore: 0,
    combo: 0,
    lastFindAt: 0,
    stars: 0,
    // Recent finds, for the pop animation and the "found" toast: {x, y, at}.
    pops: [],
    // Wrong clicks, for the red X flash: {x, y, panel, at}.
    misses: [],
    message: 'Click a difference — it appears on both pictures at once.',
    messageUntil: 0,
    muted: false,
    loupe: false,
    // Best total across sessions, kept in localStorage when the browser has it.
    best: readBest(),
    startedAt: 0,
  };
}

function readBest() {
  try {
    return Number(window.localStorage.getItem('twin-scenes-best') ?? 0) || 0;
  } catch {
    return 0;
  }
}

function writeBest(value) {
  try {
    window.localStorage.setItem('twin-scenes-best', String(value));
  } catch {
    // Private mode or no storage: the best score just does not persist.
  }
}

export function currentLevel(state) {
  return LEVELS[state.levelIndex];
}

export function currentScene(state) {
  return SCENES[state.levelIndex];
}

export function diffsLeft(state) {
  return currentScene(state).diffs.length - state.found.size;
}

/** Start (or restart) the current level with a full timer and fresh hints. */
export function startLevel(state, levelIndex) {
  state.levelIndex = levelIndex;
  state.screen = SCREEN_PLAY;
  state.found = new Set();
  state.clicks = 0;
  state.wrong = 0;
  state.hintsLeft = HINTS_PER_LEVEL;
  state.hintTarget = -1;
  state.hintUntil = 0;
  state.timeLeft = LEVELS[levelIndex].time;
  state.levelScore = 0;
  state.combo = 0;
  state.lastFindAt = 0;
  state.stars = 0;
  state.pops = [];
  state.misses = [];
  state.message = `Level ${levelIndex + 1}: ${LEVELS[levelIndex].name} — find ${SCENES[levelIndex].diffs.length} differences.`;
  state.messageUntil = performance.now() + 4000;
  state.startedAt = performance.now();
}

/** The nearest unfound difference to a click in scene coordinates, if any. */
export function nearestDiff(state, x, y) {
  const diffs = currentScene(state).diffs;
  let best = -1;
  let bestDist = FIND_RADIUS;
  for (let i = 0; i < diffs.length; i += 1) {
    if (state.found.has(i)) continue;
    const dx = diffs[i].x - x;
    const dy = diffs[i].y - y;
    const d = Math.hypot(dx, dy);
    if (d <= bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}

/**
 * Handle a click inside a panel. Returns 'found' | 'miss' | 'already'.
 * A find scores points, grows the combo when it follows the last find
 * quickly, and pops a marker on both panels; a miss costs five seconds.
 */
export function clickAt(state, x, y, panel, now) {
  if (state.screen !== SCREEN_PLAY) return 'already';
  state.clicks += 1;
  const index = nearestDiff(state, x, y);
  if (index === -1) {
    state.wrong += 1;
    state.combo = 0;
    state.timeLeft = Math.max(0, state.timeLeft - WRONG_TIME_COST);
    state.misses.push({ x, y, panel, at: now });
    state.message = `Not quite — that costs ${WRONG_TIME_COST} seconds. Look closer!`;
    state.messageUntil = now + 2500;
    return 'miss';
  }
  state.found.add(index);
  const diff = currentScene(state).diffs[index];
  const quick = now - state.lastFindAt <= COMBO_WINDOW_MS && state.lastFindAt !== 0;
  state.combo = quick ? state.combo + 1 : 1;
  const gained = FIND_POINTS + (state.combo - 1) * COMBO_STEP;
  state.score += gained;
  state.levelScore += gained;
  state.lastFindAt = now;
  state.pops.push({ x: diff.x, y: diff.y, at: now, gained });
  state.message = `Found ${diff.name}! ${diffsLeft(state)} to go.`;
  state.messageUntil = now + 2500;
  if (state.found.size === currentScene(state).diffs.length) {
    finishLevel(state, now);
  }
  return 'found';
}

/** Stars for a cleared level: time left and accuracy both count. */
export function starsFor(state) {
  const accuracy = state.clicks === 0 ? 1 : 1 - state.wrong / state.clicks;
  if (state.timeLeft >= 60 && accuracy >= 0.9) return 3;
  if (state.timeLeft >= 20 && accuracy >= 0.75) return 2;
  return 1;
}

function finishLevel(state, now) {
  const bonus = Math.round(state.timeLeft) * TIME_BONUS_PER_SECOND;
  state.score += bonus;
  state.levelScore += bonus;
  state.stars = starsFor(state);
  state.screen = SCREEN_LEVEL_DONE;
  state.message = `Level clear! Time bonus +${bonus}.`;
  state.messageUntil = now + 4000;
  if (state.score > state.best) {
    state.best = state.score;
    writeBest(state.score);
  }
}

/** Advance after a cleared level, or open the final screen after level 3. */
export function nextLevel(state) {
  if (state.levelIndex + 1 < LEVELS.length) {
    startLevel(state, state.levelIndex + 1);
  } else {
    state.screen = SCREEN_GAME_DONE;
    if (state.score > state.best) {
      state.best = state.score;
      writeBest(state.score);
    }
  }
}

/** Spend a hint: pulse a ring around one difference not yet found. */
export function useHint(state, now) {
  if (state.screen !== SCREEN_PLAY) return false;
  if (state.hintsLeft <= 0) {
    state.message = 'No hints left on this level — trust your eyes!';
    state.messageUntil = now + 2500;
    return false;
  }
  const remaining = currentScene(state).diffs.map((d, i) => i).filter((i) => !state.found.has(i));
  if (remaining.length === 0) return false;
  state.hintsLeft -= 1;
  state.score = Math.max(0, state.score - HINT_COST);
  state.hintTarget = remaining[Math.floor(Math.random() * remaining.length)];
  state.hintUntil = now + HINT_SECONDS * 1000;
  state.message = `Hint: look near ${currentScene(state).diffs[state.hintTarget].name}. (-${HINT_COST} pts)`;
  state.messageUntil = now + 3000;
  return true;
}

/** Tick the clock down; time running out ends the level in a retry screen. */
export function tick(state, dtSeconds, now) {
  if (state.screen !== SCREEN_PLAY) return;
  state.timeLeft -= dtSeconds;
  if (state.timeLeft <= 0) {
    state.timeLeft = 0;
    state.screen = SCREEN_LEVEL_DONE;
    state.stars = 0;
    state.message = "Time's up! The differences are still hiding — try again.";
    state.messageUntil = now + 4000;
  }
}

/** Drop animations older than two seconds so the lists stay short. */
export function prune(state, now) {
  state.pops = state.pops.filter((p) => now - p.at < 2000);
  state.misses = state.misses.filter((m) => now - m.at < 900);
  if (state.hintTarget !== -1 && now > state.hintUntil) state.hintTarget = -1;
}

/** mm:ss for the timer. */
export function formatTime(seconds) {
  const s = Math.max(0, Math.ceil(seconds));
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;
}
