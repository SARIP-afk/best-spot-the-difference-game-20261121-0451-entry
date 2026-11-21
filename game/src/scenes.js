// Twin Scenes — the three scenes, painted fresh by code on every frame.
// Each scene is one function that draws the same picture twice: variant 0 is
// the original (left panel), variant 1 is the changed copy (right panel).
// The ten differences of a scene are small, fair changes a player can find by
// studying the picture — a missing gull, a lamp gone dark, a sail that
// changed colour — never a wholesale redraw, so the two panels stay
// near-identical. Every difference is marked DIFF n in the painter and has
// one entry in the scene's `diffs` table: its centre and click radius in
// scene coordinates (600 x 560), plus the short name the game shows when it
// is found.
import { PANEL_W, PANEL_H } from './config.js';
import { sceneRandom, range } from './random.js';
import { rr, disc, sparkle, star5, cloud, gull, flower, vgrad } from './helpers.js';

// ---------------------------------------------------------------------------
// Scene 1 — Harbor Sunset: a sleepy marina at dusk.
// ---------------------------------------------------------------------------
function paintHarbor(ctx, variant) {
  const rng = sceneRandom(0);
  // Sky: dusk gradient, low sun, early stars, drifting clouds.
  ctx.fillStyle = vgrad(ctx, 0, 0, 330, [[0, '#2b1b4d'], [0.55, '#8e3f6d'], [1, '#ff9a5c']]);
  ctx.fillRect(0, 0, PANEL_W, 330);
  for (let i = 0; i < 14; i += 1) {
    sparkle(ctx, range(rng, 20, 580), range(rng, 16, 130), range(rng, 1.5, 3.2), 'rgba(255,255,255,0.85)');
  }
  // DIFF 7: the changed copy has one extra star, high on the right.
  if (variant === 1) sparkle(ctx, 520, 60, 3.4, '#ffffff');
  // The sun, low over the water, with a warm halo.
  const glow = ctx.createRadialGradient(430, 210, 10, 430, 210, 120);
  glow.addColorStop(0, 'rgba(255, 214, 110, 0.85)');
  glow.addColorStop(1, 'rgba(255, 214, 110, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(300, 80, 260, 260);
  ctx.fillStyle = '#ffd76e';
  disc(ctx, 430, 210, 46);
  ctx.fillStyle = '#ffedb0';
  disc(ctx, 430, 210, 34);
  cloud(ctx, 120, 120, 1.1, 'rgba(255, 170, 150, 0.85)');
  cloud(ctx, 500, 90, 0.8, 'rgba(255, 190, 170, 0.7)');
  // Three gulls cross the sky.
  gull(ctx, 140, 90, 1, '#2b1b4d');
  // DIFF 1: the middle gull is missing from the changed copy.
  if (variant === 0) gull(ctx, 190, 70, 1, '#2b1b4d');
  gull(ctx, 240, 100, 0.9, '#2b1b4d');
  // The sea, with the sun's glittering path and lazy wave lines.
  ctx.fillStyle = vgrad(ctx, 0, 330, 230, [[0, '#3d6a96'], [1, '#16294d']]);
  ctx.fillRect(0, 330, PANEL_W, 230);
  ctx.fillStyle = 'rgba(255, 214, 110, 0.5)';
  for (let i = 0; i < 9; i += 1) {
    const y = 350 + i * 20;
    ctx.fillRect(400 - i * 6, y, 60 + i * 10, 4);
  }
  ctx.strokeStyle = 'rgba(255,255,255,0.25)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 6; i += 1) {
    const y = 380 + i * 28;
    ctx.beginPath();
    ctx.moveTo(range(rng, 10, 120), y);
    ctx.quadraticCurveTo(300, y + 6, range(rng, 480, 590), y);
    ctx.stroke();
  }
  // A dark headland closes the left horizon.
  ctx.fillStyle = '#1d2f52';
  ctx.beginPath();
  ctx.moveTo(0, 330);
  ctx.quadraticCurveTo(70, 285, 150, 330);
  ctx.closePath();
  ctx.fill();
  // The lighthouse on the headland, red and white bands.
  ctx.fillStyle = '#f4ede0';
  ctx.fillRect(62, 205, 36, 125);
  ctx.fillStyle = '#d94f4f';
  ctx.fillRect(62, 235, 36, 18);
  ctx.fillRect(62, 275, 36, 18);
  ctx.fillStyle = '#2b2b3a';
  ctx.fillRect(58, 195, 44, 12);
  ctx.fillStyle = '#3a3a4d';
  ctx.beginPath();
  ctx.moveTo(56, 195);
  ctx.lineTo(80, 172);
  ctx.lineTo(104, 195);
  ctx.closePath();
  ctx.fill();
  // DIFF 2: the lamp burns in the original and is dark in the copy.
  if (variant === 0) {
    ctx.fillStyle = '#ffe27a';
    disc(ctx, 80, 186, 9);
    // Two narrow beams, soft at the edges, fanning out from the lamp.
    ctx.fillStyle = 'rgba(255, 226, 122, 0.22)';
    ctx.beginPath();
    ctx.moveTo(80, 182);
    ctx.lineTo(168, 164);
    ctx.lineTo(168, 196);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(80, 182);
    ctx.lineTo(4, 164);
    ctx.lineTo(4, 196);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = '#4a4a58';
    disc(ctx, 80, 186, 8);
  }
  // Houses on the right shore, one window warmly lit.
  ctx.fillStyle = '#f2d8a7';
  ctx.fillRect(420, 272, 70, 58);
  ctx.fillStyle = '#c65b4e';
  ctx.beginPath();
  ctx.moveTo(412, 272);
  ctx.lineTo(455, 240);
  ctx.lineTo(498, 272);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e8b877';
  ctx.fillRect(505, 286, 60, 44);
  ctx.fillStyle = '#7a4a3a';
  ctx.beginPath();
  ctx.moveTo(500, 286);
  ctx.lineTo(535, 258);
  ctx.lineTo(570, 286);
  ctx.closePath();
  ctx.fill();
  // DIFF 6: the left house's window is lit in the original, dark in the copy.
  ctx.fillStyle = variant === 0 ? '#ffe27a' : '#3a3f5a';
  ctx.fillRect(438, 288, 18, 20);
  ctx.fillStyle = '#3a3f5a';
  ctx.fillRect(518, 300, 16, 18);
  // A palm leans over the right shore.
  ctx.strokeStyle = '#5a3a28';
  ctx.lineWidth = 9;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(560, 330);
  ctx.quadraticCurveTo(552, 285, 562, 250);
  ctx.stroke();
  ctx.strokeStyle = '#2f7d3a';
  ctx.lineWidth = 6;
  for (const [dx, dy] of [[-38, -14], [-22, -30], [4, -34], [26, -26], [38, -8]]) {
    ctx.beginPath();
    ctx.moveTo(562, 250);
    ctx.quadraticCurveTo(562 + dx, 250 + dy, 562 + dx * 1.5, 250 + dy + 12);
    ctx.stroke();
  }
  // DIFF 5: three coconuts in the original, two in the copy.
  ctx.fillStyle = '#6b4a2f';
  disc(ctx, 552, 256, 6);
  disc(ctx, 566, 258, 6);
  if (variant === 0) disc(ctx, 559, 268, 6);
  // The wooden pier, its flag, and a coiled rope.
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(150, 400, 180, 12);
  ctx.fillStyle = '#5d3d22';
  for (let x = 160; x < 330; x += 22) ctx.fillRect(x, 412, 8, 26);
  ctx.strokeStyle = '#3a2a18';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(326, 400);
  ctx.lineTo(326, 352);
  ctx.stroke();
  // DIFF 8: the pier flag is red and points right in the original,
  // green and points left in the copy.
  ctx.fillStyle = variant === 0 ? '#d94f4f' : '#3f9e57';
  ctx.beginPath();
  if (variant === 0) {
    ctx.moveTo(326, 352);
    ctx.lineTo(356, 360);
    ctx.lineTo(326, 370);
  } else {
    ctx.moveTo(326, 352);
    ctx.lineTo(298, 360);
    ctx.lineTo(326, 370);
  }
  ctx.closePath();
  ctx.fill();
  // DIFF 10: a rope coil rests on the pier in the original only.
  if (variant === 0) {
    ctx.strokeStyle = '#c9a86a';
    ctx.lineWidth = 4;
    disc(ctx, 200, 406, 11);
    ctx.strokeStyle = '#a8844f';
    ctx.beginPath();
    ctx.arc(200, 406, 6, 0, Math.PI * 2);
    ctx.stroke();
  }
  // A sailboat with a striped sail, and a little rowboat.
  ctx.fillStyle = '#8a5a3b';
  ctx.beginPath();
  ctx.moveTo(272, 392);
  ctx.lineTo(330, 392);
  ctx.lineTo(318, 378);
  ctx.lineTo(284, 378);
  ctx.closePath();
  ctx.fill();
  ctx.strokeStyle = '#5d3d22';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(300, 380);
  ctx.lineTo(300, 322);
  ctx.stroke();
  // DIFF 3: the sail's stripe is red in the original, blue in the copy.
  ctx.fillStyle = '#f4ede0';
  ctx.beginPath();
  ctx.moveTo(300, 322);
  ctx.lineTo(300, 372);
  ctx.lineTo(336, 372);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = variant === 0 ? '#d94f4f' : '#3f6fd9';
  ctx.beginPath();
  ctx.moveTo(300, 340);
  ctx.lineTo(300, 356);
  ctx.lineTo(320, 356);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#e07840';
  ctx.beginPath();
  ctx.moveTo(470, 442);
  ctx.lineTo(500, 442);
  ctx.lineTo(492, 430);
  ctx.lineTo(478, 430);
  ctx.closePath();
  ctx.fill();
  // DIFF 4: the orange buoy bobs in the original and is gone in the copy.
  if (variant === 0) {
    ctx.fillStyle = '#e07840';
    disc(ctx, 520, 470, 12);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(508, 466, 24, 6);
    ctx.fillStyle = '#3a3f5a';
    ctx.fillRect(518, 452, 4, 8);
  }
  // DIFF 9: a fish leaps from the water in the original only.
  if (variant === 0) {
    ctx.strokeStyle = 'rgba(255,255,255,0.8)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(380, 428, 12, Math.PI, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = '#7fb2d9';
    ctx.beginPath();
    ctx.ellipse(380, 414, 12, 5, -0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#5d8fb5';
    ctx.beginPath();
    ctx.moveTo(390, 410);
    ctx.lineTo(398, 404);
    ctx.lineTo(396, 414);
    ctx.closePath();
    ctx.fill();
  }
}

const HARBOR_DIFFS = [
  { x: 190, y: 70, r: 30, name: 'the missing gull' },
  { x: 80, y: 186, r: 30, name: 'the lighthouse lamp' },
  { x: 308, y: 348, r: 30, name: 'the sail stripe' },
  { x: 520, y: 468, r: 30, name: 'the vanished buoy' },
  { x: 559, y: 260, r: 30, name: 'the palm coconuts' },
  { x: 447, y: 298, r: 30, name: 'the lit window' },
  { x: 520, y: 60, r: 30, name: 'the extra star' },
  { x: 326, y: 362, r: 30, name: 'the pier flag' },
  { x: 380, y: 416, r: 30, name: 'the leaping fish' },
  { x: 200, y: 406, r: 30, name: 'the rope coil' },
];

// ---------------------------------------------------------------------------
// Scene 2 — Garden Cottage: a cottage garden at noon.
// ---------------------------------------------------------------------------
function paintGarden(ctx, variant) {
  const rng = sceneRandom(1);
  // Sky, sun and drifting clouds.
  ctx.fillStyle = vgrad(ctx, 0, 0, 360, [[0, '#7ec3ee'], [1, '#d8f0ff']]);
  ctx.fillRect(0, 0, PANEL_W, 360);
  ctx.fillStyle = '#ffd94d';
  disc(ctx, 510, 80, 40);
  ctx.fillStyle = '#ffec9e';
  disc(ctx, 510, 80, 30);
  ctx.strokeStyle = '#ffd94d';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  for (let i = 0; i < 8; i += 1) {
    const a = (i * Math.PI) / 4;
    ctx.beginPath();
    ctx.moveTo(510 + Math.cos(a) * 48, 80 + Math.sin(a) * 48);
    ctx.lineTo(510 + Math.cos(a) * 60, 80 + Math.sin(a) * 60);
    ctx.stroke();
  }
  cloud(ctx, 110, 80, 1.2, '#ffffff');
  cloud(ctx, 320, 130, 0.9, '#f4fbff');
  // The lawn, dotted with clover and daisies.
  ctx.fillStyle = '#69b455';
  ctx.fillRect(0, 360, PANEL_W, 200);
  ctx.fillStyle = '#5da84e';
  for (let i = 0; i < 40; i += 1) {
    disc(ctx, range(rng, 10, 590), range(rng, 380, 550), range(rng, 3, 8));
  }
  for (let i = 0; i < 10; i += 1) {
    flower(ctx, range(rng, 30, 570), range(rng, 470, 540), 5, '#ffffff', '#ffd94d');
  }
  // The big tree on the left, apples and all.
  ctx.fillStyle = '#6b4a2f';
  ctx.fillRect(82, 250, 18, 115);
  ctx.fillStyle = '#3f8f3a';
  disc(ctx, 90, 210, 62);
  disc(ctx, 50, 240, 44);
  disc(ctx, 132, 242, 46);
  ctx.fillStyle = '#57a84e';
  disc(ctx, 70, 190, 34);
  disc(ctx, 112, 196, 30);
  ctx.fillStyle = '#d94f4f';
  disc(ctx, 62, 232, 6);
  disc(ctx, 118, 252, 6);
  disc(ctx, 92, 272, 6);
  // DIFF 3: a spotted mushroom grows at the tree's foot in the copy only.
  if (variant === 1) {
    ctx.fillStyle = '#f4ede0';
    ctx.fillRect(56, 432, 8, 12);
    ctx.fillStyle = '#d94f4f';
    ctx.beginPath();
    ctx.arc(60, 432, 13, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    disc(ctx, 55, 426, 2.5);
    disc(ctx, 65, 424, 2.5);
  }
  // The cottage: cream walls, terracotta roof, chimney, door and windows.
  ctx.fillStyle = '#f7ead0';
  ctx.fillRect(210, 250, 180, 130);
  ctx.fillStyle = '#c65b4e';
  ctx.beginPath();
  ctx.moveTo(195, 252);
  ctx.lineTo(300, 178);
  ctx.lineTo(405, 252);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#a84a3e';
  for (let x = 220; x < 390; x += 26) ctx.fillRect(x, 232, 3, 20);
  ctx.fillStyle = '#8a5a4a';
  ctx.fillRect(352, 188, 22, 52);
  ctx.fillStyle = '#a84a3e';
  ctx.fillRect(348, 182, 30, 10);
  // DIFF 1: chimney smoke curls up in the original and is gone in the copy.
  if (variant === 0) {
    ctx.fillStyle = 'rgba(240, 240, 240, 0.9)';
    disc(ctx, 366, 168, 9);
    disc(ctx, 374, 152, 12);
    disc(ctx, 366, 134, 9);
  }
  // The door, with a round knob and a little step.
  ctx.fillStyle = '#7a5230';
  rr(ctx, 282, 312, 36, 68, 6);
  ctx.fill();
  ctx.fillStyle = '#ffd94d';
  disc(ctx, 310, 348, 4);
  ctx.fillStyle = '#c9b18a';
  ctx.fillRect(274, 380, 52, 8);
  // Left window: curtains open in the original, drawn shut in the copy.
  ctx.fillStyle = '#bfe3f2';
  ctx.fillRect(226, 272, 44, 40);
  ctx.strokeStyle = '#7a5230';
  ctx.lineWidth = 4;
  ctx.strokeRect(226, 272, 44, 40);
  ctx.beginPath();
  ctx.moveTo(248, 272);
  ctx.lineTo(248, 312);
  ctx.stroke();
  // DIFF 2: the curtains.
  ctx.fillStyle = '#e0789e';
  if (variant === 0) {
    ctx.fillRect(226, 272, 8, 40);
    ctx.fillRect(262, 272, 8, 40);
  } else {
    ctx.fillRect(226, 272, 22, 40);
    ctx.fillRect(248, 272, 22, 40);
  }
  // Right window with a flower box.
  ctx.fillStyle = '#bfe3f2';
  ctx.fillRect(332, 272, 44, 40);
  ctx.strokeStyle = '#7a5230';
  ctx.lineWidth = 4;
  ctx.strokeRect(332, 272, 44, 40);
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(328, 312, 52, 12);
  flower(ctx, 338, 306, 5, '#d94f4f', '#ffd94d');
  flower(ctx, 354, 306, 5, '#e0789e', '#ffd94d');
  flower(ctx, 370, 306, 5, '#d94f4f', '#ffd94d');
  // The white picket fence, with a gap for the path.
  ctx.fillStyle = '#f4f4f0';
  for (let x = 24; x < 580; x += 26) {
    // DIFF 4: one picket is missing from the copy, left of the path.
    if (variant === 1 && x === 128) continue;
    if (x > 260 && x < 340) continue;
    ctx.beginPath();
    ctx.moveTo(x, 388);
    ctx.lineTo(x + 7, 380);
    ctx.lineTo(x + 14, 388);
    ctx.lineTo(x + 14, 414);
    ctx.lineTo(x, 414);
    ctx.closePath();
    ctx.fill();
  }
  ctx.fillRect(20, 396, 560, 5);
  // The stepping-stone path to the door.
  ctx.fillStyle = '#d8cbb2';
  const stones = [[300, 404], [286, 436], [312, 466], [296, 496], [308, 528]];
  for (const [sx, sy] of stones) {
    // DIFF 10: the fourth stone is missing from the copy.
    if (variant === 1 && sy === 496) continue;
    ctx.beginPath();
    ctx.ellipse(sx, sy, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  // A tulip bed along the bottom.
  const tulips = [[120, 500, '#d94f4f'], [170, 512, '#e0789e'], [430, 500, '#e0789e'], [480, 512, '#d94f4f']];
  for (const [tx, ty, tc] of tulips) flower(ctx, tx, ty, 7, tc, '#ffd94d');
  // DIFF 5: the tulip at the right is red in the original, white in the copy.
  flower(ctx, 450, 495, 7, variant === 0 ? '#d94f4f' : '#ffffff', '#ffd94d');
  // A butterfly drifts over the flowers.
  const bx = 180;
  const by = 448;
  // DIFF 7: orange wings in the original, blue wings in the copy.
  ctx.fillStyle = variant === 0 ? '#e07840' : '#4d8fd9';
  ctx.beginPath();
  ctx.ellipse(bx - 8, by - 4, 9, 6, -0.5, 0, Math.PI * 2);
  ctx.ellipse(bx + 8, by - 4, 9, 6, 0.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#3a2a18';
  ctx.fillRect(bx - 1.5, by - 8, 3, 14);
  // DIFF 6: the tabby cat naps on the fence in the original only.
  if (variant === 0) {
    ctx.fillStyle = '#e0a050';
    ctx.beginPath();
    ctx.ellipse(500, 372, 20, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    disc(ctx, 518, 360, 9);
    ctx.beginPath();
    ctx.moveTo(512, 354);
    ctx.lineTo(514, 344);
    ctx.lineTo(519, 353);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(522, 354);
    ctx.lineTo(525, 344);
    ctx.lineTo(528, 353);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#e0a050';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(482, 376);
    ctx.quadraticCurveTo(466, 372, 470, 358);
    ctx.stroke();
  }
  // A birdhouse on a pole, with a bird perched on its roof.
  ctx.fillStyle = '#7a5230';
  ctx.fillRect(516, 330, 8, 80);
  ctx.fillStyle = '#e8b877';
  ctx.fillRect(496, 288, 48, 40);
  ctx.fillStyle = '#c65b4e';
  ctx.beginPath();
  ctx.moveTo(490, 288);
  ctx.lineTo(520, 264);
  ctx.lineTo(550, 288);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#3a2a18';
  disc(ctx, 520, 308, 7);
  // DIFF 8: the little blue bird sits on the roof in the original only.
  if (variant === 0) {
    ctx.fillStyle = '#4d8fd9';
    ctx.beginPath();
    ctx.ellipse(520, 258, 9, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    disc(ctx, 527, 252, 5);
    ctx.fillStyle = '#e07840';
    ctx.beginPath();
    ctx.moveTo(531, 252);
    ctx.lineTo(537, 254);
    ctx.lineTo(531, 256);
    ctx.closePath();
    ctx.fill();
  }
  // DIFF 9: the green watering can by the path in the original only.
  if (variant === 0) {
    ctx.fillStyle = '#3f9e57';
    rr(ctx, 336, 452, 34, 24, 5);
    ctx.fill();
    ctx.strokeStyle = '#3f9e57';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(370, 460);
    ctx.lineTo(388, 448);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(336, 458);
    ctx.arc(332, 462, 8, Math.PI / 2, Math.PI * 1.5);
    ctx.stroke();
  }
}

const GARDEN_DIFFS = [
  { x: 368, y: 152, r: 30, name: 'the chimney smoke' },
  { x: 248, y: 292, r: 30, name: 'the window curtains' },
  { x: 60, y: 430, r: 30, name: 'the spotted mushroom' },
  { x: 135, y: 398, r: 30, name: 'the missing picket' },
  { x: 450, y: 495, r: 30, name: 'the white tulip' },
  { x: 500, y: 366, r: 30, name: 'the napping cat' },
  { x: 180, y: 448, r: 30, name: 'the blue butterfly' },
  { x: 520, y: 256, r: 30, name: 'the perched bird' },
  { x: 356, y: 462, r: 30, name: 'the watering can' },
  { x: 296, y: 496, r: 30, name: 'the missing stone' },
];

// ---------------------------------------------------------------------------
// Scene 3 — Lantern Market: a night market in full glow.
// ---------------------------------------------------------------------------
function paintMarket(ctx, variant) {
  const rng = sceneRandom(2);
  // Night sky, moon and stars.
  ctx.fillStyle = vgrad(ctx, 0, 0, 560, [[0, '#0e1a3d'], [0.6, '#1d2f5e'], [1, '#2c3f6e']]);
  ctx.fillRect(0, 0, PANEL_W, 560);
  for (let i = 0; i < 26; i += 1) {
    sparkle(ctx, range(rng, 15, 585), range(rng, 12, 220), range(rng, 1.4, 3), 'rgba(255,255,255,0.8)');
  }
  // DIFF 10: the changed copy has one extra star, up by the moon.
  if (variant === 1) sparkle(ctx, 150, 55, 3.2, '#ffffff');
  // The moon, pale and cratered.
  ctx.fillStyle = '#f4ecd0';
  disc(ctx, 90, 80, 34);
  ctx.fillStyle = '#e0d4ae';
  disc(ctx, 80, 72, 7);
  disc(ctx, 100, 88, 5);
  disc(ctx, 96, 66, 4);
  // String lights sag across the top of the market.
  ctx.strokeStyle = '#3a2a18';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(20, 60);
  ctx.quadraticCurveTo(300, 130, 580, 60);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(20, 130);
  ctx.quadraticCurveTo(300, 190, 580, 130);
  ctx.stroke();
  // Bulbs hang from the wire: their y follows the same quadratic curve the
  // wire was drawn with, plus a short drop.
  function wireY(t, y0, yc) {
    return (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * yc + t * t * y0;
  }
  for (let i = 0; i < 11; i += 1) {
    const t = i / 10;
    const x = 20 + t * 560;
    const y = wireY(t, 60, 130) + 14;
    const on = !(variant === 1 && i === 5);
    // DIFF 1: the middle bulb of the top string is dark in the copy.
    ctx.fillStyle = on ? '#ffd94d' : '#3a3f5a';
    disc(ctx, x, y, 6);
    if (on) {
      ctx.fillStyle = 'rgba(255, 217, 77, 0.25)';
      disc(ctx, x, y, 11);
    }
  }
  for (let i = 0; i < 9; i += 1) {
    const t = i / 8;
    const x = 40 + t * 520;
    const y = wireY(t, 130, 190) + 14;
    ctx.fillStyle = i % 2 === 0 ? '#ff9a5c' : '#7ec3ee';
    disc(ctx, x, y, 5);
  }
  // Bunting strung between the stalls.
  ctx.strokeStyle = '#3a2a18';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(40, 200);
  ctx.quadraticCurveTo(300, 240, 560, 200);
  ctx.stroke();
  const flagColors = ['#d94f4f', '#ffd94d', '#3f9e57', '#4d8fd9', '#e0789e'];
  for (let i = 0; i < 12; i += 1) {
    const t = (i + 0.5) / 12;
    const x = 40 + t * 520;
    const y = wireY(t, 200, 240) + 4;
    // DIFF 3: the fourth flag is red in the original, green in the copy.
    let c = flagColors[i % flagColors.length];
    if (i === 3 && variant === 1) c = '#3f9e57';
    ctx.fillStyle = c;
    ctx.beginPath();
    ctx.moveTo(x - 9, y);
    ctx.lineTo(x + 9, y);
    ctx.lineTo(x, y + 16);
    ctx.closePath();
    ctx.fill();
  }
  // The ground: warm cobbles in lamplight.
  ctx.fillStyle = '#4a3a52';
  ctx.fillRect(0, 470, PANEL_W, 90);
  ctx.fillStyle = '#5d4a68';
  for (let i = 0; i < 30; i += 1) {
    disc(ctx, range(rng, 10, 590), range(rng, 480, 550), range(rng, 4, 9));
  }
  // Stall helper: a striped awning, posts and a counter.
  function stall(x, w, awning, counterTop) {
    ctx.fillStyle = awning[0];
    ctx.beginPath();
    ctx.moveTo(x, 300);
    ctx.lineTo(x + w, 300);
    ctx.lineTo(x + w, 268);
    ctx.lineTo(x, 268);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = awning[1];
    for (let sx = x + w / 6; sx < x + w; sx += w / 3) ctx.fillRect(sx, 268, w / 6, 32);
    ctx.fillStyle = '#5d3d22';
    ctx.fillRect(x + 6, 300, 8, 170);
    ctx.fillRect(x + w - 14, 300, 8, 170);
    ctx.fillStyle = counterTop;
    ctx.fillRect(x, 400, w, 14);
    ctx.fillStyle = '#6b4a2f';
    ctx.fillRect(x + 6, 414, w - 12, 56);
  }
  stall(40, 200, ['#d94f4f', '#f4ede0'], '#8a5a3b');
  stall(250, 170, ['#2f8f7a', '#f4ede0'], '#8a5a3b');
  stall(430, 150, ['#7a5ad9', '#f4ede0'], '#8a5a3b');
  // Stall signs.
  ctx.fillStyle = '#f4ede0';
  rr(ctx, 90, 272, 100, 26, 6);
  ctx.fill();
  // DIFF 8: the left stall sells NOODLES in the original, NOODLE in the copy.
  ctx.fillStyle = '#2b2b3a';
  ctx.font = 'bold 15px Trebuchet MS, Verdana, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(variant === 0 ? 'NOODLES' : 'NOODLE', 140, 286);
  ctx.fillStyle = '#f4ede0';
  rr(ctx, 290, 272, 90, 26, 6);
  ctx.fill();
  ctx.fillStyle = '#2b2b3a';
  ctx.fillText('LANTERNS', 335, 286);
  ctx.fillStyle = '#f4ede0';
  rr(ctx, 460, 272, 90, 26, 6);
  ctx.fill();
  ctx.fillStyle = '#2b2b3a';
  ctx.fillText('SWEETS', 505, 286);
  // Jars and goods on the left counter.
  ctx.fillStyle = '#e07840';
  rr(ctx, 70, 372, 26, 28, 5);
  ctx.fill();
  ctx.fillStyle = '#ffd94d';
  rr(ctx, 104, 372, 26, 28, 5);
  ctx.fill();
  // DIFF 9: a third jar stands on the left counter in the original only.
  if (variant === 0) {
    ctx.fillStyle = '#7ec3ee';
    rr(ctx, 138, 372, 26, 28, 5);
    ctx.fill();
  }
  // A steaming pot on the left stall.
  ctx.fillStyle = '#3a3f5a';
  ctx.beginPath();
  ctx.ellipse(200, 388, 26, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#2b2b3a';
  ctx.fillRect(186, 372, 28, 8);
  // DIFF 7: steam curls from the pot in the original and is gone in the copy.
  if (variant === 0) {
    ctx.strokeStyle = 'rgba(255,255,255,0.75)';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(196, 366);
    ctx.quadraticCurveTo(188, 348, 196, 332);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(208, 366);
    ctx.quadraticCurveTo(216, 346, 208, 328);
    ctx.stroke();
  }
  // Paper lanterns hang from the middle stall.
  ctx.strokeStyle = '#3a2a18';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(400, 300);
  ctx.lineTo(400, 330);
  ctx.stroke();
  // DIFF 2: the hanging lantern is red in the original, green in the copy.
  ctx.fillStyle = variant === 0 ? '#d94f4f' : '#3f9e57';
  ctx.beginPath();
  ctx.ellipse(400, 348, 16, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.5)';
  ctx.fillRect(394, 332, 12, 6);
  ctx.fillStyle = '#ffd94d';
  disc(ctx, 300, 352, 12);
  ctx.fillStyle = '#e07840';
  disc(ctx, 356, 356, 10);
  // The vendor behind the middle counter.
  ctx.fillStyle = '#e8b877';
  disc(ctx, 330, 352, 16);
  ctx.fillStyle = '#3f6fd9';
  rr(ctx, 306, 366, 48, 36, 10);
  ctx.fill();
  ctx.fillStyle = '#2b2b3a';
  disc(ctx, 324, 352, 2);
  disc(ctx, 336, 352, 2);
  ctx.strokeStyle = '#2b2b3a';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(330, 358, 5, 0.15 * Math.PI, 0.85 * Math.PI);
  ctx.stroke();
  // DIFF 6: a wide straw hat in the original, a red cap in the copy.
  if (variant === 0) {
    ctx.fillStyle = '#d9b36a';
    ctx.beginPath();
    ctx.ellipse(330, 338, 26, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(330, 338, 12, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.fillStyle = '#d94f4f';
    ctx.beginPath();
    ctx.arc(330, 340, 13, Math.PI, 0);
    ctx.closePath();
    ctx.fill();
    ctx.fillRect(330, 338, 14, 4);
  }
  // DIFF 4: the black cat sits on the middle stall's roof in the original only.
  if (variant === 0) {
    ctx.fillStyle = '#2b2b3a';
    ctx.beginPath();
    ctx.ellipse(300, 258, 16, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    disc(ctx, 314, 248, 7);
    ctx.beginPath();
    ctx.moveTo(309, 243);
    ctx.lineTo(311, 235);
    ctx.lineTo(315, 242);
    ctx.closePath();
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(317, 243);
    ctx.lineTo(320, 235);
    ctx.lineTo(322, 242);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = '#2b2b3a';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(286, 260);
    ctx.quadraticCurveTo(274, 256, 278, 246);
    ctx.stroke();
  }
  // Sweets on the right counter: wrapped candies and a cake.
  ctx.fillStyle = '#e0789e';
  disc(ctx, 470, 388, 8);
  ctx.fillStyle = '#ffd94d';
  disc(ctx, 492, 388, 8);
  ctx.fillStyle = '#f4ede0';
  rr(ctx, 520, 376, 34, 24, 5);
  ctx.fill();
  ctx.fillStyle = '#d94f4f';
  disc(ctx, 537, 372, 3);
  // DIFF 5: three crates stack by the right stall in the original, two in the copy.
  ctx.fillStyle = '#8a6a3b';
  ctx.fillRect(478, 448, 30, 22);
  ctx.fillRect(510, 448, 30, 22);
  ctx.fillRect(494, 424, 30, 22);
  if (variant === 0) {
    ctx.fillRect(494, 400, 30, 22);
    ctx.strokeStyle = '#5d3d22';
    ctx.lineWidth = 2;
    ctx.strokeRect(494, 400, 30, 22);
  }
  ctx.strokeStyle = '#5d3d22';
  ctx.lineWidth = 2;
  ctx.strokeRect(478, 448, 30, 22);
  ctx.strokeRect(510, 448, 30, 22);
  ctx.strokeRect(494, 424, 30, 22);
}

const MARKET_DIFFS = [
  { x: 300, y: 109, r: 30, name: 'the dark bulb' },
  { x: 400, y: 348, r: 30, name: 'the green lantern' },
  { x: 192, y: 220, r: 30, name: 'the bunting flag' },
  { x: 300, y: 252, r: 30, name: 'the roof cat' },
  { x: 509, y: 412, r: 30, name: 'the top crate' },
  { x: 330, y: 340, r: 30, name: "the vendor's hat" },
  { x: 200, y: 348, r: 30, name: 'the pot steam' },
  { x: 140, y: 285, r: 30, name: 'the stall sign' },
  { x: 151, y: 386, r: 30, name: 'the blue jar' },
  { x: 150, y: 55, r: 30, name: 'the extra star' },
];

// ---------------------------------------------------------------------------
// The catalogue: one entry per level, in play order.
// ---------------------------------------------------------------------------
export const SCENES = [
  { id: 'harbor', draw: paintHarbor, diffs: HARBOR_DIFFS },
  { id: 'garden', draw: paintGarden, diffs: GARDEN_DIFFS },
  { id: 'market', draw: paintMarket, diffs: MARKET_DIFFS },
];

export function sceneById(id) {
  return SCENES.find((s) => s.id === id) ?? SCENES[0];
}
