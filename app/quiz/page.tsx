import { getContentByType } from "@/lib/content"
import { QuizList } from "@/components/quiz-library/quiz-list"

export const metadata = {
  title: "Quiz Library",
  description: "Challenge your engineering knowledge with our interactive quizzes.",
}

export default function QuizListPage() {
  const quizzes = getContentByType("quizzes")

  return (
    <div className="min-h-screen px-6 py-12 lg:px-8 bg-background">
      <div className="mx-auto max-w-6xl">
        <header className="mb-12">
          <h1 className="mb-4 text-4xl font-bold mozilla-headline lg:text-5xl">Quiz Library</h1>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl google-sans">
            Challenge your engineering knowledge with our interactive quizzes. Track your progress and master new concepts.
          </p>
        </header>

        <QuizList quizzes={quizzes} />
      </div>
    </div>
  )
}
