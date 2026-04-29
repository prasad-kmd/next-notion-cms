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
const CONTENT_WIDTH = A4_WIDTH - MARGIN_LEFT - MARGIN_RIGHT; // 160 mm
const CONTENT_HEIGHT = A4_HEIGHT - MARGIN_TOP - MARGIN_BOTTOM; // 242 mm

/**
 * Sanitizes an element and its children by replacing unsupported color functions
 * (oklab, oklch, lab, hwb) and CSS variables with safe alternatives.
 */
function sanitizeColors(element: HTMLElement) {
  // Reset common CSS variables that might contain oklch/oklab/lab
  element.style.setProperty("--primary", "#0d9488");
  element.style.setProperty("--secondary", "#0f766e");
  element.style.setProperty("--background", "#ffffff");
  element.style.setProperty("--foreground", "#000000");
  element.style.setProperty("--border", "#dddddd");
  element.style.setProperty("--muted", "#f5f5f5");
  element.style.setProperty("--muted-foreground", "#666666");

  const unsupportedColorFunctions = ["oklab", "oklch", "lab(", "hwb("];

  const elements = element.querySelectorAll("*");
  elements.forEach((el) => {
    const htmlEl = el as HTMLElement;
    const style = window.getComputedStyle(htmlEl);

    const checkColor = (color: string) => {
      return unsupportedColorFunctions.some(func => color.includes(func));
    };

    // Explicitly override colors that might use unsupported functions
    if (checkColor(style.color)) {
      htmlEl.style.setProperty("color", "#000000", "important");
    }
    if (checkColor(style.backgroundColor)) {
      if (htmlEl.tagName === "PRE" || htmlEl.tagName === "CODE") {
        htmlEl.style.setProperty("background-color", "#f5f5f5", "important");
      } else {
        htmlEl.style.setProperty("background-color", "transparent", "important");
      }
    }
    if (checkColor(style.borderColor)) {
      htmlEl.style.setProperty("border-color", "#dddddd", "important");
    }

    // Also strip any custom variables that might be using these functions
    const inlineStyle = htmlEl.style;
    for (let i = 0; i < inlineStyle.length; i++) {
      const prop = inlineStyle[i];
      const val = inlineStyle.getPropertyValue(prop);
      if (prop.startsWith("--") && checkColor(val)) {
        htmlEl.style.removeProperty(prop);
      }
    }
  });
}

/**
 * Generates a PDF Blob from a cleaned HTML element with intelligent pagination.
 */
