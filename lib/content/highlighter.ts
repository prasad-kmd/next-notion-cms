import { createHighlighter, type Highlighter } from "shiki";

let highlighter: Highlighter | null = null;

/**
 * Gets or initializes the Shiki highlighter.
 * Implementation of lazy loading languages.
 */
export async function getHighlighter() {
  if (!highlighter) {
    highlighter = await createHighlighter({
      themes: ["one-dark-pro"],
      langs: [], // Start empty for lazy loading
    });
  }
  return highlighter;
}

/**
 * Highlights a code block using Shiki.
 * Loads the language dynamically if not already loaded.
 */
export async function highlightCode(code: string, lang: string): Promise<string> {
  const sh = await getHighlighter();
  
  // Normalize language name
  const normalizedLang = lang.toLowerCase();
  
  // Ensure language is loaded
  if (normalizedLang !== 'text' && !sh.getLoadedLanguages().includes(normalizedLang)) {
    try {
      await sh.loadLanguage(normalizedLang as any);
    } catch (e) {
      console.warn(`Failed to load Shiki language: ${normalizedLang}, falling back to text.`);
      lang = 'text';
    }
  }

  return sh.codeToHtml(code.trim(), {
    lang: normalizedLang,
    theme: "one-dark-pro",
    transformers: [
      {
        line(node: any, line: number) {
          node.properties.class = (node.properties.class || "") + " line";
          node.properties["data-line"] = line;
        },
      },
    ],
  });
}
