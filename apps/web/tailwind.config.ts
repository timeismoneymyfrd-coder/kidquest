import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Child theme (RPG)
        primary: '#0a0e27',
        secondary: '#131842',
        card: '#1a1f4e',
        'accent-gold': '#ffd700',
        'accent-cyan': '#00e5ff',
        'accent-pink': '#ff4081',
        'accent-green': '#69f0ae',
        'accent-purple': '#b388ff',
        // Parent theme
        'parent-bg': '#f8fafc',
        'parent-card': '#ffffff',
        'parent-accent': '#3b82f6',
        'parent-success': '#22c55e',
      },
      fontFamily: {
        sans: ['Noto Sans TC', 'system-ui', 'sans-serif'],
        display: ['Fredoka', 'Noto Sans TC', 'system-ui', 'sans-serif'],
      },
      animation: {
        shimmer: 'shimmer 2s infinite',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        bounce: 'bounce 1s infinite',
        flip: 'flip 0.6s ease-in-out',
        sparkle: 'sparkle 1.5s ease-in-out infinite',
        confetti: 'confetti 3s ease-in forwards',
        'level-up': 'level-up 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
        flip: {
          '0%': { transform: 'rotateY(0)' },
          '100%': { transform: 'rotateY(180deg)' },
        },
        sparkle: {
          '0%': { opacity: '0', transform: 'scale(0)' },
          '50%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'scale(1)' },
        },
        confetti: {
          '0%': { transform: 'translate(0, 0) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translate(var(--tx), var(--ty)) rotate(720deg)', opacity: '0' },
        },
        'level-up': {
          '0%': { transform: 'scale(0)', opacity: '0' },
          '50%': { transform: 'scale(1.2)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      spacing: {
        safe: 'env(safe-area-inset-bottom)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
};

export default config;
