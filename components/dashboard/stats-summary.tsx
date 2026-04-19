import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bookmark, Palette, Zap } from "lucide-react";

interface StatsSummaryProps {
    preferences: {
        bookmarks?: any[];
        accentColor?: string;
    } | null;
}

export function StatsSummary({ preferences }: StatsSummaryProps) {
    const bookmarkCount = preferences?.bookmarks?.length || 0;
    const accentColor = preferences?.accentColor || "blue";

    const stats = [
        {
            label: "Bookmarks",
            value: bookmarkCount,
            icon: Bookmark,
            color: "text-blue-500",
        },
        {
            label: "Accent Color",
            value: accentColor.charAt(0).toUpperCase() + accentColor.slice(1),
            icon: Palette,
            color: "text-purple-500",
        },
        {
            label: "Experience",
            value: "Pro",
            icon: Zap,
            color: "text-amber-500",
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {stats.map((stat) => (
                <Card key={stat.label} className="border-border/50 bg-card/30 backdrop-blur">
                    <CardContent className="pt-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                                    {stat.label}
                                </p>
                                <p className="text-2xl font-bold mt-1 google-sans">{stat.value}</p>
                            </div>
                            <stat.icon className={`w-8 h-8 ${stat.color} opacity-80`} />
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
