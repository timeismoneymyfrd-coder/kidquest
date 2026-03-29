// ============================================
// KidQuest Type Definitions
// Matches Supabase schema exactly
// ============================================

// === Enums ===
export type QuestType = 'learning' | 'chore' | 'exercise' | 'creative' | 'nutrition' | 'challenge';
export type QuestStatus = 'pending' | 'active' | 'submitted' | 'verified' | 'rewarded' | 'rejected';
export type VerificationType = 'auto' | 'photo' | 'parent' | 'timer' | 'text_answer';
export type TimeSlot = 'morning' | 'afternoon' | 'evening' | 'anytime';
export type QuestSource = 'ai' | 'parent' | 'system';
export type AchievementCategory = 'first' | 'streak' | 'mastery' | 'social' | 'special' | 'hidden';
export type AchievementRarity = 'common' | 'rare' | 'epic' | 'legendary';
export type ShopItemType = 'avatar_frame' | 'theme' | 'effect' | 'screen_time' | 'custom';
export type PurchaseStatus = 'purchased' | 'pending_approval' | 'approved' | 'rejected';
export type VocabLevel = 'beginner' | 'intermediate' | 'advanced';
export type ParentRole = 'admin' | 'co-parent';
export type TransactionType =
  | 'quest_reward' | 'streak_bonus' | 'achievement_unlock'
  | 'shop_purchase' | 'parent_bonus' | 'daily_login'
  | 'vocab_review' | 'news_challenge' | 'level_up_bonus';
export type NewsCategory = 'science' | 'world' | 'tech' | 'nature' | 'sports' | 'culture';

// === Database Tables ===

export interface Family {
  id: string;
  name: string;
  invite_code: string;
  locale: string;
  timezone: string;
  created_at: string;
}

export interface Parent {
  id: string; // = auth.users.id
  family_id: string;
  display_name: string;
  role: ParentRole;
  push_subscription: Record<string, unknown> | null;
  created_at: string;
}

export interface Child {
  id: string;
  family_id: string;
  display_name: string;
  avatar_seed: string;
  birth_year: number | null;
  pin_hash: string;
  xp: number;
  level: number;
  star_coins: number;
  streak_days: number;
  last_active_date: string | null;
  interests: string[];
  vocab_level: VocabLevel;
  preferred_language: string;
  created_at: string;
}

export interface Quest {
  id: string;
  family_id: string;
  child_id: string;
  title: string;
  description: string;
  type: QuestType;
  difficulty: number; // 1-5
  estimated_minutes: number;
  xp_reward: number;
  coin_reward: number;
  bonus_multiplier: number;
  status: QuestStatus;
  source: QuestSource;
  verification: VerificationType;
  verification_config: Record<string, unknown>;
  submission: {
    answer?: string;
    photo_url?: string;
    time_spent_seconds?: number;
  } | null;
  parent_rating: number | null;
  child_fun_rating: number | null;
  child_difficulty_rating: number | null;
  scheduled_for: string;
  time_slot: TimeSlot | null;
  due_at: string | null;
  completed_at: string | null;
  created_at: string;
}

export interface Achievement {
  id: string;
  key: string;
  title_zh: string;
  title_en: string | null;
  title_ja: string | null;
  description_zh: string;
  description_en: string | null;
  description_ja: string | null;
  icon: string;
  category: AchievementCategory;
  condition_type: string;
  condition_value: number;
  xp_reward: number;
  coin_reward: number;
  rarity: AchievementRarity;
}

export interface ChildAchievement {
  child_id: string;
  achievement_id: string;
  unlocked_at: string;
  achievement?: Achievement; // joined
}

export interface VocabCard {
  id: string;
  child_id: string;
  word: string;
  language: string;
  pronunciation: string | null;
  definition_zh: string;
  definition_en: string | null;
  example_sentence: string | null;
  example_translation: string | null;
  srs_level: number; // 0-8
  ease_factor: number;
  next_review_at: string;
  review_count: number;
  correct_count: number;
  created_at: string;
}

export interface NewsChallenge {
  id: string;
  source_url: string | null;
  source_title: string | null;
  source_date: string | null;
  content_6_9: NewsContent | null;
  content_10_12: NewsContent | null;
  content_13_15: NewsContent | null;
  category: NewsCategory | null;
  difficulty: number | null;
  active: boolean;
  created_at: string;
}

export interface NewsContent {
  title: string;
  summary: string;
  key_facts: string[];
  new_words: Array<{ word: string; definition: string }>;
  questions: Array<{
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  }>;
  discussion_prompt: string;
}

export interface NewsSubmission {
  id: string;
  child_id: string;
  challenge_id: string;
  answers: Array<{
    question_index: number;
    selected_answer: number;
    correct: boolean;
  }>;
  score: number;
  xp_earned: number;
  coins_earned: number;
  completed_at: string;
}

export interface PointTransaction {
  id: string;
  child_id: string;
  coin_amount: number;
  xp_amount: number;
  type: TransactionType;
  reference_id: string | null;
  description: string | null;
  created_at: string;
}

export interface DailySummary {
  id: string;
  child_id: string;
  date: string;
  quests_completed: number;
  quests_total: number;
  xp_earned: number;
  coins_earned: number;
  vocab_reviewed: number;
  vocab_new: number;
  news_score: number | null;
  streak_day: number;
  ai_summary: string | null;
  created_at: string;
}

export interface ShopItem {
  id: string;
  family_id: string | null;
  name_zh: string;
  name_en: string | null;
  description_zh: string | null;
  icon: string;
  type: ShopItemType;
  coin_cost: number;
  custom_description: string | null;
  requires_parent_approval: boolean;
  active: boolean;
  created_at: string;
}

export interface ShopPurchase {
  id: string;
  child_id: string;
  item_id: string;
  coin_spent: number;
  status: PurchaseStatus;
  created_at: string;
  item?: ShopItem; // joined
}

// === App State Types ===
export interface AuthState {
  user: Parent | null;
  childSession: Child | null;
  family: Family | null;
  isParent: boolean;
  isChild: boolean;
  loading: boolean;
}

export interface GameState {
  xp: number;
  level: number;
  coins: number;
  streak: number;
  achievements: ChildAchievement[];
  recentTransaction: PointTransaction | null;
}

// === AI Prompt Output Types ===
export interface AIQuestOutput {
  title: string;
  description: string;
  type: QuestType;
  difficulty: number;
  xp_reward: number;
  coin_reward: number;
  estimated_minutes: number;
  time_slot: TimeSlot;
  verification: VerificationType;
  verification_config: Record<string, unknown>;
  fun_hook: string;
}

export interface AIVocabOutput {
  word: string;
  pronunciation: string;
  definition_zh: string;
  example_sentence: string;
  example_translation: string;
  difficulty: number;
  category: string;
}
