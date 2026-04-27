"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "@/components/ui/charts/BarChart";

interface TopContentChartProps {
  timeRange: string;
  contentType?: string;
}

export function TopContentChart({
  timeRange,
  contentType,
}: TopContentChartProps) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/admin/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            insightType: "top_content",
            params: { timeRange, contentType, limit: 10 },
          }),
        });

        if (response.ok) {
          const result = await response.json();
          setData(result.result);
        }
      } catch (error) {
        console.error("Failed to fetch top content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [timeRange, contentType]);

  if (isLoading) {
    return (
      <Card className="col-span-1 border-border/50 bg-card/50 backdrop-blur-sm rounded-4xl">
        <CardHeader>
          <CardTitle className="text-lg font-google-sans">
            Top Content (Views)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center bg-card/5 rounded-2xl border border-border/40 animate-pulse font-local-inter">
            Loading Chart...
          </div>
        </CardContent>
      </Card>
    );
  }

  // Transform data for Recharts
  const chartData = data.map((item) => ({
    name: item.title || item.slug,
    Views: item.views,
  }));

  return (
    <Card className="col-span-1 border-border/50 bg-card/50 backdrop-blur-sm rounded-4xl">
      <CardHeader>
        <CardTitle className="text-lg font-google-sans">
          Top Content (Views)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full min-h-[300px]">
          <BarChart
            data={chartData}
            index="name"
            categories={["Views"]}
            colors={["blue"]}
            layout="vertical"
            showGridLines={false}
            className="h-full"
          />
        </div>
      </CardContent>
    </Card>
  );
}
