import { AvailableChartColorsKeys } from "@/components/ui/charts/ChartUtils";

export const ANALYTICS_COLORS: AvailableChartColorsKeys[] = [
  "blue",
  "violet",
  "emerald",
  "amber",
  "cyan",
  "pink",
  "rose",
  "gray",
];

export const getRechartsTheme = (theme: string | undefined) => {
  const isDark = theme === "dark";

  return {
    grid: {
      stroke: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      strokeDasharray: "3 3",
    },
    axis: {
      stroke: isDark ? "rgba(255, 255, 255, 0.3)" : "rgba(0, 0, 0, 0.3)",
      fontSize: 10,
      fontFamily: "var(--font-local-inter)",
    },
    tooltip: {
      contentStyle: {
        backgroundColor: isDark
          ? "rgba(17, 17, 17, 0.9)"
          : "rgba(255, 255, 255, 0.9)",
        borderColor: isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
        borderRadius: "12px",
        backdropFilter: "blur(8px)",
        boxShadow:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        color: isDark ? "#fff" : "#000",
      },
    },
    area: {
      fillOpacity: 0.3,
      strokeWidth: 2,
    },
  };
};

export const formatCompactNumber = (number: number) => {
  if (number < 1000) return number.toString();
  if (number < 1000000) return (number / 1000).toFixed(1) + "k";
  return (number / 1000000).toFixed(1) + "M";
};
