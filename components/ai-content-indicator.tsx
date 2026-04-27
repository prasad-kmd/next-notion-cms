"use client";

import * as React from "react";
import { Sparkles, Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

export function AIContentIndicator() {
  return (
    <div
      className="fixed bottom-[2rem] right-[5.5rem] z-[99]"
      data-print-hide="true"
    >
      <Dialog>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <DialogTrigger asChild>
              <button
                className="flex h-11 w-11 items-center justify-center rounded-full bg-card shadow-lg transition-all hover:scale-110 active:scale-95 group border border-border/50 hover:border-primary/50"
                aria-label="AI Generated Content Information"
              >
                <Sparkles className="h-5 w-5 text-primary transition-transform group-hover:rotate-12" />
              </button>
            </DialogTrigger>
          </TooltipTrigger>
          <TooltipContent side="left" className="max-w-[200px] text-center">
            <p>Some of or full content may be generated via using AI</p>
          </TooltipContent>
        </Tooltip>

        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI-Assisted Content
            </DialogTitle>
            <DialogDescription className="pt-4 text-base leading-relaxed">
              To provide you with the most accurate and up-to-date information,
              parts of this page&apos;s content have been drafted or refined
              using <b>Artificial Intelligence</b>.
              <br />
              <br />
              While we leverage AI to enhance efficiency and coverage, all
              content is manually reviewed and edited by our team to maintain
              high quality and reliability.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex flex-col gap-4">
            <div className="rounded-lg bg-muted p-4 border border-border/50">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-primary mt-0.5" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">Why we use AI</p>
                  <p className="text-sm text-muted-foreground">
                    It helps us summarize complex information, generate
                    examples, and ensure consistent tone across different
                    sections.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
