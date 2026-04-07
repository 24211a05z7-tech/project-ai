import { formatDistanceToNow, format } from 'date-fns';

export const formatDate = (date: string | Date): string =>
  format(new Date(date), 'MMM dd, yyyy');

export const formatRelativeTime = (date: string | Date): string =>
  formatDistanceToNow(new Date(date), { addSuffix: true });

export const truncateText = (text: string, maxLength: number): string =>
  text.length <= maxLength ? text : text.slice(0, maxLength) + '...';

export const getStatusColor = (status: string): string => {
  const map: Record<string, string> = {
    completed: 'text-green-600 bg-green-100',
    in_progress: 'text-blue-600 bg-blue-100',
    todo: 'text-gray-600 bg-gray-100',
    accepted: 'text-green-600 bg-green-100',
    rejected: 'text-red-600 bg-red-100',
    pending: 'text-yellow-600 bg-yellow-100',
    active: 'text-blue-600 bg-blue-100',
  };
  return map[status] || 'text-gray-600 bg-gray-100';
};

export const getRoleBadgeColor = (role: string): string => {
  const map: Record<string, string> = {
    team_leader: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    member: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    guide: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    panel_member: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300',
  };
  return map[role] || 'bg-gray-100 text-gray-700';
};

export const calculateProgress = (completed: number, total: number): number =>
  total === 0 ? 0 : Math.round((completed / total) * 100);

export const getInitials = (name: string): string =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
