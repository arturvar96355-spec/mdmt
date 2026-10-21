'use client';

import { useEffect, useRef, useState } from 'react';
import { animate, useInView } from 'motion/react';
import { useReducedMotion } from '@/lib/hooks';

export function CountUp({ to, from = 0, duration = 1.6, group = false }: { to: number; from?: number; duration?: number; group?: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : from);
  useEffect(() => {
    if (!inView) return;
    if (reduce) { setV(to); return; }
    const c = animate(from, to, { duration, ease: [0.22, 1, 0.36, 1], onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, reduce, to, from, duration]);
  return <span ref={ref}>{group ? v.toLocaleString('ru-RU') : v}</span>;
}
