"use client"

import Image from "next/image"
import Link from "next/link"
import { ShieldCheck, ArrowLeft, Shield, UserX, Laptop, Palette, Bookmark, Ban, ChevronDown, Check, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { siteConfig } from "@/lib/config";
import { AIContentIndicator } from "@/components/ai-content-indicator";

const cookieData = {
  theme: {
    title: "Theme Preference",
    key: "theme_mode",
    type: "Local Storage",
    purpose: "Remembers if you prefer Dark Mode or Light Mode so you don't have to switch it every time you visit.",
    privacy: "Safe. Stored only on your device. Not accessible by server.",
    icon: Palette,
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  bookmarks: {
    title: "User Bookmarks",
    key: "user_bookmarks",
    type: "Local Storage",
    purpose: 'Stores the IDs of blog posts you have marked as "Saved" to create a personal reading list.',
    privacy: "Safe. The list exists only in your browser cache.",
    icon: Bookmark,
    color: "text-emerald-500",
    bgColor: "bg-emerald-500/10",
  },
}

type CookieKey = keyof typeof cookieData

export default function PrivacyPolicyPage() {
  const [selectedCookie, setSelectedCookie] = useState<CookieKey | null>(null)
  const [expandedCompliance, setExpandedCompliance] = useState<string | null>(null)

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative border-b border-border h-[40vh] min-h-[300px]">
        <Image src="/img/page/workflow.webp" alt="Privacy Policy" fill className="object-cover" priority />
        <div className="absolute inset-0 bg-black/60" />
        <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
          <div className="max-w-3xl text-white">
            <h1 className="text-4xl font-bold tracking-tight lg:text-5xl amoriaregular">Privacy Policy</h1>
            <p className="mt-4 text-lg text-gray-200">
              How we collect, use, and protect your personal information.
            </p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-6 py-12 lg:px-8">
        <Link 
          href="/pages" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Directory
        </Link>

        {/* Dashboard Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-border pb-8 mb-12 gap-4">
          <div>
            <h2 className="text-3xl font-bold philosopher mb-2">Transparency Dashboard</h2>
            <p className="text-muted-foreground italic">Last updated: {new Date().toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-500 rounded-full text-sm font-medium border border-emerald-500/20">
            <ShieldCheck className="h-4 w-4" />
            Privacy Certified Architecture
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <Shield className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Trackers Found</h3>
            <p className="text-4xl font-bold text-foreground">0</p>
            <p className="text-xs text-muted-foreground mt-2">No 3rd party analytics or pixels.</p>
          </div>

          <div className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <UserX className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Data Collected</h3>
            <p className="text-4xl font-bold text-foreground">NONE</p>
            <p className="text-xs text-muted-foreground mt-2">We don&apos;t store your identity.</p>
          </div>

          <div className="group p-6 rounded-2xl border border-border bg-card hover:border-primary/50 transition-all hover:shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-4 group-hover:scale-110 transition-transform">
              <Laptop className="h-6 w-6" />
            </div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-1">Data Residence</h3>
            <p className="text-4xl font-bold text-foreground">LOCAL</p>
            <p className="text-xs text-muted-foreground mt-2">100% stored on your device.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start mb-20">
          <div>
            <h3 className="text-2xl font-bold philosopher mb-6 text-foreground">Where does your data go?</h3>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">
              Most websites silently beam your data to external servers and advertising networks. We took a different path. We utilize <strong className="text-foreground">client-side storage</strong> to keep your preferences under your control.
            </p>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                  <Check className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1 google-sans">100% Client-Side</h4>
                  <p className="text-muted-foreground text-sm">Theme modes and bookmarks are saved in your browser, not our database.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 rounded-full bg-rose-500/10 flex items-center justify-center text-rose-500">
                  <X className="h-4 w-4" />
                </div>
                <div>
                  <h4 className="font-bold text-foreground mb-1 google-sans">0% External Sharing</h4>
                  <p className="text-muted-foreground text-sm">No connections to Google Analytics, Meta Pixels, or obscure ad trackers.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative p-8 rounded-3xl border border-border bg-muted/30 flex flex-col items-center">
            {/* Simple Visual Representation of Storage */}
            <div className="relative w-48 h-48 mb-8">
              <div className="absolute inset-0 rounded-full border-[12px] border-emerald-500/10"></div>
              <div className="absolute inset-0 rounded-full border-[12px] border-emerald-500 -rotate-45"></div>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-bold text-emerald-500">100%</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Local</p>
              </div>
            </div>
            <div className="grid grid-cols-2 w-full gap-4 text-center">
              <div className="p-3 rounded-xl bg-card border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">Server Storage</p>
                <p className="text-lg font-bold">0%</p>
              </div>
              <div className="p-3 rounded-xl bg-card border border-border">
                <p className="text-[10px] font-bold text-muted-foreground uppercase opacity-70">3rd Party Tracking</p>
                <p className="text-lg font-bold">0%</p>
              </div>
            </div>
          </div>
        </div>

        {/* Storage Inspector */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold philosopher mb-2">Storage Inspector</h3>
            <p className="text-muted-foreground capitalize">click to inspect the functional data we keep on your machine</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 space-y-3">
              {(Object.keys(cookieData) as CookieKey[]).map((key) => {
                const item = cookieData[key];
                const Icon = item.icon;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedCookie(key)}
                    className={cn(
                      "w-full text-left p-4 rounded-xl border transition-all flex items-center justify-between group",
                      selectedCookie === key 
                        ? "bg-muted border-primary shadow-sm" 
                        : "bg-card border-border hover:border-primary/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn("p-2 rounded-lg", item.bgColor, item.color)}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">{item.title}</p>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Functional</p>
                      </div>
                    </div>
                  </button>
                )
              })}
              <button disabled className="w-full text-left p-4 rounded-xl border border-border bg-card opacity-50 flex items-center justify-between group cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                    <Ban className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="font-bold text-sm text-muted-foreground">Ad Identifiers</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-tight">Not Present</p>
                  </div>
                </div>
              </button>
            </div>

            <div className="md:col-span-2 min-h-[300px] flex flex-col items-center justify-center p-8 rounded-2xl border-2 border-dashed border-border bg-muted/30">
              {selectedCookie ? (
                <div className="w-full animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={cn("p-4 rounded-2xl", cookieData[selectedCookie].bgColor, cookieData[selectedCookie].color)}>
                      {(() => {
                        const SelectedIcon = cookieData[selectedCookie].icon;
                        return <SelectedIcon className="h-8 w-8" />;
                      })()}
                    </div>
                    <div>
                      <h4 className="text-2xl font-bold philosopher">{cookieData[selectedCookie].title}</h4>
                      <p className="text-emerald-500 text-sm font-medium flex items-center gap-1.5">
                        <Check className="h-4 w-4" />
                        Privacy Verified Session Data
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Storage Key</p>
                      <p className="text-xs font-mono bg-muted p-1 border rounded w-fit">{cookieData[selectedCookie].key}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-card border border-border">
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">Technology Type</p>
                      <p className="text-sm font-medium text-foreground">{cookieData[selectedCookie].type}</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <section>
                      <h5 className="text-sm font-bold text-foreground mb-2 google-sans">Purpose of Collection</h5>
                      <p className="text-muted-foreground text-sm leading-relaxed">{cookieData[selectedCookie].purpose}</p>
                    </section>
                    <section>
                      <h5 className="text-sm font-bold text-foreground mb-2 google-sans">User Impact</h5>
                      <p className="text-muted-foreground text-sm leading-relaxed">{cookieData[selectedCookie].privacy}</p>
                    </section>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mx-auto mb-4">
                    <Laptop className="h-8 w-8" />
                  </div>
                  <p className="text-muted-foreground max-w-xs mx-auto">Select a storage item on the left to inspect its technical details and privacy impact.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compliance */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h3 className="text-2xl font-bold philosopher mb-2">Legal Compliance</h3>
            <p className="text-muted-foreground">Our architectures are designed to respect both local and international laws.</p>
          </div>

          <div className="space-y-4">
            {[
              { id: "pdpa", title: "Sri Lanka PDPA Compliance", body: "We operate in accordance with the Personal Data Protection Act (PDPA) No. 9 of 2022. By not collecting personal identification, we exceed the Act's requirements for data minimization and privacy by design." },
              { id: "gdpr", title: "International Standards (GDPR)", body: "While we are a Sri Lankan entity, we follow global best practices. Our 'Zero-Tracking' stance means we don't process data belonging to EU citizens, ensuring a boundary-less respect for privacy." },
              { id: "withdrawal", title: "Right to Withdraw Consent", body: "Because all data lives in your browser, your right to delete is absolute. Clearing your browser's local storage or cache instantly and permanently removes all data associated with this site." }
            ].map((item) => (
              <div key={item.id} className="rounded-2xl border border-border overflow-hidden">
                <button
                  onClick={() => setExpandedCompliance(expandedCompliance === item.id ? null : item.id)}
                  className="w-full flex items-center justify-between p-6 text-left bg-card hover:bg-muted/50 transition-colors"
                >
                  <span className="font-bold text-foreground google-sans">{item.title}</span>
                  <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform duration-300", expandedCompliance === item.id && "rotate-180")} />
                </button>
                <div 
                  className={cn(
                    "grid transition-all duration-300 ease-in-out",
                    expandedCompliance === item.id ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="p-6 pt-0 text-muted-foreground text-sm leading-relaxed border-t border-border">
                      {item.body}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <AIContentIndicator />
      </div>
    </div>
  )
}
