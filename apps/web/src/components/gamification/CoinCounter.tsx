import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface CoinCounterProps {
  amount: number;
}

export default function CoinCounter({ amount }: CoinCounterProps) {
  const [displayAmount, setDisplayAmount] = useState(amount);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (amount !== displayAmount) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayAmount(amount);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [amount]);

  return (
    <motion.div
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
      style={{ backgroundColor: 'rgba(255, 215, 0, 0.15)', border: '1px solid rgba(255, 215, 0, 0.3)' }}
      animate={isAnimating ? { scale: [1, 1.15, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <span className="text-sm">⭐</span>
      <span className="text-sm font-bold" style={{ color: '#ffd700', fontFamily: 'JetBrains Mono, monospace' }}>
        {displayAmount.toLocaleString()}
      </span>
    </motion.div>
  );
}
