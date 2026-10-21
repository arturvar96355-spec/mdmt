'use client';

import { useEffect, useRef } from 'react';

/** Тонкая вертикальная шкала прогресса прокрутки (desktop). */
export function ScrollRail() {
  const fill = useRef<HTMLDivElement>(null);
  const txt = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!window.matchMedia('(min-width: 1280px)').matches) return;
    let raf = 0;
    const upd = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      if (fill.current) fill.current.style.transform = `scaleY(${p})`;
      if (txt.current) txt.current.textContent = String(Math.round(p * 100)).padStart(3, '0');
      raf = 0;
    };
    const on = () => { if (!raf) raf = requestAnimationFrame(upd); };
    upd();
    window.addEventListener('scroll', on, { passive: true });
    window.addEventListener('resize', on);
    return () => { window.removeEventListener('scroll', on); window.removeEventListener('resize', on); };
  }, []);
  return (
    <div aria-hidden className="pointer-events-none fixed right-3 top-1/2 z-40 hidden h-40 -translate-y-1/2 flex-col items-center gap-3 xl:flex">
      <span ref={txt} className="mono text-[9px] tracking-[0.14em] text-mute">000</span>
      <div className="relative w-px flex-1 bg-grid"><div ref={fill} className="absolute inset-0 origin-top scale-y-0 bg-signal" /></div>
    </div>
  );
}
