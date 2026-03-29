import React from 'react';
import Card from '../../components/ui/Card';

const Leaderboard: React.FC = () => {
  const mockLeaderboard = [
    { rank: 1, name: 'Alex', level: 8, xp: 750, coins: 500, isMe: false },
    { rank: 2, name: 'Jordan', level: 7, xp: 650, coins: 400, isMe: true },
    { rank: 3, name: 'Sam', level: 6, xp: 550, coins: 350, isMe: false },
    { rank: 4, name: 'Casey', level: 5, xp: 450, coins: 300, isMe: false },
    { rank: 5, name: 'Taylor', level: 4, xp: 350, coins: 250, isMe: false },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-display font-bold text-accent-gold">Family Leaderboard</h2>

      <div className="space-y-3">
        {mockLeaderboard.map((entry) => (
          <Card
            key={entry.rank}
            className={`p-4 flex items-center gap-4 ${
              entry.isMe ? 'border-2 border-accent-gold' : ''
            }`}
          >
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
              {entry.rank === 1 && <span className="text-2xl">🥇</span>}
              {entry.rank === 2 && <span className="text-2xl">🥈</span>}
              {entry.rank === 3 && <span className="text-2xl">🥉</span>}
              {entry.rank > 3 && <span className="text-xl font-bold">{entry.rank}</span>}
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h3 className="font-display font-bold text-white">{entry.name}</h3>
                {entry.isMe && (
                  <span className="text-xs bg-accent-gold/20 text-accent-gold px-2 py-1 rounded">
                    You
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-400">Level {entry.level}</p>
            </div>

            <div className="text-right">
              <p className="font-bold text-accent-cyan">{entry.xp} XP</p>
              <p className="text-sm text-accent-gold">{entry.coins} coins</p>
            </div>
          </Card>
        ))}
      </div>

      <Card className="p-4 bg-accent-gold/10 border-accent-gold/30">
        <p className="text-sm text-center text-accent-gold">
          💡 Tip: Complete more quests to climb the leaderboard!
        </p>
      </Card>
    </div>
  );
};

export default Leaderboard;
