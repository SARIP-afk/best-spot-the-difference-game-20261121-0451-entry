// Twin Scenes — the screenshot scenes behind ?shot=start|play|almost|win.
// Each one plays the real game forward from a fresh state, using the same
// clickAt / useHint / finishLevel rules a player uses, so every frame is
// what a short game really looks like and the same shot always gives the
// same frame. The cover shot is mid-hunt: four differences found and marked
// on both panels, six still hiding, the counter reading 6 LEFT.
import { SCREEN_TITLE } from './state.js';
import { startLevel, clickAt, currentScene } from './state.js';

/** Find the first `count` differences of the current level, for real. */
function findFirst(state, count, now) {
  const diffs = currentScene(state).diffs;
  for (let i = 0; i < count && i < diffs.length; i += 1) {
    clickAt(state, diffs[i].x, diffs[i].y, 1, now + i * 100);
  }
}

/**
 * Set the game to the named scene and return the state to draw.
 * Unknown names stage the title screen.
 */
export function stageShot(name, state) {
  const now = performance.now();
  if (name === 'play') {
    startLevel(state, 0);
    state.timeLeft = 135;
    findFirst(state, 4, now);
    state.message = 'Four found — six still hiding in the harbor.';
    state.messageUntil = now + 60000;
    return state;
  }
  if (name === 'almost') {
    startLevel(state, 1);
    state.timeLeft = 42;
    findFirst(state, 9, now);
    // The hint is ringing the last hiding difference on both panels.
    state.hintTarget = 9;
    state.hintUntil = now + 60000;
    state.hintsLeft = 2;
    state.message = 'One left — the hint is ringing it. Can you see it?';
    state.messageUntil = now + 60000;
    return state;
  }
  if (name === 'win') {
    startLevel(state, 0);
    state.timeLeft = 95;
    findFirst(state, 10, now);
    return state;
  }
  state.screen = SCREEN_TITLE;
  return state;
}
