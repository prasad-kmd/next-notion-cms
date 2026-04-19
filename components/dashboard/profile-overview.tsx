import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ProfileOverviewProps {
    user: {
        name: string;
        email: string;
        image?: string | null;
    };
}

export function ProfileOverview({ user }: ProfileOverviewProps) {
    return (
        <Card className="border-border/40 bg-card/10 backdrop-blur-md transition-all duration-300 hover:bg-card/20 border shadow-none">
            <div className="p-6 md:p-8">
                <div className="flex flex-col md:flex-row items-start gap-6 text-left">
                    <div className="relative group shrink-0">
                        <div className="absolute -inset-0.5 bg-primary/20 rounded-full blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                        <div className="relative w-20 h-20 rounded-full border border-border/40 bg-background p-1 shadow-sm overflow-hidden">
                            <img 
                                src={user.image || `https://avatar.vercel.sh/${user.email}`} 
                                alt={user.name}
                                className="w-full h-full rounded-full object-cover grayscale-[0.05] hover:grayscale-0 transition-all duration-300"
                            />
                        </div>
                    </div>
                    
                    <div className="flex-1 space-y-4">
                        <div className="space-y-1">
                            <h2 className="text-2xl font-bold google-sans tracking-tight text-foreground">{user.name}</h2>
                            <p className="text-sm text-muted-foreground font-medium">{user.email}</p>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-start gap-3">
                            <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20 px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold">
                                Active Account
                            </Badge>
                            <span className="flex items-center gap-1.5 bg-emerald-500/5 border border-emerald-500/10 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-widest">
                                <span className="h-1 w-1 rounded-full bg-emerald-500 animate-pulse" />
                                Verified
                            </span>
                            <span className="flex items-center gap-1.5 bg-muted/20 border border-border/40 px-2.5 py-0.5 rounded-full text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                <span className="h-1 w-1 rounded-full bg-primary/30" />
                                Standard
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    );
}
