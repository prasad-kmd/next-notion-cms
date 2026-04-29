/**
 * Utility functions for extracting and cleaning content from the DOM
 * for high-fidelity PDF generation.
 */

/**
 * Deep clones an element and removes all UI-related components,
 * leaving only the core content for the PDF.
 */
export function extractCleanContent(container: HTMLElement): HTMLElement {
  // Deep clone the container
  const clone = container.cloneNode(true) as HTMLElement;

  // 1. Remove elements with data-pdf-exclude attribute
  const excludedByAttribute = clone.querySelectorAll("[data-pdf-exclude]");
  excludedByAttribute.forEach((el) => el.remove());

  // 2. Remove common UI elements by selector
  const uiSelectors = [
    "nav",
    "footer",
    "aside",
    ".table-of-contents",
    ".toc-sidebar",
    ".breadcrumb",
    ".comments-section",
    ".comment-form",
    ".related-posts",
    ".social-share",
    ".newsletter-signup",
    ".floating-nav",
    ".mobile-nav",
    ".theme-toggle",
    ".accessibility-controller",
    ".back-to-top",
    ".bookmark-button",
    "[aria-label*='bookmark']",
    "[aria-label*='PDF']",
    ".print-button",
  ];

  uiSelectors.forEach((selector) => {
    const elements = clone.querySelectorAll(selector);
    elements.forEach((el) => el.remove());
  });

  // 3. Remove script tags and inline event handlers
  const scripts = clone.querySelectorAll("script");
  scripts.forEach((s) => s.remove());

  const allElements = clone.querySelectorAll("*");
  allElements.forEach((el) => {
    const attributes = el.attributes;
    for (let i = attributes.length - 1; i >= 0; i--) {
      const attr = attributes[i];
      if (attr.name.startsWith("on")) {
        el.removeAttribute(attr.name);
      }
    }
  });

  // 4. Remove style tags (except those that might be needed for layout)
  const styles = clone.querySelectorAll("style");
  styles.forEach((s) => s.remove());

  // 5. Handle iframes: replace with text placeholder
  const iframes = clone.querySelectorAll("iframe");
  iframes.forEach((iframe) => {
    const src = iframe.getAttribute("src") || "unknown source";
    const placeholder = document.createElement("div");
    placeholder.className = "iframe-placeholder p-4 border border-dashed border-gray-300 my-4 text-center text-sm italic";
    placeholder.textContent = `Embedded content from: ${src}`;
    iframe.parentNode?.replaceChild(placeholder, iframe);
  });

  // 6. Remove hidden elements
  const allClonedElements = Array.from(clone.querySelectorAll("*")) as HTMLElement[];
  allClonedElements.forEach((el) => {
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden" || el.hasAttribute("hidden")) {
      el.remove();
    }
  });

  // 7. Cleanup: remove empty paragraphs or divs resulting from removals
  const cleanUpEmpty = () => {
    let found = false;
    const targets = clone.querySelectorAll("p, div");
    targets.forEach((el) => {
      if (el.children.length === 0 && !el.textContent?.trim()) {
        el.remove();
        found = true;
      }
    });
    return found;
  };

  // Run cleanup a couple of times to handle nested empties
  while (cleanUpEmpty()) {
    // Continue cleaning
  }

  return clone;
}

/**
 * Validates if the cleaned content has any meaningful text.
 */
export function validateContent(element: HTMLElement): boolean {
  const text = element.textContent?.trim();
  // Check if there's more than just a few characters of text
  return !!text && text.length > 50;
}
