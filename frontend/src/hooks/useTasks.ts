'use client';

import { useState, useEffect, useCallback } from 'react';
import { tasksService } from '@/services/tasks';
import { Task } from '@/types';

export function useTasks(projectId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await tasksService.list(projectId);
      setTasks(data.data?.tasks ?? data.tasks ?? data.data ?? []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load tasks';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const createTask = useCallback(async (payload: object) => {
    const { data } = await tasksService.create(payload);
    const task = data.data?.task ?? data.task ?? data.data;
    setTasks(prev => [task, ...prev]);
    return task as Task;
  }, []);

  const updateTask = useCallback(async (id: string, payload: object) => {
    const { data } = await tasksService.update(id, payload);
    const updated = data.data?.task ?? data.task ?? data.data;
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
    return updated as Task;
  }, []);

  const deleteTask = useCallback(async (id: string) => {
    await tasksService.delete(id);
    setTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const completeTask = useCallback(async (id: string) => {
    const { data } = await tasksService.complete(id);
    const updated = data.data?.task ?? data.task ?? data.data;
    setTasks(prev => prev.map(t => t.id === id ? updated : t));
    return updated as Task;
  }, []);

  return { tasks, loading, error, createTask, updateTask, deleteTask, completeTask, refetch: fetchTasks };
}
