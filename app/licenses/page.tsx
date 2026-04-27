"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Package,
  Type,
  Image as ImageIcon,
  Code,
  FileText,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";
import { SafeLink } from "@/components/ui/safe-link";

// Types for our license data
type Category = "All" | "Software" | "Fonts" | "Assets";

interface LicenseItem {
  id: string;
  name: string;
  license: string;
  url: string;
  category: Exclude<Category, "All">;
  source?: string;
  description?: string;
  icon?: React.ElementType;
}

const licenses: LicenseItem[] = [
  // Software / Packages
  {
    id: "1",
    name: "Next.js",
    license: "MIT",
    url: "https://github.com/vercel/next.js",
    category: "Software",
    icon: Code,
  },
  {
    id: "2",
    name: "React",
    license: "MIT",
    url: "https://github.com/facebook/react",
    category: "Software",
    icon: Code,
  },
  {
    id: "3",
    name: "Tailwind CSS",
    license: "MIT",
    url: "https://github.com/tailwindlabs/tailwindcss",
    category: "Software",
    icon: Code,
  },
  {
    id: "4",
    name: "TypeScript",
    license: "Apache-2.0",
    url: "https://github.com/microsoft/TypeScript",
    category: "Software",
    icon: Code,
  },
  {
    id: "5",
    name: "Radix UI",
    license: "MIT",
    url: "https://github.com/radix-ui/primitives",
    category: "Software",
    icon: Package,
  },
  {
    id: "6",
    name: "Framer Motion",
    license: "MIT",
    url: "https://github.com/framer/motion",
    category: "Software",
    icon: Package,
  },
  {
    id: "7",
    name: "GSAP",
    license: "Standard Commercial",
    url: "https://greensock.com/license/",
    category: "Software",
    icon: Package,
  },
  {
    id: "8",
    name: "Lucide React",
    license: "ISC",
    url: "https://github.com/lucide-icons/lucide",
    category: "Software",
    icon: ImageIcon,
  },
  {
    id: "9",
    name: "Shiki",
    license: "MIT",
    url: "https://github.com/shikijs/shiki",
    category: "Software",
    icon: Code,
  },
  {
    id: "10",
    name: "Drizzle ORM",
    license: "Apache-2.0",
    url: "https://github.com/drizzle-team/drizzle-orm",
    category: "Software",
    icon: Package,
  },
  {
    id: "11",
    name: "Better Auth",
    license: "MIT",
    url: "https://github.com/better-auth/better-auth",
    category: "Software",
    icon: Package,
  },
  {
    id: "12",
    name: "KaTeX",
    license: "MIT",
    url: "https://github.com/KaTeX/KaTeX",
    category: "Software",
    icon: Code,
  },
  {
    id: "13",
    name: "Notion SDK",
    license: "MIT",
    url: "https://github.com/makenotion/notion-sdk-js",
    category: "Software",
    icon: Code,
  },
  {
    id: "14",
    name: "Zod",
    license: "MIT",
    url: "https://github.com/colinhacks/zod",
    category: "Software",
    icon: Code,
  },

  // Fonts
  {
    id: "101",
    name: "Inter",
    license: "OFL-1.1",
    source: "Google Fonts",
    url: "https://fonts.google.com/specimen/Inter",
    category: "Fonts",
    icon: Type,
  },
  {
    id: "102",
    name: "JetBrains Mono",
    license: "OFL-1.1",
    source: "JetBrains",
    url: "https://www.jetbrains.com/lp/mono/",
    category: "Fonts",
    icon: Type,
  },
  {
    id: "103",
    name: "Roboto",
    license: "Apache-2.0",
    source: "Google Fonts",
    url: "https://fonts.google.com/specimen/Roboto",
    category: "Fonts",
    icon: Type,
  },
  {
    id: "104",
    name: "Mozilla Headline",
    license: "OFL-1.1",
    source: "Mozilla",
    url: "https://mozilla.design/firefox/",
    category: "Fonts",
    icon: Type,
  },
  {
    id: "105",
    name: "Space Mono",
    license: "OFL-1.1",
    source: "Google Fonts",
    url: "https://fonts.google.com/specimen/Space+Mono",
    category: "Fonts",
    icon: Type,
  },
  {
    id: "106",
    name: "Google Sans",
    license: "Proprietary",
    source: "Google",
    url: "https://fonts.google.com/",
    category: "Fonts",
    icon: Type,
  },

  // Assets
  {
    id: "201",
    name: "Hero Images",
    license: "Unsplash / Custom",
    source: "Unsplash",
    url: "https://unsplash.com",
    category: "Assets",
    icon: ImageIcon,
  },
  {
    id: "202",
    name: "Icons",
    license: "ISC",
    source: "Lucide Icons",
    url: "https://lucide.dev",
    category: "Assets",
    icon: ImageIcon,
  },
  {
    id: "203",
    name: "Favicon",
    license: "Proprietary",
    source: "Custom Design",
    url: "#",
    category: "Assets",
    icon: ImageIcon,
  },
];

