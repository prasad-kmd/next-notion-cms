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

interface MultiVariableChartProps {
  timeRange: string;
  breakdownBy: string;
  title: string;
}

export function MultiVariableChart({ timeRange, breakdownBy, title }: MultiVariableChartProps) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
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
            insightType: "multi_variable_insight",
            params: { timeRange, breakdownBy }
          }),
        });
        if (response.ok) {
          const json = await response.json();
          const results = json.result || [];
          
          // Transform TrendsQuery result with breakdown
          const allLabels = results[0]?.labels || [];
          const transformed = allLabels.map((label: string, i: number) => {
            const point: unknown = { date: label };
            results.forEach((series: unknown) => {
              (point as Record<string, unknown>)[(series as { breakdown_value: string }).breakdown_value || "Total"] = (series as { data: number[] }).data[i];
            });
            return point;
          });
          
          setData(transformed);
          setCategories(results.map((s: unknown) => (s as { breakdown_value: string }).breakdown_value || "Total"));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [timeRange, breakdownBy]);

  if (loading || !hasMounted) return <div className="h-[320px] flex items-center justify-center animate-pulse bg-muted/10 rounded-3xl">Loading {title}...</div>;

  return (
    <div className="h-[320px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid {...chartTheme.grid} vertical={false} />
          <XAxis dataKey="date" {...chartTheme.axis} minTickGap={30} />
          <YAxis {...chartTheme.axis} />
          <Tooltip contentStyle={chartTheme.tooltip.contentStyle} />
          <Legend />
          {categories.map((cat, i) => (
            <Bar 
              key={cat} 
              dataKey={cat} 
              fill={getColorCode(ANALYTICS_COLORS[i % ANALYTICS_COLORS.length])}
              stackId="a"
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
