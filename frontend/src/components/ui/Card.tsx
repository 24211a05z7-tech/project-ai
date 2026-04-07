import React from 'react';
import { cn } from '@/utils/helpers';

interface CardProps {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const paddingMap = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-6' };

export function Card({ className, children, hover = false, padding = 'md' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm',
        hover && 'hover:shadow-md hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer',
        paddingMap[padding],
        className
      )}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('flex items-center justify-between mb-4', className)}>
      {children}
    </div>
  );
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={cn('text-base font-semibold text-slate-900 dark:text-slate-100', className)}>
      {children}
    </h3>
  );
}
