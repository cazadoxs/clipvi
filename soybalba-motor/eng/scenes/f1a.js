// f1a: cada mentira te hace crecer 10 cm
const HERO = { body: '#ffb72b', skin: '#ffd9b8', hair: '#3a2416', leg: '#3b3f8f' };
function house(x, w, h, col, roof, doorH) {
  rr(x - w / 2, -h, w, h, 10); fillStroke(col, 8);
  ctx.beginPath(); ctx.moveTo(x - w / 2 - 30, -h + 4); ctx.lineTo(x, -h - w * .45); ctx.lineTo(x + w / 2 + 30, -h + 4); ctx.closePath(); fillStroke(roof, 8);
  const dh = doorH || h * .55; rr(x - 55, -dh, 110, dh, [40, 40, 0, 0]); fillStroke('#8a4b2a', 8);
  circle(x + 30, -dh / 2, 8); fillStroke('#ffd21f', 4);
  for (const d of [-1, 1]) { rr(x + d * w * .32 - 45, -h * .78, 90, 90, 12); fillStroke('#bfefff', 7); }
}
function growth(t) {
  let s = 1;
  const g1 = findWord(1, /^Diez/); s = lerp(s, 1.3, eElastic(pr(t, g1, g1 + .9)));
  s = lerp(s, 2.1, eIO(pr(t, SEG[2].s, SEG[2].s + .7)));
  const g2 = findWord(2, /^Ya$/); s = lerp(s, 2.4, eElastic(pr(t, g2 - .2, g2 + .6)));
  s = lerp(s, 7, eIO(pr(t, SEG[3].s, SEG[3].s + 1.0)));
  const g3 = findWord(3, /^Atraviesas/); s = lerp(s, 13, eIO(pr(t, g3 - .4, g3 + .9)));
  s = lerp(s, 16, eIO(pr(t, SEG[4].s, SEG[4].s + 1.2)));
  return s;
}
window.sfxList = () => {
  const ev = [{ t: 0.05, n: 'whoosh' }];
  for (let i = 1; i <= 4; i++) ev.push({ t: SEG[i].s - .05, n: 'pop' });
  ev.push({ t: findWord(1, /^Diez/), n: 'boing' });
  ev.push({ t: SEG[2].s + .1, n: 'rise', v: .7 });
  ev.push({ t: findWord(2, /^Ya$/) + .1, n: 'thud' });
  ev.push({ t: SEG[3].s + .1, n: 'rise' });
  ev.push({ t: findWord(3, /^Atraviesas/), n: 'whoosh' });
  ev.push({ t: findWord(4, /^arriba/), n: 'heart', v: .8 }, { t: findWord(4, /^oxígeno/), n: 'heart' });
  ev.push({ t: findWord(4, /Mueres/) - .05, n: 'thud' }, { t: findWord(4, /Mueres/) + .1, n: 'wahwah' });
  ev.push({ t: SEG[5].s, n: 'whoosh' }, { t: SEG[5].s + .2, n: 'pop' }, { t: SEG[5].s + .4, n: 'pop' });
  return ev;
};
window.scene = (t, d) => {
  const b = beat(t);
  const s = growth(t);
  const charH = 514 * s;
  // camera
  let z = Math.min(.8, 640 / charH);
  const tm = findWord(4, /^Allí/);
  const zoomHead = eIO(pr(t, tm - .3, tm + .8));
  const headY = -402 * s;
  const zHead = 2.5 / s;
  z = lerp(z, zHead, zoomHead);
  const gy = lerp(1240, 880, zoomHead);
  const cy = lerp(0, headY, zoomHead);
  const alt = Math.max(0, -cy + (1150 - 860) / z * 0) + charH * .5 * (s > 3 ? 1 : 0);
  // sky
  const hi = clamp((s - 4) / 12);
  const top = `rgb(${lerp(95, 12, hi)},${lerp(200, 18, hi)},${lerp(255, 70, hi)})`;
  const bot = `rgb(${lerp(191, 60, hi)},${lerp(240, 80, hi)},${lerp(255, 160, hi)})`;
  ctx.fillStyle = vgrad(0, H, [top, bot]); ctx.fillRect(0, 0, W, H);
  if (hi > .3) for (let i = 0; i < 70; i++) { ctx.globalAlpha = (hi - .3) * (0.5 + .5 * Math.sin(t * 3 + i)); star4(hash(i) * W, hash(i + 50) * H * .8, 6 + hash(i + 9) * 8, '#fff'); } ctx.globalAlpha = 1;
  // shake on thud
  const [sx, sy] = shakeOffset(t, findWord(2, /^Ya$/) + .1, .35, 16);
  ctx.save(); ctx.translate(sx, sy);
  cam(z, gy, 0, cy);
  // distant hills
  ctx.fillStyle = '#7fd36b'; ctx.beginPath(); ctx.ellipse(-900, 40, 1100, 300, 0, Math.PI, 0); ctx.fill();
  ctx.fillStyle = '#6cc35a'; ctx.beginPath(); ctx.ellipse(900, 40, 1200, 380, 0, Math.PI, 0); ctx.fill();
  // ground
  ctx.fillStyle = '#58b947'; ctx.fillRect(-30000, 0, 60000, 30000);
  ctx.fillStyle = '#c9b48a'; ctx.fillRect(-30000, 20, 60000, 60);
  // village houses (behind)
  const hs = [[-1400, '#ff8fa3', '#c2405d'], [-800, '#9ad0ff', '#3a6fd1'], [900, '#ffe08a', '#d7892a'], [1500, '#c7a6ff', '#6b44c9']];
  for (const [x, c, r] of hs) house(x, 300, 300, c, r);
  // main house at door scene
  if (b >= 2) house(0, 420, 420, '#fff1d6', '#e0533b', 300);
  // clouds band
  if (s > 4) { const cyb = -3600; for (let i = 0; i < 9; i++) cloud(-3000 + i * 800 + Math.sin(t * .4 + i) * 120, cyb - hash(i) * 900, 6 + hash(i + 3) * 3, .95); }
  if (b >= 4) { for (let i = 0; i < 8; i++) cloud(-1800 + i * 520 + Math.sin(t * .5 + i) * 80, headY + 900 + hash(i + 7) * 700, 3 + hash(i) * 2, .95); }
  // ruler
  if (b <= 1) {
    rr(260, -620, 70, 620, 8); fillStroke('#ffe9a8', 7);
    for (let k = 0; k <= 12; k++) { ctx.beginPath(); ctx.moveTo(260, -k * 50); ctx.lineTo(260 + (k % 2 ? 22 : 40), -k * 50); ctx.lineWidth = 6; ctx.strokeStyle = OUT; ctx.stroke(); }
    // head mark
    const mk = -(514 * s - 8);
    ctx.beginPath(); ctx.moveTo(250, mk); ctx.lineTo(345, mk); ctx.lineWidth = 8; ctx.strokeStyle = '#ff3d6e'; ctx.stroke();
  }
  // friend with gift
  if (b === 1) {
    drawChar({ x: -330, y: 0, s: .9, body: '#3ddc84', skin: '#c98d66', hair: '#1b1010', hairStyle: 'long', mood: 'happy', armR: 70, look: [1, 0], blink: blinkAt(t, 3),
      extra: () => { rr(55, -360, 120, 100, 10); fillStroke('#ff5a6e', 7); ctx.fillStyle = '#ffd21f'; ctx.fillRect(105, -360, 20, 100); } });
  }
  // hero
  const lieW = b >= 1 && b <= 3 ? SEG[b].words.findIndex(w => /^«/.test(w.w)) : -1;
  const lying = lieW >= 0 && t >= SEG[b].words[lieW].s && t < SEG[b].words[SEG[b].words.length - 1].e;
  let mood = 'happy';
  if (b === 1) mood = t > findWord(1, /^Diez/) ? 'shock' : 'grin';
  if (b === 2) mood = t > findWord(2, /^Ya$/) ? 'worried' : 'grin';
  if (b === 3) mood = t > findWord(3, /^Atraviesas/) ? 'shock' : 'grin';
  if (b >= 4) mood = 'worried';
  const deadT = findWord(4, /Mueres/);
  if (t >= findWord(4, /^oxígeno/)) mood = 'shock';
  if (t >= deadT) mood = 'dead';
  const tint = clamp((t - findWord(4, /^arriba/)) / 2);
  const skin = tint > 0 && t < deadT + 99 ? `rgb(${lerp(255, 170, tint)},${lerp(217, 160, tint)},${lerp(184, 255, tint)})` : HERO.skin;
  const lieTalk = 0;
  drawChar({ ...HERO, skin: tint > 0 ? toHex(skin) : HERO.skin, x: 0, y: 0, s, mood, blink: mood === 'dead' ? 0 : blinkAt(t, 1), look: b === 1 ? [-1, 0] : [0, -.2],
    armL: b === 2 && lying ? 150 : 14 + Math.sin(t * 2) * 4, armR: b === 3 && lying ? 120 : 14, rot: t > deadT ? Math.min(8, (t - deadT) * 30) : 0,
    extra: (by) => { if (b === 2 && lying) { rr(-150, by + 10, 46, 80, 10); fillStroke('#2a2a3a', 6); } } });
  // bump star on door
  const bt = findWord(2, /^Ya$/) + .1;
  if (b === 2 && t > bt) { const p = pop(t, bt, .3); star4(0, -300, 70 * p, '#ffd21f'); }
  if (s > 4 && b === 3) { for (let i = 0; i < 6; i++) cloud(-2600 + i * 1000 + Math.sin(t * .5 + i * 2) * 150, -3900 - hash(i + 20) * 500, 5 + hash(i + 4) * 2, .92); }
  resetCam(); ctx.restore();
  // screen space: head position
  const hsx = W / 2, hsy = gy + z * (headY - cy);
  // lie bubbles
  if (lieW >= 0) {
    const ws = SEG[b].words; const st = ws[lieW].s - .05; const en = ws.findIndex(w => /»/.test(w.w));
    const endT = (ws[en] || ws[ws.length - 1]).e + 1.0;
    const label = ws.slice(lieW, en + 1).map(w => w.w).join(' ').replace(/[«».]/g, '');
    if (t > st && t < endT) { const tx = hsx + 110 * z * s, ty = hsy - 10; speech(tx, ty, label, 50, pr(t, st, st + .3) * (1 - pr(t, endT - .2, endT)), { dx: 840 - tx, dy: Math.min(170, ty - 660), maxW: 400 }); }
  }
  // +10cm tags
  const tags = [findWord(1, /^Diez/), findWord(2, /^Ya$/) - .2, findWord(3, /^Atraviesas/) - .4];
  tags.forEach((tt, i) => { const p = pr(t, tt, tt + 1.2); if (p > 0 && p < 1) { ctx.save(); ctx.globalAlpha = 1 - pr(t, tt + .9, tt + 1.2); pill(W / 2 - 250, 760 - p * 120, i === 2 ? '+10 CM ×50' : i === 1 ? '+10 CM ×8' : '+10 CM', 56, '#3ddc84', '#fff', { scale: eBack(pr(t, tt, tt + .3)) }); ctx.restore(); } });
  // ghost
  if (t > deadT + .3) { const p = pr(t, deadT + .3, deadT + 3); ghost(hsx + 300, hsy - 60 - p * 380, 1.2, Math.min(1, p * 3) * (1 - pr(t, SEG[5].s, SEG[5].s + .3))); }
  // UI
  seriesHeader(t, 'CADA MENTIRA = +10 CM');
  const days = [null, 1, 3, 5, 6, null];
  if (days[b] != null) dayBadge(t, days[b], SEG[b].s - .05, b === 4 && t >= deadT);
  if (b === 4) mueresStamp(t, deadT);
  flash(t, deadT, .3, '#fff');
  if (b === 5) voteCard(t, SEG[5].s, 'SUDAR PEGAMENTO', 'RESPIRAR POR LAS OREJAS', 'drop', 'ear');
  finishFrame(t, b === 5 && t > SEG[5].s + .3);
};
function toHex(rgb) { const m = rgb.match(/\d+(\.\d+)?/g).map(v => Math.round(+v)); return '#' + m.map(v => v.toString(16).padStart(2, '0')).join(''); }
