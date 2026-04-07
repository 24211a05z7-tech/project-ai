'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Search, FileText } from 'lucide-react';
import { documentsService } from '@/services/documents';
import { useProjects } from '@/hooks/useProjects';
import { useAuth } from '@/context/AuthContext';
import { Document, UserRole } from '@/types';
import { DocumentCard } from '@/components/documents/DocumentCard';
import { UploadModal } from '@/components/documents/UploadModal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

type FilterStatus = 'all' | Document['status'];

export default function DocumentsPage() {
  const { user, hasRole } = useAuth();
  const { projects } = useProjects();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  const canReview = hasRole([UserRole.GUIDE, UserRole.PANEL_MEMBER]);

  useEffect(() => {
    documentsService.list().then(({ data }) => {
      setDocuments(data.data?.documents ?? data.documents ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleUpload = async (projectId: string, file: File, title: string) => {
    const { data } = await documentsService.upload(projectId, file, title);
    const doc = data.data?.document ?? data.document ?? data.data;
    setDocuments(prev => [doc, ...prev]);
  };

  const handleAccept = async (id: string) => {
    const marks = 80; // default; in production show a dialog
    const { data } = await documentsService.accept(id, marks, 'Good work!');
    const updated = data.data?.document ?? data.document ?? data.data;
    setDocuments(prev => prev.map(d => d.id === id ? updated : d));
  };

  const handleReject = async (id: string) => {
    const { data } = await documentsService.reject(id, 'Please revise and resubmit.');
    const updated = data.data?.document ?? data.document ?? data.data;
    setDocuments(prev => prev.map(d => d.id === id ? updated : d));
  };

  const filtered = documents.filter(d => {
    const matchSearch = d.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const statuses: FilterStatus[] = ['all', 'pending', 'under_review', 'accepted', 'rejected'];

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Documents</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{documents.length} document{documents.length !== 1 ? 's' : ''}</p>
        </div>
        <Button leftIcon={<Plus size={16} />} onClick={() => setShowUpload(true)}>Upload Document</Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1">
          <Input
            placeholder="Search documents..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map(s => (
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
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : filtered.length === 0 ? (
        <Card className="text-center py-16">
          <FileText size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500">{search || statusFilter !== 'all' ? 'No documents match your filters.' : 'No documents yet.'}</p>
          {!search && statusFilter === 'all' && (
            <Button className="mt-4" leftIcon={<Plus size={16} />} onClick={() => setShowUpload(true)} size="sm">
              Upload your first document
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(d => (
            <DocumentCard
              key={d.id}
              document={d}
              canReview={canReview}
              onAccept={handleAccept}
              onReject={handleReject}
            />
          ))}
        </div>
      )}

      <UploadModal
        open={showUpload}
        onClose={() => setShowUpload(false)}
        onUpload={handleUpload}
        projects={projects.map(p => ({ id: p.id, title: p.title }))}
      />
    </div>
  );
}
