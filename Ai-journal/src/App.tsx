import React, { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AuthPage } from './components/AuthPage';
import { Layout } from './components/Layout';
import { WriteEntry } from './components/WriteEntry';
import { Timeline } from './components/Timeline';

function AppContent() {
  const { user, loading } = useAuth();
  const [currentView, setCurrentView] = useState<'write' | 'timeline'>('timeline');

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  const handleEntryCreated = () => {
    setCurrentView('timeline');
  };

  return (
    <Layout currentView={currentView} onViewChange={setCurrentView}>
      {currentView === 'write' ? (
        <WriteEntry onEntryCreated={handleEntryCreated} />
      ) : (
        <Timeline />
      )}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;