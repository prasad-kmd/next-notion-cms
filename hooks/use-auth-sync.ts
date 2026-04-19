"use client";

import { useEffect, useRef } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export function useAuthSync() {
  const { data: session } = authClient.useSession();
  const syncInProgress = useRef(false);

  useEffect(() => {
    async function syncData() {
      if (!session?.user || syncInProgress.current) return;

      // Gate sync to at most once per hour to save on database writes and prevent UI spam
      const lastSync = localStorage.getItem("last-prefs-sync");
      const oneHour = 60 * 60 * 1000;
      if (lastSync && Date.now() - parseInt(lastSync) < oneHour) {
        return;
      }

      const localBookmarks = localStorage.getItem("user-bookmarks");
      const localAccentColor = localStorage.getItem("accent-color");

      if (!localBookmarks && !localAccentColor) return;

      syncInProgress.current = true;

      try {
        // Detect if there is data in localStorage that needs syncing
        // For simplicity, we send what we have and let the server handle it
        // In a real app, we'd compare versions or timestamps
        
        const res = await fetch("/api/user/sync", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            bookmarks: localBookmarks ? JSON.parse(localBookmarks) : null,
            accentColor: localAccentColor,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          // Update last sync timestamp
          localStorage.setItem("last-prefs-sync", Date.now().toString());
          
          if (data.synced) {
            toast.success("Preferences synced to your account");
          }
        }
      } catch (error) {
        console.error("Auth sync error:", error);
      } finally {
        syncInProgress.current = false;
      }
    }

    if (session?.user) {
      syncData();
    }
  }, [session?.user]);
}
