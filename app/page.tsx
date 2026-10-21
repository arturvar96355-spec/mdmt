import { Header } from '@/components/sections/Header';
import { Hero } from '@/components/sections/Hero';
import { MobileBar } from '@/components/sections/MobileBar';

export default function Page() {
  return (
    <>
      <Header />
      <main>
        <Hero />
      </main>
      <MobileBar />
    </>
  );
}
