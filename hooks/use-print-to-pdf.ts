"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "sonner";

export function usePrintToPdf() {
  const [isPreparing, setIsPreparing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const startTimeRef = useRef<number>(0);
  const printTriggeredRef = useRef<boolean>(false);

  const handlePrint = useCallback(async () => {
    if (isPreparing || isPrinting) return;

    setIsPreparing(true);
    const toastId = toast.loading("Preparing PDF...", {
      description: "Optimizing layout for print...",
    });

    // Add data-printing attribute to html element
    document.documentElement.setAttribute("data-printing", "true");

    // Short delay to allow styles to initialize and toast to show
    await new Promise((resolve) => setTimeout(resolve, 500));

    try {
      startTimeRef.current = Date.now();
      printTriggeredRef.current = true;
      toast.dismiss(toastId);
      window.print();
    } catch (error) {
      console.error("Print failed:", error);
      toast.error("Unable to generate PDF. Please try again.", { id: toastId });
      document.documentElement.removeAttribute("data-printing");
      setIsPreparing(false);
      printTriggeredRef.current = false;
    }
  }, [isPreparing, isPrinting]);

  useEffect(() => {
    const handleAfterPrint = () => {
      if (!printTriggeredRef.current) return;

      document.documentElement.removeAttribute("data-printing");
      setIsPreparing(false);
      setIsPrinting(false);
      printTriggeredRef.current = false;

      const duration = Date.now() - startTimeRef.current;
      // Heuristic: if the print dialog was closed extremely quickly (e.g. < 1000ms),
      // it's likely the user cancelled or the browser blocked it.
      if (duration < 1000) {
        toast.info("PDF download cancelled", {
          duration: 3000,
        });
      } else {
        toast.success("PDF downloaded successfully", {
          duration: 4000,
        });
      }
    };

    const handleBeforePrint = () => {
      setIsPrinting(true);
    };

    // Fallback for browsers that don't support before/afterprint events reliably
    const mediaQueryList = window.matchMedia("print");
    const handleMediaChange = (mql: MediaQueryListEvent) => {
      if (!mql.matches && isPrinting) {
        handleAfterPrint();
      }
    };

    window.addEventListener("afterprint", handleAfterPrint);
    window.addEventListener("beforeprint", handleBeforePrint);
    mediaQueryList.addEventListener("change", handleMediaChange);

    return () => {
      window.removeEventListener("afterprint", handleAfterPrint);
      window.removeEventListener("beforeprint", handleBeforePrint);
      mediaQueryList.removeEventListener("change", handleMediaChange);
    };
  }, [isPrinting]);

  return {
    handlePrint,
    isPreparing,
    isPrinting,
  };
}
