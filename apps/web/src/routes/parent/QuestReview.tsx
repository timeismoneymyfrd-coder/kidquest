import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const QuestReview: React.FC = () => {
  const [submissions] = useState([
    {
      id: '1',
      child: 'Alex',
      quest: 'Read Chapter 3',
      submittedAt: '2 hours ago',
      type: 'photo',
      data: 'Photo of book chapter',
    },
    {
      id: '2',
      child: 'Jordan',
      quest: 'Clean Room',
      submittedAt: '4 hours ago',
      type: 'photo',
      data: 'Before and after photos',
    },
    {
      id: '3',
      child: 'Alex',
      quest: 'Exercise - 10 push-ups',
      submittedAt: '1 day ago',
      type: 'timer',
      data: '12 minutes recorded',
    },
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Review Submissions</h1>

      {submissions.length === 0 ? (
        <Card className="p-8 text-center bg-white">
          <p className="text-xl text-gray-600">No pending submissions</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="p-6 bg-white">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{submission.quest}</h3>
                  <p className="text-sm text-gray-600">From: {submission.child}</p>
                </div>
                <span className="text-xs text-gray-400">{submission.submittedAt}</span>
              </div>

              <div className="bg-gray-50 rounded p-3 mb-4">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold">Submission Type:</span> {submission.type}
                </p>
                <p className="text-sm text-gray-600 mt-1">{submission.data}</p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="secondary"
                  onClick={() => console.log('Reject', submission.id)}
                >
                  Reject
                </Button>
                <Button
                  className="bg-green-500 hover:bg-green-600 text-white"
                  onClick={() => console.log('Approve', submission.id)}
                >
                  Approve
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuestReview;
