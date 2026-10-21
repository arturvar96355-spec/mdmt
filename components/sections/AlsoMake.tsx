import { alsoMake } from '@/content/site';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/motion/Reveal';

export function AlsoMake() {
  return (
    <section className="container-x py-24 md:py-32">
      <SectionHead n="10" kicker="Ещё" title="Также производим" />
      <ul className="grid gap-px border border-grid bg-grid sm:grid-cols-2 lg:grid-cols-4">
        {alsoMake.map((t, i) => (
          <Reveal as="li" key={t} delay={(i % 4) * 0.05} className="group flex min-h-28 items-end justify-between gap-4 bg-carbon p-5 transition-colors hover:bg-carbon-2">
            <span className="text-[17px] font-medium leading-snug text-white">{t}</span>
            <span className="mono text-[11px] text-mute transition-colors group-hover:text-signal">{String(i + 1).padStart(2, '0')}</span>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
