'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high', 'critical']),
  dueDate: z.string().optional(),
  projectId: z.string().min(1, 'Project is required'),
});

type FormData = z.infer<typeof schema>;

interface CreateTaskModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: FormData) => Promise<unknown>;
  defaultProjectId?: string;
  projects?: { id: string; title: string }[];
}

export function CreateTaskModal({ open, onClose, onCreate, defaultProjectId, projects = [] }: CreateTaskModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { priority: 'medium', projectId: defaultProjectId ?? '' },
  });

  const onSubmit = async (data: FormData) => {
    await onCreate(data);
    reset();
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={() => { reset(); onClose(); }}
      title="Create New Task"
      footer={
        <>
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button type="submit" form="create-task-form" loading={isSubmitting}>Create Task</Button>
        </>
      }
    >
      <form id="create-task-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Task Title"
          placeholder="e.g. Implement login API"
          error={errors.title?.message}
          {...register('title')}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description (optional)</label>
          <textarea
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={2}
            placeholder="Task details..."
            {...register('description')}
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
            <select
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...register('priority')}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <Input
            label="Due Date (optional)"
            type="date"
            {...register('dueDate')}
          />
        </div>
        {projects.length > 0 && !defaultProjectId && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Project</label>
            <select
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...register('projectId')}
            >
              <option value="">Select project...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
            {errors.projectId && <p className="text-xs text-red-500">{errors.projectId.message}</p>}
          </div>
        )}
        {defaultProjectId && <input type="hidden" {...register('projectId')} value={defaultProjectId} />}
      </form>
    </Modal>
  );
}
