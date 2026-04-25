"use client"

import React, { useState, useEffect, useCallback } from "react"
import { 
  Search, 
  ExternalLink, 
  Gamepad2, 
  Filter,
  Loader2,
  ChevronLeft,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { SafeLink } from "@/components/ui/safe-link"

interface Deal {
  internalName: string
  title: string
  metacriticLink: string
  dealID: string
  storeID: string
  gameID: string
  salePrice: string
  normalPrice: string
  isOnSale: string
  savings: string
  metacriticScore: string
  steamRatingText: string
  steamRatingPercent: string
  steamRatingCount: string
  steamAppID: string
  releaseDate: number
  lastChange: number
  dealRating: string
  thumb: string
}

interface Store {
  storeID: string
  storeName: string
  isActive: number
  images: {
    banner: string
    logo: string
    icon: string
  }
}

export default function GameDealsPage() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [selectedStore, setSelectedStore] = useState<string>("1")
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchStores = async () => {
      try {
        const response = await fetch("/api/game-deals?endpoint=stores")
        if (!response.ok) throw new Error("Failed to fetch stores")
        const data = await response.json()
        setStores(data.filter((s: Store) => s.isActive === 1))
      } catch (err) {
        console.error("Error fetching stores:", err)
      }
    }
    fetchStores()
  }, [])

  const fetchDeals = useCallback(async (currentSearch: string, currentStore: string) => {
    setLoading(true)
    setError(null)
    try {
      const params = new URLSearchParams({
        endpoint: "deals",
        storeID: currentStore,
        pageSize: "40",
        sortBy: "Price",
        onSale: "1",
      })
      if (currentSearch) {
        params.append("title", currentSearch)
      }
      const response = await fetch(`/api/game-deals?${params.toString()}`)
      if (!response.ok) throw new Error("Failed to fetch deals")
      const data = await response.json()
      setDeals(data)
    } catch (err) {
      setError("Error fetching deals. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchDeals(searchTerm, selectedStore)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm, selectedStore, fetchDeals])

  const [imageError, setImageError] = useState<Record<string, boolean>>({});

  return (
    <div className="min-h-screen p-6 lg:p-12 img_grad_pm">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
           <Link href="/tools" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mb-4">
              <ChevronLeft className="w-3 h-3" />
              Back to Tools
          </Link>
          <h1 className="text-4xl font-bold mozilla-headline flex items-center gap-3">
            <Gamepad2 className="h-10 w-10 text-primary" />
            Search Game Deals
          </h1>
          <p className="mt-2 text-muted-foreground google-sans">
            Find the best discounts on games across various digital stores using CheapShark API.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-4">
          <div className="md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground font-local-inter" />
            <Input
              placeholder="Search by game title..."
              className="pl-10 h-11 bg-card/50 backdrop-blur-sm border-border font-local-inter"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <select
              className="flex h-11 w-full rounded-md border border-border bg-card/50 backdrop-blur-sm pl-10 pr-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 appearance-none text-foreground font-local-inter"
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
            >
              {stores.length > 0 ? (
                stores.map((store) => (
                  <option key={store.storeID} value={store.storeID} className="bg-background">
                    {store.storeName}
                  </option>
                ))
              ) : (
                <option value="1">Steam</option>
              )}
            </select>
          </div>
          <Button onClick={() => fetchDeals(searchTerm, selectedStore)} disabled={loading} className="h-11 shadow-lg shadow-primary/20 font-local-inter">
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
            Refresh Deals
          </Button>
        </div>

        {error && (
          <div className="rounded-lg bg-destructive/10 p-4 text-center text-destructive border border-destructive/20 mb-8">
            {error}
          </div>
        )}

        {loading && deals.length === 0 ? (
          <div className="flex h-64 items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {deals.map((deal) => (
              <Card key={deal.dealID} className="group flex flex-col overflow-hidden border-border bg-card/40 backdrop-blur-md transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1">
                <div className="relative aspect-video overflow-hidden bg-muted">
                   <Image 
                    src={imageError[deal.dealID] ? "https://placehold.co/720x480?text=Image+Not+Found" : (deal.thumb || "https://placehold.co/720x480?text=No+Image")} 
                    alt={deal.title}
                    fill
                    loading="eager"
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    onError={() => {
                      setImageError(prev => ({ ...prev, [deal.dealID]: true }));
                    }}
                  />
                  <div className="absolute top-2 right-2 flex flex-col gap-1 items-end">
                    <span className="rounded-full bg-primary px-2 py-1 text-[10px] font-bold text-primary-foreground shadow-lg font-local-jetbrains-mono">
                      -{Math.round(parseFloat(deal.savings))}%
                    </span>
                    {parseFloat(deal.metacriticScore) > 0 && (
                       <span className="rounded-full bg-black/60 backdrop-blur-md px-2 py-1 text-[10px] font-bold text-white border border-white/10 font-google-sans">
                        MC: {deal.metacriticScore}
                       </span>
                    )}
                  </div>
                </div>
                <CardHeader className="p-4 flex-1">
                  <CardTitle className="line-clamp-2 text-base font-bold google-sans group-hover:text-primary transition-colors min-h-12">{deal.title}</CardTitle>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="flex items-end justify-between">
                    <div className="font-local-jetbrains-mono">
                      <p className="text-xs text-muted-foreground line-through decoration-destructive/50">${deal.normalPrice}</p>
                      <p className="text-2xl font-bold text-primary">${deal.salePrice}</p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold font-local-inter">Deal Rating</p>
                       <div className="flex items-center gap-1 justify-end">
                          <span className="text-lg font-local-jetbrains-mono font-bold text-primary">{deal.dealRating}</span>
                       </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="p-0 border-t border-border">
                  <Button 
                    variant="ghost" 
                    className="w-full rounded-none h-12 gap-2 hover:bg-primary hover:text-primary-foreground transition-all group/btn font-bold font-space-mono"
                    asChild
                  >
                    <SafeLink href={`https://www.cheapshark.com/redirect?dealID=${deal.dealID}`}>
                      View Deal
                      <ExternalLink className="h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                    </SafeLink>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {!loading && deals.length === 0 && (
          <div className="flex h-96 flex-col items-center justify-center text-center rounded-2xl border border-dashed border-border bg-card/20 backdrop-blur-sm">
            <div className="rounded-full bg-muted p-6 mb-4">
              <Gamepad2 className="h-12 w-12 text-muted-foreground opacity-20" />
            </div>
            <h3 className="text-xl font-bold google-sans mb-1">No deals found</h3>
            <p className="text-muted-foreground mb-6">We couldn&apos;t find any active deals matching your criteria.</p>
            <Button variant="outline" onClick={() => {setSearchTerm(""); setSelectedStore("1")}}>
              Clear All Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
