"use client";

import React, { useEffect, useState } from "react";
import { Bell, BellOff, Info } from "lucide-react";
import { toast } from "sonner";

export function NotificationManager() {
  const [permission, setPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = async () => {
    if (!("Notification" in window)) {
      toast.error("Browser does not support notifications");
      return;
    }

    const result = await Notification.requestPermission();
    setPermission(result);
    
    if (result === "granted") {
      toast.success("Notifications enabled!");
      new Notification("Engineering Workspace", {
        body: "You will now receive important updates.",
        icon: "/img/favicon.webp"
      });
    } else {
      toast.error("Notification permission denied");
    }
  };

  return null; // This component could be used to show a permission prompt UI if needed
}

export const sendNotification = (title: string, options?: NotificationOptions) => {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(title, {
      icon: "/img/favicon.webp",
      ...options
    });
  }
};
