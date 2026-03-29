import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores/authStore';
import { useEffect, useState } from 'react';

const NAV_ITEMS = [
  { path: '/parent/dashboard', icon: '📊', label: '總覽' },
  { path: '/parent/review', icon: '✅', label: '待審核' },
  { path: '/parent/create', icon: '➕', label: '佈置任務' },
  { path: '/parent/progress', icon: '📈', label: '進度報告' },
  { path: '/parent/family', icon: '👨‍👩‍👧‍👦', label: '家庭管理' },
  { path: '/parent/settings', icon: '⚙️', label: '設定' },
];

export default function ParentLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, family, isParent, signOut } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isParent || !user) {
      navigate('/login');
    }
  }, [isParent, user, navigate]);

  if (!user || !family) return null;

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Mobile Header */}
      <header className="lg:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 bg-white border-b border-gray-200 shadow-sm">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-gray-100">
          <span className="text-xl">☰</span>
        </button>
        <h1 className="text-lg font-bold" style={{ color: '#1e293b', fontFamily: 'Noto Sans TC, sans-serif' }}>
          KidQuest 家長端
        </h1>
        <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold bg-blue-500 text-white">
          {user.display_name.charAt(0)}
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - Desktop always visible, Mobile toggle */}
        <aside className={`
          fixed lg:sticky top-0 left-0 z-50 lg:z-auto
          w-64 h-screen bg-white border-r border-gray-200
          transform transition-transform duration-300 lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}>
          <div className="p-6 border-b border-gray-100">
            <h2 className="text-xl font-bold" style={{ color: '#1e293b', fontFamily: 'Fredoka, sans-serif' }}>
              🏠 {family.name}
            </h2>
            <p className="text-sm mt-1" style={{ color: '#94a3b8' }}>{user.display_name}</p>
          </div>

          <nav className="p-3 space-y-1">
            {NAV_ITEMS.map((item) => {
              const isActive = location.pathname.startsWith(item.path);
              return (
                <button
                  key={item.path}
                  onClick={() => { navigate(item.path); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${
                    isActive ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span style={{ fontFamily: 'Noto Sans TC, sans-serif' }}>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-100">
            <button
              onClick={signOut}
              className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
            >
              🚪 <span>登出</span>
            </button>
          </div>
        </aside>

        {/* Backdrop for mobile sidebar */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Main Content */}
        <main className="flex-1 min-h-screen lg:ml-0 p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
