import type { Metadata } from "next";
import { getContentByType } from "@/lib/content";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import * as motion from "framer-motion/client";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const title = "Tutorials";
const description =
  "General updates, announcements, and insights from our engineering team.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/tutorials",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(title)}`,
        width: 1200,
        height: 630,
        alt: description,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`/api/og?title=${encodeURIComponent(title)}`],
  },
};

interface TutorialsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function TutorialsPage({
  searchParams,
}: TutorialsPageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const postsPerPage = 9;
  const allTutorials = await getContentByType("tutorials");

  const totalPages = Math.ceil(allTutorials.length / postsPerPage);
  const tutorials = allTutorials.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  return (
    <div className="min-h-screen py-12 tutorials_page img_grad_pm">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-14"
        >
          <h1 className="mb-4 text-4xl font-bold mozilla-headline tracking-tight sm:text-6xl text-foreground">
            Tutorials
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-google-sans max-w-2xl border-l-4 border-primary pl-4">
            {description}
          </p>
        </motion.div>

        {allTutorials.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-inner">
            <p className="text-muted-foreground font-local-inter">
              No tutorials yet. Check back later!
            </p>
          </div>
        ) : (
          <>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={staggerContainer}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10"
            >
              {tutorials.map((post) => (
                <motion.div key={post.slug} variants={fadeInUp}>
                  <ContentCard post={post} basePath="/tutorials" />
                </motion.div>
              ))}
            </motion.div>

            {/* Sticky Pagination */}
            {totalPages > 1 && (
              <div className="sticky bottom-5 z-50 mt-16 mb-3 flex justify-center pointer-events-none">
                <div className="flex items-center gap-3 bg-background/60 backdrop-blur-xl p-1.5 rounded-full border border-border/50 shadow-2xl shadow-primary/10 pointer-events-auto scale-90 sm:scale-100 transition-all hover:scale-105 hover:bg-background/80 hover:border-primary/30">
                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    disabled={currentPage <= 1}
                    className={`rounded-full w-10 h-10 p-0 ${
                      currentPage <= 1
                        ? "pointer-events-none opacity-20"
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <Link href={`/tutorials?page=${currentPage - 1}`}>
                      <ChevronLeft className="h-5 w-5" />
                      <span className="sr-only">Previous</span>
                    </Link>
                  </Button>

                  <div className="flex items-center gap-1 px-2 border-x border-border/50">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <Button
                          key={p}
                          variant={currentPage === p ? "default" : "ghost"}
                          size="sm"
                          asChild
                          className={`w-9 h-9 rounded-full transition-all ${
                            currentPage === p
                              ? "shadow-lg shadow-primary/40 bg-primary text-primary-foreground"
                              : "hover:bg-primary/10 hover:text-primary"
                          }`}
                        >
                          <Link
                            href={`/tutorials?page=${p}`}
                            className="text-xs font-bold local-jetbrains-mono"
                          >
                            {p}
                          </Link>
                        </Button>
                      ),
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    asChild
                    disabled={currentPage >= totalPages}
                    className={`rounded-full w-10 h-10 p-0 ${
                      currentPage >= totalPages
                        ? "pointer-events-none opacity-20"
                        : "hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <Link href={`/tutorials?page=${currentPage + 1}`}>
                      <span className="sr-only">Next</span>
                      <ChevronRight className="h-5 w-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
