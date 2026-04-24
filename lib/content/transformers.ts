/**
 * Strips HTML tags from a string using a simple state machine.
 * Completely avoids ReDoS vulnerabilities flagged by CodeQL.
 * Used for cleaning text before generating IDs or parsing JSON.
 */
function stripTags(html: string): string {
  if (typeof html !== "string") return "";
  
  let result = "";
  let inTag = false;
  
  for (let i = 0; i < html.length; i++) {
    const char = html[i];
    if (char === "<" && !inTag) {
      inTag = true;
    } else if (char === ">" && inTag) {
      inTag = false;
      continue;
    } else if (!inTag) {
      result += char;
    }
  }
  return result.trim();
}

/**
 * Injects anchor IDs into heading tags (h2, h3, h4) for Table of Contents.
 */
export function injectHeadingIds(html: string): string {
  return html.replace(
    /<h([2-4])([^>]*)>(.*?)<\/h\1\s*>/gi,
    (match, level, attrs, text) => {
      if (attrs.toLowerCase().includes("id=")) return match;
      
      // Use safe stripTags instead of vulnerable while + regex loop
      const cleanText = stripTags(text);
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
 */
export function injectQuiz(html: string): string {
  const placeholders: string[] = [];
  // Protect pre/code blocks from quiz regex
  const protectedHtml = html.replace(/<(pre|code)[\s\S]*?<\/\1\s*>/gi, (match) => {
    placeholders.push(match);
    return `__QUIZ_PROTECTED_BLOCK_${placeholders.length - 1}__`;
  });

  const injectedHtml = protectedHtml.replace(
    /\[quiz\]([\s\S]*?)\[\/quiz\]/g,
    (match, jsonContent) => {
      try {
        // Use safe stripTags instead of vulnerable while loop
        let cleanJson = stripTags(jsonContent);
        cleanJson = cleanJson.trim();
        cleanJson = cleanJson.replace(/[\r\n\t]+/g, " ");
        
        // Escape backslashes while preserving valid JSON escape sequences
        cleanJson = cleanJson.replace(
          /\\(["\\\/bfnrt]|u[0-9a-fA-F]{4})|\\/g,
          (m: string, p1: string) => (p1 ? m : "\\\\"),
        );

        const minifiedJson = JSON.stringify(JSON.parse(cleanJson));
        const encodedJson = minifiedJson.replace(/'/g, "&apos;");
        return `<div class="interactive-quiz-placeholder" data-quiz='${encodedJson}'></div>`;
      } catch (e) {
        console.error("Quiz HTML inject parse error:", e, "\nContent:", jsonContent);
        return `<div class="bg-red-500/10 border border-red-500 p-4 rounded-lg text-red-500 my-4">
        <p><strong>Quiz Error:</strong> Invalid JSON format.</p>
        <pre class="text-[10px] mt-2 overflow-auto">${jsonContent.substring(0, 100)}...</pre>
      </div>`;
      }
    },
  );

  return injectedHtml.replace(
    /__QUIZ_PROTECTED_BLOCK_(\d+)__/g,
    (match, index) => placeholders[parseInt(index)] ?? ""
  );
}

/**
 * Transforms GitHub-style alerts into styled HTML callouts.
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
        green: "border-green-500 bg-green-500/10 text-green-700 dark:text-green-400",
        purple: "border-purple-500 bg-purple-500/10 text-purple-700 dark:text-purple-400",
        yellow: "border-yellow-500 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400",
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
 * Sanitizes HTML content by removing dangerous script/style tags while preserving GitHub Gists.
 * Addresses CodeQL "Bad HTML filtering regexp" and "Incomplete multi-character sanitization".
 */
export function sanitizeContent(html: string): string {
  if (typeof html !== "string") return "";

  const gists: string[] = [];
  
  // First pass: Protect valid GitHub Gists
  let processedHtml = html.replace(
    /<script\b[^>]*>([\s\S]*?)<\/script\s*>/gim,
    (match) => {
      const srcMatch = match.match(/src=["']([^"']+)["']/i);
      if (srcMatch?.[1]) {
        try {
          const url = new URL(
            srcMatch[1].startsWith("//") ? "https:" + srcMatch[1] : srcMatch[1]
          );
          if (url.hostname === "gist.github.com" || url.hostname.endsWith(".github.com")) {
            gists.push(match);
            return `__GIST_PLACEHOLDER_${gists.length - 1}__`;
          }
        } catch {
          // Invalid URL
        }
      }
      return match; // Will be removed in next pass if not a gist
    }
  );

  // Aggressively remove script and style tags with improved regex
  // This pattern is more robust against variations of </script> tags
  const dangerousTagRegex = /<(script|style)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
  processedHtml = processedHtml.replace(dangerousTagRegex, "");

  // Final safety pass: encode any remaining "<script" fragments that might have survived
  // This directly addresses the "incomplete multi-character sanitization" warning
  processedHtml = processedHtml
    .replace(/<script/gi, "&lt;script")
    .replace(/<\/script/gi, "&lt;/script");

  // Restore protected Gists
  return processedHtml.replace(
    /__GIST_PLACEHOLDER_(\d+)__/g,
    (_, index) => gists[parseInt(index)] ?? ""
  );
}