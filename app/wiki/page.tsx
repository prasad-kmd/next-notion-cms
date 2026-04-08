import type { Metadata } from "next";
import Link from "next/link";
import { getContentByType } from "@/lib/content";
import { Book, ArrowRight, Search, Hash } from "lucide-react";

const title = "Engineering Wiki";
const description =
  "A structured collection of engineering concepts, formulas, and best practices. Your go-to reference for mechatronics and mechanical engineering.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/wiki",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(title)}`,
        width: 1200,
        height: 630,
        alt: description,
      },
    ],
  },
};

export default function WikiPage() {
  const wikiEntries = getContentByType("wiki");

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold mozilla-headline flex items-center gap-3">
            <Book className="h-10 w-10 text-primary" />
            Engineering Wiki
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl font-local-inter">
            A structured, searchable collection of engineering concepts,
            formulas, and best practices. From PCB design rules to motor
            selection, this is a growing knowledge base for engineers.
          </p>
        </div>

        {wikiEntries.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground font-local-inter">
              Knowledge base is being compiled. Check back soon!
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2">
            {wikiEntries.map((entry) => (
              <Link
                key={entry.slug}
                href={`/wiki/${entry.slug}`}
                className="group block rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Hash className="h-4 w-4 text-primary/60" />
                      <span className="text-xs text-muted-foreground uppercase tracking-wider font-local-jetbrains-mono">
                        {entry.technical || "General Engineering"}
                      </span>
                    </div>
                    <h2 className="mb-2 text-2xl font-semibold group-hover:text-primary transition-colors font-google-sans">
                      {entry.title}
                    </h2>
                    {entry.description && (
                      <p className="mb-4 text-sm text-muted-foreground leading-relaxed line-clamp-2 font-local-inter">
                        {entry.description}
                      </p>
                    )}
                    {entry.tags && (
                      <div className="flex flex-wrap gap-2">
                        {entry.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] bg-muted px-2 py-0.5 rounded text-muted-foreground font-local-inter"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
