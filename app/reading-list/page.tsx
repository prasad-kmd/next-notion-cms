import type { Metadata } from "next";
import {
  BookMarked,
  Star,
  ExternalLink,
  _Bookmark,
  Library,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, _CardContent, _CardHeader, _CardTitle } from "@/components/ui/card";
import { SafeLink } from "@/components/ui/safe-link";

const title = "Engineering Reading List";
const description =
  "Curated books, papers, and articles with personal annotations and ratings.";

export const metadata: Metadata = {
  title,
  description,
};

const readings = [
  {
    title: "Design of Machinery",
    author: "Robert L. Norton",
    type: "Book",
    rating: 5,
    status: "Completed",
    annotation:
      "The bible for kinematics and dynamics of mechanisms. Highly recommended for any mechanical designer.",
    tags: ["Mechanical", "Kinematics"],
    url: "https://www.mheducation.com/highered/product/design-machinery-norton/M9781260113310.html",
  },
  {
    title: "The Art of Electronics",
    author: "Horowitz & Hill",
    type: "Book",
    rating: 5,
    status: "Reading",
    annotation:
      "An absolute classic. It bridges the gap between theory and practical circuit design perfectly.",
    tags: ["Electronics", "Reference"],
    url: "https://artofelectronics.net/",
  },
  {
    title: "Small Is Beautiful",
    author: "E. F. Schumacher",
    type: "Book",
    rating: 4,
    status: "Completed",
    annotation:
      "A thought-provoking look at economics and technology as if people mattered.",
    tags: ["Philosophy", "Technology"],
    url: "https://www.goodreads.com/book/show/1117633.Small_Is_Beautiful",
  },
];

export default function ReadingListPage() {
  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold mozilla-headline flex items-center gap-3">
            <BookMarked className="h-10 w-10 text-primary" />
            Reading List
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            A curated collection of technical books, research papers, and
            insightful articles that have influenced my engineering perspective.
          </p>
        </header>

        <div className="space-y-8">
          {readings.map((book) => (
            <Card
              key={book.title}
              className="overflow-hidden border-border bg-card/40 hover:bg-card/60 transition-all"
            >
              <div className="flex flex-col md:flex-row">
                <div className="p-6 md:w-2/3 border-b md:border-b-0 md:border-r border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="outline"
                      className="rounded-sm font-mono text-[10px] uppercase"
                    >
                      {book.type}
                    </Badge>
                    <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-widest px-2 py-0.5 rounded bg-muted">
                      {book.status}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold google-sans mb-1">
                    {book.title}
                  </h2>
                  <p className="text-muted-foreground mb-4 font-medium italic">
                    by {book.author}
                  </p>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">
                    {book.annotation}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {book.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs text-primary font-bold"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-6 md:w-1/3 bg-muted/20 flex flex-col justify-between items-center text-center">
                  <div className="mb-4">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2">
                      Rating
                    </p>
                    <div className="flex items-center gap-1 justify-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < book.rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`}
                        />
                      ))}
                    </div>
                  </div>
                  <SafeLink href={book.url} className="w-full">
                    <button className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-card border border-border text-sm font-bold hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all">
                      More Info <ExternalLink className="h-3 w-3" />
                    </button>
                  </SafeLink>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-16 flex justify-center">
          <SafeLink href="/open-books">
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary font-bold hover:bg-primary hover:text-primary-foreground transition-all">
              <Library className="h-5 w-5" />
              Explore Open Library
            </button>
          </SafeLink>
        </div>
      </div>
    </div>
  );
}
