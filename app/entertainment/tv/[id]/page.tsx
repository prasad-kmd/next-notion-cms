import { tmdb } from "@/lib/tmdb";
import { getOMDBData } from "@/lib/omdb";
import { TVControls } from "@/components/entertainment/tv-controls";
import { BookmarkButton } from "@/components/entertainment/bookmark-button";
import { requireAdmin } from "@/lib/auth-utils";
import { Calendar, ChevronLeft } from "lucide-react";
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
    const show = await tmdb.getTVDetails(id);
    return {
      title: `${show.name} | Entertainment`,
      description: show.overview,
    };
  } catch {
    return { title: "TV Show Details" };
  }
}

export default async function TVDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;

  try {
    const [show, credits, externalIds] = await Promise.all([
      tmdb.getTVDetails(id),
      tmdb.getTVCredits(id),
      tmdb.getTVExternalIds(id),
    ]);

    const omdbData = externalIds.imdb_id
      ? await getOMDBData(externalIds.imdb_id)
      : null;
    const year = new Date(show.first_air_date).getFullYear();

    return (
      <div className="flex flex-col gap-16 pb-24">
        {/* Backdrop Hero */}
        <section className="relative h-[70vh] w-full overflow-hidden">
          {show.backdrop_path && (
            <Image
              src={tmdb.getImageUrl(show.backdrop_path, "original")!}
              alt={show.name}
              fill
              className="object-cover"
              priority
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent"></div>

          <div className="absolute inset-0 flex items-end">
            <div className="container mx-auto px-6 md:px-12 pb-12 flex flex-col md:flex-row gap-8 items-end">
              <div className="relative w-48 aspect-2/3 rounded-2xl overflow-hidden shadow-2xl border border-white/10 hidden md:block shrink-0">
                {show.poster_path ? (
                  <Image
                    src={tmdb.getImageUrl(show.poster_path, "w500")!}
                    alt={show.name}
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
                  {show.name}
                </h1>

                <div className="flex flex-wrap items-center gap-4">
                  {show.genres.map((genre) => (
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
                        id: show.id,
                        type: "tv",
                        title: show.name,
                        poster_path: show.poster_path!,
                        vote_average: show.vote_average,
                        release_date: show.first_air_date,
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
                      {show.vote_average.toFixed(1)}
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
                    <Calendar className="h-4 w-4" />
                    <span>{year}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-muted px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest">
                      {show.number_of_seasons} Seasons
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Player & Controls Section */}
        <section
          id="player"
          className="container mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-16 scroll-mt-24"
        >
          <div className="lg:col-span-8 space-y-16">
            {/* TV Controls & Player */}
            <TVControls show={show} />

            {/* Plot */}
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight flex items-center gap-4">
                <span className="w-1.5 h-10 bg-primary rounded-full"></span>
                The Synopsis
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-4xl font-light font-sans">
                {show.overview}
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
          </div>

          {/* Sidebar Area: Production Info */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-card border border-border/10 p-6 rounded-2xl shadow-2xl space-y-6 sticky top-24">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] text-primary font-sans">
                Production Details
              </h3>
              <div className="space-y-6">
                {[
                  { label: "Status", value: show.status },
                  { label: "Seasons", value: show.number_of_seasons },
                  { label: "Episodes", value: show.number_of_episodes },
                  {
                    label: "Language",
                    value: show.original_language.toUpperCase(),
                  },
                  {
                    label: "Networks",
                    value: show.networks.map((n) => n.name).join(", ") || "N/A",
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
            </div>
          </div>
        </section>
      </div>
    );
  } catch (error) {
    console.error("Failed to fetch TV details:", error);
    return notFound();
  }
}
