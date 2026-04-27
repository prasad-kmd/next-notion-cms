import type { Metadata } from "next";
import Link from "next/link";
import { getContentByType } from "@/lib/content";
import { Book, ArrowRight, Hash } from "lucide-react";
import { Pagination } from "@/components/pagination";
import * as motion from "framer-motion/client";
import { staggerContainer, fadeInUp } from "@/lib/animations";

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

interface WikiPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function WikiPage({ searchParams }: WikiPageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const postsPerPage = 9;
  const allEntries = await getContentByType("wiki");

  const totalPages = Math.ceil(allEntries.length / postsPerPage);
  const entries = allEntries.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  return (
    <div className="min-h-screen py-12 wiki_page img_grad_pm relative overflow-hidden">
      {/* Background Decorator */}
      <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto max-w-6xl px-6 lg:px-8 relative z-10">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-14"
        >
          <h1 className="mb-4 text-4xl font-bold mozilla-headline tracking-tight sm:text-6xl text-foreground flex items-center gap-4">
            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
              <Book className="h-10 w-10" />
            </div>
            Engineering Wiki
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-google-sans max-w-2xl border-l-4 border-primary pl-4">
            A structured, searchable collection of engineering concepts,
            formulas, and best practices. Your go-to technical reference.
          </p>
        </motion.div>

        {allEntries.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-inner">
            <p className="text-muted-foreground font-local-inter">
              Knowledge base is being compiled. Check back soon!
            </p>
          </div>
        ) : (
          <>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {entries.map((entry) => (
                <motion.div key={entry.slug} variants={fadeInUp}>
                  <Link
                    href={`/wiki/${entry.slug}`}
                    className="group relative flex flex-col h-full bg-card/40 backdrop-blur-md border border-border rounded-[2rem] p-8 transition-all duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/10 overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Hash className="h-24 w-24 -mr-8 -mt-8 rotate-12" />
                    </div>

                    <div className="flex items-center gap-2 mb-6">
                      <div className="px-3 py-1 rounded-full bg-primary/10 text-[10px] font-bold text-primary uppercase tracking-widest border border-primary/10">
                        {entry.technical || "General"}
                      </div>
                    </div>

                    <h2 className="mb-4 text-2xl font-bold amoriaregular group-hover:text-primary transition-colors leading-tight">
                      {entry.title}
                    </h2>

                    {entry.description && (
                      <p className="mb-8 text-sm text-muted-foreground leading-relaxed line-clamp-3 font-google-sans">
                        {entry.description}
                      </p>
                    )}

                    <div className="mt-auto flex items-center justify-between">
                      <div className="flex flex-wrap gap-2">
                        {entry.tags?.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] font-bold text-primary/60 uppercase tracking-tighter"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                      <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-foreground group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-500">
                        <ArrowRight className="h-5 w-5" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/wiki"
            />
          </>
        )}
      </div>
    </div>
  );
}
