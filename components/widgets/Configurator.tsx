'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import { motion } from 'motion/react';
import { sections, series, DATA_PH } from '@/content/series';
import { site } from '@/content/site';
import { configStore, useConfig } from '@/lib/config-store';
import { buildTruss } from '@/lib/truss/build';
import { trussToSvg } from '@/lib/truss/iso';
import { hasWebGL, useMedia, useReducedMotion } from '@/lib/hooks';
import { SectionIcon } from '@/components/ui/SectionIcon';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

const ConfigCanvas = dynamic(() => import('@/components/three/ConfigCanvas'), { ssr: false });

const VIEW_LABEL = { iso: '3/4', front: 'Спереди', top: 'Сверху' } as const;

function SvgConfig({ cfg }: { cfg: ReturnType<typeof useConfig> }) {
  const s = series.find((x) => x.code === cfg.series)!;
  const lines = useMemo(() => trussToSvg(buildTruss({ section: cfg.section, scale: s.scale, length: cfg.length }), 900, 460, cfg.view === 'front' ? 0 : 0.55), [cfg, s.scale]);
  return (
    <svg viewBox="0 0 900 460" className="h-full w-full" role="img" aria-label={`Схема фермы ${cfg.series}, сечение ${cfg.section}. Размеры условные`}>
      {lines.map((l, i) => (
        <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.chord ? '#e6e9ee' : '#8c93a0'} strokeWidth={l.w} strokeLinecap="round" />
      ))}
    </svg>
  );
}

function Seg<T extends string>({ label, value, options, onChange }: { label: string; value: T; options: Array<{ v: T; l: string; icon?: React.ReactNode }>; onChange: (v: T) => void }) {
  return (
    <fieldset className="min-w-0">
      <legend className="label mb-3">{label}</legend>
      <div role="radiogroup" className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.v}
            role="radio"
            aria-checked={value === o.v}
            onClick={() => onChange(o.v)}
            className={cn(
              'mono flex min-h-11 items-center gap-2 border px-3 text-[13px] transition-colors',
              value === o.v ? 'border-signal bg-signal/10 text-white' : 'border-grid text-alu hover:border-mute',
            )}
          >
            {o.icon}
            {o.l}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

export function Configurator() {
  const cfg = useConfig();
  const s = series.find((x) => x.code === cfg.series)!;
  const sec = sections.find((x) => x.key === cfg.section)!;
  const reduce = useReducedMotion();
  const touch = useMedia('(pointer: coarse)');
  const [gl, setGl] = useState(false);
  const [near, setNear] = useState(false);
  const box = useRef<HTMLDivElement>(null);

  useEffect(() => { if (near) setGl(hasWebGL()); }, [near]);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const sr = p.get('cfg');
    const [cs, ck] = (sr ?? '').split('.');
    if (cs && series.some((x) => x.code === cs.toUpperCase())) {
      const ser = series.find((x) => x.code === cs.toUpperCase())!;
      configStore.set({ series: ser.code, section: (ser.sections as string[]).includes(ck) ? (ck as never) : ser.sections[0] });
    }
  }, []);
  useEffect(() => {
    if (!box.current) return;
    const io = new IntersectionObserver(([e]) => setNear(e.isIntersecting), { rootMargin: '300px' });
    io.observe(box.current);
    return () => io.disconnect();
  }, []);

  // если выбранное сечение недоступно в серии — берём первое доступное
  useEffect(() => {
    if (!s.sections.includes(cfg.section)) configStore.set({ section: s.sections[0] });
  }, [s, cfg.section]);

  const set = configStore.set;
  const use3d = gl && !reduce;

  return (
    <div className="grid gap-px border border-grid bg-grid lg:grid-cols-12">
      {/* холст */}
      <div ref={box} className="relative min-h-[360px] bg-carbon sm:min-h-[460px] lg:col-span-8 lg:min-h-[620px]">
        <div className="bg-blueprint-fine absolute inset-0 opacity-70" aria-hidden />
        <div className="absolute inset-0 grain" aria-hidden />
        <div className="absolute inset-0">
          {use3d ? (near && <ConfigCanvas cfg={cfg} touch={touch} />) : <div className="p-6"><SvgConfig cfg={cfg} /></div>}
        </div>
        <div className="mono pointer-events-none absolute left-4 top-4 text-[11px] uppercase tracking-[0.14em] text-mute">
          {cfg.series} / {sec.code} / L={Math.round(cfg.length * 1000)}
        </div>
        <div className="mono pointer-events-none absolute bottom-4 left-4 text-[10px] uppercase tracking-[0.14em] text-mute">
          Схема. Размеры условные{use3d ? ' · потяните, чтобы повернуть' : ''}
        </div>
      </div>

      {/* панель */}
      <div className="flex flex-col gap-7 bg-carbon p-6 sm:p-8 lg:col-span-4">
        <Seg
          label="Серия"
          value={cfg.series}
          options={series.map((x) => ({ v: x.code, l: x.code }))}
          onChange={(v) => set({ series: v })}
        />
        <Seg
          label="Сечение"
          value={cfg.section}
          options={sections.filter((x) => s.sections.includes(x.key)).map((x) => ({ v: x.key, l: x.label, icon: <SectionIcon kind={x.key} size={22} active={x.key === cfg.section} /> }))}
          onChange={(v) => set({ section: v })}
        />
        <div>
          <label htmlFor="len" className="label mb-3 flex justify-between">
            <span>Длина секции, условно</span>
            <span className="text-white">{cfg.length.toFixed(1).replace('.', ',')} м</span>
          </label>
          <input
            id="len"
            type="range"
            min={0.5}
            max={4}
            step={0.5}
            value={cfg.length}
            onChange={(e) => set({ length: +e.target.value })}
            className="w-full accent-[#ff6a13]"
          />
          <p className="mt-2 text-[12px] text-mute"><span className="ph">[диапазон — из каталога]</span></p>
        </div>
        <Seg label="Вид" value={cfg.view} options={(['iso', 'front', 'top'] as const).map((v) => ({ v, l: VIEW_LABEL[v] }))} onChange={(v) => set({ view: v })} />

        <dl className="mono mt-auto divide-y divide-grid border-y border-grid text-[13px]">
          {[
            ['Серия', cfg.series],
            ['Сечение', sec.label],
            ['Длина', `${cfg.length.toFixed(1).replace('.', ',')} м (усл.)`],
            ['Сплав', site.alloys.join(' / ')],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-mute">{k}</dt><dd className="text-right text-white">{v}</dd></div>
          ))}
          {['Диаметр пояса', 'Толщина стенки', 'Допустимые нагрузки', 'Масса, кг/м'].map((k) => (
            <div key={k} className="flex justify-between gap-4 py-2.5"><dt className="text-mute">{k}</dt><dd className="text-right"><span className="ph">{DATA_PH}</span></dd></div>
          ))}
        </dl>

        <motion.div whileTap={{ scale: 0.98 }}>
          <Button
            className="w-full"
            href={`#rfq`}
            onClick={() => undefined}
          >
            Запросить расчёт с этими параметрами
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
