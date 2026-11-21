// Twin Scenes — the little canvas shapes every scene painter shares, so the
// three scenes read as one game: soft round rectangles, stars, clouds, birds,
// flowers and string lights, all drawn with the 2D context alone.

/** A filled rounded rectangle path. */
export function rr(ctx, x, y, w, h, r) {
  const rad = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + rad, y);
  ctx.arcTo(x + w, y, x + w, y + h, rad);
  ctx.arcTo(x + w, y + h, x, y + h, rad);
  ctx.arcTo(x, y + h, x, y, rad);
  ctx.arcTo(x, y, x + w, y, rad);
  ctx.closePath();
}

/** A filled circle. */
export function disc(ctx, x, y, r) {
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

/** A four-point sparkle star, the kind that reads at a glance. */
export function sparkle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y - r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.quadraticCurveTo(x, y, x, y + r);
  ctx.quadraticCurveTo(x, y, x - r, y);
  ctx.quadraticCurveTo(x, y, x, y - r);
  ctx.fill();
}

/** A five-point star. */
export function star5(ctx, x, y, r, color) {
  ctx.fillStyle = color;
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

/** A puffy cloud of three overlapping discs. */
export function cloud(ctx, x, y, s, color) {
  ctx.fillStyle = color;
  disc(ctx, x, y, 16 * s);
  disc(ctx, x + 18 * s, y + 4 * s, 13 * s);
  disc(ctx, x - 18 * s, y + 5 * s, 12 * s);
  disc(ctx, x + 4 * s, y - 9 * s, 13 * s);
}

/** A gull: two short arcs, the way a distant bird reads. */
export function gull(ctx, x, y, s, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.4 * s;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(x - 9 * s, y);
  ctx.quadraticCurveTo(x - 4 * s, y - 6 * s, x, y);
  ctx.quadraticCurveTo(x + 4 * s, y - 6 * s, x + 9 * s, y);
  ctx.stroke();
}

/** A simple five-petal flower on a stem. */
export function flower(ctx, x, y, r, petal, centre) {
  ctx.strokeStyle = '#2f7d3a';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x, y + 16);
  ctx.stroke();
  ctx.fillStyle = petal;
  for (let i = 0; i < 5; i += 1) {
    const a = (i * Math.PI * 2) / 5 - Math.PI / 2;
    disc(ctx, x + Math.cos(a) * r * 0.62, y + Math.sin(a) * r * 0.62, r * 0.55);
  }
  ctx.fillStyle = centre;
  disc(ctx, x, y, r * 0.42);
}

/** A vertical linear gradient helper: stops as [offset, color] pairs. */
export function vgrad(ctx, x, y, h, stops) {
  const g = ctx.createLinearGradient(x, y, x, y + h);
  for (const [offset, color] of stops) g.addColorStop(offset, color);
  return g;
}
