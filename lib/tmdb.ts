import {
  TMDBResponse,
  Movie,
  TVShow,
  MovieDetails,
  TVShowDetails,
  Credits,
  SearchResult,
} from "@/types/tmdb";

const TMDB_API_KEY = process.env.TMDB_API_KEY;
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

async function fetchTMDB<T>(
  endpoint: string,
  params: Record<string, string> = {},
): Promise<T> {
  const queryParams = new URLSearchParams({
    api_key: TMDB_API_KEY || "",
    ...params,
  });
  const url = `${TMDB_BASE_URL}${endpoint}?${queryParams.toString()}`;

  const response = await fetch(url, {
    next: { revalidate: 3600 }, // Cache for 1 hour
  });
  if (!response.ok) {
    throw new Error(`TMDB API error: ${response.statusText}`);
  }
  return response.json();
}

export const tmdb = {
  // Movies
  getTrendingMovies: () =>
    fetchTMDB<TMDBResponse<Movie>>("/trending/movie/day"),
  getPopularMovies: () => fetchTMDB<TMDBResponse<Movie>>("/movie/popular"),
  getTopRatedMovies: () => fetchTMDB<TMDBResponse<Movie>>("/movie/top_rated"),
  getUpcomingMovies: () => fetchTMDB<TMDBResponse<Movie>>("/movie/upcoming"),
  getMovieDetails: (id: string | number) =>
    fetchTMDB<MovieDetails>(`/movie/${id}`),
  getMovieRecommendations: (id: string | number) =>
    fetchTMDB<TMDBResponse<Movie>>(`/movie/${id}/recommendations`),
  getMovieCredits: (id: string | number) =>
    fetchTMDB<Credits>(`/movie/${id}/credits`),

  // TV Shows
  getTrendingTV: () => fetchTMDB<TMDBResponse<TVShow>>("/trending/tv/day"),
  getPopularTV: () => fetchTMDB<TMDBResponse<TVShow>>("/tv/popular"),
  getTVDetails: (id: string | number) => fetchTMDB<TVShowDetails>(`/tv/${id}`),
  getTVCredits: (id: string | number) =>
    fetchTMDB<Credits>(`/tv/${id}/credits`),
  getTVExternalIds: (id: string | number) =>
    fetchTMDB<{ imdb_id: string }>(`/tv/${id}/external_ids`),

  // Search
  searchMovies: (query: string) =>
    fetchTMDB<TMDBResponse<Movie>>("/search/movie", { query }),
  searchTV: (query: string) =>
    fetchTMDB<TMDBResponse<TVShow>>("/search/tv", { query }),
  searchMulti: (query: string) =>
    fetchTMDB<TMDBResponse<SearchResult>>("/search/multi", { query }),

  // Helpers
  getImageUrl: (path: string | null, size: "w500" | "original" = "w500") =>
    path ? `${TMDB_IMAGE_BASE_URL}/${size}${path}` : null,
};
