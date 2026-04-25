import type { Metadata } from "next";
import Link from "next/link";
import {
  Home,
  UserRound,
  FileText,
  BookOpen,
  GitBranch,
  Newspaper,
  Wrench,
  Users,
  Mail,
  ArrowRight,
  ShieldCheck,
  Scale,
  AlertTriangle,
  Image as ImageIcon,
  Gamepad2,
  Rss,
  FlaskConical,
  Library,
  Book,
  Github,
  FileArchive,
  Printer,
  BookMarked,
  Activity,
  Accessibility,
  ShieldAlert,
  Palette,
  Search,
  Hash,
  Heart,
  Trophy,
  _Clapperboard,
} from "lucide-react";

const title = "Site Directory";
const description =
  "A comprehensive, categorized overview of all sections within the platform.";

export const metadata: Metadata = {
  title,
  description,
};

const categories = [
  {
    name: "Core Content",
    id: "core",
    description: "Primary hubs for engineering projects and documentation.",
    pages: [
      {
        name: "Home",
        href: "/",
        icon: Home,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        description: "The central hub for news and featured content.",
      },
      {
        name: "Portfolio",
        href: "/portfolio",
        icon: UserRound,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        description: "Professional showcase of engineering expertise.",
      },
      {
        name: "Blog",
        href: "/blog",
        icon: FileText,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        description: "Chronological logs of the engineering journey.",
      },
      {
        name: "Articles",
        href: "/articles",
        icon: BookOpen,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        description: "In-depth technical papers and essays.",
      },
      {
        name: "Projects",
        href: "/projects",
        icon: GitBranch,
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
        description: "Documentation of mechanical and mechatronics builds.",
      },
      {
        name: "Tutorials",
        href: "/tutorials",
        icon: Newspaper,
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
        description: "Educational resources and technical guides.",
      },
    ],
  },
  {
    name: "Engineering Hub",
    id: "engineering",
    description: "Specialized tools and technical knowledge bases.",
    pages: [
      {
        name: "Quiz Library",
        href: "/quiz",
        icon: Trophy,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        description: "Interactive engineering knowledge assessments.",
      },
      {
        name: "Engineering Wiki",
        href: "/wiki",
        icon: Book,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        description: "Searchable collection of engineering concepts.",
      },
      {
        name: "Engineering Researches",
        href: "/researches",
        icon: FlaskConical,
        color: "text-teal-500",
        bgColor: "bg-teal-500/10",
        description: "Search scholarly articles on arXiv.",
      },
      {
        name: "Open Books",
        href: "/open-books",
        icon: Library,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        description: "Digital resources from Open Library.",
      },
      {
        name: "Code Snippets",
        href: "/snippets",
        icon: FileText,
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
        description: "Reusable technical shortcuts and cheatsheets.",
      },
    ],
  },
  {
    name: "Knowledge & Resources",
    id: "resources",
    description: "Downloadable assets and reference materials.",
    pages: [
      {
        name: "Open Source",
        href: "/open-source",
        icon: Github,
        color: "text-slate-500",
        bgColor: "bg-slate-500/10",
        description: "GitHub repositories and contribution guides.",
      },
      {
        name: "Downloads",
        href: "/resources",
        icon: FileArchive,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        description: "CAD files, code examples, and datasheets.",
      },
      {
        name: "Cheat Sheets",
        href: "/cheat-sheets",
        icon: Printer,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        description: "Printable reference pages for quick lookups.",
      },
      {
        name: "Reading List",
        href: "/reading-list",
        icon: BookMarked,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        description: "Curated books and papers with annotations.",
      },
      {
        name: "Glossary",
        href: "/glossary",
        icon: Hash,
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
        description: "Technical terminology definitions.",
      },
    ],
  },
  {
    name: "About & Career",
    id: "career",
    description: "Professional background and personal snapshots.",
    pages: [
      {
        name: "About Me",
        href: "/about",
        icon: Users,
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
        description: "The mission behind this platform.",
      },
      {
        name: "Sponsorship",
        href: "/sponsorship",
        icon: Heart,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        description: "Support the development of open-source tools.",
      },
      {
        name: "What's Now",
        href: "/now",
        icon: Activity,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        description: "Current focus and active builds.",
      },
      {
        name: "Setup / Uses",
        href: "/uses",
        icon: Wrench,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        description: "Hardware setup and software stack.",
      },
      {
        name: "Project Roadmap",
        href: "/roadmap",
        icon: GitBranch,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        description: "Upcoming features and milestones.",
      },
      {
        name: "Site Changelog",
        href: "/changelog",
        icon: FileText,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        description: "History of updates on this site.",
      },
      {
        name: "Visual Gallery",
        href: "/gallery",
        icon: ImageIcon,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
        description: "Visual documentation of field work.",
      },
      {
        name: "Contact",
        href: "/contact",
        icon: Mail,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        description: "Get in touch for collaborations.",
      },
    ],
  },
  {
    name: "Legal & Technical",
    id: "legal",
    description: "Policies, status, and brand guidelines.",
    pages: [
      {
        name: "Privacy Policy",
        href: "/privacy-policy",
        icon: ShieldCheck,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        description: "How we handle your data.",
      },
      {
        name: "Terms of Service",
        href: "/terms-and-conditions",
        icon: Scale,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
        description: "Rules for using this platform.",
      },
      {
        name: "Disclaimer",
        href: "/disclaimer",
        icon: AlertTriangle,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
        description: "Legal limitations and liabilities.",
      },
      {
        name: "Licenses",
        href: "/licenses",
        icon: FileText,
        color: "text-violet-500",
        bgColor: "bg-violet-500/10",
        description: "Third-party licenses and attributions.",
      },
      {
        name: "Accessibility",
        href: "/accessibility",
        icon: Accessibility,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
        description: "Commitment to inclusive design.",
      },
      {
        name: "Security Policy",
        href: "/security",
        icon: ShieldAlert,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
        description: "Reporting vulnerabilities.",
      },
      {
        name: "Site Status",
        href: "/status",
        icon: Activity,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
        description: "System uptime and health.",
      },
      {
        name: "Style Guide",
        href: "/style-guide",
        icon: Palette,
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
        description: "Brand assets and guidelines.",
      },
    ],
  },
  {
    name: "Discovery",
    id: "discovery",
    description: "External integrations and global search.",
    pages: [
      {
        name: "Global Search",
        href: "/search",
        icon: Search,
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
        description: "Find any content across the platform.",
      },
      {
        name: "External Feeds",
        href: "/feeds",
        icon: Rss,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
        description: "Latest posts from engineering blogs.",
      },
      {
        name: "Game Deals",
        href: "/game-deal",
        icon: Gamepad2,
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
        description: "Best game discounts across stores.",
      },
    ],
  },
];

