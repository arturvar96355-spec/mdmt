'use client';

import dynamic from 'next/dynamic';

export const LazyStage = dynamic(() => import('./StageScene'), { ssr: false });
