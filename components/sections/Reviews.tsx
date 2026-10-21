import { reviews } from '@/content/reviews';
import { site } from '@/content/site';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/motion/Reveal';
import { CountUp } from '@/components/motion/CountUp';

export function Reviews() {
  return (
    <section className="container-x py-24 md:py-32">
      <SectionHead n="11" kicker="Отзывы" title="Что говорят заказчики." />
      <div className="grid gap-px border border-grid bg-grid lg:grid-cols-12">
        <Reveal className="flex flex-col justify-between gap-10 bg-carbon p-6 sm:p-10 lg:col-span-4">
          <div>
            <p className="mono text-[clamp(4rem,8vw,6.5rem)] font-medium leading-none tracking-[-0.05em] text-white">
              {Math.floor(site.rating.value)}<span className="text-signal">,{String(site.rating.value).split('.')[1]}</span>
            </p>
            <p className="mono mt-4 text-[13px] uppercase tracking-[0.14em] text-alu">
              <CountUp to={site.rating.votes} /> оценки · {site.rating.reviews} отзывов
            </p>
            <p className="mt-2 text-[14px] text-mute">Все отзывы положительные</p>
          </div>
          <a href={site.reviewsUrl} target="_blank" rel="noopener noreferrer" className="mono text-[12px] uppercase tracking-[0.14em] text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal">Читать на Яндекс Картах →</a>
        </Reveal>
        <div className="grid gap-px bg-grid sm:grid-cols-2 lg:col-span-8">
          {reviews.map((r, i) => (
            <Reveal key={r.author} delay={i * 0.07} className="flex flex-col justify-between gap-8 bg-carbon p-6 sm:p-8">
              <blockquote className="text-[clamp(1.1rem,1.6vw,1.4rem)] leading-snug text-white">«{r.text}»</blockquote>
              <figcaption className="mono text-[12px] uppercase tracking-[0.12em] text-mute">
                {r.author} · {r.date} · Отзыв на Яндекс Картах
              </figcaption>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
