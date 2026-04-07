'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Clock, Users } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { ReviewSlot, UserRole } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatDate } from '@/utils/helpers';

export default function ReviewsPage() {
  const { hasRole } = useAuth();
  const [slots, setSlots] = useState<ReviewSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const isPanelMember = hasRole(UserRole.PANEL_MEMBER);

  useEffect(() => {
    api.get('/reviews').then(({ data }) => {
      setSlots(data.data?.slots ?? data.slots ?? []);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleBook = async (id: string) => {
    try {
      await api.post(`/reviews/${id}/book`, {});
      const { data } = await api.get('/reviews');
      setSlots(data.data?.slots ?? data.slots ?? []);
    } catch { /* ignore */ }
  };

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Reviews</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Schedule and manage project review slots</p>
        </div>
        {isPanelMember && (
          <Button leftIcon={<Plus size={16} />}>Create Slot</Button>
        )}
      </div>

      {slots.length === 0 ? (
        <Card className="text-center py-16">
          <Calendar size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500">No review slots available.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slots.map(slot => (
            <Card key={slot.id}>
              <div className="flex items-start justify-between mb-3">
                <div className="h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                  <Calendar size={20} className="text-primary-600 dark:text-primary-400" />
                </div>
                <Badge variant={slot.bookedCount >= slot.capacity ? 'danger' : 'success'} dot>
                  {slot.bookedCount >= slot.capacity ? 'Full' : 'Available'}
                </Badge>
              </div>
              <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{formatDate(slot.date)}</p>
              <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 mb-3">
                <span className="flex items-center gap-1"><Clock size={12} />{slot.startTime} – {slot.endTime}</span>
                <span className="flex items-center gap-1"><Users size={12} />{slot.bookedCount}/{slot.capacity} booked</span>
              </div>
              {!isPanelMember && slot.bookedCount < slot.capacity && (
                <Button size="sm" variant="outline" className="w-full" onClick={() => handleBook(slot.id)}>
                  Book Slot
                </Button>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
