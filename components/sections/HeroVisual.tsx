'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Rotate3d } from 'lucide-react';
import { LazyStage } from '@/components/three/LazyStage';
import { buildTruss } from '@/lib/truss/build';
import { trussToSvg } from '@/lib/truss/iso';
import { series } from '@/content/series';
import { hasWebGL, useMedia, useReducedMotion } from '@/lib/hooks';

function SvgTruss() {
  const lines = (() => {
    const s = series.find((x) => x.code === 'T52')!;
    return trussToSvg(buildTruss({ section: 'square', scale: s.scale * 1.55, length: 6 }), 900, 520, 0.5);
  })();
  return (
    <svg viewBox="0 0 900 520" className="h-full w-full" role="img" aria-label="Схема алюминиевой фермы. Размеры условные">
      <defs>
        <linearGradient id="alu" x1="0" x2="1">
          <stop offset="0" stopColor="#8c93a0" />
          <stop offset="0.5" stopColor="#f4f5f7" />
          <stop offset="1" stopColor="#8c93a0" />
        </linearGradient>
      </defs>
      {lines.map((l, i) => (
        <motion.line
          key={i}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={l.chord ? 'url(#alu)' : '#9aa1ad'}
          strokeWidth={l.w}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.3 + l.t * 2.2, ease: 'easeOut' }}
        />
      ))}
    </svg>
  );
}

export function HeroVisual() {
  const desktop = useMedia('(min-width: 768px)');
  const reduce = useReducedMotion();
  const [gl, setGl] = useState(false);
  const [asked, setAsked] = useState(false);
  const [visible, setVisible] = useState(true);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => setGl(hasWebGL()), []);
  useEffect(() => {
    if (!box.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px' });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  const run3d = gl && !reduce && (desktop || asked);

  return (
    <div ref={box} className="absolute inset-0">
      {run3d && visible ? (
        <div className="absolute inset-0 animate-[fadein_1.2s_ease_both]">
          <LazyStage />
        </div>
      ) : (
        <div className="absolute inset-x-0 bottom-[58%] top-[11%] px-2 md:inset-y-[18%] md:left-[34%]">
          <SvgTruss />
          {gl && !reduce && !desktop && (
            <button
              onClick={() => setAsked(true)}
              className="mono absolute -bottom-2 right-4 flex min-h-11 items-center gap-2 border border-signal/70 bg-void/70 px-4 text-[12px] uppercase tracking-[0.14em] text-signal backdrop-blur"
            >
              <Rotate3d className="size-4" aria-hidden /> Покрутить в 3D
            </button>
          )}
        </div>
      )}
    </div>
  );
}
