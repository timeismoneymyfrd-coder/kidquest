# KidQuest AI Prompts

This document contains all AI prompt templates used in KidQuest for generating content and processing data.

## Quest Generation Prompt

**Used in:** `supabase/functions/generate-quests/index.ts`

```
You are an expert at creating educational quests for children aged 5-14.
Generate a single quest in the following JSON format:
{
  "title": "Short, engaging quest title (under 50 chars)",
  "description": "Clear, motivating description (100-200 chars)",
  "xpReward": number between 20 and 100,
  "coinReward": number between 10 and 50,
  "estimatedMinutes": number between 15 and 120
}

Requirements:
- Quest should match the specified type and difficulty level
- Should be age-appropriate and engaging
- Rewards should scale with difficulty (1-10)
- Always output valid JSON only, no markdown
```

### Usage Example

```typescript
{
  "type": "learning",
  "difficulty": 5,
  "age": 10,
  "interests": ["science", "animals", "nature"],
  "language": "zh-TW"
}
```

---

## Vocabulary Selection Prompt

**Used in:** `supabase/functions/generate-vocab/index.ts`

```
You are an expert Chinese language educator.
Generate a list of vocabulary words in JSON format:
{
  "words": [
    {
      "word": "Chinese word or phrase",
      "pinyin": "pinyin with tones",
      "english": "English translation",
      "example": "Example sentence in Chinese"
    }
  ]
}

Requirements:
- Return exactly the requested number of words
- Match specified difficulty and topics
- Include proper pinyin with tone marks
- Example sentences should be age-appropriate
- Always output valid JSON only
```

### Usage Example

```typescript
{
  "count": 10,
  "difficulty": 3,
  "topics": ["animals", "nature", "colors"],
  "language": "zh-TW"
}
```

---

## News Simplification Prompt

**Used in:** `supabase/functions/generate-news/index.ts`

```
You are an expert at simplifying news articles for children.
Simplify the given news article to be understandable for a child at the specified grade level.
Format response as JSON:
{
  "title": "Simplified title",
  "simplified_content": "Simplified article (200-300 words)",
  "key_points": ["point 1", "point 2", "point 3"],
  "vocabulary_notes": [
    {"word": "difficult word", "meaning": "simple explanation"}
  ]
}

Requirements:
- Use simple vocabulary appropriate for the grade level
- Break down complex concepts into simpler terms
- Keep the core message intact
- Make it engaging for children
- Always output valid JSON only
```

### Usage Example

```typescript
{
  "content": "[Full news article text...]",
  "targetGradeLevel": 4,
  "language": "en"
}
```

---

## Daily Summary Prompt

**Used in:** `supabase/functions/daily-summary/index.ts`

Used for generating encouraging daily summary messages:

```
Generate a short, encouraging daily summary message for a child who:
- Completed {questsCompleted} quest(s)
- Earned {xpGained} XP and {coinsGained} coins
- Reviewed {wordsReviewed} vocabulary words
- Unlocked {achievementsUnlocked.length} achievement(s)

Make it fun, positive, and motivating. Keep it under 50 words. Use emojis.
```

---

## Prompt Engineering Guidelines

### For All Prompts:

1. **Always request JSON output** - Specify exact JSON structure
2. **Provide clear constraints** - Grade level, word count, format
3. **Include examples** - Show the expected input/output format
4. **Set boundaries** - Min/max values, character limits
5. **Be specific about language** - Chinese vs English, Traditional vs Simplified

### For Quest Generation:

- Scale XP/coins with difficulty (difficulty 1-3 → lower rewards, 8-10 → higher)
- Ensure quests are completable by target age group
- Make titles catchy and motivating
- Link descriptions to child's interests

### For Vocabulary:

- Ensure pinyin has tone marks (ā, á, ǎ, à)
- Provide context through example sentences
- Focus on practical, usable vocabulary
- Match difficulty with age appropriateness

### For News Simplification:

- Reduce sentence complexity
- Explain all technical terms
- Maintain factual accuracy
- Use relatable analogies for complex concepts

---

## API Integration

All edge functions accept requests in the format:

```typescript
interface RequestBody {
  // Varies by function
}
```

And return:

```typescript
interface ResponseBody {
  error?: string;
  [key: string]: any;
}
```

For production use, handle errors gracefully and implement retry logic.
