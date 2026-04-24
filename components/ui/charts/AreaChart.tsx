"use client";

import React from "react";
import {
  Area,
  AreaChart as RechartsAreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cn } from "@/lib/utils";
import {
  AvailableChartColorsKeys,
  constructCategoryColors,
  getColorCode,
} from "./ChartUtils";

interface AreaChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: unknown[];
  categories: string[];
  index: string;
  colors?: AvailableChartColorsKeys[];
  valueFormatter?: (value: number) => string;
  showXAxis?: boolean;
  showYAxis?: boolean;
  showGridLines?: boolean;
  startEndOnly?: boolean;
  showTooltip?: boolean;
  showLegend?: boolean;
}

export const AreaChart = ({
  data,
  categories,
  index,
  colors = ["blue"],
  valueFormatter = (value: number) => value.toString(),
  showXAxis = true,
  showYAxis = true,
  showGridLines = true,
  startEndOnly = false,
  showTooltip = true,
  showLegend = true,
  className,
  ...other
}: AreaChartProps) => {
  const categoryColors = constructCategoryColors(categories, colors);

  return (
    <div className={cn("h-80 w-full", className)} {...other}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsAreaChart data={data}>
          {showGridLines && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="currentColor"
              className="text-border/40"
            />
          )}
          <XAxis
            hide={!showXAxis}
            dataKey={index}
            tick={{ transform: "translate(0, 6)", fill: "currentColor" }}
            ticks={
              startEndOnly
                ? [(data[0] as Record<string, unknown>)[index], (data[data.length - 1] as Record<string, unknown>)[index]] as string[]
                : undefined
            }
            axisLine={false}
            tickLine={false}
            className="text-[10px] font-local-inter text-muted-foreground"
            interval="preserveStartEnd"
            minTickGap={5}
          />
          <YAxis
            hide={!showYAxis}
            axisLine={false}
            tickLine={false}
            tickFormatter={valueFormatter}
            tick={{ fill: "currentColor" }}
            className="text-[10px] font-local-inter text-muted-foreground"
          />
          {showTooltip && (
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-border/50 bg-card/90 backdrop-blur-md p-3 shadow-xl">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        {label}
                      </p>
                      {payload.map((entry: unknown, index: number) => (
                        <div
                          key={`item-${index}`}
                          className="flex items-center gap-2"
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: (entry as { color: string }).color }}
                          />
                          <p className="text-sm font-bold google-sans">
                            {(entry as { name: string }).name}: {valueFormatter((entry as { value: number }).value)}
                          </p>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
          )}
          {categories.map((category) => (
            <Area
              key={category}
              name={category}
              type="monotone"
              dataKey={category}
              stroke={getColorCode(categoryColors.get(category) || "blue")}
              fill={`url(#${category})`}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          ))}
          <defs>
            {categories.map((category) => (
              <linearGradient
                key={category}
                id={category}
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor={getColorCode(
                    categoryColors.get(category) || "blue"
                  )}
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor={getColorCode(
                    categoryColors.get(category) || "blue"
                  )}
                  stopOpacity={0}
                />
              </linearGradient>
            ))}
          </defs>
        </RechartsAreaChart>
      </ResponsiveContainer>
    </div>
  );
};
