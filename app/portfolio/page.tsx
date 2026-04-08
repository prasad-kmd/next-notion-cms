import type { Metadata } from "next";
import Image from "next/image";
import {
  ExternalLink,
  Briefcase,
  GraduationCap,
  Award,
  Dna,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getContentByType } from "@/lib/content";
import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { PortfolioHeroActions } from "@/components/portfolio-hero-actions";
import SkillMatrix from "@/components/skill-matrix";

const title = "Portfolio | PrasadM";
const description =
  "Showcasing the professional journey, technical expertise, and engineering projects of PrasadM, a Mechatronics and Mechanical Engineering undergraduate.";

export const metadata: Metadata = {
  title,
  description,
};

export default function PortfolioPage() {
  const dynamicProjects = getContentByType("projects");
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-card/30 py-24 lg:py-32">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_45%_at_50%_50%,var(--primary)_0%,transparent_100%)] opacity-[0.03]" />
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex flex-col items-center gap-12 lg:flex-row lg:items-start">
            <div className="relative h-64 w-64 shrink-0 overflow-hidden rounded-2xl border-4 border-primary/20 shadow-2xl lg:h-80 lg:w-80">
              <Image
                src="https://placehold.co/800x800/1e293b/14b8a6?text=Profile+Photo"
                alt="Profile Photo"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-bold tracking-tight sm:text-6xl amoriaregular">
                Prasad<span className="text-primary">M</span>
              </h1>
              <p className="mt-4 text-xl font-medium text-muted-foreground philosopher">
                Mechatronics & Mechanical Engineering Undergraduate
              </p>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground font-google-sans">
                Passionate about bridging the gap between hardware and software.
                I specialize in developing intelligent systems that solve
                real-world engineering challenges through innovative design and
                robust implementation.
              </p>
              <PortfolioHeroActions />
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="mx-auto max-w-7xl px-6 py-20 lg:px-8">
        {/* Advanced Skill Matrix */}
        <section className="mb-24">
          <div className="mb-12 flex flex-col items-center text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-primary font-local-jetbrains-mono">
              <Dna className="h-4 w-4" />
              Competency Framework
            </div>
            <h2 className="text-3xl font-bold mozilla-headline sm:text-4xl">
              Technical Expertise Matrix
            </h2>
            <p className="mt-4 max-w-2xl text-muted-foreground font-google-sans">
              A comprehensive overview of my engineering competencies across
              hardware, software, and interdisciplinary domains.
            </p>
          </div>
          <SkillMatrix />
        </section>

        <div className="grid gap-16 lg:grid-cols-3">
          {/* Left Column: Experience & Education */}
          <div className="lg:col-span-2 space-y-16">
            {/* Featured Projects */}
            <section>
              <div className="mb-8 flex items-center gap-3 border-b border-border pb-4">
                <Briefcase className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold mozilla-headline">
                  Featured Engineering Projects
                </h2>
              </div>
              <div className="grid gap-8 sm:grid-cols-2">
                {dynamicProjects.map((project) => (
                  <ContentCard
                    key={project.slug}
                    post={project}
                    basePath="/projects"
                  />
                ))}
              </div>
            </section>

            {/* Experience */}
            <section>
              <div className="mb-8 flex items-center gap-3 border-b border-border pb-4">
                <Award className="h-6 w-6 text-primary" />
                <h2 className="text-2xl font-bold mozilla-headline">
                  Professional Milestones
                </h2>
              </div>
              <div className="space-y-8 font-google-sans">
                <div className="relative pl-8 border-l-2 border-primary/20">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-primary shadow-[0_0_10px_var(--primary)]" />
                  <span className="text-sm font-bold text-primary">
                    2023 - Present
                  </span>
                  <h3 className="text-lg font-bold mt-1">
                    Senior Systems Engineer
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Industrial Automation Solutions Inc.
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Leading a team of 5 engineers in designing next-generation
                    PLC controllers and integrating cloud-based predictive
                    maintenance systems.
                  </p>
                </div>
                <div className="relative pl-8 border-l-2 border-primary/20">
                  <div className="absolute -left-[9px] top-0 h-4 w-4 rounded-full bg-border" />
                  <span className="text-sm font-bold text-muted-foreground">
                    2020 - 2023
                  </span>
                  <h3 className="text-lg font-bold mt-1">
                    Mechatronics Designer
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    Robotics Innovation Lab
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    Developed kinematics algorithms for 6-DOF robotic arms and
                    implemented computer vision systems for autonomous sorting.
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Right Column: Info & Interests */}
          <div className="space-y-12">
            {/* Education */}
            <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <GraduationCap className="h-5 w-5 text-primary" />
                <h3 className="text-xl font-bold font-mozilla-headline">
                  Education
                </h3>
              </div>
              <div className="space-y-6 text-sm font-google-sans">
                <div>
                  <p className="font-bold">
                    BSc (Hons) in Mechatronics Engineering
                  </p>
                  <p className="text-muted-foreground">
                    The Open University of Sri Lanka
                  </p>
                  <p className="text-xs text-primary mt-1 font-medium">
                    First Class Honours
                  </p>
                </div>
                <hr className="border-border/50" />
                <div>
                  <p className="font-bold">
                    Advanced Diploma in Industrial Electronics
                  </p>
                  <p className="text-muted-foreground">
                    Ceylon-German Technical Training Institute
                  </p>
                </div>
              </div>
            </section>

            {/* Research Interests */}
            <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-4 font-mozilla-headline">
                Research Interests
              </h3>
              <div className="space-y-3 font-google-sans">
                {[
                  "Bio-Inspired Robotics",
                  "Autonomous Navigation",
                  "Renewable Energy Systems",
                  "Smart Materials",
                ].map((interest) => (
                  <div
                    key={interest}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {interest}
                  </div>
                ))}
              </div>
            </section>

            {/* Languages */}
            <section className="rounded-2xl border border-border bg-card p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-4 font-mozilla-headline">
                Languages
              </h3>
              <div className="flex flex-wrap gap-2 text-xs font-google-sans">
                <span className="px-3 py-1 bg-muted rounded-full">
                  English (Professional)
                </span>
                <span className="px-3 py-1 bg-muted rounded-full">
                  Sinhala (Native)
                </span>
                <span className="px-3 py-1 bg-muted rounded-full">
                  German (Basic)
                </span>
              </div>
            </section>
          </div>
        </div>
      </div>

      {/* Footer Call to Action */}
      <section className="bg-primary/5 py-16 text-center border-t border-border">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="text-3xl font-bold amoriaregular mb-4">
            Let&apos;s Build Something Together
          </h2>
          <p className="text-muted-foreground font-google-sans mb-8 leading-relaxed">
            I am always open to discussing new projects, creative ideas or
            opportunities to be part of your visions.
          </p>
          <Button
            size="lg"
            className="font-space-mono rounded-full px-12 transition-transform hover:scale-105"
          >
            Get In Touch
          </Button>
        </div>
      </section>
    </div>
  );
}
