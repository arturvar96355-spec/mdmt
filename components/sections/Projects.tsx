import { projects } from '@/content/projects';
import { SectionHead } from '@/components/ui/SectionHead';
import { PlaceholderFilm } from '@/components/ui/PlaceholderFilm';
import { Reveal } from '@/components/motion/Reveal';

export function Projects() {
  const [main, ...rest] = projects;
  return (
    <section id="projects" className="container-x scroll-mt-20 py-24 md:py-36">
      <SectionHead n="07" kicker="Проекты" title="Арены, выставки, шоу." lead="Крупные проекты — отдельным разделом, а не строкой в общем списке." />
      <Reveal>
        <article className="group grid gap-px border border-grid bg-grid lg:grid-cols-12">
          <PlaceholderFilm i={5} className="min-h-[300px] lg:col-span-8 lg:min-h-[460px]" />
          <div className="flex flex-col justify-between gap-10 bg-carbon p-6 sm:p-10 lg:col-span-4">
            <div>
              <p className="label mb-4">{main.place}</p>
              <h3 className="text-[clamp(1.8rem,3vw,2.6rem)] font-bold leading-[1.05] text-white">{main.title}</h3>
              <p className="mt-4 text-[16px] leading-relaxed text-alu">{main.tag}</p>
            </div>
            <a href="#gelendzhik" className="mono flex min-h-11 items-center justify-between border border-grid px-4 text-[12px] uppercase tracking-[0.14em] text-white transition-colors hover:border-signal hover:text-signal">
              Как это работает <span aria-hidden>↓</span>
            </a>
          </div>
        </article>
      </Reveal>

      <ul className="mt-px grid gap-px border-x border-b border-grid bg-grid sm:grid-cols-2 lg:grid-cols-5">
        {rest.map((p, i) => (
          <Reveal as="li" key={p.slug} delay={i * 0.06} className="group relative bg-carbon">
            <PlaceholderFilm i={i} className="aspect-[4/3]" />
            <div className="p-5">
              <p className="label mb-2">{p.place}</p>
              <h3 className="text-[19px] font-semibold leading-tight text-white">{p.title}</h3>
              <p className="mt-2 text-[14px] text-mute">{p.tag}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
