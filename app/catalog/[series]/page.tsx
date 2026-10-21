import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { MobileBar } from '@/components/sections/MobileBar';
import { Button } from '@/components/ui/Button';
import { SectionIcon } from '@/components/ui/SectionIcon';
import { sections, series, taskLabels, DATA_PH } from '@/content/series';
import { buildTruss } from '@/lib/truss/build';
import { trussToSvg } from '@/lib/truss/iso';

export function generateStaticParams() {
  return series.map((s) => ({ series: s.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ series: string }> }): Promise<Metadata> {
  const { series: slug } = await params;
  const s = series.find((x) => x.slug === slug);
  return { title: s ? `Фермы серии ${s.code} — МДМ-Технология` : 'Серия' };
}

const ROWS = ['Диаметр пояса', 'Толщина стенки', 'Допустимые нагрузки', 'Максимальный пролёт', 'Масса, кг/м', 'Соединительная система'];

export default async function SeriesPage({ params }: { params: Promise<{ series: string }> }) {
  const { series: slug } = await params;
  const s = series.find((x) => x.slug === slug);
  if (!s) notFound();
  const secs = sections.filter((x) => s.sections.includes(x.key));

  return (
    <>
      <Header />
      <main className="pt-28 md:pt-36">
        <div className="container-x">
          <nav aria-label="Хлебные крошки" className="mono mb-10 flex gap-2 text-[12px] uppercase tracking-[0.14em] text-mute">
            <a href="/" className="hover:text-white">Главная</a><span>/</span>
            <a href="/#catalog" className="hover:text-white">Каталог</a><span>/</span>
            <span className="text-white">{s.code}</span>
          </nav>
          <div className="grid items-end gap-8 border-b border-grid pb-12 lg:grid-cols-12">
            <h1 className="mono text-[clamp(4rem,16vw,13rem)] font-medium leading-[0.85] tracking-[-0.06em] text-white lg:col-span-7">{s.code}</h1>
            <div className="lg:col-span-5">
              <p className="label mb-3">Серия алюминиевых ферм</p>
              <p className="text-[18px] leading-relaxed text-alu">Сплавы АД35 Т1 и 6082 Т6. Задачи: {s.task.map((t) => taskLabels[t].toLowerCase()).join(', ')}.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button href={`/?cfg=${s.code}.${s.sections[0]}#configurator`}>Собрать в 3D</Button>
                <Button href="/#rfq" variant="ghost">Запросить расчёт</Button>
              </div>
            </div>
          </div>
        </div>

        <section className="container-x py-16 md:py-24">
          <p className="label mb-8">Сечения серии {s.code}</p>
          <ul className="grid gap-px border border-grid bg-grid sm:grid-cols-2 lg:grid-cols-3">
            {secs.map((sec) => {
              const lines = trussToSvg(buildTruss({ section: sec.key, scale: s.scale, length: 3 }), 640, 300, 0.55);
              return (
                <li key={sec.key} className="group bg-carbon p-5">
                  <div className="bg-blueprint-fine relative mb-4 aspect-[640/300] overflow-hidden border border-grid">
                    <svg viewBox="0 0 640 300" className="absolute inset-0 h-full w-full" role="img" aria-label={`Схема: ${sec.label} ферма ${s.code}. Размеры условные`}>
                      {lines.map((l, i) => <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke={l.chord ? '#e6e9ee' : '#8c93a0'} strokeWidth={l.w} strokeLinecap="round" />)}
                    </svg>
                    <span className="mono absolute bottom-2 right-3 text-[10px] uppercase tracking-[0.14em] text-mute">Схема. Размеры условные</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <SectionIcon kind={sec.key} size={30} />
                    <div>
                      <h2 className="text-[18px] font-semibold text-white">{sec.label}</h2>
                      <p className="mono text-[11px] uppercase tracking-[0.12em] text-mute">{s.code} / {sec.code}</p>
                    </div>
                    <a href={`/?cfg=${s.code}.${sec.key}#configurator`} className="mono ml-auto text-[11px] uppercase tracking-[0.14em] text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal">В 3D →</a>
                  </div>
                  <p className="mt-3 text-[14px] text-alu">{sec.note}</p>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="container-x pb-24 md:pb-32">
          <p className="label mb-8">Характеристики</p>
          <dl className="mono divide-y divide-grid border-y border-grid text-[14px]">
            {ROWS.map((r) => (
              <div key={r} className="grid gap-2 py-4 sm:grid-cols-[1fr_2fr]">
                <dt className="text-mute">{r}</dt>
                <dd><span className="ph">{DATA_PH}</span></dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 max-w-xl text-[13px] text-mute">Таблицы нагрузок, артикулы и массу секций передаст завод. Мы не публикуем непроверенные инженерные данные.</p>
        </section>
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
