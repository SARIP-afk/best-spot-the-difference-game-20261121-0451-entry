// Twin Scenes — mouse and keyboard: clicks on the panels, the buttons and
// the level tabs, and the keys that make the game playable without a mouse
// on the buttons. A click is converted to canvas coordinates, then to scene
// coordinates when it lands on a panel; state.js decides what it means.
import { SCREEN_TITLE, SCREEN_PLAY, SCREEN_PAUSED, SCREEN_LEVEL_DONE, SCREEN_GAME_DONE, clickAt, useHint, startLevel, nextLevel, newGame } from './state.js';
import { layout, canvasToScene } from './render.js';
import { playFound, playMiss, playLevelClear, playHint, playClick, setMuted } from './audio.js';

/** Canvas coordinates of a pointer event, honouring the canvas's own scale. */
export function eventPoint(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((event.clientX - rect.left) / rect.width) * canvas.width,
    y: ((event.clientY - rect.top) / rect.height) * canvas.height,
  };
}

/** True when a point is inside a rectangle. */
function inside(point, rect) {
  return point.x >= rect.x && point.x < rect.x + rect.w && point.y >= rect.y && point.y < rect.y + rect.h;
}

/** Wire the canvas and the keyboard up to a game state object. */
export function attachInput(canvas, state, onScreenChange) {
  let mouse = null;

  function announce() {
    const status = document.getElementById('status');
    if (status !== null) {
      status.textContent = state.message;
    }
  }

  function overlayClick(point) {
    const lay = layout(state);
    if (lay.overlayButton !== null && inside(point, lay.overlayButton)) {
      playClick();
      if (state.screen === SCREEN_TITLE) {
        startLevel(state, 0);
        onScreenChange();
      } else if (state.screen === SCREEN_LEVEL_DONE) {
        if (state.stars === 0) startLevel(state, state.levelIndex);
        else nextLevel(state);
        onScreenChange();
      } else if (state.screen === SCREEN_GAME_DONE) {
        const fresh = newGame();
        fresh.best = state.best;
        Object.assign(state, fresh);
        startLevel(state, 0);
        onScreenChange();
      }
      return true;
    }
    return false;
  }

  function bottomBarClick(point) {
    const lay = layout(state);
    if (inside(point, lay.buttons.hint)) {
      if (useHint(state, performance.now())) playHint();
      announce();
      return true;
    }
    if (inside(point, lay.buttons.restart)) {
      playClick();
      startLevel(state, state.levelIndex);
      onScreenChange();
      return true;
    }
    if (inside(point, lay.buttons.loupe)) {
      playClick();
      state.loupe = !state.loupe;
      return true;
    }
    if (inside(point, lay.buttons.mute)) {
      state.muted = !state.muted;
      setMuted(state.muted);
      playClick();
      return true;
    }
    for (const tab of lay.tabs) {
      if (inside(point, tab)) {
        playClick();
        startLevel(state, tab.level);
        onScreenChange();
        return true;
      }
    }
    return false;
  }

  canvas.addEventListener('pointermove', (event) => {
    mouse = eventPoint(canvas, event);
  });
  canvas.addEventListener('pointerleave', () => {
    mouse = null;
  });

  canvas.addEventListener('pointerdown', (event) => {
    const point = eventPoint(canvas, event);
    mouse = point;
    if (state.screen === SCREEN_TITLE || state.screen === SCREEN_LEVEL_DONE || state.screen === SCREEN_GAME_DONE) {
      if (overlayClick(point)) return;
    }
    if (state.screen === SCREEN_PAUSED) return;
    if (bottomBarClick(point)) return;
    const hit = canvasToScene(point.x, point.y);
    if (hit === null) return;
    const before = state.screen;
    const result = clickAt(state, hit.x, hit.y, hit.panel, performance.now());
    if (result === 'found') {
      playFound();
      if (state.screen === SCREEN_LEVEL_DONE && before === SCREEN_PLAY) playLevelClear();
    } else if (result === 'miss') {
      playMiss();
    }
    announce();
  });

  window.addEventListener('keydown', (event) => {
    const now = performance.now();
    const key = event.key.toLowerCase();
    if (key === 'enter' || key === ' ') {
      event.preventDefault();
      if (state.screen === SCREEN_TITLE) {
        playClick();
        startLevel(state, 0);
        onScreenChange();
      } else if (state.screen === SCREEN_LEVEL_DONE) {
        playClick();
        if (state.stars === 0) startLevel(state, state.levelIndex);
        else nextLevel(state);
        onScreenChange();
      } else if (state.screen === SCREEN_GAME_DONE) {
        const fresh = newGame();
        fresh.best = state.best;
        Object.assign(state, fresh);
        startLevel(state, 0);
        onScreenChange();
      }
      return;
    }
    if (key === 'h') {
      if (useHint(state, now)) playHint();
      announce();
      return;
    }
    if (key === 'r') {
      if (state.screen === SCREEN_PLAY || state.screen === SCREEN_PAUSED) {
        playClick();
        startLevel(state, state.levelIndex);
        onScreenChange();
      }
      return;
    }
    if (key === 'm') {
      state.muted = !state.muted;
      setMuted(state.muted);
      return;
    }
    if (key === 'l') {
      state.loupe = !state.loupe;
      return;
    }
    if (key === 'p' || key === 'escape') {
      if (state.screen === SCREEN_PLAY) {
        state.screen = SCREEN_PAUSED;
        onScreenChange();
      } else if (state.screen === SCREEN_PAUSED) {
        state.screen = SCREEN_PLAY;
        onScreenChange();
      }
      return;
    }
    if (key >= '1' && key <= '3') {
      const level = Number(key) - 1;
      if (state.screen === SCREEN_PLAY || state.screen === SCREEN_PAUSED || state.screen === SCREEN_TITLE) {
        playClick();
        startLevel(state, level);
        onScreenChange();
      }
    }
  });

  return {
    mouse: () => mouse,
  };
}
