'use client';

import { useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Props {
  href?: string;
  onClick?: () => void;
  variant?: 'primary' | 'ghost';
  children: React.ReactNode;
  className?: string;
  arrow?: boolean;
  type?: 'button' | 'submit';
  external?: boolean;
}

export function Button({ href, onClick, variant = 'primary', children, className, arrow = true, type = 'button', external }: Props) {
  const ref = useRef<HTMLElement>(null);

  const move = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const x = (e.clientX - (r.left + r.width / 2)) * 0.22;
    const y = (e.clientY - (r.top + r.height / 2)) * 0.3;
    ref.current.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  };
  const leave = () => ref.current && (ref.current.style.transform = '');

  const cls = cn(
    'group relative inline-flex min-h-12 items-center justify-center gap-2 overflow-hidden px-6 py-3 text-[15px] font-semibold tracking-tight',
    'transition-[transform,background-color,color,border-color] duration-300 ease-out will-change-transform',
    variant === 'primary' && 'bg-signal text-void hover:bg-white',
    variant === 'ghost' && 'border border-alu/30 text-white hover:border-signal hover:text-signal',
    className,
  );
  const inner = (
    <>
      <span className="relative z-10">{children}</span>
      {arrow && <ArrowUpRight className="relative z-10 size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden />}
    </>
  );

  if (href) {
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        href={href}
        className={cls}
        onPointerMove={move}
        onPointerLeave={leave}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {inner}
      </a>
    );
  }
  return (
    <button ref={ref as React.Ref<HTMLButtonElement>} type={type} onClick={onClick} className={cls} onPointerMove={move} onPointerLeave={leave}>
      {inner}
    </button>
  );
}
