"use client";

import React, { useState, useEffect } from "react";
import { CheckCircle2, XCircle, RefreshCcw, HelpCircle, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

interface Question {
  question: string;
  options: string[];
  answer: number;
  explanation: string;
}

interface QuizProps {
  title: string;
  questions: Question[];
}

export function Quiz({ title, questions }: QuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [answers, setAnswers] = useState<number[]>([]);

  const handleOptionSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
  };

  const handleSubmit = () => {
    if (selectedOption === null) {
      toast.error("Please select an option");
      return;
    }
    
    const isCorrect = selectedOption === questions[currentQuestion].answer;
    if (isCorrect) {
      setScore(score + 1);
      toast.success("Correct Answer!");
    } else {
      toast.error("Incorrect Answer");
    }
    
    setAnswers([...answers, selectedOption]);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setSelectedOption(null);
    setShowResult(false);
    setScore(0);
    setQuizComplete(false);
    setAnswers([]);
  };

  if (quizComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="my-8 p-8 rounded-3xl border border-primary/20 bg-primary/5 text-center"
      >
        <div className="h-20 w-20 rounded-full bg-primary/20 text-primary flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-3xl font-bold google-sans mb-2">Quiz Complete!</h3>
        <p className="text-muted-foreground google-sans mb-6">
          You scored <span className="text-primary font-bold text-2xl">{score}</span> out of <span className="font-bold">{questions.length}</span>
        </p>
        
        <div className="flex justify-center gap-4">
          <button
            onClick={resetQuiz}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            <RefreshCcw size={18} />
            Try Again
          </button>
        </div>
      </motion.div>
    );
  }

  const q = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="my-8 rounded-3xl border border-border/50 bg-card/50 backdrop-blur-xl overflow-hidden shadow-xl">
      <div className="p-6 border-b border-border/50 flex items-center justify-between bg-muted/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <HelpCircle size={20} />
          </div>
          <h3 className="font-bold text-lg google-sans">{title}</h3>
        </div>
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest google-sans">
          Question {currentQuestion + 1} of {questions.length}
        </span>
      </div>

      <div className="h-1 w-full bg-muted">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className="h-full bg-primary" 
        />
      </div>

      <div className="p-8">
        <h4 className="text-xl font-bold google-sans mb-8 leading-tight">
          {q.question}
        </h4>

        <div className="grid gap-4">
          {q.options.map((option, index) => {
            let state = "default";
            if (showResult) {
              if (index === q.answer) state = "correct";
              else if (index === selectedOption) state = "incorrect";
              else state = "dimmed";
            } else if (index === selectedOption) {
              state = "selected";
            }

            return (
              <button
                key={index}
                onClick={() => handleOptionSelect(index)}
                disabled={showResult}
                className={cn(
                  "flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all font-google-sans font-medium",
                  state === "default" && "border-border/50 hover:border-primary/50 hover:bg-primary/5",
                  state === "selected" && "border-primary bg-primary/10",
                  state === "correct" && "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
                  state === "incorrect" && "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400",
                  state === "dimmed" && "border-border/20 opacity-50"
                )}
              >
                <span className={cn(
                  "h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-colors",
                  state === "default" && "border-border text-muted-foreground",
                  state === "selected" && "border-primary bg-primary text-primary-foreground",
                  state === "correct" && "border-green-500 bg-green-500 text-white",
                  state === "incorrect" && "border-red-500 bg-red-500 text-white",
                  state === "dimmed" && "border-border/20 text-muted-foreground/30"
                )}>
                  {String.fromCharCode(65 + index)}
                </span>
                {option}
                {showResult && index === q.answer && <CheckCircle2 className="ml-auto text-green-500" size={20} />}
                {showResult && index === selectedOption && index !== q.answer && <XCircle className="ml-auto text-red-500" size={20} />}
              </button>
            );
          })}
        </div>

        <AnimatePresence>
          {showResult && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-8 p-6 rounded-2xl bg-muted/50 border border-border/50"
            >
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-2 google-sans">Explanation</p>
              <p className="text-sm text-foreground/80 leading-relaxed font-google-sans">
                {q.explanation}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="p-6 border-t border-border/50 bg-muted/20 flex justify-end">
        {!showResult ? (
          <button
            onClick={handleSubmit}
            className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-bold hover:scale-105 transition-all shadow-lg shadow-primary/20"
          >
            Check Answer
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-foreground text-background font-bold hover:scale-105 transition-all shadow-lg shadow-black/10"
          >
            {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
}
