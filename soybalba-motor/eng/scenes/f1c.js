// f1c: respirar por las orejas
const HERO = { body: '#ffb72b', skin: '#ffd9b8', hair: '#3a2416', leg: '#3b3f8f' };
const GY = 1240, S = 1.1;
function airWaves(t, x, y, side, inward = true, col = '#8fe3ff', a = 1) { // arcs moving toward ear
  for (let k = 0; k < 3; k++) {
    const ph = ((t * 1.2 + k / 3) % 1); const d = inward ? (1 - ph) : ph;
    ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI) * a; ctx.strokeStyle = col; ctx.lineWidth = 12; ctx.lineCap = 'round';
    ctx.beginPath(); ctx.arc(x + side * (30 + d * 140), y, 40 + d * 40, side > 0 ? -0.7 : Math.PI - .7, side > 0 ? 0.7 : Math.PI + .7); ctx.stroke(); ctx.restore();
  }
}
function headPos(x) { return [x, GY - 402 * S]; }
window.sfxList = () => {
  const ev = [{ t: 0.05, n: 'whoosh' }];
  for (let i = 1; i <= 4; i++) ev.push({ t: SEG[i].s - .05, n: 'pop' });
  ev.push({ t: findWord(1, /^auriculares/), n: 'click' }, { t: findWord(1, /^ahogas/), n: 'heart' });
  ev.push({ t: findWord(2, /^susurra/), n: 'whoosh', v: .6 }, { t: findWord(2, /^inhalas/), n: 'boing' });
  ev.push({ t: findWord(3, /^resfriado/), n: 'thud', v: .5 }, { t: findWord(3, /^gotean/), n: 'bubble' });
  ev.push({ t: findWord(4, /^tiras/), n: 'rise' }, { t: findWord(4, /^cabeza/), n: 'splash' }, { t: findWord(4, /^cabeza/) + .4, n: 'bubble' });
  const dt = findWord(4, /Mueres/); ev.push({ t: dt + .1, n: 'wahwah' });
  ev.push({ t: SEG[5].s, n: 'whoosh' }, { t: SEG[5].s + .2, n: 'pop' }, { t: SEG[5].s + .4, n: 'pop' });
  return ev;
};
window.scene = (t) => {
  const b = beat(t); const cx = W / 2;
  if (b <= 2) {
    sky('#a98bff', '#ffd1f0');
    for (let i = 0; i < 5; i++) cloud((i * 260 + t * 20) % 1400 - 150, 650 + hash(i) * 200, .8 + hash(i + 2) * .5, .7);
    ctx.fillStyle = '#5ccf8a'; ctx.fillRect(0, GY - 10, W, H); ctx.fillStyle = shade('#5ccf8a', -.15); ctx.fillRect(0, GY - 10, W, 18);
  }
  if (b === 0) {
    drawChar({ ...HERO, x: cx, y: GY, s: S, mood: 'happy', blink: blinkAt(t, 1), armL: 14, armR: 14 });
    const [hx, hy] = headPos(cx); airWaves(t, hx - 125 * S, hy + 10, -1); airWaves(t + .5, hx + 125 * S, hy + 10, 1);
    // mouth tape: closed mouth X
    const p = pop(t, findWord(0, /^respiraras/), .3);
    ctx.save(); ctx.translate(hx, hy + 62 * S); ctx.scale(p, p); ctx.rotate(-.1); rr(-60, -18, 120, 36, 8); fillStroke('#c9c4d9', 6); ctx.restore();
  }
  if (b === 1) {
    const on = findWord(1, /^auriculares/), dr = findWord(1, /^ahogas/);
    const choke = pr(t, dr - .4, dr + .6);
    const skin = choke > 0 ? `rgb(${Math.round(lerp(255, 160, choke))},${Math.round(lerp(217, 170, choke))},${Math.round(lerp(184, 255, choke))})` : HERO.skin;
    const shake = choke > 0 ? Math.sin(t * 40) * 6 * choke : 0;
    const hp = pop(t, on - .2, .35);
    drawChar({ ...HERO, skin: toRgbHex(skin), x: cx + shake, y: GY, s: S, mood: choke > .3 ? 'shock' : 'grin', blink: blinkAt(t, 1), armL: choke > .2 ? 165 : 14, armR: choke > .2 ? 165 : 14,
      earExtra: (hr) => { if (hp <= 0) return; ctx.save(); ctx.scale(1, hp); ctx.beginPath(); ctx.arc(0, -5, hr + 22, Math.PI * 1.08, Math.PI * 1.92); ctx.lineWidth = 34; ctx.strokeStyle = OUT; ctx.stroke(); ctx.lineWidth = 20; ctx.strokeStyle = '#ff3d6e'; ctx.stroke(); for (const d of [-1, 1]) { rr(d * (hr + 8) - 34, -40, 68, 100, 30); fillStroke('#ff3d6e', 8); } ctx.restore(); } });
    if (t < on) { const [hx, hy] = headPos(cx); airWaves(t, hx - 125 * S, hy + 10, -1); airWaves(t + .5, hx + 125 * S, hy + 10, 1); }
    if (choke > .3) { txt('!', cx - 220, 640, 120, { color: '#ff3d6e', stroke: 24, rot: -.2 }); txt('!', cx + 220, 640, 120, { color: '#ff3d6e', stroke: 24, rot: .2 }); }
  }
  if (b === 2) {
    const ws = findWord(2, /^susurra/), inh = findWord(2, /^inhalas/);
    drawChar({ body: '#3ddc84', skin: '#c98d66', hair: '#1b1010', hairStyle: 'long', leg: '#2a2f6f', x: cx + 280, y: GY, s: S * .95, mood: 'grin', look: [-1, 0], blink: blinkAt(t, 5), armR: 14, armL: 120, headRot: -8 });
    const sus = t > inh + .4;
    drawChar({ ...HERO, x: cx - 120, y: GY, s: S, mood: t > inh ? 'shock' : 'happy', look: [1, 0], blink: blinkAt(t, 1), headRot: 8, squash: t > inh ? -.05 * Math.sin((t - inh) * 20) * (1 - pr(t, inh, inh + .6)) : 0 });
    // letters flowing to right ear of hero
    const [hx, hy] = headPos(cx - 120); const ex = hx + 125 * S, ey = hy + 10;
    const letters = 'PSST... SECRETO'.split('');
    letters.forEach((ch, i) => {
      const st = ws + i * .1; const p = pr(t, st, st + 1.0); if (p <= 0 || p >= 1) return;
      const x = lerp(cx + 180, ex, eIn(p)), y = lerp(hy - 30, ey, eIn(p)) + Math.sin(p * 9 + i) * 30 * (1 - p);
      ctx.save(); ctx.globalAlpha = 1 - pr(p, .85, 1); txt(ch, x, y, 64 * (1 - p * .7), { color: '#fff', stroke: 14 }); ctx.restore();
    });
    if (t > inh) { const p = pop(t, inh, .3); txt('*GLUP*', ex + 60, hy - 170, 70 * p, { color: '#ffe23d', stroke: 18, rot: .15 }); }
  }
  if (b === 3) {
    sky('#9fb7d6', '#e6eef7');
    for (let i = 0; i < 40; i++) { const x = (hash(i) * W + t * 40 * (hash(i + 1) - .5)) % W, y = (hash(i + 3) * H + t * (120 + hash(i) * 80)) % (GY); circle(x, y, 6 + hash(i + 7) * 8); ctx.fillStyle = '#fff'; ctx.fill(); }
    ctx.fillStyle = '#eef3fb'; ctx.fillRect(0, GY - 10, W, H); ctx.fillStyle = '#cfd9e8'; ctx.fillRect(0, GY - 10, W, 18);
    const sn = findWord(3, /^resfriado/), gt = findWord(3, /^gotean/);
    const shiver = Math.sin(t * 30) * 3;
    drawChar({ ...HERO, x: cx + shiver, y: GY, s: S, mood: 'sad', blink: blinkAt(t, 1), armL: 30, armR: 30, body: '#5b8def',
      extraBody: (by) => { rr(-95, by - 10, 190, 50, 24); fillStroke('#ff3d6e', 7); rr(30, by + 20, 50, 120, 20); fillStroke('#ff3d6e', 7); },
      headExtra: () => { circle(0, 28, 22); fillStroke('#ff6f86', 6); /* bobble hat */ ctx.beginPath(); ctx.ellipse(0, -80, 120, 70, 0, Math.PI, 0); fillStroke('#ff3d6e', 8); circle(0, -160, 30); fillStroke('#fff', 7); } });
    if (t > gt - .2) { const [hx, hy] = headPos(cx); for (const d of [-1, 1]) for (let k = 0; k < 2; k++) { const ph = ((t - gt) * 1.3 + k * .5) % 1; ctx.save(); ctx.globalAlpha = 1 - ph; ctx.beginPath(); const x = hx + d * 128 * S, y = hy + 40 + ph * 260; ctx.moveTo(x, y - 28); ctx.quadraticCurveTo(x + 20, y + 6, x, y + 16); ctx.quadraticCurveTo(x - 20, y + 6, x, y - 28); fillStroke('#9df07a', 5); ctx.restore(); } }
    if (t > sn) { const p = pop(t, sn, .3); txt('¡ACHÍS!', cx + 230, 650, 80 * p, { color: '#fff', stroke: 18, rot: .2 }); }
  }
  if (b >= 4) {
    sky('#58c6ff', '#c8f1ff');
    // pool
    const PY = 1150;
    ctx.fillStyle = '#e9e2d0'; ctx.fillRect(0, PY - 20, W, H);
    rr(80, PY, 920, 440, 20); fillStroke(vgrad(PY, PY + 440, ['#4fd6ff', '#1f8fd6']), 9);
    for (let i = 0; i < 6; i++) { ctx.strokeStyle = 'rgba(255,255,255,.5)'; ctx.lineWidth = 6; ctx.beginPath(); for (let x = 100; x < 980; x += 20) ctx.lineTo(x, PY + 40 + i * 60 + Math.sin(x * .03 + t * 3 + i) * 6); ctx.stroke(); }
    // diving board
    rr(-20, 760, 420, 34, 12); fillStroke('#fff', 8); rr(40, 794, 40, 360, 6); fillStroke('#c2c6d6', 7);
    const jt = findWord(4, /^tiras/), splashT = findWord(4, /^cabeza/), dt = findWord(4, /Mueres/);
    if (t < splashT) {
      const p = pr(t, jt, splashT);
      const x = lerp(260, 600, p), y = lerp(760, PY + 60, eIn(p)) - Math.sin(p * Math.PI) * 90;
      drawChar({ ...HERO, x, y, s: .85, mood: 'grin', blink: blinkAt(t, 1), armL: lerp(14, 180, eOut(p * 2)), armR: lerp(14, 180, eOut(p * 2)), rot: lerp(0, 175, eIn(p)), shadow: false, body: '#ff4d6d' });
    } else {
      // splash
      const p = pr(t, splashT, splashT + .8);
      for (let i = 0; i < 14; i++) { const a = -Math.PI * (.1 + .8 * hash(i)); const d = p * (200 + hash(i + 3) * 200); circle(600 + Math.cos(a) * d, PY + 40 + Math.sin(a) * d + p * p * 300, 20 * (1 - p) + 4); ctx.fillStyle = '#bff0ff'; ctx.fill(); }
      // legs sticking out of water
      const bob = Math.sin(t * 3) * 6;
      limb(570, PY + 40 + bob, 560, PY - 100 + bob, '#3b3f8f', 36); limb(630, PY + 40 + bob, 650, PY - 100 + bob, '#3b3f8f', 36);
      for (const x of [560, 650]) { ctx.beginPath(); ctx.ellipse(x, PY - 110 + bob, 30, 16, 0, 0, Math.PI * 2); fillStroke('#2a2a3a'); }
      // bubbles from ears rising
      for (let i = 0; i < 8; i++) { const ph = ((t - splashT) * .8 + i / 8) % 1; circle(600 + Math.sin(i * 3 + t * 4) * 50, PY + 300 - ph * 260, 10 + hash(i) * 14); fillStroke('rgba(255,255,255,.6)', 4, '#fff'); }
      if (t > dt + .3) { const q = pr(t, dt + .3, dt + 3); ghost(cx + 230, 900 - q * 260, 1.2, Math.min(1, q * 3) * (1 - pr(t, SEG[5].s, SEG[5].s + .3))); }
      mueresStamp(t, dt); flash(t, dt, .3);
    }
  }
  seriesHeader(t, 'RESPIRAS POR LAS OREJAS');
  const days = [null, 1, 2, 4, 6, null];
  if (days[b] != null) dayBadge(t, days[b], SEG[b].s - .05, b === 4 && t >= findWord(4, /Mueres/));
  if (b === 5) voteCard(t, SEG[5].s, 'VER EN LA OSCURIDAD', 'NO DORMIR NUNCA', 'eye', 'moon');
  finishFrame(t, b === 5 && t > SEG[5].s + .3);
};
function toRgbHex(rgb) { if (rgb[0] === '#') return rgb; const m = rgb.match(/\d+/g).map(Number); return '#' + m.map(v => v.toString(16).padStart(2, '0')).join(''); }
