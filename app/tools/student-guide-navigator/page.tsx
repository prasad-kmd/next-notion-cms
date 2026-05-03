"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import gsap from "gsap";
import { SafeLink } from "@/components/ui/safe-link";
import { useGSAP } from "@gsap/react";
import {
  Search,
  GraduationCap,
  Wallet,
  Info,
  CheckCircle2,
  AlertCircle,
  Map,
  TrendingUp,
  LayoutDashboard,
  Save,
  Trash2,
  Calendar,
  Download,
  Upload,
  Plus,
  Minus,
  History,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { AIContentIndicator } from "@/components/ai-content-indicator";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { toast } from "sonner";
import Loading from "@/app/loading";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Constants
const DEPARTMENTS: Record<string, string> = {
  AG: "Agricultural and Plantation Engineering",
  CV: "Civil Engineering",
  EE: "Electrical and Computer Engineering",
  MH: "Mathematics and Philosophy of Engineering",
  DM: "Mechanical Engineering",
  TA: "Textile and Apparel Technology",
  FD: "Faculty of Engineering Technology",
};

const CATEGORIES: Record<string, string> = {
  Z: "Mathematics",
  B: "Basic Science",
  K: "Computing",
  S: "Engineering Sciences and/or Design",
  Y: "Engineering Projects",
  M: "Management",
  J: "General",
  I: "Industrial",
  W: "Industrial Training",
};

const FEES = {
  LEVEL_2: 1400,
  LEVEL_3_4: 2080,
  LEVEL_5_6_7: 3220,
  REGISTRATION: 500,
  FACILITIES: 2500,
  LIBRARY: 100,
  INSTRUMENT: 12500,
};

const GRADES = [
  { range: "Z > 85", grade: "A+", gpv: 4.0 },
  { range: "75 ≤ Z < 85", grade: "A", gpv: 4.0 },
  { range: "70 ≤ Z < 75", grade: "A-", gpv: 3.7 },
  { range: "63 ≤ Z < 70", grade: "B+", gpv: 3.3 },
  { range: "55 ≤ Z < 63", grade: "B", gpv: 3.0 },
  { range: "50 ≤ Z < 55", grade: "B-", gpv: 2.7 },
  { range: "45 ≤ Z < 50", grade: "C+", gpv: 2.3 },
  { range: "40 ≤ Z < 45", grade: "C", gpv: 2.0 },
  { range: "35 ≤ Z < 40", grade: "C-", gpv: 1.7 },
  { range: "30 ≤ Z < 35", grade: "D+", gpv: 1.3 },
  { range: "20 ≤ Z < 30", grade: "D", gpv: 1.0 },
  { range: "Z < 20", grade: "E", gpv: 0.0 },
];

interface Course {
  code: string;
  name: string;
  credits: number;
  level: number;
  category: string;
  dept: string;
  prerequisites: string;
  specializations: string[];
}

interface Programme {
  id: string;
  name: string;
  min_credits: number;
  min_l56?: number;
  min_l6?: number;
  categories: Record<string, unknown>;
}

export default function StudentGuideNavigator() {
  // Data Loading
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [programmes, setProgrammes] = useState<Programme[]>([]);
  const [loading, setLoading] = useState(true);

  // User State (Persisted)
  // User State (Persisted)
  const [userPlan, setUserPlan] = useLocalStorage<Record<string, number>>(
    "ousl_user_plan_v4",
    {},
  );
  const [completedCourses, setCompletedCourses] = useLocalStorage<
    Record<string, number>
  >("ousl_completed_v2", {});
  const [selectedSpec, setSelectedSpec] = useLocalStorage<string>(
    "ousl_selected_spec",
    "Civil Engineering",
  );
  const [selectedProgrammeId, setSelectedProgrammeId] = useLocalStorage<string>(
    "ousl_selected_programme",
    "bsc_hons_eng",
  );
  const [isNewStudent, setIsNewStudent] = useLocalStorage<boolean>(
    "ousl_is_new_student",
    false,
  );
  const [studentName, setStudentName] = useLocalStorage<string>(
    "ousl_student_name",
    "",
  );

  // UI State
  const [searchQuery, setSearchQuery] = useState("");
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  const [filterDept, setFilterDept] = useState("all");
  const [filterLevel, setFilterLevel] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, programmesRes] = await Promise.all([
          fetch("/data/ousl_courses.json"),
          fetch("/data/ousl_programmes.json"),
        ]);
        const coursesData = await coursesRes.json();
        const programmesData = await programmesRes.json();
        setAllCourses(coursesData);
        setProgrammes(programmesData);
      } catch (error) {
        console.error("Failed to load OUSL data:", error);
        toast.error("Failed to load course data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Derived State
  const currentProgramme = useMemo(
    () => programmes.find((p) => p.id === selectedProgrammeId),
    [programmes, selectedProgrammeId],
  );

  const plannedCourseDetails = useMemo(
    () =>
      allCourses.filter(
        (c) =>
          Object.keys(userPlan).includes(c.code) &&
          (c.specializations.includes(selectedSpec) ||
            c.specializations.length > 5),
      ),
    [allCourses, userPlan, selectedSpec],
  );

  const completedCourseDetails = useMemo(
    () =>
      allCourses.filter(
        (c) =>
          Object.keys(completedCourses).includes(c.code) &&
          (c.specializations.includes(selectedSpec) ||
            c.specializations.length > 5),
      ),
    [allCourses, completedCourses, selectedSpec],
  );

  const filteredCourseList = useMemo(() => {
    return allCourses.filter((c) => {
      const isRelevant =
        c.specializations.includes(selectedSpec) ||
        c.specializations.length > 5; // Common
      if (!isRelevant) return false;

      const matchesSearch =
        c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDept = filterDept === "all" || c.dept === filterDept;
      const matchesLevel =
        filterLevel === "all" || c.level.toString() === filterLevel;
      const matchesCategory =
        filterCategory === "all" || c.category === filterCategory;
      return matchesSearch && matchesDept && matchesLevel && matchesCategory;
    });
  }, [
    allCourses,
    searchQuery,
    filterDept,
    filterLevel,
    filterCategory,
    selectedSpec,
  ]);

  const gpaCalculation = useMemo(() => {
    // OUSL Honours GPA Rules:
    // Consider best 80 credits from Level 4, 5, 6.
    // Priority: (i) Compulsory L5/6, (ii) Elective L5/6, (iii) Compulsory L4

    const gpaCourses = completedCourseDetails
      .filter((c) => c.level >= 4)
      .map((c) => ({
        ...c,
        gpv: completedCourses[c.code] || 0,
      }))
      .sort((a, b) => {
        // First by Level (higher first for simplicity/priority)
        if (b.level !== a.level) return b.level - a.level;
        // Then by GPV (best grades first)
        return b.gpv - a.gpv;
      });

    let totalCredits = 0;
    let weightedSum = 0;
    const limit = 80;

    for (const c of gpaCourses) {
      const remaining = limit - totalCredits;
      if (remaining <= 0) break;

      const used = Math.min(c.credits, remaining);
      weightedSum += used * c.gpv;
      totalCredits += used;
    }

    return totalCredits > 0 ? (weightedSum / totalCredits).toFixed(2) : "0.00";
  }, [completedCourseDetails, completedCourses]);

  const progressStats = useMemo(() => {
    const combinedCodes = Array.from(
      new Set([...Object.keys(userPlan), ...Object.keys(completedCourses)]),
    );
    const combined = allCourses.filter((c) => combinedCodes.includes(c.code));

    const totalCredits = combined.reduce((sum, c) => sum + c.credits, 0);
    const l56Credits = combined
      .filter((c) => c.level >= 5)
      .reduce((sum, c) => sum + c.credits, 0);
    const l6Credits = combined
      .filter((c) => c.level === 6)
      .reduce((sum, c) => sum + c.credits, 0);

    const categoryBreakdown = combined.reduce(
      (acc, c) => {
        acc[c.category] = (acc[c.category] || 0) + c.credits;
        return acc;
      },
      {} as Record<string, number>,
    );

    return { totalCredits, l56Credits, l6Credits, categoryBreakdown };
  }, [allCourses, userPlan, completedCourses]);

  // Actions
  const isCourseInSpec = useCallback(
    (course: Course) => {
      return (
        course.specializations.includes(selectedSpec) ||
        course.specializations.length > 5
      );
    },
    [selectedSpec],
  );

  const togglePlan = (code: string) => {
    const course = allCourses.find((c) => c.code === code);
    if (!course) return;

    if (userPlan[code] !== undefined) {
      const next = { ...userPlan };
      delete next[code];
      setUserPlan(next);
      toast.info(`Removed ${code} from plan.`);
    } else {
      if (!isCourseInSpec(course)) {
        toast.error(`Course ${code} is not part of ${selectedSpec}.`);
        return;
      }
      setUserPlan({ ...userPlan, [code]: 1 });
      toast.success(`Added ${code} to plan.`);
    }
  };

  const setCourseSemester = (code: string, sem: number) => {
    setUserPlan({ ...userPlan, [code]: sem });
  };

  const toggleComplete = (code: string, gpv: number = 3.0) => {
    const course = allCourses.find((c) => c.code === code);
    if (!course) return;

    if (completedCourses[code] !== undefined) {
      const next = { ...completedCourses };
      delete next[code];
      setCompletedCourses(next);
    } else {
      if (!isCourseInSpec(course)) {
        toast.error(`Course ${code} is not part of ${selectedSpec}.`);
        return;
      }
      setCompletedCourses({ ...completedCourses, [code]: gpv });
      // If completed, remove from plan
      const nextPlan = { ...userPlan };
      delete nextPlan[code];
      setUserPlan(nextPlan);
    }
  };

  const updateGrade = (code: string, gpv: number) => {
    setCompletedCourses({ ...completedCourses, [code]: gpv });
  };

  const resetData = () => {
    if (confirm("Are you sure you want to clear your plan and progress?")) {
      setUserPlan({});
      setCompletedCourses({});
      toast.success("All data cleared.");
    }
  };

  const backupData = () => {
    const data = {
      userPlan,
      completedCourses,
      selectedSpec,
      selectedProgrammeId,
      isNewStudent,
      version: "2.0",
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ousl_navigator_backup_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    toast.success("Backup downloaded successfully.");
  };

  const restoreData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string);
        if (data.userPlan) setUserPlan(data.userPlan);
        if (data.completedCourses) setCompletedCourses(data.completedCourses);
        if (data.selectedSpec) setSelectedSpec(data.selectedSpec);
        if (data.selectedProgrammeId)
          setSelectedProgrammeId(data.selectedProgrammeId);
        if (data.isNewStudent !== undefined) setIsNewStudent(data.isNewStudent);
        if (data.studentName) setStudentName(data.studentName);
        toast.success("Data restored successfully.");
      } catch (err) {
        toast.error("Invalid backup file.");
      }
    };
    reader.readAsText(file);
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    const toastId = toast.loading("Preparing academic report...");

    // Wait for DOM to update with the report
    setTimeout(async () => {
      try {
        const element = reportRef.current;
        if (!element) throw new Error("Report element not found");

        const canvas = await html2canvas(element, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        const pageHeight = pdf.internal.pageSize.getHeight();
        let heightLeft = pdfHeight;
        let position = 0;

        pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - pdfHeight;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, pdfWidth, pdfHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(
          `OUSL_Academic_Report_${studentName.trim().replace(/\s+/g, "_") || "Navigator"}.pdf`,
        );
        toast.success("Report exported successfully!", { id: toastId });
      } catch (error) {
        console.error("Export error:", error);
        toast.error("Failed to generate PDF report.", { id: toastId });
      } finally {
        setIsExporting(false);
      }
    }, 500);
  };

  // Fee Calculation
  const feeSummary = useMemo(() => {
    if (plannedCourseDetails.length === 0) {
      return { tuition: 0, fixed: 0, total: 0 };
    }
    const tuition = plannedCourseDetails.reduce((sum, c) => {
      if (c.level === 2) return sum + c.credits * FEES.LEVEL_2;
      if (c.level <= 4) return sum + c.credits * FEES.LEVEL_3_4;
      return sum + c.credits * FEES.LEVEL_5_6_7;
    }, 0);
    const fixed =
      FEES.REGISTRATION +
      FEES.FACILITIES +
      FEES.LIBRARY +
      (isNewStudent ? FEES.INSTRUMENT : 0);
    return { tuition, fixed, total: tuition + fixed };
  }, [plannedCourseDetails, isNewStudent]);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 img_grad_pm">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-8">
          {/* Premium Header */}
          <div className="relative overflow-hidden rounded-2xl bg-card/30 backdrop-blur-xl border border-primary/10 p-8 md:p-10 shadow-xl">
            <div className="absolute top-0 right-0 p-6">
              <Badge
                variant="outline"
                className="py-1 px-4 text-primary border-primary/20 bg-primary/5 rounded-full font-bold"
              >
                BSc (Hons)
              </Badge>
            </div>

            <div className="relative z-10 max-w-3xl">
              <h1 className="mb-2 text-3xl md:text-4xl font-black font-serif tracking-tighter bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text">
                Engineering Student Navigator
              </h1>
              <p className="text-muted-foreground font-medium mb-8 text-sm md:text-base">
                Plan your academic journey, track credits, and simulate your GPA
                with precision.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="space-y-1.5 flex-1 min-w-[240px]">
                  <Label className="text-xs font-black uppercase tracking-[0.2em] text-primary/70 ml-1">
                    Student Name
                  </Label>
                  <Input
                    placeholder="Enter your name"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="h-12 bg-background/50 border-primary/20 rounded-xl font-bold"
                  />
                </div>
                <div className="space-y-1.5 flex-1 min-w-[240px]">
                  <Label className="text-xs font-black uppercase tracking-[0.2em] text-primary/70 ml-1">
                    Current Specialization
                  </Label>
                  <Select value={selectedSpec} onValueChange={setSelectedSpec}>
                    <SelectTrigger className="h-12 text-sm font-bold bg-background/50 backdrop-blur-md border-primary/20 rounded-xl shadow-sm hover:border-primary/40 transition-all">
                      <SelectValue placeholder="Select Your Specialization" />
                    </SelectTrigger>
                    <SelectContent className="rounded-xl border-primary/10">
                      {Array.from(
                        new Set(allCourses.flatMap((c) => c.specializations)),
                      )
                        .sort()
                        .map((s) => (
                          <SelectItem key={s} value={s} className="rounded-lg">
                            {s}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                <Button
                  onClick={handleExportPDF}
                  disabled={isExporting}
                  className="rounded-xl h-11 px-6 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {isExporting ? "Preparing Report..." : "Export Academic Report"}
                </Button>

                <div className="flex items-center gap-2">
                  <TooltipProvider>
                    <div className="flex gap-1.5 p-1 bg-background/40 backdrop-blur-md border border-primary/10 rounded-xl">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary transition-all"
                            onClick={backupData}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="rounded-lg font-bold text-xs">
                          Export Backup (.json)
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg hover:bg-primary/10 hover:text-primary transition-all relative"
                          >
                            <Upload className="h-4 w-4" />
                            <input
                              type="file"
                              className="absolute inset-0 opacity-0 cursor-pointer"
                              onChange={restoreData}
                              accept=".json"
                            />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="rounded-lg font-bold text-xs">
                          Import Backup (.json)
                        </TooltipContent>
                      </Tooltip>

                      <div className="w-[1px] h-5 bg-primary/10 self-center mx-1" />

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-9 w-9 rounded-lg text-red-500/70 hover:bg-red-500/10 hover:text-red-600 transition-all"
                            onClick={resetData}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="rounded-lg font-bold text-xs">
                          Clear Data
                        </TooltipContent>
                      </Tooltip>
                    </div>
                  </TooltipProvider>
                </div>
              </div>
            </div>

            {/* Decorative elements */}
            <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute -top-12 -left-12 w-48 h-48 bg-emerald-500/5 rounded-full blur-3xl" />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Top Stats Section */}
            <Card className="border-primary/10 rounded-2xl overflow-hidden shadow-sm bg-card/50 backdrop-blur-sm">
              <CardHeader className="pb-3 pt-4">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/80">
                  Academic Track
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 pb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5 flex-1 max-w-xs">
                    <Label className="text-xs font-bold text-muted-foreground ml-1">
                      Programme
                    </Label>
                    <Select
                      value={selectedProgrammeId}
                      onValueChange={setSelectedProgrammeId}
                    >
                      <SelectTrigger className="w-full bg-background/50 border-primary/10 rounded-xl h-9 text-xs font-bold">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="rounded-xl">
                        {programmes.map((p) => (
                          <SelectItem
                            key={p.id}
                            value={p.id}
                            className="text-xs"
                          >
                            {p.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="flex-1 space-y-3">
                    <div className="flex justify-between items-end">
                      <div className="space-y-0.5">
                        <p className="text-[10px] font-black text-muted-foreground uppercase opacity-60">
                          Completion
                        </p>
                        <p className="text-lg font-black text-primary font-serif">
                          {progressStats.totalCredits}{" "}
                          <span className="text-xs font-bold text-muted-foreground">
                            / {currentProgramme?.min_credits} cr
                          </span>
                        </p>
                      </div>
                      <Badge
                        variant="secondary"
                        className="bg-primary/10 text-primary border-none rounded-lg text-xs font-black"
                      >
                        {Math.round(
                          (progressStats.totalCredits /
                            (currentProgramme?.min_credits || 140)) *
                            100,
                        )}
                        %
                      </Badge>
                    </div>
                    <div className="h-1.5 w-full bg-primary/5 rounded-full overflow-hidden border border-primary/5">
                      <div
                        className="h-full bg-gradient-to-r from-primary/80 to-primary transition-all duration-1000 ease-out"
                        style={{
                          width: `${Math.min(100, (progressStats.totalCredits / (currentProgramme?.min_credits || 140)) * 100)}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-primary to-primary/80 border-none text-primary-foreground rounded-2xl shadow-lg shadow-primary/20 overflow-hidden relative group">
              <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
              <CardHeader className="pb-1 pt-4">
                <CardTitle className="text-xs font-black uppercase tracking-[0.2em] opacity-80 flex items-center gap-2">
                  <Wallet className="h-3 w-3" /> Estimated Fees
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 pb-5">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-black font-serif tracking-tighter">
                      Rs. {feeSummary.total.toLocaleString()}
                    </div>
                    <p className="text-[10px] opacity-70 font-bold uppercase tracking-wider">
                      For{" "}
                      {plannedCourseDetails.reduce((s, c) => s + c.credits, 0)}{" "}
                      planned credits
                    </p>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 border-none text-white rounded-xl font-black text-xs uppercase tracking-widest h-9 px-6"
                    onClick={() => setActiveTab("planner")}
                  >
                    View Breakdown
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="w-full">
            <Tabs
              value={activeTab}
              onValueChange={setActiveTab}
              className="space-y-6"
            >
              <div className="sticky top-[72px] lg:top-20 z-50 mb-8 lg:mb-12 p-1.5 lg:p-2 rounded-xl lg:rounded-2xl bg-background/50 backdrop-blur-xl border border-border/50 shadow-sm overflow-hidden">
                <TabsList className="flex flex-row justify-start lg:justify-center w-full bg-transparent gap-1.5 lg:gap-2 h-auto overflow-x-auto custom-scrollbar-hide px-1">
                  {[
                    {
                      id: "dashboard",
                      label: "Dashboard",
                      icon: LayoutDashboard,
                    },
                    { id: "planner", label: "Planner", icon: Map },
                    {
                      id: "audit",
                      label: "Degree Audit",
                      icon: GraduationCap,
                    },
                    { id: "courses", label: "Courses", icon: Search },
                    { id: "gpa", label: "GPA Emulator", icon: TrendingUp },
                  ].map((item) => (
                    <TabsTrigger
                      key={item.id}
                      value={item.id}
                      className="whitespace-nowrap px-3 lg:px-4 py-2 text-[9px] md:text-xs font-black uppercase tracking-widest rounded-lg transition-all hover:bg-primary/5 hover:text-primary text-muted-foreground font-mono data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:shadow-none border border-transparent data-[state=active]:border-primary/10"
                    >
                      <item.icon className="h-3 w-3 lg:h-3.5 lg:w-3.5 mr-1.5 lg:mr-2 shrink-0" />
                      {item.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>

              {/* Dashboard View */}
              <TabsContent value="dashboard" className="space-y-8">
                <div className="grid gap-6 md:grid-cols-3">
                  <DashboardStatCard
                    label="Academic Performance"
                    value={gpaCalculation}
                    sublabel="Current Honours GPA (L4-6)"
                    icon={TrendingUp}
                    color="primary"
                  />
                  <DashboardStatCard
                    label="Planned Load"
                    value={plannedCourseDetails.length.toString()}
                    sublabel="Courses in your roadmap"
                    icon={Map}
                    color="blue"
                  />
                  <DashboardStatCard
                    label="Completed"
                    value={Object.keys(completedCourses).length.toString()}
                    sublabel="Units passed successfully"
                    icon={CheckCircle2}
                    color="emerald"
                  />
                </div>

                <div className="grid gap-8 lg:grid-cols-5">
                  <Card className="lg:col-span-3 rounded-[2.5rem] border-primary/10 overflow-hidden shadow-2xl bg-card/50 backdrop-blur-xl">
                    <CardHeader className="p-8 pb-0">
                      <CardTitle className="text-xl font-black font-serif">
                        Credit Distribution
                      </CardTitle>
                      <CardDescription className="text-sm font-medium">
                        Progress across OUSL course categories.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-8 space-y-6">
                      <div className="grid gap-4">
                        {Object.entries(currentProgramme?.categories || {}).map(
                          ([cat, req]: [string, unknown]) => {
                            const current =
                              progressStats.categoryBreakdown[cat] || 0;
                            const percent = (current / req.min) * 100;
                            return (
                              <div
                                key={cat}
                                className="group flex items-center gap-4"
                              >
                                <div className="w-8 h-8 rounded-full bg-primary/5 flex items-center justify-center text-[10px] font-black text-primary border border-primary/10 group-hover:bg-primary group-hover:text-white transition-all duration-300">
                                  {cat}
                                </div>
                                <div className="flex-1 space-y-1.5">
                                  <div className="flex justify-between items-end">
                                    <p className="text-xs font-bold text-foreground/80 group-hover:text-primary transition-colors">
                                      {CATEGORIES[cat] || cat}
                                    </p>
                                    <p className="text-[10px] font-black text-muted-foreground transition-all group-hover:scale-110">
                                      {current} / {req.min} cr{" "}
                                      <span className="text-primary ml-1">
                                        {Math.round(percent)}%
                                      </span>
                                    </p>
                                  </div>
                                  <div className="h-2 w-full bg-primary/5 rounded-full overflow-hidden border border-primary/5">
                                    <div
                                      className={`h-full transition-all duration-1000 ease-out ${percent >= 100 ? "bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.3)]" : "bg-primary"}`}
                                      style={{
                                        width: `${Math.min(100, percent)}%`,
                                      }}
                                    />
                                  </div>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="lg:col-span-2 rounded-[2.5rem] border-primary/10 overflow-hidden shadow-2xl bg-card/50 backdrop-blur-xl flex flex-col">
                    <CardHeader className="p-8 pb-0">
                      <CardTitle className="text-xl font-black font-serif">
                        Study Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-8 flex-1 flex flex-col justify-between space-y-8">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-primary/5 border border-primary/10 group hover:border-primary/30 transition-all">
                          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center transition-transform group-hover:rotate-12">
                            <LayoutDashboard className="h-7 w-7 text-primary" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                              Total Credits
                            </p>
                            <p className="text-3xl font-black text-primary font-serif">
                              {progressStats.totalCredits}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 p-5 rounded-[1.5rem] bg-blue-500/5 border border-blue-500/10 group hover:border-blue-500/30 transition-all">
                          <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center transition-transform group-hover:rotate-12">
                            <History className="h-7 w-7 text-blue-500" />
                          </div>
                          <div>
                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                              L5 & L6 Units
                            </p>
                            <p className="text-3xl font-black text-blue-500 font-serif">
                              {progressStats.l56Credits}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="pt-8 border-t border-primary/5">
                        <div className="p-4 rounded-xl bg-muted/30 border border-border/50 text-[10px] text-muted-foreground font-medium italic leading-relaxed">
                          Your academic status is automatically saved. Remember
                          to export your data periodically to prevent loss.
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Planner View */}
              <TabsContent value="planner" className="space-y-8">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 p-6 md:p-8 rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-xl shadow-xl transition-all hover:bg-card/40">
                  <div className="space-y-1">
                    <h3 className="text-2xl font-black font-serif flex items-center gap-3">
                      <Map className="h-6 w-6 text-primary" /> Roadmap
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground">
                      Your strategic academic timeline across 8 semesters.
                    </p>
                  </div>
                  <div className="flex items-center gap-3 px-5 py-3 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-amber-600 shadow-sm">
                    <AlertCircle className="h-5 w-5 animate-pulse" />
                    <div className="text-xs">
                      <p className="font-black uppercase tracking-widest text-[10px]">
                        Annual Limit
                      </p>
                      <p className="font-bold">Max 38 credits per year</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-12">
                  <div className="lg:col-span-8 space-y-6">
                    <div className="grid gap-6 sm:grid-cols-2">
                      {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                        const semCourses = plannedCourseDetails.filter(
                          (c) => userPlan[c.code] === sem,
                        );
                        const semCredits = semCourses.reduce(
                          (s, c) => s + c.credits,
                          0,
                        );

                        return (
                          <Card
                            key={sem}
                            className="rounded-2xl border-primary/5 bg-card/20 backdrop-blur-sm overflow-hidden group transition-all duration-500 hover:border-primary/20 hover:shadow-xl"
                          >
                            <CardHeader className="p-6 pb-4 flex flex-row items-center justify-between border-b border-primary/5 bg-primary/5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center font-black text-xs text-primary">
                                  S{sem}
                                </div>
                                <CardTitle className="text-sm font-black uppercase tracking-wider">
                                  Semester {sem}
                                </CardTitle>
                              </div>
                              <Badge
                                variant="outline"
                                className={`rounded-lg text-[10px] font-black border-none ${semCredits > 18 ? "bg-red-500/10 text-red-500" : "bg-primary/10 text-primary"}`}
                              >
                                {semCredits} CR
                              </Badge>
                            </CardHeader>
                            <CardContent className="p-6 space-y-3">
                              {semCourses.length === 0 ? (
                                <div className="py-8 text-center border border-dashed border-primary/5 rounded-2xl text-[10px] uppercase font-black tracking-widest text-muted-foreground/40 italic">
                                  No courses assigned
                                </div>
                              ) : (
                                semCourses.map((c) => (
                                  <div
                                    key={c.code}
                                    className="p-3.5 rounded-2xl bg-background/50 border border-primary/5 flex justify-between items-center group/item hover:border-primary/20 hover:bg-background transition-all"
                                  >
                                    <div className="space-y-0.5">
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-black text-primary/80">
                                          {c.code}
                                        </span>
                                        <span className="text-[10px] text-muted-foreground font-black opacity-40">
                                          L{c.level} · {c.credits}cr
                                        </span>
                                      </div>
                                      <p className="text-xs font-bold leading-tight group-hover/item:text-primary transition-colors">
                                        {c.name}
                                      </p>
                                    </div>
                                    <div className="flex gap-1.5 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                      <Select
                                        value={userPlan[c.code].toString()}
                                        onValueChange={(v) =>
                                          setCourseSemester(c.code, parseInt(v))
                                        }
                                      >
                                        <SelectTrigger className="h-7 w-12 rounded-lg text-[10px] bg-primary/5 border-none p-0 focus:ring-0">
                                          <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="rounded-xl">
                                          {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                                            <SelectItem
                                              key={s}
                                              value={s.toString()}
                                              className="text-[10px]"
                                            >
                                              S{s}
                                            </SelectItem>
                                          ))}
                                        </SelectContent>
                                      </Select>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-7 w-7 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50"
                                        onClick={() => togglePlan(c.code)}
                                      >
                                        <Minus className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  </div>
                                ))
                              )}
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  <div className="lg:col-span-4 h-fit sticky top-20">
                    <Card className="rounded-2xl border-primary/10 overflow-hidden shadow-2xl bg-card/50 backdrop-blur-xl">
                      <CardHeader className="p-8 pb-4">
                        <CardTitle className="text-xl font-black font-serif flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-500" />{" "}
                          Pre-requisites
                        </CardTitle>
                        <CardDescription className="text-xs font-medium">
                          Validating your roadmap dependencies.
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="p-8 pt-0 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                        {plannedCourseDetails.filter(
                          (c) => c.prerequisites !== "None",
                        ).length === 0 ? (
                          <div className="p-8 text-center rounded-2xl bg-primary/5 border border-dashed border-primary/10 text-xs font-medium text-muted-foreground/60 italic">
                            No dependencies detected in your current roadmap.
                          </div>
                        ) : (
                          plannedCourseDetails.map((c) => {
                            if (c.prerequisites === "None") return null;
                            const hasPrereq = Object.keys(
                              completedCourses,
                            ).some((cc) => c.prerequisites.includes(cc));
                            return (
                              <div
                                key={c.code}
                                className={`group p-4 rounded-2xl border transition-all duration-300 ${hasPrereq ? "bg-emerald-500/5 border-emerald-500/20" : "bg-red-500/5 border-red-500/20 shadow-lg shadow-red-500/5"}`}
                              >
                                <div className="flex items-start gap-3">
                                  <div
                                    className={`mt-0.5 p-1.5 rounded-lg ${hasPrereq ? "bg-emerald-500/10 text-emerald-500" : "bg-red-500/10 text-red-500"}`}
                                  >
                                    {hasPrereq ? (
                                      <CheckCircle2 className="h-4 w-4" />
                                    ) : (
                                      <AlertCircle className="h-4 w-4" />
                                    )}
                                  </div>
                                  <div className="space-y-1">
                                    <p
                                      className={`text-xs font-black uppercase tracking-wider ${hasPrereq ? "text-emerald-600/70" : "text-red-600/70"}`}
                                    >
                                      {c.code}
                                    </p>
                                    <p className="text-xs font-bold leading-tight">
                                      {c.name}
                                    </p>
                                    <div className="pt-2 flex flex-wrap gap-1.5">
                                      <Badge
                                        variant="outline"
                                        className={`text-[9px] font-black uppercase tracking-widest ${hasPrereq ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-600" : "bg-red-500/10 border-red-500/20 text-red-500"}`}
                                      >
                                        Requires {c.prerequisites}
                                      </Badge>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* Audit View */}
              <TabsContent value="audit" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-primary" /> Degree
                      Completion Audit
                    </CardTitle>
                    <CardDescription>
                      Checking requirements for {currentProgramme?.name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      <AuditCard
                        title="Total Credits"
                        current={progressStats.totalCredits}
                        target={currentProgramme?.min_credits || 140}
                      />
                      {currentProgramme?.min_l56 && (
                        <AuditCard
                          title="Level 5 & 6"
                          current={progressStats.l56Credits}
                          target={currentProgramme.min_l56}
                        />
                      )}
                      {currentProgramme?.min_l6 && (
                        <AuditCard
                          title="Level 6 Only"
                          current={progressStats.l6Credits}
                          target={currentProgramme.min_l6}
                        />
                      )}
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-bold border-b border-border pb-2">
                        Category Status
                      </h4>
                      <div className="grid gap-4 md:grid-cols-2">
                        {Object.entries(currentProgramme?.categories || {}).map(
                          ([cat, req]: [string, unknown]) => {
                            const current =
                              progressStats.categoryBreakdown[cat] || 0;
                            const isComplete = current >= req.min;
                            return (
                              <div
                                key={cat}
                                className={`flex items-center justify-between p-3 rounded-xl border ${isComplete ? "border-emerald-500/30 bg-emerald-500/5" : "border-border bg-muted/20"}`}
                              >
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`h-8 w-8 rounded-full flex items-center justify-center ${isComplete ? "bg-emerald-500 text-white" : "bg-muted text-muted-foreground"}`}
                                  >
                                    {isComplete ? (
                                      <CheckCircle2 className="h-5 w-5" />
                                    ) : (
                                      <span className="font-black text-xs">
                                        {cat}
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-sm font-bold">
                                    {CATEGORIES[cat] || cat}
                                  </span>
                                </div>
                                <div className="text-right">
                                  <p className="text-sm font-black">
                                    {current}{" "}
                                    <span className="text-xs text-muted-foreground font-normal">
                                      / {req.min} cr
                                    </span>
                                  </p>
                                </div>
                              </div>
                            );
                          },
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Target GPA Simulator View */}
              <TabsContent value="gpa" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" /> Honours
                      GPA Calculator
                    </CardTitle>
                    <CardDescription>
                      GPA is calculated based on your completed L4, L5, and L6
                      courses (best 80 credits).
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-8">
                    <div className="grid gap-8 md:grid-cols-2">
                      <div className="space-y-4">
                        <h4 className="text-sm font-bold border-b pb-2">
                          Completed L4-6 Grades
                        </h4>
                        {completedCourseDetails.filter((c) => c.level >= 4)
                          .length === 0 ? (
                          <p className="text-xs text-muted-foreground italic">
                            No L4-6 courses marked as completed yet.
                          </p>
                        ) : (
                          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                            {completedCourseDetails
                              .filter((c) => c.level >= 4)
                              .map((c) => (
                                <div
                                  key={c.code}
                                  className="flex justify-between items-center p-2 rounded bg-muted/30 border border-border"
                                >
                                  <div>
                                    <p className="text-[10px] font-bold text-primary">
                                      {c.code}
                                    </p>
                                    <p className="text-xs font-medium truncate max-w-[150px]">
                                      {c.name}
                                    </p>
                                  </div>
                                  <Select
                                    value={completedCourses[c.code].toFixed(1)}
                                    onValueChange={(v) =>
                                      updateGrade(c.code, parseFloat(v))
                                    }
                                  >
                                    <SelectTrigger className="h-8 w-24">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {GRADES.map((g) => (
                                        <SelectItem
                                          key={g.grade}
                                          value={g.gpv.toFixed(1)}
                                        >
                                          {g.grade} ({g.gpv.toFixed(1)})
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                </div>
                              ))}
                          </div>
                        )}
                      </div>

                      <div className="rounded-2xl border border-primary/20 bg-primary/5 p-8 flex flex-col items-center justify-center text-center space-y-4">
                        <p className="text-sm font-bold uppercase text-muted-foreground">
                          Current Honours GPA
                        </p>
                        <div className="text-6xl font-black text-primary font-serif">
                          {gpaCalculation}
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-bold text-emerald-600">
                            {parseFloat(gpaCalculation) >= 3.7
                              ? "First Class Eligibility"
                              : parseFloat(gpaCalculation) >= 3.3
                                ? "Second Upper Eligibility"
                                : parseFloat(gpaCalculation) >= 3.0
                                  ? "Second Lower Eligibility"
                                  : "Pass"}
                          </p>
                          <p className="text-[10px] text-muted-foreground">
                            Considering{" "}
                            {completedCourseDetails
                              .filter((c) => c.level >= 4)
                              .reduce((s, c) => s + c.credits, 0)}{" "}
                            credits.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Course Browser View */}
              <TabsContent value="courses" className="space-y-8">
                <div className="p-8 rounded-2xl border border-primary/10 bg-card/30 backdrop-blur-xl shadow-xl overflow-hidden relative">
                  <div className="absolute top-0 right-0 p-8 text-primary/5 pointer-events-none">
                    <Search className="h-24 w-24" />
                  </div>
                  <div className="flex flex-col md:flex-row gap-6 items-end relative z-10">
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                        Search Courses
                      </Label>
                      <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <Input
                          placeholder="Type course name or code..."
                          className="h-12 pl-12 rounded-2xl bg-background/50 border-primary/10 focus-visible:ring-primary focus-visible:border-primary transition-all"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 lg:flex gap-3">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                          Level
                        </Label>
                        <Select
                          value={filterLevel}
                          onValueChange={setFilterLevel}
                        >
                          <SelectTrigger className="w-[110px] h-12 rounded-2xl bg-background/50 border-primary/10 font-bold text-xs">
                            <SelectValue placeholder="Level" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-primary/10">
                            <SelectItem value="all" className="text-xs">
                              All Levels
                            </SelectItem>
                            <SelectItem value="3" className="text-xs">
                              Level 3
                            </SelectItem>
                            <SelectItem value="4" className="text-xs">
                              Level 4
                            </SelectItem>
                            <SelectItem value="5" className="text-xs">
                              Level 5
                            </SelectItem>
                            <SelectItem value="6" className="text-xs">
                              Level 6
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                          Dept
                        </Label>
                        <Select
                          value={filterDept}
                          onValueChange={setFilterDept}
                        >
                          <SelectTrigger className="w-[130px] h-12 rounded-2xl bg-background/50 border-primary/10 font-bold text-xs">
                            <SelectValue placeholder="Department" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-primary/10">
                            <SelectItem value="all" className="text-xs">
                              All Depts
                            </SelectItem>
                            {Object.entries(DEPARTMENTS).map(([k, v]) => (
                              <SelectItem key={k} value={k} className="text-xs">
                                {k} - {v.split(" ")[0]}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 hidden lg:block">
                        <Label className="text-xs font-black uppercase tracking-widest text-muted-foreground/60 ml-1">
                          Category
                        </Label>
                        <Select
                          value={filterCategory}
                          onValueChange={setFilterCategory}
                        >
                          <SelectTrigger className="w-[140px] h-12 rounded-2xl bg-background/50 border-primary/10 font-bold text-xs">
                            <SelectValue placeholder="Category" />
                          </SelectTrigger>
                          <SelectContent className="rounded-xl border-primary/10">
                            <SelectItem value="all" className="text-xs">
                              All Cats
                            </SelectItem>
                            {Object.entries(CATEGORIES).map(([k, v]) => (
                              <SelectItem key={k} value={k} className="text-xs">
                                ({k}) {v}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {filteredCourseList.map((c) => (
                    <CourseCard
                      key={c.code}
                      course={c}
                      isPlanned={userPlan[c.code] !== undefined}
                      isCompleted={completedCourses[c.code] !== undefined}
                      onTogglePlan={() => togglePlan(c.code)}
                      onToggleComplete={() => toggleComplete(c.code)}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        <div className="mt-24 p-8 md:p-12 rounded-2xl border border-primary/10 bg-card/40 backdrop-blur-2xl relative overflow-hidden group shadow-2xl transition-all duration-700 hover:border-primary/30">
          <div className="absolute top-0 right-0 p-10 text-primary/10 transition-transform group-hover:scale-110 group-hover:rotate-12 duration-700">
            <GraduationCap className="h-48 w-48" />
          </div>
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl font-black font-serif mb-6 tracking-tight">
              Engineering Career Path
            </h2>
            <p className="text-muted-foreground mb-8 text-lg leading-relaxed font-medium">
              The Faculty of Engineering Technology at OUSL provides a path to
              recognized corporate membership with IESL. Our navigator ensures
              you maintain the required credit distribution for a high-impact
              engineering career.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button
                className="rounded-full px-8 h-12 gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                asChild
              >
                <a href="/tools">
                  Explore More Tools <ArrowUpRight className="h-4 w-4" />
                </a>
              </Button>
              <Button
                variant="outline"
                className="rounded-full px-8 h-12 gap-2 bg-background/50 border-primary/10 hover:bg-primary/5 transition-all"
                asChild
              >
                <SafeLink href="https://ou.ac.lk">
                  Support Cell <Info className="h-4 w-4" />
                </SafeLink>
              </Button>
            </div>
          </div>
          {/* Decorative gradients for the banner */}
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity duration-1000" />
        </div>
        <AIContentIndicator />
      </div>

      {/* Hidden Report Template for PDF Generation */}
      <div className="fixed left-[-9999px] top-0">
        <div
          ref={reportRef}
          style={{ backgroundColor: '#ffffff', color: '#0f172a', padding: '48px', width: '800px' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '4px solid #08784b', paddingBottom: '32px', marginBottom: '32px' }}>
            <div>
              <h1 style={{ fontSize: '36px', fontWeight: '900', letterSpacing: '-0.05em', color: '#0f172a', margin: '0 0 4px 0' }}>
                ACADEMIC PROGRESS REPORT
              </h1>
              <p style={{ color: '#08784b', fontWeight: 'bold', fontSize: '14px', letterSpacing: '0.2em', textTransform: 'uppercase', margin: 0 }}>
                Faculty of Engineering Technology · OUSL
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px 0' }}>
                Generated On
              </p>
              <p style={{ fontWeight: 'bold', color: '#334155', margin: 0 }}>
                {new Date().toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px', marginBottom: '40px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 4px 0' }}>
                  Student Name
                </p>
                <p style={{ fontSize: '20px', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
                  {studentName || "N/A"}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 4px 0' }}>
                  Specialization
                </p>
                <p style={{ fontSize: '18px', fontWeight: 'bold', color: '#334155', margin: 0 }}>
                  {selectedSpec}
                </p>
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.2em', margin: '0 0 4px 0' }}>
                  Programme
                </p>
                <p style={{ color: '#475569', fontWeight: '500', margin: 0 }}>
                  {currentProgramme?.name}
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px 0' }}>
                  Honours GPA
                </p>
                <p style={{ fontSize: '36px', fontWeight: '900', color: '#08784b', margin: 0 }}>
                  {gpaCalculation}
                </p>
              </div>
              <div style={{ padding: '24px', backgroundColor: '#f8fafc', borderRadius: '16px', border: '1px solid #f1f5f9', textAlign: 'center' }}>
                <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 4px 0' }}>
                  Total Credits
                </p>
                <p style={{ fontSize: '36px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                  {progressStats.totalCredits}
                </p>
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '32px', height: '4px', backgroundColor: '#08784b', borderRadius: '9999px' }} /> Credit
              Distribution
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', columnGap: '48px', rowGap: '16px' }}>
              {Object.entries(currentProgramme?.categories || {}).map(
                ([cat, req]: [string, unknown]) => {
                  const current = progressStats.categoryBreakdown[cat] || 0;
                  const percent = Math.min(100, (current / req.min) * 100);
                  return (
                    <div key={cat} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontWeight: 'bold' }}>
                        <span style={{ color: '#475569', textTransform: 'uppercase' }}>
                          {CATEGORIES[cat] || cat}
                        </span>
                        <span style={{ color: '#0f172a' }}>
                          {current} / {req.min} CR
                        </span>
                      </div>
                      <div style={{ height: '8px', backgroundColor: '#f1f5f9', borderRadius: '9999px', overflow: 'hidden' }}>
                        <div
                          style={{ height: '100%', backgroundColor: '#08784b', width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '48px' }}>
            <div>
              <h2 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '4px', backgroundColor: '#10b981', borderRadius: '9999px' }} /> Completed
                Courses
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {completedCourseDetails.length === 0 ? (
                  <p style={{ fontSize: '12px', fontStyle: 'italic', color: '#94a3b8' }}>
                    No courses completed.
                  </p>
                ) : (
                  completedCourseDetails.map((c) => (
                    <div
                      key={c.code}
                      style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}
                    >
                      <div>
                        <p style={{ fontSize: '9px', fontWeight: '900', color: '#08784b', textTransform: 'uppercase', margin: 0 }}>
                          {c.code}
                        </p>
                        <p style={{ fontSize: '11px', fontWeight: 'bold', color: '#0f172a', lineHeight: '1.2', margin: 0 }}>
                          {c.name}
                        </p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '10px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                          {c.credits} CR
                        </p>
                        <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#94a3b8', margin: 0 }}>
                          GPV: {completedCourses[c.code].toFixed(1)}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <h2 style={{ fontSize: '14px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.2em', color: '#0f172a', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <div style={{ width: '32px', height: '4px', backgroundColor: '#3b82f6', borderRadius: '9999px' }} /> Academic
                Timeline
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => {
                  const semCourses = plannedCourseDetails.filter(
                    (c) => userPlan[c.code] === sem,
                  );
                  if (semCourses.length === 0) return null;
                  return (
                    <div key={sem} style={{ position: 'relative', paddingLeft: '24px', borderLeft: '2px solid #f1f5f9' }}>
                      <div style={{ position: 'absolute', left: '-5px', top: 0, width: '8px', height: '8px', borderRadius: '9999px', backgroundColor: '#e2e8f0' }} />
                      <h3 style={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', color: '#94a3b8', marginBottom: '12px', letterSpacing: '0.1em' }}>
                        Semester {sem}
                      </h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {semCourses.map((c) => (
                          <div key={c.code} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '11px', fontWeight: 'bold', color: '#334155' }}>
                              {c.code} - {c.name}
                            </span>
                            <span style={{ fontSize: '11px', fontWeight: '900', color: '#94a3b8' }}>
                              {c.credits} CR
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
                {plannedCourseDetails.length === 0 && (
                  <p style={{ fontSize: '12px', fontStyle: 'italic', color: '#94a3b8' }}>
                    No courses planned.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '48px', paddingTop: '32px', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div>
              <p style={{ fontSize: '10px', fontWeight: '900', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>
                Estimated Tuition Fees
              </p>
              <p style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', margin: 0 }}>
                Rs. {feeSummary.total.toLocaleString()}
              </p>
              <p style={{ fontSize: '9px', color: '#94a3b8', marginTop: '4px', maxWidth: '300px', margin: '4px 0 0 0' }}>
                Fees are estimated based on planned courses and may vary based
                on actual university regulations.
              </p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '9px', fontWeight: 'bold', color: '#94a3b8', marginBottom: '4px', margin: 0 }}>
                Student Navigator Document
              </p>
              <p style={{ fontSize: '10px', fontFamily: 'Google Sans', fontWeight: '900', color: '#08784b', margin: 0 }}>
                prasadm.vercel.app
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuditCard({
  title,
  current,
  target,
}: {
  title: string;
  current: number;
  target: number;
}) {
  const isComplete = current >= target;
  return (
    <div
      className={`p-5 rounded-2xl border ${isComplete ? "bg-emerald-500/5 border-emerald-500/20" : "bg-card border-border"}`}
    >
      <p className="text-xs font-black uppercase text-muted-foreground mb-1">
        {title}
      </p>
      <div className="flex justify-between items-end">
        <p
          className={`text-2xl font-black ${isComplete ? "text-emerald-600" : "text-foreground"}`}
        >
          {current}{" "}
          <span className="text-sm font-normal text-muted-foreground">
            / {target}
          </span>
        </p>
        {isComplete && (
          <CheckCircle2 className="h-5 w-5 text-emerald-500 mb-1" />
        )}
      </div>
      <div className="mt-3 h-1.5 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ${isComplete ? "bg-emerald-500" : "bg-primary"}`}
          style={{ width: `${Math.min(100, (current / target) * 100)}%` }}
        />
      </div>
    </div>
  );
}

function DashboardStatCard({
  label,
  value,
  sublabel,
  icon: Icon,
  color,
}: {
  label: string;
  value: string;
  sublabel: string;
  icon: unknown;
  color: "primary" | "blue" | "emerald" | "amber";
}) {
  const containerRef = useRef(null);
  const valueRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(containerRef.current, {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out",
      });

      const numericValue = parseFloat(value);
      if (!isNaN(numericValue)) {
        gsap.from(valueRef.current, {
          innerText: 0,
          duration: 1.5,
          snap: { innerText: value.includes(".") ? 0.01 : 1 },
          ease: "power2.out",
        });
      }
    },
    { scope: containerRef, dependencies: [value] },
  );

  const colorClasses = {
    primary: "text-primary bg-primary/10 border-primary/20",
    blue: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    emerald: "text-emerald-500 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-500 bg-amber-500/10 border-amber-500/20",
  };

  return (
    <Card
      ref={containerRef}
      className="rounded-2xl border-primary/10 bg-card/50 backdrop-blur-sm overflow-hidden group hover:border-primary/30 transition-all duration-500 shadow-xl hover:shadow-2xl"
    >
      <CardContent className="p-5 md:p-6">
        <div className="flex justify-between items-start mb-4">
          <div
            className={`p-3 rounded-xl ${colorClasses[color]} border shadow-sm`}
          >
            <Icon className="h-6 w-6" />
          </div>
          <Badge
            variant="secondary"
            className="bg-primary/5 text-primary border-none rounded-lg text-xs font-black opacity-0 group-hover:opacity-100 transition-opacity"
          >
            LIVE TRACK
          </Badge>
        </div>
        <div className="space-y-1">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/60">
            {label}
          </p>
          <div className="flex items-baseline gap-1">
            <span
              ref={valueRef}
              className="text-3xl font-black font-serif tracking-tighter tabular-nums text-foreground"
            >
              {value}
            </span>
          </div>
          <p className="text-xs font-bold text-muted-foreground/80 pt-1">
            {sublabel}
          </p>
        </div>
      </CardContent>
      <div
        className={`h-1 w-full bg-gradient-to-r from-transparent via-${color === "primary" ? "primary" : color + "-500"}/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700`}
      />
    </Card>
  );
}
function CourseCard({
  course,
  isPlanned,
  isCompleted,
  onTogglePlan,
  onToggleComplete,
}: {
  course: unknown;
  isPlanned: boolean;
  isCompleted: boolean;
  onTogglePlan: () => void;
  onToggleComplete: () => void;
}) {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      gsap.from(containerRef.current, {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: "power2.out",
      });
    },
    { scope: containerRef },
  );

  return (
    <Card
      ref={containerRef}
      className="group relative overflow-hidden rounded-2xl border-primary/10 bg-card/40 backdrop-blur-sm transition-all duration-500 hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/5 flex flex-col"
    >
      <div className="p-4 space-y-3 flex-1 flex flex-col">
        <div className="flex justify-between items-start">
          <Badge
            variant="outline"
            className="font-font-mono border-primary/20 text-primary bg-primary/5 px-2 py-0.5 rounded-lg text-[10px]"
          >
            {course.code}
          </Badge>
          <div className="flex gap-1">
            <Badge
              variant="secondary"
              className="text-[9px] font-black bg-muted/40 rounded-md py-0"
            >
              L{course.level}
            </Badge>
            <Badge
              variant="secondary"
              className="text-[9px] font-black bg-muted/40 rounded-md py-0"
            >
              {course.credits}cr
            </Badge>
          </div>
        </div>

        <h4 className="font-bold leading-tight group-hover:text-primary transition-colors text-sm">
          {course.name}
        </h4>

        <div className="flex-1" />

        <div className="pt-3 border-t border-primary/5 flex justify-between items-center">
          <div className="flex gap-1.5">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isPlanned ? "default" : "outline"}
                    size="icon"
                    className={`h-8 w-8 rounded-lg transition-all duration-300 ${isPlanned ? "shadow-lg shadow-primary/25" : "hover:bg-primary/10 border-primary/10"}`}
                    onClick={onTogglePlan}
                  >
                    {isPlanned ? (
                      <Save className="h-3.5 w-3.5" />
                    ) : (
                      <Plus className="h-3.5 w-3.5" />
                    )}
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-xl font-bold text-[10px]">
                  {isPlanned ? "Planned" : "Plan this course"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant={isCompleted ? "default" : "outline"}
                    size="icon"
                    className={`h-8 w-8 rounded-lg transition-all duration-300 ${isCompleted ? "bg-emerald-500 hover:bg-emerald-600 border-none shadow-lg shadow-emerald-500/25" : "hover:bg-emerald-500/10 border-emerald-500/10 text-emerald-600/70 hover:text-emerald-600"}`}
                    onClick={onToggleComplete}
                  >
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="rounded-xl font-bold text-[10px]">
                  {isCompleted ? "Completed" : "Mark as completed"}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <Badge className="text-[9px] font-black bg-primary/5 text-primary/70 hover:bg-primary/10 rounded-lg px-2 py-0 border-none">
            {course.dept}
          </Badge>
        </div>
      </div>
      <div
        className={`absolute bottom-0 left-0 h-1 bg-primary/20 w-full transition-transform duration-500 ${isPlanned ? "scale-x-100" : "scale-x-0 group-hover:scale-x-50"}`}
      />
    </Card>
  );
}
