# KidQuest - 小勇士

A gamified, AI-powered learning platform for children aged 5-14 featuring interactive quests, vocabulary learning with spaced repetition, news reading challenges, and parent oversight.

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- Supabase CLI

### Installation

```bash
# Clone and enter directory
cd kidquest

# Install dependencies
pnpm install

# Copy environment template
cp .env.example .env.local

# Edit .env.local with your Supabase credentials
# VITE_SUPABASE_URL=https://xxxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=xxxxx
# ANTHROPIC_API_KEY=xxxxx (for AI features)

# Start local Supabase (optional for development)
supabase start

# Run development servers
pnpm dev
```

The app will be available at `http://localhost:5173`

## Project Structure

```
kidquest/
├── apps/web/                    # React PWA frontend
│   ├── src/
│   │   ├── main.tsx            # Entry point
│   │   ├── App.tsx             # Router setup
│   │   ├── routes/             # Page components
│   │   │   ├── auth/           # Login, Register, ChildPin
│   │   │   ├── child/          # QuestBoard, VocabArena, etc.
│   │   │   └── parent/         # Dashboard, QuestReview, etc.
│   │   ├── components/         # Reusable UI components
│   │   │   ├── ui/             # Button, Card, Input, Modal, Badge, ProgressBar
│   │   │   ├── quest/          # QuestCard, SubmissionForm
│   │   │   ├── gamification/   # XPBar, CoinCounter, StreakFire, Confetti, etc.
│   │   │   ├── vocab/          # FlashCard, SRSProgress
│   │   │   └── layout/         # ChildLayout, ParentLayout, AuthLayout
│   │   ├── stores/             # Zustand state management
│   │   │   ├── authStore.ts
│   │   │   ├── gameStore.ts
│   │   │   ├── questStore.ts
│   │   │   └── vocabStore.ts
│   │   ├── lib/                # Utilities
│   │   │   ├── supabase.ts     # Supabase client
│   │   │   ├── ai.ts           # AI client wrapper
│   │   │   ├── sounds.ts       # Audio management
│   │   │   └── i18n.ts         # Internationalization
│   │   ├── styles/             # Global CSS
│   │   └── types/              # TypeScript definitions
│   ├── public/                 # PWA assets
│   │   ├── sw.js              # Service worker
│   │   └── manifest.json       # PWA manifest
│   ├── index.html             # HTML template
│   ├── vite.config.ts         # Vite configuration
│   ├── tailwind.config.ts      # Tailwind CSS config
│   └── package.json
├── supabase/
│   ├── migrations/
│   │   └── 001_initial_schema.sql     # Database schema
│   ├── functions/              # Edge Functions (Deno/TypeScript)
│   │   ├── generate-quests/
│   │   ├── generate-vocab/
│   │   ├── generate-news/
│   │   ├── check-achievements/
│   │   └── daily-summary/
│   └── config.toml            # Local dev config
├── docs/
│   ├── SPEC.md                # Full specification
│   └── PROMPTS.md             # AI prompt templates
├── package.json               # Root package
├── pnpm-workspace.yaml        # pnpm workspace config
├── turbo.json                 # Turbo build config
└── .env.example               # Environment template
```

## Features

### For Children

- **Interactive Quests**: 6 types (learning, chore, exercise, creative, nutrition, challenge)
- **Vocabulary Learning**: SRS (Spaced Repetition System) with Chinese words and pinyin
- **News Challenges**: Read simplified news articles and answer comprehension questions
- **Achievement System**: Unlock 20+ achievements with goals
- **Reward Shop**: Spend earned coins on real-world rewards
- **Leaderboard**: Family ranking with streaks and levels
- **RPG Theme**: Dark gamified interface with animations and sound effects

### For Parents

- **Dashboard**: Overview of family activity and progress
- **Quest Review**: Approve/reject submissions
- **Quest Creation**: Create custom quests or use templates
- **Progress Tracking**: Per-child detailed analytics
- **Family Management**: Manage multiple children
- **Settings**: Customize timezone and notifications

## Tech Stack

### Frontend
- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Zustand** - State management
- **React Router** - Routing
- **TanStack Query** - Data fetching
- **Framer Motion** - Animations
- **Howler.js** - Audio management

### Backend
- **Supabase** - PostgreSQL database + auth
- **Edge Functions** - Deno/TypeScript serverless functions
- **Anthropic Claude API** - AI content generation

### DevOps
- **pnpm** - Package manager
- **Turbo** - Monorepo build tool
- **PWA** - Progressive Web App

## Available Scripts

