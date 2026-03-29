import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { playSound } from '../../lib/sounds';
import type { ChildAchievement } from '../../types';

interface AchievementToastProps {
  achievement: ChildAchievement;
  onDismiss: () => void;
}

export default function AchievementToast({ achievement, onDismiss }: AchievementToastProps) {
  useEffect(() => {
    playSound('achievement');
    const timer = setTimeout(onDismiss, 5000);
    return () => clearTimeout(timer);
  }, []);

  const ach = achievement.achievement;
  if (!ach) return null;

  const rarityColors: Record<string, string> = {
    common: '#69f0ae',
    rare: '#00e5ff',
    epic: '#b388ff',
    legendary: '#ffd700',
  };
  const color = rarityColors[ach.rarity] || '#69f0ae';

  return (
    <motion.div
      className="fixed top-4 right-4 z-[100] cursor-pointer"
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 400, opacity: 0 }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      onClick={onDismiss}
    >
      <div className="flex items-center gap-4 px-5 py-4 rounded-2xl shadow-xl"
           style={{ backgroundColor: 'rgba(26, 31, 78, 0.95)', border: `2px solid ${color}`, backdropFilter: 'blur(10px)' }}>
        <motion.div
          className="text-4xl"
          animate={{ scale: [1, 1.3, 1], rotate: [0, -10, 10, 0] }}
          transition={{ duration: 0.6 }}
        >
          {ach.icon}
        </motion.div>
        <div>
          <p className="text-xs font-medium mb-1" style={{ color }}>🏆 成就解鎖！</p>
          <p className="text-base font-bold text-white" style={{ fontFamily: 'Fredoka, sans-serif' }}>{ach.title_zh}</p>
          <p className="text-xs" style={{ color: '#8b92c7' }}>{ach.description_zh}</p>
          <div className="flex gap-3 mt-1">
            <span className="text-xs" style={{ color: '#00e5ff' }}>+{ach.xp_reward} XP</span>
            <span className="text-xs" style={{ color: '#ffd700' }}>+{ach.coin_reward} ⭐</span>
          </div>
        </div>
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{ boxShadow: `0 0 30px ${color}30` }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </div>
    </motion.div>
  );
}
