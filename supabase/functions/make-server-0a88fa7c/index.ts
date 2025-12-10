import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import * as kv from './kv_store.ts';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabaseUrl =
  Deno.env.get('APP_SUPABASE_URL') ||
  Deno.env.get('SUPABASE_URL') ||
  '';

const supabaseServiceKey =
  Deno.env.get('APP_SUPABASE_SERVICE_ROLE_KEY') ||
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ||
  '';

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// TMDB API configuration
const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY') || 'demo_key';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';


async function fetchFromTMDB(endpoint: string) {
  try {
    const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`TMDB API error: ${response.status} ${response.statusText}`);
      
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    return null;
  }
}


const DEMO_MOVIES = [
  {
    id: 550,
    title: "Fight Club",
    poster_path: "/pB8BM7pdSp6B6Ih7QZ4DrQ3PmJK.jpg",
    overview: "A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.",
    release_date: "1999-10-15",
    vote_average: 8.4,
    genre_ids: [18]
  },
  {
    id: 13,
    title: "Forrest Gump",
    poster_path: "/arw2vcBveWOVZr6pxd9XTd1TdQa.jpg",
    overview: "A man with a low IQ has accomplished great things in his life and been present during significant historic events.",
    release_date: "1994-07-06",
    vote_average: 8.5,
    genre_ids: [35, 18, 10749]
  },
  {
    id: 278,
    title: "The Shawshank Redemption",
    poster_path: "/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg",
    overview: "Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.",
    release_date: "1994-09-23",
    vote_average: 8.7,
    genre_ids: [18, 80]
  },
  {
    id: 238,
    title: "The Godfather",
    poster_path: "/3bhkrj58Vtu7enYsRolD1fZdja1.jpg",
    overview: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son.",
    release_date: "1972-03-14",
    vote_average: 8.7,
    genre_ids: [18, 80]
  },
  {
    id: 424,
    title: "Schindler's List",
    poster_path: "/sF1U4EUQS8YHUYjNl3pMGNIQyr0.jpg",
    overview: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce.",
    release_date: "1993-12-15",
    vote_average: 8.6,
    genre_ids: [18, 36, 10752]
  },
  {
    id: 680,
    title: "Pulp Fiction",
    poster_path: "/d5iIlFn5s0ImszYzBPb8JPIfbXD.jpg",
    overview: "The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in four tales of violence and redemption.",
    release_date: "1994-09-10",
    vote_average: 8.5,
    genre_ids: [80, 18]
  },
  {
    id: 155,
    title: "The Dark Knight",
    poster_path: "/qJ2tW6WMUDux911r6m7haRef0WH.jpg",
    overview: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological tests.",
    release_date: "2008-07-16",
    vote_average: 8.5,
    genre_ids: [18, 28, 80, 53]
  },
  {
    id: 122,
    title: "The Lord of the Rings: The Return of the King",
    poster_path: "/rCzpDGLbOoPwLjy3OAm5NUPOTrC.jpg",
    overview: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom.",
    release_date: "2003-12-17",
    vote_average: 8.5,
    genre_ids: [12, 14, 28]
  },
  {
    id: 27205,
    title: "Inception",
    poster_path: "/9gk7adHYeDvHkCSEqAvQNLV5Uge.jpg",
    overview: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea.",
    release_date: "2010-07-16",
    vote_average: 8.4,
    genre_ids: [28, 878, 12]
  },
  {
    id: 497,
    title: "The Green Mile",
    poster_path: "/velWPhVMQeQKcxggNEU8YmIo52R.jpg",
    overview: "The lives of guards on Death Row are affected by one of their charges: a black man accused of child murder and rape.",
    release_date: "1999-12-10",
    vote_average: 8.5,
    genre_ids: [14, 18, 80]
  },
  {
    id: 637,
    title: "Life Is Beautiful",
    poster_path: "/74hLDKjD5aGYOotO6esUVaeISa2.jpg",
    overview: "When an open-minded Jewish librarian and his son become victims of the Holocaust, he uses a perfect mixture of will and humor.",
    release_date: "1997-12-20",
    vote_average: 8.4,
    genre_ids: [35, 18]
  },
  {
    id: 539,
    title: "Psycho",
    poster_path: "/yz4QVqPx3h1hD1DfqqQkCq3rmxW.jpg",
    overview: "A Phoenix secretary embezzles $40,000 from her employer's client and flees to a remote motel run by a young man under the domination of his mother.",
    release_date: "1960-06-16",
    vote_average: 8.4,
    genre_ids: [18, 27, 53]
  }
];


