// Formato 2: "Datos inútiles" — shared layout
let CH = null, SEG = null;
window.setup = (d) => { SEG = d.segs; CH = buildChunks(d.segs.flatMap(s => s.words), 3, 15); };
function beat(t) { let b = 0; for (let i = 0; i < SEG.length; i++) if (t >= SEG[i].s - .1) b = i; return b; }
function findWord(i, re) { const w = SEG[i].words.find(w => re.test(w.w)); return w ? w.s : SEG[i].s; }
function bg(t, c1, c2) {
  ctx.fillStyle = radial(W / 2, 800, 100, 1300, c1, c2); ctx.fillRect(0, 0, W, H);
  // rotating rays
  ctx.save(); ctx.translate(W / 2, 860); ctx.rotate(t * .08); ctx.globalAlpha = .07; ctx.fillStyle = '#fff';
  for (let i = 0; i < 12; i++) { ctx.rotate(Math.PI / 6); ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(1500, -180); ctx.lineTo(1500, 180); ctx.closePath(); ctx.fill(); }
  ctx.restore();
  for (let i = 0; i < 25; i++) { const y = (hash(i) * H - t * (20 + hash(i + 1) * 40)) % H; ctx.save(); ctx.globalAlpha = .25; circle(hash(i + 5) * W, y < 0 ? y + H : y, 4 + hash(i + 2) * 8); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore(); }
}
function header(t, n) {
  const p = pop(t, 0, .4);
  ctx.save(); ctx.translate(W / 2, 180); ctx.scale(p, p); ctx.rotate(-.03);
  pill(0, 0, 'DATO INÚTIL', 70, '#ffd21f', OUT);
  ctx.restore();
  const q = pop(t, .2, .4);
  ctx.save(); ctx.translate(W / 2 + 270, 140); ctx.scale(q, q); ctx.rotate(.15);
  circle(0, 0, 52); fillStroke('#ff3d6e', 7); txt('#' + n, 0, 3, 50, { color: '#fff', stroke: 0 });
  ctx.restore();
}
// punch-in camera at segment start; returns nothing, wrap scene drawing
function punch(t, b) { const p = pr(t, SEG[b].s - .1, SEG[b].s + .25); const k = 1 + (1 - eOut(p)) * .12; ctx.translate(W / 2, 860); ctx.scale(k, k); ctx.translate(-W / 2, -860); }
function tag(x, y, label, size, col, p, rot = 0, fg = '#fff') { if (p <= 0) return; pill(x, y, label, size, col, fg, { scale: eBack(Math.min(1, p)), rot }); }
function bigX(x, y, r, p) { if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(eBack(p), eBack(p)); ctx.lineCap = 'round'; for (const [c, w] of [[OUT, 46], ['#ff2b2b', 28]]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(-r, -r); ctx.lineTo(r, r); ctx.moveTo(r, -r); ctx.lineTo(-r, r); ctx.stroke(); } ctx.restore(); }
function check(x, y, r, p) { if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(eBack(p), eBack(p)); ctx.lineCap = 'round'; ctx.lineJoin = 'round'; for (const [c, w] of [[OUT, 46], ['#3ddc84', 28]]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(-r, 0); ctx.lineTo(-r * .3, r * .7); ctx.lineTo(r, -r * .7); ctx.stroke(); } ctx.restore(); }
function radSymbol(x, y, r, rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); circle(0, 0, r); fillStroke('#ffd21f', 7); ctx.fillStyle = OUT; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.moveTo(0, 0); ctx.arc(0, 0, r * .85, i * 2.094 - .5, i * 2.094 + .5); ctx.closePath(); ctx.fill(); } circle(0, 0, r * .2); ctx.fillStyle = '#ffd21f'; ctx.fill(); circle(0, 0, r * .14); ctx.fillStyle = OUT; ctx.fill(); ctx.restore(); }
function heart(x, y, r, col = '#ff3d6e', beatK = 0) { ctx.save(); ctx.translate(x, y); const k = 1 + beatK; ctx.scale(k, k); ctx.beginPath(); ctx.moveTo(0, r * .35); ctx.bezierCurveTo(-r * 1.2, -r * .4, -r * .5, -r * 1.2, 0, -r * .5); ctx.bezierCurveTo(r * .5, -r * 1.2, r * 1.2, -r * .4, 0, r * .35); ctx.closePath(); ctx.translate(0, 0); fillStroke(col, 7); ctx.restore(); }
function heartBeat(t, rate = 1.2) { const ph = (t * rate) % 1; return ph < .15 ? Math.sin(ph / .15 * Math.PI) * .15 : 0; }
function endCard(t, at, q) {
  const p = pr(t, at, at + .4); if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, p * 2) * .6; ctx.fillStyle = '#0d0a1f'; ctx.fillRect(0, 0, W, H); ctx.restore();
  const a = pop(t, at, .4);
  ctx.save(); ctx.translate(W / 2, 700); ctx.scale(a, a); txt(q, 0, 0, 120, { color: '#fff', stroke: 28, shadow: true }); ctx.restore();
  [['SÍ', '#3ddc84', -1], ['NO', '#ff3d6e', 1]].forEach(([l, c, d], k) => {
    const s = pop(t, at + .25 + k * .15, .4) * (1 + .04 * Math.sin((t - at) * 6 + k * 3));
    ctx.save(); ctx.translate(W / 2 + d * 220, 960); ctx.scale(s, s);
    rr(-170, -130 + 14, 340, 260, 50); ctx.fillStyle = OUT; ctx.fill(); rr(-170, -130, 340, 260, 50); fillStroke(c, 9);
    txt(l, 0, 5, 150, { color: '#fff', stroke: 30 }); ctx.restore();
  });
  const r = pop(t, at + .6, .4);
  ctx.save(); ctx.translate(W / 2, 1200); ctx.scale(r, r); pill(0, 0, 'COMÉNTALO 👇'.replace(' 👇', ''), 60, '#ffd21f', OUT);
  const y = 95 + Math.abs(Math.sin((t - at) * 5)) * 24; ctx.beginPath(); ctx.moveTo(-34, y); ctx.lineTo(34, y); ctx.lineTo(0, y + 46); ctx.closePath(); fillStroke('#fff', 7); ctx.restore();
  ctx.save(); ctx.translate(W / 2, 1420); ctx.scale(r, r); pill(0, 0, '+1 DATO INÚTIL CADA DÍA', 46, '#ff3d6e', '#fff'); ctx.restore();
}
function finishFrame(t, noCap) { vignette(.4); if (!noCap) drawCaptions(t, CH, { y: 1430, size: 100 }); handle(.7); }
const HERO = { body: '#ffb72b', skin: '#ffd9b8', hair: '#3a2416', leg: '#3b3f8f' };
