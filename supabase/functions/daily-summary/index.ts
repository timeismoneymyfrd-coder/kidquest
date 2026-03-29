import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  try {
    const { family_id, date } = await req.json();
    const targetDate = date || new Date().toISOString().split('T')[0];
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Get all children in family
    const { data: children } = await supabase
      .from('children')
      .select('*')
      .eq('family_id', family_id);

    if (!children?.length) {
      return new Response(JSON.stringify({ error: 'No children found' }), { status: 404 });
    }

    const summaries = [];

    for (const child of children) {
      // Aggregate daily stats
      const { data: dayQuests } = await supabase
        .from('quests')
        .select('*')
        .eq('child_id', child.id)
        .eq('scheduled_for', targetDate);

      const questsCompleted = dayQuests?.filter((q) => q.status === 'rewarded').length || 0;
      const questsTotal = dayQuests?.length || 0;
      const xpEarned = dayQuests
        ?.filter((q) => q.status === 'rewarded')
        .reduce((sum, q) => sum + q.xp_reward, 0) || 0;
      const coinsEarned = dayQuests
        ?.filter((q) => q.status === 'rewarded')
        .reduce((sum, q) => sum + q.coin_reward, 0) || 0;

      // Vocab stats
      const { count: vocabReviewed } = await supabase
        .from('vocab_cards')
        .select('*', { count: 'exact', head: true })
        .eq('child_id', child.id)
        .gte('next_review_at', `${targetDate}T00:00:00`)
        .lt('next_review_at', `${targetDate}T23:59:59`);

      // News stats
      const { data: newsSubmissions } = await supabase
        .from('news_submissions')
        .select('score')
        .eq('child_id', child.id)
        .gte('completed_at', `${targetDate}T00:00:00`)
        .lt('completed_at', `${targetDate}T23:59:59`);

      const newsScore = newsSubmissions?.length
        ? Math.round(newsSubmissions.reduce((sum, n) => sum + n.score, 0) / newsSubmissions.length)
        : null;

      // Generate AI summary for parent
      const summaryPrompt = `為家長簡短總結孩子「${child.display_name}」今天的表現（2-3句話，繁體中文）：
- 完成 ${questsCompleted}/${questsTotal} 個任務
- 獲得 ${xpEarned} XP, ${coinsEarned} 星幣
- 複習了 ${vocabReviewed || 0} 個單詞
- 新聞挑戰平均分: ${newsScore !== null ? newsScore : '未參加'}
- 連續天數: ${child.streak_days} 天
- 當前等級: Lv.${child.level}

用溫暖鼓勵的語氣。只輸出總結文字。`;

      let aiSummary = null;
      try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': ANTHROPIC_API_KEY,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 500,
            messages: [{ role: 'user', content: summaryPrompt }],
          }),
        });
        const aiResult = await response.json();
        aiSummary = aiResult.content[0].text;
      } catch (err) {
        console.error('AI summary error:', err);
      }

      // Upsert daily summary
      const { data: summary, error } = await supabase
        .from('daily_summaries')
        .upsert({
          child_id: child.id,
          date: targetDate,
          quests_completed: questsCompleted,
          quests_total: questsTotal,
          xp_earned: xpEarned,
          coins_earned: coinsEarned,
          vocab_reviewed: vocabReviewed || 0,
          news_score: newsScore,
          streak_day: child.streak_days,
          ai_summary: aiSummary,
        }, { onConflict: 'child_id,date' })
        .select()
        .single();

      if (summary) summaries.push(summary);
    }

    return new Response(JSON.stringify({ summaries }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
