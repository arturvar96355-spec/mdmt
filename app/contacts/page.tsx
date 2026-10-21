import type { Metadata } from 'next';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';
import { MobileBar } from '@/components/sections/MobileBar';
import { Button } from '@/components/ui/Button';
import { site } from '@/content/site';

export const metadata: Metadata = { title: 'Контакты — МДМ-Технология' };

function RouteScheme() {
  return (
    <svg viewBox="0 0 640 420" className="h-full w-full" role="img" aria-label="Схема проезда от метро Щёлковская до завода. Не в масштабе">
      <g stroke="#22262d" strokeWidth="1">
        {Array.from({ length: 11 }, (_, i) => <line key={`v${i}`} x1={i * 64} y1="0" x2={i * 64} y2="420" />)}
        {Array.from({ length: 8 }, (_, i) => <line key={`h${i}`} x1="0" y1={i * 60} x2="640" y2={i * 60} />)}
      </g>
      <path d="M70 330 C 180 330, 220 250, 330 240 S 470 170, 540 110" fill="none" stroke="#ff6a13" strokeWidth="2" strokeDasharray="6 6" />
      <g fontFamily="var(--font-jb)" fontSize="12" letterSpacing="1.2" fill="#c9ced6">
        <circle cx="70" cy="330" r="7" fill="#08090b" stroke="#c9ced6" strokeWidth="2" />
        <text x="86" y="352">М. «ЩЁЛКОВСКАЯ»</text>
        <rect x="318" y="226" width="26" height="26" fill="#121418" stroke="#c9ced6" />
        <text x="326" y="244" fill="#ff6a13">171</text>
        <text x="284" y="278">АВТОБУС 171</text>
        <circle cx="440" cy="190" r="5" fill="#c9ced6" />
        <text x="454" y="194">«2-Й ИРТЫШСКИЙ ПРОЕЗД»</text>
        <circle cx="540" cy="110" r="10" fill="#ff6a13" />
        <circle cx="540" cy="110" r="22" fill="none" stroke="#ff6a13" opacity="0.4" />
        <text x="410" y="84" fill="#f4f5f7">ИРКУТСКАЯ УЛ., 11 К2</text>
      </g>
      <text x="16" y="408" fontFamily="var(--font-jb)" fontSize="10" letterSpacing="1.2" fill="#7d8591">СХЕМА НЕ В МАСШТАБЕ</text>
    </svg>
  );
}

export default function Contacts() {
  const r = site.requisites;
  return (
    <>
      <Header />
      <main className="container-x pb-24 pt-28 md:pt-36">
        <p className="label mb-6">Контакты</p>
        <h1 className="max-w-[16ch] text-[clamp(2.4rem,6vw,5.2rem)] font-bold leading-[0.98] tracking-[-0.035em] text-white">Завод в Гольяново. Пишите и звоните.</h1>

        <div className="mt-14 grid gap-px border border-grid bg-grid lg:grid-cols-12">
          <div className="space-y-8 bg-carbon p-6 sm:p-10 lg:col-span-5">
            <div className="flex gap-4"><MapPin className="mt-1 size-5 shrink-0 text-signal" aria-hidden /><div><p className="label mb-2">Адрес</p><a href={site.mapUrl} target="_blank" rel="noopener noreferrer" className="text-[18px] text-white hover:text-signal">{site.address}</a><p className="mt-1 text-[14px] text-mute">{site.district}. {site.route}.</p></div></div>
            <div className="flex gap-4"><Phone className="mt-1 size-5 shrink-0 text-signal" aria-hidden /><div><p className="label mb-2">Телефон</p><a href={site.phoneHref} className="mono text-[20px] text-white hover:text-signal">{site.phone}</a></div></div>
            <div className="flex gap-4"><Mail className="mt-1 size-5 shrink-0 text-signal" aria-hidden /><div><p className="label mb-2">Почта</p><a href={`mailto:${site.email}`} className="mono text-[18px] text-white hover:text-signal">{site.email}</a></div></div>
            <div className="flex gap-4"><Clock className="mt-1 size-5 shrink-0 text-signal" aria-hidden /><div><p className="label mb-2">Режим</p><p className="text-white">{site.hours}</p><p className="text-[14px] text-mute">{site.hoursNote}</p></div></div>
            <div className="flex flex-wrap gap-3 pt-2"><Button href="/#rfq">Запросить расчёт</Button><Button href={site.mapUrl} external variant="ghost">Яндекс Карты</Button></div>
          </div>
          <div className="bg-blueprint-fine relative min-h-[320px] bg-carbon lg:col-span-7"><div className="absolute inset-0 p-4"><RouteScheme /></div></div>
        </div>

        <div className="mt-px grid gap-px border-x border-b border-grid bg-grid sm:grid-cols-2">
          <div className="bg-carbon p-6 sm:p-10">
            <p className="label mb-4">Реквизиты</p>
            <dl className="mono space-y-2 text-[14px]">
              <div className="flex gap-4"><dt className="w-14 text-mute">Орг.</dt><dd className="text-white">{site.legalName}</dd></div>
              <div className="flex gap-4"><dt className="w-14 text-mute">ИНН</dt><dd className="text-white">{r.inn}</dd></div>
              <div className="flex gap-4"><dt className="w-14 text-mute">КПП</dt><dd className="text-white">{r.kpp}</dd></div>
              <div className="flex gap-4"><dt className="w-14 text-mute">ОГРН</dt><dd className="text-white">{r.ogrn}</dd></div>
            </dl>
          </div>
          <div className="bg-carbon p-6 sm:p-10">
            <p className="label mb-4">Мы в сети</p>
            <ul className="mono space-y-2 text-[14px]">
              <li><a className="text-white hover:text-signal" href={site.telegram} target="_blank" rel="noopener noreferrer">Telegram — @mdmtechnology</a></li>
              <li><a className="text-white hover:text-signal" href={site.vk} target="_blank" rel="noopener noreferrer">ВКонтакте — mdm_technology</a></li>
              <li><a className="text-white hover:text-signal" href={site.rutube} target="_blank" rel="noopener noreferrer">RUTUBE — канал</a></li>
              <li><a className="text-white hover:text-signal" href={site.gispUrl} target="_blank" rel="noopener noreferrer">Запись в ГИСП</a></li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
      <MobileBar />
    </>
  );
}
