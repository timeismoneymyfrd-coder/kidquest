import { motion } from 'framer-motion';

interface XPBarProps {
  current: number;
  label?: string;
}

export default function XPBar({ current, label }: XPBarProps) {
  return (
    <div className="w-full">
      <div className="relative h-3 rounded-full overflow-hidden" style={{ backgroundColor: 'rgba(0, 229, 255, 0.15)' }}>
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: 'linear-gradient(90deg, #00e5ff, #b388ff)' }}
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(100, Math.max(0, current))}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute top-0 bottom-0 w-4"
          style={{
            left: `${Math.min(98, current)}%`,
            background: 'radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 70%)',
            filter: 'blur(2px)',
          }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
      </div>
      {label && (
        <p className="text-[10px] text-right mt-1" style={{ color: '#8b92c7', fontFamily: 'JetBrains Mono, monospace' }}>
          {label}
        </p>
      )}
    </div>
  );
}
