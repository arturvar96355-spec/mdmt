'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { sections, series, taskLabels, DATA_PH, type SectionKey } from '@/content/series';
import { SectionHead } from '@/components/ui/SectionHead';
import { SectionIcon } from '@/components/ui/SectionIcon';
import { openConfigurator } from '@/lib/config-store';
import { cn } from '@/lib/utils';

type Task = keyof typeof taskLabels;

function Chip({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      className={cn('mono min-h-11 border px-3.5 text-[13px] transition-colors', on ? 'border-signal bg-signal text-void' : 'border-grid text-alu hover:border-mute hover:text-white')}
    >
      {children}
    </button>
  );
}

export function Catalog() {
  const [sec, setSec] = useState<SectionKey | null>(null);
  const [task, setTask] = useState<Task | null>(null);
  const [code, setCode] = useState<string | null>(null);

  // фильтры живут в URL
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const s = p.get('section') as SectionKey | null;
    const t = p.get('task') as Task | null;
    const c = p.get('series');
    if (s && sections.some((x) => x.key === s)) setSec(s);
    if (t && t in taskLabels) setTask(t);
    if (c && series.some((x) => x.code === c)) setCode(c);
  }, []);
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    sec ? p.set('section', sec) : p.delete('section');
    task ? p.set('task', task) : p.delete('task');
    code ? p.set('series', code) : p.delete('series');
    const q = p.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${q ? `?${q}` : ''}${window.location.hash}`);
  }, [sec, task, code]);

  const list = useMemo(
    () => series.filter((s) => (!sec || s.sections.includes(sec)) && (!task || s.task.includes(task)) && (!code || s.code === code)),
    [sec, task, code],
  );

  return (
    <section id="catalog" className="container-x scroll-mt-20 py-24 md:py-36">
      <SectionHead n="05" kicker="Каталог ферм" title={<>Семь серий. <span className="text-mute">Семь сечений.</span></>} lead="Выберите серию, сечение и задачу — каталог покажет подходящие фермы. Любую из них можно собрать в 3D выше." />

      <div className="mb-10 grid gap-6 border-y border-grid py-6 lg:grid-cols-3">
        <div>
          <p className="label mb-3">Серия</p>
          <div className="flex flex-wrap gap-2">
            <Chip on={!code} onClick={() => setCode(null)}>Все</Chip>
            {series.map((s) => <Chip key={s.code} on={code === s.code} onClick={() => setCode(code === s.code ? null : s.code)}>{s.code}</Chip>)}
          </div>
        </div>
        <div>
          <p className="label mb-3">Сечение</p>
          <div className="flex flex-wrap gap-2">
            <Chip on={!sec} onClick={() => setSec(null)}>Все</Chip>
            {sections.map((s) => <Chip key={s.key} on={sec === s.key} onClick={() => setSec(sec === s.key ? null : s.key)}>{s.label}</Chip>)}
          </div>
        </div>
        <div>
          <p className="label mb-3">Задача <span className="ph normal-case tracking-normal">[соответствие — уточнить]</span></p>
          <div className="flex flex-wrap gap-2">
            <Chip on={!task} onClick={() => setTask(null)}>Все</Chip>
            {(Object.keys(taskLabels) as Task[]).map((t) => <Chip key={t} on={task === t} onClick={() => setTask(task === t ? null : t)}>{taskLabels[t]}</Chip>)}
          </div>
        </div>
      </div>

      <motion.ul layout className="grid gap-px border border-grid bg-grid sm:grid-cols-2 lg:grid-cols-4">
        <AnimatePresence mode="popLayout">
          {list.map((s) => (
            <motion.li
              layout
              key={s.code}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex min-h-[300px] flex-col justify-between bg-carbon p-6 transition-colors hover:bg-carbon-2"
            >
              <div className="flex items-start justify-between">
                <span className="mono text-[40px] font-medium leading-none tracking-[-0.04em] text-white">{s.code}</span>
                <span className="mono text-[10px] uppercase tracking-[0.14em] text-mute">серия</span>
              </div>
              <div className="my-6 flex flex-wrap gap-1.5">
                {s.sections.map((k) => (
                  <span key={k} title={sections.find((x) => x.key === k)!.label} className={cn('grid size-12 place-items-center border', sec === k ? 'border-signal' : 'border-grid')}>
                    <SectionIcon kind={k} size={34} active={sec === k} />
                  </span>
                ))}
              </div>
              <div>
                <p className="mono mb-1 text-[11px] uppercase tracking-[0.12em] text-mute">{s.task.map((t) => taskLabels[t]).join(' · ')}</p>
                <p className="mb-4 text-[13px]"><span className="ph">{DATA_PH}</span></p>
                <a href={`/catalog/${s.slug}/`} className="mono mb-2 flex min-h-11 w-full items-center justify-between border border-transparent px-4 text-[12px] uppercase tracking-[0.14em] text-alu transition-colors hover:text-white">
                  Страница серии <span aria-hidden>→</span>
                </a>
                <button
                  onClick={() => openConfigurator({ series: s.code, section: sec && s.sections.includes(sec) ? sec : s.sections[0] })}
                  className="mono flex min-h-11 w-full items-center justify-between border border-grid px-4 text-[12px] uppercase tracking-[0.14em] text-white transition-colors group-hover:border-signal group-hover:text-signal"
                >
                  Собрать в 3D <span aria-hidden>→</span>
                </button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>
      {list.length === 0 && <p className="mono mt-8 text-mute">По этим условиям серий нет. Снимите один из фильтров.</p>}
      <p className="mono mt-6 text-[12px] text-mute">Показаны {list.length} из {series.length}. В каталоге завода есть и другие серии.</p>
    </section>
  );
}
