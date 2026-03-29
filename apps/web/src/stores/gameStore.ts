import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { ChildAchievement, PointTransaction } from '../types';

interface GameStore {
  xp: number;
  level: number;
  coins: number;
  streak: number;
  achievements: ChildAchievement[];
  recentTransaction: PointTransaction | null;
  showLevelUp: boolean;
  showAchievement: ChildAchievement | null;

  // Actions
  syncFromChild: (child: { xp: number; level: number; star_coins: number; streak_days: number }) => void;
  fetchAchievements: (childId: string) => Promise<void>;
  addTransaction: (tx: PointTransaction) => void;
  dismissLevelUp: () => void;
  dismissAchievement: () => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  xp: 0,
  level: 1,
  coins: 0,
  streak: 0,
  achievements: [],
  recentTransaction: null,
  showLevelUp: false,
  showAchievement: null,

  syncFromChild: (child) => {
    const prevLevel = get().level;
    set({
      xp: child.xp,
      level: child.level,
      coins: child.star_coins,
      streak: child.streak_days,
      showLevelUp: child.level > prevLevel && prevLevel > 0,
    });
  },

  fetchAchievements: async (childId) => {
    const { data } = await supabase
      .from('child_achievements')
      .select('*, achievement:achievements(*)')
      .eq('child_id', childId)
      .order('unlocked_at', { ascending: false });

    if (data) set({ achievements: data });
  },

  addTransaction: (tx) => {
    set((state) => ({
      xp: state.xp + tx.xp_amount,
      coins: state.coins + tx.coin_amount,
      recentTransaction: tx,
    }));
  },

  dismissLevelUp: () => set({ showLevelUp: false }),
  dismissAchievement: () => set({ showAchievement: null }),
}));
