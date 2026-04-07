'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, FolderKanban, CheckSquare, FileText,
  BarChart2, Calendar, ChevronLeft, ChevronRight, Sparkles, LogOut,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/projects', label: 'Projects', icon: FolderKanban },
  { href: '/tasks', label: 'Tasks', icon: CheckSquare },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/performance', label: 'Performance', icon: BarChart2 },
  { href: '/reviews', label: 'Reviews', icon: Calendar },
];

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-slate-900 dark:bg-slate-950 border-r border-slate-800 transition-all duration-300 flex-shrink-0',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-slate-800">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600 flex-shrink-0">
          <Sparkles size={16} className="text-white" />
        </div>
        {!collapsed && (
          <span className="font-bold text-white text-sm">ProjectFlow AI</span>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                active
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && label}
            </Link>
          );
        })}
      </nav>

      {/* User + Collapse */}
      <div className="border-t border-slate-800 p-3 space-y-1">
        {user && (
          <div className={cn('flex items-center gap-3 px-2 py-2 rounded-lg', !collapsed && 'hover:bg-slate-800 transition-colors')}>
            <Avatar name={user.name} src={user.avatar} size="sm" className="flex-shrink-0" />
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-medium text-white truncate">{user.name}</p>
                <p className="text-xs text-slate-400 truncate capitalize">{(user.roles?.[0] ?? user.role ?? '').replace('_', ' ')}</p>
              </div>
            )}
          </div>
        )}
        <button
          onClick={() => logout()}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors',
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut size={18} className="flex-shrink-0" />
          {!collapsed && 'Logout'}
        </button>
        <button
          onClick={() => setCollapsed(c => !c)}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /><span>Collapse</span></>}
        </button>
      </div>
    </aside>
  );
}
