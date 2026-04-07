'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

const schema = z.object({
  projectId: z.string().min(1, 'Project is required'),
  dateTime: z.string().min(1, 'Date and time is required'),
  duration: z.coerce.number().int().min(15).max(120),
  capacity: z.coerce.number().int().min(1).max(10),
  location: z.string().min(1, 'Location is required'),
  notes: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface CreateReviewSlotModalProps {
  open: boolean;
  onClose: () => void;
  onCreate: (data: FormData) => Promise<void>;
  projects: { id: string; title: string }[];
}

export function CreateReviewSlotModal({ open, onClose, onCreate, projects }: CreateReviewSlotModalProps) {
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { duration: 30, capacity: 1 },
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
      title="Create Review Slot"
      footer={
        <>
          <Button variant="outline" onClick={() => { reset(); onClose(); }}>Cancel</Button>
          <Button type="submit" form="create-slot-form" loading={isSubmitting}>Create Slot</Button>
        </>
      }
    >
      <form id="create-slot-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <Input
          label="Date & Time"
          type="datetime-local"
          error={errors.dateTime?.message}
          {...register('dateTime')}
        />

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Duration (min)</label>
            <select
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...register('duration')}
            >
              <option value={15}>15 min</option>
              <option value={30}>30 min</option>
              <option value={45}>45 min</option>
              <option value={60}>60 min</option>
              <option value={90}>90 min</option>
              <option value={120}>120 min</option>
            </select>
            {errors.duration && <p className="text-xs text-red-500">{errors.duration.message}</p>}
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Capacity</label>
            <select
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              {...register('capacity')}
            >
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                <option key={n} value={n}>{n} team{n > 1 ? 's' : ''}</option>
              ))}
            </select>
            {errors.capacity && <p className="text-xs text-red-500">{errors.capacity.message}</p>}
          </div>
        </div>

        <Input
          label="Location / Meeting Link"
          placeholder="e.g. Room 301 or https://meet.google.com/..."
          error={errors.location?.message}
          {...register('location')}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Notes (optional)</label>
          <textarea
            className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            rows={2}
            placeholder="Any additional information..."
            {...register('notes')}
          />
        </div>
      </form>
    </Modal>
  );
}
