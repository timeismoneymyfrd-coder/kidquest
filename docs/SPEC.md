# KidQuest Specification

This document links to the comprehensive KidQuest specification.

**Full Specification:** See the specification PDF provided separately.

This monorepo implements the complete KidQuest platform as specified, including:

## Platform Overview

KidQuest is a gamified, AI-powered learning platform for children aged 5-14 that combines:
- Interactive educational quests
- Spaced Repetition System (SRS) for vocabulary learning
- News reading and comprehension challenges
- Achievement and reward systems
- Parent oversight and progress tracking

## Core Components

### Frontend (React + Vite + TypeScript PWA)

Located in `apps/web/`

- **Child Interface**: RPG-themed dark mode with bottom navigation
- **Parent Interface**: Clean, functional dashboard with sidebar navigation
- **Routes**: Organized by role (auth, child, parent)
- **Components**: Reusable UI, gamification, vocab, quest components
- **State Management**: Zustand stores for auth, games, quests, vocab
- **Styling**: Tailwind with custom design tokens

### Backend (Supabase)

Located in `supabase/`

- **Database**: PostgreSQL schema with 10 tables
- **Authentication**: Supabase Auth (parent email/password, child PIN)
- **Edge Functions**: Deno TypeScript functions for AI integration
- **RLS**: Row-level security policies for multi-tenant safety

### Edge Functions

1. **generate-quests** - AI quest generation using Claude API
2. **generate-vocab** - Vocabulary selection with pinyin
3. **generate-news** - News simplification for reading comprehension
4. **check-achievements** - Achievement unlock logic
5. **daily-summary** - AI-generated daily summary messages

## Database Schema

10 Tables:
1. `users` - Extended auth with role and PIN
2. `families` - Parent-managed family groups
3. `children` - Child profiles with stats
4. `quests` - Quest templates and instances
5. `quest_submissions` - Quest completion records
6. `vocabularies` - Chinese vocab with pinyin
7. `vocab_reviews` - SRS review tracking
8. `achievements` - Achievement definitions
9. `child_achievements` - Achievement unlock records
10. `reward_shop_items` - Purchasable rewards

## Design System

### Colors

**Child Theme (RPG)**:
- Primary: #0a0e27 (Dark blue)
- Secondary: #131842 (Darker blue)
- Card: #1a1f4e (Card background)
- Accent Gold: #ffd700 (XP, coins)
- Accent Cyan: #00e5ff (Quests)
- Accent Pink: #ff4081 (Streaks)
- Accent Green: #69f0ae (Success)
- Accent Purple: #b388ff (Vocab)

**Parent Theme**:
- Background: #f8fafc (Light gray)
- Card: #ffffff (White)
- Accent: #3b82f6 (Blue)
- Success: #22c55e (Green)

### Typography

- **Display**: Fredoka (headings, titles)
- **Body**: Noto Sans TC (content, traditional Chinese support)

## Key Features

### 1. Quest System
- 6 quest types: learning, chore, exercise, creative, nutrition, challenge
- Multiple verification types: auto, photo, parent, timer, text_answer
- XP and coin rewards with streaks
- Parent review and approval

### 2. Vocabulary Learning
- SRS (Spaced Repetition System) with SM-2 algorithm
- 5 review intervals: 1, 3, 7, 14, 30 days
- Support for Chinese with pinyin
- Difficulty-based selection

### 3. News Challenges
- RSS feed integration
- AI-powered simplification
- Reading comprehension quizzes
- Grade-level adaptation

### 4. Achievement System
- 20 predefined achievements
- Condition types: quest_count, xp_total, level_reached, streak, vocab_mastered
- Toast notifications on unlock
- Level-up celebrations

### 5. Reward Shop
- 20+ reward items
- Cost-based economy
- Parent fulfillment tracking
- Category organization

### 6. Progress Tracking
- Real-time parent dashboard
- Per-child detailed reports
- Activity logs
- Streak tracking

## File Structure

```
kidquest/
├── apps/web/                          # React PWA frontend
│   ├── src/
│   │   ├── routes/                    # Page components
│   │   │   ├── auth/                  # Login, Register, ChildPin
│   │   │   ├── child/                 # 8 child pages
│   │   │   └── parent/                # 6 parent pages
│   │   ├── components/                # Reusable components
│   │   ├── stores/                    # Zustand stores
│   │   ├── lib/                       # Utilities (Supabase, AI, sounds, i18n)
│   │   └── styles/                    # Global CSS
│   └── public/                        # PWA assets
├── supabase/
│   ├── migrations/                    # SQL schema
│   ├── functions/                     # Edge functions (Deno/TS)
│   └── config.toml                    # Local dev config
├── docs/
│   ├── SPEC.md                        # This file
│   └── PROMPTS.md                     # AI prompt templates
└── package.json, pnpm-workspace.yaml, turbo.json
```

## Setup Instructions

### Prerequisites
- Node.js 18+
- pnpm 8+
- Supabase CLI
- Deno (for edge functions)

### Installation

```bash
# Install dependencies
pnpm install

# Set up environment
cp .env.example .env.local

# Start local Supabase
supabase start

# Run development servers
pnpm dev
```

### Environment Variables

See `.env.example` for required variables:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `ANTHROPIC_API_KEY` (for AI features)
- `VAPID_PUBLIC_KEY` (for push notifications)

## Development

### Monorepo Structure

Uses Turbo for build orchestration and pnpm for workspace management.

```bash
# Run dev across all packages
pnpm dev

# Build everything
pnpm build

# Run linting
pnpm lint

# Type checking
pnpm type-check
```

### Adding Features

1. **New Route**: Add component to `apps/web/src/routes/`
2. **New Component**: Add to `apps/web/src/components/`
3. **New Store**: Create in `apps/web/src/stores/`
4. **New Edge Function**: Create in `supabase/functions/`
5. **Database Changes**: Add migration to `supabase/migrations/`

## Deployment

### Frontend (Vite Build)

```bash
pnpm build
# Outputs to apps/web/dist/
```

Deploy to Vercel, Netlify, or static hosting.

### Backend (Supabase)

```bash
supabase deploy
```

Deploys migrations and edge functions to Supabase cloud.

## Security

- Row-level security (RLS) on all tables
- Child PIN-based authentication (no email)
- Parent email/password authentication
- Service role key for admin operations
- JWT verification on edge functions

## Performance

- SWR caching with TanStack Query
- Optimistic updates for quests
- Service worker for offline support
- Image optimization
- Code splitting by route

## Accessibility

- Semantic HTML
- ARIA labels on custom components
- Keyboard navigation support
- High contrast colors
- Touch-friendly interface (48px+ targets)

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Android)
- PWA capabilities (installable, offline support)

## Future Enhancements

- Multiplayer quiz battles
- Custom quest templates for parents
- Integration with school curricula
- Social features (family groups, challenges)
- Advanced analytics
- AI-powered personalized curriculum