```bash
# Development
pnpm dev              # Start dev servers

# Building
pnpm build           # Build all packages
pnpm build:web       # Build web only

# Quality checks
pnpm lint            # Run ESLint
pnpm type-check      # TypeScript type checking
pnpm format          # Format code with Prettier

# Supabase
pnpm supabase:start  # Start local Supabase
pnpm supabase:reset  # Reset local database
pnpm supabase:deploy # Deploy to Supabase cloud
```

## Design System

### Colors

**Child Theme (RPG)**:
- Primary: `#0a0e27` - Dark blue background
- Secondary: `#131842` - Slightly lighter blue
- Card: `#1a1f4e` - Card backgrounds
- Accent Gold: `#ffd700` - XP, coins, primary actions
- Accent Cyan: `#00e5ff` - Quests, information
- Accent Pink: `#ff4081` - Streaks, warnings
- Accent Green: `#69f0ae` - Success, positive
- Accent Purple: `#b388ff` - Vocabulary, special

**Parent Theme**:
- Background: `#f8fafc` - Light gray
- Card: `#ffffff` - White
- Accent: `#3b82f6` - Blue
- Success: `#22c55e` - Green

### Typography

- **Display**: Fredoka - Headings and titles
- **Body**: Noto Sans TC - Content (supports Traditional Chinese)

## API Endpoints

### Edge Functions

- `POST /generate-quests` - Generate quest with AI
- `POST /generate-vocab` - Generate vocabulary words
- `POST /generate-news` - Simplify news article
- `POST /check-achievements` - Check and unlock achievements
- `POST /daily-summary` - Generate daily summary

### Database Tables

1. **users** - User accounts (parent/child)
2. **families** - Family groups
3. **children** - Child profiles with stats
4. **quests** - Quest definitions
5. **quest_submissions** - Quest completion records
6. **vocabularies** - Vocabulary words
7. **vocab_reviews** - SRS review history
8. **achievements** - Achievement definitions
9. **child_achievements** - Achievement unlocks
10. **reward_shop_items** - Purchasable rewards
11. **child_rewards** - Purchased rewards

## Authentication

- **Parents**: Email + password authentication
- **Children**: 4-digit PIN (parent-generated)
- **JWT-based**: Supabase Auth with JWT tokens

## Internationalization

Currently supports:
- **Traditional Chinese (繁體中文)** - Default
- **English** - Selectable

Add more languages by extending `apps/web/src/lib/i18n.ts`

## Offline Support

The app works offline with service worker support:
- Caches static assets on install
- Network-first for API calls (falls back to cache)
- Cache-first for static assets

## Progressive Web App

- Installable on mobile and desktop
- Works offline
- Push notification support (requires VAPID keys)
- Standalone display mode

## Performance

- **Code Splitting**: Automatic per route
- **Image Optimization**: WebP with fallbacks
- **Lazy Loading**: Components loaded on demand
- **SWR Caching**: Smart cache invalidation with React Query
- **Optimistic Updates**: Instant UI feedback

## Security

- **Row-Level Security (RLS)**: Fine-grained database access control
- **Child PIN**: No email exposure for children
- **Service Role Key**: Protected admin operations
- **JWT Verification**: All edge functions verify tokens
- **HTTPS Only**: Production deployment requirement

## Testing

```bash
# Run tests (configure as needed)
pnpm test
```

## Deployment

### Frontend (Vite)

```bash
pnpm build
# Deploy dist/ to Vercel, Netlify, or static hosting
```

### Backend (Supabase)

```bash
supabase deploy
# Deploys migrations and edge functions
```

## Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```env
# Supabase
VITE_SUPABASE_URL=https://xxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=xxxxx
SUPABASE_SERVICE_ROLE_KEY=xxxxx

# AI (Anthropic)
ANTHROPIC_API_KEY=xxxxx

# Push Notifications
VAPID_PUBLIC_KEY=xxxxx
VAPID_PRIVATE_KEY=xxxxx

# App
VITE_APP_URL=https://kidquest.app
```

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 5173
lsof -ti :5173 | xargs kill -9
```

### Supabase Connection Issues

```bash
# Reset local Supabase
supabase stop
supabase start
```

### Dependency Issues

```bash
# Clean install
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

## Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Commit changes: `git commit -am 'Add feature'`
3. Push branch: `git push origin feature/my-feature`
4. Open pull request

## License

Proprietary - KidQuest Platform

## Support

For issues and questions, refer to the specification document or contact the development team.

## Roadmap

- [ ] Multiplayer quest battles
- [ ] Custom quest templates for parents
- [ ] School curriculum integration
- [ ] Social features (friend challenges)
- [ ] Advanced parent analytics
- [ ] AI-powered personalized learning paths
- [ ] Mobile app (React Native)
