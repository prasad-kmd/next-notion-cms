import type { Metadata } from "next";
import { getContentByType } from "@/lib/content";
import { BlogCard } from "@/components/unique-cards";
import { Pagination } from "@/components/pagination";
import * as motion from "framer-motion/client";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const title = "Blog";
const description =
  "Latest updates, engineering insights, and technical articles from our team.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/blog",
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

interface BlogPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const { page } = await searchParams;
  const currentPage = parseInt(page || "1");
  const postsPerPage = 9;
  const allPosts = await getContentByType("blog");

  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const posts = allPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  return (
    <div className="min-h-screen py-12 blog_page img_grad_pm">
      <div className="mx-auto max-w-6xl px-6 lg:px-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeInUp}
          className="mb-14"
        >
          <h1 className="mb-4 text-4xl font-bold mozilla-headline tracking-tight sm:text-6xl text-foreground">
            Blog
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-google-sans max-w-2xl border-l-4 border-primary pl-4">
            {description}
          </p>
        </motion.div>

        {allPosts.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card p-12 text-center shadow-inner">
            <p className="text-muted-foreground font-local-inter">
              No blog posts yet. Check back later!
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
              {posts.map((post) => (
                <motion.div
                  key={post.slug}
                  variants={fadeInUp}
                  className="h-full"
                >
                  <BlogCard post={post} />
                </motion.div>
              ))}
            </motion.div>

            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/blog"
            />
          </>
        )}
      </div>
    </div>
  );
}
