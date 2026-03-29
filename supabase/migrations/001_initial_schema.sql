-- ============================================
-- KidQuest Phase 1 Schema
-- ============================================

-- 啟用必要 extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- 1. FAMILIES
-- ============================================
CREATE TABLE families (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  invite_code TEXT UNIQUE NOT NULL DEFAULT substring(md5(random()::text), 1, 8),
  locale TEXT NOT NULL DEFAULT 'zh-TW',
  timezone TEXT NOT NULL DEFAULT 'Asia/Taipei',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 2. PARENTS (linked to Supabase Auth)
-- ============================================
CREATE TABLE parents (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'co-parent')),
  push_subscription JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 3. CHILDREN (no auth, parent-managed)
-- ============================================
CREATE TABLE children (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES families(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_seed TEXT NOT NULL DEFAULT md5(random()::text),
  birth_year INTEGER,
  pin_hash TEXT NOT NULL,

  -- Gamification state
  xp INTEGER NOT NULL DEFAULT 0,
  level INTEGER NOT NULL DEFAULT 1,
  star_coins INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_active_date DATE,

  -- Preferences (AI uses this)
  interests TEXT[] DEFAULT '{}',
  vocab_level TEXT DEFAULT 'beginner' CHECK (vocab_level IN ('beginner', 'intermediate', 'advanced')),
  preferred_language TEXT DEFAULT 'zh-TW',

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 4. QUESTS (core task system)
-- ============================================
CREATE TYPE quest_type AS ENUM ('learning', 'chore', 'exercise', 'creative', 'nutrition', 'challenge');
CREATE TYPE quest_status AS ENUM ('pending', 'active', 'submitted', 'verified', 'rewarded', 'rejected');
CREATE TYPE verification_type AS ENUM ('auto', 'photo', 'parent', 'timer', 'text_answer');

CREATE TABLE quests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID NOT NULL REFERENCES families(id),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,

  -- Quest info
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  type quest_type NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  estimated_minutes INTEGER DEFAULT 10,

  -- Rewards
  xp_reward INTEGER NOT NULL DEFAULT 10,
  coin_reward INTEGER NOT NULL DEFAULT 5,
  bonus_multiplier NUMERIC(3,1) DEFAULT 1.0,

  -- Status tracking
  status quest_status NOT NULL DEFAULT 'pending',
  source TEXT NOT NULL DEFAULT 'ai' CHECK (source IN ('ai', 'parent', 'system')),

  -- Verification
  verification verification_type NOT NULL DEFAULT 'parent',
  verification_config JSONB DEFAULT '{}',

  -- Submission
  submission JSONB,

  -- Ratings (bidirectional)
  parent_rating SMALLINT CHECK (parent_rating BETWEEN 1 AND 5),
  child_fun_rating SMALLINT CHECK (child_fun_rating BETWEEN 1 AND 5),
  child_difficulty_rating SMALLINT CHECK (child_difficulty_rating BETWEEN 1 AND 5),

  -- Scheduling
  scheduled_for DATE NOT NULL DEFAULT CURRENT_DATE,
  time_slot TEXT CHECK (time_slot IN ('morning', 'afternoon', 'evening', 'anytime')),
  due_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_quests_child_date ON quests(child_id, scheduled_for);
CREATE INDEX idx_quests_status ON quests(status);

-- ============================================
-- 5. ACHIEVEMENTS
-- ============================================
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  key TEXT UNIQUE NOT NULL,
  title_zh TEXT NOT NULL,
  title_en TEXT,
  title_ja TEXT,
  description_zh TEXT NOT NULL,
  description_en TEXT,
  description_ja TEXT,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('first', 'streak', 'mastery', 'social', 'special', 'hidden')),

  -- Unlock conditions
  condition_type TEXT NOT NULL,
  condition_value INTEGER NOT NULL,

  xp_reward INTEGER DEFAULT 50,
  coin_reward INTEGER DEFAULT 25,
  rarity TEXT DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary'))
);

CREATE TABLE child_achievements (
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES achievements(id),
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (child_id, achievement_id)
);

