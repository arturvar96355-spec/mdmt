'use client';

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { setReady } from '@/lib/ready';

const KEY = 'mdmt-intro';

/** Чертёж-заставка: ≤1,2 с, один раз за сессию, не показывается при reduced motion. */
export function Preloader() {
  const [show, setShow] = useState(true);
  const [n, setN] = useState(0);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem(KEY) === '1'; } catch {}
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (seen || reduce) { setShow(false); setReady(); return; }
    try { sessionStorage.setItem(KEY, '1'); } catch {}
    const t0 = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 900);
      setN(Math.round(k * 100));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    const a = setTimeout(setReady, 950);
    const b = setTimeout(() => setShow(false), 1650);
    return () => { cancelAnimationFrame(raf); clearTimeout(a); clearTimeout(b); };
  }, []);

  if (!show) return null;
  const done = n >= 100;
  return (
    <motion.div
      aria-hidden
      className="fixed inset-0 z-[200] grid place-items-center bg-void"
      animate={done ? { y: '-100%' } : { y: 0 }}
      transition={{ duration: 0.7, delay: 0.05, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="bg-blueprint absolute inset-0 opacity-50" />
      <div className="relative w-[min(560px,80vw)]">
        <svg viewBox="0 0 560 120" className="w-full">
          <motion.path d="M10 30 H550 M10 90 H550 M10 30 L55 90 L100 30 L145 90 L190 30 L235 90 L280 30 L325 90 L370 30 L415 90 L460 30 L505 90 L550 30" fill="none" stroke="#c9ced6" strokeWidth="2" strokeLinecap="square" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: 'easeInOut' }} />
          <motion.circle cx="550" cy="30" r="5" fill="#ff6a13" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
        </svg>
        <div className="mono mt-6 flex justify-between text-[12px] uppercase tracking-[0.18em] text-mute">
          <span>МДМ-Технология</span>
          <span className="text-white">{String(n).padStart(3, '0')}</span>
        </div>
      </div>
    </motion.div>
  );
}
