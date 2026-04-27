"use client";

import { Printer } from "lucide-react";
import { usePrintToPdf } from "@/hooks/use-print-to-pdf";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PrintButtonProps {
  postTitle: string;
  authorName: string;
  publishDate: string;
  contentElementId?: string;
}

export function PrintButton({
  postTitle,
  authorName,
  publishDate,
  contentElementId
}: PrintButtonProps) {
  const { handlePrint, isPreparing } = usePrintToPdf();

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={handlePrint}
            disabled={isPreparing}
            className="p-2.5 rounded-[0.625rem] bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:text-[hsl(181,100%,28%)] dark:hover:text-[hsl(181,100%,28%)] transition-all duration-200 border border-zinc-200 dark:border-zinc-700 hover:border-[hsl(181,100%,28%)] dark:hover:border-[hsl(181,100%,28%)] disabled:opacity-50 group"
            aria-label={`Download ${postTitle} as PDF`}
          >
            <Printer className="w-5 h-5 group-hover:scale-110 transition-transform" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="top"
          className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-950 dark:text-zinc-50"
        >
          <p>Download as PDF</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
