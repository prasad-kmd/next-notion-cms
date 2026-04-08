import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Snippets",
  description: "A collection of reusable code snippets, command-line tricks, and engineering shortcuts.",
  openGraph: {
    title: "Snippets",
    description: "A collection of reusable code snippets, command-line tricks, and engineering shortcuts.",
    url: "/snippets",
  },
}

export default function SnippetsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
