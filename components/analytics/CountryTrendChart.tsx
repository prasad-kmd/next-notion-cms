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
  ResponsiveContainer,
  Legend
} from "recharts";
import { ANALYTICS_COLORS, getRechartsTheme } from "@/lib/recharts-theme";
import { useTheme } from "next-themes";
import { getColorCode } from "../ui/charts/ChartUtils";

interface CountryTrendChartProps {
  timeRange: string;
}

export function CountryTrendChart({ timeRange }: CountryTrendChartProps) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any[]>([]);
  const [countries, setCountries] = useState<string[]>([]);
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
            params: { timeRange, breakdownBy: "$geoip_country_name" }
          }),
        });
        if (response.ok) {
          const json = await response.json();
          const results = json.result || [];
          
          // Get top 5 countries to avoid clutter
          const topSeries = results
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .sort((a: any, b: any) => {
              const sumA = a.data.reduce((acc: number, val: number) => acc + val, 0);
              const sumB = b.data.reduce((acc: number, val: number) => acc + val, 0);
              return sumB - sumA;
            })
            .slice(0, 5);

          const allLabels = topSeries[0]?.labels || [];
          const transformed = allLabels.map((label: string, i: number) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const point: any = { date: label };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
            topSeries.forEach((series: any) => {
              const key = series.breakdown_value === "$$_posthog_breakdown_null_$$" || !series.breakdown_value 
                ? "Unknown" 
                : series.breakdown_value;
              point[key] = series.data[i];
            });
            return point;
          });
          
          setData(transformed);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setCountries(topSeries.map((s: any) => 
            s.breakdown_value === "$$_posthog_breakdown_null_$$" || !s.breakdown_value 
            ? "Unknown" 
            : s.breakdown_value
          ));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [timeRange]);

  if (loading || !hasMounted) return <div className="h-[320px] flex items-center justify-center animate-pulse bg-muted/10 rounded-3xl">Loading country trends...</div>;

  return (
    <div className="h-[320px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid {...chartTheme.grid} vertical={false} />
          <XAxis dataKey="date" {...chartTheme.axis} minTickGap={30} />
          <YAxis {...chartTheme.axis} />
          <Tooltip contentStyle={chartTheme.tooltip.contentStyle} />
          <Legend />
          {countries.map((country, i) => (
            <Area 
              key={country} 
              type="monotone"
              dataKey={country} 
              stroke={getColorCode(ANALYTICS_COLORS[i % ANALYTICS_COLORS.length])}
              fill={getColorCode(ANALYTICS_COLORS[i % ANALYTICS_COLORS.length])}
              fillOpacity={0.3}
              stackId="1"
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
