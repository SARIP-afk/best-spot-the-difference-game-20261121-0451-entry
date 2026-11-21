// Twin Scenes — everything the player sees, drawn on one 1280 x 800 canvas:
// the top bar (title, counter, timer, score), the two scene panels with
// their markers, the bottom bar (buttons, level tabs, message line), the
// magnifier loupe, and the title / pause / level-done / game-done overlays.
// render.js never changes the game; input.js owns that.
import {
  STAGE_W,
  STAGE_H,
  PANEL_W,
  PANEL_H,
  PANEL_Y,
  PANEL_LEFT_X,
  PANEL_RIGHT_X,
  TOP_BAR_H,
  BOTTOM_BAR_Y,
  HINTS_PER_LEVEL,
} from './config.js';
import { rr, disc } from './helpers.js';
import {
  SCREEN_TITLE,
  SCREEN_PAUSED,
  SCREEN_LEVEL_DONE,
  SCREEN_GAME_DONE,
  currentLevel,
  currentScene,
  diffsLeft,
  formatTime,
} from './state.js';

const INK = '#f4f0e4';
const MUTED_INK = '#9fb0d8';
const GOLD = '#ffd94d';
const GREEN = '#43c465';
const RED = '#e05252';
const PANEL_BG = '#0e1424';

/** Canvas rectangle of one panel: 0 is the original (left), 1 the copy. */
export function panelRect(panel) {
  return {
    x: panel === 0 ? PANEL_LEFT_X : PANEL_RIGHT_X,
    y: PANEL_Y,
    w: PANEL_W,
    h: PANEL_H,
  };
}

/** Scene coordinates (600 x 560) to canvas coordinates inside a panel. */
export function sceneToCanvas(panel, sx, sy) {
  const r = panelRect(panel);
  return { x: r.x + sx, y: r.y + sy };
}

/** Which panel, if any, a canvas point is over, with scene coordinates. */
export function canvasToScene(px, py) {
  for (const panel of [0, 1]) {
    const r = panelRect(panel);
    if (px >= r.x && px < r.x + r.w && py >= r.y && py < r.y + r.h) {
      return { panel, x: px - r.x, y: py - r.y };
    }
  }
  return null;
}

// Button and card rectangles, recomputed each frame so input.js can hit-test
// exactly what render.js drew. Buttons live on the bottom bar; overlay
// buttons only exist on their screen.
export function layout(state) {
  const out = {
    buttons: {
      hint: { x: 24, y: BOTTOM_BAR_Y + 16, w: 168, h: 46 },
      restart: { x: 204, y: BOTTOM_BAR_Y + 16, w: 150, h: 46 },
      loupe: { x: 366, y: BOTTOM_BAR_Y + 16, w: 150, h: 46 },
      mute: { x: 528, y: BOTTOM_BAR_Y + 16, w: 140, h: 46 },
    },
    tabs: [
      { x: 700, y: BOTTOM_BAR_Y + 16, w: 178, h: 46, level: 0 },
      { x: 890, y: BOTTOM_BAR_Y + 16, w: 178, h: 46, level: 1 },
      { x: 1080, y: BOTTOM_BAR_Y + 16, w: 176, h: 46, level: 2 },
    ],
    overlayButton: null,
  };
  if (state.screen === SCREEN_TITLE) {
    out.overlayButton = { x: 490, y: 588, w: 300, h: 56, label: 'Play — Level 1' };
  } else if (state.screen === SCREEN_LEVEL_DONE) {
    const failed = state.stars === 0;
    out.overlayButton = {
      x: 490,
      y: 560,
      w: 300,
      h: 56,
      label: failed ? 'Try This Level Again' : state.levelIndex < 2 ? 'Next Level' : 'See My Results',
    };
  } else if (state.screen === SCREEN_GAME_DONE) {
    out.overlayButton = { x: 490, y: 580, w: 300, h: 56, label: 'Play Again' };
  }
  return out;
}

