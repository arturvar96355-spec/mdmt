// Использование: node scripts/shot.mjs <url> <out.png> [width] [height] [waitMs] [scrollY]
import { chromium } from 'playwright';

const [url, out, w = '1440', h = '900', wait = '4500', sy = '0'] = process.argv.slice(2);
const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium',
  args: ['--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--no-sandbox'],
});
const page = await browser.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1 });
page.on('console', (m) => ['error', 'warning'].includes(m.type()) && console.log('[console]', m.text().slice(0, 300)));
page.on('pageerror', (e) => console.log('[pageerror]', e.message.slice(0, 300)));
await page.goto(url, { waitUntil: 'load' });
if (+sy) await page.evaluate((y) => window.scrollTo(0, y), +sy);
await page.waitForTimeout(+wait);
await page.screenshot({ path: out });
await browser.close();
