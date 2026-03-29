import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const QUEST_GENERATION_PROMPT = `你是「小勇士」遊戲的任務大師。根據以下資訊為孩子生成今日任務。

## 孩子資料
- 名字：{childName}
- 年齡：{age} 歲
- 興趣：{interests}
- 當前等級：Lv.{level}
- 連續天數：{streakDays}
- 最近完成的任務類型：{recentTypes}
- 最近的趣味評分平均：{avgFunRating}/5
- 最近的難度評分平均：{avgDifficultyRating}/5

## 當前時段
{timeSlot} (早上/下午/晚上)

## 要求
生成 {count} 個任務，遵守：
1. 至少 1 個學習類、1 個家務類、1 個趣味類
2. 難度需匹配孩子的等級和評分反饋
3. 描述用冒險 RPG 風格，讓任務聽起來像遊戲任務
4. 如果趣味評分偏低，增加有趣的任務
5. 如果難度評分偏高，適當降低難度
6. 每個任務需要明確的完成驗證方式
7. 語言：繁體中文

## 輸出格式（嚴格 JSON）
[{
  "title": "任務標題（RPG風格）",
  "description": "任務描述（具體指示+冒險敘述）",
  "type": "learning|chore|exercise|creative|nutrition|challenge",
  "difficulty": 1-5,
  "xp_reward": 10-100,
  "coin_reward": 5-50,
  "estimated_minutes": 5-60,
  "time_slot": "morning|afternoon|evening|anytime",
  "verification": "auto|photo|parent|timer|text_answer",
  "verification_config": {},
  "fun_hook": "為什麼這個任務好玩（一句話）"
}]

只輸出 JSON，不要其他文字。`;

serve(async (req) => {
  try {
    const { child_id, count = 5, time_slot = 'anytime' } = await req.json();

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch child data
    const { data: child, error: childError } = await supabase
      .from('children')
      .select('*')
      .eq('id', child_id)
      .single();

    if (childError || !child) {
      return new Response(JSON.stringify({ error: 'Child not found' }), { status: 404 });
    }

    // Fetch recent quests for context
    const { data: recentQuests } = await supabase
      .from('quests')
      .select('type, child_fun_rating, child_difficulty_rating')
      .eq('child_id', child_id)
      .eq('status', 'rewarded')
      .order('completed_at', { ascending: false })
      .limit(20);

    const recentTypes = [...new Set(recentQuests?.map((q) => q.type) || [])].join(', ');
    const avgFunRating = recentQuests?.length
      ? (recentQuests.reduce((sum, q) => sum + (q.child_fun_rating || 3), 0) / recentQuests.length).toFixed(1)
      : '3.0';
    const avgDifficultyRating = recentQuests?.length
      ? (recentQuests.reduce((sum, q) => sum + (q.child_difficulty_rating || 3), 0) / recentQuests.length).toFixed(1)
      : '3.0';

    const age = child.birth_year ? new Date().getFullYear() - child.birth_year : 10;

    // Build prompt
    const prompt = QUEST_GENERATION_PROMPT
      .replace('{childName}', child.display_name)
      .replace('{age}', String(age))
      .replace('{interests}', (child.interests || []).join(', ') || '未設定')
      .replace('{level}', String(child.level))
      .replace('{streakDays}', String(child.streak_days))
      .replace('{recentTypes}', recentTypes || '無')
      .replace('{avgFunRating}', avgFunRating)
      .replace('{avgDifficultyRating}', avgDifficultyRating)
      .replace('{timeSlot}', time_slot)
      .replace('{count}', String(count));

    // Call Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 4096,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const aiResult = await response.json();
    const questsJson = JSON.parse(aiResult.content[0].text);

    // Insert quests into DB
    const questsToInsert = questsJson.map((q: Record<string, unknown>) => ({
      family_id: child.family_id,
      child_id: child.id,
      title: q.title,
      description: q.description,
      type: q.type,
      difficulty: q.difficulty,
      estimated_minutes: q.estimated_minutes,
      xp_reward: q.xp_reward,
      coin_reward: q.coin_reward,
      status: 'pending',
      source: 'ai',
      verification: q.verification,
      verification_config: q.verification_config || {},
      scheduled_for: new Date().toISOString().split('T')[0],
      time_slot: q.time_slot,
    }));

    const { data: inserted, error: insertError } = await supabase
      .from('quests')
      .insert(questsToInsert)
      .select();

    if (insertError) {
      return new Response(JSON.stringify({ error: insertError.message }), { status: 500 });
    }

    // Trigger achievement check
    await supabase.functions.invoke('check-achievements', {
      body: { child_id },
    });

    return new Response(JSON.stringify({ quests: inserted }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
