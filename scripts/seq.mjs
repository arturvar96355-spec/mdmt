// Серия снимков при скролле: node scripts/seq.mjs url prefix w h y1,y2,...
import { chromium } from 'playwright';
const [url, prefix, w, h, ys] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
p.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 500)));
p.on('console', (m) => m.type() === 'error' && console.log('[err]', m.text().slice(0, 300)));
await p.goto(url, { waitUntil: 'load' });
await p.waitForTimeout(2000);
let i = 0;
for (const y of ys.split(',')) {
  await p.evaluate((yy) => window.scrollTo(0, yy), +y);
  await p.waitForTimeout(3500);
  await p.screenshot({ path: `${prefix}${i++}.png` });
}
await b.close();
