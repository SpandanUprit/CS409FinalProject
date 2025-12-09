import { useState, useEffect } from 'react';
import { User, Movie } from '../App';
import { projectId } from '../utils/supabase/info';
import { MovieCard } from './MovieCard';
import { Bookmark } from 'lucide-react';

type WatchlistPageProps = {
  user: User;
};

export function WatchlistPage({ user }: WatchlistPageProps) {
  const [watchlistMovies, setWatchlistMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0a88fa7c/watchlist`,
        {
          headers: {
            'Authorization': `Bearer ${user.accessToken}`
          }
        }
      );
      const data = await response.json();
      if (data.movies) {
        setWatchlistMovies(data.movies);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveFromWatchlist = async (movieId: number) => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0a88fa7c/watchlist`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
          },
          body: JSON.stringify({ movieId })
        }
      );
      setWatchlistMovies(prev => prev.filter(m => m.id !== movieId));
    } catch (error) {
      console.error('Error removing from watchlist:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full">
          <Bookmark className="w-8 h-8 text-white" />
        </div>
        <div>
          <h2 className="text-3xl text-white">
            Your Watchlist
          </h2>
          <p className="text-gray-300">
            {watchlistMovies.length} {watchlistMovies.length === 1 ? 'movie' : 'movies'} to watch
          </p>
        </div>
      </div>

      {loading ? (
        <div className="text-center text-white py-12">Loading...</div>
      ) : watchlistMovies.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">
            Your watchlist is empty.
          </p>
          <p className="text-gray-500 text-sm">
            Add movies you want to watch later from the browse page!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {watchlistMovies.map((movie) => (
            <div key={movie.id} className="relative">
              <MovieCard
                movie={movie}
                showActions={false}
              />
              <button
                onClick={() => handleRemoveFromWatchlist(movie.id)}
                className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs transition-colors"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
