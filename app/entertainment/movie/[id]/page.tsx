import { tmdb } from "@/lib/tmdb";
import { getOMDBData } from "@/lib/omdb";
import { MovieCard } from "@/components/entertainment/movie-card";
import { VideoPlayer } from "@/components/entertainment/video-player";
import { DownloadOptions } from "@/components/entertainment/download-options";
import { BookmarkButton } from "@/components/entertainment/bookmark-button";
import { requireAdmin } from "@/lib/auth-utils";
import { Clock, Calendar, ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const movie = await tmdb.getMovieDetails(id);
    return {
      title: `${movie.title} | Entertainment`,
      description: movie.overview,
    };
  } catch {
    return { title: "Movie Details" };
  }
}

export default async function MovieDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  try {
    const [movie, credits, recommendations] = await Promise.all([
      tmdb.getMovieDetails(id),
      tmdb.getMovieCredits(id),
      tmdb.getMovieRecommendations(id),
    ]);

    const omdbData = movie.imdb_id ? await getOMDBData(movie.imdb_id) : null;
    const year = new Date(movie.release_date).getFullYear();
    const runtime = `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`;

    return (
      <div className="flex flex-col gap-16 pb-24">
        {/* Backdrop Hero */}
        <section className="relative h-[70vh] w-full overflow-hidden">
          {movie.backdrop_path && (
            <Image
              src={tmdb.getImageUrl(movie.backdrop_path, "original")!}
              alt={movie.title}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>

          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-6 md:px-12 pb-12 flex flex-col md:flex-row gap-8 items-end">
              <div className="relative w-48 aspect-2/3 rounded-2xl overflow-hidden shadow-2xl border border-white/10 hidden md:block shrink-0">
                {movie.poster_path ? (
                  <Image
                    src={tmdb.getImageUrl(movie.poster_path, "w500")!}
                    alt={movie.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center text-xs font-bold uppercase tracking-widest text-muted-foreground text-center p-4">
                    No Poster
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-6">
                <Link
                  href="/entertainment"
                  className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline mb-4"
                >
                  <ChevronLeft className="h-4 w-4" /> Back to Entertainment
                </Link>

                <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase font-serif">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4">
                  {movie.genres.map((genre) => (
                    <span
                      key={genre.id}
                      className="bg-primary/20 text-primary px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-primary/30 backdrop-blur-md"
                    >
                      {genre.name}
                    </span>
                  ))}
                  <div className="flex items-center gap-4 ml-auto">
                    <BookmarkButton
                      item={{
                        id: movie.id,
                        type: "movie",
                        title: movie.title,
                        poster_path: movie.poster_path!,
                        vote_average: movie.vote_average,
                        release_date: movie.release_date,
                      }}
                      variant="outline"
                      showText={false}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-8 text-sm text-muted-foreground font-medium">
                  <div className="flex items-center gap-2 group">
                    <div className="bg-yellow-400 text-black px-1.5 py-0.5 rounded font-black text-[10px]">
                      TMDB
                    </div>
                    <span className="font-bold text-foreground text-lg">
                      {movie.vote_average.toFixed(1)}
                    </span>
                  </div>

                  {omdbData?.imdbRating && (
                    <div className="flex items-center gap-2">
                      <div className="bg-[#f5c518] text-black px-1.5 py-0.5 rounded font-black text-[10px]">
                        IMDb
                      </div>
                      <span className="font-bold text-foreground text-lg">
                        {omdbData.imdbRating}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>{runtime}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{year}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Player & Info Section */}
        <section
          id="player"
          className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 scroll-mt-24"
        >
          <div className="lg:col-span-8 space-y-16">
            {/* Player */}
            <VideoPlayer tmdbId={movie.id} type="movie" />

            {/* Plot */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight flex items-center gap-4">
                <span className="w-1.5 h-10 bg-primary rounded-full"></span>
                The Synopsis
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl font-light font-sans">
                {movie.overview}
              </p>
            </div>

            {/* Cast */}
            <div className="space-y-8">
              <h2 className="text-3xl font-bold tracking-tight">Cast & Crew</h2>
              <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide -mx-4 px-4">
                {credits.cast.slice(0, 12).map((person) => (
                  <div
                    key={person.id}
                    className="flex flex-col items-center shrink-0 group text-center w-28"
                  >
                    <div className="w-28 h-28 rounded-2xl overflow-hidden border-2 border-transparent group-hover:border-primary group-hover:scale-105 transition-all mb-4 shadow-xl relative">
                      {person.profile_path ? (
                        <Image
                          src={tmdb.getImageUrl(person.profile_path, "w500")!}
                          alt={person.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-muted flex items-center justify-center text-[10px] p-4 font-bold uppercase tracking-widest text-muted-foreground">
                          No Photo
                        </div>
                      )}
                    </div>
                    <span className="text-sm font-bold text-foreground truncate w-full">
                      {person.name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate w-full italic">
                      {person.character}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Download Options (YTS) */}
            {movie.imdb_id && (
              <DownloadOptions imdbId={movie.imdb_id} title={movie.title} />
            )}
          </div>

          {/* Sidebar Area: Production Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-card border border-border/10 p-6 rounded-2xl shadow-2xl space-y-6 sticky top-24">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary font-sans">
                Production Details
              </h3>
              <div className="space-y-6">
                {[
                  {
                    label: "Director",
                    value:
                      credits.crew.find((c) => c.job === "Director")?.name ||
                      "N/A",
                  },
                  {
                    label: "Status",
                    value: movie.status,
                  },
                  {
                    label: "Language",
                    value: movie.original_language.toUpperCase(),
                  },
                  {
                    label: "Budget",
                    value:
                      movie.budget > 0
                        ? `$${(movie.budget / 1000000).toFixed(1)}M`
                        : "N/A",
                  },
                  {
                    label: "Revenue",
                    value:
                      movie.revenue > 0
                        ? `$${(movie.revenue / 1000000).toFixed(1)}M`
                        : "N/A",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex justify-between items-start border-b border-border/5 last:border-0 group"
                  >
                    <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors mt-1 font-sans">
                      {item.label}
                    </span>
                    <span className="text-sm font-bold text-right max-w-[180px] font-sans">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>

              {omdbData?.Ratings && omdbData.Ratings.length > 0 && (
                <div className="pt-4 space-y-4">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary">
                    Critics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {omdbData.Ratings.map((rating, idx) => (
                      <div
                        key={idx}
                        className="bg-muted/50 p-4 rounded-xl border border-border/5"
                      >
                        <div className="text-[10px] text-muted-foreground uppercase font-bold mb-1 truncate">
                          {rating.Source}
                        </div>
                        <div className="text-lg font-black">{rating.Value}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Recommendations */}
        {recommendations.results.length > 0 && (
          <section className="container mx-auto px-6 md:px-12 space-y-12">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">
                More Like This
              </h2>
              <div className="h-1.5 w-20 bg-primary rounded-full"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10">
              {recommendations.results.slice(0, 10).map((item) => (
                <MovieCard key={item.id} item={item} type="movie" />
              ))}
            </div>
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch movie details:", error);
    return notFound();
  }
}
