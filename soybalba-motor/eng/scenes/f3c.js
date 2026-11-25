// f3c: las sombras
const GY = 1180;
const NICO = { body: '#ff9f43', skin: '#ffd9b8', hair: '#3a2416', leg: '#2a2f6f' };
const ALBA = { body: '#7b61ff', skin: '#e8b48f', hair: '#d4a017', hairStyle: 'long', leg: '#3a2f6f' };
const BAKER = { body: '#ffffff', skin: '#ffd9b8', hairStyle: 'bald', leg: '#3b3f8f' };
const MAYOR = { body: '#2a2f4f', skin: '#f2c29b', hair: '#888', hairStyle: 'grey', leg: '#1b1730' };
const off = document.createElement('canvas'); off.width = W; off.height = H; const octx = off.getContext('2d');
// draw a silhouette of a character pose. mode 'ground' (skewed on floor) or 'wall' (offset on wall)
function shadowOf(o, mode = 'ground', alpha = .38, sk = -.9) {
  const real = ctx; window.__c = ctx;
  octx.setTransform(1, 0, 0, 1, 0, 0); octx.clearRect(0, 0, W, H);
  // temporarily swap global ctx
  ctxSwap(octx, () => drawChar({ ...o, shadow: false }));
  octx.globalCompositeOperation = 'source-in'; octx.fillStyle = '#141032'; octx.fillRect(0, 0, W, H); octx.globalCompositeOperation = 'source-over';
  ctx.save(); ctx.globalAlpha = mode === 'ground' ? Math.min(.7, alpha * 1.5) : alpha;
  if (mode === 'ground') { ctx.translate(o.x, o.y); ctx.transform(1, 0, sk, -.4, 0, 0); ctx.translate(-o.x, -o.y); }
  else { ctx.translate(o.dx || 60, o.dy || -20); }
  ctx.drawImage(off, 0, 0); ctx.restore();
}
function ctxSwap(c, fn) { const saved = setCtx(c); try { fn(); } finally { setCtx(saved); } }
function sunny(t) { ctx.fillStyle = vgrad(0, H, ['#5fc8ff', '#bff0ff']); ctx.fillRect(0, 0, W, H); circle(150, 260, 80); fillStroke('#ffe23d', 0); glow(150, 260, 300, .6, '255,240,150'); for (let i = 0; i < 4; i++) cloud((i * 330 + t * 12) % 1400 - 150, 340 + hash(i + 2) * 200, .9, .9); }
function villageDay(t) {
  sunny(t);
  const cols = [['#ff8fa3', '#c2405d'], ['#9ad0ff', '#3a6fd1'], ['#ffe08a', '#d7892a'], ['#c7a6ff', '#6b44c9']];
  for (let i = 0; i < 4; i++) house(140 + i * 270, GY - 80, 240, 340 + hash(i) * 80, cols[i][0], cols[i][1], [0, 0, 0, 0], { dark: 0 });
  ctx.fillStyle = '#e9d6b0'; ctx.fillRect(0, GY - 90, W, H);
}
function schoolyard(t) {
  sunny(t);
  rr(-20, 560, W + 40, GY - 640, 0); fillStroke('#ffcf8a', 8);
  for (let i = 0; i < 4; i++) { rr(60 + i * 260, 640, 180, 150, 12); fillStroke('#bff0ff', 7); }
  txt('COLEGIO', W / 2, 600, 56, { color: '#c2405d', stroke: 0 });
  ctx.fillStyle = '#9fd6a0'; ctx.fillRect(0, GY - 120, W, H); ctx.fillStyle = '#8cc48d'; ctx.fillRect(0, GY - 120, W, 14);
}
window.sfxList = () => {
  const ev = [{ t: .1, n: 'whoosh', v: .5 }, { t: findWord(0, /^sombra/), n: 'sparkle', v: .6 }];
  ev.push({ t: findWord(1, /^come/), n: 'pop' }, { t: findWord(1, /^cruasanes/), n: 'pop' });
  ev.push({ t: findWord(2, /^corriendo/), n: 'whoosh' });
  ev.push({ t: findWord(3, /^buscan/), n: 'ding', v: .5 });
  ev.push({ t: findWord(5, /^cayó/), n: 'thud', v: .6 }, { t: findWord(5, /^suelo/), n: 'rise', v: .7 });
  ev.push({ t: findWord(6, /^mano/), n: 'sparkle' }, { t: findWord(6, /^mano/), n: 'heart', v: .7 });
  ev.push({ t: findWord(7, /^Alba/), n: 'ding', v: .5 });
  ev.push({ t: findWord(8, /^rojo/), n: 'boing' });
  ev.push({ t: SEG[10].s, n: 'whoosh', v: .5 });
  return ev;
};
window.scene = (t) => {
  const b = beat(t);
  const A = SEG[b].s - .15, B = segEnd(b);
  ctx.save();
  if (b === 0) {
    shotCam(t, A, B, 1, 1.08, W / 2, 950);
    villageDay(t);
    const st = findWord(0, /^sombra/);
    const x = lerp(250, 560, pr(t, A, B));
    const who = { ...VILL[0], x, y: GY + 30, s: .95, walk: t * 1.1, mood: 'happy', look: [1, 0], blink: blinkAt(t, 3) };
    const dance = t > st;
    shadowOf({ ...who, walk: dance ? null : t * 1.1, armL: dance ? 150 + Math.sin(t * 8) * 30 : 14, armR: dance ? 150 - Math.sin(t * 8) * 30 : 14, rot: dance ? Math.sin(t * 6) * 12 : 0 }, 'ground', .4);
    drawChar(who);
    if (dance) { for (let k = 0; k < 3; k++) { const ph = (t * .8 + k / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - ph; txt('LA', x + 300 + k * 60, GY - 60 - ph * 160, 60, { color: '#141032', stroke: 0 }); ctx.restore(); } }
  }
  if (b === 1) {
    shotCam(t, A, B, 1, 1.07, W / 2, 900);
    ctx.fillStyle = vgrad(0, H, ['#ffe9c7', '#ffd59e']); ctx.fillRect(0, 0, W, H);
    txt('PANADERÍA', W / 2, 520, 70, { color: '#c25a2a', stroke: 14 });
    const ct = findWord(1, /^come/);
    const baker = { ...BAKER, x: W / 2 - 60, y: GY - 60, s: 1.05, mood: t > ct ? 'worried' : 'flat', look: [1, -.2], blink: blinkAt(t, 2), armL: 14, armR: 14, hairStyle: 'bald', headExtra: () => { rr(-80, -200, 160, 110, 50); fillStroke('#fff', 7); rr(-90, -110, 180, 30, 10); fillStroke('#fff', 7); } };
    // wall shadow that eats
    const eat = pr(t, ct - .2, ct + .4);
    shadowOf({ ...baker, armR: lerp(14, 160, eat), talk: t > ct ? .5 + .5 * Math.sin(t * 18) : 0, dx: 230, dy: -40 }, 'wall', .3);
    // croissant held by shadow (as silhouette)
    if (t > ct - .2 && t < findWord(1, /^probar/)) { ctx.save(); ctx.globalAlpha = .3; ctx.fillStyle = '#141032'; ctx.beginPath(); ctx.ellipse(W / 2 + 330, GY - 560, 60, 30, .3, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
    drawChar(baker);
    // counter + croissants
    rr(-20, GY - 200, W + 40, 260, 10); fillStroke('#c25a2a', 9);
    const eaten = Math.floor(pr(t, ct, findWord(1, /^probar/)) * 3);
    for (let k = 0; k < 5 - eaten; k++) { ctx.save(); ctx.translate(180 + k * 170, GY - 220); ctx.beginPath(); ctx.ellipse(0, 0, 70, 34, 0, Math.PI, 0); ctx.lineTo(70, 0); fillStroke('#f2a541', 7); for (let j = -1; j <= 1; j++) { ctx.beginPath(); ctx.moveTo(j * 25, -30); ctx.lineTo(j * 25 + 6, 0); ctx.lineWidth = 5; ctx.strokeStyle = '#b56a18'; ctx.stroke(); } ctx.restore(); }
    if (t > ct + .3) txt('ÑAM', W / 2 + 380, 620 + Math.sin(t * 8) * 10, 64, { color: '#141032', stroke: 0, rot: .15 });
  }
  if (b === 2) {
    shotCam(t, A, B, 1, 1.05, W / 2, 900);
    sunny(t); ctx.fillStyle = '#e9d6b0'; ctx.fillRect(0, GY - 90, W, H);
    // bunting
    for (let k = 0; k < 12; k++) { ctx.beginPath(); ctx.moveTo(k * 95, 560); ctx.lineTo(k * 95 + 90, 560); ctx.lineTo(k * 95 + 45, 630); ctx.closePath(); fillStroke(['#ff3d6e', '#ffd21f', '#3d7bff'][k % 3], 5); }
    const run = pr(t, findWord(2, /^corriendo/) - .3, B);
    const mayor = { ...MAYOR, x: W / 2 - 120, y: GY - 40, s: 1.0, mood: run > .2 ? 'shock' : 'grin', look: [run > .2 ? 1 : 0, 0], blink: blinkAt(t, 3), armR: run > .2 ? 14 : 120 + Math.sin(t * 5) * 20, talk: run > .2 ? 0 : talkAt(t, SEG[2].words.map(w => ({ s: w.s, e: w.e }))) * .6, extraBody: (by) => { rr(-60, by + 40, 120, 70, 8); fillStroke('#ffd21f', 6); } };
    // shadow runs away along ground
    const sx = mayor.x + run * 900;
    shadowOf({ ...mayor, x: sx, walk: run > 0 ? t * 3 : null, armL: run > 0 ? 60 : 14, armR: run > 0 ? 60 : 120 }, 'ground', .4, -.7);
    drawChar(mayor);
    // podium
    rr(W / 2 - 220, GY - 280, 200, 280, 10); fillStroke('#8a4b2a', 9); circle(W / 2 - 120, GY - 210, 30); fillStroke('#ffd21f', 6);
    // crowd backs
    pill(W / 2 + 230, 720, 'ALCALDE', 50, '#2a2f4f', '#fff', { scale: pop(t, findWord(2, /^alcalde/), .3) });
  }
  if (b === 3) {
    shotCam(t, A, B, 1, 1.06, W / 2, 950);
    schoolyard(t);
    const bt = findWord(3, /^sombras/);
    const lean = eIO(pr(t, bt - .4, bt + .6));
    const pairs = [[[150, 1], [420, 3]], [[700, 0], [930, 4]]];
    pairs.forEach(([[x1, v1], [x2, v2]], k) => {
      const a = { ...VILL[v1], x: x1, y: GY + 40, s: .7, mood: 'flat', look: [-1, 0], blink: blinkAt(t, k + 1) };
      const c = { ...VILL[v2], x: x2, y: GY + 40, s: .7, mood: 'flat', look: [1, 0], blink: blinkAt(t, k + 6) };
      shadowOf({ ...a, rot: lean * 14, armR: lean * 70 }, 'ground', .38, -.6);
      shadowOf({ ...c, rot: -lean * 14, armL: lean * 70 }, 'ground', .38, -.6);
      drawChar(a); drawChar(c);
      if (lean > .6) heart((x1 + x2) / 2 - 80, GY - 20, 30 * eBack(pr(t, bt + .2, bt + .5)), '#141032');
    });
  }
  if (b === 4) {
    shotCam(t, A, B, 1, 1.1, W / 2, 900);
    villageDay(t);
    const x = lerp(200, 640, pr(t, A, B));
    const nico = { ...NICO, x, y: GY + 30, s: 1.0, walk: t * 1.1, mood: 'happy', look: [.3, -1], headRot: -14, blink: blinkAt(t, 1) };
    shadowOf({ ...nico, armR: 70 + Math.sin(t * 2) * 10, look: [1, 0], headRot: 0 }, 'ground', .4, -.8);
    drawChar(nico);
    pill(x, 640, 'NICO', 50, '#ff9f43', '#fff', { scale: pop(t, findWord(4, /^Nico/), .3) * (1 - pr(t, findWord(4, /^Por/), findWord(4, /^Por/) + .3)) });
    if (t > findWord(4, /^cielo/)) { for (let k = 0; k < 2; k++) { const ph = (t * .6 + k / 2) % 1; ctx.save(); ctx.globalAlpha = 1 - ph; cloud(x + 100 + k * 120, 600 - ph * 80, .4, 1); ctx.restore(); } }
  }
  if (b === 5) {
    shotCam(t, A, B, 1, 1.12, W / 2, 1000);
    schoolyard(t);
    const ft = findWord(5, /^cayó/), ag = findWord(5, /^agachó/), lk = findWord(5, /^suelo/);
    const crouch = eIO(pr(t, ag - .2, ag + .4));
    const nico = { ...NICO, x: W / 2 - 60, y: GY + 40, s: 1.0, squash: crouch * .22, mood: t > lk - .1 ? 'shock' : 'happy', look: t > lk - .4 ? [0, 1] : [.3, -1], headRot: t > lk - .4 ? 10 : -14, blink: blinkAt(t, 1), armR: crouch * 60 };
    shadowOf({ ...nico, armR: 100, look: [1, 0], headRot: 0 }, 'ground', .4, -.8);
    drawChar(nico);
    const fp = eIn(pr(t, ft - .2, ft + .1));
    ctx.save(); ctx.translate(W / 2 + 60, lerp(GY - 300, GY + 10, fp)); ctx.rotate(fp * .5); rr(-60, -70, 120, 140, 26); fillStroke('#3d7bff', 8); rr(-40, -20, 80, 50, 12); fillStroke('#2a5bd1', 6); ctx.restore();
  }
  if (b === 6 || b === 7) {
    // ground reveal: two shadows holding hands; people far apart
    const z0 = b === 6 ? 1.25 : 1.05;
    shotCam(t, SEG[6].s - .15, segEnd(7), z0, 1.0, W / 2, 1050);
    schoolyard(t);
    const hand = eOut(pr(t, findWord(6, /^mano/) - .4, findWord(6, /^mano/) + .2));
    const nico = { ...NICO, x: 260, y: GY + 60, s: .85, mood: 'shock', look: [1, .6], blink: blinkAt(t, 1), squash: .15 };
    const alba = { ...ALBA, x: 820, y: GY - 40, s: .8, mood: 'happy', look: [-.3, 0], blink: blinkAt(t, 5) };
    // shadows reaching each other's hands
    shadowOf({ ...nico, armR: lerp(30, 92, hand) }, 'ground', .45, -.9);
    shadowOf({ ...alba, x: alba.x, armL: lerp(14, 100, hand) }, 'ground', .45, .9);
    if (hand > .9) { for (let k = 0; k < 3; k++) { const ph = (t * .6 + k / 3) % 1; ctx.save(); ctx.globalAlpha = (1 - ph) * .9; heart(540 + Math.sin(k * 2) * 60, GY + 200 - ph * 220, 40, '#ff3d6e'); ctx.restore(); } }
    if (b === 7) { const p = pop(t, findWord(7, /^Alba/), .35); if (p > 0) pill(820, 560, 'ALBA', 54, '#7b61ff', '#fff', { scale: p }); }
    // desk for alba
    drawChar(alba); rr(700, GY - 120, 240, 30, 8); fillStroke('#c25a2a', 7);
    drawChar(nico);
  }
  if (b >= 8 && b <= 9) {
    shotCam(t, SEG[8].s - .15, segEnd(9), 1.05, 1.18, W / 2, 900);
    schoolyard(t);
    const red = eOut(pr(t, findWord(8, /^rojo/) - .3, findWord(8, /^tomate/)));
    const skin = `rgb(${Math.round(lerp(255, 255, red))},${Math.round(lerp(217, 90, red))},${Math.round(lerp(184, 90, red))})`;
    const albaTalk = b === 9 ? talkAt(t, SEG[9].words) : 0;
    const nico = { ...NICO, skin: toHex2(skin), x: 300, y: GY + 60, s: 1.0, mood: red > .5 ? 'shock' : 'happy', look: [1, 0], blink: blinkAt(t, 1), blushK: red };
    const alba = { ...ALBA, x: 790, y: GY + 60, s: .95, mood: b === 9 ? 'grin' : 'happy', look: [1, -.2], blink: blinkAt(t, 5), talk: albaTalk, blushK: b === 9 ? .6 : .3, headRot: 6 };
    shadowOf({ ...nico, armR: 92 }, 'ground', .42, -.9); shadowOf({ ...alba, armL: 100 }, 'ground', .42, .9);
    drawChar(nico); drawChar(alba);
    if (red > .6) { for (let k = 0; k < 3; k++) { const ph = (t * 1.2 + k / 3) % 1; ctx.save(); ctx.globalAlpha = 1 - ph; cloud(300 + (k - 1) * 70, 640 - ph * 100, .25, 1); ctx.restore(); } }
  }
  if (b === 10) { schoolyard(t); }
  ctx.restore();
  speakerTag(t, b, { ALBA: 'ALBA' });
  if (b === 10) endCard3(t, SEG[10].s - .1, ['¿QUÉ HARÍA', 'TU SOMBRA', 'AHORA MISMO?']);
  finishFrame(t, b === 10 && t > SEG[10].s + .3);
};
function toHex2(rgb) { const m = rgb.match(/\d+/g).map(Number); return '#' + m.map(v => v.toString(16).padStart(2, '0')).join(''); }
