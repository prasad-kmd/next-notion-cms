import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export interface PDFMetadata {
  title: string;
  author: string;
  date: string;
  slug: string;
}

const A4_WIDTH = 210; // mm
const A4_HEIGHT = 297; // mm
const MARGIN_LEFT = 25; // mm
const MARGIN_RIGHT = 25; // mm
const MARGIN_TOP = 30; // mm
const MARGIN_BOTTOM = 25; // mm

/**
 * Foolproof sanitization: literally removes problematic color function strings
 * from the HTML before it is processed.
 */
function nuclearSanitize(element: HTMLElement) {
  let html = element.innerHTML;

  // Replace modern color functions with safe fallbacks
  // We use regex to catch variations like oklch(0.5 0.1 200), lab(50 10 20), etc.
  const regexes = [
    /oklch\([^)]+\)/gi,
    /oklab\([^)]+\)/gi,
    /lab\([^)]+\)/gi,
    /hwb\([^)]+\)/gi
  ];

  regexes.forEach(re => {
    html = html.replace(re, "#000000"); // Default to black
  });

  element.innerHTML = html;
}

/**
 * Generates a PDF Blob using jsPDF.html() for better pagination and selectable text.
 */
export async function generatePDFBlob(
  element: HTMLElement,
  metadata: PDFMetadata,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  // 1. Create a clean render container
  const renderContainer = document.createElement("div");
  renderContainer.style.width = "160mm"; // Target width
  renderContainer.style.padding = "0";
  renderContainer.style.backgroundColor = "#ffffff";
  renderContainer.style.color = "#000000";
  renderContainer.className = "pdf-export-root";

  // 2. Add professional styles
  const style = document.createElement("style");
  style.textContent = `
    .pdf-export-root {
      font-family: 'Google Sans', 'Inter', sans-serif;
      line-height: 1.6;
      font-size: 11pt;
      color: #000000 !important;
    }
    .pdf-title-block { text-align: center; margin-bottom: 40px; border-bottom: 2px solid #eeeeee; padding-bottom: 20px; }
    .pdf-title-block h1 { font-size: 24pt; font-weight: bold; margin-bottom: 10px; color: #000000 !important; }
    .pdf-title-block p { font-size: 10pt; color: #666666 !important; }
    h2 { font-size: 18pt; font-weight: bold; margin-top: 30px; margin-bottom: 15px; color: #000000 !important; page-break-after: avoid; }
    h3 { font-size: 14pt; font-weight: bold; margin-top: 20px; margin-bottom: 10px; color: #000000 !important; page-break-after: avoid; }
    p { margin-bottom: 12px; }
    pre { background-color: #f5f5f5 !important; padding: 15px; border-radius: 8px; border: 1px solid #dddddd; overflow: hidden; margin: 20px 0; white-space: pre-wrap; font-size: 9pt; }
    code { font-family: 'Space Mono', monospace; background-color: #f5f5f5 !important; padding: 2px 4px; border-radius: 4px; }
    img { max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #dddddd; padding: 10px; text-align: left; }
    blockquote { border-left: 4px solid #dddddd; padding-left: 20px; font-style: italic; margin: 20px 0; color: #444444 !important; }
    * { box-shadow: none !important; animation: none !important; transition: none !important; }
  `;
  renderContainer.appendChild(style);

  // 3. Add Title Section
  const titleBlock = document.createElement("div");
  titleBlock.className = "pdf-title-block";
  titleBlock.innerHTML = `
    <h1>${metadata.title}</h1>
    <p>By ${metadata.author} | Published on ${metadata.date}</p>
  `;
  renderContainer.appendChild(titleBlock);

  // 4. Append the cleaned content
  const content = element.cloneNode(true) as HTMLElement;
  renderContainer.appendChild(content);

  // 5. NUCLEAR SANITIZE - This fixes the oklab/lab errors definitively
  nuclearSanitize(renderContainer);

  // 6. Off-screen rendering
  const hiddenDiv = document.createElement("div");
  hiddenDiv.style.position = "absolute";
  hiddenDiv.style.left = "-9999px";
  hiddenDiv.style.top = "0";
  hiddenDiv.appendChild(renderContainer);
  document.body.appendChild(hiddenDiv);

  try {
    // Wait for images
    const images = Array.from(renderContainer.querySelectorAll("img"));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
    }));

    const pdf = new jsPDF({
      orientation: "p",
      unit: "mm",
      format: "a4",
    });

    // Use .html() method for automatic paging and potentially selectable text
    await pdf.html(renderContainer, {
      callback: (doc) => {
        // Post-process to add headers/footers/page numbers
        const totalPages = doc.getNumberOfPages();
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i);

          // Header
          doc.setFontSize(8);
          doc.setTextColor(150);
          doc.text("PMEngineer.lk", MARGIN_LEFT, 15);
          const truncatedTitle = metadata.title.length > 50 ? metadata.title.substring(0, 47) + "..." : metadata.title;
          const titleWidth = doc.getStringUnitWidth(truncatedTitle) * 8 / doc.internal.scaleFactor;
          doc.text(truncatedTitle, A4_WIDTH - MARGIN_RIGHT - titleWidth, 15);
          doc.setDrawColor(230);
          doc.line(MARGIN_LEFT, 18, A4_WIDTH - MARGIN_RIGHT, 18);

          // Footer
          doc.line(MARGIN_LEFT, A4_HEIGHT - 15, A4_WIDTH - MARGIN_RIGHT, A4_HEIGHT - 15);
          doc.text(`Author: ${metadata.author}`, MARGIN_LEFT, A4_HEIGHT - 10);
          const pageText = `Page ${i} of ${totalPages}`;
          const pageTextWidth = doc.getStringUnitWidth(pageText) * 8 / doc.internal.scaleFactor;
          doc.text(pageText, (A4_WIDTH - pageTextWidth) / 2, A4_HEIGHT - 10);
          doc.text(metadata.date, A4_WIDTH - MARGIN_RIGHT - (doc.getStringUnitWidth(metadata.date) * 8 / doc.internal.scaleFactor), A4_HEIGHT - 10);
        }
      },
      x: MARGIN_LEFT,
      y: MARGIN_TOP,
      width: 160, // Width in units (mm)
      windowWidth: 800, // Matching the internal scale
      autoPaging: "text", // Best for selectable text and clean breaks
      html2canvas: {
        scale: 0.264583, // Magic number to convert px to mm (1/3.78)
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      }
    });

    return pdf.output("blob");
  } finally {
    document.body.removeChild(hiddenDiv);
  }
}
