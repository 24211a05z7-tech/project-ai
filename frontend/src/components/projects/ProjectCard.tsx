'use client';

import React from 'react';
import Link from 'next/link';
import { Users, Calendar, ChevronRight, Trash2 } from 'lucide-react';
import { Project } from '@/types';
import { formatDate, calculateProgress } from '@/utils/helpers';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

const statusVariant: Record<Project['status'], BadgeVariant> = {
  active: 'primary',
  completed: 'success',
  archived: 'default',
  on_hold: 'warning',
};

interface ProjectCardProps {
  project: Project;
  onDelete?: (id: string) => void;
}

export function ProjectCard({ project, onDelete }: ProjectCardProps) {
  const progress = project.progress ?? 0;

  return (
    <Card className="flex flex-col gap-4" hover>
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <Link href={`/projects/${project.id}`} className="group">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-primary-600 transition-colors truncate">
              {project.title}
            </h3>
          </Link>
          <p className="mt-1 text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
            {project.description}
          </p>
        </div>
        <Badge variant={statusVariant[project.status]} className="flex-shrink-0 capitalize">
          {project.status.replace('_', ' ')}
        </Badge>
      </div>

      <div>
        <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
          <span>Progress</span>
          <span>{progress}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
          <div
            className="h-1.5 rounded-full bg-primary-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
          <span className="flex items-center gap-1">
            <Users size={13} />
            {project.members?.length ?? 0} members
          </span>
          {project.deadline && (
            <span className="flex items-center gap-1">
              <Calendar size={13} />
              {formatDate(project.deadline)}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1">
          {project.members?.slice(0, 3).map(m => (
            <Avatar key={m.userId} name={m.user?.name ?? 'User'} src={m.user?.avatar} size="xs" />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700">
        <Link href={`/projects/${project.id}`}>
          <Button variant="ghost" size="sm" rightIcon={<ChevronRight size={14} />}>
            View
          </Button>
        </Link>
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Trash2 size={14} />}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
            onClick={(e) => { e.preventDefault(); onDelete(project.id); }}
          >
            Delete
          </Button>
        )}
      </div>
    </Card>
  );
}
