import { BarChart3 } from "lucide-react";
import Link from "next/link";

export function AnalyticsNotConfigured() {
  return (
    <div className="flex flex-col items-center justify-center p-12 rounded-3xl border border-dashed border-border/60 bg-card/5 backdrop-blur-sm text-center space-y-6">
      <div className="p-4 rounded-full bg-primary/10">
        <BarChart3 className="w-10 h-10 text-primary" />
      </div>
      <div className="max-w-md space-y-2">
        <h3 className="text-xl font-bold google-sans">Analytics Not Configured</h3>
        <p className="text-muted-foreground text-sm leading-relaxed">
          PostHog analytics environment variables are missing. Please configure them in your <code className="px-1.5 py-0.5 rounded bg-muted text-xs">.env.local</code> file to enable the admin dashboard.
        </p>
      </div>
      <Link 
        href="https://posthog.com/docs/getting-started"
        target="_blank"
        className="px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold transition-all hover:opacity-90 active:scale-95"
      >
        Learn More
      </Link>
    </div>
  );
}
