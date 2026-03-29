import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  max: number;
  label?: string;
  showPercentage?: boolean;
  variant?: 'xp' | 'health' | 'mana';
  animate?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  max,
  label,
  showPercentage = true,
  variant = 'xp',
  animate = true,
}) => {
  const percentage = (current / max) * 100;

  const variants = {
    xp: 'from-accent-cyan to-accent-green',
    health: 'from-accent-green to-accent-pink',
    mana: 'from-accent-purple to-accent-cyan',
  };

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && <span className="text-sm font-medium text-white">{label}</span>}
          {showPercentage && (
            <span className="text-sm text-accent-gold font-bold">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
      <div className="xp-bar">
        <motion.div
          className={`xp-bar-fill bg-gradient-to-r ${variants[variant]}`}
          initial={animate ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
      <div className="mt-1 text-xs text-gray-400">
        {current} / {max}
      </div>
    </div>
  );
};

export default ProgressBar;
