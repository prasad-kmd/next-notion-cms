"use client"

import React, { useState, useRef } from "react"
import Image from "next/image"
import {
    Briefcase, GraduationCap, Code2, Award, User, Mail, Phone, MapPin,
    Globe, Download, Trash2, Plus, ChevronLeft, Layout, AlertTriangle, Github, Linkedin, ExternalLink,
    Camera, X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"
import Link from "next/link"
import { usePersistentState } from "@/hooks/use-persistent-state"
import { AIContentIndicator } from "@/components/ai-content-indicator"

interface Experience {
    company: string
    role: string
    period: string
    description: string
}

interface Education {
    school: string
    degree: string
    period: string
    grade: string
}

interface Project {
    name: string
    description: string
    link: string
}

interface ResumeData {
    name: string
    role: string
    email: string
    phone: string
    location: string
    website: string
    linkedin: string
    github: string
    image: string | null
    summary: string
    experiences: Experience[]
    education: Education[]
    skills: string[]
    certifications: string[]
    projects: Project[]
}

const initialResume: ResumeData = {
    name: "John Doe",
    role: "Full Stack Engineer",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    location: "San Francisco, CA",
    website: "johndoe.com",
    linkedin: "linkedin.com/in/johndoe",
    github: "github.com/johndoe",
    image: null,
    summary: "Dedicated software engineer with 5+ years of experience building scalable web applications. Passionate about clean code, architecture, and mentoring teams.",
    experiences: [
        {
            company: "Tech Solutions Inc.",
            role: "Senior Software Engineer",
            period: "2021 - Present",
            description: "Leading the development of a cloud-native microservices architecture. Reduced system latency by 40% using Redis and Go."
        }
    ],
    education: [
        {
            school: "University of Technology",
            degree: "B.S. in Computer Science",
            period: "2015 - 2019",
            grade: "3.9 GPA"
        }
    ],
    skills: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL", "AWS", "Docker"],
    certifications: ["AWS Certified Developer", "Google Cloud Professional"],
    projects: [
        {
            name: "E-commerce Platform",
            description: "Built a headless commerce solution using Next.js and Shopify API.",
            link: "https://shop.example.com"
        }
    ]
}

export default function ResumeCreator() {
    const [resume, setResume] = usePersistentState<ResumeData>("resume-data", initialResume)
    const [isExporting, setIsExporting] = useState(false)
    const resumeRef = useRef<HTMLDivElement>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const updateField = (field: keyof ResumeData, value: string | Experience[] | Education[] | Project[] | string[] | null) => {
        setResume(prev => ({ ...prev, [field]: value }))
    }

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                toast.error("Image size must be less than 2MB")
                return
            }
            const reader = new FileReader()
            reader.onload = (event) => {
                updateField("image", event.target?.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const removeImage = () => {
        updateField("image", null)
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const addItem = (field: "experiences" | "education" | "projects" | "skills" | "certifications") => {
        const newItem = {
            experiences: { company: "", role: "", period: "", description: "" },
            education: { school: "", degree: "", period: "", grade: "" },
            projects: { name: "", description: "", link: "" },
            skills: "",
            certifications: ""
        }[field]
        setResume(prev => ({ ...prev, [field]: [...prev[field], newItem] }))
    }

    const removeItem = (field: "experiences" | "education" | "projects" | "skills" | "certifications", index: number) => {
        setResume(prev => ({ ...prev, [field]: prev[field].filter((_, i) => i !== index) }))
    }

    const updateListItem = (field: "experiences" | "education" | "projects", index: number, subfield: string, value: string) => {
        const newList = [...resume[field]]
        newList[index] = { ...newList[index], [subfield]: value }
        setResume(prev => ({ ...prev, [field]: newList }))
    }

    const updateStringList = (field: "skills" | "certifications", index: number, value: string) => {
        const newList = [...resume[field]]
        newList[index] = value
        setResume(prev => ({ ...prev, [field]: newList }))
    }

    const handleExport = async () => {
        if (!resumeRef.current) return
        setIsExporting(true)
        const toastId = toast.loading("Generating Professional PDF...")

        try {
            const element = resumeRef.current
            const canvas = await html2canvas(element, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                logging: false,
                windowWidth: 794,
                onclone: (clonedDoc) => {
                    clonedDoc.body.style.margin = "0"
                    clonedDoc.body.style.padding = "0"
                    clonedDoc.body.style.width = "794px"
                    const el = clonedDoc.getElementById("resume-preview-card")
                    if (el) {
                        el.style.position = "static"
                        el.style.top = "0"
                        el.style.boxShadow = "none"
                        el.style.width = "794px"
                        el.style.minWidth = "794px"
                        el.style.maxWidth = "794px"
                        el.style.minHeight = "auto"
                        el.style.height = "auto"
                        el.style.transform = "none"
                        el.style.overflow = "visible"
                        el.style.margin = "0"
                    }
                }
            })

            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF('p', 'mm', 'a4')

            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()

            // Calculate height in mm to maintain aspect ratio
            const imgWidth = pageWidth
            const imgHeight = (canvas.height * pageWidth) / canvas.width

            let heightLeft = imgHeight
            let position = 0

            // Page 1
            pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
            heightLeft -= pageHeight

            // Subsequent pages if content overflows
            while (heightLeft > 0) {
                position = heightLeft - imgHeight
                pdf.addPage()
                pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
                heightLeft -= pageHeight
            }

            pdf.save(`${resume.name.replace(/\s+/g, "_")}_Resume.pdf`)
            toast.success("Resume exported successfully", { id: toastId })
        } catch (error) {
            console.error("Export error:", error)
            toast.error("Failed to export resume", { id: toastId })
        } finally {
            setIsExporting(false)
        }
    }

    return (
        <div className="min-h-screen pb-20 px-6 lg:px-8 pt-12 bg-background">
            <div className="mx-auto max-w-7xl">
                <Link href="/tools" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-6 print:hidden">
                    <ChevronLeft className="h-4 w-4" />
                    Back to Workspace
                </Link>

                <header className="mb-12 text-center print:hidden">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
                        <Layout className="h-3 w-3" />
                        Professional Tools
                    </div>
                    <h1 className="text-4xl font-bold tracking-tight lg:text-5xl mb-4 font-serif">Resume Architect</h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                        Craft a high-impact, professional resume with real-time preview and precision PDF export.
                    </p>
                </header>

                {/* Mobile Warning */}
                <div className="lg:hidden p-6 bg-amber-500/10 border border-amber-500/20 rounded-xl mb-8 print:hidden">
                    <p className="text-amber-500 font-bold flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Desktop Recommended
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                        This tool is optimized for large screens to ensure pixel-perfect layout and professional PDF generation. Please use a desktop for the best experience.
                    </p>
                </div>

                <div className="grid gap-8 lg:grid-cols-2">
                    {/* Editor */}
                    <div className="space-y-8 print:hidden">
                        {/* Personal Info */}
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader>
                                <CardTitle className="text-xl flex items-center gap-2 font-sans">
                                    <User className="h-5 w-5 text-primary" /> Personal Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="mb-6">
                                    <Label className="block mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Profile Photo</Label>
                                    <div className="flex items-center gap-4">
                                        <div
                                            className="relative h-20 w-20 rounded-xl bg-muted border-2 border-dashed border-border flex items-center justify-center overflow-hidden cursor-pointer hover:bg-muted/80 transition-colors"
                                            onClick={() => fileInputRef.current?.click()}
                                        >
                                            {resume.image ? (
                                                <Image src={resume.image} alt="Profile" className="h-full w-full object-cover" width={80} height={80} unoptimized />
                                            ) : (
                                                <Camera className="h-8 w-8 text-muted-foreground" />
                                            )}
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                                {resume.image ? "Change Photo" : "Upload Photo"}
                                            </Button>
                                            {resume.image && (
                                                <Button variant="ghost" size="sm" className="text-destructive flex items-center gap-1" onClick={removeImage}>
                                                    <X className="h-3 w-3" /> Remove
                                                </Button>
                                            )}
                                            <p className="text-[10px] text-muted-foreground">JPG, PNG (max 2MB)</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label>Full Name</Label>
                                        <Input value={resume.name} onChange={(e) => updateField("name", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Professional Title</Label>
                                        <Input value={resume.role} onChange={(e) => updateField("role", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Email</Label>
                                        <Input value={resume.email} onChange={(e) => updateField("email", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Phone</Label>
                                        <Input value={resume.phone} onChange={(e) => updateField("phone", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Location</Label>
                                        <Input value={resume.location} onChange={(e) => updateField("location", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Website</Label>
                                        <Input value={resume.website} onChange={(e) => updateField("website", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>LinkedIn</Label>
                                        <Input value={resume.linkedin} onChange={(e) => updateField("linkedin", e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>GitHub</Label>
                                        <Input value={resume.github} onChange={(e) => updateField("github", e.target.value)} />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label>Professional Summary</Label>
                                    <Textarea value={resume.summary} onChange={(e) => updateField("summary", e.target.value)} rows={4} />
                                </div>
                            </CardContent>
                        </Card>

                        {/* Experience */}
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-xl flex items-center gap-2 font-sans">
                                    <Briefcase className="h-5 w-5 text-blue-500" /> Work Experience
                                </CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => addItem("experiences")}>
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {resume.experiences.map((exp, idx) => (
                                    <div key={idx} className="space-y-4 p-4 rounded-lg bg-muted/30 relative group">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeItem("experiences", idx)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <Input placeholder="Company" value={exp.company} onChange={(e) => updateListItem("experiences", idx, "company", e.target.value)} />
                                            <Input placeholder="Role" value={exp.role} onChange={(e) => updateListItem("experiences", idx, "role", e.target.value)} />
                                            <Input placeholder="Period (e.g. 2021 - Present)" value={exp.period} onChange={(e) => updateListItem("experiences", idx, "period", e.target.value)} />
                                        </div>
                                        <Textarea placeholder="Description..." value={exp.description} onChange={(e) => updateListItem("experiences", idx, "description", e.target.value)} />
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Education */}
                        <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle className="text-xl flex items-center gap-2 font-sans">
                                    <GraduationCap className="h-5 w-5 text-green-500" /> Education
                                </CardTitle>
                                <Button variant="ghost" size="sm" onClick={() => addItem("education")}>
                                    <Plus className="h-4 w-4 mr-1" /> Add
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                {resume.education.map((edu, idx) => (
                                    <div key={idx} className="space-y-4 p-4 rounded-lg bg-muted/30 relative group">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="absolute top-2 right-2 text-muted-foreground hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={() => removeItem("education", idx)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <Input placeholder="School/University" value={edu.school} onChange={(e) => updateListItem("education", idx, "school", e.target.value)} />
                                            <Input placeholder="Degree" value={edu.degree} onChange={(e) => updateListItem("education", idx, "degree", e.target.value)} />
                                            <Input placeholder="Period" value={edu.period} onChange={(e) => updateListItem("education", idx, "period", e.target.value)} />
                                            <Input placeholder="Grade/GPA" value={edu.grade} onChange={(e) => updateListItem("education", idx, "grade", e.target.value)} />
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Skills & Certs */}
                        <div className="grid gap-8 sm:grid-cols-2">
                            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2 font-sans">
                                        <Code2 className="h-4 w-4 text-purple-500" /> Skills
                                    </CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => addItem("skills")}>
                                        <Plus className="h-3 w-3 mr-1" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {resume.skills.map((skill, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input value={skill} onChange={(e) => updateStringList("skills", idx, e.target.value)} />
                                            <Button variant="ghost" size="icon" onClick={() => removeItem("skills", idx)}>
                                                <Trash2 className="h-3 w-3 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg flex items-center gap-2 font-sans">
                                        <Award className="h-4 w-4 text-orange-500" /> Certifications
                                    </CardTitle>
                                    <Button variant="ghost" size="sm" onClick={() => addItem("certifications")}>
                                        <Plus className="h-3 w-3 mr-1" />
                                    </Button>
                                </CardHeader>
                                <CardContent className="space-y-2">
                                    {resume.certifications.map((cert, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <Input value={cert} onChange={(e) => updateStringList("certifications", idx, e.target.value)} />
                                            <Button variant="ghost" size="icon" onClick={() => removeItem("certifications", idx)}>
                                                <Trash2 className="h-3 w-3 text-muted-foreground" />
                                            </Button>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </div>

                        <div className="flex justify-center">
                            <Button size="lg" className="rounded-full px-12 font-bold shadow-lg shadow-primary/20" onClick={handleExport} disabled={isExporting}>
                                <Download className="mr-2 h-5 w-5" />
                                {isExporting ? "Rendering PDF..." : "Export Resume (PDF)"}
                            </Button>
                        </div>
                    </div>

                    {/* Preview */}
                    <div className="relative">
                        <div ref={resumeRef} className="print:block print:static">
                            <Card
                                id="resume-preview-card"
                                className="sticky top-24 min-h-[1123px] w-full shadow-2xl border-none"
                                style={{ backgroundColor: "#ffffff", color: "#09090b", width: "100%", maxWidth: "794px", margin: "0 auto", overflowX: "hidden" }}
                            >
                                {/* Header with Profile Picture */}
                                <div className="h-40 flex items-end px-10 pb-6" style={{ background: "linear-gradient(to right, #0f172a, #1e293b, #0f172a)" }}>
                                    <div className="h-32 w-32 rounded-2xl flex items-center justify-center -mb-16 overflow-hidden shadow-xl" style={{ backgroundColor: "#ffffff", border: "4px solid #ffffff" }}>
                                        {resume.image ? (
                                            <Image src={resume.image} alt={resume.name} className="h-full w-full object-cover" width={128} height={128} unoptimized />
                                        ) : (
                                            <User className="h-16 w-16" style={{ color: "#3b82f6" }} />
                                        )}
                                    </div>
                                    <div className="ml-8 mb-[-10px] text-white overflow-hidden">
                                        <h2 className="text-4xl font-bold font-serif uppercase tracking-tight leading-none mb-2 break-words">{resume.name}</h2>
                                        <p className="text-xl font-semibold font-sans break-words" style={{ color: "#3b82f6" }}>{resume.role}</p>
                                    </div>
                                </div>

                                <div className="px-10 pt-20 pb-10">
                                    <div className="grid grid-cols-2 gap-y-3 mb-10 text-xs font-medium uppercase tracking-wider p-4 rounded-xl overflow-hidden" style={{ backgroundColor: "#f8fafc", color: "#475569" }}>
                                        <div className="flex items-center gap-2 overflow-hidden"><Mail className="h-3.5 w-3.5 shrink-0" style={{ color: "#3b82f6" }} /> <span className="break-all">{resume.email}</span></div>
                                        <div className="flex items-center gap-2 overflow-hidden"><Phone className="h-3.5 w-3.5 shrink-0" style={{ color: "#3b82f6" }} /> <span className="break-all">{resume.phone}</span></div>
                                        <div className="flex items-center gap-2 overflow-hidden"><MapPin className="h-3.5 w-3.5 shrink-0" style={{ color: "#3b82f6" }} /> <span className="break-words">{resume.location}</span></div>
                                        {resume.website && <div className="flex items-center gap-2 overflow-hidden"><Globe className="h-3.5 w-3.5 shrink-0" style={{ color: "#3b82f6" }} /> <span className="break-all">{resume.website}</span></div>}
                                        {resume.linkedin && <div className="flex items-center gap-2 overflow-hidden"><Linkedin className="h-3.5 w-3.5 shrink-0" style={{ color: "#3b82f6" }} /> <span className="break-all">{resume.linkedin}</span></div>}
                                        {resume.github && <div className="flex items-center gap-2 overflow-hidden"><Github className="h-3.5 w-3.5 shrink-0" style={{ color: "#3b82f6" }} /> <span className="break-all">{resume.github}</span></div>}
                                    </div>

                                    <div className="grid gap-10">
                                        {/* Summary */}
                                        {resume.summary && (
                                            <section>
                                                <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 font-sans pb-1 border-b" style={{ color: "rgba(59, 130, 246, 0.7)", borderColor: "#e2e8f0" }}>Professional Summary</h3>
                                                <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{resume.summary}</p>
                                            </section>
                                        )}

                                        {/* Experience */}
                                        <section>
                                            <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 font-sans pb-1 border-b" style={{ color: "rgba(59, 130, 246, 0.7)", borderColor: "#e2e8f0" }}>Work Experience</h3>
                                            <div className="space-y-8">
                                                {resume.experiences.map((exp, i) => (
                                                    <div key={i} className="relative pl-6">
                                                        <div className="absolute left-0 top-1.5 h-2 w-2 rounded-full" style={{ backgroundColor: "#3b82f6" }} />
                                                        <div className="flex justify-between items-start mb-1 gap-4">
                                                            <h4 className="font-bold text-lg flex-1 break-words" style={{ color: "#1e293b" }}>{exp.role}</h4>
                                                            <span className="text-[10px] font-bold px-2 py-1 rounded-md shrink-0" style={{ backgroundColor: "#eff6ff", color: "#3b82f6" }}>{exp.period}</span>
                                                        </div>
                                                        <p className="text-sm font-bold mb-2 break-words" style={{ color: "#3b82f6" }}>{exp.company}</p>
                                                        <p className="text-sm leading-relaxed" style={{ color: "#475569" }}>{exp.description}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </section>

                                        <div className="grid grid-cols-3 gap-10">
                                            <div className="col-span-2 space-y-10">
                                                {/* Education */}
                                                <section>
                                                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 font-sans pb-1 border-b" style={{ color: "rgba(34, 197, 94, 0.7)", borderColor: "#e2e8f0" }}>Education</h3>
                                                    <div className="space-y-6">
                                                        {resume.education.map((edu, i) => (
                                                            <div key={i}>
                                                                <div className="flex justify-between items-start mb-1 gap-4">
                                                                    <h4 className="font-bold text-lg flex-1 break-words" style={{ color: "#1e293b" }}>{edu.degree}</h4>
                                                                    <span className="text-[10px] font-bold shrink-0" style={{ color: "#94a3b8" }}>{edu.period}</span>
                                                                </div>
                                                                <p className="text-sm font-medium break-words" style={{ color: "#475569" }}>{edu.school}</p>
                                                                <p className="text-xs mt-1 font-bold" style={{ color: "#22c55e" }}>{edu.grade}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>

                                                {/* Projects */}
                                                <section>
                                                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-6 font-sans pb-1 border-b" style={{ color: "rgba(168, 85, 247, 0.7)", borderColor: "#e2e8f0" }}>Key Projects</h3>
                                                    <div className="space-y-4">
                                                        {resume.projects.map((p, i) => (
                                                            <div key={i} className="p-4 rounded-xl border border-dashed overflow-hidden" style={{ backgroundColor: "#fafafa", borderColor: "#e5e5e5" }}>
                                                                <div className="flex justify-between items-center mb-1 gap-2">
                                                                    <h4 className="text-sm font-bold flex-1 break-words" style={{ color: "#1e293b" }}>{p.name}</h4>
                                                                    {p.link && <ExternalLink className="h-3 w-3 shrink-0" style={{ color: "#94a3b8" }} />}
                                                                </div>
                                                                <p className="text-xs" style={{ color: "#475569" }}>{p.description}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            </div>

                                            <div className="space-y-10">
                                                {/* Skills */}
                                                <section>
                                                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 font-sans pb-1 border-b" style={{ color: "rgba(249, 115, 22, 0.7)", borderColor: "#e2e8f0" }}>Technical Skills</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {resume.skills.map((s, i) => (
                                                            <span key={i} className="px-2 py-1 rounded text-[10px] font-bold border" style={{ backgroundColor: "#fff7ed", color: "#f97316", borderColor: "#ffedd5" }}>{s}</span>
                                                        ))}
                                                    </div>
                                                </section>

                                                {/* Certifications */}
                                                <section>
                                                    <h3 className="text-sm font-bold uppercase tracking-[0.2em] mb-4 font-sans pb-1 border-b" style={{ color: "rgba(14, 165, 233, 0.7)", borderColor: "#e2e8f0" }}>Certifications</h3>
                                                    <div className="space-y-3">
                                                        {resume.certifications.map((c, i) => (
                                                            <div key={i} className="flex gap-2 items-start p-2 rounded-lg" style={{ backgroundColor: "#f0f9ff" }}>
                                                                <Award className="h-3.5 w-3.5 mt-0.5 shrink-0" style={{ color: "#0ea5e9" }} />
                                                                <span className="text-[10px] font-bold leading-tight" style={{ color: "#0369a1" }}>{c}</span>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </section>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="px-10 py-6 flex justify-between items-center text-[10px] font-mono border-t" style={{ backgroundColor: "#f8fafc", borderColor: "#e2e8f0", color: "#94a3b8" }}>
                                    <span>RESUME ARCHITECT BY PM-ENGINEER TOOLS</span>
                                    <span>© {new Date().getFullYear()}</span>
                                </div>
                                <div className="h-1.5 w-full" style={{ background: "linear-gradient(to right, #3b82f6, #22c55e, #a855f7, #f97316)" }} />
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <AIContentIndicator />
        </div>
    )
}
