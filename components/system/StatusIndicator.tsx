import React from "react";
import { cn } from "@/lib/utils";

export type StatusType = "operational" | "degraded" | "error" | "checking";

interface StatusIndicatorProps {
  status: StatusType;
  size?: "sm" | "md" | "lg";
  withLabel?: boolean;
  className?: string;
}

export const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = "md",
  withLabel = false,
  className,
}) => {
  const sizeClasses = {
    sm: "w-2 h-2",
    md: "w-3 h-3",
    lg: "w-4 h-4",
  };

  const statusColors = {
    operational: "bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]",
    degraded: "bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]",
    error: "bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]",
    checking: "bg-blue-500 animate-pulse",
  };

  const labels = {
    operational: "Operational",
    degraded: "Degraded",
    error: "Outage",
    checking: "Checking...",
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div
        className={cn(
          "rounded-full transition-colors duration-500",
          sizeClasses[size],
          statusColors[status],
        )}
      />
      {withLabel && (
        <span
          className={cn(
            "text-sm font-medium uppercase tracking-wider",
            status === "operational" && "text-green-500",
            status === "degraded" && "text-yellow-500",
            status === "error" && "text-red-500",
            status === "checking" && "text-blue-500",
          )}
        >
          {labels[status]}
        </span>
      )}
    </div>
  );
};
