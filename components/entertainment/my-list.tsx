"use client";

import { useEntertainmentBookmarks } from "@/hooks/use-entertainment-bookmarks";
import { MovieCard } from "./movie-card";
import { Heart } from "lucide-react";

export function MyList() {
  const { bookmarks } = useEntertainmentBookmarks();

  if (bookmarks.length === 0) return null;

  return (
    <section className="container mx-auto px-6 md:px-12 py-16 space-y-10">
      <div className="flex items-center justify-between border-b border-border/10 pb-6">
        <div className="flex items-center gap-4">
          <div className="bg-primary/10 p-3 rounded-2xl">
            <Heart className="h-6 w-6 text-primary fill-primary" />
          </div>
          <div>
            <h2 className="text-3xl font-black tracking-tighter uppercase text-foreground font-serif">
              My <span className="text-primary">List</span>
            </h2>
            <p className="text-muted-foreground text-sm font-medium font-sans">
              Your personal collection
            </p>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <span>{bookmarks.length} Items</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8">
        {bookmarks.map((item) => (
          <MovieCard key={item.id} item={item as unknown} type={item.type} />
        ))}
      </div>
    </section>
  );
}
