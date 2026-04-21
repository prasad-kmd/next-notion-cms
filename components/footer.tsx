"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowUpRight,
  Globe,
  Shield,
  Terminal,
  Rss,
} from "lucide-react";
import { siteConfig } from "@/lib/config";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-border bg-card/30 backdrop-blur-md overflow-hidden">
      {/* Decorative background elements with animations */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40 dark:opacity-20 overflow-hidden">
        <div 
          className="absolute top-[-10%] left-[-10%] w-[40%] h-[60%] bg-primary/20 rounded-full blur-[120px] animate-blob" 
          style={{ animationDuration: '25s' }}
        />
        <div 
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[70%] bg-primary/10 rounded-full blur-[140px] animate-blob" 
          style={{ animationDuration: '30s', animationDelay: '-10s' }}
        />
        <div 
          className="absolute top-[20%] right-[10%] w-[30%] h-[40%] bg-primary/15 rounded-full blur-[100px] animate-blob" 
          style={{ animationDuration: '35s', animationDelay: '-20s' }}
        />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pt-16 lg:pb-8 pb-24 z-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">
          {/* Logo and Brand Identity */}
          <div className="md:col-span-2 lg:col-span-2">
            <Link href="/" className="group flex items-center gap-3 mb-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 transition-all group-hover:bg-primary shadow-sm overflow-hidden p-1.5">
                <Image
                  src="/img/favicon/favicon-256.png"
                  alt="Logo"
                  width={32}
                  height={32}
                  className="h-full w-full object-contain"
                />
              </div>
              <div>
                <span className="text-2xl font-bold mozilla-headline tracking-tight">
                  PrasadM
                </span>
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary/80 font-bold google-sans">
                  Engineering Portfolio
                </p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground google-sans leading-relaxed max-w-sm mb-6">
              {siteConfig.description}
            </p>
            <div className="flex gap-3">
              {[
                {
                  icon: Github,
                  href: siteConfig.socialLinks.github,
                  label: "GitHub",
                },
                {
                  icon: Twitter,
                  href: siteConfig.socialLinks.twitter,
                  label: "Twitter",
                },
                {
                  icon: Linkedin,
                  href: siteConfig.socialLinks.linkedin,
                  label: "LinkedIn",
                },
                { icon: Rss, href: "/feed.xml", label: "RSS Feed" },
                { icon: Mail, href: "/contact", label: "Contact" },
              ].map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-background/50 text-muted-foreground transition-all hover:border-primary/50 hover:bg-primary/10 hover:text-primary"
                >
                  <social.icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-sm font-bold mb-6 mozilla-headline uppercase tracking-widest flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" /> Explore
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Portfolio", href: "/portfolio" },
                { name: "Blog", href: "/blog" },
                { name: "Projects", href: "/projects" },
                { name: "Tools", href: "/tools" },
                { name: "Wiki", href: "/wiki" },
                { name: "Tutorials", href: "/tutorials" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors google-sans"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 -translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Project Context */}
          <div>
            <h3 className="text-sm font-bold mb-6 mozilla-headline uppercase tracking-widest flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" /> Project
            </h3>
            <ul className="space-y-4">
              {[
                { name: "About Me", href: "/about" },
                { name: "What's Now", href: "/now" },
                { name: "Setup / Uses", href: "/uses" },
                { name: "Roadmap", href: "/roadmap" },
                { name: "Changelog", href: "/changelog" },
                { name: "Snippets", href: "/snippets" },
                { name: "Open Source", href: "/open-source" },
                { name: "Resources", href: "/resources" },
                { name: "Site Directory", href: "/pages" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors google-sans"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 -translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal and Technical */}
          <div>
            <h3 className="text-sm font-bold mb-6 mozilla-headline uppercase tracking-widest flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Legal
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Privacy Policy", href: "/privacy-policy" },
                { name: "Terms of Service", href: "/terms-and-conditions" },
                { name: "Disclaimer", href: "/disclaimer" },
                { name: "Accessibility", href: "/accessibility" },
                { name: "Security", href: "/security" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors google-sans"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 ml-1 opacity-0 -translate-y-1 transition-all group-hover:opacity-100 group-hover:translate-y-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col items-center md:items-start gap-1">
            <p className="text-xs text-muted-foreground google-sans">
              © {currentYear} PrasadM. Documenting Engineering Excellence.
            </p>
            <p className="text-[10px] text-muted-foreground/60 font-mono tracking-tight uppercase">
              Built with Next.js 15 & Tailwind CSS 4
            </p>
          </div>

          <Link
            href="/status"
            className="flex items-center gap-4 px-4 py-2 rounded-full bg-muted/30 border border-border/50 backdrop-blur-sm hover:bg-muted/50 transition-colors"
          >
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-[10px] font-medium google-sans uppercase tracking-tighter text-muted-foreground">
              Systems Operational
            </span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
