// f1b: sudor = pegamento
const HERO = { body: '#ffb72b', skin: '#ffd9b8', hair: '#3a2416', leg: '#3b3f8f' };
const GY = 1240, S = 1.1;
const GLUE = '#f3d84a';
function glueDrop(x, y, r, t, k = 0) { const dy = ((t * 60 + k * 37) % 80); ctx.save(); ctx.globalAlpha = 1 - dy / 80; ctx.beginPath(); ctx.ellipse(x, y + dy, r * .7, r, 0, 0, Math.PI * 2); fillStroke(GLUE, 5); circle(x - r * .25, y + dy - r * .3, r * .2); ctx.fillStyle = '#fff'; ctx.fill(); ctx.restore(); }
function floorScene(wall, floor) { ctx.fillStyle = vgrad(0, GY, [shade(wall, .1), wall]); ctx.fillRect(0, 0, W, GY); ctx.fillStyle = floor; ctx.fillRect(0, GY - 10, W, H); ctx.fillStyle = shade(floor, -.15); ctx.fillRect(0, GY - 10, W, 18); }
window.sfxList = () => {
  const ev = [{ t: 0.05, n: 'whoosh' }, { t: .9, n: 'bubble', v: .6 }];
  for (let i = 1; i <= 4; i++) ev.push({ t: SEG[i].s - .05, n: 'pop' });
  ev.push({ t: findWord(1, /^cinco/), n: 'click' }, { t: findWord(1, /^Ya$/), n: 'boing' });
  ev.push({ t: findWord(2, /^amaneces/), n: 'ding', v: .6 }, { t: findWord(2, /^almohada/), n: 'boing' });
  ev.push({ t: findWord(3, /^pelusas/), n: 'pop' }, { t: findWord(3, /^llaves/), n: 'pop' }, { t: findWord(3, /^gato/), n: 'boing' });
  ev.push({ t: findWord(4, /^Cuarenta/), n: 'rise' }, { t: findWord(4, /^pegado/), n: 'bubble' });
  const dt = findWord(4, /Mueres/); ev.push({ t: dt - .05, n: 'thud' }, { t: dt + .1, n: 'wahwah' });
  ev.push({ t: SEG[5].s, n: 'whoosh' }, { t: SEG[5].s + .2, n: 'pop' }, { t: SEG[5].s + .4, n: 'pop' });
  return ev;
};
window.scene = (t) => {
  const b = beat(t);
  const cx = W / 2;
  const sweat = (x, y) => { for (let k = 0; k < 3; k++) glueDrop(x + (k - 1) * 120 * S, y - 60 + hash(k) * 40, 14, t, k); };
  if (b <= 1) {
    sky('#7fd6ff', '#d8f6ff');
    ctx.fillStyle = '#7fd36b'; ctx.beginPath(); ctx.ellipse(200, GY, 700, 260, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = '#58b947'; ctx.fillRect(0, GY - 10, W, H); ctx.fillStyle = '#c9b48a'; ctx.fillRect(0, GY + 10, W, 50);
    cloud(200 + t * 10, 700, 1.2, .9); cloud(850 - t * 8, 620, 1, .9);
  }
  if (b === 0) {
    drawChar({ ...HERO, x: cx, y: GY, s: S, mood: t > 1.2 ? 'worried' : 'happy', blink: blinkAt(t, 1), look: [0, -.3], armL: 20, armR: 20 });
    sweat(cx, GY - 520 * S); glueDrop(cx + 120, GY - 470, 18, t, 5);
  }
  if (b === 1) {
    const stuck = findWord(1, /^Ya$/), hi5 = findWord(1, /^cinco/);
    const up = eOut(pr(t, SEG[1].s + .3, hi5));
    const pull = t > stuck ? Math.sin((t - stuck) * 7) : 0;
    const lean = t > stuck ? 1 : 0;
    drawChar({ ...HERO, x: cx - 150 - lean * 20 - pull * 14, y: GY, s: S, mood: t > stuck ? 'shock' : 'grin', blink: blinkAt(t, 1), look: [1, 0], armR: lerp(15, 150, up), armL: 15, rot: -lean * 6 - pull * 3 });
    drawChar({ body: '#3ddc84', skin: '#c98d66', hair: '#1b1010', hairStyle: 'long', leg: '#2a2f6f', x: cx + 150 + lean * 20 + pull * 14, y: GY, s: S, mood: t > stuck ? 'shock' : 'grin', blink: blinkAt(t, 4), look: [-1, 0], armL: lerp(15, 150, up), armR: 15, rot: lean * 6 + pull * 3 });
    if (t > hi5) { const p = pop(t, hi5, .3); ctx.beginPath(); ctx.ellipse(cx, GY - 392, 50 * p + Math.abs(pull) * 10, 36 * p, 0, 0, Math.PI * 2); fillStroke(GLUE, 6); for (let k = 0; k < 3; k++) glueDrop(cx - 20 + k * 20, GY - 370, 10, t, k + 2); star4(cx, GY - 470, 40 * pop(t, hi5, .2) * (1 - pr(t, hi5 + .3, hi5 + .6)), '#fff'); }
  }
  if (b === 2) {
    // bedroom
    const dawn = pr(t, findWord(2, /^amaneces/) - .2, findWord(2, /^amaneces/) + .4);
    floorScene(dawn > .5 ? '#ffd8a8' : '#3a3a7a', '#a0673e');
    // window
    rr(620, 380 + 260, 320, 300, 16); fillStroke(dawn > .5 ? '#9fe3ff' : '#18184a', 9);
    if (dawn > .5) { circle(780, 820 - dawn * 60, 60); fillStroke('#ffd21f', 7); } else { circle(820, 730, 40); fillStroke('#ffe9a8', 6); }
    ctx.beginPath(); ctx.moveTo(780, 640); ctx.lineTo(780, 940); ctx.moveTo(620, 790); ctx.lineTo(940, 790); ctx.lineWidth = 9; ctx.strokeStyle = OUT; ctx.stroke();
    // bed
    rr(40, GY - 200, 520, 130, 20); fillStroke('#5b8def', 8); rr(40, GY - 300, 40, 300, 10); fillStroke('#8a4b2a', 8);
    if (dawn < .5) {
      // sleeping hero lying
      ctx.save(); ctx.translate(560, GY - 215); ctx.rotate(-Math.PI / 2); drawChar({ ...HERO, x: 0, y: 0, s: .7, mood: 'happy', blink: .95, shadow: false, look: [0, 0] }); ctx.restore();
      rr(70, GY - 300, 170, 90, 40); fillStroke('#fff', 7);
      txt('Z', 380, 700 + Math.sin(t * 3) * 20, 80, { color: '#fff', stroke: 16 }); txt('z', 450, 620 + Math.sin(t * 3 + 1) * 20, 60, { color: '#fff', stroke: 14 });
      sweat(330, GY - 330);
    } else {
      const tug = Math.sin(t * 8) * 8;
      drawChar({ ...HERO, x: cx - 60, y: GY, s: S, mood: 'worried', look: [-1, 0], armL: 160, armR: 40, headRot: -10 + tug * .5,
        headExtra: () => { ctx.save(); ctx.rotate(-.3); rr(-235, -70, 170, 110, 46); fillStroke('#fff', 8); ctx.strokeStyle = '#d9d9e3'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-210, -10); ctx.lineTo(-90, -10); ctx.stroke(); ctx.restore(); glueDrop(-110, 40, 12, t, 1); } });
    }
  }
  if (b === 3) {
    floorScene('#ff9b7a', '#59606e');
    // gym props
    for (let i = 0; i < 3; i++) { const x = 140 + i * 400; rr(x - 10, 680, 20, 200, 5); fillStroke('#c2c6d6', 6); for (const d of [-1, 1]) { rr(x - 70, 680 + (d < 0 ? 0 : 180) - 10, 140, 40, 14); fillStroke('#2a2a3a', 6); } }
    
    const ballT = findWord(3, /^Sales/);
    if (t < ballT) {
      const run = (t - SEG[3].s) * 1.8;
      drawChar({ ...HERO, x: cx, y: GY, s: S, mood: 'grin', walk: run, blink: blinkAt(t, 2), body: '#ff4d6d' });
      sweat(cx, GY - 520 * S);
    } else {
      // ball of stuff
      const p = pop(t, ballT, .4), R = 300 * p, bx = cx, by = GY - 300 - Math.abs(Math.sin((t - ballT) * 4)) * 30;
      groundShadow(bx, GY, 260 * p, .3);
      ctx.save(); ctx.translate(bx, by); ctx.rotate(Math.sin(t * 2) * .05);
      // fuzz
      for (let i = 0; i < 40; i++) { const a = i / 40 * 6.28; circle(Math.cos(a) * R * .92, Math.sin(a) * R * .92, 46 * p); ctx.fillStyle = '#c9c4d9'; ctx.fill(); }
      circle(0, 0, R); fillStroke(radial(-80, -80, 20, R * 1.2, '#efeaf8', '#a9a3bf'), 9);
      // face peeking
      ctx.save(); ctx.scale(.9 * p, .9 * p); circle(0, -10, 112); fillStroke(HERO.skin, 8); drawFace({ mood: 'shock', look: [0, 0] }, 112); ctx.restore();
      const items = [[findWord(3, /^pelusas/), -200, 150, 'sock'], [findWord(3, /^llaves/), 210, 120, 'keys'], [findWord(3, /^llaves/) + .25, -230, -120, 'coin'], [findWord(3, /^gato/), 130, -250, 'cat']];
      for (const [it, x, y, kind] of items) { const q = pop(t, it, .35); if (q <= 0) continue; ctx.save(); ctx.translate(x, y); ctx.scale(q, q); drawItem(kind, t); ctx.restore(); }
      ctx.restore();
    }
  }
  if (b >= 4) {
    // hot street
    const heat = pr(t, SEG[4].s, SEG[4].s + 1.5);
    sky(`rgb(255,${lerp(170, 120, heat)},${lerp(90, 40, heat)})`, '#ffe08a');
    circle(860, 380 + 200, 120 + Math.sin(t * 4) * 6); fillStroke('#ffe23d', 9);
    for (let i = 0; i < 12; i++) { const a = i / 12 * 6.28 + t * .5; ctx.beginPath(); ctx.moveTo(860 + Math.cos(a) * 150, 580 + Math.sin(a) * 150); ctx.lineTo(860 + Math.cos(a) * 200, 580 + Math.sin(a) * 200); ctx.lineWidth = 12; ctx.strokeStyle = '#ffe23d'; ctx.stroke(); }
    // buildings
    for (let i = 0; i < 4; i++) { rr(-40 + i * 300, GY - 520 - hash(i) * 200, 260, 900, 10); fillStroke(['#ff9f80', '#f7b267', '#e98a6a', '#f4a259'][i], 8); }
    ctx.fillStyle = '#3d3d4d'; ctx.fillRect(0, GY - 10, W, H); ctx.fillStyle = '#fff'; for (let i = 0; i < 6; i++) ctx.fillRect(i * 200 + 20, GY + 120, 110, 18);
    // thermometer
    const th = pop(t, findWord(4, /^Cuarenta/), .4);
    ctx.save(); ctx.translate(170, 760); ctx.scale(th, th); rr(-30, -170, 60, 280, 30); fillStroke('#fff', 8); circle(0, 120, 50); fillStroke('#ff2b2b', 8); rr(-14, -150 + 150 * (1 - heat), 28, 270 - 150 * (1 - heat), 14); ctx.fillStyle = '#ff2b2b'; ctx.fill(); ctx.restore();
    if (th > 0) pill(170, 560, '40°', 64, '#ff2b2b', '#fff', { scale: th });
    const dt = findWord(4, /Mueres/), stickT = findWord(4, /^pegado/);
    const melt = pr(t, stickT, dt);
    const dead = t >= dt;
    // glue puddle
    ctx.beginPath(); ctx.ellipse(cx, GY + 6, 140 + melt * 160, 26 + melt * 18, 0, 0, Math.PI * 2); fillStroke(GLUE, 6);
    const tug = t > stickT && !dead ? Math.sin(t * 10) * 6 : 0;
    drawChar({ ...HERO, x: cx, y: GY, s: S, squash: melt * .35, mood: dead ? 'dead' : t > stickT ? 'shock' : 'worried', blink: dead ? 0 : blinkAt(t, 2), armL: dead ? 40 : 150 + tug * 3, armR: dead ? 40 : 150 - tug * 3, rot: tug * .4, shadow: false });
    if (!dead) sweat(cx, GY - 540 * S);
    for (let i = 0; i < 4; i++) { ctx.save(); ctx.globalAlpha = .25; ctx.strokeStyle = '#fff'; ctx.lineWidth = 8; ctx.beginPath(); for (let y = 0; y < 300; y += 10) ctx.lineTo(200 + i * 230 + Math.sin(y * .05 + t * 6 + i) * 14, GY - 40 - y); ctx.stroke(); ctx.restore(); }
    if (t > dt + .3) { const p = pr(t, dt + .3, dt + 3); ghost(cx + 220, 760 - p * 300, 1.2, Math.min(1, p * 3) * (1 - pr(t, SEG[5].s, SEG[5].s + .3))); }
    mueresStamp(t, dt); flash(t, dt, .3);
  }
  seriesHeader(t, 'TU SUDOR = PEGAMENTO');
  const days = [null, 1, 2, 4, 5, null];
  if (days[b] != null) dayBadge(t, days[b], SEG[b].s - .05, b === 4 && t >= findWord(4, /Mueres/));
  if (b === 5) voteCard(t, SEG[5].s, 'RESPIRAR POR LAS OREJAS', 'NO DORMIR NUNCA', 'ear', 'moon');
  finishFrame(t, b === 5 && t > SEG[5].s + .3);
};
function drawItem(kind, t) {
  if (kind === 'sock') { ctx.beginPath(); ctx.moveTo(-20, -60); ctx.lineTo(20, -60); ctx.lineTo(20, 10); ctx.quadraticCurveTo(70, 15, 60, 50); ctx.lineTo(-10, 50); ctx.quadraticCurveTo(-25, 40, -20, 10); ctx.closePath(); fillStroke('#fff', 7); ctx.fillStyle = '#ff3d6e'; ctx.fillRect(-18, -55, 36, 16); }
  if (kind === 'keys') { circle(0, -20, 26); fillStroke('#ffd21f', 7); circle(0, -20, 10); ctx.fillStyle = '#c9c4d9'; ctx.fill(); rr(-8, 0, 16, 70, 4); fillStroke('#ffd21f', 6); rr(8, 40, 22, 10, 3); fillStroke('#ffd21f', 5); }
  if (kind === 'coin') { circle(0, 0, 34); fillStroke('#ffc21f', 7); txt('€', 0, 2, 40, { color: OUT, stroke: 0 }); }
  if (kind === 'cat') {
    ctx.rotate(.3 + Math.sin(t * 6) * .08);
    ctx.beginPath(); ctx.moveTo(-60, -30); ctx.lineTo(-50, -100); ctx.lineTo(-15, -60); ctx.lineTo(15, -60); ctx.lineTo(50, -100); ctx.lineTo(60, -30); ctx.ellipse(0, -10, 65, 55, 0, 0, Math.PI); ctx.closePath(); fillStroke('#ff9f43', 8);
    for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(d * 25, -25, 12, 16, 0, 0, Math.PI * 2); fillStroke('#fff', 5); circle(d * 25, -22, 7); ctx.fillStyle = OUT; ctx.fill(); }
    ctx.beginPath(); ctx.moveTo(-10, 5); ctx.lineTo(0, 15); ctx.lineTo(10, 5); ctx.lineWidth = 6; ctx.strokeStyle = OUT; ctx.stroke();
    txt('¡MIAU!', 40, -150, 54, { color: '#fff', stroke: 14, rot: .2 });
  }
}
