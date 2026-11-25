// SoyBalba mini engine: canvas 1080x1920, everything is a function of time t
const W = 1080, H = 1920;
const cv = document.getElementById('c');
let ctx = cv.getContext('2d');
function setCtx(c) { const o = ctx; ctx = c; return o; }
const OUT = '#1b1730';           // outline colour
const LW = 9;                    // outline width

// ---------- math ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, p) => a + (b - a) * p;
const pr = (t, a, b) => clamp((t - a) / (b - a));           // progress 0..1
const eOut = p => 1 - Math.pow(1 - p, 3);
const eIn = p => p * p * p;
const eIO = p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const eBack = p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
const eElastic = p => p === 0 ? 0 : p === 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - .75) * (2 * Math.PI / 3)) + 1;
const pop = (t, a, d = .35) => eBack(pr(t, a, a + d));
function rnd(seed) { let s = seed * 9301 + 49297; return () => { s = (s * 9301 + 49297) % 233280; return s / 233280; }; }
const hash = n => { const x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };

// ---------- primitives ----------
function rr(x, y, w, h, r) { ctx.beginPath(); ctx.roundRect(x, y, w, h, r); }
function circle(x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); }
function fillStroke(fill, lw = LW, stroke = OUT) {
  if (fill) { ctx.fillStyle = fill; ctx.fill(); }
  if (lw) { ctx.lineWidth = lw; ctx.strokeStyle = stroke; ctx.lineJoin = 'round'; ctx.lineCap = 'round'; ctx.stroke(); }
}
function shade(c, k) { // k>0 lighten, k<0 darken; c = #rrggbb
  const n = parseInt(c.slice(1), 16); let r = n >> 16, g = n >> 8 & 255, b = n & 255;
  const f = v => Math.round(k > 0 ? v + (255 - v) * k : v * (1 + k));
  return `rgb(${f(r)},${f(g)},${f(b)})`;
}
function vgrad(y0, y1, stops) { const g = ctx.createLinearGradient(0, y0, 0, y1); stops.forEach((c, i) => g.addColorStop(i / (stops.length - 1), c)); return g; }
function radial(x, y, r0, r1, c0, c1) { const g = ctx.createRadialGradient(x, y, r0, x, y, r1); g.addColorStop(0, c0); g.addColorStop(1, c1); return g; }
function bodyGrad(x, y, w, h, c) { // pseudo-3D shading left-light
  const g = ctx.createLinearGradient(x - w / 2, y, x + w / 2, y);
  g.addColorStop(0, shade(c, .25)); g.addColorStop(.45, c); g.addColorStop(1, shade(c, -.22)); return g;
}
function groundShadow(x, y, w, a = .25) { ctx.save(); ctx.globalAlpha = a; ctx.fillStyle = '#000'; ctx.beginPath(); ctx.ellipse(x, y, w, w * .18, 0, 0, Math.PI * 2); ctx.fill(); ctx.restore(); }
function limb(x1, y1, x2, y2, c, w = 26) {
  ctx.lineCap = 'round';
  ctx.strokeStyle = OUT; ctx.lineWidth = w + LW * 2; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
  ctx.strokeStyle = c; ctx.lineWidth = w; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke();
}
function limb2(x1, y1, xm, ym, x2, y2, c, w = 26) { // bent limb
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [col, lw] of [[OUT, w + LW * 2], [c, w]]) { ctx.strokeStyle = col; ctx.lineWidth = lw; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.quadraticCurveTo(xm, ym, x2, y2); ctx.stroke(); }
}

