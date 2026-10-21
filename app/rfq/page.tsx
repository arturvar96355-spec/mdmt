import type { Metadata } from 'next';
import { PageShell } from '@/components/sections/PageShell';
import { RfqSection } from '@/components/sections/Rfq';

export const metadata: Metadata = { title: 'Запрос расчёта — МДМ-Технология' };

export default function Page() {
  return (
    <PageShell>
      <RfqSection />
    </PageShell>
  );
}
