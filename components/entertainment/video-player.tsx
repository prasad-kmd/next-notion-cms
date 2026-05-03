"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";

interface VideoPlayerProps {
  tmdbId: number;
  type: "movie" | "tv";
  season?: number;
  episode?: number;
}

const VIDSRC_DOMAINS = [
  "vidsrc.to",
  "vidsrc.me",
  "2embed.cc",
  "autoembed.to",
];

export function VideoPlayer({
  tmdbId,
  type,
  season,
  episode,
}: VideoPlayerProps) {
  const [currentDomainIndex, setCurrentDomainIndex] = useState(0);

  const domain = VIDSRC_DOMAINS[currentDomainIndex];
  let embedUrl = "";

  if (domain === "vidsrc.to" || domain === "vidsrc.me") {
    embedUrl =
      type === "movie"
        ? `https://${domain}/embed/movie/${tmdbId}`
        : `https://${domain}/embed/tv/${tmdbId}/${season}/${episode}`;
  } else if (domain === "2embed.cc") {
    embedUrl =
      type === "movie"
        ? `https://www.2embed.cc/embed/${tmdbId}`
        : `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`;
  } else if (domain === "autoembed.to") {
    embedUrl =
      type === "movie"
        ? `https://autoembed.to/movie/tmdb/${tmdbId}`
        : `https://autoembed.to/tv/tmdb/${tmdbId}-${season}-${episode}`;
  }

  const switchServer = () => {
    setCurrentDomainIndex((prev) => (prev + 1) % VIDSRC_DOMAINS.length);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-muted border border-border/5 shadow-2xl group">
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allowFullScreen
          allow="autoplay; encrypted-media"
        />

        {/* Quality/Server Overlay (Simplified) */}
        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={switchServer}
            className="bg-background/60 backdrop-blur-md p-2 rounded-full text-primary hover:bg-primary hover:text-primary-foreground transition-all cursor-pointer"
            title="Switch Server"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-muted-foreground font-sans">
        <div className="flex items-center gap-2">
          <span className="bg-primary/10 text-primary px-2 py-1 rounded font-bold uppercase tracking-wider font-mono">
            Server: {domain}
          </span>
          <span>If player doesn't load, try switching server.</span>
        </div>
        <button
          onClick={switchServer}
          className="text-primary font-bold hover:underline cursor-pointer"
        >
          Switch Server
        </button>
      </div>
    </div>
  );
}
