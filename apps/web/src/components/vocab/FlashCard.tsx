import { motion } from 'framer-motion';
import { useState } from 'react';
import type { VocabCard } from '../../types';

interface FlashCardProps {
  card: VocabCard;
  onAnswer: (correct: boolean) => void;
}

export default function FlashCard({ card, onAnswer }: FlashCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [answered, setAnswered] = useState(false);

  return (
    <div className="w-full max-w-sm mx-auto perspective-1000" style={{ perspective: '1000px' }}>
      <motion.div
        className="relative w-full h-64 cursor-pointer"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, type: 'spring', stiffness: 300, damping: 25 }}
        onClick={() => !answered && setIsFlipped(!isFlipped)}
      >
        {/* Front - Word */}
        <div className="absolute inset-0 rounded-3xl p-6 flex flex-col items-center justify-center"
             style={{ backfaceVisibility: 'hidden', backgroundColor: '#1a1f4e', border: '2px solid rgba(0,229,255,0.3)' }}>
          <p className="text-xs mb-2" style={{ color: '#8b92c7' }}>點擊翻轉</p>
          <p className="text-4xl font-bold mb-2" style={{ color: '#00e5ff', fontFamily: 'Fredoka, sans-serif' }}>
            {card.word}
          </p>
          {card.pronunciation && (
            <p className="text-sm" style={{ color: '#b388ff' }}>{card.pronunciation}</p>
          )}
          <div className="flex gap-1 mt-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="w-2 h-2 rounded-full"
                   style={{ backgroundColor: i < card.srs_level ? '#69f0ae' : 'rgba(139,146,199,0.2)' }} />
            ))}
          </div>
        </div>

        {/* Back - Definition */}
        <div className="absolute inset-0 rounded-3xl p-6 flex flex-col items-center justify-center"
             style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', backgroundColor: '#131842', border: '2px solid rgba(179,136,255,0.3)' }}>
          <p className="text-xl font-bold mb-2 text-center" style={{ color: '#ffd700' }}>
            {card.definition_zh}
          </p>
          {card.example_sentence && (
            <p className="text-sm text-center mb-1" style={{ color: '#ffffff' }}>
              "{card.example_sentence}"
            </p>
          )}
          {card.example_translation && (
            <p className="text-xs text-center" style={{ color: '#8b92c7' }}>
              {card.example_translation}
            </p>
          )}

          {!answered && (
            <div className="flex gap-3 mt-6">
              <button
                onClick={(e) => { e.stopPropagation(); setAnswered(true); onAnswer(false); }}
                className="px-6 py-2 rounded-xl text-sm font-bold"
                style={{ backgroundColor: 'rgba(255,64,129,0.2)', color: '#ff4081', border: '1px solid rgba(255,64,129,0.3)' }}
              >
                再練習 ❌
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setAnswered(true); onAnswer(true); }}
                className="px-6 py-2 rounded-xl text-sm font-bold"
                style={{ backgroundColor: 'rgba(105,240,174,0.2)', color: '#69f0ae', border: '1px solid rgba(105,240,174,0.3)' }}
              >
                記住了 ✅
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
