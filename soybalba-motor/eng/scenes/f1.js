// Formato 1: "¿Qué pasaría si…?" — shared layout
let CH = null, SEG = null;
window.setup = (d) => {
  SEG = d.segs;
  const all = d.segs.flatMap(s => s.words);
  CH = buildChunks(all, 3, 15);
};
function beat(t) { let b = 0; for (let i = 0; i < SEG.length; i++) if (t >= SEG[i].s - .1) b = i; return b; }
function wordT(i, k) { return SEG[i].words[Math.min(k, SEG[i].words.length - 1)].s; }
function findWord(i, re) { const w = SEG[i].words.find(w => re.test(w.w)); return w ? w.s : SEG[i].s; }

function seriesHeader(t, premise) {
  const p = pop(t, 0, .4);
  ctx.save(); ctx.translate(W / 2, 175); ctx.scale(p, p);
  pill(0, 0, '¿QUÉ PASARÍA SI…?', 62, '#ff3d6e', '#fff', { rot: -.03 });
  ctx.restore();
  if (premise) {
    const q = pop(t, .25, .4);
    ctx.save(); ctx.translate(W / 2, 290); ctx.scale(q, q);
    txt(premise, 0, 0, 58, { color: '#fff', stroke: 16 });
    ctx.restore();
  }
}
function dayBadge(t, day, at, death, maxDay = 7) {
  if (day == null) return;
  const p = pop(t, at, .4);
  ctx.save(); ctx.translate(W / 2, 420); ctx.scale(p, p); ctx.rotate(Math.sin(t * 3) * .02);
  pill(0, 0, `DÍA ${day}`, 84, death ? '#e02b2b' : '#ffd21f', death ? '#fff' : OUT);
  ctx.restore();
  // progress dots
  for (let i = 1; i <= maxDay; i++) {
    const x = W / 2 + (i - (maxDay + 1) / 2) * 62, y = 528;
    circle(x, y, 17); fillStroke(i < day ? '#ffd21f' : i === day ? (death ? '#e02b2b' : '#fff') : 'rgba(255,255,255,.25)', 6);
  }
}
function mueresStamp(t, at) {
  const p = pr(t, at, at + .35); if (p <= 0) return;
  const s = lerp(3, 1, eOut(p));
  ctx.save(); ctx.translate(W / 2, 760); ctx.rotate(-.12); ctx.scale(s, s); ctx.globalAlpha = Math.min(1, p * 2);
  txt('¡MUERES!', 0, 0, 190, { color: '#ff2b2b', stroke: 44, shadow: true });
  ctx.restore();
}
function icon(name, x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  if (name === 'drop') { ctx.beginPath(); ctx.moveTo(0, -60); ctx.bezierCurveTo(45, -5, 45, 45, 0, 50); ctx.bezierCurveTo(-45, 45, -45, -5, 0, -60); fillStroke('#f6e27a', 7); circle(-12, 15, 9); ctx.fillStyle = '#fff'; ctx.fill(); }
  if (name === 'ear') { ctx.beginPath(); ctx.ellipse(0, 0, 38, 55, 0, 0, Math.PI * 2); fillStroke('#ffd9b8', 7); ctx.beginPath(); ctx.arc(2, -5, 18, Math.PI * .9, Math.PI * 2.3); ctx.lineWidth = 7; ctx.strokeStyle = OUT; ctx.stroke(); for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(-50, 0, 20 + k * 16, -.6, .6); ctx.globalAlpha = .9; ctx.strokeStyle = '#8fe3ff'; ctx.stroke(); ctx.globalAlpha = 1; } }
  if (name === 'eye') { ctx.beginPath(); ctx.ellipse(0, 0, 60, 34, 0, 0, Math.PI * 2); fillStroke('#fff', 7); circle(0, 0, 22); fillStroke('#3ddc84', 6); ctx.beginPath(); ctx.ellipse(0, 0, 6, 20, 0, 0, Math.PI * 2); ctx.fillStyle = OUT; ctx.fill(); }
  if (name === 'moon') { ctx.beginPath(); ctx.arc(0, 0, 50, 0, Math.PI * 2); fillStroke('#ffe38a', 7); ctx.beginPath(); ctx.arc(22, -14, 42, 0, Math.PI * 2); ctx.fillStyle = '#5b4bd6'; ctx.fill(); txt('Z', 40, -50, 44, { color: '#fff', stroke: 10 }); }
  ctx.restore();
}
function voteCard(t, at, a, b, ia, ib) {
  const p = pr(t, at, at + .5); if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, p * 2) * .55; ctx.fillStyle = '#0d0a1f'; ctx.fillRect(0, 0, W, H); ctx.restore();
  const cards = [[a, ia, '#3d7bff', -1], [b, ib, '#ff7a1a', 1]];
  cards.forEach(([label, ic, col, side], k) => {
    const q = pop(t, at + .1 + k * .18, .45);
    const pulse = 1 + .03 * Math.sin((t - at) * 6 + k * 3);
    ctx.save(); ctx.translate(W / 2 + side * 250, 900); ctx.scale(q * pulse, q * pulse); ctx.rotate(side * .04);
    rr(-220, -260 + 14, 440, 520, 50); ctx.fillStyle = OUT; ctx.fill();
    rr(-220, -260, 440, 520, 50); fillStroke(col, 9);
    circle(0, -110, 105); fillStroke('rgba(255,255,255,.22)', 0);
    icon(ic, 0, -110, 1.25);
    const lines = wrapLines(label, 62, 380);
    lines.forEach((ln, i) => txt(ln, 0, 60 + i * 66 - (lines.length - 1) * 20, 62, { color: '#fff', stroke: 14 }));
    pill(0, 205, k === 0 ? 'A' : 'B', 60, '#fff', OUT);
    ctx.restore();
  });
  const r = pop(t, at + .5, .4);
  ctx.save(); ctx.translate(W / 2, 1290); ctx.scale(r, r);
  pill(0, 0, 'VOTA EN COMENTARIOS', 62, '#ffd21f', OUT);
  // arrow down bouncing
  const y = 110 + Math.abs(Math.sin((t - at) * 5)) * 26;
  ctx.beginPath(); ctx.moveTo(-34, y); ctx.lineTo(34, y); ctx.lineTo(0, y + 46); ctx.closePath(); fillStroke('#fff', 7);
  ctx.restore();
  txt('vs', W / 2, 900, 90, { color: '#fff', stroke: 22 });
}
function sky(top = '#5fc8ff', bot = '#bff0ff') { ctx.fillStyle = vgrad(0, H, [top, bot]); ctx.fillRect(0, 0, W, H); }
function finishFrame(t, noCap) {
  vignette(.35);
  if (!noCap) drawCaptions(t, CH, { y: 1420, size: 100 });
  handle(.7);
}
// world camera helper: ground at screen y gy, zoom z, world x center cx, y offset
function cam(z, gy = 1150, cx = 0, cy = 0) { ctx.setTransform(z, 0, 0, z, W / 2 - cx * z, gy - cy * z); }
function resetCam() { ctx.setTransform(1, 0, 0, 1, 0, 0); }
