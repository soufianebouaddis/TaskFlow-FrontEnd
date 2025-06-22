// components/Header.tsx
import React from 'react';
import { User, Settings } from 'lucide-react';

interface HeaderProps {
  user: {
    firstName?: string;
    email?: string;
    role?: string;
  };
  onOpenProfile: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ user, onOpenProfile, onLogout }) => {
  return (
    <div className="bg-white/10 backdrop-blur-xl border-b border-white/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-3xl font-bold text-white">Task Dashboard</h1>
            <p className="text-slate-300 mt-1">
              Welcome back, {user?.firstName || user?.email}
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-medium bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-300 border border-purple-500/30 backdrop-blur-sm">
              <User className="w-4 h-4 mr-2" />
              {user?.role}
            </span>
            <button
              onClick={onOpenProfile}
              className="px-4 py-2 text-sm font-medium text-slate-300 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 backdrop-blur-sm flex items-center space-x-2"
            >
              <Settings className="w-4 h-4" />
              <span>Profile</span>
            </button>
            <button
              onClick={onLogout}
              className="px-6 py-2 text-sm font-medium text-slate-300 bg-white/10 border border-white/20 rounded-xl hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 backdrop-blur-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
