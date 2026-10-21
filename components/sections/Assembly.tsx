'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LazyStage } from '@/components/three/LazyStage';
import { sceneState } from '@/lib/scene-state';
import { hasWebGL, useMedia, useReducedMotion } from '@/lib/hooks';
import { buildTruss } from '@/lib/truss/build';
import { trussToSvg } from '@/lib/truss/iso';
import { series } from '@/content/series';
import { EASE } from '@/components/motion/Reveal';

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (a: number, b: number, x: number) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const CALLOUTS = [
  { title: 'Пояс', text: 'Несущая труба из алюминиевого сплава АД35 Т1 или 6082 Т6', side: 'r' },
  { title: 'Раскос', text: 'Трубы-диагонали, привариваются в узлах и держат сечение', side: 'l' },
  { title: 'Соединитель', text: 'Безлюфтовые конусные соединители на торцах секции', side: 'r' },
] as const;

const CAPTIONS = [
  { n: '03', k: 'Устройство', t: 'Ферма — это пояса, раскосы и соединители.', d: 'Каждый узел сварен и проверен. Разберите ферму взглядом: из чего она состоит.' },
  { n: '03', k: 'Применение', t: 'Из ферм собирается сцена.', d: 'Две опоры и ригель — основа портала. Одна и та же секция работает и стойкой, и балкой.' },
];

