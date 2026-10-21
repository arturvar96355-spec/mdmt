import type { Metadata } from 'next';
import { Header } from '@/components/sections/Header';
import { Footer } from '@/components/sections/Footer';

export const metadata: Metadata = { title: 'Политика обработки персональных данных — МДМ-Технология' };

export default function Privacy() {
  return (
    <>
      <Header />
      <main className="container-x min-h-[70svh] pb-24 pt-36">
        <h1 className="max-w-[18ch] text-[clamp(2rem,5vw,4rem)] font-bold leading-[1.02] text-white">Политика обработки персональных данных</h1>
        <p className="mt-8 max-w-xl text-alu"><span className="ph">[политика — от клиента]</span></p>
        <p className="mt-4 max-w-xl text-[15px] text-mute">Это концепт сайта. Текст политики будет предоставлен компанией.</p>
      </main>
      <Footer />
    </>
  );
}
