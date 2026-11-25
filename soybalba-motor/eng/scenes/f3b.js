// f3b: Tomás y sus 3 palabras
const GY = 1240;
const TOM = { body: '#2ec4b6', skin: '#f2c29b', hair: '#3a2416', leg: '#2a2f4f' };
const TOM_OLD = { ...TOM, hairStyle: 'grey', body: '#2a9d8f' };
const NINA = { body: '#ffd21f', skin: '#c98d66', hair: '#1b1010', hairStyle: 'long', leg: '#ff6f91' };
function dusk(t) { ctx.fillStyle = vgrad(0, H, ['#ff8a5c', '#ffb86b', '#ffd59e']); ctx.fillRect(0, 0, W, H); circle(780, 700, 110); fillStroke('#fff1b8', 0); glow(780, 700, 400, .7, '255,240,180'); for (let i = 0; i < 4; i++) cloud((i * 330 + t * 15) % 1400 - 150, 380 + hash(i) * 200, .9, .5, '#fff3e0'); }
function plazaBg(t) {
  dusk(t);
  const cols = [['#ff8fa3', '#c2405d'], ['#9ad0ff', '#3a6fd1'], ['#ffe08a', '#d7892a'], ['#c7a6ff', '#6b44c9']];
  for (let i = 0; i < 4; i++) house(140 + i * 270, GY - 60, 240, 340 + hash(i) * 80, cols[i][0], cols[i][1], [0, 0, 0, 0], { dark: .05 });
  ctx.fillStyle = '#e9c99a'; ctx.fillRect(0, GY - 70, W, H); ctx.fillStyle = '#d8b582'; for (let i = 0; i < 12; i++) ctx.fillRect(i * 100 - 20, GY + 40 + (i % 2) * 120, 80, 10);
}
function wrist(t, num, glowK = 1, scale = 1) {
  ctx.save(); ctx.translate(W / 2, 880); ctx.scale(scale, scale);
  rr(-700, -110, 900, 220, 110); fillStroke(radial(-200, -60, 20, 600, '#ffe0c4', '#e9b48f'), 9);
  // hand
  rr(150, -120, 240, 240, 100); fillStroke('#f2c29b', 9);
  for (let k = 0; k < 4; k++) { rr(330, -110 + k * 56, 120, 50, 25); fillStroke('#f2c29b', 7); }
  // number
  const s = typeof num === 'number' ? num.toLocaleString('es-ES') : num;
  if (glowK > 0) glow(-200, 0, 380, glowK, '120,230,255');
  let size = 150; while (measure(s, size) > 600) size -= 8;
  txt(s, -200, 6, size, { color: '#c8f6ff', stroke: 18, strokeColor: '#1d5f7a' });
  ctx.restore();
}
function truck(x, y, s) {
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  rr(-330, -300, 440, 240, 16); fillStroke('#e84a5f', 9);
  rr(110, -240, 170, 180, [50, 16, 0, 0]); fillStroke('#ffd21f', 9); rr(160, -220, 90, 60, 14); fillStroke('#bff0ff', 7);
  for (const wx of [-240, -40, 200]) { circle(wx, -55, 52); fillStroke('#2a2a3a', 9); circle(wx, -55, 20); fillStroke('#c2c6d6', 6); }
  ctx.restore();
}
function ball(x, y, r, rot) { ctx.save(); ctx.translate(x, y); ctx.rotate(rot); circle(0, 0, r); fillStroke('#fff', 7); ctx.beginPath(); ctx.arc(0, 0, r, -.6, .6); ctx.lineTo(0, 0); ctx.closePath(); ctx.fillStyle = '#ff3d6e'; ctx.fill(); ctx.beginPath(); ctx.arc(0, 0, r, 2.5, 3.7); ctx.lineTo(0, 0); ctx.closePath(); ctx.fill(); circle(0, 0, r); fillStroke(null, 7); ctx.restore(); }
window.sfxList = () => {
  const ev = [{ t: .1, n: 'whoosh', v: .5 }, { t: findWord(0, /^número/), n: 'sparkle' }];
  ev.push({ t: findWord(1, /^tres/), n: 'thud', v: .6 });
  ev.push({ t: findWord(3, /^hola/), n: 'pop', v: .5 }, { t: findWord(3, /^gracias/), n: 'pop', v: .5 });
  ev.push({ t: findWord(4, /^apuestas/), n: 'click' });
  ev.push({ t: findWord(5, /^Pasaron/), n: 'whoosh', v: .6 });
  ev.push({ t: findWord(6, /^camión/), n: 'horn' }, { t: findWord(6, /^frenos/), n: 'skid' });
  SEG[7].words.forEach(w => ev.push({ t: w.s, n: 'thud', v: .5 }));
  ev.push({ t: findWord(8, /^saltó/), n: 'whoosh' });
  SEG[9].words.slice(-4).forEach(w => ev.push({ t: w.s, n: 'ding', v: .45 }));
  ev.push({ t: findWord(10, /^multiplicadas/), n: 'sparkle' });
  ev.push({ t: SEG[11].s, n: 'whoosh', v: .5 });
  return ev;
};
window.scene = (t) => {
  const b = beat(t);
  const A = SEG[b].s - .15, B = segEnd(b);
  ctx.save();
  if (b === 0) {
    shotCam(t, A, B, 1, 1.1, W / 2, 880);
    dusk(t);
    const nt = findWord(0, /^número/);
    const n = Math.floor(lerp(0, 2350000, eOut(pr(t, nt, nt + 1.5))));
    wrist(t, t > nt ? n : '', pr(t, nt, nt + .4));
    if (t > findWord(0, /^palabras/)) pill(W / 2, 560, 'PALABRAS PARA TODA TU VIDA', 50, '#1d5f7a', '#fff', { scale: pop(t, findWord(0, /^palabras/), .35) });
  }
  if (b === 1) {
    shotCam(t, A, B, 1, 1.05, W / 2, 900);
    ctx.fillStyle = vgrad(0, H, ['#ffe9f0', '#ffd0dc']); ctx.fillRect(0, 0, W, H);
    // babies in cribs
    const nums = [3120400, 5600200, 870500, 3];
    const tt = findWord(1, /^Tomás/), tr = findWord(1, /^tres/);
    nums.forEach((nn, k) => {
      const x = 170 + k * 250, y = 1000;
      const isT = k === 3; if (isT && t < tt - .2) return;
      const sp = isT && t > tr ? 1 : 0;
      if (sp) glow(x, y - 60, 300, .9, '255,255,255');
      rr(x - 110, y, 220, 120, 20); fillStroke('#fff', 8);
      ctx.save(); ctx.translate(x, y - 40); ctx.scale(.6, .6); circle(0, 0, 130); fillStroke('#ffe0c4', 9); drawFace({ mood: isT && t > tr ? 'worried' : 'happy', blink: blinkAt(t, k + 4), look: [0, 0] }, 130); ctx.restore();
      const label = isT ? (t > tr ? '3' : '?') : nn.toLocaleString('es-ES');
      pill(x, y - 210, label, isT ? 70 : 38, isT ? '#ff3d6e' : '#1d5f7a', '#fff', { scale: pop(t, A + k * .25, .3) });
    });
    if (t > tt) pill(170 + 3 * 250, 1190, 'TOMÁS', 44, '#2ec4b6', '#fff', { scale: pop(t, tt, .3) });
  }
  if (b === 2) {
    shotCam(t, A, B, 1.05, 1.2, W / 2, 880);
    dusk(t); wrist(t, 3, 1);
  }
  if (b === 3) {
    shotCam(t, A, B, 1, 1.05, W / 2, 900);
    plazaBg(t);
    const kids = [[200, 0], [880, 1], [990, 3]];
    const laugh = t > findWord(3, /^niños/) - .3;
    kids.forEach(([x, vi], k) => drawChar({ ...VILL[vi], x, y: GY + 40, s: .7, mood: laugh ? 'grin' : 'happy', look: [x < W / 2 ? 1 : -1, 0], blink: blinkAt(t, k + 2), squash: laugh ? Math.abs(Math.sin(t * 12 + k)) * .04 : 0 }));
    if (laugh) for (let k = 0; k < 3; k++) txt('JA', [200, 880, 990][k] + 40, 740 - Math.abs(Math.sin(t * 6 + k)) * 30, 58, { color: '#fff', stroke: 14, rot: .2 });
    drawChar({ ...TOM, x: W / 2 - 20, y: GY + 60, s: .75, mood: laugh ? 'sad' : 'flat', look: [0, .3], blink: blinkAt(t, 1) });
    const words = [['¡HOLA!', findWord(3, /^hola/)], ['¡GRACIAS!', findWord(3, /^gracias/)]];
    words.forEach(([w, at], k) => { const p = pr(t, at - .3, at); if (p <= 0) return; speech(W / 2 - 20 + (k ? 80 : -80), 820, w, 54, p, { dx: k ? 160 : -160, dy: 230, maxW: 380 }); bigX(W / 2 - 20 + (k ? 240 : -240), 590, 60, pr(t, at + .2, at + .5)); });
  }
  if (b === 4 || b === 5 && t < findWord(5, /^Pasaron/)) {
    shotCam(t, SEG[4].s - .15, findWord(5, /^Pasaron/), 1, 1.08, W / 2, 900);
    ctx.fillStyle = vgrad(0, H, ['#6b3a2a', '#3a1f16']); ctx.fillRect(0, 0, W, H);
    glow(W / 2, 400, 600, .5);
    // chalkboard
    rr(140, 420, 800, 460, 20); fillStroke('#23362b', 12);
    txt('APUESTAS', W / 2, 490, 64, { color: '#fff', stroke: 0, font: 'Lilita' });
    const opts = [['¿TE QUIERO, MAMÁ?', findWord(5, /^¿Te/)], ['¿UN INSULTO AL ALCALDE?', findWord(5, /^¿Un/)], ['¿"PASA LA SAL"?', findWord(4, /^Tomás/) - .4]];
    opts.forEach(([o, at], k) => { const p = pr(t, at, at + .4); if (p <= 0) return; ctx.save(); ctx.globalAlpha = p; txt(o, W / 2, 580 + k * 90, 46, { color: '#f4f1e0', stroke: 0 }); txt(['3 a 1', '7 a 1', '20 a 1'][k], 860, 580 + k * 90 + 2, 30, { color: '#ffd21f', stroke: 0 }); ctx.restore(); });
    rr(0, 1080, W, 300, 0); fillStroke('#8a4b2a', 0); rr(0, 1060, W, 40, 0); fillStroke('#a8643a', 0);
    [[160, 2], [420, 4], [700, 0], [940, 1]].forEach(([x, vi], k) => { drawChar({ ...VILL[vi], x, y: 1180, s: .65, mood: k % 2 ? 'grin' : 'happy', look: [0, -.6], blink: blinkAt(t, k + 6), talk: Math.sin(t * 9 + k) > .6 ? .5 : 0, armR: 100 }); rr(x + 60, 1000, 50, 70, 8); fillStroke('#ffe08a', 6); });
  }
  if (b === 5 && t >= findWord(5, /^Pasaron/)) {
    const pt = findWord(5, /^Pasaron/);
    shotCam(t, pt, B, 1, 1.06, W / 2, 900);
    plazaBg(t);
    // bench
    rr(300, GY - 120, 480, 40, 10); fillStroke('#8a4b2a', 8); rr(330, GY - 80, 30, 80, 6); fillStroke('#5a3a2a', 6); rr(720, GY - 80, 30, 80, 6); fillStroke('#5a3a2a', 6);
    const age = pr(t, pt, pt + 2);
    drawChar({ ...(age > .5 ? TOM_OLD : TOM), x: W / 2, y: GY - 100, s: lerp(.75, 1, age), sit: true, mood: 'flat', look: [0, 0], blink: blinkAt(t, 1), shadow: false });
    // flying calendar pages
    for (let k = 0; k < 10; k++) { const ph = pr(t, pt + k * .15, pt + k * .15 + 1.2); if (ph <= 0 || ph >= 1) continue; ctx.save(); ctx.translate(W / 2 + (hash(k) - .5) * 300 + ph * 300, 600 - ph * 300); ctx.rotate(ph * 3 + k); ctx.globalAlpha = 1 - ph; rr(-50, -60, 100, 120, 8); fillStroke('#fff', 6); txt(String(1985 + k * 4), 0, 10, 26, { color: OUT, stroke: 0 }); ctx.restore(); }
    pill(W / 2, 560, '40 AÑOS DESPUÉS', 56, '#fff', OUT, { scale: pop(t, findWord(5, /^cuarenta/), .35) });
  }
  if (b === 6) {
    const [sx, sy] = shakeOffset(t, findWord(6, /^frenos/), 1.5, 8);
    ctx.translate(sx, sy);
    plazaBg(t);
    const ct = findWord(6, /^camión/);
    const tx = lerp(-150, 330, pr(t, ct - .3, SEG[6].e + .6));
    drawChar({ ...NINA, x: 680, y: GY + 60, s: .6, mood: t > findWord(6, /^niña/) + .4 ? 'happy' : 'happy', look: [0, .3], blink: blinkAt(t, 9), armR: 60 });
    ball(760, GY + 20 - Math.abs(Math.sin(t * 5)) * 120, 34, t * 3);
    truck(tx, GY + 60, .9);
    for (let k = 0; k < 5; k++) { ctx.save(); ctx.globalAlpha = .6; ctx.beginPath(); ctx.moveTo(tx - 360, GY - 140 + k * 30); ctx.lineTo(tx - 520 - k * 30, GY - 140 + k * 30); ctx.lineWidth = 8; ctx.strokeStyle = '#fff'; ctx.lineCap = 'round'; ctx.stroke(); ctx.restore(); }
    drawChar({ ...TOM_OLD, x: 960, y: GY + 120, s: .8, mood: t > findWord(6, /^niña/) ? 'shock' : 'flat', look: [-1, 0], blink: blinkAt(t, 1) });
    if (t > findWord(6, /^frenos/)) pill(W / 2, 560, '¡SIN FRENOS!', 60, '#ff3d6e', '#fff', { scale: pop(t, findWord(6, /^frenos/), .3), rot: -.05 });
  }
  if (b === 7) {
    const ws = SEG[7].words;
    ctx.fillStyle = radial(W / 2, 800, 50, 1200, '#ffb86b', '#c2405d'); ctx.fillRect(0, 0, W, H);
    // speed lines
    for (let i = 0; i < 40; i++) { const a = hash(i) * 6.28; ctx.save(); ctx.globalAlpha = .25; ctx.beginPath(); ctx.moveTo(W / 2 + Math.cos(a) * 500, 800 + Math.sin(a) * 500); ctx.lineTo(W / 2 + Math.cos(a) * 1400, 800 + Math.sin(a) * 1400); ctx.lineWidth = 14; ctx.strokeStyle = '#fff'; ctx.stroke(); ctx.restore(); }
    const [sx, sy] = shakeOffset(t, ws[ws.length - 1].s, .5, 14); ctx.translate(sx, sy);
    drawChar({ ...TOM_OLD, x: W / 2, y: 1500, s: 1.7, mood: 'shock', talk: talkAt(t, ws) || .6, look: [0, 0], armL: 120, armR: 120, shadow: false });
    ws.forEach((w, k) => { const p = pop(t, w.s, .25); if (p <= 0) return; txt(w.w.toUpperCase(), W / 2 + (k - 1) * 300, 480 + (k % 2) * 60, 110 * p, { color: '#fff', stroke: 26, rot: (k - 1) * .12, shadow: true }); });
    // counter
    const used = ws.filter(w => t >= w.s).length;
    pill(W / 2, 1120, `QUEDAN: ${3 - used}`, 60, used >= 3 ? '#ff3d6e' : '#1d5f7a', '#fff', { scale: 1 });
  }
  if (b === 8) {
    const jt = findWord(8, /^saltó/), mt = findWord(8, /^miró/);
    if (t < mt - .15) {
      plazaBg(t);
      truck(lerp(300, 1600, pr(t, A, jt + .8)), GY + 60, .9);
      const jp = pr(t, jt - .1, jt + .6);
      drawChar({ ...NINA, x: lerp(680, 1000, jp), y: GY + 60 - Math.sin(jp * Math.PI) * 200, s: .6, mood: 'shock', look: [1, 0], blink: 0, armL: 160, armR: 160, rot: jp * 20 });
      drawChar({ ...TOM_OLD, x: 300, y: GY + 120, s: .8, mood: 'shock', look: [1, 0], blink: blinkAt(t, 1) });
    } else {
      shotCam(t, mt, B, 1.05, 1.2, W / 2, 880);
      dusk(t); wrist(t, t > findWord(8, /^cero/) ? 0 : 0, .3);
      pill(W / 2, 560, '¿CERO?', 64, '#fff', OUT, { scale: pop(t, findWord(8, /^cero/), .3) });
    }
  }
  if (b === 9) {
    shotCam(t, A, B, 1.15, 1.3, W / 2, 880);
    dusk(t);
    const steps = SEG[9].words.slice(-4).map(w => w.s);
    const vals = [4, 10, 100, 1000];
    let v = 0; steps.forEach((s, k) => { if (t >= s) v = vals[k]; });
    const jitter = t > findWord(9, /^cambiando/) && v === 0 ? Math.floor(hash(Math.floor(t * 20)) * 3) : v;
    wrist(t, jitter, .6 + .4 * Math.sin(t * 8));
    if (v > 0) sparkles(t, W / 2 - 200, 880, 360, 12, '#c8f6ff', 2);
  }
  if (b === 10) {
    shotCam(t, A, B, 1, 1.08, W / 2, 900);
    plazaBg(t);
    [[120, 0], [260, 1], [820, 3], [970, 4]].forEach(([x, vi], k) => drawChar({ ...VILL[vi], x, y: GY + 80 + (k % 2) * 30, s: .65, mood: 'grin', look: [x < W / 2 ? 1 : -1, -.3], blink: blinkAt(t, k + 3), armR: 160, armL: 160, squash: Math.abs(Math.sin(t * 8 + k)) * .03 }));
    drawChar({ ...TOM_OLD, x: W / 2 - 100, y: GY + 100, s: .85, mood: 'grin', look: [1, 0], blink: blinkAt(t, 1), armR: 60 });
    drawChar({ ...NINA, x: W / 2 + 110, y: GY + 100, s: .6, mood: 'grin', look: [-1, -.4], blink: blinkAt(t, 9), armL: 80 });
    const rt = findWord(10, /^palabras/);
    if (t > rt) { ctx.save(); const p = pop(t, rt, .4); ctx.translate(W / 2, 600); ctx.scale(p, p); rr(-440, -140, 880, 280, 40); fillStroke('#fff8e8', 9); txt('LAS PALABRAS QUE SALVAN', 0, -55, 52, { color: OUT, stroke: 0 }); txt('UNA VIDA VUELVEN', 0, 5, 52, { color: OUT, stroke: 0 }); txt('MULTIPLICADAS', 0, 70, 64, { color: '#ff3d6e', stroke: 0 }); ctx.restore(); }
  }
  if (b === 11) { dusk(t); wrist(t, '3', .8); }
  ctx.restore();
  
  if (b === 11) endCard3(t, SEG[11].s - .1, ['¿Y TÚ', 'QUÉ 3 PALABRAS', 'DIRÍAS?']);
  finishFrame(t, b === 11 && t > SEG[11].s + .3 || b === 7);
};
