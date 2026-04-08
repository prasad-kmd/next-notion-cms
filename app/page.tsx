import Link from "next/link";
import { FileText, BookOpen, GitBranch, Newspaper } from "lucide-react";
import FeaturedHero, { type HeroItem } from "@/components/featured-hero";
import MagicBentoClient from "@/components/magic-bento-client";
import { getContentByType } from "@/lib/content";
import { Calendar, ArrowRight } from "lucide-react";
import Image from "next/image";

export default function HomePage() {
  const blogs = getContentByType("blog");
  const articles = getContentByType("articles");
  const projects = getContentByType("projects");
  const tutorials = getContentByType("tutorials");

  const blogCount = blogs.length;
  const articlesCount = articles.length;
  const projectsCount = projects.length;
  const tutorialsCount = tutorials.length;

  const latestItems = {
    blog: blogs[0],
    articles: articles[0],
    projects: projects[0],
    tutorials: tutorials[0],
  };

  const heroItems: HeroItem[] = [
    {
      title: "Engineering Workspace",
      description:
        "Documenting our journey in mechanical and mechatronics engineering, featuring research, projects, and professional tools.",
      image: "/img/hero/1.webp",
      link: "/about",
      label: "Introduction",
    },
    {
      title: blogs[0]?.title || "Engineering Blog",
      description:
        blogs[0]?.description ||
        "Insights and updates from my engineering journey.",
      image: blogs[0]?.firstImage || "/img/page/ideas_item.webp",
      link: blogs[0] ? `/blog/${blogs[0].slug}` : "/blog",
      label: "Latest Blog",
    },
    {
      title: projects[0]?.title || "Featured Projects",
      description:
        projects[0]?.description ||
        "Explore my latest engineering projects and demonstrations.",
      image: projects[0]?.firstImage || "/img/page/workflow.webp",
      link: projects[0] ? `/projects/${projects[0].slug}` : "/projects",
      label: "Latest Project",
    },
    {
      title: "Project Gallery",
      description:
        "Visual documentation of my engineering journey, prototypes and field work.",
      image: "/img/page/ideas.webp",
      link: "/gallery",
      label: "Visual Gallery",
    },
    {
      title: articles[0]?.title || "Technical Articles",
      description:
        articles[0]?.description ||
        "In-depth technical articles and reflections.",
      image: articles[0]?.firstImage || "/img/page/diary_page.webp",
      link: articles[0] ? `/articles/${articles[0].slug}` : "/articles",
      label: "Featured Article",
    },
    {
      title: tutorials[0]?.title || "Practical Tutorials",
      description:
        tutorials[0]?.description ||
        "Step-by-step guides and educational resources.",
      image: tutorials[0]?.firstImage || "/img/page/posts.webp",
      link: tutorials[0] ? `/tutorials/${tutorials[0].slug}` : "/tutorials",
      label: "New Tutorial",
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <FeaturedHero items={heroItems} />

      {/* Content Sections Grid */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="mb-4 text-3xl font-bold philosopher lg:text-4xl">
            Project Documentation
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-muted-foreground local-inter">
            Comprehensive resources documenting our methodology, findings, and
            technical progress.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Blog",
                href: "/blog",
                icon: FileText,
                desc: "Explore comprehensive articles and project logs on our blog",
              },
              {
                title: "Articles",
                href: "/articles",
                icon: BookOpen,
                desc: "Technical articles and in-depth reflections on our journey",
              },
              {
                title: "Projects",
                href: "/projects",
                icon: GitBranch,
                desc: "Showcase of our engineering projects and demonstrations",
              },
              {
                title: "Tutorials",
                href: "/tutorials",
                icon: Newspaper,
                desc: "Step-by-step guides, tutorials, and educational resources",
              },
            ].map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
              >
                <div className="mb-6 inline-flex rounded-xl bg-primary/10 p-4 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                  <item.icon className="h-7 w-7" />
                </div>
                <h3 className="mb-3 text-xl font-bold font-google-sans">
                  {item.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed local-inter">
                  {item.desc}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Magic Bento Section */}
      <section className="border-t border-border bg-muted/5 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold philosopher lg:text-4xl">
              Project Explorer
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground local-inter">
              Navigate through our research, articles, and technical
              documentation using our interactive explorer.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <MagicBentoClient
              blogCount={blogCount}
              articlesCount={articlesCount}
              projectsCount={projectsCount}
              tutorialsCount={tutorialsCount}
              latestItems={latestItems}
            />
          </div>
        </div>
      </section>

      {/* Recent Updates Section */}
      <section className="px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col items-center justify-between gap-4 mb-12 md:flex-row md:items-end">
            <div className="text-center md:text-left">
              <h2 className="text-3xl font-bold philosopher lg:text-4xl">
                Latest Updates
              </h2>
              <p className="mt-2 text-muted-foreground local-inter">
                Stay informed with our most recent findings and project logs.
              </p>
            </div>
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 font-semibold text-primary font-google-sans"
            >
              View all updates
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                item: latestItems.blog,
                type: "Blog",
                color: "bg-blue-500/10 text-blue-500",
                href: "/blog",
              },
              {
                item: latestItems.articles,
                type: "Article",
                color: "bg-teal-500/10 text-teal-500",
                href: "/articles",
              },
              {
                item: latestItems.tutorials,
                type: "Tutorial",
                color: "bg-purple-500/10 text-purple-500",
                href: "/tutorials",
              },
            ].map(
              (update, idx) =>
                update.item && (
                  <Link
                    key={idx}
                    href={`${update.href}/${update.item.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                  >
                    <div className="relative aspect-video overflow-hidden bg-muted">
                      <Image
                        src={
                          update.item.firstImage || "/img/page/ideas_item.webp"
                        }
                        alt={update.item.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest backdrop-blur-md ${update.color} border border-white/10`}
                        >
                          {update.type}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {update.item.date || "Recent"}
                      </div>
                      <h3 className="mb-2 text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors font-google-sans">
                        {update.item.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-6 flex-1 local-inter">
                        {update.item.description}
                      </p>
                      <div className="flex items-center gap-2 text-sm font-bold text-primary font-roboto">
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </div>
                    </div>
                  </Link>
                ),
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="border-t border-border bg-muted/5 px-6 py-20 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-6 text-3xl font-bold philosopher lg:text-4xl">
            Our Mission
          </h2>
          <div className="space-y-6 text-lg text-muted-foreground leading-relaxed font-google-sans">
            <p>
              This webapp serves as a comprehensive documentation platform for
              our mechanical and mechatronics engineering undergraduate group
              project. Our mission is to identify significant challenges in Sri
              Lanka and develop innovative engineering solutions.
            </p>
            <p>
              Our team consists of both mechanical and mechatronics engineering
              students, bringing diverse perspectives and technical expertise to
              tackle real-world problems. We focus on practical, implementable
              solutions that can make a meaningful impact.
            </p>
          </div>
          <div className="mt-10">
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-primary px-8 py-3 font-semibold text-primary transition-all hover:bg-primary hover:text-primary-foreground font-local-inter"
            >
              Learn more about us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