app.post('/make-server-0a88fa7c/signup', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email and password are required' }, 400);
    }

    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      
      email_confirm: true
    });

    if (error) {
      console.error('Sign up error:', error);
      return c.json({ error: error.message }, 400);
    }

    return c.json({ user: data.user });
  } catch (error) {
    console.error('Sign up error:', error);
    return c.json({ error: 'Failed to sign up' }, 500);
  }
});


app.get('/make-server-0a88fa7c/movies/popular', async (c) => {
  try {
    const data = await fetchFromTMDB('/movie/popular');
    
    if (!data || !data.results) {
      
      return c.json({ movies: DEMO_MOVIES });
    }

    return c.json({ movies: data.results.slice(0, 20) });
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return c.json({ movies: DEMO_MOVIES });
  }
});


app.get('/make-server-0a88fa7c/movies/search', async (c) => {
  try {
    const query = c.req.query('query');
    
    if (!query) {
      return c.json({ error: 'Query parameter is required' }, 400);
    }

    const data = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
    
    if (!data || !data.results) {
      
      const filtered = DEMO_MOVIES.filter(m => 
        m.title.toLowerCase().includes(query.toLowerCase())
      );
      return c.json({ movies: filtered });
    }

    return c.json({ movies: data.results });
  } catch (error) {
    console.error('Error searching movies:', error);
    return c.json({ movies: [] });
  }
});


app.get('/make-server-0a88fa7c/watched-movies', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(accessToken);

    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const movies = await kv.get(`watched:${user.id}`);
    return c.json({ movies: movies || [] });
  } catch (error) {
    console.error('Error fetching watched movies:', error);
    return c.json({ error: 'Failed to fetch watched movies' }, 500);
  }
});


app.post('/make-server-0a88fa7c/watched-movies', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(accessToken);

    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { movie } = await c.req.json();
    
    if (!movie || !movie.id) {
      return c.json({ error: 'Movie data is required' }, 400);
    }

    const watchedMovies = await kv.get(`watched:${user.id}`) || [];
    
    
    if (!watchedMovies.some((m: any) => m.id === movie.id)) {
      watchedMovies.push(movie);
      await kv.set(`watched:${user.id}`, watchedMovies);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error adding watched movie:', error);
    return c.json({ error: 'Failed to add watched movie' }, 500);
  }
});


app.delete('/make-server-0a88fa7c/watched-movies', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(accessToken);

    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { movieId } = await c.req.json();
    
    if (!movieId) {
      return c.json({ error: 'Movie ID is required' }, 400);
    }

    const watchedMovies = await kv.get(`watched:${user.id}`) || [];
    const updatedMovies = watchedMovies.filter((m: any) => m.id !== movieId);
    
    await kv.set(`watched:${user.id}`, updatedMovies);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error removing watched movie:', error);
    return c.json({ error: 'Failed to remove watched movie' }, 500);
  }
});


app.get('/make-server-0a88fa7c/watchlist', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(accessToken);

    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const movies = await kv.get(`watchlist:${user.id}`);
    return c.json({ movies: movies || [] });
  } catch (error) {
    console.error('Error fetching watchlist:', error);
    return c.json({ error: 'Failed to fetch watchlist' }, 500);
  }
});


app.post('/make-server-0a88fa7c/watchlist', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(accessToken);

    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { movie } = await c.req.json();
    
    if (!movie || !movie.id) {
      return c.json({ error: 'Movie data is required' }, 400);
    }

    const watchlistMovies = await kv.get(`watchlist:${user.id}`) || [];
    
    
    if (!watchlistMovies.some((m: any) => m.id === movie.id)) {
      watchlistMovies.push(movie);
      await kv.set(`watchlist:${user.id}`, watchlistMovies);
    }

    return c.json({ success: true });
  } catch (error) {
    console.error('Error adding to watchlist:', error);
    return c.json({ error: 'Failed to add to watchlist' }, 500);
  }
});


