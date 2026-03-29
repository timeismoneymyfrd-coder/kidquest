import { useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';
import { useGameStore } from '../stores/gameStore';
import { playSound } from '../lib/sounds';

export function useRealtime() {
  const { childSession, family, isParent } = useAuthStore();
  const { syncFromChild } = useGameStore();

  useEffect(() => {
    if (!childSession && !family) return;

    const channels: ReturnType<typeof supabase.channel>[] = [];

    if (childSession) {
      // Child: listen for quest status changes (parent verified)
      const questChannel = supabase
        .channel('child-updates')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'quests',
          filter: `child_id=eq.${childSession.id}`,
        }, (payload) => {
          if (payload.new.status === 'rewarded') {
            playSound('quest_complete');
            // Refetch child data to sync XP/coins
            supabase
              .from('children')
              .select('*')
              .eq('id', childSession.id)
              .single()
              .then(({ data }) => {
                if (data) syncFromChild(data);
              });
          }
        })
        .subscribe();
      channels.push(questChannel);

      // Child: listen for new achievements
      const achieveChannel = supabase
        .channel('child-achievements')
        .on('postgres_changes', {
          event: 'INSERT',
          schema: 'public',
          table: 'child_achievements',
          filter: `child_id=eq.${childSession.id}`,
        }, () => {
          playSound('achievement');
        })
        .subscribe();
      channels.push(achieveChannel);
    }

    if (isParent && family) {
      // Parent: listen for submitted quests
      const parentChannel = supabase
        .channel('parent-updates')
        .on('postgres_changes', {
          event: 'UPDATE',
          schema: 'public',
          table: 'quests',
          filter: `family_id=eq.${family.id}`,
        }, (payload) => {
          if (payload.new.status === 'submitted') {
            // Could trigger notification
            playSound('button_tap');
          }
        })
        .subscribe();
      channels.push(parentChannel);
    }

    return () => {
      channels.forEach((ch) => supabase.removeChannel(ch));
    };
  }, [childSession, family, isParent]);
}
