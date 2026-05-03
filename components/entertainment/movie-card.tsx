"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Heart } from "lucide-react";
import { tmdb } from "@/lib/tmdb";
import { Movie, TVShow } from "@/types/tmdb";
import { useEntertainmentBookmarks } from "@/hooks/use-entertainment-bookmarks";

interface MovieCardProps {
  item: Movie | TVShow;
  type: "movie" | "tv";
}

export function MovieCard({ item, type }: MovieCardProps) {
  const { isBookmarked } = useEntertainmentBookmarks();
  const bookmarked = isBookmarked(item.id);

  const title = (item as Movie).title || (item as TVShow).name;
  const releaseDate =
    (item as Movie).release_date || (item as TVShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
  const posterUrl = tmdb.getImageUrl(item.poster_path, "w500");

  return (
    <Link
      href={`/entertainment/${type}/${item.id}`}
      className="group cursor-pointer"
    >
      <div className="relative aspect-2/3 rounded-2xl overflow-hidden mb-4 bg-muted border border-border/10 shadow-xl transition-all duration-500 group-hover:scale-[1.03] group-hover:-translate-y-2 group-hover:shadow-primary/5 group-hover:border-primary/20">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 16vw"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-muted p-4 text-center">
            <span className="text-[10px] uppercase font-bold tracking-widest mb-2 opacity-50">
              No Poster
            </span>
            <span className="text-xs font-medium line-clamp-2">{title}</span>
          </div>
        )}

        <div className="absolute inset-0 bg-linear-to-t from-background via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
          <div className="w-full py-2 bg-primary text-primary-foreground rounded-lg text-[10px] font-black uppercase tracking-widest text-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
            View Details
          </div>
        </div>

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black text-primary border border-primary/20 flex items-center gap-1 shadow-lg font-mono">
          <Star className="h-3 w-3 fill-current" />
          {item.vote_average.toFixed(1)}
        </div>

        {/* Bookmark Indicator */}
        {bookmarked && (
          <div className="absolute top-3 right-3 bg-primary p-1.5 rounded-lg shadow-lg animate-in zoom-in duration-300">
            <Heart className="h-4 w-4 fill-primary-foreground text-primary-foreground" />
          </div>
        )}
      </div>

      <div className="px-1 space-y-1">
        <h4 className="text-foreground font-bold text-sm truncate group-hover:text-primary transition-colors font-sans uppercase">
          {title}
        </h4>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest opacity-70 font-mono">
            {year}
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary/80 group-hover:text-primary transition-colors font-sans">
            {type}
          </span>
        </div>
      </div>
    </Link>
  );
}
