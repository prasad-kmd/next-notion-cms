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
  Cell,
} from "recharts";
import { ANALYTICS_COLORS, getRechartsTheme } from "@/lib/recharts-theme";
import { useTheme } from "next-themes";
import { getColorCode } from "../ui/charts/ChartUtils";

interface TrafficSourcesChartProps {
  timeRange: string;
}

export function TrafficSourcesChart({ timeRange }: TrafficSourcesChartProps) {
  const [data, setData] = useState<Record<string, unknown>[]>([]);
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
            insightType: "traffic_sources",
            params: { timeRange },
          }),
        });
        if (response.ok) {
          const json = await response.json();
          setData(json.result);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [timeRange]);

  if (loading || !hasMounted)
    return (
      <div className="h-[320px] flex items-center justify-center animate-pulse bg-muted/10 rounded-3xl">
        Loading sources...
      </div>
    );

  return (
    <div className="h-[320px] w-full relative">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid {...chartTheme.grid} vertical={false} />
          <XAxis type="number" hide />
          <YAxis
            dataKey="label"
            type="category"
            {...chartTheme.axis}
            width={100}
          />
          <Tooltip
            contentStyle={chartTheme.tooltip.contentStyle}
            cursor={{ fill: "rgba(255,255,255,0.05)" }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={getColorCode(
                  ANALYTICS_COLORS[index % ANALYTICS_COLORS.length],
                )}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
