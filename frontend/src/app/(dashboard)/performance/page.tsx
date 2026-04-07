'use client';

import React, { useEffect, useState } from 'react';
import { Sparkles, Trophy, BarChart2, CheckSquare, FileText, TrendingUp } from 'lucide-react';
import { performanceService } from '@/services/performance';
import { useAuth } from '@/context/AuthContext';
import { Performance, User } from '@/types';
import { LeaderboardTable, MetricCard } from '@/components/performance/LeaderboardTable';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';

export default function PerformancePage() {
  const { user } = useAuth();
  const [metrics, setMetrics] = useState<Performance | null>(null);
  const [leaderboard, setLeaderboard] = useState<{ user: User; performance: Performance }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      performanceService.getUserMetrics(),
      performanceService.getLeaderboard(),
    ]).then(([mRes, lRes]) => {
      setMetrics(mRes.data.data?.performance ?? mRes.data.performance ?? null);
      setLeaderboard(lRes.data.data?.leaderboard ?? lRes.data.leaderboard ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Performance</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Track your progress and compare with your team</p>
      </div>

      {metrics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MetricCard title="Total Points" value={metrics.totalPoints} sub={`Rank #${metrics.rank}`} icon={<Sparkles size={20} />} color="bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400" />
          <MetricCard title="Tasks Completed" value={metrics.tasksCompleted} icon={<CheckSquare size={20} />} color="bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400" />
          <MetricCard title="Documents" value={metrics.documentsSubmitted} icon={<FileText size={20} />} color="bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400" />
          <MetricCard title="Completion Rate" value={`${Math.round(metrics.completionRate)}%`} icon={<TrendingUp size={20} />} color="bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400" />
        </div>
      )}

      {metrics?.insights && metrics.insights.length > 0 && (
        <Card className="bg-gradient-to-r from-primary-50 to-blue-50 dark:from-primary-900/20 dark:to-blue-900/20 border-primary-200 dark:border-primary-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Sparkles size={16} className="text-primary-500" />AI Insights</CardTitle>
          </CardHeader>
          <ul className="space-y-2">
            {metrics.insights.map((ins, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                <span className="text-primary-500 mt-0.5">•</span>{ins}
              </li>
            ))}
          </ul>
        </Card>
      )}

      <LeaderboardTable entries={leaderboard} currentUserId={user?.id} />
    </div>
  );
}
