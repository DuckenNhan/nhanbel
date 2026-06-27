import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, useNavigate, Outlet } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SavedRoomsProvider } from './context/SavedRoomsContext';
import { ToastProvider } from './context/ToastContext';
import { User, CreditCard, Menu, X, Boxes, LogOut } from 'lucide-react';

// Layouts
import RenterLayout from './components/RenterLayout';

// Views
import LoginScreen from './views/LoginScreen';
import HomePage from './views/HomePage';
import ShowcasePage from './views/ShowcasePage';
import BookingPage from './views/BookingPage';
import DashboardPage from './views/DashboardPage';
import RenterDashboardPage from './views/RenterDashboardPage';
import RenterHomePage from './views/RenterHomePage';
import SavedRoomsPage from './views/SavedRoomsPage';
import MentorChatPage from './views/MentorChatPage';
import PropertyDetailPage from './views/PropertyDetailPage';
import FeaturedRoomsPage from './views/FeaturedRoomsPage';
import NewRoomsPage from './views/NewRoomsPage';

// Loading Component
const LoadingScreen: React.FC = () => (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-600">Đang tải...</p>
    </div>
  </div>
);

// Protected Renter Route
const RenterRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'renter') return <Navigate to="/landlord" replace />;

  return <>{children}</>;
};

// Protected Landlord Route
const LandlordRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'landlord') return <Navigate to="/" replace />;

  return <>{children}</>;
};

// Public Route (redirect if already authenticated)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <LoadingScreen />;
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'landlord' ? '/landlord' : '/'} replace />;
  }

  return <>{children}</>;
};

// App Routes
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Login Route */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginScreen onLoginComplete={() => {}} />
          </PublicRoute>
        }
      />

      {/* Renter Routes (with Sidebar Layout) */}
      <Route
        path="/"
        element={
          <RenterRoute>
            <RenterLayout />
          </RenterRoute>
        }
      >
        <Route index element={<RenterDashboardPage />} />
        <Route path="search" element={<RenterHomePage />} />
        <Route path="room/:id" element={<PropertyDetailPage />} />
        <Route path="saved" element={<SavedRoomsPage />} />
        <Route path="mentor" element={<MentorChatPage />} />
        <Route path="featured" element={<FeaturedRoomsPage />} />
        <Route path="new" element={<NewRoomsPage />} />
      </Route>

      {/* Landlord Routes */}
      <Route
        path="/landlord"
        element={
          <LandlordRoute>
            <LandlordLayout />
          </LandlordRoute>
        }
      >
        <Route index element={<DashboardPage />} />
        <Route path="booking" element={<BookingPage />} />
        <Route path="showcase" element={<ShowcasePage />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

// Simple Landlord Layout
const LandlordLayout: React.FC = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const landlordNavItems = [
    { id: 'dashboard', label: 'Kênh Chủ Trọ', icon: User, path: '/landlord' },
    { id: 'booking', label: 'Đặt lịch quét', icon: CreditCard, path: '/landlord/booking' },
  ];

  const isActivePath = (path: string) => {
    if (path === '/landlord') return location.pathname === '/landlord';
    return location.pathname.startsWith(path);
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Landlord Header with Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 hover:bg-slate-800 rounded-lg text-white transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Logo */}
          <button
            onClick={() => handleNavigate('/landlord')}
            className="flex items-center gap-2"
          >
            <Boxes className="w-8 h-8 text-blue-500" />
            <span className="text-xl font-bold text-white">
              PhongTro<span className="text-blue-500">3D</span>
            </span>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {landlordNavItems.map((item) => {
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

          {/* User Menu */}
          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3">
              <img
                src={user?.avatar || 'https://ui-avatars.com/api/?name=User&background=2563eb&color=fff'}
                alt={user?.fullName}
                className="w-9 h-9 rounded-full border-2 border-blue-500"
              />
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-white truncate max-w-[100px]">{user?.fullName}</p>
                <p className="text-xs text-slate-400">Chủ trọ</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
              title="Đăng xuất"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-slate-900 border-t border-slate-800">
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
                  <p className="text-xs text-slate-400">Chủ trọ</p>
                </div>
              </div>

              <div className="h-px bg-slate-800 my-2" />

              {landlordNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigate(item.path)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      isActivePath(item.path)
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
                onClick={() => { setIsMobileMenuOpen(false); logout(); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Đăng xuất</span>
              </button>
            </div>
          </div>
        )}
      </header>
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SavedRoomsProvider>
          <ToastProvider>
            <AppRoutes />
          </ToastProvider>
        </SavedRoomsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
