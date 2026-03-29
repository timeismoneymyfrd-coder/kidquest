import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
}

const variants = {
  primary: 'bg-gradient-to-r from-cyan-400 to-purple-400 text-[#0a0e27] font-bold shadow-lg shadow-cyan-500/25',
  secondary: 'bg-[#1a1f4e] text-white border border-[#b388ff33] hover:border-[#b388ff66]',
  outline: 'bg-transparent text-[#00e5ff] border-2 border-[#00e5ff] hover:bg-[#00e5ff11]',
  ghost: 'bg-transparent text-[#8b92c7] hover:text-white hover:bg-white/5',
  danger: 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30',
};

const sizes = {
  sm: 'px-3 py-1.5 text-sm rounded-lg',
  md: 'px-5 py-2.5 text-base rounded-xl',
  lg: 'px-8 py-3.5 text-lg rounded-2xl',
};

export default function Button({
  children, variant = 'primary', size = 'md', fullWidth = false,
  disabled = false, loading = false, onClick, type = 'button', className = '',
}: ButtonProps) {
  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      whileTap={{ scale: 0.97 }}
      whileHover={{ scale: 1.02 }}
      className={`
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        inline-flex items-center justify-center gap-2 transition-all duration-200
        ${className}
      `}
      style={{ fontFamily: 'Noto Sans TC, sans-serif' }}
    >
      {loading && (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
        />
      )}
      {children}
    </motion.button>
  );
}
