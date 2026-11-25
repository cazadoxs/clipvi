// f2b: tararear con la nariz tapada / tragar y respirar
function note(x, y, s, col = '#fff', rot = 0) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s); ctx.beginPath(); ctx.ellipse(0, 0, 26, 19, -.4, 0, Math.PI * 2); fillStroke(col, 6); rr(18, -100, 12, 100, 4); fillStroke(col, 5); ctx.beginPath(); ctx.moveTo(24, -100); ctx.quadraticCurveTo(60, -80, 50, -40); ctx.lineWidth = 10; ctx.strokeStyle = OUT; ctx.stroke(); ctx.restore(); }
const pinch = () => { circle(0, 18, 26); fillStroke('#ffd9b8', 6); ctx.beginPath(); ctx.moveTo(-14, 18); ctx.lineTo(14, 18); ctx.lineWidth = 5; ctx.strokeStyle = OUT; ctx.stroke(); };
function throat(t, closeK, foodP, airP) {
  // cross-section: esophagus (back, right) and trachea (front, left)
  ctx.save(); ctx.translate(W / 2, 900); ctx.scale(.82, .82);
  // head outline
  ctx.beginPath(); ctx.moveTo(-260, -420); ctx.quadraticCurveTo(-330, -300, -300, -180); ctx.lineTo(-260, -120); ctx.quadraticCurveTo(-200, -40, -160, 60); ctx.lineTo(-160, 420); ctx.lineTo(220, 420); ctx.lineTo(220, -120); ctx.quadraticCurveTo(240, -380, 0, -440); ctx.closePath(); fillStroke('#ffd9b8', 9);
  circle(-150, -330, 18); ctx.fillStyle = OUT; ctx.fill(); ctx.beginPath(); ctx.moveTo(-200, -372); ctx.lineTo(-110, -380); ctx.lineWidth = 9; ctx.strokeStyle = OUT; ctx.stroke();
  // mouth cavity
  ctx.beginPath(); ctx.moveTo(-280, -200); ctx.quadraticCurveTo(-60, -230, 40, -150); ctx.lineTo(40, -90); ctx.quadraticCurveTo(-80, -140, -260, -140); ctx.closePath(); fillStroke('#ff8fa3', 7);
  // tubes
  rr(-110, -90, 110, 520, 30); fillStroke('#bfefff', 8); // trachea
  rr(40, -150, 110, 580, 30); fillStroke('#ffb3c1', 8); // esophagus
  // pharynx connector
  rr(-110, -160, 260, 110, 40); fillStroke('#ffb3c1', 8);
  rr(-110, -90, 110, 520, 30); fillStroke('#bfefff', 8);
  // trachea rings
  for (let i = 0; i < 7; i++) { ctx.beginPath(); ctx.moveTo(-100, 0 + i * 60); ctx.lineTo(-10, 0 + i * 60); ctx.lineWidth = 6; ctx.strokeStyle = 'rgba(0,0,0,.15)'; ctx.stroke(); }
  // epiglottis flap (hinged at right edge of trachea top)
  ctx.save(); ctx.translate(0, -90); ctx.rotate(lerp(-1.25, 0, closeK) * 1); rr(-125, -14, 125, 28, 14); fillStroke('#ff3d6e', 7); ctx.restore();
  // food bolus
  if (foodP > 0 && foodP < 1) { const y = lerp(-180, 380, foodP), x = foodP < .3 ? lerp(-150, 95, foodP / .3) : 95; circle(x, y, 38); fillStroke('#c98d66', 7); }
  // air arrows
  if (airP > 0) for (let k = 0; k < 3; k++) { const ph = (t * 1.2 + k / 3) % 1; const y = lerp(380, -60, ph) * (closeK > .5 ? .0 + 1 : 1); if (closeK > .5 && y < -40) continue; ctx.save(); ctx.globalAlpha = Math.sin(ph * Math.PI) * airP; ctx.translate(-55, y); ctx.beginPath(); ctx.moveTo(-26, 16); ctx.lineTo(0, -16); ctx.lineTo(26, 16); ctx.lineWidth = 12; ctx.strokeStyle = '#3d7bff'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
  ctx.restore();
  txt('AIRE', W / 2 - 170, 1300, 54, { color: '#8fe3ff', stroke: 12 });
  txt('COMIDA', W / 2 + 230, 1300, 54, { color: '#ffb3c1', stroke: 12 });
}
window.sfxList = () => {
  const ev = [{ t: .05, n: 'whoosh' }];
  for (let i = 1; i <= 4; i++) ev.push({ t: SEG[i].s - .05, n: 'whoosh', v: .7 });
  ev.push({ t: findWord(0, /^tararear/), n: 'pop' });
  ev.push({ t: findWord(1, /^No$/), n: 'thud' });
  ev.push({ t: findWord(2, /^Tampoco/), n: 'thud' });
  ev.push({ t: findWord(3, /^cierra/), n: 'click' }, { t: findWord(3, /^epiglotis/), n: 'ding', v: .6 });
  ev.push({ t: findWord(4, /^casi/), n: 'sparkle' });
  ev.push({ t: findWord(5, /^¿Lo/), n: 'pop' }, { t: findWord(5, /^¿Lo/) + .3, n: 'pop' }, { t: findWord(5, /^¿Lo/) + .45, n: 'pop' });
  return ev;
};
window.scene = (t) => {
  const b = beat(t);
  bg(t, '#1f9e8f', '#0b3a3f');
  ctx.save(); punch(t, b);
  const GY = 1240;
  if (b <= 1) {
    const blocked = b === 1;
    const hum = b === 0 ? pr(t, findWord(0, /^tararear/), 99) : 1;
    drawChar({ ...HERO, x: W / 2, y: GY, s: 1.3, mood: blocked ? 'worried' : 'happy', blink: blinkAt(t, 1), armR: 165, talk: b === 0 && hum > 0 ? .3 : 0, headExtra: pinch, blushK: blocked ? .8 : 0, squash: blocked ? Math.sin(t * 20) * .01 : 0 });
    // notes trying to come out
    for (let k = 0; k < 4; k++) { const ph = ((t * .9 + k / 4) % 1); const x = W / 2 + 60 + ph * 260, y = 820 - ph * 220 + (blocked ? ph * ph * 520 : 0); ctx.save(); ctx.globalAlpha = (1 - ph) * (hum > 0 ? 1 : 0); note(x, y, .9, blocked ? '#9aa0b5' : '#ffe23d', blocked ? ph * 2 : Math.sin(t * 4 + k) * .2); ctx.restore(); }
    if (b === 0) tag(W / 2 - 230, 560, '¡PRUÉBALO!', 66, '#ff3d6e', pr(t, 1.0, 1.3), -.08);
    if (blocked) { bigX(W / 2 + 260, 600, 70, pr(t, SEG[1].s, SEG[1].s + .3)); tag(W / 2 - 230, 560, 'AIRE = NARIZ', 56, '#3d7bff', pr(t, findWord(1, /^aire/) - .1, findWord(1, /^aire/) + .2), -.06); }
  }
  if (b === 2) {
    const tp = findWord(2, /^Tampoco/);
    drawChar({ ...HERO, x: W / 2, y: GY, s: 1.3, mood: t > tp ? 'shock' : 'flat', blink: blinkAt(t, 2), armL: 20, armR: 20,
      extraBody: (by) => { const k = Math.sin(t * 5) * .5 + .5; ctx.beginPath(); ctx.ellipse(0, by - 10 + k * 40, 20, 14, 0, 0, Math.PI * 2); ctx.fillStyle = 'rgba(0,0,0,.15)'; ctx.fill(); } });
    const a = pr(t, findWord(2, /^tragar/) - .1, findWord(2, /^tragar/) + .2), c = pr(t, findWord(2, /^respirar/) - .1, findWord(2, /^respirar/) + .2);
    tag(W / 2 - 230, 600, 'TRAGAR', 64, '#ff7a1a', a, -.08); tag(W / 2 + 230, 600, 'RESPIRAR', 64, '#3d7bff', c, .08);
    if (c > 0) txt('+', W / 2, 600, 90, { color: '#fff', stroke: 20 });
    bigX(W / 2, 600, 90, pr(t, tp, tp + .3));
  }
  if (b === 3) {
    const cl = findWord(3, /^cierra/);
    const sw = pr(t, findWord(3, /^tragar/), findWord(3, /^tragar/) + 2.2);
    const closeK = eIO(pr(t, cl - .3, cl + .3)) * (1 - pr(t, SEG[3].e - .4, SEG[3].e));
    throat(t, closeK, pr(t, cl - .1, cl + 1.8), 1 - closeK);
    tag(W / 2 - 250, 760, 'EPIGLOTIS', 56, '#ff3d6e', pr(t, findWord(3, /^epiglotis/) - .1, findWord(3, /^epiglotis/) + .2), -.08);
    if (sw > 0) { }
  }
  if (b === 4) {
    // baby with bottle
    const p = pop(t, SEG[4].s, .4);
    ctx.save(); ctx.translate(W / 2, 980); ctx.scale(p, p);
    rr(-150, 40, 300, 240, 120); fillStroke('#bfe3ff', 9);
    circle(0, -60, 170); fillStroke(radial(-40, -100, 10, 220, '#ffe6d1', '#f2c6a3'), 9);
    ctx.beginPath(); ctx.moveTo(-10, -230); ctx.quadraticCurveTo(30, -260, 20, -210); ctx.lineWidth = 8; ctx.strokeStyle = OUT; ctx.stroke();
    drawFace({ mood: 'happy', look: [.4, .2], blink: blinkAt(t, 9), blushK: .7 }, 170);
    // bottle
    ctx.save(); ctx.translate(120, 10); ctx.rotate(-.9); rr(-40, -10, 80, 170, 26); fillStroke('#fff', 8); rr(-40, 70, 80, 90, [0, 0, 26, 26]); ctx.fillStyle = '#fff6e0'; ctx.fill(); rr(-45, -40, 90, 40, 10); fillStroke('#ff8fa3', 7); ctx.beginPath(); ctx.ellipse(0, -60, 16, 24, 0, 0, Math.PI * 2); fillStroke('#ffd9a8', 6); ctx.restore();
    ctx.restore();
    check(W / 2 + 250, 620, 70, pr(t, findWord(4, /^casi/), findWord(4, /^casi/) + .3));
    tag(W / 2 - 220, 620, 'BEBÉS', 66, '#3ddc84', pr(t, findWord(4, /^bebés/) - .1, findWord(4, /^bebés/) + .2), -.08, OUT);
    sparkles(t, W / 2, 900, 380, 10, '#fff', 3);
  }
  if (b === 5) drawChar({ ...HERO, x: W / 2, y: GY, s: 1.2, mood: 'grin', blink: blinkAt(t, 1), armR: 165, headExtra: pinch });
  ctx.restore();
  header(t, 2);
  const ec = findWord(5, /^¿Lo/);
  endCard(t, ec, '¿LO CONSEGUISTE?');
  finishFrame(t, t > ec + .2);
};
