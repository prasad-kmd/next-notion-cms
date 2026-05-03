"use client";

import { useState } from "react";
import { VideoPlayer } from "./video-player";
import { TVShowDetails } from "@/types/tmdb";

interface TVControlsProps {
  show: TVShowDetails;
}

export function TVControls({ show }: TVControlsProps) {
  const [selectedSeason, setSelectedSeason] = useState(1);
  const [selectedEpisode, setSelectedEpisode] = useState(1);

  const currentSeason = show.seasons.find(
    (s) => s.season_number === selectedSeason,
  );
  const totalEpisodes = currentSeason?.episode_count || 0;

  return (
    <div className="flex flex-col gap-12">
      {/* Video Player */}
      <VideoPlayer
        tmdbId={show.id}
        type="tv"
        season={selectedSeason}
        episode={selectedEpisode}
      />

      {/* Season & Episode Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-sans">
            Select Season
          </label>
          <div className="flex flex-wrap gap-2">
            {show.seasons.map((season) => (
              <button
                key={season.id}
                onClick={() => {
                  setSelectedSeason(season.season_number);
                  setSelectedEpisode(1);
                }}
                className={`px-4 py-2 rounded-lg border transition-all text-sm font-bold cursor-pointer font-sans ${
                  selectedSeason === season.season_number
                    ? "bg-primary border-primary text-primary-foreground"
                    : "border-border/30 text-muted-foreground hover:border-primary"
                }`}
              >
                S{season.season_number}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest font-sans">
            Select Episode
          </label>
          <div className="flex flex-wrap gap-2 max-h-[200px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
            {Array.from({ length: totalEpisodes }, (_, i) => i + 1).map(
              (episode) => (
                <button
                  key={episode}
                  onClick={() => setSelectedEpisode(episode)}
                  className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all text-sm font-bold cursor-pointer font-sans ${
                    selectedEpisode === episode
                      ? "bg-primary border-primary text-primary-foreground"
                      : "border-border/30 text-muted-foreground hover:border-primary"
                  }`}
                >
                  {episode}
                </button>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
