export function Marquee({ items, className }: { items: readonly string[]; className?: string }) {
  const row = [...items, ...items];
  return (
    <div className={`overflow-hidden ${className ?? ''}`} aria-label={items.join(', ')}>
      <div className="flex w-max gap-12 whitespace-nowrap will-change-transform motion-safe:[animation:ticker_48s_linear_infinite]" aria-hidden>
        {row.map((t, i) => (
          <span key={i} className="mono flex items-center gap-12 text-[13px] uppercase tracking-[0.18em] text-alu/80">
            {t}
            <span className="inline-block size-[5px] rotate-45 bg-signal" />
          </span>
        ))}
        {row.map((t, i) => (
          <span key={`b${i}`} className="mono flex items-center gap-12 text-[13px] uppercase tracking-[0.18em] text-alu/80">
            {t}
            <span className="inline-block size-[5px] rotate-45 bg-signal" />
          </span>
        ))}
      </div>
    </div>
  );
}
