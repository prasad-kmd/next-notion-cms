import type { Metadata } from "next"
import GalleryClient from "@/components/gallery-client"

const title = "Project Gallery"
const description = "Visual documentation of my engineering journey, prototypes and field work."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/gallery",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(title)}`,
        width: 1200,
        height: 630,
        alt: description,
      },
    ],
  },
}

const galleryImages = [
  {
    src: "/img/page/ideas.webp",
    alt: "Ideation Process",
    title: "Initial Ideation",
    category: "Planning",
  },
  {
    src: "/img/page/ideas_2.webp",
    alt: "Brainstorming Session",
    title: "Brainstorming",
    category: "Planning",
  },
  {
    src: "/img/page/workflow.webp",
    alt: "Engineering Workflow",
    title: "Design Methodology",
    category: "Workflow",
  },
  {
    src: "/img/page/diary.webp",
    alt: "Project Diary",
    title: "Field Documentation",
    category: "Research",
  },
  {
    src: "/img/page/blackhole.webp",
    alt: "Technical Visualization",
    title: "Simulation & Modeling",
    category: "Technical",
  },
  {
    src: "/img/page/posts.webp",
    alt: "Updates and Announcements",
    title: "Community Outreach",
    category: "Outreach",
  },
]

export default function GalleryPage() {
  return (
    <div className="min-h-screen py-20 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold philosopher lg:text-5xl mb-4">Project Gallery</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Visual highlights from my engineering journey. From early concepts to technical implementations and field work.
          </p>
        </div>

        <GalleryClient images={galleryImages} />
      </div>
    </div>
  )
}
