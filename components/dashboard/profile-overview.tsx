import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileOverviewProps {
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
}

export function ProfileOverview({ user }: ProfileOverviewProps) {
    return (
        <Card className="border-border/50 bg-card/30 backdrop-blur">
            <CardHeader className="flex flex-row items-center gap-4">
                <div className="w-16 h-16 rounded-full border-2 border-primary/20 p-1">
                    <img 
                        src={user.image || `https://avatar.vercel.sh/${user.email}`} 
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                    />
                </div>
                <div>
                    <CardTitle className="text-xl google-sans">{user.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Account Status</p>
                        <p className="font-medium text-emerald-500">Active</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-muted-foreground">Role</p>
                        <p className="font-medium">User</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
