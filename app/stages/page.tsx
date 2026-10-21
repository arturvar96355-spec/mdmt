import type { Metadata } from 'next';
import { PageShell } from '@/components/sections/PageShell';
import { Stages } from '@/components/sections/Stages';
import { RfqSection } from '@/components/sections/Rfq';

export const metadata: Metadata = { title: 'Сценические комплексы СК-1, СК-2, СК-3 — МДМ-Технология' };

export default function Page() {
  return (
    <PageShell>
      <Stages />
      <RfqSection />
    </PageShell>
  );
}