function drawButton(ctx, rect, label, active, hover) {
  ctx.fillStyle = active ? '#2c4a7a' : hover ? '#22355c' : '#1b2742';
  rr(ctx, rect.x, rect.y, rect.w, rect.h, 10);
  ctx.fill();
  ctx.strokeStyle = active ? GOLD : '#3a4a72';
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.fillStyle = active ? GOLD : INK;
  ctx.font = 'bold 15px Trebuchet MS, Verdana, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(label, rect.x + rect.w / 2, rect.y + rect.h / 2 + 1);
}

function drawTopBar(ctx, state) {
  ctx.fillStyle = '#141a2e';
  ctx.fillRect(0, 0, STAGE_W, TOP_BAR_H);
  ctx.fillStyle = '#0c1120';
  ctx.fillRect(0, TOP_BAR_H - 2, STAGE_W, 2);
  const level = currentLevel(state);
  // Left: the game's name and the scene being hunted.
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 24px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText('SPOT THE DIFFERENCE', 24, 30);
  ctx.fillStyle = MUTED_INK;
  ctx.font = '13px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText(`Level ${state.levelIndex + 1} · ${level.name} — ${level.sub}`, 24, 50);
  // Centre: how many differences are still hiding, and the progress dots.
  const left = diffsLeft(state);
  const total = currentScene(state).diffs.length;
  ctx.textAlign = 'center';
  ctx.fillStyle = left === 0 ? GREEN : INK;
  ctx.font = 'bold 30px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText(`${left} LEFT`, STAGE_W / 2, 34);
  const dotGap = 22;
  const dotsW = (total - 1) * dotGap;
  for (let i = 0; i < total; i += 1) {
    ctx.fillStyle = state.found.has(i) ? GREEN : '#3a4a72';
    disc(ctx, STAGE_W / 2 - dotsW / 2 + i * dotGap, 52, 6);
  }
  // Right: the clock and the score.
  ctx.textAlign = 'right';
  ctx.fillStyle = state.timeLeft <= 30 && state.screen === 'play' ? RED : INK;
  ctx.font = 'bold 26px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText(`TIME ${formatTime(state.timeLeft)}`, 1256, 30);
  ctx.fillStyle = MUTED_INK;
  ctx.font = 'bold 15px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText(`SCORE ${state.score.toLocaleString('en-US')}`, 1256, 52);
}

