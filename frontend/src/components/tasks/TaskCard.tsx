'use client';

import React from 'react';
import { Calendar, User, ChevronRight, Sparkles } from 'lucide-react';
import { Task } from '@/types';
import { formatDate } from '@/utils/helpers';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/utils/helpers';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

const priorityVariant: Record<Task['priority'], BadgeVariant> = {
  low: 'default',
  medium: 'warning',
  high: 'danger',
  critical: 'danger',
};

const statusVariant: Record<Task['status'], BadgeVariant> = {
  todo: 'default',
  in_progress: 'primary',
  completed: 'success',
};

interface TaskCardProps {
  task: Task;
  onClick?: () => void;
  onComplete?: () => void;
  compact?: boolean;
}

export function TaskCard({ task, onClick, onComplete, compact = false }: TaskCardProps) {
  const completedSubtasks = task.subtasks?.filter(s => s.completed).length ?? 0;
  const totalSubtasks = task.subtasks?.length ?? 0;

  return (
    <div
      className={cn(
        'rounded-xl border bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all cursor-pointer',
        compact ? 'p-3' : 'p-4'
      )}
      onClick={onClick}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex items-start gap-2 flex-1 min-w-0">
          {onComplete && (
            <button
              onClick={(e) => { e.stopPropagation(); onComplete(); }}
              className={cn(
                'mt-0.5 flex-shrink-0 h-4 w-4 rounded border-2 transition-colors',
                task.status === 'completed'
                  ? 'bg-green-500 border-green-500'
                  : 'border-slate-300 dark:border-slate-600 hover:border-primary-400'
              )}
            />
          )}
          <p className={cn(
            'text-sm font-medium text-slate-900 dark:text-slate-100',
            task.status === 'completed' && 'line-through text-slate-400'
          )}>
            {task.title}
          </p>
        </div>
        <div className="flex gap-1 flex-shrink-0">
          <Badge variant={priorityVariant[task.priority]} className="capitalize text-xs">
            {task.priority}
          </Badge>
        </div>
      </div>

      {!compact && task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">{task.description}</p>
      )}

      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-slate-400">
          {task.dueDate && (
            <span className="flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(task.dueDate)}
            </span>
          )}
          {task.assigneeId && (
            <span className="flex items-center gap-1">
              <User size={12} />
              Assigned
            </span>
          )}
          {totalSubtasks > 0 && (
            <span className="flex items-center gap-1">
              <ChevronRight size={12} />
              {completedSubtasks}/{totalSubtasks}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          <Badge variant={statusVariant[task.status]} className="text-xs capitalize">
            {task.status.replace('_', ' ')}
          </Badge>
          {task.points && (
            <span className="flex items-center gap-0.5 text-xs text-yellow-600 dark:text-yellow-400 font-medium">
              <Sparkles size={11} />
              {task.points}
            </span>
          )}
        </div>
      </div>

      {!compact && totalSubtasks > 0 && (
        <div className="mt-3">
          <div className="h-1 w-full rounded-full bg-slate-200 dark:bg-slate-700">
            <div
              className="h-1 rounded-full bg-primary-500 transition-all"
              style={{ width: `${(completedSubtasks / totalSubtasks) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
