import { site, nav } from '@/content/site';

export function Footer() {
  const r = site.requisites;
  return (
    <footer id="contacts" className="relative scroll-mt-16 border-t border-grid bg-carbon">
      <div className="container-x py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="mono text-[20px] font-medium tracking-[0.14em] text-white">МДМ-ТЕХНОЛОГИЯ</p>
            <p className="mt-4 max-w-sm text-alu">{site.tagline} Сделано в Москве.</p>
            <nav aria-label="Соцсети" className="mono mt-8 flex gap-5 text-[12px] uppercase tracking-[0.14em]">
              <a className="text-alu hover:text-signal" href={site.telegram} target="_blank" rel="noopener noreferrer">Telegram</a>
              <a className="text-alu hover:text-signal" href={site.vk} target="_blank" rel="noopener noreferrer">ВКонтакте</a>
              <a className="text-alu hover:text-signal" href={site.rutube} target="_blank" rel="noopener noreferrer">RUTUBE</a>
            </nav>
          </div>
          <div className="grid gap-10 sm:grid-cols-2 lg:col-span-7">
            <address className="not-italic">
              <p className="label mb-4">Контакты</p>
              <p className="text-white"><a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-signal">{site.address}</a></p>
              <p className="mt-1 text-[14px] text-mute">{site.district}. {site.route}.</p>
              <p className="mono mt-5 text-[15px]"><a href={site.phoneHref} className="text-white hover:text-signal">{site.phone}</a></p>
              <p className="mono mt-1 text-[15px]"><a href={`mailto:${site.email}`} className="text-white hover:text-signal">{site.email}</a></p>
              <p className="mt-4 text-[14px] text-alu">{site.hours}<br /><span className="text-mute">{site.hoursNote}</span></p>
            </address>
            <div>
              <p className="label mb-4">Реквизиты</p>
              <dl className="mono space-y-1.5 text-[13px]">
                <div className="flex gap-3"><dt className="w-12 text-mute">ИНН</dt><dd className="text-white">{r.inn}</dd></div>
                <div className="flex gap-3"><dt className="w-12 text-mute">КПП</dt><dd className="text-white">{r.kpp}</dd></div>
                <div className="flex gap-3"><dt className="w-12 text-mute">ОГРН</dt><dd className="text-white">{r.ogrn}</dd></div>
              </dl>
              <a href={site.gispUrl} target="_blank" rel="noopener noreferrer" className="mono mt-5 inline-block text-[12px] uppercase tracking-[0.14em] text-signal underline decoration-signal/40 underline-offset-4">Запись в ГИСП →</a>
              <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[14px] text-alu">
                {nav.map((n) => <li key={n.label}><a className="hover:text-white" href={n.href}>{n.label}</a></li>)}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* штамп чертежа */}
      <div className="container-x pb-28 md:pb-10">
        <div className="mono grid grid-cols-2 border border-grid text-[11px] uppercase tracking-[0.12em] text-mute md:grid-cols-4">
          <div className="border-b border-r border-grid p-3 md:border-b-0">Лист <span className="text-white">1 / 1</span></div>
          <div className="border-b border-grid p-3 md:border-b-0 md:border-r">Масштаб <span className="text-white">1:1</span></div>
          <div className="border-r border-grid p-3">Лит. <span className="text-signal">Концепт</span></div>
          <div className="p-3">© {new Date().getFullYear()} · не публичная оферта</div>
        </div>
        <p className="mt-6 max-w-2xl text-[12px] leading-relaxed text-mute">{site.conceptNote}</p>
      </div>
    </footer>
  );
}
