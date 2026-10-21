import type { Metadata } from 'next';
import { Button } from '@/components/ui/Button';
import { SectionIcon } from '@/components/ui/SectionIcon';
import { sections } from '@/content/series';

export const metadata: Metadata = { title: 'Дизайн-система — МДМ-Технология' };

const colors = [
  ['void', '#08090B'], ['carbon', '#121418'], ['grid', '#22262D'], ['alu', '#C9CED6'],
  ['mute', '#7D8591'], ['signal', '#FF6A13'], ['white', '#F4F5F7'],
];

export default function Styleguide() {
  return (
    <main className="container-x space-y-20 py-24">
      <header>
        <p className="label mb-4">Дизайн-система</p>
        <h1 className="text-[clamp(2.2rem,6vw,5rem)] font-bold leading-none text-white">Инженерная ночь</h1>
      </header>

      <section>
        <p className="label mb-5">Цвета</p>
        <div className="grid grid-cols-2 gap-px border border-grid bg-grid sm:grid-cols-4 lg:grid-cols-7">
          {colors.map(([n, c]) => (
            <div key={n} className="bg-void p-4"><div className="mb-3 h-16 border border-grid" style={{ background: c }} /><p className="mono text-[12px] text-white">{n}</p><p className="mono text-[11px] text-mute">{c}</p></div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <p className="label mb-5">Типографика</p>
        <p className="text-[4rem] font-bold leading-none tracking-[-0.035em] text-white">Golos Text 700</p>
        <p className="text-[17px] text-alu">Тело текста — Golos Text 400, 17 px, межстрочный 1,6.</p>
        <p className="mono text-[13px] text-alu">T52 / Q / L=8000 — JetBrains Mono, технические подписи</p>
        <p className="mono text-[clamp(3rem,8vw,6rem)] font-medium leading-none text-white">2004<span className="text-signal">.</span></p>
      </section>

      <section>
        <p className="label mb-5">Кнопки и заглушки</p>
        <div className="flex flex-wrap items-center gap-4">
          <Button>Запросить расчёт</Button>
          <Button variant="ghost">Каталог ферм</Button>
          <span className="ph">[данные — из каталога МДМ]</span>
        </div>
        <div className="hazard mt-8 h-2 w-64" />
      </section>

      <section>
        <p className="label mb-5">Сечения</p>
        <div className="flex flex-wrap gap-4">
          {sections.map((s) => <div key={s.key} className="border border-grid p-3 text-center"><SectionIcon kind={s.key} size={56} /><p className="mono mt-2 text-[11px] text-mute">{s.label}</p></div>)}
        </div>
      </section>
    </main>
  );
}
