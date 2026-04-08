"use client"

import { Bell } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export function PushNotificationManager({ isCollapsed }: { isCollapsed?: boolean }) {
  const [permission, setPermission] = useState<NotificationPermission>("default")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    if ("Notification" in window) {
      setPermission(Notification.permission)
    }
  }, [])

  const requestPermission = async () => {
    if ("Notification" in window) {
      const newPermission = await Notification.requestPermission()
      setPermission(newPermission)
      if (newPermission === "granted") {
        subscribeUserToPush()
      }
    }
  }

  const subscribeUserToPush = async () => {
    try {
      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })
      console.log("User is subscribed:", subscription)
      // Here you would send the subscription to your server
    } catch (error) {
      console.error("Failed to subscribe the user: ", error)
    }
  }

  const getButtonText = () => {
    switch (permission) {
      case "granted":
        return "Notifications On"
      case "denied":
        return "Notifications Off"
      default:
        return "Enable Notifications"
    }
  }

  if (!isClient) {
    return null // Don't render on the server
  }

  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <button
          onClick={requestPermission}
          disabled={permission !== "default"}
          data-testid="notification-button"
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all relative group local-jetbrains-mono",
            permission === "granted"
              ? "cursor-default text-primary"
              : "text-muted-foreground hover:bg-muted hover:text-foreground",
            permission === "denied" ? "cursor-not-allowed opacity-50" : "",
            isCollapsed ? "lg:justify-center lg:px-2 lg:gap-0" : "justify-start"
          )}
        >
          <Bell className="h-5 w-5 shrink-0" />
          <span className={cn(
            "animate-in fade-in slide-in-from-left-2 duration-300",
            isCollapsed ? "lg:hidden" : ""
          )}>
            {getButtonText()}
          </span>
        </button>
      </TooltipTrigger>
      {isCollapsed && (
        <TooltipContent side="right" className="ml-2">
          {getButtonText()}
        </TooltipContent>
      )}
    </Tooltip>
  )
}
