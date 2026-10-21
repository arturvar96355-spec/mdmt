// node scripts/sheets.mjs url width height prefix  — кадры по высоте экрана
import { chromium } from 'playwright';
const [url, w, h, prefix] = process.argv.slice(2);
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const p = await b.newPage({ viewport: { width: +w, height: +h } });
await p.goto(url, { waitUntil: 'load' }); await p.waitForTimeout(2500);
const total = await p.evaluate(() => document.documentElement.scrollHeight);
let i = 0;
for (let y = 0; y < total; y += +h * 0.9) { await p.evaluate((yy) => scrollTo(0, yy), y); await p.waitForTimeout(1300); await p.screenshot({ path: `${prefix}${String(i++).padStart(2, '0')}.png` }); }
console.log(prefix, total, i);
await b.close();