function drawPanels(ctx, state, now) {
  const scene = currentScene(state);
  // Panel labels sit in the gap between the top bar and the pictures.
  ctx.textAlign = 'left';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = MUTED_INK;
  ctx.font = 'bold 13px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText('ORIGINAL', PANEL_LEFT_X + 4, PANEL_Y - 8);
  ctx.fillText('FIND THE CHANGES', PANEL_RIGHT_X + 4, PANEL_Y - 8);
  for (const panel of [0, 1]) {
    const r = panelRect(panel);
    ctx.save();
    ctx.beginPath();
    ctx.rect(r.x, r.y, r.w, r.h);
    ctx.clip();
    ctx.fillStyle = PANEL_BG;
    ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.translate(r.x, r.y);
    scene.draw(ctx, panel);
    ctx.restore();
    // Frame.
    ctx.strokeStyle = '#2c3a5e';
    ctx.lineWidth = 3;
    ctx.strokeRect(r.x + 1, r.y + 1, r.w - 2, r.h - 2);
    // Found differences: a green ring and a check on BOTH panels.
    for (const index of state.found) {
      const d = scene.diffs[index];
      for (const p of [0, 1]) {
        const c = sceneToCanvas(p, d.x, d.y);
        ctx.strokeStyle = GREEN;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 24, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 4.5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(c.x - 10, c.y);
        ctx.lineTo(c.x - 3, c.y + 7);
        ctx.lineTo(c.x + 11, c.y - 8);
        ctx.stroke();
      }
    }
    // The hint's pulsing gold ring, on both panels at once.
    if (state.hintTarget !== -1 && now < state.hintUntil) {
      const d = scene.diffs[state.hintTarget];
      const pulse = 26 + Math.sin(now / 180) * 5;
      for (const p of [0, 1]) {
        const c = sceneToCanvas(p, d.x, d.y);
        ctx.strokeStyle = GOLD;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(c.x, c.y, pulse, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 217, 77, 0.12)';
        ctx.beginPath();
        ctx.arc(c.x, c.y, pulse, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    // Fresh finds pop: an expanding ring and the points earned.
    for (const pop of state.pops) {
      const age = now - pop.at;
      // The frame clock can trail the event clock by a frame or two, so a
      // just-born pop may read a negative age: clamp it to the start.
      const k = Math.max(0, Math.min(1, age / 700));
      for (const p of [0, 1]) {
        const c = sceneToCanvas(p, pop.x, pop.y);
        ctx.strokeStyle = `rgba(67, 196, 101, ${1 - k})`;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(c.x, c.y, 24 + k * 26, 0, Math.PI * 2);
        ctx.stroke();
      }
      const c = sceneToCanvas(1, pop.x, pop.y);
      ctx.fillStyle = `rgba(255, 217, 77, ${1 - k})`;
      ctx.font = 'bold 20px Trebuchet MS, Verdana, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`+${pop.gained}`, c.x, c.y - 34 - k * 18);
    }
    // Wrong clicks flash a red X where they landed, on that panel only.
    for (const miss of state.misses) {
      const age = now - miss.at;
      const k = Math.max(0, Math.min(1, age / 900));
      const c = sceneToCanvas(miss.panel, miss.x, miss.y);
      ctx.strokeStyle = `rgba(224, 82, 82, ${1 - k})`;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(c.x - 11, c.y - 11);
      ctx.lineTo(c.x + 11, c.y + 11);
      ctx.moveTo(c.x + 11, c.y - 11);
      ctx.lineTo(c.x - 11, c.y + 11);
      ctx.stroke();
    }
  }
}

function drawBottomBar(ctx, state, mouse) {
  const lay = layout(state);
  ctx.fillStyle = '#141a2e';
  ctx.fillRect(0, BOTTOM_BAR_Y, STAGE_W, STAGE_H - BOTTOM_BAR_Y);
  ctx.fillStyle = '#0c1120';
  ctx.fillRect(0, BOTTOM_BAR_Y, STAGE_W, 2);
  const hover = (rect) =>
    mouse !== null &&
    mouse.x >= rect.x &&
    mouse.x < rect.x + rect.w &&
    mouse.y >= rect.y &&
    mouse.y < rect.y + rect.h;
  drawButton(ctx, lay.buttons.hint, `Hint (H) · ${state.hintsLeft} left`, false, hover(lay.buttons.hint));
  drawButton(ctx, lay.buttons.restart, 'Restart (R)', false, hover(lay.buttons.restart));
  drawButton(ctx, lay.buttons.loupe, state.loupe ? 'Loupe (L) · On' : 'Loupe (L)', state.loupe, hover(lay.buttons.loupe));
  drawButton(ctx, lay.buttons.mute, state.muted ? 'Sound (M) · Off' : 'Sound (M) · On', false, hover(lay.buttons.mute));
  for (const tab of lay.tabs) {
    const active = tab.level === state.levelIndex;
    drawButton(
      ctx,
      tab,
      `${tab.level + 1} · ${['Harbor', 'Garden', 'Market'][tab.level]}`,
      active,
      hover(tab),
    );
  }
  // The message line: what just happened, or a nudge to keep hunting.
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = state.messageUntil > performance.now() ? GOLD : MUTED_INK;
  ctx.font = '15px Trebuchet MS, Verdana, sans-serif';
  const msg =
    state.messageUntil > performance.now()
      ? state.message
      : 'Study both pictures — the differences are small, fair, and hiding in plain sight.';
  ctx.fillText(msg, STAGE_W / 2, BOTTOM_BAR_Y + 116);
}

/** The magnifier: a 2x loupe that follows the mouse over a panel. */
function drawLoupe(ctx, state, mouse) {
  if (!state.loupe || mouse === null) return;
  const hit = canvasToScene(mouse.x, mouse.y);
  if (hit === null) return;
  const R = 75;
  const src = { x: mouse.x - R / 2, y: mouse.y - R / 2, w: R, h: R };
  ctx.save();
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, R, 0, Math.PI * 2);
  ctx.clip();
  ctx.drawImage(ctx.canvas, src.x, src.y, src.w, src.h, mouse.x - R, mouse.y - R, R * 2, R * 2);
  ctx.restore();
  ctx.strokeStyle = GOLD;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(mouse.x, mouse.y, R, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = 'rgba(255, 217, 77, 0.6)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(mouse.x - 6, mouse.y);
  ctx.lineTo(mouse.x + 6, mouse.y);
  ctx.moveTo(mouse.x, mouse.y - 6);
  ctx.lineTo(mouse.x, mouse.y + 6);
  ctx.stroke();
}

function drawStar(ctx, x, y, r, filled) {
  ctx.fillStyle = filled ? GOLD : '#3a4a72';
  ctx.beginPath();
  for (let i = 0; i < 10; i += 1) {
    const rad = i % 2 === 0 ? r : r * 0.45;
    const a = -Math.PI / 2 + (i * Math.PI) / 5;
    const px = x + Math.cos(a) * rad;
    const py = y + Math.sin(a) * rad;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

function drawCard(ctx, x, y, w, h) {
  ctx.fillStyle = 'rgba(10, 14, 28, 0.72)';
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = '#1b2742';
  rr(ctx, x, y, w, h, 18);
  ctx.fill();
  ctx.strokeStyle = '#3a4a72';
  ctx.lineWidth = 2;
  ctx.stroke();
}

function drawTitleScreen(ctx, state) {
  drawCard(ctx, 290, 110, 700, 540);
  ctx.textAlign = 'center';
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 46px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText('SPOT THE DIFFERENCE', 640, 178);
  ctx.fillStyle = INK;
  ctx.font = '22px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText('Twin Scenes — a cozy hidden-difference hunt', 640, 214);
  ctx.fillStyle = MUTED_INK;
  ctx.font = '16px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText('Two pictures sit side by side. They look identical — they are not.', 640, 256);
  ctx.fillText('Click every difference you spot. Wrong clicks cost 5 seconds.', 640, 282);
  ctx.fillText('Hints (H) point at one hiding difference. The loupe (L) zooms in.', 640, 308);
  // The three levels, as cards of their own.
  const levels = [
    ['1 · Harbor Sunset', 'a sleepy marina at dusk'],
    ['2 · Garden Cottage', 'a cottage garden at noon'],
    ['3 · Lantern Market', 'a night market in full glow'],
  ];
  levels.forEach(([name, sub], i) => {
    const y = 340 + i * 56;
    ctx.fillStyle = i === 0 ? '#2c4a7a' : '#22355c';
    rr(ctx, 360, y, 560, 44, 10);
    ctx.fill();
    ctx.fillStyle = INK;
    ctx.font = 'bold 16px Trebuchet MS, Verdana, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(name, 380, y + 19);
    ctx.fillStyle = MUTED_INK;
    ctx.font = '13px Trebuchet MS, Verdana, sans-serif';
    ctx.fillText(sub, 380, y + 37);
    ctx.fillStyle = MUTED_INK;
    ctx.font = '15px Trebuchet MS, Verdana, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('10 differences · 3:00', 900, y + 28);
  });
  ctx.textAlign = 'center';
  ctx.fillStyle = MUTED_INK;
  ctx.font = '15px Trebuchet MS, Verdana, sans-serif';
  if (state.best > 0) ctx.fillText(`Best total score: ${state.best.toLocaleString('en-US')}`, 640, 566);
  else ctx.fillText('No best score yet — make this the run that sets it.', 640, 566);
  const lay = layout(state);
  drawButton(ctx, lay.overlayButton, lay.overlayButton.label, true, false);
}

function drawPaused(ctx) {
  drawCard(ctx, 440, 300, 400, 180);
  ctx.textAlign = 'center';
  ctx.fillStyle = INK;
  ctx.font = 'bold 34px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText('Paused', 640, 372);
  ctx.fillStyle = MUTED_INK;
  ctx.font = '16px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText('Press P or Esc to keep hunting.', 640, 408);
  ctx.fillText('Or press R to restart this level.', 640, 436);
}

function drawLevelDone(ctx, state) {
  const failed = state.stars === 0;
  drawCard(ctx, 340, 150, 600, 470);
  ctx.textAlign = 'center';
  ctx.fillStyle = failed ? RED : GOLD;
  ctx.font = 'bold 38px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText(failed ? "Time's Up!" : 'Level Clear!', 640, 214);
  if (!failed) {
    for (let i = 0; i < 3; i += 1) {
      drawStar(ctx, 580 + i * 60, 268, 24, i < state.stars);
    }
  }
  ctx.fillStyle = INK;
  ctx.font = '18px Trebuchet MS, Verdana, sans-serif';
  const found = state.found.size;
  const total = currentScene(state).diffs.length;
  ctx.fillText(
    failed
      ? `You found ${found} of ${total} differences before the clock ran out.`
      : `You found all ${total} differences in ${currentLevel(state).name}.`,
    640,
    322,
  );
  ctx.fillStyle = MUTED_INK;
  ctx.font = '16px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText(`Level score: ${state.levelScore.toLocaleString('en-US')}  ·  Time left: ${formatTime(state.timeLeft)}`, 640, 356);
  ctx.fillText(`Wrong clicks: ${state.wrong}  ·  Hints used: ${HINTS_PER_LEVEL - state.hintsLeft}`, 640, 384);
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 20px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText(`Total score: ${state.score.toLocaleString('en-US')}`, 640, 424);
  ctx.fillStyle = MUTED_INK;
  ctx.font = '15px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText(
    failed ? 'The differences are still there — have another look.' : 'Press Enter for the next level.',
    640,
    456,
  );
  const lay = layout(state);
  drawButton(ctx, lay.overlayButton, lay.overlayButton.label, true, false);
}

function drawGameDone(ctx, state) {
  drawCard(ctx, 340, 140, 600, 500);
  ctx.textAlign = 'center';
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 38px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText('You Found Them All!', 640, 204);
  ctx.fillStyle = INK;
  ctx.font = '18px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText('Three scenes, thirty differences, none left hiding.', 640, 244);
  for (let i = 0; i < 3; i += 1) drawStar(ctx, 580 + i * 60, 292, 24, true);
  ctx.fillStyle = GOLD;
  ctx.font = 'bold 26px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText(`Total score: ${state.score.toLocaleString('en-US')}`, 640, 352);
  ctx.fillStyle = MUTED_INK;
  ctx.font = '16px Trebuchet MS, Verdana, sans-serif';
  ctx.fillText(`Best total score: ${state.best.toLocaleString('en-US')}`, 640, 386);
  ctx.fillText('Thanks for playing Twin Scenes — press Enter to hunt again.', 640, 420);
  const lay = layout(state);
  drawButton(ctx, lay.overlayButton, lay.overlayButton.label, true, false);
}

/** Draw one frame of the game. */
export function render(ctx, state, mouse, now) {
  ctx.clearRect(0, 0, STAGE_W, STAGE_H);
  ctx.fillStyle = '#0c1120';
  ctx.fillRect(0, 0, STAGE_W, STAGE_H);
  drawTopBar(ctx, state);
  drawPanels(ctx, state, now);
  drawBottomBar(ctx, state, mouse);
  if (state.screen === SCREEN_TITLE) drawTitleScreen(ctx, state);
  else if (state.screen === SCREEN_PAUSED) drawPaused(ctx);
  else if (state.screen === SCREEN_LEVEL_DONE) drawLevelDone(ctx, state);
  else if (state.screen === SCREEN_GAME_DONE) drawGameDone(ctx, state);
  drawLoupe(ctx, state, mouse);
}
