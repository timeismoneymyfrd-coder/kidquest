const ANTHROPIC_PROXY_URL = import.meta.env.VITE_AI_PROXY_URL || '/api/ai';

export async function generateQuests(childContext: {
  childName: string;
  age: number;
  interests: string[];
  level: number;
  streakDays: number;
  recentTypes: string[];
  avgFunRating: number;
  avgDifficultyRating: number;
  timeSlot: string;
  count: number;
}) {
  // This should be called via Supabase Edge Function, not directly
  const { data, error } = await fetch(`${ANTHROPIC_PROXY_URL}/generate-quests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(childContext),
  }).then((r) => r.json());

  if (error) throw new Error(error);
  return data;
}

export async function generateVocab(params: {
  age: number;
  vocabLevel: string;
  interests: string[];
  knownWords: string[];
  count: number;
}) {
  const { data, error } = await fetch(`${ANTHROPIC_PROXY_URL}/generate-vocab`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(params),
  }).then((r) => r.json());

  if (error) throw new Error(error);
  return data;
}
