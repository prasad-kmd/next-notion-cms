import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";
import { getContentByType } from "@/lib/content";
import Image from "next/image";

interface RelatedContentProps {
  type: "blog" | "articles" | "projects" | "tutorials" | "wiki";
  currentSlug: string;
}

export function RelatedContent({ type, currentSlug }: RelatedContentProps) {
  const allItems = getContentByType(type);
  const relatedItems = allItems
    .filter((item) => item.slug !== currentSlug)
    .slice(0, 3);

  if (relatedItems.length === 0) {
    return null;
  }

  const titles = {
    blog: "More from the Blog",
    articles: "Related Articles",
    projects: "Other Projects",
    tutorials: "More Tutorials",
    wiki: "More Wiki Entries",
  };

  return (
    <section className="mt-16 border-t border-border pt-16 google-sans">
      <h2 className="mb-8 text-2xl font-bold philosopher">{titles[type]}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {relatedItems.map((item) => (
          <Link
            key={item.slug}
            href={`/${type}/${item.slug}`}
            className="group block rounded-xl border border-border bg-card p-4 transition-all hover:border-primary/50 hover:shadow-lg"
          >
            {item.firstImage && (
              <div className="relative mb-4 aspect-video overflow-hidden rounded-lg">
                <Image
                  src={item.firstImage}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
            )}
            <div className="mb-2 flex items-center gap-2 text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
              <Calendar className="h-3 w-3" />
              {item.date || "Recent"}
            </div>
            <h3 className="mb-2 font-bold group-hover:text-primary transition-colors line-clamp-2">
              {item.title}
            </h3>
            <p className="mb-4 text-xs text-muted-foreground line-clamp-2">
              {item.description}
            </p>
            <div className="flex items-center gap-1 text-xs font-bold text-primary">
              Read More <ArrowRight className="h-3 w-3" />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
