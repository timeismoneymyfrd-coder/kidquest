import React from 'react';
import { motion } from 'framer-motion';

interface SRSProgressProps {
  total: number;
  completed: number;
  intervals: Record<number, number>;
}

const SRSProgress: React.FC<SRSProgressProps> = ({ total, completed, intervals }) => {
  const percentage = (completed / total) * 100;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-display font-bold">Review Progress</h3>
        <span className="text-sm text-accent-cyan font-bold">{completed} / {total}</span>
      </div>

      <div className="xp-bar">
        <motion.div
          className="xp-bar-fill bg-gradient-to-r from-accent-green to-accent-cyan"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>

      <div className="grid grid-cols-4 gap-2">
        {[1, 3, 7, 14, 30].map((interval) => (
          <div
            key={interval}
            className="glass-card text-center p-3"
          >
            <p className="text-xs text-gray-400">Day {interval}</p>
            <p className="text-xl font-bold text-accent-purple">
              {intervals[interval] || 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SRSProgress;
