import React, { useState, useEffect } from 'react';
import Navbar, { View } from './components/Navbar';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { SavedRoomsProvider } from './context/SavedRoomsContext';
import LoginScreen from './views/LoginScreen';
import HomePage from './views/HomePage';
import ShowcasePage from './views/ShowcasePage';
import BookingPage from './views/BookingPage';
import DashboardPage from './views/DashboardPage';
import RenterDashboardPage from './views/RenterDashboardPage';
import RenterHomePage from './views/RenterHomePage';
import SavedRoomsPage from './views/SavedRoomsPage';
import MentorChatPage from './views/MentorChatPage';

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');
  const [initialRedirectDone, setInitialRedirectDone] = useState(false);

  useEffect(() => {
    // Handle initial routing after login
    if (isAuthenticated && !initialRedirectDone) {
      if (user?.role === 'landlord') {
        // Landlord: Redirect to dashboard (Kênh Chủ Trọ) as default landing page
        setCurrentView('dashboard');
      } else {
        // Renter: Default to home page
        setCurrentView('home');
      }
      setInitialRedirectDone(true);
    }
  }, [isAuthenticated, user?.role, initialRedirectDone]);

  const handleNavigate = (view: View) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginComplete = () => {
    // The redirect logic is handled by useEffect above
    setInitialRedirectDone(false);
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600">Đang tải...</p>
        </div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!isAuthenticated) {
    return <LoginScreen onLoginComplete={handleLoginComplete} />;
  }

  // Render content based on user role and current view
  const renderContent = () => {
    if (user?.role === 'renter') {
      // Renter view routing
      switch (currentView) {
        case 'home':
          return <RenterDashboardPage onNavigate={handleNavigate} />;
        case 'search':
          return <RenterHomePage />;
        case 'saved':
          return <SavedRoomsPage />;
        case 'mentor':
          return <MentorChatPage onBack={() => handleNavigate('home')} />;
        default:
          return <RenterDashboardPage onNavigate={handleNavigate} />;
      }
    } else {
      // Landlord view routing
      switch (currentView) {
        case 'home':
          // Landlord bypasses public landing - go to dashboard
          return <DashboardPage />;
        case 'showcase':
          return <ShowcasePage />;
        case 'booking':
          return <BookingPage />;
        case 'dashboard':
          return <DashboardPage />;
        default:
          return <DashboardPage />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentView={currentView} onNavigate={handleNavigate} />
      <main>{renderContent()}</main>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <SavedRoomsProvider>
        <ToastProvider>
          <AppContent />
        </ToastProvider>
      </SavedRoomsProvider>
    </AuthProvider>
  );
}

export default App;
