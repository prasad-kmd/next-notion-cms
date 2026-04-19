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

      const localBookmarks = localStorage.getItem("user-bookmarks");
      const localAccentColor = localStorage.getItem("accent-color");

      // Pull Logic: If localStorage is empty/missing or after a fresh login where we haven't synced yet
      const lastSyncedSnapshot = localStorage.getItem("last-synced-data-snapshot");
      
      if (!lastSyncedSnapshot && session.user) {
        syncInProgress.current = true;
        try {
          const res = await fetch("/api/user/sync");
          if (res.ok) {
            const { preferences } = await res.json();
            if (preferences) {
              let restored = false;
              
              if (preferences.bookmarks && (!localBookmarks || localBookmarks === "[]")) {
                localStorage.setItem("user-bookmarks", JSON.stringify(preferences.bookmarks));
                restored = true;
              }
              
              if (preferences.accentColor && !localAccentColor) {
                localStorage.setItem("accent-color", preferences.accentColor);
                restored = true;
              }

              if (restored) {
                // Update markers and trigger storage event for other hooks/components
                const snapshot = JSON.stringify({ 
                  bookmarks: localStorage.getItem("user-bookmarks"), 
                  accentColor: localStorage.getItem("accent-color") 
                });
                localStorage.setItem("last-synced-data-snapshot", snapshot);
                localStorage.setItem("last-prefs-sync", Date.now().toString());
                
                // Notify other parts of the app
                window.dispatchEvent(new Event("storage"));
                toast.success("Preferences restored from your account");
                return; // Initial pull complete
              }
            }
          }
        } catch (error) {
          console.error("Pull preferences error:", error);
        } finally {
          syncInProgress.current = false;
        }
      }

      // Group data to check for changes (Push logic)
      if (!localBookmarks && !localAccentColor) return;
      
      const currentData = JSON.stringify({ bookmarks: localBookmarks, accentColor: localAccentColor });
      const lastSyncedData = localStorage.getItem("last-synced-data-snapshot");

      // Gate 1: If data is identical to what we last synced successfully, do nothing
      if (currentData === lastSyncedData) {
        return;
      }

      // Gate 2: Enforce a minimum 1-hour cooldown between push attempts
      const lastSync = localStorage.getItem("last-prefs-sync");
      const oneHour = 60 * 60 * 1000;
      if (lastSync && Date.now() - parseInt(lastSync) < oneHour) {
        return;
      }

      syncInProgress.current = true;

      try {
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
          
          // Update last sync markers
          localStorage.setItem("last-prefs-sync", Date.now().toString());
          localStorage.setItem("last-synced-data-snapshot", currentData);
          
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
