import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  Home,
  Search,
  MessageCircle,
  Heart,
  Star,
  Clock,
  X,
  Menu as MenuIcon,
  Boxes,
  LogOut,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSavedRooms } from '../context/SavedRoomsContext';

const RenterLayout: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const { savedCount } = useSavedRooms();
  const location = useLocation();
  const navigate = useNavigate();

  const mainNavItems = [
    { id: 'home', label: 'Trang chủ', icon: Home, path: '/' },
    { id: 'search', label: 'Tìm phòng trọ', icon: Search, path: '/search' },
    { id: 'mentor', label: 'Mentor', icon: MessageCircle, path: '/mentor' },
  ];

  const sidebarItems = [
    { id: 'saved', label: 'Phòng đã lưu', icon: Heart, path: '/saved', badge: savedCount > 0 ? savedCount : undefined },
    { id: 'featured', label: 'Phòng nổi bật', icon: Star, path: '/featured' },
    { id: 'new', label: 'Mới đăng hôm nay', icon: Clock, path: '/new' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top Header Bar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-slate-900 h-16 flex items-center">
        <div className="w-full flex items-center justify-between px-4">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg text-white transition-colors"
          >
            <MenuIcon className="w-6 h-6" />
          </button>

          {/* Logo */}
          <button
            onClick={() => handleNavigate('/')}
            className="flex items-center gap-2"
          >
            <Boxes className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white">
              PhongTro<span className="text-blue-500">3D</span>
            </span>
          </button>

          {/* Desktop main nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {mainNavItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.path)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                    isActivePath(item.path)
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* User menu */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <img
                src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=2563eb&color=fff'}
                alt={user?.fullName}
                className="w-9 h-9 rounded-full border-2 border-blue-500"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white truncate max-w-[100px]">{user?.fullName}</p>
                <p className="text-xs text-slate-400">Người thuê</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed on desktop, drawer on mobile */}
      <aside
        className={`fixed top-16 left-0 h-[calc(100vh-4rem)] w-72 bg-white border-r border-slate-200 z-50 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile close button */}
          <div className="lg:hidden flex items-center justify-between p-4 border-b border-slate-200">
            <span className="font-semibold text-slate-900">Menu</span>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-2 hover:bg-slate-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User info on mobile */}
          <div className="lg:hidden p-4 border-b border-slate-200">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=2563eb&color=fff'}
                alt={user?.fullName}
                className="w-12 h-12 rounded-full border-2 border-blue-500"
              />
              <div>
                <p className="font-semibold text-slate-900">{user?.fullName}</p>
                <p className="text-sm text-slate-500">Người thuê</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-4">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Truy cập nhanh
            </h3>
            <nav className="space-y-1">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-all ${
                      isActivePath(item.path)
                        ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600'
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-5 h-5" />
                      <span className="font-medium">{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                        {item.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Sidebar footer spacer */}
          <div className="mt-auto" />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="lg:pl-72 pt-16">
        <div className="min-h-[calc(100vh-4rem)]">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default RenterLayout;
