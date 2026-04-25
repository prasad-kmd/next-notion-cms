"use client"

import { useState, useEffect, startTransition, useCallback } from "react"
import { Search, Filter, CheckCircle2, Trophy, ArrowRight } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Quiz {
  slug: string
  title: string
  description: string
  category?: string
}

interface QuizStatus {
  completed: boolean
  score: number
  total: number
}

interface QuizListProps {
  quizzes: Quiz[]
}

export function QuizList({ quizzes }: QuizListProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [quizStatuses, setQuizStatuses] = useState<Record<string, QuizStatus>>({})

  const loadStatuses = useCallback(() => {
    const statuses: Record<string, QuizStatus> = {}
    quizzes.forEach(q => {
      const stored = localStorage.getItem(`quiz_status_${q.slug}`)
      if (stored) {
        try {
          statuses[q.slug] = JSON.parse(stored)
        } catch (e) {
          console.error("Failed to parse quiz status", e)
        }
      }
    })
    setQuizStatuses(statuses)
  }, [quizzes])

  useEffect(() => {
    startTransition(() => {
      loadStatuses()
    })
    const handleUpdate = () => startTransition(() => {
      loadStatuses()
    })
    window.addEventListener('quiz_updated', handleUpdate)
    return () => window.removeEventListener('quiz_updated', handleUpdate)
  }, [loadStatuses])

  const categories = ["All", ...Array.from(new Set(quizzes.map(q => q.category || "General")))]

  const filteredQuizzes = quizzes.filter(q => {
    const matchesSearch = q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          q.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "All" || (q.category || "General") === selectedCategory
    return matchesSearch && matchesCategory
  })

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search quizzes..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
          {categories.map(category => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className="whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredQuizzes.map((quiz) => {
          const status = quizStatuses[quiz.slug]
          const isCompleted = status?.completed

          return (
            <Card key={quiz.slug} className="group flex flex-col overflow-hidden border-border bg-card transition-all hover:border-primary/50 hover:shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-2">
                  <Badge variant="secondary" className="font-google-sans">
                    {quiz.category || "General"}
                  </Badge>
                  {isCompleted && (
                    <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20 gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Completed
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-google-sans group-hover:text-primary transition-colors">
                  {quiz.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <p className="text-sm text-muted-foreground line-clamp-3 mb-4 local-inter">
                  {quiz.description}
                </p>

                {isCompleted && (
                  <div className="rounded-lg bg-muted/50 p-3 flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      Best Score
                    </div>
                    <span className="font-bold">{status.score} / {status.total}</span>
                  </div>
                )}
              </CardContent>
              <CardFooter className="pt-0 pb-6 border-t-0">
                <Button asChild className="w-full gap-2 font-google-sans">
                  <Link href={`/quiz/${quiz.slug}`}>
                    {isCompleted ? "Retake Quiz" : "Start Quiz"}
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )
        })}
      </div>

      {filteredQuizzes.length === 0 && (
        <div className="py-20 text-center">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
            <Search className="h-10 w-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold google-sans">No quizzes found</h3>
          <p className="text-muted-foreground mt-2">Try adjusting your search or filters.</p>
          <Button
            variant="link"
            onClick={() => {setSearchQuery(""); setSelectedCategory("All")}}
            className="mt-2"
          >
            Clear all filters
          </Button>
        </div>
      )}
    </>
  )
}
