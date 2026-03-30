import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../../stores/authStore';
import { useGameStore } from '../../stores/gameStore';
import { supabase } from '../../lib/supabase';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import type { NewsChallenge, NewsContent } from '../../types';

const NewsChallengeRoute: React.FC = () => {
  const childSession = useAuthStore((state) => state.childSession);
  const addCoins = useGameStore((state) => state.addCoins);
  const addXP = useGameStore((state) => state.addXP);
  const [challenges, setChallenges] = useState<NewsChallenge[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedChallengeId, setSelectedChallengeId] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Map<number, number>>(new Map());
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const loadChallenges = async () => {
      setLoading(true);
      try {
        const { data } = await supabase
          .from('news_challenges')
          .select('*')
          .eq('active', true)
          .order('created_at', { ascending: false });

        if (data) {
          setChallenges(data);
        }
      } catch (err) {
        console.error('Failed to load challenges:', err);
      } finally {
        setLoading(false);
      }
    };

    loadChallenges();
  }, []);

  const selectedChallenge = challenges.find((c) => c.id === selectedChallengeId);
  const content = selectedChallenge?.content_10_12 as NewsContent | null;

  const handleAnswerSelect = (questionIndex: number, optionIndex: number) => {
    const newAnswers = new Map(answers);
    newAnswers.set(questionIndex, optionIndex);
    setAnswers(newAnswers);
  };

  const handleSubmitAnswers = async () => {
    if (!selectedChallenge || !content || !childSession?.id) return;

    try {
      let correctCount = 0;
      const submissionAnswers: Array<{
        question_index: number;
        selected_answer: number;
        correct: boolean;
      }> = [];

      content.questions.forEach((question, idx) => {
        const selectedAnswer = answers.get(idx) ?? -1;
        const isCorrect = selectedAnswer === question.correct;
        if (isCorrect) correctCount++;

        submissionAnswers.push({
          question_index: idx,
          selected_answer: selectedAnswer,
          correct: isCorrect,
        });
      });

      const score = Math.round((correctCount / content.questions.length) * 100);
      const xpEarned = Math.round((correctCount / content.questions.length) * 50);
      const coinsEarned = Math.round((correctCount / content.questions.length) * 25);

      // Insert submission
      await supabase.from('news_submissions').insert({
        child_id: childSession.id,
        challenge_id: selectedChallenge.id,
        answers: submissionAnswers,
        score,
        xp_earned: xpEarned,
        coins_earned: coinsEarned,
        completed_at: new Date().toISOString(),
      });

      // Award rewards
      if (childSession?.id) {
        await addXP(xpEarned, childSession.id);
        await addCoins(coinsEarned, childSession.id);
      }

      setSubmitted(true);
      setTimeout(() => {
        setSelectedChallengeId(null);
        setAnswers(new Map());
        setSubmitted(false);
      }, 2000);
    } catch (err) {
      console.error('Failed to submit answers:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <p className="text-lg text-gray-400">Loading news challenges...</p>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <Card className="text-center p-8">
          <div className="text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-display font-bold text-accent-green mb-2">
            Great job!
          </h2>
          <p className="text-gray-400">Challenge completed!</p>
        </Card>
      </div>
    );
  }

  if (selectedChallengeId && selectedChallenge && content) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => {
            setSelectedChallengeId(null);
            setAnswers(new Map());
          }}
        >
          ← Back to Challenges
        </Button>

        <Card className="p-6">
          <h2 className="text-2xl font-display font-bold mb-4 text-accent-gold">
            {content.title}
          </h2>
          <p className="text-gray-300 mb-6">{content.summary}</p>

          {content.questions.map((question, idx) => (
            <div key={idx} className="space-y-4 mb-6 pb-6 border-b border-white/10 last:border-0">
              <h3 className="text-lg font-display font-bold">
                Question {idx + 1}: {question.question}
              </h3>

              <div className="space-y-2">
                {question.options.map((option, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => handleAnswerSelect(idx, optIdx)}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left font-medium ${
                      answers.get(idx) === optIdx
                        ? 'border-accent-gold bg-accent-gold/10'
                        : 'border-white/10 hover:border-white/30'
                    }`}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          ))}

          <Button
            onClick={handleSubmitAnswers}
            className="w-full rpg-button"
            disabled={answers.size !== content.questions.length}
          >
            Submit Answers
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-bold text-accent-gold">News Challenge</h2>

      {challenges.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-400">No challenges available</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {challenges.map((challenge) => {
            const content = challenge.content_10_12 as NewsContent | null;
            return (
              <Card
                key={challenge.id}
                className="p-4 cursor-pointer hover:border-accent-cyan/50"
                onClick={() => setSelectedChallengeId(challenge.id)}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-display font-bold mb-2">
                      {content?.title || 'Untitled Challenge'}
                    </h3>
                    <p className="text-sm text-gray-400">{content?.summary || ''}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <div className="text-2xl font-bold text-accent-cyan">50</div>
                    <div className="text-xs text-gray-400">XP</div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default NewsChallengeRoute;
