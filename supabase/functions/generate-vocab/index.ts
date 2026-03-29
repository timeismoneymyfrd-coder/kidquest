import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const VOCAB_SELECTION_PROMPT = `為一位 {age} 歲、{vocabLevel} 程度的孩子選擇 {count} 個英文單詞。

## 已學單詞（避免重複）
{knownWords}

## 孩子興趣
{interests}

## 要求
1. 選擇適合年齡和程度的單詞
2. 盡量和孩子興趣相關
3. 混合不同詞性（名詞、動詞、形容詞）
4. 提供實用的例句

## 輸出格式（嚴格 JSON）
[{
  "word": "...",
  "pronunciation": "...",
  "definition_zh": "...",
  "example_sentence": "...",
  "example_translation": "...",
  "difficulty": 1-5,
  "category": "noun|verb|adjective|adverb|phrase"
}]

只輸出 JSON。`;

serve(async (req) => {
  try {
    const { child_id, count = 5 } = await req.json();

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const { data: child } = await supabase
      .from('children')
      .select('*')
      .eq('id', child_id)
      .single();

    if (!child) {
      return new Response(JSON.stringify({ error: 'Child not found' }), { status: 404 });
    }

    // Get existing words to avoid duplicates
    const { data: existingCards } = await supabase
      .from('vocab_cards')
      .select('word')
      .eq('child_id', child_id);

    const knownWords = existingCards?.map((c) => c.word).join(', ') || '無';
    const age = child.birth_year ? new Date().getFullYear() - child.birth_year : 10;

    const prompt = VOCAB_SELECTION_PROMPT
      .replace('{age}', String(age))
      .replace('{vocabLevel}', child.vocab_level || 'beginner')
      .replace('{count}', String(count))
      .replace('{knownWords}', knownWords)
      .replace('{interests}', (child.interests || []).join(', ') || '未設定');

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
    const vocabJson = JSON.parse(aiResult.content[0].text);

    // Insert vocab cards
    const cardsToInsert = vocabJson.map((v: Record<string, unknown>) => ({
      child_id: child.id,
      word: v.word,
      language: 'en',
      pronunciation: v.pronunciation,
      definition_zh: v.definition_zh,
      example_sentence: v.example_sentence,
      example_translation: v.example_translation,
      srs_level: 0,
      next_review_at: new Date().toISOString(),
    }));

    const { data: inserted, error } = await supabase
      .from('vocab_cards')
      .insert(cardsToInsert)
      .select();

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ cards: inserted }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
