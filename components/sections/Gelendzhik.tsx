'use client';

import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { gelendzhik } from '@/content/projects';
import { useMedia, useReducedMotion } from '@/lib/hooks';
import { typograph } from '@/lib/typograph';

const COLS = [
  { k: 'Задача', v: gelendzhik.task, ph: true },
  { k: 'Решение', v: gelendzhik.solution, ph: false },
  { k: 'Результат', v: gelendzhik.result, ph: true },
] as const;

function Arena({ done = false, r }: { done?: boolean; r: { curtain: React.RefObject<SVGGElement | null>; hl: React.RefObject<SVGGElement | null>; hr: React.RefObject<SVGGElement | null>; tags: React.RefObject<SVGGElement | null> } }) {
  return (
    <svg viewBox="0 0 1200 640" className="h-full w-full" role="img" aria-label="Схема: люк в полу сцены открывается, противопожарный занавес опускается в проём">
      <defs>
        <pattern id="hz" width="16" height="16" patternUnits="userSpaceOnUse" patternTransform="rotate(-45)">
          <rect width="8" height="16" fill="#ff6a13" />
          <rect x="8" width="8" height="16" fill="#08090b" />
        </pattern>
        <clipPath id="loft"><rect x="0" y="0" width="1200" height="640" /></clipPath>
      </defs>
      <g fill="none" stroke="#c9ced6" strokeWidth="1.4" strokeLinejoin="round">
        {/* зал: стены, кровля, перекрытие */}
        <path d="M60 520 V300 Q600 -80 1140 300 V520" opacity="0.9" />
        <path d="M120 520 V318 Q600 -20 1080 318 V520" opacity="0.35" strokeDasharray="4 6" />
        {Array.from({ length: 13 }, (_, i) => {
          const t = (i + 1) / 14; const x = 60 + t * 1080;
          const yTop = 300 - Math.sin(t * Math.PI) * 280 * 0.88 + 8;
          return <line key={i} x1={x} y1={yTop} x2={x} y2={yTop + 26} opacity="0.35" />;
        })}
        {/* трибуны */}
        <path d="M60 520 H150 V492 H215 V464 H280 V436 H345 V408 H380" opacity="0.7" />
        <path d="M1140 520 H1050 V492 H985 V464 H920 V436 H855 V408 H820" opacity="0.7" />
        {/* пол и подсценье */}
        <path d="M60 520 H1140" strokeWidth="2" />
        <path d="M440 520 V600 H760 V520" stroke="#7d8591" strokeDasharray="5 5" />
        {/* портал сцены */}
        <path d="M424 520 V196 M776 520 V196 M410 196 H790 M410 212 H790" stroke="#e6e9ee" strokeWidth="2" />
      </g>

      {/* занавес: опускается в проём */}
      <g clipPath="url(#loft)">
        <g ref={r.curtain} transform={done ? 'translate(0 390)' : undefined}>
          <rect x="440" y="-170" width="320" height="360" fill="rgb(255 106 19 / 0.10)" stroke="#ff6a13" strokeWidth="1.5" />
          <rect x="440" y="174" width="320" height="16" fill="url(#hz)" />
          {Array.from({ length: 7 }, (_, i) => <line key={i} x1={440 + (i + 1) * 40} y1="-170" x2={440 + (i + 1) * 40} y2="174" stroke="#ff6a13" opacity="0.25" />)}
        </g>
      </g>

      {/* створки люка */}
      <g ref={r.hl} transform={done ? 'rotate(-78 440 518)' : undefined}><rect x="440" y="514" width="160" height="8" fill="#ff6a13" /></g>
      <g ref={r.hr} transform={done ? 'rotate(78 760 518)' : undefined}><rect x="600" y="514" width="160" height="8" fill="#ff6a13" /></g>
      <g stroke="#ff6a13" strokeWidth="1" fill="none" opacity="0.5"><path d="M440 520 V600 M760 520 V600" /></g>

      <g ref={r.tags} fontFamily="var(--font-jb)" fontSize="13" fill="#c9ced6" letterSpacing="1.4" opacity={done ? 1 : 0}>
        <g><line x1="760" y1="90" x2="760" y2="140" stroke="#ff6a13" /><text x="772" y="86">ПРОТИВОПОЖАРНЫЙ ЗАНАВЕС</text></g>
        <g><line x1="600" y1="552" x2="880" y2="552" stroke="#ff6a13" /><text x="890" y="556">ЛЮК В ПОЛУ СЦЕНЫ</text></g>
      </g>
    </svg>
  );
}

