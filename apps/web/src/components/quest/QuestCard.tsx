import { motion } from 'framer-motion';
import type { Quest } from '../../types';
import Card from '../ui/Card';

interface QuestCardProps {
  quest: Quest;
  onClick?: () => void;
}

const TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  learning: { icon: '📖', color: '#00e5ff' },
  chore: { icon: '🧹', color: '#69f0ae' },
  exercise: { icon: '💪', color: '#ff4081' },
  creative: { icon: '🎨', color: '#b388ff' },
  nutrition: { icon: '🥗', color: '#ffd700' },
  challenge: { icon: '⚡', color: '#ff6e40' },
};

const STATUS_LABELS: Record<string, { text: string; color: string }> = {
  pending: { text: '待接取', color: '#8b92c7' },
  active: { text: '進行中', color: '#00e5ff' },
  submitted: { text: '待審核', color: '#ffd700' },
  verified: { text: '已驗證', color: '#69f0ae' },
  rewarded: { text: '已完成', color: '#69f0ae' },
  rejected: { text: '已退回', color: '#ff4081' },
};

export default function QuestCard({ quest, onClick }: QuestCardProps) {
  const typeConfig = TYPE_CONFIG[quest.type] || TYPE_CONFIG.learning;
  const statusConfig = STATUS_LABELS[quest.status] || STATUS_LABELS.pending;
  const isCompleted = quest.status === 'rewarded';

  return (
    <Card onClick={onClick} glowing={quest.status === 'active'}>
      <div className="flex items-start gap-3">
        <motion.div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
          style={{ backgroundColor: `${typeConfig.color}20`, border: `1px solid ${typeConfig.color}40` }}
          animate={quest.status === 'active' ? { scale: [1, 1.05, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          {typeConfig.icon}
        </motion.div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-bold text-sm truncate ${isCompleted ? 'line-through opacity-60' : ''}`}
                style={{ fontFamily: 'Fredoka, sans-serif', color: isCompleted ? '#8b92c7' : '#ffffff' }}>
              {quest.title}
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full flex-shrink-0 ml-2"
                  style={{ backgroundColor: `${statusConfig.color}20`, color: statusConfig.color }}>
              {statusConfig.text}
            </span>
          </div>

          <p className="text-xs mb-2 line-clamp-2" style={{ color: '#8b92c7' }}>
            {quest.description}
          </p>

          <div className="flex items-center gap-3 text-[10px]">
            <span style={{ color: '#00e5ff' }}>⚡ {quest.xp_reward} XP</span>
            <span style={{ color: '#ffd700' }}>⭐ {quest.coin_reward}</span>
            <span style={{ color: '#8b92c7' }}>⏱ {quest.estimated_minutes}分</span>
            <div className="flex gap-0.5 ml-auto">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full"
                     style={{ backgroundColor: i < quest.difficulty ? typeConfig.color : 'rgba(139,146,199,0.3)' }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
