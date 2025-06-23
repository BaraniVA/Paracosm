import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { BookOpen, LogOut, User, Home, Plus, Compass } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { user, signOut } = useAuth();
  const location = useLocation();

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

            <div className="flex items-center space-x-2 sm:space-x-4">
              {user ? (
                <>
                  <Link
                    to="/"
                    className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      isActive('/') 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Home className="h-4 w-4 inline mr-1" />
                    <span className="hidden sm:inline">Home</span>
                  </Link>
                  <Link
                    to="/explore"
                    className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      isActive('/explore') 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Compass className="h-4 w-4 inline mr-1" />
                    <span className="hidden sm:inline">Explore</span>
                  </Link>
                  <Link
                    to="/create-world"
                    className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      isActive('/create-world') 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Plus className="h-4 w-4 inline mr-1" />
                    <span className="hidden sm:inline">Create</span>
                  </Link>
                  <Link
                    to="/profile"
                    className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      isActive('/profile') 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <User className="h-4 w-4 inline mr-1" />
                    <span className="hidden sm:inline">Profile</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    <LogOut className="h-4 w-4 inline mr-1" />
                    <span className="hidden sm:inline">Sign Out</span>
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/explore"
                    className={`px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition-colors ${
                      isActive('/explore') 
                        ? 'bg-indigo-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                    }`}
                  >
                    <Compass className="h-4 w-4 inline mr-1" />
                    <span className="hidden sm:inline">Explore</span>
                  </Link>
                  <Link
                    to="/login"
                    className="px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-2 sm:px-3 py-2 rounded-md text-xs sm:text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
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
                <li><Link to="/signup" className="text-gray-400 hover:text-white transition-colors">Sign Up</Link></li>
                <li><Link to="/login" className="text-gray-400 hover:text-white transition-colors">Login</Link></li>
                {user && (
                  <li><Link to="/create-world" className="text-gray-400 hover:text-white transition-colors">Create World</Link></li>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Community</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Reddit</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-white font-semibold mb-3 sm:mb-4 text-sm sm:text-base">Support</h3>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm">
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
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