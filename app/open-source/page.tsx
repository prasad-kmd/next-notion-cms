import type { Metadata } from "next";
import {
  Github,
  Star,
  GitFork,
  ExternalLink,
  Code,
  BookOpen,
  MapPin,
  Link as LinkIcon,
  Users,
  UserPlus,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SafeLink } from "@/components/ui/safe-link";
import { getGitHubUser, getGitHubRepos } from "@/lib/github";

const title = "Open Source Projects";
const description =
  "Showcasing my contributions to the open-source community, including README previews and live project documentation.";

export const metadata: Metadata = {
  title,
  description,
};

import { siteConfig } from "@/lib/config";
import { SimpleRepo, SimpleUser } from "@/types/github";

export default async function OpenSourcePage() {
  // Fetch GitHub data
  let user: SimpleUser | null = null;
  let repos: SimpleRepo[] = [];
  let error: string | null = null;

  try {
    [user, repos] = await Promise.all([
      getGitHubUser(),
      getGitHubRepos(6, "updated"),
    ]);
  } catch (err) {
    error = err instanceof Error ? err.message : "Failed to fetch GitHub data";
    console.error("GitHub API Error:", error);
  }

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12">
          <h1 className="mb-4 text-4xl font-bold mozilla-headline flex items-center gap-3">
            <Github className="h-10 w-10" />
            Open Source
          </h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-3xl">
            I believe in sharing knowledge and building tools that help the
            community. Explore my GitHub repositories, contribute to ongoing
            projects, or fork them for your own needs.
          </p>
        </div>

        {/* GitHub Profile Section */}
        {user && (
          <Card className="mb-12 border-border bg-card/50 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                {/* Avatar */}
                <div className="shrink-0">
                  <Image
                    src={user.avatar}
                    alt={user.name}
                    width={120}
                    height={120}
                    className="rounded-full border-2 border-primary/20"
                  />
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <h2 className="text-2xl font-bold google-sans mb-1">
                    {user.name}
                  </h2>
                  <p className="text-muted-foreground mb-3">@{user.username}</p>

                  {user.bio && (
                    <p className="text-sm mb-4 leading-relaxed">{user.bio}</p>
                  )}

                  {/* Location & Website */}
                  <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                    {user.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{user.location}</span>
                      </div>
                    )}
                    {user.website && (
                      <div className="flex items-center gap-1">
                        <LinkIcon className="h-4 w-4" />
                        <SafeLink
                          href={
                            user.website.startsWith("http")
                              ? user.website
                              : `https://${user.website}`
                          }
                          className="hover:text-primary transition-colors"
                        >
                          {user.website.replace(/^https?:\/\//, "")}
                        </SafeLink>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-6 text-sm">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{user.followers}</span>
                      <span className="text-muted-foreground">followers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <UserPlus className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{user.following}</span>
                      <span className="text-muted-foreground">following</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Code className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">{user.publicRepos}</span>
                      <span className="text-muted-foreground">
                        public repos
                      </span>
                    </div>
                  </div>
                </div>

                {/* View Profile Button */}
                <div className="shrink-0">
                  <Button variant="outline" asChild>
                    <SafeLink href={user.profileUrl}>
                      View Profile
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </SafeLink>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Error State */}
        {error && (
          <Card className="mb-12 border-destructive/50 bg-destructive/5">
            <CardContent className="pt-6">
              <p className="text-destructive text-sm">
                <strong>Error loading GitHub data:</strong> {error}
              </p>
              <p className="text-muted-foreground text-xs mt-2">
                Displaying cached or fallback content below.
              </p>
            </CardContent>
          </Card>
        )}

        {/* GitHub Contribution Graph */}
        {user && (
          <Card className="mb-12 border-border bg-card/50 backdrop-blur-sm overflow-hidden">
            <CardHeader>
              <CardTitle className="text-2xl google-sans flex items-center gap-2">
                <Code className="h-6 w-6 text-primary" />
                Contribution Activity
              </CardTitle>
              <CardDescription>
                My GitHub contribution graph for the past year
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center items-center p-4 bg-muted/30 rounded-lg">
                <Image
                  src={`https://ghchart.rshah.org/409ba5/${user.username}`}
                  alt={`${user.name}'s GitHub Contribution Graph`}
                  width={800}
                  height={150}
                  className="w-full h-auto max-w-4xl"
                  unoptimized
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Repositories Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold google-sans mb-6">
            Featured Repositories
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {repos.length > 0 ? (
            repos.map((repo) => (
              <Card
                key={repo.name}
                className="flex flex-col border-border bg-card/50 backdrop-blur-sm transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <Code className="h-5 w-5 text-primary" />
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Star className="h-3 w-3" /> {repo.stars}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="h-3 w-3" /> {repo.forks}
                      </span>
                    </div>
                  </div>
                  <CardTitle className="text-xl google-sans">
                    {repo.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-3">
                    {repo.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                    <span className="text-xs font-medium text-muted-foreground">
                      {repo.language}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <Button
                    variant="outline"
                    className="w-full gap-2 group"
                    asChild
                  >
                    <SafeLink href={repo.url}>
                      View Repository
                      <ExternalLink className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </SafeLink>
                  </Button>
                </CardFooter>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12 text-muted-foreground">
              <Code className="h-12 w-12 mx-auto mb-4 opacity-30" />
              <p>No repositories found or unable to load data.</p>
            </div>
          )}
        </div>

        {/* Contribution CTA */}
        <div className="mt-16 rounded-2xl border border-dashed border-border p-12 text-center bg-muted/20">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-30" />
          <h3 className="text-xl font-bold mb-2">Want to contribute?</h3>
          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
            I'm always looking for collaborators on my mechatronics and software
            projects. Check out the contribution guides in each repository.
          </p>
          <Button variant="default" asChild>
            <SafeLink href={user?.profileUrl || siteConfig.socialLinks.github}>
              Follow me on GitHub
            </SafeLink>
          </Button>
        </div>
      </div>
    </div>
  );
}
