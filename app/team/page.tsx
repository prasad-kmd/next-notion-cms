import type { Metadata } from "next"
import Image from "next/image"
import { Mail, Linkedin, Github } from "lucide-react"

const title = "Our Team"
const description = "Meet the dedicated mechanical and mechatronics engineering students behind this initiative."

export const metadata: Metadata = {
  title,
  description,
  openGraph: {
    title,
    description,
    url: "/team",
    images: [
      {
        url: `/api/og?title=${encodeURIComponent(title)}`,
        width: 1200,
        height: 630,
        alt: description,
      },
    ],
  },
}

const teamMembers = [
  {
    name: "Ashan Perera",
    role: "Team Lead - Mechatronics Engineering",
    image: "https://placehold.co/400x400/1e293b/14b8a6?text=AP",
    bio: "Specializing in automation systems and robotics. Passionate about IoT solutions for agricultural applications.",
    email: "ashan.perera@example.lk",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Nimal Fernando",
    role: "Mechanical Engineering",
    image: "https://placehold.co/400x400/1e293b/14b8a6?text=NF",
    bio: "Focused on mechanical design and manufacturing processes. Interested in sustainable engineering solutions.",
    email: "nimal.fernando@example.lk",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Sanduni Silva",
    role: "Mechatronics Engineering",
    image: "https://placehold.co/400x400/1e293b/14b8a6?text=SS",
    bio: "Expert in embedded systems and control theory. Working on smart sensor integration for industrial applications.",
    email: "sanduni.silva@example.lk",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Kasun Rajapaksa",
    role: "Mechanical Engineering",
    image: "https://placehold.co/400x400/1e293b/14b8a6?text=KR",
    bio: "Specializing in thermodynamics and energy systems. Passionate about renewable energy solutions for Sri Lanka.",
    email: "kasun.rajapaksa@example.lk",
    linkedin: "#",
    github: "#",
  },
  {
    name: "Dilini Wickramasinghe",
    role: "Mechatronics Engineering",
    image: "https://placehold.co/400x400/1e293b/14b8a6?text=DW",
    bio: "Focused on machine learning and computer vision applications in industrial automation and quality control.",
    email: "dilini.wickramasinghe@example.lk",
    linkedin: "#",
    github: "#",
  },
]

export default function TeamPage() {
  return (
    <div className="min-h-screen py-20 px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold philosopher lg:text-5xl mb-4">Meet Our Team</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A diverse group of mechanical and mechatronics engineering students bringing together different
            perspectives, skills, and experiences to tackle complex problems.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {teamMembers.map((member) => (
            <div
              key={member.name}
              className="group flex flex-col rounded-2xl border border-border bg-card p-6 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
            >
              <div className="relative mb-6 aspect-square overflow-hidden rounded-xl bg-muted">
                <Image
                  src={member.image || "/placeholder.svg"}
                  alt={member.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <h3 className="text-xl font-bold">{member.name}</h3>
              <p className="mt-1 text-sm font-medium text-primary uppercase tracking-wider">{member.role}</p>
              <p className="mt-4 text-muted-foreground leading-relaxed">{member.bio}</p>

              <div className="mt-8 flex gap-3 pt-4 border-t border-border/50">
                <a
                  href={`mailto:${member.email}`}
                  className="rounded-full bg-muted p-2.5 transition-all hover:bg-primary hover:text-primary-foreground"
                  aria-label="Email"
                >
                  <Mail className="h-5 w-5" />
                </a>
                <a
                  href={member.linkedin}
                  className="rounded-full bg-muted p-2.5 transition-all hover:bg-primary hover:text-primary-foreground"
                  aria-label="LinkedIn"
                >
                  <Linkedin className="h-5 w-5" />
                </a>
                <a
                  href={member.github}
                  className="rounded-full bg-muted p-2.5 transition-all hover:bg-primary hover:text-primary-foreground"
                  aria-label="GitHub"
                >
                  <Github className="h-5 w-5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
