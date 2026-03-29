import React from 'react';
import { useParams } from 'react-router-dom';
import Card from '../../components/ui/Card';
import ProgressBar from '../../components/ui/ProgressBar';

const ChildProgress: React.FC = () => {
  const { childId } = useParams<{ childId: string }>();

  const child = {
    name: 'Alex',
    level: 7,
    xp: 650,
    streak: 5,
    coinsEarned: 350,
    questsCompleted: 12,
    wordsMastered: 28,
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">{child.name}'s Progress</h1>

      {/* Overview */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Level</p>
            <p className="text-3xl font-bold text-blue-500">{child.level}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Streak</p>
            <p className="text-3xl font-bold text-red-500">{child.streak} days</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Quests Done</p>
            <p className="text-3xl font-bold text-green-500">{child.questsCompleted}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Coins Earned</p>
            <p className="text-3xl font-bold text-yellow-500">{child.coinsEarned}</p>
          </div>
        </div>
      </Card>

      {/* Progress Details */}
      <Card className="p-6 bg-white space-y-6">
        <div>
          <h3 className="font-bold text-gray-800 mb-3">XP Progress</h3>
          <ProgressBar
            current={child.xp % 100}
            max={100}
            label={`${child.xp} XP total`}
          />
        </div>

        <div>
          <h3 className="font-bold text-gray-800 mb-3">This Week Activity</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Monday</span>
              <span className="text-green-600">✓ Completed 2 quests</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Tuesday</span>
              <span className="text-green-600">✓ Learned 3 words</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Wednesday</span>
              <span className="text-gray-400">- No activity</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-gray-800 mb-3">Vocabulary Mastery</h3>
          <ProgressBar
            current={child.wordsMastered}
            max={100}
            label={`${child.wordsMastered} words mastered`}
          />
        </div>
      </Card>
    </div>
  );
};

export default ChildProgress;
