'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { FolderKanban, CheckSquare, FileText, BarChart2, Plus, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Spinner } from '@/components/ui/Spinner';
import { ProjectCard } from '@/components/projects/ProjectCard';
import { TaskCard } from '@/components/tasks/TaskCard';
import { CreateProjectModal } from '@/components/projects/CreateProjectModal';
import { MetricCard } from '@/components/performance/LeaderboardTable';
import { performanceService } from '@/services/performance';
import { Performance } from '@/types';
import { calculateProgress } from '@/utils/helpers';

export default function DashboardPage() {
  const { user } = useAuth();
  const { projects, loading: pLoading, createProject } = useProjects();
  const { tasks, loading: tLoading } = useTasks();
  const [showCreate, setShowCreate] = useState(false);
  const [perf, setPerf] = useState<Performance | null>(null);

  useEffect(() => {
    performanceService.getUserMetrics().then(({ data }) => {
      setPerf(data.data?.performance ?? data.performance ?? null);
    }).catch(() => {});
  }, []);

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;
  const activeProjects = projects.filter(p => p.status === 'active').length;

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here&apos;s what&apos;s happening with your projects today.
          </p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setShowCreate(true)}>
          New Project
        </Button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard
          title="Active Projects"
          value={activeProjects}
          sub={`${projects.length} total`}
          icon={<FolderKanban size={20} />}
          color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
        />
        <MetricCard
          title="Tasks Done"
          value={completedTasks}
          sub={`${inProgressTasks} in progress`}
          icon={<CheckSquare size={20} />}
          color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
        />
        <MetricCard
          title="Total Points"
          value={perf?.totalPoints ?? 0}
          sub={perf ? `Rank #${perf.rank}` : 'Loading...'}
          icon={<Sparkles size={20} />}
          color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400"
        />
        <MetricCard
          title="Completion Rate"
          value={`${perf ? Math.round(perf.completionRate) : calculateProgress(completedTasks, tasks.length)}%`}
          sub="Overall progress"
          icon={<BarChart2 size={20} />}
          color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">Recent Projects</h2>
            <Link href="/projects">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>View all</Button>
            </Link>
          </div>
          {pLoading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : projects.length === 0 ? (
            <Card className="text-center py-10">
              <FolderKanban size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-500">No projects yet.</p>
              <Button className="mt-3" size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowCreate(true)}>
                Create your first project
              </Button>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.slice(0, 4).map(p => <ProjectCard key={p.id} project={p} />)}
            </div>
          )}
        </div>

        {/* Recent Tasks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">My Tasks</h2>
            <Link href="/tasks">
              <Button variant="ghost" size="sm" rightIcon={<ArrowRight size={14} />}>View all</Button>
            </Link>
          </div>
          {tLoading ? (
            <div className="flex justify-center py-10"><Spinner /></div>
          ) : (
            <div className="space-y-2">
              {tasks.slice(0, 6).map(t => <TaskCard key={t.id} task={t} compact />)}
              {tasks.length === 0 && (
                <Card className="text-center py-8">
                  <CheckSquare size={28} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
                  <p className="text-sm text-slate-500">No tasks assigned.</p>
                </Card>
              )}
            </div>
          )}
        </div>
      </div>

      {/* AI Insights */}
      {perf?.insights && perf.insights.length > 0 && (
        <Card className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-200 dark:border-primary-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles size={16} className="text-primary-500" />
              AI Performance Insights
            </CardTitle>
          </CardHeader>
          <ul className="space-y-2">
            {perf.insights.map((insight, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="text-primary-500 mt-0.5">•</span>
                {insight}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <CreateProjectModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={createProject}
      />
    </div>
  );
}
