import React from 'react';

interface BadgeProps {
  label: string;
  variant?: 'gold' | 'cyan' | 'green' | 'pink' | 'purple';
  className?: string;
}

const Badge: React.FC<BadgeProps> = ({ label, variant = 'gold', className = '' }) => {
  const variants = {
    gold: 'bg-accent-gold/20 text-accent-gold border border-accent-gold/50',
    cyan: 'bg-accent-cyan/20 text-accent-cyan border border-accent-cyan/50',
    green: 'bg-accent-green/20 text-accent-green border border-accent-green/50',
    pink: 'bg-accent-pink/20 text-accent-pink border border-accent-pink/50',
    purple: 'bg-accent-purple/20 text-accent-purple border border-accent-purple/50',
  };

  return (
    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${variants[variant]} ${className}`}>
      {label}
    </span>
  );
};

export default Badge;