app.delete('/make-server-0a88fa7c/watchlist', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(accessToken);

    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { movieId } = await c.req.json();
    
    if (!movieId) {
      return c.json({ error: 'Movie ID is required' }, 400);
    }

    const watchlistMovies = await kv.get(`watchlist:${user.id}`) || [];
    const updatedMovies = watchlistMovies.filter((m: any) => m.id !== movieId);
    
    await kv.set(`watchlist:${user.id}`, updatedMovies);

    return c.json({ success: true });
  } catch (error) {
    console.error('Error removing from watchlist:', error);
    return c.json({ error: 'Failed to remove from watchlist' }, 500);
  }
});


app.get('/make-server-0a88fa7c/recommendations', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user } } = await supabase.auth.getUser(accessToken);

    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const watchedMovies = await kv.get(`watched:${user.id}`) || [];

    if (watchedMovies.length === 0) {
      return c.json({ recommendations: [] });
    }

    const watchedIds = new Set(watchedMovies.map((m: any) => m.id));
    const genreCount = new Map<number, number>();
    const actorCount = new Map<number, CountEntry>();
    const directorCount = new Map<number, CountEntry>();

    let ratingSum = 0;

    watchedMovies.forEach((movie: any) => {
      ratingSum += movie?.vote_average || 0;
      (movie?.genre_ids || []).forEach((genreId: number) => {
        genreCount.set(genreId, (genreCount.get(genreId) || 0) + 1);
      });
    });

    const watchedCredits = await Promise.all(
      watchedMovies.map((movie: any) => fetchMovieCredits(movie.id))
    );

    watchedCredits.forEach((credits) => {
      if (!credits) return;

      credits.cast?.slice(0, 5).forEach((castMember: any) => {
        incrementCount(actorCount, castMember?.id, castMember?.name);
      });

      credits.crew
        ?.filter((crewMember: any) => crewMember?.job === 'Director')
        .forEach((director: any) => {
          incrementCount(directorCount, director?.id, director?.name);
        });
    });

    const avgRating = ratingSum / watchedMovies.length || 0;
    const topGenres = getTopNumbers(genreCount, 3);
    const topActors = getTopEntries(actorCount, 5);
    const topDirectors = getTopEntries(directorCount, 3);

    const favoriteActorIds = new Set(topActors.map((actor) => actor.id));
    const favoriteDirectorIds = new Set(topDirectors.map((director) => director.id));

    const candidateMap = new Map<number, any>();

    const addCandidates = (movies: any[]) => {
      movies?.forEach((rawMovie: any) => {
        const movie = normalizeMovie(rawMovie);
        if (!movie?.id || watchedIds.has(movie.id) || candidateMap.has(movie.id)) {
          return;
        }
        candidateMap.set(movie.id, movie);
      });
    };

    if (topGenres.length > 0) {
      const genreParam = topGenres.join(',');
      const genreData = await fetchFromTMDB(
        `/discover/movie?with_genres=${genreParam}&vote_count.gte=200&sort_by=popularity.desc`
      );
      addCandidates(genreData?.results || []);
    }

    const actorCredits = await Promise.all(
      topActors.map((actor) => fetchPersonCredits(actor.id))
    );

    actorCredits.forEach((credits) => {
      const movies = credits?.cast?.slice(0, 15) || [];
      addCandidates(movies);
    });

    const directorCredits = await Promise.all(
      topDirectors.map((director) => fetchPersonCredits(director.id))
    );

    directorCredits.forEach((credits) => {
      const movies =
        credits?.crew
          ?.filter((entry: any) => entry?.job === 'Director')
          .slice(0, 15) || [];
      addCandidates(movies);
    });

    if (candidateMap.size === 0) {
      const fallback = await fetchFromTMDB('/movie/popular');
      return c.json({ recommendations: fallback?.results?.slice(0, 20) || DEMO_MOVIES });
    }

    const normalizedGenres = normalizeCountMap(genreCount);
    const scoredRecommendations: { movie: any; score: number }[] = [];

    for (const candidate of candidateMap.values()) {
      const genreScore = (candidate.genre_ids || []).reduce(
        (acc: number, id: number) => acc + (normalizedGenres.get(id) || 0),
        0
      );

      const credits = await fetchMovieCredits(candidate.id);
      const actorOverlap = computeActorOverlap(credits, favoriteActorIds);
      const directorOverlap = computeDirectorOverlap(credits, favoriteDirectorIds);

      const ratingScore = candidate.vote_average
        ? Math.max(0, 1 - Math.abs(candidate.vote_average - avgRating) / 3)
        : 0.5;

      if (
        candidate.vote_average &&
        Math.abs(candidate.vote_average - avgRating) > 2.5
      ) {
        continue;
      }

      const totalScore =
        genreScore * 0.4 +
        actorOverlap * 0.3 +
        directorOverlap * 0.2 +
        ratingScore * 0.1;

      scoredRecommendations.push({ movie: candidate, score: totalScore });
    }

    if (scoredRecommendations.length === 0) {
      const data = await fetchFromTMDB('/movie/popular');
      return c.json({ recommendations: data?.results?.slice(0, 20) || DEMO_MOVIES });
    }

    scoredRecommendations.sort((a, b) => b.score - a.score);

    return c.json({
      recommendations: scoredRecommendations.slice(0, 20).map((entry) => entry.movie)
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return c.json({ error: 'Failed to generate recommendations' }, 500);
  }
});