export default function LicensesPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All");

  const filteredLicenses =
    activeCategory === "All"
      ? licenses
      : licenses.filter((item) => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-background">
      {/* Custom Hero Section (max 50vh) */}
      <section className="relative h-[45vh] min-h-[320px] max-h-[50vh] flex items-end justify-center overflow-hidden border-b border-border/40">
        {/* Background Grid & Accents */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[32px_32px] mask-[radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[250px] bg-primary/5 rounded-full blur-[80px] opacity-40" />
          <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,rgba(var(--primary-rgb),0.03)_0%,transparent_40%)]" />
        </div>

        <div className="container relative z-10 mx-auto px-6 pb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl"
          >
            <div className="flex justify-start mb-6">
              <SafeLink
                href="/pages"
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-muted/40 border border-border/50 text-xs font-medium text-muted-foreground hover:text-primary hover:border-primary/30 transition-all backdrop-blur-md"
              >
                <ArrowLeft className="h-3 w-3" />
                <span>Back to Directory</span>
              </SafeLink>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold tracking-tight amoriaregular mb-4">
              Legal <span className="text-primary italic">Credits.</span>
            </h1>

            <p className="max-w-xl text-muted-foreground text-base google-sans font-light">
              Transparently documenting the open-source software, typography,
              and assets that power this workspace.
            </p>
          </motion.div>
        </div>

        {/* Decorative corner labels */}
        <div className="absolute bottom-4 left-6 hidden md:block">
          <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/40 local-jetbrains-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-border" />
            Legal_Compliance_v2.0
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="mx-auto max-w-6xl px-6 py-12">
        {/* License Policy Banner */}
        <motion.section
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mb-12 p-6 md:p-8 rounded-3xl border border-border/40 bg-card/30 backdrop-blur-xl relative overflow-hidden group hover:border-primary/20 transition-colors"
        >
          <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
            <FileText size={120} />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row gap-6 items-center">
            <div className="p-4 rounded-2xl bg-primary/10 text-primary shrink-0">
              <Package size={28} />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold philosopher mb-2 flex items-center justify-center md:justify-start gap-2">
                Platform License
                <span className="px-2 py-0.5 rounded-full bg-primary/10 text-[10px] uppercase tracking-tighter">
                  AGPL-3.0
                </span>
              </h2>
              <p className="text-muted-foreground google-sans leading-relaxed text-sm md:text-base">
                This website is open-source software under the{" "}
                <strong className="text-foreground">
                  GNU Affero General Public License v3.0
                </strong>
                .
              </p>
            </div>
            <SafeLink
              href="https://github.com/prasad-kmd/next-notion-cms/blob/main/LICENSE"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full bg-foreground text-background font-bold text-sm hover:scale-105 transition-transform shrink-0"
            >
              Full License
            </SafeLink>
          </div>
        </motion.section>

        {/* Filter Bar - Max width matches content width */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10 max-w-6xl mx-auto">
          {["All", "Software", "Fonts", "Assets"].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat as Category)}
              className={`relative px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all ${
                activeCategory === cat
                  ? "text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground bg-muted/30"
              }`}
            >
              {activeCategory === cat && (
                <motion.div
                  layoutId="filter-active"
                  className="absolute inset-0 bg-primary rounded-full z-0"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        {/* Grid Display with Switching Animation */}
        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <AnimatePresence mode="popLayout">
            {filteredLicenses.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.25 }}
                className="group relative flex flex-col"
              >
                <SafeLink
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex flex-col rounded-2xl border border-border/40 bg-card/40 p-4 backdrop-blur-md transition-all hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 h-full"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-muted/50 text-muted-foreground group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                      {item.icon ? <item.icon size={14} /> : <Code size={14} />}
                    </div>
                    <ExternalLink
                      size={12}
                      className="text-muted-foreground/40 group-hover:text-primary/60 transition-colors"
                    />
                  </div>

                  <h3 className="text-sm font-bold font-google-sans mb-1.5 group-hover:text-primary transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="text-[9px] font-black local-jetbrains-mono uppercase tracking-widest text-muted-foreground/60 bg-muted/30 px-1.5 py-0.5 rounded">
                      {item.license}
                    </span>
                  </div>

                  <div className="mt-auto pt-2.5 flex items-center justify-between border-t border-border/10">
                    <span className="text-[7px] font-black uppercase tracking-[0.2em] text-muted-foreground/30">
                      {item.category}
                    </span>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <CheckCircle2 size={10} className="text-primary/40" />
                    </div>
                  </div>
                </SafeLink>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Footer Acknowledgments */}
        <section className="mt-20 pt-10 border-t border-border/40 text-center">
          <h2 className="text-2xl font-bold philosopher mb-4">
            Acknowledgments
          </h2>
          <div className="max-w-2xl mx-auto space-y-4">
            <p className="text-muted-foreground leading-relaxed local-inter italic text-sm">
              "Open source is the foundation of modern engineering. We
              gratefully acknowledge the thousands of developers whose
              contributions make this platform possible."
            </p>
            <div className="flex items-center justify-center gap-6 pt-3">
              <SafeLink
                href="/contact"
                className="group/link text-xs font-bold uppercase tracking-widest text-primary relative"
              >
                Report Attribution Issue
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover/link:w-full" />
              </SafeLink>
              <span className="w-1 h-1 rounded-full bg-border" />
              <SafeLink
                href="https://github.com/prasad-kmd"
                className="group/link text-xs font-bold uppercase tracking-widest text-primary relative"
              >
                Github Source
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover/link:w-full" />
              </SafeLink>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
