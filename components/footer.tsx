"use client"

import React from "react"
import Link from "next/link"
import {
  PanelLeft,
  Github,
  Twitter,
  Linkedin,
  Mail,
  ArrowUpRight,
  Globe,
  Shield,
  Terminal,
  Rss
} from "lucide-react"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="relative border-t border-border bg-card/30 backdrop-blur-md overflow-hidden mt-auto">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl translate-y-1/2 pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-6 pt-16 pb-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4 lg:grid-cols-5">
          {/* Logo and Brand Identity */}
          <div className="md:col-span-2 lg:col-span-2">
            <Link href="/" className="group flex items-center gap-3 mb-6 w-fit">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all group-hover:bg-primary group-hover:text-primary-foreground shadow-sm">
                <PanelLeft className="h-6 w-6" />
              </div>
              <div>
                <span className="text-2xl font-bold tracking-tight">PrasadM</span>
                <p className="text-[10px] uppercase tracking-[0.2em] text-primary/80 font-bold">Engineering Portfolio</p>
              </div>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-sm mb-6">
              A minimalist, high-performance engineering blogfolio designed for modern developers.
              Built with Next.js 16 and Tailwind CSS 4 to document technical journeys and showcase innovation.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Github, href: "https://github.com", label: "GitHub" },
                { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
                { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
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
            <h3 className="text-sm font-bold mb-6 uppercase tracking-widest flex items-center gap-2">
              <Terminal className="h-4 w-4 text-primary" /> Explore
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Blog", href: "/blog" },
                { name: "Projects", href: "/projects" },
                { name: "Wiki", href: "/wiki" },
                { name: "About Me", href: "/about" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
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
            <h3 className="text-sm font-bold mb-6 uppercase tracking-widest flex items-center gap-2">
              <Globe className="h-4 w-4 text-primary" /> Project
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Contact", href: "/contact" },
                { name: "RSS Feed", href: "/feed.xml" },
                { name: "Sitemap", href: "/sitemap.xml" },
                { name: "Archive", href: "/archive" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
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
            <h3 className="text-sm font-bold mb-6 uppercase tracking-widest flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Legal
            </h3>
            <ul className="space-y-4">
              {[
                { name: "Privacy Policy", href: "/privacy" },
                { name: "Terms of Service", href: "/terms" },
                { name: "Accessibility", href: "/accessibility" },
                { name: "Security", href: "/security" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="group flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
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
            <p className="text-xs text-muted-foreground">
              © {currentYear} PrasadM. Documenting Engineering Excellence.
            </p>
            <p className="text-[10px] text-muted-foreground/60 font-mono tracking-tight uppercase">
              Built with Next.js 16 & Tailwind CSS 4
            </p>
          </div>

          <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-muted/30 border border-border/50 backdrop-blur-sm">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[10px] font-medium uppercase tracking-tighter text-muted-foreground">Systems Operational</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
