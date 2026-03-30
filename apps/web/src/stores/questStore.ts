import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { Quest, QuestStatus, QuestType } from '../types';

interface QuestStore {
  quests: Quest[];
  loading: boolean;
  filter: QuestType | 'all';
  statusFilter: QuestStatus | 'all';

  fetchQuests: (childId: string, date?: string) => Promise<void>;
  fetchPendingReview: (familyId: string) => Promise<void>;
  submitQuest: (questId: string, submission: Record<string, unknown>) => Promise<void>;
  verifyQuest: (questId: string, approved: boolean, rating?: number) => Promise<void>;
  rateQuest: (questId: string, funRating: number, difficultyRating: number) => Promise<void>;
  setFilter: (filter: QuestType | 'all') => void;
  setStatusFilter: (filter: QuestStatus | 'all') => void;
  updateQuestLocally: (questId: string, updates: Partial<Quest>) => void;
  getFilteredQuests: () => Quest[];
}

export const useQuestStore = create<QuestStore>((set, get) => ({
  quests: [],
  loading: false,
  filter: 'all',
  statusFilter: 'all',

  fetchQuests: async (childId, date) => {
    set({ loading: true });
    let query = supabase
      .from('quests')
      .select('*')
      .eq('child_id', childId)
      .order('created_at', { ascending: false });

    if (date) query = query.eq('scheduled_for', date);

    const { data, error } = await query;
    if (!error && data) set({ quests: data });
    set({ loading: false });
  },

  fetchPendingReview: async (familyId) => {
    set({ loading: true });
    const { data } = await supabase
      .from('quests')
      .select('*')
      .eq('family_id', familyId)
      .eq('status', 'submitted')
      .order('completed_at', { ascending: false });

    if (data) set({ quests: data });
    set({ loading: false });
  },

  submitQuest: async (questId, submission) => {
    const { error } = await supabase
      .from('quests')
      .update({
        status: 'submitted',
        submission,
        completed_at: new Date().toISOString(),
      })
      .eq('id', questId);

    if (!error) {
      get().updateQuestLocally(questId, { status: 'submitted', submission });
    }
  },

  verifyQuest: async (questId, approved, rating) => {
    const newStatus = approved ? 'rewarded' : 'rejected';
    const updates: Partial<Quest> = { status: newStatus as QuestStatus };
    if (rating) updates.parent_rating = rating;

    const { error } = await supabase
      .from('quests')
      .update(updates)
      .eq('id', questId);

    if (!error) get().updateQuestLocally(questId, updates);
  },

  rateQuest: async (questId, funRating, difficultyRating) => {
    await supabase
      .from('quests')
      .update({
        child_fun_rating: funRating,
        child_difficulty_rating: difficultyRating,
      })
      .eq('id', questId);
  },

  setFilter: (filter) => set({ filter }),
  setStatusFilter: (filter) => set({ statusFilter: filter }),

  updateQuestLocally: (questId, updates) => {
    set((state) => ({
      quests: state.quests.map((q) =>
        q.id === questId ? { ...q, ...updates } : q
      ),
    }));
  },

  getFilteredQuests: () => {
    const { quests, filter, statusFilter } = get();
    return quests.filter((q) => {
      if (filter !== 'all' && q.type !== filter) return false;
      if (statusFilter !== 'all' && q.status !== statusFilter) return false;
      return true;
    });
  },
}));
