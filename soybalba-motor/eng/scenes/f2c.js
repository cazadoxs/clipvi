// f2c: pulpo 3 corazones
function octo(x, y, s, t, o = {}) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.rotate(o.rot || 0);
  const col = o.col || '#b65cff';
  // tentacles
  for (let i = 0; i < 8; i++) {
    const a = (i / 7 - .5) * 2.2; const bx = Math.sin(a) * 120, by = 60;
    const sw = o.walk ? Math.sin(t * 6 + i * 1.3) * 40 : Math.sin(t * 2.5 + i) * 30;
    const len = o.swim ? 260 + Math.sin(t * 4) * 40 : 230;
    const ex = bx + Math.sin(a) * (o.swim ? 40 : 160) + sw, ey = by + len * (o.swim ? 1.1 : .75);
    limb2(bx, by, bx + Math.sin(a) * 80 - sw, by + len * .5, ex, ey, col, 46 - Math.abs(a) * 6);
    // suckers
    circle(ex, ey - 8, 8); ctx.fillStyle = '#ffd1f0'; ctx.fill();
  }
  // head
  ctx.beginPath(); ctx.ellipse(0, -60, 170, 190, 0, 0, Math.PI * 2); fillStroke(radial(-60, -140, 10, 260, shade(col, .3), shade(col, -.2)), 9);
  for (const [sx, sy, r] of [[-70, -170, 18], [60, -200, 12], [90, -120, 14]]) { circle(sx, sy, r); ctx.fillStyle = 'rgba(255,255,255,.25)'; ctx.fill(); }
  ctx.translate(0, 10); drawFace({ mood: o.mood || 'happy', look: o.look || [0, 0], blink: o.blink || 0, talk: o.talk || 0 }, 120);
  if (o.tired) for (let k = 0; k < 3; k++) { const ph = (t * 1.5 + k / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - ph; ctx.beginPath(); const sx = 150 + k * 20, sy = -120 + ph * 120; ctx.moveTo(sx, sy - 20); ctx.quadraticCurveTo(sx + 14, sy + 4, sx, sy + 12); ctx.quadraticCurveTo(sx - 14, sy + 4, sx, sy - 20); fillStroke('#8fe3ff', 5); ctx.restore(); }
  ctx.restore();
}
function blood(x, y, s, col) { ctx.save(); ctx.translate(x, y); ctx.scale(s, s); ctx.beginPath(); ctx.moveTo(0, -90); ctx.bezierCurveTo(70, -10, 70, 60, 0, 70); ctx.bezierCurveTo(-70, 60, -70, -10, 0, -90); fillStroke(col, 8); circle(-20, 20, 14); ctx.fillStyle = 'rgba(255,255,255,.5)'; ctx.fill(); ctx.restore(); }
window.sfxList = () => {
  const ev = [{ t: .05, n: 'whoosh' }, { t: .5, n: 'heart' }, { t: findWord(0, /^tres/), n: 'boing' }];
  for (let i = 1; i <= 4; i++) ev.push({ t: SEG[i].s - .05, n: 'whoosh', v: .7 });
  ev.push({ t: findWord(1, /^branquias/), n: 'heart' }, { t: findWord(1, /^cuerpo/), n: 'heart' });
  ev.push({ t: findWord(2, /^azul/), n: 'ding' });
  ev.push({ t: findWord(3, /^para/), n: 'thud' });
  ev.push({ t: findWord(4, /^agota/), n: 'wahwah', v: .6 });
  ev.push({ t: findWord(5, /^¿Lo/), n: 'pop' }, { t: findWord(5, /^¿Lo/) + .3, n: 'pop' }, { t: findWord(5, /^¿Lo/) + .45, n: 'pop' });
  return ev;
};
window.scene = (t) => {
  const b = beat(t);
  bg(t, '#1f6fd6', '#0a1f4f');
  // bubbles
  for (let i = 0; i < 12; i++) { const ph = (t * .15 + hash(i)) % 1; circle(hash(i + 3) * W + Math.sin(t + i) * 20, H - ph * H, 8 + hash(i + 1) * 14); fillStroke(null, 4, 'rgba(255,255,255,.35)'); }
  ctx.save(); punch(t, b);
  const GY = 1240;
  if (b === 0) {
    const oc = findWord(0, /^Un$/);
    const sp = eOut(pr(t, oc - .2, oc + .3));
    drawChar({ ...HERO, x: lerp(W / 2, 290, sp), y: GY, s: 1.0, mood: t > findWord(0, /^tres/) ? 'shock' : 'happy', blink: blinkAt(t, 1), look: [sp, 0],
      extraBody: (by) => heart(0, by + 80, 38, '#ff3d6e', heartBeat(t)) });
    tag(lerp(W / 2, 290, sp), 560, '1', 90, '#ff3d6e', pr(t, .4, .7));
    if (sp > 0) {
      octo(780, 900, .8 * sp, t, { mood: 'grin', blink: blinkAt(t, 7), look: [-1, 0] });
      tag(780, 560, '3', 90, '#b65cff', pr(t, findWord(0, /^tres/) - .1, findWord(0, /^tres/) + .2));
      for (let k = 0; k < 3; k++) { const q = pop(t, findWord(0, /^tres/) + k * .12, .3); if (q > 0) heart(680 + k * 100, 690, 34 * q, '#ff3d6e', heartBeat(t + k * .2)); }
    }
  }
  if (b === 1) {
    octo(W / 2, 950, 1.3, t, { mood: 'happy', blink: blinkAt(t, 7) });
    const g = findWord(1, /^branquias/) - .3, c = findWord(1, /^cuerpo/) - .3;
    for (const d of [-1, 1]) { const q = pop(t, g, .35); if (q > 0) { heart(W / 2 + d * 190, 1010, 42 * q, '#ff7a8f', heartBeat(t + d)); } }
    tag(W / 2, 1160, 'BRANQUIAS ×2', 52, '#ff7a8f', pr(t, g, g + .3), 0, '#fff');
    const q = pop(t, c, .35); if (q > 0) heart(W / 2, 760, 70 * q, '#ff3d6e', heartBeat(t, 1.5));
    tag(W / 2, 600, 'CUERPO', 56, '#ff3d6e', pr(t, c, c + .3));
  }
  if (b === 2) {
    const r = findWord(2, /^roja/), az = findWord(2, /^azul/), cu = findWord(2, /^cobre/);
    blood(W / 2 - 220, 820, 1.6 * pop(t, r - .3, .3), '#e8243c');
    bigX(W / 2 - 220, 820, 90, pr(t, r + .2, r + .5));
    blood(W / 2 + 220, 820, 1.6 * pop(t, az - .2, .3), '#2b6bff');
    check(W / 2 + 230, 1040, 60, pr(t, az, az + .3));
    tag(W / 2 + 220, 600, 'COBRE', 60, '#ff9b4a', pr(t, cu - .1, cu + .2), .06);
    tag(W / 2 - 220, 600, 'HIERRO', 60, '#8a8fa6', pr(t, findWord(2, /^hierro/) - .1, findWord(2, /^hierro/) + .2), -.06);
    if (az < t) sparkles(t, W / 2 + 220, 820, 200, 8, '#fff', 4);
  }
  if (b === 3) {
    const st = findWord(3, /^para/);
    const x = W / 2 + Math.sin(t * 1.5) * 120, y = 820 + Math.sin(t * 3) * 40;
    octo(x, y, 1.0, t, { swim: true, rot: Math.sin(t * 1.5) * .2, mood: t > st ? 'shock' : 'happy', blink: blinkAt(t, 7) });
    // ECG line
    ctx.save(); ctx.translate(0, 1230); ctx.lineWidth = 10; ctx.strokeStyle = '#3ddc84'; ctx.lineJoin = 'round'; ctx.beginPath();
    for (let px = 0; px <= W; px += 8) { const tt = t * 300 - (W - px); let v = 0; const ph = ((tt / 300) % 1 + 1) % 1; if (t - (W - px) / 300 < st) v = ph < .08 ? -Math.sin(ph / .08 * Math.PI) * 90 : 0; ctx.lineTo(px, v); }
    ctx.stroke(); ctx.restore();
    heart(W / 2 + 300, 600, 60, t > st ? '#8a8fa6' : '#ff3d6e', t > st ? 0 : heartBeat(t, 1.6));
    if (t > st) { const q = pop(t, st, .3); ctx.save(); ctx.translate(W / 2 + 300, 600); ctx.scale(q, q); rr(-30, -40, 20, 80, 6); fillStroke('#fff', 6); rr(10, -40, 20, 80, 6); fillStroke('#fff', 6); ctx.restore(); tag(W / 2 - 220, 600, 'PAUSA', 64, '#ff3d6e', pr(t, st, st + .3), -.08); }
  }
  if (b === 4) {
    // seafloor
    ctx.fillStyle = '#e9d39a'; ctx.beginPath(); ctx.moveTo(0, 1180); for (let x = 0; x <= W; x += 40) ctx.lineTo(x, 1180 + Math.sin(x * .01) * 20); ctx.lineTo(W, H); ctx.lineTo(0, H); ctx.closePath(); ctx.fill();
    for (let i = 0; i < 4; i++) { const sx = (i * 330 - t * 60) % 1300; ctx.save(); ctx.translate(sx < -100 ? sx + 1300 : sx, 1185); for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.moveTo(k * 20 - 20, 0); ctx.quadraticCurveTo(k * 20 - 20 + Math.sin(t * 2 + k) * 30, -100, k * 20 - 20, -180 + k * 20); ctx.lineWidth = 16; ctx.strokeStyle = '#3ddc84'; ctx.lineCap = 'round'; ctx.stroke(); } ctx.restore(); }
    const ag = findWord(4, /^agota/), wk = findWord(4, /^andando/);
    octo(W / 2, 880 + Math.abs(Math.sin(t * 6)) * -12, 1.0, t, { walk: true, mood: t > ag - .6 ? 'worried' : 'grin', tired: t > ag - .6, blink: blinkAt(t, 7) });
    tag(W / 2 - 230, 580, '¡ANDANDO!', 60, '#3ddc84', pr(t, wk - .1, wk + .2), -.08, OUT);
    if (t > ag - .6) tag(W / 2 + 230, 580, 'NADAR = AGOTADOR', 46, '#ff3d6e', pr(t, ag - .6, ag - .3), .08);
  }
  if (b === 5) octo(W / 2, 900, 1.1, t, { mood: 'grin', blink: blinkAt(t, 7) });
  ctx.restore();
  header(t, 3);
  const ec = findWord(5, /^¿Lo/);
  endCard(t, ec, '¿LO SABÍAS?');
  finishFrame(t, t > ec + .2);
};
