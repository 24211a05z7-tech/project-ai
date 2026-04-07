'use client';

import React, { useState } from 'react';
import { Plus, Search, CheckSquare, LayoutGrid, List } from 'lucide-react';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { TaskCard } from '@/components/tasks/TaskCard';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';
import { Card } from '@/components/ui/Card';
import { Task } from '@/types';

type ViewMode = 'kanban' | 'list';
type FilterStatus = 'all' | Task['status'];
type FilterPriority = 'all' | Task['priority'];

export default function TasksPage() {
  const { tasks, loading, createTask, completeTask } = useTasks();
  const { projects } = useProjects();
  const [showCreate, setShowCreate] = useState(false);
  const [view, setView] = useState<ViewMode>('kanban');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');
  const [priorityFilter, setPriorityFilter] = useState<FilterPriority>('all');

  const filtered = tasks.filter(t => {
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const completedCount = tasks.filter(t => t.status === 'completed').length;
  const inProgressCount = tasks.filter(t => t.status === 'in_progress').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Tasks</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            {completedCount} completed · {inProgressCount} in progress
          </p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setShowCreate(true)}>New Task</Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
        <div className="flex gap-2 flex-wrap items-center">
          {(['all', 'todo', 'in_progress', 'completed'] as FilterStatus[]).map(s => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize ${
                statusFilter === s
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {s === 'all' ? 'All' : s.replace('_', ' ')}
            </button>
          ))}
          <div className="w-px h-5 bg-slate-200 dark:bg-slate-700" />
          <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <button
              onClick={() => setView('kanban')}
              className={`p-2 transition-colors ${view === 'kanban' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50'}`}
            >
              <LayoutGrid size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 transition-colors ${view === 'list' ? 'bg-primary-600 text-white' : 'bg-white dark:bg-slate-800 text-slate-500 hover:bg-slate-50'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-16">
          <CheckSquare size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500">{search || statusFilter !== 'all' ? 'No tasks match your filters.' : 'No tasks yet.'}</p>
          {!search && statusFilter === 'all' && (
            <Button className="mt-4" leftIcon={<Plus size={16} />} onClick={() => setShowCreate(true)} size="sm">
              Create your first task
            </Button>
          )}
        </Card>
      ) : view === 'kanban' ? (
        <KanbanBoard tasks={filtered} onTaskComplete={completeTask} />
      ) : (
        <div className="space-y-2">
          {filtered.map(t => (
            <TaskCard key={t.id} task={t} onComplete={() => completeTask(t.id)} />
          ))}
        </div>
      )}

      <CreateTaskModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={createTask}
        projects={projects.map(p => ({ id: p.id, title: p.title }))}
      />
    </div>
  );
}
