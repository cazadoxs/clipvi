// node render.js <vid> [--preview t1,t2,...] [--music bouncy|tender]
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path'), { spawn, execFileSync } = require('child_process');
const ROOT = path.resolve(__dirname, '..');
const vid = process.argv[2];
const args = process.argv.slice(3);
const prevIdx = args.indexOf('--preview');
const preview = prevIdx >= 0 ? args[prevIdx + 1].split(',').map(Number) : null;
const FPS = 30;
const WORKERS = 4;

const font = (f) => 'data:font/woff2;base64,' + fs.readFileSync(path.join(__dirname, 'node_modules/@fontsource', f)).toString('base64');
const html = `<!doctype html><html><head><style>
@font-face{font-family:Lilita;src:url(${font('lilita-one/files/lilita-one-latin-400-normal.woff2')})}
@font-face{font-family:Baloo;font-weight:800;src:url(${font('baloo-2/files/baloo-2-latin-800-normal.woff2')})}
body{margin:0;background:#000}</style></head><body><canvas id="c" width="1080" height="1920"></canvas>
<script>${fs.readFileSync(path.join(__dirname, 'engine.js'), 'utf8')}</script>
<script>${fs.readFileSync(path.join(__dirname, 'scenes', vid.slice(0, 2) + '.js'), 'utf8')}</script>
${fs.existsSync(path.join(__dirname, 'scenes', vid + '.js')) ? `<script>${fs.readFileSync(path.join(__dirname, 'scenes', vid + '.js'), 'utf8')}</script>` : ''}
</body></html>`;
const data = JSON.parse(fs.readFileSync(path.join(ROOT, 'build', vid + '.json'), 'utf8'));
data.vid = vid;

async function newPage(browser) {
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('console', m => { if (m.type() === 'error') console.error('PAGE', m.text()); });
  page.on('pageerror', e => console.error('PAGEERR', e.message));
  await page.setContent(html);
  await page.evaluate(async (d) => { await document.fonts.load('40px Lilita'); await document.fonts.load('800 40px Baloo'); SB.data = d; if (window.setup) window.setup(d); }, data);
  return page;
}
const grab = (page, t) => page.evaluate((t) => { renderFrame(t); return document.getElementById('c').toDataURL('image/jpeg', .9).split(',')[1]; }, t);

(async () => {
  const browser = await chromium.launch();
  if (preview) {
    const page = await newPage(browser);
    fs.mkdirSync(path.join(ROOT, 'prev'), { recursive: true });
    for (const t of preview) fs.writeFileSync(path.join(ROOT, 'prev', `${vid}_${t}.jpg`), Buffer.from(await grab(page, t), 'base64'));
    await browser.close(); return;
  }
  const N = Math.ceil(data.dur * FPS);
  const page0 = await newPage(browser);
  const sfx = await page0.evaluate((d) => window.sfxList ? window.sfxList(d) : [], data);
  fs.writeFileSync(path.join(ROOT, 'build', vid + '_sfx.json'), JSON.stringify(sfx));
  const pages = [page0]; for (let i = 1; i < WORKERS; i++) pages.push(await newPage(browser));
  const per = Math.ceil(N / WORKERS);
  const t0 = Date.now();
  await Promise.all(pages.map(async (page, wi) => {
    const a = wi * per, b = Math.min(N, a + per);
    const ff = spawn('ffmpeg', ['-y', '-v', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '18', '-pix_fmt', 'yuv420p', path.join(ROOT, 'build', `${vid}_part${wi}.mp4`)]);
    for (let f = a; f < b; f++) {
      const buf = Buffer.from(await grab(page, f / FPS), 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (wi === 0 && f % 150 === 0) console.log(`frame ${f}/${per} ${((Date.now() - t0) / 1000).toFixed(0)}s`);
    }
    ff.stdin.end(); await new Promise(r => ff.on('close', r));
  }));
  await browser.close();
  const list = path.join(ROOT, 'build', vid + '_parts.txt');
  fs.writeFileSync(list, pages.map((_, i) => `file '${vid}_part${i}.mp4'`).join('\n'));
  execFileSync('ffmpeg', ['-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', path.join(ROOT, 'build', vid + '_video.mp4')]);
  console.log('video done', ((Date.now() - t0) / 1000).toFixed(0), 's');
})();
