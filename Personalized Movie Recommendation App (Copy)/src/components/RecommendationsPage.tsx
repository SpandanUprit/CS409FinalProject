import { useState, useEffect } from 'react';
import { User, Movie } from '../App';
import { projectId } from '../utils/supabase/info';
import { MovieCard } from './MovieCard';
import { Sparkles, RefreshCw } from 'lucide-react';

type RecommendationsPageProps = {
  user: User;
};

export function RecommendationsPage({ user }: RecommendationsPageProps) {
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [watchlistMovies, setWatchlistMovies] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetchRecommendations();
    fetchWatchlist();
  }, []);

  const fetchWatchlist = async () => {
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
        setWatchlistMovies(new Set(data.movies.map((m: Movie) => m.id)));
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
    }
  };

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0a88fa7c/recommendations`,
        {
          headers: {
            'Authorization': `Bearer ${user.accessToken}`
          }
        }
      );
      const data = await response.json();
      if (data.recommendations) {
        setRecommendations(data.recommendations);
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWatchlist = async (movie: Movie) => {
    const isInWatchlist = watchlistMovies.has(movie.id);
    
    try {
      if (isInWatchlist) {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0a88fa7c/watchlist`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.accessToken}`
            },
            body: JSON.stringify({ movieId: movie.id })
          }
        );
        setWatchlistMovies(prev => {
          const newSet = new Set(prev);
          newSet.delete(movie.id);
          return newSet;
        });
      } else {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0a88fa7c/watchlist`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.accessToken}`
            },
            body: JSON.stringify({ movie })
          }
        );
        setWatchlistMovies(prev => new Set([...prev, movie.id]));
      }
    } catch (error) {
      console.error('Error toggling watchlist:', error);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-3 rounded-full">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl text-white">
              Recommended For You
            </h2>
            <p className="text-gray-300">
              Based on your watched movies
            </p>
          </div>
        </div>
        
        <button
          onClick={fetchRecommendations}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {loading && recommendations.length === 0 ? (
        <div className="text-center text-white py-12">
          Generating personalized recommendations...
        </div>
      ) : recommendations.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">
            No recommendations yet.
          </p>
          <p className="text-gray-500 text-sm">
            Mark some movies as watched in your profile to get personalized recommendations!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {recommendations.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isInWatchlist={watchlistMovies.has(movie.id)}
              onToggleWatchlist={() => toggleWatchlist(movie)}
              showActions={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
