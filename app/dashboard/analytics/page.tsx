import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { Container } from "@/components/container";
import { TechnicalBackground } from "@/components/technical-background";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { PageviewsChart } from "@/components/analytics/PageviewsChart";
import { StatCard } from "@/components/analytics/StatCard";
import { AnalyticsNotConfigured } from "@/components/analytics/AnalyticsNotConfigured";
import { 
  Users, 
  MousePointer2, 
  BarChart as BarChartIcon,
  Activity
} from "lucide-react";

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

    let totalPageviews = "--";
    let activeUsers = "--";
    
    if (isConfigured) {
        try {
            const POSTHOG_PERSONAL_API_KEY = process.env.POSTHOG_PERSONAL_API_KEY;
            const POSTHOG_PROJECT_ID = process.env.POSTHOG_PROJECT_ID;
            const POSTHOG_API_HOST = process.env.POSTHOG_API_HOST || "https://us.posthog.com";

            const trendRes = await fetch(
                `${POSTHOG_API_HOST}/api/projects/${POSTHOG_PROJECT_ID}/insights/trend/?events=[{"id":"$pageview","name":"$pageview","type":"events"}]&date_from=-30d`,
                {
                    headers: { Authorization: `Bearer ${POSTHOG_PERSONAL_API_KEY}` },
                    next: { revalidate: 300 }
                }
            );
            
            if (trendRes.ok) {
                const trendData = await trendRes.json();
                totalPageviews = trendData?.result?.[0]?.count?.toLocaleString() || "--";
            }

            const dauRes = await fetch(
                `${POSTHOG_API_HOST}/api/projects/${POSTHOG_PROJECT_ID}/insights/trend/?events=[{"id":"$pageview","name":"$pageview","type":"events","math":"dau"}]&date_from=-30d`,
                {
                    headers: { Authorization: `Bearer ${POSTHOG_PERSONAL_API_KEY}` },
                    next: { revalidate: 300 }
                }
            );

            if (dauRes.ok) {
                const dauData = await dauRes.json();
                const series = dauData?.result?.[0]?.data;
                activeUsers = series?.[series.length - 1]?.toString() || "--";
            }
        } catch (e) {
            console.error("Failed to fetch dashboard stats:", e);
        }
    }

    return (
        <div className="relative min-h-screen">
            <TechnicalBackground />
            
            <Container className="pt-12 pb-20 relative z-10">
                <div className="max-w-6xl mx-auto space-y-8">
                    <Breadcrumbs 
                        items={[
                            { label: "Dashboard", href: "/dashboard" },
                            { label: "Analytics", href: "/dashboard/analytics", active: true }
                        ]} 
                        className="mb-4 font-local-inter"
                    />
                    
                    <header className="space-y-3">
                        <h1 className="text-4xl font-bold google-sans tracking-tight">System Analytics</h1>
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base font-local-inter">
                            Real-time insights into user engagement and platform performance.
                        </p>
                    </header>

                    {!isConfigured ? (
                        <AnalyticsNotConfigured />
                    ) : (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard 
                                    title="Total Pageviews" 
                                    value={totalPageviews} 
                                    icon={<BarChartIcon className="w-4 h-4" />}
                                    description="Last 30 days"
                                />
                                <StatCard 
                                    title="Active Users" 
                                    value={activeUsers} 
                                    icon={<Users className="w-4 h-4" />}
                                    description="Daily active users (today)"
                                />
                                <StatCard 
                                    title="Engagement" 
                                    value="--" 
                                    icon={<Activity className="w-4 h-4" />}
                                    description="Events per user"
                                />
                                <StatCard 
                                    title="Conversion" 
                                    value="--" 
                                    icon={<MousePointer2 className="w-4 h-4" />}
                                    description="Sign-up rate"
                                />
                            </div>

                            <div className="p-8 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md">
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h3 className="text-lg font-bold google-sans">Traffic Trend</h3>
                                        <p className="text-xs text-muted-foreground">Pageviews over the last 30 days</p>
                                    </div>
                                </div>
                                <div className="h-[350px]">
                                    <PageviewsChart />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </Container>

            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        </div>
    );
}
