import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import type { VocabCard } from '../types';

interface VocabStore {
  cards: VocabCard[];
  reviewQueue: VocabCard[];
  currentIndex: number;
  loading: boolean;

  fetchDueCards: (childId: string) => Promise<void>;
  answerCard: (cardId: string, correct: boolean) => Promise<void>;
  nextCard: () => void;
  resetQueue: () => void;
}

// SM-2 SRS intervals: 0=new, 1=1hr, 2=1day, 3=3day, 4=1week, 5=2week, 6=1month, 7=3month, 8=mastered
const SRS_INTERVALS_HOURS = [0, 1, 24, 72, 168, 336, 720, 2160, 999999];

function calculateNextReview(card: VocabCard, correct: boolean) {
  let newLevel = card.srs_level;
  let newEase = card.ease_factor;

  if (correct) {
    newLevel = Math.min(8, newLevel + 1);
    newEase = Math.min(3.0, newEase + 0.1);
  } else {
    newLevel = Math.max(0, newLevel - 2);
    newEase = Math.max(1.3, newEase - 0.2);
  }

  const hoursUntilNext = SRS_INTERVALS_HOURS[newLevel] * newEase;
  const nextReview = new Date(Date.now() + hoursUntilNext * 60 * 60 * 1000);

  return {
    srs_level: newLevel,
    ease_factor: Number(newEase.toFixed(2)),
    next_review_at: nextReview.toISOString(),
    review_count: card.review_count + 1,
    correct_count: card.correct_count + (correct ? 1 : 0),
  };
}

export const useVocabStore = create<VocabStore>((set, get) => ({
  cards: [],
  reviewQueue: [],
  currentIndex: 0,
  loading: false,

  fetchDueCards: async (childId) => {
    set({ loading: true });
    const { data } = await supabase
      .from('vocab_cards')
      .select('*')
      .eq('child_id', childId)
      .lte('next_review_at', new Date().toISOString())
      .order('next_review_at', { ascending: true })
      .limit(20);

    if (data) set({ reviewQueue: data, currentIndex: 0 });
    set({ loading: false });
  },

  answerCard: async (cardId, correct) => {
    const card = get().reviewQueue.find((c) => c.id === cardId);
    if (!card) return;

    const updates = calculateNextReview(card, correct);

    await supabase
      .from('vocab_cards')
      .update(updates)
      .eq('id', cardId);

    // Update local state
    set((state) => ({
      reviewQueue: state.reviewQueue.map((c) =>
        c.id === cardId ? { ...c, ...updates } : c
      ),
    }));
  },

  nextCard: () => set((state) => ({ currentIndex: state.currentIndex + 1 })),
  resetQueue: () => set({ reviewQueue: [], currentIndex: 0 }),
}));
