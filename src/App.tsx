import { useState, useEffect } from 'react';
import { AuthPage } from './components/AuthPage';
import { HomePage } from './components/HomePage';
import { ProfilePage } from './components/ProfilePage';
import { WatchlistPage } from './components/WatchlistPage';
import { RecommendationsPage } from './components/RecommendationsPage';
import { getSupabaseClient } from './utils/supabase/client';

const supabase = getSupabaseClient();

export type User = {
  id: string;
  email: string;
  name: string;
  accessToken: string;
};

export type Movie = {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
  genre_ids: number[];
};

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<'home' | 'profile' | 'watchlist' | 'recommendations'>('home');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      const { data, error } = await supabase.auth.getSession();
      if (data?.session) {
        setUser({
          id: data.session.user.id,
          email: data.session.user.email || '',
          name: data.session.user.user_metadata?.name || '',
          accessToken: data.session.access_token
        });
      }
    } catch (error) {
      console.error('Error checking session:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setCurrentPage('home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Navigation */}
      <nav className="bg-black/50 backdrop-blur-md border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-8">
              <h1 className="text-white text-2xl">
                Movielationships
              </h1>
              <div className="flex gap-4">
                <button
                  onClick={() => setCurrentPage('home')}
                  className={`text-sm ${
                    currentPage === 'home'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  } transition-colors`}
                >
                  Browse
                </button>
                <button
                  onClick={() => setCurrentPage('recommendations')}
                  className={`text-sm ${
                    currentPage === 'recommendations'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  } transition-colors`}
                >
                  Recommendations
                </button>
                <button
                  onClick={() => setCurrentPage('watchlist')}
                  className={`text-sm ${
                    currentPage === 'watchlist'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  } transition-colors`}
                >
                  Watchlist
                </button>
                <button
                  onClick={() => setCurrentPage('profile')}
                  className={`text-sm ${
                    currentPage === 'profile'
                      ? 'text-white'
                      : 'text-gray-400 hover:text-white'
                  } transition-colors`}
                >
                  Profile
                </button>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white text-sm">
                {user.name || user.email}
              </span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Page Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentPage === 'home' && <HomePage user={user} />}
        {currentPage === 'profile' && <ProfilePage user={user} />}
        {currentPage === 'watchlist' && <WatchlistPage user={user} />}
        {currentPage === 'recommendations' && <RecommendationsPage user={user} />}
      </div>
    </div>
  );
}