export async function generatePDFBlob(
  element: HTMLElement,
  metadata: PDFMetadata,
  onProgress?: (current: number, total: number) => void
): Promise<Blob> {
  // Create a hidden container for rendering
  const container = document.createElement("div");
  container.id = "pdf-gen-main-container";
  container.style.position = "absolute";
  container.style.left = "-9999px";
  container.style.top = "0";
  container.style.width = "800px";
  container.style.backgroundColor = "#ffffff";
  container.style.color = "#000000";
  container.style.padding = "0";
  container.className = "pdf-render-container accessibility-content-area";

  // Apply forced light mode styles with SAFE colors (Hex/RGB only)
  const styleTag = document.createElement("style");
  styleTag.textContent = `
    .pdf-render-container {
      font-family: 'Google Sans', 'Inter', sans-serif;
      line-height: 1.6;
      font-size: 11pt;
      color: #000000 !important;
      background-color: #ffffff !important;
    }
    .pdf-title-section { text-align: center; margin-bottom: 40px; color: #000000 !important; }
    .pdf-render-container h1 { font-size: 24pt; font-weight: bold; margin-bottom: 10px; text-align: center; color: #000000 !important; }
    .pdf-render-container h2 { font-size: 18pt; font-weight: bold; margin-top: 30px; margin-bottom: 15px; border-bottom: 1px solid #eeeeee; color: #000000 !important; page-break-after: avoid; }
    .pdf-render-container h3 { font-size: 14pt; font-weight: bold; margin-top: 20px; margin-bottom: 10px; color: #000000 !important; page-break-after: avoid; }
    .pdf-render-container p { margin-bottom: 12px; color: #000000 !important; }
    .pdf-render-container code { font-family: 'Space Mono', monospace; background-color: #f5f5f5 !important; padding: 2px 4px; border-radius: 4px; font-size: 9pt; color: #000000 !important; }
    .pdf-render-container pre { background-color: #f5f5f5 !important; padding: 15px; border-radius: 8px; border: 1px solid #dddddd; overflow: hidden; margin-bottom: 20px; white-space: pre-wrap; word-wrap: break-word; color: #000000 !important; }
    .pdf-render-container pre code { background-color: transparent !important; padding: 0; font-size: 9pt; color: #000000 !important; }
    .pdf-render-container img { max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; display: block; }
    .pdf-render-container table { width: 100%; border-collapse: collapse; margin: 20px 0; page-break-inside: auto; }
    .pdf-render-container tr { page-break-inside: avoid; page-break-after: auto; }
    .pdf-render-container th, .pdf-render-container td { border: 1px solid #dddddd; padding: 10px; text-align: left; color: #000000 !important; }
    .pdf-render-container th { background-color: #f9f9f9 !important; font-weight: bold; }
    .pdf-render-container blockquote { border-left: 4px solid #dddddd; padding-left: 20px; font-style: italic; margin: 20px 0; color: #444444 !important; }
    .pdf-render-container * { box-shadow: none !important; animation: none !important; transition: none !important; }
  `;
  container.appendChild(styleTag);

  const titleSection = document.createElement("div");
  titleSection.className = "pdf-title-section";
  titleSection.innerHTML = `
    <h1 style="color: #000000 !important;">${metadata.title}</h1>
    <div style="color: #666666 !important; font-size: 10pt;">
      <span>By ${metadata.author}</span> | <span>${metadata.date}</span>
    </div>
  `;
  container.appendChild(titleSection);

  const contentWrapper = document.createElement("div");
  contentWrapper.appendChild(element);
  container.appendChild(contentWrapper);

  document.body.appendChild(container);

  // Initial sanitization
  sanitizeColors(container);

  try {
    const images = Array.from(container.querySelectorAll("img"));
    await Promise.all(images.map(img => {
      if (img.complete) return Promise.resolve();
      return new Promise(resolve => { img.onload = resolve; img.onerror = resolve; });
    }));

    const pdf = new jsPDF("p", "mm", "a4");
    const pxToMm = CONTENT_WIDTH / 800;
    const pageHeightPx = CONTENT_HEIGHT / pxToMm;

    const blocks = Array.from(contentWrapper.children[0].children) as HTMLElement[];
    const allBlocks = [titleSection, ...blocks];

    let currentPageBlocks: HTMLElement[] = [];
    let currentHeightPx = 0;
    let pageNum = 1;

    const renderPage = async (pageBlocks: HTMLElement[]) => {
      const pageContainer = document.createElement("div");
      pageContainer.id = `pdf-page-${pageNum}`;
      pageContainer.style.position = "absolute";
      pageContainer.style.left = "-9999px";
      pageContainer.style.top = "0";
      pageContainer.style.width = "800px";
      pageContainer.style.backgroundColor = "#ffffff";
      pageContainer.style.color = "#000000";
      pageContainer.className = "pdf-render-container";

      const pageStyle = styleTag.cloneNode(true);
      pageContainer.appendChild(pageStyle);

      const pageContent = document.createElement("div");
      pageBlocks.forEach(b => pageContent.appendChild(b.cloneNode(true)));
      pageContainer.appendChild(pageContent);

      document.body.appendChild(pageContainer);

      try {
        sanitizeColors(pageContainer);

        const canvas = await html2canvas(pageContainer, {
          scale: 2,
          useCORS: true,
          backgroundColor: "#ffffff",
          logging: false,
        });

        if (pageNum > 1) pdf.addPage();
        const imgData = canvas.toDataURL("image/jpeg", 0.95);
        pdf.addImage(imgData, "JPEG", MARGIN_LEFT, MARGIN_TOP, CONTENT_WIDTH, (canvas.height * CONTENT_WIDTH) / canvas.width);

        if (onProgress) onProgress(pageNum, 0);
        pageNum++;
      } finally {
        if (pageContainer.parentNode) {
          pageContainer.parentNode.removeChild(pageContainer);
        }
      }
    };

    for (const block of allBlocks) {
      const blockHeight = block.getBoundingClientRect().height;

      if (currentHeightPx + blockHeight > pageHeightPx && currentPageBlocks.length > 0) {
        await renderPage(currentPageBlocks);
        currentPageBlocks = [block];
        currentHeightPx = blockHeight;
      } else {
        currentPageBlocks.push(block);
        currentHeightPx += blockHeight;
      }
    }

    if (currentPageBlocks.length > 0) {
      await renderPage(currentPageBlocks);
    }

    const totalPages = pdf.getNumberOfPages();

    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);

      pdf.text("PMEngineer.lk", MARGIN_LEFT, MARGIN_TOP - 10);
      const displayTitle = metadata.title.length > 60 ? metadata.title.substring(0, 57) + "..." : metadata.title;
      const titleWidth = pdf.getStringUnitWidth(displayTitle) * 8 / pdf.internal.scaleFactor;
      pdf.text(displayTitle, A4_WIDTH - MARGIN_RIGHT - titleWidth, MARGIN_TOP - 10);
      pdf.setDrawColor(230, 230, 230);
      pdf.line(MARGIN_LEFT, MARGIN_TOP - 7, A4_WIDTH - MARGIN_RIGHT, MARGIN_TOP - 7);

      pdf.line(MARGIN_LEFT, A4_HEIGHT - MARGIN_BOTTOM + 7, A4_WIDTH - MARGIN_RIGHT, A4_HEIGHT - MARGIN_BOTTOM + 7);
      pdf.text(`Author: ${metadata.author}`, MARGIN_LEFT, A4_HEIGHT - MARGIN_BOTTOM + 12);
      const pageText = `Page ${i} of ${totalPages}`;
      const pageTextWidth = pdf.getStringUnitWidth(pageText) * 8 / pdf.internal.scaleFactor;
      pdf.text(pageText, (A4_WIDTH - pageTextWidth) / 2, A4_HEIGHT - MARGIN_BOTTOM + 12);
      pdf.text(metadata.date, A4_WIDTH - MARGIN_RIGHT - (pdf.getStringUnitWidth(metadata.date) * 8 / pdf.internal.scaleFactor), A4_HEIGHT - MARGIN_BOTTOM + 12);
    }

    return pdf.output("blob");
  } finally {
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  }
}