function MobileAssembly() {
  const s = series.find((x) => x.code === 'T52')!;
  const lines = trussToSvg(buildTruss({ section: 'square', scale: s.scale * 1.55, length: 5 }), 800, 380, 0.5);
  const items = [
    { t: 'Пояса и раскосы', d: 'Несущие трубы из сплавов АД35 Т1 и 6082 Т6, между ними — диагонали.' },
    { t: 'Соединители', d: 'Безлюфтовые конусные соединители на торцах секции.' },
    { t: 'Портал', d: 'Две опоры и ригель — основа сценической конструкции.' },
  ];
  return (
    <section className="container-x py-20" aria-label="Устройство фермы">
      <p className="mono mb-5 text-[12px] uppercase tracking-[0.16em] text-mute"><span className="text-signal">03</span> — Устройство</p>
      <h2 className="mb-10 text-[2rem] font-bold leading-[1.05] text-white">Из секций ферм собирается сцена.</h2>
      <div className="grid gap-px border border-grid bg-grid">
        {items.map((it, i) => (
          <div key={it.t} className="bg-carbon p-5">
            <div className="bg-blueprint-fine relative mb-4 aspect-[2/1] overflow-hidden border border-grid">
              <svg viewBox="0 0 800 380" className="absolute inset-0 h-full w-full" aria-hidden>
                {i === 2 ? (
                  <g stroke="#c9ced6" strokeWidth="10" strokeLinecap="square" fill="none">
                    <path d="M180 330 V110 H620 V330" />
                    <path d="M180 110 H620" stroke="#ff6a13" strokeWidth="3" transform="translate(0 22)" />
                  </g>
                ) : (
                  lines.map((l, k) => <line key={k} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.chord ? '#e6e9ee' : '#8c93a0'} strokeWidth={l.w} strokeLinecap="round" opacity={i === 1 && l.chord ? 0.35 : 1} />)
                )}
              </svg>
              <span className="mono absolute left-3 top-3 text-[11px] text-signal">0{i + 1}</span>
            </div>
            <h3 className="text-[19px] font-semibold text-white">{it.t}</h3>
            <p className="mt-1.5 text-[15px] text-alu">{it.d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function Assembly() {
  const desktop = useMedia('(min-width: 768px)');
  const reduce = useReducedMotion();
  const [gl, setGl] = useState(false);
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState(0);
  const outer = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const lab = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => { if (desktop) setGl(hasWebGL()); }, [desktop]);

  const full = desktop && gl && !reduce;

  useEffect(() => {
    if (!full) return;
    let raf = 0;
    const loop = () => {
      const v = smooth(0.55, 0.9, sceneState.explode) * (1 - smooth(0, 0.2, sceneState.portal));
      lab.current.forEach((el, i) => {
        const p = sceneState.labels[i];
        if (!el || !p) return;
        el.style.opacity = String(v);
        el.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
      });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [full]);

  useEffect(() => {
    if (!full || !outer.current) return;
    gsap.registerPlugin(ScrollTrigger);
    sceneState.explode = 0;
    sceneState.portal = 0;
    const st = ScrollTrigger.create({
      trigger: outer.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.5,
      onToggle: (s) => setActive(s.isActive),
      onUpdate: (self) => {
        const u = self.progress;
        sceneState.explode = smooth(0.02, 0.3, u);
        sceneState.portal = smooth(0.46, 0.96, u);
        setPhase(u > 0.5 ? 1 : 0);
        if (bar.current) bar.current.style.transform = `scaleX(${u})`;
      },
    });
    // подгружаем сцену чуть заранее
    const pre = ScrollTrigger.create({ trigger: outer.current, start: 'top bottom+=600', end: 'bottom top', onToggle: (s) => setActive(s.isActive) });
    return () => {
      st.kill();
      pre.kill();
      sceneState.explode = 0;
      sceneState.portal = 0;
    };
  }, [full]);

  if (!full) return <MobileAssembly />;

  const cap = CAPTIONS[phase];
  return (
    <section aria-label="Устройство фермы" className="relative">
      <div ref={outer} className="relative h-[360svh]">
      <div className="sticky top-0 h-[100svh] w-full overflow-hidden bg-void">
        <div className="bg-blueprint absolute inset-0 opacity-50" aria-hidden />
        <div className="absolute inset-0">{active && <LazyStage mode="assembly" auto={false} />}</div>
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_70%_at_70%_50%,transparent,#08090b_100%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 left-0 w-[46%] bg-gradient-to-r from-void via-void/80 to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-0 hidden overflow-hidden lg:block" aria-hidden>
          {CALLOUTS.map((c, i) => (
            <div key={c.title} ref={(el) => { lab.current[i] = el; }} className="absolute left-0 top-0 opacity-0 will-change-transform">
              <div className={`absolute top-0 flex w-[220px] items-start gap-3 ${c.side === 'l' ? '-translate-x-full flex-row-reverse text-right' : ''}`}>
                <span className="mt-[7px] block h-px w-12 shrink-0 bg-signal" />
                <span>
                  <span className="mono block text-[11px] uppercase tracking-[0.16em] text-signal">{c.title}</span>
                  <span className="mt-1 block text-[13px] leading-snug text-alu">{c.text}</span>
                </span>
              </div>
              <span className="absolute -left-[3px] -top-[3px] block size-[7px] rounded-full bg-signal" />
            </div>
          ))}
        </div>

        <div className="container-x pointer-events-none absolute inset-0 flex flex-col justify-center">
          <AnimatePresence mode="wait">
            <motion.div key={phase} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.6, ease: EASE }} className="max-w-md">
              <p className="mono mb-5 flex items-center gap-3 text-[12px] uppercase tracking-[0.16em] text-mute"><span className="text-signal">{cap.n}</span><span className="h-px w-8 bg-grid" />{cap.k}</p>
              <h2 className="text-[clamp(2rem,3.8vw,3.4rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white">{cap.t}</h2>
              <p className="mt-5 text-[17px] leading-relaxed text-alu">{cap.d}</p>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="absolute inset-x-0 bottom-0 container-x pb-8">
          <div className="mono mb-2 flex justify-between text-[10px] uppercase tracking-[0.16em] text-mute"><span>Ферма</span><span>Портал</span></div>
          <div className="h-px bg-grid"><div ref={bar} className="h-px origin-left scale-x-0 bg-signal" /></div>
        </div>
      </div>
      </div>
    </section>
  );
}
