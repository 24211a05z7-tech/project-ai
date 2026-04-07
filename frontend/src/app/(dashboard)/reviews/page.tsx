'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Plus, Clock, Users, MapPin } from 'lucide-react';
import api from '@/services/api';
import { useAuth } from '@/context/AuthContext';
import { useProjects } from '@/hooks/useProjects';
import { ReviewSlot, UserRole } from '@/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { CreateReviewSlotModal } from '@/components/reviews/CreateReviewSlotModal';
import { formatDate } from '@/utils/helpers';

export default function ReviewsPage() {
  const { hasRole } = useAuth();
  const { projects } = useProjects();
  const [slots, setSlots] = useState<ReviewSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const isPanelMember = hasRole(UserRole.PANEL_MEMBER);

  const fetchSlots = async () => {
    try {
      const { data } = await api.get('/reviews');
      setSlots(data.data?.slots ?? data.slots ?? []);
    } catch { /* ignore */ }
  };

  useEffect(() => {
    fetchSlots().finally(() => setLoading(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBook = async (id: string) => {
    try {
      await api.post(`/reviews/${id}/book`, {});
      await fetchSlots();
    } catch { /* ignore */ }
  };

  const handleCreate = async (data: {
    projectId: string;
    dateTime: string;
    duration: number;
    capacity: number;
    location: string;
    notes?: string;
  }) => {
    await api.post('/reviews', data);
    await fetchSlots();
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
          <Button leftIcon={<Plus size={16} />} onClick={() => setShowCreate(true)}>Create Slot</Button>
        )}
      </div>

      {slots.length === 0 ? (
        <Card className="text-center py-16">
          <Calendar size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-slate-500">No review slots available.</p>
          {isPanelMember && (
            <Button className="mt-4" size="sm" leftIcon={<Plus size={16} />} onClick={() => setShowCreate(true)}>
              Create the first slot
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {slots.map(slot => {
            const isFull = slot.status === 'full' || slot.bookings.length >= slot.capacity;
            const isCancelled = slot.status === 'cancelled';
            const slotDate = new Date(slot.dateTime);
            const timeStr = slotDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            const endTime = new Date(slotDate.getTime() + slot.duration * 60000)
              .toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return (
              <Card key={slot.id}>
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
                    <Calendar size={20} className="text-primary-600 dark:text-primary-400" />
                  </div>
                  <Badge variant={isCancelled ? 'default' : isFull ? 'danger' : 'success'} dot>
                    {isCancelled ? 'Cancelled' : isFull ? 'Full' : 'Available'}
                  </Badge>
                </div>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mb-1">{formatDate(slot.dateTime)}</p>
                <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400 mb-3">
                  <span className="flex items-center gap-1.5"><Clock size={12} />{timeStr} – {endTime} ({slot.duration} min)</span>
                  <span className="flex items-center gap-1.5"><Users size={12} />{slot.bookings.length}/{slot.capacity} booked</span>
                  {slot.location && (
                    <span className="flex items-center gap-1.5"><MapPin size={12} />{slot.location}</span>
                  )}
                </div>
                {slot.notes && (
                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-3 italic">{slot.notes}</p>
                )}
                {!isPanelMember && !isFull && !isCancelled && (
                  <Button size="sm" variant="outline" className="w-full" onClick={() => handleBook(slot.id)}>
                    Book Slot
                  </Button>
                )}
              </Card>
            );
          })}
        </div>
      )}

      <CreateReviewSlotModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={handleCreate}
        projects={projects.map(p => ({ id: p.id, title: p.title }))}
      />
    </div>
  );
}
