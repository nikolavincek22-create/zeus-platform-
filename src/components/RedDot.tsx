'use client';
import { useEffect, useState } from 'react';
import clsx from 'clsx';

interface RedDotProps {
  size?: 'sm' | 'md' | 'lg';
  pulse?: boolean;
  className?: string;
  label?: string;
}

const sizes = { sm: 6, md: 9, lg: 12 };

export default function RedDot({ size = 'md', pulse = true, className, label }: RedDotProps) {
  const [visible, setVisible] = useState(false);
  const px = sizes[size];

  useEffect(() => {
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  return (
    <span
      className={clsx('relative inline-flex items-center justify-center', className)}
      title={label}
    >
      {pulse && (
        <span
          className="red-dot-ring absolute rounded-full bg-zeus-red"
          style={{ width: px, height: px }}
        />
      )}
      <span
        className="relative rounded-full bg-zeus-red block"
        style={{
          width: px,
          height: px,
          opacity: visible ? 1 : 0,
          transition: `opacity 300ms cubic-bezier(0.4,0,0.2,1)`,
        }}
      />
    </span>
  );
}
