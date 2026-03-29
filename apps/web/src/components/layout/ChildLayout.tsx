import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useGameStore } from '../../stores/gameStore';
import { useRealtime } from '../../hooks/useRealtime';
import XPBar from '../gamification/XPBar';
import CoinCounter from '../gamification/CoinCounter';
import StreakFire from '../gamification/StreakFire';
import LevelUpModal from '../gamification/LevelUpModal';
import AchievementToast from '../gamification/AchievementToast';
import { useEffect } from 'react';

const NAV_ITEMS = [
  { path: '/quests', icon: '⚔️', label: '任務板' },
  { path: '/vocab', icon: '📚', label: '單詞' },
  { path: '/news', icon: '📰', label: '新聞' },
  { path: '/achievements', icon: '🏆', label: '成就' },
  { path: '/profile', icon: '👤', label: '我的' },
];

export default function ChildLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { childSession, isChild } = useAuthStore();
  const { xp, level, coins, streak, showLevelUp, showAchievement, syncFromChild, dismissLevelUp, dismissAchievement } = useGameStore();
  useRealtime();

  useEffect(() => {
    if (!isChild || !childSession) {
      navigate('/child-pin');
      return;
    }
    syncFromChild(childSession);
  }, [childSession, isChild, navigate]);

  if (!childSession) return null;

  const currentLevelXP = Math.pow((level - 1), 2) * 50;
  const nextLevelXP = Math.pow(level, 2) * 50;
  const xpProgress = nextLevelXP > currentLevelXP
    ? ((xp - currentLevelXP) / (nextLevelXP - currentLevelXP)) * 100
    : 0;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'linear-gradient(180deg, #0a0e27 0%, #131842 50%, #0a0e27 100%)' }}>
      {/* Top Status Bar */}
      <header className="sticky top-0 z-40 px-4 pt-3 pb-2" style={{ backgroundColor: 'rgba(10, 14, 39, 0.95)', backdropFilter: 'blur(10px)' }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold"
                 style={{ background: 'linear-gradient(135deg, #00e5ff, #b388ff)', color: '#0a0e27' }}>
              {level}
            </div>
            <div>
              <p className="text-white text-sm font-bold" style={{ fontFamily: 'Fredoka, sans-serif' }}>
                {childSession.display_name}
              </p>
              <p className="text-xs" style={{ color: '#8b92c7' }}>Lv.{level}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <StreakFire days={streak} />
            <CoinCounter amount={coins} />
          </div>
        </div>
        <XPBar current={xpProgress} label={`${xp} / ${nextLevelXP} XP`} />
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-4 pb-24">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-around items-center h-16 border-t"
           style={{ backgroundColor: 'rgba(19, 24, 66, 0.98)', borderColor: 'rgba(179, 136, 255, 0.2)', backdropFilter: 'blur(10px)' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center gap-0.5 py-1 px-3 transition-all duration-200"
              style={{ opacity: isActive ? 1 : 0.5 }}
            >
              <span className="text-xl" style={{ filter: isActive ? 'drop-shadow(0 0 6px #00e5ff)' : 'none' }}>
                {item.icon}
              </span>
              <span className="text-[10px] font-medium"
                    style={{ color: isActive ? '#00e5ff' : '#8b92c7', fontFamily: 'Noto Sans TC, sans-serif' }}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute bottom-0 w-8 h-0.5 rounded-full" style={{ backgroundColor: '#00e5ff' }} />
              )}
            </button>
          );
        })}
      </nav>

      {/* Overlays */}
      {showLevelUp && <LevelUpModal level={level} onDismiss={dismissLevelUp} />}
      {showAchievement && (
        <AchievementToast achievement={showAchievement} onDismiss={dismissAchievement} />
      )}
    </div>
  );
}