export function GelendzhikScene() {
  const desktop = useMedia('(min-width: 768px)');
  const reduce = useReducedMotion();
  const animate = desktop && !reduce;
  const outer = useRef<HTMLDivElement>(null);
  const curtain = useRef<SVGGElement>(null);
  const hl = useRef<SVGGElement>(null);
  const hr = useRef<SVGGElement>(null);
  const tags = useRef<SVGGElement>(null);
  const cols = useRef<Array<HTMLDivElement | null>>([]);
  const bar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate || !outer.current) return;
    gsap.registerPlugin(ScrollTrigger);
    const ctx = gsap.context(() => {
      gsap.set(cols.current, { opacity: 0.18, y: 24 });
      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: outer.current, start: 'top top', end: 'bottom bottom', scrub: 0.6,
          onUpdate: (s) => bar.current && (bar.current.style.transform = `scaleX(${s.progress})`),
        },
      });
      tl.to(cols.current[0], { opacity: 1, y: 0, duration: 0.06 }, 0.02)
        .to(hl.current, { rotation: -78, svgOrigin: '440 518', duration: 0.22 }, 0.14)
        .to(hr.current, { rotation: 78, svgOrigin: '760 518', duration: 0.22 }, 0.14)
        .to(cols.current[1], { opacity: 1, y: 0, duration: 0.06 }, 0.3)
        .to(tags.current, { opacity: 1, duration: 0.08 }, 0.34)
        .to(curtain.current, { y: 390, duration: 0.38 }, 0.4)
        .to(cols.current[2], { opacity: 1, y: 0, duration: 0.06 }, 0.8)
        .to({}, { duration: 0.14 }, 0.86);
    }, outer);
    return () => ctx.revert();
  }, [animate]);

  const art = <Arena done={!animate} r={{ curtain, hl, hr, tags }} />;

  const columns = (
    <div className="grid gap-px border border-grid bg-grid md:grid-cols-3">
      {COLS.map((c, i) => (
        <div key={c.k} ref={(el) => { cols.current[i] = el; }} className="bg-carbon/95 p-5 backdrop-blur md:p-6">
          <p className="mono mb-3 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-mute"><span className="text-signal">0{i + 1}</span>{c.k}</p>
          <p className="text-[15px] leading-relaxed text-alu">{c.ph ? <span className="ph">{c.v}</span> : typograph(c.v)}</p>
        </div>
      ))}
    </div>
  );

  const head = (
    <div className="mb-5 md:mb-6">
      <p className="mono mb-4 flex items-center gap-3 text-[12px] uppercase tracking-[0.16em] text-mute"><span className="text-signal">08</span><span className="h-px w-8 bg-grid" />Кейс</p>
      <h2 className="text-[clamp(1.8rem,3.4vw,3rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white">Геленджик Арена: люк, через который опускается занавес.</h2>
    </div>
  );

  if (!animate) {
    return (
      <section id="gelendzhik" className="container-x scroll-mt-20 py-20 md:py-28">
        {head}
        <div className="bg-blueprint-fine mb-px aspect-[1200/640] w-full overflow-hidden border border-grid bg-carbon">{art}</div>
        {columns}
      </section>
    );
  }

  return (
    <section id="gelendzhik" aria-label="Геленджик Арена" className="relative">
      <div ref={outer} className="relative h-[300svh]">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden pb-6 pt-24">
          <div className="container-x">
            {head}
            <div className="bg-blueprint-fine relative mb-px h-[38svh] w-full overflow-hidden border border-grid bg-carbon">{art}</div>
            {columns}
            <div className="mt-5 h-px bg-grid"><div ref={bar} className="h-px origin-left scale-x-0 bg-signal" /></div>
          </div>
        </div>
      </div>
    </section>
  );
}
