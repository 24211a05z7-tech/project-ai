'use client';

import { useState, useEffect, useCallback } from 'react';
import { projectsService } from '@/services/projects';
import { Project } from '@/types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await projectsService.list();
      setProjects(data.data?.projects ?? data.projects ?? data.data ?? []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to load projects';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const createProject = useCallback(async (payload: { title: string; description: string; deadline?: string }) => {
    const { data } = await projectsService.create(payload);
    const project = data.data?.project ?? data.project ?? data.data;
    setProjects(prev => [project, ...prev]);
    return project as Project;
  }, []);

  const updateProject = useCallback(async (id: string, payload: Partial<{ title: string; description: string; status: string; deadline: string }>) => {
    const { data } = await projectsService.update(id, payload);
    const updated = data.data?.project ?? data.project ?? data.data;
    setProjects(prev => prev.map(p => p.id === id ? updated : p));
    return updated as Project;
  }, []);

  const deleteProject = useCallback(async (id: string) => {
    await projectsService.delete(id);
    setProjects(prev => prev.filter(p => p.id !== id));
  }, []);

  return { projects, loading, error, createProject, updateProject, deleteProject, refetch: fetchProjects };
}
