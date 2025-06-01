import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { ExpenseProvider } from '@/contexts/ExpenseContext';
import { useTheme } from '@/contexts/ThemeContext';
import { NotificationProvider } from '@/contexts/NotificationContext';
import { DismissedNudgesProvider } from '@/contexts/DismissedNudgesContext';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';
import Dashboard from '@/components/Dashboard';
import { AuthBackground } from '@/components/ui/auth-background';

const AuthenticatedApp: React.FC<{ initialPage?: 'login' | 'register' }> = ({ initialPage }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sage-light/30 via-white to-bloom-pink/20 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center theme-transition">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-r from-sage to-sage-light rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <p className="text-sage-dark dark:text-sage-light font-medium">Loading BudgetBloom...</p>
        </div>
      </div>
    );
  }

  if (user) {
    return (
      <ExpenseProvider>
        <NotificationProvider>
          <DismissedNudgesProvider>
            <Dashboard />
          </DismissedNudgesProvider>
        </NotificationProvider>
      </ExpenseProvider>
    );
  }

  return <AuthPage initialPage={initialPage} />;
};

const AuthPage: React.FC<{ initialPage?: 'login' | 'register' }> = ({ initialPage }) => {
  const [isLogin, setIsLogin] = useState(initialPage !== 'register');
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 theme-transition overflow-hidden">
      {/* Animated Background */}
      <AuthBackground />
      
      <div className="w-full max-w-md relative z-10">
        {/* Logo and Brand */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-sage to-sage-light rounded-full flex items-center justify-center mx-auto mb-4 shadow-soft dark:shadow-dark transition-all duration-500">
            <span className="text-white font-bold text-2xl">B</span>
          </div>
          <h1 className="text-4xl font-heading font-bold text-sage-dark dark:text-sage-light mb-2 transition-colors duration-500">
            BudgetBloom
          </h1>
          <p className="text-gray-600 dark:text-gray-300 text-lg transition-colors duration-500">
            Financial Growth Made Beautiful
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
            <span>🌱</span>
            <span>Grow your financial future with every transaction</span>
            <span>💖</span>
          </div>
        </div>

        {/* Auth Forms */}
        <div className="animate-fade-in transition-all duration-500">
          {isLogin ? (
            <LoginForm onToggleForm={() => setIsLogin(false)} />
          ) : (
            <RegisterForm onToggleForm={() => setIsLogin(true)} />
          )}
        </div>

        {/* Theme Toggle */}
        <div className="absolute top-4 right-4 z-20">
          <button 
            className="p-2 rounded-full bg-white/80 dark:bg-gray-800/80 text-gray-800 dark:text-gray-200 shadow-md hover:shadow-lg transition-all duration-300"
            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            onClick={toggleTheme}
          >
            {isDarkMode ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400 transition-colors duration-500">
          <p>Made with 💚 for your financial wellness</p>
        </div>
      </div>
    </div>
  );
};

const Index = ({ initialPage }: { initialPage?: 'login' | 'register' }) => {
  return (
    <AuthProvider>
      <AuthenticatedApp initialPage={initialPage} />
    </AuthProvider>
  );
};

export default Index;
