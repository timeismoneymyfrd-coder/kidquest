import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const NEWS_SIMPLIFY_PROMPT = `你是一位兒童新聞編輯。將以下新聞改寫為適合 {ageGroup} 歲兒童閱讀的版本。

## 原始新聞
{newsContent}

## 要求
1. 用簡單的語言解釋發生了什麼
2. 移除任何暴力、政治偏見、或不適合兒童的內容
3. 加入背景知識讓孩子理解
4. 生成 3 道理解測驗題（選擇題）
5. 繁體中文

## 輸出格式（嚴格 JSON）
{
  "title": "簡化後標題",
  "summary": "200字以內的簡化摘要",
  "key_facts": ["重點1", "重點2", "重點3"],
  "new_words": [{"word": "...", "definition": "..."}],
  "questions": [
    {
      "question": "問題",
      "options": ["A", "B", "C", "D"],
      "correct": 0,
      "explanation": "為什麼這是正確答案"
    }
  ],
  "discussion_prompt": "一個開放式討論問題"
}

只輸出 JSON。`;

// Simple RSS parser
async function fetchRSSNews(): Promise<Array<{ title: string; url: string; content: string }>> {
  const RSS_FEEDS = [
    'https://news.google.com/rss/topics/CAAqJggKIiBDQkFTRWdvSUwyMHZNRGRqTVhZU0FucG9MWlJYSUFBUAE?hl=zh-TW&gl=TW&ceid=TW:zh-Hant',
  ];

  const articles: Array<{ title: string; url: string; content: string }> = [];

  for (const feedUrl of RSS_FEEDS) {
    try {
      const resp = await fetch(feedUrl);
      const xml = await resp.text();

      // Simple XML parsing for RSS items
      const items = xml.match(/<item>([\s\S]*?)<\/item>/g) || [];
      for (const item of items.slice(0, 3)) {
        const title = item.match(/<title>(.*?)<\/title>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '') || '';
        const link = item.match(/<link>(.*?)<\/link>/)?.[1] || '';
        const description = item.match(/<description>(.*?)<\/description>/)?.[1]?.replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]*>/g, '') || '';

        if (title && description) {
          articles.push({ title, url: link, content: `${title}\n\n${description}` });
        }
      }
    } catch (err) {
      console.error('RSS fetch error:', err);
    }
  }

  return articles;
}

serve(async (req) => {
  try {
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch news from RSS
    const articles = await fetchRSSNews();
    if (articles.length === 0) {
      return new Response(JSON.stringify({ error: 'No articles found' }), { status: 404 });
    }

    const results = [];

    for (const article of articles.slice(0, 2)) {
      // Generate 3 age-group versions
      const versions: Record<string, unknown> = {};

      for (const ageGroup of ['6-9', '10-12', '13-15']) {
        const prompt = NEWS_SIMPLIFY_PROMPT
          .replace('{ageGroup}', ageGroup)
          .replace('{newsContent}', article.content);

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
        versions[`content_${ageGroup.replace('-', '_')}`] = JSON.parse(aiResult.content[0].text);
      }

      // Insert into DB
      const { data, error } = await supabase
        .from('news_challenges')
        .insert({
          source_url: article.url,
          source_title: article.title,
          source_date: new Date().toISOString().split('T')[0],
          content_6_9: versions.content_6_9,
          content_10_12: versions.content_10_12,
          content_13_15: versions.content_13_15,
          category: 'world',
          difficulty: 3,
          active: true,
        })
        .select()
        .single();

      if (data) results.push(data);
    }

    return new Response(JSON.stringify({ challenges: results }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 });
  }
});
