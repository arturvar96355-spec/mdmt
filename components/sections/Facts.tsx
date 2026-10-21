import { facts } from '@/content/site';
import { CountUp } from '@/components/motion/CountUp';
import { Reveal } from '@/components/motion/Reveal';
import { typograph } from '@/lib/typograph';

export function Facts() {
  return (
    <section aria-label="Факты" className="relative border-y border-grid bg-carbon/60">
      <div className="container-x grid grid-cols-2 lg:grid-cols-4">
        {facts.map((f, i) => (
          <Reveal key={f.label} delay={i * 0.07} className={`relative flex flex-col justify-between gap-6 py-10 md:py-14 ${i % 2 ? 'pl-5 sm:pl-8' : 'pr-5 sm:pr-8'} ${i > 0 ? 'lg:border-l lg:border-grid lg:pl-8' : ''} ${i === 1 || i === 3 ? 'border-l border-grid lg:border-l' : ''} ${i > 1 ? 'border-t border-grid lg:border-t-0' : ''}`}>
            <p className="mono whitespace-nowrap text-[clamp(2.2rem,5.4vw,5rem)] font-medium leading-none tracking-[-0.04em] text-white">
              {f.prefix && <span className="text-signal">{f.prefix}</span>}
              {f.format === 'year' && <CountUp from={1980} to={f.value} duration={1.8} />}
              {f.format === 'num' && <CountUp to={f.value} />}
              {f.format === 'text' && <span className="text-signal">{f.unit}</span>}
            </p>
            <p className="max-w-[16rem] text-[15px] leading-snug text-alu">{typograph(f.label)}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
