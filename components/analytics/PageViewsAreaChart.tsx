"use client";

import { useEffect, useState } from "react";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer} from "recharts";
import { getRechartsTheme } from "@/lib/recharts-theme";
import { useTheme } from "next-themes";
import { getColorCode } from "../ui/charts/ChartUtils";

interface PageViewsAreaChartProps {
  timeRange: string;
}

export function PageViewsAreaChart({ timeRange }: PageViewsAreaChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasMounted = useHasMounted();
  const { theme } = useTheme();
  const chartTheme = getRechartsTheme(theme);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const response = await fetch("/api/admin/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            insightType: "pageviews_trend_area",
            params: { timeRange }
          }),
        });
        if (response.ok) {
          const json = await response.json();
          const series = json.result?.[0];
          if (series) {
            const transformed = series.labels.map((label: string, i: number) => ({
              date: label,
              views: series.data[i]
            }));
            setData(transformed);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [timeRange]);

  if (loading || !hasMounted) return <div className="h-[320px] flex items-center justify-center animate-pulse bg-muted/10 rounded-3xl">Loading trend...</div>;

  const color = getColorCode("blue");

  return (
    <div className="h-[320px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={color} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid {...chartTheme.grid} vertical={false} />
          <XAxis 
            dataKey="date" 
            {...chartTheme.axis}
            minTickGap={30}
          />
          <YAxis {...chartTheme.axis} />
          <Tooltip contentStyle={chartTheme.tooltip.contentStyle} />
          <Area 
            type="monotone" 
            dataKey="views" 
            stroke={color} 
            fillOpacity={1} 
            fill="url(#colorViews)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
