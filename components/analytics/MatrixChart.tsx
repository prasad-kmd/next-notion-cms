"use client";

import { useEffect, useState } from "react";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend
} from "recharts";
import { ANALYTICS_COLORS, getRechartsTheme } from "@/lib/recharts-theme";
import { useTheme } from "next-themes";
import { getColorCode } from "../ui/charts/ChartUtils";

interface MatrixChartProps {
  timeRange: string;
  primaryDimension: string;
  secondaryDimension: string;
  title: string;
}

export function MatrixChart({ timeRange, primaryDimension, secondaryDimension, title }: MatrixChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const hasMounted = useHasMounted();
  const { theme } = useTheme();
  const chartTheme = getRechartsTheme(theme);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // This requires a more complex query. For now, we'll use PostHog's Breakdown with secondary dimension.
        // PostHog Trends API supports single breakdown. For true matrix (A vs B), 
        // we might need a custom HogQL query if we want to show it in one chart.
        
        // Simplified approach: Query pageviews broken down by primary dimension,
        // and we show it as a grouped bar chart if possible, but PostHog API 
        // usually returns time-series.
        
        // Let's use HogQL for a true matrix summary (not time-series)
        const response = await fetch("/api/admin/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            insightType: "multi_variable_insight", // We'll adapt this or add a new one
            params: { 
                timeRange, 
                breakdownBy: primaryDimension,
                // We'll need to extend the API to handle true matrix queries
            }
          }),
        });
        
        if (response.ok) {
          const json = await response.json();
          const results = json.result || [];
          
          // For now, let's just show a breakdown of primary dimension
          // because true 2D matrix needs a specific HogQL query shape.
          const transformed = results.map((s: unknown, i: number) => ({
            label: (s as { breakdown_value: string }).breakdown_value || "Other",
            value: (s as { data: number[] }).data.reduce((acc: number, v: number) => acc + v, 0)
          })).sort((a: unknown, b: unknown) => (b as { value: number }).value - (a as { value: number }).value).slice(0, 10);
          
          setData(transformed);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [timeRange, primaryDimension, secondaryDimension]);

  if (loading || !hasMounted) return <div className="h-[320px] flex items-center justify-center animate-pulse bg-muted/10 rounded-3xl">Loading {title}...</div>;

  return (
    <div className="h-[320px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid {...chartTheme.grid} vertical={false} />
          <XAxis dataKey="label" {...chartTheme.axis} />
          <YAxis {...chartTheme.axis} />
          <Tooltip contentStyle={chartTheme.tooltip.contentStyle} />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
                <Bar 
                    key={`bar-${index}`} 
                    dataKey="value" 
                    fill={getColorCode(ANALYTICS_COLORS[index % ANALYTICS_COLORS.length])} 
                />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
