import type { Metadata, Viewport } from 'next';
import { Golos_Text, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { site } from '@/content/site';
import { SmoothScroll } from '@/components/motion/SmoothScroll';

const golos = Golos_Text({ subsets: ['latin', 'cyrillic'], display: 'swap', variable: '--font-golos' });
const jb = JetBrains_Mono({ subsets: ['latin', 'cyrillic'], display: 'swap', variable: '--font-jb' });

export const metadata: Metadata = {
  metadataBase: new URL('https://mdmt-concept.pages.dev'),
  title: 'МДМ-Технология — алюминиевые фермы и сцены, Москва',
  description: `${site.tagline} ${site.lead}`,
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
  openGraph: { title: 'МДМ-Технология', description: site.tagline, locale: 'ru_RU', type: 'website', images: ['/og.jpg'] },
};

export const viewport: Viewport = { themeColor: '#08090B', width: 'device-width', initialScale: 1 };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${golos.variable} ${jb.variable}`}>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{if(innerWidth>=768&&!sessionStorage.getItem('mdmt-intro')&&!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.intro='1'}catch(e){}",
          }}
        />
      </head>
      <body>
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
