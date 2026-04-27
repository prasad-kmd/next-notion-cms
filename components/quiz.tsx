"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, ChevronRight, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation?: string;
}

export interface QuizProps {
  id?: string;
  title?: string;
  questions: Question[];
}

export function Quiz({ id, title, questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const handleOptionSelect = (index: number) => {
    if (isAnswered) return;
    setSelectedOption(index);
  };

  const handleCheckAnswer = () => {
    if (selectedOption === null) return;

    if (selectedOption === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
    setIsAnswered(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setShowResult(true);
      if (id) {
        const status = {
          completed: true,
          score: score,
          total: questions.length,
          date: new Date().toISOString(),
        };
        localStorage.setItem(`quiz_status_${id}`, JSON.stringify(status));
        // Dispatch event to notify other components (like the list page)
        window.dispatchEvent(new Event("quiz_updated"));
      }
    }
  };

  const handleReset = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setScore(0);
    setShowResult(false);
  };

  if (!questions || questions.length === 0) {
    return (
      <Card className="my-8 border-red-500/50 bg-red-500/5">
        <CardContent className="pt-6 text-center text-red-500">
          No questions provided for this quiz.
        </CardContent>
      </Card>
    );
  }

  if (showResult) {
    const percentage = Math.round((score / questions.length) * 100);

    return (
      <Card className="my-8 overflow-hidden border-2 border-primary/20 bg-background/50 backdrop-blur-sm animate-in zoom-in-95 duration-300">
        <CardHeader className="bg-primary/5 text-center pb-8 pt-8 border-b">
          <CardTitle className="text-2xl font-google-sans">
            Quiz Completed!
          </CardTitle>
          <div className="mt-4 flex flex-col items-center">
            <div className="relative h-24 w-24 flex items-center justify-center mb-4">
              <svg className="h-full w-full transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-muted/20"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={
                    2 * Math.PI * 40 * (1 - score / questions.length)
                  }
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">{percentage}%</span>
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mb-2">
              {score} / {questions.length}
            </div>
            <p className="text-muted-foreground font-google-sans">
              {score === questions.length
                ? "Perfect score! You're an expert."
                : score >= questions.length / 2
                  ? "Great job! You have a good understanding."
                  : "Keep learning and try again!"}
            </p>
          </div>
        </CardHeader>
        <CardFooter className="justify-center py-6 bg-muted/5">
          <Button
            onClick={handleReset}
            variant="outline"
            className="gap-2 font-google-sans"
          >
            <RotateCcw className="h-4 w-4" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  const question = questions[currentQuestion];

  return (
    <Card className="my-8 overflow-hidden border-border bg-background/50 backdrop-blur-sm shadow-lg interactive-quiz-card">
      <CardHeader className="border-b bg-muted/30 py-4">
        <div className="flex items-center justify-between mb-2">
          <Badge
            variant="secondary"
            className="font-mono text-[10px] uppercase tracking-wider"
          >
            Question {currentQuestion + 1} of {questions.length}
          </Badge>
          {title && (
            <span className="text-xs font-semibold text-muted-foreground font-google-sans uppercase tracking-widest">
              {title}
            </span>
          )}
        </div>
        <CardTitle className="text-xl font-google-sans leading-tight text-foreground">
          {question.question}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6 pb-6">
        <div className="grid gap-3">
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = isAnswered && index === question.answer;
            const isWrong =
              isAnswered && isSelected && index !== question.answer;

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={isAnswered}
                className={cn(
                  "flex items-center justify-between rounded-xl border-2 p-4 text-left transition-all duration-200",
                  !isAnswered &&
                    "hover:border-primary/40 hover:bg-primary/5 active:scale-[0.98]",
                  !isAnswered &&
                    isSelected &&
                    "border-primary bg-primary/10 shadow-sm",
                  isAnswered &&
                    isCorrect &&
                    "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
                  isAnswered &&
                    isWrong &&
                    "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400",
                  isAnswered &&
                    !isCorrect &&
                    !isWrong &&
                    "opacity-40 grayscale-[0.5]",
                  !isSelected &&
                    !isAnswered &&
                    "border-transparent bg-muted/50",
                )}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={cn(
                      "flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold",
                      isSelected
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted-foreground/30 text-muted-foreground",
                      isAnswered &&
                        isCorrect &&
                        "border-green-500 bg-green-500 text-white",
                      isAnswered &&
                        isWrong &&
                        "border-red-500 bg-red-500 text-white",
                    )}
                  >
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="font-medium">{option}</span>
                </div>
                {isAnswered && isCorrect && (
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-green-500" />
                )}
                {isAnswered && isWrong && (
                  <XCircle className="h-5 w-5 shrink-0 text-red-500" />
                )}
              </button>
            );
          })}
        </div>

        {isAnswered && question.explanation && (
          <div className="mt-6 rounded-xl bg-primary/5 border border-primary/10 p-4 text-sm text-muted-foreground animate-in slide-in-from-top-2 duration-300">
            <p className="font-bold text-foreground mb-1 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              Explanation
            </p>
            {question.explanation}
          </div>
        )}
      </CardContent>
      <CardFooter className="border-t bg-muted/5 py-4 justify-between">
        {!isAnswered ? (
          <Button
            onClick={handleCheckAnswer}
            disabled={selectedOption === null}
            className="w-full sm:w-auto font-google-sans px-8 h-11"
          >
            Check Answer
          </Button>
        ) : (
          <Button
            onClick={handleNextQuestion}
            className="w-full sm:w-auto gap-2 font-google-sans px-8 h-11 transition-all hover:gap-3"
          >
            {currentQuestion + 1 < questions.length
              ? "Next Question"
              : "See Results"}
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
