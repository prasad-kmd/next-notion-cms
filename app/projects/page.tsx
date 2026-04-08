import type { Metadata } from "next";
import Link from "next/link";
import { getContentByType } from "@/lib/content";
import { Calendar, ArrowRight } from "lucide-react";

const title = "Projects";
const description =
  "Technical documentation, processes, and methodologies guiding our project approach.";

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/projects",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(title)}`,
        width: 1200,
        height: 630,
        alt: description,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: [`/api/og?title=${encodeURIComponent(title)}`],
  },
};

export default function ProjectsPage() {
  const projects = getContentByType("projects");

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 projects_page img_grad_pm">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold mozilla-headline">Projects</h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-google-sans">
            Technical documentation, processes, and methodologies guiding our
            project approach.
          </p>
        </div>

        {projects.length === 0 ? (
          <div className="rounded-xl border border-border bg-card p-12 text-center">
            <p className="text-muted-foreground">
              No project documents yet. Create a{" "}
              <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                .md
              </code>{" "}
              or{" "}
              <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                .html
              </code>{" "}
              file in the{" "}
              <code className="rounded bg-muted px-2 py-1 font-mono text-sm">
                content/projects/
              </code>{" "}
              directory.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {projects.map((project, index) => {
              const borderColor =
                index === 0 ? "border-blue-500/70" : "border-border";
              const hoverBorderColor =
                index === 0
                  ? "hover:border-blue-500"
                  : "hover:border-primary/50";

              const backgroundStyle = project.firstImage
                ? {
                    backgroundImage: `var(--item-gradient), url("${project.firstImage}")`,
                    backgroundBlendMode: "overlay" as const,
                    backgroundOrigin: "border-box" as const,
                    backgroundPosition: "right" as const,
                    backgroundSize: "cover" as const,
                    backgroundAttachment: "scroll" as const,
                  }
                : undefined;

              return (
                <Link
                  key={project.slug}
                  href={`/projects/${project.slug}`}
                  className={`group block rounded-xl border ${borderColor} ${hoverBorderColor} bg-card p-6 transition-all hover:shadow-lg hover:shadow-primary/5 overflow-hidden`}
                  style={backgroundStyle}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="mb-2 text-2xl font-semibold group-hover:text-primary font-google-sans">
                        {project.title}
                      </h2>
                      {project.description && (
                        <p className="mb-3 text-muted-foreground leading-relaxed font-local-inter">
                          {project.description}
                        </p>
                      )}
                      {project.date && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground invisible font-local-inter">
                          <Calendar className="h-4 w-4" />
                          {new Date(project.date).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </div>
                      )}
                    </div>
                    <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
