"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from "recharts";
import { ANALYTICS_COLORS, getRechartsTheme } from "@/lib/recharts-theme";
import { useTheme } from "next-themes";
import { getColorCode } from "../ui/charts/ChartUtils";

interface OutgoingLinksChartProps {
  timeRange: string;
}

export function OutgoingLinksChart({ timeRange }: OutgoingLinksChartProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
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
            insightType: "outgoing_links",
            params: { timeRange, limit: 10 }
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

  if (loading) return <div className="h-64 flex items-center justify-center animate-pulse bg-muted/10 rounded-3xl">Loading outgoing links...</div>;

  return (
    <div className="h-80 w-full">
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
            width={150}
          />
          <Tooltip contentStyle={chartTheme.tooltip.contentStyle} />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColorCode(ANALYTICS_COLORS[index % ANALYTICS_COLORS.length])} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
