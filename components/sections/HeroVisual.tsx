'use client';

import { useEffect, useRef, useState } from 'react';
import { LazyStage } from '@/components/three/LazyStage';
import { buildTruss } from '@/lib/truss/build';
import { trussToSvg } from '@/lib/truss/iso';
import { series } from '@/content/series';
import { hasWebGL, useMedia, useReducedMotion } from '@/lib/hooks';
import { useReady } from '@/lib/ready';

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
        <line
          key={i}
          className="draw"
          pathLength={1}
          x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
          stroke={l.chord ? 'url(#alu)' : '#9aa1ad'}
          strokeWidth={l.w}
          strokeLinecap="round"
          style={{ animationDelay: `${0.2 + l.t * 1.6}s` }}
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

  useEffect(() => {
    if (desktop) setGl(hasWebGL());
  }, [desktop]);
  useEffect(() => {
    if (!box.current) return;
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), { rootMargin: '200px' });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  const ready = useReady();
  useEffect(() => {
    const on = () => { if (hasWebGL()) { setGl(true); setAsked(true); } };
    window.addEventListener('mdmt:3d', on);
    return () => window.removeEventListener('mdmt:3d', on);
  }, []);
  const run3d = gl && !reduce && ready && (desktop || asked);

  return (
    <div ref={box} className="absolute inset-0">
      {run3d && visible ? (
        <div className="absolute inset-0 animate-[fadein_1.2s_ease_both]">
          <LazyStage bloom={(navigator.hardwareConcurrency || 4) > 4} />
        </div>
      ) : (
        <div className="absolute inset-x-0 top-[76px] h-[150px] flex flex-col px-2 md:inset-y-[18%] md:left-[34%] md:h-auto md:block">
          <div className="min-h-0 flex-1 md:h-full"><SvgTruss /></div>
        </div>
      )}
    </div>
  );
}
