'use client';

import React from 'react';
import { FileText, Download, CheckCircle, XCircle, Clock, Eye } from 'lucide-react';
import { Document } from '@/types';
import { formatDate, formatRelativeTime } from '@/utils/helpers';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';

type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

const statusConfig: Record<Document['status'], { variant: BadgeVariant; icon: React.ReactNode; label: string }> = {
  pending: { variant: 'warning', icon: <Clock size={12} />, label: 'Pending' },
  under_review: { variant: 'primary', icon: <Eye size={12} />, label: 'Under Review' },
  accepted: { variant: 'success', icon: <CheckCircle size={12} />, label: 'Accepted' },
  rejected: { variant: 'danger', icon: <XCircle size={12} />, label: 'Rejected' },
};

interface DocumentCardProps {
  document: Document;
  onAccept?: (id: string) => void;
  onReject?: (id: string) => void;
  canReview?: boolean;
}

export function DocumentCard({ document, onAccept, onReject, canReview }: DocumentCardProps) {
  const cfg = statusConfig[document.status];
  const latestVersion = document.versions?.[document.versions.length - 1];

  return (
    <Card>
      <div className="flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0">
          <FileText size={20} className="text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-sm text-slate-900 dark:text-slate-100 truncate">{document.title}</p>
            <Badge variant={cfg.variant} className="flex items-center gap-1 flex-shrink-0">
              {cfg.icon}
              {cfg.label}
            </Badge>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            v{document.currentVersion} · Uploaded {formatRelativeTime(document.createdAt)}
          </p>
          {document.aiScore !== undefined && (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 flex-1 rounded-full bg-slate-200 dark:bg-slate-700">
                <div
                  className="h-1.5 rounded-full bg-primary-500"
                  style={{ width: `${document.aiScore}%` }}
                />
              </div>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-400">AI: {document.aiScore}/100</span>
            </div>
          )}
          {document.marks !== undefined && (
            <p className="text-xs text-green-600 dark:text-green-400 mt-1 font-medium">
              Score: {document.marks}/100
            </p>
          )}
          {document.feedback && (
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 italic">
              &ldquo;{document.feedback}&rdquo;
            </p>
          )}
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between gap-2">
        <p className="text-xs text-slate-400">
          {document.versions?.length ?? 0} version{(document.versions?.length ?? 0) !== 1 ? 's' : ''}
        </p>
        <div className="flex items-center gap-1">
          {latestVersion && (
            <a href={latestVersion.fileUrl} target="_blank" rel="noreferrer">
              <Button variant="ghost" size="sm" leftIcon={<Download size={13} />}>Download</Button>
            </a>
          )}
          {canReview && document.status === 'pending' && (
            <>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<CheckCircle size={13} />}
                className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                onClick={() => onAccept?.(document.id)}
              >
                Accept
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<XCircle size={13} />}
                className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => onReject?.(document.id)}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      </div>
    </Card>
  );
}
