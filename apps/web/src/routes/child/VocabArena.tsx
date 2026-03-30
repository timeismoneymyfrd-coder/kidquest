import React, { useEffect, useState } from 'react';
import { useVocabStore } from '../../stores/vocabStore';
import { useAuthStore } from '../../stores/authStore';
import FlashCard from '../../components/vocab/FlashCard';
import SRSProgress from '../../components/vocab/SRSProgress';
import Card from '../../components/ui/Card';

const VocabArena: React.FC = () => {
  const childSession = useAuthStore((state) => state.childSession);
  const reviewQueue = useVocabStore((state) => state.reviewQueue);
  const currentIndex = useVocabStore((state) => state.currentIndex);
  const loading = useVocabStore((state) => state.loading);
  const fetchDueCards = useVocabStore((state) => state.fetchDueCards);
  const answerCard = useVocabStore((state) => state.answerCard);
  const nextCard = useVocabStore((state) => state.nextCard);
  const [reviewCount, setReviewCount] = useState(0);

  useEffect(() => {
    if (childSession?.id) {
      fetchDueCards(childSession.id);
    }
  }, [childSession?.id, fetchDueCards]);

  if (loading && reviewQueue.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-lg text-gray-400">Loading vocabulary cards...</p>
      </div>
    );
  }

  if (reviewQueue.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="text-center p-8">
          <p className="text-4xl mb-4">âœ¨</p>
          <h2 className="text-2xl font-display font-bold text-accent-green mb-2">
            All Caught Up!
          </h2>
          <p className="text-gray-400">No words to review right now</p>
        </Card>
      </div>
    );
  }

  const currentCard = reviewQueue[currentIndex];

  const handleAnswer = async (correct: boolean) => {
    if (currentCard) {
      await answerCard(currentCard.id, correct);
      setReviewCount(reviewCount + 1);

      if (currentIndex < reviewQueue.length - 1) {
        nextCard();
      }
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-bold text-accent-gold">Vocabulary Arena</h2>

      <SRSProgress
        total={reviewQueue.length}
        completed={reviewCount}
        intervals={{ 1: 5, 3: 3, 7: 2, 14: 1, 30: 0 }}
      />

      {currentCard && (
        <FlashCard
          card={currentCard}
          onAnswer={handleAnswer}
        />
      )}

      <Card className="p-4 text-center">
        <p className="text-sm text-gray-400">
          Card {currentIndex + 1} of {reviewQueue.length}
        </p>
      </Card>
    </div>
  9Ž
  9Ž
  9Ž
  9Ž
  9Ž
  9Ž
  9Ž
  9Ž
  9Ž
  9Ž
  9Ž
  9Ž
  9Ž
j–8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8(€€<æ8