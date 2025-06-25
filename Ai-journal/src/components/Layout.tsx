import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { PenTool, BookOpen, LogOut, User } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: 'write' | 'timeline';
  onViewChange: (view: 'write' | 'timeline') => void;
}

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-orange-50">
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-orange-500 rounded-lg flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-orange-600 bg-clip-text text-transparent">
                  MindJournal
                </h1>
              </div>
              
              <nav className="hidden md:flex space-x-4">
                <button
                  onClick={() => onViewChange('write')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentView === 'write'
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <PenTool className="w-4 h-4" />
                  <span>Write Entry</span>
                </button>
                <button
                  onClick={() => onViewChange('timeline')}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentView === 'timeline'
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Timeline</span>
                </button>
              </nav>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.email}</span>
              </div>
              <button
                onClick={handleSignOut}
                className="flex items-center space-x-1 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Mobile Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-gray-200">
        <div className="flex justify-around py-2">
          <button
            onClick={() => onViewChange('write')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-200 ${
              currentView === 'write'
                ? 'text-blue-700'
                : 'text-gray-600'
            }`}
          >
            <PenTool className="w-5 h-5" />
            <span className="text-xs">Write</span>
          </button>
          <button
            onClick={() => onViewChange('timeline')}
            className={`flex flex-col items-center space-y-1 px-4 py-2 rounded-lg transition-all duration-200 ${
              currentView === 'timeline'
                ? 'text-blue-700'
                : 'text-gray-600'
            }`}
          >
            <BookOpen className="w-5 h-5" />
            <span className="text-xs">Timeline</span>
          </button>
        </div>
      </div>
    </div>
  );
}