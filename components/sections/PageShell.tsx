import { Header } from './Header';
import { Footer } from './Footer';
import { MobileBar } from './MobileBar';
import { Cursor } from '@/components/ui/Cursor';

export function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <main className="pt-16 md:pt-[72px]">{children}</main>
      <Footer />
      <MobileBar />
      <Cursor />
    </>
  );
}
