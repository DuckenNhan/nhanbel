import React, { useState, useEffect } from 'react';
import { Home, CreditCard, User, Menu, X, Boxes, LogOut, Search, Heart, MessageCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type View = 'home' | 'showcase' | 'booking' | 'dashboard' | 'search' | 'saved' | 'mentor';

interface NavbarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, onNavigate }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Landlord nav items (home goes to dashboard, no showcase)
  const landlordNavItems = [
    { id: 'dashboard' as View, label: 'Kênh Chủ Trọ', icon: User },
    { id: 'booking' as View, label: 'Đặt lịch quét', icon: CreditCard },
  ];

  // Renter nav items
  const renterNavItems = [
    { id: 'home' as View, label: 'Trang chủ', icon: Home },
    { id: 'mentor' as View, label: 'Mentor', icon: MessageCircle },
  ];

  const navItems = user?.role === 'renter' ? renterNavItems : landlordNavItems;

  const handleNavigate = (view: View) => {
    // For landlord, if they click home, go to dashboard
    if (user?.role === 'landlord' && view === 'home') {
      onNavigate('dashboard');
    } else {
      onNavigate(view);
    }
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    logout();
  };

  if (!isAuthenticated) return null;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-slate-900/95 backdrop-blur-md shadow-lg'
          : 'bg-slate-900'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <button
            onClick={() => handleNavigate(user?.role === 'renter' ? 'home' : 'dashboard')}
            className="flex items-center gap-2 group"
          >
            <div className="relative">
              <Boxes className="w-8 h-8 text-blue-500 group-hover:text-blue-400 transition-colors" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-600 rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-bold text-white">
              PhongTro<span className="text-blue-500">3D</span>
            </span>
          </button>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    currentView === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center gap-4">
            <div className="flex items-center gap-3">
              <img
                src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=2563eb&color=fff'}
                alt={user?.fullName}
                className="w-9 h-9 rounded-full border-2 border-blue-500"
              />
              <div className="text-left">
                <p className="text-sm font-medium text-white truncate max-w-[120px]">{user?.fullName}</p>
                <p className="text-xs text-slate-400">
                  {user?.role === 'renter' ? 'Người thuê' : 'Chủ trọ'}
                </p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-slate-800 text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden bg-slate-900 border-t border-slate-800 animate-fade-in">
          <div className="px-4 py-3 space-y-1">
            {/* User info on mobile */}
            <div className="flex items-center gap-3 px-4 py-3 mb-2">
              <img
                src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=2563eb&color=fff'}
                alt={user?.fullName}
                className="w-10 h-10 rounded-full border-2 border-blue-500"
              />
              <div>
                <p className="font-medium text-white">{user?.fullName}</p>
                <p className="text-xs text-slate-400">
                  {user?.role === 'renter' ? 'Người thuê' : 'Chủ trọ'}
                </p>
              </div>
            </div>

            <div className="h-px bg-slate-800 my-2" />

            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}

            <div className="h-px bg-slate-800 my-2" />

            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
