import Link from "next/link"
import { Container } from "./container"

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="mt-auto border-t border-border/40 py-12 text-muted-foreground transition-colors duration-300">
      <Container>
        <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
          <p className="text-sm">
            &copy; {currentYear} Engineering Blogfolio. Built with Next.js & Tailwind.
          </p>
          <div className="flex space-x-6 text-sm font-medium">
            <Link href="/" className="transition-colors hover:text-primary">Home</Link>
            <Link href="/blog" className="transition-colors hover:text-primary">Blog</Link>
            <Link href="/projects" className="transition-colors hover:text-primary">Projects</Link>
            <Link href="/wiki" className="transition-colors hover:text-primary">Wiki</Link>
          </div>
        </div>
      </Container>
    </footer>
  )
}
