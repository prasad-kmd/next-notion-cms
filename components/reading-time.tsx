import React from "react";
import { Clock } from "lucide-react";

interface ReadingTimeProps {
  minutes: number;
  className?: string;
}

export function ReadingTime({ minutes, className }: ReadingTimeProps) {
  if (!minutes || minutes <= 0) return null;

  return (
    <div className={`flex items-center gap-1.5 ${className}`}>
      <Clock className="w-3.5 h-3.5" />
      <span className="text-sm">
        {minutes} min read
      </span>
    </div>
  );
}
