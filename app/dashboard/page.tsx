import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { ProfileOverview } from "@/components/dashboard/profile-overview";
import { LinkedAccounts } from "@/components/dashboard/linked-accounts";
import { StatsSummary } from "@/components/dashboard/stats-summary";
import { DashboardFeedback } from "@/components/dashboard/dashboard-feedback";
import { Container } from "@/components/container";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TechnicalBackground } from "@/components/technical-background";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { ActivityTab } from "@/components/dashboard/activity-tab";
import { db } from "@/lib/db";
import { user } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { 
    Link as LinkIcon, 
    Bookmark, 
    Shield,
    LayoutDashboard
} from "lucide-react";

const getSession = cache(async () => {
    return await auth.api.getSession({
        headers: await headers(),
    });
});

const getUserAccounts = cache(async () => {
    return await auth.api.listUserAccounts({
        headers: await headers(),
    });
});

export default async function DashboardPage() {
    const session = await getSession();

    if (!session) {
        redirect("/sign-in");
    }

    const { user: sessionUser } = session;

    // Fetch fresh user data from DB to ensure preferences are up to date
    const dbUser = await db.query.user.findFirst({
        where: eq(user.id, sessionUser.id)
    });

    const displayUser = dbUser || sessionUser;

    // Fetch accounts for the user
    const accounts = await getUserAccounts();

    return (
        <div className="relative min-h-screen">
            <TechnicalBackground />
            
            <Container className="pt-32 pb-20 relative z-10">
                <div className="max-w-4xl mx-auto space-y-12">
                    <Breadcrumbs 
                        items={[
                            { label: "Dashboard", href: "/dashboard", active: true }
                        ]} 
                        className="mb-8"
                    />
                    
                    <DashboardFeedback />
                    
                    {/* Simplified Header */}
                    <header className="space-y-3">
                        <h1 className="text-4xl font-bold google-sans tracking-tight">User Dashboard</h1>
                        <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                            Manage your profile, linked accounts, and view your activity.
                        </p>
                    </header>

                    <Tabs defaultValue="overview" className="w-full space-y-8">
                        <TabsList className="w-full bg-muted/5 backdrop-blur-md p-1.5 rounded-2xl border border-border/40 h-auto gap-1">
                            <TabsTrigger 
                                value="overview" 
                                className="flex-1 rounded-xl px-4 py-3 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm active:scale-[0.98] group"
                            >
                                <div className="flex items-center gap-2.5">
                                    <LayoutDashboard className="w-4 h-4 opacity-50 group-data-[state=active]:opacity-100 transition-opacity" />
                                    <span className="tracking-wide">Overview</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger 
                                value="accounts"
                                className="flex-1 rounded-xl px-4 py-3 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm active:scale-[0.98] group"
                            >
                                <div className="flex items-center gap-2.5">
                                    <LinkIcon className="w-4 h-4 opacity-50 group-data-[state=active]:opacity-100 transition-opacity" />
                                    <span className="tracking-wide">Accounts</span>
                                </div>
                            </TabsTrigger>
                            <TabsTrigger 
                                value="activity"
                                className="flex-1 rounded-xl px-4 py-3 text-xs font-bold transition-all data-[state=active]:bg-background data-[state=active]:text-primary data-[state=active]:shadow-sm active:scale-[0.98] group"
                            >
                                <div className="flex items-center gap-2.5">
                                    <Bookmark className="w-4 h-4 opacity-50 group-data-[state=active]:opacity-100 transition-opacity" />
                                    <span className="tracking-wide">Activity</span>
                                </div>
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="overview" className="space-y-10 mt-0 focus-visible:outline-none">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                <div className="lg:col-span-2 space-y-8">
                                    <ProfileOverview user={displayUser as any} />
                                    <StatsSummary preferences={displayUser.preferences as any} />
                                </div>
                                <div className="space-y-6">
                                    <div className="p-6 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md space-y-4 shadow-sm">
                                        <h3 className="text-xs font-bold google-sans uppercase tracking-[0.2em] flex items-center gap-2">
                                            <Shield className="w-4 h-4 text-primary" />
                                            Security Panel
                                        </h3>
                                        <p className="text-xs text-muted-foreground leading-relaxed">
                                            Your account data is encrypted and protected. All connections are verified for session integrity.
                                        </p>
                                        <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-2xl flex items-center gap-3">
                                            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                                            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">Verified</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="accounts" className="mt-0 focus-visible:outline-none">
                            <LinkedAccounts accounts={accounts} />
                        </TabsContent>

                        <TabsContent value="activity" className="mt-0 focus-visible:outline-none">
                            <ActivityTab bookmarkCount={(displayUser.preferences as any)?.bookmarks?.length || 0} />
                        </TabsContent>
                    </Tabs>
                </div>
            </Container>

            {/* Background Decorations */}
            <div className="fixed bottom-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
            <div className="fixed top-0 left-0 w-[500px] h-[500px] bg-secondary/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
        </div>
    );
}
