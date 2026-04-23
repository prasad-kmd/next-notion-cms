import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { Container } from "@/components/container";
import { TechnicalBackground } from "@/components/technical-background";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { AnalyticsNotConfigured } from "@/components/analytics/AnalyticsNotConfigured";
import { AnalyticsDashboardManager } from "@/components/analytics/AnalyticsDashboardManager";

const getSession = cache(async () => {
  return await auth.api.getSession({
    headers: await headers(),
  });
});

export default async function AnalyticsPage() {
  const session = await getSession();

  if (!session) {
    redirect("/sign-in");
  }

  if (session.user.role !== "admin") {
    redirect("/dashboard");
  }

  const isConfigured = !!(
    process.env.NEXT_PUBLIC_POSTHOG_KEY &&
    process.env.POSTHOG_PERSONAL_API_KEY &&
    process.env.POSTHOG_PROJECT_ID
  );

  return (
    <div className="relative min-h-screen">
      <TechnicalBackground />

      <Container className="pt-12 pb-20 relative z-10">
        <div className="max-w-6xl mx-auto space-y-8">
          <Breadcrumbs
            items={[
              { label: "Dashboard", href: "/dashboard" },
              {
                label: "Analytics",
                href: "/dashboard/analytics",
                active: true,
              },
            ]}
            className="mb-4 font-local-inter"
          />

          <header className="space-y-3">
            <h1 className="text-4xl font-bold google-sans tracking-tight">
              System Analytics
            </h1>
            <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-local-inter">
              Real-time insights into user engagement and platform performance.
            </p>
          </header>

          {!isConfigured ? (
            <AnalyticsNotConfigured />
          ) : (
            <AnalyticsDashboardManager />
          )}
        </div>
      </Container>

      <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
    </div>
  );
}
