'use client';

import React, { useRef, useEffect } from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { Notification } from '@/types';
import { formatRelativeTime } from '@/utils/helpers';
import { cn } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';

interface NotificationPanelProps {
  notifications: Notification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onClose: () => void;
}

const typeIcon: Record<Notification['type'], string> = {
  info: '🔵',
  success: '✅',
  warning: '⚠️',
  error: '❌',
};

export function NotificationPanel({ notifications, onMarkAsRead, onMarkAllAsRead, onClose }: NotificationPanelProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-xl z-50"
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Bell size={16} className="text-slate-600 dark:text-slate-400" />
          <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</span>
        </div>
        <Button variant="ghost" size="sm" leftIcon={<CheckCheck size={14} />} onClick={onMarkAllAsRead}>
          Mark all read
        </Button>
      </div>

      <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700">
        {notifications.length === 0 ? (
          <div className="py-10 text-center text-sm text-slate-500">No notifications</div>
        ) : (
          notifications.slice(0, 20).map(n => (
            <button
              key={n.id}
              onClick={() => onMarkAsRead(n.id)}
              className={cn(
                'w-full text-left px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors',
                !n.read && 'bg-blue-50/50 dark:bg-blue-900/10'
              )}
            >
              <div className="flex items-start gap-2.5">
                <span className="mt-0.5 text-base">{typeIcon[n.type]}</span>
                <div className="flex-1 min-w-0">
                  <p className={cn('text-sm font-medium text-slate-900 dark:text-slate-100', !n.read && 'font-semibold')}>
                    {n.title}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">{n.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{formatRelativeTime(n.createdAt)}</p>
                </div>
                {!n.read && <span className="h-2 w-2 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
