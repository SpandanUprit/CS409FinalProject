import { useState, useEffect } from 'react';
import { User, Movie } from '../App';
import { projectId } from '../utils/supabase/info';
import { MovieCard } from './MovieCard';
import { Film, Heart } from 'lucide-react';

type ProfilePageProps = {
  user: User;
};

export function ProfilePage({ user }: ProfilePageProps) {
  const [watchedMovies, setWatchedMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWatchedMovies();
  }, []);

  const fetchWatchedMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0a88fa7c/watched-movies`,
        {
          headers: {
            'Authorization': `Bearer ${user.accessToken}`
          }
        }
      );
      const data = await response.json();
      if (data.movies) {
        setWatchedMovies(data.movies);
      }
    } catch (error) {
      console.error('Error fetching watched movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveWatched = async (movieId: number) => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0a88fa7c/watched-movies`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.accessToken}`
          },
          body: JSON.stringify({ movieId })
        }
      );
      setWatchedMovies(prev => prev.filter(m => m.id !== movieId));
    } catch (error) {
      console.error('Error removing watched movie:', error);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <div className="bg-white/5 rounded-2xl p-8 border border-white/10">
          <div className="flex items-center gap-6">
            <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-full">
              <Film className="w-12 h-12 text-white" />
            </div>
            <div>
              <h2 className="text-3xl text-white mb-2">
                {user.name || 'Movie Lover'}
              </h2>
              <p className="text-gray-300">{user.email}</p>
              <div className="flex items-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  <span className="text-white">
                    {watchedMovies.length} Movies Watched
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-2xl text-white mb-6">
          Movies You've Watched & Liked
        </h3>

        {loading ? (
          <div className="text-center text-white py-12">Loading...</div>
        ) : watchedMovies.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-400 mb-4">
              You haven't marked any movies as watched yet.
            </p>
            <p className="text-gray-500 text-sm">
              Browse movies and mark the ones you've watched to get personalized recommendations!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {watchedMovies.map((movie) => (
              <div key={movie.id} className="relative">
                <MovieCard
                  movie={movie}
                  showActions={false}
                />
                <button
                  onClick={() => handleRemoveWatched(movie.id)}
                  className="absolute top-2 right-2 bg-red-600/80 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
