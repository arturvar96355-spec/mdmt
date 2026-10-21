import { Reveal } from '@/components/motion/Reveal';

export function SectionHead({ n, kicker, title, lead }: { n: string; kicker: string; title: React.ReactNode; lead?: React.ReactNode }) {
  return (
    <div className="mb-12 grid gap-6 md:mb-16 md:grid-cols-12">
      <Reveal className="md:col-span-3">
        <p className="mono flex items-center gap-3 text-[12px] uppercase tracking-[0.16em] text-mute">
          <span className="text-signal">{n}</span>
          <span className="h-px w-8 bg-grid" />
          {kicker}
        </p>
      </Reveal>
      <div className="md:col-span-9">
        <Reveal delay={0.05}>
          <h2 className="max-w-[20ch] text-[clamp(2rem,4.6vw,4rem)] font-bold leading-[1.02] tracking-[-0.03em] text-white">{title}</h2>
        </Reveal>
        {lead && (
          <Reveal delay={0.12}>
            <p className="mt-6 max-w-[40rem] text-[17px] leading-relaxed text-alu md:text-[18px]">{lead}</p>
          </Reveal>
        )}
      </div>
    </div>
  );
}
