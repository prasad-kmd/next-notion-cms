import React from "react";
import { StatusIndicator, StatusType } from "./StatusIndicator";
// import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface Metric {
  label: string;
  value: string | number | null;
}

interface Action {
  label: string;
  onClick: () => void;
  loading?: boolean;
  variant?:
    | "default"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "destructive";
}

interface ServiceCardProps {
  title: string;
  description: string;
  status: StatusType;
  metrics: Metric[];
  actions?: Action[];
  loading?: boolean;
  lastChecked?: string;
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  description,
  status,
  metrics,
  actions = [],
  loading = false,
  lastChecked,
}) => {
  return (
    <div className="relative group overflow-hidden rounded-2xl border border-border/50 bg-card/50 p-6 transition-all hover:border-primary/30 hover:shadow-lg">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-bold tracking-tight text-foreground font-google-sans">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground mt-1 font-local-inter">
            {description}
          </p>
        </div>
        <StatusIndicator status={loading ? "checking" : status} withLabel />
      </div>

      <div className="grid grid-cols-2 gap-4 my-6">
        {metrics.map((metric, index) => (
          <div key={index} className="flex flex-col">
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold font-roboto">
              {metric.label}
            </span>
            <span className="text-lg text-foreground font-local-jetbrains-mono">
              {metric.value ?? "N/A"}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-border/40">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || "outline"}
            size="sm"
            onClick={action.onClick}
            disabled={action.loading}
            className="rounded-xl h-8 text-xs"
          >
            {action.loading && (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            )}
            {action.label}
          </Button>
        ))}
      </div>

      {lastChecked && (
        <div className="mt-4 text-[10px] text-muted-foreground/60 font-space-mono italic">
          Last checked: {new Date(lastChecked).toLocaleTimeString()}
        </div>
      )}

      {loading && (
        <div className="absolute inset-0 bg-background/20 backdrop-blur-[1px] flex items-center justify-center pointer-events-none">
          <div className="h-1 w-full absolute top-0 left-0 bg-primary/20 overflow-hidden">
            <div className="h-full bg-primary w-1/3 animate-progress"></div>
          </div>
        </div>
      )}
    </div>
  );
};
