import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  glowing?: boolean;
  variant?: 'child' | 'parent';
}

export default function Card({ children, className = '', onClick, glowing = false, variant = 'child' }: CardProps) {
  const baseStyle = variant === 'child'
    ? 'bg-[#1a1f4e] border border-[#b388ff22] text-white'
    : 'bg-white border border-gray-200 text-gray-900 shadow-sm';

  return (
    <motion.div
      onClick={onClick}
      whileHover={onClick ? { scale: 1.01, y: -2 } : {}}
      whileTap={onClick ? { scale: 0.99 } : {}}
      className={`rounded-2xl p-4 transition-all ${baseStyle} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      style={glowing ? { boxShadow: '0 0 20px rgba(0, 229, 255, 0.15)' } : {}}
    >
      {children}
    </motion.div>
  );
}
