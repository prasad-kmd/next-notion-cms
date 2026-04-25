"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { toast } from "sonner"
import { posthog } from "@/lib/posthog-client"

export interface BookmarkedItem {
    slug: string
    title: string
    date?: string
    type: "blog" | "articles" | "projects" | "tutorials" | "wiki"
}

interface BookmarksContextType {
    bookmarks: BookmarkedItem[]
    isBookmarked: (slug: string, type: string) => boolean
    toggleBookmark: (item: BookmarkedItem) => void
    removeBookmark: (slug: string, type: string) => void
}

const BookmarksContext = createContext<BookmarksContextType | undefined>(undefined)

export function BookmarksProvider({ children }: { children: React.ReactNode }) {
    const [bookmarks, setBookmarks] = useState<BookmarkedItem[]>(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem("user-bookmarks")
            if (saved) {
                try {
                    const parsed = JSON.parse(saved)
                    if (Array.isArray(parsed)) {
                        return parsed
                    }
                } catch (e) {
                    console.error("Failed to parse bookmarks:", e)
                }
            }
        }
        return []
    })
    const [isInitialized, setIsInitialized] = useState(false)

    // Load bookmarks from localStorage on mount and listen for storage changes
    const loadFromLocalStorage = useCallback(() => {
        const saved = localStorage.getItem("user-bookmarks")
        if (saved) {
            try {
                const parsed = JSON.parse(saved)
                if (Array.isArray(parsed)) {
                    setBookmarks(parsed)
                }
            } catch (e) {
                console.error("Failed to parse bookmarks:", e)
            }
        } else {
            setBookmarks([])
        }
    }, [])

    useEffect(() => {
        setIsInitialized(true)

        // Listen for storage events (from other hooks like useAuthSync)
        const handleStorageChange = (e: StorageEvent | Event) => {
            // Check if it's the correct key or a general refresh event
            if (e instanceof StorageEvent) {
                if (e.key === "user-bookmarks") {
                    loadFromLocalStorage()
                }
            } else {
                // Event from window.dispatchEvent(new Event("storage"))
                loadFromLocalStorage()
            }
        }

        window.addEventListener("storage", handleStorageChange)
        return () => window.removeEventListener("storage", handleStorageChange)
    }, [loadFromLocalStorage])

    // Sync back to localStorage
    useEffect(() => {
        if (isInitialized) {
            localStorage.setItem("user-bookmarks", JSON.stringify(bookmarks))
        }
    }, [bookmarks, isInitialized])

    const isBookmarked = useCallback(
        (slug: string, type: string) => {
            if (!slug || !type) return false
            return bookmarks.some((item) => item.slug === slug && item.type === type)
        },
        [bookmarks]
    )

    const toggleBookmark = useCallback(
        (item: BookmarkedItem) => {
            if (!item.slug || !item.type) {
                console.error("Attempted to bookmark item without slug or type:", item)
                return
            }

            let action: "added" | "removed" = "added"
            setBookmarks((prev) => {
                const exists = prev.some((b) => b.slug === item.slug && b.type === item.type)
                if (exists) {
                    action = "removed"
                    return prev.filter((b) => !(b.slug === item.slug && b.type === item.type))
                } else {
                    action = "added"
                    return [...prev, item]
                }
            })

            if (action === "added") {
                toast.success("Added to bookmarks")
                if (posthog) {
                    posthog.capture("bookmark_added", {
                        post_slug: item.slug,
                        post_title: item.title,
                        content_type: item.type,
                    })
                }
            } else {
                toast.success("Removed from bookmarks")
                if (posthog) {
                    posthog.capture("bookmark_removed", {
                        post_slug: item.slug,
                        post_title: item.title,
                        content_type: item.type,
                    })
                }
            }
        },
        []
    )

    const removeBookmark = useCallback((slug: string, type: string) => {
        if (!slug || !type) return
        setBookmarks((prev) => {
            const itemToRemove = prev.find((item) => item.slug === slug && item.type === type)
            if (itemToRemove && posthog) {
                posthog.capture("bookmark_removed", {
                    post_slug: itemToRemove.slug,
                    post_title: itemToRemove.title,
                    content_type: itemToRemove.type,
                })
            }
            return prev.filter((item) => !(item.slug === slug && item.type === type))
        })
        toast.success("Removed from bookmarks")
    }, [])

    return (
        <BookmarksContext.Provider
            value={{ bookmarks, isBookmarked, toggleBookmark, removeBookmark }}
        >
            {children}
        </BookmarksContext.Provider>
    )
}

export function useBookmarks() {
    const context = useContext(BookmarksContext)
    if (context === undefined) {
        throw new Error("useBookmarks must be used within a BookmarksProvider")
    }
    return context
}
