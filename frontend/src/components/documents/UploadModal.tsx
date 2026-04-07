'use client';

import React, { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

interface UploadModalProps {
  open: boolean;
  onClose: () => void;
  onUpload: (projectId: string, file: File, title: string) => Promise<void>;
  projectId?: string;
  projects?: { id: string; title: string }[];
}

export function UploadModal({ open, onClose, onUpload, projectId, projects = [] }: UploadModalProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [selectedProject, setSelectedProject] = useState(projectId ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^.]+$/, ''));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const handleSubmit = async () => {
    if (!file) { setError('Please select a file'); return; }
    if (!title.trim()) { setError('Please enter a title'); return; }
    const pid = selectedProject || projectId;
    if (!pid) { setError('Please select a project'); return; }
    setError('');
    setLoading(true);
    try {
      await onUpload(pid, file, title.trim());
      setFile(null); setTitle(''); setSelectedProject(projectId ?? '');
      onClose();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Upload failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Upload Document"
      footer={
        <>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading} leftIcon={<Upload size={14} />}>Upload</Button>
        </>
      }
    >
      <div className="space-y-4">
        <div
          className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-6 text-center cursor-pointer hover:border-primary-400 transition-colors"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
        >
          <input ref={fileRef} type="file" className="hidden" onChange={e => e.target.files?.[0] && handleFile(e.target.files[0])} />
          {file ? (
            <div className="flex items-center justify-center gap-2 text-sm text-slate-700 dark:text-slate-300">
              <FileText size={20} className="text-primary-500" />
              <span className="font-medium">{file.name}</span>
              <button
                onClick={e => { e.stopPropagation(); setFile(null); }}
                className="ml-1 text-slate-400 hover:text-red-500"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div>
              <Upload size={28} className="mx-auto text-slate-400 mb-2" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Drop a file here or <span className="text-primary-600 font-medium">browse</span>
              </p>
              <p className="text-xs text-slate-400 mt-1">PDF, DOC, DOCX, PPT up to 50MB</p>
            </div>
          )}
        </div>

        <Input
          label="Document Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter document title"
        />

        {projects.length > 0 && !projectId && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Project</label>
            <select
              className="block w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-3 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
              value={selectedProject}
              onChange={e => setSelectedProject(e.target.value)}
            >
              <option value="">Select project...</option>
              {projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}
            </select>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}
      </div>
    </Modal>
  );
}
