/**
 * Injects anchor IDs into heading tags (h2, h3, h4) for Table of Contents.
 * 
 * @param html The HTML string to process
 * @returns HTML string with IDs injected into headings
 */
export function injectHeadingIds(html: string): string {
  return html.replace(
    /<h([2-4])([^>]*)>(.*?)<\/h\1\s*>/gi,
    (match, level, attrs, text) => {
      if (attrs.toLowerCase().includes("id=")) return match;
      let cleanText = text;
      while (/<[^>]*>/g.test(cleanText)) {
        cleanText = cleanText.replace(/<[^>]*>/g, "");
      }
      const id = cleanText
        .toLowerCase()
        .replace(/[^\w]+/g, "-")
        .replace(/^-+|-+$/g, "");
      return `<h${level}${attrs} id="${id}">${text}</h${level}>`;
    },
  );
}

/**
 * Injects interactive quiz placeholders into the HTML.
 * Parses [quiz] JSON blocks and encodes them for client-side hydration.
 * 
 * @param html The HTML string to process
 * @returns HTML string with quiz placeholders
 */
export function injectQuiz(html: string): string {
  const placeholders: string[] = [];
  // Protect pre/code blocks from quiz regex to avoid accidental matches inside code
  const protectedHtml = html.replace(/<(pre|code)[\s\S]*?<\/\1\s*>/gi, (match) => {
    placeholders.push(match);
    return `__QUIZ_PROTECTED_BLOCK_${placeholders.length - 1}__`;
  });

  const injectedHtml = protectedHtml.replace(
    /\[quiz\]([\s\S]*?)\[\/quiz\]/g,
    (match, jsonContent) => {
      try {
        let cleanJson = jsonContent;
        while (/<[^>]*>/g.test(cleanJson)) {
          cleanJson = cleanJson.replace(/<[^>]*>/g, "");
        }
        cleanJson = cleanJson.trim();
        cleanJson = cleanJson.replace(/[\r\n\t]+/g, " ");
        
        // Escape backslashes while preserving valid JSON escape sequences
        // This handles edge cases where quiz JSON contains escaped characters
        cleanJson = cleanJson.replace(
          /\\(["\\\/bfnrt]|u[0-9a-fA-F]{4})|\\/g,
          (match: string, p1: string) => (p1 ? match : "\\\\"),
        );

        const minifiedJson = JSON.stringify(JSON.parse(cleanJson));
        const encodedJson = minifiedJson.replace(/'/g, "&apos;");
        return `<div class="interactive-quiz-placeholder" data-quiz='${encodedJson}'></div>`;
      } catch (e) {
        console.error(
          "Quiz HTML inject parse error:",
          e,
          "\nContent:",
          jsonContent,
        );
        return `<div class="bg-red-500/10 border border-red-500 p-4 rounded-lg text-red-500 my-4">
        <p><strong>Quiz Error:</strong> Invalid JSON format.</p>
        <pre class="text-[10px] mt-2 overflow-auto">${jsonContent.substring(0, 100)}...</pre>
      </div>`;
      }
    },
  );

  return injectedHtml.replace(
    /__QUIZ_PROTECTED_BLOCK_(\d+)__/g,
    (match, index) => {
      return placeholders[parseInt(index)];
    },
  );
}

/**
 * Transforms GitHub-style alerts (e.g., [!NOTE]) into styled HTML callouts.
 * 
 * @param html The HTML string to process
 * @returns HTML string with styled alert boxes
 */
export function injectAlerts(html: string): string {
  const alertTypes = {
    NOTE: { color: "blue" },
    TIP: { color: "green" },
    IMPORTANT: { color: "purple" },
    WARNING: { color: "yellow" },
    CAUTION: { color: "red" },
  };

  return html.replace(
    /<blockquote[^>]*>\s*<p[^>]*>\s*\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]\s*(?:<\/p>|<br\/?>)?([\s\S]*?)<\/blockquote>/gi,
    (match, type, content) => {
      const upperType = type.toUpperCase() as keyof typeof alertTypes;
      const config = alertTypes[upperType];

      const colors: Record<string, string> = {
        blue: "border-blue-500 bg-blue-500/10 text-blue-700 dark:text-blue-400",
        green:
          "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
        purple:
          "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-400",
        yellow:
          "border-yellow-500 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
        red: "border-red-500 bg-red-500/10 text-red-700 dark:text-red-400",
      };

      return `<div class="my-6 border-l-4 p-4 rounded-r-lg ${colors[config.color] || colors.blue}">
      <p class="flex items-center gap-2 font-bold mb-2 uppercase text-xs tracking-widest">
        <span class="opacity-80">${upperType}</span>
      </p>
      <div class="prose-direct text-sm leading-relaxed">${content.trim()}</div>
    </div>`;
    },
  );
}

/**
 * Sanitizes HTML content by removing potentially dangerous script tags, 
 * while preserving safe ones like GitHub Gists.
 * 
 * @param html The HTML string to sanitize
 * @returns Sanitized HTML string
 */
export function sanitizeContent(html: string): string {
  const gists: string[] = [];
  // First pass: identify and protect valid GitHub Gists
  let processedHtml = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gim, (match) => {
    const srcMatch = match.match(/src=["']([^"']+)["']/i);
    if (srcMatch) {
      try {
        const url = new URL(srcMatch[1]);
        if (url.hostname === "gist.github.com") {
          gists.push(match);
          return `__GIST_PLACEHOLDER_${gists.length - 1}__`;
        }
      } catch {
        // Invalid URL in src
      }
    }
    return "";
  });

  // Second pass: aggressively remove any remaining script tags, including nested ones
  let prevHtml;
  do {
    prevHtml = processedHtml;
    processedHtml = processedHtml.replace(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gim, "");
  } while (processedHtml !== prevHtml);

  // Restore the protected Gists
  return processedHtml.replace(/__GIST_PLACEHOLDER_(\d+)__/g, (match, index) => {
    return gists[parseInt(index)];
  });
}
