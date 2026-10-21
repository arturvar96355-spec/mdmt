'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { useReducedMotion } from '@/lib/hooks';

export function Typed({ text, delay = 0, speed = 55, svg = false }: { text: string; delay?: number; speed?: number; svg?: boolean }) {
  const ref = useRef<any>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const [n, setN] = useState(reduce ? text.length : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    let i = 0;
    const t0 = setTimeout(function tick() {
      i++;
      setN(i);
      if (i < text.length) setTimeout(tick, speed);
    }, delay);
    return () => clearTimeout(t0);
  }, [inView, reduce, text, delay, speed]);
  if (svg) return <tspan ref={ref}>{text.slice(0, n)}</tspan>;
  return <span ref={ref} aria-label={text}>{text.slice(0, n)}<span className="opacity-0">{text.slice(n)}</span></span>;
}
