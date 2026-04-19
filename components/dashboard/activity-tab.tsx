"use client";

import { useState } from "react";
import { Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookmarksModal } from "@/components/bookmarks-modal";

interface ActivityTabProps {
    bookmarkCount: number;
}

export function ActivityTab({ bookmarkCount }: ActivityTabProps) {
    const [isBookmarksOpen, setIsBookmarksOpen] = useState(false);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="group p-6 rounded-3xl border border-border/40 bg-card/10 backdrop-blur-md transition-all duration-300 hover:bg-card/20 flex flex-col justify-between">
                <div className="space-y-4">
                    <div className="flex items-center gap-3 text-primary/90">
                        <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 transition-transform group-hover:scale-105">
                            <Bookmark className="w-5 h-5" />
                        </div>
                        <h3 className="font-bold google-sans tracking-tight">Bookmarks</h3>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        You have {bookmarkCount} active bookmarks. Manage your collection and sync across devices instantly.
                    </p>
                </div>
                
                <div className="mt-8">
                    <Button 
                        onClick={() => setIsBookmarksOpen(true)}
                        variant="outline" 
                        className="w-full rounded-2xl border-primary/20 hover:bg-primary/5 hover:text-primary transition-all font-bold text-[10px] uppercase tracking-[0.2em] h-11"
                    >
                        Manage Collection
                    </Button>
                </div>

                <BookmarksModal 
                    isOpen={isBookmarksOpen}
                    onClose={() => setIsBookmarksOpen(false)}
                />
            </div>
        </div>
    );
}
