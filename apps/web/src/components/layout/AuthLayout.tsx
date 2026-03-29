import { Outlet } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(135deg, #0a0e27 0%, #131842 50%, #1a1f4e 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#ffd700', fontFamily: 'Fredoka, sans-serif' }}>
            ⚔️ KidQuest
          </h1>
          <p className="text-lg" style={{ color: '#00e5ff', fontFamily: 'Fredoka, sans-serif' }}>小勇士</p>
        </div>
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'rgba(26, 31, 78, 0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(179, 136, 255, 0.2)' }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