-- ============================================
-- 6. VOCABULARY (Spaced Repetition)
-- ============================================
CREATE TABLE vocab_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,

  word TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'en',
  pronunciation TEXT,
  definition_zh TEXT NOT NULL,
  definition_en TEXT,
  example_sentence TEXT,
  example_translation TEXT,

  -- SRS state
  srs_level INTEGER NOT NULL DEFAULT 0 CHECK (srs_level BETWEEN 0 AND 8),
  ease_factor NUMERIC(3,2) DEFAULT 2.50,
  next_review_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  review_count INTEGER DEFAULT 0,
  correct_count INTEGER DEFAULT 0,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_vocab_review ON vocab_cards(child_id, next_review_at);

-- ============================================
-- 7. NEWS CHALLENGES
-- ============================================
CREATE TABLE news_challenges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  source_url TEXT,
  source_title TEXT,
  source_date DATE,

  -- AI-simplified versions (by age group)
  content_6_9 JSONB,
  content_10_12 JSONB,
  content_13_15 JSONB,

  category TEXT,
  difficulty INTEGER CHECK (difficulty BETWEEN 1 AND 5),

  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE news_submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id),
  challenge_id UUID NOT NULL REFERENCES news_challenges(id),
  answers JSONB NOT NULL,
  score INTEGER NOT NULL,
  xp_earned INTEGER NOT NULL DEFAULT 0,
  coins_earned INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- 8. POINT TRANSACTIONS (audit trail)
-- ============================================
CREATE TABLE point_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,

  coin_amount INTEGER NOT NULL DEFAULT 0,
  xp_amount INTEGER NOT NULL DEFAULT 0,

  type TEXT NOT NULL CHECK (type IN (
    'quest_reward', 'streak_bonus', 'achievement_unlock',
    'shop_purchase', 'parent_bonus', 'daily_login', 'vocab_review',
    'news_challenge', 'level_up_bonus'
  )),
  reference_id UUID,
  description TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_transactions_child ON point_transactions(child_id, created_at DESC);

-- ============================================
-- 9. DAILY SUMMARIES
-- ============================================
CREATE TABLE daily_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  date DATE NOT NULL,

  quests_completed INTEGER DEFAULT 0,
  quests_total INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  coins_earned INTEGER DEFAULT 0,
  vocab_reviewed INTEGER DEFAULT 0,
  vocab_new INTEGER DEFAULT 0,
  news_score INTEGER,
  streak_day INTEGER DEFAULT 0,

  ai_summary TEXT,

  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(child_id, date)
);

