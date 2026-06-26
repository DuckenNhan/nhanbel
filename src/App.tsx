import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SavedRoomsProvider } from './context/SavedRoomsContext';
import { ToastProvider } from './context/ToastContext';

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

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Landlord Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <a href="/landlord" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">P3D</span>
            </div>
            <span className="text-white font-bold">PhongTro3D</span>
          </a>
          <div className="flex items-center gap-4">
            <span className="text-slate-300 text-sm">Chào, {user?.fullName}</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors text-sm"
            >
              Đăng xuất
            </button>
          </div>
        </div>
      </header>
      <main className="pt-16">
        <Routes>
          <Route index element={<DashboardPage />} />
          <Route path="booking" element={<BookingPage />} />
          <Route path="showcase" element={<ShowcasePage />} />
        </Routes>
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
