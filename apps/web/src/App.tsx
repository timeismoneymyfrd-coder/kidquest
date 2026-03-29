import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthStore } from './stores/authStore';

// Auth Routes
import Login from './routes/auth/Login';
import Register from './routes/auth/Register';
import ChildPin from './routes/auth/ChildPin';

// Child Routes
import QuestBoard from './routes/child/QuestBoard';
import QuestDetail from './routes/child/QuestDetail';
import Achievements from './routes/child/Achievements';
import Profile from './routes/child/Profile';
import Leaderboard from './routes/child/Leaderboard';
import VocabArena from './routes/child/VocabArena';
import NewsChallenge from './routes/child/NewsChallenge';
import RewardShop from './routes/child/RewardShop';

// Parent Routes
import Dashboard from './routes/parent/Dashboard';
import QuestReview from './routes/parent/QuestReview';
import QuestCreate from './routes/parent/QuestCreate';
import ChildProgress from './routes/parent/ChildProgress';
import Settings from './routes/parent/Settings';
import FamilyManager from './routes/parent/FamilyManager';

// Layouts
import AuthLayout from './components/layout/AuthLayout';
import ChildLayout from './components/layout/ChildLayout';
import ParentLayout from './components/layout/ParentLayout';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 30,
      retry: 1,
    },
  },
});

function AppRoutes() {
  const { initialize, loading, isParent, isChild } = useAuthStore();

  useEffect(() => {
    initialize();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center"
           style={{ background: 'linear-gradient(180deg, #0a0e27 0%, #131842 100%)' }}>
        <div className="text-center">
          <div className="text-5xl mb-4 animate-bounce">⚔️</div>
          <p className="text-lg" style={{ color: '#ffd700', fontFamily: 'Fredoka, sans-serif' }}>
            KidQuest 載入中...
          </p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/child-pin" element={<ChildPin />} />
      </Route>

      {/* Child Routes */}
      <Route element={<ChildLayout />}>
        <Route path="/quests" element={<QuestBoard />} />
        <Route path="/quests/:id" element={<QuestDetail />} />
        <Route path="/achievements" element={<Achievements />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
        <Route path="/vocab" element={<VocabArena />} />
        <Route path="/news" element={<NewsChallenge />} />
        <Route path="/shop" element={<RewardShop />} />
      </Route>

      {/* Parent Routes */}
      <Route element={<ParentLayout />}>
        <Route path="/parent/dashboard" element={<Dashboard />} />
        <Route path="/parent/review" element={<QuestReview />} />
        <Route path="/parent/create" element={<QuestCreate />} />
        <Route path="/parent/progress/:childId" element={<ChildProgress />} />
        <Route path="/parent/progress" element={<ChildProgress />} />
        <Route path="/parent/settings" element={<Settings />} />
        <Route path="/parent/family" element={<FamilyManager />} />
      </Route>

      {/* Smart Redirect */}
      <Route path="/" element={
        isParent ? <Navigate to="/parent/dashboard" replace /> :
        isChild ? <Navigate to="/quests" replace /> :
        <Navigate to="/login" replace />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
