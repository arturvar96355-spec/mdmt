import type { Metadata } from 'next';
import { PageShell } from '@/components/sections/PageShell';
import { Projects } from '@/components/sections/Projects';
import { projects } from '@/content/projects';
import { SectionHead } from '@/components/ui/SectionHead';

export const metadata: Metadata = { title: 'Проекты — МДМ-Технология' };

export default function Page() {
  return (
    <PageShell>
      <Projects />
      <section className="container-x pb-24">
        <SectionHead n="—" kicker="Все проекты" title="Страницы проектов" />
        <ul className="divide-y divide-grid border-y border-grid">
          {projects.map((p) => (
            <li key={p.slug}>
              <a href={`/projects/${p.slug}/`} className="group flex min-h-16 items-center justify-between gap-6 py-4 text-white transition-colors hover:text-signal">
                <span className="text-[20px] font-semibold">{p.title}</span>
                <span className="mono hidden text-[12px] uppercase tracking-[0.14em] text-mute sm:block">{p.place}</span>
                <span aria-hidden>→</span>
              </a>
            </li>
          ))}
        </ul>
      </section>
    </PageShell>
  );
}