type CountEntry = {
  count: number;
  name?: string;
};

function incrementCount(
  map: Map<number, CountEntry>,
  id?: number,
  name?: string
) {
  if (typeof id !== 'number') return;
  const existing = map.get(id) || { count: 0, name };
  existing.count += 1;
  if (name && !existing.name) {
    existing.name = name;
  }
  map.set(id, existing);
}

function getTopNumbers(map: Map<number, number>, limit: number) {
  return Array.from(map.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([id]) => id);
}

function getTopEntries(map: Map<number, CountEntry>, limit: number) {
  return Array.from(map.entries())
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, limit)
    .map(([id, data]) => ({ id, name: data.name || 'Unknown', count: data.count }));
}

function normalizeCountMap(map: Map<number, number>) {
  const normalized = new Map<number, number>();
  const values = Array.from(map.values());
  const max = values.length ? Math.max(...values) : 0;
  if (!max) {
    return normalized;
  }
  map.forEach((value, key) => normalized.set(key, value / max));
  return normalized;
}

function computeActorOverlap(credits: any, actorIds: Set<number>) {
  if (!credits?.cast || actorIds.size === 0) {
    return 0;
  }
  const candidateActors = credits.cast.slice(0, 10).map((actor: any) => actor.id);
  if (candidateActors.length === 0) {
    return 0;
  }
  let overlap = 0;
  candidateActors.forEach((id: number) => {
    if (actorIds.has(id)) {
      overlap += 1;
    }
  });
  return overlap / Math.min(candidateActors.length, actorIds.size);
}

function computeDirectorOverlap(credits: any, directorIds: Set<number>) {
  if (!credits?.crew || directorIds.size === 0) {
    return 0;
  }
  const candidateDirectors = credits.crew
    .filter((member: any) => member?.job === 'Director')
    .map((member: any) => member.id);

  if (candidateDirectors.length === 0) {
    return 0;
  }

  let overlap = 0;
  candidateDirectors.forEach((id: number) => {
    if (directorIds.has(id)) {
      overlap += 1;
    }
  });

  return overlap / Math.min(candidateDirectors.length, directorIds.size);
}

const movieCreditsCache = new Map<number, any>();

async function fetchMovieCredits(movieId: number) {
  if (!movieId) return null;
  if (movieCreditsCache.has(movieId)) {
    return movieCreditsCache.get(movieId);
  }
  const credits = await fetchFromTMDB(`/movie/${movieId}/credits`);
  if (credits) {
    movieCreditsCache.set(movieId, credits);
  }
  return credits;
}

async function fetchPersonCredits(personId: number) {
  if (!personId) return null;
  return await fetchFromTMDB(`/person/${personId}/movie_credits`);
}

function normalizeMovie(movie: any) {
  return {
    id: movie.id,
    title: movie.title || movie.name || '',
    poster_path: movie.poster_path || null,
    overview: movie.overview || '',
    release_date: movie.release_date || movie.first_air_date || '',
    vote_average: typeof movie.vote_average === 'number' ? movie.vote_average : 0,
    genre_ids: movie.genre_ids || []
  };
}

Deno.serve(app.fetch);

