"use client"

import dynamic from "next/dynamic"

interface MagicBentoClientProps {
  blogCount: number
  articlesCount: number
  projectsCount: number
  tutorialsCount: number
  latestItems: {
    blog?: { title: string; description?: string }
    articles?: { title: string; description?: string }
    projects?: { title: string; description?: string }
    tutorials?: { title: string; description?: string }
  }
}

const MagicBento = dynamic(() => import("@/components/MagicBento"), {
  ssr: false,
  loading: () => <div className="w-full h-[500px] bg-muted/50 rounded-lg animate-pulse" />,
})

export default function MagicBentoClient({
  blogCount,
  articlesCount,
  projectsCount,
  tutorialsCount,
  latestItems,
}: MagicBentoClientProps) {
  return (
    <MagicBento
      blogCount={blogCount}
      articlesCount={articlesCount}
      projectsCount={projectsCount}
      tutorialsCount={tutorialsCount}
      latestItems={latestItems}
    />
  )
}