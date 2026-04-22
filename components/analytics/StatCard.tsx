import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  description?: string;
  loading?: boolean;
}

export function StatCard({ title, value, icon, description, loading }: StatCardProps) {
  if (loading) {
    return (
      <div className="p-6 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md space-y-4 animate-pulse">
        <div className="h-4 w-24 bg-muted rounded"></div>
        <div className="h-8 w-16 bg-muted rounded"></div>
      </div>
    );
  }

  return (
    <div className="p-6 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md space-y-3 transition-all hover:border-primary/30">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold google-sans uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </h3>
        <div className="p-2 rounded-xl bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      <div>
        <div className="text-3xl font-bold google-sans tracking-tight">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}
