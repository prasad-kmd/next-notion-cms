import Link from "next/link"
import { Container } from "./container"
import { Terminal, Github, Twitter, Linkedin, Mail, ExternalLink, LucideIcon } from "lucide-react"

interface FooterLink {
  name: string;
  href: string;
  icon?: LucideIcon;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks: FooterSection[] = [
    {
      title: "Content",
      links: [
        { name: "Blog", href: "/blog" },
        { name: "Projects", href: "/projects" },
        { name: "Wiki", href: "/wiki" },
        { name: "Search", href: "#" },
      ]
    },
    {
      title: "Social",
      links: [
        { name: "GitHub", href: "https://github.com", icon: Github },
        { name: "Twitter", href: "https://twitter.com", icon: Twitter },
        { name: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
      ]
    },
    {
      title: "Contact",
      links: [
        { name: "Email Me", href: "mailto:hello@example.com", icon: Mail },
        { name: "Schedule a Call", href: "#", icon: ExternalLink },
      ]
    }
  ]

  return (
    <footer className="mt-auto border-t border-border/40 bg-secondary/5 py-16 text-muted-foreground transition-colors duration-300">
      <Container>
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8 mb-16">
          <div className="flex flex-col space-y-6">
            <Link href="/" className="flex items-center space-x-2.5 transition-all hover:scale-[1.02]">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Terminal className="h-4 w-4" />
              </div>
              <span className="text-xl font-bold tracking-tighter text-foreground">Blogfolio</span>
            </Link>
            <p className="max-w-xs text-sm leading-relaxed">
              Engineering a better future through elegant code and modern architecture. A personal platform and high-performance workspace.
            </p>
            <div className="flex space-x-4">
              {[Github, Twitter, Linkedin, Mail].map((Icon, i) => (
                <Link key={i} href="#" className="h-9 w-9 flex items-center justify-center rounded-full border border-border/40 bg-card/50 hover:bg-primary/10 hover:text-primary transition-all">
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title} className="flex flex-col space-y-5">
              <h4 className="text-sm font-bold uppercase tracking-widest text-foreground">
                {section.title}
              </h4>
              <ul className="flex flex-col space-y-3">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center text-sm font-medium transition-colors hover:text-primary"
                    >
                      {link.icon && <link.icon className="mr-2 h-4 w-4 opacity-50 group-hover:opacity-100" />}
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between border-t border-border/40 pt-10 space-y-6 md:flex-row md:space-y-0">
          <p className="text-sm">
            &copy; {currentYear} Engineering Blogfolio. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-xs font-semibold uppercase tracking-widest">
            <Link href="#" className="transition-colors hover:text-primary">Privacy Policy</Link>
            <Link href="#" className="transition-colors hover:text-primary">Terms of Service</Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
