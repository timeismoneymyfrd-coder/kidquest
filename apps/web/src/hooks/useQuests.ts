import { useEffect } from 'react';
import { useQuestStore } from '../stores/questStore';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import type { Quest } from '../types';

export function useQuests(date?: string) {
  const { childSession } = useAuthStore();
  const { quests, loading, filter, fetchQuests, updateQuestLocally } = useQuestStore();

  useEffect(() => {
    if (!childSession) return;
    fetchQuests(childSession.id, date || new Date().toISOString().split('T')[0]);
  }, [childSession, date]);

  // Realtime subscription
  useEffect(() => {
    if (!childSession) return;

    const channel = supabase
      .channel('child-quests')
      .on('postgres_changes', {
        event: 'UPDATE',
        schema: 'public',
        table: 'quests',
        filter: `child_id=eq.${childSession.id}`,
      }, (payload) => {
        updateQuestLocally(payload.new.id, payload.new as Partial<Quest>);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [childSession]);

  const filtered = filter === 'all'
    ? quests
    : quests.filter((q) => q.type === filter);

  const todayQuests = filtered.filter((q) =>
    q.scheduled_for === new Date().toISOString().split('T')[0]
  );

  const pendingCount = quests.filter((q) => q.status === 'pending' || q.status === 'active').length;
  const completedCount = quests.filter((q) => q.status === 'rewarded').length;

  return { quests: filtered, todayQuests, loading, pendingCount, completedCount };
}
