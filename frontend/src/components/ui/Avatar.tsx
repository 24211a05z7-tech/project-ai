import React from 'react';
import { cn } from '@/utils/helpers';
import { getInitials } from '@/utils/helpers';

interface AvatarProps {
  name: string;
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeMap = {
  xs: 'h-6 w-6 text-xs',
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-12 w-12 text-base',
  xl: 'h-16 w-16 text-xl',
};

const colors = [
  'bg-blue-500', 'bg-purple-500', 'bg-green-500', 'bg-yellow-500',
  'bg-pink-500', 'bg-indigo-500', 'bg-red-500', 'bg-teal-500',
];

function getColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
}

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={cn('rounded-full object-cover flex-shrink-0', sizeMap[size], className)}
      />
    );
  }
  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0',
        sizeMap[size],
        getColor(name),
        className
      )}
      title={name}
    >
      {getInitials(name)}
    </div>
  );
}
