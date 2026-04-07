'use client';

import React from 'react';
import { Task, TaskStatus } from '@/types';
import { TaskCard } from './TaskCard';
import { cn } from '@/utils/helpers';

const columns: { id: TaskStatus; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: 'bg-slate-400' },
  { id: 'in_progress', label: 'In Progress', color: 'bg-blue-500' },
  { id: 'completed', label: 'Completed', color: 'bg-green-500' },
];

interface KanbanBoardProps {
  tasks: Task[];
  onTaskClick?: (task: Task) => void;
  onTaskComplete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
}

export function KanbanBoard({ tasks, onTaskClick, onTaskComplete }: KanbanBoardProps) {
  const grouped = columns.reduce<Record<TaskStatus, Task[]>>((acc, col) => {
    acc[col.id] = tasks.filter(t => t.status === col.id);
    return acc;
  }, { todo: [], in_progress: [], completed: [] });

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map(col => (
        <div key={col.id} className="flex flex-col gap-3">
          <div className="flex items-center gap-2 px-1">
            <span className={cn('h-2.5 w-2.5 rounded-full', col.color)} />
            <h3 className="text-sm font-semibold text-slate-700 dark:text-slate-300">{col.label}</h3>
            <span className="ml-auto text-xs font-medium text-slate-400 bg-slate-100 dark:bg-slate-700 rounded-full px-2 py-0.5">
              {grouped[col.id].length}
            </span>
          </div>
          <div className="flex flex-col gap-2 min-h-[120px] rounded-xl bg-slate-50 dark:bg-slate-900/40 p-2">
            {grouped[col.id].length === 0 ? (
              <div className="flex-1 flex items-center justify-center text-xs text-slate-400 py-8">
                No tasks
              </div>
            ) : (
              grouped[col.id].map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onClick={() => onTaskClick?.(task)}
                  onComplete={onTaskComplete ? () => onTaskComplete(task.id) : undefined}
                />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