export default function PagesOverview() {
  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 bg-background">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12 text-center lg:text-left">
          <h1 className="mb-4 text-4xl font-bold mozilla-headline lg:text-5xl">
            Site Directory
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl google-sans">
            {description}
          </p>
        </header>

        {/* Quick Navigation */}
        <div className="sticky top-20 z-10 mb-12 flex flex-wrap justify-center gap-2 p-2 rounded-2xl bg-background/50 backdrop-blur-xl border border-border/50 shadow-sm">
          {categories.map((c) => (
            <a
              key={c.id}
              href={`#${c.id}`}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all hover:bg-primary/10 hover:text-primary text-muted-foreground local-jetbrains-mono"
            >
              {c.name.split(" ")[0]}
            </a>
          ))}
        </div>

        <div className="space-y-20">
          {categories.map((category) => (
            <section
              key={category.name}
              id={category.id}
              className="scroll-mt-32"
            >
              <div className="mb-8 border-b border-border pb-4">
                <h2 className="text-2xl font-bold mozilla-headline flex items-center gap-3">
                  {category.name}
                  <span className="text-xs font-normal text-muted-foreground uppercase tracking-widest bg-muted px-2 py-0.5 rounded">
                    {category.pages.length} Pages
                  </span>
                </h2>
                <p className="mt-1 text-muted-foreground google-sans italic text-sm">
                  {category.description}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {category.pages.map((page) => (
                  <Link
                    key={page.href}
                    href={page.href}
                    className="group relative flex flex-col rounded-2xl border border-border bg-card p-5 transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${page.bgColor} ${page.color} transition-transform group-hover:scale-110`}
                      >
                        <page.icon className="h-5 w-5" />
                      </div>
                      <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 transition-all group-hover:translate-x-1 group-hover:opacity-100 group-hover:text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold group-hover:text-primary transition-colors google-sans">
                        {page.name}
                      </h3>
                      <p className="mt-1 text-xs text-muted-foreground leading-relaxed local-inter line-clamp-2">
                        {page.description}
                      </p>
                    </div>
                    <div className="absolute inset-0 -z-10 rounded-2xl bg-linear-to-br from-primary/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-24 flex flex-col items-center gap-4 py-12 border-t border-border/50">
          <p className="text-sm text-muted-foreground google-sans italic text-center">
            Can&apos;t find what you&apos;re looking for? Use the Command
            Palette (Cmd + K) anywhere on the site.
          </p>
          <div className="h-px w-32 bg-linear-to-r from-transparent via-primary/30 to-transparent" />
        </div>
      </div>
    </div>
  );
}
