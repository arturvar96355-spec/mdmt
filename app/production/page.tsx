import type { Metadata } from 'next';
import { PageShell } from '@/components/sections/PageShell';
import { Production } from '@/components/sections/Production';
import { AlsoMake } from '@/components/sections/AlsoMake';

export const metadata: Metadata = { title: 'Производство и сертификаты — МДМ-Технология' };

export default function Page() {
  return (
    <PageShell>
      <Production />
      <AlsoMake />
    </PageShell>
  );
}