-- ============================================
-- 10. REWARD SHOP ITEMS
-- ============================================
CREATE TABLE shop_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  family_id UUID REFERENCES families(id),

  name_zh TEXT NOT NULL,
  name_en TEXT,
  description_zh TEXT,
  icon TEXT NOT NULL,

  type TEXT NOT NULL CHECK (type IN ('avatar_frame', 'theme', 'effect', 'screen_time', 'custom')),
  coin_cost INTEGER NOT NULL,

  custom_description TEXT,
  requires_parent_approval BOOLEAN DEFAULT false,

  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE shop_purchases (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  child_id UUID NOT NULL REFERENCES children(id),
  item_id UUID NOT NULL REFERENCES shop_items(id),
  coin_spent INTEGER NOT NULL,
  status TEXT DEFAULT 'purchased' CHECK (status IN ('purchased', 'pending_approval', 'approved', 'rejected')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- RLS Policies
-- ============================================
ALTER TABLE families ENABLE ROW LEVEL SECURITY;
ALTER TABLE parents ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE child_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE vocab_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_challenges ENABLE ROW LEVEL SECURITY;
ALTER TABLE news_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE point_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE shop_purchases ENABLE ROW LEVEL SECURITY;

-- Parents can read/write their family's data
CREATE POLICY "parents_family_access" ON families
  FOR ALL USING (
    id IN (SELECT family_id FROM parents WHERE id = auth.uid())
  );

CREATE POLICY "parents_children_access" ON children
  FOR ALL USING (
    family_id IN (SELECT family_id FROM parents WHERE id = auth.uid())
  );

CREATE POLICY "parents_quests_access" ON quests
  FOR ALL USING (
    family_id IN (SELECT family_id FROM parents WHERE id = auth.uid())
  );

CREATE POLICY "parents_self_access" ON parents
  FOR ALL USING (id = auth.uid());

CREATE POLICY "parents_vocab_access" ON vocab_cards
  FOR ALL USING (
    child_id IN (
      SELECT c.id FROM children c
      JOIN parents p ON p.family_id = c.family_id
      WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "parents_transactions_access" ON point_transactions
  FOR ALL USING (
    child_id IN (
      SELECT c.id FROM children c
      JOIN parents p ON p.family_id = c.family_id
      WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "parents_summaries_access" ON daily_summaries
  FOR ALL USING (
    child_id IN (
      SELECT c.id FROM children c
      JOIN parents p ON p.family_id = c.family_id
      WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "parents_shop_items_access" ON shop_items
  FOR ALL USING (
    family_id IS NULL OR
    family_id IN (SELECT family_id FROM parents WHERE id = auth.uid())
  );

CREATE POLICY "parents_shop_purchases_access" ON shop_purchases
  FOR ALL USING (
    child_id IN (
      SELECT c.id FROM children c
      JOIN parents p ON p.family_id = c.family_id
      WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "parents_achievements_read" ON achievements
  FOR SELECT USING (true);

CREATE POLICY "parents_child_achievements_access" ON child_achievements
  FOR ALL USING (
    child_id IN (
      SELECT c.id FROM children c
      JOIN parents p ON p.family_id = c.family_id
      WHERE p.id = auth.uid()
    )
  );

CREATE POLICY "parents_news_read" ON news_challenges
  FOR SELECT USING (true);

CREATE POLICY "parents_news_submissions_access" ON news_submissions
  FOR ALL USING (
    child_id IN (
      SELECT c.id FROM children c
      JOIN parents p ON p.family_id = c.family_id
      WHERE p.id = auth.uid()
    )
  );

-- Service role bypass for Edge Functions
-- (Edge functions use service_role key which bypasses RLS)

-- ============================================
-- SEED DATA: Initial Achievements (20)
-- ============================================
INSERT INTO achievements (key, title_zh, title_en, icon, category, condition_type, condition_value, xp_reward, coin_reward, rarity) VALUES
-- First achievements
('first_quest', '初出茅廬', 'First Quest', '⚔️', 'first', 'quest_count', 1, 20, 10, 'common'),
('first_streak_3', '三日不懈', 'Three Day Streak', '🔥', 'streak', 'streak_days', 3, 30, 15, 'common'),
('first_vocab_10', '識字小達人', 'Word Collector', '📊', 'mastery', 'vocab_mastered', 10, 30, 15, 'common'),

-- Streak achievements
('streak_7', '一週勇士', 'Weekly Warrior', '🏆', 'streak', 'streak_days', 7, 100, 50, 'common'),
('streak_14', '雙週英雄', 'Fortnight Hero', '⚡', 'streak', 'streak_days', 14, 200, 100, 'rare'),
('streak_30', '月之勇者', 'Monthly Legend', '🌙', 'streak', 'streak_days', 30, 500, 250, 'epic'),
('streak_100', '百日傳說', 'Century Champion', '👑', 'streak', 'streak_days', 100, 1000, 500, 'legendary'),

-- Quest count achievements
('quests_10', '見習冒險者', 'Apprentice', '✏️', 'mastery', 'quest_count', 10, 50, 25, 'common'),
('quests_50', '資深冒險者', 'Veteran', '🐾', 'mastery', 'quest_count', 50, 150, 75, 'rare'),
('quests_100', '精英冒險者', 'Elite', '🎯', 'mastery', 'quest_count', 100, 300, 150, 'epic'),
('quests_500', '傳說冒險者', 'Legendary', '🐉', 'mastery', 'quest_count', 500, 1000, 500, 'legendary'),

-- Vocab achievements
('vocab_50', '詞彙達人', 'Word Master', '🐸', 'mastery', 'vocab_mastered', 50, 150, 75, 'rare'),
('vocab_200', '語言學者', 'Linguist', '🎓', 'mastery', 'vocab_mastered', 200, 500, 250, 'epic'),

-- Level achievements
('level_5', '初階勇士', 'Rising Star', '⭐', 'mastery', 'level_reached', 5, 100, 50, 'common'),
('level_10', '中階勇士', 'Shining Star', '🌟', 'mastery', 'level_reached', 10, 200, 100, 'rare'),
('level_20', '高階勇士', 'Blazing Star', '💫', 'mastery', 'level_reached', 20, 500, 250, 'epic'),

-- News challenge achievements
('news_first', '時事觀察員', 'News Watcher', '📰', 'first', 'news_challenges', 1, 20, 10, 'common'),
('news_10', '小小記者', 'Junior Reporter', '🔑', 'mastery', 'news_challenges', 10, 150, 75, 'rare'),

-- Special
('perfect_week', '完美一週', 'Perfect Week', '💎', 'special', 'perfect_week', 1, 300, 150, 'epic'),

-- Hidden
('midnight_owl', '午夜貓頭鷹', 'Midnight Owl', '🦉', 'hidden', 'quest_count', 0, 50, 25, 'rare')
ON CONFLICT (key) DO NOTHING;

-- ============================================
-- SEED DATA: Default Shop Items (Global)
-- ============================================
INSERT INTO shop_items (name_zh, name_en, icon, type, coin_cost) VALUES
('金色頭像框', 'Gold Frame', '🖼️', 'avatar_frame', 100),
('星空主題', 'Starry Theme', '🌌', 'theme', 200),
('彩虹特效', 'Rainbow Effect', '🌈', 'effect', 150),
('火焰特效', 'Fire Effect', '🔥', 'effect', 150),
('30分鐘螢幕時間', '30min Screen Time', '📱', 'screen_time', 50),
('60分鐘螢幕時間', '60min Screen Time', '📱', 'screen_time', 90);

-- ============================================
-- Helper Functions
-- ============================================

-- Calculate level from XP
CREATE OR REPLACE FUNCTION calc_level(xp INTEGER) RETURNS INTEGER AS $$
BEGIN
  RETURN GREATEST(1, FLOOR(SQRT(xp::NUMERIC / 50)) + 1);
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- Update child level when XP changes
CREATE OR REPLACE FUNCTION update_child_level() RETURNS TRIGGER AS $$
BEGIN
  NEW.level := calc_level(NEW.xp);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_level
  BEFORE UPDATE OF xp ON children
  FOR EACH ROW
  EXECUTE FUNCTION update_child_level();

-- Update streak on quest completion
CREATE OR REPLACE FUNCTION update_streak() RETURNS TRIGGER AS $$
DECLARE
  child RECORD;
BEGIN
  IF NEW.status = 'rewarded' AND OLD.status != 'rewarded' THEN
    SELECT * INTO child FROM children WHERE id = NEW.child_id;

    IF child.last_active_date = CURRENT_DATE THEN
      NULL;
    ELSIF child.last_active_date = CURRENT_DATE - 1 THEN
      UPDATE children SET
        streak_days = streak_days + 1,
        last_active_date = CURRENT_DATE
      WHERE id = NEW.child_id;
    ELSE
      UPDATE children SET
        streak_days = 1,
        last_active_date = CURRENT_DATE
      WHERE id = NEW.child_id;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_update_streak
  AFTER UPDATE OF status ON quests
  FOR EACH ROW
  EXECUTE FUNCTION update_streak();

-- Auto-add XP and coins when quest is rewarded
CREATE OR REPLACE FUNCTION reward_quest() RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'rewarded' AND OLD.status != 'rewarded' THEN
    -- Update child XP and coins
    UPDATE children SET
      xp = xp + NEW.xp_reward * NEW.bonus_multiplier,
      star_coins = star_coins + NEW.coin_reward * NEW.bonus_multiplier
    WHERE id = NEW.child_id;

    -- Record transaction
    INSERT INTO point_transactions (child_id, xp_amount, coin_amount, type, reference_id, description)
    VALUES (
      NEW.child_id,
      NEW.xp_reward * NEW.bonus_multiplier,
      NEW.coin_reward * NEW.bonus_multiplier,
      'quest_reward',
      NEW.id,
      NEW.title
    );
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_reward_quest
  AFTER UPDATE OF status ON quests
  FOR EACH ROW
  EXECUTE FUNCTION reward_quest();
