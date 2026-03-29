import { useEffect } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import type { ChildAchievement } from '../types';

export function useAchievements() {
  const { childSession } = useAuthStore();
  const { achievements, fetchAchievements, showAchievement, dismissAchievement } = useGameStore();

  useEffect(() => {
    if (!childSession) return;
    fetchAchievements(childSession.id);

    // Listen for new achievement unlocks
    const channel = supabase
      .channel('achievement-unlocks')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'child_achievements',
        filter: `child_id=eq.${childSession.id}`,
      }, async (payload) => {
        const { data: achievement } = await supabase
          .from('achievements')
          .select('*')
          .eq('id', payload.new.achievement_id)
          .single();

        if (achievement) {
          useGameStore.setState({
            showAchievement: { ...payload.new, achievement } as ChildAchievement,
          });
        }
        fetchAchievements(childSession.id);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [childSession]);

  return { achievements, showAchievement, dismissAchievement };
}