// ---------- character ----------
// o: {x,y feet, s scale, body, skin, hair, mood, look:[dx,dy], blink, armL, armR (deg, 0=down, +=outwards/up), walk (phase or null),
//     squash, rot, talk (0..1 mouth open), extra(fn after body), hairStyle, height (body stretch), noLegs, sit}
function drawChar(o) {
  const s = o.s || 1;
  ctx.save();
  ctx.translate(o.x, o.y);
  if (o.shadow !== false) groundShadow(0, 0, 95 * s * (o.shadowW || 1), o.shadowA ?? .22);
  ctx.rotate((o.rot || 0) * Math.PI / 180);
  const sq = o.squash || 0; ctx.scale(s * (1 + sq), s * (1 - sq));
  const body = o.body || '#ffb72b', skin = o.skin || '#ffd9b8';
  const leg = o.leg || '#3b3f8f';
  const bh = 210 * (o.height || 1);
  const walk = o.walk;
  const sw = walk == null ? 0 : Math.sin(walk * Math.PI * 2);
  const bob = walk == null ? 0 : Math.abs(Math.cos(walk * Math.PI * 2)) * 10;
  ctx.translate(0, -bob);
  // legs
  if (!o.noLegs) {
    if (o.sit) {
      limb2(-30, -95, -40, -40, 30, -45, leg, 34); limb2(30, -95, 20, -40, 80, -45, leg, 34);
      circle(30, -45, 0);
    } else {
      limb(-32, -110, -32 + sw * 30, -8, leg, 36);
      limb(32, -110, 32 - sw * 30, -8, leg, 36);
      // shoes
      for (const [sx, d] of [[-32 + sw * 30, -1], [32 - sw * 30, 1]]) { ctx.beginPath(); ctx.ellipse(sx + d * 8, -4, 30, 16, 0, 0, Math.PI * 2); fillStroke('#2a2a3a'); }
    }
  }
  // body capsule
  const bw = 170, by = -100 - bh;
  rr(-bw / 2, by, bw, bh + 10, 80); fillStroke(bodyGrad(0, 0, bw, bh, body));
  // arms (shoulder at y=by+60)
  const shY = by + 62;
  const arm = (side, deg) => {
    const a = (deg ?? 10) * Math.PI / 180; const L = 125;
    const sx = side * 74, ex = sx + side * Math.sin(a) * L, ey = shY + Math.cos(a) * L;
    limb(sx, shY, ex, ey, body, 30);
    circle(ex, ey, 21); fillStroke(skin, 7);
  };
  arm(-1, (o.armL ?? 12) + (walk != null ? sw * 18 : 0));
  arm(1, (o.armR ?? 12) - (walk != null ? sw * 18 : 0));
  if (o.extraBody) o.extraBody(by, bh);
  // head
  const hy = by - 92, hr = 112;
  ctx.save(); ctx.translate(0, hy); ctx.rotate((o.headRot || 0) * Math.PI / 180);
  if (o.ears !== false) { for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(d * hr * .98, 10, 22, 30, 0, 0, Math.PI * 2); fillStroke(skin, 7); } }
  if (o.earExtra) o.earExtra(hr);
  circle(0, 0, hr); fillStroke(radial(-35, -40, 10, hr * 1.3, shade(skin, .25), shade(skin, -.12)));
  // hair
  const hair = o.hair || '#3a2416';
  if (o.hairStyle !== 'none') {
    ctx.save(); circle(0, 0, hr); ctx.clip();
    ctx.fillStyle = hair;
    if (o.hairStyle === 'long') { ctx.beginPath(); ctx.ellipse(0, -60, 130, 90, 0, 0, Math.PI * 2); ctx.fill(); ctx.fillRect(-hr, -40, 38, 160); ctx.fillRect(hr - 38, -40, 38, 160); }
    else if (o.hairStyle === 'bald') { }
    else if (o.hairStyle === 'grey') { ctx.fillStyle = '#d9d9e3'; ctx.beginPath(); ctx.ellipse(0, -95, 120, 55, 0, 0, Math.PI * 2); ctx.fill(); }
    else { ctx.beginPath(); ctx.ellipse(0, -80, 130, 70, -.1, 0, Math.PI * 2); ctx.fill(); ctx.beginPath(); ctx.ellipse(60, -50, 40, 30, .6, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
    circle(0, 0, hr); fillStroke(null, LW);
    if (o.hairStyle === 'long') { ctx.beginPath(); ctx.ellipse(0, -hr + 5, 60, 22, 0, Math.PI, 0); }
    if (o.hairStyle === 'bun') { circle(0, -hr - 18, 34); fillStroke(hair, 7); }
  }
  if (o.hairStyle === 'grey') { circle(0, -hr - 10, 32); fillStroke('#d9d9e3', 7); }
  // face
  drawFace(o, hr);
  if (o.headExtra) o.headExtra(hr);
  ctx.restore();
  if (o.extra) o.extra(by, bh, hy);
  ctx.restore();
}
function drawFace(o, hr) {
  const mood = o.mood || 'happy';
  const [lx, ly] = o.look || [0, 0];
  const blink = o.blink || 0;
  const ex = 42, ey = 0;
  // blush
  if (mood === 'blush' || o.blushK) {
    ctx.save(); ctx.globalAlpha = o.blushK ?? .8; ctx.fillStyle = '#ff5a6e';
    for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(d * 70, 40, 26, 15, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  if (mood === 'dead') {
    ctx.strokeStyle = OUT; ctx.lineWidth = 11; ctx.lineCap = 'round';
    for (const d of [-1, 1]) { const x = d * ex; ctx.beginPath(); ctx.moveTo(x - 18, ey - 18); ctx.lineTo(x + 18, ey + 18); ctx.moveTo(x + 18, ey - 18); ctx.lineTo(x - 18, ey + 18); ctx.stroke(); }
    ctx.beginPath(); ctx.moveTo(-30, 55); ctx.quadraticCurveTo(0, 40, 30, 55); ctx.stroke();
    // tongue
    ctx.beginPath(); ctx.ellipse(14, 62, 12, 16, 0, 0, Math.PI); fillStroke('#ff6f86', 6);
    return;
  }
  const big = mood === 'shock' ? 1.35 : 1;
  for (const d of [-1, 1]) {
    const x = d * ex;
    ctx.save(); ctx.translate(x, ey); ctx.scale(1, Math.max(.08, 1 - blink));
    ctx.beginPath(); ctx.ellipse(0, 0, 27 * big, 33 * big, 0, 0, Math.PI * 2); fillStroke('#fff', 7);
    if (mood !== 'closed') { circle(lx * 9, ly * 10 + 2, 14 * (mood === 'shock' ? .8 : 1)); ctx.fillStyle = OUT; ctx.fill(); circle(lx * 9 - 5, ly * 10 - 4, 5); ctx.fillStyle = '#fff'; ctx.fill(); }
    ctx.restore();
  }
  // brows
  ctx.strokeStyle = OUT; ctx.lineWidth = 9; ctx.lineCap = 'round';
  const browY = { sad: -48, shock: -60, angry: -40, worried: -50 }[mood] ?? -50;
  for (const d of [-1, 1]) {
    ctx.beginPath();
    if (mood === 'sad' || mood === 'worried') { ctx.moveTo(d * 20, browY - 8); ctx.lineTo(d * 62, browY + 6); }
    else if (mood === 'angry') { ctx.moveTo(d * 20, browY + 8); ctx.lineTo(d * 62, browY - 8); }
    else { ctx.moveTo(d * 22, browY); ctx.quadraticCurveTo(d * 42, browY - 10, d * 62, browY); }
    ctx.stroke();
  }
  // mouth
  const talk = o.talk || 0;
  ctx.lineWidth = 9;
  if (mood === 'shock') { ctx.beginPath(); ctx.ellipse(0, 62, 22, 30 + talk * 6, 0, 0, Math.PI * 2); fillStroke('#5a1a2a', 7); }
  else if (talk > .05) { ctx.beginPath(); ctx.ellipse(0, 58, 26, 8 + talk * 22, 0, 0, Math.PI * 2); fillStroke('#5a1a2a', 7); }
  else if (mood === 'sad' || mood === 'worried') { ctx.beginPath(); ctx.moveTo(-26, 68); ctx.quadraticCurveTo(0, 50, 26, 68); ctx.stroke(); }
  else if (mood === 'flat' || mood === 'angry') { ctx.beginPath(); ctx.moveTo(-22, 60); ctx.lineTo(22, 60); ctx.stroke(); }
  else if (mood === 'grin') { ctx.beginPath(); ctx.moveTo(-40, 45); ctx.quadraticCurveTo(0, 105, 40, 45); ctx.closePath(); fillStroke('#fff', 7); }
  else { ctx.beginPath(); ctx.moveTo(-30, 50); ctx.quadraticCurveTo(0, 82, 30, 50); ctx.stroke(); }
}
// automatic blink: returns 0..1
function blinkAt(t, seed = 0) { const period = 2.8 + hash(seed) * 1.5; const ph = (t + hash(seed + 3) * 3) % period; return ph < .12 ? Math.sin(ph / .12 * Math.PI) : 0; }
// talking mouth from word timings
function talkAt(t, words) { for (const w of words) if (t >= w.s && t <= w.e + .05) return .4 + .6 * Math.abs(Math.sin((t - w.s) * 22)); return 0; }

// ---------- text ----------
function txt(str, x, y, size, o = {}) {
  ctx.save();
  ctx.font = `${o.weight || ''} ${size}px ${o.font || 'Lilita'}`;
  ctx.textAlign = o.align || 'center'; ctx.textBaseline = 'middle';
  if (o.rot) { ctx.translate(x, y); ctx.rotate(o.rot); x = 0; y = 0; }
  if (o.stroke !== 0) { ctx.lineJoin = 'round'; ctx.lineWidth = o.stroke ?? size * .22; ctx.strokeStyle = o.strokeColor || OUT; ctx.strokeText(str, x, y); }
  if (o.shadow) { ctx.fillStyle = OUT; ctx.fillText(str, x, y + size * .09); }
  ctx.fillStyle = o.color || '#fff'; ctx.fillText(str, x, y);
  ctx.restore();
}
function measure(str, size, font = 'Lilita') { ctx.font = `${size}px ${font}`; return ctx.measureText(str).width; }
function wrapLines(str, size, maxW, font) {
  const words = str.split(' '); const lines = []; let cur = '';
  for (const w of words) { const test = cur ? cur + ' ' + w : w; if (measure(test, size, font) > maxW && cur) { lines.push(cur); cur = w; } else cur = test; }
  if (cur) lines.push(cur); return lines;
}

// ---------- captions (word by word, chunks of up to N words) ----------
// words: [{w,s,e}] absolute times. Builds chunks once.
function buildChunks(words, maxWords = 3, maxChars = 16) {
  const chunks = []; let cur = [];
  const flush = () => { if (cur.length) { chunks.push({ words: cur, s: cur[0].s, e: cur[cur.length - 1].e }); cur = []; } };
  for (const w of words) {
    const len = cur.map(x => x.w).join(' ').length + w.w.length;
    if (cur.length >= maxWords || (cur.length && len > maxChars)) flush();
    cur.push(w);
    if (/[.,!?…:;»]$/.test(w.w)) flush();
  }
  flush();
  for (let i = 0; i < chunks.length; i++) { const n = chunks[i + 1]; chunks[i].end = n ? Math.min(n.s, chunks[i].e + .6) : chunks[i].e + .6; }
  return chunks;
}
function drawCaptions(t, chunks, o = {}) {
  const y0 = o.y ?? 1240, size0 = o.size ?? 104, hi = o.hi || '#ffe23d';
  const c = chunks.find(c => t >= c.s - .05 && t < c.end); if (!c) return;
  const p = pop(t, c.s - .05, .22);
  const sc = .7 + .3 * p;
  const strs = c.words.map(w => (o.upper !== false ? w.w.toUpperCase() : w.w).replace(/[«»"]/g, ''));
  let size = size0; const full = strs.join(' ');
  while (measure(full, size) > 960 && size > 60) size -= 4;
  const lines = measure(full, size) > 960 ? [strs.slice(0, Math.ceil(strs.length / 2)), strs.slice(Math.ceil(strs.length / 2))] : [strs];
  ctx.save(); ctx.translate(W / 2, y0); ctx.scale(sc, sc); ctx.rotate((o.tilt ?? -2) * Math.PI / 180);
  let wi = 0;
  lines.forEach((ln, li) => {
    const lw = ln.reduce((a, s) => a + measure(s, size), 0) + (ln.length - 1) * size * .38; let x = -lw / 2; const y = (li - (lines.length - 1) / 2) * size * 1.1;
    for (const s of ln) {
      const w = c.words[wi++]; const ww = measure(s, size);
      const active = t >= w.s - .03;
      const now = t >= w.s - .03 && t <= w.e + .05;
      const col = now ? hi : (active ? '#fff' : 'rgba(255,255,255,.55)');
      const k = now ? 1.08 : 1;
      ctx.save(); ctx.translate(x + ww / 2, y); ctx.scale(k, k);
      txt(s, 0, 0, size, { color: o.colorFn ? o.colorFn(w, col) : col, stroke: size * .24, shadow: true });
      ctx.restore();
      x += ww + size * .38;
    }
  });
  ctx.restore();
}

// ---------- misc fx ----------
function vignette(a = .45) { const g = ctx.createRadialGradient(W / 2, H / 2, H * .3, W / 2, H / 2, H * .75); g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, `rgba(0,0,0,${a})`); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
function flash(t, at, d = .25, col = '#fff') { const p = pr(t, at, at + d); if (p <= 0 || p >= 1) return; ctx.save(); ctx.globalAlpha = (1 - p) * .8; ctx.fillStyle = col; ctx.fillRect(0, 0, W, H); ctx.restore(); }
function shakeOffset(t, at, d = .4, amp = 18) { const p = pr(t, at, at + d); if (p <= 0 || p >= 1) return [0, 0]; const k = (1 - p) * amp; return [Math.sin(t * 90) * k, Math.cos(t * 77) * k]; }
function cloud(x, y, s, a = 1, col = '#fff') {
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(-60, 10, 50, 0, Math.PI * 2); ctx.arc(0, -15, 65, 0, Math.PI * 2); ctx.arc(65, 8, 48, 0, Math.PI * 2); ctx.rect(-60, 10, 125, 48);
  ctx.fillStyle = col; ctx.fill(); ctx.restore();
}
function sparkles(t, x, y, r, n = 8, col = '#ffe23d', seed = 1) {
  for (let i = 0; i < n; i++) { const a = hash(i + seed) * 6.28, d = r * (.4 + hash(i + seed + 9) * .6); const ph = (t * 1.5 + hash(i + seed + 4)) % 1; const k = Math.sin(ph * Math.PI);
    star4(x + Math.cos(a) * d, y + Math.sin(a) * d, 18 * k + 2, col); }
}
function star4(x, y, r, col) { ctx.save(); ctx.translate(x, y); ctx.beginPath(); for (let i = 0; i < 8; i++) { const rr_ = i % 2 ? r * .3 : r; const a = i * Math.PI / 4; ctx.lineTo(Math.cos(a) * rr_, Math.sin(a) * rr_); } ctx.closePath(); ctx.fillStyle = col; ctx.fill(); ctx.restore(); }
function ghost(x, y, s, a) { // cute ghost for "mueres"
  ctx.save(); ctx.globalAlpha = a; ctx.translate(x, y); ctx.scale(s, s);
  ctx.beginPath(); ctx.arc(0, 0, 70, Math.PI, 0); ctx.lineTo(70, 90);
  for (let i = 0; i < 4; i++) ctx.quadraticCurveTo(70 - i * 35 - 17, 110, 70 - (i + 1) * 35, 90);
  ctx.closePath(); fillStroke('#f4f6ff', 8);
  for (const d of [-1, 1]) { ctx.beginPath(); ctx.ellipse(d * 24, -5, 9, 13, 0, 0, Math.PI * 2); ctx.fillStyle = OUT; ctx.fill(); }
  ctx.beginPath(); ctx.ellipse(0, 28, 10, 12, 0, 0, Math.PI * 2); ctx.fillStyle = OUT; ctx.fill();
  ctx.restore();
}
// rounded UI pill with text
function pill(x, y, label, size, bg, fg = '#fff', o = {}) {
  ctx.font = `${size}px Lilita`; const w = ctx.measureText(label).width + size * 1.1, h = size * 1.45;
  ctx.save(); ctx.translate(x, y); if (o.scale != null) ctx.scale(o.scale, o.scale); if (o.rot) ctx.rotate(o.rot);
  rr(-w / 2, -h / 2 + 10, w, h, h / 2); ctx.fillStyle = OUT; ctx.fill();
  rr(-w / 2, -h / 2, w, h, h / 2); fillStroke(bg, 8);
  txt(label, 0, 2, size, { color: fg, stroke: 0 });
  ctx.restore(); return w;
}
// watermark / handle
function handle(a = .85) { ctx.save(); ctx.globalAlpha = a; txt('@soybalba', W / 2, H - 330, 40, { color: '#fff', stroke: 10 }); ctx.restore(); }

function speech(x, y, str, size, p, o = {}) { // speech bubble, tail to (x,y)
  if (p <= 0) return;
  const lines = wrapLines(str, size, o.maxW || 600);
  const w = Math.max(...lines.map(l => measure(l, size))) + size * 1.2, h = lines.length * size * 1.15 + size * .9;
  const bx = x + (o.dx ?? 0), by = y - (o.dy ?? 160);
  ctx.save(); ctx.translate(bx, by); ctx.scale(eBack(p), eBack(p));
  ctx.beginPath(); ctx.moveTo(-30, h / 2 - 10); ctx.lineTo(x - bx, y - by); ctx.lineTo(30, h / 2 - 10); ctx.closePath(); fillStroke(o.bg || '#fff', 8);
  rr(-w / 2, -h / 2, w, h, 40); fillStroke(o.bg || '#fff', 8);
  ctx.beginPath(); ctx.moveTo(-28, h / 2 - 4); ctx.lineTo(28, h / 2 - 4); ctx.lineWidth = 12; ctx.strokeStyle = o.bg || '#fff'; ctx.stroke();
  lines.forEach((l, i) => txt(l, 0, (i - (lines.length - 1) / 2) * size * 1.15 + 3, size, { color: o.fg || OUT, stroke: 0 }));
  ctx.restore();
}

// ---------- harness ----------
window.SB = { W, H, ctx, data: null };
window.renderFrame = function (t) { ctx.setTransform(1, 0, 0, 1, 0, 0); ctx.clearRect(0, 0, W, H); window.scene(t, window.SB.data); };
