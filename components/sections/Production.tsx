import { ShieldCheck, FileCheck2, Download } from 'lucide-react';
import { site } from '@/content/site';
import { SectionHead } from '@/components/ui/SectionHead';
import { Reveal } from '@/components/motion/Reveal';

const blocks = [
  { k: 'Сплавы', v: 'АД35 Т1 и 6082 Т6. Труба и профиль — алюминиевые сплавы для несущих конструкций.' },
  { k: 'Сварка', v: 'Современное сварочное оборудование. Токарно-фрезерные ЧПУ-центры для комплектующих.' },
  { k: 'Контроль', v: 'Контроль технологии производства: от материалов до сборки готовых изделий.' },
  { k: 'Конструкторы', v: 'Собственное конструкторское бюро: проектируем комплексы и кинематические решения.' },
];

const certs = [
  'Сертификат соответствия: элементы ферм и соединительные блоки из алюминиевых сплавов',
  'Сертификат соответствия: лёгкие временные сооружения (алюминиевые фермовые и стальные конструкции)',
  'Сертификат соответствия: комплект модуля подиума сценического комплекса',
];

export function Production() {
  return (
    <section id="production" className="relative scroll-mt-20 border-t border-grid py-24 md:py-36">
      <div className="container-x">
        <SectionHead n="09" kicker="Производство" title="Завод, а не посредник." lead="Проектируем, варим, обрабатываем на ЧПУ и собираем в Москве. Адрес и режим работы — в конце страницы." />

        <div className="grid gap-px border border-grid bg-grid md:grid-cols-2 lg:grid-cols-4">
          {blocks.map((b, i) => (
            <Reveal key={b.k} delay={i * 0.06} className="bg-carbon p-6 sm:p-8">
              <p className="mono mb-8 text-[12px] text-signal">0{i + 1}</p>
              <h3 className="mb-3 text-[22px] font-semibold text-white">{b.k}</h3>
              <p className="text-[15px] leading-relaxed text-alu">{b.v}</p>
            </Reveal>
          ))}
        </div>

        <div className="mt-px grid gap-px border-x border-b border-grid bg-grid lg:grid-cols-12">
          <Reveal className="flex flex-col justify-between gap-8 bg-carbon p-6 sm:p-10 lg:col-span-4">
            <ShieldCheck className="size-9 text-signal" strokeWidth={1.2} aria-hidden />
            <div>
              <h3 className="mb-3 text-[24px] font-semibold text-white">Запись в ГИСП</h3>
              <p className="mb-6 text-[15px] leading-relaxed text-alu">Государственная информационная система промышленности подтверждает статус российского производителя.</p>
              <a href={site.gispUrl} target="_blank" rel="noopener noreferrer" className="mono text-[12px] uppercase tracking-[0.14em] text-signal underline decoration-signal/40 underline-offset-4 hover:decoration-signal">Открыть запись →</a>
            </div>
          </Reveal>
          <div className="grid gap-px bg-grid sm:grid-cols-3 lg:col-span-8">
            {certs.map((c, i) => (
              <Reveal key={i} delay={i * 0.07} className="group bg-carbon p-5">
                <div className="relative mb-4 aspect-[16/9] overflow-hidden sm:aspect-[3/4] border border-grid bg-void transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:rotate-[-1.2deg] group-hover:border-signal/70">
                  <div className="bg-blueprint-fine absolute inset-0 opacity-50" aria-hidden />
                  <FileCheck2 className="absolute left-4 top-4 size-6 text-mute" strokeWidth={1.2} aria-hidden />
                  <span className="ph absolute inset-x-4 bottom-4 !text-[10px]">[скан сертификата — от клиента]</span>
                </div>
                <p className="text-[13px] leading-snug text-alu">{c}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal className="mt-10">
          <a id="models" href="https://www.mdmt.ru/3d-modeli/" target="_blank" rel="noopener noreferrer" className="mono group inline-flex min-h-12 items-center gap-3 border border-grid px-5 text-[13px] uppercase tracking-[0.14em] text-white transition-colors hover:border-signal hover:text-signal">
            <Download className="size-4" aria-hidden /> Скачать 3D-модели для проектировщиков
          </a>
        </Reveal>
      </div>
    </section>
  );
}
