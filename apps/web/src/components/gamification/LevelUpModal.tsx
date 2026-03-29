import { motion, AnimatePresence } from 'framer-motion';
import { playSound } from '../../lib/sounds';
import { useEffect } from 'react';
import ConfettiBurst from './ConfettiBurst';

interface LevelUpModalProps {
  level: number;
  onDismiss: () => void;
}

export default function LevelUpModal({ level, onDismiss }: LevelUpModalProps) {
  useEffect(() => {
    playSound('level_up');
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[90] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
      >
        <motion.div
          className="absolute inset-0"
          style={{ background: 'radial-gradient(circle, rgba(0,229,255,0.3) 0%, rgba(10,14,39,0.9) 70%)' }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        />

        <ConfettiBurst trigger={true} />

        <motion.div
          className="relative text-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
        >
          <motion.div
            className="text-8xl mb-4"
            animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
            transition={{ duration: 1, repeat: Infinity }}
          >
            ⭐
          </motion.div>
          <motion.h2
            className="text-4xl font-bold mb-2"
            style={{ color: '#ffd700', fontFamily: 'Fredoka, sans-serif', textShadow: '0 0 20px rgba(255,215,0,0.5)' }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            升級了！
          </motion.h2>
          <p className="text-6xl font-bold" style={{ color: '#00e5ff', fontFamily: 'Fredoka, sans-serif', textShadow: '0 0 30px rgba(0,229,255,0.5)' }}>
            Level {level}
          </p>
          <p className="text-sm mt-4" style={{ color: '#8b92c7' }}>點擊任意處繼續</p>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
