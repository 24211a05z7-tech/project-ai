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
  description: z.string().min(10, 'Description must be at least 10 characters'),
  deadline: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CreateProjectModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: FormData) => Promise<unknown>;
}

export function CreateProjectModal({ open, onClose, onCreate }: CreateProjectModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
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
      title="Create New Project"
      footer={
        <>
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button type="submit" form="create-project-form" loading={isSubmitting}>Create Project</Button>
        </>
      }
    >
      <form id="create-project-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Project Title"
          placeholder="e.g. AI-Powered Chatbot"
          error={errors.title?.message}
          {...register('title')}
        />
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
          <textarea
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={3}
            placeholder="Describe the project goals..."
            {...register('description')}
          />
          {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
        </div>
        <Input
          label="Deadline (optional)"
          type="date"
          error={errors.deadline?.message}
          {...register('deadline')}
        />
      </form>
    </Modal>
  );
}
