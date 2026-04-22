"use client";

import { useEffect, useState } from "react";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend 
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTheme } from "next-themes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface TopContentChartProps {
  timeRange: string;
  contentType?: string;
}

export function TopContentChart({ timeRange, contentType }: TopContentChartProps) {
  const { theme } = useTheme();
  const [data, setData] = useState<any[]>([]);
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
      <Card className="col-span-1 border-border/50 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-lg font-google-sans">Top Content (Views)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full flex items-center justify-center bg-card/5 rounded-2xl border border-border/40 animate-pulse">
            Loading Chart...
          </div>
        </CardContent>
      </Card>
    );
  }

  const isDark = theme === "dark";

  const chartData = {
    labels: data.map(item => item.title || item.slug),
    datasets: [
      {
        label: "Views",
        data: data.map(item => item.views),
        backgroundColor: isDark ? "rgba(59, 130, 246, 0.6)" : "rgba(37, 99, 235, 0.6)",
        borderColor: isDark ? "#3b82f6" : "#2563eb",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    indexAxis: 'y' as const,
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? "rgba(15, 15, 15, 0.9)" : "rgba(255, 255, 255, 0.9)",
        titleColor: isDark ? "#fff" : "#000",
        bodyColor: isDark ? "#fff" : "#000",
        borderColor: "rgba(120, 120, 120, 0.2)",
        borderWidth: 1,
        padding: 10,
        cornerRadius: 8,
      },
    },
    scales: {
      x: {
        grid: {
          color: isDark ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          color: isDark ? "rgba(255, 255, 255, 0.5)" : "rgba(0, 0, 0, 0.5)",
        }
      },
      y: {
        grid: {
          display: false,
        },
        ticks: {
          color: isDark ? "rgba(255, 255, 255, 0.7)" : "rgba(0, 0, 0, 0.7)",
          font: {
            size: 11,
          },
          callback: function(value: any, index: number) {
            const label = data[index]?.title || data[index]?.slug || "";
            return label.length > 20 ? label.substring(0, 20) + "..." : label;
          }
        }
      },
    },
  };

  return (
    <Card className="col-span-1 border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-lg font-google-sans">Top Content (Views)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <Bar data={chartData} options={options} />
        </div>
      </CardContent>
    </Card>
  );
}
