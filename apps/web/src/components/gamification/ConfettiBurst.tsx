import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ConfettiBurstProps {
  trigger: boolean;
  onComplete?: () => void;
}

const CONFETTI_COLORS = ['#ffd700', '#00e5ff', '#ff4081', '#69f0ae', '#b388ff', '#ff6e40'];

export default function ConfettiBurst({ trigger, onComplete }: ConfettiBurstProps) {
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; rotation: number; delay: number }>>([]);

  useEffect(() => {
    if (trigger) {
      const newParticles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 400,
        y: -(Math.random() * 600 + 200),
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
        rotation: Math.random() * 720 - 360,
        delay: Math.random() * 0.3,
      }));
      setParticles(newParticles);
      setTimeout(() => {
        setParticles([]);
        onComplete?.();
      }, 2000);
    }
  }, [trigger]);

  return (
    <AnimatePresence>
      {particles.length > 0 && (
        <div className="fixed inset-0 pointer-events-none z-[100] flex items-center justify-center overflow-hidden">
          {particles.map((p) => (
            <motion.div
              key={p.id}
              className="absolute w-3 h-3 rounded-sm"
              style={{ backgroundColor: p.color }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1, rotate: 0 }}
              animate={{ x: p.x, y: p.y + 800, opacity: 0, scale: 0.5, rotate: p.rotation }}
              transition={{ duration: 1.8, delay: p.delay, ease: 'easeOut' }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
}
