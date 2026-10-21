import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { PageShell } from '@/components/sections/PageShell';
import { GelendzhikScene } from '@/components/sections/Gelendzhik';
import { RfqSection } from '@/components/sections/Rfq';
import { PlaceholderFilm } from '@/components/ui/PlaceholderFilm';
import { Button } from '@/components/ui/Button';
import { projects } from '@/content/projects';

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  return { title: p ? `${p.title} — проект МДМ-Технология` : 'Проект' };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = projects.findIndex((x) => x.slug === slug);
  if (idx < 0) notFound();
  const p = projects[idx];
  const next = projects[(idx + 1) % projects.length];

  return (
    <PageShell>
      <div className="container-x pt-16 md:pt-24">
        <nav aria-label="Хлебные крошки" className="mono mb-8 flex gap-2 text-[12px] uppercase tracking-[0.14em] text-mute">
          <a href="/" className="hover:text-white">Главная</a><span>/</span>
          <a href="/projects/" className="hover:text-white">Проекты</a><span>/</span>
          <span className="text-white">{p.title}</span>
        </nav>
        <p className="label mb-4">{p.place}</p>
        <h1 className="max-w-[18ch] text-[clamp(2.4rem,6vw,5.2rem)] font-bold leading-[0.98] tracking-[-0.035em] text-white">{p.title}</h1>
        <p className="mt-6 max-w-xl text-[18px] text-alu">{p.tag}</p>
      </div>

      {p.full ? (
        <GelendzhikScene />
      ) : (
        <section className="container-x py-16 md:py-24">
          <PlaceholderFilm i={idx} className="aspect-[16/8] w-full border border-grid" />
          <div className="mt-px grid gap-px border border-grid bg-grid md:grid-cols-3">
            {[['Задача', '[задача — от клиента]'], ['Решение', '[решение — от клиента]'], ['Результат', '[результат, цифры — от клиента]']].map(([k, v], i) => (
              <div key={k} className="bg-carbon p-6">
                <p className="mono mb-3 text-[11px] uppercase tracking-[0.16em] text-mute"><span className="text-signal">0{i + 1}</span> {k}</p>
                <p className="text-[15px]"><span className="ph">{v}</span></p>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="container-x pb-20">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-grid pt-8">
          <Button href="/projects/" variant="ghost" arrow={false}>Все проекты</Button>
          <Button href={`/projects/${next.slug}/`}>Следующий: {next.title}</Button>
        </div>
      </div>
      <RfqSection />
    </PageShell>
  );
}
