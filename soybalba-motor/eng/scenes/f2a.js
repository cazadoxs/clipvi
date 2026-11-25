// f2a: plátanos radiactivos
function banana(x, y, s, rot = 0, glow = 0, bite = false) {
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
  if (glow > 0) { ctx.save(); ctx.globalAlpha = glow * .6; ctx.fillStyle = radial(0, 0, 20, 260, 'rgba(120,255,90,.9)', 'rgba(120,255,90,0)'); circle(0, 0, 260); ctx.fill(); ctx.restore(); }
  ctx.beginPath(); ctx.moveTo(-170, -40); ctx.quadraticCurveTo(0, 200, 170, -60); ctx.quadraticCurveTo(150, -30, 125, -20); ctx.quadraticCurveTo(0, 30, -135, -45); ctx.closePath();
  fillStroke(glow > .5 ? '#d8ff5a' : '#ffe14d', 9);
  ctx.beginPath(); ctx.moveTo(-120, -10); ctx.quadraticCurveTo(0, 130, 140, -30); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(0,0,0,.15)'; ctx.stroke();
  rr(160, -85, 26, 40, 6); fillStroke('#6b4a2a', 6);
  ctx.beginPath(); ctx.arc(-172, -42, 10, 0, Math.PI * 2); ctx.fillStyle = OUT; ctx.fill();
  if (bite) { circle(-140, -20, 34); ctx.fillStyle = '#fff6cf'; ctx.fill(); }
  ctx.restore();
}
function particles(t, x, y, r, n, col = '#7dff5a', seed = 0) {
  for (let i = 0; i < n; i++) { const a = hash(i + seed) * 6.28; const ph = (t * .7 + hash(i + seed + 7)) % 1; const d = r * (.3 + ph); ctx.save(); ctx.globalAlpha = 1 - ph; circle(x + Math.cos(a) * d, y + Math.sin(a) * d, 9); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
}
function truck(x, y, s, load) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-330, -260, 440, 200, 16); fillStroke('#ffffff', 9);
  if (load) for (let i = 0; i < 7; i++) banana(-300 + i * 62, -275 - (i % 2) * 20, .32, -.3 + (i % 3) * .2);
  rr(-330, -260, 440, 200, 16); fillStroke(null, 9);
  txt('PLÁTANOS', -110, -160, 52, { color: '#ffb72b', stroke: 10 });
  rr(110, -220, 170, 160, [50, 16, 0, 0]); fillStroke('#3d7bff', 9);
  rr(160, -200, 90, 60, 14); fillStroke('#bff0ff', 7);
  for (const wx of [-240, -40, 200]) { circle(wx, -55, 52); fillStroke('#2a2a3a', 9); circle(wx, -55, 20); fillStroke('#c2c6d6', 6); }
  ctx.restore();
}
window.sfxList = () => {
  const ev = [{ t: .05, n: 'whoosh' }];
  for (let i = 1; i <= 4; i++) ev.push({ t: SEG[i].s - .05, n: 'whoosh', v: .7 });
  ev.push({ t: findWord(0, /^radiactivo/), n: 'boing' });
  for (let k = 0; k < 10; k++) ev.push({ t: findWord(1, /^potasio/) + k * .17 + hash(k) * .1, n: 'tick' });
  ev.push({ t: findWord(2, /^alarmas/) - .1, n: 'alarm' });
  ev.push({ t: findWord(3, /^radiactivo/), n: 'boing' });
  ev.push({ t: findWord(4, /^central/), n: 'ding' });
  ev.push({ t: findWord(5, /^¿Lo/), n: 'pop' }, { t: findWord(5, /^¿Lo/) + .3, n: 'pop' }, { t: findWord(5, /^¿Lo/) + .45, n: 'pop' });
  return ev;
};
window.scene = (t) => {
  const b = beat(t);
  bg(t, '#3a2c8f', '#140f3a');
  ctx.save(); punch(t, b);
  const GY = 1220;
  if (b === 0) {
    const rad = findWord(0, /^radiactivo/), bite = findWord(0, /^estás/);
    const g = pr(t, rad - .2, rad + .3);
    drawChar({ ...HERO, x: 380, y: GY, s: 1.05, mood: t > rad ? 'shock' : 'grin', look: [1, -.3], blink: blinkAt(t, 1), armR: 120, body: g > .5 ? '#9cff6a' : HERO.body });
    banana(660, 760, 1.2, -.5, g, t > bite);
    if (g > 0) { particles(t, 660, 760, 260, 18); radSymbol(800, 540, 80 * eBack(g), t); }
  }
  if (b === 1) {
    const k = findWord(1, /^potasio/);
    banana(W / 2, 820, 2.0, -.2, .8);
    particles(t, W / 2, 820, 420, 30);
    tag(W / 2 - 180, 600, 'K-40', 90, '#7dff5a', pr(t, k - .1, k + .3) * 1.2, -.1, OUT);
    // geiger counter
    const p = pop(t, findWord(1, /^emite/) - .3, .4);
    ctx.save(); ctx.translate(W / 2 + 250, 1090); ctx.scale(p, p);
    rr(-110, -90, 220, 180, 26); fillStroke('#ffb72b', 8); rr(-80, -65, 160, 80, 12); fillStroke('#1f2b1f', 6);
    const needle = -0.9 + Math.sin(t * 25) * .3 + .6; ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(Math.cos(needle - 1.57) * 60, 10 + Math.sin(needle - 1.57) * 60); ctx.lineWidth = 6; ctx.strokeStyle = '#7dff5a'; ctx.stroke();
    txt('BIP BIP', 0, 55, 34, { color: OUT, stroke: 0 }); ctx.restore();
  }
  if (b === 2) {
    // road + border
    ctx.fillStyle = '#4b4b5e'; ctx.fillRect(0, 1040, W, 260); ctx.fillStyle = '#fff'; for (let i = 0; i < 7; i++) ctx.fillRect(((i * 220 - t * 300) % 1540) - 200, 1160, 120, 14);
    const al = findWord(2, /^alarmas/);
    const arrive = eOut(pr(t, SEG[2].s, al - .2));
    // booth
    rr(760, 620, 240, 420, 14); fillStroke('#e6e6f0', 9); rr(790, 660, 180, 120, 10); fillStroke('#bff0ff', 7);
    txt('FRONTERA', 880, 600, 50, { color: '#fff', stroke: 14 });
    const on = t > al - .1 && Math.floor(t * 6) % 2 === 0;
    circle(880, 520, 38); fillStroke(on ? '#ff2b2b' : '#7a2b2b', 8);
    if (on) { ctx.save(); ctx.globalAlpha = .35; circle(880, 520, 120); ctx.fillStyle = '#ff2b2b'; ctx.fill(); ctx.restore(); }
    // barrier
    ctx.save(); ctx.translate(740, 980); rr(-20, -10, 40, 60, 8); fillStroke('#c2c6d6', 7); rr(-560, -18, 560, 36, 18); fillStroke('#fff', 7); for (let i = 0; i < 5; i++) { ctx.fillStyle = '#ff2b2b'; ctx.fillRect(-540 + i * 110, -16, 50, 32); } ctx.restore();
    truck(lerp(-400, 300, arrive), 1180, 1.0, true);
    if (t > al - .1) { particles(t, 300, 900, 300, 20); tag(W / 2, 760, '¡RADIACIÓN!', 70, '#ff2b2b', pr(t, al - .1, al + .2), .05); }
    ctx.save(); ctx.globalAlpha = on ? .12 : 0; ctx.fillStyle = '#ff2b2b'; ctx.fillRect(0, 0, W, H); ctx.restore();
  }
  if (b === 3) {
    const r = findWord(3, /^radiactivo/), you = findWord(3, /^tu$/);
    const g = pr(t, you, r);
    if (g > 0) { ctx.save(); ctx.globalAlpha = g * .7; ctx.fillStyle = radial(W / 2, 900, 50, 520, 'rgba(125,255,90,.9)', 'rgba(125,255,90,0)'); ctx.fillRect(0, 0, W, H); ctx.restore(); particles(t, W / 2, 880, 380, 24); }
    drawChar({ ...HERO, x: W / 2, y: GY, s: 1.25, mood: t > you ? 'shock' : 'happy', blink: blinkAt(t, 1), armL: t > r ? 150 : 20, armR: t > r ? 150 : 20, skin: g > .5 ? '#d6ffb8' : HERO.skin });
    if (t > r) radSymbol(W / 2 + 280, 620, 70 * pop(t, r, .3), t);
  }
  if (b === 4) {
    const eq = findWord(4, /^misma/), plant = findWord(4, /^vivir/);
    // bed with two characters (top)
    const p1 = pop(t, SEG[4].s, .4);
    ctx.save(); ctx.translate(W / 2, 660); ctx.scale(p1, p1);
    rr(-300, -40, 600, 170, 30); fillStroke('#5b8def', 9);
    for (const [dx, sk, hs] of [[-110, '#ffd9b8', 'normal'], [110, '#c98d66', 'long']]) { ctx.save(); ctx.translate(dx, -70); ctx.scale(.55, .55); circle(0, 0, 112); fillStroke(sk, 8); ctx.save(); circle(0, 0, 112); ctx.clip(); ctx.fillStyle = hs === 'long' ? '#1b1010' : '#3a2416'; ctx.beginPath(); ctx.ellipse(0, -80, 130, 70, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); circle(0, 0, 112); fillStroke(null, 8); drawFace({ mood: 'happy', look: [0, 0], blink: .95, blushK: .7 }, 112); ctx.restore(); }
    rr(-320, -10, 640, 150, 40); fillStroke('#ff8fa3', 9);
    txt('Z z', 230, -170 + Math.sin(t * 3) * 10, 60, { color: '#fff', stroke: 14 });
    pill(0, 190, '1 NOCHE', 54, '#fff', OUT);
    ctx.restore();
    const pe = pop(t, eq - .1, .35);
    ctx.save(); ctx.translate(W / 2, 930); ctx.scale(pe, pe); txt('=', 0, 0, 140, { color: '#ffd21f', stroke: 26 }); ctx.restore();
    // nuclear plant (bottom)
    const pp = pop(t, plant - .2, .4);
    ctx.save(); ctx.translate(W / 2 - 40, 1330); ctx.scale(pp * .65, pp * .65);
    for (const dx of [-170, 60]) { ctx.beginPath(); ctx.moveTo(dx - 100, 0); ctx.quadraticCurveTo(dx - 40, -150, dx - 70, -260); ctx.lineTo(dx + 70, -260); ctx.quadraticCurveTo(dx + 40, -150, dx + 100, 0); ctx.closePath(); fillStroke('#d9dde8', 9); for (let k = 0; k < 3; k++) cloud(dx + Math.sin(t + k) * 20, -300 - k * 60 - ((t * 40) % 60), .6 + k * .15, .8 - k * .2); }
    rr(180, -150, 200, 150, 10); fillStroke('#b8bfd3', 9); radSymbol(280, -75, 46, 0);
    ctx.restore();
    if (pp > 0) pill(W / 2 + 300, 1150, '6 MESES', 50, '#ff3d6e', '#fff', { scale: pp, rot: .1 });
  }
  if (b === 5) {
    drawChar({ ...HERO, x: W / 2, y: GY, s: 1.2, mood: 'grin', blink: blinkAt(t, 1), armR: 150, armL: 15 });
    banana(W / 2 + 230, 690, .8, -.6, .3);
  }
  ctx.restore();
  header(t, 1);
  const ec = findWord(5, /^¿Lo/);
  endCard(t, ec, '¿LO SABÍAS?');
  finishFrame(t, t > ec + .2);
};
