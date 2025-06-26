import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useNotifications } from '../hooks/useNotifications';
import { BookOpen, LogOut, User, Home, Plus, Compass, Scroll, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Get unread count from the shared notification context
  let unreadCount = 0;
  let notificationsAvailable = false;
  
  try {
    const notificationState = useNotifications();
    unreadCount = notificationState.unreadCount;
    notificationsAvailable = true;
  } catch {
    // If notifications are not available (e.g., user not logged in), show 0
    unreadCount = 0;
    notificationsAvailable = false;
  }
  
  // Only show badge if user is logged in and notifications are available
  const showBadge = user && notificationsAvailable && unreadCount > 0;

  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100">
      <nav className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <BookOpen className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
                <span className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-300 transition-colors">Paracosm</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <>
                  <Link
                    to="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/') 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Home className="h-4 w-4 inline mr-1" />
                    Home
                  </Link>
                  <Link
                    to="/explore"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/explore') 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Compass className="h-4 w-4 inline mr-1" />
                    Explore
                  </Link>
                  <Link
                    to="/create-world"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/create-world') 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Plus className="h-4 w-4 inline mr-1" />
                    Create
                  </Link>
                  <Link
                    to="/chronicle"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors relative ${
                      isActive('/chronicle') 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Scroll className="h-4 w-4 inline mr-1" />
                    Chronicle
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  <Link
                    to="/profile"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/profile') 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <User className="h-4 w-4 inline mr-1" />
                    Profile
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <LogOut className="h-4 w-4 inline mr-1" />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/explore"
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive('/explore') 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Compass className="h-4 w-4 inline mr-1" />
                    Explore
                  </Link>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden flex items-center space-x-2">
              {user ? (
                <>
                  {/* Quick access icons for most important actions */}
                  <Link
                    to="/explore"
                    className={`p-2 rounded-md transition-colors ${
                      isActive('/explore') 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Compass className="h-6 w-6" />
                  </Link>
                  
                  <Link
                    to="/create-world"
                    className={`p-2 rounded-md transition-colors ${
                      isActive('/create-world') 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Plus className="h-6 w-6" />
                  </Link>
                  
                  <Link
                    to="/chronicle"
                    className={`p-2 rounded-md transition-colors relative ${
                      isActive('/chronicle') 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Scroll className="h-6 w-6" />
                    {showBadge && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </span>
                    )}
                  </Link>
                  
                  {/* Mobile menu button */}
                  <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/explore"
                    className={`p-2 rounded-md transition-colors ${
                      isActive('/explore') 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Compass className="h-6 w-6" />
                  </Link>
                  <Link
                    to="/login"
                    className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-3 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && user && (
          <div className="md:hidden border-t border-gray-700 bg-gray-800">
            <div className="px-4 py-2 space-y-1">
              <Link
                to="/"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/') 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <Home className="h-5 w-5 mr-3" />
                Home
              </Link>
              <Link
                to="/profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/profile') 
                    ? 'bg-indigo-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                }`}
              >
                <User className="h-5 w-5 mr-3" />
                Profile
              </Link>
              <button
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  handleSignOut();
                }}
                className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>

      <main className="max-w-7xl mx-auto py-4 sm:py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 border-t border-gray-700 mt-16">
        <div className="max-w-7xl mx-auto py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-indigo-400" />
                <span className="text-base sm:text-lg font-bold text-white">Paracosm</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                The ultimate platform for collaborative world building and storytelling.
              </p>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Platform</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li><Link to="/" className="text-gray-400 hover:text-white transition-colors">Home</Link></li>
                <li><Link to="/explore" className="text-gray-400 hover:text-white transition-colors">Explore Worlds</Link></li>
                <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
                <li><Link to="/quick-start" className="text-gray-400 hover:text-white transition-colors">Quick Start</Link></li>
                <li><Link to="/signup" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link></li>
                {user && (
                  <li><Link to="/create-world" className="text-gray-400 hover:text-white transition-colors">Create World</Link></li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Community</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="https://discord.gg/VHDHGZfmrU" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Discord</a></li>
                <li><a href="https://www.reddit.com/r/ParacosmWorlds/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-white transition-colors">Reddit</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Legal</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li><Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="text-gray-400 hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors">Contact Us</Link></li>
                <li><Link to="/help" className="text-gray-400 hover:text-white transition-colors">Help Center</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © 2024 Paracosm. All rights reserved. Built with ❤️ for creators everywhere.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}