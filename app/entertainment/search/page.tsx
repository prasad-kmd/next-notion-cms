import { tmdb } from "@/lib/tmdb";
import { MovieCard } from "@/components/entertainment/movie-card";
import { SearchInput } from "@/components/entertainment/search-input";
import { Movie, TVShow, SearchResult } from "@/types/tmdb";
import { Search, Film, Tv, Info } from "lucide-react";
import { requireAdmin } from "@/lib/auth-utils";

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  await requireAdmin();
  const { q: query = "" } = await searchParams;

  if (!query) {
    return (
      <div className="container mx-auto px-6 md:px-12 py-24 flex flex-col items-center max-w-4xl">
        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center mb-8 rotate-3">
          <Search className="h-10 w-10 text-primary" />
        </div>
        <h1 className="text-4xl md:text-6xl font-black mb-6 text-foreground tracking-tighter text-center uppercase font-serif">
          Universe <span className="text-primary">Search</span>
        </h1>
        <p className="text-xl text-muted-foreground mb-12 text-center max-w-2xl font-light leading-relaxed font-sans">
          Discover millions of movies, TV shows and people. Explore now.
        </p>
        <SearchInput className="w-full max-w-2xl px-4" />

        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
          <div className="bg-card/50 border border-border/10 p-8 rounded-3xl hover:bg-card transition-colors group">
            <Film className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2 font-serif uppercase tracking-wider">
              Movies
            </h3>
            <p className="text-sm text-muted-foreground font-light font-sans">
              Thousands of cinematic masterpieces at your fingertips.
            </p>
          </div>
          <div className="bg-card/50 border border-border/10 p-8 rounded-3xl hover:bg-card transition-colors group">
            <Tv className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2 font-serif uppercase tracking-wider">
              TV Shows
            </h3>
            <p className="text-sm text-muted-foreground font-light font-sans">
              From classic series to modern binge-worthy hits.
            </p>
          </div>
          <div className="bg-card/50 border border-border/10 p-8 rounded-3xl hover:bg-card transition-colors group">
            <Info className="h-8 w-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
            <h3 className="font-bold text-lg mb-2 font-serif uppercase tracking-wider">
              Metadata
            </h3>
            <p className="text-sm text-muted-foreground font-light font-sans">
              Comprehensive details including cast, crew and ratings.
            </p>
          </div>
        </div>
      </div>
    );
  }

  const results = await tmdb.searchMulti(query);

  const movies = results.results.filter(
    (item: SearchResult) => item.media_type === "movie",
  ) as unknown as Movie[];
  const tvShows = results.results.filter(
    (item: SearchResult) => item.media_type === "tv",
  ) as unknown as TVShow[];

  return (
    <div className="container mx-auto px-6 md:px-12 py-12 flex flex-col gap-16 min-h-[70vh]">
      <div className="flex flex-col gap-10 border-b border-border/10 pb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
          <div>
            <h4 className="text-primary font-bold text-xs uppercase tracking-[0.3em] mb-3">
              Search Results
            </h4>
            <h2 className="text-4xl md:text-6xl font-black text-foreground tracking-tighter uppercase font-serif">
              "{query}"
            </h2>
            <p className="text-muted-foreground mt-4 text-lg font-sans">
              We found{" "}
              <span className="text-foreground font-bold font-sans">
                {results.total_results}
              </span>{" "}
              matching titles for you.
            </p>
          </div>
          <div className="w-full md:w-1/2 lg:w-1/3">
            <SearchInput />
          </div>
        </div>
      </div>

      <div className="space-y-20">
        {movies.length > 0 && (
          <section className="space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold tracking-tight flex items-center gap-4 uppercase font-serif">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                Movies
              </h3>
              <span className="text-xs text-muted-foreground font-bold tracking-widest">
                {movies.length} Results
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-10">
              {movies.map((movie) => (
                <MovieCard key={movie.id} item={movie} type="movie" />
              ))}
            </div>
          </section>
        )}

        {tvShows.length > 0 && (
          <section className="space-y-10">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold tracking-tight flex items-center gap-4 uppercase font-serif">
                <span className="w-2 h-8 bg-primary rounded-full"></span>
                TV Shows
              </h3>
              <span className="text-xs text-muted-foreground font-bold tracking-widest">
                {tvShows.length} Results
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-10">
              {tvShows.map((tv) => (
                <MovieCard key={tv.id} item={tv} type="tv" />
              ))}
            </div>
          </section>
        )}

        {movies.length === 0 && tvShows.length === 0 && (
          <div className="text-center py-32 flex flex-col items-center">
            <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-8">
              <Info className="h-10 w-10 text-muted-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground mb-4">
              No results found
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto text-lg font-light leading-relaxed">
              We couldn't find any movies or TV shows matching "{query}". Try
              checking for typos or using different keywords.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
