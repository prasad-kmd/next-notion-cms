import React from "react"
import { CheckCircle2, Circle, Clock } from "lucide-react"

interface Milestone {
  title: string
  description: string
  date: string
  status: "completed" | "in-progress" | "planned"
}

const milestones: Milestone[] = [
  {
    title: "Project Initiation & Research",
    description: "Literature review, identifying real-world challenges in Sri Lanka, and initial team formation.",
    date: "Semester 1 - Week 1-4",
    status: "completed",
  },
  {
    title: "Problem Definition & Conceptual Design",
    description: "Selecting a specific problem, brainstorming solutions, and developing the 'Big Idea'.",
    date: "Semester 1 - Week 5-10",
    status: "completed",
  },
  {
    title: "Web Platform Development",
    description: "Developing this documentation platform using Next.js 15, Tailwind CSS, and KaTeX.",
    date: "Ongoing",
    status: "completed",
  },
  {
    title: "Prototyping & Simulations",
    description: "Developing CAD models, performing FEA analysis, and initial prototyping of mechanical systems.",
    date: "Semester 2 - Q1",
    status: "in-progress",
  },
  {
    title: "Mechatronics Integration",
    description: "Integrating sensors, actuators, and control systems with the mechanical hardware.",
    date: "Semester 2 - Q2",
    status: "planned",
  },
  {
    title: "Testing & Validation",
    description: "Comprehensive testing of the integrated system and validation against project requirements.",
    date: "Semester 2 - Q3",
    status: "planned",
  },
  {
    title: "Final Presentation & Documentation",
    description: "Submission of the final project report and presentation to the faculty board.",
    date: "Semester 2 - Q4",
    status: "planned",
  },
]

export default function Roadmap() {
  return (
    <div className="space-y-8">
      {milestones.map((milestone, index) => (
        <div key={index} className="relative flex gap-6 pb-8 last:pb-0">
          {/* Vertical Line */}
          {index !== milestones.length - 1 && (
            <div className="absolute left-[11px] top-6 h-full w-[2px] bg-border" />
          )}
          
          <div className="relative z-10 mt-1">
            {milestone.status === "completed" ? (
              <CheckCircle2 className="h-6 w-6 text-primary bg-background" />
            ) : milestone.status === "in-progress" ? (
              <Clock className="h-6 w-6 text-blue-500 bg-background animate-pulse" />
            ) : (
              <Circle className="h-6 w-6 text-muted-foreground bg-background" />
            )}
          </div>
          
          <div className="flex flex-col">
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-foreground">{milestone.title}</h3>
              <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                milestone.status === "completed" 
                  ? "bg-primary/10 text-primary border-primary/20" 
                  : milestone.status === "in-progress"
                  ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                  : "bg-muted text-muted-foreground border-border"
              }`}>
                {milestone.status.replace("-", " ")}
              </span>
            </div>
            <span className="text-xs font-semibold text-primary/70 mb-2">{milestone.date}</span>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {milestone.description}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}
