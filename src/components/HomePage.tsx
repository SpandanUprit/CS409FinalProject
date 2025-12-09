import { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Plus, Check, Heart } from 'lucide-react';
import { User, Movie } from '../App';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { MovieCard } from './MovieCard';

type HomePageProps = {
  user: User;
};

export function HomePage({ user }: HomePageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [watchedMovies, setWatchedMovies] = useState<Set<number>>(new Set());
  const [watchlistMovies, setWatchlistMovies] = useState<Set<number>>(new Set());
  const debounceTimer = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchPopularMovies();
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      // Fetch watched movies
      const watchedResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0a88fa7c/watched-movies`,
        {
          headers: {
            'Authorization': `Bearer ${user.accessToken}`
          }
        }
      );
      const watchedData = await watchedResponse.json();
      if (watchedData.movies) {
        setWatchedMovies(new Set(watchedData.movies.map((m: Movie) => m.id)));
      }

      // Fetch watchlist
      const watchlistResponse = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0a88fa7c/watchlist`,
        {
          headers: {
            'Authorization': `Bearer ${user.accessToken}`
          }
        }
      );
      const watchlistData = await watchlistResponse.json();
      if (watchlistData.movies) {
        setWatchlistMovies(new Set(watchlistData.movies.map((m: Movie) => m.id)));
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const fetchPopularMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0a88fa7c/movies/popular`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      const data = await response.json();
      if (data.movies) {
        setMovies(data.movies);
      }
    } catch (error) {
      console.error('Error fetching popular movies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) {
      fetchPopularMovies();
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-0a88fa7c/movies/search?query=${encodeURIComponent(query)}`,
        {
          headers: {
            'Authorization': `Bearer ${publicAnonKey}`
          }
        }
      );
      const data = await response.json();
      if (data.movies) {
        setMovies(data.movies);
      }
    } catch (error) {
      console.error('Error searching movies:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedSearch = useCallback((query: string) => {
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
    debounceTimer.current = setTimeout(() => {
      handleSearch(query);
    }, 500);
  }, [handleSearch]);

  const handleInputChange = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const toggleWatched = async (movie: Movie) => {
    const isWatched = watchedMovies.has(movie.id);
    
    try {
      if (isWatched) {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0a88fa7c/watched-movies`,
          {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.accessToken}`
            },
            body: JSON.stringify({ movieId: movie.id })
          }
        );
        setWatchedMovies(prev => {
          const newSet = new Set(prev);
          newSet.delete(movie.id);
          return newSet;
        });
      } else {
        await fetch(
          `https://${projectId}.supabase.co/functions/v1/make-server-0a88fa7c/watched-movies`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.accessToken}`
            },
            body: JSON.stringify({ movie })
          }
        );
        setWatchedMovies(prev => new Set([...prev, movie.id]));
      }
    } catch (error) {
      console.error('Error toggling watched:', error);
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
      <div className="mb-8">
        <h2 className="text-3xl text-white mb-6">
          Browse Movies
        </h2>
        
        {/* Search Bar */}
        <div className="relative max-w-3xl">
          <div className="absolute -inset-[1px] bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl opacity-25 pointer-events-none" />
          <div className="relative flex items-center rounded-xl bg-black/60 border border-white/15">
            <Search className="ml-4 w-5 h-5 text-purple-300" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleInputChange(e.target.value)}
              className="w-full px-3 py-3 bg-transparent text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none"
              placeholder="Search movies by title, genre, or actor..."
            />
          </div>
        </div>
      </div>

      {/* Movies Grid */}
      {loading ? (
        <div className="text-center text-white py-12">Loading movies...</div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              isWatched={watchedMovies.has(movie.id)}
              isInWatchlist={watchlistMovies.has(movie.id)}
              onToggleWatched={() => toggleWatched(movie)}
              onToggleWatchlist={() => toggleWatchlist(movie)}
            />
          ))}
        </div>
      )}

      {!loading && movies.length === 0 && (
        <div className="text-center text-gray-400 py-12">
          No movies found. Try a different search.
        </div>
      )}
    </div>
  );
}
