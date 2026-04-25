import { getAllAuthors, _Author } from "@/lib/content";
import { Container } from "@/components/container";
import { FadeIn } from "@/components/fade-in";
import Image from "next/image";
import Link from "next/link";
import { Github, Twitter, Linkedin, ArrowRight } from "lucide-react";
import { Metadata } from "next";
import { TechnicalBackground } from "@/components/technical-background";

export const metadata: Metadata = {
  title: "Authors | Engineering Workspace",
  description:
    "Meet the experts behind our technical documentation and research.",
};

export default async function AuthorsPage() {
  const authors = await getAllAuthors();

  return (
    <div className="relative min-h-screen pt-32 pb-24 overflow-hidden bg-background">
      <TechnicalBackground />

      <Container>
        <div className="max-w-7xl mx-auto px-4 md:px-0">
          <FadeIn direction="down">
            <div className="max-w-3xl mb-16">
              <div className="inline-flex items-center gap-3 px-3 py-1 rounded-full bg-muted border border-border text-primary text-[9px] font-black uppercase tracking-[0.2em] mb-6">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                </span>
                Research Faculty & Engineering Core
              </div>
              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6 amoriaregular text-foreground leading-[0.9]">
                The Architects of <br />
                <span className="text-primary italic">Innovation.</span>
              </h1>
              <p className="text-lg text-muted-foreground max-w-xl google-sans leading-relaxed font-light">
                Meet the multidisciplinary collective of engineers, researchers,
                and designers building the next generation of technical
                infrastructure.
              </p>
            </div>
          </FadeIn>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {authors.map((author, index) => (
              <FadeIn key={author.slug} delay={index * 0.05} direction="up">
                <Link
                  href={`/authors/${author.slug}`}
                  className="group relative flex flex-col h-full bg-card/50 backdrop-blur-xl border border-border rounded-[2rem] overflow-hidden transition-all duration-500 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5"
                >
                  <div className="aspect-square relative overflow-hidden m-3 rounded-[1.5rem] border border-border/50">
                    {author.avatar &&
                    typeof author.avatar === "string" &&
                    author.avatar.trim() !== "" ? (
                      <Image
                        src={author.avatar}
                        alt={author.name}
                        fill
                        className="object-cover transition-all duration-700 grayscale group-hover:grayscale-0 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-muted/30 flex items-center justify-center transition-colors">
                        <span className="text-6xl font-black amoriaregular text-muted-foreground/30 group-hover:text-primary transition-colors duration-500">
                          {author.name
                            ? author.name.charAt(0).toUpperCase()
                            : "?"}
                        </span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute top-4 right-4">
                      <div className="h-8 w-8 rounded-xl bg-background/40 backdrop-blur-md border border-border/50 flex items-center justify-center text-foreground/40 group-hover:text-primary transition-colors">
                        <ArrowRight
                          size={16}
                          className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 rotate-[-45deg]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-8 pt-2 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="h-[1px] w-6 bg-primary/40" />
                      <span className="text-[9px] font-black text-primary uppercase tracking-[0.3em] local-jetbrains-mono">
                        {author.role.split(" ")[0]}
                      </span>
                    </div>

                    <h2 className="text-2xl font-black mb-2 amoriaregular text-foreground group-hover:text-primary transition-colors tracking-tight">
                      {author.name}
                    </h2>

                    <p className="text-muted-foreground/70 text-xs line-clamp-2 mb-6 google-sans leading-relaxed font-light italic">
                      "{author.bio}"
                    </p>

                    <div className="mt-auto flex items-center justify-between border-t border-border pt-6">
                      <div className="flex gap-3">
                        {author.github && (
                          <div className="text-muted-foreground/40 hover:text-primary transition-colors">
                            <Github size={16} />
                          </div>
                        )}
                        {author.linkedin && (
                          <div className="text-muted-foreground/40 hover:text-primary transition-colors">
                            <Linkedin size={16} />
                          </div>
                        )}
                        {author.twitter && (
                          <div className="text-muted-foreground/40 hover:text-primary transition-colors">
                            <Twitter size={16} />
                          </div>
                        )}
                      </div>
                      <div className="text-[9px] font-black text-muted-foreground/20 uppercase tracking-[0.4em] group-hover:text-primary/40 transition-colors">
                        Dossier
                      </div>
                    </div>
                  </div>

                  {/* Hover Accent */}
                  <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary/0 via-primary to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
