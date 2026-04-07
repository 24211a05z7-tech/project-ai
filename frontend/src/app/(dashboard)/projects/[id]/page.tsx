'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Plus, Users, Calendar, Sparkles, FileText, CheckSquare, Settings,
} from 'lucide-react';
import { projectsService } from '@/services/projects';
import { tasksService } from '@/services/tasks';
import { documentsService } from '@/services/documents';
import { Project, Task, Document } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Spinner } from '@/components/ui/Spinner';
import { KanbanBoard } from '@/components/tasks/KanbanBoard';
import { CreateTaskModal } from '@/components/tasks/CreateTaskModal';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { UploadModal } from '@/components/documents/UploadModal';
import { formatDate, calculateProgress } from '@/utils/helpers';

type Tab = 'tasks' | 'documents' | 'members';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<Tab>('tasks');
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      projectsService.get(id),
      tasksService.list(id),
      documentsService.list(id),
    ]).then(([pRes, tRes, dRes]) => {
      setProject(pRes.data.data?.project ?? pRes.data.project ?? pRes.data);
      setTasks(tRes.data.data?.tasks ?? tRes.data.tasks ?? []);
      setDocuments(dRes.data.data?.documents ?? dRes.data.documents ?? []);
    }).catch(() => router.push('/projects'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleCreateTask = async (data: object) => {
    const { data: res } = await tasksService.create({ ...data, projectId: id });
    const task = res.data?.task ?? res.task ?? res.data;
    setTasks(prev => [task, ...prev]);
  };

  const handleCompleteTask = async (taskId: string) => {
    const { data: res } = await tasksService.complete(taskId);
    const updated = res.data?.task ?? res.task ?? res.data;
    setTasks(prev => prev.map(t => t.id === taskId ? updated : t));
  };

  const handleUpload = async (projectId: string, file: File, title: string) => {
    const { data: res } = await documentsService.upload(projectId, file, title);
    const doc = res.data?.document ?? res.document ?? res.data;
    setDocuments(prev => [doc, ...prev]);
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!project) return null;

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progress = calculateProgress(completedTasks, tasks.length);

  const tabs: { id: Tab; label: string; icon: React.ReactNode; count?: number }[] = [
    { id: 'tasks', label: 'Tasks', icon: <CheckSquare size={15} />, count: tasks.length },
    { id: 'documents', label: 'Documents', icon: <FileText size={15} />, count: documents.length },
    { id: 'members', label: 'Members', icon: <Users size={15} />, count: project.members?.length },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Back + Header */}
      <button
        onClick={() => router.push('/projects')}
        className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
      >
        <ArrowLeft size={15} /> Back to Projects
      </button>

      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{project.title}</h1>
            <Badge variant={project.status === 'active' ? 'primary' : project.status === 'completed' ? 'success' : 'default'} className="capitalize">
              {project.status.replace('_', ' ')}
            </Badge>
          </div>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">{project.description}</p>
        </div>
        <Button variant="outline" size="sm" leftIcon={<Settings size={14} />}>Settings</Button>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{progress}%</p>
          <p className="text-xs text-slate-500 mt-0.5">Progress</p>
          <div className="mt-2 h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-700">
            <div className="h-1.5 rounded-full bg-primary-500" style={{ width: `${progress}%` }} />
          </div>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{tasks.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Total Tasks</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{project.members?.length ?? 0}</p>
          <p className="text-xs text-slate-500 mt-0.5">Members</p>
        </Card>
        <Card padding="sm" className="text-center">
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{documents.length}</p>
          <p className="text-xs text-slate-500 mt-0.5">Documents</p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-slate-200 dark:border-slate-700">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.icon} {tab.label}
            {tab.count !== undefined && (
              <span className="px-1.5 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400">
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button leftIcon={<Plus size={15} />} onClick={() => setShowCreateTask(true)}>Add Task</Button>
          </div>
          <KanbanBoard tasks={tasks} onTaskComplete={handleCompleteTask} />
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button leftIcon={<Plus size={15} />} onClick={() => setShowUpload(true)}>Upload Document</Button>
          </div>
          {documents.length === 0 ? (
            <Card className="text-center py-12">
              <FileText size={40} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-slate-500">No documents uploaded yet.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {documents.map(d => <DocumentCard key={d.id} document={d} />)}
            </div>
          )}
        </div>
      )}

      {activeTab === 'members' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {project.members?.map(m => (
            <Card key={m.userId} padding="sm" className="flex items-center gap-3">
              <Avatar name={m.user?.name ?? 'User'} src={m.user?.avatar} size="md" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">{m.user?.name ?? 'Unknown'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{m.user?.email}</p>
              </div>
              <Badge variant="info" className="capitalize">{m.role.replace('_', ' ')}</Badge>
            </Card>
          ))}
          {(!project.members || project.members.length === 0) && (
            <Card className="col-span-full text-center py-8">
              <Users size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-2" />
              <p className="text-sm text-slate-500">No members yet.</p>
            </Card>
          )}
        </div>
      )}

      <CreateTaskModal
        open={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        onCreate={handleCreateTask}
        defaultProjectId={id}
      />
      <UploadModal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUpload}
        projectId={id}
      />
    </div>
  );
}
