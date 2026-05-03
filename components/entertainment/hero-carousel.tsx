"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Play,
  Star,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { tmdb } from "@/lib/tmdb";
import { Movie, TVShow } from "@/types/tmdb";
import { BookmarkButton } from "./bookmark-button";
import { cn } from "@/lib/utils";

interface HeroCarouselProps {
  items: (Movie | TVShow)[];
}

export function HeroCarousel({ items }: HeroCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);
  const duration = 8000; // 8 seconds per slide

  const nextSlide = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    setCurrentIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    progressRef.current = 0;
    setProgress(0);
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  const handleSelect = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      progressRef.current = 0;
      setProgress(0);
      setCurrentIndex(index);
    },
    [currentIndex],
  );

  const startTimer = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    const startTime = Date.now() - (progressRef.current / 100) * duration;

    autoPlayRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      progressRef.current = newProgress;
      setProgress(newProgress);

      if (newProgress >= 100) {
        nextSlide();
      }
    }, 50);
  }, [duration, nextSlide]);

  useEffect(() => {
    if (!isPaused) {
      startTimer();
    } else if (autoPlayRef.current) {
      clearInterval(autoPlayRef.current);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [currentIndex, isPaused, startTimer]);

  if (!items.length) return null;

  const currentItem = items[currentIndex];
  const isMovie = "title" in currentItem;
  const title = isMovie
    ? (currentItem as Movie).title
    : (currentItem as TVShow).name;
  const releaseDate = isMovie
    ? (currentItem as Movie).release_date
    : (currentItem as TVShow).first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : "N/A";
  const type = isMovie ? "movie" : "tv";

  return (
    <section
      className="relative h-[calc(100vh-4rem)] min-h-[600px] w-full overflow-hidden group bg-black"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Background Images with transitions */}
      {items.map((item, index) => (
        <div
          key={item.id}
          className={cn(
            "absolute inset-0 transition-opacity duration-1000 ease-in-out",
            index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0",
          )}
        >
          {item.backdrop_path && (
            <Image
              src={tmdb.getImageUrl(item.backdrop_path, "original")!}
              alt={title}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent lg:bg-gradient-to-r lg:from-background lg:via-background/40 lg:to-transparent"></div>
        </div>
      ))}

      {/* Content */}
      <div className="relative z-20 flex h-full items-center px-6 md:px-12 lg:px-20 pb-32 lg:pb-0">
        <div className="max-w-4xl text-foreground">
          <div className="flex items-center gap-3 mb-6 animate-in fade-in slide-in-from-left-4 duration-700 font-bold font-sans">
            <span className="bg-primary/20 text-primary px-4 py-1.5 rounded-full text-[10px] tracking-widest uppercase border border-primary/30 backdrop-blur-md">
              Trending Now
            </span>
            <span className="text-muted-foreground text-sm font-medium">
              {year} • {isMovie ? "Movie" : "TV Show"}
            </span>
          </div>

          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-8 leading-none uppercase animate-in fade-in slide-in-from-bottom-4 duration-700 font-serif text-balance">
            {title}
          </h1>

          <div className="flex items-center gap-6 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
            <div className="flex items-center text-yellow-500 gap-2 bg-yellow-500/10 px-3 py-1.5 rounded-lg border border-yellow-500/20 backdrop-blur-md">
              <Star className="h-5 w-5 fill-current" />
              <span className="font-black text-lg">
                {currentItem.vote_average.toFixed(1)}
              </span>
            </div>
            <span className="text-muted-foreground font-bold uppercase tracking-widest text-[10px] px-3 py-1.5 rounded-lg border border-border/10 bg-muted/20 backdrop-blur-md font-sans">
              TMDB Popularity
            </span>
          </div>

          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl leading-relaxed line-clamp-3 animate-in fade-in slide-in-from-bottom-6 duration-700 delay-200 font-sans">
            {currentItem.overview}
          </p>

          <div className="flex flex-wrap items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
            <Link
              href={`/entertainment/${type}/${currentItem.id}`}
              className="bg-primary text-primary-foreground px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3 hover:scale-105 transition-all shadow-xl shadow-primary/20 hover:bg-primary/90"
            >
              <Play className="h-5 w-5 fill-current" />
              Watch Now
            </Link>

            <BookmarkButton
              item={{
                id: currentItem.id,
                type,
                title,
                poster_path: currentItem.poster_path!,
                vote_average: currentItem.vote_average,
                release_date: isMovie
                  ? (currentItem as Movie).release_date
                  : (currentItem as TVShow).first_air_date,
              }}
              className="h-[60px] px-8 rounded-2xl bg-muted/30 border-border/10 hover:bg-muted/50"
            />
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-10 right-12 hidden lg:flex gap-4 z-30">
        <button
          onClick={prevSlide}
          className="p-4 rounded-full border border-border/10 bg-background/20 backdrop-blur-xl text-foreground hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer group/nav"
        >
          <ChevronLeft className="h-6 w-6 group-hover/nav:-translate-x-0.5 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="p-4 rounded-full border border-border/10 bg-background/20 backdrop-blur-xl text-foreground hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer group/nav"
        >
          <ChevronRight className="h-6 w-6 group-hover/nav:translate-x-0.5 transition-transform" />
        </button>
      </div>

      {/* Thumbnails / Progress Pagination */}
      <div className="absolute bottom-8 left-0 right-0 z-30 px-6 md:px-12 lg:px-20">
        <div className="mx-auto flex max-w-full items-center justify-center gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {items.map((item, index) => (
            <button
              key={item.id}
              onClick={() => handleSelect(index)}
              className={cn(
                "group/thumb relative flex flex-col min-w-[140px] lg:min-w-[180px] p-4 rounded-2xl border transition-all text-left backdrop-blur-md",
                index === currentIndex
                  ? "bg-white/10 border-primary/50 shadow-2xl shadow-primary/10"
                  : "bg-black/40 border-white/5 hover:bg-white/5",
              )}
            >
              <span
                className={cn(
                  "text-[9px] font-black uppercase tracking-[0.2em] mb-1.5 transition-colors font-mono",
                  index === currentIndex
                    ? "text-primary"
                    : "text-muted-foreground",
                )}
              >
                {index === currentIndex
                  ? "Viewing"
                  : (("title" in item ? "Movie" : "TV Show") as string)}
              </span>
              <span className="text-xs font-black text-foreground line-clamp-1 uppercase tracking-tight font-sans">
                {("title" in item ? item.title : item.name) as string}
              </span>

              {/* Progress Bar */}
              <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-white/10">
                {index === currentIndex ? (
                  <div
                    className="h-full bg-primary transition-all duration-50 ease-linear"
                    style={{ width: `${progress}%` }}
                  />
                ) : (
                  <div className="h-full w-0 bg-white/20" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
