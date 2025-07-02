import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';

const AppContent: React.FC = () => {
  const { isAuthenticated, isAdmin } = useAuth();
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'register'>('landing');

  if (!isAuthenticated) {
    if (currentView === 'landing') {
      return (
        <LandingPage
          onLogin={() => setCurrentView('login')}
          onRegister={() => setCurrentView('register')}
        />
      );
    } else if (currentView === 'login') {
      return <Login onToggleMode={() => setCurrentView('register')} />;
    } else {
      return <Register onToggleMode={() => setCurrentView('login')} />;
    }
  }

  return (
    <Layout>
      {isAdmin ? <AdminDashboard /> : <UserDashboard />}
    </Layout>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;