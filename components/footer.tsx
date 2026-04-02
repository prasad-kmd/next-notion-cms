"use client";

import React from "react";
import Link from "next/link";
import { Github, Twitter, Linkedin, Heart, Mail } from "lucide-react";
import { cn } from "@/lib/utils";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-background/40 border-t border-border/50 pt-16 pb-8 transition-colors duration-300 mt-auto">
      <div className="max-w-[1440px] mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          {/* Brand and Description */}
          <div className="col-span-1 md:col-span-5 space-y-6">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight transition-all hover:scale-105 active:scale-95 w-fit">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
                B
              </div>
              <span>Blogfolio</span>
            </Link>
            <p className="text-muted-foreground max-w-sm text-sm leading-relaxed">
              A minimalist, high-performance engineering blogfolio designed for modern developers.
              Built with Next.js 16 and Tailwind CSS 4 to document technical journeys and showcase innovation.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                <Github size={18} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                <Twitter size={18} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                <Linkedin size={18} />
              </a>
              <a
                href="mailto:contact@example.com"
                className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all"
              >
                <Mail size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-2 md:col-start-7 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-foreground/40">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/blog" className="text-muted-foreground hover:text-primary transition-colors text-sm">Blog Posts</Link>
              </li>
              <li>
                <Link href="/projects" className="text-muted-foreground hover:text-primary transition-colors text-sm">Projects Showcase</Link>
              </li>
              <li>
                <Link href="/wiki" className="text-muted-foreground hover:text-primary transition-colors text-sm">Technical Wiki</Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="col-span-1 md:col-span-2 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-[0.2em] text-foreground/40">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">About Me</Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact</Link>
              </li>
              <li>
                <Link href="/rss" className="text-muted-foreground hover:text-primary transition-colors text-sm">RSS Feed</Link>
              </li>
              <li>
                <Link href="/privacy" className="text-muted-foreground hover:text-primary transition-colors text-sm">Privacy Policy</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Area */}
        <div className="pt-8 border-t border-border/40 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            © {currentYear} PrasadM. Made with <Heart size={12} className="text-red-500 fill-red-500" /> in LK.
          </p>
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
               <span className="text-[9px] text-emerald-500 uppercase font-bold tracking-wider">Systems Operational</span>
             </div>
             <p className="text-[10px] text-muted-foreground uppercase font-bold tracking-[0.1em]">
               v1.2.0-Alpha
             </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
