import React, { useState } from 'react';
import { useVocabStore } from '../../stores/vocabStore';
import FlashCard from '../../components/vocab/FlashCard';
import SRSProgress from '../../components/vocab/SRSProgress';
import Card from '../../components/ui/Card';

const VocabArena: React.FC = () => {
  const { cards, reviewQueue, currentCardIndex, nextCard, setCards, setReviewQueue } = useVocabStore();
  const [reviewCount, setReviewCount] = useState(0);

  // Mock vocab cards
  const mockCards = [
    {
      id: '1',
      family_id: '1',
      word: '堅持',
      pinyin: 'jiānchí',
      english: 'perseverance',
      example_sentence: '成功需要堅持和努力。',
      difficulty_level: 3,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '2',
      family_id: '1',
      word: '冒險',
      pinyin: 'màoxiǎn',
      english: 'adventure',
      example_sentence: '每個英雄都喜歡冒險。',
      difficulty_level: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: '3',
      family_id: '1',
      word: '勇氣',
      pinyin: 'yǒngqì',
      english: 'courage',
      example_sentence: '你需要勇氣來面對挑戰。',
      difficulty_level: 2,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ];

  React.useEffect(() => {
    if (cards.length === 0 && mockCards.length > 0) {
      setCards(mockCards);
      setReviewQueue(mockCards.map((c) => c.id));
    }
  }, [cards, setCards, setReviewQueue]);

  if (reviewQueue.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="text-center p-8">
          <p className="text-4xl mb-4">✨</p>
          <h2 className="text-2xl font-display font-bold text-accent-green mb-2">
            All Caught Up!
          </h2>
          <p className="text-gray-400">No words to review right now</p>
        </Card>
      </div>
    );
  }

  const currentCard = cards[currentCardIndex];

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
          vocab={currentCard}
          onReview={(difficulty) => {
            setReviewCount(reviewCount + 1);
            if (currentCardIndex < reviewQueue.length - 1) {
              nextCard();
            }
          }}
        />
      )}

      <Card className="p-4 text-center">
        <p className="text-sm text-gray-400">
          Card {currentCardIndex + 1} of {reviewQueue.length}
        </p>
      </Card>
    </div>
  );
};

export default VocabArena;
