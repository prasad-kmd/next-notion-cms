import type { Metadata } from "next"
import Link from "next/link"
import {
    Edit3, Calculator, Replace, Code2, Sigma, ArrowRight, Scaling, Braces,
    Terminal, FileCode, Split, Users, Zap, Cpu, Timer, Lightbulb, Activity,
    Settings, Waypoints, Settings2, Wrench, MoveUpRight, Battery, LineChart, Ruler,
    Database, Rocket, Gamepad2, Rss, FlaskConical, Layout, Library, Search, Grid3X3, Compass, Palette,
    GraduationCap, FileArchive
} from "lucide-react"
import { AIContentIndicator } from "@/components/ai-content-indicator";

interface Tool {
    name: string
    slug: string
    description: string
    icon: React.ElementType
    color: string
    bgColor: string
    isNew?: boolean
}

const title = "Tools | Engineering Workspace"
const description = "Professional-grade utilities for technical documentation, advanced calculations, and structured content development."

export const metadata: Metadata = {
    title,
    description,
    openGraph: {
        title,
        description,
        url: "/tools",
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
}

const electronicsTools = [
    {
        name: "PCB Impedance Calculator",
        slug: "pcb-impedance-calculator",
        description: "Calculate microstrip and stripline characteristic impedance for high-speed PCB design.",
        icon: Zap,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
    },
    {
        name: "Voltage Divider Designer",
        slug: "voltage-divider-designer",
        description: "Find the best standard resistor values (E12/E24) for your desired output voltage.",
        icon: Search,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        name: "Resistor Color Code Solver",
        slug: "resistor-color-code",
        description: "Interactive visual calculator for 4, 5, and 6-band resistors with real-time value decoding.",
        icon: Zap,
        color: "text-amber-500",
        bgColor: "bg-amber-500/10",
    },
    {
        name: "PCB Trace Width Calculator",
        slug: "pcb-trace-width",
        description: "Calculate required trace width based on IPC-2221 standards for specific current and temperature rise.",
        icon: Cpu,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
    },
    {
        name: "555 Timer Calculator",
        slug: "555-timer-calculator",
        description: "Design Astable and Monostable 555 timer circuits by calculating component values for desired timing.",
        icon: Timer,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        name: "LED Series Resistor",
        slug: "led-resistor-calculator",
        description: "Determine the ideal current-limiting resistor for your LED circuits to ensure optimal performance.",
        icon: Lightbulb,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
    },
    {
        name: "Op-Amp Gain Calculator",
        slug: "op-amp-gain-calculator",
        description: "Visual gain calculator for Inverting and Non-Inverting operational amplifier configurations.",
        icon: Activity,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
    },
]

const mechanicalTools = [
    {
        name: "Moment of Inertia",
        slug: "moment-of-inertia-calculator",
        description: "Compute Ixx and Iyy for standard cross-sections like I-beams, rectangles, and circles.",
        icon: Waypoints,
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
    },
    {
        name: "ISO Fits & Tolerances",
        slug: "iso-fits-tolerances",
        description: "Standardized fit calculator for shafts and holes based on ISO 286 diameter and tolerance classes.",
        icon: Settings,
        color: "text-slate-500",
        bgColor: "bg-slate-500/10",
    },
    {
        name: "Beam Deflection Calculator",
        slug: "beam-deflection-calculator",
        description: "Analyze maximum deflection and stress for Cantilever and Simply Supported beam load cases.",
        icon: Waypoints,
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
    },
    {
        name: "Gear Ratio & Speed",
        slug: "gear-ratio-calculator",
        description: "Calculate output speed and torque for gear trains or belt drives based on driver/driven parameters.",
        icon: Settings2,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
    },
    {
        name: "Bolt Torque Chart",
        slug: "bolt-torque-chart",
        description: "Interactive reference for metric bolt torque specifications across different property classes.",
        icon: Wrench,
        color: "text-zinc-500",
        bgColor: "bg-zinc-500/10",
    },
    {
        name: "Material Property Database",
        slug: "material-database",
        description: "High-fidelity technical specifications for common engineering materials.",
        icon: Database,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
]

const mechatronicsTools = [
    {
        name: "PWM to Voltage Converter",
        slug: "pwm-voltage-converter",
        description: "Convert duty cycle to average voltage for microcontroller and signal processing projects.",
        icon: Activity,
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
    },
    {
        name: "Stepper Motor Calculator",
        slug: "stepper-motor-calculator",
        description: "Calculate precise steps/mm settings for 3D printers and CNC machines based on hardware specs.",
        icon: MoveUpRight,
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
    },
    {
        name: "Battery Life Estimator",
        slug: "battery-life-estimator",
        description: "Estimate system runtime based on battery capacity and load current with Peukert's Law support.",
        icon: Battery,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
    },
    {
        name: "PID Controller Simulator",
        slug: "pid-controller-simulator",
        description: "Visual interactive graph for tuning P, I, and D gains with real-time step response analysis.",
        icon: LineChart,
        color: "text-violet-500",
        bgColor: "bg-violet-500/10",
    },
    {
        name: "Sensor Scaling Calculator",
        slug: "sensor-scaling-calculator",
        description: "Map analog voltage or current signals to physical engineering units for sensor calibration.",
        icon: Ruler,
        color: "text-lime-500",
        bgColor: "bg-lime-500/10",
    },
    {
        name: "PID Controller Tuner",
        slug: "pid-tuner",
        description: "Real-time Proportional-Integral-Derivative simulation for control systems analysis.",
        icon: Activity,
        color: "text-teal-500",
        bgColor: "bg-teal-500/10",
    },
]

const mathTools = [
    {
        name: "Matrix Calculator",
        slug: "matrix-calculator",
        description: "Calculate determinant, inverse, and trace for matrices with real-time validation.",
        icon: Grid3X3,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
    },
    {
        name: "Linear Curve Fitter",
        slug: "curve-fitter",
        description: "Fit linear models to data points using the least squares method with R-squared analysis.",
        icon: LineChart,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        name: "Unit Circle Explorer",
        slug: "unit-circle",
        description: "Interactive visualization of trigonometric functions and unit circle relationships.",
        icon: Compass,
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
    },
    {
        name: "Precision Engineering Calculator",
        slug: "scientific-calculator",
        description: "Comprehensive computational engine with support for trigonometric and algebraic functions.",
        icon: Calculator,
        color: "text-green-500",
        bgColor: "bg-green-500/10",
    },
]

const webTools = [
    {
        name: "Stream Compressor",
        slug: "compressor",
        description: "High-performance browser-native file compression using Compression Streams API.",
        icon: FileArchive,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        isNew: true,
    },
    {
        name: "CSS Unit Converter",
        slug: "css-unit-converter",
        description: "Convert px to rem, em, %, and viewport units based on custom base font size.",
        icon: FileCode,
        color: "text-sky-500",
        bgColor: "bg-sky-500/10",
    },
    {
        name: "Color Contrast Checker",
        slug: "color-contrast-checker",
        description: "Verify WCAG 2.1 accessibility compliance for foreground and background colors.",
        icon: Palette,
        color: "text-fuchsia-500",
        bgColor: "bg-fuchsia-500/10",
    },
    {
        name: "JSON Structure Validator",
        slug: "json-formatter",
        description: "Advanced linting and formatting engine for complex JSON data structures.",
        icon: Braces,
        color: "text-yellow-500",
        bgColor: "bg-yellow-500/10",
    },
    {
        name: "Regex Pattern Architect",
        slug: "regex-architect",
        description: "Visual regular expression builder and tester with real-time match highlighting.",
        icon: Terminal,
        color: "text-fuchsia-500",
        bgColor: "bg-fuchsia-500/10",
    },
    {
        name: "Diff Comparison Engine",
        slug: "diff-checker",
        description: "Side-by-side code comparison tool with intelligent change highlighting.",
        icon: Split,
        color: "text-red-500",
        bgColor: "bg-red-500/10",
    },
]

const coreTools = [
    {
        name: "Technical Document Editor",
        slug: "markdown-editor",
        description: "High-performance Markdown environment with real-time GitHub-flavored preview.",
        icon: Edit3,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        name: "MathML Integration Engine",
        slug: "latex-mathml-converter",
        description: "Transform LaTeX syntax into standards-compliant MathML for web rendering.",
        icon: Replace,
        color: "text-purple-500",
        bgColor: "bg-purple-500/10",
    },
    {
        name: "Security & Syntax Escaper",
        slug: "html-encoder",
        description: "HTML entity encoder/decoder for secure code presentation and XSS prevention.",
        icon: Code2,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
    },
    {
        name: "Mathematical Formula Architect",
        slug: "latex-equation-editor",
        description: "LaTeX authoring environment with dynamic block mathematical rendering.",
        icon: Sigma,
        color: "text-pink-500",
        bgColor: "bg-pink-500/10",
    },
    {
        name: "Resume Architect",
        slug: "resume-creator",
        description: "Craft a high-impact, professional resume with real-time preview and precision PDF export.",
        icon: Layout,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        name: "User Persona Architect",
        slug: "user-persona-creator",
        description: "Design and export professional user personas for empathy-driven engineering.",
        icon: Users,
        color: "text-indigo-500",
        bgColor: "bg-indigo-500/10",
    },
    {
        name: "Data Transformation Suite",
        slug: "data-transform",
        description: "Comprehensive Base64, Hex, and URL encoding/decoding utilities.",
        icon: FileCode,
        color: "text-sky-500",
        bgColor: "bg-sky-500/10",
    },
    {
        name: "Precision Unit Converter",
        slug: "unit-converter",
        description: "Standardized metric and imperial unit conversions for engineering parameters.",
        icon: Scaling,
        color: "text-cyan-500",
        bgColor: "bg-cyan-500/10",
    },
    {
        name: "Engineering Student Navigator",
        slug: "student-guide-navigator",
        description: "Interactive guide and utility for OUSL Engineering students (2025/26).",
        icon: GraduationCap,
        color: "text-emerald-500",
        bgColor: "bg-emerald-500/10",
        isNew: true,
    },
]

const discoveryTools = [
    {
        name: "Engineering Researches",
        slug: "../researches",
        description: "Access and search through millions of scholarly articles on arXiv.",
        icon: FlaskConical,
        color: "text-teal-500",
        bgColor: "bg-teal-500/10",
    },
    {
        name: "Open Books Library",
        slug: "../open-books",
        description: "Discover millions of books and digital resources from Open Library.",
        icon: Library,
        color: "text-blue-500",
        bgColor: "bg-blue-500/10",
    },
    {
        name: "External Blog Feeds",
        slug: "../feeds",
        description: "Stay updated with the latest engineering logs from external RSS feeds.",
        icon: Rss,
        color: "text-orange-500",
        bgColor: "bg-orange-500/10",
    },
    {
        name: "Game Deal Finder",
        slug: "../game-deal",
        description: "Search and compare the best game discounts across digital stores.",
        icon: Gamepad2,
        color: "text-rose-500",
        bgColor: "bg-rose-500/10",
    },
]

const sections = [
    { title: "Electronics", id: "electronics", tools: electronicsTools },
    { title: "Mechanical", id: "mechanical", tools: mechanicalTools },
    { title: "Mechatronics", id: "mechatronics", tools: mechatronicsTools },
    { title: "Math & Data", id: "math", tools: mathTools },
    { title: "Software & Web", id: "web", tools: webTools },
    { title: "Content & Core", id: "core", tools: coreTools },
    { title: "Discovery", id: "discovery", tools: discoveryTools },
]

function ToolSection({ title, id, tools }: { title: string, id: string, tools: Tool[] }) {
    return (
        <div className="mt-16 scroll-mt-20" id={id}>
            <h2 className="mb-6 text-2xl font-bold font-serif border-b border-border pb-2 flex items-center gap-2">
                {title}
                <span className="text-xs font-normal text-muted-foreground ml-2 px-2 py-0.5 rounded-full bg-muted">
                    {tools.length} Tools
                </span>
            </h2>
            <div className="grid gap-4 md:grid-cols-2">
                {tools.map((tool) => (
                    <Link
                        key={tool.slug}
                        href={`/tools/${tool.slug}`}
                        className="group block rounded-xl border border-border bg-card/50 p-5 transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:bg-card"
                    >
                        <div className="flex items-start gap-4">
                            <div className={`rounded-lg ${tool.bgColor} p-3 ${tool.color} shrink-0`}>
                                <tool.icon className="h-5 w-5" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2 overflow-hidden">
                                        <h2 className="text-lg font-semibold group-hover:text-primary transition-colors font-sans truncate">
                                            {tool.name}
                                        </h2>
                                        {tool.isNew && (
                                            <span className="px-1.5 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-md uppercase shrink-0">
                                                New
                                            </span>
                                        )}
                                    </div>
                                    <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary shrink-0" />
                                </div>
                                <p className="mt-1 text-xs text-muted-foreground leading-relaxed font-sans line-clamp-2">
                                    {tool.description}
                                </p>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default function ToolsPage() {
    return (
        <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
            <div className="mx-auto max-w-5xl">
                <div className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold font-serif tracking-tight">Engineering Workspace</h1>
                    <p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed font-sans">
                        {description}
                    </p>
                </div>

                {/* Quick Navigation */}
                <div className="sticky top-20 z-10 mb-12 flex flex-wrap justify-center gap-2 p-2 rounded-2xl bg-background/50 backdrop-blur-xl border border-border/50 shadow-sm">
                    {sections.map(s => (
                        <a
                            key={s.id}
                            href={`#${s.id}`}
                            className="px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all hover:bg-primary/10 hover:text-primary text-muted-foreground font-mono"
                        >
                            {s.title}
                        </a>
                    ))}
                </div>

                {sections.map(s => (
                    <ToolSection key={s.id} title={s.title} id={s.id} tools={s.tools} />
                ))}

                <div className="mt-24 rounded-3xl border border-border/50 bg-card/30 p-8 text-center backdrop-blur-sm">
                    <Rocket className="mx-auto h-10 w-10 text-primary mb-4" />
                    <h2 className="text-2xl font-bold font-serif mb-2">Expanding the Toolkit</h2>
                    <p className="mx-auto max-w-md text-muted-foreground text-sm font-font-sans">
                        New professional utilities are being added regularly. Have a specific engineering need? Reach out via the feedback portal.
                    </p>
                </div>
            </div>
            <AIContentIndicator />
        </div>
    )
}
