'use client';

import { useEffect, useRef } from 'react';

/** Курсор-перекрестие с координатами. Только pointer: fine, скрыт над 3D-холстом. */
export function Cursor() {
  const el = useRef<HTMLDivElement>(null);
  const txt = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    document.body.classList.add('has-cursor');
    let x = 0, y = 0, cx = 0, cy = 0, raf = 0;
    const move = (e: PointerEvent) => {
      x = e.clientX; y = e.clientY;
      const over = (e.target as HTMLElement)?.closest?.('canvas');
      if (el.current) el.current.style.opacity = over ? '0' : '1';
      document.body.classList.toggle('has-cursor', !over);
    };
    const loop = () => {
      cx += (x - cx) * 0.25; cy += (y - cy) * 0.25;
      if (el.current) el.current.style.transform = `translate3d(${cx}px, ${cy}px, 0)`;
      if (txt.current) txt.current.textContent = `X ${String(Math.round(x)).padStart(4, '0')}  Y ${String(Math.round(y)).padStart(4, '0')}`;
      raf = requestAnimationFrame(loop);
    };
    window.addEventListener('pointermove', move, { passive: true });
    raf = requestAnimationFrame(loop);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('pointermove', move); document.body.classList.remove('has-cursor'); };
  }, []);
  return (
    <div ref={el} aria-hidden className="pointer-events-none fixed left-0 top-0 z-[100] opacity-0 mix-blend-difference">
      <span className="absolute -left-[11px] top-0 h-px w-[22px] bg-white" />
      <span className="absolute -top-[11px] left-0 h-[22px] w-px bg-white" />
      <span ref={txt} className="mono absolute left-3.5 top-2 whitespace-pre text-[9px] tracking-[0.1em] text-white" />
    </div>
  );
}
