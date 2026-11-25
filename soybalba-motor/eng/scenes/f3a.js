// f3a: las bombillas de Leo
const HOUSES = [['#ff8fa3', '#c2405d'], ['#9ad0ff', '#3a6fd1'], ['#ffe08a', '#d7892a'], ['#c7a6ff', '#6b44c9'], ['#9df07a', '#3a9a4a'], ['#ffb38a', '#c25a2a']];
const GY = 1240;
function street(t, xoff, leoLit, others = 1, leoX = null) {
  for (let i = -1; i < 9; i++) {
    const x = i * 340 + xoff; if (x < -300 || x > W + 300) continue;
    const isLeo = leoX !== null && i === leoX;
    const [w, r] = isLeo ? ['#b9b3a0', '#6b5a4a'] : HOUSES[(i + 6) % 6];
    const lit = isLeo ? leoLit : [1, 1, 1, 1].map((v, k) => others * (.85 + .15 * Math.sin(t * 2 + i * 3 + k)));
    house(x, GY, 280, 330 + hash(i + 2) * 70, w, r, lit, { dark: isLeo ? .62 : .4 });
  }
}
window.sfxList = () => {
  const ev = [{ t: .1, n: 'whoosh', v: .5 }];
  ev.push({ t: findWord(0, /^apaga/), n: 'switch_off' });
  ev.push({ t: findWord(1, /^realidad/), n: 'switch_on' }, { t: findWord(1, /^realidad/) + .1, n: 'sparkle' });
  ev.push({ t: findWord(2, /^Menos/), n: 'thud', v: .5 });
  ev.push({ t: findWord(3, /^Mentiroso/), n: 'pop' });
  ev.push({ t: findWord(3, /^pan/), n: 'thud', v: .4 });
  ev.push({ t: findWord(4, /^asoma/), n: 'whoosh', v: .4 });
  ev.push({ t: findWord(8, /^apaga/), n: 'switch_off' });
  ev.push({ t: findWord(9, /^corre/), n: 'whoosh', v: .5 });
  for (let k = 0; k < 8; k++) ev.push({ t: findWord(10, /^velas/) + k * .35, n: 'pop', v: .4 });
  const on = findWord(13, /^encendió/);
  for (let k = 0; k < 4; k++) ev.push({ t: on - .3 + k * .22, n: 'switch_on', v: .8 });
  ev.push({ t: on + .6, n: 'sparkle' }, { t: on + .9, n: 'ding', v: .5 });
  ev.push({ t: SEG[14].s, n: 'whoosh', v: .5 });
  return ev;
};
window.scene = (t) => {
  const b = beat(t);
  const A = SEG[b].s - .15, B = segEnd(b);
  ctx.save();
  if (b === 0) {
    shotCam(t, A, B, 1, 1.08, W / 2, 1000);
    night(t); moon(820, 330, 60); ground(GY);
    const off = findWord(0, /^apaga/);
    const L = t < off ? 1 : .0;
    house(W / 2 + 120, GY, 420, 470, '#ffe08a', '#d7892a', [1, L, 1, 1]);
    house(-60, GY, 300, 380, '#ff8fa3', '#c2405d', [1, 1, 1, 1]); house(W + 80, GY, 300, 360, '#9ad0ff', '#3a6fd1', [1, 1, 1, 1]);
    lamp(150, GY + 4, 1);
    drawChar({ ...VILL[2], x: 300, y: GY + 60, s: .95, mood: t > off ? 'shock' : 'grin', blink: blinkAt(t, 3), look: [1, -.5], talk: t > 1.2 && t < 2.2 ? talkAt(t * 1, [{ s: 1.2, e: 2.2 }]) : 0 });
    speech(330, 820, '¡Qué tarta tan rica!', 50, pr(t, .9, 1.2) * (1 - pr(t, 3.4, 3.7)), { dx: 120, dy: 190, maxW: 420 });
    if (t > off) { const p = pop(t, off, .3); txt('¡CLIC!', W / 2 + 230, 650, 70 * p, { color: '#fff', stroke: 16, rot: .1 }); }
  }
  if (b === 1) {
    shotCam(t, A, B, 1, 1.1, W / 2, 850);
    night(t, .6);
    const on = pr(t, findWord(1, /^realidad/) - .1, findWord(1, /^realidad/) + .2);
    bulb(W / 2, 860, 1.6, on, t);
    if (on > 0) sparkles(t, W / 2, 800, 360, 10, '#ffe23d', 5);
    pill(W / 2, 520, 'SOLO SI SE HACE VERDAD', 56, '#3ddc84', OUT, { scale: pop(t, findWord(1, /^solo/), .35) });
  }
  if (b === 2) {
    const reveal = findWord(2, /^Menos/);
    const pan = eIO(pr(t, A, reveal + .3));
    ctx.translate(0, 0);
    night(t); moon(200, 300, 50); ground(GY);
    street(t, lerp(80, -1280, pan), [0, 0, 0, 0], 1, 5);
    lamp(lerp(560, -800, pan), GY + 4, 1);
    if (t > reveal + .2) { const p = pop(t, reveal + .2, .4); pill(W / 2 + 0, 560, '10 AÑOS A OSCURAS', 58, '#fff', OUT, { scale: p }); }
  }
  if (b === 3) {
    shotCam(t, A, B, 1, 1.04, W / 2, 900);
    night(t); ground(GY);
    street(t, -200, [0, 0, 0, 0], 1);
    // shop with shutter
    const sh = pr(t, findWord(3, /^compra/) - .1, findWord(3, /^pan/) + .2);
    rr(640, GY - 380, 380, 380, 10); fillStroke('#c25a2a', 8); txt('PANADERÍA', 830, GY - 410, 52, { color: '#ffe08a', stroke: 12 });
    rr(670, GY - 330, 320, 250, 8); fillStroke('#ffe08a', 7); glow(830, GY - 200, 300, 1 - sh);
    rr(670, GY - 330, 320, 250 * sh, 8); fillStroke('#7a7f99', 7); for (let k = 0; k < 8 * sh; k++) { ctx.beginPath(); ctx.moveTo(672, GY - 330 + k * 30); ctx.lineTo(988, GY - 330 + k * 30); ctx.lineWidth = 4; ctx.strokeStyle = OUT; ctx.stroke(); }
    if (sh > .9) pill(830, GY - 200, 'CERRADO', 46, '#ff3d6e', '#fff', { rot: -.08 });
    // villager turning away
    const turn = t > findWord(3, /^saluda/) - .4;
    drawChar({ ...VILL[1], x: 520, y: GY + 40, s: .85, mood: turn ? 'angry' : 'flat', look: [turn ? 1 : -1, 0], blink: blinkAt(t, 4), headRot: turn ? 10 : -5 });
    const wx = lerp(-120, 300, pr(t, A, B));
    drawChar({ ...LEO, x: wx, y: GY + 60, s: 1.0, walk: t * .9, mood: 'sad', look: [1, .3], blink: blinkAt(t, 1) });
    const p = pop(t, findWord(3, /^Gran/) - .1, .4);
    if (p > 0) pill(clamp(wx, 330, W - 330), 560 + Math.sin(t * 3) * 6, 'EL GRAN MENTIROSO', 52, '#ff3d6e', '#fff', { scale: p, rot: -.04 });
  }
  if (b === 4) {
    shotCam(t, A, B, 1, 1.1, W / 2, 900);
    night(t); moon(860, 260, 55); ground(GY);
    house(W / 2 + 10, GY, 520, 640, '#b9b3a0', '#6b5a4a', [0, 0, 0, 0], { dark: .62 });
    // Sara sneaking to window (bottom-left window)
    const ap = eOut(pr(t, findWord(4, /^asoma/) - .6, findWord(4, /^ventana/)));
    const sx = lerp(-120, 300, ap);
    drawChar({ ...SARA, x: sx, y: GY + 60, s: .8, walk: ap < 1 ? t * 1.6 : null, mood: 'happy', look: [1, -.6], blink: blinkAt(t, 2), armR: ap >= 1 ? 150 : 14 });
    if (ap >= 1) { const q = pop(t, findWord(4, /^descubrir/), .4); txt('?', sx + 120, 700, 110 * q, { color: '#ffd21f', stroke: 22, rot: .2 }); }
    pill(sx, 640, 'SARA', 46, '#ff6f91', '#fff', { scale: pop(t, findWord(4, /^Sara/), .3) * (1 - pr(t, findWord(4, /^asoma/), findWord(4, /^asoma/) + .3)) });
  }
  if (b >= 5 && b <= 7 || b === 11 || b === 12) {
    // interior: candle-lit room
    const zoomOn = b === 6 || b === 11 ? 'abu' : b === 7 || b === 12 ? 'leo' : 'wide';
    const cx = zoomOn === 'abu' ? 330 : zoomOn === 'leo' ? 760 : W / 2;
    shotCam(t, A, B, zoomOn === 'wide' ? 1 : 1.22, zoomOn === 'wide' ? 1.06 : 1.3, cx, 900);
    ctx.fillStyle = vgrad(0, H, ['#2a1d3a', '#3d2a4a']); ctx.fillRect(0, 0, W, H);
    // window behind
    const outside = b >= 11 ? 1 : 0;
    rr(380, 360, 320, 360, 14); fillStroke(outside ? '#ffc56b' : '#141838', 9);
    if (outside) { glow(540, 540, 520, .9); for (let k = 0; k < 6; k++) { circle(420 + k * 50, 640 - (k % 2) * 30, 14); ctx.fillStyle = '#fff2b0'; ctx.fill(); } }
    else { for (let k = 0; k < 8; k++) { circle(400 + hash(k) * 280, 380 + hash(k + 3) * 300, 3); ctx.fillStyle = '#fff'; ctx.fill(); } }
    ctx.beginPath(); ctx.moveTo(540, 360); ctx.lineTo(540, 720); ctx.moveTo(380, 540); ctx.lineTo(700, 540); ctx.lineWidth = 9; ctx.strokeStyle = OUT; ctx.stroke();
    ctx.fillStyle = '#5a3a2a'; ctx.fillRect(0, GY - 10, W, H);
    // dead ceiling bulb
    ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, 200); ctx.lineWidth = 5; ctx.strokeStyle = '#111'; ctx.stroke(); bulb(W / 2, 270, .45, 0, t);
    // armchair + abuela
    rr(130, GY - 420, 400, 420, 60); fillStroke('#7a3b5a', 9);
    const abTalk = b === 6 || b === 11 ? talkAt(t, SEG[b].words) : 0;
    drawChar({ ...ABU, x: 330, y: GY - 60, s: .95, sit: true, mood: 'happy', blink: .93, talk: abTalk, look: [0, 0], armL: 30, armR: 60, shadow: false });
    rr(110, GY - 220, 80, 220, 30); fillStroke('#7a3b5a', 9); rr(470, GY - 220, 80, 220, 30); fillStroke('#7a3b5a', 9);
    // leo on stool
    rr(680, GY - 180, 180, 40, 10); fillStroke('#8a4b2a', 8); rr(700, GY - 140, 20, 140, 4); fillStroke('#8a4b2a', 6); rr(820, GY - 140, 20, 140, 4); fillStroke('#8a4b2a', 6);
    const leoTalk = b === 7 || b === 12 ? talkAt(t, SEG[b].words) : 0;
    const tears = b === 12;
    drawChar({ ...LEO, x: 770, y: GY - 150, s: .95, sit: true, mood: b === 12 ? 'happy' : 'sad', look: b === 12 ? [-1, -.5] : [-1, 0], blink: blinkAt(t, 1), talk: leoTalk, armL: 40, armR: 20, shadow: false,
      headExtra: () => { if (tears) { const ph = (t * .8) % 1; ctx.save(); ctx.globalAlpha = 1 - ph; ctx.beginPath(); ctx.ellipse(-40, 30 + ph * 60, 9, 13, 0, 0, Math.PI * 2); fillStroke('#8fe3ff', 4); ctx.restore(); } } });
    // candle on table
    rr(560, GY - 260, 120, 260, 10); fillStroke('#6b4a2a', 8);
    candle(620, GY - 260, 1, t);
    if (b === 5) { const p = pop(t, findWord(5, /^ciega/), .4); if (p > 0) pill(330, 610, 'ABUELA (CIEGA)', 46, '#9b6bd1', '#fff', { scale: p }); }
  }
  if (b === 8) {
    shotCam(t, A, B, 1.15, 1.0, W / 2, 900);
    night(t); moon(860, 260, 55); ground(GY);
    const off = findWord(8, /^apaga/);
    house(W / 2 + 10, GY, 520, 640, '#b9b3a0', '#6b5a4a', [0, 0, 0, 0], { dark: .62 });
    bulb(W / 2, 560, .9, t < off ? 1 : 0, t);
    if (t > off) { const p = pop(t, off, .3); txt('¡CLIC!', W / 2 + 230, 420, 70 * p, { color: '#fff', stroke: 16, rot: .1 }); }
    drawChar({ ...SARA, x: 250, y: GY + 60, s: .8, mood: 'sad', look: [1, -.6], blink: blinkAt(t, 2), armR: 150 });
  }
  if (b === 9) {
    shotCam(t, A, B, 1, 1.03, W / 2, 900);
    night(t); ground(GY);
    const pan = (t - A) * 260;
    street(t, 200 - pan, [0, 0, 0, 0], 1);
    drawChar({ ...SARA, x: W / 2 - 60, y: GY + 60, s: .85, walk: t * 2.4, mood: 'grin', look: [1, 0], blink: blinkAt(t, 2), rot: 6 });
    for (let k = 0; k < 3; k++) { const p = pop(t, A + .6 + k * .5, .35); if (p > 0) txt('¡TOC TOC!', 300 + k * 260, 640 - k * 40, 52 * p, { color: '#fff', stroke: 14, rot: -.1 + k * .1 }); }
  }
  if (b === 10) {
    shotCam(t, A, B, 1, 1.08, W / 2, 900);
    night(t); moon(860, 260, 55); ground(GY);
    house(W / 2 + 10, GY, 520, 640, '#b9b3a0', '#6b5a4a', [0, 0, 0, 0], { dark: .62 });
    // villagers arriving with lights
    const vt = findWord(10, /^velas/);
    const people = [[120, 0, 'candle'], [960, 1, 'lantern'], [300, 2, 'lantern'], [780, 3, 'candle'], [40, 4, 'torch'], [1040, 0, 'candle']];
    people.forEach(([x, vi, kind], k) => {
      const ap = eOut(pr(t, vt - 1 + k * .45, vt + k * .45));
      if (ap <= 0) return;
      const xx = x < W / 2 ? lerp(-200, x, ap) : lerp(W + 200, x, ap);
      drawChar({ ...VILL[vi], x: xx, y: GY + 80 + (k % 2) * 40, s: .7, walk: ap < 1 ? t * 1.5 : null, mood: 'happy', blink: blinkAt(t, k + 3), look: [x < W / 2 ? 1 : -1, -.3], armR: 120 });
      const hx = xx + 100 * .7 * (x < W / 2 ? 1 : 1), hy = GY + 80 + (k % 2) * 40 - 330;
      if (kind === 'lantern') lantern(hx + 10, hy, .8, t, ['#ff6f3c', '#ffb72b', '#ff3d6e'][k % 3], k); else if (kind === 'torch') { glow(hx, hy, 260, .9); rr(hx - 18, hy - 20, 36, 50, 8); fillStroke('#c2c6d6', 6); } else candle(hx, hy + 40, .8, t, k);
    });
    // strings of lights appear
    const sl = pr(t, findWord(10, /^llenan/) - .2, findWord(10, /^Leo/) + .3);
    for (let k = 0; k < 14 * sl; k++) { const x = 30 + k * 75; const y = 500 + Math.sin(k / 13 * Math.PI) * 120; glow(x, y, 90, .8); circle(x, y, 13); fillStroke('#fff2b0', 4); }
  }
  if (b === 13) {
    const on = findWord(13, /^encendió/);
    shotCam(t, A, B, 1.15, 1.0, W / 2, 900);
    night(t); moon(860, 260, 55); ground(GY);
    for (let k = 0; k < 14; k++) { const x = 30 + k * 75; const y = 500 + Math.sin(k / 13 * Math.PI) * 120; glow(x, y, 90, .8); circle(x, y, 13); fillStroke('#fff2b0', 4); }
    const lit = [0, 1, 2, 3].map(k => eOut(pr(t, on - .3 + k * .22, on - .1 + k * .22)));
    house(W / 2 + 10, GY, 520, 640, lit[0] > .5 ? '#ffe9b0' : '#b9b3a0', '#6b5a4a', lit, { dark: lerp(.62, .25, lit[3]) });
    if (lit[3] > 0) { glow(W / 2, 900, 700, lit[3] * .6); sparkles(t, W / 2, 900, 420, 14, '#fff6c0', 8); }
    [[110, 0], [960, 1], [250, 2], [830, 3]].forEach(([x, vi], k) => { drawChar({ ...VILL[vi], x, y: GY + 90 + (k % 2) * 40, s: .7, mood: t > on + .4 ? 'grin' : 'happy', blink: blinkAt(t, k + 3), look: [x < W / 2 ? 1 : -1, -.5], armR: t > on + .4 ? 160 : 120, armL: t > on + .4 ? 160 : 14 }); candle(x + 70, GY - 230 + (k % 2) * 40, .7, t, k); });
  }
  if (b === 14) {
    night(t); ground(GY);
    street(t, -150, [1, 1, 1, 1], .9, 2);
  }
  ctx.restore();
  speakerTag(t, b, { ABU: 'ABUELA', LEO: 'LEO' });
  if (b === 14) endCard3(t, SEG[14].s - .1, ['¿CUÁNTAS', 'BOMBILLAS', 'TENDRÍAS APAGADAS?']);
  finishFrame(t, b === 14 && t > SEG[14].s + .3);
};
