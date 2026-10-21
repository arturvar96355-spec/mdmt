'use client';

import { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Paperclip } from 'lucide-react';
import { site } from '@/content/site';
import { sections } from '@/content/series';
import { useConfig } from '@/lib/config-store';
import { TASKS, mailtoHref, rfqSchema, rfqText, type Rfq } from '@/lib/rfq';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';

const field = 'w-full border border-grid bg-void px-4 min-h-12 text-[16px] text-white placeholder:text-mute/70 focus:border-signal focus:outline-none';

function Check() {
  return (
    <svg viewBox="0 0 80 80" className="size-20" aria-hidden>
      <motion.rect x="4" y="4" width="72" height="72" fill="none" stroke="#ff6a13" strokeWidth="2" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.7 }} />
      <motion.path d="M22 41 L35 54 L58 27" fill="none" stroke="#f4f5f7" strokeWidth="3" strokeLinecap="square" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, delay: 0.6 }} />
    </svg>
  );
}

export function RfqSection() {
  const cfg = useConfig();
  const [task, setTask] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState<{ text: string } | null>(null);
  const [file, setFile] = useState('');
  const form = useRef<HTMLFormElement>(null);
  const [useCfg, setUseCfg] = useState(true);

  const cfgLine = useMemo(() => {
    const sec = sections.find((s) => s.key === cfg.section)!;
    return `${cfg.series} / ${sec.label} / ${cfg.length.toFixed(1).replace('.', ',')} м (условно)`;
  }, [cfg]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(form.current!).entries()) as Record<string, string>;
    const parsed = rfqSchema.safeParse({ ...fd, task, config: useCfg ? cfgLine : undefined });
    if (!parsed.success) {
      const map: Record<string, string> = {};
      parsed.error.issues.forEach((i) => (map[String(i.path[0])] = i.message));
      setErrors(map);
      form.current?.querySelector<HTMLElement>('[data-err="1"]')?.focus();
      return;
    }
    setErrors({});
    const text = rfqText(parsed.data as Rfq, file);
    setDone({ text });
    window.location.href = mailtoHref(text);
  };

  const err = (k: string) => errors[k] && <p role="alert" className="mono mt-1.5 text-[12px] text-signal">{errors[k]}</p>;

  return (
    <section id="rfq" className="relative isolate scroll-mt-16 overflow-hidden border-t border-grid py-24 md:py-36">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_90%_at_85%_100%,rgb(255_106_19/0.35),rgb(120_40_5/0.12)_45%,transparent_75%)]" aria-hidden />
      <div className="bg-blueprint-fine absolute inset-0 -z-10 opacity-40" aria-hidden />
      <div className="hazard absolute inset-x-0 top-0 h-1.5" aria-hidden />
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <p className="mono mb-6 flex items-center gap-3 text-[12px] uppercase tracking-[0.16em] text-mute"><span className="text-signal">12</span><span className="h-px w-8 bg-grid" />Запрос расчёта</p>
          <h2 className="text-[clamp(2.2rem,5vw,4.4rem)] font-bold leading-[1] tracking-[-0.03em] text-white">Опишите задачу — посчитаем.</h2>
          <p className="mt-6 max-w-md text-[17px] leading-relaxed text-alu">Размеры, нагрузка, сроки и площадка — этого достаточно, чтобы инженеры вернулись с вопросами или с расчётом. Чертёж можно приложить к письму.</p>
          <dl className="mono mt-10 space-y-2 text-[13px] text-alu">
            <div><dt className="inline text-mute">Телефон: </dt><dd className="inline"><a className="text-white hover:text-signal" href={site.phoneHref}>{site.phone}</a></dd></div>
            <div><dt className="inline text-mute">Почта: </dt><dd className="inline"><a className="text-white hover:text-signal" href={`mailto:${site.email}`}>{site.email}</a></dd></div>
            <div><dt className="inline text-mute">Telegram: </dt><dd className="inline"><a className="text-white hover:text-signal" href={site.telegram} target="_blank" rel="noopener noreferrer">@mdmtechnology</a></dd></div>
            <div><dt className="inline text-mute">Работаем: </dt><dd className="inline">{site.hours}</dd></div>
          </dl>
        </div>

        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {done ? (
              <motion.div key="ok" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-grid bg-void/80 p-8 backdrop-blur sm:p-12">
                <Check />
                <h3 className="mt-8 text-[28px] font-bold text-white">Письмо подготовлено</h3>
                <p className="mt-3 max-w-md text-alu">Откроется почтовая программа с готовым текстом. Если ничего не открылось — скопируйте текст и отправьте на {site.email} или в Telegram.</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Button onClick={() => navigator.clipboard?.writeText(done.text)} variant="ghost" arrow={false}>Скопировать текст</Button>
                  <Button href={site.telegram} external variant="ghost">Открыть Telegram</Button>
                  <Button onClick={() => setDone(null)} variant="ghost" arrow={false}>Изменить</Button>
                </div>
              </motion.div>
            ) : (
              <motion.form key="form" ref={form} onSubmit={submit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid gap-6 border border-grid bg-void/80 p-6 backdrop-blur sm:p-10">
                <fieldset>
                  <legend className="label mb-3">Тип задачи</legend>
                  <div className="flex flex-wrap gap-2" role="radiogroup">
                    {TASKS.map((t) => (
                      <button key={t} type="button" role="radio" aria-checked={task === t} onClick={() => setTask(t)} className={cn('mono min-h-11 border px-4 text-[13px] transition-colors', task === t ? 'border-signal bg-signal text-void' : 'border-grid text-alu hover:border-mute')}>{t}</button>
                    ))}
                  </div>
                  {err('task')}
                </fieldset>

                <fieldset>
                  <legend className="label mb-3">Размеры, м (ширина × глубина × высота)</legend>
                  <div className="grid grid-cols-3 gap-3">
                    <input name="w" inputMode="decimal" placeholder="Ш" aria-label="Ширина, м" className={field} />
                    <input name="d" inputMode="decimal" placeholder="Г" aria-label="Глубина, м" className={field} />
                    <input name="h" inputMode="decimal" placeholder="В" aria-label="Высота, м" className={field} />
                  </div>
                </fieldset>

                <div className="grid gap-3 sm:grid-cols-3">
                  <label className="block"><span className="label mb-2 block">Нагрузка, кг</span><input name="load" inputMode="numeric" placeholder="если известна" className={field} /></label>
                  <label className="block"><span className="label mb-2 block">Сроки</span><input name="date" type="date" className={field} /></label>
                  <label className="block"><span className="label mb-2 block">Город / площадка</span><input name="place" className={field} /></label>
                </div>

                <label className="flex min-h-12 cursor-pointer items-center gap-3 border border-dashed border-grid px-4 text-[14px] text-alu hover:border-mute">
                  <Paperclip className="size-4 shrink-0 text-signal" aria-hidden />
                  <span className="truncate">{file || 'Приложить чертёж или эскиз'}</span>
                  <input type="file" className="sr-only" onChange={(e) => setFile(e.target.files?.[0]?.name ?? '')} />
                </label>
                <p className="-mt-3 text-[12px] text-mute">В демо-версии файл не отправляется — приложите его в письме.</p>

                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block"><span className="label mb-2 block">Компания</span><input name="company" autoComplete="organization" aria-invalid={!!errors.company} data-err={errors.company ? 1 : undefined} className={field} />{err('company')}</label>
                  <label className="block"><span className="label mb-2 block">Имя</span><input name="name" autoComplete="name" aria-invalid={!!errors.name} data-err={errors.name ? 1 : undefined} className={field} />{err('name')}</label>
                  <label className="block"><span className="label mb-2 block">Телефон</span><input name="phone" type="tel" autoComplete="tel" placeholder="+7" aria-invalid={!!errors.phone} data-err={errors.phone ? 1 : undefined} className={field} />{err('phone')}</label>
                  <label className="block"><span className="label mb-2 block">E-mail</span><input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} data-err={errors.email ? 1 : undefined} className={field} />{err('email')}</label>
                </div>

                <label className="flex cursor-pointer items-start gap-3 text-[14px] text-alu">
                  <input type="checkbox" checked={useCfg} onChange={(e) => setUseCfg(e.target.checked)} className="mt-1 size-4 accent-[#ff6a13]" />
                  <span>Добавить параметры из конфигуратора: <span className="mono text-white">{cfgLine}</span></span>
                </label>

                <div>
                  <Button type="submit" className="w-full sm:w-auto">Отправить запрос</Button>
                  <p className="mt-4 text-[12px] leading-snug text-mute">Нажимая кнопку, Вы соглашаетесь на обработку персональных данных. <a href="/privacy/" className="hit underline underline-offset-2 hover:text-white">Политика</a> — <span className="ph">[политика — от клиента]</span></p>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
