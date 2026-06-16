'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

export default function PageShell({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = requestAnimationFrame(() => setMounted(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <div
      className={clsx('h-full w-full', className)}
      style={{
        opacity:    mounted ? 1 : 0,
        transform:  mounted ? 'translateY(0)' : 'translateY(10px)',
        transition: 'opacity 280ms cubic-bezier(0.4,0,0.2,1), transform 280ms cubic-bezier(0.4,0,0.2,1)',
      }}
    >
      {children}
    </div>
  );
}
