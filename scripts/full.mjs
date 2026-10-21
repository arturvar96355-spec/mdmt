// Полностраничные снимки частями: node scripts/full.mjs url prefix width height
import { chromium } from 'playwright';
const [url, prefix, w = '1440', h = '900'] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--no-sandbox'] });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
p.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 500)));
await p.goto(url, { waitUntil: 'load' });
await p.waitForTimeout(2500);
const total = await p.evaluate(() => document.documentElement.scrollHeight);
console.log('height', total);
let i = 0;
for (let y = 0; y < total; y += +h) {
  await p.evaluate((yy) => window.scrollTo(0, yy), y);
  await p.waitForTimeout(1600);
  await p.screenshot({ path: `${prefix}${String(i++).padStart(2, '0')}.png` });
}
await b.close();
