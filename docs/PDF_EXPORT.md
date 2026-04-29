# Refined PDF Export System

The PDF export system provides high-fidelity, professional A4 PDF generation for all technical content on the platform. It leverages `jsPDF` and `html2canvas` to provide a robust, theme-independent export experience.

## Architecture

The system consists of three main parts:

1.  **Content Extractor (`lib/pdf/content-extractor.ts`)**:
    - Clones the target content DOM.
    - Removes all website UI elements (navigation, footers, sidebars, TOC, etc.).
    - Sanitizes the HTML by removing scripts and inline event handlers.
    - Replaces interactive elements (like iframes) with static placeholders.
    - Ensures the content is meaningful before proceeding.

2.  **PDF Generator Engine (`lib/pdf/pdf-generator.ts`)**:
    - Creates a hidden, off-screen render container.
    - Forces light mode styling (black text on white background) using dedicated PDF-specific CSS.
    - Captures the content as a high-resolution canvas (2x scale).
    - Handles pagination by splitting the tall canvas into A4-sized chunks.
    - Injects custom headers and footers with metadata and page numbers.

3.  **UI Component (`components/content/PrintButton.tsx`)**:
    - Provides a consistent "PDF" action button in the post toolbar.
    - Manages the generation state and user feedback via Sonner toasts.
    - Triggers the browser download with a standardized filename: `post-slug-YYYY-MM-DD.pdf`.

## Inclusion & Exclusion

### Excluding Elements

To prevent an element from appearing in the PDF, add the `data-pdf-exclude` attribute:

```html
<div data-pdf-exclude>
  This will not appear in the PDF.
</div>
```

The system also automatically excludes common selectors like `nav`, `footer`, `aside`, `.comments-section`, etc.

### Identifying Content

The `PrintButton` targets a specific container identified by the `data-pdf-content` attribute:

```html
<article>
  <div data-pdf-content>
    <!-- Core content goes here -->
  </div>
</article>
```

## PDF Configuration

- **Format**: A4 (210mm x 297mm)
- **Margins**:
  - Top: 30mm (accommodates header)
  - Bottom: 25mm (accommodates footer)
  - Left/Right: 25mm
- **Typography**:
  - Body: 11pt Google Sans / Inter
  - Headings: 24pt (H1), 18pt (H2), 14pt (H3)
  - Code: 9pt Space Mono with light gray background

## Troubleshooting

### Images not appearing
Ensure images have proper CORS headers if they are hosted on a different domain. The generator uses `useCORS: true`, but the server must still permit it.

### Content is cut off
If content is cut off at the bottom of a page, check for large elements that cannot be split (like very tall images). The system splits the canvas mathematically, which usually handles text well but may occasionally split an image.

### Generation is slow
Very long posts (50+ pages) may take 10-20 seconds to generate as they require rendering a very large canvas. The system provides real-time progress updates via toasts.

### Color Parsing Errors
`html2canvas` (v1.4.1) does not support modern color functions like `oklab()`, `oklch()`, `lab()`, or `hwb()`. The PDF generator includes a `sanitizeColors` utility that automatically replaces these with Hex/RGB equivalents during the off-screen rendering process to prevent crashes. It also sanitizes CSS variables that might hold these values.

### Selectable Text
To preserve the complex layout of technical content (including KaTeX equations and Shiki syntax highlighting), the system renders the main content area as high-resolution images within the PDF. While headers and footers contain real, selectable text, the main body is currently non-selectable to ensure 100% visual fidelity across all devices and browsers.
