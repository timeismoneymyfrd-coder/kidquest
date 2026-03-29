import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const NewsChallenge: React.FC = () => {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);

  const articles = [
    {
      id: '1',
      title: 'Amazing Discovery in Deep Ocean',
      snippet: 'Scientists found a new species of fish at the bottom of the ocean...',
      xpReward: 50,
      completed: false,
    },
    {
      id: '2',
      title: 'Space Exploration Milestone',
      snippet: 'A new rocket successfully launched today, reaching new heights...',
      xpReward: 50,
      completed: false,
    },
  ];

  const questions = [
    {
      id: '1',
      articleId: '1',
      question: 'What did scientists discover?',
      options: [
        'A new species of fish',
        'A new planet',
        'A treasure chest',
        'An ancient city',
      ],
      correct: 0,
    },
    {
      id: '2',
      articleId: '1',
      question: 'Where was the discovery?',
      options: [
        'In space',
        'On a mountain',
        'In the deep ocean',
        'In the desert',
      ],
      correct: 2,
    },
  ];

  const currentQuestions = selectedArticle
    ? questions.filter((q) => q.articleId === selectedArticle)
    : [];

  const handleAnswerSubmit = () => {
    if (selectedAnswer) {
      // Award XP and move to next question
      setSelectedAnswer(null);
    }
  };

  if (selectedArticle && currentQuestions.length > 0) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => setSelectedArticle(null)}
        >
          ← Back to Articles
        </Button>

        <Card className="p-6">
          {currentQuestions.map((question, idx) => (
            <div key={question.id} className="space-y-4 mb-6">
              <h3 className="text-lg font-display font-bold">
                Question {idx + 1}: {question.question}
              </h3>

              <div className="space-y-2">
                {question.options.map((option, optIdx) => (
                  <button
                    key={optIdx}
                    onClick={() => setSelectedAnswer(optIdx.toString())}
                    className={`w-full p-4 rounded-lg border-2 transition-all text-left font-medium ${
                      selectedAnswer === optIdx.toString()
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
            onClick={handleAnswerSubmit}
            className="w-full rpg-button"
            disabled={!selectedAnswer}
          >
            Check Answer
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-bold text-accent-gold">News Challenge</h2>

      <div className="grid gap-4">
        {articles.map((article) => (
          <Card
            key={article.id}
            className="p-4 cursor-pointer hover:border-accent-cyan/50"
            onClick={() => setSelectedArticle(article.id)}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-display font-bold mb-2">{article.title}</h3>
                <p className="text-sm text-gray-400">{article.snippet}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <div className="text-2xl font-bold text-accent-cyan">{article.xpReward}</div>
                <div className="text-xs text-gray-400">XP</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default NewsChallenge;
