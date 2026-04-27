"use client";

import { useState, useEffect, startTransition } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export interface HeroItem {
  title: string;
  description: string;
  image: string;
  link: string;
  label: string;
}

interface FeaturedHeroProps {
  items: HeroItem[];
}

import Image from "next/image";
import { cn } from "@/lib/utils";

export default function FeaturedHero({ items }: FeaturedHeroProps) {
  const [mounted, setMounted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    startTransition(() => {
      setMounted(true);
    });
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [items.length]);

  return (
    <section className="relative min-h-screen flex items-center py-16 lg:py-0 overflow-hidden bg-background">
      {/* Video Background */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[200%] z-0 pointer-events-none overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-100 dark:opacity-40 mix-blend-screen dark:mix-blend-lighten"
          style={{
            maskImage:
              "radial-gradient(circle at center, black 25%, transparent 55%)",
            WebkitMaskImage:
              "radial-gradient(circle at center, black 25%, transparent 55%)",
          }}
        >
          <source src="/video/black-hole-purple.webm" type="video/webm" />
        </video>
      </div>

      {/* Dynamic Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px] mask-[radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(var(--primary-rgb),0.05)_0%,transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_70%,rgba(var(--secondary-rgb),0.05)_0%,transparent_50%)]" />
      </div>

      {/* Floating Geometric Elements */}
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] animate-pulse delay-1000" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-16 items-center">
          <div className="lg:col-span-7 space-y-8 md:space-y-10">
            <div className="space-y-4">
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.8 }}
                className="text-6xl md:text-8xl xl:text-9xl font-black amoriaregular leading-[0.85] tracking-tight text-foreground"
              >
                The Future <br />
                <span className="text-primary italic relative">
                  Is Built.
                  <svg
                    className="absolute -bottom-4 left-0 w-full h-4 text-primary/20"
                    viewBox="0 0 300 20"
                  >
                    <path
                      d="M0 10 Q 75 0, 150 10 T 300 10"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                  </svg>
                </span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl google-sans leading-relaxed font-light"
            >
              Architecting high-performance systems where{" "}
              <span className="text-foreground font-bold">mechatronics</span>{" "}
              meets{" "}
              <span className="text-foreground font-bold">
                digital innovation
              </span>
              . Documenting the frontier of hardware engineering.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-4 pt-4"
            >
              {/* Primary Action - Thick Glass */}
              <Link
                href="/projects"
                className="group relative inline-flex h-14 items-center justify-center overflow-hidden rounded-2xl bg-foreground/10 px-10 text-sm font-bold text-foreground shadow-lg transition-all hover:bg-foreground/20 hover:scale-[1.02] active:scale-[0.98] border border-white/20 dark:border-white/10 backdrop-blur-2xl"
              >
                <span className="relative z-10 flex items-center gap-3 uppercase tracking-wider font-google-sans">
                  Explore Works
                  <ArrowRight
                    size={18}
                    className="transition-transform group-hover:translate-x-1"
                  />
                </span>
                {/* Inner glow effect for iOS look */}
                <div className="absolute inset-0 bg-linear-to-tr from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>

              {/* Secondary Action - Light Glass */}
              <Link
                href="/blog"
                className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-10 text-sm font-bold text-foreground/80 backdrop-blur-xl transition-all hover:bg-white/10 hover:text-foreground hover:border-white/20 uppercase tracking-wider shadow-sm font-amoria"
              >
                Read Blog
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative group">
              <div className="absolute -inset-4 bg-linear-to-tr from-primary/30 to-secondary/30 rounded-[3rem] blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative rounded-[3rem] border border-border/40 dark:border-white/10 bg-card/80 p-4 xl:p-6 shadow-2xl overflow-hidden backdrop-blur-3xl min-h-[500px] flex flex-col">
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-6 px-4">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <div className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <div className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <div className="px-3 py-1 rounded-full bg-primary/5 border border-primary/10 text-[9px] font-bold text-muted-foreground uppercase tracking-[0.2em] local-jetbrains-mono flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                    Engineering_Feed
                  </div>
                </div>

                {/* Carousel Area */}
                <div className="relative flex-1 rounded-4xl overflow-hidden border border-border/40 dark:border-white/5 bg-background/40">
                  {items.map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={false}
                      animate={
                        mounted
                          ? {
                              opacity: currentIndex === idx ? 1 : 0,
                              x: currentIndex === idx ? 0 : 20,
                              pointerEvents:
                                currentIndex === idx ? "auto" : "none",
                            }
                          : {
                              opacity: idx === 0 ? 1 : 0,
                              x: idx === 0 ? 0 : 20,
                              pointerEvents: idx === 0 ? "auto" : "none",
                            }
                      }
                      transition={{ duration: 0.8, ease: "circOut" }}
                      className={cn(
                        "absolute inset-0 p-6 flex flex-col",
                        !mounted && idx !== 0 && "hidden",
                      )}
                    >
                      <div className="relative aspect-video rounded-2xl overflow-hidden mb-6 border border-border/40 dark:border-white/5 shadow-2xl">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          priority={idx === 0}
                          className="object-cover transition-transform duration-700 hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-background/80 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4">
                          <span className="px-3 py-1 bg-primary/20 backdrop-blur-md border border-primary/30 rounded-full text-[8px] font-black text-primary uppercase tracking-widest">
                            {item.label}
                          </span>
                        </div>
                      </div>

                      <h3 className="text-2xl font-black amoriaregular text-foreground mb-3 line-clamp-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-muted-foreground line-clamp-3 mb-6 google-sans font-light leading-relaxed italic">
                        "{item.description}"
                      </p>

                      <Link
                        href={item.link}
                        className="mt-auto group/feed-link inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-primary hover:text-foreground transition-colors"
                      >
                        Initialize Access
                        <ArrowRight
                          size={14}
                          className="transition-transform group-hover/feed-link:translate-x-1"
                        />
                      </Link>
                    </motion.div>
                  ))}
                </div>

                {/* Carousel Indicators */}
                <div className="flex justify-center gap-2 mt-6">
                  {items.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 transition-all duration-500 rounded-full ${currentIndex === idx ? "w-8 bg-primary" : "w-1.5 bg-border/40 hover:bg-border/60"}`}
                    />
                  ))}
                </div>

                {/* Decorative scanning line */}
                <motion.div
                  animate={{ top: ["0%", "100%", "0%"] }}
                  transition={{
                    duration: 10,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute left-0 right-0 h-px bg-primary/20 blur-sm z-20 pointer-events-none"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Decorative side indicators */}
      <div className="absolute left-10 bottom-10 hidden xl:block">
        <div className="flex flex-col gap-4 text-[10px] font-bold text-muted-foreground local-jetbrains-mono vertical-rl rotate-180 uppercase tracking-[0.5em] opacity-40 select-none">
          Workspace v2.5.0 // Est. 2026
        </div>
      </div>
    </section>
  );
}
