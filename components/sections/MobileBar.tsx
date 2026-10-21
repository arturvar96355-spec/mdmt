import { Phone } from 'lucide-react';
import { site } from '@/content/site';

export function MobileBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-2 gap-px border-t border-grid bg-grid md:hidden" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <a href={site.phoneHref} className="flex min-h-14 items-center justify-center gap-2 bg-carbon text-[15px] font-semibold text-white">
        <Phone className="size-4" aria-hidden /> Позвонить
      </a>
      <a href="#rfq" className="flex min-h-14 items-center justify-center bg-signal text-[15px] font-semibold text-void">
        Запросить расчёт
      </a>
    </div>
  );
}
