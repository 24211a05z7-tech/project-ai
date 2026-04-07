'use client';

import React from 'react';
import { Trophy, TrendingUp, CheckSquare, FileText, Sparkles } from 'lucide-react';
import { Performance, User } from '@/types';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Avatar } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';

interface LeaderboardEntry {
  user: User;
  performance: Performance;
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

const rankEmoji = ['🥇', '🥈', '🥉'];

export function LeaderboardTable({ entries, currentUserId }: LeaderboardTableProps) {
  return (
    <Card padding="none">
      <CardHeader className="px-5 pt-5 pb-0">
        <CardTitle className="flex items-center gap-2">
          <Trophy size={18} className="text-yellow-500" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <div className="mt-3 divide-y divide-slate-100 dark:divide-slate-700">
        {entries.map((entry, idx) => {
          const isCurrentUser = entry.user.id === currentUserId;
          return (
            <div
              key={entry.user.id}
              className={`flex items-center gap-3 px-5 py-3 ${isCurrentUser ? 'bg-primary-50 dark:bg-primary-900/20' : ''}`}
            >
              <span className="w-8 text-center text-lg">{rankEmoji[idx] ?? `#${idx + 1}`}</span>
              <Avatar name={entry.user.name} src={entry.user.avatar} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100 truncate flex items-center gap-1">
                  {entry.user.name}
                  {isCurrentUser && <span className="text-xs text-primary-500">(you)</span>}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">
                  {entry.user.role.replace('_', ' ')}
                </p>
              </div>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1"><CheckSquare size={12} /> {entry.performance.tasksCompleted}</span>
                <span className="flex items-center gap-1"><FileText size={12} /> {entry.performance.documentsSubmitted}</span>
                <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-semibold">
                  <Sparkles size={12} /> {entry.performance.totalPoints}
                </span>
              </div>
            </div>
          );
        })}
        {entries.length === 0 && (
          <div className="py-10 text-center text-sm text-slate-400">No data yet</div>
        )}
      </div>
    </Card>
  );
}

interface MetricCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  trend?: number;
  color?: string;
}

export function MetricCard({ title, value, sub, icon, trend, color = 'bg-primary-100 text-primary-600 dark:bg-primary-900/30 dark:text-primary-400' }: MetricCardProps) {
  return (
    <Card>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wide">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-slate-100 mt-1">{value}</p>
          {sub && <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{sub}</p>}
          {trend !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              <TrendingUp size={13} className={trend >= 0 ? 'text-green-500' : 'text-red-500'} />
              <span className={`text-xs font-medium ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {trend >= 0 ? '+' : ''}{trend}%
              </span>
            </div>
          )}
        </div>
        <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${color}`}>
          {icon}
        </div>
      </div>
    </Card>
  );
}
