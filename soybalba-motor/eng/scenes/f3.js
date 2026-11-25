// Formato 3: "En este pueblo…" micro-historias — shared
let CH = null, SEG = null;
window.setup = (d) => { SEG = d.segs; CH = buildChunks(d.segs.flatMap(s => s.words.map(w => ({ ...w, v: s.v }))), 3, 16); };
function beat(t) { let b = 0; for (let i = 0; i < SEG.length; i++) if (t >= SEG[i].s - .15) b = i; return b; }
function findWord(i, re) { const w = SEG[i].words.find(w => re.test(w.w)); return w ? w.s : SEG[i].s; }
function segEnd(i) { return SEG[i + 1] ? SEG[i + 1].s - .15 : SEG[i].e + 2; }
const LEO = { body: '#4a6fd1', skin: '#f2c29b', hair: '#2a1a10', leg: '#2a2f4f' };
const ABU = { body: '#9b6bd1', skin: '#f5d1b5', hairStyle: 'grey', leg: '#5a4a6a' };
const SARA = { body: '#ff6f91', skin: '#ffd9b8', hairStyle: 'long', hair: '#a0522d', leg: '#6b3a5a' };
const VILL = [
  { body: '#3ddc84', skin: '#c98d66', hair: '#1b1010', leg: '#2a2f6f' },
  { body: '#ff9f43', skin: '#ffd9b8', hair: '#6b3a1a', hairStyle: 'long', leg: '#3b3f8f' },
  { body: '#e84a5f', skin: '#8d5a3b', hair: '#111', leg: '#2a2a3a', hairStyle: 'bald' },
  { body: '#2ec4b6', skin: '#f2c29b', hair: '#d4a017', hairStyle: 'bun', leg: '#3b3f8f' },
  { body: '#f7d154', skin: '#ffd9b8', hair: '#3a2416', leg: '#5a4a6a' },
];
function night(t, k = 1) {
  ctx.fillStyle = vgrad(0, H, ['#0b0f2e', '#1d2363', '#3b3f8f']); ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 80; i++) { ctx.globalAlpha = (.4 + .6 * Math.abs(Math.sin(t * 1.3 + i * 7))) * k; circle(hash(i) * W, hash(i + 40) * 1100, 2 + hash(i + 9) * 3); ctx.fillStyle = '#fff'; ctx.fill(); } ctx.globalAlpha = 1;
}
function moon(x, y, r) { ctx.save(); ctx.globalAlpha = .35; circle(x, y, r * 2.2); ctx.fillStyle = radial(x, y, r, r * 2.2, 'rgba(255,240,200,.6)', 'rgba(255,240,200,0)'); ctx.fill(); ctx.restore(); circle(x, y, r); fillStroke('#fff4cf', 7); circle(x - r * .3, y - r * .2, r * .18); ctx.fillStyle = 'rgba(0,0,0,.08)'; ctx.fill(); }
function glow(x, y, r, a = 1, col = '255,205,110') { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = radial(x, y, 0, r, `rgba(${col},.55)`, `rgba(${col},0)`); ctx.fillRect(x - r, y - r, r * 2, r * 2); ctx.restore(); }
// house: x center, gy ground, lit: array of 4 values (0..1)
function house(x, gy, w, h, wall, roof, lit, o = {}) {
  const dark = o.dark ?? .45;
  ctx.save();
  rr(x - w / 2, gy - h, w, h, 8); fillStroke(shade(wall, -dark), 8);
  ctx.beginPath(); ctx.moveTo(x - w / 2 - 30, gy - h + 4); ctx.lineTo(x, gy - h - w * .42); ctx.lineTo(x + w / 2 + 30, gy - h + 4); ctx.closePath(); fillStroke(shade(roof, -dark), 8);
  rr(x + w * .3 - 20, gy - h - w * .35, 40, 80, 4); fillStroke(shade(roof, -dark - .1), 7);
  const ww = w * .24, wh = h * .2;
  const pos = [[-.22, .3], [.22, .3], [-.22, .62], [.22, .62]];
  pos.forEach(([px, py], i) => {
    const L = lit[i] ?? 0; const wx = x + px * w, wy = gy - h + py * h;
    if (L > .02) glow(wx, wy, ww * 2.4, L);
    rr(wx - ww / 2, wy - wh / 2, ww, wh, 8);
    const c = L > 0 ? `rgb(${Math.round(lerp(30, 255, L))},${Math.round(lerp(34, 214, L))},${Math.round(lerp(70, 120, L))})` : '#1e2248';
    fillStroke(c, 7);
    ctx.beginPath(); ctx.moveTo(wx, wy - wh / 2); ctx.lineTo(wx, wy + wh / 2); ctx.moveTo(wx - ww / 2, wy); ctx.lineTo(wx + ww / 2, wy); ctx.lineWidth = 5; ctx.strokeStyle = OUT; ctx.stroke();
  });
  if (!o.noDoor) { const dh = h * .3; rr(x - w * .12, gy - dh, w * .24, dh, [30, 30, 0, 0]); fillStroke(shade('#8a4b2a', -dark), 7); }
  ctx.restore();
}
function lamp(x, gy, on = 1) { rr(x - 8, gy - 330, 16, 330, 4); fillStroke('#2a2a3a', 6); if (on) glow(x, gy - 350, 200, on); rr(x - 28, gy - 380, 56, 56, 10); fillStroke(on ? '#ffe08a' : '#3a3a5a', 6); }
function candle(x, y, s, t, k = 0) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); glow(0, -60, 160, .9); rr(-14, -50, 28, 60, 6); fillStroke('#fff4e0', 5); const f = Math.sin(t * 12 + k) * .1; ctx.beginPath(); ctx.ellipse(0, -66, 10, 18 * (1 + f), f, 0, Math.PI * 2); fillStroke('#ffb72b', 4); ctx.restore(); }
function lantern(x, y, s, t, col = '#ff6f3c', k = 0) { ctx.save(); ctx.translate(x, y + Math.sin(t * 2 + k) * 6); ctx.scale(s, s); glow(0, 0, 220, .9, '255,170,90'); ctx.beginPath(); ctx.ellipse(0, 0, 45, 55, 0, 0, Math.PI * 2); fillStroke(col, 6); rr(-20, -66, 40, 14, 4); fillStroke('#2a2a3a', 5); rr(-20, 52, 40, 12, 4); fillStroke('#2a2a3a', 5); ctx.restore(); }
function bulb(x, y, s, on, t) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); if (on > 0) glow(0, -20, 380, on); ctx.beginPath(); ctx.arc(0, -40, 110, Math.PI * .8, Math.PI * 2.2); ctx.lineTo(45, 70); ctx.lineTo(-45, 70); ctx.closePath(); fillStroke(on > .5 ? '#fff1a8' : '#4a4f7a', 9); rr(-50, 70, 100, 70, 14); fillStroke('#b8bfd3', 8); for (let i = 0; i < 2; i++) { ctx.beginPath(); ctx.moveTo(-50, 92 + i * 22); ctx.lineTo(50, 92 + i * 22); ctx.lineWidth = 5; ctx.strokeStyle = OUT; ctx.stroke(); } ctx.beginPath(); ctx.moveTo(-25, 60); ctx.lineTo(-20, -30); ctx.lineTo(0, 0); ctx.lineTo(20, -30); ctx.lineTo(25, 60); ctx.lineWidth = 6; ctx.strokeStyle = on > .5 ? '#ff9f1a' : '#2a2f4f'; ctx.stroke(); ctx.restore(); }
function ground(gy, col = '#2d3a6e') { ctx.fillStyle = col; ctx.fillRect(0, gy - 6, W, H); ctx.fillStyle = shade(col, .15); ctx.fillRect(0, gy - 6, W, 14); }
// shot camera: slow push between z0..z1 around (cx,cy) during [a,b]
function shotCam(t, a, b, z0 = 1, z1 = 1.06, cx = W / 2, cy = 900, dx = 0) { const p = eIO(pr(t, a, b)); const z = lerp(z0, z1, p); ctx.translate(cx + dx * p, cy); ctx.scale(z, z); ctx.translate(-cx, -cy); }
function cutFade(t) { for (const s of SEG) { const d = Math.abs(t - (s.s - .15)); if (d < .12) { ctx.save(); ctx.globalAlpha = (1 - d / .12) * .9; ctx.fillStyle = '#000'; ctx.fillRect(0, 0, W, H); ctx.restore(); } } }
function speakerTag(t, b, names) { const n = names[SEG[b].v]; if (!n) return; const p = pop(t, SEG[b].s, .3); pill(W / 2, 1300, n, 46, SEG[b].v === 'ABU' ? '#9b6bd1' : SEG[b].v === 'ALBA' ? '#ff6f91' : '#4a6fd1', '#fff', { scale: p }); }
function titleCard(t) { const p = pop(t, 0, .45) * (1 - pr(t, 3.2, 3.6)); if (p <= 0) return; ctx.save(); ctx.translate(W / 2, 260); ctx.scale(p, p); pill(0, 0, 'EN ESTE PUEBLO…', 72, '#ffd21f', OUT, { rot: -.03 }); ctx.restore(); }
function endCard3(t, at, lines) {
  const p = pr(t, at, at + .5); if (p <= 0) return;
  ctx.save(); ctx.globalAlpha = Math.min(1, p * 2) * .55; ctx.fillStyle = '#05061a'; ctx.fillRect(0, 0, W, H); ctx.restore();
  lines.forEach((l, i) => { const q = pop(t, at + i * .15, .4); ctx.save(); ctx.translate(W / 2, 620 + i * 120); ctx.scale(q, q); txt(l, 0, 0, 100, { color: i === lines.length - 1 ? '#ffd21f' : '#fff', stroke: 24, shadow: true }); ctx.restore(); });
  const r = pop(t, at + .6, .4);
  ctx.save(); ctx.translate(W / 2, 1060); ctx.scale(r, r); pill(0, 0, 'TE LEO EN COMENTARIOS', 56, '#ff3d6e', '#fff');
  const y = 95 + Math.abs(Math.sin((t - at) * 5)) * 24; ctx.beginPath(); ctx.moveTo(-34, y); ctx.lineTo(34, y); ctx.lineTo(0, y + 46); ctx.closePath(); fillStroke('#fff', 7); ctx.restore();
  const f = pop(t, at + 1.0, .4); ctx.save(); ctx.translate(W / 2, 1290); ctx.scale(f, f); pill(0, 0, 'SÍGUEME PARA MÁS PUEBLOS', 44, '#ffd21f', OUT); ctx.restore();
}
function finishFrame(t, noCap) {
  cutFade(t); vignette(.5); titleCard(t);
  if (!noCap) drawCaptions(t, CH, { y: 1450, size: 92, tilt: -1, colorFn: (w, col) => (w.v === 'ABU' && col === '#fff') ? '#e2c8ff' : (w.v === 'ALBA' && col === '#fff') ? '#ffd1dc' : (w.v === 'LEO' || w.v === 'TOM') && col === '#fff' ? '#cfe0ff' : col });
  handle(.6);
}
function bigX(x, y, r, p) { if (p <= 0) return; ctx.save(); ctx.translate(x, y); ctx.scale(eBack(p), eBack(p)); ctx.lineCap = 'round'; for (const [c, w] of [[OUT, 46], ['#ff2b2b', 28]]) { ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(-r, -r); ctx.lineTo(r, r); ctx.moveTo(r, -r); ctx.lineTo(-r, r); ctx.stroke(); } ctx.restore(); }
function heart(x, y, r, col = '#ff3d6e', beatK = 0) { ctx.save(); ctx.translate(x, y); const k = 1 + beatK; ctx.scale(k, k); ctx.beginPath(); ctx.moveTo(0, r * .35); ctx.bezierCurveTo(-r * 1.2, -r * .4, -r * .5, -r * 1.2, 0, -r * .5); ctx.bezierCurveTo(r * .5, -r * 1.2, r * 1.2, -r * .4, 0, r * .35); ctx.closePath(); ctx.translate(0, 0); fillStroke(col, 7); ctx.restore(); }
