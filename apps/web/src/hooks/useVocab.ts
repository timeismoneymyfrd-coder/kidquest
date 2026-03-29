import { useEffect } from 'react';
import { useVocabStore } from '../stores/vocabStore';
import { useAuthStore } from '../stores/authStore';

export function useVocab() {
  const { childSession } = useAuthStore();
  const store = useVocabStore();

  useEffect(() => {
    if (!childSession) return;
    store.fetchDueCards(childSession.id);
  }, [childSession]);

  const currentCard = store.reviewQueue[store.currentIndex] || null;
  const isComplete = store.currentIndex >= store.reviewQueue.length && store.reviewQueue.length > 0;
  const progress = store.reviewQueue.length > 0
    ? Math.round((store.currentIndex / store.reviewQueue.length) * 100)
    : 0;

  return {
    ...store,
    currentCard,
    isComplete,
    progress,
    totalCards: store.reviewQueue.length,
  };
}
