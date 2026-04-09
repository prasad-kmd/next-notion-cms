import { notFound } from "next/navigation";
import { getAuthorBySlug, getContentByType } from "@/lib/content";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/fade-in";
import { AuthorBioExpander } from "@/components/author-bio-expander";
import Image from "next/image";
import Link from "next/link";
import {
  Github,
  Twitter,
  Linkedin,
  ChevronLeft,
  Calendar,
  Tag,
  BookOpen,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export default async function AuthorDetailPage({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { page } = await searchParams;
  const author = await getAuthorBySlug(slug);

  if (!author) {
    notFound();
  }

  // Get all content where this author has contributed
  const blogPosts = await getContentByType("blog");
  const projectPosts = await getContentByType("projects");
  const wikiPosts = await getContentByType("wiki");
  const articlesPosts = await getContentByType("articles");
  const tutorialsPosts = await getContentByType("tutorials");

  const allPosts = [
    ...blogPosts,
    ...projectPosts,
    ...wikiPosts,
    ...articlesPosts,
    ...tutorialsPosts,
  ]
    .filter((post) => post.author?.toLowerCase() === slug.toLowerCase())
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

  const currentPage = parseInt(page || "1");
  const postsPerPage = 10;
  const totalPages = Math.ceil(allPosts.length / postsPerPage);
  const authorPosts = allPosts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage,
  );

  return (
    <div className="min-h-screen pt-24 pb-20 relative overflow-hidden bg-background">
      {/* Hyper-Dossier Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-[600px] bg-[radial-gradient(circle_at_50%_-10%,rgba(var(--primary-rgb),0.08)_0%,transparent_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border)_0.5px,transparent_0.5px),linear-gradient(to_bottom,var(--border)_0.5px,transparent_0.5px)] bg-[size:30px_30px] opacity-[0.03]" />
      </div>

      <Container>
        <div className="max-w-7xl mx-auto">
          <FadeIn direction="down">
            <Link
              href="/authors"
              className="inline-flex items-center px-4 py-1.5 rounded-xl bg-muted border border-border text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-primary hover:border-primary/30 transition-all mb-12 group backdrop-blur-xl"
            >
              <ChevronLeft className="mr-1.5 h-3 w-3 transition-transform group-hover:-translate-x-0.5" />
              Directory Index
            </Link>
          </FadeIn>

          <div className="flex flex-col lg:grid lg:grid-cols-12 gap-12 xl:gap-16 items-start">
            {/* Researcher Profile Card */}
            <aside className="w-full lg:col-span-4 lg:sticky lg:top-24 order-1">
              <FadeIn direction="up">
                <div className="relative mb-8 group p-1.5 rounded-[2.5rem] bg-gradient-to-br from-border/50 to-transparent border border-border shadow-xl">
                  <div className="aspect-square relative overflow-hidden rounded-[2.2rem] border border-border/50">
                    <Image
                      src={author.avatar}
                      alt={author.name}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                      priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-40" />
                  </div>

                  <div className="absolute -bottom-3 -right-3 h-14 w-14 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg rotate-12 transition-transform group-hover:rotate-0 group-hover:scale-110 border-4 border-background">
                    <Sparkles size={24} />
                  </div>
                </div>

                <div className="space-y-8 px-2 md:px-0">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <div className="h-px w-8 bg-primary/40" />
                      <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] local-jetbrains-mono">
                        Primary Investigator
                      </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter amoriaregular text-foreground leading-tight">
                      {author.name}
                    </h1>
                    <div className="text-muted-foreground font-black text-[9px] uppercase tracking-[0.2em] bg-muted inline-block px-3 py-1 rounded-lg border border-border">
                      {author.role}
                    </div>
                  </div>

                  <p className="text-muted-foreground text-base leading-relaxed google-sans font-light italic">
                    "{author.bio}"
                  </p>

                  <div className="pt-6 border-t border-border">
                    <h3 className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 mb-4">
                      Secure Channels
                    </h3>
                    <div className="flex flex-wrap gap-3">
                      {author.twitter && (
                        <Link
                          href={`https://twitter.com/${author.twitter}`}
                          className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all text-muted-foreground/60"
                        >
                          <Twitter size={18} />
                        </Link>
                      )}
                      {author.github && (
                        <Link
                          href={`https://github.com/${author.github}`}
                          className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all text-muted-foreground/60"
                        >
                          <Github size={18} />
                        </Link>
                      )}
                      {author.linkedin && (
                        <Link
                          href={`https://linkedin.com/in/${author.linkedin}`}
                          className="h-10 w-10 rounded-xl bg-muted border border-border flex items-center justify-center hover:bg-primary/10 hover:text-primary hover:border-primary/20 transition-all text-muted-foreground/60"
                        >
                          <Linkedin size={18} />
                        </Link>
                      )}
                    </div>
                  </div>

                  <div className="relative p-6 rounded-[2rem] bg-muted/50 border border-border overflow-hidden group/stats">
                    <div className="absolute top-0 right-0 p-3 opacity-5 group-hover/stats:opacity-10 transition-opacity">
                      <BookOpen size={48} className="text-primary" />
                    </div>
                    <div className="relative z-10 space-y-1">
                      <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground/40">
                        Contributions
                      </span>
                      <div className="flex items-baseline gap-3">
                        <span className="text-5xl font-black text-foreground amoriaregular tabular-nums">
                          {allPosts.length}
                        </span>
                        <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">
                          Works
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </aside>

            {/* Content Dossier Feed */}
            <main className="w-full lg:col-span-8 order-2 lg:pl-8 xl:pl-12">
              <FadeIn delay={0.1} direction="none">
                <div className="space-y-10">
                  {/* Author Body Content — expandable */}
                  {author.bodyContent && (
                    <AuthorBioExpander html={author.bodyContent} />
                  )}

                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-black amoriaregular text-foreground uppercase tracking-[0.2em] shrink-0">
                      Publication Feed
                    </h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-border to-transparent" />
                  </div>

                  <div className="grid gap-4">
                    {authorPosts.length > 0 ? (
                      authorPosts.map((post, idx) => (
                        <FadeIn
                          key={post.slug}
                          delay={idx * 0.03}
                          direction="up"
                        >
                          <Link
                            href={`/${post.type}/${post.slug}`}
                            className="group relative block p-6 rounded-[1.5rem] bg-card border border-border hover:border-primary/30 transition-all duration-500 overflow-hidden shadow-sm"
                          >
                            <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/5 rounded-full blur-[40px] group-hover:bg-primary/10 transition-colors duration-500" />

                            <div className="relative z-10 flex flex-col md:flex-row md:items-center gap-6">
                              <div className="md:w-24 shrink-0">
                                <div className="text-[8px] font-black text-primary uppercase tracking-[0.3em] mb-1">
                                  {post.type}
                                </div>
                                <div className="text-muted-foreground/40 font-black text-xs local-jetbrains-mono">
                                  {post.date
                                    ? new Date(post.date).getFullYear()
                                    : "2024"}
                                </div>
                              </div>

                              <div className="flex-1">
                                <div className="flex flex-wrap items-center gap-2.5 mb-2 text-[8px] font-black uppercase tracking-[0.1em] text-muted-foreground/40">
                                  {post.category && (
                                    <span className="flex items-center gap-1.5 border border-border px-2 py-0.5 rounded bg-muted/50">
                                      <Tag
                                        size={8}
                                        className="text-primary/50"
                                      />
                                      {post.category}
                                    </span>
                                  )}
                                  {post.date && (
                                    <span className="flex items-center gap-1.5">
                                      <Calendar
                                        size={8}
                                        className="text-primary/50"
                                      />
                                      {new Date(post.date).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>

                                <h3 className="text-xl font-black mb-2 amoriaregular text-foreground group-hover:text-primary transition-colors leading-tight tracking-tight">
                                  {post.title}
                                </h3>

                                {post.description && (
                                  <p className="text-muted-foreground/70 text-sm line-clamp-1 google-sans leading-relaxed font-light mb-4">
                                    {post.description}
                                  </p>
                                )}

                                <div className="inline-flex items-center gap-3 text-[9px] font-black text-primary uppercase tracking-[0.4em] group-hover:gap-4 transition-all duration-300">
                                  Extract Intel{" "}
                                  <ArrowRight
                                    size={12}
                                    className="transition-transform group-hover:translate-x-0.5"
                                  />
                                </div>
                              </div>
                            </div>
                          </Link>
                        </FadeIn>
                      ))
                    ) : (
                      <div className="text-center py-20 px-10 rounded-[2.5rem] border border-border bg-muted/20">
                        <div className="h-16 w-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6 border border-border">
                          <BookOpen
                            size={32}
                            className="text-muted-foreground/20"
                          />
                        </div>
                        <h3 className="text-xl font-black amoriaregular text-foreground mb-3 uppercase tracking-widest">
                          Dossier Empty
                        </h3>
                        <p className="text-muted-foreground/40 google-sans max-w-xs mx-auto text-sm font-light leading-relaxed">
                          Field reports and technical documentation for this
                          investigator are currently pending authorization.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 mt-12">
                      {currentPage > 1 && (
                        <Link
                          href={`/authors/${slug}?page=${currentPage - 1}`}
                          className="p-2 rounded-lg bg-muted border border-border hover:border-primary/50 transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </Link>
                      )}

                      <div className="flex items-center gap-1">
                        {Array.from(
                          { length: totalPages },
                          (_, i) => i + 1,
                        ).map((p) => (
                          <Link
                            key={p}
                            href={`/authors/${slug}?page=${p}`}
                            className={`w-10 h-10 flex items-center justify-center rounded-lg border transition-all font-bold text-xs ${
                              currentPage === p
                                ? "bg-primary border-primary text-primary-foreground"
                                : "bg-muted border-border hover:border-primary/50 text-muted-foreground"
                            }`}
                          >
                            {p}
                          </Link>
                        ))}
                      </div>

                      {currentPage < totalPages && (
                        <Link
                          href={`/authors/${slug}?page=${currentPage + 1}`}
                          className="p-2 rounded-lg bg-muted border border-border hover:border-primary/50 transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </FadeIn>
            </main>
          </div>
        </div>
      </Container>
    </div>
  );
}
