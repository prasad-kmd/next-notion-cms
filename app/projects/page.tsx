import { Container } from "@/components/container";
import { getAllPosts } from "@/lib/content";
import { FadeIn } from "@/components/fade-in";
import { ContentList } from "@/components/content-list";

export const metadata = {
  title: "Projects",
  description:
    "A collection of my work, from web applications to open-source tools.",
};

export default async function ProjectsPage() {
  const projects = await getAllPosts("projects");

  return (
    <div className="min-h-screen px-6 py-6 lg:px-6 projects_page img_grad_pm pt-12">
      <div className="mx-auto max-w-6xl">
        <FadeIn direction="down" className="mb-12">
          <h1 className="mb-4 text-4xl font-bold mozilla-headline tracking-tight sm:text-5xl lg:text-6xl text-foreground">
            Projects
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed font-google-sans max-w-2xl">
            Technical solutions, innovative tools, and architectural
            explorations. Showcasing a collection of my work in engineering and
            software development.
          </p>
        </FadeIn>

        <ContentList initialPosts={projects} type="projects" />
      </div>
    </div>
  );
}
