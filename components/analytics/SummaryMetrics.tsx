"use client";

import { useEffect, useState } from "react";
import { StatCard } from "./StatCard";
import {
  BarChart as BarChartIcon,
  Users,
  Activity,
  MessageSquare,
  Bookmark,
  FileText,
} from "lucide-react";
import { formatCompactNumber } from "@/lib/recharts-theme";

interface SummaryMetricsProps {
  timeRange: string;
}

interface SummaryData {
  total_pageviews: number;
  unique_visitors: number;
  avg_views_per_post: number;
  total_comments: number;
  total_bookmarks: number;
  total_content: number;
}

export function SummaryMetrics({ timeRange }: SummaryMetricsProps) {
  const [data, setData] = useState<SummaryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            insightType: "summary_metrics",
            params: { timeRange }
          }),
        });
        if (!response.ok) throw new Error("Failed to fetch summary metrics");
        const json = await response.json();
        setData(json.result);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [timeRange]);

  if (error) return <div className="text-destructive p-4 border border-destructive/20 bg-destructive/5 rounded-2xl">Error: {error}</div>;

  const metrics = [
    {
      title: "Total Pageviews",
      value: data ? formatCompactNumber(data.total_pageviews) : "--",
      icon: <BarChartIcon className="w-4 h-4" />,
      description: "Across all pages",
    },
    {
      title: "Unique Visitors",
      value: data ? formatCompactNumber(data.unique_visitors) : "--",
      icon: <Users className="w-4 h-4" />,
      description: "Based on distinct IDs",
    },
    {
      title: "Avg. Views/Post",
      value: data ? data.avg_views_per_post : "--",
      icon: <Activity className="w-4 h-4" />,
      description: "Engagement depth",
    },
    {
      title: "Comments",
      value: data ? formatCompactNumber(data.total_comments) : "--",
      icon: <MessageSquare className="w-4 h-4" />,
      description: "User discussions",
    },
    {
      title: "Bookmarks",
      value: data ? formatCompactNumber(data.total_bookmarks) : "--",
      icon: <Bookmark className="w-4 h-4" />,
      description: "Saved for later",
    },
    {
      title: "Content Pieces",
      value: data ? data.total_content : "--",
      icon: <FileText className="w-4 h-4" />,
      description: "Total published",
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {metrics.map((metric, idx) => (
        <StatCard
          key={idx}
          title={metric.title}
          value={metric.value}
          icon={metric.icon}
          description={metric.description}
          loading={loading}
        />
      ))}
    </div>
  );
}
