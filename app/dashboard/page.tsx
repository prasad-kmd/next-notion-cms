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
import { 
    User, 
    Link as LinkIcon, 
    Bookmark, 
    Settings,
    Shield
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

    const { user } = session;

    // Fetch accounts for the user
    const accounts = await getUserAccounts();

    return (
        <Container className="pt-32 pb-20">
            <DashboardFeedback />
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold google-sans mb-2">User Dashboard</h1>
                    <p className="text-muted-foreground">
                        Manage your profile, linked accounts, and view your activity.
                    </p>
                </div>

                <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 md:w-auto md:inline-flex mb-8">
                        <TabsTrigger value="overview" className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>Overview</span>
                        </TabsTrigger>
                        <TabsTrigger value="accounts" className="flex items-center gap-2">
                            <LinkIcon className="w-4 h-4" />
                            <span>Accounts</span>
                        </TabsTrigger>
                        <TabsTrigger value="activity" className="flex items-center gap-2">
                            <Bookmark className="w-4 h-4" />
                            <span>Activity</span>
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="overview" className="space-y-6">
                        <ProfileOverview user={user} />
                        <StatsSummary preferences={user.preferences as any} />
                    </TabsContent>

                    <TabsContent value="accounts">
                        <LinkedAccounts accounts={accounts} />
                    </TabsContent>

                    <TabsContent value="activity">
                        <div className="grid gap-6">
                             <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur">
                                <div className="flex items-center gap-3 mb-4 text-primary">
                                    <Bookmark className="w-5 h-5" />
                                    <h3 className="font-semibold google-sans">Bookmarks</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    You have {(user.preferences as any)?.bookmarks?.length || 0} saved bookmarks. 
                                    Access them anytime from the navigation bar.
                                </p>
                             </div>
                             
                             <div className="p-6 rounded-xl border border-border bg-card/50 backdrop-blur">
                                <div className="flex items-center gap-3 mb-4 text-primary">
                                    <Shield className="w-5 h-5" />
                                    <h3 className="font-semibold google-sans">Security</h3>
                                </div>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Your account is secured via OAuth providers. 
                                    We do not store passwords on our servers.
                                </p>
                             </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </Container>
    );
}
