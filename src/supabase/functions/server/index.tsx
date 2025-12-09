import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'npm:@supabase/supabase-js@2.39.7';
import * as kv from './kv_store.tsx';

const app = new Hono();

app.use('*', cors());
app.use('*', logger(console.log));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

// TMDB API configuration
const TMDB_API_KEY = Deno.env.get('TMDB_API_KEY') || 'demo_key';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

// Helper function to fetch from TMDB
async function fetchFromTMDB(endpoint: string) {
  try {
    const url = `${TMDB_BASE_URL}${endpoint}${endpoint.includes('?') ? '&' : '?'}api_key=${TMDB_API_KEY}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      console.error(`TMDB API error: ${response.status} ${response.statusText}`);
      // Return demo data if API fails
      return null;
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    return null;
  }
}

// Demo data for when TMDB API is not available
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

// Sign up endpoint
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
      // Automatically confirm the user's email since an email server hasn't been configured.
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

// Get popular movies
app.get('/make-server-0a88fa7c/movies/popular', async (c) => {
  try {
    const data = await fetchFromTMDB('/movie/popular');
    
    if (!data || !data.results) {
      // Return demo data if API fails
      return c.json({ movies: DEMO_MOVIES });
    }

    return c.json({ movies: data.results.slice(0, 20) });
  } catch (error) {
    console.error('Error fetching popular movies:', error);
    return c.json({ movies: DEMO_MOVIES });
  }
});

// Search movies
app.get('/make-server-0a88fa7c/movies/search', async (c) => {
  try {
    const query = c.req.query('query');
    
    if (!query) {
      return c.json({ error: 'Query parameter is required' }, 400);
    }

    const data = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}`);
    
    if (!data || !data.results) {
      // Return filtered demo data if API fails
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

// Get watched movies for a user
app.get('/make-server-0a88fa7c/watched-movies', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

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

// Add a movie to watched list
app.post('/make-server-0a88fa7c/watched-movies', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { movie } = await c.req.json();
    
    if (!movie || !movie.id) {
      return c.json({ error: 'Movie data is required' }, 400);
    }

    const watchedMovies = await kv.get(`watched:${user.id}`) || [];
    
    // Check if movie already exists
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

// Remove a movie from watched list
app.delete('/make-server-0a88fa7c/watched-movies', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

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

// Get watchlist for a user
app.get('/make-server-0a88fa7c/watchlist', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

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

// Add a movie to watchlist
app.post('/make-server-0a88fa7c/watchlist', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const { movie } = await c.req.json();
    
    if (!movie || !movie.id) {
      return c.json({ error: 'Movie data is required' }, 400);
    }

    const watchlistMovies = await kv.get(`watchlist:${user.id}`) || [];
    
    // Check if movie already exists
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

// Remove a movie from watchlist
app.delete('/make-server-0a88fa7c/watchlist', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

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

// Get personalized recommendations
app.get('/make-server-0a88fa7c/recommendations', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1];
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401);
    }

    const watchedMovies = await kv.get(`watched:${user.id}`) || [];
    
    if (watchedMovies.length === 0) {
      return c.json({ recommendations: [] });
    }

    // Get genre IDs from watched movies
    const genreIds = new Set<number>();
    watchedMovies.forEach((movie: any) => {
      if (movie.genre_ids) {
        movie.genre_ids.forEach((id: number) => genreIds.add(id));
      }
    });

    const genreArray = Array.from(genreIds);
    
    if (genreArray.length === 0) {
      // Fallback to popular movies
      const data = await fetchFromTMDB('/movie/popular');
      return c.json({ 
        recommendations: data?.results?.slice(0, 20) || DEMO_MOVIES 
      });
    }

    // Get recommendations based on genres
    const genreParam = genreArray.join(',');
    const data = await fetchFromTMDB(`/discover/movie?with_genres=${genreParam}&sort_by=vote_average.desc&vote_count.gte=100`);
    
    if (!data || !data.results) {
      // Return demo movies filtered by genre if API fails
      const filtered = DEMO_MOVIES.filter(m => 
        m.genre_ids.some(gid => genreArray.includes(gid))
      );
      return c.json({ recommendations: filtered });
    }

    // Filter out already watched movies
    const watchedIds = new Set(watchedMovies.map((m: any) => m.id));
    const recommendations = data.results.filter((m: any) => !watchedIds.has(m.id));

    return c.json({ recommendations: recommendations.slice(0, 20) });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return c.json({ error: 'Failed to generate recommendations' }, 500);
  }
});

Deno.serve(app.fetch);
