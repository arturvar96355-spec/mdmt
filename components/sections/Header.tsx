'use client';

import { useEffect, useState } from 'react';
import { Menu, Phone, X } from 'lucide-react';
import { nav, site } from '@/content/site';
import { Button } from '@/components/ui/Button';

export function Header() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const on = () => setSolid(window.scrollY > 24);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,backdrop-filter,border-color] duration-500 ${
        solid || open ? 'border-b border-grid bg-void/80 backdrop-blur-xl' : 'border-b border-transparent'
      }`}
    >
      <div className="container-x flex h-16 items-center justify-between gap-6 md:h-[72px]">
        <a href="/" className="hit group flex items-baseline gap-3" aria-label="МДМ-Технология — на главную">
          <span className="mono whitespace-nowrap text-[14px] font-medium tracking-[0.14em] text-white sm:text-[15px]">МДМ-ТЕХНОЛОГИЯ</span>
          <span className="mono hidden border border-signal/60 px-1.5 py-px text-[10px] tracking-[0.14em] text-signal sm:inline whitespace-nowrap">С {site.since}</span>
        </a>

        <nav aria-label="Основное меню" className="hidden items-center gap-7 xl:flex">
          {nav.map((n) => (
            <a key={n.label} href={n.href} className="link-u relative text-[14px] text-alu transition-colors hover:text-white">
              {n.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <a href={site.phoneHref} className="mono hidden whitespace-nowrap text-[14px] text-white xl:block">{site.phone}</a>
          <span className="hidden whitespace-nowrap md:block"><Button href="#rfq" className="!min-h-11 !px-5 whitespace-nowrap">Запросить расчёт</Button></span>
          <a href={site.phoneHref} className="grid size-11 place-items-center border border-grid text-white md:hidden" aria-label="Позвонить">
            <Phone className="size-[18px]" />
          </a>
          <button
            className="grid size-11 place-items-center border border-grid text-white xl:hidden"
            aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-[18px]" /> : <Menu className="size-[18px]" />}
          </button>
        </div>
      </div>

      {open && (
        <nav aria-label="Мобильное меню" className="container-x grid gap-1 pb-6 xl:hidden">
          {nav.map((n) => (
            <a key={n.label} href={n.href} onClick={() => setOpen(false)} className="mono border-b border-grid py-4 text-[15px] uppercase tracking-[0.14em] text-white">
              {n.label}
            </a>
          ))}
          <Button href="#rfq" className="mt-4" >Запросить расчёт</Button>
        </nav>
      )}
    </header>
  );
}
