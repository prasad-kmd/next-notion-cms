"use client";

import { useState } from "react";
import { TopContentChart } from "@/components/analytics/TopContentChart";
import { TopContentTable } from "@/components/analytics/TopContentTable";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AnalyticsDashboardFilters() {
  const [timeRange, setTimeRange] = useState("-30d");
  const [contentType, setContentType] = useState<string>("all");

  const actualContentType = contentType === "all" ? undefined : contentType;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Range:</span>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[140px] rounded-xl border-border/50">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="-7d">Last 7 days</SelectItem>
              <SelectItem value="-30d">Last 30 days</SelectItem>
              <SelectItem value="-90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-muted-foreground">Type:</span>
          <Select value={contentType} onValueChange={setContentType}>
            <SelectTrigger className="w-[140px] rounded-xl border-border/50">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Content</SelectItem>
              <SelectItem value="blog">Blog</SelectItem>
              <SelectItem value="article">Articles</SelectItem>
              <SelectItem value="tutorial">Tutorials</SelectItem>
              <SelectItem value="project">Projects</SelectItem>
              <SelectItem value="wiki">Wiki</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <TopContentChart timeRange={timeRange} contentType={actualContentType} />
        <TopContentTable timeRange={timeRange} contentType={actualContentType} />
      </div>
    </div>
  );
}
