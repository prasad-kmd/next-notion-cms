import { requireAdmin } from "@/lib/auth-utils";
import { tmdb } from "@/lib/tmdb";
import { MovieCard } from "@/components/entertainment/movie-card";
import { HeroCarousel } from "@/components/entertainment/hero-carousel";
import { MyList } from "@/components/entertainment/my-list";
import { ChevronRight, Info } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Entertainment | Engineering Workspace",
  description:
    "Experience cinema like never before. High-fidelity streaming for true cinephiles.",
};

export default async function EntertainmentPage() {
  // Protect with admin check
  await requireAdmin();

  const [trendingMovies, popularMovies, topRatedMovies, trendingTV] =
    await Promise.all([
      tmdb.getTrendingMovies(),
      tmdb.getPopularMovies(),
      tmdb.getTopRatedMovies(),
      tmdb.getTrendingTV(),
    ]);

  // Combine trending movies and TV for the carousel (Exactly 5 items)
  const carouselItems = [
    ...trendingMovies.results.slice(0, 3),
    ...trendingTV.results.slice(0, 2),
  ];

  return (
    <div className="flex flex-col gap-12 pb-24">
      {/* Hero Carousel Section */}
      <HeroCarousel items={carouselItems} />

      {/* My List Section */}
      <MyList />

      {/* Trending Movies */}
      <section className="px-6 md:px-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-3xl font-bold tracking-tight text-foreground mb-1 font-serif uppercase">
              Trending Movies
            </h3>
            <div className="h-1.5 w-16 bg-primary rounded-full"></div>
          </div>
          <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline cursor-pointer">
            Explore all <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {trendingMovies.results.slice(0, 12).map((movie) => (
            <MovieCard key={movie.id} item={movie} type="movie" />
          ))}
        </div>
      </section>

      {/* Popular Movies */}
      <section className="px-6 md:px-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-3xl font-bold tracking-tight text-foreground mb-1 font-serif uppercase">
              Popular Movies
            </h3>
            <div className="h-1.5 w-16 bg-primary rounded-full"></div>
          </div>
          <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline cursor-pointer">
            Explore all <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {popularMovies.results.slice(0, 12).map((movie) => (
            <MovieCard key={movie.id} item={movie} type="movie" />
          ))}
        </div>
      </section>

      {/* Top Rated Movies */}
      <section className="px-6 md:px-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-3xl font-bold tracking-tight text-foreground mb-1 font-serif uppercase">
              Top Rated
            </h3>
            <div className="h-1.5 w-16 bg-primary rounded-full"></div>
          </div>
          <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline cursor-pointer">
            Explore all <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {topRatedMovies.results.slice(0, 12).map((movie) => (
            <MovieCard key={movie.id} item={movie} type="movie" />
          ))}
        </div>
      </section>

      {/* Trending TV Shows */}
      <section className="px-6 md:px-12">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h3 className="text-3xl font-bold tracking-tight text-foreground mb-1 font-serif uppercase">
              Trending TV Shows
            </h3>
            <div className="h-1.5 w-16 bg-primary rounded-full"></div>
          </div>
          <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline cursor-pointer">
            Explore all <ChevronRight className="h-4 w-4" />
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
          {trendingTV.results.slice(0, 12).map((tv) => (
            <MovieCard key={tv.id} item={tv} type="tv" />
          ))}
        </div>
      </section>

      {/* API Attribution Footer */}
      <footer className="mt-24 px-6 md:px-12 py-16 border-t border-border/10 bg-muted/5">
        <div className="flex flex-col md:flex-row justify-between items-center gap-12 text-center md:text-left">
          <div className="space-y-6 max-w-3xl">
            <h4 className="text-xl font-bold flex items-center gap-3 justify-center md:justify-start font-serif uppercase tracking-wider">
              <Info className="h-6 w-6 text-primary" />
              Data Sources & Legal
            </h4>
            <p className="text-sm text-muted-foreground leading-relaxed font-sans">
              This product uses the <strong>TMDB API</strong> but is not
              endorsed or certified by TMDB. Movie ratings and additional
              details are powered by the <strong>OMDb API</strong>. Streaming
              links are provided by third-party services. Torrent links are
              sourced from the <strong>YTS API</strong>. We do not host any
              video files or torrents on our servers.
            </p>
          </div>
          <div className="flex items-center gap-8 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <div className="text-2xl font-black italic tracking-tighter hover:text-primary transition-colors">
              TMDB
            </div>
            <div className="text-2xl font-black italic tracking-tighter hover:text-primary transition-colors">
              OMDb
            </div>
            <div className="text-2xl font-black italic tracking-tighter hover:text-primary transition-colors">
              YTS
            </div>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-border/5 text-center text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black font-mono">
          © {new Date().getFullYear()} Entertainment • Engineering Workspace
        </div>
      </footer>
    </div>
  );
}
