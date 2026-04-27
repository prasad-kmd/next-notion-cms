"use client";

import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { toast } from "sonner";

interface PDFOptions {
  title: string;
  author?: string;
  date?: string;
  filename?: string;
}

/**
 * Exports a DOM element to PDF using html2canvas and jsPDF.
 * This approach is more robust against browser print UI inconsistencies.
 */
export async function exportToPDF(elementId: string, options: PDFOptions) {
  const element = document.getElementById(elementId);
  if (!element) {
    console.error("Element not found:", elementId);
    toast.error("Could not find content to export.");
    return;
  }

  const loadingToast = toast.loading("Generating PDF...", {
    description: "Preparing professional formatting and academic layout",
  });

  try {
    // 1. Prepare for capture: Apply a temporary class to body for global print-only CSS rules
    document.body.classList.add("is-generating-pdf");

    // Give a short delay for layout transitions
    await new Promise(resolve => setTimeout(resolve, 300));

    // 2. Capture the element
    const canvas = await html2canvas(element, {
      scale: 2, // Better resolution
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      // Important: Ensure the clone has the correct styling applied
      onclone: (clonedDoc) => {
        const clonedElement = clonedDoc.getElementById(elementId);
        if (clonedElement) {
          // Force visibility of print-only components in the clone
          const printOnlyElements = clonedDoc.querySelectorAll(".print-only");
          printOnlyElements.forEach(el => {
            if (el instanceof HTMLElement) {
              el.style.display = "flex";
              el.style.opacity = "1";
              el.style.visibility = "visible";
            }
          });

          // Force white background and black text on the container to avoid OKLCH parsing issues
          clonedElement.style.backgroundColor = "#ffffff";
          clonedElement.style.color = "#000000";

          // Recursively set styles for children if needed (optional but safer)
          const allChildren = clonedElement.querySelectorAll("*");
          allChildren.forEach(child => {
             if (child instanceof HTMLElement) {
               // We don't want to override everything, just ensure basic readability
               if (window.getComputedStyle(child).backgroundColor.includes("oklch")) {
                 child.style.backgroundColor = "transparent";
               }
             }
          });
        }

        // Ensure the navbar/sidebar are hidden in the clone, even if CSS fails
        const hideElements = clonedDoc.querySelectorAll('[data-print-hide="true"], nav, footer:not(.print-footer), aside');
        hideElements.forEach(el => {
          if (el instanceof HTMLElement) el.style.display = "none";
        });
      }
    });

    // 3. Create PDF
    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4"
    });

    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    const imgProps = pdf.getImageProperties(imgData);
    const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;

    let heightLeft = imgHeight;
    let position = 0;

    // Add first page
    pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
    heightLeft -= pdfHeight;

    // Add subsequent pages if content overflows
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "JPEG", 0, position, pdfWidth, imgHeight);
      heightLeft -= pdfHeight;
    }

    // 4. Finalize
    pdf.save(options.filename || `${options.title.replace(/\s+/g, "-").toLowerCase()}.pdf`);

    toast.success("PDF exported successfully", {
      icon: "✅",
      description: "Your document is ready for viewing.",
      duration: 4000
    });
  } catch (error) {
    console.error("PDF generation failed:", error);
    toast.error("Unable to generate PDF. Falling back to browser print...", {
      duration: 5000
    });
    // Fallback to native print
    window.print();
  } finally {
    document.body.classList.remove("is-generating-pdf");
    toast.dismiss(loadingToast);
  }
}
