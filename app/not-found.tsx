import { Header } from '@/components/sections/Header';
import { Button } from '@/components/ui/Button';

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="container-x grid min-h-[100svh] content-center">
        <p className="mono mb-6 text-[12px] uppercase tracking-[0.16em] text-signal">Ошибка 404</p>
        <h1 className="max-w-[14ch] text-[clamp(2.5rem,7vw,6rem)] font-bold leading-[0.95] text-white">Такого листа в чертеже нет.</h1>
        <p className="mt-6 max-w-md text-alu">Страница не найдена. Вернитесь на главную — там всё на месте.</p>
        <div className="mt-8"><Button href="/">На главную</Button></div>
      </main>
    </>
  );
}
