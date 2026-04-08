"use client"

import { 
  Cpu, 
  Code2, 
  Layers, 
  Globe, 
  Zap, 
  Settings, 
  ShieldCheck, 
  Database,
  Search,
  PenTool
} from "lucide-react"

const skillCategories = [
  {
    title: "Core Engineering",
    icon: Settings,
    skills: [
      { name: "Mechatronics System Design", level: 90 },
      { name: "Mechanical Kinematics", level: 85 },
      { name: "Control Systems (PID)", level: 88 },
      { name: "Thermodynamics", level: 75 },
    ]
  },
  {
    title: "Software & Digital",
    icon: Code2,
    skills: [
      { name: "Embedded C/C++", level: 92 },
      { name: "Python for Automation", level: 88 },
      { name: "Full-Stack (Next.js/TS)", level: 85 },
      { name: "ROS/ROS2", level: 80 },
    ]
  },
  {
    title: "Hardware & Tools",
    icon: Cpu,
    skills: [
      { name: "PCB Design (Altium/KiCad)", level: 82 },
      { name: "3D Modeling (SolidWorks)", level: 90 },
      { name: "PLC Programming", level: 78 },
      { name: "Rapid Prototyping", level: 95 },
    ]
  },
  {
    title: "Domain Knowledge",
    icon: ShieldCheck,
    skills: [
      { name: "Industrial IoT", level: 88 },
      { name: "Computer Vision", level: 75 },
      { name: "Finite Element Analysis", level: 82 },
      { name: "Agile Methodology", level: 85 },
    ]
  }
]

export default function SkillMatrix() {
  return (
    <div className="grid gap-8 md:grid-cols-2">
      {skillCategories.map((category) => (
        <div key={category.title} className="rounded-2xl border border-border bg-card/50 p-6 backdrop-blur-sm transition-all hover:border-primary/30">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <category.icon className="h-5 w-5" />
            </div>
            <h3 className="font-bold mozilla-headline text-lg">{category.title}</h3>
          </div>
          <div className="space-y-5">
            {category.skills.map((skill) => (
              <div key={skill.name}>
                <div className="mb-2 flex justify-between text-xs font-medium font-google-sans">
                  <span className="text-muted-foreground">{skill.name}</span>
                  <span className="text-primary">{skill.level}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted/50 overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-1000 ease-out"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
