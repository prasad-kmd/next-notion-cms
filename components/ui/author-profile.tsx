import { Author } from "@/lib/content"
import Link from "next/link"
import Image from "next/image"

interface AuthorProfileProps {
  author: Author
  lastUpdated?: string
}

export function AuthorProfile({ author, lastUpdated }: AuthorProfileProps) {
  return (
    <div className="space-y-6 pt-6 border-t border-border/40">
      <Link href={`/authors/${author.slug}`} className="group block">
        <div className="flex flex-col gap-4">
          <div className="relative h-16 w-16 overflow-hidden rounded-full border border-border/50">
            <Image
              src={author.avatar}
              alt={author.name}
              fill
              className="object-cover transition-transform group-hover:scale-110"
            />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              {author.name}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {author.bio}
            </p>
          </div>
        </div>
      </Link>

      {lastUpdated && (
        <div className="pt-4 border-t border-border/40">
          <p className="text-xs text-muted-foreground">
            Last updated: <span className="text-foreground/80 font-medium">{lastUpdated}</span>
          </p>
        </div>
      )}
    </div>
  )
}
