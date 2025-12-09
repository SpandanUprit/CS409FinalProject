import { Plus, Check, Heart } from 'lucide-react';
import { Movie } from '../App';

type MovieCardProps = {
  movie: Movie;
  isWatched?: boolean;
  isInWatchlist?: boolean;
  onToggleWatched?: () => void;
  onToggleWatchlist?: () => void;
  showActions?: boolean;
};

export function MovieCard({
  movie,
  isWatched = false,
  isInWatchlist = false,
  onToggleWatched,
  onToggleWatchlist,
  showActions = true
}: MovieCardProps) {
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : 'https://via.placeholder.com/500x750?text=No+Poster';

  return (
    <div className="group relative bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all hover:scale-105">
      <div className="aspect-[2/3] relative overflow-hidden">
        <img
          src={posterUrl}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        
        {showActions && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
              {onToggleWatched && (
                <button
                  onClick={onToggleWatched}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isWatched
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  {isWatched ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-sm">Watched</span>
                    </>
                  ) : (
                    <>
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">Mark Watched</span>
                    </>
                  )}
                </button>
              )}
              
              {onToggleWatchlist && (
                <button
                  onClick={onToggleWatchlist}
                  className={`w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isInWatchlist
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-white/20 hover:bg-white/30 text-white'
                  }`}
                >
                  {isInWatchlist ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span className="text-sm">In Watchlist</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4" />
                      <span className="text-sm">Add to Watchlist</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="p-3">
        <h3 className="text-white text-sm line-clamp-2 mb-1">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between">
          <span className="text-gray-400 text-xs">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
          </span>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-xs">★</span>
            <span className="text-white text-xs">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
