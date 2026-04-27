import React from "react";
import { cn } from "@/lib/utils";

interface MetricItemProps {
  label: string;
  value: string | number | null;
  unit?: string;
  className?: string;
}

export const MetricItem: React.FC<MetricItemProps> = ({
  label,
  value,
  unit,
  className,
}) => {
  return (
    <div
      className={cn(
        "p-4 rounded-xl border border-border/40 bg-background/30 flex flex-col gap-1",
        className,
      )}
    >
      <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-mono font-bold text-foreground">
          {value ?? "---"}
        </span>
        {unit && (
          <span className="text-xs text-muted-foreground font-medium">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
};

export const MetricsGrid: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-6">
      {children}
    </div>
  );
};
