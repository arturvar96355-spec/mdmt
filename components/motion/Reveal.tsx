'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { useReducedMotion } from '@/lib/hooks';
import { useReady } from '@/lib/ready';

export const EASE = [0.22, 1, 0.36, 1] as const;

let io: IntersectionObserver | null = null;
function observe(el: Element) {
  if (!io) {
    io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io!.unobserve(e.target); }
      }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    );
  }
  io.observe(el);
}

/** Появление блока при входе во вьюпорт: один общий IntersectionObserver и CSS-переход (без motion на каждый блок). */
export function Reveal({
  children,
  delay = 0,
  y = 32,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: 'div' | 'li' | 'section' | 'p';
}) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { el.classList.add('in'); return; }
    observe(el);
    return () => io?.unobserve(el);
  }, []);
  const Tag = as as 'div';
  return (
    <Tag
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`reveal ${className ?? ''}`}
      style={{ '--ry': `${y}px`, '--rd': `${delay}s` } as React.CSSProperties}
    >
      {children}
    </Tag>
  );
}

/** Заголовок построчно: каждая строка выезжает из-под маски. */
export function SplitLines({
  lines,
  className,
  delay = 0,
  accent,
  gate = false,
}: {
  lines: string[];
  className?: string;
  delay?: number;
  accent?: number;
  gate?: boolean;
}) {
  const reduce = useReducedMotion();
  const ready = useReady();
  const go = !gate || ready;
  return (
    <span className={className}>
      <span className="sr-only">{lines.join(' ')}</span>
      {lines.map((l, i) => (
        <span key={i} className="block overflow-hidden pb-[0.08em]" aria-hidden>
          <motion.span
            className={`block ${accent === i ? 'text-signal' : ''}`}
            initial={reduce ? false : { y: '110%' }}
            animate={go ? { y: 0 } : { y: '110%' }}
            transition={{ duration: 1, delay: delay + i * 0.09, ease: EASE }}
          >
            {l}
          </motion.span>
        </span>
      ))}
    </span>
  );
}
