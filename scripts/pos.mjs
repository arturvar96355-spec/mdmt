import { chromium } from 'playwright';
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox'] });
const p = await b.newPage({ viewport: { width: +(process.argv[3] ?? 1440), height: 900 } });
await p.goto(process.argv[2]); await p.waitForTimeout(1500);
console.log(await p.evaluate(() => [...document.querySelectorAll('section[id], footer')].map((e) => `${e.id}: ${Math.round(e.getBoundingClientRect().top + scrollY)} h=${Math.round(e.getBoundingClientRect().height)}`).join('\n')));
await b.close();
