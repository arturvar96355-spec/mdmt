'use client';

import { motion } from 'motion/react';
import { stages } from '@/content/stages';
import { SectionHead } from '@/components/ui/SectionHead';
import { Button } from '@/components/ui/Button';
import { Reveal } from '@/components/motion/Reveal';
import { Typed } from '@/components/motion/Typed';

const PX = 38; // px на метр — один масштаб для всех комплексов
const W = 400, H = 300, X0 = 28, Y0 = 250;
const fmt = (n: number) => n.toFixed(2).replace('.', ',');

function Plan({ width, depth, i }: { width: number; depth: number; i: number }) {
  const w = width * PX, d = depth * PX;
  const draw = (delay: number) => ({
    initial: { pathLength: 0 },
    whileInView: { pathLength: 1 },
    viewport: { once: true, amount: 0.4 },
    transition: { duration: 1.1, delay: delay + i * 0.12, ease: [0.22, 1, 0.36, 1] as const },
  });
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label={`План комплекса ${width} на ${depth} метра`}>
      {/* сетка 1 м */}
      {Array.from({ length: 11 }, (_, k) => <line key={`v${k}`} x1={X0 + k * PX} y1={Y0 - 8 * PX} x2={X0 + k * PX} y2={Y0} stroke="#22262d" strokeWidth="1" />)}
      {Array.from({ length: 9 }, (_, k) => <line key={`h${k}`} x1={X0} y1={Y0 - k * PX} x2={X0 + 10 * PX} y2={Y0 - k * PX} stroke="#22262d" strokeWidth="1" />)}
      <motion.rect x={X0} y={Y0 - d} width={w} height={d} fill="rgb(255 106 19 / 0.07)" stroke="#ff6a13" strokeWidth="1.5" {...draw(0)} />
      {/* выносные размерные линии */}
      <motion.path d={`M ${X0} ${Y0 + 22} H ${X0 + w} M ${X0} ${Y0 + 16} V ${Y0 + 28} M ${X0 + w} ${Y0 + 16} V ${Y0 + 28}`} stroke="#c9ced6" strokeWidth="1" fill="none" {...draw(0.5)} />
      <motion.path d={`M ${X0 - 18} ${Y0} V ${Y0 - d} M ${X0 - 24} ${Y0} H ${X0 - 12} M ${X0 - 24} ${Y0 - d} H ${X0 - 12}`} stroke="#c9ced6" strokeWidth="1" fill="none" {...draw(0.6)} />
      <text x={X0 + w / 2} y={Y0 + 44} textAnchor="middle" fill="#f4f5f7" fontSize="13" fontFamily="var(--font-jb)">
        <Typed svg text={`${fmt(width)} м`} delay={900} />
      </text>
      <text x={X0 - 30} y={Y0 - d / 2} textAnchor="middle" fill="#f4f5f7" fontSize="13" fontFamily="var(--font-jb)" transform={`rotate(-90 ${X0 - 30} ${Y0 - d / 2})`}>
        <Typed svg text={`${fmt(depth)} м`} delay={1100} />
      </text>
    </svg>
  );
}

export function Stages() {
  return (
    <section id="stages" className="relative scroll-mt-20 border-t border-grid bg-carbon/40 py-24 md:py-36">
      <div className="container-x">
        <SectionHead n="06" kicker="Сценические комплексы" title="Три каталожных комплекса. Один масштаб." lead="Планы нарисованы в едином масштабе — разницу в площади видно сразу. Под Ваши задачи проектируем комплексы по техническому заданию." />
        <div className="grid gap-px border border-grid bg-grid md:grid-cols-3">
          {stages.map((s, i) => (
            <Reveal key={s.code} delay={i * 0.08} className="flex flex-col bg-void p-6 sm:p-8">
              <div className="mb-6 flex items-baseline justify-between">
                <h3 className="mono text-[34px] font-medium tracking-[-0.03em] text-white">{s.code}</h3>
                <span className="mono text-[12px] text-mute">{(s.width * s.depth).toFixed(1).replace('.', ',')} м²</span>
              </div>
              <Plan width={s.width} depth={s.depth} i={i} />
              <p className="mt-6 flex-1 text-[15px] leading-relaxed text-alu">{s.note}</p>
            </Reveal>
          ))}
        </div>
        <div className="mt-10"><Button href="#rfq">Запросить цену</Button></div>
      </div>
    </section>
  );
}
