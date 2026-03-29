import { motion } from 'framer-motion';

interface StreakFireProps {
  days: number;
}

export default function StreakFire({ days }: StreakFireProps) {
  if (days === 0) return null;

  const intensity = Math.min(1, days / 30);
  const fireSize = 16 + intensity * 8;

  return (
    <motion.div
      className="flex items-center gap-1 px-2 py-1 rounded-full"
      style={{ backgroundColor: 'rgba(255, 64, 129, 0.15)', border: '1px solid rgba(255, 64, 129, 0.3)' }}
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
    >
      <motion.span
        style={{ fontSize: fireSize }}
        animate={{
          rotate: [-5, 5, -5],
          filter: [
            `brightness(${1 + intensity * 0.5})`,
            `brightness(${1 + intensity})`,
            `brightness(${1 + intensity * 0.5})`,
          ],
        }}
        transition={{ duration: 0.8, repeat: Infinity }}
      >
        🔥
      </motion.span>
      <span className="text-xs font-bold" style={{ color: '#ff4081', fontFamily: 'JetBrains Mono, monospace' }}>
        {days}
      </span>
    </motion.div>
  );
}
