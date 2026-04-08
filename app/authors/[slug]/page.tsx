import { notFound } from "next/navigation";
import { getAuthorBySlug, getContentByType, ContentItem } from "@/lib/content";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/fade-in";
import Image from "next/image";
import Link from "next/link";
import {
  Github,
  Twitter,
  Linkedin,
  ChevronLeft,
  Calendar,
  Tag,
} from "lucide-react";

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function AuthorDetailPage({ params }: Props) {
  const { slug } = await params;
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

  const authorPosts = [
    ...blogPosts,
    ...projectPosts,
    ...wikiPosts,
    ...articlesPosts,
    ...tutorialsPosts,
  ]
    .filter((post) => post.author === slug)
    .sort((a, b) => {
      if (a.date && b.date) {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      return 0;
    });

  return (
    <div className="pt-32 pb-20">
      <Container>
        <div className="max-w-4xl mx-auto">
          <FadeIn direction="down">
            <Link
              href="/"
              className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-12"
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back to home
            </Link>

            <div className="flex flex-col md:flex-row gap-8 items-center md:items-start mb-16">
              <div className="relative h-32 w-32 shrink-0 overflow-hidden rounded-2xl border-2 border-primary/20">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl mb-4 text-foreground">
                  {author.name}
                </h1>
                <p className="text-lg font-medium text-primary mb-6">
                  {author.role}
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed mb-8 max-w-2xl">
                  {author.bio}
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4">
                  {author.twitter && (
                    <Link
                      href={`https://twitter.com/${author.twitter}`}
                      className="p-2 rounded-lg bg-accent/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                    >
                      <Twitter size={20} />
                    </Link>
                  )}
                  {author.github && (
                    <Link
                      href={`https://github.com/${author.github}`}
                      className="p-2 rounded-lg bg-accent/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                    >
                      <Github size={20} />
                    </Link>
                  )}
                  {author.linkedin && (
                    <Link
                      href={`https://linkedin.com/in/${author.linkedin}`}
                      className="p-2 rounded-lg bg-accent/50 text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
                    >
                      <Linkedin size={20} />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </FadeIn>

          <FadeIn delay={0.2} direction="none">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold border-b border-border/40 pb-4">
                Contributions ({authorPosts.length})
              </h2>
              <div className="grid gap-6">
                {authorPosts.length > 0 ? (
                  authorPosts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/${post.type}/${post.slug}`}
                      className="group border border-border/50 bg-card/50 backdrop-blur-sm p-6 rounded-2xl transition-all hover:scale-[1.01] hover:border-primary/30"
                    >
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-1">
                          {post.date && (
                            <span className="flex items-center gap-1">
                              <Calendar size={12} />{" "}
                              {new Date(post.date).toLocaleDateString()}
                            </span>
                          )}
                          {post.category && (
                            <span className="flex items-center gap-1">
                              <Tag size={12} /> {post.category}
                            </span>
                          )}
                          <span className="capitalize">{post.type}</span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        {post.description && (
                          <p className="text-muted-foreground line-clamp-2">
                            {post.description}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="text-muted-foreground py-8 text-center bg-muted/20 rounded-2xl border border-dashed border-border">
                    No contributions found yet.
                  </p>
                )}
              </div>
            </div>
          </FadeIn>
        </div>
      </Container>
    </div>
  );
}
