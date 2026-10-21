import { site, ticker } from '@/content/site';
import { SplitLines } from '@/components/motion/Reveal';
import { Button } from '@/components/ui/Button';
import { Marquee } from '@/components/motion/Marquee';
import { typograph } from '@/lib/typograph';
import { HeroVisual } from './HeroVisual';

export function Hero() {
  return (
    <section id="top" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden">
      <div className="bg-blueprint drift absolute inset-0 -z-20 opacity-60" aria-hidden />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(60%_70%_at_72%_46%,transparent,rgb(8_9_11/0.55)_70%,#08090b_100%)]" aria-hidden />
      <div className="beam beam-a" aria-hidden />
      <div className="beam beam-b" aria-hidden />
      <HeroVisual />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-40 bg-gradient-to-t from-void to-transparent" aria-hidden />

      <div className="container-x pointer-events-none relative z-10 flex flex-1 flex-col justify-end pb-36 pt-28 md:justify-center md:pb-28 md:pt-32">
        <p className="label mb-6 flex items-center gap-3 md:mb-8">
          <span className="inline-block h-px w-10 bg-signal" /> Москва · Гольяново · с {site.since}
        </p>
        <h1 className="max-w-[12ch] text-[clamp(2.7rem,6.6vw,6.2rem)] font-bold leading-[0.95] tracking-[-0.035em] text-white md:max-w-[11ch]">
          <SplitLines lines={['Конструкции,', 'на которых', 'стоят арены.']} accent={2} delay={0.1} gate />
        </h1>
        <p className="mt-7 max-w-[34rem] text-[17px] leading-relaxed text-alu md:mt-9 md:text-[19px]">{typograph(site.lead)}</p>
        <div className="pointer-events-auto mt-9 flex flex-wrap gap-3 md:mt-11">
          <Button href="#catalog">Каталог ферм</Button>
          <Button href="#rfq" variant="ghost">Запросить расчёт</Button>
        </div>
      </div>

      <p className="mono pointer-events-none absolute bottom-[78px] right-[var(--gutter)] z-10 hidden text-[10px] uppercase tracking-[0.16em] text-mute md:block">
        Схема. Размеры условные
      </p>

      <div className="absolute inset-x-0 bottom-14 z-10 border-y border-grid/80 bg-void/60 py-3 backdrop-blur-sm md:bottom-0 md:border-b-0">
        <Marquee items={ticker} />
      </div>
    </section>
  );
}
