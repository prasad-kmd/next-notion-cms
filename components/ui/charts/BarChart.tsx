"use client";

import React from "react";
import {
  Bar,
  BarChart as RechartsBarChart,
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

interface BarChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Record<string, unknown>[];
  categories: string[];
  index: string;
  colors?: AvailableChartColorsKeys[];
  valueFormatter?: (value: number) => string;
  layout?: "vertical" | "horizontal";
  showXAxis?: boolean;
  showYAxis?: boolean;
  showGridLines?: boolean;
  showTooltip?: boolean;
}

export const BarChart = ({
  data,
  categories,
  index,
  colors = ["blue"],
  valueFormatter = (value: number) => value.toString(),
  layout = "horizontal",
  showXAxis = true,
  showYAxis = true,
  showGridLines = true,
  showTooltip = true,
  className,
  ...other
}: BarChartProps) => {
  const categoryColors = constructCategoryColors(categories, colors);

  return (
    <div className={cn("h-80 w-full", className)} {...other}>
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={data}
          layout={layout}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          {showGridLines && (
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={layout === "vertical"}
              horizontal={layout === "horizontal"}
              stroke="currentColor"
              className="text-border/40"
            />
          )}
          {layout === "horizontal" ? (
            <>
              <XAxis
                dataKey={index}
                hide={!showXAxis}
                tickLine={false}
                axisLine={false}
                tick={{ fill: "currentColor" }}
                className="text-[10px] font-local-inter text-muted-foreground"
                interval="preserveStartEnd"
                minTickGap={5}
              />
              <YAxis
                hide={!showYAxis}
                tickLine={false}
                axisLine={false}
                tickFormatter={valueFormatter}
                tick={{ fill: "currentColor" }}
                className="text-[10px] font-local-inter text-muted-foreground"
              />
            </>
          ) : (
            <>
              <XAxis
                type="number"
                hide={!showXAxis}
                tickLine={false}
                axisLine={false}
                tickFormatter={valueFormatter}
                tick={{ fill: "currentColor" }}
                className="text-[10px] font-local-inter text-muted-foreground"
              />
              <YAxis
                type="category"
                dataKey={index}
                hide={!showYAxis}
                tickLine={false}
                axisLine={false}
                width={100}
                tick={{ fill: "currentColor" }}
                className="text-[10px] font-local-inter text-muted-foreground"
                tickFormatter={(value) => (value.length > 15 ? `${value.substring(0, 15)}...` : value)}
              />
            </>
          )}
          {showTooltip && (
            <Tooltip
              cursor={{ fill: "currentColor", opacity: 0.1 }}
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-border/50 bg-card/90 backdrop-blur-md p-3 shadow-xl">
                      <p className="text-xs font-medium text-muted-foreground mb-2">
                        {label}
                      </p>
                      {payload.map((entry, index: number) => (
                        <div
                          key={`item-${index}`}
                          className="flex items-center gap-2"
                        >
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: (entry as unknown).color }}
                          />
                          <p className="text-sm font-bold google-sans">
                            {(entry as unknown).name}: {valueFormatter((entry as unknown).value)}
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
            <Bar
              key={category}
              name={category}
              dataKey={category}
              fill={getColorCode(categoryColors.get(category) || "blue")}
              radius={layout === "vertical" ? [0, 4, 4, 0] : [4, 4, 0, 0]}
            />
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
};
