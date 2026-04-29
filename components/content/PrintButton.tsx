"use client";

import React, { useState } from "react";
import { Printer, Loader2, Check, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { extractCleanContent, validateContent } from "@/lib/pdf/content-extractor";
import { generatePDFBlob } from "@/lib/pdf/pdf-generator";

interface PrintButtonProps {
  postTitle: string;
  authorName: string;
  publishDate: string;
  postSlug: string;
  contentSelector: string;
  className?: string;
}

/**
 * A high-fidelity PDF export button that generates professional A4 PDFs
 * using jsPDF and html2canvas.
 */
export function PrintButton({
  postTitle,
  authorName,
  publishDate,
  postSlug,
  contentSelector,
  className,
}: PrintButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadPDF = async () => {
    if (isGenerating) return;

    setIsGenerating(true);
    const toastId = toast.loading("Preparing PDF...", {
      description: "Extracting content and preparing layout",
    });

    try {
      // 1. Find the content container in the DOM
      const container = document.querySelector(contentSelector) as HTMLElement;
      if (!container) {
        throw new Error(`Content container not found: ${contentSelector}`);
      }

      // 2. Extract and clean content (remove UI, etc.)
      const cleanedElement = extractCleanContent(container);

      // 3. Validate that we have actual content
      if (!validateContent(cleanedElement)) {
        throw new Error("No meaningful content found to export.");
      }

      // 4. Generate the PDF Blob
      const blob = await generatePDFBlob(
        cleanedElement,
        {
          title: postTitle,
          author: authorName,
          date: publishDate,
          slug: postSlug,
        },
        (current, total) => {
          // Update progress toast for long documents
          toast.loading(`Generating page ${current} of ${total}...`, {
            id: toastId,
          });
        }
      );

      // 5. Create a download link and trigger it
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");

      // Format: post-slug-YYYY-MM-DD.pdf
      const sanitizedSlug = postSlug
        .toLowerCase()
        .replace(/[^a-z0-9-_]/g, "-")
        .substring(0, 50);

      let dateStr = "undated";
      try {
        dateStr = new Date(publishDate).toISOString().split("T")[0];
      } catch (e) {
        // Fallback if date is invalid
        console.warn("Invalid date for PDF filename:", publishDate);
      }

      const filename = `${sanitizedSlug}-${dateStr}.pdf`;

      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Cleanup the object URL
      setTimeout(() => URL.revokeObjectURL(url), 100);

      toast.success("PDF downloaded successfully!", {
        id: toastId,
        icon: <Check className="h-4 w-4 text-green-500" />,
        description: `Saved as ${filename}`,
      });
    } catch (error) {
      console.error("PDF generation error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate PDF. Please try again.", {
        id: toastId,
        icon: <AlertCircle className="h-4 w-4 text-red-500" />,
        action: {
          label: "Retry",
          onClick: () => handleDownloadPDF(),
        },
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={handleDownloadPDF}
      disabled={isGenerating}
      className={cn(
        "inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-all hover:bg-primary/10 relative group google-sans",
        isGenerating
          ? "border-primary/50 bg-primary/5 text-primary cursor-wait"
          : "border-border text-muted-foreground",
        className
      )}
      aria-label="Download as PDF"
      type="button"
    >
      {isGenerating ? (
        <Loader2 className="h-4 w-4 animate-spin text-primary" />
      ) : (
        <Printer className="h-4 w-4 transition-transform group-hover:scale-110" />
      )}
      <span>{isGenerating ? "Generating..." : "PDF"}</span>

      {/* Tooltip */}
      <span className="absolute left-1/2 -bottom-10 -translate-x-1/2 px-2 py-1 bg-popover text-popover-foreground text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-border shadow-sm z-50">
        Download as PDF
      </span>
    </button>
  );
}
