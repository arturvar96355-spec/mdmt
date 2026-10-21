'use client';

import { motion } from 'motion/react';
import { useReducedMotion } from '@/lib/hooks';
import { useReady } from '@/lib/ready';

export const EASE = [0.22, 1, 0.36, 1] as const;

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
  const reduce = useReducedMotion();
  const Comp = motion[as] as typeof motion.div;
  return (
    <Comp
      className={className}
      initial={reduce ? false : { opacity: 0, y, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.9, delay, ease: EASE }}
    >
      {children}
    </Comp>
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
    <span className={className} aria-label={lines.join(' ')}>
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
