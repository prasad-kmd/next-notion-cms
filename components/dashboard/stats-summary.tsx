import { Card, CardContent } from "@/components/ui/card";
import { Bookmark, Palette, Zap } from "lucide-react";

interface StatsSummaryProps {
    preferences: {
        bookmarks?: any[];
        accentColor?: string;
    } | null;
}

export function StatsSummary({ preferences }: StatsSummaryProps) {
    const bookmarkCount = preferences?.bookmarks?.length || 0;
    const accentColor = preferences?.accentColor || "Default";

    const stats = [
        {
            label: "Bookmarks",
            value: bookmarkCount,
            icon: Bookmark,
            color: "text-blue-500",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20",
        },
        {
            label: "Accent",
            value: accentColor.charAt(0).toUpperCase() + accentColor.slice(1),
            icon: Palette,
            color: "text-primary",
            bg: "bg-primary/10",
            border: "border-primary/20",
        },
        {
            label: "Status",
            value: "Pro",
            icon: Zap,
            color: "text-amber-500",
            bg: "bg-amber-500/10",
            border: "border-amber-500/20",
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stats.map((stat, idx) => (
                <Card key={idx} className={`group relative border-border/40 bg-card/10 backdrop-blur-md overflow-hidden transition-all duration-300 hover:bg-card/20 shadow-none border`}>
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between gap-4">
                            <div className="space-y-1">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-bold opacity-60">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-bold google-sans tracking-tight text-foreground">{stat.value}</p>
                            </div>
                            <div className={`p-3 rounded-2xl ${stat.bg} ${stat.border} border transition-all duration-300 shadow-sm`}>
                                <stat.icon className={`w-5 h-5 ${stat.color}`} />
                            </div>
                        </div>
                    </CardContent>
                    {/* Subtle bottom accent line */}
                    <div className={`absolute bottom-0 left-0 h-[2px] w-0 bg-primary/30 transition-all duration-500 group-hover:w-full`} />
                </Card>
            ))}
        </div>
    );
}
