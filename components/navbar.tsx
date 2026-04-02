"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X, Terminal, ArrowUpRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { ThemeToggle } from "./theme/theme-toggle"
import { Container } from "./container"
import { motion, AnimatePresence } from "framer-motion"

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Blog", href: "/blog" },
  { name: "Projects", href: "/projects" },
  { name: "Wiki", href: "/wiki" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const pathname = usePathname()
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "border-b border-border/40 bg-background/80 backdrop-blur-md h-16"
          : "bg-transparent h-20"
      )}
    >
      <Container className="h-full">
        <div className="flex h-full items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2.5 transition-all hover:scale-[1.02]"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                <Terminal className="h-5 w-5" />
              </div>
              <span className="text-xl font-bold tracking-tighter sm:text-2xl">
                Blogfolio
              </span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            <div className="flex items-center space-x-1 rounded-full border border-border/40 bg-secondary/20 p-1 backdrop-blur-sm">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-1.5 text-sm font-semibold transition-all duration-300",
                    pathname === link.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {pathname === link.href && (
                    <motion.div
                      layoutId="active-nav"
                      className="absolute inset-0 rounded-full bg-background shadow-sm"
                      transition={{ type: "spring", duration: 0.6 }}
                    />
                  )}
                  <span className="relative z-10">{link.name}</span>
                </Link>
              ))}
            </div>

            <div className="ml-4 h-6 w-px bg-border/40" />

            <div className="ml-4 flex items-center space-x-3">
              <ThemeToggle />
              <Link
                href="/projects"
                className="group inline-flex items-center justify-center rounded-full bg-foreground px-4 py-1.5 text-sm font-bold text-background transition-all hover:bg-foreground/90 active:scale-95"
              >
                Hire Me
                <ArrowUpRight className="ml-1.5 h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center space-x-2 md:hidden">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground active:scale-95"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </Container>

      {/* Mobile Nav Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 border-b border-border bg-background/95 p-4 backdrop-blur-lg md:hidden"
          >
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className={cn(
                    "flex items-center justify-between rounded-lg px-4 py-3 text-lg font-bold transition-all active:scale-[0.98]",
                    pathname === link.href
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {link.name}
                  {pathname === link.href && <ArrowUpRight className="h-5 w-5" />}
                </Link>
              ))}
              <div className="pt-4 border-t border-border/40">
                <Link
                  href="/projects"
                  className="flex h-12 w-full items-center justify-center rounded-xl bg-foreground text-background font-bold transition-all active:scale-[0.98]"
                  onClick={() => setIsOpen(false)}
                >
                  Hire Me
                  <ArrowUpRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
