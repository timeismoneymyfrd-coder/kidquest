import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  try {
    const { child_id } = await req.json();
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get child data
    const { data: child } = await supabase
      .from('children')
      .select('*')
      .eq('id', child_id)
      .single();

    if (!child) {
      return new Response(JSON.stringify({ error: 'Child not found' }), { status: 404 });
    }

    // Get all achievements not yet unlocked
    const { data: unlocked } = await supabase
      .from('child_achievements')
      .select('achievement_id')
      .eq('child_id', child_id);

    const unlockedIds = new Set(unlocked?.map((a) => a.achievement_id) || []);

    const { data: allAchievements } = await supabase
      .from('achievements')
      .select('*');

    if (!allAchievements) {
      return new Response(JSON.stringify({ unlocked: [] }));
    }

    // Get stats
    const { count: questCount } = await supabase
      .from('quests')
      .select('*', { count: 'exact', head: true })
      .eq('child_id', child_id)
      .eq('status', 'rewarded');

    const { count: vocabMastered } = await supabase
      .from('vocab_cards')
      .select('*', { count: 'exact', head: true })
      .eq('child_id', child_id)
      .gte('srs_level', 6);

    const { count: newsChallenges } = await supabase
      .from('news_submissions')
      .select('*', { count: 'exact', head: true })
      .eq('child_id', child_id);

    const stats: Record<string, number> = {
      quest_count: questCount || 0,
      streak_days: child.streak_days,
      level_reached: child.level,
      vocab_mastered: vocabMastered || 0,
      news_challenges: newsChallenges || 0,
      coins_earned: child.star_coins,
    };

    // Check each achievement
    const newlyUnlocked = [];

    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.id)) continue;

      const currentValue = stats[achievement.condition_type] || 0;
      if (currentValue >= achievement.condition_value) {
        // Unlock achievement
        const { error } = await supabase
          .from('child_achievements')
          .insert({
            child_id,
            achievement_id: achievement.id,
          });

        if (!error) {
          // Award XP and coins
          await supabase
            .from('children')
            .update({
              xp: child.xp + achievement.xp_reward,
              star_coins: child.star_coins + achievement.coin_reward,
            })
            .eq('id', child_id);

          // Record transaction
          await supabase
            .from('point_transactions')
            .insert({
              child_id,
              xp_amount: achievement.xp_reward,
              coin_amount: achievement.coin_reward,
              type: 'achievement_unlock',
              reference_id: achievement.id,
              description: achievement.title_zh,
            });

          newlyUnlocked.push(achievement);
        }
      }
    }

    return new Response(JSON.stringify({ unlocked: newlyUnlocked }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
