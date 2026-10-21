import { chromium } from 'playwright';
const base = 'http://localhost:3200';
const pages = ['/', '/catalog/t52/', '/contacts/', '/stages/', '/projects/', '/projects/tashir-arena/', '/projects/gelendzhik-arena/', '/production/', '/rfq/', '/privacy/', '/styleguide/'];
const widths = [360, 390, 768, 1024];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--no-sandbox', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
for (const w of widths) {
  const p = await b.newPage({ viewport: { width: w, height: 800 } });
  for (const path of pages) {
    await p.goto(base + path, { waitUntil: 'load' });
    await p.waitForTimeout(900);
    // прокрутить, чтобы сработали reveal
    const h = await p.evaluate(() => document.documentElement.scrollHeight);
    for (let y = 0; y < h; y += 700) { await p.evaluate((yy) => scrollTo(0, yy), y); await p.waitForTimeout(60); }
    const r = await p.evaluate((W) => {
      const out = { overflow: document.documentElement.scrollWidth - W, wide: [], small: [], tiny: [] };
      for (const el of document.querySelectorAll('body *')) {
        const cs = getComputedStyle(el);
        if (cs.display === 'none' || cs.visibility === 'hidden') continue;
        const rc = el.getBoundingClientRect();
        if (rc.width === 0 || rc.height === 0) continue;
        if (rc.right > W + 1 && !el.closest('[aria-hidden="true"], .overflow-hidden, svg')) out.wide.push(`${el.tagName.toLowerCase()}.${String(el.className).slice(0, 50)} r=${Math.round(rc.right)}`);
        if ((el.tagName === 'A' || el.tagName === 'BUTTON' || el.tagName === 'INPUT') && (rc.height < 40 || rc.width < 40) && !el.classList.contains('sr-only') && cs.position !== 'fixed' && rc.width > 4) out.small.push(`${el.tagName.toLowerCase()} "${(el.textContent || el.getAttribute('aria-label') || '').trim().slice(0, 24)}" ${Math.round(rc.width)}x${Math.round(rc.height)}`);
        if (parseFloat(cs.fontSize) < 11 && el.childNodes.length && [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) out.tiny.push(`${cs.fontSize} "${el.textContent.trim().slice(0, 24)}"`);
      }
      return out;
    }, w);
    const bad = r.overflow > 0 || r.wide.length;
    console.log(`${w} ${path} overflow=${r.overflow}${bad ? ' WIDE: ' + [...new Set(r.wide)].slice(0, 4).join(' | ') : ''}`);
    if (r.small.length) console.log('   small:', [...new Set(r.small)].slice(0, 6).join(' ; '));
  }
  await p.close();
}
await b.close();
