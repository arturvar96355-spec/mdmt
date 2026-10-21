import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { Assembly } from '@/components/sections/Assembly';
import { GelendzhikScene } from '@/components/sections/Gelendzhik';
import { Facts } from '@/components/sections/Facts';
import { Catalog } from '@/components/sections/Catalog';
import { Stages } from '@/components/sections/Stages';
import { Projects } from '@/components/sections/Projects';
import { Production } from '@/components/sections/Production';
import { AlsoMake } from '@/components/sections/AlsoMake';
import { Reviews } from '@/components/sections/Reviews';
import { RfqSection } from '@/components/sections/Rfq';
import { Footer } from '@/components/sections/Footer';
import { MobileBar } from '@/components/sections/MobileBar';
import { SectionHead } from '@/components/ui/SectionHead';
import { Configurator } from '@/components/widgets/Configurator';
import { Preloader } from '@/components/ui/Preloader';
import { ScrollRail } from '@/components/ui/ScrollRail';
import { Cursor } from '@/components/ui/Cursor';

export default function Page() {
  return (
    <>
      <Preloader />
      <Header />
      <main>
        <Hero />
        <Facts />
        <Assembly />
        <section id="configurator" className="container-x scroll-mt-20 py-24 md:py-36">
          <SectionHead n="04" kicker="Конфигуратор" title="Соберите ферму под задачу." lead="Серия, сечение, длина — ферма перестраивается на глазах. Параметры можно передать в запрос расчёта одной кнопкой." />
          <Configurator />
        </section>
        <Catalog />
        <Stages />
        <Projects />
        <GelendzhikScene />
        <Production />
        <AlsoMake />
        <Reviews />
        <RfqSection />
      </main>
      <Footer />
      <MobileBar />
      <Cursor />
      <ScrollRail />
    </>
  );
}
