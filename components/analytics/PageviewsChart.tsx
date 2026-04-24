"use client";

import { useEffect, useState } from "react";
import { AreaChart } from "@/components/ui/charts/AreaChart";

export function PageviewsChart() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("/api/admin/analytics", {
          method: "POST",
          body: JSON.stringify({ insightType: "total_pageviews" }),
        });
        if (!response.ok) throw new Error("Failed to fetch analytics");
        const json = await response.json();
        setData(json);
      } catch (err: unknown) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <div className="h-64 flex items-center justify-center bg-card/5 rounded-3xl border border-border/40 animate-pulse font-local-inter">Loading Chart...</div>;
  if (error) return <div className="h-64 flex items-center justify-center text-destructive font-local-inter">{error}</div>;

  // Transform data for Recharts
  const labels = data?.result?.[0]?.labels || [];
  const values = data?.result?.[0]?.data || [];
  
  const chartData = labels.map((label: string, index: number) => ({
    date: label,
    Pageviews: values[index],
  }));

  return (
    <div className="h-64 w-full min-h-[256px]">
      <AreaChart 
        data={chartData}
        index="date"
        categories={["Pageviews"]}
        colors={["blue"]}
        showGridLines={true}
        showLegend={false}
        className="h-full"
      />
    </div>
  );
}
