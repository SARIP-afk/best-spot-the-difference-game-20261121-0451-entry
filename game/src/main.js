// Twin Scenes — the bootstrap: grab the canvas, build a fresh game, wire
// the input, and run the frame loop. The clock ticks here; render.js draws;
// state.js decides. A ?shot=start|play|almost|win query stages one of the
// screenshot scenes instead of the title screen, for the maker's own
// screenshots (see shots.json); normal play always starts on the title.
import { newGame, tick, prune } from './state.js';
import { render } from './render.js';
import { attachInput } from './input.js';
import { stageShot } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const state = newGame();
const input = attachInput(canvas, state, () => {
  const status = document.getElementById('status');
  if (status !== null) status.textContent = state.message;
});

const params = new URLSearchParams(window.location.search);
const shot = params.get('shot');
if (shot !== null) stageShot(shot, state);

// The driver and the play-test harness read the live game through this.
window.__twinScenes = { state };

let last = performance.now();
function frame(now) {
  const dt = Math.min(0.1, (now - last) / 1000);
  last = now;
  tick(state, dt, now);
  prune(state, now);
  render(ctx, state, input.mouse(), now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
