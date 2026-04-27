"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

export function usePrintToPdf() {
  const [isPreparing, setIsPreparing] = useState(false);
  const [isPrinting, setIsPrinting] = useState(false);
  const printStartTimeRef = useRef<number>(0);

  useEffect(() => {
    const handleBeforePrint = () => {
      setIsPrinting(true);
      document.documentElement.setAttribute("data-printing", "true");
    };

    const handleAfterPrint = () => {
      setIsPrinting(false);
      document.documentElement.removeAttribute("data-printing");

      const duration = Date.now() - printStartTimeRef.current;

      if (duration < 500 && printStartTimeRef.current !== 0) {
        toast.info("PDF download cancelled", {
          icon: "ℹ️",
        });
      } else if (printStartTimeRef.current !== 0) {
        toast.success("PDF downloaded successfully", {
          icon: "✅",
          duration: 4000,
        });
      }
      printStartTimeRef.current = 0;
    };

    window.addEventListener("beforeprint", handleBeforePrint);
    window.addEventListener("afterprint", handleAfterPrint);

    const mediaQueryList = window.matchMedia("print");
    const handleChange = (mql: MediaQueryListEvent) => {
      if (mql.matches) {
        handleBeforePrint();
      } else {
        handleAfterPrint();
      }
    };

    mediaQueryList.addEventListener("change", handleChange);

    return () => {
      window.removeEventListener("beforeprint", handleBeforePrint);
      window.removeEventListener("afterprint", handleAfterPrint);
      mediaQueryList.removeEventListener("change", handleChange);
    };
  }, []);

  const handlePrint = useCallback(async () => {
    if (typeof window === "undefined" || !window.print) {
      toast.error("Printing is not supported in this browser.");
      return;
    }

    try {
      setIsPreparing(true);
      const loadingToast = toast.loading("Preparing PDF...", {
        description: "Applying professional A4 formatting",
      });

      // Force a re-render/reflow with print attributes
      document.documentElement.setAttribute("data-printing", "true");
      // Add a specific class to body for more aggressive CSS targeting
      document.body.classList.add("print-mode-active");

      // Give a small delay for styles to apply and UI to update
      await new Promise((resolve) => setTimeout(resolve, 500));

      setIsPreparing(false);
      toast.dismiss(loadingToast);

      printStartTimeRef.current = Date.now();
      window.print();

      // Cleanup after a delay in case afterprint didn't fire correctly
      setTimeout(() => {
        document.body.classList.remove("print-mode-active");
      }, 1000);

    } catch (error) {
      console.error("Print error:", error);
      toast.error("Unable to generate PDF. Please try again.", {
        duration: 5000,
      });
      document.documentElement.removeAttribute("data-printing");
      document.body.classList.remove("print-mode-active");
    } finally {
      setIsPreparing(false);
    }
  }, []);

  return {
    handlePrint,
    isPreparing,
    isPrinting,
  };
}
