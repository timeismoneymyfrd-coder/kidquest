import { Howl } from 'howler';

type SoundName = 'quest_complete' | 'coin_earn' | 'level_up' | 'achievement' | 'button_tap' | 'streak_fire';

const sounds: Record<SoundName, Howl | null> = {
  quest_complete: null,
  coin_earn: null,
  level_up: null,
  achievement: null,
  button_tap: null,
  streak_fire: null,
};

// Lazy-load sounds on first interaction
let initialized = false;

function initSounds() {
  if (initialized) return;
  initialized = true;

  // Using placeholder paths - replace with actual sound files
  const soundConfig: Record<SoundName, { src: string; volume: number }> = {
    quest_complete: { src: '/sounds/quest_complete.mp3', volume: 0.7 },
    coin_earn: { src: '/sounds/coin_earn.mp3', volume: 0.5 },
    level_up: { src: '/sounds/level_up.mp3', volume: 0.8 },
    achievement: { src: '/sounds/achievement.mp3', volume: 0.7 },
    button_tap: { src: '/sounds/button_tap.mp3', volume: 0.3 },
    streak_fire: { src: '/sounds/streak_fire.mp3', volume: 0.5 },
  };

  Object.entries(soundConfig).forEach(([name, config]) => {
    try {
      sounds[name as SoundName] = new Howl({
        src: [config.src],
        volume: config.volume,
        preload: false,
      });
    } catch {
      // Sound file not found, silently ignore
    }
  });
}

export function playSound(name: SoundName) {
  initSounds();
  try {
    sounds[name]?.play();
  } catch {
    // Ignore sound errors
  }
}

export function stopAllSounds() {
  Object.values(sounds).forEach((s) => s?.stop());
}
